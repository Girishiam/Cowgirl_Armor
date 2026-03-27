/* ============================================================
   cart.js — Full AJAX cart for custom Shopify theme
   Handles: Add to cart, drawer/notification, qty update, remove
   Dispatches: cart:updated event for header badge
   ============================================================ */

const Cart = (() => {

  // ── Config ──────────────────────────────────────────────
  const ROUTES = window.routes || {
    cart_add_url:    '/cart/add.js',
    cart_change_url: '/cart/change.js',
    cart_update_url: '/cart/update.js',
    cart_url:        '/cart',
  };

  // ── Fetch helpers ────────────────────────────────────────
  async function fetchCart() {
    const res = await fetch('/cart.js', {
      headers: { 'Content-Type': 'application/json' }
    });
    return res.json();
  }

  async function addItem(variantId, quantity = 1, properties = {}) {
    const res = await fetch(ROUTES.cart_add_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity, properties })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.description || 'Could not add item to cart');
    }
    return res.json();
  }

  async function changeItem(variantId, quantity) {
    const res = await fetch(ROUTES.cart_change_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity })
    });
    return res.json();
  }

  async function updateCart(updates) {
    const res = await fetch(ROUTES.cart_update_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ updates })
    });
    return res.json();
  }

  // ── Dispatch event so header badge updates ───────────────
  function dispatchUpdate(cart) {
    document.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
  }

  // ── Format money ─────────────────────────────────────────
  function formatMoney(cents) {
    return '$' + (cents / 100).toFixed(2);
  }

  // ── Public API ───────────────────────────────────────────
  return { fetchCart, addItem, changeItem, updateCart, dispatchUpdate, formatMoney };
})();


/* ============================================================
   CART DRAWER
   Usage: include sections/cart-drawer.liquid in theme.liquid
   ============================================================ */
class CartDrawer extends HTMLElement {
  connectedCallback() {
    this.drawer  = this.querySelector('.cart-drawer__panel');
    this.overlay = this.querySelector('.cart-drawer__overlay');
    this.inner   = this.querySelector('.cart-drawer__items');
    this.subtotalEl = this.querySelector('.cart-drawer__subtotal-amount');
    this.emptyEl = this.querySelector('.cart-drawer__empty');
    this.bodyEl  = this.querySelector('.cart-drawer__body');

    // Open triggers
    document.querySelectorAll('[data-cart-open]').forEach(btn => {
      btn.addEventListener('click', e => { e.preventDefault(); this.open(); });
    });

    // Close triggers
    this.querySelector('.cart-drawer__close')?.addEventListener('click', () => this.close());
    this.overlay?.addEventListener('click', () => this.close());
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.getAttribute('aria-hidden') === 'false') this.close();
    });

    // Listen for cart updates
    document.addEventListener('cart:updated', () => this.refresh());

    // qty/remove delegation
    this.addEventListener('click', e => {
      const btn = e.target.closest('[data-qty-change]');
      const rem = e.target.closest('[data-remove-item]');
      if (btn) this.handleQty(btn);
      if (rem) this.handleRemove(rem);
    });
  }

  open() {
    this.setAttribute('aria-hidden', 'false');
    this.drawer?.classList.add('is-open');
    this.overlay?.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    this.refresh();
  }

  close() {
    this.setAttribute('aria-hidden', 'true');
    this.drawer?.classList.remove('is-open');
    this.overlay?.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  async refresh() {
    const cart = await Cart.fetchCart();
    this.renderItems(cart);
    Cart.dispatchUpdate(cart);
  }

  renderItems(cart) {
    if (!this.inner) return;
    const empty = cart.item_count === 0;

    if (this.emptyEl) this.emptyEl.style.display = empty ? 'flex' : 'none';
    if (this.bodyEl)  this.bodyEl.style.display  = empty ? 'none' : 'flex';

    if (this.subtotalEl) {
      this.subtotalEl.textContent = Cart.formatMoney(cart.total_price);
    }

    if (empty) { this.inner.innerHTML = ''; return; }

    this.inner.innerHTML = cart.items.map(item => `
      <div class="cart-item" data-variant-id="${item.variant_id}">
        <a href="${item.url}" class="cart-item__img-wrap">
          <img src="${item.image}" alt="${item.title}" class="cart-item__img" width="80" height="80" loading="lazy">
        </a>
        <div class="cart-item__details">
          <a href="${item.url}" class="cart-item__title">${item.product_title}</a>
          ${item.variant_title && item.variant_title !== 'Default Title'
            ? `<p class="cart-item__variant">${item.variant_title}</p>` : ''}
          <p class="cart-item__price">${Cart.formatMoney(item.final_line_price)}</p>
          <div class="cart-item__qty">
            <button class="cart-item__qty-btn" data-qty-change data-id="${item.variant_id}" data-delta="-1" aria-label="Decrease quantity">−</button>
            <span class="cart-item__qty-num">${item.quantity}</span>
            <button class="cart-item__qty-btn" data-qty-change data-id="${item.variant_id}" data-delta="1" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="cart-item__remove" data-remove-item data-id="${item.variant_id}" aria-label="Remove ${item.title}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    `).join('');
  }

  async handleQty(btn) {
    const id    = Number(btn.dataset.id);
    const delta = Number(btn.dataset.delta);
    const item  = this.inner.querySelector(`[data-variant-id="${id}"]`);
    const qtyEl = item?.querySelector('.cart-item__qty-num');
    const current = qtyEl ? parseInt(qtyEl.textContent) : 1;
    const newQty  = Math.max(0, current + delta);
    btn.disabled = true;
    await Cart.changeItem(id, newQty);
    await this.refresh();
  }

  async handleRemove(btn) {
    const id = Number(btn.dataset.id);
    btn.disabled = true;
    await Cart.changeItem(id, 0);
    await this.refresh();
  }
}

if (!customElements.get('cart-drawer')) {
  customElements.define('cart-drawer', CartDrawer);
}


/* ============================================================
   CART NOTIFICATION (toast bubble)
   ============================================================ */
class CartNotification extends HTMLElement {
  connectedCallback() {
    this.timer = null;
    document.addEventListener('cart:item-added', e => this.show(e.detail));
  }

  show(item) {
    const img   = this.querySelector('.cart-notif__img');
    const title = this.querySelector('.cart-notif__title');
    const price = this.querySelector('.cart-notif__price');

    if (img)   { img.src = item.image; img.alt = item.title; }
    if (title) title.textContent = item.product_title;
    if (price) price.textContent = Cart.formatMoney(item.final_price);

    this.classList.add('is-visible');
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.classList.remove('is-visible'), 4000);
  }
}

if (!customElements.get('cart-notification')) {
  customElements.define('cart-notification', CartNotification);
}


/* ============================================================
   ADD TO CART FORM
   Attach to any <form> with data-atc-form
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('[data-atc-form]').forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const btn       = form.querySelector('[data-atc-btn]');
      const variantId = form.querySelector('[name="id"]')?.value;
      const qty       = parseInt(form.querySelector('[name="quantity"]')?.value || '1');
      const errorEl   = form.querySelector('[data-atc-error]');

      if (!variantId) return;

      // Loading state
      if (btn) {
        btn.disabled = true;
        btn.dataset.originalText = btn.textContent;
        btn.textContent = btn.dataset.loadingText || 'Adding...';
      }
      if (errorEl) errorEl.style.display = 'none';

      try {
        const item = await Cart.addItem(variantId, qty);
        const cart = await Cart.fetchCart();

        Cart.dispatchUpdate(cart);
        document.dispatchEvent(new CustomEvent('cart:item-added', { detail: item }));

        // Open drawer if present, else show notification
        const drawer = document.querySelector('cart-drawer');
        const notif  = document.querySelector('cart-notification');

        if (drawer) {
          drawer.open();
        } else if (notif) {
          notif.show(item);
        }

        // Success state on button
        if (btn) {
          btn.textContent = btn.dataset.successText || 'Added!';
          setTimeout(() => {
            btn.textContent = btn.dataset.originalText;
            btn.disabled = false;
          }, 2000);
        }

      } catch (err) {
        if (errorEl) {
          errorEl.textContent = err.message;
          errorEl.style.display = 'block';
        }
        if (btn) {
          btn.textContent = btn.dataset.originalText;
          btn.disabled = false;
        }
      }
    });
  });

  // Variant selector — update hidden id input & price display
  document.querySelectorAll('[data-variant-select]').forEach(select => {
    select.addEventListener('change', () => {
      const form      = select.closest('form');
      const idInput   = form?.querySelector('[name="id"]');
      const priceEl   = form?.querySelector('[data-product-price]');
      const atcBtn    = form?.querySelector('[data-atc-btn]');

      if (idInput) idInput.value = select.value;

      // Find variant data from JSON (product must output window.productData)
      const variants = window.productData?.variants || [];
      const variant  = variants.find(v => String(v.id) === String(select.value));
      if (!variant) return;

      if (priceEl) priceEl.textContent = Cart.formatMoney(variant.price);

      if (atcBtn) {
        if (variant.available) {
          atcBtn.disabled = false;
          atcBtn.textContent = atcBtn.dataset.addText || 'Add to cart';
        } else {
          atcBtn.disabled = true;
          atcBtn.textContent = atcBtn.dataset.soldOutText || 'Sold out';
        }
      }
    });
  });

});