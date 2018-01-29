
import {Map, List} from 'immutable';
import {createAction, handleActions} from 'redux-actions';
import axios from 'axios';
import { take, put, call, fork, select, all } from 'redux-saga/effects'

const LOGIN = "AUTH/LOGIN";
const LOGIN_LOADING = 'AUTH/LOGIN_LOADING';
const LOGIN_SUCCESS = "AUTH/LOGIN_SUCCESS";
const LOGIN_FAILURE = "AUTH/LOGIN_FAILURE";
const REGISTER = "AUTH/REGISTER";
const REGISTER_LOADING = "AUTH/REGISTER_LOADING";
const REGISTER_SUCCESS = "AUTH/REGISTER_SUCCESS";
const REGISTER_FAILURE = "AUTH/REGISTER_FAILURE";
const GET_STATUS = "AUTH/GET_STATUS";
const GET_STATUS_LOADING = "AUTH/GET_STATUS_LOADING";
const GET_STATUS_SUCCESS = "AUTH/GET_STATUS_SUCCESS";
const GET_STATUS_FAILURE = "AUTH/GET_STATUS_FAILURE";
const LOGOUT = "AUTH/LOGOUT";

const initialState = Map({
    login: Map({status: 'INIT'}),
    register: Map({
        status: 'INIT',
         error: -1
    }),
    status: Map({
        valid: false,
        isLoggedInL: false,
        currentUser: ''
    })
});

function loginApiRequest(userId, password){
    return axios.post('/api/account/signin', {userId, password})
            .then((res)=>Promise.resolve(userId))
            .catch((err)=>Promise.reject(err))
}

function registerApiRequest(userId, password){
    return axios.post('./api/account/signup', {userId, password})
            .then((res)=>Promise.resolve())
            .catch(err=>Promise.reject(err.response.data.code))
}

function getStatusApiRequest(){
    return axios.get('/api/account/getinfo')
            .then((res)=>(Promise.resolve(res.data.info.username)))
            .catch(err=>(Promise.reject()))
}

export function logoutRequest() {
    return (dispatch) => {
        return axios.post('/api/account/logout')
            .then((response) => {
                dispatch({type: LOGOUT});
            });
    };
}

export const loginRequest = (userId, password)=>({
    type: LOGIN,
    payload: loginApiRequest(userId, password)
})

export const registerRequest = (userId, password)=>({
    type: REGISTER,
    payload: registerApiRequest(userId, password)
})

export const getStatusRequest = ()=>({
    type: GET_STATUS,
    payload: getStatusApiRequest()
})

export default handleActions({
    [LOGIN_LOADING]: (state, action)=>{
        return state.setIn(['login', 'status'], 'WAITING'); 
    },

    [LOGIN_SUCCESS]: (state, action)=>{
        return state.setIn(['login', 'status'], 'SUCCESS')
                    .mergeIn(['status'], {isLoggedIn: true, currentUser: action.payload});
    },

    [LOGIN_FAILURE]: (state, action)=>{
        return state.setIn(['login','status'], 'FAILURE');
    },

    [REGISTER_LOADING]: (state, action)=>{
        return state.mergeIn(['register'], {status: 'WAITING', error: -1});
    },

    [REGISTER_SUCCESS]: (state, action)=>{
        return state.setIn(['register', 'status'], 'SUCCESS');
    },

    [REGISTER_FAILURE]: (state, action)=>{
        return state.mergeIn(['register'], {status: 'FAILURE', error: action.payload});
    },

    [GET_STATUS_LOADING]: (state, action)=>{
        return state.setIn(['status', 'isLoggedIn'], true);
    },

    [GET_STATUS_SUCCESS]: (state, action)=>{
        return state.mergeIn(['status'], {valid: true, currentUser: action.payload})
    },

    [GET_STATUS_FAILURE]: (state, action)=>{
        return state.mergeIn(['status'], {valid: false, isLoggedIn: false});
    },

    [LOGOUT]: (state, action)=>{
        return state.mergeIn(['status'], {isLoggedIn: false, currentUser: ''});
    }

}, initialState)