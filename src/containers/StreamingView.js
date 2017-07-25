import React from 'react';
import {StreamingPlayer, Chatting} from 'components';

class StreamingView extends React.Component{

	render(){
		return(
			<div>
			<StreamingPlayer streamname={this.props.params.streamname}/>
			<Chatting room={this.props.params.streamname}/>
			</div>
		);
	}
}

export default StreamingView;