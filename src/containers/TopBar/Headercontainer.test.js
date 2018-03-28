import React from 'react';
import {shallow} from 'enzyme'
import {HeaderContainer} from './HeaderContainer'
import {Map} from 'immutable'

describe('HeaderContainer test',()=>{
    global.Materialize={toast:jest.fn()}
    var history={push:jest.fn(),location:{pathname:''}}
    var getStatusRequest = jest.fn(()=>Promise.reject('hihi'))
    var status=Map({currentUser:'',isLoggedIn:false})
    var wrapper = shallow(<HeaderContainer history={history} status={status} getStatusRequest={getStatusRequest}/>)
    describe('function test',()=>{
        it('componentDidMount test if it not work // you can see console.',()=>{
        })
        it('handleLogout test',async()=>{
            wrapper.setProps({logoutRequest:()=>Promise.resolve()})
            await wrapper.instance().handleLogout()
            expect(history.push.mock.calls[0][0]).toBe('/')
        })
    })
    describe('snapshot test',()=>{
        it('when login page, no currentUser',()=>{
            history.location.pathname='login'
            wrapper.setProps({history})
            expect(wrapper).toMatchSnapshot()
        })
        it('when register page, no currentUser',()=>{
            history.location.pathname='register'
            wrapper.setProps({history})
            expect(wrapper).toMatchSnapshot()
        })
        it('no currentUser',()=>{
            history.location.pathname='/'
            wrapper.setProps({history})
            expect(wrapper).toMatchSnapshot()
        })
        it('logined, there is currentUser',()=>{
            wrapper.setProps({status:status.set('isLoggedIn'.true).set('currentUser','g1')})
            expect(wrapper).toMatchSnapshot()
        })
    })
})