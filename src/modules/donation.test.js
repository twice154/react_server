import configureMockStore from 'redux-mock-store'; //mocking store
import promiseMiddleware from 'redux-promise-middleware';//for mocking store
import thunk from 'redux-thunk'//for mocking store
import MockAdapter from 'axios-mock-adapter'//mocking axios
import axios from 'axios'
import { getDonationSetting, getThumbnail, videoDonation, getTheNumberOfToken } from './donation'
import reducers from './donation'

describe('donation test',()=>{
    const customizedPromiseMiddleware = promiseMiddleware({
        promiseTypeSuffixes: ['LOADING', 'SUCCESS', 'FAILURE']
    });
  const middlewares = [customizedPromiseMiddleware,thunk];
  const mockStore = configureMockStore(middlewares);
  const initialState = {
    thumbnail:'',
    videoSuccess:false,
    tokenNumber:-1,
    donationSetting:{
        state:false,
        settings:{}
    }
}

    var mock = new MockAdapter(axios);
    const store = mockStore(initialState)
    afterEach(() => {
        // cleaning up the mess left behind the previous test
        mock.reset();
        store.clearActions()
    });
    it('getDonationSetting actioncreator,reducer test',async()=>{
        mock.onGet('/api/donation/setting').replyOnce(200,{success:true,data:{settings:{a:1,b:2}}})
            .onGet('/api/donation/setting').replyOnce(403,{message:'fail'})
            var expectedActions = [{"type": "DONATION/GETDONATIONSETTING_LOADING"}, {"payload": {"a": 1, "b": 2}, "type": "DONATION/GETDONATIONSETTING_SUCCESS"}, {"type": "DONATION/GETDONATIONSETTING_LOADING"}, {"error": true, "payload": "fail", "type": "DONATION/GETDONATIONSETTING_FAILURE"}]
        await store.dispatch(getDonationSetting()).catch(err=>console.log(err))
        await store.dispatch(getDonationSetting()).catch((err)=>{
            expect(store.getActions()).toEqual(expectedActions)
            expect(err).toBe('fail')
        })
        expect(reducers(undefined,{type:'DONATION/DONATIONSETTING_LOADING'})).toEqual(initialState)
        expect(reducers(undefined,{type:'DONATION/DONATIONSETTING_SUCCESS',payload:{a:1,b:2}})).toEqual({...initialState, donationSetting:{settings:{a:1,b:2}, state:true}})
        expect(reducers(undefined,{type:'DONATION/DONATIONSETTING_FAILURE'})).toEqual({...initialState, donationSetting:{settings:{}, state:false}})
    })
    
    it('getThumbnail actioncreator,reducer test',async()=>{
        mock.onGet('/api/donation/thumbnail').replyOnce(200,{data:{thumbnail:'juso'}})
            .onGet('/api/donation/thumbnail').replyOnce(403,{message:'fail'})
            var expectedActions =  [{"type": "DONATION/THUMBNAIL_LOADING"}, {"payload": "juso", "type": "DONATION/THUMBNAIL_SUCCESS"}, {"type": "DONATION/THUMBNAIL_LOADING"}, {"error": true, "payload": "fail", "type": "DONATION/THUMBNAIL_FAILURE"}]
        await store.dispatch(getThumbnail()).catch(err=>console.log(err))
        await store.dispatch(getThumbnail()).catch((err)=>{
            expect(store.getActions()).toEqual(expectedActions)
            expect(err).toBe('fail')
        })
        expect(reducers(undefined,{type:'DONATION/THUMBNAIL_LOADING'})).toEqual(initialState)
        expect(reducers(undefined,{type:'DONATION/THUMBNAIL_SUCCESS',payload:'juso'})).toEqual({...initialState,thumbnail:'juso'})
        expect(reducers(undefined,{type:'DONATION/THUMBNAIL_FAILURE'})).toEqual({...initialState})
    })
    it('videoDonation actioncreator,reducer test',async()=>{
        mock.onPost('/api/donation/donation/video',{url:'juso'}).replyOnce(200)
            .onPost('/api/donation/donation/video',{url:'juso'}).replyOnce(403,{message:'fail'})
            var expectedActions =  [{"type": "DONATION/VIDEO_LOADING"}, {"type": "DONATION/VIDEO_SUCCESS"}, {"type": "DONATION/VIDEO_LOADING"}, {"error": true, "payload": "fail", "type": "DONATION/VIDEO_FAILURE"}]
        await store.dispatch(videoDonation({url:'juso'})).catch(err=>console.log(err))
        await store.dispatch(videoDonation({url:'juso'})).catch((err)=>{
            expect(store.getActions()).toEqual(expectedActions)
            expect(err).toBe('fail')
        })
        expect(reducers(undefined,{type:'DONATION/VIDEO_LOADING'})).toEqual(initialState)
        expect(reducers(undefined,{type:'DONATION/VIDEO_SUCCESS'})).toEqual({...initialState})
        expect(reducers(undefined,{type:'DONATION/VIDEO_FAILURE'})).toEqual({...initialState})
    })
    it('getTheNUmberOfToken actioncreator,reducer test',async()=>{
        mock.onGet('/api/donation/token').replyOnce(200,{data:{token:227}})
            .onGet('/api/donation/token').replyOnce(403,{message:'fail'})
            var expectedActions =  [{"type": "DONATION/TOKEN_LOADING"}, {"payload": 227, "type": "DONATION/TOKEN_SUCCESS"}, {"type": "DONATION/TOKEN_LOADING"}, {"error": true, "payload": "fail", "type": "DONATION/TOKEN_FAILURE"}]
        await store.dispatch(getTheNumberOfToken()).catch(err=>console.log(err))
        await store.dispatch(getTheNumberOfToken()).catch((err)=>{
            expect(store.getActions()).toEqual(expectedActions)
            expect(err).toBe('fail')
        })
        expect(reducers(undefined,{type:'DONATION/TOKEN_LOADING'})).toEqual(initialState)
        expect(reducers(undefined,{type:'DONATION/TOKEN_SUCCESS',payload:227})).toEqual({...initialState,tokenNumber:227})
        expect(reducers(undefined,{type:'DONATION/TOKEN_FAILURE'})).toEqual({...initialState})
    })

})