<?php
/**
 * Diagnose Login Issues
 * This will check everything about the admin login setup
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../../../config/database.php';

try {
    $db = getDB();
    $email = 'admin@indiapropertys.com';
    $password = 'Admin@123456';
    
    $diagnostics = [
        'database_connection' => 'OK',
        'admin_exists' => false,
        'admin_details' => null,
        'password_status' => null,
        'password_test' => null,
        'fix_needed' => false,
        'fix_action' => null
    ];
    
    // Check if admin exists
    $stmt = $db->prepare("SELECT id, username, email, password, full_name, role, is_active, google2fa_secret, is_2fa_enabled FROM admin_users WHERE email = ?");
    $stmt->execute([$email]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$admin) {
        $diagnostics['admin_exists'] = false;
        $diagnostics['fix_needed'] = true;
        $diagnostics['fix_action'] = 'Run fix-admin-password.php to create admin user';
        
        echo json_encode([
            'success' => false,
            'message' => 'Admin user does not exist',
            'diagnostics' => $diagnostics,
            'solution' => 'Visit: http://localhost/Fullstack/backend/api/admin/auth/fix-admin-password.php'
        ], JSON_PRETTY_PRINT);
        exit;
    }
    
    $diagnostics['admin_exists'] = true;
    $diagnostics['admin_details'] = [
        'id' => $admin['id'],
        'email' => $admin['email'],
        'username' => $admin['username'] ?? 'N/A',
        'full_name' => $admin['full_name'] ?? 'N/A',
        'role' => $admin['role'] ?? 'N/A',
        'is_active' => (bool)($admin['is_active'] ?? false),
        'has_password' => !empty($admin['password']),
        'password_length' => strlen($admin['password'] ?? ''),
        'has_2fa_secret' => !empty($admin['google2fa_secret']),
        'is_2fa_enabled' => (bool)($admin['is_2fa_enabled'] ?? false)
    ];
    
    // Check password
    if (empty($admin['password'])) {
        $diagnostics['password_status'] = 'EMPTY';
        $diagnostics['fix_needed'] = true;
        $diagnostics['fix_action'] = 'Password is empty. Run fix-admin-password.php';
    } else {
        $passwordValid = password_verify($password, $admin['password']);
        $diagnostics['password_status'] = $passwordValid ? 'CORRECT' : 'INCORRECT';
        $diagnostics['password_test'] = [
            'test_password' => $password,
            'verification_result' => $passwordValid,
            'hash_preview' => substr($admin['password'], 0, 30) . '...'
        ];
        
        if (!$passwordValid) {
            $diagnostics['fix_needed'] = true;
            $diagnostics['fix_action'] = 'Password hash is incorrect. Run fix-admin-password.php';
        }
    }
    
    // Check if admin is active
    if (!$admin['is_active']) {
        $diagnostics['fix_needed'] = true;
        $diagnostics['fix_action'] = 'Admin account is inactive. Update is_active to 1';
    }
    
    echo json_encode([
        'success' => true,
        'message' => $diagnostics['fix_needed'] ? 'Issues found - see diagnostics' : 'Everything looks good!',
        'diagnostics' => $diagnostics,
        'can_login' => !$diagnostics['fix_needed'] && $admin['is_active'],
        'solution' => $diagnostics['fix_needed'] ? 'Visit: http://localhost/Fullstack/backend/api/admin/auth/fix-admin-password.php' : 'You can login now!'
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ], JSON_PRETTY_PRINT);
}
