import React from 'react';
import {connect} from 'react-redux';
import {getSpeedRequest} from 'actions/speedTest';

class SpeedTest extends React.Component{
	constructor(props){
		super(props);
		//this.setState({});
		this.componentDidMount = this.componentDidMount.bind(this);
	}

	componentDidMount(){
		this.props.getSpeedRequest().then(
			() => {
				if(this.props.status == 'SUCCESS'){
					Materialize.toast('SUCCESS');
					this.setState(this.props.data);
				}
				else{
					Materialize.toast('Failure');

				}
			}
		)
	}

	render(){
		return(
			<div>
				{this.props.status}
				<form>
            		<input type='BUTTON' defaultValue="networkTest" onClick={this.componentDidMount}/>
            	</form>
            	{this.props.data? this.props.data.client.ip : undefined}
            </div>
		)
	}
}

const mapStateToProps = (state) =>{
    return{
        status: state.speedTest.status,
        data: state.speedTest.data
    };
};

const mapDispatchtoProps = (dispatch) => {
    return {
        getSpeedRequest: ()=>{
            return dispatch(getSpeedRequest());
        }
    };
}

export default connect(mapStateToProps, mapDispatchtoProps)(SpeedTest);