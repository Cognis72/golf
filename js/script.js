// GreenSwing Golf Equipment Store - Main JavaScript File

// Global state management
const AppState = {
    currentLang: 'en',
    currentTheme: 'light',
    currentCategory: 'all'
};

// Utility functions
const Utils = {
    // Get element by ID
    $(id) {
        return document.getElementById(id);
    },

    // Get elements by selector
    $$(selector) {
        return document.querySelectorAll(selector);
    },

    // Add event listener to element
    on(element, event, handler) {
        if (element) {
            element.addEventListener(event, handler);
        }
    },

    // Debounce function for performance optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Animate element with CSS transitions
    animate(element, property, value, duration = 300) {
        if (!element) return;
        
        element.style.transition = `${property} ${duration}ms ease-in-out`;
        element.style[property] = value;
        
        setTimeout(() => {
            element.style.transition = '';
        }, duration);
    },

    // Show/hide element with animation
    toggle(element, show) {
        if (!element) return;
        
        if (show) {
            element.style.display = 'block';
            requestAnimationFrame(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            });
        } else {
            element.style.opacity = '0';
            element.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                element.style.display = 'none';
            }, 300);
        }
    }
};

// Local Storage Management
const Storage = {
    // Save data to localStorage
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
        }
    },

    // Get data from localStorage
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn('Failed to read from localStorage:', error);
            return defaultValue;
        }
    },

    // Remove data from localStorage
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn('Failed to remove from localStorage:', error);
        }
    }
};

// Theme Management
const ThemeManager = {
    init() {
        // Load saved theme or default to light
        const savedTheme = Storage.get('theme', 'light');
        this.setTheme(savedTheme);
        
        // Set up theme toggle button
        const themeToggle = Utils.$('themeToggle');
        Utils.on(themeToggle, 'click', () => {
            this.toggleTheme();
        });
    },

    setTheme(theme) {
        AppState.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update theme toggle button
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
        
        // Save to localStorage
        Storage.set('theme', theme);
        
        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme } 
        }));
    },

    toggleTheme() {
        const newTheme = AppState.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    },

    getCurrentTheme() {
        return AppState.currentTheme;
    }
};

// Language Management
const LanguageManager = {
    translations: {
        en: {
            // Navigation
            'home': 'Home',
            'products': 'Products',
            'about': 'About',
            'contact': 'Contact',
            
            // Common
            'loading': 'Loading...',
            'error': 'Error occurred',
            'success': 'Success',
            'close': 'Close',
            
            // Product conditions
            'like-new': 'Like New',
            'excellent': 'Excellent',
            'good': 'Good',
            'fair': 'Fair',
            
            // Product categories
            'all': 'All Products',
            'clubs': 'Clubs',
            'balls': 'Balls',
            'bags': 'Bags',
            'accessories': 'Accessories'
        },
        th: {
            // Navigation
            'home': 'หน้าแรก',
            'products': 'สินค้า',
            'about': 'เกี่ยวกับเรา',
            'contact': 'ติดต่อ',
            
            // Common
            'loading': 'กำลังโหลด...',
            'error': 'เกิดข้อผิดพลาด',
            'success': 'สำเร็จ',
            'close': 'ปิด',
            
            // Product conditions
            'like-new': 'เหมือนใหม่',
            'excellent': 'สภาพดีเยี่ยม',
            'good': 'สภาพดี',
            'fair': 'สภาพพอใช้',
            
            // Product categories
            'all': 'สินค้าทั้งหมด',
            'clubs': 'ไม้กอล์ฟ',
            'balls': 'ลูกกอล์ฟ',
            'bags': 'กระเป๋า',
            'accessories': 'อุปกรณ์เสริม'
        }
    },

    init() {
        // Load saved language or default to English
        const savedLang = Storage.get('language', 'en');
        this.setLanguage(savedLang);
        
        // Set up language toggle button
        const langToggle = Utils.$('langToggle');
        Utils.on(langToggle, 'click', () => {
            this.toggleLanguage();
        });
    },

    setLanguage(lang) {
        AppState.currentLang = lang;
        document.documentElement.setAttribute('lang', lang);
        
        // Update all elements with data-en and data-th attributes
        const elementsToTranslate = Utils.$$('[data-en][data-th]');
        elementsToTranslate.forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                element.textContent = text;
            }
        });
        
        // Update placeholders
        const elementsWithPlaceholders = Utils.$$('[data-placeholder-en][data-placeholder-th]');
        elementsWithPlaceholders.forEach(element => {
            const placeholder = element.getAttribute(`data-placeholder-${lang}`);
            if (placeholder) {
                element.setAttribute('placeholder', placeholder);
            }
        });
        
        // Update meta descriptions
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            const content = metaDescription.getAttribute(`data-${lang}`);
            if (content) {
                metaDescription.setAttribute('content', content);
            }
        }
        
        // Update page title
        const titleElement = document.querySelector('title');
        if (titleElement) {
            const title = titleElement.getAttribute(`data-${lang}`);
            if (title) {
                titleElement.textContent = title;
            }
        }
        
        // Update language toggle button
        const langText = document.querySelector('.lang-text');
        if (langText) {
            langText.textContent = lang.toUpperCase();
        }
        
        // Save to localStorage
        Storage.set('language', lang);
        
        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: lang } 
        }));
    },

    toggleLanguage() {
        const newLang = AppState.currentLang === 'en' ? 'th' : 'en';
        this.setLanguage(newLang);
    },

    getCurrentLanguage() {
        return AppState.currentLang;
    },

    translate(key) {
        return this.translations[AppState.currentLang]?.[key] || key;
    }
};

// Navigation Management
const NavigationManager = {
    init() {
        // Set up mobile hamburger menu
        const hamburger = Utils.$('hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        Utils.on(hamburger, 'click', () => {
            this.toggleMobileMenu();
        });
        
        // Close mobile menu when clicking on nav links
        const navLinks = Utils.$$('.nav-link');
        navLinks.forEach(link => {
            Utils.on(link, 'click', () => {
                this.closeMobileMenu();
            });
        });
        
        // Handle navigation highlighting
        this.updateActiveNavigation();
        
        // Handle URL category parameters
        this.handleURLParameters();
    },

    toggleMobileMenu() {
        const hamburger = Utils.$('hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        }
    },

    closeMobileMenu() {
        const hamburger = Utils.$('hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    },

    updateActiveNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = Utils.$$('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    },

    handleURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        if (category && window.location.pathname.includes('products.html')) {
            // Set category filter if on products page
            setTimeout(() => {
                ProductManager.filterByCategory(category);
            }, 100);
        }
    }
};

// Product Management
const ProductManager = {
    init() {
        // Only initialize on products page
        if (!window.location.pathname.includes('products.html')) {
            return;
        }
        
        this.setupFilterButtons();
        this.setupLoadMoreButton();
        this.updateResultsCount();
        
        // Handle category from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        if (category) {
            this.filterByCategory(category);
        }
    },

    setupFilterButtons() {
        const filterButtons = Utils.$$('.filter-btn');
        
        filterButtons.forEach(button => {
            Utils.on(button, 'click', (e) => {
                const category = e.target.getAttribute('data-category');
                this.filterByCategory(category);
            });
        });
    },

    filterByCategory(category) {
        AppState.currentCategory = category;
        
        // Update active filter button
        const filterButtons = Utils.$$('.filter-btn');
        filterButtons.forEach(btn => {
            if (btn.getAttribute('data-category') === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Filter products
        const productCards = Utils.$$('.product-card');
        let visibleCount = 0;
        
        productCards.forEach(card => {
            const productCategory = card.getAttribute('data-category');
            const shouldShow = category === 'all' || productCategory === category;
            
            if (shouldShow) {
                card.style.display = 'block';
                Utils.animate(card, 'opacity', '1');
                visibleCount++;
            } else {
                Utils.animate(card, 'opacity', '0');
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        this.updateResultsCount(visibleCount, category);
        
        // Update URL without reloading page
        const url = new URL(window.location);
        if (category === 'all') {
            url.searchParams.delete('category');
        } else {
            url.searchParams.set('category', category);
        }
        window.history.replaceState({}, '', url);
    },

    updateResultsCount(count = null, category = 'all') {
        const resultsElement = Utils.$('resultsCount');
        if (!resultsElement) return;
        
        if (count === null) {
            const visibleProducts = Utils.$$('.product-card:not([style*="display: none"])');
            count = visibleProducts.length;
        }
        
        const currentLang = LanguageManager.getCurrentLanguage();
        let text;
        
        if (category === 'all') {
            text = currentLang === 'en' 
                ? `Showing all ${count} products`
                : `แสดงสินค้าทั้งหมด ${count} รายการ`;
        } else {
            const categoryName = LanguageManager.translate(category);
            text = currentLang === 'en'
                ? `Showing ${count} ${categoryName.toLowerCase()}`
                : `แสดง${categoryName} ${count} รายการ`;
        }
        
        resultsElement.textContent = text;
    },

    setupLoadMoreButton() {
        const loadMoreBtn = Utils.$('loadMoreBtn');
        if (!loadMoreBtn) return;
        
        Utils.on(loadMoreBtn, 'click', () => {
            this.loadMoreProducts();
        });
    },

    loadMoreProducts() {
        // Simulate loading more products
        const loadMoreBtn = Utils.$('loadMoreBtn');
        if (!loadMoreBtn) return;
        
        const originalText = loadMoreBtn.textContent;
        loadMoreBtn.textContent = LanguageManager.translate('loading');
        loadMoreBtn.disabled = true;
        
        setTimeout(() => {
            loadMoreBtn.textContent = originalText;
            loadMoreBtn.disabled = false;
            
            // In a real application, you would fetch more products here
            console.log('Loading more products...');
        }, 1000);
    }
};

// Contact Form Management
const ContactManager = {
    init() {
        // Only initialize on contact page
        if (!window.location.pathname.includes('contact.html')) {
            return;
        }
        
        this.setupContactForm();
        this.setupContactButtons();
    },

    setupContactForm() {
        const contactForm = Utils.$('contactForm');
        if (!contactForm) return;
        
        Utils.on(contactForm, 'submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(contactForm);
        });
        
        // Setup form validation
        this.setupFormValidation(contactForm);
    },

    setupFormValidation(form) {
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            Utils.on(field, 'blur', () => {
                this.validateField(field);
            });
            
            Utils.on(field, 'input', () => {
                this.clearFieldError(field);
            });
        });
    },

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = LanguageManager.getCurrentLanguage() === 'en' 
                ? 'This field is required' 
                : 'ฟิลด์นี้จำเป็น';
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = LanguageManager.getCurrentLanguage() === 'en'
                    ? 'Please enter a valid email address'
                    : 'กรุณากรอกที่อยู่อีเมลที่ถูกต้อง';
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = LanguageManager.getCurrentLanguage() === 'en'
                    ? 'Please enter a valid phone number'
                    : 'กรุณากรอกหมายเลขโทรศัพท์ที่ถูกต้อง';
            }
        }
        
        this.showFieldError(field, isValid, errorMessage);
        return isValid;
    },

    showFieldError(field, isValid, errorMessage) {
        const formGroup = field.closest('.form-group');
        const existingError = formGroup.querySelector('.field-error');
        
        if (existingError) {
            existingError.remove();
        }
        
        if (!isValid && errorMessage) {
            field.style.borderColor = '#dc3545';
            
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.style.color = '#dc3545';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = '0.25rem';
            errorElement.textContent = errorMessage;
            
            formGroup.appendChild(errorElement);
        } else {
            field.style.borderColor = '';
        }
    },

    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        const existingError = formGroup.querySelector('.field-error');
        
        if (existingError) {
            existingError.remove();
        }
        
        field.style.borderColor = '';
    },

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = {};
        
        // Validate all fields
        let isFormValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            this.showNotification('error', 
                LanguageManager.getCurrentLanguage() === 'en'
                    ? 'Please correct the errors above'
                    : 'กรุณาแก้ไขข้อผิดพลาดข้างต้น'
            );
            return;
        }
        
        // Collect form data
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Simulate form submission
        this.submitForm(data, form);
    },

    submitForm(data, form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.textContent = LanguageManager.translate('loading');
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Reset form and button
            form.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            // Show success message
            this.showNotification('success',
                LanguageManager.getCurrentLanguage() === 'en'
                    ? 'Thank you for your message! We\'ll get back to you soon.'
                    : 'ขอบคุณสำหรับข้อความของคุณ! เราจะติดต่อกลับโดยเร็วที่สุด'
            );
            
            // In a real application, you would send the data to your server
            console.log('Form submitted:', data);
        }, 2000);
    },

    setupContactButtons() {
        // Setup LINE contact buttons
        const lineButtons = Utils.$$('[data-line-url]');
        lineButtons.forEach(button => {
            Utils.on(button, 'click', (e) => {
                e.preventDefault();
                const lineUrl = button.getAttribute('data-line-url');
                if (lineUrl) {
                    window.open(lineUrl, '_blank');
                }
            });
        });
    },

    showNotification(type, message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 400px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease-in-out;
            ${type === 'success' ? 'background-color: #28a745;' : 'background-color: #dc3545;'}
        `;
        notification.textContent = message;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
};

// Performance Optimization
const PerformanceManager = {
    init() {
        this.setupLazyLoading();
        this.setupScrollOptimization();
    },

    setupLazyLoading() {
        // Lazy load images when they come into viewport
        const images = Utils.$$('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    },

    setupScrollOptimization() {
        // Optimize scroll events with debouncing
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollProgress();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    },

    updateScrollProgress() {
        // Update scroll progress indicator if it exists
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = `${Math.min(scrolled, 100)}%`;
        }
    }
};

// Analytics and Tracking
const AnalyticsManager = {
    init() {
        this.setupEventTracking();
    },

    setupEventTracking() {
        // Track button clicks
        const buttons = Utils.$$('.btn');
        buttons.forEach(button => {
            Utils.on(button, 'click', (e) => {
                const buttonText = button.textContent.trim();
                const buttonClass = button.className;
                this.trackEvent('button_click', {
                    button_text: buttonText,
                    button_class: buttonClass,
                    page: window.location.pathname
                });
            });
        });
        
        // Track product interests
        const productCards = Utils.$$('.product-card');
        productCards.forEach(card => {
            Utils.on(card, 'click', (e) => {
                const productName = card.querySelector('.product-name')?.textContent;
                const productCategory = card.getAttribute('data-category');
                this.trackEvent('product_interest', {
                    product_name: productName,
                    category: productCategory,
                    page: window.location.pathname
                });
            });
        });
        
        // Track language changes
        document.addEventListener('languageChanged', (e) => {
            this.trackEvent('language_changed', {
                new_language: e.detail.language,
                page: window.location.pathname
            });
        });
        
        // Track theme changes
        document.addEventListener('themeChanged', (e) => {
            this.trackEvent('theme_changed', {
                new_theme: e.detail.theme,
                page: window.location.pathname
            });
        });
    },

    trackEvent(eventName, parameters = {}) {
        // In a real application, you would send this to your analytics service
        console.log('Analytics Event:', eventName, parameters);
        
        // Example: Send to Google Analytics
        // if (typeof gtag !== 'undefined') {
        //     gtag('event', eventName, parameters);
        // }
    }
};

// Application Initialization
class GreenSwingApp {
    constructor() {
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;
        
        try {
            // Wait for DOM to be fully loaded
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }
            
            // Initialize all managers
            ThemeManager.init();
            LanguageManager.init();
            NavigationManager.init();
            ProductManager.init();
            ContactManager.init();
            PerformanceManager.init();
            AnalyticsManager.init();
            
            this.initialized = true;
            
            // Dispatch app ready event
            document.dispatchEvent(new CustomEvent('appReady'));
            
            console.log('GreenSwing App initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize GreenSwing App:', error);
        }
    }

    // Public API methods
    getState() {
        return { ...AppState };
    }

    setLanguage(lang) {
        LanguageManager.setLanguage(lang);
    }

    setTheme(theme) {
        ThemeManager.setTheme(theme);
    }

    filterProducts(category) {
        ProductManager.filterByCategory(category);
    }
}

// Initialize the application
const app = new GreenSwingApp();

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

// Make app available globally for debugging and external scripts
window.GreenSwingApp = app;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GreenSwingApp;
}
