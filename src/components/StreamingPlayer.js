import React from 'react';

class StreamingPlayer extends React.Component{

	constructor(props){
		super(props);
		this.create = this.create.bind(this);
		this.destroy = this.destroy.bind(this);
		this.state = {status: "remove player", onClickMethod: this.destroy}
	}

	componentDidMount(){
		this.props.createPlayer();
	}

	create(){
		this.props.createPlayer();
		this.setState({status: 'remove player',
					   onClickMethod: this.destroy			
						})
	}

	destroy(){
		this.props.removePlayer();
		this.setState({ status: 'view player', 
						onClickMethod: this.create})
		
	}

	render(){
		return(
			<div>
				<h1>{this.props.streamName}</h1>
				<input type='BUTTON' id='butt' value={this.state.status} 
					onClick={this.state.onClickMethod}/>
			</div>
		);
	}
}

export default StreamingPlayer;