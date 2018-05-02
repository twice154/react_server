import { combineReducers } from 'redux';

import authentication from './authentication';
import moonlight from './moonlight';
import speedTest from './speedTest';
import stream from './stream';
import register from './register'
import donation from './donation'
import reacto from './reacto'

export default combineReducers({
    authentication,
    moonlight,
    speedTest,
    stream,
    register,
    donation,
    reacto
});