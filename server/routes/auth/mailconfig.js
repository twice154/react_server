var smtpTransporter = {
	service: "Gmail",
	auth: {
		user: "jwc2094@gmail.com",
		pass: "tjrdid^@^1"	}
}
var mailConfig = {
		from: '"DotOut"<rltjqdl1138@gmail.com>',
		subject: "Please confirm your Email account",
}


module.exports = {
	'mailConfig':	mailConfig,
	'smtpConfig':	smtpTransporter}


