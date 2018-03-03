/**
 * redux와 연결하는 컨테이너
 * @author G1
 * logs // 18.2.25
 */


import React from 'react';
import {Header} from '../components';
import {connect} from 'react-redux';
import {logoutRequest, getStatusRequest} from '../modules/authentication';


class HeaderContainer extends React.Component{

	constructor(props){
		super(props);
		this.handleLogout = this.handleLogout.bind(this);
	}
	/**
	 * 리덕스로 로그아웃 해달라고 요청을 보내는 함수
	 */
	handleLogout(){
		this.props.logoutRequest().then(
			()=> {
				window.Materialize.toast('Good Bye!', 2000);

			}
		)
	}



	componentDidMount(){
		
		this.props.getStatusRequest().then(
			()=> {
				
			}
		)
		.catch((err)=>{
			console.log('not logined');
		})
	}
	/**
	 * 로그인, 회원가입의 경우 헤드 컴포넌트가 보이지 않는다 --> TODO: pwd도 적용을 해주던지, 이미지 작업해야됨
	 */
	render(){

		let re = /(login|register)/;
		let isAuth = re.test(this.props.history.location.pathname);
		//let isAuth=false;
		console.log(this.props.history.location.pathname)
		let currentUser=this.props.status.get('currentUser')

		return(
			<div>
				{isAuth ? undefined: <Header isLoggedIn={this.props.status.get('isLoggedIn')}
												onLogout={this.handleLogout}
												currentUser={currentUser}/>}
				{currentUser}
			</div>
		);
	}
}

const mapStateToProps = (state) =>{
	return{
		status: state.authentication.get('status')
	};
};

const mapDispatchtoProps = (dispatch) => {
	return {
		getStatusRequest: ()=> {
			return  dispatch(getStatusRequest());
		},
		logoutRequest: ()=> {
			return dispatch(logoutRequest());
		}
	};
}

export default connect(mapStateToProps, mapDispatchtoProps)(HeaderContainer);