import React, { Component } from 'react';
import {Text,Video,Voice} from '../../components/donation'
import {connect} from 'react-redux'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getThumbnail, videoDonation } from '../../modules/donation';


class Donation extends Component {
    constructor(props) {
        super(props);
        this.state = { case:'text' }
        this.handleSelect=this.handleSelect.bind(this)
    }
    componentDidUpdate(){
        console.log(this.props.thumbnail)
    }

    handleSelect(a){
        this.setState({case:a})
    }
    donation(o){
        // this.props.donation(o).then(()=>{
        //     this.props.close()
        // })
    }
    render() { 
        return ( 
            <Modal isOpen={this.props.modal} toggle={this.props.toggle} style={{marginTop:'100px',width:'550px'}}>
            <ModalHeader>
            <div style={{paddingTop:"40px",paddingLeft:"50px"}} >
			<h2> {this.props.streamName}에게 도네하기. </h2>
			</div>
            </ModalHeader>
			<ModalBody style={{paddingTop:"0",paddingLeft:"30px"}}>
			<div className='choose'>
                <a onClick={()=>this.handleSelect('text')}>쪽지로 응원하기</a> <a onClick={()=>this.handleSelect('voice')}>음성으로 응원하기</a> <a onClick={()=>this.handleSelect('video')}>영상으로 응원하기</a>
            </div>
            {(()=>{switch(this.state.case){
            case 'text':
                return <Text/>
                break;
            case 'voice':
                return <Voice/>
                break;
            case 'video':
                return <Video thumbnail={this.props.thumbnail} getThumbnail={this.props.getThumbnail} donation={this.props.videoDonation}/>
                break;
            default:
                console.log('warning')
        }})()}
			</ModalBody>
		


			
			</Modal>
        )
    }
}
const mapStateToProps=(state)=>{
    return{
        thumbnail:state.donation.thumbnail
    }
}


const mapDispatchToProps=(dispatch)=>{
    return{
        getThumbnail:(url)=>dispatch(getThumbnail(url)),
        videoDonation:(data)=>dispatch(videoDonation(data))
    }
   
}
 
export default connect(mapStateToProps,mapDispatchToProps)(Donation);