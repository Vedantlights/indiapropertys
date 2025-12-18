<?php
/**
 * Admin Agents List API
 * GET /api/admin/agents/list.php
 */

// Start output buffering
ob_start();

// Error handling
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set headers early
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    ob_end_clean();
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    ob_end_clean();
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    require_once __DIR__ . '/../../../config/config.php';
    require_once __DIR__ . '/../../../config/database.php';
    require_once __DIR__ . '/../../../utils/response.php';
    require_once __DIR__ . '/../../../utils/admin_auth.php';
    
    // Authenticate admin
    $admin = requireAdmin();
    if (!$admin) {
        ob_end_clean();
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Admin authentication required']);
        exit();
    }
    
    $db = getDB();

try {
    $admin = requireAdmin();
    $db = getDB();
    
    // Check if is_banned and agent_verified columns exist
    $hasIsBanned = false;
    $hasAgentVerified = false;
    try {
        $checkStmt = $db->query("SHOW COLUMNS FROM users LIKE 'is_banned'");
        $hasIsBanned = $checkStmt->rowCount() > 0;
        
        $checkStmt = $db->query("SHOW COLUMNS FROM users LIKE 'agent_verified'");
        $hasAgentVerified = $checkStmt->rowCount() > 0;
    } catch (Exception $e) {
        // Columns don't exist
    }
    
    // Pagination
    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $limit = isset($_GET['limit']) ? min(100, max(1, intval($_GET['limit']))) : 20;
    $offset = ($page - 1) * $limit;
    
    // Filters
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    $verified = isset($_GET['verified']) ? $_GET['verified'] : null;
    
    // Build query - Show both agents and sellers (builders/developers)
    $where = ["(user_type = 'agent' OR user_type = 'seller')"];
    $params = [];
    
    if ($search) {
        $where[] = "(full_name LIKE ? OR email LIKE ? OR phone LIKE ?)";
        $searchTerm = "%{$search}%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }
    
    if ($verified !== null && $hasAgentVerified) {
        $where[] = "(agent_verified = ? OR (agent_verified IS NULL AND ? = 0))";
        $params[] = $verified ? 1 : 0;
        $params[] = $verified ? 1 : 0;
    }
    
    $whereClause = "WHERE " . implode(" AND ", $where);
    
    // Build SELECT columns
    $selectColumns = ["id", "full_name", "email", "phone", "user_type", "email_verified", "phone_verified", "profile_image", "created_at"];
    
    if ($hasIsBanned) {
        $selectColumns[] = "is_banned";
    }
    if ($hasAgentVerified) {
        $selectColumns[] = "agent_verified";
    }
    
    $selectColumnsStr = implode(", ", $selectColumns);
    
    // Get agents
    $query = "
        SELECT 
            {$selectColumnsStr},
            (SELECT COUNT(*) FROM properties WHERE user_id = users.id) as property_count,
            (SELECT COUNT(*) FROM inquiries WHERE seller_id = users.id) as leads_count
        FROM users
        {$whereClause}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
    ";
    
    $params[] = intval($limit);
    $params[] = intval($offset);
    
    $stmt = $db->prepare($query);
    $stmt->execute($params);
    $agents = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get total count
    $countQuery = "SELECT COUNT(*) as total FROM users {$whereClause}";
    $countStmt = $db->prepare($countQuery);
    $countParams = array_slice($params, 0, -2);
    if (!empty($countParams)) {
        $countStmt->execute($countParams);
    } else {
        $countStmt->execute();
    }
    $totalResult = $countStmt->fetch(PDO::FETCH_ASSOC);
    $total = isset($totalResult['total']) ? intval($totalResult['total']) : 0;
    
    // Format agents
    $formattedAgents = [];
    foreach ($agents as $agent) {
        $formattedAgents[] = [
            'id' => intval($agent['id'] ?? 0),
            'full_name' => $agent['full_name'] ?? 'N/A',
            'email' => $agent['email'] ?? '',
            'phone' => $agent['phone'] ?? null,
            'user_type' => $agent['user_type'] ?? 'agent',
            'email_verified' => isset($agent['email_verified']) ? (bool)$agent['email_verified'] : false,
            'phone_verified' => isset($agent['phone_verified']) ? (bool)$agent['phone_verified'] : false,
            'profile_image' => $agent['profile_image'] ?? null,
            'agent_verified' => ($hasAgentVerified && isset($agent['agent_verified'])) ? (bool)$agent['agent_verified'] : false,
            'is_banned' => ($hasIsBanned && isset($agent['is_banned'])) ? (bool)$agent['is_banned'] : false,
            'created_at' => $agent['created_at'] ?? null,
            'property_count' => isset($agent['property_count']) ? intval($agent['property_count']) : 0,
            'leads_count' => isset($agent['leads_count']) ? intval($agent['leads_count']) : 0
        ];
    }
    
    // Clean output and send response
    ob_end_clean();
    
    echo json_encode([
        'success' => true,
        'message' => 'Agents and builders retrieved successfully',
        'data' => [
            'agents' => $formattedAgents,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'pages' => $total > 0 ? ceil($total / $limit) : 0
            ]
        ]
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
    
} catch (PDOException $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage(),
        'error_code' => $e->getCode(),
        'error_info' => $e->errorInfo ?? []
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
    
} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
}
