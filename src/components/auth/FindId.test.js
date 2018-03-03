import React from 'react';
import { shallow} from 'enzyme';
import FindId from './FindId'
 

describe('findId test',()=>{

	it('renders without crashing', () => {
		const findId=shallow(<FindId />);
		expect(findId).toMatchSnapshot()
	  });
})
