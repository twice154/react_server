'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _orientjs = require('orientjs');

var _orientjs2 = _interopRequireDefault(_orientjs);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var server = (0, _orientjs2.default)({
	host: "localhost",
	port: 2424,
	username: 'root',
	password: 'ssh2159'
});
router.use((0, _expressSession2.default)({
	secret: '1234234',
	resave: false,
	saveUninitialized: true
}));
var db = server.use('usersinfo');

router.post('/signup', function (req, res) {
	console.log("AAA");
	var usernameRegex = /^[a-z0-9]+$/;

	if (!usernameRegex.test(req.body.id)) {
		return res.status(400).json({
			error: "BAD USERNAME",
			code: 1
		});
	}

	if (req.body.password.length < 4 || typeof req.body.password !== 'string') {
		return res.status(400).json({
			error: "BAD PASSWORD",
			code: 2
		});
	}

	db.query("SELECT * FROM User WHERE id='" + req.body.username + "'").then(function (exist) {
		if (exist.length !== 0) {
			return res.status(400).json({
				error: "USERNAME EXiSTS",
				code: 3
			});
		}
		console.log(req.body);
		db.class.get('User').then(function (user) {
			user.create({
				id: req.body.username,
				password: req.body.password
			}).then(function (new_user) {
				console.log('created record: ' + new_user.id);
				return res.json({ success: true });
			});
		});
	});
});

router.post('/signin', function (req, res) {

	if (typeof req.body.password !== 'string') {
		return res.status(401).json({
			error: "LOGIN FAIELD",
			code: 1
		});
	}

	db.query("SELECT * FROM User WHERE id='" + req.body.username + "'").then(function (exist) {
		if (!exist[0]) {
			return res.status(401).json({
				error: "LOGIN FAILED",
				code: 1
			});
		}

		if (exist[0].password != req.body.password) {
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

router.get('/getinfo', function (req, res) {
	if (typeof req.session.loginInfo === "undefined") {
		return res.status(401).json({
			error: 1
		});
	}

	res.json({ info: req.session.loginInfo });
});

router.post('/logout', function (req, res) {
	req.session.destroy(function (err) {
		if (err) throw err;
	});
	return res.json({ success: true });
});

exports.default = router;