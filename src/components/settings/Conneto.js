import React, { Component } from 'react';
import styled from 'styled-components'

class Conneto extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        const Container = styled.div`
        width:100%;
        height:85%

            border:1px solid #cacaca;
            border-top:0;
        `
        return ( <Container>hi</Container> )
    }
}
 
export default Conneto;