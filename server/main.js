import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import session from 'express-session';
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

const dbServer = orientDB({
    host: 'localhost',
    port: 2424,
    username: 'root',
    password: 'ssh2159'
});

const db = dbServer.use('usersinfo');
const server = http.Server(app);
const io = socket_io.listen(server);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, './../public')));
app.use('/api', api);
app.get('*', (req, res)=>{
    res.sendFile(path.resolve(__dirname, './../public/index.html'));
});
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});



server.listen(port, () => {
    console.log('Express is listening on port', port);
});
if(process.env.NODE_ENV == 'development') {
    console.log('Server is running on development mode');
    const config = require('../webpack.dev.config');
    const compiler = webpack(config);
    const devServer = new WebpackDevServer(compiler, config.devServer);
    devServer.listen(
        devPort, () => {

            console.log('webpack-dev-server is listening on port', devPort);
        }
    );
}

///////////////////////////////
///socket.io 설정 부분/////////
var users = {};
var rooms = {};
io.sockets.on('connection', (socket) =>{
    console.log("socket is connected");
    socket.on('user:joined', (data)=>{
        console.log(data + " has joined");
        if(!rooms[data.room]){
            rooms[data.room] = [];
        }
        if(users[data.name]){
            let prevroom = users[data.name];
            console.log(data.name + " has left from " + prevroom);
            rooms[prevroom].splice(rooms[prevroom].indexOf(data.name), 1);
            users[data.name]='';
            socket.leave(prevroom);
            socket.broadcast.to(prevroom).emit('user:left', {name: data.name});
        }
        socket.join(data.room);
        socket.emit('init', rooms[data.room]);
        socket.broadcast.to(data.room).emit('user:join', {name: data.name});
        rooms[data.room].push(data.name);
        users[data.name] = data.room;
        console.log(rooms);
    });

    socket.on('user:left', (data)=>{
        let prevroom = users[data.name];
        console.log(data.name + " has left from " + prevroom);
        rooms[prevroom].splice(rooms[prevroom].indexOf(data.name), 1);
        users[data.name]='';
        socket.leave(prevroom);
        socket.broadcast.to(prevroom).emit('user:left', {name: data.name});
    });

    socket.on('send:message', (data)=>{
        socket.broadcast.to(data.room).emit("send:message", data.msg);
    });

    socket.on('disconnect', function(){
        console.log("user disconnected");
    });
});

/////////////////////////////
/////////////////////////////
