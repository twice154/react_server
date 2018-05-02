import React from 'react';
import styled from 'styled-components'
import ProgressBar from './ProgressBar';
const Reacto = ({reacto,room,appendchilds,reactos}) => {
    return (
        <ReactoContainer className='container'>
            <div className='row'>
                <div className='col' onClick={()=>reacto(1)}>
                {appendchilds[0].map((value,index)=>{
                    return value
                })}
                <img alt='reactoButton'width='110' height='55'src={`http://localhost:3000/static/ERs/${room}_No1_img.png`}
                // 확장자명을 바꿔줘야 할 수 도 있음. TODO
                onError={(e)=>{e.target.onerror = null; e.target.src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png"}} />
                <ProgressBar length={reactos[0]}/>
                </div>
                <div className='col' onClick={()=>reacto(2)}>
                {appendchilds[1].map((value,index)=>{
                    return value
                })}
                <img alt='reactoButton'width='110' height='55'src={`http://localhost:3000/static/ERs/${room}_No2_img.png`}
                // 확장자명을 바꿔줘야 할 수 도 있음. TODO
                onError={(e)=>{e.target.onerror = null; e.target.src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png"}} />
                <ProgressBar length={reactos[1]}/>
                </div>
                <div className='col' onClick={()=>reacto(3)}>
                {appendchilds[2].map((value,index)=>{
                    return value
                })}
                <img alt='reactoButton'width='110' height='55'src={`http://localhost:3000/static/ERs/${room}_No3_img.png`}
                // 확장자명을 바꿔줘야 할 수 도 있음. TODO
                onError={(e)=>{e.target.onerror = null; e.target.src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png"}} />
                                <ProgressBar length={reactos[2]}/>
                </div>

                </div>
            <div className='row'>
                <div className='col' onClick={()=>reacto(4)}>
                {appendchilds[3].map((value,index)=>{
                    return value
                })}
                <img alt='reactoButton'width='110' height='55'src={`http://localhost:3000/static/ERs/${room}_No4_img.png`}
                // 확장자명을 바꿔줘야 할 수 도 있음. TODO
                onError={(e)=>{e.target.onerror = null; e.target.src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png"}} />
                                <ProgressBar length={reactos[3]}/>
                </div>
                <div className='col' onClick={()=>reacto(5)}>
                {appendchilds[4].map((value,index)=>{
                    return value
                })}<img alt='reactoButton'width='110' height='55'src={`http://localhost:3000/static/ERs/${room}_No5_img.png`}
                // 확장자명을 바꿔줘야 할 수 도 있음. TODO
                onError={(e)=>{e.target.onerror = null; e.target.src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png"}} />
                                <ProgressBar length={reactos[4]}/>
                </div>
                <div className='col' onClick={()=>reacto(6)}>
                {appendchilds[5].map((value,index)=>{
                    return value
                })}
                <img alt='reactoButton'width='110' height='55'src={`http://localhost:3000/static/ERs/${room}_No6_img.png`}
                // 확장자명을 바꿔줘야 할 수 도 있음. TODO
                onError={(e)=>{e.target.onerror = null; e.target.src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png"}} />
                                <ProgressBar length={reactos[5]}/>
                </div>
                </div>

        </ReactoContainer>
    )
}
const ReactoContainer= styled.div`
 .row{
     .col{
        border: solid black 1px;
        padding:0
     }
 }
` 
export default Reacto;