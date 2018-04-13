'use strict';

var _CustomError = require('lib/CustomError');

/**
 * @file independent central tcp server communicating with Conneto & react-web-server
 * it manages overall dataflow and communiction between Conneto & react-web-server 
 * without any other specification, all of this file are written by SSH
 * @author SSH
 * @see {@link https://nodejs.org/api/net.html} for nodejs net API
 * @todo making error handler, crypto communication
 */
var net = require('net'),
    orientDB = require('orientjs'),
    portForConneto = 4001,
    portForWebServer = 4002;
var server = orientDB({
	host: "localhost",
	port: 2424,
	username: 'root',
	password: 'ssh2159'
});
var db = server.use('usersinfo');
var clients = {}; //TODO: Change this part to using db later				  
var hosts = {};
var serverForConneto = net.createServer(); //For Many Conneto clients 
var serverForWebServer = net.createServer(); //For only one Web server
var socketForWebServer;

var connetoSocketHandler = {

	/**
  * @callback
 	 * @description establish settings & register event handlers for socket when Conneto is connected
 	 * @param {Socket} socketForConneto- socket used for communicaton with Conneto client 
 	 * @param {Socket} sokcetForWebServer- socket used for communication with Web server
 	 */
	connection: function connection(socketForConneto, socketForWebServer) {
		console.log('Server has a new Conneto client connection: ' + socketForConneto.remotePort);
		socketForConneto.on('close', connetoSocketHandler.close);
		socketForConneto.on('error', connetoSocketHandler.error);
		socketForConneto.on('data', function (data) {
			connetoSocketHandler.data(data, socketForConneto, socketForWebServer);
		});
	},

	/**
  * @callback
  * @description handler for closed connection
  * @param {Socket} socketForConneto - socket used for communication with Conneto client  
  */
	close: function close(socketForConneto) {
		console.log('Conneto client connection is closed: ' + socketForConneto.remotePort);

		//exports.deleteConnetoSocket(socketForConneto);
		if (socketForConneto.userId) {
			queryClientInfo({
				action: 'update',
				clientId: socketForConneto.userId,
				online: false
			});
			queryClientInfo({
				action: 'select',
				clientId: socketForConneto.userId
			}).pairedHosts.forEach(function (host) {
				queryHostInfo({
					hostIpaddress: host.hostIpaddress,
					actionForPairedClients: 'delete',
					pairedClients: socketForConneto.userId
				});
			});
		}
	},

	/**
  * @callback
  * @description handler for error during communication
  * @param {Error} err - Error Object specifying error
  * @param {Socket} socketForConneto - socket used for communicating with Conneto client
 	 */
	error: function error(err, socketForConneto) {
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
	data: function data(message, socketForConneto, socketForWebServer) {
		try {
			message = JSON.parse(message);
			isValidHeader(message.header);
		} catch (e) {
			console.log(e);
			message.header.statusCode = 400;
			message.body.error = e;
			return exports.sendMsg(socketForConneto, message);
		}

		if (message.header.dest === 'WEB') {
			var hostIpaddress = message.body.hostIpaddress;
			var userId = message.body.userId;
			if (message.header.command === 'addHost' && message.header.statusCode === 200) {
				addConnetableClient(hostIpaddress, userId);
			}
			exports.sendMsg(socketForWebServer, message);
		} else if (message.header.dest === 'DB') {
			if (message.header.command === "login") {
				var msg = {
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
				};
				exports.isRegisteredUser(message.body.userId, message.body.userPW).then(function (userId) {

					if (!queryClientInfo({
						action: 'select',
						clientId: message.body.userId
					}).online) {
						queryClientInfo({
							action: 'update',
							clientId: message.body.userId,
							socket: socketForConneto,
							pairedHosts: message.body.hostList,
							online: true
						});
						socketForConneto.userId = message.body.userId;
					} else {
						throw new Error('Login duplicated, this user is already logined');
					}

					for (var host in message.body.hostList) {
						if (host.paired) {
							queryHostInfo({
								hostIpaddress: host.hostIpaddress,
								actionForPairedClients: 'add',
								pairedClients: message.body.userId,
								online: host.online
							});
						}
					}
					msg.header.statusCode = 200;

					/**
      * @callback
      * @description when successfully logined, send approval message to Conneto socket
      */
					socketForConneto.write(JSON.stringify(msg), function (err) {
						if (err) {
							throw new _CustomError.SocketError("there's error while sending loginApproval to Conneto");
						} else {
							console.log(socketForConneto.remotePort);
							//exports.saveConnetoSocket(userId, socketForConneto);
							queryClientInfo({
								action: 'update',
								clientId: userId,
								socket: socketForConneto
							});
						}
					});
				}).catch(function (error) {
					msg.header.statusCode = 400;
					msg.body.error = error;
					//console.log(error);
					/**
      * @callback 
      * @description when failed to login, send failure message to Conneto socket   
      */
					socketForConneto.write(JSON.stringify(msg), function (err) {
						if (err) {
							throw new _CustomError.SocketError("There's error while sending loginApproval to Conneto");
						}
					});
				});
			}
		}
	}
};

serverForConneto.on('connection', function (connetoSocket) {
	connetoSocketHandler.connection(connetoSocket, socketForWebServer);
});
serverForConneto.on('error', function (err) {
	console.log('error on serverForConneto: ' + err);
});
serverForConneto.listen(portForConneto, 'localhost');

var webServerSocketHandler = {
	/**
  * @callback
 	 * @description establish settings & register event handlers for socket when Conneto is connected
 	 * @param {Socket} socket- socket used for communicating with web server 
 	 */
	connection: function connection(socket) {
		//console.log("Server has a Webserver connection: " + socket.remotePort);
		socketForWebServer = socket;
		socket.on('close', webServerSocketHandler.close);
		socket.on('error', webServerSocketHandler.error);
		socket.on('data', function (data) {
			webServerSocketHandler.data(data, socketForWebServer);
		});
	},

	/**
  * @callback
  * @description handler for closed connection of web server
  */
	close: function close() {
		console.log("Webserver connection has disconnected");
	},

	/**
  * @callback
  * @description handler for error during communication
  * @param {Error} err - Error Object specifying error
 	 */
	error: function error(err) {
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
	data: function data(message, socketForWebServer) {
		try {
			message = JSON.parse(message);
			console.log(message);
			isValidHeader(message.header);
		} catch (e) {
			message.header.statusCode = 400;
			message.body.error = e;
			return exports.sendMsg(socketForWebServer, message);
		}
		var userId = message.body.userId;
		console.log(userId);

		var socketForConneto = queryClientInfo({
			action: 'select',
			clientId: message.body.userId
		}).socket;

		if (!socketForConneto) {
			console.log("Conneto of " + userId + " is offline");
			switch (message.header.command) {
				case 'getStatus':
					return exports.sendMsg(socketForWebServer, {
						header: {
							type: 'Response',
							token: '',
							command: 'getStatus',
							source: 'CONNETO',
							dest: 'WEB',
							statusCode: 400
						},
						body: {
							userId: userId
						}
					});

				default:
					var error = new _CustomError.UntreatableError('Conneto of the client is offline');
					return exports.sendMsg(socketForWebServer, {
						header: {
							command: message.header.command,
							statusCode: 400
						},
						body: {
							userId: message.body.userId,
							error: error
						}
					});
			}
		} else if (message.header.dest === 'CONNETO') {

			switch (message.header.command) {

				case "getStatus":
					exports.sendMsg(socketForWebServer, {
						header: {
							type: 'Response',
							token: '',
							command: 'getStatus',
							source: 'CONNETO',
							dest: 'WEB',
							statusCode: 200
						},
						body: {
							userId: userId
						}
					});
					break;

				case "getClients":
					var hostIpaddress = message.body.hostIpaddress;
					var msg = {
						header: {
							type: 'Response',
							token: '',
							command: 'getClients',
							source: 'CONNETO',
							dest: 'WEB'
						},
						body: {
							userId: userId,
							hostIpaddress: hostIpaddress
						}
					};
					try {
						var pairedClients = queryHostInfo({
							hostIpaddress: hostIpaddress,
							action: 'select'
						}).pairedClients;
						message.header.statusCode = 200;
						message.body.connetableClients = pairedClients;
						exports.sendMsg(socketForConneto, message);
					} catch (err) {
						message.header.statusCode = 400;
						message.body.error = err;
						exports.sendMsg(socketForConneto, message);
					}
					break;

				default:
					console.log(message.header.command);
					exports.sendMsg(socketForConneto, message);
			}
		}
	}
};

serverForWebServer.on('connection', webServerSocketHandler.connection);
serverForWebServer.on('error', function (err) {
	console.log('error on portForWebServer: ' + err);
});

function queryHostInfo(_ref) {
	var action = _ref.action,
	    hostIpaddress = _ref.hostIpaddress,
	    actionForPairedClients = _ref.actionForPairedClients,
	    pairedClients = _ref.pairedClients,
	    online = _ref.online;

	if (!hosts[hostIpaddress]) {
		hosts[hostIpaddress] = { pairedClients: pairedClients, online: online };
		return;
	}
	if (online) {
		hosts[hostIpaddress].online = online;
	}
	if (action === 'select') {
		return hosts[hostIpaddress];
	}

	switch (actionForPairedClients) {
		case 'add':
			hosts[hostIpaddress].pairedClients.concat(pairedClients);
			break;

		case 'delete':
			var index = hosts[hostIpaddress].pairedClients.indexOf(pairedClients);
			delete hosts[hostIpaddress].pairedClients[index];
			break;

		case 'update':
			hosts[hostIpaddress].pairedClients = pairedClients;
			break;

		default:
			throw new _CustomError.DBError('Invalid command for db');
		//we need new Error type!
	}
}

function queryClientInfo(_ref2) {
	var clientId = _ref2.clientId,
	    socket = _ref2.socket,
	    action = _ref2.action,
	    pairedHosts = _ref2.pairedHosts,
	    online = _ref2.online;

	switch (action) {
		case 'create':
			if (clients[clientId].online) {
				throw new Error('this user\'sConneto is alreay online');
				//we need new Error type!
			}
			clients[clientId] = { socket: socket, pairedHosts: pairedHosts, online: true };
			break;

		case 'update':
			if (!clients[clientId]) {
				throw new Error('Invalid user, the user doesn\'t exist');
				//we need new Error type!
			};
			if (socket) {
				clients[clientId].socket = socket;
			};
			if (pairedHosts) {
				clients[clientId].pairedHosts = pairedHosts;
			};
			if (online) {
				clients[clientId].online = online;
			};
			break;

		case 'select':
			if (!clients[clientId]) {
				throw new Error('Invalid user, the user is not exist');
				//we need new Error type!
			}
			return Object.assign({}, clients[clientId]);
			break;
	}
}

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
function sendMsg(socket, msg) {
	return new Promise(function (resolve, reject) {
		socket.write(JSON.stringify(msg), function (err) {
			if (err) {
				reject(err);
			} else {
				console.log("Wrote: " + JSON.stringify(msg));
				resolve();
			}
		});
	});
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

function isRegisteredUser(userId, password) {
	return new Promise(function (resolve, reject) {
		db.query("SELECT * FROM USER WHERE id='" + userId + "'").then(function (exist) {
			if (!exist[0]) {
				reject(new Error("Login failed: no such a id"));
			} else if (exist[0].password != password) {
				reject(new Error("Login failed: wrong password"));
			} else {
				console.log("Login Success!!: " + userId);
				resolve(userId);
			}
		});
	});
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

function saveConnetoSocket(userId, socket) {
	return Promise.resolve().then(function () {
		clients[userId] = socket;
		clients[socket.remoteAddress] = userId;
		return userId;
	});
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
function deleteConnetoSocket(socket) {
	return new Promise(function (resolve, reject) {
		if (clients[socket.remoteAddress]) {
			var userId = clients[socket.remoteAddress];
			delete clients[clients[socket.remoteAddress]];
			delete clients[socket.remoteAddress];
			resolve(userId);
		} else {
			reject("Invalid user: failing to delete Conneto socket");
		}
	});
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
function getConnetoSocket(userId) {
	return new Promise(function (resolve) {
		//COMMENTED PART IS THE VERSION USING DB, BUT I COULDN'T FOUND THE WAY OF STORING SOCKET OBJECT INTO THE FORM DB CAN ACCEPT
		//BECAUSE SOCKET OBJECT IS CIRCULAR, AND HAVE METHOD. SO IT MAKES REALLY HARD TO CONVERT IT INTO STRING..

		if (clients[userId]) {
			resolve(clients[userId]);
		} else {
			resolve();
		}
	});
}

/**
 * @description check whether the message is valid
 * @param {Object} msg - message you want to check its validation 
 */
function isValidMessage(msg) {
	return isValidHeader(msg.header);
}

/**
 * 
 * @param {Object} header - the header field of the message you want to check its validation 
 * @return {boolean} whether the header is valid
 * @throws {InvalidFormatError} throws it when essential field of header is blank
 * @throws {TokenError} throws it when token is unvalid
 */
function isValidHeader(header) {
	if (!checkEssentialFields(header)) {
		var error = new _CustomError.InvalidFormatError();
		error.code = 'ERR_BLANK_ESSENTIAL_FIELD';
		throw error;
	}
	if (!isValidCommand(header.command) || header.type !== 'Request' && header.type !== 'Response' || header.source !== 'WEB' && header.source !== 'CONNETO' && header.source !== 'DB' || header.dest !== 'WEB' && header.dest !== "CONNETO" && header.dest !== 'DB') {
		var _error = new _CustomError.InvalidFormatError();
		_error.code = 'ERR_INVALID_VALUE';
		throw _error;
	} else if (!isValidToken(header.token)) {
		var _error2 = new _CustomError.TokenError();
		_error2.code = "ERR_INVALID_TOKEN";
		throw _error2;
	}
	return true;
}

/**
 * @description check whetehr the command of the message is valid
 * @param {string} command - command you want to check 
 * @return {boolean} whether the command is valid
 */
function isValidCommand(command) {
	var validCommands = ['getStatus', 'getHosts', 'getApps', 'addHost', 'startGame', 'networkTest', 'login'];
	return validCommands.includes(command);
}

/**
 * @description check whether any essential field of the header is blank 
 * @param {Object} header - header you want to check
 * @return {boolean} whether the header has all essential values
 */
function checkEssentialFields(header) {
	return !header.type || !header.token || !header.command || !header.source || !header.dest || header.type === 'Response' && !header.statusCode;
}

/**
 * 
 * @param {string} token
 * @description it returns true if token is valid, otherwise return false 
 * @todo not implemented yet
 * @return {boolean} whether the token is valid
 */
function isValidToken(token) {
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