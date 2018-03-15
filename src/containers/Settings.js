/**
 * 개인정보 변경 창.
 * @author G1
 * @logs // 18.2.27
 */

import React, { Component } from 'react';
import {connect} from 'react-redux'
import {SettingsComponent} from '../components'
import {getStatusRequest,getAllInfo} from '../modules/authentication'

export class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
        this.push=this.push.bind(this)
        this.quit=this.quit.bind(this)
    }

componentWillMount(){
    this.props.getAllInfo().then(
        ()=>{
        
        console.log('hi')
        }
    ).catch(()=>{
        console.log('g1')
        this.props.history.push('/')
    }
    )
    
 }
 /**
  * 타입에 따라 변경 페이지로 보내준다.
  * @param {string} param - 어떤 타입을 변경하는지 (nickname,password,phone,email) 
  */
push(param){
    if(param=='nickname')
    this.props.history.push('/settings/'+param)
    else{
        this.props.history.push('/pwdcheck/'+param)
    }
}
quit(){
   
    var confirmed = window.confirm('탈퇴하시겠습니까?')
    if(confirmed){
        this.props.history.push('/pwdcheck/quit')
    }
}
    render() { 
        return ( 
        <div>
         {this.props.status.get('isLoggedIn')? <SettingsComponent info={this.props.allInfo}
                                                                  push={this.push}
                                                                  quit={this.quit}/>:undefined }  
          
        </div> )
    }
}


const mapStateToProps = (state) =>{
	return{
        status: state.authentication.get('status'),
        allInfo: state.authentication.get('allInfo')
	};
};

const mapDispatchtoProps = (dispatch) => {
	return {
		getStatusRequest: ()=> {
			return  dispatch(getStatusRequest());
		},
		getAllInfo:()=>{
            return dispatch(getAllInfo())
        }
       
	};
}

export default connect(mapStateToProps, mapDispatchtoProps)(Settings);