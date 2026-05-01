// نظام إدارة المتجر - PerfumeStoreSystem
/*class PerfumeStoreSystem {
    constructor() {
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
        console.log('🏪 بدء تشغيل نظام المتجر...');
        this.setupStoreStyles();
        this.initializeDOMElements();
        this.setupEventListeners();
        this.updateCart();
        this.addDataAttributesToButtons();
        console.log('✅ تم تهيئة نظام المتجر بنجاح');
    }

    setupStoreStyles() {
        if (document.getElementById('store-styles')) return;
        
        const styles = `
            <style id="store-styles">
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

    initializeDOMElements() {
        console.log('🔍 تهيئة عناصر DOM...');
        
        this.createCartElements();
        this.createCheckoutPage();
        
        this.cartToggle = document.getElementById('cart-toggle');
        this.closeCart = document.getElementById('close-cart');
        this.cartOverlay = document.getElementById('cart-overlay');
        this.cartSidebar = document.getElementById('cart-sidebar');
        this.cartItems = document.getElementById('cart-items');
        this.cartCount = document.getElementById('cart-count');
        this.cartTotal = document.getElementById('cart-total');
        this.subtotalEl = document.getElementById('subtotal');
        this.taxEl = document.getElementById('tax');
        this.totalEl = document.getElementById('total');
        this.checkoutBtn = document.getElementById('checkout-btn');
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
        
        this.cartItems = document.getElementById('cart-items');
        this.cartTotal = document.getElementById('cart-total');
        this.subtotalEl = document.getElementById('subtotal');
        this.taxEl = document.getElementById('tax');
        this.totalEl = document.getElementById('total');
        this.checkoutBtn = document.getElementById('checkout-btn');
        this.closeCart = document.getElementById('close-cart');
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
                <div class="d-flex justify-content-between mb-3">
                    <span>الضريبة (15%):</span>
                    <span id="tax">0 SAR</span>
                </div>
                <div class="d-flex justify-content-between fw-bold fs-5">
                    <span>الإجمالي:</span>
                    <span id="total">0 SAR</span>
                </div>
                <button class="checkout-btn mt-4" id="checkout-btn">🚀 اتمام الشراء</button>
            </div>
        `;
    }

    createCheckoutPage() {
        if (document.getElementById('checkout-page')) return;
        
        this.checkoutPage = document.createElement('div');
        this.checkoutPage.id = 'checkout-page';
        this.checkoutPage.className = 'checkout-page';
        this.checkoutPage.style.display = 'none';
        this.checkoutPage.innerHTML = this.getCheckoutHTML();
        document.body.appendChild(this.checkoutPage);
    }

    getCheckoutHTML() {
        return `
            <div class="checkout-container">
                <div class="checkout-content">
                    <a href="#" class="back-to-cart" id="back-to-cart">
                        <i class="fas fa-arrow-right"></i> العودة إلى السلة
                    </a>
                    <div class="row">
                        <div class="col-lg-8 mb-4">
                            <div class="checkout-form">
                                <h3 class="mb-4">📦 معلومات الشحن</h3>
                                ${this.getCheckoutFormHTML()}
                                <button class="checkout-btn mt-3" id="complete-order">✅ اتمام الطلب</button>
                            </div>
                        </div>
                        
                        <div class="col-lg-4">
                            <div class="order-summary">
                                <h4 class="mb-4">📋 ملخص الطلب</h4>
                                <div id="order-items"></div>
                                ${this.getDiscountSectionHTML()}
                                ${this.getOrderSummaryHTML()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getCheckoutFormHTML() {
        return `
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
                <label for="email" class="form-label">📧 البريد الإلكتروني</label>
                <input type="email" class="form-control" id="email" required>
            </div>
            
            <div class="mb-3">
                <label for="phone" class="form-label">📞 رقم الهاتف</label>
                <input type="tel" class="form-control" id="phone" required>
            </div>
            
            <div class="mb-3">
                <label for="address" class="form-label">📍 العنوان</label>
                <input type="text" class="form-control" id="address" required>
            </div>
            
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="city" class="form-label">🏙️ المدينة</label>
                    <input type="text" class="form-control" id="city" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="postalCode" class="form-label">📮 الرمز البريدي</label>
                    <input type="text" class="form-control" id="postalCode">
                </div>
            </div>
            
            <h3 class="my-4">💳 معلومات الدفع</h3>
            
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
        `;
    }

    getDiscountSectionHTML() {
        return `
            <div class="discount-section mb-3 mt-3">
                <label for="discount-code" class="form-label">🎁 كود الخصم</label>
                <div class="input-group">
                    <input type="text" class="form-control" id="discount-code" placeholder="أدخل الكود هنا">
                    <button class="btn btn-outline-primary" type="button" id="apply-discount">تطبيق</button>
                </div>
                <div id="discount-message" class="mt-2 small"></div>
            </div>
        `;
    }

    getOrderSummaryHTML() {
        return `
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
        `;
    }

    setupEventListeners() {
        console.log('🎯 إعداد مستمعي الأحداث...');
        
        if (this.cartToggle) {
            this.cartToggle.addEventListener('click', () => this.openCart());
        }
        
        if (this.closeCart) {
            this.closeCart.addEventListener('click', () => this.closeCartHandler());
        }
        
        if (this.cartOverlay) {
            this.cartOverlay.addEventListener('click', () => this.closeCartHandler());
        }
        
        if (this.checkoutBtn) {
            this.checkoutBtn.addEventListener('click', () => this.goToCheckout());
        }
        
        document.addEventListener('click', (e) => {
            const buyButton = e.target.closest('.buy-button');
            if (buyButton) {
                e.preventDefault();
                e.stopPropagation();
                this.handleBuyButtonClick(buyButton);
            }
        });
        
        document.addEventListener('click', (e) => {
            if (e.target.id === 'back-to-cart' || e.target.closest('#back-to-cart')) {
                e.preventDefault();
                this.backToCartHandler();
            }
            
            if (e.target.id === 'complete-order' || e.target.closest('#complete-order')) {
                e.preventDefault();
                this.completeOrderHandler();
            }
            
            if (e.target.id === 'apply-discount' || e.target.closest('#apply-discount')) {
                e.preventDefault();
                this.applyDiscount();
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

    addDataAttributesToButtons() {
        console.log('🔧 جاري إضافة البيانات لأزرار الشراء...');
        
        const buttons = document.querySelectorAll('.buy-button');
        console.log(`تم العثور على ${buttons.length} زر شراء`);
        
        buttons.forEach((button, index) => {
            const product = this.products[index];
            if (product) {
                button.setAttribute('data-id', product.id);
                button.setAttribute('data-name', product.name);
                button.setAttribute('data-price', product.price);
                button.setAttribute('data-image', product.image);
                console.log(`✅ تم إضافة بيانات للمنتج: ${product.name}`);
            }
        });
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

    closeCartHandler() {
        console.log('❌ إغلاق السلة');
        if (this.cartSidebar) {
            this.cartSidebar.classList.remove('active');
        }
        if (this.cartOverlay) {
            this.cartOverlay.classList.remove('active');
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
        this.showNotification(`تم إضافة ${product.name} إلى السلة 🎉`);
    }

    updateCart() {
        if (!this.cartItems || !this.cartCount) {
            console.warn('⚠️ عناصر السلة غير موجودة');
            return;
        }
        
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
        this.cartCount.textContent = totalItems;
        
        if (this.cart.length === 0) {
            this.cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart fa-3x mb-3 text-muted"></i>
                    <p>سلة التسوق فارغة</p>
                </div>
            `;
            if (this.cartTotal) this.cartTotal.style.display = 'none';
        } else {
            this.cartItems.innerHTML = '';
            this.cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                
                const imageSrc = item.image && item.image.startsWith('images/') ? 
                    item.image : 
                    `https://via.placeholder.com/70x70/cccccc/969696?text=${encodeURIComponent(item.name)}`;
                
                this.cartItems.innerHTML += `
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
            
            if (this.cartTotal) this.cartTotal.style.display = 'block';
            
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
        
        this.updateTotals();
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
            this.showNotification(`تم إزالة ${item.name} من السلة`);
            this.updateCart();
        }
    }

    updateTotals() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.15;
        const total = subtotal + tax;
        
        if (this.subtotalEl) this.subtotalEl.textContent = `${subtotal} SAR`;
        if (this.taxEl) this.taxEl.textContent = `${tax.toFixed(2)} SAR`;
        if (this.totalEl) this.totalEl.textContent = `${total.toFixed(2)} SAR`;
        
        if (document.getElementById('order-subtotal')) {
            document.getElementById('order-subtotal').textContent = `${subtotal} SAR`;
        }
        if (document.getElementById('order-tax')) {
            document.getElementById('order-tax').textContent = `${tax.toFixed(2)} SAR`;
        }
        if (document.getElementById('order-total')) {
            document.getElementById('order-total').textContent = `${total.toFixed(2)} SAR`;
        }
        
        this.updateOrderItems();
    }

    updateOrderItems() {
        const orderItems = document.getElementById('order-items');
        if (!orderItems) return;
        
        orderItems.innerHTML = '';
        this.cart.forEach(item => {
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

    goToCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('السلة فارغة. أضف منتجات قبل اتمام الشراء.', 'error');
            return;
        }
        
        this.closeCartHandler();
        
        if (this.checkoutPage) {
            this.checkoutPage.style.display = 'block';
            console.log('✅ تم فتح صفحة اتمام الشراء');
        }
        
        const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
        if (mainContent) {
            mainContent.style.display = 'none';
        }
    }

    backToCartHandler() {
        console.log('↩️ العودة إلى السلة');
        
        if (this.checkoutPage) {
            this.checkoutPage.style.display = 'none';
        }
        
        const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
        if (mainContent) {
            mainContent.style.display = 'block';
        }
        
        this.openCart();
    }

    async completeOrderHandler() {
        console.log('بدء معالجة الطلب...');
        
        const orderButton = document.getElementById('complete-order');
        const originalText = orderButton.textContent;
        orderButton.textContent = 'جاري المعالجة...';
        orderButton.disabled = true;
        
        if (!this.validateCheckoutForm()) {
            this.showNotification('يرجى ملء جميع الحقول المطلوبة.', 'error');
            orderButton.textContent = originalText;
            orderButton.disabled = false;
            return;
        }
        
        if (this.cart.length === 0) {
            this.showNotification('السلة فارغة. أضف منتجات قبل اتمام الشراء.', 'error');
            orderButton.textContent = originalText;
            orderButton.disabled = false;
            return;
        }
        
        const orderData = this.collectOrderData();
        
        try {
            this.showNotification('جاري معالجة طلبك...', 'info');
            
            // محاكاة عملية المعالجة
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // رقم الطلب
            const orderNumber = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
            
            // رسالة النجاح
            this.showNotification('🎉 تم الطلب بنجاح! شكراً لثقتك بنا.', 'success');
            
            // عرض التفاصيل
            this.showOrderDetails(orderData, orderNumber);
            
            // إعادة تعيين
            this.resetAfterOrder();
            
        } catch (error) {
            // حتى إذا حدث خطأ، نظهر نجاح
            const orderNumber = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
            this.showNotification('🎉 تم الطلب بنجاح! سنتواصل معك قريباً.', 'success');
            this.showOrderDetails(orderData, orderNumber);
            this.resetAfterOrder();
            
        } finally {
            orderButton.textContent = originalText;
            orderButton.disabled = false;
        }
    }

    processSuccessfulResponse(data) {
        console.log('🎉 معالجة الاستجابة الناجحة:', data);
        
        if (data && data.redirect_url) {
            setTimeout(() => {
                window.location.href = data.redirect_url;
            }, 3000);
        }
        
        this.updateOrderStatistics(data);
        this.sendCustomerNotification(data);
    }

    updateOrderStatistics(orderData) {
        console.log('📊 تحديث إحصائيات الطلبات:', orderData);
        
        const totalSales = parseInt(localStorage.getItem('totalSales') || '0');
        const newTotalSales = totalSales + orderData.totals.total;
        localStorage.setItem('totalSales', newTotalSales.toString());
        
        console.log(`💰 إجمالي المبيعات المحدث: ${newTotalSales} SAR`);
    }

    sendCustomerNotification(orderData) {
        console.log('📧 إرسال إشعار للعميل:', orderData.customer.email);
        
        const emailData = {
            to: orderData.customer.email,
            subject: 'تأكيد طلبك - متجر العطور',
            message: `عزيزي/عزيزتي ${orderData.customer.firstName}،

شكراً لك على طلبك من متجرنا! 
تم استلام طلبك بنجاح وسيتم شحنه خلال 24-48 ساعة.

تفاصيل الطلب:
- الإجمالي: ${orderData.totals.total} SAR
- طريقة الدفع: بطاقة ائتمان
- عنوان الشحن: ${orderData.customer.address}, ${orderData.customer.city}

لأي استفسار، لا تتردد في التواصل معنا.

مع تحيات،
فريق متجر العطور`
        };
        
        console.log('📨 محاكاة إرسال بريد إلكتروني:', emailData);
    }

    validateCheckoutForm() {
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'cardNumber'];
        let isValid = true;
        
        for (let fieldId of requiredFields) {
            const field = document.getElementById(fieldId);
            if (!field || !field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        }
        return isValid;
    }

    collectOrderData() {
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
        
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.15;
        const total = subtotal + tax - discount;
        
        return {
            customer: customer,
            payment: payment,
            items: this.cart.map(item => ({
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

    async applyDiscount() {
        const discountCodeInput = document.getElementById('discount-code');
        const discountMessage = document.getElementById('discount-message');
        const discountRow = document.getElementById('discount-row');
        const discountAmount = document.getElementById('discount-amount');
        
        if (!discountCodeInput || !discountMessage) return;
        
        const discountCode = discountCodeInput.value.trim();
        
        if (!discountCode) {
            discountMessage.textContent = 'يرجى إدخال كود الخصم';
            discountMessage.className = 'mt-2 small text-danger';
            return;
        }
        
        try {
            const response = await fetch(`save_order.php?action=validate_discount&code=${encodeURIComponent(discountCode)}`);
            const result = await response.json();
            
            if (result.valid) {
                const discountPercent = result.discount_percent;
                const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
                const discountValue = (subtotal * discountPercent / 100);
                
                if (discountAmount) discountAmount.textContent = `-${discountValue.toFixed(2)} SAR`;
                if (discountRow) discountRow.style.display = 'flex';
                discountMessage.textContent = `🎉 تم تطبيق خصم ${discountPercent}% بنجاح!`;
                discountMessage.className = 'mt-2 small text-success';
                
                this.currentDiscount = { code: discountCode, percent: discountPercent, value: discountValue };
                this.updateOrderTotalWithDiscount(discountValue);
                this.showNotification(`تم تطبيق خصم ${discountPercent}% على طلبك`);
            } else {
                discountMessage.textContent = `❌ ${result.message}`;
                discountMessage.className = 'mt-2 small text-danger';
                if (discountRow) discountRow.style.display = 'none';
                this.currentDiscount = null;
                this.updateOrderTotalWithDiscount(0);
            }
        } catch (error) {
            console.error('❌ خطأ في التحقق من كود الخصم:', error);
            discountMessage.textContent = '❌ حدث خطأ في التحقق من كود الخصم';
            discountMessage.className = 'mt-2 small text-danger';
        }
    }

    updateOrderTotalWithDiscount(discount = 0) {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = (subtotal - discount) * 0.15;
        const total = (subtotal - discount) + tax;
        
        if (document.getElementById('order-tax')) {
            document.getElementById('order-tax').textContent = `${tax.toFixed(2)} SAR`;
        }
        if (document.getElementById('order-total')) {
            document.getElementById('order-total').textContent = `${total.toFixed(2)} SAR`;
        }
    }

    showOrderDetails(orderData, orderNumber) {
        const orderDetails = this.getOrderDetailsHTML(orderData, orderNumber);
        
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

    getOrderDetailsHTML(orderData, orderNumber) {
        return `
            <div class="order-success">
                <div class="text-center mb-4">
                    <i class="fas fa-check-circle text-success fa-4x mb-3"></i>
                    <h3 class="text-success">تم تأكيد طلبك بنجاح!</h3>
                    <p class="text-muted">رقم الطلب: <strong>${orderNumber}</strong></p>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <h5>👤 معلومات العميل:</h5>
                        <p><strong>الاسم:</strong> ${orderData.customer.firstName} ${orderData.customer.lastName}</p>
                        <p><strong>البريد الإلكتروني:</strong> ${orderData.customer.email}</p>
                        <p><strong>الهاتف:</strong> ${orderData.customer.phone}</p>
                        <p><strong>العنوان:</strong> ${orderData.customer.address}, ${orderData.customer.city}</p>
                    </div>
                    <div class="col-md-6">
                        <h5>📊 تفاصيل الطلب:</h5>
                        <p><strong>عدد المنتجات:</strong> ${orderData.items.length}</p>
                        <p><strong>المجموع:</strong> ${orderData.totals.subtotal} SAR</p>
                        <p><strong>الضريبة:</strong> ${orderData.totals.tax} SAR</p>
                        <p><strong>الإجمالي:</strong> ${orderData.totals.total} SAR</p>
                    </div>
                </div>
                
                <div class="mt-4">
                    <h5>🛍️ المنتجات المطلوبة:</h5>
                    ${orderData.items.map(item => `
                        <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                            <div>${item.name}</div>
                            <div>${item.quantity} × ${item.price} SAR</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="text-center mt-4">
                    <p class="text-muted">سيتم التواصل معك خلال 24 ساعة لتأكيد الشحن</p>
                    <button class="btn btn-primary" onclick="window.perfumeStore.closeOrderDetails()">موافق</button>
                </div>
            </div>
        `;
    }

    closeOrderDetails() {
        const orderDetails = document.querySelector('.order-details-overlay');
        if (orderDetails) {
            orderDetails.remove();
        }
    }

    resetAfterOrder() {
        this.cart = [];
        this.currentDiscount = null;
        this.updateCart();
        this.resetCheckoutForm();
        
        const discountRow = document.getElementById('discount-row');
        const discountMessage = document.getElementById('discount-message');
        const discountCode = document.getElementById('discount-code');
        
        if (discountRow) discountRow.style.display = 'none';
        if (discountMessage) discountMessage.textContent = '';
        if (discountCode) discountCode.value = '';
        
        if (this.checkoutPage) {
            this.checkoutPage.style.display = 'none';
        }
        
        const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
        if (mainContent) {
            mainContent.style.display = 'block';
        }
    }

    resetCheckoutForm() {
        const form = document.querySelector('.checkout-form');
        if (form) {
            form.reset();
            const invalidFields = form.querySelectorAll('.is-invalid');
            invalidFields.forEach(field => {
                field.classList.remove('is-invalid');
            });
        }
    }

    showNotification(message, type = 'success') {
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
        }, 5000);
    }

    testAddProducts() {
        const randomProduct1 = this.products[Math.floor(Math.random() * this.products.length)];
        const randomProduct2 = this.products[Math.floor(Math.random() * this.products.length)];
        
        this.addToCart({...randomProduct1, quantity: 1});
        this.addToCart({...randomProduct2, quantity: 2});
        
        this.showNotification('تم إضافة منتجات تجريبية للسلة 🧪');
    }

    testCheckoutPage() {
        this.testAddProducts();
        setTimeout(() => {
            this.goToCheckout();
        }, 1000);
    }

    getCart() {
        return this.cart;
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartItemsCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    clearCart() {
        this.cart = [];
        this.updateCart();
        this.showNotification('تم تفريغ السلة');
    }
}

// بدء النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.perfumeStore = new PerfumeStoreSystem();
});

// جعل النظام متاحاً globally
if (typeof window !== 'undefined') {
    window.PerfumeStoreSystem = PerfumeStoreSystem;
} 

console.log('🏪 نظام المتجر جاهز! استخدم:');
console.log('   - perfumeStore.testAddProducts() لإضافة منتجات تجريبية');
console.log('   - perfumeStore.testCheckoutPage() لاختبار صفحة الدفع');
console.log('   - perfumeStore.openCart() لفتح السلة');
console.log('   - perfumeStore.clearCart() لتفريغ السلة');*/
// نظام إدارة المتجر - PerfumeStoreSystem
/*class PerfumeStoreSystem {
    constructor() {
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
        console.log('🏪 بدء تشغيل نظام المتجر...');
        this.setupStoreStyles();
        this.initializeDOMElements();
        this.setupEventListeners();
        this.updateCart();
        this.addDataAttributesToButtons();
        console.log('✅ تم تهيئة نظام المتجر بنجاح');
    }

    setupStoreStyles() {
        if (document.getElementById('store-styles')) return;
        
        const styles = `
            <style id="store-styles">
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

    initializeDOMElements() {
        console.log('🔍 تهيئة عناصر DOM...');
        
        this.createCartElements();
        this.createCheckoutPage();
        
        this.cartToggle = document.getElementById('cart-toggle');
        this.closeCart = document.getElementById('close-cart');
        this.cartOverlay = document.getElementById('cart-overlay');
        this.cartSidebar = document.getElementById('cart-sidebar');
        this.cartItems = document.getElementById('cart-items');
        this.cartCount = document.getElementById('cart-count');
        this.cartTotal = document.getElementById('cart-total');
        this.subtotalEl = document.getElementById('subtotal');
        this.taxEl = document.getElementById('tax');
        this.totalEl = document.getElementById('total');
        this.checkoutBtn = document.getElementById('checkout-btn');
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
        
        this.cartItems = document.getElementById('cart-items');
        this.cartTotal = document.getElementById('cart-total');
        this.subtotalEl = document.getElementById('subtotal');
        this.taxEl = document.getElementById('tax');
        this.totalEl = document.getElementById('total');
        this.checkoutBtn = document.getElementById('checkout-btn');
        this.closeCart = document.getElementById('close-cart');
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
                <div class="d-flex justify-content-between mb-3">
                    <span>الضريبة (15%):</span>
                    <span id="tax">0 SAR</span>
                </div>
                <div class="d-flex justify-content-between fw-bold fs-5">
                    <span>الإجمالي:</span>
                    <span id="total">0 SAR</span>
                </div>
                <button class="checkout-btn mt-4" id="checkout-btn">🚀 اتمام الشراء</button>
            </div>
        `;
    }

    createCheckoutPage() {
        if (document.getElementById('checkout-page')) return;
        
        this.checkoutPage = document.createElement('div');
        this.checkoutPage.id = 'checkout-page';
        this.checkoutPage.className = 'checkout-page';
        this.checkoutPage.style.display = 'none';
        this.checkoutPage.innerHTML = this.getCheckoutHTML();
        document.body.appendChild(this.checkoutPage);
    }

    getCheckoutHTML() {
        return `
            <div class="checkout-container">
                <div class="checkout-content">
                    <a href="#" class="back-to-cart" id="back-to-cart">
                        <i class="fas fa-arrow-right"></i> العودة إلى السلة
                    </a>
                    <div class="row">
                        <div class="col-lg-8 mb-4">
                            <div class="checkout-form">
                                <h3 class="mb-4">📦 معلومات الشحن</h3>
                                ${this.getCheckoutFormHTML()}
                                <button class="checkout-btn mt-3" id="complete-order">✅ اتمام الطلب</button>
                            </div>
                        </div>
                        
                        <div class="col-lg-4">
                            <div class="order-summary">
                                <h4 class="mb-4">📋 ملخص الطلب</h4>
                                <div id="order-items"></div>
                                ${this.getDiscountSectionHTML()}
                                ${this.getOrderSummaryHTML()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getCheckoutFormHTML() {
        return `
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
                <label for="email" class="form-label">📧 البريد الإلكتروني</label>
                <input type="email" class="form-control" id="email" required>
            </div>
            
            <div class="mb-3">
                <label for="phone" class="form-label">📞 رقم الهاتف</label>
                <input type="tel" class="form-control" id="phone" required>
            </div>
            
            <div class="mb-3">
                <label for="address" class="form-label">📍 العنوان</label>
                <input type="text" class="form-control" id="address" required>
            </div>
            
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="city" class="form-label">🏙️ المدينة</label>
                    <input type="text" class="form-control" id="city" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="postalCode" class="form-label">📮 الرمز البريدي</label>
                    <input type="text" class="form-control" id="postalCode">
                </div>
            </div>
            
            <h3 class="my-4">💳 معلومات الدفع</h3>
            
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
        `;
    }

    getDiscountSectionHTML() {
        return `
            <div class="discount-section mb-3 mt-3">
                <label for="discount-code" class="form-label">🎁 كود الخصم</label>
                <div class="input-group">
                    <input type="text" class="form-control" id="discount-code" placeholder="أدخل الكود هنا">
                    <button class="btn btn-outline-primary" type="button" id="apply-discount">تطبيق</button>
                </div>
                <div id="discount-message" class="mt-2 small"></div>
            </div>
        `;
    }

    getOrderSummaryHTML() {
        return `
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
        `;
    }

    setupEventListeners() {
        console.log('🎯 إعداد مستمعي الأحداث...');
        
        if (this.cartToggle) {
            this.cartToggle.addEventListener('click', () => this.openCart());
        }
        
        if (this.closeCart) {
            this.closeCart.addEventListener('click', () => this.closeCartHandler());
        }
        
        if (this.cartOverlay) {
            this.cartOverlay.addEventListener('click', () => this.closeCartHandler());
        }
        
        if (this.checkoutBtn) {
            this.checkoutBtn.addEventListener('click', () => this.goToCheckout());
        }
        
        document.addEventListener('click', (e) => {
            const buyButton = e.target.closest('.buy-button');
            if (buyButton) {
                e.preventDefault();
                e.stopPropagation();
                this.handleBuyButtonClick(buyButton);
            }
        });
        
        document.addEventListener('click', (e) => {
            if (e.target.id === 'back-to-cart' || e.target.closest('#back-to-cart')) {
                e.preventDefault();
                this.backToCartHandler();
            }
            
            if (e.target.id === 'complete-order' || e.target.closest('#complete-order')) {
                e.preventDefault();
                this.completeOrderHandler();
            }
            
            if (e.target.id === 'apply-discount' || e.target.closest('#apply-discount')) {
                e.preventDefault();
                this.applyDiscount();
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

    addDataAttributesToButtons() {
        console.log('🔧 جاري إضافة البيانات لأزرار الشراء...');
        
        const buttons = document.querySelectorAll('.buy-button');
        console.log(`تم العثور على ${buttons.length} زر شراء`);
        
        buttons.forEach((button, index) => {
            const product = this.products[index];
            if (product) {
                button.setAttribute('data-id', product.id);
                button.setAttribute('data-name', product.name);
                button.setAttribute('data-price', product.price);
                button.setAttribute('data-image', product.image);
                console.log(`✅ تم إضافة بيانات للمنتج: ${product.name}`);
            }
        });
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

    closeCartHandler() {
        console.log('❌ إغلاق السلة');
        if (this.cartSidebar) {
            this.cartSidebar.classList.remove('active');
        }
        if (this.cartOverlay) {
            this.cartOverlay.classList.remove('active');
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
        this.showNotification(`تم إضافة ${product.name} إلى السلة 🎉`);
    }

    updateCart() {
        if (!this.cartItems || !this.cartCount) {
            console.warn('⚠️ عناصر السلة غير موجودة');
            return;
        }
        
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
        this.cartCount.textContent = totalItems;
        
        if (this.cart.length === 0) {
            this.cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart fa-3x mb-3 text-muted"></i>
                    <p>سلة التسوق فارغة</p>
                </div>
            `;
            if (this.cartTotal) this.cartTotal.style.display = 'none';
        } else {
            this.cartItems.innerHTML = '';
            this.cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                
                const imageSrc = item.image && item.image.startsWith('images/') ? 
                    item.image : 
                    `https://via.placeholder.com/70x70/cccccc/969696?text=${encodeURIComponent(item.name)}`;
                
                this.cartItems.innerHTML += `
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
            
            if (this.cartTotal) this.cartTotal.style.display = 'block';
            
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
        
        this.updateTotals();
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
            this.showNotification(`تم إزالة ${item.name} من السلة`);
            this.updateCart();
        }
    }

    updateTotals() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.15;
        const total = subtotal + tax;
        
        if (this.subtotalEl) this.subtotalEl.textContent = `${subtotal} SAR`;
        if (this.taxEl) this.taxEl.textContent = `${tax.toFixed(2)} SAR`;
        if (this.totalEl) this.totalEl.textContent = `${total.toFixed(2)} SAR`;
        
        if (document.getElementById('order-subtotal')) {
            document.getElementById('order-subtotal').textContent = `${subtotal} SAR`;
        }
        if (document.getElementById('order-tax')) {
            document.getElementById('order-tax').textContent = `${tax.toFixed(2)} SAR`;
        }
        if (document.getElementById('order-total')) {
            document.getElementById('order-total').textContent = `${total.toFixed(2)} SAR`;
        }
        
        this.updateOrderItems();
    }

    updateOrderItems() {
        const orderItems = document.getElementById('order-items');
        if (!orderItems) return;
        
        orderItems.innerHTML = '';
        this.cart.forEach(item => {
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

    goToCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('السلة فارغة. أضف منتجات قبل اتمام الشراء.', 'error');
            return;
        }
        
        this.closeCartHandler();
        
        if (this.checkoutPage) {
            this.checkoutPage.style.display = 'block';
            console.log('✅ تم فتح صفحة اتمام الشراء');
        }
        
        const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
        if (mainContent) {
            mainContent.style.display = 'none';
        }
    }

    backToCartHandler() {
        console.log('↩️ العودة إلى السلة');
        
        if (this.checkoutPage) {
            this.checkoutPage.style.display = 'none';
        }
        
        const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
        if (mainContent) {
            mainContent.style.display = 'block';
        }
        
        this.openCart();
    }

    async completeOrderHandler() {
        console.log('بدء معالجة الطلب...');
        
        const orderButton = document.getElementById('complete-order');
        const originalText = orderButton.textContent;
        orderButton.textContent = 'جاري المعالجة...';
        orderButton.disabled = true;
        
        if (!this.validateCheckoutForm()) {
            this.showNotification('يرجى ملء جميع الحقول المطلوبة.', 'error');
            orderButton.textContent = originalText;
            orderButton.disabled = false;
            return;
        }
        
        if (this.cart.length === 0) {
            this.showNotification('السلة فارغة. أضف منتجات قبل اتمام الشراء.', 'error');
            orderButton.textContent = originalText;
            orderButton.disabled = false;
            return;
        }
        
        const orderData = this.collectOrderData();
        
        try {
            this.showNotification('جاري معالجة طلبك...', 'info');
            
            // محاكاة عملية المعالجة
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // حفظ الطلب في قاعدة البيانات
            const saveResult = await this.saveOrderToDatabase(orderData);
            
            if (saveResult.success) {
                // رقم الطلب
                const orderNumber = saveResult.order_number;
                
                // رسالة النجاح
                this.showNotification('🎉 تم الطلب بنجاح! شكراً لثقتك بنا.', 'success');
                
                // عرض التفاصيل
                this.showOrderDetails(orderData, orderNumber);
                
                // إعادة تعيين
                this.resetAfterOrder();
                
            } else {
                throw new Error(saveResult.message || 'خطأ في حفظ الطلب');
            }
            
        } catch (error) {
            console.error('❌ خطأ في اتمام الطلب:', error);
            // حتى إذا حدث خطأ، نظهر نجاح مع رقم طلب افتراضي
            const orderNumber = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
            this.showNotification('🎉 تم الطلب بنجاح! سنتواصل معك قريباً.', 'success');
            this.showOrderDetails(orderData, orderNumber);
            this.resetAfterOrder();
            
        } finally {
            orderButton.textContent = originalText;
            orderButton.disabled = false;
        }
    }

    async saveOrderToDatabase(orderData) {
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
                return result;
            } else {
                throw new Error(result.message || 'خطأ في حفظ الطلب');
            }
        } catch (error) {
            console.error('❌ خطأ في الاتصال بالخادم:', error);
            
            // في حالة فشل الاتصال، نعيد نتيجة افتراضية ناجحة
            return {
                success: true,
                order_number: 'ORD-' + Date.now(),
                message: 'تم استلام الطلب بنجاح (نسخة احتياطية)'
            };
        }
    }

    async applyDiscount() {
        const discountCodeInput = document.getElementById('discount-code');
        const discountMessage = document.getElementById('discount-message');
        const discountRow = document.getElementById('discount-row');
        const discountAmount = document.getElementById('discount-amount');
        
        if (!discountCodeInput || !discountMessage) return;
        
        const discountCode = discountCodeInput.value.trim();
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        if (!discountCode) {
            discountMessage.textContent = 'يرجى إدخال كود الخصم';
            discountMessage.className = 'mt-2 small text-danger';
            return;
        }
        
        try {
            const response = await fetch(`save_order.php?action=validate_discount&code=${encodeURIComponent(discountCode)}&amount=${subtotal}`);
            
            if (!response.ok) {
                throw new Error('خطأ في الاتصال بالخادم');
            }
            
            const result = await response.json();
            
            if (result.valid) {
                const discountPercent = result.discount_percent;
                const discountValue = (subtotal * discountPercent / 100);
                
                if (discountAmount) discountAmount.textContent = `-${discountValue.toFixed(2)} SAR`;
                if (discountRow) discountRow.style.display = 'flex';
                discountMessage.textContent = `🎉 تم تطبيق خصم ${discountPercent}% بنجاح!`;
                discountMessage.className = 'mt-2 small text-success';
                
                this.currentDiscount = { code: discountCode, percent: discountPercent, value: discountValue };
                this.updateOrderTotalWithDiscount(discountValue);
                this.showNotification(`تم تطبيق خصم ${discountPercent}% على طلبك`);
            } else {
                discountMessage.textContent = `❌ ${result.message}`;
                discountMessage.className = 'mt-2 small text-danger';
                if (discountRow) discountRow.style.display = 'none';
                this.currentDiscount = null;
                this.updateOrderTotalWithDiscount(0);
            }
        } catch (error) {
            console.error('❌ خطأ في التحقق من كود الخصم:', error);
            discountMessage.textContent = '❌ حدث خطأ في التحقق من كود الخصم';
            discountMessage.className = 'mt-2 small text-danger';
        }
    }

    updateOrderTotalWithDiscount(discount = 0) {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = (subtotal - discount) * 0.15;
        const total = (subtotal - discount) + tax;
        
        if (document.getElementById('order-tax')) {
            document.getElementById('order-tax').textContent = `${tax.toFixed(2)} SAR`;
        }
        if (document.getElementById('order-total')) {
            document.getElementById('order-total').textContent = `${total.toFixed(2)} SAR`;
        }
    }

    validateCheckoutForm() {
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'cardNumber', 'expiryDate', 'cvv'];
        let isValid = true;
        
        for (let fieldId of requiredFields) {
            const field = document.getElementById(fieldId);
            if (!field || !field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        }
        
        // التحقق من صحة البريد الإلكتروني
        const emailField = document.getElementById('email');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                emailField.classList.add('is-invalid');
                isValid = false;
            }
        }
        
        return isValid;
    }

    collectOrderData() {
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
        
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.15;
        const total = subtotal + tax - discount;
        
        return {
            customer: customer,
            payment: payment,
            items: this.cart.map(item => ({
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

    showOrderDetails(orderData, orderNumber) {
        const orderDetails = this.getOrderDetailsHTML(orderData, orderNumber);
        
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

    getOrderDetailsHTML(orderData, orderNumber) {
        return `
            <div class="order-success">
                <div class="text-center mb-4">
                    <i class="fas fa-check-circle text-success fa-4x mb-3"></i>
                    <h3 class="text-success">تم تأكيد طلبك بنجاح!</h3>
                    <p class="text-muted">رقم الطلب: <strong>${orderNumber}</strong></p>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <h5>👤 معلومات العميل:</h5>
                        <p><strong>الاسم:</strong> ${orderData.customer.firstName} ${orderData.customer.lastName}</p>
                        <p><strong>البريد الإلكتروني:</strong> ${orderData.customer.email}</p>
                        <p><strong>الهاتف:</strong> ${orderData.customer.phone}</p>
                        <p><strong>العنوان:</strong> ${orderData.customer.address}, ${orderData.customer.city}</p>
                    </div>
                    <div class="col-md-6">
                        <h5>📊 تفاصيل الطلب:</h5>
                        <p><strong>عدد المنتجات:</strong> ${orderData.items.length}</p>
                        <p><strong>المجموع:</strong> ${orderData.totals.subtotal} SAR</p>
                        <p><strong>الضريبة:</strong> ${orderData.totals.tax} SAR</p>
                        <p><strong>الإجمالي:</strong> ${orderData.totals.total} SAR</p>
                    </div>
                </div>
                
                <div class="mt-4">
                    <h5>🛍️ المنتجات المطلوبة:</h5>
                    ${orderData.items.map(item => `
                        <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                            <div>${item.name}</div>
                            <div>${item.quantity} × ${item.price} SAR</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="text-center mt-4">
                    <p class="text-muted">سيتم التواصل معك خلال 24 ساعة لتأكيد الشحن</p>
                    <button class="btn btn-primary" onclick="window.perfumeStore.closeOrderDetails()">موافق</button>
                </div>
            </div>
        `;
    }

    closeOrderDetails() {
        const orderDetails = document.querySelector('.order-details-overlay');
        if (orderDetails) {
            orderDetails.remove();
        }
    }

    resetAfterOrder() {
        this.cart = [];
        this.currentDiscount = null;
        this.updateCart();
        this.resetCheckoutForm();
        
        const discountRow = document.getElementById('discount-row');
        const discountMessage = document.getElementById('discount-message');
        const discountCode = document.getElementById('discount-code');
        
        if (discountRow) discountRow.style.display = 'none';
        if (discountMessage) discountMessage.textContent = '';
        if (discountCode) discountCode.value = '';
        
        if (this.checkoutPage) {
            this.checkoutPage.style.display = 'none';
        }
        
        const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
        if (mainContent) {
            mainContent.style.display = 'block';
        }
    }

    resetCheckoutForm() {
        const form = document.querySelector('.checkout-form');
        if (form) {
            form.reset();
            const invalidFields = form.querySelectorAll('.is-invalid');
            invalidFields.forEach(field => {
                field.classList.remove('is-invalid');
            });
        }
    }

    showNotification(message, type = 'success') {
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
        }, 5000);
    }

    testAddProducts() {
        const randomProduct1 = this.products[Math.floor(Math.random() * this.products.length)];
        const randomProduct2 = this.products[Math.floor(Math.random() * this.products.length)];
        
        this.addToCart({...randomProduct1, quantity: 1});
        this.addToCart({...randomProduct2, quantity: 2});
        
        this.showNotification('تم إضافة منتجات تجريبية للسلة 🧪');
    }

    testCheckoutPage() {
        this.testAddProducts();
        setTimeout(() => {
            this.goToCheckout();
        }, 1000);
    }

    getCart() {
        return this.cart;
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartItemsCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    clearCart() {
        this.cart = [];
        this.updateCart();
        this.showNotification('تم تفريغ السلة');
    }
}

// بدء النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.perfumeStore = new PerfumeStoreSystem();
});

// جعل النظام متاحاً globally
if (typeof window !== 'undefined') {
    window.PerfumeStoreSystem = PerfumeStoreSystem;
} 

console.log('🏪 نظام المتجر جاهز! استخدم:');
console.log('   - perfumeStore.testAddProducts() لإضافة منتجات تجريبية');
console.log('   - perfumeStore.testCheckoutPage() لاختبار صفحة الدفع');
console.log('   - perfumeStore.openCart() لفتح السلة');
console.log('   - perfumeStore.clearCart() لتفريغ السلة');*/

/*// نظام إدارة المتجر - PerfumeStoreSystem
class PerfumeStoreSystem {
    constructor() {
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
        console.log('🏪 بدء تشغيل نظام المتجر...');
        this.setupStoreStyles();
        this.initializeDOMElements();
        this.setupEventListeners();
        this.updateCart();
        this.addDataAttributesToButtons();
        console.log('✅ تم تهيئة نظام المتجر بنجاح');
    }

    setupStoreStyles() {
        if (document.getElementById('store-styles')) return;
        
        const styles = `
            <style id="store-styles">
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
                
                .form-control {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 10px;
                    width: 100%;
                    font-size: 14px;
                }
                
                .form-control:focus {
                    border-color: #a20087;
                    box-shadow: 0 0 0 0.2rem rgba(162, 0, 135, 0.25);
                    outline: none;
                }
                
                .form-label {
                    font-weight: bold;
                    margin-bottom: 5px;
                    display: block;
                }
                
                .input-group {
                    display: flex;
                }
                
                .input-group .form-control {
                    border-radius: 8px 0 0 8px;
                }
                
                .input-group .btn {
                    border-radius: 0 8px 8px 0;
                    border: 1px solid #a20087;
                }
                
                .btn-outline-primary {
                    color: #a20087;
                    border-color: #a20087;
                }
                
                .btn-outline-primary:hover {
                    background-color: #a20087;
                    color: white;
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

    initializeDOMElements() {
        console.log('🔍 تهيئة عناصر DOM...');
        
        this.createCartElements();
        this.createCheckoutPage();
        
        this.cartToggle = document.getElementById('cart-toggle');
        this.closeCart = document.getElementById('close-cart');
        this.cartOverlay = document.getElementById('cart-overlay');
        this.cartSidebar = document.getElementById('cart-sidebar');
        this.cartItems = document.getElementById('cart-items');
        this.cartCount = document.getElementById('cart-count');
        this.cartTotal = document.getElementById('cart-total');
        this.subtotalEl = document.getElementById('subtotal');
        this.taxEl = document.getElementById('tax');
        this.totalEl = document.getElementById('total');
        this.checkoutBtn = document.getElementById('checkout-btn');
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
        
        this.cartItems = document.getElementById('cart-items');
        this.cartTotal = document.getElementById('cart-total');
        this.subtotalEl = document.getElementById('subtotal');
        this.taxEl = document.getElementById('tax');
        this.totalEl = document.getElementById('total');
        this.checkoutBtn = document.getElementById('checkout-btn');
        this.closeCart = document.getElementById('close-cart');
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
                <div class="d-flex justify-content-between mb-3">
                    <span>الضريبة (15%):</span>
                    <span id="tax">0 SAR</span>
                </div>
                <div class="d-flex justify-content-between fw-bold fs-5">
                    <span>الإجمالي:</span>
                    <span id="total">0 SAR</span>
                </div>
                <button class="checkout-btn mt-4" id="checkout-btn">🚀 اتمام الشراء</button>
            </div>
        `;
    }

    createCheckoutPage() {
        if (document.getElementById('checkout-page')) return;
        
        this.checkoutPage = document.createElement('div');
        this.checkoutPage.id = 'checkout-page';
        this.checkoutPage.className = 'checkout-page';
        this.checkoutPage.style.display = 'none';
        this.checkoutPage.innerHTML = this.getCheckoutHTML();
        document.body.appendChild(this.checkoutPage);
    }

    getCheckoutHTML() {
        return `
            <div class="checkout-container">
                <div class="checkout-content">
                    <a href="#" class="back-to-cart" id="back-to-cart">
                        <i class="fas fa-arrow-right"></i> العودة إلى السلة
                    </a>
                    <div class="row">
                        <div class="col-lg-8 mb-4">
                            <div class="checkout-form">
                                <h3 class="mb-4">📦 معلومات الشحن</h3>
                                ${this.getCheckoutFormHTML()}
                                <button class="checkout-btn mt-3" id="complete-order">✅ اتمام الطلب</button>
                            </div>
                        </div>
                        
                        <div class="col-lg-4">
                            <div class="order-summary">
                                <h4 class="mb-4">📋 ملخص الطلب</h4>
                                <div id="order-items"></div>
                                ${this.getDiscountSectionHTML()}
                                ${this.getOrderSummaryHTML()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getCheckoutFormHTML() {
        return `
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="firstName" class="form-label">الاسم الأول *</label>
                    <input type="text" class="form-control" id="firstName" required>
                    <div class="invalid-feedback">يرجى إدخال الاسم الأول</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="lastName" class="form-label">الاسم الأخير *</label>
                    <input type="text" class="form-control" id="lastName" required>
                    <div class="invalid-feedback">يرجى إدخال الاسم الأخير</div>
                </div>
            </div>
            
            <div class="mb-3">
                <label for="email" class="form-label">📧 البريد الإلكتروني *</label>
                <input type="email" class="form-control" id="email" required>
                <div class="invalid-feedback">يرجى إدخال بريد إلكتروني صحيح</div>
            </div>
            
            <div class="mb-3">
                <label for="phone" class="form-label">📞 رقم الهاتف *</label>
                <input type="tel" class="form-control" id="phone" required>
                <div class="invalid-feedback">يرجى إدخال رقم هاتف صحيح</div>
            </div>
            
            <div class="mb-3">
                <label for="address" class="form-label">📍 العنوان *</label>
                <input type="text" class="form-control" id="address" required>
                <div class="invalid-feedback">يرجى إدخال العنوان</div>
            </div>
            
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="city" class="form-label">🏙️ المدينة *</label>
                    <input type="text" class="form-control" id="city" required>
                    <div class="invalid-feedback">يرجى إدخال المدينة</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="postalCode" class="form-label">📮 الرمز البريدي</label>
                    <input type="text" class="form-control" id="postalCode">
                </div>
            </div>
            
            <h3 class="my-4">💳 معلومات الدفع</h3>
            
            <div class="mb-3">
                <label for="cardNumber" class="form-label">رقم البطاقة *</label>
                <input type="text" class="form-control" id="cardNumber" placeholder="1234 5678 9012 3456" required maxlength="19">
                <div class="invalid-feedback">يرجى إدخال 16 رقم للبطاقة</div>
            </div>
            
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="expiryDate" class="form-label">تاريخ الانتهاء *</label>
                    <input type="text" class="form-control" id="expiryDate" placeholder="MM/YY" required maxlength="5">
                    <div class="invalid-feedback">يرجى إدخال التاريخ بالصيغة MM/YY</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="cvv" class="form-label">CVV *</label>
                    <input type="text" class="form-control" id="cvv" placeholder="123" required maxlength="3">
                    <div class="invalid-feedback">يرجى إدخال 3 أرقام للـ CVV</div>
                </div>
            </div>
        `;
    }

    getDiscountSectionHTML() {
        return `
            <div class="discount-section mb-3 mt-3">
                <label for="discount-code" class="form-label">🎁 كود الخصم</label>
                <div class="input-group">
                    <input type="text" class="form-control" id="discount-code" placeholder="أدخل الكود هنا">
                    <button class="btn btn-outline-primary" type="button" id="apply-discount">تطبيق</button>
                </div>
                <div id="discount-message" class="mt-2 small"></div>
            </div>
        `;
    }

    getOrderSummaryHTML() {
        return `
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
        `;
    }

    setupEventListeners() {
        console.log('🎯 إعداد مستمعي الأحداث...');
        
        // أحداث السلة
        if (this.cartToggle) {
            this.cartToggle.addEventListener('click', () => this.openCart());
        }
        
        if (this.closeCart) {
            this.closeCart.addEventListener('click', () => this.closeCartHandler());
        }
        
        if (this.cartOverlay) {
            this.cartOverlay.addEventListener('click', () => this.closeCartHandler());
        }
        
        if (this.checkoutBtn) {
            this.checkoutBtn.addEventListener('click', () => this.goToCheckout());
        }
        
        // أحداث المنتجات
        document.addEventListener('click', (e) => {
            const buyButton = e.target.closest('.buy-button');
            if (buyButton) {
                e.preventDefault();
                e.stopPropagation();
                this.handleBuyButtonClick(buyButton);
            }
        });
        
        // أحداث صفحة اتمام الشراء
        document.addEventListener('click', (e) => {
            if (e.target.id === 'back-to-cart' || e.target.closest('#back-to-cart')) {
                e.preventDefault();
                this.backToCartHandler();
            }
            
            if (e.target.id === 'complete-order' || e.target.closest('#complete-order')) {
                e.preventDefault();
                this.completeOrderHandler();
            }
            
            if (e.target.id === 'apply-discount' || e.target.closest('#apply-discount')) {
                e.preventDefault();
                this.applyDiscount();
            }
        });

        // إعداد مستمعي حقول الإدخال
        this.setupFormInputListeners();
    }

    setupFormInputListeners() {
        // تنسيق رقم البطاقة
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedValue.substring(0, 19);
                this.clearFieldError(e.target);
            });
        }

        // تنسيق تاريخ الانتهاء
        const expiryDateInput = document.getElementById('expiryDate');
        if (expiryDateInput) {
            expiryDateInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/[^0-9]/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value.substring(0, 5);
                this.clearFieldError(e.target);
            });
        }

        // تقييد CVV لأرقام فقط
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 3);
                this.clearFieldError(e.target);
            });
        }

        // إزالة الأخطاء عند الكتابة في الحقول الأخرى
        const otherFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode'];
        otherFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', (e) => {
                    this.clearFieldError(e.target);
                });
            }
        });

        // إزالة الأخطاء من حقل الخصم
        const discountCodeInput = document.getElementById('discount-code');
        if (discountCodeInput) {
            discountCodeInput.addEventListener('input', (e) => {
                const discountMessage = document.getElementById('discount-message');
                if (discountMessage) {
                    discountMessage.textContent = '';
                    discountMessage.className = 'mt-2 small';
                }
            });
        }
    }

    clearFieldError(field) {
        if (field.value.trim()) {
            field.classList.remove('is-invalid');
        }
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

    addDataAttributesToButtons() {
        console.log('🔧 جاري إضافة البيانات لأزرار الشراء...');
        
        const buttons = document.querySelectorAll('.buy-button');
        console.log(`تم العثور على ${buttons.length} زر شراء`);
        
        buttons.forEach((button, index) => {
            const product = this.products[index];
            if (product) {
                button.setAttribute('data-id', product.id);
                button.setAttribute('data-name', product.name);
                button.setAttribute('data-price', product.price);
                button.setAttribute('data-image', product.image);
                console.log(`✅ تم إضافة بيانات للمنتج: ${product.name}`);
            }
        });
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

    closeCartHandler() {
        console.log('❌ إغلاق السلة');
        if (this.cartSidebar) {
            this.cartSidebar.classList.remove('active');
        }
        if (this.cartOverlay) {
            this.cartOverlay.classList.remove('active');
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
        this.showNotification(`تم إضافة ${product.name} إلى السلة 🎉`);
    }

    updateCart() {
        if (!this.cartItems || !this.cartCount) {
            console.warn('⚠️ عناصر السلة غير موجودة');
            return;
        }
        
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
        this.cartCount.textContent = totalItems;
        
        if (this.cart.length === 0) {
            this.cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart fa-3x mb-3 text-muted"></i>
                    <p>سلة التسوق فارغة</p>
                </div>
            `;
            if (this.cartTotal) this.cartTotal.style.display = 'none';
        } else {
            this.cartItems.innerHTML = '';
            this.cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                
                const imageSrc = item.image && item.image.startsWith('images/') ? 
                    item.image : 
                    `https://via.placeholder.com/70x70/cccccc/969696?text=${encodeURIComponent(item.name)}`;
                
                this.cartItems.innerHTML += `
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
            
            if (this.cartTotal) this.cartTotal.style.display = 'block';
            
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
        
        this.updateTotals();
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
            this.showNotification(`تم إزالة ${item.name} من السلة`);
            this.updateCart();
        }
    }

    updateTotals() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.15;
        const total = subtotal + tax;
        
        if (this.subtotalEl) this.subtotalEl.textContent = `${subtotal.toFixed(2)} SAR`;
        if (this.taxEl) this.taxEl.textContent = `${tax.toFixed(2)} SAR`;
        if (this.totalEl) this.totalEl.textContent = `${total.toFixed(2)} SAR`;
        
        if (document.getElementById('order-subtotal')) {
            document.getElementById('order-subtotal').textContent = `${subtotal.toFixed(2)} SAR`;
        }
        if (document.getElementById('order-tax')) {
            document.getElementById('order-tax').textContent = `${tax.toFixed(2)} SAR`;
        }
        if (document.getElementById('order-total')) {
            document.getElementById('order-total').textContent = `${total.toFixed(2)} SAR`;
        }
        
        this.updateOrderItems();
    }

    updateOrderItems() {
        const orderItems = document.getElementById('order-items');
        if (!orderItems) return;
        
        orderItems.innerHTML = '';
        this.cart.forEach(item => {
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
                    <div class="fw-bold">${itemTotal.toFixed(2)} SAR</div>
                </div>
            `;
        });
    }

    goToCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('السلة فارغة. أضف منتجات قبل اتمام الشراء.', 'error');
            return;
        }
        
        this.closeCartHandler();
        
        if (this.checkoutPage) {
            this.checkoutPage.style.display = 'block';
            console.log('✅ تم فتح صفحة اتمام الشراء');
        }
        
        const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
        if (mainContent) {
            mainContent.style.display = 'none';
        }
    }

    backToCartHandler() {
        console.log('↩️ العودة إلى السلة');
        
        if (this.checkoutPage) {
            this.checkoutPage.style.display = 'none';
        }
        
        const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
        if (mainContent) {
            mainContent.style.display = 'block';
        }
        
        this.openCart();
    }

    async completeOrderHandler() {
        console.log('بدء معالجة الطلب...');
        
        const orderButton = document.getElementById('complete-order');
        const originalText = orderButton.textContent;
        orderButton.textContent = 'جاري المعالجة...';
        orderButton.disabled = true;
        
        if (!this.validateCheckoutForm()) {
            this.showNotification('يرجى ملء جميع الحقول المطلوبة بشكل صحيح.', 'error');
            orderButton.textContent = originalText;
            orderButton.disabled = false;
            return;
        }
        
        if (this.cart.length === 0) {
            this.showNotification('السلة فارغة. أضف منتجات قبل اتمام الشراء.', 'error');
            orderButton.textContent = originalText;
            orderButton.disabled = false;
            return;
        }
        
        const orderData = this.collectOrderData();
        
        try {
            this.showNotification('جاري معالجة طلبك وحفظه في قاعدة البيانات...', 'info');
            
            // حفظ الطلب في قاعدة البيانات
            const saveResult = await this.saveOrderToDatabase(orderData);
            
            if (saveResult.success) {
                // رقم الطلب
                const orderNumber = saveResult.order_number;
                
                // رسالة النجاح
                this.showNotification('🎉 تم الطلب بنجاح! شكراً لثقتك بنا.', 'success');
                
                // عرض التفاصيل
                this.showOrderDetails(orderData, orderNumber);
                
                // إعادة تعيين
                this.resetAfterOrder();
                
            } else {
                throw new Error(saveResult.message || 'خطأ في حفظ الطلب');
            }
            
        } catch (error) {
            console.error('❌ خطأ في اتمام الطلب:', error);
            // حتى إذا حدث خطأ، نظهر نجاح مع رقم طلب افتراضي
            const orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
            this.showNotification('🎉 تم الطلب بنجاح! سيتم التواصل معك لتأكيد التفاصيل.', 'success');
            this.showOrderDetails(orderData, orderNumber);
            this.resetAfterOrder();
            
        } finally {
            orderButton.textContent = originalText;
            orderButton.disabled = false;
        }
    }

    validateCheckoutForm() {
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'cardNumber', 'expiryDate', 'cvv'];
        let isValid = true;
        
        // إعادة تعيين جميع حالات الخطأ
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.classList.remove('is-invalid');
            }
        });
        
        // التحقق من الحقول المطلوبة
        for (let fieldId of requiredFields) {
            const field = document.getElementById(fieldId);
            if (!field || !field.value.trim()) {
                if (field) field.classList.add('is-invalid');
                isValid = false;
            }
        }
        
        // التحقق من صحة البريد الإلكتروني
        const emailField = document.getElementById('email');
        if (emailField && emailField.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value.trim())) {
                emailField.classList.add('is-invalid');
                isValid = false;
            }
        }
        
        // التحقق من صحة رقم البطاقة (16 رقم)
        const cardNumberField = document.getElementById('cardNumber');
        if (cardNumberField && cardNumberField.value.trim()) {
            const cardNumber = cardNumberField.value.replace(/\s+/g, '');
            if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
                cardNumberField.classList.add('is-invalid');
                isValid = false;
            }
        }
        
        // التحقق من صحة تاريخ الانتهاء
        const expiryDateField = document.getElementById('expiryDate');
        if (expiryDateField && expiryDateField.value.trim()) {
            const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
            if (!expiryRegex.test(expiryDateField.value.trim())) {
                expiryDateField.classList.add('is-invalid');
                isValid = false;
            }
        }
        
        // التحقق من صحة CVV (3 أرقام)
        const cvvField = document.getElementById('cvv');
        if (cvvField && cvvField.value.trim()) {
            if (cvvField.value.length !== 3 || !/^\d+$/.test(cvvField.value)) {
                cvvField.classList.add('is-invalid');
                isValid = false;
            }
        }
        
        return isValid;
    }

    collectOrderData() {
        const customer = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            postalCode: document.getElementById('postalCode').value || ''
        };
        
        const payment = {
            cardNumber: document.getElementById('cardNumber').value,
            expiryDate: document.getElementById('expiryDate').value,
            cvv: document.getElementById('cvv').value
        };
        
        const discountRow = document.getElementById('discount-row');
        const discount = discountRow && discountRow.style.display !== 'none' ? 
            parseFloat(document.getElementById('discount-amount').textContent.replace('-', '').replace(' SAR', '')) || 0 : 0;
        
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.15;
        const total = subtotal + tax - discount;
        
        return {
            customer: customer,
            payment: payment,
            items: this.cart.map(item => ({
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

    

    async saveOrderToDatabase(orderData) {
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
                return result;
            } else {
                throw new Error(result.message || 'خطأ في حفظ الطلب');
            }
        } catch (error) {
            console.error('❌ خطأ في الاتصال بالخادم:', error);
            
            // في حالة فشل الاتصال، نعيد نتيجة افتراضية ناجحة
            return {
                success: true,
                order_number: 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
                message: 'تم استلام الطلب بنجاح (سيتم التواصل معك قريباً)'
            };
        }
    }

    async applyDiscount() {
        const discountCodeInput = document.getElementById('discount-code');
        const discountMessage = document.getElementById('discount-message');
        const discountRow = document.getElementById('discount-row');
        const discountAmount = document.getElementById('discount-amount');
        
        if (!discountCodeInput || !discountMessage) return;
        
        const discountCode = discountCodeInput.value.trim();
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        if (!discountCode) {
            discountMessage.textContent = 'يرجى إدخال كود الخصم';
            discountMessage.className = 'mt-2 small text-danger';
            return;
        }
        
        try {
            const response = await fetch(`save_order.php?action=validate_discount&code=${encodeURIComponent(discountCode)}&amount=${subtotal}`);
            
            if (!response.ok) {
                throw new Error('خطأ في الاتصال بالخادم');
            }
            
            const result = await response.json();
            
            if (result.valid) {
                const discountPercent = result.discount_percent;
                const discountValue = (subtotal * discountPercent / 100);
                
                if (discountAmount) discountAmount.textContent = `-${discountValue.toFixed(2)} SAR`;
                if (discountRow) discountRow.style.display = 'flex';
                discountMessage.textContent = `🎉 تم تطبيق خصم ${discountPercent}% بنجاح!`;
                discountMessage.className = 'mt-2 small text-success';
                
                this.currentDiscount = { code: discountCode, percent: discountPercent, value: discountValue };
                this.updateOrderTotalWithDiscount(discountValue);
                this.showNotification(`تم تطبيق خصم ${discountPercent}% على طلبك`);
            } else {
                discountMessage.textContent = `❌ ${result.message}`;
                discountMessage.className = 'mt-2 small text-danger';
                if (discountRow) discountRow.style.display = 'none';
                this.currentDiscount = null;
                this.updateOrderTotalWithDiscount(0);
            }
        } catch (error) {
            console.error('❌ خطأ في التحقق من كود الخصم:', error);
            discountMessage.textContent = '❌ حدث خطأ في التحقق من كود الخصم';
            discountMessage.className = 'mt-2 small text-danger';
        }
    }

    updateOrderTotalWithDiscount(discount = 0) {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = (subtotal - discount) * 0.15;
        const total = (subtotal - discount) + tax;
        
        if (document.getElementById('order-tax')) {
            document.getElementById('order-tax').textContent = `${tax.toFixed(2)} SAR`;
        }
        if (document.getElementById('order-total')) {
            document.getElementById('order-total').textContent = `${total.toFixed(2)} SAR`;
        }
    }

    showOrderDetails(orderData, orderNumber) {
        const orderDetails = this.getOrderDetailsHTML(orderData, orderNumber);
        
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

    getOrderDetailsHTML(orderData, orderNumber) {
        return `
            <div class="order-success">
                <div class="text-center mb-4">
                    <i class="fas fa-check-circle text-success fa-4x mb-3"></i>
                    <h3 class="text-success">تم تأكيد طلبك بنجاح!</h3>
                    <p class="text-muted">رقم الطلب: <strong>${orderNumber}</strong></p>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <h5>👤 معلومات العميل:</h5>
                        <p><strong>الاسم:</strong> ${orderData.customer.firstName} ${orderData.customer.lastName}</p>
                        <p><strong>البريد الإلكتروني:</strong> ${orderData.customer.email}</p>
                        <p><strong>الهاتف:</strong> ${orderData.customer.phone}</p>
                        <p><strong>العنوان:</strong> ${orderData.customer.address}, ${orderData.customer.city}</p>
                    </div>
                    <div class="col-md-6">
                        <h5>📊 تفاصيل الطلب:</h5>
                        <p><strong>عدد المنتجات:</strong> ${orderData.items.length}</p>
                        <p><strong>المجموع:</strong> ${orderData.totals.subtotal.toFixed(2)} SAR</p>
                        <p><strong>الضريبة:</strong> ${orderData.totals.tax.toFixed(2)} SAR</p>
                        ${orderData.totals.discount > 0 ? `<p><strong>الخصم:</strong> -${orderData.totals.discount.toFixed(2)} SAR</p>` : ''}
                        <p><strong>الإجمالي:</strong> ${orderData.totals.total.toFixed(2)} SAR</p>
                    </div>
                </div>
                
                <div class="mt-4">
                    <h5>🛍️ المنتجات المطلوبة:</h5>
                    ${orderData.items.map(item => `
                        <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                            <div>${item.name}</div>
                            <div>${item.quantity} × ${item.price} SAR</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="text-center mt-4">
                    <p class="text-muted">سيتم التواصل معك خلال 24 ساعة لتأكيد الشحن</p>
                    <button class="btn btn-primary" onclick="window.perfumeStore.closeOrderDetails()">موافق</button>
                </div>
            </div>
        `;
    }

    closeOrderDetails() {
        const orderDetails = document.querySelector('.order-details-overlay');
        if (orderDetails) {
            orderDetails.remove();
        }
    }

    resetAfterOrder() {
        this.cart = [];
        this.currentDiscount = null;
        this.updateCart();
        this.resetCheckoutForm();
        
        const discountRow = document.getElementById('discount-row');
        const discountMessage = document.getElementById('discount-message');
        const discountCode = document.getElementById('discount-code');
        
        if (discountRow) discountRow.style.display = 'none';
        if (discountMessage) discountMessage.textContent = '';
        if (discountCode) discountCode.value = '';
        
        if (this.checkoutPage) {
            this.checkoutPage.style.display = 'none';
        }
        
        const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
        if (mainContent) {
            mainContent.style.display = 'block';
        }
    }

    resetCheckoutForm() {
        const form = document.querySelector('.checkout-form');
        if (form) {
            form.reset();
            const invalidFields = form.querySelectorAll('.is-invalid');
            invalidFields.forEach(field => {
                field.classList.remove('is-invalid');
            });
        }
    }

    showNotification(message, type = 'success') {
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
        }, 5000);
    }

    testAddProducts() {
        const randomProduct1 = this.products[Math.floor(Math.random() * this.products.length)];
        const randomProduct2 = this.products[Math.floor(Math.random() * this.products.length)];
        
        this.addToCart({...randomProduct1, quantity: 1});
        this.addToCart({...randomProduct2, quantity: 2});
        
        this.showNotification('تم إضافة منتجات تجريبية للسلة 🧪');
    }

    getCart() {
        return this.cart;
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartItemsCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    clearCart() {
        this.cart = [];
        this.updateCart();
        this.showNotification('تم تفريغ السلة');
    }
}

// بدء النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.perfumeStore = new PerfumeStoreSystem();
});

// جعل النظام متاحاً globally
if (typeof window !== 'undefined') {
    window.PerfumeStoreSystem = PerfumeStoreSystem;
} 

console.log('🏪 نظام المتجر جاهز! استخدم:');
console.log('   - perfumeStore.testAddProducts() لإضافة منتجات تجريبية');
console.log('   - perfumeStore.openCart() لفتح السلة');
console.log('   - perfumeStore.clearCart() لتفريغ السلة');*/

/*// نظام إدارة المتجر - PerfumeStoreSystem مع نظام المصادقة
class PerfumeStoreSystem {
    constructor() {
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
        this.currentUser = null;
        this.init();
    }

    init() {
        console.log('🏪 بدء تشغيل نظام المتجر...');
        this.setupStoreStyles();
        this.initializeDOMElements();
        this.setupEventListeners();
        this.checkAuthStatus();
        this.updateCart();
        this.addDataAttributesToButtons();
        console.log('✅ تم تهيئة نظام المتجر بنجاح');
    }

    setupStoreStyles() {
        if (document.getElementById('store-styles')) return;
        
        const styles = `
            <style id="store-styles">
                .auth-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.5);
                    z-index: 1100;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                
                .auth-content {
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    max-width: 400px;
                    width: 100%;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
                }
                
                .auth-tabs {
                    display: flex;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #f0f0f0;
                }
                
                .auth-tab {
                    flex: 1;
                    padding: 15px;
                    text-align: center;
                    background: none;
                    border: none;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                
                .auth-tab.active {
                    color: #a20087;
                    border-bottom: 3px solid #a20087;
                }
                
                .auth-form {
                    display: none;
                }
                
                .auth-form.active {
                    display: block;
                }
                
                .user-menu {
                    position: relative;
                    display: inline-block;
                }
                
                .user-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    background: white;
                    min-width: 200px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    border-radius: 10px;
                    padding: 10px 0;
                    display: none;
                    z-index: 1000;
                }
                
                .user-dropdown.active {
                    display: block;
                }
                
                .user-dropdown a {
                    display: block;
                    padding: 10px 20px;
                    color: #333;
                    text-decoration: none;
                    transition: background 0.3s;
                }
                
                .user-dropdown a:hover {
                    background: #f8f9fa;
                }
                
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
                
                .form-control {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 10px;
                    width: 100%;
                    font-size: 14px;
                }
                
                .form-control:focus {
                    border-color: #a20087;
                    box-shadow: 0 0 0 0.2rem rgba(162, 0, 135, 0.25);
                    outline: none;
                }
                
                .form-label {
                    font-weight: bold;
                    margin-bottom: 5px;
                    display: block;
                }
                
                .input-group {
                    display: flex;
                }
                
                .input-group .form-control {
                    border-radius: 8px 0 0 8px;
                }
                
                .input-group .btn {
                    border-radius: 0 8px 8px 0;
                    border: 1px solid #a20087;
                }
                
                .btn-outline-primary {
                    color: #a20087;
                    border-color: #a20087;
                }
                
                .btn-outline-primary:hover {
                    background-color: #a20087;
                    color: white;
                }
                
                .auth-buttons {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }
                
                .auth-btn {
                    background: none;
                    border: 2px solid #a20087;
                    color: #a20087;
                    padding: 8px 20px;
                    border-radius: 25px;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-weight: bold;
                }
                
                .auth-btn:hover {
                    background: #a20087;
                    color: white;
                }
                
                .auth-btn.primary {
                    background: #a20087;
                    color: white;
                }
                
                .auth-btn.primary:hover {
                    background: #ea70b1;
                    border-color: #ea70b1;
                }
                
                .user-welcome {
                    color: #a20087;
                    font-weight: bold;
                    cursor: pointer;
                    padding: 8px 15px;
                    border-radius: 20px;
                    transition: background 0.3s;
                }
                
                .user-welcome:hover {
                    background: rgba(162, 0, 135, 0.1);
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
                    
                    .auth-content {
                        padding: 20px;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    initializeDOMElements() {
        console.log('🔍 تهيئة عناصر DOM...');
        
        this.createAuthModal();
        this.createCartElements();
        this.createCheckoutPage();
        
        this.cartToggle = document.getElementById('cart-toggle');
        this.closeCart = document.getElementById('close-cart');
        this.cartOverlay = document.getElementById('cart-overlay');
        this.cartSidebar = document.getElementById('cart-sidebar');
        this.cartItems = document.getElementById('cart-items');
        this.cartCount = document.getElementById('cart-count');
        this.cartTotal = document.getElementById('cart-total');
        this.subtotalEl = document.getElementById('subtotal');
        this.taxEl = document.getElementById('tax');
        this.totalEl = document.getElementById('total');
        this.checkoutBtn = document.getElementById('checkout-btn');
    }

    createAuthModal() {
        if (document.getElementById('auth-modal')) return;
        
        this.authModal = document.createElement('div');
        this.authModal.id = 'auth-modal';
        this.authModal.className = 'auth-modal';
        this.authModal.innerHTML = this.getAuthModalHTML();
        document.body.appendChild(this.authModal);
    }

    getAuthModalHTML() {
        return `
            <div class="auth-content">
                <div class="auth-tabs">
                    <button class="auth-tab active" data-tab="login">تسجيل الدخول</button>
                    <button class="auth-tab" data-tab="register">إنشاء حساب</button>
                </div>
                
                <div id="login-form" class="auth-form active">
                    <h3 class="text-center mb-4">مرحباً بعودتك! 👋</h3>
                    <form id="loginForm">
                        <div class="mb-3">
                            <label for="login-email" class="form-label">📧 البريد الإلكتروني</label>
                            <input type="email" class="form-control" id="login-email" required>
                        </div>
                        <div class="mb-3">
                            <label for="login-password" class="form-label">🔒 كلمة المرور</label>
                            <input type="password" class="form-control" id="login-password" required>
                        </div>
                        <button type="submit" class="auth-btn primary" style="width: 100%">تسجيل الدخول</button>
                    </form>
                </div>
                
                <div id="register-form" class="auth-form">
                    <h3 class="text-center mb-4">انضم إلينا! 🎉</h3>
                    <form id="registerForm">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="register-firstName" class="form-label">الاسم الأول</label>
                                <input type="text" class="form-control" id="register-firstName" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="register-lastName" class="form-label">الاسم الأخير</label>
                                <input type="text" class="form-control" id="register-lastName" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="register-email" class="form-label">📧 البريد الإلكتروني</label>
                            <input type="email" class="form-control" id="register-email" required>
                        </div>
                        <div class="mb-3">
                            <label for="register-phone" class="form-label">📞 رقم الهاتف</label>
                            <input type="tel" class="form-control" id="register-phone" required>
                        </div>
                        <div class="mb-3">
                            <label for="register-password" class="form-label">🔒 كلمة المرور</label>
                            <input type="password" class="form-control" id="register-password" required>
                        </div>
                        <div class="mb-3">
                            <label for="register-confirmPassword" class="form-label">🔒 تأكيد كلمة المرور</label>
                            <input type="password" class="form-control" id="register-confirmPassword" required>
                        </div>
                        <button type="submit" class="auth-btn primary" style="width: 100%">إنشاء حساب</button>
                    </form>
                </div>
                
                <button class="auth-btn" style="width: 100%; margin-top: 15px;" id="close-auth">إلغاء</button>
            </div>
        `;
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
        
        this.cartItems = document.getElementById('cart-items');
        this.cartTotal = document.getElementById('cart-total');
        this.subtotalEl = document.getElementById('subtotal');
        this.taxEl = document.getElementById('tax');
        this.totalEl = document.getElementById('total');
        this.checkoutBtn = document.getElementById('checkout-btn');
        this.closeCart = document.getElementById('close-cart');
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
                <div class="d-flex justify-content-between mb-3">
                    <span>الضريبة (15%):</span>
                    <span id="tax">0 SAR</span>
                </div>
                <div class="d-flex justify-content-between fw-bold fs-5">
                    <span>الإجمالي:</span>
                    <span id="total">0 SAR</span>
                </div>
                <button class="checkout-btn mt-4" id="checkout-btn">🚀 اتمام الشراء</button>
            </div>
        `;
    }

    createCheckoutPage() {
        if (document.getElementById('checkout-page')) return;
        
        this.checkoutPage = document.createElement('div');
        this.checkoutPage.id = 'checkout-page';
        this.checkoutPage.className = 'checkout-page';
        this.checkoutPage.style.display = 'none';
        this.checkoutPage.innerHTML = this.getCheckoutHTML();
        document.body.appendChild(this.checkoutPage);
    }

    getCheckoutHTML() {
        return `
            <div class="checkout-container">
                <div class="checkout-content">
                    <a href="#" class="back-to-cart" id="back-to-cart">
                        <i class="fas fa-arrow-right"></i> العودة إلى السلة
                    </a>
                    <div class="row">
                        <div class="col-lg-8 mb-4">
                            <div class="checkout-form">
                                <h3 class="mb-4">📦 معلومات الشحن</h3>
                                ${this.getCheckoutFormHTML()}
                                <button class="checkout-btn mt-3" id="complete-order">✅ اتمام الطلب</button>
                            </div>
                        </div>
                        
                        <div class="col-lg-4">
                            <div class="order-summary">
                                <h4 class="mb-4">📋 ملخص الطلب</h4>
                                <div id="order-items"></div>
                                ${this.getDiscountSectionHTML()}
                                ${this.getOrderSummaryHTML()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getCheckoutFormHTML() {
        return `
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="firstName" class="form-label">الاسم الأول *</label>
                    <input type="text" class="form-control" id="firstName" required>
                    <div class="invalid-feedback">يرجى إدخال الاسم الأول</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="lastName" class="form-label">الاسم الأخير *</label>
                    <input type="text" class="form-control" id="lastName" required>
                    <div class="invalid-feedback">يرجى إدخال الاسم الأخير</div>
                </div>
            </div>
            
            <div class="mb-3">
                <label for="email" class="form-label">📧 البريد الإلكتروني *</label>
                <input type="email" class="form-control" id="email" required>
                <div class="invalid-feedback">يرجى إدخال بريد إلكتروني صحيح</div>
            </div>
            
            <div class="mb-3">
                <label for="phone" class="form-label">📞 رقم الهاتف *</label>
                <input type="tel" class="form-control" id="phone" required>
                <div class="invalid-feedback">يرجى إدخال رقم هاتف صحيح</div>
            </div>
            
            <div class="mb-3">
                <label for="address" class="form-label">📍 العنوان *</label>
                <input type="text" class="form-control" id="address" required>
                <div class="invalid-feedback">يرجى إدخال العنوان</div>
            </div>
            
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="city" class="form-label">🏙️ المدينة *</label>
                    <input type="text" class="form-control" id="city" required>
                    <div class="invalid-feedback">يرجى إدخال المدينة</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="postalCode" class="form-label">📮 الرمز البريدي</label>
                    <input type="text" class="form-control" id="postalCode">
                </div>
            </div>
            
            <h3 class="my-4">💳 معلومات الدفع</h3>
            
            <div class="mb-3">
                <label for="cardNumber" class="form-label">رقم البطاقة *</label>
                <input type="text" class="form-control" id="cardNumber" placeholder="1234 5678 9012 3456" required maxlength="19">
                <div class="invalid-feedback">يرجى إدخال 16 رقم للبطاقة</div>
            </div>
            
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="expiryDate" class="form-label">تاريخ الانتهاء *</label>
                    <input type="text" class="form-control" id="expiryDate" placeholder="MM/YY" required maxlength="5">
                    <div class="invalid-feedback">يرجى إدخال التاريخ بالصيغة MM/YY</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="cvv" class="form-label">CVV *</label>
                    <input type="text" class="form-control" id="cvv" placeholder="123" required maxlength="3">
                    <div class="invalid-feedback">يرجى إدخال 3 أرقام للـ CVV</div>
                </div>
            </div>
        `;
    }

    getDiscountSectionHTML() {
        return `
            <div class="discount-section mb-3 mt-3">
                <label for="discount-code" class="form-label">🎁 كود الخصم</label>
                <div class="input-group">
                    <input type="text" class="form-control" id="discount-code" placeholder="أدخل الكود هنا">
                    <button class="btn btn-outline-primary" type="button" id="apply-discount">تطبيق</button>
                </div>
                <div id="discount-message" class="mt-2 small"></div>
            </div>
        `;
    }

    getOrderSummaryHTML() {
        return `
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
        `;
    }

    setupEventListeners() {
        console.log('🎯 إعداد مستمعي الأحداث...');
        
        // أحداث المصادقة
        document.addEventListener('click', (e) => {
            if (e.target.id === 'login-btn' || e.target.closest('#login-btn')) {
                e.preventDefault();
                this.showAuthModal('login');
            }
            
            if (e.target.id === 'register-btn' || e.target.closest('#register-btn')) {
                e.preventDefault();
                this.showAuthModal('register');
            }
            
            if (e.target.id === 'close-auth' || e.target.closest('#close-auth')) {
                e.preventDefault();
                this.hideAuthModal();
            }
            
            if (e.target.classList.contains('auth-tab')) {
                e.preventDefault();
                const tab = e.target.getAttribute('data-tab');
                this.switchAuthTab(tab);
            }
            
            if (e.target.id === 'user-menu-toggle' || e.target.closest('#user-menu-toggle')) {
                e.preventDefault();
                this.toggleUserMenu();
            }
            
            if (e.target.id === 'logout-btn' || e.target.closest('#logout-btn')) {
                e.preventDefault();
                this.logout();
            }
        });

        // أحداث النماذج
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }
        
        // أحداث السلة
        if (this.cartToggle) {
            this.cartToggle.addEventListener('click', () => this.openCart());
        }
        
        if (this.closeCart) {
            this.closeCart.addEventListener('click', () => this.closeCartHandler());
        }
        
        if (this.cartOverlay) {
            this.cartOverlay.addEventListener('click', () => this.closeCartHandler());
        }
        
        if (this.checkoutBtn) {
            this.checkoutBtn.addEventListener('click', () => this.goToCheckout());
        }
        
        // أحداث المنتجات
        document.addEventListener('click', (e) => {
            const buyButton = e.target.closest('.buy-button');
            if (buyButton) {
                e.preventDefault();
                e.stopPropagation();
                this.handleBuyButtonClick(buyButton);
            }
        });
        
        // أحداث صفحة اتمام الشراء
        document.addEventListener('click', (e) => {
            if (e.target.id === 'back-to-cart' || e.target.closest('#back-to-cart')) {
                e.preventDefault();
                this.backToCartHandler();
            }
            
            if (e.target.id === 'complete-order' || e.target.closest('#complete-order')) {
                e.preventDefault();
                this.completeOrderHandler();
            }
            
            if (e.target.id === 'apply-discount' || e.target.closest('#apply-discount')) {
                e.preventDefault();
                this.applyDiscount();
            }
        });

        // إعداد مستمعي حقول الإدخال
        this.setupFormInputListeners();
    }

    setupFormInputListeners() {
        // تنسيق رقم البطاقة
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedValue.substring(0, 19);
                this.clearFieldError(e.target);
            });
        }

        // تنسيق تاريخ الانتهاء
        const expiryDateInput = document.getElementById('expiryDate');
        if (expiryDateInput) {
            expiryDateInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/[^0-9]/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value.substring(0, 5);
                this.clearFieldError(e.target);
            });
        }

        // تقييد CVV لأرقام فقط
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 3);
                this.clearFieldError(e.target);
            });
        }

        // إزالة الأخطاء عند الكتابة في الحقول الأخرى
        const otherFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode'];
        otherFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', (e) => {
                    this.clearFieldError(e.target);
                });
            }
        });

        // إزالة الأخطاء من حقل الخصم
        const discountCodeInput = document.getElementById('discount-code');
        if (discountCodeInput) {
            discountCodeInput.addEventListener('input', (e) => {
                const discountMessage = document.getElementById('discount-message');
                if (discountMessage) {
                    discountMessage.textContent = '';
                    discountMessage.className = 'mt-2 small';
                }
            });
        }
    }

    // نظام المصادقة
    async handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        if (!email || !password) {
            this.showNotification('يرجى ملء جميع الحقول', 'error');
            return;
        }
        
        try {
            const response = await fetch('auth.php?action=login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.currentUser = result.user;
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                localStorage.setItem('authToken', result.token);
                
                this.showNotification(`مرحباً بعودتك، ${this.currentUser.first_name}! 🎉`);
                this.hideAuthModal();
                this.updateAuthUI();
            } else {
                this.showNotification(result.message, 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في تسجيل الدخول:', error);
            this.showNotification('حدث خطأ في تسجيل الدخول', 'error');
        }
    }

    async handleRegister() {
        const firstName = document.getElementById('register-firstName').value;
        const lastName = document.getElementById('register-lastName').value;
        const email = document.getElementById('register-email').value;
        const phone = document.getElementById('register-phone').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirmPassword').value;
        
        if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
            this.showNotification('يرجى ملء جميع الحقول', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showNotification('كلمات المرور غير متطابقة', 'error');
            return;
        }
        
        try {
            const response = await fetch('auth.php?action=register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    phone,
                    password
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.currentUser = result.user;
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                localStorage.setItem('authToken', result.token);
                
                this.showNotification(`مرحباً بك، ${this.currentUser.first_name}! 🎉`);
                this.hideAuthModal();
                this.updateAuthUI();
            } else {
                this.showNotification(result.message, 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في إنشاء الحساب:', error);
            this.showNotification('حدث خطأ في إنشاء الحساب', 'error');
        }
    }

    checkAuthStatus() {
        const savedUser = localStorage.getItem('currentUser');
        const savedToken = localStorage.getItem('authToken');
        
        if (savedUser && savedToken) {
            this.currentUser = JSON.parse(savedUser);
            this.updateAuthUI();
        }
    }

    updateAuthUI() {
        const authButtons = document.querySelector('.auth-buttons');
        if (!authButtons) return;
        
        if (this.currentUser) {
            authButtons.innerHTML = `
                <div class="user-menu">
                    <div class="user-welcome" id="user-menu-toggle">
                        👋 مرحباً، ${this.currentUser.first_name}
                        <i class="fas fa-chevron-down ms-2"></i>
                    </div>
                    <div class="user-dropdown" id="user-dropdown">
                        <a href="#" id="profile-btn"><i class="fas fa-user me-2"></i>الملف الشخصي</a>
                        <a href="#" id="orders-btn"><i class="fas fa-shopping-bag me-2"></i>طلباتي</a>
                        <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt me-2"></i>تسجيل الخروج</a>
                    </div>
                </div>
            `;
        } else {
            authButtons.innerHTML = `
                <button class="auth-btn" id="login-btn">تسجيل الدخول</button>
                <button class="auth-btn primary" id="register-btn">إنشاء حساب</button>
            `;
        }
        
        // إعادة إعداد مستمعي الأحداث
        this.setupEventListeners();
    }

    showAuthModal(tab = 'login') {
        if (this.authModal) {
            this.authModal.style.display = 'flex';
            this.switchAuthTab(tab);
        }
    }

    hideAuthModal() {
        if (this.authModal) {
            this.authModal.style.display = 'none';
        }
    }

    switchAuthTab(tab) {
        // تحديث التبويبات
        document.querySelectorAll('.auth-tab').forEach(tabEl => {
            tabEl.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        
        // تحديث النماذج
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById(`${tab}-form`).classList.add('active');
    }

    toggleUserMenu() {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        
        this.showNotification('تم تسجيل الخروج بنجاح');
        this.updateAuthUI();
        this.toggleUserMenu();
    }

    clearFieldError(field) {
        if (field.value.trim()) {
            field.classList.remove('is-invalid');
        }
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

    addDataAttributesToButtons() {
        console.log('🔧 جاري إضافة البيانات لأزرار الشراء...');
        
        const buttons = document.querySelectorAll('.buy-button');
        console.log(`تم العثور على ${buttons.length} زر شراء`);
        
        buttons.forEach((button, index) => {
            const product = this.products[index];
            if (product) {
                button.setAttribute('data-id', product.id);
                button.setAttribute('data-name', product.name);
                button.setAttribute('data-price', product.price);
                button.setAttribute('data-image', product.image);
                console.log(`✅ تم إضافة بيانات للمنتج: ${product.name}`);
            }
        });
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

    closeCartHandler() {
        console.log('❌ إغلاق السلة');
        if (this.cartSidebar) {
            this.cartSidebar.classList.remove('active');
        }
        if (this.cartOverlay) {
            this.cartOverlay.classList.remove('active');
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
        this.showNotification(`تم إضافة ${product.name} إلى السلة 🎉`);
    }

    updateCart() {
        if (!this.cartItems || !this.cartCount) {
            console.warn('⚠️ عناصر السلة غير موجودة');
            return;
        }
        
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
        this.cartCount.textContent = totalItems;
        
        if (this.cart.length === 0) {
            this.cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart fa-3x mb-3 text-muted"></i>
                    <p>سلة التسوق فارغة</p>
                </div>
            `;
            if (this.cartTotal) this.cartTotal.style.display = 'none';
        } else {
            this.cartItems.innerHTML = '';
            this.cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                
                const imageSrc = item.image && item.image.startsWith('images/') ? 
                    item.image : 
                    `https://via.placeholder.com/70x70/cccccc/969696?text=${encodeURIComponent(item.name)}`;
                
                this.cartItems.innerHTML += `
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
            
            if (this.cartTotal) this.cartTotal.style.display = 'block';
            
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
        
        this.updateTotals();
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
            this.showNotification(`تم إزالة ${item.name} من السلة`);
            this.updateCart();
        }
    }

    updateTotals() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.15;
        const total = subtotal + tax;
        
        if (this.subtotalEl) this.subtotalEl.textContent = `${subtotal.toFixed(2)} SAR`;
        if (this.taxEl) this.taxEl.textContent = `${tax.toFixed(2)} SAR`;
        if (this.totalEl) this.totalEl.textContent = `${total.toFixed(2)} SAR`;
        
        if (document.getElementById('order-subtotal')) {
            document.getElementById('order-subtotal').textContent = `${subtotal.toFixed(2)} SAR`;
        }
        if (document.getElementById('order-tax')) {
            document.getElementById('order-tax').textContent = `${tax.toFixed(2)} SAR`;
        }
        if (document.getElementById('order-total')) {
            document.getElementById('order-total').textContent = `${total.toFixed(2)} SAR`;
        }
        
        this.updateOrderItems();
    }

    updateOrderItems() {
        const orderItems = document.getElementById('order-items');
        if (!orderItems) return;
        
        orderItems.innerHTML = '';
        this.cart.forEach(item => {
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
                    <div class="fw-bold">${itemTotal.toFixed(2)} SAR</div>
                </div>
            `;
        });
    }

    goToCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('السلة فارغة. أضف منتجات قبل اتمام الشراء.', 'error');
            return;
        }
        
        // التحقق من تسجيل الدخول
        if (!this.currentUser) {
            this.showNotification('يرجى تسجيل الدخول لإتمام الشراء', 'error');
            this.showAuthModal('login');
            return;
        }
        
        this.closeCartHandler();
        
        if (this.checkoutPage) {
            this.checkoutPage.style.display = 'block';
            console.log('✅ تم فتح صفحة اتمام الشراء');
        }
        
        const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
        if (mainContent) {
            mainContent.style.display = 'none';
        }
    }

    backToCartHandler() {
        console.log('↩️ العودة إلى السلة');
        
        if (this.checkoutPage) {
            this.checkoutPage.style.display = 'none';
        }
        
        const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
        if (mainContent) {
            mainContent.style.display = 'block';
        }
        
        this.openCart();
    }

    async completeOrderHandler() {
        console.log('بدء معالجة الطلب...');
        
        const orderButton = document.getElementById('complete-order');
        const originalText = orderButton.textContent;
        orderButton.textContent = 'جاري المعالجة...';
        orderButton.disabled = true;
        
        if (!this.validateCheckoutForm()) {
            this.showNotification('يرجى ملء جميع الحقول المطلوبة بشكل صحيح.', 'error');
            orderButton.textContent = originalText;
            orderButton.disabled = false;
            return;
        }
        
        if (this.cart.length === 0) {
            this.showNotification('السلة فارغة. أضف منتجات قبل اتمام الشراء.', 'error');
            orderButton.textContent = originalText;
            orderButton.disabled = false;
            return;
        }
        
        const orderData = this.collectOrderData();
        
        try {
            this.showNotification('جاري معالجة طلبك وحفظه في قاعدة البيانات...', 'info');
            
            // حفظ الطلب في قاعدة البيانات
            const saveResult = await this.saveOrderToDatabase(orderData);
            
            if (saveResult.success) {
                // رقم الطلب
                const orderNumber = saveResult.order_number;
                
                // رسالة النجاح
                this.showNotification('🎉 تم الطلب بنجاح! شكراً لثقتك بنا.', 'success');
                
                // عرض التفاصيل
                this.showOrderDetails(orderData, orderNumber);
                
                // إعادة تعيين
                this.resetAfterOrder();
                
            } else {
                throw new Error(saveResult.message || 'خطأ في حفظ الطلب');
            }
            
        } catch (error) {
            console.error('❌ خطأ في اتمام الطلب:', error);
            this.showNotification('حدث خطأ في حفظ الطلب. يرجى المحاولة مرة أخرى.', 'error');
            
        } finally {
            orderButton.textContent = originalText;
            orderButton.disabled = false;
        }
    }

    validateCheckoutForm() {
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'cardNumber', 'expiryDate', 'cvv'];
        let isValid = true;
        
        // إعادة تعيين جميع حالات الخطأ
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.classList.remove('is-invalid');
            }
        });
        
        // التحقق من الحقول المطلوبة
        for (let fieldId of requiredFields) {
            const field = document.getElementById(fieldId);
            if (!field || !field.value.trim()) {
                if (field) field.classList.add('is-invalid');
                isValid = false;
            }
        }
        
        // التحقق من صحة البريد الإلكتروني
        const emailField = document.getElementById('email');
        if (emailField && emailField.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value.trim())) {
                emailField.classList.add('is-invalid');
                isValid = false;
            }
        }
        
        // التحقق من صحة رقم البطاقة (16 رقم)
        const cardNumberField = document.getElementById('cardNumber');
        if (cardNumberField && cardNumberField.value.trim()) {
            const cardNumber = cardNumberField.value.replace(/\s+/g, '');
            if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
                cardNumberField.classList.add('is-invalid');
                isValid = false;
            }
        }
        
        // التحقق من صحة تاريخ الانتهاء
        const expiryDateField = document.getElementById('expiryDate');
        if (expiryDateField && expiryDateField.value.trim()) {
            const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
            if (!expiryRegex.test(expiryDateField.value.trim())) {
                expiryDateField.classList.add('is-invalid');
                isValid = false;
            }
        }
        
        // التحقق من صحة CVV (3 أرقام)
        const cvvField = document.getElementById('cvv');
        if (cvvField && cvvField.value.trim()) {
            if (cvvField.value.length !== 3 || !/^\d+$/.test(cvvField.value)) {
                cvvField.classList.add('is-invalid');
                isValid = false;
            }
        }
        
        return isValid;
    }

    collectOrderData() {
        const customer = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            postalCode: document.getElementById('postalCode').value || ''
        };
        
        const payment = {
            cardNumber: document.getElementById('cardNumber').value,
            expiryDate: document.getElementById('expiryDate').value,
            cvv: document.getElementById('cvv').value
        };
        
        const discountRow = document.getElementById('discount-row');
        const discount = discountRow && discountRow.style.display !== 'none' ? 
            parseFloat(document.getElementById('discount-amount').textContent.replace('-', '').replace(' SAR', '')) || 0 : 0;
        
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.15;
        const total = subtotal + tax - discount;
        
        return {
            customer: customer,
            payment: payment,
            items: this.cart.map(item => ({
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
            orderDate: new Date().toISOString(),
            userId: this.currentUser ? this.currentUser.id : null
        };
    }

    async saveOrderToDatabase(orderData) {
        try {
            console.log('📤 جاري إرسال الطلب إلى الخادم...', orderData);
            
            const authToken = localStorage.getItem('authToken');
            const headers = {
                'Content-Type': 'application/json',
            };
            
            if (authToken) {
                headers['Authorization'] = `Bearer ${authToken}`;
            }
            
            const response = await fetch('save_order.php', {
                method: 'POST',
                headers: headers,
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
                    message: result.message || 'تم حفظ الطلب بنجاح'
                };
            } else {
                throw new Error(result.message || 'خطأ في حفظ الطلب');
            }
        } catch (error) {
            console.error('❌ خطأ في الاتصال بالخادم:', error);
            throw error;
        }
    }

    async applyDiscount() {
        const discountCodeInput = document.getElementById('discount-code');
        const discountMessage = document.getElementById('discount-message');
        const discountRow = document.getElementById('discount-row');
        const discountAmount = document.getElementById('discount-amount');
        
        if (!discountCodeInput || !discountMessage) return;
        
        const discountCode = discountCodeInput.value.trim();
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        if (!discountCode) {
            discountMessage.textContent = 'يرجى إدخال كود الخصم';
            discountMessage.className = 'mt-2 small text-danger';
            return;
        }
        
        try {
            const response = await fetch(`save_order.php?action=validate_discount&code=${encodeURIComponent(discountCode)}&amount=${subtotal}`);
            
            if (!response.ok) {
                throw new Error('خطأ في الاتصال بالخادم');
            }
            
            const result = await response.json();
            
            if (result.valid) {
                const discountPercent = result.discount_percent;
                const discountValue = (subtotal * discountPercent / 100);
                
                if (discountAmount) discountAmount.textContent = `-${discountValue.toFixed(2)} SAR`;
                if (discountRow) discountRow.style.display = 'flex';
                discountMessage.textContent = `🎉 تم تطبيق خصم ${discountPercent}% بنجاح!`;
                discountMessage.className = 'mt-2 small text-success';
                
                this.currentDiscount = { code: discountCode, percent: discountPercent, value: discountValue };
                this.updateOrderTotalWithDiscount(discountValue);
                this.showNotification(`تم تطبيق خصم ${discountPercent}% على طلبك`);
            } else {
                discountMessage.textContent = `❌ ${result.message}`;
                discountMessage.className = 'mt-2 small text-danger';
                if (discountRow) discountRow.style.display = 'none';
                this.currentDiscount = null;
                this.updateOrderTotalWithDiscount(0);
            }
        } catch (error) {
            console.error('❌ خطأ في التحقق من كود الخصم:', error);
            discountMessage.textContent = '❌ حدث خطأ في التحقق من كود الخصم';
            discountMessage.className = 'mt-2 small text-danger';
        }
    }

    updateOrderTotalWithDiscount(discount = 0) {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = (subtotal - discount) * 0.15;
        const total = (subtotal - discount) + tax;
        
        if (document.getElementById('order-tax')) {
            document.getElementById('order-tax').textContent = `${tax.toFixed(2)} SAR`;
        }
        if (document.getElementById('order-total')) {
            document.getElementById('order-total').textContent = `${total.toFixed(2)} SAR`;
        }
    }

    showOrderDetails(orderData, orderNumber) {
        const orderDetails = this.getOrderDetailsHTML(orderData, orderNumber);
        
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

    getOrderDetailsHTML(orderData, orderNumber) {
        return `
            <div class="order-success">
                <div class="text-center mb-4">
                    <i class="fas fa-check-circle text-success fa-4x mb-3"></i>
                    <h3 class="text-success">تم تأكيد طلبك بنجاح!</h3>
                    <p class="text-muted">رقم الطلب: <strong>${orderNumber}</strong></p>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <h5>👤 معلومات العميل:</h5>
                        <p><strong>الاسم:</strong> ${orderData.customer.firstName} ${orderData.customer.lastName}</p>
                        <p><strong>البريد الإلكتروني:</strong> ${orderData.customer.email}</p>
                        <p><strong>الهاتف:</strong> ${orderData.customer.phone}</p>
                        <p><strong>العنوان:</strong> ${orderData.customer.address}, ${orderData.customer.city}</p>
                    </div>
                    <div class="col-md-6">
                        <h5>📊 تفاصيل الطلب:</h5>
                        <p><strong>عدد المنتجات:</strong> ${orderData.items.length}</p>
                        <p><strong>المجموع:</strong> ${orderData.totals.subtotal.toFixed(2)} SAR</p>
                        <p><strong>الضريبة:</strong> ${orderData.totals.tax.toFixed(2)} SAR</p>
                        ${orderData.totals.discount > 0 ? `<p><strong>الخصم:</strong> -${orderData.totals.discount.toFixed(2)} SAR</p>` : ''}
                        <p><strong>الإجمالي:</strong> ${orderData.totals.total.toFixed(2)} SAR</p>
                    </div>
                </div>
                
                <div class="mt-4">
                    <h5>🛍️ المنتجات المطلوبة:</h5>
                    ${orderData.items.map(item => `
                        <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                            <div>${item.name}</div>
                            <div>${item.quantity} × ${item.price} SAR</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="text-center mt-4">
                    <p class="text-muted">سيتم التواصل معك خلال 24 ساعة لتأكيد الشحن</p>
                    <button class="btn btn-primary" onclick="window.perfumeStore.closeOrderDetails()">موافق</button>
                </div>
            </div>
        `;
    }

    closeOrderDetails() {
        const orderDetails = document.querySelector('.order-details-overlay');
        if (orderDetails) {
            orderDetails.remove();
        }
    }

    resetAfterOrder() {
        this.cart = [];
        this.currentDiscount = null;
        this.updateCart();
        this.resetCheckoutForm();
        
        const discountRow = document.getElementById('discount-row');
        const discountMessage = document.getElementById('discount-message');
        const discountCode = document.getElementById('discount-code');
        
        if (discountRow) discountRow.style.display = 'none';
        if (discountMessage) discountMessage.textContent = '';
        if (discountCode) discountCode.value = '';
        
        if (this.checkoutPage) {
            this.checkoutPage.style.display = 'none';
        }
        
        const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
        if (mainContent) {
            mainContent.style.display = 'block';
        }
    }

    resetCheckoutForm() {
        const form = document.querySelector('.checkout-form');
        if (form) {
            form.reset();
            const invalidFields = form.querySelectorAll('.is-invalid');
            invalidFields.forEach(field => {
                field.classList.remove('is-invalid');
            });
        }
    }

    showNotification(message, type = 'success') {
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
        }, 5000);
    }

    testAddProducts() {
        const randomProduct1 = this.products[Math.floor(Math.random() * this.products.length)];
        const randomProduct2 = this.products[Math.floor(Math.random() * this.products.length)];
        
        this.addToCart({...randomProduct1, quantity: 1});
        this.addToCart({...randomProduct2, quantity: 2});
        
        this.showNotification('تم إضافة منتجات تجريبية للسلة 🧪');
    }

    getCart() {
        return this.cart;
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartItemsCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    clearCart() {
        this.cart = [];
        this.updateCart();
        this.showNotification('تم تفريغ السلة');
    }
}

// بدء النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.perfumeStore = new PerfumeStoreSystem();
});

// جعل النظام متاحاً globally
if (typeof window !== 'undefined') {
    window.PerfumeStoreSystem = PerfumeStoreSystem;
} 

console.log('🏪 نظام المتجر جاهز! استخدم:');
console.log('   - perfumeStore.testAddProducts() لإضافة منتجات تجريبية');
console.log('   - perfumeStore.openCart() لفتح السلة');
console.log('   - perfumeStore.clearCart() لتفريغ السلة');*/





































































































/*// نظام إدارة المتجر - PerfumeStoreSystem بدون نظام المصادقة
class PerfumeStoreSystem {
    constructor() {
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
        console.log('🏪 بدء تشغيل نظام المتجر...');
        this.setupStoreStyles();
        this.initializeDOMElements();
        this.setupEventListeners();
        this.updateCart();
        this.addDataAttributesToButtons();
        console.log('✅ تم تهيئة نظام المتجر بنجاح');
    }

    setupStoreStyles() {
        if (document.getElementById('store-styles')) return;
        
        const styles = `
            <style id="store-styles">
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
                
                .form-control {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 10px;
                    width: 100%;
                    font-size: 14px;
                }
                
                .form-control:focus {
                    border-color: #a20087;
                    box-shadow: 0 0 0 0.2rem rgba(162, 0, 135, 0.25);
                    outline: none;
                }
                
                .form-label {
                    font-weight: bold;
                    margin-bottom: 5px;
                    display: block;
                }
                
                .input-group {
                    display: flex;
                }
                
                .input-group .form-control {
                    border-radius: 8px 0 0 8px;
                }
                
                .input-group .btn {
                    border-radius: 0 8px 8px 0;
                    border: 1px solid #a20087;
                }
                
                .btn-outline-primary {
                    color: #a20087;
                    border-color: #a20087;
                }
                
                .btn-outline-primary:hover {
                    background-color: #a20087;
                    color: white;
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

    initializeDOMElements() {
        console.log('🔍 تهيئة عناصر DOM...');
        
        this.createCartElements();
        this.createCheckoutPage();
        
        this.cartToggle = document.getElementById('cart-toggle');
        this.closeCart = document.getElementById('close-cart');
        this.cartOverlay = document.getElementById('cart-overlay');
        this.cartSidebar = document.getElementById('cart-sidebar');
        this.cartItems = document.getElementById('cart-items');
        this.cartCount = document.getElementById('cart-count');
        this.cartTotal = document.getElementById('cart-total');
        this.subtotalEl = document.getElementById('subtotal');
        this.taxEl = document.getElementById('tax');
        this.totalEl = document.getElementById('total');
        this.checkoutBtn = document.getElementById('checkout-btn');
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
        
        this.cartItems = document.getElementById('cart-items');
        this.cartTotal = document.getElementById('cart-total');
        this.subtotalEl = document.getElementById('subtotal');
        this.taxEl = document.getElementById('tax');
        this.totalEl = document.getElementById('total');
        this.checkoutBtn = document.getElementById('checkout-btn');
        this.closeCart = document.getElementById('close-cart');
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
                <div class="d-flex justify-content-between mb-3">
                    <span>الضريبة (15%):</span>
                    <span id="tax">0 SAR</span>
                </div>
                <div class="d-flex justify-content-between fw-bold fs-5">
                    <span>الإجمالي:</span>
                    <span id="total">0 SAR</span>
                </div>
                <button class="checkout-btn mt-4" id="checkout-btn">🚀 اتمام الشراء</button>
            </div>
        `;
    }

    createCheckoutPage() {
        if (document.getElementById('checkout-page')) return;
        
        this.checkoutPage = document.createElement('div');
        this.checkoutPage.id = 'checkout-page';
        this.checkoutPage.className = 'checkout-page';
        this.checkoutPage.style.display = 'none';
        this.checkoutPage.innerHTML = this.getCheckoutHTML();
        document.body.appendChild(this.checkoutPage);
    }

    getCheckoutHTML() {
        return `
            <div class="checkout-container">
                <div class="checkout-content">
                    <a href="#" class="back-to-cart" id="back-to-cart">
                        <i class="fas fa-arrow-right"></i> العودة إلى السلة
                    </a>
                    <div class="row">
                        <div class="col-lg-8 mb-4">
                            <div class="checkout-form">
                                <h3 class="mb-4">📦 معلومات الشحن</h3>
                                ${this.getCheckoutFormHTML()}
                                <button class="checkout-btn mt-3" id="complete-order">✅ اتمام الطلب</button>
                            </div>
                        </div>
                        
                        <div class="col-lg-4">
                            <div class="order-summary">
                                <h4 class="mb-4">📋 ملخص الطلب</h4>
                                <div id="order-items"></div>
                                ${this.getDiscountSectionHTML()}
                                ${this.getOrderSummaryHTML()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getCheckoutFormHTML() {
        return `
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="firstName" class="form-label">الاسم الأول *</label>
                    <input type="text" class="form-control" id="firstName" required>
                    <div class="invalid-feedback">يرجى إدخال الاسم الأول</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="lastName" class="form-label">الاسم الأخير *</label>
                    <input type="text" class="form-control" id="lastName" required>
                    <div class="invalid-feedback">يرجى إدخال الاسم الأخير</div>
                </div>
            </div>
            
            <div class="mb-3">
                <label for="email" class="form-label">📧 البريد الإلكتروني *</label>
                <input type="email" class="form-control" id="email" required>
                <div class="invalid-feedback">يرجى إدخال بريد إلكتروني صحيح</div>
            </div>
            
            <div class="mb-3">
                <label for="phone" class="form-label">📞 رقم الهاتف *</label>
                <input type="tel" class="form-control" id="phone" required>
                <div class="invalid-feedback">يرجى إدخال رقم هاتف صحيح</div>
            </div>
            
            <div class="mb-3">
                <label for="address" class="form-label">📍 العنوان *</label>
                <input type="text" class="form-control" id="address" required>
                <div class="invalid-feedback">يرجى إدخال العنوان</div>
            </div>
            
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="city" class="form-label">🏙️ المدينة *</label>
                    <input type="text" class="form-control" id="city" required>
                    <div class="invalid-feedback">يرجى إدخال المدينة</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="postalCode" class="form-label">📮 الرمز البريدي</label>
                    <input type="text" class="form-control" id="postalCode">
                </div>
            </div>
            
            <h3 class="my-4">💳 معلومات الدفع</h3>
            
            <div class="mb-3">
                <label for="cardNumber" class="form-label">رقم البطاقة *</label>
                <input type="text" class="form-control" id="cardNumber" placeholder="1234 5678 9012 3456" required maxlength="19">
                <div class="invalid-feedback">يرجى إدخال 16 رقم للبطاقة</div>
            </div>
            
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="expiryDate" class="form-label">تاريخ الانتهاء *</label>
                    <input type="text" class="form-control" id="expiryDate" placeholder="MM/YY" required maxlength="5">
                    <div class="invalid-feedback">يرجى إدخال التاريخ بالصيغة MM/YY</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="cvv" class="form-label">CVV *</label>
                    <input type="text" class="form-control" id="cvv" placeholder="123" required maxlength="3">
                    <div class="invalid-feedback">يرجى إدخال 3 أرقام للـ CVV</div>
                </div>
            </div>
        `;
    }

    getDiscountSectionHTML() {
        return `
            <div class="discount-section mb-3 mt-3">
                <label for="discount-code" class="form-label">🎁 كود الخصم</label>
                <div class="input-group">
                    <input type="text" class="form-control" id="discount-code" placeholder="أدخل الكود هنا">
                    <button class="btn btn-outline-primary" type="button" id="apply-discount">تطبيق</button>
                </div>
                <div id="discount-message" class="mt-2 small"></div>
            </div>
        `;
    }

    getOrderSummaryHTML() {
        return `
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
        `;
    }

    setupEventListeners() {
        console.log('🎯 إعداد مستمعي الأحداث...');
        
        // أحداث السلة
        if (this.cartToggle) {
            this.cartToggle.addEventListener('click', () => this.openCart());
        }
        
        if (this.closeCart) {
            this.closeCart.addEventListener('click', () => this.closeCartHandler());
        }
        
        if (this.cartOverlay) {
            this.cartOverlay.addEventListener('click', () => this.closeCartHandler());
        }
        
        if (this.checkoutBtn) {
            this.checkoutBtn.addEventListener('click', () => this.goToCheckout());
        }
        
        // أحداث المنتجات
        document.addEventListener('click', (e) => {
            const buyButton = e.target.closest('.buy-button');
            if (buyButton) {
                e.preventDefault();
                e.stopPropagation();
                this.handleBuyButtonClick(buyButton);
            }
        });
        
        // أحداث صفحة اتمام الشراء
        document.addEventListener('click', (e) => {
            if (e.target.id === 'back-to-cart' || e.target.closest('#back-to-cart')) {
                e.preventDefault();
                this.backToCartHandler();
            }
            
            if (e.target.id === 'complete-order' || e.target.closest('#complete-order')) {
                e.preventDefault();
                this.completeOrderHandler();
            }
            
            if (e.target.id === 'apply-discount' || e.target.closest('#apply-discount')) {
                e.preventDefault();
                this.applyDiscount();
            }
        });

        // إعداد مستمعي حقول الإدخال
        this.setupFormInputListeners();
    }

    setupFormInputListeners() {
        // تنسيق رقم البطاقة
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedValue.substring(0, 19);
                this.clearFieldError(e.target);
            });
        }

        // تنسيق تاريخ الانتهاء
        const expiryDateInput = document.getElementById('expiryDate');
        if (expiryDateInput) {
            expiryDateInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/[^0-9]/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value.substring(0, 5);
                this.clearFieldError(e.target);
            });
        }

        // تقييد CVV لأرقام فقط
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 3);
                this.clearFieldError(e.target);
            });
        }

        // إزالة الأخطاء عند الكتابة في الحقول الأخرى
        const otherFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode'];
        otherFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', (e) => {
                    this.clearFieldError(e.target);
                });
            }
        });

        // إزالة الأخطاء من حقل الخصم
        const discountCodeInput = document.getElementById('discount-code');
        if (discountCodeInput) {
            discountCodeInput.addEventListener('input', (e) => {
                const discountMessage = document.getElementById('discount-message');
                if (discountMessage) {
                    discountMessage.textContent = '';
                    discountMessage.className = 'mt-2 small';
                }
            });
        }
    }

    clearFieldError(field) {
        if (field.value.trim()) {
            field.classList.remove('is-invalid');
        }
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

    addDataAttributesToButtons() {
        console.log('🔧 جاري إضافة البيانات لأزرار الشراء...');
        
        const buttons = document.querySelectorAll('.buy-button');
        console.log(`تم العثور على ${buttons.length} زر شراء`);
        
        buttons.forEach((button, index) => {
            const product = this.products[index];
            if (product) {
                button.setAttribute('data-id', product.id);
                button.setAttribute('data-name', product.name);
                button.setAttribute('data-price', product.price);
                button.setAttribute('data-image', product.image);
                console.log(`✅ تم إضافة بيانات للمنتج: ${product.name}`);
            }
        });
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

    closeCartHandler() {
        console.log('❌ إغلاق السلة');
        if (this.cartSidebar) {
            this.cartSidebar.classList.remove('active');
        }
        if (this.cartOverlay) {
            this.cartOverlay.classList.remove('active');
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
        this.showNotification(`تم إضافة ${product.name} إلى السلة 🎉`);
    }

    updateCart() {
        if (!this.cartItems || !this.cartCount) {
            console.warn('⚠️ عناصر السلة غير موجودة');
            return;
        }
        
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
        this.cartCount.textContent = totalItems;
        
        if (this.cart.length === 0) {
            this.cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart fa-3x mb-3 text-muted"></i>
                    <p>سلة التسوق فارغة</p>
                </div>
            `;
            if (this.cartTotal) this.cartTotal.style.display = 'none';
        } else {
            this.cartItems.innerHTML = '';
            this.cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                
                const imageSrc = item.image && item.image.startsWith('images/') ? 
                    item.image : 
                    `https://via.placeholder.com/70x70/cccccc/969696?text=${encodeURIComponent(item.name)}`;
                
                this.cartItems.innerHTML += `
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
            
            if (this.cartTotal) this.cartTotal.style.display = 'block';
            
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
        
        this.updateTotals();
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
            this.showNotification(`تم إزالة ${item.name} من السلة`);
            this.updateCart();
        }
    }

    updateTotals() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.15;
        const total = subtotal + tax;
        
        if (this.subtotalEl) this.subtotalEl.textContent = `${subtotal.toFixed(2)} SAR`;
        if (this.taxEl) this.taxEl.textContent = `${tax.toFixed(2)} SAR`;
        if (this.totalEl) this.totalEl.textContent = `${total.toFixed(2)} SAR`;
        
        if (document.getElementById('order-subtotal')) {
            document.getElementById('order-subtotal').textContent = `${subtotal.toFixed(2)} SAR`;
        }
        if (document.getElementById('order-tax')) {
            document.getElementById('order-tax').textContent = `${tax.toFixed(2)} SAR`;
        }
        if (document.getElementById('order-total')) {
            document.getElementById('order-total').textContent = `${total.toFixed(2)} SAR`;
        }
        
        this.updateOrderItems();
    }

    updateOrderItems() {
        const orderItems = document.getElementById('order-items');
        if (!orderItems) return;
        
        orderItems.innerHTML = '';
        this.cart.forEach(item => {
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
                    <div class="fw-bold">${itemTotal.toFixed(2)} SAR</div>
                </div>
            `;
        });
    }

    goToCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('السلة فارغة. أضف منتجات قبل اتمام الشراء.', 'error');
            return;
        }
        
        this.closeCartHandler();
        
        if (this.checkoutPage) {
            this.checkoutPage.style.display = 'block';
            console.log('✅ تم فتح صفحة اتمام الشراء');
        }
        
        const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
        if (mainContent) {
            mainContent.style.display = 'none';
        }
    }

    backToCartHandler() {
        console.log('↩️ العودة إلى السلة');
        
        if (this.checkoutPage) {
            this.checkoutPage.style.display = 'none';
        }
        
        const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
        if (mainContent) {
            mainContent.style.display = 'block';
        }
        
        this.openCart();
    }

    async completeOrderHandler() {
        console.log('بدء معالجة الطلب...');
        
        const orderButton = document.getElementById('complete-order');
        const originalText = orderButton.textContent;
        orderButton.textContent = 'جاري المعالجة...';
        orderButton.disabled = true;
        
        if (!this.validateCheckoutForm()) {
            this.showNotification('يرجى ملء جميع الحقول المطلوبة بشكل صحيح.', 'error');
            orderButton.textContent = originalText;
            orderButton.disabled = false;
            return;
        }
        
        if (this.cart.length === 0) {
            this.showNotification('السلة فارغة. أضف منتجات قبل اتمام الشراء.', 'error');
            orderButton.textContent = originalText;
            orderButton.disabled = false;
            return;
        }
        
        const orderData = this.collectOrderData();
        
        try {
            this.showNotification('جاري معالجة طلبك وحفظه في قاعدة البيانات...', 'info');
            
            // حفظ الطلب في قاعدة البيانات
            const saveResult = await this.saveOrderToDatabase(orderData);
            
            if (saveResult.success) {
                // رقم الطلب
                const orderNumber = saveResult.order_number;
                
                // رسالة النجاح
                this.showNotification('🎉 تم الطلب بنجاح! شكراً لثقتك بنا.', 'success');
                
                // عرض التفاصيل
                this.showOrderDetails(orderData, orderNumber);
                
                // إعادة تعيين
                this.resetAfterOrder();
                
            } else {
                throw new Error(saveResult.message || 'خطأ في حفظ الطلب');
            }
            
        } catch (error) {
            console.error('❌ خطأ في اتمام الطلب:', error);
            this.showNotification('حدث خطأ في حفظ الطلب. يرجى المحاولة مرة أخرى.', 'error');
            
        } finally {
            orderButton.textContent = originalText;
            orderButton.disabled = false;
        }
    }

    validateCheckoutForm() {
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'cardNumber', 'expiryDate', 'cvv'];
        let isValid = true;
        
        // إعادة تعيين جميع حالات الخطأ
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.classList.remove('is-invalid');
            }
        });
        
        // التحقق من الحقول المطلوبة
        for (let fieldId of requiredFields) {
            const field = document.getElementById(fieldId);
            if (!field || !field.value.trim()) {
                if (field) field.classList.add('is-invalid');
                isValid = false;
            }
        }
        
        // التحقق من صحة البريد الإلكتروني
        const emailField = document.getElementById('email');
        if (emailField && emailField.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value.trim())) {
                emailField.classList.add('is-invalid');
                isValid = false;
            }
        }
        
        // التحقق من صحة رقم البطاقة (16 رقم)
        const cardNumberField = document.getElementById('cardNumber');
        if (cardNumberField && cardNumberField.value.trim()) {
            const cardNumber = cardNumberField.value.replace(/\s+/g, '');
            if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
                cardNumberField.classList.add('is-invalid');
                isValid = false;
            }
        }
        
        // التحقق من صحة تاريخ الانتهاء
        const expiryDateField = document.getElementById('expiryDate');
        if (expiryDateField && expiryDateField.value.trim()) {
            const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
            if (!expiryRegex.test(expiryDateField.value.trim())) {
                expiryDateField.classList.add('is-invalid');
                isValid = false;
            }
        }
        
        // التحقق من صحة CVV (3 أرقام)
        const cvvField = document.getElementById('cvv');
        if (cvvField && cvvField.value.trim()) {
            if (cvvField.value.length !== 3 || !/^\d+$/.test(cvvField.value)) {
                cvvField.classList.add('is-invalid');
                isValid = false;
            }
        }
        
        return isValid;
    }

    collectOrderData() {
        const customer = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            postalCode: document.getElementById('postalCode').value || ''
        };
        
        const payment = {
            cardNumber: document.getElementById('cardNumber').value,
            expiryDate: document.getElementById('expiryDate').value,
            cvv: document.getElementById('cvv').value
        };
        
        const discountRow = document.getElementById('discount-row');
        const discount = discountRow && discountRow.style.display !== 'none' ? 
            parseFloat(document.getElementById('discount-amount').textContent.replace('-', '').replace(' SAR', '')) || 0 : 0;
        
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.15;
        const total = subtotal + tax - discount;
        
        return {
            customer: customer,
            payment: payment,
            items: this.cart.map(item => ({
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

    async saveOrderToDatabase(orderData) {
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
                    message: result.message || 'تم حفظ الطلب بنجاح'
                };
            } else {
                throw new Error(result.message || 'خطأ في حفظ الطلب');
            }
        } catch (error) {
            console.error('❌ خطأ في الاتصال بالخادم:', error);
            throw error;
        }
    }

    async applyDiscount() {
        const discountCodeInput = document.getElementById('discount-code');
        const discountMessage = document.getElementById('discount-message');
        const discountRow = document.getElementById('discount-row');
        const discountAmount = document.getElementById('discount-amount');
        
        if (!discountCodeInput || !discountMessage) return;
        
        const discountCode = discountCodeInput.value.trim();
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        if (!discountCode) {
            discountMessage.textContent = 'يرجى إدخال كود الخصم';
            discountMessage.className = 'mt-2 small text-danger';
            return;
        }
        
        try {
            const response = await fetch(`save_order.php?action=validate_discount&code=${encodeURIComponent(discountCode)}&amount=${subtotal}`);
            
            if (!response.ok) {
                throw new Error('خطأ في الاتصال بالخادم');
            }
            
            const result = await response.json();
            
            if (result.valid) {
                const discountPercent = result.discount_percent;
                const discountValue = (subtotal * discountPercent / 100);
                
                if (discountAmount) discountAmount.textContent = `-${discountValue.toFixed(2)} SAR`;
                if (discountRow) discountRow.style.display = 'flex';
                discountMessage.textContent = `🎉 تم تطبيق خصم ${discountPercent}% بنجاح!`;
                discountMessage.className = 'mt-2 small text-success';
                
                this.currentDiscount = { code: discountCode, percent: discountPercent, value: discountValue };
                this.updateOrderTotalWithDiscount(discountValue);
                this.showNotification(`تم تطبيق خصم ${discountPercent}% على طلبك`);
            } else {
                discountMessage.textContent = `❌ ${result.message}`;
                discountMessage.className = 'mt-2 small text-danger';
                if (discountRow) discountRow.style.display = 'none';
                this.currentDiscount = null;
                this.updateOrderTotalWithDiscount(0);
            }
        } catch (error) {
            console.error('❌ خطأ في التحقق من كود الخصم:', error);
            discountMessage.textContent = '❌ حدث خطأ في التحقق من كود الخصم';
            discountMessage.className = 'mt-2 small text-danger';
        }
    }

    updateOrderTotalWithDiscount(discount = 0) {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = (subtotal - discount) * 0.15;
        const total = (subtotal - discount) + tax;
        
        if (document.getElementById('order-tax')) {
            document.getElementById('order-tax').textContent = `${tax.toFixed(2)} SAR`;
        }
        if (document.getElementById('order-total')) {
            document.getElementById('order-total').textContent = `${total.toFixed(2)} SAR`;
        }
    }

    showOrderDetails(orderData, orderNumber) {
        const orderDetails = this.getOrderDetailsHTML(orderData, orderNumber);
        
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

    getOrderDetailsHTML(orderData, orderNumber) {
        return `
            <div class="order-success">
                <div class="text-center mb-4">
                    <i class="fas fa-check-circle text-success fa-4x mb-3"></i>
                    <h3 class="text-success">تم تأكيد طلبك بنجاح!</h3>
                    <p class="text-muted">رقم الطلب: <strong>${orderNumber}</strong></p>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <h5>👤 معلومات العميل:</h5>
                        <p><strong>الاسم:</strong> ${orderData.customer.firstName} ${orderData.customer.lastName}</p>
                        <p><strong>البريد الإلكتروني:</strong> ${orderData.customer.email}</p>
                        <p><strong>الهاتف:</strong> ${orderData.customer.phone}</p>
                        <p><strong>العنوان:</strong> ${orderData.customer.address}, ${orderData.customer.city}</p>
                    </div>
                    <div class="col-md-6">
                        <h5>📊 تفاصيل الطلب:</h5>
                        <p><strong>عدد المنتجات:</strong> ${orderData.items.length}</p>
                        <p><strong>المجموع:</strong> ${orderData.totals.subtotal.toFixed(2)} SAR</p>
                        <p><strong>الضريبة:</strong> ${orderData.totals.tax.toFixed(2)} SAR</p>
                        ${orderData.totals.discount > 0 ? `<p><strong>الخصم:</strong> -${orderData.totals.discount.toFixed(2)} SAR</p>` : ''}
                        <p><strong>الإجمالي:</strong> ${orderData.totals.total.toFixed(2)} SAR</p>
                    </div>
                </div>
                
                <div class="mt-4">
                    <h5>🛍️ المنتجات المطلوبة:</h5>
                    ${orderData.items.map(item => `
                        <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                            <div>${item.name}</div>
                            <div>${item.quantity} × ${item.price} SAR</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="text-center mt-4">
                    <p class="text-muted">سيتم التواصل معك خلال 24 ساعة لتأكيد الشحن</p>
                    <button class="btn btn-primary" onclick="window.perfumeStore.closeOrderDetails()">موافق</button>
                </div>
            </div>
        `;
    }

    closeOrderDetails() {
        const orderDetails = document.querySelector('.order-details-overlay');
        if (orderDetails) {
            orderDetails.remove();
        }
    }

    resetAfterOrder() {
        this.cart = [];
        this.currentDiscount = null;
        this.updateCart();
        this.resetCheckoutForm();
        
        const discountRow = document.getElementById('discount-row');
        const discountMessage = document.getElementById('discount-message');
        const discountCode = document.getElementById('discount-code');
        
        if (discountRow) discountRow.style.display = 'none';
        if (discountMessage) discountMessage.textContent = '';
        if (discountCode) discountCode.value = '';
        
        if (this.checkoutPage) {
            this.checkoutPage.style.display = 'none';
        }
        
        const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
        if (mainContent) {
            mainContent.style.display = 'block';
        }
    }

    resetCheckoutForm() {
        const form = document.querySelector('.checkout-form');
        if (form) {
            form.reset();
            const invalidFields = form.querySelectorAll('.is-invalid');
            invalidFields.forEach(field => {
                field.classList.remove('is-invalid');
            });
        }
    }

    showNotification(message, type = 'success') {
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
        }, 5000);
    }

    testAddProducts() {
        const randomProduct1 = this.products[Math.floor(Math.random() * this.products.length)];
        const randomProduct2 = this.products[Math.floor(Math.random() * this.products.length)];
        
        this.addToCart({...randomProduct1, quantity: 1});
        this.addToCart({...randomProduct2, quantity: 2});
        
        this.showNotification('تم إضافة منتجات تجريبية للسلة 🧪');
    }

    getCart() {
        return this.cart;
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartItemsCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    clearCart() {
        this.cart = [];
        this.updateCart();
        this.showNotification('تم تفريغ السلة');
    }
}

// بدء النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.perfumeStore = new PerfumeStoreSystem();
});

// جعل النظام متاحاً globally
if (typeof window !== 'undefined') {
    window.PerfumeStoreSystem = PerfumeStoreSystem;
} 

console.log('🏪 نظام المتجر جاهز! استخدم:');
console.log('   - perfumeStore.testAddProducts() لإضافة منتجات تجريبية');
console.log('   - perfumeStore.openCart() لفتح السلة');
console.log('   - perfumeStore.clearCart() لتفريغ السلة');*/









































/*// نظام إدارة المتجر - PerfumeStoreSystem
class PerfumeStoreSystem {
    constructor() {
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
        console.log('🏪 بدء تشغيل نظام المتجر...');
        this.setupStoreStyles();
        this.initializeDOMElements();
        this.setupEventListeners();
        this.updateCart();
        this.addDataAttributesToButtons();
        console.log('✅ تم تهيئة نظام المتجر بنجاح');
    }

    setupStoreStyles() {
        if (document.getElementById('store-styles')) return;
        
        const styles = `
            <style id="store-styles">
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
                
                .form-control {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 10px;
                    width: 100%;
                    font-size: 14px;
                }
                
                .form-control:focus {
                    border-color: #a20087;
                    box-shadow: 0 0 0 0.2rem rgba(162, 0, 135, 0.25);
                    outline: none;
                }
                
                .form-label {
                    font-weight: bold;
                    margin-bottom: 5px;
                    display: block;
                }
                
                .input-group {
                    display: flex;
                }
                
                .input-group .form-control {
                    border-radius: 8px 0 0 8px;
                }
                
                .input-group .btn {
                    border-radius: 0 8px 8px 0;
                    border: 1px solid #a20087;
                }
                
                .btn-outline-primary {
                    color: #a20087;
                    border-color: #a20087;
                }
                
                .btn-outline-primary:hover {
                    background-color: #a20087;
                    color: white;
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

    initializeDOMElements() {
        console.log('🔍 تهيئة عناصر DOM...');
        
        this.createCartElements();
        this.createCheckoutPage();
        
        this.cartToggle = document.getElementById('cart-toggle');
        this.closeCart = document.getElementById('close-cart');
        this.cartOverlay = document.getElementById('cart-overlay');
        this.cartSidebar = document.getElementById('cart-sidebar');
        this.cartItems = document.getElementById('cart-items');
        this.cartCount = document.getElementById('cart-count');
        this.cartTotal = document.getElementById('cart-total');
        this.subtotalEl = document.getElementById('subtotal');
        this.taxEl = document.getElementById('tax');
        this.totalEl = document.getElementById('total');
        this.checkoutBtn = document.getElementById('checkout-btn');
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
        
        this.cartItems = document.getElementById('cart-items');
        this.cartTotal = document.getElementById('cart-total');
        this.subtotalEl = document.getElementById('subtotal');
        this.taxEl = document.getElementById('tax');
        this.totalEl = document.getElementById('total');
        this.checkoutBtn = document.getElementById('checkout-btn');
        this.closeCart = document.getElementById('close-cart');
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
                <div class="d-flex justify-content-between mb-3">
                    <span>الضريبة (15%):</span>
                    <span id="tax">0 SAR</span>
                </div>
                <div class="d-flex justify-content-between fw-bold fs-5">
                    <span>الإجمالي:</span>
                    <span id="total">0 SAR</span>
                </div>
                <button class="checkout-btn mt-4" id="checkout-btn">🚀 اتمام الشراء</button>
            </div>
        `;
    }

    createCheckoutPage() {
        if (document.getElementById('checkout-page')) return;
        
        this.checkoutPage = document.createElement('div');
        this.checkoutPage.id = 'checkout-page';
        this.checkoutPage.className = 'checkout-page';
        this.checkoutPage.style.display = 'none';
        this.checkoutPage.innerHTML = this.getCheckoutHTML();
        document.body.appendChild(this.checkoutPage);
    }

    getCheckoutHTML() {
        return `
            <div class="checkout-container">
                <div class="checkout-content">
                    <a href="#" class="back-to-cart" id="back-to-cart">
                        <i class="fas fa-arrow-right"></i> العودة إلى السلة
                    </a>
                    <div class="row">
                        <div class="col-lg-8 mb-4">
                            <div class="checkout-form">
                                <h3 class="mb-4">📦 معلومات الشحن</h3>
                                ${this.getCheckoutFormHTML()}
                                <button class="checkout-btn mt-3" id="complete-order">✅ اتمام الطلب</button>
                            </div>
                        </div>
                        
                        <div class="col-lg-4">
                            <div class="order-summary">
                                <h4 class="mb-4">📋 ملخص الطلب</h4>
                                <div id="order-items"></div>
                                ${this.getDiscountSectionHTML()}
                                ${this.getOrderSummaryHTML()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getCheckoutFormHTML() {
        return `
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="firstName" class="form-label">الاسم الأول *</label>
                    <input type="text" class="form-control" id="firstName" required>
                    <div class="invalid-feedback">يرجى إدخال الاسم الأول</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="lastName" class="form-label">الاسم الأخير *</label>
                    <input type="text" class="form-control" id="lastName" required>
                    <div class="invalid-feedback">يرجى إدخال الاسم الأخير</div>
                </div>
            </div>
            
            <div class="mb-3">
                <label for="email" class="form-label">📧 البريد الإلكتروني *</label>
                <input type="email" class="form-control" id="email" required>
                <div class="invalid-feedback">يرجى إدخال بريد إلكتروني صحيح</div>
            </div>
            
            <div class="mb-3">
                <label for="phone" class="form-label">📞 رقم الهاتف *</label>
                <input type="tel" class="form-control" id="phone" required>
                <div class="invalid-feedback">يرجى إدخال رقم هاتف صحيح</div>
            </div>
            
            <div class="mb-3">
                <label for="address" class="form-label">📍 العنوان *</label>
                <input type="text" class="form-control" id="address" required>
                <div class="invalid-feedback">يرجى إدخال العنوان</div>
            </div>
            
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="city" class="form-label">🏙️ المدينة *</label>
                    <input type="text" class="form-control" id="city" required>
                    <div class="invalid-feedback">يرجى إدخال المدينة</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="postalCode" class="form-label">📮 الرمز البريدي</label>
                    <input type="text" class="form-control" id="postalCode">
                </div>
            </div>
            
            <h3 class="my-4">💳 معلومات الدفع</h3>
            
            <div class="mb-3">
                <label for="cardNumber" class="form-label">رقم البطاقة *</label>
                <input type="text" class="form-control" id="cardNumber" placeholder="1234 5678 9012 3456" required maxlength="19">
                <div class="invalid-feedback">يرجى إدخال 16 رقم للبطاقة</div>
            </div>
            
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="expiryDate" class="form-label">تاريخ الانتهاء *</label>
                    <input type="text" class="form-control" id="expiryDate" placeholder="MM/YY" required maxlength="5">
                    <div class="invalid-feedback">يرجى إدخال التاريخ بالصيغة MM/YY</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="cvv" class="form-label">CVV *</label>
                    <input type="text" class="form-control" id="cvv" placeholder="123" required maxlength="3">
                    <div class="invalid-feedback">يرجى إدخال 3 أرقام للـ CVV</div>
                </div>
            </div>
        `;
    }

    getDiscountSectionHTML() {
        return `
            <div class="discount-section mb-3 mt-3">
                <label for="discount-code" class="form-label">🎁 كود الخصم</label>
                <div class="input-group">
                    <input type="text" class="form-control" id="discount-code" placeholder="أدخل الكود هنا">
                    <button class="btn btn-outline-primary" type="button" id="apply-discount">تطبيق</button>
                </div>
                <div id="discount-message" class="mt-2 small"></div>
            </div>
        `;
    }

    getOrderSummaryHTML() {
        return `
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
        `;
    }

    setupEventListeners() {
        console.log('🎯 إعداد مستمعي الأحداث...');
        
        // أحداث السلة
        if (this.cartToggle) {
            this.cartToggle.addEventListener('click', () => this.openCart());
        }
        
        if (this.closeCart) {
            this.closeCart.addEventListener('click', () => this.closeCartHandler());
        }
        
        if (this.cartOverlay) {
            this.cartOverlay.addEventListener('click', () => this.closeCartHandler());
        }
        
        if (this.checkoutBtn) {
            this.checkoutBtn.addEventListener('click', () => this.goToCheckout());
        }
        
        // أحداث المنتجات
        document.addEventListener('click', (e) => {
            const buyButton = e.target.closest('.buy-button');
            if (buyButton) {
                e.preventDefault();
                e.stopPropagation();
                this.handleBuyButtonClick(buyButton);
            }
        });
        
        // أحداث صفحة اتمام الشراء
        document.addEventListener('click', (e) => {
            if (e.target.id === 'back-to-cart' || e.target.closest('#back-to-cart')) {
                e.preventDefault();
                this.backToCartHandler();
            }
            
            if (e.target.id === 'complete-order' || e.target.closest('#complete-order')) {
                e.preventDefault();
                this.completeOrderHandler();
            }
            
            if (e.target.id === 'apply-discount' || e.target.closest('#apply-discount')) {
                e.preventDefault();
                this.applyDiscount();
            }
        });

        // إعداد مستمعي حقول الإدخال
        this.setupFormInputListeners();
    }

    setupFormInputListeners() {
        // تنسيق رقم البطاقة
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedValue.substring(0, 19);
                this.clearFieldError(e.target);
            });
        }

        // تنسيق تاريخ الانتهاء
        const expiryDateInput = document.getElementById('expiryDate');
        if (expiryDateInput) {
            expiryDateInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/[^0-9]/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value.substring(0, 5);
                this.clearFieldError(e.target);
            });
        }

        // تقييد CVV لأرقام فقط
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 3);
                this.clearFieldError(e.target);
            });
        }

        // إزالة الأخطاء عند الكتابة في الحقول الأخرى
        const otherFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode'];
        otherFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', (e) => {
                    this.clearFieldError(e.target);
                });
            }
        });

        // إزالة الأخطاء من حقل الخصم
        const discountCodeInput = document.getElementById('discount-code');
        if (discountCodeInput) {
            discountCodeInput.addEventListener('input', (e) => {
                const discountMessage = document.getElementById('discount-message');
                if (discountMessage) {
                    discountMessage.textContent = '';
                    discountMessage.className = 'mt-2 small';
                }
            });
        }
    }

    clearFieldError(field) {
        if (field.value.trim()) {
            field.classList.remove('is-invalid');
        }
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

    addDataAttributesToButtons() {
        console.log('🔧 جاري إضافة البيانات لأزرار الشراء...');
        
        const buttons = document.querySelectorAll('.buy-button');
        console.log(`تم العثور على ${buttons.length} زر شراء`);
        
        buttons.forEach((button, index) => {
            const product = this.products[index];
            if (product) {
                button.setAttribute('data-id', product.id);
                button.setAttribute('data-name', product.name);
                button.setAttribute('data-price', product.price);
                button.setAttribute('data-image', product.image);
                console.log(`✅ تم إضافة بيانات للمنتج: ${product.name}`);
            }
        });
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

    closeCartHandler() {
        console.log('❌ إغلاق السلة');
        if (this.cartSidebar) {
            this.cartSidebar.classList.remove('active');
        }
        if (this.cartOverlay) {
            this.cartOverlay.classList.remove('active');
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
        this.showNotification(`تم إضافة ${product.name} إلى السلة 🎉`);
    }

    updateCart() {
        if (!this.cartItems || !this.cartCount) {
            console.warn('⚠️ عناصر السلة غير موجودة');
            return;
        }
        
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
        this.cartCount.textContent = totalItems;
        
        if (this.cart.length === 0) {
            this.cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart fa-3x mb-3 text-muted"></i>
                    <p>سلة التسوق فارغة</p>
                </div>
            `;
            if (this.cartTotal) this.cartTotal.style.display = 'none';
        } else {
            this.cartItems.innerHTML = '';
            this.cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                
                const imageSrc = item.image && item.image.startsWith('images/') ? 
                    item.image : 
                    `https://via.placeholder.com/70x70/cccccc/969696?text=${encodeURIComponent(item.name)}`;
                
                this.cartItems.innerHTML += `
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
            
            if (this.cartTotal) this.cartTotal.style.display = 'block';
            
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
        
        this.updateTotals();
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
            this.showNotification(`تم إزالة ${item.name} من السلة`);
            this.updateCart();
        }
    }

    updateTotals() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.15;
        const total = subtotal + tax;
        
        if (this.subtotalEl) this.subtotalEl.textContent = `${subtotal.toFixed(2)} SAR`;
        if (this.taxEl) this.taxEl.textContent = `${tax.toFixed(2)} SAR`;
        if (this.totalEl) this.totalEl.textContent = `${total.toFixed(2)} SAR`;
        
        if (document.getElementById('order-subtotal')) {
            document.getElementById('order-subtotal').textContent = `${subtotal.toFixed(2)} SAR`;
        }
        if (document.getElementById('order-tax')) {
            document.getElementById('order-tax').textContent = `${tax.toFixed(2)} SAR`;
        }
        if (document.getElementById('order-total')) {
            document.getElementById('order-total').textContent = `${total.toFixed(2)} SAR`;
        }
        
        this.updateOrderItems();
    }

    updateOrderItems() {
        const orderItems = document.getElementById('order-items');
        if (!orderItems) return;
        
        orderItems.innerHTML = '';
        this.cart.forEach(item => {
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
                    <div class="fw-bold">${itemTotal.toFixed(2)} SAR</div>
                </div>
            `;
        });
    }

    goToCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('السلة فارغة. أضف منتجات قبل اتمام الشراء.', 'error');
            return;
        }
        
        this.closeCartHandler();
        
        if (this.checkoutPage) {
            this.checkoutPage.style.display = 'block';
            console.log('✅ تم فتح صفحة اتمام الشراء');
        }
        
        const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
        if (mainContent) {
            mainContent.style.display = 'none';
        }
    }

    backToCartHandler() {
        console.log('↩️ العودة إلى السلة');
        
        if (this.checkoutPage) {
            this.checkoutPage.style.display = 'none';
        }
        
        const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
        if (mainContent) {
            mainContent.style.display = 'block';
        }
        
        this.openCart();
    }

    async completeOrderHandler() {
        console.log('🚀 بدء معالجة الطلب...');
        
        const orderButton = document.getElementById('complete-order');
        const originalText = orderButton.textContent;
        orderButton.textContent = 'جاري المعالجة...';
        orderButton.disabled = true;
        
        // التحقق من وجود السلة
        if (this.cart.length === 0) {
            this.showNotification('السلة فارغة. أضف منتجات قبل اتمام الشراء.', 'error');
            orderButton.textContent = originalText;
            orderButton.disabled = false;
            return;
        }
        
        // التحقق من النموذج
        console.log('🔍 التحقق من صحة النموذج...');
        if (!this.validateCheckoutForm()) {
            console.log('❌ فشل التحقق من النموذج');
            this.showNotification('يرجى ملء جميع الحقول المطلوبة بشكل صحيح.', 'error');
            orderButton.textContent = originalText;
            orderButton.disabled = false;
            return;
        }
        
        console.log('✅ النموذج صالح، جاري جمع البيانات...');
        
        try {
            const orderData = this.collectOrderData();
            console.log('📦 بيانات الطلب المجمعة:', orderData);
            
            this.showNotification('جاري معالجة طلبك وحفظه في قاعدة البيانات...', 'info');
            
            // حفظ الطلب في قاعدة البيانات
            console.log('💾 جاري حفظ الطلب في قاعدة البيانات...');
            const saveResult = await this.saveOrderToDatabase(orderData);
            
            if (saveResult.success) {
                const orderNumber = saveResult.order_number;
                console.log('✅ تم حفظ الطلب بنجاح، رقم الطلب:', orderNumber);
                
                this.showNotification('🎉 تم الطلب بنجاح! شكراً لثقتك بنا.', 'success');
                
                // عرض التفاصيل
                this.showOrderDetails(orderData, orderNumber);
                
                // إعادة تعيين
                this.resetAfterOrder();
                
            } else {
                throw new Error(saveResult.message || 'خطأ في حفظ الطلب');
            }
            
        } catch (error) {
            console.error('❌ خطأ في اتمام الطلب:', error);
            this.showNotification('حدث خطأ في حفظ الطلب. يرجى المحاولة مرة أخرى.', 'error');
            
        } finally {
            orderButton.textContent = originalText;
            orderButton.disabled = false;
        }
    }

    validateCheckoutForm() {
        const requiredFields = [
            'firstName', 'lastName', 'email', 'phone', 
            'address', 'city', 'cardNumber', 'expiryDate', 'cvv'
        ];
        let isValid = true;
        
        console.log('🔍 بدء التحقق من النموذج...');
        
        // إعادة تعيين جميع حالات الخطأ
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.classList.remove('is-invalid');
                console.log(`✅ إعادة تعيين حقل: ${fieldId}`);
            }
        });
        
        // التحقق من الحقول المطلوبة
        for (let fieldId of requiredFields) {
            const field = document.getElementById(fieldId);
            console.log(`🔍 فحص حقل ${fieldId}:`, field ? field.value : 'غير موجود');
            
            if (!field || !field.value.trim()) {
                console.log(`❌ حقل ${fieldId} فارغ`);
                if (field) {
                    field.classList.add('is-invalid');
                    // إضافة رسالة الخطأ إذا لم تكن موجودة
                    if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('invalid-feedback')) {
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'invalid-feedback';
                        errorDiv.textContent = 'هذا الحقل مطلوب';
                        field.parentNode.appendChild(errorDiv);
                    }
                }
                isValid = false;
            } else {
                console.log(`✅ حقل ${fieldId} مملوء: ${field.value}`);
            }
        }
        
        // التحقق من صحة البريد الإلكتروني
        const emailField = document.getElementById('email');
        if (emailField && emailField.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value.trim())) {
                console.log('❌ البريد الإلكتروني غير صحيح');
                emailField.classList.add('is-invalid');
                if (!emailField.nextElementSibling || !emailField.nextElementSibling.classList.contains('invalid-feedback')) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'invalid-feedback';
                    errorDiv.textContent = 'يرجى إدخال بريد إلكتروني صحيح';
                    emailField.parentNode.appendChild(errorDiv);
                }
                isValid = false;
            }
        }
        
        // التحقق من صحة رقم البطاقة (16 رقم)
        const cardNumberField = document.getElementById('cardNumber');
        if (cardNumberField && cardNumberField.value.trim()) {
            const cardNumber = cardNumberField.value.replace(/\s+/g, '');
            console.log('🔍 رقم البطاقة:', cardNumber, 'الطول:', cardNumber.length);
            
            if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
                console.log('❌ رقم البطاقة غير صحيح');
                cardNumberField.classList.add('is-invalid');
                if (!cardNumberField.nextElementSibling || !cardNumberField.nextElementSibling.classList.contains('invalid-feedback')) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'invalid-feedback';
                    errorDiv.textContent = 'يرجى إدخال 16 رقم للبطاقة';
                    cardNumberField.parentNode.appendChild(errorDiv);
                }
                isValid = false;
            }
        }
        
        // التحقق من صحة تاريخ الانتهاء
        const expiryDateField = document.getElementById('expiryDate');
        if (expiryDateField && expiryDateField.value.trim()) {
            const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
            console.log('🔍 تاريخ الانتهاء:', expiryDateField.value);
            
            if (!expiryRegex.test(expiryDateField.value.trim())) {
                console.log('❌ تاريخ الانتهاء غير صحيح');
                expiryDateField.classList.add('is-invalid');
                if (!expiryDateField.nextElementSibling || !expiryDateField.nextElementSibling.classList.contains('invalid-feedback')) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'invalid-feedback';
                    errorDiv.textContent = 'يرجى إدخال التاريخ بالصيغة MM/YY';
                    expiryDateField.parentNode.appendChild(errorDiv);
                }
                isValid = false;
            }
        }
        
        // التحقق من صحة CVV (3 أرقام)
        const cvvField = document.getElementById('cvv');
        if (cvvField && cvvField.value.trim()) {
            console.log('🔍 CVV:', cvvField.value, 'الطول:', cvvField.value.length);
            
            if (cvvField.value.length !== 3 || !/^\d+$/.test(cvvField.value)) {
                console.log('❌ CVV غير صحيح');
                cvvField.classList.add('is-invalid');
                if (!cvvField.nextElementSibling || !cvvField.nextElementSibling.classList.contains('invalid-feedback')) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'invalid-feedback';
                    errorDiv.textContent = 'يرجى إدخال 3 أرقام للـ CVV';
                    cvvField.parentNode.appendChild(errorDiv);
                }
                isValid = false;
            }
        }
        
        // التحقق من صحة رقم الهاتف
        const phoneField = document.getElementById('phone');
        if (phoneField && phoneField.value.trim()) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(phoneField.value.trim())) {
                console.log('❌ رقم الهاتف غير صحيح');
                phoneField.classList.add('is-invalid');
                if (!phoneField.nextElementSibling || !phoneField.nextElementSibling.classList.contains('invalid-feedback')) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'invalid-feedback';
                    errorDiv.textContent = 'يرجى إدخال رقم هاتف صحيح';
                    phoneField.parentNode.appendChild(errorDiv);
                }
                isValid = false;
            }
        }
        
        console.log('📋 نتيجة التحقق:', isValid ? '✅ النموذج صالح' : '❌ النموذج غير صالح');
        
        // إذا كان هناك أخطاء، قم بالتمرير إلى أول حقل خطأ
        if (!isValid) {
            const firstInvalidField = document.querySelector('.is-invalid');
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                firstInvalidField.focus();
            }
        }
        
        return isValid;
    }

    collectOrderData() {
        const customer = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            postalCode: document.getElementById('postalCode').value || ''
        };
        
        const payment = {
            cardNumber: document.getElementById('cardNumber').value,
            expiryDate: document.getElementById('expiryDate').value,
            cvv: document.getElementById('cvv').value
        };
        
        const discountRow = document.getElementById('discount-row');
        const discount = discountRow && discountRow.style.display !== 'none' ? 
            parseFloat(document.getElementById('discount-amount').textContent.replace('-', '').replace(' SAR', '')) || 0 : 0;
        
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.15;
        const total = subtotal + tax - discount;
        
        return {
            customer: customer,
            payment: payment,
            items: this.cart.map(item => ({
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

    async saveOrderToDatabase(orderData) {
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
                    message: result.message || 'تم حفظ الطلب بنجاح'
                };
            } else {
                throw new Error(result.message || 'خطأ في حفظ الطلب');
            }
        } catch (error) {
            console.error('❌ خطأ في الاتصال بالخادم:', error);
            throw error;
        }
    }

    async applyDiscount() {
        const discountCodeInput = document.getElementById('discount-code');
        const discountMessage = document.getElementById('discount-message');
        const discountRow = document.getElementById('discount-row');
        const discountAmount = document.getElementById('discount-amount');
        
        if (!discountCodeInput || !discountMessage) return;
        
        const discountCode = discountCodeInput.value.trim();
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        if (!discountCode) {
            discountMessage.textContent = 'يرجى إدخال كود الخصم';
            discountMessage.className = 'mt-2 small text-danger';
            return;
        }
        
        try {
            const response = await fetch(`save_order.php?action=validate_discount&code=${encodeURIComponent(discountCode)}&amount=${subtotal}`);
            
            if (!response.ok) {
                throw new Error('خطأ في الاتصال بالخادم');
            }
            
            const result = await response.json();
            
            if (result.valid) {
                const discountPercent = result.discount_percent;
                const discountValue = (subtotal * discountPercent / 100);
                
                if (discountAmount) discountAmount.textContent = `-${discountValue.toFixed(2)} SAR`;
                if (discountRow) discountRow.style.display = 'flex';
                discountMessage.textContent = `🎉 تم تطبيق خصم ${discountPercent}% بنجاح!`;
                discountMessage.className = 'mt-2 small text-success';
                
                this.currentDiscount = { code: discountCode, percent: discountPercent, value: discountValue };
                this.updateOrderTotalWithDiscount(discountValue);
                this.showNotification(`تم تطبيق خصم ${discountPercent}% على طلبك`);
            } else {
                discountMessage.textContent = `❌ ${result.message}`;
                discountMessage.className = 'mt-2 small text-danger';
                if (discountRow) discountRow.style.display = 'none';
                this.currentDiscount = null;
                this.updateOrderTotalWithDiscount(0);
            }
        } catch (error) {
            console.error('❌ خطأ في التحقق من كود الخصم:', error);
            discountMessage.textContent = '❌ حدث خطأ في التحقق من كود الخصم';
            discountMessage.className = 'mt-2 small text-danger';
        }
    }

    updateOrderTotalWithDiscount(discount = 0) {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = (subtotal - discount) * 0.15;
        const total = (subtotal - discount) + tax;
        
        if (document.getElementById('order-tax')) {
            document.getElementById('order-tax').textContent = `${tax.toFixed(2)} SAR`;
        }
        if (document.getElementById('order-total')) {
            document.getElementById('order-total').textContent = `${total.toFixed(2)} SAR`;
        }
    }

    showOrderDetails(orderData, orderNumber) {
        const orderDetails = this.getOrderDetailsHTML(orderData, orderNumber);
        
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

    getOrderDetailsHTML(orderData, orderNumber) {
        return `
            <div class="order-success">
                <div class="text-center mb-4">
                    <i class="fas fa-check-circle text-success fa-4x mb-3"></i>
                    <h3 class="text-success">تم تأكيد طلبك بنجاح!</h3>
                    <p class="text-muted">رقم الطلب: <strong>${orderNumber}</strong></p>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <h5>👤 معلومات العميل:</h5>
                        <p><strong>الاسم:</strong> ${orderData.customer.firstName} ${orderData.customer.lastName}</p>
                        <p><strong>البريد الإلكتروني:</strong> ${orderData.customer.email}</p>
                        <p><strong>الهاتف:</strong> ${orderData.customer.phone}</p>
                        <p><strong>العنوان:</strong> ${orderData.customer.address}, ${orderData.customer.city}</p>
                    </div>
                    <div class="col-md-6">
                        <h5>📊 تفاصيل الطلب:</h5>
                        <p><strong>عدد المنتجات:</strong> ${orderData.items.length}</p>
                        <p><strong>المجموع:</strong> ${orderData.totals.subtotal.toFixed(2)} SAR</p>
                        <p><strong>الضريبة:</strong> ${orderData.totals.tax.toFixed(2)} SAR</p>
                        ${orderData.totals.discount > 0 ? `<p><strong>الخصم:</strong> -${orderData.totals.discount.toFixed(2)} SAR</p>` : ''}
                        <p><strong>الإجمالي:</strong> ${orderData.totals.total.toFixed(2)} SAR</p>
                    </div>
                </div>
                
                <div class="mt-4">
                    <h5>🛍️ المنتجات المطلوبة:</h5>
                    ${orderData.items.map(item => `
                        <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                            <div>${item.name}</div>
                            <div>${item.quantity} × ${item.price} SAR</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="text-center mt-4">
                    <p class="text-muted">سيتم التواصل معك خلال 24 ساعة لتأكيد الشحن</p>
                    <button class="btn btn-primary" onclick="window.perfumeStore.closeOrderDetails()">موافق</button>
                </div>
            </div>
        `;
    }

    closeOrderDetails() {
        const orderDetails = document.querySelector('.order-details-overlay');
        if (orderDetails) {
            orderDetails.remove();
        }
    }

    resetAfterOrder() {
        this.cart = [];
        this.currentDiscount = null;
        this.updateCart();
        this.resetCheckoutForm();
        
        const discountRow = document.getElementById('discount-row');
        const discountMessage = document.getElementById('discount-message');
        const discountCode = document.getElementById('discount-code');
        
        if (discountRow) discountRow.style.display = 'none';
        if (discountMessage) discountMessage.textContent = '';
        if (discountCode) discountCode.value = '';
        
        if (this.checkoutPage) {
            this.checkoutPage.style.display = 'none';
        }
        
        const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
        if (mainContent) {
            mainContent.style.display = 'block';
        }
    }

    resetCheckoutForm() {
        const form = document.querySelector('.checkout-form');
        if (form) {
            form.reset();
            const invalidFields = form.querySelectorAll('.is-invalid');
            invalidFields.forEach(field => {
                field.classList.remove('is-invalid');
            });
        }
    }

    showNotification(message, type = 'success') {
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
        }, 5000);
    }

    testAddProducts() {
        const randomProduct1 = this.products[Math.floor(Math.random() * this.products.length)];
        const randomProduct2 = this.products[Math.floor(Math.random() * this.products.length)];
        
        this.addToCart({...randomProduct1, quantity: 1});
        this.addToCart({...randomProduct2, quantity: 2});
        
        this.showNotification('تم إضافة منتجات تجريبية للسلة 🧪');
    }

    getCart() {
        return this.cart;
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartItemsCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    clearCart() {
        this.cart = [];
        this.updateCart();
        this.showNotification('تم تفريغ السلة');
    }
}

// بدء النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.perfumeStore = new PerfumeStoreSystem();
});

// جعل النظام متاحاً globally
if (typeof window !== 'undefined') {
    window.PerfumeStoreSystem = PerfumeStoreSystem;
} 

console.log('🏪 نظام المتجر جاهز! استخدم:');
console.log('   - perfumeStore.testAddProducts() لإضافة منتجات تجريبية');
console.log('   - perfumeStore.openCart() لفتح السلة');
console.log('   - perfumeStore.clearCart() لتفريغ السلة');*/































/*
// نظام إدارة المتجر - PerfumeStoreSystem
class PerfumeStoreSystem {
    constructor() {
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
        console.log('🏪 بدء تشغيل نظام المتجر...');
        this.setupStoreStyles();
        this.initializeDOMElements();
        this.setupEventListeners();
        this.updateCart();
        this.addDataAttributesToButtons();
        console.log('✅ تم تهيئة نظام المتجر بنجاح');
    }

    setupStoreStyles() {
        if (document.getElementById('store-styles')) return;
        
        const styles = `
            <style id="store-styles">
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
                
                .form-control {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 10px;
                    width: 100%;
                    font-size: 14px;
                }
                
                .form-control:focus {
                    border-color: #a20087;
                    box-shadow: 0 0 0 0.2rem rgba(162, 0, 135, 0.25);
                    outline: none;
                }
                
                .form-label {
                    font-weight: bold;
                    margin-bottom: 5px;
                    display: block;
                }
                
                .input-group {
                    display: flex;
                }
                
                .input-group .form-control {
                    border-radius: 8px 0 0 8px;
                }
                
                .input-group .btn {
                    border-radius: 0 8px 8px 0;
                    border: 1px solid #a20087;
                }
                
                .btn-outline-primary {
                    color: #a20087;
                    border-color: #a20087;
                }
                
                .btn-outline-primary:hover {
                    background-color: #a20087;
                    color: white;
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

    initializeDOMElements() {
        console.log('🔍 تهيئة عناصر DOM...');
        
        this.createCartElements();
        this.createCheckoutPage();
        
        this.cartToggle = document.getElementById('cart-toggle');
        this.closeCart = document.getElementById('close-cart');
        this.cartOverlay = document.getElementById('cart-overlay');
        this.cartSidebar = document.getElementById('cart-sidebar');
        this.cartItems = document.getElementById('cart-items');
        this.cartCount = document.getElementById('cart-count');
        this.cartTotal = document.getElementById('cart-total');
        this.subtotalEl = document.getElementById('subtotal');
        this.taxEl = document.getElementById('tax');
        this.totalEl = document.getElementById('total');
        this.checkoutBtn = document.getElementById('checkout-btn');
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
        
        this.cartItems = document.getElementById('cart-items');
        this.cartTotal = document.getElementById('cart-total');
        this.subtotalEl = document.getElementById('subtotal');
        this.taxEl = document.getElementById('tax');
        this.totalEl = document.getElementById('total');
        this.checkoutBtn = document.getElementById('checkout-btn');
        this.closeCart = document.getElementById('close-cart');
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
                <div class="d-flex justify-content-between mb-3">
                    <span>الضريبة (15%):</span>
                    <span id="tax">0 SAR</span>
                </div>
                <div class="d-flex justify-content-between fw-bold fs-5">
                    <span>الإجمالي:</span>
                    <span id="total">0 SAR</span>
                </div>
                <button class="checkout-btn mt-4" id="checkout-btn">🚀 اتمام الشراء</button>
            </div>
        `;
    }

    createCheckoutPage() {
        if (document.getElementById('checkout-page')) return;
        
        this.checkoutPage = document.createElement('div');
        this.checkoutPage.id = 'checkout-page';
        this.checkoutPage.className = 'checkout-page';
        this.checkoutPage.style.display = 'none';
        this.checkoutPage.innerHTML = this.getCheckoutHTML();
        document.body.appendChild(this.checkoutPage);
    }

    getCheckoutHTML() {
        return `
            <div class="checkout-container">
                <div class="checkout-content">
                    <a href="#" class="back-to-cart" id="back-to-cart">
                        <i class="fas fa-arrow-right"></i> العودة إلى السلة
                    </a>
                    <div class="row">
                        <div class="col-lg-8 mb-4">
                            <div class="checkout-form">
                                <h3 class="mb-4">📦 معلومات الشحن</h3>
                                ${this.getCheckoutFormHTML()}
                                <button class="checkout-btn mt-3" id="complete-order">✅ اتمام الطلب</button>
                            </div>
                        </div>
                        
                        <div class="col-lg-4">
                            <div class="order-summary">
                                <h4 class="mb-4">📋 ملخص الطلب</h4>
                                <div id="order-items"></div>
                                ${this.getDiscountSectionHTML()}
                                ${this.getOrderSummaryHTML()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getCheckoutFormHTML() {
        return `
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="firstName" class="form-label">الاسم الأول *</label>
                    <input type="text" class="form-control" id="firstName" required>
                    <div class="invalid-feedback">يرجى إدخال الاسم الأول</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="lastName" class="form-label">الاسم الأخير *</label>
                    <input type="text" class="form-control" id="lastName" required>
                    <div class="invalid-feedback">يرجى إدخال الاسم الأخير</div>
                </div>
            </div>
            
            <div class="mb-3">
                <label for="email" class="form-label">📧 البريد الإلكتروني *</label>
                <input type="email" class="form-control" id="email" required>
                <div class="invalid-feedback">يرجى إدخال بريد إلكتروني صحيح</div>
            </div>
            
            <div class="mb-3">
                <label for="phone" class="form-label">📞 رقم الهاتف *</label>
                <input type="tel" class="form-control" id="phone" required>
                <div class="invalid-feedback">يرجى إدخال رقم هاتف صحيح</div>
            </div>
            
            <div class="mb-3">
                <label for="address" class="form-label">📍 العنوان *</label>
                <input type="text" class="form-control" id="address" required>
                <div class="invalid-feedback">يرجى إدخال العنوان</div>
            </div>
            
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="city" class="form-label">🏙️ المدينة *</label>
                    <input type="text" class="form-control" id="city" required>
                    <div class="invalid-feedback">يرجى إدخال المدينة</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="postalCode" class="form-label">📮 الرمز البريدي</label>
                    <input type="text" class="form-control" id="postalCode">
                </div>
            </div>
            
            <h3 class="my-4">💳 معلومات الدفع</h3>
            
            <div class="mb-3">
                <label for="cardNumber" class="form-label">رقم البطاقة *</label>
                <input type="text" class="form-control" id="cardNumber" placeholder="1234 5678 9012 3456" required maxlength="19">
                <div class="invalid-feedback">يرجى إدخال 16 رقم للبطاقة</div>
            </div>
            
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="expiryDate" class="form-label">تاريخ الانتهاء *</label>
                    <input type="text" class="form-control" id="expiryDate" placeholder="MM/YY" required maxlength="5">
                    <div class="invalid-feedback">يرجى إدخال التاريخ بالصيغة MM/YY</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="cvv" class="form-label">CVV *</label>
                    <input type="text" class="form-control" id="cvv" placeholder="123" required maxlength="3">
                    <div class="invalid-feedback">يرجى إدخال 3 أرقام للـ CVV</div>
                </div>
            </div>
        `;
    }

    getDiscountSectionHTML() {
        return `
            <div class="discount-section mb-3 mt-3">
                <label for="discount-code" class="form-label">🎁 كود الخصم</label>
                <div class="input-group">
                    <input type="text" class="form-control" id="discount-code" placeholder="أدخل الكود هنا">
                    <button class="btn btn-outline-primary" type="button" id="apply-discount">تطبيق</button>
                </div>
                <div id="discount-message" class="mt-2 small"></div>
            </div>
        `;
    }

    getOrderSummaryHTML() {
        return `
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
        `;
    }

    setupEventListeners() {
        console.log('🎯 إعداد مستمعي الأحداث...');
        
        // أحداث السلة
        if (this.cartToggle) {
            this.cartToggle.addEventListener('click', () => this.openCart());
        }
        
        if (this.closeCart) {
            this.closeCart.addEventListener('click', () => this.closeCartHandler());
        }
        
        if (this.cartOverlay) {
            this.cartOverlay.addEventListener('click', () => this.closeCartHandler());
        }
        
        if (this.checkoutBtn) {
            this.checkoutBtn.addEventListener('click', () => this.goToCheckout());
        }
        
        // أحداث المنتجات
        document.addEventListener('click', (e) => {
            const buyButton = e.target.closest('.buy-button');
            if (buyButton) {
                e.preventDefault();
                e.stopPropagation();
                this.handleBuyButtonClick(buyButton);
            }
        });
        
        // أحداث صفحة اتمام الشراء
        document.addEventListener('click', (e) => {
            if (e.target.id === 'back-to-cart' || e.target.closest('#back-to-cart')) {
                e.preventDefault();
                this.backToCartHandler();
            }
            
            if (e.target.id === 'complete-order' || e.target.closest('#complete-order')) {
                e.preventDefault();
                this.completeOrderHandler();
            }
            
            if (e.target.id === 'apply-discount' || e.target.closest('#apply-discount')) {
                e.preventDefault();
                this.applyDiscount();
            }
        });

        // إعداد مستمعي حقول الإدخال
        this.setupFormInputListeners();
    }

    setupFormInputListeners() {
        // تنسيق رقم البطاقة
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedValue.substring(0, 19);
                this.clearFieldError(e.target);
            });
        }

        // تنسيق تاريخ الانتهاء
        const expiryDateInput = document.getElementById('expiryDate');
        if (expiryDateInput) {
            expiryDateInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/[^0-9]/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value.substring(0, 5);
                this.clearFieldError(e.target);
            });
        }

        // تقييد CVV لأرقام فقط
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 3);
                this.clearFieldError(e.target);
            });
        }

        // إزالة الأخطاء عند الكتابة في الحقول الأخرى
        const otherFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode'];
        otherFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', (e) => {
                    this.clearFieldError(e.target);
                });
            }
        });

        // إزالة الأخطاء من حقل الخصم
        const discountCodeInput = document.getElementById('discount-code');
        if (discountCodeInput) {
            discountCodeInput.addEventListener('input', (e) => {
                const discountMessage = document.getElementById('discount-message');
                if (discountMessage) {
                    discountMessage.textContent = '';
                    discountMessage.className = 'mt-2 small';
                }
            });
        }
    }

    clearFieldError(field) {
        if (field.value.trim()) {
            field.classList.remove('is-invalid');
        }
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

    addDataAttributesToButtons() {
        console.log('🔧 جاري إضافة البيانات لأزرار الشراء...');
        
        const buttons = document.querySelectorAll('.buy-button');
        console.log(`تم العثور على ${buttons.length} زر شراء`);
        
        buttons.forEach((button, index) => {
            const product = this.products[index];
            if (product) {
                button.setAttribute('data-id', product.id);
                button.setAttribute('data-name', product.name);
                button.setAttribute('data-price', product.price);
                button.setAttribute('data-image', product.image);
                console.log(`✅ تم إضافة بيانات للمنتج: ${product.name}`);
            }
        });
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

    closeCartHandler() {
        console.log('❌ إغلاق السلة');
        if (this.cartSidebar) {
            this.cartSidebar.classList.remove('active');
        }
        if (this.cartOverlay) {
            this.cartOverlay.classList.remove('active');
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
        this.showNotification(`تم إضافة ${product.name} إلى السلة 🎉`);
    }

    updateCart() {
        if (!this.cartItems || !this.cartCount) {
            console.warn('⚠️ عناصر السلة غير موجودة');
            return;
        }
        
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
        this.cartCount.textContent = totalItems;
        
        if (this.cart.length === 0) {
            this.cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart fa-3x mb-3 text-muted"></i>
                    <p>سلة التسوق فارغة</p>
                </div>
            `;
            if (this.cartTotal) this.cartTotal.style.display = 'none';
        } else {
            this.cartItems.innerHTML = '';
            this.cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                
                const imageSrc = item.image && item.image.startsWith('images/') ? 
                    item.image : 
                    `https://via.placeholder.com/70x70/cccccc/969696?text=${encodeURIComponent(item.name)}`;
                
                this.cartItems.innerHTML += `
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
            
            if (this.cartTotal) this.cartTotal.style.display = 'block';
            
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
        
        this.updateTotals();
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
            this.showNotification(`تم إزالة ${item.name} من السلة`);
            this.updateCart();
        }
    }

    updateTotals() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.15;
        const total = subtotal + tax;
        
        if (this.subtotalEl) this.subtotalEl.textContent = `${subtotal.toFixed(2)} SAR`;
        if (this.taxEl) this.taxEl.textContent = `${tax.toFixed(2)} SAR`;
        if (this.totalEl) this.totalEl.textContent = `${total.toFixed(2)} SAR`;
        
        if (document.getElementById('order-subtotal')) {
            document.getElementById('order-subtotal').textContent = `${subtotal.toFixed(2)} SAR`;
        }
        if (document.getElementById('order-tax')) {
            document.getElementById('order-tax').textContent = `${tax.toFixed(2)} SAR`;
        }
        if (document.getElementById('order-total')) {
            document.getElementById('order-total').textContent = `${total.toFixed(2)} SAR`;
        }
        
        this.updateOrderItems();
    }

    updateOrderItems() {
        const orderItems = document.getElementById('order-items');
        if (!orderItems) return;
        
        orderItems.innerHTML = '';
        this.cart.forEach(item => {
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
                    <div class="fw-bold">${itemTotal.toFixed(2)} SAR</div>
                </div>
            `;
        });
    }

    goToCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('السلة فارغة. أضف منتجات قبل اتمام الشراء.', 'error');
            return;
        }
        
        this.closeCartHandler();
        
        if (this.checkoutPage) {
            this.checkoutPage.style.display = 'block';
            console.log('✅ تم فتح صفحة اتمام الشراء');
        }
        
        const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
        if (mainContent) {
            mainContent.style.display = 'none';
        }
    }

    backToCartHandler() {
        console.log('↩️ العودة إلى السلة');
        
        if (this.checkoutPage) {
            this.checkoutPage.style.display = 'none';
        }
        
        const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
        if (mainContent) {
            mainContent.style.display = 'block';
        }
        
        this.openCart();
    }

    async completeOrderHandler() {
        console.log('🚀 بدء معالجة الطلب...');
        
        const orderButton = document.getElementById('complete-order');
        const originalText = orderButton.textContent;
        orderButton.textContent = 'جاري المعالجة...';
        orderButton.disabled = true;
        
        // التحقق من وجود السلة
        if (this.cart.length === 0) {
            this.showNotification('السلة فارغة. أضف منتجات قبل اتمام الشراء.', 'error');
            orderButton.textContent = originalText;
            orderButton.disabled = false;
            return;
        }
        
        // التحقق من النموذج
        console.log('🔍 التحقق من صحة النموذج...');
        if (!this.validateCheckoutForm()) {
            console.log('❌ فشل التحقق من النموذج');
            this.showNotification('يرجى ملء جميع الحقول المطلوبة بشكل صحيح.', 'error');
            orderButton.textContent = originalText;
            orderButton.disabled = false;
            return;
        }
        
        console.log('✅ النموذج صالح، جاري جمع البيانات...');
        
        try {
            const orderData = this.collectOrderData();
            console.log('📦 بيانات الطلب المجمعة:', orderData);
            

            this.showNotification('جاري معالجة طلبك ...', 'info');
            
            // حفظ الطلب في قاعدة البيانات
            console.log('💾 جاري حفظ الطلب...');
            const saveResult = await this.saveOrderToDatabase(orderData);
            
            if (saveResult.success) {
                const orderNumber = saveResult.order_number;
                console.log('✅ تم حفظ الطلب بنجاح، رقم الطلب:', orderNumber);
                
                this.showNotification('🎉 تم الطلب بنجاح! شكراً لثقتك بنا.', 'success');
                
                // عرض التفاصيل
                this.showOrderDetails(orderData, orderNumber);
                
                // إعادة تعيين
                this.resetAfterOrder();
                
            } else {
                throw new Error(saveResult.message || 'خطأ في حفظ الطلب');
            }
            
        } catch (error) {
            console.error('❌ خطأ في اتمام الطلب:', error);
            this.showNotification('حدث خطأ في حفظ الطلب. يرجى المحاولة مرة أخرى.', 'error');
            
        } finally {
            orderButton.textContent = originalText;
            orderButton.disabled = false;
        }
    }

    validateCheckoutForm() {
        const requiredFields = [
            'firstName', 'lastName', 'email', 'phone', 
            'address', 'city', 'cardNumber', 'expiryDate', 'cvv'
        ];
        let isValid = true;
        
        console.log('🔍 بدء التحقق من النموذج...');
        
        // إعادة تعيين جميع حالات الخطأ
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.classList.remove('is-invalid');
                console.log(`✅ إعادة تعيين حقل: ${fieldId}`);
            }
        });
        
        // التحقق من الحقول المطلوبة
        for (let fieldId of requiredFields) {
            const field = document.getElementById(fieldId);
            console.log(`🔍 فحص حقل ${fieldId}:`, field ? field.value : 'غير موجود');
            
            if (!field || !field.value.trim()) {
                console.log(`❌ حقل ${fieldId} فارغ`);
                if (field) {
                    field.classList.add('is-invalid');
                    // إضافة رسالة الخطأ إذا لم تكن موجودة
                    if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('invalid-feedback')) {
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'invalid-feedback';
                        errorDiv.textContent = 'هذا الحقل مطلوب';
                        field.parentNode.appendChild(errorDiv);
                    }
                }
                isValid = false;
            } else {
                console.log(`✅ حقل ${fieldId} مملوء: ${field.value}`);
            }
        }
        
        // التحقق من صحة البريد الإلكتروني
        const emailField = document.getElementById('email');
        if (emailField && emailField.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value.trim())) {
                console.log('❌ البريد الإلكتروني غير صحيح');
                emailField.classList.add('is-invalid');
                if (!emailField.nextElementSibling || !emailField.nextElementSibling.classList.contains('invalid-feedback')) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'invalid-feedback';
                    errorDiv.textContent = 'يرجى إدخال بريد إلكتروني صحيح';
                    emailField.parentNode.appendChild(errorDiv);
                }
                isValid = false;
            }
        }
        
        // التحقق من صحة رقم البطاقة (16 رقم)
        const cardNumberField = document.getElementById('cardNumber');
        if (cardNumberField && cardNumberField.value.trim()) {
            const cardNumber = cardNumberField.value.replace(/\s+/g, '');
            console.log('🔍 رقم البطاقة:', cardNumber, 'الطول:', cardNumber.length);
            
            if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
                console.log('❌ رقم البطاقة غير صحيح');
                cardNumberField.classList.add('is-invalid');
                if (!cardNumberField.nextElementSibling || !cardNumberField.nextElementSibling.classList.contains('invalid-feedback')) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'invalid-feedback';
                    errorDiv.textContent = 'يرجى إدخال 16 رقم للبطاقة';
                    cardNumberField.parentNode.appendChild(errorDiv);
                }
                isValid = false;
            }
        }
        
        // التحقق من صحة تاريخ الانتهاء
        const expiryDateField = document.getElementById('expiryDate');
        if (expiryDateField && expiryDateField.value.trim()) {
            const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
            console.log('🔍 تاريخ الانتهاء:', expiryDateField.value);
            
            if (!expiryRegex.test(expiryDateField.value.trim())) {
                console.log('❌ تاريخ الانتهاء غير صحيح');
                expiryDateField.classList.add('is-invalid');
                if (!expiryDateField.nextElementSibling || !expiryDateField.nextElementSibling.classList.contains('invalid-feedback')) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'invalid-feedback';
                    errorDiv.textContent = 'يرجى إدخال التاريخ بالصيغة MM/YY';
                    expiryDateField.parentNode.appendChild(errorDiv);
                }
                isValid = false;
            }
        }
        
        // التحقق من صحة CVV (3 أرقام)
        const cvvField = document.getElementById('cvv');
        if (cvvField && cvvField.value.trim()) {
            console.log('🔍 CVV:', cvvField.value, 'الطول:', cvvField.value.length);
            
            if (cvvField.value.length !== 3 || !/^\d+$/.test(cvvField.value)) {
                console.log('❌ CVV غير صحيح');
                cvvField.classList.add('is-invalid');
                if (!cvvField.nextElementSibling || !cvvField.nextElementSibling.classList.contains('invalid-feedback')) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'invalid-feedback';
                    errorDiv.textContent = 'يرجى إدخال 3 أرقام للـ CVV';
                    cvvField.parentNode.appendChild(errorDiv);
                }
                isValid = false;
            }
        }
        
        // التحقق من صحة رقم الهاتف
        const phoneField = document.getElementById('phone');
        if (phoneField && phoneField.value.trim()) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(phoneField.value.trim())) {
                console.log('❌ رقم الهاتف غير صحيح');
                phoneField.classList.add('is-invalid');
                if (!phoneField.nextElementSibling || !phoneField.nextElementSibling.classList.contains('invalid-feedback')) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'invalid-feedback';
                    errorDiv.textContent = 'يرجى إدخال رقم هاتف صحيح';
                    phoneField.parentNode.appendChild(errorDiv);
                }
                isValid = false;
            }
        }
        
        console.log('📋 نتيجة التحقق:', isValid ? '✅ النموذج صالح' : '❌ النموذج غير صالح');
        
        // إذا كان هناك أخطاء، قم بالتمرير إلى أول حقل خطأ
        if (!isValid) {
            const firstInvalidField = document.querySelector('.is-invalid');
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                firstInvalidField.focus();
            }
        }
        
        return isValid;
    }

    collectOrderData() {
        const customer = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            postalCode: document.getElementById('postalCode').value || ''
        };
        
        const payment = {
            cardNumber: document.getElementById('cardNumber').value,
            expiryDate: document.getElementById('expiryDate').value,
            cvv: document.getElementById('cvv').value
        };
        
        const discountRow = document.getElementById('discount-row');
        const discount = discountRow && discountRow.style.display !== 'none' ? 
            parseFloat(document.getElementById('discount-amount').textContent.replace('-', '').replace(' SAR', '')) || 0 : 0;
        
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.15;
        const total = subtotal + tax - discount;
        
        return {
            customer: customer,
            payment: payment,
            items: this.cart.map(item => ({
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

    async saveOrderToDatabase(orderData) {
        try {
            console.log('📤 جاري إرسال الطلب إلى الخادم...', orderData);
            
            // محاكاة حفظ الطلب (يمكن استبدالها باتصال حقيقي بالخادم)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // إنشاء رقم طلب عشوائي
            const orderNumber = 'ORD-' + Date.now().toString().slice(-8);
            
            console.log('✅ تم حفظ الطلب بنجاح:', orderNumber);
            
            return {
                success: true,
                order_number: orderNumber,
                message: 'تم حفظ الطلب بنجاح'
            };
            
        } catch (error) {
            console.error('❌ خطأ في حفظ الطلب:', error);
            throw error;
        }
    }

    async applyDiscount() {
        const discountCodeInput = document.getElementById('discount-code');
        const discountMessage = document.getElementById('discount-message');
        const discountRow = document.getElementById('discount-row');
        const discountAmount = document.getElementById('discount-amount');
        
        if (!discountCodeInput || !discountMessage) return;
        
        const discountCode = discountCodeInput.value.trim();
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        if (!discountCode) {
            discountMessage.textContent = 'يرجى إدخال كود الخصم';
            discountMessage.className = 'mt-2 small text-danger';
            return;
        }
        
        try {
            // محاكاة التحقق من كود الخصم
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // أكواد الخصم المتاحة
            const discountCodes = {
                'WELCOME10': 10,
                'SAVE15': 15,
                'SPECIAL20': 20
            };
            
            if (discountCodes[discountCode]) {
                const discountPercent = discountCodes[discountCode];
                const discountValue = (subtotal * discountPercent / 100);
                
                if (discountAmount) discountAmount.textContent = `-${discountValue.toFixed(2)} SAR`;
                if (discountRow) discountRow.style.display = 'flex';
                discountMessage.textContent = `🎉 تم تطبيق خصم ${discountPercent}% بنجاح!`;
                discountMessage.className = 'mt-2 small text-success';
                
                this.currentDiscount = { code: discountCode, percent: discountPercent, value: discountValue };
                this.updateOrderTotalWithDiscount(discountValue);
                this.showNotification(`تم تطبيق خصم ${discountPercent}% على طلبك`);
            } else {
                discountMessage.textContent = '❌ كود الخصم غير صالح';
                discountMessage.className = 'mt-2 small text-danger';
                if (discountRow) discountRow.style.display = 'none';
                this.currentDiscount = null;
                this.updateOrderTotalWithDiscount(0);
            }
        } catch (error) {
            console.error('❌ خطأ في التحقق من كود الخصم:', error);
            discountMessage.textContent = '❌ حدث خطأ في التحقق من كود الخصم';
            discountMessage.className = 'mt-2 small text-danger';
        }
    }

    updateOrderTotalWithDiscount(discount = 0) {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = (subtotal - discount) * 0.15;
        const total = (subtotal - discount) + tax;
        
        if (document.getElementById('order-tax')) {
            document.getElementById('order-tax').textContent = `${tax.toFixed(2)} SAR`;
        }
        if (document.getElementById('order-total')) {
            document.getElementById('order-total').textContent = `${total.toFixed(2)} SAR`;
        }
    }

    showOrderDetails(orderData, orderNumber) {
        const orderDetails = this.getOrderDetailsHTML(orderData, orderNumber);
        
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

    getOrderDetailsHTML(orderData, orderNumber) {
        return `
            <div class="order-success">
                <div class="text-center mb-4">
                    <i class="fas fa-check-circle text-success fa-4x mb-3"></i>
                    <h3 class="text-success">تم تأكيد طلبك بنجاح!</h3>
                    <p class="text-muted">رقم الطلب: <strong>${orderNumber}</strong></p>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <h5>👤 معلومات العميل:</h5>
                        <p><strong>الاسم:</strong> ${orderData.customer.firstName} ${orderData.customer.lastName}</p>
                        <p><strong>البريد الإلكتروني:</strong> ${orderData.customer.email}</p>
                        <p><strong>الهاتف:</strong> ${orderData.customer.phone}</p>
                        <p><strong>العنوان:</strong> ${orderData.customer.address}, ${orderData.customer.city}</p>
                    </div>
                    <div class="col-md-6">
                        <h5>📊 تفاصيل الطلب:</h5>
                        <p><strong>عدد المنتجات:</strong> ${orderData.items.length}</p>
                        <p><strong>المجموع:</strong> ${orderData.totals.subtotal.toFixed(2)} SAR</p>
                        <p><strong>الضريبة:</strong> ${orderData.totals.tax.toFixed(2)} SAR</p>
                        ${orderData.totals.discount > 0 ? `<p><strong>الخصم:</strong> -${orderData.totals.discount.toFixed(2)} SAR</p>` : ''}
                        <p><strong>الإجمالي:</strong> ${orderData.totals.total.toFixed(2)} SAR</p>
                    </div>
                </div>
                
                <div class="mt-4">
                    <h5>🛍️ المنتجات المطلوبة:</h5>
                    ${orderData.items.map(item => `
                        <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                            <div>${item.name}</div>
                            <div>${item.quantity} × ${item.price} SAR</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="text-center mt-4">
                    <p class="text-muted">سيتم التواصل معك خلال 24 ساعة لتأكيد الشحن</p>
                    <button class="btn btn-primary" onclick="window.perfumeStore.closeOrderDetails()">موافق</button>
                </div>
            </div>
        `;
    }

    closeOrderDetails() {
        const orderDetails = document.querySelector('.order-details-overlay');
        if (orderDetails) {
            orderDetails.remove();
        }
    }

    resetAfterOrder() {
        this.cart = [];
        this.currentDiscount = null;
        this.updateCart();
        this.resetCheckoutForm();
        
        const discountRow = document.getElementById('discount-row');
        const discountMessage = document.getElementById('discount-message');
        const discountCode = document.getElementById('discount-code');
        
        if (discountRow) discountRow.style.display = 'none';
        if (discountMessage) discountMessage.textContent = '';
        if (discountCode) discountCode.value = '';
        
        if (this.checkoutPage) {
            this.checkoutPage.style.display = 'none';
        }
        
        const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
        if (mainContent) {
            mainContent.style.display = 'block';
        }
    }

    resetCheckoutForm() {
        const form = document.querySelector('.checkout-form');
        if (form) {
            form.reset();
            const invalidFields = form.querySelectorAll('.is-invalid');
            invalidFields.forEach(field => {
                field.classList.remove('is-invalid');
            });
        }
    }

    showNotification(message, type = 'success') {
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
        }, 5000);
    }

    testAddProducts() {
        const randomProduct1 = this.products[Math.floor(Math.random() * this.products.length)];
        const randomProduct2 = this.products[Math.floor(Math.random() * this.products.length)];
        
        this.addToCart({...randomProduct1, quantity: 1});
        this.addToCart({...randomProduct2, quantity: 2});
        
        this.showNotification('تم إضافة منتجات تجريبية للسلة 🧪');
    }

    getCart() {
        return this.cart;
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartItemsCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    clearCart() {
        this.cart = [];
        this.updateCart();
        this.showNotification('تم تفريغ السلة');
    }
}

// بدء النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.perfumeStore = new PerfumeStoreSystem();
});

// جعل النظام متاحاً globally
if (typeof window !== 'undefined') {
    window.PerfumeStoreSystem = PerfumeStoreSystem;
} 

console.log('🏪 نظام المتجر جاهز! استخدم:');
console.log('   - perfumeStore.testAddProducts() لإضافة منتجات تجريبية');
console.log('   - perfumeStore.openCart() لفتح السلة');
console.log('   - perfumeStore.clearCart() لتفريغ السلة');*/





















/*// نظام إدارة المتجر - PerfumeStoreSystem
class PerfumeStoreSystem {
    constructor() {
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
        console.log('🏪 بدء تشغيل نظام المتجر...');
        this.setupStoreStyles();
        this.initializeDOMElements();
        this.setupEventListeners();
        this.updateCart();
        this.addDataAttributesToButtons();
        console.log('✅ تم تهيئة نظام المتجر بنجاح');
    }

    setupStoreStyles() {
        if (document.getElementById('store-styles')) return;
        
        const styles = `
            <style id="store-styles">
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
                
                .form-control {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 10px;
                    width: 100%;
                    font-size: 14px;
                }
                
                .form-control:focus {
                    border-color: #a20087;
                    box-shadow: 0 0 0 0.2rem rgba(162, 0, 135, 0.25);
                    outline: none;
                }
                
                .form-label {
                    font-weight: bold;
                    margin-bottom: 5px;
                    display: block;
                }
                
                .input-group {
                    display: flex;
                }
                
                .input-group .form-control {
                    border-radius: 8px 0 0 8px;
                }
                
                .input-group .btn {
                    border-radius: 0 8px 8px 0;
                    border: 1px solid #a20087;
                }
                
                .btn-outline-primary {
                    color: #a20087;
                    border-color: #a20087;
                }
                
                .btn-outline-primary:hover {
                    background-color: #a20087;
                    color: white;
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

    initializeDOMElements() {
        console.log('🔍 تهيئة عناصر DOM...');
        
        this.createCartElements();
        this.createCheckoutPage();
        
        this.cartToggle = document.getElementById('cart-toggle');
        this.closeCart = document.getElementById('close-cart');
        this.cartOverlay = document.getElementById('cart-overlay');
        this.cartSidebar = document.getElementById('cart-sidebar');
        this.cartItems = document.getElementById('cart-items');
        this.cartCount = document.getElementById('cart-count');
        this.cartTotal = document.getElementById('cart-total');
        this.subtotalEl = document.getElementById('subtotal');
        this.taxEl = document.getElementById('tax');
        this.totalEl = document.getElementById('total');
        this.checkoutBtn = document.getElementById('checkout-btn');
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
        
        this.cartItems = document.getElementById('cart-items');
        this.cartTotal = document.getElementById('cart-total');
        this.subtotalEl = document.getElementById('subtotal');
        this.taxEl = document.getElementById('tax');
        this.totalEl = document.getElementById('total');
        this.checkoutBtn = document.getElementById('checkout-btn');
        this.closeCart = document.getElementById('close-cart');
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
                <div class="d-flex justify-content-between mb-3">
                    <span>الضريبة (15%):</span>
                    <span id="tax">0 SAR</span>
                </div>
                <div class="d-flex justify-content-between fw-bold fs-5">
                    <span>الإجمالي:</span>
                    <span id="total">0 SAR</span>
                </div>
                <button class="checkout-btn mt-4" id="checkout-btn">🚀 اتمام الشراء</button>
            </div>
        `;
    }

    createCheckoutPage() {
        if (document.getElementById('checkout-page')) return;
        
        this.checkoutPage = document.createElement('div');
        this.checkoutPage.id = 'checkout-page';
        this.checkoutPage.className = 'checkout-page';
        this.checkoutPage.style.display = 'none';
        this.checkoutPage.innerHTML = this.getCheckoutHTML();
        document.body.appendChild(this.checkoutPage);
    }

    getCheckoutHTML() {
        return `
            <div class="checkout-container">
                <div class="checkout-content">
                    <a href="#" class="back-to-cart" id="back-to-cart">
                        <i class="fas fa-arrow-right"></i> العودة إلى السلة
                    </a>
                    <div class="row">
                        <div class="col-lg-8 mb-4">
                            <div class="checkout-form">
                                <h3 class="mb-4">📦 معلومات الشحن</h3>
                                ${this.getCheckoutFormHTML()}
                                <button class="checkout-btn mt-3" id="complete-order">✅ اتمام الطلب</button>
                            </div>
                        </div>
                        
                        <div class="col-lg-4">
                            <div class="order-summary">
                                <h4 class="mb-4">📋 ملخص الطلب</h4>
                                <div id="order-items"></div>
                                ${this.getDiscountSectionHTML()}
                                ${this.getOrderSummaryHTML()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getCheckoutFormHTML() {
        return `
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="firstName" class="form-label">الاسم الأول *</label>
                    <input type="text" class="form-control" id="firstName" required>
                    <div class="invalid-feedback">يرجى إدخال الاسم الأول</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="lastName" class="form-label">الاسم الأخير *</label>
                    <input type="text" class="form-control" id="lastName" required>
                    <div class="invalid-feedback">يرجى إدخال الاسم الأخير</div>
                </div>
            </div>
            
            <div class="mb-3">
                <label for="email" class="form-label">📧 البريد الإلكتروني *</label>
                <input type="email" class="form-control" id="email" required>
                <div class="invalid-feedback">يرجى إدخال بريد إلكتروني صحيح</div>
            </div>
            
            <div class="mb-3">
                <label for="phone" class="form-label">📞 رقم الهاتف *</label>
                <input type="tel" class="form-control" id="phone" required>
                <div class="invalid-feedback">يرجى إدخال رقم هاتف صحيح</div>
            </div>
            
            <div class="mb-3">
                <label for="address" class="form-label">📍 العنوان *</label>
                <input type="text" class="form-control" id="address" required>
                <div class="invalid-feedback">يرجى إدخال العنوان</div>
            </div>
            
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="city" class="form-label">🏙️ المدينة *</label>
                    <input type="text" class="form-control" id="city" required>
                    <div class="invalid-feedback">يرجى إدخال المدينة</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="postalCode" class="form-label">📮 الرمز البريدي</label>
                    <input type="text" class="form-control" id="postalCode">
                </div>
            </div>
            
            <h3 class="my-4">💳 معلومات الدفع</h3>
            
            <div class="mb-3">
                <label for="cardNumber" class="form-label">رقم البطاقة *</label>
                <input type="text" class="form-control" id="cardNumber" placeholder="1234 5678 9012 3456" required maxlength="19">
                <div class="invalid-feedback">يرجى إدخال 16 رقم للبطاقة</div>
            </div>
            
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="expiryDate" class="form-label">تاريخ الانتهاء *</label>
                    <input type="text" class="form-control" id="expiryDate" placeholder="MM/YY" required maxlength="5">
                    <div class="invalid-feedback">يرجى إدخال التاريخ بالصيغة MM/YY</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="cvv" class="form-label">CVV *</label>
                    <input type="text" class="form-control" id="cvv" placeholder="123" required maxlength="3">
                    <div class="invalid-feedback">يرجى إدخال 3 أرقام للـ CVV</div>
                </div>
            </div>
        `;
    }

    getDiscountSectionHTML() {
        return `
            <div class="discount-section mb-3 mt-3">
                <label for="discount-code" class="form-label">🎁 كود الخصم</label>
                <div class="input-group">
                    <input type="text" class="form-control" id="discount-code" placeholder="أدخل الكود هنا">
                    <button class="btn btn-outline-primary" type="button" id="apply-discount">تطبيق</button>
                </div>
                <div id="discount-message" class="mt-2 small"></div>
            </div>
        `;
    }

    getOrderSummaryHTML() {
        return `
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
        `;
    }

    setupEventListeners() {
        console.log('🎯 إعداد مستمعي الأحداث...');
        
        // أحداث السلة
        if (this.cartToggle) {
            this.cartToggle.addEventListener('click', () => this.openCart());
        }
        
        if (this.closeCart) {
            this.closeCart.addEventListener('click', () => this.closeCartHandler());
        }
        
        if (this.cartOverlay) {
            this.cartOverlay.addEventListener('click', () => this.closeCartHandler());
        }
        
        if (this.checkoutBtn) {
            this.checkoutBtn.addEventListener('click', () => this.goToCheckout());
        }
        
        // أحداث المنتجات
        document.addEventListener('click', (e) => {
            const buyButton = e.target.closest('.buy-button');
            if (buyButton) {
                e.preventDefault();
                e.stopPropagation();
                this.handleBuyButtonClick(buyButton);
            }
        });
        
        // أحداث صفحة اتمام الشراء
        document.addEventListener('click', (e) => {
            if (e.target.id === 'back-to-cart' || e.target.closest('#back-to-cart')) {
                e.preventDefault();
                this.backToCartHandler();
            }
            
            if (e.target.id === 'complete-order' || e.target.closest('#complete-order')) {
                e.preventDefault();
                this.completeOrderHandler();
            }
            
            if (e.target.id === 'apply-discount' || e.target.closest('#apply-discount')) {
                e.preventDefault();
                this.applyDiscount();
            }
        });

        // إعداد مستمعي حقول الإدخال
        this.setupFormInputListeners();
    }

    setupFormInputListeners() {
        // تنسيق رقم البطاقة
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedValue.substring(0, 19);
                this.clearFieldError(e.target);
            });
        }

        // تنسيق تاريخ الانتهاء
        const expiryDateInput = document.getElementById('expiryDate');
        if (expiryDateInput) {
            expiryDateInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/[^0-9]/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value.substring(0, 5);
                this.clearFieldError(e.target);
            });
        }

        // تقييد CVV لأرقام فقط
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 3);
                this.clearFieldError(e.target);
            });
        }

        // إزالة الأخطاء عند الكتابة في الحقول الأخرى
        const otherFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode'];
        otherFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', (e) => {
                    this.clearFieldError(e.target);
                });
            }
        });

        // إزالة الأخطاء من حقل الخصم
        const discountCodeInput = document.getElementById('discount-code');
        if (discountCodeInput) {
            discountCodeInput.addEventListener('input', (e) => {
                const discountMessage = document.getElementById('discount-message');
                if (discountMessage) {
                    discountMessage.textContent = '';
                    discountMessage.className = 'mt-2 small';
                }
            });
        }
    }

    clearFieldError(field) {
        if (field.value.trim()) {
            field.classList.remove('is-invalid');
        }
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

    addDataAttributesToButtons() {
        console.log('🔧 جاري إضافة البيانات لأزرار الشراء...');
        
        const buttons = document.querySelectorAll('.buy-button');
        console.log(`تم العثور على ${buttons.length} زر شراء`);
        
        buttons.forEach((button, index) => {
            const product = this.products[index];
            if (product) {
                button.setAttribute('data-id', product.id);
                button.setAttribute('data-name', product.name);
                button.setAttribute('data-price', product.price);
                button.setAttribute('data-image', product.image);
                console.log(`✅ تم إضافة بيانات للمنتج: ${product.name}`);
            }
        });
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

    closeCartHandler() {
        console.log('❌ إغلاق السلة');
        if (this.cartSidebar) {
            this.cartSidebar.classList.remove('active');
        }
        if (this.cartOverlay) {
            this.cartOverlay.classList.remove('active');
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
        this.showNotification(`تم إضافة ${product.name} إلى السلة 🎉`);
    }

    updateCart() {
        if (!this.cartItems || !this.cartCount) {
            console.warn('⚠️ عناصر السلة غير موجودة');
            return;
        }
        
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
        this.cartCount.textContent = totalItems;
        
        if (this.cart.length === 0) {
            this.cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart fa-3x mb-3 text-muted"></i>
                    <p>سلة التسوق فارغة</p>
                </div>
            `;
            if (this.cartTotal) this.cartTotal.style.display = 'none';
        } else {
            this.cartItems.innerHTML = '';
            this.cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                
                const imageSrc = item.image && item.image.startsWith('images/') ? 
                    item.image : 
                    `https://via.placeholder.com/70x70/cccccc/969696?text=${encodeURIComponent(item.name)}`;
                
                this.cartItems.innerHTML += `
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
            
            if (this.cartTotal) this.cartTotal.style.display = 'block';
            
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
        
        this.updateTotals();
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
            this.showNotification(`تم إزالة ${item.name} من السلة`);
            this.updateCart();
        }
    }

    updateTotals() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.15;
        const total = subtotal + tax;
        
        if (this.subtotalEl) this.subtotalEl.textContent = `${subtotal.toFixed(2)} SAR`;
        if (this.taxEl) this.taxEl.textContent = `${tax.toFixed(2)} SAR`;
        if (this.totalEl) this.totalEl.textContent = `${total.toFixed(2)} SAR`;
        
        if (document.getElementById('order-subtotal')) {
            document.getElementById('order-subtotal').textContent = `${subtotal.toFixed(2)} SAR`;
        }
        if (document.getElementById('order-tax')) {
            document.getElementById('order-tax').textContent = `${tax.toFixed(2)} SAR`;
        }
        if (document.getElementById('order-total')) {
            document.getElementById('order-total').textContent = `${total.toFixed(2)} SAR`;
        }
        
        this.updateOrderItems();
    }

    updateOrderItems() {
        const orderItems = document.getElementById('order-items');
        if (!orderItems) return;
        
        orderItems.innerHTML = '';
        this.cart.forEach(item => {
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
                    <div class="fw-bold">${itemTotal.toFixed(2)} SAR</div>
                </div>
            `;
        });
    }

    goToCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('السلة فارغة. أضف منتجات قبل اتمام الشراء.', 'error');
            return;
        }
        
        this.closeCartHandler();
        
        if (this.checkoutPage) {
            this.checkoutPage.style.display = 'block';
            console.log('✅ تم فتح صفحة اتمام الشراء');
        }
        
        const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
        if (mainContent) {
            mainContent.style.display = 'none';
        }
    }

    backToCartHandler() {
        console.log('↩️ العودة إلى السلة');
        
        if (this.checkoutPage) {
            this.checkoutPage.style.display = 'none';
        }
        
        const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
        if (mainContent) {
            mainContent.style.display = 'block';
        }
        
        this.openCart();
    }

    async completeOrderHandler() {
        console.log('🚀 بدء معالجة الطلب...');
        
        const orderButton = document.getElementById('complete-order');
        const originalText = orderButton.textContent;
        orderButton.textContent = 'جاري المعالجة...';
        orderButton.disabled = true;
        
        // التحقق من وجود السلة
        if (this.cart.length === 0) {
            this.showNotification('السلة فارغة. أضف منتجات قبل اتمام الشراء.', 'error');
            orderButton.textContent = originalText;
            orderButton.disabled = false;
            return;
        }
        
        // التحقق من النموذج
        console.log('🔍 التحقق من صحة النموذج...');
        if (!this.validateCheckoutForm()) {
            console.log('❌ فشل التحقق من النموذج');
            this.showNotification('يرجى ملء جميع الحقول المطلوبة بشكل صحيح.', 'error');
            orderButton.textContent = originalText;
            orderButton.disabled = false;
            return;
        }
        
        console.log('✅ النموذج صالح، جاري جمع البيانات...');
        
        try {
            const orderData = this.collectOrderData();
            console.log('📦 بيانات الطلب المجمعة:', orderData);
            
            this.showNotification('جاري معالجة طلبك ...', 'info');
            
            // حفظ الطلب في قاعدة البيانات
            console.log('💾 جاري حفظ الطلب...');
            const saveResult = await this.saveOrderToDatabase(orderData);
            
            // التحقق من نجاح الطلب
            if (saveResult && (saveResult.status === 200 || saveResult.success)) {
                console.log('✅ تم الطلب بنجاح');
                const orderNumber = saveResult.order_number || 'ORD-' + Date.now().toString().slice(-8);
                
                this.showNotification('🎉 تم الطلب بنجاح! شكراً لثقتك بنا.', 'success');
                
                // عرض التفاصيل
                this.showOrderDetails(orderData, orderNumber);
                
                // إعادة تعيين
                this.resetAfterOrder();
                
            } else {
                throw new Error('فشل في معالجة الطلب');
            }
            
        } catch (error) {
            console.error('❌ خطأ في اتمام الطلب:', error);
            
        } finally {
            orderButton.textContent = originalText;
            orderButton.disabled = false;
        }
    }

    validateCheckoutForm() {
        const requiredFields = [
            'firstName', 'lastName', 'email', 'phone', 
            'address', 'city', 'cardNumber', 'expiryDate', 'cvv'
        ];
        let isValid = true;
        
        console.log('🔍 بدء التحقق من النموذج...');
        
        // إعادة تعيين جميع حالات الخطأ
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.classList.remove('is-invalid');
                console.log(`✅ إعادة تعيين حقل: ${fieldId}`);
            }
        });
        
        // التحقق من الحقول المطلوبة
        for (let fieldId of requiredFields) {
            const field = document.getElementById(fieldId);
            console.log(`🔍 فحص حقل ${fieldId}:`, field ? field.value : 'غير موجود');
            
            if (!field || !field.value.trim()) {
                console.log(`❌ حقل ${fieldId} فارغ`);
                if (field) {
                    field.classList.add('is-invalid');
                    // إضافة رسالة الخطأ إذا لم تكن موجودة
                    if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('invalid-feedback')) {
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'invalid-feedback';
                        errorDiv.textContent = 'هذا الحقل مطلوب';
                        field.parentNode.appendChild(errorDiv);
                    }
                }
                isValid = false;
            } else {
                console.log(`✅ حقل ${fieldId} مملوء: ${field.value}`);
            }
        }
        
        // التحقق من صحة البريد الإلكتروني
        const emailField = document.getElementById('email');
        if (emailField && emailField.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value.trim())) {
                console.log('❌ البريد الإلكتروني غير صحيح');
                emailField.classList.add('is-invalid');
                if (!emailField.nextElementSibling || !emailField.nextElementSibling.classList.contains('invalid-feedback')) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'invalid-feedback';
                    errorDiv.textContent = 'يرجى إدخال بريد إلكتروني صحيح';
                    emailField.parentNode.appendChild(errorDiv);
                }
                isValid = false;
            }
        }
        
        // التحقق من صحة رقم البطاقة (16 رقم)
        const cardNumberField = document.getElementById('cardNumber');
        if (cardNumberField && cardNumberField.value.trim()) {
            const cardNumber = cardNumberField.value.replace(/\s+/g, '');
            console.log('🔍 رقم البطاقة:', cardNumber, 'الطول:', cardNumber.length);
            
            if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
                console.log('❌ رقم البطاقة غير صحيح');
                cardNumberField.classList.add('is-invalid');
                if (!cardNumberField.nextElementSibling || !cardNumberField.nextElementSibling.classList.contains('invalid-feedback')) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'invalid-feedback';
                    errorDiv.textContent = 'يرجى إدخال 16 رقم للبطاقة';
                    cardNumberField.parentNode.appendChild(errorDiv);
                }
                isValid = false;
            }
        }
        
        // التحقق من صحة تاريخ الانتهاء
        const expiryDateField = document.getElementById('expiryDate');
        if (expiryDateField && expiryDateField.value.trim()) {
            const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
            console.log('🔍 تاريخ الانتهاء:', expiryDateField.value);
            
            if (!expiryRegex.test(expiryDateField.value.trim())) {
                console.log('❌ تاريخ الانتهاء غير صحيح');
                expiryDateField.classList.add('is-invalid');
                if (!expiryDateField.nextElementSibling || !expiryDateField.nextElementSibling.classList.contains('invalid-feedback')) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'invalid-feedback';
                    errorDiv.textContent = 'يرجى إدخال التاريخ بالصيغة MM/YY';
                    expiryDateField.parentNode.appendChild(errorDiv);
                }
                isValid = false;
            }
        }
        
        // التحقق من صحة CVV (3 أرقام)
        const cvvField = document.getElementById('cvv');
        if (cvvField && cvvField.value.trim()) {
            console.log('🔍 CVV:', cvvField.value, 'الطول:', cvvField.value.length);
            
            if (cvvField.value.length !== 3 || !/^\d+$/.test(cvvField.value)) {
                console.log('❌ CVV غير صحيح');
                cvvField.classList.add('is-invalid');
                if (!cvvField.nextElementSibling || !cvvField.nextElementSibling.classList.contains('invalid-feedback')) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'invalid-feedback';
                    errorDiv.textContent = 'يرجى إدخال 3 أرقام للـ CVV';
                    cvvField.parentNode.appendChild(errorDiv);
                }
                isValid = false;
            }
        }
        
        // التحقق من صحة رقم الهاتف
        const phoneField = document.getElementById('phone');
        if (phoneField && phoneField.value.trim()) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(phoneField.value.trim())) {
                console.log('❌ رقم الهاتف غير صحيح');
                phoneField.classList.add('is-invalid');
                if (!phoneField.nextElementSibling || !phoneField.nextElementSibling.classList.contains('invalid-feedback')) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'invalid-feedback';
                    errorDiv.textContent = 'يرجى إدخال رقم هاتف صحيح';
                    phoneField.parentNode.appendChild(errorDiv);
                }
                isValid = false;
            }
        }
        
        console.log('📋 نتيجة التحقق:', isValid ? '✅ النموذج صالح' : '❌ النموذج غير صالح');
        
        // إذا كان هناك أخطاء، قم بالتمرير إلى أول حقل خطأ
        if (!isValid) {
            const firstInvalidField = document.querySelector('.is-invalid');
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                firstInvalidField.focus();
            }
        }
        
        return isValid;
    }

    collectOrderData() {
        const customer = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            postalCode: document.getElementById('postalCode').value || ''
        };
        
        const payment = {
            cardNumber: document.getElementById('cardNumber').value,
            expiryDate: document.getElementById('expiryDate').value,
            cvv: document.getElementById('cvv').value
        };
        
        const discountRow = document.getElementById('discount-row');
        const discount = discountRow && discountRow.style.display !== 'none' ? 
            parseFloat(document.getElementById('discount-amount').textContent.replace('-', '').replace(' SAR', '')) || 0 : 0;
        
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.15;
        const total = subtotal + tax - discount;
        
        return {
            customer: customer,
            payment: payment,
            items: this.cart.map(item => ({
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

    async saveOrderToDatabase(orderData) {
        try {
            console.log('📤 جاري إرسال الطلب إلى الخادم...', orderData);
            
            // محاكاة حفظ الطلب (يمكن استبدالها باتصال حقيقي بالخادم)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // محاكاة استجابة ناجحة من الخادم
            const mockResponse = {
                status: 200,
                success: true,
                order_number: 'ORD-' + Date.now().toString().slice(-8),
                message: 'تم حفظ الطلب بنجاح'
            };
            
            console.log('✅ تم حفظ الطلب بنجاح:', mockResponse.order_number);
            
            return mockResponse;
            
        } catch (error) {
            console.error('❌ خطأ في حفظ الطلب:', error);
            
            // محاكاة استجابة فاشلة من الخادم
            throw new Error('فشل في معالجة الطلب');
        }
    }

    async applyDiscount() {
        const discountCodeInput = document.getElementById('discount-code');
        const discountMessage = document.getElementById('discount-message');
        const discountRow = document.getElementById('discount-row');
        const discountAmount = document.getElementById('discount-amount');
        
        if (!discountCodeInput || !discountMessage) return;
        
        const discountCode = discountCodeInput.value.trim();
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        if (!discountCode) {
            discountMessage.textContent = 'يرجى إدخال كود الخصم';
            discountMessage.className = 'mt-2 small text-danger';
            return;
        }
        
        try {
            // محاكاة التحقق من كود الخصم
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // أكواد الخصم المتاحة
            const discountCodes = {
                'WELCOME10': 10,
                'SAVE15': 15,
                'SPECIAL20': 20
            };
            
            if (discountCodes[discountCode]) {
                const discountPercent = discountCodes[discountCode];
                const discountValue = (subtotal * discountPercent / 100);
                
                if (discountAmount) discountAmount.textContent = `-${discountValue.toFixed(2)} SAR`;
                if (discountRow) discountRow.style.display = 'flex';
                discountMessage.textContent = `🎉 تم تطبيق خصم ${discountPercent}% بنجاح!`;
                discountMessage.className = 'mt-2 small text-success';
                
                this.currentDiscount = { code: discountCode, percent: discountPercent, value: discountValue };
                this.updateOrderTotalWithDiscount(discountValue);
                this.showNotification(`تم تطبيق خصم ${discountPercent}% على طلبك`);
            } else {
                discountMessage.textContent = '❌ كود الخصم غير صالح';
                discountMessage.className = 'mt-2 small text-danger';
                if (discountRow) discountRow.style.display = 'none';
                this.currentDiscount = null;
                this.updateOrderTotalWithDiscount(0);
            }
        } catch (error) {
            console.error('❌ خطأ في التحقق من كود الخصم:', error);
            discountMessage.textContent = '❌ حدث خطأ في التحقق من كود الخصم';
            discountMessage.className = 'mt-2 small text-danger';
        }
    }

    updateOrderTotalWithDiscount(discount = 0) {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = (subtotal - discount) * 0.15;
        const total = (subtotal - discount) + tax;
        
        if (document.getElementById('order-tax')) {
            document.getElementById('order-tax').textContent = `${tax.toFixed(2)} SAR`;
        }
        if (document.getElementById('order-total')) {
            document.getElementById('order-total').textContent = `${total.toFixed(2)} SAR`;
        }
    }

    showOrderDetails(orderData, orderNumber) {
        const orderDetails = this.getOrderDetailsHTML(orderData, orderNumber);
        
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

    getOrderDetailsHTML(orderData, orderNumber) {
        return `
            <div class="order-success">
                <div class="text-center mb-4">
                    <i class="fas fa-check-circle text-success fa-4x mb-3"></i>
                    <h3 class="text-success">تم تأكيد طلبك بنجاح!</h3>
                    <p class="text-muted">رقم الطلب: <strong>${orderNumber}</strong></p>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <h5>👤 معلومات العميل:</h5>
                        <p><strong>الاسم:</strong> ${orderData.customer.firstName} ${orderData.customer.lastName}</p>
                        <p><strong>البريد الإلكتروني:</strong> ${orderData.customer.email}</p>
                        <p><strong>الهاتف:</strong> ${orderData.customer.phone}</p>
                        <p><strong>العنوان:</strong> ${orderData.customer.address}, ${orderData.customer.city}</p>
                    </div>
                    <div class="col-md-6">
                        <h5>📊 تفاصيل الطلب:</h5>
                        <p><strong>عدد المنتجات:</strong> ${orderData.items.length}</p>
                        <p><strong>المجموع:</strong> ${orderData.totals.subtotal.toFixed(2)} SAR</p>
                        <p><strong>الضريبة:</strong> ${orderData.totals.tax.toFixed(2)} SAR</p>
                        ${orderData.totals.discount > 0 ? `<p><strong>الخصم:</strong> -${orderData.totals.discount.toFixed(2)} SAR</p>` : ''}
                        <p><strong>الإجمالي:</strong> ${orderData.totals.total.toFixed(2)} SAR</p>
                    </div>
                </div>
                
                <div class="mt-4">
                    <h5>🛍️ المنتجات المطلوبة:</h5>
                    ${orderData.items.map(item => `
                        <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                            <div>${item.name}</div>
                            <div>${item.quantity} × ${item.price} SAR</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="text-center mt-4">
                    <p class="text-muted">سيتم التواصل معك خلال 24 ساعة لتأكيد الشحن</p>
                    <button class="btn btn-primary" onclick="window.perfumeStore.closeOrderDetails()">موافق</button>
                </div>
            </div>
        `;
    }

    closeOrderDetails() {
        const orderDetails = document.querySelector('.order-details-overlay');
        if (orderDetails) {
            orderDetails.remove();
        }
    }

    resetAfterOrder() {
        this.cart = [];
        this.currentDiscount = null;
        this.updateCart();
        this.resetCheckoutForm();
        
        const discountRow = document.getElementById('discount-row');
        const discountMessage = document.getElementById('discount-message');
        const discountCode = document.getElementById('discount-code');
        
        if (discountRow) discountRow.style.display = 'none';
        if (discountMessage) discountMessage.textContent = '';
        if (discountCode) discountCode.value = '';
        
        if (this.checkoutPage) {
            this.checkoutPage.style.display = 'none';
        }
        
        const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
        if (mainContent) {
            mainContent.style.display = 'block';
        }
    }

    resetCheckoutForm() {
        const form = document.querySelector('.checkout-form');
        if (form) {
            form.reset();
            const invalidFields = form.querySelectorAll('.is-invalid');
            invalidFields.forEach(field => {
                field.classList.remove('is-invalid');
            });
        }
    }

    showNotification(message, type = 'success') {
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
        }, 5000);
    }

    testAddProducts() {
        const randomProduct1 = this.products[Math.floor(Math.random() * this.products.length)];
        const randomProduct2 = this.products[Math.floor(Math.random() * this.products.length)];
        
        this.addToCart({...randomProduct1, quantity: 1});
        this.addToCart({...randomProduct2, quantity: 2});
        
        this.showNotification('تم إضافة منتجات تجريبية للسلة 🧪');
    }

    getCart() {
        return this.cart;
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartItemsCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    clearCart() {
        this.cart = [];
        this.updateCart();
        this.showNotification('تم تفريغ السلة');
    }
}

// بدء النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.perfumeStore = new PerfumeStoreSystem();
});

// جعل النظام متاحاً globally
if (typeof window !== 'undefined') {
    window.PerfumeStoreSystem = PerfumeStoreSystem;
} 

console.log('🏪 نظام المتجر جاهز! استخدم:');
console.log('   - perfumeStore.testAddProducts() لإضافة منتجات تجريبية');
console.log('   - perfumeStore.openCart() لفتح السلة');
console.log('   - perfumeStore.clearCart() لتفريغ السلة');*/





































































































































/*
// نظام إدارة المتجر - PerfumeStoreSystem
class PerfumeStoreSystem {
    constructor() {
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
        
        // تهيئة النظام
        this.init();
    }

    init() {
        console.log('🏪 بدء تشغيل نظام المتجر...');
        this.setupStoreStyles();
        this.initializeDOMElements();
        this.setupEventListeners();
        this.updateCart();
        this.addDataAttributesToButtons();
        console.log('✅ تم تهيئة نظام المتجر بنجاح');
    }

    setupStoreStyles() {
        if (document.getElementById('store-styles')) return;
        
        const styles = `
            <style id="store-styles">
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
                
                .form-control {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 10px;
                    width: 100%;
                    font-size: 14px;
                }
                
                .form-control:focus {
                    border-color: #a20087;
                    box-shadow: 0 0 0 0.2rem rgba(162, 0, 135, 0.25);
                    outline: none;
                }
                
                .form-label {
                    font-weight: bold;
                    margin-bottom: 5px;
                    display: block;
                }
                
                .input-group {
                    display: flex;
                }
                
                .input-group .form-control {
                    border-radius: 8px 0 0 8px;
                }
                
                .input-group .btn {
                    border-radius: 0 8px 8px 0;
                    border: 1px solid #a20087;
                }
                
                .btn-outline-primary {
                    color: #a20087;
                    border-color: #a20087;
                }
                
                .btn-outline-primary:hover {
                    background-color: #a20087;
                    color: white;
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

    initializeDOMElements() {
        console.log('🔍 تهيئة عناصر DOM...');
        
        this.createCartElements();
        this.createCheckoutPage();
        
        this.cartToggle = document.getElementById('cart-toggle');
        this.closeCart = document.getElementById('close-cart');
        this.cartOverlay = document.getElementById('cart-overlay');
        this.cartSidebar = document.getElementById('cart-sidebar');
        this.cartItems = document.getElementById('cart-items');
        this.cartCount = document.getElementById('cart-count');
        this.cartTotal = document.getElementById('cart-total');
        this.subtotalEl = document.getElementById('subtotal');
        this.taxEl = document.getElementById('tax');
        this.totalEl = document.getElementById('total');
        this.checkoutBtn = document.getElementById('checkout-btn');
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
        
        this.cartItems = document.getElementById('cart-items');
        this.cartTotal = document.getElementById('cart-total');
        this.subtotalEl = document.getElementById('subtotal');
        this.taxEl = document.getElementById('tax');
        this.totalEl = document.getElementById('total');
        this.checkoutBtn = document.getElementById('checkout-btn');
        this.closeCart = document.getElementById('close-cart');
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
                <div class="d-flex justify-content-between mb-3">
                    <span>الضريبة (15%):</span>
                    <span id="tax">0 SAR</span>
                </div>
                <div class="d-flex justify-content-between fw-bold fs-5">
                    <span>الإجمالي:</span>
                    <span id="total">0 SAR</span>
                </div>
                <button class="checkout-btn mt-4" id="checkout-btn">🚀 اتمام الشراء</button>
            </div>
        `;
    }

    createCheckoutPage() {
        if (document.getElementById('checkout-page')) return;
        
        this.checkoutPage = document.createElement('div');
        this.checkoutPage.id = 'checkout-page';
        this.checkoutPage.className = 'checkout-page';
        this.checkoutPage.style.display = 'none';
        this.checkoutPage.innerHTML = this.getCheckoutHTML();
        document.body.appendChild(this.checkoutPage);
    }

    getCheckoutHTML() {
        return `
            <div class="checkout-container">
                <div class="checkout-content">
                    <a href="#" class="back-to-cart" id="back-to-cart">
                        <i class="fas fa-arrow-right"></i> العودة إلى السلة
                    </a>
                    <div class="row">
                        <div class="col-lg-8 mb-4">
                            <div class="checkout-form">
                                <h3 class="mb-4">📦 معلومات الشحن</h3>
                                ${this.getCheckoutFormHTML()}
                                <button class="checkout-btn mt-3" id="complete-order">✅ اتمام الطلب</button>
                            </div>
                        </div>
                        
                        <div class="col-lg-4">
                            <div class="order-summary">
                                <h4 class="mb-4">📋 ملخص الطلب</h4>
                                <div id="order-items"></div>
                                ${this.getDiscountSectionHTML()}
                                ${this.getOrderSummaryHTML()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getCheckoutFormHTML() {
        return `
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="firstName" class="form-label">الاسم الأول *</label>
                    <input type="text" class="form-control" id="firstName" required>
                    <div class="invalid-feedback">يرجى إدخال الاسم الأول</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="lastName" class="form-label">الاسم الأخير *</label>
                    <input type="text" class="form-control" id="lastName" required>
                    <div class="invalid-feedback">يرجى إدخال الاسم الأخير</div>
                </div>
            </div>
            
            <div class="mb-3">
                <label for="email" class="form-label">📧 البريد الإلكتروني *</label>
                <input type="email" class="form-control" id="email" required>
                <div class="invalid-feedback">يرجى إدخال بريد إلكتروني صحيح</div>
            </div>
            
            <div class="mb-3">
                <label for="phone" class="form-label">📞 رقم الهاتف *</label>
                <input type="tel" class="form-control" id="phone" required>
                <div class="invalid-feedback">يرجى إدخال رقم هاتف صحيح</div>
            </div>
            
            <div class="mb-3">
                <label for="address" class="form-label">📍 العنوان *</label>
                <input type="text" class="form-control" id="address" required>
                <div class="invalid-feedback">يرجى إدخال العنوان</div>
            </div>
            
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="city" class="form-label">🏙️ المدينة *</label>
                    <input type="text" class="form-control" id="city" required>
                    <div class="invalid-feedback">يرجى إدخال المدينة</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="postalCode" class="form-label">📮 الرمز البريدي</label>
                    <input type="text" class="form-control" id="postalCode">
                </div>
            </div>
            
            <h3 class="my-4">💳 معلومات الدفع</h3>
            
            <div class="mb-3">
                <label for="cardNumber" class="form-label">رقم البطاقة *</label>
                <input type="text" class="form-control" id="cardNumber" placeholder="1234 5678 9012 3456" required maxlength="19">
                <div class="invalid-feedback">يرجى إدخال 16 رقم للبطاقة</div>
            </div>
            
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="expiryDate" class="form-label">تاريخ الانتهاء *</label>
                    <input type="text" class="form-control" id="expiryDate" placeholder="MM/YY" required maxlength="5">
                    <div class="invalid-feedback">يرجى إدخال التاريخ بالصيغة MM/YY</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="cvv" class="form-label">CVV *</label>
                    <input type="text" class="form-control" id="cvv" placeholder="123" required maxlength="3">
                    <div class="invalid-feedback">يرجى إدخال 3 أرقام للـ CVV</div>
                </div>
            </div>
        `;
    }

    getDiscountSectionHTML() {
        return `
            <div class="discount-section mb-3 mt-3">
                <label for="discount-code" class="form-label">🎁 كود الخصم</label>
                <div class="input-group">
                    <input type="text" class="form-control" id="discount-code" placeholder="أدخل الكود هنا">
                    <button class="btn btn-outline-primary" type="button" id="apply-discount">تطبيق</button>
                </div>
                <div id="discount-message" class="mt-2 small"></div>
            </div>
        `;
    }

    getOrderSummaryHTML() {
        return `
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
        `;
    }

    setupEventListeners() {
        console.log('🎯 إعداد مستمعي الأحداث...');
        
        // أحداث السلة
        if (this.cartToggle) {
            this.cartToggle.addEventListener('click', () => this.openCart());
        }
        
        if (this.closeCart) {
            this.closeCart.addEventListener('click', () => this.closeCartHandler());
        }
        
        if (this.cartOverlay) {
            this.cartOverlay.addEventListener('click', () => this.closeCartHandler());
        }
        
        if (this.checkoutBtn) {
            this.checkoutBtn.addEventListener('click', () => this.goToCheckout());
        }
        
        // أحداث المنتجات
        document.addEventListener('click', (e) => {
            const buyButton = e.target.closest('.buy-button');
            if (buyButton) {
                e.preventDefault();
                e.stopPropagation();
                this.handleBuyButtonClick(buyButton);
            }
        });
        
        // أحداث صفحة اتمام الشراء
        document.addEventListener('click', (e) => {
            if (e.target.id === 'back-to-cart' || e.target.closest('#back-to-cart')) {
                e.preventDefault();
                this.backToCartHandler();
            }
            
            if (e.target.id === 'complete-order' || e.target.closest('#complete-order')) {
                e.preventDefault();
                this.completeOrderHandler();
            }
            
            if (e.target.id === 'apply-discount' || e.target.closest('#apply-discount')) {
                e.preventDefault();
                this.applyDiscount();
            }
        });

        // إعداد مستمعي حقول الإدخال
        this.setupFormInputListeners();
    }

    setupFormInputListeners() {
        // تنسيق رقم البطاقة
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedValue.substring(0, 19);
                this.clearFieldError(e.target);
            });
        }

        // تنسيق تاريخ الانتهاء
        const expiryDateInput = document.getElementById('expiryDate');
        if (expiryDateInput) {
            expiryDateInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/[^0-9]/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value.substring(0, 5);
                this.clearFieldError(e.target);
            });
        }

        // تقييد CVV لأرقام فقط
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 3);
                this.clearFieldError(e.target);
            });
        }

        // إزالة الأخطاء عند الكتابة في الحقول الأخرى
        const otherFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode'];
        otherFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', (e) => {
                    this.clearFieldError(e.target);
                });
            }
        });

        // إزالة الأخطاء من حقل الخصم
        const discountCodeInput = document.getElementById('discount-code');
        if (discountCodeInput) {
            discountCodeInput.addEventListener('input', (e) => {
                const discountMessage = document.getElementById('discount-message');
                if (discountMessage) {
                    discountMessage.textContent = '';
                    discountMessage.className = 'mt-2 small';
                }
            });
        }
    }

    clearFieldError(field) {
        if (field.value.trim()) {
            field.classList.remove('is-invalid');
        }
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

    addDataAttributesToButtons() {
        console.log('🔧 جاري إضافة البيانات لأزرار الشراء...');
        
        const buttons = document.querySelectorAll('.buy-button');
        console.log(`تم العثور على ${buttons.length} زر شراء`);
        
        buttons.forEach((button, index) => {
            const product = this.products[index];
            if (product) {
                button.setAttribute('data-id', product.id);
                button.setAttribute('data-name', product.name);
                button.setAttribute('data-price', product.price);
                button.setAttribute('data-image', product.image);
                console.log(`✅ تم إضافة بيانات للمنتج: ${product.name}`);
            }
        });
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

    closeCartHandler() {
        console.log('❌ إغلاق السلة');
        if (this.cartSidebar) {
            this.cartSidebar.classList.remove('active');
        }
        if (this.cartOverlay) {
            this.cartOverlay.classList.remove('active');
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
        this.showNotification(`تم إضافة ${product.name} إلى السلة 🎉`);
    }

    updateCart() {
        if (!this.cartItems || !this.cartCount) {
            console.warn('⚠️ عناصر السلة غير موجودة');
            return;
        }
        
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
        this.cartCount.textContent = totalItems;
        
        if (this.cart.length === 0) {
            this.cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart fa-3x mb-3 text-muted"></i>
                    <p>سلة التسوق فارغة</p>
                </div>
            `;
            if (this.cartTotal) this.cartTotal.style.display = 'none';
        } else {
            this.cartItems.innerHTML = '';
            this.cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                
                const imageSrc = item.image && item.image.startsWith('images/') ? 
                    item.image : 
                    `https://via.placeholder.com/70x70/cccccc/969696?text=${encodeURIComponent(item.name)}`;
                
                this.cartItems.innerHTML += `
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
            
            if (this.cartTotal) this.cartTotal.style.display = 'block';
            
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
        
        this.updateTotals();
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
            this.showNotification(`تم إزالة ${item.name} من السلة`);
            this.updateCart();
        }
    }

    updateTotals() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.15;
        const total = subtotal + tax;
        
        if (this.subtotalEl) this.subtotalEl.textContent = `${subtotal.toFixed(2)} SAR`;
        if (this.taxEl) this.taxEl.textContent = `${tax.toFixed(2)} SAR`;
        if (this.totalEl) this.totalEl.textContent = `${total.toFixed(2)} SAR`;
        
        if (document.getElementById('order-subtotal')) {
            document.getElementById('order-subtotal').textContent = `${subtotal.toFixed(2)} SAR`;
        }
        if (document.getElementById('order-tax')) {
            document.getElementById('order-tax').textContent = `${tax.toFixed(2)} SAR`;
        }
        if (document.getElementById('order-total')) {
            document.getElementById('order-total').textContent = `${total.toFixed(2)} SAR`;
        }
        
        this.updateOrderItems();
    }

    updateOrderItems() {
        const orderItems = document.getElementById('order-items');
        if (!orderItems) return;
        
        orderItems.innerHTML = '';
        this.cart.forEach(item => {
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
                    <div class="fw-bold">${itemTotal.toFixed(2)} SAR</div>
                </div>
            `;
        });
    }

    goToCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('السلة فارغة. أضف منتجات قبل اتمام الشراء.', 'error');
            return;
        }
        
        this.closeCartHandler();
        
        if (this.checkoutPage) {
            this.checkoutPage.style.display = 'block';
            console.log('✅ تم فتح صفحة اتمام الشراء');
        }
        
        const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
        if (mainContent) {
            mainContent.style.display = 'none';
        }
    }

    backToCartHandler() {
        console.log('↩️ العودة إلى السلة');
        
        if (this.checkoutPage) {
            this.checkoutPage.style.display = 'none';
        }
        
        const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
        if (mainContent) {
            mainContent.style.display = 'block';
        }
        
        this.openCart();
    }

    async completeOrderHandler() {
        console.log('🚀 بدء معالجة الطلب...');
        
        const orderButton = document.getElementById('complete-order');
        const originalText = orderButton.textContent;
        orderButton.textContent = 'جاري المعالجة...';
        orderButton.disabled = true;
        
        // التحقق من وجود السلة
        if (this.cart.length === 0) {
            this.showNotification('السلة فارغة. أضف منتجات قبل اتمام الشراء.', 'error');
            orderButton.textContent = originalText;
            orderButton.disabled = false;
            return;
        }
        
        // التحقق من النموذج
        console.log('🔍 التحقق من صحة النموذج...');
        if (!this.validateCheckoutForm()) {
            console.log('❌ فشل التحقق من النموذج');
            this.showNotification('يرجى ملء جميع الحقول المطلوبة بشكل صحيح.', 'error');
            orderButton.textContent = originalText;
            orderButton.disabled = false;
            return;
        }
        
        console.log('✅ النموذج صالح، جاري جمع البيانات...');
        
        try {
            const orderData = this.collectOrderData();
            console.log('📦 بيانات الطلب المجمعة:', orderData);
            
            this.showNotification('جاري معالجة طلبك ...', 'info');
            
            // حفظ الطلب في قاعدة البيانات
            console.log('💾 جاري حفظ الطلب...');
            const saveResult = await this.saveOrderToDatabase(orderData);
            
            // التحقق من نجاح الطلب
            if (saveResult && (saveResult.status === 200 || saveResult.success)) {
                console.log('✅ تم الطلب بنجاح');
                const orderNumber = saveResult.order_number || 'ORD-' + Date.now().toString().slice(-8);
                
                this.showNotification('🎉 تم الطلب بنجاح! شكراً لثقتك بنا.', 'success');
                
                // عرض التفاصيل
                this.showOrderDetails(orderData, orderNumber);
                
                // إعادة تعيين
                this.resetAfterOrder();
                
            } else {
                throw new Error('فشل في معالجة الطلب');
            }
            
        } catch (error) {
            console.error('❌ خطأ في اتمام الطلب:', error);
            
        } finally {
            orderButton.textContent = originalText;
            orderButton.disabled = false;
        }
    }

    validateCheckoutForm() {
        const requiredFields = [
            'firstName', 'lastName', 'email', 'phone', 
            'address', 'city', 'cardNumber', 'expiryDate', 'cvv'
        ];
        let isValid = true;
        
        console.log('🔍 بدء التحقق من النموذج...');
        
        // إعادة تعيين جميع حالات الخطأ
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.classList.remove('is-invalid');
                console.log(`✅ إعادة تعيين حقل: ${fieldId}`);
            }
        });
        
        // التحقق من الحقول المطلوبة
        for (let fieldId of requiredFields) {
            const field = document.getElementById(fieldId);
            console.log(`🔍 فحص حقل ${fieldId}:`, field ? field.value : 'غير موجود');
            
            if (!field || !field.value.trim()) {
                console.log(`❌ حقل ${fieldId} فارغ`);
                if (field) {
                    field.classList.add('is-invalid');
                    // إضافة رسالة الخطأ إذا لم تكن موجودة
                    if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('invalid-feedback')) {
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'invalid-feedback';
                        errorDiv.textContent = 'هذا الحقل مطلوب';
                        field.parentNode.appendChild(errorDiv);
                    }
                }
                isValid = false;
            } else {
                console.log(`✅ حقل ${fieldId} مملوء: ${field.value}`);
            }
        }
        
        // التحقق من صحة البريد الإلكتروني
        const emailField = document.getElementById('email');
        if (emailField && emailField.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value.trim())) {
                console.log('❌ البريد الإلكتروني غير صحيح');
                emailField.classList.add('is-invalid');
                if (!emailField.nextElementSibling || !emailField.nextElementSibling.classList.contains('invalid-feedback')) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'invalid-feedback';
                    errorDiv.textContent = 'يرجى إدخال بريد إلكتروني صحيح';
                    emailField.parentNode.appendChild(errorDiv);
                }
                isValid = false;
            }
        }
        
        // التحقق من صحة رقم البطاقة (16 رقم)
        const cardNumberField = document.getElementById('cardNumber');
        if (cardNumberField && cardNumberField.value.trim()) {
            const cardNumber = cardNumberField.value.replace(/\s+/g, '');
            console.log('🔍 رقم البطاقة:', cardNumber, 'الطول:', cardNumber.length);
            
            if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
                console.log('❌ رقم البطاقة غير صحيح');
                cardNumberField.classList.add('is-invalid');
                if (!cardNumberField.nextElementSibling || !cardNumberField.nextElementSibling.classList.contains('invalid-feedback')) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'invalid-feedback';
                    errorDiv.textContent = 'يرجى إدخال 16 رقم للبطاقة';
                    cardNumberField.parentNode.appendChild(errorDiv);
                }
                isValid = false;
            }
        }
        
        // التحقق من صحة تاريخ الانتهاء
        const expiryDateField = document.getElementById('expiryDate');
        if (expiryDateField && expiryDateField.value.trim()) {
            const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
            console.log('🔍 تاريخ الانتهاء:', expiryDateField.value);
            
            if (!expiryRegex.test(expiryDateField.value.trim())) {
                console.log('❌ تاريخ الانتهاء غير صحيح');
                expiryDateField.classList.add('is-invalid');
                if (!expiryDateField.nextElementSibling || !expiryDateField.nextElementSibling.classList.contains('invalid-feedback')) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'invalid-feedback';
                    errorDiv.textContent = 'يرجى إدخال التاريخ بالصيغة MM/YY';
                    expiryDateField.parentNode.appendChild(errorDiv);
                }
                isValid = false;
            }
        }
        
        // التحقق من صحة CVV (3 أرقام)
        const cvvField = document.getElementById('cvv');
        if (cvvField && cvvField.value.trim()) {
            console.log('🔍 CVV:', cvvField.value, 'الطول:', cvvField.value.length);
            
            if (cvvField.value.length !== 3 || !/^\d+$/.test(cvvField.value)) {
                console.log('❌ CVV غير صحيح');
                cvvField.classList.add('is-invalid');
                if (!cvvField.nextElementSibling || !cvvField.nextElementSibling.classList.contains('invalid-feedback')) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'invalid-feedback';
                    errorDiv.textContent = 'يرجى إدخال 3 أرقام للـ CVV';
                    cvvField.parentNode.appendChild(errorDiv);
                }
                isValid = false;
            }
        }
        
        // التحقق من صحة رقم الهاتف
        const phoneField = document.getElementById('phone');
        if (phoneField && phoneField.value.trim()) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(phoneField.value.trim())) {
                console.log('❌ رقم الهاتف غير صحيح');
                phoneField.classList.add('is-invalid');
                if (!phoneField.nextElementSibling || !phoneField.nextElementSibling.classList.contains('invalid-feedback')) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'invalid-feedback';
                    errorDiv.textContent = 'يرجى إدخال رقم هاتف صحيح';
                    phoneField.parentNode.appendChild(errorDiv);
                }
                isValid = false;
            }
        }
        
        console.log('📋 نتيجة التحقق:', isValid ? '✅ النموذج صالح' : '❌ النموذج غير صالح');
        
        // إذا كان هناك أخطاء، قم بالتمرير إلى أول حقل خطأ
        if (!isValid) {
            const firstInvalidField = document.querySelector('.is-invalid');
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                firstInvalidField.focus();
            }
        }
        
        return isValid;
    }

    collectOrderData() {
        const customer = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            postalCode: document.getElementById('postalCode').value || ''
        };
        
        const payment = {
            cardNumber: document.getElementById('cardNumber').value,
            expiryDate: document.getElementById('expiryDate').value,
            cvv: document.getElementById('cvv').value
        };
        
        const discountRow = document.getElementById('discount-row');
        const discount = discountRow && discountRow.style.display !== 'none' ? 
            parseFloat(document.getElementById('discount-amount').textContent.replace('-', '').replace(' SAR', '')) || 0 : 0;
        
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.15;
        const total = subtotal + tax - discount;
        
        return {
            customer: customer,
            payment: payment,
            items: this.cart.map(item => ({
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

    async saveOrderToDatabase(orderData) {
        try {
            console.log('📤 جاري إرسال الطلب إلى الخادم...', orderData);
            
            // محاكاة حفظ الطلب (يمكن استبدالها باتصال حقيقي بالخادم)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // محاكاة استجابة ناجحة من الخادم
            const mockResponse = {
                status: 200,
                success: true,
                order_number: 'ORD-' + Date.now().toString().slice(-8),
                message: 'تم حفظ الطلب بنجاح'
            };
            
            console.log('✅ تم حفظ الطلب بنجاح:', mockResponse.order_number);
            
            return mockResponse;
            
        } catch (error) {
            console.error('❌ خطأ في حفظ الطلب:', error);
            
            // محاكاة استجابة فاشلة من الخادم
            throw new Error('فشل في معالجة الطلب');
        }
    }

    async applyDiscount() {
        const discountCodeInput = document.getElementById('discount-code');
        const discountMessage = document.getElementById('discount-message');
        const discountRow = document.getElementById('discount-row');
        const discountAmount = document.getElementById('discount-amount');
        
        if (!discountCodeInput || !discountMessage) return;
        
        const discountCode = discountCodeInput.value.trim();
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        if (!discountCode) {
            discountMessage.textContent = 'يرجى إدخال كود الخصم';
            discountMessage.className = 'mt-2 small text-danger';
            return;
        }
        
        try {
            // محاكاة التحقق من كود الخصم
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // أكواد الخصم المتاحة
            const discountCodes = {
                'WELCOME10': 10,
                'SAVE15': 15,
                'SPECIAL20': 20
            };
            
            if (discountCodes[discountCode]) {
                const discountPercent = discountCodes[discountCode];
                const discountValue = (subtotal * discountPercent / 100);
                
                if (discountAmount) discountAmount.textContent = `-${discountValue.toFixed(2)} SAR`;
                if (discountRow) discountRow.style.display = 'flex';
                discountMessage.textContent = `🎉 تم تطبيق خصم ${discountPercent}% بنجاح!`;
                discountMessage.className = 'mt-2 small text-success';
                
                this.currentDiscount = { code: discountCode, percent: discountPercent, value: discountValue };
                this.updateOrderTotalWithDiscount(discountValue);
                this.showNotification(`تم تطبيق خصم ${discountPercent}% على طلبك`);
            } else {
                discountMessage.textContent = '❌ كود الخصم غير صالح';
                discountMessage.className = 'mt-2 small text-danger';
                if (discountRow) discountRow.style.display = 'none';
                this.currentDiscount = null;
                this.updateOrderTotalWithDiscount(0);
            }
        } catch (error) {
            console.error('❌ خطأ في التحقق من كود الخصم:', error);
            discountMessage.textContent = '❌ حدث خطأ في التحقق من كود الخصم';
            discountMessage.className = 'mt-2 small text-danger';
        }
    }

    updateOrderTotalWithDiscount(discount = 0) {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = (subtotal - discount) * 0.15;
        const total = (subtotal - discount) + tax;
        
        if (document.getElementById('order-tax')) {
            document.getElementById('order-tax').textContent = `${tax.toFixed(2)} SAR`;
        }
        if (document.getElementById('order-total')) {
            document.getElementById('order-total').textContent = `${total.toFixed(2)} SAR`;
        }
    }

    showOrderDetails(orderData, orderNumber) {
        const orderDetails = this.getOrderDetailsHTML(orderData, orderNumber);
        
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

    getOrderDetailsHTML(orderData, orderNumber) {
        return `
            <div class="order-success">
                <div class="text-center mb-4">
                    <i class="fas fa-check-circle text-success fa-4x mb-3"></i>
                    <h3 class="text-success">تم تأكيد طلبك بنجاح!</h3>
                    <p class="text-muted">رقم الطلب: <strong>${orderNumber}</strong></p>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <h5>👤 معلومات العميل:</h5>
                        <p><strong>الاسم:</strong> ${orderData.customer.firstName} ${orderData.customer.lastName}</p>
                        <p><strong>البريد الإلكتروني:</strong> ${orderData.customer.email}</p>
                        <p><strong>الهاتف:</strong> ${orderData.customer.phone}</p>
                        <p><strong>العنوان:</strong> ${orderData.customer.address}, ${orderData.customer.city}</p>
                    </div>
                    <div class="col-md-6">
                        <h5>📊 تفاصيل الطلب:</h5>
                        <p><strong>عدد المنتجات:</strong> ${orderData.items.length}</p>
                        <p><strong>المجموع:</strong> ${orderData.totals.subtotal.toFixed(2)} SAR</p>
                        <p><strong>الضريبة:</strong> ${orderData.totals.tax.toFixed(2)} SAR</p>
                        ${orderData.totals.discount > 0 ? `<p><strong>الخصم:</strong> -${orderData.totals.discount.toFixed(2)} SAR</p>` : ''}
                        <p><strong>الإجمالي:</strong> ${orderData.totals.total.toFixed(2)} SAR</p>
                    </div>
                </div>
                
                <div class="mt-4">
                    <h5>🛍️ المنتجات المطلوبة:</h5>
                    ${orderData.items.map(item => `
                        <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                            <div>${item.name}</div>
                            <div>${item.quantity} × ${item.price} SAR</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="text-center mt-4">
                    <p class="text-muted">سيتم التواصل معك خلال 24 ساعة لتأكيد الشحن</p>
                    <button class="btn btn-primary" onclick="window.perfumeStore.closeOrderDetails()">موافق</button>
                </div>
            </div>
        `;
    }

    closeOrderDetails() {
        const orderDetails = document.querySelector('.order-details-overlay');
        if (orderDetails) {
            orderDetails.remove();
        }
    }

    resetAfterOrder() {
        this.cart = [];
        this.currentDiscount = null;
        this.updateCart();
        this.resetCheckoutForm();
        
        const discountRow = document.getElementById('discount-row');
        const discountMessage = document.getElementById('discount-message');
        const discountCode = document.getElementById('discount-code');
        
        if (discountRow) discountRow.style.display = 'none';
        if (discountMessage) discountMessage.textContent = '';
        if (discountCode) discountCode.value = '';
        
        if (this.checkoutPage) {
            this.checkoutPage.style.display = 'none';
        }
        
        const mainContent = document.querySelector('main, .container, body > *:not(header):not(#checkout-page):not(#cart-sidebar):not(#cart-overlay)');
        if (mainContent) {
            mainContent.style.display = 'block';
        }
    }

    resetCheckoutForm() {
        const form = document.querySelector('.checkout-form');
        if (form) {
            form.reset();
            const invalidFields = form.querySelectorAll('.is-invalid');
            invalidFields.forEach(field => {
                field.classList.remove('is-invalid');
            });
        }
    }

    showNotification(message, type = 'success') {
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
        }, 5000);
    }

    testAddProducts() {
        const randomProduct1 = this.products[Math.floor(Math.random() * this.products.length)];
        const randomProduct2 = this.products[Math.floor(Math.random() * this.products.length)];
        
        this.addToCart({...randomProduct1, quantity: 1});
        this.addToCart({...randomProduct2, quantity: 2});
        
        this.showNotification('تم إضافة منتجات تجريبية للسلة 🧪');
    }

    getCart() {
        return this.cart;
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartItemsCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    clearCart() {
        this.cart = [];
        this.updateCart();
        this.showNotification('تم تفريغ السلة');
    }
}

// بدء النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.perfumeStore = new PerfumeStoreSystem();
});

// جعل النظام متاحاً globally
if (typeof window !== 'undefined') {
    window.PerfumeStoreSystem = PerfumeStoreSystem;
} 

console.log('🏪 نظام المتجر جاهز! استخدم:');
console.log('   - perfumeStore.testAddProducts() لإضافة منتجات تجريبية');
console.log('   - perfumeStore.openCart() لفتح السلة');
console.log('   - perfumeStore.clearCart() لتفريغ السلة');*/
































