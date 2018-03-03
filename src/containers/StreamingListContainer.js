/**
 * redPro5로 업데이트 예정.
 * @author G1
 * @logs // 18.2.25
 */

import React, { Component } from 'react';
import StreamingList from '../components/StreamingList';
import { connect } from 'react-redux';
import {getStreamsRequest} from '../modules/stream';
import {List} from 'immutable'


class StreamingListContainer extends Component {
    constructor(props){
        super(props);
        this.state = {streamingStatus: false, streamingList:List([])}
        this.getStreams = this.getStreams.bind(this)

    }

    getStreams(){
        return this.props.getStreamsRequest()
                .then(()=>{
                    if(this.props.status === "SUCCESS"){
                        this.setState({
                            streamingStatus: true, streamingList: this.props.streamList.toJS()
                        })
                        return true;
                    }
                    else{
                        return Promise.reject();
                    }
                })
    }
    
    render() {
        return (
            <div>
                <StreamingList getStreams={this.getStreams}
                               status={this.props.status}
                               streamingList={this.state.streamingList}
                               getStreamLink={this.getStreamLink}/>
            </div>
        );
    }

    getStreamLink(streamName){
        return '/player/' + streamName;
    }
}

const mapStateToProps=(state)=>{
    return {
        status: state.stream.get('status'),
        streamList: state.stream.get('streamList')
    }
}

const mapDispatchToProps = (dispatch)=>{
    return {
        getStreamsRequest: () =>{
            return dispatch(getStreamsRequest());
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(StreamingListContainer);