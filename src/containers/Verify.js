import React, { Component } from 'react';
import {VerifyComponent} from '../components/auth'
import {connect} from 'react-redux'
import {reSendEmail,cleanCurrentUser} from '../modules/authentication'
import {emailRequest} from '../modules/register'
class Verify extends Component {
    constructor(props) {
        super(props);
        this.state = { user:'' }
        this.handleReSend=this.handleReSend.bind(this)
        this.checkEmail=this.checkEmail.bind(this)
    }

    componentDidMount(){
            console.log(3)
            this.setState({user:this.props.user})
            console.log(this.props.user)
					this.props.cleanCurrentUser()
    }
    handleReSend(email){
        console.log('hi'+email+ this.state.user)
        this.props.reSendEmail(email,this.state.user).then(()=>{
            alert('메시지를 보냈습니다!')
            this.props.history.push('/login')
        })
           
        
    }
    checkEmail(email){
		console.log(email)
		this.props.emailRequest(email).then(()=>{
            this.handleReSend(email)
		}).catch(()=>{
            alert('이메일이 중복됩니다.')
        })
    }

    render() { 
        return ( 
        <div>
            <VerifyComponent verify={this.handleReSend} checkEmail={this.checkEmail}/>
        </div> )
    }
}
 
const mapStateToProps = (state) => {
	return {
		user:state.authentication.getIn(['status','currentUser'])
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		reSendEmail: (id, pw)=>{
			return dispatch(reSendEmail(id,pw));
		},emailRequest:(email)=>{
            return dispatch(emailRequest(email))
        },
        cleanCurrentUser:()=>{
            return dispatch(cleanCurrentUser())
        }
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Verify);