/**
 * connecto 컴포넌트
 * @author G1
 * @logs // 18.2.25
 * 
 * 
 * broadcast에 편입 예정
 */

import React from 'react';
import HostList from './HostList';
import update from 'immutability-helper';

class Moonlight extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			appList: [],
			mode : true,  //true: hostsView, false: apps(games)View
			selectedHost: "", //id of selected host
			newHost:{
				ip:"",
				inProgress:false
			},
			streamSettings:{
				frameRate:"60",
				resolution:"1280:720",
				bitrate:"10",
				remote_audio_enabled: true
			}
		};
		this.showApps = this.showApps.bind(this);
		this.startGame = this.startGame.bind(this);
		this.addHost = this.addHost.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleCheck = this.handleCheck.bind(this);
	}

	componentDidMount(){

		window.$("#res").on('change', this.handleChange);
		window.$("#fps").on('change', this.handleChange);
		this.props.getAuthStatus().then(()=>{
			return this.props.getMoonlightStatus(this.props.currentUser)
		})
		.catch((err)=>{
			console.log(err);
		})
	}
/**
 * 할 수 있는 게임을 보여준다.(호스트에 있는 게임목록)
 * @param {s} hostId - bj아이디 
 * 모드,호스트,게임이름을 갱신한다.
 */
	showApps(hostId){
		this.props.getApps(hostId, this.props.currentUser).then(
			(appList)=>{
				return this.setState(update(this.state, {
					mode: {$set: false},
					selectedHost: {$set: hostId},
					appList: {$set: appList.toJS()}
				})
			)}
		).catch(()=>{
			return window.Materialize.toast('Failed to get apps', 2000);
		})
	}
/**
 * 게임을 실행한다.(게임 옵션을 추가한다.)
 * @param {*} e 
 */
	startGame(e){
		let option = {
			"frameRate": this.state.streamSettings.fps,
			"streamWidth": this.state.streamSettings.resolution.split(':')[0],
			"streamHeight": this.state.streamSettings.resolution.split(':')[1],
			"remote_audio_enabled": this.state.streamSettings.remote_audio_enabled ? 1 : 0,
			'bitrate': this.state.streamSettings.bitrate
		}
		this.props.startGame(this.state.selectedHost, this.props.currentUser, e.target.id, option)
			.then((result)=>{
				// let $toastContent = window.$('<span style="color: $FFB4BA">Game will be started soon</span>');
				// return window.Materialize.toast($toastContent, 2000);				
			})
			.catch(()=>{
				// return window.Materialize.toast('Failed to start the game', 2000);				
			}) 
	}
/**
 * 호스트를 추가한다.(비제이 컴퓨터랑 연결하는 작업)
 * @param {*} e 
 */
	addHost(e){
		if(e.charCode===13){
			this.setState(update(this.state, {
				newHost: {$set: {ip:"", inProgress:true}}
			}))

			let randomNumber = String("0000" + (Math.random()*10000|0)).slice(-4);
			this.props.addHost(e.target.value, this.props.currentUser, randomNumber).then(
				()=>{
					this.setState(update(this.state, {
						newHost: {inProgress: {$set: false}}
					}))
					console.log("ADDED SUCCESSFULLY!");
					// window.Materialize.toast("Added Successfullly", 2000);
				}
			).catch(()=>{
				console.log('Failed to add new host');
				// window.Materialize.toast('Failed to add new host', 2000);
			})
		}
	}

	handleChange(e){
		this.setState(update(this.state, {
			[e.target.id]: {[e.target.name]: {$set: e.target.value}}
		}))
	}

	handleCheck(e){
		this.setState(update(this.state, {
			[e.target.id]: {[e.target.name]: {$set: e.target.checked}}
		}))
	}

	render(){
		let canAddnewHost = this.state.isMoonlightOnline && !this.state.newHost.inProgress;
		window.$(document).ready(function() {
 			// window.$('select').material_select();
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
						<select id="streamSettings" name="resolution">
							<option value="" disabled>Choose your resolution</option>
							<option value="1280:720">720p</option>
							<option value="1920:1080">1080p</option>
							<option value="3840:2160">4k</option>
						</select>
						<label>resolution</label>
					</div>
					<div className="input-field col s6">
						<select id="streamSettings" name="frameRate">
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
      							<input type="range" id="streamSettings" name="bitrate" min="0" max="100" onChange={this.handleChange} value={this.state.streamSettings.bitrate}/>
    						</p>
  						</form>
  					</div>
  				</div>
  			</div>	
		)

		const appListView =()=> {
			if(this.state.appList.map){
				return (
					this.state.appList.map((apps, i) => {
						return <div key={i}>
							<li>
								<a onClick={this.startGame} id={apps.id} name={apps.title}>{apps.title}</a>
							</li>
						</div>
					})
				)
			}
		return (<div>appList is Empty</div>);	
		};


		return (
			<div>
				{this.props.isMoonlightOnline? <div className="col s12">Moonlight-chrome is online</div>: <div>Moonlight-chrome is offline</div>}
				{settingView}

				{this.state.mode?
					<div className="row">
						<HostList hostList={this.props.hostList} onClick={this.showApps}/>
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
		               		<span>{"Please enter the number " + this.props.getIn(['newHost','pairingNum']) + " on the GFE dialog on the computer."}</span>
							: undefined
						}

					</div>
						: appListView
				}
			</div>
		)
	}
}


export default Moonlight;