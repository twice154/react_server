import * as types from 'actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
	list : {
		status: 'INIT',
		data: [],
		isLast: false
	}
}

export default function Stream(state, action){
	if(typeof state == "undefined"){
		state = initialState;
	}

	switch(action.type){

		case types.GET_STREAMS:
			console.log(action.data);
			return update(state, {
				list: {
					status: {$set: 'WAITING'}
				}
			});

		case types.GET_STREAMS_SUCCESS:
			console.log("Success");
			return update(state, {
				list: {
					status:{$set: 'SUCCESS'},
					data: {$set: action.data},
				}
			});

		case types.GET_STREAMS_FAILURE:
			console.log("Failure");
			return update(state, {
				list: {
					status: {$set: 'FAILURE'},
					data: {$set: []}
				}
			});

		default:
			return state;
	}
	return state;
}