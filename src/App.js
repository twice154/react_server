import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {HeaderContainer, Login, Register, StreamingListContainer, StreamingView, Moonlight, SpeedTestContainer} from 'containers';
import {Payment} from './components';
import {Provider} from 'react-redux';
//import {createStore, applyMiddleWare} from 'redux';
import thunk from 'redux-thunk';
import { applyMiddleware } from '../../../../AppData/Local/Microsoft/TypeScript/2.6/node_modules/redux';
import reducers from './modules';
import store from './store';

const App = ()=>(
    <div>  
        <Route path="/" render={(props)=>(<HeaderContainer {...props}/>)}/>
        <Switch>
            <Route path="/" exact component={StreamingListContainer}/>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/player/:streamname"  component={StreamingView}/>
            <Route path="/moonlight" component={Moonlight} />
            <Route path="/pay" component={Payment} />
            <Route path="/speedtest" component={SpeedTestContainer}/>
        </Switch> 
    </div>
)

const Root = () =>(
    <Provider store = {store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>
);

export default Root;