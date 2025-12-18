<?php
/**
 * Update Buyer Profile API
 * PUT /api/buyer/profile/update.php
 */

require_once __DIR__ . '/../../../config/config.php';
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../../utils/response.php';
require_once __DIR__ . '/../../../utils/validation.php';
require_once __DIR__ . '/../../../utils/auth.php';

handlePreflight();

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    sendError('Method not allowed', null, 405);
}

try {
    $user = requireAuth(); // Accepts any authenticated user (buyer, seller, agent)
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    $db = getDB();
    
    // Update user table
    $updateUserFields = [];
    $userParams = [];
    
    if (isset($input['full_name'])) {
        $updateUserFields[] = "full_name = ?";
        $userParams[] = sanitizeInput($input['full_name']);
    }
    
    if (isset($input['email'])) {
        // Validate email format
        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            sendError('Invalid email format', null, 400);
        }
        $updateUserFields[] = "email = ?";
        $userParams[] = sanitizeInput($input['email']);
    }
    
    if (isset($input['phone'])) {
        // Validate phone format (basic validation)
        $phone = preg_replace('/\D/', '', $input['phone']);
        if (strlen($phone) < 10) {
            sendError('Invalid phone number', null, 400);
        }
        $updateUserFields[] = "phone = ?";
        $userParams[] = sanitizeInput($input['phone']);
    }
    
    if (isset($input['profile_image'])) {
        $updateUserFields[] = "profile_image = ?";
        $userParams[] = sanitizeInput($input['profile_image']);
    }
    
    if (!empty($updateUserFields)) {
        $userParams[] = $user['id'];
        $stmt = $db->prepare("UPDATE users SET " . implode(', ', $updateUserFields) . ", updated_at = NOW() WHERE id = ?");
        $stmt->execute($userParams);
    }
    
    // Update or insert user profile
    $profileFields = [
        'bio', 'address', 'city', 'state', 'pincode', 'company_name',
        'license_number', 'experience_years', 'specialization', 'website', 'social_links'
    ];
    
    $updateProfileFields = [];
    $profileParams = [];
    
    foreach ($profileFields as $field) {
        if (isset($input[$field])) {
            $updateProfileFields[] = "$field = ?";
            if ($field === 'social_links' && is_array($input[$field])) {
                $profileParams[] = json_encode($input[$field]);
            } else {
                $profileParams[] = sanitizeInput($input[$field]);
            }
        }
    }
    
    if (!empty($updateProfileFields)) {
        // Check if profile exists
        $stmt = $db->prepare("SELECT id FROM user_profiles WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        
        if ($stmt->fetch()) {
            // Update
            $profileParams[] = $user['id'];
            $stmt = $db->prepare("UPDATE user_profiles SET " . implode(', ', $updateProfileFields) . ", updated_at = NOW() WHERE user_id = ?");
            $stmt->execute($profileParams);
        } else {
            // Insert - build field names and values
            $fieldNames = [];
            foreach ($updateProfileFields as $field) {
                $fieldNames[] = str_replace(' = ?', '', $field);
            }
            $fieldNames[] = 'user_id';
            $profileParams[] = $user['id'];
            
            $placeholders = str_repeat('?,', count($profileParams) - 1) . '?';
            $stmt = $db->prepare("INSERT INTO user_profiles (" . implode(', ', $fieldNames) . ") VALUES ($placeholders)");
            $stmt->execute($profileParams);
        }
    }
    
    // Get updated profile
    $stmt = $db->prepare("
        SELECT u.*, up.*
        FROM users u
        LEFT JOIN user_profiles up ON u.id = up.user_id
        WHERE u.id = ?
    ");
    $stmt->execute([$user['id']]);
    $profile = $stmt->fetch();
    
    unset($profile['password']);
    if ($profile['social_links']) {
        $profile['social_links'] = json_decode($profile['social_links'], true);
    }
    
    sendSuccess('Profile updated successfully', ['profile' => $profile]);
    
} catch (Exception $e) {
    error_log("Update Buyer Profile Error: " . $e->getMessage());
    sendError('Failed to update profile', null, 500);
}

