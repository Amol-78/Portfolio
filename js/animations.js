/* ----------------------------------------------------
   GSAP & SCROLLTRIGGER TIMELINES AND ENTRANCE CASCADE
   Developer: Amol Sharma (Python & AI/ML)
   Aesthetic: Choreographed tech entries
---------------------------------------------------- */

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

class PortfolioAnimations {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.percentText = document.getElementById('loader-percent');
        this.progressCircle = document.getElementById('loader-progress-circle');
        this.statusText = document.getElementById('loader-status');
        this.diagnosticLine = document.getElementById('diagnostic-line');
        
        // Diagnostic booting scripts list
        this.diagnostics = [
            "Importing python libraries...",
            "Loading NumPy & Pandas utilities...",
            "Connecting Gemini API endpoints...",
            "Initializing LangChain vector indexing...",
            "Compiling custom CSS glass themes...",
            "Booting neural network canvas core...",
            "Structuring responsive portfolio layers...",
            "Ready for execution."
        ];

        this.initLoader();
    }

    initLoader() {
        let percentage = 0;
        const totalDuration = 2500; // 2.5 seconds total loading time
        const intervalTime = 30;
        const totalSteps = totalDuration / intervalTime;
        let currentStep = 0;

        // Pulse diagnostic texts as it loads
        const diagInterval = setInterval(() => {
            const index = Math.min(Math.floor((percentage / 100) * this.diagnostics.length), this.diagnostics.length - 1);
            if (this.diagnosticLine) {
                this.diagnosticLine.textContent = this.diagnostics[index];
            }
        }, 300);

        const loaderInterval = setInterval(() => {
            currentStep++;
            percentage = Math.min(Math.round((currentStep / totalSteps) * 100), 100);
            
            // Update UI Percentages
            if (this.percentText) {
                this.percentText.textContent = `${percentage}%`;
            }

            // Update SVG loader circle dashoffset
            // Stroke-dasharray is 282.7
            if (this.progressCircle) {
                const dashoffset = 282.7 - (282.7 * percentage) / 100;
                this.progressCircle.style.strokeDashoffset = dashoffset;
            }

            if (percentage === 100) {
                clearInterval(loaderInterval);
                clearInterval(diagInterval);
                if (this.statusText) this.statusText.textContent = "CORE SYSTEM ENGAGED.";
                setTimeout(() => this.shutdownLoader(), 400);
            }
        }, intervalTime);
    }

    shutdownLoader() {
        if (!this.preloader) return;

        // GSAP timeline to fade and clear preloader
        const tl = gsap.timeline({
            onComplete: () => {
                this.preloader.style.display = 'none';
                this.runEntranceAnimations();
                this.runScrollReveals();
                this.initMagneticButtons();
            }
        });

        tl.to(this.preloader, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    }

    runEntranceAnimations() {
        // Entrance cascade timeline
        const mainTl = gsap.timeline({
            onComplete: () => {
                ScrollTrigger.refresh();
            }
        });

        // 1. Slide header down
        mainTl.from(".main-header", {
            y: -100,
            opacity: 0,
            duration: 1,
            ease: "power4.out"
        });

        // 2. Animate Hero Tagline & Main Texts
        mainTl.from(".hero-tagline", {
            scale: 0.8,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(1.7)"
        }, "-=0.6");

        mainTl.from(".hero-title", {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.4");

        mainTl.from(".hero-subtitle", {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out"
        }, "-=0.5");

        mainTl.from(".hero-description", {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out"
        }, "-=0.5");

        // 3. Stagger buttons and socials
        mainTl.from(".hero-buttons .btn", {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.15,
            ease: "power2.out"
        }, "-=0.4");

        mainTl.from(".hero-socials .social-icon", {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.3");

        // 4. Hero Visual profile elements
        mainTl.from(".profile-container", {
            scale: 0.7,
            opacity: 0,
            duration: 1.2,
            ease: "elastic.out(1, 0.6)"
        }, "-=1");

        mainTl.from(".glow-ring", {
            scale: 0.5,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power2.out"
        }, "-=0.8");

        mainTl.from(".floating-badge", {
            scale: 0,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.5)"
        }, "-=0.6");

        // 5. Scroll Indicator
        mainTl.from(".scroll-indicator", {
            y: -10,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.2");
    }

    runScrollReveals() {
        // Find all sections
        const sections = ["#about", "#skills", "#projects", "#certifications", "#contact"];

        sections.forEach(section => {
            const trigger = document.querySelector(section);
            if (!trigger) return;

            // Fade Section Header up
            gsap.from(`${section} .section-header`, {
                scrollTrigger: {
                    trigger: trigger,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            });
        });

        // About Grid reveal
        if (document.querySelector(".about-grid")) {
            gsap.from(".about-info", {
                scrollTrigger: {
                    trigger: ".about-grid",
                    start: "top 75%"
                },
                x: -60,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            });

            gsap.from(".about-card", {
                scrollTrigger: {
                    trigger: ".about-grid",
                    start: "top 75%"
                },
                x: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out"
            });
        }

        // Skills trigger (Progress circle & bar fills)
        if (document.querySelector(".skills-grid")) {
            ScrollTrigger.create({
                trigger: ".skills-grid",
                start: "top 75%",
                onEnter: () => this.animateSkills()
            });
        }

        // Project Cards reveal
        if (document.querySelector(".projects-grid")) {
            gsap.from(".project-card", {
                scrollTrigger: {
                    trigger: ".projects-grid",
                    start: "top 90%",
                    once: true
                },
                y: 40,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out"
            });
        }

        // Certification Cards reveal
        if (document.querySelector(".certs-grid")) {
            gsap.from(".cert-card-box", {
                scrollTrigger: {
                    trigger: ".certs-grid",
                    start: "top 90%",
                    once: true
                },
                y: 40,
                opacity: 0,
                duration: 0.6,
                stagger: 0.15,
                ease: "power2.out"
            });
        }

        // Connect Card reveal
        if (document.querySelector(".connect-wrapper")) {
            gsap.from(".connect-card", {
                scrollTrigger: {
                    trigger: ".connect-wrapper",
                    start: "top 80%"
                },
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            });
        }
    }

    animateSkills() {
        // 1. Radial Progress Circles
        const radSkills = document.querySelectorAll('.radial-skill-item');
        radSkills.forEach(item => {
            const percent = parseInt(item.getAttribute('data-percent'), 10);
            const valueText = item.querySelector('.radial-val');
            const bar = item.querySelector('.radial-bar');
            
            if (bar) {
                // Calculate dashoffset (stroke-dasharray is 251.2)
                const offset = 251.2 - (251.2 * percent) / 100;
                bar.style.strokeDashoffset = offset;
            }

            // Animate number count-up
            if (valueText) {
                let currentVal = 0;
                const counterTimer = setInterval(() => {
                    currentVal++;
                    valueText.textContent = `${currentVal}%`;
                    if (currentVal >= percent) {
                        clearInterval(counterTimer);
                    }
                }, 15);
            }
        });

        // 2. Linear Progress Bar Fills
        const linearFills = document.querySelectorAll('.bar-fill');
        linearFills.forEach(fill => {
            const width = fill.getAttribute('data-width');
            fill.style.width = width;
        });
    }

    initMagneticButtons() {
        const magBtns = document.querySelectorAll('.btn-magnetic');
        
        if (window.innerWidth < 1024) return; // Disable on tablets/mobiles

        magBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                // Move button and children slightly towards cursor
                gsap.to(btn, {
                    x: x * 0.35,
                    y: y * 0.35,
                    duration: 0.3,
                    ease: "power2.out"
                });

                const innerSpan = btn.querySelector('span');
                const innerIcon = btn.querySelector('i');
                if (innerSpan) {
                    gsap.to(innerSpan, {
                        x: x * 0.15,
                        y: y * 0.15,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
                if (innerIcon) {
                    gsap.to(innerIcon, {
                        x: x * 0.2,
                        y: y * 0.2,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });

            btn.addEventListener('mouseleave', () => {
                // Reset positions smoothly
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.4)"
                });
                
                const innerSpan = btn.querySelector('span');
                const innerIcon = btn.querySelector('i');
                if (innerSpan) {
                    gsap.to(innerSpan, {
                        x: 0,
                        y: 0,
                        duration: 0.5,
                        ease: "elastic.out(1, 0.4)"
                    });
                }
                if (innerIcon) {
                    gsap.to(innerIcon, {
                        x: 0,
                        y: 0,
                        duration: 0.5,
                        ease: "elastic.out(1, 0.4)"
                    });
                }
            });
        });
    }
}

// Initialise animations when window loads
window.addEventListener('load', () => {
    new PortfolioAnimations();
});
