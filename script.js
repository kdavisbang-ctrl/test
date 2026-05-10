/**
 * Five Star Services Pressure Washing — script.js
 */

/* 1. Sticky nav */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* 2. Mobile menu */
const menuBtn  = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');

menuBtn.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
});

navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('click', e => { if (!nav.contains(e.target)) closeMenu(); });

function closeMenu() {
  navLinks.classList.remove('open');
  menuBtn.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
}

/* 3. Scroll reveal */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* 4. Before/After drag slider */
document.querySelectorAll('.ba').forEach(ba => {
  const after   = ba.querySelector('.ba-after');
  const divider = ba.querySelector('.ba-divider');
  let dragging  = false;

  function setPos(clientX) {
    const rect = ba.getBoundingClientRect();
    const pct  = Math.max(0, Math.min((clientX - rect.left) / rect.width * 100, 100));
    after.style.clipPath        = `inset(0 ${100 - pct}% 0 0)`;
    divider.style.left          = pct + '%';
    divider.style.transform     = 'translateX(-50%)';
  }

  ba.addEventListener('mousedown',  e => { dragging = true; setPos(e.clientX); });
  window.addEventListener('mousemove', e => { if (dragging) setPos(e.clientX); });
  window.addEventListener('mouseup',   () => { dragging = false; });

  ba.addEventListener('touchstart', e => { dragging = true; setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchmove',  e => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchend',   () => { dragging = false; });
});

/* 5. Smooth scroll with nav offset */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH - 8, behavior: 'smooth' });
  });
});

/* 6. Contact form */
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    form.querySelectorAll('.err').forEach(el => el.classList.remove('err'));

    let valid = true;
    ['name', 'email', 'message'].forEach(id => {
      const f = document.getElementById(id);
      if (!f.value.trim()) { f.classList.add('err'); valid = false; }
    });
    const em = document.getElementById('email');
    if (em.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value)) {
      em.classList.add('err'); valid = false;
    }
    if (!valid) { form.querySelector('.err')?.focus(); return; }

    const btn   = form.querySelector('button[type="submit"]');
    const label = btn.querySelector('.btn-label');
    const spin  = btn.querySelector('.btn-spin');
    btn.disabled       = true;
    label.textContent  = 'Sending…';
    spin.classList.remove('hidden');

    await new Promise(r => setTimeout(r, 1400));

    btn.classList.add('hidden');
    form.querySelector('.form-note').classList.add('hidden');
    document.getElementById('form-ok').classList.remove('hidden');
    form.reset();
  });

  form.querySelectorAll('input, select, textarea').forEach(f =>
    f.addEventListener('input', () => f.classList.remove('err'))
  );
}

/* 7. Active nav highlight */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const activeObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAnchors.forEach(a =>
        a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id)
      );
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => activeObs.observe(s));
