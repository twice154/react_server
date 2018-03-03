import React from 'react';

const SettingsComponent = ({info,push,quit}) => {
    
    
    console.log(info)
    const userInfo = info.toJS()
    console.log(userInfo,'hi')
    return (<div>
        <div className="container auth">
				
				<div className="card">
					<div className="header blue white-text center">
						<div className="card-content">개인정보</div>
					</div>
				
                <div className="card-content">
                <div className="row">
                <div style={{cursor:'pointer'}} onClick={()=>{push('nickname')} }>
                    <div className="input-field col s6">
                    닉네임:
                    </div>
                    <div className="input-field col s6">
                        <div >
                            {userInfo.nickname}
                        </div>
                    </div>
                </div>
                <div style={{cursor:'pointer'}} onClick={()=>{push('password')}}>
                    <div className="input-field col s12">
                    비밀번호 수정
                    </div>
                </div>
                <div style={{cursor:'pointer'}} onClick={()=>{push('email')}}>
                    <div className="input-field col s6">
                    이메일:
                    </div>
                    <div className="input-field col s6">
                        <div >
                            {userInfo.email}
                        </div>
                    </div>
                </div>
                
               <div style={{cursor:'pointer'}} onClick={()=>{push('phone')}}>
                    <div className="input-field col s6">
                    휴대폰:
                    </div>
                    <div className="input-field col s6">
                        <div >
                            {userInfo.phone}
                        </div>
                    </div>
                </div>
                
                         </div>
        
                    </div>

                    <button onClick={quit}>탈퇴하기</button>
                </div>
            </div>
    </div>)
}
 
export default SettingsComponent;