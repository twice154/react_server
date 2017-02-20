import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute, Link} from 'react-router';
import App from './containers/App';
import streamList from './containers/streamList';
import Player from './containers/Player';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';


const rootElement = document.getElementById('root');
ReactDOM.render(
		<Router history={browserHistory}>
			<Route path="/" component={App}>
				<IndexRoute component={streamList}/>
				<Route path="player/:streamname" component={Player}>
				</Route>
			</Route>
		</Router>, rootElement
);
