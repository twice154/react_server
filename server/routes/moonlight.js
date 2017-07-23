import express from 'express';
import net from 'net';

const router = express.Router();
var client = null;
var hostname_to_id = {}

//get moonlight host list
router.post('/gethosts', (req, res)=>{
	if(client){
		client.write(JSON.stringify({command: "getHosts"}), function(err){
			if(err){
				console.log("err occured: " + err);
			}
			client.once('data', function(data){
				data = JSON.parse(data);
				data = data.list;
				console.log(data);
				for(var host in data){
					hostname_to_id[host.hostname] = host.hostId; 	
				}
				res.json(data);
			});
		})
	}
	else{
		res.status(404).json({error: 'no connected moonlight-chrome'});
	}
});

//get game list of the selected host
router.post('/getapps', (req, res)=>{
	if(client){
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
	if(client){
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
	else{
		res.status(404).json({error: 'no connected moonlight-chrome'});
	}
})

//start the game of selected host
router.post('/startgame', (req, res)=>{
	if(client){
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
	}else{
		res.status(404).json({error: 'Failed to start game'});
	}
})


////// tcp Server for communicating with moonlight-chrome

var tcpPort=4001;

var server = net.createServer();

server.on('connection', function(socket){
	client = socket;
	console.log('Server has a new connection:');
	socket.on('close',function(){
		console.log('Server is now closed');
		client = null;
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