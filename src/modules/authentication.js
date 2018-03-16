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
// const CLEAN = 'AUTH/CLEAN'

const FINDID = 'AUTH/FINDID'
const FINDID_LOADING = 'AUTH/FINDID_LOADING'
const FINDID_SUCCESS = 'AUTH/FINDID_SUCCESS'
const FINDID_FAILURE = 'AUTH/FINDID_FAILURE'

const FINDPWD = 'AUTH/FINDPWD'
const FINDPWD_LOADING = 'AUTH/FINDPWD_LOADING'
const FINDPWD_SUCCESS = 'AUTH/FINDPWD_SUCCESS'
const FINDPWD_FAILURE = 'AUTH/FINDPWD_FAILURE'

const RESENDEMAIL ='AUTH/RESENDEMAIL'

const PWDVERIFIED = 'AUTH/PWDVERIFIED'
const PWDVERIFIED_LOADING = 'AUTH/PWDVERIFIED_LOADING'
const PWDVERIFIED_SUCCESS = 'AUTH/PWDVERIFIED_SUCCESS'
const PWDVERIFIED_FAILURE = 'AUTH/PWDVERIFIED_FAILURE'

const VERIFY ='AUTH/VERIFY'
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
    findPwd: Map({
        message:''   
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
    return axios.post('/api/auth', {userId, password})
            .then((res)=> {
                if(res.data.success){
                return Promise.resolve(
                {userId,verified:res.data.data.verified})}
                else{
                    return Promise.reject(res.data.message)
                }
            },(err)=>{
                return Promise.reject(err.response.data.message)}
            )
           
            }
           

/** 
 * 로그인 된 상태를 얻어온다.
 * @return {object} res.data.info :{userId : string} - 로그인 되어있으면 userId를 받아온다.
 */
function getStatusApiRequest(){
    return axios.get('/api/auth')
            .then((res)=>(Promise.resolve(res.data.data.userId)))
            .catch(err=>(Promise.reject(err.response.data.message)))
}
/**db에 담긴 모든 데이터를 받아온다
 * @param {res.data.info} {object}- 로그인 된 유저의 모든 db정보를 받아온다. pwd제외.
 */
function getAllInfoRequest(userId){
       return axios.get(`/api/users/rltjqdl1138?group=modification`)
            .then((res)=>{
                return Promise.resolve(res.data)})
            .catch(err=>Promise.reject(err.response.data.message))
}
/**
 * 아이디 찾기. userId를 받아온다.
 * @param {*} name 
 * @param {*} email 
 */
function findIdRequest(name,email){
    var nameEnc = btoa(name)
    var emailEnc = btoa(email)
   return axios.get(`/api/recovery/userid?name=${nameEnc}&email=${emailEnc}`)
            .then((res)=>{
                if(res.data.success)
                   { return Promise.resolve(res.data.data.userId)}
                else {console.log(res)
                    return Promise.reject(res.data.message)}
            },(err)=>Promise.reject(err.response.data.message))
            
    
     
}

/** 비밀번호 찾기. ->메일로 링크 쏴주기 ->비밀번호 바꾸는 창으로 감 
 * @param {string} id
 * @param {string} email
 */
function findPwdRequest(userId,email){
        return axios.put(`/api/recovery/password/${userId}/`,{userId,email})
                .then((res)=>{
                    if(res.data.success){
                        return Promise.resolve(res.data.message)
                    }else{
                        return Promise.reject(res.data.message)
                    }
                },(err)=>Promise.reject(err.response.data.message))
                
     
    }
      
 
/** 현재 비밀번호를 확인하는 함수
 * @param {string} pwd - password
 */
function pwdVerifyRequest(pwd){
    var enc = btoa(pwd)
   return axios.get(`/api/check/verification/password?${enc}`)
            .then((res)=>{
                if(res.data.success){
                    return  Promise.resolve()
                }else{
                    return Promise.reject(res.data.message)
                }
               
            }, (err)=>Promise.reject(err.response.data.message))
}
     
 

/**
 * 이메일에 인증 링크를 재전송한다.
 * @param {*} email 
 * @param {*} userId 
 */
export function reSendEmail(email,userId) {
    return (dispatch)=>{
        return axios.put(`/api/recovery/email/${userId}`,{email,userId})
            .then(()=>{console.log('hi'); dispatch({type: RESENDEMAIL})}
            )
            .catch((err)=>{
                console.log(err.response.data.message)
                return Promise.reject(err.response.data.message)})
    };
}
/** 로그아웃*/
export function logoutRequest() {
    return (dispatch) => {
        return axios.delete('/api/auth')
            .then(dispatch({type: LOGOUT}))
            .catch(err=>Promise.reject(err));
    };
}
// /**verify로 갈때는 로그인이 되어있으면 안되기 때문에. */
// export function cleanCurrentUser(){
//     return (dispatch)=>Promise.resolve(dispatch({type: CLEAN}))
// }
/**
 * 이메일 인증 메소드.
 * @param {string} token -인증 되었다는 토큰
 * @param {string} userId -현재 로그인 되어있던 유저.
 */
export function verify(token,userId){
    return (dispatch)=>axios.put(`/api/user/${userId}/verification?token=${token}`).then(dispatch({type:VERIFY}))
                            .catch(err=>Promise.reject(err.response.data.message))
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

export const findPwd = (userId,email)=>({
    type: FINDPWD,
    payload: findPwdRequest(userId,email)
})

export const pwdVerify = (pwd)=>({
    type: PWDVERIFIED,
    payload: pwdVerifyRequest(pwd)
})



export default handleActions({
    [LOGIN_LOADING]: (state, action)=>{
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
    // [CLEAN]: (state,action)=>{
    //     return state.setIn(['status','currentUser'],'')
    // },
    [FINDID_LOADING]:(state,action)=>{
        return state.setIn(['findId','gottenId'],'')
    },
    [FINDID_SUCCESS]: (state,action)=>{
        return state.setIn(['findId','gottenId'],action.payload)
    },
    [FINDID_FAILURE]: (state,action)=>{
        return state.setIn(['findId','gottenId'],'')
    },
    [FINDPWD_LOADING]:(state,action)=>{
        return state
    },
    [FINDPWD_SUCCESS]:(state,action)=>{
        return state.setIn(['findPwd','message'],action.payload)
    },
    [FINDPWD_FAILURE]:(state,action)=>{
        return state.setIn(['findPwd','message'],action.payload)
    },
    [PWDVERIFIED_LOADING]:(state,action)=>{
        return state.set('pwdVerified', false)
    },
    [PWDVERIFIED_SUCCESS]:(state,action)=>{
        return state.set('pwdVerified', true)
    },
    [PWDVERIFIED_FAILURE]:(state,action)=>{
        return state.set('pwdVerified', false)
    },
    [VERIFY]:(state,action)=>{
        return state
    }

}, initialState)