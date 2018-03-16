import React, { Component } from 'react';
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
            this.addHashTag(this.state.value)
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
            <div>
                <div>
                    {/* publisher부분 */}
                <div class='row'>
                    <video width="320" height="240" controls>
                    </video>
                </div>
                <div class="row">
                <div class='col s6'>
                <div class="row">
                    <div class="col s12">
                    방송제목:
                    <div class="input-field inline">
                    <input/>
                    </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col s12">
                    방송테마:
                    <div className="input-field inline">
                    <input/>
                    </div>
                    </div>
                </div>
                <div class="row">
                <div style={{border:'1px solid',cursor:'text'}}>
                    <div class="col s2">
                    태그:
                    </div>
                    <div class="col s11">
                    <ul id='hashTag'>
                        <li style={{width:'1px'}}>&nbsp;</li>
                        {this.state.tags.map((value,i)=>{
                            return <li key={i}>
                            <span >#</span>
                            <span >{value}</span>
                            <span style={{cursor:'pointer'}} onClick={()=>{
                                this.deleteTag(i)}}>(x)</span>
                        </li>
                        })}
                    </ul>
                    </div>
                    <div className="row">
                    <div className='col s10'>
                        <input  onBlur={this.addHashTag} onKeyPress={this.handleKeyPress} value ={this.state.value} onChange={this.handleChange}/>
                        </div>
                        <div className='col s2'>
                        <a class="waves-effect waves-light btn">확인</a>
                        </div>
                    </div>
                </div>
                 </div>
                <div class="row">
                    <div class="col s12">
                    방송제목:
                    <div class="input-field inline">
                    <input/>
                    </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col s12">
                    방송제목:
                    <div class="input-field inline">
                    <input/>
                    </div>
                    </div>
                </div>

                </div>
            </div>
            </div>
            </div>
         )
    }
}
 
export default Setting;