/**
 * 로그인 컨테이너
 * @author G1
 * @logs // 18.2.25
 */

import React from 'react';
import {connect} from 'react-redux';
import  {RegisterComponent, LoginComponent } from '../../components/auth';
import {loginRequest,findId,findPwd} from '../../modules/authentication'
import {idRequest,emailRequest,registerRequest, phoneRequest} from '../../modules/register';//todo

import { Find } from './Find';
//import {browserHistory} from 'react-router';

export class Modal extends React.Component{
	constructor(props){
        super(props);
        this.state={
            //register state
             type:'login'}
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.changeType=this.changeType.bind(this)
        this.selectType=this.selectType.bind(this)
        this.handleToggle=this.handleToggle.bind(this)
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
				console.log(1)
				if(this.props.loginStatus === "SUCCESS"){

					if(!this.props.verified){
                        console.log('hi')
						this.props.toggle()
						this.props.history.push('/verify')
                  
                    }else{
                        console.log('??')
                        this.props.toggle()
                    }
				} else{
					console.log(2)
				}
			}
		).catch(()=>{
			alert('incorrect userid or password')})
	}
    handleRegister(msg){
		return this.props.registerRequest(msg).then(
			
			() => {
				console.log(this.props.registerStatus)
				if(this.props.registerStatus === "SUCCESS"){
					this.changeType('login')
					return true;
				}
			}
		).catch((err)=>{
			alert('something worng'+err)

			return 0
		
		}
		);
	}
    /**
     * 타입에 따라 컴포넌트를 보여주는 함수.
     */
    selectType(){
        switch(this.state.type){
            case 'login':
            return 	<LoginComponent	onLogin={this.handleLogin} modal={this.props.modal} toggle={this.handleToggle} changeType={this.changeType}/>;
            case 'register':
            return < RegisterComponent onRegister={this.handleRegister} checkId={this.props.idRequest} checkEmail={this.props.emailRequest} checkPhone={this.props.phoneRequest}
                             idCheck={this.props.idCheck}
                              emailCheck={this.props.emailCheck} phoneCheck={this.props.phoneCheck} modal={this.props.modal} toggle={this.handleToggle} changeType={this.changeType}/>
            case 'find':
            return  <Find gottenId={this.props.gottenId} message={this.props.message} findId={this.props.findId} findPwd={this.props.findPwd} changeType={this.changeType}
                        modal={this.props.modal} toggle={this.handleToggle}/>


        }
    }
    /**
     * 타입을 바꾸는 함수.
     * @param {string} type -login, regist, find
     */
    changeType(type){
        console.log(type)
        this.setState({type})
    }
    /**
     * 모달 키고 끄는 함수. 기본적으로 login이 될 수 있게 만든다.
     */
    handleToggle(){
        if(this.state.type !=='login') this.setState({type:'login'})
        this.props.toggle()
    }

	render(){
		return (
			<div>
                {this.selectType()}
                
			</div>
		);
    }	
}


const mapStateToProps = (state) =>{
	return{
		loginStatus: state.authentication.getIn(['login','status']),
        verified: state.authentication.getIn(['status','verified']),
        registerStatus: state.register.regist.status,
		errorCode: state.register.regist.error,
		idCheck:state.register.idCheck,
		emailCheck:state.register.emailCheck,
        phoneCheck:state.register.phoneCheck,
        //find
        gottenId: state.authentication.getIn(['findId','gottenId']),
        message: state.authentication.getIn(['findPwd','message'])
	};
};

const mapDispatchtoProps = (dispatch) => {
	return {
		loginRequest: (id, pw)=>{
			return dispatch(loginRequest(id,pw));
        },
        
        //register

        registerRequest: (id, pw) => dispatch(registerRequest(id, pw)),
		idRequest: (id)=>{
			return dispatch(idRequest(id))
		},
		emailRequest: (email)=>{
			return dispatch(emailRequest(email))
		},
		phoneRequest: (phone)=>{
			return dispatch(phoneRequest(phone))
		},
        findId:(name,email)=>{
            return dispatch(findId(name,email))},
        findPwd:(id,email)=> dispatch(findPwd(id,email))

	};
}

export default connect(mapStateToProps, mapDispatchtoProps)(Modal);