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



const initialState ={
    regist:{
        status: 'INIT',
         error: -1
    },
    id:{
        status:'init',
        check:false
    },
    email:{
        status:'init',
        check:false
    }
}


function registerApiRequest(msg){
    console.log(msg)
    return axios.post('./api/account/signup', msg)
            .then((res)=>Promise.resolve())
            .catch(err=>Promise.reject(err.response.data.code))
}

function newRegisterApiRequest(msg){
    console.log(msg)
    return Promise.resolve()
}

function emailApiRequest(email){
        return axios.post('./api/account/emailcheck',{email})
        .then((res)=>Promise.resolve())
        .catch(err=>Promise.reject())
      
    }

function idApiRequest(userId){
    return axios.post('./api/account/userIdcheck',{userId})
    .then((res)=>Promise.resolve())
    .catch(err=>Promise.reject())
       
    }



export const registerRequest = (msg)=>({
    type: REGISTER,
    payload: registerApiRequest(msg)
})
export const newRegister = (msg)=>({
    type: NEWREGIST,
    payload: newRegisterApiRequest(msg)
})


export const idRequest = (id)=>({
    type: ID,
    payload: idApiRequest(id)
})

export const emailRequest = (email)=>({
    type: EMAIL,
    payload: emailApiRequest(email)
})

export default handleActions({
[REGISTER_LOADING]: (state, action)=>{
    return {...state, regist:{...state.register, status:'LOADING'}};
},

[REGISTER_SUCCESS]: (state, action)=>{
    return {...state, regist:{...state.register, status:'SUCCESS'}};
},

[REGISTER_FAILURE]: (state, action)=>{
    return {...state, regist:{ error:action.payload,status:'fail'}};
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
    return {...state, id:{...state.id, status:'loading'}};
},

[ID_SUCCESS]: (state, action)=>{
    return {...state, id:{check:true,status:'아이디를 사용할 수 있습니다.'}};
},

[ID_FAILURE]: (state, action)=>{
    return {...state, id:{check:false,status:'아이디가 이미 사용중입니다.'}};
},
[EMAIL_LOADING]: (state, action)=>{
    return {...state, email:{...state.email,status:'loading'}};
},

[EMAIL_SUCCESS]: (state, action)=>{
    return {...state,email:{check:true,status:'이메일을 사용할 수 있습니다.'}};
},

[EMAIL_FAILURE]: (state, action)=>{
    return { ...state,email:{check:false,status:'이메일이 이미 사용중입니다.'}};
}
},initialState)

