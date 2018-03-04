/**
 * 회원가입 컨테이너
 * @author G1
 * @logs // 18.2.25
 */
import React from 'react';
import {connect} from 'react-redux';
import {RegisterComponent} from '../components/auth'
import {idRequest,emailRequest,registerRequest} from '../modules/register';//todo

class Register extends React.Component {

	constructor(props){
		super(props);
		this.state={
			idState:'',
			emailState:'',
			idCheck:false,
			emailCheck:false,
			phoneCheck:false
		}
		this.handleRegister = this.handleRegister.bind(this);
		this.checkId=this.checkId.bind(this)
		this.checkEmail=this.checkEmail.bind(this)
		this.checkPhone=this.checkPhone.bind(this)
	}
	componentDidMount(){
		console.log(this.props.status);
		console.log(this.props.errorCode)
	}
	/**
	 * 회원가입요청.
	 * @param {object} msg - 회원가입 form이 들어있다.
	 * @desc
	 *  성공시 로그인 페이지로 리다이렉트.
	 */
	handleRegister(msg){
		return this.props.registerRequest(msg).then(
			
			() => {
				console.log(this.props.status)
				if(this.props.status === "SUCCESS"){
					window.Materialize.toast("SUCCESS! Please log in", 2000);
					this.props.history.push('/login');
					return true;
				}
			}
		).catch((err)=>{
			alert('something worng'+err)

			return 0
		
		}
		);
	}
	/**id가 사용 가능한지알아본다
	 * @param {string} id - 아이디.
		 * @var emailState - 사용가능한아이디입니다 / 아이디가 이미 사용중입니다.
	 * 
	 */
	checkId(id){
		console.log(id)
		if(id===''){
			this.setState({idState:'아이디를입력해주세요', idCheck:this.props.idCheck})
			return 0;
		}
		this.props.idRequest(id).then(()=>{
			this.setState({idState:this.props.idState, idCheck:this.props.idCheck})
		}).catch(()=>{
			this.setState({idState:this.props.idState, idCheck:this.props.idCheck})
		})
			
		
		}
		/**
		 * 이메일이 사용 가능한 이메일인지 찾는다.
		 * @param {*} email 
		 * @var emailState - 사용가능한이메일입니다 / 이메일이 이미 사용중입니다.
		 */
	checkEmail(email){
		console.log(email)
		if(email===''){
			this.setState({emailState:'이메일을입력해주세요', emailCheck:this.props.emailCheck})
			return 0;
		}
		this.props.emailRequest(email).then(()=>{
			console.log('Elkdnfk')
			this.setState({emailState:this.props.emailState, emailCheck:this.props.emailCheck})
		}).catch(()=>{
			this.setState({emailState:this.props.emailState, emailCheck:this.props.emailCheck})
		})
	
	}
	checkPhone(phone){
			console.log(this.state.phone)
			if(check.length<12){
				alert('정확한 길이의 번호를 입력하세요')
				return 0;
			}
			this.props.checkPhone(this.state.phone).then(()=>{
				this.setState({phoneCheck:this.props.phoneCheck})
			})
	

	}
	render(){
		return (
			<div>
				< RegisterComponent onRegister={this.handleRegister} checkId={this.checkId} checkEmail={this.checkEmail}
									emailStatus={this.state.emailState} idStatus={this.state.idState} idCheck={this.state.idCheck}
									emailCheck={this.state.emailCheck} phoneCheck={this.state.phoneCheck}/>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		status: state.register.regist.status,
		errorCode: state.register.regist.error,
		idState: state.register.id.status,
		emailState: state.register.email.status,
		idCheck:state.register.id.check,
		emailCheck:state.register.email.check,
		phoneCheck:state.register.phone.check
	};
};

const mapDispatchtoProps = (dispatch) => {
	return {
		registerRequest: (id, pw) => dispatch(registerRequest(id, pw)),
		idRequest: (id)=>{
			return dispatch(idRequest(id))
		},
		emailRequest: (email)=>{
			return dispatch(emailRequest(email))
		}
	};
};

export default connect(mapStateToProps, mapDispatchtoProps)(Register);