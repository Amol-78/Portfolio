/* ----------------------------------------------------
   CORE APPLICATION LOGIC & INTERACTIVE MECHANICS
   Developer: Amol Sharma (Python & AI/ML)
   Aesthetic: Responsive full-stack JavaScript bindings
---------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Initialize all core systems
    initTheme();
    initMobileNavigation();
    initCustomCursor();
    initTypingSimulation();
    initVisitorCounter();
    initProjectFiltering();
    initContactForm();
    initBackToTop();
    initActiveScrollNavigation();
});

/* 1. DARK / LIGHT THEME CONTROLLER */
function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    const currentTheme = localStorage.getItem('portfolio-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);

    toggleBtn.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('portfolio-theme', nextTheme);
    });
}

/* 2. RESPONSIVE MOBILE MENU NAVIGATION DRAWER */
function initMobileNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const header = document.querySelector('.main-header');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !navMenu) return;

    // Toggle menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    // Close mobile menu on clicking any navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });

    // Shrink header on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* 3. DUAL-COMPONENT INTERACTIVE CUSTOM CURSOR */
function initCustomCursor() {
    const dot = document.querySelector('.custom-cursor-dot');
    const ring = document.querySelector('.custom-cursor-ring');

    if (!dot || !ring || window.innerWidth < 1024) return;

    let mouseX = 0, mouseY = 0; // Target coordinates
    let ringX = 0, ringY = 0;   // Interpolated outer ring coordinates

    // Interpolation (lerp) factor for smooth trailing effect
    const lerpFactor = 0.15; 

    // Update positions on mouse movement
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Dot moves instantly
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });

    // Drawing loop for outer trailing cursor ring
    function updateCursorRing() {
        // Linear Interpolation: ring position chases mouse position slowly
        ringX += (mouseX - ringX) * lerpFactor;
        ringY += (mouseY - ringY) * lerpFactor;

        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;

        requestAnimationFrame(updateCursorRing);
    }
    updateCursorRing();

    // Expanded cursor rings on hovering hoverable elements
    const hoverables = document.querySelectorAll('a, button, .card-hover, .social-icon, .icon-btn-circle, input, textarea');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            ring.classList.add('cursor-hover');
            dot.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            ring.classList.remove('cursor-hover');
            dot.classList.remove('cursor-hover');
        });
    });

    // Hide cursors when leaving window boundaries
    document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
    });
}

/* 4. TYPING TEXT SIMULATOR CLASS */
class CustomTypingEffect {
    constructor(element, words, typeSpeed = 80, eraseSpeed = 40, delayBetween = 2000) {
        this.el = element;
        this.words = words;
        this.typeSpeed = typeSpeed;
        this.eraseSpeed = eraseSpeed;
        this.delayBetween = delayBetween;
        
        this.txt = '';
        this.wordIndex = 0;
        this.isDeleting = false;

        this.tick();
    }

    tick() {
        const i = this.wordIndex % this.words.length;
        const fullWord = this.words[i];

        if (this.isDeleting) {
            // Remove character
            this.txt = fullWord.substring(0, this.txt.length - 1);
        } else {
            // Add character
            this.txt = fullWord.substring(0, this.txt.length + 1);
        }

        // Output text inside container
        this.el.textContent = this.txt;

        let delta = this.typeSpeed;

        if (this.isDeleting) {
            delta = this.eraseSpeed;
        }

        if (!this.isDeleting && this.txt === fullWord) {
            // Complete typing word, trigger pause before delete
            delta = this.delayBetween;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            // Complete erasing word, switch index
            this.isDeleting = false;
            this.wordIndex++;
            delta = 500; // Pause before typing next word
        }

        setTimeout(() => this.tick(), delta);
    }
}

function initTypingSimulation() {
    const typingText = document.getElementById('typing-text');
    if (!typingText) return;

    const roles = [
        "Python Developer",
        "AI/ML Enthusiast",
        "Generative AI Engineer",
        "Data Analyst Specialist"
    ];

    new CustomTypingEffect(typingText, roles);
}

/* 5. VISITOR COUNT PERSISTENCE SEED */
function initVisitorCounter() {
    const countDisplay = document.getElementById('visitor-count');
    if (!countDisplay) return;

    // Use localStorage to mock/maintain views organically on page refreshes
    let totalViews = parseInt(localStorage.getItem('portfolio-views'), 10);
    
    if (isNaN(totalViews) || !totalViews) {
        // Organic initial seed value for recruiter-friendly visual
        totalViews = 1024;
    } else {
        // Increment between 1 and 2 organically per refresh
        totalViews += Math.floor(Math.random() * 2) + 1;
    }

    localStorage.setItem('portfolio-views', totalViews);

    // Format numbers with commas (e.g. 1,024)
    countDisplay.textContent = totalViews.toLocaleString('en-US');
}

/* 6. PROJECTS TAG INTERACTIVE FILTER */
function initProjectFiltering() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const projectsGrid = document.getElementById('projects-grid');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterTabs.length === 0 || !projectsGrid || projectCards.length === 0) return;

    // Failsafe: Ensure all cards are explicitly visible and fully opaque by default on load
    projectCards.forEach(card => {
        card.style.display = 'flex';
        card.style.opacity = '1';
    });

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active status from sibling tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filterValue = tab.getAttribute('data-filter');

            // Animated transition using GSAP
            gsap.to(projectCards, {
                scale: 0.85,
                opacity: 0,
                duration: 0.35,
                ease: "power2.inOut",
                onComplete: () => {
                    projectCards.forEach(card => {
                        const categories = card.getAttribute('data-category').split(' ');
                        
                        if (filterValue === 'all' || categories.includes(filterValue)) {
                            card.style.display = 'flex';
                        } else {
                            card.style.display = 'none';
                        }
                    });

                    // Reveal matching cards smoothly
                    gsap.to(projectCards, {
                        scale: 1,
                        opacity: 1,
                        duration: 0.45,
                        stagger: 0.1,
                        ease: "power2.out"
                    });
                }
            });
        });
    });
}

/* 7. CONTACT FORM VALIDATIONS & LIVE AJAX TRANSMISSION */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('form-submit-btn');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    if (!form || !submitBtn) return;

    // Trigger floating styling validations
    const formInputs = form.querySelectorAll('input, textarea');
    
    // Toggle active boundaries
    formInputs.forEach(input => {
        // Clean error boundaries on typing
        input.addEventListener('input', () => {
            const group = input.parentElement;
            if (group) group.classList.remove('invalid');
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isFormValid = true;

        // Perform validations
        formInputs.forEach(input => {
            const group = input.parentElement;
            if (!group) return;

            // Simple empty check
            if (!input.value.trim()) {
                group.classList.add('invalid');
                isFormValid = false;
            } else {
                group.classList.remove('invalid');
            }

            // Email format check
            if (input.type === 'email' && input.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value.trim())) {
                    group.classList.add('invalid');
                    isFormValid = false;
                }
            }
        });

        if (!isFormValid) return;

        // Animate button processing state
        const origBtnContent = submitBtn.innerHTML;
        submitBtn.setAttribute('disabled', 'true');
        submitBtn.innerHTML = `<span>Sending Message...</span> <i data-lucide="loader-2" class="spin-icon"></i>`;
        lucide.createIcons(); // Instantly create loaders inside button

        // Extract input values
        const name = document.getElementById('form-name').value;
        const email = document.getElementById('form-email').value;
        const subject = document.getElementById('form-subject').value;
        const message = document.getElementById('form-message').value;

        // Transmit via FormSubmit.co AJAX to user's specified email
        fetch("https://formsubmit.co/ajax/shelkeamol078@gmail.com", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                Name: name,
                Email: email,
                Subject: subject,
                Message: message
            })
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response error');
            return response.json();
        })
        .then(data => {
            // Open beautiful glass success popup modal
            if (successModal) {
                successModal.classList.add('open');
            }
            form.reset();
        })
        .catch(err => {
            console.error("Transmitting error:", err);
            alert("Oops! There was an issue transmitting your message. Please verify internet connection or contact via shelkeamol078@gmail.com directly.");
        })
        .finally(() => {
            // Restore button state
            submitBtn.removeAttribute('disabled');
            submitBtn.innerHTML = origBtnContent;
        });
    });

    // Close success popup dialog
    if (closeModalBtn && successModal) {
        closeModalBtn.addEventListener('click', () => {
            successModal.classList.remove('open');
        });

        // Close when clicking outside on modal backdrop overlay
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('open');
            }
        });
    }
}

/* 8. BACK TO TOP BUTTON */
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* 9. DYNAMIC SPY ACTIVE NAV LINK ON SCROLLING */
function initActiveScrollNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    if (navLinks.length === 0 || sections.length === 0) return;

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPos = window.scrollY + 120; // Padding threshold to match active views

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;

            if (scrollPos >= top && scrollPos < top + height) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}
