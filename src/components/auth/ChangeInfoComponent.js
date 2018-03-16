import React, { Component } from 'react';
import {autoHypenPhone,verifyEmail} from '../../function/registers'
class ChangeInfoComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { value:this.props.value}
        this.handleSend=this.handleSend.bind(this)
        this.handleChange=this.handleChange.bind(this)
    }
    handleChange(value){
        this.setState({value:value})
    }
    handleSend(){
        if(this.props.typeName=='email'){
            if(!verifyEmail(this.state.value))
            return 0
        }else if(this.props.typeName=='phone'){
            if(this.state.value.length<12){
				alert('정확한 길이의 번호를 입력하세요')
				return 0;
			}
        }
        var msg ={}
        msg[this.props.typeName]=this.state.value
        this.props.submit(msg)
    }
       
    render() { 
        const checkType=()=>{
            switch(this.props.typeName){
                case 'phone' : 
                return  <input onChange={(e)=>{
                    var phone = autoHypenPhone(e.target.value)
                    this.handleChange(phone)
                }}
                     value={this.state.value} maxLength={13}/>
                     default:
                     return  <input onChange={(e)=>this.handleChange(e.target.value)} value={this.state.value}/> 
            }
        }
        return ( <div>
           {checkType()}
            <button onClick={this.handleSend}>완료</button> </div> )
    }
}
 
export default ChangeInfoComponent;