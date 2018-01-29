import React from 'react';
import StreamingPlayer from 'components/StreamingPlayer';

class StreamingPlayerContainer extends React.Component{
    constructor(props){
        super(props);
        this.createPlayer = this.createPlayer.bind(this);
        this.removePlayer = this.removePlayer.bind(this);
        this.state = {wp: {}};
    }

    createPlayer(option){
    
        let wp = $wp.create('playerElement', 
                {
                    "license": "PLAY1-kyQRC-jd67Z-Ww4bP-bHbdt-C3pF6",
                    "title": option? option.title : "",
                    "description": option? option.description :"",
                    "sourceURL": "http%3A%2F%2F172.30.1.32%3A1935%2Flive%2F" + this.props.streamname + "%2Fplaylist.m3u8",
                    "autoPlay": option? option.autoPlay: false,
                    "volume": option? option.volume : "75",
                    "mute": option? option.mute: false,
                    "loop": option? option.loop:  false,
                    "audioOnly": option? option.audioOnly: false,
                    "uiShowQuickRewind": option? option.uiShowQuickRewind: true,
                    "uiQuickRewindSeconds": option? option.uiQuickRewindSeconds: "30"
                }
    
        )
        this.setState({wp});
        console.log(wp);
    }

    removePlayer(){
        this.state.wp.destroy();
    }

    render(){
        return(
            <div>
                <StreamingPlayer createPlayer={this.createPlayer}
                                 removePlayer={this.removePlayer}
                                streamName={this.props.streamName}/>
            </div>
        )
    }
}

export default StreamingPlayerContainer;