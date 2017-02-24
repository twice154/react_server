import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {Chatting} from 'components';
import {getStatusRequest} from 'actions/authentication'; 
import {getStreamsRequest} from 'actions/Stream';

class streamList extends React.Component {
	constructor(props){
		super(props);
		this.connect = this.connect.bind(this);
		this.clearLog = this.clearLog.bind(this);
		this.doLog = this.doLog.bind(this);
		this.state = {
			isConnected: false,
            spanLog:[],
            streams:[],
            ws: null,
            isUnmounted: false
		};
	}

    componentWillUnmount(){
        if(this.props.isConnected){
            this.state.ws.close();
            this.setState({
                isConnected: false,
                streams: [],
                isUnmounted: true
            });
        }
    }

    componentDidMount(){
        console.log("Component did mount");
        this.props.getStatusRequest().then(
            ()=>{
                this.props.getStreamsRequest().then(()=>
                    {
                        console.log(this.props.stream_status);
                    }
                )
            }
        )
    }

	clearLog(){
		this.setState({
            spanLog: []
        })
	}

	doLog(Logstr){
        //console.log(Logstr);
        //document.getElement('spanLog').innerHTML+= Logstr+'<br/>';
    }

	connect(){ 
		let wsURL = "ws://localhost:8086/hello";
		let msgData = "";
        let ws = null;

		if("WebSocket" in window){
            if(this.state.isConnected){
                 this.state.ws.close();
                 //then(()=>{
                 this.setState({
                 	isConnected: false,
                    streams: []
                 });
                 this.clearLog();
                 
                 	//document.getElementById("streams").innerHTML = "";
                 //})
            }
            else{
                var msgs = [];
                ws = new WebSocket(wsURL);
                ws.binaryType = 'arraybuffer';

                ws.onopen = function(){
                    let updatedLog = this.state.spanLog;
                    updatedLog.push("INFO: WebSocket is open: " + wsURL);

                	this.setState({
                		isConnected: true,
                        spanLog: updatedLog
                	});
                    
                    //this.updateControls();
                    //this.doLog("INFO: WebSocket is open: " + wsURL);
                }.bind(this);

                ws.onmessage = function(evt){
                    msgData = evt.data;
                        //일단 text인 경우만 처리
                    //this.doLog("INFO: Receive text message: "+msgData);
                    let newLog = this.state.spanLog;
                    newLog.push("INFO: Receive text message: " + msgData);
                    let parser = new DOMParser();
                    let xmlDoc = parser.parseFromString(msgData, "text/xml");
                    let stream_count = xmlDoc.getElementsByTagName('stream').length;
                    //this.doLog("stream_count: " + stream_count);
                    let stream_names = [];
                    //let stream_tag = document.getElementById("streams");
                    //stream_tag.innerHTML = "";
                    let newList=[];
                    
                    for(var i=0; i<stream_count; i++) {
                        let stream_name = xmlDoc.getElementsByTagName('stream')[i].childNodes[0].nodeValue;
                       	let thumbnail_link = "http://localhost:8086/thumbnail?application=live&streamname=" + stream_name + "&size=640x360&fitmode=letterbox";
                        //stream_tag.innerHTML += "<p><a href=\"./player/" + stream_name + "\">" + stream_name + "</a>";
                        //stream_tag.innerHTML += '<img style= \"user-select: none;\" src=\"' + thumbnail_link + '\" width=\"640\" height= \"360\"></p>'
                        newList.push(stream_name);
                    }
                    if(!this.state.isUnmounted){
                        this.setState({
                            spanLog: newLog,
                            streams: newList
                        });
                    }
                }.bind(this);

                    ws.onclose = function(){
                        console.log("INFO: WebSocket connection is closed");
                    }.bind(this);

                    this.setState({
                        ws: ws
                    });
                }
            }
	}

	render(){
		return(
			<div className="wrapper">
				<input type="button" className="butConnect" value={this.state.isConnected?'Disconnect' :'connect'} onClick={this.connect}/><br/><br/>
				<input type="button" className="clear" value="clearLog" onClick={this.clearLog}/>
				<div id="streams">{
                    this.state.streams.map((streamName, i)=>{
                        let link = '/player/' + encodeURIComponent(streamName);
                        let thumbnail_link = "http://localhost:8086/thumbnail?application=live&streamname=" + streamName + "&size=640x360&fitmode=letterbox";
                        return <div key= {i}>
                            <li><Link to={link} activeClassName="active" onClick={this.connect}>{streamName}<br/>                            
                                <img
                                    style={{width: 50, height: 50}}
                                    src={thumbnail_link} 
                                />
                            </Link></li>
                            
                        </div>
                    })
                }</div>
				<span id="spanLog">{
                    this.state.spanLog.map((line,i) => {
                        return <div key = {i}>
                            <span>{line}<br/></span>
                        </div>
                    })
                }</span>
			</div>
		)
	}
}

const mapStateToProps = (state) =>{
    return{
        status: state.authentication.status,
        stream_status: state.Stream.list
    };
};

const mapDispatchtoProps = (dispatch) => {
    return {
        getStatusRequest: ()=> {
            return  dispatch(getStatusRequest());
        },
        getStreamsRequest: ()=>{
            return dispatch(getStreamsRequest());
        }
    };
}

export default connect(mapStateToProps, mapDispatchtoProps)(streamList);