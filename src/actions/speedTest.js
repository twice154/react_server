import {
	NETWORKTEST_GET_SPEED,
	NETWORKTEST_GET_SPEED_SUCCESS,
	NETWORKTEST_GET_SPEED_FAILURE
} from './ActionTypes';
import axios from 'axios';

export function getSpeedRequest(){
	return (dispatch)=>{
		dispatch(getSpeed());
		return axios.post('/api/speedtest')
		.then((res)=>{
			dispatch(getSpeedSuccess(res.data.data));
		}).catch((err)=>{
			dispatch(getSpeedFailure());
			console.log("err occured while getting network speed: " + err);
		})
	}
}

export function getSpeed(){
	return {
		type: NETWORKTEST_GET_SPEED
	}
}

export function getSpeedSuccess(data){
	return {
		type: NETWORKTEST_GET_SPEED_SUCCESS,
		data: data
	}
}

export function getSpeedFailure(){
	return{
		type: NETWORKTEST_GET_SPEED_FAILURE
	}
}