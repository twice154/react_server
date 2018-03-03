/**
 *  @file 	index.js
 *  @brief 	Router for authentication \n
 *  @author 	DotOut Inc, KKS
 *  
 *  @todo 	아이디찾기 ( v ) \n
 *		비번찾기   (  ) \n
 *		정보 수정  ( v ) \n
 * 		중복체크   ( v ) \n
 *		메일 재전송( v ) \n
 *		함수 정리  (  ) \n	
 */


const router = require('express').Router()
const authMiddleware = require('../../middlewares/auth')
const controller = require('./auth.controller')


/*
 * @brief - 회원가입을 위한 라우터
**/
router.post('/signup', controller.register)


/*
 * @brief - 로그인을 위한 라우터
 * @res - token
**/
router.post('/signin',controller.login)

/*
 * @brief - 이메일 중복 체크를 위한 라우터
**/
router.post('/emailcheck', controller.emailcheck)


/*
 * @brief - 유저 중복 체크를 위한 라우터
**/
router.post('/userIdcheck', controller.userIdcheck)


/*
 * @brief - 
**/
router.use('/userInfo', authMiddleware)
router.delete('/userInfo', controller.del)
router.put('/userInfo', controller.putUserInfo)
router.get('/userInfo', controller.getUserInfo)


/*
 * @brief -
**/
router.use('/verify', authMiddleware)
router.get('/verify', controller.veri)


/*
 * @brief -
**/
router.use('/verified', authMiddleware)
router.post('/verified', controller.verified)


/*
 * @brief -
**/
router.post('/findId', controller.findId)


/*
 * @brief -
**/
router.post('/resend', controller.resend)


/*
 * @brief -
**/
router.use('/getinfo', authMiddleware)


/*
 * @brief -
**/
router.get('/getinfo', controller.getinfo)


/*
 * @brief -
**/
router.post('/logout', (req, res)=>{
	res.clearCookie("token");
	return res.json({success: true});
});


module.exports = router
