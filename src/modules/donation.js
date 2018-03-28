import { handleActions} from 'redux-actions';
import axios from 'axios';

const THUMBNAIL = 'DONATION/THUMBNAIL'
const THUMBNAIL_LOADING = 'DONATION/THUMBNAIL_LOADING'
const THUMBNAIL_SUCCESS = 'DONATION/THUMBNAIL_SUCCESS'
const THUMBNAIL_FAILURE = 'DONATION/THUMBNAIL_FAILURE'

const VIDEO = 'DONATION/VIDEO'
const VIDEO_LOADING = 'DONATION/VIDEO_LOADING'
const VIDEO_SUCCESS = 'DONATION/VIDEO_SUCCESS'
const VIDEO_FAILURE = 'DONATION/VIDEO_FAILURE'

const initialState = {
    thumbnail:'',
    videoSuccess:false
}

function getThumbnailRequest(url){
    return (dispatch)=>{
        return axios({
            method:'get',
            url:`/api/functions/thumbnail`,
            headers:{thumbnail:url}}).then((res)=>{
                console.log(res.data.thumbnail)
            return Promise.resolve(res.data.thumbnail)
        },(err)=>{
            return Promise.reject(err)
        })
    }
}
/**
 * 
 * @param {object} data -{url:동영상 url, startTime:'시작시간', token:'사용한 토큰수'}
 * 토큰 1개=1초. 토큰 수가 끝 시간을 의미한다.
 */
function videoDonationRequest(data){
    return (dispatch)=>{
        console.log(data)
        return axios.post('/api/functions/donation',data).then((res)=>{
            return Promise.resolve()
        },(err)=>{ console.log(err.response.data.message)
           return Promise.reject()})
    }

}


export const getThumbnail = (url)=>({
    type: THUMBNAIL,
    payload: getThumbnailRequest(url)
})
export const videoDonation = (data)=>({
    type: VIDEO,
    payload : videoDonationRequest(data)
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
    [VIDEO_LOADING]:(state,action)=>{
        return {...state}
    },
    [VIDEO_SUCCESS]:(state,action)=>{
        return {...state}
    },
    [VIDEO_FAILURE]:(state,action)=>{
        return {...state}
    }
},initialState)