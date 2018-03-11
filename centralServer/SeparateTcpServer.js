import * from '../lib/customError';

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

let connetoSocketHandler = {
	
	/**
	 * @callback
 	 * @description establish settings & register event handlers for socket when Conneto is connected
 	 * @param {Socket} socketForConneto- socket used for communicating with Conneto client 
 	 * @param {Socket} sokcetForWebServer- socket used for communicati
 	 */
	connection: (socketForConneto, socketForWebServer)=>{
		console.log('Server has a new Conneto client connection: ' + socketForConneto.remotePort);
		socketForConneto.on('close', connetoSocketHandler.close);
		socketForConneto.on('error', connetoSocketHandler.error);
		socketForConneto.on('data', (data)=>{
			connetoSocketHandler.data(data, socketForConneto, socketForWebServer);	
		})
	},

	/**
	 * @callback
	 * @description handler for closed connection
	 * @param {Socket} socketForConneto - socket used for communication with Conneto client  
	 */
	close: (socketForConneto)=>{
		console.log('Conneto client connection is closed: ' + socketForConneto.remotePort);		
	},

	/**
	 * @callback
	 * @description handler for error during communication
	 * @param {Error} err - Error Object specifying error
	 * @param {Socket} socketForConneto - socket used for communicating with Conneto client
 	 */
	error: (err, socketForConneto)=>{
		console.log("err occured in connection with Conneto client: " + socketForConneto.remotePort + err);		
	},
	
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
	 * @param {JSON} data- data from Conneto, it is JSON string, so it needs to be converted to object by JSON.parse
	 * 							   @see {@link https://www.w3schools.com/Js/js_json_parse.asp}
	 * 
	//
	// ─── ESSENTIAL FIELDS ──────────────────────────────────────────────
	//			
	 * 		@property {string} data.header.type - sort of the message: Request or Response
	 * 		@property {string} data.header.token - token used for authentication
	 *  	@property {string} data.header.command - purpose of this data, other fields change depending on this field  
	 *		@property {string} data.header.source - server which sent the  data: WEB or CONNETO
	 *		@property {string} data.header.dest - server which should receive the data: WEB or CONNETO
	 *		@property {string} data.body.userId - Id of the user for authenticaion, it exists in every cases.
	 * 		Other fields change according to the value of the command 
	 * 		@todo diversify statusCode and sort responses according to the criteria 
 	//
 	// ───  ───────────────────────────────────────────────────────────────────────────
	//
	 * 		@property {number} data.header.statusCode - it only exists in response message: 200: Success, 400: Failure for now
	 * 	
	 * 		isAccount: @description used for authentication of the conneto
	 * 								centralServer will send result to the conneto
	 * 				   @property {string} data.body.userPW- password of the user
	 * 
	 * 		getHostsResult: @description it is reply to the request from web server(getHosts)
	 * 							   @property {HostInfo[]} data.body.list- Array that contains information of conneto's connected hosts
	 * 							   @see {@link @HostInfo}
	 * 
	 *  	addHostResult: @description it is reply to the request from web server(addHost)
	 * 							  @property {string} data.body.hostId- Id of the added host
	 * 							  @property {string} data.body.hostname- name of the added host
	 * 							  @property {boolean} data.body.online- online status of the added host
	 * 							  @property {boolean} data.body.paired- pairing status of the added host
	 * 							  @property {number} data.body.error- if this field exists, means failed to add new host 
	 * 
	 * 		getAppsResult: @description it is reply to the request from web server(getApps)
	 * 							  @property {string} data.body..hostId- Id of the chosen host
	 * 							  @property {string} data.body.hostname- name of the chosen host
	 * 							  @property {AppInfo[]} data.body.ppList- List of apps(games) the host has @see {@link @AppInfo}
	 * 
	 *      startGameResult: @description it is reply to the request from web server(startGame)
	 * 								@property {string} data.body.hostId- Id of the host
	 * 								@property {string} data.body.appId- Id of the app(game) webserver wanted to start
	 * 		
	 * 		networkTest: @description when central server receives this request, it sends networkTest_ request to web server  
	 * 				     @todo it's not stable version, it needs modification
	 */
	data: (message, socketForConneto, socketForWebServer)=>{
		try {
			message = JSON.parse(message);
			isValidHeader(message.header);
		}
		catch (e) {
			message.header.statusCode = 400;
			message.body.error = e;
			return exports.sendMsg(socketForWebServer, message);
		}

		if (message.header.dest === "WEB") {
			exports.sendMsg(socketForWebServer, message);
		}
		else {
			if (message.header.command === "login") {
				let msg = {
					header: {
						type: 'Response',
						token: '',
						command: 'login',
						source: 'DB',
						dest: 'CONNETO'
					},
					body: {
						userId: message.body.userId
					}
				}
				exports.isRegisteredUser(message.body.userId, message.body.userPW)
					.then((userId) => {
						msg.header.statusCode = 200;
						/**
						 * @callback
						 * @description when successfully logined, send approval message to Conneto socket
						 */
						socketForConneto.write(JSON.stringify({
						

						}), function (err) {
							if (err) {
								console.log("There's error while sending loginApproval to Conneto");
								throw new SocketError();
							}
							else {
								exports.saveConnetoSocket(userId, socketForConneto);

								/**
								 * @callback 
								 * @description when socket is closed, delete stored socket information
								 */
								socketForConneto.on('close', function () {
									console.log("Connection closed: " + userId);
									exports.deleteConnetoSocket(userId, socketForConneto);
								});
							}
						})
					}).catch((error) => {
						msg.header.statusCode = 400;
						msg.body.error = error;
						//console.log(error);
						/**
						 * @callback 
						 * @description when failed to login, send failure message to Conneto socket   
						 */
						socketForConneto.write(JSON.stringify(msg), function (err) {
							if (err) {
								console.log("There's error while sending loginApproval to Conneto");
							}
						});
					})
			}
		}
	}	
}

serverForConneto.on('connection', function(connetoSocket){
	connetoSocketHandler.connection(connetoSocket, socketForWebServer);
});
serverForConneto.on('error', function(err){
	console.log('error on serverForConneto: ' + err);
});
serverForConneto.listen(portForConneto, 'localhost');

let webServerSocketHandler = {
	/**
	 * @callback
 	 * @description establish settings & register event handlers for socket when Conneto is connected
 	 * @param {Socket} socket- socket used for communicating with web server 
 	 */
	connection:	(socket)=>{
		//console.log("Server has a Webserver connection: " + socket.remotePort);
		socketForWebServer = socket;
		socket.on('close', webServerSocketHandler.close);
		socket.on('error', webServerSocketHandler.error);
		socket.on('data', (data)=>{	
			webServerSocketHandler.data(socketForWebServer, data);
		})
	},

	/**
	 * @callback
	 * @description handler for closed connection of web server
	 */
	close: ()=>{
		console.log("Webserver connection has disconnected");
	},
	
	/**
	 * @callback
	 * @description handler for error during communication
	 * @param {Error} err - Error Object specifying error
 	 */
	error: (err)=>{ 
		console.log("error occured in Webserver socket connection: " + err);		
	},
	
	/**
	 * @callback 
	 * @description handler for data from web-server
	 * @param {JSON} data - data from web-server; it is JSON string, needs to be converted to Object by JSON.parse
	 * @see {@link https://www.w3schools.com/Js/js_json_parse.asp}
	 * 		
	//
	// ─── ESSENTIAL FIELDS ──────────────────────────────────────────────
	//
	 * 		@property {string} data.header.type - sort of the message: Request or Response
	 * 		@property {string} data.header.token - token used for authentication
	 *  	@property {string} data.header.command - purpose of this data, other fields change depending on this field
	 *		@property {string} data.header.source - server which sent the  data: WEB or CONNETO
	 *		@property {string} data.header.dest - server which should receive the data: WEB or CONNETO
	 *		@property {string} data.body.userId - Id of the user for authenticaion, it exists in every cases.
	 * 		Other fields change according to the value of the command
	 * 		@todo diversify statusCode and sort responses according to the criteria
	//
 	// ───  ───────────────────────────────────────────────────────────────────────────
	//
	 * 		@property {number} data.header.statusCode - it only exists in response message: 200: Success, 400: Failure for now
	 * 
	 * 		getStatus: @description used for getting current status of the user's CONNETO client: online or offline
	 * 								no addtional property
	 * 		
	 *		getHosts: @description used for getting connected(paired) hosts of the CONNETO
	 *				  			   no additional property
	 *
	 *		getApps: @description used for getting available(executable) apps from the selected host
	 *							   no additional property
	 *		
	 *		addHost: @description used for adding a new host to the CONNETO client
	 *				 	@property {string} data.body.hostIpaddress - ip address of the host user want to add to their CONNETO					   	     	 			    
	 * 					@property {string} data.body.pairingNum - random number used for pairing with host, \[0-9]{4}\ ex)"3847"
	 * 		
	 * 		startGame: @description used for starting chosen game of the chosen host with the CONNETO client
	 * 				       @property {string} data.body.hostId - unique id of the host user want to start the game of
	 * 					   @property {string} data.body.appId - unique id of the game user want to start
	 * 				       @property {Object} data.body.option - option for starting game
	 * 					       @property {string} data.body.option.frameRate - frameRate of the remote control subscribtion
	 * 					       @property {string} data.body.option.streamWidth - width of the remote control subscribtion
	 * 					       @property {string} data.body.option.streamHeight - height of the remote control subscribtion
	 * 					       @property {string} data.body.option.remote_audio_enabled - whether the sound during remote control will be enabled
	 * 					       @property {string} data.body.option.bitrate - bitrate of the remote control subscribtion
	 */
	data: (message, socketForWebServer)=>{
		try{
			message = JSON.parse(message);
			isValidHeader(message.header);
		}
		catch(e){
			message.header.statusCode = 400;
			message.body.error = e;
			return exports.sendMsg(socketForWebServer, message);
		}
		var userId = message.body.userId;
		exports.getConnetoSocket(message.body.userId).then((socketForConneto) => {
			if (!socketForConneto) {
				console.log("Conneto of " + userId + " is offline");
				return exports.sendMsg(socketForWebServer, { error: 1, status: false });
			}
			//console.log(data.command);
			if (message.header.dest === 'CONNETO') {
				exports.sendMsg(socketForConneto, message)
				switch (message.header.command) {

					case "networkTest":
						console.log("request from " + userId + ": networkTest");
						exports.sendMsg(socketForConneto, {
							command: "networkTest", 
							userId, 
							ip: message.body.data.client.ip, 
							latency: message.body.data.server.ping, 
							download: message.body.data.speeds.download 
						});
						break;

					default:
						console.log("Invalid command from WebServer");
						exports.sendMsg(socketForWebServer, { error: 2, status: false });
				}
			}
			else{
				if(message.header.command === 'getStatus'){
					console.log('request from ' + userId + ": checking Conneto status");
					getConnetoSocket(userId).then((connetoSocket)=>{
						if(connetoSocket){
							exports.sendMsg(connetoSocket, {
								command: "getStatusResult",
								userId
							})
						}
						else{
							console.log("this user's conneto is offline");
						}
					})
				}
			}
		}).catch((err) => {
			return exports.sendMsg(socketForWebServer, { error: 3, status: false });
			console.log("Something broken while getting Conneto Socket from db: " + err);
		})
	}	
}

serverForWebServer.on('connection', webServerSocketHandler.connection);
serverForWebServer.on('error', function(err){
	console.log('error on portForWebServer: ' + err);
});


/**
 * @author SSH
 * @description Used for sending msg to the socket you want
 * @param {Socket} socket - the socket you want to write message through
 * @param {Object} msg - the message you want to send to the socket
 * @returns {Promise} Promise object for sending Msg 
 * @promise
 * @resolve {string} command field of the message  
 * @reject {Error}
 */
function sendMsg(socket, msg){
	return new Promise((resolve, reject)=>{
		socket.write(JSON.stringify(msg), function(err){
			if(err){
				reject(err);
			}
			else{
				resolve();
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

function saveConnetoSocket(userId, socket){
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
 * @reject {string} "Invalid user: failing to delete Conneto socket"
 * @todo DB would handle this part 
 */
function deleteConnetoSocket(userId){		
	return new Promise((resolve, reject)=>{
		if(clients[userId]){
			delete clients[userId];
			resolve(userId);
		}
		else{
			reject("Invalid user: failing to delete Conneto socket")
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
 * @reject  {Boolean} "Invalid user: failing to get Conneto socket"
 * @todo DB would handle this part in near future
 */
function getConnetoSocket(userId){
	return new Promise((resolve, reject)=>{
		//COMMENTED PART IS THE VERSION USING DB, BUT I COULDN'T FOUND THE WAY OF STORING SOCKET OBJECT INTO THE FORM DB CAN ACCEPT
		//BECAUSE SOCKET OBJECT IS CIRCULAR, AND HAVE METHOD. SO IT MAKES REALLY HARD TO CONVERT IT INTO STRING..

		if(clients[userId]){
			resolve(clients[userId]);	
		}
		else{
			resolve();
		}
	})
}

/**
 * @description check whether the message is valid
 * @param {Object} msg - message you want to check its validation 
 */
function isValidMessage(msg){
	return isValidHeader(msg.header);
}

/**
 * 
 * @param {Object} header - the header field of the message you want to check its validation 
 * @return {boolean} whether the header is valid
 * @throws {InvalidFormatError} throws it when essential field of header is blank
 * @throws {TokenError} throws it when token is unvalid
 */
function isValidHeader(header){
	if(!checkEssentialFields(header)){
		let error = new InvalidFormatError();
		error.code = 'ERR_BLANK_ESSENTIAL_FIELD';
		throw error;
	}
	if(!isValidCommand(header.command) 
		|| (header.type!=='Request' && header.type!=='Response')
		|| (header.source!=='WEB' && header.source!=='CONNETO' && header.source!=='DB')
		|| (header.dest!== 'WEB' &&header.dest!=="CONNETO" && header.dest!=='DB')
	){
		let error = new InvalidFormatError();
		error.code = 'ERR_INVALID_VALUE'
		throw error;
	}
	else if(!isValidToken(token, user)){
		let error = new TokenError();
		error.code = "ERR_INVALID_TOKEN"
		throw error;
	}
	return true;
}

/**
 * @description check whetehr the command of the message is valid
 * @param {string} command - command you want to check 
 * @return {boolean} whether the command is valid
 */
function isValidCommand(command){
	let validCommands = ['getStatus', 'getHosts', 'getApps', 'addHost', 'startGame', 'networkTest']
	return validCommands.includes(command);
}

/**
 * @description check whether any essential field of the header is blank 
 * @param {Object} header - header you want to check
 * @return {boolean} whether the header has all essential values
 */
function checkEssentialFields(header){
	return (!header.type || !header.token || !header.command || !header.source || !header.dest || (header.type === 'Response' && !header.statusCode))	
}
 

/**
 * 
 * @param {string} token
 * @description it returns true if token is valid, otherwise return false 
 * @todo not implemented yet
 * @return {boolean} whether the token is valid
 */
function isValidToken(token){
	return true;
}

serverForWebServer.listen(portForWebServer, 'localhost');

exports.connetoSocketHandler = connetoSocketHandler;
exports.webServerSocketHandler = webServerSocketHandler;
exports.sendMsg = sendMsg;
exports.isRegisteredUser = isRegisteredUser;
exports.saveConnetoSocket = saveConnetoSocket;
exports.deleteConnetoSocket = deleteConnetoSocket;
exports.getConnetoSocket = getConnetoSocket;
module.exports = exports;