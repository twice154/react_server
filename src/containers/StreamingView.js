import React from 'react';
import {Player, Chatting} from 'components';

class StreamingView extends React.Component{

	render(){
		return(
			<div>
			<Player streamname={this.props.params.streamname}/>
			<Chatting room={this.props.params.streamname}/>
			</div>
		);
	}
}

export default StreamingView;