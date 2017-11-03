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
	socket.on('data', function(data){
		data = JSON.parse(data);
		if(data.command.slice(-7,-1) === "WEB"){
			if(isValidUser(data.userID)){
				switch(data.command){
					//If there's any difference between them, then add!
					case "getHostsResult_TO_WEB": 
					
					case "addHostResult_TO_WEB":
					
					case "getAppsResult_TO_WEB":

					case "startGameResult_TO_WEB": 				
				}
				sendMsg(clients[userID], data);
			}
		}
		else{
			if(data.command === "isAccount"){
				db.query("SELECT * FROM User WHERE id='" + data.userID + "'").then((exist)=>{
					if(!exist[0]){
						socket.write(JSON.stringify({command: "loginApproval", isApproved: false}), function(err){
							console.log("Login failed: no such a id");	
						});
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
			else if(data.command === "networkTest"){
				//TODO: get the network info from the web server and transmit it to the moonlight-client
				socketForWebServer.write(JSON.stringify({command: "networkTest_TO_WEB", userID: data.userID}, function(){
					
				}));
			}
			else{
				console.log("Invalid command!");
			}
		}
	})
});

serverForMoonlight.on('error', function(err){
	console.log('error on serverForMoonlight: ' + err);
});

serverForMoonlight.listen(portForMoonlight, 'localhost');

serverForWebServer.on('connection', function(socket){
	console.log("Server has a Webserver connection: " + socket.remotePort);
	socketForWebServer = socket;
	socket.on('close', function(){
		console.log("Webserver connection has disconnected");
	});
	
	socket.on('data', function(data){
		data = JSON.parse(data);
		var userId = data.userId;
		var socketforML;
		if(clients[userId]){
			socketForML = clients[userId];
		}
		console.log(data.command);
		if(data.command.slice(-6, -1) === "TO_ML"){
			if(data.res){
				
			}
			switch(data.command){
				
				case "getHosts_TO_ML":
					console.log('request from ' + userId + ": getting hosts");
					if(clients[userId]){
						//var socketforML = clients[userId];
						sendMsg(socketforML, {command: "getHosts", userID: userId});
					}
					else{
						console.log("err on getting hosts: moolight of " + userId +  " not online");
					}
					break;

				case "getApps_TO_ML":
					console.log('request from ' + userId  + ": getting apps");
					if(clients[userId]){
						//var socketforML = clients[userId];
						sendMsg(socketForML, {command: "getApps",userID: userId, hostId: data.hostId});
					}
					else{
						console.log("err on getting apps: moonlight of " + userId +"not online");
					}
					break;

				
					console.log('request from ' + userId + ": adding host");
					if(clients[userId]){
						//var socketforML = clients[userId];
						var randomNumber = data.pairingNum;
						sendMsg(socketForML, {command: "addHost", userID: userId, hostIp: data.hostIpaddress, randomNumber});
					}
					else{
						console.log("err on adding host: moolight of " + userId + "not online");
					}
					break;

				case "startGame_TO_ML":
					console.log('request from ' + userId + ": starting game");
					if(clients[userId]){
						//var socketForML = clients[userId];
						sendMsg(socketForML, {command: "startGame", userID: userId, appId: data.appId, hostId: data.hostId, option: data.option});
					}
					else{
						console.log("err on starting game: moolight of " + userId + " not online");
					}
					break;

				case "networkTest_TO_ML":
					console.log("request from " + userId + ": networkTest");
					data = data.data;
					if(clients[userId]){
						//var socketForML = clients[userId];
						sendMsg(socketforML, {command: "networkTest", userID: userId, ip:data.client.ip, latency: data.server.ping, download: data.speeds.download});
					}
					break;

				default:
					console.log("Invalid command from WebServer");
					break;
			}
		}
	})
})



function sendMsg(socket, msg){
	socket.write(JSON.stringify(msg), function(err){
		if(err){
			console.log("err on sending msg: " + err);
		}
		else{
			console.log("Successfully sent msg: " + msg.command);
		}
	});
}

function isValidUser(userID){
	if(userID){
		if(clients[userID]){
			return true;
		}
		else{
			console.log("Not a logined user!");
		}
	}else{
		console.log("There's no userID!");
	}
	return false;
}

serverForWebServer.on('error', function(err){
	console.log('error on portForWebServer: ' + err);
});

serverForWebServer.listen(portForWebServer, 'localhost');
