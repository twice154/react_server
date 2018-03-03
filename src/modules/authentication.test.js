import configureMockStore from 'redux-mock-store'; //mocking store
import promiseMiddleware from 'redux-promise-middleware';//for mocking store
import thunk from 'redux-thunk'//for mocking store
import MockAdapter from 'axios-mock-adapter'//mocking axios
import axios from 'axios'
import {Map} from 'immutable'
import { loginRequest, getAllInfo, getStatusRequest, findId, pwdVerify, cleanCurrentUser, logoutRequest, reSendEmail } from './authentication';
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
        currentUser: ''
    }),
    findId: Map({
        gottenId:''
    }),
    allInfo: Map({}),
    pwdVerified:false


})
    var mock = new MockAdapter(axios);
    const store = mockStore(initialState)
    afterEach(() => {
        // cleaning up the mess left behind the previous test
        mock.reset();
        store.clearActions()
    });
    it('loginRequest actionCreator,reducer test',async ()=>{
        mock.onPost('/api/account/signin',{userId:'g1', password:''}).reply(200,{userId:'g1',verified:true})
        var expectedActions = [{"type": "AUTH/LOGIN_LOADING"}, {"payload": {"userId": "g1", "verified": true}, "type": "AUTH/LOGIN_SUCCESS"}, {"type": "AUTH/LOGIN_LOADING"}, {"error": true, "type": "AUTH/LOGIN_FAILURE"}]
        await store.dispatch(loginRequest('g1',''))
        await store.dispatch(loginRequest('','')).catch(()=>{
            expect(store.getActions()).toEqual(expectedActions)
        })
        expect(reducers(undefined,{type:'AUTH/LOGIN_LOADING'})).toEqual(initialState.setIn(['login', 'status'], 'WAITING'))
        expect(reducers(undefined,{type:'AUTH/LOGIN_SUCCESS',payload:{userId:'g1',verified:true}})).toEqual(initialState.setIn(['login', 'status'], 'SUCCESS')
                                                                                    .mergeIn(['status'], Map({verified: true, currentUser: 'g1'}))
                                                                                    .setIn(['status','isLoggedIn'],true))
        expect(reducers(undefined,{type:'AUTH/LOGIN_FAILURE'})).toEqual(initialState.setIn(['login','status'], 'FAILURE'))

    })
    it('getStatus actionCreator,reducer test',async()=>{
        mock.onGet('/api/account/getinfo').replyOnce(200,{info:{userId:'g1'}})
        .onGet('/api/account/getinfo').replyOnce(404)
        var expectedActions = [{"type": "AUTH/GET_STATUS_LOADING"}, {"payload": "g1", "type": "AUTH/GET_STATUS_SUCCESS"}, {"type": "AUTH/GET_STATUS_LOADING"}, {"error": true, "type": "AUTH/GET_STATUS_FAILURE"}]
        
        await store.dispatch(getStatusRequest())
        await store.dispatch(getStatusRequest()).catch(()=>{
            expect(store.getActions()).toEqual(expectedActions)
        })
        expect(reducers(undefined,{type:'AUTH/GET_STATUS_LOADING'})).toEqual(initialState.setIn(['status','isLoggedIn'], true))
        expect(reducers(undefined,{type:'AUTH/GET_STATUS_SUCCESS',payload:'g1'})).toEqual(initialState.mergeIn(['status'], Map({isLoggedIn: true, currentUser: 'g1'})))
        expect(reducers(undefined,{type:'AUTH/GET_STATUS_FAILURE'})).toEqual(initialState.setIn(['status','isLoggedIn'], false))

    })
    it('getAllInfo actionCreator,reducer test',()=>{
        //TODO
    })
    it('logout actionCreator,reducer test',()=>{
        mock.onPost('api/account/logout').reply(200)
        var expectedActions=[{"type": "AUTH/LOGOUT"}]
        store.dispatch(logoutRequest()).then(
            expect(store.getActions()).toEqual(expectedActions)
        )
        expect(reducers(initialState.setIn(['status','isLoggedIn'], true),{type:'AUTH/LOGOUT'})).toEqual(initialState.mergeIn(['status'], Map({isLoggedIn: false, currentUser: ''})))
    })
    it('clean actionCreator,reducer test',()=>{
        store.dispatch(cleanCurrentUser()).then(
            expect(store.getActions()).toEqual([{"type": "AUTH/CLEAN"}])
        )
        expect(reducers(initialState,{type:['AUTH/CLEAN']})).toEqual(initialState.setIn(['status','currentUser'],''))
    })
    it('findId actionCreator,reducer test',async()=>{
        mock.onPost('/api/account/findId',{name:'g1',email:'g1'}).reply(200,{userId:'g1'})
        var expectedActions = [{"type":'AUTH/FINDID_LOADING'},{'payload':'g1','type':'AUTH/FINDID_SUCCESS'},{"type": "AUTH/FINDID_LOADING"}, {"error": true, "type": "AUTH/FINDID_FAILURE"}]
        await store.dispatch(findId('g1','g1'))
        return store.dispatch(findId('g2','g2')).catch(()=>{
            expect(store.getActions()).toEqual(expectedActions)
        })
        expect(reducers(undefined,{type:'AUTH/FINDID_LOADING'})).toEqual(initialState.setIn(['findId','gottenId'],''))
        expect(reducers(undefined,{type:'AUTH/FINDID_SUCCESS',payload:'g1'})).toEqual(initialState.setIn(['findId','gottenId'],'g1'))
        expect(reducers(undefined,{type:'AUTH/FINDID_FAILURE'})).toEqual(initialState.setIn(['findId','gottenId'],''))

    })
    it('resendMail actionCreator,reducer test',()=>{
        mock.onPost('/api/account/resend',{email:'g1',userId:'g1'}).reply(200)
        store.dispatch(reSendEmail('g1','g1'))
        .then(
            expect(store.getActions()).toEqual([{"type": "AUTH/RESENDEMAIL"}])
        )
        // expect(reducers(initialState,{type:['AUTH/RESENDEMAIL']})).toEqual(initialState.setIn(['status','currentUser'],''))
   
    })
    it('pwdVerified actionCreator,reducer test',()=>{
        // TODO
    })

 

})