/**
 *  @file 	index.js
 *  @brief 	Router for authentication \n
 *  @author 	DotOut Inc, KKS
 */


const router = require('express').Router()
const usersMiddleware = require('../../middlewares/users')
const controller = require('./users.controller')


router.post('/*', controller.postUsers)

router.use('/*', usersMiddleware) //url의 파라미터로 userId를 넣어주어야 한다.// 왜? 그럴 필요 없음.
router.get('/*', controller.getUsers)
router.delete('/*', controller.deleteUsers)
router.put('/*', controller.putUsers)


module.exports = router
