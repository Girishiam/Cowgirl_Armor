/* Global Javascript for Cowgirl Armor Theme */
/* Enhanced with Dawn-inspired features */

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

// Debounce function to limit how often a function can fire
function debounce(fn, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
}

// Throttle function for scroll events
function throttle(fn, wait) {
  let time = Date.now();
  return function (...args) {
    if ((time + wait - Date.now()) < 0) {
      fn.apply(this, args);
      time = Date.now();
    }
  };
}

// Fetch configuration helper
function fetchConfig(type = 'json') {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': `application/${type}` }
  };
}

// Serialize form data
function serializeForm(form) {
  const formData = new FormData(form);
  const obj = {};
  for (let [key, value] of formData.entries()) {
    obj[key] = value;
  }
  return obj;
}

// Focus trap for modals and drawers
class FocusTrap {
  constructor(container) {
    this.container = container;
    this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  }

  activate() {
    const focusable = this.container.querySelectorAll(this.focusableElements);
    this.firstFocusable = focusable[0];
    this.lastFocusable = focusable[focusable.length - 1];

    this.container.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.firstFocusable?.focus();
  }

  deactivate() {
    this.container.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  handleKeyDown(e) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === this.firstFocusable) {
        this.lastFocusable?.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === this.lastFocusable) {
        this.firstFocusable?.focus();
        e.preventDefault();
      }
    }
  }
}

/* ============================================
   CART FUNCTIONALITY
   ============================================ */

class CartManager {
  constructor() {
    this.cart = null;
    this.init();
  }

  async init() {
    await this.getCart();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Add to cart forms
    document.querySelectorAll('[data-add-to-cart-form]').forEach(form => {
      form.addEventListener('submit', this.handleAddToCart.bind(this));
    });

    // Cart update buttons
    document.querySelectorAll('[data-cart-update]').forEach(button => {
      button.addEventListener('click', this.handleCartUpdate.bind(this));
    });

    // Cart remove buttons
    document.querySelectorAll('[data-cart-remove]').forEach(button => {
      button.addEventListener('click', this.handleCartRemove.bind(this));
    });
  }

  async getCart() {
    try {
      const response = await fetch('/cart.js');
      this.cart = await response.json();
      this.updateCartCount();
      return this.cart;
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }

  async addToCart(items) {
    try {
      const response = await fetch('/cart/add.js', {
        ...fetchConfig(),
        body: JSON.stringify({ items })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.description || 'Failed to add to cart');
      }

      this.cart = await response.json();
      this.updateCartCount();
      this.showCartNotification();
      return this.cart;
    } catch (error) {
      console.error('Error adding to cart:', error);
      this.showError(error.message);
      throw error;
    }
  }

  async updateCart(key, quantity) {
    try {
      const response = await fetch('/cart/change.js', {
        ...fetchConfig(),
        body: JSON.stringify({ id: key, quantity })
      });

      this.cart = await response.json();
      this.updateCartCount();
      return this.cart;
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  }

  async removeFromCart(key) {
    return this.updateCart(key, 0);
  }

  handleAddToCart(e) {
    e.preventDefault();
    const form = e.target;
    const formData = serializeForm(form);

    const items = [{
      id: formData.id,
      quantity: parseInt(formData.quantity) || 1
    }];

    this.addToCart(items);
  }

  handleCartUpdate(e) {
    const button = e.target.closest('[data-cart-update]');
    const key = button.dataset.cartUpdate;
    const input = button.closest('.cart-item').querySelector('[data-quantity-input]');
    const quantity = parseInt(input.value);

    this.updateCart(key, quantity);
  }

  handleCartRemove(e) {
    const button = e.target.closest('[data-cart-remove]');
    const key = button.dataset.cartRemove;

    this.removeFromCart(key);
  }

  updateCartCount() {
    const countElements = document.querySelectorAll('[data-cart-count]');
    const count = this.cart?.item_count || 0;

    countElements.forEach(el => {
      el.textContent = count;
      el.classList.toggle('hidden', count === 0);
    });
  }

  showCartNotification() {
    // Trigger custom event for notification
    document.dispatchEvent(new CustomEvent('cart:item-added', { detail: this.cart }));
  }

  showError(message) {
    // Trigger custom event for error notification
    document.dispatchEvent(new CustomEvent('cart:error', { detail: { message } }));
  }
}

/* ============================================
   PRODUCT VARIANT SELECTOR
   ============================================ */

class VariantSelector {
  constructor(element) {
    this.element = element;
    this.productData = JSON.parse(element.querySelector('[data-product-json]')?.textContent || '{}');
    this.variantData = this.productData.variants || [];
    this.currentVariant = this.variantData[0];

    this.setupEventListeners();
    this.updateUI();
  }

  setupEventListeners() {
    this.element.querySelectorAll('[data-variant-option]').forEach(option => {
      option.addEventListener('change', this.handleOptionChange.bind(this));
    });
  }

  handleOptionChange() {
    const selectedOptions = Array.from(
      this.element.querySelectorAll('[data-variant-option]')
    ).map(select => select.value);

    this.currentVariant = this.variantData.find(variant => {
      return variant.options.every((option, index) => option === selectedOptions[index]);
    });

    this.updateUI();
  }

  updateUI() {
    if (!this.currentVariant) return;

    // Update price
    const priceElement = this.element.querySelector('[data-product-price]');
    if (priceElement && this.currentVariant.price) {
      priceElement.textContent = this.formatMoney(this.currentVariant.price);
    }

    // Update compare at price
    const compareElement = this.element.querySelector('[data-product-compare-price]');
    if (compareElement) {
      if (this.currentVariant.compare_at_price) {
        compareElement.textContent = this.formatMoney(this.currentVariant.compare_at_price);
        compareElement.classList.remove('hidden');
      } else {
        compareElement.classList.add('hidden');
      }
    }

    // Update variant ID in form
    const variantInput = this.element.querySelector('[name="id"]');
    if (variantInput) {
      variantInput.value = this.currentVariant.id;
    }

    // Update availability
    const addButton = this.element.querySelector('[data-add-to-cart-button]');
    if (addButton) {
      addButton.disabled = !this.currentVariant.available;
      addButton.textContent = this.currentVariant.available ? 'Add to Cart' : 'Sold Out';
    }

    // Trigger custom event
    this.element.dispatchEvent(new CustomEvent('variant:changed', {
      detail: { variant: this.currentVariant }
    }));
  }

  formatMoney(cents) {
    return '$' + (cents / 100).toFixed(2);
  }
}

/* ============================================
   QUANTITY SELECTOR
   ============================================ */

class QuantitySelector {
  constructor(element) {
    this.element = element;
    this.input = element.querySelector('[data-quantity-input]');
    this.decreaseBtn = element.querySelector('[data-quantity-decrease]');
    this.increaseBtn = element.querySelector('[data-quantity-increase]');

    this.min = parseInt(this.input.min) || 1;
    this.max = parseInt(this.input.max) || 999;

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.decreaseBtn?.addEventListener('click', () => this.decrease());
    this.increaseBtn?.addEventListener('click', () => this.increase());
    this.input?.addEventListener('change', () => this.handleInputChange());
  }

  decrease() {
    const currentValue = parseInt(this.input.value);
    if (currentValue > this.min) {
      this.input.value = currentValue - 1;
      this.triggerChange();
    }
  }

  increase() {
    const currentValue = parseInt(this.input.value);
    if (currentValue < this.max) {
      this.input.value = currentValue + 1;
      this.triggerChange();
    }
  }

  handleInputChange() {
    let value = parseInt(this.input.value);
    if (isNaN(value) || value < this.min) value = this.min;
    if (value > this.max) value = this.max;
    this.input.value = value;
    this.triggerChange();
  }

  triggerChange() {
    this.input.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

/* ============================================
   PREDICTIVE SEARCH
   ============================================ */

class PredictiveSearch {
  constructor(element) {
    this.element = element;
    this.input = element.querySelector('[data-search-input]');
    this.results = element.querySelector('[data-search-results]');
    this.minChars = 3;

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.input?.addEventListener('input', debounce(this.handleInput.bind(this), 300));
    this.input?.addEventListener('focus', () => this.showResults());

    document.addEventListener('click', (e) => {
      if (!this.element.contains(e.target)) {
        this.hideResults();
      }
    });
  }

  async handleInput() {
    const query = this.input.value.trim();

    if (query.length < this.minChars) {
      this.hideResults();
      return;
    }

    try {
      const response = await fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=4`);
      const data = await response.json();
      this.renderResults(data.resources.results.products || []);
    } catch (error) {
      console.error('Search error:', error);
    }
  }

  renderResults(products) {
    if (!products.length) {
      this.hideResults();
      return;
    }

    this.results.innerHTML = products.map(product => `
      <a href="${product.url}" class="search-result">
        ${product.featured_image ? `<img src="${product.featured_image}" alt="${product.title}" class="search-result__image">` : ''}
        <div class="search-result__content">
          <div class="search-result__title">${product.title}</div>
          <div class="search-result__price">${this.formatMoney(product.price)}</div>
        </div>
      </a>
    `).join('');

    this.showResults();
  }

  showResults() {
    this.results?.classList.remove('hidden');
  }

  hideResults() {
    this.results?.classList.add('hidden');
  }

  formatMoney(cents) {
    return '$' + (cents / 100).toFixed(2);
  }
}

/* ============================================
   INITIALIZATION
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileDrawer = document.querySelector('.mobile-drawer');

  // Add scrolled class to header when user scrolls down
  if (header) {
    const parent = header.parentElement;
    let spacer = parent.querySelector('.header-spacer');
    if (!spacer) {
      spacer = document.createElement('div');
      spacer.className = 'header-spacer';
      spacer.style.display = 'none';
      parent.insertBefore(spacer, header);
    }

    const handleScroll = throttle(() => {
      if (window.scrollY > 50) {
        if (!header.classList.contains('site-header--scrolled')) {
          spacer.style.height = header.offsetHeight + 'px';
          spacer.style.display = 'block';
          header.classList.add('site-header--scrolled');
        }
      } else {
        if (header.classList.contains('site-header--scrolled')) {
          spacer.style.display = 'none';
          header.classList.remove('site-header--scrolled');
        }
      }
    }, 100);

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
  }

  // Toggle mobile drawer with focus trap
  if (mobileMenuBtn && mobileDrawer) {
    const focusTrap = new FocusTrap(mobileDrawer);

    mobileMenuBtn.addEventListener('click', () => {
      const isActive = mobileDrawer.classList.contains('mobile-drawer--active');

      if (isActive) {
        mobileDrawer.classList.remove('mobile-drawer--active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = ''; // Restore scrolling
        focusTrap.deactivate();
      } else {
        mobileDrawer.classList.add('mobile-drawer--active');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        focusTrap.activate();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('mobile-drawer--active')) {
        mobileDrawer.classList.remove('mobile-drawer--active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        focusTrap.deactivate();
        mobileMenuBtn.focus();
      }
    });
  }

  // Initialize Cart Manager
  const cartManager = new CartManager();

  // Initialize Variant Selectors
  document.querySelectorAll('[data-product-form]').forEach(form => {
    new VariantSelector(form);
  });

  // Initialize Quantity Selectors
  document.querySelectorAll('[data-quantity-selector]').forEach(selector => {
    new QuantitySelector(selector);
  });

  // Initialize Predictive Search
  document.querySelectorAll('[data-predictive-search]').forEach(search => {
    new PredictiveSearch(search);
  });

  // Handle announcement bar close
  const announcementClose = document.querySelector('.announcement-bar__close');
  if (announcementClose) {
    announcementClose.addEventListener('click', () => {
      const bar = announcementClose.closest('.announcement-bar');
      bar.style.display = 'none';
      localStorage.setItem('announcement-bar-closed', 'true');
    });

    // Check if previously closed
    if (localStorage.getItem('announcement-bar-closed') === 'true') {
      const bar = document.querySelector('.announcement-bar');
      if (bar) bar.style.display = 'none';
    }
  }

  // Accessible links - open in new tab
  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    if (!link.getAttribute('rel')?.includes('noopener')) {
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
});
