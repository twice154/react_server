import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class RegisterComponent extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			userId:"",
			idStatus:'',
            password:"",
            pwdVerifyPhrase:'비밀번호는 8자이상 최소 한개 이상의 특수문자가 있어야합니다.',
            pwdVerified:false,
            pwdCheckPhrase:'',
			passwordCheck:"",
			pwdCheck:false,
			name:'',
			birth:'',
			gender:'',
			email:'',
			phone:'',
			idState:'',
			emailStatus:'',
			phoneStatus:''
			
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleRegister = this.handleRegister.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this)
        this.checkPwd=this.checkPwd.bind(this);
		this.verify=this.verify.bind(this)
		this.autoHypenPhone=this.autoHypenPhone.bind(this)
		this.handleVerifyEmail=this.handleVerifyEmail.bind(this)
		this.handleVerifyPhone=this.handleVerifyPhone.bind(this)
		this.handleVerifyId=this.handleVerifyId.bind(this)

	}
	componentWillMount(){
	
	}
	handleKeyPress(e){
		if(e.charCode===13){
			
		    this.handleRegister();
		
        }
    }
	handleRegister(){
		var msg = {
			userId:this.state.userId,
            password:this.state.password,
			name:this.state.name,
			birth:this.state.birth,
			gender:this.state.gender,
			email:this.state.email,
			phone:this.state.phone
		};
		console.log(1)
		if(!this.props.idCheck){ //alert창 이쁘게 띄울 수 있는지..
			console.log('ghihih')
			return alert('id를 확인하세요')
		}else if(!this.state.pwdVerified||!this.state.pwdCheck){
			console.log('jkjkj')
			return alert('비밀번호를 확인하세요')
		}else if(!this.props.emailCheck){
			return alert('이메일을 확인하세요')
		}else if(!this.props.phoneCheck){
			return alert('폰 번호를 확인하세요')
		}
		for(var p in msg){
			if(msg[p]===''){
				
				return alert(p,"가 비어있습니다.")
			}
		}
		setTimeout(()=>{this.props.onRegister(msg)},100)
		
			
		
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
	/**
	 * 핸드폰 형식에 맞추어 하이폰을 자동으로 넣어주는 함수.
	 * 문자는 삭제한다.
	 * @param {string} e 
	 */
	autoHypenPhone(e){
		var str = e.target.value.replace(/[^0-9]/g, '')
		
		var tmp = '';
		if( str.length < 4){
		  return this.setState({phone:str});
		}else if(str.length < 7){
		  tmp += str.substr(0, 3);
		  tmp += '-';
		  tmp += str.substr(3);
		  return this.setState({phone:tmp});
		}else if(str.length < 11){
		  tmp += str.substr(0, 3);
		  tmp += '-';
		  tmp += str.substr(3, 3);
		  tmp += '-';
		  tmp += str.substr(6);
		  return this.setState({phone:tmp});
		}else{        
		  tmp += str.substr(0, 3);
		  tmp += '-';
		  tmp += str.substr(3, 4);
		  tmp += '-';
		  tmp += str.substr(7);
		  return this.setState({phone:tmp});
		}
	  }
	  async handleVerifyEmail(){
		  console.log('1')
		  var email=this.state.email
		var reg=/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
				 
        if(!reg.test(email)){
			console.log('here')
            this.setState({emailStatus:'올바른 이메일을 입력하세요!'})
            return 0;
        }
        await this.props.checkEmail(email).then(()=>{
			console.log('hihih')
			this.setState({emailStatus:'사용할 수 있는 이메일입니다.'})
		})
		.catch(()=>{
			console.log('4')
			this.setState({emailStatus:'이미 이메일을 사용중입니다.'})
		})
	}
	handleVerifyPhone(){
		if(this.state.phone.length<12) {console.log('hihiikjk');return this.setState({phoneStatus:'올바른 길이의 번호를 입력하세요'})}
		this.props.checkPhone(this.state.phone).then(()=>{
			this.setState({phoneStatus:'사용할 수 있는 번호입니다.'})
		},()=>{
			console.log('hihi')
			this.setState({phoneStatus:'이미 번호가 존재합니다.'})
		})
		
	}
	handleVerifyId(){
		 this.props.checkId(this.state.userId).then(()=>{
					this.setState({idStatus:'아이디를 사용할 수 있습니다.'})
				},()=>{
					this.setState({idStatus:'아이디가 이미 사용중 입니다.'})
				})
				
	}
	
	render(){
		
            

		return (
			<Modal isOpen={this.props.modal} toggle={this.props.toggle} className={this.props.className}style={{marginTop:'50px',width:'450px'}}>
			<div style={{paddingTop:"40px",paddingLeft:"50px"}} className="d-flex flex-row">
			<h2 >Splendy</h2>
			<h3 style={{margin:0,paddingLeft:'10px',paddingTop:'5px'}}>회원가입</h3>
			</div>
			<ModalBody style={{paddingTop:"0",paddingLeft:"30px"}}>
			<div className="form-group">
				<label htmlFor="userId" className="col-form-label">Id</label>
				<i style={{color:'blue', marginLeft:'10px'}}>{this.state.idStatus}</i>
				<input
                    name="userId"
                    type="text"
                    className="form-control"
                    onChange={this.handleChange}
                    value={this.state.userId}
                    onBlur={this.handleVerifyId}/>
			</div>
			<div className="form-group">
                    <label htmlFor="password" className="col-form-label">Password </label>
                    <i style={{color:'blue', marginLeft:'10px'}}>{this.state.pwdVerifyPhrase}</i>
                    <input
                    name="password"
                    type="password"
                    className="form-control"
                    onChange={this.handleChange}
                    value={this.state.password}
                    onKeyUp={this.verify}/>
            </div>

			<div className="form-group" >
                        <label htmlFor="passwordCheck" className="col-form-label">Passsword check</label>
                        <i style={{color:'blue', marginLeft:'10px'}}>{this.state.pwdCheckPhrase}</i>
                        <input
                        name="passwordCheck"
                        type="password"
                        className="form-control"
                        onChange={this.handleChange}
                        value={this.state.passwordCheck}
                        onKeyUp={this.checkPwd}/>
               		</div> 
			<div className='form-group'>
			<div className="row" >
				<div className='col'>
					<label htmlFor="name" className="col-form-label">이름</label>
					<input
					name="name"
					type="text"
					className="form-control"
					onChange={this.handleChange}
					value={this.state.name}/>
				</div>
				<div className='col'>
					<label htmlFor="birth" className="col-form-label">생년월일</label>
					<input
					name="birth"
					type="text"
					className="form-control"
					onChange={this.handleChange}
					value={this.state.birth}/>
				</div>
			</div>	
			</div>
		
			<div className="form-group" >
				<select name='gender' value={this.state.gender} onChange={this.handleChange} className="custom-select">
				<option value="" disabled>성별</option>
				<option value="M">남자</option>
				<option value="F">여자</option>
				</select>
			</div>
			<div className="form-group" >
				<label htmlFor="email" className="col-form-label">이메일</label>
				<i style={{color:'blue', marginLeft:'10px'}}>{this.state.emailStatus}</i>
				<input
				name="email"
				type="text"
				className="form-control"
				onChange={this.handleChange}
				value={this.state.email}
				onBlur={this.handleVerifyEmail}
				/>
			</div>
			<div className="form-group" >
				<label htmlFor="phone" className="col-form-label">휴대폰</label>
				<i style={{color:'blue', marginLeft:'10px'}}>{this.state.phoneStatus}</i>
				<input
				name="phone"
				type="text"
				className="form-control"
				onChange={this.autoHypenPhone}
				value={this.state.phone} maxLength='13'
				onBlur={this.handleVerifyPhone}
				onKeyPress={this.handleKeyPress}/>
				</div>
			</ModalBody>
			<ModalFooter>
			<div className="card-content">
				<div className="right " >
					<button className="text-secondary" onClick={this.handleRegister} style={{cursor:'pointer'}}>CREATE</button>	
				</div>
				<div className='left'>
				<div className="text-secondary" onClick={()=>{this.props.changeType('login')}}>로그인하기</div>	
				</div>
			</div>
			</ModalFooter>
			
			</Modal>
		);
	}
}

export default RegisterComponent;