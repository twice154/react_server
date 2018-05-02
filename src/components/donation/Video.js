import React, { Component } from 'react';
class Video extends Component {
    constructor(props) {
        super(props);
        this.state = { url:'',token:'',startTime:'' }
        this.handleChange=this.handleChange.bind(this)
        this.handleDonation=this.handleDonation.bind(this)
    }
    componentDidUpdate(){
        console.log(this.props.thumbnail)
    }
    handleChange(e){
        var data={}
        data[e.target.name]=e.target.value
        console.log(data)
        this.setState(data)
    }
    handleDonation(){
        //confirm들 다 모달로 만들면 된다.
        if(this.state.url===''){
            alert('url을 입력해 주세요')
        }else if(this.state.token===''){
            alert('후원할 토큰을 입력해 주세요.')
        }else{
            var confirm = window.confirm('후원하시겠습니까?')
            if(confirm){
                var a = {...this.state,userId:this.props.currentUser,donationType:'video'}

                this.props.donation(a,this.props.streamName).catch(err=>console.log(err))
            }
        }
       
    }
    render() { 
        return (
            <div>
                
         <div className='row'>
            <div className='col-9'>
            <input name='url' value={this.state.url} onChange={(e)=>this.handleChange(e)} placeholder='url'/>
            <button onClick={()=>{this.props.getThumbnail(this.state.url)}}>동영상 불러오기</button>
            <input name='token' value={this.state.token} onChange={(e)=>this.handleChange(e)} placeholder='후원할 토큰 개수'/>
            <input name='startTime' value={this.state.startTime} onChange={(e)=>this.handleChange(e)} placeholder='시작시간'/>
            </div>
            <div className='col-3'>
            <img src={this.props.thumbnail} height='90px' width='100px'/>
            </div>
        </div>
        <div className='row'>
            <button onClick={this.handleDonation}>후원하기</button>
        </div>
        </div> )
    }
}
 
export default Video;