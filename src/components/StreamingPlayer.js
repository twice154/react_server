/**
 * 플레이어 컴포넌트. red5pro로 업뎃
 * @author G1
 * @logs // 18.2.26
 */

import React from 'react';

class StreamingPlayer extends React.Component{

	constructor(props){
		super(props);
		this.state = {}
	}

	render(){
		return(
			<div className='col' style={{border:'black solid 2px'}}>
				<h1>{this.props.streamName}</h1>

			</div>
		);
	}
}

export default StreamingPlayer;