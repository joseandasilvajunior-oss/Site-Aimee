/**
 * AIMÉE — SOCIAL MEDIA | MAIN INTERACTIVITY MODULE
 * Handles navigation, scroll animations, unified services & portfolio filtering,
 * service pre-fill and smart WhatsApp proposal form integration.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initUnifiedFilters();
  initServicePrefill();
  initContactForm();
  initInstagramSimulation();
  initHeroScrollScrub();
});

/**
 * 1. Sticky Navbar & Active Section Highlighting
 */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const heroSection = document.getElementById('inicio');
  const navLinks = document.querySelectorAll('.navbar__link');
  const sections = document.querySelectorAll('section[id]');

  const handleScroll = () => {
    // A barra branca superior só deve aparecer quando o gif termina e o site finalmente desce para as próximas seções.
    // Enquanto o usuário estiver na hero section vendo o gif, a navbar permanece idêntica ao modelo original (escura/transparente).
    let threshold = 50;
    if (heroSection) {
      const scrollDistance = heroSection.offsetHeight - window.innerHeight;
      if (scrollDistance > 0) {
        threshold = scrollDistance - 20;
      }
    }

    if (window.scrollY > threshold) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll, { passive: true });
  handleScroll();

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.toggle(
                'is-active',
                link.getAttribute('href') === `#${id}`
              );
            });
          }
        });
      },
      { rootMargin: '-30% 0px -50% 0px' }
    );

    sections.forEach((sec) => sectionObserver.observe(sec));
  }
}

/**
 * 2. Mobile Navigation Drawer
 */
function initMobileMenu() {
  const navbar = document.getElementById('navbar');
  const toggleBtn = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link, .mobile-menu__cta');

  if (!toggleBtn || !mobileMenu) return;

  const closeMenu = () => {
    navbar.classList.remove('menu-open');
    mobileMenu.classList.remove('is-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    navbar.classList.toggle('menu-open', isOpen);
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });
}

/**
 * 3. Smooth Scroll Reveal Transitions
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]');

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/**
 * 4. Unified Services & Portfolio Filters
 */
function initUnifiedFilters() {
  const filterButtons = document.querySelectorAll('[data-filter]');
  const cards = document.querySelectorAll('.sp-card');

  if (!filterButtons.length || !cards.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');

      filterButtons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', String(active));
      });

      cards.forEach((card) => {
        const category = card.getAttribute('data-category');
        const shouldShow = filterValue === 'todos' || category === filterValue;

        if (shouldShow) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });
}

/**
 * 5. Pre-fill Proposal Form when clicking a Service CTA
 */
function initServicePrefill() {
  const serviceTriggers = document.querySelectorAll('[data-select-service]');
  const serviceSelect = document.getElementById('servicoInteresse');
  const messageInput = document.getElementById('mensagemProjeto');

  if (!serviceTriggers.length || !serviceSelect) return;

  serviceTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const targetService = trigger.getAttribute('data-select-service');
      if (targetService) {
        serviceSelect.value = targetService;
        if (messageInput && !messageInput.value.trim()) {
          messageInput.placeholder = `Olá Aimée! Gostaria de saber mais sobre ${targetService} para a minha marca...`;
        }
      }
    });
  });
}

/**
 * 6. Proposal Form Submission -> WhatsApp
 */
function initContactForm() {
  const form = document.getElementById('proposalForm');
  const feedback = document.getElementById('formFeedback');
  const feedbackText = document.getElementById('formFeedbackText');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nomeCliente').value.trim();
    const empresa = document.getElementById('empresaInstagram').value.trim();
    const servico = document.getElementById('servicoInteresse').value;
    const mensagem = document.getElementById('mensagemProjeto').value.trim();

    const lines = [
      `Olá, Aimée! Tudo bem? ✨`,
      `Vim pelo seu site e gostaria de solicitar uma proposta.`,
      ``,
      `• *Nome:* ${nome}`,
      `• *Marca / Instagram:* ${empresa}`,
      `• *Serviço de Interesse:* ${servico}`,
    ];

    if (mensagem) {
      lines.push(`• *Sobre o projeto:* ${mensagem}`);
    }

    const textEncoded = encodeURIComponent(lines.join('\n'));
    const whatsappUrl = `https://wa.me/5583988600571?text=${textEncoded}`;

    if (feedback && feedbackText) {
      feedbackText.textContent = `Mensagem formatada com carinho para ${nome}! Abrindo WhatsApp...`;
      feedback.classList.add('is-visible');
    }

    setTimeout(() => {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }, 400);
  });
}

/**
 * 7. Simulação de Posts & Apresentação em Evidência
 */
function initInstagramSimulation() {
  const modal = document.getElementById('igSimulationModal');
  const phoneFrame = document.getElementById('igPhoneFrame');
  const closeBtn = document.getElementById('igModalClose');
  const backdrop = document.getElementById('igModalBackdrop');
  const dynamicContent = document.getElementById('igModalDynamicContent');
  const triggers = document.querySelectorAll('[data-open-sim]');

  if (!modal || !dynamicContent || !phoneFrame) return;

  // Real extracted high-resolution slides (instant loading without CORS/PDF delays)
  const CAROUSEL_SLIDES = [
    'assets/images/carrossel/slide-1.jpg',
    'assets/images/carrossel/slide-2.jpg',
    'assets/images/carrossel/slide-3.jpg',
    'assets/images/carrossel/slide-4.jpg',
    'assets/images/carrossel/slide-5.jpg',
    'assets/images/carrossel/slide-6.jpg'
  ];

  const IDENTIDADE_SLIDES = [
    'assets/images/identidade/slide-1.jpg',
    'assets/images/identidade/slide-2.jpg',
    'assets/images/identidade/slide-3.jpg',
    'assets/images/identidade/slide-4.jpg',
    'assets/images/identidade/slide-5.jpg',
    'assets/images/identidade/slide-6.jpg',
    'assets/images/identidade/slide-7.jpg',
    'assets/images/identidade/slide-8.jpg',
    'assets/images/identidade/slide-9.jpg'
  ];

  // Active state
  let currentType = null;
  let currentSlideIndex = 0;
  let activeSlideList = [];
  let currentVideo = null;
  let isLiked = false;
  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    phoneFrame.classList.remove('is-deck-mode');
    phoneFrame.classList.remove('is-reels-mode');
    document.body.style.overflow = '';

    const permVideo = document.getElementById('igPermanentReelsVideo');
    if (permVideo) {
      try {
        permVideo.pause();
        permVideo.currentTime = 0;
        permVideo.style.display = 'none';
      } catch (_) {}
    }

    if (currentVideo) {
      try {
        currentVideo.pause();
        currentVideo.currentTime = 0;
      } catch (_) {}
      currentVideo = null;
    }
  }

  function openModal() {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modal.focus();
  }

  // Close triggers
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowRight') {
      goToSlide(currentSlideIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      goToSlide(currentSlideIndex - 1);
    }
  });

  // Slide navigation
  function goToSlide(newIndex) {
    if (!activeSlideList.length) return;
    if (newIndex < 0 || newIndex >= activeSlideList.length) return;
    currentSlideIndex = newIndex;

    if (currentType === 'carrossel') {
      const img = document.getElementById('igCarouselSlideImg');
      const counter = document.getElementById('igSlideCounter');
      const prevBtn = document.getElementById('igPrevBtn');
      const nextBtn = document.getElementById('igNextBtn');
      const dots = document.querySelectorAll('.ig-dot');

      if (img) {
        img.style.opacity = '0.5';
        img.src = activeSlideList[currentSlideIndex];
        img.onload = () => { img.style.opacity = '1'; };
      }
      if (counter) {
        counter.textContent = `${currentSlideIndex + 1}/${activeSlideList.length}`;
      }
      if (prevBtn) prevBtn.disabled = currentSlideIndex === 0;
      if (nextBtn) nextBtn.disabled = currentSlideIndex === activeSlideList.length - 1;

      dots.forEach((dot, idx) => {
        dot.classList.toggle('is-active', idx === currentSlideIndex);
      });
    } else if (currentType === 'identidade') {
      const img = document.getElementById('deckSlideImg');
      const counter = document.getElementById('deckSlideCounter');
      const prevBtn = document.getElementById('deckPrevBtn');
      const nextBtn = document.getElementById('deckNextBtn');
      const dots = document.querySelectorAll('.deck-dot');

      if (img) {
        img.style.opacity = '0.5';
        img.src = activeSlideList[currentSlideIndex];
        img.onload = () => { img.style.opacity = '1'; };
      }
      if (counter) {
        counter.textContent = `Lâmina ${currentSlideIndex + 1} de ${activeSlideList.length}`;
      }
      if (prevBtn) prevBtn.disabled = currentSlideIndex === 0;
      if (nextBtn) nextBtn.disabled = currentSlideIndex === activeSlideList.length - 1;

      dots.forEach((dot, idx) => {
        dot.classList.toggle('is-active', idx === currentSlideIndex);
      });
    }
  }

  // Touch Swipe Helper
  function setupTouchSwipe(el) {
    if (!el) return;
    let startX = 0;
    let endX = 0;

    el.addEventListener('touchstart', (e) => {
      startX = e.changedTouches[0].screenX;
    }, { passive: true });

    el.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].screenX;
      const diff = endX - startX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) {
          goToSlide(currentSlideIndex + 1);
        } else {
          goToSlide(currentSlideIndex - 1);
        }
      }
    }, { passive: true });
  }

  // Like button interactivity
  function setupLikeButton(container) {
    const likeBtn = container.querySelector('#igLikeBtn');
    if (!likeBtn) return;
    isLiked = false;

    likeBtn.addEventListener('click', () => {
      isLiked = !isLiked;
      likeBtn.classList.toggle('is-liked', isLiked);
      const heartSvg = likeBtn.querySelector('svg');
      if (heartSvg) {
        if (isLiked) {
          heartSvg.setAttribute('fill', '#ED4956');
          heartSvg.setAttribute('stroke', '#ED4956');
        } else {
          heartSvg.setAttribute('fill', 'none');
          heartSvg.setAttribute('stroke', 'currentColor');
        }
      }
    });
  }

  // Connect CTA button to proposal section
  function setupProposalCTA(container, serviceName) {
    const ctaBtn = container.querySelector('.ig-modal__cta-btn, .deck-cta-btn');
    if (!ctaBtn) return;

    ctaBtn.addEventListener('click', () => {
      closeModal();
      const serviceSelect = document.getElementById('servicoInteresse');
      if (serviceSelect && serviceName) {
        serviceSelect.value = serviceName;
      }
      const proposalSection = document.getElementById('proposta');
      if (proposalSection) {
        setTimeout(() => {
          proposalSection.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    });
  }

  // =========================================================================
  // 1. CARROSSEL (Representação minimalista de publicação no Instagram)
  // =========================================================================
  function showCarouselSimulation() {
    currentType = 'carrossel';
    currentSlideIndex = 0;
    activeSlideList = CAROUSEL_SLIDES;
    phoneFrame.classList.remove('is-deck-mode');
    phoneFrame.classList.remove('is-reels-mode');

    dynamicContent.innerHTML = `
      <!-- Header Minimalista com @flavia.dyana -->
      <div class="ig-header">
        <div class="ig-user">
          <div class="ig-avatar">
            <img src="${CAROUSEL_SLIDES[0]}" alt="Flávia Dyana" />
          </div>
          <div class="ig-user-info">
            <span class="ig-username">flavia.dyana</span>
          </div>
        </div>
        <button type="button" class="ig-icon-btn" aria-label="Opções">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="1.5"></circle>
            <circle cx="6" cy="12" r="1.5"></circle>
            <circle cx="18" cy="12" r="1.5"></circle>
          </svg>
        </button>
      </div>

      <!-- Media Area (Carrossel 4:5 com fotos reais) -->
      <div class="ig-media-box" id="igMediaBox">
        <span class="ig-slide-counter" id="igSlideCounter">1/${CAROUSEL_SLIDES.length}</span>

        <button type="button" class="ig-nav-btn prev" id="igPrevBtn" aria-label="Lâmina anterior" disabled>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button type="button" class="ig-nav-btn next" id="igNextBtn" aria-label="Próxima lâmina">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <div class="ig-slide-viewport" id="igSlideViewport">
          <img
            src="${CAROUSEL_SLIDES[0]}"
            class="ig-slide-img"
            id="igCarouselSlideImg"
            alt="Lâmina do carrossel"
          />
        </div>

        <div class="ig-dots" id="igDots">
          ${CAROUSEL_SLIDES.map((_, i) => `<span class="ig-dot ${i === 0 ? 'is-active' : ''}" data-idx="${i}"></span>`).join('')}
        </div>
      </div>

      <!-- Barra de Ações (Like, Comentar, Compartilhar, Salvar) -->
      <div class="ig-action-bar">
        <div class="ig-actions-left">
          <button type="button" class="ig-icon-btn" id="igLikeBtn" aria-label="Curtir post">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <button type="button" class="ig-icon-btn" aria-label="Comentar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </button>
          <button type="button" class="ig-icon-btn" aria-label="Compartilhar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
        <button type="button" class="ig-icon-btn" aria-label="Salvar publicação">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>

      <!-- Detalhes Minimalistas sem excesso de texto -->
      <div class="ig-details">
        <span class="ig-likes-text">Curtido por <strong>aimeemacedo_</strong> e <strong>outras pessoas</strong></span>
        <div class="ig-caption-text">
          <strong>flavia.dyana</strong> O que todo Proprietário deveria saber antes de colocar seu imóvel para alugar ou vender. Deslize para o lado para conferir os principais pontos! 👉🏼
        </div>
      </div>

      <!-- Modal Bottom CTA -->
      <div class="ig-modal__cta-wrap">
        <button type="button" class="btn btn--primary ig-modal__cta-btn">
          <span>Solicitar proposta deste serviço</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>
          </svg>
        </button>
      </div>
    `;

    openModal();

    // Setup interactions
    const prevBtn = document.getElementById('igPrevBtn');
    const nextBtn = document.getElementById('igNextBtn');
    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlideIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlideIndex + 1));

    const dots = dynamicContent.querySelectorAll('.ig-dot');
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-idx'), 10);
        goToSlide(idx);
      });
    });

    const viewport = document.getElementById('igSlideViewport');
    setupTouchSwipe(viewport);
    setupLikeButton(dynamicContent);
    setupProposalCTA(dynamicContent, 'Design de Posts Estáticos e Carrosséis');
  }

  // =========================================================================
  // 2. REELS (Interface Autêntica 9:16 Vertical Imersiva com @flavia.dyana)
  // =========================================================================
  function showReelsSimulation() {
    currentType = 'reels';
    phoneFrame.classList.remove('is-deck-mode');
    phoneFrame.classList.add('is-reels-mode');

    // Ativa o elemento de vídeo permanente existente no HTML (evita criar/destruir nós de mídia que bugam áudio)
    const permVideo = document.getElementById('igPermanentReelsVideo');
    if (permVideo) {
      permVideo.style.display = 'block';
      currentVideo = permVideo;
    }

    dynamicContent.innerHTML = `
      <div class="ig-reels-container" id="igReelsContainer">
        <!-- Toast de Status do Som (ativado/desativado) -->
        <div class="ig-reels-audio-toast" id="igReelsAudioToast" aria-hidden="true">
          <svg class="toast-icon-sound" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
          <span class="toast-text">Áudio ativado</span>
        </div>

        <!-- Banner Flutuante para Ativar Som (caso navegador bloqueie início com som) -->
        <button type="button" class="ig-reels-unmute-banner is-hidden" id="igReelsUnmuteBanner" aria-label="Ativar som do vídeo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
          <span>Toque para ativar o som</span>
        </button>

        <!-- Barra Superior Reels (Título + Botão Mudo/Som) -->
        <div class="ig-reels-top-bar">
          <span class="ig-reels-title">Reels</span>
          <button type="button" class="ig-reels-mute-btn" id="igReelsMuteBtn" aria-label="Alternar áudio">
            <svg class="icon-unmuted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            <svg class="icon-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none;">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          </button>
        </div>

        <!-- Barra Lateral Direita de Ações (Estilo Instagram Reels Clean) -->
        <div class="ig-reels-sidebar">
          <button type="button" class="ig-reels-action-btn" id="igLikeBtn" aria-label="Curtir Reels">
            <div class="ig-reels-action-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <span class="ig-reels-action-count">1.4k</span>
          </button>

          <button type="button" class="ig-reels-action-btn" aria-label="Comentar">
            <div class="ig-reels-action-icon">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </div>
            <span class="ig-reels-action-count">86</span>
          </button>

          <button type="button" class="ig-reels-action-btn" aria-label="Compartilhar">
            <div class="ig-reels-action-icon">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </div>
          </button>

          <button type="button" class="ig-reels-action-btn" aria-label="Salvar">
            <div class="ig-reels-action-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
          </button>

          <div class="ig-reels-audio-disc" aria-hidden="true">
            <img src="${CAROUSEL_SLIDES[0]}" alt="" />
          </div>
        </div>

        <!-- Sobreposição Inferior com Perfil, Legenda e CTA Minimalistas -->
        <div class="ig-reels-bottom-overlay">
          <div class="ig-reels-profile-row">
            <div class="ig-reels-avatar">
              <img src="${CAROUSEL_SLIDES[0]}" alt="Flávia Dyana" />
            </div>
            <div class="ig-reels-user-info">
              <span class="ig-reels-username">flavia.dyana</span>
            </div>
            <button type="button" class="ig-reels-follow-btn">Seguir</button>
          </div>

          <div class="ig-reels-caption">
            <span>Apartamento Mobiliado no Brisamar ✨ 3 suítes</span>
          </div>

          <div class="ig-reels-audio-row">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"></path>
            </svg>
            <span class="ig-reels-audio-track">Áudio original • flavia.dyana</span>
          </div>

          <div class="ig-reels-cta-wrap">
            <button type="button" class="btn btn--primary ig-modal__cta-btn ig-reels-cta-btn">
              <span>Solicitar proposta deste serviço</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    openModal();

    if (currentVideo) {
      const container = document.getElementById('igReelsContainer');
      if (container && currentVideo.parentElement !== container) {
        container.insertBefore(currentVideo, container.firstChild);
      }
      const muteBtn = document.getElementById('igReelsMuteBtn');
      const unmuteBanner = document.getElementById('igReelsUnmuteBanner');
      const toast = document.getElementById('igReelsAudioToast');
      let toastTimeout = null;

      const updateAudioUI = (isMuted) => {
        if (!muteBtn) return;
        const unmutedIcon = muteBtn.querySelector('.icon-unmuted');
        const mutedIcon = muteBtn.querySelector('.icon-muted');
        if (isMuted) {
          unmutedIcon.style.display = 'none';
          mutedIcon.style.display = 'block';
          if (unmuteBanner) unmuteBanner.classList.remove('is-hidden');
        } else {
          unmutedIcon.style.display = 'block';
          mutedIcon.style.display = 'none';
          if (unmuteBanner) unmuteBanner.classList.add('is-hidden');
        }
      };

      const showAudioToast = (isMuted) => {
        if (!toast) return;
        const text = toast.querySelector('.toast-text');
        const iconSvg = toast.querySelector('.toast-icon-sound');
        if (isMuted) {
          text.textContent = 'Áudio silenciado';
          iconSvg.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>`;
        } else {
          text.textContent = 'Áudio ativado';
          iconSvg.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>`;
        }
        toast.classList.add('is-visible');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
          toast.classList.remove('is-visible');
        }, 900);
      };

      const setAudioMuted = (mutedState, showFeedback = true) => {
        currentVideo.muted = mutedState;
        if (!mutedState) {
          currentVideo.volume = 1.0;
          if (currentVideo.paused) {
            currentVideo.play().catch(() => {});
          }
        }
        updateAudioUI(mutedState);
        if (showFeedback) {
          showAudioToast(mutedState);
        }
      };

      // Inicia áudio nativo puro do vídeo
      currentVideo.currentTime = 0;
      currentVideo.volume = 1.0;
      currentVideo.muted = false;

      const playPromise = currentVideo.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setAudioMuted(false, false);
        }).catch(() => {
          // Se o navegador bloquear som sem gesto direto prévio
          currentVideo.muted = true;
          currentVideo.play().catch(() => {});
          setAudioMuted(true, false);
        });
      }

      // Toque em qualquer área do Reels para alternar áudio
      if (container) {
        container.addEventListener('click', (e) => {
          if (e.target.closest('button') || e.target.closest('.ig-reels-sidebar') || e.target.closest('.ig-reels-bottom-overlay') || e.target.closest('.ig-reels-top-bar')) {
            return;
          }
          setAudioMuted(!currentVideo.muted, true);
        });
      }

      // Botão Mudo/Som no topo
      if (muteBtn) {
        muteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          setAudioMuted(!currentVideo.muted, true);
        });
      }

      // Banner flutuante "Toque para ativar o som"
      if (unmuteBanner) {
        unmuteBanner.addEventListener('click', (e) => {
          e.stopPropagation();
          setAudioMuted(false, true);
        });
      }
    }

    setupLikeButton(dynamicContent);
    setupProposalCTA(dynamicContent, 'Edição de Vídeos (Reels / Conteúdo Dinâmico)');
  }

  // =========================================================================
  // 3. IDENTIDADE VISUAL (Apresentação em Evidência - NÃO É POST DE INSTAGRAM)
  // =========================================================================
  function showIdentidadeSimulation() {
    currentType = 'identidade';
    currentSlideIndex = 0;
    activeSlideList = IDENTIDADE_SLIDES;
    phoneFrame.classList.add('is-deck-mode');
    phoneFrame.classList.remove('is-reels-mode');

    dynamicContent.innerHTML = `
      <!-- Header da Apresentação em Evidência -->
      <div class="deck-header">
        <div class="deck-title-group">
          <span class="deck-badge">Identidade Visual da Marca</span>
          <h3 class="deck-title">Doce Patxinha Pet Shop</h3>
        </div>
        <span class="deck-counter" id="deckSlideCounter">Lâmina 1 de ${IDENTIDADE_SLIDES.length}</span>
      </div>

      <!-- Área de Visualização da Lâmina 16:9 em Alta Definição -->
      <div class="deck-slide-box" id="deckSlideBox">
        <button type="button" class="deck-nav-btn prev" id="deckPrevBtn" aria-label="Lâmina anterior" disabled>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button type="button" class="deck-nav-btn next" id="deckNextBtn" aria-label="Próxima lâmina">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <div class="deck-slide-viewport" id="deckSlideViewport">
          <img
            src="${IDENTIDADE_SLIDES[0]}"
            class="deck-slide-img"
            id="deckSlideImg"
            alt="Lâmina 1 da Apresentação Doce Patxinha"
          />
        </div>

        <div class="deck-dots" id="deckDots">
          ${IDENTIDADE_SLIDES.map((_, i) => `<span class="deck-dot ${i === 0 ? 'is-active' : ''}" data-idx="${i}"></span>`).join('')}
        </div>
      </div>

      <!-- Rodapé da Apresentação com Navegação e CTA -->
      <div class="deck-footer">
        <p class="deck-footer__info">
          Projeto autoral completo: conceito, universo visual, paleta de cores e aplicações.
        </p>
        <button type="button" class="btn btn--primary deck-cta-btn">
          <span>Solicitar Proposta de Identidade Visual</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>
          </svg>
        </button>
      </div>
    `;

    openModal();

    // Setup slide interactions
    const prevBtn = document.getElementById('deckPrevBtn');
    const nextBtn = document.getElementById('deckNextBtn');
    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlideIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlideIndex + 1));

    const dots = dynamicContent.querySelectorAll('.deck-dot');
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-idx'), 10);
        goToSlide(idx);
      });
    });

    const viewport = document.getElementById('deckSlideViewport');
    setupTouchSwipe(viewport);
    setupProposalCTA(dynamicContent, 'Identidade Visual e Direção Criativa');
  }

  // Bind trigger buttons across the page
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const target = trigger.getAttribute('data-open-sim');
      if (target === 'carrossel') {
        showCarouselSimulation();
      } else if (target === 'reels') {
        showReelsSimulation();
      } else if (target === 'identidade') {
        showIdentidadeSimulation();
      }
    });
  });
}

/**
 * 8. Scroll-Scrubbing do Perfil no Hero
 * Sincroniza os 25 frames com o scroll da seção sticky.
 * - Rolar para baixo: avança gradualmente os frames.
 * - Rolar para cima: retrocede os frames na mesma proporção.
 * - Sem rolagem: permanece estático/pausado.
 * - Sticky: fica fixo na tela até o vídeo/animação terminar (progresso = 100%),
 *   liberando o scroll para descer para o restante do site.
 */
function initHeroScrollScrub() {
  const heroSection = document.getElementById('inicio');
  const canvases = [
    document.getElementById('feedScrubCanvas'),
    document.getElementById('feedScrubCanvasMobile')
  ].filter(Boolean);
  const fallbacks = [
    document.getElementById('feedScrubFallback'),
    document.getElementById('feedScrubFallbackMobile')
  ].filter(Boolean);

  if (!heroSection || canvases.length === 0) return;

  const TOTAL_FRAMES = 25;
  const frames = [];
  let loadedCount = 0;
  let currentFrameIndex = -1;

  // Preload all 25 frames
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    const frameNum = String(i).padStart(2, '0');
    img.src = `assets/images/feed-scroll/frame-${frameNum}.jpg`;
    img.onload = () => {
      loadedCount++;
      if (loadedCount === 1 && currentFrameIndex === -1) {
        drawFrame(0);
      }
    };
    frames.push(img);
  }

  function resizeCanvas() {
    canvases.forEach(canvas => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
      }
    });
    if (currentFrameIndex >= 0) {
      drawFrame(currentFrameIndex);
    }
  }

  window.addEventListener('resize', resizeCanvas, { passive: true });

  function drawFrame(idx) {
    if (idx < 0 || idx >= TOTAL_FRAMES) return;
    const img = frames[idx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    currentFrameIndex = idx;

    canvases.forEach(canvas => {
      const cw = canvas.width;
      const ch = canvas.height;
      if (cw === 0 || ch === 0) return;

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, cw, ch);

      const imgAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = cw / ch;

      let dw, dh, dx, dy;
      if (imgAspect > canvasAspect) {
        dh = ch;
        dw = ch * imgAspect;
        dx = (cw - dw) / 2;
        dy = 0;
      } else {
        dw = cw;
        dh = cw / imgAspect;
        dx = 0;
        dy = 0;
      }

      ctx.drawImage(img, dx, dy, dw, dh);
    });

    fallbacks.forEach(fallback => {
      if (fallback && !fallback.classList.contains('is-hidden')) {
        fallback.classList.add('is-hidden');
      }
    });
  }

  let isTicking = false;
  function updateScrub() {
    const rect = heroSection.getBoundingClientRect();
    const scrollDistance = heroSection.offsetHeight - window.innerHeight;

    if (scrollDistance <= 0) return;

    // Progress from 0 (at start of section) to 1 (when reaching bottom of section)
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / scrollDistance));

    // Calculate frame 0..24
    const targetFrame = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.floor(progress * TOTAL_FRAMES)));

    if (targetFrame !== currentFrameIndex) {
      drawFrame(targetFrame);
    }
  }

  function onScroll() {
    if (!isTicking) {
      requestAnimationFrame(() => {
        updateScrub();
        isTicking = false;
      });
      isTicking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Initial sizing and draw
  resizeCanvas();
  setTimeout(resizeCanvas, 150);
  setTimeout(resizeCanvas, 500);
  updateScrub();
}


