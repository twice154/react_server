
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
const create = require('./auth.method').create
const tokenize = require('./auth.method').tokenize
const sendmail = require('./auth.method').sendmail
const check = require('./auth.method').check
const _verify = require('./auth.method').verify
const modify = require('./auth.method').modify
const _del = require('./auth.method').del
const respond = require('./auth.method').respond
const secret = require('../../config').secret
const secret2 = "ChocoPi"
const tempTokenize = require('./auth.method').tempTokenize


/**
 *  @brief  회원가입(유저생성) \n
 *  @param	res.body	- 	property에 대한 설명은 생략
 *    @property	{String}	userId
 *    @property {String}	password
 *    @property {String}	email
 *    @property {String}	phone
 *    @property {String}	name
 *    @property {String}	nickname
 *    @property {Date}		birth
 * 
 *  @return	No Return
 *  @deprecated	onError - 에러핸들링 함수 따로 제작 \n
 */
exports.register = (req, res) => {
	console.log(1)
	const info = req.body


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
	.then(user => tempTokenize(user, secret))
	.then(user => sendmail(user))
	.then(msg => respond(res, msg))		
	.catch(onError)
}

/**
 *  @brief  유저인증(email)을 위한 라우터. 클라이언트에서 이 api에 직접 접속하고 인증에 성공하면 login페이지로 리다이렉트 된다.
 *  @param	req.decoded
 *    @property	{String}	userId		- 토큰에서 검출한 유저의 ID
 *
 *  @return	No Return
 * 
 *  @see	req: 해당 req는 auth 미들웨어에서 전달받은 결과. req.userId와 req.token에 값이 추가되어 전달된다.
 */
exports.veri = (req, res) => {
	const onError = (error) => {
		res.status(409).json({
			message: error.message
		})
	}
	const toLogin = (res) => {
		console.log('tologin')
		return Promise(res.redirect('http://localhost:4000/login'))
	}

	//
	//  Promise Chain
	//
	var info={}			
	info.userId = req.decoded.userId
	console.log(req.decoded)
	console.log(Date.now())
	User.findOneByUserid(info)
	.then(user => _verify(user))
	.then(user => modify(user,{verified: true}))
	.then(user => toLogin(res) )
	.catch(onError)
    
}

/**
 *  @brief  회원삭제 (유저 탈퇴) \n
 *  @param	req.decoded
 *	  @property	{String}	userId		- 삭제할 유저의 ID

 *  @return 	No Return \n
 * 
 *  @todo	삭제 유예기간을 넣을 것인가 협의
 * 			삭제시에 더 필요한 정보가 있는지 판단해보기
 */
exports.del = (req, res) => {
    const info = req.decoded
    
    const onError = (error) => {
		res.status(409).json({
	   	 message: error.message
		})
    }
	//
	// Promise Chains
	//
	User.findOneByUserid(info)
	.then(user => _del(user))
	.then(msg => respond(res, msg))
	.catch(onError)
}


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
			var msg = {verified: user.verified, token: user.token}
			return Promise.resolve(msg)
    }
	//
	// Promise Chains
	//
	User.findOneByUserid(info)
	.then( user => check(user, info))
	.then( user => tokenize(user,secret))
	.then( user => temp(user))
	.then( msg=> respond(res,msg) )
	.catch(onError)
}

/**
 *  @brief  아이디 찾기에 사용할 라우터, email을 통해 userId를 알아낸다.
 *  @param	req.body
 *    @property	{String}	name	- 유저의 이름
 *    @property {String}	email	- 유저의 이메일
 *
 *  @return	No Return \n
 * 
 *  @todo	***** 라우터에 연결 필요 *****
 */
exports.findId = (req, res) => {
    const info = req.body
    const findid = (user) => {
		if(!user || user.name != info.name)
			res.status(403).json({
				message: "worng information!"
			})
		else{
			res.json({userId: user.userId})
		}
	}
	
	//
	// Promise Chains
	//
	User.findOneByUseremail(info)
	.then(user => findid(user))

}


/**
 *  @brief  아직 이메일인증이 되지 않은 사용자가 메일을 재전송할 때 사용하게될 라우터
 *  @param	req.body
 *    @property	{String}	userId		- 유저의 아이디
 *    @property {String}	email		- 변경할 유저의 email, 해당 값이 ""이면 email을 변경하지 않는다.
 * 
 *  @return	No Return
 *  @todo	secret2 값을 config으로 빼기
 */
exports.resend = (req, res) => {
	const info = req.body
	const onError = (error) => {
		console.log('error발생')
			res.status(403).json({
			message: error.message
		})
	}
	if(info.email===""){
	    User.findOneByUserid(info)
	    .then(user => tempTokenize(user, secret2))
	    .then(user => sendmail(user))
	    .then(msg => respond(res, msg))		
	    .catch(onError)
	    
	}

	else{
	    User.findOneByUserid(info)
	    .then(user => modify(user, { email: info.email }))
	    .then(user => tempTokenize(user, secret2))
	    .then(user => sendmail(user))
	    .then(msg => respond(res, msg))
	    .catch(onError)
	}


}


/**
 *  @brief  유저 개인정보를 수정할 때 사용할 라우터 \n
 *  @param	req.body
 *	  @property {String}	userId		- 정보를 수정할 유저의 ID
 *    @property {__Type}	<field> 	- 수정할 정보. 두 개 이상의 필드를 넣을 수 없음
 * 									password, email, name, nickname, birth, phone
 *  @return	No Return
 * 
 *  @see	isTrue: 정상적으로 React Server에서 필드 값을 보내면 userId외에 2개 이상의 필드가 존재할 수 없다.
 * 				이런 경우 error throw 해준다.
 * 
 *  @todo	개인정보 수정을 위한 페이지에 임의로 요청을 보내는 등의 작업을 막기 위해 보안 업데이트 필요
 * 
 */
exports.putUserInfo = (req, res) => {
	const onError = (error) => {
		res.status(409).json({
			message: error.message
		})
	}
	const isTrue = (user, info)=>{
		return new Promise( (res,reject) => {
		var input = Object.keys(info)
			if(input.length != 2){
				console.log(input.length)
				throw new Error("worng access")
			}else{
				console.log(input.length)
				res(user)
			}
		})
	}
	
	//
	//  Promise Chain
	//
	var info = req.body
	info.userId = req.decoded.userId

	if(!info.email){
		console.log('일반적인 상황 modify')
		User.findOneByUserid(info)	//토큰에서 검출한 ID를 이용하여 유저 탐색
		.then( user => isTrue(user,info))
		.then( user => modify(user, info))
		.then( ()=>respond(res,"success") )
		.catch(onError)
	}else{
		res.clearCookie("token");
		info.verified = false
		User.findOneByUserid(info)	//토큰에서 검출한 ID를 이용하여 유저 탐색
		.then( user => modify(user, info))
		.then( user => tempTokenize(user, secret))
		.then( user => sendmail(user))
		.then( msg => ()=>res.redirect("http://localhost:4000/login")		)
		.catch(onError)
	}
    
}


/**
 *  @brief  유저 개인정보를 수정할 때 사용할 라우터 \n
 *  @param	req.decoded
 *	  @property {String}	userId		- 정보를 수정할 유저의 ID
 *
 *  @return	No Return
 */
exports.getUserInfo = (req, res) => {
	const onError = (error) => {
		res.status(409).json({
			message: error.message
		})
	}
	const onRespond = (user) => {
		res.json({
			userId: user.userId,
			email: user.email,
			phone: user.phone,
			name: user.name,
			nickname: user.nickname,
			birth: user.birth
		})
	}
	
	//
	//  Promise Chain
	//
	var info = req.body
	info.userId = req.decoded.userId
	
	User.findOneByUserid(info)	//토큰에서 검출한 ID를 이용하여 유저 탐색
	.then( user => onRespond(user) )
	.catch(onError)
    
}



/**
 *  @brief
 *  @param
 *  @return
 */
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


/**
 *  @brief  이메일 중복 체크에 사용할 라우터
 *  @param	req.body
 *    @property {String}	email		- 중복 체크할 유저의 이메일
 *
 *  @return	No Return \n
 */
exports.emailcheck = (req, res) => {
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

/**
 *  @brief  핸드폰번호 중복 체크에 사용할 라우터
 *  @param	req.body
 *    @property {String}	phone		- 중복 체크할 유저의 이메일
 *
 *  @return	No Return \n
 */
exports.phonecheck = (req, res) => {
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
    User.findOneByUserPhone(info)
    .then(user => isEmpty(user))
    .catch(onError)
}


/**
 *  @brief  이메일 중복 체크에 사용할 라우터
 *  @param	req.body
 *    @property {String}	email		- 유저의 이메일
 *
 *  @return	No Return \n
 */
exports.userIdcheck = (req, res) => {
    const info = req.body;
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
  

/**
 *  @brief  개인정보 수정 및 기타 패스워드 확인 작업을 위한 라우터
 *  @param	req.body
 *    @property	{String}	userId			- 유저의 아이디
 *    @property {String}	password		- 유저의 패스워드
 *
 *  @return	No Return \n
 * 
 *  @todo	respond - respond를 위한 함수를 생성한 뒤 처리하도록 해야함 \n
 * 			암호를 그대로 전송하는 것은 위험하기 때문에 보안을 위해 추가적인 처리가 필요
 */
exports.verified = (req, res) => {
	const info = req.body
	info.userId = req.decoded.userId
    const onError = (error) => {
		console.log('error발생')
	res.status(403).json({
	    message: error.message
	})
}
	//
	// Promise Chains
	//
	User.findOneByUserid(info)	
	.then(user => check(user, info))
	.then(user => respond(res, "success") )
	.catch(onError)
}



/**
 *  @brief  비밀번호 변경 링크를 보내준다
 *  @param	req.decoded
 *	  @property {String}	userId			- 유저의 ID
 *	  @property {date}		date			- 토큰이 발행된 시간
 *  @return	No Return
 *  @todo	***** 비밀번호 변경 페이지 만들어지면 리다이렉트 url 연결 *****
 */
exports.putPassword = (req, res) => {
	var info={}			
	info.userId = req.decoded.userId
	const time = (req.decoded.dat - Date.now())/1000
	const onError = (error) => {
		res.status(409).json({
			message: error.message
		})
	}
	
	const toSettingsPassword = (res) => {
		console.log('tologin')
		return Promise(res.redirect('localhost:4000/login'))
	}
	const timeCheck = (user, time) => {
	    return new Promise( (res, reject) => {
		if(time > 300)
			throw new Error("The time goes on~~")
		else
			res(user)
	    })

	}
	var info={}	
	info.userId = req.decoded.userId	//Token검증 Middleware를 통과하고 나면 req.decoded에 해당 토큰의 정보가 들어있다.
	var elasped = (req.decoded.date - Date.now())/1000


	//
	//  Promise Chain
	//
	User.findOneByUserid(info)
	.then(user => timeCheck(user, elasped))
	.then(user => toSettingsPassword(res) )
	.catch(onError)
    
}
