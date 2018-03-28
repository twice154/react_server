import React from 'react';
import {Link} from 'react-router-dom';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { StyleSheet, css } from 'aphrodite';


const Header = ({onLogin,onLogout,currentUser,isLoggedIn,dropdownOpen,toggle}) => {
	const loginButton = (

			<button className={`btn-outline-primary ${css(styles.login)}`} onClick={onLogin}><div className={css(styles.loginFont)}>login</div></button>
	);
/**로그인 버튼 */
	const logoutButton = (
			<a onClick={onLogout}><i className="material-icons">lock_open</i></a>
	);
/**개인정보 수정,방송국 */
	const editPersonalInfo = (
		<div>
		<ButtonDropdown isOpen={dropdownOpen} toggle={toggle} >
        <DropdownToggle caret color="btn btn-outline-danger">
		{currentUser}
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem header> <li><Link to='/settings'> 정보수정 </Link></li></DropdownItem>
          <DropdownItem> <li><Link to='/broadcast/setting'>방송국</Link></li></DropdownItem>
          <DropdownItem divider />
          <DropdownItem>{logoutButton}</DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
		 
		 
		
		</div>
	)
	
	return (
			<div className={`container-fluid ${css(styles.header)}`} >
			<div className="row text-center">
				<div className={`col-sm`+ css(styles.left)} >
				<div className={css(styles.reacto)}><div className={css(styles.font)}>Reacto | Connecto</div></div>
				</div>
				<div className="col-sm">
				<Link to="/" className={css(styles.link)} > <h1 className={css(styles.splendy)}>splendy</h1></Link>
				</div>
				<div className="col-sm text-right" style={{marginRight:'30px'}}>
				<input className={css(styles.searchBarInput, styles.input)} name="search" placeholder="search"/>
				{isLoggedIn? editPersonalInfo : loginButton}
						
				</div>
			</div>
			<nav className='navbar navbar-expand-sm navbar-light bg-light'>
				<div className="nav-wrapper blue darken-1">
					<ul className="navbar-nav mr-auto">
						<li className="nav-item active"><Link className="nav-link" to="/streamingList">전체</Link></li>
						<li className="nav-item active"><Link className="nav-link" to="/moonlight">팔로우</Link></li>
						<li className="nav-item active"><Link className="nav-link" to="/moonlight">스토리보드</Link></li>
						<li className="nav-item active"><Link className="nav-link" to="/moonlight">클립</Link></li>
						<li className="nav-item active"><Link className="nav-link" to="/moonlight">소통</Link></li>
						<li className="nav-item active"><Link className="nav-link" to="/moonlight">커뮤니티</Link></li>
					</ul>
				</div>
			</nav>
			</div>

	)
}
const styles = StyleSheet.create({
	input:{
		border:'1px solid #65a7ff',
		fontSize:'12px',
		height: '30px',
		padding: '4px 8px',
	},
    header: {
        paddingTop:'10px', position:'fixed', backgroundColor:'white',zIndex:'1'
    },
	reacto:{
		width: '170px',
  		height:' 36px',
 		borderRadius: '7px',
  		backgroundColor: '#65a7ff',
	},
	splendy:{
		margin:'auto',
		width: '105px',
		height: '34px',
		fontFamily: 'Cabin',
		fontSize: '28px',
		fontWeight: 'bold',
		fontStyle: 'normal',
		fontStretch: 'normal',
		lineHeight: 'normal',
		letterSpacing: '0.6px',
		textAlign: 'center',
		color: '#65a7ff',
	},
	link:{
		textDecoration:'none'
	},
	font:{  width: '131px',
		height: '19px',
		fontFamily: 'Cabin',
		fontSize: '16px',
		fontWeight: '500',
		fontStyle: 'normal',
		fontStretch: 'normal',
		lineHeight: 'normal',
		letterSpacing: '0.3px',
		textAlign: 'center',
		color: '#ffffff',
		margin:'auto',
		paddingTop:'9px'
	  },
	login:{
		width: '94px',
		height: '36px',
		borderRadius: '7px',
		border: 'solid 1px #65a7ff',
	},
	loginFont:{
		width: '48px',
		height: '19px',
		fontFamily: 'Cabin',
		fontSize: '16px',
		fontWeight: '500',
		letterSpacing: '0.3px',
		textAlign: 'center',
		color: '#65a7ff',
		margin:'auto'
	},
	searchBarInput:{
		marginRight:'5px',
		borderRadius: '15px',
		right: '0',
		transition: 'all .3s ease-in-out',
		width: '30%',
		':focus': {
		  width: 'calc(100% - 100px)',
		  outline:'none'
		}
	}
		 

});
export default Header;
