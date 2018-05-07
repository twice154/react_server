/**
 * todo: reacto test 고치가
 */


import configureMockStore from 'redux-mock-store'; //mocking store
import promiseMiddleware from 'redux-promise-middleware';//for mocking store
import thunk from 'redux-thunk'//for mocking store
import MockAdapter from 'axios-mock-adapter'//mocking axios
import axios from 'axios'
import {setReactoSetting, getReactoSettingForStreamer, getReactoSettingForViewer} from './reacto'
import reducers from './reacto'


describe('reacto test',()=>{
    const customizedPromiseMiddleware = promiseMiddleware({
        promiseTypeSuffixes: ['LOADING', 'SUCCESS', 'FAILURE']
    });
  const middlewares = [customizedPromiseMiddleware,thunk];
  const mockStore = configureMockStore(middlewares);

  const initialState ={
    reactoSettingForStreamer:{percent:50,resetTime:'5'},
    data:{resetTime:5,percent:50}
}

    var mock = new MockAdapter(axios);
    const store = mockStore(initialState)
    afterEach(() => {
        // cleaning up the mess left behind the previous test
        mock.reset();
        store.clearActions()
    });
    it('setReactoSetting test 세팅정보를 저장한다..',async ()=>{
        mock.onPut('/api/reacto',{No1_content:'야 임마',Type:'limitByPercent'}).replyOnce(200)
            .onPut('/api/reacto',{No1_content:'야 임마',Type:'limitByPercent'}).replyOnce(403,{message:'fail'})
        await store.dispatch(setReactoSetting({No1_content:'야 임마',Type:'limitByPercent'})).catch(err=>console.log(err))
        await store.dispatch(setReactoSetting({No1_content:'야 임마',Type:'limitByPercent'})).catch(err=>console.log(err))
        expect(store.getActions()).toEqual([{"type": "REACTO/SET_REACTO_SETTING"}])
    })
    it('getReactoSettingForStreamer test ',async()=>{
        mock.onGet('/api/reacto').replyOnce(200,{success:true,data:{No1_content:'야 임마',Type:'limitByPercent'}})
            .onGet('/api/reacto').replyOnce(200,{success:false})
            .onGet('/api/reacto').replyOnce(403,{message:'fail'})
        var expectedActions=[{"type": "REACTO/GET_REACTO_SETTING_FOR_STREAMER_LOADING"}, {"payload": {"No1_content": "야 임마", "Type": "limitByPercent"}, "type": "REACTO/GET_REACTO_SETTING_FOR_STREAMER_SUCCESS"}, {"type": "REACTO/GET_REACTO_SETTING_FOR_STREAMER_LOADING"}, {"error": true, "type": "REACTO/GET_REACTO_SETTING_FOR_STREAMER_FAILURE"}, {"type": "REACTO/GET_REACTO_SETTING_FOR_STREAMER_LOADING"}, {"error": true, "type": "REACTO/GET_REACTO_SETTING_FOR_STREAMER_FAILURE"}]
        await store.dispatch(getReactoSettingForStreamer()).catch(err=>console.log(err))
        await store.dispatch(getReactoSettingForStreamer()).catch(err=>console.log(err))
        await store.dispatch(getReactoSettingForStreamer()).catch(err=>console.log(err))
        expect(store.getActions()).toEqual(expectedActions)
    })
    it('getReactoSettingForViewer test ',async()=>{
        mock.onGet('/api/reacto/g1').replyOnce(200,{success:true,data:{No1_content:'야 임마',Type:'limitByPercent'}})
            .onGet('/api/reacto/g1').replyOnce(200,{success:false})
            .onGet('/api/reacto/g1').replyOnce(403,{message:'fail'})
        var expectedActions=[{"type": "REACTO/GET_REACTO_SETTING_FOR_VIEWER_LOADING"}, {"payload": {"No1_content": "야 임마", "Type": "limitByPercent"}, "type": "REACTO/GET_REACTO_SETTING_FOR_VIEWER_SUCCESS"}, {"type": "REACTO/GET_REACTO_SETTING_FOR_VIEWER_LOADING"}, {"error": true, "type": "REACTO/GET_REACTO_SETTING_FOR_VIEWER_FAILURE"}, {"type": "REACTO/GET_REACTO_SETTING_FOR_VIEWER_LOADING"}, {"error": true, "type": "REACTO/GET_REACTO_SETTING_FOR_VIEWER_FAILURE"}]
        await store.dispatch(getReactoSettingForViewer('g1')).catch(err=>console.log(err))
        await store.dispatch(getReactoSettingForViewer('g1')).catch(err=>console.log(err))
        await store.dispatch(getReactoSettingForViewer('g1')).catch(err=>console.log(err))
        expect(store.getActions()).toEqual(expectedActions)
    })
})