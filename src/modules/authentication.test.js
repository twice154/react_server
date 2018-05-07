import configureMockStore from 'redux-mock-store'; //mocking store
import promiseMiddleware from 'redux-promise-middleware';//for mocking store
import thunk from 'redux-thunk'//for mocking store
import MockAdapter from 'axios-mock-adapter'//mocking axios
import axios from 'axios'
import {Map} from 'immutable'
import { loginRequest, getAllInfo, getStatusRequest, findId,findPwd, pwdVerify, cleanCurrentUser, logoutRequest, reSendEmail,
        verify } from './authentication';
import reducers from './authentication'


describe('authentication test',()=>{
    const customizedPromiseMiddleware = promiseMiddleware({
        promiseTypeSuffixes: ['LOADING', 'SUCCESS', 'FAILURE']
    });
  const middlewares = [customizedPromiseMiddleware,thunk];
  const mockStore = configureMockStore(middlewares);
  const initialState = Map({
    login: Map({status: 'INIT'}),
    status: Map({
        isLoggedIn: false,
        verified: false,
        currentUser: '',
        userId:''
    }),
    findId: Map({
        gottenId:''
    }),
    findPwd: Map({
        message:''   
    }),
    allInfo: Map({}),
    pwdVerified:false


});
    var mock = new MockAdapter(axios);
    const store = mockStore(initialState)
    afterEach(() => {
        // cleaning up the mess left behind the previous test
        mock.reset();
        store.clearActions()
    });
    it('loginRequest success and failure test',async ()=>{
        mock.onPost('/api/auth',{userId:'g1', password:''}).replyOnce(200,{success:true,data:{verified:true}})
            .onPost('/api/auth',{userId:'g1', password:''}).replyOnce(200,{success:false,message:'로그인 실패'})
            .onPost('/api/auth',{userId:'', password:''}).reply(400,{message:'fail'})
        var expectedActions = [{"type": "AUTH/LOGIN_LOADING"}, {"payload": {"verified": true}, "type": "AUTH/LOGIN_SUCCESS"}, {"type": "AUTH/LOGIN_LOADING"}, {"error": true, "payload": "로그인 실패", "type": "AUTH/LOGIN_FAILURE"}, {"type": "AUTH/LOGIN_LOADING"}, {"error": true, "payload": "fail", "type": "AUTH/LOGIN_FAILURE"}]
        //action creator
        await store.dispatch(loginRequest('g1','')).catch((a)=>console.log(a))
        await store.dispatch(loginRequest('g1','')).catch((a)=>{expect(a).toBe('로그인 실패')})
        await store.dispatch(loginRequest('','')).catch((a)=>{
                        expect(store.getActions()).toEqual(expectedActions)//성공, 실패 순.
            expect(a).toBe('fail')
        })
        
        //reducer
        expect(reducers(undefined,{type:'AUTH/LOGIN_LOADING'})).toEqual(initialState.setIn(['login', 'status'], 'WAITING'))
        expect(reducers(undefined,{type:'AUTH/LOGIN_SUCCESS',payload:{userId:'g1',verified:true}})).toEqual(initialState.setIn(['login', 'status'], 'SUCCESS')
                                                                                    .mergeIn(['status'], Map({verified: true, currentUser: undefined, userId:'g1'}))
                                                                                    .setIn(['status','isLoggedIn'],true))
        expect(reducers(undefined,{type:'AUTH/LOGIN_FAILURE'})).toEqual(initialState.setIn(['login','status'], 'FAILURE'))

    })
    it('getStatus actionCreator,reducer test',async()=>{
        mock.onGet('/api/auth').replyOnce(200,{data:{userId:'g1'}})
        .onGet('/api/auth').replyOnce(404,{message:'fail'})
        var expectedActions = [{"type": "AUTH/GET_STATUS_LOADING"}, {"payload": {"userId": "g1"}, "type": "AUTH/GET_STATUS_SUCCESS"}, {"type": "AUTH/GET_STATUS_LOADING"}, {"error": true, "payload": "fail", "type": "AUTH/GET_STATUS_FAILURE"}]
        
        await store.dispatch(getStatusRequest()).catch((a)=>console.log(a))
        await store.dispatch(getStatusRequest()).catch((a)=>{
            expect(store.getActions()).toEqual(expectedActions)
            expect(a).toBe('fail')
        })
        expect(reducers(undefined,{type:'AUTH/GET_STATUS_LOADING'})).toEqual(initialState.setIn(['status','isLoggedIn'], true))
        expect(reducers(undefined,{type:'AUTH/GET_STATUS_SUCCESS',payload:{userId:'g1',currentUser:'g1'}})).toEqual(initialState.mergeIn(['status'], Map({isLoggedIn: true, currentUser: 'g1', userId:'g1'})))
        expect(reducers(undefined,{type:'AUTH/GET_STATUS_FAILURE'})).toEqual(initialState.setIn(['status','isLoggedIn'], false))

    })
    it('getAllInfo actionCreator,reducer test',async()=>{
        mock.onGet('/api/users').replyOnce(200,{ email: "jwc2094@naver.com", phone: "000-0000-0000", nickname: "g1"})
        .onGet('/api/users').replyOnce(404,{message:'fail'})
        var expectedActions = [{"type": "AUTH/GET_ALLINFO_LOADING"}, {"payload": { email: "jwc2094@naver.com", phone: "000-0000-0000", nickname: "g1"}, "type": "AUTH/GET_ALLINFO_SUCCESS"}, {"type": "AUTH/GET_ALLINFO_LOADING"}, {"error": true, "payload":'fail', "type": "AUTH/GET_ALLINFO_FAILURE"}]
        
        await store.dispatch(getAllInfo()).catch(err=>console.log(err))
        await store.dispatch(getAllInfo()).catch((err)=>{
            expect(store.getActions()).toEqual(expectedActions)
            expect(err).toBe('fail')
        })
        expect(reducers(undefined,{type:'AUTH/GET_ALLINFO_LOADING'})).toEqual(initialState)
        expect(reducers(undefined,{type:'AUTH/GET_ALLINFO_SUCCESS',payload:{ email: "jwc2094@naver.com", phone: "000-0000-0000", nickname: "g1"}})).toEqual(initialState.set('allInfo',Map({ email: "jwc2094@naver.com", phone: "000-0000-0000", nickname: "g1"})))
        expect(reducers(undefined,{type:'AUTH/GET_ALLINFO_FAILURE'})).toEqual(initialState)

    })
    it('logout actionCreator,reducer test',()=>{
        mock.onDelete('api/auth').reply(200)
        var expectedActions=[{"type": "AUTH/LOGOUT"}]
        store.dispatch(logoutRequest()).then(()=>{
            expect(store.getActions()).toEqual(expectedActions)
        }).catch(err=>console.log(err))
        expect(reducers(initialState.setIn(['status','isLoggedIn'], true),{type:'AUTH/LOGOUT'})).toEqual(initialState.mergeIn(['status'], Map({isLoggedIn: false, currentUser: ''})))
    })
    // it('clean actionCreator,reducer test',()=>{
    //     store.dispatch(cleanCurrentUser()).then(
    //         expect(store.getActions()).toEqual([{"type": "AUTH/CLEAN"}])
    //     )
    //     expect(reducers(initialState,{type:['AUTH/CLEAN']})).toEqual(initialState.setIn(['status','currentUser'],''))
    // })
    it('findId actionCreator,reducer test',async()=>{
        var nameEnc = window.btoa('g1')
        var emailEnc = window.btoa('g1')
        var failEnc = btoa('g2')

        mock.onGet(`/api/recovery/userid?name=${nameEnc}&email=${emailEnc}`).reply(200,{data:{userId:'g1'},success:true})
            .onGet(`/api/recovery/userid?name=${failEnc}&email=${emailEnc}`).reply(200,{message:'different',success:false})
            .onGet(`/api/recovery/userid?name=${failEnc}&email=${failEnc}`).reply(400,{message:'fail'})
        var expectedActions = [{"type":'AUTH/FINDID_LOADING'},{'payload':'g1','type':'AUTH/FINDID_SUCCESS'},{"type": "AUTH/FINDID_LOADING"}, {"error": true,"payload": "different", "type": "AUTH/FINDID_FAILURE"},{"type": "AUTH/FINDID_LOADING"}, {"error": true,"payload": "fail", "type": "AUTH/FINDID_FAILURE"}]
        await store.dispatch(findId('g1','g1')).catch(err=>console.log(err))
        await store.dispatch(findId('g2','g1')).catch(err=>console.log(err))
        await store.dispatch(findId('g2','g2')).catch((err)=>{
            expect(store.getActions()).toEqual(expectedActions)
            expect(err).toBe('fail')
        })
        expect(reducers(undefined,{type:'AUTH/FINDID_LOADING'})).toEqual(initialState.setIn(['findId','gottenId'],''))
        expect(reducers(undefined,{type:'AUTH/FINDID_SUCCESS',payload:'g1'})).toEqual(initialState.setIn(['findId','gottenId'],'g1'))
        expect(reducers(undefined,{type:'AUTH/FINDID_FAILURE'})).toEqual(initialState.setIn(['findId','gottenId'],''))

    })
    it('findPwd actionCreator,reducer test',async()=>{
        var userId ='g1';
        var email ='g1@naver.com'
        mock.onPut(`/api/recovery/password/${userId}/`,{userId,email}).replyOnce(200,{message:"Mail sent to g1@naver.com",success:true})
            .onPut(`/api/recovery/password/${userId}/`,{userId,email}).replyOnce(200,{message:"email is different",success:false})
            .onPut(`/api/recovery/password/${userId}/`,{userId,email}).replyOnce(400,{message:"fail"})
       var expectedActions=[{"type": "AUTH/FINDPWD_LOADING"}, {"payload": "Mail sent to g1@naver.com", "type": "AUTH/FINDPWD_SUCCESS"}, {"type": "AUTH/FINDPWD_LOADING"}, {"error": true
       , "payload": "email is different", "type": "AUTH/FINDPWD_FAILURE"}, {"type": "AUTH/FINDPWD_LOADING"}, {"error": true, "payload": "fail", "type": "AUTH/FINDPWD_FAILURE"}]
       await store.dispatch(findPwd(userId,email)).catch(err=>console.log(err))
       await store.dispatch(findPwd(userId,email)).catch(err=>expect(err).toBe("email is different")).catch((a)=>console.log(a))
       await store.dispatch(findPwd(userId,email)).catch(err=>{
           expect(store.getActions()).toEqual(expectedActions)
           expect(err).toBe('fail')
        }).catch((a)=>console.log(a))
    })
    it('resendMail actionCreator,reducer test',async()=>{
        mock.onPut(`/api/recovery/email/g1`,{email:'g1',userId:'g1'}).reply(200)
            .onPut(`/api/recovery/email/g2`,{email:'g1',userId:'g2'}).reply(400,{message:'fail'})
        await store.dispatch(reSendEmail('g1','g1')).catch(err=>console.log(err))
        await store.dispatch(reSendEmail('g1','g2')).catch(err=>{console.log(2); expect(err).toBe('fail')})
        .then(()=>{
            console.log(1)
            expect(store.getActions()).toEqual([{"type": "AUTH/RESENDEMAIL"}])
       
        }).catch((a)=>console.log(a))
        expect(reducers(initialState,{type:['AUTH/RESENDEMAIL']})).toEqual(initialState)
   
    })
    it('pwdVerify actionCreator,reducer test',async()=>{
        var enc= btoa('1111')
        mock.onGet(`/api/check/verification/password?${enc}`).replyOnce(200,{success:true})
        .onGet(`/api/check/verification/password?${enc}`).replyOnce(200,{success:false,message:'비밀번호가 틀렸습니다.'})
        .onGet(`/api/check/verification/password?${enc}`).replyOnce(400,{message:'fail'})
        var expectedActions=[{"type": "AUTH/PWDVERIFIED_LOADING"}, {"type": "AUTH/PWDVERIFIED_SUCCESS"}, {"type": "AUTH/PWDVERIFIED_LOADING"}, {"error": true, "payload": "비밀번호가 틀렸습니다.", "type": "AUTH/PWDVERIFIED_FAILURE"}, {"type": "AUTH/PWDVERIFIED_LOADING"}, {"error": true, "payload": "fail", "type": "AUTH/PWDVERIFIED_FAILURE"}]

        await store.dispatch(pwdVerify('1111')).catch(err=>console.log(err))
       await store.dispatch(pwdVerify('1111')).catch(err=>expect(err).toBe("비밀번호가 틀렸습니다."))
       await store.dispatch(pwdVerify('1111')).catch(err=>{
           expect(store.getActions()).toEqual(expectedActions)
           expect(err).toBe('fail')
        })
    })

    it('verify actionCreator, reducer test',()=>{
        mock.onPut(`/api/user/g1/verification?token=1234`).reply(200)
        store.dispatch(verify('1234','g1'))
        .then(
           ()=>{ expect(store.getActions()).toEqual([{"type": "AUTH/VERIFY"}])}
        ).catch(err=>console.log(err))
    })

 

})