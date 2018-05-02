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
import { shiftDonation,donationFunctions } from './routes/donation/donation.controller';
import { emitReactoButton } from './routes/reacto/reacto.controller';

const appToClient = express();
const appToDonation = express();
const port = 3000;
const devPort = 4000;

const config = require('./config')
const dbServer = orientDB(config.dbServerConfig);

const db = dbServer.use(config.UserDBConfig);
const serverToClient = http.Server(appToClient);
const serverToDonation = http.Server(appToDonation);
const ioToclient = socket_io(serverToClient);
const ioToDonation = socket_io(serverToDonation);

var reactos={}//streamerId를 property로 같고있고 이들은 다 배열이다.

appToClient.use(morgan('dev'));
appToClient.use(cookieParser());
appToClient.use(bodyParser.json());
appToClient.use(bodyParser.urlencoded({extended: false}))


appToClient.use('/api', api);

var resourceDirectory = "";
if(process.env.NODE_ENV === 'development'){ 
    resourceDirectory = path.resolve(__dirname, './../public');
}
else{
    resourceDirectory = path.resolve(__dirname, './../build');
}
//localhost:3000으로 접속하면 볼 수 있음.
appToClient.use('/static',express.static(__dirname+'./../images'))//img파일,음성파일들을 읽어서 쓸 수 있게 하기 위함 byG1

appToClient.use('/', express.static(resourceDirectory));

appToClient.get('*', (req, res) => {
    res.sendFile(resourceDirectory + '/index.html');
});
appToClient.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
serverToClient.listen(port, () => {
    console.log('Express is listening on port', port);
});


//donation, reacto server 
appToDonation.get('/donation/:streamSocketId',(req,res)=>{
    res.sendFile(resourceDirectory +'/donation.html')
})
appToDonation.get('/reacto/:streamSocketId',(req,res)=>{
    res.sendFile(resourceDirectory +'/reacto.html')
})
serverToDonation.listen(3001,()=>{
    console.log('donation server is listening on port')
})
///////////////////////////////
///socket.io 설정 부분/////////

/**
 * socket for donation&Reacto
 */
exports.ioToDonation = ioToDonation;
ioToDonation.on('connection',(socket)=>{
    socket.on('joinDonaRoom',(streamSocketId)=>{
        socket.join(streamSocketId)
        console.log('joined at ',streamSocketId,'donation')
    })

    socket.on('joinReactoRoom',(streamSocketId)=>{
        socket.join(streamSocketId)
        console.log('joined at ',streamSocketId,'reacto')
    })
   
    socket.on('donaEnd',(streamSocketId)=>{
        console.log(111)
        shiftDonation(streamSocketId)
        donationFunctions(streamSocketId)
        return 0;
    }) 
console.log("socketToDonation is connected")
    
})




/**
 * socket for client
 */
ioToclient.on('connection', (socket) => {
    console.log("socketToclient is connected");
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
                    ioToclient.to(data.room).emit('user:left', {userId: data.userId});
                }
            })
    });

    socket.on('send:message', (data) => {
        console.log("sended message " + JSON.stringify(data));
        getUsersInRoom(data.room).then(result=>{
            console.log(JSON.stringify(result));
        });
        ioToclient.to(data.room).emit("send:message", data.msg);
    });

    socket.on('disconnecting', function () {
        console.log('disconnecting ');
        let rooms=Object.keys(socket.rooms).slice(1);
        let userId = socket.userId;
        rooms.map((room, index, array)=>{
            getCountsOfUserInRoom(userId, room).then(counts=>{
                if(counts == 0){
                    console.log("room: " + room);
                    return ioToclient.to(room).emit('user:left', {userId})
                    /*getUsersInRoom(room).then(result=>{
                        consol
                    })*/
                }
            })
        })
    });
    /**
     * reacto 버튼을 누군가 누르면 본인을 포함해서 reacto 버튼에 +1효과를 준다.
     * TODO: progress bar 연결하기.
     * by g1
     */
    socket.on('reacto',(data)=>{
        console.log(data)
        if(!reactos[data.room]){
            console.log('리엑토를 처음 사용.')
            reactos[data.room]=[0,0,0,0,0,0]
            reactos[data.room][data.index-1]=1
        }else{
            console.log('reacto +1')
            reactos[data.room][data.index-1]++
        }
        console.log('reacto plus',reactos[data.room][data.index-1])
        var reactoInfo = {index:data.index,reactos:reactos[data.room]} //index(몇번 버튼이 눌렸는지),que의 length(몇명이 눌렀는지),시청자수(몇명이 보는지 )
        new Promise((resolve,reject)=>{
            ioToclient.in(data.room).clients((error, clients)=>{
                if(error){
                    throw new Error("");
                }
                console.log(clients)
               reactoInfo.total=clients.length
                console.log(reactoInfo.total+'123')
                resolve(1)
            })
        }).then(()=>{
            console.log('reacto btn');
            console.log('reactoInfo: ',reactoInfo)
            // client에 reacto를 활성화 시켜 +1효과를 준다.
            ioToclient.to(data.room).emit("reacto",reactoInfo)
            emitReactoButton({streamerId:data.room,total:reactoInfo.total,reactos:reactos[data.room]})
        }).catch(err=>console.log(err))
        

    })
    /**
     * reacto 버튼을 누르고 5초가 지나면 클라이언트가 다음을 실행한다.
     * count에서 -1을 해준다.
     */
    socket.on('reactoMinus',(data)=>{
        
        console.log(reactos[data.room][data.index-1])
        if(reactos[data.room][data.index-1]<0){
            reactos[data.room][data.index-1]=0
        }else{
            reactos[data.room][data.index-1]--
        }
        console.log('reacto minused' + reactos[data.room])
        var reactoInfo = {index:data.index,reactos:reactos[data.room]} //index(몇번 버튼이 눌렸는지),que의 length(몇명이 눌렀는지),시청자수(몇명이 보는지 )
        new Promise((resolve,reject)=>{
            ioToclient.in(data.room).clients((error, clients)=>{
                if(error){
                    throw new Error("");
                }
                console.log(clients)
               reactoInfo.total=clients.length
                console.log(reactoInfo.total+'123')
                resolve(1)
            })
        }).then(()=>{
            console.log('reacto btn');
            console.log('reactoInfo: ',reactoInfo)
            // client에 reacto를 활성화 시켜 +1효과를 준다.
            ioToclient.to(data.room).emit("reactoMinus",reactoInfo)
        }).catch(err=>console.log(err))
    })
    
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
    if(ioToclient.of('/').connected[socketId]){
        console.log("getUserIDBySocketId: " + ioToclient.of('/').connected[socketId].userId);
        return ioToclient.of('/').connected[socketId].userId
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
        ioToclient.in(room).clients((error, clients)=>{
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
        ioToclient.in(room).clients((error, clients)=>{
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
