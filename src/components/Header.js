import React from 'react';
import {Link} from 'react-router-dom';
import {Dropdown, Button,NavItem} from 'react-materialize'

class Header extends React.Component {
	render(){
		const loginButton = (
			<li>
				<Link to="/login">
					<i className="material-icons">vpn_key</i>
				</Link>
			</li>
		);
/**로그인 버튼 */
		const logoutButton = (
			<li>
				<a onClick={this.props.onLogout}><i className="material-icons">lock_open</i></a>
			</li>
		);
/**개인정보 수정,방송국 */
		const editPersonalInfo = (
			<Dropdown trigger={
				<Button>{this.props.currentUser}(화살표)!</Button>
			  }>
			  <li><Link to='/settings'> 정보수정 </Link></li>
			  <li><Link to='/broadcast/setting'>방송국</Link></li>
				
			</Dropdown>
		)

		return (
			<div>
				<nav>
					<div className="nav-wrapper blue darken-1">
						<Link to="/" className="brand-logo center" >5437</Link>

						<ul>
							<li><Link to="/moonlight"><i className="material-icons">search</i></Link></li>
						</ul>

						<div className="right">
							<ul>
								{this.props.currentUser? editPersonalInfo:undefined}
								{this.props.isLoggedIn? logoutButton : loginButton}
							</ul>
						</div>
					</div>
				</nav>
				<nav>
					<div className="nav-wrapper blue darken-1">
						<ul>
							<li><Link to="/streamingList">전체</Link></li>
							<li><Link to="/moonlight">팔로우</Link></li>
							<li><Link to="/moonlight">스토리보드</Link></li>
							<li><Link to="/moonlight">클립</Link></li>
							<li><Link to="/moonlight">소통</Link></li>
							<li><Link to="/moonlight">커뮤니티</Link></li>
						</ul>
					</div>
				</nav>
			</div>
		)
	}
}



export default Header;