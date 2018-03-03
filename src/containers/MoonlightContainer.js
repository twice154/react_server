/**
 * 유저의 권한에 있던 게임 연결 시스템을 비제이가 할 수 있도록 넣은 것이다.
 * 이때 로그인 한 유저는 시청자이기 때문에 비제이가 관리 할 수 있도록 조치가 필요하다.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getStatusRequest as getMLStatusRequest, getHostsRequest, getAppsRequest, startGameRequest, addHostRequest } from '../modules/moonlight';
import { getStatusRequest as getAuthStatusRequest } from '../modules/authentication';
import {Moonlight} from '../components';
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
/** 현재 로그인 된 유저를 읽어온다. */
    getAuthStatus(){
        return this.props.getAuthStatusRequest().then(
            ()=>{
                let currentUser = this.props.authStatus.get('currentUser');
                    this.setState({
                        currentUser:currentUser
                    })
                    return currentUser;
            }
        )
    }
/**
 * conneto가 로그인 되어있는지를 받아오는 함수
 * @param {string} userId 
 * 
 */
    getMoonlightStatus(userId){
        return this.props.getMoonlightStatusRequest(userId).then(
            ()=>{
                if(this.props.moonlightStatus === "ONLINE"){
                    this.setState({
                        isMoonlightOnline:true
                    })
                    return true;
                }
                return Promise.reject();
            }
        )
    }

    /**
     * conneto 캐쉬에 저장된 호스트 목록 불러와 스테이트에 추가하는 함수.
     * @param {string} userId -시청자 아이디
     * @return {array} this.state.hostList - 미리 등록되었던 호스트 리스트
     */
    getHosts(userId){
        if(!this.state.isMoonlightOnline){
            return Promise.reject({error: "Moonlight is not online"})
        }
        return this.props.getHostsRequest(userId).then(
            ()=>{
                if(this.props.hostList.get('status')=== "GET_SUCCESS"){
                    this.setState(update(this.state,{
                        hostList: {set: this.props.hostList.get('data')}
                    }))
                    return this.state.hostList;
                }
                return Promise.reject();    
            }    
        )
    }
/**
 * 연결된 호스트의 할 수 있는 게임 목록을 가져온다.
 * @param {string} hostId -bj아이디
 * @param {string} userId -시청자 아이디
 */
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
/**
 * 게임을 시작시키고 실행한 게임 아이디를 반환한다.
 * @param {string} hostId -bj아이디
 * @param {string} userId -시청자 아이디
 * @param {string} appId -게임 이름
 * @param {*} option -게임 옵션.
 * @return appId - 게임이름
 */
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
/**
 * conneto에 호스트를 추가한다.(캐쉬에 저장된 목록에 추가된다.)
 * @param {s} hostIp -bj아이디
 * @param {s} userId -시청자 아이디
 * @param {num} pairingNum -엔비디아 비밀번호
 */
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
                           isMoonlightOnline={this.state.isMoonlightOnline}
                           currentUser={this.state.currentUser}           
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