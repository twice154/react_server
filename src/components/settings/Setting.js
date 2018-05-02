import React, { Component } from 'react';
import styled from 'styled-components'
class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = { value:'',tags:[] }
        this.handleChange=this.handleChange.bind(this)
        this.handleKeyPress=this.handleKeyPress.bind(this)
        this.addHashTag=this.addHashTag.bind(this)
        this.deleteTag=this.deleteTag.bind(this)
    }
    handleChange(e){
        this.setState({value:e.target.value})
    }
    handleKeyPress(e){
        if(e.charCode===13){
            this.addHashTag()
        }
    }
    deleteTag(a){
        var arrays = this.state.tags
        console.log(a)
        arrays.splice(a,1)
        this.setState({tags:arrays})
    }
    addHashTag(){
        var arrays= this.state.tags
        arrays.push(this.state.value)
        this.setState({value:'',tags:arrays})
    }
    render() {

        return ( 
                <Container className='container-fluid'>
                <div>
                    <button onClick>방송 번호 받기</button>
                   
                </div>
                    {/* publisher부분 */}
                <div className='row'>
                    <video width="320" height="240" controls>
                    </video>
                </div>
                <div className="row">
                <div className='col s6'>
                <div className="row">
                    <div className="col s12">
                    방송제목:
                    <div className="input-field inline">
                    <input/>
                    </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col s12">
                    방송테마:
                    <div className="input-field inline">
                    <input/>
                    </div>
                    </div>
                </div>
                <div className="row">
                <div style={{border:'1px solid',cursor:'text'}}>
                    <div className="col s2">
                    태그:
                    </div>
                    <div className="col s11">
                    <ul id='hashTag'>
                        <li style={{width:'1px'}}>&nbsp;</li>
                        {this.state.tags.map((value,i)=>{
                            return (<li key={i}>
                            <span >#</span>
                            <span >{value}</span>
                            <span style={{cursor:'pointer'}} onClick={()=>{
                                this.deleteTag(i)}}>(x)</span>
                        </li>)
                        })}
                    </ul>
                    </div>
                    <div className="row">
                    <div className='col s10'>
                        <input  onKeyPress={this.handleKeyPress} value ={this.state.value} onChange={this.handleChange}/>
                        </div>
                        <div className='col s2'>
                        <a className="waves-effect waves-light btn">확인</a>
                        </div>
                    </div>
                </div>
                 </div>
                <div className="row">
                    <div className="col s12">
                    방송제목:
                    <div className="input-field inline">
                    <input/>
                    </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col s12">
                    방송제목:
                    <div className="input-field inline">
                    <input/>
                    </div>
                    </div>
                </div>

                </div>
            </div>
            </Container>
         )
    }
}
const Container = styled.div`
width:100%;
height:100%
overflow:auto;

    border:1px solid #cacaca;
    border-top:0;
`
 
export default Setting;