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
            <div style={{paddingLeft:'16px'}}>
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
width:100%
    .float{
        position:relative;
        float:left;
        cursor:pointer;
        margin-top:10px;
        margin-bottom:25px;
        margin-left: 16px;
        width:calc(33.3% - 16px);
        padding-top:calc(81.25% * 0.333);
        height:0;
    }
@media screen and (min-width: 1010px){
    .float{
        width:calc(25% - 16px);
        padding-top:calc(81.25% * 0.25);
    }
}
@media screen and (min-width: 1265px){
    .float{
        width:calc(20% - 16px);
        padding-top:calc(81.25% * 0.2);
    }
}
@media screen and (min-width: 1591px){
    .float{
        width:calc(16.66% - 16px);
        padding-top:calc(81.25% * 0.1667);
    }
}


`


export default StreamingLists;