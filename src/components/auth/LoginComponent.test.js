import React from 'react';
import { shallow} from 'enzyme';
import LoginComponent from './LoginComponent'
import {MemoryRouter} from 'react-router-dom'

describe('LoginComponent test',()=>{
    var handleChange = jest.spyOn(LoginComponent.prototype,'handleChange')
    var handleKeyPress = jest.spyOn(LoginComponent.prototype,'handleKeyPress')
    var handleLogin = jest.spyOn(LoginComponent.prototype,'handleLogin')
    var onLogin = jest.fn(()=>{
        if(wrapper.state()=={userId:'g1',password:'54375437!'})
        return Promise.resolve()
        else return Promise.reject('login fail')
    })
    var wrapper = shallow(<LoginComponent onLogin={onLogin}/>)

    var successId ={target:{value:'g1',name:'userId'}}
    var failId = {target:{value:'g2',name:'userId'}}
    var successPwd ={target:{value:'54375437!',name:'password'}}
	var failPwd ={target:{value:'....',name:'password'}}
    var inputs = wrapper.find('input')
    describe('function test',()=>{
      
        it('handleChange should work',()=>{
		
            inputs.at(0).simulate('change',successId)
            inputs.at(1).simulate('change',successPwd)
            expect(handleChange.mock.calls.length).toBe(2)
            expect(wrapper.state()).toEqual({"password": "54375437!", "userId": "g1"})
       })
       it('will login if it had true id,pwd',()=>{
           inputs.at(1).simulate('keypress',{charCode:13})
           wrapper.find('a').at(0).simulate('click')
           expect(onLogin.mock.calls.length).toBe(2)
       })
       it('can not login when it submit wrong id,pwd',()=>{
        inputs.at(0).simulate('change',failId)
        inputs.at(1).simulate('change',failPwd)

        inputs.at(1).simulate('keypress',{charCode:13})
        wrapper.find('a').at(0).simulate('click')
        expect(onLogin.mock.calls.length).toBe(4)
    })

    })
    it('snapshot test',()=>{
      expect(wrapper).toMatchSnapshot()
    })
    it('for 100% branch',()=>{
        inputs.at(1).simulate('keypress',{charCode:1})
    })
    
})