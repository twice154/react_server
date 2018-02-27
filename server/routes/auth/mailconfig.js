var smtpTransporter = {
	service: "Gmail",
	auth: {
		user: "rltjqdl1138@gmail.com",
		pass: "kks14159265358979Az!"	}
}
var mailConfig = {
		from: '"DotOut"<rltjqdl1138@gmail.com>',
		subject: "Please confirm your Email account",
}


module.exports = {
	'mailConfig':	mailConfig,
	'smtpConfig':	smtpTransporter}


