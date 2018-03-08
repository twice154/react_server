
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
const create = require('./recovery.method').create
const tokenize = require('./recovery.method').tokenize
const sendmail = require('./recovery.method').sendmail
const check = require('./recovery.method').check
const _verify = require('./recovery.method').verify
const modify = require('./recovery.method').modify
const _del = require('./recovery.method').del
const respond = require('./recovery.method').respond
const secret = require('../../config').secret
const secret2 = "ChocoPi"
const tempTokenize = require('./recovery.method').tempTokenize


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
exports.recoveryId = (req, res) => {
	const info = req.body
	var urlParameter = url.parse(req.url).pathname.split('/')
	
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
exports.recoveryEmail = (req, res) => {
	const info = req.body
	const ifChange = req.query.change
	
	const queryCheck = (ifChange) => {
		return new Promise((resolve, reject) =>{
			switch(true){
				case info.email == undefined:
					reject({
						success: false,
						status: 400,
						message: "email field did not exist"
					})
					break;
				case ifChange == undefined:
					reject({
						success: false,
						status: 400,
						message: "change query did not exist"
					})
					break;
				case (ifChange == 'false' && info.email==""):
					resolve({userId: info.userId})
					break;
				case (ifChange == 'true' && info.email!=""):
					resolve({
						userId: info.userId,
						email: 	info.email
					})
					break;
				default:
					reject({
						success: false,
						status: 400,
						message: "Something worng in query check"
					})
					break;
				}

			})

	}
	const onError = (error) => {
		res.status(error.status).json({
			success: error.success,
	    	message: error.message
		})
	}
	
	
		queryCheck(ifChange)
	    .then(info => User.findOneByUserid(info))
	    .then(user => modify(user, { email: info.email }))
	    .then(user => tempTokenize(user, secret2))
	    .then(user => sendmail(user))
	    .then(msg => res.json({success:true}))
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
exports.recoveryPassword = (req, res) => {
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
