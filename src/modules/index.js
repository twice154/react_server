import { combineReducers } from 'redux';

import authentication from './authentication';
import moonlight from './moonlight';
import speedTest from './speedTest';
import stream from './stream';
import register from './register'

export default combineReducers({
    authentication,
    moonlight,
    speedTest,
    stream,
    register
});