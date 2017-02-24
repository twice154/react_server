 import {
    GET_STREAMS,
    GET_STREAMS_SUCCESS,
    GET_STREAMS_FAILURE
} from './ActionTypes';
import axios from 'axios';

export function getStreamsRequest(){
	return (dispatch) =>{
  		dispatch(getStreams());

  		return axios.get('api/stream/list')
  		.then((response)=>{
  			let parser = new DOMParser();
			let xmlDoc = parser.parseFromString(response.data,"text/xml");
			let streamList = [];
			for(let i=0; i<xmlDoc.getElementsByTagName("Stream").length; i++){
				streamList.push(xmlDoc.getElementsByTagName("Stream")[i].childNodes[0].childNodes[0].nodeValue);
			}
			console.log(streamList);
  			dispatch(getStreamsSuccess(streamList, false));
  		}).catch((error)=>{
        console.log(error);
  			dispatch(getStreamsFailure());
  		});
	}
}

export function getStreams(){
	return {
		type: GET_STREAMS
	}
}

export function getStreamsSuccess(data, isInitial){
  console.log("data: " + data);
	return {
		type: GET_STREAMS_SUCCESS,
		data,
		isInitial
	}
}

export function getStreamsFailure(){
	return {
		type: GET_STREAMS_FAILURE
	}
}