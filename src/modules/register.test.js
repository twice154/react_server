import configureMockStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { registerRequest,newRegister,emailRequest,idRequest,phoneRequest,nicknameRequest } from './register';
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
    idCheck:false
    ,
    emailCheck:false
    ,
    phoneCheck:false,
    nicknameCheck:false
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
              mock.onPost('/api/users').reply(200)
              const expectedActions = [{"type": 'REGIST/REGISTER_LOADING'}, {"type": "REGIST/REGISTER_SUCCESS"}]

            return store.dispatch(registerRequest()).then(()=>{
                expect(store.getActions()).toEqual(expectedActions)
            }).catch(err=>console.log(err))
            
        })
        it('registerRequest should not regist data at server', () => {
            mock.onPost('/api/users').reply(400,{message:'fail'})
            const expectedActions = [{"type": 'REGIST/REGISTER_LOADING'}, {"error": true, 'payload':'fail', "type": "REGIST/REGISTER_FAILURE"}]

          return store.dispatch(registerRequest()).catch((err)=>{
              expect(store.getActions()).toEqual(expectedActions)
              expect(err).toBe('fail')
          })
          
      })
        it('newRegister should put data to server', () => {
            mock.onPut('/api/users/g1/email',{email:'g1@naver.com'}).reply(200)
            const expectedActions = [{"type": 'REGIST/NEWREGIST_LOADING'}, {"type": "REGIST/NEWREGIST_SUCCESS"}]

          return store.dispatch(newRegister({email:'g1@naver.com'},'g1')).then(()=>{
              expect(store.getActions()).toEqual(expectedActions)
          }).catch(err=>console.log(err,'1'))
          

        })
        it('newRegister should not put data to server', () => {
            mock.onPut('/api/users/g1/email',{email:'g1@naver.com'}).reply(400,{message:'fail'})
            const expectedActions = [{"type": 'REGIST/NEWREGIST_LOADING'}, { "error": true, 'payload':'fail', "type": "REGIST/NEWREGIST_FAILURE"}]

          return store.dispatch(newRegister({email:'g1@naver.com'},'g1')).catch((err)=>{
              expect(store.getActions()).toEqual(expectedActions)
              expect(err).toBe('fail')
          })
          

        })
        it('idRequest check id from server', async () => {
            mock.onGet('/api/check/duplication/userId/g1').replyOnce(200,{success:true})
                 .onGet('/api/check/duplication/userId/g1').replyOnce(400,{message:'fail'})
            const expectedActions = [{"type": 'REGIST/ID_LOADING'}, {"type": "REGIST/ID_SUCCESS"},{"type": "REGIST/ID_LOADING"}, {"error": true, 'payload':'fail', "type": "REGIST/ID_FAILURE"}]

          await store.dispatch(idRequest('g1')).catch(err=>console.log(err))
          return store.dispatch(idRequest('g1')).catch((err)=>{
            expect(store.getActions()).toEqual(expectedActions)
            expect(err).toBe('fail')
        })
        })
        it('emailRequest check email from server', async() => {
            mock.onGet('/api/check/duplication/email/g1@naver.com').replyOnce(200,{success:true})
                .onGet('/api/check/duplication/email/g1@naver.com').replyOnce(400,{message:'fail'})
            const expectedActions = [{"type": 'REGIST/EMAIL_LOADING'}, {"type": "REGIST/EMAIL_SUCCESS"},{"type": "REGIST/EMAIL_LOADING"}, {"error": true, 'payload':'fail', "type": "REGIST/EMAIL_FAILURE"}]

           await store.dispatch(emailRequest('g1@naver.com')).catch(err=>console.log(err))
           await store.dispatch(emailRequest('g1@naver.com')).catch((err)=>{
            expect(store.getActions()).toEqual(expectedActions)
            expect(err).toBe('fail')
        })
        })
        
        it('phoneRequest should check phone number from server', async() => {
            mock.onGet('/api/check/duplication/phone/000-0000-0000').replyOnce(200,{success:true})
                .onGet('/api/check/duplication/phone/000-0000-0000').replyOnce(400,{message:'fail'})
            const expectedActions = [{"type": 'REGIST/PHONE_LOADING'}, {"type": "REGIST/PHONE_SUCCESS"},{"type": "REGIST/PHONE_LOADING"}, {"error": true, 'payload':'fail', "type": "REGIST/PHONE_FAILURE"}]

           await store.dispatch(phoneRequest('000-0000-0000')).catch(err=>console.log(err))
           await store.dispatch(phoneRequest('000-0000-0000')).catch((err)=>{
            expect(store.getActions()).toEqual(expectedActions)
            expect(err).toBe('fail')
        })
        })
        it('nicknameREquest should check nickname at server', async() => {
            mock.onGet('/api/check/duplication/nickname/g1').replyOnce(200,{success:true})
                .onGet('/api/check/duplication/nickname/g1').replyOnce(400,{message:'fail'})
            const expectedActions = [{"type": 'REGIST/NICKNAME_LOADING'}, {"type": "REGIST/NICKNAME_SUCCESS"},{"type": "REGIST/NICKNAME_LOADING"}, {"error": true, 'payload':'fail', "type": "REGIST/NICKNAME_FAILURE"}]

           await store.dispatch(nicknameRequest('g1')).catch(err=>console.log(err))
           await store.dispatch(nicknameRequest('g1')).catch((err)=>{
            expect(store.getActions()).toEqual(expectedActions)
            expect(err).toBe('fail')
        })
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
            expect(reducers(undefined,{type:['REGIST/ID_LOADING']})).toEqual({...initialState})
            expect(reducers(undefined,{type:['REGIST/ID_SUCCESS']})).toEqual({...initialState,idCheck:true})
            expect(reducers(undefined,{type:['REGIST/ID_FAILURE']})).toEqual({...initialState, idCheck:false})
      
        })
        it('should work at email check',()=>{
            expect(reducers(undefined,{type:['REGIST/EMAIL_LOADING']})).toEqual({...initialState})
            expect(reducers(undefined,{type:['REGIST/EMAIL_SUCCESS']})).toEqual({...initialState,emailCheck:true})
            expect(reducers(undefined,{type:['REGIST/EMAIL_FAILURE']})).toEqual({...initialState,emailCheck:false})
      
        })
        it('should work at phone check',()=>{
            expect(reducers(undefined,{type:['REGIST/PHONE_LOADING']})).toEqual({...initialState})
            expect(reducers(undefined,{type:['REGIST/PHONE_SUCCESS']})).toEqual({...initialState,phoneCheck:true})
            expect(reducers(undefined,{type:['REGIST/PHONE_FAILURE']})).toEqual({...initialState,phoneCheck:false})
      
        })
        
    })
  
});
