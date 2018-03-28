/**
 * 채팅 컴포넌트.
 * @author G1
 * @logs // 18.2.26
 */

import React from 'react';
import {getStatusRequest} from '../../modules/authentication'
import { connect } from 'react-redux';
import {UserList, MessageForm, MessageList} from '../../components/chatting'


export class Chatting extends React.Component {
	constructor(props){
		super(props)
		this.state={

		}
	}
	/**
	 * 소켓으로 서버에 접속 후 방에 join
	 */
	async componentWillMount() {
		
		await this.props.connectToServer().then(this.props.getStatus)
			.then((userId) => {
					console.log("room: " + this.props.room);
					this.props.joinRoom(this.props.room, userId)
			})
			.catch((err) => {
				console.log(err);
				this.props.joinRoom(this.props.room, "");
			})
	}
	/**
	 * 채팅방에서 나간 후 socket 연결 끊기.
	 */
	async componentWillUnmount() {
		await this.props.getStatus().then((result)=>{
			console.log('ah')
			return this.props.leaveRoom(result);
		}).then(this.props.disconnect)
		.catch(err=>{console.log(err)})
	}
/**
 * 리액트 링크로 움직여서 방이 바뀌거나 로그아웃하여 유저가 바뀔때 실행한다.
 * 방에서 나간 후 새로운 방에 접속
 * @param {object} nextProps 
 * @param {object} nextState 
 */
	componentWillUpdate(nextProps, nextState) {
		console.log(1)
		if (this.props.currentUser !== nextProps.currentUser && this.props.currentUser!=="" || nextProps.room !==this.props.room) {
			console.log('logouted!!!!');
			this.props.leaveRoom(this.props.currentUser)
			this.props.joinRoom(nextProps.room, nextProps.currentUser);
			
		}
	}
	componentDidUpdate(){
		if(this.listScroll.scrollHeight-this.listScroll.scrollTop<400){
			console.log('22')
			this.listScroll.scrollTop=this.listScroll.scrollHeight
		}

	}

	render() {
		return (
			<div style={{height:'500px'}}>
				<UserList users={this.props.users} />
				<MessageList messages={this.props.messages} scrollRef={(el)=>{this.listScroll=el}}/>
				{this.props.currentUser !== "" ?
					<MessageForm onMessageSubmit={this.props.onMessageSubmit}
						user={this.props.currentUser} donationToggle={this.props.donationToggle}/>
					: undefined
				}
			</div>
		)
	}
}


const mapStateToProps = (state) => {
	return {
		status: state.authentication.status
	};
};

const mapDispatchtoProps = (dispatch) => {
	return {
		getStatusRequest: () => {
			return dispatch(getStatusRequest());
		}
	};
}

export default connect(mapStateToProps, mapDispatchtoProps)(Chatting);