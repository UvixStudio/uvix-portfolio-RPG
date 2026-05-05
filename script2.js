// ============================================
// CUSTOM CURSOR
// ============================================
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

function animateFollower() {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  follower.style.left = fx + 'px';
  follower.style.top  = fy + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// ============================================
// NAV SCROLL STATE
// ============================================
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ============================================
// SCROLL REVEAL
// ============================================
const revealEls = document.querySelectorAll('[data-reveal], .hero-eyebrow, .hero-headline__line, .hero-sub, .hero-stats, .hero-actions, .roles-sidebar, .section-eyebrow, .section-title, .cap-card, .proj-card, .approach-left, .approach-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger cards
      const delay = entry.target.closest('.capabilities-grid, .projects-grid, .approach-right')
        ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 80
        : 0;
      setTimeout(() => entry.target.classList.add('revealed'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// Trigger hero reveals immediately
setTimeout(() => {
  document.querySelectorAll('.hero-eyebrow, .hero-headline__line, .hero-sub, .hero-stats, .hero-actions, .roles-sidebar').forEach(el => {
    el.classList.add('revealed');
  });
}, 200);

// ============================================
// HERO CHARACTER CYCLE (scroll-driven)
// ============================================
const chars = document.querySelectorAll('.hero-char');
const roleItems = document.querySelectorAll('.role-item');
const charMap = [0, 1, 2, 3]; // char index per role group

let currentChar = 0;

function setChar(index) {
  if (index === currentChar) return;
  chars[currentChar].classList.remove('hero-char--active');
  currentChar = index % chars.length;
  chars[currentChar].classList.add('hero-char--active');
}

// Cycle roles on interval (subtle, not auto-advancing)
let roleIndex = 0;
setInterval(() => {
  roleItems[roleIndex].classList.remove('role-item--active');
  roleIndex = (roleIndex + 1) % roleItems.length;
  roleItems[roleIndex].classList.add('role-item--active');
  // Change char every 2 role cycles
  if (roleIndex % 2 === 0) setChar(Math.floor(roleIndex / 2) % chars.length);
}, 2200);

// ============================================
// PARALLAX — hero char responds to mouse
// ============================================
const charStage = document.getElementById('hero-char-stage');
document.addEventListener('mousemove', e => {
  if (!charStage) return;
  const rect = charStage.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = (e.clientX - cx) / window.innerWidth;
  const dy = (e.clientY - cy) / window.innerHeight;
  charStage.style.transform = `translate(${dx * 18}px, ${dy * 10}px)`;
});

// ============================================
// SMOOTH SCROLL for nav links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
