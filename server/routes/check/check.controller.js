
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
import url from 'url'

const User = require('../../models/user')	//Module for user database
const check = require('./check.method').check


/**
 *  @brief  이메일 중복 체크에 사용할 라우터
 *  @param	req.body
 *    @property {String}	email		- 중복 체크할 유저의 이메일
 *
 *  @return	No Return \n
 */
exports.emailcheck = (req, respond) => {
    var urlParameter = url.parse(req.url).pathname.split('/')
    const info = {email: urlParameter[3]}
    const isEmpty = ( user ) =>{
        return new Promise( (res, reject) => {
                if(!user || !user.email)
                    respond.json({success:true})
                else
                    reject({
                        success: false,
                        status: 200,
                        message: "email exist"
                    })
            })
    }
    const onError = (error) => {
        respond.status(error.status).json({
            success: error.success,
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
exports.phonecheck = (req, respond) => {
    var urlParameter = url.parse(req.url).pathname.split('/')
    const info = {phone: urlParameter[3]}
    const isEmpty = ( user ) =>{
        return new Promise( (res, reject) => {
            if(!user || !user.phone)
                respond.json({success:true})
            else
                reject({
                    success: false,
                    status: 200,
                    message: "phone exist"
                })
        })
    }
    const onError = (error) => {
        respond.status(error.status).json({
            success: error.success,
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
exports.userIdcheck = (req, respond) => {
    var urlParameter = url.parse(req.url).pathname.split('/')
    const info = {userId: urlParameter[3]}
    const isEmpty = ( user ) =>{
        console.log(user)
        return new Promise( (res, reject) => {
            if(!user || !user.userId)
                respond.json({success:true})
            else
                reject({
                    success: false,
                    status: 200,
                    message: "userId exist"
                })
        })
    }
    const onError = (error) => {
        respond.status(error.status).json({
            success: error.success,
            message: error.message
	    })
    }
    User.findOneByUserid(info)
    .then(user => isEmpty(user))
    .catch(onError)
}

/**
 *  @brief  닉네임 중복 체크에 사용할 라우터
 *  @param	req.body
 *    @property {String}	nickname		- 유저의 닉네임
 *
 *  @return	No Return \n
 */
exports.nicknamecheck = (req, respond) => {
    var urlParameter = url.parse(req.url).pathname.split('/')
    const info = {userId: urlParameter[3]}
    console.log(info)
    const isEmpty = ( user ) =>{
        return new Promise( (res, reject) => {
            if(!user || !user.userId)
                respond.json({success:true})
            else
                reject({
                    success: false,
                    status: 200,
                    message: "nickname exist"
                })
        })
    }
    const onError = (error) => {
        respond.status(error.status).json({
            success: error.success,
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
exports.passwordcheck = (req, res) => {
	const info = {}
    info.userId = req.decoded.userId
    info.password = new Buffer(req.query.password, 'base64').toString()
    
        const onError = (error) => {
            console.log(error)
            res.status(error.status).json({
                success: error.success,
                message: error.message
            })   
    }
	//
	// Promise Chains
	//
	User.findOneByUserid(info)	
	.then(user => check(user, info))
	.then(msg => onError(msg) )
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
exports.tokencheck = (req, res) => {
    const info = {}
    info.userId = req.decoded.userId
	const time = (Date.now()-req.decoded.date)/1000
   
        const onError = (error) => {
            res.status(error.status).json({
                success: error.success,
                message: error.message,
                data: error.data
            })
        }

	const timeCheck = (user, time) => {
	    return new Promise( (resolve, reject) => {
			if(time > 300)
                reject({
                    success: false,
                    status: 403,
                    message: "This token was expired"
                })
			else
                resolve({
                    success: true,
                    status: 200,
                    message: "correct token",
                    data: {userId: user.userId}
                })

        })
    }
	//
	// Promise Chains
	//
	User.findOneByUserid(info)	
	.then(user => timeCheck(user, time))
	.then(msg => onError(msg) )
	.catch(onError)
}
