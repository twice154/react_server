var smtpTransporter = {
	service: "Gmail",
	auth: {
//<<<<<<< HEAD
		user: "rltjqdl1138@gmail.com",
		pass: "kks14159265358979Az!"	}
//=======
//		user: "jwc2094@gmail.com",
//		pass: "wnsla226+"	}
//>>>>>>> 041ea688d95c1156a69aba11f7d96721a8bbf3a2
}
var mailConfig = {
		from: '"DotOut"<rltjqdl1138@gmail.com>',
		subject: "Please confirm your Email account",
}


module.exports = {
	'mailConfig':	mailConfig,
	'smtpConfig':	smtpTransporter}


