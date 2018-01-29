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
				Materialize.toast('Good Bye!', 2000);

				let loginData = {
					isLoggedIn: false,
					username: ''
				};

				document.cookie = 'key=' + btoa(JSON.stringify(loginData));
			}
		)
	}



	componentDidMount(){
		function getCookie(name){
			var value = ";" + document.cookie;
			var parts = value.split("; " + name + "=");
			if(parts.length == 2) return parts.pop().split(";").shift();
		}

		let loginData = getCookie('key');

		if(typeof loginData === "undefined") return;

		loginData = JSON.parse(atob(loginData));

		if(!loginData.isLoggedIn) return;

		this.props.getStatusRequest().then(
			()=> {
				console.log(this.props.get('status'));
				if(!this.props.status.get('valid')){
						loginData = {
							isLoggedIn: false,
							username:''
						};

						document.cookie='key=' + btoa(JSON.stringify(loginData));

						let $toastContent = $('<span style="color: #FFB4BA">Your session is expired, please login again</span>');
						Materialize.toast($toastContent, 4000);
				}
			}
		)
		.catch((err)=>{
			console.log('not logined');
		})
	}

	render(){

		let re = /(login|register)/;
		let isAuth = re.test(this.props.match.path);
		//let isAuth=false;

		return(
			<div>
				{isAuth ? undefined: <Header isLoggedIn={this.props.status.get('isLoggedIn')}
												onLogout={this.handleLogout}/>}
				{this.props.status.get('currentUser')}
				{this.props.children}
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