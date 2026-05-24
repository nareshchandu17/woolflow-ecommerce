// WoolFlow E-commerce JavaScript - Production Grade
// Advanced security, analytics, and performance monitoring

// Global variables
let cart = JSON.parse(localStorage.getItem('woolflow-cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('woolflow-wishlist')) || [];
let products = [];
let filteredProducts = [];
let currentProduct = null;
let userSession = null;
let analytics = null;
let securityMonitor = null;
let isDarkMode = JSON.parse(localStorage.getItem('woolflow-darkmode')) || false;

// Search System
let searchHistory = JSON.parse(localStorage.getItem('woolflow-search-history')) || [];
let currentSearchQuery = '';
let selectedSuggestionIndex = -1;

// Security Configuration
const SECURITY_CONFIG = {
    cspNonce: generateNonce(),
    encryptionKey: 'woolflow-production-key-2024',
    rateLimitWindow: 60000, // 1 minute
    maxRequests: 100,
    sessionTimeout: 1800000 // 30 minutes
};

// Analytics Configuration
const ANALYTICS_CONFIG = {
    trackingEnabled: true,
    apiEndpoint: 'https://analytics.woolflow.com/api/v1',
    sessionId: generateSessionId(),
    userId: null,
    eventsQueue: []
};

// Performance Monitoring
const PERFORMANCE_CONFIG = {
    monitoringEnabled: true,
    metricsInterval: 5000,
    maxMeasureTime: 15000,
    criticalThresholds: {
        pageLoad: 3000,
        interactive: 5000,
        cls: 0.1,
        lcp: 2500
    }
};

// Product data
const productData = [
    {
        id: 'urban-runner',
        name: 'Urban Wool Runner',
        color: 'Oat',
        price: 149,
        category: 'urban',
        image: 'resources/product-urban-oat.jpg',
        description: 'Premium merino wool sneakers with temperature regulation and moisture-wicking technology. Perfect for daily urban adventures.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [7, 8, 9, 10, 11],
        rating: 4.8,
        reviewCount: 124,
        reviews: [
            { name: 'Sarah M.', rating: 5, date: '2026-04-15', text: 'Best sneakers I\'ve ever owned! So comfortable and stylish. Perfect for my daily commute.' },
            { name: 'James K.', rating: 5, date: '2026-04-10', text: 'Amazing quality and the wool really does regulate temperature. Worth every penny.' },
            { name: 'Emily R.', rating: 4, date: '2026-03-28', text: 'Love the design and comfort. Runs slightly small so order a half size up.' }
        ],
        variants: [
            { color: 'Oat', image: 'resources/product-urban-oat.jpg', price: 149, stock: 45 },
            { color: 'Sage', image: 'resources/product-urban-sage.jpg', price: 149, stock: 32 },
            { color: 'Charcoal', image: 'resources/product-urban-charcoal.jpg', price: 159, stock: 28 },
            { color: 'Mist', image: 'resources/product-urban-mist.jpg', price: 149, stock: 15 }
        ],
        stockBySize: {
            'Oat': { 7: 8, 8: 12, 9: 15, 10: 10, 11: 0, 12: 0 },
            'Sage': { 7: 5, 8: 8, 9: 10, 10: 6, 11: 3, 12: 0 },
            'Charcoal': { 7: 0, 8: 6, 9: 8, 10: 7, 11: 5, 12: 2 },
            'Mist': { 7: 3, 8: 4, 9: 5, 10: 2, 11: 1, 12: 0 }
        },
        lowStockThreshold: 5
    },
    {
        id: 'city-sage',
        name: 'City Trekker',
        color: 'Sage',
        price: 169,
        category: 'urban',
        image: 'resources/product-urban-sage.jpg',
        description: 'All-terrain wool sneakers with enhanced grip and waterproof protection. Built for city exploration.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [8, 9, 10, 11, 12],
        rating: 4.6,
        reviewCount: 89,
        reviews: [
            { name: 'Michael T.', rating: 5, date: '2026-04-20', text: 'Great grip and waterproof! Perfect for rainy days in the city.' },
            { name: 'Lisa W.', rating: 4, date: '2026-04-05', text: 'Excellent build quality. Very durable and comfortable.' }
        ]
    },
    {
        id: 'metro-mist',
        name: 'Metro Slip-On',
        color: 'Mist',
        price: 129,
        category: 'casual',
        image: 'resources/product-urban-mist.jpg',
        description: 'Effortless style meets comfort in these easy-wear wool slip-ons. Perfect for casual outings.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [7, 8, 9, 10],
        rating: 4.5,
        reviewCount: 67,
        reviews: [
            { name: 'David L.', rating: 5, date: '2026-04-18', text: 'Love these slip-ons! So easy to put on and incredibly comfortable.' },
            { name: 'Anna P.', rating: 4, date: '2026-03-30', text: 'Perfect for casual Fridays at work. Lightweight and breathable.' }
        ]
    },
    {
        id: 'street-charcoal',
        name: 'Street Walker',
        color: 'Charcoal',
        price: 159,
        category: 'urban',
        image: 'resources/product-urban-charcoal.jpg',
        description: 'Classic design with modern wool technology for everyday urban adventures. Timeless style meets innovation.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [8, 9, 10, 11, 12],
        rating: 4.7,
        reviewCount: 156,
        reviews: [
            { name: 'Robert H.', rating: 5, date: '2026-04-22', text: 'Classic look with modern comfort. These have become my daily drivers!' },
            { name: 'Jennifer C.', rating: 5, date: '2026-04-12', text: 'Got these for my husband and he loves them. Great quality and style.' }
        ]
    },
    {
        id: 'commuter-oat',
        name: 'Commuter Classic',
        color: 'Oat',
        price: 139,
        category: 'urban',
        image: 'resources/product-urban-oat.jpg',
        description: 'Perfect for daily commutes with superior comfort and style. Your go-to shoe for work and play.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [7, 8, 9, 10, 11]
    },
    {
        id: 'trail-sage',
        name: 'Trail Blazer',
        color: 'Sage',
        price: 179,
        category: 'active',
        image: 'resources/product-urban-sage.jpg',
        description: 'Rugged wool sneakers designed for outdoor adventures and city exploration. Built to last.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [9, 10, 11, 12]
    },
    {
        id: 'sport-mist',
        name: 'Sport Runner',
        color: 'Mist',
        price: 159,
        category: 'active',
        image: 'resources/product-urban-mist.jpg',
        description: 'High-performance wool sneakers for athletic activities. Natural comfort meets sport technology.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [7, 8, 9, 10, 11]
    },
    {
        id: 'hike-charcoal',
        name: 'Hike Lite',
        color: 'Charcoal',
        price: 169,
        category: 'active',
        image: 'resources/product-urban-charcoal.jpg',
        description: 'Lightweight hiking shoes with wool comfort. Perfect for trails and urban exploration.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [8, 9, 10, 11, 12]
    },
    {
        id: 'active-oat',
        name: 'Active Flow',
        color: 'Oat',
        price: 149,
        category: 'active',
        image: 'resources/product-urban-oat.jpg',
        description: 'Flow seamlessly from work to workout with these versatile active wool sneakers.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [7, 8, 9, 10]
    },
    {
        id: 'flex-sage',
        name: 'Flex Walker',
        color: 'Sage',
        price: 139,
        category: 'active',
        image: 'resources/product-urban-sage.jpg',
        description: 'Flexible and lightweight wool sneakers that move with you. Ultimate comfort for active lifestyles.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [7, 8, 9, 10, 11]
    },
    {
        id: 'weekend-mist',
        name: 'Weekend Walker',
        color: 'Mist',
        price: 129,
        category: 'casual',
        image: 'resources/product-urban-mist.jpg',
        description: 'Relaxed comfort for weekend adventures. Easy-going style with wool performance.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [7, 8, 9, 10, 11]
    },
    {
        id: 'lounge-oat',
        name: 'Lounge Loafer',
        color: 'Oat',
        price: 119,
        category: 'casual',
        image: 'resources/product-urban-oat.jpg',
        description: 'Ultimate comfort for relaxing moments. Wool luxury you can feel good about.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [7, 8, 9, 10]
    },
    {
        id: 'daily-charcoal',
        name: 'Daily Driver',
        color: 'Charcoal',
        price: 149,
        category: 'casual',
        image: 'resources/product-urban-charcoal.jpg',
        description: 'Your everyday companion. Reliable comfort and style for daily wear.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [8, 9, 10, 11, 12]
    },
    {
        id: 'comfort-sage',
        name: 'Comfort Step',
        color: 'Sage',
        price: 139,
        category: 'casual',
        image: 'resources/product-urban-sage.jpg',
        description: 'Every step matters. Experience cloud-like comfort with sustainable wool technology.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [7, 8, 9, 10, 11]
    },
    {
        id: 'easy-oat',
        name: 'Easy Go',
        color: 'Oat',
        price: 129,
        category: 'casual',
        image: 'resources/product-urban-oat.jpg',
        description: 'Slip-on convenience meets wool comfort. Perfect for busy lifestyles and travel.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [7, 8, 9, 10]
    },
    {
        id: 'urban-mist-plus',
        name: 'Urban Plus',
        color: 'Mist',
        price: 159,
        category: 'urban',
        image: 'resources/product-urban-mist.jpg',
        description: 'Enhanced urban performance with premium wool construction. Next-level city footwear.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [8, 9, 10, 11, 12]
    },
    {
        id: 'metro-charcoal-plus',
        name: 'Metro Plus',
        color: 'Charcoal',
        price: 169,
        category: 'urban',
        image: 'resources/product-urban-charcoal.jpg',
        description: 'Sophisticated urban design with advanced wool technology. Premium comfort for professionals.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [7, 8, 9, 10, 11]
    },
    {
        id: 'active-sage-plus',
        name: 'Active Plus',
        color: 'Sage',
        price: 179,
        category: 'active',
        image: 'resources/product-urban-sage.jpg',
        description: 'Peak performance wool sneakers for serious athletes. Natural materials, professional results.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [9, 10, 11, 12]
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    if (typeof WoolFlowCatalog !== 'undefined') {
        products = WoolFlowCatalog.loadProductCatalog();
    } else {
        products = [...productData];
    }
    filteredProducts = [...products];
    console.log(`✅ WoolFlow catalog: ${products.length} products loaded`);
    
    // Initialize dark mode
    initializeDarkMode();
    
    initializeApp();
    updateCartDisplay();
    updateWishlistDisplay();
    
    // Page-specific initialization
    if (window.location.pathname.includes('products.html')) {
        initializeProductsPage();
        renderRecentlyViewed();
        restoreSessionState();
    } else if (window.location.pathname.includes('cart.html')) {
        initializeCartPage();
    } else if (window.location.pathname.includes('wishlist.html')) {
        renderWishlistItems();
    } else {
        initializeHomePage();
    }
    
    // Initialize GSAP animations if available
    if (typeof gsap !== 'undefined') {
        initializeGSAPAnimations();
    }

    // Defensive fallback: external animation CDNs can be blocked, and interrupted
    // intro animations should never leave primary content invisible.
    ensureCriticalContentVisible();
    setTimeout(ensureCriticalContentVisible, 900);
    setTimeout(ensureCriticalContentVisible, 1800);
});

function ensureCriticalContentVisible() {
    const criticalSelectors = [
        '.nav-glass',
        '.hero',
        '.hero-content',
        '.hero-content > *',
        '.hero-image-container',
        '.products-section',
        '.products-grid',
        '.product-card',
        '.section-header',
        '.story-section',
        '.features-section',
        'footer'
    ];

    criticalSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            const computed = window.getComputedStyle(element);
            const opacity = Number.parseFloat(computed.opacity || element.style.opacity || '1');
            if (opacity < 0.98 || element.style.opacity === '0') {
                element.style.opacity = '1';
            }
            if (element.style.transform && element.style.transform.includes('translate')) {
                element.style.transform = '';
            }
            element.classList.add('visible');
        });
    });
}

// Dark Mode System
function initializeDarkMode() {
    // Keep the storefront light by default; only use dark mode after an explicit toggle.
    if (localStorage.getItem('woolflow-darkmode') === null) {
        isDarkMode = false;
    }
    
    applyDarkMode();
}

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('woolflow-darkmode', JSON.stringify(isDarkMode));
    applyDarkMode();
}

function applyDarkMode() {
    const body = document.body;
    const toggleBtn = document.getElementById('dark-mode-toggle');
    const icon = toggleBtn ? toggleBtn.querySelector('svg') : null;
    
    if (isDarkMode) {
        body.classList.add('dark-mode');
        if (icon) {
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>';
        }
    } else {
        body.classList.remove('dark-mode');
        if (icon) {
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>';
        }
    }
}

// Render dark mode toggle button
function renderDarkModeToggle() {
    return `
        <button id="dark-mode-toggle" onclick="toggleDarkMode()" class="p-2 rounded-full hover:bg-charcoal/10 transition-all" title="Toggle Dark Mode">
            <svg class="w-5 h-5 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
        </button>
    `;
}

// Initialize main app functionality
function initializeApp() {
    // Initialize scroll animations
    initializeScrollAnimations();
    
    // Initialize cart functionality
    initializeCart();
    
    // Initialize typewriter effect for home page
    if (!window.location.pathname.includes('products.html') && !window.location.pathname.includes('cart.html')) {
        initializeTypewriter();
    }
}

// Render homepage featured products from full catalog
function renderFeaturedProducts() {
    const grid = document.getElementById('featured-products-grid');
    if (!grid || !products.length) return;

    const tagged = products.filter(p => p.tags && (p.tags.includes('bestseller') || p.tags.includes('popular') || p.tags.includes('new')));
    const featured = (tagged.length >= 6 ? tagged : products).slice(0, 6);

    grid.innerHTML = featured.map((product, index) => {
        const inWishlist = isInWishlist(product.id);
        const badge = product.tags?.includes('bestseller') ? 'Popular' : product.tags?.includes('new') ? 'New' : '';
        const price = product.salePrice != null ? product.salePrice : product.price;
        return `
        <article class="product-card reveal stagger-${(index % 6) + 1}" data-product-id="${product.id}">
            <div class="product-image-container product-image-zoom-container">
                <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy" onerror="this.src='${getImageForColorFallback(product.color)}'">
                <div class="product-image-overlay"></div>
                ${badge ? `<span class="product-badge">${badge}</span>` : ''}
                <div class="product-quick-actions">
                    <button type="button" class="quick-action-btn" title="Quick view" onclick="event.stopPropagation(); openProductModal('${product.id}')">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    </button>
                    <button type="button" class="quick-action-btn" title="Add to wishlist" onclick="event.stopPropagation(); toggleWishlist('${product.id}')">
                        ${inWishlist ? getFilledHeartIcon() : getEmptyHeartIcon()}
                    </button>
                    <button type="button" class="quick-action-btn" title="Compare" onclick="event.stopPropagation(); toggleCompare('${product.id}')">⇄</button>
                </div>
            </div>
            <div class="product-content">
                <span class="product-category">${product.category} Collection</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price"><span class="product-price-currency">$</span>${price}</span>
                    <button type="button" class="btn-add-cart" onclick="openProductModal('${product.id}')">Select Size</button>
                </div>
            </div>
        </article>`;
    }).join('');

    if (typeof refreshAIFeatures === 'function') {
        setTimeout(refreshAIFeatures, 100);
    } else if (typeof enhanceProductCard === 'function') {
        featured.forEach(p => enhanceProductCard(p.id));
    }
}

function getImageForColorFallback(color) {
    if (typeof WoolFlowCatalog !== 'undefined') return WoolFlowCatalog.getImageForColor(color);
    return 'resources/product-urban-oat.jpg';
}

// Initialize home page specific features
function initializeHomePage() {
    renderFeaturedProducts();

    // Initialize hero carousel
    if (document.getElementById('hero-carousel')) {
        new Splide('#hero-carousel', {
            type: 'loop',
            autoplay: true,
            interval: 4000,
            arrows: false,
            pagination: false,
            drag: true
        }).mount();
    }
    
    // Initialize text splitting animations
    if (typeof Splitting !== 'undefined') {
        Splitting();
        
        // Animate split text
        anime({
            targets: '[data-splitting] .char',
            translateY: [100, 0],
            opacity: [0, 1],
            easing: 'easeOutExpo',
            duration: 1400,
            delay: anime.stagger(30)
        });
    }
}

// Initialize products page
function initializeProductsPage() {
    renderProducts();
    initializeFilters();
}

// Initialize cart page
function initializeCartPage() {
    renderCartItems();
    updateOrderSummary();
}

// Typewriter effect for hero section
function initializeTypewriter() {
    if (document.getElementById('typewriter')) {
        const typed = new Typed('#typewriter', {
            strings: [
                'Premium merino wool comfort',
                'Temperature regulating technology',
                'Sustainable urban footwear',
                'Natural materials, modern design'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            showCursor: false
        });
    }
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all fade-in elements
    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });
    
    // Initialize GSAP animations if available
    initializeGSAPAnimations();
}

// ============================================
// GSAP PREMIUM ANIMATIONS
// ============================================
function initializeGSAPAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero section animations
    initializeHeroAnimations();
    
    // Product cards stagger animation
    initializeProductCardAnimations();
    
    // Scroll-triggered section reveals
    initializeScrollRevealAnimations();
    
    // Cart interactions
    initializeCartAnimations();
    
    // Page transition animation
    initializePageTransition();
}

function initializeHeroAnimations() {
    // Hero content fade in
    gsap.from('.hero-content > *', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.3
    });
    
    // Hero image parallax
    gsap.from('.hero-image-container', {
        scale: 1.2,
        opacity: 0,
        duration: 1.2,
        ease: 'power2.out',
        delay: 0.5
    });
    
    // Floating shapes animation
    gsap.to('.hero-shape', {
        y: 'random(-20, 20)',
        x: 'random(-15, 15)',
        rotation: 'random(-10, 10)',
        duration: 'random(3, 5)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
            amount: 1,
            from: 'random'
        }
    });
}

function initializeProductCardAnimations() {
    // Product cards scroll-triggered animation
    gsap.utils.toArray('.product-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power2.out'
        });
    });
}

function initializeScrollRevealAnimations() {
    // Section headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
    });
    
    // Feature items stagger
    gsap.from('.feature-item', {
        scrollTrigger: {
            trigger: '.features-grid',
            start: 'top 75%'
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
    });
    
    // Story section parallax
    gsap.to('.story-image', {
        scrollTrigger: {
            trigger: '.story-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        },
        y: -50,
        ease: 'none'
    });
}

function initializeCartAnimations() {
    // Cart sidebar slide animation
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        // Initial state
        gsap.set(cartSidebar, { xPercent: 100 });
        
        // Create open/close functions
        window.openCartAnimation = () => {
            gsap.to(cartSidebar, {
                xPercent: 0,
                duration: 0.4,
                ease: 'power3.out'
            });
        };
        
        window.closeCartAnimation = () => {
            gsap.to(cartSidebar, {
                xPercent: 100,
                duration: 0.3,
                ease: 'power3.in'
            });
        };
    }
    
    // Add to cart button pulse
    gsap.utils.toArray('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            gsap.fromTo(btn, 
                { scale: 1 },
                { scale: 1.1, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' }
            );
        });
    });
}

function initializePageTransition() {
    // Page load animation
    gsap.from('body > *', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out'
    });
}

// Product card hover animation
function animateProductCardHover(element, isEntering) {
    if (typeof gsap === 'undefined') return;
    
    if (isEntering) {
        gsap.to(element, {
            y: -8,
            scale: 1.02,
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            duration: 0.3,
            ease: 'power2.out'
        });
    } else {
        gsap.to(element, {
            y: 0,
            scale: 1,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            duration: 0.3,
            ease: 'power2.out'
        });
    }
}

// Modal animations
function animateModalOpen(modal) {
    if (typeof gsap === 'undefined') return;
    
    gsap.fromTo(modal, 
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
    );
}

function animateModalClose(modal) {
    if (typeof gsap === 'undefined') return;
    
    gsap.to(modal, {
        opacity: 0,
        scale: 0.95,
        duration: 0.2,
        ease: 'power2.in'
    });
}

// Notification animation
function showNotification(message, type = 'success') {
    const container = document.getElementById('notification-container');
    if (!container) return;
    
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    
    notification.className = `${bgColor} text-white px-6 py-3 rounded-xl shadow-lg transform translate-x-full transition-all duration-300 flex items-center space-x-2`;
    notification.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            ${type === 'success' 
                ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>'
                : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>'
            }
        </svg>
        <span class="font-medium">${message}</span>
    `;
    
    container.appendChild(notification);
    
    // Animate in with GSAP
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(notification, 
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
        );
    } else {
        notification.classList.remove('translate-x-full');
    }
    
    // Remove after delay
    setTimeout(() => {
        if (typeof gsap !== 'undefined') {
            gsap.to(notification, {
                x: 100,
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => notification.remove()
            });
        } else {
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// Cart management functions
function initializeCart() {
    // Cart is already initialized via onclick="toggleCart()" in HTML
    // No additional event listener needed
}

function addToCart(productId, productName, price, image, size = null) {
    const existingItem = cart.find(item => item.id === productId && item.size === size);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            image: image,
            size: size,
            quantity: 1
        });
    }
    
    localStorage.setItem('woolflow-cart', JSON.stringify(cart));
    updateCartDisplay();
    
    // Cart bounce animation
    const cartIcon = document.getElementById('cart-toggle');
    if (cartIcon) {
        cartIcon.classList.add('cart-bounce');
        setTimeout(() => {
            cartIcon.classList.remove('cart-bounce');
        }, 600);
    }
    
    // Show success message
    showNotification('Added to cart!', 'success');
}

function removeFromCart(productId, size = null) {
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    localStorage.setItem('woolflow-cart', JSON.stringify(cart));
    updateCartDisplay();
    renderCartDrawerItems(); // Refresh cart drawer
    
    if (window.location.pathname.includes('cart.html')) {
        renderCartItems();
        updateOrderSummary();
    }
}

function updateCartQuantity(productId, size, newQuantity) {
    const item = cart.find(item => item.id === productId && item.size === size);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId, size);
        } else {
            item.quantity = newQuantity;
            localStorage.setItem('woolflow-cart', JSON.stringify(cart));
            updateCartDisplay();
            renderCartDrawerItems(); // Refresh cart drawer
            
            if (window.location.pathname.includes('cart.html')) {
                updateOrderSummary();
            }
        }
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
    
    if (cartTotal) {
        cartTotal.textContent = `$${totalPrice}`;
    }
    
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="text-center text-charcoal/70 py-12">
                    <svg class="w-16 h-16 mx-auto mb-4 text-mist-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0V19a2 2 0 002 2h7a2 2 0 002-2v-4"></path>
                    </svg>
                    <p>Your cart is empty</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="flex items-center space-x-4 p-4 border-b border-mist-grey/20">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg">
                    <div class="flex-1">
                        <h4 class="font-medium text-charcoal">${item.name}</h4>
                        ${item.size ? `<p class="text-sm text-charcoal/70">Size: ${item.size}</p>` : ''}
                        <p class="text-sm text-charcoal/70">$${item.price}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button onclick="updateCartQuantity('${item.id}', ${item.size || 'null'}, ${item.quantity - 1})" class="w-8 h-8 rounded-full bg-mist-grey/30 flex items-center justify-center text-charcoal hover:bg-sage hover:text-white transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                            </svg>
                        </button>
                        <span class="w-8 text-center font-medium">${item.quantity}</span>
                        <button onclick="updateCartQuantity('${item.id}', ${item.size || 'null'}, ${item.quantity + 1})" class="w-8 h-8 rounded-full bg-mist-grey/30 flex items-center justify-center text-charcoal hover:bg-sage hover:text-white transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
}

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    if (cartSidebar && cartOverlay) {
        const isOpen = cartSidebar.classList.contains('open');
        
        if (isOpen) {
            cartSidebar.classList.remove('open');
            cartOverlay.classList.remove('open');
            document.body.style.overflow = '';
        } else {
            cartSidebar.classList.add('open');
            cartOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            renderCartDrawerItems();
        }
    }
}

// Wishlist / Favorites System
function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification('Removed from wishlist', 'info');
    } else {
        wishlist.push(productId);
        showNotification('Added to wishlist!', 'success');
    }
    localStorage.setItem('woolflow-wishlist', JSON.stringify(wishlist));
    updateWishlistDisplay();
}

function isInWishlist(productId) {
    return wishlist.includes(productId);
}

function updateWishlistDisplay() {
    // Update wishlist count badge
    const wishlistCount = document.getElementById('wishlist-count');
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
        wishlistCount.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
    
    // Update heart icons on product cards
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const productId = btn.dataset.productId;
        const isActive = isInWishlist(productId);
        btn.classList.toggle('active', isActive);
        btn.innerHTML = isActive ? getFilledHeartIcon() : getEmptyHeartIcon();
    });
}

function getEmptyHeartIcon() {
    return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
    </svg>`;
}

function getFilledHeartIcon() {
    return `<svg class="w-5 h-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
    </svg>`;
}

function renderWishlistItems() {
    const wishlistContainer = document.getElementById('wishlist-items');
    if (!wishlistContainer) return;
    
    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = `
            <div class="text-center text-charcoal/70 py-12">
                <svg class="w-16 h-16 mx-auto mb-4 text-mist-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
                <p class="text-lg mb-2">Your wishlist is empty</p>
                <p class="text-sm">Save your favorite items for later</p>
                <a href="products.html" class="inline-block mt-4 px-6 py-2 bg-charcoal text-white rounded-full hover:bg-charcoal/90 transition-all">
                    Browse Products
                </a>
            </div>
        `;
        return;
    }
    
    const wishlistProducts = products.filter(p => wishlist.includes(p.id));
    wishlistContainer.innerHTML = wishlistProducts.map(product => `
        <div class="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm border border-mist-grey/20">
            <img src="${product.image}" alt="${product.name}" class="w-20 h-20 object-cover rounded-lg">
            <div class="flex-1">
                <h4 class="font-medium text-charcoal">${product.name}</h4>
                <p class="text-sm text-charcoal/70">$${product.price}</p>
            </div>
            <div class="flex items-center space-x-2">
                <button onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.image}')" class="px-4 py-2 bg-sage text-white rounded-full hover:bg-sage/90 transition-all text-sm">
                    Add to Cart
                </button>
                <button onclick="toggleWishlist('${product.id}')" class="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-all">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

// Product rendering functions
function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = filteredProducts.map((product, index) => {
        const inWishlist = isInWishlist(product.id);
        const price = product.salePrice != null ? product.salePrice : product.price;
        return `
        <article class="product-card bg-warm-white rounded-2xl p-6 shadow-lg fade-in-up stagger-delay-${(index % 6) + 1}" data-product-id="${product.id}" data-category="${product.category}" data-color="${product.color.toLowerCase()}">
            <div class="product-image-container relative mb-4">
                <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded-xl cursor-pointer" loading="lazy" onerror="this.src='${getImageForColorFallback(product.color)}'" onclick="openProductModal('${product.id}')">
                <button onclick="event.stopPropagation(); toggleWishlist('${product.id}')" 
                        class="wishlist-btn absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center transition-all hover:scale-110 z-10 ${inWishlist ? 'active text-red-500' : 'text-charcoal/60'}">
                    ${inWishlist ? getFilledHeartIcon() : getEmptyHeartIcon()}
                </button>
                ${product.id.includes('urban-oat') ? '<div class="absolute top-3 left-3 bg-sage text-white px-3 py-1 rounded-full text-sm font-medium">Popular</div>' : ''}
                ${product.id.includes('city-sage') ? '<div class="absolute top-3 left-3 bg-stone text-white px-3 py-1 rounded-full text-sm font-medium">New</div>' : ''}
            </div>
            <h4 class="text-xl font-semibold text-charcoal mb-2">${product.name}</h4>
            ${renderProductRating(product)}
            <p class="text-charcoal/70 mb-4 mt-2">${product.description}</p>
            <div class="flex items-center justify-between">
                <span class="text-2xl font-bold text-charcoal">$${price}</span>
                <button onclick="openProductModal('${product.id}')" class="px-6 py-2 bg-charcoal text-warm-white rounded-full hover:bg-charcoal/90 transition-all transform hover:scale-105">
                    Select Size
                </button>
            </div>
        </article>
    `}).join('');
    
    updateProductCount();

    if (typeof refreshAIFeatures === 'function') {
        setTimeout(refreshAIFeatures, 50);
    } else if (typeof enhanceProductCard === 'function') {
        filteredProducts.forEach(p => enhanceProductCard(p.id));
    }
    
    // Re-initialize scroll animations for new elements
    setTimeout(() => {
        document.querySelectorAll('.product-card.fade-in-up').forEach(el => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 });
            observer.observe(el);
        });
    }, 100);
}

// Filter functions
function initializeFilters() {
    // Filter checkboxes are already initialized in HTML
}

function applyFilters() {
    const categoryFilters = Array.from(document.querySelectorAll('input[value="urban"], input[value="active"], input[value="casual"], input[value="winter"]'))
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    const colorFilters = Array.from(document.querySelectorAll('input[value="oat"], input[value="sage"], input[value="mist"], input[value="charcoal"]'))
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    const sizeFilters = Array.from(document.querySelectorAll('input[value="7"], input[value="8"], input[value="9"], input[value="10"], input[value="11"], input[value="12"]'))
        .filter(cb => cb.checked)
        .map(cb => parseInt(cb.value));
    
    const priceFilters = Array.from(document.querySelectorAll('input[value="0-150"], input[value="150-170"], input[value="170-200"]'))
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    filteredProducts = products.filter(product => {
        // Category filter
        if (categoryFilters.length > 0 && !categoryFilters.includes(product.category)) {
            return false;
        }
        
        // Color filter
        if (colorFilters.length > 0 && !colorFilters.includes(product.color.toLowerCase())) {
            return false;
        }
        
        // Size filter
        if (sizeFilters.length > 0) {
            const hasMatchingSize = sizeFilters.some(size => product.availableSizes.includes(size));
            if (!hasMatchingSize) {
                return false;
            }
        }
        
        // Price filter
        if (priceFilters.length > 0) {
            const matchesPrice = priceFilters.some(range => {
                const [min, max] = range.split('-').map(p => p === '0' ? 0 : parseInt(p));
                return product.price >= min && (max ? product.price <= max : true);
            });
            if (!matchesPrice) {
                return false;
            }
        }
        
        return true;
    });
    
    renderProducts();
}

function clearFilters() {
    document.querySelectorAll('.filter-checkbox').forEach(cb => {
        cb.checked = false;
        cb.nextElementSibling.classList.remove('bg-charcoal', 'text-warm-white');
    });
    
    filteredProducts = [...products];
    renderProducts();
}

function sortProducts() {
    const sortSelect = document.getElementById('sort-select');
    const sortValue = sortSelect.value;
    
    switch (sortValue) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            filteredProducts.sort((a, b) => b.id.localeCompare(a.id));
            break;
        case 'popular':
            filteredProducts.sort((a, b) => {
                const aPopular = a.id.includes('urban-oat') || a.id.includes('commuter-oat');
                const bPopular = b.id.includes('urban-oat') || b.id.includes('commuter-oat');
                return bPopular - aPopular;
            });
            break;
        default:
            // Featured - keep original order
            break;
    }
    
    renderProducts();
}

function updateProductCount() {
    const productCount = document.getElementById('product-count');
    if (productCount) {
        productCount.textContent = filteredProducts.length;
    }
}

// Product modal functions
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    
    currentProduct = { ...product, selectedVariant: product.variants ? product.variants[0] : null, selectedSize: null };
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalPrice = document.getElementById('modal-price');
    const modalDescription = document.getElementById('modal-description');
    const sizeGrid = document.getElementById('modal-size-grid');
    const variantsContainer = document.getElementById('modal-variants');
    const colorGrid = document.getElementById('modal-color-grid');
    const stockIndicator = document.getElementById('modal-stock-indicator');
    
    modalTitle.textContent = product.name;
    modalImage.src = product.image;
    modalImage.alt = product.name;
    modalImage.style.display = 'block';
    modalPrice.textContent = `$${product.price}`;
    modalDescription.textContent = product.description;
    
    // Render variants if available
    if (product.variants && product.variants.length > 0) {
        variantsContainer.classList.remove('hidden');
        renderVariantSelector(product, colorGrid, stockIndicator);
    } else {
        variantsContainer.classList.add('hidden');
    }
    
    // Render size grid with stock information
    renderSizeGrid(product, sizeGrid, product.color);
    
    // Render reviews
    renderModalReviews(product);
    
    // Update add to cart button
    updateModalAddToCartButton();
    
    // Track product view
    addToRecentlyViewed(product);
    
    // Show modal with animation
    modal.classList.remove('hidden', 'opacity-0', 'invisible');
    document.body.style.overflow = 'hidden';
    animateModalOpen(modal);

    if (typeof enhanceProductDetail === 'function') {
        setTimeout(() => enhanceProductDetail(productId), 50);
    }

    // Bundle suggestion, review form, restock alerts
    if (!document.getElementById('bundle-suggestion')) {
        const bundleEl = document.createElement('div');
        bundleEl.id = 'bundle-suggestion';
        const addToCartBtn = document.getElementById('modal-add-to-cart');
        if (addToCartBtn && addToCartBtn.parentNode) {
            addToCartBtn.parentNode.insertBefore(bundleEl, addToCartBtn.nextSibling);
        }
    }
    renderBundleSuggestion(product);
    injectWriteReviewButton(product);
    patchSizeGridWithRestockAlerts(productId);
}

function renderVariantSelector(product, colorGrid, stockIndicator) {
    if (!colorGrid) return;
    
    colorGrid.innerHTML = product.variants.map((variant, index) => {
        const isSelected = currentProduct.selectedVariant && currentProduct.selectedVariant.color === variant.color;
        const stockStatus = getStockStatus(variant.stock, product.lowStockThreshold || 5);
        
        return `
            <button class="variant-option ${isSelected ? 'ring-2 ring-sage' : ''} relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all hover:scale-105"
                    onclick="selectVariant('${variant.color}')"
                    title="${variant.color} - ${stockStatus.label}">
                <img src="${variant.image}" alt="${variant.color}" class="w-full h-full object-cover">
                ${stockStatus.badge ? `<span class="absolute -top-1 -right-1 w-4 h-4 ${stockStatus.color} rounded-full text-white text-[8px] flex items-center justify-center font-bold">${stockStatus.badge}</span>` : ''}
                ${isSelected ? `<div class="absolute inset-0 bg-sage/20 flex items-center justify-center"><svg class="w-5 h-5 text-sage" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg></div>` : ''}
            </button>
        `;
    }).join('');
    
    // Update stock indicator
    if (stockIndicator && currentProduct.selectedVariant) {
        const variant = currentProduct.selectedVariant;
        const stockStatus = getStockStatus(variant.stock, product.lowStockThreshold || 5);
        stockIndicator.innerHTML = `<span class="${stockStatus.textColor}">${stockStatus.label}</span>`;
    }
}

function selectVariant(color) {
    if (!currentProduct || !currentProduct.variants) return;
    
    const variant = currentProduct.variants.find(v => v.color === color);
    if (!variant) return;
    
    currentProduct.selectedVariant = variant;
    currentProduct.selectedSize = null; // Reset size selection
    
    // Update modal display
    const modalImage = document.getElementById('modal-image');
    const modalPrice = document.getElementById('modal-price');
    const colorGrid = document.getElementById('modal-color-grid');
    const stockIndicator = document.getElementById('modal-stock-indicator');
    const sizeGrid = document.getElementById('modal-size-grid');
    
    // Animate image change
    if (typeof gsap !== 'undefined' && modalImage) {
        gsap.to(modalImage, { opacity: 0, duration: 0.15, onComplete: () => {
            modalImage.src = variant.image;
            gsap.to(modalImage, { opacity: 1, duration: 0.2 });
        }});
    } else if (modalImage) {
        modalImage.src = variant.image;
    }
    
    // Update price if different
    if (modalPrice && variant.price !== currentProduct.price) {
        modalPrice.textContent = `$${variant.price}`;
        gsap.fromTo(modalPrice, { scale: 1.2, color: '#ff6b6b' }, { scale: 1, color: '#1a1a1a', duration: 0.3 });
    }
    
    // Re-render variant selector
    renderVariantSelector(currentProduct, colorGrid, stockIndicator);
    
    // Re-render size grid with new variant stock
    renderSizeGrid(currentProduct, sizeGrid, color);
    
    // Update add to cart button
    updateModalAddToCartButton();
}

function getStockMapForColor(product, selectedColor) {
    if (!product.stockBySize) return {};
    if (product.stockBySize[selectedColor]) return product.stockBySize[selectedColor];
    const firstKey = Object.keys(product.stockBySize)[0];
    if (firstKey && !Number.isNaN(Number(firstKey))) return product.stockBySize;
    return {};
}

function renderSizeGrid(product, sizeGrid, selectedColor) {
    if (!sizeGrid) return;
    
    const stockBySize = getStockMapForColor(product, selectedColor);
    const lowThreshold = product.lowStockThreshold || 5;
    
    sizeGrid.innerHTML = product.sizes.map(size => {
        const stock = stockBySize[size] || 0;
        const isAvailable = stock > 0;
        const isSelected = currentProduct.selectedSize === size;
        const isLowStock = stock > 0 && stock <= lowThreshold;
        
        let statusClass = '';
        let statusIndicator = '';
        
        if (!isAvailable) {
            statusClass = 'opacity-40 cursor-not-allowed bg-mist-grey/30';
            statusIndicator = '<span class="absolute inset-0 flex items-center justify-center text-charcoal/30 text-xs">-</span>';
        } else if (isLowStock) {
            statusClass = isSelected ? 'ring-2 ring-orange-400 bg-orange-50' : 'hover:bg-orange-50';
            statusIndicator = `<span class="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" title="Only ${stock} left"></span>`;
        } else {
            statusClass = isSelected ? 'ring-2 ring-sage bg-sage/10' : 'hover:bg-sage/10';
        }
        
        return `
            <button class="size-option relative w-12 h-12 rounded-lg border border-mist-grey text-sm font-medium transition-all ${statusClass}" 
                    onclick="${isAvailable ? `selectModalSize(${size})` : ''}" 
                    ${!isAvailable ? 'disabled' : ''}
                    ${isLowStock ? `title="Only ${stock} left in stock"` : ''}>
                ${size}
                ${statusIndicator}
            </button>
        `;
    }).join('');
    
    // Update size stock info
    const sizeStockInfo = document.getElementById('modal-size-stock');
    if (sizeStockInfo) {
        const selectedStock = currentProduct.selectedSize ? (stockBySize[currentProduct.selectedSize] || 0) : 0;
        if (currentProduct.selectedSize) {
            if (selectedStock <= lowThreshold && selectedStock > 0) {
                sizeStockInfo.innerHTML = `<span class="text-orange-500 font-medium">Only ${selectedStock} left in size ${currentProduct.selectedSize}!</span>`;
            } else if (selectedStock > 0) {
                sizeStockInfo.innerHTML = `<span class="text-green-600">${selectedStock} available in size ${currentProduct.selectedSize}</span>`;
            }
        } else {
            sizeStockInfo.textContent = 'Select a size to see availability';
        }
    }
}

function selectModalSize(size) {
    if (!currentProduct) return;
    
    currentProduct.selectedSize = size;
    
    // Re-render size grid to show selection
    const sizeGrid = document.getElementById('modal-size-grid');
    const selectedColor = currentProduct.selectedVariant ? currentProduct.selectedVariant.color : currentProduct.color;
    renderSizeGrid(currentProduct, sizeGrid, selectedColor);
    
    // Update add to cart button
    updateModalAddToCartButton();
}

function getStockStatus(stock, threshold) {
    if (stock === 0) {
        return { label: 'Out of Stock', badge: null, color: '', textColor: 'text-red-500' };
    } else if (stock <= threshold) {
        return { label: `Only ${stock} left!`, badge: stock.toString(), color: 'bg-orange-500', textColor: 'text-orange-500' };
    } else if (stock <= threshold * 2) {
        return { label: 'Low Stock', badge: '•', color: 'bg-orange-400', textColor: 'text-orange-400' };
    } else {
        return { label: 'In Stock', badge: null, color: '', textColor: 'text-green-600' };
    }
}

function updateModalAddToCartButton() {
    const button = document.getElementById('modal-add-to-cart');
    if (!button || !currentProduct) return;
    
    const hasVariants = currentProduct.variants && currentProduct.variants.length > 0;
    const hasSelectedVariant = !hasVariants || currentProduct.selectedVariant;
    const hasSelectedSize = currentProduct.selectedSize;
    
    if (!hasSelectedVariant) {
        button.textContent = 'Select a Color';
        button.disabled = true;
        button.classList.add('opacity-50', 'cursor-not-allowed');
    } else if (!hasSelectedSize) {
        button.textContent = 'Select a Size';
        button.disabled = true;
        button.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        const variant = currentProduct.selectedVariant || { price: currentProduct.price, color: currentProduct.color };
        button.textContent = `Add to Cart - $${variant.price}`;
        button.disabled = false;
        button.classList.remove('opacity-50', 'cursor-not-allowed');
        
        // Update onclick handler
        button.onclick = () => {
            addToCart(
                currentProduct.id,
                `${currentProduct.name} (${variant.color})`,
                variant.price,
                variant.image || currentProduct.image,
                currentProduct.selectedSize
            );
            closeProductModal();
        };
    }
}

function addToRecentlyViewed(product) {
    if (!product) return;
    
    let recentlyViewed = JSON.parse(localStorage.getItem('woolflow-recently-viewed')) || [];
    
    // Remove if already exists (move to top)
    recentlyViewed = recentlyViewed.filter(p => p.id !== product.id);
    
    // Add to beginning with timestamp
    recentlyViewed.unshift({
        id: product.id,
        name: product.name,
        color: product.color,
        price: product.price,
        image: product.image,
        category: product.category,
        viewedAt: new Date().toISOString()
    });
    
    // Limit to 8 items
    recentlyViewed = recentlyViewed.slice(0, 8);
    
    localStorage.setItem('woolflow-recently-viewed', JSON.stringify(recentlyViewed));
    
    // Update recently viewed display if on products page
    renderRecentlyViewed();
    
    // Update recommendations
    renderRecommendations(product);
}

function renderRecentlyViewed() {
    const section = document.getElementById('recently-viewed-section');
    const grid = document.getElementById('recently-viewed-grid');
    
    if (!section || !grid) return;
    
    const recentlyViewed = JSON.parse(localStorage.getItem('woolflow-recently-viewed')) || [];
    
    if (recentlyViewed.length === 0) {
        section.classList.add('hidden');
        return;
    }
    
    section.classList.remove('hidden');
    
    grid.innerHTML = recentlyViewed.map(item => `
        <div class="recently-viewed-card group cursor-pointer" onclick="openProductModal('${item.id}')">
            <div class="relative overflow-hidden rounded-xl bg-mist-grey/30 aspect-square mb-2">
                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover transition-transform group-hover:scale-105">
                <div class="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-colors"></div>
            </div>
            <h4 class="text-sm font-medium text-charcoal truncate">${item.name}</h4>
            <p class="text-xs text-charcoal/60">$${item.price}</p>
        </div>
    `).join('');
}

function renderRecommendations(currentProduct) {
    const section = document.getElementById('recommendations-section');
    const grid = document.getElementById('recommendations-grid');
    
    if (!section || !grid || !products.length) return;
    
    // Calculate recommendation scores
    const scoredProducts = products
        .filter(p => p.id !== currentProduct.id) // Exclude current product
        .map(p => {
            let score = 0;
            
            // Same category = +3 points
            if (p.category === currentProduct.category) score += 3;
            
            // Similar price range (within 20%) = +2 points
            const priceDiff = Math.abs(p.price - currentProduct.price) / currentProduct.price;
            if (priceDiff <= 0.2) score += 2;
            else if (priceDiff <= 0.4) score += 1;
            
            // Same color family = +1 point
            if (p.color === currentProduct.color) score += 1;
            
            // High rating bonus = +1 point
            if (p.rating >= 4.7) score += 1;
            
            return { product: p, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3); // Top 3 recommendations
    
    if (scoredProducts.length === 0) {
        section.classList.add('hidden');
        return;
    }
    
    section.classList.remove('hidden');
    
    grid.innerHTML = scoredProducts.map(({ product, score }) => `
        <div class="recommendation-card group cursor-pointer" onclick="openProductModal('${product.id}')">
            <div class="relative overflow-hidden rounded-2xl bg-mist-grey/30 aspect-[4/5] mb-4">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover transition-transform group-hover:scale-105">
                <div class="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="w-full py-2 bg-warm-white/90 backdrop-blur text-charcoal text-sm font-medium rounded-full hover:bg-warm-white transition-colors">
                        Quick View
                    </button>
                </div>
            </div>
            <div class="flex items-start justify-between">
                <div>
                    <h4 class="font-medium text-charcoal group-hover:text-sage transition-colors">${product.name}</h4>
                    <p class="text-sm text-charcoal/60">${product.color}</p>
                </div>
                <span class="font-semibold text-charcoal">$${product.price}</span>
            </div>
            <div class="flex items-center mt-2 space-x-1">
                ${renderStarRating(product.rating || 4.5, 'sm')}
                <span class="text-xs text-charcoal/50">(${product.reviewCount || 0})</span>
            </div>
        </div>
    `).join('');
}

function renderModalReviews(product) {
    const modalReviews = document.getElementById('modal-reviews');
    if (!modalReviews) return;
    
    modalReviews.innerHTML = renderReviewsSection(product);
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    modal.classList.add('hidden', 'opacity-0', 'invisible');
    document.body.style.overflow = '';
    currentProduct = null;
}

function animateModalOpen(modal) {
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(modal, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.2 });
    }
}

// Reviews & Ratings System
function renderStarRating(rating, size = 'md') {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
    
    let starsHtml = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHtml += `<svg class="${sizeClass} text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    }
    
    // Half star
    if (hasHalfStar) {
        starsHtml += `<svg class="${sizeClass} text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><defs><linearGradient id="half-star"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="#e5e7eb"/></linearGradient></defs><path fill="url(#half-star)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += `<svg class="${sizeClass} text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    }
    
    return `<div class="flex items-center space-x-0.5">${starsHtml}</div>`;
}

function renderReviewsSection(product) {
    const rating = product.rating || 4.5;
    const reviewCount = product.reviewCount || 0;
    const reviews = product.reviews || [];
    
    return `
        <div class="mt-8 pt-6 border-t border-mist-grey/30">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h3 class="text-lg font-semibold text-charcoal">Customer Reviews</h3>
                    <div class="flex items-center space-x-2 mt-1">
                        ${renderStarRating(rating)}
                        <span class="text-charcoal/70 text-sm">${rating} out of 5</span>
                        <span class="text-charcoal/50 text-sm">(${reviewCount} reviews)</span>
                    </div>
                </div>
            </div>
            
            <div class="space-y-4 max-h-64 overflow-y-auto">
                ${reviews.map(review => `
                    <div class="bg-warm-white/50 rounded-xl p-4">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center space-x-2">
                                <span class="font-medium text-charcoal">${review.name}</span>
                                ${renderStarRating(review.rating, 'sm')}
                            </div>
                            <span class="text-sm text-charcoal/50">${formatDate(review.date)}</span>
                        </div>
                        <p class="text-charcoal/80 text-sm">${review.text}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Render star rating for product cards
function renderProductRating(product) {
    if (!product.rating) return '';
    return `
        <div class="flex items-center space-x-1 mt-2">
            ${renderStarRating(product.rating, 'sm')}
            <span class="text-xs text-charcoal/60">(${product.reviewCount || 0})</span>
        </div>
    `;
}

function selectSize(size) {
    // Remove previous selection
    document.querySelectorAll('.size-option').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selection to clicked button
    event.target.classList.add('selected');
    
    // Update modal add to cart button
    const addToCartBtn = document.getElementById('modal-add-to-cart');
    addToCartBtn.onclick = () => {
        if (currentProduct) {
            addToCart(currentProduct.id, `${currentProduct.name} - ${currentProduct.color}`, currentProduct.price, currentProduct.image, size);
            closeProductModal();
        }
    };
}

// Cart page functions
function renderCartItems() {
    const cartItemsList = document.getElementById('cart-items-list');
    if (!cartItemsList) return;
    
    if (cart.length === 0) {
        cartItemsList.innerHTML = `
            <div class="text-center text-charcoal/70 py-12">
                <svg class="w-16 h-16 mx-auto mb-4 text-mist-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0V19a2 2 0 002 2h7a2 2 0 002-2v-4"></path>
                </svg>
                <p class="text-lg mb-4">Your cart is empty</p>
                <button onclick="window.location.href='products.html'" class="px-6 py-3 bg-charcoal text-warm-white rounded-full hover:bg-charcoal/90 transition-all font-medium">
                    Start Shopping
                </button>
            </div>
        `;
        return;
    }
    
    cartItemsList.innerHTML = cart.map(item => `
        <div class="flex items-center space-x-4 p-4 border-b border-mist-grey/20">
            <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-xl">
            <div class="flex-1">
                <h4 class="font-semibold text-charcoal">${item.name}</h4>
                ${item.size ? `<p class="text-sm text-charcoal/70">Size: ${item.size}</p>` : ''}
                <p class="text-lg font-bold text-charcoal mt-1">$${item.price}</p>
                <button onclick="saveForLater('${item.id}', ${item.size || 'null'})" class="mt-1 text-xs text-sage hover:underline transition-colors">Save for later</button>
            </div>
            <div class="flex items-center space-x-3">
                <button onclick="updateCartQuantity('${item.id}', ${item.size || 'null'}, ${item.quantity - 1})" class="quantity-btn w-10 h-10 rounded-full border border-mist-grey flex items-center justify-center text-charcoal">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                    </svg>
                </button>
                <span class="w-8 text-center font-semibold">${item.quantity}</span>
                <button onclick="updateCartQuantity('${item.id}', ${item.size || 'null'}, ${item.quantity + 1})" class="quantity-btn w-10 h-10 rounded-full border border-mist-grey flex items-center justify-center text-charcoal">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                </button>
            </div>
            <button onclick="removeFromCart('${item.id}', ${item.size || 'null'})" class="p-2 text-charcoal/50 hover:text-red-500 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        </div>
    `).join('');
}

function updateOrderSummary() {
    const calc = typeof calculateCartTotals === 'function'
        ? calculateCartTotals()
        : (() => {
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const tax = subtotal * 0.08;
            return { subtotal, discount: 0, tax, total: subtotal + tax };
        })();

    const cartSubtotal = document.getElementById('cart-subtotal');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTax = document.getElementById('summary-tax');
    const summaryTotal = document.getElementById('summary-total');
    const discountRow = document.getElementById('cart-discount-row');
    const summaryDiscount = document.getElementById('summary-discount');

    if (cartSubtotal) cartSubtotal.textContent = `$${calc.subtotal.toFixed(2)}`;
    if (summarySubtotal) summarySubtotal.textContent = `$${calc.subtotal.toFixed(2)}`;
    if (summaryTax) summaryTax.textContent = `$${calc.tax.toFixed(2)}`;
    if (summaryTotal) summaryTotal.textContent = `$${calc.total.toFixed(2)}`;

    if (discountRow && summaryDiscount) {
        if (calc.discount > 0) {
            discountRow.classList.remove('hidden');
            summaryDiscount.textContent = `-$${calc.discount.toFixed(2)}`;
        } else {
            discountRow.classList.add('hidden');
        }
    }
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutTotal = document.getElementById('checkout-total');
    
    const calc = typeof calculateCartTotals === 'function' ? calculateCartTotals() : null;
    if (checkoutTotal && calc) {
        checkoutTotal.textContent = `$${calc.total.toFixed(2)}`;
    }
    
    checkoutModal.classList.remove('opacity-0', 'invisible');
}

function closeCheckoutModal() {
    const checkoutModal = document.getElementById('checkout-modal');
    checkoutModal.classList.add('opacity-0', 'invisible');
}

function closeSuccessModal() {
    const successModal = document.getElementById('success-modal');
    successModal.classList.add('opacity-0', 'invisible');
    
    // Clear cart and redirect
    cart = [];
    localStorage.setItem('woolflow-cart', JSON.stringify(cart));
    window.location.href = 'products.html';
}

window.calculateCheckoutTotals = function () {
    const calc = typeof calculateCartTotals === 'function' ? calculateCartTotals() : { subtotal: 0, discount: 0, tax: 0, total: 0 };
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    const discountRow = document.getElementById('discount-row');
    const discountEl = document.getElementById('discount');
    if (subtotalEl) subtotalEl.textContent = `$${calc.subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${calc.tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${calc.total.toFixed(2)}`;
    if (discountRow && discountEl) {
        if (calc.discount > 0) {
            discountRow.classList.remove('hidden');
            discountEl.textContent = `-$${calc.discount.toFixed(2)}`;
        } else {
            discountRow.classList.add('hidden');
        }
    }
};

// Checkout form handling
document.addEventListener('submit', function(e) {
    if (e.target.id === 'checkout-form') {
        e.preventDefault();
        
        setTimeout(() => {
            if (typeof completeOrder === 'function') completeOrder({ paymentMethod: 'card' });
            closeCheckoutModal();
            const successModal = document.getElementById('success-modal');
            if (successModal) successModal.classList.remove('opacity-0', 'invisible');
            updateCartDisplay();
            renderCartItems();
            updateOrderSummary();
        }, 1200);
    }
});

// Utility functions
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-24 right-6 z-50 px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${
        type === 'success' ? 'bg-sage text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-charcoal text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Load more functionality
document.addEventListener('click', function(e) {
    if (e.target.id === 'load-more') {
        showNotification('All products loaded!', 'info');
        e.target.style.display = 'none';
    }
});

// Handle filter label clicks
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('filter-label')) {
        const checkbox = e.target.previousElementSibling;
        checkbox.checked = !checkbox.checked;
        
        if (checkbox.checked) {
            e.target.classList.add('bg-charcoal', 'text-warm-white');
        } else {
            e.target.classList.remove('bg-charcoal', 'text-warm-white');
        }
        
        applyFilters();
    }
});

// Security Utility Functions
function generateNonce() {
    try {
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            const array = new Uint8Array(16);
            crypto.getRandomValues(array);
            return btoa(String.fromCharCode.apply(null, array));
        }
        // Fallback for older browsers
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    } catch (e) {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
}

function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function encryptData(data) {
    try {
        const encrypted = btoa(JSON.stringify(data) + SECURITY_CONFIG.encryptionKey);
        return encrypted;
    } catch (error) {
        console.error('Encryption failed:', error);
        return null;
    }
}

function decryptData(encryptedData) {
    try {
        const decrypted = atob(encryptedData);
        const data = decrypted.replace(SECURITY_CONFIG.encryptionKey, '');
        return JSON.parse(data);
    } catch (error) {
        console.error('Decryption failed:', error);
        return null;
    }
}

function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<[^>]+>/g, '')
                .replace(/["'<>]/g, '');
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// Security Monitoring
class SecurityMonitor {
    constructor() {
        this.requestCounts = new Map();
        this.blockedIPs = new Set();
        this.suspiciousActivities = [];
        this.init();
    }
    
    init() {
        this.monitorXSSAttempts();
        this.monitorRateLimiting();
        this.monitorDataExfiltration();
    }
    
    monitorXSSAttempts() {
        const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
        Object.defineProperty(Element.prototype, 'innerHTML', {
            set: function(value) {
                if (value.includes('<script') || value.includes('javascript:')) {
                    securityMonitor.logSuspiciousActivity('XSS attempt detected', value);
                }
                return originalInnerHTML.set.call(this, value);
            }
        });
    }
    
    monitorRateLimiting() {
        const ip = this.getClientIP();
        const now = Date.now();
        
        if (!this.requestCounts.has(ip)) {
            this.requestCounts.set(ip, { count: 1, windowStart: now });
        } else {
            const data = this.requestCounts.get(ip);
            if (now - data.windowStart > SECURITY_CONFIG.rateLimitWindow) {
                data.count = 1;
                data.windowStart = now;
            } else {
                data.count++;
            }
            
            if (data.count > SECURITY_CONFIG.maxRequests) {
                this.blockIP(ip);
                this.logSuspiciousActivity('Rate limit exceeded', { ip, count: data.count });
            }
        }
    }
    
    monitorDataExfiltration() {
        const sensitiveData = ['password', 'credit_card', 'ssn', 'personal_info'];
        sensitiveData.forEach(dataType => {
            Object.defineProperty(window, dataType, {
                set: function(value) {
                    securityMonitor.logSuspiciousActivity('Sensitive data exposure', dataType);
                }
            });
        });
    }
    
    getClientIP() {
        // In production, this would come from the server
        return 'client-ip-placeholder';
    }
    
    blockIP(ip) {
        this.blockedIPs.add(ip);
        console.warn(`IP blocked: ${ip}`);
    }
    
    logSuspiciousActivity(type, details) {
        const activity = {
            timestamp: Date.now(),
            type,
            details,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        this.suspiciousActivities.push(activity);
        console.warn('Security alert:', activity);
        
        // Send to security monitoring service
        this.sendSecurityAlert(activity);
    }
    
    sendSecurityAlert(activity) {
        // In production, send to security monitoring endpoint
        fetch('/api/security-alert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Security-Token': SECURITY_CONFIG.cspNonce
            },
            body: JSON.stringify(activity)
        }).catch(err => console.error('Security alert failed:', err));
    }
}

// Analytics System
class AnalyticsSystem {
    constructor() {
        this.sessionData = {
            sessionId: ANALYTICS_CONFIG.sessionId,
            startTime: Date.now(),
            pageViews: 0,
            events: [],
            userPath: []
        };
        this.init();
    }
    
    init() {
        this.trackPageView();
        this.trackUserInteractions();
        this.trackPerformanceMetrics();
        this.startBatchSender();
    }
    
    trackPageView() {
        const pageData = {
            type: 'page_view',
            url: window.location.href,
            referrer: document.referrer,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`
        };
        
        this.sessionData.pageViews++;
        this.sessionData.userPath.push(pageData);
        this.eventsQueue.push(pageData);
    }
    
    trackUserInteractions() {
        // Track clicks
        document.addEventListener('click', (e) => {
            const clickData = {
                type: 'click',
                element: e.target.tagName,
                className: e.target.className,
                timestamp: Date.now(),
                coordinates: { x: e.clientX, y: e.clientY }
            };
            this.eventsQueue.push(clickData);
        });
        
        // Track form interactions
        document.addEventListener('submit', (e) => {
            const formData = {
                type: 'form_submit',
                formId: e.target.id,
                timestamp: Date.now()
            };
            this.eventsQueue.push(formData);
        });
        
        // Track cart events
        document.addEventListener('cart_updated', (e) => {
            this.eventsQueue.push({
                type: 'cart_event',
                action: e.detail.action,
                productId: e.detail.productId,
                quantity: e.detail.quantity,
                timestamp: Date.now()
            });
        });
    }
    
    trackPerformanceMetrics() {
        if (window.performance && window.performance.timing) {
            const perfData = {
                type: 'performance',
                pageLoadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
                domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
                firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime,
                timestamp: Date.now()
            };
            
            this.eventsQueue.push(perfData);
        }
    }
    
    startBatchSender() {
        setInterval(() => {
            if (this.eventsQueue.length > 0) {
                this.sendBatch();
            }
        }, 5000); // Send every 5 seconds
    }
    
    sendBatch() {
        const batch = {
            sessionId: this.sessionData.sessionId,
            events: [...this.eventsQueue],
            timestamp: Date.now()
        };
        
        fetch(`${ANALYTICS_CONFIG.apiEndpoint}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Analytics-Session': this.sessionData.sessionId
            },
            body: JSON.stringify(batch)
        }).catch(err => console.error('Analytics send failed:', err));
        
        this.eventsQueue = [];
    }
}

// Performance Monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            pageLoad: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            cumulativeLayoutShift: 0,
            firstInputDelay: 0
        };
        this.init();
    }
    
    init() {
        this.observeLCP();
        this.observeCLS();
        this.observeFID();
        this.startMetricsCollection();
    }
    
    observeLCP() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.largestContentfulPaint = lastEntry.startTime;
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }
    
    observeCLS() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        this.metrics.cumulativeLayoutShift += entry.value;
                    }
                });
            });
            
            observer.observe({ entryTypes: ['layout-shift'] });
        }
    }
    
    observeFID() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
                });
            });
            
            observer.observe({ entryTypes: ['first-input'] });
        }
    }
    
    startMetricsCollection() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.collectMetrics();
            }, 0);
        });
    }
    
    collectMetrics() {
        this.metrics.pageLoad = performance.now();
        
        // Check against thresholds
        if (this.metrics.pageLoad > PERFORMANCE_CONFIG.criticalThresholds.pageLoad) {
            this.reportPerformanceIssue('Slow page load', this.metrics.pageLoad);
        }
        
        if (this.metrics.cumulativeLayoutShift > PERFORMANCE_CONFIG.criticalThresholds.cls) {
            this.reportPerformanceIssue('High layout shift', this.metrics.cumulativeLayoutShift);
        }
        
        // Send metrics to monitoring service
        this.sendMetrics();
    }
    
    reportPerformanceIssue(type, value) {
        const issue = {
            type: 'performance_issue',
            issueType: type,
            value,
            url: window.location.href,
            timestamp: Date.now()
        };
        
        // Send to monitoring service
        fetch('/api/performance-alert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(issue)
        }).catch(err => console.error('Performance alert failed:', err));
    }
    
    sendMetrics() {
        fetch('/api/performance-metrics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.metrics)
        }).catch(err => console.error('Metrics send failed:', err));
    }
}

// Enhanced Cart Management with Security
class SecureCartManager {
    constructor() {
        this.encryptionEnabled = true;
        this.maxCartItems = 50;
        this.maxQuantity = 10;
    }
    
    saveCart(cart) {
        if (cart.length > this.maxCartItems) {
            throw new Error('Cart size exceeds maximum allowed items');
        }
        
        cart.forEach(item => {
            if (item.quantity > this.maxQuantity) {
                throw new Error(`Quantity exceeds maximum for item: ${item.id}`);
            }
        });
        
        const cartData = this.encryptionEnabled ? encryptData(cart) : JSON.stringify(cart);
        localStorage.setItem('woolflow-cart-secure', cartData);
        
        // Dispatch secure cart update event
        document.dispatchEvent(new CustomEvent('cart_updated_secure', {
            detail: { cart, timestamp: Date.now() }
        }));
    }
    
    loadCart() {
        try {
            const encryptedData = localStorage.getItem('woolflow-cart-secure');
            if (!encryptedData) return [];
            
            const cart = this.encryptionEnabled ? 
                decryptData(encryptedData) : 
                JSON.parse(encryptedData);
            
            return Array.isArray(cart) ? cart : [];
        } catch (error) {
            console.error('Failed to load cart:', error);
            return [];
        }
    }
    
    validateCartItem(item) {
        const requiredFields = ['id', 'name', 'price', 'quantity'];
        return requiredFields.every(field => item.hasOwnProperty(field)) &&
               typeof item.price === 'number' &&
               typeof item.quantity === 'number' &&
               item.quantity > 0 &&
               item.quantity <= this.maxQuantity;
    }
}

// Advanced Analytics Tracking
class EcommerceAnalytics {
    constructor() {
        this.conversionFunnel = {
            productViews: new Set(),
            cartAdds: new Set(),
            checkouts: new Set(),
            purchases: new Set()
        };
        this.userProperties = {
            sessionStart: Date.now(),
            totalSpent: 0,
            productViews: 0,
            cartValue: 0
        };
        this.init();
    }
    
    init() {
        this.trackEcommerceEvents();
        this.setupConversionTracking();
        this.trackUserEngagement();
    }
    
    trackEcommerceEvents() {
        // Product view tracking
        document.addEventListener('click', (e) => {
            if (e.target.closest('.product-card')) {
                const productCard = e.target.closest('.product-card');
                const productData = this.extractProductData(productCard);
                this.trackProductView(productData);
            }
        });
        
        // Add to cart tracking
        document.addEventListener('cart_updated', (e) => {
            this.trackAddToCart({
                productId: e.detail.productId,
                quantity: e.detail.quantity,
                price: e.detail.price,
                cartValue: this.calculateCartValue()
            });
        });
        
        // Purchase tracking
        document.addEventListener('purchase_completed', (e) => {
            this.trackPurchase({
                orderId: e.detail.orderId,
                revenue: e.detail.revenue,
                products: e.detail.products,
                currency: 'USD'
            });
        });
    }
    
    extractProductData(productCard) {
        return {
            id: productCard.dataset.productId,
            name: productCard.querySelector('h4').textContent,
            price: parseFloat(productCard.querySelector('.text-2xl').textContent.replace('$', '')),
            category: productCard.dataset.category
        };
    }
    
    trackProductView(productData) {
        this.conversionFunnel.productViews.add(productData.id);
        this.userProperties.productViews++;
        
        // Google Analytics 4
        gtag('event', 'view_item', {
            currency: 'USD',
            value: productData.price,
            items: [{
                item_id: productData.id,
                item_name: productData.name,
                item_category: productData.category,
                price: productData.price
            }]
        });
        
        // Facebook Pixel
        fbq('track', 'ViewContent', {
            content_ids: [productData.id],
            content_type: 'product',
            value: productData.price,
            currency: 'USD'
        });
    }
    
    trackAddToCart(data) {
        this.conversionFunnel.cartAdds.add(data.productId);
        this.userProperties.cartValue = data.cartValue;
        
        gtag('event', 'add_to_cart', {
            currency: 'USD',
            value: data.price * data.quantity,
            items: [{
                item_id: data.productId,
                quantity: data.quantity,
                price: data.price
            }]
        });
        
        fbq('track', 'AddToCart', {
            content_ids: [data.productId],
            content_type: 'product',
            value: data.price * data.quantity,
            currency: 'USD'
        });
    }
    
    trackPurchase(data) {
        this.conversionFunnel.purchases.add(data.orderId);
        this.userProperties.totalSpent += data.revenue;
        
        gtag('event', 'purchase', {
            transaction_id: data.orderId,
            value: data.revenue,
            currency: data.currency,
            items: data.products.map(product => ({
                item_id: product.id,
                item_name: product.name,
                price: product.price,
                quantity: product.quantity
            }))
        });
        
        fbq('track', 'Purchase', {
            content_ids: data.products.map(p => p.id),
            value: data.revenue,
            currency: data.currency
        });
    }
    
    setupConversionTracking() {
        // Track checkout steps
        document.addEventListener('checkout_step', (e) => {
            gtag('event', 'checkout_progress', {
                checkout_step: e.detail.step,
                value: e.detail.cartValue
            });
        });
        
        // Track search
        const searchForm = document.querySelector('#search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                const searchTerm = e.target.querySelector('input[name="search"]').value;
                gtag('event', 'search', {
                    search_term: searchTerm
                });
            });
        }
    }
    
    trackUserEngagement() {
        let timeOnPage = 0;
        let scrollDepth = 0;
        
        // Time on page
        setInterval(() => {
            timeOnPage += 5;
            if (timeOnPage % 30 === 0) { // Track every 30 seconds
                gtag('event', 'time_on_page', {
                    value: timeOnPage
                });
            }
        }, 5000);
        
        // Scroll depth
        document.addEventListener('scroll', () => {
            const newScrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (newScrollDepth > scrollDepth && newScrollDepth % 25 === 0) {
                scrollDepth = newScrollDepth;
                gtag('event', 'scroll', {
                    percent_scrolled: scrollDepth
                });
            }
        });
    }
    
    calculateCartValue() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    getConversionRate() {
        const productViews = this.conversionFunnel.productViews.size;
        const purchases = this.conversionFunnel.purchases.size;
        return productViews > 0 ? (purchases / productViews) * 100 : 0;
    }
}

// Heatmap Tracking
class HeatmapTracker {
    constructor() {
        this.clicks = [];
        this.scrolls = [];
        this.mouseMoves = [];
        this.init();
    }
    
    init() {
        this.trackClicks();
        this.trackScrolls();
        this.trackMouseMovement();
        this.sendData();
    }
    
    trackClicks() {
        document.addEventListener('click', (e) => {
            this.clicks.push({
                x: e.clientX,
                y: e.clientY,
                element: e.target.tagName,
                timestamp: Date.now(),
                viewport: { width: window.innerWidth, height: window.innerHeight }
            });
        });
    }
    
    trackScrolls() {
        let lastScrollTime = Date.now();
        document.addEventListener('scroll', () => {
            const now = Date.now();
            if (now - lastScrollTime > 100) { // Throttle scroll events
                this.scrolls.push({
                    scrollY: window.scrollY,
                    scrollPercent: Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100),
                    timestamp: now
                });
                lastScrollTime = now;
            }
        });
    }
    
    trackMouseMovement() {
        let lastMoveTime = Date.now();
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastMoveTime > 500) { // Sample every 500ms
                this.mouseMoves.push({
                    x: e.clientX,
                    y: e.clientY,
                    timestamp: now
                });
                lastMoveTime = now;
            }
        });
    }
    
    sendData() {
        // Send data every 30 seconds
        setInterval(() => {
            if (this.clicks.length > 0 || this.scrolls.length > 0) {
                const data = {
                    sessionId: ANALYTICS_CONFIG.sessionId,
                    pageUrl: window.location.href,
                    clicks: this.clicks,
                    scrolls: this.scrolls,
                    mouseMoves: this.mouseMoves.slice(0, 100) // Limit to prevent payload size
                };
                
                fetch('/api/heatmap-data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }).catch(err => console.error('Heatmap data send failed:', err));
                
                // Clear sent data
                this.clicks = [];
                this.scrolls = [];
                this.mouseMoves = [];
            }
        }, 30000);
    }
}

// Real-time Inventory Management System
class InventoryManager {
    constructor() {
        this.stockLevels = new Map();
        this.reservations = new Map();
        this.websocket = null;
        this.reorderPoints = new Map();
        this.init();
    }
    
    init() {
        this.initializeStockLevels();
        this.connectWebSocket();
        this.startStockMonitoring();
    }
    
    initializeStockLevels() {
        // Initialize with realistic stock levels
        products.forEach(product => {
            // Generate random stock levels for demo
            const baseStock = Math.floor(Math.random() * 50) + 10;
            this.stockLevels.set(product.id, baseStock);
            this.reorderPoints.set(product.id, Math.floor(baseStock * 0.2)); // 20% reorder point
        });
    }
    
    connectWebSocket() {
        // Simulate WebSocket connection for real-time updates
        // In production, this would connect to actual inventory service
        this.websocket = {
            send: (data) => {
                console.log('Inventory WebSocket send:', data);
            },
            close: () => {
                console.log('Inventory WebSocket closed');
            }
        };
        
        // Simulate real-time stock updates
        setInterval(() => {
            this.simulateStockFluctuation();
        }, 30000); // Update every 30 seconds
    }
    
    simulateStockFluctuation() {
        products.forEach(product => {
            const currentStock = this.stockLevels.get(product.id);
            const fluctuation = Math.floor(Math.random() * 5) - 2; // -2 to +2
            const newStock = Math.max(0, currentStock + fluctuation);
            
            if (newStock !== currentStock) {
                this.stockLevels.set(product.id, newStock);
                this.updateStockDisplay(product.id, newStock);
                this.checkReorderPoint(product.id, newStock);
            }
        });
    }
    
    updateStockDisplay(productId, stockLevel) {
        const stockElements = document.querySelectorAll(`[data-product-id="${productId}"] .stock-indicator`);
        stockElements.forEach(element => {
            element.textContent = `${stockLevel} in stock`;
            element.className = `stock-indicator ${stockLevel === 0 ? 'out-of-stock' : stockLevel <= 5 ? 'low-stock' : 'in-stock'}`;
        });
    }
    
    checkReorderPoint(productId, stockLevel) {
        const reorderPoint = this.reorderPoints.get(productId);
        if (stockLevel <= reorderPoint && stockLevel > 0) {
            this.triggerReorderAlert(productId, stockLevel);
        } else if (stockLevel === 0) {
            this.markOutOfStock(productId);
        }
    }
    
    triggerReorderAlert(productId, stockLevel) {
        const product = products.find(p => p.id === productId);
        console.warn(`Low stock alert: ${product.name} - ${stockLevel} remaining`);
        
        // Send to admin dashboard
        this.sendInventoryAlert({
            type: 'low_stock',
            productId,
            stockLevel,
            reorderPoint: this.reorderPoints.get(productId),
            timestamp: Date.now()
        });
    }
    
    markOutOfStock(productId) {
        const product = products.find(p => p.id === productId);
        console.error(`Out of stock: ${product.name}`);
        
        // Update UI to show out of stock
        const productElements = document.querySelectorAll(`[data-product-id="${productId}"]`);
        productElements.forEach(element => {
            const addToCartBtn = element.querySelector('.add-to-cart-btn');
            if (addToCartBtn) {
                addToCartBtn.disabled = true;
                addToCartBtn.textContent = 'Out of Stock';
                addToCartBtn.classList.add('out-of-stock-btn');
            }
        });
        
        // Send out of stock alert
        this.sendInventoryAlert({
            type: 'out_of_stock',
            productId,
            timestamp: Date.now()
        });
    }
    
    getStockLevel(productId) {
        return this.stockLevels.get(productId) || 0;
    }
    
    isInStock(productId) {
        return this.getStockLevel(productId) > 0;
    }
    
    async reserveStock(productId, quantity, reservationId) {
        const currentStock = this.getStockLevel(productId);
        
        if (currentStock < quantity) {
            return { success: false, error: 'Insufficient stock' };
        }
        
        // Create reservation
        const reservation = {
            id: reservationId,
            productId,
            quantity,
            createdAt: Date.now(),
            expiresAt: Date.now() + (15 * 60 * 1000) // 15 minutes
        };
        
        this.reservations.set(reservationId, reservation);
        
        // Update stock level
        this.stockLevels.set(productId, currentStock - quantity);
        this.updateStockDisplay(productId, currentStock - quantity);
        
        // Send reservation to server
        this.websocket.send(JSON.stringify({
            type: 'stock_reservation',
            reservation
        }));
        
        // Set expiration timer
        setTimeout(() => {
            this.releaseStockReservation(reservationId);
        }, 15 * 60 * 1000);
        
        return { success: true, reservation };
    }
    
    async releaseStockReservation(reservationId) {
        const reservation = this.reservations.get(reservationId);
        if (!reservation) {
            return { success: false, error: 'Reservation not found' };
        }
        
        // Restore stock level
        const currentStock = this.getStockLevel(reservation.productId);
        this.stockLevels.set(reservation.productId, currentStock + reservation.quantity);
        this.updateStockDisplay(reservation.productId, currentStock + reservation.quantity);
        
        // Remove reservation
        this.reservations.delete(reservationId);
        
        // Send release to server
        this.websocket.send(JSON.stringify({
            type: 'stock_reservation_released',
            reservationId
        }));
        
        return { success: true };
    }
    
    startStockMonitoring() {
        // Monitor stock levels every 5 minutes
        setInterval(() => {
            this.generateStockReport();
        }, 5 * 60 * 1000);
    }
    
    generateStockReport() {
        const report = {
            timestamp: Date.now(),
            totalProducts: products.length,
            outOfStock: [],
            lowStock: [],
            totalValue: 0
        };
        
        products.forEach(product => {
            const stockLevel = this.getStockLevel(product.id);
            const reorderPoint = this.reorderPoints.get(product.id);
            
            if (stockLevel === 0) {
                report.outOfStock.push({
                    productId: product.id,
                    name: product.name,
                    price: product.price
                });
            } else if (stockLevel <= reorderPoint) {
                report.lowStock.push({
                    productId: product.id,
                    name: product.name,
                    stockLevel,
                    reorderPoint
                });
            }
            
            report.totalValue += stockLevel * product.price;
        });
        
        console.log('Stock Report:', report);
        return report;
    }
    
    sendInventoryAlert(alert) {
        // Send to inventory management system
        fetch('/api/inventory/alerts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(alert)
        }).catch(err => console.error('Inventory alert failed:', err));
    }
}

// Advanced Search with Fuzzy Matching
class AdvancedSearch {
    constructor() {
        this.searchIndex = [];
        this.fuse = null;
        this.init();
    }
    
    init() {
        this.buildSearchIndex();
        this.initializeFuse();
        this.setupAutocomplete();
    }
    
    buildSearchIndex() {
        products.forEach(product => {
            this.searchIndex.push({
                id: product.id,
                name: product.name,
                category: product.category,
                color: product.color,
                description: product.description,
                price: product.price
            });
        });
    }
    
    initializeFuse() {
        const options = {
            includeScore: true,
            threshold: 0.4,
            keys: [
                { name: 'name', weight: 0.7 },
                { name: 'category', weight: 0.2 },
                { name: 'color', weight: 0.1 }
            ]
        };
        
        this.fuse = new Fuse(this.searchIndex, options);
    }
    
    setupAutocomplete() {
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;
        
        let autocompleteTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(autocompleteTimeout);
            autocompleteTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });
    }
    
    performSearch(query) {
        if (!query || query.length < 2) {
            this.clearSearchResults();
            return;
        }
        
        const results = this.fuse.search(query);
        this.displaySearchResults(results);
        
        // Track search event
        gtag('event', 'search', {
            search_term: query,
            results_count: results.length
        });
    }
    
    displaySearchResults(results) {
        const resultsContainer = document.getElementById('search-results');
        if (!resultsContainer) return;
        
        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="no-results">No products found</div>';
            return;
        }
        
        const resultsHTML = results.slice(0, 5).map(result => {
            const product = products.find(p => p.id === result.item.id);
            return `
                <div class="search-result-item" onclick="openProductModal('${product.id}')">
                    <img src="${product.image}" alt="${product.name}" class="search-result-image">
                    <div class="search-result-info">
                        <h4>${product.name}</h4>
                        <p class="search-result-price">$${product.price}</p>
                        <p class="search-result-score">Match: ${Math.round((1 - result.score) * 100)}%</p>
                    </div>
                </div>
            `;
        }).join('');
        
        resultsContainer.innerHTML = resultsHTML;
        resultsContainer.style.display = 'block';
    }
    
    clearSearchResults() {
        const resultsContainer = document.getElementById('search-results');
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }
    }
}

// Initialize enhanced systems
function initializeProductionSystems() {
    // Initialize security monitoring
    securityMonitor = new SecurityMonitor();
    
    // Initialize analytics
    analytics = new AnalyticsSystem();
    ecommerceAnalytics = new EcommerceAnalytics();
    heatmapTracker = new HeatmapTracker();
    
    // Initialize performance monitoring
    if (PERFORMANCE_CONFIG.monitoringEnabled) {
        performanceMonitor = new PerformanceMonitor();
    }
    
    // Initialize secure cart manager
    secureCartManager = new SecureCartManager();
    
    // Initialize inventory management
    inventoryManager = new InventoryManager();
    
    // Initialize advanced search
    advancedSearch = new AdvancedSearch();
    
    // Replace standard cart with secure cart
    cart = secureCartManager.loadCart();
    
    // Register service worker for advanced caching
    registerServiceWorker();
}

// Service Worker Registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                    
                    // Track service worker registration
                    gtag('event', 'service_worker_registered', {
                        scope: registration.scope
                    });
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New version available
                                showNotification('New version available! Refresh to update.', 'info');
                            }
                        });
                    });
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                    gtag('event', 'service_worker_registration_failed');
                });
        });
    }
}


// A/B Testing Framework
class ABTestingFramework {
    constructor() {
        this.experiments = new Map();
        this.userAssignments = new Map();
        this.init();
    }
    
    init() {
        this.loadExperiments();
        this.assignUserToExperiments();
    }
    
    loadExperiments() {
        // Define A/B tests
        this.experiments.set('homepage_hero', {
            variants: ['control', 'variant_a', 'variant_b'],
            trafficAllocation: [0.4, 0.3, 0.3],
            goal: 'click_through_rate'
        });
        
        this.experiments.set('product_card_design', {
            variants: ['control', 'hover_effects', '3d_tilt'],
            trafficAllocation: [0.5, 0.25, 0.25],
            goal: 'add_to_cart_rate'
        });
        
        this.experiments.set('checkout_flow', {
            variants: ['single_page', 'multi_step'],
            trafficAllocation: [0.5, 0.5],
            goal: 'conversion_rate'
        });
    }
    
    assignUserToExperiments() {
        const userId = this.getUserId();
        
        this.experiments.forEach((experiment, experimentId) => {
            const assignment = this.getAssignment(userId, experimentId, experiment);
            this.userAssignments.set(experimentId, assignment);
        });
    }
    
    getUserId() {
        let userId = localStorage.getItem('woolflow_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('woolflow_user_id', userId);
        }
        return userId;
    }
    
    getAssignment(userId, experimentId, experiment) {
        // Deterministic assignment based on user ID
        const hash = this.hashCode(userId + experimentId);
        const randomValue = (hash % 100) / 100;
        
        let cumulative = 0;
        for (let i = 0; i < experiment.trafficAllocation.length; i++) {
            cumulative += experiment.trafficAllocation[i];
            if (randomValue <= cumulative) {
                return experiment.variants[i];
            }
        }
        
        return experiment.variants[0]; // Fallback to control
    }
    
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }
    
    getVariant(experimentId) {
        return this.userAssignments.get(experimentId) || 'control';
    }
    
    trackEvent(experimentId, eventType, value = null) {
        const variant = this.getVariant(experimentId);
        
        // Send to analytics
        gtag('event', 'experiment_event', {
            experiment_id: experimentId,
            variant: variant,
            event_type: eventType,
            value: value
        });
        
        // Send to A/B testing service
        fetch('/api/abtesting/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                experimentId,
                variant,
                eventType,
                value,
                timestamp: Date.now(),
                userId: this.getUserId()
            })
        }).catch(err => console.error('A/B tracking failed:', err));
    }
}

// Customer Support Chat Integration
class CustomerSupportChat {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.botResponses = [
            "Hello! I'm here to help you find the perfect wool sneakers. What can I assist you with today?",
            "Our wool sneakers are made from premium merino wool with temperature regulation and moisture-wicking properties.",
            "We offer free shipping on all orders over $100 and a 30-day return policy.",
            "You can find our size guide on each product page. If you're between sizes, we recommend sizing up.",
            "Our customer service team is available Monday-Friday 9AM-6PM EST. You can also reach us at support@woolflow.com"
        ];
        this.init();
    }
    
    init() {
        this.createChatWidget();
        this.setupEventListeners();
    }
    
    createChatWidget() {
        const chatHTML = `
            <div id="chat-widget" class="chat-widget">
                <div class="chat-header" onclick="toggleChat()">
                    <div class="chat-avatar">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"></path>
                        </svg>
                    </div>
                    <div class="chat-title">
                        <span class="chat-status online">Online</span>
                        <span class="chat-agent">WoolFlow Assistant</span>
                    </div>
                    <div class="chat-toggle">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </div>
                <div class="chat-body" style="display: none;">
                    <div class="chat-messages" id="chat-messages">
                        <div class="message bot-message">
                            <div class="message-content">
                                Hello! I'm here to help you find the perfect wool sneakers. What can I assist you with today?
                            </div>
                            <div class="message-time">${new Date().toLocaleTimeString()}</div>
                        </div>
                    </div>
                    <div class="chat-input-container">
                        <input type="text" id="chat-input" class="chat-input" placeholder="Type your message..." maxlength="500">
                        <button onclick="sendMessage()" class="chat-send-btn">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatHTML);
        this.addChatStyles();
    }
    
    addChatStyles() {
        const styles = `
            .chat-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 350px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                z-index: 1000;
                font-family: 'Inter', sans-serif;
                overflow: hidden;
            }
            
            .chat-header {
                background: #4A4A4A;
                color: white;
                padding: 16px;
                border-radius: 12px 12px 0 0;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 12px;
                height: 72px;
                box-sizing: border-box;
            }
            
            .chat-avatar {
                width: 40px;
                height: 40px;
                background: #A8B0A0;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .chat-title {
                flex: 1;
            }
            
            .chat-status {
                font-size: 12px;
                opacity: 0.8;
            }
            
            .chat-status.online {
                color: #10B981;
            }
            
            .chat-agent {
                font-weight: 600;
                font-size: 14px;
            }
            
            .chat-body {
                height: 428px;
                display: flex;
                flex-direction: column;
            }
            
            .chat-messages {
                flex: 1;
                padding: 16px;
                overflow-y: auto;
                background: #F8F6F0;
            }
            
            .message {
                margin-bottom: 16px;
                animation: fadeIn 0.3s ease-in;
            }
            
            .bot-message {
                text-align: left;
            }
            
            .user-message {
                text-align: right;
            }
            
            .message-content {
                display: inline-block;
                padding: 12px 16px;
                border-radius: 18px;
                max-width: 80%;
                word-wrap: break-word;
            }
            
            .bot-message .message-content {
                background: white;
                color: #4A4A4A;
                border: 1px solid #E8E0D0;
            }
            
            .user-message .message-content {
                background: #4A4A4A;
                color: white;
            }
            
            .message-time {
                font-size: 11px;
                color: #C8C0B8;
                margin-top: 4px;
            }
            
            .chat-input-container {
                padding: 16px;
                background: white;
                border-top: 1px solid #E8E0D0;
                display: flex;
                gap: 12px;
                height: 72px;
                box-sizing: border-box;
            }
            
            .chat-input {
                flex: 1;
                padding: 12px 16px;
                border: 1px solid #E8E0D0;
                border-radius: 24px;
                outline: none;
                font-size: 14px;
            }
            
            .chat-input:focus {
                border-color: #A8B0A0;
            }
            
            .chat-send-btn {
                width: 40px;
                height: 40px;
                background: #4A4A4A;
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            
            .chat-send-btn:hover {
                background: #A8B0A0;
                transform: scale(1.05);
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .product-card:hover {
                transform: translateY(-12px);
                box-shadow: var(--shadow-2xl), 0 20px 40px rgba(61, 61, 61, 0.15);
            }

            @media (max-width: 768px) {
                .chat-widget {
                    width: calc(100% - 40px);
                    right: 20px;
                    bottom: 20px;
                }
                .chat-body {
                    height: 350px;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    setupEventListeners() {
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
    }
    
    toggleChat() {
        const chatBody = document.querySelector('.chat-body');
        const chatToggle = document.querySelector('.chat-toggle svg');
        
        if (chatBody.style.display === 'none') {
            chatBody.style.display = 'flex';
            chatToggle.style.transform = 'rotate(180deg)';
            this.isOpen = true;
            
            // Track chat open event
            gtag('event', 'chat_opened');
        } else {
            chatBody.style.display = 'none';
            chatToggle.style.transform = 'rotate(0deg)';
            this.isOpen = false;
        }
    }
    
    sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addMessage(message, 'user');
        chatInput.value = '';
        
        // Generate bot response
        setTimeout(() => {
            const botResponse = this.generateBotResponse(message);
            this.addMessage(botResponse, 'bot');
        }, 1000);
        
        // Track message event
        gtag('event', 'chat_message_sent', {
            message_length: message.length
        });
    }
    
    addMessage(message, sender) {
        const chatMessages = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        
        messageElement.innerHTML = `
            <div class="message-content">${this.escapeHtml(message)}</div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        `;
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    generateBotResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('size') || lowerMessage.includes('fit')) {
            return "You can find our size guide on each product page. If you're between sizes, we recommend sizing up for the best fit.";
        } else if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
            return "We offer free shipping on all orders over $100. Standard delivery takes 3-5 business days, and express shipping is available for $15.";
        } else if (lowerMessage.includes('return') || lowerMessage.includes('exchange')) {
            return "We have a 30-day return policy. Items must be unworn and in original packaging. Returns are free for store credit, or $5 for refunds.";
        } else if (lowerMessage.includes('wool') || lowerMessage.includes('material')) {
            return "Our sneakers are made from premium merino wool, which is naturally temperature-regulating, moisture-wicking, and odor-resistant.";
        } else {
            return this.botResponses[Math.floor(Math.random() * this.botResponses.length)];
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Global functions for HTML onclick handlers
function toggleChat() {
    if (window.customerSupportChat) {
        window.customerSupportChat.toggleChat();
    }
}

function sendMessage() {
    if (window.customerSupportChat) {
        window.customerSupportChat.sendMessage();
    }
}

// ============================================
// CART DRAWER RENDERING - Premium Slide Cart
// ============================================
function renderCartDrawerItems() {
    const cartItemsContainer = document.getElementById('cart-sidebar-items');
    if (!cartItemsContainer) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update cart total
    const cartTotal = document.getElementById('cart-total');
    if (cartTotal) {
        cartTotal.textContent = `$${subtotal.toFixed(2)}`;
    }
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-sidebar-empty">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                <p>Your cart is empty</p>
                <a href="products.html" onclick="toggleCart()">Start Shopping</a>
            </div>
        `;
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item" style="animation-delay: ${index * 0.05}s">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                ${item.size ? `<p class="cart-item-meta">Size: ${item.size}</p>` : ''}
                <p class="cart-item-price">$${item.price}</p>
            </div>
            <div class="cart-item-actions">
                <button class="cart-quantity-btn" onclick="updateCartQuantity('${item.id}', ${item.size || 'null'}, ${item.quantity - 1})" aria-label="Decrease quantity">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                    </svg>
                </button>
                <span class="cart-item-quantity">${item.quantity}</span>
                <button class="cart-quantity-btn" onclick="updateCartQuantity('${item.id}', ${item.size || 'null'}, ${item.quantity + 1})" aria-label="Increase quantity">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                </button>
                <button class="cart-item-remove" onclick="removeFromCart('${item.id}', ${item.size || 'null'})" aria-label="Remove item">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
    
    // Animate items with anime.js if available
    if (typeof anime !== 'undefined') {
        anime({
            targets: '.cart-item',
            translateX: [30, 0],
            opacity: [0, 1],
            delay: anime.stagger(50),
            easing: 'easeOutCubic',
            duration: 400
        });
    }
}

// ============================================
// MICRO ANIMATIONS - Premium Interactions
// ============================================
function initializeMicroAnimations() {
    // Product card entrance animations
    if (typeof anime !== 'undefined') {
        // Animate product cards on scroll
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px)';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        anime({
                            targets: entry.target,
                            translateY: [40, 0],
                            opacity: [0, 1],
                            delay: index % 6 * 100,
                            easing: 'easeOutCubic',
                            duration: 600
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(card);
        });
        
        // Button click ripple effect
        document.querySelectorAll('.btn, .btn-add-cart, .cart-checkout-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.style.cssText = `
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    background: rgba(255,255,255,0.5);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                    left: ${x}px;
                    top: ${y}px;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                anime({
                    targets: ripple,
                    scale: [0, 4],
                    opacity: [1, 0],
                    easing: 'easeOutExpo',
                    duration: 600,
                    complete: () => ripple.remove()
                });
            });
        });
        
        // Cart badge bounce animation on add
        const originalAddToCart = addToCart;
        addToCart = function(...args) {
            originalAddToCart.apply(this, args);
            
            const cartCount = document.getElementById('cart-count');
            if (cartCount && typeof anime !== 'undefined') {
                anime({
                    targets: cartCount,
                    scale: [1, 1.5, 1],
                    duration: 400,
                    easing: 'easeOutElastic(1, .5)'
                });
            }
        };
        
        // Modal animations
        const modalObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const modal = mutation.target;
                    if (modal.id === 'product-modal' || modal.id === 'checkout-modal') {
                        const isVisible = !modal.classList.contains('invisible') && !modal.classList.contains('opacity-0');
                        if (isVisible) {
                            const modalContent = modal.querySelector('.bg-warm-white, .modal-content');
                            if (modalContent) {
                                anime({
                                    targets: modalContent,
                                    scale: [0.9, 1],
                                    opacity: [0, 1],
                                    translateY: [20, 0],
                                    easing: 'easeOutCubic',
                                    duration: 400
                                });
                            }
                        }
                    }
                }
            });
        });
        
        document.querySelectorAll('#product-modal, #checkout-modal').forEach(modal => {
            modalObserver.observe(modal, { attributes: true });
        });
    }
    
    // Feature card hover animations
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (typeof anime !== 'undefined') {
                anime({
                    targets: this.querySelector('svg'),
                    rotate: '5deg',
                    scale: 1.1,
                    duration: 400,
                    easing: 'easeOutCubic'
                });
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (typeof anime !== 'undefined') {
                anime({
                    targets: this.querySelector('svg'),
                    rotate: '0deg',
                    scale: 1,
                    duration: 400,
                    easing: 'easeOutCubic'
                });
            }
        });
    });
    
    // Product image zoom with mouse position
    document.querySelectorAll('.product-image-zoom-container').forEach(container => {
        const img = container.querySelector('.product-image');
        if (!img) return;
        
        container.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            img.style.transformOrigin = `${x * 100}% ${y * 100}%`;
        });
        
        container.addEventListener('mouseleave', function() {
            img.style.transformOrigin = 'center center';
        });
    });
}

// ============================================
// MOBILE MENU SYSTEM
// ============================================
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (!mobileMenu) return;
    
    if (mobileMenu.classList.contains('hidden')) {
        // Open menu
        mobileMenu.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Animate in
        if (typeof gsap !== 'undefined') {
            gsap.to(mobileMenu, { opacity: 1, duration: 0.3 });
            gsap.from('#mobile-menu a', { 
                y: 20, 
                opacity: 0, 
                stagger: 0.1, 
                delay: 0.1,
                duration: 0.4,
                ease: 'power2.out'
            });
        } else {
            mobileMenu.classList.remove('opacity-0');
        }
    } else {
        // Close menu
        if (typeof gsap !== 'undefined') {
            gsap.to(mobileMenu, { 
                opacity: 0, 
                duration: 0.2,
                onComplete: () => {
                    mobileMenu.classList.add('hidden');
                    document.body.style.overflow = '';
                }
            });
        } else {
            mobileMenu.classList.add('opacity-0', 'hidden');
            document.body.style.overflow = '';
        }
    }
}

// Close mobile menu on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            toggleMobileMenu();
        }
    }
});

// ============================================
// SKELETON LOADING SYSTEM
// ============================================
function showSkeletonLoading(containerId, count = 6) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = Array(count).fill(0).map((_, i) => `
        <div class="skeleton-card p-4" style="animation-delay: ${i * 0.1}s">
            <div class="skeleton-image mb-4"></div>
            <div class="skeleton-title"></div>
            <div class="skeleton-text long mb-2"></div>
            <div class="flex items-center justify-between mt-4">
                <div class="skeleton-text short"></div>
                <div class="skeleton-text short" style="width: 30%"></div>
            </div>
        </div>
    `).join('');
}

function hideSkeletonLoading(containerId) {
    // Content will be replaced by actual render functions
}

// ============================================
// SESSION RESTORE SYSTEM
// ============================================
const SESSION_KEYS = {
    SCROLL_POSITION: 'woolflow-session-scroll',
    OPEN_MODAL: 'woolflow-session-modal',
    FILTERS: 'woolflow-session-filters',
    SEARCH_QUERY: 'woolflow-session-search',
    LAST_PATH: 'woolflow-session-path'
};

function saveSessionState() {
    const session = {
        scrollPosition: window.scrollY,
        path: window.location.pathname,
        timestamp: Date.now()
    };
    
    // Save open modal state
    const openModal = document.querySelector('#product-modal:not(.hidden), #cart-sidebar:not(.hidden)');
    if (openModal) {
        session.openModal = openModal.id;
        if (currentProduct) {
            session.currentProductId = currentProduct.id;
        }
    }
    
    // Save filter states
    const activeFilters = Array.from(document.querySelectorAll('.filter-checkbox:checked')).map(cb => cb.value);
    if (activeFilters.length > 0) {
        session.activeFilters = activeFilters;
    }
    
    // Save search query
    const searchInput = document.getElementById('smart-search');
    if (searchInput && searchInput.value) {
        session.searchQuery = searchInput.value;
    }
    
    sessionStorage.setItem('woolflow-session', JSON.stringify(session));
}

function restoreSessionState() {
    try {
        const sessionJson = sessionStorage.getItem('woolflow-session');
        if (!sessionJson) return;
        
        const session = JSON.parse(sessionJson);
        
        // Check if session is from same page and within 5 minutes
        if (session.path !== window.location.pathname) return;
        if (Date.now() - session.timestamp > 5 * 60 * 1000) {
            sessionStorage.removeItem('woolflow-session');
            return;
        }
        
        // Restore scroll position
        if (session.scrollPosition > 0) {
            setTimeout(() => {
                window.scrollTo({ top: session.scrollPosition, behavior: 'smooth' });
            }, 100);
        }
        
        // Restore filters
        if (session.activeFilters) {
            session.activeFilters.forEach(filterValue => {
                const checkbox = document.querySelector(`.filter-checkbox[value="${filterValue}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                    const label = checkbox.nextElementSibling;
                    if (label) label.classList.add('bg-sage', 'text-white', 'border-sage');
                }
            });
            if (typeof applyFilters === 'function') applyFilters();
        }
        
        // Restore search query
        if (session.searchQuery) {
            const searchInput = document.getElementById('smart-search');
            if (searchInput) {
                searchInput.value = session.searchQuery;
                handleSmartSearch(session.searchQuery);
            }
        }
        
        // Restore modal (after products render)
        if (session.openModal && session.currentProductId) {
            setTimeout(() => {
                if (session.openModal === 'product-modal') {
                    openProductModal(session.currentProductId);
                }
            }, 500);
        }
        
        // Clear session after restore
        sessionStorage.removeItem('woolflow-session');
        
    } catch (error) {
        console.error('Session restore failed:', error);
        sessionStorage.removeItem('woolflow-session');
    }
}

// Save session state before page unload
window.addEventListener('beforeunload', saveSessionState);
window.addEventListener('pagehide', saveSessionState);

// ============================================
// SMART SEARCH SYSTEM
// ============================================
function handleSmartSearch(query) {
    currentSearchQuery = query.toLowerCase().trim();
    
    // Show/hide clear button
    const clearBtn = document.getElementById('clear-search');
    if (clearBtn) {
        clearBtn.classList.toggle('hidden', !currentSearchQuery);
        clearBtn.classList.toggle('flex', !!currentSearchQuery);
    }
    
    // Show suggestions if query exists
    if (currentSearchQuery.length > 0) {
        showSearchSuggestions(currentSearchQuery);
    } else {
        hideSearchSuggestions();
        renderProducts(); // Reset to all products
        updateSearchStatus('');
    }
    
    // Filter products
    if (currentSearchQuery.length > 0) {
        const results = searchProducts(currentSearchQuery);
        filteredProducts = results;
        renderProducts(results);
        updateSearchStatus(`Showing ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`);
    }
}

function searchProducts(query) {
    if (!query || query.length === 0) return products;

    if (typeof aiEngine !== 'undefined' && query.trim().split(/\s+/).length >= 2) {
        const aiResults = aiEngine.searchByNaturalLanguage(query, products);
        if (aiResults && aiResults.length > 0) return aiResults;
    }
    
    return products.filter(product => {
        const searchFields = [
            product.name,
            product.color,
            product.category,
            product.description,
            ...(product.tags || [])
        ].filter(Boolean).map(f => f.toLowerCase());
        
        // Exact match first
        if (searchFields.some(field => field.includes(query))) {
            return true;
        }
        
        // Fuzzy matching for typo tolerance
        const queryChars = query.split('');
        return searchFields.some(field => {
            let fieldIndex = 0;
            return queryChars.every(char => {
                const foundIndex = field.indexOf(char, fieldIndex);
                if (foundIndex !== -1) {
                    fieldIndex = foundIndex + 1;
                    return true;
                }
                return false;
            });
        });
    }).sort((a, b) => {
        // Prioritize exact name matches
        const aNameMatch = a.name.toLowerCase().includes(query);
        const bNameMatch = b.name.toLowerCase().includes(query);
        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;
        return 0;
    });
}

function showSearchSuggestions(query) {
    const suggestionsContainer = document.getElementById('search-suggestions');
    const suggestionsList = document.getElementById('suggestions-list');
    const historyContainer = document.getElementById('search-history');
    
    if (!suggestionsContainer || !suggestionsList) return;
    
    // Get matching products (limit to 5)
    const matches = searchProducts(query).slice(0, 5);
    
    // Generate suggestions HTML
    let html = '';
    
    if (matches.length > 0) {
        html += `<div class="px-4 py-2 text-xs font-medium text-charcoal/50 uppercase tracking-wider">Products</div>`;
        matches.forEach((product, index) => {
            const highlightedName = highlightMatch(product.name, query);
            html += `
                <div class="suggestion-item px-4 py-3 hover:bg-sage/10 cursor-pointer flex items-center space-x-3 transition-colors ${index === 0 ? 'bg-sage/5' : ''}"
                     onclick="selectSearchSuggestion('${product.name}')"
                     data-index="${index}">
                    <img src="${product.image}" alt="" class="w-10 h-10 rounded-lg object-cover">
                    <div class="flex-1">
                        <div class="text-sm font-medium text-charcoal">${highlightedName}</div>
                        <div class="text-xs text-charcoal/60">${product.category} • $${product.price}</div>
                    </div>
                    <svg class="w-4 h-4 text-charcoal/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </div>
            `;
        });
    } else {
        html += `
            <div class="px-4 py-4 text-center text-charcoal/50">
                <svg class="w-8 h-8 mx-auto mb-2 text-mist-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-sm">No products found</p>
                <p class="text-xs mt-1">Try different keywords</p>
            </div>
        `;
    }
    
    suggestionsList.innerHTML = html;
    
    // Show search history if exists and query is empty or short
    if (historyContainer && searchHistory.length > 0 && query.length <= 2) {
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = searchHistory.slice(0, 5).map((term, index) => `
            <div class="suggestion-item px-4 py-2 hover:bg-sage/10 cursor-pointer flex items-center justify-between transition-colors"
                 onclick="selectSearchSuggestion('${term}')"
                 data-type="history"
                 data-index="${index}">
                <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-charcoal/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span class="text-sm text-charcoal">${term}</span>
                </div>
                <button onclick="event.stopPropagation(); removeFromSearchHistory('${term}')" class="p-1 hover:bg-charcoal/10 rounded">
                    <svg class="w-3 h-3 text-charcoal/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
        `).join('');
        historyContainer.classList.remove('hidden');
    } else if (historyContainer) {
        historyContainer.classList.add('hidden');
    }
    
    suggestionsContainer.classList.remove('hidden');
    selectedSuggestionIndex = -1;
}

function highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
    return text.replace(regex, '<span class="text-sage font-semibold">$1</span>');
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hideSearchSuggestions() {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (suggestionsContainer) {
        suggestionsContainer.classList.add('hidden');
    }
    selectedSuggestionIndex = -1;
}

function selectSearchSuggestion(term) {
    const searchInput = document.getElementById('smart-search');
    if (searchInput) {
        searchInput.value = term;
        handleSmartSearch(term);
        addToSearchHistory(term);
        hideSearchSuggestions();
    }
}

function addToSearchHistory(term) {
    if (!term || term.trim().length === 0) return;
    
    // Remove if exists (move to top)
    searchHistory = searchHistory.filter(t => t.toLowerCase() !== term.toLowerCase());
    
    // Add to beginning
    searchHistory.unshift(term.trim());
    
    // Limit to 10 items
    searchHistory = searchHistory.slice(0, 10);
    
    // Save to localStorage
    localStorage.setItem('woolflow-search-history', JSON.stringify(searchHistory));
}

function removeFromSearchHistory(term) {
    searchHistory = searchHistory.filter(t => t !== term);
    localStorage.setItem('woolflow-search-history', JSON.stringify(searchHistory));
    
    // Refresh suggestions if visible
    const searchInput = document.getElementById('smart-search');
    if (searchInput && searchInput.value.length <= 2) {
        showSearchSuggestions(searchInput.value);
    }
}

function clearSearch() {
    const searchInput = document.getElementById('smart-search');
    if (searchInput) {
        searchInput.value = '';
        handleSmartSearch('');
        searchInput.focus();
    }
}

function updateSearchStatus(message) {
    const statusEl = document.getElementById('search-status');
    if (statusEl) {
        if (message) {
            statusEl.textContent = message;
            statusEl.classList.remove('hidden');
        } else {
            statusEl.classList.add('hidden');
        }
    }
}

function handleSearchKeydown(event) {
    const suggestionsContainer = document.getElementById('search-suggestions');
    const suggestionItems = suggestionsContainer ? suggestionsContainer.querySelectorAll('.suggestion-item') : [];
    
    switch(event.key) {
        case 'ArrowDown':
            event.preventDefault();
            selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, suggestionItems.length - 1);
            updateSuggestionHighlight(suggestionItems);
            break;
        case 'ArrowUp':
            event.preventDefault();
            selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
            updateSuggestionHighlight(suggestionItems);
            break;
        case 'Enter':
            event.preventDefault();
            if (selectedSuggestionIndex >= 0 && suggestionItems[selectedSuggestionIndex]) {
                suggestionItems[selectedSuggestionIndex].click();
            } else {
                // Search with current query
                const query = event.target.value;
                if (query.trim()) {
                    addToSearchHistory(query.trim());
                    hideSearchSuggestions();
                }
            }
            break;
        case 'Escape':
            hideSearchSuggestions();
            event.target.blur();
            break;
    }
}

function updateSuggestionHighlight(items) {
    items.forEach((item, index) => {
        if (index === selectedSuggestionIndex) {
            item.classList.add('bg-sage/20');
            item.scrollIntoView({ block: 'nearest' });
        } else {
            item.classList.remove('bg-sage/20');
        }
    });
}

// Global keyboard shortcut for search
function initializeSearchShortcut() {
    document.addEventListener('keydown', function(event) {
        // Press '/' to focus search (unless in input)
        if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(event.target.tagName)) {
            event.preventDefault();
            const searchInput = document.getElementById('smart-search');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
    });
    
    // Close suggestions when clicking outside
    document.addEventListener('click', function(event) {
        const searchContainer = document.querySelector('.relative:has(#smart-search)');
        if (searchContainer && !searchContainer.contains(event.target)) {
            hideSearchSuggestions();
        }
    });
}

// Initialize search shortcut
document.addEventListener('DOMContentLoaded', initializeSearchShortcut);

// Initialize micro animations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeMicroAnimations, 100);
});

// ============================================
// USER AUTHENTICATION SYSTEM (Batch 1 - Feature 1)
// ============================================
let isSignUpMode = false;
let currentUser = JSON.parse(localStorage.getItem('woolflow-user')) || null;

function openAuthModal() {
    const modal = document.getElementById('auth-modal');
    const content = document.getElementById('auth-modal-content');
    if (!modal) return;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    if (typeof gsap !== 'undefined') {
        gsap.to(modal, { opacity: 1, duration: 0.3 });
        gsap.to(content, { scale: 1, duration: 0.3, ease: 'back.out(1.7)' });
    } else {
        modal.classList.remove('opacity-0');
        content.classList.remove('scale-95');
    }
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    const content = document.getElementById('auth-modal-content');
    if (!modal) return;
    
    if (typeof gsap !== 'undefined') {
        gsap.to(content, { scale: 0.95, duration: 0.2 });
        gsap.to(modal, { 
            opacity: 0, 
            duration: 0.2,
            onComplete: () => {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });
    } else {
        modal.classList.add('hidden', 'opacity-0');
        document.body.style.overflow = '';
    }
}

function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    const signupFields = document.getElementById('signup-fields');
    const title = document.getElementById('auth-title');
    const submitBtn = document.getElementById('auth-submit-btn');
    const toggleText = document.getElementById('auth-toggle-text');
    const toggleBtn = document.getElementById('auth-toggle-btn');
    
    if (isSignUpMode) {
        signupFields.classList.remove('hidden');
        title.textContent = 'Sign Up';
        submitBtn.textContent = 'Create Account';
        toggleText.textContent = 'Already have an account?';
        toggleBtn.textContent = 'Sign In';
    } else {
        signupFields.classList.add('hidden');
        title.textContent = 'Sign In';
        submitBtn.textContent = 'Sign In';
        toggleText.textContent = "Don't have an account?";
        toggleBtn.textContent = 'Sign Up';
    }
}

function handleAuthSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const name = document.getElementById('auth-name')?.value;
    
    if (isSignUpMode) {
        // Simulate signup
        const user = {
            id: 'user_' + Date.now(),
            name: name || email.split('@')[0],
            email: email,
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('woolflow-user', JSON.stringify(user));
        currentUser = user;
        showNotification('Account created successfully!', 'success');
    } else {
        // Simulate login
        const user = {
            id: 'user_' + Date.now(),
            name: email.split('@')[0],
            email: email,
            lastLogin: new Date().toISOString()
        };
        localStorage.setItem('woolflow-user', JSON.stringify(user));
        currentUser = user;
        showNotification('Welcome back!', 'success');
    }
    
    closeAuthModal();
    updateUserDisplay();
}

function updateUserDisplay() {
    // Update navigation to show user name if logged in
    const navActions = document.querySelector('.nav-actions');
    if (navActions && currentUser) {
        const userBtn = navActions.querySelector('.user-btn');
        if (!userBtn) {
            const btn = document.createElement('button');
            btn.className = 'user-btn flex items-center gap-2 px-4 py-2 bg-sage/10 text-sage rounded-full text-sm font-medium hover:bg-sage/20 transition-colors';
            btn.innerHTML = `
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                ${currentUser.name}
            `;
            btn.onclick = () => {
                if (confirm('Log out?')) {
                    localStorage.removeItem('woolflow-user');
                    currentUser = null;
                    btn.remove();
                    showNotification('Logged out successfully', 'success');
                }
            };
            navActions.insertBefore(btn, navActions.firstChild);
        }
    }
}

function logout() {
    localStorage.removeItem('woolflow-user');
    currentUser = null;
    showNotification('Logged out successfully', 'success');
    updateUserDisplay();
}

// Check for existing user on load
document.addEventListener('DOMContentLoaded', function() {
    if (currentUser) {
        updateUserDisplay();
    }
});

// ============================================
// ORDER HISTORY SYSTEM (Batch 1 - Feature 2)
// ============================================
function saveOrder(orderData) {
    let orders = JSON.parse(localStorage.getItem('woolflow-orders')) || [];
    const order = {
        id: 'WF-' + Date.now(),
        date: new Date().toISOString(),
        items: orderData.items,
        total: orderData.total,
        shipping: orderData.shipping,
        status: 'processing',
        trackingNumber: 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase()
    };
    orders.unshift(order);
    localStorage.setItem('woolflow-orders', JSON.stringify(orders));
    return order;
}

function getOrders() {
    return JSON.parse(localStorage.getItem('woolflow-orders')) || [];
}

function renderOrderHistory() {
    const orders = getOrders();
    const container = document.getElementById('order-history-list');
    if (!container) return;
    
    if (orders.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 text-charcoal/60">
                <svg class="w-16 h-16 mx-auto mb-4 text-mist-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                <p>No orders yet</p>
                <a href="products.html" class="text-sage hover:underline mt-2 inline-block">Start Shopping</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = orders.map(order => `
        <div class="order-card bg-warm-white rounded-xl p-6 mb-4 shadow-sm">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <p class="text-sm text-charcoal/60">Order #${order.id}</p>
                    <p class="text-xs text-charcoal/40">${new Date(order.date).toLocaleDateString()}</p>
                </div>
                <span class="px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}">${order.status}</span>
            </div>
            <div class="space-y-2 mb-4">
                ${order.items.map(item => `
                    <div class="flex items-center gap-3">
                        <img src="${item.image}" alt="${item.name}" class="w-12 h-12 rounded-lg object-cover">
                        <div class="flex-1">
                            <p class="text-sm font-medium text-charcoal">${item.name}</p>
                            <p class="text-xs text-charcoal/60">Qty: ${item.quantity} × $${item.price}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="flex items-center justify-between pt-4 border-t border-mist-grey/30">
                <p class="text-sm text-charcoal/60">Total: <span class="font-semibold text-charcoal">$${order.total}</span></p>
                <button onclick="viewOrderDetails('${order.id}')" class="text-sage text-sm hover:underline">View Details</button>
            </div>
        </div>
    `).join('');
}

function getStatusColor(status) {
    const colors = {
        'processing': 'bg-yellow-100 text-yellow-700',
        'shipped': 'bg-blue-100 text-blue-700',
        'delivered': 'bg-green-100 text-green-700',
        'cancelled': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
}

function viewOrderDetails(orderId) {
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const modal = document.getElementById('order-details-modal');
    const content = document.getElementById('order-details-content');
    if (!modal || !content) return;
    
    content.innerHTML = `
        <div class="p-6">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold text-charcoal">Order #${order.id}</h3>
                <span class="px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}">${order.status}</span>
            </div>
            <div class="mb-6">
                <p class="text-sm text-charcoal/60 mb-1">Ordered on ${new Date(order.date).toLocaleDateString()}</p>
                <p class="text-sm text-charcoal/60">Tracking: <span class="font-mono">${order.trackingNumber}</span></p>
            </div>
            <div class="space-y-4 mb-6">
                ${order.items.map(item => `
                    <div class="flex items-center gap-4 p-3 bg-cream/50 rounded-lg">
                        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-lg object-cover">
                        <div class="flex-1">
                            <p class="font-medium text-charcoal">${item.name}</p>
                            <p class="text-sm text-charcoal/60">${item.color || ''} ${item.size ? '• Size ' + item.size : ''}</p>
                            <p class="text-sm text-charcoal/60">Qty: ${item.quantity} × $${item.price}</p>
                        </div>
                        <p class="font-semibold text-charcoal">$${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                `).join('')}
            </div>
            <div class="border-t border-mist-grey/30 pt-4 space-y-2">
                <div class="flex justify-between text-sm"><span class="text-charcoal/60">Subtotal</span><span>$${(order.total - 15).toFixed(2)}</span></div>
                <div class="flex justify-between text-sm"><span class="text-charcoal/60">Shipping</span><span>$15.00</span></div>
                <div class="flex justify-between font-bold text-lg"><span class="text-charcoal">Total</span><span>$${order.total.toFixed(2)}</span></div>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        gsap.fromTo(content, { scale: 0.9, y: 20 }, { scale: 1, y: 0, duration: 0.3, ease: 'back.out(1.7)' });
    }
}

// ============================================
// PRODUCT COMPARISON (Batch 1 - Feature 3)
// ============================================
let comparisonList = JSON.parse(localStorage.getItem('woolflow-compare')) || [];
const MAX_COMPARE = 3;

function toggleCompare(productId) {
    const index = comparisonList.indexOf(productId);
    if (index > -1) {
        comparisonList.splice(index, 1);
        showNotification('Removed from comparison', 'success');
    } else {
        if (comparisonList.length >= MAX_COMPARE) {
            showNotification(`You can only compare up to ${MAX_COMPARE} products`, 'error');
            return;
        }
        comparisonList.push(productId);
        showNotification('Added to comparison', 'success');
    }
    localStorage.setItem('woolflow-compare', JSON.stringify(comparisonList));
    updateCompareDisplay();
}

function updateCompareDisplay() {
    const badge = document.getElementById('compare-count');
    if (badge) {
        badge.textContent = comparisonList.length;
        badge.classList.toggle('hidden', comparisonList.length === 0);
    }
}

function openCompareModal() {
    if (comparisonList.length < 2) {
        showNotification('Add at least 2 products to compare', 'error');
        return;
    }
    
    const productsToCompare = products.filter(p => comparisonList.includes(p.id));
    const modal = document.getElementById('compare-modal');
    if (modal) modal.classList.remove('opacity-0', 'invisible');
    const grid = document.getElementById('compare-grid');
    if (!modal || !grid) return;
    
    const features = ['price', 'color', 'category', 'rating', 'sizes'];
    
    grid.innerHTML = `
        <div class="grid grid-cols-${productsToCompare.length + 1} gap-4">
            <div class="space-y-4">
                <div class="h-48"></div>
                ${features.map(f => `<div class="p-3 font-medium text-charcoal/60 capitalize">${f}</div>`).join('')}
            </div>
            ${productsToCompare.map(p => `
                <div class="space-y-4">
                    <div class="h-48">
                        <img src="${p.image}" class="w-full h-full object-cover rounded-xl">
                        <button onclick="toggleCompare('${p.id}')" class="absolute top-2 right-2 p-1 bg-charcoal/50 text-white rounded-full hover:bg-charcoal">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                    <div class="p-3 font-bold text-charcoal">$${p.price}</div>
                    <div class="p-3 text-charcoal">${p.color}</div>
                    <div class="p-3 text-charcoal capitalize">${p.category}</div>
                    <div class="p-3 text-charcoal">${p.rating} ★</div>
                    <div class="p-3 text-charcoal text-sm">${p.sizes.join(', ')}</div>
                    <div class="p-3">
                        <button onclick="openProductModal('${p.id}')" class="w-full py-2 bg-sage text-white rounded-full text-sm">View</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    modal.classList.remove('hidden');
}

// ============================================
// QUICK VIEW (Batch 1 - Feature 4)
// ============================================
function showQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const quickView = document.createElement('div');
    quickView.id = 'quick-view-popup';
    quickView.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
    quickView.innerHTML = `
        <div class="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" onclick="closeQuickView()"></div>
        <div class="relative bg-warm-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl transform scale-95 opacity-0 transition-all duration-300" id="quick-view-content">
            <button onclick="closeQuickView()" class="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <div class="grid md:grid-cols-2">
                <img src="${product.image}" alt="${product.name}" class="w-full h-64 md:h-full object-cover">
                <div class="p-6">
                    <p class="text-sm text-charcoal/60 uppercase tracking-wide">${product.category}</p>
                    <h3 class="text-2xl font-bold text-charcoal mt-1">${product.name}</h3>
                    <div class="flex items-center gap-2 mt-2">
                        ${renderStarRating(product.rating || 4.5, 'sm')}
                        <span class="text-sm text-charcoal/60">(${product.reviewCount || 0} reviews)</span>
                    </div>
                    <p class="text-3xl font-bold text-charcoal mt-4">$${product.price}</p>
                    <p class="text-charcoal/70 mt-3 line-clamp-3">${product.description}</p>
                    <div class="flex gap-3 mt-6">
                        <button onclick="openProductModal('${product.id}'); closeQuickView();" class="flex-1 py-3 bg-charcoal text-white rounded-full hover:bg-charcoal/90 transition-colors font-medium">View Details</button>
                        <button onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.image}', null); closeQuickView();" class="flex-1 py-3 bg-sage text-white rounded-full hover:bg-sage/90 transition-colors font-medium">Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(quickView);
    document.body.style.overflow = 'hidden';
    
    requestAnimationFrame(() => {
        const content = document.getElementById('quick-view-content');
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    });
}

function closeQuickView() {
    const popup = document.getElementById('quick-view-popup');
    if (popup) {
        popup.remove();
        document.body.style.overflow = '';
    }
}

// ============================================
// SIZE GUIDE MODAL (Batch 1 - Feature 5)
// ============================================
function openSizeGuide() {
    const modal = document.createElement('div');
    modal.id = 'size-guide-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" onclick="closeSizeGuide()"></div>
        <div class="relative bg-warm-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <button onclick="closeSizeGuide()" class="absolute top-4 right-4 p-2 text-charcoal/60 hover:text-charcoal">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <h3 class="text-xl font-bold text-charcoal mb-4">Size Guide</h3>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-mist-grey">
                            <th class="text-left py-2 font-medium text-charcoal">US Size</th>
                            <th class="text-left py-2 font-medium text-charcoal">EU Size</th>
                            <th class="text-left py-2 font-medium text-charcoal">UK Size</th>
                            <th class="text-left py-2 font-medium text-charcoal">Foot Length (cm)</th>
                        </tr>
                    </thead>
                    <tbody class="text-charcoal/70">
                        <tr class="border-b border-mist-grey/30"><td class="py-2">7</td><td>40</td><td>6</td><td>25</td></tr>
                        <tr class="border-b border-mist-grey/30"><td class="py-2">8</td><td>41</td><td>7</td><td>26</td></tr>
                        <tr class="border-b border-mist-grey/30"><td class="py-2">9</td><td>42</td><td>8</td><td>27</td></tr>
                        <tr class="border-b border-mist-grey/30"><td class="py-2">10</td><td>43</td><td>9</td><td>28</td></tr>
                        <tr class="border-b border-mist-grey/30"><td class="py-2">11</td><td>44</td><td>10</td><td>29</td></tr>
                        <tr><td class="py-2">12</td><td>45</td><td>11</td><td>30</td></tr>
                    </tbody>
                </table>
            </div>
            <div class="mt-4 p-4 bg-sage/10 rounded-lg">
                <p class="text-sm text-charcoal/70"><strong class="text-charcoal">Tip:</strong> If you're between sizes, we recommend sizing up for the best fit with wool socks.</p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeSizeGuide() {
    const modal = document.getElementById('size-guide-modal');
    if (modal) modal.remove();
}

// ============================================
// NEWSLETTER SYSTEM (Batch 1 - Feature 6)
// ============================================
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value;
    const btn = document.getElementById('newsletter-btn');
    const successMsg = document.getElementById('newsletter-success');
    
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate API call
    btn.disabled = true;
    btn.innerHTML = '<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
    
    setTimeout(() => {
        localStorage.setItem('woolflow-newsletter', email);
        btn.classList.add('hidden');
        successMsg.classList.remove('hidden');
        showNotification('Successfully subscribed!', 'success');
    }, 1500);
}

// ============================================
// BREADCRUMB NAVIGATION (Batch 1 - Feature 7)
// ============================================
function updateBreadcrumbs(path) {
    const container = document.getElementById('breadcrumbs');
    if (!container) return;
    
    const crumbs = [{ name: 'Home', url: 'index.html' }, ...path];
    
    container.innerHTML = crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return `
            ${index > 0 ? '<span class="text-charcoal/30 mx-2">/</span>' : ''}
            ${isLast 
                ? `<span class="text-charcoal font-medium">${crumb.name}</span>`
                : `<a href="${crumb.url}" class="text-charcoal/60 hover:text-sage transition-colors">${crumb.name}</a>`
            }
        `;
    }).join('');
}

// ============================================
// BATCH 2 FEATURES 1-8
// ============================================

// Feature 1: Advanced Gallery with Zoom
function initializeProductGallery() {
    const mainImage = document.getElementById('modal-image');
    const zoomContainer = document.getElementById('zoom-container');
    if (!mainImage || !zoomContainer) return;
    
    zoomContainer.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        mainImage.style.transformOrigin = `${x * 100}% ${y * 100}%`;
        mainImage.style.transform = 'scale(2)';
    });
    
    zoomContainer.addEventListener('mouseleave', function() {
        mainImage.style.transform = 'scale(1)';
    });
}

// Feature 2: Related Products Carousel
function renderRelatedProductsCarousel(currentProduct) {
    const container = document.getElementById('related-carousel');
    if (!container || !currentProduct) return;
    
    const related = products
        .filter(p => p.id !== currentProduct.id && p.category === currentProduct.category)
        .slice(0, 6);
    
    container.innerHTML = related.map(p => `
        <div class="flex-shrink-0 w-48 group cursor-pointer" onclick="openProductModal('${p.id}')">
            <div class="aspect-[4/5] rounded-xl overflow-hidden mb-3">
                <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover transition-transform group-hover:scale-110">
            </div>
            <h4 class="font-medium text-charcoal text-sm group-hover:text-sage transition-colors">${p.name}</h4>
            <p class="text-charcoal/60 text-sm">$${p.price}</p>
        </div>
    `).join('');
}

// Feature 3: Sticky Add to Cart
function initializeStickyAddToCart() {
    const stickyBar = document.getElementById('sticky-add-to-cart');
    const modal = document.getElementById('product-modal');
    if (!stickyBar || !modal) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                stickyBar.classList.remove('translate-y-full');
            } else {
                stickyBar.classList.add('translate-y-full');
            }
        });
    }, { threshold: 0 });
    
    observer.observe(document.getElementById('modal-add-to-cart'));
}

// Feature 4: Countdown Timer
function initializeCountdownTimer() {
    const timer = document.getElementById('sale-countdown');
    if (!timer) return;
    
    let endTime = localStorage.getItem('woolflow-sale-end');
    if (!endTime) {
        endTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        localStorage.setItem('woolflow-sale-end', endTime);
    }
    
    function update() {
        const remaining = Math.max(0, endTime - Date.now());
        const hours = Math.floor(remaining / (60 * 60 * 1000));
        const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
        
        timer.innerHTML = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (remaining > 0) {
            requestAnimationFrame(update);
        }
    }
    update();
}

// Feature 5: FAQ Accordion
function toggleFaq(element) {
    const content = element.nextElementSibling;
    const icon = element.querySelector('svg');
    const isOpen = !content.classList.contains('hidden');
    
    if (isOpen) {
        content.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
    } else {
        content.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
    }
}

// Feature 6: Social Share
async function shareProduct(platform, product) {
    const url = window.location.href;
    const text = `Check out the ${product.name} at WoolFlow!`;
    
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`,
        copy: null
    };
    
    if (platform === 'copy') {
        await navigator.clipboard.writeText(url);
        showNotification('Link copied to clipboard!', 'success');
    } else if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
}

// Feature 7: Infinite Scroll
function initializeInfiniteScroll() {
    let page = 1;
    const loader = document.getElementById('infinite-loader');
    if (!loader) return;
    
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            loadMoreProducts(page++);
        }
    }, { rootMargin: '100px' });
    
    observer.observe(loader);
}

function loadMoreProducts(page) {
    // Simulate loading more products
    setTimeout(() => {
        const grid = document.getElementById('products-grid');
        if (!grid) return;
        
        // In a real app, this would fetch from API
        // For demo, we clone existing products with different IDs
        const newProducts = products.slice(0, 3).map((p, i) => ({
            ...p,
            id: p.id + '-page' + page + '-' + i
        }));
        
        newProducts.forEach(p => {
            // Render new product cards
        });
    }, 500);
}

// Feature 8: Back to Top with Progress
function initializeBackToTop() {
    const btn = document.getElementById('back-to-top');
    const progress = document.getElementById('scroll-progress');
    if (!btn) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / docHeight;
        
        // Update progress ring
        if (progress) {
            const circumference = 2 * Math.PI * 18;
            progress.style.strokeDasharray = circumference;
            progress.style.strokeDashoffset = circumference * (1 - scrollPercent);
        }
        
        // Show/hide button
        if (scrollTop > 300) {
            btn.classList.remove('translate-y-20', 'opacity-0');
        } else {
            btn.classList.add('translate-y-20', 'opacity-0');
        }
    });
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


// ============================================
// FEATURE 1: SAVE FOR LATER
// ============================================
let savedForLater = JSON.parse(localStorage.getItem('woolflow-saved-later')) || [];

function saveForLater(productId, size) {
    const item = cart.find(i => i.id === productId && i.size === size);
    if (!item) return;
    cart = cart.filter(i => !(i.id === productId && i.size === size));
    localStorage.setItem('woolflow-cart', JSON.stringify(cart));
    const alreadySaved = savedForLater.find(i => i.id === productId && i.size === size);
    if (!alreadySaved) {
        savedForLater.push({ ...item, savedAt: Date.now() });
        localStorage.setItem('woolflow-saved-later', JSON.stringify(savedForLater));
    }
    updateCartDisplay();
    if (window.location.pathname.includes('cart.html')) {
        renderCartItems();
        updateOrderSummary();
        renderSavedForLater();
    }
    showNotification('Saved for later!', 'success');
}

function moveToCart(productId, size) {
    const item = savedForLater.find(i => i.id === productId && i.size === size);
    if (!item) return;
    savedForLater = savedForLater.filter(i => !(i.id === productId && i.size === size));
    localStorage.setItem('woolflow-saved-later', JSON.stringify(savedForLater));
    addToCart(item.id, item.name, item.price, item.image, item.size);
    if (window.location.pathname.includes('cart.html')) {
        renderCartItems();
        updateOrderSummary();
        renderSavedForLater();
    }
}

function removeSavedItem(productId, size) {
    savedForLater = savedForLater.filter(i => !(i.id === productId && i.size === size));
    localStorage.setItem('woolflow-saved-later', JSON.stringify(savedForLater));
    renderSavedForLater();
    showNotification('Removed from saved items', 'success');
}

function renderSavedForLater() {
    const container = document.getElementById('saved-for-later-section');
    if (!container) return;
    if (savedForLater.length === 0) { container.innerHTML = ''; return; }
    const rows = savedForLater.map(item => {
        const sizeStr = item.size ? `Size: ${item.size}` : '';
        return `<div class="flex items-center space-x-4 p-4 border border-mist-grey/30 rounded-xl">
            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg">
            <div class="flex-1">
                <h4 class="font-semibold text-charcoal">${item.name}</h4>
                ${sizeStr ? `<p class="text-sm text-charcoal/60">${sizeStr}</p>` : ''}
                <p class="text-charcoal font-bold mt-1">$${item.price}</p>
            </div>
            <div class="flex flex-col gap-2">
                <button onclick="moveToCart('${item.id}', ${item.size || 'null'})"
                    class="px-4 py-2 bg-sage text-white rounded-full text-sm font-medium hover:bg-sage/90 transition-colors">
                    Move to Cart
                </button>
                <button onclick="removeSavedItem('${item.id}', ${item.size || 'null'})"
                    class="px-4 py-2 border border-mist-grey text-charcoal/60 rounded-full text-sm hover:border-red-400 hover:text-red-400 transition-colors">
                    Remove
                </button>
            </div>
        </div>`;
    }).join('');
    container.innerHTML = `<div class="bg-warm-white/80 backdrop-blur-sm rounded-2xl p-6 mt-6">
        <h2 class="text-xl font-display font-bold text-charcoal mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
            </svg>
            Saved for Later (${savedForLater.length})
        </h2>
        <div class="space-y-4">${rows}</div>
    </div>`;
}

// ============================================
// FEATURE 2: USER REVIEW SUBMISSION
// ============================================
let userReviews = JSON.parse(localStorage.getItem('woolflow-user-reviews')) || {};

function openReviewForm(productId) {
    const existing = document.getElementById('review-form-container');
    if (existing) { existing.remove(); return; }
    const container = document.createElement('div');
    container.id = 'review-form-container';
    container.className = 'mt-6 p-5 bg-oat/40 rounded-2xl border border-mist-grey/30';
    container.innerHTML = `
        <h4 class="font-semibold text-charcoal mb-4">Write a Review</h4>
        <div class="mb-4">
            <p class="text-sm text-charcoal/70 mb-2">Your Rating</p>
            <div class="flex gap-1" id="star-picker">
                ${[1,2,3,4,5].map(n => `<button onclick="setReviewRating(${n})" data-star="${n}" class="star-pick text-2xl text-mist-grey hover:text-yellow-400 transition-colors">&#9733;</button>`).join('')}
            </div>
            <input type="hidden" id="review-rating-value" value="0">
        </div>
        <div class="mb-4">
            <input type="text" id="review-author" placeholder="Your name"
                class="w-full px-4 py-2 border border-mist-grey rounded-xl text-sm focus:outline-none focus:border-sage">
        </div>
        <div class="mb-4">
            <textarea id="review-text" rows="3" placeholder="Share your experience..."
                class="w-full px-4 py-2 border border-mist-grey rounded-xl text-sm focus:outline-none focus:border-sage resize-none"></textarea>
        </div>
        <div class="flex gap-3">
            <button onclick="submitReview('${productId}')"
                class="px-5 py-2 bg-charcoal text-white rounded-full text-sm font-medium hover:bg-charcoal/90 transition-colors">
                Submit Review
            </button>
            <button onclick="document.getElementById('review-form-container').remove()"
                class="px-5 py-2 border border-mist-grey text-charcoal/60 rounded-full text-sm hover:border-charcoal transition-colors">
                Cancel
            </button>
        </div>`;
    const reviewsSection = document.getElementById('modal-reviews');
    if (reviewsSection) reviewsSection.insertAdjacentElement('beforebegin', container);
}

function setReviewRating(value) {
    document.getElementById('review-rating-value').value = value;
    document.querySelectorAll('.star-pick').forEach(btn => {
        const star = parseInt(btn.dataset.star);
        btn.style.color = star <= value ? '#FBBF24' : '#C8C0B8';
    });
}

function submitReview(productId) {
    const rating = parseInt(document.getElementById('review-rating-value').value);
    const author = document.getElementById('review-author').value.trim();
    const text = document.getElementById('review-text').value.trim();
    if (rating === 0) { showNotification('Please select a star rating', 'error'); return; }
    if (!author) { showNotification('Please enter your name', 'error'); return; }
    if (!text) { showNotification('Please write a review', 'error'); return; }
    const review = { name: author, rating, text, date: new Date().toISOString().split('T')[0], userSubmitted: true };
    if (!userReviews[productId]) userReviews[productId] = [];
    userReviews[productId].unshift(review);
    localStorage.setItem('woolflow-user-reviews', JSON.stringify(userReviews));
    const product = products.find(p => p.id === productId);
    if (product) {
        if (!product.reviews) product.reviews = [];
        product.reviews.unshift(review);
        product.reviewCount = (product.reviewCount || 0) + 1;
        const allRatings = product.reviews.map(r => r.rating);
        product.rating = Math.round((allRatings.reduce((a, b) => a + b, 0) / allRatings.length) * 10) / 10;
    }
    document.getElementById('review-form-container').remove();
    if (currentProduct) injectWriteReviewButton(currentProduct);
    showNotification('Review submitted — thank you!', 'success');
}

function injectWriteReviewButton(product) {
    const reviewsSection = document.getElementById('modal-reviews');
    if (!reviewsSection) return;
    const existing = document.getElementById('write-review-btn');
    if (existing) existing.remove();
    // Merge and re-render reviews
    const stored = (userReviews[product.id] || []);
    const base = (product.reviews || []).filter(r => !r.userSubmitted);
    const merged = [...stored, ...base];
    const displayProduct = { ...product, reviews: merged };
    renderModalReviews(displayProduct);
    // Add button
    const btn = document.createElement('button');
    btn.id = 'write-review-btn';
    btn.className = 'mt-4 px-5 py-2 border-2 border-sage text-sage rounded-full text-sm font-medium hover:bg-sage hover:text-white transition-all';
    btn.textContent = '+ Write a Review';
    btn.onclick = () => openReviewForm(product.id);
    reviewsSection.appendChild(btn);
}

// ============================================
// FEATURE 3: CART ABANDONMENT RECOVERY
// ============================================
function initCartAbandonmentRecovery() {
    const lastVisit = parseInt(localStorage.getItem('woolflow-last-visit') || '0');
    const now = Date.now();
    localStorage.setItem('woolflow-last-visit', now.toString());
    const MIN_GAP = 30 * 60 * 1000;
    if (lastVisit > 0 && (now - lastVisit) > MIN_GAP && cart.length > 0) {
        setTimeout(showAbandonmentNudge, 1500);
    }
}

function showAbandonmentNudge() {
    if (document.getElementById('abandonment-nudge')) return;
    const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
    const totalValue = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const nudge = document.createElement('div');
    nudge.id = 'abandonment-nudge';
    nudge.className = 'fixed bottom-6 left-6 z-50 max-w-sm bg-white rounded-2xl shadow-2xl border border-mist-grey/30 p-5 transform translate-y-4 opacity-0 transition-all duration-500';
    nudge.innerHTML = `
        <button onclick="document.getElementById('abandonment-nudge').remove()"
            class="absolute top-3 right-3 text-charcoal/40 hover:text-charcoal transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
        </button>
        <div class="flex items-start gap-3">
            <img src="${cart[0].image}" alt="" class="w-14 h-14 rounded-xl object-cover flex-shrink-0">
            <div>
                <p class="text-xs text-sage font-semibold uppercase tracking-wide mb-1">Welcome back!</p>
                <p class="text-sm font-semibold text-charcoal">You left ${totalItems} item${totalItems > 1 ? 's' : ''} behind</p>
                <p class="text-xs text-charcoal/60 mt-0.5">${cart[0].name}${totalItems > 1 ? ' + ' + (totalItems - 1) + ' more' : ''} &middot; $${totalValue.toFixed(2)}</p>
                <div class="flex gap-2 mt-3">
                    <a href="cart.html" class="px-4 py-1.5 bg-charcoal text-white rounded-full text-xs font-medium hover:bg-charcoal/90 transition-colors">View Cart</a>
                    <button onclick="document.getElementById('abandonment-nudge').remove()"
                        class="px-4 py-1.5 border border-mist-grey text-charcoal/60 rounded-full text-xs hover:border-charcoal transition-colors">Dismiss</button>
                </div>
            </div>
        </div>`;
    document.body.appendChild(nudge);
    requestAnimationFrame(() => {
        nudge.classList.remove('translate-y-4', 'opacity-0');
        nudge.classList.add('translate-y-0', 'opacity-100');
    });
    setTimeout(() => {
        if (nudge.parentNode) {
            nudge.classList.add('translate-y-4', 'opacity-0');
            setTimeout(() => nudge.remove(), 500);
        }
    }, 12000);
}

// ============================================
// FEATURE 4: PRODUCT BUNDLE SUGGESTIONS
// ============================================
const BUNDLE_PAIRS = {
    'urban-runner': 'metro-mist', 'city-sage': 'trail-sage', 'metro-mist': 'urban-runner',
    'street-charcoal': 'daily-charcoal', 'commuter-oat': 'lounge-oat', 'trail-sage': 'city-sage',
    'sport-mist': 'flex-sage', 'hike-charcoal': 'street-charcoal', 'active-oat': 'commuter-oat',
    'flex-sage': 'sport-mist', 'weekend-mist': 'metro-mist', 'lounge-oat': 'easy-oat',
    'daily-charcoal': 'street-charcoal', 'comfort-sage': 'flex-sage', 'easy-oat': 'lounge-oat',
    'urban-mist-plus': 'metro-mist', 'metro-charcoal-plus': 'daily-charcoal', 'active-sage-plus': 'trail-sage'
};
const BUNDLE_DISCOUNT_PCT = 10;

function renderBundleSuggestion(product) {
    const pairedId = BUNDLE_PAIRS[product.id];
    if (!pairedId) return;
    const paired = products.find(p => p.id === pairedId);
    if (!paired) return;
    let container = document.getElementById('bundle-suggestion');
    if (!container) return;
    const combinedOriginal = product.price + paired.price;
    const discount = Math.round(combinedOriginal * BUNDLE_DISCOUNT_PCT / 100);
    const bundlePrice = combinedOriginal - discount;
    container.innerHTML = `
        <div class="mt-6 p-4 bg-gradient-to-r from-sage/10 to-oat/40 rounded-2xl border border-sage/20">
            <div class="flex items-center gap-2 mb-3">
                <svg class="w-4 h-4 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
                </svg>
                <span class="text-sm font-semibold text-charcoal">Complete the Look</span>
                <span class="ml-auto text-xs bg-sage text-white px-2 py-0.5 rounded-full font-medium">${BUNDLE_DISCOUNT_PCT}% off bundle</span>
            </div>
            <div class="flex items-center gap-3">
                <div class="flex -space-x-3">
                    <img src="${product.image}" alt="${product.name}" class="w-12 h-12 rounded-xl object-cover border-2 border-white">
                    <img src="${paired.image}" alt="${paired.name}" class="w-12 h-12 rounded-xl object-cover border-2 border-white">
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-charcoal truncate">${product.name} + ${paired.name}</p>
                    <div class="flex items-center gap-2 mt-0.5">
                        <span class="text-sm font-bold text-charcoal">$${bundlePrice}</span>
                        <span class="text-xs text-charcoal/40 line-through">$${combinedOriginal}</span>
                        <span class="text-xs text-green-600 font-medium">Save $${discount}</span>
                    </div>
                </div>
                <button onclick="addBundleToCart('${product.id}', '${paired.id}')"
                    class="flex-shrink-0 px-3 py-2 bg-sage text-white rounded-xl text-xs font-medium hover:bg-sage/90 transition-colors">
                    Add Both
                </button>
            </div>
        </div>`;
}

function addBundleToCart(productId1, productId2) {
    const p1 = products.find(p => p.id === productId1);
    const p2 = products.find(p => p.id === productId2);
    if (!p1 || !p2) return;
    const d1 = Math.round(p1.price * (1 - BUNDLE_DISCOUNT_PCT / 100));
    const d2 = Math.round(p2.price * (1 - BUNDLE_DISCOUNT_PCT / 100));
    addToCart(p1.id, p1.name + ' (Bundle)', d1, p1.image, null);
    addToCart(p2.id, p2.name + ' (Bundle)', d2, p2.image, null);
    showNotification('Bundle added! You saved $' + Math.round((p1.price + p2.price) * BUNDLE_DISCOUNT_PCT / 100), 'success');
    closeProductModal();
}

// ============================================
// FEATURE 5: RESTOCK ALERTS
// ============================================
let restockAlerts = JSON.parse(localStorage.getItem('woolflow-restock-alerts')) || [];

function subscribeRestockAlert(productId, color, size) {
    const key = productId + '|' + color + '|' + size;
    if (restockAlerts.some(a => a.key === key)) {
        showNotification('Already subscribed for this item!', 'info');
        return;
    }
    const product = products.find(p => p.id === productId);
    restockAlerts.push({ key, productId, color, size, productName: product ? product.name : productId, subscribedAt: Date.now() });
    localStorage.setItem('woolflow-restock-alerts', JSON.stringify(restockAlerts));
    const btn = document.getElementById('restock-btn-' + productId + '-' + color + '-' + size);
    if (btn) { btn.textContent = '\u2713 Notify Me'; btn.disabled = true; btn.classList.add('opacity-60', 'cursor-not-allowed'); }
    showNotification("We'll notify you when Size " + size + " in " + color + " is back!", 'success');
    // Simulate restock after 20-40 seconds (demo)
    const delay = 20000 + Math.random() * 20000;
    setTimeout(() => triggerRestockNotification(key), delay);
}

function triggerRestockNotification(key) {
    const alert = restockAlerts.find(a => a.key === key);
    if (!alert) return;
    restockAlerts = restockAlerts.filter(a => a.key !== key);
    localStorage.setItem('woolflow-restock-alerts', JSON.stringify(restockAlerts));
    const notif = document.createElement('div');
    notif.className = 'fixed bottom-6 right-6 z-50 max-w-sm bg-white rounded-2xl shadow-2xl border border-sage/30 p-5 transform translate-y-4 opacity-0 transition-all duration-500';
    notif.innerHTML = `
        <div class="flex items-start gap-3">
            <div class="w-10 h-10 bg-sage/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
            </div>
            <div class="flex-1">
                <p class="text-sm font-semibold text-charcoal">Back in Stock!</p>
                <p class="text-xs text-charcoal/60 mt-0.5">${alert.productName} &middot; Size ${alert.size} in ${alert.color} is available again</p>
                <div class="flex gap-2 mt-3">
                    <button onclick="openProductModal('${alert.productId}'); this.closest('.fixed').remove();"
                        class="px-4 py-1.5 bg-sage text-white rounded-full text-xs font-medium hover:bg-sage/90 transition-colors">Shop Now</button>
                    <button onclick="this.closest('.fixed').remove()"
                        class="px-4 py-1.5 border border-mist-grey text-charcoal/60 rounded-full text-xs hover:border-charcoal transition-colors">Dismiss</button>
                </div>
            </div>
        </div>`;
    document.body.appendChild(notif);
    requestAnimationFrame(() => { notif.classList.remove('translate-y-4', 'opacity-0'); notif.classList.add('translate-y-0', 'opacity-100'); });
}

function patchSizeGridWithRestockAlerts(productId) {
    setTimeout(() => {
        const product = products.find(p => p.id === productId);
        if (!product || !product.stockBySize) return;
        const color = currentProduct && currentProduct.selectedVariant ? currentProduct.selectedVariant.color : product.color;
        const stockBySize = getStockMapForColor(product, color);
        const sizeGrid = document.getElementById('modal-size-grid');
        if (!sizeGrid) return;
        const existing = document.getElementById('restock-area');
        if (existing) existing.remove();
        const outOfStockSizes = product.sizes.filter(s => (stockBySize[s] || 0) === 0);
        if (outOfStockSizes.length === 0) return;
        const restockArea = document.createElement('div');
        restockArea.id = 'restock-area';
        restockArea.className = 'mt-3';
        const btns = outOfStockSizes.map(size => {
            const btnId = 'restock-btn-' + productId + '-' + color + '-' + size;
            const isSubscribed = restockAlerts.some(a => a.key === productId + '|' + color + '|' + size);
            return `<button onclick="subscribeRestockAlert('${productId}', '${color}', ${size})"
                id="${btnId}" ${isSubscribed ? 'disabled' : ''}
                class="px-3 py-1.5 border border-dashed border-mist-grey text-charcoal/50 rounded-lg text-xs hover:border-sage hover:text-sage transition-colors ${isSubscribed ? 'opacity-60 cursor-not-allowed' : ''}">
                ${isSubscribed ? '\u2713' : '\uD83D\uDD14'} Size ${size}
            </button>`;
        }).join('');
        restockArea.innerHTML = '<p class="text-xs text-charcoal/50 mb-2">Out of stock in your size? Get notified:</p><div class="flex flex-wrap gap-2">' + btns + '</div>';
        sizeGrid.parentNode.insertBefore(restockArea, sizeGrid.nextSibling);
    }, 50);
}

// ============================================
// INIT: Run on every page load
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initCartAbandonmentRecovery();
    if (window.location.pathname.includes('cart.html')) {
        renderSavedForLater();
    }
});
