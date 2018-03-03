/**
 * 로그인 컨테이너
 * @author G1
 * @logs // 18.2.25
 */

import React from 'react';
import {LoginComponent} from '../components/auth';
import {connect } from 'react-redux';
import {loginRequest,cleanCurrentUser} from '../modules/authentication';
//import {browserHistory} from 'react-router';

class Login extends React.Component{
	constructor(props){
		super(props);
		this.handleLogin = this.handleLogin.bind(this);
	}
/**
 * 로그인을 한다.
 * @param {string} id 
 * @param {string} pw 
 * @description
 * 	만약 로그인시 이메일 인증되지 않았으면 verify로 리다이렉트 한다.
 *  인증되었으면 home으로
 *  인증이 안됬으면 다시 한다.
 */
	handleLogin(id, pw){
		return this.props.loginRequest(id, pw).then(
			()=>{
				
				if(this.props.status === "SUCCESS"){
					if(!this.props.verified){
					
						this.props.history.push('/verify')

					return 0;
				}


					window.Materialize.toast('Welcome, ' + id + '!', 2000);
					this.props.history.push('/');
					return 0;
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