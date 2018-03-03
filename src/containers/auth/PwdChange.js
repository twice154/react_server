import React, { Component } from 'react';
import {connect} from 'react-redux'
import {ChangeInfoPwd} from '../../components/auth'
import {newRegister} from '../../modules/register'

class PwdChange extends Component {
    constructor(props){
        super(props)
    }
    render() { 
        return ( <div>
            
        <ChangeInfoPwd submit={()=>{this.props.newRegister}}/>
        <button onClick/>
        </div> )
    }
}
const mapStateToProps = ()=>{
    return {}
}
const mapDistpatchToProps =(dispatch)=>{
    return {
        newRegister:()=>dispatch(newRegister())
    }
}
export default connect(mapStateToProps,mapDistpatchToProps)(PwdChange);

