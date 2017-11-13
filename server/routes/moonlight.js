import express from 'express';
import net from 'net';
import axios from 'axios';

const router = express.Router();
var httpResponses = {getHosts: [], getApps: [], addHost: [], startGame:[]};

var portForCentralServer = 4002;
var socketForCentralServer = net.connect(portForCentralServer, "localhost", function(){
	console.log("Connection to Central Server Success!!");
	
	socketForCentralServer.on('close', function(){
		console.log('Connection to Central Server closed');
	});
	socketForCentralServer.on('data', commandHandler);
});
socketForCentralServer.on('error', function(err){
	console.log('err occured while connecting');
});


//TODO: Find better way for getting http request and send msg to central server 
//      and send http response when getting msg from central server without 
//		storing or sending http respnse data to censtral server.

//##    Found seemingly better way: store http responses according to their purpose
//		And when got one central server response, then handle all the http response 
//		of same purpose. It doesn't seems like the best, but better.

//get moonlight host list
router.post('/gethosts', (req, res)=>{
	sendMsgToCentralServerAndRegisterResHandler(res, {command: 'getHosts_TO_ML', userId: req.body.userId});
	httpResponses.getHosts.push(res);
});

//get game list of the selected host
router.post('/getapps', (req, res)=>{
	sendMsgToCentralServerAndRegisterResHandler(res, {command: 'getApps_TO_ML', userId: req.body.userId, hostId: req.body.hostId});
	httpResponses.getApps.push(res);
})

//add new moonlight host
router.post('/addhost', (req, res)=>{
	sendMsgToCentralServerAndRegisterResHandler(res, {command: 'addHost_TO_ML', userId: req.body.userId, hostIpaddress: req.body.hostIpaddress, pairingNum: req.body.pairingNum});
	httpResponses.addHost.push(res);
});

//start the game of selected host
router.post('/startgame', (req, res)=>{
	sendMsgToCentralServerAndRegisterResHandler(res, {command: "startGame_TO_ML",userId: req.body.userId, appId: req.body.appId, hostId: req.body.hostId, option: req.body.option});
	httpResponses.startGame.push(res);
});

function sendMsgToCentralServerAndRegisterResHandler(res, msg){

	socketForCentralServer.write(JSON.stringify(msg), function(){
		
	});
}

function commandHandler(data){ //handler for data from central server
	data = JSON.parse(data);
	console.log("Receiver msg: " + data.command);
	switch(data.command){

		case "getHostsResult_TO_WEB":
			iterativelySendResponse(httpResponses.getHosts, data);
			break;
		case "addHostResult_TO_WEB":
			iterativelySendResponse(httpResponses.addHost, data);
			break;
		case "getAppsResult_TO_WEB":
			iterativelySendResponse(httpResponses.getApps, data);
			break;
		case "startGameResult_TO_WEB":
			iterativelySendResponse(httpResponses.startGame, data);
			break;
		case "networkTest_TO_WEB":
			axios.post('/api/speedtest').then((res)=>{
				socketForCentralServer.write(JSON.stringify({command: "networkTest_TO_ML", data: res.data.data}));
			});
			break;

		default:
			console.log("Unvalid Command: " + data.command);
	}
}

function iterativelySendResponse(responseArray, data){
	var length =  responseArray.length;
	responseArray.forEach(function(element, index, array){
		element.json(data);
	});
	responseArray.splice(0, length);	
}
export default router;