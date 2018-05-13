import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import session from 'express-session';
import orientDB from 'orientjs';
import cors from 'cors';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import api from './routes';
import fs from 'fs';
import http from 'http';
import socket_io from 'socket.io';
import net from 'net';
import {processResponseQueue} from '../lib/AsyncRes';

const app = express();
const port = 3000;
const devPort = 4000;
const portForCentralServer = 4002;
var connectRegularly;

const dbServer = orientDB({
    host: 'localhost',
    port: 2424,
    username: 'root',
    password: 'ssh2159'
});

const db = dbServer.use('usersinfo');
const server = http.Server(app);
const io = socket_io(server);

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/api', api);
app.io = io;

app.callbackForCentralServer = {};
app.available_callback_id = 1;
app.getUsersInRoom = getUsersInRoom;

var resourceDirectory = "";
if(process.env.NODE_ENV === 'development'){
    resourceDirectory = path.resolve(__dirname, './../public');
}
else{
    resourceDirectory = path.resolve(__dirname, './../build');
}

app.use('/', express.static(resourceDirectory));
app.get('*', (req, res) => {
    res.sendFile(resourceDirectory + '/index.html');
});
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});



server.listen(port, () => {
    console.log('Express is listening on port', port);
});

/**
 * @description function used for connect to central server, it uses tcp
 * and register event handlers when connected. Also, if error occured or connection is closed, it tries connecting to it repeatedly with some time interval (3000ms default) 
 * @param {number} interval- time interval it retries connection in, unit is ms
 */
function connectToCentralServer(interval) {
    let socketForCentralServer = net.connect(portForCentralServer, "localhost", function () {
        console.log("Connection to Central Server Success!!");
        app.socketForCentralServer = socketForCentralServer;
        if (connectRegularly) {
            clearInterval(connectRegularly);
            connectRegularly = null;
        }
        
        socketForCentralServer.on('close', function () {
            console.log('Connection to Central Server closed');
            if (!connectRegularly) {
                connectRegularly = setInterval(connectToCentralServer, interval);
            }
        });

        socketForCentralServer.on('data', function(data){
            commandHandler(data, io);
        });
    });
    socketForCentralServer.on('error', function (err) {
        //console.log('err occured while connecting');
        if (!connectRegularly) {
            connectRegularly = setInterval(connectToCentralServer, interval);
        }
    });
}
connectToCentralServer(3000);

/**
 * @description used for handling data from central server
 * when received data, it sends data using resonse objects in the corresponding queue 
 * @param {JSON} data- data from central server
 * @param {Object} io - socket.io object 
 */
function commandHandler(data, io) { //handler for data from central server
    console.log(typeof (data));
    data = JSON.parse(data);
    console.log("IN CommandHandler: " + JSON.stringify(data));
    console.log("Receiver msg: " + data.header.command);
    if(data.header.type === 'Response'){
        returnCallback(data, data.callback_id);
    }
    else if(data.header.type === 'Request'){
        switch (data.header.command) {
            case "networkTest":
                let msg = {};
                axios.post('/api/speedtest').then((res) => {
                    msg = {
                        header: {
                            type: 'Response',
                            token: "",
                            command: 'networkTest',
                            source: 'WEB',
                            dest: 'CONNETO',
                            statusCode: 200
                        },
                        body: {
                            ip: res.data.data.client.ip,
                            latency: res.data.server.ping,
                            download: body.data.speeds.download,
                            userId: data.body.userId
                        }
                    }
                }).catch((error) => {
                    msg = {
                        header: {
                            type: 'Response',
                            token: "",
                            command: 'networkTest',
                            source: 'WEB',
                            dest: 'CONNETO',
                            statusCode: 400
                        }
                    }
                }).then(() => {
                    sendMsgToCentralServer(JSON.stringify(msg));
                })
                break;

            default:
                console.log("Unvalid Command: " + data.command);
        }
    }
}

/*if (process.env.NODE_ENV == 'development') {
    console.log('Server is running on development mode');
    const config = require('../webpack.dev.config');
    const compiler = webpack(config);
    const devServer = new WebpackDevServer(compiler, config.devServer);
    devServer.listen(
        devPort, () => {
            console.log('webpack-dev-server is listening on port', devPort);
        }
    );
}*/

function returnCallback(msg, callbackId){
    if(!app.callbackForCentralServer[callbackId]){
        throw new Error('Invalid callback id');
    }
    app.callbackForCentralServer[callbackId](msg);
    delete app.callbackForCentralServer[callbackId];
}


///////////////////////////////
///socket.io 설정 부분/////////

io.on('connection', (socket) => {
    console.log("socket is connected");
    socket.userId = "";
    socket.on('user:join', (data) => {
        joinRoom(socket, data).then((socket)=>{
            return updateSocketInfo(socket, data);
        }).then((userId)=>{
            return initialize(io, socket, data);
        })
        .then((socket)=>{return getCountsOfUserInRoom(data.userId, data.room)})
        .then((counts)=>{
            if(counts === 1){
                broadcastToRoom(socket, data.room, "user:join", {userId: data.userId})                
            }
        })
        .catch(socketIoErrHandler);
    });
    socket.on('user:left', (data) => {
        if(data.userId == ""){
            return;
        }
        leaveRoom(socket, data).then((result)=>{
                return updateSocketInfo(socket, data);
            })
            .then((socket)=>(getCountsOfUserInRoom(data.userId, data.room)))
            .then(counts=>{
                if(counts == 0){
                    io.to(data.room).emit('user:left', {userId: data.userId});
                }
            })
    });

    socket.on('send:message', (data) => {
        console.log("sended message " + JSON.stringify(data));
        getUsersInRoom(io, data.room).then(result=>{
            console.log(JSON.stringify(result));
        });
        if(getSocketsInRoom(data.room).includes(socket.id)){
            io.to(data.room).emit("send:message", data.msg);
        }
    });

    socket.on('disconnecting', function () {
        console.log('disconnecting ');
        let rooms=Object.keys(socket.rooms).slice(1);
        let userId = socket.userId;
        rooms.map((room, index, array)=>{
            getCountsOfUserInRoom(userId, room).then(counts=>{
                if(counts == 0){
                    console.log("room: " + room);
                    return io.to(room).emit('user:left', {userId})
                }
            })
        })
    });
});

function initialize(io, socket, data){
    return getUsersInRoom(io, data.room).then(
        (users) => {
            console.log(JSON.stringify(users));
            socket.emit('init', { users, room: data.room });
            return socket
        }
    )
}

function joinRoom(socket, data){
    return new Promise((resolve, reject)=>{
        socket.join(data.room, err=>{
            if(err) reject(err);
            resolve(socket);
        })
    })
}

function leaveRoom(socket, data){
    return new Promise((resolve, reject)=>{
        socket.leave(data.room, err=>{
            if(err) return reject(err)
            resolve(socket)
        })
    })
}

function updateSocketInfo(socket, data){
    return new Promise((resolve, reject)=>{
        socket.userId = data.userId;
        console.log("updateSocketInfo: " +  socket.userId);
        resolve(socket.userId);
    })
}

function getUserIdBySocketId(socketId){
    if(io.of('/').connected[socketId]){
        console.log("getUserIDBySocketId: " + io.of('/').connected[socketId].userId);
        return io.of('/').connected[socketId].userId
    }
    //throw new Error("fuck");
}

function broadcastToRoom(socket, room, event, data){
    console.log("Broadcasting to room: " + room + "data: " + JSON.stringify(data));
    let rooms = Object.keys(socket.rooms);
    if(!rooms.includes(room)){
        throw new Error("socket: " + socket.id +  " is not in this room: " + room);
    }
    socket.broadcast.to(room).emit(event, data);
}

function getCountsOfUserInRoom(userId, room){
    return new Promise((resolve, reject)=>{
        if(userId=="") return resolve(-1);
        getSocketsInRoom(room).then((socketIds)=>{
            let counts = socketIds.reduce((acc, element)=>{
                if(getUserIdBySocketId(element) === userId) return acc + 1;
            }, 0)
            resolve(counts);            
            console.log(counts + " " + userId + " is in the room: " + room);
        })
    })
}

function getSocketsInRoom(room){
    return new Promise((resolve, reject)=>{
        io.in(room).clients((error, clients)=>{
            if(error){
                return reject(error);
            }
            resolve(clients)
        })
    })
}

function socketIoErrHandler(err){
    console.log(err)
}

function getUsersInRoom(io, room){
    return new Promise((resolve, reject)=>{
        io.in(room).clients((error, clients)=>{
            if(error) return reject(error);
            console.log(JSON.stringify(clients));
            resolve(clients.map((element, index)=>{
                return getUserIdBySocketId(element);
            }).filter((element, index, array)=>{
                return array.indexOf(element) == index;
            }))
        })
    })
}
/////////////////////////////
/////////////////////////////