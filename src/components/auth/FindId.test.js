import React from 'react';
import { shallow} from 'enzyme';
import FindId from './FindId'
 

describe('findId test',()=>{
	var handleChange = jest.spyOn(FindId.prototype,'handleChange')
	var handleKeyPress = jest.spyOn(FindId.prototype,'handleKeyPress')
	var sendEmail =jest.fn()
	const wrapper=shallow(<FindId sendEmail={sendEmail}/>);

	var nameEvent ={target:{value:'g1',name:'name'}}
	var emailEvent ={target:{value:'jwc2094@naver.com',name:'email'}}

	var inputs= wrapper.find('input')
	describe('function test',()=>{
		it('handleChange should work',()=>{
		
				inputs.at(0).simulate('change',nameEvent)
				inputs.at(1).simulate('change',emailEvent)
				expect(handleChange.mock.calls.length).toBe(2)
				expect(wrapper.state()).toEqual({"email": "jwc2094@naver.com", "name": "g1"})
		   })
		   it('sendEmail should work',()=>{
			   wrapper.find('a').simulate('click')
			   expect(sendEmail.mock.calls.length).toBe(1)
		   })
		   it('handleKeyPress should work',()=>{
			inputs.at(1).simulate('keypress',{charCode:13})
			expect(handleKeyPress.mock.calls.length).toBe(1)
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
