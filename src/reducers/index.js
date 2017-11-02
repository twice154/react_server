import authentication from './authentication';
import Stream from './Stream';
import moonlight from './moonlight';
import speedTest from './speedTest';
import {combineReducers} from 'redux';

export default combineReducers({
	authentication, Stream, moonlight, speedTest
});