import React from 'react';
import {Link} from 'react-router-dom';

class Authentication extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			id:"",
			password:""
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.handleRegister = this.handleRegister.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	handleLogin(){
		let id = this.state.id;
		let pw = this.state.password;

		this.props.onLogin(id, pw).then(
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

	handleRegister(){
		let id = this.state.id;
		let pw = this.state.password;

		this.props.onRegister(id, pw).then(
			(result)=> {
				if(!result){
					this.setState({
						id:'',
						password:''
					});
				}
			}
		).catch(err => {
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
			if(this.props.mode === "Login"){
				this.handleLogin();
			}
			else if(this.props.mode === "Register"){
				this.handleRegister();
			}
		}
	}

	render(){
		const inputBoxes = (   //loginView와 registerView에서 겹치는 부분을 따로뺌
            <div>
                <div className="input-field col s12 username">
                    <label>Id</label>
                    <input
                    name="id"
                    type="text"
                    className="validate"
                    onChange={this.handleChange}
                    value={this.state.id}/>
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
            </div>
        );

		const loginView = (	//login화면의 뷰
			<div>
				<div className="card-content">
					<div className="row">
						{inputBoxes}
						<a className="waves-effect waves-light btn" onClick={this.handleLogin}>SUBMIT</a>
					</div>
				</div>

                <div className="footer">
                	<div className="card-content">
                		<div className="right">
                			New Here? <Link to="/register">Create an account</Link>
                		</div>
                	</div>
                </div>
			</div>
		);

		const registerView = ( //register화면의 뷰
			<div className="card-content">
                <div className="row">
                	{inputBoxes}
                    <a className="waves-effect waves-light btn" onClick={this.handleRegister}>CREATE</a>
                	}
                </div>
            </div>
		);

		return (
			<div className="container auth">
				<Link className="logo" to="/">5437</Link>
				<div className="card">
					<div className="header blue white-text center">
						<div className="card-content">{this.props.mode==="Login"? "LOGIN" : "REGISTER"}</div>
					</div>
					{this.props.mode==="Login"? loginView : registerView}
				</div>
			</div>
		);
	}
}

Authentication.defaultProps = {
	mode: true,
	onLogin: (id, pw) => {
		console.log("login handler not defined");
	},
	onRegister: (id, pw) =>{
		console.log("register handler not defined");
	}
};

export default Authentication;