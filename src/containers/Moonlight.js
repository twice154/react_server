import React from 'react';
import {connect} from 'react-redux';
import {HostList} from 'components';
import {getHostsRequest, getAddRequest, getAppsRequest, startGameRequest, addHostRequest} from 'actions/moonlight';

class Moonlight extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			online:false,
			hostsList: [],
			appList: [],
			mode : true,  //true: hostView, false: apps(games)View
			selectedHost: "", //id of selected host
			newhostIp: "",
			addingHost: false,
			resolution: "1280:720",
			fps:"60",
			bitrate:"10",
			remote_audio_enabled: true
		}
		this.showApps = this.showApps.bind(this);
		this.startGame = this.startGame.bind(this);
		this.addHost = this.addHost.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleCheck = this.handleCheck.bind(this);
	}

	componentDidMount(){

		$("#res").on('change', this.handleChange);
		$("#fps").on('change', this.handleChange);
		this.props.getHostsRequest().then(
			()=>{
				if(this.props.hostsList.status == "GET_SUCCESS"){
					this.setState({
						hostsList: this.props.hostsList.data,
						status: true
					});
				}
				else{
					console.log("Fail to get hosts");
					this.setState({
						status: false
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
				}
				else{
					Materialize.toast('Failed to get the host', 2000);
				}
			}
		)
	}

	startGame(e){
		let option = {
			"frameRate" : this.state.fps,
			"streamWidth": this.state.resolution.split(':')[0],
			"streamHeight": this.state.resolution.split(':')[1],
			"remote_audio_enabled": this.state.remote_audio_enabled? 1 : 0,
			"bitrate": this.state.bitrate
		}
		this.props.startGameRequest(this.state.selectedHost, e.target.id, option).then(
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
				newhostIp: "",
				addingHost: true
			});
			let randomNumber = String("0000" + (Math.random()*10000|0)).slice(-4);
			this.props.addHostRequest(e.target.value, randomNumber).then(
				()=>{
					if(this.props.hostsList.status === "ADD_SUCCESS"){
						console.log("ADDED SUCCESSFULLY!");
						Materialize.toast("Added Successfullly", 2000);
						this.setState({hostsList: this.props.hostsList.data});
					}
					else{
						console.log('Failed to add new host');
						Materialize.toast('Failed to add new host', 2000);
					}
					this.setState({addingHost: false});
				}
			)
		}
	}

	handleChange(e){
		let nextState = {};
		nextState[e.target.name] = e.target.value;
		this.setState(nextState);
		console.log(e.target.name + " : " + e.target.value);
	}

	handleCheck(e){
		let nextState = {};
		nextState[e.target.name] = e.target.checked;
		console.log(e.target.checked);
		this.setState(nextState);
	}

	render(){
		let canAddnewHost = this.state.status && !this.state.addingHost;
		$(document).ready(function() {
 			$('select').material_select();
		});


		return (
			<div>
				{this.state.status? <div className="col s12">Moonlight-chrome is online</div>: <div>Moonlight-chrome is offline</div>}
				<div className="switch">
					<p>
    				<label>
      					<input type="checkbox" name="remote_audio_enabled" onChange={this.handleCheck} checked={this.state.remote_audio_enabled}/>
      					<span className="lever"></span>
      						Remote audio off/on
   					</label>
   					</p>
  				</div>
				<div className="row">
					<div className="input-field col s6">
						<select id="res" name="resolution">
							<option value="" disabled>Choose your resolution</option>
							<option value="1280:720">720p</option>
							<option value="1920:1080">1080p</option>
							<option value="3840:2160">4k</option>
						</select>
						<label>resolution</label>
					</div>
					<div className="input-field col s6">
						<select id="fps" name="fps">
							<option value="" disabled>Choose your fps</option>
							<option value="30">30</option>
							<option value="60">60</option>
						</select>
						<label>fps</label>
					</div>
				</div>
				<div className="row">
					<div className="col s12">
						<form action="#">
							<label>{"bitrate: " + this.state.bitrate}</label>
    						<p className="range-field">
      							<input type="range" name="bitrate" min="0" max="100" onChange={this.handleChange} value={this.state.bitrate}/>
    						</p>
  						</form>
  					</div>
  				</div>
				{this.state.mode?
					<div className="row">
						<HostList hostsList={this.state.hostsList} onClick={this.showApps}/>
						{canAddnewHost?
							<div className="input-field col s12">
							<input
								id="hostip"
	                   	 		name="newhostIp"
		                    	type="text"
		                    	className="validate"
		                    	onChange={this.handleChange}
		                    	value={this.state.newhostIp}
		                    	onKeyPress={this.addHost}/>
		                    <label>add new host</label>
		                    </div>
							: undefined
		               	}
		               	{this.state.addingHost?
		               		<span>{"Please enter the number " + this.props.newHost.pairingNum + " on the GFE dialog on the computer."}</span>
							: undefined
						}

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
		startGame: state.moonlight.startGame,
		newHost: state.moonlight.newHost
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getHostsRequest: ()=>{
			return dispatch(getHostsRequest());
		},
		getAppsRequest: (hostId)=>{
			return dispatch(getAppsRequest(hostId));
		},
		startGameRequest: (hostId, appId, option)=>{
			return dispatch(startGameRequest(hostId, appId, option));
		},
		addHostRequest: (hostIp, randomNumber)=>{
			return dispatch(addHostRequest(hostIp, randomNumber));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Moonlight);