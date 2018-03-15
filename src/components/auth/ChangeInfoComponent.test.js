import React from 'react';
import {shallow} from 'enzyme'
import ChangeInfoComponent from './ChangeInfoComponent'

describe('snapshot, event test',()=>{
    it('snapshot test',()=>{
       
        var wrapper =shallow(<ChangeInfoComponent value ='g1' typeName='nickName'/>)
       
        expect(wrapper).toMatchSnapshot()
    })
    it('event test',()=>{
        var handleChange = jest.spyOn(ChangeInfoComponent.prototype,'handleChange')
        var handleSend = jest.spyOn(ChangeInfoComponent.prototype,'handleSend')
        var submit = jest.fn()
        var wrapper =shallow(<ChangeInfoComponent value ='g1' typeName='nickName' submit={submit}/>)
        var mockedEvent = {target:{value:'g2'}}
        wrapper.find('input').simulate('Change',mockedEvent)
        console.log(wrapper.find('input'))
        expect(handleChange.mock.calls.length).toBe(1)
        expect(wrapper.state('value')).toBe('g2')
        wrapper.find('button').simulate('click')
        expect(handleSend.mock.calls.length).toBe(1)
        expect(submit.mock.calls.length).toBe(1)
    })
   
})