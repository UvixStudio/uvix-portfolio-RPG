// ============================================
// SCROLL CONTROLLER — Hero Parallax System
// ============================================

const FRAMES = [
  {
    index: 0,
    id: 'frame-identity',
    accentColor: '#7C6FFF',
    glowColor: 'rgba(124,111,255,0.35)',
    charId: null,
    roleName: null,
    roleDesc: null
  },
  {
    index: 1,
    id: 'frame-architect',
    accentColor: '#9B59FF',
    glowColor: 'rgba(155,89,255,0.4)',
    charId: null,
    roleName: 'ARCHITECT',
    roleDesc: 'Designs the vision.<br/>Shapes systems that scale.'
  },
  {
    index: 2,
    id: 'frame-alchemist',
    accentColor: '#2ECC71',
    glowColor: 'rgba(46,204,113,0.4)',
    charId: null,
    roleName: 'ALCHEMIST',
    roleDesc: 'Transforms ideas into magic.<br/>Combines tools and intelligence.'
  },
  {
    index: 3,
    id: 'frame-engineer',
    accentColor: '#00D4FF',
    glowColor: 'rgba(0,212,255,0.4)',
    charId: null,
    roleName: 'ENGINEER',
    roleDesc: 'Builds the pipelines.<br/>Connects systems to flow.'
  },
  {
    index: 4,
    id: 'frame-storyteller',
    accentColor: '#F59E0B',
    glowColor: 'rgba(245,158,11,0.4)',
    charId: null,
    roleName: 'STORYTELLER',
    roleDesc: 'Turns complexity into meaning.<br/>Crafts stories that connect.'
  }
];

const FRAME_COUNT = FRAMES.length;

// ---- Pure functions (testable without DOM) ----

function getFrameIndex(scrollTop, windowHeight) {
  if (windowHeight === 0) return 0;
  const raw = Math.round(scrollTop / windowHeight);
  return Math.max(0, Math.min(FRAME_COUNT - 1, raw));
}

function getParallaxProgress(scrollTop, windowHeight) {
  if (windowHeight === 0) return 0;
  return (scrollTop % windowHeight) / windowHeight;
}

function applyParallaxOffsets(progress, windowHeight) {
  return {
    bgY:   progress * windowHeight * 0.30,
    charY: progress * windowHeight * 0.60,
    textY: progress * windowHeight * 1.00
  };
}

// ---- ScrollController ----

const ScrollController = {
  currentFrame: 0,
  isTransitioning: false,
  _rafId: null,

  init() {
    this.goToFrame(0);
    document.addEventListener('scroll', () => {
      if (this._rafId) return;
      this._rafId = requestAnimationFrame(() => {
        this._rafId = null;
        this._onScroll();
      });
    }, { passive: true });

    // Nav dot click handlers
    document.querySelectorAll('.nav-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        if (this.isTransitioning) return;
        const target = parseInt(dot.dataset.target, 10);
        this._scrollToFrame(target);
      });
    });

    // Touch support
    let touchStartY = 0;
    const sticky = document.getElementById('hero-sticky');
    if (sticky) {
      sticky.addEventListener('touchstart', e => {
        touchStartY = e.touches[0].clientY;
      }, { passive: true });
      sticky.addEventListener('touchend', e => {
        const delta = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(delta) < 30) return;
        const next = delta > 0
          ? Math.min(this.currentFrame + 1, FRAME_COUNT - 1)
          : Math.max(this.currentFrame - 1, 0);
        this._scrollToFrame(next);
      }, { passive: true });
    }
  },

  _onScroll() {
    const scrollTop = document.documentElement.scrollTop;
    const wh = window.innerHeight;
    const trackEl = document.getElementById('hero-track');
    if (!trackEl) return;

    const trackBottom = trackEl.offsetTop + trackEl.offsetHeight;
    // Only act while hero track is in scroll range
    if (scrollTop > trackBottom) return;

    const frameIndex = getFrameIndex(scrollTop, wh);
    const progress   = getParallaxProgress(scrollTop, wh);
    const offsets    = applyParallaxOffsets(progress, wh);

    // Apply parallax transforms
    const bgEl = document.getElementById('parallax-bg');
    if (bgEl) bgEl.style.transform = `translateY(${offsets.bgY}px)`;

    document.querySelectorAll('.parallax-text').forEach(el => {
      el.style.transform = `translateY(${offsets.textY * 0.08}px)`;
    });
    document.querySelectorAll('.parallax-char').forEach(el => {
      el.style.transform = `translateY(${offsets.charY * 0.06}px)`;
    });

    if (frameIndex !== this.currentFrame) {
      this.goToFrame(frameIndex);
    }
  },

  goToFrame(index) {
    const frame = FRAMES[index];
    if (!frame) return;

    this.currentFrame = index;
    this.isTransitioning = true;
    setTimeout(() => { this.isTransitioning = false; }, 600);

    // Show/hide frames
    document.querySelectorAll('.hero-frame').forEach(el => {
      const fi = parseInt(el.dataset.frame, 10);
      el.classList.toggle('is-active', fi === index);
    });

    this._updateNavIndicators(index);
    this._updateAccentColor(frame);

    // Typewriter for role frames
    if (index > 0) {
      const roleEl = document.querySelector(`#${frame.id} .role-text`);
      const descEl = document.querySelector(`#${frame.id} .role-desc`);
      if (roleEl) typeWriter(roleEl, frame.roleName, frame.accentColor, () => {
        if (descEl) {
          descEl.innerHTML = frame.roleDesc;
          descEl.style.opacity = '1';
        }
      });
      if (descEl) descEl.style.opacity = '0';
    }
  },

  _scrollToFrame(index) {
    const wh = window.innerHeight;
    window.scrollTo({ top: index * wh, behavior: 'smooth' });
  },

  _updateNavIndicators(activeIndex) {
    document.querySelectorAll('.nav-dot').forEach(dot => {
      const t = parseInt(dot.dataset.target, 10);
      const isActive = t === activeIndex;
      dot.classList.toggle('nav-dot--active', isActive);
      if (isActive) {
        dot.style.background = FRAMES[activeIndex].accentColor;
        dot.style.borderColor = FRAMES[activeIndex].accentColor;
        dot.style.boxShadow = `0 0 12px ${FRAMES[activeIndex].accentColor}`;
      } else {
        dot.style.background = '';
        dot.style.borderColor = '';
        dot.style.boxShadow = '';
      }
    });
  },

  _updateAccentColor(frame) {
    const sticky = document.getElementById('hero-sticky');
    if (sticky) sticky.style.setProperty('--current-accent', frame.accentColor);

    // Update char glow in active frame
    const glowEl = document.querySelector(`#${frame.id} .char-glow`);
    if (glowEl) {
      glowEl.style.background = `radial-gradient(ellipse, ${frame.glowColor} 0%, transparent 70%)`;
    }

    // Update parallax-bg glow color
    const bgEl = document.getElementById('parallax-bg');
    if (bgEl) {
      bgEl.style.setProperty('--glow-color', frame.glowColor);
    }
  },

  getCurrentFrame() {
    return this.currentFrame;
  }
};

// ---- Typewriter ----

function typeWriter(el, text, color, onDone) {
  el.style.color = color;
  const current = el.textContent;
  let i = current.length;

  function erase() {
    if (i > 0) {
      el.textContent = current.slice(0, --i);
      setTimeout(erase, 30);
    } else {
      let j = 0;
      function type() {
        if (j < text.length) {
          el.textContent = text.slice(0, ++j);
          setTimeout(type, 50);
        } else {
          if (onDone) onDone();
        }
      }
      setTimeout(type, 60);
    }
  }
  erase();
}

// ---- Init ----

document.addEventListener('DOMContentLoaded', () => {
  ScrollController.init();
});

// ---- Smooth scroll for nav links (non-hero) ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const id = this.getAttribute('href');
    const target = document.querySelector(id);
    if (target && id !== '#hero-track') {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
