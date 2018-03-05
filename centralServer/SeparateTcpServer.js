/**
 * @file independent central tcp server communicating with Conneto & react-web-server
 * it manages overall dataflow and communiction between Conneto & react-web-server 
 * without any other specification, all of this file are written by SSH
 * @author SSH
 * @see {@link https://nodejs.org/api/net.html} for nodejs net API
 * @todo making error handler, crypto communication
 */
'use strict'

const net = require('net'),
	orientDB = require('orientjs'),
	portForConneto= 4001,
	portForWebServer= 4002;
const server =  orientDB({
	host: "localhost",
	port: 2424,
	username: 'root',
	password: 'ssh2159'
});
const db = server.use('usersinfo');



var clients = {}; //TODO: Change this part to using db later				  
var serverForConneto = net.createServer();  //For Many Conneto clients 
var serverForWebServer = net.createServer();  //For only one Web server
var socketForWebServer;

/**
 * @callback
 * @description establish settings & register event handlers for socket when Conneto is connected
 * @param {Socket} socketForConneto - socket used for communicating with Conneto client 
 */

function connetoConnectionHandler(socketForConneto) {
	console.log('Server has a new Conneto client connection: ' + socketForConneto.remotePort);

	/**
	 * @callback 
	 * @description handler for closed connection
	 */
	socketForConneto.on('close', function () {
		console.log('Conneto client connection is closed: ' + socketForConneto.remotePort);
	});

	/**
	 * @callback
	 * @description handler for error during communication
	 * @param {Error} err - Error Object specifying error
	 */
	socketForConneto.on('error', function (err) {
		console.log("err occured in connection with Conneto client: " + socketForConneto.remotePort + err);
	})

	/**
	 * @typedef {Object} HostInfo
	 * 		@property {string} hostId - unique identifier of conneto host (given by conneto client)
	 * 		@property {string} hostname - name of the conneto host
	 * 		@property {boolean} online - whether the host is online
	 * 		@property {boolean} paired - whether the host is paired (paired means ready for remote-control)
	 * @typedef {Object} AppInfo
	 * 		@property {string} id - unique id of the game (given by conneto client)
	 * 		@property {string} title - name of the game
	 */
	

	/**
	 * @callback 
	 * @description handler for processing data from Conneto; it register necessary handlers;
	 * 				it just transfer the data to react_web_server as it is
	 * @param {string(JSON)} data- data from Conneto, it is JSON string, so it needs to be converted to object by JSON.parse
	 * 							   @see {@link https://www.w3schools.com/Js/js_json_parse.asp}
	 * 
	//
	// ─── ESSENTIAL FIELDS ──────────────────────────────────────────────
	//			
	 *  	@property {string} data.command - purpose of this data, other fields change depending on this field  
	 *		@property {string} data.userId - Id of the user for authenticaion, it exists in every cases.
	 *		@property {string} data.source - server which sent the  data: WEB or CONNETO
	 *		@property {string} data.dest - server which should receive the data: WEB or CONNETO
	 * 		Other fields change according to the value of the command 
 	//
 	// ───  ───────────────────────────────────────────────────────────────────────────
	//
	 	
	 * 		isAccount: @description used for authentication of the conneto
	 * 								centralServer will send result to the conneto
	 * 				   @property {string} data.userPW - password of the user
	 * 
	 * 		getHostsResult: @description it is reply to the request from web server(getHosts)
	 * 							   @property {HostInfo[]} data.list - Array that contains information of conneto's connected hosts
	 * 							   @see {@link @HostInfo}
	 * 
	 *  	addHostResult: @description it is reply to the request from web server(addHost)
	 * 							  @property {string} data.hostId - Id of the added host
	 * 							  @property {string} data.hostname - name of the added host
	 * 							  @property {boolean} data.online - online status of the added host
	 * 							  @property {boolean} data.paired - pairing status of the added host
	 * 							  @property {number} data.error - if this field exists, means failed to add new host 
	 * 
	 * 		getAppsResult: @description it is reply to the request from web server(getApps)
	 * 							  @property {string} data.hostId - Id of the chosen host
	 * 							  @property {string} data.hostname - name of the chosen host
	 * 							  @property {AppInfo[]} data.appList - List of apps(games) the host has @see {@link @AppInfo}
	 * 
	 *      startGameResult: @description it is reply to the request from web server(startGame)
	 * 								@property {string} data.hostId - Id of the host
	 * 								@property {string} data.appId - Id of the app(game) webserver wanted to start
	 * 		
	 * 		networkTest: @description when central server receives this request, it sends networkTest_ request to web server  
	 * 				     @todo it's not stable version, it needs modification
	 */
	socketForConneto.on('data', function (data) {
		data = JSON.parse(data);
		console.log("new msg received: " + JSON.stringify(data));
		if (data.dest === "WEB") {
			sendMsg(socketForWebServer, data);
		}
		else {
			if (data.command === "isAccount") {
				isRegisteredUser(data.userId, data.userPW)
					.then((userId) => {
						/**
						 * @callback
						 * @description when successfully logined, send approval message to Conneto socket
						 */
						socketForConneto.write(JSON.stringify({ command: "loginApproval", isApproved: true, userId}), function (err) {
							if (err) {
								console.log("There's error while sending loginApproval to ML");
							}
							else {
								saveMLSocket(userId, socketForConneto);

								/**
								 * @callback 
								 * @description when socket is closed, delete stored socket information
								 */
								socketForConneto.on('close', function () {
									console.log("Connection closed: " + userId);
									deleteMLSocket(userId, socketForConneto);
								});
							}
						})
					}).catch((error)=>{
						console.log(error);
						/**
						 * @callback 
						 * @description when failed to login, send failure message to Conneto socket   
						 */
						socketForConneto.write(JSON.stringify({ command: "loginApproval", isApproved: false }), function (err) {
							if (err) {
								console.log("There's error while sending loginApproval to ML");
							}
						});
					})		
			}
			else if (data.command === "networkTest") {
				/**
				 @todo: get the network info from the web server and transmit it to the Conneto-client 
				 */
				socketForWebServer.write(JSON.stringify({ command: "networkTest_", userId: data.userId }, function () {

				}));
			}
			else {
				console.log("Invalid command!");
			}
		}
	})
}

serverForConneto.on('connection', connetoConnectionHandler);
serverForConneto.on('error', function(err){
	console.log('error on serverForConneto: ' + err);
});
serverForConneto.listen(portForConneto, 'localhost');

/**
 * @callback
 * @description establish settings & register event handlers for socket when web-server is connected
 * @param {Socket} socket - socket for communicating with web-server 
 */
serverForWebServer.on('connection', function(socket){
	console.log("Server has a Webserver connection: " + socket.remotePort);
	socketForWebServer = socket;
	socket.on('close', function(){
		console.log("Webserver connection has disconnected");
	});
	socket.on('error', function(err){
		console.log("error occured in Webserver socket connection: " + err);
	})
	
	/**
	 * @callback 
	 * @description handler for data from web-server
	 * @param {string(JSON)} data - data from web-server; it is JSON string, needs to be converted to Object by JSON.parse
	 * 								@see {@link https://www.w3schools.com/Js/js_json_parse.asp}
	 * 		
	//
	// ─── ESSENTIAL FIELDS ──────────────────────────────────────────────
	//
	 *  	@property {string} data.command - purpose of this data, other fields change depending on this field
	 *		@property {string} data.userId - Id of the user for authenticaion, it exists in every cases.
	 *		@property {string} data.source - server which sent the  data: WEB or CONNETO
	 *		@property {string} data.dest - server which should receive the data: WEB or CONNETO or even nothing(when it just needs to pass centralServer)
	 *		Other fields change according to the value of the command
	//
 	// ───  ───────────────────────────────────────────────────────────────────────────
	//
	 * 		checkStatus: @description used for getting current status of  the user's CONNETO client: online or offline
	 * 								no addtional property
	 * 		
	 *		getHosts: @description used for getting connected(paired) hosts of the CONNETO
	 *				  			   no additional property
	 *
	 *		getApps: @description used for getting available(executable) apps from the selected host
	 *							   no additional property
	 *		
	 *		addHost: @description used for adding a new host to the CONNETO client
	 *				 	@property {string} data.hostIpaddress - ip address of the host user want to add to their CONNETO					   	     	 			    
	 * 					@property {string} data.pairingNum - random number used for pairing with host, \[0-9]{4}\ ex)"3847"
	 * 		
	 * 		startGame: @description used for starting chosen game of the chosen host with the CONNETO client
	 * 				       @property {string} data.hostId - unique id of the host user want to start the game of
	 * 					   @property {string} data.appId - unique id of the game user want to start
	 * 				       @property {Object} data.option - option for starting game
	 * 					       @property {string} data.option.frameRate - frameRate of the remote control subscribtion
	 * 					       @property {string} data.option.streamWidth - width of the remote control subscribtion
	 * 					       @property {string} data.option.streamHeight - height of the remote control subscribtion
	 * 					       @property {string} data.option.remote_audio_enabled - whether the sound during remote control will be enabled
	 * 					       @property {string} data.option.bitrate - bitrate of the remote control subscribtion
	 */						
	socket.on('data', function(data){
		data = JSON.parse(data);
		var userId = data.userId;
		getMLSocket(data.userId).then((socketForConneto)=>{
			if(!socketForConneto){
				console.log("ML of " + userId + " is offline");
				return sendMsg(socketForWebServer, {error: -1, status: false});
			}
			console.log(data.command);
			if(data.dest === 'CONNETO'){
				switch(data.command){

					case "getHosts":
						console.log('request from ' + userId + ": getting hosts");
						sendMsg(socketForConneto, {command: "getHosts", userId});
						break;

					case "addHost":
						console.log('request form ' + userId + ": adding hosts");
						sendMsg(socketForConneto, {command: "addHost", userId, hostIp: data.hostIpaddress, randomNumber: data.pairingNum});
						break;

					case "getApps":
						console.log('request from ' + userId  + ": getting apps");
						sendMsg(socketForConneto, {command: "getApps", userId, hostId: data.hostId});
						break;

					case "startGame":
						console.log('request from ' + userId + ": starting game");
						sendMsg(socketForConneto, {command: "startGame", userId, appId: data.appId, hostId: data.hostId, option: data.option});
						break;

					case "networkTest":
						console.log("request from " + userId + ": networkTest");
						data = data.data;
						sendMsg(socketForConneto, {command: "networkTest", userId, ip:data.client.ip, latency: data.server.ping, download: data.speeds.download});
						break;

					default:
						console.log("Invalid command from WebServer");
						break;
				}
			}
			else if(data.command == "checkStatus"){
				console.log('request from ' + userId + ": checking Conneto status");
				sendMsg(socketForWebServer, { command: "checkStatus", status: true, userId: userId});
			}		
		}).catch((err)=>{
			console.log("Something broken while getting ML Socket from db: " + err);
		})
		
		/*else if(data.command.slice(0, 4) === "AUTH"){
			switch(data.command){
				case "AUTH_signIn":
					if(isRegisteredUser(data.userID, data.userPW)){

					}
					else{

					}
			}
		}*/ //TODO: move the db operation stuff to central server
	})
})


/**
 * @author SSH
 * @description Used for sending msg to the socket you want
 * @param {Socket} socket - the socket you want to write message through
 * @param {Object} msg - the message you want to send to the socket
 * @returns {Promise} Promise object for sending Msg 
 * @promise
 * @resolve {string}  
 * @reject {Error}
 */
function sendMsg(socket, msg){
	return new Promise((resolve, reject)=>{
		socket.write(JSON.stringify(msg), function(err){
			if(err){
				reject(err);
			}
			else{
				resolve(msg.command);
			}
		});
	})
}

/**
 * Checking whether the user is registerd by checking id, password
 * @author SSH
 * @param {string} userId - Id of the user
 * @param {string} password - password of the user
 * @returns {Promise} Promise object represents whether user is valid
 * @promise Check whether the user account is registered by requesting to db
 * @resolve {string} userID equivalent to param userID 
 * @reject {Error} message contains why it fails 
 */
 function isRegisteredUser(userId, password){
	return new Promise((resolve, reject) => {
		db.query("SELECT * FROM USER WHERE id='" + userId + "'").then((exist) => {
			if (!exist[0]) {
				reject(new Error("Login failed: no such a id"));
			}

			else if (exist[0].password != password) {
				reject(new Error("Login failed: wrong password"));
			}

			else {
				console.log("Login Success!!: " + userId);
				resolve(userId);
			}
		})
	})
 }

/**
 * @author SSH
 * @description save the Conneto client socket information by matching it to userId 
 * @param {string} userId - userId of the owner of the Conneto 
 * @param {Socket} socket - Conneto socket
 * @todo DB would handle this part
 * @return {Promise} save the client information and return userId to the next resolve
 * @promise 
 * @resolve {string} userId 
 */
function saveMLSocket(userId, socket){
	return Promise.resolve().then(
		()=>{
			clients[userId] = socket;
			return userId
		}
	)
}

/**
 * @description delete the Conneto client socket information, it is usually called when client is disconnected
 * @param {string} userId - userID of the owner of the Conneto
 * @return {Promise}  
 * @promise 
 * @resolve {string} userID
 * @reject {string} "Invalid user: failing to delete ML socket"
 * @todo DB would handle this part 
 */
function deleteMLSocket(userId){		
	return new Promise((resolve, reject)=>{
		if(clients[userId]){
			delete clients[userId];
			resolve(userId);
		}
		else{
			reject("Invalid user: failing to delete ML socket")
		}
	})
}

/**
 * @author SSH 
 * @description get Conneto socket of the user by userID
 * @param {string} userId - Id of the user
 * @return {Promise}
 * @promise
 * @resolve {Socket} the Conneto socket of the user
 * @reject  {Boolean} "Invalid user: failing to get ML socket"
 * @todo DB would handle this part in near future
 */
function getMLSocket(userId){
	return new Promise((resolve)=>{
		//COMMENTED PART IS THE VERSION USING DB, BUT I COULDN'T FOUND THE WAY OF STORING SOCKET OBJECT INTO THE FORM DB CAN ACCEPT
		//BECAUSE SOCKET OBJECT IS CIRCULAR, AND HAVE METHOD. SO IT MAKES REALLY HARD TO CONVERT IT INTO STRING..
		/*db.query("SELECT * FROM USER WHERE id='" + userId + "'").then(function(exist){
			if(exist[0].ML_login_status){
				resolve(circularJSON.parse(exist[0].ML_socket));
			}
			else{
				resolve(false);
			}
		}).catch(function(err){
			console.log("error occured while getting ML socket from db: " + err);
			resolve(false);
		})*/
		if(clients[userId]){
			resolve(clients[userId]);	
		}
		else{
			resolve("Invalid user: failing to get ML socket");
		}
	})
}

serverForWebServer.on('error', function(err){
	console.log('error on portForWebServer: ' + err);
});

serverForWebServer.listen(portForWebServer, 'localhost');
