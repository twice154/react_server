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
			let hostempty = (this.props.hostList === null);
		return(

			<div>
			{	
				hostempty?
				this.props.hostList.map((host, i)=>{
					return <div key={i}>
						<ul>
							{this.props.hostList[i].online?
								<a onClick = {this.handleClick} id={this.props.hostsList[i].hostId}>{this.props.hostsList[i].hostname}</a>
								:
								<span>{this.props.hostsList[i].hostname} :offline</span>
							}
						</ul>
					</div>	
				})
				: undefined
			}
			</div>
		)
	}
}

export default HostList;