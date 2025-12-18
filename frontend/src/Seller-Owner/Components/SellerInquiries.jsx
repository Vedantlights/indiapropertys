// src/pages/SellerInquiries.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useProperty } from './PropertyContext';
import { useAuth } from '../../context/AuthContext';
import { generateChatRoomId, listenToMessages, sendMessage as firebaseSendMessage, createOrGetChatRoom } from '../../services/firebase.service';
import '../styles/SellerInquiries.css';

const SellerInquiries = () => {
  const { inquiries, properties, updateInquiryStatus } = useProperty();
  const { user } = useAuth();
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProperty, setFilterProperty] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState({});
  const [activeTab, setActiveTab] = useState('details');
  const [selectedChatRoomId, setSelectedChatRoomId] = useState(null);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, selectedInquiry, activeTab]);

  // Filter inquiries
  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesStatus = filterStatus === 'all' || inquiry.status === filterStatus;
    const matchesProperty =
      filterProperty === 'all' || inquiry.propertyId === parseInt(filterProperty);
    const matchesSearch =
      inquiry.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesProperty && matchesSearch;
  });

  // Stats
  const stats = {
    total: inquiries.length,
    new: inquiries.filter(i => i.status === 'new').length,
    read: inquiries.filter(i => i.status === 'read').length,
    replied: inquiries.filter(i => i.status === 'replied').length
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleSelectInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
    setActiveTab('details');
    if (inquiry.status === 'new') {
      updateInquiryStatus(inquiry.id, 'read');
    }

    // Setup chat room ID for this inquiry if we have buyer + property + seller
    if (user && inquiry.buyerId && inquiry.propertyId) {
      const chatRoomId = generateChatRoomId(inquiry.buyerId, user.id, inquiry.propertyId);
      setSelectedChatRoomId(chatRoomId);
    } else {
      setSelectedChatRoomId(null);
    }
  };

  const handleReply = () => {
    if (!replyText.trim() || !selectedInquiry) return;

    updateInquiryStatus(selectedInquiry.id, 'replied');
    setReplyText('');
    setShowReplyModal(false);
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !selectedInquiry || !user) return;

    if (!selectedInquiry.buyerId || !selectedInquiry.propertyId) {
      alert('Buyer or property information not available for chat.');
      return;
    }

    const messageText = chatMessage.trim();
    setChatMessage('');

    try {
      // Ensure chat room exists in Firebase and get its ID
      const chatRoomId = await createOrGetChatRoom(
        selectedInquiry.buyerId,
        user.id,
        user.user_type || 'seller',
        selectedInquiry.propertyId
      );

      setSelectedChatRoomId(chatRoomId);

      // Send message to Firebase
      await firebaseSendMessage(
        chatRoomId,
        user.id,
        user.user_type || 'seller',
        messageText
      );

      // Mark inquiry as replied in backend + UI
      updateInquiryStatus(selectedInquiry.id, 'replied');

      // Optimistically update local chat state (listener will also update)
      setChatMessages(prev => {
        const prevMsgs = prev[selectedInquiry.id] || [];
        const now = new Date();
        const newMessage = {
          id: now.getTime(),
          text: messageText,
          sender: 'seller',
          timestamp: now.toISOString()
        };
        return {
          ...prev,
          [selectedInquiry.id]: [...prevMsgs, newMessage]
        };
      });
    } catch (error) {
      console.error('Error sending chat message as seller:', error);
      setChatMessage(messageText);
      alert(error.message || 'Failed to send message. Please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Listen to Firebase messages for the selected inquiry/chat room
  useEffect(() => {
    if (!selectedInquiry || !selectedChatRoomId || !user) return;

    const unsubscribe = listenToMessages(selectedChatRoomId, (firebaseMessages, error) => {
      if (error) {
        console.error('Error in seller chat listener:', error);
        return;
      }

      const transformed = firebaseMessages.map((msg) => {
        let date;
        if (msg.timestamp instanceof Date) {
          date = msg.timestamp;
        } else if (msg.timestamp) {
          date = new Date(msg.timestamp);
        } else {
          date = new Date();
        }

        return {
          id: msg.id || `${selectedInquiry.id}-${date.getTime()}`,
          text: msg.text,
          sender: msg.senderId === String(user.id) ? 'seller' : 'buyer',
          timestamp: date.toISOString()
        };
      });

      setChatMessages(prev => ({
        ...prev,
        [selectedInquiry.id]: transformed
      }));
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [selectedInquiry, selectedChatRoomId, user]);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle file upload here
      console.log('File selected:', file.name);
      
      const newMessage = {
        id: Date.now(),
        text: `📎 ${file.name}`,
        sender: 'seller',
        timestamp: new Date().toISOString(),
        type: 'file'
      };

      setChatMessages(prev => ({
        ...prev,
        [selectedInquiry.id]: [...(prev[selectedInquiry.id] || []), newMessage]
      }));

      updateInquiryStatus(selectedInquiry.id, 'replied');
      
      // Reset file input
      e.target.value = '';
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      new: { label: 'New', class: 'seller-new' },
      read: { label: 'Read', class: 'seller-read' },
      replied: { label: 'Replied', class: 'seller-replied' }
    };
    return badges[status] || badges.new;
  };

  return (
    <div className="seller-inquiries">
      {/* Header */}
      <div className="seller-inquiries-header">
        <div className="seller-header-content">
          <h1>Property Inquiries</h1>
          <p className="seller-subtitle">Manage and respond to buyer inquiries</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="seller-inquiry-stats">
        <div className="seller-stat-card">
          <div className="seller-stat-icon seller-total">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className="seller-stat-info">
            <span className="seller-stat-value">{stats.total}</span>
            <span className="seller-stat-label">Total Inquiries</span>
          </div>
        </div>

        <div className="seller-stat-card">
          <div className="seller-stat-icon seller-new">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="seller-stat-info">
            <span className="seller-stat-value">{stats.new}</span>
            <span className="seller-stat-label">New / Pending</span>
          </div>
        </div>

        <div className="seller-stat-card">
          <div className="seller-stat-icon seller-read">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className="seller-stat-info">
            <span className="seller-stat-value">{stats.read}</span>
            <span className="seller-stat-label">Read</span>
          </div>
        </div>

        <div className="seller-stat-card">
          <div className="seller-stat-icon seller-replied">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 10l-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M20 4v7a4 4 0 01-4 4H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="seller-stat-info">
            <span className="seller-stat-value">{stats.replied}</span>
            <span className="seller-stat-label">Replied</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="seller-filters-section">
        <div className="seller-search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="seller-filter-group">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>

          <select
            value={filterProperty}
            onChange={(e) => setFilterProperty(e.target.value)}
          >
            <option value="all">All Properties</option>
            {properties.map(property => (
              <option key={property.id} value={property.id}>
                {property.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="seller-inquiries-container">
        {/* Inquiries List */}
        <div className="seller-inquiries-list">
          {filteredInquiries.length === 0 ? (
            <div className="seller-empty-state">
              <div className="seller-empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </div>
              <h3>No Inquiries Found</h3>
              <p>
                {searchTerm || filterStatus !== 'all' || filterProperty !== 'all'
                  ? 'Try adjusting your filters'
                  : "You haven't received any inquiries yet"}
              </p>
            </div>
          ) : (
            filteredInquiries.map((inquiry, index) => (
              <div
                key={inquiry.id}
                className={`seller-inquiry-card ${selectedInquiry?.id === inquiry.id ? 'seller-selected' : ''} ${inquiry.status === 'new' ? 'seller-unread' : ''}`}
                onClick={() => handleSelectInquiry(inquiry)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="seller-inquiry-avatar">{inquiry.avatar}</div>
                <div className="seller-inquiry-content">
                  <div className="seller-inquiry-header">
                    <span className="seller-inquiry-name">{inquiry.buyerName}</span>
                    <span className="seller-inquiry-time">{getTimeAgo(inquiry.createdAt)}</span>
                  </div>
                  <p className="seller-inquiry-property">{inquiry.propertyTitle}</p>
                  <p className="seller-inquiry-preview">{inquiry.message}</p>
                </div>
                <div className="seller-inquiry-status">
                  <span className={`seller-status-badge ${getStatusBadge(inquiry.status).class}`}>
                    {getStatusBadge(inquiry.status).label}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail Panel */}
        <div className={`seller-inquiry-detail ${selectedInquiry ? 'seller-active' : ''}`}>
          {selectedInquiry ? (
            <>
              <div className="seller-detail-header">
                <button className="seller-back-btn-mobile" onClick={() => setSelectedInquiry(null)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                <div className="seller-detail-user">
                  <div className="seller-detail-avatar">{selectedInquiry.avatar}</div>
                  <div className="seller-detail-user-info">
                    <h3>{selectedInquiry.buyerName}</h3>
                    <span className={`seller-status-badge ${getStatusBadge(selectedInquiry.status).class}`}>
                      {getStatusBadge(selectedInquiry.status).label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="seller-detail-body">
                <div className="seller-detail-tabs">
                  <button
                    className={`seller-tab-btn ${activeTab === 'details' ? 'seller-active' : ''}`}
                    onClick={() => setActiveTab('details')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Details
                  </button>

                  <button
                    className={`seller-tab-btn ${activeTab === 'chat' ? 'seller-active' : ''}`}
                    onClick={() => setActiveTab('chat')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Live Chat
                    {chatMessages[selectedInquiry.id]?.length > 0 && (
                      <span className="seller-chat-badge">{chatMessages[selectedInquiry.id].length}</span>
                    )}
                  </button>
                </div>

                {activeTab === 'details' ? (
                  <div className="seller-details-content">
                    <div className="seller-property-info-card">
                      <h4>Property Inquiry</h4>
                      <p className="seller-property-name">{selectedInquiry.propertyTitle}</p>
                    </div>

                    <div className="seller-contact-info-card">
                      <h4>Contact Information</h4>

                      <div className="seller-contact-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                          <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <a href={`mailto:${selectedInquiry.buyerEmail}`}>{selectedInquiry.buyerEmail}</a>
                      </div>

                      <div className="seller-contact-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <a href={`tel:${selectedInquiry.buyerPhone}`}>{selectedInquiry.buyerPhone}</a>
                      </div>
                    </div>

                    <div className="seller-message-card">
                      <h4>Message</h4>
                      <div className="seller-message-content">
                        <p>{selectedInquiry.message}</p>
                        <span className="seller-message-time">{getTimeAgo(selectedInquiry.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="seller-chat-container">
                    <div className="seller-chat-messages">
                      <div className="seller-chat-message seller-buyer">
                        <div className="seller-message-avatar">{selectedInquiry.avatar}</div>
                        <div className="seller-message-bubble">
                          <div className="seller-message-header">
                            <span className="seller-message-sender">{selectedInquiry.buyerName}</span>
                            <span className="seller-message-timestamp">{getTimeAgo(selectedInquiry.createdAt)}</span>
                          </div>
                          <p>{selectedInquiry.message}</p>
                        </div>
                      </div>

                      {(chatMessages[selectedInquiry.id] || []).map((msg) => (
                        <div key={msg.id} className={`seller-chat-message ${msg.sender === 'seller' ? 'seller-seller' : 'seller-buyer'}`}>
                          {msg.sender === 'buyer' && (
                            <div className="seller-message-avatar">{selectedInquiry.avatar}</div>
                          )}
                          <div className="seller-message-bubble">
                            <div className="seller-message-header">
                              <span className="seller-message-sender">
                                {msg.sender === 'seller' ? 'You' : selectedInquiry.buyerName}
                              </span>
                              <span className="seller-message-timestamp">{getTimeAgo(msg.timestamp)}</span>
                            </div>
                            <p>{msg.text}</p>
                          </div>
                          {msg.sender === 'seller' && (
                            <div className="seller-message-avatar seller-seller-avatar">S</div>
                          )}
                        </div>
                      ))}

                      {(!chatMessages[selectedInquiry.id] ||
                        chatMessages[selectedInquiry.id].length === 0) && (
                        <div className="seller-chat-empty">
                          <div className="seller-chat-empty-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5"/>
                              <circle cx="9" cy="10" r="1" fill="currentColor"/>
                              <circle cx="12" cy="10" r="1" fill="currentColor"/>
                              <circle cx="15" cy="10" r="1" fill="currentColor"/>
                            </svg>
                          </div>
                          <h4>Start chatting with {selectedInquiry.buyerName}</h4>
                          <p>Send a message to begin the conversation</p>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    <div className="seller-chat-input-wrapper">
                      <div className="seller-chat-input-container">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                          accept="image/*,.pdf,.doc,.docx"
                        />
                        <button 
                          className="seller-attach-btn" 
                          title="Attach file"
                          onClick={handleFileClick}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <input
                          type="text"
                          className="seller-chat-input"
                          placeholder="Type your message..."
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                        />
                        <button
                          className="seller-send-message-btn"
                          onClick={handleSendMessage}
                          disabled={!chatMessage.trim()}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {activeTab === 'details' && (
                <div className="seller-detail-footer">
                  <button
                    className="seller-reply-btn seller-primary"
                    onClick={() => setShowReplyModal(true)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M9 10l-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M20 4v7a4 4 0 01-4 4H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Reply via Email
                  </button>
                  <a
                    href={`tel:${selectedInquiry.buyerPhone}`}
                    className="seller-call-btn"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Call Now
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className="seller-no-selection">
              <div className="seller-no-selection-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </div>
              <h3>Select an Inquiry</h3>
              <p>Choose an inquiry from the list to view details and respond</p>
            </div>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="seller-modal-overlay" onClick={() => setShowReplyModal(false)}>
          <div className="seller-reply-modal" onClick={(e) => e.stopPropagation()}>
            <div className="seller-modal-header">
              <h3>Reply to {selectedInquiry?.buyerName}</h3>
              <button className="seller-close-btn" onClick={() => setShowReplyModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="seller-modal-body">
              <div className="seller-reply-to-info">
                <span>To: {selectedInquiry?.buyerEmail}</span>
                <span>RE: {selectedInquiry?.propertyTitle}</span>
              </div>

              <textarea
                placeholder="Type your reply here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={6}
              />
            </div>

            <div className="seller-modal-footer">
              <button className="seller-cancel-btn" onClick={() => setShowReplyModal(false)}>
                Cancel
              </button>

              <button className="seller-send-btn" onClick={handleReply}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerInquiries;