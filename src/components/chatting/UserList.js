import React from 'react';
const UserList = (props) => {
	return (
		<div className='users'>
			Online Users
			<ul>

				{
					props.users.map?
						props.users.map((user, i) => {
							return (
								<li key={i}>
									{user}
								</li>
							);
						})
						: undefined
				}
			</ul>
		</div>
	);
};
export default UserList