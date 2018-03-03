/**
 * 사용자의 스피드를 측정한다.
 * @author G1
 * @logs // 18.2.25
 */


import React, { Component } from 'react';
import {connect} from 'react-redux';
import {SpeedTest} from  '../components';
import { getSpeedRequest } from '../modules/speedTest';


class speedTestContainer extends Component {
    constructor(props) {
        super(props);
        this.state={data:{}};
        this.getSpeed = this.getSpeed.bind(this);
    }
/**   
 * 사용자의 아이피, 업속도 다운로드 속도를 받아온다.
 */
    getSpeed(){
        return this.props.getSpeedRequest()
            .then(()=>{
                if(this.props.status === "SUCCESS"){
                    this.setState({data:this.props.data.toJS()})
                    return true;
                }
                return Promise.reject(false);
            })
    }

    render() {
        return (
            <div>
                <SpeedTest getSpeed={this.getSpeed}
                           data={this.state.data}
                           status={this.props.status}/>
            </div>
        );
    }
}

speedTestContainer.propTypes = {

};

const mapStateToProps = (state)=>{
    return ({
             status: state.speedTest.get('status'),
             data: state.speedTest.get('data')
            });
}

const mapDispatchToProps = (dispatch)=>{
    return {
        getSpeedRequest: ()=>{
            return dispatch(getSpeedRequest())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(speedTestContainer);