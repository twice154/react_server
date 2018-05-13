import React from 'react';
import styled from 'styled-components'
const ProgressBar = ({length}) => {
    return (
        <Container>
            <div style={{height:`${length}%`}}></div>
        </Container>
    )
}
const Container = styled.div`
position:absolute;
right:3px;
top:3px;
width:10px;
height:41px;
border:solid 1px black;
border-radius: 5px;
 div{
     position:absolute;
     background-color:#65a7ff;
     height:0;
     bottom:0;
     width:100%
     z-index:1
 }
`
 
export default ProgressBar;