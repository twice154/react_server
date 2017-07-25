import * as types from 'actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
	status: 'INIT',
	streamList: []
}

export default function Stream(state, action){
	if(typeof state == "undefined"){
		state = initialState;
	}

	switch(action.type){

		case types.GET_STREAMS:
			console.log(action.data);
			return update(state, {
				status: {$set: 'WAITING'}
			});

		case types.GET_STREAMS_SUCCESS:
			return update(state, {
				status:{$set: 'SUCCESS'},
				streamList: {$set: action.data}
			});

		case types.GET_STREAMS_FAILURE:
			return update(state, {
				status: {$set: 'FAILURE'},
				streamList: {$set: []}
			});

		default:
			return state;
	}
	return state;
}