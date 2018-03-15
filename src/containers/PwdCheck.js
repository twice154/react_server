/**
 * 개인정보 변경하기 전에 한번 더 비밀번호를 확인하는 페이지.
 * @author G1
 * @logs // 18.2.25
 */

import React, { Component } from 'react';
import {connect} from 'react-redux'
import {pwdVerify} from '../modules/authentication'
import {quit} from '../modules/register'
 

export class PwdCheck extends Component {
    constructor(props) {
        super(props);
        this.state = { pwd:'' }
        this.handleChange=this.handleChange.bind(this)
        this.pwdVerifyRequest=this.pwdVerifyRequest.bind(this)
        this.quit=this.quit.bind(this)
    }
    
	handleChange(e){ 
		this.setState({pwd: e.target.value});
    }
    /**올바른 비밀번혼지 체크한다. */
    pwdVerifyRequest(pwd){
        console.log(1)
        return this.props.pwdVerify(pwd).then(()=>{
            console.log(2)
            if(this.props.match.params.typename==='quit'){
                return this.quit()
            }
            else{this.props.history.push('/settings/'+this.props.match.params.typename)}
        }).catch(()=>{
            alert('비밀번호를 올바르게 입력하세요!')
        })
    }
    quit(){
        console.log(3)
        var confirmed = window.confirm('비밀번호가 확인되었습니다. 정말로 탈퇴하시겠습니까?')
        if(confirmed){
            console.log(4)
            return this.props.quit(this.props.currentUser)
                .then(()=>{
                    alert('탈퇴하였습니다.')
                    this.props.history.push('/')}).catch((err)=>{console.log(err)})
        }else{
            this.props.history.push('/settings')
        }
    }
		
    render() { 
        
    return (
        <div>
            패스워드를 입력하시오.
            <input type='password' placeholder='password' value={this.state.pwd} onChange={this.handleChange}/>
            <button onClick={()=>{this.pwdVerifyRequest(this.state.pwd)}}>확인</button>
        </div>
    )
    }
}
const mapStateToProps = (state) =>{
	return{
        status: state.authentication.get('status'),
        allInfo: state.authentication.get('allInfo'),
        currentUser: state.authentication.getIn(['status','currentUser'])
	};
};

const mapDispatchtoProps = (dispatch) => {
	return {

        pwdVerify:(pwd)=> dispatch(pwdVerify(pwd)),
        quit:(id)=>dispatch(quit(id)),
	};
}

export default connect(mapStateToProps, mapDispatchtoProps)(PwdCheck);