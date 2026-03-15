/* ===================================================
   Project Family AI — JavaScript
   =================================================== */

(function () {
  'use strict';

  // ---- DOM Elements ----
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const ctaForm = document.getElementById('ctaForm');
  const formSuccess = document.getElementById('formSuccess');
  const statNumbers = document.querySelectorAll('.stat-number');
  const fadeEls = document.querySelectorAll('.fade-in');

  // ---- Mobile Navigation ----
  let overlay = null;

  function createOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', closeMenu);
  }

  function openMenu() {
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    const isOpen = navMenu.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  createOverlay();
  navToggle.addEventListener('click', toggleMenu);

  // Close menu when a link is clicked
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (navMenu.classList.contains('open')) {
        closeMenu();
      }
    });
  });

  // ---- Navbar Scroll Effect ----
  let lastScroll = 0;

  function handleScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ---- Intersection Observer — Fade In ----
  function createFadeObserver() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything immediately
      fadeEls.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  createFadeObserver();

  // ---- Animated Counter for Hero Stats ----
  function animateCounters() {
    if (!('IntersectionObserver' in window)) {
      statNumbers.forEach(function (el) {
        el.textContent = el.getAttribute('data-target');
      });
      return;
    }

    let hasAnimated = false;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            statNumbers.forEach(function (counter) {
              const target = parseInt(counter.getAttribute('data-target'), 10);
              const duration = 2000; // ms
              const start = performance.now();

              function updateCounter(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.round(target * eased);

                if (progress < 1) {
                  requestAnimationFrame(updateCounter);
                } else {
                  counter.textContent = target;
                }
              }

              requestAnimationFrame(updateCounter);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
      observer.observe(statsSection);
    }
  }

  animateCounters();

  // ---- Form Submission ----
  if (ctaForm) {
    ctaForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const emailInput = document.getElementById('ctaEmail');
      const email = emailInput.value.trim();

      if (!email) return;

      // Simulate form submission
      const submitBtn = ctaForm.querySelector('.btn-form');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(function () {
        ctaForm.style.display = 'none';
        formSuccess.classList.add('show');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1200);
    });
  }

  // ---- Active Nav Link Highlighting ----
  function highlightActiveNav() {
    const sections = document.querySelectorAll('section[id]');

    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(function (link) {
              link.style.color = '';
              link.style.background = '';
              if (link.getAttribute('href') === '#' + id) {
                link.style.color = 'var(--color-primary)';
              }
            });
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-80px 0px -50% 0px'
      }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  highlightActiveNav();

  // ---- Keyboard Accessibility — Escape to close menu ----
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
      navToggle.focus();
    }
  });

})();
