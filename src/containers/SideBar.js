import React, { Component } from 'react';
import {connect} from 'react-redux'
import styled from 'styled-components'
import filterIcon from '../images/filterIcon.png'
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
                         <Images src={filterIcon}/>
                    </Buttons>
                    <Buttons>
                         <Images src={filterIcon}/>
                    </Buttons>
                    <Buttons>
                         <Images src={filterIcon}/>
                    </Buttons>
                    <Buttons>
                         <Images src={filterIcon}/>
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
`
const Images = styled.img`
width:60%;
height:60%;
margin:auto;
display:block;
`
const SideRemocon = styled.div`
margin-left: 50%;
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


