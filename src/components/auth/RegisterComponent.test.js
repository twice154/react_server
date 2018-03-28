import React from 'react';
import {shallow,mount} from 'enzyme'
import RegisterComponent from './RegisterComponent'
import {MemoryRouter} from 'react-router-dom'

describe('RegisterComponent Test',()=>{
    var handleChange = jest.spyOn(RegisterComponent.prototype,'handleChange')
    var handleRegister = jest.spyOn(RegisterComponent.prototype,'handleRegister')
    var checkPwd = jest.spyOn(RegisterComponent.prototype,'checkPwd')
    var verify = jest.spyOn(RegisterComponent.prototype,'verify')
    var autoHypenPhone = jest.spyOn(RegisterComponent.prototype,'autoHypenPhone')
    // var handleVerifyEmail = jest.spyOn(RegisterComponent.prototype,'handleVerifyEmail')
    var onRegister = jest.fn()
    var checkId = jest.fn(()=>Promise.resolve())
    var checkEmail = jest.fn()
    var checkPhone = jest.fn(()=>Promise.resolve())
    global.alert = jest.fn()
    global.setTimeout = jest.fn()
    var wrapper = shallow(<RegisterComponent idCheck={false} idStatus='hdifhih' onRegister={onRegister} checkId={checkId}
                                                checkEmail={checkEmail} checkPhone={checkPhone}/>)

    var idEvent= {target:{value:'g1',name:'userId'}}
    var pwdEvent={target:{value:'54375437!', name:'password'}}
    var passwordCheck={target:{value:'54375437!', name:'passwordCheck'}}
    var name={target:{value:'김지원',name:'name'}}
    var birth={target:{value:'950613',name:'birth'}}
    var gender={target:{value:'F',name:'gender'}}
    var email={target:{value:'jwc2094@naver.com',name:'email'}}
    var phone={target:{value:'000-0000-0000',name:'phone'}}

    var inputs=wrapper.find('input')
    describe('function test',async ()=>{
        afterEach(()=>{

            handleChange.mockRestore();
        })
        describe('handleChange should work',()=>{
            it('should work well',async()=>{
                expect(handleChange.mock.calls.length).toBe(0)
                inputs.at(0).simulate('change',idEvent)
                inputs.at(1).simulate('change',pwdEvent)
                inputs.at(2).simulate('change',passwordCheck)//pwdcheck
                inputs.at(3).simulate('change',name)
                inputs.at(4).simulate('change',birth)
                // inputs.at(5).simulate('change',gender) 이거는 select
                inputs.at(5).simulate('change',email)
                wrapper.find('select').simulate('change',gender)
                // inputs.at(7).simulate('change',phone) autoHypenPhone 사용.
                await expect(handleChange.mock.calls.length).toBe(7)
                expect(wrapper.state()).toEqual(      {"birth": "950613", "email": "jwc2094@naver.com", "emailStatus": "", "gender": "F", "idState": "", "idStatus": "", "name": "김지원", "password": "54375437!", "passwordCheck": "54375437!", "phone": "", "phoneStatus": "", "pwdCheck": false, "pwdCheckPhrase": "", "pwdVerified": false, "pwdVerifyPhrase": "비밀번호는 8자이상 최소 한개 이상의 특수문자가 있어야합니다.", "userId": "g1"})
        })
        })
        
        describe('checkPwd test',()=>{
            it('비밀번호가 다릅니다.',()=>{
                inputs.at(2).simulate('change',{target:{value:'5437',name:'passwordCheck'}})
                inputs.at(2).simulate('keyup')
                expect(wrapper.state().pwdCheck).toBe(false)
                expect(wrapper.state().pwdCheckPhrase).toBe('비밀번호가 다릅니다.')
            })
            it('비밀번호가 같습니다.',()=>{
                inputs.at(2).simulate('change',{target:{value:'54375437!',name:'passwordCheck'}})
                inputs.at(2).simulate('keyup')
                expect(wrapper.state().pwdCheck).toBe(true)
                expect(wrapper.state().pwdCheckPhrase).toBe('비밀번호가 같습니다.')
            })
           

        })
        describe('pwd verify test',()=>{
            it('length<3',async()=>{
                await inputs.at(1).simulate('change',{target:{value:'1',name:'password'}})
                await inputs.at(1).simulate('keyup',{target:{value:'1',name:'password'}})
                await expect(wrapper.state().pwdVerifyPhrase).toBe("비밀번호는 8자이상 최소 한개 이상의 특수문자가 있어야합니다.")
               })
            it('2<length&&특수문자가 없을때',async()=>{
                await inputs.at(1).simulate('change',{target:{value:'5437',name:'password'}})
                await inputs.at(1).simulate('keyup',{target:{value:'5437',name:'password'}})
                expect(wrapper.state().pwdVerifyPhrase).toBe('최소 한개 이상의 특수문자가 포함되어야 합니다.(!@#$%^&*)')
            })
            it('2<length<8 &&특수문자가 있을때',async()=>{
                await inputs.at(1).simulate('change',{target:{value:'5437!',name:'password'}})
                await inputs.at(1).simulate('keyup',{target:{value:'5437!',name:'password'}})
                expect(wrapper.state().pwdVerifyPhrase).toBe('비밀번호가 너무 짧습니다.')
            })
            it('lenth>8 && 특수문자 포함',async()=>{
                await inputs.at(1).simulate('change',{target:{value:'54375437!',name:'password'}})
                await inputs.at(1).simulate('keyup',{target:{value:'54375437!',name:'password'}})
                expect(wrapper.state().pwdVerifyPhrase).toBe('안전한 비밀번호입니다.')
                expect(wrapper.state().pwdVerified).toBe(true)
            })
        })
        describe('autoHypenPhone test',()=>{
            it('lenth<4',()=>{
                inputs.at(6).simulate('change',{target:{value:'000',name:'phone'}})
                expect(wrapper.state().phone).toBe('000')
            })
            it('4<=lenth<7',()=>{
                inputs.at(6).simulate('change',{target:{value:'00000',name:'phone'}})
                expect(wrapper.state().phone).toBe('000-00')
            })
            it('7<=lenth<11',()=>{
                inputs.at(6).simulate('change',{target:{value:'00000000',name:'phone'}})
                expect(wrapper.state().phone).toBe('000-000-00')
            })
            it('length=11',()=>{
                inputs.at(6).simulate('change',{target:{value:'00000000000',name:'phone'}})
                expect(wrapper.state().phone).toBe('000-0000-0000')
            })
        })
        describe('handleVerifyEmail test',()=>{
            it('이메일 양식이 틀릴때',()=>{
                wrapper.setState({email:'enen'})
                wrapper.find('input').at(5).simulate('blur')
                expect(wrapper.state('emailStatus')).toBe('올바른 이메일을 입력하세요!')
            })
            it('이메일 양식이 맞을때 사용가능하면',async ()=>{
                wrapper.setProps({checkEmail:()=>Promise.resolve()})
                wrapper.setState({email:'jwc2094@naver.com'})
                try {await wrapper.find('input').at(5).simulate('blur')}catch(err){console.log(err)}
                expect(wrapper.state('emailStatus')).toBe('사용할 수 있는 이메일입니다.')                
            })
            it('이메일 양식이 맞을때 사용불가능하면',async ()=>{
                wrapper.setProps({checkEmail:()=>Promise.reject()})
                try {await wrapper.instance().handleVerifyEmail()}catch(err){console.log(err)}
                expect(wrapper.state('emailStatus')).toBe('이미 이메일을 사용중입니다.')                
            })
        })
        describe('handleRegister test',()=>{

                it('id check fail',()=>{          
                    wrapper.find('button').simulate('click')
                    expect(global.alert).toHaveBeenCalledTimes(1)
                    expect(onRegister).toHaveBeenCalledTimes(0)
                })
                it('not pwd verified',async()=>{
                    wrapper.setProps({idCheck:true}) 
                    wrapper.setState({pwdVerified:false})
                    wrapper.find('button').simulate('click')
                    expect(global.alert.mock.calls[1][0]).toBe('비밀번호를 확인하세요')
                    expect(onRegister).toHaveBeenCalledTimes(0)
                })
                it('not pwdChecked',()=>{
                    wrapper.setProps({idCheck:true})
                    wrapper.setState({pwdVerified:true, pwdCheck:false})
                    wrapper.find('button').simulate('click')
                    expect(global.alert.mock.calls[2][0]).toBe('비밀번호를 확인하세요')
                    expect(onRegister).toHaveBeenCalledTimes(0)
                })
                it('not emailCheck',()=>{
                    wrapper.setProps({idCheck:true,emailCheck:false})
                    wrapper.setState({pwdVerified:true, pwdCheck:true})
                    wrapper.find('button').simulate('click')
                    expect(global.alert.mock.calls[3][0]).toBe('이메일을 확인하세요')
                    expect(onRegister).toHaveBeenCalledTimes(0)
                })
                it('not phoneCheck',()=>{
                    wrapper.setProps({idCheck:true,emailCheck:true,phoneCheck:false})
                    wrapper.setState({pwdVerified:true, pwdCheck:true})
                    wrapper.find('button').simulate('click')
                    expect(global.alert.mock.calls[4][0]).toBe('폰 번호를 확인하세요')
                    expect(onRegister).toHaveBeenCalledTimes(0)
                })
                it('has a blank input',()=>{
                    wrapper.setProps({idCheck:true,emailCheck:true,phoneCheck:true})
                    wrapper.setState({pwdVerified:true, pwdCheck:true, name:''})
                    wrapper.find('button').simulate('click')
                    expect(global.alert.mock.calls[5][0]).toBe('name')
                    expect(onRegister).toHaveBeenCalledTimes(0)
                })
                it('handleRegister Success',()=>{
                    wrapper.setProps({idCheck:true,emailCheck:true,phoneCheck:true})
                    wrapper.setState({pwdVerified:true, pwdCheck:true, name:'g1'})
                    wrapper.find('button').simulate('click')
                    expect(global.setTimeout).toHaveBeenCalledTimes(1)
                })
        })
        
        describe('handleVerifyId test',()=>{
            it('아이디가 사용 가능할때ㅔ',async()=>{
                await inputs.at(0).simulate('blur')
                expect(wrapper.state('idStatus')).toBe('아이디를 사용할 수 있습니다.')
            })
            it('아이디가 사용 불가능할때',async ()=>{
                wrapper.setProps({checkId:()=>Promise.reject()})
                await inputs.at(0).simulate('blur')
                expect(wrapper.state('idStatus')).toBe('아이디가 이미 사용중 입니다.')
            })
           
           
        })
        describe('handleVerifyPhone',()=>{
            it('phone length<12',()=>{
                wrapper.setState({phone:'000-0321'})
                inputs.at(6).simulate('blur')
                expect(wrapper.state('phoneStatus')).toBe('올바른 길이의 번호를 입력하세요')
            })
            it('phone length>12 사용할 수 있는 번호일때',async()=>{
                wrapper.setState({phone:'000-0000-0000'})
                await inputs.at(6).simulate('blur')
                expect(wrapper.state('phoneStatus')) .toBe('사용할 수 있는 번호입니다.')
            })
            it('phone length>12 사용할 수 없는 번호일때',async()=>{
                wrapper.setProps({checkPhone:()=>Promise.reject()})
                await inputs.at(6).simulate('blur')
                expect(wrapper.state('phoneStatus')) .toBe('이미 번호가 존재합니다.')
            })
        })
    })
   
    it('snapShot test',()=>{
        expect(wrapper).toMatchSnapshot()
    })

    
})