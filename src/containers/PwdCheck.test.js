import React from 'react';
import {shallow} from 'enzyme'
import {PwdCheck} from './PwdCheck'

describe('PwdCheck test',()=>{
    var pwdVerify = jest.fn(()=>Promise.resolve())
    var match = {params:{typename:'quit'}}
    var spy = jest.spyOn(PwdCheck.prototype,'quit')
    var quit = jest.fn(()=>Promise.resolve())
    var history= {push:jest.fn()}
    global.confirm = jest.fn(()=>true)
    var wrapper = shallow(<PwdCheck pwdVerify={pwdVerify} match={match} quit={quit} history={history}/>)
    describe('function test',()=>{
        it('handlechage Test',()=>{
            wrapper.instance().handleChange({target:{value:'1234'}})
            expect(wrapper.state('pwd')).toBe('1234')
        })
        it('pwdVerifyRequest test when type is quit',async()=>{
           await wrapper.instance().pwdVerifyRequest('1234').catch(err=>console.log(err))
           expect(pwdVerify).toHaveBeenCalledTimes(1)
           expect(quit).toHaveBeenCalledTimes(1)
           expect(history.push.mock.calls[0][0]).toBe('/')
        })
        it('if not confirmed',async()=>{
            global.confirm=jest.fn(()=>false)
            await wrapper.instance().pwdVerifyRequest('1234').catch(err=>console.log(err))
            expect(history.push.mock.calls[1][0]).toBe('/settings')
        })
        it('typename!==quit',async()=>{
            wrapper.setProps({match:{params:{typename:'email'}}})
            await wrapper.instance().pwdVerifyRequest('1234').catch(err=>console.log(err))

        })
    })
})