/**
 *  @file 	index.js
 *  @brief 	Router for authentication \n
 *  @author 	DotOut Inc, KKS
 *  
 */


const router = require('express').Router()
const authMiddleware = require('../../middlewares/auth')
const controller = require('./recovery.controller')



/*
 * @brief -
**/
router.get('/',(req,res)=>{res.json({success:'hello'})})
router.get('/userId/*', controller.recoveryId)
router.put('/password',controller.recoveryPassword)
router.put('/email',controller.recoveryEmail)

module.exports = router
