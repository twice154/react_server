
/**
 *  @file       index.js
 *  @brief      라우터에서 받은 요청을 처리한다. \n
 *		어떠한 요청을 처리하는지는 아래 모듈별로 설명\n
 *  @author     DotOut Inc, KKS
 *  @see	Promise Chain - 각각 묘듈에서 실제 작업은 나누어 작성된 함수들에 의해 실행된다. \n
 *			해당 함수들은 Promise를 리턴하므로 Promise Chain을 써서 동기형으로 실행시킨다. \n
 *  @todo		에러핸들러 작성
 *				secret2 부분 config으로 빼기
 */
import jwt from 'jsonwebtoken'
import url from 'url'
const User = require('../../models/user')	//Module for user database
const create = require('./users.method').create
//const tokenize = require('./users.method').tokenize
const sendmail = require('./users.method').sendmail
//const check = require('./users.method').check
//const _verify = require('./users.method').verify
const modify = require('./users.method').modify
const _del = require('./users.method').del
const respond = require('./users.method').respond
const secret = require('../../config').secret
const secret2 = "ChocoPi"
const tempTokenize = require('./users.method').tempTokenize
const fieldCheck = require('./users.method').fieldCheck





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
exports.postUsers = (req, res) => {
	const info = req.body
	const num = Object.keys(info).length
	console.log(num)
	const fullfillCheck = (info) => {
		return new Promise( (res, reject) =>{
			var empty = ""
			if( info.userId == undefined ){
				empty = "userId"
			}
			else if(info.password == undefined){
				empty = "password"
			}
			else if(info.email == undefined){
				empty = "email"
			}
			else if(info.phone == undefined){
				empty = "phone"
			}
			else if(info.name == undefined){
				empty = "name"
			}
			else if(info.gender == undefined){
				empty = "gender"
			}
			else if(info.birth == undefined){
				empty = "birth"
			}
			if(empty =="")
				res(info)
			else
				reject({
					success: false,
					status: 400,
					message: "There is blanked field"
				})	
		})
	}
	//for error catch
	const onError = (error) => {
		res.status(error.status).json({
			success: error.success,
			message: error.message
		})
	}
	//
	//   Promise Chain
	//
	fullfillCheck(info)
	.then(info => User.findOneByUserid(info))
	.then(user => create(user,info))
	.then(user => tempTokenize(user, secret))
	.then(user => sendmail(user))	
	.catch(onError)
}





/**
 *  @brief  회원삭제 (유저 탈퇴) \n
 *  @param	req.decoded
 *	  @property	{String}	userId		- 삭제할 유저의 ID

 *  @return 	No Return \n
 * 
 *  @see	if(req.params != info.userId)	- url 파라미터로 온 userId와 토큰의 userId가 다르면 error 처리
 *  @todo	삭제 유예기간을 넣을 것인가 협의
 * 			삭제시에 더 필요한 정보가 있는지 판단해보기
 */
exports.deleteUsers = (req, res) => {
	const info = req.body
	var urlParameter = url.parse(req.url).pathname.split('/')
	
	const onError = (error) => {
		res.status(error.status).json({
			success: error.success,
			message: error.message
		})
	}
	//
	// Promise Chains
	//
	if(urlParameter[1] == info.userId){
		User.findOneByUserid(info)
		.then(user => _del(user))
		.then(msg => (msg)=>{res.json(msg); res.clearCookie("token");})
		.catch(onError)
	}
	else{
		res.status(404).json({
			success: false,
			message: "URL was not match to field"
		})
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
exports.putUsers = (req, res) => {
	var infos={}
	//info.userId = req.decoded.userId
	var urlParameter = url.parse(req.url).pathname.split('/')

	urlParameter[1]	//userId
	urlParameter[2] //field
	
	const onError = (error) => {
		res.status(error.status).json({
			success: error.success,
			message: error.message
		})
	}
	const temp = (info) =>{
		return new Promise((res,reject)=>{
			info.userId = req.decoded.userId
			infos = info
			res(info)	
		})
	}
	
	//
	//  Promise Chain
	//
	fieldCheck(req.body, urlParameter[2])
	.then(info => temp(info))
	.then(info => User.findOneByUserid(info))
	.then( user => modify(user, infos))
	.then( ()=> respond.json({success:true}))
	.catch(onError)
}


/**
 *  @brief  유저 개인정보를 가져올 때 사용할 라우터 \n
 *  @param	req.decoded
 *	  @property {String}	userId		- 정보를 수정할 유저의 ID
 *
 *  @return	No Return
 */
exports.getUsers = (req, res) => {
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

