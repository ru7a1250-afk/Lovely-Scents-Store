<?php
/*// search.php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// تضمين ملف الإعدادات
require_once 'config.php';

// دالة لتنظيف البيانات
function cleanData($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

// دالة للتحقق من صحة الصورة
function isValidImage($imagePath) {
    if (empty($imagePath)) return false;
    
    if (filter_var($imagePath, FILTER_VALIDATE_URL)) {
        return true;
    }
    
    $fullPath = $_SERVER['DOCUMENT_ROOT'] . '/' . ltrim($imagePath, '/');
    return file_exists($fullPath);
}

// دالة للحصول على صورة افتراضية
function getDefaultImage() {
    return 'https://via.placeholder.com/300x200/f8f9fa/ea70b1?text=عطر+فاخر';
}

try {
    // إنشاء اتصال PDO
    $pdo = getPDOConnection();
    
    // الحصول على كلمة البحث من الطلب
    $searchTerm = isset($_GET['q']) ? $_GET['q'] : '';
    $searchTerm = cleanData($searchTerm);
    
    // الحصول على معاملات إضافية (اختياري)
    $category = isset($_GET['category']) ? cleanData($_GET['category']) : '';
    $minPrice = isset($_GET['min_price']) ? floatval($_GET['min_price']) : 0;
    $maxPrice = isset($_GET['max_price']) ? floatval($_GET['max_price']) : 0;
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
    
    // تحديد الحد الأقصى للنتائج
    $limit = min($limit, 100); // لا تزيد عن 100 نتيجة
    
    if (empty($searchTerm)) {
        // إذا لم يكن هناك بحث، إرجاع منتجات مميزة أو حديثة
        $sql = "SELECT 
                    id,
                    name,
                    description,
                    price,
                    image_path,
                    category,
                    stock_quantity,
                    is_featured
                FROM products 
                WHERE active = 1 
                AND stock_quantity > 0
                ORDER BY 
                    is_featured DESC,
                    created_at DESC
                LIMIT :limit";
        
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        
    } else {
        // استعلام البحث مع FULLTEXT search (إذا كان مدعوماً)
        $searchWords = explode(' ', $searchTerm);
        $searchConditions = [];
        $params = [];
        
        // بناء شروط البحث
        foreach ($searchWords as $index => $word) {
            if (strlen($word) > 2) { // تجاهل الكلمات القصيرة
                $searchConditions[] = "(name LIKE :word{$index} OR description LIKE :word{$index} OR category LIKE :word{$index})";
                $params[":word{$index}"] = "%{$word}%";
            }
        }
        
        if (empty($searchConditions)) {
            // إذا كانت كلمات البحث قصيرة جداً
            $searchConditions[] = "(name LIKE :search OR description LIKE :search)";
            $params[":search"] = "%{$searchTerm}%";
        }
        
        $whereClause = implode(' AND ', $searchConditions);
        
        // بناء الاستعلام الأساسي
        $sql = "SELECT 
                    id,
                    name,
                    description,
                    price,
                    image_path,
                    category,
                    stock_quantity,
                    is_featured,
                    created_at
                FROM products 
                WHERE active = 1 
                AND stock_quantity > 0
                AND ({$whereClause})";
        
        // إضافة فلتر الفئة إذا كان موجوداً
        if (!empty($category)) {
            $sql .= " AND category = :category";
            $params[":category"] = $category;
        }
        
        // إضافة فلتر السعر إذا كان موجوداً
        if ($minPrice > 0) {
            $sql .= " AND price >= :min_price";
            $params[":min_price"] = $minPrice;
        }
        
        if ($maxPrice > 0) {
            $sql .= " AND price <= :max_price";
            $params[":max_price"] = $maxPrice;
        }
        
        // إضافة الترتيب والحد
        $sql .= " ORDER BY 
                    is_featured DESC,
                    CASE 
                        WHEN name LIKE :exact_match THEN 1
                        ELSE 2
                    END,
                    created_at DESC
                LIMIT :limit";
        
        $params[":exact_match"] = "{$searchTerm}%";
        $params[":limit"] = $limit;
        
        $stmt = $pdo->prepare($sql);
        
        // ربط جميع المعاملات
        foreach ($params as $key => $value) {
            $paramType = (strpos($key, 'limit') !== false) ? PDO::PARAM_INT : PDO::PARAM_STR;
            $stmt->bindValue($key, $value, $paramType);
        }
        
        $stmt->execute();
    }
    
    $products = $stmt->fetchAll();
    
    // تحويل البيانات إلى التنسيق المطلوب
    $formattedProducts = [];
    
    foreach ($products as $product) {
        $name = cleanData($product['name']);
        $description = cleanData($product['description']);
        $price = floatval($product['price']);
        $image = cleanData($product['image_path']);
        
        // التحقق من صحة الصورة
        if (!isValidImage($image)) {
            $image = getDefaultImage();
        }
        
        $formattedProducts[] = [
            'id' => intval($product['id']),
            'name' => $name,
            'price' => number_format($price, 2),
            'original_price' => $price,
            'image' => $image,
            'description' => $description,
            'category' => cleanData($product['category']),
            'stock' => intval($product['stock_quantity']),
            'featured' => boolval($product['is_featured']),
            'created_date' => $product['created_at']
        ];
    }
    
    // تسجيل عملية البحث (اختياري)
    error_log("بحث عن: '{$searchTerm}' - النتائج: " . count($formattedProducts));
    
    // إرجاع البيانات كـ JSON
    echo json_encode([
        'success' => true,
        'search_term' => $searchTerm,
        'message' => 'تم البحث بنجاح',
        'count' => count($formattedProducts),
        'products' => $formattedProducts,
        'filters' => [
            'category' => $category,
            'min_price' => $minPrice,
            'max_price' => $maxPrice
        ],
        'timestamp' => date('Y-m-d H:i:s')
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    // في حالة حدوث خطأ
    error_log("خطأ في search.php: " . $e->getMessage());
    
    echo json_encode([
        'success' => false,
        'message' => 'خطأ في البحث: ' . $e->getMessage(),
        'search_term' => $searchTerm,
        'count' => 0,
        'products' => [],
        'timestamp' => date('Y-m-d H:i:s')
    ], JSON_UNESCAPED_UNICODE);
}
?> */



header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// إعدادات قاعدة البيانات
$host = 'localhost';
$dbname = 'perfume_shop';
$username = 'root';
$password = '';

try {
    // إنشاء اتصال PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // الحصول على كلمة البحث من параметر GET
    $searchTerm = isset($_GET['q']) ? trim($_GET['q']) : '';
    
    if (empty($searchTerm)) {
        echo json_encode([
            'success' => true,
            'products' => [],
            'message' => 'يرجى إدخال كلمة للبحث'
        ]);
        exit;
    }
    
    // استعلام البحث مع حماية من SQL Injection
    $sql = "
        SELECT 
            id,
            name,
            price,
            image,
            description,
            category,
            stock_quantity
        FROM products 
        WHERE is_active = 1 
        AND (
            name LIKE :search_term 
            OR description LIKE :search_term 
            OR category LIKE :search_term
        )
        ORDER BY 
            CASE 
                WHEN name LIKE :search_term_exact THEN 1
                WHEN name LIKE :search_term_start THEN 2
                ELSE 3
            END,
            name ASC
    ";
    
    $stmt = $pdo->prepare($sql);
    
    // معاملات البحث
    $searchTermParam = "%$searchTerm%";
    $searchTermExact = "$searchTerm%";
    $searchTermStart = "%$searchTerm";
    
    $stmt->bindParam(':search_term', $searchTermParam);
    $stmt->bindParam(':search_term_exact', $searchTermExact);
    $stmt->bindParam(':search_term_start', $searchTermStart);
    
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // معالجة الصور
    foreach ($products as &$product) {
        if (!empty($product['image']) && !filter_var($product['image'], FILTER_VALIDATE_URL)) {
            $base_url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
            $product['image'] = $base_url . '/' . ltrim($product['image'], '/');
        }
        
        $product['price'] = floatval($product['price']);
        
        // تمييز كلمات البحث في النتائج (اختياري)
        if (!empty($searchTerm)) {
            $product['name'] = preg_replace(
                "/($searchTerm)/i", 
                '<mark>$1</mark>', 
                $product['name']
            );
            $product['description'] = preg_replace(
                "/($searchTerm)/i", 
                '<mark>$1</mark>', 
                $product['description']
            );
        }
    }
    
    echo json_encode([
        'success' => true,
        'products' => $products,
        'count' => count($products),
        'search_term' => $searchTerm,
        'message' => count($products) > 0 ? 
            'تم العثور على ' . count($products) . ' منتج' : 
            'لم يتم العثور على نتائج'
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'خطأ في قاعدة البيانات: ' . $e->getMessage(),
        'products' => []
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'حدث خطأ: ' . $e->getMessage(),
        'products' => []
    ]);
}
?>