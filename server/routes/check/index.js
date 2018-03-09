/**
 *  @file 	index.js
 *  @brief 	Router for authentication \n
 *  @author 	DotOut Inc, KKS
 *  
 */


const router = require('express').Router()
//const authMiddleware = require('../../middlewares/auth')
const controller = require('./check.controller')


/*
 * @brief - 이메일 중복 체크를 위한 라우터
**/
router.get('/duplication/email/*', controller.emailcheck)


/*
 * @brief - 유저 중복 체크를 위한 라우터
**/
router.get('/duplication/userid/*', controller.userIdcheck)


/*
 * @brief - 유저 중복 체크를 위한 라우터
**/
router.get('/duplication/phone/*', controller.phonecheck)



module.exports = router
