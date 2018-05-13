/**
 * @file api backend router for handling process related to Conneto
 * @author SSH
 * @description router name& method changed: POST /api/moonlight/checkstatus => GET /api/{userId}/conneto/status
 *  										 POST /api/moonlight/gethosts => GET /api/{userId}/conneto/hosts
 * 											 POST /api/moonlight/addhost => POST /api/{userId}/conneto/hosts
 * 											 POST /api/moonlight/getapps => GET /api/{userId}/conneto/apps
 * 											 POST /api/moonlight/startgame => POST /api/{userId}/conneto/apps
 * 				new router: 				 GET /api/{userId}/conneto/connetables: returns list of users satisfying 2 conditions:
 * 																				1. the user's conneto is online & paired with bj's G.E
 * 																				2. the user is currently watching the bj's streaming  
 */

import express from 'express';
import net from 'net';
import axios from 'axios';
import { InvalidFormatError } from '../../lib/CustomError';


const router = express.Router();


/**
 * @description this function takes Request object and get Authorization field of header
 * and convert the data(Base64) to original data(Object)
 * this authentication process is called HTTP basic authentication
 * @see {@link https://en.wikipedia.org/wiki/Basic_access_authentication}
 * @param {Request} req- Request object that will be parsed
 * @return {Object} original data object the client want to sent 
 */
function getDatainAuthHeader(req){
	return JSON.parse(new Buffer(req.headers.authorization, 'base64').toString('ascii'));
}

/** TODO: Find better way for getting http request and send msg to central server 
 *     and send http response when getting msg from central server without 
 *		storing or sending http respnse data to censtral server.
 *	   
 *       Found seemingly better way: store http responses according to their purpose
 *		And when got one central server response, then handle all the http response 
 *		of same purpose. It doesn't seems like the best, but better.
 */

/**
 * @callback
 * @description router for getStatus: it sends request checking online status of Conneto,
 * and store the Response object in the getStatus queue for sending response later when cetralserver will respond									  
 * @param {Request} req- contains information of the request from frontend
 * @param {Response} res- used for send response to frontend
 * @see {@link http://expressjs.com/ko/4x/api.html#req}
 */
router.get('/status', (req, res)=>{
	
	let userId = getUserIdFromURI(req.baseUrl);
	//console.log(req.app.socketForCentralServer.write);
	sendMsgToCentralServer({
			msg: {
				header: {
					type: 'Request',
					token: "",
					command:'getStatus',
					source: 'WEB',
					dest: 'CONNETO',
				},
				body: {
					userId
				}
			},
			socket: req.app.socketForCentralServer
	})
	.then(handleMsg)
	.then(({msg, statusCode})=>{
		sendResponse({res, msg, statusCode});
	});
})

/**
 * @callback
 * @description router related to hosts of the Conneto: 
 * METHOD GET: getting list of hosts connected to the Conneto 
 * 		  POST: adding a new host to the Conneto
 * it sends request to the central server and store the Response object in the corresponding queue for sending response later when cetralserver will respond
 * @param {Request} req- contains information of the request from frontend
 * @param {Response} res- used for send response to frontend
 */
router.route('/hosts')
	.get((req, res) => {
		let userId = getUserIdFromURI(req.baseUrl);
		sendMsgToCentralServer({
			msg: {
				header:{
					type: 'Request',
					token: "",
					command: 'getHosts',
					source: 'WEB',
					dest: 'CONNETO'
				},
				body: {
					userId
				}
			},
			socket: req.app.socketForCentralServer
		})
		.then(handleMsg)
		.then(({ msg, statusCode }) => {
			sendResponse({ res, msg, statusCode });
		});
	})
	.post((req, res) => {
		let userId = getUserIdFromURI(req.baseUrl);
		sendMsgToCentralServer({
			msg: {
				header:{
					type: 'Request',
					token: "",
					command: 'addHost',
					source: 'WEB',
					dest: 'CONNETO'
				},
				body: {
					userId,
					hostIpaddress: req.body.hostIpaddress,
					pairingNum: req.body.pairingNum
				}
			},
			socket: req.app.socketForCentralServer
		})
		.then(handleMsg)
		.then(({ msg, statusCode }) => {
			sendResponse({ res, msg, statusCode });
		});
	})

/**
 * @callback
 * @description router related to apps(games) of the host connected to the Conneto 
 * METHOD GET: getting list of apps executable in the 
 * 		  POST: starting the app of particular connected host and begin remote control  
 * 		  for the request to be accepted, login needed, selected host should be paired to the conneto, and the app should be executable in that host
 * it sends request to the central server and store the Response object in the corresponding queue for sending response later when cetralserver will respond
 * @param {Request} req- contains information of the request from frontend
 * @param {Response} res- used for send response to frontend
 */
router.route('/apps')
	.get((req, res) => {
		let userId = getUserIdFromURI(req.baseUrl);
		let hostId = getDatainAuthHeader(req).hostId;
		sendMsgToCentralServer({
			msg: {
				header: {
					type: 'Request',
					token:'',
					command: 'getApps',
					source: 'WEB',
					dest: 'CONNETO',
				},
				body: {
					userId,
					hostId
				}
			},
			socket: req.app.socketForCentralServer
		})
		.then(handleMsg)
		.then(({ msg, statusCode }) => {
			sendResponse({ res, msg, statusCode });
		});		
	})
	.post((req, res)=> {
		let userId = getUserIdFromURI(req.baseUrl);
		if(req.body.command === 'startGame'){
			sendMsgToCentralServer({
				msg: {
					header: {
						type: 'Request',
						token:'',
						command: 'startGame',
						source: 'WEB',
						dest: 'CONNETO'
					},
					body: {
						userId,
						appId: req.body.appId,
						hostId: req.body.hostId,
						option: req.body.option
					}
				},
				socket: req.app.socketForCentralServer
			})
			.then(handleMsg)
			.then(({ msg, statusCode }) => {
				sendResponse({ res, msg, statusCode });
			});
		}
		else if(req.body.command === 'stopGame'){
			sendMsgToCentralServer({
				msg: {
					header: {
						type: 'Response',
						token: '',
						command: 'stopGame',
						source: 'WEB',
						dest: 'CONNETO'
					},
					body: {
						userId
					}
				},
				socket: req.app.socketForCentralServer
			})
			.then(handleMsg)
			.then(({ msg, statusCode }) => {
				sendResponse({ res, msg, statusCode });
			});
		}
	})

router.get('/connetables', (req, res)=>{
	let userId = getUserIdFromURI(req.baseUrl);
	let hostIpaddress = getDatainAuthHeader(req).hostIpaddress;
	
	req.app.getUsersInRoom(req.app.io, userId).then((userList)=>{
		sendMsgToCentralServer({
			msg: {
				header: {
					type: 'Request',
					token: '',
					command: 'getClients',
					source: 'WEB',
					dest: 'CONNETO'
				},
				body: {
					userId,
					hostIpaddress,
					userList		 
				}
			},
			socket: req.app.socketForCentralServer
		})
		.then(handleMsg)
		.then(({ msg, statusCode }) => {
			sendResponse({ res, msg, statusCode });
		});
	})
})

/** 
 * @description this function used to send message to the central server
 * @param {Object} msg- object you want to send to the central server.
 * it is converted to the JSON string before sending, so methods in object are lost
 * circlular object will throw an error in convertion
 * @see {@link https://www.google.co.kr/search?q=typeerror:+converting+circular+structure+to+json&ei=-j-eWsilKYSh8QX6mLKIBA&start=0&sa=N&biw=1519&bih=735}
 * @return {Promise} 
 * @promise it resolves after the msg is finally written out, no args
 * @throws {Error} error while writing to socket for Central server  
 */
function sendMsgToCentralServer({msg, socket}){
	return new Promise((resolve, reject)=>{
		//console.log(socket);
		msg.callback_id = available_callback_id;
		available_callback_id++;
		socket.write(JSON.stringify(msg), (err)=>{
			if(err){
				reject(err);
			}
			callbackForCentralServer[msg.callback_id] = resolve;
		})
	})
}

function handleMsg({msg, io}){
	try{
		isValidHeader(msg.header);
		if(msg.header.command === 'getClients'){
			getUsersInRoom(io, msg.body.userId).then((userList)=>{
				msg.body.userList = userList;
				return {response: msg.body, statusCode: msg.header.statusCode}
			})
		}
		else{
			return {response: msg.body, statusCode: msg.header.statusCode};
		}
	}
	catch(e){
		return {response: e, statusCode: 400}
	}
}

function sendResponse({res, msg, statusCode}){
	res.status(statusCode).json(msg);
}

/**
 * @description this function converts ArryBuffer object to string
 * @param {ArrayBuffer} buffer- ArrayBuffer object you want to convert
 * @return {string} converted string  
 */
function arrayBufferToString(buffer){
    var arr = new Uint8Array(buffer);
    var str = String.fromCharCode.apply(String, arr);
    if(/[\u0080-\uffff]/.test(str)){
        throw new Error("this string seems to contain (still encoded) multibytes");
    }
    return str;
}

/**
 * @description return an array containing overlapping elements of two array
 * @param {Object[]} array1 
 * @param {Object[]} array2
 * @return {Object[]} includes overlapping elements
 */
function getOverlapElements(array1, array2){
	return array1.filter(function(element){
		return array2.includes(element);
	})
}

function getUserIdFromURI(URI){
	return URI.split('/')[2];
}

/**
 * 
 * @param {Object} header - the header field of the message you want to check its validation 
 * @return {boolean} whether the header is valid
 * @throws {InvalidFormatError} throws it when essential field of header is blank
 * @throws {TokenError} throws it when token is unvalid
 */
function isValidHeader(header) {
	let error = new Error();
	if (!checkEssentialFields(header)) {
		error.code = 'ERR_BLANK_ESSENTIAL_FIELD';
		throw error;
	}
	if (!isValidCommand(header.command)
		|| (header.type !== 'Request' && header.type !== 'Response')
		|| (header.source !== 'WEB' && header.source !== 'CONNETO' && header.source !== 'DB')
		|| (header.dest !== 'WEB' && header.dest !== "CONNETO" && header.dest !== 'DB')
	) {
		error.code = 'ERR_INVALID_VALUE'
		throw error;
	}
	else if (!isValidToken(header.token)) {
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
function isValidCommand(command) {
	let validCommands = ['getStatus', 'getHosts', 'getApps', 'addHost', 'startGame', 'networkTest', 'login', 'stopGame']
	return validCommands.includes(command);
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

export default router;