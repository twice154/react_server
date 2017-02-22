import React from 'react';

class Player extends React.Component{

	componentDidMount(){
		WowzaPlayer.create('playerElement',
			    {
			    	"license":"PLAY1-kyQRC-jd67Z-Ww4bP-bHbdt-C3pF6",
				    "title":"",
				    "description":"",
				    "sourceURL":"http%3A%2F%2F172.30.1.32%3A1935%2Flive%2F" + this.props.streamname + "%2Fplaylist.m3u8",
				    "autoPlay":false,
				    "volume":"75",
				    "mute":false,
				    "loop":false,
				    "audioOnly":false,
				    "uiShowQuickRewind":true,
				    "uiQuickRewindSeconds":"30"
			    }
			)
	}

	componentWillUnmount(){
		document.getElementById('playerElement').innerHTML = "";
	}

	render(){
		return(
			<div>
			<h1>{this.props.streamname}</h1>
			</div>
		);
	}
}

export default Player;