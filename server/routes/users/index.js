/**
 *  @file 	index.js
 *  @brief 	Router for authentication \n
 *  @author 	DotOut Inc, KKS
 */


const router = require('express').Router()
const usersMiddleware = require('../../middlewares/users')
const controller = require('./users.controller')


/*
 * @brief - 회원가입을 위한 라우터
**/
router.post('/*', controller.postUsers)

router.use('/*', usersMiddleware)
router.get('/*', controller.getUsers)
router.delete('/*', controller.deleteUsers)
router.put('/*', controller.putUsers)


module.exports = router
