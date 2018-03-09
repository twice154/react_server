
'use strict'
var path = require('path');
var should = require('should');
var sinon = require('sinon');
require('should-sinon');
//var chai = require('chai');
//var chaiAsPromised = require("chai-as-promised");
//chai.use(chaiAsPromised);
//var chaiHttp = require('chai-http');
//var expect = chai.expect;
var proxyquire = require('proxyquire');

let dbstub = {query: (sql)=>{}}
let orientjsStub = ()=>{
    return{
        use: ()=>{
            return dbstub;
        }
    }
} 
var centralServer = proxyquire('../SeparateTcpServer', {
    'orientjs':orientjsStub,
    'net': {
        createServer: ()=>{
            return {
                on: ()=>{},
                listen: ()=>{}
            }      
        }
    }
});


class fakeSocket{
    write(msg, callback){
        this.msg = msg
        this.remotePort = 8403;
        callback();
    }

    on(event, callback){
        this.event = callback;
    }
};

describe('sendMsg', function () {
    let testsocket = new fakeSocket();
    let sendMsg = centralServer.sendMsg;
    let socketSpy;
    this.timeout(5000);

    before(() => {
        socketSpy = sinon.spy(testsocket, 'write');
    });

    beforeEach(() => {
        testsocket.write.resetHistory();
    });
    
    it('should send message for proper input', function(done){
        let msg = {command: 'getHosts', userId: 'aa'}
        sendMsg(testsocket, msg).should.be.fulfilled();
        testsocket.write.should.be.calledWith(JSON.stringify(msg))
        done();
    })

    it('should fail for sending circular object', function(){
        function msg(){
            this.self = this;
            this.a = "a";
        }
        let ms = new msg();

        return sendMsg(testsocket, ms).
            should.be.rejectedWith(
                new TypeError('Converting circular structure to JSON')
            );
    })
});

describe('isRegisteredUser', () => {
    let isRegisteredUser = centralServer.isRegisteredUser;
    dbstub.query = (sql)=>{
        if(sql.split("'")[1] === "aa") return Promise.resolve([{
            id: "aa",
            password: "bbbb"
        }])
        else{
            return Promise.resolve([]);
        }
    }

    before(()=>{
        sinon.spy(centralServer, 'isRegisteredUser');        
    });

    it('should resolves when succeed', ()=>{
        return isRegisteredUser('aa','bbbb').should.be.fulfilledWith('aa');
    });

    it('should be rejected when not a existing user', ()=>{
        return isRegisteredUser('fjdj', 'cccc').should.be
            .rejectedWith(new Error("Login failed: no such a id"));
    });

    it('should be rejected when password is wrong', ()=>{
        return isRegisteredUser('aa', 'sfdfsf').should.be
            .rejectedWith(new Error("Login failed: wrong password"));
    })

    after(() => {
        centralServer.isRegisteredUser.restore();
    });

});

describe('saveConnetoSocket', ()=>{

});

describe('deleteConnetoSocket', ()=>{

})

describe('getConnetoSocket',()=>{

})

describe('connetoDataHandler', function(){
    this.timeout(5000);
    let webSocket = new fakeSocket(),
        connetoSocket = new fakeSocket(),
        connetoDataHandler = centralServer.connetoSocketHandler.data;
        
    before(()=>{
        sinon.spy(centralServer, 'saveConnetoSocket');
        sinon.spy(webSocket, "write");
        sinon.spy(connetoSocket, "write");
    });

    beforeEach(() => {
        webSocket.msg = "", connetoSocket.msg = "";
        webSocket.write.resetHistory();
        connetoSocket.write.resetHistory();
        centralServer.saveConnetoSocket.resetHistory();
    });

    it('should send message to the web server', function(done){
        let data = JSON.stringify({dest: 'WEB', userId: "dsfuoqeoo3"});
        connetoDataHandler(data, connetoSocket, webSocket);
        setTimeout(() => {
            webSocket.write.calledOnceWith(data).should.equal(true);
            connetoSocket.write.notCalled.should.equal(true);
            done();
        }, 0); 
    });

    it('should send login approval to the Conneto client & save socket info', function(done){

        let data = {command: "isAccount", hostIp: "sdflweifwekew", userId: "assldjfliweio", userPW: "12334"};
        let isRegisteredUserStub = sinon.stub(centralServer, "isRegisteredUser");
        isRegisteredUserStub.resolves(data.userId);
        connetoDataHandler(JSON.stringify(data), connetoSocket, webSocket);
        isRegisteredUserStub.calledOnceWith(data.userId, data.userPW).should.equal(true);
        setTimeout(() => {
            connetoSocket.write.calledOnceWith(JSON.stringify({
                command: "loginApproval", 
                isApproved: true, 
                userId: data.userId
            })).should.equal(true);
            webSocket.write.notCalled.should.equal(true);
            isRegisteredUserStub.restore();
            centralServer.saveConnetoSocket.calledOnceWith(data.userId, connetoSocket).should.equal(true);
            done();
        }, 0);
    });

    it('should send login disapproval to the Conneto client', function(done){
        let isRegisteredUserStub = sinon.stub(centralServer, 'isRegisteredUser').rejects(new Error('there is no such a id'));
    
        let data = {
            command: "isAccount", 
            hostIp: "sdsdsdsdsd", 
            userId: "sdfjlld", 
            userPW: "dsdfsfdsfsdf"
        };
        connetoDataHandler(JSON.stringify(data), connetoSocket, webSocket);
        isRegisteredUserStub.calledOnceWith(data.userId, data.userPW).should.equal(true);
        setTimeout(() => {
            connetoSocket.write.calledOnceWith(JSON.stringify({
                command: "loginApproval",
                isApproved: false
            })).should.equal(true);
            centralServer.saveConnetoSocket.notCalled.should.equal(true);
            isRegisteredUserStub.restore();
            done();
        }, 0);
    })

    it('should fail when command is invalid', function(){
        let data = {
            command: "unvalid command",
            dest: "sdds"
        };
        (function(){connetoDataHandler(JSON.stringify(data))}).should.throw(Error, {message: 'invalid command'});            
    })
})

describe('webDataHandler', function(){
    let webDataHandler = centralServer.webServerSocketHandler.data,
        connetoSocket = new fakeSocket(),
        webServerSocket = new fakeSocket();

    before(() => {
        sinon.spy(connetoSocket, 'write');
        sinon.spy(webServerSocket, 'write');
        sinon.stub(centralServer, 'getConnetoSocket').callsFake((userId)=>{
            if(userId === "aa") return Promise.resolve(connetoSocket);
            else return Promise.resolve();
        })
    });

    beforeEach(() => {
        connetoSocket.write.resetHistory();
        webServerSocket.write.resetHistory();
    });

    it('should send message to the conneto client', ()=>{
        let msg = {
            dest: 'CONNETO',
            userId: "aa",
            command:"getHosts"
        }
        webDataHandler(JSON.stringify(msg), webServerSocket)
        setImmediate(()=>{
            connetoSocket.write.should.be.calledWith(JSON.stringify({
                command: msg.command,
                userId: msg.userId
            }))
        })
    })
    
    it('should not send message when user is valid, but command is invalid', ()=>{
        let msg = {
            dest: 'CONNETO', 
            userId: "aa",
            command: "asdfsdkwe"
        }
        webDataHandler(JSON.stringify(msg), webServerSocket)
        setImmediate(()=>{
            webServerSocket.write.should.be.calledOnce(JSON.stringify({
                error:2,
                status: false
            })
        )})
                
    })
    it('should fail when failed to find the user\'s socket', ()=>{
        let msg = {
            dest: 'CONNETO',
            userId: "ADFSDFF",
            commmand: "getHost"
        };
        webDataHandler(JSON.stringify(msg), webServerSocket)
        setImmediate(()=>{
            webServerSocket.write.should.be.calledOnce(JSON.stringify({
                error: 1,
                status: false
            }))
        })
        
    })
})

