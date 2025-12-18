<?php
/**
 * Upload Profile Image API
 * POST /api/upload/profile-image.php
 * 
 * Handles profile image uploads for users
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../utils/validation.php';
require_once __DIR__ . '/../../utils/auth.php';
require_once __DIR__ . '/../../utils/upload.php';

handlePreflight();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', null, 405);
}

try {
    $user = requireAuth();
    
    if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        sendError('No file uploaded or upload error', null, 400);
    }
    
    $file = $_FILES['file'];
    
    // Validate file
    $errors = validateFileUpload($file, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE);
    if (!empty($errors)) {
        sendError('File validation failed', ['errors' => $errors], 400);
    }
    
    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = 'profile_' . $user['id'] . '_' . time() . '_' . uniqid() . '.' . $extension;
    $destination = USER_PROFILES_DIR . $filename;
    
    // Delete old profile image if exists
    $db = getDB();
    $stmt = $db->prepare("SELECT profile_image FROM users WHERE id = ?");
    $stmt->execute([$user['id']]);
    $oldProfile = $stmt->fetch();
    
    if ($oldProfile && $oldProfile['profile_image']) {
        $oldImagePath = str_replace(UPLOAD_BASE_URL, UPLOAD_DIR, $oldProfile['profile_image']);
        if (file_exists($oldImagePath)) {
            @unlink($oldImagePath);
        }
    }
    
    // Upload new image
    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        sendError('Failed to upload image', null, 500);
    }
    
    $url = UPLOAD_BASE_URL . '/users/profiles/' . $filename;
    
    // Update user profile_image in database
    $stmt = $db->prepare("UPDATE users SET profile_image = ?, updated_at = NOW() WHERE id = ?");
    $stmt->execute([$url, $user['id']]);
    
    sendSuccess('Profile image uploaded successfully', [
        'url' => $url,
        'filename' => $filename
    ]);
    
} catch (Exception $e) {
    error_log("Profile Image Upload Error: " . $e->getMessage());
    sendError('Failed to upload profile image', null, 500);
}
