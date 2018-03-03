/**
 * 인증관련 함수들
 * @author G1
 * @logs // 18.2.25
 */
import {Map} from 'immutable';
import { handleActions} from 'redux-actions';
import axios from 'axios';

const LOGIN = "AUTH/LOGIN";
const LOGIN_LOADING = 'AUTH/LOGIN_LOADING';
const LOGIN_SUCCESS = "AUTH/LOGIN_SUCCESS";
const LOGIN_FAILURE = "AUTH/LOGIN_FAILURE";

const GET_STATUS = "AUTH/GET_STATUS";
const GET_STATUS_LOADING = "AUTH/GET_STATUS_LOADING";
const GET_STATUS_SUCCESS = "AUTH/GET_STATUS_SUCCESS";
const GET_STATUS_FAILURE = "AUTH/GET_STATUS_FAILURE";

const GET_ALLINFO = "AUTH/GET_ALLINFO";
const GET_ALLINFO_LOADING = "AUTH/GET_ALLINFO_LOADING";
const GET_ALLINFO_SUCCESS = "AUTH/GET_ALLINFO_SUCCESS";
const GET_ALLINFO_FAILURE = "AUTH/GET_ALLINFO_FAILURE";

const LOGOUT = "AUTH/LOGOUT";
const CLEAN = 'AUTH/CLEAN'

const FINDID = 'AUTH/FINDID'
const FINDID_LOADING = 'AUTH/FINDID_LOADING'
const FINDID_SUCCESS = 'AUTH/FINDID_SUCCESS'
const FINDID_FAILURE = 'AUTH/FINDID_FAILURE'

const FINDPWD = 'AUTH/FINDPWD'
// const FINDPWD_LOADING = 'AUTH/FINDPWD_LOADING'
// const FINDPWD_SUCCESS = 'AUTH/FINDPWD_SUCCESS'
// const FINDPWD_FAILURE = 'AUTH/FINDPWD_FAILURE'

const RESENDEMAIL ='AUTH/RESENDEMAIL'

const PWDVERIFIED = 'AUTH/PWDVERIFIED'
const PWDVERIFIED_LOADING = 'AUTH/PWDVERIFIED_LOADING'
const PWDVERIFIED_SUCCESS = 'AUTH/PWDVERIFIED_SUCCESS'
const PWDVERIFIED_FAILURE = 'AUTH/PWDVERIFIED_FAILURE'

/** 
 * login: 로그인 성공,실패 상태
 * status :상태를 받아옴, 로그인됬는지, 유효한지, 현재 유저는 누구인지.
 * findId :아이디 찾기에 사용. 찾은 아이디를 받아온다.
 * allInfo:개인정보수정에 사용. 사용자의 모든 정보를 받아온다.
 * pwdVerified: 개인정보 수정 할때 현재 비밀번호 확인이 되어있는지를 확인하는 함수
*/
const initialState = Map({
    login: Map({status: 'INIT'}),
    status: Map({
        isLoggedIn: false,
        verified: false,
        currentUser: ''
    }),
    findId: Map({
        gottenId:''
    }),
    allInfo: Map({}),
    pwdVerified:false


});

/**
 * 서버에 로그인 요청을 보낸다.
 * @param {string} userId 
 * @param {string} password 
 * @var {object} res.data :{verified: boolean} -이메일 인증이 되었는지
 */
function loginApiRequest(userId, password){
    return axios.post('/api/account/signin', {userId, password})
            .then((res)=> {
                return Promise.resolve(
                {userId,verified:res.data.verified})})
            .catch((err)=> Promise.reject(err))
}

/** 
 * 로그인 된 상태를 얻어온다.
 * @return {object} res.data.info :{userId : string} - 로그인 되어있으면 userId를 받아온다.
 */
function getStatusApiRequest(){
    return axios.get('/api/account/getinfo')
            .then((res)=>(Promise.resolve(res.data.info.userId)))
            .catch(err=>(Promise.reject()))
}
/**db에 담긴 모든 데이터를 받아온다
 * @param {res.data.info} {object}- 로그인 된 유저의 모든 db정보를 받아온다. pwd제외.
 */
function getAllInfoRequest(){
    console.log('ㅇㅣㄹ')
       return axios.get('/api/account/userInfo')
            .then((res)=>{
                console.log(res.data)
                Promise.resolve(res.data)})
            .catch(err=>(Promise.reject()))
}
/**
 * 아이디 찾기.
 * @param {*} name 
 * @param {*} email 
 */
function findIdRequest(name,email){//todo: dispatch를 안했는데도 실행이 됨.... 2.24
   return axios.post('/api/account/findId')
            .then((res)=>Promise.resolve(res.data.userId))
            .catch(()=>Promise.reject())
    
     
}

/** 비밀번호 찾기. ->메일로 링크 쏴주기 ->비밀번호 바꾸는 창으로 감 */
export function findPwd(id,email){
    return axios.post('/api/account/findPwd')
            .then(()=>Promise.resolve())
            .catch(()=>Promise.reject())


    }
      
 
/** 현재 비밀번호를 확인하는 함수
 * 
 */
function pwdVerifyRequest(pwd){
   return axios.post('/api/account/verified',{password:pwd})
            .then((res)=>Promise.resolve())
            .catch((err)=>Promise.reject())
}
     
 

/**
 * 이메일에 인증 링크를 재전송한다.
 * @param {*} email 
 * @param {*} userId 
 */
export function reSendEmail(email,userId) {
    return (dispatch)=>{
        return axios.post('/api/account/resend',{email,userId})
            .then((response) => {
                dispatch({type: RESENDEMAIL});
            });
    };
}
/** 로그아웃*/
export function logoutRequest() {
    return (dispatch) => {
        return axios.post('/api/account/logout')
            .then(dispatch({type: LOGOUT}));
    };
}
export function cleanCurrentUser(){
    return (dispatch)=>Promise.resolve(dispatch({type: CLEAN}))
}

export const loginRequest = (userId, password)=>({
    type: LOGIN,
    payload: loginApiRequest(userId, password)
})

export const getStatusRequest = ()=>({
    type: GET_STATUS,
    payload: getStatusApiRequest()
})

export const getAllInfo = ()=>({
    type: GET_ALLINFO,
    payload: getAllInfoRequest()
})

export const findId = (name,email)=>({
    type: FINDID,
    payload: findIdRequest(name,email)
})

export const pwdVerify = (pwd)=>({
    type: PWDVERIFIED,
    payload: pwdVerifyRequest(pwd)
})



export default handleActions({
    [LOGIN_LOADING]: (state, action)=>{
        console.log(state)
        return state.setIn(['login', 'status'], 'WAITING'); 
    },

    [LOGIN_SUCCESS]: (state, action)=>{
        return state.setIn(['login', 'status'], 'SUCCESS')
                    .mergeIn(['status'], Map({verified: action.payload.verified, currentUser: action.payload.userId}))
                    .setIn(['status','isLoggedIn'],true)
    },

    [LOGIN_FAILURE]: (state, action)=>{
        return state.setIn(['login','status'], 'FAILURE');
    },

    [GET_STATUS_LOADING]: (state, action)=>{
        return state.setIn(['status','isLoggedIn'], true);
    },

    [GET_STATUS_SUCCESS]: (state, action)=>{
        return state.mergeIn(['status'], Map({isLoggedIn: true, currentUser: action.payload}))
    },

    [GET_STATUS_FAILURE]: (state, action)=>{
        return state.setIn(['status','isLoggedIn'], false);
    },

    [GET_ALLINFO_LOADING]: (state, action)=>{
        return state;
    },

    [GET_ALLINFO_SUCCESS]: (state, action)=>{
        return state.set('allInfo', Map(action.payload));
    },

    [GET_ALLINFO_FAILURE]: (state, action)=>{
        return state
    },

    [LOGOUT]: (state, action)=>{
        return state.mergeIn(['status'], Map({isLoggedIn: false, currentUser: ''}));
    },
    [RESENDEMAIL]: (state,action)=>{
        return state
    },
    [CLEAN]: (state,action)=>{
        return state.setIn(['status','currentUser'],'')
    },
    [FINDID_LOADING]:(state,action)=>{
        return state.setIn(['findId','gottenId'],'')
    },
    [FINDID_SUCCESS]: (state,action)=>{
        return state.setIn(['findId','gottenId'],action.payload)
    },
    [FINDID_FAILURE]: (state,action)=>{
        return state.setIn(['findId','gottenId'],'')
    },
    [FINDPWD]:(state,action)=>{
        return state
    },
    [PWDVERIFIED_LOADING]:(state,action)=>{
        return state.set('pwdVerified', false)
    },
    [PWDVERIFIED_SUCCESS]:(state,action)=>{
        return state.set('pwdVerified', true)
    },
    [PWDVERIFIED_FAILURE]:(state,action)=>{
        return state.set('pwdVerified', false)
    }

}, initialState)