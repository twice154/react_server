/**
 * 플레이어 컴포넌트. janus player
 * @author G1
 * @logs // 18.5.5
 */
import {initailize} from './janus'
import React from 'react';

class StreamingPlayer extends React.Component{

	constructor(props){
		super(props);
		this.state = {}
	}
	//todo: initailize 고치기
	componentDidMount(){
		initailize(2951133320520011,1234)
	}
	render(){
		return(
			<div className='col' style={{border:'black solid 2px'}}>
			<video class="rounded centered" id="viewer" width="800px" autoplay />
				<h1>{this.props.streamName}</h1>

			</div>
		);
	}
}

export default StreamingPlayer;