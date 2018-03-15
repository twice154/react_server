/**
 * 채팅 컴포넌트.
 * @author G1
 * @logs // 18.2.26
 */

import React from 'react';
import {getStatusRequest} from '../modules/authentication'
import { connect } from 'react-redux';



export class Chatting extends React.Component {

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

	render() {
		return (
			<div>
				<UserList users={this.props.users} />
				<MessageList messages={this.props.messages} />
				{this.props.currentUser !== "" ?
					<MessageForm onMessageSubmit={this.props.onMessageSubmit}
						user={this.props.currentUser} />
					: undefined
				}
			</div>
		)
	}
}
/** 유저 목록 
 * @param {object} props -{users:배열.}
*/
export const UserList = (props) => {
	return (
		<div className='users'>
			<h3>Online Users</h3>
			<ul>

				{
					props.users.map?
						props.users.map((user, i) => {
							return (
								<li key={i}>
									{user}
								</li>
							);
						})
						: undefined
				}
			</ul>
		</div>
	);
};
/**메시지 하나 */
export const Message = (props) => {
	return (
		<div className="message">
			<strong>{props.user} :</strong>
			<span>{props.text}</span>
		</div>
	);
};

/**
 * message들의 목록
 * @param {object} props {messages: 배열.}
 */
const MessageList = (props) => {
	return (
		<div className='messages'>
			<h2>Conversation : </h2>
			{
				props.messages ?
					props.messages.map((message, i) => {
						return (
							<Message
								key={i}
								user={message.user}
								text={message.text}
							/>
						);
					})
					: undefined
			}
		</div>
	);
}

export class MessageForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			text: '',
			isAuth: false
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);

	}
/**
 * 메세지 제공.
 * @param {object} e 
 */
	handleSubmit(e) {
		e.preventDefault();
		var message = {
			user: this.props.user,
			text: this.state.text
		};
		console.log('hihi')
		this.props.onMessageSubmit(message);
		this.setState({ text: '' });
	}
/**
 * 리얼 체인지.
 * @param {} e 
 */
	handleChange(e) {
		this.setState({ text: e.target.value });
	}

	render() {
		return (
			<div className='message_form'>
				<h3>Write new Message</h3>
				{
					<form onSubmit={this.handleSubmit}>
						{
							<input
								onChange={this.handleChange}
								value={this.state.text}
							/>
						}
					</form>
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