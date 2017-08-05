import express from 'express';
import net from 'net';

const router = express.Router();
var clients = {}; //Storing sockets of moolight-chrome in form of (socket.remotePort: socket)
				  //later: maybe in form of (userInformation(id, password): socket)
var hostname_to_id = {};

//get moonlight host list
router.post('/gethosts', (req, res)=>{
		console.log(req.ip);
	for(var remotePort in clients){ //일단은 모든 moonlight-chrome client들에게 전송하도록 해놓음
		var client = clients[remotePort]; //TODO: 로그인 정보를 이용하여 사용자 인식, 해당 사용자의 moonlight-chrome에 명령을 전달
		client.write(JSON.stringify({command: "getHosts"}), function(err){
			if(err){
				console.log("err occured: " + err);
			}
			client.once('data', function(data){
				var hostsList = JSON.parse(data).list;
				for(var host in hostsList){
					hostname_to_id[host.hostname] = host.hostId;
				}
				res.json(data);
			});
		})
	}
});

//get game list of the selected host
router.post('/getapps', (req, res)=>{
	for(var remotePort in clients){
		var client = clients[remotePort];
		client.write(JSON.stringify({command: "getAppList", hostId: req.body.hostId}),function(err){
			if(err){
				console.log("error occured: "+ err);
			}
			client.once('data', function(data){
				data = JSON.parse(data);
				if(data.error){
					res.status(404).json({error: 'host is not online'});
					return;
				}
				console.log(data);
				res.json(data);
			});
		})
	}
})

//add new moonlight host
router.post('/addhost', (req, res)=>{
	for(var remotePort in clients){
		var client  = clients[remotePort];
		var randomNumber = req.body.pairingNum;
		client.write(JSON.stringify({command: "addHost", hostIp: req.body.hostIp, randomNumber: randomNumber}), function(err){
			if(err){
				console.log("error occured: " + err);
			}
			client.once('data', function(data){
				data = JSON.parse(data);
				if(data.error){
					res.status(403).json({error: "Failed to add Host"});
					return;
				}
				res.json(data);
			})
		})
	}
})

//start the game of selected host
router.post('/startgame', (req, res)=>{
	for(var remotePort in clients){
		var client = clients[remotePort];
		client.write(JSON.stringify({command: "startGame", appId: req.body.appId, hostId: req.body.hostId, option: req.body.option}), function(err){
			if(err){
				console.log("error occured: " + err);
			}
			client.once('data', function(data){
				data = JSON.parse(data);
				if(data.error){
					res.status(404).json({error: "Failed to start game"});
					return;
				}
				res.json(data);
			});
		})
	}
})


////// tcp Server for communicating with moonlight-chrome
///TODO: Separate this tcp Server

var tcpPort=4001;

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
});
/////////////////////////////////////////////
export default router;