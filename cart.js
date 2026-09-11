const products = [
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

// بيانات السلة
let cart = [];

// عناصر DOM
let cartToggle, closeCart, cartOverlay, cartSidebar, cartItems, cartCount, cartTotal;
let subtotalEl, taxEl, totalEl, checkoutBtn, checkoutPage, backToCart;
let completeOrder, orderItems, orderSubtotal, orderTax, orderTotal;





// ========== نظام السلة ========== //

// تهيئة DOM بعد تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('جاري تهيئة نظام السلة...');
    initializeDOMElements();
    setupEventListeners();
    updateCart();
    addDataAttributesToButtons();
    setupDiscountHandlers();
    console.log('تم تهيئة نظام السلة بنجاح');
});

// إضافة data attributes تلقائياً لأزرار الشراء
function addDataAttributesToButtons() {
    const buttons = document.querySelectorAll('.buy-button');
    console.log(`تم العثور على ${buttons.length} زر شراء`);
    
    buttons.forEach((button, index) => {
        const product = products[index];
        if (product) {
            button.setAttribute('data-id', product.id);
            button.setAttribute('data-name', product.name);
            button.setAttribute('data-price', product.price);
            button.setAttribute('data-image', product.image);
            console.log(`تم إضافة بيانات للمنتج: ${product.name}`);
        }
    });
}

// تهيئة عناصر DOM
function initializeDOMElements() {
    console.log('جاري تهيئة عناصر DOM...');
    
    cartToggle = document.getElementById('cart-toggle');
    closeCart = document.getElementById('close-cart');
    cartOverlay = document.getElementById('cart-overlay');
    cartSidebar = document.getElementById('cart-sidebar');
    cartItems = document.getElementById('cart-items');
    cartCount = document.getElementById('cart-count');
    cartTotal = document.getElementById('cart-total');
    subtotalEl = document.getElementById('subtotal');
    taxEl = document.getElementById('tax');
    totalEl = document.getElementById('total');
    checkoutBtn = document.getElementById('checkout-btn');
    checkoutPage = document.getElementById('checkout-page');
    backToCart = document.getElementById('back-to-cart');
    completeOrder = document.getElementById('complete-order');
    orderItems = document.getElementById('order-items');
    orderSubtotal = document.getElementById('order-subtotal');
    orderTax = document.getElementById('order-tax');
    orderTotal = document.getElementById('order-total');
    
    console.log('نتيجة البحث عن العناصر:', {
        cartToggle: !!cartToggle,
        cartCount: !!cartCount,
        checkoutPage: !!checkoutPage,
        checkoutBtn: !!checkoutBtn
    });
    
    // إنشاء عناصر DOM المطلوبة إذا لم تكن موجودة
    createCartElements();
}

// إنشاء عناصر DOM المطلوبة
function createCartElements() {
    console.log('جاري إنشاء العناصر المطلوبة...');
    
    // إنشاء overlay السلة إذا لم يكن موجوداً
    if (!cartOverlay) {
        console.log('إنشاء overlay السلة');
        cartOverlay = document.createElement('div');
        cartOverlay.id = 'cart-overlay';
        cartOverlay.className = 'cart-overlay';
        document.body.appendChild(cartOverlay);
    }
    
    // إنشاء sidebar السلة إذا لم يكن موجوداً
    if (!cartSidebar) {
        console.log('إنشاء sidebar السلة');
        cartSidebar = document.createElement('div');
        cartSidebar.id = 'cart-sidebar';
        cartSidebar.className = 'cart-sidebar';
        cartSidebar.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4>سلة التسوق</h4>
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
                <div class="d-flex justify-content-between mb-3">
                    <span>الضريبة (15%):</span>
                    <span id="tax">0 SAR</span>
                </div>
                <div class="d-flex justify-content-between fw-bold fs-5">
                    <span>الإجمالي:</span>
                    <span id="total">0 SAR</span>
                </div>
                <button class="checkout-btn mt-4" id="checkout-btn">اتمام الشراء</button>
            </div>
        `;
        document.body.appendChild(cartSidebar);



        
        // إعادة تعيين المراجع بعد الإنشاء
        cartItems = document.getElementById('cart-items');
        cartTotal = document.getElementById('cart-total');
        subtotalEl = document.getElementById('subtotal');
        taxEl = document.getElementById('tax');
        totalEl = document.getElementById('total');
        checkoutBtn = document.getElementById('checkout-btn');
        closeCart = document.getElementById('close-cart');
    }

    
    // إنشاء صفحة اتمام الشراء إذا لم تكن موجودة
    if (!checkoutPage) {
        console.log('إنشاء صفحة اتمام الشراء');
        checkoutPage = document.createElement('div');
        checkoutPage.id = 'checkout-page';
        checkoutPage.className = 'container checkout-page';
        checkoutPage.style.display = 'none';
        checkoutPage.innerHTML = `

<div style="
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:transparent;
    z-index: 9999;
"></div>
<div class="container  " style="
    max-width: 900px;
    margin: 0 auto;
    padding: 40px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10000;
    height: auto;
    max-height: 90vh;
    overflow-y: auto;
" >
               <a href="#" class="back-to-cart" id="back-to-cart">
        <i class="fas fa-arrow-right"></i> العودة إلى السلة
    </a>
    <div class="row">
        <div class="col-lg-8 mb-4">
            <div class="checkout-form">
                <h3 class="mb-4">معلومات الشحن</h3>
                
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="firstName" class="form-label">الاسم الأول</label>
                        <input type="text" class="form-control" id="firstName" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="lastName" class="form-label">الاسم الأخير</label>
                        <input type="text" class="form-control" id="lastName" required>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="email" class="form-label">البريد الإلكتروني</label>
                    <input type="email" class="form-control" id="email" required>
                </div>
                
                <div class="mb-3">
                    <label for="phone" class="form-label">رقم الهاتف</label>
                    <input type="tel" class="form-control" id="phone" required>
                </div>
                
                <div class="mb-3">
                    <label for="address" class="form-label">العنوان</label>
                    <input type="text" class="form-control" id="address" required>
                </div>
                
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="city" class="form-label">المدينة</label>
                        <input type="text" class="form-control" id="city" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="postalCode" class="form-label">الرمز البريدي</label>
                        <input type="text" class="form-control" id="postalCode" required>
                    </div>
                </div>
                
                <h3 class="my-4">معلومات الدفع</h3>
                
                <div class="mb-3">
                    <label for="cardNumber" class="form-label">رقم البطاقة</label>
                    <input type="text" class="form-control" id="cardNumber" placeholder="1234 5678 9012 3456" required>
                </div>
                
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="expiryDate" class="form-label">تاريخ الانتهاء</label>
                        <input type="text" class="form-control" id="expiryDate" placeholder="MM/YY" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="cvv" class="form-label">CVV</label>
                        <input type="text" class="form-control" id="cvv" placeholder="123" required>
                    </div>
                </div>
                
                <button class="checkout-btn mt-3" id="complete-order">اتمام الطلب</button>
            </div>
        </div>
        
        <div class="col-lg-4">
            <div class="order-summary">
                <h4 class="mb-4">ملخص الطلب</h4>
                <div id="order-items"></div>
                
                <!-- قسم كود الخصم المضاف -->
                <div class="discount-section mb-3 mt-3">
                    <label for="discount-code" class="form-label">كود الخصم</label>
                    <div class="input-group">
                        <input type="text" class="form-control" id="discount-code" placeholder="أدخل الكود هنا">
                        <button class="btn btn-outline-primary" type="button" id="apply-discount">تطبيق</button>
                    </div>
                    <div id="discount-message" class="mt-2 small"></div>
                </div>

                <div class="mt-4 pt-3 border-top">
                    <div class="d-flex justify-content-between mb-2">
                        <span>المجموع:</span>
                        <span id="order-subtotal">0 SAR</span>
                    </div>
                    
                    <!-- سطر الخصم المضاف -->
                    <div class="d-flex justify-content-between mb-2 text-success" id="discount-row" style="display: none;">
                        <span>الخصم:</span>
                        <span id="discount-amount">0 SAR</span>
                    </div>
                    
                    <div class="d-flex justify-content-between mb-2">
                        <span>الضريبة (15%):</span>
                        <span id="order-tax">0 SAR</span>
                    </div>
                    <div class="d-flex justify-content-between fw-bold fs-5">
                        <span>الإجمالي:</span>
                        <span id="order-total">0 SAR</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
        `;
        document.body.appendChild(checkoutPage);
        
        // إعادة تعيين المراجع بعد الإنشاء
        backToCart = document.getElementById('back-to-cart');
        completeOrder = document.getElementById('complete-order');
        orderItems = document.getElementById('order-items');
        orderSubtotal = document.getElementById('order-subtotal');
        orderTax = document.getElementById('order-tax');
        orderTotal = document.getElementById('order-total');
    }
    
    // إضافة CSS المطلوب
    addCartStyles();
}

// إضافة CSS المطلوب
function addCartStyles() {
    if (document.getElementById('cart-styles')) return;
    
    const styles = `
        <style id="cart-styles">
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
            }
            
            .checkout-btn:hover {
                background-color: #ea70b1;
            }
            
            .empty-cart {
                text-align: center;
                padding: 40px 0;
                color: #666;
            }
            
            .checkout-page {
                  background-color : none;
                min-height: 100vh;
                padding: 30px 0;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                z-index: 1060;
                overflow-y: auto;
            }
            
            .checkout-form {
                background-color: white;
                border-radius: 15px;
                padding: 30px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            }
            
            .order-summary {
                background-color: white;
                border-radius: 15px;
                padding: 30px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                position: sticky;
                top: 100px;
            }
            
            .order-item {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid #eee;
            }
            
            .back-to-cart {
                color: #a20087;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                gap: 5px;
                margin-bottom: 20px;
                font-weight: bold;
            }
            
            .back-to-cart:hover {
                color: #ea70b1;
            }
            
            @media (max-width: 768px) {
                .cart-sidebar {
                    width: 300px;
                }
                
                .checkout-page .container {
                    padding: 15px;
                }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    console.log('جاري إعداد مستمعي الأحداث...');
    
    // أحداث السلة
    if (cartToggle) {
        cartToggle.addEventListener('click', openCart);
        console.log('تم إضافة حدث لزر فتح السلة');
    } else {
        console.warn('لم يتم العثور على زر فتح السلة');
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', closeCartHandler);
        console.log('تم إضافة حدث لزر إغلاق السلة');
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCartHandler);
    }
    
    // أحداث اتمام الشراء
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', goToCheckout);
        console.log('تم إضافة حدث لزر اتمام الشراء');
    } else {
        console.warn('لم يتم العثور على زر اتمام الشراء');
    }
    
    if (backToCart) {
        backToCart.addEventListener('click', backToCartHandler);
        console.log('تم إضافة حدث لزر العودة للسلة');
    }
    
    if (completeOrder) {
        completeOrder.addEventListener('click', completeOrderHandler);
        console.log('تم إضافة حدث لزر اتمام الطلب');
    }
    
    // إضافة أحداث لأزرار المنتجات
    document.addEventListener('click', function(e) {
        if (e.target.closest('.buy-button')) {
            const button = e.target.closest('.buy-button');
            const productId = button.getAttribute('data-id');
            
            console.log('تم النقر على زر شراء، المنتج:', productId);
            
            // البحث عن المنتج في بياناتنا المحددة مسبقاً
            const product = products.find(p => p.id === productId);
            
            if (product) {
                const cartProduct = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                };
                addToCart(cartProduct);
            } else {
                console.warn('لم يتم العثور على المنتج:', productId);
            }
        }
    });
}

// فتح السلة
function openCart() {
    console.log('فتح السلة');
    if (cartSidebar) {
        cartSidebar.classList.add('active');
    }
    if (cartOverlay) {
        cartOverlay.classList.add('active');
    }
}

// إغلاق السلة
function closeCartHandler() {
    console.log('إغلاق السلة');
    if (cartSidebar) {
        cartSidebar.classList.remove('active');
    }
    if (cartOverlay) {
        cartOverlay.classList.remove('active');
    }
}

// إضافة منتج إلى السلة
function addToCart(product) {
    console.log('إضافة منتج إلى السلة:', product.name);
    
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(product);
    }
    
    updateCart();
    showNotification(`تم إضافة ${product.name} إلى السلة`);
}

// تحديث السلة
function updateCart() {
    if (!cartItems || !cartCount) {
        console.warn('عناصر السلة غير موجودة');
        return;
    }
    
    // تحديث عدد العناصر
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // تحديث عرض العناصر
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart fa-3x mb-3 text-muted"></i>
                <p>سلة التسوق فارغة</p>
            </div>
        `;
        if (cartTotal) cartTotal.style.display = 'none';
    } else {
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            cartItems.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image" 
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
        
        // إضافة أحداث للتحكم في الكمية
        setTimeout(() => {
            document.querySelectorAll('.increase').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.closest('.increase').getAttribute('data-id');
                    increaseQuantity(id);
                });
            });
            
            document.querySelectorAll('.decrease').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.closest('.decrease').getAttribute('data-id');
                    decreaseQuantity(id);
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.closest('.remove-item').getAttribute('data-id');
                    removeFromCart(id);
                });
            });
        }, 100);
    }
    
    // تحديث الإجماليات
    updateTotals();
}

// زيادة كمية المنتج
function increaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += 1;
        updateCart();
    }
}

// تقليل كمية المنتج
function decreaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        updateCart();
    }
}

// إزالة المنتج من السلة
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// تحديث الإجماليات
function updateTotals() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.15;
    const total = subtotal + tax;
    
    if (subtotalEl) subtotalEl.textContent = `${subtotal} SAR`;
    if (taxEl) taxEl.textContent = `${tax.toFixed(2)} SAR`;
    if (totalEl) totalEl.textContent = `${total.toFixed(2)} SAR`;
    
    // تحديث إجماليات صفحة اتمام الشراء
    if (orderSubtotal) orderSubtotal.textContent = `${subtotal} SAR`;
    if (orderTax) orderTax.textContent = `${tax.toFixed(2)} SAR`;
    if (orderTotal) orderTotal.textContent = `${total.toFixed(2)} SAR`;
    
    // تحديث عناصر الطلب في صفحة اتمام الشراء
    if (orderItems) {
        orderItems.innerHTML = '';
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            orderItems.innerHTML += `
                <div class="order-item">
                    <div>
                        <div class="fw-bold">${item.name}</div>
                        <div class="text-muted">${item.quantity} × ${item.price} SAR</div>
                    </div>
                    <div class="fw-bold">${itemTotal} SAR</div>
                </div>
            `;
        });
    }
}

// الانتقال إلى صفحة اتمام الشراء
function goToCheckout() {
    console.log('الانتقال إلى صفحة اتمام الشراء');
    
    if (cart.length === 0) {
        showNotification('السلة فارغة. أضف منتجات قبل اتمام الشراء.', 'error');
        return;
    }
    
    closeCartHandler();
    
    if (checkoutPage) {
        checkoutPage.style.display = 'block';
        console.log('تم عرض صفحة اتمام الشراء');
    } else {
        console.error('صفحة اتمام الشراء غير موجودة');
    }
    
    // إخفاء المحتوى الرئيسي
    const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
    if (mainContent) {
        mainContent.style.display = 'none';
    }
}

// العودة إلى السلة من صفحة اتمام الشراء
function backToCartHandler(e) {
    e.preventDefault();
    console.log('العودة إلى السلة');
    
    if (checkoutPage) {
        checkoutPage.style.display = 'none';
    }
    
    // إظهار المحتوى الرئيسي
    const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
    if (mainContent) {
        mainContent.style.display = 'block';
    }
    
    openCart();
}

// اتمام الطلب
function completeOrderHandler() {
    console.log('محاولة اتمام الطلب');
    
    if (!validateCheckoutForm()) {
        showNotification('يرجى ملء جميع الحقول المطلوبة بشكل صحيح.', 'error');
        return;
    }
    
    showNotification('شكراً لك! تم استلام طلبك بنجاح.', 'success');
    
    // إعادة تعيين السلة
    cart = [];
    updateCart();
    
    // إعادة تعيين النموذج
    resetCheckoutForm();
    
    // العودة إلى الصفحة الرئيسية
    if (checkoutPage) {
        checkoutPage.style.display = 'none';
    }
    
    // إظهار المحتوى الرئيسي
    const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
    if (mainContent) {
        mainContent.style.display = 'block';
    }
}

// التحقق من صحة نموذج اتمام الشراء
function validateCheckoutForm() {
    const requiredFields = [
        'firstName', 'lastName', 'email', 'phone', 
        'address', 'city', 'postalCode', 'cardNumber', 
        'expiryDate', 'cvv'
    ];
    
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
            isValid = false;
            if (field) {
                field.classList.add('is-invalid');
                // إضافة رسالة خطأ إذا لم تكن موجودة
                if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('invalid-feedback')) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'invalid-feedback';
                    errorDiv.textContent = 'هذا الحقل مطلوب';
                    field.parentNode.appendChild(errorDiv);
                }
            }
        } else {
            if (field) {
                field.classList.remove('is-invalid');
                // إزالة رسالة الخطأ إذا كانت موجودة
                const errorDiv = field.parentNode.querySelector('.invalid-feedback');
                if (errorDiv) {
                    errorDiv.remove();
                }
            }
        }
    });
    
    console.log('نتيجة التحقق من النموذج:', isValid);
    return isValid;
}

// إعادة تعيين نموذج اتمام الشراء
function resetCheckoutForm() {
    const form = document.querySelector('.checkout-form');
    if (form) {
        form.reset();
        const invalidFields = form.querySelectorAll('.is-invalid');
        invalidFields.forEach(field => {
            field.classList.remove('is-invalid');
        });
    }
}

// عرض الإشعارات
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
          background-color: #e4dbe7ff !important;
    color: #000000ff )!important;
    border-color: #e4dbe7ff !important;
    `;
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// دالة لاختبار النظام
function testAddProducts() {
    // إضافة منتجين عشوائيين للسلة للتجربة
    const randomProduct1 = products[Math.floor(Math.random() * products.length)];
    const randomProduct2 = products[Math.floor(Math.random() * products.length)];
    
    addToCart({...randomProduct1, quantity: 1});
    addToCart({...randomProduct2, quantity: 2});
    
    showNotification('تم إضافة منتجات تجريبية للسلة');
}

// دالة لاختبار صفحة اتمام الشراء مباشرة
function testCheckoutPage() {
    // إضافة منتجات للسلة أولاً
    testAddProducts();
    // ثم فتح صفحة اتمام الشراء
    setTimeout(() => {
        goToCheckout();
    }, 1000);
}
// إعداد مستمع كود الخصم (يُستدعى بعد إنشاء صفحة اتمام الشراء ديناميكيًا)
function setupDiscountHandlers() {
    const applyDiscountBtn = document.getElementById('apply-discount');
    if (!applyDiscountBtn) {
        console.warn('لم يتم العثور على زر تطبيق الخصم');
        return;
    }

    applyDiscountBtn.addEventListener('click', function() {
        const discountCode = document.getElementById('discount-code').value;
        const discountMessage = document.getElementById('discount-message');
        const discountRow = document.getElementById('discount-row');
        const discountAmount = document.getElementById('discount-amount');

        // أكواد الخصم المتاحة
        const validDiscounts = {
            'SAVE10': 10,    // خصم 10%
            'WELCOME15': 15, // خصم 15%
            'SPECIAL20': 20  // خصم 20%
        };

        if (discountCode in validDiscounts) {
            const discountPercent = validDiscounts[discountCode];
            const subtotal = parseFloat(document.getElementById('order-subtotal').textContent) || 100; // مثال: 100 ريال
            const discountValue = (subtotal * discountPercent / 100);

            discountAmount.textContent = `-${discountValue.toFixed(2)} SAR`;
            discountRow.style.display = 'flex';
            discountMessage.textContent = `تم تطبيق خصم ${discountPercent}% بنجاح!`;
            discountMessage.className = 'mt-2 small text-success';

            // تحديث الإجمالي
            updateOrderTotal(discountValue);
        } else {
            discountMessage.textContent = 'كود الخصم غير صالح';
            discountMessage.className = 'mt-2 small text-danger';
            discountRow.style.display = 'none';
            updateOrderTotal(0);
        }
    });
}

// دالة تحديث الإجمالي
function updateOrderTotal(discount = 0) {
    const subtotal = parseFloat(document.getElementById('order-subtotal').textContent) || 100;
    const tax = (subtotal - discount) * 0.15;
    const total = (subtotal - discount) + tax;

    document.getElementById('order-tax').textContent = `${tax.toFixed(2)} SAR`;
    document.getElementById('order-total').textContent = `${total.toFixed(2)} SAR`;
}


// جعل دوال الاختبار متاحة globally
window.testCart = testAddProducts;
window.testCheckout = testCheckoutPage;

console.log('تم تحميل نظام السلة بنجاح - استخدم testCart() أو testCheckout() للاختبار');

