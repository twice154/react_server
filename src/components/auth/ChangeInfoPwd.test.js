import React from 'react';
import {shallow} from 'enzyme'
import ChangeInfoPwd from './ChangeInfoPwd'

describe('ChangeInfoPwd test',()=>{
    var handleChange = jest.spyOn(ChangeInfoPwd.prototype,'handleChange')
    var handleSend = jest.spyOn(ChangeInfoPwd.prototype,'handleSend')
    var verify = jest.spyOn(ChangeInfoPwd.prototype,'verify')
    var checkPwd = jest.spyOn(ChangeInfoPwd.prototype,'checkPwd')
    var submit = jest.fn()
    var wrapper = shallow(<ChangeInfoPwd submit={submit}/>)

    var successEvent ={target:{value:'54375437!',name:'password'}}
    var failEvent ={target:{value:'1',name:'password'}}
    var failEvent1 ={target:{value:'123',name:'password'}}
    var failEvent2 ={target:{value:'5437!',name:'password'}}

    var failEvent_2nd ={target:{value:'a',name:'passwordCheck'}}
    var successEvent_2nd ={target:{value:'54375437!',name:'passwordCheck'}}

    var inputs= wrapper.find('input')
   
 
    describe('function test',()=>{
       it('handleChange should work',()=>{

            inputs.at(0).simulate('change',successEvent)
            inputs.at(1).simulate('change',successEvent_2nd)
      
            expect(handleChange.mock.calls.length).toBe(2)
            expect(wrapper.state()).toEqual({"password": "54375437!", "passwordCheck": "54375437!", "pwdCheckPhrase": "", "pwdVerifyPhrase": "비밀번호는 8자이상 최소 한개 이상의 특수문자가 있어야합니다."})
       })
       it('handleSend should work',()=>{
        wrapper.find('button').simulate('click')
        expect(handleSend.mock.calls.length).toBe(1)
        expect(submit.mock.calls.length).toBe(1)
       })
       it('verify test',async()=>{
        await inputs.at(0).simulate('change',failEvent)
        await inputs.at(0).simulate('keyup',failEvent)
        await expect(wrapper.state().pwdVerifyPhrase).toBe("비밀번호는 8자이상 최소 한개 이상의 특수문자가 있어야합니다.")
      
        await inputs.at(0).simulate('change',failEvent1)
        await inputs.at(0).simulate('keyup',failEvent1)
        expect(wrapper.state().pwdVerifyPhrase).toBe('최소 한개 이상의 특수문자가 포함되어야 합니다.(!@#$%^&*)')
   
        await inputs.at(0).simulate('change',failEvent2)
        await inputs.at(0).simulate('keyup',failEvent2)
        expect(wrapper.state().pwdVerifyPhrase).toBe('비밀번호가 너무 짧습니다.')

        await inputs.at(0).simulate('change',successEvent)
        await inputs.at(0).simulate('keyup',successEvent)
        expect(verify.mock.calls.length).toBe(4)


       })
        it('checkPwd test',()=>{
            inputs.at(1).simulate('change',failEvent_2nd)
            inputs.at(1).simulate('keyup',failEvent_2nd)
            expect(checkPwd.mock.calls.length).toBe(1)
            console.log(wrapper.state())
            expect(wrapper.state().pwdCheckPhrase).toBe('비밀번호가 다릅니다.')
            inputs.at(1).simulate('change',successEvent_2nd)
            inputs.at(1).simulate('keyup',successEvent_2nd)
            expect(wrapper.state().pwdCheckPhrase).toBe('비밀번호가 같습니다.')
           
        })

        

        

    })
    it('snapshot',()=>{
        expect(wrapper).toMatchSnapshot()
    })
})