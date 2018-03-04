/**
 * 실제로 정보를 바꾸는 함수.
 * @author G1
 * @logs // 18.2.27
 */

import React, { Component } from 'react';
import {connect} from 'react-redux'
import {getAllInfo} from '../modules/authentication'
import {newRegister} from'../modules/register'
import {ChangeInfoPwd} from '../components/auth'
import {ChangeInfoComponent} from '../components/auth';
class ChangeInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {typeName :this.props.match.params.typename,value:'' }
       this.submit=this.submit.bind(this)
    }
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
        this.props.getAllInfo().then(()=>{
            this.setState({value:this.props.allInfo.get(this.state.typeName)})
            console.log(this.state.value)
        })
    }


    /**
     * 개인정보를 변경하는 함수.
     * db에 등록 후 세팅화면으로 리다이렉트
     */
    submit(msg){
        console.log(msg)
       this.props.newRegister(msg).then(()=>{
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
            새로운 {this.state.typename}을 입력하세요.
            <div className='card container'>
            {this.state.typename==='password'? <ChangeInfoPwd submit={this.submit}/>
             :<ChangeInfoComponent submit={this.submit} value={this.state.value} typeName={this.state.typeName}/>}
            
            
            </div>
        </div> )
    }
}
 

const mapStateToProps = (state) =>{
	return{
        allInfo: state.authentication.get('allInfo'),
        pwdVerified: state.authentication.get('pwdVerified')
	};
};

const mapDispatchtoProps = (dispatch) => {
	return {
		
		getAllInfo:()=>{
            return dispatch(getAllInfo())
        },
        newRegister:(msg)=>{
            return dispatch(newRegister(msg))
        }
       
	};
}

export default connect(mapStateToProps, mapDispatchtoProps)(ChangeInfo);