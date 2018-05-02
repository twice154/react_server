import React from 'react';
import {mount,shallow} from 'enzyme'
import Broadcasting from './Broadcasting'

describe('Broadcasting test',()=>{

    var wrapper = shallow(
          <Broadcasting location={{pathname:'/broadcast/setting'}}/>
      );
    describe('function test',()=>{
        describe('active test',()=>{
            it('active should working',()=>{
                wrapper.instance().active('conneto');
                expect(wrapper.state('conneto')).toBe('active')
            })
        })
    })
})