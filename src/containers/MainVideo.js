import React from 'react';
import sea from '../images/9799380_m.jpg'
import styled from 'styled-components'
const MainVideo = () => {
    return (
        <Container>
        <video width='1100px' height='100%'/>
        <img src='https://cdn0.iconfinder.com/data/icons/startup-and-design-1/24/29-128.png'/>
        </Container>
    )
}
const Container = styled.div`
position:relative
background-color:black;
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
