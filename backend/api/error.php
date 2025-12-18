<?php
/**
 * Error Handler
 */

// Clean output buffer
if (ob_get_level() > 0) {
    ob_end_clean();
}

require_once __DIR__ . '/../utils/response.php';

// Use response helper to ensure proper JSON
sendError('Endpoint not found', null, 404);

