/**
 * 플레이어 컨테이너. red5pro로 업데이트 예정.
 * @author G1
 * @logs // 18.2.26
 */

import React from 'react';
import StreamingPlayer from '../../components/StreamingPlayer';

class StreamingPlayerContainer extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    


    render(){
        return(
                <StreamingPlayer 
                                streamName={this.props.streamName}/>
          
        )
    }
}

export default StreamingPlayerContainer;