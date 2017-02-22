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
var users = [];
io.sockets.on('connection', (socket) =>{
    console.log("socket is connected");
    socket.on('user:joined', (data)=>{
        console.log(data + " has joined");
        console.log(users);
        socket.broadcast.emit('user:join', {name: data});
        users.push(data);
    });

    socket.on('user:left', (data)=>{
        console.log(data.name + " has left");
        users.splice(users.indexOf(data.name), 1);
        socket.broadcast.emit('user:left', {name: data.name});
    })

    socket.on('send:message', (data)=>{
        socket.broadcast.emit("send:message", data);
    });

    socket.on('disconnect', function(){
        console.log("user disconnected");
    });
    socket.emit('init', users);
});

/////////////////////////////
/////////////////////////////
