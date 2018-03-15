//질문1

import express from 'express';
import http from 'http';
import request from 'request';
import url from 'url';

const router = express.Router();

router.get('/*', (req, res)=>{
	var temp = url.parse(req.url).pathname.split('/')
	console.log(temp)
	res.json('hello')
})
export default router;