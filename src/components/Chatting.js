import React from 'react';
import update from 'react-addons-update';
import io from 'socket.io-client';
import {connect} from 'react-redux';
import {getStatusRequest} from 'actions/authentication';

var socket=null;

class Chatting extends React.Component{
	componentWillMount(){
		this.props.connect().then(this.props.getStatus)
		.then((userId)=>{
			if(userId){
				joinRoom(this.props.room, userId)
			}
		})
		.catch(errHandler)
	}

	componentWillUnmount(){
		this.props.getStatus()
			.then((result)=>{
				if(result){
					return leaveRoom(result)
				}
			})
			.then(this.props.disconnect)
			.catch(errHandler)
	}

	componentWillReceiveProps(nextProps){
		if(this.props.currentUser && nextProps.currentUser!=this.props.currentUser){
			this.props.leaveRoom(this.props.currentUser);
		}
	}

	render(){
		return(
			<div>
				<UserList users={this.props.users}/>
				<MessageList messages={this.state.messages}/>
				{this.props.currentUser?
				<MessageForm onMessageSubmit={this.props.onMessageSubmit}
							 user={this.props.currentUser}/>
				:undefined
				}
			</div>
		)
	}
}

	

class UserList extends React.Component{

	render(){
		return (
			<div className='users'>
				<h3>Online Users</h3>
				<ul>
					{
						this.props.users.map((user, i) => {
							return (
								<li key={i}>
									{user}
								</li>
							);
						})
					}
				</ul>
			</div>
		)
	}
}

class Message extends React.Component{
	render(){
		return (
			<div className="message">
				<strong>{this.props.user} :</strong>
				<span>{this.props.text}</span>
			</div>
		)
	}
}

class MessageList extends React.Component {
	render(){
		return(
			<div className='messages'>
				<h2>Conversation : </h2>
				{
					this.props.messages.map((message, i)=>{
						return (
							<Message
								key={i}
								user={message.user}
								text={message.text}
							/>
						);
					})
				}
			</div>
		)
	}
}

class MessageForm extends React.Component {

	constructor(props){
		super(props);
		this.state={
			text: '',
			isAuth: false
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);

	}

	handleSubmit(e){
		e.preventDefault();
		var message = {
			user: this.props.user,
			text: this.state.text
		};
		this.props.onMessageSubmit(message);
		this.setState({text: ''});
	}

	handleChange(e){
		this.setState({text: e.target.value});
	}

	render(){
		return(
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

const mapStateToProps = (state) =>{
	return{
		status: state.authentication.status
	};
};

const mapDispatchtoProps = (dispatch) => {
	return {
		getStatusRequest: ()=> {
			return  dispatch(getStatusRequest());
		}
	};
}

export default connect(mapStateToProps, mapDispatchtoProps)(Chatting);