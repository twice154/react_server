import React, { Component } from 'react';
class MessageFormforUnlogined extends Component {
	constructor(props) {
		super(props);
		this.state = {  }
	}
	componentDidMount(){
		this.props.joinRoom(this.props.room,this.props.currentUser)
	}
	componentWillUnmount(){
		this.props.leaveRoom(this.props.currentUser)
	}
	render() { 
		return ( <div className='message_form' onClick={()=>{alert('로그인해 주세요.')}}>
			<form className='d-flex' style={{border:'0.5px solid black'}}>
				
					<textarea
						rows={2}
						cols={30}
						disabled
						style={{resize:'none'}}
					/>
					<div style={{backgroundColor:'grey', width:'20%', cursor:'pointer'}}>
					<div>입력</div>
					<div>도네하기</div>
					</div>
				
			</form>
	</div> )
	}
}
 
export default MessageFormforUnlogined;
