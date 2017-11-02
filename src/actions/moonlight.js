                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         import {
	MOONLIGHT_GET_HOSTS,
	MOONLIGHT_GET_HOSTS_SUCCESS,
	MOONLIGHT_GET_HOSTS_FAILURE,
	MOONLIGHT_GET_APPS,
	MOONLIGHT_GET_APPS_SUCCESS,
	MOONLIGHT_GET_APPS_FAILURE,
	MOONLIGHT_ADD_HOST,
	MOONLIGHT_ADD_HOST_SUCCESS,
	MOONLIGHT_ADD_HOST_FAILURE,
	MOONLIGHT_START_GAME,
	MOONLIGHT_START_GAME_SUCCESS,
	MOONLIGHT_START_GAME_FAILURE
} from './ActionTypes';
import axios from 'axios';

export function getHostsRequest(userId){
	return (dispatch) => {
		dispatch(getHosts());

		return axios.post('/api/moonlight/gethosts', {userId})
		.then((response)=>{
			console.log(response);
			dispatch(getHostsSuccess(JSON.parse(response.data)));
		}).catch((err)=>{
			console.log(err);
			dispatch(getHostsFailure());	
		})

	}
}

export function getHosts(){
	return {
		type: MOONLIGHT_GET_HOSTS
	}
}

export function getHostsSuccess(data){
	return {
		type: MOONLIGHT_GET_HOSTS_SUCCESS,
		data
	}
}

export function getHostsFailure(){
	return {
		type: MOONLIGHT_GET_HOSTS_FAILURE
	}
}

export function getAppsRequest(userId, hostId){
	return (dispatch)=>{
		dispatch(getApps());

		return axios.post('/api/moonlight/getapps', {userId: userId, hostId: hostId})
		.then((response)=>{
			dispatch(getAppsSuccess(JSON.parse(response.data)));
		}).catch((err)=>{
			dispatch(getAppsFailure());
		})
	}
}

export function getApps(){
	return {
		type: MOONLIGHT_GET_APPS
	}
}

export function getAppsSuccess(data){
	console.log(data);
	return {
		type: MOONLIGHT_GET_APPS_SUCCESS,
		data
	}
}

export function getAppsFailure(){
	return {
		type: MOONLIGHT_GET_APPS_FAILURE
	};
}

export function addHostRequest(userId, hostIp, pairingNum){
	return (dispatch)=>{
		dispatch(addHost(pairingNum));
		return axios.post('/api/moonlight/addhost', {userId, hostIpaddress: hostIp, pairingNum: pairingNum})
		.then((response)=>{
			console.log("Success!");
			console.log(response.data);
			dispatch(addHostSuccess(JSON.parse(response.data)));
		}).catch((error)=>{
			dispatch(addHostFailure());
		})
	}
}

export function addHost(pairingNum){
	return {
		type: MOONLIGHT_ADD_HOST,
		pairingNum
	}
}

export function addHostSuccess(data){
	return {
		type: MOONLIGHT_ADD_HOST_SUCCESS,
		data
	}
}

export function addHostFailure(){
	return {
		type: MOONLIGHT_ADD_HOST_FAILURE
	}
}

export function startGameRequest(userId, hostId, appId, option){
	return (dispatch) => {
		dispatch(startGame());

		return axios.post('/api/moonlight/startgame', {userId, hostId: hostId, appId: appId, option: option})
		.then((response)=>{
			dispatch(startGameSuccess(appId));
		}).catch((error)=>{
			dispatch(startGameFailure());
		});
	}
} 

export function startGame(){
	return {
		type: MOONLIGHT_START_GAME
	}
}

export function startGameSuccess(appId){
	return {
		type: MOONLIGHT_START_GAME_SUCCESS,
		appId
	}
}

export function startGameFailure(){
	return {
		type: MOONLIGHT_START_GAME_FAILURE
	}
}