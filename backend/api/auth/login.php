<?php
/**
 * User Login API
 * POST /api/auth/login.php
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../utils/validation.php';
require_once __DIR__ . '/../../utils/auth.php';

handlePreflight();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', null, 405);
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $email = sanitizeInput($input['email'] ?? '');
    $password = $input['password'] ?? '';
    $userType = sanitizeInput($input['userType'] ?? 'buyer');
    
    // Validation
    $errors = [];
    if (empty($email)) {
        $errors['email'] = 'Email is required';
    } elseif (!validateEmail($email)) {
        $errors['email'] = 'Invalid email format';
    }
    
    if (empty($password)) {
        $errors['password'] = 'Password is required';
    }
    
    if (!in_array($userType, ['buyer', 'seller', 'agent'])) {
        $errors['userType'] = 'Invalid user type';
    }
    
    if (!empty($errors)) {
        sendValidationError($errors);
    }
    
    // Get database connection
    $db = getDB();
    
    // Normalize email (lowercase, trim) - same as registration
    $emailNormalized = strtolower(trim($email));
    
    // Find user (case-insensitive email match)
    $stmt = $db->prepare("SELECT id, full_name, email, phone, password, user_type, email_verified, phone_verified, profile_image FROM users WHERE LOWER(TRIM(email)) = ?");
    $stmt->execute([$emailNormalized]);
    $user = $stmt->fetch();
    
    if (!$user) {
        error_log("Login failed: User not found for email: $emailNormalized");
        sendError('Invalid email or password', null, 401);
    }
    
    // Verify password
    if (!password_verify($password, $user['password'])) {
        error_log("Login failed: Password mismatch for email: $emailNormalized");
        sendError('Invalid email or password', null, 401);
    }
    
    error_log("Login successful for email: $emailNormalized, user_type: {$user['user_type']}");
    
    // Check if user can login with selected user type
    $registeredType = $user['user_type'];
    $roleAccessMap = [
        'buyer' => ['buyer', 'seller'],
        'seller' => ['buyer', 'seller'],
        'agent' => ['agent']
    ];
    
    $allowedRoles = $roleAccessMap[$registeredType] ?? [];
    if (!in_array($userType, $allowedRoles)) {
        $typeLabels = [
            'buyer' => 'Buyer/Tenant',
            'seller' => 'Seller/Owner',
            'agent' => 'Agent/Builder'
        ];
        
        if ($registeredType === 'agent' && $userType !== 'agent') {
            sendError('You are registered as an Agent/Builder. You can only access the Agent/Builder dashboard.', null, 403);
        } else {
            sendError("You are registered as {$typeLabels[$registeredType]}. You cannot access this dashboard.", null, 403);
        }
    }
    
    // Generate token
    $token = generateToken($user['id'], $userType, $user['email']);
    
    // Store session (optional)
    $stmt = $db->prepare("INSERT INTO user_sessions (user_id, token, expires_at) VALUES (?, ?, FROM_UNIXTIME(?))");
    $stmt->execute([$user['id'], $token, time() + JWT_EXPIRATION]);
    
    // Prepare user data
    unset($user['password']);
    $userData = [
        'id' => $user['id'],
        'full_name' => $user['full_name'],
        'email' => $user['email'],
        'phone' => $user['phone'],
        'user_type' => $userType, // Return the login type, not registered type
        'email_verified' => (bool)$user['email_verified'],
        'phone_verified' => (bool)$user['phone_verified'],
        'profile_image' => $user['profile_image']
    ];
    
    error_log("Login API: Sending success response for user: {$userData['email']}, type: {$userData['user_type']}");
    sendSuccess('Login successful', [
        'token' => $token,
        'user' => $userData
    ]);
    
} catch (Exception $e) {
    error_log("Login Error: " . $e->getMessage());
    sendError('Login failed. Please try again.', null, 500);
}

