<?php
/*session_start();
header('Content-Type: application/json; charset=utf-8');

// التحقق من تسجيل الدخول
if (!isset($_SESSION['customer_id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'يجب تسجيل الدخول أولاً'
    ]);
    exit;
}

// إعدادات قاعدة البيانات
$host = 'localhost';
$dbname = 'perfume_store';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'فشل الاتصال بقاعدة البيانات: ' . $e->getMessage()
    ]);
    exit;
}

// الحصول على البيانات المرسلة
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    echo json_encode([
        'success' => false,
        'message' => 'لم يتم استلام بيانات الطلب'
    ]);
    exit;
}

try {
    // بدء transaction
    $pdo->beginTransaction();

    // إنشاء رقم طلب فريد
    $orderNumber = 'ORD-' . date('Ymd') . '-' . strtoupper(uniqid());
    
    // استخدام بيانات العميل من الجلسة
    $customerId = $_SESSION['customer_id'];
    
    // حفظ الطلب الرئيسي
    $stmt = $pdo->prepare("
        INSERT INTO orders (
            order_number, customer_id, customer_first_name, customer_last_name, 
            customer_email, customer_phone, customer_address, customer_city, 
            customer_postal_code, subtotal, tax_amount, discount_amount, 
            total_amount, discount_code, payment_method
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $orderNumber,
        $customerId,
        $data['customer']['firstName'],
        $data['customer']['lastName'],
        $data['customer']['email'],
        $data['customer']['phone'],
        $data['customer']['address'],
        $data['customer']['city'],
        $data['customer']['postalCode'],
        $data['totals']['subtotal'],
        $data['totals']['tax'],
        $data['totals']['discount'],
        $data['totals']['total'],
        $data['discountCode'],
        'بطاقة ائتمان'
    ]);
    
    $orderId = $pdo->lastInsertId();

    // حفظ عناصر الطلب
    foreach ($data['items'] as $item) {
        $stmt = $pdo->prepare("
            INSERT INTO order_items (
                order_id, product_id, product_name, product_price, 
                product_image, quantity, total_price
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $orderId,
            $item['id'],
            $item['name'],
            $item['price'],
            $item['image'],
            $item['quantity'],
            $item['price'] * $item['quantity']
        ]);
    }

    // تأكيد العملية
    $pdo->commit();

    echo json_encode([
        'success' => true,
        'order_number' => $orderNumber,
        'order_id' => $orderId,
        'message' => 'تم حفظ الطلب بنجاح في قاعدة البيانات'
    ]);

} catch (Exception $e) {
    // التراجع عن العملية في حالة الخطأ
    $pdo->rollBack();
    
    echo json_encode([
        'success' => false,
        'message' => 'حدث خطأ أثناء حفظ الطلب: ' . $e->getMessage()
    ]);
}
?>*/


/*session_start();
header('Content-Type: application/json; charset=utf-8');
// السماح بالطلبات من جميع المصادر (لتطوير)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// التحقق من تسجيل الدخول
if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'يجب تسجيل الدخول أولاً'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// إعدادات قاعدة البيانات
$host = 'localhost';
$dbname = 'perfume_store';
$username = 'root';
$password = '';

// دالة للاتصال بقاعدة البيانات
function getDatabaseConnection() {
    global $host, $dbname, $username, $password;
    
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        return $pdo;
    } catch (PDOException $e) {
        error_log("خطأ في الاتصال بقاعدة البيانات: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => 'خطأ في الاتصال بقاعدة البيانات'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

// الحصول على البيانات المرسلة
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    echo json_encode([
        'success' => false,
        'message' => 'لم يتم استلام بيانات الطلب'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// التحقق من وجود عناصر في السلة
if (empty($data['items']) || count($data['items']) === 0) {
    echo json_encode([
        'success' => false,
        'message' => 'السلة فارغة، لا يمكن حفظ الطلب'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $db = getDatabaseConnection();
    
    // بدء transaction
    $db->beginTransaction();

    // إنشاء رقم طلب فريد
    $orderNumber = 'ORD-' . date('YmdHis') . '-' . rand(1000, 9999);
    
    // استخدام بيانات المستخدم من الجلسة
    $userId = $_SESSION['user_id'];
    
    // حفظ الطلب الرئيسي
    $stmt = $db->prepare("
        INSERT INTO orders (
            order_number, user_id, customer_first_name, customer_last_name, 
            customer_email, customer_phone, customer_address, customer_city, 
            customer_postal_code, subtotal, tax_amount, discount_amount, 
            total_amount, discount_code, payment_method
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $orderNumber,
        $userId,
        $data['customer']['firstName'],
        $data['customer']['lastName'],
        $data['customer']['email'],
        $data['customer']['phone'],
        $data['customer']['address'],
        $data['customer']['city'],
        $data['customer']['postalCode'],
        $data['totals']['subtotal'],
        $data['totals']['tax'],
        $data['totals']['discount'],
        $data['totals']['total'],
        $data['discountCode'] ?? '',
        'بطاقة ائتمان'
    ]);
    
    $orderId = $db->lastInsertId();

    // حفظ عناصر الطلب
    foreach ($data['items'] as $item) {
        $stmt = $db->prepare("
            INSERT INTO order_items (
                order_id, product_id, product_name, product_price, 
                product_image, quantity, total_price
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        
        $totalPrice = $item['price'] * $item['quantity'];
        
        $stmt->execute([
            $orderId,
            $item['id'],
            $item['name'],
            $item['price'],
            $item['image'],
            $item['quantity'],
            $totalPrice
        ]);
    }

    // تأكيد العملية
    $db->commit();

    echo json_encode([
        'success' => true,
        'order_number' => $orderNumber,
        'order_id' => $orderId,
        'message' => 'تم حفظ الطلب بنجاح في قاعدة البيانات'
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    // التراجع عن العملية في حالة الخطأ
    if (isset($db)) {
        $db->rollBack();
    }
    
    error_log("خطأ في حفظ الطلب: " . $e->getMessage());
    
    echo json_encode([
        'success' => false,
        'message' => 'حدث خطأ أثناء حفظ الطلب: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}

// معالجة طلبات OPTIONS (لـ CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
?>/*


/*header('Content-Type: application/json; charset=utf-8');
require_once 'config.php';

class OrderManager {
    private $conn;
    private $orders_table = "orders";
    private $order_items_table = "order_items";
    private $discount_codes_table = "discount_codes";

    public function __construct($db) {
        $this->conn = $db;
    }

    // حفظ الطلب في قاعدة البيانات
    public function saveOrder($orderData) {
        try {
            $this->conn->beginTransaction();

            // إنشاء رقم طلب فريد
            $order_number = $this->generateOrderNumber();
            
            // حساب الإجماليات
            $subtotal = $orderData['totals']['subtotal'];
            $tax = $orderData['totals']['tax'];
            $discount = $orderData['totals']['discount'] ?? 0;
            $total = $orderData['totals']['total'];
            $items_count = count($orderData['items']);

            // الحصول على user_id من الجلسة إذا كان مسجلاً دخول
            $user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;

            // حفظ الطلب الرئيسي
            $order_query = "INSERT INTO " . $this->orders_table . " 
                           (user_id, order_number, customer_name, customer_email, customer_phone, 
                            customer_address, customer_city, customer_postal_code, items_count,
                            subtotal_amount, tax_amount, discount_amount, total_amount, discount_code) 
                           VALUES (:user_id, :order_number, :customer_name, :customer_email, :customer_phone,
                                   :customer_address, :customer_city, :customer_postal_code, :items_count,
                                   :subtotal, :tax, :discount, :total, :discount_code)";
            
            $order_stmt = $this->conn->prepare($order_query);
            $order_stmt->bindParam(':user_id', $user_id);
            $order_stmt->bindParam(':order_number', $order_number);
            $order_stmt->bindParam(':customer_name', $orderData['customer']['firstName'] . ' ' . $orderData['customer']['lastName']);
            $order_stmt->bindParam(':customer_email', $orderData['customer']['email']);
            $order_stmt->bindParam(':customer_phone', $orderData['customer']['phone']);
            $order_stmt->bindParam(':customer_address', $orderData['customer']['address']);
            $order_stmt->bindParam(':customer_city', $orderData['customer']['city']);
            $order_stmt->bindParam(':customer_postal_code', $orderData['customer']['postalCode']);
            $order_stmt->bindParam(':items_count', $items_count);
            $order_stmt->bindParam(':subtotal', $subtotal);
            $order_stmt->bindParam(':tax', $tax);
            $order_stmt->bindParam(':discount', $discount);
            $order_stmt->bindParam(':total', $total);
            $order_stmt->bindParam(':discount_code', $orderData['discountCode']);
            
            if (!$order_stmt->execute()) {
                throw new Exception('فشل في حفظ الطلب الرئيسي');
            }

            $order_id = $this->conn->lastInsertId();

            // حفظ عناصر الطلب
            foreach ($orderData['items'] as $item) {
                $item_total = $item['price'] * $item['quantity'];
                
                $item_query = "INSERT INTO " . $this->order_items_table . " 
                              (order_id, product_id, product_name, product_price, quantity, total_price, product_image) 
                              VALUES (:order_id, :product_id, :product_name, :product_price, :quantity, :total_price, :product_image)";
                
                $item_stmt = $this->conn->prepare($item_query);
                $item_stmt->bindParam(':order_id', $order_id);
                $item_stmt->bindParam(':product_id', $item['id']);
                $item_stmt->bindParam(':product_name', $item['name']);
                $item_stmt->bindParam(':product_price', $item['price']);
                $item_stmt->bindParam(':quantity', $item['quantity']);
                $item_stmt->bindParam(':total_price', $item_total);
                $item_stmt->bindParam(':product_image', $item['image']);
                
                if (!$item_stmt->execute()) {
                    throw new Exception('فشل في حفظ عناصر الطلب');
                }
            }

            // تحديث عدد استخدامات كود الخصم إذا كان صالحاً
            if (!empty($orderData['discountCode'])) {
                $this->updateDiscountCodeUsage($orderData['discountCode']);
            }

            $this->conn->commit();

            return [
                'success' => true,
                'order_id' => $order_id,
                'order_number' => $order_number,
                'message' => 'تم حفظ الطلب بنجاح في قاعدة البيانات'
            ];

        } catch (Exception $e) {
            $this->conn->rollBack();
            throw $e;
        }
    }

    // إنشاء رقم طلب فريد
    private function generateOrderNumber() {
        $prefix = 'ORD';
        $date = date('Ymd');
        $random = strtoupper(substr(uniqid(), -6));
        return $prefix . '-' . $date . '-' . $random;
    }

    // تحديث استخدام كود الخصم
    private function updateDiscountCodeUsage($code) {
        $query = "UPDATE " . $this->discount_codes_table . " 
                 SET used_count = used_count + 1 
                 WHERE code = :code AND is_active = TRUE 
                 AND valid_from <= CURDATE() AND valid_to >= CURDATE() 
                 AND (max_uses IS NULL OR used_count < max_uses)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':code', $code);
        $stmt->execute();
    }

    // التحقق من صحة كود الخصم
    public function validateDiscountCode($code) {
        $query = "SELECT discount_percent, max_uses, used_count 
                 FROM " . $this->discount_codes_table . " 
                 WHERE code = :code AND is_active = TRUE 
                 AND valid_from <= CURDATE() AND valid_to >= CURDATE()";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':code', $code);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $discount = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // التحقق من الحد الأقصى لعدد الاستخدامات
            if ($discount['max_uses'] !== null && $discount['used_count'] >= $discount['max_uses']) {
                return ['valid' => false, 'message' => 'تم استخدام كود الخصم لأقصى عدد مرات'];
            }
            
            return [
                'valid' => true,
                'discount_percent' => $discount['discount_percent'],
                'message' => 'كود الخصم صالح'
            ];
        }

        return ['valid' => false, 'message' => 'كود الخصم غير صالح'];
    }

    // الحصول على طلبات المستخدم
    public function getUserOrders($user_id) {
        $query = "SELECT * FROM " . $this->orders_table . " 
                 WHERE user_id = :user_id 
                 ORDER BY created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // الحصول على تفاصيل طلب معين
    public function getOrderDetails($order_id) {
        // بيانات الطلب الرئيسي
        $order_query = "SELECT * FROM " . $this->orders_table . " WHERE id = :order_id";
        $order_stmt = $this->conn->prepare($order_query);
        $order_stmt->bindParam(':order_id', $order_id);
        $order_stmt->execute();
        $order = $order_stmt->fetch(PDO::FETCH_ASSOC);

        // عناصر الطلب
        $items_query = "SELECT * FROM " . $this->order_items_table . " WHERE order_id = :order_id";
        $items_stmt = $this->conn->prepare($items_query);
        $items_stmt->bindParam(':order_id', $order_id);
        $items_stmt->execute();
        $items = $items_stmt->fetchAll(PDO::FETCH_ASSOC);

        return [
            'order' => $order,
            'items' => $items
        ];
    }
}

// معالجة الطلبات
try {
    $database = new Database();
    $db = $database->getConnection();
    $orderManager = new OrderManager($db);

    // الحصول على البيانات المرسلة
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $_GET['action'] ?? '';

    if ($action === 'validate_discount') {
        // التحقق من كود الخصم
        $code = $_GET['code'] ?? '';
        $result = $orderManager->validateDiscountCode($code);
        echo json_encode($result);
        
    } elseif ($action === 'get_orders') {
        // الحصول على طلبات المستخدم
        if (!isset($_SESSION['user_id'])) {
            echo json_encode(['success' => false, 'message' => 'غير مصرح بالوصول']);
            exit;
        }
        $orders = $orderManager->getUserOrders($_SESSION['user_id']);
        echo json_encode(['success' => true, 'orders' => $orders]);
        
    } elseif ($action === 'get_order_details') {
        // الحصول على تفاصيل طلب
        $order_id = $_GET['order_id'] ?? '';
        $result = $orderManager->getOrderDetails($order_id);
        echo json_encode(['success' => true, 'data' => $result]);
        
    } else {
        // حفظ طلب جديد
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $result = $orderManager->saveOrder($input);
            echo json_encode($result);
        } else {
            echo json_encode(['success' => false, 'message' => 'طريقة الطلب غير صحيحة']);
        }
    }

} catch (Exception $e) {
    error_log("خطأ في save_order.php: " . $e->getMessage());
    echo json_encode([
        'success' => false, 
        'message' => 'حدث خطأ في حفظ الطلب: ' . $e->getMessage()
    ]);
}
?>*/

// save_order.php
/*header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// إعدادات قاعدة البيانات مباشرة بدون كلاس
$host = 'localhost';
$dbname = 'auth_system';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'فشل الاتصال بقاعدة البيانات: ' . $e->getMessage()]);
    exit;
}

// استخدم الدوال مباشرة بدون OrderManager
$input = json_decode(file_get_contents('php://input'), true);
$action = $_GET['action'] ?? '';

if ($action === 'validate_discount') {
    validateDiscountCode($pdo);
} elseif ($action === 'get_orders') {
    getUserOrders($pdo);
} elseif ($action === 'get_order_details') {
    getOrderDetails($pdo);
} else {
    saveOrder($pdo);
}

// دالة التحقق من كود الخصم
function validateDiscountCode($pdo) {
    $discountCode = $_GET['code'] ?? '';
    
    if (empty($discountCode)) {
        echo json_encode(['valid' => false, 'message' => 'يرجى إدخال كود الخصم'], JSON_UNESCAPED_UNICODE);
        return;
    }
    
    try {
        $sql = "SELECT * FROM discount_codes WHERE code = ? AND is_active = TRUE";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$discountCode]);
        $discount = $stmt->fetch();
        
        if (!$discount) {
            echo json_encode(['valid' => false, 'message' => 'كود الخصم غير صالح'], JSON_UNESCAPED_UNICODE);
            return;
        }
        
        echo json_encode([
            'valid' => true,
            'discount_percent' => floatval($discount['discount_percent']),
            'message' => 'كود الخصم صالح'
        ], JSON_UNESCAPED_UNICODE);
        
    } catch (PDOException $e) {
        echo json_encode(['valid' => false, 'message' => 'حدث خطأ في التحقق من كود الخصم'], JSON_UNESCAPED_UNICODE);
    }
}

// دالة حفظ الطلب
function saveOrder($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        echo json_encode(['success' => false, 'message' => 'لم يتم استلام بيانات الطلب'], JSON_UNESCAPED_UNICODE);
        return;
    }
    
    try {
        // إنشاء رقم طلب فريد
        $orderNumber = 'ORD-' . date('YmdHis');
        
        // حفظ الطلب
        $orderSql = "INSERT INTO orders (order_number, customer_name, customer_email, total_amount) VALUES (?, ?, ?, ?)";
        $orderStmt = $pdo->prepare($orderSql);
        $orderStmt->execute([
            $orderNumber,
            $input['customer_name'] ?? 'عميل',
            $input['customer_email'] ?? '',
            $input['total_amount'] ?? 0
        ]);
        
        $orderId = $pdo->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'message' => 'تم حفظ الطلب بنجاح',
            'order_number' => $orderNumber,
            'order_id' => $orderId
        ], JSON_UNESCAPED_UNICODE);
        
    } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'message' => 'حدث خطأ في حفظ الطلب: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
}

// دالة جلب الطلبات
function getUserOrders($pdo) {
    try {
        $sql = "SELECT * FROM orders ORDER BY created_at DESC LIMIT 10";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $orders = $stmt->fetchAll();
        
        echo json_encode(['success' => true, 'orders' => $orders], JSON_UNESCAPED_UNICODE);
        
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'حدث خطأ في جلب الطلبات'], JSON_UNESCAPED_UNICODE);
    }
}

// دالة جلب تفاصيل الطلب
function getOrderDetails($pdo) {
    try {
        $orderId = $_GET['order_id'] ?? '';
        
        if (empty($orderId)) {
            echo json_encode(['success' => false, 'message' => 'معرف الطلب مطلوب'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $sql = "SELECT * FROM orders WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$orderId]);
        $order = $stmt->fetch();

        if (!$order) {
            echo json_encode(['success' => false, 'message' => 'الطلب غير موجود'], JSON_UNESCAPED_UNICODE);
            return;
        }

        echo json_encode([
            'success' => true,
            'data' => ['order' => $order]
        ], JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'حدث خطأ في جلب تفاصيل الطلب'], JSON_UNESCAPED_UNICODE);
    }
}*/


/*
// save_order.php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// إعدادات قاعدة البيانات
$host = 'localhost';
$dbname = 'auth_system';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'فشل الاتصال بقاعدة البيانات: ' . $e->getMessage()]);
    exit;
}

// الحصول على البيانات مع تصحيح
$input = json_decode(file_get_contents('php://input'), true);

// إذا لم تكن البيانات موجودة، أظهر رسالة خطأ مفصلة
if (!$input) {
    $rawInput = file_get_contents('php://input');
    echo json_encode([
        'success' => false, 
        'message' => 'لم يتم استلام بيانات الطلب',
        'debug' => [
            'raw_input' => $rawInput,
            'json_last_error' => json_last_error_msg(),
            'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'Not set'
        ]
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$action = $_GET['action'] ?? '';

if ($action === 'validate_discount') {
    validateDiscountCode($pdo);
} elseif ($action === 'get_orders') {
    getUserOrders($pdo);
} elseif ($action === 'get_order_details') {
    getOrderDetails($pdo);
} else {
    saveOrder($pdo, $input);
}

// دالة التحقق من كود الخصم
function validateDiscountCode($pdo) {
    $discountCode = $_GET['code'] ?? '';
    
    if (empty($discountCode)) {
        echo json_encode(['valid' => false, 'message' => 'يرجى إدخال كود الخصم'], JSON_UNESCAPED_UNICODE);
        return;
    }
    
    try {
        $sql = "SELECT * FROM discount_codes WHERE code = ? AND is_active = TRUE";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$discountCode]);
        $discount = $stmt->fetch();
        
        if (!$discount) {
            echo json_encode(['valid' => false, 'message' => 'كود الخصم غير صالح'], JSON_UNESCAPED_UNICODE);
            return;
        }
        
        echo json_encode([
            'valid' => true,
            'discount_percent' => floatval($discount['discount_percent']),
            'message' => 'كود الخصم صالح'
        ], JSON_UNESCAPED_UNICODE);
        
    } catch (PDOException $e) {
        echo json_encode(['valid' => false, 'message' => 'حدث خطأ في التحقق من كود الخصم'], JSON_UNESCAPED_UNICODE);
    }
}

// دالة حفظ الطلب مع معالجة أفضل للأخطاء
function saveOrder($pdo, $input) {
    try {
        // تسجيل البيانات المستلمة للتصحيح
        error_log("بيانات الطلب المستلمة: " . json_encode($input));
        
        // إنشاء رقم طلب فريد
        $orderNumber = 'ORD-' . date('YmdHis') . rand(1000, 9999);
        
        // استخراج البيانات بطرق متعددة لتجنب الأخطاء
        $customer = $input['customer'] ?? [];
        $items = $input['items'] ?? [];
        $totals = $input['totals'] ?? [];
        
        // بيانات العميل مع قيم افتراضية آمنة
        $customerName = '';
        if (isset($customer['firstName']) && isset($customer['lastName'])) {
            $customerName = trim($customer['firstName'] . ' ' . $customer['lastName']);
        } elseif (isset($customer['name'])) {
            $customerName = trim($customer['name']);
        } else {
            $customerName = 'عميل';
        }
        
        $customerEmail = $customer['email'] ?? 'no-email@example.com';
        $customerPhone = $customer['phone'] ?? '';
        $customerAddress = $customer['address'] ?? '';
        $customerCity = $customer['city'] ?? '';
        $customerPostalCode = $customer['postalCode'] ?? '';
        
        // المبالغ مع قيم افتراضية
        $subtotal = $totals['subtotal'] ?? $input['total_amount'] ?? 0;
        $taxAmount = $totals['tax'] ?? 0;
        $discountAmount = $totals['discount'] ?? 0;
        $totalAmount = $totals['total'] ?? $input['total_amount'] ?? $subtotal;
        $discountCode = $input['discountCode'] ?? null;
        
        // إذا كان totalAmount صفراً، احسبه
        if ($totalAmount == 0 && !empty($items)) {
            foreach ($items as $item) {
                $quantity = $item['quantity'] ?? 1;
                $price = $item['price'] ?? 0;
                $totalAmount += $quantity * $price;
            }
        }
        
        // حفظ الطلب الرئيسي
        $orderSql = "INSERT INTO orders (
            order_number, 
            customer_name, 
            customer_email, 
            customer_phone, 
            customer_address,
            customer_city,
            customer_postal_code,
            subtotal,
            tax_amount,
            discount_amount,
            total_amount,
            discount_code
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $orderStmt = $pdo->prepare($orderSql);
        $orderStmt->execute([
            $orderNumber,
            $customerName,
            $customerEmail,
            $customerPhone,
            $customerAddress,
            $customerCity,
            $customerPostalCode,
            $subtotal,
            $taxAmount,
            $discountAmount,
            $totalAmount,
            $discountCode
        ]);
        
        $orderId = $pdo->lastInsertId();
        
        // حفظ عناصر الطلب إذا وجدت
        if (!empty($items) && is_array($items)) {
            $itemsSql = "INSERT INTO order_items (order_id, product_name, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)";
            $itemsStmt = $pdo->prepare($itemsSql);
            
            foreach ($items as $item) {
                $productName = $item['name'] ?? $item['product_name'] ?? 'منتج';
                $quantity = $item['quantity'] ?? 1;
                $unitPrice = $item['price'] ?? $item['unit_price'] ?? 0;
                $totalPrice = $quantity * $unitPrice;
                
                $itemsStmt->execute([
                    $orderId,
                    $productName,
                    $quantity,
                    $unitPrice,
                    $totalPrice
                ]);
            }
        }
        
        // تحديث كود الخصم إذا تم استخدامه
        if (!empty($discountCode)) {
            try {
                $updateDiscountSql = "UPDATE discount_codes SET used_count = used_count + 1 WHERE code = ?";
                $updateDiscountStmt = $pdo->prepare($updateDiscountSql);
                $updateDiscountStmt->execute([$discountCode]);
            } catch (Exception $e) {
                // تجاهل خطأ تحديث الخصم
                error_log("خطأ في تحديث كود الخصم: " . $e->getMessage());
            }
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'تم حفظ الطلب بنجاح! 🎉',
            'order_number' => $orderNumber,
            'order_id' => $orderId,
            'customer' => [
                'name' => $customerName,
                'email' => $customerEmail,
                'phone' => $customerPhone
            ],
            'totals' => [
                'subtotal' => $subtotal,
                'tax' => $taxAmount,
                'discount' => $discountAmount,
                'total' => $totalAmount
            ]
        ], JSON_UNESCAPED_UNICODE);
        
    } catch (Exception $e) {
        error_log("خطأ في حفظ الطلب: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => 'حدث خطأ في حفظ الطلب: ' . $e->getMessage(),
            'debug_info' => [
                'error_line' => $e->getLine(),
                'error_file' => $e->getFile()
            ]
        ], JSON_UNESCAPED_UNICODE);
    }
}

// دالة جلب الطلبات
function getUserOrders($pdo) {
    try {
        $sql = "SELECT * FROM orders ORDER BY created_at DESC LIMIT 10";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $orders = $stmt->fetchAll();
        
        echo json_encode(['success' => true, 'orders' => $orders], JSON_UNESCAPED_UNICODE);
        
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'حدث خطأ في جلب الطلبات'], JSON_UNESCAPED_UNICODE);
    }
}

// دالة جلب تفاصيل الطلب
function getOrderDetails($pdo) {
    try {
        $orderId = $_GET['order_id'] ?? '';
        
        if (empty($orderId)) {
            echo json_encode(['success' => false, 'message' => 'معرف الطلب مطلوب'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $orderSql = "SELECT * FROM orders WHERE id = ?";
        $orderStmt = $pdo->prepare($orderSql);
        $orderStmt->execute([$orderId]);
        $order = $orderStmt->fetch();

        if (!$order) {
            echo json_encode(['success' => false, 'message' => 'الطلب غير موجود'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $itemsSql = "SELECT * FROM order_items WHERE order_id = ?";
        $itemsStmt = $pdo->prepare($itemsSql);
        $itemsStmt->execute([$orderId]);
        $items = $itemsStmt->fetchAll();

        echo json_encode([
            'success' => true,
            'data' => [
                'order' => $order,
                'items' => $items
            ]
        ], JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'حدث خطأ في جلب تفاصيل الطلب'], JSON_UNESCAPED_UNICODE);
    }
}*/




// save_order.php - الإصدار النهائي
/*error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// إعدادات قاعدة البيانات
$host = 'localhost';
$dbname = 'auth_system';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false, 
        'message' => 'فشل الاتصال بقاعدة البيانات'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// الحصول على البيانات
$input = json_decode(file_get_contents('php://input'), true);

// إذا لم تكن البيانات موجودة
if (!$input) {
    echo json_encode([
        'success' => false, 
        'message' => 'لم يتم استلام بيانات الطلب'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// معالجة الطلب
try {
    // إنشاء رقم طلب فريد
    $orderNumber = 'ORD-' . date('Ymd-His') . '-' . rand(1000, 9999);
    
    // استخراج البيانات
    $customer = $input['customer'] ?? [];
    $items = $input['items'] ?? [];
    $totals = $input['totals'] ?? [];
    
    // بيانات العميل
    $customerName = '';
    if (isset($customer['firstName']) && isset($customer['lastName'])) {
        $customerName = trim($customer['firstName'] . ' ' . $customer['lastName']);
    } else {
        $customerName = $customer['name'] ?? 'عميل';
    }
    
    $customerEmail = $customer['email'] ?? '';
    $customerPhone = $customer['phone'] ?? '';
    $customerAddress = $customer['address'] ?? '';
    
    // المبالغ
    $totalAmount = $totals['total'] ?? 0;
    
    // إذا كان المبلغ صفراً، احسبه من العناصر
    if ($totalAmount == 0 && !empty($items)) {
        foreach ($items as $item) {
            $quantity = $item['quantity'] ?? 1;
            $price = $item['price'] ?? 0;
            $totalAmount += $quantity * $price;
        }
    }
    
    // حفظ الطلب الرئيسي
    $orderSql = "INSERT INTO orders (
        order_number, 
        customer_name, 
        customer_email, 
        customer_phone, 
        customer_address,
        total_amount
    ) VALUES (?, ?, ?, ?, ?, ?)";
    
    $orderStmt = $pdo->prepare($orderSql);
    $orderStmt->execute([
        $orderNumber,
        $customerName,
        $customerEmail,
        $customerPhone,
        $customerAddress,
        $totalAmount
    ]);
    
    $orderId = $pdo->lastInsertId();
    
    // حفظ عناصر الطلب
    if (!empty($items) && is_array($items)) {
        $itemsSql = "INSERT INTO order_items (order_id, product_name, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)";
        $itemsStmt = $pdo->prepare($itemsSql);
        
        foreach ($items as $item) {
            $productName = $item['name'] ?? 'منتج';
            $quantity = $item['quantity'] ?? 1;
            $unitPrice = $item['price'] ?? 0;
            $totalPrice = $quantity * $unitPrice;
            
            $itemsStmt->execute([
                $orderId,
                $productName,
                $quantity,
                $unitPrice,
                $totalPrice
            ]);
        }
    }
    
    // الرد النهائي
    echo json_encode([
        'success' => true,
        'message' => 'تم حفظ الطلب بنجاح',
        'order_number' => $orderNumber,
        'order_id' => $orderId,
        'customer_name' => $customerName,
        'total_amount' => $totalAmount
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'حدث خطأ في حفظ الطلب'
    ], JSON_UNESCAPED_UNICODE);
}*/


/*
// save_order.php

header('Content-Type: application/json; charset=utf-8');

// تمكين عرض الأخطاء للتطوير (إزالتها في الإنتاج)
error_reporting(E_ALL);
ini_set('display_errors', 1);

class Database {
    private $host = "localhost";
    private $db_name = "auth_system";
    private $username = "auth_system";
    private $password = "secure_password_123";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username, 
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $exception) {
            error_log("خطأ في الاتصال بقاعدة البيانات: " . $exception->getMessage());
            return null;
        }
        return $this->conn;
    }
}

// دالة للتحقق من كود الخصم
function validateDiscountCode($code, $orderAmount) {
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        return ['valid' => false, 'message' => 'خطأ في الاتصال بقاعدة البيانات'];
    }
    
    try {
        $stmt = $db->prepare("CALL ValidateDiscountCode(:code, :amount)");
        $stmt->bindParam(':code', $code);
        $stmt->bindParam(':amount', $orderAmount);
        $stmt->execute();
        
        $result = $stmt->fetch();
        return $result;
        
    } catch(PDOException $exception) {
        error_log("خطأ في التحقق من كود الخصم: " . $exception->getMessage());
        return ['valid' => false, 'message' => 'خطأ في التحقق من كود الخصم'];
    }
}

// دالة لحفظ الطلب في قاعدة البيانات
function saveOrder($orderData) {
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        return [
            'success' => false,
            'message' => 'تعذر الاتصال بقاعدة البيانات'
        ];
    }
    
    try {
        $db->beginTransaction();
        
        // 1. حفظ أو تحديث بيانات العميل
        $customerStmt = $db->prepare("
            INSERT INTO customers (first_name, last_name, email, phone, address, city, postal_code) 
            VALUES (:first_name, :last_name, :email, :phone, :address, :city, :postal_code)
            ON DUPLICATE KEY UPDATE 
                first_name = VALUES(first_name),
                last_name = VALUES(last_name),
                phone = VALUES(phone),
                address = VALUES(address),
                city = VALUES(city),
                postal_code = VALUES(postal_code),
                id = LAST_INSERT_ID(id)
        ");
        
        $customerStmt->execute([
            ':first_name' => $orderData['customer']['firstName'],
            ':last_name' => $orderData['customer']['lastName'],
            ':email' => $orderData['customer']['email'],
            ':phone' => $orderData['customer']['phone'],
            ':address' => $orderData['customer']['address'],
            ':city' => $orderData['customer']['city'],
            ':postal_code' => $orderData['customer']['postalCode']
        ]);
        
        $customerId = $db->lastInsertId();
        
        // 2. إنشاء رقم طلب فريد
        $orderNumber = 'ORD-' . date('YmdHis') . '-' . rand(1000, 9999);
        
        // 3. حفظ تفاصيل الدفع في JSON
        $paymentDetails = json_encode([
            'card_last_four' => substr($orderData['payment']['cardNumber'], -4),
            'expiry_date' => $orderData['payment']['expiryDate'],
            'payment_time' => date('Y-m-d H:i:s')
        ], JSON_UNESCAPED_UNICODE);
        
        // 4. حفظ الطلب الرئيسي
        $orderStmt = $db->prepare("
            INSERT INTO orders (
                order_number, customer_id, customer_email, customer_phone,
                total_amount, subtotal, tax_amount, discount_amount, discount_code,
                shipping_address, shipping_city, shipping_postal_code,
                payment_method, payment_status, payment_details
            ) VALUES (
                :order_number, :customer_id, :customer_email, :customer_phone,
                :total_amount, :subtotal, :tax_amount, :discount_amount, :discount_code,
                :shipping_address, :shipping_city, :shipping_postal_code,
                :payment_method, :payment_status, :payment_details
            )
        ");
        
        $orderStmt->execute([
            ':order_number' => $orderNumber,
            ':customer_id' => $customerId,
            ':customer_email' => $orderData['customer']['email'],
            ':customer_phone' => $orderData['customer']['phone'],
            ':total_amount' => $orderData['totals']['total'],
            ':subtotal' => $orderData['totals']['subtotal'],
            ':tax_amount' => $orderData['totals']['tax'],
            ':discount_amount' => $orderData['totals']['discount'],
            ':discount_code' => $orderData['discountCode'],
            ':shipping_address' => $orderData['customer']['address'],
            ':shipping_city' => $orderData['customer']['city'],
            ':shipping_postal_code' => $orderData['customer']['postalCode'],
            ':payment_method' => 'credit_card',
            ':payment_status' => 'paid',
            ':payment_details' => $paymentDetails
        ]);
        
        $orderId = $db->lastInsertId();
        
        // 5. حفظ عناصر الطلب
        $itemStmt = $db->prepare("
            INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, total_price) 
            VALUES (:order_id, :product_id, :product_name, :product_price, :quantity, :total_price)
        ");
        
        foreach ($orderData['items'] as $item) {
            $itemStmt->execute([
                ':order_id' => $orderId,
                ':product_id' => $item['id'],
                ':product_name' => $item['name'],
                ':product_price' => $item['price'],
                ':quantity' => $item['quantity'],
                ':total_price' => $item['price'] * $item['quantity']
            ]);
        }
        
        // 6. تحديث عداد استخدام كود الخصم إذا كان موجوداً
        if (!empty($orderData['discountCode'])) {
            $updateDiscountStmt = $db->prepare("
                UPDATE discount_codes 
                SET used_count = used_count + 1 
                WHERE code = :discount_code
            ");
            $updateDiscountStmt->execute([':discount_code' => $orderData['discountCode']]);
        }
        
        $db->commit();
        
        return [
            'success' => true,
            'order_number' => $orderNumber,
            'order_id' => $orderId,
            'customer_id' => $customerId,
            'message' => 'تم حفظ الطلب بنجاح في قاعدة البيانات'
        ];
        
    } catch(PDOException $exception) {
        $db->rollBack();
        error_log("خطأ في حفظ الطلب: " . $exception->getMessage());
        
        return [
            'success' => false,
            'message' => 'حدث خطأ أثناء حفظ الطلب: ' . $exception->getMessage()
        ];
    }
}

// المعالجة الرئيسية للطلب
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // الحصول على البيانات المرسلة
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode([
            'success' => false,
            'message' => 'بيانات غير صالحة'
        ]);
        exit;
    }
    
    // حفظ الطلب
    $result = saveOrder($input);
    
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action'])) {
    
    // معالجة طلبات التحقق من كود الخصم
    if ($_GET['action'] === 'validate_discount' && isset($_GET['code'])) {
        $code = $_GET['code'];
        $amount = isset($_GET['amount']) ? floatval($_GET['amount']) : 0;
        
        $result = validateDiscountCode($code, $amount);
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'طلب غير معروف'
        ]);
    }
    
} else {
    echo json_encode([
        'success' => false,
        'message' => 'طريقة الطلب غير مدعومة'
    ]);
}
?>*/


/*
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// بيانات الاتصال بقاعدة البيانات
$host = 'localhost';
$dbname = 'auth_system';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'فشل الاتصال بقاعدة البيانات: ' . $e->getMessage()]);
    exit;
}

// التحقق من كود الخصم
if (isset($_GET['action']) && $_GET['action'] === 'validate_discount') {
    $code = $_GET['code'] ?? '';
    $amount = floatval($_GET['amount'] ?? 0);
    
    // أكواد الخصم الثابتة (يمكن استبدالها بقاعدة بيانات)
    $discounts = [
        'WELCOME10' => 10,
        'SAVE20' => 20,
        'NEW25' => 25,
        'SPECIAL15' => 15
    ];
    
    if (isset($discounts[$code])) {
        echo json_encode([
            'valid' => true,
            'discount_percent' => $discounts[$code],
            'discount_amount' => $amount * $discounts[$code] / 100,
            'message' => 'تم تطبيق الخصم بنجاح!'
        ]);
    } else {
        echo json_encode([
            'valid' => false,
            'message' => 'كود الخصم غير صحيح أو منتهي الصلاحية'
        ]);
    }
    exit;
}

// حفظ الطلب
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        echo json_encode(['success' => false, 'message' => 'بيانات غير صالحة']);
        exit;
    }
    
    try {
        $pdo->beginTransaction();
        
        // رقم الطلب
        $orderNumber = $input['order_number'] ?? 'ORD-' . time() . '-' . rand(1000, 9999);
        
        // حفظ معلومات العميل والطلب
        $stmt = $pdo->prepare("
            INSERT INTO orders (
                order_number, customer_name, customer_email, customer_phone, 
                customer_address, customer_city, customer_postal_code,
                subtotal, tax, discount, total, discount_code, status, order_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ");
        
        $customer = $input['customer'];
        $totals = $input['totals'];
        
        $customerName = $customer['firstName'] . ' ' . $customer['lastName'];
        
        $stmt->execute([
            $orderNumber,
            $customerName,
            $customer['email'],
            $customer['phone'],
            $customer['address'],
            $customer['city'],
            $customer['postalCode'],
            $totals['subtotal'],
            $totals['tax'],
            $totals['discount'],
            $totals['total'],
            $input['discountCode'],
            'pending'
        ]);
        
        $orderId = $pdo->lastInsertId();
        
        // حفظ عناصر الطلب
        $itemsStmt = $pdo->prepare("
            INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, product_image)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        
        foreach ($input['items'] as $item) {
            $itemsStmt->execute([
                $orderId,
                $item['id'],
                $item['name'],
                $item['price'],
                $item['quantity'],
                $item['image']
            ]);
        }
        
        $pdo->commit();
        
        echo json_encode([
            'success' => true,
            'order_number' => $orderNumber,
            'order_id' => $orderId,
            'message' => 'تم حفظ الطلب بنجاح'
        ]);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'خطأ في حفظ الطلب: ' . $e->getMessage()]);
    }
    exit;
}

echo json_encode(['success' => false, 'message' => 'طلب غير معروف']);
?>*/




// ملف save_order.php - معالجة وحفظ الطلبات

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// التعامل مع طلبات OPTIONS (لـ CORS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// إعدادات قاعدة البيانات - عدل حسب إعداداتك
$host = 'localhost';
$dbname = 'perfume_store';
$username = 'root';
$password = '';

// في حالة XAMPP، جرب كلمة مرور فارغة إذا كنت لم تعدلها
// $password = '';

// أكواد الخصم المتاحة
$discountCodes = [
    'WELCOME10' => 10,
    'SAVE15' => 15,
    'SUMMER20' => 20,
    'NEW25' => 25
];

// دالة للاتصال بقاعدة البيانات
function connectToDatabase() {
    global $host, $dbname, $username, $password;
    
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        return $pdo;
    } catch (PDOException $e) {
        // إرجاع رد بديل إذا فشل الاتصال بقاعدة البيانات
        return [
            'success' => false,
            'message' => 'فشل الاتصال بقاعدة البيانات: ' . $e->getMessage(),
            'fallback' => true
        ];
    }
}

// دالة للرد البديل إذا فشل الاتصال بقاعدة البيانات
function fallbackResponse($orderData) {
    // حفظ الطلب في ملف JSON كبديل
    $ordersFile = 'orders_backup.json';
    $orders = [];
    
    if (file_exists($ordersFile)) {
        $orders = json_decode(file_get_contents($ordersFile), true) ?: [];
    }
    
    $orderNumber = 'ORD-' . date('Ymd-His') . '-' . rand(1000, 9999);
    
    $newOrder = [
        'order_number' => $orderNumber,
        'data' => $orderData,
        'timestamp' => date('Y-m-d H:i:s'),
        'status' => 'pending'
    ];
    
    $orders[] = $newOrder;
    file_put_contents($ordersFile, json_encode($orders, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    
    return [
        'success' => true,
        'order_number' => $orderNumber,
        'message' => 'تم حفظ الطلب في الملف المحلي (الاتصال بقاعدة البيانات فشل)',
        'fallback' => true
    ];
}

// دالة للتحقق من كود الخصم
function validateDiscountCode($code, $amount) {
    global $discountCodes;
    
    // التحقق من الكود في المصفوفة المحلية
    if (isset($discountCodes[$code])) {
        return [
            'valid' => true,
            'discount_percent' => $discountCodes[$code],
            'message' => 'كود الخصم صالح'
        ];
    }
    
    return [
        'valid' => false,
        'message' => 'كود الخصم غير صالح'
    ];
}

// دالة لحفظ الطلب
function saveOrder($orderData) {
    $db = connectToDatabase();
    
    // إذا فشل الاتصال بقاعدة البيانات، استخدم النظام البديل
    if (is_array($db) && isset($db['fallback'])) {
        return fallbackResponse($orderData);
    }
    
    try {
        // إنشاء رقم طلب فريد
        $orderNumber = 'ORD-' . date('Ymd-His') . '-' . rand(1000, 9999);
        
        // حفظ في قاعدة البيانات
        $stmt = $db->prepare("
            INSERT INTO orders (
                order_number, customer_name, customer_email, customer_phone, 
                customer_address, customer_city, customer_postal_code,
                total_amount, discount_amount, tax_amount, final_amount, discount_code, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed')
        ");
        
        $customerName = $orderData['customer']['firstName'] . ' ' . $orderData['customer']['lastName'];
        $customerEmail = $orderData['customer']['email'];
        $customerPhone = $orderData['customer']['phone'];
        $customerAddress = $orderData['customer']['address'];
        $customerCity = $orderData['customer']['city'];
        $customerPostalCode = $orderData['customer']['postalCode'] ?? '';
        $totalAmount = $orderData['totals']['subtotal'];
        $discountAmount = $orderData['totals']['discount'];
        $taxAmount = $orderData['totals']['tax'];
        $finalAmount = $orderData['totals']['total'];
        $discountCode = $orderData['discountCode'] ?? '';
        
        $stmt->execute([
            $orderNumber, $customerName, $customerEmail, $customerPhone,
            $customerAddress, $customerCity, $customerPostalCode,
            $totalAmount, $discountAmount, $taxAmount, $finalAmount, $discountCode
        ]);
        
        $orderId = $db->lastInsertId();
        
        // حفظ عناصر الطلب
        $itemStmt = $db->prepare("
            INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, subtotal)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        
        foreach ($orderData['items'] as $item) {
            $subtotal = $item['price'] * $item['quantity'];
            $itemStmt->execute([
                $orderId,
                $item['id'],
                $item['name'],
                $item['price'],
                $item['quantity'],
                $subtotal
            ]);
        }
        
        return [
            'success' => true,
            'order_number' => $orderNumber,
            'order_id' => $orderId,
            'message' => 'تم حفظ الطلب بنجاح في قاعدة البيانات'
        ];
        
    } catch (PDOException $e) {
        error_log("خطأ في حفظ الطلب: " . $e->getMessage());
        
        // استخدم النظام البديل إذا فشل الحفظ في قاعدة البيانات
        return fallbackResponse($orderData);
    }
}

// المعالجة الرئيسية
try {
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            throw new Exception('لم يتم استلام بيانات صحيحة');
        }
        
        // حفظ الطلب
        $result = saveOrder($input);
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        
    } elseif ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['action'])) {
        
        if ($_GET['action'] == 'validate_discount' && isset($_GET['code'])) {
            $code = $_GET['code'];
            $amount = isset($_GET['amount']) ? floatval($_GET['amount']) : 0;
            
            $result = validateDiscountCode($code, $amount);
            echo json_encode($result, JSON_UNESCAPED_UNICODE);
            
        } else {
            throw new Exception('طلب غير معروف');
        }
        
    } else {
        throw new Exception('طريقة الطلب غير مدعومة');
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>



