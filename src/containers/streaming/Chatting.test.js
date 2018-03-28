import React from 'react';
import {shallow,mount} from 'enzyme'
import {Chatting, MessageForm} from './Chatting'

describe('Chatting test',()=>{
    var connectToServer = jest.fn(()=>Promise.resolve())
    var getStatus = jest.fn(()=>Promise.resolve('g1'))
    var joinRoom = jest.fn()
    var disconnect = jest.fn()
    var leaveRoom=jest.fn()
    var wrapper = shallow(<Chatting connectToServer={connectToServer} getStatus={getStatus} joinRoom={joinRoom} room='1'/>)
    describe('componentWillmount test',()=>{
        it('user logined',()=>{
            expect(connectToServer).toHaveBeenCalledTimes(1)
            expect(getStatus).toHaveBeenCalledTimes(1)
            expect(joinRoom.mock.calls[0]).toEqual(["1", "g1"])
        })
        it('user not login',async ()=>{
            wrapper.setProps({getStatus:()=>{return Promise.reject()}})
            await wrapper.instance().componentWillMount().catch(()=>{console.log('11이 이상하다')})
            expect(connectToServer).toHaveBeenCalledTimes(2)
            expect(joinRoom.mock.calls[1]).toEqual(["1", ""])
      
        })
    })
    describe('componentWillUnmount test',()=>{
        
        it('not work',async()=>{
            wrapper.setProps({disconnect,leaveRoom})
            await wrapper.instance().componentWillUnmount()
        })
        it('workwell',async ()=>{
            wrapper.setProps({getStatus:()=>Promise.resolve()})
            await wrapper.instance().componentWillUnmount()
            expect(disconnect).toHaveBeenCalledTimes(1)
        })
    })
    describe('componentWillUpdate test',()=>{

        it('currentUser is different',()=>{
            wrapper.setProps({currentUser:'a',leaveRoom})//leaveroom ㅅㅣㄹ행
            wrapper.instance().componentWillUpdate({currentUser:'b'})//leaveroom 실행
            expect(leaveRoom).toHaveBeenCalledTimes(3)
        })
        it('다른 방으로 접속',()=>{
            wrapper.instance().componentWillUpdate({room:'2'})
            expect(leaveRoom).toHaveBeenCalledTimes(4)
            expect(joinRoom).toHaveBeenCalledTimes(5)
        })
    })
   
})
describe('messageForm test',()=>{
    var msform = shallow(<MessageForm/>)
    var handleChange = jest.spyOn(MessageForm.prototype,'handleChange')
    var onMessageSubmit= jest.fn()
        it('handleChange test',()=>{
        msform.find('input').simulate('change',{target:{value:'1'}})
        // expect(handleChange).toHaveBeenCalledTimes(1)
        expect(msform.state('text')).toBe('1')
        })
        it('handleSubmit test',()=>{
            msform.setProps({onMessageSubmit})
            msform.instance().handleSubmit({preventDefault:jest.fn()})
            expect(onMessageSubmit).toHaveBeenCalledTimes(1)
            expect(msform.state('text')).toEqual('')
        })
    describe('snapshot test',()=>{
        it('로그인 됏을때',()=>{
            expect(mount(<Chatting connectToServer={()=>Promise.resolve()}
                                   getStatus={()=>Promise.resolve()}
                                   joinRoom={()=>1}
                                   users={['g1','g2','g3']}
                                   messages={[{user:'g1',text:'hig1'},{user:'g2',text:'hig2'},{user:'g3',text:'hig3'}]}
                                   onMessageSubmit={onMessageSubmit}
                                   currentUser={'지원'}/>))
                    .toMatchSnapshot()
        })
    })
})