/**
 * 플레이어 별 스트리밍 페이지. 채팅과 플레이어가 존재.
 * @author G1
 * @logs // 18.2.26
 */

import React, { Component } from 'react';
import StreamingPlayerContainer from './StreamingPlayerContainer'
import ChattingContainer from './ChattingContainer';
import { height } from 'window-size';
import Donation from './Donation';


class StreamingView extends Component {
	constructor(props) {
		super(props);
		this.state = { donationModal:false }
		this.donationToggle= this.donationToggle.bind(this)
	}
	/**
	 * 도네이션을 토글하는 함수.
	 */
	donationToggle(){
		console.log('toggle')
		this.setState({
			donationModal: !this.state.donationModal
		  });
	}
	
	render() { 
		return( 
		<div className='row' style={{height:'100%'}}>
			<StreamingPlayerContainer streamName={this.props.match.params.streamname}/>
			<ChattingContainer room={this.props.match.params.streamname} donationToggle={this.donationToggle}/>
			{/* TODO:도네이션 처리를 위한 함수, 리덕스 생성. */}
			<Donation modal={this.state.donationModal} toggle={this.donationToggle} streamName={this.props.match.params.streamname}/>
		</div> )
	}
}
export default StreamingView
