import * as types from 'actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
	status: 'INIT',
};

export default function speedTest(state, action){
	if(typeof state === 'undefined'){
		state = initialState;
	}

	switch(action.type){

		case types.NETWORKTEST_GET_SPEED:
			return update(state, {
				status: {$set: 'WAITING'}
			});

		case types.NETWORKTEST_GET_SPEED_SUCCESS:
			return update(state, {
				status: {$set: 'SUCCESS'},
				data: {$set: action.data}
			});

		case types.NETWORKTEST_GET_SPEED_FAILURE:
			return update(state, {
				status: {$set: 'FAILURE'}
			});

		default:
			return state;	

	}
}