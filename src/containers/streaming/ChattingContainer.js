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
import styled from 'styled-components'
import { getReactoSettingForViewer } from '../../modules/reacto';
import throttle from 'lodash.throttle';


var socket = {};

export class ChattingContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { users: [], messages: [], text: '',count:0,appendchild1:[],appendchild2:[],appendchild3:[],appendchild4:[],appendchild5:[],appendchild6:[],
                       reactos:[] };
        // new Promise((res,rej)=>{
            
        // }).then(()=>{
        //     this.reactoActiveThrottled=throttle(this.reactoActive,parseInt(this.props.data.resetTime)*1000+10)
        //     console.log(parseInt(this.props.data.resetTime))

        // }).catch(err=>console.log(err))
        this.init = this.init.bind(this);
        this.onUserJoin = this.onUserJoin.bind(this);
        this.onUserLeft = this.onUserLeft.bind(this);
        this.onReceiveMsg = this.onReceiveMsg.bind(this);
        this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
        this.connectToIoServer = this.connectToIoServer.bind(this);
        this.leaveRoom = this.leaveRoom.bind(this);
        this.joinRoom=this.joinRoom.bind(this)
        this.reactoActived=this.reactoActived.bind(this)
        this.reactoActive=this.reactoActive.bind(this)
        this.reactoMinus=this.reactoMinus.bind(this)
        this.props.getReactoSetting(this.props.room).catch(err=>console.log(err))
       /**
	 * 소켓으로 서버에 접속 후 방에 join
     * TODO: getstatus를 여기서 하면 헤더랑 이중으로 정보를 체크하게 된다. 
	 */
        this.connectToIoServer()
        .catch((err) => {
            console.log(err);
        })
    }
    // componentDidMount(){
    //     this.props.getReactoSetting(this.props.room).catch(err=>console.log(err))
    //     console.log(this.props.room)
    // }
	// static getDerivedStateFromProps(nextProps, prevState){
    // }

	/**
	 * 채팅방에서 나간 후 socket 연결 끊기.
	 */
	componentWillUnmount() {
		return this.leaveRoom(this.props.currentUser)
		.then(this.disconnectToIoServer)
		.catch(err=>{console.log(err)})
	}
    componentDidUpdate(){
        console.log(this.props.room)
        if(!this.props.currentUser){
            
        }
        console.log(this.props.currentUser)
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
            room: data.room,
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
        
            console.log("CONNECTIng to SERVER");
            socket = io.connect("http://localhost:3000", { 'forceNew': true });
            socket.on('init', this.init);
            socket.on('send:message', this.onReceiveMsg);
            socket.on('user:join', this.onUserJoin);
            socket.on('user:left', this.onUserLeft);
            socket.on('reacto',this.reactoActived)
            socket.on('reactoMinus',this.reactoMinus)
            return Promise.resolve()
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
        console.log(userId)
        console.log(this.props.currentUser+'1')
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
        
            socket.emit('user:left', { userId, room: this.state.room })
            return Promise.resolve()
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
     * 
     * @param {object} data - {index:몇번 버튼이 눌렸는지 알기 위해.total:'총 시청자 수',reactos:'버튼을 몇명이 눌렀는지=>리엑토'}
     * @description
     *  다른사람이 리엑토를 눌렀을때 +1을 보여주기 위한 함수.
     * ToDo: on off 시킬 수 있도록 기능을 만든다.
     */
    reactoActived(data){
        console.log(12345)
        console.log(data)
        var count = this.state.count++
        var plusOne = 'appendchild'+data.index
        var reactoProgress=[]
        data.reactos.map((value,index)=>{
            console.log('6번')
            if(value===0){
                reactoProgress.push(0)
            }else{
                var height=value/data.total/this.props.data.percent*10000
                console.log('width:',height)
                if(height>100){
                    reactoProgress.push(100)
                }else{
                    reactoProgress.push(height)
                }
            }
        })
        console.log(reactoProgress)
        console.log(plusOne)
        this.setState({[plusOne]:[...this.state[plusOne],<OneOne id={count+'count'} style={{position:'absolute',right:`${(count%2)*(Math.random()*5+5)+Math.random()*5}px`}} key={count} onAnimationEnd={()=>{
            var appendchild= [...this.state[plusOne]]
            appendchild.shift()
            this.setState({[plusOne]:[...appendchild]})}}>+1</OneOne>],reactos:reactoProgress})
    }
    /**
     * 리엑토를 누르는 함수.
     */
    reactoActive(index){
        var data={index,room:this.props.room}
        socket.emit('reacto',data)
        console.log(this.props.data.resetTime)
        setTimeout(()=>{
            console.log('123')
            console.log(data)
        socket.emit('reactoMinus',data)
        },this.props.data.resetTime*1000)
    }
    reactoMinus(data){
        var reactoProgress=[]
        data.reactos.map((value,index)=>{
            console.log('6번')
            if(value===0){
                reactoProgress.push(0)
            }else{
                var width=value/data.total/this.props.data.percent*10000
                if(width>100){
                    reactoProgress.push(100)
                }else{
                    reactoProgress.push(width)
                }
            }
        })
        console.log(reactoProgress)
        this.setState({reactos:reactoProgress})
    }
// /**
//  * @description
//  *  현재 로그인 되어있는지 상태를 불러온다.
//  *  이렇게 하는 이유는- 자동로그인 시 유저가 홈페이지를 거치지 않고 바로 비제이 스트리밍 페이지로 갈 수 도 있기 때문.
//  *  ->redux.store에 스테이트가 init으로 되어있기 때문.
//  */
//     getStatus() {
//         console.log("get Stattus");
//         return this.props.getStatusRequest()
//             .then(() => {
//                     this.setState(update(this.state, {
//                         currentUser: {
//                             $set: this.props.status.get('currentUser')
//                         }
//                     }))
//                     return this.state.currentUser;
//             })
//     }

    render() {
        return (
            <div style={{border:'black solid 2px',height:'100%',width:'340px'}}>
                <Chatting room={this.props.room}
                    users={this.state.users}
                    messages={this.state.messages}
                    onMessageSubmit={this.handleMessageSubmit}
                    currentUser={this.props.currentUser}
                    connectToServer={this.connectToIoServer}
                    joinRoom={this.joinRoom}
                    leaveRoom={this.leaveRoom}
                    getStatus={this.props.getStatusRequest}
                    connected={this.state.connected}
                    donationToggle={this.props.donationToggle}
                    reacto={this.reactoActive}
                    reactos={this.state.reactos}
                    appendchilds={[this.state.appendchild1,this.state.appendchild2,this.state.appendchild3,this.state.appendchild4,this.state.appendchild5,this.state.appendchild6]}
                    />
                    {/* <div style={{position:'relative'}}>
            {this.state.appendchild1.map((value,index)=>{
                return value
            })}
            </div> */}
            </div>
        );
    }
}

const OneOne = styled.div`
animation-name: plusone;
animation-duration: 1.5s;
text-align:right;
position: absolute;
top: -5px;
z-index:9999;


@keyframes plusone{
    100%{
        transform:translate(0,-25px);
        opacity:0.1
    }
}

`


const mapStateToProps = (state) => {
    return {
        currentUser:state.authentication.getIn(['status','currentUser']),
        data:state.reacto.data
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getStatusRequest: () => {
            return dispatch(getStatusRequest())
        },
        getReactoSetting:(a)=>dispatch(getReactoSettingForViewer(a))
    }
}

ChattingContainer.propTypes = {

};

export default connect(mapStateToProps, mapDispatchToProps)(ChattingContainer);