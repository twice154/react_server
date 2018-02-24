import React from 'react';
import {Link} from 'react-router-dom';

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

	handleLogin(){
		let userId = this.state.userId;
		let pw = this.state.password;
		console.log(userId)
		this.props.onLogin(userId, pw).then(
			(success) => {
				if(!success){
					this.setState({
						password: ''
					})
				}
			}
		).catch(err=>{
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
			<div className="container auth">
				<Link className="logo" to="/">5437</Link>
				<div className="card">
					<div className="header blue white-text center">
						<div className="card-content">Login</div>
					</div>
					<div className="card-content">
						<div className="row">
							
						<div className="input-field col s12 username">
							<label>Id</label>
							<input
							name="userId"
							type="text"
							className="validate"
							onChange={this.handleChange}
							value={this.state.userId}/>
						</div>
						<div className="input-field col s12">
							<label>Password</label>
							<input
							name="password"
							type="password"
							className="validate"
							onChange={this.handleChange}
							value={this.state.password}
							onKeyPress={this.handleKeyPress}/>
						</div>
					
							<a className="waves-effect waves-light btn" onClick={this.handleLogin}>SUBMIT</a>
						</div>
					</div>

					<div className="footer">
						<div className="card-content">
							<div className="right">
								<Link to="/register">Create an account</Link>
								/	
								<Link to='/find'>아이디 비밀번호찾기</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default LoginComponent;