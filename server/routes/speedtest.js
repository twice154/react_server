import express from 'express';
import speedTest from 'speedtest-net';


const router = express.Router();

router.get('*', (req, res)=>{
	const test = speedTest({maxTime: 5000});
	test.once('data', (data) =>{
		console.log(data);
		res.json({data: data});
	});
	test.once('error', (err)=>{
		console.log("error while getting speed");
		res.json({error: 1});
	});
})


export default router;