import React from 'react';
import './ChatInput.css';

const ChatInput = ({ 
  inputMessage, 
  onInputChange, 
  onSendMessage, 
  quickReplies, 
  showQuickReplies,
  onQuickReply 
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() !== '') {
      onSendMessage(e);
    }
  };

  return (
    <>
      {/* Quick Replies */}
      {showQuickReplies && quickReplies && quickReplies.length > 0 && (
        <div className="mychatbox-quick-replies">
          <p className="mychatbox-quick-replies-label">Quick replies:</p>
          <div className="mychatbox-quick-replies-buttons">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                className="mychatbox-quick-reply-btn"
                onClick={() => onQuickReply(reply)}
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="mychatbox-chat-input-wrapper">
        <form onSubmit={handleSubmit} className="mychatbox-chat-input-form">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Type your message here..."
            className="mychatbox-chat-input"
          />
          <button
            type="submit"
            className="mychatbox-chat-send-btn"
            disabled={inputMessage.trim() === ''}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </form>
      </div>
    </>
  );
};

export default ChatInput;
