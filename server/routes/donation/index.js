const router = require('express').Router()
const controller = require('./donation.controller')
const authMiddleware = require('../../middlewares/auth')


router.get('/thumbnail',controller.thumbnail)

router.use('/*',authMiddleware)

router.get('/token',controller.getToken)

router.get('/setting',controller.getSettings)

router.put('/setting',controller.setSettings)

router.get('/streamsocketid',controller.getStreamSocketId)
//donation을 위한 라우터
router.post('/donation/:streamerId',controller.donation)

module.exports =router