
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
const sendmail_email = require('./recovery.method').sendmail_email
const sendmail_password = require('./recovery.method').sendmail_password
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
 *  @param	req.params
 *    @property	{String}	name	- 유저의 이름
 *    @property {String}	email	- 유저의 이메일
 *
 *  @return	No Return \n
 * 
 *  @todo	***** 라우터에 연결 필요 *****
 */
exports.recoveryId = (req, res) => {
	info.email = new Buffer(req.query.email, 'base64').toString()
    info.name = new Buffer(req.query.name, 'base64').toString()
    
	const findid = (user, info) => {
		if(!user || user.name != info.name)
			reject({
				success: false,
				status: 200,
				message: "incorrect information"
			})
		else{
			res({
				success: true,
				status: 200,
				data:	{userId: user.userId}
			})
		}
	}

	
	const onError = (error) => {
		res.status(error.status).json({
			success: error.success,
	    	message: error.message
		})
	}


	//
	// Promise Chains
	//
	User.findOneByUseremail(info)
	.then(user => findid(user, info))
	.then(msg => onError(msg))
	.catch(onError)
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
	    .then(user => sendmail_email(user))
	    .then(msg => res.json({success:true}))
	    .catch(onError)
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
exports.recoveryPassword = (req, res) => {
	const info = req.body
	
	const fieldCheck = (user, info) => {
		return new Promise((resolve, reject) =>{
			switch(true){
				case (user==undefined || user.userId==undefined):
					reject({
						success: false,
						status: 200,
						message: "not exist user"
					})
				break;
				case info.email == undefined:
					reject({
						success: false,
						status: 400,
						message: "email field did not exist"
					})
					break;
				case info.email != user.email:
					reject({
						success: false,
						status: 200,
						message: "not correct ID or email"
					})
					break;
				case info.email == user.email:
					resolve(user)
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
	
		User.findOneByUserid(info)
		.then(user => fieldCheck(user, info))
	    .then(user => tempTokenize(user, secret2))
	    .then(user => sendmail_password(user))
	    .then(msg => onError(msg))
	    .catch(onError)
}
