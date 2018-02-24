//질문 2

import express from 'express';
import net from 'net';
////?이게 뭐지
//중앙서버랑 연결할 수 있게 통로를 만들어줌.
import axios from 'axios';

const router = express.Router();
var httpResponses = {status:{}, getHosts: {}, getApps: {}, addHost: {}, startGame:{}};
//http반응들을 모아둔거.

var portForCentralServer = 4002;
var socketForCentralServer;
var interval;

function connectToCentralServer(){
	socketForCentralServer = net.connect(portForCentralServer, "localhost", function(){
		//net.connect==net.createconnect() 연결
		console.log("Connection to Central Server Success!!");
		if(interval){
			clearInterval(interval);
			interval = null;
		}
		
		socketForCentralServer.on('close', function(){
			console.log('Connection to Central Server closed');
			if(!interval){
				interval = setInterval(connectToCentralServer, 3000);
			}
		});
		socketForCentralServer.on('data', commandHandler);
		//4002포트로 들어오는 것들은 다 commandHandler를 실행시켜 준다.
	});
	socketForCentralServer.on('error', function(err){
		//console.log('err occured while connecting');
		if(!interval) {
			interval = setInterval(connectToCentralServer, 3000);
		}
	});		
}

connectToCentralServer();

//TODO: Find better way for getting http request and send msg to central server 
//      and send http response when getting msg from central server without 
//		storing or sending http respnse data to censtral server.

//##    Found seemingly better way: store http responses according to their purpose
//		And when got one central server response, then handle all the http response 
//		of same purpose. It doesn't seems like the best, but better.st 

router.post('/getStatus', (req, res)=>{
	//중앙서버에 userId가 연결되어 있는지 확인
	sendMsgToCentralServerAndRegisterResHandler(res, { command: 'checkStatus', userId: req.body.userId });
	if(!httpResponses.status[req.body.userId]){
		httpResponses.status[req.body.userId] = [];
	}
	httpResponses.status[req.body.userId].push(res);
	//command, status, userId를 httpResponses.status.userId객체 배열에 집어넣는다.
	//상태를 지속적으로 기록하는 함수.
	//이때 userId는 로그인되어 있는 id다.
	////////? 왜 상태를 지속적으로 기록하는지 몰겟...
	
})

//get moonlight host list
router.post('/gethosts', (req, res)=>{
	//받아온 호스트 목록에 뭘집어넣는거지???????? gethost인데 왜 userId를 집어 넣는거지
	////? res가의미하는 것은?
	//res로 axios한테 넘겨줘야 하는데 그게 없음.
	sendMsgToCentralServerAndRegisterResHandler(res, {command: 'getHosts_TO_ML', userId: req.body.userId});
	//센트럴 서버에 커멘드랑 유저아이디를 집어넣음.
	if (!httpResponses.getHosts[req.body.userId]) {
		httpResponses.getHosts[req.body.userId] = [];
	}	
	httpResponses.getHosts[req.body.userId].push(res);
});

//get game list of the selected host
router.post('/getapps', (req, res)=>{
	sendMsgToCentralServerAndRegisterResHandler(res, {command: 'getApps_TO_ML', userId: req.body.userId, hostId: req.body.hostId});
	if (!httpResponses.getApps[req.body.userId]) {
		httpResponses.getApps[req.body.userId] = [];
	}	
	httpResponses.getApps[req.body.userId].push(res);
})

//add new moonlight host
router.post('/addhost', (req, res)=>{
	sendMsgToCentralServerAndRegisterResHandler(res, {command: 'addHost_TO_ML', userId: req.body.userId, hostIpaddress: req.body.hostIpaddress, pairingNum: req.body.pairingNum});
	if (!httpResponses.addHost[req.body.userId]) {
		httpResponses.addHost[req.body.userId] = [];
	}	
	httpResponses.addHost[req.body.userId].push(res);
});

//start the game of selected host
router.post('/startgame', (req, res)=>{
	sendMsgToCentralServerAndRegisterResHandler(res, {command: "startGame_TO_ML",userId: req.body.userId, appId: req.body.appId, hostId: req.body.hostId, option: req.body.option});
	if (!httpResponses.startGame[req.body.userId]) {
		httpResponses.startGame[req.body.userId] = [];
	}	
	httpResponses.startGame[req.body.userId].push(res);
});

function sendMsgToCentralServerAndRegisterResHandler(res, msg){
////? 이게 무슨함수지이이이 res는 뭥미
	socketForCentralServer.write(JSON.stringify(msg), function(){
		
	});
}

function commandHandler(data){ //handler for data from central server
	console.log(typeof(data));
	data = JSON.parse(data);
	console.log("IN CommandHandler: " + JSON.stringify(data));
	console.log("Receiver msg: " + data.command);
	switch(data.command){

		case "checkStatus":
			iterativelySendResponse(httpResponses.status[data.userID], data);
			//status
			break;
		case "getHostsResult_TO_WEB":
			iterativelySendResponse(httpResponses.getHosts[data.userID], data);
			break;
		case "addHostResult_TO_WEB":
			iterativelySendResponse(httpResponses.addHost[data.userID], data);
			break;
		case "getAppsResult_TO_WEB":
			iterativelySendResponse(httpResponses.getApps[data.userID], data);
			break;
		case "startGameResult_TO_WEB":
			iterativelySendResponse(httpResponses.startGame[data.userID], data);
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
	//var length =  responseArray.length;
	function aa(){
		return new Promise(function(resolve, reject){
			responseArray.forEach(function(element, index, array){
				console.log("iteratively: " + JSON.stringify(data));
				element.json(data);
			});			
			resolve(responseArray.length);
		})
	}

	aa().then(function(length){
		responseArray = responseArray.splice(0, length);	
	})
}

function arrayBufferToString(buffer){
    var arr = new Uint8Array(buffer);
    var str = String.fromCharCode.apply(String, arr);
    if(/[\u0080-\uffff]/.test(str)){
        throw new Error("this string seems to contain (still encoded) multibytes");
    }
    return str;
}

export default router;