import express from 'express';
const router = express.Router();
import axios from 'axios'
import main from '../../main'
const User = require('../../models/user')
import {ioToDonation } from '../../main'
import {hashKeyForStreamSocketId} from '../../config'
import crypto from 'crypto'


var reactoPercent_Reset={}



/**
 * reactoSetting을 불러와서 스트리머들이 세팅할 수 있게 하는 함수.
 * // by.G1
 */
exports.getReactoSettingForStreamer = (req,res)=>{
    console.log(123)
    let info = req.body;
    info.userId = req.decoded.userId
    const onError = () => {
		res.status(403).json({
	    	message: 'fail'
		})
	}
    User.getReactoSettingForStreamer(info).then((TempDat)=>{
        console.log(TempDat)
        if(!Object.keys(TempDat).length){
            res.json({success:false})
        }else{            
            res.json({success:true, data:{settings:TempDat}}) 
        }
        
    }).catch(onError)
}

//리엑토를 세팅하는 함수. info에 필요한 것들이 들어있다. user.setReactSetting참고
//info ={No1_duration}
// by.G1
exports.setReactoSetting = (req,res)=>{
    console.log(1)
    const info = req.body
    info.userId = req.decoded.userId
    reactoPercent_Reset[info.userId]={percent:info.percent,resetTime:info.resetTime}
    console.log(info)
    console.log(reactoPercent_Reset)
    const onError = (err) => {
        console.log(err)
		res.status(403).json({
	    	message: 'fail'
		})
	}
    User.setReactoSetting(info).then(()=>{
        res.json({success:true})
    }).catch(onError)
  
}
//시청자들을 위해 비제이가 설정한 리엑토 세팅을 불러오는 함수. -- 버튼 1번부터 6번까지 설정값을 읽어와 화면에 표시한다.
exports.getReactoSettingForViewer =(req,res)=>{
    console.log('viewer가 정보 받아오기')
    var streamerId =req.params.streamerId
    console.log(streamerId)
    const onError = (err) => {
        console.log(err)
		res.status(403).json({
	    	message: 'fail'
		})
    }
    
    if(reactoPercent_Reset[streamerId]){
        var resetTime=reactoPercent_Reset[streamerId].resetTime
        var percent=reactoPercent_Reset[streamerId].percent
        console.log(resetTime)
       if(resetTime){
           res.json({success:true,data:{resetTime,percent}})
       }else{
           res.status(403).json({
               message:'fail'
           })
       }
    }else{
        User.getReactoSettingForViewer(streamerId).then((TempDat)=>{
            console.log(TempDat)
            reactoPercent_Reset[streamerId]={percent:TempDat.percent,resetTime:TempDat.resetTime}
            if(!Object.keys(TempDat).length){
                res.json({success:false})
            }else{            
                res.json({success:true, data:{resetTime:TempDat.resetTime,percent:TempDat.percent}}) 
            }
            
        }).catch(onError).catch(err=>console.log(err))
    }
    
    
}
//리엑토 버튼을 발현시키는 함수.
//data = {streamerId,total:'총 시청자 수',reactos:'array; 각 버튼을 누른 시청자 수.'}
export const emitReactoButton = (data)=>{
    var userInfo={}
    var info={}
    // if(reactoPercent_Reset[data.streamerId]){
    //         percent=reactoPercent_Reset[data.streamerId].percent;
    // }else{

    // }
            // info={imgsrc='이미지파일 주소.', imgEffect:'이미지파일 이펙트',imgDuration:'이미지파일지속시간', mp3:'reacto효과음 주소'}
    var streamSocketId = crypto.createHmac('sha256','annyoung').update(data.streamerId).digest('hex').slice(0,10)

    data.reactos.map((value,index)=>{
        
        if(value>data.total*reactoPercent_Reset[data.streamerId].percent*0.01){
            console.log('reactoemitted')
            userInfo={userId:data.streamerId,No:'No'+(index+1)}
            User.getReactoSetting(userInfo).then((TempDat)=>{
                console.log(TempDat)
                //수정해야할 수 도 있음 TODO
                if(!Object.keys(TempDat).length){
                    info.imgDuration=5
                }else{
                    info.imgDuration=TempDat['No'+(index+1)+'_duration']
                }
                  //info.imgEffect, todo
            info.imgsrc=`http://localhost:3000/static/ERs/${data.streamerId}_No${index+1}_img.png`//TODO수정요망;; 이미지 확장자
            info.mp3=`http://localhost:3000/static/ERs/${data.streamerId}_No${index+1}_audio.mp3`
            console.log(info)
            ioToDonation.to(streamSocketId).emit('reactoEmit',info)
            }).catch(err=>console.log(err))
          
        }
    })
   
}

