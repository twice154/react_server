import React from 'react';

const MessageList = (props) => {
	return (
		<div className='messages' ref={props.scrollRef} style={{height:'70%', overflow: 'auto', wordBreak:'break-all'}}>
			Conversation :
			{
				props.messages ?
					props.messages.map((message, i) => {
						return (
							<Message
								key={i}
								user={message.user}
								text={message.text}
							/>
						);
					})
					: undefined
			}
		</div>
	);
}
export default MessageList
export const Message = (props) => {
	return (
		<div className="message">
			<strong>{props.user} :</strong>
			<span>{props.text}</span>
		</div>
	);
};