import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router'; 
import {getStreamsRequest} from 'actions/Stream';

class NewStreamList extends React.Component {
	
    constructor(props){
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

	componentDidMount(){
		this.props.getStreamsRequest();
	}

	render(){
		return(
            <div>
                <div>
                    <h1>Streaming List</h1>
                    {this.props.status}
                    <form>
                        <input type='BUTTON' defaultValue="renew" onClick={this.componentDidMount}/>
                    </form>
                </div>
    			<div id="streams">{
    				this.props.streamList.map((streamname, i)=>{
    					let link = '/player/' + encodeURIComponent(streamname);
                   		let thumbnail_link = "http://localhost:8086/thumbnail?application=live&streamname=" + streamname + "&size=640x360&fitmode=letterbox";
                    	return <div key={i}>
                    		      <li>
                    				<Link to={link}>
                                        <h3>
                                            {streamname}
                                        </h3>
                                            <img
                                                style={{width: 160, height: 90}}
                                                src={thumbnail_link} 
                                            />
                                    </Link>
                    			  </li>
                    		  </div>
                    })}
                </div>
            </div>
		)
	}
}

const mapStateToProps = (state) =>{
    return{
        status: state.Stream.status,
        streamList: state.Stream.streamList
    };
};

const mapDispatchtoProps = (dispatch) => {
    return {
        getStreamsRequest: ()=>{
            return dispatch(getStreamsRequest());
        }
    };
}

export default connect(mapStateToProps, mapDispatchtoProps)(NewStreamList);