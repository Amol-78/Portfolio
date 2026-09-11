/* ----------------------------------------------------
   INTERACTIVE NEURAL NETWORK CANVAS BACKGROUND
   Developer: Amol Sharma (Python & AI/ML)
   Aesthetic: Dynamic floating data points/neurons
---------------------------------------------------- */

class NeuralNetworkBg {
    constructor() {
        this.canvas = document.getElementById('neural-bg');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 80;
        this.connectionDist = 120;
        this.mouse = { x: null, y: null, radius: 150 };

        // Theme colors
        this.colors = {
            dark: {
                node: 'rgba(59, 130, 246, 0.4)',
                nodeActive: 'rgba(139, 92, 246, 0.7)',
                line: 'rgba(59, 130, 246, 0.08)'
            },
            light: {
                node: 'rgba(37, 99, 235, 0.25)',
                nodeActive: 'rgba(124, 58, 237, 0.5)',
                line: 'rgba(37, 99, 235, 0.05)'
            }
        };

        this.currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';

        this.init();
        this.registerEvents();
        this.animate();
    }

    init() {
        this.resizeCanvas();
        
        // Adjust particle density based on screen width
        if (window.innerWidth < 768) {
            this.maxParticles = 35;
            this.connectionDist = 90;
        } else {
            this.maxParticles = 85;
            this.connectionDist = 125;
        }

        this.particles = [];
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(this.createParticle());
        }
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * 0.5, // Slow floating speeds
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2.5 + 1.5,
            baseRadius: Math.random() * 2.5 + 1.5,
            glow: Math.random() * 5 + 2
        };
    }

    registerEvents() {
        // Debounced resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.init();
            }, 200);
        });

        // Track Mouse
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Mouse leaves window
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });

        // Listen for theme flips
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    this.currentTheme = document.documentElement.getAttribute('data-theme');
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }

    drawParticle(p) {
        const themeColors = this.colors[this.currentTheme];
        
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        
        // Highlight particle if close to cursor
        if (this.mouse.x && this.getDistance(p.x, p.y, this.mouse.x, this.mouse.y) < this.mouse.radius) {
            this.ctx.fillStyle = themeColors.nodeActive;
            p.radius = Math.min(p.baseRadius * 1.6, 5); // Grow slightly
        } else {
            this.ctx.fillStyle = themeColors.node;
            p.radius = p.baseRadius;
        }

        this.ctx.shadowBlur = p.glow;
        this.ctx.shadowColor = this.ctx.fillStyle;
        this.ctx.fill();
        this.ctx.shadowBlur = 0; // Reset shadow for lines
    }

    getDistance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    drawConnections() {
        const themeColors = this.colors[this.currentTheme];
        const len = this.particles.length;

        for (let i = 0; i < len; i++) {
            const p1 = this.particles[i];
            
            // Connect to other particles
            for (let j = i + 1; j < len; j++) {
                const p2 = this.particles[j];
                const dist = this.getDistance(p1.x, p1.y, p2.x, p2.y);

                if (dist < this.connectionDist) {
                    // Opacity increases as they float closer
                    const alpha = (1 - (dist / this.connectionDist)) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    
                    // Match theme colors
                    if (this.currentTheme === 'dark') {
                        this.ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
                    } else {
                        this.ctx.strokeStyle = `rgba(37, 99, 235, ${alpha * 0.8})`;
                    }
                    
                    this.ctx.lineWidth = 0.8;
                    this.ctx.stroke();
                }
            }

            // Connect to Mouse
            if (this.mouse.x) {
                const distToMouse = this.getDistance(p1.x, p1.y, this.mouse.x, this.mouse.y);
                if (distToMouse < this.mouse.radius) {
                    const mouseAlpha = (1 - (distToMouse / this.mouse.radius)) * 0.22;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    
                    if (this.currentTheme === 'dark') {
                        this.ctx.strokeStyle = `rgba(139, 92, 246, ${mouseAlpha})`;
                    } else {
                        this.ctx.strokeStyle = `rgba(124, 58, 237, ${mouseAlpha * 0.8})`;
                    }
                    
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }

    updateParticles() {
        const len = this.particles.length;
        for (let i = 0; i < len; i++) {
            const p = this.particles[i];

            // Floating movement
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off boundaries
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            // Mouse gravity attraction
            if (this.mouse.x) {
                const dist = this.getDistance(p.x, p.y, this.mouse.x, this.mouse.y);
                if (dist < this.mouse.radius) {
                    const force = (this.mouse.radius - dist) / this.mouse.radius;
                    const angle = Math.atan2(this.mouse.y - p.y, this.mouse.x - p.x);
                    
                    // Pull particles gently
                    p.x += Math.cos(angle) * force * 0.4;
                    p.y += Math.sin(angle) * force * 0.4;
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateParticles();
        this.drawConnections();
        
        const len = this.particles.length;
        for (let i = 0; i < len; i++) {
            this.drawParticle(this.particles[i]);
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Instantiate canvas neural network on DOM load
document.addEventListener('DOMContentLoaded', () => {
    new NeuralNetworkBg();
});
