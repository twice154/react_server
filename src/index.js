import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute, Link} from 'react-router';
import {App, Login, Player, Register, StreamList} from 'containers';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from 'reducers';
import thunk from 'redux-thunk';

const store = createStore(reducers, applyMiddleware(thunk));

const rootElement = document.getElementById('root');
ReactDOM.render(
	<Provider store={store}>
		<Router history={browserHistory}>
			<Route path="/" component={App}>
				<IndexRoute component={StreamList}/>
				<Route path="player/:streamname" component={Player}/>
				<Route path="login" component={Login}/>
				<Route path="register" component={Register}/>
			</Route>
		</Router>
	</Provider>, rootElement
);
