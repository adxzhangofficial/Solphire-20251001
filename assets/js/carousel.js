/**
 * Auto-Sliding Horizontal Carousel with Drag-to-Scroll
 * Handles both Portfolio Cards and Team Section carousels
 */

class AutoCarousel {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            autoSlideInterval: options.autoSlideInterval || 3000,
            slideAmount: options.slideAmount || 400,
            ...options
        };
        
        this.isDown = false;
        this.startX = 0;
        this.scrollLeft = 0;
        this.autoSlideTimer = null;
        this.animationFrameId = null;
        this.velocity = 0;
        this.isPaused = false;
        
        this.init();
    }
    
    init() {
        this.setupDragScroll();
        this.setupAutoSlide();
        this.setupHoverPause();
        this.setupKeyboardNav();
    }
    
    setupDragScroll() {
        this.container.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.container.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        this.container.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.container.addEventListener('mousemove', this.handleMouseMove.bind(this));
        
        this.container.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        this.container.addEventListener('touchend', this.handleTouchEnd.bind(this));
        this.container.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        
        this.container.style.cursor = 'grab';
    }
    
    handleMouseDown(e) {
        this.isDown = true;
        this.container.style.cursor = 'grabbing';
        this.startX = e.pageX - this.container.offsetLeft;
        this.scrollLeft = this.container.scrollLeft;
        this.velocity = 0;
        this.pauseAutoSlide();
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }
    
    handleMouseLeave() {
        if (this.isDown) {
            this.isDown = false;
            this.container.style.cursor = 'grab';
            this.applyMomentum();
        }
    }
    
    handleMouseUp() {
        if (this.isDown) {
            this.isDown = false;
            this.container.style.cursor = 'grab';
            this.applyMomentum();
            
            setTimeout(() => {
                this.resumeAutoSlide();
            }, 1000);
        }
    }
    
    handleMouseMove(e) {
        if (!this.isDown) return;
        e.preventDefault();
        
        const x = e.pageX - this.container.offsetLeft;
        const walk = (x - this.startX) * 2;
        this.velocity = walk;
        this.container.scrollLeft = this.scrollLeft - walk;
    }
    
    handleTouchStart(e) {
        this.isDown = true;
        this.startX = e.touches[0].pageX - this.container.offsetLeft;
        this.scrollLeft = this.container.scrollLeft;
        this.velocity = 0;
        this.pauseAutoSlide();
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }
    
    handleTouchEnd() {
        if (this.isDown) {
            this.isDown = false;
            this.applyMomentum();
            
            setTimeout(() => {
                this.resumeAutoSlide();
            }, 1000);
        }
    }
    
    handleTouchMove(e) {
        if (!this.isDown) return;
        
        const x = e.touches[0].pageX - this.container.offsetLeft;
        const walk = (x - this.startX) * 2;
        this.velocity = walk;
        this.container.scrollLeft = this.scrollLeft - walk;
    }
    
    applyMomentum() {
        const friction = 0.95;
        const minVelocity = 0.5;
        
        const animate = () => {
            if (Math.abs(this.velocity) > minVelocity) {
                this.container.scrollLeft -= this.velocity;
                this.velocity *= friction;
                this.animationFrameId = requestAnimationFrame(animate);
            } else {
                this.velocity = 0;
                if (this.animationFrameId) {
                    cancelAnimationFrame(this.animationFrameId);
                    this.animationFrameId = null;
                }
            }
        };
        
        if (Math.abs(this.velocity) > minVelocity) {
            animate();
        }
    }
    
    setupAutoSlide() {
        this.startAutoSlide();
    }
    
    startAutoSlide() {
        this.autoSlideTimer = setInterval(() => {
            if (!this.isPaused && !this.isDown) {
                this.smoothScrollBy(this.options.slideAmount);
            }
        }, this.options.autoSlideInterval);
    }
    
    smoothScrollBy(amount) {
        const start = this.container.scrollLeft;
        const target = start + amount;
        const maxScroll = this.container.scrollWidth - this.container.clientWidth;
        
        const finalTarget = target > maxScroll ? 0 : target;
        
        const duration = 800;
        const startTime = performance.now();
        
        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeInOutQuad = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            
            if (finalTarget === 0 && target > maxScroll) {
                this.container.scrollLeft = start + (maxScroll - start) * easeInOutQuad;
                
                if (progress >= 1) {
                    this.container.scrollLeft = 0;
                }
            } else {
                this.container.scrollLeft = start + (finalTarget - start) * easeInOutQuad;
            }
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };
        
        requestAnimationFrame(animateScroll);
    }
    
    pauseAutoSlide() {
        this.isPaused = true;
    }
    
    resumeAutoSlide() {
        this.isPaused = false;
    }
    
    setupHoverPause() {
        this.container.addEventListener('mouseenter', () => {
            this.pauseAutoSlide();
        });
        
        this.container.addEventListener('mouseleave', () => {
            if (!this.isDown) {
                this.resumeAutoSlide();
            }
        });
    }
    
    setupKeyboardNav() {
        this.container.setAttribute('tabindex', '0');
        
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.pauseAutoSlide();
                this.smoothScrollBy(-this.options.slideAmount);
                setTimeout(() => this.resumeAutoSlide(), 2000);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.pauseAutoSlide();
                this.smoothScrollBy(this.options.slideAmount);
                setTimeout(() => this.resumeAutoSlide(), 2000);
            }
        });
    }
    
    destroy() {
        if (this.autoSlideTimer) {
            clearInterval(this.autoSlideTimer);
        }
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const portfolioCardsContainer = document.querySelector('.portfolio-cards');
    const teamMembersContainer = document.querySelector('.team-members');
    
    if (portfolioCardsContainer) {
        new AutoCarousel(portfolioCardsContainer, {
            autoSlideInterval: 3000,
            slideAmount: 400
        });
        console.log('✅ Portfolio Cards carousel initialized');
    }
    
    if (teamMembersContainer) {
        new AutoCarousel(teamMembersContainer, {
            autoSlideInterval: 3000,
            slideAmount: 350
        });
        console.log('✅ Team Members carousel initialized');
    }
});
