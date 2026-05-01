/*
// إنشاء نافذة البحث
function createSearchModal() {
    // إذا كانت النافذة موجودة مسبقاً، لا تنشئها مرة أخرى
    if (document.getElementById('search-modal')) {
        return;
    }
    
    const searchModal = document.createElement('div');
    searchModal.className = 'search-modal';
    searchModal.id = 'search-modal';
    searchModal.innerHTML = `
        <div class="search-modal-content">
            <div class="search-modal-header">
                <h3><i class="fas fa-search me-2"></i>ابحث عن العطور</h3>
                <button class="search-close-btn" id="search-modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="search-modal-body">
                <div class="search-input-group">
                    <input type="text" 
                           class="search-input" 
                           id="search-modal-input"
                           placeholder="اكتب اسم العطر أو وصفه...">
                    <button class="search-icon-btn" id="search-modal-button">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <div class="search-results" id="search-modal-results">
                    <div class="no-results">
                        <i class="fas fa-search"></i>
                        <p>اكتب في مربع البحث للعثور على العطور</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(searchModal);
    
    // إضافة CSS المطلوب
    addSearchModalStyles();
    
    console.log('✅ نافذة البحث تم إنشاؤها بنجاح');
}

// إضافة أنماط CSS ديناميكياً
function addSearchModalStyles() {
    if (document.getElementById('search-modal-styles')) {
        return;
    }
    
    const styles = `
        .search-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: none;
            justify-content: center;
            align-items: flex-start;
            z-index: 10000;
            padding: 20px;
            overflow-y: auto;
            backdrop-filter: blur(5px);
        }
        
        .search-modal.active {
            display: flex;
        }
        
        .search-modal-content {
            background: white;
            width: 100%;
            max-width: 900px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            animation: modalSlideIn 0.3s ease-out;
            margin-top: 50px;
        }
        
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .search-modal-header {
            background: linear-gradient(135deg, #ea70b1, #a20087);
            color: white;
            padding: 20px 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .search-modal-header h3 {
            margin: 0;
            font-weight: 600;
            font-size: 1.4rem;
        }
        
        .search-close-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .search-close-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: rotate(90deg);
        }
        
        .search-modal-body {
            padding: 25px;
        }
        
        .search-input-group {
            position: relative;
            display: flex;
            margin-bottom: 25px;
            border-radius: 50px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }
        
        .search-input {
            flex: 1;
            padding: 15px 25px;
            border: none;
            background: #f8f9fa;
            font-size: 1.1rem;
            outline: none;
            transition: all 0.3s ease;
        }
        
        .search-input:focus {
            background: white;
            box-shadow: inset 0 0 0 2px #a20087;
        }
        
        .search-icon-btn {
            background: #ea70b1;
            color: white;
            border: none;
            padding: 0 25px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .search-icon-btn:hover {
            background: #a20087;
        }
        
        .search-results {
            max-height: 500px;
            overflow-y: auto;
            border-radius: 10px;
            background: #f8f9fa;
            padding: 15px;
        }
        
        .no-results {
            text-align: center;
            padding: 40px 20px;
            color: #777;
        }
        
        .no-results i {
            font-size: 3rem;
            margin-bottom: 15px;
            color: #ccc;
        }
        
        /* تصميم بطاقات المنتجات */
      /*  .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 15px;
        }
        
        .product-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            cursor: pointer;
            border: 1px solid #f0f0f0;
        }
        
        .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(234, 112, 177, 0.15);
            border-color: #ea70b1;
        }
        
        .product-image {
            width: 100%;
            height: 180px;
            object-fit: cover;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .product-info {
            padding: 15px;
        }
        
        .product-name {
            font-weight: 600;
            font-size: 1.1rem;
            margin-bottom: 8px;
            color: #a20087;
            line-height: 1.3;
        }
        
        .product-price {
            font-weight: 700;
            color: #000000ff;
            margin-bottom: 10px;
            font-size: 1.2rem;
        }
        
        .product-description {
            color: #666;
            font-size: 0.85rem;
            margin-bottom: 15px;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        .product-actions {
            display: flex;
        }
        
        .btn-add-cart {
            width: 100%;
            background: #ea70b1;
            color: white;
            border: none;
            padding: 12px 15px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .btn-add-cart:hover {
            background: #a20087;
            transform: translateY(-2px);
        }
        
        .search-results-header {
            color: #a20087;
            font-weight: 600;
            font-size: 1.1rem;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #ea70b1;
        }
        
        .search-results::-webkit-scrollbar {
            width: 6px;
        }
        
        .search-results::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        
        .search-results::-webkit-scrollbar-thumb {
            background: #ea70b1;
            border-radius: 10px;
        }
        
        .search-results::-webkit-scrollbar-thumb:hover {
            background: #a20087;
        }
        
        .search-loading {
            text-align: center;
            padding: 40px 20px;
            color: #777;
        }
        
        .search-loading i {
            font-size: 2rem;
            margin-bottom: 15px;
            color: #ea70b1;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
            .search-modal {
                padding: 10px;
            }
            
            .search-modal-content {
                margin-top: 20px;
                max-width: 95%;
            }
            
            .search-modal-header {
                padding: 15px 20px;
            }
            
            .search-modal-body {
                padding: 20px;
            }
            
            .search-input {
                padding: 12px 20px;
                font-size: 1rem;
            }
            
            .products-grid {
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 15px;
            }
            
            .product-image {
                height: 150px;
            }
        }
        
        @media (max-width: 480px) {
            .products-grid {
                grid-template-columns: 1fr;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.id = 'search-modal-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// فتح نافذة البحث
function openSearchModal() {
    console.log('🔍 محاولة فتح نافذة البحث...');
    
    // تأكد من إنشاء النافذة أولاً
    createSearchModal();
    
    const searchModal = document.getElementById('search-modal');
    if (searchModal) {
        searchModal.classList.add('active');
        document.getElementById('search-modal-input').focus();
        
        // منع التمرير خلف النافذة
        document.body.style.overflow = 'hidden';
        console.log('✅ نافذة البحث مفتوحة بنجاح');
    } else {
        console.error('❌ نافذة البحث غير موجودة');
    }
}

// إغلاق نافذة البحث
function closeSearchModal() {
    const searchModal = document.getElementById('search-modal');
    if (searchModal) {
        searchModal.classList.remove('active');
        
        // إعادة التمرير
        document.body.style.overflow = '';
        console.log('✅ نافذة البحث مغلقة');
    }
}

// بيانات المنتجات (سيتم جلبها من قاعدة البيانات)
let searchProducts = [];

// دالة لجلب المنتجات من قاعدة البيانات
async function fetchProducts() {
    try {
        const response = await fetch('products.php');
        const data = await response.json();
        
        if (data.success) {
            searchProducts = data.products;
            console.log('✅ تم جلب بيانات المنتجات بنجاح:', searchProducts.length, 'منتج');
        } else {
            console.error('❌ خطأ في جلب بيانات المنتجات:', data.message);
            // استخدام بيانات افتراضية في حالة الخطأ
            searchProducts = getDefaultProducts();
        }
    } catch (error) {
        console.error('❌ خطأ في الاتصال:', error);
        // استخدام بيانات افتراضية في حالة الخطأ
        searchProducts = getDefaultProducts();
    }
}

// بيانات افتراضية للطوارئ
function getDefaultProducts() {
    return [
        {
            id: "1",
            name: "Rose Éclat",
            price: "180",
            image: "images/pert.jpg",
            description: "عطر نسائي برائحة الورد الفرنسي الفاخر مع لمسات من الفانيليا والمسك الأبيض"
        },
        {
            id: "2",
            name: "Violet Lavender",
            price: "199",
            image: "images/uuuuu.jpg",
            description: "هذا العطر يتميز بنفحات من زهرة البنفسج واللافندر، مما يخلق توليفة زهرية ناعمة وأنيقة"
        },
        {
            id: "3",
            name: "Larmes de Rose",
            price: "250",
            image: "images/Gold.jpg",
            description: "عطر أنثوي راقٍ تنبعث منه نفحات ناعمة من زهرة الماغنوليا واللوتس، ممزوجة بعبير الورد التركي"
        },
        {
            id: "4",
            name: "Lumière Blanche",
            price: "130",
            image: "images/www.jpg",
            description: "عطر يشبه لحظة صباحية ناعمة، حين يلامس الضوء بشرتك برقة وهدوء"
        },
        {
            id: "5",
            name: "Or Lumi",
            price: "300",
            image: "images/yallow.jpg",
            description: "عطر يفتتح بنفحات من اليوسفي واللافندر، منعشة ومحايدة"
        },
        {
            id: "6",
            name: "Azure Drift",
            price: "180",
            image: "images/Blue Perfume.jpg",
            description: "هذا العطر ينبض بالحياة والحيوية من البرغموت الإيطالي والنعناع الأزرق، ليمنح إحساسًا منعشًا"
        }
    ];
}

// البحث في المنتجات (من قاعدة البيانات مباشرة)
async function performSearch(searchTerm) {
    const resultsContainer = document.getElementById('search-modal-results');
    
    if (!resultsContainer) {
        console.error('❌ حاوية نتائج البحث غير موجودة');
        return;
    }
    
    if (!searchTerm.trim()) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>اكتب في مربع البحث للعثور على العطور</p>
            </div>
        `;
        return;
    }
    
    // عرض حالة التحميل
    resultsContainer.innerHTML = `
        <div class="search-loading">
            <i class="fas fa-spinner"></i>
            <p>جاري البحث عن "${searchTerm}"...</p>
        </div>
    `;
    
    try {
        // البحث من قاعدة البيانات مباشرة
        const response = await fetch(`search.php?q=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        
        let filteredProducts = [];
        if (data.success) {
            filteredProducts = data.products;
            console.log('🔍 نتائج البحث من قاعدة البيانات:', filteredProducts.length, 'منتج');
        } else {
            console.error('❌ خطأ في البحث من قاعدة البيانات:', data.message);
            // البحث محلياً في حالة الخطأ
            filteredProducts = searchProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // عرض النتائج
        displaySearchResults(filteredProducts, searchTerm, resultsContainer);
        
    } catch (error) {
        console.error('❌ خطأ في الاتصال بالخادم:', error);
        // البحث محلياً في حالة الخطأ
        const filteredProducts = searchProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        displaySearchResults(filteredProducts, searchTerm, resultsContainer);
    }
}

// دالة لعرض نتائج البحث
function displaySearchResults(filteredProducts, searchTerm, resultsContainer) {
    if (filteredProducts.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-times-circle"></i>
                <p>لم يتم العثور على منتجات تطابق "${searchTerm}"</p>
                <small>جرب كلمات بحث أخرى</small>
            </div>
        `;
    } else {
        let resultsHTML = `
            <div class="search-results-header">
                <i class="fas fa-search me-2"></i>
                نتائج البحث (${filteredProducts.length}) منتج
            </div>
            <div class="products-grid">
        `;
        
        filteredProducts.forEach(product => {
            resultsHTML += `
                <div class="product-card">
                    <img src="${product.image}" 
                         alt="${product.name}" 
                         class="product-image"
                         onerror="this.src='https://via.placeholder.com/300x200/f8f9fa/ea70b1?text=عطر'">
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <div class="product-price">${product.price} SAR</div>
                        <div class="product-description">${product.description}</div>
                        <div class="product-actions">
                            <button class="btn-add-cart" onclick="addToCartFromSearch('${product.id}')">
                                <i class="fas fa-cart-plus"></i>
                                إضافة إلى السلة
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        resultsHTML += `</div>`;
        resultsContainer.innerHTML = resultsHTML;
    }
}

// إضافة منتج من البحث إلى السلة
function addToCartFromSearch(productId) {
    let product;
    
    // البحث عن المنتج في البيانات المحلية أولاً
    product = searchProducts.find(p => p.id === productId);
    
    // إذا لم نجده محلياً، نبحث في نتائج البحث الحالية
    if (!product) {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const name = card.querySelector('.product-name').textContent;
            const price = card.querySelector('.product-price').textContent;
            const description = card.querySelector('.product-description').textContent;
            const image = card.querySelector('.product-image').src;
            
            // هذا افتراضي - قد تحتاج لتعديله حسب هيكل البيانات الفعلي
            if (card.querySelector('.btn-add-cart').getAttribute('onclick').includes(productId)) {
                product = {
                    id: productId,
                    name: name,
                    price: price.replace(' SAR', ''),
                    image: image,
                    description: description
                };
            }
        });
    }
    
    if (product) {
        // استخدام دالة addToCart من cart.js إذا كانت موجودة
        if (typeof addToCart === 'function') {
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        } else {
            // محاكاة إضافة المنتج للسلة
            console.log(`🛒 تمت إضافة ${product.name} إلى السلة`);
            showSearchNotification(`تم إضافة ${product.name} إلى السلة`);
        }
        
        // إغلاق نافذة البحث بعد الإضافة
        closeSearchModal();
        
    } else {
        console.error('❌ المنتج غير موجود:', productId);
        showSearchNotification('❌ حدث خطأ في إضافة المنتج', 'error');
    }
}

// إشعارات البحث
function showSearchNotification(message, type = 'success') {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `search-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // إضافة الأنماط إذا لم تكن موجودة
    if (!document.querySelector('.search-notification-style')) {
        const notificationStyles = `
            .search-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                z-index: 10001;
                border-left: 4px solid #28a745;
                animation: slideInRight 0.3s ease-out;
                max-width: 300px;
            }
            
            .search-notification.error {
                border-left-color: #dc3545;
            }
            
            .search-notification .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .search-notification .fa-check-circle {
                color: #28a745;
            }
            
            .search-notification .fa-exclamation-circle {
                color: #dc3545;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.className = 'search-notification-style';
        styleSheet.textContent = notificationStyles;
        document.head.appendChild(styleSheet);
    }
    
    // إضافة الإشعار إلى الصفحة
    document.body.appendChild(notification);
    
    // إزالة الإشعار بعد 3 ثوانٍ
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// إعداد أحداث البحث
function setupSearchEvents() {
    console.log('🔧 جاري إعداد أحداث البحث...');
    
    // زر فتح البحث - البحث عن أيقونة البحث في أي مكان في الصفحة
    const searchIcons = document.querySelectorAll('.fa-magnifying-glass, .fa-search');
    console.log(`🔍 تم العثور على ${searchIcons.length} أيقونة بحث`);
    
    searchIcons.forEach(icon => {
        const searchButton = icon.closest('.icon-btn') || icon.closest('button') || icon.closest('a') || icon.parentElement;
        if (searchButton) {
            searchButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎯 تم النقر على أيقونة البحث');
                openSearchModal();
            });
            console.log('✅ تم ربط حدث النقر بأيقونة البحث');
        }
    });
    
    // إذا لم توجد أيقونات بحث، أضف زر بحث يدوياً
    if (searchIcons.length === 0) {
        console.log('ℹ️ لم يتم العثور على أيقونات بحث، جاري إنشاء زر يدوي...');
        createManualSearchButton();
    }
    
    // زر إغلاق البحث
    const closeButton = document.getElementById('search-modal-close');
    if (closeButton) {
        closeButton.addEventListener('click', closeSearchModal);
        console.log('✅ تم ربط حدث إغلاق البحث');
    }
    
    // إغلاق بالنقر خارج النافذة
    const searchModal = document.getElementById('search-modal');
    if (searchModal) {
        searchModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeSearchModal();
            }
        });
    }
    
    // البحث عند الكتابة
    const searchInput = document.getElementById('search-modal-input');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(this.value);
            }, 300);
        });
        
        // البحث عند الضغط على Enter
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
        
        console.log('✅ تم ربط أحداث البحث');
    }
    
    // زر البحث
    const searchModalButton = document.getElementById('search-modal-button');
    if (searchModalButton) {
        searchModalButton.addEventListener('click', function() {
            const searchInput = document.getElementById('search-modal-input');
            performSearch(searchInput.value);
        });
    }
    
    // إغلاق بالضغط على Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSearchModal();
        }
    });
}

// إنشاء زر بحث يدوي إذا لم توجد أيقونات
function createManualSearchButton() {
    const searchButtonHTML = `
        <button class="icon-btn manual-search-btn" style="margin-left: 10px;">
            <i class="fas fa-search"></i>
        </button>
    `;
    
    // حاول إضافة الزر في الهيدر
    const header = document.querySelector('header');
    if (header) {
        header.insertAdjacentHTML('beforeend', searchButtonHTML);
        const manualBtn = document.querySelector('.manual-search-btn');
        manualBtn.addEventListener('click', openSearchModal);
        console.log('✅ تم إنشاء زر البحث اليدوي');
    }
}

// تهيئة البحث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 بدء تهيئة نظام البحث...');
    createSearchModal();
    setupSearchEvents();
    fetchProducts(); // جلب البيانات من قاعدة البيانات
    console.log('✅ نظام البحث مع بطاقات المنتجات جاهز للعمل - متصل بقاعدة البيانات');
});

// جعل الدوال متاحة عالمياً للاستخدام من قبل عناصر HTML
window.openSearchModal = openSearchModal;
window.closeSearchModal = closeSearchModal;
window.performSearch = performSearch;
window.addToCartFromSearch = addToCartFromSearch;

// دالة لاختبار النظام
function testSearchSystem() {
    console.log('🧪 اختبار نظام البحث...');
    openSearchModal();
}*/



// نظام البحث المتقدم - إصدار المتصفح فقط
(function() {
    'use strict';
    
    // تأكد أننا في بيئة المتصفح
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        console.log('⚠️ هذا الكود يعمل في المتصفح فقط');
        return;
    }

    // متغيرات النظام
    let searchProducts = [];
    let searchTimeout = null;

    // إنشاء نافذة البحث
    function createSearchModal() {
        if (document.getElementById('search-modal')) {
            return;
        }
        
        const searchModal = document.createElement('div');
        searchModal.className = 'search-modal';
        searchModal.id = 'search-modal';
        searchModal.innerHTML = `
            <div class="search-modal-content">
                <div class="search-modal-header">
                    <h3><i class="fas fa-search me-2"></i>ابحث عن العطور</h3>
                    <button class="search-close-btn" id="search-modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="search-modal-body">
                    <div class="search-input-group">
                        <input type="text" 
                               class="search-input" 
                               id="search-modal-input"
                               placeholder="اكتب اسم العطر أو وصفه...">
                        <button class="search-icon-btn" id="search-modal-button">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                    <div class="search-results" id="search-modal-results">
                        <div class="no-results">
                            <i class="fas fa-search"></i>
                            <p>اكتب في مربع البحث للعثور على العطور</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(searchModal);
        
        addSearchModalStyles();
        console.log('✅ نافذة البحث تم إنشاؤها بنجاح');
    }

    // إضافة أنماط CSS ديناميكياً
    function addSearchModalStyles() {
        if (document.getElementById('search-modal-styles')) {
            return;
        }
        
        const styles = `
            .search-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: none;
                justify-content: center;
                align-items: flex-start;
                z-index: 10000;
                padding: 20px;
                overflow-y: auto;
                backdrop-filter: blur(5px);
            }
            
            .search-modal.active {
                display: flex;
            }
            
            .search-modal-content {
                background: white;
                width: 100%;
                max-width: 900px;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                overflow: hidden;
                animation: modalSlideIn 0.3s ease-out;
                margin-top: 50px;
            }
            
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .search-modal-header {
                background: linear-gradient(135deg, #ea70b1, #a20087);
                color: white;
                padding: 20px 25px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .search-modal-header h3 {
                margin: 0;
                font-weight: 600;
                font-size: 1.4rem;
            }
            
            .search-close-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .search-close-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: rotate(90deg);
            }
            
            .search-modal-body {
                padding: 25px;
            }
            
            .search-input-group {
                position: relative;
                display: flex;
                margin-bottom: 25px;
                border-radius: 50px;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            }
            
            .search-input {
                flex: 1;
                padding: 15px 25px;
                border: none;
                background: #f8f9fa;
                font-size: 1.1rem;
                outline: none;
                transition: all 0.3s ease;
            }
            
            .search-input:focus {
                background: white;
                box-shadow: inset 0 0 0 2px #a20087;
            }
            
            .search-icon-btn {
                background: #ea70b1;
                color: white;
                border: none;
                padding: 0 25px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .search-icon-btn:hover {
                background: #a20087;
            }
            
            .search-results {
                max-height: 500px;
                overflow-y: auto;
                border-radius: 10px;
                background: #f8f9fa;
                padding: 15px;
            }
            
            .no-results {
                text-align: center;
                padding: 40px 20px;
                color: #777;
            }
            
            .no-results i {
                font-size: 3rem;
                margin-bottom: 15px;
                color: #ccc;
            }
            
            .products-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 20px;
                margin-top: 15px;
            }
            
            .product-card {
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
                transition: all 0.3s ease;
                cursor: pointer;
                border: 1px solid #f0f0f0;
            }
            
            .product-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(234, 112, 177, 0.15);
                border-color: #ea70b1;
            }
            
            .product-image {
                width: 100%;
                height: 180px;
                object-fit: cover;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .product-info {
                padding: 15px;
            }
            
            .product-name {
                font-weight: 600;
                font-size: 1.1rem;
                margin-bottom: 8px;
                color: #a20087;
                line-height: 1.3;
            }
            
            .product-price {
                font-weight: 700;
                color: #000000ff;
                margin-bottom: 10px;
                font-size: 1.2rem;
            }
            
            .product-description {
                color: #666;
                font-size: 0.85rem;
                margin-bottom: 15px;
                line-height: 1.4;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            
            .product-actions {
                display: flex;
            }
            
            .btn-add-cart {
                width: 100%;
                background: #ea70b1;
                color: white;
                border: none;
                padding: 12px 15px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .btn-add-cart:hover {
                background: #a20087;
                transform: translateY(-2px);
            }
            
            .search-results-header {
                color: #a20087;
                font-weight: 600;
                font-size: 1.1rem;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 2px solid #ea70b1;
            }
            
            .search-results::-webkit-scrollbar {
                width: 6px;
            }
            
            .search-results::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 10px;
            }
            
            .search-results::-webkit-scrollbar-thumb {
                background: #ea70b1;
                border-radius: 10px;
            }
            
            .search-results::-webkit-scrollbar-thumb:hover {
                background: #a20087;
            }
            
            .search-loading {
                text-align: center;
                padding: 40px 20px;
                color: #777;
            }
            
            .search-loading i {
                font-size: 2rem;
                margin-bottom: 15px;
                color: #ea70b1;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @media (max-width: 768px) {
                .search-modal {
                    padding: 10px;
                }
                
                .search-modal-content {
                    margin-top: 20px;
                    max-width: 95%;
                }
                
                .search-modal-header {
                    padding: 15px 20px;
                }
                
                .search-modal-body {
                    padding: 20px;
                }
                
                .search-input {
                    padding: 12px 20px;
                    font-size: 1rem;
                }
                
                .products-grid {
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 15px;
                }
                
                .product-image {
                    height: 150px;
                }
            }
            
            @media (max-width: 480px) {
                .products-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'search-modal-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // فتح نافذة البحث
    function openSearchModal() {
        console.log('🔍 محاولة فتح نافذة البحث...');
        
        createSearchModal();
        
        const searchModal = document.getElementById('search-modal');
        if (searchModal) {
            searchModal.classList.add('active');
            const searchInput = document.getElementById('search-modal-input');
            if (searchInput) {
                searchInput.focus();
            }
            
            document.body.style.overflow = 'hidden';
            console.log('✅ نافذة البحث مفتوحة بنجاح');
        } else {
            console.error('❌ نافذة البحث غير موجودة');
        }
    }

    // إغلاق نافذة البحث
    function closeSearchModal() {
        const searchModal = document.getElementById('search-modal');
        if (searchModal) {
            searchModal.classList.remove('active');
            document.body.style.overflow = '';
            console.log('✅ نافذة البحث مغلقة');
        }
    }

    // بيانات افتراضية للطوارئ
    function getDefaultProducts() {
        return [
            {
                id: "1",
                name: "Rose Éclat",
                price: "180",
                image: "images/pert.jpg",
                description: "عطر نسائي برائحة الورد الفرنسي الفاخر مع لمسات من الفانيليا والمسك الأبيض"
            },
            {
                id: "2",
                name: "Violet Lavender",
                price: "199",
                image: "images/uuuuu.jpg",
                description: "هذا العطر يتميز بنفحات من زهرة البنفسج واللافندر، مما يخلق توليفة زهرية ناعمة وأنيقة"
            },
            {
                id: "3",
                name: "Larmes de Rose",
                price: "250",
                image: "images/Gold.jpg",
                description: "عطر أنثوي راقٍ تنبعث منه نفحات ناعمة من زهرة الماغنوليا واللوتس، ممزوجة بعبير الورد التركي"
            },
            {
                id: "4",
                name: "Lumière Blanche",
                price: "130",
                image: "images/www.jpg",
                description: "عطر يشبه لحظة صباحية ناعمة، حين يلامس الضوء بشرتك برقة وهدوء"
            },
            {
                id: "5",
                name: "Or Lumi",
                price: "300",
                image: "images/yallow.jpg",
                description: "عطر يفتتح بنفحات من اليوسفي واللافندر، منعشة ومحايدة"
            },
            {
                id: "6",
                name: "Azure Drift",
                price: "180",
                image: "images/Blue Perfume.jpg",
                description: "هذا العطر ينبض بالحياة والحيوية من البرغموت الإيطالي والنعناع الأزرق، ليمنح إحساسًا منعشًا"
            }
        ];
    }

    // دالة لجلب المنتجات
    async function fetchProducts() {
        try {
            const response = await fetch('products.php');
            const data = await response.json();
            
            if (data.success) {
                searchProducts = data.products;
                console.log('✅ تم جلب بيانات المنتجات بنجاح:', searchProducts.length, 'منتج');
            } else {
                console.error('❌ خطأ في جلب بيانات المنتجات:', data.message);
                searchProducts = getDefaultProducts();
            }
        } catch (error) {
            console.error('❌ خطأ في الاتصال:', error);
            searchProducts = getDefaultProducts();
        }
    }

    // البحث في المنتجات
    async function performSearch(searchTerm) {
        const resultsContainer = document.getElementById('search-modal-results');
        
        if (!resultsContainer) {
            console.error('❌ حاوية نتائج البحث غير موجودة');
            return;
        }
        
        if (!searchTerm.trim()) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>اكتب في مربع البحث للعثور على العطور</p>
                </div>
            `;
            return;
        }
        
        resultsContainer.innerHTML = `
            <div class="search-loading">
                <i class="fas fa-spinner"></i>
                <p>جاري البحث عن "${searchTerm}"...</p>
            </div>
        `;
        
        try {
            const response = await fetch(`search.php?q=${encodeURIComponent(searchTerm)}`);
            const data = await response.json();
            
            let filteredProducts = [];
            if (data.success) {
                filteredProducts = data.products;
                console.log('🔍 نتائج البحث من قاعدة البيانات:', filteredProducts.length, 'منتج');
            } else {
                console.error('❌ خطأ في البحث:', data.message);
                filteredProducts = searchProducts.filter(product => 
                    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.description.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            
            displaySearchResults(filteredProducts, searchTerm, resultsContainer);
            
        } catch (error) {
            console.error('❌ خطأ في الاتصال:', error);
            const filteredProducts = searchProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
            displaySearchResults(filteredProducts, searchTerm, resultsContainer);
        }
    }

    // عرض نتائج البحث
    function displaySearchResults(filteredProducts, searchTerm, resultsContainer) {
        if (filteredProducts.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-times-circle"></i>
                    <p>لم يتم العثور على منتجات تطابق "${searchTerm}"</p>
                    <small>جرب كلمات بحث أخرى</small>
                </div>
            `;
        } else {
            let resultsHTML = `
                <div class="search-results-header">
                    <i class="fas fa-search me-2"></i>
                    نتائج البحث (${filteredProducts.length}) منتج
                </div>
                <div class="products-grid">
            `;
            
            filteredProducts.forEach(product => {
                resultsHTML += `
                    <div class="product-card" data-product-id="${product.id}">
                        <img src="${product.image}" 
                             alt="${product.name}" 
                             class="product-image"
                             onerror="this.src='https://via.placeholder.com/300x200/f8f9fa/ea70b1?text=عطر'">
                        <div class="product-info">
                            <div class="product-name">${product.name}</div>
                            <div class="product-price">${product.price} SAR</div>
                            <div class="product-description">${product.description}</div>
                            <div class="product-actions">
                                <button class="btn-add-cart" onclick="addToCartFromSearch('${product.id}')">
                                    <i class="fas fa-cart-plus"></i>
                                    إضافة إلى السلة
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            resultsHTML += `</div>`;
            resultsContainer.innerHTML = resultsHTML;
        }
    }

    // إضافة منتج إلى السلة
    function addToCartFromSearch(productId) {
        let product = searchProducts.find(p => p.id === productId);
        
        if (!product) {
            const productCard = document.querySelector(`[data-product-id="${productId}"]`);
            if (productCard) {
                const name = productCard.querySelector('.product-name').textContent;
                const price = productCard.querySelector('.product-price').textContent;
                const description = productCard.querySelector('.product-description').textContent;
                const image = productCard.querySelector('.product-image').src;
                
                product = {
                    id: productId,
                    name: name,
                    price: price.replace(' SAR', ''),
                    image: image,
                    description: description
                };
            }
        }
        
        if (product) {
            if (typeof addToCart === 'function') {
                addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            } else {
                console.log(`🛒 تمت إضافة ${product.name} إلى السلة`);
                showSearchNotification(`تم إضافة ${product.name} إلى السلة`);
            }
            
            closeSearchModal();
            
        } else {
            console.error('❌ المنتج غير موجود:', productId);
            showSearchNotification('❌ حدث خطأ في إضافة المنتج', 'error');
        }
    }

    // إشعارات البحث
    function showSearchNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `search-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        if (!document.querySelector('.search-notification-style')) {
            const notificationStyles = `
                .search-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    padding: 15px 20px;
                    border-radius: 8px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                    z-index: 10001;
                    border-left: 4px solid #28a745;
                    animation: slideInRight 0.3s ease-out;
                    max-width: 300px;
                }
                
                .search-notification.error {
                    border-left-color: #dc3545;
                }
                
                .search-notification .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .search-notification .fa-check-circle {
                    color: #28a745;
                }
                
                .search-notification .fa-exclamation-circle {
                    color: #dc3545;
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            const styleSheet = document.createElement('style');
            styleSheet.className = 'search-notification-style';
            styleSheet.textContent = notificationStyles;
            document.head.appendChild(styleSheet);
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // إنشاء زر بحث عائم
    function createFloatingSearchButton() {
        const oldBtn = document.querySelector('.floating-search-btn');
        if (oldBtn) oldBtn.remove();
        
        const buttonHTML = `
            <button class="floating-search-btn" title="فتح البحث">
                <i class="fas fa-search"></i>
            </button>
        `;
        
        document.body.insertAdjacentHTML('beforeend', buttonHTML);
        
        if (!document.querySelector('.floating-search-styles')) {
            const floatingStyles = `
                .floating-search-btn {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #ea70b1, #a20087);
                    color: white;
                    border: none;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    font-size: 1.5rem;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(234, 112, 177, 0.3);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }
                
                .floating-search-btn:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 20px rgba(234, 112, 177, 0.5);
                }
            `;
            
            const styleSheet = document.createElement('style');
            styleSheet.className = 'floating-search-styles';
            styleSheet.textContent = floatingStyles;
            document.head.appendChild(styleSheet);
        }
        
        const btn = document.querySelector('.floating-search-btn');
        btn.addEventListener('click', openSearchModal);
        
        console.log('✅ زر البحث العائم تم إنشاؤه');
    }

    // إعداد أحداث البحث
    function setupSearchEvents() {
        console.log('🔧 جاري إعداد أحداث البحث...');
        
        // البحث عن أيقونات البحث
        const searchIcons = document.querySelectorAll('.fa-magnifying-glass, .fa-search');
        console.log(`🔍 تم العثور على ${searchIcons.length} أيقونة بحث`);
        
        searchIcons.forEach(icon => {
            const searchButton = icon.closest('.icon-btn') || icon.closest('button') || icon.closest('a') || icon.parentElement;
            if (searchButton && !searchButton.hasAttribute('data-search-bound')) {
                searchButton.setAttribute('data-search-bound', 'true');
                searchButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🎯 تم النقر على أيقونة البحث');
                    openSearchModal();
                });
            }
        });
        
        // إذا لم توجد أيقونات، أنشئ زر عائم
        if (searchIcons.length === 0) {
            createFloatingSearchButton();
        }
        
        // أحداث الإغلاق
        document.addEventListener('click', function(e) {
            if (e.target.id === 'search-modal-close' || e.target.closest('#search-modal-close')) {
                closeSearchModal();
            }
            
            if (e.target.id === 'search-modal') {
                closeSearchModal();
            }
        });
        
        // أحداث البحث
        const searchInput = document.getElementById('search-modal-input');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    performSearch(this.value);
                }, 300);
            });
            
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    performSearch(this.value);
                }
            });
        }
        
        const searchButton = document.getElementById('search-modal-button');
        if (searchButton) {
            searchButton.addEventListener('click', function() {
                const searchInput = document.getElementById('search-modal-input');
                if (searchInput) {
                    performSearch(searchInput.value);
                }
            });
        }
        
        // إغلاق بـ Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeSearchModal();
            }
        });
    }

    // التهيئة الرئيسية
    function initSearchSystem() {
        console.log('🚀 بدء تهيئة نظام البحث...');
        
        createSearchModal();
        setupSearchEvents();
        fetchProducts();
        
        console.log('✅ نظام البحث جاهز للعمل');
    }

    // بدء التشغيل
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearchSystem);
    } else {
        initSearchSystem();
    }

    // جعل الدوال متاحة عالمياً
    window.openSearchModal = openSearchModal;
    window.closeSearchModal = closeSearchModal;
    window.performSearch = performSearch;
    window.addToCartFromSearch = addToCartFromSearch;
    window.initSearchSystem = initSearchSystem;

})();