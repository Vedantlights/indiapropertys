<?php
/**
 * Admin Users List API
 * GET /api/admin/users/list.php
 */

// Start output buffering immediately
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
    
    // Pagination
    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $limit = isset($_GET['limit']) ? min(100, max(1, intval($_GET['limit']))) : 20;
    $offset = ($page - 1) * $limit;
    
    // Filters
    $userType = isset($_GET['user_type']) ? $_GET['user_type'] : null;
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    $status = isset($_GET['status']) ? $_GET['status'] : null;
    
    // Check if is_banned column exists
    $hasIsBanned = false;
    try {
        $checkStmt = $db->query("SHOW COLUMNS FROM users LIKE 'is_banned'");
        $hasIsBanned = $checkStmt->rowCount() > 0;
    } catch (Exception $e) {
        $hasIsBanned = false;
    }
    
    // Build WHERE clause
    $where = [];
    $params = [];
    
    if ($userType && in_array($userType, ['buyer', 'seller', 'agent'])) {
        $where[] = "user_type = ?";
        $params[] = $userType;
    }
    
    if ($search) {
        $where[] = "(full_name LIKE ? OR email LIKE ? OR phone LIKE ?)";
        $searchTerm = "%{$search}%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }
    
    // Only filter by is_banned if column exists
    if ($hasIsBanned) {
        if ($status === 'banned') {
            $where[] = "is_banned = 1";
        } elseif ($status === 'active') {
            $where[] = "(is_banned = 0 OR is_banned IS NULL)";
        }
    }
    
    $whereClause = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";
    
    // Get total count
    $countQuery = "SELECT COUNT(*) as total FROM users {$whereClause}";
    $countStmt = $db->prepare($countQuery);
    if (!empty($where)) {
        $countStmt->execute($params);
    } else {
        $countStmt->execute();
    }
    $totalResult = $countStmt->fetch(PDO::FETCH_ASSOC);
    $total = isset($totalResult['total']) ? intval($totalResult['total']) : 0;
    
    // Build query params
    $queryParams = [];
    if (!empty($where)) {
        $queryParams = $params;
    }
    
    // LIMIT and OFFSET must be integers, not bound parameters (PDO limitation)
    $limit = (int)$limit;
    $offset = (int)$offset;
    
    // Build SELECT columns - only include is_banned if column exists
    $selectColumns = "id, full_name, email, phone, user_type, email_verified, phone_verified, profile_image, created_at";
    if ($hasIsBanned) {
        $selectColumns = "id, full_name, email, phone, user_type, email_verified, phone_verified, profile_image, is_banned, created_at";
    }
    
    // Get users
    $query = "SELECT {$selectColumns} FROM users {$whereClause} ORDER BY created_at DESC LIMIT {$limit} OFFSET {$offset}";
    
    $stmt = $db->prepare($query);
    $stmt->execute($queryParams);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format users
    $formattedUsers = [];
    foreach ($users as $user) {
        $userId = isset($user['id']) ? intval($user['id']) : 0;
        
        if ($userId <= 0) {
            continue;
        }
        
        // Get property count
        $propertyCount = 0;
        try {
            $propStmt = $db->prepare("SELECT COUNT(*) as count FROM properties WHERE user_id = ?");
            $propStmt->execute([$userId]);
            $propResult = $propStmt->fetch(PDO::FETCH_ASSOC);
            $propertyCount = isset($propResult['count']) ? intval($propResult['count']) : 0;
        } catch (Exception $e) {
            $propertyCount = 0;
        }
        
        // Get inquiry count
        $inquiryCount = 0;
        try {
            $inqStmt = $db->prepare("SELECT COUNT(*) as count FROM inquiries WHERE seller_id = ?");
            $inqStmt->execute([$userId]);
            $inqResult = $inqStmt->fetch(PDO::FETCH_ASSOC);
            $inquiryCount = isset($inqResult['count']) ? intval($inqResult['count']) : 0;
        } catch (Exception $e) {
            $inquiryCount = 0;
        }
        
        $formattedUsers[] = [
            'id' => $userId,
            'full_name' => isset($user['full_name']) ? $user['full_name'] : 'N/A',
            'email' => isset($user['email']) ? $user['email'] : '',
            'phone' => isset($user['phone']) ? $user['phone'] : null,
            'user_type' => isset($user['user_type']) ? $user['user_type'] : 'buyer',
            'email_verified' => isset($user['email_verified']) ? (bool)$user['email_verified'] : false,
            'phone_verified' => isset($user['phone_verified']) ? (bool)$user['phone_verified'] : false,
            'profile_image' => isset($user['profile_image']) ? $user['profile_image'] : null,
            'is_banned' => ($hasIsBanned && isset($user['is_banned'])) ? (bool)$user['is_banned'] : false,
            'created_at' => isset($user['created_at']) ? $user['created_at'] : null,
            'property_count' => $propertyCount,
            'inquiry_count' => $inquiryCount
        ];
    }
    
    // Clean output and send response
    ob_end_clean();
    
    echo json_encode([
        'success' => true,
        'message' => 'Users retrieved successfully',
        'data' => [
            'users' => $formattedUsers,
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
