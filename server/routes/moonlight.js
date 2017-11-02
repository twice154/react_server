import express from 'express';
import net from 'net';
import axios from 'axios';

const router = express.Router();
var clients = {}; //Storing sockets of moolight-chrome in form of (socket.remotePort: socket)
				  //later: maybe in form of (userInformation(id, password): socket)
var portForCentralServer = 4002;
var socketForCentralServer = net.connect(portForCentralServer, "localhost", function(){
	console.log("Connection to Central Server Success!!");
	
	socketForCentralServer.on('close', function(){
		console.log('Connection to Central Server closed');
	});
	socketForCentralServer.on('error', function(err){
		console.log('err occured while connecting');
	})

	socketForCentralServer.on('data', commandHandler);
});

//get moonlight host list
router.post('/gethosts', (req, res)=>{
	sendMsgToCentralServer({command: 'gethosts_TO_ML', userId: req.body.userId});
});

//get game list of the selected host
router.post('/getapps', (req, res)=>{
	sendMsgToCentralServer({command: 'getapps_TO_ML', userId: req.body.userId, hostId: req.body.hostId});
})

//add new moonlight host
router.post('/addhost', (req, res)=>{
	sendMsgToCentralServer({command: 'addhost_TO_ML', userId: req.body.userId, hostIpaddress: req.body.hostIpaddress, pairingNum: req.body.pairingNum});
});

//start the game of selected host
router.post('/startgame', (req, res)=>{
	sendMsgToCentralServer({command: "startgame_TO_ML",userId: req.body.userId, appId: req.body.appId, hostId: req.body.hostId, option: req.body.option});
});

function sendMsgToCentralServer(command){
	/*request.post({uri: 'http://localhost:4002/' + uri,form: form}, function(err, httpres, body){
		if(err){
			return res.status(401).json({"error": err});
		}
		else{
			console.log(body);
			return res.json(body);
		}
	})*/
	socketForCentralServer.write(JSON.stringify(command));
}

function commandHandler(data){ //handler for data from central server
	data = JSON.parser(data);
	switch(data.command){
		case "networkTest":
			axios.post('/api/speedtest').then((res)=>{
				socketForCentralServer.write(JSON.stringify({command: "networkTest_TO_ML", data: res.data.data}));
			});
		default:
			console.err("Unvalid Command: " + data.command);
	}
}
////// tcp Server for communicating with moonlight-chrome
///TODO: Separate this tcp Server

/*var tcpPort=4001;

var server = net.createServer();

server.on('connection', function(socket){
	clients[socket.remotePort] = socket;
	console.log('Server has a new connection: ' + socket.remotePort);
	socket.on('close',function(){
		console.log('Connection is closed: ' + socket.remotePort);
		clients[socket.remotePort] = null;
	});
})

server.on('error',function(err){
	    console.log('Error occured'+ err);
});
server.listen(tcpPort, function(){
	console.log("tcp server is listening on " + tcpPort);
});*/
/////////////////////////////////////////////
export default router;