<?php
/**
 * List Favorites API
 * GET /api/buyer/favorites/list.php
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
    $user = requireAuth();
    
    $db = getDB();
    
    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $limit = isset($_GET['limit']) ? min(MAX_PAGE_SIZE, max(1, intval($_GET['limit']))) : DEFAULT_PAGE_SIZE;
    $offset = ($page - 1) * $limit;
    
    // LIMIT and OFFSET must be integers, not bound parameters (PDO limitation)
    $limit = (int)$limit;
    $offset = (int)$offset;
    
    // Get favorite properties - Explicitly select columns to avoid ONLY_FULL_GROUP_BY issues
    $query = "
        SELECT p.id, p.user_id, p.title, p.status, p.property_type, p.location, 
               p.latitude, p.longitude, p.bedrooms, p.bathrooms, p.balconies,
               p.area, p.carpet_area, p.floor, p.total_floors, p.facing, p.age,
               p.furnishing, p.description, p.price, p.price_negotiable,
               p.maintenance_charges, p.deposit_amount, p.cover_image, p.video_url,
               p.brochure_url, p.is_active, p.admin_status, p.is_featured,
               p.rejection_reason, p.views_count, p.created_at, p.updated_at,
               u.full_name as seller_name,
               GROUP_CONCAT(DISTINCT pi.image_url ORDER BY pi.image_order SEPARATOR ',') as images,
               GROUP_CONCAT(DISTINCT pa.amenity_id SEPARATOR ',') as amenities,
               f.created_at as favorited_at
        FROM favorites f
        INNER JOIN properties p ON f.property_id = p.id
        INNER JOIN users u ON p.user_id = u.id
        LEFT JOIN property_images pi ON p.id = pi.property_id
        LEFT JOIN property_amenities pa ON p.id = pa.property_id
        WHERE f.user_id = ? AND p.is_active = 1 AND p.admin_status = 'approved'
        GROUP BY p.id
        ORDER BY f.created_at DESC
        LIMIT {$limit} OFFSET {$offset}
    ";
    
    $stmt = $db->prepare($query);
    $stmt->execute([$user['id']]);
    $properties = $stmt->fetchAll();
    
    // Get total count
    $stmt = $db->prepare("SELECT COUNT(*) as total FROM favorites WHERE user_id = ?");
    $stmt->execute([$user['id']]);
    $total = $stmt->fetch()['total'];
    
    // Format properties
    foreach ($properties as &$property) {
        $property['images'] = $property['images'] ? explode(',', $property['images']) : [];
        $property['amenities'] = $property['amenities'] ? explode(',', $property['amenities']) : [];
        $property['is_favorite'] = true;
        $property['price_negotiable'] = (bool)$property['price_negotiable'];
    }
    
    sendSuccess('Favorites retrieved successfully', [
        'properties' => $properties,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => intval($total),
            'total_pages' => ceil($total / $limit)
        ]
    ]);
    
} catch (Exception $e) {
    error_log("List Favorites Error: " . $e->getMessage());
    sendError('Failed to retrieve favorites', null, 500);
}

