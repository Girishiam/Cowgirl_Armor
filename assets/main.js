/* Global Javascript for Cowgirl Armor Theme */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileDrawer = document.querySelector('.mobile-drawer');

  // Add scrolled class to header when user scrolls down
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('site-header--scrolled');
      } else {
        header.classList.remove('site-header--scrolled');
      }
    });
    
    // Check on initial load
    if (window.scrollY > 50) {
      header.classList.add('site-header--scrolled');
    }
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
