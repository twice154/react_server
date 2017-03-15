import React from 'react';
import {connect} from 'react-redux';
import {HostList} from 'components';
import {getHostsRequest, getAddRequest, getAppsRequest, startGameRequest, addHostRequest} from 'actions/moonlight';

class Moonlight extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			status:"offline",
			hostsList: [],
			appList: [],
			mode : true,  //true: hostView, false: apps(games)View
			selectedHost: "", //id of selected host
			newhostIp: ""
		}
		this.showApps = this.showApps.bind(this);
		this.startGame = this.startGame.bind(this);
		this.addHost = this.addHost.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount(){
		this.props.getHostsRequest().then(
			()=>{
				if(this.props.hostsList.status == "GET_SUCCESS"){
					this.setState({
						hostsList: this.props.hostsList.data,
						status: "online"
					});
				}
				else{
					console.log("Fail to get hosts");
					this.setState({
						status: "offline"
					})
				}
			}
		)
	}

	showApps(hostId){
		console.log("Selected host changed");
		this.props.getAppsRequest(hostId).then(
			()=>{
				if(this.props.appList.status == "SUCCESS"){
					this.setState({
						mode: false,
						selectedHost: hostId,
						appList: this.props.appList.data
					});
					Materialize.toast('Added new host successfully!', 2000);
				}
				else{
					Materialize.toast('Failed to add new host', 2000);
				}
			}
		)
	}

	startGame(e){
		this.props.startGameRequest(this.state.selectedHost, e.target.id).then(
			()=>{
				if(this.props.startGame.status == "SUCCESS"){
					let $toastContent = $('<span style="color: $FFB4BA">Game will be started soon</span>');
					Materialize.toast($toastContent, 2000);
				}
				else{
					Materialize.toast('Failed to start the game', 2000);
				}
			}
		) 
	}

	addHost(e){
		if(e.charCode==13){
			this.setState({
				newhostIp: ""
			});
			this.props.addHostRequest(e.target.value).then(
				()=>{
					if(this.props.hostsList.status === "ADD_SUCCESS"){
						console.log("ADDED SUCCESSFULLY!");
					}
					else{
						console.log("Failed to Add");
					}
				}
			)
		}
	}

	handleChange(e){
		this.setState({
			newhostIp:e.target.value 
		});
	}

	render(){


		return (
			<div>
				<div>{this.state.status}</div>
				{this.state.mode?
					<div>
						<HostList hostsList={this.state.hostsList} onClick={this.showApps}/>
						<input
	                   	 	name="newhostIp"
	                    	type="text"
	                    	className="validate"
	                    	onChange={this.handleChange}
	                    	value={this.state.newhostIp}
	                    	onKeyPress={this.addHost}/>
					</div>
					:
						this.state.appList.map((apps, i)=>{
							return <div key={i}>
								<li>
									<a onClick={this.startGame} id={apps.id} name={apps.title}>{apps.title}</a>
								</li>
							</div>
						})
				}
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		hostsList: state.moonlight.hostsList,
		appList: state.moonlight.appList,
		startGame: state.moonlight.startGame
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getHostsRequest: ()=>{
			return dispatch(getHostsRequest());
		},
		addHostsRequest: (newhost)=>{
			return dispatch(addHostsRequest(newhost));
		},
		getAppsRequest: (hostId)=>{
			return dispatch(getAppsRequest(hostId));
		},
		startGameRequest: (hostId, appId)=>{
			return dispatch(startGameRequest(hostId, appId));
		},
		addHostRequest: (hostIp)=>{
			return dispatch(addHostRequest(hostIp));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Moonlight);