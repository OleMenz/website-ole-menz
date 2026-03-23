/* ─────────────────────────────────────────────
   main.js – Ole Menz Personal Website
   ───────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Active Nav Link ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Mobile Nav Toggle ── */
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const spans = toggle.querySelectorAll('span');
      spans[0].style.transform = navLinks.classList.contains('open') ? 'translateY(7px) rotate(45deg)' : '';
      spans[1].style.opacity = navLinks.classList.contains('open') ? '0' : '1';
      spans[2].style.transform = navLinks.classList.contains('open') ? 'translateY(-7px) rotate(-45deg)' : '';
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  /* ── Custom Cursor ── */
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');

  if (dot && ring && window.innerWidth > 768) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';
    });

    (function animRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animRing);
    })();

    document.querySelectorAll('a, button, .card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.style.width  = '56px';
        ring.style.height = '56px';
        ring.style.borderColor = 'rgba(0,229,195,0.6)';
        dot.style.transform = 'translate(-50%, -50%) scale(0)';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width  = '36px';
        ring.style.height = '36px';
        ring.style.borderColor = 'rgba(108,99,255,0.5)';
        dot.style.transform = 'translate(-50%, -50%) scale(1)';
      });
    });
  }

  /* ── Scroll Reveal ── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger children
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, (entry.target.dataset.delay || 0));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
  }

  /* ── Skill Bars Animation ── */
  const skillFills = document.querySelectorAll('.skill-fill');
  if (skillFills.length) {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          fill.style.width = fill.dataset.pct + '%';
          barObserver.unobserve(fill);
        }
      });
    }, { threshold: 0.3 });
    skillFills.forEach(f => barObserver.observe(f));
  }

  /* ── Typing Effect (Hero) ── */
  const typingEl = document.getElementById('typing-text');
  if (typingEl) {
    const words = ['Informatik-Azubi', 'Web-Entwickler', 'Python-Enthusiast', 'Problem-Solver'];
    let wordIdx = 0, charIdx = 0, deleting = false;

    function type() {
      const current = words[wordIdx];
      typingEl.textContent = deleting
        ? current.slice(0, charIdx--)
        : current.slice(0, charIdx++);

      if (!deleting && charIdx > current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
      if (deleting && charIdx < 0) {
        deleting = false;
        charIdx = 0;
        wordIdx = (wordIdx + 1) % words.length;
      }
      setTimeout(type, deleting ? 55 : 90);
    }
    type();
  }

  /* ── Nav Scroll Effect ── */
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.background = window.scrollY > 20
        ? 'rgba(10,10,15,0.98)'
        : 'rgba(10,10,15,0.85)';
    }, { passive: true });
  }

  /* ── Contact Form ── */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      const btn = form.querySelector('button[type="submit"]');
      const name    = form.querySelector('#name').value.trim();
      const email   = form.querySelector('#email').value.trim();
      const message = form.querySelector('#message').value.trim();

      if (!name || !email || !message) {
        showToast('Bitte alle Felder ausfüllen.', 'error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Bitte eine gültige E-Mail-Adresse eingeben.', 'error');
        return;
      }

      btn.textContent = 'Wird gesendet…';
      btn.disabled = true;

      // Simulate send (replace with real endpoint)
      setTimeout(() => {
        showToast('Nachricht erfolgreich gesendet! Ich melde mich bald.', 'success');
        form.reset();
        btn.textContent = 'Nachricht senden';
        btn.disabled = false;
      }, 1200);
    });
  }

  /* ── Toast Notification ── */
  function showToast(msg, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    Object.assign(toast.style, {
      position:   'fixed',
      bottom:     '2rem',
      right:      '2rem',
      padding:    '1rem 1.5rem',
      borderRadius: '10px',
      background: type === 'success' ? '#1a2e25' : '#2e1a1a',
      color:      type === 'success' ? '#00e5c3' : '#ff6b6b',
      border:     `1px solid ${type === 'success' ? 'rgba(0,229,195,0.3)' : 'rgba(255,107,107,0.3)'}`,
      fontFamily: '"DM Mono", monospace',
      fontSize:   '0.85rem',
      zIndex:     '9999',
      boxShadow:  '0 8px 30px rgba(0,0,0,0.4)',
      animation:  'fadeUp 0.4s forwards',
    });
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.4s'; setTimeout(() => toast.remove(), 400); }, 4000);
  }

});
