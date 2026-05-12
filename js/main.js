// ========== ОТПРАВКА ЗАЯВКИ (демо-режим) ==========
async function sendOrderToEmail(formData) {
    console.log('Отправка заявки (демо-режим):', formData, cart);
    alert(`ДЕМО: Заявка отправлена!\n\nИмя: ${formData.name}\nТелефон: ${formData.phone}\nEmail: ${formData.email}\nТоваров: ${cart.length} шт.\nСумма: ${getCartTotal().toLocaleString()} ₽\n\nРеальная отправка заработает после настройки Formspree.`);
    return true;
}

// ========== НАВИГАЦИЯ ==========
let currentPage = 'home';

function navigateTo(page) {
    currentPage = page;
    const contentDiv = document.getElementById('page-content');
    if (page === 'home') contentDiv.innerHTML = renderHome();
    else if (page === 'catalog') contentDiv.innerHTML = renderCatalog();
    else if (page === 'cart') contentDiv.innerHTML = renderCartPage();
    else if (page === 'reviews') contentDiv.innerHTML = renderReviews();
    else if (page === 'contacts') contentDiv.innerHTML = renderContacts();
    else contentDiv.innerHTML = renderHome();
    
    if (page === 'cart') {
        setTimeout(() => {
            const form = document.getElementById('orderForm');
            if (form) {
                // Убираем старый обработчик, чтобы не дублировать
                const newForm = form.cloneNode(true);
                form.parentNode.replaceChild(newForm, form);
                
                newForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const name = document.getElementById('orderName').value;
                    const phone = document.getElementById('orderPhone').value;
                    const email = document.getElementById('orderEmail').value;
                    const comment = document.getElementById('orderComment').value;
                    
                    if (!name || !phone) {
                        showNotification('Заполните имя и телефон', true);
                        return;
                    }
                    
                    if (cart.length === 0) {
                        showNotification('Корзина пуста', true);
                        return;
                    }
                    
                    const formData = { name, phone, email, comment };
                    await sendOrderToEmail(formData);
                    
                    clearCart();
                    renderCartPage();
                    showNotification('Заявка отправлена! Менеджер свяжется с вами');
                });
            }
        }, 100);
    }
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', () => {
    // Обработка кликов по меню
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            navigateTo(page);
        });
    });

    // Обработка клика по корзине
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            navigateTo('cart');
        });
    }

    // Делаем функции глобальными для вызова из HTML (ЭТО КЛЮЧЕВОЙ МОМЕНТ!)
    window.addToCart = addToCart;
    window.updateQuantity = updateQuantity;
    window.removeItem = removeItem;
    window.navigateTo = navigateTo;
    window.renderCartPage = renderCartPage;
    window.showNotification = showNotification;

    // Старт
    updateCartIcon();
    navigateTo('home');
});
