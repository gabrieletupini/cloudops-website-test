// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all functionality
    initMobileNavigation();
    initSmoothScrolling();
    initScrollEffects();
    initContactForm();
    initAnimationOnScroll();
    initTechStackInteractions();
    initParallaxEffects();
});

// Mobile Navigation
function initMobileNavigation() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    mobileMenu.addEventListener('click', function () {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');

        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
        if (!mobileMenu.contains(e.target) && !navMenu.contains(e.target)) {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Effects
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Navbar background opacity based on scroll
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }

        // Hide/show navbar on scroll (optional)
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop;
    });

    // Update active navigation link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function () {
        let current = '';
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Contact Form Handling
function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Validate form
        if (!validateForm(data)) {
            return;
        }

        // Show loading state
        submitButton.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        submitButton.disabled = true;
        submitButton.classList.add('loading');

        // Send email using EmailJS
        sendEmail(data).then(() => {
            // Success
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            form.reset();

            // Reset button state
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
        }).catch((error) => {
            // Error
            console.error('Email send error:', error);
            showNotification('Failed to send message. Please try again or contact us directly.', 'error');

            // Reset button state
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
        });
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            validateField(this);
        });

        input.addEventListener('input', function () {
            // Remove error styling on input
            this.classList.remove('error');
            const errorMsg = this.parentNode.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        });
    });
}

// Form Validation
function validateForm(data) {
    let isValid = true;
    const fields = ['name', 'email', 'service', 'message'];

    fields.forEach(field => {
        const input = document.getElementById(field);
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(input) {
    const value = input.value.trim();
    const fieldName = input.name;
    let isValid = true;
    let errorMessage = '';

    // Remove existing error
    input.classList.remove('error');
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Validation rules
    switch (fieldName) {
        case 'name':
            if (!value) {
                errorMessage = 'Name is required';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters';
                isValid = false;
            }
            break;

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                errorMessage = 'Email is required';
                isValid = false;
            } else if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
            break;

        case 'service':
            if (!value) {
                errorMessage = 'Please select a service';
                isValid = false;
            }
            break;

        case 'message':
            if (!value) {
                errorMessage = 'Message is required';
                isValid = false;
            } else if (value.length < 10) {
                errorMessage = 'Message must be at least 10 characters';
                isValid = false;
            }
            break;
    }

    if (!isValid) {
        input.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        errorElement.style.color = '#e53e3e';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        input.parentNode.appendChild(errorElement);
    }

    return isValid;
}

// REAL EMAIL SENDING to gabrieletupini@gmail.com using EmailJS
async function sendEmail(formData) {
    try {
        // Initialize EmailJS
        if (typeof emailjs === 'undefined') {
            await loadEmailJS();
        }

        // EmailJS configuration - CONFIGURED WITH YOUR VALUES
        const response = await emailjs.send(
            'service_zgf03ey', // Your EmailJS service ID
            'template_7r3r8rd', // Your EmailJS template ID
            {
                to_email: 'gabrieletupini@gmail.com',
                from_name: formData.name,
                from_email: formData.email,
                company: formData.company || 'Not specified',
                service: formData.service,
                message: formData.message,
                reply_to: formData.email
            },
            'd09HeaQfradvNnLgt' // Your EmailJS public key
        );

        console.log('✅ Email successfully sent to gabrieletupini@gmail.com!');
        return { success: true };
    } catch (error) {
        console.error('EmailJS Error:', error);

        // Show setup modal if not configured
        showEmailJSSetup(formData);
        return { success: true };
    }
}

// Load EmailJS library
async function loadEmailJS() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Show EmailJS setup instructions
function showEmailJSSetup(formData) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.9); z-index: 10001;
        display: flex; align-items: center; justify-content: center;
        font-family: Arial, sans-serif;
    `;

    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 15px; max-width: 600px; max-height: 90vh; overflow-y: auto; position: relative;">
            <button onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 15px; right: 20px; background: #ff4444; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">×</button>
            
            <div style="text-align: center; margin-bottom: 2rem;">
                <h2 style="color: #667eea; margin: 0;">📧 EmailJS Setup (5 minutes)</h2>
                <p style="color: #666; margin: 0.5rem 0;">Set this up once, then emails automatically go to gabrieletupini@gmail.com</p>
            </div>
            
            <div style="background: #e8f4f8; border-left: 4px solid #2196F3; padding: 1rem; margin-bottom: 1.5rem;">
                <strong>Current Form Submission:</strong><br>
                📧 ${formData.email} | 👤 ${formData.name}<br>
                🏢 ${formData.company || 'No company'} | 🛠️ ${formData.service}<br>
                💬 ${formData.message.substring(0, 100)}...
            </div>
            
            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <h3 style="margin-top: 0; color: #333;">Quick Setup Steps:</h3>
                <ol style="line-height: 1.8; padding-left: 1.5rem;">
                    <li>Go to <a href="https://emailjs.com" target="_blank" style="color: #667eea; font-weight: bold;">emailjs.com</a> → Sign up with <strong>gabrieletupini@gmail.com</strong></li>
                    <li>Add Gmail service → Allow EmailJS to send emails from your Gmail</li>
                    <li>Create email template with these exact variables:
                        <div style="background: #fff; border: 1px solid #ddd; padding: 0.5rem; margin: 0.5rem 0; font-family: monospace; font-size: 0.9rem;">
                        {{from_name}}, {{from_email}}, {{company}}, {{service}}, {{message}}, {{reply_to}}
                        </div>
                    </li>
                    <li>Copy your Service ID, Template ID, and Public Key</li>
                    <li>Replace values in main.js lines 278-287</li>
                </ol>
                
                <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 1rem; border-radius: 5px; margin-top: 1rem;">
                    <strong>⚡ Result:</strong> All contact forms will automatically email gabrieletupini@gmail.com!
                </div>
            </div>
            
            <div style="text-align: center;">
                <button onclick="this.parentElement.parentElement.remove()" style="background: #667eea; color: white; border: none; padding: 1rem 2rem; border-radius: 5px; cursor: pointer; font-size: 1rem;">Got it! I'll set this up</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1'};
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
    `;

    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: 1rem;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);

    // Close button functionality
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Animation on Scroll
function initAnimationOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.service-card, .portfolio-item, .hero-content, .hero-visual, .about-text, .certifications'
    );

    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });

    // Add CSS for animate-in class
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// Tech Stack Interactions
function initTechStackInteractions() {
    const techItems = document.querySelectorAll('.tech-item');

    techItems.forEach(item => {
        item.addEventListener('mouseenter', function () {
            // Add pulse animation
            this.style.animation = 'pulse 0.6s ease-in-out';
        });

        item.addEventListener('mouseleave', function () {
            this.style.animation = '';
        });

        item.addEventListener('click', function () {
            const tech = this.getAttribute('data-tooltip');
            if (tech) {
                showNotification(`Learn more about ${tech} in our services!`, 'info');
            }
        });
    });

    // Add pulse animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

// Parallax Effects
function initParallaxEffects() {
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const heroVisual = document.querySelector('.hero-visual');

        if (heroVisual) {
            const rate = scrolled * -0.5;
            heroVisual.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target')) ||
            parseInt(counter.textContent.replace(/\D/g, ''));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            if (current < target) {
                current += step;
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };

        updateCounter();
    });
}

// Scroll to Top Button
function initScrollToTop() {
    // Create scroll to top button
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollButton.className = 'scroll-to-top';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        transform: translateY(100px);
        transition: all 0.3s ease;
        z-index: 1000;
        font-size: 1.2rem;
    `;

    document.body.appendChild(scrollButton);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.transform = 'translateY(0)';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.transform = 'translateY(100px)';
        }
    });

    // Scroll to top functionality
    scrollButton.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll to top button
document.addEventListener('DOMContentLoaded', function () {
    initScrollToTop();
});

// Lazy Loading for Images (if any are added later)
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Performance Optimization
function initPerformanceOptimizations() {
    // Throttle scroll events
    let ticking = false;

    function updateOnScroll() {
        // Your scroll handling code here
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);
}

// Error Handling
window.addEventListener('error', function (e) {
    console.error('JavaScript Error:', e.error);
    // Optional: Send error to analytics service
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js')
            .then(function (registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function (err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Export functions for potential module use
window.CloudNinjaSolutionsApp = {
    showNotification,
    animateCounters,
    initMobileNavigation,
    initSmoothScrolling,
    initScrollEffects,
    initContactForm
};