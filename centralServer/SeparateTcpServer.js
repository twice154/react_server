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
	socket.on('error', function(err){
		console.log("err occured in connection with Moonlight client: " + socket.remotePort + err);
	})
	socket.on('data', function(data){
		data = JSON.parse(data);
		console.log("new msg received: " + JSON.stringify(data));
		if(data.command.slice(-6, ) === "TO_WEB"){
			//getMLSocket(data.userID).then((socketforML)=>{
				//if(socketforML){
					/*switch(data.command){
						//If there's any difference between them, then add!
						case "getHostsResult_TO_WEB": 

						case "addHostResult_TO_WEB":
						
						case "getAppsResult_TO_WEB":

						case "startGameResult_TO_WEB": 				
					}*/
					sendMsg(socketForWebServer, data);	
				//}			
			/*}).catch((err)=>{
				console.log("Something broken while getting ML socket data from db: " + err);
			})*/
		}
		else{
			if(data.command === "isAccount"){
				isValidUser(data.userID, data.userPW)
					.then((isValid)=>{
						if(isValid){
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
						
					}).catch((err)=>{
						console.log("SOmething broken while getting account info");
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
	socket.on('error', function(err){
		console.log("error occured in Webserver socket connection");
	})
	
	socket.on('data', function(data){
		data = JSON.parse(data);
		var userId = data.userId;
		getMLSocket(data.userId).then((socketForML)=>{
			if(!socketForML){
				console.log("ML of " + userId + " is offline");
				return sendMsg(socketForWebServer, {error: -1, status: false});
			}
			console.log(data.command);
			if(data.command.slice(-5, ) === "TO_ML"){
				switch(data.command){

					case "getHosts_TO_ML":
						console.log('request from ' + userId + ": getting hosts");
						sendMsg(socketForML, {command: "getHosts", userID: userId});
						break;

					case "addHost_TO_ML":
						console.log('request form ' + userId + ": adding hosts");
						sendMsg(socketForML, {command: "addHost", userID: userId, hostIp: data.hostIpaddress, randomNumber: data.pairingNum});
						break;

					case "getApps_TO_ML":
						console.log('request from ' + userId  + ": getting apps");
						sendMsg(socketForML, {command: "getApps",userID: userId, hostId: data.hostId});
						break;

					case "startGame_TO_ML":
						console.log('request from ' + userId + ": starting game");
						sendMsg(socketForML, {command: "startGame", userID: userId, appId: data.appId, hostId: data.hostId, option: data.option});
						break;

					case "networkTest_TO_ML":
						console.log("request from " + userId + ": networkTest");
						data = data.data;
						sendMsg(socketforML, {command: "networkTest", userID: userId, ip:data.client.ip, latency: data.server.ping, download: data.speeds.download});
						break;

					default:
						console.log("Invalid command from WebServer");
						break;
				}
			}
			else if(data.command == "checkStatus"){
				console.log('request from ' + userId + ": checking moonlight status");
				sendMsg(socketForWebServer, { command: "checkStatus", status: true, userID: userId});
			}		
		}).catch((err)=>{
			console.log("Something broken while getting ML Socket from db: " + err);
		})
		
		/*else if(data.command.slice(0, 4) === "AUTH"){
			switch(data.command){
				case "AUTH_signIn":
					if(isValidUser(data.userID, data.userPW)){

					}
					else{

					}
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

/*function isValidUser(userID, userPW){
	db.query("SELECT * FROM USER WHERE id='" + userID + "'").then((exist)=>{
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
}*/ 

isValidUser =(userID, userPW) => new Promise((resolve)=>{
	db.query("SELECT * FROM USER WHERE id='" + userID + "'").then((exist)=>{
		if(!exist[0]){
			console.log("Login failed: no such a id");	
			resolve(false); 
		}

		else if(exist[0].password!=userPW){
			console.log("Login failed: wrong password");
			resolve(false);
		}

		else{
			console.log("Login Success!!: " + userID);					
			resolve(true);
		}
	})
	.catch((err)=>{
		console.log("Something broken whiile checking validity of user");
	});		
})

function saveMLSocket(userID, socket){
	//console.log("BEFORE: " + socket.write);
	//console.log("AFTER: " + jc.retrocycle(JSON.parse(JSON.stringify(jc.decycle(socket)))).write);

	/*db.query("UPDATE USER SET ML_socket='" + JSON.stringify(socket) + "', ML_login_status='true'" + " WHERE id='" + userID + "'")
		.then(function(update){
			console.log('MLSocket info updated');
		}).catch(function(err){
			console.log('err occured while MLSocket info updated');
		})*/
	clients[userID] = socket;

}

function deleteMLSocket(userID){
	/*db.query("UPDATE USER SET ML_login_status='false', ML_socket=''" + " WHERE id='" + userID + "'")
		.then(function(update){
			console.log('MLSocket info updated');
		}).catch(function(err){
			console.log('err occured while MLSocket info updated');
		})*/		

		if(clients[userID]){
			delete clients[userID];
		}
		else{
			console.log("Invalid user: failing to delete ML socket");
		}
}

getMLSocket = (userID)=> new Promise((resolve)=>{
		//THIS IS THE VERSION USING DB, BUT I COULDN'T FOUND THE WAY OF STORING SOCKET OBJECT INTO THE FORM DB CAN ACCEPT
		//BECAUSE SOCKET OBJECT IS CIRCULAR, AND HAVE METHOD. SO IT MAKES REALLY HARD TO CONVERT IT INTO STRING..
		/*db.query("SELECT * FROM USER WHERE id='" + userID + "'").then(function(exist){
			if(exist[0].ML_login_status){
				resolve(circularJSON.parse(exist[0].ML_socket));
			}
			else{
				resolve(false);
			}
		}).catch(function(err){
			console.log("error occured while getting ML socket from db: " + err);
			resolve(false);
		})*/


		if(clients[userID]){
			resolve(clients[userID]);	
		}
		else{
			console.log("INvalid user: failing to get ML socket");
			resolve(false);
		}
})

serverForWebServer.on('error', function(err){
	console.log('error on portForWebServer: ' + err);
});

serverForWebServer.listen(portForWebServer, 'localhost');
