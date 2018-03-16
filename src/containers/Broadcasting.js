import React, { Component } from 'react';
import {Route,Link} from 'react-router-dom'
import {Setting, Conneto, Reacto} from '../components/settings'

class Broadcasting extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( <div>
            <div class='container'>
            <div class='row'>
                <div class='col s4 center-align'><button><Link to="/broadcast/setting">방송설정</Link></button></div>
                <div class='col s4 center-align'><button><Link to='/broadcast/conneto'>conneto설정</Link></button></div>
                <div class='col s4 center-align'><button><Link to='/broadcast/reacto'>reacto설정</Link></button></div>
            </div>
            <Route path="/broadcast/setting" component={Setting}></Route>
            <Route path="/broadcast/conneto" component={Conneto}></Route>
            <Route path="/broadcast/reacto" component={Reacto}></Route>
            </div>

        </div> )
    }
}
 
export default Broadcasting;