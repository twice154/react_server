/**
 * 등록할때 사용하는 리덕스
 * @author g1
 * @log 18.02.27
 */

import { handleActions} from 'redux-actions';
import axios from 'axios';
const REGISTER = "REGIST/REGISTER";
const REGISTER_LOADING = "REGIST/REGISTER_LOADING";
const REGISTER_SUCCESS = "REGIST/REGISTER_SUCCESS";
const REGISTER_FAILURE = "REGIST/REGISTER_FAILURE";

const NEWREGIST = 'REGIST/NEWREGIST'
const NEWREGIST_LOADING = 'REGIST/NEWREGIST_LOADING'
const NEWREGIST_SUCCESS = 'REGIST/NEWREGIST_SUCCESS'
const NEWREGIST_FAILURE = 'REGIST/NEWREGIST_FAILURE'

const QUIT = 'REGIST/QUIT'


//이메일이 유효한지
const EMAIL='REGIST/EMAIL';
const EMAIL_LOADING = 'REGIST/EMAIL_LOADING'
const EMAIL_SUCCESS = 'REGIST/EMAIL_SUCCESS'
const EMAIL_FAILURE = 'REGIST/EMAIL_FAILURE'

//아이다기 유효한지.
const ID ='REGIST/ID'
const ID_LOADING='REGIST/ID_LOADING'
const ID_SUCCESS='REGIST/ID_SUCCESS'
const ID_FAILURE='REGIST/ID_FAILURE'

//폰 번호가 유효한지.
const PHONE ='REGIST/PHONE'
const PHONE_LOADING ='REGIST/PHONE_LOADING'
const PHONE_SUCCESS ='REGIST/PHONE_SUCCESS'
const PHONE_FAILURE ='REGIST/PHONE_FAILURE'

//닉네임이 유효한지.
const NICKNAME ='REGIST/NICKNAME'
const NICKNAME_LOADING ='REGIST/NICKNAME_LOADING'
const NICKNAME_SUCCESS ='REGIST/NICKNAME_SUCCESS'
const NICKNAME_FAILURE ='REGIST/NICKNAME_FAILURE'


/**
 * regist: 등록에 성공,실패여부
 * id: 아이디가 존재 하는지 안하는지를 확인(사용가능여부)
 * email: 위와같음
 * 
 */
const initialState ={
    regist:{
        status: 'INIT'
    },
    idCheck:false
    ,
    emailCheck:false
    ,
    phoneCheck:false,
    nicknameCheck:false
}

/**
 * db에 등록한다.
 * @param {object} msg {userId, password, name, birth, gender, email, phone,}
 * nickname은 제외한다. --register가 너무 복잡한것 같아서.
 * 이메일 중복도 앞으로 제외할 예정
 * TODO: phone 인증 모듈 설치.
 * 
 * //userid 중복은 check에 있으니 수정할 것.
 */
function registerApiRequest(msg){
    console.log(msg)
    return axios.post('/api/users', msg)
            .then((res)=>Promise.resolve())
            .catch(err=> Promise.reject(err.response.data.message))
}
/**
 * 개인정보 수정에 사용. 새롭게 정보를 등록한다.
 * @param {object} msg {property이름: string} ex)phone,password,email
 * @param {'string'} id - currentuser id
 */
function newRegisterApiRequest(msg,id){
   return axios.put(`/api/users/${id}/${Object.keys(msg)[0]}`,msg)
            .then(()=>Promise.resolve())
            .catch(err=>Promise.reject(err.response.data.message))
}
/**
 * 탈퇴하는 함수.
 * @param {string} id -아이디
 */
export function quit(id){
    return (dispatch)=>{
       return axios.delete(`/api/users/${id}`)
            .then(()=>{dispatch({type:QUIT})})
            .catch((err)=>Promise.reject(err.response.data.message))
    }
}
/**
 * 이메일이 사용 가능한지 여부를 확인한다.
 * @param {string} email 
 */
function emailApiRequest(email){
        return axios.get(`/api/check/duplication/email/${email}`)
        .then((res)=>{
            if(res.data.success){
                return Promise.resolve()
            }else{
                return Promise.reject()
            }
        },err=>Promise.reject(err.response.data.message))
    }
/**
 * 폰 번호가 사용 가능한지 여부를 확인한다.
 * @param {string} phone
 */
function phoneApiRequest(phone){
    return axios.get(`/api/check/duplication/phone/${phone}`)
    .then((res)=>{
        if(res.data.success){
            return Promise.resolve()
        }else{
            return Promise.reject()
        }
    },err=>Promise.reject(err.response.data.message))
}
/**
 * 아이디 사용 가능 여부를 확인한다.
 * @param {string} userId 
 */
function idApiRequest(userId){
    return axios.get(`/api/check/duplication/userId/${userId}`)
    .then((res)=>{
        if(res.data.success){
            return Promise.resolve()
        }else{
            return Promise.reject()
        }
    },err=>Promise.reject(err.response.data.message))
}
/**
 * 닉네임 사용 가능 여부를 확인한다.
 * @param {string} userId 
 */
function nicknameApiRequest(nickname){
    return axios.get(`/api/check/duplication/nickname/${nickname}`)
    .then((res)=>{
        console.log(res)
        if(res.data.success){
            return Promise.resolve()
        }else{
            return Promise.reject()
        }
    },err=>Promise.reject(err.response.data.message))
}



export const registerRequest = (msg)=>({
    type: REGISTER,
    payload: registerApiRequest(msg)
})
export const newRegister = (msg,id)=>({
    type: NEWREGIST,
    payload: newRegisterApiRequest(msg,id)
})


export const idRequest = (id)=>({
    type: ID,
    payload: idApiRequest(id)
})

export const emailRequest = (email)=>({
    type: EMAIL,
    payload: emailApiRequest(email)
})
export const phoneRequest = (phone)=>({
    type: PHONE,
    payload: phoneApiRequest(phone)
})
export const nicknameRequest = (phone)=>({
    type: NICKNAME,
    payload: nicknameApiRequest(phone)
})


export default handleActions({
[REGISTER_LOADING]: (state, action)=>{
    return {...state, regist:{ status:'LOADING'}};
},

[REGISTER_SUCCESS]: (state, action)=>{
    return {...state, regist:{ status:'SUCCESS'}};
},

[REGISTER_FAILURE]: (state, action)=>{
    return {...state, regist:{status:'FAILURE'}};
},

[NEWREGIST_LOADING]: (state, action)=>{
    return {...state};
},

[NEWREGIST_SUCCESS]: (state, action)=>{
    return {...state};
},

[NEWREGIST_FAILURE]: (state, action)=>{
    return {...state,};
},
[ID_LOADING]: (state, action)=>{
    return {...state};
},

[ID_SUCCESS]: (state, action)=>{
    return {...state, idCheck:true};
},

[ID_FAILURE]: (state, action)=>{
    return {...state, idCheck:false};
},
[EMAIL_LOADING]: (state, action)=>{
    return {...state};
},

[EMAIL_SUCCESS]: (state, action)=>{
    return {...state,emailCheck:true};
},

[EMAIL_FAILURE]: (state, action)=>{
    return { ...state,emailCheck:false};
},
[PHONE_LOADING]: (state, action)=>{
    return {...state};
},

[PHONE_SUCCESS]: (state, action)=>{
    return {...state, phoneCheck:true};
},

[PHONE_FAILURE]: (state, action)=>{
    return { ...state, phoneCheck:false};
},
[QUIT]:(state,action)=>{
    return{...state}
},
[NICKNAME_LOADING]: (state, action)=>{
    return {...state};
},

[NICKNAME_SUCCESS]: (state, action)=>{
    return {...state, nicknameCheck:true};
},

[NICKNAME_FAILURE]: (state, action)=>{
    return { ...state, nicknameCheck:false};
},
},initialState)

