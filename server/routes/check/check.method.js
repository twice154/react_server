/**
 *  @file	auth.method.js 
 *  @brief	유저 인증에 사용하는 함수들을 정의
 *  @author	DotOut Inc, KKS
 *
 *  @see	return new Promise - 아래 함수들은 모두 Promise 객체를 리턴한다. \n
 *			따라서 어떤 함수로든 Promise Chain을 시작할 수 있다. \n
 *
 *			아래 문서에서 유저정보를 저장하는 이름 user와 info는 아래 기준으로 구분한다. \n
 *			* user - 위 문서에서 user는 DB에서 가져온 데이터 원본 혹은 수정본을 의미한다. \n
 *					DB에 있는 모든 property가 인자로 딸려오지만, 해당 문서에서는 꼭 필요한 property 설명만 기재\n
 *			* info - 위 문서에서 info는 사용자가 작성하여 POST로 보낸 정보들의 묶음을 의미한다. \n
 *			User객체 - 쿼리를 이용하여  유저 DB에 직접 접근하도록 만들어진 모델이다. \n
 *			위 문서에서 정의된 함수들은 User객체의 함수를 불러 간접적으로 DB에 접근한다.
 *
 *  @todo	작업하는 중 필요한 라우터가 생기면 거기에 맞춰 새 함수 생성
 */

const User = require('../../models/user')
const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
/**
 *  @brief  암호가 일치하는지 확인하는 함수
 * 
 *  @param	{Object}	user 	- DB에서 찾은 정보,
 *    @property	{String} 	password	- DB에서 검색해온 암호의 SHA256 해쉬 값, 비밀번호 대조를 위해 사용 
 *  @param	{Object}	info	- 유저가 입력한 정보.
 *    @property	{String}	password	- 사용자가 암호 확인을 위해 보낸 String 형태의 암호의 raw값
 * 
 *  @return	Promise
 *    @resolve	{Object}	- 두 암호가 같을 경우 실행, 다음 Promise에 user 객체 전달
 *    @reject	{String}	- 두 암호가 다를 경우 실행, error throw
 * 
 *  @todo	에러핸들러가 완성되면 맞춰서 throw 내용 변경
 * 			보안을 위해 추후 String이 아니라 또 다른 암호화 과정으로 패스워드를 전달받도록 보완
 */
exports.check = (user, info) => {
    return new Promise((res, reject) => {
		if(!user){
			console.log('no User')
			reject({
				success: false,
				status: 200,
				message: "ID or password was incorrect"
			})
		}else{
			if(User.verify(user, info)){
				res({
					success: true,
					status: 200,
					message: "correct password"})
			} else{
				console.log('password error')
				reject({
					success: false,
					status: 200,
					message: "ID or password was incorrect"
				})
			}
		}
    })
}
