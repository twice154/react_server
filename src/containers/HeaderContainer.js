import React from 'react';
import {Header} from 'components';
import {connect} from 'react-redux';
import {logoutRequest, getStatusRequest} from 'modules/authentication';


class HeaderContainer extends React.Component{

	constructor(props){
		super(props);
		this.handleLogout = this.handleLogout.bind(this);
	}

	handleLogout(){
		this.props.logoutRequest().then(
			()=> {
				window.Materialize.toast('Good Bye!', 2000);

				/*let loginData = {
					isLoggedIn: false,
					username: ''
				};

				document.cookie = 'key=' + btoa(JSON.stringify(loginData));*/
			}
		)
	}



	componentDidMount(){
		/*function getCookie(name){
			var value = ";" + document.cookie;
			var parts = value.split("; " + name + "=");
			if(parts.length == 2) return parts.pop().split(";").shift();
		}

		let loginData = getCookie('key');

		if(typeof loginData === "undefined") return;

		loginData = JSON.parse(atob(loginData));

		if(!loginData.isLoggedIn) return;*/

		this.props.getStatusRequest().then(
			()=> {
				
			}
		)
		.catch((err)=>{
			console.log('not logined');
		})
	}

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