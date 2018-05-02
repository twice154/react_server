import React from 'react';
import Donation from '../../containers/streaming/Donation';
export default class MessageForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			text: '',
			isAuth: false,
			modal:false
		};
		this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
		}

		componentDidMount(){
			this.props.joinRoom(this.props.room,this.props.currentUser)
		}
		componentWillUnmount(){
			this.props.leaveRoom(this.props.currentUser)
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
        this.textarea.focus()
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
				<button onClick={this.props.donationToggle}></button>
					<form className='d-flex' onSubmit={this.handleSubmit} style={{border:'0.5px solid black'}}>
						
							<textarea
								rows={2}
								cols={30}
								onChange={this.handleChange}
                                value={this.state.text}
                                ref={el=>this.textarea=el}
								style={{resize:'none'}}
							/>
							<div style={{backgroundColor:'grey', width:'20%', cursor:'pointer'}} onClick={this.handleSubmit}>
							<div className='container'>
							<div className='row'>입력</div>
							<div className='row'>도네하기</div>
							</div>
							</div>
						
					</form>
			</div>
		)
	}

}
