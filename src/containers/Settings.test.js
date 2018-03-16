import React from 'react';
import {shallow, mount} from 'enzyme'
import {Settings} from './Settings'
import {Map} from 'immutable'
import {MemoryRouter} from 'react-router-dom'

describe('Settings test',()=>{
    var getAllInfo = jest.fn(()=>Promise.reject())
    var history = {push:jest.fn()}
    global.confirm = jest.fn()
    var wrapper = shallow(<Settings getAllInfo={getAllInfo} history={history} status={Map({isLoggedIn:true})}/>)
    describe('componentWillMount test',()=>{
        it('getinfo fail',()=>{
            expect(getAllInfo).toHaveBeenCalledTimes(1)
            expect(history.push).toHaveBeenCalledTimes(1)
        })
    })
    describe('push test',()=>{
        it('param===nickname',()=>{
            wrapper.instance().push('nickname')
            expect(history.push.mock.calls[1][0]).toBe("/settings/nickname")
        })
        it('param==others',()=>{
            wrapper.instance().push('email')
            expect(history.push.mock.calls[2][0]).toBe('/pwdcheck/email')
        })
    })
    describe('quit test',()=>{
        wrapper.instance().quit()
        expect(global.confirm).toHaveBeenCalledTimes(1)
    }) 
    describe('snapShot test',()=>{
        it('logined snapshot',()=>{
            var mounted = mount(<Settings getAllInfo={getAllInfo} history={history} allInfo={Map({})} status={Map({isLoggedIn:true})}/>)
            expect(mounted).toMatchSnapshot()
        })
        it('not login snapshot',()=>{
            var mounted = mount(<Settings getAllInfo={getAllInfo} history={history}  status={Map({isLoggedIn:false})}/>)
            expect(mounted).toMatchSnapshot()
        })
    })
})