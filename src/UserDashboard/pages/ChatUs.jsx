import React, { useState, useEffect, useRef } from 'react';
import '../styles/ChatUs.css';

const ChatUs = () => {
  // Sample property owners data - Replace with actual data from your backend
  const [propertyOwners] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      propertyTitle: 'Luxury 3BHK Apartment in Koregaon Park',
      propertyType: 'Apartment',
      location: 'Koregaon Park, Pune',
      price: '₹1.2 Cr',
      image: 'https://via.placeholder.com/60',
      lastMessage: 'Is the property still available?',
      lastMessageTime: '10:30 AM',
      unread: 2,
      status: 'online'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      propertyTitle: '2BHK Flat for Rent in Hinjewadi',
      propertyType: 'Flat',
      location: 'Hinjewadi, Pune',
      price: '₹25,000/month',
      image: 'https://via.placeholder.com/60',
      lastMessage: 'When can I schedule a visit?',
      lastMessageTime: 'Yesterday',
      unread: 0,
      status: 'offline'
    },
    {
      id: 3,
      name: 'Amit Patel',
      propertyTitle: 'Commercial Space in Baner',
      propertyType: 'Commercial',
      location: 'Baner, Pune',
      price: '₹85 Lac',
      image: 'https://via.placeholder.com/60',
      lastMessage: 'Thank you for the information',
      lastMessageTime: '2 days ago',
      unread: 0,
      status: 'offline'
    },
    {
      id: 4,
      name: 'Sneha Desai',
      propertyTitle: 'Villa with Garden in Wakad',
      propertyType: 'Villa',
      location: 'Wakad, Pune',
      price: '₹2.5 Cr',
      image: 'https://via.placeholder.com/60',
      lastMessage: 'Are pets allowed?',
      lastMessageTime: '3 days ago',
      unread: 1,
      status: 'online'
    },
    {
      id: 5,
      name: 'Vikram Singh',
      propertyTitle: 'Studio Apartment in Viman Nagar',
      propertyType: 'Studio',
      location: 'Viman Nagar, Pune',
      price: '₹18,000/month',
      image: 'https://via.placeholder.com/60',
      lastMessage: 'Can we negotiate the rent?',
      lastMessageTime: '1 week ago',
      unread: 0,
      status: 'offline'
    }
  ]);

  const [selectedOwner, setSelectedOwner] = useState(propertyOwners[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hello! I'm interested in your property: ${propertyOwners[0].propertyTitle}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: 2,
      text: "Hello! Thank you for your interest. The property is available for viewing. When would you like to schedule a visit?",
      sender: 'owner',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatMessagesRef = useRef(null);

  // Lock page scroll position - prevent any scrolling
  useEffect(() => {
    // Lock scroll on mount
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Auto scroll to bottom when new messages arrive - ONLY scroll the chat container
  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle owner selection
  const handleOwnerSelect = (owner) => {
    setSelectedOwner(owner);
    setIsSidebarOpen(false);
    // Load messages for selected owner - Replace with actual API call
    setMessages([
      {
        id: 1,
        text: `Hello! I'm interested in your property: ${owner.propertyTitle}`,
        sender: 'user',
        timestamp: '09:30 AM'
      },
      {
        id: 2,
        text: "Hello! Thank you for your interest. The property is available for viewing. When would you like to schedule a visit?",
        sender: 'owner',
        timestamp: '09:32 AM'
      }
    ]);
  };

  // Simulate owner response
  const getOwnerResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi')) {
      return "Hi! How can I help you with this property?";
    } else if (message.includes('visit') || message.includes('viewing') || message.includes('see')) {
      return "I'm available for property viewings on weekdays between 10 AM - 6 PM and weekends 11 AM - 4 PM. Which day works best for you?";
    } else if (message.includes('price') || message.includes('negotiate')) {
      return `The listed price is ${selectedOwner.price}. We can discuss this further during the property viewing.`;
    } else if (message.includes('available')) {
      return "Yes, the property is currently available. Would you like to schedule a visit?";
    } else if (message.includes('amenities') || message.includes('facilities')) {
      return "The property includes parking, 24/7 security, gym, swimming pool, and power backup. Would you like more details?";
    } else if (message.includes('document') || message.includes('papers')) {
      return "All property documents are clear and verified. I can share them during our meeting.";
    } else {
      return "Thank you for your message. I'll get back to you shortly with the details.";
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (inputMessage.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate owner typing and response
    setTimeout(() => {
      setIsTyping(false);
      const ownerMessage = {
        id: messages.length + 2,
        text: getOwnerResponse(inputMessage),
        sender: 'owner',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, ownerMessage]);
    }, 1500);
  };

  const quickReplies = [
    "When can I visit?",
    "Is it still available?",
    "Tell me about amenities",
    "Can we negotiate price?"
  ];

  const handleQuickReply = (reply) => {
    setInputMessage(reply);
  };

  return (
    <div className="buyer-chat-us-container">
      <div className="buyer-chat-us-wrapper">
        {/* Left Sidebar - Property Owners List */}
        <div className={`buyer-chat-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="buyer-sidebar-header">
            <h2>Conversations</h2>
            <button 
              className="buyer-sidebar-close-btn"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              ×
            </button>
          </div>
          
          <div className="buyer-owners-list">
            {propertyOwners.map((owner) => (
              <div
                key={owner.id}
                className={`buyer-owner-card ${selectedOwner.id === owner.id ? 'active' : ''}`}
                onClick={() => handleOwnerSelect(owner)}
              >
           
                
                <div className="buyer-owner-info">
                  <div className="buyer-owner-header">
                    <h3>{owner.name}</h3>
                    <span className="buyer-message-time">{owner.lastMessageTime}</span>
                  </div>
                  
                  <div className="buyer-property-info">
                    <p className="buyer-property-title">{owner.propertyTitle}</p>
                    <p className="buyer-property-location">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      {owner.location}
                    </p>
                  </div>
                  
                  <div className="buyer-owner-footer">
                    <p className="buyer-last-message">{owner.lastMessage}</p>
                    {owner.unread > 0 && (
                      <span className="buyer-unread-badge">{owner.unread}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="buyer-chat-main">
          {/* Chat Header */}
          <div className="buyer-chat-header">
            <button 
              className="buyer-sidebar-toggle-btn"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            </button>
            
            <div className="buyer-chat-header-content">
              <div className="buyer-chat-header-avatar">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
              </div>
              
              <div className="buyer-chat-header-info">
                <h1>{selectedOwner.name}</h1>
              </div>
            </div>
          </div>
          
          {/* Chat Messages Area */}
          <div className="buyer-chat-messages" ref={chatMessagesRef}>
            <div className="buyer-chat-messages-container">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`buyer-message ${message.sender === 'user' ? 'buyer-message-user' : 'buyer-message-owner'}`}
                >
                  <div className="buyer-message-content">
                    <p>{message.text}</p>
                    <span className="buyer-message-timestamp">{message.timestamp}</span>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="buyer-message buyer-message-owner">
                  <div className="buyer-message-content buyer-typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Replies */}
          {messages.length <= 3 && (
            <div className="buyer-quick-replies">
              <p className="buyer-quick-replies-label">Quick replies:</p>
              <div className="buyer-quick-replies-buttons">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    className="buyer-quick-reply-btn"
                    onClick={() => handleQuickReply(reply)}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="buyer-chat-input-wrapper">
            <form onSubmit={handleSendMessage} className="buyer-chat-input-form">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message here..."
                className="buyer-chat-input"
              />
              <button
                type="submit"
                className="buyer-chat-send-btn"
                disabled={inputMessage.trim() === ''}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUs;