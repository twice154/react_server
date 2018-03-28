import React, { Component } from 'react';
import HeaderContainer from './HeaderContainer'
import Modal from './Modal'

class TopBar extends Component {
    constructor(props) {
        super(props);
        this.state = { modal:false, }
        this.modalToggle=this.modalToggle.bind(this)

    }
    
    
    /**
	 * 모달을 띄웠다 내렸다 하는 함수.
	 */
	modalToggle(){
        console.log('toggle')
		this.setState({
			modal: !this.state.modal
		  });
	}
    render() { 
        return ( 
            <div>
            <HeaderContainer 	onLogin={this.modalToggle} history={this.props.history}/>
            <Modal modal={this.state.modal} toggle={this.modalToggle} history={this.props.history}/>
        </div>
    )
    }
}
export default TopBar;