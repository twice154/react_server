import React from 'react';
import sea from '../images/9799380_m.jpg'
import styled from 'styled-components'
const MainVideo = () => {
    return (
        <Container>
        <video />
        {/* todo width 상황별로 크기 맞추기. */}
        </Container>
    )
}
const Container = styled.div`
position:relative
background-image:url('http://www.futureearth.org/sites/default/files/styles/full_width_desktop/public/p6050044_0.jpg?itok=TbqgXAAK');
background-size: 100% 100%;
height:300px;
width:100%;
 video{
     display:block;
     margin:auto;
 }
 img{
     position:absolute;
     top:0;
     left:47%;
    display:block;
    margin-top:80px;   
 }
`
 
export default MainVideo;
