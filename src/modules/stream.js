/**
 * thumbnail 받아오기 업데이트
 * @author G1
 * @logs // 18.5.5
 */
import {handleActions } from 'redux-actions';
import axios from 'axios';

const GET_STREAMLISTS = 'STREAM/GET_STREAMLISTS';


const initialState = {
    lists:{}
}
/**
 * 홈페이지의 리스트를 받아오는 함수.(todo: thumbnail받아오는 작업 해주어야함. 홈페이지에서!!)
 * res.data.data.list = {room:{description,시청자수,sessionId}, ...}인 객체를 불러온다.
 */
export function getStreamLists(){
    return (dispatch)=>{
        return axios.get('/api/media/list')
            .then((res)=>{dispatch({type: GET_STREAMLISTS,payload:res.data.data.list})}
            )
            .catch((err)=>{
                console.log(err.response.data.message)
                return Promise.reject(err.response.data.message)})
    };
}

export default handleActions({
    [GET_STREAMLISTS]: (state, action)=>{
        return {...state, lists:action.payload}
    },
    
}, initialState)


