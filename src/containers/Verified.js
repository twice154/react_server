/**
 * 인증되었다는 것을 보여주는 페이지. 서버의 verified와 연결되어 있음
 * 
 * @author G1
 * @logs // 18.2.25
 */
import React from 'react';
import {Link} from 'react-router-dom'
import {verify,logoutRequest} from '../modules/authentication'
import {connect}from 'react-redux'

//test를 위한 export 선언!

export class Verified extends React.Component {
     constructor(props) {
         super(props);
         this.state = {  }
     }
     componentWillMount(){
         this.props.verify(this.props.match.params.token,this.props.currentUser).then(this.props.logoutRequest())
     }
     render() { 
         return (  <div>
            인증되었습니다! 다시 로그인해주세요 
            <p><Link to ='/login'>로그인하기</Link></p>
        </div>  )
     }
 }
const mapStateToProps = (state)=>{
    return{
        currentUser:state.authentication.getIn(['status,currentUser'])
    }
}
const mapDispatchToProps = (dispatch)=>{
    return{
 verify:()=>{return dispatch(verify())},
 logoutRequest:()=>dispatch(logoutRequest())
}
}

export default connect(undefined,mapDispatchToProps)(Verified)