const router = require('express').Router()
const controller = require('./reacto.controller')

//reacto button을 위한 라우터
router.get('/button',controller.button)
//donation을 위한 라우터
router.post('/donation',controller.donation)
//thumbnail받아오기
router.get('/thumbnail',controller.thumbnail)

module.exports =router