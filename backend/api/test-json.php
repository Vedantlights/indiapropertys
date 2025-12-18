<?php
/**
 * Test JSON Response
 * Use this to verify JSON responses are working correctly
 * Access: https://demo2.indiapropertys.com/backend/api/test-json.php
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../utils/response.php';

// Test successful JSON response
sendSuccess('JSON test successful', [
    'timestamp' => date('Y-m-d H:i:s'),
    'server' => $_SERVER['HTTP_HOST'] ?? 'unknown',
    'method' => $_SERVER['REQUEST_METHOD'] ?? 'unknown'
]);

