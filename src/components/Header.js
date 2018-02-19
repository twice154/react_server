import React from 'react';
import {Link} from 'react-router-dom';

class Header extends React.Component {
	render(){
		const loginButton = (
			<li>
				<Link to="/login">
					<i className="material-icons">vpn_key</i>
				</Link>
			</li>
		);

		const logoutButton = (
			<li>
				<a onClick={this.props.onLogout}><i className="material-icons">lock_open</i></a>
			</li>
		);

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
								{this.props.isLoggedIn? logoutButton : loginButton}
							</ul>
						</div>
					</div>
				</nav>
			</div>
		)
	}
}



export default Header;