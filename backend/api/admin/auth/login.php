<?php
/**
 * Admin Login API with 2FA Support
 * POST /api/admin/auth/login.php
 */

require_once __DIR__ . '/../../../config/config.php';
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../../utils/response.php';
require_once __DIR__ . '/../../../utils/admin_auth.php';

// Load Google2FA
require_once __DIR__ . '/../../../vendor/autoload.php';

use PragmaRX\Google2FA\Google2FA;

handlePreflight();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', null, 405);
}

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['email']) || !isset($data['password'])) {
        sendError('Email and password are required', null, 400);
    }
    
    $email = trim($data['email']);
    $password = $data['password'];
    $authCode = isset($data['authCode']) ? trim($data['authCode']) : '';
    
    $db = getDB();
    
    // Get admin user (include 2FA fields)
    $stmt = $db->prepare("SELECT id, username, email, password, full_name, role, is_active, google2fa_secret, is_2fa_enabled FROM admin_users WHERE email = ?");
    $stmt->execute([$email]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$admin) {
        error_log("Login failed: Admin user not found for email: " . $email);
        sendError('Invalid email or password', null, 401);
    }
    
    // Check if admin is active
    if (empty($admin['is_active']) || !$admin['is_active']) {
        error_log("Login failed: Admin account is inactive for email: " . $email);
        sendError('Your account has been deactivated. Please contact the administrator.', null, 403);
    }
    
    // Verify password
    if (empty($admin['password'])) {
        error_log("ERROR: Admin password is empty in database for email: " . $email);
        error_log("SOLUTION: Run http://localhost/Fullstack/backend/api/admin/auth/fix-admin-password.php");
        sendError('Password not set. Please run fix script or contact administrator.', null, 401);
    }
    
    $passwordValid = password_verify($password, $admin['password']);
    
    if (!$passwordValid) {
        error_log("Password verification failed for email: " . $email);
        error_log("Password provided length: " . strlen($password));
        error_log("Password hash in DB length: " . strlen($admin['password']));
        error_log("Password hash in DB preview: " . substr($admin['password'], 0, 30) . "...");
        error_log("SOLUTION: Run http://localhost/Fullstack/backend/api/admin/auth/fix-admin-password.php");
        sendError('Invalid email or password. If you just fixed the password, wait a moment and try again.', null, 401);
    }
    
    error_log("Password verified successfully for: " . $email);
    
    // After password is verified, check 2FA status
    // If 2FA is not set up yet, allow login to proceed to setup
    // If 2FA is set up, require the code
    
    if (!empty($admin['google2fa_secret']) && $admin['is_2fa_enabled']) {
        // 2FA is enabled - require code
        if (empty($authCode)) {
            error_log("2FA is enabled but no code provided - returning require2FA");
            // Return success with require2FA flag (password is correct, just need 2FA code)
            sendSuccess('Password verified. Please enter Google Authenticator code', [
                'require2FA' => true,
                'is2FAEnabled' => true
            ]);
            exit;
        }
        
        // Verify 2FA code
        $google2fa = new Google2FA();
        $valid = $google2fa->verifyKey($admin['google2fa_secret'], $authCode);
        
        if (!$valid) {
            error_log("Invalid 2FA code provided");
            sendError('Invalid authenticator code. Please check your Google Authenticator app and try again.', null, 401);
        }
        
        error_log("2FA code verified successfully");
    } else {
        // 2FA is not set up yet - allow login but user should setup 2FA
        error_log("2FA not set up yet for: " . $email);
        // Continue without 2FA for now (user can setup later)
    }
    
    // Password (and 2FA if enabled) verified - generate token
    $token = generateAdminToken($admin['id'], $admin['role'], $admin['email']);
    
    // Return admin data (without password and secret)
    unset($admin['password']);
    unset($admin['google2fa_secret']);
    
    sendSuccess('Login successful', [
        'token' => $token,
        'admin' => $admin,
        'is2FAEnabled' => (bool)$admin['is_2fa_enabled']
    ]);
    
} catch (Exception $e) {
    error_log("Admin Login Error: " . $e->getMessage());
    sendError('Login failed. Please try again.', null, 500);
}
