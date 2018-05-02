import React from 'react';
import { shallow} from 'enzyme';
import {StreamingView} from './StreamingView'


/**
 * streamingView의 하위 컴포넌트가 store를 포함하고 있기 때문에 mount사용 불가.
 */
describe('Streaming veiw test',()=>{
var wrapper =  shallow(<StreamingView match={{params:{streamname:'a'}}}/>);
  it('snapshot test',()=>{
    expect(wrapper).toMatchSnapshot()
  })
})
