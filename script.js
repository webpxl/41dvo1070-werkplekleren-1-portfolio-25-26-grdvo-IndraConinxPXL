/* ==========================================
   PORTFOLIO V4 - JAVASCRIPT
   ========================================== */

'use strict';

// DOM Element Selection
const DOM = {
    header: document.getElementById('mainHeader'),
    hamburger: document.getElementById('hamburgerBtn'),
    navList: document.getElementById('navList'),
    navAnchors: document.querySelectorAll('.nav-anchor'),
    filterButtons: document.querySelectorAll('.filter-button'),
    portfolioCards: document.querySelectorAll('.portfolio-card'),
    messageForm: document.getElementById('messageForm'),
    footerYear: document.getElementById('footerYear'),
    skillFills: document.querySelectorAll('.skill-fill')
};

/* ==========================================
   INITIALIZATION
   ========================================== */
function init() {
    setFooterYear();
    setupEventListeners();
    initScrollEffects();
    initScrollAnimations();
}

// Set current year in footer
function setFooterYear() {
    if (DOM.footerYear) {
        DOM.footerYear.textContent = new Date().getFullYear();
    }
}

/* ==========================================
   EVENT LISTENERS
   ========================================== */
function setupEventListeners() {
    // Mobile menu toggle
    if (DOM.hamburger) {
        DOM.hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Navigation links
    DOM.navAnchors.forEach(anchor => {
        anchor.addEventListener('click', handleNavClick);
    });

    // Smooth scroll for all hash links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', smoothScroll);
    });

    // Filter buttons
    DOM.filterButtons.forEach(button => {
        button.addEventListener('click', handleFilterClick);
    });

    // Contact form
    if (DOM.messageForm) {
        DOM.messageForm.addEventListener('submit', handleFormSubmit);
    }

    // Window scroll
    window.addEventListener('scroll', debounce(handleScroll, 10));
}

/* ==========================================
   NAVIGATION FUNCTIONS
   ========================================== */
function toggleMobileMenu() {
    const isOpen = DOM.navList.classList.toggle('is-open');
    animateHamburger(isOpen);
}

function animateHamburger(isOpen) {
    const lines = DOM.hamburger.querySelectorAll('.line');
    if (isOpen) {
        lines[0].style.transform = 'rotate(45deg) translateY(10px)';
        lines[1].style.opacity = '0';
        lines[2].style.transform = 'rotate(-45deg) translateY(-10px)';
    } else {
        lines[0].style.transform = 'none';
        lines[1].style.opacity = '1';
        lines[2].style.transform = 'none';
    }
}

function handleNavClick(e) {
    closeMobileMenu();
}

function closeMobileMenu() {
    DOM.navList.classList.remove('is-open');
    animateHamburger(false);
}

function smoothScroll(e) {
    const targetId = this.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const headerOffset = DOM.header.offsetHeight;
    const targetPosition = target.offsetTop - headerOffset;

    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

/* ==========================================
   SCROLL EFFECTS
   ========================================== */
let lastScrollY = 0;

function handleScroll() {
    const scrollY = window.pageYOffset;

    // Header shadow effect
    if (scrollY > 50) {
        DOM.header.classList.add('is-scrolled');
    } else {
        DOM.header.classList.remove('is-scrolled');
    }

    // Hide/show header on scroll
    if (scrollY > lastScrollY && scrollY > 150) {
        DOM.header.style.transform = 'translateY(-100%)';
    } else {
        DOM.header.style.transform = 'translateY(0)';
    }

    lastScrollY = scrollY;

    // Update active navigation link
    updateActiveNavLink();
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.pageYOffset + DOM.header.offsetHeight + 120;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            DOM.navAnchors.forEach(anchor => {
                anchor.classList.remove('is-active');
                if (anchor.getAttribute('href') === `#${sectionId}`) {
                    anchor.classList.add('is-active');
                }
            });
        }
    });
}

function initScrollEffects() {
    // Initial check
    handleScroll();
}

/* ==========================================
   PROJECT FILTERING
   ========================================== */
function handleFilterClick(e) {
    const button = e.currentTarget;
    const category = button.getAttribute('data-category');

    // Update active button
    DOM.filterButtons.forEach(btn => btn.classList.remove('is-active'));
    button.classList.add('is-active');

    // Filter projects
    filterProjects(category);
}

function filterProjects(category) {
    DOM.portfolioCards.forEach((card, index) => {
        const cardType = card.getAttribute('data-type');
        const shouldShow = category === 'all' || cardType === category;

        setTimeout(() => {
            if (shouldShow) {
                card.classList.remove('is-hidden');
                card.style.animation = 'slideIn 0.5s ease forwards';
            } else {
                card.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    card.classList.add('is-hidden');
                }, 300);
            }
        }, index * 50);
    });
}

// Add fadeOut animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.95);
        }
    }
`;
document.head.appendChild(styleSheet);

/* ==========================================
   SKILL BARS ANIMATION
   ========================================== */
function animateSkillBars() {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                DOM.skillFills.forEach(fill => {
                    const level = fill.getAttribute('data-level');
                    fill.style.width = `${level}%`;
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    observer.observe(skillsSection);
}

/* ==========================================
   SCROLL ANIMATIONS
   ========================================== */
function initScrollAnimations() {
    const elementsToAnimate = document.querySelectorAll(
        '.info-card, .portfolio-card, .expertise-box, .hobby-box'
    );

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(40px)';
        element.style.transition = 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
        animationObserver.observe(element);
    });

    // Animate skill bars
    animateSkillBars();
}

/* ==========================================
   FORM HANDLING
   ========================================== */
function handleFormSubmit(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('userName').value.trim(),
        email: document.getElementById('userEmail').value.trim(),
        subject: document.getElementById('messageSubject').value.trim(),
        message: document.getElementById('messageContent').value.trim()
    };

    // Validation
    if (!validateForm(formData)) {
        return;
    }

    // Simulate form submission
    console.log('Form Data:', formData);

    // Show success message
    displayNotification(
        `Bedankt ${formData.name}! Je bericht is succesvol verzonden. We nemen snel contact op.`,
        'success'
    );

    // Reset form
    DOM.messageForm.reset();
}

function validateForm(data) {
    if (!data.name || !data.email || !data.subject || !data.message) {
        displayNotification('Vul alstublieft alle velden in.', 'error');
        return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(data.email)) {
        displayNotification('Voer een geldig e-mailadres in.', 'error');
        return false;
    }

    return true;
}

/* ==========================================
   NOTIFICATION SYSTEM
   ========================================== */
function displayNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    const bgColor = type === 'success' ? '#2c7a3b' : '#6c0820';

    notification.style.cssText = `
        position: fixed;
        top: 120px;
        right: 30px;
        background: ${bgColor};
        color: white;
        padding: 1.25rem 1.75rem;
        border-radius: 12px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        z-index: 99999;
        max-width: 350px;
        font-weight: 500;
        animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => notification.remove(), 400);
    }, 4500);
}

// Notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(450px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(450px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

/* ==========================================
   UTILITY FUNCTIONS
   ========================================== */
function debounce(func, wait = 20) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/* ==========================================
   PARALLAX EFFECT (OPTIONAL)
   ========================================== */
function initParallax() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (scrolled < window.innerHeight) {
            heroSection.style.transform = `translateY(${scrolled * 0.35}px)`;
        }
    });
}

// Uncomment to enable parallax effect
// initParallax();

/* ==========================================
   CONSOLE BRANDING
   ========================================== */
function logBranding() {
    console.log(
        '%c 🎨 Portfolio Website V4 ',
        'background: #6c0820; color: #ffffff; padding: 12px 24px; font-size: 18px; font-weight: bold; border-radius: 6px;'
    );
    console.log(
        '%c Gebouwd met HTML, CSS & JavaScript ',
        'background: #f2dddc; color: #6c0820; padding: 8px 16px; font-size: 14px; font-weight: 600; border-radius: 4px;'
    );
    console.log('%c ✅ Alles geladen en klaar!', 'color: #2c7a3b; font-weight: bold; font-size: 14px;');
}

/* ==========================================
   PAGE LOAD
   ========================================== */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        init();
        logBranding();
    });
} else {
    init();
    logBranding();
}
