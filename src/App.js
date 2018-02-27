/**
 * Router를 모아둠
 * @author G1
 * @logs // 18.2.25
 */

import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {HeaderContainer, Login,Find, Verify, Verified, Register, StreamingListContainer,
        StreamingView,SpeedTestContainer, MoonlightContainer,Settings, ChangeInfo, PwdCheck} from 'containers';
import {Payment} from './components';
import {Provider} from 'react-redux';
import store from './store';

/** path별 설명
 * '/' -홈페이지를 로딩함 (headerContatiner는 항상 로딩됨)
 * '/verifiy' - 이메일 인증이 되지 않은 사용자에게 인증할 수 있는 컴포넌트를 제공하는 페이지.
 * '/verified' - 인증 메일의 클릭을 누르면 로딩되어 인증 확인을 알리는 페이지.
 * '/login' - 로그인 페이지
 * '/register' - 회원가입
 * '/find' - 아이디, 비밀번호 찾기
 * '/player/:streamname' - 방송을 보는 페이지
 *  @param streamname - 스트리머 이름 (url param으로 전달.)
 * '/moonlight' - conneto를 관리하는 페이지
 * '/speedtest' - 클라이언트들의 속도를 측정하는 페이지
 * '/settings' - 개인정보 수정 페이지(표시만해줌)
 * '/settings/:typename' - 개인정보를 직접적으로 수정하는 페이지
 * @param typename - 수정하는 타입 (ex. password, nickname, email, phone)
 * '/pwdcheck/:typename' - password,email,phone은 중요한 정보, 수정하기 전 비밀번호를 한번 더 입력해야함.
 * @param typename - 수정하는 타입 (ex. password, email, phone)
 * 
 */
const App = ()=>(
    <div>  
        <Route path="/" render={(props)=>(<HeaderContainer {...props}/>)}/>
        <Switch>
            <Route path="/" exact component={StreamingListContainer}/>
            <Route path='/verify' component={Verify}/>
            <Route path='/verified' component={Verified}/>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path='/find' component={Find}/>
            <Route path="/player/:streamname"  component={StreamingView}/>
            <Route path="/moonlight" component={MoonlightContainer} />
            <Route path="/pay" component={Payment} />
            <Route path="/speedtest" component={SpeedTestContainer}/>
            <Route path='/settings' exact component={Settings}/>
            <Route path='/settings/:typename' component={ChangeInfo}/>
            <Route path='/pwdcheck/:typename' component={PwdCheck}/>
        </Switch> 
    </div>
)

const Root = () =>(
    <Provider store = {store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>
);

export default Root;