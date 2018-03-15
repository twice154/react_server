import React from 'react';
import {Verified} from './Verified'//test를 위해서는 reux와의 연결을 해지해주어야 한다.
import { shallow} from 'enzyme';
import renderer from 'react-test-renderer';
import {MemoryRouter} from 'react-router-dom'

jest.mock('../mocks')


describe('<Verified>', () => {
  const verify = jest.fn(()=>Promise.resolve())
  const logoutRequest = jest.fn()
  var wrapper =shallow(<Verified verify={verify} match={{params:{token:'1234'}}} currentUser={'g1'}
                                  logoutRequest={logoutRequest}/>);

    describe('function test', () => {
      it('componetWillMount test',()=>{
        expect(verify).toHaveBeenCalled()
        expect(logoutRequest).toHaveBeenCalled()
      })
    });
    it('snapshot test', () => {
      expect(wrapper).toMatchSnapshot();
    })
  
  });