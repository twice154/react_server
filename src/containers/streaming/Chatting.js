/**
 * 채팅 컴포넌트.
 * @author G1
 * @logs // 18.2.26
 */

import React from 'react';
import {UserList, MessageForm, MessageList, MessageFormforUnlogined, Reacto} from '../../components/chatting'


export class Chatting extends React.Component {
	constructor(props){
		super(props)
		this.state={

		}
	}
/**
 * 리액트 링크로 움직여서 방이 바뀌거나 로그아웃하여 유저가 바뀔때 실행한다.
 * 방에서 나간 후 새로운 방에 접속
 * @param {object} nextProps 
 * @param {object} nextState 
 */
	componentWillMount(){
		console.log(this.props.currentUser)
	}
	componentDidMount(){
		console.log(this.props.currentUser)

	}
	// componentWillUpdate(nextProps, nextState) {
	// 	console.log(this.props.currentUser,nextProps.currentUser)
	// 	console.log(1)//TODO: if문의 조건식이 계속 실행됨. 성능 확인 필요.
	// 	if (this.props.currentUser !== nextProps.currentUser && this.props.currentUser!=="" || nextProps.room !==this.props.room) {
	// 		console.log('logouted!!!!');
	// 		this.props.leaveRoom(this.props.currentUser)
	// 		this.props.joinRoom(nextProps.room, nextProps.currentUser);
			
	// 	}
	// }
	componentDidUpdate(){
		if(this.listScroll.scrollHeight-this.listScroll.scrollTop<400){
			console.log('22')
			this.listScroll.scrollTop=this.listScroll.scrollHeight
		}

	}

	render() {
		return (
			<div style={{height:'100%'}}>
				<UserList users={this.props.users} />
				<MessageList messages={this.props.messages} scrollRef={(el)=>{this.listScroll=el}}/>
				<Reacto reacto={this.props.reacto} room={this.props.room} appendchilds={this.props.appendchilds} reactos={this.props.reactos}/>
				{this.props.currentUser !== "" ?
					<MessageForm onMessageSubmit={this.props.onMessageSubmit}
						user={this.props.currentUser} donationToggle={this.props.donationToggle} joinRoom={this.props.joinRoom} currentUser={this.props.currentUser} room={this.props.room}
						leaveRoom={this.props.leaveRoom}/>
					: <MessageFormforUnlogined joinRoom={this.props.joinRoom} currentUser={this.props.currentUser}room={this.props.room}
						leaveRoom={this.props.leaveRoom}/>
				}
			</div>
		)
	}
}



export default Chatting