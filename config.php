<?php
/*
class Database {
    private $host = "localhost";
    private $db_name = "ecommerce_auth";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4", $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            $this->conn->exec("set names utf8mb4");
        } catch(PDOException $exception) {
            error_log("خطأ في الاتصال بقاعدة البيانات: " . $exception->getMessage());
            throw new Exception("خطأ في الاتصال بقاعدة البيانات");
        }
        return $this->conn;
    }
}

// بدء الجلسة
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// إعدادات إضافية
date_default_timezone_set('Asia/Riyadh');
?>*/

/*
class Database {
    private $host = "localhost";
    private $db_name = "ecommerce_auth";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4", $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            $this->conn->exec("set names utf8mb4");
        } catch(PDOException $exception) {
            error_log("خطأ في الاتصال بقاعدة البيانات: " . $exception->getMessage());
            throw new Exception("خطأ في الاتصال بقاعدة البيانات");
        }
        return $this->conn;
    }
}

// بدء الجلسة
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// إعدادات إضافية
date_default_timezone_set('Asia/Riyadh');

// دالة للتحقق من المصادقة
function checkAuth() {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'غير مصرح بالوصول']);
        exit;
    }
    return true;
}

// دالة للتحقق من صحة البريد الإلكتروني
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// دالة للتحقق من قوة كلمة المرور
function isStrongPassword($password) {
    return strlen($password) >= 6;
}

// دالة لتنظيف البيانات
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
?>*/


// إعدادات قاعدة البيانات
/*define('DB_HOST', 'localhost');
define('DB_NAME', 'your_database_name');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
define('DB_CHARSET', 'utf8');

// إعدادات JWT (للتطوير المستقبلي)
define('JWT_SECRET', 'your-secret-key');
define('JWT_ALGORITHM', 'HS256');

// إعدادات التطبيق
define('SITE_NAME', 'نظام المصادقة');
define('SITE_URL', 'http://localhost/your-project');

// دالة للاتصال بقاعدة البيانات
function getDBConnection() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET,
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        error_log("Database connection failed: " . $e->getMessage());
        return null;
    }
}

// دالة لإرجاع رد JSON
function jsonResponse($success, $message = '', $data = []) {
    header('Content-Type: application/json');
    $response = ['success' => $success];
    
    if ($message) {
        $response['message'] = $message;
    }
    
    if (!empty($data)) {
        $response['data'] = $data;
    }
    
    echo json_encode($response);
    exit;
}
?>*/


/*
class Database {
    private $host = "localhost";
    private $db_name = "auth_system";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
            $this->conn = null;
        }
        return $this->conn;
    }
}
?>*/



/*class Database {
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
?>*/



/*class Database {
    private $host = "localhost";
    private $db_name = "perfume_shop";
    private $username = "root";
    private $password = "";
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
            echo "خطأ في الاتصال: " . $exception->getMessage();
        }
        
        return $this->conn;
    }
}

function createDatabase() {
    try {
        $temp_conn = new PDO("mysql:host=localhost", "root", "");
        $temp_conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // إنشاء قاعدة البيانات إذا لم تكن موجودة
        $sql = "CREATE DATABASE IF NOT EXISTS perfume_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
        $temp_conn->exec($sql);
        
        // استخدام قاعدة البيانات
        $sql = "USE perfume_shop";
        $temp_conn->exec($sql);
        
        // إنشاء الجداول
        $tables_sql = [
            "CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                full_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                birth_date DATE,
                address TEXT,
                total_orders INT DEFAULT 0,
                total_spent DECIMAL(10,2) DEFAULT 0.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_email (email),
                INDEX idx_created_at (created_at)
            )",
            
            "CREATE TABLE IF NOT EXISTS products (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                image VARCHAR(500),
                description TEXT,
                stock_quantity INT DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_price (price),
                INDEX idx_active (is_active)
            )",
            
            "CREATE TABLE IF NOT EXISTS orders (
                id INT PRIMARY KEY AUTO_INCREMENT,
                order_number VARCHAR(50) UNIQUE NOT NULL,
                user_id INT NOT NULL,
                subtotal DECIMAL(10,2) NOT NULL,
                tax DECIMAL(10,2) NOT NULL,
                shipping DECIMAL(10,2) NOT NULL,
                total DECIMAL(10,2) NOT NULL,
                status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
                payment_method VARCHAR(50) DEFAULT 'cash_on_delivery',
                payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
                shipping_address TEXT,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_order_number (order_number),
                INDEX idx_user_id (user_id),
                INDEX idx_status (status),
                INDEX idx_created_at (created_at)
            )",
            
            "CREATE TABLE IF NOT EXISTS order_items (
                id INT PRIMARY KEY AUTO_INCREMENT,
                order_id INT NOT NULL,
                product_id INT NOT NULL,
                product_name VARCHAR(255) NOT NULL,
                product_price DECIMAL(10,2) NOT NULL,
                quantity INT NOT NULL,
                total_price DECIMAL(10,2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
                INDEX idx_order_id (order_id),
                INDEX idx_product_id (product_id)
            )"
        ];
        
        foreach ($tables_sql as $sql) {
            $temp_conn->exec($sql);
        }
        
        // إدراج البيانات الافتراضية
        $default_products = [
            ['Rose Éclat', 280.00, 'images/pert.jpg', 'يتميز هذا العطر رائحته الفاخرة التي تفوح بعبير الورد الفرنسي تجمع نسماته بين نعومة الورود الباريسية ولمسات من المسك الأبيض والفانيليا الناعمة لتمنحك إحساسًا بالدفء والرقي يدوم طوال اليوم', 50],
            ['Violet Lavender', 199.00, 'images/uuuuu.jpg', 'هذا العطر يتميز بنفحات من زهرة البنفسج واللافندر، مما يخلق توليفة زهرية ناعمة وأنيقة', 30],
            ['Larmes de Rose', 250.00, 'images/Gold.jpg', 'عطر أنثوي راقٍ تنبعث منه نفحات ناعمة من زهرة الماغنوليا واللوتس، ممزوجة بعبير الورد التركي، وتغلفه لمسة دافئة من المسك الأبيض وخشب الكشمير. يجسّد لحظاتك الحالمة بأناقة لا تُنسى', 25],
            ['Lumière Blanche', 130.00, 'images/www.jpg', 'عطر يشبه لحظة صباحية ناعمة، حين يلامس الضوء بشرتك برقة وهدوء. يفتتح بنفحات منعشة من الكمثرى واللافندر، ثم يتعمق في قلب زهري أنيق من السوسن والورد البلغاري. تستقر رائحته على قاعدة دافئة من المسك الابيض وخشب الصندل، تترك أثرًا ناعمًا يدوم.', 40],
            ['Or Lumi', 300.00, 'images/yallow.jpg', 'عطر يفتتح بنفحات من اليوسفي واللافندر، منعشة ومحايدة يتوسطه قلب خشبي زهري من السوسن وخشب الأرز، يعكس التوازن بين القوة والرقة تستقر رائحته على قاعدة دافئة من العنبر والمسك، تترك أثرًا ناعمًا يدوم', 20],
            ['Azure Drift', 180.00, 'images/Blue Perfume.jpg', 'هذا العطر ينبض بالحيوية من البرغموت الإيطالي والنعناع الأزرق، ليمنح إحساسًا منعشًا ومتوازنًا يتناغم قلبه بنقاء زهرة اللوتس وخشب الأرز الأبيض، في انسجام بين الصفاء والدفء تتعمق رائحته بقاعدة من المسك النقي والعنبر الرمادي، تترك أثرًا هادئًا يدوم', 35]
        ];
        
        $check_products = $temp_conn->query("SELECT COUNT(*) as count FROM products")->fetch();
        if ($check_products['count'] == 0) {
            $stmt = $temp_conn->prepare("INSERT INTO products (name, price, image, description, stock_quantity) VALUES (?, ?, ?, ?, ?)");
            foreach ($default_products as $product) {
                $stmt->execute($product);
            }
        }
        
        return true;
        
    } catch(PDOException $e) {
        error_log("خطأ في إنشاء قاعدة البيانات: " . $e->getMessage());
        return false;
    }
}
?>*/




class Database {
    private $host = "localhost";
    private $db_name = "perfume_shop";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name, 
                $this->username, 
                $this->password
            );
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            error_log("Connection error: " . $exception->getMessage());
        }
        return $this->conn;
    }
}

function createDatabase() {
    try {
        // الاتصال بدون تحديد قاعدة البيانات لإنشائها إذا لم تكن موجودة
        $temp_conn = new PDO("mysql:host=localhost", "root", "");
        $temp_conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // إنشاء قاعدة البيانات إذا لم تكن موجودة
        $temp_conn->exec("CREATE DATABASE IF NOT EXISTS perfume_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        
        // الاتصال بقاعدة البيانات
        $db = new Database();
        $conn = $db->getConnection();
        
        if (!$conn) {
            return false;
        }

        // إنشاء الجداول
        $tables = [
            "users" => "CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                full_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                birth_date DATE,
                address TEXT,
                total_orders INT DEFAULT 0,
                total_spent DECIMAL(10,2) DEFAULT 0.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
            
            "products" => "CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10,2) NOT NULL,
                image_url VARCHAR(500),
                stock_quantity INT DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
            
            "orders" => "CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_number VARCHAR(100) UNIQUE NOT NULL,
                user_id INT NOT NULL,
                subtotal DECIMAL(10,2) NOT NULL,
                tax DECIMAL(10,2) NOT NULL,
                shipping DECIMAL(10,2) NOT NULL,
                total DECIMAL(10,2) NOT NULL,
                shipping_address TEXT NOT NULL,
                status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
                payment_method VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
            
            "order_items" => "CREATE TABLE IF NOT EXISTS order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                product_id INT,
                product_name VARCHAR(255) NOT NULL,
                product_price DECIMAL(10,2) NOT NULL,
                quantity INT NOT NULL,
                total_price DECIMAL(10,2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
        ];

        foreach ($tables as $tableName => $sql) {
            $conn->exec($sql);
        }

        // إدخال بيانات المنتجات إذا لم تكن موجودة
        $check_products = $conn->query("SELECT COUNT(*) as count FROM products")->fetch()['count'];
        if ($check_products == 0) {
            $products = [
                ["Rose Éclat", 280, "يتميز هذا العطر رائحته الفاخرة التي تفوح بعبير الورد الفرنسي تجمع نسماته بين نعومة الورود الباريسية ولمسات من المسك الأبيض والفانيليا الناعمة لتمنحك إحساسًا بالدفء والرقي يدوم طوال اليوم", "images/pert.jpg"],
                ["Violet Lavender", 199, "هذا العطر يتميز بنفحات من زهرة البنفسج واللافندر، مما يخلق توليفة زهرية ناعمة وأنيقة", "images/uuuuu.jpg"],
                ["Larmes de Rose", 250, "عطر أنثوي راقٍ تنبعث منه نفحات ناعمة من زهرة الماغنوليا واللوتس، ممزوجة بعبير الورد التركي، وتغلفه لمسة دافئة من المسك الأبيض وخشب الكشمير. يجسّد لحظاتك الحالمة بأناقة لا تُنسى", "images/Gold.jpg"],
                ["Lumière Blanche", 130, "عطر يشبه لحظة صباحية ناعمة، حين يلامس الضوء بشرتك برقة وهدوء. يفتتح بنفحات منعشة من الكمثرى واللافندر، ثم يتعمق في قلب زهري أنيق من السوسن والورد البلغاري. تستقر رائحته على قاعدة دافئة من المسك الابيض وخشب الصندل، تترك أثرًا ناعمًا يدوم.", "images/www.jpg"],
                ["Or Lumi", 300, "عطر يفتتح بنفحات من اليوسفي واللافندر، منعشة ومحايدة يتوسطه قلب خشبي زهري من السوسن وخشب الأرز، يعكس التوازن بين القوة والرقة تستقر رائحته على قاعدة دافئة من العنبر والمسك، تترك أثرًا ناعمًا يدوم", "images/yallow.jpg"],
                ["Azure Drift", 180, "هذا العطر ينبض بالحيوية من البرغموت الإيطالي والنعناع الأزرق، ليمنح إحساسًا منعشًا ومتوازنًا يتناغم قلبه بنقاء زهرة اللوتس وخشب الأرز الأبيض، في انسجام بين الصفاء والدفء تتعمق رائحته بقاعدة من المسك النقي والعنبر الرمادي، تترك أثرًا هادئًا يدوم", "images/Blue Perfume.jpg"]
            ];

            $product_stmt = $conn->prepare("INSERT INTO products (name, price, description, image_url) VALUES (?, ?, ?, ?)");
            foreach ($products as $product) {
                $product_stmt->execute($product);
            }
        }

        return true;

    } catch(PDOException $exception) {
        error_log("Database creation error: " . $exception->getMessage());
        return false;
    }
}
?>