<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// إعدادات الاتصال بقاعدة البيانات لـ XAMPP
$host = 'localhost';
$dbname = 'perfume_shop'; // اسم قاعدة البيانات التي ستُنشئها
$username = 'root';        // المستخدم الافتراضي في XAMPP
$password = '';            // كلمة المرور الافتراضية في XAMPP (فارغة)

// استجابة افتراضية
$response = [
    'success' => false,
    'message' => '',
    'products' => []
];

try {
    // إنشاء اتصال PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // استعلام لجلب جميع المنتجات
    $sql = "SELECT * FROM products WHERE status = 'active' ORDER BY created_at DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    
    // جلب البيانات كمصفوفة ارتباطية
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if ($products) {
        $response['success'] = true;
        $response['message'] = 'تم جلب المنتجات بنجاح';
        $response['products'] = $products;
    } else {
        $response['message'] = 'لا توجد منتجات في قاعدة البيانات';
    }
    
} catch (PDOException $e) {
    $response['message'] = 'خطأ في الاتصال بقاعدة البيانات: ' . $e->getMessage();
    
    // في حالة الخطأ، استخدم بيانات افتراضية للاختبار
    $response['products'] = getDefaultProducts();
    $response['success'] = true;
    $response['message'] = 'بيانات افتراضية (للاستخدام أثناء التطوير)';
    
} catch (Exception $e) {
    $response['message'] = 'خطأ: ' . $e->getMessage();
}

// دالة للبيانات الافتراضية
function getDefaultProducts() {
    return [
        [
            'id' => '1',
            'name' => 'Rose Éclat',
            'price' => '180',
            'image' => 'images/pert.jpg',
            'description' => 'عطر نسائي برائحة الورد الفرنسي الفاخر مع لمسات من الفانيليا والمسك الأبيض',
            'category' => 'نسائي',
            'stock_quantity' => 50
        ],
        [
            'id' => '2',
            'name' => 'Violet Lavender',
            'price' => '199',
            'image' => 'images/uuuuu.jpg',
            'description' => 'هذا العطر يتميز بنفحات من زهرة البنفسج واللافندر، مما يخلق توليفة زهرية ناعمة وأنيقة',
            'category' => 'نسائي',
            'stock_quantity' => 30
        ],
        [
            'id' => '3',
            'name' => 'Larmes de Rose',
            'price' => '250',
            'image' => 'images/Gold.jpg',
            'description' => 'عطر أنثوي راقٍ تنبعث منه نفحات ناعمة من زهرة الماغنوليا واللوتس، ممزوجة بعبير الورد التركي',
            'category' => 'نسائي',
            'stock_quantity' => 25
        ],
        [
            'id' => '4',
            'name' => 'Lumière Blanche',
            'price' => '130',
            'image' => 'images/www.jpg',
            'description' => 'عطر يشبه لحظة صباحية ناعمة، حين يلامس الضوء بشرتك برقة وهدوء',
            'category' => 'محايد',
            'stock_quantity' => 40
        ],
        [
            'id' => '5',
            'name' => 'Or Lumi',
            'price' => '300',
            'image' => 'images/yallow.jpg',
            'description' => 'عطر يفتتح بنفحات من اليوسفي واللافندر، منعشة ومحايدة',
            'category' => 'محايد',
            'stock_quantity' => 35
        ],
        [
            'id' => '6',
            'name' => 'Azure Drift',
            'price' => '180',
            'image' => 'images/Blue Perfume.jpg',
            'description' => 'هذا العطر ينبض بالحياة والحيوية من البرغموت الإيطالي والنعناع الأزرق، ليمنح إحساسًا منعشًا',
            'category' => 'رجالي',
            'stock_quantity' => 45
        ]
    ];
}

// إرجاع البيانات كـ JSON
echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>