import React from 'react';
import styled from 'styled-components'



const RangeSlider = ({min, max, value, onChange, name}) => {
    return ( <StyledInput type='range' min={min} max={max} value={value} onChange={onChange} name={name}/> )
}
 

const StyledInput = styled.input`
    width: 100%;
    height: 10px;
    border-radius: 5px;
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    transition: opacity .2s;
    &:hover{
        opacity:1;
    }
    &::-webkit-slider-thumb {
        -webkit-appearance: none; /* Override default look */
        appearance: none;
        width: 25px; /* Set a specific slider handle width */
        height: 25px; /* Slider handle height */
        background: #4CAF50; /* Green background */
        cursor: pointer; /* Cursor on hover */
    }
    &::-moz-range-thumb {
        width: 25px;
        height: 25px;
        background: #4CAF50;
        cursor: pointer;
    }
` 
export default RangeSlider;

