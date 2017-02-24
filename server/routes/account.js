import express from 'express';
import orientDB from 'orientjs';
import session from 'express-session';
import request from 'request';

const router = express.Router();
const server =  orientDB({
	host: "localhost",
	port: 2424,
	username: 'root',
	password: 'ssh2159'
});
router.use(session({
    secret: '1234234',
    resave: false,
    saveUninitialized: true
}));
const db = server.use('usersinfo');

router.post('/signup', (req, res)=>{
	console.log("AAA");
	let usernameRegex = /^[a-z0-9]+$/;

	if(!usernameRegex.test(req.body.id)){
		return res.status(400).json({
			error: "BAD USERNAME",
			code: 1
		});
	}

	if(req.body.password.length < 4 || typeof req.body.password!== 'string'){
		return res.status(400).json({
			error: "BAD PASSWORD",
			code: 2
		});
	}

	db.query("SELECT * FROM User WHERE id='" + req.body.username + "'").then((exist)=>{
		if(exist.length !== 0){
			return res.status(400).json({
				error: "USERNAME EXiSTS",
				code: 3
			});
		}
		console.log(req.body);
		db.class.get('User').then((user)=>{
			user.create({
				id: req.body.username,
				password: req.body.password
			}).then((new_user)=>{
				console.log('created record: ' + new_user.id);
				return res.json({success: true});			
			});
		});
	})
});

router.post('/signin', (req, res)=>{
	
	if(typeof req.body.password!== 'string'){
		return res.status(401).json({
			error: "LOGIN FAIELD",
			code: 1
		});
	}

	db.query("SELECT * FROM User WHERE id='" + req.body.username + "'").then((exist)=>{
		if(!exist[0]){
			return res.status(401).json({
				error: "LOGIN FAILED",
				code: 1
			});
		}

		if(exist[0].password!=req.body.password){
			return res.status(401).json({
				error: 'LOGIN FAILED',
				code: 1
			});
		}

		req.session.loginInfo = {
			username: exist[0].id
		};
		console.log("session saved: " + req.session.loginInfo.username); 

		return res.json({
			success: true
		});
	});
});

router.get('/getinfo', (req, res)=>{
	if(typeof req.session.loginInfo === "undefined"){
		return res.status(401).json({
			error: 1
		});
	}
	res.json({info: req.session.loginInfo});
});

router.post('/logout', (req, res)=>{
	req.session.destroy(err=> {if(err) throw err; });
	return res.json({success: true});
});

export default router;