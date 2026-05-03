/**
 * Five Star Services Pressure Washing
 * script.js — Interactions & Animations
 */

/* =========================================================
   1. STICKY NAV — add .scrolled class on scroll
   ========================================================= */
const navHeader = document.getElementById('nav-header');

function handleNavScroll() {
  if (window.scrollY > 40) {
    navHeader.classList.add('scrolled');
  } else {
    navHeader.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // run once on load


/* =========================================================
   2. MOBILE NAV TOGGLE
   ========================================================= */
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('active', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Close if user clicks outside the nav
document.addEventListener('click', (e) => {
  if (!navHeader.contains(e.target) && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});


/* =========================================================
   3. SCROLL REVEAL — IntersectionObserver for .reveal
   ========================================================= */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // animate once
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* =========================================================
   4. BEFORE / AFTER SLIDER — drag interaction
   ========================================================= */
document.querySelectorAll('.before-after').forEach(initBeforeAfter);

function initBeforeAfter(container) {
  const afterEl   = container.querySelector('.ba-after');
  const dividerEl = container.querySelector('.ba-divider');
  let dragging = false;

  function setPosition(clientX) {
    const rect   = container.getBoundingClientRect();
    const relX   = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const pct    = (relX / rect.width) * 100;
    const right  = 100 - pct;

    afterEl.style.clipPath   = `inset(0 ${right}% 0 0)`;
    dividerEl.style.left     = `${pct}%`;
    dividerEl.style.transform = 'translateX(-50%)';
  }

  // Mouse
  container.addEventListener('mousedown', (e) => {
    dragging = true;
    setPosition(e.clientX);
    container.style.cursor = 'col-resize';
  });

  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    setPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    dragging = false;
    container.style.cursor = '';
  });

  // Touch
  container.addEventListener('touchstart', (e) => {
    dragging = true;
    setPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    setPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => { dragging = false; });
}


/* =========================================================
   5. CONTACT FORM — validation & simulated submit
   ========================================================= */
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fields  = ['name', 'email', 'message'];
    let isValid   = true;

    // Clear previous errors
    contactForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    fields.forEach(fieldId => {
      const input = document.getElementById(fieldId);
      if (!input.value.trim()) {
        input.classList.add('error');
        isValid = false;
      }
    });

    // Basic email validation
    const emailInput = document.getElementById('email');
    if (emailInput.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      emailInput.classList.add('error');
      isValid = false;
    }

    if (!isValid) {
      const firstError = contactForm.querySelector('.error');
      if (firstError) firstError.focus();
      return;
    }

    // Show loading state
    const submitBtn  = contactForm.querySelector('button[type="submit"]');
    const btnText    = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');

    submitBtn.disabled = true;
    btnText.textContent = 'Sending…';
    btnSpinner.classList.remove('hidden');

    // Simulate async network request
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Show success state
    contactForm.querySelector('.form-note').classList.add('hidden');
    submitBtn.classList.add('hidden');

    const successMsg = document.getElementById('form-success');
    successMsg.classList.remove('hidden');
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    contactForm.reset();
  });

  // Remove error state on input
  contactForm.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('input', () => input.classList.remove('error'));
  });
}


/* =========================================================
   6. SMOOTH SCROLL — offset for fixed nav
   ========================================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navH   = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 70;
    const top    = target.getBoundingClientRect().top + window.scrollY - navH - 12;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* =========================================================
   7. ACTIVE NAV LINK — highlight section in viewport
   ========================================================= */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.35 }
);

sections.forEach(s => sectionObserver.observe(s));


/* =========================================================
   8. COUNTER ANIMATION — hero stats on load
   ========================================================= */
function animateCounter(el, target, suffix = '', duration = 1200) {
  const start = performance.now();
  const isDecimal = String(target).includes('.');

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out quart
    const ease  = 1 - Math.pow(1 - progress, 4);
    const value = isDecimal
      ? (ease * target).toFixed(1)
      : Math.round(ease * target);

    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// Animate stats when hero is in view
const heroStats = document.querySelectorAll('.stat strong');
const statsData = [
  { target: 500, suffix: '+' },
  { target: 5,   suffix: '★' },
  { target: 100, suffix: '%' },
];

const heroObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        heroStats.forEach((el, i) => {
          const { target, suffix } = statsData[i] || {};
          if (target !== undefined) animateCounter(el, target, suffix);
        });
        heroObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

const heroSection = document.getElementById('hero');
if (heroSection) heroObserver.observe(heroSection);


/* =========================================================
   9. PARALLAX — subtle depth on hero background blob
   ========================================================= */
const heroBg = document.querySelector('.hero-bg-overlay');

if (heroBg && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    heroBg.style.transform = `translateY(${scrollY * 0.25}px)`;
  }, { passive: true });
}
