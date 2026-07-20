/* ========================================
   PORTFOLIO JAVASCRIPT
   Rudra Sanandiya — Portfolio
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // PRELOADER / INTRO ANIMATION
  // ==========================================
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('exit');
      document.body.classList.remove('preloader-active');
      
      // Trigger the premium entrance animation
      playEntranceAnimation();
      
      setTimeout(() => {
        preloader.remove();
        // Refresh ScrollTrigger calculations after preloader is removed and page scroll is unlocked
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      }, 1000);
    }, 3600); // Decreased total preloader reading time to 3.6s
  } else {
    playEntranceAnimation();
  }

  // Helper to determine which section is currently active in the viewport on page load/refresh
  function getActiveSection() {
    const scrollPosition = window.scrollY + window.innerHeight / 3;
    const hero = document.getElementById('home');
    let activeSection = hero;
    
    const sections = document.querySelectorAll('.section');
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      if (scrollPosition >= top && scrollPosition <= bottom) {
        activeSection = sec;
      }
    });
    return activeSection || hero;
  }

  // Play a premium springy iOS-style pop-up entrance animation for the visible section
  function playEntranceAnimation() {
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline({
      onComplete: () => {
        // Initialize ScrollTrigger animations AFTER the entrance animation is complete
        initScrollAnimations();
      }
    });

    // 1. Softly scale and fade in the mesh blobs and particle network canvas
    tl.fromTo('.mesh-background', 
      { opacity: 0, scale: 0.9 }, 
      { opacity: 1, scale: 1, duration: 1.2, ease: "power4.out" }
    );

    tl.fromTo('#networkCanvas', 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.8 },
      "-=1.0"
    );

    // 2. Slide in the navbar — only animate opacity + slide via CSS keyframe
    // IMPORTANT: navbar uses transform:translateX(-50%) for centering.
    // GSAP's `y` property would overwrite translateX, breaking the centering.
    // So we drive the slide via a CSS animation on `top` and let GSAP only drive opacity.
    const navbarEl = document.querySelector('.navbar');
    if (navbarEl) {
      gsap.set('.navbar', { opacity: 0 }); // Hide via GSAP (not CSS) — clearProps later restores visibility
      navbarEl.style.animation = 'navbarSlideIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards';
      tl.to('.navbar',
        { 
          opacity: 1, 
          duration: 0.7, 
          ease: "power3.out",
          onComplete: () => gsap.set('.navbar', { clearProps: 'opacity' })
        },
        "-=1.1"
      );
    }

    // 3. Find the active section based on current scroll position
    const activeSection = getActiveSection();

    if (activeSection && activeSection.classList.contains('hero')) {
      // Set hero elements invisible NOW via GSAP (not CSS) so they start hidden
      // but naturally revert to visible once GSAP inline styles are cleared
      const heroEls = ['.hero-greeting', '.hero-name', '.hero-badge', '.hero-tagline', '.hero-actions'];
      gsap.set(heroEls, { opacity: 0, y: 40, scale: 0.95, filter: 'blur(4px)' });

      // Stagger-pop the hero content quickly
      tl.to(heroEls,
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          filter: "blur(0px)",
          duration: 0.9, 
          ease: "back.out(1.2)",
          stagger: 0.08,
          // After animation: strip ALL GSAP inline styles so hero uses natural CSS (visible)
          // This makes the hero permanently visible regardless of future GSAP operations
          onComplete: () => gsap.set(heroEls, { clearProps: 'all' })
        },
        "-=0.9"
      );
    } else if (activeSection) {
      // Animating a sub-section if we loaded/refreshed directly onto it
      const title = activeSection.querySelector('.section-title');
      const subtitle = activeSection.querySelector('.section-subtitle');
      const content = activeSection.querySelector('.about-grid, .projects-grid, .timeline, .achievements-bento, .contact-content');

      // Skills section: stagger individual bento cards for premium tile-by-tile pop
      if (activeSection.id === 'skills') {
        const bentoCards = activeSection.querySelectorAll('.bento-card');
        const elementsToAnimate = [title, subtitle].filter(el => el !== null);

        if (elementsToAnimate.length > 0) {
          gsap.set(elementsToAnimate, { opacity: 0 });
          tl.fromTo(elementsToAnimate,
            { opacity: 0, y: 30, filter: "blur(4px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "power3.out", stagger: 0.08 },
            "-=0.9"
          );
        }
        if (bentoCards.length > 0) {
          gsap.set(bentoCards, { opacity: 0 });
          tl.fromTo(bentoCards,
            { opacity: 0, y: 30, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.2)", stagger: 0.06 },
            "-=0.5"
          );
        }
      } else {
        const elementsToAnimate = [title, subtitle, content].filter(el => el !== null);

        if (elementsToAnimate.length > 0) {
          gsap.set(elementsToAnimate, { opacity: 0 });

          tl.fromTo(elementsToAnimate,
            { 
              opacity: 0, 
              y: 40, 
              scale: 0.95, 
              filter: "blur(4px)" 
            },
            { 
              opacity: 1, 
              y: 0, 
              scale: 1, 
              filter: "blur(0px)",
              duration: 0.9, 
              ease: "back.out(1.2)", 
              stagger: 0.1 
            },
            "-=0.9"
          );
        }
      }
    }
  }

  // ==========================================
  // MERMAID.JS CONFIGURATION
  // ==========================================
  if (window.mermaid) {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
      themeVariables: {
        background: 'transparent',
        primaryColor: '#1e1b4b',
        primaryTextColor: '#ede9fe',
        primaryBorderColor: '#818cf8',
        lineColor: '#818cf8',
        secondaryColor: '#4c1d95',
        tertiaryColor: '#134e4a'
      }
    });
  }

  // ==========================================
  // CUSTOM CURSOR & MAGNETIC BUTTONS
  // ==========================================
  const cursor = document.getElementById('customCursor');
  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      cursor.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
    });

    const hoverElements = document.querySelectorAll('a, button, .project-card');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }



  // ==========================================
  // NEURAL NETWORK / CONSTELLATION CANVAS
  // ==========================================
  const netCanvas = document.getElementById('networkCanvas');
  if (netCanvas) {
    const ctx = netCanvas.getContext('2d');
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let nodes = [];
    let resizePending = false;
    let lastFrameTime = null;

    const NOMINAL_FRAME_DURATION = 1000 / 60;
    const MAX_FRAME_DELTA = 50;
    const MAX_PIXEL_RATIO = 2;
    
    // Mouse tracking for the network
    const mouse = { x: null, y: null, radius: 150 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });
    
    class Node {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.radius = Math.random() * 1.5 + 0.5;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(231, 76, 60, 0.8)';
        ctx.fill();
      }

      update(frameScale) {
        this.x += this.vx * frameScale;
        this.y += this.vy * frameScale;

        // Reflect overshoot back into the canvas so a delayed frame cannot
        // leave a node outside the visible area.
        if (this.x < 0) {
          this.x = -this.x;
          this.vx = Math.abs(this.vx);
        } else if (this.x > width) {
          this.x = width - (this.x - width);
          this.vx = -Math.abs(this.vx);
        }

        if (this.y < 0) {
          this.y = -this.y;
          this.vy = Math.abs(this.vy);
        } else if (this.y > height) {
          this.y = height - (this.y - height);
          this.vy = -Math.abs(this.vy);
        }

        this.draw();
      }
    }

    function getTargetNodeCount() {
      const isMobile = width < 768;
      const maximum = isMobile ? 60 : 150;
      return Math.round(Math.max(40, Math.min((width * height) / 12000, maximum)));
    }

    function createNode() {
      return new Node(Math.random() * width, Math.random() * height);
    }

    function initNodes() {
      nodes = Array.from({ length: getTargetNodeCount() }, createNode);
    }

    function reconcileNodeCount() {
      const targetCount = getTargetNodeCount();

      while (nodes.length < targetCount) {
        nodes.push(createNode());
      }

      if (nodes.length > targetCount) {
        nodes.length = targetCount;
      }
    }

    function resizeCanvas() {
      const bounds = netCanvas.getBoundingClientRect();
      const nextWidth = Math.max(
        1,
        Math.round(bounds.width || document.documentElement.clientWidth || window.innerWidth)
      );
      const nextHeight = Math.max(
        1,
        Math.round(bounds.height || document.documentElement.clientHeight || window.innerHeight)
      );
      const nextPixelRatio = Math.min(
        MAX_PIXEL_RATIO,
        Math.max(1, window.devicePixelRatio || 1)
      );
      const dimensionsChanged = nextWidth !== width || nextHeight !== height;
      const pixelRatioChanged = nextPixelRatio !== pixelRatio;

      if (!dimensionsChanged && !pixelRatioChanged) return;

      const previousWidth = width || nextWidth;
      const previousHeight = height || nextHeight;
      width = nextWidth;
      height = nextHeight;
      pixelRatio = nextPixelRatio;

      // Keep drawing coordinates in CSS pixels while rendering sharply on
      // high-density mobile screens.
      netCanvas.width = Math.round(width * pixelRatio);
      netCanvas.height = Math.round(height * pixelRatio);
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      if (nodes.length === 0) {
        initNodes();
      } else {
        // Preserve every existing node and its direction. Scaling positions
        // prevents orientation/layout changes from looking like a new field.
        const scaleX = width / previousWidth;
        const scaleY = height / previousHeight;
        nodes.forEach((node) => {
          node.x = Math.min(width, Math.max(0, node.x * scaleX));
          node.y = Math.min(height, Math.max(0, node.y * scaleY));
        });
        reconcileNodeCount();
      }

      // Resizing clears the canvas. Reset only the frame clock—not particles—
      // so the next frame cannot catch up with one large visual jump.
      lastFrameTime = null;
    }

    function scheduleResize() {
      // Consume the resize at the beginning of the next animation frame. This
      // ensures resizing cannot clear a frame after it has already been drawn.
      resizePending = true;
    }

    function connectNodes() {
      for (let a = 0; a < nodes.length; a++) {
        for (let b = a + 1; b < nodes.length; b++) {
          const dx = nodes[a].x - nodes[b].x;
          const dy = nodes[a].y - nodes[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(231, 76, 60, ${1 - dist / 120})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(nodes[a].x, nodes[a].y);
            ctx.lineTo(nodes[b].x, nodes[b].y);
            ctx.stroke();
          }
        }
        
        // Connect to mouse
        if (mouse.x != null && mouse.y != null) {
          const dx = nodes[a].x - mouse.x;
          const dy = nodes[a].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.8 - dist / mouse.radius})`;
            ctx.lineWidth = 1;
            ctx.moveTo(nodes[a].x, nodes[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
    }

    function animate(timestamp) {
      // Some browsers keep issuing heavily throttled frames in background
      // tabs. Never advance the field while it cannot be seen.
      if (document.hidden) {
        lastFrameTime = null;
        requestAnimationFrame(animate);
        return;
      }

      const currentPixelRatio = Math.min(
        MAX_PIXEL_RATIO,
        Math.max(1, window.devicePixelRatio || 1)
      );

      // Resize before drawing so the canvas cannot be cleared after this
      // frame. Checking DPR here also catches zoom/display changes that do not
      // dispatch a window resize event.
      if (resizePending || currentPixelRatio !== pixelRatio) {
        resizePending = false;
        resizeCanvas();
      }

      const elapsed = lastFrameTime === null
        ? NOMINAL_FRAME_DURATION
        : timestamp - lastFrameTime;
      lastFrameTime = timestamp;

      // requestAnimationFrame may be throttled during mobile browser UI work.
      // Time-based movement keeps normal low-FPS motion consistent, while the
      // cap prevents a suspended frame from jumping to a seemingly new pattern.
      const frameScale = Math.min(Math.max(elapsed, 0), MAX_FRAME_DELTA)
        / NOMINAL_FRAME_DURATION;

      ctx.clearRect(0, 0, width, height);
      nodes.forEach((node) => node.update(frameScale));
      connectNodes();
      requestAnimationFrame(animate);
    }

    function resetFrameClock() {
      lastFrameTime = null;
    }

    window.addEventListener('resize', scheduleResize, { passive: true });
    window.addEventListener('pageshow', resetFrameClock);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) resetFrameClock();
    });

    resizeCanvas();
    requestAnimationFrame(animate);
  }

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

  // Smooth scroll with navbar offset & GSAP animation resolution
  const scrollOffset = 10; // Small offset — section's own 100px padding places title below navbar

  /**
   * Scrolls to a target section with proper navbar offset.
   * Immediately resolves any pending GSAP animation so the section
   * doesn't visually shift after the scroll lands.
   */
  function scrollToSection(targetSection, sectionId) {
    // Immediately complete any pending GSAP animation on this section
    if (typeof gsap !== 'undefined') {
      gsap.set(targetSection, { opacity: 1, y: 0, clearProps: 'transform' });
      // Also reveal project cards if scrolling to the projects section
      if (sectionId === 'projects') {
        gsap.set('.project-card', { opacity: 1, y: 0, clearProps: 'transform' });
      }
    }

    // Programmatic smooth scroll with correct offset
    const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - scrollOffset;
    window.scrollTo({
      top: Math.max(0, targetPosition),
      behavior: 'smooth'
    });
  }

  // Nav link click handler
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      // Close mobile menu
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');

      const href = link.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const targetSection = document.querySelector(href);
        if (targetSection) {
          scrollToSection(targetSection, href.substring(1));
        }
      }
    });
  });

  // Handle ALL other in-page anchor links (e.g. hero "Let's Connect" button)
  document.querySelectorAll('a[href^="#"]:not(.nav-link)').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href && href.length > 1) {
        const targetSection = document.querySelector(href);
        if (targetSection) {
          e.preventDefault();
          scrollToSection(targetSection, href.substring(1));
        }
      }
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  function updateActiveLink() {
    const scrollY = window.scrollY + 110; // ~navbar(80) + section padding offset for title detection
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
      navigator.clipboard.writeText('rudrasanandiya.dev@gmail.com').then(() => {
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

  // Initialize scroll triggered animations for other sections
  function initScrollAnimations() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Find the active section that was already animated during entrance
      const activeSection = getActiveSection();

      // Staggered reveal for sections
      gsap.utils.toArray('.section').forEach(section => {
        // Skip animating the active section to prevent double animations
        if (section === activeSection) {
          gsap.set(section, { opacity: 1, y: 0 });
          return;
        }

        gsap.fromTo(section, 
          { opacity: 0, y: 50 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 1, 
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
            }
          }
        );
      });

      // Staggered reveal for project cards (only if the projects section wasn't active on load)
      if (!activeSection || activeSection.id !== 'projects') {
        gsap.fromTo('.project-card',
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: '.projects-grid',
              start: "top 75%",
            }
          }
        );
      }

      // Staggered reveal for bento cards inside skills section
      // (only if skills section wasn't active on load — that case is handled by playEntranceAnimation)
      if (!activeSection || activeSection.id !== 'skills') {
        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
          const bentoCards = skillsSection.querySelectorAll('.bento-card');
          gsap.fromTo(bentoCards,
            { opacity: 0, y: 30, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              stagger: 0.08,
              ease: "back.out(1.2)",
              scrollTrigger: {
                trigger: skillsSection.querySelector('.bento-grid'),
                start: "top 80%",
              }
            }
          );
        }
      }
    }
  }

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
  // PROJECT CARD MOUSE GLOW + 3D TILT EFFECT
  // ==========================================
  const tiltCards = document.querySelectorAll('.project-card, .achievement-card, .bento-card');
  const maxTilt = 5; // degrees — subtle for premium feel
  const isTouchDevice = window.matchMedia('(hover: none)').matches;

  tiltCards.forEach(card => {
    if (isTouchDevice) {
      // Only set glow position on touch devices, no tilt
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      });
      return;
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Mouse glow position
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // 3D tilt — cursor side presses down, opposite lifts
      const rotateX = (-(y - centerY) / centerY * maxTilt).toFixed(2);
      const rotateY = ((x - centerX) / centerX * maxTilt).toFixed(2);

      // Fast transition during active tilt for responsive tracking
      card.style.transition = 'transform 0.08s ease-out';
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      // Smooth spring-back reset
      card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
      card.style.transform = '';
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

    // Trigger Mermaid dynamic compiler for rendered diagram tags
    if (window.mermaid) {
      setTimeout(() => {
        // Compile nodes that are either active in tabs or not part of any tab switcher
        const mermaidNodes = modalContent.querySelectorAll('.mermaid');
        mermaidNodes.forEach(node => {
          const tabParent = node.closest('.architecture-tab-content');
          if (!tabParent || tabParent.classList.contains('active')) {
            mermaid.run({
              nodes: [node]
            });
          }
        });
      }, 50); // Short tick to ensure container fully populates
    }
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

  // ==========================================
  // ARCHITECTURE DIAGRAMS TABS SWITCHER
  // ==========================================
  document.addEventListener('click', (e) => {
    const tabBtn = e.target.closest('.arch-tab-btn');
    if (tabBtn) {
      const tabId = tabBtn.dataset.tab;
      const container = tabBtn.closest('.modal-extra-section');
      if (container) {
        // Toggle Active Tab Selector Class
        container.querySelectorAll('.arch-tab-btn').forEach(btn => btn.classList.remove('active'));
        tabBtn.classList.add('active');

        // Toggle Active Content Panel Container
        container.querySelectorAll('.architecture-tab-content').forEach(content => content.classList.remove('active'));
        const activePanel = container.querySelector(`#${tabId}`);
        if (activePanel) {
          activePanel.classList.add('active');

          // Dynamically render Mermaid diagram inside the newly active panel if it hasn't been rendered yet
          const mermaidDiv = activePanel.querySelector('.mermaid');
          if (mermaidDiv && !mermaidDiv.getAttribute('data-processed')) {
            if (window.mermaid) {
              setTimeout(() => {
                mermaid.run({
                  nodes: [mermaidDiv]
                });
              }, 50); // Short timeout to let the container compute its active display bounds
            }
          }
        }
      }
    }
  });

  // ==========================================
  // ARCHITECTURE LIGHTBOX (SVG ZOOM & PAN)
  // ==========================================
  const lightbox = document.getElementById('diagramLightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxClose = document.getElementById('lightboxClose');
  const zoomInBtn = document.getElementById('zoomInBtn');
  const zoomOutBtn = document.getElementById('zoomOutBtn');
  const zoomResetBtn = document.getElementById('zoomResetBtn');
  const zoomLevelText = document.getElementById('zoomLevel');

  let isDragging = false;
  let startX, startY;
  let translateX = 0, translateY = 0;
  let scale = 1;
  let activeSvg = null;

  function updateTransform() {
    if (activeSvg) {
      activeSvg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
      zoomLevelText.textContent = `${Math.round(scale * 100)}%`;
    }
  }

  // Bind Maximize buttons inside EJS dynamic diagram nodes
  document.addEventListener('click', (e) => {
    const expandBtn = e.target.closest('.diagram-expand-btn');
    if (expandBtn) {
      const container = expandBtn.closest('.mermaid-container');
      const renderedSvg = container?.querySelector('.mermaid svg');
      if (renderedSvg) {
        // Show Lightbox overlay
        lightbox.classList.add('active');
        document.body.classList.add('lightbox-open');

        // Clone parsed Mermaid SVG node to keep original modal state
        const clone = renderedSvg.cloneNode(true);
        clone.removeAttribute('width');
        clone.removeAttribute('height');
        clone.style.width = '100%';
        clone.style.height = '100%';
        clone.style.maxWidth = '100%';
        clone.style.maxHeight = '100%';
        clone.style.transformOrigin = 'center';

        lightboxContent.innerHTML = '';
        lightboxContent.appendChild(clone);
        activeSvg = clone;

        // Reset positions
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
      }
    }
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.classList.remove('lightbox-open');
    activeSvg = null;
  }

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    // Close on backdrop container clicking
    if (e.target === lightbox || e.target === lightboxContent) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // Action Buttons handlers
  zoomInBtn.addEventListener('click', () => {
    scale = Math.min(scale + 0.15, 3.0);
    updateTransform();
  });

  zoomOutBtn.addEventListener('click', () => {
    scale = Math.max(scale - 0.15, 0.4);
    updateTransform();
  });

  zoomResetBtn.addEventListener('click', () => {
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();
  });

  // Mouse drag coordinate tracker
  lightboxContent.addEventListener('mousedown', (e) => {
    if (!activeSvg) return;
    isDragging = true;
    activeSvg.style.cursor = 'grabbing';
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging || !activeSvg) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    updateTransform();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    if (activeSvg) {
      activeSvg.style.cursor = 'grab';
    }
  });

  // Touch screen dragging operations for smartphones/tablets
  lightboxContent.addEventListener('touchstart', (e) => {
    if (!activeSvg || e.touches.length !== 1) return;
    isDragging = true;
    startX = e.touches[0].clientX - translateX;
    startY = e.touches[0].clientY - translateY;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || !activeSvg || e.touches.length !== 1) return;
    translateX = e.touches[0].clientX - startX;
    translateY = e.touches[0].clientY - startY;
    updateTransform();
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

});
