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
    var handleVerifyEmail = jest.spyOn(RegisterComponent.prototype,'handleVerifyEmail')
    var onRegister = jest.fn()
    var checkId = jest.fn()
    var checkEmail = jest.fn()
    var checkPhone = jest.fn()
    global.alert = jest.fn()
    
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
                expect(wrapper.state()).toEqual({"birth": "950613", "email": "jwc2094@naver.com", "gender": "F", "name": "김지원","password": "54375437!", "passwordCheck": "54375437!", "phone": "", "pwdCheck": false, "pwdCheckPhrase": "", "pwdVerified": false, "pwdVerifyPhrase": "비밀번호는 8자이상 최소 한개 이상의 특수문자가 있어야합니다.", "userId": "g1"})
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
                wrapper.find('button').at(0).simulate('click')
                expect(global.alert.mock.calls[0][0]).toBe('올바른 이메일을 입력하세요!')
            })
            it('이메일 양식이 맞을때',()=>{
                wrapper.setState({email:'jwc2094@naver.com'})
                wrapper.find('button').at(0).simulate('click')
                expect(global.alert).toHaveBeenCalledTimes(1)
                expect(checkEmail.mock.calls.length).toBe(1)
            })
        })
        describe('handleRegister test',()=>{

                it('id check fail',()=>{          
                    wrapper.find('a').simulate('click')
                    expect(global.alert).toHaveBeenCalledTimes(2)
                    expect(onRegister).toHaveBeenCalledTimes(0)
                })
                it('not pwd verified',async()=>{
                    wrapper.setProps({idCheck:true}) 
                    wrapper.setState({pwdVerified:false})
                    wrapper.find('a').simulate('click')
                    expect(global.alert.mock.calls[2][0]).toBe('비밀번호를 확인하세요')
                    expect(onRegister).toHaveBeenCalledTimes(0)
                })
                it('not pwdChecked',()=>{
                    wrapper.setProps({idCheck:true})
                    wrapper.setState({pwdVerified:true, pwdCheck:false})
                    wrapper.find('a').simulate('click')
                    expect(global.alert.mock.calls[3][0]).toBe('비밀번호를 확인하세요')
                    expect(onRegister).toHaveBeenCalledTimes(0)
                })
                it('not emailCheck',()=>{
                    wrapper.setProps({idCheck:true,emailCheck:false})
                    wrapper.setState({pwdVerified:true, pwdCheck:true})
                    wrapper.find('a').simulate('click')
                    expect(global.alert.mock.calls[4][0]).toBe('이메일을 확인하세요')
                    expect(onRegister).toHaveBeenCalledTimes(0)
                })
                it('not phoneCheck',()=>{
                    wrapper.setProps({idCheck:true,emailCheck:true,phoneCheck:false})
                    wrapper.setState({pwdVerified:true, pwdCheck:true})
                    wrapper.find('a').simulate('click')
                    expect(global.alert.mock.calls[5][0]).toBe('폰 번호를 확인하세요')
                    expect(onRegister).toHaveBeenCalledTimes(0)
                })
                it('has a blank input',()=>{
                    wrapper.setProps({idCheck:true,emailCheck:true,phoneCheck:true})
                    wrapper.setState({pwdVerified:true, pwdCheck:true, name:''})
                    wrapper.find('a').simulate('click')
                    expect(global.alert.mock.calls[6][0]).toBe('name')
                    expect(onRegister).toHaveBeenCalledTimes(0)
                })
                it('handleRogin Success',()=>{
                    wrapper.setProps({idCheck:true,emailCheck:true,phoneCheck:true})
                    wrapper.setState({pwdVerified:true, pwdCheck:true, name:'g1'})
                    wrapper.find('a').simulate('click')
                    expect(onRegister).toHaveBeenCalledTimes(1)
                })
        })
        
        describe('props function test',()=>{
            it('checkId should work',()=>{
                inputs.at(0).simulate('blur',{target:{value:'g1'}})
                expect(checkId).toHaveBeenCalledTimes(1)
            })
            it('checkPhone should work',()=>{
                wrapper.find('button').at(1).simulate('click')
                expect(checkPhone).toHaveBeenCalledTimes(1)
            })
           
        })
    })
   
    it('snapShot test',()=>{
        expect(wrapper).toMatchSnapshot()
    })

    
})