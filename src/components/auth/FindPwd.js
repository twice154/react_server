import React from 'react';

class FindPwd extends React.Component {
	constructor(props) {
		super(props);
		this.state = { id:'', email:''}
        this.handleChange=this.handleChange.bind(this)
        this.handleKeyPress=this.handleKeyPress.bind(this)
	}

	handleChange(e){ 
		let nextState = {};
		nextState[e.target.name] = e.target.value;
		this.setState(nextState);
	}
    handleKeyPress(e){
		if(e.charCode===13){
			
            this.props.sendEmail(this.state.id,this.state.email);
            
		
        }
    }
	render() { 
		return(
			<div>
			<div className="card-content">
				<div className="row">
					<div className="input-field col s12 username">
					<label>ID</label>
					<input
					name="id"
					type="text"
					className="validate"
					onChange={this.handleChange}
					value={this.state.id}/>
					</div>
					<div className="input-field col s12">
						<label>email</label>
						<input
						name="email"
						type="text"
						className="validate"
						onChange={this.handleChange}
						value={this.state.email}
						onKeyPress={this.handleKeyPress}/>
					</div>
				<a className="waves-effect waves-light btn" onClick={()=>{this.props.sendEmail(this.state.id,this.state.email)}}>SUBMIT</a>
				</div>
			</div>
		</div>
		)
	}
}
 
export default FindPwd;