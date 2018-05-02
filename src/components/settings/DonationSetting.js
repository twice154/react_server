import React, { Component } from 'react';
import styled from 'styled-components'
import Switch from 'react-switch'
import ReactRange from 'react-simple-range'
import { Popover } from 'reactstrap';
import {ChromePicker} from 'react-color'
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import {connect} from 'react-redux'
import {getDonationSetting,setDonationSetting,getStreamSocketId, donation} from '../../modules/donation'



//TODO: 정보를 db에 저장해서 다음에 bj가 만지지 않아도 되게끔 해야함.
class DonationSetting extends Component {
    constructor(props) {
        super(props);
        this.state = { fontSize:20,messageCheck:true,voiceCheck:true,videoCheck:true,  fontColor:'#65a7ff', highlightColor:'#B51CAA',
        volume:30,fobiddens:[], TTSvolume:50, TTSspeed:100,  donationImg:'http://cfile214.uf.daum.net/image/2260284A586B5E48219579',fobidden:'',ImgModal:false,fontOpen:false,highlightOpen:false}
        this.onChange=this.onChange.bind(this)
        this.switching=this.switching.bind(this)
        this.sliderChange=this.sliderChange.bind(this)
        this.toggle=this.toggle.bind(this)
        this.handleChangeComplete=this.handleChangeComplete.bind(this)
        this.handleKeyPress=this.handleKeyPress.bind(this)
        this.addFobidden=this.addFobidden.bind(this)
        this.deletefobidden=this.deletefobidden.bind(this)
        this.submit=this.submit.bind(this)
        this.test=this.test.bind(this)
    }
    /**
     * 테스트 창에 현재 설정한 것들을 테스트 해 본다.
     * @param {string} type -message,video,voice 도네이션 타입중 하나를 선택한다.
     */
    test(type){
        switch(type){
            case 'video':
                return this.props.donation({url:'https://www.youtube.com/watch?v=_84yJ4wZOBI',token:'20',startTime:'',userId:'테스트 봇',donationType:'video'},this.props.userId)
            case 'message':
                return this.props.donation({message:'안뇽 나는 김지원이라구 해 반가워',token:'111',userId:'테스트 봇',donationType:'message'},this.props.userId)
        }
        
    }
    /**
     * 설정한 세팅을 저장한다.
     */
    submit(){
        //array를 db에 저장 못하므로 string으로 바꿔준다.
        var settings = {fontSize:this.state.fontSize,messageCheck:this.state.messageCheck,voiceCheck:this.state.voiceCheck,videoCheck:this.state.videoCheck,fontColor:this.state.fontColor,
                 hightlightColor:this.state.highlightColor,volume:this.state.volume,fobiddens:this.state.fobiddens.toString(),TTSspeed:this.state.TTSspeed,TTSvolume:this.state.TTSvolume,
                 donationImg:this.state.donationImg}
        this.props.setDonationSetting(settings).then(()=>{alert('저장되었습니다.')}).catch((err)=>{console.log(err)})
    }
    /**
     * getDonationSetting: db에 저장되어 있는 도네이션 세팅을 받아오는 함수.
     * getDonationSettingState: 세팅이 db에 저장되어 있어서 잘 불어왔으면 true, 그 외는 false
     * donationSettings: 저장되어있던 세팅들.
     */
    componentDidMount(){
       this.props.getDonationSetting().then(()=>{
            if(this.props.donationSettingState){
                this.setState(this.props.donationSettings)
            }
        }).catch(err=>console.log(err))
        this.props.getStreamSocketId().catch(err=>console.log(err))
    }

    handleKeyPress(e){
        if(e.charCode===13){
            this.addFobidden()
        }
    }
    deletefobidden(a){
        var arrays = this.state.fobiddens
        console.log(a)
        arrays.splice(a,1)
        this.setState({fobiddens:arrays})
    }
    addFobidden(){
        if(this.state.fobidden===''){
            return 0;
        }
        var arrays= this.state.fobiddens
        arrays.push(this.state.fobidden)
        console.log(arrays)
        this.setState({fobidden:'',fobiddens:arrays})
    }
    /**
     * chromepicker에서 쓰는 색상 바꾸기 함수.
     * @param {*} color 
     * @param {*} event 
     */
    handleChangeComplete (color, name){
        this.setState({ [name]: color.hex });
      };
    /**
     * 팝 오버 토글 함수.
     */
    toggle(a) {
        console.log({[a]:!this.state[a]})
        this.setState({[a]:!this.state[a]});
        console.log(this.state)
      }
    onChange(e){
        this.setState({[e.target.name]:e.target.value})
        console.log(this.state.size)
        console.log(this.state.fobidden)
    }
    /**react switch를 위한 handlechange */
    switching(checked,e,id){
        console.log(checked)
        console.log({[id]:checked})
        this.setState({[id]:checked})
    }
    /**
     * react-simple-range의 값을 바꿔주는 함수.
     * @param {object} a {value:current value, min,max, range, step, ratio, thumbSize, id}
     */
    sliderChange(a){
        this.setState({[a.id]:a.value})
    }
    render() { 
        const FontColor = styled.i`
        background-color: ${this.state.fontColor};
        display: inline-block;
        width: 16px;
        height: 16px;
        vertical-align: text-top;
        cursor: pointer;
        `
        const HighlightColor = styled.i`
        background-color: ${this.state.highlightColor};
        display: inline-block;
        width: 16px;
        height: 16px;
        vertical-align: text-top;
        cursor: pointer;
        `
        return ( <Container>
            <div className='row'>
            <div className='col'>
            <button onClick={()=>{this.test('message')}}>메시지후원 테스트하기</button>
            <button onClick={()=>{this.test('voice')}}>음성후원 테스트하기</button>
            <button onClick={()=>{this.test('video')}}>영상후원 테스트하기</button>
            <button onClick={()=>{window.open('http://localhost:3001/donation/'+this.props.streamSocketId)}}>후원 창 열기</button>
            {/* TODO 주소 바꾸기. */}
            </div>
            </div>
            <div className='row' id='firstRow'>
            <div className='col'>
                메시지후원: <Switch onChange={this.switching} checked={this.state.messageCheck} id='messageCheck' onColor='#65a7ff' height={20} width={40} />
                음성후원: <Switch onChange={this.switching} checked={this.state.voiceCheck} id='voiceCheck' onColor='#65a7ff' height={20} width={40} />
                영상후원: <Switch onChange={this.switching} checked={this.state.videoCheck} id='videoCheck' onColor='#65a7ff' height={20} width={40} />
            
            </div>
            </div>
           
            <div className='row'>
                <StyledCol className='text-sm-right'>
                글자 크기
                </StyledCol>
                <div className='col-sm-6'>
                <ReactRange min={1} max={100} value={this.state.fontSize} id="fontSize" onChange={this.sliderChange} trackColor='#65a7ff'/>
                </div>
                <div className='col-sm-1'>
                <Input name='fontSize' value={this.state.fontSize} disabled/>
                </div>
            </div>
            {/* TODO, 폰트 종류별, 무료폰트 모음을 만들어야 됨. */}
            {/* <div className='row'>
                <StyledCol className='text-sm-right'>
                글자 폰트
                </StyledCol>
                <div className='col-sm-9'>
                </div>
                
            </div> */}
            <div className='row'>
                <StyledCol className='text-sm-right'>
                글자 색깔
                </StyledCol>
                <div className='col-sm-9'>
                <input value={this.state.fontColor} onChange={this.onChange} name='fontColor'/> <Span onClick={()=>this.toggle('fontOpen')} id='popover1'><FontColor/></Span>
                <Popover placement='bottom' isOpen={this.state.fontOpen} toggle={()=>this.toggle('fontOpen')} target='popover1'>
                <ChromePicker color={this.state.fontColor} onChangeComplete={(color)=> this.handleChangeComplete(color,'fontColor') }/>
                </Popover>
                
                </div>
                
            </div>
            <div className='row'>
                <StyledCol className=' text-sm-right'>
                하이라이트 색
                </StyledCol>
                <div className='col-sm-9'>
                <input value={this.state.highlightColor} onChange={this.onChange} name='highlightColor'/> <Span onClick={()=>this.toggle('highlightOpen')} id='popover2'><HighlightColor/></Span>
                <Popover placement='bottom' isOpen={this.state.highlightOpen} toggle={()=>this.toggle('highlightOpen')} target='popover2'>
                <ChromePicker color={this.state.highlightColor} onChangeComplete={color=> this.handleChangeComplete(color,'highlightColor') }/>
                </Popover>
                </div>
            </div><div className='row'>
                <StyledCol className='text-sm-right'>
                후원 이미지
                </StyledCol>
                <div className='col-sm-9'>
                <div style={{backgroundColor:'#cacaca',width:'120px'}}>
                <img alt='donationImg'src={this.state.donationImg} style={{width:'120px',height:'120px'}}/>
                </div>
                <button onClick={()=>this.toggle('ImgModal')}>이미지 바꾸기</button>
                </div>
                        <Modal isOpen={this.state.ImgModal} toggle={()=>{this.toggle('ImgModal')}} style={{marginTop:'100px',width:'350px'}}>
                            이미지 선택하기 이미지 불러오기
                            <ModalBody style={{paddingTop:"0",paddingLeft:"30px"}}>
                            <div className='row'>
                            <div className='col-3'>

                            </div>
                            </div>
                            </ModalBody>
                            <ModalFooter>
                            <div></div>
                            </ModalFooter>
                            
                            </Modal>
                    

            </div><div className='row'>
                <StyledCol className='text-sm-right'>
                알람 볼륨
                </StyledCol>
                <div className='col-sm-6'>
                <ReactRange min={1} max={100} value={this.state.volume} id="volume" onChange={this.sliderChange} trackColor='#65a7ff'/>
                </div>
                <div className='col-sm-1'>
                <Input name='volume' value={this.state.volume} disabled/>
                </div>
            </div><div className='row'>
                <StyledCol className='text-sm-right'>
                금지 단어 설정
                </StyledCol>
                <div className='col-sm-9'>
                    <div className="row">
                    <div className="col-sm-6">
                    <div style={{border:'1px solid',cursor:'text',height:'100px',overflow:'scroll'}}>
                            {this.state.fobiddens.map((value,i)=>{
                                return (
                               <li key={i} style={{width:'1px', listStyleType:'none'}}>
                                <span >{value}</span>
                                <span style={{cursor:'pointer'}} onClick={()=>{
                                    this.deletefobidden(i)}}>(x)</span>
                                </li>)
                            })}
                        
                        </div>
                    </div>
                    </div>
                     
                            <input name='fobidden' onKeyPress={this.handleKeyPress} value ={this.state.fobidden} onChange={this.onChange}/>
                            <a className="waves-effect waves-light btn">확인</a>
                   
                </div>
            </div>
            <div className='row'>
                <StyledCol className='text-sm-right'>
                tts볼륨
                </StyledCol>
                <div className='col-sm-6'>
                <ReactRange min={1} max={100} value={this.state.TTSvolume} id="TTSvolume" onChange={this.sliderChange} trackColor='#65a7ff'/>
                </div>
                <div className='col-sm'>
                <Input name='TTSvolume' value={this.state.TTSvolume} disabled/> %
                </div>
            </div>
            <div className='row'>
                <StyledCol className='text-sm-right'>
                tts속도
                </StyledCol>
                <div className='col-sm-6'>
                <ReactRange min={50} max={200} value={this.state.TTSspeed} id="TTSspeed" onChange={this.sliderChange} trackColor='#65a7ff' step={10}/>
                </div>
                <div className='col-sm'>
                <Input name='TTSspeed' value={this.state.TTSspeed} disabled/>  %
                </div>
            </div>
            <div className='row flex-row-reverse'>
                <button onClick={this.submit}>
                    저장하기
                </button>
            </div>
            
            </Container>)
    }
}
const Container = styled.div`
width:100%;    height:95%

border:1px solid #cacaca;
border-top:0;
overflow:auto;
overflow-x:hidden;
 .row{
    padding-top:10px
 }
 #firstRow{
     padding-left:70px;
     @media screen and (max-width: 540px){
        padding-left:0;
    }
 }
`
const Input = styled.input`
display:inline-block;
width:30px;
border: 1px solid #65a7ff
`
const StyledCol = styled.div`
width: 145px;
margin-left:15px;
padding-right:15px;
    @media screen and (max-width: 540px){
        width:100%
    }

`
const Span = styled.span`
width:24px;
height:24px;
padding: 5px;
border: 1px solid #cacaca;
`
const mapStateToProps=(state)=>{
    return{
        donationSettings:state.donation.donationSetting.settings,
        donationSettingState:state.donation.donationSetting.state,
        streamSocketId:state.donation.streamSocketId,
        userId:state.authentication.getIn(['status','userId'])
    }
}
const mapDispatchToProps=(dispatch)=>{
    return{
        donation:(data,streamName)=>dispatch(donation(data,streamName)),
        getDonationSetting:()=>dispatch(getDonationSetting()),
        getStreamSocketId:()=>dispatch(getStreamSocketId()),
        setDonationSetting:(settings)=>dispatch(setDonationSetting(settings))
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(DonationSetting);