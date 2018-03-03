/**
 *  @file	user.js
 *  @brief	User DB에 대한 코드
 *  @author	DotOut Inc, KKS
 *  @todo	추후 User DB손보기
 */




var Promise = require('promise')
var User = {};
var Orientdb = require('orientjs');
var crypto = require('crypto')
var config = require('../config')



//
//  Init OrientDB
//
const server = Orientdb(config.dbServerConfig);
User.db = server.use(config.UserDBConfig)
User.db.open()
console.log('init DB')


/**
 *  @brief  CREATE VERTEX 쿼리 실행 \n
 *  @param	JSON info - DB에 등록할 유저 정보 객체. property에 대한 설명은 생략
 *    @property	String userId
 *    @property String password: 파라미터로 전달되는 password 필드는 암호화되지 않은 raw 데이터
 * 	  @property String name
 * 	  @property String nickname
 * 	  @property Date birth
 *    @property String email
 *    @property String phone
 *    @property Boolean verified
 *    @property Boolean admin
 *
 *  @return Promise
 * 	  @resolve	JSON - 유저 DB가 성공적으로 생성되었을 때 실행, 다음 Promise로 info정보를 넘겨준다.
 *    @reject	String - 파라미터 객체의 필드가 유저 생성에 부적합할 때 실행, 에러핸들러로 에러 정보를 넘겨준다.
 *
 *  @see	nonSatisfied(info): DB에 undefined가 저장되어선 안되므로 정의되지 않은 필드가 있나 검사한다.
 * 			info.password: crypto 함수를 이용하여 password를 암호화한다.
 * 
 *  @todo	현재 토큰의 시크릿 키와 같은 키를 암호화에 사용하고 있음. 이를 분리시켜야함
 * 			orientjs의 쿼리 실행도중 나온 에러를 캐치하지 못함. 에러핸들러를 완성하면 이 부분도 포함해야함
 */
User.create = (info) =>{
    const nonSatisfied = (info) =>{
	if(!info.userId) return "userId"
	else if(!info.password) return "password"
	else if(!info.name) return "name"
	else if(!info.nickname) return "nickname"
	else if(!info.birth) return "birth"
	else if(!info.email) return "email"
	else if(!info.phone) return "phone"
	else if(!info.verified) return "verified"
	else if(!info.admin) return "admin"
	//else if(!info.gender) return "gender"
	else return ""
    }
    info.password = crypto.createHmac('sha1',config.secret)
			.update(info.password)
			.digest('base64')
    info.verified = false
    info.admin = false
    
    return new Promise((res,reject)=>{
		if( nonSatisfied(info) === "" ){
			console.log('create query')
			User.db.query(
				"CREATE VERTEX User SET " +
				"userId='" 	+ info.userId +
				"', password='"	+ info.password +
				"', name='" 	+ info.name +
				"', nickname='" + info.nickname +
				"', birth='" 	+ info.birth +
				"', email='" 	+ info.email +
				"', phone='" 	+ info.phone + 
				"', verified='"	+ info.verified +
				"', admin='"	+ info.admin +
				//"', gender='" + info.gender +
				"'")
			res(info)
	//  		.catch(onError)
		}else{
			console.log('wrong')
			reject()
		}
    })
}



/**
 *  @brief  UPDATE 쿼리 실행, user 객체에 info 객체의 내용을 덮어 쓴 뒤 이를 토대로 DB를 갱신한다.
 *  @param	JSON user - DB에서 검색한 기존 유저의 정보
 * 	  @property	String userId: 정보를 갱신할 유저의 ID, 쿼리의 where문에 사용한다.
 *  @param	JSON info - DB에 업데이트할 유저의 새 정보 객체. property에 대한 설명은 생략
 *    @property String password: 파라미터로 전달되는 password 필드는 암호화되지 않은 raw 데이터
 * 	  @property String name
 * 	  @property String nickname
 * 	  @property Date birth
 *    @property String email
 *    @property String phone
 *    @property Boolean verified
 *
 *  @return Promise
 * 	  @resolve	JSON - 유저 DB가 성공적으로 업데이트 되었을 때 실행, 다음 Promise로 info정보를 넘겨준다.
 *    @reject	String - 유저 DB의 업데이트에 실패했을 때 실행, 에러핸들러로 에러 정보를 넘겨준다.
 *
 *  @see	info.password: crypto 함수를 이용하여 password를 암호화한다.
 * 			userID와 admin 속성은 일반적으로 사용자가 바꿀 필요가 없으므로 해당 필드는 업데이트에서 제외함
 * 	
 *  @todo	현재 토큰의 시크릿 키와 같은 키를 암호화에 사용하고 있음. 이를 분리시켜야함
 */
User.update = (user, info) =>{
    if(info.password){
		info.password = crypto.createHmac('sha1',config.secret)
			.update(info.password)
			.digest('base64')}
    const newDat = Object.assign({},user,info)
    return new Promise((res,reject)=>{
	User.db.query("UPDATE User SET "+
		"password='"	+ newDat.password +
		"', name='" 	+ newDat.name +
		"', nickname='" + newDat.nickname +
		"', birth='" 	+ newDat.birth +
		"', email='" 	+ newDat.email +
		"', phone='" 	+ newDat.phone + 
		"', verified='"	+ newDat.verified +
		//"', gender='" + info.gender +
		"'")
	.catch((err)=>reject(err))
	res(newDat)
    })
}


/**
 *  @brief  DELETE 쿼리 실행
 *  @param	JSON info
 * 	  @property	String userId: 정보를 갱신할 유저의 ID, 쿼리의 where문에 사용한다.
 *
 *  @return Promise
 * 	  @resolve	JSON - 유저 DB가 성공적으로 삭제 되었을 때 실행
 *    @reject	String - 유저 DB의 삭제에 실패했을 때 실행, 에러핸들러로 에러 정보를 넘겨준다.
 */
User.del = (info) => {
    return new Promise((res,reject)=>{
	User.db.query("DELETE VERTEX User WHERE "+
				"userId='"+info.userId +"'")
	    .then(res())
	    .catch((err)=>reject(err))
    })
}



/**
 *  @brief  SELECT 쿼리 실행, userId로 유저를 검색
 *  @param	JSON info
 * 	  @property	String userId: 정보를 찾을 유저의 ID, 쿼리의 where문에 사용한다.
 *
 *  @return Promise
 * 	  @resolve	JSON - 유저 정보를 찾았을 때 실행, 찾은 User정보 객체를 다음 Promise로 넘겨준다.
 *    			JSON - 유저 정보를 찾지 못했을 때 실행, 빈 객체 { }를 다음 Promise로 넘겨준다.
 *    @reject	String - SELECT 쿼리 실행 중 오류가 발생했을 때 실행, 오류 메세지를 출력한다.
 * 
 *    @todo		에러핸들러 작성
 */
User.findOneByUserid = (info) => {
    var TempDat={}
    return new Promise( (res,reject)=>{
	User.db.query("SELECT * FROM User WHERE userId='" + info.userId + "'")
	.then( (results) =>{
	    if( results.length === 0 ){
		console.log('Not found!')
		res(TempDat)
	    } else{
		console.log('found!')
		TempDat = Object.assign({},results[0])
		res(TempDat);
	    }
	})
	.catch((err)=>console.log(err))
    })
}



/**
 *  @brief  SELECT 쿼리 실행, email로 유저를 검색
 *  @param	JSON info
 * 	  @property	String email: 정보를 찾을 유저의 email, 쿼리의 where문에 사용한다.
 *
 *  @return Promise
 * 	  @resolve	JSON - 유저 정보를 찾았을 때 실행, 찾은 User정보 객체를 다음 Promise로 넘겨준다.
 *    			JSON - 유저 정보를 찾지 못했을 때 실행, 빈 객체 { }를 다음 Promise로 넘겨준다.
 *    @reject	String - SELECT 쿼리 실행 중 오류가 발생했을 때 실행, 오류 메세지를 출력한다.
 * 
 *    @todo		에러핸들러 작성
 */
User.findOneByUseremail = (info) => {
    var TempDat={}
    return new Promise( (res,reject)=>{
	User.db.query("SELECT * FROM USER WHERE email='" + info.email + "'")
	.then( (results)=>{
	    if( results.length === 0 ){
		console.log('Not found!')
		res(TempDat)
	    } else{
		console.log('found')
		TempDat = Object.assign({},results[0])
		res(TempDat);
	    }
	})
	.catch((err)=>reject(err))
    })
}			

/**
 *  @brief  유저가 입력한 패스워드를 검증하는 함수. info.password를 DB에 저장할 때와 같은 알고리즘으로 해쉬하여 DB정보와 비교
 * 
 *  @param	JSON user - DB에서 검색한 User 정보
 * 	  @property	String password: 이미 Secret Key와 해쉬를 통해 암호화된 String 데이터
 *  @param	JSON info
 * 	  @property	String userId: 유저가 입력한 raw 형태의 String 데이터
 *
 *  @return Boolean - raw 형태의 패스워드를 해쉬하여 DB에 저장된 암호와 같은지 확인한다. 같으면 true를, 다르면 false를 리턴
 */
User.verify = (user, info) => {
	const encrypted = crypto.createHmac('sha1', config.secret)
			.update(info.password)
			.digest('base64')
	return user.password == encrypted
}

module.exports = User
