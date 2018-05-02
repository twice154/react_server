import express from 'express';
const router = express.Router();
import axios from 'axios'
import {ioToDonation } from '../../main'
import {hashKeyForStreamSocketId} from '../../config'
const User = require('../../models/user')
import crypto from 'crypto'
var AWS = require('aws-sdk');
AWS.config.update({region:'ap-northeast-2'})
var polly = new AWS.Polly();




var donationSoonSeo={}


/**
 * 메시지 후원 처리 함수
 * req.body - message, token, userId,donationType
 * req.body-token,url,startTime,userId,donationType
 */
exports.donation=(req,res)=>{
    var streamSocketId = crypto.createHmac('sha256','annyoung').update(req.params.streamerId).digest('hex').slice(0,10)
    console.log(streamSocketId)
    console.log('시작')
    console.log(donationSoonSeo)
    if(!donationSoonSeo[streamSocketId]){
        console.log('처음 등록함')
        donationSoonSeo[streamSocketId]=[req.body]
        donationFunctions(streamSocketId)
    }else if(donationSoonSeo[streamSocketId].length===0){
        console.log('앞에 아무것도 없음.')
        donationSoonSeo[streamSocketId].push(req.body)
        donationFunctions(streamSocketId)
    }else{
        donationSoonSeo[streamSocketId].push(req.body)
     console.log('현재 쌓여있는 개수 :',donationSoonSeo[streamSocketId].length)

    }

    res.json({success:true})
}




//thumnail모아오는 것.
exports.thumbnail= (req,res)=>{
    console.log(req.headers.thumbnail)
    var url=req.headers.thumbnail.split('/')
    var query = url[3];
    console.log(query)
    var ytId = query.split('=')[1]
    res.json({data:{thumbnail:`https://i.ytimg.com/vi/${ytId}/0.jpg`}})
}








exports.getToken = (req,res)=>{
    res.json({data:{token:235}})
}

/**
 * streamsocketid를 만들어 주는 함수.
 */
exports.getStreamSocketId=(req,res)=>{
    var streamSocketId = crypto.createHmac('sha256','annyoung').update(req.decoded.userId).digest('hex').slice(0,10)
    res.json({data:{streamSocketId}})
}
/**
 * 세팅을 받아오는 함수. 토큰에서 유저 아이디를 까낸다.
 */
exports.getSettings = (req,res)=>{
    const info = req.body
    info.userId = req.decoded.userId

    const onError = () => {
		res.status(403).json({
	    	message: 'fail'
		})
	}
    /**
     * donation setting이 저장되어 있으면 괜찮다.
     */
    User.getDonationSetting(info).then((TempDat)=>{
        if(!Object.keys(TempDat).length){
            res.json({success:false})
        }else{            
            res.json({success:true, data:{settings:TempDat}}) 
        }
        
    }).catch(onError)
}
/**
 * 세팅을 저장하는 함수.
 */
exports.setSettings=(req,res)=>{
    const info = req.body
    info.userId = req.decoded.userId
    const onError = (err) => {
        console.log(err)
		res.status(403).json({
	    	message: 'fail'
		})
	}
    User.setDonationSetting(info).then(()=>{
        res.json({success:true})
    }).catch(onError)
  
}
/**
 * message후원을 위해 tts로 mp3파일을 만든 뒤 소켓으로 보내주는 함수.
 * @param {string} streamSocketId 
 * TODO: img정보를 받아올때 public에 저장되어 있는 애들을 읽어서 받아올때 twip처럼 할지 아프리카처럼 할지 선택해야 한다.
 *        + 도네할때 이미지를 선택할 수 있게 할지. 아니면 토큰 개수에 따라서 다르게 줄지도 생각해야 한다.
 */
const messageDonationFunction = (streamSocketId,donaInfo)=>{
            console.log('message 보내기')
        var params
        if(!donaInfo.message){
            params = {
                OutputFormat:'mp3',
                Text:`${donaInfo.userId}님이 샤 ${donaInfo.token}개를 영상으로 후원해주셨어요`,
                TextType:'text',
                VoiceId:"Seoyeon"
            }
        }else{
            params ={
                OutputFormat:'mp3',
                Text:`${donaInfo.message}`,
                TextType:'text',
                VoiceId:"Seoyeon"
            }
        }           
            polly.synthesizeSpeech(params,(err,data)=>{
                if(err) console.log(err,err.stack)
                ioToDonation.to(streamSocketId).emit('messageDonation', {token:donaInfo.token,userId:donaInfo.userId,mp3:data.AudioStream,imgsrc:'http://cfile214.uf.daum.net/image/2260284A586B5E48219579'})
               
            })
}
/**
 * 비디오 도네이션 하는 함수.
 * @param {string} streamSocketId 
 * @param {string} donaInfo 
 */
const videoDonationFunction = (streamSocketId,donaInfo)=>{

        console.log('video 보내기')
        console.log(donaInfo)
        let url=donaInfo.url.split('/')
        let query = url[3];
        console.log(query)
        let ytId = query.split('=')[1]
        let data = {url:`https://www.youtube.com/embed/${ytId}?autoplay=1&start=${donaInfo.startTime}&controls=0`,
                    token:donaInfo.token,userId:donaInfo.userId}
        ioToDonation.to(streamSocketId).emit('videoDonation',data)

}
exports.shiftDonation = (streamSocketId)=>{
    
    if(donationSoonSeo[streamSocketId]&&donationSoonSeo[streamSocketId].length){
        donationSoonSeo[streamSocketId].shift()
        console.log('갯수',donationSoonSeo[streamSocketId].length)
    }
}

export const donationFunctions = (streamSocketId)=>{
    console.log('donation 선택')
    if(donationSoonSeo[streamSocketId]&&donationSoonSeo[streamSocketId].length){
        let donaInfo=  donationSoonSeo[streamSocketId][0];
        switch(donaInfo.donationType){
            case 'video':
            videoDonationFunction(streamSocketId,donaInfo)
            break;
            case 'message':
            messageDonationFunction(streamSocketId,donaInfo)
            break;
        }

    }

}