<?php
/*
// test.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

echo json_encode([
    'success' => true, 
    'message' => 'الخادم يعمل بشكل صحيح',
    'data' => [
        'profile' => [
            'full_name' => 'مستخدم تجريبي',
            'email' => 'test@example.com',
            'phone' => '0500000000',
            'created_at' => date('Y-m-d H:i:s')
        ]
    ]
], JSON_UNESCAPED_UNICODE);
?>*/



// user_info.php
/*header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

echo json_encode([
    'success' => true, 
    'message' => 'تم جلب بيانات المستخدم بنجاح',
    'data' => [
        'user' => [
            'id' => 123,
            'name' => 'أحمد عبدالله',
            'email' => 'ahmed@example.com',
            'role' => 'user',
            'join_date' => '2024-01-01',
            'last_login' => date('Y-m-d H:i:s')
        ]
    ]
], JSON_UNESCAPED_UNICODE);
?>*/



// test.php
echo json_encode([
    'success' => true, 
    'message' => 'الخادم يعمل بشكل صحيح',
    'data' => [
        'profile' => [
            'full_name' => 'مستخدم تجريبي',
            'email' => 'test@example.com',
            'phone' => '0500000000',
            'created_at' => date('Y-m-d H:i:s')
        ]
    ]
]);
?>