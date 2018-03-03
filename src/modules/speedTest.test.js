import configureMockStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import {getSpeedRequest} from './speedTest'
import reducers from './speedTest'
import {Map, fromJS} from 'immutable'


describe('스피드 테스트가 잘 작동 하는지.', () => {
    const customizedPromiseMiddleware = promiseMiddleware({
        promiseTypeSuffixes: ['LOADING', 'SUCCESS', 'FAILURE']
    });
  const middlewares = [customizedPromiseMiddleware,thunk];
  const mockStore = configureMockStore(middlewares);
    describe('actioncreator test',()=>{
        var mock = new MockAdapter(axios);
        const store = mockStore({ status: 'INIT',
            data: {}})
        afterEach(() => {
            // cleaning up the mess left behind the previous test
           mock.reset();
           store.clearActions()//store에 저장된 actions들을 클린해줌
          
        });
          it('getSpeedRequest should get data from server',  () => {
              
            mock.onPost('/api/speedtest').reply(200, {
                    data:{ ip: 1, downspeed: 'John Smith', upspeed:'1000mbps' }
                      
            });
            axios.post('/api/speedtest')
                .then(function(response) {
                  console.log(response.data.data);
                });
            const expectedActions = [{"type": 'NETWORK/GET_SPEED_LOADING'}, {"payload": {"downspeed": "John Smith", "ip": 1, "upspeed": "1000mbps"}, "type": "NETWORK/GET_SPEED_SUCCESS"}]
              
           
         
            return store.dispatch(getSpeedRequest()).then(() => {
              
              // return of async actions
              expect(store.getActions()).toEqual(expectedActions)
            })
           

        })
        it("getSpeedRequest shouldn't get data from server", () => {
              
            mock.onPost('/api/speedtest').networkError()
           
            const expectedActions = [{"type": "NETWORK/GET_SPEED_LOADING"}, {"error": true, "type": "NETWORK/GET_SPEED_FAILURE"}]

              
         
            return store.dispatch(getSpeedRequest()).catch(() => {
                //catch로 받은 이유는 mockstore.dispatch가 된후 error 가 리턴되었다.
                // -->아직 redux-promise-middleware가 실행되지 않았다.
           
              // return of async actions
              expect(store.getActions()).toEqual(expectedActions)

            })
        })

    })
    describe('reducers test',()=>{
        var data ={ ip: 1, downspeed: 'John Smith', upspeed:'1000mbps' }
        it('should return the initial state',()=>{
            expect(reducers(undefined,{})).toEqual(Map({status: "INIT", data: Map({})}))
        })
        it('should handle GET_SPEED_LOADING',()=>{
            expect(reducers(Map({status: "INIT", data: Map({})}),{type:['GET_SPEED_LOADING'],payload:data})).toEqual(Map({status:"WAITING", data:Map({})}))
        });
        it('should handle GET_POST_START',()=>{
            expect(reducers(Map({status: "INIT", data: Map({})}),{type:['GET_SPEED_SUCCESS'],payload:data})).toEqual(Map({status:"SUCCESS", data:fromJS(data)}))

        });
        it('should handle GET_POST_FAIL',()=>{
            expect(reducers(Map({status: "INIT", data: Map({})}),{type:['GET_SPEED_FAILURE'],payload:data})).toEqual(Map({status:"FAILURE", data:Map({})}))

        });
    })
  
});
