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

    // ========== МОДАЛЬНОЕ ОКНО ==========
const modal = document.getElementById('productModal');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalFullDesc = document.getElementById('modalFullDesc');
const modalImage = document.getElementById('modalImage');
const modalAddToCart = document.getElementById('modalAddToCart');
let currentModalProduct = null;

// Открыть модалку
function openModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    currentModalProduct = product;
    modalTitle.textContent = product.name;
    modalPrice.textContent = `${product.price.toLocaleString()} ₽`;
    
    // Полное описание с характеристиками
    modalFullDesc.innerHTML = `
        <p><strong>📋 Подробное описание:</strong></p>
        <p>${product.fullDesc || product.desc}</p>
        <p style="margin-top: 10px;"><strong>📦 Артикул:</strong> АЗГС-${product.id}</p>
        <p><strong>🚚 Доставка:</strong> по всей России</p>
        <p><strong>🔧 Гарантия:</strong> 12 месяцев</p>
    `;
    
    // Фото (если есть реальное)
    if (product.img) {
        modalImage.src = product.img;
        modalImage.alt = product.name;
    } else {
        modalImage.parentElement.innerHTML = `<div style="padding:40px;">🖼️ ${product.imgPlaceholder}</div>`;
        // восстанавливаем структуру потом
        setTimeout(() => {
            if (modalImage) modalImage.style.display = 'none';
        }, 0);
    }
    
    modal.classList.add('active');
}

// Закрыть модалку
function closeModal() {
    modal.classList.remove('active');
    currentModalProduct = null;
}

// Обработчики
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
        // Не открывать модалку, если кликнули на кнопку "Добавить в корзину"
        if (e.target.classList.contains('add-to-cart-btn')) return;
        const id = parseInt(card.getAttribute('data-id'));
        openModal(id);
    });
});

document.querySelector('.modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Кнопка "В корзину" внутри модалки
modalAddToCart.addEventListener('click', () => {
    if (currentModalProduct) {
        addToCart(currentModalProduct.id);
        closeModal();
    }
});
});
