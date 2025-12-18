import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserChatRooms, listenToMessages, sendMessage as firebaseSendMessage, getChatRoomDetails } from '../../services/firebase.service';
import { propertiesAPI } from '../../services/api.service';
import MyChatBox from '../../MyChatBox/MyChatBox';
import '../styles/ChatUs.css';

const ChatUs = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const chatIdFromUrl = searchParams.get('chatId');
  const ownerNameFromUrl = searchParams.get('ownerName');
  const propertyIdFromUrl = searchParams.get('propertyId');
  const [propertyOwners, setPropertyOwners] = useState([]);

  const [selectedOwner, setSelectedOwner] = useState(null);
  const [selectedChatRoomId, setSelectedChatRoomId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const unsubscribeMessagesRef = useRef(null);
  
  // Property cache for chat rooms
  const [propertyCache, setPropertyCache] = useState({});

  // Load chat rooms from Firebase
  useEffect(() => {
    const loadChatRooms = async () => {
      if (!user || user.user_type !== 'buyer') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const chatRooms = await getUserChatRooms(user.id, user.user_type);
        
        // If chatId from URL but not in loaded chat rooms, fetch it directly
        if (chatIdFromUrl && !chatRooms.find(r => r.id === chatIdFromUrl)) {
          try {
            const chatRoomDetails = await getChatRoomDetails(chatIdFromUrl);
            if (chatRoomDetails) {
              chatRooms.push(chatRoomDetails);
            }
          } catch (error) {
            console.error('Error fetching chat room details from URL:', error);
          }
        }
        
        // Fetch property details for each chat room
        const ownersWithProperties = await Promise.all(
          chatRooms.map(async (room) => {
            try {
              // Get property details
              let property = propertyCache[room.propertyId];
              if (!property) {
                const propResponse = await propertiesAPI.getDetails(room.propertyId);
                if (propResponse.success && propResponse.data?.property) {
                  property = propResponse.data.property;
                  setPropertyCache(prev => ({ ...prev, [room.propertyId]: property }));
                }
              }

              // Get receiver details (seller/agent)
              const receiverId = room.receiverId;
              
              return {
                id: room.id,
                chatRoomId: room.id,
                receiverId: receiverId,
                receiverRole: room.receiverRole || 'seller',
                propertyId: room.propertyId,
                name: property?.seller?.name || property?.seller?.full_name || 'Property Owner',
                propertyTitle: property?.title || 'Property',
                propertyType: property?.property_type || '',
                location: property?.location || '',
                price: property?.price ? `₹${parseFloat(property.price).toLocaleString('en-IN')}${property.status === 'rent' ? '/Month' : ''}` : '',
                image: property?.seller?.profile_image || property?.cover_image || 'https://via.placeholder.com/60',
                lastMessage: room.lastMessage || '',
                lastMessageTime: formatMessageTime(room.updatedAt),
                unread: 0, // TODO: Implement unread count
                status: 'offline' // TODO: Implement online status
              };
            } catch (error) {
              console.error('Error loading property for chat room:', error);
              return null;
            }
          })
        );

        const validOwners = ownersWithProperties.filter(owner => owner !== null && owner.id);
        setPropertyOwners(validOwners);
        
        // Priority: If chatId from URL, select that chat room first
        if (chatIdFromUrl) {
          const urlChatRoom = validOwners.find(owner => owner.chatRoomId === chatIdFromUrl);
          if (urlChatRoom) {
            console.log('✅ Found chat room from URL:', chatIdFromUrl);
            setSelectedOwner(urlChatRoom);
            setSelectedChatRoomId(urlChatRoom.chatRoomId);
          } else {
            // Chat room from URL not in list yet (might be brand new)
            console.log('⚠️ Chat room from URL not in list, fetching details...', chatIdFromUrl);
            setSelectedChatRoomId(chatIdFromUrl);
            
            // Create temp owner object immediately using URL params for instant display
            let tempOwner = null;
            const usePropertyId = propertyIdFromUrl || null;
            
            if (ownerNameFromUrl) {
              // Use owner name from URL for immediate display
              tempOwner = {
                id: chatIdFromUrl,
                chatRoomId: chatIdFromUrl,
                receiverId: null, // Will be fetched
                receiverRole: 'seller',
                propertyId: usePropertyId,
                name: decodeURIComponent(ownerNameFromUrl),
                propertyTitle: 'Property',
                propertyType: '',
                location: '',
                price: '',
                image: 'https://via.placeholder.com/60',
                lastMessage: '',
                lastMessageTime: 'Just now',
                unread: 0,
                status: 'offline'
              };
              setSelectedOwner(tempOwner);
              // Add temp owner to propertyOwners list immediately so it appears in sidebar
              setPropertyOwners(prevOwners => {
                if (!prevOwners.find(o => o.chatRoomId === chatIdFromUrl)) {
                  return [tempOwner, ...prevOwners];
                }
                return prevOwners;
              });
            }
            
            // Try to get chat room details and property info to complete the owner object
            try {
              const chatRoomDetails = await getChatRoomDetails(chatIdFromUrl);
              if (chatRoomDetails) {
                // Fetch property details
                const propId = chatRoomDetails.propertyId || usePropertyId;
                if (propId) {
                  const propResponse = await propertiesAPI.getDetails(propId);
                  if (propResponse.success && propResponse.data?.property) {
                    const property = propResponse.data.property;
                    const completeOwner = {
                      id: chatRoomDetails.id,
                      chatRoomId: chatRoomDetails.id,
                      receiverId: chatRoomDetails.receiverId,
                      receiverRole: chatRoomDetails.receiverRole || 'seller',
                      propertyId: chatRoomDetails.propertyId,
                      name: property?.seller?.name || property?.seller?.full_name || ownerNameFromUrl || 'Property Owner',
                      propertyTitle: property?.title || 'Property',
                      propertyType: property?.property_type || '',
                      location: property?.location || '',
                      price: property?.price ? `₹${parseFloat(property.price).toLocaleString('en-IN')}${property.status === 'rent' ? '/Month' : ''}` : '',
                      image: property?.seller?.profile_image || property?.cover_image || 'https://via.placeholder.com/60',
                      lastMessage: chatRoomDetails.lastMessage || '',
                      lastMessageTime: formatMessageTime(chatRoomDetails.updatedAt),
                      unread: 0,
                      status: 'offline'
                    };
                    setSelectedOwner(completeOwner);
                    setSelectedChatRoomId(chatIdFromUrl);
                    // Add to propertyOwners list if not already there
                    setPropertyOwners(prevOwners => {
                      if (!prevOwners.find(o => o.chatRoomId === chatIdFromUrl)) {
                        return [completeOwner, ...prevOwners];
                      }
                      return prevOwners.map(o => o.chatRoomId === chatIdFromUrl ? completeOwner : o);
                    });
                  } else if (tempOwner) {
                    // Update temp owner with chat room details even if property fetch failed
                    tempOwner.receiverId = chatRoomDetails.receiverId;
                    tempOwner.receiverRole = chatRoomDetails.receiverRole || 'seller';
                    tempOwner.propertyId = chatRoomDetails.propertyId;
                    tempOwner.lastMessage = chatRoomDetails.lastMessage || '';
                    tempOwner.lastMessageTime = formatMessageTime(chatRoomDetails.updatedAt);
                    setSelectedOwner(tempOwner);
                    // Add to propertyOwners list if not already there
                    setPropertyOwners(prevOwners => {
                      if (!prevOwners.find(o => o.chatRoomId === chatIdFromUrl)) {
                        return [tempOwner, ...prevOwners];
                      }
                      return prevOwners.map(o => o.chatRoomId === chatIdFromUrl ? tempOwner : o);
                    });
                  }
                } else if (tempOwner) {
                  // Update temp owner with chat room details
                  tempOwner.receiverId = chatRoomDetails.receiverId;
                  tempOwner.receiverRole = chatRoomDetails.receiverRole || 'seller';
                  tempOwner.propertyId = chatRoomDetails.propertyId;
                  tempOwner.lastMessage = chatRoomDetails.lastMessage || '';
                  tempOwner.lastMessageTime = formatMessageTime(chatRoomDetails.updatedAt);
                  setSelectedOwner(tempOwner);
                  // Add to propertyOwners list if not already there
                  setPropertyOwners(prevOwners => {
                    if (!prevOwners.find(o => o.chatRoomId === chatIdFromUrl)) {
                      return [tempOwner, ...prevOwners];
                    }
                    return prevOwners.map(o => o.chatRoomId === chatIdFromUrl ? tempOwner : o);
                  });
                }
              } else if (tempOwner) {
                // Chat room doesn't exist yet, but we have temp owner from URL
                // This is fine - user can still see the owner name and chat will be created on first message
                console.log('Chat room not found in Firebase yet, using temp owner from URL');
              }
            } catch (error) {
              console.error('Error fetching chat room details from URL:', error);
              // If we have temp owner, keep it
              if (!tempOwner && ownerNameFromUrl) {
                // Create minimal temp owner even if all fetches fail
                const minimalOwner = {
                  id: chatIdFromUrl,
                  chatRoomId: chatIdFromUrl,
                  receiverId: null,
                  receiverRole: 'seller',
                  propertyId: usePropertyId,
                  name: decodeURIComponent(ownerNameFromUrl),
                  propertyTitle: 'Property',
                  propertyType: '',
                  location: '',
                  price: '',
                  image: 'https://via.placeholder.com/60',
                  lastMessage: '',
                  lastMessageTime: 'Just now',
                  unread: 0,
                  status: 'offline'
                };
                setSelectedOwner(minimalOwner);
              }
            }
          }
        } else if (validOwners.length > 0 && !selectedOwner) {
          // If no URL chatId, select first owner
          setSelectedOwner(validOwners[0]);
          setSelectedChatRoomId(validOwners[0].chatRoomId);
        }
      } catch (error) {
        console.error('Error loading chat rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChatRooms();
  }, [user, chatIdFromUrl]);
  
  // Refresh chat rooms periodically to update last message timestamps
  useEffect(() => {
    if (!user || user.user_type !== 'buyer') return;
    
    const interval = setInterval(async () => {
      try {
        const chatRooms = await getUserChatRooms(user.id, user.user_type);
        
        // Update propertyOwners list with latest chat room data
        setPropertyOwners(prevOwners => {
          return prevOwners.map(owner => {
            const updatedRoom = chatRooms.find(room => room.id === owner.chatRoomId);
            if (updatedRoom) {
              return {
                ...owner,
                lastMessage: updatedRoom.lastMessage || owner.lastMessage,
                lastMessageTime: formatMessageTime(updatedRoom.updatedAt)
              };
            }
            return owner;
          });
        });
      } catch (error) {
        console.error('Error refreshing chat rooms:', error);
      }
    }, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(interval);
  }, [user]);

  // Format message time
  const formatMessageTime = (date) => {
    if (!date) return 'Just now';
    const now = new Date();
    const msgDate = date instanceof Date ? date : new Date(date);
    const diffMs = now - msgDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return msgDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  // Lock page scroll position - prevent any scrolling
  useEffect(() => {
    // Lock scroll on mount
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      // Cleanup message listener
      if (unsubscribeMessagesRef.current) {
        unsubscribeMessagesRef.current();
      }
    };
  }, []);

  // Handle owner selection
  const handleOwnerSelect = (owner) => {
    setSelectedOwner(owner);
    setSelectedChatRoomId(owner.chatRoomId);
    setIsSidebarOpen(false);
    setMessages([]); // Clear messages while loading
  };

  // Listen to messages when chat room is selected (use chatIdFromUrl as fallback)
  useEffect(() => {
    const chatRoomId = selectedChatRoomId || chatIdFromUrl;
    if (!chatRoomId || !user) {
      console.log('Message listener skipped:', { selectedChatRoomId, chatIdFromUrl, hasUser: !!user });
      return;
    }

    console.log('Setting up message listener for chat room:', chatRoomId);

    // Unsubscribe from previous listener
    if (unsubscribeMessagesRef.current) {
      unsubscribeMessagesRef.current();
    }

    // Subscribe to messages
    unsubscribeMessagesRef.current = listenToMessages(chatRoomId, (firebaseMessages, error) => {
      if (error) {
        console.error('Error in message listener:', error);
        return;
      }
      
      console.log('Received messages:', firebaseMessages.length);
      
      // Transform Firebase messages to match UI structure
      const transformedMessages = firebaseMessages.map((msg, index) => {
        let timestamp = 'Just now';
        if (msg.timestamp) {
          try {
            const date = msg.timestamp instanceof Date 
              ? msg.timestamp 
              : new Date(msg.timestamp);
            timestamp = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          } catch (e) {
            console.error('Error parsing timestamp:', e);
          }
        }
        
        return {
          id: msg.id || index,
          text: msg.text,
          sender: msg.senderId === String(user.id) ? 'user' : 'owner',
          timestamp
        };
      });
      setMessages(transformedMessages);
      
      // Update chat room list with last message and timestamp
      if (firebaseMessages.length > 0) {
        const lastMessage = firebaseMessages[firebaseMessages.length - 1];
        const lastMsgText = lastMessage.text;
        const lastMsgTime = lastMessage.timestamp instanceof Date 
          ? lastMessage.timestamp 
          : new Date(lastMessage.timestamp);
        
        // Update the chat room in propertyOwners list
        setPropertyOwners(prevOwners => {
          const updatedOwners = prevOwners.map(owner => {
            if (owner.chatRoomId === chatRoomId) {
              return {
                ...owner,
                lastMessage: lastMsgText,
                lastMessageTime: formatMessageTime(lastMsgTime)
              };
            }
            return owner;
          });
          
          // If chat room not in list but we have selectedOwner, add it
          if (!updatedOwners.find(o => o.chatRoomId === chatRoomId) && selectedOwner) {
            updatedOwners.unshift({
              ...selectedOwner,
              lastMessage: lastMsgText,
              lastMessageTime: formatMessageTime(lastMsgTime)
            });
          }
          
          return updatedOwners;
        });
      }
    });

    return () => {
      if (unsubscribeMessagesRef.current) {
        unsubscribeMessagesRef.current();
      }
    };
  }, [selectedChatRoomId, chatIdFromUrl, user, selectedOwner]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    // Use chatIdFromUrl if selectedChatRoomId is not set but we have a URL chatId
    const chatRoomId = selectedChatRoomId || chatIdFromUrl;
    
    if (inputMessage.trim() === '' || !chatRoomId || !user) {
      console.error('Cannot send message - missing data:', { 
        chatRoomId, 
        user: !!user, 
        message: inputMessage.trim() 
      });
      if (!chatRoomId) {
        alert('Chat room not found. Please select a conversation.');
      }
      return;
    }

    const messageText = inputMessage.trim();
    setInputMessage(''); // Clear input immediately for better UX

    try {
      console.log('Sending message:', { chatRoomId, senderId: user.id, messageText });
      
      // Ensure chat room ID is set
      if (!selectedChatRoomId && chatRoomId) {
        setSelectedChatRoomId(chatRoomId);
      }
      
      // Ensure chat room exists before sending message
      // This is critical - create chat room if it doesn't exist
      if (!selectedChatRoomId && chatRoomId) {
        // If we have selectedOwner with propertyId, create chat room
      if (selectedOwner && selectedOwner.receiverId && selectedOwner.propertyId) {
        const { createOrGetChatRoom } = await import('../../services/firebase.service');
        try {
            const createdChatRoomId = await createOrGetChatRoom(
            user.id,
            selectedOwner.receiverId,
            selectedOwner.receiverRole || 'seller',
            selectedOwner.propertyId
          );
            // Update selectedChatRoomId with the created room ID
            setSelectedChatRoomId(createdChatRoomId);
            // Use the created room ID for sending message
            const finalChatRoomId = createdChatRoomId;
            
            // Send message to Firebase
            await firebaseSendMessage(
              finalChatRoomId,
              user.id,
              user.user_type,
              messageText
            );
            console.log('✅ Message sent successfully');
            return; // Exit early after successful send
        } catch (error) {
            console.error('Error creating chat room or sending message:', error);
            setInputMessage(messageText); // Restore message on error
            alert('Failed to create chat room. Please try again.');
            return;
          }
        }
      }
      
      // Send message to Firebase (if chat room already exists)
      await firebaseSendMessage(
        chatRoomId,
        user.id,
        user.user_type,
        messageText
      );
      console.log('✅ Message sent successfully');
      
      // Update chat room list immediately with the sent message
      const now = new Date();
      setPropertyOwners(prevOwners => {
        const updatedOwners = prevOwners.map(owner => {
          if (owner.chatRoomId === chatRoomId) {
            return {
              ...owner,
              lastMessage: messageText,
              lastMessageTime: formatMessageTime(now)
            };
          }
          return owner;
        });
        
        // If chat room not in list but we have selectedOwner, add it to the list
        if (!updatedOwners.find(o => o.chatRoomId === chatRoomId) && selectedOwner) {
          const newOwner = {
            ...selectedOwner,
            lastMessage: messageText,
            lastMessageTime: formatMessageTime(now)
          };
          // Add to beginning of list (most recent)
          updatedOwners.unshift(newOwner);
        }
        
        return updatedOwners;
      });
      
      // Message will also be added via real-time listener
    } catch (error) {
      console.error('Error sending message:', error);
      // Restore message on error
      setInputMessage(messageText);
      const errorMessage = error.message || 'Failed to send message. Please try again.';
      alert(errorMessage);
    }
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
    <MyChatBox
      // Sidebar props
      isSidebarOpen={isSidebarOpen}
      onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      onCloseSidebar={() => setIsSidebarOpen(false)}
      propertyOwners={propertyOwners}
      selectedOwner={selectedOwner}
      onOwnerSelect={handleOwnerSelect}
      loading={loading}
      
      // Messages props
      messages={messages}
      isTyping={isTyping}
      
      // Input props
      inputMessage={inputMessage}
      onInputChange={(value) => setInputMessage(value)}
      onSendMessage={handleSendMessage}
      quickReplies={quickReplies}
      showQuickReplies={messages.length <= 3}
      onQuickReply={handleQuickReply}
    />
  );
};

export default ChatUs;
