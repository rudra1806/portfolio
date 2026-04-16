/* ========================================
   PORTFOLIO JAVASCRIPT
   Rudra Sanandiya — Portfolio
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // PARTICLE CANVAS
  // ==========================================
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrameId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
      this.pulsePhase = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulsePhase += this.pulseSpeed;
      this.currentOpacity = this.opacity + Math.sin(this.pulsePhase) * 0.15;

      if (this.x < -10 || this.x > canvas.width + 10 ||
        this.y < -10 || this.y > canvas.height + 10) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 200, 220, ${Math.max(0, this.currentOpacity)})`;
      ctx.fill();
    }
  }

  function initParticles() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80);
    particles = Array.from({ length: count }, () => new Particle());
  }
  initParticles();

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    animFrameId = requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ==========================================
  // NAVBAR
  // ==========================================
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const allNavLinks = document.querySelectorAll('.nav-link[data-section]');

  // Scroll class tracking removed as per request to keep navbar static

  // Mobile menu
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  function updateActiveLink() {
    const scrollY = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      const link = document.querySelector(`.nav-link[data-section="${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          allNavLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();

  // ==========================================
  // COPY EMAIL
  // ==========================================
  const copyBtn = document.getElementById('copyEmail');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('rudrapatelrds09@gmail.com').then(() => {
        const icon = copyBtn.querySelector('i');
        icon.className = 'fa-solid fa-check';
        copyBtn.style.color = '#4ade80';
        setTimeout(() => {
          icon.className = 'fa-regular fa-copy';
          copyBtn.style.color = '';
        }, 2000);
      });
    });
  }

  // ==========================================
  // RESUME BUTTON
  // ==========================================
  const resumeBtn = document.getElementById('resumeBtn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open('https://drive.google.com/file/d/1AX0bWETN3RqAu33STVEj-p5m8__5mokd/view?usp=sharing', '_blank');
    });
  }

  // ==========================================
  // STAT NUMBER COUNTER
  // ==========================================
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const isDecimal = target % 1 !== 0;
        const duration = 1500;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
          step++;
          current += increment;
          if (step >= steps) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = isDecimal ? current.toFixed(2) + suffix : Math.floor(current) + suffix;
        }, duration / steps);

        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  // ==========================================
  // SCROLL REVEAL
  // ==========================================
  const revealElements = [
    ...document.querySelectorAll('.about-grid'),
    ...document.querySelectorAll('.project-card'),
    ...document.querySelectorAll('.bento-card'),
    ...document.querySelectorAll('.skill-category'),
    ...document.querySelectorAll('.timeline-item'),
    ...document.querySelectorAll('.achievement-card'),
    ...document.querySelectorAll('.contact-content'),
  ];

  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
    revealObserver.observe(el);
  });

  // ==========================================
  // BACK TO TOP
  // ==========================================
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ==========================================
  // CONTACT FORM
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;

      // Validate hCaptcha
      const hCaptchaField = contactForm.querySelector('textarea[name=h-captcha-response]');
      if (hCaptchaField && !hCaptchaField.value) {
        alert('Please complete the captcha before sending.');
        return;
      }

      // Show loading state
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      try {
        const formData = new FormData(contactForm);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          btn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
          btn.style.background = '#059669';
          contactForm.reset();
        } else {
          btn.innerHTML = '<i class="fa-solid fa-xmark"></i> Failed — Try Again';
          btn.style.background = '#dc2626';
        }
      } catch (error) {
        btn.innerHTML = '<i class="fa-solid fa-xmark"></i> Error — Try Again';
        btn.style.background = '#dc2626';
      }

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    });
  }

  // ==========================================
  // PROJECT CARD MOUSE GLOW EFFECT
  // ==========================================
  const glowCards = document.querySelectorAll('.project-card, .achievement-card, .bento-card');
  glowCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // ==========================================
  // PROJECT DETAIL MODAL
  // ==========================================
  const modalOverlay = document.getElementById('projectModal');
  const modalContent = document.getElementById('projectModalContent');
  const modalCloseBtn = document.getElementById('projectModalClose');

  function openProjectModal(card) {
    // Read data from the card
    const nameEl = card.querySelector('.project-name a');
    const name = nameEl ? nameEl.textContent.trim() : '';
    const isAccent = card.querySelector('.project-name-accent') !== null;
    const type = card.querySelector('.project-type')?.textContent || '';
    const desc = card.querySelector('.project-details .project-desc')?.innerHTML || '';
    const highlightsEl = card.querySelectorAll('.project-details .highlight-item');
    const tagsEl = card.querySelectorAll('.project-brief .project-tags span');
    const linksEl = card.querySelectorAll('.project-brief .project-links a');

    // Build highlights HTML
    let highlightsHTML = '';
    highlightsEl.forEach(item => {
      const icon = item.querySelector('i')?.outerHTML || '';
      const strong = item.querySelector('strong')?.textContent || '';
      const span = item.querySelector('span')?.textContent || '';
      highlightsHTML += `
        <div class="modal-highlight-item">
          ${icon}
          <div>
            <strong>${strong}</strong>
            <span>${span}</span>
          </div>
        </div>`;
    });

    // Build tags HTML
    let tagsHTML = '';
    tagsEl.forEach(tag => {
      tagsHTML += `<span>${tag.textContent}</span>`;
    });

    // Build action links HTML
    let actionsHTML = '';
    linksEl.forEach(link => {
      const href = link.getAttribute('href');
      const text = link.textContent.trim();
      const isLive = text.toLowerCase().includes('live');
      actionsHTML += `<a href="${href}" target="_blank" rel="noopener" class="modal-action-btn ${isLive ? 'btn-live' : 'btn-code'}">
        ${link.querySelector('i')?.outerHTML || ''} ${text}
      </a>`;
    });

    // Build modal content
    // Also read extra sections (architecture, tech badges, deployment, features)
    const extraSections = card.querySelectorAll('.project-details .project-extra-section');
    let extraHTML = '';
    extraSections.forEach(section => {
      const title = section.getAttribute('data-extra-title') || '';
      extraHTML += `
        <div class="modal-extra-section">
          <div class="modal-divider"></div>
          <p class="modal-extra-title">${title}</p>
          ${section.innerHTML}
        </div>`;
    });

    modalContent.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-name ${isAccent ? 'modal-name-accent' : ''}">${name}</h3>
        <p class="modal-type">${type}</p>
      </div>
      <div class="modal-divider"></div>
      <p class="modal-desc">${desc}</p>
      ${highlightsHTML ? `
        <p class="modal-highlights-title">Key Features</p>
        <div class="modal-highlights">${highlightsHTML}</div>
      ` : ''}
      ${extraHTML}
      <div class="modal-divider"></div>
      <div class="modal-tags">${tagsHTML}</div>
      <div class="modal-actions">${actionsHTML}</div>
    `;

    // Show the modal
    modalOverlay.classList.add('active');
    document.body.classList.add('modal-open');
    // Ensure modal starts scrolled to top
    modalOverlay.querySelector('.project-modal').scrollTop = 0;
  }

  function closeProjectModal() {
    modalOverlay.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  // Attach to all "View Details" buttons
  const expandBtns = document.querySelectorAll('.project-expand-btn');
  expandBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = btn.getAttribute('data-target');
      const card = document.getElementById(targetId);
      if (card) openProjectModal(card);
    });
  });

  // Close on X button
  modalCloseBtn.addEventListener('click', closeProjectModal);

  // Close on backdrop click
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeProjectModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeProjectModal();
    }
  });

});
