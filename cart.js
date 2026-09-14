/*const products = [
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
                background-color: whith;
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
     background: linear-gradient(135deg, #ea70b1, #a20087); 
     color:white;
       box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        border-right: 4px solid #a20087;

    `;
    notification.innerHTML = `
        ${message}
         <div class="d-flex align-items-center">
            <i class="fas fa-check-circle me-2"></i>
          

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
}*/


// كود JavaScript لإدارة الخصم -->
 /*document.getElementById('apply-discount').addEventListener('click', function() {
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

// دالة تحديث الإجمالي
function updateOrderTotal(discount = 0) {
    const subtotal = parseFloat(document.getElementById('order-subtotal').textContent) || 100;
    const tax = (subtotal - discount) * 0.15;
    const total = (subtotal - discount) + tax;
    
    document.getElementById('order-tax').textContent = `${tax.toFixed(2)} SAR`;
    document.getElementById('order-total').textContent = `${total.toFixed(2)} SAR`;
}

// تهيئة القيم الافتراضية
document.getElementById('order-subtotal').textContent = '100.00 SAR';
updateOrderTotal(0);


// جعل دوال الاختبار متاحة globally
window.testCart = testAddProducts;
window.testCheckout = testCheckoutPage;

console.log('تم تحميل نظام السلة بنجاح - استخدم testCart() أو testCheckout() للاختبار');
*/













/*function initializeDiscountSystem() {
    const discountButton = document.getElementById('apply-discount');
    
    if (discountButton) {
        discountButton.addEventListener('click', applyDiscount);
        console.log('✅ تم إعداد نظام الخصم');
    } else {
        console.warn('⚠️ زر الخصم غير موجود، إعادة المحاولة...');
        setTimeout(initializeDiscountSystem, 500);
    }
}

function applyDiscount() {
    const discountCode = document.getElementById('discount-code').value.trim();
    const discountMessage = document.getElementById('discount-message');
    const discountRow = document.getElementById('discount-row');
    const discountAmount = document.getElementById('discount-amount');
    
    const validDiscounts = {
        'SAVE10': 10,
        'WELCOME15': 15, 
        'SPECIAL20': 20
    };
    
    if (!discountCode) {
        discountMessage.textContent = 'يرجى إدخال كود الخصم';
        discountMessage.className = 'mt-2 small text-danger';
        return;
    }
    
    if (discountCode in validDiscounts) {
        const discountPercent = validDiscounts[discountCode];
        const subtotal = parseFloat(document.getElementById('order-subtotal').textContent) || 100;
        const discountValue = (subtotal * discountPercent / 100);
        
        discountAmount.textContent = `-${discountValue.toFixed(2)} SAR`;
        discountRow.style.display = 'flex';
        discountMessage.textContent = `🎉 تم تطبيق خصم ${discountPercent}% بنجاح!`;
        discountMessage.className = 'mt-2 small text-success';
        
        updateOrderTotal(discountValue);
        showNotification(`تم تطبيق خصم ${discountPercent}% على طلبك`);
    } else {
        discountMessage.textContent = '❌ كود الخصم غير صالح';
        discountMessage.className = 'mt-2 small text-danger';
        discountRow.style.display = 'none';
        updateOrderTotal(0);
    }
}

function updateOrderTotal(discount = 0) {
    const subtotal = parseFloat(document.getElementById('order-subtotal').textContent) || 100;
    const tax = (subtotal - discount) * 0.15;
    const total = (subtotal - discount) + tax;
    
    if (document.getElementById('order-tax')) {
        document.getElementById('order-tax').textContent = `${tax.toFixed(2)} SAR`;
    }
    if (document.getElementById('order-total')) {
        document.getElementById('order-total').textContent = `${total.toFixed(2)} SAR`;
    }
}

// تشغيل نظام الخصم بعد تحميل العناصر
setTimeout(initializeDiscountSystem, 1500);

// جعل دوال الاختبار متاحة globally
window.testCart = testAddProducts;
window.testCheckout = testCheckoutPage;

console.log('تم تحميل نظام السلة بنجاح - استخدم testCart() أو testCheckout() للاختبار');

// إنشاء نافذة البحث
function createSearchModal() {
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
}

// إضافة أنماط CSS ديناميكياً
function addSearchModalStyles() {
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
        /*.products-grid {
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
            color: #ea70b1;
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
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
} */

    // بيانات المنتجات
/*const products = [
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
    initializeDiscountSystem();
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
                background: rgba(0,0,0,0.5);
                z-index: 9999;
            "></div>
            <div class="container" style="
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
            ">
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
                            
                            <!-- قسم كود الخصم -->
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
                                
                                <!-- سطر الخصم -->
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
                background-color: none;
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
async function completeOrderHandler() {
    console.log('محاولة اتمام الطلب');
    
    if (!validateCheckoutForm()) {
        showNotification('يرجى ملء جميع الحقول المطلوبة بشكل صحيح.', 'error');
        return;
    }
    
    // جمع بيانات الطلب
    const orderData = collectOrderData();
    
    try {
        // عرض حالة التحميل
        showNotification('جاري معالجة طلبك...', 'info');
        
        // حفظ الطلب في قاعدة البيانات
        const saveResult = await saveOrderToDatabase(orderData);
        
        // إرسال إيميل التأكيد (اختياري)
        await sendOrderConfirmation(orderData, saveResult.order_number);
        
        showNotification(`شكراً لك! تم استلام طلبك بنجاح. رقم الطلب: ${saveResult.order_number}`, 'success');
        
        // إعادة تعيين السلة والنموذج
        resetAfterOrder();
        
    } catch (error) {
        console.error('خطأ في اتمام الطلب:', error);
        showNotification('حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.', 'error');
    }
}

// جمع بيانات الطلب من النموذج
function collectOrderData() {
    const customer = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        postalCode: document.getElementById('postalCode').value
    };
    
    const payment = {
        cardNumber: document.getElementById('cardNumber').value,
        expiryDate: document.getElementById('expiryDate').value,
        cvv: document.getElementById('cvv').value
    };
    
    const discountRow = document.getElementById('discount-row');
    const discount = discountRow.style.display !== 'none' ? 
        parseFloat(document.getElementById('discount-amount').textContent.replace('-', '').replace(' SAR', '')) || 0 : 0;
    
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.15;
    const total = subtotal + tax - discount;
    
    return {
        customer: customer,
        payment: payment,
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
        })),
        totals: {
            subtotal: subtotal,
            tax: tax,
            discount: discount,
            total: total
        },
        discountCode: document.getElementById('discount-code').value || null
    };
}

// دالة حفظ الطلب في قاعدة البيانات
async function saveOrderToDatabase(orderData) {
    try {
        const response = await fetch('orders.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                order_data: orderData
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ تم حفظ الطلب في قاعدة البيانات:', result.order_number);
            return result;
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('❌ خطأ في حفظ الطلب:', error);
        // في حالة عدم وجود اتصال بالخادم، نعود للوضع السابق
        throw error;
    }
}

// إرسال إيميل تأكيد (اختياري)
async function sendOrderConfirmation(orderData, orderNumber) {
    try {
        const response = await fetch('send_email.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                order_data: orderData,
                order_number: orderNumber
            })
        });
        
        const result = await response.json();
        if (result.success) {
            console.log('✅ تم إرسال إيميل التأكيد');
        }
    } catch (error) {
        console.warn('⚠️ لم يتم إرسال إيميل التأكيد:', error);
    }
}

// إعادة التعيين بعد الطلب
function resetAfterOrder() {
    // إعادة تعيين السلة
    cart = [];
    updateCart();
    
    // إعادة تعيين النموذج
    resetCheckoutForm();
    
    // إعادة تعيين الخصم
    const discountRow = document.getElementById('discount-row');
    const discountMessage = document.getElementById('discount-message');
    const discountCode = document.getElementById('discount-code');
    
    if (discountRow) discountRow.style.display = 'none';
    if (discountMessage) discountMessage.textContent = '';
    if (discountCode) discountCode.value = '';
    
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
        background: linear-gradient(135deg, #ea70b1, #a20087); 
        color: white;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        border-right: 4px solid #a20087;
        border: none;
    `;
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2"></i>
            <span>${message}</span>
        </div>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// ========== نظام الخصم ========== //

function initializeDiscountSystem() {
    const discountButton = document.getElementById('apply-discount');
    
    if (discountButton) {
        discountButton.addEventListener('click', applyDiscount);
        console.log('✅ تم إعداد نظام الخصم');
    } else {
        console.warn('⚠️ زر الخصم غير موجود، إعادة المحاولة...');
        setTimeout(initializeDiscountSystem, 500);
    }
}

function applyDiscount() {
    const discountCode = document.getElementById('discount-code').value.trim();
    const discountMessage = document.getElementById('discount-message');
    const discountRow = document.getElementById('discount-row');
    const discountAmount = document.getElementById('discount-amount');
    
    const validDiscounts = {
        'SAVE10': 10,
        'WELCOME15': 15, 
        'SPECIAL20': 20
    };
    
    if (!discountCode) {
        discountMessage.textContent = 'يرجى إدخال كود الخصم';
        discountMessage.className = 'mt-2 small text-danger';
        return;
    }
    
    if (discountCode in validDiscounts) {
        const discountPercent = validDiscounts[discountCode];
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const discountValue = (subtotal * discountPercent / 100);
        
        discountAmount.textContent = `-${discountValue.toFixed(2)} SAR`;
        discountRow.style.display = 'flex';
        discountMessage.textContent = `🎉 تم تطبيق خصم ${discountPercent}% بنجاح!`;
        discountMessage.className = 'mt-2 small text-success';
        
        updateOrderTotalWithDiscount(discountValue);
        showNotification(`تم تطبيق خصم ${discountPercent}% على طلبك`);
    } else {
        discountMessage.textContent = '❌ كود الخصم غير صالح';
        discountMessage.className = 'mt-2 small text-danger';
        discountRow.style.display = 'none';
        updateOrderTotalWithDiscount(0);
    }
}

function updateOrderTotalWithDiscount(discount = 0) {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = (subtotal - discount) * 0.15;
    const total = (subtotal - discount) + tax;
    
    if (document.getElementById('order-tax')) {
        document.getElementById('order-tax').textContent = `${tax.toFixed(2)} SAR`;
    }
    if (document.getElementById('order-total')) {
        document.getElementById('order-total').textContent = `${total.toFixed(2)} SAR`;
    }
}

// ========== دوال الاختبار ========== //

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

// جعل دوال الاختبار متاحة globally
window.testCart = testAddProducts;
window.testCheckout = testCheckoutPage;

console.log('✅ تم تحميل نظام السلة بنجاح - استخدم testCart() أو testCheckout() للاختبار');
*/
// بيانات المنتجات
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

// ========== تهيئة التطبيق ========== //

document.addEventListener('DOMContentLoaded', function() {
    console.log('🛒 جاري تهيئة نظام السلة...');
    initializeDOMElements();
    setupEventListeners();
    updateCart();
    addDataAttributesToButtons();
    console.log('✅ تم تهيئة نظام السلة بنجاح');
});

// إضافة data attributes تلقائياً لأزرار الشراء
function addDataAttributesToButtons() {
    console.log('🔧 جاري إضافة البيانات لأزرار الشراء...');
    
    const buttons = document.querySelectorAll('.buy-button');
    console.log(`تم العثور على ${buttons.length} زر شراء`);
    
    buttons.forEach((button, index) => {
        const product = products[index];
        if (product) {
            button.setAttribute('data-id', product.id);
            button.setAttribute('data-name', product.name);
            button.setAttribute('data-price', product.price);
            button.setAttribute('data-image', product.image);
            console.log(`✅ تم إضافة بيانات للمنتج: ${product.name}`);
        } else {
            console.warn(`⚠️ لا يوجد منتج بالرقم ${index}`);
        }
    });
}

// تهيئة عناصر DOM
function initializeDOMElements() {
    console.log('🔍 البحث عن عناصر DOM...');
    
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

    console.log('نتيجة البحث عن العناصر:', {
        cartToggle: !!cartToggle,
        closeCart: !!closeCart,
        cartOverlay: !!cartOverlay,
        cartSidebar: !!cartSidebar,
        cartItems: !!cartItems,
        cartCount: !!cartCount,
        checkoutBtn: !!checkoutBtn
    });

    // إنشاء العناصر المفقودة
    createCartElements();
    createCheckoutPage();
}

// إنشاء عناصر السلة إذا لم تكن موجودة
function createCartElements() {
    console.log('🛠️ إنشاء عناصر السلة...');
    
    // إنشاء overlay السلة
    if (!cartOverlay) {
        cartOverlay = document.createElement('div');
        cartOverlay.id = 'cart-overlay';
        cartOverlay.className = 'cart-overlay';
        document.body.appendChild(cartOverlay);
    }
    
    // إنشاء sidebar السلة
    if (!cartSidebar) {
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
    
    addCartStyles();
}

// إنشاء صفحة اتمام الشراء
function createCheckoutPage() {
    console.log('🛠️ إنشاء صفحة اتمام الشراء...');
    
    if (document.getElementById('checkout-page')) return;
    
    checkoutPage = document.createElement('div');
    checkoutPage.id = 'checkout-page';
    checkoutPage.className = 'checkout-page';
    checkoutPage.style.display = 'none';
    checkoutPage.innerHTML = `
        <div class="checkout-container">
            <div class="checkout-content">
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
        </div>
    `;
    document.body.appendChild(checkoutPage);
    
    // إعادة تعيين المراجع
    backToCart = document.getElementById('back-to-cart');
    completeOrder = document.getElementById('complete-order');
    orderItems = document.getElementById('order-items');
    orderSubtotal = document.getElementById('order-subtotal');
    orderTax = document.getElementById('order-tax');
    orderTotal = document.getElementById('order-total');
    
    initializeDiscountSystem();
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
                flex-shrink: 0;
                object-fit: cover;
                border-radius: 8px;
                margin-right: 15px;
                overflow: hidden;
            }

            .cart-item-details {
                flex: 1;
                min-width: 0;
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
                flex-shrink: 0;
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
            
            .checkout-page {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 1060;
                display: none;
                overflow-y: auto;
                padding: 20px;
            }
            
            .checkout-container {
                max-width: 1200px;
                margin: 0 auto;
            }
            
            .checkout-content {
                background: white;
                border-radius: 20px;
                padding: 40px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.15);
                margin-top: 20px;
                margin-bottom: 20px;
            }
            
            .checkout-form {
                background-color: white;
                border-radius: 15px;
                padding: 30px;
            }
            
            .order-summary {
                background-color: #f8f9fa;
                border-radius: 15px;
                padding: 30px;
                position: sticky;
                top: 100px;
            }
            
            .order-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 0;
                border-bottom: 1px solid #eee;
            }
            
            .order-item-image {
                width: 50px;
                height: 50px;
                object-fit: cover;
                border-radius: 8px;
                margin-left: 10px;
            }
            
            .order-item-details {
                flex: 1;
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
            
            .icon-btn {
                background: none;
                border: none;
                font-size: 1.2rem;
                padding: 5px 10px;
                cursor: pointer;
            }
            
            .cart-badge {
                background: #ffd700;
                color: #000;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                top: -5px;
                left: -5px;
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
            }
            
            .buy-button:hover {
                transform: scale(1.05);
                box-shadow: 0 5px 15px rgba(162, 0, 135, 0.4);
            }
            
            .is-invalid {
                border-color: #dc3545 !important;
            }
            
            .invalid-feedback {
                display: block;
                width: 100%;
                margin-top: 0.25rem;
                font-size: 0.875em;
                color: #dc3545;
            }
            
            @media (max-width: 768px) {
                .cart-sidebar {
                    width: 300px;
                }
                
                .checkout-content {
                    padding: 20px;
                }
                
                .checkout-page {
                    padding: 10px;
                }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    console.log('🎯 إعداد مستمعي الأحداث...');
    
    // أحداث السلة
    if (cartToggle) {
        cartToggle.addEventListener('click', openCart);
        console.log('✅ تم إضافة حدث لزر فتح السلة');
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', closeCartHandler);
        console.log('✅ تم إضافة حدث لزر إغلاق السلة');
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCartHandler);
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', goToCheckout);
        console.log('✅ تم إضافة حدث لزر اتمام الشراء');
    }
    
    // إضافة أحداث لأزرار المنتجات
    document.addEventListener('click', function(e) {
        const buyButton = e.target.closest('.buy-button');
        if (buyButton) {
            e.preventDefault();
            e.stopPropagation();
            
            const productId = buyButton.getAttribute('data-id');
            const productName = buyButton.getAttribute('data-name');
            const productPrice = buyButton.getAttribute('data-price');
            const productImage = buyButton.getAttribute('data-image');
            
            console.log('🛒 النقر على زر الشراء:', productName);
            
            if (productId && productName && productPrice) {
                const cartProduct = {
                    id: productId,
                    name: productName,
                    price: parseFloat(productPrice),
                    image: productImage,
                    quantity: 1
                };
                addToCart(cartProduct);
            }
        }
    });
    
    // أحداث صفحة اتمام الشراء
    if (backToCart) {
        backToCart.addEventListener('click', backToCartHandler);
    }
    
    if (completeOrder) {
        completeOrder.addEventListener('click', completeOrderHandler);
    }
}

// ========== نظام السلة ========== //

function openCart() {
    console.log('📖 فتح السلة');
    if (cartSidebar) {
        cartSidebar.classList.add('active');
    }
    if (cartOverlay) {
        cartOverlay.classList.add('active');
    }
}

function closeCartHandler() {
    console.log('❌ إغلاق السلة');
    if (cartSidebar) {
        cartSidebar.classList.remove('active');
    }
    if (cartOverlay) {
        cartOverlay.classList.remove('active');
    }
}

function addToCart(product) {
    console.log('➕ إضافة منتج إلى السلة:', product.name);
    
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(product);
    }
    
    updateCart();
    showNotification(`تم إضافة ${product.name} إلى السلة 🎉`);
}

function updateCart() {
    if (!cartItems || !cartCount) {
        console.warn('⚠️ عناصر السلة غير موجودة');
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
            
            // استخدام مسار الصورة المباشر مع fallback
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
    
    updateTotals();
}

function increaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += 1;
        updateCart();
    }
}

function decreaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        updateCart();
    }
}

function removeFromCart(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
        cart = cart.filter(item => item.id !== id);
        showNotification(`تم إزالة ${item.name} من السلة`);
        updateCart();
    }
}

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
            
            const imageSrc = item.image && item.image.startsWith('images/') ? 
                item.image : 
                `https://via.placeholder.com/50x50/cccccc/969696?text=${encodeURIComponent(item.name)}`;
            
            orderItems.innerHTML += `
                <div class="order-item">
                    <img src="${imageSrc}" alt="${item.name}" class="order-item-image"
                         onerror="this.src='https://via.placeholder.com/50x50/cccccc/969696?text=صورة'">
                    <div class="order-item-details">
                        <div class="fw-bold">${item.name}</div>
                        <div class="text-muted">${item.quantity} × ${item.price} SAR</div>
                    </div>
                    <div class="fw-bold">${itemTotal} SAR</div>
                </div>
            `;
        });
    }
}

// ========== نظام اتمام الشراء ========== //

function goToCheckout() {
    if (cart.length === 0) {
        showNotification('السلة فارغة. أضف منتجات قبل اتمام الشراء.', 'error');
        return;
    }
    
    closeCartHandler();
    
    if (checkoutPage) {
        checkoutPage.style.display = 'block';
        console.log('✅ تم فتح صفحة اتمام الشراء');
    }
    
    // إخفاء المحتوى الرئيسي
    const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
    if (mainContent) {
        mainContent.style.display = 'none';
    }
}

function backToCartHandler(e) {
    e.preventDefault();
    console.log('↩️ العودة إلى السلة');
    
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

// ========== نظام حفظ الطلبات في قاعدة البيانات ========== //

// دالة حفظ الطلب في قاعدة البيانات
async function saveOrderToDatabase(orderData) {
    try {
        console.log('📤 جاري إرسال الطلب إلى الخادم...', orderData);
        
        const response = await fetch('save_order.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });

        console.log('📡 حالة الرد:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`خطأ في الخادم: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('📦 استجابة الخادم:', result);
        
        if (result.success) {
            return {
                success: true,
                order_number: result.order_number,
                order_id: result.order_id,
                saved_in_db: true
            };
        } else {
            throw new Error(result.message || 'خطأ في حفظ الطلب');
        }
    } catch (error) {
        console.error('❌ خطأ في الاتصال بالخادم:', error);
        throw error;
    }
}

// دالة حفظ الطلب في localStorage - كنسخة احتياطية
function saveOrderToLocalStorage(orderData) {
    try {
        // إنشاء رقم طلب فريد
        const orderNumber = 'ORD-' + new Date().toISOString().slice(0,10).replace(/-/g, '') + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        
        // حفظ في localStorage
        const orders = JSON.parse(localStorage.getItem('perfume_orders') || '[]');
        const orderWithNumber = {
            ...orderData,
            order_number: orderNumber,
            order_date: new Date().toISOString(),
            status: 'معلق',
            saved_locally: true
        };
        
        orders.push(orderWithNumber);
        localStorage.setItem('perfume_orders', JSON.stringify(orders));
        
        console.log('✅ تم حفظ الطلب محلياً:', orderNumber);
        return {
            success: true,
            order_number: orderNumber,
            saved_locally: true
        };
    } catch (error) {
        console.error('❌ خطأ في الحفظ المحلي:', error);
        // العودة لرقم طلب بسيط
        return {
            success: true,
            order_number: 'ORDER-' + Date.now(),
            saved_locally: true
        };
    }
}

// دالة اتمام الطلب الرئيسية
async function completeOrderHandler() {
    console.log('بدء معالجة الطلب...');
    
    // تعطيل الزر لمنع النقر المتعدد
    const orderButton = document.getElementById('complete-order');
    const originalText = orderButton.textContent;
    orderButton.textContent = 'جاري المعالجة...';
    orderButton.disabled = true;
    
    // التحقق من النموذج بشكل مبسط
    if (!validateCheckoutFormSimple()) {
        showNotification('يرجى ملء جميع الحقول المطلوبة.', 'error');
        orderButton.textContent = originalText;
        orderButton.disabled = false;
        return;
    }
    
    // التحقق من وجود عناصر في السلة
    if (cart.length === 0) {
        showNotification('السلة فارغة. أضف منتجات قبل اتمام الشراء.', 'error');
        orderButton.textContent = originalText;
        orderButton.disabled = false;
        return;
    }
    
    const orderData = collectOrderData();
    
    console.log('بيانات الطلب:', orderData);
    
    try {
        showNotification('جاري معالجة طلبك وحفظه في قاعدة البيانات...', 'info');
        
        // محاولة الحفظ في قاعدة البيانات
        let saveResult = await saveOrderToDatabase(orderData);
        console.log('✅ تم الحفظ في قاعدة البيانات:', saveResult);
        
        let successMessage = `شكراً لك! تم استلام طلبك بنجاح. رقم الطلب: ${saveResult.order_number}`;
        successMessage += ' ✅ (محفوظ في قاعدة البيانات)';
        
        showNotification(successMessage, 'success');
        showOrderDetails(orderData, saveResult.order_number);
        resetAfterOrder();
        
    } catch (error) {
        console.error('❌ خطأ في اتمام الطلب:', error);
        
        // في حالة الخطأ، احفظ محلياً وأخبر المستخدم
        const localResult = saveOrderToLocalStorage(orderData);
        let message = `تم استلام طلبك! رقم الطلب: ${localResult.order_number} (سيتم المعالجة يدوياً)`;
        showNotification(message, 'warning');
        showOrderDetails(orderData, localResult.order_number);
        resetAfterOrder();
    } finally {
        orderButton.textContent = originalText;
        orderButton.disabled = false;
    }
}

// تحقق مبسط من النموذج
function validateCheckoutFormSimple() {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'cardNumber'];
    
    for (let fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
            field.classList.add('is-invalid');
            return false;
        } else {
            field.classList.remove('is-invalid');
        }
    }
    return true;
}

function collectOrderData() {
    const customer = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        postalCode: document.getElementById('postalCode').value
    };
    
    const payment = {
        cardNumber: document.getElementById('cardNumber').value,
        expiryDate: document.getElementById('expiryDate').value,
        cvv: document.getElementById('cvv').value
    };
    
    const discountRow = document.getElementById('discount-row');
    const discount = discountRow && discountRow.style.display !== 'none' ? 
        parseFloat(document.getElementById('discount-amount').textContent.replace('-', '').replace(' SAR', '')) || 0 : 0;
    
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.15;
    const total = subtotal + tax - discount;
    
    return {
        customer: customer,
        payment: payment,
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
        })),
        totals: {
            subtotal: subtotal,
            tax: tax,
            discount: discount,
            total: total
        },
        discountCode: document.getElementById('discount-code') ? document.getElementById('discount-code').value : null,
        orderDate: new Date().toISOString()
    };
}

// دالة لعرض تفاصيل الطلب
function showOrderDetails(orderData, orderNumber) {
    const orderDetails = `
        <div class="order-success">
            <div class="text-center mb-4">
                <i class="fas fa-check-circle text-success fa-4x mb-3"></i>
                <h3 class="text-success">تم تأكيد طلبك بنجاح!</h3>
                <p class="text-muted">رقم الطلب: <strong>${orderNumber}</strong></p>
            </div>
            
            <div class="row">
                <div class="col-md-6">
                    <h5>معلومات العميل:</h5>
                    <p><strong>الاسم:</strong> ${orderData.customer.firstName} ${orderData.customer.lastName}</p>
                    <p><strong>البريد الإلكتروني:</strong> ${orderData.customer.email}</p>
                    <p><strong>الهاتف:</strong> ${orderData.customer.phone}</p>
                    <p><strong>العنوان:</strong> ${orderData.customer.address}, ${orderData.customer.city}</p>
                </div>
                <div class="col-md-6">
                    <h5>تفاصيل الطلب:</h5>
                    <p><strong>عدد المنتجات:</strong> ${orderData.items.length}</p>
                    <p><strong>المجموع:</strong> ${orderData.totals.subtotal} SAR</p>
                    <p><strong>الضريبة:</strong> ${orderData.totals.tax} SAR</p>
                    <p><strong>الإجمالي:</strong> ${orderData.totals.total} SAR</p>
                </div>
            </div>
            
            <div class="mt-4">
                <h5>المنتجات المطلوبة:</h5>
                ${orderData.items.map(item => `
                    <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                        <div>${item.name}</div>
                        <div>${item.quantity} × ${item.price} SAR</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="text-center mt-4">
                <p class="text-muted">سيتم التواصل معك خلال 24 ساعة لتأكيد الشحن</p>
                <button class="btn btn-primary" onclick="closeOrderDetails()">موافق</button>
            </div>
        </div>
    `;
    
    // إنشاء عنصر لعرض التفاصيل
    const orderDetailsDiv = document.createElement('div');
    orderDetailsDiv.className = 'order-details-overlay';
    orderDetailsDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 1070;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;
    
    orderDetailsDiv.innerHTML = `
        <div style="background: white; border-radius: 15px; padding: 30px; max-width: 600px; width: 100%; max-height: 80vh; overflow-y: auto;">
            ${orderDetails}
        </div>
    `;
    
    document.body.appendChild(orderDetailsDiv);
}

// دالة لإغلاق تفاصيل الطلب
function closeOrderDetails() {
    const orderDetails = document.querySelector('.order-details-overlay');
    if (orderDetails) {
        orderDetails.remove();
    }
}

function resetAfterOrder() {
    cart = [];
    updateCart();
    resetCheckoutForm();
    
    const discountRow = document.getElementById('discount-row');
    const discountMessage = document.getElementById('discount-message');
    const discountCode = document.getElementById('discount-code');
    
    if (discountRow) discountRow.style.display = 'none';
    if (discountMessage) discountMessage.textContent = '';
    if (discountCode) discountCode.value = '';
    
    if (checkoutPage) {
        checkoutPage.style.display = 'none';
    }
    
    // إظهار المحتوى الرئيسي
    const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
    if (mainContent) {
        mainContent.style.display = 'block';
    }
}

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

// ========== نظام الخصم ========== //

function initializeDiscountSystem() {
    const discountButton = document.getElementById('apply-discount');
    
    if (discountButton) {
        discountButton.addEventListener('click', applyDiscount);
        console.log('✅ تم إعداد نظام الخصم');
    }
}

function applyDiscount() {
    const discountCodeInput = document.getElementById('discount-code');
    const discountMessage = document.getElementById('discount-message');
    const discountRow = document.getElementById('discount-row');
    const discountAmount = document.getElementById('discount-amount');
    
    if (!discountCodeInput || !discountMessage) return;
    
    const discountCode = discountCodeInput.value.trim();
    
    const validDiscounts = {
        'SAVE10': 10,
        'WELCOME15': 15, 
        'SPECIAL20': 20
    };
    
    if (!discountCode) {
        discountMessage.textContent = 'يرجى إدخال كود الخصم';
        discountMessage.className = 'mt-2 small text-danger';
        return;
    }
    
    if (discountCode in validDiscounts) {
        const discountPercent = validDiscounts[discountCode];
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const discountValue = (subtotal * discountPercent / 100);
        
        if (discountAmount) discountAmount.textContent = `-${discountValue.toFixed(2)} SAR`;
        if (discountRow) discountRow.style.display = 'flex';
        discountMessage.textContent = `🎉 تم تطبيق خصم ${discountPercent}% بنجاح!`;
        discountMessage.className = 'mt-2 small text-success';
        
        updateOrderTotalWithDiscount(discountValue);
        showNotification(`تم تطبيق خصم ${discountPercent}% على طلبك`);
    } else {
        discountMessage.textContent = '❌ كود الخصم غير صالح';
        discountMessage.className = 'mt-2 small text-danger';
        if (discountRow) discountRow.style.display = 'none';
        updateOrderTotalWithDiscount(0);
    }
}

function updateOrderTotalWithDiscount(discount = 0) {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = (subtotal - discount) * 0.15;
    const total = (subtotal - discount) + tax;
    
    if (document.getElementById('order-tax')) {
        document.getElementById('order-tax').textContent = `${tax.toFixed(2)} SAR`;
    }
    if (document.getElementById('order-total')) {
        document.getElementById('order-total').textContent = `${total.toFixed(2)} SAR`;
    }
}

// عرض الإشعارات
function showNotification(message, type = 'success') {
    const existingNotifications = document.querySelectorAll('.custom-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `custom-notification`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #ea70b1, #a20087)' : type === 'error' ? 'linear-gradient(135deg, #dc3545, #c82333)' : 'linear-gradient(135deg, #17a2b8, #138496)'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        border: none;
        font-weight: bold;
    `;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas ${icon} me-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// ========== دوال الاختبار ========== //

function testAddProducts() {
    const randomProduct1 = products[Math.floor(Math.random() * products.length)];
    const randomProduct2 = products[Math.floor(Math.random() * products.length)];
    
    addToCart({...randomProduct1, quantity: 1});
    addToCart({...randomProduct2, quantity: 2});
    
    showNotification('تم إضافة منتجات تجريبية للسلة 🧪');
}

function testCheckoutPage() {
    testAddProducts();
    setTimeout(() => {
        goToCheckout();
    }, 1000);
}

// جعل دوال الاختبار متاحة globally
window.testCart = testAddProducts;
window.testCheckout = testCheckoutPage;
window.openCart = openCart;
window.closeOrderDetails = closeOrderDetails;

console.log('🎉 نظام السلة جاهز! استخدم:');
console.log('   - testCart() لإضافة منتجات تجريبية');
console.log('   - testCheckout() لاختبار صفحة الدفع');
console.log('   - openCart() لفتح السلة');
















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
}











/*// نظام المصادقة - مع تسجيل الدخول والخروج
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
        // تعيين الألوان المخصصة
        const styles = `
            :root {
                --primary-color: #ea70b1;
                --secondary-color: #a20087;
                --light-color: #f8f9fa;
                --dark-color: #343a40;
            }
            
            .auth-primary { background-color: var(--primary-color) !important; }
            .auth-secondary { background-color: var(--secondary-color) !important; }
            
            .auth-primary:hover { background-color: var(--secondary-color) !important; }
            
            .text-primary { color: var(--primary-color) !important; }
            .text-secondary { color: var(--secondary-color) !important; }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupUserIconListener() {
        // البحث المحدد عن أيقونة fa-solid fa-user
        const userIcons = document.querySelectorAll('.fa-solid.fa-user');
        
        if (userIcons.length > 0) {
            userIcons.forEach(icon => {
                // العثور على الزر الأقرب الذي يحتوي على الأيقونة
                const button = icon.closest('button');
                if (button) {
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('✅ تم النقر على أيقونة المستخدم');
                        this.handleUserClick(button);
                    });
                    console.log('✅ تم ربط حدث النقر بأيقونة المستخدم');
                } else {
                    // إذا كانت الأيقونة نفسها قابلة للنقر
                    icon.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('✅ تم النقر على أيقونة المستخدم مباشرة');
                        this.handleUserClick(icon);
                    });
                    console.log('✅ تم ربط حدث النقر بالأيقونة مباشرة');
                }
            });
        } else {
            console.error('❌ لم يتم العثور على أيقونة fa-user!');
        }
    }

    handleUserClick(element) {
        if (this.isLoggedIn()) {
            this.showUserMenu(element);
        } else {
            this.showAuthModal();
        }
    }

    showUserMenu(icon) {
        // إزالة القائمة السابقة إذا كانت موجودة
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
                        <button class="user-menu-item" onclick="authSystem.showWishlist()">
                            <i class="fa-solid fa-heart"></i>
                            الإعجابات
                            <span class="menu-badge">${this.getRandomCount(0)}</span>
                        </button>
                        <button class="user-menu-item" onclick="authSystem.showOrders()">
                            <i class="fa-solid fa-box"></i>
                            الطلبات
                            <span class="menu-badge">${this.getRandomCount(0)}</span>
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
            
            <style>
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
                
                .section-title {
                    padding: 0 20px 10px 20px;
                    margin: 0;
                    font-size: 14px;
                    color: var(--secondary-color);
                    font-weight: bold;
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
                    color: #dc3545;
                    font-weight: bold;
                    margin-top: 0;
                }
                
                .logout-btn i {
                    color: #dc3545;
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
            </style>
        `;
        
        // إضافة القائمة بجانب الأيقونة
        const iconContainer = icon.closest('button') || icon;
        const container = iconContainer.parentNode;
        container.style.position = 'relative';
        container.insertAdjacentHTML('beforeend', menuHTML);
        
        const menu = container.querySelector('.user-menu');
        
        // إظهار القائمة
        setTimeout(() => {
            menu.style.display = 'block';
        }, 10);
        
        // إغلاق القائمة عند النقر خارجها
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

    // الدوال الجديدة للقائمة
    showProfile() {
        this.showMessage('جاري فتح صفحة حسابي...', 'success');
        console.log('👤 فتح صفحة حسابي');
    }

    showWishlist() {
        this.showMessage('جاري فتح قائمة الإعجابات...', 'success');
        console.log('❤️ فتح قائمة الإعجابات');
    }

    showOrders() {
        this.showMessage('جاري فتح الطلبات...', 'success');
        console.log('📦 فتح الطلبات');
    }

    showCertificates() {
        this.showMessage('جاري فتح الشهادات...', 'success');
        console.log('🏆 فتح الشهادات');
    }

    getRandomCount(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
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

                <style>
                    :root {
                        --primary-color: #ea70b1;
                        --secondary-color: #a20087;
                        --light-color: #f8f9fa;
                        --dark-color: #343a40;
                    }

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
                        max-width: 400px;
                        position: relative;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
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
                        margin-bottom: 20px;
                    }
                    
                    .input-group input {
                        width: 100%;
                        padding: 15px;
                        border: 2px solid #e0e0e0;
                        border-radius: 8px;
                        font-size: 14px;
                        transition: all 0.3s ease;
                    }
                    
                    .input-group input:focus {
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
                </style>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
    }

    setupModalEvents() {
        // إغلاق النافذة
        const authClose = document.getElementById('authClose');
        if (authClose) {
            authClose.addEventListener('click', () => this.closeAuthModal());
        }

        // التبديل بين النماذج
        const showRegister = document.getElementById('showRegister');
        const showLogin = document.getElementById('showLogin');
        
        if (showRegister) {
            showRegister.addEventListener('click', () => this.showRegisterForm());
        }
        if (showLogin) {
            showLogin.addEventListener('click', () => this.showLoginForm());
        }

        // نماذج التسجيل
        const loginForm = document.getElementById('loginFormElement');
        const registerForm = document.getElementById('registerFormElement');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // إغلاق عند النقر خارج النافذة
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.addEventListener('click', (e) => {
                if (e.target === authModal) {
                    this.closeAuthModal();
                }
            });
        }

        // إغلاق بـ ESC
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
            console.log('✅ نافذة التسجيل مفتوحة');
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
        
        await this.sendAuthRequest(formData, 'register');
    }

    async sendAuthRequest(formData, action) {
        try {
            console.log('🔄 إرسال طلب ' + action + '...');
            formData.append('action', action);
            
            const response = await fetch('auth.php', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('خطأ في الشبكة: ' + response.status);
            }
            
            const data = await response.json();
            console.log('✅ استجابة السيرفر:', data);
            
            if (data.success) {
                this.showMessage(data.message, 'success');
                this.closeAuthModal();
                
                // حفظ في localStorage
                localStorage.setItem('userLoggedIn', 'true');
                if (data.user) {
                    localStorage.setItem('userData', JSON.stringify(data.user));
                }
                
                // إعادة تحميل الصفحة
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
            console.log('🚪 جاري تسجيل الخروج...');
            
            const response = await fetch('auth.php?action=logout');
            
            // تحقق من أن الرد هو JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('❌ السيرفر لم يرجع JSON:', text);
                throw new Error('استجابة غير صحيحة من الخادم');
            }
            
            const data = await response.json();
            console.log('✅ استجابة تسجيل الخروج:', data);
            
            if (data.success) {
                this.showMessage(data.message, 'success');
                
                // مسح البيانات من localStorage
                localStorage.removeItem('userLoggedIn');
                localStorage.removeItem('userData');
                
                // إعادة تحميل الصفحة بعد ثانية
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                this.showMessage(data.message || 'حدث خطأ في تسجيل الخروج', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تسجيل الخروج:', error);
            
            // حتى لو فشل الاتصال بالسيرفر، مسح البيانات محلياً
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

    checkAuthStatus() {
        if (this.isLoggedIn()) {
            console.log('✅ المستخدم مسجل دخول');
            this.updateUIForLoggedInUser();
        } else {
            console.log('❌ المستخدم غير مسجل');
        }
    }

    updateUIForLoggedInUser() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        console.log('👤 المستخدم المسجل:', userData);
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
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
                'background: var(--primary-color);' : 
                'background: #dc3545;'
            }
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 4000);
    }
}

// بدء النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});




// نظام المصادقة - مع تسجيل الدخول والخروج ونسيت كلمة المرور
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
    }

    setCustomColors() {
        const styles = `
            :root {
                --primary-color: #ea70b1;
                --secondary-color: #a20087;
                --light-color: #f8f9fa;
                --dark-color: #343a40;
            }
            
            .auth-primary { background-color: var(--primary-color) !important; }
            .auth-secondary { background-color: var(--secondary-color) !important; }
            
            .auth-primary:hover { background-color: var(--secondary-color) !important; }
            
            .text-primary { color: var(--primary-color) !important; }
            .text-secondary { color: var(--secondary-color) !important; }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupUserIconListener() {
        const userIcons = document.querySelectorAll('.fa-solid.fa-user');
        
        if (userIcons.length > 0) {
            userIcons.forEach(icon => {
                const button = icon.closest('button');
                if (button) {
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('✅ تم النقر على أيقونة المستخدم');
                        this.handleUserClick(button);
                    });
                    console.log('✅ تم ربط حدث النقر بأيقونة المستخدم');
                } else {
                    icon.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('✅ تم النقر على أيقونة المستخدم مباشرة');
                        this.handleUserClick(icon);
                    });
                    console.log('✅ تم ربط حدث النقر بالأيقونة مباشرة');
                }
            });
        } else {
            console.error('❌ لم يتم العثور على أيقونة fa-user!');
        }
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
                
                <div class="menu-items">
                    <button class="user-menu-item" onclick="authSystem.showProfile()">
                        <i class="fa-solid fa-user"></i>
                        حسابي
                    </button>
                </div>
                
                <div class="menu-items">
                    <button class="user-menu-item logout-btn" onclick="authSystem.handleLogout()">
                        <i class="fa-solid fa-right-from-bracket"></i>
                        تسجيل الخروج
                    </button>
                </div>
            </div>
            
            <style>
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
                    color: #dc3545;
                    font-weight: bold;
                    margin-top: 0;
                }
                
                .logout-btn i {
                    color: #dc3545;
                }
                
                .logout-btn:hover {
                    background: #ffe6e6;
                }
            </style>
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

    createProfilePage() {
        const oldProfile = document.getElementById('profilePage');
        if (oldProfile) oldProfile.remove();

        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const profileData = JSON.parse(localStorage.getItem('profileData') || '{}');

        const profileHTML = `
            <div class="profile-page" id="profilePage">
                <div class="profile-header">
                    <button class="profile-back-btn" onclick="authSystem.closeProfile()">
                        <i class="fa-solid fa-arrow-right"></i>
                        رجوع
                    </button>
                    <h2>حسابي</h2>
                </div>
                
                <div class="profile-content">
                    <div class="profile-card">
                        <div class="profile-avatar">
                            <i class="fa-solid fa-user-circle"></i>
                        </div>
                        
                        <div class="profile-info">
                            <h3>${profileData.fullName || userData.name || 'مستخدم'}</h3>
                            <p>${userData.email || ''}</p>
                        </div>
                    </div>

                    <div class="profile-form">
                        <h4>معلومات الحساب</h4>
                        
                        <form id="profileForm">
                            <div class="form-group">
                                <label>الاسم الكامل</label>
                                <input type="text" id="fullName" value="${profileData.fullName || userData.name || ''}" placeholder="أدخل اسمك الكامل">
                            </div>
                            
                            <div class="form-group">
                                <label>البريد الإلكتروني</label>
                                <input type="email" id="email" value="${userData.email || ''}" readonly>
                                <small>لا يمكن تغيير البريد الإلكتروني</small>
                            </div>
                            
                            <div class="form-group">
                                <label>رقم الهاتف</label>
                                <input type="tel" id="phone" value="${profileData.phone || ''}" placeholder="أدخل رقم هاتفك">
                            </div>
                            
                            <div class="form-group">
                                <label>العنوان</label>
                                <textarea id="address" placeholder="أدخل عنوانك">${profileData.address || ''}</textarea>
                            </div>
                            
                            <div class="form-group">
                                <label>تاريخ الميلاد</label>
                                <input type="date" id="birthDate" value="${profileData.birthDate || ''}">
                            </div>
                            
                            <div class="form-actions">
                                <button type="button" class="cancel-btn" onclick="authSystem.closeProfile()">إلغاء</button>
                                <button type="submit" class="save-btn">حفظ التغييرات</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style>
                .profile-page {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: white;
                    z-index: 10000;
                    overflow-y: auto;
                }
                
                .profile-header {
                    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                    padding: 20px;
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                
                .profile-back-btn {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    padding: 8px 15px;
                    border-radius: 20px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s ease;
                }
                
                .profile-back-btn:hover {
                    background: rgba(255,255,255,0.3);
                }
                
                .profile-header h2 {
                    margin: 0;
                    font-size: 24px;
                }
                
                .profile-content {
                    padding: 20px;
                    max-width: 600px;
                    margin: 0 auto;
                }
                
                .profile-card {
                    background: white;
                    border-radius: 15px;
                    padding: 25px;
                    text-align: center;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
                    margin-bottom: 25px;
                    border: 2px solid var(--light-color);
                }
                
                .profile-avatar {
                    margin-bottom: 15px;
                }
                
                .profile-avatar i {
                    font-size: 80px;
                    color: var(--primary-color);
                }
                
                .profile-info h3 {
                    margin: 0 0 5px 0;
                    color: var(--dark-color);
                    font-size: 20px;
                }
                
                .profile-info p {
                    margin: 0;
                    color: #666;
                    font-size: 14px;
                }
                
                .profile-form {
                    background: white;
                    border-radius: 15px;
                    padding: 25px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
                    margin-bottom: 25px;
                    border: 2px solid var(--light-color);
                }
                
                .profile-form h4 {
                    margin: 0 0 20px 0;
                    color: var(--secondary-color);
                    font-size: 18px;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 10px;
                }
                
                .form-group {
                    margin-bottom: 20px;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    color: var(--dark-color);
                    font-weight: bold;
                    font-size: 14px;
                }
                
                .form-group input,
                .form-group textarea {
                    width: 100%;
                    padding: 12px 15px;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: all 0.3s ease;
                    box-sizing: border-box;
                }
                
                .form-group input:focus,
                .form-group textarea:focus {
                    border-color: var(--primary-color);
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
                }
                
                .form-group input[readonly] {
                    background-color: #f8f9fa;
                    color: #666;
                }
                
                .form-group textarea {
                    resize: vertical;
                    min-height: 80px;
                }
                
                .form-group small {
                    display: block;
                    margin-top: 5px;
                    color: #888;
                    font-size: 12px;
                }
                
                .form-actions {
                    display: flex;
                    gap: 15px;
                    margin-top: 25px;
                }
                
                .save-btn {
                    flex: 1;
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    padding: 12px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .save-btn:hover {
                    background: var(--secondary-color);
                    transform: translateY(-2px);
                }
                
                .cancel-btn {
                    flex: 1;
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 12px;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .cancel-btn:hover {
                    background: #5a6268;
                }
                
                @media (max-width: 768px) {
                    .profile-content {
                        padding: 15px;
                    }
                    
                    .form-actions {
                        flex-direction: column;
                    }
                }
            </style>
        `;

        document.body.insertAdjacentHTML('beforeend', profileHTML);

        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => this.saveProfile(e));
        }

        document.body.style.overflow = 'hidden';
    }

    async saveProfile(e) {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('fullname', document.getElementById('fullName').value);
        formData.append('phone', document.getElementById('phone').value);
        formData.append('address', document.getElementById('address').value);
        formData.append('birth_date', document.getElementById('birthDate').value);
        formData.append('action', 'update_profile');
        
        try {
            const response = await fetch('auth.php', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showMessage(data.message, 'success');
                
                // تحديث البيانات المحلية
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                userData.name = document.getElementById('fullName').value;
                localStorage.setItem('userData', JSON.stringify(userData));
                
                // حفظ البيانات الإضافية محلياً
                const profileData = {
                    fullName: document.getElementById('fullName').value,
                    phone: document.getElementById('phone').value,
                    address: document.getElementById('address').value,
                    birthDate: document.getElementById('birthDate').value,
                    updatedAt: new Date().toLocaleString('ar-SA')
                };
                localStorage.setItem('profileData', JSON.stringify(profileData));
                
                setTimeout(() => {
                    this.closeProfile();
                }, 1500);
            } else {
                this.showMessage(data.message, 'error');
            }
        } catch (error) {
            console.error('❌ خطأ:', error);
            this.showMessage('حدث خطأ في حفظ البيانات', 'error');
        }
    }

    closeProfile() {
        const profilePage = document.getElementById('profilePage');
        if (profilePage) {
            profilePage.remove();
        }
        document.body.style.overflow = 'auto';
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
                                <div class="auth-options">
                                    <a href="#" class="forgot-password" id="showForgotPassword">نسيت كلمة المرور؟</a>
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

                        <div class="auth-form" id="forgotPasswordForm">
                            <h3 class="text-primary">نسيت كلمة المرور</h3>
                            <form id="forgotPasswordFormElement">
                                <div class="input-group">
                                    <input type="email" name="email" placeholder="أدخل بريدك الإلكتروني" required>
                                </div>
                                <button type="submit" class="auth-btn auth-primary">
                                    <i class="fa-solid fa-key"></i>
                                    إرسال رابط إعادة التعيين
                                </button>
                            </form>
                            <div class="auth-switch">
                                تذكرت كلمة المرور؟ 
                                <span class="switch-link text-primary" id="showLoginFromForgot">تسجيل الدخول</span>
                            </div>
                        </div>
                    </div>
                </div>

                <style>
                    :root {
                        --primary-color: #ea70b1;
                        --secondary-color: #a20087;
                        --light-color: #f8f9fa;
                        --dark-color: #343a40;
                    }

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
                        max-width: 400px;
                        position: relative;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
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
                        margin-bottom: 20px;
                    }
                    
                    .input-group input {
                        width: 100%;
                        padding: 15px;
                        border: 2px solid #e0e0e0;
                        border-radius: 8px;
                        font-size: 14px;
                        transition: all 0.3s ease;
                    }
                    
                    .input-group input:focus {
                        border-color: var(--primary-color);
                        outline: none;
                        box-shadow: 0 0 0 3px rgba(234, 112, 177, 0.1);
                    }
                    
                    .auth-options {
                        text-align: left;
                        margin-bottom: 20px;
                    }
                    
                    .forgot-password {
                        color: var(--primary-color);
                        text-decoration: none;
                        font-size: 14px;
                        transition: color 0.3s ease;
                    }
                    
                    .forgot-password:hover {
                        color: var(--secondary-color);
                        text-decoration: underline;
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
                        text-decoration: none;
                        display: inline-block;
                        margin-right: 5px;
                        margin-left: 5px;
                        border: none;
                        background: none;
                    }
                    
                    .switch-link:hover {
                        color: var(--secondary-color);
                        text-decoration: underline;
                    }
                    
                    @keyframes fadeIn {
                        from { opacity: 0; transform: scale(0.9); }
                        to { opacity: 1; transform: scale(1); }
                    }
                </style>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
    }

    setupModalEvents() {
        const authClose = document.getElementById('authClose');
        if (authClose) {
            authClose.addEventListener('click', () => this.closeAuthModal());
        }

        const showRegister = document.getElementById('showRegister');
        const showLogin = document.getElementById('showLogin');
        const showForgotPassword = document.getElementById('showForgotPassword');
        const showLoginFromForgot = document.getElementById('showLoginFromForgot');
        
        if (showRegister) {
            showRegister.addEventListener('click', () => this.showRegisterForm());
        }
        if (showLogin) {
            showLogin.addEventListener('click', () => this.showLoginForm());
        }
        if (showForgotPassword) {
            showForgotPassword.addEventListener('click', (e) => {
                e.preventDefault();
                this.showForgotPasswordForm();
            });
        }
        if (showLoginFromForgot) {
            showLoginFromForgot.addEventListener('click', () => this.showLoginForm());
        }

        const loginForm = document.getElementById('loginFormElement');
        const registerForm = document.getElementById('registerFormElement');
        const forgotPasswordForm = document.getElementById('forgotPasswordFormElement');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
        if (forgotPasswordForm) {
            forgotPasswordForm.addEventListener('submit', (e) => this.handleForgotPassword(e));
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
            console.log('✅ نافذة التسجيل مفتوحة');
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
        document.getElementById('forgotPasswordForm').classList.remove('active');
    }

    showRegisterForm() {
        document.getElementById('loginForm').classList.remove('active');
        document.getElementById('registerForm').classList.add('active');
        document.getElementById('forgotPasswordForm').classList.remove('active');
    }

    showForgotPasswordForm() {
        document.getElementById('loginForm').classList.remove('active');
        document.getElementById('registerForm').classList.remove('active');
        document.getElementById('forgotPasswordForm').classList.add('active');
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
        
        await this.sendAuthRequest(formData, 'register');
    }

    async handleForgotPassword(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        this.showMessage('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني', 'success');
        this.closeAuthModal();
    }

    async sendAuthRequest(formData, action) {
        try {
            console.log('🔄 إرسال طلب ' + action + '...');
            formData.append('action', action);
            
            const response = await fetch('auth.php', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('خطأ في الشبكة: ' + response.status);
            }
            
            const data = await response.json();
            console.log('✅ استجابة السيرفر:', data);
            
            if (data.success) {
                this.showMessage(data.message, 'success');
                this.closeAuthModal();
                
                // حفظ في localStorage
                localStorage.setItem('userLoggedIn', 'true');
                if (data.user) {
                    localStorage.setItem('userData', JSON.stringify(data.user));
                }
                
                // إعادة تحميل الصفحة
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
            console.log('🚪 جاري تسجيل الخروج...');
            
            const response = await fetch('auth.php?action=logout');
            
            if (!response.ok) {
                throw new Error('خطأ في الشبكة: ' + response.status);
            }
            
            const data = await response.json();
            console.log('✅ استجابة تسجيل الخروج:', data);
            
            if (data.success) {
                this.showMessage(data.message, 'success');
            }
            
            // مسح البيانات من localStorage في جميع الأحوال
            this.clearLocalData();
            
            // إعادة تحميل الصفحة بعد ثانية
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            
        } catch (error) {
            console.error('❌ خطأ في تسجيل الخروج:', error);
            
            // حتى لو فشل الاتصال بالسيرفر، مسح البيانات محلياً
            this.clearLocalData();
            this.showMessage('تم تسجيل الخروج', 'success');
            
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }

    clearLocalData() {
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userData');
        localStorage.removeItem('profileData');
    }

    isLoggedIn() {
        return localStorage.getItem('userLoggedIn') === 'true';
    }

    checkAuthStatus() {
        if (this.isLoggedIn()) {
            console.log('✅ المستخدم مسجل دخول');
            this.updateUIForLoggedInUser();
        } else {
            console.log('❌ المستخدم غير مسجل');
        }
    }

    updateUIForLoggedInUser() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        console.log('👤 المستخدم المسجل:', userData);
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
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
                'background: var(--primary-color);' : 
                'background: #dc3545;'
            }
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 4000);
    }

    showProfile() {
        this.createProfilePage();
    }
}

// بدء النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});*/

// نظام المصادقة الكامل
/*class AuthSystem {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 بدء نظام المصادقة...');
        this.createAuthModal();
        this.setupUserIconListener();
        this.setupModalEvents();
        this.checkAuthStatus();
    }

    setupUserIconListener() {
        // البحث عن أي أيقونة مستخدم والنقر عليها
        document.addEventListener('click', (e) => {
            const userIcon = e.target.closest('.fa-user, .fa-solid.fa-user, [class*="user"]');
            if (userIcon) {
                e.preventDefault();
                e.stopPropagation();
                this.handleUserClick(userIcon);
            }
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
                    <div class="user-avatar"><i class="fa-solid fa-user-circle"></i></div>
                    <div class="user-details">
                        <strong>${userData.full_name || 'مستخدم'}</strong>
                        <small>${userData.email || ''}</small>
                    </div>
                </div>
                <div class="menu-items">
                    <button class="user-menu-item" onclick="authSystem.showProfile()">
                        <i class="fa-solid fa-user"></i> حسابي
                    </button>
                    <button class="user-menu-item" onclick="authSystem.showOrders()">
                        <i class="fa-solid fa-box"></i> طلباتي
                    </button>
                </div>
                <div class="menu-items">
                    <button class="user-menu-item logout-btn" onclick="authSystem.handleLogout()">
                        <i class="fa-solid fa-right-from-bracket"></i> تسجيل الخروج
                    </button>
                </div>
            </div>
            <style>
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
                    border: 2px solid #ea70b1;
                    overflow: hidden;
                }
                .user-header {
                    background: linear-gradient(135deg, #ea70b1, #a20087);
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
                .user-details strong {
                    display: block;
                    font-size: 16px;
                    margin-bottom: 4px;
                }
                .user-details small {
                    font-size: 12px;
                    opacity: 0.8;
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
                    border-bottom: 1px solid #f8f8f8;
                }
                .user-menu-item:last-child {
                    border-bottom: none;
                }
                .user-menu-item i {
                    width: 20px;
                    text-align: center;
                    color: #ea70b1;
                    font-size: 16px;
                }
                .user-menu-item:hover {
                    background: #f8f9fa;
                    transform: translateX(-5px);
                }
                .user-menu-item:hover i {
                    color: #a20087;
                }
                .logout-btn {
                    color: #dc3545;
                    font-weight: bold;
                }
                .logout-btn i {
                    color: #dc3545;
                }
                .logout-btn:hover {
                    background: #ffe6e6;
                }
            </style>
        `;
        
        const iconContainer = icon.closest('button') || icon;
        const container = iconContainer.parentNode;
        container.style.position = 'relative';
        container.insertAdjacentHTML('beforeend', menuHTML);
        
        // إغلاق القائمة عند النقر خارجها
        setTimeout(() => {
            document.addEventListener('click', (e) => {
                if (!container.contains(e.target)) {
                    const menu = container.querySelector('.user-menu');
                    if (menu) menu.remove();
                }
            });
        }, 100);
    }

    createAuthModal() {
        if (!document.getElementById('authModal')) {
            const modalHTML = `
                <div class="auth-modal" id="authModal">
                    <div class="auth-content">
                        <button class="auth-close" id="authClose">×</button>
                        
                        <!-- نموذج تسجيل الدخول -->
                        <div class="auth-form active" id="loginForm">
                            <h3 style="color: #ea70b1; text-align: center; margin-bottom: 25px;">تسجيل الدخول</h3>
                            <form id="loginFormElement">
                                <div class="input-group">
                                    <input type="email" name="email" placeholder="البريد الإلكتروني" required 
                                           style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                </div>
                                <div class="input-group">
                                    <input type="password" name="password" placeholder="كلمة المرور" required 
                                           style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                </div>
                                <button type="submit" 
                                        style="width: 100%; padding: 15px; background: #ea70b1; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold; margin-bottom: 20px;">
                                    <i class="fa-solid fa-right-to-bracket"></i> تسجيل الدخول
                                </button>
                            </form>
                            <div style="text-align: center; margin-top: 25px; color: #343a40; font-size: 14px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                                ليس لديك حساب؟ 
                                <span style="color: #ea70b1; cursor: pointer; font-weight: bold;" id="showRegister">إنشاء حساب</span>
                            </div>
                        </div>
                        
                        <!-- نموذج التسجيل -->
                        <div class="auth-form" id="registerForm">
                            <h3 style="color: #ea70b1; text-align: center; margin-bottom: 25px;">إنشاء حساب جديد</h3>
                            <form id="registerFormElement">
                                <div class="input-group">
                                    <input type="text" name="fullname" placeholder="الاسم الكامل" required 
                                           style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                </div>
                                <div class="input-group">
                                    <input type="email" name="email" placeholder="البريد الإلكتروني" required 
                                           style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                </div>
                                <div class="input-group">
                                    <input type="password" name="password" placeholder="كلمة المرور" required 
                                           style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                </div>
                                <div class="input-group">
                                    <input type="password" name="confirm_password" placeholder="تأكيد كلمة المرور" required 
                                           style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                </div>
                                <button type="submit" 
                                        style="width: 100%; padding: 15px; background: #ea70b1; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold; margin-bottom: 20px;">
                                    <i class="fa-solid fa-user-plus"></i> إنشاء حساب
                                </button>
                            </form>
                            <div style="text-align: center; margin-top: 25px; color: #343a40; font-size: 14px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                                لديك حساب بالفعل؟ 
                                <span style="color: #ea70b1; cursor: pointer; font-weight: bold;" id="showLogin">تسجيل الدخول</span>
                            </div>
                        </div>
                    </div>
                </div>
                <style>
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
                    }
                    .auth-content {
                        background: white;
                        padding: 30px;
                        border-radius: 15px;
                        width: 90%;
                        max-width: 400px;
                        position: relative;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    }
                    .auth-close {
                        position: absolute;
                        top: 10px;
                        left: 10px;
                        background: #ea70b1;
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
                    }
                    .auth-close:hover {
                        background: #a20087;
                    }
                    .auth-form {
                        display: none;
                    }
                    .auth-form.active {
                        display: block;
                    }
                    .input-group {
                        margin-bottom: 20px;
                    }
                    .auth-btn:hover {
                        background: #a20087;
                    }
                </style>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
    }

    setupModalEvents() {
        // أحداث الأزرار
        document.getElementById('authClose')?.addEventListener('click', () => this.closeAuthModal());
        document.getElementById('showRegister')?.addEventListener('click', () => this.showRegisterForm());
        document.getElementById('showLogin')?.addEventListener('click', () => this.showLoginForm());

        // أحداث النماذج
        document.getElementById('loginFormElement')?.addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerFormElement')?.addEventListener('submit', (e) => this.handleRegister(e));

        // إغلاق بالنقر خارج النافذة
        document.getElementById('authModal')?.addEventListener('click', (e) => {
            if (e.target === document.getElementById('authModal')) {
                this.closeAuthModal();
            }
        });

        // إغلاق بالضغط على Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAuthModal();
            }
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        console.log('🔐 محاولة تسجيل الدخول...');
        
        const formData = new FormData(e.target);
        console.log('📤 بيانات تسجيل الدخول:', Object.fromEntries(formData));
        
        await this.sendAuthRequest(formData, 'login');
    }

    async handleRegister(e) {
        e.preventDefault();
        console.log('📝 محاولة تسجيل جديد...');
        
        const formData = new FormData(e.target);
        console.log('📤 بيانات التسجيل:', Object.fromEntries(formData));
        
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm_password');
        
        if (password !== confirmPassword) {
            this.showMessage('كلمات المرور غير متطابقة!', 'error');
            return;
        }
        
        await this.sendAuthRequest(formData, 'register');
    }

    async sendAuthRequest(formData, action) {
        try {
            console.log(`🔄 إرسال طلب ${action} إلى السيرفر...`);
            
            // إضافة action إلى FormData
            formData.append('action', action);
            
            const response = await fetch('auth.php', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`خطأ في السيرفر: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ استجابة السيرفر:', data);
            
            if (data.success) {
                this.showMessage(data.message, 'success');
                this.closeAuthModal();
                
                // حفظ البيانات في localStorage
                localStorage.setItem('userLoggedIn', 'true');
                if (data.user) {
                    localStorage.setItem('userData', JSON.stringify(data.user));
                }
                if (data.session_token) {
                    localStorage.setItem('sessionToken', data.session_token);
                }
                
                // إعادة تحميل الصفحة بعد نجاح التسجيل/الدخول
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
                
            } else {
                this.showMessage(data.message, 'error');
            }
            
        } catch (error) {
            console.error('❌ خطأ في الاتصال:', error);
            this.showMessage('حدث خطأ في الاتصال بالخادم', 'error');
        }
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
        }
        this.showLoginForm();
    }

    showLoginForm() {
        document.getElementById('loginForm').classList.add('active');
        document.getElementById('registerForm').classList.remove('active');
    }

    showRegisterForm() {
        document.getElementById('loginForm').classList.remove('active');
        document.getElementById('registerForm').classList.add('active');
    }

    async handleLogout() {
        try {
            const sessionToken = localStorage.getItem('sessionToken');
            if (sessionToken) {
                await fetch(`auth.php?action=logout&token=${sessionToken}`);
            }
        } catch (error) {
            console.error('خطأ في تسجيل الخروج:', error);
        } finally {
            // مسح جميع البيانات المحلية
            localStorage.removeItem('userLoggedIn');
            localStorage.removeItem('userData');
            localStorage.removeItem('sessionToken');
            localStorage.removeItem('profileData');
            
            this.showMessage('تم تسجيل الخروج بنجاح', 'success');
            
            // إعادة تحميل الصفحة
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }

    isLoggedIn() {
        return localStorage.getItem('userLoggedIn') === 'true';
    }

    checkAuthStatus() {
        if (this.isLoggedIn()) {
            console.log('✅ المستخدم مسجل دخول');
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            console.log('👤 بيانات المستخدم:', userData);
        } else {
            console.log('❌ المستخدم غير مسجل');
        }
    }

    showMessage(message, type) {
        // إزالة أي رسائل سابقة
        const oldMessages = document.querySelectorAll('.auth-message');
        oldMessages.forEach(msg => msg.remove());
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'auth-message';
        messageDiv.textContent = message;
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
            background: ${type === 'success' ? '#ea70b1' : '#dc3545'};
        `;
        
        document.body.appendChild(messageDiv);
        
        // إزالة الرسالة بعد 4 ثواني
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 4000);
    }

    showProfile() {
        this.showMessage('صفحة الملف الشخصي قريباً', 'info');
    }

    showOrders() {
        this.showMessage('صفحة الطلبات قريباً', 'info');
    }
}

// بدء النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});*/














































































































































































// نظام المصادقة الكامل
/*class AuthSystem {
    constructor() {
        this.apiUrl = this.getApiUrl();
        this.init();
    }

    getApiUrl() {
        // جرب مسارات مختلفة لملف auth.php
        const currentPath = window.location.pathname;
        const directory = currentPath.substring(0, currentPath.lastIndexOf('/'));
        
        const possiblePaths = [
            'auth.php',
            './auth.php',
            directory + '/auth.php',
            window.location.origin + '/auth.php'
        ];
        
        console.log('🔍 البحث عن ملف auth.php في المسارات:', possiblePaths);
        return possiblePaths[0]; // استخدم المسار الأول
    }

    init() {
        console.log('🚀 بدء نظام المصادقة...');
        console.log('📡 رابط API:', this.apiUrl);
        this.createAuthModal();
        this.createProfileModal();
        this.setupUserIconListener();
        this.setupModalEvents();
        this.checkAuthStatus();
        
        // اختبار الاتصال عند التحميل
        this.testConnection();
    }

    async testConnection() {
        try {
            console.log('🔍 اختبار الاتصال بالخادم...');
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'action=test'
            });
            
            const text = await response.text();
            console.log('📄 استجابة الخادم:', text);
            
            try {
                const data = JSON.parse(text);
                if (data.success) {
                    console.log('✅ الاتصال بالخادم ناجح');
                    this.showMessage('الاتصال بالخادم ناجح', 'success', 3000);
                } else {
                    console.warn('⚠️ الخادم أجاب ولكن بحالة خطأ:', data.message);
                    this.showMessage('خادم المصادقة يعمل ولكن هناك مشكلة: ' + data.message, 'error');
                }
            } catch (e) {
                console.error('❌ الخادم لم يرد بـ JSON. الاستجابة:', text.substring(0, 200));
                this.showMessage('ملف auth.php غير موجود أو به خطأ. تأكد من:', 'error');
                setTimeout(() => {
                    this.showMessage('1. وضع ملف auth.php في نفس مجلد الصفحة', 'info');
                }, 3000);
                setTimeout(() => {
                    this.showMessage('2. تشغيل خادم ويب (XAMPP, WAMP, etc.)', 'info');
                }, 6000);
            }
        } catch (error) {
            console.error('❌ فشل الاتصال بالخادم:', error);
            this.showMessage('تعذر الاتصال بالخادم. تأكد من:', 'error');
            setTimeout(() => {
                this.showMessage('1. وضع ملف auth.php في نفس مجلد الصفحة', 'info');
            }, 3000);
            setTimeout(() => {
                this.showMessage('2. تشغيل خادم ويب (XAMPP, WAMP, etc.)', 'info');
            }, 6000);
            setTimeout(() => {
                this.showMessage('3. فتح الصفحة عبر http://localhost وليس file://', 'info');
            }, 9000);
        }
    }

    setupUserIconListener() {
        // البحث عن أي أيقونة مستخدم والنقر عليها
        document.addEventListener('click', (e) => {
            const userIcon = e.target.closest('.fa-user, .fa-solid.fa-user, [class*="user"]');
            if (userIcon) {
                e.preventDefault();
                e.stopPropagation();
                this.handleUserClick(userIcon);
            }
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
                    <div class="user-avatar"><i class="fa-solid fa-user-circle"></i></div>
                    <div class="user-details">
                        <strong>${userData.full_name || 'مستخدم'}</strong>
                        <small>${userData.email || ''}</small>
                    </div>
                </div>
                <div class="menu-items">
                    <button class="user-menu-item" onclick="authSystem.showProfile()">
                        <i class="fa-solid fa-user"></i> حسابي
                    </button>
                    <button class="user-menu-item" onclick="authSystem.showOrders()">
                        <i class="fa-solid fa-box"></i> طلباتي
                    </button>
                </div>
                <div class="menu-items">
                    <button class="user-menu-item logout-btn" onclick="authSystem.handleLogout()">
                        <i class="fa-solid fa-right-from-bracket"></i> تسجيل الخروج
                    </button>
                </div>
            </div>
            <style>
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
                    border: 2px solid #ea70b1;
                    overflow: hidden;
                }
                .user-header {
                    background: linear-gradient(135deg, #ea70b1, #a20087);
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
                .user-details strong {
                    display: block;
                    font-size: 16px;
                    margin-bottom: 4px;
                }
                .user-details small {
                    font-size: 12px;
                    opacity: 0.8;
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
                    border-bottom: 1px solid #f8f8f8;
                }
                .user-menu-item:last-child {
                    border-bottom: none;
                }
                .user-menu-item i {
                    width: 20px;
                    text-align: center;
                    color: #ea70b1;
                    font-size: 16px;
                }
                .user-menu-item:hover {
                    background: #f8f9fa;
                    transform: translateX(-5px);
                }
                .user-menu-item:hover i {
                    color: #a20087;
                }
                .logout-btn {
                    color: #dc3545;
                    font-weight: bold;
                }
                .logout-btn i {
                    color: #dc3545;
                }
                .logout-btn:hover {
                    background: #ffe6e6;
                }
            </style>
        `;
        
        const iconContainer = icon.closest('button') || icon;
        const container = iconContainer.parentNode;
        container.style.position = 'relative';
        container.insertAdjacentHTML('beforeend', menuHTML);
        
        // إغلاق القائمة عند النقر خارجها
        setTimeout(() => {
            document.addEventListener('click', (e) => {
                if (!container.contains(e.target)) {
                    const menu = container.querySelector('.user-menu');
                    if (menu) menu.remove();
                }
            });
        }, 100);
    }

    createAuthModal() {
        if (!document.getElementById('authModal')) {
            const modalHTML = `
                <div class="auth-modal" id="authModal">
                    <div class="auth-content">
                        <button class="auth-close" id="authClose">×</button>
                        
                        <!-- نموذج تسجيل الدخول -->
                        <div class="auth-form active" id="loginForm">
                            <h3 style="color: #ea70b1; text-align: center; margin-bottom: 25px;">تسجيل الدخول</h3>
                            <form id="loginFormElement">
                                <div class="input-group">
                                    <input type="email" name="email" placeholder="البريد الإلكتروني" required 
                                           style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                </div>
                                <div class="input-group">
                                    <input type="password" name="password" placeholder="كلمة المرور" required 
                                           style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                </div>
                                <button type="submit" class="auth-submit-btn">
                                    <i class="fa-solid fa-right-to-bracket"></i> تسجيل الدخول
                                </button>
                            </form>
                            <div style="text-align: center; margin: 15px 0;">
                                <span style="color: #ea70b1; cursor: pointer; font-weight: bold; font-size: 14px;" id="showForgotPassword">
                                    <i class="fa-solid fa-key"></i> نسيت كلمة المرور؟
                                </span>
                            </div>
                            <div style="text-align: center; margin-top: 20px; color: #343a40; font-size: 14px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                                ليس لديك حساب؟ 
                                <span style="color: #ea70b1; cursor: pointer; font-weight: bold;" id="showRegister">إنشاء حساب</span>
                            </div>
                        </div>
                        
                        <!-- نموذج التسجيل -->
                        <div class="auth-form" id="registerForm">
                            <h3 style="color: #ea70b1; text-align: center; margin-bottom: 25px;">إنشاء حساب جديد</h3>
                            <form id="registerFormElement">
                                <div class="input-group">
                                    <input type="text" name="fullname" placeholder="الاسم الكامل" required 
                                           style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                </div>
                                <div class="input-group">
                                    <input type="email" name="email" placeholder="البريد الإلكتروني" required 
                                           style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                </div>
                                <div class="input-group">
                                    <input type="password" name="password" placeholder="كلمة المرور" required 
                                           style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                </div>
                                <div class="input-group">
                                    <input type="password" name="confirm_password" placeholder="تأكيد كلمة المرور" required 
                                           style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                </div>
                                <button type="submit" class="auth-submit-btn">
                                    <i class="fa-solid fa-user-plus"></i> إنشاء حساب
                                </button>
                            </form>
                            <div style="text-align: center; margin-top: 25px; color: #343a40; font-size: 14px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                                لديك حساب بالفعل؟ 
                                <span style="color: #ea70b1; cursor: pointer; font-weight: bold;" id="showLogin">تسجيل الدخول</span>
                            </div>
                        </div>

                        <!-- نموذج نسيت كلمة المرور -->
                        <div class="auth-form" id="forgotPasswordForm">
                            <h3 style="color: #ea70b1; text-align: center; margin-bottom: 25px;">استعادة كلمة المرور</h3>
                            <form id="forgotPasswordFormElement">
                                <div class="input-group">
                                    <input type="email" name="email" placeholder="أدخل بريدك الإلكتروني" required 
                                           style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                </div>
                                <button type="submit" class="auth-submit-btn">
                                    <i class="fa-solid fa-paper-plane"></i> إرسال رابط الاستعادة
                                </button>
                            </form>
                            <div style="text-align: center; margin: 15px 0;">
                                <span style="color: #666; font-size: 13px;">
                                    سنرسل لك رابطاً لإعادة تعيين كلمة المرور
                                </span>
                            </div>
                            <div style="text-align: center; margin-top: 20px; color: #343a40; font-size: 14px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                                تذكرت كلمة المرور؟ 
                                <span style="color: #ea70b1; cursor: pointer; font-weight: bold;" id="showLoginFromForgot">تسجيل الدخول</span>
                            </div>
                        </div>

                        <!-- نموذج إعادة تعيين كلمة المرور -->
                        <div class="auth-form" id="resetPasswordForm">
                            <h3 style="color: #ea70b1; text-align: center; margin-bottom: 25px;">تعيين كلمة مرور جديدة</h3>
                            <form id="resetPasswordFormElement">
                                <div class="input-group">
                                    <input type="password" name="new_password" placeholder="كلمة المرور الجديدة" required 
                                           style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                </div>
                                <div class="input-group">
                                    <input type="password" name="confirm_new_password" placeholder="تأكيد كلمة المرور الجديدة" required 
                                           style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                </div>
                                <input type="hidden" name="reset_token" id="resetTokenInput">
                                <button type="submit" class="auth-submit-btn">
                                    <i class="fa-solid fa-key"></i> تعيين كلمة المرور
                                </button>
                            </form>
                            <div style="text-align: center; margin-top: 25px; color: #343a40; font-size: 14px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                                <span style="color: #ea70b1; cursor: pointer; font-weight: bold;" id="showLoginFromReset">العودة لتسجيل الدخول</span>
                            </div>
                        </div>
                    </div>
                </div>
                <style>
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
                    }
                    .auth-content {
                        background: white;
                        padding: 30px;
                        border-radius: 15px;
                        width: 90%;
                        max-width: 400px;
                        position: relative;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    }
                    .auth-close {
                        position: absolute;
                        top: 10px;
                        left: 10px;
                        background: #ea70b1;
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
                    }
                    .auth-close:hover {
                        background: #a20087;
                    }
                    .auth-form {
                        display: none;
                    }
                    .auth-form.active {
                        display: block;
                    }
                    .input-group {
                        margin-bottom: 20px;
                    }
                    .auth-submit-btn {
                        width: 100%;
                        padding: 15px;
                        background: #ea70b1;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: bold;
                        margin-bottom: 15px;
                        transition: background 0.3s ease;
                    }
                    .auth-submit-btn:hover {
                        background: #a20087;
                    }
                    .auth-submit-btn:disabled {
                        background: #ccc;
                        cursor: not-allowed;
                    }
                    .loading {
                        opacity: 0.7;
                        pointer-events: none;
                    }
                </style>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
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
                            <h3 style="color: #ea70b1; text-align: center; margin: 15px 0;">الملف الشخصي</h3>
                        </div>

                        <form id="profileFormElement">
                            <div class="input-group">
                                <label style="display: block; margin-bottom: 8px; color: #333; font-weight: bold;">الاسم الكامل</label>
                                <input type="text" name="full_name" id="profileFullName" required 
                                       style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                            </div>
                            
                            <div class="input-group">
                                <label style="display: block; margin-bottom: 8px; color: #333; font-weight: bold;">البريد الإلكتروني</label>
                                <input type="email" name="email" id="profileEmail" required 
                                       style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                            </div>
                            
                            <div class="input-group">
                                <label style="display: block; margin-bottom: 8px; color: #333; font-weight: bold;">رقم الهاتف</label>
                                <input type="tel" name="phone" id="profilePhone" 
                                       style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;" 
                                       placeholder="أدخل رقم هاتفك">
                            </div>
                            
                            <div class="input-group">
                                <label style="display: block; margin-bottom: 8px; color: #333; font-weight: bold;">العنوان</label>
                                <textarea name="address" id="profileAddress" rows="3" 
                                          style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; resize: vertical;" 
                                          placeholder="أدخل عنوانك"></textarea>
                            </div>
                            
                            <div class="input-group">
                                <label style="display: block; margin-bottom: 8px; color: #333; font-weight: bold;">تاريخ الميلاد</label>
                                <input type="date" name="birth_date" id="profileBirthDate" 
                                       style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                            </div>
                            
                            <div class="form-actions" style="display: flex; gap: 10px; margin-top: 25px;">
                                <button type="button" id="cancelProfile" 
                                        style="flex: 1; padding: 12px; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: bold;">
                                    إلغاء
                                </button>
                                <button type="submit" class="profile-submit-btn"
                                        style="flex: 2; padding: 12px; background: #ea70b1; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: bold;">
                                    <i class="fa-solid fa-floppy-disk"></i> حفظ التغييرات
                                </button>
                            </div>
                        </form>

                        <!-- قسم تغيير كلمة المرور -->
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                            <h4 style="color: #ea70b1; margin-bottom: 15px;">تغيير كلمة المرور</h4>
                            <form id="changePasswordFormElement">
                                <div class="input-group">
                                    <input type="password" name="current_password" placeholder="كلمة المرور الحالية" 
                                           style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                </div>
                                <div class="input-group">
                                    <input type="password" name="new_password" placeholder="كلمة المرور الجديدة" 
                                           style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                </div>
                                <div class="input-group">
                                    <input type="password" name="confirm_new_password" placeholder="تأكيد كلمة المرور الجديدة" 
                                           style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                </div>
                                <button type="submit" class="password-submit-btn"
                                        style="width: 100%; padding: 12px; background: #17a2b8; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: bold;">
                                    <i class="fa-solid fa-key"></i> تغيير كلمة المرور
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <style>
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
                    }
                    .profile-content {
                        background: white;
                        padding: 30px;
                        border-radius: 15px;
                        width: 90%;
                        max-width: 500px;
                        max-height: 90vh;
                        overflow-y: auto;
                        position: relative;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    }
                    .profile-close {
                        position: absolute;
                        top: 10px;
                        left: 10px;
                        background: #ea70b1;
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
                    }
                    .profile-close:hover {
                        background: #a20087;
                    }
                    .profile-header {
                        text-align: center;
                        margin-bottom: 25px;
                    }
                    .profile-avatar {
                        font-size: 60px;
                        color: #ea70b1;
                        margin-bottom: 10px;
                    }
                </style>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
    }

    setupModalEvents() {
        // أحداث الأزرار
        document.getElementById('authClose')?.addEventListener('click', () => this.closeAuthModal());
        document.getElementById('showRegister')?.addEventListener('click', () => this.showRegisterForm());
        document.getElementById('showLogin')?.addEventListener('click', () => this.showLoginForm());
        document.getElementById('showForgotPassword')?.addEventListener('click', () => this.showForgotPasswordForm());
        document.getElementById('showLoginFromForgot')?.addEventListener('click', () => this.showLoginForm());
        document.getElementById('showLoginFromReset')?.addEventListener('click', () => this.showLoginForm());

        // أحداث النماذج
        document.getElementById('loginFormElement')?.addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerFormElement')?.addEventListener('submit', (e) => this.handleRegister(e));
        document.getElementById('forgotPasswordFormElement')?.addEventListener('submit', (e) => this.handleForgotPassword(e));
        document.getElementById('resetPasswordFormElement')?.addEventListener('submit', (e) => this.handleResetPassword(e));
        
        // أحداث نموذج الملف الشخصي
        document.getElementById('profileFormElement')?.addEventListener('submit', (e) => this.handleProfileUpdate(e));
        document.getElementById('changePasswordFormElement')?.addEventListener('submit', (e) => this.handlePasswordChange(e));
        document.getElementById('profileClose')?.addEventListener('click', () => this.closeProfileModal());
        document.getElementById('cancelProfile')?.addEventListener('click', () => this.closeProfileModal());

        // إغلاق بالنقر خارج النافذة
        document.getElementById('authModal')?.addEventListener('click', (e) => {
            if (e.target === document.getElementById('authModal')) {
                this.closeAuthModal();
            }
        });

        document.getElementById('profileModal')?.addEventListener('click', (e) => {
            if (e.target === document.getElementById('profileModal')) {
                this.closeProfileModal();
            }
        });

        // إغلاق بالضغط على Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAuthModal();
                this.closeProfileModal();
            }
        });

        // التحقق من وجود token في الURL لإظهار نموذج إعادة التعيين
        this.checkResetToken();
    }

    checkResetToken() {
        const urlParams = new URLSearchParams(window.location.search);
        const resetToken = urlParams.get('reset_token');
        if (resetToken) {
            document.getElementById('resetTokenInput').value = resetToken;
            this.showResetPasswordForm();
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        console.log('🔐 محاولة تسجيل الدخول...');
        
        const formData = new FormData(e.target);
        console.log('📤 بيانات تسجيل الدخول:', Object.fromEntries(formData));
        
        await this.sendAuthRequest(formData, 'login', e.target);
    }

    async handleRegister(e) {
        e.preventDefault();
        console.log('📝 محاولة تسجيل جديد...');
        
        const formData = new FormData(e.target);
        console.log('📤 بيانات التسجيل:', Object.fromEntries(formData));
        
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm_password');
        
        if (password !== confirmPassword) {
            this.showMessage('كلمات المرور غير متطابقة!', 'error');
            return;
        }
        
        await this.sendAuthRequest(formData, 'register', e.target);
    }

    async handleForgotPassword(e) {
        e.preventDefault();
        console.log('🔑 طلب استعادة كلمة المرور...');
        
        const formData = new FormData(e.target);
        const email = formData.get('email');
        
        if (!email) {
            this.showMessage('يرجى إدخال البريد الإلكتروني', 'error');
            return;
        }
        
        try {
            this.setLoadingState(e.target, true);
            
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'forgot_password',
                    email: email
                })
            });
            
            const text = await response.text();
            console.log('📄 استجابة الخادم:', text);
            
            let data;
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error('❌ استجابة غير صالحة:', text);
                throw new Error('الخادم لم يرد بتنسيق JSON صالح');
            }
            
            if (data.success) {
                this.showMessage(data.message, 'success');
                this.showLoginForm();
            } else {
                this.showMessage(data.message, 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في استعادة كلمة المرور:', error);
            this.handleRequestError(error);
        } finally {
            this.setLoadingState(e.target, false);
        }
    }

    async handleResetPassword(e) {
        e.preventDefault();
        console.log('🔄 محاولة تعيين كلمة مرور جديدة...');
        
        const formData = new FormData(e.target);
        const newPassword = formData.get('new_password');
        const confirmNewPassword = formData.get('confirm_new_password');
        const resetToken = formData.get('reset_token');
        
        if (newPassword !== confirmNewPassword) {
            this.showMessage('كلمات المرور غير متطابقة!', 'error');
            return;
        }
        
        if (!resetToken) {
            this.showMessage('رابط استعادة غير صالح', 'error');
            return;
        }
        
        try {
            this.setLoadingState(e.target, true);
            
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'reset_password',
                    new_password: newPassword,
                    reset_token: resetToken
                })
            });
            
            const text = await response.text();
            console.log('📄 استجابة الخادم:', text);
            
            let data;
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error('❌ استجابة غير صالحة:', text);
                throw new Error('الخادم لم يرد بتنسيق JSON صالح');
            }
            
            if (data.success) {
                this.showMessage(data.message, 'success');
                this.showLoginForm();
                
                // إزالة token من الURL
                window.history.replaceState({}, document.title, window.location.pathname);
            } else {
                this.showMessage(data.message, 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تعيين كلمة المرور:', error);
            this.handleRequestError(error);
        } finally {
            this.setLoadingState(e.target, false);
        }
    }

    async handleProfileUpdate(e) {
        e.preventDefault();
        console.log('💾 محاولة تحديث الملف الشخصي...');
        
        const formData = new FormData(e.target);
        const sessionToken = localStorage.getItem('sessionToken');
        
        if (!sessionToken) {
            this.showMessage('يجب تسجيل الدخول أولاً', 'error');
            return;
        }
        
        try {
            this.setLoadingState(e.target, true);
            
            formData.append('action', 'update_profile');
            formData.append('token', sessionToken);
            
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                body: formData
            });
            
            const text = await response.text();
            console.log('📄 استجابة الخادم:', text);
            
            let data;
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error('❌ استجابة غير صالحة:', text);
                throw new Error('الخادم لم يرد بتنسيق JSON صالح');
            }
            
            if (data.success) {
                this.showMessage('تم تحديث الملف الشخصي بنجاح', 'success');
                
                // تحديث البيانات المحلية
                if (data.user) {
                    localStorage.setItem('userData', JSON.stringify(data.user));
                }
                
                this.closeProfileModal();
                
                // تحديث واجهة المستخدم
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                this.showMessage(data.message, 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الملف الشخصي:', error);
            this.handleRequestError(error);
        } finally {
            this.setLoadingState(e.target, false);
        }
    }

    async handlePasswordChange(e) {
        e.preventDefault();
        console.log('🔐 محاولة تغيير كلمة المرور...');
        
        const formData = new FormData(e.target);
        const sessionToken = localStorage.getItem('sessionToken');
        const newPassword = formData.get('new_password');
        const confirmNewPassword = formData.get('confirm_new_password');
        
        if (newPassword !== confirmNewPassword) {
            this.showMessage('كلمات المرور غير متطابقة!', 'error');
            return;
        }
        
        if (!sessionToken) {
            this.showMessage('يجب تسجيل الدخول أولاً', 'error');
            return;
        }
        
        try {
            this.setLoadingState(e.target, true);
            
            formData.append('action', 'change_password');
            formData.append('token', sessionToken);
            
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                body: formData
            });
            
            const text = await response.text();
            console.log('📄 استجابة الخادم:', text);
            
            let data;
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error('❌ استجابة غير صالحة:', text);
                throw new Error('الخادم لم يرد بتنسيق JSON صالح');
            }
            
            if (data.success) {
                this.showMessage('تم تغيير كلمة المرور بنجاح', 'success');
                e.target.reset();
            } else {
                this.showMessage(data.message, 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تغيير كلمة المرور:', error);
            this.handleRequestError(error);
        } finally {
            this.setLoadingState(e.target, false);
        }
    }

    async sendAuthRequest(formData, action, formElement = null) {
        try {
            console.log(`🔄 إرسال طلب ${action} إلى: ${this.apiUrl}`);
            
            if (formElement) {
                this.setLoadingState(formElement, true);
            }
            
            formData.append('action', action);
            
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                body: formData
            });
            
            const text = await response.text();
            console.log('📄 استجابة الخادم:', text);
            
            let data;
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error('❌ استجابة غير صالحة:', text);
                throw new Error('الخادم لم يرد بتنسيق JSON صالح. تأكد من وجود ملف auth.php');
            }
            
            if (data.success) {
                this.showMessage(data.message, 'success');
                this.closeAuthModal();
                
                localStorage.setItem('userLoggedIn', 'true');
                if (data.user) {
                    localStorage.setItem('userData', JSON.stringify(data.user));
                }
                if (data.session_token) {
                    localStorage.setItem('sessionToken', data.session_token);
                }
                
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
                
            } else {
                this.showMessage(data.message, 'error');
            }
            
        } catch (error) {
            console.error('❌ خطأ في الاتصال:', error);
            this.handleRequestError(error);
        } finally {
            if (formElement) {
                this.setLoadingState(formElement, false);
            }
        }
    }

    handleRequestError(error) {
        if (error.message.includes('JSON')) {
            this.showMessage('ملف auth.php غير موجود أو به خطأ. تأكد من:', 'error');
            setTimeout(() => {
                this.showMessage('1. وضع auth.php في نفس المجلد', 'info');
            }, 3000);
            setTimeout(() => {
                this.showMessage('2. تشغيل خادم ويب محلي (XAMPP)', 'info');
            }, 6000);
        } else if (error.message.includes('Failed to fetch')) {
            this.showMessage('تعذر الاتصال بالخادم. تأكد من:', 'error');
            setTimeout(() => {
                this.showMessage('1. تشغيل خادم ويب محلي', 'info');
            }, 3000);
            setTimeout(() => {
                this.showMessage('2. فتح الصفحة عبر http://localhost', 'info');
            }, 6000);
        } else {
            this.showMessage('حدث خطأ: ' + error.message, 'error');
        }
    }

    setLoadingState(formElement, isLoading) {
        const submitBtn = formElement.querySelector('button[type="submit"]');
        const inputs = formElement.querySelectorAll('input, textarea, button');
        
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري المعالجة...';
            formElement.classList.add('loading');
            inputs.forEach(input => {
                if (input !== submitBtn) input.style.opacity = '0.7';
            });
        } else {
            submitBtn.disabled = false;
            
            // إعادة النص الأصلي بناءً على نوع النموذج
            const formId = formElement.id;
            const originalTexts = {
                'loginFormElement': '<i class="fa-solid fa-right-to-bracket"></i> تسجيل الدخول',
                'registerFormElement': '<i class="fa-solid fa-user-plus"></i> إنشاء حساب',
                'forgotPasswordFormElement': '<i class="fa-solid fa-paper-plane"></i> إرسال رابط الاستعادة',
                'resetPasswordFormElement': '<i class="fa-solid fa-key"></i> تعيين كلمة المرور',
                'profileFormElement': '<i class="fa-solid fa-floppy-disk"></i> حفظ التغييرات',
                'changePasswordFormElement': '<i class="fa-solid fa-key"></i> تغيير كلمة المرور'
            };
            
            submitBtn.innerHTML = originalTexts[formId] || 'إرسال';
            formElement.classList.remove('loading');
            inputs.forEach(input => input.style.opacity = '1');
        }
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
        }
        this.showLoginForm();
    }

    showProfile() {
        this.loadProfileData();
        this.showProfileModal();
        
        // إغلاق قائمة المستخدم
        const menu = document.querySelector('.user-menu');
        if (menu) menu.remove();
    }

    showProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    loadProfileData() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const profileData = JSON.parse(localStorage.getItem('profileData') || '{}');
        
        // دمج البيانات
        const mergedData = { ...userData, ...profileData };
        
        // تعبئة الحقول
        document.getElementById('profileFullName').value = mergedData.full_name || '';
        document.getElementById('profileEmail').value = mergedData.email || '';
        document.getElementById('profilePhone').value = mergedData.phone || '';
        document.getElementById('profileAddress').value = mergedData.address || '';
        document.getElementById('profileBirthDate').value = mergedData.birth_date || '';
    }

    showLoginForm() {
        document.getElementById('loginForm').classList.add('active');
        document.getElementById('registerForm').classList.remove('active');
        document.getElementById('forgotPasswordForm').classList.remove('active');
        document.getElementById('resetPasswordForm').classList.remove('active');
    }

    showRegisterForm() {
        document.getElementById('loginForm').classList.remove('active');
        document.getElementById('registerForm').classList.add('active');
        document.getElementById('forgotPasswordForm').classList.remove('active');
        document.getElementById('resetPasswordForm').classList.remove('active');
    }

    showForgotPasswordForm() {
        document.getElementById('loginForm').classList.remove('active');
        document.getElementById('registerForm').classList.remove('active');
        document.getElementById('forgotPasswordForm').classList.add('active');
        document.getElementById('resetPasswordForm').classList.remove('active');
    }

    showResetPasswordForm() {
        document.getElementById('loginForm').classList.remove('active');
        document.getElementById('registerForm').classList.remove('active');
        document.getElementById('forgotPasswordForm').classList.remove('active');
        document.getElementById('resetPasswordForm').classList.add('active');
        this.showAuthModal();
    }

    async handleLogout() {
        try {
            const sessionToken = localStorage.getItem('sessionToken');
            if (sessionToken) {
                await fetch(`${this.apiUrl}?action=logout&token=${sessionToken}`);
            }
        } catch (error) {
            console.error('خطأ في تسجيل الخروج:', error);
        } finally {
            // مسح جميع البيانات المحلية
            localStorage.removeItem('userLoggedIn');
            localStorage.removeItem('userData');
            localStorage.removeItem('sessionToken');
            localStorage.removeItem('profileData');
            
            this.showMessage('تم تسجيل الخروج بنجاح', 'success');
            
            // إعادة تحميل الصفحة
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }

    isLoggedIn() {
        return localStorage.getItem('userLoggedIn') === 'true';
    }

    checkAuthStatus() {
        if (this.isLoggedIn()) {
            console.log('✅ المستخدم مسجل دخول');
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            console.log('👤 بيانات المستخدم:', userData);
        } else {
            console.log('❌ المستخدم غير مسجل');
        }
    }

    showMessage(message, type, duration = 5000) {
        // إزالة أي رسائل سابقة
        const oldMessages = document.querySelectorAll('.auth-message');
        oldMessages.forEach(msg => msg.remove());
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'auth-message';
        messageDiv.innerHTML = message;
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
            background: ${type === 'success' ? '#28a745' : 
                        type === 'error' ? '#dc3545' : 
                        type === 'info' ? '#17a2b8' : '#ea70b1'};
            text-align: center;
            max-width: 90%;
            word-wrap: break-word;
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(messageDiv);
        
        // إزالة الرسالة بعد المدة المحددة
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.opacity = '0';
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.remove();
                    }
                }, 300);
            }
        }, duration);
    }

    showOrders() {
        this.showMessage('صفحة الطلبات قريباً', 'info');
        
        // إغلاق قائمة المستخدم
        const menu = document.querySelector('.user-menu');
        if (menu) menu.remove();
    }
}

// بدء النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});

// جعل النظام متاحاً globally للاستدعاء من الأزرار
window.showAuthModal = function() {
    if (window.authSystem) {
        window.authSystem.showAuthModal();
    }
};

window.handleLogout = function() {
    if (window.authSystem) {
        window.authSystem.handleLogout();
    }
};*/

/*// نظام المصادقة الكامل
class AuthSystem {
    constructor() {
        this.apiUrl = this.getApiUrl();
        this.init();
    }

    getApiUrl() {
        return 'auth.php';
    }

    init() {
        console.log('🚀 بدء نظام المصادقة...');
        this.createAuthModal();
        this.createProfileModal();
        this.setupUserIconListener();
        this.setupModalEvents();
        this.checkAuthStatus();
        this.updateUserDisplay();
    }

    setupUserIconListener() {
        document.addEventListener('click', (e) => {
            const userIcon = e.target.closest('.fa-user, .fa-solid.fa-user, [class*="user"]');
            if (userIcon) {
                e.preventDefault();
                e.stopPropagation();
                this.handleUserClick(userIcon);
            }
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
                    <div class="user-avatar"><i class="fa-solid fa-user-circle"></i></div>
                    <div class="user-details">
                        <strong>${userData.full_name || 'مستخدم'}</strong>
                        <small>${userData.email || ''}</small>
                    </div>
                </div>
                <div class="menu-items">
                    <button class="user-menu-item" onclick="authSystem.showProfile()">
                        <i class="fa-solid fa-user"></i> حسابي
                    </button>
                    <button class="user-menu-item" onclick="authSystem.showOrders()">
                        <i class="fa-solid fa-box"></i> طلباتي
                    </button>
                </div>
                <div class="menu-items">
                    <button class="user-menu-item logout-btn" onclick="authSystem.handleLogout()">
                        <i class="fa-solid fa-right-from-bracket"></i> تسجيل الخروج
                    </button>
                </div>
            </div>
            <style>
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
                    border: 2px solid #ea70b1;
                    overflow: hidden;
                }
                .user-header {
                    background: linear-gradient(135deg, #ea70b1, #a20087);
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
                .user-details strong {
                    display: block;
                    font-size: 16px;
                    margin-bottom: 4px;
                }
                .user-details small {
                    font-size: 12px;
                    opacity: 0.8;
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
                    border-bottom: 1px solid #f8f8f8;
                }
                .user-menu-item:last-child {
                    border-bottom: none;
                }
                .user-menu-item i {
                    width: 20px;
                    text-align: center;
                    color: #ea70b1;
                    font-size: 16px;
                }
                .user-menu-item:hover {
                    background: #f8f9fa;
                    transform: translateX(-5px);
                }
                .user-menu-item:hover i {
                    color: #a20087;
                }
                .logout-btn {
                    color: #dc3545;
                    font-weight: bold;
                }
                .logout-btn i {
                    color: #dc3545;
                }
                .logout-btn:hover {
                    background: #ffe6e6;
                }
            </style>
        `;
        
        const iconContainer = icon.closest('button') || icon;
        const container = iconContainer.parentNode;
        container.style.position = 'relative';
        container.insertAdjacentHTML('beforeend', menuHTML);
        
        setTimeout(() => {
            document.addEventListener('click', (e) => {
                if (!container.contains(e.target)) {
                    const menu = container.querySelector('.user-menu');
                    if (menu) menu.remove();
                }
            });
        }, 100);
    }

    createAuthModal() {
        if (!document.getElementById('authModal')) {
            const modalHTML = `
                <div class="auth-modal" id="authModal">
                    <div class="auth-content">
                        <button class="auth-close" id="authClose">×</button>
                        
                        <!-- نموذج تسجيل الدخول -->
                        <div class="auth-form active" id="loginForm">
                            <h3 style="color: #ea70b1; text-align: center; margin-bottom: 25px;">تسجيل الدخول</h3>
                            <form id="loginFormElement">
                                <div class="input-group">
                                    <input type="email" name="email" placeholder="البريد الإلكتروني" required 
                                           style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                </div>
                                <div class="input-group">
                                    <input type="password" name="password" placeholder="كلمة المرور" required 
                                           style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                </div>
                                <button type="submit" class="auth-submit-btn">
                                    <i class="fa-solid fa-right-to-bracket"></i> تسجيل الدخول
                                </button>
                            </form>
                            <div style="text-align: center; margin: 15px 0;">
                                <span style="color: #ea70b1; cursor: pointer; font-weight: bold; font-size: 14px;" id="showForgotPassword">
                                    <i class="fa-solid fa-key"></i> نسيت كلمة المرور؟
                                </span>
                            </div>
                            <div style="text-align: center; margin-top: 20px; color: #343a40; font-size: 14px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                                ليس لديك حساب؟ 
                                <span style="color: #ea70b1; cursor: pointer; font-weight: bold;" id="showRegister">إنشاء حساب</span>
                            </div>
                        </div>
                        
                        <!-- نموذج التسجيل -->
                        <div class="auth-form" id="registerForm">
                            <h3 style="color: #ea70b1; text-align: center; margin-bottom: 25px;">إنشاء حساب جديد</h3>
                            <form id="registerFormElement">
                                <div class="input-group">
                                    <input type="text" name="fullname" placeholder="الاسم الكامل" required 
                                           style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                </div>
                                <div class="input-group">
                                    <input type="email" name="email" placeholder="البريد الإلكتروني" required 
                                           style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                </div>
                                <div class="input-group">
                                    <input type="password" name="password" placeholder="كلمة المرور" required 
                                           style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                </div>
                                <div class="input-group">
                                    <input type="password" name="confirm_password" placeholder="تأكيد كلمة المرور" required 
                                           style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                </div>
                                <button type="submit" class="auth-submit-btn">
                                    <i class="fa-solid fa-user-plus"></i> إنشاء حساب
                                </button>
                            </form>
                            <div style="text-align: center; margin-top: 25px; color: #343a40; font-size: 14px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                                لديك حساب بالفعل؟ 
                                <span style="color: #ea70b1; cursor: pointer; font-weight: bold;" id="showLogin">تسجيل الدخول</span>
                            </div>
                        </div>

                        <!-- نموذج نسيت كلمة المرور -->
                        <div class="auth-form" id="forgotPasswordForm">
                            <h3 style="color: #ea70b1; text-align: center; margin-bottom: 25px;">استعادة كلمة المرور</h3>
                            <form id="forgotPasswordFormElement">
                                <div class="input-group">
                                    <input type="email" name="email" placeholder="أدخل بريدك الإلكتروني" required 
                                           style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                </div>
                                <button type="submit" class="auth-submit-btn">
                                    <i class="fa-solid fa-paper-plane"></i> إرسال رابط الاستعادة
                                </button>
                            </form>
                            <div style="text-align: center; margin: 15px 0;">
                                <span style="color: #666; font-size: 13px;">
                                    سنرسل لك رابطاً لإعادة تعيين كلمة المرور
                                </span>
                            </div>
                            <div style="text-align: center; margin-top: 20px; color: #343a40; font-size: 14px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                                تذكرت كلمة المرور؟ 
                                <span style="color: #ea70b1; cursor: pointer; font-weight: bold;" id="showLoginFromForgot">تسجيل الدخول</span>
                            </div>
                        </div>

                        <!-- نموذج إعادة تعيين كلمة المرور -->
                        <div class="auth-form" id="resetPasswordForm">
                            <h3 style="color: #ea70b1; text-align: center; margin-bottom: 25px;">تعيين كلمة مرور جديدة</h3>
                            <form id="resetPasswordFormElement">
                                <div class="input-group">
                                    <input type="password" name="new_password" placeholder="كلمة المرور الجديدة" required 
                                           style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                </div>
                                <div class="input-group">
                                    <input type="password" name="confirm_new_password" placeholder="تأكيد كلمة المرور الجديدة" required 
                                           style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                </div>
                                <input type="hidden" name="reset_token" id="resetTokenInput">
                                <button type="submit" class="auth-submit-btn">
                                    <i class="fa-solid fa-key"></i> تعيين كلمة المرور
                                </button>
                            </form>
                            <div style="text-align: center; margin-top: 25px; color: #343a40; font-size: 14px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                                <span style="color: #ea70b1; cursor: pointer; font-weight: bold;" id="showLoginFromReset">العودة لتسجيل الدخول</span>
                            </div>
                        </div>
                    </div>
                </div>
                <style>
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
                    }
                    .auth-content {
                        background: white;
                        padding: 30px;
                        border-radius: 15px;
                        width: 90%;
                        max-width: 400px;
                        position: relative;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    }
                    .auth-close {
                        position: absolute;
                        top: 10px;
                        left: 10px;
                        background: #ea70b1;
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
                    }
                    .auth-close:hover {
                        background: #a20087;
                    }
                    .auth-form {
                        display: none;
                    }
                    .auth-form.active {
                        display: block;
                    }
                    .input-group {
                        margin-bottom: 20px;
                    }
                    .auth-submit-btn {
                        width: 100%;
                        padding: 15px;
                        background: #ea70b1;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: bold;
                        margin-bottom: 15px;
                        transition: background 0.3s ease;
                    }
                    .auth-submit-btn:hover {
                        background: #a20087;
                    }
                    .auth-submit-btn:disabled {
                        background: #ccc;
                        cursor: not-allowed;
                    }
                    .loading {
                        opacity: 0.7;
                        pointer-events: none;
                    }
                </style>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
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
                            <h3 style="color: #ea70b1; text-align: center; margin: 15px 0;">الملف الشخصي</h3>
                        </div>

                        <form id="profileFormElement">
                            <div class="input-group">
                                <label style="display: block; margin-bottom: 8px; color: #333; font-weight: bold;">الاسم الكامل</label>
                                <input type="text" name="full_name" id="profileFullName" required 
                                       style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                            </div>
                            
                            <div class="input-group">
                                <label style="display: block; margin-bottom: 8px; color: #333; font-weight: bold;">البريد الإلكتروني</label>
                                <input type="email" name="email" id="profileEmail" required 
                                       style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                            </div>
                            
                            <div class="input-group">
                                <label style="display: block; margin-bottom: 8px; color: #333; font-weight: bold;">رقم الهاتف</label>
                                <input type="tel" name="phone" id="profilePhone" 
                                       style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;" 
                                       placeholder="أدخل رقم هاتفك">
                            </div>
                            
                            <div class="input-group">
                                <label style="display: block; margin-bottom: 8px; color: #333; font-weight: bold;">العنوان</label>
                                <textarea name="address" id="profileAddress" rows="3" 
                                          style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; resize: vertical;" 
                                          placeholder="أدخل عنوانك"></textarea>
                            </div>
                            
                            <div class="input-group">
                                <label style="display: block; margin-bottom: 8px; color: #333; font-weight: bold;">تاريخ الميلاد</label>
                                <input type="date" name="birth_date" id="profileBirthDate" 
                                       style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                            </div>
                            
                            <div class="form-actions" style="display: flex; gap: 10px; margin-top: 25px;">
                                <button type="button" id="cancelProfile" 
                                        style="flex: 1; padding: 12px; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: bold;">
                                    إلغاء
                                </button>
                                <button type="submit" class="profile-submit-btn"
                                        style="flex: 2; padding: 12px; background: #ea70b1; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: bold;">
                                    <i class="fa-solid fa-floppy-disk"></i> حفظ التغييرات
                                </button>
                            </div>
                        </form>

                        <!-- قسم تغيير كلمة المرور -->
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                            <h4 style="color: #ea70b1; margin-bottom: 15px;">تغيير كلمة المرور</h4>
                            <form id="changePasswordFormElement">
                                <div class="input-group">
                                    <input type="password" name="current_password" placeholder="كلمة المرور الحالية" required
                                           style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                </div>
                                <div class="input-group">
                                    <input type="password" name="new_password" placeholder="كلمة المرور الجديدة" required
                                           style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                </div>
                                <div class="input-group">
                                    <input type="password" name="confirm_new_password" placeholder="تأكيد كلمة المرور الجديدة" required
                                           style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                </div>
                                <button type="submit" class="password-submit-btn"
                                        style="width: 100%; padding: 12px; background: #17a2b8; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: bold;">
                                    <i class="fa-solid fa-key"></i> تغيير كلمة المرور
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <style>
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
                    }
                    .profile-content {
                        background: white;
                        padding: 30px;
                        border-radius: 15px;
                        width: 90%;
                        max-width: 500px;
                        max-height: 90vh;
                        overflow-y: auto;
                        position: relative;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    }
                    .profile-close {
                        position: absolute;
                        top: 10px;
                        left: 10px;
                        background: #ea70b1;
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
                    }
                    .profile-close:hover {
                        background: #a20087;
                    }
                    .profile-header {
                        text-align: center;
                        margin-bottom: 25px;
                    }
                    .profile-avatar {
                        font-size: 60px;
                        color: #ea70b1;
                        margin-bottom: 10px;
                    }
                </style>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
    }

    setupModalEvents() {
        // أحداث الأزرار
        document.getElementById('authClose')?.addEventListener('click', () => this.closeAuthModal());
        document.getElementById('showRegister')?.addEventListener('click', () => this.showRegisterForm());
        document.getElementById('showLogin')?.addEventListener('click', () => this.showLoginForm());
        document.getElementById('showForgotPassword')?.addEventListener('click', () => this.showForgotPasswordForm());
        document.getElementById('showLoginFromForgot')?.addEventListener('click', () => this.showLoginForm());
        document.getElementById('showLoginFromReset')?.addEventListener('click', () => this.showLoginForm());

        // أحداث النماذج
        document.getElementById('loginFormElement')?.addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerFormElement')?.addEventListener('submit', (e) => this.handleRegister(e));
        document.getElementById('forgotPasswordFormElement')?.addEventListener('submit', (e) => this.handleForgotPassword(e));
        document.getElementById('resetPasswordFormElement')?.addEventListener('submit', (e) => this.handleResetPassword(e));
        
        // أحداث نموذج الملف الشخصي
        document.getElementById('profileFormElement')?.addEventListener('submit', (e) => this.handleProfileUpdate(e));
        document.getElementById('changePasswordFormElement')?.addEventListener('submit', (e) => this.handlePasswordChange(e));
        document.getElementById('profileClose')?.addEventListener('click', () => this.closeProfileModal());
        document.getElementById('cancelProfile')?.addEventListener('click', () => this.closeProfileModal());

        // إغلاق بالنقر خارج النافذة
        document.getElementById('authModal')?.addEventListener('click', (e) => {
            if (e.target === document.getElementById('authModal')) {
                this.closeAuthModal();
            }
        });

        document.getElementById('profileModal')?.addEventListener('click', (e) => {
            if (e.target === document.getElementById('profileModal')) {
                this.closeProfileModal();
            }
        });

        // إغلاق بالضغط على Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAuthModal();
                this.closeProfileModal();
            }
        });

        // التحقق من وجود token في الURL لإظهار نموذج إعادة التعيين
        this.checkResetToken();
    }

    checkResetToken() {
        const urlParams = new URLSearchParams(window.location.search);
        const resetToken = urlParams.get('reset_token');
        if (resetToken) {
            document.getElementById('resetTokenInput').value = resetToken;
            this.showResetPasswordForm();
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        console.log('🔐 محاولة تسجيل الدخول...');
        
        const formData = new FormData(e.target);
        const formDataObject = Object.fromEntries(formData);
        console.log('📤 بيانات تسجيل الدخول:', formDataObject);
        
        if (!formDataObject.email || !formDataObject.password) {
            this.showMessage('يرجى ملء جميع الحقول', 'error');
            return;
        }
        
        await this.sendAuthRequest(formDataObject, 'login', e.target);
    }

    async handleRegister(e) {
        e.preventDefault();
        console.log('📝 محاولة تسجيل جديد...');
        
        const formData = new FormData(e.target);
        const formDataObject = Object.fromEntries(formData);
        console.log('📤 بيانات التسجيل:', formDataObject);
        
        const password = formDataObject.password;
        const confirmPassword = formDataObject.confirm_password;
        
        if (!formDataObject.fullname || !formDataObject.email || !password || !confirmPassword) {
            this.showMessage('يرجى ملء جميع الحقول', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showMessage('كلمات المرور غير متطابقة!', 'error');
            return;
        }
        
        await this.sendAuthRequest(formDataObject, 'register', e.target);
    }

    async handleForgotPassword(e) {
        e.preventDefault();
        console.log('🔑 طلب استعادة كلمة المرور...');
        
        const formData = new FormData(e.target);
        const formDataObject = Object.fromEntries(formData);
        const email = formDataObject.email;
        
        if (!email) {
            this.showMessage('يرجى إدخال البريد الإلكتروني', 'error');
            return;
        }
        
        try {
            this.setLoadingState(e.target, true);
            
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'forgot_password',
                    email: email
                })
            });
            
            const text = await response.text();
            console.log('📄 استجابة الخادم:', text);
            
            let data;
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error('❌ استجابة غير صالحة:', text);
                throw new Error('الخادم لم يرد بتنسيق JSON صالح');
            }
            
            if (data.success) {
                this.showMessage(data.message, 'success');
                this.showLoginForm();
            } else {
                this.showMessage(data.message, 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في استعادة كلمة المرور:', error);
            this.handleRequestError(error);
        } finally {
            this.setLoadingState(e.target, false);
        }
    }

    async handleResetPassword(e) {
        e.preventDefault();
        console.log('🔄 محاولة تعيين كلمة مرور جديدة...');
        
        const formData = new FormData(e.target);
        const formDataObject = Object.fromEntries(formData);
        const newPassword = formDataObject.new_password;
        const confirmNewPassword = formDataObject.confirm_new_password;
        const resetToken = formDataObject.reset_token;
        
        if (newPassword !== confirmNewPassword) {
            this.showMessage('كلمات المرور غير متطابقة!', 'error');
            return;
        }
        
        if (!resetToken) {
            this.showMessage('رابط استعادة غير صالح', 'error');
            return;
        }
        
        try {
            this.setLoadingState(e.target, true);
            
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'reset_password',
                    new_password: newPassword,
                    reset_token: resetToken
                })
            });
            
            const text = await response.text();
            console.log('📄 استجابة الخادم:', text);
            
            let data;
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error('❌ استجابة غير صالحة:', text);
                throw new Error('الخادم لم يرد بتنسيق JSON صالح');
            }
            
            if (data.success) {
                this.showMessage('تم تعيين كلمة المرور الجديدة بنجاح', 'success');
                this.showLoginForm();
                
                // إزالة token من الURL
                window.history.replaceState({}, document.title, window.location.pathname);
            } else {
                this.showMessage(data.message, 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تعيين كلمة المرور:', error);
            this.handleRequestError(error);
        } finally {
            this.setLoadingState(e.target, false);
        }
    }

    showProfile() {
        if (!this.isLoggedIn()) {
            this.showMessage('يجب تسجيل الدخول أولاً', 'error');
            return;
        }
        
        this.loadProfileData();
        this.showProfileModal();
        
        // إغلاق قائمة المستخدم
        const menu = document.querySelector('.user-menu');
        if (menu) menu.remove();
    }

    loadProfileData() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        console.log('📝 تحميل بيانات الملف الشخصي:', userData);
        
        // تعبئة الحقول ببيانات المستخدم الحالية
        document.getElementById('profileFullName').value = userData.full_name || '';
        document.getElementById('profileEmail').value = userData.email || '';
        document.getElementById('profilePhone').value = userData.phone || '';
        document.getElementById('profileAddress').value = userData.address || '';
        document.getElementById('profileBirthDate').value = userData.birth_date || '';
    }

    async handleProfileUpdate(e) {
        e.preventDefault();
        console.log('💾 محاولة تحديث الملف الشخصي...');
        
        if (!this.isLoggedIn()) {
            this.showMessage('يجب تسجيل الدخول أولاً', 'error');
            return;
        }
        
        const formData = new FormData(e.target);
        const formDataObject = Object.fromEntries(formData);
        const sessionToken = localStorage.getItem('sessionToken');
        
        console.log('📤 بيانات التحديث:', formDataObject);
        
        if (!sessionToken) {
            this.showMessage('جلسة غير صالحة، يرجى تسجيل الدخول مرة أخرى', 'error');
            this.handleLogout();
            return;
        }
        
        try {
            this.setLoadingState(e.target, true);
            
            const requestData = {
                action: 'update_profile',
                token: sessionToken,
                ...formDataObject
            };
            
            const formDataToSend = new FormData();
            Object.keys(requestData).forEach(key => {
                if (requestData[key] !== null && requestData[key] !== undefined) {
                    formDataToSend.append(key, requestData[key]);
                }
            });
            
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                body: formDataToSend
            });
            
            const text = await response.text();
            console.log('📄 استجابة الخادم:', text);
            
            let data;
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error('❌ استجابة غير صالحة:', text);
                throw new Error('الخادم لم يرد بتنسيق JSON صالح');
            }
            
            if (data.success) {
                this.showMessage('تم حفظ التغييرات بنجاح', 'success');
                
                // تحديث البيانات المحلية
                if (data.user) {
                    localStorage.setItem('userData', JSON.stringify(data.user));
                    this.updateUserDisplay();
                }
                
                this.closeProfileModal();
                
            } else {
                this.showMessage(data.message, 'error');
                
                // إذا كانت الجلسة منتهية، سجل الخروج
                if (data.message.includes('جلسة') || data.message.includes('صالح')) {
                    this.handleLogout();
                }
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث الملف الشخصي:', error);
            this.handleRequestError(error);
        } finally {
            this.setLoadingState(e.target, false);
        }
    }

    async handlePasswordChange(e) {
        e.preventDefault();
        console.log('🔐 محاولة تغيير كلمة المرور...');
        
        if (!this.isLoggedIn()) {
            this.showMessage('يجب تسجيل الدخول أولاً', 'error');
            return;
        }
        
        const formData = new FormData(e.target);
        const formDataObject = Object.fromEntries(formData);
        const sessionToken = localStorage.getItem('sessionToken');
        const currentPassword = formDataObject.current_password;
        const newPassword = formDataObject.new_password;
        const confirmNewPassword = formDataObject.confirm_new_password;
        
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            this.showMessage('يرجى ملء جميع الحقول', 'error');
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            this.showMessage('كلمات المرور غير متطابقة!', 'error');
            return;
        }
        
        if (!sessionToken) {
            this.showMessage('جلسة غير صالحة، يرجى تسجيل الدخول مرة أخرى', 'error');
            this.handleLogout();
            return;
        }
        
        try {
            this.setLoadingState(e.target, true);
            
            const requestData = {
                action: 'change_password',
                token: sessionToken,
                current_password: currentPassword,
                new_password: newPassword
            };
            
            const formDataToSend = new FormData();
            Object.keys(requestData).forEach(key => {
                if (requestData[key] !== null && requestData[key] !== undefined) {
                    formDataToSend.append(key, requestData[key]);
                }
            });
            
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                body: formDataToSend
            });
            
            const text = await response.text();
            console.log('📄 استجابة الخادم:', text);
            
            let data;
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error('❌ استجابة غير صالحة:', text);
                throw new Error('الخادم لم يرد بتنسيق JSON صالح');
            }
            
            if (data.success) {
                this.showMessage('تم تغيير كلمة المرور بنجاح', 'success');
                e.target.reset();
                
                // إذا تم تغيير كلمة المرور بنجاح، أخرج المستخدم ليدخل بالكلمة الجديدة
                setTimeout(() => {
                    this.showMessage('يرجى تسجيل الدخول مرة أخرى باستخدام كلمة المرور الجديدة', 'info');
                    this.handleLogout();
                }, 2000);
                
            } else {
                this.showMessage(data.message, 'error');
                
                // إذا كانت الجلسة منتهية، سجل الخروج
                if (data.message.includes('جلسة') || data.message.includes('صالح')) {
                    this.handleLogout();
                }
            }
        } catch (error) {
            console.error('❌ خطأ في تغيير كلمة المرور:', error);
            this.handleRequestError(error);
        } finally {
            this.setLoadingState(e.target, false);
        }
    }

    async sendAuthRequest(formDataObject, action, formElement = null) {
        try {
            console.log(`🔄 إرسال طلب ${action} إلى: ${this.apiUrl}`);
            console.log('📤 البيانات المرسلة:', formDataObject);
            
            if (formElement) {
                this.setLoadingState(formElement, true);
            }
            
            // إضافة action إلى البيانات
            const requestData = {
                action: action,
                ...formDataObject
            };
            
            // استخدام FormData بدلاً من JSON
            const formData = new FormData();
            Object.keys(requestData).forEach(key => {
                if (requestData[key] !== null && requestData[key] !== undefined) {
                    formData.append(key, requestData[key]);
                }
            });
            
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                body: formData
            });
            
            const text = await response.text();
            console.log('📄 استجابة الخادم:', text);
            
            let data;
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error('❌ استجابة غير صالحة:', text);
                throw new Error('الخادم لم يرد بتنسيق JSON صالح. تأكد من وجود ملف auth.php');
            }
            
            if (data.success) {
                this.showMessage(data.message, 'success');
                this.closeAuthModal();
                
                localStorage.setItem('userLoggedIn', 'true');
                if (data.user) {
                    localStorage.setItem('userData', JSON.stringify(data.user));
                }
                if (data.session_token) {
                    localStorage.setItem('sessionToken', data.session_token);
                }
                
                this.updateUserDisplay();
                
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
                
            } else {
                this.showMessage(data.message, 'error');
            }
            
        } catch (error) {
            console.error('❌ خطأ في الاتصال:', error);
            this.handleRequestError(error);
        } finally {
            if (formElement) {
                this.setLoadingState(formElement, false);
            }
        }
    }

    handleRequestError(error) {
        if (error.message.includes('JSON')) {
            this.showMessage('ملف auth.php غير موجود أو به خطأ. تأكد من:', 'error');
            setTimeout(() => {
                this.showMessage('1. وضع auth.php في نفس المجلد', 'info');
            }, 3000);
            setTimeout(() => {
                this.showMessage('2. تشغيل خادم ويب محلي (XAMPP)', 'info');
            }, 6000);
        } else if (error.message.includes('Failed to fetch')) {
            this.showMessage('تعذر الاتصال بالخادم. تأكد من:', 'error');
            setTimeout(() => {
                this.showMessage('1. تشغيل خادم ويب محلي', 'info');
            }, 3000);
            setTimeout(() => {
                this.showMessage('2. فتح الصفحة عبر http://localhost', 'info');
            }, 6000);
        } else {
            this.showMessage('حدث خطأ: ' + error.message, 'error');
        }
    }

    setLoadingState(formElement, isLoading) {
        const submitBtn = formElement.querySelector('button[type="submit"]');
        const inputs = formElement.querySelectorAll('input, textarea, button');
        
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري المعالجة...';
            formElement.classList.add('loading');
            inputs.forEach(input => {
                if (input !== submitBtn) input.style.opacity = '0.7';
            });
        } else {
            submitBtn.disabled = false;
            
            // إعادة النص الأصلي بناءً على نوع النموذج
            const formId = formElement.id;
            const originalTexts = {
                'loginFormElement': '<i class="fa-solid fa-right-to-bracket"></i> تسجيل الدخول',
                'registerFormElement': '<i class="fa-solid fa-user-plus"></i> إنشاء حساب',
                'forgotPasswordFormElement': '<i class="fa-solid fa-paper-plane"></i> إرسال رابط الاستعادة',
                'resetPasswordFormElement': '<i class="fa-solid fa-key"></i> تعيين كلمة المرور',
                'profileFormElement': '<i class="fa-solid fa-floppy-disk"></i> حفظ التغييرات',
                'changePasswordFormElement': '<i class="fa-solid fa-key"></i> تغيير كلمة المرور'
            };
            
            submitBtn.innerHTML = originalTexts[formId] || 'إرسال';
            formElement.classList.remove('loading');
            inputs.forEach(input => input.style.opacity = '1');
        }
    }

    updateUserDisplay() {
        if (this.isLoggedIn()) {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            console.log('👤 تحديث عرض بيانات المستخدم:', userData);
            
            // تحديث أي عناصر في الصفحة تعرض بيانات المستخدم
            const userElements = document.querySelectorAll('[data-user-name], [data-user-email]');
            userElements.forEach(element => {
                if (element.dataset.userName) {
                    element.textContent = userData.full_name || 'مستخدم';
                }
                if (element.dataset.userEmail) {
                    element.textContent = userData.email || '';
                }
            });

            // إظهار أقسام المستخدم المسجل
            const userSections = document.querySelectorAll('[data-user-section]');
            userSections.forEach(section => {
                section.style.display = 'block';
            });

            // إخفاء أقسام الزائر
            const guestSections = document.querySelectorAll('[data-guest-section]');
            guestSections.forEach(section => {
                section.style.display = 'none';
            });
        } else {
            // إخفاء أقسام المستخدم المسجل
            const userSections = document.querySelectorAll('[data-user-section]');
            userSections.forEach(section => {
                section.style.display = 'none';
            });

            // إظهار أقسام الزائر
            const guestSections = document.querySelectorAll('[data-guest-section]');
            guestSections.forEach(section => {
                section.style.display = 'block';
            });
        }
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
        }
        this.showLoginForm();
    }

    showProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    showLoginForm() {
        document.getElementById('loginForm').classList.add('active');
        document.getElementById('registerForm').classList.remove('active');
        document.getElementById('forgotPasswordForm').classList.remove('active');
        document.getElementById('resetPasswordForm').classList.remove('active');
    }

    showRegisterForm() {
        document.getElementById('loginForm').classList.remove('active');
        document.getElementById('registerForm').classList.add('active');
        document.getElementById('forgotPasswordForm').classList.remove('active');
        document.getElementById('resetPasswordForm').classList.remove('active');
    }

    showForgotPasswordForm() {
        document.getElementById('loginForm').classList.remove('active');
        document.getElementById('registerForm').classList.remove('active');
        document.getElementById('forgotPasswordForm').classList.add('active');
        document.getElementById('resetPasswordForm').classList.remove('active');
    }

    showResetPasswordForm() {
        document.getElementById('loginForm').classList.remove('active');
        document.getElementById('registerForm').classList.remove('active');
        document.getElementById('forgotPasswordForm').classList.remove('active');
        document.getElementById('resetPasswordForm').classList.add('active');
        this.showAuthModal();
    }

    async handleLogout() {
        try {
            const sessionToken = localStorage.getItem('sessionToken');
            if (sessionToken) {
                await fetch(`${this.apiUrl}?action=logout&token=${sessionToken}`);
            }
        } catch (error) {
            console.error('خطأ في تسجيل الخروج:', error);
        } finally {
            // مسح جميع البيانات المحلية
            localStorage.removeItem('userLoggedIn');
            localStorage.removeItem('userData');
            localStorage.removeItem('sessionToken');
            localStorage.removeItem('profileData');
            
            this.showMessage('تم تسجيل الخروج بنجاح', 'success');
            this.updateUserDisplay();
            
            // إعادة تحميل الصفحة
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }

    isLoggedIn() {
        return localStorage.getItem('userLoggedIn') === 'true';
    }

    checkAuthStatus() {
        if (this.isLoggedIn()) {
            console.log('✅ المستخدم مسجل دخول');
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            console.log('👤 بيانات المستخدم:', userData);
            this.updateUserDisplay();
        } else {
            console.log('❌ المستخدم غير مسجل');
            this.updateUserDisplay();
        }
    }

    showMessage(message, type, duration = 5000) {
        const oldMessages = document.querySelectorAll('.auth-message');
        oldMessages.forEach(msg => msg.remove());
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'auth-message';
        messageDiv.innerHTML = message;
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
            background: ${type === 'success' ? '#28a745' : 
                        type === 'error' ? '#dc3545' : 
                        type === 'info' ? '#17a2b8' : '#ea70b1'};
            text-align: center;
            max-width: 90%;
            word-wrap: break-word;
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.opacity = '0';
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.remove();
                    }
                }, 300);
            }
        }, duration);
    }

    showOrders() {
        this.showMessage('صفحة الطلبات قريباً', 'info');
        
        // إغلاق قائمة المستخدم
        const menu = document.querySelector('.user-menu');
        if (menu) menu.remove();
    }
}

// بدء النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});

// جعل النظام متاحاً globally للاستدعاء من الأزرار
window.showAuthModal = function() {
    if (window.authSystem) {
        window.authSystem.showAuthModal();
    }
};

window.handleLogout = function() {
    if (window.authSystem) {
        window.authSystem.handleLogout();
    }
};

window.showProfile = function() {
    if (window.authSystem) {
        window.authSystem.showProfile();
    }
};*/
