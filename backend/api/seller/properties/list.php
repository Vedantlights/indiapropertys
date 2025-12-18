<?php
/**
 * List Seller Properties API
 * GET /api/seller/properties/list.php
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
    $user = requireUserType(['seller', 'agent']);
    
    try {
        $db = getDB();
    } catch (Exception $dbError) {
        error_log("Database connection failed in list.php: " . $dbError->getMessage());
        sendError('Database connection failed', null, 500);
    }
    
    // Get query parameters
    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $limit = isset($_GET['limit']) ? min(MAX_PAGE_SIZE, max(1, intval($_GET['limit']))) : DEFAULT_PAGE_SIZE;
    $offset = ($page - 1) * $limit;
    $status = isset($_GET['status']) ? sanitizeInput($_GET['status']) : null;
    
    // Build query - Note: GROUP_CONCAT with LIMIT is not supported, using subquery instead
    $query = "
        SELECT p.*,
               COUNT(DISTINCT pi.id) as image_count,
               COUNT(DISTINCT i.id) as inquiry_count,
               GROUP_CONCAT(DISTINCT pi.image_url ORDER BY pi.image_order SEPARATOR ',') as images,
               GROUP_CONCAT(DISTINCT pa.amenity_id SEPARATOR ',') as amenities,
               (SELECT pi2.image_url FROM property_images pi2 WHERE pi2.property_id = p.id ORDER BY pi2.image_order LIMIT 1) as cover_image
        FROM properties p
        LEFT JOIN property_images pi ON p.id = pi.property_id
        LEFT JOIN property_amenities pa ON p.id = pa.property_id
        LEFT JOIN inquiries i ON p.id = i.property_id
        WHERE p.user_id = ?
    ";
    
    $params = [$user['id']];
    
    if ($status && in_array($status, ['sale', 'rent'])) {
        $query .= " AND p.status = ?";
        $params[] = $status;
    }
    
    $query .= " GROUP BY p.id ORDER BY p.created_at DESC LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;
    
    $stmt = $db->prepare($query);
    $stmt->execute($params);
    $properties = $stmt->fetchAll();
    
    // Get total count
    $countQuery = "SELECT COUNT(*) as total FROM properties WHERE user_id = ?";
    $countParams = [$user['id']];
    
    if ($status) {
        $countQuery .= " AND status = ?";
        $countParams[] = $status;
    }
    
    $stmt = $db->prepare($countQuery);
    $stmt->execute($countParams);
    $total = $stmt->fetch()['total'];
    
    // Format properties
    foreach ($properties as &$property) {
        $property['cover_image'] = $property['cover_image'] ?: null;
        $property['images'] = $property['images'] ? explode(',', $property['images']) : [];
        $property['amenities'] = $property['amenities'] ? explode(',', $property['amenities']) : [];
        $property['image_count'] = intval($property['image_count']);
        $property['inquiry_count'] = intval($property['inquiry_count']);
        $property['price_negotiable'] = (bool)$property['price_negotiable'];
        $property['is_active'] = (bool)$property['is_active'];
    }
    
    sendSuccess('Properties retrieved successfully', [
        'properties' => $properties,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => intval($total),
            'total_pages' => ceil($total / $limit)
        ]
    ]);
    
} catch (PDOException $e) {
    error_log("List Properties Database Error: " . $e->getMessage());
    error_log("SQL Error Info: " . print_r($e->errorInfo, true));
    sendError('Database error occurred', null, 500);
} catch (Exception $e) {
    error_log("List Properties Error: " . $e->getMessage());
    error_log("Error Trace: " . $e->getTraceAsString());
    sendError('Failed to retrieve properties: ' . (defined('ENVIRONMENT') && ENVIRONMENT === 'development' ? $e->getMessage() : 'Please try again'), null, 500);
} catch (Throwable $e) {
    error_log("List Properties Fatal Error: " . $e->getMessage());
    error_log("Error Trace: " . $e->getTraceAsString());
    sendError('Server error occurred', null, 500);
}

