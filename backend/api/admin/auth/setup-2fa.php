<?php
/**
 * Setup Google Authenticator 2FA
 * POST /api/admin/auth/setup-2fa.php
 */

// Start output buffering
ob_start();

// Error handling
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . '/../../../config/config.php';
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../../utils/response.php';

// Load Google2FA and QR Code libraries
require_once __DIR__ . '/../../../vendor/autoload.php';

use PragmaRX\Google2FA\Google2FA;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;

handlePreflight();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ob_end_clean();
    sendError('Method not allowed', null, 405);
}

try {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);
    
    error_log("=== SETUP 2FA REQUEST ===");
    error_log("Raw Input: " . substr($rawInput, 0, 500));
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log("JSON Decode Error: " . json_last_error_msg());
        ob_end_clean();
        sendError('Invalid JSON data', null, 400);
    }
    
    $adminEmail = isset($data['email']) ? trim($data['email']) : '';
    
    if (empty($adminEmail)) {
        error_log("ERROR: Email is empty");
        ob_end_clean();
        sendError('Email is required', null, 400);
    }
    
    error_log("Setting up 2FA for email: " . $adminEmail);
    
    $db = getDB();
    
    // Get admin user
    $stmt = $db->prepare("SELECT * FROM admin_users WHERE email = ?");
    $stmt->execute([$adminEmail]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$admin) {
        error_log("ERROR: Admin not found for email: " . $adminEmail);
        ob_end_clean();
        sendError('Admin account not found. Please create admin user first.', null, 404);
    }
    
    error_log("Admin found, generating secret key...");
    
    // Generate secret key
    $google2fa = new Google2FA();
    $secretKey = $google2fa->generateSecretKey();
    
    error_log("Secret key generated: " . substr($secretKey, 0, 10) . "...");
    
    // Generate QR Code URL
    $qrCodeUrl = $google2fa->getQRCodeUrl(
        'IndiaPropertys',
        $adminEmail,
        $secretKey
    );
    
    error_log("QR Code URL generated");
    
    // Generate QR Code SVG
    $renderer = new ImageRenderer(
        new RendererStyle(200),
        new SvgImageBackEnd()
    );
    $writer = new Writer($renderer);
    $qrCodeSvg = $writer->writeString($qrCodeUrl);
    $qrCodeBase64 = base64_encode($qrCodeSvg);
    
    error_log("QR Code SVG generated");
    
    // Check if google2fa_secret column exists
    try {
        // Store secret key (but don't enable 2FA yet - wait for verification)
        $stmt = $db->prepare("UPDATE admin_users SET google2fa_secret = ? WHERE email = ?");
        $stmt->execute([$secretKey, $adminEmail]);
        error_log("Secret key stored in database");
    } catch (PDOException $e) {
        // Column might not exist - try to add it
        if (strpos($e->getMessage(), 'google2fa_secret') !== false) {
            error_log("Column doesn't exist, attempting to add it...");
            try {
                $db->exec("ALTER TABLE admin_users ADD COLUMN google2fa_secret VARCHAR(32) NULL");
                $db->exec("ALTER TABLE admin_users ADD COLUMN is_2fa_enabled TINYINT(1) DEFAULT 0");
                // Retry the update
                $stmt = $db->prepare("UPDATE admin_users SET google2fa_secret = ? WHERE email = ?");
                $stmt->execute([$secretKey, $adminEmail]);
                error_log("Columns added and secret key stored");
            } catch (PDOException $e2) {
                error_log("Failed to add columns: " . $e2->getMessage());
                ob_end_clean();
                sendError('Database error. Please run the migration script first.', null, 500);
            }
        } else {
            throw $e;
        }
    }
    
    ob_end_clean();
    sendSuccess('QR code generated', [
        'secretKey' => $secretKey,
        'qrCode' => 'data:image/svg+xml;base64,' . $qrCodeBase64,
        'message' => 'Scan QR code with Google Authenticator app'
    ]);
    
} catch (PDOException $e) {
    error_log("Database Error: " . $e->getMessage());
    ob_end_clean();
    sendError('Database error. Please check database connection and migration.', null, 500);
} catch (Exception $e) {
    error_log("Setup 2FA Error: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    ob_end_clean();
    sendError('Failed to setup 2FA: ' . $e->getMessage(), null, 500);
} catch (Error $e) {
    error_log("Fatal Error: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    ob_end_clean();
    sendError('Server error occurred. Please try again.', null, 500);
}
