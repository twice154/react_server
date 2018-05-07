import React, { Component } from 'react';
import styled from 'styled-components'
class Dropdowns extends Component {
    
      constructor(props) {
        super(props);
        this.state = {  }
      }
      render() { 
        return ( 
          <div className={this.props.className}>
        <Dropdown>
          <div className='title' onClick={this.props.toggle}>{this.props.title}  <span></span></div> 
          {this.props.open?
          
            <ClickOutside toggle={this.props.toggle}>
              {this.props.children}
            </ClickOutside>

          :undefined
        }
          
        </Dropdown>
        </div>
      )}
    
}
const Dropdown = styled.div`
  span{
    display:inline-block; width:0; height:0; border-style:solid; border-width:4px;
    border-color:#56a7ff transparent transparent transparent;

  }
 .title{
   cursor:pointer;
 }
 .dropdownMenu{
   position:absolute;
   width:100px;
   background-color:white;
   border:solid 1px #acacac;
   border-radius:5px;
 }
`
 
export default Dropdowns;

class ClickOutside extends Component{
    constructor(props) {
      super(props);
      this.state = {  }
      this.setWrapperRef = this.setWrapperRef.bind(this);
      this.handleClickOutside = this.handleClickOutside.bind(this);
      this.wrapperRef=React.createRef();
  }
  componentDidMount() {
      document.addEventListener('mousedown', this.handleClickOutside);
    }

  componentWillUnmount() {
      document.removeEventListener('mousedown', this.handleClickOutside);
  }
  /**
  * Set the wrapper ref
  */
  setWrapperRef(node) {
  this.wrapperRef = node;
  }

  /**
  * Alert if clicked on outside of element
  */
  handleClickOutside(event) {
  if (this.wrapperRef && !this.wrapperRef.contains(event.target)&& event.target.className!=='title') {
    this.props.toggle()
  }
  }
  render() { 
      return ( <div ref={this.setWrapperRef} className='dropdownMenu'>{this.props.children}</div> )
  }
}