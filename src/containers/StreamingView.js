/**
 * 플레이어 별 스트리밍 페이지. 채팅과 플레이어가 존재.
 * @author G1
 * @logs // 18.2.26
 */

import React from 'react';
import StreamingPlayerContainer from './StreamingPlayerContainer'
import ChattingContainer from './ChattingContainer';

const StreamingView = ({match})=>{ 
	return (
	<div>
		<StreamingPlayerContainer streamName={match.params.streamname}/>
		<ChattingContainer room={match.params.streamname}/>
	</div>
)}

export default StreamingView;