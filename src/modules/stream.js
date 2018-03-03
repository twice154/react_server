/**
 * red5pro로 업데이트 예정
 * @author G1
 * @logs // 18.2.25
 */

import { Map, List, fromJS} from 'immutable';
import {handleActions } from 'redux-actions';
import axios from 'axios';

const GET_STREAMS = 'STREAM/GET_STREAM';
const GET_STREAMS_LOADING= 'STREAM/GET_STREAMS_LOADING';
const GET_STREAMS_SUCCESS = 'STREAM/GET_STREAMS_SUCCESS';
const GET_STREAMS_FAILURE = 'STREAM/GET_STREAMS_FAILURE';

const initialState = Map({
    status: 'INIT', 
    streamList: List([])
});

function getStreamApiRequest(){
    return axios.get('api/stream/list')
        .then((res)=>{
            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(res.data, "text/xml");
            let streamList = [];
            for (let i = 0; i < xmlDoc.getElementsByTagName("Stream").length; i++) {
                let name = xmlDoc.getElementsByTagName("Stream")[i].childNodes[0].childNodes[0].nodeValue;
                let thumbnail = "http://localhost:8086/thumbnail?application=live&streamname=" + name + "&size=640x360&fitmode=letterbox";
                streamList.push(Map({name, thumbnail}));
            }
            return Promise.resolve(streamList);
        })
        .catch(err=>{
            return Promise.reject(err);
        })
}

export const getStreamsRequest = ()=>({
    type: GET_STREAMS,
    payload: getStreamApiRequest()
})

export default handleActions({
    [GET_STREAMS_LOADING]: (state, action)=>{
        return state.set('status', 'WAITING');
    },
    [GET_STREAMS_SUCCESS]: (state, action)=>{
        return state.set('status', 'SUCCESS')
                    .set('streamList', fromJS(action.payload))
    },
    [GET_STREAMS_FAILURE]: (action, state)=>{
        return state.set('status', 'FAILURE')
                    .set('streamList', List([]))
    }
}, initialState)


