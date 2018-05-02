import React, { Component } from 'react';
import {Route,Link} from 'react-router-dom'
import {Setting, Conneto, Reacto, DonationSetting} from '../components/settings'
import styled from 'styled-components'
var bodyheight= document.getElementsByTagName('body')[0].clientHeight;

class BroadcastSettings extends Component {
    constructor(props) {
        super(props);
        this.state = { broadcast:'',conneto:'',reacto:'',donation:'' }
        this.active=this.active.bind(this)
    }

    componentDidMount(){
        this.active(this.props.location.pathname.split('/')[3])
           
    }
    
    active = (a)=>{
        var state = {broadcast:'',conneto:'',reacto:'',donation:'' }
        state[a]='active'
        this.setState(state)
        
    }
    render() { 
                
        return ( <div>
            <Container className='container-fluid'>
            
                <FileclipContainer>
                <Fileclip><Links to="/broadcast/settings/broadcast" id='Broadcasting-tab-1' className={this.state.broadcast} onClick={()=>{this.active('broadcast')}}>방송설정</Links></Fileclip>
                <Fileclip><Links to='/broadcast/settings/conneto' id='Broadcasting-tab-2' className={this.state.conneto} onClick={()=>{this.active('conneto')}}>conneto설정</Links></Fileclip>
                <Fileclip><Links to='/broadcast/settings/reacto' id='Broadcasting-tab-3' className={this.state.reacto} onClick={()=>{this.active('reacto')}}>reacto설정</Links></Fileclip>
                <Fileclip><Links to='/broadcast/settings/donation' id='Broadcasting-tab-4' className={this.state.donation} onClick={()=>{this.active('donation')}}>donation설정</Links></Fileclip>
                </FileclipContainer>
            <Route path="/broadcast/settings/broadcast" component={Setting}></Route>
            <Route path="/broadcast/settings/conneto" component={Conneto}></Route>
            <Route path="/broadcast/settings/reacto" component={Reacto}></Route>
            <Route path="/broadcast/settings/donation" component={DonationSetting}/>
            </Container>

        </div> )
    }
}
const Links = styled(Link)`
 padding:4px;
 font-size:16px;
border:none;
display:inline-block;
background-color:#fff;
color:#000000a6;
    &.active{
        border:1px solid #cacaca;
        border-bottom:transparent;
        color:#65a7ff;
    }
 `
const FileclipContainer = styled.div`
display:flex;
border-bottom:1px solid #cacaca;
`

const Fileclip= styled.div`
    border:none;
    margin-bottom:-1px;

`
const Container= styled.div`
padding-top:30px;
height:${bodyheight*0.9}px;
`   
export default BroadcastSettings;