/**
 * redPro5로 업데이트 예정.
 * @author G1
 * @logs // 18.2.25
 */

import React, { Component } from 'react';
import {StreamingLists} from '../../components/streamingList';
import { connect } from 'react-redux';
import {getStreamLists} from '../../modules/stream';
import {List} from 'immutable'


class StreamingListContainer extends Component {
    constructor(props){
        super(props);
        this.state = {streamingStatus: false, streamingList:''}
        this.getStreams = this.getStreams.bind(this)

    }

    getStreams(){
        return this.props.getStreamsRequest()
                .then(()=>{
                    if(this.props.status === "SUCCESS"){
                        this.setState({
                            streamingStatus: true, streamingList: ''
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
                <StreamingLists getStreams={this.getStreams}
                               status={this.props.status}
                               streamingList={this.state.streamingList}
                               getStreamLink={this.getStreamLink}
                               push={()=>this.props.history.push('/player/g1')}/>
            </div>
        );
    }

    getStreamLink(streamName){
        return '/player/' + streamName;
    }
}
// todo 전반적으로 전체 다 고치기
const mapStateToProps=(state)=>{
    return {
        status: '123',
        streamList: '123'
    }
}

const mapDispatchToProps = (dispatch)=>{
    return {
        getStreamsRequest: () =>{
            return dispatch(getStreamLists());
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(StreamingListContainer);