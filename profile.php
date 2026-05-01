<?php
/*// profile.php
session_start();
header('Content-Type: application/json');

require_once 'functions.php';

$action = $_GET['action'] ?? $_POST['action'] ?? '';

try {
    $pdo = getPDOConnection();
    
    switch($action) {
        case 'get_profile':
            if (!isset($_SESSION['user_id'])) {
                echo json_encode(['success' => false, 'message' => 'يجب تسجيل الدخول']);
                exit;
            }
            
            $user_id = $_SESSION['user_id'];
            $stmt = $pdo->prepare("SELECT id, full_name, email, phone, created_at FROM users WHERE id = ?");
            $stmt->execute([$user_id]);
            $profile = $stmt->fetch();
            
            if ($profile) {
                echo json_encode([
                    'success' => true,
                    'data' => [
                        'profile' => $profile
                    ]
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'لم يتم العثور على المستخدم']);
            }
            break;
            
        case 'get_orders':
            if (!isset($_SESSION['user_id'])) {
                echo json_encode(['success' => false, 'message' => 'يجب تسجيل الدخول']);
                exit;
            }
            
            $user_id = $_SESSION['user_id'];
            $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM orders WHERE user_id = ?");
            $stmt->execute([$user_id]);
            $count = $stmt->fetch()['count'];
            
            // بيانات وهمية للطلبات للاختبار
            $orders = [];
            if ($count > 0) {
                $orders_stmt = $pdo->prepare("SELECT id, order_number, total_amount, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 10");
                $orders_stmt->execute([$user_id]);
                $orders = $orders_stmt->fetchAll();
                
                foreach($orders as &$order) {
                    $items_stmt = $pdo->prepare("SELECT COUNT(*) as items_count FROM order_items WHERE order_id = ?");
                    $items_stmt->execute([$order['id']]);
                    $order['items_count'] = $items_stmt->fetch()['items_count'];
                }
            }
            
            echo json_encode([
                'success' => true,
                'data' => [
                    'count' => $count,
                    'orders' => $orders
                ]
            ]);
            break;
            
        case 'update_profile':
            if (!isset($_SESSION['user_id'])) {
                echo json_encode(['success' => false, 'message' => 'يجب تسجيل الدخول']);
                exit;
            }
            
            $user_id = $_SESSION['user_id'];
            $fullname = cleanData($_POST['fullname'] ?? '');
            $phone = cleanData($_POST['phone'] ?? '');
            
            $stmt = $pdo->prepare("UPDATE users SET full_name = ?, phone = ? WHERE id = ?");
            $stmt->execute([$fullname, $phone, $user_id]);
            
            // جلب البيانات المحدثة
            $stmt = $pdo->prepare("SELECT id, full_name, email, phone, created_at FROM users WHERE id = ?");
            $stmt->execute([$user_id]);
            $updated_user = $stmt->fetch();
            
            echo json_encode([
                'success' => true,
                'message' => 'تم تحديث البيانات بنجاح',
                'user' => [
                    'name' => $updated_user['full_name'],
                    'email' => $updated_user['email'],
                    'phone' => $updated_user['phone']
                ]
            ]);
            break;
            
        default:
            echo json_encode(['success' => false, 'message' => 'إجراء غير معروف']);
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم: ' . $e->getMessage()]);
}
?>*/

/*header('Content-Type: application/json; charset=utf-8');
require_once 'config.php';

class Profile {
    private $conn;
    private $users_table = "users";
    private $orders_table = "orders";

    public function __construct($db) {
        $this->conn = $db;
    }

    // التحقق من تسجيل الدخول
    private function checkAuth() {
        if (!isset($_SESSION['user_id'])) {
            return false;
        }
        return true;
    }

    // الحصول على الملف الشخصي
    public function getProfile() {
        if (!$this->checkAuth()) {
            return ['success' => false, 'message' => 'غير مصرح بالوصول'];
        }

        $query = "SELECT id, full_name, email, phone, birth_date, address, created_at 
                 FROM " . $this->users_table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $_SESSION['user_id']);
        $stmt->execute();

        if ($stmt->rowCount() == 1) {
            $profile = $stmt->fetch(PDO::FETCH_ASSOC);
            return [
                'success' => true,
                'data' => ['profile' => $profile]
            ];
        }

        return ['success' => false, 'message' => 'المستخدم غير موجود'];
    }

    // تحديث الملف الشخصي
    public function updateProfile($full_name, $phone, $birth_date, $address) {
        if (!$this->checkAuth()) {
            return ['success' => false, 'message' => 'غير مصرح بالوصول'];
        }

        $query = "UPDATE " . $this->users_table . " 
                 SET full_name = :full_name, phone = :phone, birth_date = :birth_date, address = :address 
                 WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':full_name', $full_name);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':birth_date', $birth_date);
        $stmt->bindParam(':address', $address);
        $stmt->bindParam(':id', $_SESSION['user_id']);

        if ($stmt->execute()) {
            // تحديث بيانات الجلسة
            $_SESSION['user_name'] = $full_name;
            
            return [
                'success' => true,
                'message' => 'تم تحديث البيانات بنجاح',
                'user' => [
                    'name' => $full_name,
                    'phone' => $phone,
                    'birth_date' => $birth_date,
                    'address' => $address
                ]
            ];
        }

        return ['success' => false, 'message' => 'حدث خطأ أثناء تحديث البيانات'];
    }

    // الحصول على الطلبات
    public function getOrders() {
        if (!$this->checkAuth()) {
            return ['success' => false, 'message' => 'غير مصرح بالوصول'];
        }

        $query = "SELECT id, order_number, items_count, total_amount, status, created_at 
                 FROM " . $this->orders_table . " 
                 WHERE user_id = :user_id 
                 ORDER BY created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $_SESSION['user_id']);
        $stmt->execute();

        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $orders_count = $stmt->rowCount();

        return [
            'success' => true,
            'data' => [
                'orders' => $orders,
                'count' => $orders_count
            ]
        ];
    }

    // الحصول على إحصائيات المستخدم
    public function getUserStats() {
        if (!$this->checkAuth()) {
            return ['success' => false, 'message' => 'غير مصرح بالوصول'];
        }

        $orders_query = "SELECT COUNT(*) as orders_count FROM " . $this->orders_table . " WHERE user_id = :user_id";
        $stmt = $this->conn->prepare($orders_query);
        $stmt->bindParam(':user_id', $_SESSION['user_id']);
        $stmt->execute();
        $orders_count = $stmt->fetch(PDO::FETCH_ASSOC)['orders_count'];

        return [
            'success' => true,
            'data' => [
                'orders_count' => $orders_count
            ]
        ];
    }
}

// معالجة الطلبات
$database = new Database();
$db = $database->getConnection();
$profile = new Profile($db);

$action = $_POST['action'] ?? $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'get_profile':
            $result = $profile->getProfile();
            echo json_encode($result);
            break;

        case 'update_profile':
            if (!isset($_SESSION['user_id'])) {
                echo json_encode(['success' => false, 'message' => 'غير مصرح بالوصول']);
                exit;
            }

            $full_name = $_POST['fullname'] ?? '';
            $phone = $_POST['phone'] ?? '';
            $birth_date = $_POST['birth_date'] ?? '';
            $address = $_POST['address'] ?? '';

            if (empty($full_name)) {
                echo json_encode(['success' => false, 'message' => 'الاسم الكامل مطلوب']);
                exit;
            }

            $result = $profile->updateProfile($full_name, $phone, $birth_date, $address);
            echo json_encode($result);
            break;

        case 'get_orders':
            $result = $profile->getOrders();
            echo json_encode($result);
            break;

        case 'get_user_stats':
            $result = $profile->getUserStats();
            echo json_encode($result);
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'إجراء غير معروف']);
            break;
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'حدث خطأ في الخادم: ' . $e->getMessage()]);
}
?>*/


/*
header('Content-Type: application/json; charset=utf-8');
require_once 'config.php';

class Profile {
    private $conn;
    private $users_table = "users";
    private $orders_table = "orders";

    public function __construct($db) {
        $this->conn = $db;
    }

    // التحقق من تسجيل الدخول
    private function checkAuth() {
        if (!isset($_SESSION['user_id'])) {
            return false;
        }
        return true;
    }

    // الحصول على الملف الشخصي
    public function getProfile() {
        if (!$this->checkAuth()) {
            return ['success' => false, 'message' => 'غير مصرح بالوصول'];
        }

        try {
            $query = "SELECT id, full_name, email, phone, birth_date, address, registration_type, created_at 
                     FROM " . $this->users_table . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $_SESSION['user_id']);
            $stmt->execute();

            if ($stmt->rowCount() == 1) {
                $profile = $stmt->fetch(PDO::FETCH_ASSOC);
                return [
                    'success' => true,
                    'data' => ['profile' => $profile]
                ];
            }

            return ['success' => false, 'message' => 'المستخدم غير موجود'];
        } catch (PDOException $e) {
            error_log("خطأ في getProfile: " . $e->getMessage());
            return ['success' => false, 'message' => 'حدث خطأ في جلب البيانات'];
        }
    }

    // تحديث الملف الشخصي
    public function updateProfile($full_name, $phone, $birth_date, $address) {
        if (!$this->checkAuth()) {
            return ['success' => false, 'message' => 'غير مصرح بالوصول'];
        }

        try {
            $query = "UPDATE " . $this->users_table . " 
                     SET full_name = :full_name, phone = :phone, birth_date = :birth_date, address = :address 
                     WHERE id = :id";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':full_name', $full_name);
            $stmt->bindParam(':phone', $phone);
            $stmt->bindParam(':birth_date', $birth_date);
            $stmt->bindParam(':address', $address);
            $stmt->bindParam(':id', $_SESSION['user_id']);

            if ($stmt->execute()) {
                // تحديث بيانات الجلسة
                $_SESSION['user_name'] = $full_name;
                
                return [
                    'success' => true,
                    'message' => 'تم تحديث البيانات بنجاح',
                    'user' => [
                        'name' => $full_name,
                        'phone' => $phone,
                        'birth_date' => $birth_date,
                        'address' => $address
                    ]
                ];
            }

            return ['success' => false, 'message' => 'حدث خطأ أثناء تحديث البيانات'];
        } catch (PDOException $e) {
            error_log("خطأ في updateProfile: " . $e->getMessage());
            return ['success' => false, 'message' => 'حدث خطأ في تحديث البيانات'];
        }
    }

    // الحصول على الطلبات
    public function getOrders() {
        if (!$this->checkAuth()) {
            return ['success' => false, 'message' => 'غير مصرح بالوصول'];
        }

        try {
            $query = "SELECT id, order_number, items_count, total_amount, status, created_at 
                     FROM " . $this->orders_table . " 
                     WHERE user_id = :user_id 
                     ORDER BY created_at DESC";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $_SESSION['user_id']);
            $stmt->execute();

            $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $orders_count = $stmt->rowCount();

            return [
                'success' => true,
                'data' => [
                    'orders' => $orders,
                    'count' => $orders_count
                ]
            ];
        } catch (PDOException $e) {
            error_log("خطأ في getOrders: " . $e->getMessage());
            return ['success' => false, 'message' => 'حدث خطأ في جلب الطلبات'];
        }
    }

    // الحصول على إحصائيات المستخدم
    public function getUserStats() {
        if (!$this->checkAuth()) {
            return ['success' => false, 'message' => 'غير مصرح بالوصول'];
        }

        try {
            $orders_query = "SELECT COUNT(*) as orders_count FROM " . $this->orders_table . " WHERE user_id = :user_id";
            $stmt = $this->conn->prepare($orders_query);
            $stmt->bindParam(':user_id', $_SESSION['user_id']);
            $stmt->execute();
            $orders_count = $stmt->fetch(PDO::FETCH_ASSOC)['orders_count'];

            return [
                'success' => true,
                'data' => [
                    'orders_count' => $orders_count
                ]
            ];
        } catch (PDOException $e) {
            error_log("خطأ في getUserStats: " . $e->getMessage());
            return ['success' => false, 'message' => 'حدث خطأ في جلب الإحصائيات'];
        }
    }

    // الحصول على معلومات مستخدم معين (للمسؤولين)
    public function getUserById($user_id) {
        if (!$this->checkAuth()) {
            return null;
        }

        try {
            $query = "SELECT id, full_name, email, phone, registration_type, created_at 
                     FROM " . $this->users_table . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $user_id);
            $stmt->execute();

            if ($stmt->rowCount() == 1) {
                return $stmt->fetch(PDO::FETCH_ASSOC);
            }

            return null;
        } catch (PDOException $e) {
            error_log("خطأ في getUserById: " . $e->getMessage());
            return null;
        }
    }

    // الحصول على جميع المستخدمين (للمسؤولين)
    public function getAllUsers() {
        if (!$this->checkAuth()) {
            return ['success' => false, 'message' => 'غير مصرح بالوصول'];
        }

        try {
            $query = "SELECT id, full_name, email, phone, registration_type, created_at 
                     FROM " . $this->users_table . " 
                     ORDER BY created_at DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return [
                'success' => true,
                'data' => [
                    'users' => $users,
                    'total' => count($users)
                ]
            ];
        } catch (PDOException $e) {
            error_log("خطأ في getAllUsers: " . $e->getMessage());
            return ['success' => false, 'message' => 'حدث خطأ في جلب بيانات المستخدمين'];
        }
    }

    // تغيير كلمة المرور
    public function changePassword($current_password, $new_password) {
        if (!$this->checkAuth()) {
            return ['success' => false, 'message' => 'غير مصرح بالوصول'];
        }

        try {
            // التحقق من كلمة المرور الحالية
            $query = "SELECT password FROM " . $this->users_table . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $_SESSION['user_id']);
            $stmt->execute();

            if ($stmt->rowCount() == 1) {
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if (password_verify($current_password, $user['password'])) {
                    // تحديث كلمة المرور
                    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
                    $update_query = "UPDATE " . $this->users_table . " SET password = :password WHERE id = :id";
                    $update_stmt = $this->conn->prepare($update_query);
                    $update_stmt->bindParam(':password', $hashed_password);
                    $update_stmt->bindParam(':id', $_SESSION['user_id']);

                    if ($update_stmt->execute()) {
                        return [
                            'success' => true,
                            'message' => 'تم تغيير كلمة المرور بنجاح'
                        ];
                    }
                } else {
                    return [
                        'success' => false,
                        'message' => 'كلمة المرور الحالية غير صحيحة'
                    ];
                }
            }

            return ['success' => false, 'message' => 'حدث خطأ في تغيير كلمة المرور'];
        } catch (PDOException $e) {
            error_log("خطأ في changePassword: " . $e->getMessage());
            return ['success' => false, 'message' => 'حدث خطأ في تغيير كلمة المرور'];
        }
    }

    // حذف الحساب
    public function deleteAccount($password) {
        if (!$this->checkAuth()) {
            return ['success' => false, 'message' => 'غير مصرح بالوصول'];
        }

        try {
            // التحقق من كلمة المرور
            $query = "SELECT password FROM " . $this->users_table . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $_SESSION['user_id']);
            $stmt->execute();

            if ($stmt->rowCount() == 1) {
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if (password_verify($password, $user['password'])) {
                    // حذف المستخدم (سيتم حذف الطلبات المرتبطة تلقائياً بسبب CASCADE)
                    $delete_query = "DELETE FROM " . $this->users_table . " WHERE id = :id";
                    $delete_stmt = $this->conn->prepare($delete_query);
                    $delete_stmt->bindParam(':id', $_SESSION['user_id']);

                    if ($delete_stmt->execute()) {
                        session_destroy();
                        return [
                            'success' => true,
                            'message' => 'تم حذف الحساب بنجاح'
                        ];
                    }
                } else {
                    return [
                        'success' => false,
                        'message' => 'كلمة المرور غير صحيحة'
                    ];
                }
            }

            return ['success' => false, 'message' => 'حدث خطأ في حذف الحساب'];
        } catch (PDOException $e) {
            error_log("خطأ في deleteAccount: " . $e->getMessage());
            return ['success' => false, 'message' => 'حدث خطأ في حذف الحساب'];
        }
    }
}

// معالجة الطلبات
try {
    $database = new Database();
    $db = $database->getConnection();
    $profile = new Profile($db);

    $action = $_POST['action'] ?? $_GET['action'] ?? '';

    // قائمة بالإجراءات التي تتطلب مصادقة
    $auth_required_actions = [
        'get_profile', 'update_profile', 'get_orders', 'get_user_stats', 
        'get_user_info', 'get_all_users', 'change_password', 'delete_account'
    ];
    
    // التحقق من المصادقة للإجراءات التي تتطلبها
    if (in_array($action, $auth_required_actions)) {
        if (!isset($_SESSION['user_id'])) {
            echo json_encode(['success' => false, 'message' => 'غير مصرح بالوصول']);
            exit;
        }
    }

    switch ($action) {
        case 'get_profile':
            $result = $profile->getProfile();
            echo json_encode($result);
            break;

        case 'update_profile':
            $full_name = $_POST['fullname'] ?? '';
            $phone = $_POST['phone'] ?? '';
            $birth_date = $_POST['birth_date'] ?? '';
            $address = $_POST['address'] ?? '';

            if (empty($full_name)) {
                echo json_encode(['success' => false, 'message' => 'الاسم الكامل مطلوب']);
                exit;
            }

            $result = $profile->updateProfile($full_name, $phone, $birth_date, $address);
            echo json_encode($result);
            break;

        case 'get_orders':
            $result = $profile->getOrders();
            echo json_encode($result);
            break;

        case 'get_user_stats':
            $result = $profile->getUserStats();
            echo json_encode($result);
            break;

        case 'get_user_info':
            $user_id = $_GET['user_id'] ?? $_SESSION['user_id'];
            $user_info = $profile->getUserById($user_id);
            
            if ($user_info) {
                echo json_encode(['success' => true, 'user' => $user_info]);
            } else {
                echo json_encode(['success' => false, 'message' => 'المستخدم غير موجود']);
            }
            break;

        case 'get_all_users':
            $result = $profile->getAllUsers();
            echo json_encode($result);
            break;

        case 'change_password':
            $current_password = $_POST['current_password'] ?? '';
            $new_password = $_POST['new_password'] ?? '';
            $confirm_password = $_POST['confirm_password'] ?? '';

            if (empty($current_password) || empty($new_password) || empty($confirm_password)) {
                echo json_encode(['success' => false, 'message' => 'جميع الحقول مطلوبة']);
                exit;
            }

            if ($new_password !== $confirm_password) {
                echo json_encode(['success' => false, 'message' => 'كلمات المرور غير متطابقة']);
                exit;
            }

            if (strlen($new_password) < 6) {
                echo json_encode(['success' => false, 'message' => 'كلمة المرور يجب أن تكون 6 أحرف على الأقل']);
                exit;
            }

            $result = $profile->changePassword($current_password, $new_password);
            echo json_encode($result);
            break;

        case 'delete_account':
            $password = $_POST['password'] ?? '';

            if (empty($password)) {
                echo json_encode(['success' => false, 'message' => 'كلمة المرور مطلوبة']);
                exit;
            }

            $result = $profile->deleteAccount($password);
            echo json_encode($result);
            break;

        case 'test_connection':
            // لإختبار الاتصال فقط
            echo json_encode([
                'success' => true,
                'message' => 'الاتصال يعمل بشكل صحيح',
                'session' => [
                    'user_id' => $_SESSION['user_id'] ?? null,
                    'user_name' => $_SESSION['user_name'] ?? null
                ]
            ]);
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'إجراء غير معروف']);
            break;
    }

} catch (Exception $e) {
    error_log("خطأ عام في profile.php: " . $e->getMessage());
    echo json_encode([
        'success' => false, 
        'message' => 'حدث خطأ في الخادم',
        'debug' => (isset($_GET['debug']) && $_GET['debug'] == 'true') ? $e->getMessage() : null
    ]);
}
?>*/

/*
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// تجاوز طلبات OPTIONS للـ CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// إعدادات قاعدة البيانات (نفس إعدادات auth.php)
$host = 'localhost';
$dbname = 'your_database_name';
$username = 'your_username';
$password = 'your_password';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'فشل الاتصال بقاعدة البيانات']);
    exit;
}

// التعامل مع الإجراءات المختلفة
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'get_user_stats':
        handleGetUserStats($pdo);
        break;
    case 'get_profile':
        handleGetProfile($pdo);
        break;
    case 'update_profile':
        handleUpdateProfile($pdo);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'إجراء غير معروف']);
        break;
}

// دالة جلب إحصائيات المستخدم
function handleGetUserStats($pdo) {
    $userId = getUserIdFromRequest();
    
    if (!$userId) {
        echo json_encode(['success' => false, 'message' => 'غير مصرح بالوصول']);
        return;
    }
    
    try {
        // إحصائيات الطلبات (يمكنك استبدالها ببيانات حقيقية)
        $ordersSql = "SELECT COUNT(*) as orders_count FROM orders WHERE user_id = ?";
        $stmt = $pdo->prepare($ordersSql);
        $stmt->execute([$userId]);
        $ordersCount = $stmt->fetchColumn();
        
        echo json_encode([
            'success' => true,
            'data' => [
                'orders_count' => $ordersCount ?: 0,
                'user_id' => $userId
            ]
        ]);
        
    } catch (PDOException $e) {
        // في حالة عدم وجود جدول الطلبات، نرجع قيم افتراضية
        echo json_encode([
            'success' => true,
            'data' => [
                'orders_count' => 0,
                'user_id' => $userId
            ]
        ]);
    }
}

// دالة جلب الملف الشخصي
function handleGetProfile($pdo) {
    $userId = getUserIdFromRequest();
    
    if (!$userId) {
        echo json_encode(['success' => false, 'message' => 'غير مصرح بالوصول']);
        return;
    }
    
    try {
        $sql = "SELECT id, full_name, email, phone, birth_date, address, registration_type, created_at 
               FROM users WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user) {
            echo json_encode([
                'success' => true,
                'user' => $user
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'المستخدم غير موجود']);
        }
        
    } catch (PDOException $e) {
        error_log("Get profile error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'حدث خطأ في جلب البيانات']);
    }
}

// دالة تحديث الملف الشخصي
function handleUpdateProfile($pdo) {
    $userId = getUserIdFromRequest();
    
    if (!$userId) {
        echo json_encode(['success' => false, 'message' => 'غير مصرح بالوصول']);
        return;
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    try {
        $updateFields = [];
        $params = [];
        
        if (isset($input['full_name'])) {
            $updateFields[] = "full_name = ?";
            $params[] = $input['full_name'];
        }
        
        if (isset($input['phone'])) {
            $updateFields[] = "phone = ?";
            $params[] = $input['phone'];
        }
        
        if (isset($input['birth_date'])) {
            $updateFields[] = "birth_date = ?";
            $params[] = $input['birth_date'];
        }
        
        if (isset($input['address'])) {
            $updateFields[] = "address = ?";
            $params[] = $input['address'];
        }
        
        if (empty($updateFields)) {
            echo json_encode(['success' => false, 'message' => 'لا توجد بيانات للتحديث']);
            return;
        }
        
        $params[] = $userId;
        
        $sql = "UPDATE users SET " . implode(', ', $updateFields) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        echo json_encode([
            'success' => true,
            'message' => 'تم تحديث البيانات بنجاح'
        ]);
        
    } catch (PDOException $e) {
        error_log("Update profile error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'حدث خطأ في تحديث البيانات']);
    }
}

// دالة استخراج معرف المستخدم من الطلب
function getUserIdFromRequest() {
    // في مشروع حقيقي، استخدم JWT للتحقق من الهوية
    // للعرض التوضيحي، يمكننا استخدام طريقة مبسطة
    
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    
    if (strpos($authHeader, 'Bearer ') === 0) {
        $token = substr($authHeader, 7);
        $tokenData = json_decode(base64_decode($token), true);
        return $tokenData['user_id'] ?? null;
    }
    
    // للعرض التوضيحي، يمكنك تمرير user_id في الطلب
    return $_GET['user_id'] ?? 1;
}
?>*/



// profile.php
/*header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$host = 'localhost';
$dbname = 'auth_system';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'فشل الاتصال بقاعدة البيانات']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$action = $_GET['action'] ?? $input['action'] ?? '';

switch ($action) {
    case 'get_user_stats':
        handleGetUserStats($pdo);
        break;
    case 'update_profile':
        handleUpdateProfile($pdo, $input);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'إجراء غير معروف']);
        break;
}

function handleGetUserStats($pdo) {
    $userId = getUserIdFromToken();
    
    if (!$userId) {
        echo json_encode(['success' => false, 'message' => 'غير مصرح بالوصول']);
        return;
    }
    
    try {
        echo json_encode([
            'success' => true,
            'data' => [
                'orders_count' => 0,
                'user_id' => $userId
            ]
        ]);
        
    } catch (PDOException $e) {
        echo json_encode([
            'success' => true,
            'data' => [
                'orders_count' => 0,
                'user_id' => $userId
            ]
        ]);
    }
}

function handleUpdateProfile($pdo, $input) {
    $userId = getUserIdFromToken();
    
    if (!$userId) {
        echo json_encode(['success' => false, 'message' => 'غير مصرح بالوصول']);
        return;
    }
    
    try {
        $updateFields = [];
        $params = [];
        
        if (isset($input['full_name'])) {
            $updateFields[] = "full_name = ?";
            $params[] = $input['full_name'];
        }
        
        if (isset($input['phone'])) {
            $updateFields[] = "phone = ?";
            $params[] = $input['phone'];
        }
        
        if (isset($input['birth_date'])) {
            $updateFields[] = "birth_date = ?";
            $params[] = $input['birth_date'];
        }
        
        if (isset($input['address'])) {
            $updateFields[] = "address = ?";
            $params[] = $input['address'];
        }
        
        // تحديث كلمة المرور إذا تم تقديمها
        if (!empty($input['current_password']) && !empty($input['new_password'])) {
            // التحقق من كلمة المرور الحالية
            $checkSql = "SELECT password FROM users WHERE id = ?";
            $stmt = $pdo->prepare($checkSql);
            $stmt->execute([$userId]);
            $user = $stmt->fetch();
            
            if ($user && password_verify($input['current_password'], $user['password'])) {
                $updateFields[] = "password = ?";
                $params[] = password_hash($input['new_password'], PASSWORD_DEFAULT);
            } else {
                echo json_encode(['success' => false, 'message' => 'كلمة المرور الحالية غير صحيحة']);
                return;
            }
        }
        
        if (empty($updateFields)) {
            echo json_encode(['success' => false, 'message' => 'لا توجد بيانات للتحديث']);
            return;
        }
        
        $params[] = $userId;
        
        $sql = "UPDATE users SET " . implode(', ', $updateFields) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        // جلب بيانات المستخدم المحدثة
        $userSql = "SELECT id, full_name, email, phone, birth_date, address, registration_type, created_at 
                   FROM users WHERE id = ?";
        $stmt = $pdo->prepare($userSql);
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
        
        echo json_encode([
            'success' => true,
            'message' => 'تم تحديث البيانات بنجاح',
            'user' => $user
        ]);
        
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'حدث خطأ في تحديث البيانات']);
    }
}

function getUserIdFromToken() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    
    if (strpos($authHeader, 'Bearer ') === 0) {
        $token = substr($authHeader, 7);
        $tokenData = json_decode(base64_decode($token), true);
        return $tokenData['user_id'] ?? null;
    }
    
    return 1;
}
?>*/


// profile.php
/*header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$host = 'localhost';
$dbname = 'auth_system';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'فشل الاتصال بقاعدة البيانات']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$action = $_GET['action'] ?? $input['action'] ?? '';

switch ($action) {
    case 'get_user_stats':
        handleGetUserStats($pdo);
        break;
    case 'update_profile':
        handleUpdateProfile($pdo, $input);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'إجراء غير معروف']);
        break;
}

function handleGetUserStats($pdo) {
    $userId = getUserIdFromToken();
    
    if (!$userId) {
        echo json_encode(['success' => false, 'message' => 'غير مصرح بالوصول']);
        return;
    }
    
    try {
        echo json_encode([
            'success' => true,
            'data' => [
                'orders_count' => 0,
                'user_id' => $userId
            ]
        ]);
        
    } catch (PDOException $e) {
        echo json_encode([
            'success' => true,
            'data' => [
                'orders_count' => 0,
                'user_id' => $userId
            ]
        ]);
    }
}

function handleUpdateProfile($pdo, $input) {
    $userId = getUserIdFromToken();
    
    if (!$userId) {
        echo json_encode(['success' => false, 'message' => 'غير مصرح بالوصول']);
        return;
    }
    
    try {
        if (empty($input['full_name'])) {
            echo json_encode(['success' => false, 'message' => 'الاسم الكامل مطلوب']);
            return;
        }
        
        $sql = "UPDATE users SET full_name = ? WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$input['full_name'], $userId]);
        
        // جلب بيانات المستخدم المحدثة
        $userSql = "SELECT id, full_name, email, created_at FROM users WHERE id = ?";
        $stmt = $pdo->prepare($userSql);
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
        
        echo json_encode([
            'success' => true,
            'message' => 'تم تحديث البيانات بنجاح',
            'user' => $user
        ]);
        
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'حدث خطأ في تحديث البيانات']);
    }
}

function getUserIdFromToken() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    
    if (strpos($authHeader, 'Bearer ') === 0) {
        $token = substr($authHeader, 7);
        $tokenData = json_decode(base64_decode($token), true);
        return $tokenData['user_id'] ?? null;
    }
    
    return 1;
}
?>*/

/*
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// السماح بطلبات OPTIONS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// إعدادات XAMPP الافتراضية
$host = 'localhost';
$username = 'root';
$password = '';
$dbname = 'auth_system';

// الاتصال بقاعدة البيانات
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("SET NAMES utf8");
} catch (PDOException $e) {
    echo json_encode([
        'success' => false, 
        'message' => 'فشل الاتصال بقاعدة البيانات: ' . $e->getMessage()
    ]);
    exit();
}

// الحصول على الإجراء المطلوب
$action = $_GET['action'] ?? '';

// التحقق من التوكن لجميع الإجراءات عدا get_user_stats
if ($action !== 'get_user_stats') {
    $user = verifyToken($pdo);
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'غير مصرح بالوصول']);
        exit();
    }
}

// معالجة الإجراءات
switch ($action) {
    case 'update_profile':
        handleUpdateProfile($pdo, $user);
        break;
    case 'get_user_stats':
        handleGetUserStats($pdo);
        break;
    case 'get_profile':
        handleGetProfile($pdo, $user);
        break;
    case 'get_orders':
        handleGetOrders($pdo, $user);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'إجراء غير معروف']);
        break;
}

// دالة التحقق من التوكن
function verifyToken($pdo) {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    
    if (empty($authHeader)) {
        return false;
    }
    
    // استخراج التوكن من Header
    $token = str_replace('Bearer ', '', $authHeader);
    
    // فك تشفير التوكن
    $tokenData = base64_decode($token);
    $tokenParts = explode('|', $tokenData);
    
    if (count($tokenParts) !== 3) {
        return false;
    }
    
    list($user_id, $email, $timestamp) = $tokenParts;
    
    // التحقق من صلاحية التوكن (24 ساعة)
    if (time() - $timestamp > 86400) {
        return false;
    }
    
    // التحقق من المستخدم
    try {
        $stmt = $pdo->prepare("SELECT id, full_name, email, phone, birth_date, address FROM users WHERE id = ? AND email = ?");
        $stmt->execute([$user_id, $email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $user ?: false;
        
    } catch (PDOException $e) {
        return false;
    }
}

// دالة تحديث الملف الشخصي
function handleUpdateProfile($pdo, $user) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        echo json_encode(['success' => false, 'message' => 'بيانات غير صالحة']);
        return;
    }

    $full_name = trim($input['full_name'] ?? '');
    $phone = trim($input['phone'] ?? '');
    $birth_date = $input['birth_date'] ?? '';
    $address = trim($input['address'] ?? '');

    // التحقق من البيانات
    if (empty($full_name)) {
        echo json_encode(['success' => false, 'message' => 'الاسم الكامل مطلوب']);
        return;
    }

    try {
        $stmt = $pdo->prepare("UPDATE users SET full_name = ?, phone = ?, birth_date = ?, address = ? WHERE id = ?");
        $stmt->execute([$full_name, $phone, $birth_date, $address, $user['id']]);
        
        // الحصول على بيانات المستخدم المحدثة
        $stmt = $pdo->prepare("SELECT id, full_name, email, phone, birth_date, address FROM users WHERE id = ?");
        $stmt->execute([$user['id']]);
        $updatedUser = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($updatedUser && $updatedUser['birth_date']) {
            $updatedUser['birth_date'] = date('Y-m-d', strtotime($updatedUser['birth_date']));
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'تم تحديث البيانات بنجاح',
            'user' => $updatedUser
        ]);
        
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'خطأ في تحديث البيانات: ' . $e->getMessage()]);
    }
}

// دالة الحصول على إحصائيات المستخدم
function handleGetUserStats($pdo) {
    // في حالة عدم وجود توكن، نعيد إحصائيات افتراضية
    $user = verifyToken($pdo);
    
    if (!$user) {
        echo json_encode([
            'success' => true,
            'data' => [
                'orders_count' => 0,
                'pending_orders' => 0,
                'completed_orders' => 0,
                'total_spent' => 0
            ]
        ]);
        return;
    }

    try {
        // عدد الطلبات الكلي
        $stmt = $pdo->prepare("SELECT COUNT(*) as orders_count FROM orders WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $ordersCount = $stmt->fetch(PDO::FETCH_ASSOC)['orders_count'] ?? 0;

        // عدد الطلبات المعلقة
        $stmt = $pdo->prepare("SELECT COUNT(*) as pending_orders FROM orders WHERE user_id = ? AND status = 'pending'");
        $stmt->execute([$user['id']]);
        $pendingOrders = $stmt->fetch(PDO::FETCH_ASSOC)['pending_orders'] ?? 0;

        // عدد الطلبات المكتملة
        $stmt = $pdo->prepare("SELECT COUNT(*) as completed_orders FROM orders WHERE user_id = ? AND status = 'completed'");
        $stmt->execute([$user['id']]);
        $completedOrders = $stmt->fetch(PDO::FETCH_ASSOC)['completed_orders'] ?? 0;

        // إجمالي المصروفات
        $stmt = $pdo->prepare("SELECT SUM(total_amount) as total_spent FROM orders WHERE user_id = ? AND status = 'completed'");
        $stmt->execute([$user['id']]);
        $totalSpent = $stmt->fetch(PDO::FETCH_ASSOC)['total_spent'] ?? 0;

        echo json_encode([
            'success' => true,
            'data' => [
                'orders_count' => (int)$ordersCount,
                'pending_orders' => (int)$pendingOrders,
                'completed_orders' => (int)$completedOrders,
                'total_spent' => (float)$totalSpent
            ]
        ]);
        
    } catch (PDOException $e) {
        echo json_encode([
            'success' => true,
            'data' => [
                'orders_count' => 0,
                'pending_orders' => 0,
                'completed_orders' => 0,
                'total_spent' => 0
            ]
        ]);
    }
}

// دالة الحصول على البيانات الشخصية
function handleGetProfile($pdo, $user) {
    if ($user && $user['birth_date']) {
        $user['birth_date'] = date('Y-m-d', strtotime($user['birth_date']));
    }
    
    echo json_encode([
        'success' => true,
        'data' => $user
    ]);
}

// دالة الحصول على طلبات المستخدم
function handleGetOrders($pdo, $user) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$user['id']]);
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'data' => $orders
        ]);
        
    } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'message' => 'خطأ في جلب الطلبات: ' . $e->getMessage()
        ]);
    }
}
?>*/


/*
header('Content-Type: application/json');
require_once 'config.php';

$action = $_GET['action'] ?? '';

$database = new Database();
$db = $database->getConnection();

if ($action === 'update_profile') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $user_id = $data['user_id'] ?? '';
    $full_name = $data['full_name'] ?? '';
    $phone = $data['phone'] ?? '';
    $birth_date = $data['birth_date'] ?? '';
    $address = $data['address'] ?? '';
    $current_password = $data['current_password'] ?? '';
    $new_password = $data['new_password'] ?? '';
    
    if (empty($user_id)) {
        echo json_encode(['success' => false, 'message' => 'معرف المستخدم مطلوب']);
        exit;
    }
    
    // الحصول على بيانات المستخدم الحالية
    $user_query = "SELECT * FROM users WHERE id = ?";
    $user_stmt = $db->prepare($user_query);
    $user_stmt->execute([$user_id]);
    $current_user = $user_stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$current_user) {
        echo json_encode(['success' => false, 'message' => 'المستخدم غير موجود']);
        exit;
    }
    
    // تحديث كلمة المرور إذا تم إدخالها
    $password_update = '';
    $params = [$full_name, $phone, $birth_date, $address, $user_id];
    
    if (!empty($new_password)) {
        if (empty($current_password)) {
            echo json_encode(['success' => false, 'message' => 'يجب إدخال كلمة المرور الحالية']);
            exit;
        }
        
        if (!password_verify($current_password, $current_user['password'])) {
            echo json_encode(['success' => false, 'message' => 'كلمة المرور الحالية غير صحيحة']);
            exit;
        }
        
        if (strlen($new_password) < 6) {
            echo json_encode(['success' => false, 'message' => 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل']);
            exit;
        }
        
        $hashed_new_password = password_hash($new_password, PASSWORD_DEFAULT);
        $password_update = ', password = ?';
        array_splice($params, 4, 0, [$hashed_new_password]);
    }
    
    // تحديث البيانات
    $query = "UPDATE users SET full_name = ?, phone = ?, birth_date = ?, address = ?" . $password_update . " WHERE id = ?";
    $stmt = $db->prepare($query);
    
    if ($stmt->execute($params)) {
        // الحصول على البيانات المحدثة
        $updated_query = "SELECT id, full_name, email, phone, birth_date, address, registration_type, created_at FROM users WHERE id = ?";
        $updated_stmt = $db->prepare($updated_query);
        $updated_stmt->execute([$user_id]);
        $updated_user = $updated_stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'message' => 'تم تحديث البيانات بنجاح',
            'user' => $updated_user
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'حدث خطأ أثناء تحديث البيانات']);
    }
}

elseif ($action === 'get_user_stats') {
    $data = json_decode(file_get_contents('php://input'), true);
    $user_id = $data['user_id'] ?? '';
    
    if (empty($user_id)) {
        echo json_encode(['success' => false, 'message' => 'معرف المستخدم مطلوب']);
        exit;
    }
    
    // عدد الطلبات
    $orders_query = "SELECT COUNT(*) as orders_count FROM orders WHERE user_id = ?";
    $orders_stmt = $db->prepare($orders_query);
    $orders_stmt->execute([$user_id]);
    $orders_count = $orders_stmt->fetch(PDO::FETCH_ASSOC)['orders_count'];
    
    echo json_encode([
        'success' => true,
        'data' => [
            'orders_count' => $orders_count
        ]
    ]);
}
?>*/

/*
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

$action = $_GET['action'] ?? '';
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if ($action === 'update_profile') {
    try {
        $database = new Database();
        $db = $database->getConnection();

        if (!$db) {
            throw new Exception('Cannot connect to database');
        }

        $user_id = $data['user_id'] ?? '';
        $full_name = $data['full_name'] ?? '';
        $phone = $data['phone'] ?? '';
        $birth_date = $data['birth_date'] ?? '';
        $address = $data['address'] ?? '';
        $current_password = $data['current_password'] ?? '';
        $new_password = $data['new_password'] ?? '';
        
        if (empty($user_id)) {
            echo json_encode([
                'success' => false, 
                'message' => 'معرف المستخدم مطلوب'
            ]);
            exit;
        }
        
        // الحصول على بيانات المستخدم الحالية
        $user_query = "SELECT * FROM users WHERE id = ?";
        $user_stmt = $db->prepare($user_query);
        $user_stmt->execute([$user_id]);
        $current_user = $user_stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$current_user) {
            echo json_encode([
                'success' => false, 
                'message' => 'المستخدم غير موجود'
            ]);
            exit;
        }
        
        // تحديث كلمة المرور إذا تم إدخالها
        $password_update = '';
        $params = [$full_name, $phone, $birth_date, $address, $user_id];
        
        if (!empty($new_password)) {
            if (empty($current_password)) {
                echo json_encode([
                    'success' => false, 
                    'message' => 'يجب إدخال كلمة المرور الحالية'
                ]);
                exit;
            }
            
            if (!password_verify($current_password, $current_user['password'])) {
                echo json_encode([
                    'success' => false, 
                    'message' => 'كلمة المرور الحالية غير صحيحة'
                ]);
                exit;
            }
            
            if (strlen($new_password) < 6) {
                echo json_encode([
                    'success' => false, 
                    'message' => 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل'
                ]);
                exit;
            }
            
            $hashed_new_password = password_hash($new_password, PASSWORD_DEFAULT);
            $password_update = ', password = ?';
            array_splice($params, 4, 0, [$hashed_new_password]);
        }
        
        // تحديث البيانات
        $query = "UPDATE users SET full_name = ?, phone = ?, birth_date = ?, address = ?" . $password_update . " WHERE id = ?";
        $stmt = $db->prepare($query);
        
        if ($stmt->execute($params)) {
            // الحصول على البيانات المحدثة
            $updated_query = "SELECT id, full_name, email, phone, birth_date, address, created_at FROM users WHERE id = ?";
            $updated_stmt = $db->prepare($updated_query);
            $updated_stmt->execute([$user_id]);
            $updated_user = $updated_stmt->fetch(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true,
                'message' => 'تم تحديث البيانات بنجاح',
                'user' => $updated_user
            ]);
        } else {
            throw new Exception('Failed to update profile');
        }
        
    } catch (Exception $e) {
        error_log("Profile update error: " . $e->getMessage());
        echo json_encode([
            'success' => false, 
            'message' => 'حدث خطأ في الخادم: ' . $e->getMessage()
        ]);
    }
}

elseif ($action === 'get_user_stats') {
    try {
        $database = new Database();
        $db = $database->getConnection();

        if (!$db) {
            throw new Exception('Cannot connect to database');
        }

        $user_id = $data['user_id'] ?? '';
        
        if (empty($user_id)) {
            echo json_encode([
                'success' => false, 
                'message' => 'معرف المستخدم مطلوب'
            ]);
            exit;
        }
        
        // عدد الطلبات
        $orders_query = "SELECT COUNT(*) as orders_count FROM orders WHERE user_id = ?";
        $orders_stmt = $db->prepare($orders_query);
        $orders_stmt->execute([$user_id]);
        $orders_count = $orders_stmt->fetch(PDO::FETCH_ASSOC)['orders_count'];
        
        echo json_encode([
            'success' => true,
            'data' => [
                'orders_count' => $orders_count
            ]
        ]);
        
    } catch (Exception $e) {
        error_log("Stats error: " . $e->getMessage());
        echo json_encode([
            'success' => false, 
            'message' => 'حدث خطأ في الخادم: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'success' => false, 
        'message' => 'عملية غير معروفة'
    ]);
}
?>*/


/*
// ملف profile.php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// إعدادات قاعدة البيانات
$host = "localhost";
$db_name = "auth_system";
$username = "root";
$password = "";

// إعدادات تسجيل الأخطاء
error_reporting(0);
ini_set('display_errors', 0);

$action = $_GET['action'] ?? '';
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if ($action === 'update_profile') {
    try {
        // الاتصال بقاعدة البيانات
        $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $user_id = $data['user_id'] ?? '';
        $full_name = $data['full_name'] ?? '';
        $phone = $data['phone'] ?? '';
        $birth_date = $data['birth_date'] ?? '';
        $address = $data['address'] ?? '';
        
        if (empty($user_id)) {
            echo json_encode([
                'success' => false, 
                'message' => 'معرف المستخدم مطلوب'
            ]);
            exit;
        }
        
        // تحديث البيانات
        $query = "UPDATE users SET full_name = ?, phone = ?, birth_date = ?, address = ? WHERE id = ?";
        $stmt = $conn->prepare($query);
        
        if ($stmt->execute([$full_name, $phone, $birth_date, $address, $user_id])) {
            // الحصول على البيانات المحدثة
            $updated_query = "SELECT id, full_name, email, phone, birth_date, address, created_at FROM users WHERE id = ?";
            $updated_stmt = $conn->prepare($updated_query);
            $updated_stmt->execute([$user_id]);
            $updated_user = $updated_stmt->fetch(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true,
                'message' => 'تم تحديث البيانات بنجاح',
                'user' => $updated_user
            ]);
        } else {
            throw new Exception('فشل في تحديث البيانات');
        }
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false, 
            'message' => 'حدث خطأ في الخادم'
        ]);
    }
}

elseif ($action === 'get_user_stats') {
    try {
        // الاتصال بقاعدة البيانات
        $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $user_id = $data['user_id'] ?? '';
        
        if (empty($user_id)) {
            echo json_encode([
                'success' => false, 
                'message' => 'معرف المستخدم مطلوب'
            ]);
            exit;
        }
        
        // عدد الطلبات
        $orders_query = "SELECT COUNT(*) as orders_count FROM orders WHERE user_id = ?";
        $orders_stmt = $conn->prepare($orders_query);
        $orders_stmt->execute([$user_id]);
        $orders_count = $orders_stmt->fetch(PDO::FETCH_ASSOC)['orders_count'];
        
        echo json_encode([
            'success' => true,
            'data' => [
                'orders_count' => $orders_count
            ]
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => true,
            'data' => [
                'orders_count' => 0
            ]
        ]);
    }
} else {
    echo json_encode([
        'success' => false, 
        'message' => 'عملية غير معروفة'
    ]);
}
?>*/


















// profile.php - نظام إدارة الملف الشخصي
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

class ProfileSystem {
    private $conn;
    private $table_users = 'users';
    private $table_orders = 'orders';
    private $table_order_items = 'order_items';
    private $table_addresses = 'user_addresses';

    public function __construct() {
        $this->conn = $this->connect();
    }

    private function connect() {
        $host = 'localhost';
        $db_name = 'perfume_store';
        $username = 'root';
        $password = '';

        try {
            $conn = new PDO(
                "mysql:host=$host;dbname=$db_name;charset=utf8mb4",
                $username,
                $password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]
            );
            return $conn;
        } catch(PDOException $e) {
            error_log("Connection error: " . $e->getMessage());
            return null;
        }
    }

    // دالة مساعدة لإرسال الردود
    private function sendResponse($success, $message = '', $data = null) {
        $response = ['success' => $success];
        
        if ($message) {
            $response['message'] = $message;
        }
        
        if ($data !== null) {
            $response['data'] = $data;
        }
        
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        
        // الخروج فقط إذا لم يكن تشغيل من سطر الأوامر للاختبار
        if (!self::isCli()) {
            exit;
        }
    }

    // التحقق إذا كان التشغيل من سطر الأوامر - جعلها public static
    public static function isCli() {
        return php_sapi_name() === 'cli' || defined('STDIN');
    }

    // اختبار الاتصال
    public function testConnection() {
        if (!$this->conn) {
            $this->sendResponse(false, 'فشل الاتصال بقاعدة البيانات');
            return;
        }
        
        try {
            $stmt = $this->conn->query("SELECT 1");
            $this->sendResponse(true, 'الاتصال بقاعدة البيانات ناجح');
        } catch (Exception $e) {
            $this->sendResponse(false, 'فشل الاتصال بقاعدة البيانات: ' . $e->getMessage());
        }
    }

    // جلب بيانات الملف الشخصي
    public function getProfile($user_id) {
        if (!$this->conn) {
            $this->sendResponse(false, 'فشل الاتصال بقاعدة البيانات');
            return;
        }

        try {
            $query = "SELECT id, full_name, email, phone, birth_date, address, 
                             loyalty_points, total_orders, total_spent, created_at
                      FROM " . $this->table_users . " 
                      WHERE id = :user_id";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->execute();

            if ($stmt->rowCount() === 1) {
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                $this->sendResponse(true, 'تم جلب البيانات بنجاح', $user);
            } else {
                $this->sendResponse(false, 'المستخدم غير موجود');
            }

        } catch (PDOException $e) {
            $this->sendResponse(false, 'خطأ في جلب البيانات: ' . $e->getMessage());
        }
    }

    // تحديث الملف الشخصي
    public function updateProfile($data) {
        if (!$this->conn) {
            $this->sendResponse(false, 'فشل الاتصال بقاعدة البيانات');
            return;
        }

        try {
            $query = "UPDATE " . $this->table_users . " 
                     SET full_name = :full_name, 
                         phone = :phone, 
                         birth_date = :birth_date, 
                         address = :address,
                         updated_at = CURRENT_TIMESTAMP
                     WHERE id = :user_id";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':full_name', $data['full_name']);
            $stmt->bindParam(':phone', $data['phone']);
            $stmt->bindParam(':birth_date', $data['birth_date']);
            $stmt->bindParam(':address', $data['address']);
            $stmt->bindParam(':user_id', $data['user_id']);

            if ($stmt->execute()) {
                // جلب البيانات المحدثة
                $user_query = "SELECT id, full_name, email, phone, birth_date, address, 
                                      loyalty_points, total_orders, total_spent, created_at
                               FROM " . $this->table_users . " 
                               WHERE id = :user_id";
                $user_stmt = $this->conn->prepare($user_query);
                $user_stmt->bindParam(':user_id', $data['user_id']);
                $user_stmt->execute();
                $user = $user_stmt->fetch(PDO::FETCH_ASSOC);

                $this->sendResponse(true, 'تم تحديث البيانات بنجاح', $user);
            } else {
                $this->sendResponse(false, 'فشل في تحديث البيانات');
            }

        } catch (PDOException $e) {
            $this->sendResponse(false, 'خطأ في تحديث البيانات: ' . $e->getMessage());
        }
    }

    // تغيير كلمة المرور
    public function changePassword($data) {
        if (!$this->conn) {
            $this->sendResponse(false, 'فشل الاتصال بقاعدة البيانات');
            return;
        }

        try {
            // التحقق من كلمة المرور الحالية
            $check_query = "SELECT password FROM " . $this->table_users . " WHERE id = :user_id";
            $check_stmt = $this->conn->prepare($check_query);
            $check_stmt->bindParam(':user_id', $data['user_id']);
            $check_stmt->execute();

            if ($check_stmt->rowCount() === 1) {
                $user = $check_stmt->fetch(PDO::FETCH_ASSOC);

                if (!password_verify($data['current_password'], $user['password'])) {
                    $this->sendResponse(false, 'كلمة المرور الحالية غير صحيحة');
                    return;
                }

                // تحديث كلمة المرور
                $new_password_hash = password_hash($data['new_password'], PASSWORD_DEFAULT);
                
                $update_query = "UPDATE " . $this->table_users . " 
                                SET password = :password, updated_at = CURRENT_TIMESTAMP
                                WHERE id = :user_id";

                $update_stmt = $this->conn->prepare($update_query);
                $update_stmt->bindParam(':password', $new_password_hash);
                $update_stmt->bindParam(':user_id', $data['user_id']);

                if ($update_stmt->execute()) {
                    $this->sendResponse(true, 'تم تغيير كلمة المرور بنجاح');
                } else {
                    $this->sendResponse(false, 'فشل في تغيير كلمة المرور');
                }
            } else {
                $this->sendResponse(false, 'المستخدم غير موجود');
            }

        } catch (PDOException $e) {
            $this->sendResponse(false, 'خطأ في تغيير كلمة المرور: ' . $e->getMessage());
        }
    }

    // جلب طلبات المستخدم
    public function getUserOrders($user_id) {
        if (!$this->conn) {
            $this->sendResponse(false, 'فشل الاتصال بقاعدة البيانات');
            return;
        }

        try {
            $query = "SELECT o.*, 
                             COUNT(oi.id) as items_count,
                             SUM(oi.quantity) as total_quantity
                      FROM " . $this->table_orders . " o
                      LEFT JOIN " . $this->table_order_items . " oi ON o.id = oi.order_id
                      WHERE o.user_id = :user_id
                      GROUP BY o.id
                      ORDER BY o.created_at DESC";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->execute();

            $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $this->sendResponse(true, 'تم جلب الطلبات بنجاح', $orders);

        } catch (PDOException $e) {
            $this->sendResponse(false, 'خطأ في جلب الطلبات: ' . $e->getMessage());
        }
    }

    // جلب تفاصيل طلب محدد
    public function getOrderDetails($order_id, $user_id) {
        if (!$this->conn) {
            $this->sendResponse(false, 'فشل الاتصال بقاعدة البيانات');
            return;
        }

        try {
            // التحقق من أن الطلب يخص المستخدم
            $check_query = "SELECT id FROM " . $this->table_orders . " 
                           WHERE id = :order_id AND user_id = :user_id";
            $check_stmt = $this->conn->prepare($check_query);
            $check_stmt->bindParam(':order_id', $order_id);
            $check_stmt->bindParam(':user_id', $user_id);
            $check_stmt->execute();

            if ($check_stmt->rowCount() === 0) {
                $this->sendResponse(false, 'الطلب غير موجود أو لا يمكن الوصول إليه');
                return;
            }

            // جلب بيانات الطلب
            $order_query = "SELECT * FROM " . $this->table_orders . " 
                           WHERE id = :order_id";
            $order_stmt = $this->conn->prepare($order_query);
            $order_stmt->bindParam(':order_id', $order_id);
            $order_stmt->execute();
            $order = $order_stmt->fetch(PDO::FETCH_ASSOC);

            // جلب عناصر الطلب
            $items_query = "SELECT * FROM " . $this->table_order_items . " 
                           WHERE order_id = :order_id";
            $items_stmt = $this->conn->prepare($items_query);
            $items_stmt->bindParam(':order_id', $order_id);
            $items_stmt->execute();
            $items = $items_stmt->fetchAll(PDO::FETCH_ASSOC);

            $order['items'] = $items;

            $this->sendResponse(true, 'تم جلب تفاصيل الطلب بنجاح', $order);

        } catch (PDOException $e) {
            $this->sendResponse(false, 'خطأ في جلب تفاصيل الطلب: ' . $e->getMessage());
        }
    }

    // إدارة عناوين الشحن
    public function getAddresses($user_id) {
        if (!$this->conn) {
            $this->sendResponse(false, 'فشل الاتصال بقاعدة البيانات');
            return;
        }

        try {
            $query = "SELECT * FROM " . $this->table_addresses . " 
                      WHERE user_id = :user_id 
                      ORDER BY is_default DESC, created_at DESC";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->execute();

            $addresses = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $this->sendResponse(true, 'تم جلب العناوين بنجاح', $addresses);

        } catch (PDOException $e) {
            $this->sendResponse(false, 'خطأ في جلب العناوين: ' . $e->getMessage());
        }
    }

    // إضافة عنوان جديد
    public function addAddress($data) {
        if (!$this->conn) {
            $this->sendResponse(false, 'فشل الاتصال بقاعدة البيانات');
            return;
        }

        try {
            // إذا كان العنوان الافتراضي، إلغاء العناوين الافتراضية الأخرى
            if ($data['is_default']) {
                $reset_query = "UPDATE " . $this->table_addresses . " 
                               SET is_default = 0 
                               WHERE user_id = :user_id";
                $reset_stmt = $this->conn->prepare($reset_query);
                $reset_stmt->bindParam(':user_id', $data['user_id']);
                $reset_stmt->execute();
            }

            $query = "INSERT INTO " . $this->table_addresses . " 
                     (user_id, title, full_name, phone, address, city, postal_code, is_default) 
                     VALUES (:user_id, :title, :full_name, :phone, :address, :city, :postal_code, :is_default)";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $data['user_id']);
            $stmt->bindParam(':title', $data['title']);
            $stmt->bindParam(':full_name', $data['full_name']);
            $stmt->bindParam(':phone', $data['phone']);
            $stmt->bindParam(':address', $data['address']);
            $stmt->bindParam(':city', $data['city']);
            $stmt->bindParam(':postal_code', $data['postal_code']);
            $stmt->bindParam(':is_default', $data['is_default']);

            if ($stmt->execute()) {
                $address_id = $this->conn->lastInsertId();
                $this->sendResponse(true, 'تم إضافة العنوان بنجاح', ['address_id' => $address_id]);
            } else {
                $this->sendResponse(false, 'فشل في إضافة العنوان');
            }

        } catch (PDOException $e) {
            $this->sendResponse(false, 'خطأ في إضافة العنوان: ' . $e->getMessage());
        }
    }

    // تحديث عنوان
    public function updateAddress($data) {
        if (!$this->conn) {
            $this->sendResponse(false, 'فشل الاتصال بقاعدة البيانات');
            return;
        }

        try {
            // التحقق من أن العنوان يخص المستخدم
            $check_query = "SELECT id FROM " . $this->table_addresses . " 
                           WHERE id = :address_id AND user_id = :user_id";
            $check_stmt = $this->conn->prepare($check_query);
            $check_stmt->bindParam(':address_id', $data['address_id']);
            $check_stmt->bindParam(':user_id', $data['user_id']);
            $check_stmt->execute();

            if ($check_stmt->rowCount() === 0) {
                $this->sendResponse(false, 'العنوان غير موجود أو لا يمكن الوصول إليه');
                return;
            }

            // إذا كان العنوان الافتراضي، إلغاء العناوين الافتراضية الأخرى
            if ($data['is_default']) {
                $reset_query = "UPDATE " . $this->table_addresses . " 
                               SET is_default = 0 
                               WHERE user_id = :user_id AND id != :address_id";
                $reset_stmt = $this->conn->prepare($reset_query);
                $reset_stmt->bindParam(':user_id', $data['user_id']);
                $reset_stmt->bindParam(':address_id', $data['address_id']);
                $reset_stmt->execute();
            }

            $query = "UPDATE " . $this->table_addresses . " 
                     SET title = :title, full_name = :full_name, phone = :phone, 
                         address = :address, city = :city, postal_code = :postal_code, 
                         is_default = :is_default, updated_at = CURRENT_TIMESTAMP
                     WHERE id = :address_id";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':title', $data['title']);
            $stmt->bindParam(':full_name', $data['full_name']);
            $stmt->bindParam(':phone', $data['phone']);
            $stmt->bindParam(':address', $data['address']);
            $stmt->bindParam(':city', $data['city']);
            $stmt->bindParam(':postal_code', $data['postal_code']);
            $stmt->bindParam(':is_default', $data['is_default']);
            $stmt->bindParam(':address_id', $data['address_id']);

            if ($stmt->execute()) {
                $this->sendResponse(true, 'تم تحديث العنوان بنجاح');
            } else {
                $this->sendResponse(false, 'فشل في تحديث العنوان');
            }

        } catch (PDOException $e) {
            $this->sendResponse(false, 'خطأ في تحديث العنوان: ' . $e->getMessage());
        }
    }

    // حذف عنوان
    public function deleteAddress($address_id, $user_id) {
        if (!$this->conn) {
            $this->sendResponse(false, 'فشل الاتصال بقاعدة البيانات');
            return;
        }

        try {
            // التحقق من أن العنوان يخص المستخدم
            $check_query = "SELECT id, is_default FROM " . $this->table_addresses . " 
                           WHERE id = :address_id AND user_id = :user_id";
            $check_stmt = $this->conn->prepare($check_query);
            $check_stmt->bindParam(':address_id', $address_id);
            $check_stmt->bindParam(':user_id', $user_id);
            $check_stmt->execute();

            if ($check_stmt->rowCount() === 0) {
                $this->sendResponse(false, 'العنوان غير موجود أو لا يمكن الوصول إليه');
                return;
            }

            $address = $check_stmt->fetch(PDO::FETCH_ASSOC);

            $delete_query = "DELETE FROM " . $this->table_addresses . " 
                            WHERE id = :address_id";
            $delete_stmt = $this->conn->prepare($delete_query);
            $delete_stmt->bindParam(':address_id', $address_id);

            if ($delete_stmt->execute()) {
                // إذا كان العنوان المحذوف هو الافتراضي، جعل أول عنوان آخر افتراضياً
                if ($address['is_default']) {
                    $set_default_query = "UPDATE " . $this->table_addresses . " 
                                         SET is_default = 1 
                                         WHERE user_id = :user_id 
                                         LIMIT 1";
                    $set_default_stmt = $this->conn->prepare($set_default_query);
                    $set_default_stmt->bindParam(':user_id', $user_id);
                    $set_default_stmt->execute();
                }

                $this->sendResponse(true, 'تم حذف العنوان بنجاح');
            } else {
                $this->sendResponse(false, 'فشل في حذف العنوان');
            }

        } catch (PDOException $e) {
            $this->sendResponse(false, 'خطأ في حذف العنوان: ' . $e->getMessage());
        }
    }

    // معالجة الطلبات من خادم الويب
    public function handleWebRequest() {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $input = json_decode(file_get_contents('php://input'), true);
        $action = $_GET['action'] ?? '';

        switch ($action) {
            case 'test':
                if ($method === 'GET') {
                    $this->testConnection();
                }
                break;

            case 'get_profile':
                if ($method === 'GET') {
                    $user_id = $_GET['user_id'] ?? '';
                    if ($user_id) {
                        $this->getProfile($user_id);
                    } else {
                        $this->sendResponse(false, 'معرف المستخدم مطلوب');
                    }
                }
                break;

            case 'update_profile':
                if ($method === 'POST') {
                    if (isset($input['user_id'])) {
                        $this->updateProfile($input);
                    } else {
                        $this->sendResponse(false, 'معرف المستخدم مطلوب');
                    }
                }
                break;

            case 'change_password':
                if ($method === 'POST') {
                    if (isset($input['user_id'])) {
                        $this->changePassword($input);
                    } else {
                        $this->sendResponse(false, 'معرف المستخدم مطلوب');
                    }
                }
                break;

            case 'get_orders':
                if ($method === 'GET') {
                    $user_id = $_GET['user_id'] ?? '';
                    if ($user_id) {
                        $this->getUserOrders($user_id);
                    } else {
                        $this->sendResponse(false, 'معرف المستخدم مطلوب');
                    }
                }
                break;

            case 'get_order_details':
                if ($method === 'GET') {
                    $order_id = $_GET['order_id'] ?? '';
                    $user_id = $_GET['user_id'] ?? '';
                    if ($order_id && $user_id) {
                        $this->getOrderDetails($order_id, $user_id);
                    } else {
                        $this->sendResponse(false, 'معرف الطلب والمستخدم مطلوبان');
                    }
                }
                break;

            case 'get_addresses':
                if ($method === 'GET') {
                    $user_id = $_GET['user_id'] ?? '';
                    if ($user_id) {
                        $this->getAddresses($user_id);
                    } else {
                        $this->sendResponse(false, 'معرف المستخدم مطلوب');
                    }
                }
                break;

            case 'add_address':
                if ($method === 'POST') {
                    if (isset($input['user_id'])) {
                        $this->addAddress($input);
                    } else {
                        $this->sendResponse(false, 'معرف المستخدم مطلوب');
                    }
                }
                break;

            case 'update_address':
                if ($method === 'POST') {
                    if (isset($input['user_id']) && isset($input['address_id'])) {
                        $this->updateAddress($input);
                    } else {
                        $this->sendResponse(false, 'معرف المستخدم والعنوان مطلوبان');
                    }
                }
                break;

            case 'delete_address':
                if ($method === 'POST') {
                    $address_id = $input['address_id'] ?? '';
                    $user_id = $input['user_id'] ?? '';
                    if ($address_id && $user_id) {
                        $this->deleteAddress($address_id, $user_id);
                    } else {
                        $this->sendResponse(false, 'معرف العنوان والمستخدم مطلوبان');
                    }
                }
                break;

            default:
                $this->sendResponse(false, 'الإجراء غير معروف');
        }

        $this->sendResponse(false, 'طلب غير صالح');
    }

    // معالجة الطلبات من سطر الأوامر
    public function handleCliRequest($action, $params = []) {
        switch ($action) {
            case 'test':
                $this->testConnection();
                break;

            case 'get_profile':
                if (isset($params['user_id'])) {
                    $this->getProfile($params['user_id']);
                } else {
                    $this->sendResponse(false, 'معرف المستخدم مطلوب');
                }
                break;

            default:
                $this->sendResponse(false, 'الإجراء غير معروف في وضع سطر الأوامر');
        }
    }
}

// التشغيل الرئيسي
if (ProfileSystem::isCli()) {
    // التشغيل من سطر الأوامر
    $options = getopt("a:", ["action:", "user_id:"]);
    $action = $options['a'] ?? $options['action'] ?? 'test';
    $user_id = $options['user_id'] ?? '';
    
    $profileSystem = new ProfileSystem();
    $params = [];
    
    if ($user_id) {
        $params['user_id'] = $user_id;
    }
    
    $profileSystem->handleCliRequest($action, $params);
} else {
    // التشغيل من خادم ويب
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        exit(0);
    }
    
    $profileSystem = new ProfileSystem();
    $profileSystem->handleWebRequest();
}
?>