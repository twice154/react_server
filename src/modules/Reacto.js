import { handleActions} from 'redux-actions';
import axios from 'axios';

const SET_REACTO_SETTING = 'REACTO/SET_REACTO_SETTING'
const GET_REACTO_SETTING_FOR_STREAMER ='REACTO/GET_REACTO_SETTING_FOR_STREAMER'
const GET_REACTO_SETTING_FOR_STREAMER_LOADING ='REACTO/GET_REACTO_SETTING_FOR_STREAMER_LOADING'
const GET_REACTO_SETTING_FOR_STREAMER_SUCCESS ='REACTO/GET_REACTO_SETTING_FOR_STREAMER_SUCCESS'
const GET_REACTO_SETTING_FOR_STREAMER_FAILURE ='REACTO/GET_REACTO_SETTING_FOR_STREAMER_FAILURE'


const GET_REACTO_SETTING_FOR_VIEWER ='REACTO/GET_REACTO_SETTING_FOR_VIEWER'
const GET_REACTO_SETTING_FOR_VIEWER_LOADING ='REACTO/GET_REACTO_SETTING_FOR_VIEWER_LOADING'
const GET_REACTO_SETTING_FOR_VIEWER_SUCCESS ='REACTO/GET_REACTO_SETTING_FOR_VIEWER_SUCCESS'
const GET_REACTO_SETTING_FOR_VIEWER_FAILURE ='REACTO/GET_REACTO_SETTING_FOR_VIEWER_FAILURE'


const initialState ={
    reactoSettingForStreamer:{percent:50,resetTime:'5'},
    data:{resetTime:5,percent:50}
}

 /**
     * 스트리머가 방송 세팅할때 리엑토 세팅하기전에 저장되어 있던 리엑토 세팅을 받아오는 함수.
     */
    function getReactoSettingForStreamerRequest(){
        console.log('11')
        return axios.get('/api/reacto')
                    .then((res)=>{
                        if(res.data.success){
                            console.log(res.data.data.settings)
                            return Promise.resolve(res.data.data.settings)
                        }else{
                            return Promise.reject()
                        }
                       
                    },err=>{
                        if(err.response.data.message){
                            console.log(err.response.data.message)
                        }else {console.log(err)}
                       return Promise.reject()
                    })
    }
     /**
     * 시청자가 리엑토 버튼을 누르기 위해서 스트리머가 정해놓은 정보를 받아오는 함수.
     */
    function getReactoSettingForViewerRequest(streamerId){
        return axios.get('/api/reacto/'+streamerId)
                    .then((res)=>{
                        if(res.data.success){
                            console.log(res.data.data)
                            return Promise.resolve(res.data.data)
                        }else{
                            return Promise.reject()
                        }
                       
                    },err=>{
                        if(err.response.data.message){
                            console.log(err.response.data.message)
                        }else {console.log(err)}
                        return Promise.reject()
                    })
    }


/**
 * 리엑토 세팅을 새롭게 저장하거나 업데이트 할 수 있게.
 * @param {object} a 지금은 db에 저장하는 애들만 일단 있다. 
 * a={No1_content,No2_content,No3_content,No4_content,No5_content,No6_content,
 *  Type:'limitByPercent or limitByTime',PercentCiriticalPoint,TimeCiriticalPoint}
 * TODO: 이때 여러정보가 같이 가야 되는데, 이미지, 음성파일 혹은 동영상을 담을 수 있게 해야한다.-한개의 콘텐츠에 하나씩.
 * by.G1
 */
export function setReactoSetting(a){
    console.log(a)
  return (dispatch)=>{
    return axios.put('/api/reacto',a).then(()=>{
        console.log('hihihi')
        dispatch({type:SET_REACTO_SETTING})
    })
                .catch(err=>{
                    if(err.response.data.message){
                        console.log(err.response.data.message)
                    }else console.log(err)
                })
  }
}


export const getReactoSettingForStreamer=()=>({
    type:GET_REACTO_SETTING_FOR_STREAMER,
    payload: getReactoSettingForStreamerRequest()
})

export const getReactoSettingForViewer=(streamerId)=>({
    type:GET_REACTO_SETTING_FOR_VIEWER,
    payload: getReactoSettingForViewerRequest(streamerId)
})



export default handleActions({
   

    [GET_REACTO_SETTING_FOR_STREAMER_LOADING]:(state,action)=>{
        return {...state}
    },
    [GET_REACTO_SETTING_FOR_STREAMER_SUCCESS]:(state,action)=>{
        //fobiddens가 string으로 저장되어 있었으므로  array로 다시 돌려준다.
        return {...state, reactoSettingForStreamer:action.payload}
    },
    [GET_REACTO_SETTING_FOR_STREAMER_FAILURE]:(state,action)=>{
        return {...state}
    },
    [GET_REACTO_SETTING_FOR_VIEWER_LOADING]:(state,action)=>{
        return {...state}
    },
    [GET_REACTO_SETTING_FOR_VIEWER_SUCCESS]:(state,action)=>{
        //fobiddens가 string으로 저장되어 있었으므로  array로 다시 돌려준다.
        return {...state, data:action.payload}
    },
    [GET_REACTO_SETTING_FOR_VIEWER_FAILURE]:(state,action)=>{
        return {...state}
    },
    [SET_REACTO_SETTING]:(state,action)=>{
        return{...state}
    },
  
},initialState)