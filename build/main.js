'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _orientjs = require('orientjs');

var _orientjs2 = _interopRequireDefault(_orientjs);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var port = 3000;
var devPort = 4000;

var dbServer = (0, _orientjs2.default)({
    host: 'localhost',
    port: 2424,
    username: 'root',
    password: 'ssh2159'
});

var db = dbServer.use('usersinfo');
var server = _http2.default.createServer(app);
var io = (0, _socket2.default)(server);

app.use((0, _morgan2.default)('dev'));
app.use(_bodyParser2.default.json());
app.use('/', _express2.default.static(_path2.default.join(__dirname, './../public')));
app.use('/api', _routes2.default);
app.get('*', function (req, res) {
    res.sendFile(_path2.default.resolve(__dirname, './../public/index.html'));
});
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

///////////////////////////////
///socket.io 설정 부분/////////
io.on('connection', function (data) {
    console.log("socket is connected");

    io.on('user:join', function (data) {
        console.log(data + " has joined");
        io.emit('user:join', { name: data });
    });
});

io.on('user:join', function (data) {
    console.log(data + " has joined");
    io.emit('user:join', { name: data });
});

/////////////////////////////
/////////////////////////////

server.listen(port, function () {
    console.log('Express is listening on port', port);
});
if (process.env.NODE_ENV == 'development') {
    console.log('Server is running on development mode');
    var config = require('../webpack.dev.config');
    var compiler = (0, _webpack2.default)(config);
    var devServer = new _webpackDevServer2.default(compiler, config.devServer);
    devServer.listen(devPort, function () {

        console.log('webpack-dev-server is listening on port', devPort);
    });
}