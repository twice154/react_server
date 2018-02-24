import React, { Component } from 'react';
import {connect} from 'react-redux'
import {SettingsComponent} from '../components'
import {getStatusRequest,getAllInfo} from '../modules/authentication'

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
        this.push=this.push.bind(this)
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
push(param){
    if(param=='nickname')
    this.props.history.push('/settings/'+param)
    else{
        this.props.history.push('/pwdcheck/'+param)
    }
}
    render() { 
        return ( 
        <div>
         {this.props.status.get('isLoggedIn')? <SettingsComponent info={this.props.allInfo}
                                                                  push={this.push}/>:undefined }  
          
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