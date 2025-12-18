<?php
/**
 * Authentication Helper Functions
 */

require_once __DIR__ . '/../config/config.php';

// Polyfill for getallheaders() for environments where it's not available
if (!function_exists('getallheaders')) {
    function getallheaders() {
        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) === 'HTTP_') {
                $key = str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))));
                $headers[$key] = $value;
            }
        }
        return $headers;
    }
}

// Simple JWT-like token generation (For production, use a proper JWT library)
function generateToken($userId, $userType, $email) {
    $payload = [
        'user_id' => $userId,
        'user_type' => $userType,
        'email' => $email,
        'iat' => time(),
        'exp' => time() + JWT_EXPIRATION
    ];
    
    $header = base64UrlEncode(json_encode(['typ' => 'JWT', 'alg' => JWT_ALGORITHM]));
    $payload_encoded = base64UrlEncode(json_encode($payload));
    $signature = base64UrlEncode(hash_hmac('sha256', "$header.$payload_encoded", JWT_SECRET, true));
    
    return "$header.$payload_encoded.$signature";
}

// Verify token
function verifyToken($token) {
    try {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }
        
        [$header, $payload, $signature] = $parts;
        
        // Verify signature
        $expectedSignature = base64UrlEncode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
        if (!hash_equals($expectedSignature, $signature)) {
            return null;
        }
        
        // Decode payload
        $payloadData = json_decode(base64UrlDecode($payload), true);
        
        // Check expiration
        if (isset($payloadData['exp']) && $payloadData['exp'] < time()) {
            return null;
        }
        
        return $payloadData;
    } catch (Exception $e) {
        return null;
    }
}

// Get current user from token
function getCurrentUser() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    
    if (empty($authHeader)) {
        error_log("getCurrentUser: No Authorization header found");
        return null;
    }
    
    // Extract token from "Bearer <token>"
    if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        $token = $matches[1];
        
        if (empty($token)) {
            error_log("getCurrentUser: Empty token in Authorization header");
            return null;
        }
        
        $payload = verifyToken($token);
        
        if (!$payload) {
            error_log("getCurrentUser: Token verification failed - token may be expired or invalid");
            return null;
        }
        
        try {
            require_once __DIR__ . '/../config/database.php';
            $db = getDB();
            
            $stmt = $db->prepare("SELECT id, full_name, email, phone, user_type, email_verified, phone_verified, profile_image, is_banned FROM users WHERE id = ?");
            $stmt->execute([$payload['user_id']]);
            $user = $stmt->fetch();
            
            if (!$user) {
                error_log("getCurrentUser: User not found in database for user_id: " . $payload['user_id']);
                return null;
            }
            
            // Check if user is banned
            if (isset($user['is_banned']) && $user['is_banned']) {
                error_log("getCurrentUser: User is banned - user_id: " . $user['id']);
                return null;
            }
            
            return $user;
        } catch (Exception $e) {
            error_log("getCurrentUser: Database error - " . $e->getMessage());
            return null;
        }
    }
    
    error_log("getCurrentUser: Invalid Authorization header format");
    return null;
}

// Require authentication
function requireAuth() {
    $user = getCurrentUser();
    if (!$user) {
        error_log("Authentication failed: No user found. Token: " . (isset(getallheaders()['Authorization']) ? 'present' : 'missing'));
        sendError('Authentication required. Please log in to continue.', null, 401);
    }
    return $user;
}

// Require specific user type
function requireUserType($allowedTypes) {
    $user = requireAuth();
    
    // Get user_type from database (registered type) - this is the source of truth
    $userType = $user['user_type'] ?? null;
    
    // Also check token payload for user_type (login type)
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    $tokenUserType = null;
    
    if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        $token = $matches[1];
        $payload = verifyToken($token);
        if ($payload && isset($payload['user_type'])) {
            $tokenUserType = $payload['user_type'];
        }
    }
    
    // Allow if either registered type or login type matches
    $allowed = in_array($userType, (array)$allowedTypes);
    
    // Special case: if user registered as 'seller' but logged in as 'buyer', 
    // they should still be able to access seller features (they ARE a seller)
    if (!$allowed && $tokenUserType && in_array($tokenUserType, (array)$allowedTypes)) {
        $allowed = true;
    }
    
    // Also allow if registered type is seller/agent (they can post properties)
    if (!$allowed && in_array($userType, ['seller', 'agent'])) {
        $allowed = true;
    }
    
    if (!$allowed) {
        error_log("Access denied: user_type=$userType, token_user_type=$tokenUserType, allowed=" . json_encode($allowedTypes));
        sendError('Access denied. Insufficient permissions. You need to be registered as a Seller or Agent to post properties.', null, 403);
    }
    
    return $user;
}

// Helper functions for base64 URL encoding
function base64UrlEncode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64UrlDecode($data) {
    return base64_decode(strtr($data, '-_', '+/'));
}

