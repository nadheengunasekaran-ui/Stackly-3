/**
 * STACKLY MOTORS - LUXURY AUTOMOBILE SHOWROOM
 * Premium interactive homepage script
 */

document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ========================================================
     1. STICKY NAVBAR & SCROLLSPY
     ======================================================== */
  const navbar = $('#navbar');
  if (navbar) {
    const handleScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 25);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // Active link scrollspy
  const navLinks = $$('.nav-links .nav-link');
  const sections = $$('main section, footer');

  const updateActiveLink = () => {
    const scrollPos = window.scrollY + 200;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', updateActiveLink, { passive: true });

  /* ========================================================
     MOBILE MENU DRAWER
     ======================================================== */
  const menuToggle = $('#menuToggle');
  const navPanel = $('#navPanel');

  const toggleMenu = (open) => {
    if (!menuToggle || !navPanel) return;
    const isOpen = open !== undefined ? open : !navPanel.classList.contains('open');
    navPanel.classList.toggle('open', isOpen);
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  if (menuToggle && navPanel) {
    menuToggle.addEventListener('click', () => toggleMenu());
    $$('a', navPanel).forEach((link) => {
      link.addEventListener('click', () => toggleMenu(false));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navPanel.classList.contains('open')) {
        toggleMenu(false);
      }
    });
    document.addEventListener('click', (e) => {
      if (navPanel.classList.contains('open') && !navPanel.contains(e.target) && !menuToggle.contains(e.target)) {
        toggleMenu(false);
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 960 && navPanel.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }

  /* ========================================================
     2. HERO SLIDER TRANSITIONS
     ======================================================== */
  const heroSlider = $('#heroSlider');
  const slides = $$('.hero-slide');
  const dots = $$('.hero-pagination .dot');
  const prevBtn = $('#sliderPrev');
  const nextBtn = $('#sliderNext');
  let currentSlide = 0;
  let sliderInterval = null;
  const slideDuration = 5500;

  const goToSlide = (index) => {
    if (!slides.length) return;
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentSlide);
    });
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
      dot.setAttribute('aria-selected', String(idx === currentSlide));
    });
  };

  const nextSlide = () => goToSlide(currentSlide + 1);
  const prevSlide = () => goToSlide(currentSlide - 1);

  const startAutoSlide = () => {
    if (reduceMotion || slides.length < 2) return;
    stopAutoSlide();
    sliderInterval = setInterval(nextSlide, slideDuration);
  };

  const stopAutoSlide = () => {
    if (sliderInterval) {
      clearInterval(sliderInterval);
      sliderInterval = null;
    }
  };

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoSlide(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoSlide(); });

  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-slide'), 10);
      goToSlide(idx);
      startAutoSlide();
    });
  });

  const heroSection = $('#home');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopAutoSlide);
    heroSection.addEventListener('mouseleave', startAutoSlide);

    // Keyboard navigation
    heroSection.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    });
  }

  startAutoSlide();

  /* ========================================================
     4 & 6. CATEGORIES & BEST SELLING CARS FILTERS
     ======================================================== */
  const filterTabs = $$('.filter-tab');
  const productCards = $$('#productGrid .car-card');

  const filterCars = (filterValue) => {
    filterTabs.forEach((tab) => {
      const active = tab.getAttribute('data-filter') === filterValue;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });

    productCards.forEach((card) => {
      const brand = card.getAttribute('data-brand') || '';
      if (filterValue === 'all' || brand.toLowerCase() === filterValue.toLowerCase()) {
        card.classList.remove('hide');
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      } else {
        card.classList.add('hide');
      }
    });
  };

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      const filter = e.currentTarget.getAttribute('data-filter');
      filterCars(filter);
    });
  });

  // Category card links filter triggering
  $$('.cat-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      const filter = e.currentTarget.getAttribute('data-filter');
      if (filter) {
        filterCars(filter);
      }
    });
  });

  /* ========================================================
     SCROLL REVEAL ANIMATIONS (IntersectionObserver)
     ======================================================== */
  const revealElements = $$('.reveal');
  if (revealElements.length && !reduceMotion) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach((el) => observer.observe(el));
    } else {
      revealElements.forEach((el) => el.classList.add('show'));
    }
  } else {
    revealElements.forEach((el) => el.classList.add('show'));
  }
});
