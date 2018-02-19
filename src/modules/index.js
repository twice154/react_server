import { combineReducers } from 'redux';

import authentication from './authentication';
import moonlight from './moonlight';
import speedTest from './speedTest';
import stream from './stream';

export default combineReducers({
    authentication,
    moonlight,
    speedTest,
    stream
});