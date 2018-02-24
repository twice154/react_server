/**
 *  @file 	index.js
 *  @brief 	Router for authentication \n
 *  @author 	DotOut Inc, KKS
 *  
 *  @todo 	아이디찾기 (  ) \n
 *		비번찾기   (  ) \n
 *		정보 수정  (  ) \n
 * 		중복체크   (  ) \n
 *		메일 재전송(  ) \n
 *		함수 정리  (  ) \n	
 */


const router = require('express').Router()
const authMiddleware = require('../../middlewares/auth')
const controller = require('./auth.controller')
router.post('/signup', controller.register)

router.post('/signin',controller.login)

router.post('/emailcheck', controller.emailcheck)
router.post('/userIdcheck', controller.userIdcheck)

router.use('/del', authMiddleware)
router.post('/del', controller.del)

router.use('/verify', authMiddleware)
router.get('/verify', controller.verify)

router.use('/getinfo', authMiddleware)
router.get('/getinfo', controller.getinfo)

router.post('/logout', (req, res)=>{
	res.clearCookie("token");
	return res.json({success: true});
});
module.exports = router