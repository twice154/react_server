import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import orientDB from 'orientjs';

import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import api from './routes';

const app = express();
const port = 3000;
const devPort = 4000;

const dbServer = orientDB({
    host: 'localhost',
    port: 2424,
    username: 'root',
    password: 'ssh2159'
});

const db = dbServer.use('usersinfo');
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(session({
    secret: '1234234',
    resave: false,
    saveUninitialized: true
}));
app.use('/', express.static(path.join(__dirname, './../public')));
app.use('api', api);
app.get('*', (req, res)=>{
    res.sendFile(path.resolve(__dirname, './../public/index.html'));
});


app.listen(port, () => {
    console.log('Express is listening on port', port);
});

if(process.env.NODE_ENV == 'development') {
    console.log('Server is running on development mode');
    const config = require('../webpack.dev.config');
    const compiler = webpack(config);
    const devServer = new WebpackDevServer(compiler, config.devServer);
    devServer.listen(
        devPort, () => {
            console.log('webpack-dev-server is listening on port', devPort);
        }
    );
}
