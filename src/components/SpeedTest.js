import React from 'react';

const SpeedTest = (props)=>{
	return(
	<div>
		{props.status}
		<form>
			<input type='BUTTON' defaultValue="networkTest" onClick={function(){props.getSpeed().catch(err=>{
			})}}/>
		</form>
		{(props.data.client)?
			<ul>
			<li> 
			ip: {props.data.client.ip} 
			</li>

			<li>
			download: {props.data.speeds.download}
			</li>

			<li>
			upload: {props.data.speeds.upload}
			</li>

			<li>
			ping: {props.data.server.ping}
			</li>
			</ul>
		: undefined}
	</div>
	)
}
export default SpeedTest