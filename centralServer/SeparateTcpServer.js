//separate tcp server which communicates with moonlight-chrome (originally in web server) 

var net = require('net'),
	app = require('express')();
	bodyParser = require('body-parser'),
	orientDB = require('orientjs');
	portForMoonlight= 4001,
	portForWebServer= 4002,
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
const server =  orientDB({
	host: "localhost",
	port: 2424,
	username: 'root',
	password: 'ssh2159'
});
const db = server.use('usersinfo');


var clients = {}; //TODO: Change this part to using db later
				  
var serverForMoonlight = net.createServer();
serverForMoonlight.on('connection', function(socket){
	//clients[socket.remotePort] = socket;
	console.log('Server has a new connection: ' + socket.remotePort);
	socket.on('close', function(){
		console.log('Moonlight client connection is closed: ' + socket.remotePort);
	});
	socket.once('data', function(data){
		data = JSON.parse(data);
		if(data.command === "isAccount"){
			db.query("SELECT * FROM User WHERE id='" + data.userID + "'").then((exist)=>{
				if(!exist[0]){
					socket.write(JSON.stringify({command: "loginApproval", isApproved: false}), function(err){
						console.log("Login failed: no such a id");						
					})
				}

				else if(exist[0].password!=data.userPW){
					socket.write(JSON.stringify({command: "loginApproval", isApproved: false}), function(err){
						console.log("Login failed: wrong password");					
					})
				}

				else{
					socket.write(JSON.stringify({command: "loginApproval", isApproved: true, userID: data.userID}), function(err){
						console.log("Login Success!!: " + data.userID);
						clients[data.userID] = socket;
						socket.on('close', function(){
							console.log("Connection closed: " + data.userID);
							delete clients[data.userID];
						})						
					});
				}
			});		
		}
	})
});

serverForMoonlight.on('error', function(err){
	console.log('error on serverForMoonlight: ' + err);
});

serverForMoonlight.listen(portForMoonlight, 'localhost');

app.post('/gethosts', function(req, res){
	console.log("request from " + req.body.userId + ": getting hosts");
	var userId = req.body.userId;
	if(clients[userId]){
		var client = clients[userId];
		sendMsgToMoonlight(client, {command:"getHosts", userID: req.body.userId}, res);
	}
	else{
		console.log("err on getting hosts: moonlight of "+req.body.userId+" not online");
	}	
});

app.post('/getapps', function(req, res){
	var userId = req.body.userId;
	if(clients[userId]){
		var client = clients[userId];
		sendMsgToMoonlight(client, {command: "getAppList",userID: req.body.userId, hostId: req.body.hostId}, res);
	}
	else{
		console.log("err on getting apps: moonlight of "+req.body.userId+" not online");
	}
});

app.post('/addhost', function(req, res){
	console.log("request from " + req.body.userId + ": getting hosts");
	var userId = req.body.userId;
	if(clients[userId]){
		var client  = clients[userId];
		var randomNumber = req.body.pairingNum;
		sendMsgToMoonlight(client, {command: "addHost", userID: req.body.userId, hostIp: req.body.hostIpaddress, randomNumber: req.body.pairingNum}, res);	
	}
	else{
		console.log("err on adding host: moonlight of "+req.body.userId+" not online");
	}
});

app.post('/startgame', function(req, res){
	var userId = req.body.userId;
	if(clients[userId]){
		var client = clients[userId];
		sendMsgToMoonlight(client, {command: "startGame", appId: req.body.appId, hostId: req.body.hostId, option: req.body.option}, res);
	}
	else{
		console.log("err on starting game: moonlight of " + req.body.userId + " not online");
	}
})

function sendMsgToMoonlight(client, msg, res){
	client.write(JSON.stringify(msg), function(err){
		if(err){
			console.log("err on getting hosts: " + err);
			res.status(404).json({error: err});
		}
		else{
			registerResponseHandler(client, res);
		}
	});
}

function registerResponseHandler(client, res){
	client.once('data', function(data){
		data = JSON.parse(data);
		if(data.error){
			res.status(404).json({error: 'host is not online'});
			return;
		}
		console.log(data);
		res.json(data);
	});	
}

function handleMsg(msg, desiredCommand){
	if(msg.command !== desiredCommand){

	}
}

app.listen(portForWebServer);