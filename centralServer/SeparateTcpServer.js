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
const jc = require('json-cycle');



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
		console.log(data);
		if(data.command.slice(-6, ) === "TO_WEB"){
			if(getMLSocket(data.userID)){
				switch(data.command){
					//If there's any difference between them, then add!
					case "getHostsResult_TO_WEB": 

					case "addHostResult_TO_WEB":
					
					case "getAppsResult_TO_WEB":

					case "startGameResult_TO_WEB": 				
				}
				sendMsg(socketForWebServer, data);
			}
		}
		else{
			if(data.command === "isAccount"){
				
				if(isValidUser(data.userID, data.userPW)){
					socket.write(JSON.stringify({command: "loginApproval", isApproved: true, userID: data.userID}), function(err){
						if(err){
							console.log("There's error while sending loginApproval to ML");
						}
						else{
							//clients[data.userID] = socket;
							saveMLSocket(data.userID, socket);
							socket.on('close', function(){
								console.log("Connection closed: " + data.userID);
								//delete clients[data.userID];
								deleteMLSocket(data.userID, socket);
							});
						}						
					});
				}

				else{
					socket.write(JSON.stringify({command: "loginApproval", isApproved: false}), function(err){
						if(err){
							console.log("There's error while sending loginApproval to ML");
						}
					});
				}
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
		var socketForML = getMLSocket(data.userId);
		if(!socketForML){
			console.log("ML of " + userId + " is offline");
			return;
		}
		console.log(data.command);
		if(data.command.slice(-5, ) === "TO_ML"){
			switch(data.command){
				
				case "getHosts_TO_ML":
					console.log('request from ' + userId + ": getting hosts");
					//if(clients[userId]){
						sendMsg(socketForML, {command: "getHosts", userID: userId});
					//}
					/*else{
						console.log("err on getting hosts: moolight of " + userId +  " not online");
					}*/
					break;

				case "addHost_TO_ML":
					console.log('request form ' + userId + ": getting hosts");
					//if(clients[userId]){
						sendMsg(socketForML, {command: "addHost", userID: userId, hostIp: data.hostIpaddress, randomNumber: data.pairingNum});
					//}	

				case "getApps_TO_ML":
					console.log('request from ' + userId  + ": getting apps");
					//if(clients[userId]){
						//var socketforML = clients[userId];
						sendMsg(socketForML, {command: "getApps",userID: userId, hostId: data.hostId});
					//}
					/*else{
						console.log("err on getting apps: moonlight of " + userId +"not online");
					}*/
					break;

				
					console.log('request from ' + userId + ": adding host");
					//if(clients[userId]){
						//var socketforML = clients[userId];
						var randomNumber = data.pairingNum;
						sendMsg(socketForML, {command: "addHost", userID: userId, hostIp: data.hostIpaddress, randomNumber});
					//}
					/*else{
						console.log("err on adding host: moolight of " + userId + "not online");
					}*/
					break;

				case "startGame_TO_ML":
					console.log('request from ' + userId + ": starting game");
					//if(clients[userId]){
						//var socketForML = clients[userId];
						sendMsg(socketForML, {command: "startGame", userID: userId, appId: data.appId, hostId: data.hostId, option: data.option});
					//}
					/*else{
						console.log("err on starting game: moolight of " + userId + " not online");
					}*/
					break;

				case "networkTest_TO_ML":
					console.log("request from " + userId + ": networkTest");
					data = data.data;
					//if(clients[userId]){
						//var socketForML = clients[userId];
						sendMsg(socketforML, {command: "networkTest", userID: userId, ip:data.client.ip, latency: data.server.ping, download: data.speeds.download});
					//}
					break;

				default:
					console.log("Invalid command from WebServer");
					break;
			}
		}
		/*else if(data.command.slice(0, 4) === "AUTH"){
			switch(data.command){
				case "AUTH_signIn":
					if(isValidUser(data.userID, data.userPW)){
						socketForWebServer.sendMsg()
					}
					else{

					}
				case "AUTH_signup":
					if()
			}
		}*/ //TODO: move the db operation stuff to central server
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

////TODO: merge these functions into one class, it will be more elegant 
////

/*function isLoginedUser(userID){
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
}*/ //deprecated

function isValidUser(userID, userPW){
	db.query("SELECT * FROM User WHERE id='" + userId + "'").then((exist)=>{
		if(!exist[0]){
			console.log("Login failed: no such a id");	
			return false; 
		}

		else if(exist[0].password!=userPW){
			console.log("Login failed: wrong password");
			return false;
		}

		else{
			console.log("Login Success!!: " + userID);					
			return true;
		}
	});		
} 

function saveMLSocket(userID, socket){
	db.query("UPDATE USER SET ML_socket='" + JSON.stringify(jc.decycle(socket)) + "', ML_login_status='true'" + " WHERE id='" + userID + "'")
		.then(function(update){
			console.log('MLSocket info updated');
		}).catch(function(err){
			console.log('err occured while MLSocket info updated');
		})	
}

function deleteMLSocket(userID){
	db.query("UPDATE USER SET ML_login_status='false'" + " WHERE id='" + userID + "'")
		.then(function(update){
			console.log('MLSocket info updated');
		}).catch(function(err){
			console.log('err occured while MLSocket info updated');
		})		
}

function getMLSocket(userID){
	db.query("SELECT * FROM WHERE id='" + userID + "'").then(function(exist){
		if(exist[0].ML_login_status){
			return jc.retrocycle(JSON.parse(exist[0].ML_socket));
		}
		else{
			return false;
		}
	}).catch(function(err){
		console.log("error occured: " + err);
		return false;
	}) 
}

serverForWebServer.on('error', function(err){
	console.log('error on portForWebServer: ' + err);
});

serverForWebServer.listen(portForWebServer, 'localhost');
