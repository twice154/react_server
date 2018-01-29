import React from 'react';
import {Chatting} from 'components';
import {StreamingPlayerContainer} from 'containers';

const StreamingView = ({match})=>{ 
	return (
	<div>
		<StreamingPlayerContainer streamName={match.params.streamname}/>
		<Chatting room={match.params.streamname}/>
	</div>
)}

export default StreamingView;