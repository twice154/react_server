import React from 'react';
import {shallow} from 'enzyme'
import SettingsComponent from './SettingsComponent'
import {Map} from 'immutable'

describe('settingsComponent test',()=>{
    var push = jest.fn()
    var quit = jest.fn()
    var info = Map({nickname:'g1',email:'jwc2094@naver.com',phone:'000-0000-0000'})
    var wrapper =shallow(<SettingsComponent push={push} quit={quit} info={info}/>)
    var divs = wrapper.find('.row> div')
    it('click test',()=>{
        divs.at(0).simulate('click')
        divs.at(1).simulate('click')
        divs.at(2).simulate('click')
        divs.at(3).simulate('click')
        expect(push.mock.calls.length).toBe(4)
    })
    it('snapShot',()=>{
        expect(wrapper).toMatchSnapshot()
    })
})