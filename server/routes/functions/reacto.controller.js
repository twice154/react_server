import express from 'express';
const router = express.Router();
import axios from 'axios'
import main from '../../main'


exports.thumbnail= (req,res)=>{
    console.log(req.headers.thumbnail)
    var url=req.headers.thumbnail.split('/')
    var query = url[3];
    console.log(query)
    var ytId = query.split('=')[1]
    res.json({thumbnail:`https://i.ytimg.com/vi/${ytId}/0.jpg`})
}
// router.post('/',(req,res)=>{
//     res.send()
//     axios.get('localhost:3001')
// })
export default router


//button 처리 함수
exports.button = ()=>{

}

//donation처리 함수
exports.donation = (req,res)=>{
    var donaInfo = req.body
    console.log(donaInfo)
    var url=donaInfo.url.split('/')
    var query = url[3];
    console.log(query)
    var ytId = query.split('=')[1]
    var data = {url:`https://www.youtube.com/embed/${ytId}?autoplay=1&start=${donaInfo.startTime}&controls=0`,
                endTime:donaInfo.token}

    var socket = main.socketToDonation;
    socket.emit('videoUrl',data,()=>{
        res.json({success:true})
    })
    
}