// ========== ОТПРАВКА ЗАЯВКИ ==========
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/2001roker@mail.ru'; // ЗАМЕНИТЕ

async function sendOrderToEmail(formData) {
    const orderItems = cart.map(item => 
        `${item.name} x${item.quantity} = ${(item.price * item.quantity).toLocaleString()} ₽`
    ).join('\n');
    
    const total = getCartTotal().toLocaleString();
    
    const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: `НОВАЯ ЗАЯВКА С САЙТА АЗГС\n\nИмя: ${formData.name}\nТелефон: ${formData.phone}\nEmail: ${formData.email || 'не указан'}\nКомментарий: ${formData.comment || 'нет'}\n\nСостав заказа:\n${orderItems}\n\nИтого: ${total} ₽`,
        _subject: `Заявка с сайта АЗГС от ${formData.name}`,
        _captcha: 'false'
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
        return response.ok;
    } catch (error) {
        console.error('Ошибка:', error);
        return false;
    }
}

// ========== ПРИВЯЗКА ОБРАБОТЧИКОВ ==========
function attachCartHandlers() {
    document.querySelectorAll('.qty-plus').forEach(btn => {
        btn.onclick = () => updateQuantity(parseInt(btn.dataset.id), 1);
    });
    document.querySelectorAll('.qty-minus').forEach(btn => {
        btn.onclick = () => updateQuantity(parseInt(btn.dataset.id), -1);
    });
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.onclick = () => removeItem(parseInt(btn.dataset.id));
    });
    
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
            
            await sendOrderToEmail({ name, phone, email, comment });
            clearCart();
            document.getElementById('page-content').innerHTML = renderCartPage();
            attachCartHandlers();
            showNotification('Заявка отправлена!');
        });
    }
}

function attachCatalogHandlers() {
    // Клик на карточку (открыть модалку)
    document.querySelectorAll('.product-card').forEach(card => {
        card.onclick = (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) return;
            const id = parseInt(card.dataset.id);
            openModal(id);
        };
    });
    
    // Кнопки "Добавить в корзину"
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            addToCart(parseInt(btn.dataset.id));
        };
    });
}

// ========== МОДАЛЬНОЕ ОКНО ==========
function openModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalPrice').textContent = `${product.price.toLocaleString()} ₽`;
    document.getElementById('modalFullDesc').innerHTML = product.fullDesc || product.desc;
    
    const modalImg = document.getElementById('modalImage');
    if (product.img) {
        modalImg.src = product.img;
        modalImg.style.display = 'block';
        modalImg.parentElement.innerHTML = `<img id="modalImage" src="${product.img}" alt="${product.name}" style="max-width:100%; max-height:300px; border-radius:20px;">`;
    } else {
        modalImg.style.display = 'none';
        modalImg.parentElement.innerHTML = `<div style="padding:40px;">🖼️ ${product.name}</div>`;
    }
    
    window.currentModalProduct = product;
    document.getElementById('productModal').classList.add('active');
}

function closeModal() {
    document.getElementById('productModal').classList.remove('active');
}

// ========== НАВИГАЦИЯ ==========
let currentPage = 'home';

function navigateTo(page) {
    currentPage = page;
    const contentDiv = document.getElementById('page-content');
    if (page === 'home') contentDiv.innerHTML = renderHome();
    else if (page === 'catalog') {
        contentDiv.innerHTML = renderCatalog();
        setTimeout(attachCatalogHandlers, 50);
    }
    else if (page === 'cart') {
        contentDiv.innerHTML = renderCartPage();
        setTimeout(attachCartHandlers, 50);
    }
    else if (page === 'reviews') contentDiv.innerHTML = renderReviews();
    else if (page === 'contacts') contentDiv.innerHTML = renderContacts();
    else contentDiv.innerHTML = renderHome();
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-links a, .logo-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            if (page) navigateTo(page);
        });
    });
    
    document.getElementById('cartBtn').onclick = () => navigateTo('cart');
    
    // Модалка: закрытие
    document.querySelector('.modal-close').onclick = closeModal;
    document.getElementById('productModal').onclick = (e) => {
        if (e.target === document.getElementById('productModal')) closeModal();
    };
    document.getElementById('modalAddToCart').onclick = () => {
        if (window.currentModalProduct) {
            addToCart(window.currentModalProduct.id);
            closeModal();
        }
    };
    
    window.addToCart = addToCart;
    window.updateQuantity = updateQuantity;
    window.removeItem = removeItem;
    window.navigateTo = navigateTo;
    window.showNotification = showNotification;
    
    updateCartIcon();
    navigateTo('home');
});
