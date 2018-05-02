import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import styled from 'styled-components'
import {Input} from '../styles/styles'


class Header extends Component {
	constructor(props) {
		super(props);
		this.state = { left:'',width:'',search:'' }
		this.setSliderCss=this.setSliderCss.bind(this)
		this.searchBarClick=this.searchBarClick.bind(this)
		this.handleChange=this.handleChange.bind(this)
		this.searching=this.searching.bind(this)
		// this.all=React.createRef()
		// this.follow=React.createRef()
		// this.storyBoard=React.createRef()
		// this.clip=React.createRef()
		// this.communication=React.createRef()
		// this.community=React.createRef()
		// this.slider=React.createRef()
			
			
		
		
	}
	componentDidMount(){
		var width= window.innerWidth
		if(width>1368){
			this.input.style.width='200px'

		}else if(width>1100){
			this.input.style.width='120px'
		}
		this.setSliderCss('all');
	}
	/**
	 * 실제로 검색하는 함수. 
	 * //TODO: popover를 밑에 내려서 트위치처럼 검색 내용을 보여줘야 한다.
	 */
	
	searching(){
		if(!this.state.search){
			return 0
		}else{
			//todo
		}
	}
	handleChange(e){
		this.setState({[e.target.name]:e.target.value})
	}
	/**
	 * searchBar를 늘이고 줄이는 함수.
	 */
	searchBarClick(){


	
	}

	setSliderCss(ref){
		console.log(ref)
		let el=this[ref]
		let slider = this.slider
		console.log(el)
		console.log(slider)
		slider.style.left=`${el.offsetLeft}px`
		slider.style.width=`${el.offsetWidth}px`
		console.log(slider.style)
	}

	
	render() { 
		/**로그인 버튼 */
		const loginButton = (

			<LoginButton className='btn-outline-primary' onClick={this.props.onLogin}><div>login</div></LoginButton>
	);
/**로그아웃 버튼 */
	const logoutButton = (
			<a onClick={this.props.onLogout}><i className="material-icons">lock_open</i></a>
	);
/**개인정보 수정,방송국 */
	const editPersonalInfo = (
		<div>
		<ButtonDropdown isOpen={this.props.dropdownOpen} toggle={this.props.toggle} >
        <StyledDropdownToggle caret color="btn btn-outline-primary">
		{this.props.currentUser}
        </StyledDropdownToggle>
        <DropdownMenu>
          <DropdownItem header> <li><Link to='/settings'> 정보수정 </Link></li></DropdownItem>
          <DropdownItem> <li><Link to='/broadcast/settings/broadcast'>방송국</Link></li></DropdownItem>
          <DropdownItem divider />
          <DropdownItem>{logoutButton}</DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
			
		</div>
	)

	return (
			<Container>

			
			<div className="row text-center">
				<div className='col left' >
				<div className='reacto'><div className='font'>Reacto | Connecto</div></div>
				</div>
				<div className="col">
				<CenterName to="/" >splendy</CenterName>
				</div>
				<div className="col text-right d-flex flex-row-reverse right">
				{this.props.isLoggedIn? editPersonalInfo : loginButton}
				<SearchingBar placeholder="search" >
			
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ref={el=>this.svg=el} onClick={this.searching}>
					<defs>
						<path id="a" d="M0 0h24v24H0z"/>
					</defs>
					<path fill="#65A7FF" fillRule="nonzero" d="M16.196 15.031a7.834 7.834 0 0 0 2.032-5.269c0-4.273-3.41-7.762-7.61-7.762-4.201 0-7.61 3.489-7.61 7.762 0 4.274 3.409 7.763 7.61 7.763 1.71 0 3.283-.574 4.557-1.546l5.659 5.772a.655.655 0 0 0 .964 0 .724.724 0 0 0 0-.995l-5.602-5.725zM4.386 9.762c0-3.5 2.788-6.357 6.232-6.357 3.432 0 6.233 2.845 6.233 6.357 0 3.513-2.79 6.358-6.233 6.358-3.444 0-6.233-2.857-6.233-6.358z"/>
				</svg>
				<input name='search' ref={el=>this.input=el} value={this.state.search} onChange={this.handleChange} placeholder='searching..'/>
				</SearchingBar>
				</div>
			</div>

			<Nav>
				<div><Link to="/"><span ref={el=>this.all=el} onClick={()=>{this.setSliderCss('all')}}>전체</span></Link></div>
				<div><Link to="/moonlight" > <span ref={el=>this.follow=el} onClick={()=>this.setSliderCss('follow')}>팔로우</span></Link></div>
				<div><Link to="/moonlight" ><span ref={el=>this.storyBoard=el} onClick={()=>this.setSliderCss('storyBoard')}>스토리보드</span></Link></div>
				<div><Link to="/moonlight"><span ref={el=>this.clip=el} onClick={()=>this.setSliderCss('clip')}>클립</span></Link></div>
				<div><Link to="/moonlight"><span ref={el=>this.communication=el} onClick={()=>this.setSliderCss('communication')}>소통</span></Link></div>
				<div><Link to="/moonlight"><span ref={el=>this.community=el} onClick={()=>this.setSliderCss('community')}>커뮤니티</span></Link></div>
				<Slider innerRef={el=>this.slider=el}></Slider>
			</Nav>
			</Container>

	)
	}
}
const Slider = styled.div`
position: absolute;
	bottom: 0;
    height: 3px;
    background: #65a7ff;
	transition: left .5s ease, width .5s ease;
`
const StyledDropdownToggle = styled(DropdownToggle)`
boruder-color:#65a7ff!important;
color:#65a7ff!important;
` 
const LoginButton = styled.button`
	width: 94px;
	height: 33px;
	border-radius: 7px;
	background-color: #ffffff;
	border: solid 1px #65a7ff;
	div{
		margin:auto;
		width: 48px;
		height: 19px;
		font-family: Cabin;
		font-size: 16px;
		font-weight: 500;
		font-style: normal;
		font-stretch: normal;
		line-height: normal;
		letter-spacing: 0.3px;
		text-align: center;
		color: #65a7ff;
	}
`
const Container = styled.div`
	width:100%
	padding-top:10px
	position:fixed;
	background-color:white;
	z-index:1;
	// border-bottom:solid 1px #cacaca;
	.reacto{
		width: 164px;
		height: 33px;
		border-radius: 7px;
		background-color: #65a7ff;
		.font{
			width: 131px;
			height: 19px;
			font-family: Cabin;
			font-size: 16px;
			font-weight: 500;
			font-style: normal;
			font-stretch: normal;
			line-height: normal;
			letter-spacing: 0.3px;
			text-align: center;
			color: #ffffff;
			margin:auto;
			padding-top: 8px;
		}
	}
	.left{
		margin-left:calc(10px + 5%);

	}
	.right{
		margin-right:calc(10px + 5%);
	}
`;
const SearchingBar= styled.div`
	position:relative;
	border: solid 1px #acacac;
	border-radius: 5px;
	margin-right:25px;
		input{
			font-family: Cabin;
			font-size: 16px;
			font-weight: 500;
			font-style: normal;
			font-stretch: normal;
			line-height: normal;
			letter-spacing: 0.3px;
			text-align: left;
			margin-left: 10px;

			width: 94px;
			height: 33px;
			border:none;
			
			margin-right:40px;
			right: 0;
			// transition: all .3s ease-in-out;
			&:focus{
			  outline:none;
			}
		}
		svg{
			z-index:1
			position:absolute;
			 width: 24px;
			 right:4px;
			height:24px;
			top:4px;
		}
		
`
const CenterName = styled(Link)`
	width: 105px;
	height: 34px;
	font-family: Cabin;
	font-size: 28px;
	font-weight: bold;
	font-style: normal;
	font-stretch: normal;
	line-height: normal;
	letter-spacing: 0.6px;
	text-align: center;
	color: #65a7ff;
	text-decoration:none !important;
	&:hover{
		color: #65a7ff !important;

	}
`
const Nav = styled.div`
height: 30px;
margin-left:calc(10px + 5%);
margin-top: 10px
display: flex;
	div{

	}
	a{
		margin-right:27px;
		font-family: NanumSquareB;
		font-size: 16px;
		letter-spacing: 0.3px;
		text-align: left;
		color: #acacac;
		text-decoration:none !important;
		&:hover{
			color: #65a7ff !important;
		}
		&:after{
			transition: 1s ease;
		}
	}

`

export default Header;

