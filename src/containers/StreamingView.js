import React from 'react';
import {Player, Chatting} from 'components';

class StreamingView extends React.Component{

	render(){
		return(
			<div>
			<Player streamname={this.props.params.streamname}/>
			<Chatting />
			</div>
		);
	}
}

export default StreamingView;