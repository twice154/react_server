import express from 'express';
import http from 'http';
import request from 'request';

const router = express.Router();
let options = {
	uri: 'http://localhost:8086/connectioncounts',
	auth:{
		user: 'tla4256',
		pass: 'ssh2159', 
		sendImmediately: false
	}
};

router.get('/list', (req, res)=>{
	request(options, function(error, response, body){ //get stream list from Wowza server
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