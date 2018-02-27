/**
 * 채팅 컴포넌트.
 * @author G1
 * @logs // 18.2.26
 */

import React from 'react';
import { getStatusRequest } from 'modules/authentication';
import { connect } from 'react-redux';



class Chatting extends React.Component {
	
	componentWillMount() {
		
		this.props.getStatus().then(()=>{
			const userId =this.props.userId
		console.log(userId)
			this.props.connectToServer()
			return Promise.resolve(userId)
		})
			.then((userId) => {
					console.log("room: " + this.props.room);
					this.props.joinRoom(this.props.room, userId)
			})
			.catch((err) => {
				console.log(err);
				this.props.joinRoom(this.props.room, "");
			})
	}

	componentWillUnmount() {
		this.props.getStatus().then((result)=>{
			return this.props.leaveRoom(result);
		}).then(this.props.disconnect)
		.catch(err=>{console.log(err)})
	}

	componentWillUpdate(nextProps, nextState) {
		if (this.props.currentUser !== nextProps.currentUser && this.props.currentUser!=="") {
			console.log('logouted!!!!');
			this.props.leaveRoom(this.props.currentUser);
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

const UserList = (props) => {
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

const Message = (props) => {
	return (
		<div className="message">
			<strong>{props.user} :</strong>
			<span>{props.text}</span>
		</div>
	);
};


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

class MessageForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			text: '',
			isAuth: false
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);

	}

	handleSubmit(e) {
		e.preventDefault();
		var message = {
			user: this.props.user,
			text: this.state.text
		};
		this.props.onMessageSubmit(message);
		this.setState({ text: '' });
	}

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