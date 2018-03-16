import React from 'react';
import {shallow} from 'enzyme'
import SpeedTest from './SpeedTest'

describe('SpeedTest test',()=>{
    var getSpeed = jest.fn(()=>Promise.resolve())
    var getSpeed_fail = jest.fn(()=>Promise.reject())
    var wrapper = shallow(<SpeedTest data={{client:undefined}} getSpeed={getSpeed}/>)
  
    describe('snapshot test',()=>{
        it('client가 없을때',()=>{
            wrapper.setProps({status:'init',data:{client:undefined}})
            
            expect(wrapper).toMatchSnapshot()
        })
        it('client가 있을때',()=>{
            wrapper.setProps({data:{client:{ip:'125.0.0.1'},speeds:{download:'100',upload:'100'},server:{ping:'10'}}})
            expect(wrapper).toMatchSnapshot()
        })
    })
    it('click test',()=>{
        wrapper.find('input').simulate('click')
        expect(getSpeed.mock.calls.length).toBe(1)
    })
    it('click test when return reject' ,()=>{
        wrapper.setProps({getSpeed:getSpeed_fail})
        wrapper.find('input').simulate('click')
        expect(getSpeed_fail.mock.calls.length).toBe(1)
    })
})