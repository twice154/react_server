import React from 'react';

class HostList extends React.Component{

	constructor(props){
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e){
		this.props.onClick(e.target.id);
	}

	componentDidMount(){
		console.log("host list has been updated");
		console.log(this.props.hostList);
	}

	render(){
			console.log(this.props.hostList);
			let hostempty = (this.props.hostList === null);
		return(

			<div>
			{	
				(!hostempty)?
				this.props.hostList.map((host, i)=>{
					return <div key={i}>
						<ul>
							{this.props.hostList[i].online?
								<a onClick = {this.handleClick} id={host.hostId}>{host.hostname}</a>
								:
								<span>{host.hostname} :offline</span>
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