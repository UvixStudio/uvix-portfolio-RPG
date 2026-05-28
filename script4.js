// ============================================
// ANIME.JS ANIMATIONS
// ============================================

// Typing effect for role titles
function typeRoleText(element, text, colorClass) {
  element.textContent = '';
  element.className = `role-text ${colorClass}`;
  
  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      element.textContent += text[i];
      i++;
    } else {
      clearInterval(interval);
    }
  }, 80);
}

// Frame 5 Typing Effect - Toggle between titles
let frame5TypingInterval = null;
function initFrame5Typing() {
  const titleEl = document.getElementById('frame5-title');
  if (!titleEl) return;
  
  const titles = [
    { html: 'Different roles,<br/><span style="font-style: italic; color: #9b5de5;">working as</span><span style="color: #9b5de5;"> one.</span>', delay: 4000 },
    { html: '<span style="color: #9b5de5;">Checkout</span> my <span style="font-style: italic; color: #A78BFA;">"Inventory"</span>', delay: 4000 }
  ];
  
  let currentIndex = 0;
  
  function typeTitle() {
    const current = titles[currentIndex];
    
    // Fade out
    anime({
      targets: titleEl,
      opacity: 0,
      duration: 500,
      easing: 'easeInOutQuad',
      complete: function() {
        // Update content
        titleEl.innerHTML = current.html;
        titleEl.style.opacity = '1';
        
        // Next title
        currentIndex = (currentIndex + 1) % titles.length;
        
        // Schedule next
        setTimeout(typeTitle, current.delay);
      }
    });
  }
  
  // Start typing
  setTimeout(typeTitle, 2000);
}

// Animate character entrance with anime.js
function animateCharacterEntrance(stageIndex) {
  const stage = document.getElementById(`char-stage-${stageIndex}`);
  if (!stage) return;
  
  const charImg = stage.querySelector('.char-img');
  const portalRings = stage.querySelectorAll('.portal-ring');
  const smokeContainer = stage.querySelector('.smoke-container');
  
  // Reset
  anime.set(charImg, { opacity: 0, translateY: 50 });
  anime.set(portalRings, { scale: 0.5, opacity: 0 });
  
  // Animate character
  anime({
    targets: charImg,
    opacity: [0, 1],
    translateY: [80, 0],
    duration: 1200,
    easing: 'easeOutExpo',
    delay: 300
  });
  
  // Animate portal rings
  anime({
    targets: portalRings,
    scale: [0.3, 1],
    opacity: [0, 0.6],
    duration: 1000,
    easing: 'easeOutElastic(1, 0.6)',
    delay: anime.stagger(150, { start: 200 })
  });
  
  // Smoke fade in
  anime({
    targets: smokeContainer,
    opacity: [0, 1],
    duration: 1500,
    easing: 'easeInOutQuad',
    delay: 500
  });
}

// Animate skills appearing
function animateSkills(frame) {
  const skills = frame.querySelectorAll('.skill-tag');
  if (skills.length === 0) return;
  
  anime({
    targets: skills,
    translateY: [20, 0],
    opacity: [0, 1],
    scale: [0.8, 1],
    duration: 600,
    easing: 'easeOutElastic(1, 0.8)',
    delay: anime.stagger(100, { start: 400 })
  });
}

// Animate unified role cards
function animateUnifiedCards() {
  const cards = document.querySelectorAll('.role-card');
  
  anime({
    targets: cards,
    translateY: [60, 0],
    opacity: [0, 1],
    duration: 800,
    easing: 'easeOutElastic(1, 0.7)',
    delay: anime.stagger(150, { start: 300 })
  });
}

// ============================================
// SMOKE EFFECT GENERATOR (with anime.js)
// ============================================
function createSmoke(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Create 12 smoke particles
  for (let i = 0; i < 12; i++) {
    const smoke = document.createElement('div');
    smoke.className = 'smoke';
    
    // Random size between 100px and 250px
    const size = 100 + Math.random() * 150;
    smoke.style.width = size + 'px';
    smoke.style.height = size + 'px';
    
    // Random horizontal position (mostly on the right side)
    const leftPos = 30 + Math.random() * 60;
    smoke.style.left = leftPos + '%';
    
    // Set initial state
    smoke.style.opacity = '0';
    
    container.appendChild(smoke);
    
    // Animate with anime.js
    anime({
      targets: smoke,
      translateY: [0, -350],
      translateX: () => anime.random(-50, 50),
      scale: [0.5, 1.5 + Math.random()],
      opacity: [
        { value: 0.18, duration: 800, easing: 'easeInOutQuad' },
        { value: 0.12, duration: 2000, easing: 'easeInOutQuad' },
        { value: 0, duration: 1200, easing: 'easeInOutQuad' }
      ],
      duration: 4000 + Math.random() * 3000,
      easing: 'easeInOutSine',
      delay: Math.random() * 5000,
      loop: true
    });
  }
}

// Initialize smoke for all character stages
createSmoke('smoke-1');
createSmoke('smoke-2');
createSmoke('smoke-3');
createSmoke('smoke-4');

// ============================================
// SCROLL-BASED PARALLAX HERO
// ============================================
const heroTrack = document.getElementById('hero-track');
const frames = document.querySelectorAll('.hero-frame');
const navDots = document.querySelectorAll('.nav-dot');

let currentFrame = 0;
let isTransitioning = false;

const roleData = [
  { title: 'ARCHITECT', color: 'role-text--purple' },
  { title: 'ALCHEMIST', color: 'role-text--green' },
  { title: 'ENGINEER', color: 'role-text--blue' },
  { title: 'STORYTELLER', color: 'role-text--cyan' }
];

function updateHeroFrame(progress) {
  const totalFrames = frames.length;
  const frameIndex = Math.min(Math.floor(progress * totalFrames), totalFrames - 1);
  
  if (frameIndex !== currentFrame && !isTransitioning) {
    isTransitioning = true;
    currentFrame = frameIndex;
    
    // Update frames
    frames.forEach((frame, index) => {
      frame.classList.toggle('is-active', index === frameIndex);
    });
    
    // Update nav dots
    navDots.forEach((dot, index) => {
      dot.classList.toggle('nav-dot--active', index === frameIndex);
    });
    
    // Animate character entrance for role frames (1-4)
    if (frameIndex >= 1 && frameIndex <= 4) {
      const roleIndex = frameIndex - 1;
      const roleText = frames[frameIndex].querySelector('.role-text');
      
      // Typing effect
      if (roleText && roleData[roleIndex]) {
        typeRoleText(roleText, roleData[roleIndex].title, roleData[roleIndex].color);
      }
      
      // Character entrance
      animateCharacterEntrance(roleIndex + 1);
      
      // Skills animation
      setTimeout(() => {
        animateSkills(frames[frameIndex]);
      }, 200);
    }
    
    // Unified frame animation
    if (frameIndex === 5) {
      setTimeout(() => {
        animateUnifiedCards();
      }, 300);
    }
    
    setTimeout(() => {
      isTransitioning = false;
    }, 800);
  }
}

// Scroll handler
window.addEventListener('scroll', () => {
  if (!heroTrack) return;
  
  const rect = heroTrack.getBoundingClientRect();
  const trackHeight = heroTrack.offsetHeight - window.innerHeight;
  const scrolled = -rect.top;
  const progress = Math.max(0, Math.min(1, scrolled / trackHeight));
  
  updateHeroFrame(progress);
}, { passive: true });

// Click on nav dots
navDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    if (isTransitioning) return;
    
    const targetFrame = index;
    const frameHeight = heroTrack.offsetHeight - window.innerHeight;
    const targetScroll = heroTrack.getBoundingClientRect().top + window.scrollY + (targetFrame / frames.length) * frameHeight;
    
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  });
});

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
// MOUSE PARALLAX ON CHARACTERS
// ============================================
document.addEventListener('mousemove', e => {
  const charStages = document.querySelectorAll('.char-stage');
  charStages.forEach(stage => {
    const rect = stage.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / window.innerWidth;
    const dy = (e.clientY - cy) / window.innerHeight;
    stage.style.transform = `translate(${dx * 15}px, ${dy * 8}px)`;
  });
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

// ============================================
// INITIALIZE FIRST FRAME
// ============================================
setTimeout(() => {
  frames[0].classList.add('is-active');
  navDots[0].classList.add('nav-dot--active');
}, 200);

// ============================================
// SCROLL REVEAL for sections
// ============================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => {
  observer.observe(el);
});

// ============================================
// CAROUSEL FUNCTIONALITY
// ============================================

const projects = [
  {
    img: 'extracted-images/page4_img5.jpeg',
    fallback: 'assets/google slide/ilovepdf_pages-to-jpg/Yuval Cohen Portfolio - Metano- Gamification and digital design_page-0004.jpg',
    title: 'CoderZ',
    role: 'Creative Director / Producer / Brand Owner · 2020–2023',
    desc: 'Led the end-to-end visual strategy scaling CoderZ from a startup into an award-winning global EdTech leader. Tripled annual course production, produced 100+ videos and live broadcasts, and led creative for global partnerships with LEGO Education and Amazon Future Engineer.',
    tags: ['EdTech', '3D', 'Gamification']
  },
  {
    img: 'extracted-images/page24_img5.jpeg',
    fallback: 'assets/google slide/ilovepdf_pages-to-jpg/Yuval Cohen Portfolio - Metano- Gamification and digital design_page-0024.jpg',
    title: 'Paymax AR',
    role: 'Senior Art Director & PM / Creative Lead',
    desc: 'Paymax (by Omni Group) is a pioneer in the lottery and gaming industry, redefining user engagement through immersive 3D and Augmented Reality (AR) experiences. Led multimillion-dollar deployments with the New York Lottery.',
    tags: ['AR', '3D', 'Gaming']
  },
  {
    img: 'extracted-images/page33_img17.jpeg',
    fallback: 'assets/google slide/ilovepdf_pages-to-jpg/Yuval Cohen Portfolio - Metano- Gamification and digital design_page-0033.jpg',
    title: 'Bone Bash',
    role: 'AI-Powered Game Concept',
    desc: 'Developed comprehensive mobile game concept and cinematic trailer using advanced AI video tools (Sora). Created full video trailer showcasing the future of cinematic game teasers. End-to-end AI workflow for game assets.',
    tags: ['AI', 'Game Design', '3D']
  },
  {
    img: 'extracted-images/page39_img5.jpeg',
    fallback: 'assets/google slide/ilovepdf_pages-to-jpg/Yuval Cohen Portfolio - Metano- Gamification and digital design_page-0039.jpg',
    title: 'Promee',
    role: 'Promotional Video - End-to-End Generative',
    desc: 'An artistic tribute to iconic Israeli creators, introducing Promee\'s vision through a fully generative post-production workflow. First end-to-end AI project leveraging Freepik (Imagery) and Kling 1.5 (Video) for cinematic execution.',
    tags: ['AI Video', 'Brand', 'Generative']
  },
  {
    img: 'extracted-images/page28_img7.jpeg',
    fallback: 'assets/google slide/ilovepdf_pages-to-jpg/Yuval Cohen Portfolio - Metano- Gamification and digital design_page-0028.jpg',
    title: 'The Next Big Bang in 3D',
    role: 'Featured Speaker · Ludo Conference 2023',
    desc: 'Presented pioneering workflow transforming 2D sketches into generative 3D immersive experiences. Showcased end-to-end AI pipeline from ideation to web deployment, reframing the role of AI in storytelling and digital culture.',
    tags: ['Speaking', '3D', 'AI']
  },
  {
    img: 'extracted-images/page17_img5.jpeg',
    fallback: 'assets/google slide/ilovepdf_pages-to-jpg/Yuval Cohen Portfolio - Metano- Gamification and digital design_page-0017.jpg',
    title: 'Ludo Conference',
    role: 'Speaking · 2023',
    desc: 'Presented pioneering workflow transforming 2D sketches into generative 3D immersive experiences at Ludo Conference 2023.',
    tags: ['Speaking', 'Conference']
  }
];

let currentProjectIndex = 0;

function carouselHover(index) {
  currentProjectIndex = index;
  updateCarousel(index);
}

function carouselLeave(index) {
  // Keep current selection
}

function updateCarousel(index) {
  const project = projects[index];
  if (!project) return;

  const mainImg = document.getElementById('carousel-main-img');
  const mainTitle = document.getElementById('carousel-main-title');
  const mainRole = document.getElementById('carousel-main-role');
  const mainDesc = document.getElementById('carousel-main-desc');

  if (mainImg) {
    mainImg.src = project.img;
    mainImg.onerror = function() {
      this.src = project.fallback;
    };
  }
  
  if (mainTitle) mainTitle.textContent = project.title;
  if (mainRole) mainRole.textContent = project.role;
  if (mainDesc) mainDesc.textContent = project.desc;

  // Update thumbnails border
  document.querySelectorAll('.carousel-thumb').forEach((thumb, i) => {
    if (i === index) {
      thumb.style.borderColor = 'rgba(155,93,229,0.5)';
    } else {
      thumb.style.borderColor = 'transparent';
    }
  });
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Frame 5 typing effect
  setTimeout(() => {
    initFrame5Typing();
  }, 1000);
});
