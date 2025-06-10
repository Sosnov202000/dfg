 // Корзина
        let cart = [];

        // DOM элементы
        const newProductsContainer = document.getElementById('new-products');
        const searchInput = document.getElementById('search');
        const cartModal = document.getElementById('cart-modal');
        const openCartBtn = document.getElementById('open-cart');
        const closeCartBtn = document.getElementById('close-cart');
        const cartItemsContainer = document.getElementById('cart-items');
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');

        // Отображение новинок
        function renderNewProducts() {
            newProductsContainer.innerHTML = '';
            
            newProducts.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    ${product.isNew ? '<span class="product-badge">Новинка</span>' : ''}
                    <img src="${product.image}" alt="${product.title}" class="product-img">
                    <div class="product-info">
                        <h3 class="product-title">${product.title}</h3>
                        <p class="product-price">${product.price.toLocaleString()} ₽</p>
                        <button class="add-to-cart" data-id="${product.id}">Добавить в корзину</button>
                    </div>
                `;
                newProductsContainer.appendChild(productCard);
            });
            
            // Добавляем обработчики событий для кнопок "Добавить в корзину"
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', addToCart);
            });
        }

        // Добавление товара в корзину
        function addToCart(e) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const product = newProducts.find(p => p.id === productId);
            
            if (!product) return;
            
            // Проверяем, есть ли уже такой товар в корзине
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }
            
            updateCart();
        }

        // Обновление корзины
        function updateCart() {
            // Обновляем счетчик корзины
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            // Обновляем содержимое корзины
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p>Ваша корзина пуста</p>';
            } else {
                cartItemsContainer.innerHTML = '';
                cart.forEach(item => {
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.innerHTML = `
                        <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                        <div class="cart-item-info">
                            <h4 class="cart-item-title">${item.title}</h4>
                            <p class="cart-item-price">${item.price.toLocaleString()} ₽</p>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                                <span>${item.quantity}</span>
                                <button class="quantity-btn plus" data-id="${item.id}">+</button>
                            </div>
                        </div>
                    `;
                    cartItemsContainer.appendChild(cartItem);
                });
                
                // Добавляем обработчики событий для кнопок +/- в корзине
                document.querySelectorAll('.quantity-btn.minus').forEach(button => {
                    button.addEventListener('click', decreaseQuantity);
                });
                
                document.querySelectorAll('.quantity-btn.plus').forEach(button => {
                    button.addEventListener('click', increaseQuantity);
                });
            }
            
            // Обновляем итоговую сумму
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = `Итого: ${total.toLocaleString()} ₽`;
        }

        // Уменьшение количества товара в корзине
        function decreaseQuantity(e) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                // Удаляем товар из корзины, если количество становится 0
                cart = cart.filter(item => item.id !== productId);
            }
            
            updateCart();
        }

        // Увеличение количества товара в корзине
        function increaseQuantity(e) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            item.quantity += 1;
            updateCart();
        }

        // Инициализация
        document.addEventListener('DOMContentLoaded', () => {
            renderNewProducts();
            
            // Обработчики событий
            openCartBtn.addEventListener('click', () => {
                cartModal.style.display = 'block';
            });
            closeCartBtn.addEventListener('click', () => {
                cartModal.style.display = 'none';
            });
            
            // Закрытие корзины при клике вне ее области
            window.addEventListener('click', (e) => {
                if (e.target === cartModal) {
                    cartModal.style.display = 'none';
                }
            });
        });
