/*// نظام المصادقة والملف الشخصي المتكامل
class AuthSystem {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 بدء نظام المصادقة...');
        this.setCustomColors();
        this.createAuthModal();
        this.setupUserIconListener();
        this.setupModalEvents();
        this.checkAuthStatus();
    }

    setCustomColors() {
        const styles = `
            :root {
                --primary-color: #ea70b1;
                --secondary-color: #a20087;
                --light-color: #f8f9fa;
                --dark-color: #343a40;
                --success-color: #28a745;
                --danger-color: #dc3545;
                --warning-color: #ffc107;
            }
            
            .auth-primary { background-color: var(--primary-color) !important; }
            .auth-secondary { background-color: var(--secondary-color) !important; }
            .auth-success { background-color: var(--success-color) !important; }
            
            .auth-primary:hover { background-color: var(--secondary-color) !important; }
            .auth-success:hover { background-color: #218838 !important; }
            
            .text-primary { color: var(--primary-color) !important; }
            .text-secondary { color: var(--secondary-color) !important; }
            .text-success { color: var(--success-color) !important; }
            .text-danger { color: var(--danger-color) !important; }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupUserIconListener() {
        const userIcons = document.querySelectorAll('.fa-solid.fa-user, .user-icon');
        
        if (userIcons.length > 0) {
            userIcons.forEach(icon => {
                const button = icon.closest('button') || icon;
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('✅ تم النقر على أيقونة المستخدم');
                    this.handleUserClick(button);
                });
            });
        } else {
            console.error('❌ لم يتم العثور على أيقونة المستخدم!');
            // إنشاء زر مستخدم إذا لم يوجد
            this.createUserIcon();
        }
    }

    createUserIcon() {
        const userIcon = document.createElement('button');
        userIcon.className = 'user-icon';
        userIcon.innerHTML = '<i class="fa-solid fa-user"></i>';
        userIcon.style.cssText = `
            background: #f0f0f0;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            margin-left: 10px;
        `;
        
        document.querySelector('.header')?.appendChild(userIcon);
        this.setupUserIconListener();
    }

    handleUserClick(element) {
        if (this.isLoggedIn()) {
            this.showUserMenu(element);
        } else {
            this.showAuthModal();
        }
    }

    showUserMenu(icon) {
        const oldMenu = document.querySelector('.user-menu');
        if (oldMenu) oldMenu.remove();
        
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        const menuHTML = `
            <div class="user-menu">
                <div class="user-header">
                    <div class="user-avatar">
                        <i class="fa-solid fa-user-circle"></i>
                    </div>
                    <div class="user-details">
                        <strong>${userData.name || 'مستخدم'}</strong>
                        <small>${userData.email || ''}</small>
                    </div>
                </div>
                
                <div class="menu-section">
                    <div class="menu-items">
                        <button class="user-menu-item" onclick="authSystem.showProfile()">
                            <i class="fa-solid fa-user"></i>
                            حسابي
                        </button>
                        <button class="user-menu-item" onclick="authSystem.showOrders()">
                            <i class="fa-solid fa-box"></i>
                            الطلبات
                            <span class="menu-badge" id="ordersCount">0</span>
                        </button>
                        <button class="user-menu-item" onclick="authSystem.showSettings()">
                            <i class="fa-solid fa-cog"></i>
                            الإعدادات
                        </button>
                    </div>
                </div>
                
                <div class="menu-items">
                    <button class="user-menu-item logout-btn" onclick="authSystem.handleLogout()">
                        <i class="fa-solid fa-right-from-bracket"></i>
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        `;
        
        const iconContainer = icon.closest('button') || icon;
        const container = iconContainer.parentNode;
        container.style.position = 'relative';
        container.insertAdjacentHTML('beforeend', menuHTML);
        
        const menu = container.querySelector('.user-menu');
        
        // تحديث الإحصائيات
        this.updateMenuCounts();
        
        setTimeout(() => {
            menu.style.display = 'block';
        }, 10);
        
        const closeMenu = (e) => {
            if (menu && !menu.contains(e.target) && !icon.contains(e.target)) {
                menu.style.display = 'none';
                document.removeEventListener('click', closeMenu);
                setTimeout(() => {
                    if (menu.parentNode) {
                        menu.remove();
                    }
                }, 300);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 10);
    }

    async updateMenuCounts() {
        if (!this.isLoggedIn()) return;

        try {
            const response = await fetch('profile.php?action=get_user_stats');
            
            if (!response.ok) {
                throw new Error(`خطأ في الشبكة: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                const ordersCount = document.getElementById('ordersCount');
                if (ordersCount) {
                    ordersCount.textContent = data.data.orders_count || 0;
                }
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الإحصائيات:', error);
            const ordersCount = document.getElementById('ordersCount');
            if (ordersCount) {
                ordersCount.textContent = '0';
            }
        }
    }

    createAuthModal() {
        if (!document.getElementById('authModal')) {
            const modalHTML = `
                <div class="auth-modal" id="authModal">
                    <div class="auth-content">
                        <button class="auth-close" id="authClose">×</button>
                        
                        <div class="auth-form active" id="loginForm">
                            <h3 class="text-primary">تسجيل الدخول</h3>
                            <form id="loginFormElement">
                                <div class="input-group">
                                    <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                                </div>
                                <div class="input-group">
                                    <input type="password" name="password" placeholder="كلمة المرور" required>
                                </div>
                                <button type="submit" class="auth-btn auth-primary">
                                    <i class="fa-solid fa-right-to-bracket"></i>
                                    تسجيل الدخول
                                </button>
                            </form>
                            <div class="auth-switch">
                                ليس لديك حساب؟ 
                                <span class="switch-link text-primary" id="showRegister">إنشاء حساب</span>
                            </div>
                        </div>
                        
                        <div class="auth-form" id="registerForm">
                            <h3 class="text-primary">إنشاء حساب جديد</h3>
                            <form id="registerFormElement">
                                <div class="input-group">
                                    <input type="text" name="fullname" placeholder="الاسم الكامل" required>
                                </div>
                                <div class="input-group">
                                    <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                                </div>
                                <div class="input-group">
                                    <input type="password" name="password" placeholder="كلمة المرور" required>
                                </div>
                                <div class="input-group">
                                    <input type="password" name="confirm_password" placeholder="تأكيد كلمة المرور" required>
                                </div>
                                <div class="input-group">
                                    <input type="tel" name="phone" placeholder="رقم الهاتف (اختياري)">
                                </div>
                                <div class="input-group">
                                    <input type="date" name="birth_date" placeholder="تاريخ الميلاد">
                                </div>
                                <div class="input-group">
                                    <textarea name="address" placeholder="العنوان" rows="3"></textarea>
                                </div>
                                <button type="submit" class="auth-btn auth-primary">
                                    <i class="fa-solid fa-user-plus"></i>
                                    إنشاء حساب
                                </button>
                            </form>
                            <div class="auth-switch">
                                لديك حساب بالفعل؟ 
                                <span class="switch-link text-primary" id="showLogin">تسجيل الدخول</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            this.addAuthModalStyles();
        }
    }

    addAuthModalStyles() {
        const styles = `
            .auth-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
            }
            
            .auth-modal.active {
                display: flex;
                animation: fadeIn 0.3s ease;
            }
            
            .auth-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 450px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .auth-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .auth-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .auth-form {
                display: none;
            }
            
            .auth-form.active {
                display: block;
            }
            
            .auth-form h3 {
                text-align: center;
                margin-bottom: 25px;
                color: var(--primary-color);
                font-size: 24px;
                font-weight: bold;
            }
            
            .input-group {
                margin-bottom: 15px;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .auth-btn {
                width: 100%;
                padding: 15px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: all 0.3s ease;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .auth-btn:hover {
                background: var(--secondary-color);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(162, 0, 135, 0.3);
            }
            
            .auth-switch {
                text-align: center;
                margin-top: 25px;
                color: var(--dark-color);
                font-size: 14px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
            }
            
            .switch-link {
                color: var(--primary-color);
                cursor: pointer;
                font-weight: bold;
                transition: color 0.3s ease;
            }
            
            .switch-link:hover {
                color: var(--secondary-color);
                text-decoration: underline;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }

            .user-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                padding: 0;
                min-width: 280px;
                z-index: 1000;
                margin-top: 8px;
                border: 2px solid var(--primary-color);
                overflow: hidden;
            }
            
            .user-header {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                padding: 20px;
                color: white;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .user-avatar {
                font-size: 40px;
                opacity: 0.9;
            }
            
            .user-details {
                flex: 1;
            }
            
            .user-details strong {
                display: block;
                font-size: 16px;
                margin-bottom: 4px;
            }
            
            .user-details small {
                font-size: 12px;
                opacity: 0.8;
            }
            
            .menu-section {
                padding: 15px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .menu-items {
                padding: 0;
            }
            
            .user-menu-item {
                display: flex;
                align-items: center;
                padding: 12px 20px;
                color: #333;
                text-decoration: none;
                border: none;
                background: none;
                width: 100%;
                text-align: right;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
                gap: 12px;
                position: relative;
                border-bottom: 1px solid #f8f8f8;
            }
            
            .user-menu-item:last-child {
                border-bottom: none;
            }
            
            .user-menu-item i {
                width: 20px;
                text-align: center;
                color: var(--primary-color);
                font-size: 16px;
            }
            
            .user-menu-item:hover {
                background: var(--light-color);
                transform: translateX(-5px);
            }
            
            .user-menu-item:hover i {
                color: var(--secondary-color);
            }
            
            .logout-btn {
                color: var(--danger-color);
                font-weight: bold;
                margin-top: 0;
            }
            
            .logout-btn i {
                color: var(--danger-color);
            }
            
            .logout-btn:hover {
                background: #ffe6e6;
            }
            
            .menu-badge {
                background: var(--secondary-color);
                color: white;
                border-radius: 12px;
                padding: 2px 8px;
                font-size: 11px;
                font-weight: bold;
                margin-right: auto;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupModalEvents() {
        const authClose = document.getElementById('authClose');
        if (authClose) {
            authClose.addEventListener('click', () => this.closeAuthModal());
        }

        const showRegister = document.getElementById('showRegister');
        const showLogin = document.getElementById('showLogin');
        
        if (showRegister) {
            showRegister.addEventListener('click', () => this.showRegisterForm());
        }
        if (showLogin) {
            showLogin.addEventListener('click', () => this.showLoginForm());
        }

        const loginForm = document.getElementById('loginFormElement');
        const registerForm = document.getElementById('registerFormElement');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.addEventListener('click', (e) => {
                if (e.target === authModal) {
                    this.closeAuthModal();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAuthModal();
            }
        });
    }

    showAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            this.showLoginForm();
        }
    }

    showLoginForm() {
        document.getElementById('loginForm').classList.add('active');
        document.getElementById('registerForm').classList.remove('active');
    }

    showRegisterForm() {
        document.getElementById('loginForm').classList.remove('active');
        document.getElementById('registerForm').classList.add('active');
    }

    async handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        await this.sendAuthRequest(formData, 'login');
    }

    async handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm_password');
        
        if (password !== confirmPassword) {
            this.showMessage('كلمات المرور غير متطابقة!', 'error');
            return;
        }
        
        if (password.length < 6) {
            this.showMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }
        
        await this.sendAuthRequest(formData, 'register');
    }

    async sendAuthRequest(formData, action) {
        try {
            formData.append('action', action);
            
            const response = await fetch('auth.php', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('خطأ في الشبكة: ' + response.status);
            }
            
            const data = await response.json();
            
            if (data.success) {
                this.showMessage(data.message, 'success');
                this.closeAuthModal();
                
                localStorage.setItem('userLoggedIn', 'true');
                if (data.user) {
                    localStorage.setItem('userData', JSON.stringify(data.user));
                }
                
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                this.showMessage(data.message, 'error');
            }
        } catch (error) {
            console.error('❌ خطأ:', error);
            this.showMessage('حدث خطأ في الاتصال: ' + error.message, 'error');
        }
    }

    async handleLogout() {
        try {
            const response = await fetch('auth.php?action=logout');
            
            const data = await response.json();
            
            if (data.success) {
                this.showMessage(data.message, 'success');
                
                localStorage.removeItem('userLoggedIn');
                localStorage.removeItem('userData');
                
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                this.showMessage(data.message || 'حدث خطأ في تسجيل الخروج', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تسجيل الخروج:', error);
            
            localStorage.removeItem('userLoggedIn');
            localStorage.removeItem('userData');
            this.showMessage('تم تسجيل الخروج', 'success');
            
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }

    isLoggedIn() {
        return localStorage.getItem('userLoggedIn') === 'true';
    }

    async checkAuthStatus() {
        try {
            const response = await fetch('auth.php?action=check_auth');
            const data = await response.json();
            
            if (data.success && data.user) {
                localStorage.setItem('userLoggedIn', 'true');
                localStorage.setItem('userData', JSON.stringify(data.user));
                this.updateUIForLoggedInUser();
            } else {
                localStorage.removeItem('userLoggedIn');
                localStorage.removeItem('userData');
            }
        } catch (error) {
            console.error('❌ خطأ في التحقق من حالة المصادقة:', error);
        }
    }

    updateUIForLoggedInUser() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        const userIcons = document.querySelectorAll('.fa-user');
        userIcons.forEach(icon => {
            icon.classList.remove('fa-user');
            icon.classList.add('fa-user-check');
            icon.style.color = 'var(--success-color)';
        });
    }

    async showProfile() {
        try {
            const response = await fetch('profile.php?action=get_profile');
            
            if (!response.ok) {
                throw new Error(`خطأ في الشبكة: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                this.showProfileModal(data.data.profile);
            } else {
                this.showMessage(data.message || 'حدث خطأ في جلب البيانات', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ:', error);
            this.showMessage('حدث خطأ في الاتصال بالخادم', 'error');
        }
    }

    showProfileModal(profile) {
        const modalHTML = `
            <div class="profile-modal active">
                <div class="profile-content">
                    <button class="profile-close" onclick="this.closest('.profile-modal').remove()">×</button>
                    <h3 class="text-primary"><i class="fa-solid fa-user"></i> حسابي</h3>
                    
                    <div class="profile-sections">
                        <div class="profile-section">
                            <h4 class="section-title"><i class="fa-solid fa-user-circle"></i> المعلومات الشخصية</h4>
                            <form id="profileForm">
                                <div class="form-row">
                                    <div class="input-group">
                                        <label><i class="fa-solid fa-signature"></i> الاسم الكامل</label>
                                        <input type="text" name="fullname" value="${this.escapeHtml(profile.full_name || '')}" required>
                                    </div>
                                    
                                    <div class="input-group">
                                        <label><i class="fa-solid fa-envelope"></i> البريد الإلكتروني</label>
                                        <input type="email" value="${this.escapeHtml(profile.email)}" disabled>
                                        <small>لا يمكن تغيير البريد الإلكتروني</small>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="input-group">
                                        <label><i class="fa-solid fa-phone"></i> رقم الهاتف</label>
                                        <input type="tel" name="phone" value="${this.escapeHtml(profile.phone || '')}" placeholder="أدخل رقم هاتفك">
                                    </div>
                                    
                                    <div class="input-group">
                                        <label><i class="fa-solid fa-cake-candles"></i> تاريخ الميلاد</label>
                                        <input type="date" name="birth_date" value="${profile.birth_date || ''}">
                                    </div>
                                </div>
                                
                                <div class="input-group">
                                    <label><i class="fa-solid fa-location-dot"></i> العنوان</label>
                                    <textarea name="address" placeholder="أدخل عنوانك الكامل" rows="3">${this.escapeHtml(profile.address || '')}</textarea>
                                </div>
                                
                                <div class="form-actions">
                                    <button type="submit" class="auth-btn auth-primary">
                                        <i class="fa-solid fa-floppy-disk"></i>
                                        حفظ التغييرات
                                    </button>
                                    <button type="button" class="auth-btn auth-secondary" onclick="this.closest('.profile-modal').remove()">
                                        <i class="fa-solid fa-times"></i>
                                        إلغاء
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addProfileModalStyles();
        
        document.getElementById('profileForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateProfile(new FormData(e.target));
        });
    }

    addProfileModalStyles() {
        const styles = `
            .profile-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                display: none;
                align-items: center;
                justify-content: center;
            }
            
            .profile-modal.active {
                display: flex;
            }
            
            .profile-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 600px;
                position: relative;
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .profile-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .profile-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .profile-content h3 {
                text-align: center;
                margin-bottom: 30px;
                color: var(--primary-color);
                font-size: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            
            .profile-sections {
                display: flex;
                flex-direction: column;
                gap: 25px;
            }
            
            .profile-section {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
                border: 1px solid #e9ecef;
            }
            
            .section-title {
                color: var(--secondary-color);
                margin-bottom: 20px;
                font-size: 18px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .form-row {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
            }
            
            .form-row .input-group {
                flex: 1;
                margin-bottom: 0;
            }
            
            .input-group {
                margin-bottom: 20px;
            }
            
            .input-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: bold;
                color: var(--dark-color);
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .input-group textarea {
                min-height: 80px;
                resize: vertical;
            }
            
            .input-group small {
                color: #666;
                font-size: 12px;
                margin-top: 5px;
                display: block;
            }
            
            .form-actions {
                display: flex;
                gap: 10px;
                margin-top: 25px;
            }
            
            .form-actions .auth-btn {
                flex: 1;
                margin-bottom: 0;
                padding: 12px;
            }
            
            @media (max-width: 768px) {
                .form-row {
                    flex-direction: column;
                    gap: 0;
                }
                
                .profile-content {
                    padding: 20px;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    async updateProfile(formData) {
        try {
            formData.append('action', 'update_profile');
            
            const response = await fetch('profile.php', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`خطأ في الشبكة: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                this.showMessage(data.message, 'success');
                
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                const updatedUserData = { ...userData, ...data.user };
                localStorage.setItem('userData', JSON.stringify(updatedUserData));
                
                setTimeout(() => {
                    const modal = document.querySelector('.profile-modal');
                    if (modal) modal.remove();
                }, 1500);
            } else {
                this.showMessage(data.message, 'error');
            }
        } catch (error) {
            console.error('❌ خطأ:', error);
            this.showMessage('حدث خطأ في تحديث البيانات', 'error');
        }
    }

    async showOrders() {
        try {
            const response = await fetch('profile.php?action=get_orders');
            
            if (!response.ok) {
                throw new Error(`خطأ في الشبكة: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                this.showOrdersModal(data.data.orders);
            } else {
                this.showMessage(data.message || 'حدث خطأ في جلب الطلبات', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ:', error);
            this.showMessage('حدث خطأ في جلب الطلبات', 'error');
        }
    }

    showOrdersModal(orders) {
        const ordersHTML = orders.length > 0 ? 
            orders.map(order => `
                <div class="order-item">
                    <div class="order-header">
                        <span class="order-number">طلب #${order.order_number}</span>
                        <span class="order-status ${order.status}">${this.getStatusText(order.status)}</span>
                    </div>
                    <div class="order-details">
                        <div class="order-info">
                            <span><i class="fa-solid fa-cube"></i> ${order.items_count} منتج</span>
                            <span class="order-amount"><i class="fa-solid fa-tag"></i> ${order.total_amount} ر.س</span>
                        </div>
                        <div class="order-date"><i class="fa-solid fa-calendar"></i> ${new Date(order.created_at).toLocaleDateString('ar-SA')}</div>
                    </div>
                    <div class="order-actions">
                        <button class="order-btn" onclick="authSystem.viewOrderDetails(${order.id})">
                            <i class="fa-solid fa-eye"></i>
                            تفاصيل الطلب
                        </button>
                        <button class="order-btn track-btn" onclick="authSystem.trackOrder(${order.id})">
                            <i class="fa-solid fa-truck"></i>
                            تتبع الطلب
                        </button>
                    </div>
                </div>
            `).join('') :
            `<div class="empty-orders">
                <i class="fa-solid fa-box-open" style="font-size: 64px; color: #ddd; margin-bottom: 20px;"></i>
                <h4>لا توجد طلبات سابقة</h4>
                <p>لم تقم بأي طلبات حتى الآن</p>
                <small>يمكنك متابعة طلباتك هنا بعد إتمام عملية الشراء</small>
            </div>`;

        const modalHTML = `
            <div class="orders-modal active">
                <div class="orders-content">
                    <button class="orders-close" onclick="this.closest('.orders-modal').remove()">×</button>
                    <h3 class="text-primary"><i class="fa-solid fa-box"></i> طلباتي (${orders.length})</h3>
                    <div class="orders-list">${ordersHTML}</div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addOrdersModalStyles();
    }

    addOrdersModalStyles() {
        const styles = `
            .orders-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                display: none;
                align-items: center;
                justify-content: center;
            }
            
            .orders-modal.active {
                display: flex;
            }
            
            .orders-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 800px;
                position: relative;
                max-height: 80vh;
                overflow-y: auto;
            }
            
            .orders-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .orders-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .orders-content h3 {
                text-align: center;
                margin-bottom: 25px;
                color: var(--primary-color);
                font-size: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            
            .order-item {
                border: 1px solid #e0e0e0;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 15px;
                background: #fafafa;
                transition: all 0.3s ease;
            }
            
            .order-item:hover {
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                transform: translateY(-2px);
            }
            
            .order-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #eee;
            }
            
            .order-number {
                font-weight: bold;
                color: var(--dark-color);
                font-size: 16px;
            }
            
            .order-status {
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
            }
            
            .order-status.pending { background: #fff3cd; color: #856404; }
            .order-status.processing { background: #cce7ff; color: #004085; }
            .order-status.shipped { background: #d1ecf1; color: #0c5460; }
            .order-status.delivered { background: #d4edda; color: #155724; }
            .order-status.cancelled { background: #f8d7da; color: #721c24; }
            
            .order-details {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }
            
            .order-info {
                display: flex;
                gap: 20px;
                align-items: center;
            }
            
            .order-info span {
                display: flex;
                align-items: center;
                gap: 5px;
                color: #666;
                font-size: 14px;
            }
            
            .order-amount {
                font-weight: bold;
                color: var(--primary-color) !important;
                font-size: 16px !important;
            }
            
            .order-date {
                color: #666;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            
            .order-actions {
                display: flex;
                gap: 10px;
                justify-content: flex-start;
            }
            
            .order-btn {
                background: var(--primary-color);
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                display: inline-flex;
                align-items: center;
                gap: 5px;
                transition: all 0.3s ease;
            }
            
            .track-btn {
                background: var(--secondary-color);
            }
            
            .order-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            
            .empty-orders {
                text-align: center;
                padding: 40px 20px;
                color: #666;
            }
            
            .empty-orders h4 {
                margin: 15px 0 10px 0;
                color: var(--dark-color);
            }
            
            .empty-orders p {
                margin-bottom: 10px;
                font-size: 16px;
            }
            
            .empty-orders small {
                color: #999;
                font-size: 14px;
            }
            
            @media (max-width: 768px) {
                .order-details {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 10px;
                }
                
                .order-actions {
                    flex-direction: column;
                    width: 100%;
                    gap: 8px;
                    margin-top: 10px;
                }
                
                .order-btn {
                    width: 100%;
                    justify-content: center;
                    margin: 0;
                    padding: 10px;
                }
                
                .order-header {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 10px;
                }
                
                .order-status {
                    align-self: flex-start;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    showSettings() {
        this.showMessage('جاري فتح صفحة الإعدادات...', 'success');
        console.log('⚙️ فتح الإعدادات');
    }

    viewOrderDetails(orderId) {
        this.showMessage(`جاري فتح تفاصيل الطلب #${orderId}...`, 'success');
        console.log(`فتح تفاصيل الطلب: ${orderId}`);
    }

    trackOrder(orderId) {
        this.showMessage(`جاري تتبع الطلب #${orderId}...`, 'success');
        console.log(`تتبع الطلب: ${orderId}`);
    }

    getStatusText(status) {
        const statusMap = {
            'pending': 'قيد الانتظار',
            'processing': 'قيد المعالجة',
            'shipped': 'تم الشحن',
            'delivered': 'تم التوصيل',
            'cancelled': 'ملغي'
        };
        return statusMap[status] || status;
    }

    showMessage(message, type) {
        const existingMessages = document.querySelectorAll('.system-message');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.className = `system-message ${type}`;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            z-index: 10001;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            ${type === 'success' ? 
                'background: var(--success-color);' : 
                type === 'error' ? 
                'background: var(--danger-color);' :
                'background: var(--primary-color);'
            }
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 4000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// بدء النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});

// جعل النظام متاحاً globally
if (typeof window !== 'undefined') {
    window.AuthSystem = AuthSystem;
}*/

 //نظام المصادقة والملف الشخصي المتكامل - يدعم التسجيل العادي وقاعدة البيانات
/*class AuthSystem {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 بدء نظام المصادقة...');
        this.setCustomColors();
        this.createAuthModal();
        this.setupUserIconListener();
        this.setupModalEvents();
        this.checkAuthStatus();
        this.setupAdminPanel(); // إضافة لوحة التحكم
    }

    setCustomColors() {
        const styles = `
            :root {
                --primary-color: #ea70b1;
                --secondary-color: #a20087;
                --light-color: #f8f9fa;
                --dark-color: #343a40;
                --success-color: #28a745;
                --danger-color: #dc3545;
                --warning-color: #ffc107;
                --info-color: #17a2b8;
            }
            
            .auth-primary { background-color: var(--primary-color) !important; }
            .auth-secondary { background-color: var(--secondary-color) !important; }
            .auth-success { background-color: var(--success-color) !important; }
            .auth-info { background-color: var(--info-color) !important; }
            
            .auth-primary:hover { background-color: var(--secondary-color) !important; }
            .auth-success:hover { background-color: #218838 !important; }
            .auth-info:hover { background-color: #138496 !important; }
            
            .text-primary { color: var(--primary-color) !important; }
            .text-secondary { color: var(--secondary-color) !important; }
            .text-success { color: var(--success-color) !important; }
            .text-danger { color: var(--danger-color) !important; }
            .text-info { color: var(--info-color) !important; }
            
            .registration-badge {
                display: inline-block;
                padding: 3px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: bold;
                margin-right: 8px;
            }
            
            .badge-system { background: var(--info-color); color: white; }
            .badge-manual { background: var(--success-color); color: white; }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupUserIconListener() {
        const userIcons = document.querySelectorAll('.fa-solid.fa-user, .user-icon');
        
        if (userIcons.length > 0) {
            userIcons.forEach(icon => {
                const button = icon.closest('button') || icon;
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('✅ تم النقر على أيقونة المستخدم');
                    this.handleUserClick(button);
                });
            });
        } else {
            console.error('❌ لم يتم العثور على أيقونة المستخدم!');
            this.createUserIcon();
        }
    }

    createUserIcon() {
        const userIcon = document.createElement('button');
        userIcon.className = 'user-icon';
        userIcon.innerHTML = '<i class="fa-solid fa-user"></i>';
        userIcon.style.cssText = `
            background: #f0f0f0;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            margin-left: 10px;
        `;
        
        document.querySelector('.header')?.appendChild(userIcon);
        this.setupUserIconListener();
    }

    handleUserClick(element) {
        if (this.isLoggedIn()) {
            this.showUserMenu(element);
        } else {
            this.showAuthModal();
        }
    }

    showUserMenu(icon) {
        const oldMenu = document.querySelector('.user-menu');
        if (oldMenu) oldMenu.remove();
        
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const registrationType = userData.registration_type || 'manual';
        const badgeText = registrationType === 'system' ? 'نظام' : 'عادي';
        const badgeClass = registrationType === 'system' ? 'badge-system' : 'badge-manual';
        
        const menuHTML = `
            <div class="user-menu">
                <div class="user-header">
                    <div class="user-avatar">
                        <i class="fa-solid fa-user-circle"></i>
                    </div>
                    <div class="user-details">
                        <strong>${userData.name || 'مستخدم'}</strong>
                        <small>${userData.email || ''}</small>
                        <div style="margin-top: 5px;">
                            <span class="registration-badge ${badgeClass}">${badgeText}</span>
                        </div>
                    </div>
                </div>
                
                <div class="menu-section">
                    <div class="menu-items">
                        <button class="user-menu-item" onclick="authSystem.showProfile()">
                            <i class="fa-solid fa-user"></i>
                            حسابي
                        </button>
                        <button class="user-menu-item" onclick="authSystem.showOrders()">
                            <i class="fa-solid fa-box"></i>
                            الطلبات
                            <span class="menu-badge" id="ordersCount">0</span>
                        </button>
                        <button class="user-menu-item" onclick="authSystem.showSettings()">
                            <i class="fa-solid fa-cog"></i>
                            الإعدادات
                        </button>
                        ${this.isAdminUser() ? `
                        <button class="user-menu-item" onclick="authSystem.showAdminPanel()">
                            <i class="fa-solid fa-users-cog"></i>
                            لوحة التحكم
                        </button>
                        ` : ''}
                    </div>
                </div>
                
                <div class="menu-items">
                    <button class="user-menu-item logout-btn" onclick="authSystem.handleLogout()">
                        <i class="fa-solid fa-right-from-bracket"></i>
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        `;
        
        const iconContainer = icon.closest('button') || icon;
        const container = iconContainer.parentNode;
        container.style.position = 'relative';
        container.insertAdjacentHTML('beforeend', menuHTML);
        
        const menu = container.querySelector('.user-menu');
        
        this.updateMenuCounts();
        
        setTimeout(() => {
            menu.style.display = 'block';
        }, 10);
        
        const closeMenu = (e) => {
            if (menu && !menu.contains(e.target) && !icon.contains(e.target)) {
                menu.style.display = 'none';
                document.removeEventListener('click', closeMenu);
                setTimeout(() => {
                    if (menu.parentNode) {
                        menu.remove();
                    }
                }, 300);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 10);
    }

    isAdminUser() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        // يمكنك تعديل هذا الشرط حسب احتياجاتك
        return userData.email && userData.email.includes('admin') || userData.registration_type === 'system';
    }

    async updateMenuCounts() {
        if (!this.isLoggedIn()) return;

        try {
            const response = await fetch('profile.php?action=get_user_stats');
            
            if (!response.ok) {
                throw new Error(`خطأ في الشبكة: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                const ordersCount = document.getElementById('ordersCount');
                if (ordersCount) {
                    ordersCount.textContent = data.data.orders_count || 0;
                }
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الإحصائيات:', error);
            const ordersCount = document.getElementById('ordersCount');
            if (ordersCount) {
                ordersCount.textContent = '0';
            }
        }
    }

    createAuthModal() {
        if (!document.getElementById('authModal')) {
            const modalHTML = `
                <div class="auth-modal" id="authModal">
                    <div class="auth-content">
                        <button class="auth-close" id="authClose">×</button>
                        
                        <div class="auth-form active" id="loginForm">
                            <h3 class="text-primary">تسجيل الدخول</h3>
                            <div class="demo-accounts" style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-right: 4px solid var(--info-color);">
                                <h4 style="margin: 0 0 10px 0; color: var(--info-color); font-size: 14px;">
                                    <i class="fa-solid fa-key"></i> حسابات تجريبية (من قاعدة البيانات):
                                </h4>
                                <div style="font-size: 12px; line-height: 1.5;">
                                    <div><strong>ahmed@example.com</strong> / password123</div>
                                    <div><strong>fatima@example.com</strong> / password123</div>
                                    <small style="color: #666;">أو سجل حساب جديد أدناه</small>
                                </div>
                            </div>
                            <form id="loginFormElement">
                                <div class="input-group">
                                    <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                                </div>
                                <div class="input-group">
                                    <input type="password" name="password" placeholder="كلمة المرور" required>
                                </div>
                                <button type="submit" class="auth-btn auth-primary">
                                    <i class="fa-solid fa-right-to-bracket"></i>
                                    تسجيل الدخول
                                </button>
                            </form>
                            <div class="auth-switch">
                                ليس لديك حساب؟ 
                                <span class="switch-link text-primary" id="showRegister">إنشاء حساب جديد</span>
                            </div>
                        </div>
                        
                        <div class="auth-form" id="registerForm">
                            <h3 class="text-primary">إنشاء حساب جديد</h3>
                            <p style="text-align: center; color: #666; margin-bottom: 20px; font-size: 14px;">
                                <i class="fa-solid fa-user-plus"></i> سجل بياناتك وسيتم حفظها في قاعدة البيانات
                            </p>
                            <form id="registerFormElement">
                                <div class="input-group">
                                    <input type="text" name="fullname" placeholder="الاسم الكامل" required>
                                </div>
                                <div class="input-group">
                                    <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                                </div>
                                <div class="input-group">
                                    <input type="password" name="password" placeholder="كلمة المرور" required>
                                    <small style="color: #666; display: block; margin-top: 5px;">كلمة المرور يجب أن تكون 6 أحرف على الأقل</small>
                                </div>
                                <div class="input-group">
                                    <input type="password" name="confirm_password" placeholder="تأكيد كلمة المرور" required>
                                </div>
                                <div class="input-group">
                                    <input type="tel" name="phone" placeholder="رقم الهاتف (اختياري)">
                                </div>
                                <div class="input-group">
                                    <input type="date" name="birth_date" placeholder="تاريخ الميلاد">
                                </div>
                                <div class="input-group">
                                    <textarea name="address" placeholder="العنوان" rows="3"></textarea>
                                </div>
                                <button type="submit" class="auth-btn auth-primary">
                                    <i class="fa-solid fa-user-plus"></i>
                                    إنشاء حساب
                                </button>
                            </form>
                            <div class="auth-switch">
                                لديك حساب بالفعل؟ 
                                <span class="switch-link text-primary" id="showLogin">تسجيل الدخول</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            this.addAuthModalStyles();
        }
    }

    setupAdminPanel() {
        // إضافة زر لوحة التحكم إذا كان المستخدم مسؤولاً
        if (this.isAdminUser()) {
            const adminBtn = document.createElement('button');
            adminBtn.className = 'admin-btn';
            adminBtn.innerHTML = '<i class="fa-solid fa-users-cog"></i>';
            adminBtn.title = 'لوحة التحكم';
            adminBtn.style.cssText = `
                background: var(--info-color);
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-left: 10px;
                transition: all 0.3s ease;
            `;
            
            adminBtn.addEventListener('click', () => {
                this.showAdminPanel();
            });
            
            document.querySelector('.header')?.appendChild(adminBtn);
        }
    }

    async showAdminPanel() {
        try {
            const response = await fetch('auth.php?action=get_all_users');
            const data = await response.json();
            
            if (data.success) {
                this.showUsersModal(data.users);
            } else {
                this.showMessage(data.message, 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في جلب بيانات المستخدمين:', error);
            this.showMessage('حدث خطأ في جلب البيانات', 'error');
        }
    }

    showUsersModal(users) {
        const usersHTML = users.map(user => `
            <div class="user-item">
                <div class="user-info">
                    <div class="user-main">
                        <strong>${this.escapeHtml(user.full_name)}</strong>
                        <span class="registration-badge ${user.registration_type === 'system' ? 'badge-system' : 'badge-manual'}">
                            ${user.registration_type === 'system' ? 'نظام' : 'عادي'}
                        </span>
                    </div>
                    <div class="user-details">
                        <small><i class="fa-solid fa-envelope"></i> ${this.escapeHtml(user.email)}</small>
                        <small><i class="fa-solid fa-phone"></i> ${user.phone || 'غير محدد'}</small>
                        <small><i class="fa-solid fa-calendar"></i> ${new Date(user.created_at).toLocaleDateString('ar-SA')}</small>
                    </div>
                </div>
            </div>
        `).join('');

        const modalHTML = `
            <div class="admin-modal active">
                <div class="admin-content">
                    <button class="admin-close" onclick="this.closest('.admin-modal').remove()">×</button>
                    <h3 class="text-info"><i class="fa-solid fa-users-cog"></i> لوحة التحكم - إدارة المستخدمين</h3>
                    
                    <div class="stats" style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
                        <div class="stat-card" style="background: var(--info-color); color: white; padding: 15px; border-radius: 8px; flex: 1; min-width: 120px;">
                            <div style="font-size: 24px; font-weight: bold;">${users.length}</div>
                            <div style="font-size: 12px;">إجمالي المستخدمين</div>
                        </div>
                        <div class="stat-card" style="background: var(--success-color); color: white; padding: 15px; border-radius: 8px; flex: 1; min-width: 120px;">
                            <div style="font-size: 24px; font-weight: bold;">${users.filter(u => u.registration_type === 'manual').length}</div>
                            <div style="font-size: 12px;">مستخدمين عاديين</div>
                        </div>
                        <div class="stat-card" style="background: var(--primary-color); color: white; padding: 15px; border-radius: 8px; flex: 1; min-width: 120px;">
                            <div style="font-size: 24px; font-weight: bold;">${users.filter(u => u.registration_type === 'system').length}</div>
                            <div style="font-size: 12px;">مستخدمين نظام</div>
                        </div>
                    </div>
                    
                    <div class="users-list">
                        ${usersHTML}
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addAdminModalStyles();
    }

    addAdminModalStyles() {
        const styles = `
            .admin-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                display: none;
                align-items: center;
                justify-content: center;
            }
            
            .admin-modal.active {
                display: flex;
            }
            
            .admin-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 800px;
                position: relative;
                max-height: 80vh;
                overflow-y: auto;
            }
            
            .admin-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--info-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .admin-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .user-item {
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 10px;
                background: #fafafa;
            }
            
            .user-main {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }
            
            .user-details {
                display: flex;
                gap: 15px;
                flex-wrap: wrap;
            }
            
            .user-details small {
                display: flex;
                align-items: center;
                gap: 5px;
                color: #666;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
// ... استمرار الكود من حيث توقف

    setupModalEvents() {
        // أحداث التبديل بين النماذج
        document.getElementById('showRegister')?.addEventListener('click', () => {
            this.showRegisterForm();
        });
        
        document.getElementById('showLogin')?.addEventListener('click', () => {
            this.showLoginForm();
        });
        
        // أحداث الإغلاق
        document.getElementById('authClose')?.addEventListener('click', () => {
            this.hideAuthModal();
        });
        
        // أحداث النماذج
        document.getElementById('loginFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e);
        });
        
        document.getElementById('registerFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e);
        });
        
        // إغلاق النافذة عند النقر خارجها
        document.getElementById('authModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'authModal') {
                this.hideAuthModal();
            }
        });
    }

    showAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.add('active');
            this.showLoginForm();
        }
    }

    hideAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    showLoginForm() {
        document.getElementById('loginForm').classList.add('active');
        document.getElementById('registerForm').classList.remove('active');
    }

    showRegisterForm() {
        document.getElementById('registerForm').classList.add('active');
        document.getElementById('loginForm').classList.remove('active');
    }

    async handleLogin(e) {
        const formData = new FormData(e.target);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        
        try {
            const response = await fetch('auth.php?action=login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('userData', JSON.stringify(result.user));
                this.showMessage('تم تسجيل الدخول بنجاح!', 'success');
                this.hideAuthModal();
                this.checkAuthStatus();
                this.setupAdminPanel();
                
                // إعادة تحميل الصفحة لتحديث الواجهة
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                this.showMessage(result.message || 'فشل تسجيل الدخول', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تسجيل الدخول:', error);
            this.showMessage('حدث خطأ أثناء تسجيل الدخول', 'error');
        }
    }

    async handleRegister(e) {
        const formData = new FormData(e.target);
        const data = {
            full_name: formData.get('fullname'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirm_password: formData.get('confirm_password'),
            phone: formData.get('phone'),
            birth_date: formData.get('birth_date'),
            address: formData.get('address')
        };
        
        // التحقق من تطابق كلمات المرور
        if (data.password !== data.confirm_password) {
            this.showMessage('كلمات المرور غير متطابقة', 'error');
            return;
        }
        
        // التحقق من قوة كلمة المرور
        if (data.password.length < 6) {
            this.showMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }
        
        try {
            const response = await fetch('auth.php?action=register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showMessage('تم إنشاء الحساب بنجاح!', 'success');
                this.showLoginForm();
                
                // تعبئة بيانات تسجيل الدخول تلقائياً
                const emailInput = document.querySelector('#loginForm input[name="email"]');
                if (emailInput) {
                    emailInput.value = data.email;
                }
            } else {
                this.showMessage(result.message || 'فشل إنشاء الحساب', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في إنشاء الحساب:', error);
            this.showMessage('حدث خطأ أثناء إنشاء الحساب', 'error');
        }
    }

    handleLogout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        this.showMessage('تم تسجيل الخروج بنجاح', 'success');
        this.checkAuthStatus();
        
        // إعادة تحميل الصفحة لتحديث الواجهة
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    isLoggedIn() {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        return !!(token && userData);
    }

    checkAuthStatus() {
        if (this.isLoggedIn()) {
            console.log('✅ المستخدم مسجل الدخول');
            this.updateUserInterface();
        } else {
            console.log('❌ المستخدم غير مسجل الدخول');
        }
    }

    updateUserInterface() {
        // تحديث واجهة المستخدم حسب حالة التسجيل
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        console.log('🔄 تحديث واجهة المستخدم:', userData);
        
        // يمكنك إضافة تحديثات إضافية للواجهة هنا
        // مثل تغيير نص الأزرار أو إظهار معلومات المستخدم
    }

    showProfile() {
        this.showMessage('سيتم فتح صفحة الملف الشخصي قريباً', 'info');
        // يمكنك إضافة منطق عرض الملف الشخصي هنا
    }

    showOrders() {
        this.showMessage('سيتم فتح صفحة الطلبات قريباً', 'info');
        // يمكنك إضافة منطق عرض الطلبات هنا
    }

    showSettings() {
        this.showMessage('سيتم فتح صفحة الإعدادات قريباً', 'info');
        // يمكنك إضافة منطق عرض الإعدادات هنا
    }

    // ... نهاية الدوال

// بدء النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});

// جعل النظام متاحاً globally
if (typeof window !== 'undefined') {
    window.AuthSystem = AuthSystem;
}


    // باقي الكود يبقى كما هو مع إضافة الأنماط المطلوبة
    addAuthModalStyles() {
        const styles = `
            .auth-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
            }
            
            .auth-modal.active {
                display: flex;
                animation: fadeIn 0.3s ease;
            }
            
            .auth-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 450px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .auth-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .auth-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .auth-form {
                display: none;
            }
            
            .auth-form.active {
                display: block;
            }
            
            .auth-form h3 {
                text-align: center;
                margin-bottom: 25px;
                color: var(--primary-color);
                font-size: 24px;
                font-weight: bold;
            }
            
            .input-group {
                margin-bottom: 15px;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .auth-btn {
                width: 100%;
                padding: 15px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: all 0.3s ease;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .auth-btn:hover {
                background: var(--secondary-color);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(162, 0, 135, 0.3);
            }
            
            .auth-switch {
                text-align: center;
                margin-top: 25px;
                color: var(--dark-color);
                font-size: 14px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
            }
            
            .switch-link {
                color: var(--primary-color);
                cursor: pointer;
                font-weight: bold;
                transition: color 0.3s ease;
            }
            
            .switch-link:hover {
                color: var(--secondary-color);
                text-decoration: underline;
            }
            
            .demo-accounts {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                border-right: 4px solid var(--info-color);
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }

            .user-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                padding: 0;
                min-width: 280px;
                z-index: 1000;
                margin-top: 8px;
                border: 2px solid var(--primary-color);
                overflow: hidden;
            }
            
            .user-header {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                padding: 20px;
                color: white;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .user-avatar {
                font-size: 40px;
                opacity: 0.9;
            }
            
            .user-details {
                flex: 1;
            }
            
            .user-details strong {
                display: block;
                font-size: 16px;
                margin-bottom: 4px;
            }
            
            .user-details small {
                font-size: 12px;
                opacity: 0.8;
            }
            
            .menu-section {
                padding: 15px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .menu-items {
                padding: 0;
            }
            
            .user-menu-item {
                display: flex;
                align-items: center;
                padding: 12px 20px;
                color: #333;
                text-decoration: none;
                border: none;
                background: none;
                width: 100%;
                text-align: right;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
                gap: 12px;
                position: relative;
                border-bottom: 1px solid #f8f8f8;
            }
            
            .user-menu-item:last-child {
                border-bottom: none;
            }
            
            .user-menu-item i {
                width: 20px;
                text-align: center;
                color: var(--primary-color);
                font-size: 16px;
            }
            
            .user-menu-item:hover {
                background: var(--light-color);
                transform: translateX(-5px);
            }
            
            .user-menu-item:hover i {
                color: var(--secondary-color);
            }
            
            .logout-btn {
                color: var(--danger-color);
                font-weight: bold;
                margin-top: 0;
            }
            
            .logout-btn i {
                color: var(--danger-color);
            }
            
            .logout-btn:hover {
                background: #ffe6e6;
            }
            
            .menu-badge {
                background: var(--secondary-color);
                color: white;
                border-radius: 12px;
                padding: 2px 8px;
                font-size: 11px;
                font-weight: bold;
                margin-right: auto;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // ... باقي الدوال تبقى كما هي

    showMessage(message, type) {
        const existingMessages = document.querySelectorAll('.system-message');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.className = `system-message ${type}`;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            z-index: 10001;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            ${type === 'success' ? 
                'background: var(--success-color);' : 
                type === 'error' ? 
                'background: var(--danger-color);' :
                type === 'info' ?
                'background: var(--info-color);' :
                'background: var(--primary-color);'
            }
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 4000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// بدء النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});

// جعل النظام متاحاً globally
if (typeof window !== 'undefined') {
    window.AuthSystem = AuthSystem;
}*/












// نظام المصادقة والملف الشخصي المتكامل - يدعم التسجيل العادي وقاعدة البيانات
/*class AuthSystem {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 بدء نظام المصادقة...');
        this.setCustomColors();
        this.createAuthModal();
        this.createProfileModal();
        this.setupUserIconListener();
        this.setupModalEvents();
        this.checkAuthStatus();
        this.setupAdminPanel();
    }

    setCustomColors() {
        const styles = `
            :root {
                --primary-color: #ea70b1;
                --secondary-color: #a20087;
                --light-color: #f8f9fa;
                --dark-color: #343a40;
                --success-color: #28a745;
                --danger-color: #dc3545;
                --warning-color: #ffc107;
                --info-color: #17a2b8;
            }
            
            .auth-primary { background-color: var(--primary-color) !important; }
            .auth-secondary { background-color: var(--secondary-color) !important; }
            .auth-success { background-color: var(--success-color) !important; }
            .auth-info { background-color: var(--info-color) !important; }
            
            .auth-primary:hover { background-color: var(--secondary-color) !important; }
            .auth-success:hover { background-color: #218838 !important; }
            .auth-info:hover { background-color: #138496 !important; }
            
            .text-primary { color: var(--primary-color) !important; }
            .text-secondary { color: var(--secondary-color) !important; }
            .text-success { color: var(--success-color) !important; }
            .text-danger { color: var(--danger-color) !important; }
            .text-info { color: var(--info-color) !important; }
            
            .registration-badge {
                display: inline-block;
                padding: 3px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: bold;
                margin-right: 8px;
            }
            
            .badge-system { background: var(--info-color); color: white; }
            .badge-manual { background: var(--success-color); color: white; }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupUserIconListener() {
        const userIcons = document.querySelectorAll('.fa-solid.fa-user, .user-icon');
        
        if (userIcons.length > 0) {
            userIcons.forEach(icon => {
                const button = icon.closest('button') || icon;
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('✅ تم النقر على أيقونة المستخدم');
                    this.handleUserClick(button);
                });
            });
        } else {
            console.error('❌ لم يتم العثور على أيقونة المستخدم!');
            this.createUserIcon();
        }
    }

    createUserIcon() {
        const userIcon = document.createElement('button');
        userIcon.className = 'user-icon';
        userIcon.innerHTML = '<i class="fa-solid fa-user"></i>';
        userIcon.style.cssText = `
            background: #f0f0f0;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            margin-left: 10px;
        `;
        
        document.querySelector('.header')?.appendChild(userIcon);
        this.setupUserIconListener();
    }

    handleUserClick(element) {
        if (this.isLoggedIn()) {
            this.showUserMenu(element);
        } else {
            this.showAuthModal();
        }
    }

    showUserMenu(icon) {
        const oldMenu = document.querySelector('.user-menu');
        if (oldMenu) oldMenu.remove();
        
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const registrationType = userData.registration_type || 'manual';
        const badgeText = registrationType === 'system' ? 'نظام' : 'عادي';
        const badgeClass = registrationType === 'system' ? 'badge-system' : 'badge-manual';
        
        const menuHTML = `
            <div class="user-menu">
                <div class="user-header">
                    <div class="user-avatar">
                        <i class="fa-solid fa-user-circle"></i>
                    </div>
                    <div class="user-details">
                        <strong>${userData.full_name || userData.name || 'مستخدم'}</strong>
                        <small>${userData.email || ''}</small>
                        <div style="margin-top: 5px;">
                            <span class="registration-badge ${badgeClass}">${badgeText}</span>
                            <small>مسجل منذ ${this.formatJoinDate(userData.created_at)}</small>
                        </div>
                    </div>
                </div>
                
                <div class="menu-section">
                    <div class="menu-items">
                        <button class="user-menu-item" onclick="authSystem.showProfile()">
                            <i class="fa-solid fa-user"></i>
                            حسابي
                        </button>
                        <button class="user-menu-item" onclick="authSystem.showOrders()">
                            <i class="fa-solid fa-box"></i>
                            الطلبات
                            <span class="menu-badge" id="ordersCount">0</span>
                        </button>
                        <button class="user-menu-item" onclick="authSystem.showSettings()">
                            <i class="fa-solid fa-cog"></i>
                            الإعدادات
                        </button>
                        ${this.isAdminUser() ? `
                        <button class="user-menu-item" onclick="authSystem.showAdminPanel()">
                            <i class="fa-solid fa-users-cog"></i>
                            لوحة التحكم
                        </button>
                        ` : ''}
                    </div>
                </div>
                
                <div class="menu-items">
                    <button class="user-menu-item logout-btn" onclick="authSystem.handleLogout()">
                        <i class="fa-solid fa-right-from-bracket"></i>
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        `;
        
        const iconContainer = icon.closest('button') || icon;
        const container = iconContainer.parentNode;
        container.style.position = 'relative';
        container.insertAdjacentHTML('beforeend', menuHTML);
        
        const menu = container.querySelector('.user-menu');
        
        this.updateMenuCounts();
        
        setTimeout(() => {
            menu.style.display = 'block';
        }, 10);
        
        const closeMenu = (e) => {
            if (menu && !menu.contains(e.target) && !icon.contains(e.target)) {
                menu.style.display = 'none';
                document.removeEventListener('click', closeMenu);
                setTimeout(() => {
                    if (menu.parentNode) {
                        menu.remove();
                    }
                }, 300);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 10);
    }

    formatJoinDate(dateString) {
        if (!dateString) return 'فترة';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'يوم';
        if (diffDays < 30) return `${diffDays} يوم`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} شهر`;
        return `${Math.floor(diffDays / 365)} سنة`;
    }

    isAdminUser() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        return userData.email && (userData.email.includes('admin') || userData.registration_type === 'system');
    }

    async updateMenuCounts() {
        if (!this.isLoggedIn()) return;

        try {
            const response = await fetch('profile.php?action=get_user_stats');
            
            if (!response.ok) {
                throw new Error(`خطأ في الشبكة: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                const ordersCount = document.getElementById('ordersCount');
                if (ordersCount) {
                    ordersCount.textContent = data.data.orders_count || 0;
                }
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الإحصائيات:', error);
            const ordersCount = document.getElementById('ordersCount');
            if (ordersCount) {
                ordersCount.textContent = '0';
            }
        }
    }

    createAuthModal() {
        if (!document.getElementById('authModal')) {
            const modalHTML = `
                <div class="auth-modal" id="authModal">
                    <div class="auth-content">
                        <button class="auth-close" id="authClose">×</button>
                        
                        <div class="auth-form active" id="loginForm">
                            <h3 class="text-primary">تسجيل الدخول</h3>
                            <div class="demo-accounts">
                                <h4><i class="fa-solid fa-key"></i> حسابات تجريبية:</h4>
                                <div class="demo-accounts-list">
                                    <div><strong>ahmed@example.com</strong> / password123</div>
                                    <div><strong>fatima@example.com</strong> / password123</div>
                                    <small>أو سجل حساب جديد أدناه</small>
                                </div>
                            </div>
                            <form id="loginFormElement">
                                <div class="input-group">
                                    <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                                </div>
                                <div class="input-group">
                                    <input type="password" name="password" placeholder="كلمة المرور" required>
                                </div>
                                <button type="submit" class="auth-btn auth-primary">
                                    <i class="fa-solid fa-right-to-bracket"></i>
                                    تسجيل الدخول
                                </button>
                            </form>
                            <div class="auth-switch">
                                ليس لديك حساب؟ 
                                <span class="switch-link text-primary" id="showRegister">إنشاء حساب جديد</span>
                            </div>
                        </div>
                        
                        <div class="auth-form" id="registerForm">
                            <h3 class="text-primary">إنشاء حساب جديد</h3>
                            <p class="register-info">
                                <i class="fa-solid fa-user-plus"></i> سجل بياناتك وسيتم حفظها في قاعدة البيانات
                            </p>
                            <form id="registerFormElement">
                                <div class="input-group">
                                    <input type="text" name="fullname" placeholder="الاسم الكامل" required>
                                </div>
                                <div class="input-group">
                                    <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                                </div>
                                <div class="input-group">
                                    <input type="password" name="password" placeholder="كلمة المرور" required>
                                    <small class="password-hint">كلمة المرور يجب أن تكون 6 أحرف على الأقل</small>
                                </div>
                                <div class="input-group">
                                    <input type="password" name="confirm_password" placeholder="تأكيد كلمة المرور" required>
                                </div>
                                <div class="input-group">
                                    <input type="tel" name="phone" placeholder="رقم الهاتف (اختياري)">
                                </div>
                                <div class="input-group">
                                    <input type="date" name="birth_date" placeholder="تاريخ الميلاد">
                                </div>
                                <div class="input-group">
                                    <textarea name="address" placeholder="العنوان" rows="3"></textarea>
                                </div>
                                <button type="submit" class="auth-btn auth-primary">
                                    <i class="fa-solid fa-user-plus"></i>
                                    إنشاء حساب
                                </button>
                            </form>
                            <div class="auth-switch">
                                لديك حساب بالفعل؟ 
                                <span class="switch-link text-primary" id="showLogin">تسجيل الدخول</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            this.addAuthModalStyles();
        }
    }

    createProfileModal() {
        if (!document.getElementById('profileModal')) {
            const modalHTML = `
                <div class="profile-modal" id="profileModal">
                    <div class="profile-content">
                        <button class="profile-close" id="profileClose">×</button>
                        
                        <div class="profile-header">
                            <div class="profile-avatar">
                                <i class="fa-solid fa-user-circle"></i>
                            </div>
                            <div class="profile-info">
                                <h3 class="text-primary" id="profileName">الاسم الكامل</h3>
                                <p id="profileEmail">البريد الإلكتروني</p>
                                <div class="profile-badges">
                                    <span class="registration-badge" id="profileBadge">عادي</span>
                                    <span class="join-date" id="profileJoinDate">مسجل منذ 0 يوم</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="profile-body">
                            <form id="profileForm">
                                <div class="form-section">
                                    <h4><i class="fa-solid fa-user"></i> المعلومات الشخصية</h4>
                                    <div class="input-row">
                                        <div class="input-group">
                                            <label>الاسم الكامل</label>
                                            <input type="text" name="full_name" id="profileFullName" required>
                                        </div>
                                        <div class="input-group">
                                            <label>البريد الإلكتروني</label>
                                            <input type="email" name="email" id="profileEmailInput" readonly>
                                            <small class="text-muted">لا يمكن تعديل البريد الإلكتروني</small>
                                        </div>
                                    </div>
                                    
                                    <div class="input-row">
                                        <div class="input-group">
                                            <label>رقم الهاتف</label>
                                            <input type="tel" name="phone" id="profilePhone">
                                        </div>
                                        <div class="input-group">
                                            <label>تاريخ الميلاد</label>
                                            <input type="date" name="birth_date" id="profileBirthDate">
                                        </div>
                                    </div>
                                    
                                    <div class="input-group">
                                        <label>العنوان</label>
                                        <textarea name="address" id="profileAddress" rows="3" placeholder="العنوان الكامل"></textarea>
                                    </div>
                                </div>
                                
                                <div class="form-section">
                                    <h4><i class="fa-solid fa-lock"></i> تغيير كلمة المرور</h4>
                                    <div class="input-row">
                                        <div class="input-group">
                                            <label>كلمة المرور الحالية</label>
                                            <input type="password" name="current_password" placeholder="أدخل كلمة المرور الحالية">
                                        </div>
                                        <div class="input-group">
                                            <label>كلمة المرور الجديدة</label>
                                            <input type="password" name="new_password" placeholder="كلمة المرور الجديدة">
                                        </div>
                                    </div>
                                    <div class="input-group">
                                        <label>تأكيد كلمة المرور الجديدة</label>
                                        <input type="password" name="confirm_new_password" placeholder="تأكيد كلمة المرور الجديدة">
                                    </div>
                                    <small class="text-muted">اترك الحقول فارغة إذا لم ترد تغيير كلمة المرور</small>
                                </div>
                                
                                <div class="profile-actions">
                                    <button type="submit" class="auth-btn auth-primary">
                                        <i class="fa-solid fa-save"></i>
                                        حفظ التغييرات
                                    </button>
                                    <button type="button" class="auth-btn auth-secondary" onclick="authSystem.hideProfileModal()">
                                        <i class="fa-solid fa-times"></i>
                                        إلغاء
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            this.addProfileModalStyles();
        }
    }

    setupModalEvents() {
        // أحداث التبديل بين النماذج
        document.getElementById('showRegister')?.addEventListener('click', () => {
            this.showRegisterForm();
        });
        
        document.getElementById('showLogin')?.addEventListener('click', () => {
            this.showLoginForm();
        });
        
        // أحداث الإغلاق
        document.getElementById('authClose')?.addEventListener('click', () => {
            this.hideAuthModal();
        });
        
        document.getElementById('profileClose')?.addEventListener('click', () => {
            this.hideProfileModal();
        });
        
        // أحداث النماذج
        document.getElementById('loginFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e);
        });
        
        document.getElementById('registerFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e);
        });
        
        document.getElementById('profileForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProfileUpdate(e);
        });
        
        // إغلاق النوافذ عند النقر خارجها
        document.getElementById('authModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'authModal') {
                this.hideAuthModal();
            }
        });
        
        document.getElementById('profileModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'profileModal') {
                this.hideProfileModal();
            }
        });
    }

    showAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.add('active');
            this.showLoginForm();
        }
    }

    hideAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    showProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            this.loadProfileData();
            modal.classList.add('active');
        }
    }

    hideProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    showLoginForm() {
        document.getElementById('loginForm').classList.add('active');
        document.getElementById('registerForm').classList.remove('active');
    }

    showRegisterForm() {
        document.getElementById('registerForm').classList.add('active');
        document.getElementById('loginForm').classList.remove('active');
    }

    async handleLogin(e) {
        const formData = new FormData(e.target);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        
        try {
            const response = await fetch('auth.php?action=login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('userData', JSON.stringify(result.user));
                this.showMessage('تم تسجيل الدخول بنجاح!', 'success');
                this.hideAuthModal();
                this.checkAuthStatus();
                this.setupAdminPanel();
                
                // إعادة تحميل الصفحة لتحديث الواجهة
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                this.showMessage(result.message || 'فشل تسجيل الدخول', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تسجيل الدخول:', error);
            this.showMessage('حدث خطأ أثناء تسجيل الدخول', 'error');
        }
    }

    async handleRegister(e) {
        const formData = new FormData(e.target);
        const data = {
            full_name: formData.get('fullname'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirm_password: formData.get('confirm_password'),
            phone: formData.get('phone'),
            birth_date: formData.get('birth_date'),
            address: formData.get('address')
        };
        
        if (data.password !== data.confirm_password) {
            this.showMessage('كلمات المرور غير متطابقة', 'error');
            return;
        }
        
        if (data.password.length < 6) {
            this.showMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }
        
        try {
            const response = await fetch('auth.php?action=register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showMessage('تم إنشاء الحساب بنجاح!', 'success');
                this.showLoginForm();
                
                const emailInput = document.querySelector('#loginForm input[name="email"]');
                if (emailInput) {
                    emailInput.value = data.email;
                }
            } else {
                this.showMessage(result.message || 'فشل إنشاء الحساب', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في إنشاء الحساب:', error);
            this.showMessage('حدث خطأ أثناء إنشاء الحساب', 'error');
        }
    }

    async handleProfileUpdate(e) {
        const formData = new FormData(e.target);
        const data = {
            full_name: formData.get('full_name'),
            phone: formData.get('phone'),
            birth_date: formData.get('birth_date'),
            address: formData.get('address'),
            current_password: formData.get('current_password'),
            new_password: formData.get('new_password'),
            confirm_new_password: formData.get('confirm_new_password')
        };
        
        // التحقق من كلمات المرور إذا تم إدخالها
        if (data.new_password) {
            if (!data.current_password) {
                this.showMessage('يجب إدخال كلمة المرور الحالية', 'error');
                return;
            }
            
            if (data.new_password !== data.confirm_new_password) {
                this.showMessage('كلمات المرور الجديدة غير متطابقة', 'error');
                return;
            }
            
            if (data.new_password.length < 6) {
                this.showMessage('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل', 'error');
                return;
            }
        }
        
        try {
            const response = await fetch('profile.php?action=update_profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showMessage('تم تحديث البيانات بنجاح!', 'success');
                
                // تحديث بيانات المستخدم في localStorage
                if (result.user) {
                    localStorage.setItem('userData', JSON.stringify(result.user));
                    this.checkAuthStatus();
                }
                
                this.hideProfileModal();
            } else {
                this.showMessage(result.message || 'فشل تحديث البيانات', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الملف الشخصي:', error);
            this.showMessage('حدث خطأ أثناء تحديث البيانات', 'error');
        }
    }

    loadProfileData() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        // تعبئة بيانات النموذج
        document.getElementById('profileName').textContent = userData.full_name || 'مستخدم';
        document.getElementById('profileEmail').textContent = userData.email || '';
        document.getElementById('profileFullName').value = userData.full_name || '';
        document.getElementById('profileEmailInput').value = userData.email || '';
        document.getElementById('profilePhone').value = userData.phone || '';
        document.getElementById('profileBirthDate').value = userData.birth_date || '';
        document.getElementById('profileAddress').value = userData.address || '';
        
        // تحديث البادجات
        const badge = document.getElementById('profileBadge');
        if (badge) {
            badge.textContent = userData.registration_type === 'system' ? 'نظام' : 'عادي';
            badge.className = `registration-badge ${userData.registration_type === 'system' ? 'badge-system' : 'badge-manual'}`;
        }
        
        // تحديث تاريخ التسجيل
        const joinDate = document.getElementById('profileJoinDate');
        if (joinDate) {
            joinDate.textContent = `مسجل منذ ${this.formatJoinDate(userData.created_at)}`;
        }
    }

    handleLogout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        this.showMessage('تم تسجيل الخروج بنجاح', 'success');
        this.checkAuthStatus();
        
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    isLoggedIn() {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        return !!(token && userData);
    }

    checkAuthStatus() {
        if (this.isLoggedIn()) {
            console.log('✅ المستخدم مسجل الدخول');
            this.updateUserInterface();
        } else {
            console.log('❌ المستخدم غير مسجل الدخول');
        }
    }

    updateUserInterface() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        console.log('🔄 تحديث واجهة المستخدم:', userData);
        
        // تحديث أي عناصر واجهة إضافية هنا
    }

    showProfile() {
        this.showProfileModal();
    }

    showOrders() {
        this.showMessage('سيتم فتح صفحة الطلبات قريباً', 'info');
    }

    showSettings() {
        this.showMessage('سيتم فتح صفحة الإعدادات قريباً', 'info');
    }

    setupAdminPanel() {
        // إضافة زر لوحة التحكم إذا كان المستخدم مسؤولاً
        if (this.isAdminUser()) {
            const existingAdminBtn = document.querySelector('.admin-btn');
            if (existingAdminBtn) {
                existingAdminBtn.remove();
            }
            
            const adminBtn = document.createElement('button');
            adminBtn.className = 'admin-btn';
            adminBtn.innerHTML = '<i class="fa-solid fa-users-cog"></i>';
            adminBtn.title = 'لوحة التحكم';
            adminBtn.style.cssText = `
                background: var(--info-color);
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-left: 10px;
                transition: all 0.3s ease;
            `;
            
            adminBtn.addEventListener('click', () => {
                this.showAdminPanel();
            });
            
            document.querySelector('.header')?.appendChild(adminBtn);
        }
    }

    async showAdminPanel() {
        try {
            const response = await fetch('auth.php?action=get_all_users');
            const data = await response.json();
            
            if (data.success) {
                this.showUsersModal(data.users);
            } else {
                this.showMessage(data.message, 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في جلب بيانات المستخدمين:', error);
            this.showMessage('حدث خطأ في جلب البيانات', 'error');
        }
    }

    showUsersModal(users) {
        const usersHTML = users.map(user => `
            <div class="user-item">
                <div class="user-info">
                    <div class="user-main">
                        <strong>${this.escapeHtml(user.full_name)}</strong>
                        <span class="registration-badge ${user.registration_type === 'system' ? 'badge-system' : 'badge-manual'}">
                            ${user.registration_type === 'system' ? 'نظام' : 'عادي'}
                        </span>
                    </div>
                    <div class="user-details">
                        <small><i class="fa-solid fa-envelope"></i> ${this.escapeHtml(user.email)}</small>
                        <small><i class="fa-solid fa-phone"></i> ${user.phone || 'غير محدد'}</small>
                        <small><i class="fa-solid fa-calendar"></i> ${new Date(user.created_at).toLocaleDateString('ar-SA')}</small>
                    </div>
                </div>
            </div>
        `).join('');

        const modalHTML = `
            <div class="admin-modal active">
                <div class="admin-content">
                    <button class="admin-close" onclick="this.closest('.admin-modal').remove()">×</button>
                    <h3 class="text-info"><i class="fa-solid fa-users-cog"></i> لوحة التحكم - إدارة المستخدمين</h3>
                    
                    <div class="stats">
                        <div class="stat-card system-users">
                            <div class="stat-number">${users.length}</div>
                            <div class="stat-label">إجمالي المستخدمين</div>
                        </div>
                        <div class="stat-card manual-users">
                            <div class="stat-number">${users.filter(u => u.registration_type === 'manual').length}</div>
                            <div class="stat-label">مستخدمين عاديين</div>
                        </div>
                        <div class="stat-card registered-users">
                            <div class="stat-number">${users.filter(u => u.registration_type === 'system').length}</div>
                            <div class="stat-label">مستخدمين نظام</div>
                        </div>
                    </div>
                    
                    <div class="users-list">
                        ${usersHTML}
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addAdminModalStyles();
    }

    showMessage(message, type) {
        const existingMessages = document.querySelectorAll('.system-message');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.className = `system-message ${type}`;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            z-index: 10001;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            ${type === 'success' ? 
                'background: var(--success-color);' : 
                type === 'error' ? 
                'background: var(--danger-color);' :
                type === 'info' ?
                'background: var(--info-color);' :
                'background: var(--primary-color);'
            }
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 4000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    addAuthModalStyles() {
        const styles = `
            .auth-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
            }
            
            .auth-modal.active {
                display: flex;
                animation: fadeIn 0.3s ease;
            }
            
            .auth-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 450px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .auth-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .auth-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .auth-form {
                display: none;
            }
            
            .auth-form.active {
                display: block;
            }
            
            .auth-form h3 {
                text-align: center;
                margin-bottom: 25px;
                color: var(--primary-color);
                font-size: 24px;
                font-weight: bold;
            }
            
            .demo-accounts {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                border-right: 4px solid var(--info-color);
            }
            
            .demo-accounts h4 {
                margin: 0 0 10px 0;
                color: var(--info-color);
                font-size: 14px;
            }
            
            .demo-accounts-list {
                font-size: 12px;
                line-height: 1.5;
            }
            
            .register-info {
                text-align: center;
                color: #666;
                margin-bottom: 20px;
                font-size: 14px;
            }
            
            .input-group {
                margin-bottom: 15px;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .password-hint {
                color: #666;
                display: block;
                margin-top: 5px;
                font-size: 12px;
            }
            
            .auth-btn {
                width: 100%;
                padding: 15px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: all 0.3s ease;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .auth-btn:hover {
                background: var(--secondary-color);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(162, 0, 135, 0.3);
            }
            
            .auth-switch {
                text-align: center;
                margin-top: 25px;
                color: var(--dark-color);
                font-size: 14px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
            }
            
            .switch-link {
                color: var(--primary-color);
                cursor: pointer;
                font-weight: bold;
                transition: color 0.3s ease;
            }
            
            .switch-link:hover {
                color: var(--secondary-color);
                text-decoration: underline;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }

            .user-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                padding: 0;
                min-width: 280px;
                z-index: 1000;
                margin-top: 8px;
                border: 2px solid var(--primary-color);
                overflow: hidden;
                display: none;
            }
            
            .user-header {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                padding: 20px;
                color: white;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .user-avatar {
                font-size: 40px;
                opacity: 0.9;
            }
            
            .user-details {
                flex: 1;
            }
            
            .user-details strong {
                display: block;
                font-size: 16px;
                margin-bottom: 4px;
            }
            
            .user-details small {
                font-size: 12px;
                opacity: 0.8;
            }
            
            .menu-section {
                padding: 15px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .menu-items {
                padding: 0;
            }
            
            .user-menu-item {
                display: flex;
                align-items: center;
                padding: 12px 20px;
                color: #333;
                text-decoration: none;
                border: none;
                background: none;
                width: 100%;
                text-align: right;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
                gap: 12px;
                position: relative;
                border-bottom: 1px solid #f8f8f8;
            }
            
            .user-menu-item:last-child {
                border-bottom: none;
            }
            
            .user-menu-item i {
                width: 20px;
                text-align: center;
                color: var(--primary-color);
                font-size: 16px;
            }
            
            .user-menu-item:hover {
                background: var(--light-color);
                transform: translateX(-5px);
            }
            
            .user-menu-item:hover i {
                color: var(--secondary-color);
            }
            
            .logout-btn {
                color: var(--danger-color);
                font-weight: bold;
                margin-top: 0;
            }
            
            .logout-btn i {
                color: var(--danger-color);
            }
            
            .logout-btn:hover {
                background: #ffe6e6;
            }
            
            .menu-badge {
                background: var(--secondary-color);
                color: white;
                border-radius: 12px;
                padding: 2px 8px;
                font-size: 11px;
                font-weight: bold;
                margin-right: auto;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    addProfileModalStyles() {
        const styles = `
            .profile-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
            }
            
            .profile-modal.active {
                display: flex;
                animation: fadeIn 0.3s ease;
            }
            
            .profile-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 700px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .profile-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .profile-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .profile-header {
                display: flex;
                align-items: center;
                gap: 20px;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #f0f0f0;
            }
            
            .profile-avatar {
                font-size: 60px;
                color: var(--primary-color);
            }
            
            .profile-info h3 {
                margin: 0 0 5px 0;
                color: var(--primary-color);
            }
            
            .profile-info p {
                margin: 0 0 10px 0;
                color: #666;
            }
            
            .profile-badges {
                display: flex;
                gap: 10px;
                align-items: center;
            }
            
            .join-date {
                font-size: 12px;
                color: #888;
                background: #f8f9fa;
                padding: 3px 8px;
                border-radius: 12px;
            }
            
            .profile-body {
                margin-top: 20px;
            }
            
            .form-section {
                margin-bottom: 30px;
                padding: 20px;
                border: 1px solid #e0e0e0;
                border-radius: 10px;
                background: #fafafa;
            }
            
            .form-section h4 {
                margin: 0 0 20px 0;
                color: var(--primary-color);
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .input-row {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
            }
            
            .input-row .input-group {
                flex: 1;
            }
            
            .input-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #333;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .input-group input[readonly] {
                background-color: #f8f9fa;
                color: #666;
                cursor: not-allowed;
            }
            
            .text-muted {
                color: #666;
                font-size: 12px;
                display: block;
                margin-top: 5px;
            }
            
            .profile-actions {
                display: flex;
                gap: 15px;
                margin-top: 30px;
            }
            
            .profile-actions .auth-btn {
                flex: 1;
                margin-bottom: 0;
            }
            
            .auth-secondary {
                background: #6c757d !important;
            }
            
            .auth-secondary:hover {
                background: #5a6268 !important;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    addAdminModalStyles() {
        const styles = `
            .admin-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                display: none;
                align-items: center;
                justify-content: center;
            }
            
            .admin-modal.active {
                display: flex;
            }
            
            .admin-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 800px;
                position: relative;
                max-height: 80vh;
                overflow-y: auto;
            }
            
            .admin-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--info-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .admin-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .stats {
                display: flex;
                gap: 15px;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }
            
            .stat-card {
                color: white;
                padding: 15px;
                border-radius: 8px;
                flex: 1;
                min-width: 120px;
                text-align: center;
            }
            
            .system-users { background: var(--info-color); }
            .manual-users { background: var(--success-color); }
            .registered-users { background: var(--primary-color); }
            
            .stat-number {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 5px;
            }
            
            .stat-label {
                font-size: 12px;
            }
            
            .user-item {
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 10px;
                background: #fafafa;
            }
            
            .user-main {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }
            
            .user-details {
                display: flex;
                gap: 15px;
                flex-wrap: wrap;
            }
            
            .user-details small {
                display: flex;
                align-items: center;
                gap: 5px;
                color: #666;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// بدء النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});

// جعل النظام متاحاً globally
if (typeof window !== 'undefined') {
    window.AuthSystem = AuthSystem;
}*/
































/*// نظام المصادقة والملف الشخصي المتكامل - يدعم التسجيل العادي وقاعدة البيانات// 
 class AuthSystem {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 بدء نظام المصادقة...');
        this.setCustomColors();
        this.createAuthModal();
        this.createProfileModal();
        this.setupUserIconListener();
        this.setupModalEvents();
        this.checkAuthStatus();
    }

    setCustomColors() {
        const styles = `
            :root {
                --primary-color: #ea70b1;
                --secondary-color: #a20087;
                --light-color: #f8f9fa;
                --dark-color: #343a40;
                --success-color: #28a745;
                --danger-color: #dc3545;
                --warning-color: #ffc107;
                --info-color: #17a2b8;
            }
            
            .auth-primary { background-color: var(--primary-color) !important; }
            .auth-secondary { background-color: var(--secondary-color) !important; }
            .auth-success { background-color: var(--success-color) !important; }
            .auth-info { background-color: var(--info-color) !important; }
            
            .auth-primary:hover { background-color: var(--secondary-color) !important; }
            .auth-success:hover { background-color: #218838 !important; }
            .auth-info:hover { background-color: #138496 !important; }
            
            .text-primary { color: var(--primary-color) !important; }
            .text-secondary { color: var(--secondary-color) !important; }
            .text-success { color: var(--success-color) !important; }
            .text-danger { color: var(--danger-color) !important; }
            .text-info { color: var(--info-color) !important; }
            
            .registration-badge {
                display: inline-block;
                padding: 3px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: bold;
                margin-right: 8px;
            }
            
            .badge-system { background: var(--info-color); color: white; }
            .badge-manual { background: var(--success-color); color: white; }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupUserIconListener() {
        const userIcons = document.querySelectorAll('.fa-solid.fa-user, .user-icon');
        
        if (userIcons.length > 0) {
            userIcons.forEach(icon => {
                const button = icon.closest('button') || icon;
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('✅ تم النقر على أيقونة المستخدم');
                    this.handleUserClick(button);
                });
            });
        } else {
            console.error('❌ لم يتم العثور على أيقونة المستخدم!');
            this.createUserIcon();
        }
    }

    createUserIcon() {
        const userIcon = document.createElement('button');
        userIcon.className = 'user-icon';
        userIcon.innerHTML = '<i class="fa-solid fa-user"></i>';
        userIcon.style.cssText = `
            background: #f0f0f0;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            margin-left: 10px;
        `;
        
        document.querySelector('.header')?.appendChild(userIcon);
        this.setupUserIconListener();
    }

    handleUserClick(element) {
        if (this.isLoggedIn()) {
            this.showUserMenu(element);
        } else {
            this.showAuthModal();
        }
    }

    showUserMenu(icon) {
        const oldMenu = document.querySelector('.user-menu');
        if (oldMenu) oldMenu.remove();
        
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const registrationType = userData.registration_type || 'manual';
        const badgeText = registrationType === 'system' ? 'نظام' : 'عادي';
        const badgeClass = registrationType === 'system' ? 'badge-system' : 'badge-manual';
        
        const menuHTML = `
            <div class="user-menu">
                <div class="user-header">
                    <div class="user-avatar">
                        <i class="fa-solid fa-user-circle"></i>
                    </div>
                    <div class="user-details">
                        <strong>${userData.full_name || userData.name || 'مستخدم'}</strong>
                        <small>${userData.email || ''}</small>
                        <div style="margin-top: 5px;">
                            <span class="registration-badge ${badgeClass}">${badgeText}</span>
                            <small>مسجل منذ ${this.formatJoinDate(userData.created_at)}</small>
                        </div>
                    </div>
                </div>
                
                <div class="menu-section">
                    <div class="menu-items">
                        <button class="user-menu-item" onclick="authSystem.showProfile()">
                            <i class="fa-solid fa-user"></i>
                            حسابي
                        </button>
                        <button class="user-menu-item" onclick="authSystem.showOrders()">
                            <i class="fa-solid fa-box"></i>
                            الطلبات
                            <span class="menu-badge" id="ordersCount">0</span>
                        </button>
                    </div>
                </div>
                
                <div class="menu-items">
                    <button class="user-menu-item logout-btn" onclick="authSystem.handleLogout()">
                        <i class="fa-solid fa-right-from-bracket"></i>
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        `;
        
        const iconContainer = icon.closest('button') || icon;
        const container = iconContainer.parentNode;
        container.style.position = 'relative';
        container.insertAdjacentHTML('beforeend', menuHTML);
        
        const menu = container.querySelector('.user-menu');
        
        this.updateMenuCounts();
        
        setTimeout(() => {
            menu.style.display = 'block';
        }, 10);
        
        const closeMenu = (e) => {
            if (menu && !menu.contains(e.target) && !icon.contains(e.target)) {
                menu.style.display = 'none';
                document.removeEventListener('click', closeMenu);
                setTimeout(() => {
                    if (menu.parentNode) {
                        menu.remove();
                    }
                }, 300);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 10);
    }

    formatJoinDate(dateString) {
        if (!dateString) return 'فترة';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'يوم';
        if (diffDays < 30) return `${diffDays} يوم`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} شهر`;
        return `${Math.floor(diffDays / 365)} سنة`;
    }

    async updateMenuCounts() {
        if (!this.isLoggedIn()) return;

        try {
            const response = await fetch('profile.php?action=get_user_stats');
            
            if (!response.ok) {
                throw new Error(`خطأ في الشبكة: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                const ordersCount = document.getElementById('ordersCount');
                if (ordersCount) {
                    ordersCount.textContent = data.data.orders_count || 0;
                }
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الإحصائيات:', error);
            const ordersCount = document.getElementById('ordersCount');
            if (ordersCount) {
                ordersCount.textContent = '0';
            }
        }
    }

    createAuthModal() {
        if (!document.getElementById('authModal')) {
            const modalHTML = `
                <div class="auth-modal" id="authModal">
                    <div class="auth-content">
                        <button class="auth-close" id="authClose">×</button>
                        
                        <div class="auth-form active" id="loginForm">
                            <h3 class="text-primary">تسجيل الدخول</h3>
                            <div class="demo-accounts">
                                <h4><i class="fa-solid fa-key"></i> حسابات تجريبية:</h4>
                                <div class="demo-accounts-list">
                                    <div><strong>ahmed@example.com</strong> / password123</div>
                                    <div><strong>fatima@example.com</strong> / password123</div>
                                    <small>أو سجل حساب جديد أدناه</small>
                                </div>
                            </div>
                            <form id="loginFormElement">
                                <div class="input-group">
                                    <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                                </div>
                                <div class="input-group">
                                    <input type="password" name="password" placeholder="كلمة المرور" required>
                                </div>
                                <button type="submit" class="auth-btn auth-primary">
                                    <i class="fa-solid fa-right-to-bracket"></i>
                                    تسجيل الدخول
                                </button>
                            </form>
                            <div class="auth-switch">
                                ليس لديك حساب؟ 
                                <span class="switch-link text-primary" id="showRegister">إنشاء حساب جديد</span>
                            </div>
                        </div>
                        
                        <div class="auth-form" id="registerForm">
                            <h3 class="text-primary">إنشاء حساب جديد</h3>
                            <p class="register-info">
                                <i class="fa-solid fa-user-plus"></i> سجل بياناتك وسيتم حفظها في قاعدة البيانات
                            </p>
                            <form id="registerFormElement">
                                <div class="input-group">
                                    <input type="text" name="fullname" placeholder="الاسم الكامل" required>
                                </div>
                                <div class="input-group">
                                    <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                                </div>
                                <div class="input-group">
                                    <input type="password" name="password" placeholder="كلمة المرور" required>
                                    <small class="password-hint">كلمة المرور يجب أن تكون 6 أحرف على الأقل</small>
                                </div>
                                <div class="input-group">
                                    <input type="password" name="confirm_password" placeholder="تأكيد كلمة المرور" required>
                                </div>
                                <div class="input-group">
                                    <input type="tel" name="phone" placeholder="رقم الهاتف (اختياري)">
                                </div>
                                <div class="input-group">
                                    <input type="date" name="birth_date" placeholder="تاريخ الميلاد">
                                </div>
                                <div class="input-group">
                                    <textarea name="address" placeholder="العنوان" rows="3"></textarea>
                                </div>
                                <button type="submit" class="auth-btn auth-primary">
                                    <i class="fa-solid fa-user-plus"></i>
                                    إنشاء حساب
                                </button>
                            </form>
                            <div class="auth-switch">
                                لديك حساب بالفعل؟ 
                                <span class="switch-link text-primary" id="showLogin">تسجيل الدخول</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            this.addAuthModalStyles();
        }
    }

    createProfileModal() {
        if (!document.getElementById('profileModal')) {
            const modalHTML = `
                <div class="profile-modal" id="profileModal">
                    <div class="profile-content">
                        <button class="profile-close" id="profileClose">×</button>
                        
                        <div class="profile-header">
                            <div class="profile-avatar">
                                <i class="fa-solid fa-user-circle"></i>
                            </div>
                            <div class="profile-info">
                                <h3 class="text-primary" id="profileName">الاسم الكامل</h3>
                                <p id="profileEmail">البريد الإلكتروني</p>
                                <div class="profile-badges">
                                    <span class="registration-badge" id="profileBadge">عادي</span>
                                    <span class="join-date" id="profileJoinDate">مسجل منذ 0 يوم</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="profile-body">
                            <form id="profileForm">
                                <div class="form-section">
                                    <h4><i class="fa-solid fa-user"></i> المعلومات الشخصية</h4>
                                    <div class="input-row">
                                        <div class="input-group">
                                            <label>الاسم الكامل</label>
                                            <input type="text" name="full_name" id="profileFullName" required>
                                        </div>
                                        <div class="input-group">
                                            <label>البريد الإلكتروني</label>
                                            <input type="email" name="email" id="profileEmailInput" readonly>
                                            <small class="text-muted">لا يمكن تعديل البريد الإلكتروني</small>
                                        </div>
                                    </div>
                                    
                                    <div class="input-row">
                                        <div class="input-group">
                                            <label>رقم الهاتف</label>
                                            <input type="tel" name="phone" id="profilePhone">
                                        </div>
                                        <div class="input-group">
                                            <label>تاريخ الميلاد</label>
                                            <input type="date" name="birth_date" id="profileBirthDate">
                                        </div>
                                    </div>
                                    
                                    <div class="input-group">
                                        <label>العنوان</label>
                                        <textarea name="address" id="profileAddress" rows="3" placeholder="العنوان الكامل"></textarea>
                                    </div>
                                </div>
                                
                                <div class="form-section">
                                    <h4><i class="fa-solid fa-lock"></i> تغيير كلمة المرور</h4>
                                    <div class="input-row">
                                        <div class="input-group">
                                            <label>كلمة المرور الحالية</label>
                                            <input type="password" name="current_password" placeholder="أدخل كلمة المرور الحالية">
                                        </div>
                                        <div class="input-group">
                                            <label>كلمة المرور الجديدة</label>
                                            <input type="password" name="new_password" placeholder="كلمة المرور الجديدة">
                                        </div>
                                    </div>
                                    <div class="input-group">
                                        <label>تأكيد كلمة المرور الجديدة</label>
                                        <input type="password" name="confirm_new_password" placeholder="تأكيد كلمة المرور الجديدة">
                                    </div>
                                    <small class="text-muted">اترك الحقول فارغة إذا لم ترد تغيير كلمة المرور</small>
                                </div>
                                
                                <div class="profile-actions">
                                    <button type="submit" class="auth-btn auth-primary">
                                        <i class="fa-solid fa-save"></i>
                                        حفظ التغييرات
                                    </button>
                                    <button type="button" class="auth-btn auth-secondary" onclick="authSystem.hideProfileModal()">
                                        <i class="fa-solid fa-times"></i>
                                        إلغاء
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            this.addProfileModalStyles();
        }
    }

    setupModalEvents() {
        // أحداث التبديل بين النماذج
        document.getElementById('showRegister')?.addEventListener('click', () => {
            this.showRegisterForm();
        });
        
        document.getElementById('showLogin')?.addEventListener('click', () => {
            this.showLoginForm();
        });
        
        // أحداث الإغلاق
        document.getElementById('authClose')?.addEventListener('click', () => {
            this.hideAuthModal();
        });
        
        document.getElementById('profileClose')?.addEventListener('click', () => {
            this.hideProfileModal();
        });
        
        // أحداث النماذج
        document.getElementById('loginFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e);
        });
        
        document.getElementById('registerFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e);
        });
        
        document.getElementById('profileForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProfileUpdate(e);
        });
        
        // إغلاق النوافذ عند النقر خارجها
        document.getElementById('authModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'authModal') {
                this.hideAuthModal();
            }
        });
        
        document.getElementById('profileModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'profileModal') {
                this.hideProfileModal();
            }
        });
    }

    showAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.add('active');
            this.showLoginForm();
        }
    }

    hideAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    showProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            this.loadProfileData();
            modal.classList.add('active');
        }
    }

    hideProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    showLoginForm() {
        document.getElementById('loginForm').classList.add('active');
        document.getElementById('registerForm').classList.remove('active');
    }

    showRegisterForm() {
        document.getElementById('registerForm').classList.add('active');
        document.getElementById('loginForm').classList.remove('active');
    }

    async handleLogin(e) {
        const formData = new FormData(e.target);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        
        try {
            const response = await fetch('auth.php?action=login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('userData', JSON.stringify(result.user));
                this.showMessage('تم تسجيل الدخول بنجاح!', 'success');
                this.hideAuthModal();
                this.checkAuthStatus();
                
                // إعادة تحميل الصفحة لتحديث الواجهة
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                this.showMessage(result.message || 'فشل تسجيل الدخول', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تسجيل الدخول:', error);
            this.showMessage('حدث خطأ أثناء تسجيل الدخول', 'error');
        }
    }

    async handleRegister(e) {
        const formData = new FormData(e.target);
        const data = {
            full_name: formData.get('fullname'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirm_password: formData.get('confirm_password'),
            phone: formData.get('phone'),
            birth_date: formData.get('birth_date'),
            address: formData.get('address')
        };
        
        if (data.password !== data.confirm_password) {
            this.showMessage('كلمات المرور غير متطابقة', 'error');
            return;
        }
        
        if (data.password.length < 6) {
            this.showMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }
        
        try {
            const response = await fetch('auth.php?action=register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showMessage('تم إنشاء الحساب بنجاح!', 'success');
                this.showLoginForm();
                
                const emailInput = document.querySelector('#loginForm input[name="email"]');
                if (emailInput) {
                    emailInput.value = data.email;
                }
            } else {
                this.showMessage(result.message || 'فشل إنشاء الحساب', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في إنشاء الحساب:', error);
            this.showMessage('حدث خطأ أثناء إنشاء الحساب', 'error');
        }
    }

    async handleProfileUpdate(e) {
        const formData = new FormData(e.target);
        const data = {
            full_name: formData.get('full_name'),
            phone: formData.get('phone'),
            birth_date: formData.get('birth_date'),
            address: formData.get('address'),
            current_password: formData.get('current_password'),
            new_password: formData.get('new_password'),
            confirm_new_password: formData.get('confirm_new_password')
        };
        
        // التحقق من كلمات المرور إذا تم إدخالها
        if (data.new_password) {
            if (!data.current_password) {
                this.showMessage('يجب إدخال كلمة المرور الحالية', 'error');
                return;
            }
            
            if (data.new_password !== data.confirm_new_password) {
                this.showMessage('كلمات المرور الجديدة غير متطابقة', 'error');
                return;
            }
            
            if (data.new_password.length < 6) {
                this.showMessage('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل', 'error');
                return;
            }
        }
        
        try {
            const response = await fetch('profile.php?action=update_profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showMessage('تم تحديث البيانات بنجاح!', 'success');
                
                // تحديث بيانات المستخدم في localStorage
                if (result.user) {
                    localStorage.setItem('userData', JSON.stringify(result.user));
                    this.checkAuthStatus();
                }
                
                this.hideProfileModal();
            } else {
                this.showMessage(result.message || 'فشل تحديث البيانات', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الملف الشخصي:', error);
            this.showMessage('حدث خطأ أثناء تحديث البيانات', 'error');
        }
    }

    loadProfileData() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        // تعبئة بيانات النموذج
        document.getElementById('profileName').textContent = userData.full_name || 'مستخدم';
        document.getElementById('profileEmail').textContent = userData.email || '';
        document.getElementById('profileFullName').value = userData.full_name || '';
        document.getElementById('profileEmailInput').value = userData.email || '';
        document.getElementById('profilePhone').value = userData.phone || '';
        document.getElementById('profileBirthDate').value = userData.birth_date || '';
        document.getElementById('profileAddress').value = userData.address || '';
        
        // تحديث البادجات
        const badge = document.getElementById('profileBadge');
        if (badge) {
            badge.textContent = userData.registration_type === 'system' ? 'نظام' : 'عادي';
            badge.className = `registration-badge ${userData.registration_type === 'system' ? 'badge-system' : 'badge-manual'}`;
        }
        
        // تحديث تاريخ التسجيل
        const joinDate = document.getElementById('profileJoinDate');
        if (joinDate) {
            joinDate.textContent = `مسجل منذ ${this.formatJoinDate(userData.created_at)}`;
        }
    }

    handleLogout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        this.showMessage('تم تسجيل الخروج بنجاح', 'success');
        this.checkAuthStatus();
        
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    isLoggedIn() {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        return !!(token && userData);
    }

    checkAuthStatus() {
        if (this.isLoggedIn()) {
            console.log('✅ المستخدم مسجل الدخول');
            this.updateUserInterface();
        } else {
            console.log('❌ المستخدم غير مسجل الدخول');
        }
    }

    updateUserInterface() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        console.log('🔄 تحديث واجهة المستخدم:', userData);
    }

    showProfile() {
        this.showProfileModal();
    }

    showOrders() {
        this.showMessage('سيتم فتح صفحة الطلبات قريباً', 'info');
    }

    showMessage(message, type) {
        const existingMessages = document.querySelectorAll('.system-message');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.className = `system-message ${type}`;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            z-index: 10001;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            ${type === 'success' ? 
                'background: var(--success-color);' : 
                type === 'error' ? 
                'background: var(--danger-color);' :
                type === 'info' ?
                'background: var(--info-color);' :
                'background: var(--primary-color);'
            }
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 4000);
    }

    addAuthModalStyles() {
        const styles = `
            .auth-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
            }
            
            .auth-modal.active {
                display: flex;
                animation: fadeIn 0.3s ease;
            }
            
            .auth-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 450px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .auth-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .auth-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .auth-form {
                display: none;
            }
            
            .auth-form.active {
                display: block;
            }
            
            .auth-form h3 {
                text-align: center;
                margin-bottom: 25px;
                color: var(--primary-color);
                font-size: 24px;
                font-weight: bold;
            }
            
            .demo-accounts {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                border-right: 4px solid var(--info-color);
            }
            
            .demo-accounts h4 {
                margin: 0 0 10px 0;
                color: var(--info-color);
                font-size: 14px;
            }
            
            .demo-accounts-list {
                font-size: 12px;
                line-height: 1.5;
            }
            
            .register-info {
                text-align: center;
                color: #666;
                margin-bottom: 20px;
                font-size: 14px;
            }
            
            .input-group {
                margin-bottom: 15px;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .password-hint {
                color: #666;
                display: block;
                margin-top: 5px;
                font-size: 12px;
            }
            
            .auth-btn {
                width: 100%;
                padding: 15px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: all 0.3s ease;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .auth-btn:hover {
                background: var(--secondary-color);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(162, 0, 135, 0.3);
            }
            
            .auth-switch {
                text-align: center;
                margin-top: 25px;
                color: var(--dark-color);
                font-size: 14px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
            }
            
            .switch-link {
                color: var(--primary-color);
                cursor: pointer;
                font-weight: bold;
                transition: color 0.3s ease;
            }
            
            .switch-link:hover {
                color: var(--secondary-color);
                text-decoration: underline;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }

            .user-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                padding: 0;
                min-width: 280px;
                z-index: 1000;
                margin-top: 8px;
                border: 2px solid var(--primary-color);
                overflow: hidden;
                display: none;
            }
            
            .user-header {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                padding: 20px;
                color: white;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .user-avatar {
                font-size: 40px;
                opacity: 0.9;
            }
            
            .user-details {
                flex: 1;
            }
            
            .user-details strong {
                display: block;
                font-size: 16px;
                margin-bottom: 4px;
            }
            
            .user-details small {
                font-size: 12px;
                opacity: 0.8;
            }
            
            .menu-section {
                padding: 15px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .menu-items {
                padding: 0;
            }
            
            .user-menu-item {
                display: flex;
                align-items: center;
                padding: 12px 20px;
                color: #333;
                text-decoration: none;
                border: none;
                background: none;
                width: 100%;
                text-align: right;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
                gap: 12px;
                position: relative;
                border-bottom: 1px solid #f8f8f8;
            }
            
            .user-menu-item:last-child {
                border-bottom: none;
            }
            
            .user-menu-item i {
                width: 20px;
                text-align: center;
                color: var(--primary-color);
                font-size: 16px;
            }
            
            .user-menu-item:hover {
                background: var(--light-color);
                transform: translateX(-5px);
            }
            
            .user-menu-item:hover i {
                color: var(--secondary-color);
            }
            
            .logout-btn {
                color: var(--danger-color);
                font-weight: bold;
                margin-top: 0;
            }
            
            .logout-btn i {
                color: var(--danger-color);
            }
            
            .logout-btn:hover {
                background: #ffe6e6;
            }
            
            .menu-badge {
                background: var(--secondary-color);
                color: white;
                border-radius: 12px;
                padding: 2px 8px;
                font-size: 11px;
                font-weight: bold;
                margin-right: auto;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    addProfileModalStyles() {
        const styles = `
            .profile-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
            }
            
            .profile-modal.active {
                display: flex;
                animation: fadeIn 0.3s ease;
            }
            
            .profile-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 700px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .profile-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .profile-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .profile-header {
                display: flex;
                align-items: center;
                gap: 20px;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #f0f0f0;
            }
            
            .profile-avatar {
                font-size: 60px;
                color: var(--primary-color);
            }
            
            .profile-info h3 {
                margin: 0 0 5px 0;
                color: var(--primary-color);
            }
            
            .profile-info p {
                margin: 0 0 10px 0;
                color: #666;
            }
            
            .profile-badges {
                display: flex;
                gap: 10px;
                align-items: center;
            }
            
            .join-date {
                font-size: 12px;
                color: #888;
                background: #f8f9fa;
                padding: 3px 8px;
                border-radius: 12px;
            }
            
            .profile-body {
                margin-top: 20px;
            }
            
            .form-section {
                margin-bottom: 30px;
                padding: 20px;
                border: 1px solid #e0e0e0;
                border-radius: 10px;
                background: #fafafa;
            }
            
            .form-section h4 {
                margin: 0 0 20px 0;
                color: var(--primary-color);
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .input-row {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
            }
            
            .input-row .input-group {
                flex: 1;
            }
            
            .input-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #333;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .input-group input[readonly] {
                background-color: #f8f9fa;
                color: #666;
                cursor: not-allowed;
            }
            
            .text-muted {
                color: #666;
                font-size: 12px;
                display: block;
                margin-top: 5px;
            }
            
            .profile-actions {
                display: flex;
                gap: 15px;
                margin-top: 30px;
            }
            
            .profile-actions .auth-btn {
                flex: 1;
                margin-bottom: 0;
            }
            
            .auth-secondary {
                background: #6c757d !important;
            }
            
            .auth-secondary:hover {
                background: #5a6268 !important;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// بدء النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});

// جعل النظام متاحاً globally
if (typeof window !== 'undefined') {
    window.AuthSystem = AuthSystem;
}*/


/*// نظام المصادقة والملف الشخصي المتكامل
class AuthSystem {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 بدء نظام المصادقة...');
        this.setCustomColors();
        this.createAuthModal();
        this.createProfileModal();
        this.setupUserIconListener();
        this.setupModalEvents();
        this.checkAuthStatus();
    }

    setCustomColors() {
        const styles = `
            :root {
                --primary-color: #ea70b1;
                --secondary-color: #a20087;
                --light-color: #f8f9fa;
                --dark-color: #343a40;
                --success-color: #28a745;
                --danger-color: #dc3545;
                --warning-color: #ffc107;
                --info-color: #17a2b8;
            }
            
            .auth-primary { background-color: var(--primary-color) !important; }
            .auth-secondary { background-color: var(--secondary-color) !important; }
            .auth-success { background-color: var(--success-color) !important; }
            .auth-info { background-color: var(--info-color) !important; }
            
            .auth-primary:hover { background-color: var(--secondary-color) !important; }
            .auth-success:hover { background-color: #218838 !important; }
            .auth-info:hover { background-color: #138496 !important; }
            
            .text-primary { color: var(--primary-color) !important; }
            .text-secondary { color: var(--secondary-color) !important; }
            .text-success { color: var(--success-color) !important; }
            .text-danger { color: var(--danger-color) !important; }
            .text-info { color: var(--info-color) !important; }
            
            .registration-badge {
                display: inline-block;
                padding: 3px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: bold;
                margin-right: 8px;
            }
            
            .badge-system { background: var(--info-color); color: white; }
            .badge-manual { background: var(--success-color); color: white; }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupUserIconListener() {
        const userIcons = document.querySelectorAll('.fa-solid.fa-user, .user-icon');
        
        if (userIcons.length > 0) {
            userIcons.forEach(icon => {
                const button = icon.closest('button') || icon;
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('✅ تم النقر على أيقونة المستخدم');
                    this.handleUserClick(button);
                });
            });
        } else {
            console.error('❌ لم يتم العثور على أيقونة المستخدم!');
            this.createUserIcon();
        }
    }

    createUserIcon() {
        const userIcon = document.createElement('button');
        userIcon.className = 'user-icon';
        userIcon.innerHTML = '<i class="fa-solid fa-user"></i>';
        userIcon.style.cssText = `
            background: #f0f0f0;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            margin-left: 10px;
        `;
        
        document.querySelector('.header')?.appendChild(userIcon);
        this.setupUserIconListener();
    }

    handleUserClick(element) {
        if (this.isLoggedIn()) {
            this.showUserMenu(element);
        } else {
            this.showAuthModal();
        }
    }

    showUserMenu(icon) {
        const oldMenu = document.querySelector('.user-menu');
        if (oldMenu) oldMenu.remove();
        
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const registrationType = userData.registration_type || 'manual';
        const badgeText = registrationType === 'system' ? 'نظام' : 'عادي';
        const badgeClass = registrationType === 'system' ? 'badge-system' : 'badge-manual';
        
        const menuHTML = `
            <div class="user-menu">
                <div class="user-header">
                    <div class="user-avatar">
                        <i class="fa-solid fa-user-circle"></i>
                    </div>
                    <div class="user-details">
                        <strong>${userData.full_name || userData.name || 'مستخدم'}</strong>
                        <small>${userData.email || ''}</small>
                        <div style="margin-top: 5px;">
                            <span class="registration-badge ${badgeClass}">${badgeText}</span>
                            <small>مسجل منذ ${this.formatJoinDate(userData.created_at)}</small>
                        </div>
                    </div>
                </div>
                
                <div class="menu-section">
                    <div class="menu-items">
                        <button class="user-menu-item" onclick="authSystem.showProfile()">
                            <i class="fa-solid fa-user"></i>
                            حسابي
                        </button>
                        <button class="user-menu-item" onclick="authSystem.showOrders()">
                            <i class="fa-solid fa-box"></i>
                            الطلبات
                            <span class="menu-badge" id="ordersCount">0</span>
                        </button>
                    </div>
                </div>
                
                <div class="menu-items">
                    <button class="user-menu-item logout-btn" onclick="authSystem.handleLogout()">
                        <i class="fa-solid fa-right-from-bracket"></i>
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        `;
        
        const iconContainer = icon.closest('button') || icon;
        const container = iconContainer.parentNode;
        container.style.position = 'relative';
        container.insertAdjacentHTML('beforeend', menuHTML);
        
        const menu = container.querySelector('.user-menu');
        
        this.updateMenuCounts();
        
        setTimeout(() => {
            menu.style.display = 'block';
        }, 10);
        
        const closeMenu = (e) => {
            if (menu && !menu.contains(e.target) && !icon.contains(e.target)) {
                menu.style.display = 'none';
                document.removeEventListener('click', closeMenu);
                setTimeout(() => {
                    if (menu.parentNode) {
                        menu.remove();
                    }
                }, 300);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 10);
    }

    formatJoinDate(dateString) {
        if (!dateString) return 'فترة';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'يوم';
        if (diffDays < 30) return `${diffDays} يوم`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} شهر`;
        return `${Math.floor(diffDays / 365)} سنة`;
    }

    async updateMenuCounts() {
        if (!this.isLoggedIn()) return;

        try {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            
            const response = await fetch('profile.php?action=get_user_stats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userData.id })
            });
            
            if (!response.ok) {
                throw new Error(`خطأ في الشبكة: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                const ordersCount = document.getElementById('ordersCount');
                if (ordersCount) {
                    ordersCount.textContent = result.data.orders_count || 0;
                }
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الإحصائيات:', error);
        }
    }

    createAuthModal() {
        if (!document.getElementById('authModal')) {
            const modalHTML = `
                <div class="auth-modal" id="authModal">
                    <div class="auth-content">
                        <button class="auth-close" id="authClose">×</button>
                        
                        <div class="auth-form active" id="loginForm">
                            <h3 class="text-primary">تسجيل الدخول</h3>
                            <div class="demo-accounts">
                                <h4><i class="fa-solid fa-key"></i> حسابات تجريبية:</h4>
                                <div class="demo-accounts-list">
                                    <div><strong>ahmed@example.com</strong> / password123</div>
                                    <div><strong>fatima@example.com</strong> / password123</div>
                                    <small>أو سجل حساب جديد أدناه</small>
                                </div>
                            </div>
                            <form id="loginFormElement">
                                <div class="input-group">
                                    <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                                </div>
                                <div class="input-group">
                                    <input type="password" name="password" placeholder="كلمة المرور" required>
                                </div>
                                <button type="submit" class="auth-btn auth-primary">
                                    <i class="fa-solid fa-right-to-bracket"></i>
                                    تسجيل الدخول
                                </button>
                            </form>
                            <div class="auth-switch">
                                ليس لديك حساب؟ 
                                <span class="switch-link text-primary" id="showRegister">إنشاء حساب جديد</span>
                            </div>
                        </div>
                        
                        <div class="auth-form" id="registerForm">
                            <h3 class="text-primary">إنشاء حساب جديد</h3>
                            <p class="register-info">
                                <i class="fa-solid fa-user-plus"></i> سجل بياناتك وسيتم حفظها في قاعدة البيانات
                            </p>
                            <form id="registerFormElement">
                                <div class="input-group">
                                    <input type="text" name="fullname" placeholder="الاسم الكامل" required>
                                </div>
                                <div class="input-group">
                                    <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                                </div>
                                <div class="input-group">
                                    <input type="password" name="password" placeholder="كلمة المرور" required>
                                    <small class="password-hint">كلمة المرور يجب أن تكون 6 أحرف على الأقل</small>
                                </div>
                                <div class="input-group">
                                    <input type="password" name="confirm_password" placeholder="تأكيد كلمة المرور" required>
                                </div>
                                <div class="input-group">
                                    <input type="tel" name="phone" placeholder="رقم الهاتف (اختياري)">
                                </div>
                                <div class="input-group">
                                    <input type="date" name="birth_date" placeholder="تاريخ الميلاد">
                                </div>
                                <div class="input-group">
                                    <textarea name="address" placeholder="العنوان" rows="3"></textarea>
                                </div>
                                <button type="submit" class="auth-btn auth-primary">
                                    <i class="fa-solid fa-user-plus"></i>
                                    إنشاء حساب
                                </button>
                            </form>
                            <div class="auth-switch">
                                لديك حساب بالفعل؟ 
                                <span class="switch-link text-primary" id="showLogin">تسجيل الدخول</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            this.addAuthModalStyles();
        }
    }

    createProfileModal() {
        if (!document.getElementById('profileModal')) {
            const modalHTML = `
                <div class="profile-modal" id="profileModal">
                    <div class="profile-content">
                        <button class="profile-close" id="profileClose">×</button>
                        
                        <div class="profile-header">
                            <div class="profile-avatar">
                                <i class="fa-solid fa-user-circle"></i>
                            </div>
                            <div class="profile-info">
                                <h3 class="text-primary" id="profileName">الاسم الكامل</h3>
                                <p id="profileEmail">البريد الإلكتروني</p>
                                <div class="profile-badges">
                                    <span class="registration-badge" id="profileBadge">عادي</span>
                                    <span class="join-date" id="profileJoinDate">مسجل منذ 0 يوم</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="profile-body">
                            <form id="profileForm">
                                <div class="form-section">
                                    <h4><i class="fa-solid fa-user"></i> المعلومات الشخصية</h4>
                                    <div class="input-row">
                                        <div class="input-group">
                                            <label>الاسم الكامل</label>
                                            <input type="text" name="full_name" id="profileFullName" required>
                                        </div>
                                        <div class="input-group">
                                            <label>البريد الإلكتروني</label>
                                            <input type="email" name="email" id="profileEmailInput" readonly>
                                            <small class="text-muted">لا يمكن تعديل البريد الإلكتروني</small>
                                        </div>
                                    </div>
                                    
                                    <div class="input-row">
                                        <div class="input-group">
                                            <label>رقم الهاتف</label>
                                            <input type="tel" name="phone" id="profilePhone">
                                        </div>
                                        <div class="input-group">
                                            <label>تاريخ الميلاد</label>
                                            <input type="date" name="birth_date" id="profileBirthDate">
                                        </div>
                                    </div>
                                    
                                    <div class="input-group">
                                        <label>العنوان</label>
                                        <textarea name="address" id="profileAddress" rows="3" placeholder="العنوان الكامل"></textarea>
                                    </div>
                                </div>
                                
                                <div class="form-section">
                                    <h4><i class="fa-solid fa-lock"></i> تغيير كلمة المرور</h4>
                                    <div class="input-row">
                                        <div class="input-group">
                                            <label>كلمة المرور الحالية</label>
                                            <input type="password" name="current_password" placeholder="أدخل كلمة المرور الحالية">
                                        </div>
                                        <div class="input-group">
                                            <label>كلمة المرور الجديدة</label>
                                            <input type="password" name="new_password" placeholder="كلمة المرور الجديدة">
                                        </div>
                                    </div>
                                    <div class="input-group">
                                        <label>تأكيد كلمة المرور الجديدة</label>
                                        <input type="password" name="confirm_new_password" placeholder="تأكيد كلمة المرور الجديدة">
                                    </div>
                                    <small class="text-muted">اترك الحقول فارغة إذا لم ترد تغيير كلمة المرور</small>
                                </div>
                                
                                <div class="profile-actions">
                                    <button type="submit" class="auth-btn auth-primary">
                                        <i class="fa-solid fa-save"></i>
                                        حفظ التغييرات
                                    </button>
                                    <button type="button" class="auth-btn auth-secondary" onclick="authSystem.hideProfileModal()">
                                        <i class="fa-solid fa-times"></i>
                                        إلغاء
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            this.addProfileModalStyles();
        }
    }

    setupModalEvents() {
        // أحداث التبديل بين النماذج
        document.getElementById('showRegister')?.addEventListener('click', () => {
            this.showRegisterForm();
        });
        
        document.getElementById('showLogin')?.addEventListener('click', () => {
            this.showLoginForm();
        });
        
        // أحداث الإغلاق
        document.getElementById('authClose')?.addEventListener('click', () => {
            this.hideAuthModal();
        });
        
        document.getElementById('profileClose')?.addEventListener('click', () => {
            this.hideProfileModal();
        });
        
        // أحداث النماذج
        document.getElementById('loginFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e);
        });
        
        document.getElementById('registerFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e);
        });
        
        document.getElementById('profileForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProfileUpdate(e);
        });
        
        // إغلاق النوافذ عند النقر خارجها
        document.getElementById('authModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'authModal') {
                this.hideAuthModal();
            }
        });
        
        document.getElementById('profileModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'profileModal') {
                this.hideProfileModal();
            }
        });
    }

    showAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.add('active');
            this.showLoginForm();
        }
    }

    hideAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    showProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            this.loadProfileData();
            modal.classList.add('active');
        }
    }

    hideProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    showLoginForm() {
        document.getElementById('loginForm').classList.add('active');
        document.getElementById('registerForm').classList.remove('active');
    }

    showRegisterForm() {
        document.getElementById('registerForm').classList.add('active');
        document.getElementById('loginForm').classList.remove('active');
    }

    async handleLogin(e) {
        const formData = new FormData(e.target);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        
        try {
            const response = await fetch('auth.php?action=login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                localStorage.setItem('userData', JSON.stringify(result.user));
                this.showMessage('تم تسجيل الدخول بنجاح!', 'success');
                this.hideAuthModal();
                this.checkAuthStatus();
                
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                this.showMessage(result.message || 'فشل تسجيل الدخول', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تسجيل الدخول:', error);
            this.showMessage('حدث خطأ أثناء تسجيل الدخول', 'error');
        }
    }

    async handleRegister(e) {
        const formData = new FormData(e.target);
        const data = {
            full_name: formData.get('fullname'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirm_password: formData.get('confirm_password'),
            phone: formData.get('phone'),
            birth_date: formData.get('birth_date'),
            address: formData.get('address')
        };
        
        if (data.password !== data.confirm_password) {
            this.showMessage('كلمات المرور غير متطابقة', 'error');
            return;
        }
        
        if (data.password.length < 6) {
            this.showMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }
        
        try {
            const response = await fetch('auth.php?action=register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showMessage('تم إنشاء الحساب بنجاح!', 'success');
                this.showLoginForm();
                
                const emailInput = document.querySelector('#loginForm input[name="email"]');
                if (emailInput) {
                    emailInput.value = data.email;
                }
            } else {
                this.showMessage(result.message || 'فشل إنشاء الحساب', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في إنشاء الحساب:', error);
            this.showMessage('حدث خطأ أثناء إنشاء الحساب', 'error');
        }
    }

    async handleProfileUpdate(e) {
        const formData = new FormData(e.target);
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        if (!userData || !userData.id) {
            this.showMessage('يجب تسجيل الدخول أولاً', 'error');
            return;
        }

        const data = {
            user_id: userData.id,
            full_name: formData.get('full_name'),
            phone: formData.get('phone'),
            birth_date: formData.get('birth_date'),
            address: formData.get('address'),
            current_password: formData.get('current_password'),
            new_password: formData.get('new_password'),
            confirm_new_password: formData.get('confirm_new_password')
        };
        
        // التحقق من كلمات المرور إذا تم إدخالها
        if (data.new_password) {
            if (!data.current_password) {
                this.showMessage('يجب إدخال كلمة المرور الحالية', 'error');
                return;
            }
            
            if (data.new_password !== data.confirm_new_password) {
                this.showMessage('كلمات المرور الجديدة غير متطابقة', 'error');
                return;
            }
            
            if (data.new_password.length < 6) {
                this.showMessage('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل', 'error');
                return;
            }
        }
        
        try {
            const response = await fetch('profile.php?action=update_profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showMessage('تم تحديث البيانات بنجاح!', 'success');
                
                if (result.user) {
                    localStorage.setItem('userData', JSON.stringify(result.user));
                    this.checkAuthStatus();
                }
                
                this.hideProfileModal();
            } else {
                this.showMessage(result.message || 'فشل تحديث البيانات', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الملف الشخصي:', error);
            this.showMessage('حدث خطأ أثناء تحديث البيانات', 'error');
        }
    }

    loadProfileData() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        document.getElementById('profileName').textContent = userData.full_name || 'مستخدم';
        document.getElementById('profileEmail').textContent = userData.email || '';
        document.getElementById('profileFullName').value = userData.full_name || '';
        document.getElementById('profileEmailInput').value = userData.email || '';
        document.getElementById('profilePhone').value = userData.phone || '';
        document.getElementById('profileBirthDate').value = userData.birth_date || '';
        document.getElementById('profileAddress').value = userData.address || '';
        
        const badge = document.getElementById('profileBadge');
        if (badge) {
            badge.textContent = userData.registration_type === 'system' ? 'نظام' : 'عادي';
            badge.className = `registration-badge ${userData.registration_type === 'system' ? 'badge-system' : 'badge-manual'}`;
        }
        
        const joinDate = document.getElementById('profileJoinDate');
        if (joinDate) {
            joinDate.textContent = `مسجل منذ ${this.formatJoinDate(userData.created_at)}`;
        }
    }

    handleLogout() {
        localStorage.removeItem('userData');
        this.showMessage('تم تسجيل الخروج بنجاح', 'success');
        this.checkAuthStatus();
        
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    isLoggedIn() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        return !!(userData && userData.id);
    }

    checkAuthStatus() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        if (this.isLoggedIn()) {
            console.log('✅ المستخدم مسجل الدخول:', userData);
            this.updateUserInterface();
        } else {
            console.log('❌ المستخدم غير مسجل الدخول');
        }
    }

    updateUserInterface() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        console.log('🔄 تحديث واجهة المستخدم:', userData);
    }

    showProfile() {
        this.showProfileModal();
    }

    showOrders() {
        this.showMessage('سيتم فتح صفحة الطلبات قريباً', 'info');
    }

    showMessage(message, type) {
        const existingMessages = document.querySelectorAll('.system-message');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.className = `system-message ${type}`;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            z-index: 10001;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            ${type === 'success' ? 
                'background: var(--success-color);' : 
                type === 'error' ? 
                'background: var(--danger-color);' :
                type === 'info' ?
                'background: var(--info-color);' :
                'background: var(--primary-color);'
            }
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 4000);
    }

    addAuthModalStyles() {
        const styles = `
            .auth-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
            }
            
            .auth-modal.active {
                display: flex;
                animation: fadeIn 0.3s ease;
            }
            
            .auth-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 450px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .auth-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .auth-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .auth-form {
                display: none;
            }
            
            .auth-form.active {
                display: block;
            }
            
            .auth-form h3 {
                text-align: center;
                margin-bottom: 25px;
                color: var(--primary-color);
                font-size: 24px;
                font-weight: bold;
            }
            
            .demo-accounts {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                border-right: 4px solid var(--info-color);
            }
            
            .demo-accounts h4 {
                margin: 0 0 10px 0;
                color: var(--info-color);
                font-size: 14px;
            }
            
            .demo-accounts-list {
                font-size: 12px;
                line-height: 1.5;
            }
            
            .register-info {
                text-align: center;
                color: #666;
                margin-bottom: 20px;
                font-size: 14px;
            }
            
            .input-group {
                margin-bottom: 15px;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .password-hint {
                color: #666;
                display: block;
                margin-top: 5px;
                font-size: 12px;
            }
            
            .auth-btn {
                width: 100%;
                padding: 15px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: all 0.3s ease;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .auth-btn:hover {
                background: var(--secondary-color);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(162, 0, 135, 0.3);
            }
            
            .auth-switch {
                text-align: center;
                margin-top: 25px;
                color: var(--dark-color);
                font-size: 14px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
            }
            
            .switch-link {
                color: var(--primary-color);
                cursor: pointer;
                font-weight: bold;
                transition: color 0.3s ease;
            }
            
            .switch-link:hover {
                color: var(--secondary-color);
                text-decoration: underline;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }

            .user-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                padding: 0;
                min-width: 280px;
                z-index: 1000;
                margin-top: 8px;
                border: 2px solid var(--primary-color);
                overflow: hidden;
                display: none;
            }
            
            .user-header {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                padding: 20px;
                color: white;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .user-avatar {
                font-size: 40px;
                opacity: 0.9;
            }
            
            .user-details {
                flex: 1;
            }
            
            .user-details strong {
                display: block;
                font-size: 16px;
                margin-bottom: 4px;
            }
            
            .user-details small {
                font-size: 12px;
                opacity: 0.8;
            }
            
            .menu-section {
                padding: 15px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .menu-items {
                padding: 0;
            }
            
            .user-menu-item {
                display: flex;
                align-items: center;
                padding: 12px 20px;
                color: #333;
                text-decoration: none;
                border: none;
                background: none;
                width: 100%;
                text-align: right;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
                gap: 12px;
                position: relative;
                border-bottom: 1px solid #f8f8f8;
            }
            
            .user-menu-item:last-child {
                border-bottom: none;
            }
            
            .user-menu-item i {
                width: 20px;
                text-align: center;
                color: var(--primary-color);
                font-size: 16px;
            }
            
            .user-menu-item:hover {
                background: var(--light-color);
                transform: translateX(-5px);
            }
            
            .user-menu-item:hover i {
                color: var(--secondary-color);
            }
            
            .logout-btn {
                color: var(--danger-color);
                font-weight: bold;
                margin-top: 0;
            }
            
            .logout-btn i {
                color: var(--danger-color);
            }
            
            .logout-btn:hover {
                background: #ffe6e6;
            }
            
            .menu-badge {
                background: var(--secondary-color);
                color: white;
                border-radius: 12px;
                padding: 2px 8px;
                font-size: 11px;
                font-weight: bold;
                margin-right: auto;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    addProfileModalStyles() {
        const styles = `
            .profile-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
            }
            
            .profile-modal.active {
                display: flex;
                animation: fadeIn 0.3s ease;
            }
            
            .profile-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 700px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .profile-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .profile-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .profile-header {
                display: flex;
                align-items: center;
                gap: 20px;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #f0f0f0;
            }
            
            .profile-avatar {
                font-size: 60px;
                color: var(--primary-color);
            }
            
            .profile-info h3 {
                margin: 0 0 5px 0;
                color: var(--primary-color);
            }
            
            .profile-info p {
                margin: 0 0 10px 0;
                color: #666;
            }
            
            .profile-badges {
                display: flex;
                gap: 10px;
                align-items: center;
            }
            
            .join-date {
                font-size: 12px;
                color: #888;
                background: #f8f9fa;
                padding: 3px 8px;
                border-radius: 12px;
            }
            
            .profile-body {
                margin-top: 20px;
            }
            
            .form-section {
                margin-bottom: 30px;
                padding: 20px;
                border: 1px solid #e0e0e0;
                border-radius: 10px;
                background: #fafafa;
            }
            
            .form-section h4 {
                margin: 0 0 20px 0;
                color: var(--primary-color);
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .input-row {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
            }
            
            .input-row .input-group {
                flex: 1;
            }
            
            .input-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #333;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .input-group input[readonly] {
                background-color: #f8f9fa;
                color: #666;
                cursor: not-allowed;
            }
            
            .text-muted {
                color: #666;
                font-size: 12px;
                display: block;
                margin-top: 5px;
            }
            
            .profile-actions {
                display: flex;
                gap: 15px;
                margin-top: 30px;
            }
            
            .profile-actions .auth-btn {
                flex: 1;
                margin-bottom: 0;
            }
            
            .auth-secondary {
                background: #6c757d !important;
            }
            
            .auth-secondary:hover {
                background: #5a6268 !important;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// بدء النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});









































































// نظام المصادقة والملف الشخصي المتكامل - يدعم التسجيل العادي وقاعدة البيانات
/*class AuthSystem {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 بدء نظام المصادقة...');
        this.setCustomColors();
        this.createAuthModal();
        this.createProfileModal();
        this.setupUserIconListener();
        this.setupModalEvents();
        this.checkAuthStatus();
    }

    setCustomColors() {
        const styles = `
            :root {
                --primary-color: #ea70b1;
                --secondary-color: #a20087;
                --light-color: #f8f9fa;
                --dark-color: #343a40;
                --success-color: #28a745;
                --danger-color: #dc3545;
                --warning-color: #ffc107;
                --info-color: #17a2b8;
            }
            
            .auth-primary { background-color: var(--primary-color) !important; }
            .auth-secondary { background-color: var(--secondary-color) !important; }
            .auth-success { background-color: var(--success-color) !important; }
            .auth-info { background-color: var(--info-color) !important; }
            
            .auth-primary:hover { background-color: var(--secondary-color) !important; }
            .auth-success:hover { background-color: #218838 !important; }
            .auth-info:hover { background-color: #138496 !important; }
            
            .text-primary { color: var(--primary-color) !important; }
            .text-secondary { color: var(--secondary-color) !important; }
            .text-success { color: var(--success-color) !important; }
            .text-danger { color: var(--danger-color) !important; }
            .text-info { color: var(--info-color) !important; }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupUserIconListener() {
        const userIcons = document.querySelectorAll('.fa-solid.fa-user, .user-icon');
        
        if (userIcons.length > 0) {
            userIcons.forEach(icon => {
                const button = icon.closest('button') || icon;
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('✅ تم النقر على أيقونة المستخدم');
                    this.handleUserClick(button);
                });
            });
        } else {
            console.error('❌ لم يتم العثور على أيقونة المستخدم!');
            this.createUserIcon();
        }
    }

    createUserIcon() {
        const userIcon = document.createElement('button');
        userIcon.className = 'user-icon';
        userIcon.innerHTML = '<i class="fa-solid fa-user"></i>';
        userIcon.style.cssText = `
            background: #f0f0f0;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            margin-left: 10px;
        `;
        
        document.querySelector('.header')?.appendChild(userIcon);
        this.setupUserIconListener();
    }

    handleUserClick(element) {
        if (this.isLoggedIn()) {
            this.showUserMenu(element);
        } else {
            this.showAuthModal();
        }
    }

    showUserMenu(icon) {
        const oldMenu = document.querySelector('.user-menu');
        if (oldMenu) oldMenu.remove();
        
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        const menuHTML = `
            <div class="user-menu">
                <div class="user-header">
                    <div class="user-avatar">
                        <i class="fa-solid fa-user-circle"></i>
                    </div>
                    <div class="user-details">
                        <strong>${userData.full_name || userData.name || 'مستخدم'}</strong>
                        <small>${userData.email || ''}</small>
                    </div>
                </div>
                
                <div class="menu-section">
                    <div class="menu-items">
                        <button class="user-menu-item" onclick="authSystem.showProfile()">
                            <i class="fa-solid fa-user"></i>
                            حسابي
                        </button>
                        <button class="user-menu-item" onclick="authSystem.showOrders()">
                            <i class="fa-solid fa-box"></i>
                            الطلبات
                            <span class="menu-badge" id="ordersCount">0</span>
                        </button>
                    </div>
                </div>
                
                <div class="menu-items">
                    <button class="user-menu-item logout-btn" onclick="authSystem.handleLogout()">
                        <i class="fa-solid fa-right-from-bracket"></i>
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        `;
        
        const iconContainer = icon.closest('button') || icon;
        const container = iconContainer.parentNode;
        container.style.position = 'relative';
        container.insertAdjacentHTML('beforeend', menuHTML);
        
        const menu = container.querySelector('.user-menu');
        
        this.updateMenuCounts();
        
        setTimeout(() => {
            menu.style.display = 'block';
        }, 10);
        
        const closeMenu = (e) => {
            if (menu && !menu.contains(e.target) && !icon.contains(e.target)) {
                menu.style.display = 'none';
                document.removeEventListener('click', closeMenu);
                setTimeout(() => {
                    if (menu.parentNode) {
                        menu.remove();
                    }
                }, 300);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 10);
    }

    async updateMenuCounts() {
        if (!this.isLoggedIn()) return;

        try {
            const response = await fetch('profile.php?action=get_user_stats');
            
            if (!response.ok) {
                throw new Error(`خطأ في الشبكة: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                const ordersCount = document.getElementById('ordersCount');
                if (ordersCount) {
                    ordersCount.textContent = data.data.orders_count || 0;
                }
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الإحصائيات:', error);
            const ordersCount = document.getElementById('ordersCount');
            if (ordersCount) {
                ordersCount.textContent = '0';
            }
        }
    }

    createAuthModal() {
        if (!document.getElementById('authModal')) {
            const modalHTML = `
                <div class="auth-modal" id="authModal">
                    <div class="auth-content">
                        <button class="auth-close" id="authClose">×</button>
                        
                        <div class="auth-form active" id="loginForm">
                            <h3 class="text-primary">تسجيل الدخول</h3>
                            <div class="demo-accounts">
                                <h4><i class="fa-solid fa-key"></i> حسابات تجريبية:</h4>
                                <div class="demo-accounts-list">
                                    <div><strong>ahmed@example.com</strong> / password123</div>
                                    <div><strong>fatima@example.com</strong> / password123</div>
                                    <small>أو سجل حساب جديد أدناه</small>
                                </div>
                            </div>
                            <form id="loginFormElement">
                                <div class="input-group">
                                    <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                                </div>
                                <div class="input-group">
                                    <input type="password" name="password" placeholder="كلمة المرور" required>
                                </div>
                                <button type="submit" class="auth-btn auth-primary">
                                    <i class="fa-solid fa-right-to-bracket"></i>
                                    تسجيل الدخول
                                </button>
                            </form>
                            <div class="auth-switch">
                                ليس لديك حساب؟ 
                                <span class="switch-link text-primary" id="showRegister">إنشاء حساب جديد</span>
                            </div>
                        </div>
                        
                        <div class="auth-form" id="registerForm">
                            <h3 class="text-primary">إنشاء حساب جديد</h3>
                            <form id="registerFormElement">
                                <div class="input-group">
                                    <input type="text" name="fullname" placeholder="الاسم الكامل" required>
                                </div>
                                <div class="input-group">
                                    <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                                </div>
                                <div class="input-group">
                                    <input type="password" name="password" placeholder="كلمة المرور" required>
                                </div>
                                <div class="input-group">
                                    <input type="password" name="confirm_password" placeholder="تأكيد كلمة المرور" required>
                                </div>
                                <div class="input-group">
                                    <input type="tel" name="phone" placeholder="رقم الهاتف">
                                </div>
                                <div class="input-group">
                                    <input type="date" name="birth_date" placeholder="تاريخ الميلاد">
                                </div>
                                <div class="input-group">
                                    <textarea name="address" placeholder="العنوان" rows="3"></textarea>
                                </div>
                                <button type="submit" class="auth-btn auth-primary">
                                    <i class="fa-solid fa-user-plus"></i>
                                    إنشاء حساب
                                </button>
                            </form>
                            <div class="auth-switch">
                                لديك حساب بالفعل؟ 
                                <span class="switch-link text-primary" id="showLogin">تسجيل الدخول</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            this.addAuthModalStyles();
        }
    }

    createProfileModal() {
        if (!document.getElementById('profileModal')) {
            const modalHTML = `
                <div class="profile-modal" id="profileModal">
                    <div class="profile-content">
                        <button class="profile-close" id="profileClose">×</button>
                        
                        <div class="profile-header">
                            <div class="profile-avatar">
                                <i class="fa-solid fa-user-circle"></i>
                            </div>
                            <div class="profile-info">
                                <h3 class="text-primary" id="profileName">الاسم الكامل</h3>
                                <p id="profileEmail">البريد الإلكتروني</p>
                            </div>
                        </div>
                        
                        <div class="profile-body">
                            <form id="profileForm">
                                <div class="form-section">
                                    <h4><i class="fa-solid fa-user"></i> المعلومات الشخصية</h4>
                                    <div class="input-row">
                                        <div class="input-group">
                                            <label>الاسم الكامل</label>
                                            <input type="text" name="full_name" id="profileFullName" required>
                                        </div>
                                        <div class="input-group">
                                            <label>البريد الإلكتروني</label>
                                            <input type="email" name="email" id="profileEmailInput" readonly>
                                            <small class="text-muted">لا يمكن تعديل البريد الإلكتروني</small>
                                        </div>
                                    </div>
                                    
                                    <div class="input-row">
                                        <div class="input-group">
                                            <label>رقم الهاتف</label>
                                            <input type="tel" name="phone" id="profilePhone" placeholder="أدخل رقم الهاتف">
                                        </div>
                                        <div class="input-group">
                                            <label>تاريخ الميلاد</label>
                                            <input type="date" name="birth_date" id="profileBirthDate">
                                        </div>
                                    </div>
                                    
                                    <div class="input-group">
                                        <label>العنوان</label>
                                        <textarea name="address" id="profileAddress" rows="3" placeholder="العنوان الكامل"></textarea>
                                    </div>
                                </div>
                                
                                <div class="profile-actions">
                                    <button type="submit" class="auth-btn auth-primary">
                                        <i class="fa-solid fa-save"></i>
                                        حفظ التغييرات
                                    </button>
                                    <button type="button" class="auth-btn auth-secondary" onclick="authSystem.hideProfileModal()">
                                        <i class="fa-solid fa-times"></i>
                                        إلغاء
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            this.addProfileModalStyles();
        }
    }

    setupModalEvents() {
        // أحداث التبديل بين النماذج
        document.getElementById('showRegister')?.addEventListener('click', () => {
            this.showRegisterForm();
        });
        
        document.getElementById('showLogin')?.addEventListener('click', () => {
            this.showLoginForm();
        });
        
        // أحداث الإغلاق
        document.getElementById('authClose')?.addEventListener('click', () => {
            this.hideAuthModal();
        });
        
        document.getElementById('profileClose')?.addEventListener('click', () => {
            this.hideProfileModal();
        });
        
        // أحداث النماذج
        document.getElementById('loginFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e);
        });
        
        document.getElementById('registerFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e);
        });
        
        document.getElementById('profileForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProfileUpdate(e);
        });
        
        // إغلاق النوافذ عند النقر خارجها
        document.getElementById('authModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'authModal') {
                this.hideAuthModal();
            }
        });
        
        document.getElementById('profileModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'profileModal') {
                this.hideProfileModal();
            }
        });
    }

    showAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.add('active');
            this.showLoginForm();
        }
    }

    hideAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    showProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            this.loadProfileData();
            modal.classList.add('active');
        }
    }

    hideProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    showLoginForm() {
        document.getElementById('loginForm').classList.add('active');
        document.getElementById('registerForm').classList.remove('active');
    }

    showRegisterForm() {
        document.getElementById('registerForm').classList.add('active');
        document.getElementById('loginForm').classList.remove('active');
    }

    async handleLogin(e) {
        const formData = new FormData(e.target);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        
        try {
            const response = await fetch('auth.php?action=login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('userData', JSON.stringify(result.user));
                this.showMessage('تم تسجيل الدخول بنجاح!', 'success');
                this.hideAuthModal();
                this.checkAuthStatus();
                
                // إعادة تحميل الصفحة لتحديث الواجهة
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                this.showMessage(result.message || 'فشل تسجيل الدخول', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تسجيل الدخول:', error);
            this.showMessage('حدث خطأ أثناء تسجيل الدخول', 'error');
        }
    }

    async handleRegister(e) {
        const formData = new FormData(e.target);
        const data = {
            full_name: formData.get('fullname'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirm_password: formData.get('confirm_password'),
            phone: formData.get('phone'),
            birth_date: formData.get('birth_date'),
            address: formData.get('address')
        };
        
        if (data.password !== data.confirm_password) {
            this.showMessage('كلمات المرور غير متطابقة', 'error');
            return;
        }
        
        if (data.password.length < 6) {
            this.showMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }
        
        try {
            const response = await fetch('auth.php?action=register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // تسجيل الدخول تلقائياً بعد التسجيل
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('userData', JSON.stringify(result.user));
                this.showMessage('تم إنشاء الحساب وتسجيل الدخول بنجاح!', 'success');
                this.hideAuthModal();
                this.checkAuthStatus();
                
                // إعادة تحميل الصفحة لتحديث الواجهة
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                this.showMessage(result.message || 'فشل إنشاء الحساب', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في إنشاء الحساب:', error);
            this.showMessage('حدث خطأ أثناء إنشاء الحساب', 'error');
        }
    }

    async handleProfileUpdate(e) {
        const formData = new FormData(e.target);
        const data = {
            full_name: formData.get('full_name'),
            phone: formData.get('phone'),
            birth_date: formData.get('birth_date'),
            address: formData.get('address')
        };
        
        try {
            const response = await fetch('profile.php?action=update_profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showMessage('تم تحديث البيانات بنجاح!', 'success');
                
                // تحديث بيانات المستخدم في localStorage
                if (result.user) {
                    localStorage.setItem('userData', JSON.stringify(result.user));
                    this.checkAuthStatus();
                }
                
                this.hideProfileModal();
            } else {
                this.showMessage(result.message || 'فشل تحديث البيانات', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الملف الشخصي:', error);
            this.showMessage('حدث خطأ أثناء تحديث البيانات', 'error');
        }
    }

    loadProfileData() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        // تعبئة بيانات النموذج
        document.getElementById('profileName').textContent = userData.full_name || 'مستخدم';
        document.getElementById('profileEmail').textContent = userData.email || '';
        document.getElementById('profileFullName').value = userData.full_name || '';
        document.getElementById('profileEmailInput').value = userData.email || '';
        document.getElementById('profilePhone').value = userData.phone || '';
        document.getElementById('profileBirthDate').value = userData.birth_date || '';
        document.getElementById('profileAddress').value = userData.address || '';
    }

    handleLogout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        this.showMessage('تم تسجيل الخروج بنجاح', 'success');
        this.checkAuthStatus();
        
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    isLoggedIn() {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        return !!(token && userData);
    }

    checkAuthStatus() {
        if (this.isLoggedIn()) {
            console.log('✅ المستخدم مسجل الدخول');
            this.updateUserInterface();
        } else {
            console.log('❌ المستخدم غير مسجل الدخول');
        }
    }

    updateUserInterface() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        console.log('🔄 تحديث واجهة المستخدم:', userData);
    }

    showProfile() {
        this.showProfileModal();
    }

    showOrders() {
        this.showMessage('سيتم فتح صفحة الطلبات قريباً', 'info');
    }

    showMessage(message, type) {
        const existingMessages = document.querySelectorAll('.system-message');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.className = `system-message ${type}`;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            z-index: 10001;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            ${type === 'success' ? 
                'background: var(--success-color);' : 
                type === 'error' ? 
                'background: var(--danger-color);' :
                type === 'info' ?
                'background: var(--info-color);' :
                'background: var(--primary-color);'
            }
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 4000);
    }

    addAuthModalStyles() {
        const styles = `
            .auth-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
            }
            
            .auth-modal.active {
                display: flex;
                animation: fadeIn 0.3s ease;
            }
            
            .auth-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 450px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .auth-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .auth-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .auth-form {
                display: none;
            }
            
            .auth-form.active {
                display: block;
            }
            
            .auth-form h3 {
                text-align: center;
                margin-bottom: 25px;
                color: var(--primary-color);
                font-size: 24px;
                font-weight: bold;
            }
            
            .demo-accounts {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                border-right: 4px solid var(--info-color);
            }
            
            .demo-accounts h4 {
                margin: 0 0 10px 0;
                color: var(--info-color);
                font-size: 14px;
            }
            
            .demo-accounts-list {
                font-size: 12px;
                line-height: 1.5;
            }
            
            .input-group {
                margin-bottom: 15px;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .auth-btn {
                width: 100%;
                padding: 15px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: all 0.3s ease;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .auth-btn:hover {
                background: var(--secondary-color);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(162, 0, 135, 0.3);
            }
            
            .auth-switch {
                text-align: center;
                margin-top: 25px;
                color: var(--dark-color);
                font-size: 14px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
            }
            
            .switch-link {
                color: var(--primary-color);
                cursor: pointer;
                font-weight: bold;
                transition: color 0.3s ease;
            }
            
            .switch-link:hover {
                color: var(--secondary-color);
                text-decoration: underline;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }

            .user-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                padding: 0;
                min-width: 280px;
                z-index: 1000;
                margin-top: 8px;
                border: 2px solid var(--primary-color);
                overflow: hidden;
                display: none;
            }
            
            .user-header {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                padding: 20px;
                color: white;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .user-avatar {
                font-size: 40px;
                opacity: 0.9;
            }
            
            .user-details {
                flex: 1;
            }
            
            .user-details strong {
                display: block;
                font-size: 16px;
                margin-bottom: 4px;
            }
            
            .user-details small {
                font-size: 12px;
                opacity: 0.8;
            }
            
            .menu-section {
                padding: 15px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .menu-items {
                padding: 0;
            }
            
            .user-menu-item {
                display: flex;
                align-items: center;
                padding: 12px 20px;
                color: #333;
                text-decoration: none;
                border: none;
                background: none;
                width: 100%;
                text-align: right;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
                gap: 12px;
                position: relative;
                border-bottom: 1px solid #f8f8f8;
            }
            
            .user-menu-item:last-child {
                border-bottom: none;
            }
            
            .user-menu-item i {
                width: 20px;
                text-align: center;
                color: var(--primary-color);
                font-size: 16px;
            }
            
            .user-menu-item:hover {
                background: var(--light-color);
                transform: translateX(-5px);
            }
            
            .user-menu-item:hover i {
                color: var(--secondary-color);
            }
            
            .logout-btn {
                color: var(--danger-color);
                font-weight: bold;
                margin-top: 0;
            }
            
            .logout-btn i {
                color: var(--danger-color);
            }
            
            .logout-btn:hover {
                background: #ffe6e6;
            }
            
            .menu-badge {
                background: var(--secondary-color);
                color: white;
                border-radius: 12px;
                padding: 2px 8px;
                font-size: 11px;
                font-weight: bold;
                margin-right: auto;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    addProfileModalStyles() {
        const styles = `
            .profile-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
            }
            
            .profile-modal.active {
                display: flex;
                animation: fadeIn 0.3s ease;
            }
            
            .profile-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 600px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .profile-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .profile-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .profile-header {
                display: flex;
                align-items: center;
                gap: 20px;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #f0f0f0;
            }
            
            .profile-avatar {
                font-size: 60px;
                color: var(--primary-color);
            }
            
            .profile-info h3 {
                margin: 0 0 5px 0;
                color: var(--primary-color);
            }
            
            .profile-info p {
                margin: 0 0 10px 0;
                color: #666;
            }
            
            .profile-body {
                margin-top: 20px;
            }
            
            .form-section {
                margin-bottom: 30px;
                padding: 20px;
                border: 1px solid #e0e0e0;
                border-radius: 10px;
                background: #fafafa;
            }
            
            .form-section h4 {
                margin: 0 0 20px 0;
                color: var(--primary-color);
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .input-row {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
            }
            
            .input-row .input-group {
                flex: 1;
            }
            
            .input-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #333;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .input-group input[readonly] {
                background-color: #f8f9fa;
                color: #666;
                cursor: not-allowed;
            }
            
            .text-muted {
                color: #666;
                font-size: 12px;
                display: block;
                margin-top: 5px;
            }
            
            .profile-actions {
                display: flex;
                gap: 15px;
                margin-top: 30px;
            }
            
            .profile-actions .auth-btn {
                flex: 1;
                margin-bottom: 0;
            }
            
            .auth-secondary {
                background: #6c757d !important;
            }
            
            .auth-secondary:hover {
                background: #5a6268 !important;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// بدء النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});

// جعل النظام متاحاً globally
if (typeof window !== 'undefined') {
    window.AuthSystem = AuthSystem;
}*/

/*
// نظام المصادقة والملف الشخصي المتكامل
class AuthSystem {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 بدء نظام المصادقة...');
        this.setCustomColors();
        this.createAuthModal();
        this.createProfileModal();
        this.setupUserIconListener();
        this.setupModalEvents();
        this.checkAuthStatus();
    }

    setCustomColors() {
        const styles = `
            :root {
                --primary-color: #ea70b1;
                --secondary-color: #a20087;
                --light-color: #f8f9fa;
                --dark-color: #343a40;
                --success-color: #28a745;
                --danger-color: #dc3545;
                --warning-color: #ffc107;
                --info-color: #17a2b8;
            }
            
            .auth-primary { background-color: var(--primary-color) !important; }
            .auth-secondary { background-color: var(--secondary-color) !important; }
            .auth-success { background-color: var(--success-color) !important; }
            .auth-info { background-color: var(--info-color) !important; }
            
            .auth-primary:hover { background-color: var(--secondary-color) !important; }
            .auth-success:hover { background-color: #218838 !important; }
            .auth-info:hover { background-color: #138496 !important; }
            
            .text-primary { color: var(--primary-color) !important; }
            .text-secondary { color: var(--secondary-color) !important; }
            .text-success { color: var(--success-color) !important; }
            .text-danger { color: var(--danger-color) !important; }
            .text-info { color: var(--info-color) !important; }
            
            .registration-badge {
                display: inline-block;
                padding: 3px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: bold;
                margin-right: 8px;
            }
            
            .badge-system { background: var(--info-color); color: white; }
            .badge-manual { background: var(--success-color); color: white; }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupUserIconListener() {
        const userIcons = document.querySelectorAll('.fa-solid.fa-user, .user-icon');
        
        if (userIcons.length > 0) {
            userIcons.forEach(icon => {
                const button = icon.closest('button') || icon;
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('✅ تم النقر على أيقونة المستخدم');
                    this.handleUserClick(button);
                });
            });
        } else {
            console.error('❌ لم يتم العثور على أيقونة المستخدم!');
            this.createUserIcon();
        }
    }

    createUserIcon() {
        const userIcon = document.createElement('button');
        userIcon.className = 'user-icon';
        userIcon.innerHTML = '<i class="fa-solid fa-user"></i>';
        userIcon.style.cssText = `
            background: #f0f0f0;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            margin-left: 10px;
        `;
        
        document.querySelector('.header')?.appendChild(userIcon);
        this.setupUserIconListener();
    }

    handleUserClick(element) {
        if (this.isLoggedIn()) {
            this.showUserMenu(element);
        } else {
            this.showAuthModal();
        }
    }

    showUserMenu(icon) {
        const oldMenu = document.querySelector('.user-menu');
        if (oldMenu) oldMenu.remove();
        
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const registrationType = userData.registration_type || 'manual';
        const badgeText = registrationType === 'system' ? 'نظام' : 'عادي';
        const badgeClass = registrationType === 'system' ? 'badge-system' : 'badge-manual';
        
        const menuHTML = `
            <div class="user-menu">
                <div class="user-header">
                    <div class="user-avatar">
                        <i class="fa-solid fa-user-circle"></i>
                    </div>
                    <div class="user-details">
                        <strong>${userData.full_name || userData.name || 'مستخدم'}</strong>
                        <small>${userData.email || ''}</small>
                        <div style="margin-top: 5px;">
                            <span class="registration-badge ${badgeClass}">${badgeText}</span>
                            <small>مسجل منذ ${this.formatJoinDate(userData.created_at)}</small>
                        </div>
                    </div>
                </div>
                
                <div class="menu-section">
                    <div class="menu-items">
                        <button class="user-menu-item" onclick="authSystem.showProfile()">
                            <i class="fa-solid fa-user"></i>
                            حسابي
                        </button>
                        <button class="user-menu-item" onclick="authSystem.showOrders()">
                            <i class="fa-solid fa-box"></i>
                            الطلبات
                            <span class="menu-badge" id="ordersCount">0</span>
                        </button>
                    </div>
                </div>
                
                <div class="menu-items">
                    <button class="user-menu-item logout-btn" onclick="authSystem.handleLogout()">
                        <i class="fa-solid fa-right-from-bracket"></i>
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        `;
        
        const iconContainer = icon.closest('button') || icon;
        const container = iconContainer.parentNode;
        container.style.position = 'relative';
        container.insertAdjacentHTML('beforeend', menuHTML);
        
        const menu = container.querySelector('.user-menu');
        
        this.updateMenuCounts();
        
        setTimeout(() => {
            menu.style.display = 'block';
        }, 10);
        
        const closeMenu = (e) => {
            if (menu && !menu.contains(e.target) && !icon.contains(e.target)) {
                menu.style.display = 'none';
                document.removeEventListener('click', closeMenu);
                setTimeout(() => {
                    if (menu.parentNode) {
                        menu.remove();
                    }
                }, 300);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 10);
    }

    formatJoinDate(dateString) {
        if (!dateString) return 'فترة';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'يوم';
        if (diffDays < 30) return `${diffDays} يوم`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} شهر`;
        return `${Math.floor(diffDays / 365)} سنة`;
    }

    async updateMenuCounts() {
        if (!this.isLoggedIn()) return;

        try {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            
            const response = await fetch('profile.php?action=get_user_stats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userData.id })
            });
            
            if (!response.ok) {
                throw new Error(`خطأ في الشبكة: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                const ordersCount = document.getElementById('ordersCount');
                if (ordersCount) {
                    ordersCount.textContent = result.data.orders_count || 0;
                }
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الإحصائيات:', error);
        }
    }

    createAuthModal() {
        if (!document.getElementById('authModal')) {
            const modalHTML = `
                <div class="auth-modal" id="authModal">
                    <div class="auth-content">
                        <button class="auth-close" id="authClose">×</button>
                        
                        <div class="auth-form active" id="loginForm">
                            <h3 class="text-primary">تسجيل الدخول</h3>
                            <form id="loginFormElement">
                                <div class="input-group">
                                    <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                                </div>
                                <div class="input-group">
                                    <input type="password" name="password" placeholder="كلمة المرور" required>
                                </div>
                                <button type="submit" class="auth-btn auth-primary">
                                    <i class="fa-solid fa-right-to-bracket"></i>
                                    تسجيل الدخول
                                </button>
                            </form>
                            <div class="auth-switch">
                                ليس لديك حساب؟ 
                                <span class="switch-link text-primary" id="showRegister">إنشاء حساب جديد</span>
                            </div>
                        </div>
                        
                        <div class="auth-form" id="registerForm">
                            <h3 class="text-primary">إنشاء حساب جديد</h3>
                            <p class="register-info">
                                <i class="fa-solid fa-user-plus"></i> سجل بياناتك وسيتم حفظها في قاعدة البيانات
                            </p>
                            <form id="registerFormElement">
                                <div class="input-group">
                                    <input type="text" name="full_name" placeholder="الاسم الكامل" required>
                                </div>
                                <div class="input-group">
                                    <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                                </div>
                                <div class="input-group">
                                    <input type="password" name="password" placeholder="كلمة المرور" required>
                                    <small class="password-hint">كلمة المرور يجب أن تكون 6 أحرف على الأقل</small>
                                </div>
                                <div class="input-group">
                                    <input type="password" name="confirm_password" placeholder="تأكيد كلمة المرور" required>
                                </div>
                                <div class="input-group">
                                    <input type="tel" name="phone" placeholder="رقم الهاتف (اختياري)">
                                </div>
                                <div class="input-group">
                                    <input type="date" name="birth_date" placeholder="تاريخ الميلاد">
                                </div>
                                <div class="input-group">
                                    <textarea name="address" placeholder="العنوان" rows="3"></textarea>
                                </div>
                                <button type="submit" class="auth-btn auth-primary">
                                    <i class="fa-solid fa-user-plus"></i>
                                    إنشاء حساب
                                </button>
                            </form>
                            <div class="auth-switch">
                                لديك حساب بالفعل؟ 
                                <span class="switch-link text-primary" id="showLogin">تسجيل الدخول</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            this.addAuthModalStyles();
        }
    }

    createProfileModal() {
        if (!document.getElementById('profileModal')) {
            const modalHTML = `
                <div class="profile-modal" id="profileModal">
                    <div class="profile-content">
                        <button class="profile-close" id="profileClose">×</button>
                        
                        <div class="profile-header">
                            <div class="profile-avatar">
                                <i class="fa-solid fa-user-circle"></i>
                            </div>
                            <div class="profile-info">
                                <h3 class="text-primary" id="profileName">الاسم الكامل</h3>
                                <p id="profileEmail">البريد الإلكتروني</p>
                                <div class="profile-badges">
                                    <span class="registration-badge" id="profileBadge">عادي</span>
                                    <span class="join-date" id="profileJoinDate">مسجل منذ 0 يوم</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="profile-body">
                            <form id="profileForm">
                                <div class="form-section">
                                    <h4><i class="fa-solid fa-user"></i> المعلومات الشخصية</h4>
                                    <div class="input-row">
                                        <div class="input-group">
                                            <label>الاسم الكامل</label>
                                            <input type="text" name="full_name" id="profileFullName" required>
                                        </div>
                                        <div class="input-group">
                                            <label>البريد الإلكتروني</label>
                                            <input type="email" name="email" id="profileEmailInput" readonly>
                                            <small class="text-muted">لا يمكن تعديل البريد الإلكتروني</small>
                                        </div>
                                    </div>
                                    
                                    <div class="input-row">
                                        <div class="input-group">
                                            <label>رقم الهاتف</label>
                                            <input type="tel" name="phone" id="profilePhone">
                                        </div>
                                        <div class="input-group">
                                            <label>تاريخ الميلاد</label>
                                            <input type="date" name="birth_date" id="profileBirthDate">
                                        </div>
                                    </div>
                                    
                                    <div class="input-group">
                                        <label>العنوان</label>
                                        <textarea name="address" id="profileAddress" rows="3" placeholder="العنوان الكامل"></textarea>
                                    </div>
                                </div>
                                
                                <div class="form-section">
                                    <h4><i class="fa-solid fa-lock"></i> تغيير كلمة المرور</h4>
                                    <div class="input-row">
                                        <div class="input-group">
                                            <label>كلمة المرور الحالية</label>
                                            <input type="password" name="current_password" placeholder="أدخل كلمة المرور الحالية">
                                        </div>
                                        <div class="input-group">
                                            <label>كلمة المرور الجديدة</label>
                                            <input type="password" name="new_password" placeholder="كلمة المرور الجديدة">
                                        </div>
                                    </div>
                                    <div class="input-group">
                                        <label>تأكيد كلمة المرور الجديدة</label>
                                        <input type="password" name="confirm_new_password" placeholder="تأكيد كلمة المرور الجديدة">
                                    </div>
                                    <small class="text-muted">اترك الحقول فارغة إذا لم ترد تغيير كلمة المرور</small>
                                </div>
                                
                                <div class="profile-actions">
                                    <button type="submit" class="auth-btn auth-primary">
                                        <i class="fa-solid fa-save"></i>
                                        حفظ التغييرات
                                    </button>
                                    <button type="button" class="auth-btn auth-secondary" onclick="authSystem.hideProfileModal()">
                                        <i class="fa-solid fa-times"></i>
                                        إلغاء
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            this.addProfileModalStyles();
        }
    }

    setupModalEvents() {
        // أحداث التبديل بين النماذج
        document.getElementById('showRegister')?.addEventListener('click', () => {
            this.showRegisterForm();
        });
        
        document.getElementById('showLogin')?.addEventListener('click', () => {
            this.showLoginForm();
        });
        
        // أحداث الإغلاق
        document.getElementById('authClose')?.addEventListener('click', () => {
            this.hideAuthModal();
        });
        
        document.getElementById('profileClose')?.addEventListener('click', () => {
            this.hideProfileModal();
        });
        
        // أحداث النماذج
        document.getElementById('loginFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e);
        });
        
        document.getElementById('registerFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e);
        });
        
        document.getElementById('profileForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProfileUpdate(e);
        });
        
        // إغلاق النوافذ عند النقر خارجها
        document.getElementById('authModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'authModal') {
                this.hideAuthModal();
            }
        });
        
        document.getElementById('profileModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'profileModal') {
                this.hideProfileModal();
            }
        });
    }

    showAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.add('active');
            this.showLoginForm();
        }
    }

    hideAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    showProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            this.loadProfileData();
            modal.classList.add('active');
        }
    }

    hideProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    showLoginForm() {
        document.getElementById('loginForm').classList.add('active');
        document.getElementById('registerForm').classList.remove('active');
    }

    showRegisterForm() {
        document.getElementById('registerForm').classList.add('active');
        document.getElementById('loginForm').classList.remove('active');
    }

    async handleLogin(e) {
        const formData = new FormData(e.target);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        
        try {
            const response = await fetch('auth.php?action=login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                localStorage.setItem('userData', JSON.stringify(result.user));
                this.showMessage('تم تسجيل الدخول بنجاح!', 'success');
                this.hideAuthModal();
                this.checkAuthStatus();
                
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                this.showMessage(result.message || 'فشل تسجيل الدخول', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تسجيل الدخول:', error);
            this.showMessage('حدث خطأ أثناء تسجيل الدخول', 'error');
        }
    }

    async handleRegister(e) {
        const formData = new FormData(e.target);
        const data = {
            full_name: formData.get('full_name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirm_password: formData.get('confirm_password'),
            phone: formData.get('phone'),
            birth_date: formData.get('birth_date'),
            address: formData.get('address')
        };
        
        if (data.password !== data.confirm_password) {
            this.showMessage('كلمات المرور غير متطابقة', 'error');
            return;
        }
        
        if (data.password.length < 6) {
            this.showMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }
        
        try {
            const response = await fetch('auth.php?action=register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showMessage('تم إنشاء الحساب بنجاح!', 'success');
                this.showLoginForm();
                
                const emailInput = document.querySelector('#loginForm input[name="email"]');
                if (emailInput) {
                    emailInput.value = data.email;
                }
            } else {
                this.showMessage(result.message || 'فشل إنشاء الحساب', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في إنشاء الحساب:', error);
            this.showMessage('حدث خطأ أثناء إنشاء الحساب', 'error');
        }
    }

    async handleProfileUpdate(e) {
        const formData = new FormData(e.target);
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        if (!userData || !userData.id) {
            this.showMessage('يجب تسجيل الدخول أولاً', 'error');
            return;
        }

        const data = {
            user_id: userData.id,
            full_name: formData.get('full_name'),
            phone: formData.get('phone'),
            birth_date: formData.get('birth_date'),
            address: formData.get('address'),
            current_password: formData.get('current_password'),
            new_password: formData.get('new_password'),
            confirm_new_password: formData.get('confirm_new_password')
        };
        
        // التحقق من كلمات المرور إذا تم إدخالها
        if (data.new_password) {
            if (!data.current_password) {
                this.showMessage('يجب إدخال كلمة المرور الحالية', 'error');
                return;
            }
            
            if (data.new_password !== data.confirm_new_password) {
                this.showMessage('كلمات المرور الجديدة غير متطابقة', 'error');
                return;
            }
            
            if (data.new_password.length < 6) {
                this.showMessage('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل', 'error');
                return;
            }
        }
        
        try {
            const response = await fetch('profile.php?action=update_profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showMessage('تم تحديث البيانات بنجاح!', 'success');
                
                if (result.user) {
                    localStorage.setItem('userData', JSON.stringify(result.user));
                    this.checkAuthStatus();
                }
                
                this.hideProfileModal();
            } else {
                this.showMessage(result.message || 'فشل تحديث البيانات', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الملف الشخصي:', error);
            this.showMessage('حدث خطأ أثناء تحديث البيانات', 'error');
        }
    }

    loadProfileData() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        document.getElementById('profileName').textContent = userData.full_name || 'مستخدم';
        document.getElementById('profileEmail').textContent = userData.email || '';
        document.getElementById('profileFullName').value = userData.full_name || '';
        document.getElementById('profileEmailInput').value = userData.email || '';
        document.getElementById('profilePhone').value = userData.phone || '';
        document.getElementById('profileBirthDate').value = userData.birth_date || '';
        document.getElementById('profileAddress').value = userData.address || '';
        
        const badge = document.getElementById('profileBadge');
        if (badge) {
            badge.textContent = userData.registration_type === 'system' ? 'نظام' : 'عادي';
            badge.className = `registration-badge ${userData.registration_type === 'system' ? 'badge-system' : 'badge-manual'}`;
        }
        
        const joinDate = document.getElementById('profileJoinDate');
        if (joinDate) {
            joinDate.textContent = `مسجل منذ ${this.formatJoinDate(userData.created_at)}`;
        }
    }

    handleLogout() {
        localStorage.removeItem('userData');
        this.showMessage('تم تسجيل الخروج بنجاح', 'success');
        this.checkAuthStatus();
        
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    isLoggedIn() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        return !!(userData && userData.id);
    }

    checkAuthStatus() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        if (this.isLoggedIn()) {
            console.log('✅ المستخدم مسجل الدخول:', userData);
            this.updateUserInterface();
        } else {
            console.log('❌ المستخدم غير مسجل الدخول');
        }
    }

    updateUserInterface() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        console.log('🔄 تحديث واجهة المستخدم:', userData);
    }

    showProfile() {
        this.showProfileModal();
    }

    showOrders() {
        this.showMessage('سيتم فتح صفحة الطلبات قريباً', 'info');
    }

    showMessage(message, type) {
        const existingMessages = document.querySelectorAll('.system-message');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.className = `system-message ${type}`;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            z-index: 10001;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            ${type === 'success' ? 
                'background: var(--success-color);' : 
                type === 'error' ? 
                'background: var(--danger-color);' :
                type === 'info' ?
                'background: var(--info-color);' :
                'background: var(--primary-color);'
            }
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 4000);
    }

    addAuthModalStyles() {
        const styles = `
            .auth-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
            }
            
            .auth-modal.active {
                display: flex;
                animation: fadeIn 0.3s ease;
            }
            
            .auth-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 450px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .auth-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .auth-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .auth-form {
                display: none;
            }
            
            .auth-form.active {
                display: block;
            }
            
            .auth-form h3 {
                text-align: center;
                margin-bottom: 25px;
                color: var(--primary-color);
                font-size: 24px;
                font-weight: bold;
            }
            
            .register-info {
                text-align: center;
                color: #666;
                margin-bottom: 20px;
                font-size: 14px;
            }
            
            .input-group {
                margin-bottom: 15px;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .password-hint {
                color: #666;
                display: block;
                margin-top: 5px;
                font-size: 12px;
            }
            
            .auth-btn {
                width: 100%;
                padding: 15px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: all 0.3s ease;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .auth-btn:hover {
                background: var(--secondary-color);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(162, 0, 135, 0.3);
            }
            
            .auth-switch {
                text-align: center;
                margin-top: 25px;
                color: var(--dark-color);
                font-size: 14px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
            }
            
            .switch-link {
                color: var(--primary-color);
                cursor: pointer;
                font-weight: bold;
                transition: color 0.3s ease;
            }
            
            .switch-link:hover {
                color: var(--secondary-color);
                text-decoration: underline;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }

            .user-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                padding: 0;
                min-width: 280px;
                z-index: 1000;
                margin-top: 8px;
                border: 2px solid var(--primary-color);
                overflow: hidden;
                display: none;
            }
            
            .user-header {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                padding: 20px;
                color: white;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .user-avatar {
                font-size: 40px;
                opacity: 0.9;
            }
            
            .user-details {
                flex: 1;
            }
            
            .user-details strong {
                display: block;
                font-size: 16px;
                margin-bottom: 4px;
            }
            
            .user-details small {
                font-size: 12px;
                opacity: 0.8;
            }
            
            .menu-section {
                padding: 15px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .menu-items {
                padding: 0;
            }
            
            .user-menu-item {
                display: flex;
                align-items: center;
                padding: 12px 20px;
                color: #333;
                text-decoration: none;
                border: none;
                background: none;
                width: 100%;
                text-align: right;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
                gap: 12px;
                position: relative;
                border-bottom: 1px solid #f8f8f8;
            }
            
            .user-menu-item:last-child {
                border-bottom: none;
            }
            
            .user-menu-item i {
                width: 20px;
                text-align: center;
                color: var(--primary-color);
                font-size: 16px;
            }
            
            .user-menu-item:hover {
                background: var(--light-color);
                transform: translateX(-5px);
            }
            
            .user-menu-item:hover i {
                color: var(--secondary-color);
            }
            
            .logout-btn {
                color: var(--danger-color);
                font-weight: bold;
                margin-top: 0;
            }
            
            .logout-btn i {
                color: var(--danger-color);
            }
            
            .logout-btn:hover {
                background: #ffe6e6;
            }
            
            .menu-badge {
                background: var(--secondary-color);
                color: white;
                border-radius: 12px;
                padding: 2px 8px;
                font-size: 11px;
                font-weight: bold;
                margin-right: auto;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    addProfileModalStyles() {
        const styles = `
            .profile-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
            }
            
            .profile-modal.active {
                display: flex;
                animation: fadeIn 0.3s ease;
            }
            
            .profile-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 700px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .profile-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .profile-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .profile-header {
                display: flex;
                align-items: center;
                gap: 20px;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #f0f0f0;
            }
            
            .profile-avatar {
                font-size: 60px;
                color: var(--primary-color);
            }
            
            .profile-info h3 {
                margin: 0 0 5px 0;
                color: var(--primary-color);
            }
            
            .profile-info p {
                margin: 0 0 10px 0;
                color: #666;
            }
            
            .profile-badges {
                display: flex;
                gap: 10px;
                align-items: center;
            }
            
            .join-date {
                font-size: 12px;
                color: #888;
                background: #f8f9fa;
                padding: 3px 8px;
                border-radius: 12px;
            }
            
            .profile-body {
                margin-top: 20px;
            }
            
            .form-section {
                margin-bottom: 30px;
                padding: 20px;
                border: 1px solid #e0e0e0;
                border-radius: 10px;
                background: #fafafa;
            }
            
            .form-section h4 {
                margin: 0 0 20px 0;
                color: var(--primary-color);
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .input-row {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
            }
            
            .input-row .input-group {
                flex: 1;
            }
            
            .input-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #333;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .input-group input[readonly] {
                background-color: #f8f9fa;
                color: #666;
                cursor: not-allowed;
            }
            
            .text-muted {
                color: #666;
                font-size: 12px;
                display: block;
                margin-top: 5px;
            }
            
            .profile-actions {
                display: flex;
                gap: 15px;
                margin-top: 30px;
            }
            
            .profile-actions .auth-btn {
                flex: 1;
                margin-bottom: 0;
            }
            
            .auth-secondary {
                background: #6c757d !important;
            }
            
            .auth-secondary:hover {
                background: #5a6268 !important;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// بدء النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});*/


/*// نظام المصادقة والملف الشخصي المتكامل
class AuthSystem {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 بدء نظام المصادقة...');
        this.setCustomColors();
        this.createAuthModal();
        this.createProfileModal();
        this.setupUserIconListener();
        this.setupModalEvents();
        this.checkAuthStatus();
    }

    setCustomColors() {
        const styles = `
            :root {
                --primary-color: #ea70b1;
                --secondary-color: #a20087;
                --light-color: #f8f9fa;
                --dark-color: #343a40;
                --success-color: #28a745;
                --danger-color: #dc3545;
                --warning-color: #ffc107;
                --info-color: #17a2b8;
            }
            
            .auth-primary { background-color: var(--primary-color) !important; }
            .auth-secondary { background-color: var(--secondary-color) !important; }
            .auth-success { background-color: var(--success-color) !important; }
            .auth-info { background-color: var(--info-color) !important; }
            
            .auth-primary:hover { background-color: var(--secondary-color) !important; }
            .auth-success:hover { background-color: #218838 !important; }
            .auth-info:hover { background-color: #138496 !important; }
            
            .text-primary { color: var(--primary-color) !important; }
            .text-secondary { color: var(--secondary-color) !important; }
            .text-success { color: var(--success-color) !important; }
            .text-danger { color: var(--danger-color) !important; }
            .text-info { color: var(--info-color) !important; }
            
            .registration-badge {
                display: inline-block;
                padding: 3px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: bold;
                margin-right: 8px;
            }
            
            .badge-system { background: var(--info-color); color: white; }
            .badge-manual { background: var(--success-color); color: white; }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupUserIconListener() {
        const userIcons = document.querySelectorAll('.fa-solid.fa-user, .user-icon');
        
        if (userIcons.length > 0) {
            userIcons.forEach(icon => {
                const button = icon.closest('button') || icon;
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('✅ تم النقر على أيقونة المستخدم');
                    this.handleUserClick(button);
                });
            });
        } else {
            console.error('❌ لم يتم العثور على أيقونة المستخدم!');
            this.createUserIcon();
        }
    }

    createUserIcon() {
        const userIcon = document.createElement('button');
        userIcon.className = 'user-icon';
        userIcon.innerHTML = '<i class="fa-solid fa-user"></i>';
        userIcon.style.cssText = `
            background: #f0f0f0;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            margin-left: 10px;
        `;
        
        const header = document.querySelector('.header') || document.body;
        header.appendChild(userIcon);
        
        userIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleUserClick(userIcon);
        });
    }

    handleUserClick(element) {
        if (this.isLoggedIn()) {
            this.showUserMenu(element);
        } else {
            this.showAuthModal();
        }
    }

    showUserMenu(icon) {
        const oldMenu = document.querySelector('.user-menu');
        if (oldMenu) oldMenu.remove();
        
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const badgeText = 'عضو';
        const badgeClass = 'badge-manual';
        
        const menuHTML = `
            <div class="user-menu">
                <div class="user-header">
                    <div class="user-avatar">
                        <i class="fa-solid fa-user-circle"></i>
                    </div>
                    <div class="user-details">
                        <strong>${userData.full_name || userData.name || 'مستخدم'}</strong>
                        <small>${userData.email || ''}</small>
                        <div style="margin-top: 5px;">
                            <span class="registration-badge ${badgeClass}">${badgeText}</span>
                            <small>مسجل منذ ${this.formatJoinDate(userData.created_at)}</small>
                        </div>
                    </div>
                </div>
                
                <div class="menu-section">
                    <div class="menu-items">
                        <button class="user-menu-item" onclick="authSystem.showProfile()">
                            <i class="fa-solid fa-user"></i>
                            حسابي
                        </button>
                        <button class="user-menu-item" onclick="authSystem.showOrders()">
                            <i class="fa-solid fa-box"></i>
                            الطلبات
                            <span class="menu-badge" id="ordersCount">0</span>
                        </button>
                    </div>
                </div>
                
                <div class="menu-items">
                    <button class="user-menu-item logout-btn" onclick="authSystem.handleLogout()">
                        <i class="fa-solid fa-right-from-bracket"></i>
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        `;
        
        const iconContainer = icon.closest('button') || icon;
        const container = iconContainer.parentNode;
        container.style.position = 'relative';
        container.insertAdjacentHTML('beforeend', menuHTML);
        
        const menu = container.querySelector('.user-menu');
        
        this.updateMenuCounts();
        
        setTimeout(() => {
            menu.style.display = 'block';
        }, 10);
        
        const closeMenu = (e) => {
            if (menu && !menu.contains(e.target) && !icon.contains(e.target)) {
                menu.style.display = 'none';
                document.removeEventListener('click', closeMenu);
                setTimeout(() => {
                    if (menu.parentNode) {
                        menu.remove();
                    }
                }, 300);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 10);
    }

    formatJoinDate(dateString) {
        if (!dateString) return 'فترة';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'يوم';
        if (diffDays < 30) return `${diffDays} يوم`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} شهر`;
        return `${Math.floor(diffDays / 365)} سنة`;
    }

    async updateMenuCounts() {
        if (!this.isLoggedIn()) return;

        try {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            
            const response = await fetch('profile.php?action=get_user_stats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userData.id })
            });
            
            if (!response.ok) {
                throw new Error(`خطأ في الشبكة: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                const ordersCount = document.getElementById('ordersCount');
                if (ordersCount) {
                    ordersCount.textContent = result.data.orders_count || 0;
                }
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الإحصائيات:', error);
        }
    }

    createAuthModal() {
        if (document.getElementById('authModal')) return;

        const modalHTML = `
            <div class="auth-modal" id="authModal">
                <div class="auth-content">
                    <button class="auth-close" id="authClose">×</button>
                    
                    <div class="auth-form active" id="loginForm">
                        <h3 class="text-primary">تسجيل الدخول</h3>
                        <form id="loginFormElement">
                            <div class="input-group">
                                <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                            </div>
                            <div class="input-group">
                                <input type="password" name="password" placeholder="كلمة المرور" required>
                            </div>
                            <button type="submit" class="auth-btn auth-primary">
                                <i class="fa-solid fa-right-to-bracket"></i>
                                تسجيل الدخول
                            </button>
                        </form>
                        <div class="auth-switch">
                            ليس لديك حساب؟ 
                            <span class="switch-link text-primary" id="showRegister">إنشاء حساب جديد</span>
                        </div>
                    </div>
                    
                    <div class="auth-form" id="registerForm">
                        <h3 class="text-primary">إنشاء حساب جديد</h3>
                        <p class="register-info">
                            <i class="fa-solid fa-user-plus"></i> سجل بياناتك وسيتم حفظها في قاعدة البيانات
                        </p>
                        <form id="registerFormElement">
                            <div class="input-group">
                                <input type="text" name="full_name" placeholder="الاسم الكامل" required>
                            </div>
                            <div class="input-group">
                                <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                            </div>
                            <div class="input-group">
                                <input type="password" name="password" placeholder="كلمة المرور" required>
                                <small class="password-hint">كلمة المرور يجب أن تكون 6 أحرف على الأقل</small>
                            </div>
                            <div class="input-group">
                                <input type="password" name="confirm_password" placeholder="تأكيد كلمة المرور" required>
                            </div>
                            <div class="input-group">
                                <input type="tel" name="phone" placeholder="رقم الهاتف (اختياري)">
                            </div>
                            <div class="input-group">
                                <input type="date" name="birth_date" placeholder="تاريخ الميلاد">
                            </div>
                            <div class="input-group">
                                <textarea name="address" placeholder="العنوان" rows="3"></textarea>
                            </div>
                            <button type="submit" class="auth-btn auth-primary">
                                <i class="fa-solid fa-user-plus"></i>
                                إنشاء حساب
                            </button>
                        </form>
                        <div class="auth-switch">
                            لديك حساب بالفعل؟ 
                            <span class="switch-link text-primary" id="showLogin">تسجيل الدخول</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addAuthModalStyles();
    }

    createProfileModal() {
        if (document.getElementById('profileModal')) return;

        const modalHTML = `
            <div class="profile-modal" id="profileModal">
                <div class="profile-content">
                    <button class="profile-close" id="profileClose">×</button>
                    
                    <div class="profile-header">
                        <div class="profile-avatar">
                            <i class="fa-solid fa-user-circle"></i>
                        </div>
                        <div class="profile-info">
                            <h3 class="text-primary" id="profileName">الاسم الكامل</h3>
                            <p id="profileEmail">البريد الإلكتروني</p>
                            <div class="profile-badges">
                                <span class="registration-badge" id="profileBadge">عضو</span>
                                <span class="join-date" id="profileJoinDate">مسجل منذ 0 يوم</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="profile-body">
                        <form id="profileForm">
                            <div class="form-section">
                                <h4><i class="fa-solid fa-user"></i> المعلومات الشخصية</h4>
                                <div class="input-row">
                                    <div class="input-group">
                                        <label>الاسم الكامل</label>
                                        <input type="text" name="full_name" id="profileFullName" required>
                                    </div>
                                    <div class="input-group">
                                        <label>البريد الإلكتروني</label>
                                        <input type="email" name="email" id="profileEmailInput" readonly>
                                        <small class="text-muted">لا يمكن تعديل البريد الإلكتروني</small>
                                    </div>
                                </div>
                                
                                <div class="input-row">
                                    <div class="input-group">
                                        <label>رقم الهاتف</label>
                                        <input type="tel" name="phone" id="profilePhone">
                                    </div>
                                    <div class="input-group">
                                        <label>تاريخ الميلاد</label>
                                        <input type="date" name="birth_date" id="profileBirthDate">
                                    </div>
                                </div>
                                
                                <div class="input-group">
                                    <label>العنوان</label>
                                    <textarea name="address" id="profileAddress" rows="3" placeholder="العنوان الكامل"></textarea>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h4><i class="fa-solid fa-lock"></i> تغيير كلمة المرور</h4>
                                <div class="input-row">
                                    <div class="input-group">
                                        <label>كلمة المرور الحالية</label>
                                        <input type="password" name="current_password" placeholder="أدخل كلمة المرور الحالية">
                                    </div>
                                    <div class="input-group">
                                        <label>كلمة المرور الجديدة</label>
                                        <input type="password" name="new_password" placeholder="كلمة المرور الجديدة">
                                    </div>
                                </div>
                                <div class="input-group">
                                    <label>تأكيد كلمة المرور الجديدة</label>
                                    <input type="password" name="confirm_new_password" placeholder="تأكيد كلمة المرور الجديدة">
                                </div>
                                <small class="text-muted">اترك الحقول فارغة إذا لم ترد تغيير كلمة المرور</small>
                            </div>
                            
                            <div class="profile-actions">
                                <button type="submit" class="auth-btn auth-primary">
                                    <i class="fa-solid fa-save"></i>
                                    حفظ التغييرات
                                </button>
                                <button type="button" class="auth-btn auth-secondary" onclick="authSystem.hideProfileModal()">
                                    <i class="fa-solid fa-times"></i>
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addProfileModalStyles();
    }

    setupModalEvents() {
        this.bindAuthEvents();
        this.bindProfileEvents();
    }

    bindAuthEvents() {
        const showRegister = document.getElementById('showRegister');
        const showLogin = document.getElementById('showLogin');
        
        if (showRegister) {
            showRegister.onclick = () => this.showRegisterForm();
        }
        
        if (showLogin) {
            showLogin.onclick = () => this.showLoginForm();
        }
        
        const authClose = document.getElementById('authClose');
        if (authClose) {
            authClose.onclick = () => this.hideAuthModal();
        }
        
        const loginForm = document.getElementById('loginFormElement');
        const registerForm = document.getElementById('registerFormElement');
        
        if (loginForm) {
            loginForm.onsubmit = (e) => {
                e.preventDefault();
                this.handleLogin(e);
            };
        }
        
        if (registerForm) {
            registerForm.onsubmit = (e) => {
                e.preventDefault();
                this.handleRegister(e);
            };
        }
        
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.onclick = (e) => {
                if (e.target.id === 'authModal') {
                    this.hideAuthModal();
                }
            };
        }
    }

    bindProfileEvents() {
        const profileClose = document.getElementById('profileClose');
        if (profileClose) {
            profileClose.onclick = () => this.hideProfileModal();
        }
        
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.onsubmit = (e) => {
                e.preventDefault();
                this.handleProfileUpdate(e);
            };
        }
        
        const profileModal = document.getElementById('profileModal');
        if (profileModal) {
            profileModal.onclick = (e) => {
                if (e.target.id === 'profileModal') {
                    this.hideProfileModal();
                }
            };
        }
    }

    showAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
            this.showLoginForm();
        }
    }

    hideAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    showProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            this.loadProfileData();
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
        }
    }

    hideProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    showLoginForm() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm && registerForm) {
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        }
    }

    showRegisterForm() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm && registerForm) {
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    }

    async handleLogin(e) {
        const formData = new FormData(e.target);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        
        console.log('📤 محاولة تسجيل الدخول:', data);
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري التسجيل...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('auth.php?action=login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            console.log('📥 استجابة الخادم:', response);
            
            let result;
            const responseText = await response.text();
            
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('❌ خطأ في تحويل JSON:', responseText);
                throw new Error('استجابة غير صالحة من الخادم');
            }
            
            console.log('📋 نتيجة التسجيل:', result);
            
            if (result.success) {
                localStorage.setItem('userData', JSON.stringify(result.user));
                this.showMessage('تم تسجيل الدخول بنجاح!', 'success');
                this.hideAuthModal();
                this.checkAuthStatus();
                
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                this.showMessage(result.message || 'فشل تسجيل الدخول', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تسجيل الدخول:', error);
            this.showMessage('حدث خطأ أثناء تسجيل الدخول: ' + error.message, 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleRegister(e) {
        const formData = new FormData(e.target);
        const data = {
            full_name: formData.get('full_name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirm_password: formData.get('confirm_password'),
            phone: formData.get('phone'),
            birth_date: formData.get('birth_date'),
            address: formData.get('address')
        };
        
        console.log('📤 محاولة التسجيل:', data);
        
        if (data.password !== data.confirm_password) {
            this.showMessage('كلمات المرور غير متطابقة', 'error');
            return;
        }
        
        if (data.password.length < 6) {
            this.showMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري إنشاء الحساب...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('auth.php?action=register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            console.log('📥 استجابة التسجيل:', response);
            
            let result;
            const responseText = await response.text();
            
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('❌ خطأ في تحويل JSON:', responseText);
                throw new Error('استجابة غير صالحة من الخادم');
            }
            
            console.log('📋 نتيجة إنشاء الحساب:', result);
            
            if (result.success) {
                this.showMessage('تم إنشاء الحساب بنجاح!', 'success');
                this.showLoginForm();
                
                const emailInput = document.querySelector('#loginForm input[name="email"]');
                if (emailInput) {
                    emailInput.value = data.email;
                }
            } else {
                this.showMessage(result.message || 'فشل إنشاء الحساب', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في إنشاء الحساب:', error);
            this.showMessage('حدث خطأ أثناء إنشاء الحساب: ' + error.message, 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleProfileUpdate(e) {
        const formData = new FormData(e.target);
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        if (!userData || !userData.id) {
            this.showMessage('يجب تسجيل الدخول أولاً', 'error');
            return;
        }

        const data = {
            user_id: userData.id,
            full_name: formData.get('full_name'),
            phone: formData.get('phone'),
            birth_date: formData.get('birth_date'),
            address: formData.get('address'),
            current_password: formData.get('current_password'),
            new_password: formData.get('new_password'),
            confirm_new_password: formData.get('confirm_new_password')
        };
        
        if (data.new_password) {
            if (!data.current_password) {
                this.showMessage('يجب إدخال كلمة المرور الحالية', 'error');
                return;
            }
            
            if (data.new_password !== data.confirm_new_password) {
                this.showMessage('كلمات المرور الجديدة غير متطابقة', 'error');
                return;
            }
            
            if (data.new_password.length < 6) {
                this.showMessage('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل', 'error');
                return;
            }
        }
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الحفظ...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('profile.php?action=update_profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            let result;
            const responseText = await response.text();
            
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('❌ خطأ في تحويل JSON:', responseText);
                throw new Error('استجابة غير صالحة من الخادم');
            }
            
            console.log('📋 نتيجة تحديث الملف:', result);
            
            if (result.success) {
                this.showMessage('تم تحديث البيانات بنجاح!', 'success');
                
                if (result.user) {
                    localStorage.setItem('userData', JSON.stringify(result.user));
                    this.checkAuthStatus();
                }
                
                this.hideProfileModal();
            } else {
                this.showMessage(result.message || 'فشل تحديث البيانات', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الملف الشخصي:', error);
            this.showMessage('حدث خطأ أثناء تحديث البيانات', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    loadProfileData() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        document.getElementById('profileName').textContent = userData.full_name || 'مستخدم';
        document.getElementById('profileEmail').textContent = userData.email || '';
        document.getElementById('profileFullName').value = userData.full_name || '';
        document.getElementById('profileEmailInput').value = userData.email || '';
        document.getElementById('profilePhone').value = userData.phone || '';
        document.getElementById('profileBirthDate').value = userData.birth_date || '';
        document.getElementById('profileAddress').value = userData.address || '';
        
        const badge = document.getElementById('profileBadge');
        if (badge) {
            badge.textContent = 'عضو';
            badge.className = 'registration-badge badge-manual';
        }
        
        const joinDate = document.getElementById('profileJoinDate');
        if (joinDate) {
            joinDate.textContent = `مسجل منذ ${this.formatJoinDate(userData.created_at)}`;
        }
    }

    handleLogout() {
        localStorage.removeItem('userData');
        this.showMessage('تم تسجيل الخروج بنجاح', 'success');
        this.checkAuthStatus();
        
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    isLoggedIn() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        return !!(userData && userData.id);
    }

    checkAuthStatus() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        if (this.isLoggedIn()) {
            console.log('✅ المستخدم مسجل الدخول:', userData);
            this.updateUserInterface();
        } else {
            console.log('❌ المستخدم غير مسجل الدخول');
        }
    }

    updateUserInterface() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        console.log('🔄 تحديث واجهة المستخدم:', userData);
        
        const userIcons = document.querySelectorAll('.fa-solid.fa-user, .user-icon');
        userIcons.forEach(icon => {
            const button = icon.closest('button') || icon;
            button.style.color = 'var(--primary-color)';
            button.title = `مرحباً ${userData.full_name || 'مستخدم'}`;
        });
    }

    showProfile() {
        this.showProfileModal();
    }

    showOrders() {
        this.showMessage('سيتم فتح صفحة الطلبات قريباً', 'info');
    }

    showMessage(message, type) {
        const existingMessages = document.querySelectorAll('.system-message');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.className = `system-message ${type}`;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 4000);
    }

    addAuthModalStyles() {
        if (document.querySelector('#auth-styles')) return;

        const styles = `
            .auth-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .auth-modal.active {
                opacity: 1;
            }
            
            .auth-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 450px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            
            .auth-modal.active .auth-content {
                transform: scale(1);
            }
            
            .auth-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .auth-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .auth-form {
                display: none;
            }
            
            .auth-form.active {
                display: block;
            }
            
            .auth-form h3 {
                text-align: center;
                margin-bottom: 25px;
                color: var(--primary-color);
                font-size: 24px;
                font-weight: bold;
            }
            
            .register-info {
                text-align: center;
                color: #666;
                margin-bottom: 20px;
                font-size: 14px;
            }
            
            .input-group {
                margin-bottom: 15px;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .password-hint {
                color: #666;
                display: block;
                margin-top: 5px;
                font-size: 12px;
            }
            
            .auth-btn {
                width: 100%;
                padding: 15px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: all 0.3s ease;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .auth-btn:hover:not(:disabled) {
                background: var(--secondary-color);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(162, 0, 135, 0.3);
            }
            
            .auth-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }
            
            .auth-switch {
                text-align: center;
                margin-top: 25px;
                color: var(--dark-color);
                font-size: 14px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
            }
            
            .switch-link {
                color: var(--primary-color);
                cursor: pointer;
                font-weight: bold;
                transition: color 0.3s ease;
            }
            
            .switch-link:hover {
                color: var(--secondary-color);
                text-decoration: underline;
            }

            .user-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                padding: 0;
                min-width: 280px;
                z-index: 1000;
                margin-top: 8px;
                border: 2px solid var(--primary-color);
                overflow: hidden;
                display: none;
            }
            
            .user-header {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                padding: 20px;
                color: white;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .user-avatar {
                font-size: 40px;
                opacity: 0.9;
            }
            
            .user-details {
                flex: 1;
            }
            
            .user-details strong {
                display: block;
                font-size: 16px;
                margin-bottom: 4px;
            }
            
            .user-details small {
                font-size: 12px;
                opacity: 0.8;
            }
            
            .menu-section {
                padding: 15px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .menu-items {
                padding: 0;
            }
            
            .user-menu-item {
                display: flex;
                align-items: center;
                padding: 12px 20px;
                color: #333;
                text-decoration: none;
                border: none;
                background: none;
                width: 100%;
                text-align: right;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
                gap: 12px;
                position: relative;
                border-bottom: 1px solid #f8f8f8;
            }
            
            .user-menu-item:last-child {
                border-bottom: none;
            }
            
            .user-menu-item i {
                width: 20px;
                text-align: center;
                color: var(--primary-color);
                font-size: 16px;
            }
            
            .user-menu-item:hover {
                background: var(--light-color);
                transform: translateX(-5px);
            }
            
            .user-menu-item:hover i {
                color: var(--secondary-color);
            }
            
            .logout-btn {
                color: var(--danger-color);
                font-weight: bold;
                margin-top: 0;
            }
            
            .logout-btn i {
                color: var(--danger-color);
            }
            
            .logout-btn:hover {
                background: #ffe6e6;
            }
            
            .menu-badge {
                background: var(--secondary-color);
                color: white;
                border-radius: 12px;
                padding: 2px 8px;
                font-size: 11px;
                font-weight: bold;
                margin-right: auto;
            }

            .system-message {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 15px 25px;
                border-radius: 8px;
                color: white;
                z-index: 10001;
                font-weight: bold;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                animation: slideDown 0.3s ease;
            }
            
            .system-message.success {
                background: var(--success-color);
            }
            
            .system-message.error {
                background: var(--danger-color);
            }
            
            .system-message.info {
                background: var(--info-color);
            }
            
            @keyframes slideDown {
                from {
                    transform: translateX(-50%) translateY(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'auth-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    addProfileModalStyles() {
        if (document.querySelector('#profile-styles')) return;

        const styles = `
            .profile-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .profile-modal.active {
                opacity: 1;
            }
            
            .profile-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 700px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            
            .profile-modal.active .profile-content {
                transform: scale(1);
            }
            
            .profile-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .profile-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .profile-header {
                display: flex;
                align-items: center;
                gap: 20px;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #f0f0f0;
            }
            
            .profile-avatar {
                font-size: 60px;
                color: var(--primary-color);
            }
            
            .profile-info h3 {
                margin: 0 0 5px 0;
                color: var(--primary-color);
            }
            
            .profile-info p {
                margin: 0 0 10px 0;
                color: #666;
            }
            
            .profile-badges {
                display: flex;
                gap: 10px;
                align-items: center;
            }
            
            .join-date {
                font-size: 12px;
                color: #888;
                background: #f8f9fa;
                padding: 3px 8px;
                border-radius: 12px;
            }
            
            .profile-body {
                margin-top: 20px;
            }
            
            .form-section {
                margin-bottom: 30px;
                padding: 20px;
                border: 1px solid #e0e0e0;
                border-radius: 10px;
                background: #fafafa;
            }
            
            .form-section h4 {
                margin: 0 0 20px 0;
                color: var(--primary-color);
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .input-row {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
            }
            
            .input-row .input-group {
                flex: 1;
            }
            
            .input-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #333;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .input-group input[readonly] {
                background-color: #f8f9fa;
                color: #666;
                cursor: not-allowed;
            }
            
            .text-muted {
                color: #666;
                font-size: 12px;
                display: block;
                margin-top: 5px;
            }
            
            .profile-actions {
                display: flex;
                gap: 15px;
                margin-top: 30px;
            }
            
            .profile-actions .auth-btn {
                flex: 1;
                margin-bottom: 0;
            }
            
            .auth-secondary {
                background: #6c757d !important;
            }
            
            .auth-secondary:hover {
                background: #5a6268 !important;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'profile-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// بدء النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});

// جعل النظام متاحاً globally للاستدعاء من الأزرار
window.showAuthModal = () => window.authSystem?.showAuthModal();
window.showProfile = () => window.authSystem?.showProfile();
window.handleLogout = () => window.authSystem?.handleLogout();

// نظام المصادقة والملف الشخصي المتكامل
class AuthSystem {
    constructor() {
        this.demoMode = true; // وضع تجريبي
        this.init();
    }

    init() {
        console.log('🚀 بدء نظام المصادقة...');
        if (this.demoMode) {
            console.log('🔧 النظام في الوضع التجريبي');
        }
        this.setCustomColors();
        this.createAuthModal();
        this.createProfileModal();
        this.setupUserIconListener();
        this.setupModalEvents();
        this.checkAuthStatus();
    }

    setCustomColors() {
        const styles = `
            :root {
                --primary-color: #ea70b1;
                --secondary-color: #a20087;
                --light-color: #f8f9fa;
                --dark-color: #343a40;
                --success-color: #28a745;
                --danger-color: #dc3545;
                --warning-color: #ffc107;
                --info-color: #17a2b8;
            }
            
            .auth-primary { background-color: var(--primary-color) !important; }
            .auth-secondary { background-color: var(--secondary-color) !important; }
            .auth-success { background-color: var(--success-color) !important; }
            .auth-info { background-color: var(--info-color) !important; }
            
            .auth-primary:hover { background-color: var(--secondary-color) !important; }
            .auth-success:hover { background-color: #218838 !important; }
            .auth-info:hover { background-color: #138496 !important; }
            
            .text-primary { color: var(--primary-color) !important; }
            .text-secondary { color: var(--secondary-color) !important; }
            .text-success { color: var(--success-color) !important; }
            .text-danger { color: var(--danger-color) !important; }
            .text-info { color: var(--info-color) !important; }
            
            .registration-badge {
                display: inline-block;
                padding: 3px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: bold;
                margin-right: 8px;
            }
            
            .badge-system { background: var(--info-color); color: white; }
            .badge-manual { background: var(--success-color); color: white; }
            .badge-demo { background: var(--warning-color); color: black; }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupUserIconListener() {
        const userIcons = document.querySelectorAll('.fa-solid.fa-user, .user-icon');
        
        if (userIcons.length > 0) {
            userIcons.forEach(icon => {
                const button = icon.closest('button') || icon;
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('✅ تم النقر على أيقونة المستخدم');
                    this.handleUserClick(button);
                });
            });
        } else {
            console.error('❌ لم يتم العثور على أيقونة المستخدم!');
            this.createUserIcon();
        }
    }

    createUserIcon() {
        const userIcon = document.createElement('button');
        userIcon.className = 'user-icon';
        userIcon.innerHTML = '<i class="fa-solid fa-user"></i>';
        userIcon.style.cssText = `
            background: #f0f0f0;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            margin-left: 10px;
        `;
        
        const header = document.querySelector('.header') || document.body;
        header.appendChild(userIcon);
        
        userIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleUserClick(userIcon);
        });
    }

    handleUserClick(element) {
        if (this.isLoggedIn()) {
            this.showUserMenu(element);
        } else {
            this.showAuthModal();
        }
    }

    showUserMenu(icon) {
        const oldMenu = document.querySelector('.user-menu');
        if (oldMenu) oldMenu.remove();
        
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const badgeText = this.demoMode ? 'تجريبي' : 'عضو';
        const badgeClass = this.demoMode ? 'badge-demo' : 'badge-manual';
        
        const menuHTML = `
            <div class="user-menu">
                <div class="user-header">
                    <div class="user-avatar">
                        <i class="fa-solid fa-user-circle"></i>
                    </div>
                    <div class="user-details">
                        <strong>${userData.full_name || userData.name || 'مستخدم'}</strong>
                        <small>${userData.email || ''}</small>
                        <div style="margin-top: 5px;">
                            <span class="registration-badge ${badgeClass}">${badgeText}</span>
                            <small>مسجل منذ ${this.formatJoinDate(userData.created_at)}</small>
                        </div>
                    </div>
                </div>
                
                <div class="menu-section">
                    <div class="menu-items">
                        <button class="user-menu-item" onclick="authSystem.showProfile()">
                            <i class="fa-solid fa-user"></i>
                            حسابي
                        </button>
                        <button class="user-menu-item" onclick="authSystem.showOrders()">
                            <i class="fa-solid fa-box"></i>
                            الطلبات
                            <span class="menu-badge" id="ordersCount">0</span>
                        </button>
                    </div>
                </div>
                
                <div class="menu-items">
                    <button class="user-menu-item logout-btn" onclick="authSystem.handleLogout()">
                        <i class="fa-solid fa-right-from-bracket"></i>
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        `;
        
        const iconContainer = icon.closest('button') || icon;
        const container = iconContainer.parentNode;
        container.style.position = 'relative';
        container.insertAdjacentHTML('beforeend', menuHTML);
        
        const menu = container.querySelector('.user-menu');
        
        this.updateMenuCounts();
        
        setTimeout(() => {
            menu.style.display = 'block';
        }, 10);
        
        const closeMenu = (e) => {
            if (menu && !menu.contains(e.target) && !icon.contains(e.target)) {
                menu.style.display = 'none';
                document.removeEventListener('click', closeMenu);
                setTimeout(() => {
                    if (menu.parentNode) {
                        menu.remove();
                    }
                }, 300);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 10);
    }

    formatJoinDate(dateString) {
        if (!dateString) return 'فترة';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'يوم';
        if (diffDays < 30) return `${diffDays} يوم`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} شهر`;
        return `${Math.floor(diffDays / 365)} سنة`;
    }

    async updateMenuCounts() {
        if (!this.isLoggedIn()) return;

        try {
            // في الوضع التجريبي، نستخدم بيانات وهمية
            if (this.demoMode) {
                const ordersCount = document.getElementById('ordersCount');
                if (ordersCount) {
                    ordersCount.textContent = '0';
                }
                return;
            }

            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            
            const response = await fetch('profile.php?action=get_user_stats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userData.id })
            });
            
            if (!response.ok) {
                throw new Error(`خطأ في الشبكة: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                const ordersCount = document.getElementById('ordersCount');
                if (ordersCount) {
                    ordersCount.textContent = result.data.orders_count || 0;
                }
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الإحصائيات:', error);
        }
    }

    createAuthModal() {
        if (document.getElementById('authModal')) return;

        const modalHTML = `
            <div class="auth-modal" id="authModal">
                <div class="auth-content">
                    <button class="auth-close" id="authClose">×</button>
                    
                    <div class="auth-form active" id="loginForm">
                        <h3 class="text-primary">تسجيل الدخول</h3>
                        ${this.demoMode ? '<div class="demo-notice"><i class="fa-solid fa-flask"></i> النظام في الوضع التجريبي - يمكنك استخدام أي بيانات</div>' : ''}
                        <form id="loginFormElement">
                            <div class="input-group">
                                <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                            </div>
                            <div class="input-group">
                                <input type="password" name="password" placeholder="كلمة المرور" required>
                            </div>
                            <button type="submit" class="auth-btn auth-primary">
                                <i class="fa-solid fa-right-to-bracket"></i>
                                تسجيل الدخول
                            </button>
                        </form>
                        <div class="auth-switch">
                            ليس لديك حساب؟ 
                            <span class="switch-link text-primary" id="showRegister">إنشاء حساب جديد</span>
                        </div>
                    </div>
                    
                    <div class="auth-form" id="registerForm">
                        <h3 class="text-primary">إنشاء حساب جديد</h3>
                        ${this.demoMode ? '<div class="demo-notice"><i class="fa-solid fa-flask"></i> النظام في الوضع التجريبي - البيانات سيتم حفظها مؤقتاً</div>' : ''}
                        <p class="register-info">
                            <i class="fa-solid fa-user-plus"></i> سجل بياناتك وسيتم حفظها ${this.demoMode ? 'مؤقتاً في المتصفح' : 'في قاعدة البيانات'}
                        </p>
                        <form id="registerFormElement">
                            <div class="input-group">
                                <input type="text" name="full_name" placeholder="الاسم الكامل" required>
                            </div>
                            <div class="input-group">
                                <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                            </div>
                            <div class="input-group">
                                <input type="password" name="password" placeholder="كلمة المرور" required>
                                <small class="password-hint">كلمة المرور يجب أن تكون 6 أحرف على الأقل</small>
                            </div>
                            <div class="input-group">
                                <input type="password" name="confirm_password" placeholder="تأكيد كلمة المرور" required>
                            </div>
                            <div class="input-group">
                                <input type="tel" name="phone" placeholder="رقم الهاتف (اختياري)">
                            </div>
                            <div class="input-group">
                                <input type="date" name="birth_date" placeholder="تاريخ الميلاد">
                            </div>
                            <div class="input-group">
                                <textarea name="address" placeholder="العنوان" rows="3"></textarea>
                            </div>
                            <button type="submit" class="auth-btn auth-primary">
                                <i class="fa-solid fa-user-plus"></i>
                                إنشاء حساب
                            </button>
                        </form>
                        <div class="auth-switch">
                            لديك حساب بالفعل؟ 
                            <span class="switch-link text-primary" id="showLogin">تسجيل الدخول</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addAuthModalStyles();
    }

    createProfileModal() {
        if (document.getElementById('profileModal')) return;

        const modalHTML = `
            <div class="profile-modal" id="profileModal">
                <div class="profile-content">
                    <button class="profile-close" id="profileClose">×</button>
                    
                    <div class="profile-header">
                        <div class="profile-avatar">
                            <i class="fa-solid fa-user-circle"></i>
                        </div>
                        <div class="profile-info">
                            <h3 class="text-primary" id="profileName">الاسم الكامل</h3>
                            <p id="profileEmail">البريد الإلكتروني</p>
                            <div class="profile-badges">
                                <span class="registration-badge" id="profileBadge">${this.demoMode ? 'تجريبي' : 'عضو'}</span>
                                <span class="join-date" id="profileJoinDate">مسجل منذ 0 يوم</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="profile-body">
                        <form id="profileForm">
                            <div class="form-section">
                                <h4><i class="fa-solid fa-user"></i> المعلومات الشخصية</h4>
                                <div class="input-row">
                                    <div class="input-group">
                                        <label>الاسم الكامل</label>
                                        <input type="text" name="full_name" id="profileFullName" required>
                                    </div>
                                    <div class="input-group">
                                        <label>البريد الإلكتروني</label>
                                        <input type="email" name="email" id="profileEmailInput" readonly>
                                        <small class="text-muted">لا يمكن تعديل البريد الإلكتروني</small>
                                    </div>
                                </div>
                                
                                <div class="input-row">
                                    <div class="input-group">
                                        <label>رقم الهاتف</label>
                                        <input type="tel" name="phone" id="profilePhone">
                                    </div>
                                    <div class="input-group">
                                        <label>تاريخ الميلاد</label>
                                        <input type="date" name="birth_date" id="profileBirthDate">
                                    </div>
                                </div>
                                
                                <div class="input-group">
                                    <label>العنوان</label>
                                    <textarea name="address" id="profileAddress" rows="3" placeholder="العنوان الكامل"></textarea>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h4><i class="fa-solid fa-lock"></i> تغيير كلمة المرور</h4>
                                <div class="input-row">
                                    <div class="input-group">
                                        <label>كلمة المرور الحالية</label>
                                        <input type="password" name="current_password" placeholder="أدخل كلمة المرور الحالية">
                                    </div>
                                    <div class="input-group">
                                        <label>كلمة المرور الجديدة</label>
                                        <input type="password" name="new_password" placeholder="كلمة المرور الجديدة">
                                    </div>
                                </div>
                                <div class="input-group">
                                    <label>تأكيد كلمة المرور الجديدة</label>
                                    <input type="password" name="confirm_new_password" placeholder="تأكيد كلمة المرور الجديدة">
                                </div>
                                <small class="text-muted">اترك الحقول فارغة إذا لم ترد تغيير كلمة المرور</small>
                            </div>
                            
                            <div class="profile-actions">
                                <button type="submit" class="auth-btn auth-primary">
                                    <i class="fa-solid fa-save"></i>
                                    حفظ التغييرات
                                </button>
                                <button type="button" class="auth-btn auth-secondary" onclick="authSystem.hideProfileModal()">
                                    <i class="fa-solid fa-times"></i>
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addProfileModalStyles();
    }

    setupModalEvents() {
        this.bindAuthEvents();
        this.bindProfileEvents();
    }

    bindAuthEvents() {
        const showRegister = document.getElementById('showRegister');
        const showLogin = document.getElementById('showLogin');
        
        if (showRegister) {
            showRegister.onclick = () => this.showRegisterForm();
        }
        
        if (showLogin) {
            showLogin.onclick = () => this.showLoginForm();
        }
        
        const authClose = document.getElementById('authClose');
        if (authClose) {
            authClose.onclick = () => this.hideAuthModal();
        }
        
        const loginForm = document.getElementById('loginFormElement');
        const registerForm = document.getElementById('registerFormElement');
        
        if (loginForm) {
            loginForm.onsubmit = (e) => {
                e.preventDefault();
                this.handleLogin(e);
            };
        }
        
        if (registerForm) {
            registerForm.onsubmit = (e) => {
                e.preventDefault();
                this.handleRegister(e);
            };
        }
        
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.onclick = (e) => {
                if (e.target.id === 'authModal') {
                    this.hideAuthModal();
                }
            };
        }
    }

    bindProfileEvents() {
        const profileClose = document.getElementById('profileClose');
        if (profileClose) {
            profileClose.onclick = () => this.hideProfileModal();
        }
        
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.onsubmit = (e) => {
                e.preventDefault();
                this.handleProfileUpdate(e);
            };
        }
        
        const profileModal = document.getElementById('profileModal');
        if (profileModal) {
            profileModal.onclick = (e) => {
                if (e.target.id === 'profileModal') {
                    this.hideProfileModal();
                }
            };
        }
    }

    showAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
            this.showLoginForm();
        }
    }

    hideAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    showProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            this.loadProfileData();
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
        }
    }

    hideProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    showLoginForm() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm && registerForm) {
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        }
    }

    showRegisterForm() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm && registerForm) {
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    }

    async handleLogin(e) {
        const formData = new FormData(e.target);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        
        console.log('📤 محاولة تسجيل الدخول:', data);
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري التسجيل...';
        submitBtn.disabled = true;
        
        try {
            let result;
            
            if (this.demoMode) {
                // وضع تجريبي - لا حاجة للاتصال بالخادم
                await new Promise(resolve => setTimeout(resolve, 1000)); // محاكاة الانتظار
                
                result = {
                    success: true,
                    message: 'تم تسجيل الدخول بنجاح (وضع تجريبي)',
                    user: {
                        id: 1,
                        full_name: data.email.split('@')[0],
                        email: data.email,
                        phone: '',
                        birth_date: '',
                        address: '',
                        created_at: new Date().toISOString()
                    }
                };
            } else {
                // الوضع العادي - الاتصال بالخادم
                const response = await fetch('auth.php?action=login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                console.log('📥 استجابة الخادم:', response);
                
                let result;
                const responseText = await response.text();
                
                try {
                    result = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('❌ خطأ في تحويل JSON:', responseText);
                    throw new Error('استجابة غير صالحة من الخادم');
                }
            }
            
            console.log('📋 نتيجة التسجيل:', result);
            
            if (result.success) {
                localStorage.setItem('userData', JSON.stringify(result.user));
                this.showMessage('تم تسجيل الدخول بنجاح!', 'success');
                this.hideAuthModal();
                this.checkAuthStatus();
                
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                this.showMessage(result.message || 'فشل تسجيل الدخول', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تسجيل الدخول:', error);
            this.showMessage('حدث خطأ أثناء تسجيل الدخول: ' + error.message, 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleRegister(e) {
        const formData = new FormData(e.target);
        const data = {
            full_name: formData.get('full_name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirm_password: formData.get('confirm_password'),
            phone: formData.get('phone'),
            birth_date: formData.get('birth_date'),
            address: formData.get('address')
        };
        
        console.log('📤 محاولة التسجيل:', data);
        
        if (data.password !== data.confirm_password) {
            this.showMessage('كلمات المرور غير متطابقة', 'error');
            return;
        }
        
        if (data.password.length < 6) {
            this.showMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري إنشاء الحساب...';
        submitBtn.disabled = true;
        
        try {
            let result;
            
            if (this.demoMode) {
                // وضع تجريبي - لا حاجة للاتصال بالخادم
                await new Promise(resolve => setTimeout(resolve, 1000)); // محاكاة الانتظار
                
                result = {
                    success: true,
                    message: 'تم إنشاء الحساب بنجاح (وضع تجريبي)'
                };
            } else {
                // الوضع العادي - الاتصال بالخادم
                const response = await fetch('auth.php?action=register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                console.log('📥 استجابة التسجيل:', response);
                
                let result;
                const responseText = await response.text();
                
                try {
                    result = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('❌ خطأ في تحويل JSON:', responseText);
                    throw new Error('استجابة غير صالحة من الخادم');
                }
            }
            
            console.log('📋 نتيجة إنشاء الحساب:', result);
            
            if (result.success) {
                this.showMessage('تم إنشاء الحساب بنجاح!', 'success');
                this.showLoginForm();
                
                const emailInput = document.querySelector('#loginForm input[name="email"]');
                if (emailInput) {
                    emailInput.value = data.email;
                }
            } else {
                this.showMessage(result.message || 'فشل إنشاء الحساب', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في إنشاء الحساب:', error);
            this.showMessage('حدث خطأ أثناء إنشاء الحساب: ' + error.message, 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleProfileUpdate(e) {
        const formData = new FormData(e.target);
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        if (!userData || !userData.id) {
            this.showMessage('يجب تسجيل الدخول أولاً', 'error');
            return;
        }

        const data = {
            user_id: userData.id,
            full_name: formData.get('full_name'),
            phone: formData.get('phone'),
            birth_date: formData.get('birth_date'),
            address: formData.get('address'),
            current_password: formData.get('current_password'),
            new_password: formData.get('new_password'),
            confirm_new_password: formData.get('confirm_new_password')
        };
        
        if (data.new_password) {
            if (!data.current_password) {
                this.showMessage('يجب إدخال كلمة المرور الحالية', 'error');
                return;
            }
            
            if (data.new_password !== data.confirm_new_password) {
                this.showMessage('كلمات المرور الجديدة غير متطابقة', 'error');
                return;
            }
            
            if (data.new_password.length < 6) {
                this.showMessage('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل', 'error');
                return;
            }
        }
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الحفظ...';
        submitBtn.disabled = true;
        
        try {
            let result;
            
            if (this.demoMode) {
                // وضع تجريبي - تحديث البيانات محلياً
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const updatedUser = {
                    ...userData,
                    full_name: data.full_name,
                    phone: data.phone,
                    birth_date: data.birth_date,
                    address: data.address
                };
                
                result = {
                    success: true,
                    message: 'تم تحديث البيانات بنجاح (وضع تجريبي)',
                    user: updatedUser
                };
            } else {
                // الوضع العادي - الاتصال بالخادم
                const response = await fetch('profile.php?action=update_profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                let result;
                const responseText = await response.text();
                
                try {
                    result = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('❌ خطأ في تحويل JSON:', responseText);
                    throw new Error('استجابة غير صالحة من الخادم');
                }
            }
            
            console.log('📋 نتيجة تحديث الملف:', result);
            
            if (result.success) {
                this.showMessage('تم تحديث البيانات بنجاح!', 'success');
                
                if (result.user) {
                    localStorage.setItem('userData', JSON.stringify(result.user));
                    this.checkAuthStatus();
                }
                
                this.hideProfileModal();
            } else {
                this.showMessage(result.message || 'فشل تحديث البيانات', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الملف الشخصي:', error);
            this.showMessage('حدث خطأ أثناء تحديث البيانات', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    loadProfileData() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        document.getElementById('profileName').textContent = userData.full_name || 'مستخدم';
        document.getElementById('profileEmail').textContent = userData.email || '';
        document.getElementById('profileFullName').value = userData.full_name || '';
        document.getElementById('profileEmailInput').value = userData.email || '';
        document.getElementById('profilePhone').value = userData.phone || '';
        document.getElementById('profileBirthDate').value = userData.birth_date || '';
        document.getElementById('profileAddress').value = userData.address || '';
        
        const badge = document.getElementById('profileBadge');
        if (badge) {
            badge.textContent = this.demoMode ? 'تجريبي' : 'عضو';
            badge.className = `registration-badge ${this.demoMode ? 'badge-demo' : 'badge-manual'}`;
        }
        
        const joinDate = document.getElementById('profileJoinDate');
        if (joinDate) {
            joinDate.textContent = `مسجل منذ ${this.formatJoinDate(userData.created_at)}`;
        }
    }

    handleLogout() {
        localStorage.removeItem('userData');
        this.showMessage('تم تسجيل الخروج بنجاح', 'success');
        this.checkAuthStatus();
        
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    isLoggedIn() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        return !!(userData && userData.id);
    }

    checkAuthStatus() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        if (this.isLoggedIn()) {
            console.log('✅ المستخدم مسجل الدخول:', userData);
            this.updateUserInterface();
        } else {
            console.log('❌ المستخدم غير مسجل الدخول');
        }
    }

    updateUserInterface() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        console.log('🔄 تحديث واجهة المستخدم:', userData);
        
        const userIcons = document.querySelectorAll('.fa-solid.fa-user, .user-icon');
        userIcons.forEach(icon => {
            const button = icon.closest('button') || icon;
            button.style.color = 'var(--primary-color)';
            button.title = `مرحباً ${userData.full_name || 'مستخدم'}`;
        });
    }

    showProfile() {
        this.showProfileModal();
    }

    showOrders() {
        this.showMessage('سيتم فتح صفحة الطلبات قريباً', 'info');
    }

    showMessage(message, type) {
        const existingMessages = document.querySelectorAll('.system-message');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.className = `system-message ${type}`;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 4000);
    }

    addAuthModalStyles() {
        if (document.querySelector('#auth-styles')) return;

        const styles = `
            .auth-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .auth-modal.active {
                opacity: 1;
            }
            
            .auth-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 450px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            
            .auth-modal.active .auth-content {
                transform: scale(1);
            }
            
            .auth-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .auth-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .auth-form {
                display: none;
            }
            
            .auth-form.active {
                display: block;
            }
            
            .auth-form h3 {
                text-align: center;
                margin-bottom: 25px;
                color: var(--primary-color);
                font-size: 24px;
                font-weight: bold;
            }
            
            .demo-notice {
                background: var(--warning-color);
                color: black;
                padding: 10px;
                border-radius: 8px;
                margin-bottom: 15px;
                text-align: center;
                font-size: 14px;
                font-weight: bold;
            }
            
            .register-info {
                text-align: center;
                color: #666;
                margin-bottom: 20px;
                font-size: 14px;
            }
            
            .input-group {
                margin-bottom: 15px;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .password-hint {
                color: #666;
                display: block;
                margin-top: 5px;
                font-size: 12px;
            }
            
            .auth-btn {
                width: 100%;
                padding: 15px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: all 0.3s ease;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .auth-btn:hover:not(:disabled) {
                background: var(--secondary-color);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(162, 0, 135, 0.3);
            }
            
            .auth-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }
            
            .auth-switch {
                text-align: center;
                margin-top: 25px;
                color: var(--dark-color);
                font-size: 14px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
            }
            
            .switch-link {
                color: var(--primary-color);
                cursor: pointer;
                font-weight: bold;
                transition: color 0.3s ease;
            }
            
            .switch-link:hover {
                color: var(--secondary-color);
                text-decoration: underline;
            }

            .user-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                padding: 0;
                min-width: 280px;
                z-index: 1000;
                margin-top: 8px;
                border: 2px solid var(--primary-color);
                overflow: hidden;
                display: none;
            }
            
            .user-header {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                padding: 20px;
                color: white;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .user-avatar {
                font-size: 40px;
                opacity: 0.9;
            }
            
            .user-details {
                flex: 1;
            }
            
            .user-details strong {
                display: block;
                font-size: 16px;
                margin-bottom: 4px;
            }
            
            .user-details small {
                font-size: 12px;
                opacity: 0.8;
            }
            
            .menu-section {
                padding: 15px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .menu-items {
                padding: 0;
            }
            
            .user-menu-item {
                display: flex;
                align-items: center;
                padding: 12px 20px;
                color: #333;
                text-decoration: none;
                border: none;
                background: none;
                width: 100%;
                text-align: right;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
                gap: 12px;
                position: relative;
                border-bottom: 1px solid #f8f8f8;
            }
            
            .user-menu-item:last-child {
                border-bottom: none;
            }
            
            .user-menu-item i {
                width: 20px;
                text-align: center;
                color: var(--primary-color);
                font-size: 16px;
            }
            
            .user-menu-item:hover {
                background: var(--light-color);
                transform: translateX(-5px);
            }
            
            .user-menu-item:hover i {
                color: var(--secondary-color);
            }
            
            .logout-btn {
                color: var(--danger-color);
                font-weight: bold;
                margin-top: 0;
            }
            
            .logout-btn i {
                color: var(--danger-color);
            }
            
            .logout-btn:hover {
                background: #ffe6e6;
            }
            
            .menu-badge {
                background: var(--secondary-color);
                color: white;
                border-radius: 12px;
                padding: 2px 8px;
                font-size: 11px;
                font-weight: bold;
                margin-right: auto;
            }

            .system-message {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 15px 25px;
                border-radius: 8px;
                color: white;
                z-index: 10001;
                font-weight: bold;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                animation: slideDown 0.3s ease;
            }
            
            .system-message.success {
                background: var(--success-color);
            }
            
            .system-message.error {
                background: var(--danger-color);
            }
            
            .system-message.info {
                background: var(--info-color);
            }
            
            @keyframes slideDown {
                from {
                    transform: translateX(-50%) translateY(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'auth-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    addProfileModalStyles() {
        if (document.querySelector('#profile-styles')) return;

        const styles = `
            .profile-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .profile-modal.active {
                opacity: 1;
            }
            
            .profile-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 700px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            
            .profile-modal.active .profile-content {
                transform: scale(1);
            }
            
            .profile-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .profile-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .profile-header {
                display: flex;
                align-items: center;
                gap: 20px;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #f0f0f0;
            }
            
            .profile-avatar {
                font-size: 60px;
                color: var(--primary-color);
            }
            
            .profile-info h3 {
                margin: 0 0 5px 0;
                color: var(--primary-color);
            }
            
            .profile-info p {
                margin: 0 0 10px 0;
                color: #666;
            }
            
            .profile-badges {
                display: flex;
                gap: 10px;
                align-items: center;
            }
            
            .join-date {
                font-size: 12px;
                color: #888;
                background: #f8f9fa;
                padding: 3px 8px;
                border-radius: 12px;
            }
            
            .profile-body {
                margin-top: 20px;
            }
            
            .form-section {
                margin-bottom: 30px;
                padding: 20px;
                border: 1px solid #e0e0e0;
                border-radius: 10px;
                background: #fafafa;
            }
            
            .form-section h4 {
                margin: 0 0 20px 0;
                color: var(--primary-color);
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .input-row {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
            }
            
            .input-row .input-group {
                flex: 1;
            }
            
            .input-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #333;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .input-group input[readonly] {
                background-color: #f8f9fa;
                color: #666;
                cursor: not-allowed;
            }
            
            .text-muted {
                color: #666;
                font-size: 12px;
                display: block;
                margin-top: 5px;
            }
            
            .profile-actions {
                display: flex;
                gap: 15px;
                margin-top: 30px;
            }
            
            .profile-actions .auth-btn {
                flex: 1;
                margin-bottom: 0;
            }
            
            .auth-secondary {
                background: #6c757d !important;
            }
            
            .auth-secondary:hover {
                background: #5a6268 !important;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'profile-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// بدء النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});

// جعل النظام متاحاً globally للاستدعاء من الأزرار
window.showAuthModal = () => window.authSystem?.showAuthModal();
window.showProfile = () => window.authSystem?.showProfile();
window.handleLogout = () => window.authSystem?.handleLogout();





































































































































































































































// نظام المصادقة والملف الشخصي المتكامل - يدعم جميع أوضاع التصفح
/*class AuthSystem {
    constructor() {
        this.storage = this.getSafeStorage();
        this.init();
    }

    init() {
        console.log('🚀 بدء نظام المصادقة...');
        this.setCustomColors();
        this.createAuthModal();
        this.createProfileModal();
        this.setupUserIconListener();
        this.setupModalEvents();
        this.checkAuthStatus();
    }

    // نظام تخزين آمن يعمل في جميع الظروف
    getSafeStorage() {
        const self = this;
        
        const storageMethods = {
            // دالة تخزين آمنة
            setItem: (key, value) => {
                try {
                    // المحاولة الأولى: localStorage
                    if (typeof localStorage !== 'undefined') {
                        localStorage.setItem(key, value);
                        console.log('✅ تم التخزين في localStorage');
                        return true;
                    }
                } catch (e) {
                    console.warn('⚠️ localStorage غير متاح:', e.message);
                }
                
                try {
                    // المحاولة الثانية: sessionStorage
                    if (typeof sessionStorage !== 'undefined') {
                        sessionStorage.setItem(key, value);
                        console.log('✅ تم التخزين في sessionStorage');
                        return true;
                    }
                } catch (e) {
                    console.warn('⚠️ sessionStorage غير متاح:', e.message);
                }
                
                try {
                    // المحاولة الثالثة: Cookies
                    self.setCookie(key, value, 7);
                    console.log('✅ تم التخزين في Cookies');
                    return true;
                } catch (e) {
                    console.error('❌ فشل جميع طرق التخزين:', e.message);
                    return false;
                }
            },
            
            // دالة استرجاع آمنة
            getItem: (key) => {
                try {
                    // المحاولة الأولى: localStorage
                    if (typeof localStorage !== 'undefined') {
                        const item = localStorage.getItem(key);
                        if (item) {
                            console.log('✅ تم الاسترجاع من localStorage');
                            return item;
                        }
                    }
                } catch (e) {
                    console.warn('⚠️ خطأ في localStorage:', e.message);
                }
                
                try {
                    // المحاولة الثانية: sessionStorage
                    if (typeof sessionStorage !== 'undefined') {
                        const item = sessionStorage.getItem(key);
                        if (item) {
                            console.log('✅ تم الاسترجاع من sessionStorage');
                            return item;
                        }
                    }
                } catch (e) {
                    console.warn('⚠️ خطأ في sessionStorage:', e.message);
                }
                
                // المحاولة الثالثة: Cookies
                const cookieValue = self.getCookie(key);
                if (cookieValue) {
                    console.log('✅ تم الاسترجاع من Cookies');
                    return cookieValue;
                }
                
                return null;
            },
            
            // دالة حذف آمنة
            removeItem: (key) => {
                try {
                    if (typeof localStorage !== 'undefined') {
                        localStorage.removeItem(key);
                    }
                } catch (e) {
                    console.warn('⚠️ خطأ في حذف localStorage:', e.message);
                }
                
                try {
                    if (typeof sessionStorage !== 'undefined') {
                        sessionStorage.removeItem(key);
                    }
                } catch (e) {
                    console.warn('⚠️ خطأ في حذف sessionStorage:', e.message);
                }
                
                // حذف الكوكيز
                self.deleteCookie(key);
            }
        };
        
        return storageMethods;
    }

    // دوال الكوكيز المساعدة
    setCookie(name, value, days) {
        try {
            const expires = new Date();
            expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
            const cookieValue = encodeURIComponent(value) + (days ? `; expires=${expires.toUTCString()}` : '');
            document.cookie = `${name}=${cookieValue}; path=/; samesite=strict`;
            return true;
        } catch (e) {
            console.error('❌ خطأ في حفظ الكوكي:', e);
            return false;
        }
    }

    getCookie(name) {
        try {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for(let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) {
                    return decodeURIComponent(c.substring(nameEQ.length, c.length));
                }
            }
            return null;
        } catch (e) {
            console.error('❌ خطأ في قراءة الكوكي:', e);
            return null;
        }
    }

    deleteCookie(name) {
        try {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
            return true;
        } catch (e) {
            console.error('❌ خطأ في حذف الكوكي:', e);
            return false;
        }
    }

    // اختبار نظام التخزين
    testStorage() {
        const testKey = 'auth_storage_test';
        const testValue = 'test_value';
        
        console.log('🧪 اختبار نظام التخزين...');
        
        // اختبار الحفظ
        const saveResult = this.storage.setItem(testKey, testValue);
        console.log('نتيجة الحفظ:', saveResult);
        
        // اختبار الاسترجاع
        const retrievedValue = this.storage.getItem(testKey);
        console.log('نتيجة الاسترجاع:', retrievedValue);
        
        // اختبار الحذف
        this.storage.removeItem(testKey);
        console.log('تم اختبار الحذف');
        
        return saveResult && retrievedValue === testValue;
    }

    // استخدام نظام التخزين الآمن
    setAuthData(token, userData) {
        console.log('💾 محاولة حفظ بيانات المصادقة...');
        
        const tokenSaved = this.storage.setItem('authToken', token);
        const userSaved = this.storage.setItem('userData', JSON.stringify(userData));
        
        if (!tokenSaved || !userSaved) {
            console.warn('⚠️ تم استخدام تخزين بديل للبيانات');
            this.showMessage('تم حفظ البيانات في جلسة التصفح الحالية فقط', 'info');
        } else {
            console.log('✅ تم حفظ بيانات المصادقة بنجاح');
        }
        
        return tokenSaved && userSaved;
    }

    getAuthData() {
        const token = this.storage.getItem('authToken');
        const userDataStr = this.storage.getItem('userData');
        
        let userData = null;
        try {
            userData = userDataStr ? JSON.parse(userDataStr) : null;
        } catch (e) {
            console.error('❌ خطأ في تحليل بيانات المستخدم:', e);
            userData = null;
        }
        
        return {
            token,
            userData
        };
    }

    clearAuthData() {
        console.log('🗑️ حذف بيانات المصادقة...');
        this.storage.removeItem('authToken');
        this.storage.removeItem('userData');
    }

    setCustomColors() {
        const styles = `
            :root {
                --primary-color: #ea70b1;
                --secondary-color: #a20087;
                --light-color: #f8f9fa;
                --dark-color: #343a40;
                --success-color: #28a745;
                --danger-color: #dc3545;
                --warning-color: #ffc107;
                --info-color: #17a2b8;
            }
            
            .auth-primary { background-color: var(--primary-color) !important; }
            .auth-secondary { background-color: var(--secondary-color) !important; }
            .auth-success { background-color: var(--success-color) !important; }
            .auth-info { background-color: var(--info-color) !important; }
            
            .auth-primary:hover { background-color: var(--secondary-color) !important; }
            .auth-success:hover { background-color: #218838 !important; }
            .auth-info:hover { background-color: #138496 !important; }
            
            .text-primary { color: var(--primary-color) !important; }
            .text-secondary { color: var(--secondary-color) !important; }
            .text-success { color: var(--success-color) !important; }
            .text-danger { color: var(--danger-color) !important; }
            .text-info { color: var(--info-color) !important; }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupUserIconListener() {
        const userIcons = document.querySelectorAll('.fa-solid.fa-user, .user-icon');
        
        if (userIcons.length > 0) {
            userIcons.forEach(icon => {
                const button = icon.closest('button') || icon;
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('✅ تم النقر على أيقونة المستخدم');
                    this.handleUserClick(button);
                });
            });
        } else {
            console.error('❌ لم يتم العثور على أيقونة المستخدم!');
            this.createUserIcon();
        }
    }

    createUserIcon() {
        const userIcon = document.createElement('button');
        userIcon.className = 'user-icon';
        userIcon.innerHTML = '<i class="fa-solid fa-user"></i>';
        userIcon.style.cssText = `
            background: #f0f0f0;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            margin-left: 10px;
        `;
        
        document.querySelector('.header')?.appendChild(userIcon);
        this.setupUserIconListener();
    }

    handleUserClick(element) {
        if (this.isLoggedIn()) {
            this.showUserMenu(element);
        } else {
            this.showAuthModal();
        }
    }

    showUserMenu(icon) {
        const oldMenu = document.querySelector('.user-menu');
        if (oldMenu) oldMenu.remove();
        
        const { userData } = this.getAuthData();
        
        const menuHTML = `
            <div class="user-menu">
                <div class="user-header">
                    <div class="user-avatar">
                        <i class="fa-solid fa-user-circle"></i>
                    </div>
                    <div class="user-details">
                        <strong>${userData?.full_name || userData?.name || 'مستخدم'}</strong>
                        <small>${userData?.email || ''}</small>
                    </div>
                </div>
                
                <div class="menu-section">
                    <div class="menu-items">
                        <button class="user-menu-item" onclick="authSystem.showProfile()">
                            <i class="fa-solid fa-user"></i>
                            حسابي
                        </button>
                        <button class="user-menu-item" onclick="authSystem.showOrders()">
                            <i class="fa-solid fa-box"></i>
                            الطلبات
                            <span class="menu-badge" id="ordersCount">0</span>
                        </button>
                    </div>
                </div>
                
                <div class="menu-items">
                    <button class="user-menu-item logout-btn" onclick="authSystem.handleLogout()">
                        <i class="fa-solid fa-right-from-bracket"></i>
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        `;
        
        const iconContainer = icon.closest('button') || icon;
        const container = iconContainer.parentNode;
        container.style.position = 'relative';
        container.insertAdjacentHTML('beforeend', menuHTML);
        
        const menu = container.querySelector('.user-menu');
        
        this.updateMenuCounts();
        
        setTimeout(() => {
            menu.style.display = 'block';
        }, 10);
        
        const closeMenu = (e) => {
            if (menu && !menu.contains(e.target) && !icon.contains(e.target)) {
                menu.style.display = 'none';
                document.removeEventListener('click', closeMenu);
                setTimeout(() => {
                    if (menu.parentNode) {
                        menu.remove();
                    }
                }, 300);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 10);
    }

    async updateMenuCounts() {
        if (!this.isLoggedIn()) return;

        try {
            const response = await fetch('profile.php?action=get_user_stats');
            
            if (!response.ok) {
                throw new Error(`خطأ في الشبكة: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                const ordersCount = document.getElementById('ordersCount');
                if (ordersCount) {
                    ordersCount.textContent = data.data.orders_count || 0;
                }
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الإحصائيات:', error);
            const ordersCount = document.getElementById('ordersCount');
            if (ordersCount) {
                ordersCount.textContent = '0';
            }
        }
    }

    createAuthModal() {
        if (!document.getElementById('authModal')) {
            const modalHTML = `
                <div class="auth-modal" id="authModal">
                    <div class="auth-content">
                        <button class="auth-close" id="authClose">×</button>
                        
                        <div class="auth-form active" id="loginForm">
                            <h3 class="text-primary">تسجيل الدخول</h3>
                            <div class="demo-accounts">
                                <h4><i class="fa-solid fa-key"></i> حسابات تجريبية:</h4>
                                <div class="demo-accounts-list">
                                    <div><strong>ahmed@example.com</strong> / password123</div>
                                    <div><strong>fatima@example.com</strong> / password123</div>
                                    <small>أو سجل حساب جديد أدناه</small>
                                </div>
                            </div>
                            <form id="loginFormElement">
                                <div class="input-group">
                                    <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                                </div>
                                <div class="input-group">
                                    <input type="password" name="password" placeholder="كلمة المرور" required>
                                </div>
                                <button type="submit" class="auth-btn auth-primary">
                                    <i class="fa-solid fa-right-to-bracket"></i>
                                    تسجيل الدخول
                                </button>
                            </form>
                            <div class="auth-switch">
                                ليس لديك حساب؟ 
                                <span class="switch-link text-primary" id="showRegister">إنشاء حساب جديد</span>
                            </div>
                        </div>
                        
                        <div class="auth-form" id="registerForm">
                            <h3 class="text-primary">إنشاء حساب جديد</h3>
                            <form id="registerFormElement">
                                <div class="input-group">
                                    <input type="text" name="fullname" placeholder="الاسم الكامل" required>
                                </div>
                                <div class="input-group">
                                    <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                                </div>
                                <div class="input-group">
                                    <input type="password" name="password" placeholder="كلمة المرور" required>
                                </div>
                                <div class="input-group">
                                    <input type="password" name="confirm_password" placeholder="تأكيد كلمة المرور" required>
                                </div>
                                <div class="input-group">
                                    <input type="tel" name="phone" placeholder="رقم الهاتف">
                                </div>
                                <div class="input-group">
                                    <input type="date" name="birth_date" placeholder="تاريخ الميلاد">
                                </div>
                                <div class="input-group">
                                    <textarea name="address" placeholder="العنوان" rows="3"></textarea>
                                </div>
                                <button type="submit" class="auth-btn auth-primary">
                                    <i class="fa-solid fa-user-plus"></i>
                                    إنشاء حساب
                                </button>
                            </form>
                            <div class="auth-switch">
                                لديك حساب بالفعل؟ 
                                <span class="switch-link text-primary" id="showLogin">تسجيل الدخول</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            this.addAuthModalStyles();
        }
    }

    createProfileModal() {
        if (!document.getElementById('profileModal')) {
            const modalHTML = `
                <div class="profile-modal" id="profileModal">
                    <div class="profile-content">
                        <button class="profile-close" id="profileClose">×</button>
                        
                        <div class="profile-header">
                            <div class="profile-avatar">
                                <i class="fa-solid fa-user-circle"></i>
                            </div>
                            <div class="profile-info">
                                <h3 class="text-primary" id="profileName">الاسم الكامل</h3>
                                <p id="profileEmail">البريد الإلكتروني</p>
                            </div>
                        </div>
                        
                        <div class="profile-body">
                            <form id="profileForm">
                                <div class="form-section">
                                    <h4><i class="fa-solid fa-user"></i> المعلومات الشخصية</h4>
                                    <div class="input-row">
                                        <div class="input-group">
                                            <label>الاسم الكامل</label>
                                            <input type="text" name="full_name" id="profileFullName" required>
                                        </div>
                                        <div class="input-group">
                                            <label>البريد الإلكتروني</label>
                                            <input type="email" name="email" id="profileEmailInput" readonly>
                                            <small class="text-muted">لا يمكن تعديل البريد الإلكتروني</small>
                                        </div>
                                    </div>
                                    
                                    <div class="input-row">
                                        <div class="input-group">
                                            <label>رقم الهاتف</label>
                                            <input type="tel" name="phone" id="profilePhone" placeholder="أدخل رقم الهاتف">
                                        </div>
                                        <div class="input-group">
                                            <label>تاريخ الميلاد</label>
                                            <input type="date" name="birth_date" id="profileBirthDate">
                                        </div>
                                    </div>
                                    
                                    <div class="input-group">
                                        <label>العنوان</label>
                                        <textarea name="address" id="profileAddress" rows="3" placeholder="العنوان الكامل"></textarea>
                                    </div>
                                </div>
                                
                                <div class="profile-actions">
                                    <button type="submit" class="auth-btn auth-primary">
                                        <i class="fa-solid fa-save"></i>
                                        حفظ التغييرات
                                    </button>
                                    <button type="button" class="auth-btn auth-secondary" onclick="authSystem.hideProfileModal()">
                                        <i class="fa-solid fa-times"></i>
                                        إلغاء
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            this.addProfileModalStyles();
        }
    }

    setupModalEvents() {
        // أحداث التبديل بين النماذج
        document.getElementById('showRegister')?.addEventListener('click', () => {
            this.showRegisterForm();
        });
        
        document.getElementById('showLogin')?.addEventListener('click', () => {
            this.showLoginForm();
        });
        
        // أحداث الإغلاق
        document.getElementById('authClose')?.addEventListener('click', () => {
            this.hideAuthModal();
        });
        
        document.getElementById('profileClose')?.addEventListener('click', () => {
            this.hideProfileModal();
        });
        
        // أحداث النماذج
        document.getElementById('loginFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e);
        });
        
        document.getElementById('registerFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e);
        });
        
        document.getElementById('profileForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProfileUpdate(e);
        });
        
        // إغلاق النوافذ عند النقر خارجها
        document.getElementById('authModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'authModal') {
                this.hideAuthModal();
            }
        });
        
        document.getElementById('profileModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'profileModal') {
                this.hideProfileModal();
            }
        });
    }

    showAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.add('active');
            this.showLoginForm();
        }
    }

    hideAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    showProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            this.loadProfileData();
            modal.classList.add('active');
        }
    }

    hideProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    showLoginForm() {
        document.getElementById('loginForm').classList.add('active');
        document.getElementById('registerForm').classList.remove('active');
    }

    showRegisterForm() {
        document.getElementById('registerForm').classList.add('active');
        document.getElementById('loginForm').classList.remove('active');
    }

    async handleLogin(e) {
        const formData = new FormData(e.target);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        
        try {
            const response = await fetch('auth.php?action=login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // استخدام النظام الآمن للتخزين
                this.setAuthData(result.token, result.user);
                this.showMessage('تم تسجيل الدخول بنجاح!', 'success');
                this.hideAuthModal();
                this.checkAuthStatus();
                
                // إعادة تحميل الصفحة لتحديث الواجهة
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                this.showMessage(result.message || 'فشل تسجيل الدخول', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تسجيل الدخول:', error);
            this.showMessage('حدث خطأ أثناء تسجيل الدخول', 'error');
        }
    }

    async handleRegister(e) {
        const formData = new FormData(e.target);
        const data = {
            full_name: formData.get('fullname'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirm_password: formData.get('confirm_password'),
            phone: formData.get('phone'),
            birth_date: formData.get('birth_date'),
            address: formData.get('address')
        };
        
        if (data.password !== data.confirm_password) {
            this.showMessage('كلمات المرور غير متطابقة', 'error');
            return;
        }
        
        if (data.password.length < 6) {
            this.showMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }
        
        try {
            const response = await fetch('auth.php?action=register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // تسجيل الدخول تلقائياً بعد التسجيل باستخدام النظام الآمن
                this.setAuthData(result.token, result.user);
                this.showMessage('تم إنشاء الحساب وتسجيل الدخول بنجاح!', 'success');
                this.hideAuthModal();
                this.checkAuthStatus();
                
                // إعادة تحميل الصفحة لتحديث الواجهة
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                this.showMessage(result.message || 'فشل إنشاء الحساب', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في إنشاء الحساب:', error);
            this.showMessage('حدث خطأ أثناء إنشاء الحساب', 'error');
        }
    }

    async handleProfileUpdate(e) {
        const formData = new FormData(e.target);
        const data = {
            full_name: formData.get('full_name'),
            phone: formData.get('phone'),
            birth_date: formData.get('birth_date'),
            address: formData.get('address')
        };
        
        try {
            const response = await fetch('profile.php?action=update_profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthData().token}`
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showMessage('تم تحديث البيانات بنجاح!', 'success');
                
                // تحديث بيانات المستخدم باستخدام النظام الآمن
                if (result.user) {
                    this.setAuthData(this.getAuthData().token, result.user);
                    this.checkAuthStatus();
                }
                
                this.hideProfileModal();
            } else {
                this.showMessage(result.message || 'فشل تحديث البيانات', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الملف الشخصي:', error);
            this.showMessage('حدث خطأ أثناء تحديث البيانات', 'error');
        }
    }

    loadProfileData() {
        const { userData } = this.getAuthData();
        
        // تعبئة بيانات النموذج
        document.getElementById('profileName').textContent = userData?.full_name || 'مستخدم';
        document.getElementById('profileEmail').textContent = userData?.email || '';
        document.getElementById('profileFullName').value = userData?.full_name || '';
        document.getElementById('profileEmailInput').value = userData?.email || '';
        document.getElementById('profilePhone').value = userData?.phone || '';
        document.getElementById('profileBirthDate').value = userData?.birth_date || '';
        document.getElementById('profileAddress').value = userData?.address || '';
    }

    handleLogout() {
        this.clearAuthData();
        this.showMessage('تم تسجيل الخروج بنجاح', 'success');
        this.checkAuthStatus();
        
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    isLoggedIn() {
        const { token, userData } = this.getAuthData();
        return !!(token && userData);
    }

    checkAuthStatus() {
        // اختبار نظام التخزين أولاً
        const storageTest = this.testStorage();
        console.log('نتيجة اختبار التخزين:', storageTest);
        
        if (this.isLoggedIn()) {
            console.log('✅ المستخدم مسجل الدخول');
            this.updateUserInterface();
        } else {
            console.log('❌ المستخدم غير مسجل الدخول');
        }
    }

    updateUserInterface() {
        const { userData } = this.getAuthData();
        console.log('🔄 تحديث واجهة المستخدم:', userData);
    }

    showProfile() {
        this.showProfileModal();
    }

    showOrders() {
        this.showMessage('سيتم فتح صفحة الطلبات قريباً', 'info');
    }

    showMessage(message, type) {
        const existingMessages = document.querySelectorAll('.system-message');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.className = `system-message ${type}`;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            z-index: 10001;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            ${type === 'success' ? 
                'background: var(--success-color);' : 
                type === 'error' ? 
                'background: var(--danger-color);' :
                type === 'info' ?
                'background: var(--info-color);' :
                'background: var(--primary-color);'
            }
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 4000);
    }

    addAuthModalStyles() {
        const styles = `
            .auth-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
            }
            
            .auth-modal.active {
                display: flex;
                animation: fadeIn 0.3s ease;
            }
            
            .auth-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 450px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .auth-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .auth-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .auth-form {
                display: none;
            }
            
            .auth-form.active {
                display: block;
            }
            
            .auth-form h3 {
                text-align: center;
                margin-bottom: 25px;
                color: var(--primary-color);
                font-size: 24px;
                font-weight: bold;
            }
            
            .demo-accounts {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                border-right: 4px solid var(--info-color);
            }
            
            .demo-accounts h4 {
                margin: 0 0 10px 0;
                color: var(--info-color);
                font-size: 14px;
            }
            
            .demo-accounts-list {
                font-size: 12px;
                line-height: 1.5;
            }
            
            .input-group {
                margin-bottom: 15px;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .auth-btn {
                width: 100%;
                padding: 15px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: all 0.3s ease;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .auth-btn:hover {
                background: var(--secondary-color);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(162, 0, 135, 0.3);
            }
            
            .auth-switch {
                text-align: center;
                margin-top: 25px;
                color: var(--dark-color);
                font-size: 14px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
            }
            
            .switch-link {
                color: var(--primary-color);
                cursor: pointer;
                font-weight: bold;
                transition: color 0.3s ease;
            }
            
            .switch-link:hover {
                color: var(--secondary-color);
                text-decoration: underline;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }

            .user-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                padding: 0;
                min-width: 280px;
                z-index: 1000;
                margin-top: 8px;
                border: 2px solid var(--primary-color);
                overflow: hidden;
                display: none;
            }
            
            .user-header {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                padding: 20px;
                color: white;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .user-avatar {
                font-size: 40px;
                opacity: 0.9;
            }
            
            .user-details {
                flex: 1;
            }
            
            .user-details strong {
                display: block;
                font-size: 16px;
                margin-bottom: 4px;
            }
            
            .user-details small {
                font-size: 12px;
                opacity: 0.8;
            }
            
            .menu-section {
                padding: 15px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .menu-items {
                padding: 0;
            }
            
            .user-menu-item {
                display: flex;
                align-items: center;
                padding: 12px 20px;
                color: #333;
                text-decoration: none;
                border: none;
                background: none;
                width: 100%;
                text-align: right;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
                gap: 12px;
                position: relative;
                border-bottom: 1px solid #f8f8f8;
            }
            
            .user-menu-item:last-child {
                border-bottom: none;
            }
            
            .user-menu-item i {
                width: 20px;
                text-align: center;
                color: var(--primary-color);
                font-size: 16px;
            }
            
            .user-menu-item:hover {
                background: var(--light-color);
                transform: translateX(-5px);
            }
            
            .user-menu-item:hover i {
                color: var(--secondary-color);
            }
            
            .logout-btn {
                color: var(--danger-color);
                font-weight: bold;
                margin-top: 0;
            }
            
            .logout-btn i {
                color: var(--danger-color);
            }
            
            .logout-btn:hover {
                background: #ffe6e6;
            }
            
            .menu-badge {
                background: var(--secondary-color);
                color: white;
                border-radius: 12px;
                padding: 2px 8px;
                font-size: 11px;
                font-weight: bold;
                margin-right: auto;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    addProfileModalStyles() {
        const styles = `
            .profile-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
            }
            
            .profile-modal.active {
                display: flex;
                animation: fadeIn 0.3s ease;
            }
            
            .profile-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 600px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .profile-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .profile-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .profile-header {
                display: flex;
                align-items: center;
                gap: 20px;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #f0f0f0;
            }
            
            .profile-avatar {
                font-size: 60px;
                color: var(--primary-color);
            }
            
            .profile-info h3 {
                margin: 0 0 5px 0;
                color: var(--primary-color);
            }
            
            .profile-info p {
                margin: 0 0 10px 0;
                color: #666;
            }
            
            .profile-body {
                margin-top: 20px;
            }
            
            .form-section {
                margin-bottom: 30px;
                padding: 20px;
                border: 1px solid #e0e0e0;
                border-radius: 10px;
                background: #fafafa;
            }
            
            .form-section h4 {
                margin: 0 0 20px 0;
                color: var(--primary-color);
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .input-row {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
            }
            
            .input-row .input-group {
                flex: 1;
            }
            
            .input-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #333;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .input-group input[readonly] {
                background-color: #f8f9fa;
                color: #666;
                cursor: not-allowed;
            }
            
            .text-muted {
                color: #666;
                font-size: 12px;
                display: block;
                margin-top: 5px;
            }
            
            .profile-actions {
                display: flex;
                gap: 15px;
                margin-top: 30px;
            }
            
            .profile-actions .auth-btn {
                flex: 1;
                margin-bottom: 0;
            }
            
            .auth-secondary {
                background: #6c757d !important;
            }
            
            .auth-secondary:hover {
                background: #5a6268 !important;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// بدء النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});

// جعل النظام متاحاً globally
if (typeof window !== 'undefined') {
    window.AuthSystem = AuthSystem;
}*/

// نظام المصادقة والملف الشخصي المتكامل - يعمل في جميع أوضاع التصفح
/*class AuthSystem {
    constructor() {
        this.storage = this.getSafeStorage();
        this.init();
    }

    init() {
        console.log('🚀 بدء نظام المصادقة...');
        this.setCustomColors();
        this.createAuthModal();
        this.createProfileModal();
        this.setupUserIconListener();
        this.setupModalEvents();
        this.checkAuthStatus();
    }

    // نظام تخزين آمن يعمل في جميع الظروف
    getSafeStorage() {
        const self = this;
        
        const storageMethods = {
            // دالة تخزين آمنة
            setItem: (key, value) => {
                console.log(`💾 محاولة حفظ ${key}...`);
                
                try {
                    // المحاولة الأولى: localStorage
                    if (typeof localStorage !== 'undefined' && localStorage) {
                        localStorage.setItem(key, value);
                        console.log('✅ تم التخزين في localStorage');
                        return true;
                    }
                } catch (e) {
                    console.warn('⚠️ localStorage غير متاح:', e.message);
                }
                
                try {
                    // المحاولة الثانية: sessionStorage
                    if (typeof sessionStorage !== 'undefined' && sessionStorage) {
                        sessionStorage.setItem(key, value);
                        console.log('✅ تم التخزين في sessionStorage');
                        return true;
                    }
                } catch (e) {
                    console.warn('⚠️ sessionStorage غير متاح:', e.message);
                }
                
                try {
                    // المحاولة الثالثة: Cookies
                    const saved = self.setCookie(key, value, 1); // لمدة يوم واحد
                    if (saved) {
                        console.log('✅ تم التخزين في Cookies');
                        return true;
                    }
                } catch (e) {
                    console.warn('⚠️ Cookies غير متاح:', e.message);
                }
                
                console.error('❌ فشل جميع طرق التخزين');
                return false;
            },
            
            // دالة استرجاع آمنة
            getItem: (key) => {
                console.log(`🔍 محاولة استرجاع ${key}...`);
                
                try {
                    // المحاولة الأولى: localStorage
                    if (typeof localStorage !== 'undefined' && localStorage) {
                        const item = localStorage.getItem(key);
                        if (item !== null) {
                            console.log('✅ تم الاسترجاع من localStorage');
                            return item;
                        }
                    }
                } catch (e) {
                    console.warn('⚠️ خطأ في localStorage:', e.message);
                }
                
                try {
                    // المحاولة الثانية: sessionStorage
                    if (typeof sessionStorage !== 'undefined' && sessionStorage) {
                        const item = sessionStorage.getItem(key);
                        if (item !== null) {
                            console.log('✅ تم الاسترجاع من sessionStorage');
                            return item;
                        }
                    }
                } catch (e) {
                    console.warn('⚠️ خطأ في sessionStorage:', e.message);
                }
                
                // المحاولة الثالثة: Cookies
                try {
                    const cookieValue = self.getCookie(key);
                    if (cookieValue) {
                        console.log('✅ تم الاسترجاع من Cookies');
                        return cookieValue;
                    }
                } catch (e) {
                    console.warn('⚠️ خطأ في Cookies:', e.message);
                }
                
                console.log('❌ لم يتم العثور على البيانات في أي نظام تخزين');
                return null;
            },
            
            // دالة حذف آمنة
            removeItem: (key) => {
                console.log(`🗑️ محاولة حذف ${key}...`);
                
                try {
                    if (typeof localStorage !== 'undefined' && localStorage) {
                        localStorage.removeItem(key);
                    }
                } catch (e) {
                    console.warn('⚠️ خطأ في حذف localStorage:', e.message);
                }
                
                try {
                    if (typeof sessionStorage !== 'undefined' && sessionStorage) {
                        sessionStorage.removeItem(key);
                    }
                } catch (e) {
                    console.warn('⚠️ خطأ في حذف sessionStorage:', e.message);
                }
                
                // حذف الكوكيز
                try {
                    self.deleteCookie(key);
                } catch (e) {
                    console.warn('⚠️ خطأ في حذف الكوكي:', e.message);
                }
                
                console.log('✅ تم حذف البيانات من جميع أنظمة التخزين');
            }
        };
        
        return storageMethods;
    }

    // دوال الكوكيز المساعدة
    setCookie(name, value, days) {
        try {
            const expires = new Date();
            expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
            const cookieValue = encodeURIComponent(value) + (days ? `; expires=${expires.toUTCString()}` : '');
            document.cookie = `${name}=${cookieValue}; path=/; samesite=lax`;
            return true;
        } catch (e) {
            console.error('❌ خطأ في حفظ الكوكي:', e);
            return false;
        }
    }

    getCookie(name) {
        try {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for(let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) {
                    return decodeURIComponent(c.substring(nameEQ.length, c.length));
                }
            }
            return null;
        } catch (e) {
            console.error('❌ خطأ في قراءة الكوكي:', e);
            return null;
        }
    }

    deleteCookie(name) {
        try {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
            return true;
        } catch (e) {
            console.error('❌ خطأ في حذف الكوكي:', e);
            return false;
        }
    }

    // اختبار نظام التخزين
    testStorage() {
        const testKey = 'auth_storage_test';
        const testValue = 'test_value_' + Date.now();
        
        console.log('🧪 بدء اختبار نظام التخزين...');
        
        // اختبار الحفظ
        const saveResult = this.storage.setItem(testKey, testValue);
        console.log('نتيجة الحفظ:', saveResult);
        
        // اختبار الاسترجاع
        const retrievedValue = this.storage.getItem(testKey);
        console.log('نتيجة الاسترجاع:', retrievedValue);
        
        // اختبار المطابقة
        const match = retrievedValue === testValue;
        console.log('البيانات متطابقة:', match);
        
        // تنظيف
        this.storage.removeItem(testKey);
        
        return saveResult && match;
    }

    // استخدام نظام التخزين الآمن
    setAuthData(token, userData) {
        console.log('💾 محاولة حفظ بيانات المصادقة...');
        
        const tokenSaved = this.storage.setItem('authToken', token);
        const userSaved = this.storage.setItem('userData', JSON.stringify(userData));
        
        if (!tokenSaved || !userSaved) {
            console.warn('⚠️ تم استخدام تخزين بديل للبيانات');
            this.showMessage('تم حفظ البيانات في جلسة التصفح الحالية فقط', 'info');
        } else {
            console.log('✅ تم حفظ بيانات المصادقة بنجاح');
        }
        
        return tokenSaved && userSaved;
    }

    getAuthData() {
        const token = this.storage.getItem('authToken');
        const userDataStr = this.storage.getItem('userData');
        
        let userData = null;
        try {
            userData = userDataStr ? JSON.parse(userDataStr) : null;
        } catch (e) {
            console.error('❌ خطأ في تحليل بيانات المستخدم:', e);
            userData = null;
        }
        
        console.log('🔍 بيانات المصادقة المسترجعة:', { token: !!token, userData: !!userData });
        
        return {
            token,
            userData
        };
    }

    clearAuthData() {
        console.log('🗑️ حذف بيانات المصادقة...');
        this.storage.removeItem('authToken');
        this.storage.removeItem('userData');
    }

    setCustomColors() {
        const styles = `
            :root {
                --primary-color: #ea70b1;
                --secondary-color: #a20087;
                --light-color: #f8f9fa;
                --dark-color: #343a40;
                --success-color: #28a745;
                --danger-color: #dc3545;
                --warning-color: #ffc107;
                --info-color: #17a2b8;
            }
            
            .auth-primary { background-color: var(--primary-color) !important; }
            .auth-secondary { background-color: var(--secondary-color) !important; }
            .auth-success { background-color: var(--success-color) !important; }
            .auth-info { background-color: var(--info-color) !important; }
            
            .auth-primary:hover { background-color: var(--secondary-color) !important; }
            .auth-success:hover { background-color: #218838 !important; }
            .auth-info:hover { background-color: #138496 !important; }
            
            .text-primary { color: var(--primary-color) !important; }
            .text-secondary { color: var(--secondary-color) !important; }
            .text-success { color: var(--success-color) !important; }
            .text-danger { color: var(--danger-color) !important; }
            .text-info { color: var(--info-color) !important; }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupUserIconListener() {
        const userIcons = document.querySelectorAll('.fa-solid.fa-user, .user-icon');
        
        if (userIcons.length > 0) {
            userIcons.forEach(icon => {
                const button = icon.closest('button') || icon;
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('✅ تم النقر على أيقونة المستخدم');
                    this.handleUserClick(button);
                });
            });
        } else {
            console.error('❌ لم يتم العثور على أيقونة المستخدم!');
            this.createUserIcon();
        }
    }

    createUserIcon() {
        const userIcon = document.createElement('button');
        userIcon.className = 'user-icon';
        userIcon.innerHTML = '<i class="fa-solid fa-user"></i>';
        userIcon.style.cssText = `
            background: #f0f0f0;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            margin-left: 10px;
        `;
        
        document.querySelector('.header')?.appendChild(userIcon);
        this.setupUserIconListener();
    }

    handleUserClick(element) {
        if (this.isLoggedIn()) {
            this.showUserMenu(element);
        } else {
            this.showAuthModal();
        }
    }

    showUserMenu(icon) {
        const oldMenu = document.querySelector('.user-menu');
        if (oldMenu) oldMenu.remove();
        
        const { userData } = this.getAuthData();
        
        const menuHTML = `
            <div class="user-menu">
                <div class="user-header">
                    <div class="user-avatar">
                        <i class="fa-solid fa-user-circle"></i>
                    </div>
                    <div class="user-details">
                        <strong>${userData?.full_name || userData?.name || 'مستخدم'}</strong>
                        <small>${userData?.email || ''}</small>
                    </div>
                </div>
                
                <div class="menu-section">
                    <div class="menu-items">
                        <button class="user-menu-item" onclick="authSystem.showProfile()">
                            <i class="fa-solid fa-user"></i>
                            حسابي
                        </button>
                        <button class="user-menu-item" onclick="authSystem.showOrders()">
                            <i class="fa-solid fa-box"></i>
                            الطلبات
                            <span class="menu-badge" id="ordersCount">0</span>
                        </button>
                    </div>
                </div>
                
                <div class="menu-items">
                    <button class="user-menu-item logout-btn" onclick="authSystem.handleLogout()">
                        <i class="fa-solid fa-right-from-bracket"></i>
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        `;
        
        const iconContainer = icon.closest('button') || icon;
        const container = iconContainer.parentNode;
        container.style.position = 'relative';
        container.insertAdjacentHTML('beforeend', menuHTML);
        
        const menu = container.querySelector('.user-menu');
        
        this.updateMenuCounts();
        
        setTimeout(() => {
            menu.style.display = 'block';
        }, 10);
        
        const closeMenu = (e) => {
            if (menu && !menu.contains(e.target) && !icon.contains(e.target)) {
                menu.style.display = 'none';
                document.removeEventListener('click', closeMenu);
                setTimeout(() => {
                    if (menu.parentNode) {
                        menu.remove();
                    }
                }, 300);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 10);
    }

    async updateMenuCounts() {
        if (!this.isLoggedIn()) return;

        try {
            const response = await fetch('profile.php?action=get_user_stats');
            
            if (!response.ok) {
                throw new Error(`خطأ في الشبكة: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                const ordersCount = document.getElementById('ordersCount');
                if (ordersCount) {
                    ordersCount.textContent = data.data.orders_count || 0;
                }
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الإحصائيات:', error);
            const ordersCount = document.getElementById('ordersCount');
            if (ordersCount) {
                ordersCount.textContent = '0';
            }
        }
    }

    createAuthModal() {
        if (!document.getElementById('authModal')) {
            const modalHTML = `
                <div class="auth-modal" id="authModal">
                    <div class="auth-content">
                        <button class="auth-close" id="authClose">×</button>
                        
                        <div class="auth-form active" id="loginForm">
                            <h3 class="text-primary">تسجيل الدخول</h3>
                            <div class="demo-accounts">
                                <h4><i class="fa-solid fa-key"></i> حسابات تجريبية:</h4>
                                <div class="demo-accounts-list">
                                    <div><strong>ahmed@example.com</strong> / password123</div>
                                    <div><strong>fatima@example.com</strong> / password123</div>
                                    <small>أو سجل حساب جديد أدناه</small>
                                </div>
                            </div>
                            <form id="loginFormElement">
                                <div class="input-group">
                                    <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                                </div>
                                <div class="input-group">
                                    <input type="password" name="password" placeholder="كلمة المرور" required>
                                </div>
                                <button type="submit" class="auth-btn auth-primary">
                                    <i class="fa-solid fa-right-to-bracket"></i>
                                    تسجيل الدخول
                                </button>
                            </form>
                            <div class="auth-switch">
                                ليس لديك حساب؟ 
                                <span class="switch-link text-primary" id="showRegister">إنشاء حساب جديد</span>
                            </div>
                        </div>
                        
                        <div class="auth-form" id="registerForm">
                            <h3 class="text-primary">إنشاء حساب جديد</h3>
                            <form id="registerFormElement">
                                <div class="input-group">
                                    <input type="text" name="fullname" placeholder="الاسم الكامل" required>
                                </div>
                                <div class="input-group">
                                    <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                                </div>
                                <div class="input-group">
                                    <input type="password" name="password" placeholder="كلمة المرور" required>
                                </div>
                                <div class="input-group">
                                    <input type="password" name="confirm_password" placeholder="تأكيد كلمة المرور" required>
                                </div>
                                <div class="input-group">
                                    <input type="tel" name="phone" placeholder="رقم الهاتف">
                                </div>
                                <div class="input-group">
                                    <input type="date" name="birth_date" placeholder="تاريخ الميلاد">
                                </div>
                                <div class="input-group">
                                    <textarea name="address" placeholder="العنوان" rows="3"></textarea>
                                </div>
                                <button type="submit" class="auth-btn auth-primary">
                                    <i class="fa-solid fa-user-plus"></i>
                                    إنشاء حساب
                                </button>
                            </form>
                            <div class="auth-switch">
                                لديك حساب بالفعل؟ 
                                <span class="switch-link text-primary" id="showLogin">تسجيل الدخول</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            this.addAuthModalStyles();
        }
    }

    createProfileModal() {
        if (!document.getElementById('profileModal')) {
            const modalHTML = `
                <div class="profile-modal" id="profileModal">
                    <div class="profile-content">
                        <button class="profile-close" id="profileClose">×</button>
                        
                        <div class="profile-header">
                            <div class="profile-avatar">
                                <i class="fa-solid fa-user-circle"></i>
                            </div>
                            <div class="profile-info">
                                <h3 class="text-primary" id="profileName">الاسم الكامل</h3>
                                <p id="profileEmail">البريد الإلكتروني</p>
                            </div>
                        </div>
                        
                        <div class="profile-body">
                            <form id="profileForm">
                                <div class="form-section">
                                    <h4><i class="fa-solid fa-user"></i> المعلومات الشخصية</h4>
                                    <div class="input-row">
                                        <div class="input-group">
                                            <label>الاسم الكامل</label>
                                            <input type="text" name="full_name" id="profileFullName" required>
                                        </div>
                                        <div class="input-group">
                                            <label>البريد الإلكتروني</label>
                                            <input type="email" name="email" id="profileEmailInput" readonly>
                                            <small class="text-muted">لا يمكن تعديل البريد الإلكتروني</small>
                                        </div>
                                    </div>
                                    
                                    <div class="input-row">
                                        <div class="input-group">
                                            <label>رقم الهاتف</label>
                                            <input type="tel" name="phone" id="profilePhone" placeholder="أدخل رقم الهاتف">
                                        </div>
                                        <div class="input-group">
                                            <label>تاريخ الميلاد</label>
                                            <input type="date" name="birth_date" id="profileBirthDate">
                                        </div>
                                    </div>
                                    
                                    <div class="input-group">
                                        <label>العنوان</label>
                                        <textarea name="address" id="profileAddress" rows="3" placeholder="العنوان الكامل"></textarea>
                                    </div>
                                </div>
                                
                                <div class="profile-actions">
                                    <button type="submit" class="auth-btn auth-primary">
                                        <i class="fa-solid fa-save"></i>
                                        حفظ التغييرات
                                    </button>
                                    <button type="button" class="auth-btn auth-secondary" onclick="authSystem.hideProfileModal()">
                                        <i class="fa-solid fa-times"></i>
                                        إلغاء
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            this.addProfileModalStyles();
        }
    }

    setupModalEvents() {
        // أحداث التبديل بين النماذج
        document.getElementById('showRegister')?.addEventListener('click', () => {
            this.showRegisterForm();
        });
        
        document.getElementById('showLogin')?.addEventListener('click', () => {
            this.showLoginForm();
        });
        
        // أحداث الإغلاق
        document.getElementById('authClose')?.addEventListener('click', () => {
            this.hideAuthModal();
        });
        
        document.getElementById('profileClose')?.addEventListener('click', () => {
            this.hideProfileModal();
        });
        
        // أحداث النماذج
        document.getElementById('loginFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e);
        });
        
        document.getElementById('registerFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e);
        });
        
        document.getElementById('profileForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProfileUpdate(e);
        });
        
        // إغلاق النوافذ عند النقر خارجها
        document.getElementById('authModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'authModal') {
                this.hideAuthModal();
            }
        });
        
        document.getElementById('profileModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'profileModal') {
                this.hideProfileModal();
            }
        });
    }

    showAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.add('active');
            this.showLoginForm();
        }
    }

    hideAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    showProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            this.loadProfileData();
            modal.classList.add('active');
        }
    }

    hideProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    showLoginForm() {
        document.getElementById('loginForm').classList.add('active');
        document.getElementById('registerForm').classList.remove('active');
    }

    showRegisterForm() {
        document.getElementById('registerForm').classList.add('active');
        document.getElementById('loginForm').classList.remove('active');
    }

    async handleLogin(e) {
        const formData = new FormData(e.target);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        
        try {
            const response = await fetch('auth.php?action=login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // استخدام النظام الآمن للتخزين
                this.setAuthData(result.token, result.user);
                this.showMessage('تم تسجيل الدخول بنجاح!', 'success');
                this.hideAuthModal();
                this.checkAuthStatus();
                
                // إعادة تحميل الصفحة لتحديث الواجهة
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                this.showMessage(result.message || 'فشل تسجيل الدخول', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تسجيل الدخول:', error);
            this.showMessage('حدث خطأ أثناء تسجيل الدخول', 'error');
        }
    }

    async handleRegister(e) {
        const formData = new FormData(e.target);
        const data = {
            full_name: formData.get('fullname'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirm_password: formData.get('confirm_password'),
            phone: formData.get('phone'),
            birth_date: formData.get('birth_date'),
            address: formData.get('address')
        };
        
        if (data.password !== data.confirm_password) {
            this.showMessage('كلمات المرور غير متطابقة', 'error');
            return;
        }
        
        if (data.password.length < 6) {
            this.showMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }
        
        try {
            const response = await fetch('auth.php?action=register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // تسجيل الدخول تلقائياً بعد التسجيل باستخدام النظام الآمن
                this.setAuthData(result.token, result.user);
                this.showMessage('تم إنشاء الحساب وتسجيل الدخول بنجاح!', 'success');
                this.hideAuthModal();
                this.checkAuthStatus();
                
                // إعادة تحميل الصفحة لتحديث الواجهة
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                this.showMessage(result.message || 'فشل إنشاء الحساب', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في إنشاء الحساب:', error);
            this.showMessage('حدث خطأ أثناء إنشاء الحساب', 'error');
        }
    }

    async handleProfileUpdate(e) {
        const formData = new FormData(e.target);
        const data = {
            full_name: formData.get('full_name'),
            phone: formData.get('phone'),
            birth_date: formData.get('birth_date'),
            address: formData.get('address')
        };
        
        try {
            const response = await fetch('profile.php?action=update_profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthData().token}`
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showMessage('تم تحديث البيانات بنجاح!', 'success');
                
                // تحديث بيانات المستخدم باستخدام النظام الآمن
                if (result.user) {
                    this.setAuthData(this.getAuthData().token, result.user);
                    this.checkAuthStatus();
                }
                
                this.hideProfileModal();
            } else {
                this.showMessage(result.message || 'فشل تحديث البيانات', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الملف الشخصي:', error);
            this.showMessage('حدث خطأ أثناء تحديث البيانات', 'error');
        }
    }

    loadProfileData() {
        const { userData } = this.getAuthData();
        
        // تعبئة بيانات النموذج
        document.getElementById('profileName').textContent = userData?.full_name || 'مستخدم';
        document.getElementById('profileEmail').textContent = userData?.email || '';
        document.getElementById('profileFullName').value = userData?.full_name || '';
        document.getElementById('profileEmailInput').value = userData?.email || '';
        document.getElementById('profilePhone').value = userData?.phone || '';
        document.getElementById('profileBirthDate').value = userData?.birth_date || '';
        document.getElementById('profileAddress').value = userData?.address || '';
    }

    handleLogout() {
        this.clearAuthData();
        this.showMessage('تم تسجيل الخروج بنجاح', 'success');
        this.checkAuthStatus();
        
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    isLoggedIn() {
        const { token, userData } = this.getAuthData();
        return !!(token && userData);
    }

    checkAuthStatus() {
        // اختبار نظام التخزين أولاً
        console.log('🔍 التحقق من حالة المصادقة...');
        const storageTest = this.testStorage();
        console.log('نتيجة اختبار التخزين:', storageTest);
        
        if (this.isLoggedIn()) {
            console.log('✅ المستخدم مسجل الدخول');
            this.updateUserInterface();
        } else {
            console.log('❌ المستخدم غير مسجل الدخول');
        }
    }

    updateUserInterface() {
        const { userData } = this.getAuthData();
        console.log('🔄 تحديث واجهة المستخدم:', userData);
    }

    showProfile() {
        this.showProfileModal();
    }

    showOrders() {
        this.showMessage('سيتم فتح صفحة الطلبات قريباً', 'info');
    }

    showMessage(message, type) {
        const existingMessages = document.querySelectorAll('.system-message');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.className = `system-message ${type}`;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            z-index: 10001;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            ${type === 'success' ? 
                'background: var(--success-color);' : 
                type === 'error' ? 
                'background: var(--danger-color);' :
                type === 'info' ?
                'background: var(--info-color);' :
                'background: var(--primary-color);'
            }
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 4000);
    }

    addAuthModalStyles() {
        const styles = `
            .auth-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
            }
            
            .auth-modal.active {
                display: flex;
                animation: fadeIn 0.3s ease;
            }
            
            .auth-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 450px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .auth-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .auth-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .auth-form {
                display: none;
            }
            
            .auth-form.active {
                display: block;
            }
            
            .auth-form h3 {
                text-align: center;
                margin-bottom: 25px;
                color: var(--primary-color);
                font-size: 24px;
                font-weight: bold;
            }
            
            .demo-accounts {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                border-right: 4px solid var(--info-color);
            }
            
            .demo-accounts h4 {
                margin: 0 0 10px 0;
                color: var(--info-color);
                font-size: 14px;
            }
            
            .demo-accounts-list {
                font-size: 12px;
                line-height: 1.5;
            }
            
            .input-group {
                margin-bottom: 15px;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .auth-btn {
                width: 100%;
                padding: 15px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: all 0.3s ease;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .auth-btn:hover {
                background: var(--secondary-color);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(162, 0, 135, 0.3);
            }
            
            .auth-switch {
                text-align: center;
                margin-top: 25px;
                color: var(--dark-color);
                font-size: 14px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
            }
            
            .switch-link {
                color: var(--primary-color);
                cursor: pointer;
                font-weight: bold;
                transition: color 0.3s ease;
            }
            
            .switch-link:hover {
                color: var(--secondary-color);
                text-decoration: underline;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }

            .user-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                padding: 0;
                min-width: 280px;
                z-index: 1000;
                margin-top: 8px;
                border: 2px solid var(--primary-color);
                overflow: hidden;
                display: none;
            }
            
            .user-header {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                padding: 20px;
                color: white;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .user-avatar {
                font-size: 40px;
                opacity: 0.9;
            }
            
            .user-details {
                flex: 1;
            }
            
            .user-details strong {
                display: block;
                font-size: 16px;
                margin-bottom: 4px;
            }
            
            .user-details small {
                font-size: 12px;
                opacity: 0.8;
            }
            
            .menu-section {
                padding: 15px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .menu-items {
                padding: 0;
            }
            
            .user-menu-item {
                display: flex;
                align-items: center;
                padding: 12px 20px;
                color: #333;
                text-decoration: none;
                border: none;
                background: none;
                width: 100%;
                text-align: right;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
                gap: 12px;
                position: relative;
                border-bottom: 1px solid #f8f8f8;
            }
            
            .user-menu-item:last-child {
                border-bottom: none;
            }
            
            .user-menu-item i {
                width: 20px;
                text-align: center;
                color: var(--primary-color);
                font-size: 16px;
            }
            
            .user-menu-item:hover {
                background: var(--light-color);
                transform: translateX(-5px);
            }
            
            .user-menu-item:hover i {
                color: var(--secondary-color);
            }
            
            .logout-btn {
                color: var(--danger-color);
                font-weight: bold;
                margin-top: 0;
            }
            
            .logout-btn i {
                color: var(--danger-color);
            }
            
            .logout-btn:hover {
                background: #ffe6e6;
            }
            
            .menu-badge {
                background: var(--secondary-color);
                color: white;
                border-radius: 12px;
                padding: 2px 8px;
                font-size: 11px;
                font-weight: bold;
                margin-right: auto;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    addProfileModalStyles() {
        const styles = `
            .profile-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
            }
            
            .profile-modal.active {
                display: flex;
                animation: fadeIn 0.3s ease;
            }
            
            .profile-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 600px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .profile-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .profile-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .profile-header {
                display: flex;
                align-items: center;
                gap: 20px;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #f0f0f0;
            }
            
            .profile-avatar {
                font-size: 60px;
                color: var(--primary-color);
            }
            
            .profile-info h3 {
                margin: 0 0 5px 0;
                color: var(--primary-color);
            }
            
            .profile-info p {
                margin: 0 0 10px 0;
                color: #666;
            }
            
            .profile-body {
                margin-top: 20px;
            }
            
            .form-section {
                margin-bottom: 30px;
                padding: 20px;
                border: 1px solid #e0e0e0;
                border-radius: 10px;
                background: #fafafa;
            }
            
            .form-section h4 {
                margin: 0 0 20px 0;
                color: var(--primary-color);
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .input-row {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
            }
            
            .input-row .input-group {
                flex: 1;
            }
            
            .input-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #333;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .input-group input[readonly] {
                background-color: #f8f9fa;
                color: #666;
                cursor: not-allowed;
            }
            
            .text-muted {
                color: #666;
                font-size: 12px;
                display: block;
                margin-top: 5px;
            }
            
            .profile-actions {
                display: flex;
                gap: 15px;
                margin-top: 30px;
            }
            
            .profile-actions .auth-btn {
                flex: 1;
                margin-bottom: 0;
            }
            
            .auth-secondary {
                background: #6c757d !important;
            }
            
            .auth-secondary:hover {
                background: #5a6268 !important;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// بدء النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});

// جعل النظام متاحاً globally
if (typeof window !== 'undefined') {
    window.AuthSystem = AuthSystem;
}*/













































































































// نظام المصادقة والملف الشخصي المتكامل - يدعم التسجيل العادي وقاعدة البيانات
/*class AuthSystem {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 بدء نظام المصادقة...');
        this.setCustomColors();
        this.createAuthModal();
        this.createProfileModal();
        this.setupUserIconListener();
        this.setupModalEvents();
        this.checkAuthStatus();
    }

    setCustomColors() {
        const styles = `
            :root {
                --primary-color: #ea70b1;
                --secondary-color: #a20087;
                --light-color: #f8f9fa;
                --dark-color: #343a40;
                --success-color: #28a745;
                --danger-color: #dc3545;
                --warning-color: #ffc107;
                --info-color: #17a2b8;
            }
            
            .auth-primary { background-color: var(--primary-color) !important; }
            .auth-secondary { background-color: var(--secondary-color) !important; }
            .auth-success { background-color: var(--success-color) !important; }
            .auth-info { background-color: var(--info-color) !important; }
            
            .auth-primary:hover { background-color: var(--secondary-color) !important; }
            .auth-success:hover { background-color: #218838 !important; }
            .auth-info:hover { background-color: #138496 !important; }
            
            .text-primary { color: var(--primary-color) !important; }
            .text-secondary { color: var(--secondary-color) !important; }
            .text-success { color: var(--success-color) !important; }
            .text-danger { color: var(--danger-color) !important; }
            .text-info { color: var(--info-color) !important; }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupUserIconListener() {
        const userIcons = document.querySelectorAll('.fa-solid.fa-user, .user-icon');
        
        if (userIcons.length > 0) {
            userIcons.forEach(icon => {
                const button = icon.closest('button') || icon;
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('✅ تم النقر على أيقونة المستخدم');
                    this.handleUserClick(button);
                });
            });
        } else {
            console.error('❌ لم يتم العثور على أيقونة المستخدم!');
            this.createUserIcon();
        }
    }

    createUserIcon() {
        const userIcon = document.createElement('button');
        userIcon.className = 'user-icon';
        userIcon.innerHTML = '<i class="fa-solid fa-user"></i>';
        userIcon.style.cssText = `
            background: #f0f0f0;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            margin-left: 10px;
        `;
        
        document.querySelector('.header')?.appendChild(userIcon);
        this.setupUserIconListener();
    }

    handleUserClick(element) {
        if (this.isLoggedIn()) {
            this.showUserMenu(element);
        } else {
            this.showAuthModal();
        }
    }

    showUserMenu(icon) {
        const oldMenu = document.querySelector('.user-menu');
        if (oldMenu) oldMenu.remove();
        
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        const menuHTML = `
            <div class="user-menu">
                <div class="user-header">
                    <div class="user-avatar">
                        <i class="fa-solid fa-user-circle"></i>
                    </div>
                    <div class="user-details">
                        <strong>${userData.full_name || userData.name || 'مستخدم'}</strong>
                        <small>${userData.email || ''}</small>
                    </div>
                </div>
                
                <div class="menu-section">
                    <div class="menu-items">
                        <button class="user-menu-item" onclick="authSystem.showProfile()">
                            <i class="fa-solid fa-user"></i>
                            حسابي
                        </button>
                        <button class="user-menu-item" onclick="authSystem.showOrders()">
                            <i class="fa-solid fa-box"></i>
                            الطلبات
                            <span class="menu-badge" id="ordersCount">0</span>
                        </button>
                    </div>
                </div>
                
                <div class="menu-items">
                    <button class="user-menu-item logout-btn" onclick="authSystem.handleLogout()">
                        <i class="fa-solid fa-right-from-bracket"></i>
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        `;
        
        const iconContainer = icon.closest('button') || icon;
        const container = iconContainer.parentNode;
        container.style.position = 'relative';
        container.insertAdjacentHTML('beforeend', menuHTML);
        
        const menu = container.querySelector('.user-menu');
        
        this.updateMenuCounts();
        
        setTimeout(() => {
            menu.style.display = 'block';
        }, 10);
        
        const closeMenu = (e) => {
            if (menu && !menu.contains(e.target) && !icon.contains(e.target)) {
                menu.style.display = 'none';
                document.removeEventListener('click', closeMenu);
                setTimeout(() => {
                    if (menu.parentNode) {
                        menu.remove();
                    }
                }, 300);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 10);
    }

    async updateMenuCounts() {
        if (!this.isLoggedIn()) return;

        try {
            const response = await fetch('profile.php?action=get_user_stats');
            
            if (!response.ok) {
                throw new Error(`خطأ في الشبكة: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                const ordersCount = document.getElementById('ordersCount');
                if (ordersCount) {
                    ordersCount.textContent = data.data.orders_count || 0;
                }
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الإحصائيات:', error);
            const ordersCount = document.getElementById('ordersCount');
            if (ordersCount) {
                ordersCount.textContent = '0';
            }
        }
    }

    createAuthModal() {
        if (!document.getElementById('authModal')) {
            const modalHTML = `
                <div class="auth-modal" id="authModal">
                    <div class="auth-content">
                        <button class="auth-close" id="authClose">×</button>
                        
                        <div class="auth-form active" id="loginForm">
                            <h3 class="text-primary">تسجيل الدخول</h3>
                            <div class="demo-accounts">
                                <h4><i class="fa-solid fa-key"></i> حسابات تجريبية:</h4>
                                <div class="demo-accounts-list">
                                    <div><strong>ahmed@example.com</strong> / password123</div>
                                    <div><strong>fatima@example.com</strong> / password123</div>
                                    <small>أو سجل حساب جديد أدناه</small>
                                </div>
                            </div>
                            <form id="loginFormElement">
                                <div class="input-group">
                                    <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                                </div>
                                <div class="input-group">
                                    <input type="password" name="password" placeholder="كلمة المرور" required>
                                </div>
                                <button type="submit" class="auth-btn auth-primary">
                                    <i class="fa-solid fa-right-to-bracket"></i>
                                    تسجيل الدخول
                                </button>
                            </form>
                            <div class="auth-switch">
                                ليس لديك حساب؟ 
                                <span class="switch-link text-primary" id="showRegister">إنشاء حساب جديد</span>
                            </div>
                        </div>
                        
                        <div class="auth-form" id="registerForm">
                            <h3 class="text-primary">إنشاء حساب جديد</h3>
                            <form id="registerFormElement">
                                <div class="input-group">
                                    <input type="text" name="fullname" placeholder="الاسم الكامل" required>
                                </div>
                                <div class="input-group">
                                    <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                                </div>
                                <div class="input-group">
                                    <input type="password" name="password" placeholder="كلمة المرور" required>
                                </div>
                                <div class="input-group">
                                    <input type="password" name="confirm_password" placeholder="تأكيد كلمة المرور" required>
                                </div>
                                <button type="submit" class="auth-btn auth-primary">
                                    <i class="fa-solid fa-user-plus"></i>
                                    إنشاء حساب
                                </button>
                            </form>
                            <div class="auth-switch">
                                لديك حساب بالفعل؟ 
                                <span class="switch-link text-primary" id="showLogin">تسجيل الدخول</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            this.addAuthModalStyles();
        }
    }

    createProfileModal() {
        if (!document.getElementById('profileModal')) {
            const modalHTML = `
                <div class="profile-modal" id="profileModal">
                    <div class="profile-content">
                        <button class="profile-close" id="profileClose">×</button>
                        
                        <div class="profile-header">
                            <div class="profile-avatar">
                                <i class="fa-solid fa-user-circle"></i>
                            </div>
                            <div class="profile-info">
                                <h3 class="text-primary" id="profileName">الاسم الكامل</h3>
                                <p id="profileEmail">البريد الإلكتروني</p>
                            </div>
                        </div>
                        
                        <div class="profile-body">
                            <form id="profileForm">
                                <div class="form-section">
                                    <h4><i class="fa-solid fa-user"></i> المعلومات الشخصية</h4>
                                    <div class="input-row">
                                        <div class="input-group">
                                            <label>الاسم الكامل</label>
                                            <input type="text" name="full_name" id="profileFullName" required>
                                        </div>
                                        <div class="input-group">
                                            <label>البريد الإلكتروني</label>
                                            <input type="email" name="email" id="profileEmailInput" readonly>
                                            <small class="text-muted">لا يمكن تعديل البريد الإلكتروني</small>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="profile-actions">
                                    <button type="submit" class="auth-btn auth-primary">
                                        <i class="fa-solid fa-save"></i>
                                        حفظ التغييرات
                                    </button>
                                    <button type="button" class="auth-btn auth-secondary" onclick="authSystem.hideProfileModal()">
                                        <i class="fa-solid fa-times"></i>
                                        إلغاء
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            this.addProfileModalStyles();
        }
    }

    setupModalEvents() {
        // أحداث التبديل بين النماذج
        document.getElementById('showRegister')?.addEventListener('click', () => {
            this.showRegisterForm();
        });
        
        document.getElementById('showLogin')?.addEventListener('click', () => {
            this.showLoginForm();
        });
        
        // أحداث الإغلاق
        document.getElementById('authClose')?.addEventListener('click', () => {
            this.hideAuthModal();
        });
        
        document.getElementById('profileClose')?.addEventListener('click', () => {
            this.hideProfileModal();
        });
        
        // أحداث النماذج
        document.getElementById('loginFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e);
        });
        
        document.getElementById('registerFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e);
        });
        
        document.getElementById('profileForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProfileUpdate(e);
        });
        
        // إغلاق النوافذ عند النقر خارجها
        document.getElementById('authModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'authModal') {
                this.hideAuthModal();
            }
        });
        
        document.getElementById('profileModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'profileModal') {
                this.hideProfileModal();
            }
        });
    }

    showAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.add('active');
            this.showLoginForm();
        }
    }

    hideAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    showProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            this.loadProfileData();
            modal.classList.add('active');
        }
    }

    hideProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    showLoginForm() {
        document.getElementById('loginForm').classList.add('active');
        document.getElementById('registerForm').classList.remove('active');
    }

    showRegisterForm() {
        document.getElementById('registerForm').classList.add('active');
        document.getElementById('loginForm').classList.remove('active');
    }

    async handleLogin(e) {
        const formData = new FormData(e.target);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        
        try {
            const response = await fetch('auth.php?action=login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('userData', JSON.stringify(result.user));
                this.showMessage('تم تسجيل الدخول بنجاح!', 'success');
                this.hideAuthModal();
                this.checkAuthStatus();
                
                // إعادة تحميل الصفحة لتحديث الواجهة
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                this.showMessage(result.message || 'فشل تسجيل الدخول', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تسجيل الدخول:', error);
            this.showMessage('حدث خطأ أثناء تسجيل الدخول', 'error');
        }
    }

    async handleRegister(e) {
        const formData = new FormData(e.target);
        const data = {
            full_name: formData.get('fullname'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirm_password: formData.get('confirm_password')
        };
        
        if (data.password !== data.confirm_password) {
            this.showMessage('كلمات المرور غير متطابقة', 'error');
            return;
        }
        
        if (data.password.length < 6) {
            this.showMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }
        
        try {
            const response = await fetch('auth.php?action=register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // تسجيل الدخول تلقائياً بعد التسجيل
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('userData', JSON.stringify(result.user));
                this.showMessage('تم إنشاء الحساب وتسجيل الدخول بنجاح!', 'success');
                this.hideAuthModal();
                this.checkAuthStatus();
                
                // إعادة تحميل الصفحة لتحديث الواجهة
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                this.showMessage(result.message || 'فشل إنشاء الحساب', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في إنشاء الحساب:', error);
            this.showMessage('حدث خطأ أثناء إنشاء الحساب', 'error');
        }
    }

    async handleProfileUpdate(e) {
        const formData = new FormData(e.target);
        const data = {
            full_name: formData.get('full_name')
        };
        
        try {
            const response = await fetch('profile.php?action=update_profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showMessage('تم تحديث البيانات بنجاح!', 'success');
                
                // تحديث بيانات المستخدم في localStorage
                if (result.user) {
                    localStorage.setItem('userData', JSON.stringify(result.user));
                    this.checkAuthStatus();
                }
                
                this.hideProfileModal();
            } else {
                this.showMessage(result.message || 'فشل تحديث البيانات', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الملف الشخصي:', error);
            this.showMessage('حدث خطأ أثناء تحديث البيانات', 'error');
        }
    }

    loadProfileData() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        // تعبئة بيانات النموذج
        document.getElementById('profileName').textContent = userData.full_name || 'مستخدم';
        document.getElementById('profileEmail').textContent = userData.email || '';
        document.getElementById('profileFullName').value = userData.full_name || '';
        document.getElementById('profileEmailInput').value = userData.email || '';
    }

    handleLogout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        this.showMessage('تم تسجيل الخروج بنجاح', 'success');
        this.checkAuthStatus();
        
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    isLoggedIn() {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        return !!(token && userData);
    }

    checkAuthStatus() {
        if (this.isLoggedIn()) {
            console.log('✅ المستخدم مسجل الدخول');
            this.updateUserInterface();
        } else {
            console.log('❌ المستخدم غير مسجل الدخول');
        }
    }

    updateUserInterface() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        console.log('🔄 تحديث واجهة المستخدم:', userData);
    }

    showProfile() {
        this.showProfileModal();
    }

    showOrders() {
        this.showMessage('سيتم فتح صفحة الطلبات قريباً', 'info');
    }

    showMessage(message, type) {
        const existingMessages = document.querySelectorAll('.system-message');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.className = `system-message ${type}`;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            z-index: 10001;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            ${type === 'success' ? 
                'background: var(--success-color);' : 
                type === 'error' ? 
                'background: var(--danger-color);' :
                type === 'info' ?
                'background: var(--info-color);' :
                'background: var(--primary-color);'
            }
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 4000);
    }

    addAuthModalStyles() {
        const styles = `
            .auth-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
            }
            
            .auth-modal.active {
                display: flex;
                animation: fadeIn 0.3s ease;
            }
            
            .auth-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 450px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .auth-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .auth-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .auth-form {
                display: none;
            }
            
            .auth-form.active {
                display: block;
            }
            
            .auth-form h3 {
                text-align: center;
                margin-bottom: 25px;
                color: var(--primary-color);
                font-size: 24px;
                font-weight: bold;
            }
            
            .demo-accounts {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                border-right: 4px solid var(--info-color);
            }
            
            .demo-accounts h4 {
                margin: 0 0 10px 0;
                color: var(--info-color);
                font-size: 14px;
            }
            
            .demo-accounts-list {
                font-size: 12px;
                line-height: 1.5;
            }
            
            .input-group {
                margin-bottom: 15px;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .auth-btn {
                width: 100%;
                padding: 15px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: all 0.3s ease;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .auth-btn:hover {
                background: var(--secondary-color);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(162, 0, 135, 0.3);
            }
            
            .auth-switch {
                text-align: center;
                margin-top: 25px;
                color: var(--dark-color);
                font-size: 14px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
            }
            
            .switch-link {
                color: var(--primary-color);
                cursor: pointer;
                font-weight: bold;
                transition: color 0.3s ease;
            }
            
            .switch-link:hover {
                color: var(--secondary-color);
                text-decoration: underline;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }

            .user-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                padding: 0;
                min-width: 280px;
                z-index: 1000;
                margin-top: 8px;
                border: 2px solid var(--primary-color);
                overflow: hidden;
                display: none;
            }
            
            .user-header {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                padding: 20px;
                color: white;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .user-avatar {
                font-size: 40px;
                opacity: 0.9;
            }
            
            .user-details {
                flex: 1;
            }
            
            .user-details strong {
                display: block;
                font-size: 16px;
                margin-bottom: 4px;
            }
            
            .user-details small {
                font-size: 12px;
                opacity: 0.8;
            }
            
            .menu-section {
                padding: 15px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .menu-items {
                padding: 0;
            }
            
            .user-menu-item {
                display: flex;
                align-items: center;
                padding: 12px 20px;
                color: #333;
                text-decoration: none;
                border: none;
                background: none;
                width: 100%;
                text-align: right;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
                gap: 12px;
                position: relative;
                border-bottom: 1px solid #f8f8f8;
            }
            
            .user-menu-item:last-child {
                border-bottom: none;
            }
            
            .user-menu-item i {
                width: 20px;
                text-align: center;
                color: var(--primary-color);
                font-size: 16px;
            }
            
            .user-menu-item:hover {
                background: var(--light-color);
                transform: translateX(-5px);
            }
            
            .user-menu-item:hover i {
                color: var(--secondary-color);
            }
            
            .logout-btn {
                color: var(--danger-color);
                font-weight: bold;
                margin-top: 0;
            }
            
            .logout-btn i {
                color: var(--danger-color);
            }
            
            .logout-btn:hover {
                background: #ffe6e6;
            }
            
            .menu-badge {
                background: var(--secondary-color);
                color: white;
                border-radius: 12px;
                padding: 2px 8px;
                font-size: 11px;
                font-weight: bold;
                margin-right: auto;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    addProfileModalStyles() {
        const styles = `
            .profile-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
            }
            
            .profile-modal.active {
                display: flex;
                animation: fadeIn 0.3s ease;
            }
            
            .profile-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 500px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .profile-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .profile-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .profile-header {
                display: flex;
                align-items: center;
                gap: 20px;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #f0f0f0;
            }
            
            .profile-avatar {
                font-size: 60px;
                color: var(--primary-color);
            }
            
            .profile-info h3 {
                margin: 0 0 5px 0;
                color: var(--primary-color);
            }
            
            .profile-info p {
                margin: 0 0 10px 0;
                color: #666;
            }
            
            .profile-body {
                margin-top: 20px;
            }
            
            .form-section {
                margin-bottom: 30px;
                padding: 20px;
                border: 1px solid #e0e0e0;
                border-radius: 10px;
                background: #fafafa;
            }
            
            .form-section h4 {
                margin: 0 0 20px 0;
                color: var(--primary-color);
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .input-row {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
            }
            
            .input-row .input-group {
                flex: 1;
            }
            
            .input-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #333;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .input-group input[readonly] {
                background-color: #f8f9fa;
                color: #666;
                cursor: not-allowed;
            }
            
            .text-muted {
                color: #666;
                font-size: 12px;
                display: block;
                margin-top: 5px;
            }
            
            .profile-actions {
                display: flex;
                gap: 15px;
                margin-top: 30px;
            }
            
            .profile-actions .auth-btn {
                flex: 1;
                margin-bottom: 0;
            }
            
            .auth-secondary {
                background: #6c757d !important;
            }
            
            .auth-secondary:hover {
                background: #5a6268 !important;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// بدء النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});

// جعل النظام متاحاً globally
if (typeof window !== 'undefined') {
    window.AuthSystem = AuthSystem;
}*/




























































/*// نظام المصادقة والملف الشخصي المتكامل
class AuthSystem {
    constructor() {
        this.demoMode = true; // وضع تجريبي
        this.init();
    }

    init() {
        console.log('🚀 بدء نظام المصادقة...');
        if (this.demoMode) {
            console.log('🔧 النظام في الوضع التجريبي');
        }
        this.setCustomColors();
        this.createAuthModal();
        this.createProfileModal();
        this.setupUserIconListener();
        this.setupModalEvents();
        this.checkAuthStatus();
    }

    setCustomColors() {
        const styles = `
            :root {
                --primary-color: #ea70b1;
                --secondary-color: #a20087;
                --light-color: #f8f9fa;
                --dark-color: #343a40;
                --success-color: #28a745;
                --danger-color: #dc3545;
                --warning-color: #ffc107;
                --info-color: #17a2b8;
            }
            
            .auth-primary { background-color: var(--primary-color) !important; }
            .auth-secondary { background-color: var(--secondary-color) !important; }
            .auth-success { background-color: var(--success-color) !important; }
            .auth-info { background-color: var(--info-color) !important; }
            
            .auth-primary:hover { background-color: var(--secondary-color) !important; }
            .auth-success:hover { background-color: #218838 !important; }
            .auth-info:hover { background-color: #138496 !important; }
            
            .text-primary { color: var(--primary-color) !important; }
            .text-secondary { color: var(--secondary-color) !important; }
            .text-success { color: var(--success-color) !important; }
            .text-danger { color: var(--danger-color) !important; }
            .text-info { color: var(--info-color) !important; }
            
            .registration-badge {
                display: inline-block;
                padding: 3px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: bold;
                margin-right: 8px;
            }
            
            .badge-system { background: var(--info-color); color: white; }
            .badge-manual { background: var(--success-color); color: white; }
            .badge-demo { background: var(--warning-color); color: black; }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupUserIconListener() {
        const userIcons = document.querySelectorAll('.fa-solid.fa-user, .user-icon');
        
        if (userIcons.length > 0) {
            userIcons.forEach(icon => {
                const button = icon.closest('button') || icon;
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('✅ تم النقر على أيقونة المستخدم');
                    this.handleUserClick(button);
                });
            });
        } else {
            console.error('❌ لم يتم العثور على أيقونة المستخدم!');
            this.createUserIcon();
        }
    }

    createUserIcon() {
        const userIcon = document.createElement('button');
        userIcon.className = 'user-icon';
        userIcon.innerHTML = '<i class="fa-solid fa-user"></i>';
        userIcon.style.cssText = `
            background: #f0f0f0;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            margin-left: 10px;
        `;
        
        const header = document.querySelector('.header') || document.body;
        header.appendChild(userIcon);
        
        userIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleUserClick(userIcon);
        });
    }

    handleUserClick(element) {
        if (this.isLoggedIn()) {
            this.showUserMenu(element);
        } else {
            this.showAuthModal();
        }
    }

    showUserMenu(icon) {
        const oldMenu = document.querySelector('.user-menu');
        if (oldMenu) oldMenu.remove();
        
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const badgeText = this.demoMode ? 'تجريبي' : 'عضو';
        const badgeClass = this.demoMode ? 'badge-demo' : 'badge-manual';
        
        const menuHTML = `
            <div class="user-menu">
                <div class="user-header">
                    <div class="user-avatar">
                        <i class="fa-solid fa-user-circle"></i>
                    </div>
                    <div class="user-details">
                        <strong>${userData.full_name || userData.name || 'مستخدم'}</strong>
                        <small>${userData.email || ''}</small>
                        <div style="margin-top: 5px;">
                            <span class="registration-badge ${badgeClass}">${badgeText}</span>
                            <small>مسجل منذ ${this.formatJoinDate(userData.created_at)}</small>
                        </div>
                    </div>
                </div>
                
                <div class="menu-section">
                    <div class="menu-items">
                        <button class="user-menu-item" onclick="authSystem.showProfile()">
                            <i class="fa-solid fa-user"></i>
                            حسابي
                        </button>
                        <button class="user-menu-item" onclick="authSystem.showOrders()">
                            <i class="fa-solid fa-box"></i>
                            الطلبات
                            <span class="menu-badge" id="ordersCount">0</span>
                        </button>
                    </div>
                </div>
                
                <div class="menu-items">
                    <button class="user-menu-item logout-btn" onclick="authSystem.handleLogout()">
                        <i class="fa-solid fa-right-from-bracket"></i>
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        `;
        
        const iconContainer = icon.closest('button') || icon;
        const container = iconContainer.parentNode;
        container.style.position = 'relative';
        container.insertAdjacentHTML('beforeend', menuHTML);
        
        const menu = container.querySelector('.user-menu');
        
        this.updateMenuCounts();
        
        setTimeout(() => {
            menu.style.display = 'block';
        }, 10);
        
        const closeMenu = (e) => {
            if (menu && !menu.contains(e.target) && !icon.contains(e.target)) {
                menu.style.display = 'none';
                document.removeEventListener('click', closeMenu);
                setTimeout(() => {
                    if (menu.parentNode) {
                        menu.remove();
                    }
                }, 300);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 10);
    }

    formatJoinDate(dateString) {
        if (!dateString) return 'فترة';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'يوم';
        if (diffDays < 30) return `${diffDays} يوم`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} شهر`;
        return `${Math.floor(diffDays / 365)} سنة`;
    }

    async updateMenuCounts() {
        if (!this.isLoggedIn()) return;

        try {
            // في الوضع التجريبي، نستخدم بيانات وهمية
            if (this.demoMode) {
                const ordersCount = document.getElementById('ordersCount');
                if (ordersCount) {
                    ordersCount.textContent = '0';
                }
                return;
            }

            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            
            const response = await fetch('profile.php?action=get_user_stats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userData.id })
            });
            
            if (!response.ok) {
                throw new Error(`خطأ في الشبكة: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                const ordersCount = document.getElementById('ordersCount');
                if (ordersCount) {
                    ordersCount.textContent = result.data.orders_count || 0;
                }
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الإحصائيات:', error);
        }
    }

    createAuthModal() {
        if (document.getElementById('authModal')) return;

        const modalHTML = `
            <div class="auth-modal" id="authModal">
                <div class="auth-content">
                    <button class="auth-close" id="authClose">×</button>
                    
                    <div class="auth-form active" id="loginForm">
                        <h3 class="text-primary">تسجيل الدخول</h3>
                        ${this.demoMode ? '<div class="demo-notice"><i class="fa-solid fa-flask"></i> النظام في الوضع التجريبي - يمكنك استخدام أي بيانات</div>' : ''}
                        <form id="loginFormElement">
                            <div class="input-group">
                                <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                            </div>
                            <div class="input-group">
                                <input type="password" name="password" placeholder="كلمة المرور" required>
                            </div>
                            <button type="submit" class="auth-btn auth-primary">
                                <i class="fa-solid fa-right-to-bracket"></i>
                                تسجيل الدخول
                            </button>
                        </form>
                        <div class="auth-switch">
                            ليس لديك حساب؟ 
                            <span class="switch-link text-primary" id="showRegister">إنشاء حساب جديد</span>
                        </div>
                    </div>
                    
                    <div class="auth-form" id="registerForm">
                        <h3 class="text-primary">إنشاء حساب جديد</h3>
                        ${this.demoMode ? '<div class="demo-notice"><i class="fa-solid fa-flask"></i> النظام في الوضع التجريبي - البيانات سيتم حفظها مؤقتاً</div>' : ''}
                        <p class="register-info">
                            <i class="fa-solid fa-user-plus"></i> سجل بياناتك وسيتم حفظها ${this.demoMode ? 'مؤقتاً في المتصفح' : 'في قاعدة البيانات'}
                        </p>
                        <form id="registerFormElement">
                            <div class="input-group">
                                <input type="text" name="full_name" placeholder="الاسم الكامل" required>
                            </div>
                            <div class="input-group">
                                <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                            </div>
                            <div class="input-group">
                                <input type="password" name="password" placeholder="كلمة المرور" required>
                                <small class="password-hint">كلمة المرور يجب أن تكون 6 أحرف على الأقل</small>
                            </div>
                            <div class="input-group">
                                <input type="password" name="confirm_password" placeholder="تأكيد كلمة المرور" required>
                            </div>
                            <div class="input-group">
                                <input type="tel" name="phone" placeholder="رقم الهاتف (اختياري)">
                            </div>
                            <div class="input-group">
                                <input type="date" name="birth_date" placeholder="تاريخ الميلاد">
                            </div>
                            <div class="input-group">
                                <textarea name="address" placeholder="العنوان" rows="3"></textarea>
                            </div>
                            <button type="submit" class="auth-btn auth-primary">
                                <i class="fa-solid fa-user-plus"></i>
                                إنشاء حساب
                            </button>
                        </form>
                        <div class="auth-switch">
                            لديك حساب بالفعل؟ 
                            <span class="switch-link text-primary" id="showLogin">تسجيل الدخول</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addAuthModalStyles();
    }

    createProfileModal() {
        if (document.getElementById('profileModal')) return;

        const modalHTML = `
            <div class="profile-modal" id="profileModal">
                <div class="profile-content">
                    <button class="profile-close" id="profileClose">×</button>
                    
                    <div class="profile-header">
                        <div class="profile-avatar">
                            <i class="fa-solid fa-user-circle"></i>
                        </div>
                        <div class="profile-info">
                            <h3 class="text-primary" id="profileName">الاسم الكامل</h3>
                            <p id="profileEmail">البريد الإلكتروني</p>
                            <div class="profile-badges">
                                <span class="registration-badge" id="profileBadge">${this.demoMode ? 'تجريبي' : 'عضو'}</span>
                                <span class="join-date" id="profileJoinDate">مسجل منذ 0 يوم</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="profile-body">
                        <form id="profileForm">
                            <div class="form-section">
                                <h4><i class="fa-solid fa-user"></i> المعلومات الشخصية</h4>
                                <div class="input-row">
                                    <div class="input-group">
                                        <label>الاسم الكامل</label>
                                        <input type="text" name="full_name" id="profileFullName" required>
                                    </div>
                                    <div class="input-group">
                                        <label>البريد الإلكتروني</label>
                                        <input type="email" name="email" id="profileEmailInput" readonly>
                                        <small class="text-muted">لا يمكن تعديل البريد الإلكتروني</small>
                                    </div>
                                </div>
                                
                                <div class="input-row">
                                    <div class="input-group">
                                        <label>رقم الهاتف</label>
                                        <input type="tel" name="phone" id="profilePhone">
                                    </div>
                                    <div class="input-group">
                                        <label>تاريخ الميلاد</label>
                                        <input type="date" name="birth_date" id="profileBirthDate">
                                    </div>
                                </div>
                                
                                <div class="input-group">
                                    <label>العنوان</label>
                                    <textarea name="address" id="profileAddress" rows="3" placeholder="العنوان الكامل"></textarea>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h4><i class="fa-solid fa-lock"></i> تغيير كلمة المرور</h4>
                                <div class="input-row">
                                    <div class="input-group">
                                        <label>كلمة المرور الحالية</label>
                                        <input type="password" name="current_password" placeholder="أدخل كلمة المرور الحالية">
                                    </div>
                                    <div class="input-group">
                                        <label>كلمة المرور الجديدة</label>
                                        <input type="password" name="new_password" placeholder="كلمة المرور الجديدة">
                                    </div>
                                </div>
                                <div class="input-group">
                                    <label>تأكيد كلمة المرور الجديدة</label>
                                    <input type="password" name="confirm_new_password" placeholder="تأكيد كلمة المرور الجديدة">
                                </div>
                                <small class="text-muted">اترك الحقول فارغة إذا لم ترد تغيير كلمة المرور</small>
                            </div>
                            
                            <div class="profile-actions">
                                <button type="submit" class="auth-btn auth-primary">
                                    <i class="fa-solid fa-save"></i>
                                    حفظ التغييرات
                                </button>
                                <button type="button" class="auth-btn auth-secondary" onclick="authSystem.hideProfileModal()">
                                    <i class="fa-solid fa-times"></i>
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addProfileModalStyles();
    }

    setupModalEvents() {
        this.bindAuthEvents();
        this.bindProfileEvents();
    }

    bindAuthEvents() {
        const showRegister = document.getElementById('showRegister');
        const showLogin = document.getElementById('showLogin');
        
        if (showRegister) {
            showRegister.onclick = () => this.showRegisterForm();
        }
        
        if (showLogin) {
            showLogin.onclick = () => this.showLoginForm();
        }
        
        const authClose = document.getElementById('authClose');
        if (authClose) {
            authClose.onclick = () => this.hideAuthModal();
        }
        
        const loginForm = document.getElementById('loginFormElement');
        const registerForm = document.getElementById('registerFormElement');
        
        if (loginForm) {
            loginForm.onsubmit = (e) => {
                e.preventDefault();
                this.handleLogin(e);
            };
        }
        
        if (registerForm) {
            registerForm.onsubmit = (e) => {
                e.preventDefault();
                this.handleRegister(e);
            };
        }
        
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.onclick = (e) => {
                if (e.target.id === 'authModal') {
                    this.hideAuthModal();
                }
            };
        }
    }

    bindProfileEvents() {
        const profileClose = document.getElementById('profileClose');
        if (profileClose) {
            profileClose.onclick = () => this.hideProfileModal();
        }
        
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.onsubmit = (e) => {
                e.preventDefault();
                this.handleProfileUpdate(e);
            };
        }
        
        const profileModal = document.getElementById('profileModal');
        if (profileModal) {
            profileModal.onclick = (e) => {
                if (e.target.id === 'profileModal') {
                    this.hideProfileModal();
                }
            };
        }
    }

    showAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
            this.showLoginForm();
        }
    }

    hideAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    showProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            this.loadProfileData();
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
        }
    }

    hideProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    showLoginForm() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm && registerForm) {
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        }
    }

    showRegisterForm() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm && registerForm) {
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    }

    async handleLogin(e) {
        const formData = new FormData(e.target);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        
        console.log('📤 محاولة تسجيل الدخول:', data);
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري التسجيل...';
        submitBtn.disabled = true;
        
        try {
            let result;
            
            if (this.demoMode) {
                // وضع تجريبي - لا حاجة للاتصال بالخادم
                await new Promise(resolve => setTimeout(resolve, 1000)); // محاكاة الانتظار
                
                result = {
                    success: true,
                    message: 'تم تسجيل الدخول بنجاح (وضع تجريبي)',
                    user: {
                        id: 1,
                        full_name: data.email.split('@')[0],
                        email: data.email,
                        phone: '',
                        birth_date: '',
                        address: '',
                        created_at: new Date().toISOString()
                    }
                };
            } else {
                // الوضع العادي - الاتصال بالخادم
                const response = await fetch('auth.php?action=login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                console.log('📥 استجابة الخادم:', response);
                
                let result;
                const responseText = await response.text();
                
                try {
                    result = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('❌ خطأ في تحويل JSON:', responseText);
                    throw new Error('استجابة غير صالحة من الخادم');
                }
            }
            
            console.log('📋 نتيجة التسجيل:', result);
            
            if (result.success) {
                localStorage.setItem('userData', JSON.stringify(result.user));
                this.showMessage('تم تسجيل الدخول بنجاح!', 'success');
                this.hideAuthModal();
                this.checkAuthStatus();
                
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                this.showMessage(result.message || 'فشل تسجيل الدخول', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تسجيل الدخول:', error);
            this.showMessage('حدث خطأ أثناء تسجيل الدخول: ' + error.message, 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleRegister(e) {
        const formData = new FormData(e.target);
        const data = {
            full_name: formData.get('full_name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirm_password: formData.get('confirm_password'),
            phone: formData.get('phone'),
            birth_date: formData.get('birth_date'),
            address: formData.get('address')
        };
        
        console.log('📤 محاولة التسجيل:', data);
        
        if (data.password !== data.confirm_password) {
            this.showMessage('كلمات المرور غير متطابقة', 'error');
            return;
        }
        
        if (data.password.length < 6) {
            this.showMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري إنشاء الحساب...';
        submitBtn.disabled = true;
        
        try {
            let result;
            
            if (this.demoMode) {
                // وضع تجريبي - لا حاجة للاتصال بالخادم
                await new Promise(resolve => setTimeout(resolve, 1000)); // محاكاة الانتظار
                
                result = {
                    success: true,
                    message: 'تم إنشاء الحساب بنجاح (وضع تجريبي)'
                };
            } else {
                // الوضع العادي - الاتصال بالخادم
                const response = await fetch('auth.php?action=register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                console.log('📥 استجابة التسجيل:', response);
                
                let result;
                const responseText = await response.text();
                
                try {
                    result = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('❌ خطأ في تحويل JSON:', responseText);
                    throw new Error('استجابة غير صالحة من الخادم');
                }
            }
            
            console.log('📋 نتيجة إنشاء الحساب:', result);
            
            if (result.success) {
                this.showMessage('تم إنشاء الحساب بنجاح!', 'success');
                this.showLoginForm();
                
                const emailInput = document.querySelector('#loginForm input[name="email"]');
                if (emailInput) {
                    emailInput.value = data.email;
                }
            } else {
                this.showMessage(result.message || 'فشل إنشاء الحساب', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في إنشاء الحساب:', error);
            this.showMessage('حدث خطأ أثناء إنشاء الحساب: ' + error.message, 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleProfileUpdate(e) {
        const formData = new FormData(e.target);
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        if (!userData || !userData.id) {
            this.showMessage('يجب تسجيل الدخول أولاً', 'error');
            return;
        }

        const data = {
            user_id: userData.id,
            full_name: formData.get('full_name'),
            phone: formData.get('phone'),
            birth_date: formData.get('birth_date'),
            address: formData.get('address'),
            current_password: formData.get('current_password'),
            new_password: formData.get('new_password'),
            confirm_new_password: formData.get('confirm_new_password')
        };
        
        if (data.new_password) {
            if (!data.current_password) {
                this.showMessage('يجب إدخال كلمة المرور الحالية', 'error');
                return;
            }
            
            if (data.new_password !== data.confirm_new_password) {
                this.showMessage('كلمات المرور الجديدة غير متطابقة', 'error');
                return;
            }
            
            if (data.new_password.length < 6) {
                this.showMessage('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل', 'error');
                return;
            }
        }
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الحفظ...';
        submitBtn.disabled = true;
        
        try {
            let result;
            
            if (this.demoMode) {
                // وضع تجريبي - تحديث البيانات محلياً
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const updatedUser = {
                    ...userData,
                    full_name: data.full_name,
                    phone: data.phone,
                    birth_date: data.birth_date,
                    address: data.address
                };
                
                result = {
                    success: true,
                    message: 'تم تحديث البيانات بنجاح (وضع تجريبي)',
                    user: updatedUser
                };
            } else {
                // الوضع العادي - الاتصال بالخادم
                const response = await fetch('profile.php?action=update_profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                let result;
                const responseText = await response.text();
                
                try {
                    result = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('❌ خطأ في تحويل JSON:', responseText);
                    throw new Error('استجابة غير صالحة من الخادم');
                }
            }
            
            console.log('📋 نتيجة تحديث الملف:', result);
            
            if (result.success) {
                this.showMessage('تم تحديث البيانات بنجاح!', 'success');
                
                if (result.user) {
                    localStorage.setItem('userData', JSON.stringify(result.user));
                    this.checkAuthStatus();
                }
                
                this.hideProfileModal();
            } else {
                this.showMessage(result.message || 'فشل تحديث البيانات', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الملف الشخصي:', error);
            this.showMessage('حدث خطأ أثناء تحديث البيانات', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    loadProfileData() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        document.getElementById('profileName').textContent = userData.full_name || 'مستخدم';
        document.getElementById('profileEmail').textContent = userData.email || '';
        document.getElementById('profileFullName').value = userData.full_name || '';
        document.getElementById('profileEmailInput').value = userData.email || '';
        document.getElementById('profilePhone').value = userData.phone || '';
        document.getElementById('profileBirthDate').value = userData.birth_date || '';
        document.getElementById('profileAddress').value = userData.address || '';
        
        const badge = document.getElementById('profileBadge');
        if (badge) {
            badge.textContent = this.demoMode ? 'تجريبي' : 'عضو';
            badge.className = `registration-badge ${this.demoMode ? 'badge-demo' : 'badge-manual'}`;
        }
        
        const joinDate = document.getElementById('profileJoinDate');
        if (joinDate) {
            joinDate.textContent = `مسجل منذ ${this.formatJoinDate(userData.created_at)}`;
        }
    }

    handleLogout() {
        localStorage.removeItem('userData');
        this.showMessage('تم تسجيل الخروج بنجاح', 'success');
        this.checkAuthStatus();
        
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    isLoggedIn() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        return !!(userData && userData.id);
    }

    checkAuthStatus() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        if (this.isLoggedIn()) {
            console.log('✅ المستخدم مسجل الدخول:', userData);
            this.updateUserInterface();
        } else {
            console.log('❌ المستخدم غير مسجل الدخول');
        }
    }

    updateUserInterface() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        console.log('🔄 تحديث واجهة المستخدم:', userData);
        
        const userIcons = document.querySelectorAll('.fa-solid.fa-user, .user-icon');
        userIcons.forEach(icon => {
            const button = icon.closest('button') || icon;
            button.style.color = 'var(--primary-color)';
            button.title = `مرحباً ${userData.full_name || 'مستخدم'}`;
        });
    }

    showProfile() {
        this.showProfileModal();
    }

    showOrders() {
        this.showMessage('سيتم فتح صفحة الطلبات قريباً', 'info');
    }

    showMessage(message, type) {
        const existingMessages = document.querySelectorAll('.system-message');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.className = `system-message ${type}`;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 4000);
    }

    addAuthModalStyles() {
        if (document.querySelector('#auth-styles')) return;

        const styles = `
            .auth-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .auth-modal.active {
                opacity: 1;
            }
            
            .auth-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 450px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            
            .auth-modal.active .auth-content {
                transform: scale(1);
            }
            
            .auth-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .auth-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .auth-form {
                display: none;
            }
            
            .auth-form.active {
                display: block;
            }
            
            .auth-form h3 {
                text-align: center;
                margin-bottom: 25px;
                color: var(--primary-color);
                font-size: 24px;
                font-weight: bold;
            }
            
            .demo-notice {
                background: var(--warning-color);
                color: black;
                padding: 10px;
                border-radius: 8px;
                margin-bottom: 15px;
                text-align: center;
                font-size: 14px;
                font-weight: bold;
            }
            
            .register-info {
                text-align: center;
                color: #666;
                margin-bottom: 20px;
                font-size: 14px;
            }
            
            .input-group {
                margin-bottom: 15px;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .password-hint {
                color: #666;
                display: block;
                margin-top: 5px;
                font-size: 12px;
            }
            
            .auth-btn {
                width: 100%;
                padding: 15px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: all 0.3s ease;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .auth-btn:hover:not(:disabled) {
                background: var(--secondary-color);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(162, 0, 135, 0.3);
            }
            
            .auth-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }
            
            .auth-switch {
                text-align: center;
                margin-top: 25px;
                color: var(--dark-color);
                font-size: 14px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
            }
            
            .switch-link {
                color: var(--primary-color);
                cursor: pointer;
                font-weight: bold;
                transition: color 0.3s ease;
            }
            
            .switch-link:hover {
                color: var(--secondary-color);
                text-decoration: underline;
            }

            .user-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                padding: 0;
                min-width: 280px;
                z-index: 1000;
                margin-top: 8px;
                border: 2px solid var(--primary-color);
                overflow: hidden;
                display: none;
            }
            
            .user-header {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                padding: 20px;
                color: white;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .user-avatar {
                font-size: 40px;
                opacity: 0.9;
            }
            
            .user-details {
                flex: 1;
            }
            
            .user-details strong {
                display: block;
                font-size: 16px;
                margin-bottom: 4px;
            }
            
            .user-details small {
                font-size: 12px;
                opacity: 0.8;
            }
            
            .menu-section {
                padding: 15px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .menu-items {
                padding: 0;
            }
            
            .user-menu-item {
                display: flex;
                align-items: center;
                padding: 12px 20px;
                color: #333;
                text-decoration: none;
                border: none;
                background: none;
                width: 100%;
                text-align: right;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
                gap: 12px;
                position: relative;
                border-bottom: 1px solid #f8f8f8;
            }
            
            .user-menu-item:last-child {
                border-bottom: none;
            }
            
            .user-menu-item i {
                width: 20px;
                text-align: center;
                color: var(--primary-color);
                font-size: 16px;
            }
            
            .user-menu-item:hover {
                background: var(--light-color);
                transform: translateX(-5px);
            }
            
            .user-menu-item:hover i {
                color: var(--secondary-color);
            }
            
            .logout-btn {
                color: var(--danger-color);
                font-weight: bold;
                margin-top: 0;
            }
            
            .logout-btn i {
                color: var(--danger-color);
            }
            
            .logout-btn:hover {
                background: #ffe6e6;
            }
            
            .menu-badge {
                background: var(--secondary-color);
                color: white;
                border-radius: 12px;
                padding: 2px 8px;
                font-size: 11px;
                font-weight: bold;
                margin-right: auto;
            }

            .system-message {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 15px 25px;
                border-radius: 8px;
                color: white;
                z-index: 10001;
                font-weight: bold;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                animation: slideDown 0.3s ease;
            }
            
            .system-message.success {
                background: var(--success-color);
            }
            
            .system-message.error {
                background: var(--danger-color);
            }
            
            .system-message.info {
                background: var(--info-color);
            }
            
            @keyframes slideDown {
                from {
                    transform: translateX(-50%) translateY(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'auth-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    addProfileModalStyles() {
        if (document.querySelector('#profile-styles')) return;

        const styles = `
            .profile-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .profile-modal.active {
                opacity: 1;
            }
            
            .profile-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 700px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            
            .profile-modal.active .profile-content {
                transform: scale(1);
            }
            
            .profile-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .profile-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .profile-header {
                display: flex;
                align-items: center;
                gap: 20px;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #f0f0f0;
            }
            
            .profile-avatar {
                font-size: 60px;
                color: var(--primary-color);
            }
            
            .profile-info h3 {
                margin: 0 0 5px 0;
                color: var(--primary-color);
            }
            
            .profile-info p {
                margin: 0 0 10px 0;
                color: #666;
            }
            
            .profile-badges {
                display: flex;
                gap: 10px;
                align-items: center;
            }
            
            .join-date {
                font-size: 12px;
                color: #888;
                background: #f8f9fa;
                padding: 3px 8px;
                border-radius: 12px;
            }
            
            .profile-body {
                margin-top: 20px;
            }
            
            .form-section {
                margin-bottom: 30px;
                padding: 20px;
                border: 1px solid #e0e0e0;
                border-radius: 10px;
                background: #fafafa;
            }
            
            .form-section h4 {
                margin: 0 0 20px 0;
                color: var(--primary-color);
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .input-row {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
            }
            
            .input-row .input-group {
                flex: 1;
            }
            
            .input-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #333;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .input-group input[readonly] {
                background-color: #f8f9fa;
                color: #666;
                cursor: not-allowed;
            }
            
            .text-muted {
                color: #666;
                font-size: 12px;
                display: block;
                margin-top: 5px;
            }
            
            .profile-actions {
                display: flex;
                gap: 15px;
                margin-top: 30px;
            }
            
            .profile-actions .auth-btn {
                flex: 1;
                margin-bottom: 0;
            }
            
            .auth-secondary {
                background: #6c757d !important;
            }
            
            .auth-secondary:hover {
                background: #5a6268 !important;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'profile-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// بدء النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});

// جعل النظام متاحاً globally للاستدعاء من الأزرار
window.showAuthModal = () => window.authSystem?.showAuthModal();
window.showProfile = () => window.authSystem?.showProfile();
window.handleLogout = () => window.authSystem?.handleLogout();*/


















































































































































/*// نظام المصادقة والملف الشخصي المتكامل
class AuthSystem {
    constructor() {
        this.demoMode = false;
        this.init();
    }

    init() {
        console.log('🚀 بدء نظام المصادقة...');
        this.setCustomColors();
        this.createAuthModal();
        this.createProfileModal();
        this.setupUserIconListener();
        this.setupModalEvents();
        this.checkAuthStatus();
        this.checkServerStatus();
    }

    async checkServerStatus() {
        try {
            const response = await fetch('auth.php?action=test', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            const result = await response.json();
            this.demoMode = !result.success;
            
            if (this.demoMode) {
                console.log('🔧 الخادم غير متاح، النظام يعمل في الوضع المحلي');
            } else {
                console.log('✅ الخادم متاح ويعمل');
            }
        } catch (error) {
            console.log('🔧 الخادم غير متاح، النظام يعمل في الوضع المحلي');
            this.demoMode = true;
        }
    }

    setCustomColors() {
        const styles = `
            :root {
                --primary-color: #ea70b1;
                --secondary-color: #a20087;
                --light-color: #f8f9fa;
                --dark-color: #343a40;
                --success-color: #28a745;
                --danger-color: #dc3545;
                --warning-color: #ffc107;
                --info-color: #17a2b8;
            }
            
            .auth-primary { background-color: var(--primary-color) !important; }
            .auth-secondary { background-color: var(--secondary-color) !important; }
            .auth-success { background-color: var(--success-color) !important; }
            .auth-info { background-color: var(--info-color) !important; }
            
            .auth-primary:hover { background-color: var(--secondary-color) !important; }
            .auth-success:hover { background-color: #218838 !important; }
            .auth-info:hover { background-color: #138496 !important; }
            
            .text-primary { color: var(--primary-color) !important; }
            .text-secondary { color: var(--secondary-color) !important; }
            .text-success { color: var(--success-color) !important; }
            .text-danger { color: var(--danger-color) !important; }
            .text-info { color: var(--info-color) !important; }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupUserIconListener() {
        const userIcons = document.querySelectorAll('.fa-solid.fa-user, .user-icon');
        
        if (userIcons.length > 0) {
            userIcons.forEach(icon => {
                const button = icon.closest('button') || icon;
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('✅ تم النقر على أيقونة المستخدم');
                    this.handleUserClick(button);
                });
            });
        } else {
            console.error('❌ لم يتم العثور على أيقونة المستخدم!');
            this.createUserIcon();
        }
    }

    createUserIcon() {
        const userIcon = document.createElement('button');
        userIcon.className = 'user-icon';
        userIcon.innerHTML = '<i class="fa-solid fa-user"></i>';
        userIcon.style.cssText = `
            background: #f0f0f0;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            margin-left: 10px;
        `;
        
        const header = document.querySelector('.header') || document.body;
        header.appendChild(userIcon);
        
        userIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleUserClick(userIcon);
        });
    }

    handleUserClick(element) {
        if (this.isLoggedIn()) {
            this.showUserMenu(element);
        } else {
            this.showAuthModal();
        }
    }

    showUserMenu(icon) {
        const oldMenu = document.querySelector('.user-menu');
        if (oldMenu) oldMenu.remove();
        
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        const menuHTML = `
            <div class="user-menu">
                <div class="user-header">
                    <div class="user-avatar">
                        <i class="fa-solid fa-user-circle"></i>
                    </div>
                    <div class="user-details">
                        <strong>${userData.full_name || userData.name || 'مستخدم'}</strong>
                        <small>${userData.email || ''}</small>
                        ${this.demoMode ? '<small style="color: var(--warning-color); margin-top: 5px; display: block;"><i class="fa-solid fa-computer"></i> الوضع المحلي</small>' : ''}
                    </div>
                </div>
                
                <div class="menu-section">
                    <div class="menu-items">
                        <button class="user-menu-item" onclick="authSystem.showProfile()">
                            <i class="fa-solid fa-user"></i>
                            حسابي
                        </button>
                        <button class="user-menu-item" onclick="authSystem.showOrders()">
                            <i class="fa-solid fa-box"></i>
                            الطلبات
                            <span class="menu-badge" id="ordersCount">0</span>
                        </button>
                    </div>
                </div>
                
                <div class="menu-items">
                    <button class="user-menu-item logout-btn" onclick="authSystem.handleLogout()">
                        <i class="fa-solid fa-right-from-bracket"></i>
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        `;
        
        const iconContainer = icon.closest('button') || icon;
        const container = iconContainer.parentNode;
        container.style.position = 'relative';
        container.insertAdjacentHTML('beforeend', menuHTML);
        
        const menu = container.querySelector('.user-menu');
        
        this.updateMenuCounts();
        
        setTimeout(() => {
            menu.style.display = 'block';
        }, 10);
        
        const closeMenu = (e) => {
            if (menu && !menu.contains(e.target) && !icon.contains(e.target)) {
                menu.style.display = 'none';
                document.removeEventListener('click', closeMenu);
                setTimeout(() => {
                    if (menu.parentNode) {
                        menu.remove();
                    }
                }, 300);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 10);
    }

    async updateMenuCounts() {
        if (!this.isLoggedIn()) return;

        try {
            // في الوضع المحلي، نستخدم بيانات وهمية
            if (this.demoMode) {
                const ordersCount = document.getElementById('ordersCount');
                if (ordersCount) {
                    ordersCount.textContent = '0';
                }
                return;
            }

            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            
            const response = await fetch('profile.php?action=get_user_stats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userData.id })
            });
            
            if (!response.ok) {
                throw new Error(`خطأ في الشبكة: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                const ordersCount = document.getElementById('ordersCount');
                if (ordersCount) {
                    ordersCount.textContent = result.data.orders_count || 0;
                }
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الإحصائيات:', error);
        }
    }

    createAuthModal() {
        if (document.getElementById('authModal')) return;

        const modalHTML = `
            <div class="auth-modal" id="authModal">
                <div class="auth-content">
                    <button class="auth-close" id="authClose">×</button>
                    ${this.demoMode ? '<div class="demo-notice"><i class="fa-solid fa-computer"></i> النظام يعمل في الوضع المحلي - البيانات سيتم حفظها في المتصفح</div>' : ''}
                    
                    <div class="auth-form active" id="loginForm">
                        <h3 class="text-primary">تسجيل الدخول</h3>
                        <form id="loginFormElement">
                            <div class="input-group">
                                <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                            </div>
                            <div class="input-group">
                                <input type="password" name="password" placeholder="كلمة المرور" required>
                            </div>
                            <button type="submit" class="auth-btn auth-primary">
                                <i class="fa-solid fa-right-to-bracket"></i>
                                تسجيل الدخول
                            </button>
                        </form>
                        <div class="auth-switch">
                            ليس لديك حساب؟ 
                            <span class="switch-link text-primary" id="showRegister">إنشاء حساب جديد</span>
                        </div>
                    </div>
                    
                    <div class="auth-form" id="registerForm">
                        <h3 class="text-primary">إنشاء حساب جديد</h3>
                        <form id="registerFormElement">
                            <div class="input-group">
                                <input type="text" name="full_name" placeholder="الاسم الكامل" required>
                            </div>
                            <div class="input-group">
                                <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                            </div>
                            <div class="input-group">
                                <input type="password" name="password" placeholder="كلمة المرور" required>
                                <small class="password-hint">كلمة المرور يجب أن تكون 6 أحرف على الأقل</small>
                            </div>
                            <div class="input-group">
                                <input type="password" name="confirm_password" placeholder="تأكيد كلمة المرور" required>
                            </div>
                            <div class="input-group">
                                <input type="tel" name="phone" placeholder="رقم الهاتف (اختياري)">
                            </div>
                            <div class="input-group">
                                <input type="date" name="birth_date" placeholder="تاريخ الميلاد">
                            </div>
                            <div class="input-group">
                                <textarea name="address" placeholder="العنوان" rows="3"></textarea>
                            </div>
                            <button type="submit" class="auth-btn auth-primary">
                                <i class="fa-solid fa-user-plus"></i>
                                إنشاء حساب
                            </button>
                        </form>
                        <div class="auth-switch">
                            لديك حساب بالفعل؟ 
                            <span class="switch-link text-primary" id="showLogin">تسجيل الدخول</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addAuthModalStyles();
    }

    createProfileModal() {
        if (document.getElementById('profileModal')) return;

        const modalHTML = `
            <div class="profile-modal" id="profileModal">
                <div class="profile-content">
                    <button class="profile-close" id="profileClose">×</button>
                    ${this.demoMode ? '<div class="demo-notice"><i class="fa-solid fa-computer"></i> النظام يعمل في الوضع المحلي - البيانات محفوظة في المتصفح</div>' : ''}
                    
                    <div class="profile-header">
                        <div class="profile-avatar">
                            <i class="fa-solid fa-user-circle"></i>
                        </div>
                        <div class="profile-info">
                            <h3 class="text-primary" id="profileName">الاسم الكامل</h3>
                            <p id="profileEmail">البريد الإلكتروني</p>
                        </div>
                    </div>
                    
                    <div class="profile-body">
                        <form id="profileForm">
                            <div class="form-section">
                                <h4><i class="fa-solid fa-user"></i> المعلومات الشخصية</h4>
                                <div class="input-row">
                                    <div class="input-group">
                                        <label>الاسم الكامل</label>
                                        <input type="text" name="full_name" id="profileFullName" required>
                                    </div>
                                    <div class="input-group">
                                        <label>البريد الإلكتروني</label>
                                        <input type="email" name="email" id="profileEmailInput" readonly>
                                        <small class="text-muted">لا يمكن تعديل البريد الإلكتروني</small>
                                    </div>
                                </div>
                                
                                <div class="input-row">
                                    <div class="input-group">
                                        <label>رقم الهاتف</label>
                                        <input type="tel" name="phone" id="profilePhone">
                                    </div>
                                    <div class="input-group">
                                        <label>تاريخ الميلاد</label>
                                        <input type="date" name="birth_date" id="profileBirthDate">
                                    </div>
                                </div>
                                
                                <div class="input-group">
                                    <label>العنوان</label>
                                    <textarea name="address" id="profileAddress" rows="3" placeholder="العنوان الكامل"></textarea>
                                </div>
                            </div>
                            
                            <div class="profile-actions">
                                <button type="submit" class="auth-btn auth-primary">
                                    <i class="fa-solid fa-save"></i>
                                    حفظ التغييرات
                                </button>
                                <button type="button" class="auth-btn auth-secondary" onclick="authSystem.hideProfileModal()">
                                    <i class="fa-solid fa-times"></i>
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addProfileModalStyles();
    }

    setupModalEvents() {
        this.bindAuthEvents();
        this.bindProfileEvents();
    }

    bindAuthEvents() {
        const showRegister = document.getElementById('showRegister');
        const showLogin = document.getElementById('showLogin');
        
        if (showRegister) {
            showRegister.onclick = () => this.showRegisterForm();
        }
        
        if (showLogin) {
            showLogin.onclick = () => this.showLoginForm();
        }
        
        const authClose = document.getElementById('authClose');
        if (authClose) {
            authClose.onclick = () => this.hideAuthModal();
        }
        
        const loginForm = document.getElementById('loginFormElement');
        const registerForm = document.getElementById('registerFormElement');
        
        if (loginForm) {
            loginForm.onsubmit = (e) => {
                e.preventDefault();
                this.handleLogin(e);
            };
        }
        
        if (registerForm) {
            registerForm.onsubmit = (e) => {
                e.preventDefault();
                this.handleRegister(e);
            };
        }
        
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.onclick = (e) => {
                if (e.target.id === 'authModal') {
                    this.hideAuthModal();
                }
            };
        }
    }

    bindProfileEvents() {
        const profileClose = document.getElementById('profileClose');
        if (profileClose) {
            profileClose.onclick = () => this.hideProfileModal();
        }
        
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.onsubmit = (e) => {
                e.preventDefault();
                this.handleProfileUpdate(e);
            };
        }
        
        const profileModal = document.getElementById('profileModal');
        if (profileModal) {
            profileModal.onclick = (e) => {
                if (e.target.id === 'profileModal') {
                    this.hideProfileModal();
                }
            };
        }
    }

    showAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
            this.showLoginForm();
        }
    }

    hideAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    showProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            this.loadProfileData();
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
        }
    }

    hideProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    showLoginForm() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm && registerForm) {
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        }
    }

    showRegisterForm() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm && registerForm) {
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    }

    async handleLogin(e) {
        const formData = new FormData(e.target);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        
        console.log('📤 محاولة تسجيل الدخول:', data);
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري التسجيل...';
        submitBtn.disabled = true;
        
        try {
            let result;
            
            if (this.demoMode) {
                // الوضع المحلي - التحقق من البيانات محلياً
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // التحقق من وجود المستخدم في localStorage
                const users = JSON.parse(localStorage.getItem('demo_users') || '{}');
                const user = users[data.email];
                
                if (user && user.password === data.password) {
                    result = {
                        success: true,
                        message: 'تم تسجيل الدخول بنجاح (الوضع المحلي)',
                        user: {
                            id: user.id,
                            full_name: user.full_name,
                            email: user.email,
                            phone: user.phone,
                            birth_date: user.birth_date,
                            address: user.address,
                            created_at: user.created_at
                        }
                    };
                } else {
                    result = {
                        success: false,
                        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
                    };
                }
            } else {
                // الوضع العادي - الاتصال بالخادم
                const response = await fetch('auth.php?action=login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                console.log('📥 استجابة الخادم:', response);
                
                const responseText = await response.text();
                
                try {
                    result = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('❌ خطأ في تحويل JSON:', responseText);
                    throw new Error('استجابة غير صالحة من الخادم');
                }
            }
            
            console.log('📋 نتيجة التسجيل:', result);
            
            if (result.success) {
                localStorage.setItem('userData', JSON.stringify(result.user));
                this.showMessage('تم تسجيل الدخول بنجاح!', 'success');
                this.hideAuthModal();
                this.checkAuthStatus();
                
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                this.showMessage(result.message || 'فشل تسجيل الدخول', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تسجيل الدخول:', error);
            
            // في حالة الخطأ، ننتقل للوضع المحلي
            this.demoMode = true;
            this.showMessage('الخادم غير متاح، جاري استخدام الوضع المحلي', 'info');
            
            // إعادة المحاولة في الوضع المحلي
            setTimeout(() => {
                this.handleLogin(e);
            }, 1000);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleRegister(e) {
        const formData = new FormData(e.target);
        const data = {
            full_name: formData.get('full_name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirm_password: formData.get('confirm_password'),
            phone: formData.get('phone'),
            birth_date: formData.get('birth_date'),
            address: formData.get('address')
        };
        
        console.log('📤 محاولة التسجيل:', data);
        
        if (data.password !== data.confirm_password) {
            this.showMessage('كلمات المرور غير متطابقة', 'error');
            return;
        }
        
        if (data.password.length < 6) {
            this.showMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري إنشاء الحساب...';
        submitBtn.disabled = true;
        
        try {
            let result;
            
            if (this.demoMode) {
                // الوضع المحلي - حفظ البيانات في localStorage
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const users = JSON.parse(localStorage.getItem('demo_users') || '{}');
                
                // التحقق من عدم وجود البريد الإلكتروني مسبقاً
                if (users[data.email]) {
                    result = {
                        success: false,
                        message: 'البريد الإلكتروني مسجل مسبقاً'
                    };
                } else {
                    // إنشاء مستخدم جديد
                    const newUser = {
                        id: Date.now(), // استخدام timestamp كمعرف فريد
                        full_name: data.full_name,
                        email: data.email,
                        password: data.password, // في الواقع، يجب تشفير كلمة المرور
                        phone: data.phone,
                        birth_date: data.birth_date,
                        address: data.address,
                        created_at: new Date().toISOString()
                    };
                    
                    users[data.email] = newUser;
                    localStorage.setItem('demo_users', JSON.stringify(users));
                    
                    result = {
                        success: true,
                        message: 'تم إنشاء الحساب بنجاح (الوضع المحلي)'
                    };
                }
            } else {
                // الوضع العادي - الاتصال بالخادم
                const response = await fetch('auth.php?action=register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                console.log('📥 استجابة التسجيل:', response);
                
                const responseText = await response.text();
                
                try {
                    result = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('❌ خطأ في تحويل JSON:', responseText);
                    throw new Error('استجابة غير صالحة من الخادم');
                }
            }
            
            console.log('📋 نتيجة إنشاء الحساب:', result);
            
            if (result.success) {
                this.showMessage('تم إنشاء الحساب بنجاح!', 'success');
                this.showLoginForm();
                
                const emailInput = document.querySelector('#loginForm input[name="email"]');
                if (emailInput) {
                    emailInput.value = data.email;
                }
            } else {
                this.showMessage(result.message || 'فشل إنشاء الحساب', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في إنشاء الحساب:', error);
            
            // في حالة الخطأ، ننتقل للوضع المحلي
            this.demoMode = true;
            this.showMessage('الخادم غير متاح، جاري استخدام الوضع المحلي', 'info');
            
            // إعادة المحاولة في الوضع المحلي
            setTimeout(() => {
                this.handleRegister(e);
            }, 1000);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleProfileUpdate(e) {
        const formData = new FormData(e.target);
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        if (!userData || !userData.id) {
            this.showMessage('يجب تسجيل الدخول أولاً', 'error');
            return;
        }

        const data = {
            user_id: userData.id,
            full_name: formData.get('full_name'),
            phone: formData.get('phone'),
            birth_date: formData.get('birth_date'),
            address: formData.get('address')
        };
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الحفظ...';
        submitBtn.disabled = true;
        
        try {
            let result;
            
            if (this.demoMode) {
                // الوضع المحلي - تحديث البيانات في localStorage
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const users = JSON.parse(localStorage.getItem('demo_users') || '{}');
                const currentUser = users[userData.email];
                
                if (currentUser) {
                    // تحديث بيانات المستخدم
                    currentUser.full_name = data.full_name;
                    currentUser.phone = data.phone;
                    currentUser.birth_date = data.birth_date;
                    currentUser.address = data.address;
                    
                    users[userData.email] = currentUser;
                    localStorage.setItem('demo_users', JSON.stringify(users));
                    
                    result = {
                        success: true,
                        message: 'تم تحديث البيانات بنجاح (الوضع المحلي)',
                        user: currentUser
                    };
                } else {
                    result = {
                        success: false,
                        message: 'المستخدم غير موجود'
                    };
                }
            } else {
                // الوضع العادي - الاتصال بالخادم
                const response = await fetch('profile.php?action=update_profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                const responseText = await response.text();
                
                try {
                    result = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('❌ خطأ في تحويل JSON:', responseText);
                    throw new Error('استجابة غير صالحة من الخادم');
                }
            }
            
            console.log('📋 نتيجة تحديث الملف:', result);
            
            if (result.success) {
                this.showMessage('تم تحديث البيانات بنجاح!', 'success');
                
                if (result.user) {
                    localStorage.setItem('userData', JSON.stringify(result.user));
                    this.checkAuthStatus();
                }
                
                this.hideProfileModal();
            } else {
                this.showMessage(result.message || 'فشل تحديث البيانات', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الملف الشخصي:', error);
            
            // في حالة الخطأ، ننتقل للوضع المحلي
            this.demoMode = true;
            this.showMessage('الخادم غير متاح، جاري استخدام الوضع المحلي', 'info');
            
            // إعادة المحاولة في الوضع المحلي
            setTimeout(() => {
                this.handleProfileUpdate(e);
            }, 1000);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    loadProfileData() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        document.getElementById('profileName').textContent = userData.full_name || 'مستخدم';
        document.getElementById('profileEmail').textContent = userData.email || '';
        document.getElementById('profileFullName').value = userData.full_name || '';
        document.getElementById('profileEmailInput').value = userData.email || '';
        document.getElementById('profilePhone').value = userData.phone || '';
        document.getElementById('profileBirthDate').value = userData.birth_date || '';
        document.getElementById('profileAddress').value = userData.address || '';
    }

    handleLogout() {
        localStorage.removeItem('userData');
        this.showMessage('تم تسجيل الخروج بنجاح', 'success');
        this.checkAuthStatus();
        
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    isLoggedIn() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        return !!(userData && userData.id);
    }

    checkAuthStatus() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        if (this.isLoggedIn()) {
            console.log('✅ المستخدم مسجل الدخول:', userData);
            this.updateUserInterface();
        } else {
            console.log('❌ المستخدم غير مسجل الدخول');
        }
    }

    updateUserInterface() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        console.log('🔄 تحديث واجهة المستخدم:', userData);
        
        const userIcons = document.querySelectorAll('.fa-solid.fa-user, .user-icon');
        userIcons.forEach(icon => {
            const button = icon.closest('button') || icon;
            button.style.color = 'var(--primary-color)';
            button.title = `مرحباً ${userData.full_name || 'مستخدم'}`;
        });
    }

    showProfile() {
        this.showProfileModal();
    }

    showOrders() {
        this.showMessage('سيتم فتح صفحة الطلبات قريباً', 'info');
    }

    showMessage(message, type) {
        const existingMessages = document.querySelectorAll('.system-message');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.className = `system-message ${type}`;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 4000);
    }

    addAuthModalStyles() {
        if (document.querySelector('#auth-styles')) return;

        const styles = `
            .auth-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .auth-modal.active {
                opacity: 1;
            }
            
            .auth-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 450px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            
            .auth-modal.active .auth-content {
                transform: scale(1);
            }
            
            .auth-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .auth-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .demo-notice {
                background: var(--info-color);
                color: white;
                padding: 10px;
                border-radius: 8px;
                margin-bottom: 15px;
                text-align: center;
                font-size: 14px;
                font-weight: bold;
            }
            
            .auth-form {
                display: none;
            }
            
            .auth-form.active {
                display: block;
            }
            
            .auth-form h3 {
                text-align: center;
                margin-bottom: 25px;
                color: var(--primary-color);
                font-size: 24px;
                font-weight: bold;
            }
            
            .input-group {
                margin-bottom: 15px;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .password-hint {
                color: #666;
                display: block;
                margin-top: 5px;
                font-size: 12px;
            }
            
            .auth-btn {
                width: 100%;
                padding: 15px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: all 0.3s ease;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .auth-btn:hover:not(:disabled) {
                background: var(--secondary-color);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(162, 0, 135, 0.3);
            }
            
            .auth-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }
            
            .auth-switch {
                text-align: center;
                margin-top: 25px;
                color: var(--dark-color);
                font-size: 14px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
            }
            
            .switch-link {
                color: var(--primary-color);
                cursor: pointer;
                font-weight: bold;
                transition: color 0.3s ease;
            }
            
            .switch-link:hover {
                color: var(--secondary-color);
                text-decoration: underline;
            }

            .user-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                padding: 0;
                min-width: 280px;
                z-index: 1000;
                margin-top: 8px;
                border: 2px solid var(--primary-color);
                overflow: hidden;
                display: none;
            }
            
            .user-header {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                padding: 20px;
                color: white;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .user-avatar {
                font-size: 40px;
                opacity: 0.9;
            }
            
            .user-details {
                flex: 1;
            }
            
            .user-details strong {
                display: block;
                font-size: 16px;
                margin-bottom: 4px;
            }
            
            .user-details small {
                font-size: 12px;
                opacity: 0.8;
            }
            
            .menu-section {
                padding: 15px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .menu-items {
                padding: 0;
            }
            
            .user-menu-item {
                display: flex;
                align-items: center;
                padding: 12px 20px;
                color: #333;
                text-decoration: none;
                border: none;
                background: none;
                width: 100%;
                text-align: right;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
                gap: 12px;
                position: relative;
                border-bottom: 1px solid #f8f8f8;
            }
            
            .user-menu-item:last-child {
                border-bottom: none;
            }
            
            .user-menu-item i {
                width: 20px;
                text-align: center;
                color: var(--primary-color);
                font-size: 16px;
            }
            
            .user-menu-item:hover {
                background: var(--light-color);
                transform: translateX(-5px);
            }
            
            .user-menu-item:hover i {
                color: var(--secondary-color);
            }
            
            .logout-btn {
                color: var(--danger-color);
                font-weight: bold;
                margin-top: 0;
            }
            
            .logout-btn i {
                color: var(--danger-color);
            }
            
            .logout-btn:hover {
                background: #ffe6e6;
            }
            
            .menu-badge {
                background: var(--secondary-color);
                color: white;
                border-radius: 12px;
                padding: 2px 8px;
                font-size: 11px;
                font-weight: bold;
                margin-right: auto;
            }

            .system-message {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 15px 25px;
                border-radius: 8px;
                color: white;
                z-index: 10001;
                font-weight: bold;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                animation: slideDown 0.3s ease;
            }
            
            .system-message.success {
                background: var(--success-color);
            }
            
            .system-message.error {
                background: var(--danger-color);
            }
            
            .system-message.info {
                background: var(--info-color);
            }
            
            @keyframes slideDown {
                from {
                    transform: translateX(-50%) translateY(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'auth-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    addProfileModalStyles() {
        if (document.querySelector('#profile-styles')) return;

        const styles = `
            .profile-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .profile-modal.active {
                opacity: 1;
            }
            
            .profile-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 700px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            
            .profile-modal.active .profile-content {
                transform: scale(1);
            }
            
            .profile-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .profile-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .demo-notice {
                background: var(--info-color);
                color: white;
                padding: 10px;
                border-radius: 8px;
                margin-bottom: 15px;
                text-align: center;
                font-size: 14px;
                font-weight: bold;
            }
            
            .profile-header {
                display: flex;
                align-items: center;
                gap: 20px;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #f0f0f0;
            }
            
            .profile-avatar {
                font-size: 60px;
                color: var(--primary-color);
            }
            
            .profile-info h3 {
                margin: 0 0 5px 0;
                color: var(--primary-color);
            }
            
            .profile-info p {
                margin: 0 0 10px 0;
                color: #666;
            }
            
            .profile-body {
                margin-top: 20px;
            }
            
            .form-section {
                margin-bottom: 30px;
                padding: 20px;
                border: 1px solid #e0e0e0;
                border-radius: 10px;
                background: #fafafa;
            }
            
            .form-section h4 {
                margin: 0 0 20px 0;
                color: var(--primary-color);
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .input-row {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
            }
            
            .input-row .input-group {
                flex: 1;
            }
            
            .input-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #333;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .input-group input[readonly] {
                background-color: #f8f9fa;
                color: #666;
                cursor: not-allowed;
            }
            
            .text-muted {
                color: #666;
                font-size: 12px;
                display: block;
                margin-top: 5px;
            }
            
            .profile-actions {
                display: flex;
                gap: 15px;
                margin-top: 30px;
            }
            
            .profile-actions .auth-btn {
                flex: 1;
                margin-bottom: 0;
            }
            
            .auth-secondary {
                background: #6c757d !important;
            }
            
            .auth-secondary:hover {
                background: #5a6268 !important;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'profile-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// بدء النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});

// جعل النظام متاحاً globally للاستدعاء من الأزرار
window.showAuthModal = () => window.authSystem?.showAuthModal();
window.showProfile = () => window.authSystem?.showProfile();
window.handleLogout = () => window.authSystem?.handleLogout();*/








































































































/*
// نظام المصادقة والملف الشخصي المتكامل
class AuthSystem {
    constructor() {
        this.demoMode = false;
        this.init();
    }

    init() {
        console.log('🚀 بدء نظام المصادقة...');
        this.setCustomColors();
        this.createAuthModal();
        this.createProfileModal();
        this.setupUserIconListener();
        this.setupModalEvents();
        this.checkAuthStatus();
        this.checkServerStatus();
    }

    async checkServerStatus() {
        try {
            const response = await fetch('auth.php?action=test', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            const result = await response.json();
            this.demoMode = !result.success;
            
            if (this.demoMode) {
                console.log('🔧 الخادم غير متاح، النظام يعمل في الوضع المحلي');
            } else {
                console.log('✅ الخادم متاح ويعمل');
            }
        } catch (error) {
            console.log('🔧 الخادم غير متاح، النظام يعمل في الوضع المحلي');
            this.demoMode = true;
        }
    }

    setCustomColors() {
        const styles = `
            :root {
                --primary-color: #ea70b1;
                --secondary-color: #a20087;
                --light-color: #f8f9fa;
                --dark-color: #343a40;
                --success-color: #28a745;
                --danger-color: #dc3545;
                --warning-color: #ffc107;
                --info-color: #17a2b8;
            }
            
            .auth-primary { background-color: var(--primary-color) !important; }
            .auth-secondary { background-color: var(--secondary-color) !important; }
            .auth-success { background-color: var(--success-color) !important; }
            .auth-info { background-color: var(--info-color) !important; }
            
            .auth-primary:hover { background-color: var(--secondary-color) !important; }
            .auth-success:hover { background-color: #218838 !important; }
            .auth-info:hover { background-color: #138496 !important; }
            
            .text-primary { color: var(--primary-color) !important; }
            .text-secondary { color: var(--secondary-color) !important; }
            .text-success { color: var(--success-color) !important; }
            .text-danger { color: var(--danger-color) !important; }
            .text-info { color: var(--info-color) !important; }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupUserIconListener() {
        const userIcons = document.querySelectorAll('.fa-solid.fa-user, .user-icon');
        
        if (userIcons.length > 0) {
            userIcons.forEach(icon => {
                const button = icon.closest('button') || icon;
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('✅ تم النقر على أيقونة المستخدم');
                    this.handleUserClick(button);
                });
            });
        } else {
            console.error('❌ لم يتم العثور على أيقونة المستخدم!');
            this.createUserIcon();
        }
    }

    createUserIcon() {
        const userIcon = document.createElement('button');
        userIcon.className = 'user-icon';
        userIcon.innerHTML = '<i class="fa-solid fa-user"></i>';
        userIcon.style.cssText = `
            background: #f0f0f0;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            margin-left: 10px;
        `;
        
        const header = document.querySelector('.header') || document.body;
        header.appendChild(userIcon);
        
        userIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleUserClick(userIcon);
        });
    }

    handleUserClick(element) {
        if (this.isLoggedIn()) {
            this.showUserMenu(element);
        } else {
            this.showAuthModal();
        }
    }

    showUserMenu(icon) {
        const oldMenu = document.querySelector('.user-menu');
        if (oldMenu) oldMenu.remove();
        
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        const menuHTML = `
            <div class="user-menu">
                <div class="user-header">
                    <div class="user-avatar">
                        <i class="fa-solid fa-user-circle"></i>
                    </div>
                    <div class="user-details">
                        <strong>${userData.full_name || userData.name || 'مستخدم'}</strong>
                        <small>${userData.email || ''}</small>
                        ${this.demoMode ? '<small style="color: var(--warning-color); margin-top: 5px; display: block;"><i class="fa-solid fa-computer"></i> الوضع المحلي</small>' : ''}
                    </div>
                </div>
                
                <div class="menu-section">
                    <div class="menu-items">
                        <button class="user-menu-item" onclick="authSystem.showProfile()">
                            <i class="fa-solid fa-user"></i>
                            حسابي
                        </button>
                        <button class="user-menu-item" onclick="authSystem.showOrders()">
                            <i class="fa-solid fa-box"></i>
                            الطلبات
                            <span class="menu-badge" id="ordersCount">0</span>
                        </button>
                    </div>
                </div>
                
                <div class="menu-items">
                    <button class="user-menu-item logout-btn" onclick="authSystem.handleLogout()">
                        <i class="fa-solid fa-right-from-bracket"></i>
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        `;
        
        const iconContainer = icon.closest('button') || icon;
        const container = iconContainer.parentNode;
        container.style.position = 'relative';
        container.insertAdjacentHTML('beforeend', menuHTML);
        
        const menu = container.querySelector('.user-menu');
        
        this.updateMenuCounts();
        
        setTimeout(() => {
            menu.style.display = 'block';
        }, 10);
        
        const closeMenu = (e) => {
            if (menu && !menu.contains(e.target) && !icon.contains(e.target)) {
                menu.style.display = 'none';
                document.removeEventListener('click', closeMenu);
                setTimeout(() => {
                    if (menu.parentNode) {
                        menu.remove();
                    }
                }, 300);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 10);
    }

    async updateMenuCounts() {
        if (!this.isLoggedIn()) return;

        try {
            // في الوضع المحلي، نستخدم بيانات وهمية
            if (this.demoMode) {
                const ordersCount = document.getElementById('ordersCount');
                if (ordersCount) {
                    ordersCount.textContent = '0';
                }
                return;
            }

            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            
            const response = await fetch('profile.php?action=get_user_stats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userData.id })
            });
            
            if (!response.ok) {
                throw new Error(`خطأ في الشبكة: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                const ordersCount = document.getElementById('ordersCount');
                if (ordersCount) {
                    ordersCount.textContent = result.data.orders_count || 0;
                }
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الإحصائيات:', error);
        }
    }

    createAuthModal() {
        if (document.getElementById('authModal')) return;

        const modalHTML = `
            <div class="auth-modal" id="authModal">
                <div class="auth-content">
                    <button class="auth-close" id="authClose">×</button>
                    ${this.demoMode ? '<div class="demo-notice"><i class="fa-solid fa-computer"></i> النظام يعمل في الوضع المحلي - البيانات سيتم حفظها في المتصفح</div>' : ''}
                    
                    <div class="auth-form active" id="loginForm">
                        <h3 class="text-primary">تسجيل الدخول</h3>
                        <form id="loginFormElement">
                            <div class="input-group">
                                <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                            </div>
                            <div class="input-group">
                                <input type="password" name="password" placeholder="كلمة المرور" required>
                            </div>
                            <button type="submit" class="auth-btn auth-primary">
                                <i class="fa-solid fa-right-to-bracket"></i>
                                تسجيل الدخول
                            </button>
                        </form>
                        <div class="auth-switch">
                            ليس لديك حساب؟ 
                            <span class="switch-link text-primary" id="showRegister">إنشاء حساب جديد</span>
                        </div>
                    </div>
                    
                    <div class="auth-form" id="registerForm">
                        <h3 class="text-primary">إنشاء حساب جديد</h3>
                        <form id="registerFormElement">
                            <div class="input-group">
                                <input type="text" name="full_name" placeholder="الاسم الكامل" required>
                            </div>
                            <div class="input-group">
                                <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                            </div>
                            <div class="input-group">
                                <input type="password" name="password" placeholder="كلمة المرور" required>
                                <small class="password-hint">كلمة المرور يجب أن تكون 6 أحرف على الأقل</small>
                            </div>
                            <div class="input-group">
                                <input type="password" name="confirm_password" placeholder="تأكيد كلمة المرور" required>
                            </div>
                            <div class="input-group">
                                <input type="tel" name="phone" placeholder="رقم الهاتف (اختياري)">
                            </div>
                            <div class="input-group">
                                <input type="date" name="birth_date" placeholder="تاريخ الميلاد">
                            </div>
                            <div class="input-group">
                                <textarea name="address" placeholder="العنوان" rows="3"></textarea>
                            </div>
                            <button type="submit" class="auth-btn auth-primary">
                                <i class="fa-solid fa-user-plus"></i>
                                إنشاء حساب
                            </button>
                        </form>
                        <div class="auth-switch">
                            لديك حساب بالفعل؟ 
                            <span class="switch-link text-primary" id="showLogin">تسجيل الدخول</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addAuthModalStyles();
    }

    createProfileModal() {
        if (document.getElementById('profileModal')) return;

        const modalHTML = `
            <div class="profile-modal" id="profileModal">
                <div class="profile-content">
                    <button class="profile-close" id="profileClose">×</button>
                    ${this.demoMode ? '<div class="demo-notice"><i class="fa-solid fa-computer"></i> النظام يعمل في الوضع المحلي - البيانات محفوظة في المتصفح</div>' : ''}
                    
                    <div class="profile-header">
                        <div class="profile-avatar">
                            <i class="fa-solid fa-user-circle"></i>
                        </div>
                        <div class="profile-info">
                            <h3 class="text-primary" id="profileName">الاسم الكامل</h3>
                            <p id="profileEmail">البريد الإلكتروني</p>
                        </div>
                    </div>
                    
                    <div class="profile-body">
                        <form id="profileForm">
                            <div class="form-section">
                                <h4><i class="fa-solid fa-user"></i> المعلومات الشخصية</h4>
                                <div class="input-row">
                                    <div class="input-group">
                                        <label>الاسم الكامل</label>
                                        <input type="text" name="full_name" id="profileFullName" required>
                                    </div>
                                    <div class="input-group">
                                        <label>البريد الإلكتروني</label>
                                        <input type="email" name="email" id="profileEmailInput" readonly>
                                        <small class="text-muted">لا يمكن تعديل البريد الإلكتروني</small>
                                    </div>
                                </div>
                                
                                <div class="input-row">
                                    <div class="input-group">
                                        <label>رقم الهاتف</label>
                                        <input type="tel" name="phone" id="profilePhone">
                                    </div>
                                    <div class="input-group">
                                        <label>تاريخ الميلاد</label>
                                        <input type="date" name="birth_date" id="profileBirthDate">
                                    </div>
                                </div>
                                
                                <div class="input-group">
                                    <label>العنوان</label>
                                    <textarea name="address" id="profileAddress" rows="3" placeholder="العنوان الكامل"></textarea>
                                </div>
                            </div>
                            
                            <div class="profile-actions">
                                <button type="submit" class="auth-btn auth-primary">
                                    <i class="fa-solid fa-save"></i>
                                    حفظ التغييرات
                                </button>
                                <button type="button" class="auth-btn auth-secondary" onclick="authSystem.hideProfileModal()">
                                    <i class="fa-solid fa-times"></i>
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addProfileModalStyles();
    }

    setupModalEvents() {
        this.bindAuthEvents();
        this.bindProfileEvents();
    }

    bindAuthEvents() {
        const showRegister = document.getElementById('showRegister');
        const showLogin = document.getElementById('showLogin');
        
        if (showRegister) {
            showRegister.onclick = () => this.showRegisterForm();
        }
        
        if (showLogin) {
            showLogin.onclick = () => this.showLoginForm();
        }
        
        const authClose = document.getElementById('authClose');
        if (authClose) {
            authClose.onclick = () => this.hideAuthModal();
        }
        
        const loginForm = document.getElementById('loginFormElement');
        const registerForm = document.getElementById('registerFormElement');
        
        if (loginForm) {
            loginForm.onsubmit = (e) => {
                e.preventDefault();
                this.handleLogin(e);
            };
        }
        
        if (registerForm) {
            registerForm.onsubmit = (e) => {
                e.preventDefault();
                this.handleRegister(e);
            };
        }
        
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.onclick = (e) => {
                if (e.target.id === 'authModal') {
                    this.hideAuthModal();
                }
            };
        }
    }

    bindProfileEvents() {
        const profileClose = document.getElementById('profileClose');
        if (profileClose) {
            profileClose.onclick = () => this.hideProfileModal();
        }
        
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.onsubmit = (e) => {
                e.preventDefault();
                this.handleProfileUpdate(e);
            };
        }
        
        const profileModal = document.getElementById('profileModal');
        if (profileModal) {
            profileModal.onclick = (e) => {
                if (e.target.id === 'profileModal') {
                    this.hideProfileModal();
                }
            };
        }
    }

    showAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
            this.showLoginForm();
        }
    }

    hideAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    showProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            this.loadProfileData();
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
        }
    }

    hideProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    showLoginForm() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm && registerForm) {
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        }
    }

    showRegisterForm() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm && registerForm) {
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    }

    async handleLogin(e) {
        const formData = new FormData(e.target);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        
        console.log('📤 محاولة تسجيل الدخول:', data);
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري التسجيل...';
        submitBtn.disabled = true;
        
        try {
            let result;
            
            if (this.demoMode) {
                // الوضع المحلي - التحقق من البيانات محلياً
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // التحقق من وجود المستخدم في localStorage
                const users = JSON.parse(localStorage.getItem('demo_users') || '{}');
                const user = users[data.email];
                
                if (user && user.password === data.password) {
                    result = {
                        success: true,
                        message: 'تم تسجيل الدخول بنجاح (الوضع المحلي)',
                        user: {
                            id: user.id,
                            full_name: user.full_name,
                            email: user.email,
                            phone: user.phone,
                            birth_date: user.birth_date,
                            address: user.address,
                            created_at: user.created_at
                        }
                    };
                } else {
                    result = {
                        success: false,
                        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
                    };
                }
            } else {
                // الوضع العادي - الاتصال بالخادم
                const response = await fetch('auth.php?action=login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                console.log('📥 استجابة الخادم:', response);
                
                const responseText = await response.text();
                
                try {
                    result = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('❌ خطأ في تحويل JSON:', responseText);
                    throw new Error('استجابة غير صالحة من الخادم');
                }
            }
            
            console.log('📋 نتيجة التسجيل:', result);
            
            if (result.success) {
                localStorage.setItem('userData', JSON.stringify(result.user));
                this.showMessage('تم تسجيل الدخول بنجاح!', 'success');
                this.hideAuthModal();
                this.checkAuthStatus();
                
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                this.showMessage(result.message || 'فشل تسجيل الدخول', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تسجيل الدخول:', error);
            
            // في حالة الخطأ، ننتقل للوضع المحلي
            this.demoMode = true;
            this.showMessage('الخادم غير متاح، جاري استخدام الوضع المحلي', 'info');
            
            // إعادة المحاولة في الوضع المحلي
            setTimeout(() => {
                this.handleLogin(e);
            }, 1000);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleRegister(e) {
        const formData = new FormData(e.target);
        const data = {
            full_name: formData.get('full_name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirm_password: formData.get('confirm_password'),
            phone: formData.get('phone'),
            birth_date: formData.get('birth_date'),
            address: formData.get('address')
        };
        
        console.log('📤 محاولة التسجيل:', data);
        
        if (data.password !== data.confirm_password) {
            this.showMessage('كلمات المرور غير متطابقة', 'error');
            return;
        }
        
        if (data.password.length < 6) {
            this.showMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري إنشاء الحساب...';
        submitBtn.disabled = true;
        
        try {
            let result;
            
            if (this.demoMode) {
                // الوضع المحلي - حفظ البيانات في localStorage
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const users = JSON.parse(localStorage.getItem('demo_users') || '{}');
                
                // التحقق من عدم وجود البريد الإلكتروني مسبقاً
                if (users[data.email]) {
                    result = {
                        success: false,
                        message: 'البريد الإلكتروني مسجل مسبقاً'
                    };
                } else {
                    // إنشاء مستخدم جديد
                    const newUser = {
                        id: Date.now(), // استخدام timestamp كمعرف فريد
                        full_name: data.full_name,
                        email: data.email,
                        password: data.password, // في الواقع، يجب تشفير كلمة المرور
                        phone: data.phone,
                        birth_date: data.birth_date,
                        address: data.address,
                        created_at: new Date().toISOString()
                    };
                    
                    users[data.email] = newUser;
                    localStorage.setItem('demo_users', JSON.stringify(users));
                    
                    result = {
                        success: true,
                        message: 'تم إنشاء الحساب بنجاح (الوضع المحلي)'
                    };
                }
            } else {
                // الوضع العادي - الاتصال بالخادم
                const response = await fetch('auth.php?action=register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                console.log('📥 استجابة التسجيل:', response);
                
                const responseText = await response.text();
                
                try {
                    result = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('❌ خطأ في تحويل JSON:', responseText);
                    throw new Error('استجابة غير صالحة من الخادم');
                }
            }
            
            console.log('📋 نتيجة إنشاء الحساب:', result);
            
            if (result.success) {
                this.showMessage('تم إنشاء الحساب بنجاح!', 'success');
                this.showLoginForm();
                
                const emailInput = document.querySelector('#loginForm input[name="email"]');
                if (emailInput) {
                    emailInput.value = data.email;
                }
            } else {
                this.showMessage(result.message || 'فشل إنشاء الحساب', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في إنشاء الحساب:', error);
            
            // في حالة الخطأ، ننتقل للوضع المحلي
            this.demoMode = true;
            this.showMessage('الخادم غير متاح، جاري استخدام الوضع المحلي', 'info');
            
            // إعادة المحاولة في الوضع المحلي
            setTimeout(() => {
                this.handleRegister(e);
            }, 1000);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleProfileUpdate(e) {
        const formData = new FormData(e.target);
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        if (!userData || !userData.id) {
            this.showMessage('يجب تسجيل الدخول أولاً', 'error');
            return;
        }

        const data = {
            user_id: userData.id,
            full_name: formData.get('full_name'),
            phone: formData.get('phone'),
            birth_date: formData.get('birth_date'),
            address: formData.get('address')
        };
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الحفظ...';
        submitBtn.disabled = true;
        
        try {
            let result;
            
            if (this.demoMode) {
                // الوضع المحلي - تحديث البيانات في localStorage
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const users = JSON.parse(localStorage.getItem('demo_users') || '{}');
                const currentUser = users[userData.email];
                
                if (currentUser) {
                    // تحديث بيانات المستخدم
                    currentUser.full_name = data.full_name;
                    currentUser.phone = data.phone;
                    currentUser.birth_date = data.birth_date;
                    currentUser.address = data.address;
                    
                    users[userData.email] = currentUser;
                    localStorage.setItem('demo_users', JSON.stringify(users));
                    
                    result = {
                        success: true,
                        message: 'تم تحديث البيانات بنجاح (الوضع المحلي)',
                        user: currentUser
                    };
                } else {
                    result = {
                        success: false,
                        message: 'المستخدم غير موجود'
                    };
                }
            } else {
                // الوضع العادي - الاتصال بالخادم
                const response = await fetch('profile.php?action=update_profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                const responseText = await response.text();
                
                try {
                    result = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('❌ خطأ في تحويل JSON:', responseText);
                    throw new Error('استجابة غير صالحة من الخادم');
                }
            }
            
            console.log('📋 نتيجة تحديث الملف:', result);
            
            if (result.success) {
                this.showMessage('تم تحديث البيانات بنجاح!', 'success');
                
                if (result.user) {
                    localStorage.setItem('userData', JSON.stringify(result.user));
                    this.checkAuthStatus();
                }
                
                this.hideProfileModal();
            } else {
                this.showMessage(result.message || 'فشل تحديث البيانات', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الملف الشخصي:', error);
            
            // في حالة الخطأ، ننتقل للوضع المحلي
            this.demoMode = true;
            this.showMessage('الخادم غير متاح، جاري استخدام الوضع المحلي', 'info');
            
            // إعادة المحاولة في الوضع المحلي
            setTimeout(() => {
                this.handleProfileUpdate(e);
            }, 1000);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    loadProfileData() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        document.getElementById('profileName').textContent = userData.full_name || 'مستخدم';
        document.getElementById('profileEmail').textContent = userData.email || '';
        document.getElementById('profileFullName').value = userData.full_name || '';
        document.getElementById('profileEmailInput').value = userData.email || '';
        document.getElementById('profilePhone').value = userData.phone || '';
        document.getElementById('profileBirthDate').value = userData.birth_date || '';
        document.getElementById('profileAddress').value = userData.address || '';
    }

    handleLogout() {
        localStorage.removeItem('userData');
        this.showMessage('تم تسجيل الخروج بنجاح', 'success');
        this.checkAuthStatus();
        
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    isLoggedIn() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        return !!(userData && userData.id);
    }

    checkAuthStatus() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        if (this.isLoggedIn()) {
            console.log('✅ المستخدم مسجل الدخول:', userData);
            this.updateUserInterface();
        } else {
            console.log('❌ المستخدم غير مسجل الدخول');
        }
    }

    updateUserInterface() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        console.log('🔄 تحديث واجهة المستخدم:', userData);
        
        const userIcons = document.querySelectorAll('.fa-solid.fa-user, .user-icon');
        userIcons.forEach(icon => {
            const button = icon.closest('button') || icon;
            button.style.color = 'var(--primary-color)';
            button.title = `مرحباً ${userData.full_name || 'مستخدم'}`;
        });
    }

    showProfile() {
        this.showProfileModal();
    }

    showOrders() {
        this.showMessage('سيتم فتح صفحة الطلبات قريباً', 'info');
    }

    showMessage(message, type) {
        const existingMessages = document.querySelectorAll('.system-message');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.className = `system-message ${type}`;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 4000);
    }

    addAuthModalStyles() {
        if (document.querySelector('#auth-styles')) return;

        const styles = `
            .auth-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .auth-modal.active {
                opacity: 1;
            }
            
            .auth-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 450px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            
            .auth-modal.active .auth-content {
                transform: scale(1);
            }
            
            .auth-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .auth-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .demo-notice {
                background: var(--info-color);
                color: white;
                padding: 10px;
                border-radius: 8px;
                margin-bottom: 15px;
                text-align: center;
                font-size: 14px;
                font-weight: bold;
            }
            
            .auth-form {
                display: none;
            }
            
            .auth-form.active {
                display: block;
            }
            
            .auth-form h3 {
                text-align: center;
                margin-bottom: 25px;
                color: var(--primary-color);
                font-size: 24px;
                font-weight: bold;
            }
            
            .input-group {
                margin-bottom: 15px;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .password-hint {
                color: #666;
                display: block;
                margin-top: 5px;
                font-size: 12px;
            }
            
            .auth-btn {
                width: 100%;
                padding: 15px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: all 0.3s ease;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .auth-btn:hover:not(:disabled) {
                background: var(--secondary-color);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(162, 0, 135, 0.3);
            }
            
            .auth-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }
            
            .auth-switch {
                text-align: center;
                margin-top: 25px;
                color: var(--dark-color);
                font-size: 14px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
            }
            
            .switch-link {
                color: var(--primary-color);
                cursor: pointer;
                font-weight: bold;
                transition: color 0.3s ease;
            }
            
            .switch-link:hover {
                color: var(--secondary-color);
                text-decoration: underline;
            }

            .user-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                padding: 0;
                min-width: 280px;
                z-index: 1000;
                margin-top: 8px;
                border: 2px solid var(--primary-color);
                overflow: hidden;
                display: none;
            }
            
            .user-header {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                padding: 20px;
                color: white;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .user-avatar {
                font-size: 40px;
                opacity: 0.9;
            }
            
            .user-details {
                flex: 1;
            }
            
            .user-details strong {
                display: block;
                font-size: 16px;
                margin-bottom: 4px;
            }
            
            .user-details small {
                font-size: 12px;
                opacity: 0.8;
            }
            
            .menu-section {
                padding: 15px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .menu-items {
                padding: 0;
            }
            
            .user-menu-item {
                display: flex;
                align-items: center;
                padding: 12px 20px;
                color: #333;
                text-decoration: none;
                border: none;
                background: none;
                width: 100%;
                text-align: right;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
                gap: 12px;
                position: relative;
                border-bottom: 1px solid #f8f8f8;
            }
            
            .user-menu-item:last-child {
                border-bottom: none;
            }
            
            .user-menu-item i {
                width: 20px;
                text-align: center;
                color: var(--primary-color);
                font-size: 16px;
            }
            
            .user-menu-item:hover {
                background: var(--light-color);
                transform: translateX(-5px);
            }
            
            .user-menu-item:hover i {
                color: var(--secondary-color);
            }
            
            .logout-btn {
                color: var(--danger-color);
                font-weight: bold;
                margin-top: 0;
            }
            
            .logout-btn i {
                color: var(--danger-color);
            }
            
            .logout-btn:hover {
                background: #ffe6e6;
            }
            
            .menu-badge {
                background: var(--secondary-color);
                color: white;
                border-radius: 12px;
                padding: 2px 8px;
                font-size: 11px;
                font-weight: bold;
                margin-right: auto;
            }

            .system-message {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 15px 25px;
                border-radius: 8px;
                color: white;
                z-index: 10001;
                font-weight: bold;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                animation: slideDown 0.3s ease;
            }
            
            .system-message.success {
                background: var(--success-color);
            }
            
            .system-message.error {
                background: var(--danger-color);
            }
            
            .system-message.info {
                background: var(--info-color);
            }
            
            @keyframes slideDown {
                from {
                    transform: translateX(-50%) translateY(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'auth-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    addProfileModalStyles() {
        if (document.querySelector('#profile-styles')) return;

        const styles = `
            .profile-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .profile-modal.active {
                opacity: 1;
            }
            
            .profile-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 700px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            
            .profile-modal.active .profile-content {
                transform: scale(1);
            }
            
            .profile-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .profile-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .demo-notice {
                background: var(--info-color);
                color: white;
                padding: 10px;
                border-radius: 8px;
                margin-bottom: 15px;
                text-align: center;
                font-size: 14px;
                font-weight: bold;
            }
            
            .profile-header {
                display: flex;
                align-items: center;
                gap: 20px;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #f0f0f0;
            }
            
            .profile-avatar {
                font-size: 60px;
                color: var(--primary-color);
            }
            
            .profile-info h3 {
                margin: 0 0 5px 0;
                color: var(--primary-color);
            }
            
            .profile-info p {
                margin: 0 0 10px 0;
                color: #666;
            }
            
            .profile-body {
                margin-top: 20px;
            }
            
            .form-section {
                margin-bottom: 30px;
                padding: 20px;
                border: 1px solid #e0e0e0;
                border-radius: 10px;
                background: #fafafa;
            }
            
            .form-section h4 {
                margin: 0 0 20px 0;
                color: var(--primary-color);
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .input-row {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
            }
            
            .input-row .input-group {
                flex: 1;
            }
            
            .input-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #333;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .input-group input[readonly] {
                background-color: #f8f9fa;
                color: #666;
                cursor: not-allowed;
            }
            
            .text-muted {
                color: #666;
                font-size: 12px;
                display: block;
                margin-top: 5px;
            }
            
            .profile-actions {
                display: flex;
                gap: 15px;
                margin-top: 30px;
            }
            
            .profile-actions .auth-btn {
                flex: 1;
                margin-bottom: 0;
            }
            
            .auth-secondary {
                background: #6c757d !important;
            }
            
            .auth-secondary:hover {
                background: #5a6268 !important;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'profile-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// بدء النظام عند تحميل الصفحة
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        window.authSystem = new AuthSystem();
    });
}

// جعل النظام متاحاً globally للاستدعاء من الأزرار
if (typeof window !== 'undefined') {
    window.showAuthModal = () => window.authSystem?.showAuthModal();
    window.showProfile = () => window.authSystem?.showProfile();
    window.handleLogout = () => window.authSystem?.handleLogout();
}*/
























































































































/*
// نظام المصادقة والملف الشخصي والمتجر المتكامل
class AuthSystem {
    constructor() {
        this.demoMode = false;
        this.products = [
            {
                id: "1",
                name: "Rose Éclat",
                price: 199,
                image: "images/pert.jpg",
                description: "يتميز هذا العطر رائحته الفاخرة التي تفوح بعبير الورد الفرنسي تجمع نسماته بين نعومة الورود الباريسية ولمسات من المسك الأبيض والفانيليا الناعمة لتمنحك إحساسًا بالدفء والرقي يدوم طوال اليوم"
            },
            {
                id: "2", 
                name: "Violet Lavender",
                price: 199,
                image: "images/uuuuu.jpg",
                description: "هذا العطر يتميز بنفحات من زهرة البنفسج واللافندر، مما يخلق توليفة زهرية ناعمة وأنيقة"
            },
            {
                id: "3",
                name: "Larmes de Rose", 
                price: 199,
                image: "images/Gold.jpg",
                description: "عطر أنثوي راقٍ تنبعث منه نفحات ناعمة من زهرة الماغنوليا واللوتس، ممزوجة بعبير الورد التركي، وتغلفه لمسة دافئة من المسك الأبيض وخشب الكشمير. يجسّد لحظاتك الحالمة بأناقة لا تُنسى"
            },
            {
                id: "4",
                name: "Lumière Blanche",
                price: 199, 
                image: "images/www.jpg",
                description: "عطر يشبه لحظة صباحية ناعمة، حين يلامس الضوء بشرتك برقة وهدوء. يفتتح بنفحات منعشة من الكمثرى واللافندر، ثم يتعمق في قلب زهري أنيق من السوسن والورد البلغاري. تستقر رائحته على قاعدة دافئة من المسك الابيض وخشب الصندل، تترك أثرًا ناعمًا يدوم."
            },
            {
                id: "5",
                name: "Or Lumi",
                price: 199,
                image: "images/yallow.jpg", 
                description: "عطر يفتتح بنفحات من اليوسفي واللافندر، منعشة ومحايدة يتوسطه قلب خشبي زهري من السوسن وخشب الأرز، يعكس التوازن بين القوة والرقة تستقر رائحته على قاعدة دافئة من العنبر والمسك، تترك أثرًا ناعمًا يدوم"
            },
            {
                id: "6",
                name: "Azure Drift",
                price: 199,
                image: "images/Blue Perfume.jpg",
                description: "هذا العطر ينبض بالحيوية من البرغموت الإيطالي والنعناع الأزرق، ليمنح إحساسًا منعشًا ومتوازنًا يتناغم قلبه بنقاء زهرة اللوتس وخشب الأرز الأبيض، في انسجام بين الصفاء والدفء تتعمق رائحته بقاعدة من المسك النقي والعنبر الرمادي، تترك أثرًا هادئًا يدوم"
            }
        ];
        this.cart = [];
        this.currentDiscount = null;
        this.init();
    }

    init() {
        console.log('🚀 بدء نظام المصادقة والمتجر...');
        this.setCustomColors();
        this.createAuthModal();
        this.createProfileModal();
        this.createCartElements();
        this.createCheckoutPage();
        this.setupUserIconListener();
        this.setupModalEvents();
        this.checkAuthStatus();
        this.checkServerStatus();
        this.loadProductsToPage();
        this.setupStoreStyles();
    }

    async checkServerStatus() {
        try {
            const response = await fetch('auth.php?action=test', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            const result = await response.json();
            this.demoMode = !result.success;
            
            if (this.demoMode) {
                console.log('🔧 الخادم غير متاح، النظام يعمل في الوضع المحلي');
            } else {
                console.log('✅ الخادم متاح ويعمل');
            }
        } catch (error) {
            console.log('🔧 الخادم غير متاح، النظام يعمل في الوضع المحلي');
            this.demoMode = true;
        }
    }

    setCustomColors() {
        const styles = `
            :root {
                --primary-color: #ea70b1;
                --secondary-color: #a20087;
                --light-color: #f8f9fa;
                --dark-color: #343a40;
                --success-color: #28a745;
                --danger-color: #dc3545;
                --warning-color: #ffc107;
                --info-color: #17a2b8;
            }
            
            .auth-primary { background-color: var(--primary-color) !important; }
            .auth-secondary { background-color: var(--secondary-color) !important; }
            .auth-success { background-color: var(--success-color) !important; }
            .auth-info { background-color: var(--info-color) !important; }
            
            .auth-primary:hover { background-color: var(--secondary-color) !important; }
            .auth-success:hover { background-color: #218838 !important; }
            .auth-info:hover { background-color: #138496 !important; }
            
            .text-primary { color: var(--primary-color) !important; }
            .text-secondary { color: var(--secondary-color) !important; }
            .text-success { color: var(--success-color) !important; }
            .text-danger { color: var(--danger-color) !important; }
            .text-info { color: var(--info-color) !important; }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupUserIconListener() {
        const userIcons = document.querySelectorAll('.fa-solid.fa-user, .user-icon');
        
        if (userIcons.length > 0) {
            userIcons.forEach(icon => {
                const button = icon.closest('button') || icon;
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('✅ تم النقر على أيقونة المستخدم');
                    this.handleUserClick(button);
                });
            });
        } else {
            console.error('❌ لم يتم العثور على أيقونة المستخدم!');
            this.createUserIcon();
        }
    }

    createUserIcon() {
        const userIcon = document.createElement('button');
        userIcon.className = 'user-icon';
        userIcon.innerHTML = '<i class="fa-solid fa-user"></i>';
        userIcon.style.cssText = `
            background: #f0f0f0;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            margin-left: 10px;
        `;
        
        const header = document.querySelector('.header') || document.body;
        header.appendChild(userIcon);
        
        userIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleUserClick(userIcon);
        });
    }

    handleUserClick(element) {
        if (this.isLoggedIn()) {
            this.showUserMenu(element);
        } else {
            this.showAuthModal();
        }
    }

    showUserMenu(icon) {
        const oldMenu = document.querySelector('.user-menu');
        if (oldMenu) oldMenu.remove();
        
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        const menuHTML = `
            <div class="user-menu">
                <div class="user-header">
                    <div class="user-avatar">
                        <i class="fa-solid fa-user-circle"></i>
                    </div>
                    <div class="user-details">
                        <strong>${userData.full_name || userData.name || 'مستخدم'}</strong>
                        <small>${userData.email || ''}</small>
                        ${this.demoMode ? '<small style="color: var(--warning-color); margin-top: 5px; display: block;"><i class="fa-solid fa-computer"></i> الوضع المحلي</small>' : ''}
                    </div>
                </div>
                
                <div class="menu-section">
                    <div class="menu-items">
                        <button class="user-menu-item" onclick="authSystem.showProfile()">
                            <i class="fa-solid fa-user"></i>
                            حسابي
                        </button>
                        <button class="user-menu-item" onclick="authSystem.showOrders()">
                            <i class="fa-solid fa-box"></i>
                            الطلبات
                            <span class="menu-badge" id="ordersCount">0</span>
                        </button>
                        <button class="user-menu-item" onclick="authSystem.showLoyaltyPoints()">
                            <i class="fa-solid fa-star"></i>
                            نقاط المكافآت
                            <span class="menu-badge">${userData.loyalty_points || 0}</span>
                        </button>
                    </div>
                </div>
                
                <div class="menu-items">
                    <button class="user-menu-item logout-btn" onclick="authSystem.handleLogout()">
                        <i class="fa-solid fa-right-from-bracket"></i>
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        `;
        
        const iconContainer = icon.closest('button') || icon;
        const container = iconContainer.parentNode;
        container.style.position = 'relative';
        container.insertAdjacentHTML('beforeend', menuHTML);
        
        const menu = container.querySelector('.user-menu');
        
        this.updateMenuCounts();
        
        setTimeout(() => {
            menu.style.display = 'block';
        }, 10);
        
        const closeMenu = (e) => {
            if (menu && !menu.contains(e.target) && !icon.contains(e.target)) {
                menu.style.display = 'none';
                document.removeEventListener('click', closeMenu);
                setTimeout(() => {
                    if (menu.parentNode) {
                        menu.remove();
                    }
                }, 300);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 10);
    }

    async updateMenuCounts() {
        if (!this.isLoggedIn()) return;

        try {
            if (this.demoMode) {
                // في الوضع المحلي، استخدام البيانات المحلية
                const orders = JSON.parse(localStorage.getItem('user_orders') || '[]');
                const ordersCount = document.getElementById('ordersCount');
                if (ordersCount) {
                    ordersCount.textContent = orders.length;
                }
                return;
            }

            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            
            const response = await fetch('auth.php?action=get_user_stats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userData.id })
            });
            
            if (!response.ok) {
                throw new Error(`خطأ في الشبكة: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                const ordersCount = document.getElementById('ordersCount');
                if (ordersCount) {
                    ordersCount.textContent = result.data.orders_count || 0;
                }
                
                // تحديث نقاط المكافآت في القائمة
                const loyaltyBadge = document.querySelector('.user-menu-item:nth-child(3) .menu-badge');
                if (loyaltyBadge) {
                    loyaltyBadge.textContent = result.data.loyalty_points || 0;
                }
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الإحصائيات:', error);
        }
    }

    createAuthModal() {
        if (document.getElementById('authModal')) return;

        const modalHTML = `
            <div class="auth-modal" id="authModal">
                <div class="auth-content">
                    <button class="auth-close" id="authClose">×</button>
                    ${this.demoMode ? '<div class="demo-notice"><i class="fa-solid fa-computer"></i> النظام يعمل في الوضع المحلي - البيانات سيتم حفظها في المتصفح</div>' : ''}
                    
                    <div class="auth-form active" id="loginForm">
                        <h3 class="text-primary">تسجيل الدخول</h3>
                        <form id="loginFormElement">
                            <div class="input-group">
                                <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                            </div>
                            <div class="input-group">
                                <input type="password" name="password" placeholder="كلمة المرور" required>
                            </div>
                            <button type="submit" class="auth-btn auth-primary">
                                <i class="fa-solid fa-right-to-bracket"></i>
                                تسجيل الدخول
                            </button>
                        </form>
                        <div class="auth-switch">
                            ليس لديك حساب؟ 
                            <span class="switch-link text-primary" id="showRegister">إنشاء حساب جديد</span>
                        </div>
                    </div>
                    
                    <div class="auth-form" id="registerForm">
                        <h3 class="text-primary">إنشاء حساب جديد</h3>
                        <form id="registerFormElement">
                            <div class="input-group">
                                <input type="text" name="full_name" placeholder="الاسم الكامل" required>
                            </div>
                            <div class="input-group">
                                <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                            </div>
                            <div class="input-group">
                                <input type="password" name="password" placeholder="كلمة المرور" required>
                                <small class="password-hint">كلمة المرور يجب أن تكون 6 أحرف على الأقل</small>
                            </div>
                            <div class="input-group">
                                <input type="password" name="confirm_password" placeholder="تأكيد كلمة المرور" required>
                            </div>
                            <div class="input-group">
                                <input type="tel" name="phone" placeholder="رقم الهاتف (اختياري)">
                            </div>
                            <div class="input-group">
                                <input type="date" name="birth_date" placeholder="تاريخ الميلاد">
                            </div>
                            <div class="input-group">
                                <textarea name="address" placeholder="العنوان" rows="3"></textarea>
                            </div>
                            <button type="submit" class="auth-btn auth-primary">
                                <i class="fa-solid fa-user-plus"></i>
                                إنشاء حساب
                            </button>
                        </form>
                        <div class="auth-switch">
                            لديك حساب بالفعل؟ 
                            <span class="switch-link text-primary" id="showLogin">تسجيل الدخول</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addAuthModalStyles();
    }

    createProfileModal() {
        if (document.getElementById('profileModal')) return;

        const modalHTML = `
            <div class="profile-modal" id="profileModal">
                <div class="profile-content">
                    <button class="profile-close" id="profileClose">×</button>
                    ${this.demoMode ? '<div class="demo-notice"><i class="fa-solid fa-computer"></i> النظام يعمل في الوضع المحلي - البيانات محفوظة في المتصفح</div>' : ''}
                    
                    <div class="profile-header">
                        <div class="profile-avatar">
                            <i class="fa-solid fa-user-circle"></i>
                        </div>
                        <div class="profile-info">
                            <h3 class="text-primary" id="profileName">الاسم الكامل</h3>
                            <p id="profileEmail">البريد الإلكتروني</p>
                            <div class="user-stats">
                                <span class="stat-item">
                                    <i class="fa-solid fa-box"></i>
                                    <span id="profileOrders">0 طلبات</span>
                                </span>
                                <span class="stat-item">
                                    <i class="fa-solid fa-star"></i>
                                    <span id="profilePoints">0 نقطة</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="profile-body">
                        <form id="profileForm">
                            <div class="form-section">
                                <h4><i class="fa-solid fa-user"></i> المعلومات الشخصية</h4>
                                <div class="input-row">
                                    <div class="input-group">
                                        <label>الاسم الكامل</label>
                                        <input type="text" name="full_name" id="profileFullName" required>
                                    </div>
                                    <div class="input-group">
                                        <label>البريد الإلكتروني</label>
                                        <input type="email" name="email" id="profileEmailInput" readonly>
                                        <small class="text-muted">لا يمكن تعديل البريد الإلكتروني</small>
                                    </div>
                                </div>
                                
                                <div class="input-row">
                                    <div class="input-group">
                                        <label>رقم الهاتف</label>
                                        <input type="tel" name="phone" id="profilePhone">
                                    </div>
                                    <div class="input-group">
                                        <label>تاريخ الميلاد</label>
                                        <input type="date" name="birth_date" id="profileBirthDate">
                                    </div>
                                </div>
                                
                                <div class="input-group">
                                    <label>العنوان</label>
                                    <textarea name="address" id="profileAddress" rows="3" placeholder="العنوان الكامل"></textarea>
                                </div>
                            </div>
                            
                            <div class="profile-actions">
                                <button type="submit" class="auth-btn auth-primary">
                                    <i class="fa-solid fa-save"></i>
                                    حفظ التغييرات
                                </button>
                                <button type="button" class="auth-btn auth-secondary" onclick="authSystem.hideProfileModal()">
                                    <i class="fa-solid fa-times"></i>
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addProfileModalStyles();
    }

    setupModalEvents() {
        this.bindAuthEvents();
        this.bindProfileEvents();
    }

    bindAuthEvents() {
        const showRegister = document.getElementById('showRegister');
        const showLogin = document.getElementById('showLogin');
        
        if (showRegister) {
            showRegister.onclick = () => this.showRegisterForm();
        }
        
        if (showLogin) {
            showLogin.onclick = () => this.showLoginForm();
        }
        
        const authClose = document.getElementById('authClose');
        if (authClose) {
            authClose.onclick = () => this.hideAuthModal();
        }
        
        const loginForm = document.getElementById('loginFormElement');
        const registerForm = document.getElementById('registerFormElement');
        
        if (loginForm) {
            loginForm.onsubmit = (e) => {
                e.preventDefault();
                this.handleLogin(e);
            };
        }
        
        if (registerForm) {
            registerForm.onsubmit = (e) => {
                e.preventDefault();
                this.handleRegister(e);
            };
        }
        
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.onclick = (e) => {
                if (e.target.id === 'authModal') {
                    this.hideAuthModal();
                }
            };
        }
    }

    bindProfileEvents() {
        const profileClose = document.getElementById('profileClose');
        if (profileClose) {
            profileClose.onclick = () => this.hideProfileModal();
        }
        
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.onsubmit = (e) => {
                e.preventDefault();
                this.handleProfileUpdate(e);
            };
        }
        
        const profileModal = document.getElementById('profileModal');
        if (profileModal) {
            profileModal.onclick = (e) => {
                if (e.target.id === 'profileModal') {
                    this.hideProfileModal();
                }
            };
        }
    }

    showAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
            this.showLoginForm();
        }
    }

    hideAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    showProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            this.loadProfileData();
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
        }
    }

    hideProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    showLoginForm() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm && registerForm) {
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        }
    }

    showRegisterForm() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm && registerForm) {
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    }

    async handleLogin(e) {
        const formData = new FormData(e.target);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        
        console.log('📤 محاولة تسجيل الدخول:', data);
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري التسجيل...';
        submitBtn.disabled = true;
        
        try {
            let result;
            
            if (this.demoMode) {
                // الوضع المحلي - التحقق من البيانات محلياً
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const users = JSON.parse(localStorage.getItem('demo_users') || '{}');
                const user = users[data.email];
                
                if (user && user.password === data.password) {
                    result = {
                        success: true,
                        message: 'تم تسجيل الدخول بنجاح (الوضع المحلي)',
                        user: {
                            id: user.id,
                            full_name: user.full_name,
                            email: user.email,
                            phone: user.phone,
                            birth_date: user.birth_date,
                            address: user.address,
                            loyalty_points: user.loyalty_points || 0,
                            total_orders: user.total_orders || 0,
                            total_spent: user.total_spent || 0,
                            created_at: user.created_at
                        }
                    };
                } else {
                    result = {
                        success: false,
                        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
                    };
                }
            } else {
                // الوضع العادي - الاتصال بالخادم
                const response = await fetch('auth.php?action=login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                console.log('📥 استجابة الخادم:', response);
                
                const responseText = await response.text();
                
                try {
                    result = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('❌ خطأ في تحويل JSON:', responseText);
                    throw new Error('استجابة غير صالحة من الخادم');
                }
            }
            
            console.log('📋 نتيجة التسجيل:', result);
            
            if (result.success) {
                localStorage.setItem('userData', JSON.stringify(result.user));
                this.showMessage('تم تسجيل الدخول بنجاح!', 'success');
                this.hideAuthModal();
                this.checkAuthStatus();
                
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                this.showMessage(result.message || 'فشل تسجيل الدخول', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تسجيل الدخول:', error);
            
            this.demoMode = true;
            this.showMessage('الخادم غير متاح، جاري استخدام الوضع المحلي', 'info');
            
            setTimeout(() => {
                this.handleLogin(e);
            }, 1000);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleRegister(e) {
        const formData = new FormData(e.target);
        const data = {
            full_name: formData.get('full_name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirm_password: formData.get('confirm_password'),
            phone: formData.get('phone'),
            birth_date: formData.get('birth_date'),
            address: formData.get('address')
        };
        
        console.log('📤 محاولة التسجيل:', data);
        
        if (data.password !== data.confirm_password) {
            this.showMessage('كلمات المرور غير متطابقة', 'error');
            return;
        }
        
        if (data.password.length < 6) {
            this.showMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري إنشاء الحساب...';
        submitBtn.disabled = true;
        
        try {
            let result;
            
            if (this.demoMode) {
                // الوضع المحلي - حفظ البيانات في localStorage
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const users = JSON.parse(localStorage.getItem('demo_users') || '{}');
                
                if (users[data.email]) {
                    result = {
                        success: false,
                        message: 'البريد الإلكتروني مسجل مسبقاً'
                    };
                } else {
                    const newUser = {
                        id: Date.now(),
                        full_name: data.full_name,
                        email: data.email,
                        password: data.password,
                        phone: data.phone,
                        birth_date: data.birth_date,
                        address: data.address,
                        loyalty_points: 0,
                        total_orders: 0,
                        total_spent: 0,
                        created_at: new Date().toISOString()
                    };
                    
                    users[data.email] = newUser;
                    localStorage.setItem('demo_users', JSON.stringify(users));
                    
                    result = {
                        success: true,
                        message: 'تم إنشاء الحساب بنجاح (الوضع المحلي)'
                    };
                }
            } else {
                // الوضع العادي - الاتصال بالخادم
                const response = await fetch('auth.php?action=register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                console.log('📥 استجابة التسجيل:', response);
                
                const responseText = await response.text();
                
                try {
                    result = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('❌ خطأ في تحويل JSON:', responseText);
                    throw new Error('استجابة غير صالحة من الخادم');
                }
            }
            
            console.log('📋 نتيجة إنشاء الحساب:', result);
            
            if (result.success) {
                this.showMessage('تم إنشاء الحساب بنجاح!', 'success');
                this.showLoginForm();
                
                const emailInput = document.querySelector('#loginForm input[name="email"]');
                if (emailInput) {
                    emailInput.value = data.email;
                }
            } else {
                this.showMessage(result.message || 'فشل إنشاء الحساب', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في إنشاء الحساب:', error);
            
            this.demoMode = true;
            this.showMessage('الخادم غير متاح، جاري استخدام الوضع المحلي', 'info');
            
            setTimeout(() => {
                this.handleRegister(e);
            }, 1000);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleProfileUpdate(e) {
        const formData = new FormData(e.target);
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        if (!userData || !userData.id) {
            this.showMessage('يجب تسجيل الدخول أولاً', 'error');
            return;
        }

        const data = {
            user_id: userData.id,
            full_name: formData.get('full_name'),
            phone: formData.get('phone'),
            birth_date: formData.get('birth_date'),
            address: formData.get('address')
        };
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الحفظ...';
        submitBtn.disabled = true;
        
        try {
            let result;
            
            if (this.demoMode) {
                // الوضع المحلي - تحديث البيانات في localStorage
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const users = JSON.parse(localStorage.getItem('demo_users') || '{}');
                const currentUser = users[userData.email];
                
                if (currentUser) {
                    currentUser.full_name = data.full_name;
                    currentUser.phone = data.phone;
                    currentUser.birth_date = data.birth_date;
                    currentUser.address = data.address;
                    
                    users[userData.email] = currentUser;
                    localStorage.setItem('demo_users', JSON.stringify(users));
                    
                    result = {
                        success: true,
                        message: 'تم تحديث البيانات بنجاح (الوضع المحلي)',
                        user: currentUser
                    };
                } else {
                    result = {
                        success: false,
                        message: 'المستخدم غير موجود'
                    };
                }
            } else {
                // الوضع العادي - الاتصال بالخادم
                const response = await fetch('auth.php?action=update_profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                const responseText = await response.text();
                
                try {
                    result = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('❌ خطأ في تحويل JSON:', responseText);
                    throw new Error('استجابة غير صالحة من الخادم');
                }
            }
            
            console.log('📋 نتيجة تحديث الملف:', result);
            
            if (result.success) {
                this.showMessage('تم تحديث البيانات بنجاح!', 'success');
                
                if (result.user) {
                    localStorage.setItem('userData', JSON.stringify(result.user));
                    this.checkAuthStatus();
                }
                
                this.hideProfileModal();
            } else {
                this.showMessage(result.message || 'فشل تحديث البيانات', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الملف الشخصي:', error);
            
            this.demoMode = true;
            this.showMessage('الخادم غير متاح، جاري استخدام الوضع المحلي', 'info');
            
            setTimeout(() => {
                this.handleProfileUpdate(e);
            }, 1000);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    loadProfileData() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        document.getElementById('profileName').textContent = userData.full_name || 'مستخدم';
        document.getElementById('profileEmail').textContent = userData.email || '';
        document.getElementById('profileFullName').value = userData.full_name || '';
        document.getElementById('profileEmailInput').value = userData.email || '';
        document.getElementById('profilePhone').value = userData.phone || '';
        document.getElementById('profileBirthDate').value = userData.birth_date || '';
        document.getElementById('profileAddress').value = userData.address || '';
        
        // تحديث الإحصائيات
        document.getElementById('profileOrders').textContent = `${userData.total_orders || 0} طلبات`;
        document.getElementById('profilePoints').textContent = `${userData.loyalty_points || 0} نقطة`;
    }

    handleLogout() {
        localStorage.removeItem('userData');
        this.showMessage('تم تسجيل الخروج بنجاح', 'success');
        this.checkAuthStatus();
        
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    isLoggedIn() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        return !!(userData && userData.id);
    }

    checkAuthStatus() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        if (this.isLoggedIn()) {
            console.log('✅ المستخدم مسجل الدخول:', userData);
            this.updateUserInterface();
        } else {
            console.log('❌ المستخدم غير مسجل الدخول');
        }
    }

    updateUserInterface() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        console.log('🔄 تحديث واجهة المستخدم:', userData);
        
        const userIcons = document.querySelectorAll('.fa-solid.fa-user, .user-icon');
        userIcons.forEach(icon => {
            const button = icon.closest('button') || icon;
            button.style.color = 'var(--primary-color)';
            button.title = `مرحباً ${userData.full_name || 'مستخدم'}`;
        });
    }

    showProfile() {
        this.showProfileModal();
    }

    async showOrders() {
        if (!this.isLoggedIn()) {
            this.showAuthModal();
            return;
        }

        try {
            let orders = [];
            
            if (this.demoMode) {
                // في الوضع المحلي، استخدام البيانات المحلية
                orders = JSON.parse(localStorage.getItem('user_orders') || '[]');
            } else {
                // الاتصال بالخادم للحصول على الطلبات
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                const response = await fetch(`auth.php?action=get_orders&user_id=${userData.id}`);
                const result = await response.json();
                
                if (result.success) {
                    orders = result.orders || [];
                }
            }
            
            this.showOrdersModal(orders);
        } catch (error) {
            console.error('❌ خطأ في جلب الطلبات:', error);
            this.showMessage('فشل في تحميل الطلبات', 'error');
        }
    }

    showOrdersModal(orders) {
        const modalHTML = `
            <div class="orders-modal" id="ordersModal">
                <div class="orders-content">
                    <button class="orders-close" id="ordersClose">×</button>
                    <h3 class="text-primary">📦 طلباتي</h3>
                    
                    <div class="orders-list" id="ordersList">
                        ${orders.length === 0 ? 
                            '<div class="empty-orders"><i class="fa-solid fa-box-open"></i><p>لا توجد طلبات بعد</p></div>' : 
                            orders.map(order => `
                                <div class="order-item">
                                    <div class="order-header">
                                        <span class="order-number">#${order.order_number}</span>
                                        <span class="order-status ${order.order_status}">${this.getOrderStatusText(order.order_status)}</span>
                                    </div>
                                    <div class="order-details">
                                        <div class="order-date">${new Date(order.created_at).toLocaleDateString('ar-SA')}</div>
                                        <div class="order-total">${order.total_amount} SAR</div>
                                    </div>
                                    <div class="order-items-count">${order.items_count || 0} منتج</div>
                                </div>
                            `).join('')
                        }
                    </div>
                </div>
            </div>
        `;
        
        // إزالة أي modal موجود مسبقاً
        const existingModal = document.getElementById('ordersModal');
        if (existingModal) existingModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addOrdersModalStyles();
        
        const modal = document.getElementById('ordersModal');
        const closeBtn = document.getElementById('ordersClose');
        
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
        
        closeBtn.onclick = () => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        };
        
        modal.onclick = (e) => {
            if (e.target.id === 'ordersModal') {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.remove();
                }, 300);
            }
        };
    }

    showLoyaltyPoints() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const points = userData.loyalty_points || 0;
        
        this.showMessage(`لديك ${points} نقطة مكافأة 🎁`, 'info');
    }

    getOrderStatusText(status) {
        const statusMap = {
            'pending': 'قيد الانتظار',
            'confirmed': 'تم التأكيد',
            'processing': 'قيد المعالجة',
            'shipped': 'تم الشحن',
            'delivered': 'تم التسليم',
            'cancelled': 'ملغي'
        };
        return statusMap[status] || status;
    }

    showMessage(message, type) {
        const existingMessages = document.querySelectorAll('.system-message');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.className = `system-message ${type}`;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 4000);
    }

    // نظام المتجر
    setupStoreStyles() {
        if (document.getElementById('store-styles')) return;
        
        const styles = `
            .cart-sidebar {
                position: fixed;
                top: 0;
                right: -400px;
                width: 350px;
                height: 100vh;
                background-color: white;
                box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
                transition: right 0.3s ease;
                z-index: 1050;
                padding: 20px;
                overflow-y: auto;
            }
            
            .cart-sidebar.active {
                right: 0;
            }
            
            .cart-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 1040;
                display: none;
            }
            
            .cart-overlay.active {
                display: block;
            }
            
            .product-card {
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                border: none;
                border-radius: 15px;
                overflow: hidden;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            
            .product-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            }
            
            .product-image {
                height: 250px;
                object-fit: cover;
                transition: transform 0.3s ease;
            }
            
            .product-card:hover .product-image {
                transform: scale(1.05);
            }
            
            .buy-button {
                background: linear-gradient(135deg, #a20087, #ea70b1);
                border: none;
                border-radius: 25px;
                padding: 12px 30px;
                color: white;
                font-weight: bold;
                transition: all 0.3s ease;
                cursor: pointer;
                width: 100%;
            }
            
            .buy-button:hover {
                transform: scale(1.05);
                box-shadow: 0 5px 15px rgba(162, 0, 135, 0.4);
            }
            
            .store-notification {
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 9999;
                min-width: 300px;
                background: linear-gradient(135deg, #ea70b1, #a20087);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                border: none;
                font-weight: bold;
            }
            
            .store-notification.error {
                background: linear-gradient(135deg, #dc3545, #c82333);
            }
            
            .store-notification.info {
                background: linear-gradient(135deg, #17a2b8, #138496);
            }
            
            .cart-item {
                display: flex;
                align-items: center;
                padding: 15px 0;
                border-bottom: 1px solid #eee;
            }
            
            .cart-item-image {
                width: 70px;
                height: 70px;
                object-fit: cover;
                border-radius: 8px;
                margin-left: 15px;
            }
            
            .cart-item-details {
                flex: 1;
            }
            
            .cart-item-title {
                font-weight: bold;
                margin-bottom: 5px;
                font-size: 14px;
            }
            
            .cart-item-price {
                color: #a20087;
                font-weight: bold;
            }
            
            .quantity-controls {
                display: flex;
                align-items: center;
                margin-top: 8px;
            }
            
            .quantity-btn {
                width: 30px;
                height: 30px;
                border: 1px solid #ddd;
                background-color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }
            
            .quantity-input {
                width: 40px;
                height: 30px;
                text-align: center;
                border: 1px solid #ddd;
                border-left: none;
                border-right: none;
            }
            
            .remove-item {
                color: #dc3545;
                background: none;
                border: none;
                font-size: 18px;
                margin-right: 10px;
                cursor: pointer;
            }
            
            .cart-total {
                padding: 20px 0;
                border-top: 2px solid #eee;
                margin-top: 20px;
            }
            
            .checkout-btn {
                background-color: #a20087;
                color: white;
                border: none;
                border-radius: 25px;
                padding: 12px;
                width: 100%;
                font-weight: bold;
                transition: all 0.3s;
                cursor: pointer;
            }
            
            .checkout-btn:hover {
                background-color: #ea70b1;
            }
            
            .empty-cart {
                text-align: center;
                padding: 40px 0;
                color: #666;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'store-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    createCartElements() {
        if (document.getElementById('cart-sidebar')) return;
        
        this.cartOverlay = document.createElement('div');
        this.cartOverlay.id = 'cart-overlay';
        this.cartOverlay.className = 'cart-overlay';
        document.body.appendChild(this.cartOverlay);
        
        this.cartSidebar = document.createElement('div');
        this.cartSidebar.id = 'cart-sidebar';
        this.cartSidebar.className = 'cart-sidebar';
        this.cartSidebar.innerHTML = this.getCartHTML();
        document.body.appendChild(this.cartSidebar);
        
        this.setupCartEvents();
    }

    getCartHTML() {
        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4>🛒 سلة التسوق</h4>
                <button class="icon-btn text-dark" id="close-cart">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div id="cart-items">
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart fa-3x mb-3 text-muted"></i>
                    <p>سلة التسوق فارغة</p>
                </div>
            </div>
            <div class="cart-total" id="cart-total" style="display: none;">
                <div class="d-flex justify-content-between mb-2">
                    <span>المجموع:</span>
                    <span id="subtotal">0 SAR</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                    <span>الضريبة (15%):</span>
                    <span id="tax">0 SAR</span>
                </div>
                <div class="d-flex justify-content-between mb-3">
                    <span>الشحن:</span>
                    <span id="shipping">0 SAR</span>
                </div>
                <div class="d-flex justify-content-between fw-bold fs-5">
                    <span>الإجمالي:</span>
                    <span id="total">0 SAR</span>
                </div>
                <button class="checkout-btn mt-4" id="checkout-btn">🚀 اتمام الشراء</button>
            </div>
        `;
    }

    setupCartEvents() {
        const closeCart = document.getElementById('close-cart');
        const checkoutBtn = document.getElementById('checkout-btn');
        
        if (closeCart) {
            closeCart.addEventListener('click', () => this.closeCart());
        }
        
        if (this.cartOverlay) {
            this.cartOverlay.addEventListener('click', () => this.closeCart());
        }
        
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.goToCheckout());
        }
    }

    loadProductsToPage() {
        const productsContainer = document.querySelector('.products-container') || document.querySelector('main .container .row') || document.querySelector('main .row') || document.querySelector('.row');
        
        if (!productsContainer) {
            console.warn('⚠️ لم يتم العثور على حاوية المنتجات');
            return;
        }
        
        this.products.forEach(product => {
            const productHTML = `
                <div class="col-md-4 col-lg-4 mb-4">
                    <div class="card product-card h-100">
                        <img src="${product.image}" class="card-img-top product-image" alt="${product.name}" 
                             onerror="this.src='https://via.placeholder.com/300x300/cccccc/969696?text=صورة+المنتج'">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text flex-grow-1">${product.description}</p>
                            <div class="mt-auto">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="h5 text-primary mb-0">${product.price} SAR</span>
                                    <button class="btn btn-primary buy-button" 
                                            data-id="${product.id}"
                                            data-name="${product.name}"
                                            data-price="${product.price}"
                                            data-image="${product.image}">
                                        <i class="fas fa-shopping-cart"></i> إضافة إلى السلة
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            productsContainer.innerHTML += productHTML;
        });
        
        // إضافة مستمعي الأحداث لأزرار الشراء
        document.addEventListener('click', (e) => {
            const buyButton = e.target.closest('.buy-button');
            if (buyButton) {
                e.preventDefault();
                e.stopPropagation();
                this.handleBuyButtonClick(buyButton);
            }
        });
    }

    handleBuyButtonClick(button) {
        const productId = button.getAttribute('data-id');
        const productName = button.getAttribute('data-name');
        const productPrice = button.getAttribute('data-price');
        const productImage = button.getAttribute('data-image');
        
        console.log('🛒 النقر على زر الشراء:', productName);
        
        if (productId && productName && productPrice) {
            const cartProduct = {
                id: productId,
                name: productName,
                price: parseFloat(productPrice),
                image: productImage,
                quantity: 1
            };
            this.addToCart(cartProduct);
        }
    }

    addToCart(product) {
        console.log('➕ إضافة منتج إلى السلة:', product.name);
        
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push(product);
        }
        
        this.updateCart();
        this.showStoreNotification(`تم إضافة ${product.name} إلى السلة 🎉`);
    }

    updateCart() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const cartCount = document.getElementById('cart-count');
        
        if (!cartItems) return;
        
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
        
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
        
        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart fa-3x mb-3 text-muted"></i>
                    <p>سلة التسوق فارغة</p>
                </div>
            `;
            if (cartTotal) cartTotal.style.display = 'none';
        } else {
            cartItems.innerHTML = '';
            this.cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                
                const imageSrc = item.image && item.image.startsWith('images/') ? 
                    item.image : 
                    `https://via.placeholder.com/70x70/cccccc/969696?text=${encodeURIComponent(item.name)}`;
                
                cartItems.innerHTML += `
                    <div class="cart-item">
                        <img src="${imageSrc}" alt="${item.name}" class="cart-item-image"
                             onerror="this.src='https://via.placeholder.com/70x70/cccccc/969696?text=صورة'">
                        <div class="cart-item-details">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-price">${item.price} SAR</div>
                            <div class="quantity-controls">
                                <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                                <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                                <button class="quantity-btn increase" data-id="${item.id}">+</button>
                            </div>
                        </div>
                        <button class="remove-item" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
            });
            
            if (cartTotal) cartTotal.style.display = 'block';
            
            // إضافة مستمعي الأحداث للكمية والإزالة
            setTimeout(() => {
                document.querySelectorAll('.increase').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const id = e.target.closest('.increase').getAttribute('data-id');
                        this.increaseQuantity(id);
                    });
                });
                
                document.querySelectorAll('.decrease').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const id = e.target.closest('.decrease').getAttribute('data-id');
                        this.decreaseQuantity(id);
                    });
                });
                
                document.querySelectorAll('.remove-item').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const id = e.target.closest('.remove-item').getAttribute('data-id');
                        this.removeFromCart(id);
                    });
                });
            }, 100);
        }
        
        this.updateCartTotals();
    }

    increaseQuantity(id) {
        const item = this.cart.find(item => item.id === id);
        if (item) {
            item.quantity += 1;
            this.updateCart();
        }
    }

    decreaseQuantity(id) {
        const item = this.cart.find(item => item.id === id);
        if (item && item.quantity > 1) {
            item.quantity -= 1;
            this.updateCart();
        }
    }

    removeFromCart(id) {
        const item = this.cart.find(item => item.id === id);
        if (item) {
            this.cart = this.cart.filter(item => item.id !== id);
            this.showStoreNotification(`تم إزالة ${item.name} من السلة`);
            this.updateCart();
        }
    }

    updateCartTotals() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.15;
        const shipping = subtotal >= 300 ? 0 : 25;
        const total = subtotal + tax + shipping;
        
        const subtotalEl = document.getElementById('subtotal');
        const taxEl = document.getElementById('tax');
        const totalEl = document.getElementById('total');
        const shippingEl = document.getElementById('shipping');
        
        if (subtotalEl) subtotalEl.textContent = `${subtotal.toFixed(2)} SAR`;
        if (taxEl) taxEl.textContent = `${tax.toFixed(2)} SAR`;
        if (totalEl) totalEl.textContent = `${total.toFixed(2)} SAR`;
        if (shippingEl) shippingEl.textContent = `${shipping.toFixed(2)} SAR`;
    }

    openCart() {
        console.log('📖 فتح السلة');
        if (this.cartSidebar) {
            this.cartSidebar.classList.add('active');
        }
        if (this.cartOverlay) {
            this.cartOverlay.classList.add('active');
        }
    }

    closeCart() {
        console.log('❌ إغلاق السلة');
        if (this.cartSidebar) {
            this.cartSidebar.classList.remove('active');
        }
        if (this.cartOverlay) {
            this.cartOverlay.classList.remove('active');
        }
    }

    goToCheckout() {
        if (this.cart.length === 0) {
            this.showStoreNotification('السلة فارغة. أضف منتجات قبل اتمام الشراء.', 'error');
            return;
        }
        
        if (!this.isLoggedIn()) {
            this.showStoreNotification('يجب تسجيل الدخول أولاً', 'error');
            this.showAuthModal();
            return;
        }
        
        this.showStoreNotification('جاري تحويلك إلى صفحة الدفع...', 'info');
        this.closeCart();
        
        // هنا يمكنك إضافة منطق الدفع
        setTimeout(() => {
            this.completeOrder();
        }, 2000);
    }

    completeOrder() {
        const orderData = {
            items: this.cart,
            total: this.cart.reduce((total, item) => total + (item.price * item.quantity), 0),
            user: JSON.parse(localStorage.getItem('userData') || '{}')
        };
        
        console.log('✅ اتمام الطلب:', orderData);
        
        if (this.demoMode) {
            // حفظ الطلب في الوضع المحلي
            const orders = JSON.parse(localStorage.getItem('user_orders') || '[]');
            orders.push({
                ...orderData,
                order_number: 'ORD-' + Date.now(),
                created_at: new Date().toISOString(),
                status: 'confirmed'
            });
            localStorage.setItem('user_orders', JSON.stringify(orders));
        }
        
        this.showStoreNotification('🎉 تم تأكيد طلبك بنجاح! شكراً لشرائك.', 'success');
        this.cart = [];
        this.updateCart();
    }

    showStoreNotification(message, type = 'success') {
        const existingNotifications = document.querySelectorAll('.store-notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `store-notification ${type === 'error' ? 'error' : type === 'info' ? 'info' : ''}`;
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} me-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 4000);
    }

    createCheckoutPage() {
        // يمكن توسيع هذه الدالة لإنشاء صفحة دفع كاملة
        console.log('✅ تم تهيئة نظام الدفع');
    }

    // الأنماط الإضافية
    addAuthModalStyles() {
        if (document.querySelector('#auth-styles')) return;

        const styles = `
            .auth-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .auth-modal.active {
                opacity: 1;
            }
            
            .auth-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 450px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            
            .auth-modal.active .auth-content {
                transform: scale(1);
            }
            
            .auth-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .auth-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .demo-notice {
                background: var(--info-color);
                color: white;
                padding: 10px;
                border-radius: 8px;
                margin-bottom: 15px;
                text-align: center;
                font-size: 14px;
                font-weight: bold;
            }
            
            .auth-form {
                display: none;
            }
            
            .auth-form.active {
                display: block;
            }
            
            .auth-form h3 {
                text-align: center;
                margin-bottom: 25px;
                color: var(--primary-color);
                font-size: 24px;
                font-weight: bold;
            }
            
            .input-group {
                margin-bottom: 15px;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .password-hint {
                color: #666;
                display: block;
                margin-top: 5px;
                font-size: 12px;
            }
            
            .auth-btn {
                width: 100%;
                padding: 15px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: all 0.3s ease;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .auth-btn:hover:not(:disabled) {
                background: var(--secondary-color);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(162, 0, 135, 0.3);
            }
            
            .auth-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }
            
            .auth-switch {
                text-align: center;
                margin-top: 25px;
                color: var(--dark-color);
                font-size: 14px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
            }
            
            .switch-link {
                color: var(--primary-color);
                cursor: pointer;
                font-weight: bold;
                transition: color 0.3s ease;
            }
            
            .switch-link:hover {
                color: var(--secondary-color);
                text-decoration: underline;
            }

            .user-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                padding: 0;
                min-width: 280px;
                z-index: 1000;
                margin-top: 8px;
                border: 2px solid var(--primary-color);
                overflow: hidden;
                display: none;
            }
            
            .user-header {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                padding: 20px;
                color: white;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .user-avatar {
                font-size: 40px;
                opacity: 0.9;
            }
            
            .user-details {
                flex: 1;
            }
            
            .user-details strong {
                display: block;
                font-size: 16px;
                margin-bottom: 4px;
            }
            
            .user-details small {
                font-size: 12px;
                opacity: 0.8;
            }
            
            .menu-section {
                padding: 15px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .menu-items {
                padding: 0;
            }
            
            .user-menu-item {
                display: flex;
                align-items: center;
                padding: 12px 20px;
                color: #333;
                text-decoration: none;
                border: none;
                background: none;
                width: 100%;
                text-align: right;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
                gap: 12px;
                position: relative;
                border-bottom: 1px solid #f8f8f8;
            }
            
            .user-menu-item:last-child {
                border-bottom: none;
            }
            
            .user-menu-item i {
                width: 20px;
                text-align: center;
                color: var(--primary-color);
                font-size: 16px;
            }
            
            .user-menu-item:hover {
                background: var(--light-color);
                transform: translateX(-5px);
            }
            
            .user-menu-item:hover i {
                color: var(--secondary-color);
            }
            
            .logout-btn {
                color: var(--danger-color);
                font-weight: bold;
                margin-top: 0;
            }
            
            .logout-btn i {
                color: var(--danger-color);
            }
            
            .logout-btn:hover {
                background: #ffe6e6;
            }
            
            .menu-badge {
                background: var(--secondary-color);
                color: white;
                border-radius: 12px;
                padding: 2px 8px;
                font-size: 11px;
                font-weight: bold;
                margin-right: auto;
            }

            .system-message {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 15px 25px;
                border-radius: 8px;
                color: white;
                z-index: 10001;
                font-weight: bold;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                animation: slideDown 0.3s ease;
            }
            
            .system-message.success {
                background: var(--success-color);
            }
            
            .system-message.error {
                background: var(--danger-color);
            }
            
            .system-message.info {
                background: var(--info-color);
            }
            
            @keyframes slideDown {
                from {
                    transform: translateX(-50%) translateY(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'auth-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    addProfileModalStyles() {
        if (document.querySelector('#profile-styles')) return;

        const styles = `
            .profile-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .profile-modal.active {
                opacity: 1;
            }
            
            .profile-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 700px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            
            .profile-modal.active .profile-content {
                transform: scale(1);
            }
            
            .profile-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .profile-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .profile-header {
                display: flex;
                align-items: center;
                gap: 20px;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #f0f0f0;
            }
            
            .profile-avatar {
                font-size: 60px;
                color: var(--primary-color);
            }
            
            .profile-info h3 {
                margin: 0 0 5px 0;
                color: var(--primary-color);
            }
            
            .profile-info p {
                margin: 0 0 10px 0;
                color: #666;
            }
            
            .user-stats {
                display: flex;
                gap: 15px;
                margin-top: 10px;
            }
            
            .stat-item {
                display: flex;
                align-items: center;
                gap: 5px;
                background: var(--light-color);
                padding: 5px 10px;
                border-radius: 8px;
                font-size: 12px;
                color: var(--dark-color);
            }
            
            .stat-item i {
                color: var(--primary-color);
            }
            
            .profile-body {
                margin-top: 20px;
            }
            
            .form-section {
                margin-bottom: 30px;
                padding: 20px;
                border: 1px solid #e0e0e0;
                border-radius: 10px;
                background: #fafafa;
            }
            
            .form-section h4 {
                margin: 0 0 20px 0;
                color: var(--primary-color);
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .input-row {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
            }
            
            .input-row .input-group {
                flex: 1;
            }
            
            .input-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #333;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .input-group input[readonly] {
                background-color: #f8f9fa;
                color: #666;
                cursor: not-allowed;
            }
            
            .text-muted {
                color: #666;
                font-size: 12px;
                display: block;
                margin-top: 5px;
            }
            
            .profile-actions {
                display: flex;
                gap: 15px;
                margin-top: 30px;
            }
            
            .profile-actions .auth-btn {
                flex: 1;
                margin-bottom: 0;
            }
            
            .auth-secondary {
                background: #6c757d !important;
            }
            
            .auth-secondary:hover {
                background: #5a6268 !important;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'profile-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    addOrdersModalStyles() {
        const styles = `
            .orders-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .orders-modal.active {
                opacity: 1;
            }
            
            .orders-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 600px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 80vh;
                overflow-y: auto;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            
            .orders-modal.active .orders-content {
                transform: scale(1);
            }
            
            .orders-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .orders-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .orders-content h3 {
                text-align: center;
                margin-bottom: 25px;
                color: var(--primary-color);
            }
            
            .orders-list {
                max-height: 400px;
                overflow-y: auto;
            }
            
            .order-item {
                background: #f8f9fa;
                border-radius: 10px;
                padding: 15px;
                margin-bottom: 15px;
                border: 1px solid #e9ecef;
                transition: all 0.3s ease;
            }
            
            .order-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            
            .order-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            
            .order-number {
                font-weight: bold;
                color: var(--primary-color);
            }
            
            .order-status {
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: bold;
            }
            
            .order-status.pending {
                background: #fff3cd;
                color: #856404;
            }
            
            .order-status.confirmed {
                background: #d1ecf1;
                color: #0c5460;
            }
            
            .order-status.processing {
                background: #d1ecf1;
                color: #0c5460;
            }
            
            .order-status.shipped {
                background: #d4edda;
                color: #155724;
            }
            
            .order-status.delivered {
                background: #d4edda;
                color: #155724;
            }
            
            .order-status.cancelled {
                background: #f8d7da;
                color: #721c24;
            }
            
            .order-details {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                font-size: 14px;
                color: #666;
            }
            
            .order-items-count {
                font-size: 12px;
                color: #999;
            }
            
            .empty-orders {
                text-align: center;
                padding: 40px 20px;
                color: #666;
            }
            
            .empty-orders i {
                font-size: 48px;
                margin-bottom: 15px;
                color: #ddd;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// جعل النظام متاحاً globally
if (typeof window !== 'undefined') {
    window.AuthSystem = AuthSystem;
}

console.log('🚀 نظام AuthSystem جاهز للاستخدام!');*/






























































// نظام المصادقة والملف الشخصي والمتجر المتكامل
class AuthSystem {
    constructor() {
        this.demoMode = false;
        this.products = [
            {
                id: "1",
                name: "Rose Éclat",
                price: 280,
                image: "images/pert.jpg",
                description: "يتميز هذا العطر رائحته الفاخرة التي تفوح بعبير الورد الفرنسي تجمع نسماته بين نعومة الورود الباريسية ولمسات من المسك الأبيض والفانيليا الناعمة لتمنحك إحساسًا بالدفء والرقي يدوم طوال اليوم"
            },
            {
                id: "2", 
                name: "Violet Lavender",
                price: 199,
                image: "images/uuuuu.jpg",
                description: "هذا العطر يتميز بنفحات من زهرة البنفسج واللافندر، مما يخلق توليفة زهرية ناعمة وأنيقة"
            },
            {
                id: "3",
                name: "Larmes de Rose", 
                price: 250,
                image: "images/Gold.jpg",
                description: "عطر أنثوي راقٍ تنبعث منه نفحات ناعمة من زهرة الماغنوليا واللوتس، ممزوجة بعبير الورد التركي، وتغلفه لمسة دافئة من المسك الأبيض وخشب الكشمير. يجسّد لحظاتك الحالمة بأناقة لا تُنسى"
            },
            {
                id: "4",
                name: "Lumière Blanche",
                price: 130, 
                image: "images/www.jpg",
                description: "عطر يشبه لحظة صباحية ناعمة، حين يلامس الضوء بشرتك برقة وهدوء. يفتتح بنفحات منعشة من الكمثرى واللافندر، ثم يتعمق في قلب زهري أنيق من السوسن والورد البلغاري. تستقر رائحته على قاعدة دافئة من المسك الابيض وخشب الصندل، تترك أثرًا ناعمًا يدوم."
            },
            {
                id: "5",
                name: "Or Lumi",
                price: 300,
                image: "images/yallow.jpg", 
                description: "عطر يفتتح بنفحات من اليوسفي واللافندر، منعشة ومحايدة يتوسطه قلب خشبي زهري من السوسن وخشب الأرز، يعكس التوازن بين القوة والرقة تستقر رائحته على قاعدة دافئة من العنبر والمسك، تترك أثرًا ناعمًا يدوم"
            },
            {
                id: "6",
                name: "Azure Drift",
                price: 180,
                image: "images/Blue Perfume.jpg",
                description: "هذا العطر ينبض بالحيوية من البرغموت الإيطالي والنعناع الأزرق، ليمنح إحساسًا منعشًا ومتوازنًا يتناغم قلبه بنقاء زهرة اللوتس وخشب الأرز الأبيض، في انسجام بين الصفاء والدفء تتعمق رائحته بقاعدة من المسك النقي والعنبر الرمادي، تترك أثرًا هادئًا يدوم"
            }
        ];
        this.cart = [];
        this.currentDiscount = null;
        this.init();
    }

    init() {
        console.log('🚀 بدء نظام المصادقة والمتجر...');
        this.setCustomColors();
        this.createAuthModal();
        this.createProfileModal();
        this.createCartElements();
        this.createCheckoutPage();
        this.setupUserIconListener();
        this.setupModalEvents();
        this.checkAuthStatus();
        this.checkServerStatus();
        this.setupStoreStyles();
        this.setupCartToggle();
        this.setupBuyButtons();
        
        // تحميل السلة من localStorage إذا كانت موجودة
        this.loadCartFromStorage();
    }

    loadCartFromStorage() {
        const savedCart = localStorage.getItem('user_cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
            this.updateCart();
        }
    }

    saveCartToStorage() {
        localStorage.setItem('user_cart', JSON.stringify(this.cart));
    }

    setupCartToggle() {
        const cartToggle = document.getElementById('cart-toggle');
        if (cartToggle) {
            cartToggle.addEventListener('click', () => this.openCart());
        }
    }

    setupBuyButtons() {
        // إضافة مستمعي الأحداث لأزرار الشراء الموجودة في HTML
        document.addEventListener('click', (e) => {
            const buyButton = e.target.closest('.buy-button');
            if (buyButton) {
                e.preventDefault();
                e.stopPropagation();
                this.handleExistingBuyButton(buyButton);
            }
        });
    }

    handleExistingBuyButton(button) {
        const productCard = button.closest('.product-card');
        if (!productCard) return;

        const productName = productCard.querySelector('.product-title')?.textContent || '';
        const productPrice = productCard.querySelector('.price')?.textContent || '';
        const productImage = productCard.querySelector('.product-image')?.src || '';
        const productDescription = productCard.querySelector('.description')?.textContent || '';

        // استخراج السعر من النص
        const priceMatch = productPrice.match(/(\d+)/);
        const price = priceMatch ? parseInt(priceMatch[1]) : 0;

        // البحث عن المنتج في المصفوفة
        const product = this.products.find(p => 
            p.name === productName.trim() || 
            p.price === price
        );

        if (product) {
            this.addToCart(product);
        } else {
            // إنشاء منتج جديد إذا لم يوجد في المصفوفة
            const newProduct = {
                id: Date.now().toString(),
                name: productName.trim(),
                price: price,
                image: productImage,
                description: productDescription,
                quantity: 1
            };
            this.addToCart(newProduct);
        }
    }

    async checkServerStatus() {
        try {
            const response = await fetch('auth.php?action=test', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            const result = await response.json();
            this.demoMode = !result.success;
            
            if (this.demoMode) {
                console.log('🔧 الخادم غير متاح، النظام يعمل في الوضع المحلي');
            } else {
                console.log('✅ الخادم متاح ويعمل');
            }
        } catch (error) {
            console.log('🔧 الخادم غير متاح، النظام يعمل في الوضع المحلي');
            this.demoMode = true;
        }
    }

    setCustomColors() {
        const styles = `
            :root {
                --primary-color: #ea70b1;
                --secondary-color: #a20087;
                --light-color: #f8f9fa;
                --dark-color: #343a40;
                --success-color: #28a745;
                --danger-color: #dc3545;
                --warning-color: #ffc107;
                --info-color: #17a2b8;
            }
            
            .auth-primary { background-color: var(--primary-color) !important; }
            .auth-secondary { background-color: var(--secondary-color) !important; }
            .auth-success { background-color: var(--success-color) !important; }
            .auth-info { background-color: var(--info-color) !important; }
            
            .auth-primary:hover { background-color: var(--secondary-color) !important; }
            .auth-success:hover { background-color: #218838 !important; }
            .auth-info:hover { background-color: #138496 !important; }
            
            .text-primary { color: var(--primary-color) !important; }
            .text-secondary { color: var(--secondary-color) !important; }
            .text-success { color: var(--success-color) !important; }
            .text-danger { color: var(--danger-color) !important; }
            .text-info { color: var(--info-color) !important; }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupUserIconListener() {
        const userIcons = document.querySelectorAll('.fa-solid.fa-user, .user-icon');
        
        if (userIcons.length > 0) {
            userIcons.forEach(icon => {
                const button = icon.closest('button') || icon;
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('✅ تم النقر على أيقونة المستخدم');
                    this.handleUserClick(button);
                });
            });
        } else {
            console.error('❌ لم يتم العثور على أيقونة المستخدم!');
            this.createUserIcon();
        }
    }

    createUserIcon() {
        const userIcon = document.createElement('button');
        userIcon.className = 'user-icon';
        userIcon.innerHTML = '<i class="fa-solid fa-user"></i>';
        userIcon.style.cssText = `
            background: #f0f0f0;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            margin-left: 10px;
        `;
        
        const header = document.querySelector('.header') || document.body;
        header.appendChild(userIcon);
        
        userIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleUserClick(userIcon);
        });
    }

    handleUserClick(element) {
        if (this.isLoggedIn()) {
            this.showUserMenu(element);
        } else {
            this.showAuthModal();
        }
    }

    showUserMenu(icon) {
        const oldMenu = document.querySelector('.user-menu');
        if (oldMenu) oldMenu.remove();
        
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        const menuHTML = `
            <div class="user-menu">
                <div class="user-header">
                    <div class="user-avatar">
                        <i class="fa-solid fa-user-circle"></i>
                    </div>
                    <div class="user-details">
                        <strong>${userData.full_name || userData.name || 'مستخدم'}</strong>
                        <small>${userData.email || ''}</small>
                    </div>
                </div>
                
                <div class="menu-section">
                    <div class="menu-items">
                        <button class="user-menu-item" onclick="authSystem.showProfile()">
                            <i class="fa-solid fa-user"></i>
                            حسابي
                        </button>
                        <button class="user-menu-item" onclick="authSystem.showOrders()">
                            <i class="fa-solid fa-box"></i>
                            الطلبات
                        </button>
                    </div>
                </div>
                
                <div class="menu-items">
                    <button class="user-menu-item logout-btn" onclick="authSystem.handleLogout()">
                        <i class="fa-solid fa-right-from-bracket"></i>
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        `;
        
        const iconContainer = icon.closest('button') || icon;
        const container = iconContainer.parentNode;
        container.style.position = 'relative';
        container.insertAdjacentHTML('beforeend', menuHTML);
        
        const menu = container.querySelector('.user-menu');
        
        setTimeout(() => {
            menu.style.display = 'block';
        }, 10);
        
        const closeMenu = (e) => {
            if (menu && !menu.contains(e.target) && !icon.contains(e.target)) {
                menu.style.display = 'none';
                document.removeEventListener('click', closeMenu);
                setTimeout(() => {
                    if (menu.parentNode) {
                        menu.remove();
                    }
                }, 300);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 10);
    }

    createAuthModal() {
        if (document.getElementById('authModal')) return;

        const modalHTML = `
            <div class="auth-modal" id="authModal">
                <div class="auth-content">
                    <button class="auth-close" id="authClose">×</button>
                    ${this.demoMode ? '<div class="demo-notice"><i class="fa-solid fa-computer"></i> النظام يعمل في الوضع المحلي - البيانات سيتم حفظها في المتصفح</div>' : ''}
                    
                    <div class="auth-form active" id="loginForm">
                        <h3 class="text-primary">تسجيل الدخول</h3>
                        <form id="loginFormElement">
                            <div class="input-group">
                                <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                            </div>
                            <div class="input-group">
                                <input type="password" name="password" placeholder="كلمة المرور" required>
                            </div>
                            <button type="submit" class="auth-btn auth-primary">
                                <i class="fa-solid fa-right-to-bracket"></i>
                                تسجيل الدخول
                            </button>
                        </form>
                        <div class="auth-switch">
                            ليس لديك حساب؟ 
                            <span class="switch-link text-primary" id="showRegister">إنشاء حساب جديد</span>
                        </div>
                    </div>
                    
                    <div class="auth-form" id="registerForm">
                        <h3 class="text-primary">إنشاء حساب جديد</h3>
                        <form id="registerFormElement">
                            <div class="input-group">
                                <input type="text" name="full_name" placeholder="الاسم الكامل" required>
                            </div>
                            <div class="input-group">
                                <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                            </div>
                            <div class="input-group">
                                <input type="password" name="password" placeholder="كلمة المرور" required>
                                <small class="password-hint">كلمة المرور يجب أن تكون 6 أحرف على الأقل</small>
                            </div>
                            <div class="input-group">
                                <input type="password" name="confirm_password" placeholder="تأكيد كلمة المرور" required>
                            </div>
                            <div class="input-group">
                                <input type="tel" name="phone" placeholder="رقم الهاتف (اختياري)">
                            </div>
                            <div class="input-group">
                                <input type="date" name="birth_date" placeholder="تاريخ الميلاد">
                            </div>
                            <div class="input-group">
                                <textarea name="address" placeholder="العنوان" rows="3"></textarea>
                            </div>
                            <button type="submit" class="auth-btn auth-primary">
                                <i class="fa-solid fa-user-plus"></i>
                                إنشاء حساب
                            </button>
                        </form>
                        <div class="auth-switch">
                            لديك حساب بالفعل؟ 
                            <span class="switch-link text-primary" id="showLogin">تسجيل الدخول</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addAuthModalStyles();
    }

    createProfileModal() {
        if (document.getElementById('profileModal')) return;

        const modalHTML = `
            <div class="profile-modal" id="profileModal">
                <div class="profile-content">
                    <button class="profile-close" id="profileClose">×</button>
                    ${this.demoMode ? '<div class="demo-notice"><i class="fa-solid fa-computer"></i> النظام يعمل في الوضع المحلي - البيانات محفوظة في المتصفح</div>' : ''}
                    
                    <div class="profile-header">
                        <div class="profile-avatar">
                            <i class="fa-solid fa-user-circle"></i>
                        </div>
                        <div class="profile-info">
                            <h3 class="text-primary" id="profileName">الاسم الكامل</h3>
                            <p id="profileEmail">البريد الإلكتروني</p>
                            <div class="user-stats">
                                <span class="stat-item">
                                    <i class="fa-solid fa-box"></i>
                                    <span id="profileOrders">0 طلبات</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="profile-body">
                        <form id="profileForm">
                            <div class="form-section">
                                <h4><i class="fa-solid fa-user"></i> المعلومات الشخصية</h4>
                                <div class="input-row">
                                    <div class="input-group">
                                        <label>الاسم الكامل</label>
                                        <input type="text" name="full_name" id="profileFullName" required>
                                    </div>
                                    <div class="input-group">
                                        <label>البريد الإلكتروني</label>
                                        <input type="email" name="email" id="profileEmailInput" readonly>
                                        <small class="text-muted">لا يمكن تعديل البريد الإلكتروني</small>
                                    </div>
                                </div>
                                
                                <div class="input-row">
                                    <div class="input-group">
                                        <label>رقم الهاتف</label>
                                        <input type="tel" name="phone" id="profilePhone">
                                    </div>
                                    <div class="input-group">
                                        <label>تاريخ الميلاد</label>
                                        <input type="date" name="birth_date" id="profileBirthDate">
                                    </div>
                                </div>
                                
                                <div class="input-group">
                                    <label>العنوان</label>
                                    <textarea name="address" id="profileAddress" rows="3" placeholder="العنوان الكامل"></textarea>
                                </div>
                            </div>
                            
                            <div class="profile-actions">
                                <button type="submit" class="auth-btn auth-primary">
                                    <i class="fa-solid fa-save"></i>
                                    حفظ التغييرات
                                </button>
                                <button type="button" class="auth-btn auth-secondary" onclick="authSystem.hideProfileModal()">
                                    <i class="fa-solid fa-times"></i>
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addProfileModalStyles();
    }

    setupModalEvents() {
        this.bindAuthEvents();
        this.bindProfileEvents();
    }

    bindAuthEvents() {
        const showRegister = document.getElementById('showRegister');
        const showLogin = document.getElementById('showLogin');
        
        if (showRegister) {
            showRegister.onclick = () => this.showRegisterForm();
        }
        
        if (showLogin) {
            showLogin.onclick = () => this.showLoginForm();
        }
        
        const authClose = document.getElementById('authClose');
        if (authClose) {
            authClose.onclick = () => this.hideAuthModal();
        }
        
        const loginForm = document.getElementById('loginFormElement');
        const registerForm = document.getElementById('registerFormElement');
        
        if (loginForm) {
            loginForm.onsubmit = (e) => {
                e.preventDefault();
                this.handleLogin(e);
            };
        }
        
        if (registerForm) {
            registerForm.onsubmit = (e) => {
                e.preventDefault();
                this.handleRegister(e);
            };
        }
        
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.onclick = (e) => {
                if (e.target.id === 'authModal') {
                    this.hideAuthModal();
                }
            };
        }
    }

    bindProfileEvents() {
        const profileClose = document.getElementById('profileClose');
        if (profileClose) {
            profileClose.onclick = () => this.hideProfileModal();
        }
        
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.onsubmit = (e) => {
                e.preventDefault();
                this.handleProfileUpdate(e);
            };
        }
        
        const profileModal = document.getElementById('profileModal');
        if (profileModal) {
            profileModal.onclick = (e) => {
                if (e.target.id === 'profileModal') {
                    this.hideProfileModal();
                }
            };
        }
    }

    showAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
            this.showLoginForm();
        }
    }

    hideAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    showProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            this.loadProfileData();
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
        }
    }

    hideProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    showLoginForm() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm && registerForm) {
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        }
    }

    showRegisterForm() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm && registerForm) {
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    }

    async handleLogin(e) {
        const formData = new FormData(e.target);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        
        console.log('📤 محاولة تسجيل الدخول:', data);
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري التسجيل...';
        submitBtn.disabled = true;
        
        try {
            let result;
            
            if (this.demoMode) {
                // الوضع المحلي - التحقق من البيانات محلياً
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const users = JSON.parse(localStorage.getItem('demo_users') || '{}');
                const user = users[data.email];
                
                if (user && user.password === data.password) {
                    result = {
                        success: true,
                        message: 'تم تسجيل الدخول بنجاح (الوضع المحلي)',
                        user: {
                            id: user.id,
                            full_name: user.full_name,
                            email: user.email,
                            phone: user.phone,
                            birth_date: user.birth_date,
                            address: user.address,
                            total_orders: user.total_orders || 0,
                            total_spent: user.total_spent || 0,
                            created_at: user.created_at
                        }
                    };
                } else {
                    result = {
                        success: false,
                        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
                    };
                }
            } else {
                // الوضع العادي - الاتصال بالخادم
                const response = await fetch('auth.php?action=login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                console.log('📥 استجابة الخادم:', response);
                
                const responseText = await response.text();
                
                try {
                    result = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('❌ خطأ في تحويل JSON:', responseText);
                    throw new Error('استجابة غير صالحة من الخادم');
                }
            }
            
            console.log('📋 نتيجة التسجيل:', result);
            
            if (result.success) {
                localStorage.setItem('userData', JSON.stringify(result.user));
                this.showMessage('تم تسجيل الدخول بنجاح!', 'success');
                this.hideAuthModal();
                this.checkAuthStatus();
                
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                this.showMessage(result.message || 'فشل تسجيل الدخول', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تسجيل الدخول:', error);
            
            this.demoMode = true;
            this.showMessage('الخادم غير متاح، جاري استخدام الوضع المحلي', 'info');
            
            setTimeout(() => {
                this.handleLogin(e);
            }, 1000);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleRegister(e) {
        const formData = new FormData(e.target);
        const data = {
            full_name: formData.get('full_name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirm_password: formData.get('confirm_password'),
            phone: formData.get('phone'),
            birth_date: formData.get('birth_date'),
            address: formData.get('address')
        };
        
        console.log('📤 محاولة التسجيل:', data);
        
        if (data.password !== data.confirm_password) {
            this.showMessage('كلمات المرور غير متطابقة', 'error');
            return;
        }
        
        if (data.password.length < 6) {
            this.showMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري إنشاء الحساب...';
        submitBtn.disabled = true;
        
        try {
            let result;
            
            if (this.demoMode) {
                // الوضع المحلي - حفظ البيانات في localStorage
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const users = JSON.parse(localStorage.getItem('demo_users') || '{}');
                
                if (users[data.email]) {
                    result = {
                        success: false,
                        message: 'البريد الإلكتروني مسجل مسبقاً'
                    };
                } else {
                    const newUser = {
                        id: Date.now(),
                        full_name: data.full_name,
                        email: data.email,
                        password: data.password,
                        phone: data.phone,
                        birth_date: data.birth_date,
                        address: data.address,
                        total_orders: 0,
                        total_spent: 0,
                        created_at: new Date().toISOString()
                    };
                    
                    users[data.email] = newUser;
                    localStorage.setItem('demo_users', JSON.stringify(users));
                    
                    result = {
                        success: true,
                        message: 'تم إنشاء الحساب بنجاح (الوضع المحلي)'
                    };
                }
            } else {
                // الوضع العادي - الاتصال بالخادم
                const response = await fetch('auth.php?action=register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                console.log('📥 استجابة التسجيل:', response);
                
                const responseText = await response.text();
                
                try {
                    result = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('❌ خطأ في تحويل JSON:', responseText);
                    throw new Error('استجابة غير صالحة من الخادم');
                }
            }
            
            console.log('📋 نتيجة إنشاء الحساب:', result);
            
            if (result.success) {
                this.showMessage('تم إنشاء الحساب بنجاح!', 'success');
                this.showLoginForm();
                
                const emailInput = document.querySelector('#loginForm input[name="email"]');
                if (emailInput) {
                    emailInput.value = data.email;
                }
            } else {
                this.showMessage(result.message || 'فشل إنشاء الحساب', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في إنشاء الحساب:', error);
            
            this.demoMode = true;
            this.showMessage('الخادم غير متاح، جاري استخدام الوضع المحلي', 'info');
            
            setTimeout(() => {
                this.handleRegister(e);
            }, 1000);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleProfileUpdate(e) {
        const formData = new FormData(e.target);
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        if (!userData || !userData.id) {
            this.showMessage('يجب تسجيل الدخول أولاً', 'error');
            return;
        }

        const data = {
            user_id: userData.id,
            full_name: formData.get('full_name'),
            phone: formData.get('phone'),
            birth_date: formData.get('birth_date'),
            address: formData.get('address')
        };
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الحفظ...';
        submitBtn.disabled = true;
        
        try {
            let result;
            
            if (this.demoMode) {
                // الوضع المحلي - تحديث البيانات في localStorage
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const users = JSON.parse(localStorage.getItem('demo_users') || '{}');
                const currentUser = users[userData.email];
                
                if (currentUser) {
                    currentUser.full_name = data.full_name;
                    currentUser.phone = data.phone;
                    currentUser.birth_date = data.birth_date;
                    currentUser.address = data.address;
                    
                    users[userData.email] = currentUser;
                    localStorage.setItem('demo_users', JSON.stringify(users));
                    
                    result = {
                        success: true,
                        message: 'تم تحديث البيانات بنجاح (الوضع المحلي)',
                        user: currentUser
                    };
                } else {
                    result = {
                        success: false,
                        message: 'المستخدم غير موجود'
                    };
                }
            } else {
                // الوضع العادي - الاتصال بالخادم
                const response = await fetch('auth.php?action=update_profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                const responseText = await response.text();
                
                try {
                    result = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('❌ خطأ في تحويل JSON:', responseText);
                    throw new Error('استجابة غير صالحة من الخادم');
                }
            }
            
            console.log('📋 نتيجة تحديث الملف:', result);
            
            if (result.success) {
                this.showMessage('تم تحديث البيانات بنجاح!', 'success');
                
                if (result.user) {
                    localStorage.setItem('userData', JSON.stringify(result.user));
                    this.checkAuthStatus();
                }
                
                this.hideProfileModal();
            } else {
                this.showMessage(result.message || 'فشل تحديث البيانات', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الملف الشخصي:', error);
            
            this.demoMode = true;
            this.showMessage('الخادم غير متاح، جاري استخدام الوضع المحلي', 'info');
            
            setTimeout(() => {
                this.handleProfileUpdate(e);
            }, 1000);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    loadProfileData() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        document.getElementById('profileName').textContent = userData.full_name || 'مستخدم';
        document.getElementById('profileEmail').textContent = userData.email || '';
        document.getElementById('profileFullName').value = userData.full_name || '';
        document.getElementById('profileEmailInput').value = userData.email || '';
        document.getElementById('profilePhone').value = userData.phone || '';
        document.getElementById('profileBirthDate').value = userData.birth_date || '';
        document.getElementById('profileAddress').value = userData.address || '';
        
        // تحديث الإحصائيات
        document.getElementById('profileOrders').textContent = `${userData.total_orders || 0} طلبات`;
    }

    handleLogout() {
        localStorage.removeItem('userData');
        localStorage.removeItem('user_cart'); // تنظيف السلة عند تسجيل الخروج
        this.cart = [];
        this.updateCart();
        this.showMessage('تم تسجيل الخروج بنجاح', 'success');
        this.checkAuthStatus();
        
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    isLoggedIn() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        return !!(userData && userData.id);
    }

    checkAuthStatus() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        if (this.isLoggedIn()) {
            console.log('✅ المستخدم مسجل الدخول:', userData);
            this.updateUserInterface();
        } else {
            console.log('❌ المستخدم غير مسجل الدخول');
        }
    }

    updateUserInterface() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        console.log('🔄 تحديث واجهة المستخدم:', userData);
        
        const userIcons = document.querySelectorAll('.fa-solid.fa-user, .user-icon');
        userIcons.forEach(icon => {
            const button = icon.closest('button') || icon;
            button.style.color = 'var(--primary-color)';
            button.title = `مرحباً ${userData.full_name || 'مستخدم'}`;
        });
    }

    showProfile() {
        this.showProfileModal();
    }

    showOrders() {
        if (!this.isLoggedIn()) {
            this.showAuthModal();
            return;
        }

        // عرض إشعار بأن الصفحة قيد التطوير
        this.showComingSoonNotification();
    }

    showComingSoonNotification() {
        const notificationHTML = `
            <div class="coming-soon-modal" id="comingSoonModal">
                <div class="coming-soon-content">
                    <div class="coming-soon-icon">
                        <i class="fa-solid fa-tools"></i>
                    </div>
                    <h3 class="text-primary">🛠️ صفحة الطلبات قيد التطوير</h3>
                    <p class="coming-soon-text">
                        نحن نعمل على تطوير صفحة متكاملة لعرض جميع طلباتك وتفاصيلها.<br>
                        ستكون متاحة قريباً بميزات رائعة!
                    </p>
                    <div class="coming-soon-features">
                        <div class="feature-item">
                            <i class="fa-solid fa-list-check"></i>
                            <span>عرض جميع الطلبات السابقة</span>
                        </div>
                        <div class="feature-item">
                            <i class="fa-solid fa-truck"></i>
                            <span>تتبع حالة الشحن</span>
                        </div>
                        <div class="feature-item">
                            <i class="fa-solid fa-clock-rotate-left"></i>
                            <span>سجل الطلبات الكامل</span>
                        </div>
                        <div class="feature-item">
                            <i class="fa-solid fa-star"></i>
                            <span>تقييم المنتجات</span>
                        </div>
                    </div>
                    <div class="coming-soon-actions">
                        <button class="auth-btn auth-primary" id="closeComingSoon">
                            <i class="fa-solid fa-check"></i>
                            حسناً، فهمت
                        </button>
                    </div>
                    <div class="coming-soon-footer">
                        <small class="text-muted">
                            <i class="fa-solid fa-envelope"></i>
                            للاستفسارات: <a href="mailto:support@lovlyscents.com">support@lovlyscents.com</a>
                        </small>
                    </div>
                </div>
            </div>
        `;

        // إزالة أي إشعار موجود مسبقاً
        const existingModal = document.getElementById('comingSoonModal');
        if (existingModal) existingModal.remove();

        document.body.insertAdjacentHTML('beforeend', notificationHTML);
        this.addComingSoonStyles();

        const modal = document.getElementById('comingSoonModal');
        const closeBtn = document.getElementById('closeComingSoon');

        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);

        closeBtn.onclick = () => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        };

        modal.onclick = (e) => {
            if (e.target.id === 'comingSoonModal') {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.remove();
                }, 300);
            }
        };
    }

    showMessage(message, type) {
        const existingMessages = document.querySelectorAll('.system-message');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.className = `system-message ${type}`;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 4000);
    }

    // نظام المتجر
    setupStoreStyles() {
        if (document.getElementById('store-styles')) return;
        
        const styles = `
            .cart-sidebar {
                position: fixed;
                top: 0;
                right: -400px;
                width: 350px;
                height: 100vh;
                background-color: white;
                box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
                transition: right 0.3s ease;
                z-index: 1050;
                padding: 20px;
                overflow-y: auto;
            }
            
            .cart-sidebar.active {
                right: 0;
            }
            
            .cart-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 1040;
                display: none;
            }
            
            .cart-overlay.active {
                display: block;
            }
            
            .product-card {
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                border: none;
                border-radius: 15px;
                overflow: hidden;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            
            .product-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            }
            
            .product-image {
                height: 250px;
                object-fit: cover;
                transition: transform 0.3s ease;
            }
            
            .product-card:hover .product-image {
                transform: scale(1.05);
            }
            
            .buy-button {
                background: linear-gradient(135deg, #a20087, #ea70b1);
                border: none;
                border-radius: 25px;
                padding: 12px 30px;
                color: white;
                font-weight: bold;
                transition: all 0.3s ease;
                cursor: pointer;
                width: 100%;
            }
            
            .buy-button:hover {
                transform: scale(1.05);
                box-shadow: 0 5px 15px rgba(162, 0, 135, 0.4);
            }
            
            .store-notification {
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 9999;
                min-width: 300px;
                background: linear-gradient(135deg, #ea70b1, #a20087);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                border: none;
                font-weight: bold;
            }
            
            .store-notification.error {
                background: linear-gradient(135deg, #dc3545, #c82333);
            }
            
            .store-notification.info {
                background: linear-gradient(135deg, #17a2b8, #138496);
            }
            
            .cart-item {
                display: flex;
                align-items: center;
                padding: 15px 0;
                border-bottom: 1px solid #eee;
            }
            
            .cart-item-image {
                width: 70px;
                height: 70px;
                object-fit: cover;
                border-radius: 8px;
                margin-left: 15px;
            }
            
            .cart-item-details {
                flex: 1;
            }
            
            .cart-item-title {
                font-weight: bold;
                margin-bottom: 5px;
                font-size: 14px;
            }
            
            .cart-item-price {
                color: #a20087;
                font-weight: bold;
            }
            
            .quantity-controls {
                display: flex;
                align-items: center;
                margin-top: 8px;
            }
            
            .quantity-btn {
                width: 30px;
                height: 30px;
                border: 1px solid #ddd;
                background-color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }
            
            .quantity-input {
                width: 40px;
                height: 30px;
                text-align: center;
                border: 1px solid #ddd;
                border-left: none;
                border-right: none;
            }
            
            .remove-item {
                color: #dc3545;
                background: none;
                border: none;
                font-size: 18px;
                margin-right: 10px;
                cursor: pointer;
            }
            
            .cart-total {
                padding: 20px 0;
                border-top: 2px solid #eee;
                margin-top: 20px;
            }
            
            .checkout-btn {
                background-color: #a20087;
                color: white;
                border: none;
                border-radius: 25px;
                padding: 12px;
                width: 100%;
                font-weight: bold;
                transition: all 0.3s;
                cursor: pointer;
            }
            
            .checkout-btn:hover {
                background-color: #ea70b1;
            }
            
            .empty-cart {
                text-align: center;
                padding: 40px 0;
                color: #666;
            }

            /* أنماط صفحة الدفع */
            .checkout-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .checkout-modal.active {
                opacity: 1;
            }
            
            .checkout-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 500px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            
            .checkout-modal.active .checkout-content {
                transform: scale(1);
            }
            
            .checkout-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .checkout-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .checkout-items {
                max-height: 200px;
                overflow-y: auto;
                margin-bottom: 20px;
            }
            
            .checkout-item {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid #eee;
            }
            
            .checkout-summary {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 10px;
                margin-bottom: 20px;
            }
            
            .checkout-summary-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
            }
            
            .checkout-total {
                font-weight: bold;
                font-size: 18px;
                color: var(--primary-color);
                border-top: 2px solid #ddd;
                padding-top: 10px;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'store-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    createCartElements() {
        if (document.getElementById('cart-sidebar')) return;
        
        this.cartOverlay = document.createElement('div');
        this.cartOverlay.id = 'cart-overlay';
        this.cartOverlay.className = 'cart-overlay';
        document.body.appendChild(this.cartOverlay);
        
        this.cartSidebar = document.createElement('div');
        this.cartSidebar.id = 'cart-sidebar';
        this.cartSidebar.className = 'cart-sidebar';
        this.cartSidebar.innerHTML = this.getCartHTML();
        document.body.appendChild(this.cartSidebar);
        
        this.setupCartEvents();
    }

    getCartHTML() {
        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4>🛒 سلة التسوق</h4>
                <button class="icon-btn text-dark" id="close-cart">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div id="cart-items">
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart fa-3x mb-3 text-muted"></i>
                    <p>سلة التسوق فارغة</p>
                </div>
            </div>
            <div class="cart-total" id="cart-total" style="display: none;">
                <div class="d-flex justify-content-between mb-2">
                    <span>المجموع:</span>
                    <span id="subtotal">0 SAR</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                    <span>الضريبة (15%):</span>
                    <span id="tax">0 SAR</span>
                </div>
                <div class="d-flex justify-content-between mb-3">
                    <span>الشحن:</span>
                    <span id="shipping">0 SAR</span>
                </div>
                <div class="d-flex justify-content-between fw-bold fs-5">
                    <span>الإجمالي:</span>
                    <span id="total">0 SAR</span>
                </div>
                <button class="checkout-btn mt-4" id="checkout-btn">🚀 اتمام الشراء</button>
            </div>
        `;
    }

    setupCartEvents() {
        const closeCart = document.getElementById('close-cart');
        const checkoutBtn = document.getElementById('checkout-btn');
        
        if (closeCart) {
            closeCart.addEventListener('click', () => this.closeCart());
        }
        
        if (this.cartOverlay) {
            this.cartOverlay.addEventListener('click', () => this.closeCart());
        }
        
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.goToCheckout());
        }
    }

    addToCart(product) {
        console.log('➕ إضافة منتج إلى السلة:', product.name);
        
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({...product, quantity: 1});
        }
        
        this.updateCart();
        this.saveCartToStorage();
        this.showStoreNotification(`تم إضافة ${product.name} إلى السلة 🎉`);
    }

    updateCart() {
        console.log('🔄 تحديث السلة:', this.cart);
        
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const cartCount = document.getElementById('cart-count');
        
        if (!cartItems) {
            console.error('❌ عنصر cart-items غير موجود');
            return;
        }
        
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
        
        console.log('📊 عدد العناصر في السلة:', totalItems);
        
        // تحديث العداد
        if (cartCount) {
            cartCount.textContent = totalItems;
            console.log('✅ تم تحديث العداد إلى:', totalItems);
        } else {
            console.error('❌ عنصر cart-count غير موجود');
        }
        
        if (this.cart.length === 0) {
            console.log('🛒 السلة فارغة - عرض حالة فارغة');
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart fa-3x mb-3 text-muted"></i>
                    <p>سلة التسوق فارغة</p>
                </div>
            `;
            if (cartTotal) {
                cartTotal.style.display = 'none';
            }
        } else {
            console.log('🛒 عرض عناصر السلة:', this.cart.length, 'عناصر');
            cartItems.innerHTML = '';
            this.cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                
                const imageSrc = item.image && item.image.startsWith('images/') ? 
                    item.image : 
                    `https://via.placeholder.com/70x70/cccccc/969696?text=${encodeURIComponent(item.name)}`;
                
                cartItems.innerHTML += `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${imageSrc}" alt="${item.name}" class="cart-item-image"
                             onerror="this.src='https://via.placeholder.com/70x70/cccccc/969696?text=صورة'">
                        <div class="cart-item-details">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-price">${item.price} SAR</div>
                            <div class="quantity-controls">
                                <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                                <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                                <button class="quantity-btn increase" data-id="${item.id}">+</button>
                            </div>
                        </div>
                        <button class="remove-item" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
            });
            
            if (cartTotal) {
                cartTotal.style.display = 'block';
            }
            
            // إضافة مستمعي الأحداث للكمية والإزالة
            setTimeout(() => {
                document.querySelectorAll('.increase').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const id = e.target.closest('.increase').getAttribute('data-id');
                        this.increaseQuantity(id);
                    });
                });
                
                document.querySelectorAll('.decrease').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const id = e.target.closest('.decrease').getAttribute('data-id');
                        this.decreaseQuantity(id);
                    });
                });
                
                document.querySelectorAll('.remove-item').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const id = e.target.closest('.remove-item').getAttribute('data-id');
                        this.removeFromCart(id);
                    });
                });
            }, 100);
        }
        
        this.updateCartTotals();
    }

    increaseQuantity(id) {
        const item = this.cart.find(item => item.id === id);
        if (item) {
            item.quantity += 1;
            this.updateCart();
            this.saveCartToStorage();
        }
    }

    decreaseQuantity(id) {
        const item = this.cart.find(item => item.id === id);
        if (item && item.quantity > 1) {
            item.quantity -= 1;
            this.updateCart();
            this.saveCartToStorage();
        }
    }

    removeFromCart(id) {
        const item = this.cart.find(item => item.id === id);
        if (item) {
            this.cart = this.cart.filter(item => item.id !== id);
            this.showStoreNotification(`تم إزالة ${item.name} من السلة`);
            this.updateCart();
            this.saveCartToStorage();
        }
    }

    updateCartTotals() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.15;
        const shipping = subtotal >= 300 ? 0 : 25;
        const total = subtotal + tax + shipping;
        
        const subtotalEl = document.getElementById('subtotal');
        const taxEl = document.getElementById('tax');
        const totalEl = document.getElementById('total');
        const shippingEl = document.getElementById('shipping');
        
        if (subtotalEl) subtotalEl.textContent = `${subtotal.toFixed(2)} SAR`;
        if (taxEl) taxEl.textContent = `${tax.toFixed(2)} SAR`;
        if (totalEl) totalEl.textContent = `${total.toFixed(2)} SAR`;
        if (shippingEl) shippingEl.textContent = `${shipping.toFixed(2)} SAR`;
    }

    openCart() {
        console.log('📖 فتح السلة');
        if (this.cartSidebar) {
            this.cartSidebar.classList.add('active');
        }
        if (this.cartOverlay) {
            this.cartOverlay.classList.add('active');
        }
    }

    closeCart() {
        console.log('❌ إغلاق السلة');
        if (this.cartSidebar) {
            this.cartSidebar.classList.remove('active');
        }
        if (this.cartOverlay) {
            this.cartOverlay.classList.remove('active');
        }
    }

    goToCheckout() {
        if (this.cart.length === 0) {
            this.showStoreNotification('السلة فارغة. أضف منتجات قبل اتمام الشراء.', 'error');
            return;
        }
        
        if (!this.isLoggedIn()) {
            this.showStoreNotification('يجب تسجيل الدخول أولاً', 'error');
            this.showAuthModal();
            return;
        }
        
        this.showCheckoutPage();
    }

    showCheckoutPage() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.15;
        const shipping = subtotal >= 300 ? 0 : 25;
        const total = subtotal + tax + shipping;

        const checkoutHTML = `
            <div class="checkout-modal" id="checkoutModal">
                <div class="checkout-content">
                    <button class="checkout-close" id="checkoutClose">×</button>
                    <h3 class="text-primary mb-4">💳 اتمام عملية الشراء</h3>
                    
                    <!-- معلومات المستخدم -->
                    <div class="user-info-section mb-4">
                        <h5 class="text-secondary">👤 معلومات العميل</h5>
                        <div class="user-details-grid">
                            <div class="user-detail-item">
                                <strong>الاسم:</strong>
                                <span>${userData.full_name || 'غير محدد'}</span>
                            </div>
                            <div class="user-detail-item">
                                <strong>البريد الإلكتروني:</strong>
                                <span>${userData.email || 'غير محدد'}</span>
                            </div>
                            <div class="user-detail-item">
                                <strong>رقم الهاتف:</strong>
                                <span>${userData.phone || 'غير محدد'}</span>
                            </div>
                            <div class="user-detail-item">
                                <strong>العنوان:</strong>
                                <span>${userData.address || 'غير محدد'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- المنتجات المطلوبة -->
                    <div class="checkout-items mb-4">
                        <h5 class="text-secondary">🛍️ المنتجات المطلوبة</h5>
                        ${this.cart.map(item => `
                            <div class="checkout-item">
                                <div>
                                    <strong>${item.name}</strong>
                                    <small class="text-muted">× ${item.quantity}</small>
                                </div>
                                <span>${(item.price * item.quantity).toFixed(2)} SAR</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- ملخص الطلب -->
                    <div class="checkout-summary">
                        <h5 class="text-secondary">💰 ملخص الطلب</h5>
                        <div class="checkout-summary-row">
                            <span>المجموع:</span>
                            <span>${subtotal.toFixed(2)} SAR</span>
                        </div>
                        <div class="checkout-summary-row">
                            <span>الضريبة (15%):</span>
                            <span>${tax.toFixed(2)} SAR</span>
                        </div>
                        <div class="checkout-summary-row">
                            <span>الشحن:</span>
                            <span>${shipping.toFixed(2)} SAR</span>
                        </div>
                        <div class="checkout-summary-row checkout-total">
                            <span>الإجمالي النهائي:</span>
                            <span>${total.toFixed(2)} SAR</span>
                        </div>
                    </div>
                    
                    <!-- طرق الدفع -->
                    <div class="payment-methods mb-4">
                        <h5 class="text-secondary">💳 اختر طريقة الدفع</h5>
                        <div class="payment-options">
                            <div class="payment-option">
                                <input type="radio" id="creditCard" name="paymentMethod" value="credit_card" checked>
                                <label for="creditCard">
                                    <i class="fab fa-cc-visa"></i>
                                    <i class="fab fa-cc-mastercard"></i>
                                    البطاقة الائتمانية
                                </label>
                            </div>
                            <div class="payment-option">
                                <input type="radio" id="applePay" name="paymentMethod" value="apple_pay">
                                <label for="applePay">
                                    <i class="fab fa-apple-pay"></i>
                                    Apple Pay
                                </label>
                            </div>
                            <div class="payment-option">
                                <input type="radio" id="mada" name="paymentMethod" value="mada">
                                <label for="mada">
                                    <i class="fas fa-credit-card"></i>
                                    مدى
                                </label>
                            </div>
                            <div class="payment-option">
                                <input type="radio" id="cashOnDelivery" name="paymentMethod" value="cash_on_delivery">
                                <label for="cashOnDelivery">
                                    <i class="fas fa-money-bill-wave"></i>
                                    الدفع عند الاستلام
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <!-- تفاصيل الدفع -->
                    <div class="payment-details" id="paymentDetails">
                        <h6 class="text-secondary">🔐 تفاصيل الدفع</h6>
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" placeholder="اسم حامل البطاقة" id="cardName">
                        </div>
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" placeholder="رقم البطاقة" id="cardNumber" maxlength="16">
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <input type="text" class="form-control" placeholder="MM/YY" id="cardExpiry">
                            </div>
                            <div class="col-6">
                                <input type="text" class="form-control" placeholder="CVV" id="cardCvv" maxlength="3">
                            </div>
                        </div>
                    </div>
                    
                    <button class="checkout-btn w-100 mt-4" id="confirmOrder">
                        <i class="fas fa-lock"></i> تأكيد الدفع والشراء
                    </button>
                </div>
            </div>
        `;

        // إزالة أي modal موجود مسبقاً
        const existingModal = document.getElementById('checkoutModal');
        if (existingModal) existingModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', checkoutHTML);
        
        const modal = document.getElementById('checkoutModal');
        const closeBtn = document.getElementById('checkoutClose');
        const confirmBtn = document.getElementById('confirmOrder');
        
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
        
        // إضافة أنماط إضافية للدفع
        this.addPaymentStyles();
        
        // إعداد أحداث طرق الدفع
        this.setupPaymentMethods();
        
        closeBtn.onclick = () => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        };
        
        confirmBtn.onclick = () => {
            this.processPayment();
        };
        
        modal.onclick = (e) => {
            if (e.target.id === 'checkoutModal') {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.remove();
                }, 300);
            }
        };
    }

    setupPaymentMethods() {
        const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
        const paymentDetails = document.getElementById('paymentDetails');
        
        paymentMethods.forEach(method => {
            method.addEventListener('change', (e) => {
                if (e.target.value === 'cash_on_delivery') {
                    paymentDetails.style.display = 'none';
                } else {
                    paymentDetails.style.display = 'block';
                }
            });
        });
    }

    processPayment() {
        const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
        
        if (!selectedPayment) {
            this.showStoreNotification('يرجى اختيار طريقة الدفع', 'error');
            return;
        }

        if (selectedPayment.value !== 'cash_on_delivery') {
            const cardName = document.getElementById('cardName').value;
            const cardNumber = document.getElementById('cardNumber').value;
            const cardExpiry = document.getElementById('cardExpiry').value;
            const cardCvv = document.getElementById('cardCvv').value;
            
            if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
                this.showStoreNotification('يرجى ملء جميع تفاصيل البطاقة', 'error');
                return;
            }
            
            if (cardNumber.length !== 16) {
                this.showStoreNotification('رقم البطاقة يجب أن يكون 16 رقم', 'error');
                return;
            }
            
            if (cardCvv.length !== 3) {
                this.showStoreNotification('رقم CVV يجب أن يكون 3 أرقام', 'error');
                return;
            }
        }
        
        // إذا كانت جميع البيانات صحيحة، اكمال الطلب
        this.completeOrder(selectedPayment.value);
    }

    completeOrder(paymentMethod) {
        console.log('✅ بدء اتمام الطلب...');
        
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.15;
        const shipping = subtotal >= 300 ? 0 : 25;
        const total = subtotal + tax + shipping;

        // إنشاء رقم طلب فريد
        const orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();

        const orderData = {
            order_number: orderNumber,
            items: [...this.cart],
            subtotal: subtotal,
            tax: tax,
            shipping: shipping,
            total: total,
            user_id: userData.id,
            user_name: userData.full_name,
            user_email: userData.email,
            user_phone: userData.phone,
            user_address: userData.address,
            payment_method: paymentMethod,
            status: 'confirmed',
            created_at: new Date().toISOString()
        };
        
        console.log('📦 بيانات الطلب:', orderData);
        
        if (this.demoMode) {
            // حفظ الطلب في الوضع المحلي
            const orders = JSON.parse(localStorage.getItem('user_orders') || '[]');
            orders.push(orderData);
            localStorage.setItem('user_orders', JSON.stringify(orders));
            
            // تحديث إحصائيات المستخدم
            const users = JSON.parse(localStorage.getItem('demo_users') || '{}');
            const currentUser = users[userData.email];
            if (currentUser) {
                currentUser.total_orders = (currentUser.total_orders || 0) + 1;
                currentUser.total_spent = (currentUser.total_spent || 0) + total;
                users[userData.email] = currentUser;
                localStorage.setItem('demo_users', JSON.stringify(users));
                
                // تحديث بيانات المستخدم في localStorage
                userData.total_orders = currentUser.total_orders;
                userData.total_spent = currentUser.total_spent;
                localStorage.setItem('userData', JSON.stringify(userData));
            }
        } else {
            // في الوضع العادي، إرسال الطلب إلى الخادم
            this.sendOrderToServer(orderData);
            return;
        }
        
        // إغلاق modal الدفع
        const checkoutModal = document.getElementById('checkoutModal');
        if (checkoutModal) {
            checkoutModal.classList.remove('active');
            setTimeout(() => {
                checkoutModal.remove();
            }, 300);
        }
        
        // عرض صفحة تأكيد الطلب
        this.showOrderConfirmation(orderData);
    }

    showOrderConfirmation(orderData) {
        const confirmationHTML = `
            <div class="order-confirmation-modal" id="orderConfirmationModal">
                <div class="order-confirmation-content">
                    <!-- زر الإغلاق -->
                    <button class="order-close-btn" id="orderCloseBtn">
                        <i class="fas fa-times"></i>
                    </button>
                    
                    <div class="order-success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    
                    <h2 class="text-success" style="font-size: 20px; margin-bottom: 15px;">🎉 تم تأكيد طلبك بنجاح!</h2>
                    
                    <div class="order-number" style="font-size: 18px; padding: 12px 20px; margin: 15px 0;">
                        ${orderData.order_number}
                    </div>
                    
                    <p class="thank-you-message" style="font-size: 14px; margin: 15px 0; line-height: 1.5;">
                        شكراً لك على ثقتك بنا! تم استلام طلبك بنجاح وسيتم تجهيزه في أقرب وقت ممكن.
                    </p>
                    
                    <div class="order-details" style="padding: 15px; margin: 15px 0;">
                        <h5 class="text-secondary mb-3" style="font-size: 16px;">📋 تفاصيل الطلب</h5>
                        
                        <div class="order-detail-item" style="padding: 8px 0; font-size: 13px;">
                            <span class="order-detail-label" style="font-weight: bold;">اسم العميل:</span>
                            <span class="order-detail-value">${orderData.user_name}</span>
                        </div>
                        
                        <div class="order-detail-item" style="padding: 8px 0; font-size: 13px;">
                            <span class="order-detail-label" style="font-weight: bold;">البريد الإلكتروني:</span>
                            <span class="order-detail-value">${orderData.user_email}</span>
                        </div>
                        
                        <div class="order-detail-item" style="padding: 8px 0; font-size: 13px;">
                            <span class="order-detail-label" style="font-weight: bold;">رقم الهاتف:</span>
                            <span class="order-detail-value">${orderData.user_phone || 'غير محدد'}</span>
                        </div>
                        
                        <div class="order-detail-item" style="padding: 8px 0; font-size: 13px;">
                            <span class="order-detail-label" style="font-weight: bold;">عنوان التوصيل:</span>
                            <span class="order-detail-value">${orderData.user_address || 'غير محدد'}</span>
                        </div>
                        
                        <div class="order-detail-item" style="padding: 8px 0; font-size: 13px;">
                            <span class="order-detail-label" style="font-weight: bold;">طريقة الدفع:</span>
                            <span class="order-detail-value">
                                ${this.getPaymentMethodText(orderData.payment_method)}
                            </span>
                        </div>
                        
                        <div class="order-detail-item" style="padding: 8px 0; font-size: 13px;">
                            <span class="order-detail-label" style="font-weight: bold;">المجموع:</span>
                            <span class="order-detail-value">${orderData.subtotal.toFixed(2)} SAR</span>
                        </div>
                        
                        <div class="order-detail-item" style="padding: 8px 0; font-size: 13px;">
                            <span class="order-detail-label" style="font-weight: bold;">الضريبة:</span>
                            <span class="order-detail-value">${orderData.tax.toFixed(2)} SAR</span>
                        </div>
                        
                        <div class="order-detail-item" style="padding: 8px 0; font-size: 13px;">
                            <span class="order-detail-label" style="font-weight: bold;">الشحن:</span>
                            <span class="order-detail-value">${orderData.shipping.toFixed(2)} SAR</span>
                        </div>
                        
                        <div class="order-detail-item" style="border-top: 2px solid var(--primary-color); padding-top: 12px; margin-top: 12px; font-size: 14px;">
                            <span class="order-detail-label" style="color: var(--primary-color); font-weight: bold;">الإجمالي النهائي:</span>
                            <span class="order-detail-value" style="color: var(--primary-color); font-weight: bold;">
                                ${orderData.total.toFixed(2)} SAR
                            </span>
                        </div>
                    </div>
                    
                    <div class="confirmation-actions">
                        <button class="continue-shopping-btn" id="continueShopping" style="padding: 10px 20px; font-size: 14px;">
                            <i class="fas fa-shopping-bag"></i> مواصلة التسوق
                        </button>
                    </div>
                    
                    <div class="mt-3">
                        <small class="text-muted" style="font-size: 11px;">
                            <i class="fas fa-envelope"></i>
                            سيتم إرسال تفاصيل الطلب إلى بريدك الإلكتروني: ${orderData.user_email}
                        </small>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', confirmationHTML);
        
        const modal = document.getElementById('orderConfirmationModal');
        const continueBtn = document.getElementById('continueShopping');
        const orderCloseBtn = document.getElementById('orderCloseBtn');
        
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
        
        // تحديث الأنماط لتكون أصغر
        this.addCompactOrderConfirmationStyles();
        
        continueBtn.onclick = () => {
            this.closeOrderConfirmation(modal);
        };
        
        orderCloseBtn.onclick = () => {
            this.closeOrderConfirmation(modal);
        };
        
        modal.onclick = (e) => {
            if (e.target.id === 'orderConfirmationModal') {
                this.closeOrderConfirmation(modal);
            }
        };
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                this.closeOrderConfirmation(modal);
            }
        });
    }

    // دالة مساعدة لإغلاق صفحة تأكيد الطلب
    closeOrderConfirmation(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            // تفريغ السلة بعد اتمام الطلب
            this.clearCartAfterOrder();
        }, 300);
    }

    addCompactOrderConfirmationStyles() {
        if (document.querySelector('#compact-order-styles')) return;

        const styles = `
            .order-confirmation-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                z-index: 10000;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
                padding: 20px;
            }
            
            .order-confirmation-modal.active {
                opacity: 1;
            }
            
            .order-confirmation-content {
                background: white;
                padding: 25px 20px;
                border-radius: 15px;
                width: 100%;
                max-width: 450px;
                position: relative;
                box-shadow: 0 15px 40px rgba(0,0,0,0.3);
                text-align: center;
                transform: scale(0.9) translateY(20px);
                transition: all 0.4s ease;
                border: 2px solid var(--primary-color);
                max-height: 85vh;
                overflow-y: auto;
            }
            
            .order-confirmation-modal.active .order-confirmation-content {
                transform: scale(1) translateY(0);
            }
            
            .order-success-icon {
                font-size: 60px;
                color: var(--success-color);
                margin-bottom: 15px;
                animation: bounce 2s infinite;
            }
            
            .order-close-btn {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 16px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                z-index: 1;
            }
            
            .order-close-btn:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .continue-shopping-btn {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                color: white;
                border: none;
                border-radius: 20px;
                padding: 10px 20px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
                margin: 0 auto;
            }
            
            .continue-shopping-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 5px 15px rgba(162, 0, 135, 0.4);
            }
            
            .order-details {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 10px;
                margin: 15px 0;
                text-align: right;
                max-height: 200px;
                overflow-y: auto;
            }
            
            .order-detail-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                padding-bottom: 8px;
                border-bottom: 1px solid #e0e0e0;
                font-size: 13px;
            }
            
            .order-detail-item:last-child {
                border-bottom: none;
                margin-bottom: 0;
                padding-bottom: 0;
            }
            
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% {
                    transform: translateY(0);
                }
                40% {
                    transform: translateY(-8px);
                }
                60% {
                    transform: translateY(-4px);
                }
            }
            
            /* تحسينات إضافية للشاشات الصغيرة جداً */
            @media (max-width: 480px) {
                .order-confirmation-content {
                    padding: 20px 15px;
                    margin: 10px;
                }
                
                .order-success-icon {
                    font-size: 50px;
                }
                
                .order-number {
                    font-size: 16px !important;
                    padding: 10px 15px !important;
                }
                
                h2.text-success {
                    font-size: 18px !important;
                }
                
                .order-details {
                    padding: 12px;
                    max-height: 180px;
                }
                
                .order-detail-item {
                    font-size: 12px;
                    padding: 6px 0;
                }
                
                .continue-shopping-btn {
                    width: 100%;
                    justify-content: center;
                }
            }
            
            @media (max-width: 360px) {
                .order-confirmation-content {
                    padding: 15px 10px;
                }
                
                .order-detail-item {
                    flex-direction: column;
                    text-align: center;
                    gap: 2px;
                }
                
                .order-detail-label, .order-detail-value {
                    width: 100%;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'compact-order-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    getPaymentMethodText(method) {
        const methods = {
            'credit_card': 'البطاقة الائتمانية',
            'apple_pay': 'Apple Pay',
            'mada': 'مدى',
            'cash_on_delivery': 'الدفع عند الاستلام'
        };
        return methods[method] || method;
    }

    clearCartAfterOrder() {
        console.log('🗑️ تفريغ السلة بعد الطلب...');
        
        // تفريغ السلة
        this.cart = [];
        
        // تحديث واجهة المستخدم
        this.updateCart();
        
        // تنظيف التخزين المحلي
        localStorage.removeItem('user_cart');
        
        // إغلاق السلة
        this.closeCart();
        
        console.log('✅ تم تفريغ السلة بنجاح');
    }

    // دالة جديدة لإرسال الطلب إلى الخادم
    async sendOrderToServer(orderData) {
        try {
            const response = await fetch('auth.php?action=create_order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // إغلاق modal الدفع
                const checkoutModal = document.getElementById('checkoutModal');
                if (checkoutModal) {
                    checkoutModal.classList.remove('active');
                    setTimeout(() => {
                        checkoutModal.remove();
                    }, 300);
                }
                
                // عرض تأكيد الطلب
                this.showOrderConfirmation(orderData);
            } else {
                this.showStoreNotification('❌ فشل في تأكيد الطلب، يرجى المحاولة مرة أخرى', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في إرسال الطلب:', error);
            this.showStoreNotification('❌ خطأ في الشبكة، جاري الحفظ محلياً', 'error');
            
            // الحفظ محلياً كنسخة احتياطية
            const orders = JSON.parse(localStorage.getItem('user_orders') || '[]');
            orders.push(orderData);
            localStorage.setItem('user_orders', JSON.stringify(orders));
            
            // عرض تأكيد الطلب
            this.showOrderConfirmation(orderData);
        }
    }

    addPaymentStyles() {
        const styles = `
            .user-info-section {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 10px;
                margin-bottom: 20px;
            }
            
            .user-details-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 10px;
                margin-top: 10px;
            }
            
            .user-detail-item {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #e0e0e0;
            }
            
            .user-detail-item:last-child {
                border-bottom: none;
            }
            
            .payment-options {
                display: grid;
                grid-template-columns: 1fr;
                gap: 10px;
                margin-top: 10px;
            }
            
            .payment-option {
                display: flex;
                align-items: center;
                padding: 12px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .payment-option:hover {
                border-color: var(--primary-color);
                background: #f8f9fa;
            }
            
            .payment-option input[type="radio"] {
                margin-left: 10px;
            }
            
            .payment-option label {
                display: flex;
                align-items: center;
                gap: 10px;
                cursor: pointer;
                margin: 0;
                flex: 1;
            }
            
            .payment-option i {
                font-size: 20px;
                color: var(--primary-color);
            }
            
            .payment-details {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 10px;
                margin-top: 15px;
            }
            
            .form-control {
                width: 100%;
                padding: 12px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
            }
            
            .form-control:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    showStoreNotification(message, type = 'success') {
        const existingNotifications = document.querySelectorAll('.store-notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `store-notification ${type === 'error' ? 'error' : type === 'info' ? 'info' : ''}`;
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} me-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 4000);
    }

    createCheckoutPage() {
        console.log('✅ تم تهيئة نظام الدفع');
    }

    // الأنماط الإضافية
    addAuthModalStyles() {
        if (document.querySelector('#auth-styles')) return;

        const styles = `
            .auth-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .auth-modal.active {
                opacity: 1;
            }
            
            .auth-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 450px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            
            .auth-modal.active .auth-content {
                transform: scale(1);
            }
            
            .auth-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .auth-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .demo-notice {
                background: var(--info-color);
                color: white;
                padding: 10px;
                border-radius: 8px;
                margin-bottom: 15px;
                text-align: center;
                font-size: 14px;
                font-weight: bold;
            }
            
            .auth-form {
                display: none;
            }
            
            .auth-form.active {
                display: block;
            }
            
            .auth-form h3 {
                text-align: center;
                margin-bottom: 25px;
                color: var(--primary-color);
                font-size: 24px;
                font-weight: bold;
            }
            
            .input-group {
                margin-bottom: 15px;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .password-hint {
                color: #666;
                display: block;
                margin-top: 5px;
                font-size: 12px;
            }
            
            .auth-btn {
                width: 100%;
                padding: 15px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: all 0.3s ease;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .auth-btn:hover:not(:disabled) {
                background: var(--secondary-color);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(162, 0, 135, 0.3);
            }
            
            .auth-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }
            
            .auth-switch {
                text-align: center;
                margin-top: 25px;
                color: var(--dark-color);
                font-size: 14px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
            }
            
            .switch-link {
                color: var(--primary-color);
                cursor: pointer;
                font-weight: bold;
                transition: color 0.3s ease;
            }
            
            .switch-link:hover {
                color: var(--secondary-color);
                text-decoration: underline;
            }

            .user-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                padding: 0;
                min-width: 280px;
                z-index: 1000;
                margin-top: 8px;
                border: 2px solid var(--primary-color);
                overflow: hidden;
                display: none;
            }
            
            .user-header {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                padding: 20px;
                color: white;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .user-avatar {
                font-size: 40px;
                opacity: 0.9;
            }
            
            .user-details {
                flex: 1;
            }
            
            .user-details strong {
                display: block;
                font-size: 16px;
                margin-bottom: 4px;
            }
            
            .user-details small {
                font-size: 12px;
                opacity: 0.8;
            }
            
            .menu-section {
                padding: 15px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .menu-items {
                padding: 0;
            }
            
            .user-menu-item {
                display: flex;
                align-items: center;
                padding: 12px 20px;
                color: #333;
                text-decoration: none;
                border: none;
                background: none;
                width: 100%;
                text-align: right;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
                gap: 12px;
                position: relative;
                border-bottom: 1px solid #f8f8f8;
            }
            
            .user-menu-item:last-child {
                border-bottom: none;
            }
            
            .user-menu-item i {
                width: 20px;
                text-align: center;
                color: var(--primary-color);
                font-size: 16px;
            }
            
            .user-menu-item:hover {
                background: var(--light-color);
                transform: translateX(-5px);
            }
            
            .user-menu-item:hover i {
                color: var(--secondary-color);
            }
            
            .logout-btn {
                color: var(--danger-color);
                font-weight: bold;
                margin-top: 0;
            }
            
            .logout-btn i {
                color: var(--danger-color);
            }
            
            .logout-btn:hover {
                background: #ffe6e6;
            }

            .system-message {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 15px 25px;
                border-radius: 8px;
                color: white;
                z-index: 10001;
                font-weight: bold;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                animation: slideDown 0.3s ease;
            }
            
            .system-message.success {
                background: var(--success-color);
            }
            
            .system-message.error {
                background: var(--danger-color);
            }
            
            .system-message.info {
                background: var(--info-color);
            }
            
            @keyframes slideDown {
                from {
                    transform: translateX(-50%) translateY(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'auth-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    addProfileModalStyles() {
        if (document.querySelector('#profile-styles')) return;

        const styles = `
            .profile-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .profile-modal.active {
                opacity: 1;
            }
            
            .profile-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 700px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            
            .profile-modal.active .profile-content {
                transform: scale(1);
            }
            
            .profile-close {
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary-color);
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .profile-close:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .profile-header {
                display: flex;
                align-items: center;
                gap: 20px;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #f0f0f0;
            }
            
            .profile-avatar {
                font-size: 60px;
                color: var(--primary-color);
            }
            
            .profile-info h3 {
                margin: 0 0 5px 0;
                color: var(--primary-color);
            }
            
            .profile-info p {
                margin: 0 0 10px 0;
                color: #666;
            }
            
            .user-stats {
                display: flex;
                gap: 15px;
                margin-top: 10px;
            }
            
            .stat-item {
                display: flex;
                align-items: center;
                gap: 5px;
                background: var(--light-color);
                padding: 5px 10px;
                border-radius: 8px;
                font-size: 12px;
                color: var(--dark-color);
            }
            
            .stat-item i {
                color: var(--primary-color);
            }
            
            .profile-body {
                margin-top: 20px;
            }
            
            .form-section {
                margin-bottom: 30px;
                padding: 20px;
                border: 1px solid #e0e0e0;
                border-radius: 10px;
                background: #fafafa;
            }
            
            .form-section h4 {
                margin: 0 0 20px 0;
                color: var(--primary-color);
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .input-row {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
            }
            
            .input-row .input-group {
                flex: 1;
            }
            
            .input-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #333;
            }
            
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
                resize: vertical;
            }
            
            .input-group input:focus, .input-group textarea:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
            }
            
            .input-group input[readonly] {
                background-color: #f8f9fa;
                color: #666;
                cursor: not-allowed;
            }
            
            .text-muted {
                color: #666;
                font-size: 12px;
                display: block;
                margin-top: 5px;
            }
            
            .profile-actions {
                display: flex;
                gap: 15px;
                margin-top: 30px;
            }
            
            .profile-actions .auth-btn {
                flex: 1;
                margin-bottom: 0;
            }
            
            .auth-secondary {
                background: #6c757d !important;
            }
            
            .auth-secondary:hover {
                background: #5a6268 !important;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'profile-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    addComingSoonStyles() {
        if (document.querySelector('#coming-soon-styles')) return;

        const styles = `
            .coming-soon-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                z-index: 10000;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .coming-soon-modal.active {
                opacity: 1;
            }
            
            .coming-soon-content {
                background: white;
                padding: 40px 30px;
                border-radius: 20px;
                width: 90%;
                max-width: 500px;
                position: relative;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                text-align: center;
                transform: scale(0.9) translateY(20px);
                transition: all 0.4s ease;
                border: 3px solid var(--primary-color);
            }
            
            .coming-soon-modal.active .coming-soon-content {
                transform: scale(1) translateY(0);
            }
            
            .coming-soon-icon {
                font-size: 80px;
                color: var(--primary-color);
                margin-bottom: 20px;
                animation: bounce 2s infinite;
            }
            
            .coming-soon-content h3 {
                color: var(--primary-color);
                margin-bottom: 20px;
                font-size: 28px;
                font-weight: bold;
            }
            
            .coming-soon-text {
                color: #666;
                line-height: 1.6;
                margin-bottom: 30px;
                font-size: 16px;
            }
            
            .coming-soon-features {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-bottom: 30px;
                text-align: right;
            }
            
            .feature-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px;
                background: #f8f9fa;
                border-radius: 10px;
                transition: all 0.3s ease;
            }
            
            .feature-item:hover {
                background: var(--light-color);
                transform: translateX(-5px);
            }
            
            .feature-item i {
                color: var(--primary-color);
                font-size: 16px;
                width: 20px;
            }
            
            .feature-item span {
                color: #333;
                font-size: 14px;
                font-weight: 500;
            }
            
            .coming-soon-actions {
                margin-bottom: 20px;
            }
            
            .coming-soon-footer {
                border-top: 1px solid #eee;
                padding-top: 20px;
            }
            
            .coming-soon-footer a {
                color: var(--primary-color);
                text-decoration: none;
            }
            
            .coming-soon-footer a:hover {
                text-decoration: underline;
            }
            
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% {
                    transform: translateY(0);
                }
                40% {
                    transform: translateY(-10px);
                }
                60% {
                    transform: translateY(-5px);
                }
            }
            
            /* تحسين التصميم للشاشات الصغيرة */
            @media (max-width: 576px) {
                .coming-soon-content {
                    padding: 30px 20px;
                    margin: 20px;
                }
                
                .coming-soon-features {
                    grid-template-columns: 1fr;
                }
                
                .coming-soon-icon {
                    font-size: 60px;
                }
                
                .coming-soon-content h3 {
                    font-size: 24px;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.id = 'coming-soon-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// إذا كنا في بيئة المتصفح، قم بتهيئة النظام
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        window.authSystem = new AuthSystem();
    });
    console.log('🚀 نظام AuthSystem جاهز للاستخدام!');
}

// إذا كنا في بيئة Node.js، قم بتصدير الكلاس
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthSystem;
}