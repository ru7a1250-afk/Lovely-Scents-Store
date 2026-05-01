<?php
// auth.php - نظام المصادقة مع التحقق من كلمة المرور
session_start();
header('Content-Type: application/json');

class AuthSystem {
    private $db;
    
    public function __construct() {
        $this->initDatabase();
    }
    
    private function initDatabase() {
        try {
            // تكوين الاتصال بقاعدة البيانات - عدل هذه الإعدادات حسب متطلباتك
            $host = 'localhost';
            $dbname = 'your_database_name';
            $username = 'your_username';
            $password = 'your_password';
            
            $this->db = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
            $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            
        } catch (PDOException $e) {
            error_log("فشل الاتصال بقاعدة البيانات: " . $e->getMessage());
            $this->sendResponse(false, 'خطأ في الخادم');
        }
    }
    
    public function handleRequest() {
        $action = $_POST['action'] ?? $_GET['action'] ?? '';
        
        switch ($action) {
            case 'register':
                $this->register();
                break;
            case 'login':
                $this->login();
                break;
            case 'logout':
                $this->logout();
                break;
            default:
                $this->sendResponse(false, 'إجراء غير معروف');
        }
    }
    
    private function register() {
        // التحقق من البيانات المطلوبة
        $required = ['fullname', 'email', 'password', 'confirm_password'];
        foreach ($required as $field) {
            if (empty($_POST[$field])) {
                $this->sendResponse(false, 'جميع الحقول مطلوبة');
            }
        }
        
        $fullname = trim($_POST['fullname']);
        $email = trim($_POST['email']);
        $password = $_POST['password'];
        $confirm_password = $_POST['confirm_password'];
        
        // التحقق من صحة البريد الإلكتروني
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->sendResponse(false, 'البريد الإلكتروني غير صالح');
        }
        
        // التحقق من كلمة المرور (6 خانات على الأقل)
        if (strlen($password) < 6) {
            $this->sendResponse(false, 'كلمة المرور يجب أن تكون 6 خانات على الأقل');
        }
        
        // التحقق من تطابق كلمات المرور
        if ($password !== $confirm_password) {
            $this->sendResponse(false, 'كلمات المرور غير متطابقة');
        }
        
        // التحقق من عدم وجود المستخدم مسبقاً
        if ($this->userExists($email)) {
            $this->sendResponse(false, 'البريد الإلكتروني مسجل مسبقاً');
        }
        
        // إنشاء حساب جديد
        try {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            
            $stmt = $this->db->prepare("INSERT INTO users (fullname, email, password, created_at) VALUES (?, ?, ?, NOW())");
            $stmt->execute([$fullname, $email, $hashedPassword]);
            
            if ($stmt->rowCount() > 0) {
                $_SESSION['user_id'] = $this->db->lastInsertId();
                $_SESSION['user_email'] = $email;
                $_SESSION['user_name'] = $fullname;
                
                $this->sendResponse(true, 'تم إنشاء الحساب بنجاح', [
                    'name' => $fullname,
                    'email' => $email
                ]);
            } else {
                $this->sendResponse(false, 'فشل في إنشاء الحساب');
            }
            
        } catch (PDOException $e) {
            error_log("خطأ في التسجيل: " . $e->getMessage());
            $this->sendResponse(false, 'حدث خطأ أثناء إنشاء الحساب');
        }
    }
    
    private function login() {
        // التحقق من البيانات المطلوبة
        if (empty($_POST['email']) || empty($_POST['password'])) {
            $this->sendResponse(false, 'البريد الإلكتروني وكلمة المرور مطلوبان');
        }
        
        $email = trim($_POST['email']);
        $password = $_POST['password'];
        
        // البحث عن المستخدم
        $user = $this->getUserByEmail($email);
        
        if (!$user) {
            $this->sendResponse(false, 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }
        
        // التحقق من كلمة المرور
        if (!password_verify($password, $user['password'])) {
            $this->sendResponse(false, 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }
        
        // تسجيل الدخول
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['user_name'] = $user['fullname'];
        
        $this->sendResponse(true, 'تم تسجيل الدخول بنجاح', [
            'name' => $user['fullname'],
            'email' => $user['email']
        ]);
    }
    
    private function logout() {
        // مسح بيانات الجلسة
        session_unset();
        session_destroy();
        
        $this->sendResponse(true, 'تم تسجيل الخروج بنجاح');
    }
    
    private function userExists($email) {
        try {
            $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            return $stmt->fetch() !== false;
        } catch (PDOException $e) {
            error_log("خطأ في التحقق من المستخدم: " . $e->getMessage());
            return false;
        }
    }
    
    private function getUserByEmail($email) {
        try {
            $stmt = $this->db->prepare("SELECT id, fullname, email, password FROM users WHERE email = ?");
            $stmt->execute([$email]);
            return $stmt->fetch();
        } catch (PDOException $e) {
            error_log("خطأ في جلب بيانات المستخدم: " . $e->getMessage());
            return false;
        }
    }
    
    private function sendResponse($success, $message, $data = []) {
        $response = [
            'success' => $success,
            'message' => $message
        ];
        
        if (!empty($data)) {
            $response['user'] = $data;
        }
        
        echo json_encode($response);
        exit;
    }
}

// إنشاء جدول المستخدمين إذا لم يكن موجوداً (لأغراض التجربة فقط)
function createUsersTable($db) {
    try {
        $query = "
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            fullname VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        
        CREATE INDEX idx_email ON users(email);
        ";
        
        $db->exec($query);
    } catch (PDOException $e) {
        error_log("خطأ في إنشاء الجدول: " . $e->getMessage());
    }
}

// معالجة الطلب
try {
    $auth = new AuthSystem();
    $auth->handleRequest();
} catch (Exception $e) {
    error_log("خطأ عام: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'حدث خطأ في الخادم'
    ]);
}
?>