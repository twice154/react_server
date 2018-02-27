/**
 * 인증되었다는 것을 보여주는 페이지. 서버의 verified와 연결되어 있음
 * 
 * @author G1
 * @logs // 18.2.25
 */
import React from 'react';
import {Link} from 'react-router-dom'

const Verified = () => {
    return (
        <div>
            인증되었습니다! 다시 로그인해주세요 
            <p><Link to ='/login'>로그인하기</Link></p>
        </div>
    )
}
 
export default Verified;