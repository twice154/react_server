import React from 'react';
import styled from 'styled-components'
const ProgressBar = ({length}) => {
    return (
        <Container>
            <div style={{width:`${length}%`}}></div>
        </Container>
    )
}
const Container = styled.div`
background-color: #cacaca;
width:100%;
height:10px;
border:solid 1px black;
border-radius: 5px;
 div{
     background-color:#65a7ff;
     height:10px;
     width:0
     z-index:1
 }
`
 
export default ProgressBar;