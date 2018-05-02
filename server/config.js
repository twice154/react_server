//Config for Orient DB Server
var _dbServerConfig = {
	host: 	'localhost',
	port: 	2424,
	username: 'root',
	password: '1138877',
	useToken: true
}

//Config for User Class in orient DB
var _UserDBConfig = {
	name: "UserInformation",
	type: "graph",
	storage: "plocal",
	username: 'root',
	password: '1138877'
}

//Hashing key for password
var SecretKey = "HonnyBreadCookie5"

module.exports = {
	'secret': 	  SecretKey,
	'dbServerConfig': _dbServerConfig,
	'UserDBConfig':  _UserDBConfig
}

