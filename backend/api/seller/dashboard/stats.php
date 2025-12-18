<?php
/**
 * Seller Dashboard Stats API
 * GET /api/seller/dashboard/stats.php
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
    
    $db = getDB();
    
    // Total properties
    $stmt = $db->prepare("SELECT COUNT(*) as total FROM properties WHERE user_id = ?");
    $stmt->execute([$user['id']]);
    $totalProperties = $stmt->fetch()['total'];
    
    // Active properties
    $stmt = $db->prepare("SELECT COUNT(*) as total FROM properties WHERE user_id = ? AND is_active = 1");
    $stmt->execute([$user['id']]);
    $activeProperties = $stmt->fetch()['total'];
    
    // Total inquiries
    $stmt = $db->prepare("SELECT COUNT(*) as total FROM inquiries WHERE seller_id = ?");
    $stmt->execute([$user['id']]);
    $totalInquiries = $stmt->fetch()['total'];
    
    // New inquiries (pending)
    $stmt = $db->prepare("SELECT COUNT(*) as total FROM inquiries WHERE seller_id = ? AND status = 'new'");
    $stmt->execute([$user['id']]);
    $newInquiries = $stmt->fetch()['total'];
    
    // Total views
    $stmt = $db->prepare("SELECT SUM(views_count) as total FROM properties WHERE user_id = ?");
    $stmt->execute([$user['id']]);
    $totalViews = $stmt->fetch()['total'] ?? 0;
    
    // Properties by status
    $stmt = $db->prepare("SELECT status, COUNT(*) as count FROM properties WHERE user_id = ? GROUP BY status");
    $stmt->execute([$user['id']]);
    $propertiesByStatus = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
    
    // Recent inquiries (last 5)
    $stmt = $db->prepare("
        SELECT i.*, p.title as property_title
        FROM inquiries i
        INNER JOIN properties p ON i.property_id = p.id
        WHERE i.seller_id = ?
        ORDER BY i.created_at DESC
        LIMIT 5
    ");
    $stmt->execute([$user['id']]);
    $recentInquiries = $stmt->fetchAll();
    
    // Subscription info
    $stmt = $db->prepare("SELECT plan_type, end_date FROM subscriptions WHERE user_id = ? AND is_active = 1 ORDER BY created_at DESC LIMIT 1");
    $stmt->execute([$user['id']]);
    $subscription = $stmt->fetch();
    
    $stats = [
        'total_properties' => intval($totalProperties),
        'active_properties' => intval($activeProperties),
        'total_inquiries' => intval($totalInquiries),
        'new_inquiries' => intval($newInquiries),
        'total_views' => intval($totalViews),
        'properties_by_status' => [
            'sale' => intval($propertiesByStatus['sale'] ?? 0),
            'rent' => intval($propertiesByStatus['rent'] ?? 0)
        ],
        'recent_inquiries' => $recentInquiries,
        'subscription' => $subscription ? [
            'plan_type' => $subscription['plan_type'],
            'end_date' => $subscription['end_date']
        ] : null
    ];
    
    sendSuccess('Stats retrieved successfully', $stats);
    
} catch (Exception $e) {
    error_log("Dashboard Stats Error: " . $e->getMessage());
    sendError('Failed to retrieve stats', null, 500);
}

