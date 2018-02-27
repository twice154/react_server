/**
 * 증명 페이지. 기존 이메일에 보내는 버튼과 새로 만든 이메일에 보내는 버튼이 존재.
 * @author G1
 * @logs // 18.2.25
 */

import React, { Component } from 'react';
import {VerifyComponent} from '../components/auth'
import {connect} from 'react-redux'
import {reSendEmail,cleanCurrentUser} from '../modules/authentication'
import {emailRequest} from '../modules/register'
class Verify extends Component {
    constructor(props) {
        super(props);
        this.state = { user:'' }
        this.handleReSend=this.handleReSend.bind(this)
        this.checkEmail=this.checkEmail.bind(this)
    }

    componentDidMount(){
            console.log(3)
            this.setState({user:this.props.user})
            console.log(this.props.user)
					this.props.cleanCurrentUser()
    }
    /**
     * 이메일로 증명 링크를 보낸다.
     * @param {string} email 
     * @description
     * 링크를 보낸 후 로그인 페이지로 리다이렉트 시킨다.
     */
    handleReSend(email){
        
        this.props.reSendEmail(email,this.state.user).then(()=>{
            alert('메시지를 보냈습니다!')
            this.props.history.push('/login')
        })
           
        
    }
    /**
     * 새로운 이메일이 중복되는지 확인한다.
     * @param {string} email - 이메일
     */
    checkEmail(email){
		console.log(email)
		this.props.emailRequest(email).then(()=>{
            this.handleReSend(email)
		}).catch(()=>{
            alert('이메일이 중복됩니다.')
        })
    }

    render() { 
        return ( 
        <div>
            <VerifyComponent verify={this.handleReSend} checkEmail={this.checkEmail}/>
        </div> )
    }
}
 
const mapStateToProps = (state) => {
	return {
		user:state.authentication.getIn(['status','currentUser'])
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		reSendEmail: (id, pw)=>{
			return dispatch(reSendEmail(id,pw));
		},emailRequest:(email)=>{
            return dispatch(emailRequest(email))
        },
        cleanCurrentUser:()=>{
            return dispatch(cleanCurrentUser())
        }
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Verify);