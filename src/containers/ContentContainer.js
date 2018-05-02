import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom'
import {Verify, Verified,Settings, ChangeInfo, PwdCheck,StreamingView, StreamingListContainer,
    SpeedTestContainer, SideBar}from'./index'
import {Payment} from '../components';
import styled from 'styled-components'

const ContentContainer = () => {
    return (
        <Container className='row'>
        <div className=' sideBar'>
        {/* sideBar */}
        
            <Route path='/' component={SideBar}/>
        
           
        </div>
        <div className='col'>
        <Switch>
            <Route path="/" exact component={StreamingListContainer}/>
            <Route path='/verify' component={Verify}/>
            <Route path='/verified/:token' component={Verified}/>
            <Route path="/player/:streamname" component={StreamingView}/>
            <Route path="/pay" component={Payment} />
            <Route path="/speedtest" component={SpeedTestContainer}/>
            <Route path='/settings' exact component={Settings}/>
            <Route path='/settings/:typename' component={ChangeInfo}/>
            <Route path='/pwdcheck/:typename' component={PwdCheck}/>

            {/* <Route path='/newpassword/:token' component={}/> */}
        </Switch> 
        </div>
        </Container>
    )
}
 const Container = styled.div`
    margin-top:30px;
    .sideBar{
        width:210px;
    }
  `



 
export default ContentContainer;