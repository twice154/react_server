import React from 'react';
import { shallow} from 'enzyme';
import FindPwd from './FindPwd'

describe('FindPwd test',()=>{
    var handleChange = jest.spyOn(FindPwd.prototype,'handleChange')
    var handleKeyPress = jest.spyOn(FindPwd.prototype,'handleKeyPress')
    var sendEmail =jest.fn()


    var idEvent ={target:{value:'g1',name:'id'}}
    var emailEvent ={target:{value:'jwc2094@naver.com',name:'email'}}

    
    var wrapper = shallow(<FindPwd sendEmail={sendEmail}/>)
    var inputs = wrapper.find('input')

    describe('function test',()=>{
        afterEach(()=>{

            handleChange.mockRestore();
            handleKeyPress.mockRestore();
        })
        it('handleChange should work',()=>{
		
            inputs.at(0).simulate('change',idEvent)
            inputs.at(1).simulate('change',emailEvent)
            expect(handleChange.mock.calls.length).toBe(2)
            expect(wrapper.state()).toEqual({"email": "jwc2094@naver.com", "id": "g1"})
       })
       it('handleKeyPress should work',()=>{
           inputs.at(1).simulate('keypress',{charCode:13})
           expect(handleKeyPress.mock.calls.length).toBe(1)
           expect(sendEmail.mock.calls.length).toBe(1)

       })
       it('sendEmail should work',()=>{
        wrapper.find('a').simulate('click')
        expect(sendEmail.mock.calls.length).toBe(2)
    })
    })

	it('snapshot', () => {
		
		expect(wrapper).toMatchSnapshot()
      });
      it('for 100% branch',()=>{
        inputs.at(1).simulate('keypress',{charCode:1})
    })
	
})