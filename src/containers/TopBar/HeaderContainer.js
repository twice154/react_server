/**
 * redux와 연결하는 컨테이너
 * @author G1
 * logs // 18.2.25
 */


import React from 'react';
import {Header} from '../../components';
import {connect} from 'react-redux';
import {logoutRequest, getStatusRequest, loginRequest} from '../../modules/authentication';

export class HeaderContainer extends React.Component{

	constructor(props){
		super(props);
		this.state={modal:false}
		this.handleLogout = this.handleLogout.bind(this);
		this.props.getStatusRequest()
		.catch((err)=>{
			console.log('not logined');
		})
	}
	/**
	 * 리덕스로 로그아웃 해달라고 요청을 보내는 함수
	 */
	handleLogout(){
		this.props.logoutRequest().then(
			()=> {
				var firstOfPathname = this.props.pathname.split('/')[1]
				if(firstOfPathname==='broadcast'||firstOfPathname==='settings')
				this.props.history.push('/')
			}
		)
	}
	


	
	render(){

		let re = /(login|register)/;
		let isAuth = re.test(this.props.history.location.pathname);
		//let isAuth=false;
		let currentUser=this.props.status.get('currentUser')

		return(
			<div>
				{isAuth ? undefined: <Header 	isLoggedIn={this.props.status.get('isLoggedIn')}
												onLogout={this.handleLogout}
												currentUser={currentUser}
												onLogin={this.props.onLogin}
												/>}
			{/* <Register/> */}
			</div>
		);
	}
}

const mapStateToProps = (state) =>{
	return{
		status: state.authentication.get('status'),
		login: state.authentication.getIn(['login','status']),
		verified: state.authentication.getIn(['status','verified'])
	};
};

const mapDispatchtoProps = (dispatch) => {
	return {
		getStatusRequest: ()=> {
			return  dispatch(getStatusRequest());
		},
		logoutRequest: ()=> {
			return dispatch(logoutRequest());
		},
		loginRequest: (id, pw)=>{
			return dispatch(loginRequest(id,pw));
		}
	};
}

export default connect(mapStateToProps, mapDispatchtoProps)(HeaderContainer);