const jwt = require('jsonwebtoken')
const {secret} = require('../config')

//
//  <<< Token Checking MiddleWare >>>
//

//Token이 적합하면 next로 등록된 미들웨어 혹은 함수에 res를 전달하며 실행시킨다.
//적합하지 않다면 success 속성이 false인 객체를 res요청이 온 곳으로 돌려준다.
const authMiddleware = (req, res, next) => {
    //Change header to cookie
    //
    const token = req.headers['x-access-token']||req.query.token
    		  ||req.cookies.token

    if(!token){
	return res.status(403).json({
	    success: false,
	    message: 'not logged in'
	})
    }

    const p = new Promise(
	(resolve, reject) => {
	    jwt.verify(token, secret, (err, decoded) => {
		if(err) reject(err)
		console.log('correct token')
		resolve(decoded)
	    })
	}
    ) 
    const onError = (error) => {
	res.status(403).json({
	    success: false,
	    message: error.message
	})
    }

    p.then((decoded)=>{
	req.decoded = decoded
	next()
    }).catch(onError)
}

module.exports = authMiddleware
