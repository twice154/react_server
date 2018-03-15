import React from 'react';
import {shallow} from 'enzyme'
import {Find} from './Find'

describe('Find test',()=>{
    var wrapper = shallow(<Find/>)
    var history ={push:jest.fn()}
    global.alert=jest.fn()
    describe('function test',()=>{
        describe('handleSelect test',()=>{
            it('select==true',()=>{
                wrapper.instance().handleSelect(true)
                expect(wrapper.state().select).toBe(true)
            })
            it('select==false',()=>{
                wrapper.instance().handleSelect(false)
                expect(wrapper.state().select).toBe(false)
            })
        })
        describe('sendEmail test',()=>{
            it('id 찾기이면 select==true',async()=>{
                wrapper.setProps({findId:jest.fn(()=>Promise.resolve()),gottenId:'g1'})
                wrapper.setState({select:true})
                await wrapper.instance().sendEmail()
                expect(wrapper.state('gottenId')).toBe('g1')
            })
            it('id 찾기를 실패한다면',async()=>{
                wrapper.setProps({findId:jest.fn(()=>Promise.reject())})
                await wrapper.instance().sendEmail()
                expect(global.alert.mock.calls[0][0]).toBe('이름과 이메일이 틀립니다.')
            })
            it('비밀번호 찾기이면 select==false',async()=>{
                wrapper.setState({select:false})
                wrapper.setProps({findPwd:()=>Promise.resolve(),history,message:'이메일에 비밀번호 변경 링크가 전송되었습니다.'})
                await wrapper.instance().sendEmail()
                expect(global.alert.mock.calls[1][0]).toBe('이메일에 비밀번호 변경 링크가 전송되었습니다.')
                expect(history.push).toHaveBeenCalledTimes(1)
            })
            it('findPwd가 실패하면 ',async()=>{
                wrapper.setProps({findPwd:()=>Promise.reject(),message:'아이디와 이메일이 틀립니다.'})
                await wrapper.instance().sendEmail()
                expect(global.alert.mock.calls[2][0]).toBe('아이디와 이메일이 틀립니다.')
                expect(history.push).toHaveBeenCalledTimes(1)
            })
        })
    })
    describe('snapshot test',()=>{
        it('id찾기일때',()=>{
            wrapper.setState({select:true,gottenId:''})
            expect(wrapper).toMatchSnapshot()
        })
        it('비밀번호 찾기일때',()=>{
            wrapper.setState({select:false})
            expect(wrapper).toMatchSnapshot()
        })
        it('아이디를 찾아서 아이디가 나타나면',()=>{
            wrapper.setState({gottenId:'g1'})
            expect(wrapper).toMatchSnapshot()
        })
    })
})