/* Global Javascript for Cowgirl Armor Theme */

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

    const handleScroll = () => {
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
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
  }

  // Toggle mobile drawer
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isActive = mobileDrawer.classList.contains('mobile-drawer--active');

      if (isActive) {
        mobileDrawer.classList.remove('mobile-drawer--active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = ''; // Restore scrolling
      } else {
        mobileDrawer.classList.add('mobile-drawer--active');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      }
    });
  }
});
