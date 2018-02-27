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

const server = Orientdb(config.dbServerConfig);
User.db = server.use(config.UserDBConfig)
User.db.open()
console.log('init DB')
		//.catch(onError)
User.create = (info) =>{
    const nonSatisfied = (info) =>{
	if(!info.userId) return "userId"
	else if(!info.password) return "password"
	else if(!info.name) return "name"
	else if(!info.nickname) return "nickname"
	else if(!info.birth) return "birth"
	else if(!info.email) return "email"
	else if(!info.phone) return "phone"
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

User.del = (info) => {
    return new Promise((res,reject)=>{
	User.db.query("DELETE VERTEX User WHERE "+
				"userId='"+info.userId +"'")
	    .then(res())
	    .catch((err)=>reject(err))
    })
}

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

User.verify = (user, info) => {
	const encrypted = crypto.createHmac('sha1', config.secret)
			.update(info.password)
			.digest('base64')
	return user.password === encrypted
}



module.exports = User
