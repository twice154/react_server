import React from 'react';
import {shallow} from 'enzyme'
import VerifyComponent from './VerifyComponent'

describe('VerifyComponet test',()=>{
    var handleChange = jest.spyOn(VerifyComponent.prototype,'handleChange')
    var handleKeyPress = jest.spyOn(VerifyComponent.prototype,'handleKeyPress')
    var handleVerify = jest.spyOn(VerifyComponent.prototype,'handleVerify')
    var checkEmail =jest.fn()
    var verify=jest.fn()
    global.alert = jest.fn()

    var wrapper = shallow(<VerifyComponent checkEmail={checkEmail} verify={verify}/>)
    

    describe('function test',()=>{
        it('handleChange test',()=>{
            wrapper.find('input').simulate('change',{target:{value:'jwc2094@naver.com', name:'email'}})
            expect(wrapper.state('email')).toBe('jwc2094@naver.com')
            expect(handleChange).toHaveBeenCalledTimes(1)
        })
        describe('handleKeyPress test',()=>{
            it('should not work',()=>{
                wrapper.find('input').simulate('keypress',{charCode:10})
                expect(handleVerify).toHaveBeenCalledTimes(0)
            })
            it('should work',()=>{
                wrapper.find('input').simulate('keypress',{charCode:13})
                expect(handleVerify).toHaveBeenCalledTimes(1)
                expect(checkEmail.mock.calls.length).toBe(1)
            })
        })
        describe('handleVerify test',()=>{
            it('이메일 양식이 틀릴때',()=>{
                wrapper.setState({email:'enen'})
                wrapper.find('a').at(1).simulate('click')
                expect(global.alert.mock.calls[0][0]).toBe('올바른 이메일을 입력하세요!')
            })
            it('이메일 양식이 맞을때',()=>{
                wrapper.setState({email:'jwc2094@naver.com'})
                wrapper.find('a').at(1).simulate('click')
                expect(global.alert).toHaveBeenCalledTimes(1)
                expect(checkEmail.mock.calls.length).toBe(2)
            })
        })
        it('원래 이메일에 인증메일 다시 보내기',()=>{
            wrapper.find('a').at(0).simulate('click')
            expect(verify.mock.calls.length).toBe(1)
        })
       
    })
    it('snapshot test',()=>{
        expect(wrapper).toMatchSnapshot()
    })
    
})