/* Global Javascript for Cowgirl Armor Theme */

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

function debounce(fn, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
}

function throttle(fn, wait) {
  let time = Date.now();
  return function (...args) {
    if ((time + wait - Date.now()) < 0) {
      fn.apply(this, args);
      time = Date.now();
    }
  };
}

function fetchConfig(type = 'json') {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': `application/${type}` }
  };
}

function serializeForm(form) {
  const formData = new FormData(form);
  const obj = {};
  for (let [key, value] of formData.entries()) { obj[key] = value; }
  return obj;
}

/* ============================================
   FOCUS TRAP
   ============================================ */
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
   CART MANAGER
   Bridges legacy data-attribute selectors to
   the Cart object defined in cart.js.
   cart.js must load before main.js (already
   set up in theme.liquid).
   ============================================ */
class CartManager {
  constructor() {
    this.setupEventListeners();
    this.syncCount();
  }

  setupEventListeners() {
    // Legacy: data-add-to-cart-form (NOT data-atc-form — cart.js handles that)
    document.querySelectorAll('[data-add-to-cart-form]').forEach(form => {
      form.addEventListener('submit', this.handleAddToCart.bind(this));
    });

    document.querySelectorAll('[data-cart-update]').forEach(button => {
      button.addEventListener('click', this.handleCartUpdate.bind(this));
    });

    document.querySelectorAll('[data-cart-remove]').forEach(button => {
      button.addEventListener('click', this.handleCartRemove.bind(this));
    });

    // Keep all [data-cart-count] elements in sync with cart:updated events
    document.addEventListener('cart:updated', (e) => {
      const count = e.detail?.item_count || 0;
      document.querySelectorAll('[data-cart-count]').forEach(el => {
        el.textContent = count;
        el.classList.toggle('hidden', count === 0);
      });
    });
  }

  async syncCount() {
    try {
      const cart = await Cart.fetchCart();
      Cart.dispatchUpdate(cart);
    } catch (e) {
      // Cart not yet available — safe to ignore on non-cart pages
    }
  }

  async handleAddToCart(e) {
    e.preventDefault();
    const form = e.target;
    const data = serializeForm(form);
    const variantId = data.id;
    const quantity  = parseInt(data.quantity) || 1;
    if (!variantId) return;

    const btn = form.querySelector('[data-add-to-cart-button]');
    if (btn) { btn.disabled = true; btn.textContent = 'Adding...'; }

    try {
      const item = await Cart.addItem(variantId, quantity);
      const cart = await Cart.fetchCart();
      Cart.dispatchUpdate(cart);
      document.dispatchEvent(new CustomEvent('cart:item-added', { detail: item }));

      const drawer = document.querySelector('cart-drawer');
      const notif  = document.querySelector('cart-notification');
      if (drawer) drawer.open();
      else if (notif) notif.show(item);

      if (btn) {
        btn.textContent = 'Added!';
        setTimeout(() => { btn.disabled = false; btn.textContent = 'Add to Cart'; }, 2000);
      }
    } catch (err) {
      if (btn) { btn.disabled = false; btn.textContent = 'Add to Cart'; }
      console.error('Add to cart error:', err.message);
    }
  }

  async handleCartUpdate(e) {
    const button = e.target.closest('[data-cart-update]');
    if (!button) return;
    const key   = button.dataset.cartUpdate;
    const input = button.closest('.cart-item')?.querySelector('[data-quantity-input]');
    if (!key || !input) return;
    try {
      const cart = await Cart.changeItem(key, parseInt(input.value));
      Cart.dispatchUpdate(cart);
    } catch (err) { console.error('Cart update error:', err); }
  }

  async handleCartRemove(e) {
    const button = e.target.closest('[data-cart-remove]');
    if (!button) return;
    try {
      const cart = await Cart.changeItem(button.dataset.cartRemove, 0);
      Cart.dispatchUpdate(cart);
    } catch (err) { console.error('Cart remove error:', err); }
  }
}

/* ============================================
   VARIANT SELECTOR
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
    this.currentVariant = this.variantData.find(variant =>
      variant.options.every((option, index) => option === selectedOptions[index])
    );
    this.updateUI();
  }
  updateUI() {
    if (!this.currentVariant) return;

    const priceEl = this.element.querySelector('[data-product-price]');
    if (priceEl) priceEl.textContent = this.formatMoney(this.currentVariant.price);

    const compareEl = this.element.querySelector('[data-product-compare-price]');
    if (compareEl) {
      if (this.currentVariant.compare_at_price) {
        compareEl.textContent = this.formatMoney(this.currentVariant.compare_at_price);
        compareEl.classList.remove('hidden');
      } else {
        compareEl.classList.add('hidden');
      }
    }

    const variantInput = this.element.querySelector('[name="id"]');
    if (variantInput) variantInput.value = this.currentVariant.id;

    // Support both naming conventions
    const addButton = this.element.querySelector('[data-add-to-cart-button], [data-atc-btn]');
    if (addButton) {
      addButton.disabled = !this.currentVariant.available;
      addButton.textContent = this.currentVariant.available
        ? (addButton.dataset.addText || 'Add to Cart')
        : (addButton.dataset.soldOutText || 'Sold Out');
    }

    this.element.dispatchEvent(new CustomEvent('variant:changed', {
      detail: { variant: this.currentVariant }
    }));
  }
  formatMoney(cents) { return '$' + (cents / 100).toFixed(2); }
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
    this.min = parseInt(this.input?.min) || 1;
    this.max = parseInt(this.input?.max) || 999;
    this.setupEventListeners();
  }
  setupEventListeners() {
    this.decreaseBtn?.addEventListener('click', () => this.decrease());
    this.increaseBtn?.addEventListener('click', () => this.increase());
    this.input?.addEventListener('change', () => this.handleInputChange());
  }
  decrease() {
    const v = parseInt(this.input.value);
    if (v > this.min) { this.input.value = v - 1; this.triggerChange(); }
  }
  increase() {
    const v = parseInt(this.input.value);
    if (v < this.max) { this.input.value = v + 1; this.triggerChange(); }
  }
  handleInputChange() {
    let v = parseInt(this.input.value);
    if (isNaN(v) || v < this.min) v = this.min;
    if (v > this.max) v = this.max;
    this.input.value = v;
    this.triggerChange();
  }
  triggerChange() { this.input.dispatchEvent(new Event('change', { bubbles: true })); }
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
      if (!this.element.contains(e.target)) this.hideResults();
    });
  }
  async handleInput() {
    const query = this.input.value.trim();
    if (query.length < this.minChars) { this.hideResults(); return; }
    try {
      const response = await fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=4`);
      const data = await response.json();
      this.renderResults(data.resources?.results?.products || []);
    } catch (error) {
      console.error('Search error:', error);
    }
  }
  renderResults(products) {
    if (!products.length) { this.hideResults(); return; }
    this.results.innerHTML = products.map(product => `
      <a href="${product.url}" class="search-result">
        ${product.featured_image
          ? `<img src="${product.featured_image}" alt="${product.title}" class="search-result__image">`
          : ''}
        <div class="search-result__content">
          <div class="search-result__title">${product.title}</div>
          <div class="search-result__price">${this.formatMoney(product.price)}</div>
        </div>
      </a>
    `).join('');
    this.showResults();
  }
  showResults() { this.results?.classList.remove('hidden'); }
  hideResults() { this.results?.classList.add('hidden'); }
  formatMoney(cents) { return '$' + (cents / 100).toFixed(2); }
}

/* ============================================
   INITIALIZATION
   header sticky + mobile drawer handled by
   header.liquid — do NOT duplicate here
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Announcement bar ── */
  function syncHeaderPosition() {
    const announcement = document.querySelector('.announcement-bar');
    const header = document.getElementById('site-header');
    const aH = (announcement && announcement.offsetHeight > 0) ? announcement.offsetHeight : 0;
    const hH = header ? header.offsetHeight : 0;
    document.documentElement.style.setProperty('--announcement-height', aH + 'px');
    document.documentElement.style.setProperty('--nav-total-height', (aH + hH) + 'px');
  }

  // Run on load so body padding is correct immediately
  syncHeaderPosition();
  window.addEventListener('resize', debounce(syncHeaderPosition, 100), { passive: true });
  window.addEventListener('load', syncHeaderPosition);

  const announcementClose = document.querySelector('.announcement-bar__close');
  if (announcementClose) {
    announcementClose.addEventListener('click', () => {
      const bar = announcementClose.closest('.announcement-bar');
      if (bar) { bar.style.display = 'none'; syncHeaderPosition(); }
      // sessionStorage resets each browser session (better UX than localStorage)
      sessionStorage.setItem('announcement-bar-closed', 'true');
    });

    if (sessionStorage.getItem('announcement-bar-closed') === 'true') {
      const bar = document.querySelector('.announcement-bar');
      if (bar) { bar.style.display = 'none'; syncHeaderPosition(); }
    }
  }

  /* ── Accessible external links ── */
  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    if (!link.getAttribute('rel')?.includes('noopener')) {
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });

  /* ── Cart Manager ── */
  new CartManager();

  /* ── Variant Selectors ── */
  document.querySelectorAll('[data-product-form]').forEach(form => {
    new VariantSelector(form);
  });

  /* ── Quantity Selectors ── */
  document.querySelectorAll('[data-quantity-selector]').forEach(selector => {
    new QuantitySelector(selector);
  });

  /* ── Predictive Search ── */
  document.querySelectorAll('[data-predictive-search]').forEach(search => {
    new PredictiveSearch(search);
  });

});