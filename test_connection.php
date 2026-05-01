<?php
header('Content-Type: text/html; charset=utf-8');

try {
    $host = "localhost";
    $dbname = "perfume_shop"; 
    $username = "root";
    $password = "";
    
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ تم الاتصال بقاعدة البيانات بنجاح!<br>";
    
    // التحقق من الجداول
    $tables = $conn->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    echo "📊 الجداول الموجودة: " . implode(', ', $tables) . "<br>";
    
    // التحقق من المستخدمين
    $users_count = $conn->query("SELECT COUNT(*) as count FROM users")->fetch()['count'];
    echo "👥 عدد المستخدمين: $users_count<br>";
    
    // التحقق من المنتجات  
    $products_count = $conn->query("SELECT COUNT(*) as count FROM products")->fetch()['count'];
    echo "🛍️ عدد المنتجات: $products_count<br>";
    
} catch(PDOException $e) {
    echo "❌ خطأ في الاتصال: " . $e->getMessage();
}
?>