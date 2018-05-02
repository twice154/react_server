import { handleActions} from 'redux-actions';
import axios from 'axios';

const THUMBNAIL = 'DONATION/THUMBNAIL'
const THUMBNAIL_LOADING = 'DONATION/THUMBNAIL_LOADING'
const THUMBNAIL_SUCCESS = 'DONATION/THUMBNAIL_SUCCESS'
const THUMBNAIL_FAILURE = 'DONATION/THUMBNAIL_FAILURE'

const DONATION = 'DONATION/DONATION'
const DONATION_LOADING = 'DONATION/DONATION_LOADING'
const DONATION_SUCCESS = 'DONATION/DONATION_SUCCESS'
const DONATION_FAILURE = 'DONATION/DONATION_FAILURE'
const TOKEN='DONATION/TOKEN'
const TOKEN_LOADING='DONATION/TOKEN_LOADING'
const TOKEN_FAILURE='DONATION/TOKEN_FAILURE'
const TOKEN_SUCCESS='DONATION/TOKEN_SUCCESS'

const GETDONATIONSETTING='DONATION/GETDONATIONSETTING'
const GETDONATIONSETTING_LOADING='DONATION/GETDONATIONSETTING_LOADING'
const GETDONATIONSETTING_SUCCESS='DONATION/GETDONATIONSETTING_SUCCESS'
const GETDONATIONSETTING_FAILURE='DONATION/GETDONATIONSETTING_FAILURE'

const SETDONATIONSETTING='DONATION/SETDONATIONSETTING'
// const SETDONATIONSETTING_LOADING='DONATION/SETDONATIONSETTING_LOADING'
// const SETDONATIONSETTING_SUCCESS='DONATION/SETDONATIONSETTING_SUCCESS'
// const SETDONATIONSETTING_FAILURE='DONATION/SETDONATIONSETTING_FAILURE'
const GETSTREAMSOCKETID='DONATION/GETSTREAMSOCKETID'

const initialState = {
    thumbnail:'',
    donationSuccess:false,
    tokenNumber:-1,
    donationSetting:{
        state:false,
        settings:{}
    },
    streamSocketId:''
}

function getThumbnailRequest(url){
        return axios({
            method:'get',
            url:`/api/donation/thumbnail`,
            headers:{thumbnail:url}}).then((res)=>{
            return Promise.resolve(res.data.data.thumbnail)
        },(err)=>{
            return Promise.reject(err.response.data.message)
        })
}
/**
 * 도네이션을 하는 함수.
 * @param {object} data -[
 * 1. donationType==video --url:동영상 url, startTime:'시작시간', token:'사용한 토큰수',userId:'도네이션하는 사람의 닉네임',} * 토큰 1개=1초. 토큰 수가 끝 시간을 의미한다.
 * 2. donationType==message --message:메시지, token:'사용한 토큰수',userId:'도네이션하는 사람의 닉네임'
 * ]
 */
function donationRequest(data,streamName){
    console.log(data,streamName)
        return axios.post(`/api/donation/donation/${streamName}`,data).then((res)=>{
            return Promise.resolve()
        },(err)=>{ console.log(err.response.data.message)
           return Promise.reject(err.response.data.message)})
    }

function getTheNumberOfTokenRequest(){
        return axios.get('/api/donation/token')
                .then(res=>{
                    console.log(res.data.data.token)
                    return  Promise.resolve(res.data.data.token)
                },err=>{return Promise.reject(err.response.data.message)})
    }
    /**
     * 도네이션 미리 저장되어 있는 세팅을 가져오는 함수.
     */
function getDonationSettingRequest(){
    return axios.get('/api/donation/setting')
                .then((res)=>{
                    if(res.data.success){
                        return Promise.resolve(res.data.data.settings)
                    }else{
                        return Promise.reject()
                    }
                   
                },err=>{return Promise.reject(err.response.data.message)})
}


/**
 * 도네이션 세팅을 새롭게 저장하거나 업데이트 할 수 있게.
 * @param {object} a -{initialState.donationSetting.settings}
 */
export function setDonationSetting(a){
    console.log(a)
  return(dispatch)=>{
    return axios.put('/api/donation/setting',a)
                .then(()=>{dispatch({type:SETDONATIONSETTING})})
                .catch(err=>Promise.reject(err))
  }
}
/**
 * streamsocketid를 받아오는 함수.
 */
export function getStreamSocketId(){
  return(dispatch)=>{
    return axios.get('/api/donation/streamsocketid').then((res)=>{dispatch({type:GETSTREAMSOCKETID,payload:res.data.data.streamSocketId})})
                .catch(err=>Promise.reject(err))
  }
}


export const getDonationSetting=()=>({
    type:GETDONATIONSETTING,
    payload: getDonationSettingRequest()
})
export const getThumbnail = (url)=>({
    type: THUMBNAIL,
    payload: getThumbnailRequest(url)
})
export const donation = (data,streamName)=>({
    type: DONATION,
    payload : donationRequest(data,streamName)
})
export const getTheNumberOfToken = ()=>({
    type:TOKEN,
    payload : getTheNumberOfTokenRequest()
})


export default handleActions({
    [THUMBNAIL_LOADING]:(state,action)=>{
        return {...state,thumbnail:''}
    },
    [THUMBNAIL_SUCCESS]:(state,action)=>{
        return {...state,thumbnail:action.payload}
    },
    [THUMBNAIL_FAILURE]:(state,action)=>{
        return {...state,thumbnail:''}
    },
    [DONATION_LOADING]:(state,action)=>{
        return {...state}
    },
    [DONATION_SUCCESS]:(state,action)=>{
        return {...state}
    },
    [DONATION_FAILURE]:(state,action)=>{
        return {...state}
    },
    [TOKEN_LOADING]:(state,action)=>{
        return {...state}
    },
    [TOKEN_SUCCESS]:(state,action)=>{
        return {...state, tokenNumber:action.payload}
    },
    [TOKEN_FAILURE]:(state,action)=>{
        return {...state}
    },
    [GETDONATIONSETTING_LOADING]:(state,action)=>{
        return {...state}
    },
    [GETDONATIONSETTING_SUCCESS]:(state,action)=>{
        //fobiddens가 string으로 저장되어 있었으므로  array로 다시 돌려준다.
        return {...state, donationSetting:{settings:{...action.payload, fobiddens:action.payload.fobiddens.split(',')}, state:true}}
    },
    [GETDONATIONSETTING_FAILURE]:(state,action)=>{
        return {...state, donationSetting:{...state.donationSetting, state:false}}
    },
    [SETDONATIONSETTING]:(state,action)=>{
        return{...state}
    },
    [GETSTREAMSOCKETID]:(state,action)=>{
        return{...state, streamSocketId:action.payload}
    }
    
},initialState)