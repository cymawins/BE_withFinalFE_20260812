const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
}
if (closeMenu && mobileMenu) {
  closeMenu.addEventListener('click', () => mobileMenu.classList.remove('open'));
}
