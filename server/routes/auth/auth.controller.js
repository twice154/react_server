
/**
 *  @file       index.js
 *  @brief      라우터에서 받은 요청을 처리한다. \n
 *		어떠한 요청을 처리하는지는 아래 모듈별로 설명\n
 *  @author     DotOut Inc, KKS
 *  @see	Promise Chain - 각각 묘듈에서 실제 작업은 나누어 작성된 함수들에 의해 실행된다. \n
			해당 함수들은 Promise를 리턴하므로 Promise Chain을 써서 동기형으로 실행시킨다. \n
 *  @todo       아이디찾기	( v ) \n
 *              비번찾기	(   ) \n
 *              정보 수정	( v ) \n
 *              중복체크	( v ) \n
 *              메일 재전송	( v ) \n
 *              함수 정리	( v ) \n
 *				에러핸들러 작성
 *				secret2 부분 config으로 빼기
 */
import jwt from 'jsonwebtoken'

const User = require('../../models/user')	//Module for user database
const tokenize = require('./auth.method').tokenize
const check = require('./auth.method').check
const secret = require('../../config').secret


/**
 *  @brief  로그인 (토큰발행) \n
 *  @param	req.body
 *    @property	{String}	userId		- 로그인 할 유저의 ID
 *    @property {String}	password	- 유저의 패스워드
 *
 *  @return	No Return \n
 * 
 *  @todo	respond - respond를 위한 함수를 생성한 뒤 처리하도록 해야함 \n
 * 			암호를 그대로 전송하는 것은 위험하기 때문에 보안을 위해 추가적인 처리가 필요
 * 
 *  @deprecated temp - 로그인 요청에서 받은 res객체에 쿠키를 추가하기 위해 임시로 만들어둠
 *		   		 		다른 함수로 뺄 수 있으면 빼고 아니라면 이대로 진행
 */
exports.postAuth = (req, res) => {
    const info = req.body
    const onError = (error) => {
		res.status(error.status).json({
			success: error.success,
	    	message: error.message
		})
	}
    const temp = (user) => {
		return new Promise( (resolve, reject)=> {
			res.cookie('token', user.token)
			res.json({
				success:	true,
				data:	{verified:	user.verified}
				,token:	user.token
			})
		})
    }
	//
	// Promise Chains
	//
	User.findOneByUserid(info)
	.then( user => check(user, info))
	.then( user => tokenize(user,secret))
	.then( user => temp(user))
	.catch(onError)
}


exports.deleteAuth = (req, res) => {
	res.clearCookie("token");
	return res.json({success: true});
}






/**
 *  @brief
 *  @param
 *  @return
 */
/*
exports.getinfo = (req, res) => {
    let token = req.cookies.token
    if(typeof token === "undefined"){
	return res.status(401).json({
		error: 1
	});
    }
    const p = jwt.verify(token,secret)
    res.json({info: p});
}

*/