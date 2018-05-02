/**
 * TODO: webRTC update
 * @author G1
 * @logs // 18.2.25
 */

import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components'
import first from '../../images/1.png'
import second from '../../images/2.png'
import third from '../../images/3.png'
import fourth from '../../images/4.png'
import fifth from '../../images/5.png'
import fifth2 from '../../images/6.png'
import fifth3 from '../../images/7.png'
import fifth4 from '../../images/8.png'
import fifth5 from '../../images/9.png'
import fifth6 from '../../images/10.png'
import fifth7 from '../../images/11.png'
import fifth8 from '../../images/12.png'
import person from '../../images/person.png'
import StreamingList from './StreamingList'
// import { StreamingListContainer } from '../containers';

function onGetStreams(props){
    return props.getStreams()
        .catch(err=>{
            console.log(err);
        })
}

const StreamingLists = ({push}) => {
    return (
        <Container>
            <div style={{paddingLeft:'10px'}}>
            전체
            </div>


           <div className='float' onClick={push} >
           <StreamingList src={first} person={person}/>
           </div>
           <div className='float'>
           <StreamingList src={second} person={person}/>

           </div>
           <div className='float'>
           <StreamingList src={third} person={person}/>
           </div>
           <div className='float'>
           <StreamingList src={fourth} person={person}/>
           </div>
           <div className='float'>
           <StreamingList src={fifth} person={person}/>
           </div>
           <div className='float '>
           <StreamingList src={fifth2} person={person}/>
           </div>
           <div className='float'>
           <StreamingList src={fifth3} person={person}/>
           </div>
           <div className='float'>
           <StreamingList src={fifth4} person={person}/>
           </div>
           <div className='float'>
           <StreamingList src={fifth5} person={person}/>
           </div>
           <div className='float'>
           <StreamingList src={fifth6} person={person}/>
           </div>
           <div className='float'>
           <StreamingList src={fifth7} person={person}/>
           </div>
           <div className='float'>
           <StreamingList src={fifth8} person={person}/>
           </div>
           <div className='float'>
           <StreamingList src={fourth} person={person}/>
           </div>
           <div className='float'>
           <StreamingList src={fifth} person={person}/>
           </div>
           <div className='float'>
           <StreamingList src={third} person={person}/>
           </div>
           <div className='float'>
           <StreamingList src={fifth2} person={person}/>
           </div>
           <div className='float'>
           <StreamingList src={fifth3} person={person}/>
           </div>
           <div className='float'>
           <StreamingList src={fifth4} person={person}/>
           </div>
           <div className='float'>
           <StreamingList src={fifth5} person={person}/>
           </div>
           

            
          
            {/* <div id="streams">
            {props.streamingList?
            props.streamingList.toJS().map((stream, i)=>
                (<div key={i}>
                    <li><Link to={props.getStreamLink(stream.name)}>
                    <h3>{stream.name}</h3>
                    <img
                        style={{width: 160, height: 90}}
                        src={stream.thumbnail}
                        alt={"thumnail"}
                    />
                    </Link>
                    </li>
                </div>)
            ): undefined}
            </div> */}
        </Container>
    );
};
const Container=styled.div`
margin-top:36px;
font-family: NanumSquareB;
font-size: 20px;
letter-spacing: 0.4px;
margin:auto;
    .float{
        float:left;
        margin-top:10px;
        margin-bottom:25px;
        padding:0 10px;
        cursor:pointer;
        height:185px;
        
    }
@media screen and (min-width: 763px){
    // 210+790
    width:508px;
}
@media screen and (min-width: 1015px){
    // 210+790
    width:760px;
}
@media screen and (min-width: 1267px){
    margin:auto;
    width:1012px;
}
@media screen and (min-width: 1519px){
    margin:auto;
    width:1264px;
}
@media screen and (min-width: 1771px){
    margin:auto;
    width:1516px;
}

`
const Images = styled.img`
width:232px;
height:130.5px;
`
const ListContainer=styled.div`
height:200px;
width:100px
`

export default StreamingLists;