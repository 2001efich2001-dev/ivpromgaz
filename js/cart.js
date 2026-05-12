// ========== КОРЗИНА ==========
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    if (typeof updateCartIcon === 'function') updateCartIcon();
}

function updateCartIcon() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) cartBtn.innerHTML = `🛒 Корзина (${totalItems})`;
}

// Красивое уведомление вместо alert
function showNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${isError ? '#e53e3e' : '#2b9c5c'};
        color: white;
        padding: 12px 24px;
        border-radius: 40px;
        font-weight: 500;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        transition: opacity 0.3s;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

// Добавляем стили для уведомления (один раз)
if (!document.querySelector('#notification-style')) {
    const style = document.createElement('style');
    style.id = 'notification-style';
    style.textContent = `
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
    document.head.appendChild(style);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ 
            id: product.id, 
            name: product.name, 
            price: product.price, 
            quantity: 1 
        });
    }
    saveCart();
    
    // === ВИЗУАЛЬНЫЕ ЭФФЕКТЫ ===
    
    // 1. Вспышка на карточке товара
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const btn = card.querySelector(`button[onclick*="addToCart(${productId})"]`);
        if (btn) {
            card.classList.add('flash');
            setTimeout(() => card.classList.remove('flash'), 500);
        }
    });
    
    // 2. Анимация иконки корзины
    const cartIcon = document.getElementById('cartBtn');
    if (cartIcon) {
        cartIcon.classList.add('bump');
        setTimeout(() => cartIcon.classList.remove('bump'), 300);
    }
    
    // 3. Красивое уведомление
    showNotification(`${product.name} добавлен в корзину`);
}

function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
            showNotification(`${item.name} удалён из корзины`, true);
        }
    }
    saveCart();
    if (typeof renderCartPage === 'function') renderCartPage();
}

function removeItem(productId) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        cart = cart.filter(i => i.id !== productId);
        saveCart();
        if (typeof renderCartPage === 'function') renderCartPage();
        showNotification(`${item.name} удалён из корзины`, true);
    }
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function clearCart() {
    cart = [];
    saveCart();
}
