import express from 'express';

const router = express.Router();

router.post('./signup', (req, res)=>{
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

	db.query("SELECT * FROM User WHERE id='" + req.body.id + "'").then((exist)=>{
		if(exist){
			return res.status(400).json({
				error: "USERNAME EXiSTS",
				code: 3
			});
		}
		db.class.get('User').then((user)=>{
			user.create({
				id: req.body.id,
				password: req.body.password
			}).then((new_user)=>{
				console.log('created record: ' + new_user.id);
				return res.json({success: true});			
			});
		});
	})
});

router.post('./signin', (req, res)=>{
	
	if(typeof req.body.password!== 'string'){
		return res.status(401).json({
			error: "LOGIN FAIELD",
			code: 1
		});
	}

	db.query("SELECT * FROM User WHERE id='" + req.body.id + "'").then((exist)=>{
		if(!exist){
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

		let session = req.session;
		session.loginInfo = {
			_id: exist[0].id,
			password: exist[0].password
		};

		return res.json({
			success: true
		});
	});
});

router.get('/getinfo', (req, res)=>{
	if(typeof req.session.loginInfo === "undefined"){
		return res.statusP(401).json({
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