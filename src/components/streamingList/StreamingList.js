import React from 'react';
import styled from 'styled-components'
const StreamingList = ({src,person}) => {
    return (
        <Container>
        <div className='curtain'></div>
        <img className='thumbnail'src={src} alt='thumbnail'/>
           <div className='info'>
               <div className='streamingName'>이름은 김지원이요 호는 멋쟁이라. 그래서 사람들은 그를 멋쟁이 김지원이라 불렀다.</div>
               <img src='https://t1.daumcdn.net/thumb/R200x0/?fname=http%3A%2F%2Fimg1.daumcdn.net%2Fkakaotv%2FCHANNEL%2F2927669%2Fprofile%2F20171018002429' className='streamerThumbnail' alt='streamerThumbnail' />
               <div className='streamerName'>bj호빗</div>
               <div className='viewerCounts'><img src={person} className="person"alt='person'width='15' height='15'/>5000</div>
           </div>
        </Container>
    )
}
const Container =styled.div`
position:relative;
height:100%
border-radius: 10px;
overflow:hidden;
.streamingName{
    position:absolute;
    top:0;
    overflow:hidden;
    padding:5px;
    width: 100%;
    height: 25px;
    font-family: NanumSquareB;
    font-size: 15px;
}
.streamerName{
    position:absolute;
    bottom:3px;
    left:34px;
    width: 103px;
  height: 18px;
  font-family: NanumSquareR;
  font-size: 13px;
}
.streamerThumbnail{
    position:absolute;
    bottom:0;
    left:5px;
    width: 24px;
    height: 24px;
    border-radius:50%;
}
.viewerCounts{
    position:absolute;
    bottom:3px;
    right:5px;
    height: 18px;
    font-family: NanumSquareR;
    font-size: 13px;
}
.curtain{
    display:none;
    position:absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0,0,0,.45);
    z-index: 2;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 8%;
}
.info{
    position:absolute;
    background-color:white;
    bottom:0;
    width:100%;
    height:55px;
}
.thumbnail{
    width:232px;
    height:130.5px;
}
.person{
    padding-bottom:2px;
    filter: opacity(0.7);
}
 &:hover{

    .curtain{
        display:block;
    }
    .info{
        z-index:3;
        height:80px;
    }
    .streamingName{
        height:50px;
    }
 }
`

 
export default StreamingList;