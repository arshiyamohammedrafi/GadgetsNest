// Smooth scroll for all anchors and prevent Home default
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#home') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (id.length > 1) {
      const el = document.querySelector(id);
      if (el) { 
        e.preventDefault(); 
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// Navigation links active state
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

// Filter chips and products by category/search
const productCards = document.querySelectorAll('.product-card');
const chipButtons = document.querySelectorAll('.chip');
const productSearchInput = document.querySelector('.search-box input');
let selectedCategory = 'All';

function filterProducts() {
  const searchText = productSearchInput ? productSearchInput.value.trim().toLowerCase() : '';

  productCards.forEach(card => {
    const cardCategory = card.getAttribute('data-category');
    const productName = card.querySelector('h4').textContent.toLowerCase();
    const productDetails = card.querySelector('.small').textContent.toLowerCase();
    const matchesCategory = selectedCategory === 'All' || cardCategory === selectedCategory;
    const matchesSearch =
      !searchText ||
      productName.includes(searchText) ||
      productDetails.includes(searchText) ||
      cardCategory.toLowerCase().includes(searchText);

    card.style.display = matchesCategory && matchesSearch ? 'block' : 'none';
  });
}

chipButtons.forEach(chip => {
  chip.addEventListener('click', () => {
    chipButtons.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    selectedCategory = chip.textContent.trim();
    filterProducts();
  });
});

if (productSearchInput) {
  productSearchInput.addEventListener('input', filterProducts);
}

// Shop Now button
const shopNowBtn = document.querySelector('.hero-cta .btn-primary');
if (shopNowBtn) {
  shopNowBtn.addEventListener('click', () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// Explore Deals button (now scrolls to testimonials since deals section is removed)
const exploreDealsBtn = document.querySelector('.hero-cta .btn-outline');
if (exploreDealsBtn) {
  exploreDealsBtn.addEventListener('click', () => {
    const testimonialsSection = document.querySelector('.testimonials');
    if (testimonialsSection) {
      testimonialsSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// Navbar search icon
const searchButton = document.querySelector('.nav-icons button[aria-label="Search"]');
const searchInput = document.querySelector('.search-box input');
if (searchButton && searchInput) {
  searchButton.addEventListener('click', () => {
    searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      searchInput.focus();
    }, 500);
  });
}

// Footer back to top button
const backToTopButton = document.querySelector('.back-to-top');
if (backToTopButton) {
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Shopping cart
const CART_KEY = 'gadgetsnestCart';
const WISHLIST_KEY = 'gadgetsnestWishlist';
let cart = JSON.parse(sessionStorage.getItem(CART_KEY)) || [];
let wishlist = JSON.parse(sessionStorage.getItem(WISHLIST_KEY)) || [];

const cartButton = document.querySelector('.nav-icons button[aria-label="Cart"]');
const wishlistButton = document.querySelector('.nav-icons button[aria-label="Wishlist"]');
const cartCount = document.createElement('span');
cartCount.className = 'cart-count';
const wishlistCount = document.createElement('span');
wishlistCount.className = 'wishlist-count';

document.querySelectorAll('.product-card .cta-row').forEach(row => {
  if (!row.querySelector('.wishlist-btn')) {
    row.insertAdjacentHTML('beforeend', '<button class="wishlist-btn" aria-label="Add to wishlist">♡</button>');
  }
});

const cartPanel = document.createElement('div');
cartPanel.className = 'cart-panel';
cartPanel.innerHTML = `
  <div class="cart-box">
    <div class="cart-head">
      <h3><span class="panel-title-icon">🛒</span> Your Cart</h3>
      <button class="cart-close" aria-label="Close cart">×</button>
    </div>
    <div class="cart-items"></div>
    <div class="cart-footer">
      <strong>Total: <span class="cart-total">₹0</span></strong>
      <button class="cart-buy-now">Buy Now</button>
    </div>
    <form class="checkout-form">
      <h4>Delivery Details</h4>
      <input type="text" name="customerName" placeholder="Full name" required>
      <input type="tel" name="phoneNumber" placeholder="Phone number" required>
      <textarea name="address" placeholder="Delivery address" rows="3" required></textarea>
      <div class="checkout-actions">
        <button type="button" class="checkout-cancel">Cancel</button>
        <button type="submit">Place Order</button>
      </div>
    </form>
  </div>
`;
document.body.appendChild(cartPanel);

const wishlistPanel = document.createElement('div');
wishlistPanel.className = 'wishlist-panel';
wishlistPanel.innerHTML = `
  <div class="wishlist-box">
    <div class="cart-head">
      <h3><span class="panel-title-icon">♡</span> Your Wishlist</h3>
      <button class="wishlist-close" aria-label="Close wishlist">×</button>
    </div>
    <div class="wishlist-items"></div>
  </div>
`;
document.body.appendChild(wishlistPanel);

const cartStyles = document.createElement('style');
cartStyles.textContent = `
  .nav-icons button[aria-label="Cart"],
  .nav-icons button[aria-label="Wishlist"] { position: relative; }
  .cart-count,
  .wishlist-count {
    position: absolute;
    top: 2px;
    right: 2px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 999px;
    background: #ef4444;
    color: #fff;
    display: grid;
    place-items: center;
    font-size: 0.68rem;
    font-weight: 800;
    line-height: 1;
  }
  .wishlist-count { background: #6d28d9; }
  .cart-panel,
  .wishlist-panel {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: none;
    justify-content: flex-end;
    background: rgba(15, 23, 42, 0.35);
  }
  .cart-panel.open,
  .wishlist-panel.open { display: flex; }
  .cart-box,
  .wishlist-box {
    width: min(420px, 100%);
    height: 100%;
    background: #fff;
    padding: 22px;
    box-shadow: -12px 0 30px rgba(15, 23, 42, 0.18);
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .cart-head,
  .cart-footer,
  .cart-row,
  .wishlist-row,
  .cart-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .cart-close,
  .wishlist-close,
  .qty-btn,
  .remove-btn,
  .wishlist-btn {
    border: 1px solid #e9e4f4;
    border-radius: 8px;
    background: #fff;
    color: #0f172a;
  }
  .cart-head h3 {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .panel-title-icon {
    color: #6d28d9;
    font-size: 1.35rem;
  }
  .cart-close,
  .wishlist-close {
    width: 34px;
    height: 34px;
    font-size: 1.35rem;
  }
  .cart-items {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .wishlist-items {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .cart-row,
  .wishlist-row {
    padding: 12px 0;
    border-bottom: 1px solid #e9e4f4;
    align-items: flex-start;
  }
  .cart-product-info {
    display: flex;
    gap: 10px;
    min-width: 0;
  }
  .cart-product-info img {
    width: 56px;
    height: 56px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
  }
  .cart-row h4,
  .wishlist-row h4 {
    font-size: 0.95rem;
    margin-bottom: 3px;
  }
  .cart-row p,
  .wishlist-row p {
    color: #6b7280;
    font-size: 0.84rem;
  }
  .qty-btn {
    width: 30px;
    height: 30px;
    font-weight: 800;
  }
  .cart-qty {
    min-width: 20px;
    text-align: center;
    font-weight: 700;
  }
  .remove-btn {
    padding: 7px 10px;
    color: #ef4444;
    font-weight: 700;
  }
  .wishlist-btn {
    width: 42px;
    min-width: 42px;
    font-size: 1.25rem;
    color: #6d28d9;
  }
  .wishlist-btn.active {
    background: #ede9fe;
    color: #6d28d9;
    border-color: #6d28d9;
  }
  .cart-footer {
    border-top: 1px solid #e9e4f4;
    padding-top: 16px;
    font-size: 1.05rem;
  }
  .cart-buy-now {
    padding: 10px 16px;
    border-radius: 10px;
    background: #6d28d9;
    color: #fff;
    font-weight: 700;
  }
  .cart-buy-now:hover {
    background: #5b21b6;
  }
  .checkout-form {
    display: none;
    border-top: 1px solid #e9e4f4;
    padding-top: 16px;
  }
  .checkout-form.open { display: block; }
  .checkout-form h4 {
    margin-bottom: 10px;
  }
  .checkout-form input,
  .checkout-form textarea {
    width: 100%;
    margin-bottom: 10px;
    padding: 10px 12px;
    border: 1px solid #e9e4f4;
    border-radius: 8px;
    font: inherit;
    outline: none;
  }
  .checkout-form input:focus,
  .checkout-form textarea:focus {
    border-color: #6d28d9;
  }
  .checkout-actions {
    display: flex;
    gap: 10px;
  }
  .checkout-actions button {
    flex: 1;
    padding: 10px 14px;
    border-radius: 10px;
    font-weight: 700;
  }
  .checkout-actions button[type="button"] {
    border: 1px solid #e9e4f4;
    background: #fff;
    color: #0f172a;
  }
  .checkout-actions button[type="submit"] {
    background: #6d28d9;
    color: #fff;
  }
  .empty-cart,
  .empty-wishlist {
    color: #6b7280;
    text-align: center;
    margin-top: 32px;
  }
`;
document.head.appendChild(cartStyles);

if (cartButton) {
  cartButton.appendChild(cartCount);
  cartButton.addEventListener('click', () => {
    cartPanel.classList.add('open');
  });
}

if (wishlistButton) {
  wishlistButton.appendChild(wishlistCount);
  wishlistButton.addEventListener('click', () => {
    wishlistPanel.classList.add('open');
  });
}

cartPanel.querySelector('.cart-close').addEventListener('click', () => {
  cartPanel.classList.remove('open');
});

wishlistPanel.querySelector('.wishlist-close').addEventListener('click', () => {
  wishlistPanel.classList.remove('open');
});

cartPanel.addEventListener('click', (e) => {
  if (e.target === cartPanel) {
    cartPanel.classList.remove('open');
  }
});

wishlistPanel.addEventListener('click', (e) => {
  if (e.target === wishlistPanel) {
    wishlistPanel.classList.remove('open');
  }
});

function saveCart() {
  sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function saveWishlist() {
  sessionStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
}

function getProductInfo(card) {
  const name = card.querySelector('h4').textContent.trim();
  const priceText = card.querySelector('.price').textContent;
  const price = Number(priceText.replace(/[^\d]/g, ''));
  const image = card.querySelector('.product-img img').src;
  return { name, price, image };
}

function addToCart(product) {
  const existingProduct = cart.find(item => item.name === product.name);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  renderCart();
}

function changeQuantity(name, amount) {
  const product = cart.find(item => item.name === name);
  if (!product) return;

  product.quantity += amount;
  if (product.quantity <= 0) {
    cart = cart.filter(item => item.name !== name);
  }
  saveCart();
  renderCart();
}

function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  saveCart();
  renderCart();
}

function placeOrder() {
  if (!cart.length) {
    alert('Your cart is empty. Please add products before placing an order.');
    return;
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const checkoutForm = cartPanel.querySelector('.checkout-form');
  const customerName = checkoutForm.customerName.value.trim();
  alert(`Thank you ${customerName}! Your order has been placed successfully. Total amount: ${formatPrice(totalPrice)}.`);

  cart = [];
  saveCart();
  renderCart();
  checkoutForm.reset();
  checkoutForm.classList.remove('open');
  cartPanel.classList.remove('open');
}

function toggleWishlist(product) {
  const exists = wishlist.some(item => item.name === product.name);
  if (exists) {
    wishlist = wishlist.filter(item => item.name !== product.name);
  } else {
    wishlist.push(product);
  }
  saveWishlist();
  renderWishlist();
}

function removeFromWishlist(name) {
  wishlist = wishlist.filter(item => item.name !== name);
  saveWishlist();
  renderWishlist();
}

function formatPrice(price) {
  return `₹${price.toLocaleString('en-IN')}`;
}

function renderCart() {
  const cartItems = cartPanel.querySelector('.cart-items');
  const cartTotal = cartPanel.querySelector('.cart-total');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCount.textContent = totalItems;
  cartCount.style.display = totalItems ? 'grid' : 'none';
  cartTotal.textContent = formatPrice(totalPrice);

  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-row">
      <div class="cart-product-info">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h4>${item.name}</h4>
          <p>${formatPrice(item.price)} each</p>
        </div>
      </div>
      <div class="cart-actions">
        <button class="qty-btn" data-action="decrease" data-name="${item.name}">-</button>
        <span class="cart-qty">${item.quantity}</span>
        <button class="qty-btn" data-action="increase" data-name="${item.name}">+</button>
        <button class="remove-btn" data-action="remove" data-name="${item.name}">Remove</button>
      </div>
    </div>
  `).join('');
}

function renderWishlist() {
  const wishlistItems = wishlistPanel.querySelector('.wishlist-items');
  const totalItems = wishlist.length;

  wishlistCount.textContent = totalItems;
  wishlistCount.style.display = totalItems ? 'grid' : 'none';

  document.querySelectorAll('.product-card').forEach(card => {
    const name = card.querySelector('h4').textContent.trim();
    const button = card.querySelector('.wishlist-btn');
    const isSaved = wishlist.some(item => item.name === name);
    if (button) {
      button.classList.toggle('active', isSaved);
      button.textContent = isSaved ? '♥' : '♡';
    }
  });

  if (!wishlist.length) {
    wishlistItems.innerHTML = '<p class="empty-wishlist">Your wishlist is empty.</p>';
    return;
  }

  wishlistItems.innerHTML = wishlist.map(item => `
    <div class="wishlist-row">
      <div class="cart-product-info">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h4>${item.name}</h4>
          <p>${formatPrice(item.price)}</p>
        </div>
      </div>
      <div class="cart-actions">
        <button class="qty-btn" data-action="wishlist-to-cart" data-name="${item.name}">+</button>
        <button class="remove-btn" data-action="wishlist-remove" data-name="${item.name}">Remove</button>
      </div>
    </div>
  `).join('');
}

document.querySelectorAll('.product-card .btn-primary, .product-card .icon-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    addToCart(getProductInfo(card));
    cartPanel.classList.add('open');
  });
});

document.querySelectorAll('.product-card .wishlist-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    toggleWishlist(getProductInfo(card));
  });
});

cartPanel.addEventListener('click', (e) => {
  const actionButton = e.target.closest('[data-action]');
  if (!actionButton) return;

  const name = actionButton.dataset.name;
  if (actionButton.dataset.action === 'increase') changeQuantity(name, 1);
  if (actionButton.dataset.action === 'decrease') changeQuantity(name, -1);
  if (actionButton.dataset.action === 'remove') removeFromCart(name);
});

cartPanel.querySelector('.cart-buy-now').addEventListener('click', () => {
  if (!cart.length) {
    alert('Your cart is empty. Please add products before placing an order.');
    return;
  }
  cartPanel.querySelector('.checkout-form').classList.add('open');
});

cartPanel.querySelector('.checkout-cancel').addEventListener('click', () => {
  const checkoutForm = cartPanel.querySelector('.checkout-form');
  checkoutForm.reset();
  checkoutForm.classList.remove('open');
});

cartPanel.querySelector('.checkout-form').addEventListener('submit', (e) => {
  e.preventDefault();
  placeOrder();
});

wishlistPanel.addEventListener('click', (e) => {
  const actionButton = e.target.closest('[data-action]');
  if (!actionButton) return;

  const name = actionButton.dataset.name;
  const product = wishlist.find(item => item.name === name);
  if (actionButton.dataset.action === 'wishlist-to-cart' && product) {
    addToCart(product);
    wishlistPanel.classList.remove('open');
    cartPanel.classList.add('open');
  }
  if (actionButton.dataset.action === 'wishlist-remove') removeFromWishlist(name);
});

renderCart();
renderWishlist();

// Contact form
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = form.querySelector('input[type="text"]');
    const name = nameInput ? nameInput.value.trim() : '';
    alert(`Hello ${name}, your information has sent.`);
    form.reset();
  });
}
