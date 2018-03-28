/**
 * 채팅 컨테이너. socket-io로 채팅 서버와 연결함.
 * @author G1
 * @logs // 18.2.26
 */
import React, { Component } from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { getStatusRequest } from '../../modules/authentication';
import update from 'immutability-helper';
import { Chatting } from './Chatting';
import Donation from './Donation'

var socket = {};

export class ChattingContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { users: [], messages: [], text: '', room: '', currentUser: "" };
        this.init = this.init.bind(this);
        this.onUserJoin = this.onUserJoin.bind(this);
        this.onUserLeft = this.onUserLeft.bind(this);
        this.onReceiveMsg = this.onReceiveMsg.bind(this);
        this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
        this.getStatus = this.getStatus.bind(this);
        this.connectToIoServer = this.connectToIoServer.bind(this);
        this.leaveRoom = this.leaveRoom.bind(this);
    }
/**
 * 맨 처음 서버와 연결시켜 정보를 얻어오기 위한 함수. 
 * @param {object} data - 채팅 서버의 정보. 
 * @description
 * data.users -채팅 참여자들 목록
 * data.room -채팅하고 있는 방의 이름.
 */
    init(data) {
        console.log("init has been arrived");
        this.setState({
            users: data.users,
            messages: [],
            text: [],
            room: data.room,
            currentUser: this.props.status.get('currentUser')
        });
        console.log('hihi')
    }
/** 서버랑 연결하여 이벤트를 송신한다.
 * @description
 *  'init' - 맨 처음 시작할때 등록하는 이벤트, 말그대로 init
 *  'send:message' - 메시지를 보낼때 등록하는 이벤트, 메시지 보낸 후 this.onReceiveMsg를 실행한다.
 *  'user:join' - 새로운 유저가 접속했을때 등록하는 이벤트 , 송신 후 onUserJoin실행.
 *  'user:left' - 유저가 나갔을때 등록하는 이벤트 ,송신 후 ounUserLeft실행.
 */
 connectToIoServer() {
        return Promise.resolve().then(() => {
            console.log("CONNECTIng to SERVER");
            socket = io.connect("http://localhost:3000", { 'forceNew': true });
            socket.on('init', this.init);
            socket.on('send:message', this.onReceiveMsg);
            socket.on('user:join', this.onUserJoin);
            socket.on('user:left', this.onUserLeft);
            return true;
        })
    }
/** 
 * @description
 *  서버랑 접속을 끊는다.
 */
    disconnectToIoServer() {
        return Promise.resolve().then(() => {
            return socket.disconnect();
        })
    }
/**
 * 채팅 방에 입장하는 함수
 * @param {string} room 
 * @param {string} userId 
 * @description
 *  페이지가 렌더링 되기 전에 방에 입장한다.
 */
    joinRoom(room, userId) {
        return Promise.resolve().then(() => {
            return socket.emit('user:join', { userId, room });
        })
    }
/**
 * 채팅 방에서 나가는 함수
 * @param {string} userId 
 * @desc
 *  페이지가 unmount될때 실행하여 방을 나간다.
 */
    leaveRoom(userId) {
        return Promise.resolve().then(() => {
            socket.emit('user:left', { userId, room: this.state.room })
            return this.setState(update(this.state, {
                room: { $set: "" }
            }))
        })
    }
/**
 * 메시지를 받아온다.
 * @param {object} msg {user:작성자,text:채팅내용}
 * 서버에서 메시지를 송출하면 실시간으로 받아온다.
 * 이때 브라우저의 채팅 목록도 실시간으로 업데이트 된다.
 */
    onReceiveMsg(msg) {
        console.log("send:message has arrived")
        this.setState(update(this.state, {
            messages: { $push: [msg] }
        }));
    }
/**
 * 다른 사용자가 채팅방에 입장하면 알려준다.
 * @param {object} data {userId:입장한 유저 아이디}
 */
    onUserJoin(data) {
        console.log('new user has joined');
        this.setState(update(this.state, {
            users: { $push: [data.userId] },
            messages: { $push: [{ user: 'APPLICATION BOT', text: data.userId + " Joined" }] }
        }))
    }
/**
 * 다른 사용자가 채팅방에서 퇴장하면 알려준다.
 * @param {object} data 
 */
    onUserLeft(data) {
        let index = this.state.users.indexOf(data.userId);
        this.setState(update(this.state, {
            users: {
                $splice: [[index, 1]]
            },
            messages: {
                $push: [{ user: 'APPLICATION BOT', text: data.userId + ' Left' }]
            }
        }))
    }
/**
 * 사용자가 채팅 메시지를 전송 하는 함수.
 * 어느 방송에 전송해 주는지도 알려준다.
 * @param {*} msg 
 */
    handleMessageSubmit(msg) {
        //this.onReceiveMsg(msg);
        socket.emit('send:message', { msg: msg, room: this.props.room });
    }
/**
 * @description
 *  현재 로그인 되어있는지 상태를 불러온다.
 *  이렇게 하는 이유는- 자동로그인 시 유저가 홈페이지를 거치지 않고 바로 비제이 스트리밍 페이지로 갈 수 도 있기 때문.
 *  ->redux.store에 스테이트가 init으로 되어있기 때문.
 */
    getStatus() {
        console.log("get Stattus");
        return this.props.getStatusRequest()
            .then(() => {
                    this.setState(update(this.state, {
                        currentUser: {
                            $set: this.props.status.get('currentUser')
                        }
                    }))
                    return this.state.currentUser;
            })
    }

    render() {
        return (
            <div style={{border:'black solid 2px',height:'100%',width:'300px'}}>
                <Chatting room={this.props.room}
                    users={this.state.users}
                    messages={this.state.messages}
                    onMessageSubmit={this.handleMessageSubmit}
                    currentUser={this.props.status.get('currentUser')}
                    connectToServer={this.connectToIoServer}
                    disconnect={this.disconnectToIoServer}
                    joinRoom={this.joinRoom}
                    leaveRoom={this.leaveRoom}
                    getStatus={this.getStatus}
                    connected={this.state.connected}
                    userId={this.state.currentUser} 
                    donationToggle={this.props.donationToggle}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.get('status')
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getStatusRequest: () => {
            return dispatch(getStatusRequest())
        }
    }
}

ChattingContainer.propTypes = {

};

export default connect(mapStateToProps, mapDispatchToProps)(ChattingContainer);