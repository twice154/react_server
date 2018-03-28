import React from 'react';
import {shallow} from 'enzyme'
import {Modal} from './Modal'

describe('Modal test',()=>{
    var changeType = jest.spyOn(Modal.prototype,'changeType')
    var loginRequest = jest.fn(()=>Promise.resolve())
    var registerRequest=jest.fn(()=>Promise.resolve())
    var toggle = jest.fn()
    var history = {push:jest.fn()}
    global.alert = jest.fn()
    var wrapper= shallow(<Modal loginRequest={loginRequest} toggle={toggle}/>)
    describe('function test',()=>{
        describe('handleLogin test',()=>{
            it('로그인에 성공하면 모달이 꺼진다. ',async()=>{
                wrapper.setProps({loginStatus:"SUCCESS",history,verified:true})
               await wrapper.instance().handleLogin()
                expect(toggle).toHaveBeenCalledTimes(1)
            })
            it('아이디는 존재하나 verified==false일때 /verify로 리다이렉트 된다.',async()=>{
                wrapper.setProps({verified:false})
               await wrapper.instance().handleLogin()
                expect(history.push.mock.calls[0][0]).toBe('/verify')
            })
            it('로그인 실패시 경고창을 띄운다..',async()=>{
                wrapper.setProps({loginRequest:()=>Promise.reject(),loginStatus:'FAILURE'})
                await wrapper.instance().handleLogin()
                expect(global.alert.mock.calls[0][0]).toBe('incorrect userid or password')
            })
    
        })
        describe('handelRegister test ',()=>{
            it('status===Success',async ()=>{
                wrapper.setProps({registerRequest,registerStatus:'SUCCESS'})
                await wrapper.instance().handleRegister()
                expect(registerRequest).toHaveBeenCalledTimes(1)
                expect(changeType).toHaveBeenCalledTimes(1)
            })
            it('status!=success',async ()=>{
                wrapper.setProps({registerStatus:'fail'})
                await wrapper.instance().handleRegister()
                expect(registerRequest).toHaveBeenCalledTimes(2)
                expect(history.push).toHaveBeenCalledTimes(1)
           
            })
            it('registerRequest throw error',async()=>{
                wrapper.setProps({registerRequest:()=>Promise.reject()})
                await wrapper.instance().handleRegister()
                expect(global.alert).toHaveBeenCalledTimes(2)
            })
        })
        describe('selectType test with snapshot',()=>{
            it('type == login',()=>{
                wrapper.setState({type:'login'})
                expect(wrapper).toMatchSnapshot()
            })
            it('type == register',()=>{
                wrapper.setState({type:'register'})
                expect(wrapper).toMatchSnapshot()
            })
            it('type == find',()=>{
                wrapper.setState({type:'find'})
                expect(wrapper).toMatchSnapshot()
            })
        })
        it('changeType test',()=>{
            wrapper.instance().changeType('abc')
            expect(wrapper.state('type')).toBe('abc')
        })
        describe('handleToggle test',()=>{
            it('type !==login',()=>{
                wrapper.instance().handleToggle()
                expect(wrapper.state('type')).toBe('login')
            })
            it('type == login',()=>{
                wrapper.instance().handleToggle()
                expect(toggle).toHaveBeenCalledTimes(4)
            })
           
        })
    })
})