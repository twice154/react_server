import React from 'react';
import {LoginComponent} from '../components/auth';
import {connect } from 'react-redux';
import {loginRequest,cleanCurrentUser} from 'modules/authentication';
//import {browserHistory} from 'react-router';

class Login extends React.Component{
	constructor(props){
		super(props);
		this.handleLogin = this.handleLogin.bind(this);
	}

	handleLogin(id, pw){
		return this.props.loginRequest(id, pw).then(
			()=>{
				if(!this.props.verified){
					console.log(1)
						console.log(2)
						this.props.history.push('/verify')

					return true;
				}

				if(this.props.status === "SUCCESS"){
					

					window.Materialize.toast('Welcome, ' + id + '!', 2000);
					this.props.history.push('/');
					return true;
				} else{
					let $toastContent = window.$('<span style="color: $FFB4BA">Incorrect username or password</span>');
					window.Materialize.toast($toastContent, 2000);
					return false;
				}
			}
		)
	}

	render(){
		return (
			<div>
				<LoginComponent	onLogin={this.handleLogin}/>
			</div>
		);
    }	
}

const mapStateToProps = (state) => {
	return {
		status: state.authentication.getIn(['login','status']),
		verified: state.authentication.getIn(['status','verified'])
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		loginRequest: (id, pw)=>{
			return dispatch(loginRequest(id,pw));
		},
		cleanCurrentUser:()=>{
			return dispatch(cleanCurrentUser());
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);