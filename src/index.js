import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import { Router, Route, browserHistory, IndexRoute, Link} from 'react-router';
// import {App, Login, StreamingView, Register, StreamList, NewStreamList, Moonlight} from 'containers';
// import {Payment, SpeedTest} from 'components';
// import { Provider } from 'react-redux';
// import { createStore, applyMiddleware } from 'redux';
// import reducers from 'reducers';
// import thunk from 'redux-thunk';

// const store = createStore(reducers, applyMiddleware(thunk));

// const rootElement = document.getElementById('root');
// ReactDOM.render(
// 	<Provider store={store}>
// 		<Router history={browserHistory}>
// 			<Route path="/" component={App}>
// 				<IndexRoute component={NewStreamList}/>
// 				<Route path="player/:streamname" component={StreamingView}/>
// 				<Route path="login" component={Login}/>
// 				<Route exact path="/register" component={Register}/>
// 				<Route path="c" component={Moonlight}/>
// 				<Route path="pay" component={Payment}/>
// 				<Route path="speedtest" component={SpeedTest}/>
// 			</Route>
// 		</Router>
// 	</Provider>, rootElement
// );
ReactDOM.render(<App/>, document.getElementById('root'));
