import { Map, List } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import axios from 'axios';

const GET_SPEED = 'NETWORK/GET_SPEED';
const GET_SPEED_LOADING = 'NETWORK/GET_SPEED_WAITING';
const GET_SPEED_SUCCESS = 'NETWORK/GET_SPEED_SUCCESS';
const GET_SPEED_FAILURE = 'NETWORK/GET_SPEED_FAILURE';

const initialState = Map({
    status: 'INIT',
    data: Map({})
});

function getSpeedApiRequest(){
    return axios.post('/api/speedtest')
            .then(res=>{
                return Promise.resolve(res.data.data);
            })
            .catch(err=>{
                return Promise.reject(err);
            })
}

export const getSpeedRequest = ()=>({
    type: GET_SPEED,
    payload: getSpeedApiRequest()
});

export default handleActions({
    [GET_SPEED_LOADING]: (state, action)=>{
        return state.set('status', 'WAITING');
    },
    [GET_SPEED_SUCCESS]: (state, action)=>{
        return state.set('status', 'SUCCESS')
                    .set('data', Map(action.payload))
    },
    [GET_SPEED_FAILURE]: (state, action)=>{
        return state.set('status', 'FAILURE');
    }
}, initialState);