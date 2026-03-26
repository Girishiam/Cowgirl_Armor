<style>
/* ══════════════════════════════════════════
   SEARCH PAGE — uses your theme's CSS vars
   so it auto-matches colors, fonts, borders
   ══════════════════════════════════════════ */

.sp { font-family: var(--font-body); color: var(--color-text); }
.sp *, .sp *::before, .sp *::after { box-sizing: border-box; }
.sp a { text-decoration: none; color: inherit; }
.sp ul { list-style: none; padding: 0; margin: 0; }

/* ── Hero ── */
.sp-hero {
  background-color: var(--color-base-bg);
  border-bottom: var(--border-width, 1px) solid var(--color-border);
  padding: clamp(3.5rem, 9vw, 6rem) clamp(1.5rem, 5vw, 4rem) clamp(2.5rem, 6vw, 4rem);
  text-align: center;
  position: relative;
  overflow: hidden;
}

/* Subtle decorative line top */
.sp-hero::before {
  content: '';
  position: absolute;
  top: 0; left: 50%;
  transform: translateX(-50%);
  width: 56px; height: 2px;
  background: var(--color-accent);
}

.sp-eyebrow {
  font-family: var(--font-heading);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}
.sp-eyebrow-line {
  display: inline-block;
  width: 28px; height: 1px;
  background: var(--color-accent);
  opacity: 0.5;
}

.sp-title {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 5.5vw, 3.8rem);
  font-weight: var(--heading-weight, 700);
  text-transform: var(--heading-text-transform, uppercase);
  letter-spacing: var(--heading-letter-spacing, 0px);
  line-height: var(--heading-line-height, 1.1);
  color: var(--color-text);
  margin-bottom: 2.8rem;
}

.sp-title-term {
  /* highlight the searched term in accent */
  font-style: italic;
  text-transform: none;
  color: var(--color-accent);
  letter-spacing: 0;
}

/* ── Search bar ── */
.sp-form { max-width: 640px; margin: 0 auto; }

.sp-field {
  display: flex;
  align-items: stretch;
  height: 54px;
  border: var(--buttons-border-thickness, 1px) solid var(--color-border);
  background: var(--inputs-bg, #fff);
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
  border-radius: var(--inputs-radius, 0px);
  overflow: hidden;
}

.sp-field:focus-within {
  border-color: var(--inputs-focus-color, var(--color-accent));
  box-shadow: 0 0 0 3px rgba(139,164,172,0.15);
}

.sp-icon {
  display: flex; align-items: center;
  padding: 0 0.9rem 0 1.2rem;
  color: var(--color-border);
  flex-shrink: 0;
}
.sp-icon svg {
  width: 18px; height: 18px;
  fill: none; stroke: currentColor;
  stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
}

.sp-input {
  flex: 1; min-width: 0;
  background: transparent; border: none;
  padding: 0 0.5rem;
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 0.97rem;
  font-weight: 400;
  height: 100%;
}
.sp-input:focus { outline: none; }
.sp-input::placeholder { color: var(--color-border); font-style: italic; }

.sp-clear {
  display: none; align-items: center; justify-content: center;
  background: transparent; border: none;
  padding: 0 0.65rem;
  color: var(--color-border);
  cursor: pointer; transition: color 0.2s; flex-shrink: 0;
}
.sp-clear:hover { color: var(--color-text); }
.sp-clear svg { width: 13px; height: 13px; stroke: currentColor; stroke-width: 2.5; fill: none; }

.sp-submit {
  background-color: var(--color-button, var(--color-text));
  color: var(--color-button-text, #fff);
  border: none;
  padding: 0 1.75rem;
  font-family: var(--font-heading);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer; flex-shrink: 0;
  transition: background-color 0.2s ease;
  height: 100%;
  border-radius: 0 var(--inputs-radius, 0px) var(--inputs-radius, 0px) 0;
}
.sp-submit:hover { background-color: var(--color-button-hover, #333); }

.sp-count {
  margin-top: 1.1rem;
  font-family: var(--font-body);
  font-size: 0.83rem;
  color: var(--color-border);
  letter-spacing: 0.03em;
}
.sp-count strong { color: var(--color-accent); font-weight: 600; }

/* ── Body ── */
.sp-body {
  max-width: var(--page-width, 1200px);
  margin: 0 auto;
  padding: clamp(2.5rem, 6vw, 4rem) clamp(1.5rem, 4vw, 2rem);
}

/* ── Filter bar ── */
.sp-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: var(--border-width, 1px) solid var(--color-border);
}

.sp-filter-label {
  font-family: var(--font-heading);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-border);
  margin-right: 0.25rem;
}

.sp-filter-btn {
  background: transparent;
  border: var(--buttons-border-thickness, 1px) solid var(--color-border);
  color: var(--color-border);
  padding: 0.4rem 1rem;
  font-family: var(--font-heading);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: var(--buttons-radius, 0px);
}

.sp-filter-btn:hover,
.sp-filter-btn.active {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: rgba(139,164,172,0.08);
}

/* ── Section heading ── */
.sp-section-hd {
  font-family: var(--font-heading);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-border);
  margin: 3rem 0 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.sp-section-hd::after { content: ''; flex: 1; height: 1px; background: var(--color-border); }

/* ── Product grid ── */
.sp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--spacing-grid-horizontal, 20px);
}

/* ── Product card — mirrors your .product-card styles ── */
.sp-card {
  display: block;
  position: relative;
  color: var(--color-text);
  border: var(--border-width, 1px) solid var(--color-border);
  border-radius: var(--border-radius, 0px);
  overflow: hidden;
  transition: transform var(--duration-default, 200ms) ease,
              box-shadow var(--duration-default, 200ms) ease;
  background: var(--inputs-bg, #fff);
}

.sp-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover, 0 8px 30px rgba(0,0,0,0.12));
}

.sp-card:hover .sp-card-img img { transform: scale(1.05); }

.sp-card-img {
  aspect-ratio: 3/4;
  overflow: hidden;
  background: var(--color-base-bg);
  position: relative;
}

.sp-card-img img {
  width: 100%; height: 100%;
  object-fit: cover; display: block;
  transition: transform var(--duration-long, 500ms) var(--ease-out-slow, ease);
}

.sp-card-placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
}
.sp-card-placeholder svg { width: 44px; height: 44px; fill: rgba(0,0,0,0.12); }

/* Badge — uses your .badge--sale / .badge--new vars */
.sp-badge {
  position: absolute; top: 0.75rem; left: 0.75rem;
  padding: 0.25rem 0.75rem;
  font-family: var(--font-heading);
  font-size: 0.6rem; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  border-radius: var(--badge-corner-radius, 0px);
}
.sp-badge.sale { background: var(--badge-sale-bg, var(--color-error, #DC2626)); color: var(--badge-sale-text, #fff); }
.sp-badge.new  { background: var(--color-accent); color: var(--color-text); }

.sp-card-body { padding: 1rem 1.1rem 1.3rem; }

.sp-card-vendor {
  font-family: var(--font-body);
  font-size: 0.68rem; letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 0.3rem; opacity: 0.9;
}

/* Mirror .product-card__title */
.sp-card-title {
  font-family: var(--font-heading);
  font-size: 0.95rem;
  font-weight: var(--heading-weight, 700);
  text-transform: var(--heading-text-transform, uppercase);
  letter-spacing: 0.05em;
  color: var(--color-text);
  line-height: 1.3;
  margin-bottom: 0.5rem;
}

.sp-card-price { display: flex; align-items: baseline; gap: 0.5rem; }
.sp-price { font-family: var(--font-body); font-weight: 600; font-size: 0.95rem; }
.sp-compare { font-size: 0.82rem; opacity: 0.6; text-decoration: line-through; }
.sp-price-sale { color: var(--price-sale-color, var(--color-error, #DC2626)); }

.sp-card-cta {
  display: inline-flex; align-items: center; gap: 0.4rem;
  margin-top: 0.85rem;
  font-family: var(--font-heading);
  font-size: 0.65rem; font-weight: 700;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--color-accent);
  opacity: 0; transform: translateY(5px);
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.sp-card-cta svg { width: 11px; height: 11px; stroke: currentColor; stroke-width: 2.5; fill: none; stroke-linecap: round; stroke-linejoin: round; }
.sp-card:hover .sp-card-cta { opacity: 1; transform: translateY(0); }

/* ── Page/article rows ── */
.sp-rows {
  border: var(--border-width, 1px) solid var(--color-border);
  border-radius: var(--border-radius, 0px);
  overflow: hidden;
  background: var(--inputs-bg, #fff);
}

.sp-row {
  display: block;
  padding: 1.4rem 3rem 1.4rem 1.5rem;
  border-bottom: var(--border-width, 1px) solid var(--color-border);
  transition: background 0.2s ease;
  position: relative;
}
.sp-row:last-child { border-bottom: none; }
.sp-row:hover { background: var(--color-base-bg); }
.sp-row::after {
  content: '→'; position: absolute;
  right: 1.5rem; top: 50%; transform: translateY(-50%);
  color: var(--color-accent); font-size: 1rem;
  opacity: 0; transition: opacity 0.2s ease, right 0.2s ease;
}
.sp-row:hover::after { opacity: 1; right: 1.2rem; }

.sp-row-type {
  font-family: var(--font-heading);
  font-size: 0.62rem; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--color-accent);
  font-weight: 700; margin-bottom: 0.3rem;
}

.sp-row-title {
  font-family: var(--font-heading);
  font-size: 1.05rem;
  font-weight: var(--heading-weight, 700);
  text-transform: var(--heading-text-transform, uppercase);
  letter-spacing: 0.04em;
  color: var(--color-text);
  line-height: 1.3; margin-bottom: 0.25rem;
}

.sp-row-excerpt {
  font-family: var(--font-body);
  font-size: 0.88rem; color: var(--color-border);
  line-height: 1.6;
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
}

/* ── Empty state ── */
.sp-empty {
  text-align: center;
  padding: clamp(4rem, 10vw, 7rem) 1.5rem;
}

.sp-empty-icon {
  width: 52px; height: 52px;
  margin: 0 auto 2rem; color: var(--color-border);
}
.sp-empty-icon svg { width: 100%; height: 100%; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; }

.sp-empty h2 {
  font-family: var(--font-heading);
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  font-weight: var(--heading-weight, 700);
  text-transform: var(--heading-text-transform, uppercase);
  letter-spacing: var(--heading-letter-spacing, 0px);
  color: var(--color-text);
  margin-bottom: 0.75rem;
}

.sp-empty p {
  font-family: var(--font-body);
  font-size: 0.95rem; color: var(--color-border);
  max-width: 380px; margin: 0 auto 2.5rem; line-height: 1.7;
}

/* ── Quick links / tags ── */
.sp-tags { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; }

.sp-tag {
  background: transparent;
  border: var(--buttons-border-thickness, 1px) solid var(--color-border);
  color: var(--color-text);
  padding: 0.5rem 1.2rem;
  font-family: var(--font-heading);
  font-size: 0.72rem; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  border-radius: var(--buttons-radius, 0px);
  transition: all 0.2s ease;
}
.sp-tag:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: rgba(139,164,172,0.08);
}

/* ── Pagination — mirrors your .btn style ── */
.sp-pages {
  display: flex; justify-content: center; align-items: center;
  gap: 0.4rem; padding: 4rem 0 1rem;
}

.sp-page {
  display: inline-flex; align-items: center; justify-content: center;
  width: 40px; height: 40px;
  border: var(--buttons-border-thickness, 1px) solid var(--color-border);
  color: var(--color-text);
  font-family: var(--font-heading);
  font-size: 0.82rem; font-weight: 700;
  letter-spacing: 0.05em;
  transition: all 0.2s ease;
  border-radius: var(--buttons-radius, 0px);
}
.sp-page:hover, .sp-page.cur {
  background: var(--color-button, var(--color-text));
  color: var(--color-button-text, #fff);
  border-color: var(--color-button, var(--color-text));
}
.sp-page.nav { width: auto; padding: 0 1.2rem; font-size: 0.7rem; letter-spacing: 0.12em; }

/* ── Divider ── */
.sp-divider {
  border: none;
  border-top: var(--border-width, 1px) solid var(--color-border);
  margin: 4rem 0 0;
}

/* ── Responsive ── */
@media screen and (max-width: 600px) {
  .sp-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
  .sp-submit { padding: 0 1rem; font-size: 0.65rem; }
}
</style>

<div class="sp">

  <!-- ══ HERO ══ -->
  <div class="sp-hero">
    <p class="sp-eyebrow">
      <span class="sp-eyebrow-line"></span>
      {{ shop.name }}
      <span class="sp-eyebrow-line"></span>
    </p>

    <h1 class="sp-title">
      {%- if search.performed -%}
        Results for
        <span class="sp-title-term">"{{ search.terms | escape }}"</span>
      {%- else -%}
        Search
      {%- endif -%}
    </h1>

    <form action="{{ routes.search_url }}" method="get" role="search" class="sp-form">
      <input type="hidden" name="type" value="product,article,page">
      <div class="sp-field">
        <span class="sp-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </span>
        <input
          type="search"
          name="q"
          id="SpInput"
          class="sp-input"
          value="{{ search.terms | escape }}"
          placeholder="Search apparel, gifts, devotionals…"
          autocomplete="off"
          spellcheck="false"
          aria-label="Search"
        >
        <button type="button" class="sp-clear" id="SpClear" aria-label="Clear search">
          <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <button type="submit" class="sp-submit">Search</button>
      </div>

      {%- if search.performed -%}
        <p class="sp-count">
          {%- if search.results_count == 0 -%}
            No results found
          {%- elsif search.results_count == 1 -%}
            <strong>1</strong> result found
          {%- else -%}
            <strong>{{ search.results_count }}</strong> results found
          {%- endif -%}
        </p>
      {%- endif -%}
    </form>
  </div>

  <!-- ══ BODY ══ -->
  <div class="sp-body">

    {%- if search.performed -%}

      {%- if search.results_count == 0 -%}
        <div class="sp-empty">
          <div class="sp-empty-icon">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <h2>Nothing Found</h2>
          <p>Try a different spelling, or browse our collections below.</p>
          <div class="sp-tags">
            <a href="{{ routes.collections_url }}" class="sp-tag">All Collections</a>
            <a href="/collections/apparel" class="sp-tag">Apparel</a>
            <a href="/collections/accessories" class="sp-tag">Accessories</a>
            <a href="/collections/gifts" class="sp-tag">Gifts</a>
            <a href="/collections/new-arrivals" class="sp-tag">New Arrivals</a>
            <a href="/pages/faq" class="sp-tag">FAQ</a>
          </div>
        </div>

      {%- else -%}

        {%- assign sp_products = search.results | where: 'object_type', 'product' -%}
        {%- assign sp_articles = search.results | where: 'object_type', 'article' -%}
        {%- assign sp_pages    = search.results | where: 'object_type', 'page' -%}

        <!-- Filters -->
        <div class="sp-filters">
          <span class="sp-filter-label">Show:</span>
          <button class="sp-filter-btn active" data-filter="all">All ({{ search.results_count }})</button>
          {%- if sp_products.size > 0 -%}
            <button class="sp-filter-btn" data-filter="product">Products ({{ sp_products.size }})</button>
          {%- endif -%}
          {%- if sp_articles.size > 0 -%}
            <button class="sp-filter-btn" data-filter="article">Articles ({{ sp_articles.size }})</button>
          {%- endif -%}
          {%- if sp_pages.size > 0 -%}
            <button class="sp-filter-btn" data-filter="page">Pages ({{ sp_pages.size }})</button>
          {%- endif -%}
        </div>

        <!-- Products -->
        {%- if sp_products.size > 0 -%}
          <p class="sp-section-hd" data-hd="product">Products</p>
          <div class="sp-grid" data-section="product">
            {%- for item in sp_products -%}
              <a href="{{ item.url }}" class="sp-card" data-type="product">
                <div class="sp-card-img">
                  {%- if item.featured_image -%}
                    <img
                      src="{{ item.featured_image | image_url: width: 600 }}"
                      alt="{{ item.featured_image.alt | escape }}"
                      loading="lazy" width="600"
                    >
                  {%- else -%}
                    <div class="sp-card-placeholder">
                      {{ 'product-1' | placeholder_svg_tag: 'placeholder-svg' }}
                    </div>
                  {%- endif -%}
                  {%- if item.compare_at_price > item.price -%}
                    <span class="sp-badge sale">Sale</span>
                  {%- elsif item.tags contains 'new' -%}
                    <span class="sp-badge new">New</span>
                  {%- endif -%}
                </div>
                <div class="sp-card-body">
                  {%- if item.vendor != blank -%}
                    <p class="sp-card-vendor">{{ item.vendor }}</p>
                  {%- endif -%}
                  <h3 class="sp-card-title">{{ item.title }}</h3>
                  <div class="sp-card-price">
                    {%- if item.compare_at_price > item.price -%}
                      <span class="sp-price sp-price-sale">{{ item.price | money }}</span>
                      <span class="sp-compare">{{ item.compare_at_price | money }}</span>
                    {%- else -%}
                      <span class="sp-price">{{ item.price | money }}</span>
                    {%- endif -%}
                  </div>
                  <span class="sp-card-cta">
                    View Product
                    <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </span>
                </div>
              </a>
            {%- endfor -%}
          </div>
        {%- endif -%}

        <!-- Articles -->
        {%- if sp_articles.size > 0 -%}
          <p class="sp-section-hd" data-hd="article">Articles &amp; Devotionals</p>
          <div class="sp-rows" data-section="article">
            {%- for item in sp_articles -%}
              <a href="{{ item.url }}" class="sp-row" data-type="article">
                <p class="sp-row-type">Article</p>
                <p class="sp-row-title">{{ item.title }}</p>
                {%- if item.excerpt_or_content != blank -%}
                  <p class="sp-row-excerpt">{{ item.excerpt_or_content | strip_html }}</p>
                {%- endif -%}
              </a>
            {%- endfor -%}
          </div>
        {%- endif -%}

        <!-- Pages -->
        {%- if sp_pages.size > 0 -%}
          <p class="sp-section-hd" data-hd="page">Pages</p>
          <div class="sp-rows" data-section="page">
            {%- for item in sp_pages -%}
              <a href="{{ item.url }}" class="sp-row" data-type="page">
                <p class="sp-row-type">Page</p>
                <p class="sp-row-title">{{ item.title }}</p>
                {%- if item.content != blank -%}
                  <p class="sp-row-excerpt">{{ item.content | strip_html }}</p>
                {%- endif -%}
              </a>
            {%- endfor -%}
          </div>
        {%- endif -%}

        <!-- Pagination -->
        {%- if paginate.pages > 1 -%}
          <nav class="sp-pages" aria-label="Search pagination">
            {%- if paginate.previous -%}
              <a href="{{ paginate.previous.url }}" class="sp-page nav">← Prev</a>
            {%- endif -%}
            {%- for part in paginate.parts -%}
              {%- if part.is_link -%}
                <a href="{{ part.url }}" class="sp-page">{{ part.title }}</a>
              {%- else -%}
                <span class="sp-page cur">{{ part.title }}</span>
              {%- endif -%}
            {%- endfor -%}
            {%- if paginate.next -%}
              <a href="{{ paginate.next.url }}" class="sp-page nav">Next →</a>
            {%- endif -%}
          </nav>
        {%- endif -%}

      {%- endif -%}

    {%- else -%}

      <!-- Pre-search -->
      <div class="sp-empty">
        <div class="sp-empty-icon">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <h2>Explore the Store</h2>
        <p>Search for apparel, gifts, devotionals, or anything that speaks to your heart.</p>
        <div class="sp-tags">
          <a href="{{ routes.collections_url }}" class="sp-tag">All Collections</a>
          <a href="/collections/apparel" class="sp-tag">Apparel</a>
          <a href="/collections/accessories" class="sp-tag">Accessories</a>
          <a href="/collections/gifts" class="sp-tag">Gifts</a>
          <a href="/collections/new-arrivals" class="sp-tag">New Arrivals</a>
          <a href="/blogs/devotionals" class="sp-tag">Devotionals</a>
        </div>
      </div>

    {%- endif -%}

    <hr class="sp-divider">

  </div>
</div>

<script>
  (function () {
    var input = document.getElementById('SpInput');
    var clear  = document.getElementById('SpClear');

    function toggleClear() {
      if (!input || !clear) return;
      clear.style.display = input.value.length ? 'flex' : 'none';
    }

    if (input) {
      input.addEventListener('input', toggleClear);
      toggleClear();
      if (clear) {
        clear.addEventListener('click', function () {
          input.value = '';
          input.focus();
          toggleClear();
        });
      }
    }

    // Filter buttons
    var btns = document.querySelectorAll('.sp-filter-btn');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var f = btn.dataset.filter;

        document.querySelectorAll('[data-type]').forEach(function (el) {
          el.style.display = (f === 'all' || el.dataset.type === f) ? '' : 'none';
        });
        document.querySelectorAll('[data-section]').forEach(function (el) {
          el.style.display = (f === 'all' || el.dataset.section === f) ? '' : 'none';
        });
        document.querySelectorAll('[data-hd]').forEach(function (el) {
          el.style.display = (f === 'all' || el.dataset.hd === f) ? '' : 'none';
        });
      });
    });
  })();
</script>
