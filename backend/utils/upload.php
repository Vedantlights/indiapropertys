<?php
/**
 * File Upload Helper Functions
 */

require_once __DIR__ . '/../config/config.php';

/**
 * Upload property image
 */
function uploadPropertyImage($file, $propertyId) {
    $errors = validateFileUpload($file, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE);
    if (!empty($errors)) {
        return ['success' => false, 'errors' => $errors];
    }
    
    // Ensure upload directory exists
    if (!file_exists(PROPERTY_IMAGES_DIR)) {
        mkdir(PROPERTY_IMAGES_DIR, 0755, true);
    }
    
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = 'prop_' . $propertyId . '_' . time() . '_' . uniqid() . '.' . $extension;
    $destination = PROPERTY_IMAGES_DIR . $filename;
    
    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        error_log("Failed to move uploaded file from {$file['tmp_name']} to {$destination}");
        return ['success' => false, 'errors' => ['Failed to upload image. Please check server permissions.']];
    }
    
    // Verify file was saved
    if (!file_exists($destination)) {
        error_log("File was not saved to destination: {$destination}");
        return ['success' => false, 'errors' => ['File was not saved correctly.']];
    }
    
    $url = UPLOAD_BASE_URL . '/properties/images/' . $filename;
    return ['success' => true, 'url' => $url, 'filename' => $filename];
}

/**
 * Upload property video
 */
function uploadPropertyVideo($file, $propertyId) {
    $errors = validateFileUpload($file, ALLOWED_VIDEO_TYPES, MAX_VIDEO_SIZE);
    if (!empty($errors)) {
        return ['success' => false, 'errors' => $errors];
    }
    
    // Ensure upload directory exists
    if (!file_exists(PROPERTY_VIDEOS_DIR)) {
        mkdir(PROPERTY_VIDEOS_DIR, 0755, true);
    }
    
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = 'prop_' . $propertyId . '_' . time() . '_' . uniqid() . '.' . $extension;
    $destination = PROPERTY_VIDEOS_DIR . $filename;
    
    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        error_log("Failed to move uploaded video from {$file['tmp_name']} to {$destination}");
        return ['success' => false, 'errors' => ['Failed to upload video. Please check server permissions.']];
    }
    
    // Verify file was saved
    if (!file_exists($destination)) {
        error_log("Video file was not saved to destination: {$destination}");
        return ['success' => false, 'errors' => ['Video file was not saved correctly.']];
    }
    
    $url = UPLOAD_BASE_URL . '/properties/videos/' . $filename;
    return ['success' => true, 'url' => $url, 'filename' => $filename];
}

/**
 * Upload property brochure
 */
function uploadPropertyBrochure($file, $propertyId) {
    $errors = validateFileUpload($file, ALLOWED_BROCHURE_TYPES, MAX_BROCHURE_SIZE);
    if (!empty($errors)) {
        return ['success' => false, 'errors' => $errors];
    }
    
    // Ensure upload directory exists
    if (!file_exists(PROPERTY_BROCHURES_DIR)) {
        mkdir(PROPERTY_BROCHURES_DIR, 0755, true);
    }
    
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = 'prop_' . $propertyId . '_' . time() . '_' . uniqid() . '.' . $extension;
    $destination = PROPERTY_BROCHURES_DIR . $filename;
    
    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        error_log("Failed to move uploaded brochure from {$file['tmp_name']} to {$destination}");
        return ['success' => false, 'errors' => ['Failed to upload brochure. Please check server permissions.']];
    }
    
    // Verify file was saved
    if (!file_exists($destination)) {
        error_log("Brochure file was not saved to destination: {$destination}");
        return ['success' => false, 'errors' => ['Brochure file was not saved correctly.']];
    }
    
    $url = UPLOAD_BASE_URL . '/properties/brochures/' . $filename;
    return ['success' => true, 'url' => $url, 'filename' => $filename];
}

/**
 * Delete file
 */
function deleteFile($filePath) {
    if (file_exists($filePath)) {
        return unlink($filePath);
    }
    return false;
}

/**
 * Extract filename from URL
 */
function getFilenameFromUrl($url) {
    return basename(parse_url($url, PHP_URL_PATH));
}

