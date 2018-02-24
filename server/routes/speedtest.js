//확인
import express from 'express';
import speedTest from 'speedtest-net';


const router = express.Router();

router.post('*', (req, res)=>{
	const test = speedTest({maxTime: 2000, maxServers: 1});
	test.once('data', (data) =>{
		//data이벤트를 통해 관련 정보 downspeed upspeed time등을 보내준다.
		res.json({data: data});
	});
	test.once('error', (err)=>{
		console.log("error while getting speed");
		res.json({error: 1});
	});
})


export default router;