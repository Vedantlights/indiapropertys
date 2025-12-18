<?php
/**
 * Database Connection Test
 * This file helps diagnose which database is being used
 * Access: https://demo2.indiapropertys.com/backend/test-db-connection.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';

$result = [
    'host' => $_SERVER['HTTP_HOST'] ?? 'unknown',
    'server_name' => $_SERVER['SERVER_NAME'] ?? 'unknown',
    'request_uri' => $_SERVER['REQUEST_URI'] ?? 'unknown',
    'is_localhost' => false,
    'is_demo2' => false,
    'database_config' => [
        'host' => defined('DB_HOST') ? DB_HOST : 'not defined',
        'port' => defined('DB_PORT') ? DB_PORT : 'not defined',
        'database' => defined('DB_NAME') ? DB_NAME : 'not defined',
        'username' => defined('DB_USER') ? DB_USER : 'not defined',
        'password' => defined('DB_PASS') ? (strlen(DB_PASS) > 0 ? '***hidden***' : 'empty') : 'not defined',
    ],
    'connection_test' => null,
    'error' => null
];

// Check environment detection
$isLocalhost = (
    isset($_SERVER['HTTP_HOST']) && (
        $_SERVER['HTTP_HOST'] === 'localhost' ||
        strpos($_SERVER['HTTP_HOST'], 'localhost:') === 0 ||
        strpos($_SERVER['HTTP_HOST'], '127.0.0.1') === 0 ||
        strpos($_SERVER['HTTP_HOST'], '127.0.0.1:') === 0
    )
);

$isDemo2 = isset($_SERVER['HTTP_HOST']) && strpos($_SERVER['HTTP_HOST'], 'demo2.indiapropertys.com') !== false;

$result['is_localhost'] = $isLocalhost;
$result['is_demo2'] = $isDemo2;

// Test database connection
try {
    $db = getDB();
    
    // Get current database name
    $stmt = $db->query("SELECT DATABASE() as current_db");
    $dbInfo = $stmt->fetch();
    
    // Get table count
    $stmt = $db->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    $result['connection_test'] = [
        'status' => 'success',
        'current_database' => $dbInfo['current_db'] ?? 'unknown',
        'table_count' => count($tables),
        'tables' => $tables
    ];
    
} catch (Exception $e) {
    $result['connection_test'] = [
        'status' => 'failed',
        'error' => $e->getMessage()
    ];
    $result['error'] = $e->getMessage();
}

echo json_encode($result, JSON_PRETTY_PRINT);

