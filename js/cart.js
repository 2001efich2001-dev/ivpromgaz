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
    alert(`${product.name} добавлен в корзину`);
}

function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
    }
    saveCart();
    if (typeof renderCartPage === 'function') renderCartPage();
}

function removeItem(productId) {
    cart = cart.filter(i => i.id !== productId);
    saveCart();
    if (typeof renderCartPage === 'function') renderCartPage();
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function clearCart() {
    cart = [];
    saveCart();
}
