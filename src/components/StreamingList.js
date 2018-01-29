import React from 'react';
import PropTypes from 'prop-types';

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
            props.streamingList.map((stream, i)=>{
                return 
                (<div key={i}>
                    <li><Link to={props.getStreamLink(stream.name)}>
                    <h3>{stream.name}</h3>
                    <img
                        style={{width: 160, height: 90}}
                        src={stream.thumbnail}
                    />
                    </Link>
                    </li>
                </div>)
            }): undefined}
            </div>
        </div>
    );
};

StreamingList.propTypes = {
    
};

export default StreamingList;