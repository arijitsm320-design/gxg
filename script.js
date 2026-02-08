

// Carousel functionality
class Carousel {
    constructor(carouselId) {
        this.carousel = document.getElementById(carouselId);
        if (!this.carousel) return;

        this.slides = this.carousel.querySelectorAll('.carousel-slide');
        this.dotsContainer = document.getElementById('carouselDots');
        this.prevBtn = document.getElementById('carouselPrev');
        this.nextBtn = document.getElementById('carouselNext');
        this.currentIndex = 0;
        this.autoplayInterval = null;

        this.init();
    }

    init() {
        // Create dots
        this.createDots();

        // Add event listeners
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Start autoplay
        this.startAutoplay();

        // Pause on hover
        this.carousel.addEventListener('mouseenter', () => this.stopAutoplay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoplay());
    }

    createDots() {
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
        this.dots = this.dotsContainer.querySelectorAll('.carousel-dot');
    }

    showSlide(index) {
        this.slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (this.dots) {
                this.dots[i].classList.remove('active');
            }
        });

        this.slides[index].classList.add('active');
        if (this.dots) {
            this.dots[index].classList.add('active');
        }
        this.currentIndex = index;
    }

    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prevIndex);
    }

    goToSlide(index) {
        this.showSlide(index);
        this.stopAutoplay();
        this.startAutoplay();
    }

    startAutoplay() {
        this.autoplayInterval = setInterval(() => this.nextSlide(), 5000);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize leaf animation for hero section
    try {
        if (typeof LeafAnimation !== 'undefined') {
            new LeafAnimation('hero');
        }
    } catch (e) {
        console.log('LeafAnimation not available');
    }

    // Initialize typing animation if element exists
    try {
        const typingElement = document.getElementById('typing-text');
        if (typingElement && typeof TypingAnimation !== 'undefined') {
            const texts = [
                "Every D2C brand needs a GreenXguard verification badge.",
                "Build trust with CCPA-compliant sustainability claims.",
                "Showcase your authentic green credentials.",
                "Join the verified green revolution in India."
            ];
            new TypingAnimation('typing-text', texts);
        }
    } catch (e) {
        console.log('TypingAnimation not available');
    }

    // Initialize scroll animations
    try {
        if (typeof initScrollAnimations !== 'undefined') {
            initScrollAnimations();
        }
    } catch (e) {
        console.log('initScrollAnimations not available');
    }

    // Initialize carousel - this should always work
    console.log('Initializing carousel...');
    const carousel = new Carousel('natureCarousel');
    console.log('Carousel initialized');
});

// Scroll animations
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');

                // Add different animations based on data attribute
                const animation = entry.target.dataset.animation || 'fadeInUp';
                entry.target.style.animation = `${animation} 0.6s ease forwards`;

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// Particle animation for CTA section
class ParticleAnimation {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.particles = [];
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.container.appendChild(this.canvas);
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Create particles
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.1
            });
        }

        this.animate();
    }

    resize() {
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
            this.ctx.fill();

            // Draw connections
            this.particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle animation for CTA section
document.addEventListener('DOMContentLoaded', () => {
    const ctaSection = document.querySelector('.cta-section');
    if (ctaSection) {
        ctaSection.id = 'cta-particles';
        new ParticleAnimation('cta-particles');
    }
});


// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        // Show/hide hamburger based on screen size
        function checkWindowSize() {
            if (window.innerWidth <= 1024) {
                menuToggle.style.display = 'flex';
                navMenu.style.display = 'none';
            } else {
                menuToggle.style.display = 'none';
                navMenu.style.display = 'flex';
                menuToggle.classList.remove('active');
            }
        }

        // Initial check
        checkWindowSize();

        // Check on resize
        window.addEventListener('resize', checkWindowSize);

        // Toggle menu on click
        menuToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');

            // Toggle display for mobile
            if (window.innerWidth <= 1024) {
                navMenu.style.display = navMenu.classList.contains('active') ? 'flex' : 'none';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (window.innerWidth <= 1024 &&
                !navMenu.contains(e.target) &&
                !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                navMenu.style.display = 'none';
            }
        });

        // Close menu when clicking a link (optional)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function () {
                if (window.innerWidth <= 1024) {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                    navMenu.style.display = 'none';
                }
            });
        });
    }
});

