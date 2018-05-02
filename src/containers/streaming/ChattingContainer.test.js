import React from 'react';
import {shallow, mount} from 'enzyme'
import {ChattingContainer} from './ChattingContainer'
import {Map} from 'immutable'
describe('ChattingContainer test',()=>{
    var getStatusRequest = jest.fn(()=>Promise.resolve())
    var wrapper =shallow(<ChattingContainer room='1' status={Map({currentUser:'g1'})} getStatusRequest={getStatusRequest}/>)
    describe('funtion test, order',()=>{
        it('init test',()=>{
            var data = {users:['g2','g3'],room:'1'}
            wrapper.instance().init(data)
            expect(wrapper.state()).toEqual({users:['g2','g3'],messages:[],text:[],room:'1',currentUser:'g1'})
        })
        it('1.connectToIoServer test see console.log',()=>{
            wrapper.instance().connectToIoServer()
        })
        it('disconnectToIoServer test see console',()=>{
            wrapper.instance().disconnectToIoServer()
        })
        it('2.joinRoom test. see console. g1 enter ',()=>{
            wrapper.instance().joinRoom()
            wrapper.setState({users:['g1','g2','g3']})
        })
        it('leaveRoom test. see console',()=>{
            wrapper.instance().leaveRoom()
        })
        it('onReceiveMsg test',()=>{
            wrapper.instance().onReceiveMsg({user:'g2',text:'hi'})
            expect(wrapper.state('messages')).toEqual([{user:'g2',text:'hi'}])
        })
        it('onUserJoin test',()=>{
            wrapper.instance().onUserJoin({userId:'g4'})
            expect(wrapper.state('users')).toEqual(['g1','g2','g3','g4'])
            expect(wrapper.state('messages')[1]).toEqual({ user: 'APPLICATION BOT', text: "g4 Joined" })
        })
        it('onUserLeft test',()=>{
            wrapper.instance().onUserLeft({userId:'g3'})
            expect(wrapper.state('users')).toEqual(['g1','g2','g4'])
            expect(wrapper.state('messages')[2]).toEqual({ user: 'APPLICATION BOT', text: "g3 Left" })
        })
        it('handleMessageSub socket.emit is done',()=>{
            wrapper.instance().handleMessageSubmit()
        })
    })
    describe('snapshot test',()=>{
        it('snapshot',()=>{
            expect(wrapper).toMatchSnapshot()
        })
    })
})