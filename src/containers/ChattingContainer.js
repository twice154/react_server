import React, { Component } from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { getStatusRequest } from 'modules/authentication';
import update from 'immutability-helper';
import { Chatting } from 'components';

var socket = {};

class ChattingContainer extends Component {
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

    init(data) {
        console.log("init has been arrived");
        this.setState({
            users: data.users,
            messages: [],
            text: [],
            room: data.room,
            currentUser: this.props.status.get('currentUser')
        });
    }

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

    disconnectToIoServer() {
        return Promise.resolve().then(() => {
            return socket.disconnect();
        })
    }

    joinRoom(room, userId) {
        return Promise.resolve().then(() => {
            return socket.emit('user:join', { userId, room });
        })
    }

    leaveRoom(userId) {
        return Promise.resolve().then(() => {
            socket.emit('user:left', { userId, room: this.state.room })
            return this.setState(update(this.state, {
                room: { $set: "" }
            }))
        })
    }

    onReceiveMsg(msg) {
        console.log("send:message has arrived")
        this.setState(update(this.state, {
            messages: { $push: [msg] }
        }));
    }

    onUserJoin(data) {
        console.log('new user has joined');
        this.setState(update(this.state, {
            users: { $push: [data.userId] },
            messages: { $push: [{ user: 'APPLICATION BOT', text: data.userId + " Joined" }] }
        }))
    }

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

    handleMessageSubmit(msg) {
        //this.onReceiveMsg(msg);
        socket.emit('send:message', { msg: msg, room: this.props.room });
    }

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
            <div>
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
                    connected={this.state.connected} />
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