// ========== ОТПРАВКА ЗАЯВКИ (демо-режим) ==========
async function sendOrderToEmail(formData) {
    console.log('Отправка заявки (демо-режим):', formData, cart);
    alert(`ДЕМО: Заявка отправлена!\n\nИмя: ${formData.name}\nТелефон: ${formData.phone}\nEmail: ${formData.email}\nТоваров: ${cart.length} шт.\nСумма: ${getCartTotal().toLocaleString()} ₽\n\nРеальная отправка заработает после настройки Formspree.`);
    return true;
}

// ========== ПРИВЯЗКА ОБРАБОТЧИКОВ КНОПОК КОРЗИНЫ ==========
function attachCartHandlers() {
    // Кнопки "+"
    document.querySelectorAll('.qty-plus').forEach(btn => {
        btn.onclick = () => {
            const id = parseInt(btn.getAttribute('data-id'));
            updateQuantity(id, 1);
        };
    });
    
    // Кнопки "-"
    document.querySelectorAll('.qty-minus').forEach(btn => {
        btn.onclick = () => {
            const id = parseInt(btn.getAttribute('data-id'));
            updateQuantity(id, -1);
        };
    });
    
    // Кнопки удаления
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.onclick = () => {
            const id = parseInt(btn.getAttribute('data-id'));
            removeItem(id);
        };
    });
    
    // Форма заказа
    const form = document.getElementById('orderForm');
    if (form) {
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        newForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('orderName')?.value;
            const phone = document.getElementById('orderPhone')?.value;
            const email = document.getElementById('orderEmail')?.value;
            const comment = document.getElementById('orderComment')?.value;
            
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
            document.getElementById('page-content').innerHTML = renderCartPage();
            attachCartHandlers();
            showNotification('Заявка отправлена! Менеджер свяжется с вами');
        });
    }
}

// ========== НАВИГАЦИЯ ==========
let currentPage = 'home';

function navigateTo(page) {
    currentPage = page;
    const contentDiv = document.getElementById('page-content');
    if (page === 'home') contentDiv.innerHTML = renderHome();
    else if (page === 'catalog') contentDiv.innerHTML = renderCatalog();
    else if (page === 'cart') {
        contentDiv.innerHTML = renderCartPage();
        setTimeout(() => attachCartHandlers(), 50);
    }
    else if (page === 'reviews') contentDiv.innerHTML = renderReviews();
    else if (page === 'contacts') contentDiv.innerHTML = renderContacts();
    else contentDiv.innerHTML = renderHome();
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            navigateTo(page);
        });
    });

    document.getElementById('cartBtn').addEventListener('click', () => {
        navigateTo('cart');
    });

    // Глобальные функции
    window.addToCart = addToCart;
    window.updateQuantity = updateQuantity;
    window.removeItem = removeItem;
    window.navigateTo = navigateTo;
    window.showNotification = showNotification;
    window.attachCartHandlers = attachCartHandlers;

    updateCartIcon();
    navigateTo('home');
});
