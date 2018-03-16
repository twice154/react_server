import React from 'react';
import {shallow} from 'enzyme'
import {Login} from './Login'

describe('Login test',()=>{
    var loginRequest = jest.fn(()=>Promise.resolve())
    var wrapper = shallow(<Login loginRequest={loginRequest}/>)
    var history = {push:jest.fn()}
    global.Materialize = {toast:jest.fn()}
    describe('handleLogin test',()=>{
        it('로그인에 성공하면 홈으로 리다이렉트 된다. ',async()=>{
            wrapper.setProps({status:"SUCCESS",history,verified:true})
           await wrapper.instance().handleLogin()
            expect(history.push).toHaveBeenCalledTimes(1)
        })
        it('아이디는 존재하나 verified==false일때 /verify로 리다이렉트 된다.',async()=>{
            wrapper.setProps({verified:false})
           await wrapper.instance().handleLogin()
            expect(history.push.mock.calls[1][0]).toBe('/verify')
        })
        it('로그인 실패시 실패 창을 띄워준다.',async()=>{
            wrapper.setProps({status:'FAILURE'})
            await wrapper.instance().handleLogin()
            expect(global.Materialize.toast).toHaveBeenCalledTimes(2)
        })

    })
    it('snapshot test',()=>{
        expect(wrapper).toMatchSnapshot()
    })
})