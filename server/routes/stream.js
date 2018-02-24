//질문1

import express from 'express';
import http from 'http';
import request from 'request';

const router = express.Router();
let options = {
	uri: 'http://localhost:8086/connectioncounts',
		////?이 주소로 접속하면 무엇인가? 연결이 안되는데..
		//->rest api -->지금 돌아가는 서버를 쉽게 확인시키기 위해 만든 uri
		//와우자 서버에서 받아온 것이다.

	auth:{
		user: 'your_id',
		pass: 'your_password', 
		sendImmediately: false
	}
};

router.get('/list', (req, res)=>{
	request(options, function(error, response, body){ //get stream list from Wowza server
		//uri로 접속해 권한을 얻는다. 
		////? body 가 뭐지????? --> html body tag를 의미(xml)
		//axios랑 반환하는 형식이 다르다.
		//request의 경우 axios랑 다르게 인증이 된다.
		if(!error && response.statusCode == 200){
			return res.status(200).json(body);
		}else{
			return res.status(401).json({error: "1"});
			console.log('Code: ' + response.statusCode);
			console.log('error: ' + error);
			console.log('body: ' + body);
		}
	});
})
export default router;