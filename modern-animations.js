// WoolFlow Modern Animations & Enhanced Features
// Includes smooth transitions, interactive elements, and feature implementations

// ============================================
// ANIMATION UTILITIES
// ============================================

class AnimationEngine {
    static fadeInUp(element, delay = 0) {
        element.style.animation = `fadeInUp 0.6s ease-out ${delay}ms forwards`;
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
    }

    static slideInLeft(element, delay = 0) {
        element.style.animation = `slideInLeft 0.6s ease-out ${delay}ms forwards`;
        element.style.opacity = '0';
        element.style.transform = 'translateX(-30px)';
    }

    static slideInRight(element, delay = 0) {
        element.style.animation = `slideInRight 0.6s ease-out ${delay}ms forwards`;
        element.style.opacity = '0';
        element.style.transform = 'translateX(30px)';
    }

    static scaleIn(element, delay = 0) {
        element.style.animation = `scaleIn 0.5s ease-out ${delay}ms forwards`;
        element.style.opacity = '0';
        element.style.transform = 'scale(0.9)';
    }

    static pulse(element) {
        element.style.animation = 'pulse 2s ease-in-out infinite';
    }

    static float(element) {
        element.style.animation = 'float 3s ease-in-out infinite';
    }

    static shake(element) {
        element.style.animation = 'shake 0.5s ease-in-out';
    }

    static bounce(element) {
        element.style.animation = 'bounce 0.6s ease-out';
    }

    static flipIn(element, delay = 0) {
        element.style.animation = `flipIn 0.6s ease-out ${delay}ms forwards`;
        element.style.opacity = '0';
    }
}

// Add animation keyframes to document
function injectAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-50px); }
            to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(50px); }
            to { opacity: 1; transform: translateX(0); }
        }

        @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }

        @keyframes bounce {
            0% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0); }
        }

        @keyframes flipIn {
            from { opacity: 0; transform: rotateY(90deg); }
            to { opacity: 1; transform: rotateY(0deg); }
        }

        @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
        }

        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ============================================

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = index * 100;

                if (element.classList.contains('fade-in-up')) {
                    AnimationEngine.fadeInUp(element, delay);
                } else if (element.classList.contains('slide-in-left')) {
                    AnimationEngine.slideInLeft(element, delay);
                } else if (element.classList.contains('slide-in-right')) {
                    AnimationEngine.slideInRight(element, delay);
                } else if (element.classList.contains('scale-in')) {
                    AnimationEngine.scaleIn(element, delay);
                }

                observer.unobserve(element);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[class*="fade-in"], [class*="slide-in"], [class*="scale-in"]').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// HOVER EFFECTS & INTERACTIVE ELEMENTS
// ============================================

function initializeHoverEffects() {
    // Product card hover effects
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Button hover effects
    document.querySelectorAll('button:not(.no-hover)').forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
            button.style.transition = 'transform 0.2s ease-out';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
    });

    // Link hover effects
    document.querySelectorAll('a').forEach(link => {
        link.style.position = 'relative';
        const underline = document.createElement('span');
        underline.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background: var(--color-sage);
            transition: width 0.3s ease-out;
        `;
        link.appendChild(underline);

        link.addEventListener('mouseenter', () => {
            underline.style.width = '100%';
        });

        link.addEventListener('mouseleave', () => {
            underline.style.width = '0';
        });
    });
}

// ============================================
// DYNAMIC PRODUCT GRID WITH FILTERING
// ============================================

class ProductGrid {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.allProducts = products;
        this.filteredProducts = [...products];
        this.currentFilters = {
            category: null,
            priceRange: null,
            rating: null,
            season: null,
            search: null
        };
    }

    render() {
        if (!this.container) return;

        this.container.innerHTML = this.filteredProducts.map((product, index) => `
            <article class="product-card fade-in-up" style="animation-delay: ${index * 50}ms" data-product-id="${product.id}">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image" />
                    <div class="product-image-overlay"></div>
                    ${product.rating >= 4.7 ? '<span class="product-badge">⭐ Top Rated</span>' : ''}
                    ${product.salePrice ? `<span class="sale-badge">SALE</span>` : ''}
                    <div class="product-quick-actions">
                        <button class="quick-action-btn" onclick="openSizeFitAdvisor()" title="Find Size">
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
                            </svg>
                        </button>
                        <button class="quick-action-btn" onclick="addToWishlist('${product.id}')" title="Add to Wishlist">
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="product-content">
                    <span class="product-category">${product.subcategory}</span>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-rating">
                        <span class="stars">${'⭐'.repeat(Math.floor(product.rating))}</span>
                        <span class="rating-value">${product.rating}</span>
                        <span class="review-count">(${product.reviewCount})</span>
                    </div>
                    <div class="product-footer">
                        <span class="product-price">
                            ${product.salePrice ? `<span class="original-price">$${product.price}</span>` : ''}
                            <span class="price">$${product.salePrice || product.price}</span>
                        </span>
                        <button class="btn-add-cart" onclick="addToCart('${product.id}', '${product.name}', ${product.salePrice || product.price}, '${product.image}')">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </article>
        `).join('');

        // Re-initialize hover effects for new elements
        initializeHoverEffects();
        initializeScrollAnimations();
    }

    filterByCategory(category) {
        this.currentFilters.category = category;
        this.applyFilters();
    }

    filterByPrice(min, max) {
        this.currentFilters.priceRange = { min, max };
        this.applyFilters();
    }

    filterByRating(minRating) {
        this.currentFilters.rating = minRating;
        this.applyFilters();
    }

    search(query) {
        this.currentFilters.search = query.toLowerCase();
        this.applyFilters();
    }

    applyFilters() {
        this.filteredProducts = this.allProducts.filter(product => {
            if (this.currentFilters.category && product.category !== this.currentFilters.category) return false;
            if (this.currentFilters.priceRange) {
                const price = product.salePrice || product.price;
                if (price < this.currentFilters.priceRange.min || price > this.currentFilters.priceRange.max) return false;
            }
            if (this.currentFilters.rating && product.rating < this.currentFilters.rating) return false;
            if (this.currentFilters.search) {
                const searchQuery = this.currentFilters.search;
                if (!product.name.toLowerCase().includes(searchQuery) &&
                    !product.description.toLowerCase().includes(searchQuery)) return false;
            }
            return true;
        });

        this.render();
    }

    sortBy(sortType) {
        switch(sortType) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                this.filteredProducts.sort((a, b) => (b.id || '').localeCompare(a.id || ''));
                break;
        }
        this.render();
    }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

class ToastNotification {
    static show(message, type = 'success', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${this.getIcon(type)}</span>
                <span class="toast-message">${message}</span>
            </div>
        `;

        const container = document.getElementById('notification-container') || document.body;
        container.appendChild(toast);

        // Add styles if not present
        if (!document.querySelector('style[data-toasts]')) {
            const style = document.createElement('style');
            style.setAttribute('data-toasts', 'true');
            style.textContent = `
                .toast {
                    animation: slideInRight 0.3s ease-out;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    margin-bottom: 12px;
                    overflow: hidden;
                }

                .toast-success { border-left: 4px solid #10b981; }
                .toast-error { border-left: 4px solid #ef4444; }
                .toast-warning { border-left: 4px solid #f59e0b; }
                .toast-info { border-left: 4px solid #3b82f6; }

                .toast-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                }

                .toast-icon { font-size: 20px; }
                .toast-message { flex: 1; }
            `;
            document.head.appendChild(style);
        }

        AnimationEngine.slideInRight(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    static getIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }
}

// ============================================
// LAZY LOADING IMAGES
// ============================================

function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.style.animation = 'fadeIn 0.3s ease-in';
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ============================================
// SMOOTH SCROLL BEHAVIOR
// ============================================

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ============================================
// DYNAMIC LOADING STATES
// ============================================

class LoadingState {
    static show(message = 'Loading...') {
        const loader = document.createElement('div');
        loader.id = 'app-loader';
        loader.innerHTML = `
            <div class="loader-backdrop">
                <div class="loader-content">
                    <div class="spinner"></div>
                    <p>${message}</p>
                </div>
            </div>
        `;

        document.body.appendChild(loader);

        if (!document.querySelector('style[data-loader]')) {
            const style = document.createElement('style');
            style.setAttribute('data-loader', 'true');
            style.textContent = `
                .loader-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255,255,255,0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                }

                .loader-content {
                    text-align: center;
                }

                .spinner {
                    width: 50px;
                    height: 50px;
                    border: 4px solid var(--color-oat);
                    border-top: 4px solid var(--color-sage);
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                    margin: 0 auto 20px;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    static hide() {
        const loader = document.getElementById('app-loader');
        if (loader) {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.3s ease-out';
            setTimeout(() => loader.remove(), 300);
        }
    }
}

// ============================================
// INITIALIZATION
// ============================================

function initializeModernFeatures() {
    console.log('🎨 Initializing modern animations and features...');

    // Inject animation styles
    injectAnimationStyles();

    // Initialize all features
    initializeScrollAnimations();
    initializeHoverEffects();
    initializeLazyLoading();
    initializeSmoothScroll();

    console.log('✅ Modern features initialized');
}

// Run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeModernFeatures);
} else {
    initializeModernFeatures();
}

// Global reference to product grid
let productGrid = null;
