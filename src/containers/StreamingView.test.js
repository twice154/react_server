import React from 'react';
import { shallow} from 'enzyme';
import StreamingView from './StreamingView'
import {MemoryRouter} from 'react-router-dom'


/**
 * streamingView가 match를 포함하고 있기 때문에..
 */
it('renders without crashing', () => {
  shallow(<MemoryRouter><StreamingView /></MemoryRouter>);
});