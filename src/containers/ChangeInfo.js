/**
 * 실제로 정보를 바꾸는 함수.
 * @author G1
 * @logs // 18.2.27
 */

import React from 'react';
import {connect} from 'react-redux'
import {getAllInfo} from '../modules/authentication'
import {newRegister, emailRequest, phoneRequest, nicknameRequest} from'../modules/register'
import {ChangeInfoPwd} from '../components/auth'
import {ChangeInfoComponent} from '../components/auth';
import {verifyEmail, autoHypenPhone} from '../function/registers'

export class ChangeInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {typeName :this.props.match.params.typename,value:'' }
       this.submit=this.submit.bind(this)
    }
    /**
     * nickname이면 바로 정보 수정.
     * 다른 애들은 비밀번호 체크가 되어있는지를 확인
     * pwd면 정보를 보여주지 않고 0을 리턴
     */
    componentWillMount(){
       
        if(this.state.typeName!=='nickname'){
            
            if(!this.props.pwdVerified){
                alert('비밀번호 체크를 먼저 해주세요!')
                this.props.history.push('/settings')
                return 0;
                
            }
        }
        if(this.state.typeName=='password'){
            return 0;
        }
        this.setState({value:this.props.allInfo.get(this.state.typeName)})
       
    }



    /**
     * 개인정보를 변경하는 함수.
     * db에 등록 후 세팅화면으로 리다이렉트
     * @param {object} msg - 바꾸려고 하는 정보 인포.{typename:'string'}
     * check가 되어있지 않다면(서버에서 통과하지 못하면)return 0
     */
    async submit(msg){
        if(this.state.typeName!=='password')
            switch(this.state.typeName){
                case 'nickname': 
                this.props.nicknameRequest(msg.nickname)
                if(!this.props.nicknameCheck){
                    alert('이미 등록된 닉네임입니다.')
                    return 0
                }
                break;
                case 'email':
                if(!verifyEmail(msg.email)){
                    return 0
                }
                //TODO: catch로 받는지, then으로 받는지 라우터 할때 같이 해주어야함
                await this.props.emailRequest(msg.email).catch((err)=>{console.log(err)})
   
                if(!this.props.emailCheck){
                    alert('이미 등록된 이메일입니다.')
                    return 0
                }
                break;
                
                case 'phone':
                this.props.phoneRequest(msg.phone)
                if(!this.props.phoneCheck){
                    alert('이미 등록된 번호입니다.')
                    return 0
                }
                break
            }
        
          this.props.newRegister(msg,this.props.status.get('currentUser')).then(()=>{
            alert('변경되었습니다.')
            this.props.history.push('/settings')
           }
           ).catch((err)=>{
               console.log(err)
           })
       
    }
    render() { 
        
        return ( 
        <div>
            새로운 {this.state.typeName}을 입력하세요.
            <div className='card container'>
            {this.state.typeName==='password'? <ChangeInfoPwd submit={this.submit}/>
             :<ChangeInfoComponent submit={this.submit} value={this.state.value} typeName={this.state.typeName}/>}
            
            
            </div>
        </div> )
    }
}
 

const mapStateToProps = (state) =>{
	return{
        allInfo: state.authentication.get('allInfo'),
        pwdVerified: state.authentication.get('pwdVerified'),
        emailCheck:state.register.email.check,
        phoneCheck:state.register.phone.check,
        nicknameCheck:state.register.nickname.check,
        status:state.authentication.get('status')
	};
};

const mapDispatchtoProps = (dispatch) => {
	return {
		
		getAllInfo:()=>{
            return dispatch(getAllInfo())
        },
        newRegister:(msg,id)=>{
            return dispatch(newRegister(msg,id))
        },
		emailRequest: (email)=>{
			return dispatch(emailRequest(email))
        },
        phoneRequest:(phone)=>{
            return dispatch(phoneRequest(phone))
        },
        nicknameRequest:(nickname)=>{
            return dispatch(nicknameRequest(nickname))
        }
       
	};
}

export default connect(mapStateToProps, mapDispatchtoProps)(ChangeInfo);