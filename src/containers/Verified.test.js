import React from 'react';
import Verified from './Verified'
import { shallow} from 'enzyme';
import renderer from 'react-test-renderer';
import {MemoryRouter} from 'react-router-dom'

jest.mock('../mocks')


describe('<Verified>', () => {
    it('성공적으로 렌더링되어야 합니다.', () => {
      shallow(<Verified />);
     
    });
   //reactrouter가 포함되어 있으면 스냅샷 테스트 불가. 따라서 다음과 같이 initialEntreis를 정해준다.
    it('renders correctly', () => {
      const wrapper = shallow(<MemoryRouter initialEntries ={[{key:'Verified'}]}><Verified/></MemoryRouter>)
      expect(wrapper).toMatchSnapshot();
    })
  
  });