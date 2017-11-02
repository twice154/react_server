//separate tcp server which communicates with moonlight-chrome (originally in web server) 

var net = require('net'),
	//app = require('express')();

	bodyParser = require('body-parser'),
	orientDB = require('orientjs');
	portForMoonlight= 4001,
	portForWebServer= 4002;
//app.use(bodyParser.json()); // for parsing application/json
//app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
const server =  orientDB({
	host: "localhost",
	port: 2424,
	username: 'root',
	password: 'ssh2159'
});
const db = server.use('usersinfo');


var clients = {}; //TODO: Change this part to using db later
				  
var serverForMoonlight = net.createServer();  //For Many Moonlight 
var serverForWebServer = net.createServer();  //For only one Web server
var socketForWebServer;
serverForMoonlight.on('connection', function(socket){
	//clients[socket.remotePort] = socket;
	console.log('Server has a new Moonlight client connection: ' + socket.remotePort);
	socket.on('close', function(){
		console.log('Moonlight client connection is closed: ' + socket.remotePort);
	});
	socket.once('data', handler = function(data){
		data = JSON.parse(data);
		if(data.command === "isAccount"){
			db.query("SELECT * FROM User WHERE id='" + data.userID + "'").then((exist)=>{
				if(!exist[0]){
					socket.write(JSON.stringify({command: "loginApproval", isApproved: false}), function(err){
						console.log("Login failed: no such a id");	
						socket.once('data', handler);
					});
				}

				else if(exist[0].password!=data.userPW){
					socket.write(JSON.stringify({command: "loginApproval", isApproved: false}), function(err){
						console.log("Login failed: wrong password");
						socket.once('data', handler);
					})
				}

				else{
					socket.write(JSON.stringify({command: "loginApproval", isApproved: true, userID: data.userID}), function(err){
						console.log("Login Success!!: " + data.userID);
						clients[data.userID] = socket;
						socket.once('data', handler);
						socket.on('close', function(){
							console.log("Connection closed: " + data.userID);
							delete clients[data.userID];
						})						
					});
				}
			});		
		}
		else if(data.command === "networkTest"){
			//TODO: get the network info from the web server and transmit it to the moonlight-client
			socketForWebServer.write(JSON.stringify({command: "networkTest_TO_WEB", userID: data.userID}, function(){
				
			}));
		}
	})
});

serverForMoonlight.on('error', function(err){
	console.log('error on serverForMoonlight: ' + err);
});

serverForMoonlight.listen(portForMoonlight, 'localhost');

/*app.post('/gethosts', function(req, res){
	console.log("request from " + req.body.userId + ": getting hosts");
	var userId = req.body.userId;
	if(clients[userId]){
		var client = clients[userId];
		sendMsgToMoonlightAndRegisterHandler(client, {command:"getHosts", userID: req.body.userId}, res);
	}
	else{
		console.log("err on getting hosts: moonlight of "+req.body.userId+" not online");
	}	
});
app.post('/getapps', function(req, res){
	var userId = req.body.userId;
	if(clients[userId]){
		var client = clients[userId];
		sendMsgToMoonlightAndRegisterHandler(client, res, {command: "getAppList",userID: req.body.userId, hostId: req.body.hostId});
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
		sendMsgToMoonlightAndRegisterHandler(client, res, {command: "addHost", userID: req.body.userId, hostIp: req.body.hostIpaddress, randomNumber: req.body.pairingNum});	
	}
	else{
		console.log("err on adding host: moonlight of "+req.body.userId+" not online");
	}
});
app.post('/startgame', function(req, res){
	var userId = req.body.userId;
	if(clients[userId]){
		var client = clients[userId];
		sendMsgToMoonlightAndRegisterHandler(client, res, {command: "startGame", appId: req.body.appId, hostId: req.body.hostId, option: req.body.option});
	}
	else{
		console.log("err on starting game: moonlight of " + req.body.userId + " not online");
	}
})*/
serverForWebServer.on('connection', function(socket){
	console.log("Server has a Webserver connection: " + socket.remotePort);
	socketForWebServer = socket;
	socket.on('close', function(){
		console.log("Webserver connection has disconnected");
	});
	
	socket.on('data', function(data){
		data = JSON.parse(data);
		var userId = data.userId;
		switch(data.command){
			
			case "gethosts_TO_ML":
				console.log('request from ' + userId + ": getting hosts");
				if(clients[userId]){
					var SocketforML = client[userId];
					sendMsgToMoonlightAndRegisterHandler(socketForML, socketForWebServer,{command: "getHosts", userID: userId});
				}
				else{
					console.log("err on getting hosts: moolight of " + userId +  " not online");
				}

			case "getapps_TO_ML":
				console.log('request from ' + userId  + ": getting apps");
				if(clients[userId]){
					var SocketforML = client[userId];
					sendMsgToMoonlightAndRegisterHandler(socketForML, socketForWebServer, {command: "getAppList",userID: req.body.userId, hostId: req.body.hostId});
				}
				else{
					console.log("err on getting apps: moonlight of " + req.body.userId +"not online");
				}

			case "addhost_TO_ML":
				console.log('request from ' + userId + ": adding host");
				if(clients[userId]){
					var SocketforML = client[userId];
					var randomNumber = req.body.pairingNum;
					sendMsgToMoonlightAndRegisterHandler(socketForML, socketForWebServer, {command: "addHost", userID: userId, hostIp: req.body.hostIpaddress, randomNumber});
				}
				else{
					console.log("err on adding host: moolight of " + req.body.userId + "not online");
				}

			case "startgame_TO_ML":
				console.log('request from ' + userId + ": start game");
				if(clients[userId]){
					var socketForML = clients[userId];
					sendMsgToMoonlightAndRegisterHandler(socketForML, socketForWebServer, {command: "startGame", appId: req.body.appId, hostId: req.body.hostId, option: req.body.option});
				}
				else{
					console.log("err on starting game: moolight of " + req.body.userId + " not online");
				}

			case "networkTest_TO_ML":
				console.log("request from " + userId + ": networkTest");
				data = data.data;
				if(clients[userId]){
					var socketForML = clients[userId];
					socketForML.write({command: "networkTest", userID: userId, ip:data.client.ip, latency: data.server.ping, download: data.speeds.download});
				}

			default:
				console.err("Invalid command from WebServer");


		}
	})
})



function sendMsgToMoonlightAndRegisterHandler(socketForML, socketForWeb, msg){
	socketForML.write(JSON.stringify(msg), function(err){
		if(err){
			console.log("err on getting hosts: " + err);
			res.status(404).json({error: err});
		}
		else{
			registerResponseHandler(socketForML, socketForWeb);
		}
	});
}

function registerResponseHandler(socketForML, socketForWeb){
	socketForML.once('data', function(data){
		data = JSON.parse(data);
		if(data.error){
			res.status(404).json({error: 'host is not online'});
			return;
		}
		console.log(data);
		socketForWeb.write(data);
	});	
}

serverForWebServer.on('error', function(err){
	console.log('error on portForWebServer: ' + err);
});

serverForWebServer.listen(portForWebServer, 'localhost');
