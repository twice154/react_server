import express from 'express';
import request from 'request';

const router = express.Router();
var clients = {}; //Storing sockets of moolight-chrome in form of (socket.remotePort: socket)
				  //later: maybe in form of (userInformation(id, password): socket)

//get moonlight host list
router.post('/gethosts', (req, res)=>{
	requestToCentralServer('gethosts', {userId: req.body.userId}, res);
});

//get game list of the selected host
router.post('/getapps', (req, res)=>{
	requestToCentralServer('getapps', {userId: req.body.userId, hostId: req.body.hostId}, res);
})

//add new moonlight host
router.post('/addhost', (req, res)=>{
	requestToCentralServer('addhost', {userId: req.body.userId, hostIpaddress: req.body.hostIpaddress, pairingNum: req.body.pairingNum}, res);
});

//start the game of selected host
router.post('/startgame', (req, res)=>{
	requestToCentralServer('startgame', {userId: req.body.userId, appId: req.body.appId, hostId: req.body.hostId, option: req.body.option}, res);
});

function requestToCentralServer(uri, form, res){
	request.post({uri: 'http://localhost:4002/' + uri,form: form}, function(err, httpres, body){
		if(err){
			return res.status(401).json({"error": err});
		}
		else{
			console.log(body);
			return res.json(body);
		}
	})
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