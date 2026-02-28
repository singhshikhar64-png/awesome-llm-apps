/* ====================================
   MedVance India – Main JavaScript
==================================== */

// ── Page Loader ───────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('page-loader');
    if (loader) loader.classList.add('hidden');
  }, 800);
});

// ── Particle Canvas ───────────────────────────
function initParticles(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 70 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2.5 + 0.5,
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5,
    alpha: Math.random() * 0.5 + 0.1,
  }));

  let mouse = { x: null, y: null };
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

      // mouse repulsion
      if (mouse.x !== null) {
        const dist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (dist < 120) {
          const angle = Math.atan2(p.y - mouse.y, p.x - mouse.x);
          p.x += Math.cos(angle) * 1.5;
          p.y += Math.sin(angle) * 1.5;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(148,210,189,${p.alpha})`;
      ctx.fill();
    });

    // connect nearby
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(148,210,189,${0.15 * (1 - d / 110)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// ── DNA Helix Canvas (About Hero) ───────────────────────────
function initDNAHelix(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let t = 0;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const amplitude = 60;
    const frequency = 0.04;
    const spacing = 28;

    for (let i = 0; i < canvas.height / spacing + 2; i++) {
      const y = i * spacing - (t % spacing);
      const x1 = cx + Math.sin(i * frequency * 10 + t * 0.04) * amplitude;
      const x2 = cx - Math.sin(i * frequency * 10 + t * 0.04) * amplitude;
      const alpha = 0.15 + 0.1 * Math.sin(i * 0.5);

      ctx.beginPath();
      ctx.arc(x1, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(148,210,189,${alpha + 0.2})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x2, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(233,196,106,${alpha + 0.1})`;
      ctx.fill();

      // rung
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.5})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    t++;
    requestAnimationFrame(draw);
  }
  draw();
}

// ── Navbar Scroll ───────────────────────────
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const scrollThreshold = 60;
  function onScroll() {
    if (window.scrollY > scrollThreshold) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── Hamburger Menu ───────────────────────────
function initHamburger() {
  const btn = document.querySelector('.hamburger');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    links.classList.toggle('open');
    document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      links.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ── Active Nav Link ───────────────────────────
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
}

// ── Scroll Reveal ───────────────────────────
function initReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!elements.length) return;
  const io = new IntersectionObserver(
    (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } }),
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  elements.forEach(el => io.observe(el));
}

// ── Counter Animation ───────────────────────────
function animateCounter(el, target, duration = 2000, suffix = '') {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString() + suffix;
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const io = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, 2000, suffix);
        io.unobserve(el);
      }
    }),
    { threshold: 0.5 }
  );
  counters.forEach(c => io.observe(c));
}

// ── Back to Top ───────────────────────────
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) btn.classList.add('visible');
    else btn.classList.remove('visible');
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── FAQ Accordion ───────────────────────────
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    const a = item.querySelector('.faq-answer');
    if (!q || !a) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-answer').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });
}

// ── Product Filter ───────────────────────────
function initProductFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.product-card');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInUp 0.4s ease both';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// ── Product Modal ───────────────────────────
function initProductModal() {
  const overlay = document.getElementById('product-modal');
  if (!overlay) return;

  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      const data = card.dataset;
      overlay.querySelector('.modal-icon').textContent = data.icon || '🏥';
      overlay.querySelector('.modal-name').textContent = data.name || '';
      overlay.querySelector('.modal-cat').textContent = data.category || '';
      overlay.querySelector('.modal-desc').textContent = data.desc || '';
      const ul = overlay.querySelector('.modal-feature-list');
      ul.innerHTML = (data.features || '').split('|').map(f => `<li>${f.trim()}</li>`).join('');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  overlay.querySelector('.modal-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ── Contact Form ───────────────────────────
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('[required]').forEach(field => {
      const group = field.closest('.form-group');
      const errEl = group.querySelector('.form-error');
      if (!field.value.trim()) {
        group.classList.add('error');
        if (errEl) errEl.textContent = 'This field is required.';
        valid = false;
      } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        group.classList.add('error');
        if (errEl) errEl.textContent = 'Please enter a valid email.';
        valid = false;
      } else {
        group.classList.remove('error');
        if (errEl) errEl.textContent = '';
      }
    });

    if (!valid) return;

    const btn = form.querySelector('.btn-submit');
    btn.classList.add('loading');
    btn.innerHTML = '<span>Sending…</span>';

    setTimeout(() => {
      form.style.display = 'none';
      const success = document.querySelector('.form-success');
      if (success) success.style.display = 'block';
    }, 1600);
  });

  form.querySelectorAll('[required]').forEach(field => {
    field.addEventListener('input', () => {
      const group = field.closest('.form-group');
      if (field.value.trim()) group.classList.remove('error');
    });
  });
}

// ── Animated Map Canvas ───────────────────────────
function initMapCanvas() {
  const canvas = document.getElementById('map-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let t = 0;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const rings = [0, 1, 2, 3, 4].map(i => ({ r: i * 40 + 40, alpha: 0 }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Grid
    ctx.strokeStyle = 'rgba(148,210,189,0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 60) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Pulse rings
    rings.forEach((ring, i) => {
      ring.alpha = Math.max(0, 0.6 - ((t * 0.012 + i * 0.2) % 1));
      const r = ((t * 0.5 + i * 50) % 220) + 10;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(148,210,189,${ring.alpha * 0.4})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(233,196,106,0.9)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();

    t++;
    requestAnimationFrame(draw);
  }
  draw();
}

// ── Scroll Progress Bar ───────────────────────────
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / total * 100) + '%';
  }, { passive: true });
}

// ── Typewriter ───────────────────────────
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const texts = el.dataset.texts.split('|');
  let tIdx = 0, cIdx = 0, deleting = false;

  function type() {
    const current = texts[tIdx];
    if (deleting) {
      el.textContent = current.substring(0, --cIdx);
      if (cIdx === 0) { deleting = false; tIdx = (tIdx + 1) % texts.length; setTimeout(type, 500); return; }
      setTimeout(type, 60);
    } else {
      el.textContent = current.substring(0, ++cIdx);
      if (cIdx === current.length) { deleting = true; setTimeout(type, 2000); return; }
      setTimeout(type, 90);
    }
  }
  type();
}

// ── Tooltip ───────────────────────────
function initTooltips() {
  document.querySelectorAll('[data-tooltip]').forEach(el => {
    const tip = document.createElement('div');
    tip.className = 'tooltip';
    tip.textContent = el.dataset.tooltip;
    tip.style.cssText = 'position:absolute;background:#1a1a2e;color:#fff;padding:6px 12px;border-radius:6px;font-size:0.78rem;white-space:nowrap;z-index:9999;pointer-events:none;opacity:0;transition:opacity 0.2s;';
    document.body.appendChild(tip);

    el.addEventListener('mouseenter', (e) => {
      const r = el.getBoundingClientRect();
      tip.style.left = r.left + window.scrollX + r.width / 2 - tip.offsetWidth / 2 + 'px';
      tip.style.top = r.top + window.scrollY - tip.offsetHeight - 8 + 'px';
      tip.style.opacity = '1';
    });
    el.addEventListener('mouseleave', () => { tip.style.opacity = '0'; });
  });
}

// ── Wave SVG Animation ───────────────────────────
function initWaves() {
  document.querySelectorAll('.animated-wave').forEach(svg => {
    // purely CSS driven via the SVG path animate
  });
}

// ── Init All ───────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  setActiveNav();
  initReveal();
  initCounters();
  initBackToTop();
  initFAQ();
  initProductFilter();
  initProductModal();
  initContactForm();
  initMapCanvas();
  initScrollProgress();
  initTypewriter();
  initTooltips();
  initParticles('particles-canvas');
  initDNAHelix('dna-canvas');
});
