/**
 * red5pro로 업데이트 예정
 * @author G1
 * @logs // 18.2.25
 */

import React from 'react';
import {Link} from 'react-router-dom';

function onGetStreams(props){
    return props.getStreams()
        .catch(err=>{
            console.log(err);
        })
}

const StreamingList = props => {
    return (
        <div>
            <div>
                <h1>Streaming List</h1>
                {props.status}
                <form>
                    <input type='BUTTON' defaultValue='renew'
                        onClick={function(){onGetStreams(props)}}/>
                </form>
            </div>
            <div id="streams">
            {props.streamingList?
            props.streamingList.toJS().map((stream, i)=>
                (<div key={i}>
                    <li><Link to={props.getStreamLink(stream.name)}>
                    <h3>{stream.name}</h3>
                    <img
                        style={{width: 160, height: 90}}
                        src={stream.thumbnail}
                        alt={"thumnail"}
                    />
                    </Link>
                    </li>
                </div>)
            ): undefined}
            </div>
        </div>
    );
};

export default StreamingList;