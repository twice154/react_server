import { Map, List } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import axios from 'axios';

const GET_HOSTS = "MOONLIGHT/GET_HOSTS";
const GET_HOSTS_LOADING = "MOONLIGHT/GET_HOSTS_LOADING"
const GET_HOSTS_SUCCESS = "MOONLIGHT/GET_HOSTS_SUCCESS"
const GET_HOSTS_FAILURE = "MOONLIGHT/GET_HOSTS_FAILURE"
const GET_APPS = "MOONLIGHT/GET_APPS";
const GET_APPS_LOADING = "MOONLIGHT/GET_APPS_LOADING"
const GET_APPS_SUCCESS = "MOONLIGHT/GET_APPS_SUCCESS"
const GET_APPS_FAILURE = "MOONLIGHT/GET_APPS_FAILURE"
const ADD_HOST = "MOONLIGHT/ADD_HOST";
const ADD_HOST_LOADING= "MOONLIGHT/ADD_HOST_LOADING"
const ADD_HOST_SUCCESS = "MOONLIGHT/ADD_HOST_SUCCESS"
const ADD_HOST_FAILURE = "MOONLIGHT/ADD_HOST_FAILURE"
const START_GAME = "MOONLIGHT/START_GAME";
const START_GAME_LOADING = "MOONLIGHT/START_GAME_LOADING"
const START_GAME_SUCCESS = "MOONLIGHT/START_GAME_SUCCESS"
const START_GAME_FAILURE = "MOONLIGHT/START_GAME_FAILURE"

const initialState = Map({
    histList: Map({
        status: 'INIT',
        data: List([])
    }),
    appList: Map({
        status: 'INIT',
        data: List([])
    }),
    startGame: Map({
        status: 'INIT',
        currentGame: 'INIT'
    }),
    newHost: Map({
        status: 'INIT',
        data: List([]),
        pairingNum: '' //it's not used for now
    })
})

function getHostApiRequest(userId){
    return axios.post('/api/moonlight/gethosts', {userId})
        .then((res)=>{
            if(res.data.error){
                return Promise.reject(res.data.error);
            }
            else{
                return Promise.resolve(res.data);
            }
        })
        .catch((err)=>{
            return Promise.reject(err);
        })
}

function getAppsApiRequest(userId, hostId){
    return axios.post('/api/moonlight/getapps', {userId, hostId})
        .then(res=>{
            return Promise.resolve(res.data);
        })
        .catch(err=>{
            return Promise.reject();
        })
}

function addHostApiRequest(userId, hostIp, pairingNum){
    return axios.post('/api/moonlight/addhost', {userId, hostIpaddress: hostIp, pairingNum})
        .then(res=>{
            return Promise.resolve(JSON.parse(res.data));
        })
        .catch(err=>{
            return Promise.resolve(err);
        })
}

function startGameApiRequest(userId, hostId, appId, option){
    return axios.post('/api/moonlight/startgame', {userId, hostId, appId, option})
        .then(res=>{
            return Promise.resolve(appId);
        })
        .catch(err=>{
            return Promise.reject(err);
        })
}

export const getHostRequest = (userId)=>({
    type: GET_HOSTS,
    payload: getHostApiRequest(userId)
})

export const getAppsRequest = (userId, hostId)=>({
    type: GET_APPS,
    payload: getAppsApiRequest(userId, hostId)
})

export const addHostRequest = (userId, hostIp, pairingNum)=>({
    type: ADD_HOST,
    payload: addHostApiRequest(userId, hostIp, pairingNum)
})

export const startGameRequest = (userId, hostId, appID, option)=>({
    type: START_GAME,
    payload: startGameApiRequest(userId, hostId, appId, option)
})

export default handleActions({
    [GET_HOSTS_LOADING]: (state, action)=>{
        return state.setIn(['hostList', 'status'], 'WAITING');        
    },

    [GET_HOSTS_SUCCESS]: (state, action)=>{
        return state.set('hostList', Map({status: 'GET_SUCCESS', data: List(action.payload.list)}))
    },

    [GET_HOSTS_FAILURE]: (state, action)=>{
        return state.set('hostList', Map({status: 'GET_FAILURE', data: List(action.payload)}))
    },

    [GET_APPS_LOADING]: (state, action)=>{
        return state.setIn(['appList, status'], 'WAITING');
    },

    [GET_APPS_SUCCESS]: (state, action)=>{
        return state.set('appList', Map({status: 'SUCCESS', data: List(action.payload.appList)}))
    },

    [GET_APPS_FAILURE]: (state, action)=>{
        return state.setIn(['appList', 'status'], 'FAILURE');
    },

    [ADD_HOST_LOADING]: (state, action)=>{    ////////?////////
        return state.setIn(['hostList', 'status'],'ADD_WAITING')
                //.setIn(['newHost', 'pairingNum'], action.payload);
    },

    [ADD_HOST_SUCCESS]: (state, action)=>{
        const hostListData = state.getIn(['hostList','data'])
        return state.set('hostList', Map({status: 'ADD_SUCCESS',data: hostListData.push(action.payload)}))
                    .setIn(['newHost', 'data'], action.payload);
    },

    [ADD_HOST_FAILURE]: (state, action)=>{
        return state.setIn(['hostList', 'status'], 'ADD_FAILURE');
    },

    [START_GAME_LOADING]: (state, action)=>{
        return state.setIn(['startGame', 'status'], 'WAITING');
    },

    [START_GAME_SUCCESS]: (state, action)=>{
        return state.set('startGame', Map({status: 'SUCCESS', currentGame: action.payload}));
    },

    [START_GAME_FAILURE]: (state, action)=>{
        return state.setIn(['startGame', 'status'], 'FAILURE');
    }
}, initialState);