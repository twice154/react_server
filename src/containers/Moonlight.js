import React from 'react';
import {connect} from 'react-redux';
import {HostList} from 'components';
import {getHostsRequest, getAddRequest, getAppsRequest, startGameRequest, addHostRequest} from 'actions/moonlight';
import update from 'react-addons-update';

class AppView extends React.Component {
	 render(){

	 }
}

class Moonlight extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			isMoonlightOnline:false,
			hostList: [],
			appList: [],
			mode : true,  //true: hostsView, false: apps(games)View
			selectedHost: "", //id of selected host
			newHost:{
				ip:"",
				inProgress:false
			},
			streamSettings:{
				resolution: "1280:720",
				fps:"60",
				bitrate:"10",
				remote_audio_enabled: true		
			} 
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
				if(this.props.hostList.status == "GET_SUCCESS"){
					this.setState(update(this.state, {
						hostList: {$set: this.props.hostList.data},
						isMoonlightOnline: {$set: true}
						})
					);
					console.log("Successfullly got hosts");
				}
				else{
					console.log("Fail to get hosts");
					this.setState(update(this.state, {
						isMoonlightOnline: {$set: false}
						})
					)
				}
			}
		)
	}

	showApps(hostId){
		this.props.getAppsRequest(hostId).then(
			()=>{
				if(this.props.appList.status == "SUCCESS"){
					this.setState(update(this.state, {
						mode: {$set: false},
						selectedHost: {$set: hostId},
						appList: {$set: this.props.appList.data}
						})
					);
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
			this.setState(update(this.state, {
				newHost:{
					ip: {$set:""},
					inProgress: {$set: true}
				}
			}));
			let randomNumber = String("0000" + (Math.random()*10000|0)).slice(-4);
			this.props.addHostRequest(e.target.value, randomNumber).then(
				()=>{
					if(this.props.hostList.status === "ADD_SUCCESS"){
						console.log("ADDED SUCCESSFULLY!");
						Materialize.toast("Added Successfullly", 2000);
						this.setState(update(this.state, {
							hostList: {$set: this.props.hostList.data}}));
					}
					else{
						console.log('Failed to add new host');
						Materialize.toast('Failed to add new host', 2000);
					}
					this.setState(update(this.state, 
						{newHost:{
							inProgress: {$set: false}}}));
				}
			)
		}
	}

	handleChange(e){
		let nextState = {};
		nextState[e.target.id] = this.state[e.target.id];
		nextState[e.target.id][e.target.name] = e.target.value;
		this.setState(nextState);
	}

	handleCheck(e){
		let nextState = {};
		nextState[e.target.id] = this.state[e.target.id]
		nextState[e.target.id][e.target.name] = e.target.checked;
		this.setState(nextState);
	}

	render(){
		let canAddnewHost = this.state.isMoonlightOnline && !this.state.newHost.inProgress;
		$(document).ready(function() {
 			$('select').material_select();
		});

		const settingView = (
			<div>
				<div className="switch">
					<p>
    				<label>
      					<input type="checkbox" id="streamSettings" name="remote_audio_enabled" onChange={this.handleCheck} checked={this.state.streamSettings.remote_audio_enabled}/>
      					<span className="lever"></span>
      						Remote audio off/on
   					</label>
   					</p>
  				</div>
				<div className="row">
					<div className="input-field col s6">
						<select id="res" id="streamSettings" name="resolution">
							<option value="" disabled>Choose your resolution</option>
							<option value="1280:720">720p</option>
							<option value="1920:1080">1080p</option>
							<option value="3840:2160">4k</option>
						</select>
						<label>resolution</label>
					</div>
					<div className="input-field col s6">
						<select id="fps" id="streamSettings" name="fps">
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
							<label>{"bitrate: " + this.state.streamSettings.bitrate}</label>
    						<p className="range-field">
      							<input type="range" id="streamSettings" name="bitrate" min="0" max="100" onChange={this.handleChange} value={this.state.bitrate}/>
    						</p>
  						</form>
  					</div>
  				</div>
  			</div>	
		)

		const appListView = (
			this.state.appList.map((apps, i)=>{
				return <div key={i}>
					<li>
						<a onClick={this.startGame} id={apps.id} name={apps.title}>{apps.title}</a>
					</li>
				</div>
			})
		);


		return (
			<div>
				{this.state.isMoonlightOnline? <div className="col s12">Moonlight-chrome is online</div>: <div>Moonlight-chrome is offline</div>}
				{settingView}

				{this.state.mode?
					<div className="row">
						<HostList hostList={this.state.hostList} onClick={this.showApps}/>
						{canAddnewHost?
							<div className="input-field col s12">
							<input
								id="newHost"
	                   	 		name="ip"
		                    	type="text"
		                    	className="validate"
		                    	onChange={this.handleChange}
		                    	value={this.state.newHost.ip}
		                    	onKeyPress={this.addHost}/>
		                    <label>add new host</label>
		                    </div>
							: undefined
		               	}
		               	{this.state.newHost.inProgress?
		               		<span>{"Please enter the number " + this.props.newHost.pairingNum + " on the GFE dialog on the computer."}</span>
							: undefined
						}

					</div>
					: {appListView}
				}
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		hostList: state.moonlight.hostList,
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