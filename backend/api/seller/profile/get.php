<?php
/**
 * Get Seller Profile API
 * GET /api/seller/profile/get.php
 */

require_once __DIR__ . '/../../../config/config.php';
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../../utils/response.php';
require_once __DIR__ . '/../../../utils/auth.php';

handlePreflight();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', null, 405);
}

try {
    $user = requireUserType(['seller', 'agent']);
    
    $db = getDB();
    
    // Get user profile
    $stmt = $db->prepare("
        SELECT u.*, up.*
        FROM users u
        LEFT JOIN user_profiles up ON u.id = up.user_id
        WHERE u.id = ?
    ");
    $stmt->execute([$user['id']]);
    $profile = $stmt->fetch();
    
    if (!$profile) {
        sendError('Profile not found', null, 404);
    }
    
    // Remove sensitive data
    unset($profile['password']);
    
    // Parse JSON fields
    if ($profile['social_links']) {
        $profile['social_links'] = json_decode($profile['social_links'], true);
    }
    
    sendSuccess('Profile retrieved successfully', ['profile' => $profile]);
    
} catch (Exception $e) {
    error_log("Get Profile Error: " . $e->getMessage());
    sendError('Failed to retrieve profile', null, 500);
}

