import React, { Component } from 'react';
class ChangeInfoComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { value:this.props.value, typeName:this.props.typeName }
        this.handleSend=this.handleSend.bind(this)
        this.handleChange=this.handleChange.bind(this)
    }
    handleChange(e){
        this.setState({value:e.target.value})
    }
    handleSend(){
        var msg ={}
        msg[this.state.typeName]=this.state.value
        this.props.submit(msg)
    }
       
    render() { 
        return ( <div>
            <input onChange={this.handleChange} value={this.state.value}/> 
            <button onClick={this.handleSend}>완료</button> </div> )
    }
}
 
export default ChangeInfoComponent;