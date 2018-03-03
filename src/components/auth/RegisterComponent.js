import React from 'react';
import {Link} from 'react-router-dom';

class RegisterComponent extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			userId:"",
            password:"",
            pwdVerifyPhrase:'비밀번호는 8자이상 최소 한개 이상의 특수문자가 있어야합니다.',
            pwdVerified:false,
            pwdCheckPhrase:'',
			passwordCheck:"",
			pwdCheck:false,
			name:'',
			nickname:'',
			birth:'',
			gender:'',
			email:'',
			phone:''
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleRegister = this.handleRegister.bind(this);
        this.checkPwd=this.checkPwd.bind(this);
        this.verify=this.verify.bind(this)
	}

	handleRegister(){
		var msg = {
			userId:this.state.userId,
            password:this.state.password,
			name:this.state.name,
			nickname:this.state.nickname,
			birth:this.state.birth,
			gender:this.state.gender,
			email:this.state.email,
			phone:this.state.phone
		};
		if(!this.props.idCheck){ //alert창 이쁘게 띄울 수 있는지..
		
			return alert('id를 확인하세요')
		}else if(!this.state.pwdVerified||!this.state.pwdCheck){
			return alert('비밀번호를 확인하세요')
		}else if(!this.props.emailCheck){
			return alert('이메일을 확인하세요')
		}
		for(var p in msg){ 
			if(msg.p===''){
				return alert(p,"가 비어있습니다.")
			}
		}
		this.props.onRegister(msg)
			
		
	}

	handleChange(e){ 
		let nextState = {};
		nextState[e.target.name] = e.target.value;
		this.setState(nextState);
	}

	/**
	 * 패스워드가 동일한지 체크함
	 */
    checkPwd(){
		if(this.state.password !==this.state.passwordCheck || !this.state.password || !this.state.passwordCheck)
		{
			return this.setState({pwdCheckPhrase:'비밀번호가 다릅니다.'})
		}
		this.setState({pwdCheckPhrase:'비밀번호가 같습니다.',pwdCheck:true});
    }
    /** 비밀번호가 올바른지 체크한 후 현재 비밀번호 상태를 업데이트한다.
     * @param {string} e -password
    */
    verify(e){
        var stringRegx = /[!@#$%^&*]/gi; 
        if(e.target.value.length>2){
            if(!stringRegx.test(e.target.value)){
                return this.setState({pwdVerifyPhrase:'최소 한개 이상의 특수문자가 포함되어야 합니다.(!@#$%^&*)'})
            }else if(e.target.value.length<8){
                return this.setState({pwdVerifyPhrase:'비밀번호가 너무 짧습니다.'})
            }
            this.setState({pwdVerifyPhrase:'안전한 비밀번호입니다.',pwdVerified:true})
        }  
       
    }
	render(){
		
            

		return (
			<div className="container auth">
				<Link className="logo" to="/">5437</Link>
				<div className="card">
					<div className="header blue white-text center">
						<div className="card-content">REGISTER</div>
					</div>
					<div>
                 <div className="card-content">
                <div className="row">
                <div className="input-field col s12 username">
                    <label>Id</label>
					<i>{this.props.idStatus}</i>
                    <input
                    name="userId"
                    type="text"
                    className="validate"
                    onChange={this.handleChange}
                    value={this.state.userId}
                    onBlur={(e)=>{this.props.checkId(e.target.value)}}/>
                </div>
                <div className="input-field col s12">
                    <label>Password </label>
                    <i>{this.state.pwdVerifyPhrase}</i>
                    <input
                    name="password"
                    type="password"
                    className="validate"
                    onChange={this.handleChange}
                    value={this.state.password}
                    onKeyUp={this.verify}/>
                    </div>

					<div className="input-field col s12" >
                        <label>Passsword check</label>
                        <i>{this.state.pwdCheckPhrase}</i>
                        <input
                        name="passwordCheck"
                        type="password"
                        className="validate"
                        onChange={this.handleChange}
                        value={this.state.passwordCheck}
                        onKeyUp={this.checkPwd}/>
               		</div> 
					<div className="input-field col s12 ">
						<label>이름</label>
						<input
						name="name"
						type="text"
						className="validate"
						onChange={this.handleChange}
						value={this.state.name}/>
               		</div>
					<div className="input-field col s12 ">
						<label>닉네임</label>
						<input
						name="nickname"
						type="text"
						className="validate"
						onChange={this.handleChange}
						value={this.state.nickname}/>
               		</div>
					<div className="input-field col s12 ">
						<label>생년월일</label>
						<input
						name="birth"
						type="text"
						className="validate"
						onChange={this.handleChange}
						value={this.state.birth}/>
               		</div>
					<div className="input-field col s12 ">
					<label>성별..</label>
						<select name='gender' value={this.state.gender} onChange={this.handleChange}>
						<option value="" disabled>성별</option>
						<option value="M">남자</option>
						<option value="F">여자</option>
						</select>
               		</div>
					<div className="input-field col s6 ">
						<label>이메일</label>
						<i>{this.props.emailStatus}</i>
						<input
						name="email"
						type="text"
						className="validate"
						onChange={this.handleChange}
						value={this.state.email}
						/>
               		</div>
					<div className="input-field col s6 ">
					<label></label>
						<button onClick={()=>{this.props.checkEmail(this.state.email)}}>이메일체크</button>
					
               		</div>
					<div className="input-field col s6 ">
						<label>휴대폰</label>
						<input
						name="phone"
						type="text"
						className="validate"
						onChange={this.handleChange}
						value={this.state.phone}/>
               		</div>
					   <div className="input-field col s6 ">
					   <label></label>
						<button onClick={(e)=>{this.props.checkEmail(e.target.value)}}>폰번호체크</button>
					
               		</div>
                    <a className="waves-effect waves-light btn" onClick={this.handleRegister}>CREATE</a>
                	
                </div>
            </div>
	
				</div>
			</div>
            </div>
		);
	}
}

export default RegisterComponent;