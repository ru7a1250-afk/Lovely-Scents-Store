<?php
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

createUsersTable($pdo);

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$action = $_GET['action'] ?? $input['action'] ?? '';

switch ($action) {
    case 'register':
        handleRegister($pdo, $input);
        break;
    case 'login':
        handleLogin($pdo, $input);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'إجراء غير معروف']);
        break;
}

function createUsersTable($pdo) {
    $sql = "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    
    try {
        $pdo->exec($sql);
        addDemoUsers($pdo);
    } catch (PDOException $e) {
        // يمكن تسجيل الخطأ هنا إذا أردت
    }
}

function addDemoUsers($pdo) {
    $demoUsers = [
        [
            'full_name' => 'أحمد محمد',
            'email' => 'ahmed@example.com',
            'password' => password_hash('password123', PASSWORD_DEFAULT)
        ],
        [
            'full_name' => 'فاطمة عبدالله',
            'email' => 'fatima@example.com',
            'password' => password_hash('password123', PASSWORD_DEFAULT)
        ]
    ];
    
    foreach ($demoUsers as $user) {
        $checkSql = "SELECT COUNT(*) FROM users WHERE email = ?";
        $stmt = $pdo->prepare($checkSql);
        $stmt->execute([$user['email']]);
        $exists = $stmt->fetchColumn();
        
        if (!$exists) {
            $insertSql = "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)";
            $stmt = $pdo->prepare($insertSql);
            $stmt->execute([
                $user['full_name'],
                $user['email'],
                $user['password']
            ]);
        }
    }
}

function handleRegister($pdo, $input) {
    if (empty($input['full_name']) || empty($input['email']) || empty($input['password'])) {
        echo json_encode(['success' => false, 'message' => 'جميع الحقول مطلوبة']);
        return;
    }
    
    $full_name = trim($input['full_name']);
    $email = trim($input['email']);
    $password = $input['password'];
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني غير صالح']);
        return;
    }
    
    if (strlen($password) < 6) {
        echo json_encode(['success' => false, 'message' => 'كلمة المرور يجب أن تكون 6 أحرف على الأقل']);
        return;
    }
    
    try {
        $checkSql = "SELECT id FROM users WHERE email = ?";
        $stmt = $pdo->prepare($checkSql);
        $stmt->execute([$email]);
        
        if ($stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني مستخدم مسبقاً']);
            return;
        }
        
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        $insertSql = "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)";
        $stmt = $pdo->prepare($insertSql);
        $stmt->execute([$full_name, $email, $hashedPassword]);
        
        $userId = $pdo->lastInsertId();
        $userSql = "SELECT id, full_name, email, created_at FROM users WHERE id = ?";
        $stmt = $pdo->prepare($userSql);
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // إنشاء token للمستخدم الجديد
        $tokenData = [
            'user_id' => $user['id'],
            'email' => $user['email'],
            'timestamp' => time()
        ];
        $token = base64_encode(json_encode($tokenData));
        
        echo json_encode([
            'success' => true,
            'message' => 'تم إنشاء الحساب بنجاح',
            'token' => $token,
            'user' => $user
        ]);
        
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'حدث خطأ أثناء إنشاء الحساب']);
    }
}

function handleLogin($pdo, $input) {
    if (empty($input['email']) || empty($input['password'])) {
        echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني وكلمة المرور مطلوبان']);
        return;
    }
    
    $email = trim($input['email']);
    $password = $input['password'];
    
    try {
        $sql = "SELECT * FROM users WHERE email = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة']);
            return;
        }
        
        if (!password_verify($password, $user['password'])) {
            echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة']);
            return;
        }
        
        unset($user['password']);
        
        $tokenData = [
            'user_id' => $user['id'],
            'email' => $user['email'],
            'timestamp' => time()
        ];
        $token = base64_encode(json_encode($tokenData));
        
        echo json_encode([
            'success' => true,
            'message' => 'تم تسجيل الدخول بنجاح',
            'token' => $token,
            'user' => $user
        ]);
        
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'حدث خطأ أثناء تسجيل الدخول']);
    }
}*/



/*
require_once 'config.php';
require_once 'Database.php';

class Auth {
    private $db;
    private $pdo;
    
    public function __construct() {
        $this->db = Database::getInstance();
        $this->pdo = $this->db->getConnection();
    }
    
    // تسجيل مستخدم جديد
    public function register($userData) {
        try {
            // التحقق من البيانات
            $this->validateUserData($userData);
            
            // التحقق من عدم وجود المستخدم مسبقاً
            if ($this->userExists($userData['email'], $userData['username'])) {
                throw new Exception('البريد الإلكتروني أو اسم المستخدم موجود مسبقاً');
            }
            
            // تشفير كلمة المرور
            $passwordHash = password_hash($userData['password'], PASSWORD_BCRYPT, ['cost' => Config::BCRYPT_COST]);
            
            // إدخال المستخدم في قاعدة البيانات
            $stmt = $this->pdo->prepare("
                INSERT INTO users (username, email, password_hash, first_name, last_name, phone) 
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            
            $stmt->execute([
                $userData['username'],
                $userData['email'],
                $passwordHash,
                $userData['first_name'],
                $userData['last_name'],
                $userData['phone'] ?? null
            ]);
            
            $userId = $this->pdo->lastInsertId();
            
            // إنشاء رمز التحقق
            $verificationToken = $this->generateVerificationToken($userId);
            
            // تسجيل النشاط
            $this->logActivity($userId, 'register', 'تسجيل مستخدم جديد');
            
            return [
                'success' => true,
                'user_id' => $userId,
                'verification_token' => $verificationToken,
                'message' => 'تم التسجيل بنجاح. يرجى التحقق من بريدك الإلكتروني.'
            ];
            
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
    
    // تسجيل الدخول
    public function login($username, $password, $ipAddress = null, $userAgent = null) {
        try {
            // التحقق من محاولات تسجيل الدخول الفاشلة
            if ($this->isIpLocked($ipAddress)) {
                throw new Exception('تم حظر عنوان IP الخاص بك due to too many failed attempts');
            }
            
            // البحث عن المستخدم
            $stmt = $this->pdo->prepare("
                SELECT * FROM users 
                WHERE (username = ? OR email = ?) AND is_active = TRUE
            ");
            $stmt->execute([$username, $username]);
            $user = $stmt->fetch();
            
            if (!$user || !password_verify($password, $user['password_hash'])) {
                $this->recordFailedAttempt($ipAddress, $username, $userAgent);
                throw new Exception('اسم المستخدم أو كلمة المرور غير صحيحة');
            }
            
            // التحقق من حالة الحساب
            if (!$user['is_verified']) {
                throw new Exception('يرجى التحقق من بريدك الإلكتروني قبل تسجيل الدخول');
            }
            
            // تحديث آخر تسجيل دخول
            $this->updateLastLogin($user['id']);
            
            // إنشاء جلسة جديدة
            $sessionToken = $this->createUserSession($user['id'], $ipAddress, $userAgent);
            
            // تسجيل النشاط
            $this->logActivity($user['id'], 'login', 'تسجيل دخول ناجح', $ipAddress, $userAgent);
            
            // مسح محاولات تسجيل الدخول الفاشلة
            $this->clearFailedAttempts($ipAddress);
            
            return [
                'success' => true,
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'email' => $user['email'],
                    'first_name' => $user['first_name'],
                    'last_name' => $user['last_name'],
                    'role' => $user['role']
                ],
                'session_token' => $sessionToken,
                'message' => 'تم تسجيل الدخول بنجاح'
            ];
            
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
    
    // تسجيل الخروج
    public function logout($sessionToken) {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM user_sessions WHERE session_token = ?");
            $stmt->execute([$sessionToken]);
            
            return ['success' => true, 'message' => 'تم تسجيل الخروج بنجاح'];
            
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
    
    // التحقق من الجلسة
    public function validateSession($sessionToken) {
        try {
            $stmt = $this->pdo->prepare("
                SELECT us.*, u.* 
                FROM user_sessions us 
                JOIN users u ON us.user_id = u.id 
                WHERE us.session_token = ? AND us.expires_at > NOW() AND u.is_active = TRUE
            ");
            $stmt->execute([$sessionToken]);
            $session = $stmt->fetch();
            
            if (!$session) {
                return ['success' => false, 'message' => 'الجلسة غير صالحة'];
            }
            
            return [
                'success' => true,
                'user' => [
                    'id' => $session['user_id'],
                    'username' => $session['username'],
                    'email' => $session['email'],
                    'first_name' => $session['first_name'],
                    'last_name' => $session['last_name'],
                    'role' => $session['role']
                ]
            ];
            
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
    
    // طلب إعادة تعيين كلمة المرور
    public function requestPasswordReset($email) {
        try {
            $stmt = $this->pdo->prepare("SELECT id FROM users WHERE email = ? AND is_active = TRUE");
            $stmt->execute([$email]);
            $user = $stmt->fetch();
            
            if (!$user) {
                throw new Exception('لا يوجد حساب مرتبط بهذا البريد الإلكتروني');
            }
            
            // إنشاء رمز إعادة التعيين
            $resetToken = $this->generatePasswordResetToken($user['id']);
            
            // هنا يمكنك إرسال البريد الإلكتروني
            // $this->sendPasswordResetEmail($email, $resetToken);
            
            return [
                'success' => true,
                'reset_token' => $resetToken,
                'message' => 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني'
            ];
            
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
    
    // إعادة تعيين كلمة المرور
    public function resetPassword($resetToken, $newPassword) {
        try {
            // التحقق من رمز إعادة التعيين
            $stmt = $this->pdo->prepare("
                SELECT pr.*, u.id as user_id 
                FROM password_resets pr 
                JOIN users u ON pr.user_id = u.id 
                WHERE pr.reset_token = ? AND pr.expires_at > NOW() AND pr.is_used = FALSE AND u.is_active = TRUE
            ");
            $stmt->execute([$resetToken]);
            $resetRequest = $stmt->fetch();
            
            if (!$resetRequest) {
                throw new Exception('رابط إعادة التعيين غير صالح أو منتهي الصلاحية');
            }
            
            // التحقق من قوة كلمة المرور
            if (!$this->isPasswordStrong($newPassword)) {
                throw new Exception('كلمة المرور يجب أن تكون على الأقل 8 أحرف وتحتوي على أحرف كبيرة وصغيرة وأرقام');
            }
            
            // تحديث كلمة المرور
            $newPasswordHash = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => Config::BCRYPT_COST]);
            
            $stmt = $this->pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
            $stmt->execute([$newPasswordHash, $resetRequest['user_id']]);
            
            // تعليم رمز إعادة التعيين كمستخدم
            $stmt = $this->pdo->prepare("UPDATE password_resets SET is_used = TRUE WHERE id = ?");
            $stmt->execute([$resetRequest['id']]);
            
            // تسجيل النشاط
            $this->logActivity($resetRequest['user_id'], 'password_reset', 'إعادة تعيين كلمة المرور');
            
            return ['success' => true, 'message' => 'تم إعادة تعيين كلمة المرور بنجاح'];
            
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
    
    // التحقق من البريد الإلكتروني
    public function verifyEmail($verificationToken) {
        try {
            $stmt = $this->pdo->prepare("
                SELECT ev.*, u.id as user_id 
                FROM email_verifications ev 
                JOIN users u ON ev.user_id = u.id 
                WHERE ev.verification_token = ? AND ev.expires_at > NOW() AND u.is_active = TRUE
            ");
            $stmt->execute([$verificationToken]);
            $verification = $stmt->fetch();
            
            if (!$verification) {
                throw new Exception('رابط التحقق غير صالح أو منتهي الصلاحية');
            }
            
            // تحديث حالة التحقق
            $stmt = $this->pdo->prepare("UPDATE users SET is_verified = TRUE WHERE id = ?");
            $stmt->execute([$verification['user_id']]);
            
            // حذف رمز التحقق
            $stmt = $this->pdo->prepare("DELETE FROM email_verifications WHERE id = ?");
            $stmt->execute([$verification['id']]);
            
            // تسجيل النشاط
            $this->logActivity($verification['user_id'], 'email_verified', 'تم التحقق من البريد الإلكتروني');
            
            return ['success' => true, 'message' => 'تم التحقق من بريدك الإلكتروني بنجاح'];
            
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
    
    // الدوال المساعدة
    private function validateUserData($userData) {
        $required = ['username', 'email', 'password', 'first_name', 'last_name'];
        foreach ($required as $field) {
            if (empty($userData[$field])) {
                throw new Exception("حقل {$field} مطلوب");
            }
        }
        
        if (!filter_var($userData['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception('صيغة البريد الإلكتروني غير صحيحة');
        }
        
        if (!$this->isPasswordStrong($userData['password'])) {
            throw new Exception('كلمة المرور يجب أن تكون على الأقل 8 أحرف وتحتوي على أحرف كبيرة وصغيرة وأرقام');
        }
        
        if (strlen($userData['username']) < 3) {
            throw new Exception('اسم المستخدم يجب أن يكون على الأقل 3 أحرف');
        }
    }
    
    private function userExists($email, $username) {
        $stmt = $this->pdo->prepare("SELECT id FROM users WHERE email = ? OR username = ?");
        $stmt->execute([$email, $username]);
        return $stmt->fetch() !== false;
    }
    
    private function isPasswordStrong($password) {
        return strlen($password) >= Config::PASSWORD_MIN_LENGTH &&
               preg_match('/[A-Z]/', $password) &&
               preg_match('/[a-z]/', $password) &&
               preg_match('/[0-9]/', $password);
    }
    
    private function generateVerificationToken($userId) {
        $token = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', time() + Config::VERIFICATION_EXPIRE);
        
        $stmt = $this->pdo->prepare("
            INSERT INTO email_verifications (user_id, verification_token, expires_at) 
            VALUES (?, ?, ?)
        ");
        $stmt->execute([$userId, $token, $expiresAt]);
        
        return $token;
    }
    
    private function generatePasswordResetToken($userId) {
        $token = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', time() + Config::PASSWORD_RESET_EXPIRE);
        
        $stmt = $this->pdo->prepare("
            INSERT INTO password_resets (user_id, reset_token, expires_at) 
            VALUES (?, ?, ?)
        ");
        $stmt->execute([$userId, $token, $expiresAt]);
        
        return $token;
    }
    
    private function createUserSession($userId, $ipAddress, $userAgent) {
        $token = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', time() + Config::SESSION_EXPIRE);
        
        $stmt = $this->pdo->prepare("
            INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent, expires_at) 
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([$userId, $token, $ipAddress, $userAgent, $expiresAt]);
        
        return $token;
    }
    
    private function updateLastLogin($userId) {
        $stmt = $this->pdo->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
        $stmt->execute([$userId]);
    }
    
    private function isIpLocked($ipAddress) {
        if (!$ipAddress) return false;
        
        $stmt = $this->pdo->prepare("
            SELECT COUNT(*) as attempts 
            FROM failed_login_attempts 
            WHERE ip_address = ? AND attempt_time > DATE_SUB(NOW(), INTERVAL ? SECOND)
        ");
        $stmt->execute([$ipAddress, Config::LOCKOUT_TIME]);
        $result = $stmt->fetch();
        
        return $result['attempts'] >= Config::MAX_LOGIN_ATTEMPTS;
    }
    
    private function recordFailedAttempt($ipAddress, $username, $userAgent) {
        if (!$ipAddress) return;
        
        $stmt = $this->pdo->prepare("
            INSERT INTO failed_login_attempts (ip_address, username, user_agent) 
            VALUES (?, ?, ?)
        ");
        $stmt->execute([$ipAddress, $username, $userAgent]);
    }
    
    private function clearFailedAttempts($ipAddress) {
        if (!$ipAddress) return;
        
        $stmt = $this->pdo->prepare("DELETE FROM failed_login_attempts WHERE ip_address = ?");
        $stmt->execute([$ipAddress]);
    }
    
    private function logActivity($userId, $activityType, $description, $ipAddress = null, $userAgent = null) {
        $stmt = $this->pdo->prepare("
            INSERT INTO activity_logs (user_id, activity_type, description, ip_address, user_agent) 
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([$userId, $activityType, $description, $ipAddress, $userAgent]);
    }
}
?>*/


/*
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

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

// دالة لإنشاء توكن
function generateToken($userId) {
    $payload = [
        'user_id' => $userId,
        'exp' => time() + (24 * 60 * 60) // صلاحية 24 ساعة
    ];
    return base64_encode(json_encode($payload));
}

// دالة للتحقق من التوكن
function verifyToken($token) {
    try {
        $payload = json_decode(base64_decode($token), true);
        if ($payload && isset($payload['user_id']) && isset($payload['exp']) && $payload['exp'] > time()) {
            return $payload['user_id'];
        }
    } catch (Exception $e) {
        return false;
    }
    return false;
}

// التحقق من المصادقة
function authenticate($pdo) {
    $headers = getallheaders();
    $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;
    
    if (!$token) {
        return null;
    }
    
    $userId = verifyToken($token);
    if (!$userId) {
        return null;
    }
    
    // جلب بيانات المستخدم
    $stmt = $pdo->prepare("SELECT id, first_name, last_name, email, phone FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    return $user ? $user : null;
}

// تسجيل الدخول
if (isset($_GET['action']) && $_GET['action'] === 'login') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['email']) || !isset($input['password'])) {
        echo json_encode(['success' => false, 'message' => 'بيانات غير مكتملة']);
        exit;
    }
    
    $email = $input['email'];
    $password = $input['password'];
    
    try {
        $stmt = $pdo->prepare("SELECT id, first_name, last_name, email, phone, password FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['password'])) {
            $token = generateToken($user['id']);
            
            // إزالة كلمة المرور من البيانات المرتجعة
            unset($user['password']);
            
            echo json_encode([
                'success' => true,
                'user' => $user,
                'token' => $token,
                'message' => 'تم تسجيل الدخول بنجاح'
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة']);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'حدث خطأ في تسجيل الدخول: ' . $e->getMessage()]);
    }
    exit;
}

// إنشاء حساب جديد
if (isset($_GET['action']) && $_GET['action'] === 'register') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $required = ['first_name', 'last_name', 'email', 'phone', 'password'];
    foreach ($required as $field) {
        if (!isset($input[$field]) || empty($input[$field])) {
            echo json_encode(['success' => false, 'message' => 'جميع الحقول مطلوبة']);
            exit;
        }
    }
    
    $firstName = $input['first_name'];
    $lastName = $input['last_name'];
    $email = $input['email'];
    $phone = $input['phone'];
    $password = password_hash($input['password'], PASSWORD_DEFAULT);
    
    try {
        // التحقق من عدم وجود حساب بنفس البريد الإلكتروني
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        
        if ($stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني مسجل مسبقاً']);
            exit;
        }
        
        // إنشاء الحساب الجديد
        $stmt = $pdo->prepare("INSERT INTO users (first_name, last_name, email, phone, password, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
        $stmt->execute([$firstName, $lastName, $email, $phone, $password]);
        
        $userId = $pdo->lastInsertId();
        $token = generateToken($userId);
        
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $userId,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $email,
                'phone' => $phone
            ],
            'token' => $token,
            'message' => 'تم إنشاء الحساب بنجاح'
        ]);
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'حدث خطأ في إنشاء الحساب: ' . $e->getMessage()]);
    }
    exit;
}

// الحصول على بيانات المستخدم (للمصادقة)
if (isset($_GET['action']) && $_GET['action'] === 'me') {
    $user = authenticate($pdo);
    
    if ($user) {
        echo json_encode(['success' => true, 'user' => $user]);
    } else {
        echo json_encode(['success' => false, 'message' => 'غير مصرح بالوصول']);
    }
    exit;
}

echo json_encode(['success' => false, 'message' => 'طلب غير معروف']);
?>*/

/*
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// معالجة طلبات CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
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
    echo json_encode(['success' => false, 'message' => 'خطأ في الاتصال بقاعدة البيانات']);
    exit;
}

// استيراد دوال المصادقة
require_once 'auth.php';

// الحصول على الإجراء المطلوب
$action = $_GET['action'] ?? '';

// التحقق من التوكن للمسارات المحمية
$token = getBearerToken();

switch ($action) {
    case 'update_profile':
        handleProfileUpdate($pdo, $token);
        break;
    case 'get_user_stats':
        handleGetUserStats($pdo, $token);
        break;
    case 'get_orders':
        handleGetOrders($pdo, $token);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'إجراء غير معروف']);
        break;
}

function getBearerToken() {
    $headers = getallheaders();
    
    // التحقق من رأس Authorization
    if (isset($headers['Authorization'])) {
        if (preg_match('/Bearer\s+(.*)$/i', $headers['Authorization'], $matches)) {
            return $matches[1];
        }
    }
    
    // التحقق من query string
    if (isset($_GET['token'])) {
        return $_GET['token'];
    }
    
    return null;
}

function handleProfileUpdate($pdo, $token) {
    $user = getAuthenticatedUser($pdo, $token);
    
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'غير مصرح بالوصول']);
        return;
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    $full_name = trim($input['full_name'] ?? '');
    $phone = $input['phone'] ?? '';
    $birth_date = $input['birth_date'] ?? '';
    $address = $input['address'] ?? '';
    
    if (empty($full_name)) {
        echo json_encode(['success' => false, 'message' => 'الاسم الكامل مطلوب']);
        return;
    }
    
    try {
        // تحديث البيانات باستخدام الأعمدة الصحيحة
        $stmt = $pdo->prepare("UPDATE users SET full_name = ?, phone = ?, birth_date = ?, address = ? WHERE id = ?");
        $stmt->execute([$full_name, $phone, $birth_date, $address, $user['id']]);
        
        // جلب البيانات المحدثة باستخدام الأعمدة الصحيحة
        $stmt = $pdo->prepare("SELECT id, full_name, email, phone, birth_date, address, created_at FROM users WHERE id = ?");
        $stmt->execute([$user['id']]);
        $updated_user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'message' => 'تم تحديث البيانات بنجاح',
            'user' => $updated_user
        ]);
        
    } catch (PDOException $e) {
        error_log("Profile update error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'حدث خطأ أثناء تحديث البيانات: ' . $e->getMessage()]);
    }
}

function handleGetUserStats($pdo, $token) {
    $user = getAuthenticatedUser($pdo, $token);
    
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'غير مصرح بالوصول']);
        return;
    }
    
    try {
        // عدد الطلبات
        $stmt = $pdo->prepare("SELECT COUNT(*) as orders_count FROM orders WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $orders_count = $stmt->fetch(PDO::FETCH_ASSOC)['orders_count'];
        
        // إجمالي المشتريات
        $stmt = $pdo->prepare("SELECT SUM(total_amount) as total_spent FROM orders WHERE user_id = ? AND status != 'cancelled'");
        $stmt->execute([$user['id']]);
        $total_spent = $stmt->fetch(PDO::FETCH_ASSOC)['total_spent'] ?? 0;
        
        echo json_encode([
            'success' => true,
            'data' => [
                'orders_count' => (int)$orders_count,
                'total_spent' => (float)$total_spent,
                'member_since' => $user['created_at']
            ]
        ]);
        
    } catch (PDOException $e) {
        error_log("User stats error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'حدث خطأ في جلب الإحصائيات']);
    }
}

function handleGetOrders($pdo, $token) {
    $user = getAuthenticatedUser($pdo, $token);
    
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'غير مصرح بالوصول']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$user['id']]);
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // تحليل بيانات JSON
        foreach ($orders as &$order) {
            $order['customer_data'] = json_decode($order['customer_data'], true);
            $order['order_data'] = json_decode($order['order_data'], true);
        }
        
        echo json_encode([
            'success' => true,
            'orders' => $orders
        ]);
        
    } catch (PDOException $e) {
        error_log("Get orders error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'حدث خطأ في جلب الطلبات']);
    }
}
?>*/
































































































































































/*
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// تفعيل تسجيل الأخطاء
error_reporting(E_ALL);
ini_set('display_errors', 1);

// بيانات الاتصال بقاعدة البيانات
$host = 'localhost';
$dbname = 'perfume_store';
$username = 'root';
$password = '';

// تسجيل محاولة الاتصال
error_log("🔄 محاولة الاتصال بقاعدة البيانات: host=$host, dbname=$dbname");

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    error_log("✅ تم الاتصال بقاعدة البيانات بنجاح");
} catch (PDOException $e) {
    error_log("❌ فشل الاتصال بقاعدة البيانات: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'فشل الاتصال بقاعدة البيانات: ' . $e->getMessage()]);
    exit;
}

// دالة لإنشاء توكن
function generateToken($userId) {
    $payload = [
        'user_id' => $userId,
        'exp' => time() + (24 * 60 * 60)
    ];
    return base64_encode(json_encode($payload));
}

// دالة للتحقق من التوكن
function verifyToken($token) {
    try {
        $payload = json_decode(base64_decode($token), true);
        if ($payload && isset($payload['user_id']) && isset($payload['exp']) && $payload['exp'] > time()) {
            return $payload['user_id'];
        }
    } catch (Exception $e) {
        error_log("❌ خطأ في فك التوكن: " . $e->getMessage());
        return false;
    }
    return false;
}

// التحقق من المصادقة
function authenticate($pdo) {
    $headers = getallheaders();
    $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;
    
    if (!$token) {
        error_log("🔐 لا يوجد توكن مصادقة");
        return null;
    }
    
    $userId = verifyToken($token);
    if (!$userId) {
        error_log("❌ التوكن غير صالح");
        return null;
    }
    
    // جلب بيانات المستخدم
    $stmt = $pdo->prepare("SELECT id, first_name, last_name, email, phone FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        error_log("✅ تم المصادقة للمستخدم: " . $user['email']);
    } else {
        error_log("❌ المستخدم غير موجود في قاعدة البيانات");
    }
    
    return $user ? $user : null;
}

// الحصول على البيانات المرسلة
$input = json_decode(file_get_contents('php://input'), true);
error_log("📨 البيانات المستلمة: " . json_encode($input));

// إذا كانت بيانات اختبار
if (isset($input['test'])) {
    error_log("🧪 طلب اختبار مستلم");
    echo json_encode(['success' => true, 'message' => 'اختبار ناجح - الخادم يعمل']);
    exit;
}

// التحقق من كود الخصم
if (isset($_GET['action']) && $_GET['action'] === 'validate_discount') {
    $code = $_GET['code'] ?? '';
    $amount = floatval($_GET['amount'] ?? 0);
    
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
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $input) {
    error_log("🚀 بدء عملية حفظ الطلب");
    
    // التحقق من البيانات الأساسية
    if (!isset($input['customer']) || !isset($input['items']) || !isset($input['totals'])) {
        error_log("❌ بيانات الطلب غير مكتملة");
        echo json_encode(['success' => false, 'message' => 'بيانات الطلب غير مكتملة']);
        exit;
    }
    
    // التحقق من المصادقة
    $user = authenticate($pdo);
    $userId = $user ? $user['id'] : null;
    error_log("👤 معرف المستخدم: " . ($userId ?? 'زائر'));
    
    try {
        $pdo->beginTransaction();
        error_log("🔛 بدء المعاملة مع قاعدة البيانات");
        
        // إنشاء رقم طلب فريد
        $orderNumber = 'ORD-' . time() . '-' . rand(1000, 9999);
        error_log("📝 رقم الطلب: " . $orderNumber);
        
        // استخدام بيانات المستخدم إذا كان مسجلاً
        if ($user) {
            $customerName = $user['first_name'] . ' ' . $user['last_name'];
            $customerEmail = $user['email'];
            $customerPhone = $user['phone'];
        } else {
            $customer = $input['customer'];
            $customerName = $customer['firstName'] . ' ' . $customer['lastName'];
            $customerEmail = $customer['email'];
            $customerPhone = $customer['phone'];
        }
        
        // حفظ معلومات العميل والطلب
        $stmt = $pdo->prepare("
            INSERT INTO orders (
                user_id, order_number, customer_name, customer_email, customer_phone, 
                customer_address, customer_city, customer_postal_code,
                subtotal, tax, discount, total, discount_code, status, order_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
        ");
        
        $customer = $input['customer'];
        $totals = $input['totals'];
        
        $params = [
            $userId,
            $orderNumber,
            $customerName,
            $customerEmail,
            $customerPhone,
            $customer['address'],
            $customer['city'],
            $customer['postalCode'] ?? '',
            $totals['subtotal'],
            $totals['tax'],
            $totals['discount'] ?? 0,
            $totals['total'],
            $input['discountCode'] ?? null
        ];
        
        error_log("📊 بيانات الطلب للحفظ: " . json_encode($params));
        
        $stmt->execute($params);
        $orderId = $pdo->lastInsertId();
        
        error_log("✅ تم حفظ الطلب الرئيسي، المعرف: " . $orderId);
        
        // حفظ عناصر الطلب
        $itemsStmt = $pdo->prepare("
            INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, product_image)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        
        $itemsCount = 0;
        foreach ($input['items'] as $item) {
            $itemsStmt->execute([
                $orderId,
                $item['id'],
                $item['name'],
                $item['price'],
                $item['quantity'],
                $item['image'] ?? ''
            ]);
            $itemsCount++;
        }
        
        error_log("✅ تم حفظ " . $itemsCount . " عنصر في الطلب");
        
        $pdo->commit();
        error_log("🎉 تم حفظ الطلب بنجاح: " . $orderNumber);
        
        echo json_encode([
            'success' => true,
            'order_number' => $orderNumber,
            'order_id' => $orderId,
            'message' => 'تم حفظ الطلب بنجاح'
        ]);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        error_log("❌ خطأ في حفظ الطلب: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'خطأ في حفظ الطلب: ' . $e->getMessage()]);
    }
    exit;
}

// تسجيل الدخول
if (isset($_GET['action']) && $_GET['action'] === 'login') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['email']) || !isset($input['password'])) {
        echo json_encode(['success' => false, 'message' => 'بيانات غير مكتملة']);
        exit;
    }
    
    $email = $input['email'];
    $password = $input['password'];
    
    try {
        $stmt = $pdo->prepare("SELECT id, first_name, last_name, email, phone, password FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['password'])) {
            $token = generateToken($user['id']);
            
            unset($user['password']);
            
            echo json_encode([
                'success' => true,
                'user' => $user,
                'token' => $token,
                'message' => 'تم تسجيل الدخول بنجاح'
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة']);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'حدث خطأ في تسجيل الدخول: ' . $e->getMessage()]);
    }
    exit;
}

// إنشاء حساب جديد
if (isset($_GET['action']) && $_GET['action'] === 'register') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $required = ['first_name', 'last_name', 'email', 'phone', 'password'];
    foreach ($required as $field) {
        if (!isset($input[$field]) || empty($input[$field])) {
            echo json_encode(['success' => false, 'message' => 'جميع الحقول مطلوبة']);
            exit;
        }
    }
    
    $firstName = $input['first_name'];
    $lastName = $input['last_name'];
    $email = $input['email'];
    $phone = $input['phone'];
    $password = password_hash($input['password'], PASSWORD_DEFAULT);
    
    try {
        // التحقق من عدم وجود حساب بنفس البريد الإلكتروني
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        
        if ($stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني مسجل مسبقاً']);
            exit;
        }
        
        // إنشاء الحساب الجديد
        $stmt = $pdo->prepare("INSERT INTO users (first_name, last_name, email, phone, password, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
        $stmt->execute([$firstName, $lastName, $email, $phone, $password]);
        
        $userId = $pdo->lastInsertId();
        $token = generateToken($userId);
        
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $userId,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $email,
                'phone' => $phone
            ],
            'token' => $token,
            'message' => 'تم إنشاء الحساب بنجاح'
        ]);
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'حدث خطأ في إنشاء الحساب: ' . $e->getMessage()]);
    }
    exit;
}

error_log("❌ طلب غير معروف: " . $_SERVER['REQUEST_METHOD'] . " - " . json_encode($_GET));
echo json_encode(['success' => false, 'message' => 'طلب غير معروف']);
?>*/


/*
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// تمكين عرض الأخطاء (للتطوير فقط)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// بدء الجلسة
session_start();

// قاعدة بيانات وهمية (في التطبيق الحقيقي استخدم MySQL)
$users_file = 'users.json';

// تحميل المستخدمين من الملف
function loadUsers() {
    global $users_file;
    if (file_exists($users_file)) {
        $data = file_get_contents($users_file);
        return json_decode($data, true) ?: [];
    }
    return [];
}

// حفظ المستخدمين في الملف
function saveUsers($users) {
    global $users_file;
    file_put_contents($users_file, json_encode($users, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// التحقق من صحة الإيميل
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// معالجة طلبات OPTIONS (لـ CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// الحصول على البيانات المرسلة
$action = $_POST['action'] ?? $_GET['action'] ?? '';

// مصفوفة الاستجابة
$response = ['success' => false, 'message' => ''];

try {
    switch ($action) {
        case 'register':
            // تسجيل مستخدم جديد
            $fullname = trim($_POST['fullname'] ?? '');
            $email = trim($_POST['email'] ?? '');
            $password = $_POST['password'] ?? '';
            
            // التحقق من البيانات
            if (empty($fullname) || empty($email) || empty($password)) {
                $response['message'] = 'جميع الحقول مطلوبة';
                break;
            }
            
            if (!isValidEmail($email)) {
                $response['message'] = 'البريد الإلكتروني غير صحيح';
                break;
            }
            
            if (strlen($password) < 6) {
                $response['message'] = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
                break;
            }
            
            $users = loadUsers();
            
            // التحقق من عدم وجود مستخدم بنفس الإيميل
            foreach ($users as $user) {
                if ($user['email'] === $email) {
                    $response['message'] = 'هذا البريد الإلكتروني مسجل مسبقاً';
                    break 2;
                }
            }
            
            // إنشاء مستخدم جديد
            $new_user = [
                'id' => uniqid(),
                'fullname' => $fullname,
                'email' => $email,
                'password' => password_hash($password, PASSWORD_DEFAULT),
                'created_at' => date('Y-m-d H:i:s'),
                'phone' => '',
                'address' => '',
                'birth_date' => ''
            ];
            
            $users[] = $new_user;
            saveUsers($users);
            
            // تسجيل الدخول تلقائياً بعد التسجيل
            $_SESSION['user_id'] = $new_user['id'];
            $_SESSION['user_email'] = $new_user['email'];
            $_SESSION['user_name'] = $new_user['fullname'];
            
            $response['success'] = true;
            $response['message'] = 'تم إنشاء الحساب بنجاح!';
            $response['user'] = [
                'name' => $new_user['fullname'],
                'email' => $new_user['email']
            ];
            break;

        case 'login':
            // تسجيل الدخول
            $email = trim($_POST['email'] ?? '');
            $password = $_POST['password'] ?? '';
            
            if (empty($email) || empty($password)) {
                $response['message'] = 'البريد الإلكتروني وكلمة المرور مطلوبان';
                break;
            }
            
            $users = loadUsers();
            $user_found = false;
            
            foreach ($users as $user) {
                if ($user['email'] === $email) {
                    $user_found = true;
                    if (password_verify($password, $user['password'])) {
                        // تسجيل الدخول الناجح
                        $_SESSION['user_id'] = $user['id'];
                        $_SESSION['user_email'] = $user['email'];
                        $_SESSION['user_name'] = $user['fullname'];
                        
                        $response['success'] = true;
                        $response['message'] = 'تم تسجيل الدخول بنجاح!';
                        $response['user'] = [
                            'name' => $user['fullname'],
                            'email' => $user['email']
                        ];
                    } else {
                        $response['message'] = 'كلمة المرور غير صحيحة';
                    }
                    break;
                }
            }
            
            if (!$user_found) {
                $response['message'] = 'البريد الإلكتروني غير مسجل';
            }
            break;

        case 'logout':
            // تسجيل الخروج
            session_destroy();
            $response['success'] = true;
            $response['message'] = 'تم تسجيل الخروج بنجاح';
            break;

        case 'update_profile':
            // تحديث الملف الشخصي
            if (!isset($_SESSION['user_id'])) {
                $response['message'] = 'يجب تسجيل الدخول أولاً';
                break;
            }
            
            $fullname = trim($_POST['fullname'] ?? '');
            $email = trim($_POST['email'] ?? '');
            $phone = trim($_POST['phone'] ?? '');
            $address = trim($_POST['address'] ?? '');
            $birth_date = trim($_POST['birth_date'] ?? '');
            
            if (empty($fullname)) {
                $response['message'] = 'الاسم الكامل مطلوب';
                break;
            }
            
            $users = loadUsers();
            $user_updated = false;
            
            foreach ($users as &$user) {
                if ($user['id'] === $_SESSION['user_id']) {
                    $user['fullname'] = $fullname;
                    $user['phone'] = $phone;
                    $user['address'] = $address;
                    $user['birth_date'] = $birth_date;
                    $user_updated = true;
                    
                    // تحديث بيانات الجلسة
                    $_SESSION['user_name'] = $fullname;
                    break;
                }
            }
            
            if ($user_updated) {
                saveUsers($users);
                $response['success'] = true;
                $response['message'] = 'تم تحديث البيانات بنجاح!';
            } else {
                $response['message'] = 'لم يتم العثور على المستخدم';
            }
            break;

        case 'check_auth':
            // التحقق من حالة المصادقة
            if (isset($_SESSION['user_id'])) {
                $response['success'] = true;
                $response['user'] = [
                    'name' => $_SESSION['user_name'] ?? '',
                    'email' => $_SESSION['user_email'] ?? ''
                ];
            } else {
                $response['success'] = false;
            }
            break;

        default:
            $response['message'] = 'إجراء غير معروف';
            break;
    }
} catch (Exception $e) {
    $response['message'] = 'حدث خطأ في السيرفر: ' . $e->getMessage();
}

// إرجاع الاستجابة كـ JSON
echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>*/




/*
header('Content-Type: application/json');
require_once 'config.php';

$action = $_GET['action'] ?? '';

$database = new Database();
$db = $database->getConnection();

if ($action === 'register') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $full_name = $data['full_name'] ?? '';
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    $phone = $data['phone'] ?? '';
    $birth_date = $data['birth_date'] ?? '';
    $address = $data['address'] ?? '';
    
    // التحقق من البيانات
    if (empty($full_name) || empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'جميع الحقول المطلوبة يجب ملؤها']);
        exit;
    }
    
    if (strlen($password) < 6) {
        echo json_encode(['success' => false, 'message' => 'كلمة المرور يجب أن تكون 6 أحرف على الأقل']);
        exit;
    }
    
    // التحقق من البريد الإلكتروني
    $check_email = $db->prepare("SELECT id FROM users WHERE email = ?");
    $check_email->execute([$email]);
    
    if ($check_email->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني مسجل مسبقاً']);
        exit;
    }
    
    // تسجيل المستخدم
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $registration_type = 'manual';
    
    $query = "INSERT INTO users (full_name, email, password, phone, birth_date, address, registration_type) 
              VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $db->prepare($query);
    
    if ($stmt->execute([$full_name, $email, $hashed_password, $phone, $birth_date, $address, $registration_type])) {
        echo json_encode([
            'success' => true, 
            'message' => 'تم إنشاء الحساب بنجاح'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'حدث خطأ أثناء إنشاء الحساب']);
    }
}

elseif ($action === 'login') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني وكلمة المرور مطلوبان']);
        exit;
    }
    
    $query = "SELECT * FROM users WHERE email = ?";
    $stmt = $db->prepare($query);
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user && password_verify($password, $user['password'])) {
        // إزالة كلمة المرور من البيانات المرتجعة
        unset($user['password']);
        
        echo json_encode([
            'success' => true,
            'message' => 'تم تسجيل الدخول بنجاح',
            'user' => $user
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة']);
    }
}
?>*/


/*
header('Content-Type: application/json');
require_once 'config.php';

$action = $_GET['action'] ?? '';

$database = new Database();
$db = $database->getConnection();

if ($action === 'register') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $full_name = $data['full_name'] ?? '';
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    $phone = $data['phone'] ?? '';
    $birth_date = $data['birth_date'] ?? '';
    $address = $data['address'] ?? '';
    
    // التحقق من البيانات
    if (empty($full_name) || empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'جميع الحقول المطلوبة يجب ملؤها']);
        exit;
    }
    
    if (strlen($password) < 6) {
        echo json_encode(['success' => false, 'message' => 'كلمة المرور يجب أن تكون 6 أحرف على الأقل']);
        exit;
    }
    
    // التحقق من البريد الإلكتروني
    $check_email = $db->prepare("SELECT id FROM users WHERE email = ?");
    $check_email->execute([$email]);
    
    if ($check_email->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني مسجل مسبقاً']);
        exit;
    }
    
    // تسجيل المستخدم
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    $query = "INSERT INTO users (full_name, email, password, phone, birth_date, address) 
              VALUES (?, ?, ?, ?, ?, ?)";
    
    $stmt = $db->prepare($query);
    
    if ($stmt->execute([$full_name, $email, $hashed_password, $phone, $birth_date, $address])) {
        echo json_encode([
            'success' => true, 
            'message' => 'تم إنشاء الحساب بنجاح'
        ]);
    } else {
        $error = $stmt->errorInfo();
        echo json_encode([
            'success' => false, 
            'message' => 'حدث خطأ أثناء إنشاء الحساب: ' . $error[2]
        ]);
    }
}

elseif ($action === 'login') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني وكلمة المرور مطلوبان']);
        exit;
    }
    
    $query = "SELECT * FROM users WHERE email = ?";
    $stmt = $db->prepare($query);
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user && password_verify($password, $user['password'])) {
        // إزالة كلمة المرور من البيانات المرتجعة
        unset($user['password']);
        
        echo json_encode([
            'success' => true,
            'message' => 'تم تسجيل الدخول بنجاح',
            'user' => $user
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة']);
    }
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

// الحصول على بيانات JSON من الطلب
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if ($action === 'register') {
    try {
        $database = new Database();
        $db = $database->getConnection();

        if (!$db) {
            throw new Exception('Cannot connect to database');
        }

        $full_name = $data['full_name'] ?? '';
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        $phone = $data['phone'] ?? '';
        $birth_date = $data['birth_date'] ?? '';
        $address = $data['address'] ?? '';
        
        // التحقق من البيانات
        if (empty($full_name) || empty($email) || empty($password)) {
            echo json_encode([
                'success' => false, 
                'message' => 'جميع الحقول المطلوبة يجب ملؤها'
            ]);
            exit;
        }
        
        if (strlen($password) < 6) {
            echo json_encode([
                'success' => false, 
                'message' => 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
            ]);
            exit;
        }
        
        // التحقق من البريد الإلكتروني
        $check_email = $db->prepare("SELECT id FROM users WHERE email = ?");
        $check_email->execute([$email]);
        
        if ($check_email->rowCount() > 0) {
            echo json_encode([
                'success' => false, 
                'message' => 'البريد الإلكتروني مسجل مسبقاً'
            ]);
            exit;
        }
        
        // تسجيل المستخدم
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        $query = "INSERT INTO users (full_name, email, password, phone, birth_date, address) 
                  VALUES (?, ?, ?, ?, ?, ?)";
        
        $stmt = $db->prepare($query);
        
        if ($stmt->execute([$full_name, $email, $hashed_password, $phone, $birth_date, $address])) {
            echo json_encode([
                'success' => true, 
                'message' => 'تم إنشاء الحساب بنجاح'
            ]);
        } else {
            throw new Exception('Failed to execute query');
        }
        
    } catch (Exception $e) {
        error_log("Register error: " . $e->getMessage());
        echo json_encode([
            'success' => false, 
            'message' => 'حدث خطأ في الخادم: ' . $e->getMessage()
        ]);
    }
}

elseif ($action === 'login') {
    try {
        $database = new Database();
        $db = $database->getConnection();

        if (!$db) {
            throw new Exception('Cannot connect to database');
        }

        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        
        if (empty($email) || empty($password)) {
            echo json_encode([
                'success' => false, 
                'message' => 'البريد الإلكتروني وكلمة المرور مطلوبان'
            ]);
            exit;
        }
        
        $query = "SELECT * FROM users WHERE email = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['password'])) {
            // إزالة كلمة المرور من البيانات المرتجعة
            unset($user['password']);
            
            echo json_encode([
                'success' => true,
                'message' => 'تم تسجيل الدخول بنجاح',
                'user' => $user
            ]);
        } else {
            echo json_encode([
                'success' => false, 
                'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            ]);
        }
        
    } catch (Exception $e) {
        error_log("Login error: " . $e->getMessage());
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
// ملف auth.php
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

// الحصول على بيانات JSON من الطلب
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if ($action === 'test') {
    // اختبار الاتصال بقاعدة البيانات
    try {
        $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        echo json_encode([
            'success' => true,
            'message' => 'الاتصال بقاعدة البيانات ناجح'
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'message' => 'فشل الاتصال بقاعدة البيانات'
        ]);
    }
    exit;
}

if ($action === 'register') {
    try {
        // الاتصال بقاعدة البيانات
        $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $full_name = $data['full_name'] ?? '';
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        $phone = $data['phone'] ?? '';
        $birth_date = $data['birth_date'] ?? '';
        $address = $data['address'] ?? '';
        
        // التحقق من البيانات
        if (empty($full_name) || empty($email) || empty($password)) {
            echo json_encode([
                'success' => false, 
                'message' => 'جميع الحقول المطلوبة يجب ملؤها'
            ]);
            exit;
        }
        
        if (strlen($password) < 6) {
            echo json_encode([
                'success' => false, 
                'message' => 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
            ]);
            exit;
        }
        
        // التحقق من البريد الإلكتروني
        $check_email = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $check_email->execute([$email]);
        
        if ($check_email->rowCount() > 0) {
            echo json_encode([
                'success' => false, 
                'message' => 'البريد الإلكتروني مسجل مسبقاً'
            ]);
            exit;
        }
        
        // تسجيل المستخدم
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        $query = "INSERT INTO users (full_name, email, password, phone, birth_date, address) 
                  VALUES (?, ?, ?, ?, ?, ?)";
        
        $stmt = $conn->prepare($query);
        
        if ($stmt->execute([$full_name, $email, $hashed_password, $phone, $birth_date, $address])) {
            echo json_encode([
                'success' => true, 
                'message' => 'تم إنشاء الحساب بنجاح'
            ]);
        } else {
            throw new Exception('فشل في تنفيذ الاستعلام');
        }
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false, 
            'message' => 'حدث خطأ في الخادم'
        ]);
    }
}

elseif ($action === 'login') {
    try {
        // الاتصال بقاعدة البيانات
        $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        
        if (empty($email) || empty($password)) {
            echo json_encode([
                'success' => false, 
                'message' => 'البريد الإلكتروني وكلمة المرور مطلوبان'
            ]);
            exit;
        }
        
        $query = "SELECT * FROM users WHERE email = ?";
        $stmt = $conn->prepare($query);
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['password'])) {
            // إزالة كلمة المرور من البيانات المرتجعة
            unset($user['password']);
            
            echo json_encode([
                'success' => true,
                'message' => 'تم تسجيل الدخول بنجاح',
                'user' => $user
            ]);
        } else {
            echo json_encode([
                'success' => false, 
                'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            ]);
        }
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false, 
            'message' => 'حدث خطأ في الخادم'
        ]);
    }
} else {
    echo json_encode([
        'success' => false, 
        'message' => 'عملية غير معروفة'
    ]);
}
?>*/

















































/*header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

class AuthSystem {
    private $db;
    
    public function __construct() {
        $this->initDatabase();
    }
    
    private function initDatabase() {
        $host = 'localhost';
        $dbname = 'perfume_store';
        $username = 'root';
        $password = '';
        
        try {
            $this->db = new PDO(
                "mysql:host=$host;dbname=$dbname;charset=utf8mb4", 
                $username, 
                $password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
        } catch (PDOException $e) {
            $this->sendResponse(['success' => false, 'message' => 'Database connection failed'], 500);
        }
    }
    
    public function handleRequest() {
        $action = $_GET['action'] ?? '';
        
        switch ($action) {
            case 'register':
                $this->register();
                break;
            case 'login':
                $this->login();
                break;
            case 'test':
                $this->testConnection();
                break;
            case 'create_order':
                $this->createOrder();
                break;
            case 'get_orders':
                $this->getOrders();
                break;
            case 'get_order':
                $this->getOrder();
                break;
            case 'apply_discount':
                $this->applyDiscount();
                break;
            case 'get_user_stats':
                $this->getUserStats();
                break;
            case 'update_profile':
                $this->updateProfile();
                break;
            default:
                $this->sendResponse(['success' => false, 'message' => 'Action not found'], 404);
        }
    }
    
    private function register() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $required = ['full_name', 'email', 'password'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                $this->sendResponse(['success' => false, 'message' => "Field $field is required"]);
            }
        }
        
        // التحقق من البريد الإلكتروني
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $this->sendResponse(['success' => false, 'message' => 'Invalid email format']);
        }
        
        // التحقق من كلمة المرور
        if (strlen($data['password']) < 6) {
            $this->sendResponse(['success' => false, 'message' => 'Password must be at least 6 characters']);
        }
        
        // التحقق من عدم وجود البريد مسبقاً
        $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$data['email']]);
        if ($stmt->fetch()) {
            $this->sendResponse(['success' => false, 'message' => 'Email already registered']);
        }
        
        // إنشاء المستخدم
        $stmt = $this->db->prepare("
            INSERT INTO users (full_name, email, password_hash, phone, birth_date, address, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        ");
        
        $password_hash = password_hash($data['password'], PASSWORD_DEFAULT);
        
        try {
            $stmt->execute([
                $data['full_name'],
                $data['email'],
                $password_hash,
                $data['phone'] ?? '',
                $data['birth_date'] ?? null,
                $data['address'] ?? ''
            ]);
            
            $user_id = $this->db->lastInsertId();
            
            $this->sendResponse([
                'success' => true,
                'message' => 'Registration successful',
                'user' => [
                    'id' => $user_id,
                    'full_name' => $data['full_name'],
                    'email' => $data['email'],
                    'phone' => $data['phone'] ?? '',
                    'birth_date' => $data['birth_date'] ?? '',
                    'address' => $data['address'] ?? ''
                ]
            ]);
            
        } catch (PDOException $e) {
            $this->sendResponse(['success' => false, 'message' => 'Registration failed: ' . $e->getMessage()]);
        }
    }
    
    private function login() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (empty($data['email']) || empty($data['password'])) {
            $this->sendResponse(['success' => false, 'message' => 'Email and password are required']);
        }
        
        $stmt = $this->db->prepare("
            SELECT id, full_name, email, password_hash, phone, birth_date, address, 
                   loyalty_points, total_orders, total_spent, created_at
            FROM users 
            WHERE email = ?
        ");
        $stmt->execute([$data['email']]);
        $user = $stmt->fetch();
        
        if (!$user || !password_verify($data['password'], $user['password_hash'])) {
            $this->sendResponse(['success' => false, 'message' => 'Invalid email or password']);
        }
        
        // إزالة كلمة المرور من البيانات المرجعة
        unset($user['password_hash']);
        
        $this->sendResponse([
            'success' => true,
            'message' => 'Login successful',
            'user' => $user
        ]);
    }
    
    private function createOrder() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        // التحقق من البيانات
        if (empty($data['user_id']) || empty($data['items']) || empty($data['customer'])) {
            $this->sendResponse(['success' => false, 'message' => 'Missing required data']);
        }
        
        $this->db->beginTransaction();
        
        try {
            // إنشاء رقم طلب فريد
            $order_number = 'ORD-' . date('YmdHis') . '-' . mt_rand(1000, 9999);
            
            // حساب المجموع
            $subtotal = 0;
            foreach ($data['items'] as $item) {
                $subtotal += $item['price'] * $item['quantity'];
            }
            
            // تطبيق الخصم إذا وجد
            $discount_amount = 0;
            $discount_code = null;
            
            if (!empty($data['discount_code'])) {
                $discount_result = $this->validateDiscount($data['discount_code'], $subtotal, $data['user_id']);
                if ($discount_result['success']) {
                    $discount_amount = $discount_result['discount_amount'];
                    $discount_code = $data['discount_code'];
                }
            }
            
            // حساب الضريبة والمجموع النهائي
            $tax_rate = 15.00; // 15%
            $tax_amount = ($subtotal - $discount_amount) * ($tax_rate / 100);
            $shipping_amount = $this->calculateShipping($subtotal);
            $total_amount = $subtotal + $tax_amount + $shipping_amount - $discount_amount;
            
            // إنشاء الطلب
            $order_stmt = $this->db->prepare("
                INSERT INTO orders (
                    order_number, user_id, customer_email, customer_phone, customer_name,
                    shipping_address, shipping_city, shipping_postal_code,
                    subtotal, tax_amount, discount_amount, shipping_amount, total_amount,
                    payment_method, discount_code, tax_rate
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            
            $order_stmt->execute([
                $order_number,
                $data['user_id'],
                $data['customer']['email'],
                $data['customer']['phone'],
                trim($data['customer']['firstName'] . ' ' . $data['customer']['lastName']),
                $data['customer']['address'],
                $data['customer']['city'],
                $data['customer']['postalCode'] ?? '',
                $subtotal,
                $tax_amount,
                $discount_amount,
                $shipping_amount,
                $total_amount,
                $data['payment']['method'],
                $discount_code,
                $tax_rate
            ]);
            
            $order_id = $this->db->lastInsertId();
            
            // إضافة عناصر الطلب
            foreach ($data['items'] as $item) {
                $item_stmt = $this->db->prepare("
                    INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, total_price, product_image)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ");
                
                $item_stmt->execute([
                    $order_id,
                    $item['id'],
                    $item['name'],
                    $item['price'],
                    $item['quantity'],
                    $item['price'] * $item['quantity'],
                    $item['image'] ?? ''
                ]);
            }
            
            // تحديث إحصائيات المستخدم
            $user_stmt = $this->db->prepare("
                UPDATE users 
                SET total_orders = total_orders + 1, 
                    total_spent = total_spent + ?,
                    last_order_date = NOW(),
                    loyalty_points = loyalty_points + FLOOR(? / 10)
                WHERE id = ?
            ");
            $user_stmt->execute([$total_amount, $total_amount, $data['user_id']]);
            
            $this->db->commit();
            
            $this->sendResponse([
                'success' => true,
                'message' => 'Order created successfully',
                'order_number' => $order_number,
                'order_id' => $order_id,
                'total_amount' => $total_amount
            ]);
            
        } catch (Exception $e) {
            $this->db->rollBack();
            $this->sendResponse(['success' => false, 'message' => 'Order creation failed: ' . $e->getMessage()]);
        }
    }
    
    private function validateDiscount($code, $subtotal, $user_id) {
        $stmt = $this->db->prepare("
            SELECT * FROM discounts 
            WHERE code = ? AND is_active = 1 
            AND (valid_from IS NULL OR valid_from <= NOW())
            AND (valid_to IS NULL OR valid_to >= NOW())
            AND (usage_limit IS NULL OR used_count < usage_limit)
        ");
        $stmt->execute([$code]);
        $discount = $stmt->fetch();
        
        if (!$discount) {
            return ['success' => false, 'message' => 'Invalid or expired discount code'];
        }
        
        // التحقق من الحد الأدنى للطلب
        if ($discount['min_order_amount'] && $subtotal < $discount['min_order_amount']) {
            return ['success' => false, 'message' => 'Minimum order amount not reached'];
        }
        
        // حساب قيمة الخصم
        $discount_amount = 0;
        if ($discount['discount_type'] === 'percentage') {
            $discount_amount = $subtotal * ($discount['discount_value'] / 100);
            if ($discount['max_discount_amount']) {
                $discount_amount = min($discount_amount, $discount['max_discount_amount']);
            }
        } else {
            $discount_amount = $discount['discount_value'];
        }
        
        // تحديث عدد مرات الاستخدام
        $update_stmt = $this->db->prepare("
            UPDATE discounts SET used_count = used_count + 1 WHERE id = ?
        ");
        $update_stmt->execute([$discount['id']]);
        
        return [
            'success' => true,
            'discount_amount' => $discount_amount,
            'discount_name' => $discount['name']
        ];
    }
    
    private function calculateShipping($subtotal) {
        // شحن مجاني للطلبات فوق 300 ريال
        return $subtotal >= 300 ? 0 : 25;
    }
    
    private function getOrders() {
        $user_id = $_GET['user_id'] ?? null;
        
        if (!$user_id) {
            $this->sendResponse(['success' => false, 'message' => 'User ID is required']);
        }
        
        $page = $_GET['page'] ?? 1;
        $limit = $_GET['limit'] ?? 10;
        $offset = ($page - 1) * $limit;
        
        // الحصول على إجمالي عدد الطلبات
        $count_stmt = $this->db->prepare("SELECT COUNT(*) as total FROM orders WHERE user_id = ?");
        $count_stmt->execute([$user_id]);
        $total = $count_stmt->fetch()['total'];
        
        // الحصول على الطلبات
        $stmt = $this->db->prepare("
            SELECT o.*, 
                   (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) as items_count,
                   (SELECT SUM(oi.quantity) FROM order_items oi WHERE oi.order_id = o.id) as total_quantity
            FROM orders o 
            WHERE o.user_id = ? 
            ORDER BY o.created_at DESC 
            LIMIT ? OFFSET ?
        ");
        $stmt->execute([$user_id, $limit, $offset]);
        $orders = $stmt->fetchAll();
        
        $this->sendResponse([
            'success' => true,
            'orders' => $orders,
            'pagination' => [
                'current_page' => (int)$page,
                'total_pages' => ceil($total / $limit),
                'total_orders' => (int)$total
            ]
        ]);
    }
    
    private function getOrder() {
        $order_id = $_GET['order_id'] ?? null;
        $user_id = $_GET['user_id'] ?? null;
        
        if (!$order_id || !$user_id) {
            $this->sendResponse(['success' => false, 'message' => 'Order ID and User ID are required']);
        }
        
        // الحصول على بيانات الطلب
        $order_stmt = $this->db->prepare("
            SELECT * FROM orders 
            WHERE id = ? AND user_id = ?
        ");
        $order_stmt->execute([$order_id, $user_id]);
        $order = $order_stmt->fetch();
        
        if (!$order) {
            $this->sendResponse(['success' => false, 'message' => 'Order not found']);
        }
        
        // الحصول على عناصر الطلب
        $items_stmt = $this->db->prepare("
            SELECT * FROM order_items 
            WHERE order_id = ?
        ");
        $items_stmt->execute([$order_id]);
        $items = $items_stmt->fetchAll();
        
        $order['items'] = $items;
        
        $this->sendResponse([
            'success' => true,
            'order' => $order
        ]);
    }
    
    private function applyDiscount() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $code = $data['code'] ?? '';
        $subtotal = $data['subtotal'] ?? 0;
        $user_id = $data['user_id'] ?? null;
        
        if (empty($code)) {
            $this->sendResponse(['success' => false, 'message' => 'Discount code is required']);
        }
        
        $result = $this->validateDiscount($code, $subtotal, $user_id);
        
        if ($result['success']) {
            $this->sendResponse([
                'success' => true,
                'discount_amount' => $result['discount_amount'],
                'discount_name' => $result['discount_name'],
                'message' => 'Discount applied successfully'
            ]);
        } else {
            $this->sendResponse([
                'success' => false,
                'message' => $result['message']
            ]);
        }
    }
    
    private function getUserStats() {
        $user_id = $_GET['user_id'] ?? null;
        
        if (!$user_id) {
            $this->sendResponse(['success' => false, 'message' => 'User ID is required']);
        }
        
        // إحصائيات المستخدم
        $user_stmt = $this->db->prepare("
            SELECT total_orders, total_spent, loyalty_points 
            FROM users 
            WHERE id = ?
        ");
        $user_stmt->execute([$user_id]);
        $user_stats = $user_stmt->fetch();
        
        // عدد الطلبات لكل حالة
        $status_stmt = $this->db->prepare("
            SELECT order_status, COUNT(*) as count 
            FROM orders 
            WHERE user_id = ? 
            GROUP BY order_status
        ");
        $status_stmt->execute([$user_id]);
        $status_counts = $status_stmt->fetchAll();
        
        $this->sendResponse([
            'success' => true,
            'data' => [
                'orders_count' => $user_stats['total_orders'] ?? 0,
                'total_spent' => $user_stats['total_spent'] ?? 0,
                'loyalty_points' => $user_stats['loyalty_points'] ?? 0,
                'status_counts' => $status_counts
            ]
        ]);
    }
    
    private function updateProfile() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (empty($data['user_id'])) {
            $this->sendResponse(['success' => false, 'message' => 'User ID is required']);
        }
        
        $allowed_fields = ['full_name', 'phone', 'birth_date', 'address'];
        $update_fields = [];
        $update_values = [];
        
        foreach ($allowed_fields as $field) {
            if (isset($data[$field])) {
                $update_fields[] = "$field = ?";
                $update_values[] = $data[$field];
            }
        }
        
        if (empty($update_fields)) {
            $this->sendResponse(['success' => false, 'message' => 'No fields to update']);
        }
        
        $update_values[] = $data['user_id'];
        
        $stmt = $this->db->prepare("
            UPDATE users 
            SET " . implode(', ', $update_fields) . ", updated_at = NOW()
            WHERE id = ?
        ");
        
        try {
            $stmt->execute($update_values);
            
            // الحصول على بيانات المستخدم المحدثة
            $user_stmt = $this->db->prepare("
                SELECT id, full_name, email, phone, birth_date, address, 
                       loyalty_points, total_orders, total_spent, created_at
                FROM users 
                WHERE id = ?
            ");
            $user_stmt->execute([$data['user_id']]);
            $user = $user_stmt->fetch();
            
            $this->sendResponse([
                'success' => true,
                'message' => 'Profile updated successfully',
                'user' => $user
            ]);
            
        } catch (PDOException $e) {
            $this->sendResponse(['success' => false, 'message' => 'Profile update failed: ' . $e->getMessage()]);
        }
    }
    
    private function testConnection() {
        try {
            $stmt = $this->db->query("SELECT 1");
            $this->sendResponse(['success' => true, 'message' => 'Database connection successful']);
        } catch (PDOException $e) {
            $this->sendResponse(['success' => false, 'message' => 'Database connection failed']);
        }
    }
    
    private function sendResponse($data, $status_code = 200) {
        http_response_code($status_code);
        echo json_encode($data);
        exit;
    }
}

// تشغيل النظام
$authSystem = new AuthSystem();
$authSystem->handleRequest();
?>*/







































/*// auth.php - نسخة معدلة للعمل من سطر الأوامر وخادم الويب
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// فئة Database
class Database {
    private $host = 'localhost';
    private $db_name = 'perfume_store';
    private $username = 'root';
    private $password = '';
    private $conn;

    public function connect() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
                ]
            );
        } catch(PDOException $e) {
            error_log("Connection error: " . $e->getMessage());
            return null;
        }

        return $this->conn;
    }
}

class AuthSystem {
    private $conn;
    private $table_users = 'users';
    private $table_orders = 'orders';
    private $table_order_items = 'order_items';
    private $table_discounts = 'discount_codes';

    public function __construct() {
        $database = new Database();
        $this->conn = $database->connect();
    }

    // اختبار الاتصال
    public function testConnection() {
        if (!$this->conn) {
            return ['success' => false, 'message' => 'فشل الاتصال بقاعدة البيانات'];
        }
        
        try {
            $stmt = $this->conn->query("SELECT 1");
            return ['success' => true, 'message' => 'الاتصال بقاعدة البيانات ناجح'];
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'فشل الاتصال بقاعدة البيانات: ' . $e->getMessage()];
        }
    }

    // تسجيل مستخدم جديد
    public function register($data) {
        if (!$this->conn) {
            return ['success' => false, 'message' => 'فشل الاتصال بقاعدة البيانات'];
        }

        try {
            // التحقق من البيانات المطلوبة
            if (empty($data['full_name']) || empty($data['email']) || empty($data['password'])) {
                return ['success' => false, 'message' => 'جميع الحقول المطلوبة يجب ملؤها'];
            }

            // التحقق من صحة البريد الإلكتروني
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                return ['success' => false, 'message' => 'البريد الإلكتروني غير صحيح'];
            }

            // التحقق من وجود البريد الإلكتروني
            $check_query = "SELECT id FROM " . $this->table_users . " WHERE email = :email";
            $check_stmt = $this->conn->prepare($check_query);
            $check_stmt->bindParam(':email', $data['email']);
            $check_stmt->execute();

            if ($check_stmt->rowCount() > 0) {
                return ['success' => false, 'message' => 'البريد الإلكتروني مسجل مسبقاً'];
            }

            // إنشاء المستخدم الجديد
            $query = "INSERT INTO " . $this->table_users . " 
                     (full_name, email, password, phone, birth_date, address) 
                     VALUES (:full_name, :email, :password, :phone, :birth_date, :address)";

            $stmt = $this->conn->prepare($query);

            // هاش كلمة المرور
            $password_hash = password_hash($data['password'], PASSWORD_DEFAULT);

            $stmt->bindParam(':full_name', $data['full_name']);
            $stmt->bindParam(':email', $data['email']);
            $stmt->bindParam(':password', $password_hash);
            $stmt->bindParam(':phone', $data['phone'] ?? '');
            $stmt->bindParam(':birth_date', $data['birth_date'] ?? '');
            $stmt->bindParam(':address', $data['address'] ?? '');

            if ($stmt->execute()) {
                $user_id = $this->conn->lastInsertId();
                
                // جلب بيانات المستخدم المسجل
                $user_query = "SELECT id, full_name, email, phone, birth_date, address, loyalty_points, total_orders, total_spent, created_at 
                              FROM " . $this->table_users . " WHERE id = :id";
                $user_stmt = $this->conn->prepare($user_query);
                $user_stmt->bindParam(':id', $user_id);
                $user_stmt->execute();
                $user = $user_stmt->fetch(PDO::FETCH_ASSOC);

                return [
                    'success' => true,
                    'message' => 'تم إنشاء الحساب بنجاح',
                    'user' => $user
                ];
            }

            return ['success' => false, 'message' => 'فشل في إنشاء الحساب'];

        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'خطأ في النظام: ' . $e->getMessage()];
        }
    }

    // تسجيل الدخول
    public function login($data) {
        if (!$this->conn) {
            return ['success' => false, 'message' => 'فشل الاتصال بقاعدة البيانات'];
        }

        try {
            $query = "SELECT id, full_name, email, password, phone, birth_date, address, 
                             loyalty_points, total_orders, total_spent, created_at 
                      FROM " . $this->table_users . " 
                      WHERE email = :email";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':email', $data['email']);
            $stmt->execute();

            if ($stmt->rowCount() == 1) {
                $user = $stmt->fetch(PDO::FETCH_ASSOC);

                // التحقق من كلمة المرور
                if (password_verify($data['password'], $user['password'])) {
                    // إزالة كلمة المرور من البيانات المرجعة
                    unset($user['password']);

                    return [
                        'success' => true,
                        'message' => 'تم تسجيل الدخول بنجاح',
                        'user' => $user
                    ];
                }
            }

            return ['success' => false, 'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة'];

        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'خطأ في النظام: ' . $e->getMessage()];
        }
    }

    // تحديث الملف الشخصي
    public function updateProfile($data) {
        if (!$this->conn) {
            return ['success' => false, 'message' => 'فشل الاتصال بقاعدة البيانات'];
        }

        try {
            $query = "UPDATE " . $this->table_users . " 
                     SET full_name = :full_name, phone = :phone, 
                         birth_date = :birth_date, address = :address,
                         updated_at = CURRENT_TIMESTAMP
                     WHERE id = :user_id";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':full_name', $data['full_name']);
            $stmt->bindParam(':phone', $data['phone'] ?? '');
            $stmt->bindParam(':birth_date', $data['birth_date'] ?? '');
            $stmt->bindParam(':address', $data['address'] ?? '');
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

                return [
                    'success' => true,
                    'message' => 'تم تحديث البيانات بنجاح',
                    'user' => $user
                ];
            }

            return ['success' => false, 'message' => 'فشل في تحديث البيانات'];

        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'خطأ في النظام: ' . $e->getMessage()];
        }
    }

    // جلب إحصائيات المستخدم
    public function getUserStats($user_id) {
        if (!$this->conn) {
            return ['success' => false, 'message' => 'فشل الاتصال بقاعدة البيانات'];
        }

        try {
            // عدد الطلبات
            $orders_query = "SELECT COUNT(*) as orders_count FROM " . $this->table_orders . " WHERE user_id = :user_id";
            $orders_stmt = $this->conn->prepare($orders_query);
            $orders_stmt->bindParam(':user_id', $user_id);
            $orders_stmt->execute();
            $orders_count = $orders_stmt->fetch(PDO::FETCH_ASSOC)['orders_count'];

            // نقاط المكافآت
            $points_query = "SELECT loyalty_points FROM " . $this->table_users . " WHERE id = :user_id";
            $points_stmt = $this->conn->prepare($points_query);
            $points_stmt->bindParam(':user_id', $user_id);
            $points_stmt->execute();
            $loyalty_points = $points_stmt->fetch(PDO::FETCH_ASSOC)['loyalty_points'];

            return [
                'success' => true,
                'data' => [
                    'orders_count' => (int)$orders_count,
                    'loyalty_points' => (int)$loyalty_points
                ]
            ];

        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'خطأ في جلب البيانات: ' . $e->getMessage()];
        }
    }

    // جلب الطلبات
    public function getOrders($user_id) {
        if (!$this->conn) {
            return ['success' => false, 'message' => 'فشل الاتصال بقاعدة البيانات'];
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

            return [
                'success' => true,
                'orders' => $orders
            ];

        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'خطأ في جلب الطلبات: ' . $e->getMessage()];
        }
    }

    // تطبيق كود الخصم
    public function applyDiscount($data) {
        if (!$this->conn) {
            return ['success' => false, 'message' => 'فشل الاتصال بقاعدة البيانات'];
        }

        try {
            $query = "SELECT * FROM " . $this->table_discounts . " 
                      WHERE code = :code 
                      AND is_active = 1 
                      AND valid_from <= CURDATE() 
                      AND valid_until >= CURDATE()
                      AND (usage_limit IS NULL OR used_count < usage_limit)";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':code', $data['code']);
            $stmt->execute();

            if ($stmt->rowCount() == 1) {
                $discount = $stmt->fetch(PDO::FETCH_ASSOC);

                // التحقق من الحد الأدنى للطلب
                if ($data['subtotal'] >= $discount['min_order_amount']) {
                    $discount_amount = 0;

                    if ($discount['discount_type'] == 'percentage') {
                        $discount_amount = $data['subtotal'] * ($discount['discount_value'] / 100);
                        // التحقق من الحد الأقصى للخصم
                        if ($discount['max_discount_amount'] && $discount_amount > $discount['max_discount_amount']) {
                            $discount_amount = $discount['max_discount_amount'];
                        }
                    } else {
                        $discount_amount = $discount['discount_value'];
                    }

                    // تحديث عدد مرات الاستخدام
                    $update_query = "UPDATE " . $this->table_discounts . " 
                                    SET used_count = used_count + 1 
                                    WHERE id = :id";
                    $update_stmt = $this->conn->prepare($update_query);
                    $update_stmt->bindParam(':id', $discount['id']);
                    $update_stmt->execute();

                    return [
                        'success' => true,
                        'discount_amount' => $discount_amount,
                        'message' => 'تم تطبيق الخصم بنجاح'
                    ];
                } else {
                    return [
                        'success' => false,
                        'message' => 'الحد الأدنى للطلب غير محقق. يجب أن يكون الطلب ' . $discount['min_order_amount'] . ' ريال على الأقل'
                    ];
                }
            }

            return ['success' => false, 'message' => 'كود الخصم غير صالح أو منتهي الصلاحية'];

        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'خطأ في تطبيق الخصم: ' . $e->getMessage()];
        }
    }

    // إنشاء طلب جديد
    public function createOrder($data) {
        if (!$this->conn) {
            return ['success' => false, 'message' => 'فشل الاتصال بقاعدة البيانات'];
        }

        try {
            $this->conn->beginTransaction();

            // إنشاء رقم الطلب
            $order_number = 'ORD-' . date('YmdHis') . '-' . mt_rand(1000, 9999);

            // إنشاء الطلب
            $order_query = "INSERT INTO " . $this->table_orders . " 
                           (order_number, user_id, customer_name, customer_email, customer_phone, 
                            customer_address, customer_city, customer_postal_code, subtotal, 
                            tax_amount, discount_amount, shipping_amount, total_amount, discount_code) 
                           VALUES (:order_number, :user_id, :customer_name, :customer_email, :customer_phone,
                                   :customer_address, :customer_city, :customer_postal_code, :subtotal,
                                   :tax_amount, :discount_amount, :shipping_amount, :total_amount, :discount_code)";

            $order_stmt = $this->conn->prepare($order_query);
            
            $customer_name = $data['customer']['firstName'] . ' ' . $data['customer']['lastName'];
            
            $order_stmt->bindParam(':order_number', $order_number);
            $order_stmt->bindParam(':user_id', $data['user_id']);
            $order_stmt->bindParam(':customer_name', $customer_name);
            $order_stmt->bindParam(':customer_email', $data['customer']['email']);
            $order_stmt->bindParam(':customer_phone', $data['customer']['phone']);
            $order_stmt->bindParam(':customer_address', $data['customer']['address']);
            $order_stmt->bindParam(':customer_city', $data['customer']['city']);
            $order_stmt->bindParam(':customer_postal_code', $data['customer']['postalCode'] ?? '');
            $order_stmt->bindParam(':subtotal', $data['totals']['subtotal']);
            $order_stmt->bindParam(':tax_amount', $data['totals']['tax']);
            $order_stmt->bindParam(':discount_amount', $data['totals']['discount']);
            $order_stmt->bindParam(':shipping_amount', $data['totals']['shipping']);
            $order_stmt->bindParam(':total_amount', $data['totals']['total']);
            $order_stmt->bindParam(':discount_code', $data['discount_code'] ?? null);

            if (!$order_stmt->execute()) {
                throw new Exception('فشل في إنشاء الطلب');
            }

            $order_id = $this->conn->lastInsertId();

            // إضافة عناصر الطلب
            foreach ($data['items'] as $item) {
                $item_query = "INSERT INTO " . $this->table_order_items . " 
                              (order_id, product_id, product_name, product_price, quantity, total_price) 
                              VALUES (:order_id, :product_id, :product_name, :product_price, :quantity, :total_price)";

                $item_stmt = $this->conn->prepare($item_query);
                $total_price = $item['price'] * $item['quantity'];

                $item_stmt->bindParam(':order_id', $order_id);
                $item_stmt->bindParam(':product_id', $item['id']);
                $item_stmt->bindParam(':product_name', $item['name']);
                $item_stmt->bindParam(':product_price', $item['price']);
                $item_stmt->bindParam(':quantity', $item['quantity']);
                $item_stmt->bindParam(':total_price', $total_price);

                if (!$item_stmt->execute()) {
                    throw new Exception('فشل في إضافة عناصر الطلب');
                }
            }

            // تحديث إحصائيات المستخدم
            $user_update_query = "UPDATE " . $this->table_users . " 
                                SET total_orders = total_orders + 1, 
                                    total_spent = total_spent + :total_amount,
                                    loyalty_points = loyalty_points + FLOOR(:total_amount / 10)
                                WHERE id = :user_id";

            $user_stmt = $this->conn->prepare($user_update_query);
            $user_stmt->bindParam(':total_amount', $data['totals']['total']);
            $user_stmt->bindParam(':user_id', $data['user_id']);
            $user_stmt->execute();

            $this->conn->commit();

            return [
                'success' => true,
                'order_number' => $order_number,
                'order_id' => $order_id,
                'message' => 'تم إنشاء الطلب بنجاح'
            ];

        } catch (Exception $e) {
            $this->conn->rollBack();
            return ['success' => false, 'message' => 'خطأ في إنشاء الطلب: ' . $e->getMessage()];
        }
    }
}

// دالة لمعرفة إذا كان التشغيل من سطر الأوامر
function isCli() {
    return php_sapi_name() === 'cli' || defined('STDIN');
}

// معالجة الطلبات
if (isCli()) {
    // التشغيل من سطر الأوامر
    $options = getopt("a:", ["action:"]);
    $action = $options['a'] ?? $options['action'] ?? 'test';
    
    $auth = new AuthSystem();
    
    switch ($action) {
        case 'test':
            $result = $auth->testConnection();
            break;
        case 'create-db':
            $result = createDatabase();
            break;
        default:
            $result = ['success' => false, 'message' => 'الإجراء غير معروف'];
    }
    
    echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
} else {
    // التشغيل من خادم ويب
    $requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    
    if ($requestMethod === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $auth = new AuthSystem();

        $action = $_GET['action'] ?? '';

        switch ($action) {
            case 'test':
                echo json_encode($auth->testConnection());
                break;
            case 'register':
                echo json_encode($auth->register($input));
                break;
            case 'login':
                echo json_encode($auth->login($input));
                break;
            case 'update_profile':
                echo json_encode($auth->updateProfile($input));
                break;
            case 'get_user_stats':
                echo json_encode($auth->getUserStats($input['user_id']));
                break;
            case 'get_orders':
                echo json_encode($auth->getOrders($input['user_id']));
                break;
            case 'apply_discount':
                echo json_encode($auth->applyDiscount($input));
                break;
            case 'create_order':
                echo json_encode($auth->createOrder($input));
                break;
            default:
                echo json_encode(['success' => false, 'message' => 'الإجراء غير معروف']);
        }
    } else if ($requestMethod === 'GET') {
        $auth = new AuthSystem();
        $action = $_GET['action'] ?? '';

        switch ($action) {
            case 'test':
                echo json_encode($auth->testConnection());
                break;
            case 'get_orders':
                $user_id = $_GET['user_id'] ?? '';
                echo json_encode($auth->getOrders($user_id));
                break;
            default:
                echo json_encode(['success' => false, 'message' => 'الإجراء غير معروف']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'طريقة الطلب غير مسموحة']);
    }
}

// دالة مساعدة لإنشاء قاعدة البيانات
function createDatabase() {
    try {
        $db = new PDO("mysql:host=localhost", "root", "");
        $db->exec("CREATE DATABASE IF NOT EXISTS perfume_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        return ['success' => true, 'message' => 'تم إنشاء قاعدة البيانات بنجاح'];
    } catch (PDOException $e) {
        return ['success' => false, 'message' => 'فشل في إنشاء قاعدة البيانات: ' . $e->getMessage()];
    }
}
?>*/




/*require_once 'config.php';

header('Content-Type: application/json; charset=utf-8');

// إنشاء قاعدة البيانات والجداول إذا لم تكن موجودة
createDatabase();

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    echo json_encode(['success' => false, 'message' => 'خطأ في الاتصال بقاعدة البيانات']);
    exit;
}

$action = $_GET['action'] ?? '';

// تسجيل الدخول
if ($action === 'login') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    // إذا فشل تحويل JSON، جرب الحصول من POST
    if ($data === null) {
        $data = $_POST;
    }
    
    error_log("بيانات التسجيل: " . print_r($data, true));
    
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'جميع الحقول مطلوبة']);
        exit;
    }
    
    try {
        $query = "SELECT * FROM users WHERE email = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if ($user) {
            // إذا كانت كلمة المرور غير مشفرة (في حالة البيانات القديمة)
            if ($user['password'] === $password) {
                // كلمة المرور مطابقة بدون تشفير
                unset($user['password']);
                echo json_encode([
                    'success' => true,
                    'message' => 'تم تسجيل الدخول بنجاح',
                    'user' => $user
                ]);
            } 
            // إذا كانت كلمة المرور مشفرة
            else if (password_verify($password, $user['password'])) {
                unset($user['password']);
                echo json_encode([
                    'success' => true,
                    'message' => 'تم تسجيل الدخول بنجاح',
                    'user' => $user
                ]);
            } else {
                echo json_encode([
                    'success' => false, 
                    'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
                ]);
            }
        } else {
            echo json_encode([
                'success' => false, 
                'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            ]);
        }
    } catch (Exception $e) {
        error_log("خطأ في تسجيل الدخول: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => 'خطأ في الخادم: ' . $e->getMessage()
        ]);
    }
    exit;
}

// إنشاء حساب جديد
if ($action === 'register') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    // إذا فشل تحويل JSON، جرب الحصول من POST
    if ($data === null) {
        $data = $_POST;
    }
    
    error_log("بيانات التسجيل: " . print_r($data, true));
    
    $full_name = $data['full_name'] ?? '';
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    $confirm_password = $data['confirm_password'] ?? '';
    $phone = $data['phone'] ?? '';
    $birth_date = $data['birth_date'] ?? '';
    $address = $data['address'] ?? '';
    
    if (empty($full_name) || empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'جميع الحقول المطلوبة يجب ملؤها']);
        exit;
    }
    
    if ($password !== $confirm_password) {
        echo json_encode(['success' => false, 'message' => 'كلمات المرور غير متطابقة']);
        exit;
    }
    
    if (strlen($password) < 6) {
        echo json_encode(['success' => false, 'message' => 'كلمة المرور يجب أن تكون 6 أحرف على الأقل']);
        exit;
    }
    
    try {
        // التحقق من وجود البريد الإلكتروني مسبقاً
        $check_query = "SELECT id FROM users WHERE email = ?";
        $check_stmt = $db->prepare($check_query);
        $check_stmt->execute([$email]);
        
        if ($check_stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني مسجل مسبقاً']);
            exit;
        }
        
        // إنشاء المستخدم الجديد (بدون تشفير كلمة المرور أولاً للتجربة)
        $hashed_password = $password; // استخدم كلمة المرور كما هي أولاً
        
        $query = "INSERT INTO users (full_name, email, password, phone, birth_date, address) 
                  VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $db->prepare($query);
        
        if ($stmt->execute([$full_name, $email, $hashed_password, $phone, $birth_date, $address])) {
            $user_id = $db->lastInsertId();
            
            // جلب بيانات المستخدم الجديد بدون كلمة المرور
            $user_query = "SELECT id, full_name, email, phone, birth_date, address, total_orders, total_spent, created_at 
                          FROM users WHERE id = ?";
            $user_stmt = $db->prepare($user_query);
            $user_stmt->execute([$user_id]);
            $new_user = $user_stmt->fetch();
            
            error_log("تم إنشاء مستخدم جديد: " . print_r($new_user, true));
            
            echo json_encode([
                'success' => true,
                'message' => 'تم إنشاء الحساب بنجاح',
                'user' => $new_user
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'فشل في إنشاء الحساب']);
        }
    } catch (Exception $e) {
        error_log("خطأ في التسجيل: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => 'خطأ في الخادم: ' . $e->getMessage()
        ]);
    }
    exit;
}

// تحديث الملف الشخصي
if ($action === 'update_profile') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if ($data === null) {
        $data = $_POST;
    }
    
    $user_id = $data['user_id'] ?? '';
    $full_name = $data['full_name'] ?? '';
    $phone = $data['phone'] ?? '';
    $birth_date = $data['birth_date'] ?? '';
    $address = $data['address'] ?? '';
    
    if (empty($user_id) || empty($full_name)) {
        echo json_encode(['success' => false, 'message' => 'بيانات غير مكتملة']);
        exit;
    }
    
    try {
        $query = "UPDATE users SET full_name = ?, phone = ?, birth_date = ?, address = ?, updated_at = NOW() WHERE id = ?";
        $stmt = $db->prepare($query);
        
        if ($stmt->execute([$full_name, $phone, $birth_date, $address, $user_id])) {
            // جلب البيانات المحدثة
            $user_query = "SELECT id, full_name, email, phone, birth_date, address, total_orders, total_spent, created_at 
                          FROM users WHERE id = ?";
            $user_stmt = $db->prepare($user_query);
            $user_stmt->execute([$user_id]);
            $updated_user = $user_stmt->fetch();
            
            echo json_encode([
                'success' => true,
                'message' => 'تم تحديث البيانات بنجاح',
                'user' => $updated_user
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'فشل في تحديث البيانات']);
        }
    } catch (Exception $e) {
        error_log("خطأ في تحديث الملف: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => 'خطأ في الخادم: ' . $e->getMessage()
        ]);
    }
    exit;
}

// اختبار الاتصال
if ($action === 'test') {
    try {
        // التحقق من الاتصال والجداول
        $tables = $db->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
        $users_count = $db->query("SELECT COUNT(*) as count FROM users")->fetch()['count'];
        $products_count = $db->query("SELECT COUNT(*) as count FROM products")->fetch()['count'];
        
        echo json_encode([
            'success' => true, 
            'message' => '✅ الخادم يعمل بشكل صحيح',
            'data' => [
                'tables' => $tables,
                'users_count' => $users_count,
                'products_count' => $products_count
            ]
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => '❌ خطأ في الخادم: ' . $e->getMessage()
        ]);
    }
    exit;
}

// جلب إحصائيات المستخدم
if ($action === 'get_user_stats') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if ($data === null) {
        $data = $_POST;
    }
    
    $user_id = $data['user_id'] ?? '';
    
    if (empty($user_id)) {
        echo json_encode(['success' => false, 'message' => 'معرف المستخدم مطلوب']);
        exit;
    }
    
    try {
        $orders_query = "SELECT COUNT(*) as orders_count FROM orders WHERE user_id = ?";
        $orders_stmt = $db->prepare($orders_query);
        $orders_stmt->execute([$user_id]);
        $orders_count = $orders_stmt->fetch()['orders_count'];
        
        echo json_encode([
            'success' => true,
            'data' => [
                'orders_count' => $orders_count
            ]
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'خطأ في جلب الإحصائيات: ' . $e->getMessage()
        ]);
    }
    exit;
}

// إنشاء طلب جديد
if ($action === 'create_order') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if ($data === null) {
        $data = $_POST;
    }
    
    try {
        $db->beginTransaction();
        
        $order_query = "INSERT INTO orders (order_number, user_id, subtotal, tax, shipping, total, shipping_address) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)";
        $order_stmt = $db->prepare($order_query);
        
        $order_number = 'ORD-' . time() . '-' . rand(1000, 9999);
        $shipping_address = $data['user_address'] ?? '';
        
        $order_stmt->execute([
            $order_number,
            $data['user_id'],
            $data['subtotal'],
            $data['tax'],
            $data['shipping'],
            $data['total'],
            $shipping_address
        ]);
        
        $order_id = $db->lastInsertId();
        
        // إدخال عناصر الطلب
        $items_query = "INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, total_price) 
                       VALUES (?, ?, ?, ?, ?, ?)";
        $items_stmt = $db->prepare($items_query);
        
        foreach ($data['items'] as $item) {
            $items_stmt->execute([
                $order_id,
                $item['id'],
                $item['name'],
                $item['price'],
                $item['quantity'],
                $item['price'] * $item['quantity']
            ]);
        }
        
        // تحديث إحصائيات المستخدم
        $user_query = "UPDATE users SET total_orders = total_orders + 1, total_spent = total_spent + ? WHERE id = ?";
        $user_stmt = $db->prepare($user_query);
        $user_stmt->execute([$data['total'], $data['user_id']]);
        
        $db->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'تم إنشاء الطلب بنجاح',
            'order_number' => $order_number
        ]);
        
    } catch (Exception $e) {
        $db->rollBack();
        error_log("خطأ في إنشاء الطلب: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => 'خطأ في إنشاء الطلب: ' . $e->getMessage()
        ]);
    }
    exit;
}

echo json_encode(['success' => false, 'message' => 'إجراء غير معروف']);
?>*/







/*
// إجبار النظام على استخدام قاعدة البيانات
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
$_SESSION['force_database'] = true;

require_once 'config.php';

header('Content-Type: application/json; charset=utf-8');

// السماح بـ CORS إذا لزم الأمر
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// التعامل مع طلبات OPTIONS
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// الحصول على action من GET أو POST
$action = $_GET['action'] ?? '';

// إذا كان الطلب مباشراً (مثل Code Runner)، استخدم test كإجراء افتراضي
if (empty($action) && php_sapi_name() === 'cli') {
    $action = 'test';
}

if (empty($action)) {
    $input = file_get_contents('php://input');
    if (!empty($input)) {
        $data = json_decode($input, true);
        $action = $data['action'] ?? '';
    }
}

// إذا لم يتم تحديد action، عرض رسالة مفيدة
if (empty($action)) {
    echo json_encode([
        'success' => false, 
        'message' => 'لم يتم تحديد الإجراء (action)',
        'available_actions' => [
            'test', 'register', 'login', 'update_profile', 
            'create_order', 'get_user_stats', 'get_products', 'insert_user'
        ],
        'usage_example' => 'auth.php?action=test',
        'note' => 'يجب فتح الملف عبر خادم ويب: http://localhost/Seccond-HASH-LECTURE/auth.php?action=test'
    ]);
    exit;
}

// إنشاء قاعدة البيانات والجداول
if (!createDatabase()) {
    echo json_encode(['success' => false, 'message' => 'فشل في إنشاء قاعدة البيانات']);
    exit;
}

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    echo json_encode(['success' => false, 'message' => 'فشل في الاتصال بقاعدة البيانات']);
    exit;
}

// اختبار الاتصال
if ($action === 'test') {
    try {
        // التحقق من الجداول
        $tables = $db->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
        $users_count = $db->query("SELECT COUNT(*) as count FROM users")->fetch()['count'];
        $products_count = $db->query("SELECT COUNT(*) as count FROM products")->fetch()['count'];
        
        echo json_encode([
            'success' => true, 
            'message' => '✅ الخادم يعمل بشكل صحيح',
            'data' => [
                'tables' => $tables,
                'users_count' => $users_count,
                'products_count' => $products_count,
                'database' => 'perfume_shop'
            ]
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => '❌ خطأ في الخادم: ' . $e->getMessage()
        ]);
    }
    exit;
}

// تسجيل الدخول
if ($action === 'login') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if ($data === null) {
        $data = $_POST;
    }
    
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'جميع الحقول مطلوبة']);
        exit;
    }
    
    try {
        $query = "SELECT * FROM users WHERE email = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if ($user) {
            // التحقق من كلمة المرور (بدون تشفير أولاً)
            if ($user['password'] === $password) {
                // إزالة كلمة المرور من البيانات المرجعة
                unset($user['password']);
                
                echo json_encode([
                    'success' => true,
                    'message' => 'تم تسجيل الدخول بنجاح',
                    'user' => $user
                ]);
            } else {
                echo json_encode([
                    'success' => false, 
                    'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
                ]);
            }
        } else {
            echo json_encode([
                'success' => false, 
                'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            ]);
        }
    } catch (Exception $e) {
        error_log("خطأ في تسجيل الدخول: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => 'خطأ في الخادم: ' . $e->getMessage()
        ]);
    }
    exit;
}

// إنشاء حساب جديد
if ($action === 'register') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if ($data === null) {
        $data = $_POST;
    }
    
    $full_name = $data['full_name'] ?? '';
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    $confirm_password = $data['confirm_password'] ?? '';
    $phone = $data['phone'] ?? '';
    $birth_date = $data['birth_date'] ?? '';
    $address = $data['address'] ?? '';
    
    if (empty($full_name) || empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'جميع الحقول المطلوبة يجب ملؤها']);
        exit;
    }
    
    if ($password !== $confirm_password) {
        echo json_encode(['success' => false, 'message' => 'كلمات المرور غير متطابقة']);
        exit;
    }
    
    if (strlen($password) < 6) {
        echo json_encode(['success' => false, 'message' => 'كلمة المرور يجب أن تكون 6 أحرف على الأقل']);
        exit;
    }
    
    try {
        // التحقق من وجود البريد الإلكتروني مسبقاً
        $check_query = "SELECT id FROM users WHERE email = ?";
        $check_stmt = $db->prepare($check_query);
        $check_stmt->execute([$email]);
        
        if ($check_stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني مسجل مسبقاً']);
            exit;
        }
        
        // إنشاء المستخدم الجديد (بدون تشفير كلمة المرور)
        $query = "INSERT INTO users (full_name, email, password, phone, birth_date, address) 
                  VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $db->prepare($query);
        
        if ($stmt->execute([$full_name, $email, $password, $phone, $birth_date, $address])) {
            $user_id = $db->lastInsertId();
            
            // جلب بيانات المستخدم الجديد بدون كلمة المرور
            $user_query = "SELECT id, full_name, email, phone, birth_date, address, total_orders, total_spent, created_at 
                          FROM users WHERE id = ?";
            $user_stmt = $db->prepare($user_query);
            $user_stmt->execute([$user_id]);
            $new_user = $user_stmt->fetch();
            
            echo json_encode([
                'success' => true,
                'message' => 'تم إنشاء الحساب بنجاح',
                'user' => $new_user
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'فشل في إنشاء الحساب']);
        }
    } catch (Exception $e) {
        error_log("خطأ في التسجيل: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => 'خطأ في الخادم: ' . $e->getMessage()
        ]);
    }
    exit;
}

// تحديث الملف الشخصي
if ($action === 'update_profile') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if ($data === null) {
        $data = $_POST;
    }
    
    $user_id = $data['user_id'] ?? '';
    $full_name = $data['full_name'] ?? '';
    $phone = $data['phone'] ?? '';
    $birth_date = $data['birth_date'] ?? '';
    $address = $data['address'] ?? '';
    
    if (empty($user_id) || empty($full_name)) {
        echo json_encode(['success' => false, 'message' => 'بيانات غير مكتملة']);
        exit;
    }
    
    try {
        $query = "UPDATE users SET full_name = ?, phone = ?, birth_date = ?, address = ? WHERE id = ?";
        $stmt = $db->prepare($query);
        
        if ($stmt->execute([$full_name, $phone, $birth_date, $address, $user_id])) {
            // جلب البيانات المحدثة
            $user_query = "SELECT id, full_name, email, phone, birth_date, address, total_orders, total_spent, created_at 
                          FROM users WHERE id = ?";
            $user_stmt = $db->prepare($user_query);
            $user_stmt->execute([$user_id]);
            $updated_user = $user_stmt->fetch();
            
            echo json_encode([
                'success' => true,
                'message' => 'تم تحديث البيانات بنجاح',
                'user' => $updated_user
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'فشل في تحديث البيانات']);
        }
    } catch (Exception $e) {
        error_log("خطأ في تحديث الملف: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => 'خطأ في الخادم: ' . $e->getMessage()
        ]);
    }
    exit;
}

// إنشاء طلب جديد
if ($action === 'create_order') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if ($data === null) {
        $data = $_POST;
    }
    
    try {
        $db->beginTransaction();
        
        // إدخال الطلب
        $order_query = "INSERT INTO orders (order_number, user_id, subtotal, tax, shipping, total, shipping_address) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)";
        $order_stmt = $db->prepare($order_query);
        
        $order_number = 'ORD-' . time() . '-' . rand(1000, 9999);
        $shipping_address = $data['user_address'] ?? '';
        
        $order_stmt->execute([
            $order_number,
            $data['user_id'],
            $data['subtotal'],
            $data['tax'],
            $data['shipping'],
            $data['total'],
            $shipping_address
        ]);
        
        $order_id = $db->lastInsertId();
        
        // إدخال عناصر الطلب
        $items_query = "INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, total_price) 
                       VALUES (?, ?, ?, ?, ?, ?)";
        $items_stmt = $db->prepare($items_query);
        
        foreach ($data['items'] as $item) {
            $items_stmt->execute([
                $order_id,
                $item['id'],
                $item['name'],
                $item['price'],
                $item['quantity'],
                $item['price'] * $item['quantity']
            ]);
        }
        
        // تحديث إحصائيات المستخدم
        $user_query = "UPDATE users SET total_orders = total_orders + 1, total_spent = total_spent + ? WHERE id = ?";
        $user_stmt = $db->prepare($user_query);
        $user_stmt->execute([$data['total'], $data['user_id']]);
        
        $db->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'تم إنشاء الطلب بنجاح',
            'order_number' => $order_number
        ]);
        
    } catch (Exception $e) {
        $db->rollBack();
        error_log("خطأ في إنشاء الطلب: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => 'خطأ في إنشاء الطلب: ' . $e->getMessage()
        ]);
    }
    exit;
}

// جلب إحصائيات المستخدم
if ($action === 'get_user_stats') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if ($data === null) {
        $data = $_POST;
    }
    
    $user_id = $data['user_id'] ?? '';
    
    if (empty($user_id)) {
        echo json_encode(['success' => false, 'message' => 'معرف المستخدم مطلوب']);
        exit;
    }
    
    try {
        $orders_query = "SELECT COUNT(*) as orders_count FROM orders WHERE user_id = ?";
        $orders_stmt = $db->prepare($orders_query);
        $orders_stmt->execute([$user_id]);
        $orders_count = $orders_stmt->fetch()['orders_count'];
        
        echo json_encode([
            'success' => true,
            'data' => [
                'orders_count' => $orders_count
            ]
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'خطأ في جلب الإحصائيات: ' . $e->getMessage()
        ]);
    }
    exit;
}

// جلب المنتجات
if ($action === 'get_products') {
    try {
        $query = "SELECT * FROM products WHERE is_active = TRUE ORDER BY created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $products = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'products' => $products
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'خطأ في جلب المنتجات: ' . $e->getMessage()
        ]);
    }
    exit;
}

// إدخال مستخدم مباشر (للتجربة)
if ($action === 'insert_user') {
    try {
        // التحقق إذا كان أحمد موجود مسبقاً
        $check_sql = "SELECT id FROM users WHERE email = 'ahmed@example.com'";
        $check_stmt = $db->prepare($check_sql);
        $check_stmt->execute();
        
        if ($check_stmt->fetch()) {
            echo json_encode([
                'success' => false,
                'message' => 'المستخدم أحمد موجود مسبقاً'
            ]);
            exit;
        }
        
        $sql = "INSERT INTO users (full_name, email, password, phone, birth_date, address) 
                VALUES ('أحمد محمد', 'ahmed@example.com', '123456', '+966500000001', '1990-05-15', 'الرياض - حي الملز')";
        
        $db->exec($sql);
        
        echo json_encode([
            'success' => true,
            'message' => '✅ تم إدخال أحمد بنجاح في قاعدة البيانات',
            'user_id' => $db->lastInsertId()
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => '❌ خطأ: ' . $e->getMessage()
        ]);
    }
    exit;
}

// جلب جميع المستخدمين (للتطوير فقط)
if ($action === 'get_users') {
    try {
        $query = "SELECT id, full_name, email, phone, created_at FROM users ORDER BY created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $users = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'users' => $users
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'خطأ في جلب المستخدمين: ' . $e->getMessage()
        ]);
    }
    exit;
}

// حذف مستخدم (للتطوير فقط)
if ($action === 'delete_user') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    $email = $data['email'] ?? '';
    
    if (empty($email)) {
        echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني مطلوب']);
        exit;
    }
    
    try {
        $query = "DELETE FROM users WHERE email = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$email]);
        
        echo json_encode([
            'success' => true,
            'message' => 'تم حذف المستخدم بنجاح'
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'خطأ في حذف المستخدم: ' . $e->getMessage()
        ]);
    }
    exit;
}

// إذا وصلنا إلى هنا، الإجراء غير معروف
echo json_encode([
    'success' => false, 
    'message' => 'إجراء غير معروف: ' . $action,
    'available_actions' => [
        'test', 'register', 'login', 'update_profile', 'create_order', 
        'get_user_stats', 'get_products', 'insert_user', 'get_users', 'delete_user'
    ]
]);

// جلب جميع الطلبات
if ($action === 'get_orders') {
    try {
        $query = "SELECT * FROM orders ORDER BY created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $orders = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'orders' => $orders,
            'count' => count($orders)
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'خطأ في جلب الطلبات: ' . $e->getMessage()
        ]);
    }
    exit;
}

// جلب عناصر الطلبات
if ($action === 'get_order_items') {
    try {
        $query = "SELECT * FROM order_items ORDER BY created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $order_items = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'order_items' => $order_items,
            'count' => count($order_items)
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'خطأ في جلب عناصر الطلبات: ' . $e->getMessage()
        ]);
    }
    exit;
}

// مسح البيانات التجريبية
if ($action === 'clear_test_data') {
    try {
        $db->beginTransaction();
        
        // حذف عناصر الطلبات أولاً
        $db->exec("DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE order_number LIKE 'TEST-%')");
        
        // ثم حذف الطلبات
        $db->exec("DELETE FROM orders WHERE order_number LIKE 'TEST-%'");
        
        $db->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'تم مسح البيانات التجريبية بنجاح'
        ]);
        
    } catch (Exception $e) {
        $db->rollBack();
        echo json_encode([
            'success' => false,
            'message' => 'خطأ في مسح البيانات: ' . $e->getMessage()
        ]);
    }
    exit;
}


?>*/








// إجبار النظام على استخدام قاعدة البيانات
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
$_SESSION['force_database'] = true;

require_once 'config.php';

header('Content-Type: application/json; charset=utf-8');

// السماح بـ CORS إذا لزم الأمر
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// التعامل مع طلبات OPTIONS - التحقق من وجود REQUEST_METHOD أولاً
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// الحصول على action من GET أو POST
$action = $_GET['action'] ?? '';

// إذا كان الطلب مباشراً (مثل Code Runner)، استخدم test كإجراء افتراضي
if (empty($action) && php_sapi_name() === 'cli') {
    $action = 'test';
}

if (empty($action)) {
    $input = file_get_contents('php://input');
    if (!empty($input)) {
        $data = json_decode($input, true);
        $action = $data['action'] ?? '';
    }
}

// إذا لم يتم تحديد action، عرض رسالة مفيدة
if (empty($action)) {
    echo json_encode([
        'success' => false, 
        'message' => 'لم يتم تحديد الإجراء (action)',
        'available_actions' => [
            'test', 'register', 'login', 'update_profile', 
            'create_order', 'get_user_stats', 'get_products', 'insert_user'
        ],
        'usage_example' => 'auth.php?action=test',
        'note' => 'يجب فتح الملف عبر خادم ويب: http://localhost/your-project/auth.php?action=test'
    ]);
    exit;
}

// إنشاء قاعدة البيانات والجداول
if (!createDatabase()) {
    echo json_encode(['success' => false, 'message' => 'فشل في إنشاء قاعدة البيانات']);
    exit;
}

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    echo json_encode(['success' => false, 'message' => 'فشل في الاتصال بقاعدة البيانات']);
    exit;
}

// دالة مساعدة للتحقق من البيانات المدخلة
function validateInput($data, $requiredFields = []) {
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            return "حقل {$field} مطلوب";
        }
    }
    return null;
}

// دالة مساعدة للتحقق من البريد الإلكتروني
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// اختبار الاتصال
if ($action === 'test') {
    try {
        // التحقق من الجداول
        $tables = $db->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
        $users_count = $db->query("SELECT COUNT(*) as count FROM users")->fetch()['count'];
        $products_count = $db->query("SELECT COUNT(*) as count FROM products")->fetch()['count'];
        $orders_count = $db->query("SELECT COUNT(*) as count FROM orders")->fetch()['count'];
        
        echo json_encode([
            'success' => true, 
            'message' => '✅ الخادم يعمل بشكل صحيح',
            'data' => [
                'tables' => $tables,
                'users_count' => $users_count,
                'products_count' => $products_count,
                'orders_count' => $orders_count,
                'database' => 'perfume_shop',
                'password_hashing' => '✅ مشغل (password_hash)',
                'environment' => php_sapi_name() === 'cli' ? 'CLI' : 'Web',
                'timestamp' => date('Y-m-d H:i:s')
            ]
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => '❌ خطأ في الخادم: ' . $e->getMessage()
        ]);
    }
    exit;
}

// تسجيل الدخول
if ($action === 'login') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if ($data === null) {
        $data = $_POST;
    }
    
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    
    // التحقق من البيانات المدخلة
    $validationError = validateInput($data, ['email', 'password']);
    if ($validationError) {
        echo json_encode(['success' => false, 'message' => $validationError]);
        exit;
    }
    
    if (!validateEmail($email)) {
        echo json_encode(['success' => false, 'message' => 'صيغة البريد الإلكتروني غير صحيحة']);
        exit;
    }
    
    try {
        $query = "SELECT * FROM users WHERE email = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user) {
            // التحقق من كلمة المرور باستخدام password_verify
            if (password_verify($password, $user['password'])) {
                // تحديث وقت آخر دخول
                $update_query = "UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?";
                $update_stmt = $db->prepare($update_query);
                $update_stmt->execute([$user['id']]);
                
                // إزالة كلمة المرور من البيانات المرجعة
                unset($user['password']);
                
                echo json_encode([
                    'success' => true,
                    'message' => 'تم تسجيل الدخول بنجاح',
                    'user' => $user
                ]);
            } else {
                echo json_encode([
                    'success' => false, 
                    'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
                ]);
            }
        } else {
            echo json_encode([
                'success' => false, 
                'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            ]);
        }
    } catch (Exception $e) {
        error_log("خطأ في تسجيل الدخول: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => 'خطأ في الخادم: ' . $e->getMessage()
        ]);
    }
    exit;
}

// إنشاء حساب جديد
if ($action === 'register') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if ($data === null) {
        $data = $_POST;
    }
    
    $full_name = trim($data['full_name'] ?? '');
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    $confirm_password = $data['confirm_password'] ?? '';
    $phone = trim($data['phone'] ?? '');
    $birth_date = $data['birth_date'] ?? '';
    $address = trim($data['address'] ?? '');
    
    // التحقق من البيانات المدخلة
    $validationError = validateInput($data, ['full_name', 'email', 'password', 'confirm_password']);
    if ($validationError) {
        echo json_encode(['success' => false, 'message' => $validationError]);
        exit;
    }
    
    if (!validateEmail($email)) {
        echo json_encode(['success' => false, 'message' => 'صيغة البريد الإلكتروني غير صحيحة']);
        exit;
    }
    
    if ($password !== $confirm_password) {
        echo json_encode(['success' => false, 'message' => 'كلمات المرور غير متطابقة']);
        exit;
    }
    
    if (strlen($password) < 6) {
        echo json_encode(['success' => false, 'message' => 'كلمة المرور يجب أن تكون 6 أحرف على الأقل']);
        exit;
    }
    
    try {
        // التحقق من وجود البريد الإلكتروني مسبقاً
        $check_query = "SELECT id FROM users WHERE email = ?";
        $check_stmt = $db->prepare($check_query);
        $check_stmt->execute([$email]);
        
        if ($check_stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني مسجل مسبقاً']);
            exit;
        }
        
        // تشفير كلمة المرور قبل حفظها
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        // إنشاء المستخدم الجديد بكلمة مرور مشفرة
        $query = "INSERT INTO users (full_name, email, password, phone, birth_date, address) 
                  VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $db->prepare($query);
        
        if ($stmt->execute([$full_name, $email, $hashed_password, $phone, $birth_date, $address])) {
            $user_id = $db->lastInsertId();
            
            // جلب بيانات المستخدم الجديد بدون كلمة المرور
            $user_query = "SELECT id, full_name, email, phone, birth_date, address, total_orders, total_spent, created_at 
                          FROM users WHERE id = ?";
            $user_stmt = $db->prepare($user_query);
            $user_stmt->execute([$user_id]);
            $new_user = $user_stmt->fetch(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true,
                'message' => 'تم إنشاء الحساب بنجاح',
                'user' => $new_user
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'فشل في إنشاء الحساب']);
        }
    } catch (Exception $e) {
        error_log("خطأ في التسجيل: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => 'خطأ في الخادم: ' . $e->getMessage()
        ]);
    }
    exit;
}

// تحديث الملف الشخصي
if ($action === 'update_profile') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if ($data === null) {
        $data = $_POST;
    }
    
    $user_id = $data['user_id'] ?? '';
    $full_name = trim($data['full_name'] ?? '');
    $phone = trim($data['phone'] ?? '');
    $birth_date = $data['birth_date'] ?? '';
    $address = trim($data['address'] ?? '');
    $current_password = $data['current_password'] ?? '';
    $new_password = $data['new_password'] ?? '';
    
    if (empty($user_id) || empty($full_name)) {
        echo json_encode(['success' => false, 'message' => 'بيانات غير مكتملة']);
        exit;
    }
    
    try {
        // إذا أراد المستخدم تغيير كلمة المرور
        if (!empty($new_password)) {
            if (empty($current_password)) {
                echo json_encode(['success' => false, 'message' => 'كلمة المرور الحالية مطلوبة لتغيير كلمة المرور']);
                exit;
            }
            
            // التحقق من كلمة المرور الحالية
            $check_query = "SELECT password FROM users WHERE id = ?";
            $check_stmt = $db->prepare($check_query);
            $check_stmt->execute([$user_id]);
            $user = $check_stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$user || !password_verify($current_password, $user['password'])) {
                echo json_encode(['success' => false, 'message' => 'كلمة المرور الحالية غير صحيحة']);
                exit;
            }
            
            if (strlen($new_password) < 6) {
                echo json_encode(['success' => false, 'message' => 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل']);
                exit;
            }
            
            // تحديث البيانات مع كلمة المرور الجديدة
            $hashed_new_password = password_hash($new_password, PASSWORD_DEFAULT);
            $query = "UPDATE users SET full_name = ?, phone = ?, birth_date = ?, address = ?, password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
            $stmt = $db->prepare($query);
            $result = $stmt->execute([$full_name, $phone, $birth_date, $address, $hashed_new_password, $user_id]);
        } else {
            // تحديث البيانات بدون تغيير كلمة المرور
            $query = "UPDATE users SET full_name = ?, phone = ?, birth_date = ?, address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
            $stmt = $db->prepare($query);
            $result = $stmt->execute([$full_name, $phone, $birth_date, $address, $user_id]);
        }
        
        if ($result) {
            // جلب البيانات المحدثة
            $user_query = "SELECT id, full_name, email, phone, birth_date, address, total_orders, total_spent, created_at 
                          FROM users WHERE id = ?";
            $user_stmt = $db->prepare($user_query);
            $user_stmt->execute([$user_id]);
            $updated_user = $user_stmt->fetch(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true,
                'message' => !empty($new_password) ? 'تم تحديث البيانات وكلمة المرور بنجاح' : 'تم تحديث البيانات بنجاح',
                'user' => $updated_user
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'فشل في تحديث البيانات']);
        }
    } catch (Exception $e) {
        error_log("خطأ في تحديث الملف: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => 'خطأ في الخادم: ' . $e->getMessage()
        ]);
    }
    exit;
}

// إنشاء طلب جديد
if ($action === 'create_order') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if ($data === null) {
        $data = $_POST;
    }
    
    try {
        $db->beginTransaction();
        
        // التحقق من البيانات المطلوبة
        $required_fields = ['user_id', 'subtotal', 'tax', 'shipping', 'total', 'user_address', 'items'];
        foreach ($required_fields as $field) {
            if (!isset($data[$field])) {
                throw new Exception("حقل {$field} مطلوب");
            }
        }
        
        if (!is_array($data['items']) || empty($data['items'])) {
            throw new Exception("لا توجد عناصر في الطلب");
        }
        
        // إدخال الطلب
        $order_query = "INSERT INTO orders (order_number, user_id, subtotal, tax, shipping, total, shipping_address, payment_method, status) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')";
        $order_stmt = $db->prepare($order_query);
        
        $order_number = 'ORD-' . time() . '-' . rand(1000, 9999);
        $shipping_address = $data['user_address'] ?? '';
        $payment_method = $data['payment_method'] ?? 'credit_card';
        
        $order_stmt->execute([
            $order_number,
            $data['user_id'],
            $data['subtotal'],
            $data['tax'],
            $data['shipping'],
            $data['total'],
            $shipping_address,
            $payment_method
        ]);
        
        $order_id = $db->lastInsertId();
        
        // إدخال عناصر الطلب
        $items_query = "INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, total_price) 
                       VALUES (?, ?, ?, ?, ?, ?)";
        $items_stmt = $db->prepare($items_query);
        
        foreach ($data['items'] as $item) {
            $items_stmt->execute([
                $order_id,
                $item['id'] ?? null,
                $item['name'],
                $item['price'],
                $item['quantity'],
                $item['price'] * $item['quantity']
            ]);
        }
        
        // تحديث إحصائيات المستخدم
        $user_query = "UPDATE users SET total_orders = total_orders + 1, total_spent = total_spent + ? WHERE id = ?";
        $user_stmt = $db->prepare($user_query);
        $user_stmt->execute([$data['total'], $data['user_id']]);
        
        $db->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'تم إنشاء الطلب بنجاح',
            'order_number' => $order_number,
            'order_id' => $order_id
        ]);
        
    } catch (Exception $e) {
        $db->rollBack();
        error_log("خطأ في إنشاء الطلب: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => 'خطأ في إنشاء الطلب: ' . $e->getMessage()
        ]);
    }
    exit;
}

// جلب إحصائيات المستخدم
if ($action === 'get_user_stats') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if ($data === null) {
        $data = $_POST;
    }
    
    $user_id = $data['user_id'] ?? '';
    
    if (empty($user_id)) {
        echo json_encode(['success' => false, 'message' => 'معرف المستخدم مطلوب']);
        exit;
    }
    
    try {
        $user_query = "SELECT total_orders, total_spent FROM users WHERE id = ?";
        $user_stmt = $db->prepare($user_query);
        $user_stmt->execute([$user_id]);
        $user_stats = $user_stmt->fetch(PDO::FETCH_ASSOC);
        
        $orders_query = "SELECT COUNT(*) as orders_count FROM orders WHERE user_id = ?";
        $orders_stmt = $db->prepare($orders_query);
        $orders_stmt->execute([$user_id]);
        $orders_count = $orders_stmt->fetch()['orders_count'];
        
        echo json_encode([
            'success' => true,
            'data' => [
                'orders_count' => $orders_count,
                'total_orders' => $user_stats['total_orders'] ?? 0,
                'total_spent' => $user_stats['total_spent'] ?? 0
            ]
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'خطأ في جلب الإحصائيات: ' . $e->getMessage()
        ]);
    }
    exit;
}

// جلب المنتجات
if ($action === 'get_products') {
    try {
        $query = "SELECT * FROM products WHERE is_active = TRUE ORDER BY created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'products' => $products,
            'count' => count($products)
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'خطأ في جلب المنتجات: ' . $e->getMessage()
        ]);
    }
    exit;
}

// إدخال مستخدم مباشر (للتجربة) - مع تشفير كلمة المرور
if ($action === 'insert_user') {
    try {
        // التحقق إذا كان أحمد موجود مسبقاً
        $check_sql = "SELECT id FROM users WHERE email = 'ahmed@example.com'";
        $check_stmt = $db->prepare($check_sql);
        $check_stmt->execute();
        
        if ($check_stmt->fetch()) {
            echo json_encode([
                'success' => false,
                'message' => 'المستخدم أحمد موجود مسبقاً'
            ]);
            exit;
        }
        
        // تشفير كلمة المرور
        $hashed_password = password_hash('123456', PASSWORD_DEFAULT);
        
        $sql = "INSERT INTO users (full_name, email, password, phone, birth_date, address) 
                VALUES ('أحمد محمد', 'ahmed@example.com', ?, '+966500000001', '1990-05-15', 'الرياض - حي الملز')";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([$hashed_password]);
        
        echo json_encode([
            'success' => true,
            'message' => '✅ تم إدخال أحمد بنجاح في قاعدة البيانات',
            'user_id' => $db->lastInsertId(),
            'note' => 'كلمة المرور مشفرة: 123456'
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => '❌ خطأ: ' . $e->getMessage()
        ]);
    }
    exit;
}

// جلب جميع المستخدمين (للتطوير فقط)
if ($action === 'get_users') {
    try {
        $query = "SELECT id, full_name, email, phone, total_orders, total_spent, created_at FROM users ORDER BY created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'users' => $users,
            'count' => count($users)
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'خطأ في جلب المستخدمين: ' . $e->getMessage()
        ]);
    }
    exit;
}

// جلب طلبات مستخدم معين
if ($action === 'get_user_orders') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    $user_id = $data['user_id'] ?? $_GET['user_id'] ?? '';
    
    if (empty($user_id)) {
        echo json_encode(['success' => false, 'message' => 'معرف المستخدم مطلوب']);
        exit;
    }
    
    try {
        $query = "SELECT o.*, 
                         (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) as items_count
                  FROM orders o 
                  WHERE o.user_id = ? 
                  ORDER BY o.created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute([$user_id]);
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'orders' => $orders,
            'count' => count($orders)
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'خطأ في جلب الطلبات: ' . $e->getMessage()
        ]);
    }
    exit;
}

// جلب تفاصيل طلب معين
if ($action === 'get_order_details') {
    $order_id = $_GET['order_id'] ?? '';
    
    if (empty($order_id)) {
        echo json_encode(['success' => false, 'message' => 'معرف الطلب مطلوب']);
        exit;
    }
    
    try {
        // جلب بيانات الطلب
        $order_query = "SELECT o.*, u.full_name, u.email, u.phone 
                       FROM orders o 
                       LEFT JOIN users u ON o.user_id = u.id 
                       WHERE o.id = ?";
        $order_stmt = $db->prepare($order_query);
        $order_stmt->execute([$order_id]);
        $order = $order_stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$order) {
            echo json_encode(['success' => false, 'message' => 'الطلب غير موجود']);
            exit;
        }
        
        // جلب عناصر الطلب
        $items_query = "SELECT * FROM order_items WHERE order_id = ?";
        $items_stmt = $db->prepare($items_query);
        $items_stmt->execute([$order_id]);
        $items = $items_stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'order' => $order,
            'items' => $items
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'خطأ في جلب تفاصيل الطلب: ' . $e->getMessage()
        ]);
    }
    exit;
}

// إذا وصلنا إلى هنا، الإجراء غير معروف
echo json_encode([
    'success' => false, 
    'message' => 'إجراء غير معروف: ' . $action,
    'available_actions' => [
        'test', 'register', 'login', 'update_profile', 'create_order', 
        'get_user_stats', 'get_products', 'insert_user', 'get_users',
        'get_user_orders', 'get_order_details'
    ]
]);
?>

