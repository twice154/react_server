import configureMockStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { registerRequest,newRegister,emailRequest,idRequest } from './register';
import reducers from './register'


describe('register test', () => {
    const customizedPromiseMiddleware = promiseMiddleware({
        promiseTypeSuffixes: ['LOADING', 'SUCCESS', 'FAILURE']
    });
  const middlewares = [customizedPromiseMiddleware,thunk];
  const mockStore = configureMockStore(middlewares);
  const initialState={
    regist:{
        status: 'INIT'
    },
    id:{
        status:'init',
        check:false
    },
    email:{
        status:'init',
        check:false
    }
}
    describe('actioncreator test',()=>{
        var mock = new MockAdapter(axios);
        const store = mockStore(initialState)
        afterEach(() => {
            // cleaning up the mess left behind the previous test
            mock.reset();
            store.clearActions()
        });
          it('registerRequest should regist data at server', () => {
              mock.onPost('/api/account/signup').reply(200)
              const expectedActions = [{"type": 'REGIST/REGISTER_LOADING'}, {"type": "REGIST/REGISTER_SUCCESS"}]

            return store.dispatch(registerRequest()).then(()=>{
                expect(store.getActions()).toEqual(expectedActions)
            })
            
        })
        it('registerRequest should not regist data at server', () => {
            mock.onPost('/api/account/signup').networkError()
            const expectedActions = [{"type": 'REGIST/REGISTER_LOADING'}, {"error": true, "type": "REGIST/REGISTER_FAILURE"}]

          return store.dispatch(registerRequest()).catch(()=>{
              expect(store.getActions()).toEqual(expectedActions)
          })
          
      })
        it('newRegister should put data to server', () => {
            mock.onPut('/api/account/userInfo',{id:''}).reply(200)
            const expectedActions = [{"type": 'REGIST/NEWREGIST_LOADING'}, {"type": "REGIST/NEWREGIST_SUCCESS"}]

          return store.dispatch(newRegister({id:''})).then(()=>{
              expect(store.getActions()).toEqual(expectedActions)
          })
          

        })
        it('newRegister should not put data to server', () => {
            mock.onPut('/api/account/userInfo',{id:''}).networkError()
            const expectedActions = [{"type": 'REGIST/NEWREGIST_LOADING'}, { "error": true,"type": "REGIST/NEWREGIST_FAILURE"}]

          return store.dispatch(newRegister({id:''})).catch(()=>{
              expect(store.getActions()).toEqual(expectedActions)
          })
          

        })
        it('idRequest check id from server', async () => {
            mock.onPost('/api/account/userIdcheck',{userId:'g1'}).reply(200)
            const expectedActions = [{"type": 'REGIST/ID_LOADING'}, {"type": "REGIST/ID_SUCCESS"},{"type": "REGIST/ID_LOADING"}, {"error": true, "type": "REGIST/ID_FAILURE"}]

          await store.dispatch(idRequest('g1'))
          return store.dispatch(idRequest('')).catch(()=>{
            expect(store.getActions()).toEqual(expectedActions)
        })
        })
        it('emailRequest check email from server', async() => {
            mock.onPost('/api/account/emailcheck',{email:'gq'}).reply(200)
            const expectedActions = [{"type": 'REGIST/EMAIL_LOADING'}, {"type": "REGIST/EMAIL_SUCCESS"},{"type": "REGIST/EMAIL_LOADING"}, {"error": true, "type": "REGIST/EMAIL_FAILURE"}]

           await store.dispatch(emailRequest('gq'))
           await store.dispatch(emailRequest('')).catch(()=>{
            expect(store.getActions()).toEqual(expectedActions)
        })
        })
        
        it('emailRequest should check id from server', () => {
        })

    })
    describe('reducer test',()=>{
        
        it('should return the initial state',()=>{
            expect(reducers(undefined,{})).toEqual(initialState)
        });
        it('should work at register',()=>{
            expect(reducers(undefined,{type:['REGIST/REGISTER_LOADING']})).toEqual({...initialState,regist:{ status:'LOADING'}})
            expect(reducers(undefined,{type:['REGIST/REGISTER_SUCCESS']})).toEqual({...initialState,regist:{status:'SUCCESS'}})
            expect(reducers(undefined,{type:['REGIST/REGISTER_FAILURE']})).toEqual({...initialState,regist:{ status:'FAILURE'}})
        })
        it('should work at newregist',()=>{
            expect(reducers(undefined,{type:['REGIST/NEWREGIST_LOADING']})).toEqual({...initialState})
            expect(reducers(undefined,{type:['REGIST/NEWREGIST_SUCCESS']})).toEqual({...initialState})
            expect(reducers(undefined,{type:['REGIST/NEWREGIST_FAILURE']})).toEqual({...initialState})
      
        })
        it('should work at id check',()=>{
            expect(reducers(undefined,{type:['REGIST/ID_LOADING']})).toEqual({...initialState,id:{...initialState.id, status:'loading'}})
            expect(reducers(undefined,{type:['REGIST/ID_SUCCESS']})).toEqual({...initialState,id:{check:true,status:'아이디를 사용할 수 있습니다.'}})
            expect(reducers(undefined,{type:['REGIST/ID_FAILURE']})).toEqual({...initialState, id:{check:false,status:'아이디가 이미 사용중입니다.'}})
      
        })
        it('should work at email check',()=>{
            expect(reducers(undefined,{type:['REGIST/EMAIL_LOADING']})).toEqual({...initialState, email:{...initialState.email,status:'loading'}})
            expect(reducers(undefined,{type:['REGIST/EMAIL_SUCCESS']})).toEqual({...initialState,email:{check:true,status:'이메일을 사용할 수 있습니다.'}})
            expect(reducers(undefined,{type:['REGIST/EMAIL_FAILURE']})).toEqual({...initialState,email:{check:false,status:'이메일이 이미 사용중입니다.'}})
      
        })
        
    })
  
});
