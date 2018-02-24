// 아이디 비밀번호 찾기

import React from 'react';
import {FindId,FindPwd} from '../components/auth'
import {connect} from 'react-redux';
import {Link} from 'react-router-dom'
import {loginRequest,findId,findPwd} from 'modules/authentication';

class Find extends React.Component {
    constructor(props) {
        super(props);
        this.state = { select:true, gottenId:''} //true ='id' false='pwd'
        this.handleSelect=this.handleSelect.bind(this)
        this.sendEmail=this.sendEmail.bind(this)
    }
    handleSelect(select){
        if(select){
            this.setState({...this.state, select:true})
        }else{
            this.setState({...this.state, select:false})
        }
    }
    /** 서버에 key와 이메일을 보내 아이디와 비밀번호를 찾을 수 있게한다.
     * @param {string} key - id 찾기는 name값 비밀번호 찾기는 Id가 담겨있다.
     * @param {string} email -email
     */
    sendEmail(key,email){
        if(this.state.select){//id찾기면
            console.log('1',key,email)
            this.props.findId(key,email).then(()=>{
                this.setState({gottenId:this.props.gottenId})
            }
                
            )
            .catch(()=>{alert('이름과 이메일이 틀립니다.')})
            
        }else{//비밀번호찾기면
            this.props.findPwd(key,email).then(()=>{
               alert('이메일에 비밀번호 변경 링크가 전송되었습니다.')
               this.props.history.push('/login')
            })
            .catch(()=>{alert('아이디와 이메일이 틀립니다.')})
        }

    }
    render() {
        return (
            <div>
                <div className = 'container'>
            <div className = 'card'>
            <div className="header blue white-text center">
                            <div className="card-content">
                            <i onClick={()=>{this.handleSelect(true)}} style={{cursor:'pointer'}}>아이디찾기</i>
                            /
                            <i onClick={()=>{this.handleSelect(false)}} style={{cursor:'pointer'}}>비밀번호찾기</i>
                            </div>
            </div>
            {this.state.gottenId===''? (this.state.select? <FindId    sendEmail={this.sendEmail}/>:
            <FindPwd  sendEmail={this.sendEmail}/> ): <div>
                {this.state.gottenId}
                <Link to ='/login'>로그인하러 가기</Link>
            </div>}
            
            
           
            </div> 
            </div>
        </div>
      
        )
    }
}
const mapStateToProps = (state) => {
	return {
        status: state.authentication.getIn(['login','status']),
        gottenId: state.authentication.getIn(['findId','gottenId'])
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		loginRequest: (id, pw)=>{
            return dispatch(loginRequest(id,pw))},
        findId:(name,email)=>{
            return dispatch(findId(name,email))},
        findPwd:(id,email)=> dispatch(findPwd(id,email))
        
		}
};

export default connect(mapStateToProps, mapDispatchToProps)(Find);