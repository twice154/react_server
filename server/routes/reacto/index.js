const router = require('express').Router()
const controller = require('./reacto.controller')
const path = require('path');

import authMiddleware from '../../middlewares/auth'
import multer from 'multer'//4.20
var storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,__dirname+'./../../../images/ERs')//ers 폴더를 만들고 이 폴더를 static으로 읽어올 수 있게 한다.
    },
    filename:(req,file,cb)=>{
        cb(null,req.decoded.userId+'_'+file.fieldname+path.extname(file.originalname))
    }
})
const upload = multer({storage})


/** 시청자들이 리엑토를 누를때 필요한 정보들을 받아온다. */
router.get('/:streamerId',controller.getReactoSettingForViewer)

router.use('/*',authMiddleware)
//reacto setting을 하는 라우터.
router.put('/',upload.fields([{name:'No1_img'},{name:'No2_img'},{name:'No3_img'},{name:'No4_img'},{name:'No5_img'},{name:'No6_img'},{name:'No1_audio'},{name:'No2_audio'},{name:'No3_audio'},{name:'No4_audio'},{name:'No5_audio'},{name:'No6_audio'}]),controller.setReactoSetting)

//reacto button을 위한 라우터
//reacto setting 정보를 받아와서 클라이언트에게 보내준다.
router.get('/',controller.getReactoSettingForStreamer)

module.exports =router