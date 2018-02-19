import React from 'react';
import {StreamingPlayerContainer, ChattingContainer} from 'containers';

const StreamingView = ({match})=>{ 
	return (
	<div>
		<StreamingPlayerContainer streamName={match.params.streamname}/>
		<ChattingContainer room={match.params.streamname}/>
	</div>
)}

export default StreamingView;