import React, {Component} from 'react';
class ChangeInfoPwd extends Component {
    constructor(props) {
        super(props);
        this.state = { password:'',passwordCheck:'', pwdVerifyPhrase:'',pwdCheckPhrase:'' }
        this.handleSend=this.handleSend.bind(this)
        this.handleChange=this.handleChange.bind(this)
    }
    checkPwd(){
		if(this.state.password !==this.state.passwordCheck || !this.state.password || !this.state.passwordCheck)
		{
			return this.setState({pwdCheckPhrase:'비밀번호가 다릅니다.'})
		}
		this.setState({pwdCheckPhrase:'비밀번호가 같습니다.',pwdCheck:true});
    }
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
    handleChange(e){
        this.setState({password:e.target.value})
    }
    handleSend(){
        var msg ={}
        msg.password=this.state.password
        this.props.submit(msg)
    }
    render() { 
        return (  <div className='card container'>
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
           <button onClick={this.handleSend}>완료</button>
        </div>  )
    }
}
 
export default ChangeInfoPwd;