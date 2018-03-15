import React from 'react';
import {shallow} from 'enzyme'
import HostList from './HostList'

//수정 예정 when? bj용 방송화면 만들때.
describe('Hostlist test',()=>{
    var handleClick = jest.spyOn(HostList.prototype,'handleClick')
    var onClick = jest.fn()
    var wrapper = shallow(<HostList onClick={onClick}/>)
    describe('snapshot tests',()=>{
        it('no hostList',()=>{
            wrapper.setProps({HostList:[]})
            expect(wrapper).toMatchSnapshot
        })
    })
})