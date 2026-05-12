function renderHome() {
    return `
        <div class="section">
            <h1 class="section-title">Оснащение АЗГС под ключ</h1>
            <p style="text-align:center; font-size:18px;">Компрессоры, газгольдеры, испарители, запорная арматура. Монтаж и сервис в Ивановской области.</p>
            <div style="margin-top:40px; text-align:center;">
                <button class="btn" style="width:auto; padding:12px 40px;" onclick="navigateTo('catalog')">Перейти в каталог</button>
            </div>
        </div>
    `;
}

function renderCatalog() {
    let html = `<div class="section"><h2 class="section-title">Каталог оборудования</h2><div class="catalog-grid">`;
    products.forEach(p => {
        const imgContent = p.img ? `<img src="${p.img}" alt="${p.name}">` : `<div style="padding:40px;">🖼️ ${p.name}</div>`;
        html += `
            <div class="product-card" data-id="${p.id}">
                <div class="product-img">${imgContent}</div>
                <div class="product-info">
                    <div class="product-title">${p.name}</div>
                    <div class="product-price">${p.price.toLocaleString()} ₽</div>
                    <div class="product-desc">${p.desc}</div>
                    <button class="btn add-to-cart-btn" data-id="${p.id}">Добавить в корзину</button>
                </div>
            </div>
        `;
    });
    html += `</div></div>`;
    return html;
}

function renderCartPage() {
    if (cart.length === 0) {
        return `
            <div class="section">
                <h2 class="section-title">Корзина</h2>
                <div class="cart-empty">
                    🛒 Корзина пуста<br><br>
                    <button class="btn" style="width:auto; padding:12px 30px;" onclick="navigateTo('catalog')">Перейти в каталог</button>
                </div>
            </div>
        `;
    }

    let itemsHtml = `
        <div class="section">
            <h2 class="section-title">Корзина</h2>
            <div class="cart-items">
                <div class="cart-item cart-item-header">
                    <span>Товар</span>
                    <span>Цена</span>
                    <span>Количество</span>
                    <span></span>
                </div>
    `;
    
    cart.forEach(item => {
        itemsHtml += `
            <div class="cart-item">
                <span><strong>${item.name}</strong></span>
                <span>${item.price.toLocaleString()} ₽</span>
                <div class="cart-item-quantity">
                    <button class="qty-minus" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-plus" data-id="${item.id}">+</button>
                </div>
                <button class="cart-item-remove" data-id="${item.id}">✕</button>
            </div>
        `;
    });
    
    itemsHtml += `</div>`;
    itemsHtml += `<div class="cart-total">Итого: ${getCartTotal().toLocaleString()} ₽</div>`;
    
    itemsHtml += `
        <div class="order-form">
            <h3 style="margin-bottom:20px;">Оформить заявку</h3>
            <form id="orderForm">
                <div class="form-group">
                    <label>Имя *</label>
                    <input type="text" id="orderName" required>
                </div>
                <div class="form-group">
                    <label>Телефон *</label>
                    <input type="tel" id="orderPhone" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="orderEmail">
                </div>
                <div class="form-group">
                    <label>Комментарий к заказу</label>
                    <textarea id="orderComment" rows="3"></textarea>
                </div>
                <button type="submit" class="btn" style="width:auto; padding:12px 30px;">📩 Отправить заявку</button>
            </form>
        </div>
    `;
    
    return itemsHtml;
}

function renderReviews() {
    return `
        <div class="section">
            <h2 class="section-title">Отзывы клиентов</h2>
            <div class="reviews-grid">
                <div class="review-card"><div class="review-name">ООО "ГазРесурс"</div><div class="review-text">Отличное оборудование, работаем 2 года без нареканий.</div></div>
                <div class="review-card"><div class="review-name">ИП Смирнов</div><div class="review-text">Быстрая доставка в Шую, помогли с пусконаладкой.</div></div>
                <div class="review-card"><div class="review-name">АЗГС "Лидер"</div><div class="review-text">Профессиональный подход. Рекомендуем.</div></div>
            </div>
        </div>
    `;
}

function renderContacts() {
    return `
        <div class="section">
            <h2 class="section-title">Контакты</h2>
            <div class="contacts-wrapper">
                <div class="contact-info">
                    <p><strong>📞 Телефон:</strong> +7 (999) 123-45-67</p>
                    <p><strong>✉️ Email:</strong> sales@azgs-msk.ru</p>
                    <p><strong>📍 Адрес:</strong> Ивановская область, г. Шуя, ул. Промышленная, д. 8</p>
                    <p><strong>⏰ Режим работы:</strong> Пн-Пт 9:00–18:00</p>
                </div>
                <div class="map">
                    <iframe src="https://yandex.ru/map-widget/v1/?ll=41.388634,56.850417&z=12&pt=41.388634,56.850417" allowfullscreen></iframe>
                </div>
            </div>
        </div>
    `;
}
