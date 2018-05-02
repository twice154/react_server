import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


class LoginComponent extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			userId:"",
			password:""
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	/** 
	 * 로그인 후 성공이 아니면 패스워드를 지워준다.
	 */
	handleLogin(){
		let userId = this.state.userId;
		let pw = this.state.password;
		console.log(userId)
		this.props.onLogin(userId, pw)
		.catch(err=>{
			console.log(err);
		})
	}

	handleChange(e){ 
		let nextState = {};
		nextState[e.target.name] = e.target.value;
		this.setState(nextState);
	}

	handleKeyPress(e){
		if(e.charCode===13){
			
		    this.handleLogin();
		
        }
    }

	render(){
	 
    
			

		return (
			<Modal isOpen={this.props.modal} toggle={this.props.toggle} style={{marginTop:'100px',width:'350px'}}>
			<div style={{paddingTop:"40px",paddingLeft:"50px"}} className="d-flex flex-row">
			<h2 >Splendy</h2>
			<h3 style={{margin:0,paddingLeft:'10px',paddingTop:'5px'}}>로그인</h3>
			</div>
			<ModalBody style={{paddingTop:"0",paddingLeft:"30px"}}>
			<div className="card-body" style={{paddingBottom:"0"}}>
				<h5 className="card-title" >Id</h5>
					<input
							name="userId"
							type="text"
							className="validate"
							onChange={this.handleChange}
							value={this.state.userId}/>
			</div>
			<div className="card-body" style={{paddingBottom:"0"}}>
				<h5 className="card-title">Password</h5>
				<input
								name="password"
								type="password"
								className="validate"
								onChange={this.handleChange}
								value={this.state.password}
								onKeyPress={this.handleKeyPress}/>
			</div>
			<div className="card-body">
			<button className="btn btn-danger">
			<a className="waves-effect waves-light btn" onClick={this.handleLogin}>SUBMIT</a>
			</button>
			</div>
			</ModalBody>
			<ModalFooter>
			<div className="card-content">
				<div className="right d-flex " >
					<div className="text-secondary" onClick={()=>{this.props.changeType('register')}}>Create an account</div>
					{/* materializecss가 selecter를 사용하려면 script를 html에서 사용하는데 이걸 하기 위해서는
					refresh시켜주어야만 함. */}
					/
					<div className="text-secondary" onClick={()=>{this.props.changeType('find')}}>아이디 비밀번호찾기</div>	
				</div>
			</div>
			</ModalFooter>
			
			</Modal>


		);
	}
}

export default LoginComponent;