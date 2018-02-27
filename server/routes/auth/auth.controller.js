
/**
 *  @file       index.js
 *  @brief      라우터에서 받은 요청을 처리한다. \n
 *		어떠한 요청을 처리하는지는 아래 모듈별로 설명\n
 *  @author     DotOut Inc, KKS
 *  @see	Promise Chain - 각각 묘듈에서 실제 작업은 나누어 작성된 함수들에 의해 실행된다. \n
			해당 함수들은 Promise를 리턴하므로 Promise Chain을 써서 동기형으로 실행시킨다. \n
 *  @todo       아이디찾기 (  ) \n
 *              비번찾기   (  ) \n
 *              정보 수정  (  ) \n
 *              중복체크   (  ) \n
 *              메일 재전송(  ) \n
 *              함수 정리  (  ) \n
 *		에러핸들러 작성
 */
import jwt from 'jsonwebtoken'

const User = require('../../models/user')	//Module for user database
const create = require('./auth.method').create
const tokenize = require('./auth.method').tokenize
const sendmail = require('./auth.method').sendmail
const check = require('./auth.method').check
const _verify = require('./auth.method').verify
const modify = require('./auth.method').modify
const _del = require('./auth.method').del
const respond = require('./auth.method').respond
const secret = require('../../config').secret
/**
 *  @brief  회원가입(유저생성) \n
 *  @param	req.body에 JSON 객체로 정보가 담겨있다. 아래는 해당 필드 \n
 *		{ userId, password, email, phone, name, nickname, birth, gender } /n
 *  @return	No Return \n
 *  @todo	Test - Front End 작업 후 테스트 해보기 \n
 *  @deprecated	onError - 에러핸들링 함수 따로 제작 \n
 */
exports.register = (req, res) => {
	console.log(1)
	const info = req.body
	//const info = { name, nickname, birth, gender, userId, password, email, phone } = req.body
	info.Verify = false
	info._new = true
	//const secret = req.app.get('jwt-secret')


	//for error catch
	const onError = (error) => {
		res.status(409).json({
			message: error.message
		})
	}
	//
	//   Promise Chain
	//
	User.findOneByUserid(info)
	.then(user => create(user,info))
	.then(user => tokenize(user, secret))
	.then(user => sendmail(user))
	.then(msg => respond(res, msg))		
	.catch(onError)
}

/**
 *  @brief  유저인증(email) \n
 *  @param	req.body에 JSON 객체로 정보가 담겨있다. 아래는 해당 필드 \n
 *		{ userId } \n
 *  @return	No Return
 */
exports.verify = (req, res) => {

	const onError = (error) => {
		res.status(409).json({
			message: error.message
		})
	}
	const toLogin = (res) => {
		console.log('tologin')
		return Promise(res.redirect('../../../login'))
	}

	//
	//  Promise Chain
	//
	var info={}			
	info.userId = req.decoded.userId	//Token검증 Middleware를 통과하고 나면 req.decoded에 해당 토큰의 정보가 들어있다.
	
	User.findOneByUserid(info)	//토큰에서 검출한 ID를 이용하여 유저 탐색
	.then(user => _verify(user))	//전달받은 user의 정보를 이용하여 DB내용을 UPDATE시킴. 여기서는 Verified값만 True로 바꿀 예정
	.then(user => modify(user,{verified: true}))
	.then(user => toLogin(res))
	.catch(onError)
    
}

/**
 *  @brief  회원삭제 (유저 탈퇴) \n
 *  @param	req.body에 JSON객체로 정보가 담겨있다. 아래는 해당 필드 \n
 *		{ userId , password } \n
 *  @return 	No Return \n
 *  @todo	삭제 유예기간을 넣을 것인가 협의 \n
 */
exports.del = (req, res) => {
    const info = {userId, password} = req.body
    
    const onError = (error) => {
	res.status(409).json({
	    message: error.message
	})
    }
	//
	// Promise Chains
	//
	User.findOneByUserid(info)
	.then(user =>check(user, info))
	.then(user => _del(user))
	.then(msg => respond(res, msg))
	.catch(onError)
}


/**
 *  @brief  로그인 (토큰발행) \n
 *  @param	req.body에 JSON객체로 정보가 담겨있다. 아래는 해당 필드 \n
 *  		{ userId, password } \n
 *  @return	No Return \n
 *  @see	ifVer의 res.json - token을 필드로 넣어 respond 시켜준다. \n
 *  @todo	respond - respond를 위한 함수를 생성한 뒤 처리하도록 해야함 \n
 *		ifVer - respond의 정의가 끝나면 ifVer도 함수로 따로 빼서 다시 디테일하게 작성 \n
 *  @deprecated temp - 로그인 요청에서 받은 res객체에 쿠키를 추가하기 위해 임시로 만들어둠
 *		    다른 함수로 뺄 수 있으면 빼고 아니라면 이대로 진행
 */
exports.login = (req, res) => {
	console.log(1)
    const info = req.body
    //const secret = req.app.get('jwt-secret')
    const onError = (error) => {
		console.log('error발생')
	res.status(403).json({
	    message: error.message
	})
    }
    const temp = (user) => {
			res.cookie('token', user.token)
			var msg = {verified: user.verified}
			console.log(msg)
			return Promise.resolve(msg)
    }
	//
	// Promise Chains
	//
	User.findOneByUserid(info)		//info의 id를 토대로 유저를 검색 검색된 정보를 user로 전달
	.then(user => check(user, info))	//사용자에게 가져온 info와 DB에서 가져온 user를 비교하여 암호가 맞는지 확인
	.then(user => tokenize(user,secret))	//암호가 맞으면 tokenize함수에 user정보를 전달하고 토큰화시킨다.
	.then( user => temp(user))
	.then( msg=> respond(res,msg) )
	.catch(onError)
}
exports.resend = (req, res) => {
	info = req.body
	const _email = (user, info) =>{
	    return new Promise((res)=>{
		user.email = info.email
		res(user)
	    })
	}
	if(info.email===""){
	    User.findOneByUserid(info)
	    .then(user => tokenize(user, secret))
	    .then(user => sendmail(user))
	    .then(msg => respond(res, msg))		
	    .catch(onError)
	    
	}

	else{
	    User.findOneByUserid(info)
	    .then(user => _email(user, info))
	    .then(user => modify(user))
	    .then(user => tokenize(user, secret))
	    .then(user => sendmail(user))
	    .then(msg => respond(res, msg))
	    .catch(onError)
	}


}




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

exports.emailcheck = (req, res) => {
    console.log('st')
    const info = req.body;
    const isEmpty = ( user ) =>{
	if(!user || !user.email)
	    respond(res, {})
	else
	    throw new Error("Already exist")
    }
    const onError = (error) => {
	res.status(403).json({
	    message: error.message
	})
    }
    User.findOneByUseremail(info)
    .then(user => isEmpty(user))
    .catch(onError)
}
exports.userIdcheck = (req, res) => {
    const info =req.body;
    const isEmpty = ( user ) =>{
	if(!user || !user.userId)
	    respond(res, {})
	else
	    throw new Error("Already exist")
    }
    const onError = (error) => {
	res.status(403).json({
	    message: error.message
	})
    }
    User.findOneByUserid(info)
    .then(user => isEmpty(user))
    .catch(onError)
}
  

