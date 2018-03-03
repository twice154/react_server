import React from 'react'
import {mount,shallow} from 'enzyme'
import {Verify} from './Verify'

describe('verify test',()=>{
    var cleanCurrentUser = jest.fn()
    var reSendEmail = jest.fn()
    it('성공적으로 렌더링되어야 합니다.', () => {
        shallow(<Verify cleanCurrentUser={cleanCurrentUser} reSendEmail={reSendEmail}/>);
       
      });
     //reactrouter가 포함되어 있으면 스냅샷 테스트 불가. 따라서 다음과 같이 initialEntreis를 정해준다.
      it('snapshot', () => {
        const wrapper = mount(<Verify cleanCurrentUser={cleanCurrentUser} reSendEmail={reSendEmail}/> )
        expect(wrapper).toMatchSnapshot();
      })
      it('fn called',()=>{
        const wrapper = shallow(<Verify cleanCurrentUser={cleanCurrentUser} reSendEmail={reSendEmail}/>);
        expect(wrapper)
      })
})