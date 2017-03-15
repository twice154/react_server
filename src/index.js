import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute, Link} from 'react-router';
import {App, Login, StreamingView, Register, StreamList, NewStreamList, Moonlight} from 'containers';

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
				<IndexRoute component={NewStreamList}/>
				<Route path="player/:streamname" component={StreamingView}/>
				<Route path="login" component={Login}/>
				<Route path="register" component={Register}/>
				<Route path="c" component={Moonlight}/>
			</Route>
		</Router>
	</Provider>, rootElement
);
