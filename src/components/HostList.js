import React from 'react';

class HostList extends React.Component{

	constructor(props){
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e){
		this.props.onClick(e.target.id);
	}

	render(){
		let hostview = "";
		return(
			<div>
			{	
				this.props.hostsList.map((host, i)=>{
					return <div key={i}>
						<ul>
							{this.props.hostsList[i].online?
								<a onClick = {this.handleClick} id={this.props.hostsList[i].hostId}>{this.props.hostsList[i].hostname}</a>
								:
								<span>{this.props.hostsList[i].hostname} :offline</span>
							}
						</ul>
					</div>	
				})
			}
			</div>
		)
	}
}

export default HostList;