import React from 'react';
import styled from 'styled-components'
import ProgressBar from './ProgressBar';
import gap from '../../images/gap.jpg'
const Reacto = ({reacto,room,appendchilds,reactos}) => {
    return (
        <ReactoContainer className='container' id='reactoContainer' draggable={false}>
            
            <div className='row'>
                <div className='col' onClick={()=>reacto(1)}>
                {appendchilds[0].map((value,index)=>{
                   
                    return value
                })}
                <div className='text a'>
                그뤠잇!
                </div >
                <ProgressBar length={reactos[0]}/>
                </div>
                <div className='col' onClick={()=>reacto(2)}>
                {appendchilds[1].map((value,index)=>{
                    return value
                })}
                <div className='text b'>
                    꿀잼~
                </div >
               <ProgressBar length={reactos[1]}/>
                </div>
                <div className='col' onClick={()=>reacto(3)}>
                {appendchilds[2].map((value,index)=>{
                    return value
                })}<div className='text c'>        
                이거
                    <br/> 실화냐?
            </div >
               <ProgressBar length={reactos[2]}/>
                </div>

                </div>
            <div className='row'>
                <div className='col' onClick={()=>reacto(4)}>
                {appendchilds[3].map((value,index)=>{
                    return value
                })}
                <img width='60' height='35' src={gap}/>
               <ProgressBar length={reactos[3]}/>
                </div>
                <div className='col' onClick={()=>reacto(5)}>
                {appendchilds[4].map((value,index)=>{
                    return value
                })}<div className='text e'>
                스튜핏!
            </div ><ProgressBar length={reactos[4]}/>
                </div>
                <div className='col' onClick={()=>reacto(6)}>
                {appendchilds[5].map((value,index)=>{
                    return value
                })}
                <ProgressBar length={reactos[5]}/>
                </div>
                </div>

        </ReactoContainer>
    )
}
const ReactoContainer= styled.div`
 position:relative;
 border: solid 1px black;
 padding:5px;

 .row{
     padding: 0 5px;
     .col{
         position:relative;
         height:50px;
         border: solid 1px black;
         cursor:pointer;
        margin: 4px;
        img{
            margin-top:5px;
        }
      
        .text{
            margin-top:5px;
            text-align:center;
            margin-left: -12px;
            font-weight: 600;
            line-height:20px;
            font-size:18px;
        }
        .a{
            margin-top: 12px; !important;

            color: #23809e;
        }
        .b{ 
            margin-top: 12px; !important;
            margin-left: -8px !important;
            color:#2e5bad;
        }
        .c{
            color:#9e2374;
        }
        .d{
            color:#2e5bad;
        }
        .e{
            margin-top: 12px; !important;

            color:#824646;
        }
        .f{
            color:#2e5bad;
        }
     }
 }
` 
export default Reacto;