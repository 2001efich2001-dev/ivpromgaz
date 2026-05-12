// ========== ОТПРАВКА ЗАЯВКИ (демо-режим) ==========
// ========== ОТПРАВКА ЗАЯВКИ ЧЕРЕЗ FORMSUBMIT ==========
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/2001roker@mail.ru'; // ЗАМЕНИТЕ!

async function sendOrderToEmail(formData) {
    // Формируем список товаров для письма
    const orderItems = cart.map(item => 
        `${item.name} x${item.quantity} = ${(item.price * item.quantity).toLocaleString()} ₽`
    ).join('\n');
    
    const total = getCartTotal().toLocaleString();
    
    // Данные для отправки
    const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: `📦 НОВАЯ ЗАЯВКА С САЙТА АЗГС\n\n👤 Имя: ${formData.name}\n📞 Телефон: ${formData.phone}\n✉️ Email: ${formData.email || 'не указан'}\n💬 Комментарий: ${formData.comment || 'нет'}\n\n🛒 Состав заказа:\n${orderItems}\n\n💰 Итого: ${total} ₽`,
        _subject: `Заявка с сайта АЗГС от ${formData.name}`,
        _captcha: 'false'  // отключаем капчу для простоты
    };

    try {
        const response = await fetch(FORM_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            return true;
        } else {
            throw new Error('Ошибка отправки');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        throw error;
    }
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
    // Обработка кликов по меню И логотипу
    document.querySelectorAll('.nav-links a, .logo-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            if (page) navigateTo(page);
        });
    });

    // Обработка клика по корзине
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            navigateTo('cart');
        });
    }

    // Глобальные функции
    window.addToCart = addToCart;
    window.updateQuantity = updateQuantity;
    window.removeItem = removeItem;
    window.navigateTo = navigateTo;
    window.showNotification = showNotification;

    updateCartIcon();
    navigateTo('home');
});
