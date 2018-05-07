import React, { Component } from 'react';
import {connect} from 'react-redux'
import styled from 'styled-components'
import filterIcon from '../images/filterIcon.png'
import profile1 from '../images/profile1.jpeg'
import profile2 from '../images/profile2.png'
import profile3 from '../images/profile3.jpeg'
import profile4 from '../images/profile4.jpeg'

import {Tooltip} from 'reactstrap'
class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return (
                <SideRemocon>
                    <Buttons>
                         <Images src={filterIcon}/>
                         {/* <Tooltip placement="right" isOpen={this.state.tooltipOpen} target="TooltipExample" toggle={this.toggle}>
                            Hello world!
                            </Tooltip> */}
                    </Buttons>
                    <Live>Live</Live>
                    <Buttons>
                         <img className='profile' src={profile1}/>
                    </Buttons>
                    <Buttons>
                         <img className='profile' src={profile2}/>
                    </Buttons>
                    <Buttons>
                         <img className='profile' src={profile3}/>
                    </Buttons>
                    <Buttons>
                         <img className='profile' src={profile4}/>
                    </Buttons>

                </SideRemocon>

    )
    }
}
const Buttons= styled.div`
width:48px;
height:48px;
border-radius: 100%;
border : solid 1px #65a7ff;
display:flex;
margin-bottom:5px;
.profile{
    width:100%;
    height:100%;
    border-radius:50%
    overflow:hidden;
}
`
const Images = styled.img`
width:60%;
height:60%;
margin:auto;
display:block;
`
const SideRemocon = styled.div`
margin-left: calc(5vw + 10px);
width:48px;
margin-top:50px;
position:sticky;
top: 250px;
`
const Live = styled.div`
font-family: NanumSquareEB;
  font-size: 15px;
  letter-spacing: 0.6px;
  text-align: center;
  color: #65a7ff;
  margin-top:30px;
`
export default SideBar;


