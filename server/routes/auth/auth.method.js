/**
 *  @file	auth.method.js 
 *  @brief	유저 인증에 사용하는 함수들을 정의
 *  @author	DotOut Inc, KKS
 *
 *  @see	return new Promise - 아래 함수들은 모두 Promise 객체를 리턴한다. \n
 *			따라서 어떤 함수로든 Promise Chain을 시작할 수 있다. \n
 *		아래 문서에서 유저정보를 저장하는 이름 user와 info는 아래 기준으로 구분한다. \n
 *		user - 위 문서에서 user는 DB에서 가져온 데이터 원본 혹은 수정본을 의미한다. \n
 *		info - 위 문서에서 info는 사용자가 작성하여 POST로 보낸 정보들의 묶음을 의미한다. \n
 *		User객체 - 쿼리를 이용하여  유저 DB에 직접 접근하도록 만들어진 모델이다. \n
 *			위 문서에서 정의된 함수들은 User객체의 함수를 불러 간접적으로 DB에 접근한다.
 *
 *  @todo	작업하는 중 필요한 라우터가 생기면 거기에 맞춰 새 함수 생성
 */


const User = require('../../models/user')
const express = require('express')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const app = express()
const Conf = require('./mailconfig')
const mailConfig = Conf.mailConfig
const smtpTransport = nodemailer.createTransport(Conf.smtpConfig)


/**
 *  @brief  암호가 일치하는지 확인하는 함수
 *  @param	JSON user - DB에서 찾은 정보
 *  @param	JSON info - 유저가 입력한 정보. info.password만 의미를 가짐
 *  @return	Promise - 암호가 맞을 경우 다음 Promise에 user 전달
 *			- 암호가 틀릴 경우 error throw
 *  @todo	에러핸들러가 완성되면 맞춰서 throw 내용 변경
 */
exports.check = (user, info) => {
    return new Promise((res, reject) => {
	if(!user){
	    throw new Error('login failed')
	}else{
		//when password was corrected
		//if error did not exist, respond token to next promise function
		if(User.verify(user, info)){
			console.log('then..')
			res(user)
		} else{
		    //password incorrection
		    throw new Error('login failed')
		}
	}
    })
}

/**
 *  @brief  유저 정보를 DB에서 삭제하는 함수
 *  @param	JSON user - DB에서 찾은 정보. user.userId만 의미를 가짐
 *  @return	Promise
 *  @todo	에러핸들러가 완성되면 에러처리 코드 삽입
 *		예외처리구문 삽입
 */
exports.del = (user) => {
    return new Promise( (res,reject) => {
	return User.del(user)
    })
}


/**
 *  @brief  유저의 id와 닉네임 정보를 토대로 토큰을 발행하는 함수
 *  @param	JSON user - DB에서 찾은 정보. user.userId와 user.nickname만 의미를 가짐
 *  @param	string secret - config에 저장되어있는 토큰의 해싱키
 *  @return	Promise - 토큰이 정상적으로 발행되었을 경우 다음 Promise에 user를 넘겨줌
 *			이 때, user.token에 발급받은 token정보를 추가하여 넘겨준다.
 *			- 토큰 발생과정에서 오류가 생기면 error throw
 *  @todo	payload부분 나중에 수정하기
 *		에러핸들러 작성 후 에러 처리부분 다시 짜기
 *  @deprecate	nickname이 필요없다고 생각되면 지우기
 */
exports.tokenize = (user, secret) => {
    return new Promise((res, reject) => {
	console.log('start tokenize')
	jwt.sign(
	    {
		userId: user.userId,
		verified: user.verified
	    },
	    secret,
	    {
		issuer:	'sprout.io' ,//TODO: what is our domain?!
		subject: 'UserInformation'
	    }, (err, token) => {
		if(err) console.log(err)
		else{
		user.token = token
		res(user)}
	    })
    })
}



/**
 *  @brief  유저 정보를 수정할 때 쓰는 함수
 *  @param	JSON user - user객체에 저장된 정보대로 DB내용이 갱신됨. 아래 필드중 하나라도 없으면 실행되지 않음
 *			{ userId, nickname, birth, gender password, email, phone }
 *  @return	Promise - 제대로 실행되면 다음 프로미스로 메세지 전달
 *			- 필드 내용이 존재하지 않는경우 수정하지 않고 다음 프로미스 진행
 *  @todo	예외처리 다듬기, 에러핸들러 적용
 *		필드 내용이 존재하지 않을 경우 DB내용을 갱신하지 않는 것으로 처리하기
 *		함수가 제대로 실행되었을 때 String 메세지가 아닌 respond에서 처리가능한 인자로 넘기기
 */
exports.modify = ( user, info ) => {
    return new Promise((res, reject) => {
	console.log('modifying')
	    User.update(user, info)
	    .then((user)=>{res(user)})
    })
}



/**
 *  @brief  계정 활성화를 위한 함수
 *  @param	JSON user - Verified 필드를 보고 
 *  @returna	Promise - 이미 Verified 되있는 계정이면 다음 Promise로 이미 승인된 유저라고 메세지를 보낸다.
 *			- user의 Verified가 false이면 true로 바꾼 뒤 다음 Promise로 user 객체를 넘겨준다.
 *  @todo	이미 Verified된 경우 메세지를 다음 Promise로 보내는 것이 아니라 error throw 하도록 바꿔야한다.
 */
exports.verify = ( user ) => {
    return new Promise((res, reject) => {
	if(user.verified === true)
	    res()
	else{
	    user.verified = true
	    res(user)
	}
    })
}

/**
 *  @brief  유저를 생성하는 함수이다.
 *  @param	JSON user - DB에서 SELECT해온 유저의 정보이다. 만약 SELECT결과 유저가 없다면 모든 필드값은 undefined가 될 것이다.
 *  @param	JSON info - 사용자가 입력한 DB 내용이다.
 *  @return	Promise - 사용자가 입력한 정보인 info를 다음 Promise로 보낸다.
 *			이미 있는 계정이면 throw error 시킨다.
 *  @todo	에러 핸들러를 만들어 에러 처리 통합하기
 *		아이디가 중복되었을 때 외에 다른 예외 경우 추가하기
 */

exports.create = function (user,info){
    return new Promise( function(res){
	//TODO:if user's verification was not successed
	if(user&&user.userId) {
		console.log(user.userId + ' was already registered')
		throw new Error('username exists')
	}
	/*
	else if(){
	
	}
	*/
	else {
		console.log('create in create.js')
		User.create(info).then(()=>{res(info)})
	}
    })
}

/**
 *  @brief  유저에게 토큰을 링크에 포함하여 메일을 발송하는 함수
 *  	    현재 호스트는 125.133.241.232:8005로 되어있음.
 *  @param  	JSON info - 회원가입할 때 사용한 유저 정보를 그대로 받아온다.
			앞에서 token화 과정을 거쳐 전달해줘야하기 때문에 DB의 내용에 token 필드도 추가되어야한다.
 *  			{ token, email, userId } 세 개의 필드는 필수적이다.
 *  @return	Promise - 다음 Promise로 보내는 정보는 String의 메세지
 *  @todo	- 유효번호로 메일 인증받는 시스템 생각해보기(할지 안할지 다시 얘기해보기)
 *		- respond 함수가 완성되면 다음 Promise로 보낼 내용 수정하기
 *		- 에러핸들러 완성하면 에러 처리
 */
exports.sendmail = (info) => {
    return new Promise((res, reject) => {
	var host = '125.133.241.232:8005'
	var link = "http://" + host + "/api/account/verify?token="+info.token;
	mailConfig.html = "<a href="+link+">Click</a>"
	mailConfig.to = info.email

	smtpTransport.sendMail(mailConfig, (error, response) => {
		if(error){
			console.log(error);
			reject("error");
		}else{
			console.log("Message sent: " + mailConfig.to);
			res({msg:"Mail Sent!"+info.userId});
		}
	});
    })
};


/**
 *  @brief  React서버로 직접 성공 메세지를 전달하는 함수
 *  @param	String msg - 현재는 String의 msg를 받는다. 받은 메세지를 그대로 전달해줌
 *  @return	No returns
 *  @todo	받은 메세지에 따라 다르게 작업할지 통일할지 정하기
 */
//respond 함수는 작업이 성공했을 때 실행된다
//따라서 Success: true와 함께 메시지를 보냄
exports.respond = (res, msg) => {
	return res.json(msg)
	
}
