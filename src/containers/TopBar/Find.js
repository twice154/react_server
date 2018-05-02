/**
 * 아이디 비밀번호 찾기
 * @author G1
 * @logs // 18.2.26
 */

import React from 'react';
import {FindId,FindPwd} from '../../components/auth'
import { Modal, ModalBody, ModalFooter } from 'reactstrap';


export class Find extends React.Component {
    constructor(props) {
        super(props);
        this.state = { select:true, gottenId:''} //true ='id' false='pwd'
        this.handleSelect=this.handleSelect.bind(this)
        this.sendEmail=this.sendEmail.bind(this)
    }
    /**
     * 아이디 찾기인지, 비밀번호 찾기인지 선택할 수 있게 한다.
     * @param {boolean} select 
     */
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
          return this.props.findId(key,email).then(()=>{
                this.setState({gottenId:this.props.gottenId})
            })
            .catch(()=>{
                console.log(1)
                alert('이름과 이메일이 틀립니다.')})
            
        }else{//비밀번호찾기면
           return this.props.findPwd(key,email).then(()=>{
               alert(this.props.message)
               this.props.history.push('/login')
            })
            .catch(()=>{alert(this.props.message)})
        }

    }
    render() {
        return (
            <Modal isOpen={this.props.modal} toggle={this.props.toggle} className={this.props.className}style={{marginTop:'100px',width:'350px'}}>
			<div style={{paddingTop:"40px",paddingLeft:"50px"}} className="d-flex flex-row">

                            <i onClick={()=>{this.handleSelect(true)}} style={{cursor:'pointer'}}>아이디찾기</i>
                            /
                            <i onClick={()=>{this.handleSelect(false)}} style={{cursor:'pointer'}}>비밀번호찾기</i>
			</div>
			<ModalBody style={{paddingTop:"0",paddingLeft:"30px"}}>
            {this.state.gottenId===''? (this.state.select? <FindId    sendEmail={this.sendEmail}/>:
            <FindPwd  sendEmail={this.sendEmail}/> ): <div>
                {this.state.gottenId}
            </div>}
			</ModalBody>
			<ModalFooter>
			<div className="card-content">
				<div className="right d-flex " >
                	<div className="text-secondary" onClick={()=>{this.props.changeType('login')}}>로그인하기</div>	
				</div>
			</div>
			</ModalFooter>
			
			</Modal>
        )
    }
}

export default Find