import React, { Component } from 'react';
import styled from 'styled-components';
// import Switch from 'react-switch'
// import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import {connect} from 'react-redux'
import { getReactoSettingForStreamer, setReactoSetting } from '../../modules/reacto';
import ReactRange from 'react-simple-range'
import { getStatusRequest } from '../../modules/authentication';


class Reacto extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            //checked:true,//checked가 true면 시간타입(T) false면 퍼센트타입(%)
                      //popoverOpen1:false,popoverOpen2:false,
                      percent:this.props.settings.percent,resetTime:this.props.settings.resetTime,
                         //이때 저장되는 이름은 bj이름_No1_img, bj이름_No1_audio
                       No1_content_img:'',No2_content_img:'',No3_content_img:'',No4_content_img:'',No5_content_img:'',No6_content_img:'',
                       No1_content_audio:'',No2_content_audio:'',No3_content_audio:'',No4_content_audio:'',No5_content_audio:'',No6_content_audio:'',
                       No1_duration:'',No2_duration:'',No3_duration:'',No4_duration:'',No5_duration:'',No6_duration:'',
                      } 
        // this.popoverToggle = this.popoverToggle.bind(this)
        // this.switchToggle = this.switchToggle.bind(this)
        // this.changeToInput = this.changeToInput.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.imgUpload=this.imgUpload.bind(this)
        this.mp3Upload=this.mp3Upload.bind(this)
        this.sliderChange=this.sliderChange.bind(this)
        this.handleSubmit=this.handleSubmit.bind(this)
        
        
    }
    componentDidMount(){
        this.props.getstate().then(()=>{//getstate를 한번에 할 수 있는 특단의 대책이 필요함 //TODO
           
            for(var i=1;i<7;i++){
                Promise.resolve(i).then((i)=>{
                    var image = new Image();
                    image.onload=()=>{
                        this['No'+i+'_contentImg'].src=`http://localhost:3000/static/ERs/${this.props.userId}_No${i}_img.png`;
                        console.log('123')
                    }
                    image.onerror=(err)=>{
                        console.log(err)
                    }
                    image.src=`http://localhost:3000/static/ERs/${this.props.userId}_No${i}_img.png`
                })
                
                console.log(`http://localhost:3000/static/ERs/${this.props.userId}_No${i}_img.png`)
                
            }
        })
        this.props.getReactoSetting().then(()=>{
            console.log(this.props.settings)
            this.setState(this.props.settings)
        }).catch((err)=>console.log(err))//getreactosetting할때 db에 저장되어있는 세팅이 없다면 then을 실행하지 않고 catch를 실행한다.
    }
    
    
    /**
     * db에 저장하는 함수. 이미지와 오디오는 서버에 따로 저장한다.
     */
    handleSubmit(){
        var formdata= new FormData()
        for(var i=1;i<7;i++){
            //순서대로 넣어야만 실행됨.
            //TODO: 어떻게 해결해야 될가???? 이미지 파일 불러오고 다음을 실행할 수 있게 하려면.
            if(!this.state['No'+i+'_content_img']||!this.state['No'+i+'_content_audio']||!this.state['No'+i+'_content_duration']){
                alert(i+'번 세트의 내용을 모두 다 넣어주세요')
                break;
            }
            console.log('실행')
            formdata.append('No'+i+'_img',this.state['No'+i+'_content_img'])//폴더저장
            formdata.append('No'+i+'_audio',this.state['No'+i+'_content_audio'])//폴더에저장
            formdata.append('No'+i+'_duration',this.state['No'+i+'_duration'])//디비저장

        }
        formdata.append('abc','123')
        console.log('No'+i+'_duration',this.state['No'+i+'_duration'])
        formdata.append('percent',this.state.percent)
        formdata.append('resetTime',this.state.resetTime)
        this.props.setReactoSetting(formdata).catch(err=>console.log(err))
    }
     /**
     * react-simple-range의 값을 바꿔주는 함수.
     * @param {object} a {value:current value, min,max, range, step, ratio, thumbSize, id}
     */
    sliderChange(a){
        this.setState({[a.id]:a.value})
    }
    /**
     * audio파일을 업로드 하는 함수
     * @param {event} e 
     * @param {string} No -몇번 버튼의 파일인지 체크 'No(1,2,3,4,5,6)으로 구성'
     * by.g1
     */
    mp3Upload(e,No){
        var mp3file = e.target.files[0]
        if(!mp3file){
            return 0
        }

        this.setState({[No+'_content_audio']:mp3file})
        var reader = new FileReader();
        reader.onload=(ev)=>{
            this[No+'_contentAudio'].setAttribute('src',ev.target.result)
            // this[No+'_contentAudio'].style.display='block'
        }
        reader.readAsDataURL(mp3file)

    }
    /**
     * img를 업로드 하는 함수
     * @param {event object} e 
     * @param {string} No -몇번 버튼의 파일인지 체크 'No(1,2,3,4,5,6)으로 구성'
     * by. g1
     */
    imgUpload(e,No){
        var imgfile = e.target.files[0]
        if(!imgfile){
            return 0
        }
           this.setState({[No+'_content_img']:imgfile})
        var reader = new FileReader();
        reader.onload=(ev)=>{
            this[No+'_contentImg'].setAttribute('src',ev.target.result)
            this[No+'_contentImg'].style.display='block'
        }
        reader.readAsDataURL(imgfile)

    }
    
    /**
     * input을 바꿀때 이미지를 선택했다가 바꾸면 기존 이미지를 삭제한다.
     * @param {event} e 
     */
    handleChange(e){
        var target = e.target
        this.setState({[target.name]:target.value})
        
    }
    // /**
    //  * 텍스트를 input형식으로 바꿔주는 함수.
    //  */
    // changeToInput(e){
    //     var span = e.target
    //     var input = <input value={span.innerHTML}/>
    //     span.parentNode.insertBefore(input,span)
    // }
    // /**
    //  * 리엑트 스위치 토글을 위한 함수.
    //  * @param {*} checked 
    //  */
    // switchToggle(checked){
    //     this.setState({checked})
    // }

    // /**
    //  * popover 토글을 위한 함수
    //  * @param {string} type 어떤 타입을 할지 넣어준다.(1,2 중 선택)
    //  */
    // popoverToggle(type) {
    //     this.setState({
    //     ['popoverOpen'+type]: !this.state['popoverOpen'+type]
    //     });
    // }
    render() { 

        return ( <Container>
            <button>reactoButton 미리 보기</button>
            {/* <div className='row'>
            <StyledCol className=' text-sm-right'>
                타입
            </StyledCol>
            <div className='col'>
            퍼센트타입 <img alt='물음표'style={{cursor:'pointer'}} src='https://image.flaticon.com/icons/svg/12/12433.svg' width='15px'height='15px' id='percentType' onClick={()=>this.popoverToggle('1')}/> */}
            {/* <Tooltip style={{backgroundColor:'white',color:'black',borderColor:'white'}} placement="right" isOpen={this.state.tooltipOpen1} target="percentType" toggle={()=>{this.toolTipToggle(1)}}>
            스
            </Tooltip> */}
            {/* <Popover placement="bottom" isOpen={this.state.popoverOpen1} target="percentType" toggle={()=>{this.popoverToggle('1')}}>
            <PopoverHeader>퍼센트 타입이란?</PopoverHeader>
            <PopoverBody>시청자의 몇 퍼센트가 reacto버튼을 눌렀을때 활성화 시킬지를 정하는 타입. 스트리머는 아래의 각 버튼을 조절한다.</PopoverBody>
            </Popover>
            <Switch checked={this.state.checked}
                onChange={this.switchToggle}
                uncheckedIcon={
                <div
                    style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    fontSize: 15,
                    color: "orange",
                    paddingRight: 2
                    }}
                >
                    %
                </div>} checkedIcon={
                 <div
                    style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    fontSize: 15,
                    color: "skyblue",
                    paddingRight: 2
                    }}
                >
                 T
             </div>
                }/>시간 타입<img alt='물음표' style={{cursor:'pointer'}} src='https://image.flaticon.com/icons/svg/12/12433.svg' width='15px'height='15px' id='timeType' onClick={()=>this.popoverToggle('2')}/> 
            <Popover placement="bottom" isOpen={this.state.popoverOpen2} target="timeType" toggle={()=>{this.popoverToggle('2')}}>
            <PopoverHeader>시간 타입이란?</PopoverHeader>
            <PopoverBody>스트리머가 정한 시간이 되면 아래의 버튼 중 가장 많이 눌린 버튼을 활성화 시킨다. 스트리머는 아래의 각 버튼을 조절한다.</PopoverBody>
            </Popover>
            </div>


            </div> */}
            <div className='row'>
                <StyledCol className=' text-sm-right'>
                    퍼센트(몇퍼센트 이상이 클릭시 리엑토 발현)
                </StyledCol>
            <div className='col-sm-6'>
            <ReactRange min={10} max={100} value={this.state.percent} id="percent" onChange={this.sliderChange} trackColor='#65a7ff' step={5}/>
            </div>
            <div className='col-sm-1'>
                <Input name='percent' value={this.state.percent} disabled/>
                %
                </div>
            </div>
            <div className='row'>
                <StyledCol className=' text-sm-right'>
                    리엑토 버튼 초기화 시간.
                </StyledCol>
            <div className='col'>
                <input name='resetTime' value={this.state.resetTime} onChange={this.handleChange}/>초
                </div>
            </div>
            <div className='container-fluid' id='reactoButtons'>
                <div className='row'>
                    <div className='col-6'>
                        <div>reacto 1번</div>
                        <label className="btn btn-sm btn-outline-primary">
                            이미지 업로드 <input type="file" style={{display: 'none'}} accept="image/*" onChange={(e)=>this.imgUpload(e,'No1')}/>
                        </label>
                        <div className='row'>
                        <div>
                            리엑토 버튼 프리뷰(버튼의 프리뷰, 발현시 크기는 bj가 정할 수 있음--obs에.)
                        </div>
                        <div className='col'>
                        <img alt='button1'style={{width:'130px',height:'65px'}}src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png' ref={el=>{this.No1_contentImg=el}}/>
                        </div>
                        </div>
                        <div>
                        <label className="btn btn-sm btn-outline-primary">
                            리엑토 버튼 효과음 업로드 <input type="file" style={{display: 'none'}} accept="audio/*" onChange={(e)=>this.mp3Upload(e,'No1')}/>
                        </label>
                        <audio ref={el=>this.No1_contentAudio=el}></audio>
                        <button onClick={()=>this.No1_contentAudio.play()}>play</button>
                        </div>
                        <div>reacto 버튼 지속시간</div>
                        <input name='No1_duration' value={this.state.No1_duration} onChange={this.handleChange}/>초
                    </div>
                    <div className='col-6'>
                        <div>reacto 2번</div>
                        <label className="btn btn-sm btn-outline-primary">
                            이미지 업로드 <input type="file" style={{display: 'none'}} accept="image/*" onChange={(e)=>this.imgUpload(e,'No2')}/>
                        </label>
                        <div className='row'>
                        <div>
                            리엑토 버튼 프리뷰(버튼의 프리뷰, 발현시 크기는 bj가 정할 수 있음--obs에.)
                        </div>
                        <div className='col'>
                        <img alt='button2'style={{width:'130px',height:'65px'}}src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png' ref={el=>{this.No2_contentImg=el}}/>
                        </div>
                        </div>
                        <div>
                        <label className="btn btn-sm btn-outline-primary">
                            리엑토 버튼 효과음 업로드 <input type="file" style={{display: 'none'}} accept="audio/*" onChange={(e)=>this.mp3Upload(e,'No2')}/>
                        </label>
                        <audio ref={el=>this.No2_contentAudio=el}></audio>
                        <button onClick={()=>this.No2_contentAudio.play()}>play</button>
                        </div>
                        <div>reacto 버튼 지속시간</div>
                        <input name='No2_duration'value={this.state.No2_duration} onChange={this.handleChange}/>초
                    </div>
                    <div className='col-6'>
                        <div>reacto 3번</div>
                        <label className="btn btn-sm btn-outline-primary">
                            이미지 업로드 <input type="file" style={{display: 'none'}} accept="image/*" onChange={(e)=>this.imgUpload(e,'No3')}/>
                        </label>
                        <div className='row'>
                        <div>
                            리엑토 버튼 프리뷰(버튼의 프리뷰, 발현시 크기는 bj가 정할 수 있음--obs에.)
                        </div>
                        <div className='col'>
                        <img alt='button3'style={{width:'130px',height:'65px'}}src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png' ref={el=>{this.No3_contentImg=el}}/>
                        </div>
                        </div>
                        <div>
                        <label className="btn btn-sm btn-outline-primary">
                            리엑토 버튼 효과음 업로드 <input type="file" style={{display: 'none'}} accept="audio/*" onChange={(e)=>this.mp3Upload(e,'No3')}/>
                        </label>
                        <audio ref={el=>this.No3_contentAudio=el}></audio>
                        <button onClick={()=>this.No3_contentAudio.play()}>play</button>
                        </div>
                        <div>reacto 버튼 지속시간</div>
                        <input name='No2_duration'value={this.state.No3_duration} onChange={this.handleChange}/>초
                    </div>
                    <div className='col-6'>
                        <div>reacto 4번</div>
                        <label className="btn btn-sm btn-outline-primary">
                            이미지 업로드 <input type="file" style={{display: 'none'}} accept="image/*" onChange={(e)=>this.imgUpload(e,'No4')}/>
                        </label>
                        <div className='row'>
                        <div>
                            리엑토 버튼 프리뷰(버튼의 프리뷰, 발현시 크기는 bj가 정할 수 있음--obs에.)
                        </div>
                        <div className='col'>
                        <img alt='button4'style={{width:'130px',height:'65px'}}src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png' ref={el=>{this.No4_contentImg=el}}/>
                        </div>
                        </div>
                        <div>
                        <label className="btn btn-sm btn-outline-primary">
                            리엑토 버튼 효과음 업로드 <input type="file" style={{display: 'none'}} accept="audio/*" onChange={(e)=>this.mp3Upload(e,'No4')}/>
                        </label>
                        <audio ref={el=>this.No4_contentAudio=el}></audio>
                        <button onClick={()=>this.No4_contentAudio.play()}>play</button>
                        </div>
                        <div>reacto 버튼 지속시간</div>
                        <input name='No2_duration'value={this.state.No4_duration} onChange={this.handleChange}/>초
                    </div>
                    <div className='col-6'>
                        <div>reacto 5번</div>
                        <label className="btn btn-sm btn-outline-primary">
                            이미지 업로드 <input type="file" style={{display: 'none'}} accept="image/*" onChange={(e)=>this.imgUpload(e,'No5')}/>
                        </label>
                        <div className='row'>
                        <div>
                            리엑토 버튼 프리뷰(버튼의 프리뷰, 발현시 크기는 bj가 정할 수 있음--obs에.)
                        </div>
                        <div className='col'>
                        <img alt='button5'style={{width:'130px',height:'65px'}}src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png' ref={el=>{this.No5_contentImg=el}}/>
                        </div>
                        </div>
                        <div>
                        <label className="btn btn-sm btn-outline-primary">
                            리엑토 버튼 효과음 업로드 <input type="file" style={{display: 'none'}} accept="audio/*" onChange={(e)=>this.mp3Upload(e,'No5')}/>
                        </label>
                        <audio ref={el=>this.No5_contentAudio=el}></audio>
                        <button onClick={()=>this.No5_contentAudio.play()}>play</button>
                        </div>
                        <div>reacto 버튼 지속시간</div>
                        <input name='No2_duration'value={this.state.No5_duration} onChange={this.handleChange}/>초
                    </div>
                    <div className='col-6'>
                        <div>reacto 6번</div>
                        <label className="btn btn-sm btn-outline-primary">
                            이미지 업로드 <input type="file" style={{display: 'none'}} accept="image/*" onChange={(e)=>this.imgUpload(e,'No6')}/>
                        </label>
                        <div className='row'>
                        <div>
                            리엑토 버튼 프리뷰(버튼의 프리뷰, 발현시 크기는 bj가 정할 수 있음--obs에.)
                        </div>
                        <div className='col'>
                        <img alt='button6'style={{width:'130px',height:'65px'}}src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png' ref={el=>{this.No6_contentImg=el}}/>
                        </div>
                        </div>
                        <div>
                        <label className="btn btn-sm btn-outline-primary">
                            리엑토 버튼 효과음 업로드 <input type="file" style={{display: 'none'}} accept="audio/*" onChange={(e)=>this.mp3Upload(e,'No6')}/>
                        </label>
                        <audio ref={el=>this.No6_contentAudio=el}></audio>
                        <button onClick={()=>this.No6_contentAudio.play()}>play</button>
                        </div>
                        <div>reacto 버튼 지속시간</div>
                        <input name='No2_duration'value={this.state.No6_duration} onChange={this.handleChange}/>초
                    </div>
                    
                    {/* <div className='col'>
                    <div>reacto 2번</div>
                    <label className="btn btn-sm btn-outline-primary">

                    이미지 업로드 <input type="file" style={{display: 'none'}} accept="image/*" onChange={(e)=>this.imgUpload(e,'No2')}/>
                    </label>
                    <img alt='물음표'style={{cursor:'pointer'}} src='https://image.flaticon.com/icons/svg/12/12433.svg' width='15px'height='15px' id='timeType' onClick={()=>this.popoverToggle('2')}/> 
                    <Popover placement="bottom" isOpen={this.state.popoverOpen2} target="timeType" toggle={()=>{this.popoverToggle('2')}}>
                    <PopoverHeader>시간 타입이란?</PopoverHeader>
                    <PopoverBody>스트리머가 정한 시간이 되면 아래의 버튼 중 가장 많이 눌린 버튼을 활성화 시킨다. 스트리머는 아래의 각 버튼을 조절한다.</PopoverBody>
                    </Popover>
                    <div className='row'>
                    <div>
                        리엑토 버튼 프리뷰
                    </div>
                    <div className='col'>
                    <img alt='button2'style={{display:'none',width:'130px',height:'65px'}}src='#' ref={el=>{this.No2_contentImg=el}}/>
                    </div>
                    </div>

                    </div>
                    <div className='col'>
                    <div>reacto 3번</div>
                    <label className="btn btn-sm btn-outline-primary">
                    이미지 업로드
                    <input type="file" style={{display: 'none'}} accept="image/*" onChange={(e)=>this.imgUpload(e,'No3')}/>
                    </label>
                    <img alt='물음표'style={{cursor:'pointer'}} src='https://image.flaticon.com/icons/svg/12/12433.svg' width='15px'height='15px' id='timeType' onClick={()=>this.popoverToggle('2')}/> 
                    <Popover placement="bottom" isOpen={this.state.popoverOpen2} target="timeType" toggle={()=>{this.popoverToggle('2')}}>
                    <PopoverHeader>시간 타입이란?</PopoverHeader>
                    <PopoverBody>스트리머가 정한 시간이 되면 아래의 버튼 중 가장 많이 눌린 버튼을 활성화 시킨다. 스트리머는 아래의 각 버튼을 조절한다.</PopoverBody>
                    </Popover>
                    <div className='row'>
                    <div>
                        리엑토 버튼 프리뷰
                    </div>
                    <div className='col'>
                    <img alt='button3'style={{display:'none',width:'130px',height:'65px'}}src='#' ref={el=>{this.No3_contentImg=el}}/>
                    </div>
                    </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col'>
                    <div>reacto 4번</div>
                    <label className="btn btn-sm btn-outline-primary">

                    이미지 업로드 <input type="file" style={{display: 'none'}} accept="image/*" onChange={(e)=>this.imgUpload(e,'No4')}/>
                    </label>
                    <img alt='물음표'style={{cursor:'pointer'}} src='https://image.flaticon.com/icons/svg/12/12433.svg' width='15px'height='15px' id='timeType' onClick={()=>this.popoverToggle('2')}/> 
                    <Popover placement="bottom" isOpen={this.state.popoverOpen2} target="timeType" toggle={()=>{this.popoverToggle('2')}}>
                    <PopoverHeader>시간 타입이란?</PopoverHeader>
                    <PopoverBody>스트리머가 정한 시간이 되면 아래의 버튼 중 가장 많이 눌린 버튼을 활성화 시킨다. 스트리머는 아래의 각 버튼을 조절한다.</PopoverBody>
                    </Popover>
                    <div className='row'>
                    <div>
                        리엑토 버튼 프리뷰
                    </div>
                    <div className='col'>
                    <img alt='button4'style={{display:'none',width:'130px',height:'65px'}}src='#' ref={el=>{this.No4_contentImg=el}}/>
                    </div>
                    </div>
                    </div>
                    <div className='col'>
                    <div>reacto 5번</div>
                    <label className="btn btn-sm btn-outline-primary">

                    이미지 업로드 <input type="file" style={{display: 'none'}} accept="image/*" onChange={(e)=>this.imgUpload(e,'No5')}/>
                    </label>
                    <img alt='물음표'style={{cursor:'pointer'}} src='https://image.flaticon.com/icons/svg/12/12433.svg' width='15px'height='15px' id='timeType' onClick={()=>this.popoverToggle('2')}/> 
                    <Popover placement="bottom" isOpen={this.state.popoverOpen2} target="timeType" toggle={()=>{this.popoverToggle('2')}}>
                    <PopoverHeader>시간 타입이란?</PopoverHeader>
                    <PopoverBody>스트리머가 정한 시간이 되면 아래의 버튼 중 가장 많이 눌린 버튼을 활성화 시킨다. 스트리머는 아래의 각 버튼을 조절한다.</PopoverBody>
                    </Popover>
                    <div className='row'>
                    <div>
                        리엑토 버튼 프리뷰
                    </div>
                    <div className='col'>
                    <img alt='button5'style={{display:'none',width:'130px',height:'65px'}}src='#' ref={el=>{this.No5_contentImg=el}}/>
                    </div>
                    </div>
                    </div>
                    <div className='col'>
                    <div>reacto 6번</div>
                    <label className="btn btn-sm btn-outline-primary">

                    이미지 업로드 <input type="file" style={{display: 'none'}} accept="image/*" onChange={(e)=>this.imgUpload(e,'No6')}/>
                    </label>
                    <img alt='물음표'style={{cursor:'pointer'}} src='https://image.flaticon.com/icons/svg/12/12433.svg' width='15px'height='15px' id='timeType' onClick={()=>this.popoverToggle('2')}/> 
                    <Popover placement="bottom" isOpen={this.state.popoverOpen2} target="timeType" toggle={()=>{this.popoverToggle('2')}}>
                    <PopoverHeader>시간 타입이란?</PopoverHeader>
                    <PopoverBody>스트리머가 정한 시간이 되면 아래의 버튼 중 가장 많이 눌린 버튼을 활성화 시킨다. 스트리머는 아래의 각 버튼을 조절한다.</PopoverBody>
                    </Popover>
                    <div className='row'>
                    <div>
                        리엑토 버튼 프리뷰
                    </div>
                    <div className='col'>
                    <img alt='button6'style={{display:'none',width:'130px',height:'65px'}}src='#' ref={el=>{this.No6_contentImg=el}}/>
                    </div>
                    </div>
                    </div> */}
                </div>
            </div>
            <div className='row'>
            <StyledCol>
                
            </StyledCol>
            <div className='col'>
            
            </div>
            </div>
            <button onClick={this.handleSubmit}>저장하기</button>
        </Container>)
    }
}

const Container = styled.div`
width:100%;    height:90%

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
 #reactoButtons{
     margin:auto;
     margin-top:30px;
     width:95%;
     .col-6{
         border: solid black 1px;
         overflow: auto
     }
     .row{
         height:50%;
     }
 }
 .btn-file {
    position: relative;
    overflow: hidden;
}
.btn-file input[type=file] {
    position: absolute;
    top: 0;
    right: 0;
    min-width: 100%;
    min-height: 100%;
    font-size: 100px;
    text-align: right;
    filter: alpha(opacity=0);
    opacity: 0;
    outline: none;
    background: white;
    cursor: inherit;
    display: block;
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
const mapStateToProps=(state)=>{
    return {
        settings: state.reacto.reactoSettingForStreamer,
        userId: state.authentication.getIn(['status','userId'])
    }
}
const mapDispatchToProps =(dispatch)=>{
    return {
        getstate : ()=>dispatch(getStatusRequest()),
        getReactoSetting: ()=> dispatch(getReactoSettingForStreamer()),
        setReactoSetting:(a)=>dispatch(setReactoSetting(a))
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Reacto);