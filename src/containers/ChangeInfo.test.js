import React from 'react';
import {shallow, mount} from 'enzyme'
import {ChangeInfo} from './ChangeInfo'
import {Map} from 'immutable'
import {verifyEmail} from'../function/registers'

describe('ChangeInfo test',()=>{
    var submit = jest.spyOn(ChangeInfo.prototype,'submit')
    var getAllInfo=jest.fn(()=>Promise.resolve())
    var newRegister=jest.fn(()=>Promise.resolve())
    var allInfo=Map({nickname:'g1',email:'g1@naver',phone:'000-0000'})
    var history ={push:jest.fn()}
    global.alert=jest.fn()

    var wrapper = shallow(<ChangeInfo pwdVerified={true} match={{params:{typename:'email'}}}getAllInfo={getAllInfo} allInfo={allInfo} history={history}/>)

    describe('willmount test',()=>{
        it('typeName!==nickname, !==password, pwdVerified=true',()=>{
            expect(wrapper.state('typeName')).toBe('email')
            expect(wrapper.state('value')).toBe('g1@naver')
        })
        it('typeName!==nickname, ==password, pwdVerified=true',()=>{
            wrapper.setState({typeName:'password',value:''})
            wrapper.instance().componentWillMount()
            expect(wrapper.state('typeName')).toBe('password')
            expect(wrapper.state('value')).toBe('')
        })
        it('typeName!==nickname, pwdVerified=false',()=>{
            wrapper.setState({typeName:'phone',value:''})
            wrapper.setProps({pwdVerified:false})
            wrapper.instance().componentWillMount()
            expect(wrapper.state('typeName')).toBe('phone')
            expect(wrapper.state('value')).toBe('')
            expect(history.push.mock.calls.length).toBe(1)
            expect(global.alert.mock.calls[0][0]).toBe('비밀번호 체크를 먼저 해주세요!')
        })
        it('typeName==nickname',()=>{
            wrapper.setState({typeName:'nickname',value:''})
            wrapper.instance().componentWillMount()

            expect(wrapper.state('typeName')).toBe('nickname')
            expect(wrapper.state('value')).toBe('g1')
        })
    })

    describe('not password',()=>{
        describe('function test',()=>{
            describe('submit test',()=>{
                describe('typename:nickname',()=>{
                    it('nicknameCheck==true',async()=>{
                        wrapper.setProps({nicknameRequest:jest.fn(()=>Promise.resolve()),newRegister,nicknameCheck:true,status:Map({currentUser:'g1'})})
                        wrapper.setState({typeName:'nickname'})
                       await wrapper.instance().submit({nickname:'g1'}).catch((err)=>{console.log(err)})
                        expect(global.alert.mock.calls[1][0]).toBe('변경되었습니다.')
                    })
                    it('nicknameCheck==false',async()=>{
                        wrapper.setProps({nicknameCheck:false})
                        await wrapper.instance().submit({}).catch(err=>console.log(err))
                        expect(global.alert.mock.calls[2][0]).toBe('이미 등록된 닉네임입니다.')
                    })
                })
                describe('typename:email',()=>{
                    var emailRequest = jest.fn(()=>{return Promise.resolve()})
                    it('verifyEmail return false',()=>{
                        wrapper.setProps({emailRequest,emailRequest:()=>{return Promise.resolve()}})
                        wrapper.setState({typeName:'email'})
                        wrapper.instance().submit({email:'123'})
                        expect(global.alert.mock.calls[3][0]).toBe('올바른 이메일을 입력하세요!')
                        expect(emailRequest).toHaveBeenCalledTimes(0)
                    })
                    
                    it('emailCheck==false',async()=>{
                        wrapper.setProps({emailCheck:false})
                        await wrapper.instance().submit({email:'1234@naver.com'}).catch(()=>{console.log('4이 이상하다')})
                        expect(global.alert.mock.calls[4][0]).toBe('이미 등록된 이메일입니다.')
                        
                    })
                    it('emailCheck==true',async()=>{
                        wrapper.setProps({emailCheck:true})
                        await wrapper.instance().submit({email:'123@naver.com'}).catch(()=>{console.log('3이 이상하다')})
                        expect(global.alert.mock.calls[5][0]).toBe('변경되었습니다.')
                    })
                })
                describe('typename:phone',()=>{
                    it('phonecheck ==false',async()=>{
                        wrapper.setState({typeName:'phone'})
                        wrapper.setProps({phoneRequest:jest.fn(),phoneCheck:false})
                        await wrapper.instance().submit({phone:'000-0000-0000'}).catch(()=>{console.log('2이 이상하다')})
                        expect(global.alert.mock.calls[6][0]).toBe('이미 등록된 번호입니다.')
                    })
                    it('phonecheck==true',async()=>{
                        wrapper.setProps({phoneCheck:true})
                        await wrapper.instance().submit({phone:'012-3345-6666'}).catch(()=>{console.log('1이 이상하다')})
                        expect(global.alert.mock.calls[7][0]).toBe('변경되었습니다.')
                    })
                   
                })
             })
        })
    })
    describe('snapshot test',()=>{
        it('typeName==password',()=>{
            wrapper.setState({typeName:'password'})
            expect(wrapper).toMatchSnapshot()
        })
        it('typeName==phone',()=>{
            wrapper.setState({typeName:'email'})
            expect(wrapper).toMatchSnapshot()
        })

    })
   
})