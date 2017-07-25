import React from 'react';
import update from 'react-addons-update';
import io from 'socket.io-client';
import {connect} from 'react-redux';
import {getStatusRequest} from 'actions/authentication';

var socket=null;

class Chatting extends React.Component{

	constructor(props){
		super(props);
		this.state = {users: [], messages:[], text: '', room: ""};
		this.init = this.init.bind(this);
		this.onUserJoin = this.onUserJoin.bind(this);
		this.onUserLeft = this.onUserLeft.bind(this);
		//this.onUserChangedName = this.onUserChangedName.bind(this);
		this.onReceiveMsg = this.onReceiveMsg.bind(this);
		this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
	}

	componentWillMount(){
		console.log("Compoenent did mount!");
		this.props.getStatusRequest().then(
			()=>{
				if(this.props.status.valid){
					socket = io.connect('http://localhost:4000', {'forceNew' : true});
					socket.on('init', this.init);
					socket.on('send:message', this.onReceiveMsg);
					socket.on('user:join', this.onUserJoin);
					socket.on('user:left', this.onUserLeft);
					console.log("status is valid: " + this.props.status.currentUser);
					socket.emit('user:join',{username: this.props.status.currentUser, room: this.props.room});
				}
			}
		)
	}

	componentWillUnmount(){
		console.log("Component will unmount");
		this.props.getStatusRequest().then(
			()=>{
				if(this.props.status.valid){
					//this.onUserLeft({name:this.props.status.currentUser});
					socket.emit("user:left", {username: this.props.status.currentUser});
					socket.disconnect();
				}
			}
		)
	}


	componentWillReceiveProps(nextProps){
		console.log("Component will receive props " + this.state.room + this.props.status.currentUser);
		if(socket&&this.props.status.currentUser){
			console.log("left signal emitted " +this.props.status);
			socket.emit("user:left", {username:this.props.status.currentUser});
			this.props.getStatusRequest();
		}
	}

	init(data){
		data.push(this.props.status.currentUser);
		this.setState({
			users: data,
			messages: [],
			text: [],
			room: this.props.room
		});
		//console.log("INIT: " + this.state.users);
	}

	onReceiveMsg(msg){
		let {messages} = this.state;
		messages.push(msg);
		this.setState({messages});
	}

	onUserJoin(data){
		console.log('new user has joined');
		this.setState(update(this.state,{
			users :{
				$push: [data.username]
			},
			messages: {
				$push: [{user:"APPLICATION BOT", text: data.username + " Joined"}]
			}
		}));
	}

	onUserLeft(data){
		let index = this.state.users.indexOf(data.username);
		this.setState(
			update(this.state, {
				users: {
					$splice: [[index, 1]]
				},
				messages: {
					$push: [{user: 'APPLICATION BOT', text: data.username + ' Left'}]
				}
			})
		);
	}

	handleMessageSubmit(msg){
		let {messages} = this.state;
		messages.push(msg);
		this.setState({messages});
		socket.emit('send:message', {msg:msg, room:this.props.room});
	}

	render(){
		return(
			<div>
				<UserList users={this.state.users}/>
				<MessageList messages={this.state.messages}/>
				{this.props.status.valid?
				<MessageForm onMessageSubmit = {this.handleMessageSubmit}
								user={this.props.status.currentUser}/>
				: undefined
				}
			</div>
		);
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