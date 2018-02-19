import express from 'express';
import orientDB, {ODatabase} from 'orientjs';
import session from 'express-session';
import request from 'request';

var db = new ODatabase({
	host: "localhost",
	port: 2424,
	username: 'root',
	password: 'ssh2159',
	name: 'usersinfo'
});
const router = express.Router();
router.use(session({
	secret: '1234234',
	resave: false,
	saveUninitialized: true
}));
function connectToDB(){
	db.open().then(()=>{
		console.log("Successfullly connected to db server");
	}).catch((err)=>{
		console.log("err connecting to orientdb server: "  + err);
		setTimeout(connectToDB, 5000);
	})	
}
connectToDB();

router.post('/signup', (req, res)=>{
	let userIdRegex = /^[a-z0-9]+$/;

	if(!userIdRegex.test(req.body.id)){
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

	db.query("SELECT * FROM User WHERE id='" + req.body.userId + "'").then((exist)=>{
		if(exist.length !== 0){
			return res.status(400).json({
				error: "USERNAME EXiSTS",
				code: 3
			});
		}
		console.log(req.body);
		db.class.get('User').then((user)=>{
			user.create({
				id: req.body.userId,
				password: req.body.password
			}).then((new_user)=>{
				console.log('created record: ' + new_user.id);
				return res.json({success: true});			
			});
		});
	}).catch(err=>{
		return res.status(404).json({
			error: "DB NOT CONNECTED",
			code: 4
		})
	})
});

router.post('/signin', (req, res)=>{
	
	if(typeof req.body.password!== 'string'){
		return res.status(401).json({
			error: "LOGIN FAIELD",
			code: 1
		});
	}

	db.query("SELECT * FROM User WHERE id='" + req.body.userId + "'").then((exist)=>{
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
			userId: exist[0].id
		};
		console.log("session saved: " + req.session.loginInfo.userId); 

		return res.json({
			success: true
		});
	}).catch(err => {
		return res.status(404).json({
			error: "DB NOT CONNECTED",
			code: 4
		})
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
