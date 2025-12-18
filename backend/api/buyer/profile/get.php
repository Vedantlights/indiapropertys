<?php
/**
 * Get Buyer Profile API
 * GET /api/buyer/profile/get.php
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
    $user = requireAuth(); // Accepts any authenticated user
    
    $db = getDB();
    
    // Get user profile with extended profile info
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
    
    unset($profile['password']);
    if ($profile['social_links']) {
        $profile['social_links'] = json_decode($profile['social_links'], true);
    }
    
    sendSuccess('Profile retrieved successfully', ['profile' => $profile]);
    
} catch (Exception $e) {
    error_log("Get Buyer Profile Error: " . $e->getMessage());
    sendError('Failed to get profile', null, 500);
}

