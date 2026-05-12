// ========== ОТПРАВКА ЗАЯВКИ (демо-режим) ==========
// Для реальной отправки замените на Formspree (см. инструкцию выше)

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
                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const name = document.getElementById('orderName').value;
                    const phone = document.getElementById('orderPhone').value;
                    const email = document.getElementById('orderEmail').value;
                    const comment = document.getElementById('orderComment').value;
                    
                    if (!name || !phone) {
                        alert('Заполните имя и телефон');
                        return;
                    }
                    
                    if (cart.length === 0) {
                        alert('Корзина пуста');
                        return;
                    }
                    
                    const formData = { name, phone, email, comment };
                    await sendOrderToEmail(formData);
                    
                    clearCart();
                    renderCartPage();
                    alert('Спасибо! Менеджер свяжется с вами в ближайшее время.');
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
    document.getElementById('cartBtn').addEventListener('click', () => {
        navigateTo('cart');
    });

    // Делаем функции глобальными для вызова из HTML
    window.addToCart = addToCart;
    window.updateQuantity = updateQuantity;
    window.removeItem = removeItem;
    window.navigateTo = navigateTo;
    window.renderCartPage = renderCartPage;

    // Старт
    updateCartIcon();
    navigateTo('home');
});
