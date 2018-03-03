/**
 * speedTest
 * @author G1
 * @logs // 18.2.27
 */


import { Map, fromJS } from 'immutable';
import {handleActions } from 'redux-actions';
import axios from 'axios';

const GET_SPEED = 'NETWORK/GET_SPEED';
const GET_SPEED_LOADING = 'NETWORK/GET_SPEED_LOADING';
const GET_SPEED_SUCCESS = 'NETWORK/GET_SPEED_SUCCESS';
const GET_SPEED_FAILURE = 'NETWORK/GET_SPEED_FAILURE';

const initialState = Map({
    status: 'INIT',
    data: Map({})
});
/**
 * 서버에서 스피드를 테스트 하여 데이터를 얻어온다.
 * 
 */
function getSpeedApiRequest(){
    return axios.post('/api/speedtest')
            .then(res=>{
                return Promise.resolve(res.data.data);
            })
            .catch(err=>{
                return Promise.reject();
            })
}

export const getSpeedRequest = ()=>({
    type: GET_SPEED,
    payload: getSpeedApiRequest()
});

export default handleActions({
    GET_SPEED_LOADING: (state, action)=>{
        return state.set('status', 'WAITING');
    },
    GET_SPEED_SUCCESS: (state, action)=>{
        return state.set('status', 'SUCCESS')
                    .set('data', fromJS(action.payload))
    },
    GET_SPEED_FAILURE: (state, action)=>{
        return state.set('status', 'FAILURE');
    }
}, initialState);