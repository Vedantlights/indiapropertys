<?php
/**
 * Application Configuration
 */

// Start output buffering to prevent any output before JSON
ob_start();

// Register shutdown function to handle fatal errors and flush buffer
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error !== null && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        // Clean output buffer
        if (ob_get_level() > 0) {
            ob_end_clean();
        }
        
        // Send JSON error response
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Fatal error occurred',
            'error' => defined('ENVIRONMENT') && ENVIRONMENT === 'development' ? $error['message'] . ' in ' . $error['file'] . ' on line ' . $error['line'] : 'Internal server error'
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    } else {
        // Flush output buffer normally
        if (ob_get_level() > 0) {
            ob_end_flush();
        }
    }
});

// Set error handler to catch all errors and return JSON
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    // Only handle errors if output buffering is active
    if (ob_get_level() > 0) {
        ob_end_clean();
    }
    
    // Don't handle errors if they're suppressed with @
    if (!(error_reporting() & $errno)) {
        return false;
    }
    
    // Log the error
    error_log("PHP Error [$errno]: $errstr in $errfile on line $errline");
    
    // Send JSON error response
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error occurred',
        'error' => defined('ENVIRONMENT') && ENVIRONMENT === 'development' ? $errstr : 'Internal server error'
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
});

// Set exception handler
set_exception_handler(function($exception) {
    if (ob_get_level() > 0) {
        ob_end_clean();
    }
    
    error_log("Uncaught Exception: " . $exception->getMessage() . " in " . $exception->getFile() . " on line " . $exception->getLine());
    
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error occurred',
        'error' => defined('ENVIRONMENT') && ENVIRONMENT === 'development' ? $exception->getMessage() : 'Internal server error'
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
});

// CORS Headers
// Add your production frontend domain(s) here
$allowed_origins = [
    // Local development
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    // Production - Hostinger / live domains
    'https://demo2.indiapropertys.com',
    'https://indiapropertys.com',
    'https://www.indiapropertys.com',
];

// Allow requests from allowed origins
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} elseif (!empty($origin) && defined('ENVIRONMENT') && ENVIRONMENT === 'development') {
    // In development, allow any origin for easier testing
    header("Access-Control-Allow-Origin: $origin");
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Error Reporting is now handled by environment detection above

// Timezone
date_default_timezone_set('Asia/Kolkata');

// ============================================
// ENVIRONMENT DETECTION & BASE URL CONFIGURATION
// ============================================
// Automatically detects if running on localhost or production
$isLocalhost = (
    $_SERVER['HTTP_HOST'] === 'localhost' ||
    strpos($_SERVER['HTTP_HOST'], 'localhost:') === 0 ||
    strpos($_SERVER['HTTP_HOST'], '127.0.0.1') === 0 ||
    strpos($_SERVER['HTTP_HOST'], '127.0.0.1:') === 0
);

if ($isLocalhost) {
    // LOCAL DEVELOPMENT
    define('BASE_URL', 'http://localhost/Fullstack/backend');
    define('ENVIRONMENT', 'development');
    // Error reporting enabled for development
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    // PRODUCTION (Hostinger)
    // Since backend is in /backend subfolder, we need to include it in BASE_URL
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    // Include /backend in BASE_URL since files are in public_html/demo2/backend/
    define('BASE_URL', $protocol . '://' . $host . '/backend');
    define('ENVIRONMENT', 'production');
    // Error reporting disabled for production
    error_reporting(0);
    ini_set('display_errors', 0);
}

define('API_BASE_URL', BASE_URL . '/api');
define('UPLOAD_BASE_URL', BASE_URL . '/uploads');

// File Upload Paths
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('PROPERTY_IMAGES_DIR', UPLOAD_DIR . 'properties/images/');
define('PROPERTY_VIDEOS_DIR', UPLOAD_DIR . 'properties/videos/');
define('PROPERTY_BROCHURES_DIR', UPLOAD_DIR . 'properties/brochures/');
define('USER_PROFILES_DIR', UPLOAD_DIR . 'users/profiles/');

// Create upload directories if they don't exist
$dirs = [
    UPLOAD_DIR,
    PROPERTY_IMAGES_DIR,
    PROPERTY_VIDEOS_DIR,
    PROPERTY_BROCHURES_DIR,
    USER_PROFILES_DIR
];

foreach ($dirs as $dir) {
    if (!file_exists($dir)) {
        mkdir($dir, 0755, true);
    }
}

// File Upload Limits
define('MAX_IMAGE_SIZE', 5 * 1024 * 1024); // 5MB
define('MAX_VIDEO_SIZE', 50 * 1024 * 1024); // 50MB
define('MAX_BROCHURE_SIZE', 10 * 1024 * 1024); // 10MB
define('MAX_IMAGES_PER_PROPERTY', 10);

// Allowed File Types
define('ALLOWED_IMAGE_TYPES', ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
define('ALLOWED_VIDEO_TYPES', ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v', 'video/ogg']);
define('ALLOWED_BROCHURE_TYPES', ['application/pdf']);

// JWT Secret (Change this in production!)
define('JWT_SECRET', 'your-secret-key-change-in-production-2024');
define('JWT_ALGORITHM', 'HS256');
define('JWT_EXPIRATION', 86400); // 24 hours

// OTP Configuration
define('OTP_EXPIRATION_MINUTES', 10);
define('OTP_LENGTH', 6);

// Email Configuration (Hostinger SMTP)
define('SMTP_HOST', 'smtp.hostinger.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'info@indiapropertys.com');
define('SMTP_PASS', 'V1e2d2a4n5t@2020'); // Add your SMTP password here
define('SMTP_FROM_EMAIL', 'info@indiapropertys.com');
define('SMTP_FROM_NAME', 'IndiaPropertys');

// SMS Configuration (MSG91 - Admin OTP configuration moved to admin-config.php)
// MSG91 constants are now defined in admin-config.php to avoid conflicts
define('MSG91_SENDER_ID', 'INDIA');
// New SMS Verification Widget Token (Tokenid)
define('MSG91_WIDGET_AUTH_TOKEN', '481618TcNAx989nvQ69410832P1');

// Pagination
define('DEFAULT_PAGE_SIZE', 20);
define('MAX_PAGE_SIZE', 100);

// Property Limits
define('FREE_PLAN_PROPERTY_LIMIT', 3);
define('BASIC_PLAN_PROPERTY_LIMIT', 10);
define('PRO_PLAN_PROPERTY_LIMIT', 50);
define('PREMIUM_PLAN_PROPERTY_LIMIT', -1); // Unlimited

// Database connection is handled by database.php
// Use Database::getInstance()->getConnection() or getDB() function
// 
// For InfinityFree hosting, uncomment and update these credentials:
// $host     = "sql101.infinityfree.com";
// $username = "if0_40672958";
// $password = "Vedant2020";
// $database = "if0_40672958_indiapropertys_db";
// $conn = new mysqli($host, $username, $password, $database);
// if ($conn->connect_error) {
//     die(json_encode(['error' => 'Connection failed']));
// }
// $conn->set_charset("utf8mb4");

