import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import morgan from 'morgan';
import orientDB from 'orientjs';

import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import api from './routes';
import fs from 'fs';
import http from 'http';
import socket_io from 'socket.io';

const app = express();
const port = 3000;
const devPort = 4000;

const config = require('./config')
const dbServer = orientDB(config.dbServerConfig);

const db = dbServer.use(config.UserDBConfig);
const server = http.Server(app);
const io = socket_io(server);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use('/api', api);


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

///////////////////////////////
///socket.io 설정 부분/////////

io.on('connection', (socket) => {
    console.log("socket is connected");
    socket.userId = "";
    socket.on('user:join', (data) => {
        joinRoom(socket, data).then((socket)=>{
            return updateSocketInfo(socket, data);
        }).then((userId)=>{
            return initialize(socket, data);
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
        getUsersInRoom(data.room).then(result=>{
            console.log(JSON.stringify(result));
        });
        io.to(data.room).emit("send:message", data.msg);
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
                    /*getUsersInRoom(room).then(result=>{
                        consol
                    })*/
                }
            })
        })
    });
});

function initialize(socket, data){
    return getUsersInRoom(data.room).then(
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
        io.in(room).clients((error, clients)=>{
        if(error){
            throw new Error("");
        }
        let counts = clients.reduce((acc, element)=>{
            if(getUserIdBySocketId(element) === userId) return acc + 1;
            return acc;
        }, 0)
        console.log(counts + " " + userId + " is in the room: " + room);
        resolve(counts);
    })})
}

function socketIoErrHandler(err){
    console.log(err)
}

function getUsersInRoom(room){
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
