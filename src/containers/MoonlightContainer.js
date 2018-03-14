import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getStatusRequest as getMLStatusRequest, getHostsRequest, getAppsRequest, startGameRequest, addHostRequest } from 'modules/moonlight';
import { getStatusRequest as getAuthStatusRequest } from 'modules/authentication';
import {Moonlight} from 'components';
import update from 'immutability-helper';

class MoonlightContainer extends Component {
    
    constructor(props){
        super(props);
        this.state={
            currentUser:"",
            isMoonlightOnline: false,
            hostList:[]
        }
        this.getHosts = this.getHosts.bind(this);
        this.getApps=this.getApps.bind(this);
        this.startGame = this.startGame.bind(this);
        this.addHost = this.addHost.bind(this);
        this.getMoonlightStatus = this.getMoonlightStatus.bind(this);
        this.getAuthStatus = this.getAuthStatus.bind(this);
    }

    getAuthStatus(){
        return this.props.getAuthStatusRequest().then(
            ()=>{
                if(this.props.authStatus.get('valid')){
                    let currentUser = this.props.authStatus.get('currentUser');
                    this.setState(update(this.state, {
                        currentUser: {$set: currentUser}
                    }))
                    return currentUser;
                }
                return Promise.reject();
            }
        )
    }

    getMoonlightStatus(userId){
        return this.props.getMoonlightStatusRequest(userId).then(
            ()=>{
                if(this.props.moonlightStatus === "ONLINE"){
                    this.setState(update(this.state, {
                        isMoonlightOnline: {$set: true}
                    }))
                    return true;
                }
                return Promise.reject();
            }
        )
    }
    
    getHosts(userId){
        if(!this.state.isMoonlightOnline){
            return Promise.reject({error: "Moonlight is not online"})
        }
        return this.props.getHostsRequest(userId).then(
            ()=>{
                if(this.props.hostList.get('status')=== "GET_SUCCESS"){
                    this.setState(update(this.state,{
                        hostList: {$set: this.props.hostList.get('data')}
                    }))
                    return this.state.hostList;
                }
                return Promise.reject();
            }    
        )
    }

    getApps(hostId, userId){
        return this.props.getAppsRequest(userId, hostId).then(
            ()=>{
                if(this.props.appList.get('status')=== "SUCCESS"){
                    return this.props.appList.get('data')
                }
                return Promise.reject();
            }
        )
    }

    startGame(hostId, userId, appId, option){
        return this.props.startGameRequest(userId, hostId, appId, option).then(
            ()=>{
                if(this.props.startGame.get('status')=== "SUCCESS"){
                    return appId
                }
                return Promise.reject();
            }
        )
    }

    addHost(hostIp, userId, pairingNum){
        return this.props.addHostRequest(userId, hostIp, pairingNum).then(
            ()=>{
                if(this.props.hostList.get('status')=== "ADD_SUCCESS"){
                    this.setState(update(this.state,{
                        hostList: {$set: this.props.hostList.get('data')}
                    }))
                }
                return Promise.reject();
            }
        )
    }

    render() {
        return (
            <div>
                <Moonlight getMoonlightStatus={this.getMoonlightStatus}
                           getHosts={this.getHosts}
                           getApps={this.getApps}
                           addHost={this.addHost}
                           startGame={this.startGame}
                           hostList={this.state.hostList}
                           getAuthStatus={this.getAuthStatus}
                           isMoonlightOnline={this.props.moonlightStatus}
                           currentUser={this.state.currentUser}
                           newHostStatus={this.props.newHost.get('status')}           
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        hostList: state.moonlight.get('hostList'),
        appList: state.moonlight.get('appList'),
        newHost: state.moonlight.get('newHost'),
        startGame: state.moonlight.get('startGame'),
        authStatus: state.authentication.get('status'),
        moonlightStatus: state.moonlight.get('status')
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getHostsRequest: (userId) => {
            return dispatch(getHostsRequest(userId));
        },
        getAppsRequest: (userId, hostId) => {
            return dispatch(getAppsRequest(userId, hostId));
        },
        startGameRequest: (userId, hostId, appId, option) => {
            return dispatch(startGameRequest(userId, hostId, appId, option));
        },
        addHostRequest: (userId, hostIp, randomNumber) => {
            return dispatch(addHostRequest(userId, hostIp, randomNumber));
        },
        getAuthStatusRequest: () => {
            return dispatch(getAuthStatusRequest());
        },
        getMoonlightStatusRequest: (userId)=>{
            return dispatch(getMLStatusRequest(userId))
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MoonlightContainer);