const jwt = require('jsonwebtoken')
const {secret} = require('../config')
import url from 'url'
//
//  <<< Token Checking MiddleWare >>>
//

//Token이 적합하면 next로 등록된 미들웨어 혹은 함수에 res를 전달하며 실행시킨다.
//적합하지 않다면 success 속성이 false인 객체를 res요청이 온 곳으로 돌려준다.
const usersMiddleware = (req, res, next) => {
    //Change header to cookie

		const urlParameter = url.parse(req.baseUrl).path.split('/')
		const tempToken = req.headers['x-access-token']||req.query.token
    const token = req.cookies.token

    if(!token && !tempToken){
			return res.status(403).json({
				success: false,
				message: 'not logged in'
			})
    }

		const tokenDecode = () =>{
			return new Promise( (res, reject) => {
					if(tempToken){
						jwt.verify(tempToken, "ChocoPi", (err, decoded) => {
							if(err) reject(err)
								console.log('correct token')
							res(decoded)
						})
					}
					else if(token){
						jwt.verify(token, secret, (err, decoded) => {
							if(err) reject(err)
								console.log('correct token')
							res(decoded)
						})
					}
				}
			)
		}


		const urlCheck = (decoded) =>{
			return new Promise( (res, reject)=>{
				console.log('urlcheck')
				if(decoded.userId == undefined){
					//유효하지 않은 토큰
					reject({
						status:	403,
						message:	"there is no userId in token"
					})
				}
				// else if(decoded.userId != urlParameter[3]){ 굳이 확인 할 필요가 있을까??? 이중으로 처리하는 느낌.
				// 	console.log(decoded.userId , '111', urlParameter)
				// 	//유효하지 않은 토큰
				// 	reject({
				// 		status:	403,
				// 		message:	"url was not matched to token"
				// 	})
				// }
				else {
					//올바른 토큰
					res(decoded)
				}
			})
		}

    const onError = (error) => {
			res.status(error.status).json({
					success: false,
					message: error.message
			})
		}

	tokenDecode()
	.then(decoded => urlCheck(decoded))
	.then((decoded)=>{
		req.decoded = decoded
		next()
    }).catch(onError)
}

module.exports = usersMiddleware
