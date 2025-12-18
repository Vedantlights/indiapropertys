/**
 * Firebase Chat Service
 * Handles all Firebase Firestore operations for chat functionality
 * Uses Firebase npm package
 */

import { initializeApp } from 'firebase/app';
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    collection, 
    addDoc, 
    query, 
    where, 
    orderBy, 
    onSnapshot, 
    getDocs, 
    serverTimestamp 
} from 'firebase/firestore';

// Firebase Configuration (Company Project)
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// This is your company's Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyBjD9KHuVjUNSvPpa6y-pElD7lIElCiXmE",
    authDomain: "my-chat-box-ec5b0.firebaseapp.com",
    projectId: "my-chat-box-ec5b0",
    storageBucket: "my-chat-box-ec5b0.firebasestorage.app",
    messagingSenderId: "387721645160",
    appId: "1:387721645160:web:64f6ec464447b49ea6bfdd",
    measurementId: "G-CLCBRJYNMN"
};

// Lazy initialization
let app = null;
let db = null;
let isInitialized = false;

// Initialize Firebase (called once)
const initializeFirebase = async () => {
    if (isInitialized && db) {
        return { app, db };
    }

    try {
        if (!app) {
            app = initializeApp(firebaseConfig);
        }
        if (!db) {
            db = getFirestore(app);
        }
        isInitialized = true;
        console.log("✅ Firebase initialized successfully!");
        return { app, db };
    } catch (error) {
        console.error("❌ Firebase initialization error:", error);
        throw error;
    }
};

/**
 * Generate a deterministic chat room ID
 * Format: buyerId_receiverId_propertyId (sorted buyerId and receiverId)
 */
export const generateChatRoomId = (buyerId, receiverId, propertyId) => {
    const sortedIds = [String(buyerId), String(receiverId)].sort();
    return `${sortedIds[0]}_${sortedIds[1]}_${propertyId}`;
};

/**
 * Create or get a chat room
 * Returns the chat room ID
 */
export const createOrGetChatRoom = async (buyerId, receiverId, receiverRole, propertyId) => {
    try {
        const { db: firestoreDb } = await initializeFirebase();

        const chatRoomId = generateChatRoomId(buyerId, receiverId, propertyId);
        const chatRoomRef = doc(firestoreDb, 'chats', chatRoomId);

        // Check if chat room exists
        const chatRoomDoc = await getDoc(chatRoomRef);

        if (chatRoomDoc.exists()) {
            // Update lastUpdated timestamp
            await updateDoc(chatRoomRef, {
                updatedAt: serverTimestamp()
            });
            console.log("✅ Chat room found:", chatRoomId);
            return chatRoomId;
        } else {
            // Create new chat room
            await setDoc(chatRoomRef, {
                buyerId: String(buyerId),
                receiverId: String(receiverId),
                receiverRole: receiverRole, // 'seller' or 'agent'
                propertyId: String(propertyId),
                participants: [String(buyerId), String(receiverId)].sort(),
                lastMessage: '',
                updatedAt: serverTimestamp(),
                createdAt: serverTimestamp()
            });
            console.log("✅ New chat room created:", chatRoomId);
            return chatRoomId;
        }
    } catch (error) {
        console.error("Error creating/getting chat room:", error);
        throw error;
    }
};

/**
 * Send a message to a chat room
 */
export const sendMessage = async (chatRoomId, senderId, senderRole, messageText) => {
    try {
        const { db: firestoreDb } = await initializeFirebase();

        // Add message to messages subcollection
        const chatRoomRef = doc(firestoreDb, 'chats', chatRoomId);
        const messagesRef = collection(chatRoomRef, 'messages');
        
        await addDoc(messagesRef, {
            senderId: String(senderId),
            senderRole: senderRole, // 'buyer', 'seller', or 'agent'
            text: messageText,
            timestamp: serverTimestamp()
        });

        // Update chat room's last message and timestamp
        try {
            await updateDoc(chatRoomRef, {
                lastMessage: messageText,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            // If chat room document doesn't exist yet in the new Firebase project,
            // create it on the fly so future queries work correctly.
            if (error.code === 'not-found' || (error.message && error.message.includes('No document to update'))) {
                console.warn('Chat room doc missing, creating it now for:', chatRoomId);

                // Parse chatRoomId: expected format buyerId_receiverId_propertyId (ids sorted)
                const parts = String(chatRoomId).split('_');
                const idA = parts[0] || '';
                const idB = parts[1] || '';
                const propertyId = parts[2] || '';

                const senderIdStr = String(senderId);
                // Determine the other participant
                const otherId = senderIdStr === idA ? idB : idA;

                let buyerId = senderIdStr;
                let receiverId = otherId;
                let receiverRole = senderRole;

                if (senderRole === 'buyer') {
                    buyerId = senderIdStr;
                    receiverId = otherId;
                    receiverRole = 'seller';
                } else {
                    // Sender is seller/agent; assume the other participant is buyer
                    buyerId = otherId;
                    receiverId = senderIdStr;
                    receiverRole = senderRole || 'seller';
                }

                await setDoc(chatRoomRef, {
                    buyerId: String(buyerId),
                    receiverId: String(receiverId),
                    receiverRole,
                    propertyId: String(propertyId || ''),
                    participants: [String(buyerId), String(receiverId)].sort(),
                    lastMessage: messageText,
                    updatedAt: serverTimestamp(),
                    createdAt: serverTimestamp()
                });
            } else {
                // Re-throw other errors
                throw error;
            }
        }

        console.log("✅ Message sent to chat room:", chatRoomId);
        return true;
    } catch (error) {
        console.error("Error sending message:", error);

        // If this is the 'No document to update' error, we've already handled
        // doc creation above (or it's a harmless race). Don't crash the UI.
        if (error.code === 'not-found' || (error.message && error.message.includes('No document to update'))) {
            return false;
        }

        // Re-throw other, real errors
        throw error;
    }
};

/**
 * Listen to messages in real-time for a chat room
 * Returns an unsubscribe function
 */
export const listenToMessages = (chatRoomId, callback) => {
    let unsubscribe = null;

    const setupListener = async () => {
        try {
            const { db: firestoreDb } = await initializeFirebase();

            const chatRoomRef = doc(firestoreDb, 'chats', chatRoomId);
            const messagesRef = collection(chatRoomRef, 'messages');
            const q = query(messagesRef, orderBy('timestamp', 'asc'));

            unsubscribe = onSnapshot(q, (snapshot) => {
                const messages = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    messages.push({
                        id: doc.id,
                        senderId: data.senderId,
                        senderRole: data.senderRole,
                        text: data.text,
                        timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp)
                    });
                });
                callback(messages);
            }, (error) => {
                console.error("Error listening to messages:", error);
                callback([], error);
            });

            return unsubscribe;
        } catch (error) {
            console.error("Error setting up message listener:", error);
            callback([], error);
        }
    };

    setupListener();

    // Return unsubscribe function
    return () => {
        if (unsubscribe) {
            unsubscribe();
        }
    };
};

/**
 * Get all chat rooms for a user (buyer, seller, or agent)
 */
export const getUserChatRooms = async (userId, userRole) => {
    try {
        const { db: firestoreDb } = await initializeFirebase();

        const chatsRef = collection(firestoreDb, 'chats');
        
        // Query based on user role - fetch without orderBy to avoid index requirement
        // We'll sort in memory instead
        let q;
        if (userRole === 'buyer') {
            q = query(
                chatsRef,
                where('buyerId', '==', String(userId))
            );
        } else {
            // For seller/agent, check receiverId
            q = query(
                chatsRef,
                where('receiverId', '==', String(userId))
            );
        }

        const snapshot = await getDocs(q);
        const chatRooms = [];
        
        snapshot.forEach((doc) => {
            const data = doc.data();
            const updatedAt = data.updatedAt?.toDate ? data.updatedAt.toDate() : (data.updatedAt ? new Date(data.updatedAt) : new Date(0));
            
            chatRooms.push({
                id: doc.id,
                buyerId: data.buyerId,
                receiverId: data.receiverId,
                receiverRole: data.receiverRole,
                propertyId: data.propertyId,
                participants: data.participants,
                lastMessage: data.lastMessage || '',
                updatedAt: updatedAt
            });
        });

        // Sort by updatedAt descending in memory (most recent first)
        chatRooms.sort((a, b) => {
            const timeA = a.updatedAt.getTime ? a.updatedAt.getTime() : new Date(a.updatedAt).getTime();
            const timeB = b.updatedAt.getTime ? b.updatedAt.getTime() : new Date(b.updatedAt).getTime();
            return timeB - timeA; // Descending order
        });

        return chatRooms;
    } catch (error) {
        console.error("Error getting user chat rooms:", error);
        throw error;
    }
};

/**
 * Get chat room details by ID
 */
export const getChatRoomDetails = async (chatRoomId) => {
    try {
        const { db: firestoreDb } = await initializeFirebase();

        const chatRoomRef = doc(firestoreDb, 'chats', chatRoomId);
        const chatRoomDoc = await getDoc(chatRoomRef);

        if (!chatRoomDoc.exists()) {
            return null;
        }

        const data = chatRoomDoc.data();
        return {
            id: chatRoomDoc.id,
            buyerId: data.buyerId,
            receiverId: data.receiverId,
            receiverRole: data.receiverRole,
            propertyId: data.propertyId,
            participants: data.participants,
            lastMessage: data.lastMessage || '',
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt),
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
        };
    } catch (error) {
        console.error("Error getting chat room details:", error);
        throw error;
    }
};

export default {
    initializeFirebase,
    generateChatRoomId,
    createOrGetChatRoom,
    sendMessage,
    listenToMessages,
    getUserChatRooms,
    getChatRoomDetails
};
