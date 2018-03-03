/**
 * 플레이어 컨테이너. red5pro로 업데이트 예정.
 * @author G1
 * @logs // 18.2.26
 */

import React from 'react';
import StreamingPlayer from '../components/StreamingPlayer';

class StreamingPlayerContainer extends React.Component{
    constructor(props){
        super(props);
        this.createPlayer = this.createPlayer.bind(this);
        this.removePlayer = this.removePlayer.bind(this);
        this.state = {wp: {}};
    }

    createPlayer(option){
    
        let wp = window.$wp.create('playerElement',
            {
                "license": "PLAY1-kyQRC-jd67Z-Ww4bP-bHbdt-C3pF6",
                "title": "",
                "description": "",
                "sourceURL": "http%3A%2F%2F172.20.10.10%3A1935%2Flive%2FmyStream%2Fplaylist.m3u8?DVR",
                "autoPlay": false,
                "volume": "75",
                "mute": false,
                "loop": false,
                "audioOnly": false,
                "uiShowQuickRewind": true,
                "uiQuickRewindSeconds": "30"
            });
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