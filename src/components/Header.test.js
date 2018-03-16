import React from 'react';
import{shallow} from 'enzyme'
import Header from './Header'

describe('Header test',()=>{
    var onLogout = jest.fn()
    var wrapper = shallow(<Header/>)
    it('로그인 되어있다면',()=>{
        wrapper.setProps({currentUser:'g1',isLoggedIn:true})
        expect(wrapper).toMatchSnapshot()

    })
    it('로그인 되어있지 않다면',()=>{
        wrapper.setProps({currentUser:'',isLoggedIn:false})
        expect(wrapper).toMatchSnapshot()

    })
})