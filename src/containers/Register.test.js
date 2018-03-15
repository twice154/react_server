import React from 'react';
import {shallow, mount} from 'enzyme'
import {Register} from './Register'
import {MemoryRouter} from 'react-router-dom'

describe('Register test',()=>{
 var handleRegister = jest.spyOn(Register.prototype,'handleRegister')
 var checkId = jest.spyOn(Register.prototype,'checkId')
 var checkEmail = jest.spyOn(Register.prototype,'checkEmail')
 var checkPhone = jest.spyOn(Register.prototype,'checkPhone')
 var registerRequest = jest.fn(()=>Promise.resolve())
 var idRequest = jest.fn()
 var emailRequest = jest.fn()
 var phoneRequest = jest.fn()
 var history = {push:jest.fn()}
 global.Materialize = {toast:jest.fn((a,b)=>{return a})}
 global.alert =jest.fn()

 var mounting = (props)=>{
     return mount(<MemoryRouter initialEntries ={[{key:'Register'}]}><Register {...props}/></MemoryRouter>)
 }
 var wrapper = shallow(<Register/>)
    describe('function test',()=>{
        describe('handelRegister test ',()=>{
            it('status===Success',async ()=>{
                wrapper.setProps({registerRequest,status:'SUCCESS',history})
                await wrapper.instance().handleRegister()
                expect(registerRequest).toHaveBeenCalledTimes(1)
                expect(global.Materialize.toast).toHaveBeenCalledTimes(1)
                expect(history.push).toHaveBeenCalledTimes(1)
            })
            it('status!=success',async ()=>{
                wrapper.setProps({status:'fail'})
                await wrapper.instance().handleRegister()
                expect(registerRequest).toHaveBeenCalledTimes(2)
                expect(global.Materialize.toast).toHaveBeenCalledTimes(1)
                expect(history.push).toHaveBeenCalledTimes(1)
           
            })
            it('registerRequest throw error',async()=>{
                wrapper.setProps({registerRequest:()=>Promise.reject()})
                await wrapper.instance().handleRegister()
                expect(global.alert).toHaveBeenCalledTimes(1)
            })
        })
        describe('checkId test',()=>{
         it('id===빈칸',()=>{
            wrapper.instance().checkId('')
            expect(wrapper.state().idState).toBe('아이디를입력해주세요')
         })
         it('아이디가 이미 존재할때 ',async()=>{
             wrapper.setProps({idRequest:()=>Promise.reject(),idState:'아이디가 이미 존재합니다.'})
             await wrapper.instance().checkId('g1')
             expect(wrapper.state().idState).toBe('아이디가 이미 존재합니다.')
         })
         it('아이디가 사용할 수 있을때 ',async()=>{
            wrapper.setProps({idRequest:()=>Promise.resolve(),idState:'아이디를 사용할 수 있습니다.'})
            await wrapper.instance().checkId('g1')
            expect(wrapper.state().idState).toBe('아이디를 사용할 수 있습니다.')
        })
        })
        describe('checkEmail test',()=>{
            it('email === 빈칸',()=>{
                wrapper.instance().checkEmail('')
                expect(wrapper.state().emailState).toBe('이메일을입력해주세요')
            })
            it('email이 이미 등록되어있을때',async()=>{
                wrapper.setProps({emailRequest:()=>Promise.reject(),emailState:'이메일이 이미 등록되어있습니다.'})
                await wrapper.instance().checkEmail('g1')
                expect(wrapper.state().emailState).toBe('이메일이 이미 등록되어있습니다.')
            })
            it('email을 사용할 수 있을때',async()=>{
                wrapper.setProps({emailRequest:()=>Promise.resolve(),emailState:'이메일을 사용할 수 있습니다.'})
                await wrapper.instance().checkEmail('g1')
                expect(wrapper.state().emailState).toBe('이메일을 사용할 수 있습니다.')
            })
        })
        describe('checkPhone',()=>{
            it('phone length<12',()=>{
                wrapper.instance().checkPhone('123-456')
                expect(global.alert).toHaveBeenCalledTimes(2)
            })
            it('phone이 이미 사용중일때',()=>{
                wrapper.setProps({phoneRequest:()=>Promise.resolve(), phoneCheck:false})
                wrapper.instance().checkPhone('000-0000-0000')
                expect(wrapper.state().phoneCheck).toBe(false)
            })
            it('phone이 사용 가능할때',async ()=>{
                wrapper.setProps({phoneRequest:()=>Promise.resolve(), phoneCheck:true})
                await wrapper.instance().checkPhone('000-0000-0000')
                expect(wrapper.state().phoneCheck).toBe(true)
            })
        })
    })
    it('snapShot test',()=>{
        var mounted = mounting({})
        expect(mounted).toMatchSnapshot()
    })
})