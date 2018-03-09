/**
 *  @file 	index.js
 *  @brief 	Router for authentication \n
 *  @author 	DotOut Inc, KKS
 */


const router = require('express').Router()
const authMiddleware = require('../../middlewares/auth')
const controller = require('./auth.controller')


router.post('/*',controller.postAuth)
router.delete('/', controller.deleteAuth);


module.exports = router