/**
 * 
 * @author G1
 * @logs // 18.2.25
 */

import React, { Component } from 'react';

class VerifyComponent extends Component {
    constructor(props){
        super(props)
        this.state={
            email:''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleVerify=this.handleVerify.bind(this)
		this.handleKeyPress = this.handleKeyPress.bind(this);        
    }
    handleChange(e){ 
		let nextState = {};
		nextState[e.target.name] = e.target.value;
		this.setState(nextState);
    }
    /**
     * 이메일이 올바른 이메일인지를 확인한다.
     * @param {string} email 
     * @desc
     *  완벽하지는 않지만 이메일 폼을 확인한다.
     */
    handleVerify(email){
        var reg=/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/
        if(!reg.test(email)){
            alert('올바른 이메일을 입력하세요!')
            return 0;
        }
        this.props.checkEmail(email)
    }
    handleKeyPress(e){
		if(e.charCode===13){
			
		    this.handleVerify(this.state.email);
		
        }
    }

    render() { 
        return ( 
        <div>
           
            <div className="container auth">
                <p>인증되지 않은 아이디 입니다. 이메일을 확인해 주세요!!!! 아니면 이메일을 재 전송해 주세요</p>
					<div className="card-content">
						<div className="row">
                        <a className="waves-effect waves-light btn" onClick={()=>{this.props.verify(this.state.email)}}>기존 이메일에 보내기</a>
                       <hr/>
						<div className="input-field col s12">
							<label> 이메일 새로 작성하기</label>
							<input
							name="email"
							type="text"
							className="validate"
							onChange={this.handleChange}
							value={this.state.email}
							onKeyPress={this.handleKeyPress}
                            />
						</div>
                            <a className="waves-effect waves-light btn" onClick={()=>{this.handleVerify(this.state.email)}}>SUBMIT</a>
						</div>
					</div>

				</div>
			</div>
       )
    }
}
 
export default VerifyComponent;