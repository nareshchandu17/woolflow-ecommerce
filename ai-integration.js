// AI Integration Module - Connects all AI features to the application

// Global functions for AI feature interactions

// ============================================
// SIZE FIT ADVISOR
// ============================================
function openSizeFitAdvisor() {
    let widget = document.getElementById('size-fit-advisor');
    if (!widget) {
        widget = sizeFitAdvisor.initializeWidget();
        document.body.appendChild(widget);
    }
    widget.style.display = 'flex';
    sizeFitAdvisor.startConversation();
}

function closeSizeFitAdvisor() {
    const widget = document.getElementById('size-fit-advisor');
    if (widget) widget.style.display = 'none';
}

function sendSizeFitMessage() {
    const input = document.getElementById('size-advisor-input');
    const message = input.value.trim();
    if (message) {
        sizeFitAdvisor.processInput(message);
    }
}

// ============================================
// SMART SEARCH
// ============================================
function selectSearchResult(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        aiEngine.recordProductView(productId);
        // Redirect to product page or show modal
        showProductDetail(productId);
        document.getElementById('search-suggestions').classList.add('hidden');
    }
}

function initializeSmartSearch() {
    const searchInput = document.querySelector('[id="smart-search-input"]');
    if (!searchInput) {
        const container = smartSearch.initializeWidget(products);
        const navContainer = document.querySelector('.nav-links') || document.querySelector('nav');
        if (navContainer) {
            navContainer.parentElement.insertBefore(container, navContainer);
        }
    }
}

// ============================================
// PRODUCT RECOMMENDATIONS
// ============================================
function loadProductRecommendations(productId) {
    const recommendations = aiEngine.generateRecommendations(productId, products, cart);
    const container = document.getElementById('recommendations-container');
    if (container) {
        recommendationWidget.renderRecommendations(recommendations, 'recommendations-container');
    }
}

function initializeRecommendationsSection() {
    const section = document.createElement('section');
    section.className = 'recommendations-section';
    section.innerHTML = `
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Recommended For You</h2>
            </div>
            <div id="recommendations-container" class="products-grid"></div>
        </div>
    `;
    return section;
}

// ============================================
// PRODUCT DETAIL PAGE ENHANCEMENTS
// ============================================
function enhanceProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    aiEngine.recordProductView(productId);

    // Add sentiment analysis
    const sentimentContainer = document.getElementById('product-sentiment');
    if (sentimentContainer && product.reviews) {
        sentimentContainer.innerHTML = sentimentWidget.generateSentimentSummary(product);
    }

    // Add sustainability score
    const sustainabilityContainer = document.getElementById('product-sustainability');
    if (sustainabilityContainer) {
        sustainabilityContainer.innerHTML = sustainabilityWidget.generateSustainabilityBadge(product);
    }

    // Add inventory alert
    const inventoryContainer = document.getElementById('product-inventory-alert');
    if (inventoryContainer) {
        inventoryContainer.innerHTML = inventoryAlertWidget.generateInventoryAlert(product);
    }

    // Add style bundle
    const bundleContainer = document.getElementById('product-style-bundle');
    if (bundleContainer) {
        const bundle = aiEngine.generateStyleBundle(productId, products);
        if (bundle.length > 0) {
            bundleContainer.innerHTML = styleAdvisorWidget.generateStyleBundle(bundle);
        }
    }

    // Add similar products (visual search)
    const similarContainer = document.getElementById('product-similar');
    if (similarContainer) {
        const similar = aiEngine.findSimilarByVisualFeatures(productId, products);
        if (similar.length > 0) {
            similarContainer.innerHTML = `
                <div class="container">
                    <h3 class="section-title">Similar Products</h3>
                    <div class="products-grid">
                        ${similar.slice(0, 4).map(product => `
                            <article class="product-card" data-product-id="${product.id}">
                                <div class="product-image-container">
                                    <img src="${product.image}" alt="${product.name}" />
                                </div>
                                <div class="product-content">
                                    <h3 class="product-name">${product.name}</h3>
                                    <span class="product-price">$${product.price}</span>
                                </div>
                            </article>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }

    // Load recommendations
    loadProductRecommendations(productId);
}

// ============================================
// HOMEPAGE ENHANCEMENTS
// ============================================
function enhanceHomepage() {
    // Add personalized recommendations section on homepage
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        // Get most recently viewed categories
        const recommendedProducts = products.filter(p => 
            aiEngine.userProfile.viewedCategories.includes(p.category)
        ).slice(0, 4);

        if (recommendedProducts.length > 0) {
            const section = document.createElement('section');
            section.className = 'personalized-recommendations';
            section.style.cssText = `
                padding: var(--space-32) 0;
                background: var(--color-cream);
            `;
            section.innerHTML = `
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">Your Personalized Picks</h2>
                        <p class="section-description">Based on your browsing history</p>
                    </div>
                    <div id="personalized-products" class="products-grid"></div>
                </div>
            `;
            heroSection.parentElement.insertBefore(section, heroSection.nextElementSibling);
            recommendationWidget.renderRecommendations(recommendedProducts, 'personalized-products');
        }
    }
}

// ============================================
// PRODUCTS PAGE ENHANCEMENTS
// ============================================
function enhanceProductsPage() {
    // Add size fit advisor button
    const filterSection = document.querySelector('.filter-section') || document.querySelector('[class*="filter"]');
    if (filterSection) {
        const button = document.createElement('button');
        button.className = 'size-fit-btn';
        button.innerHTML = `
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16h.01M12 16h.01M16 16h.01M9 7h6m0 0V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v2m0 0H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V9a2 2 0 00-2-2h-1z"/>
            </svg>
            Size Finder
        `;
        button.onclick = openSizeFitAdvisor;
        button.style.cssText = `
            padding: var(--space-3) var(--space-4);
            background: var(--color-sage);
            color: white;
            border: none;
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: 600;
            font-size: var(--text-sm);
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: var(--space-4);
            transition: background var(--transition-fast);
        `;
        filterSection.insertBefore(button, filterSection.firstChild);
    }

    // Add dynamic pricing info tooltip for premium items
    const premiumProducts = document.querySelectorAll('[data-product-id]');
    premiumProducts.forEach(card => {
        const productId = card.getAttribute('data-product-id');
        const product = products.find(p => p.id === productId);
        if (product && product.price > 160) {
            const pricing = aiEngine.optimizePricing(product);
            if (pricing.discountPercent !== 0) {
                const badge = document.createElement('span');
                badge.className = 'pricing-optimization-badge';
                badge.textContent = pricing.discountPercent > 0 ? `Save ${Math.abs(pricing.discountPercent)}%` : 'Optimized Price';
                badge.style.cssText = `
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: #4CAF50;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 600;
                `;
                card.querySelector('.product-image-container')?.appendChild(badge);
            }
        }
    });
}

// ============================================
// PRODUCT CARDS ENHANCEMENT
// ============================================
function enhanceProductCard(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const card = document.querySelector(`[data-product-id="${productId}"]`);
    if (!card) return;

    // Add inventory alert badge
    const prediction = aiEngine.predictOutOfStock(product);
    if (prediction.alert) {
        const badge = document.createElement('span');
        badge.className = `inventory-badge inventory-badge-${prediction.urgency}`;
        badge.textContent = prediction.alert;
        badge.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            background: ${prediction.urgency === 'critical' ? '#EF4444' : '#F59E0B'};
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            z-index: 10;
        `;
        card.querySelector('.product-image-container')?.appendChild(badge);
    }

    // Add sentiment badge if reviews exist
    if (product.reviews && product.reviews.length > 0) {
        const summary = aiEngine.summarizeProductReviews(product.reviews);
        const sentiment = summary.averageSentiment;
        const emoji = sentiment > 0.5 ? '😊' : sentiment > 0 ? '🙂' : '😐';
        
        const sentimentBadge = document.createElement('span');
        sentimentBadge.className = 'sentiment-badge';
        sentimentBadge.innerHTML = `${emoji} ${summary.positiveCount}/${summary.reviewCount}`;
        sentimentBadge.style.cssText = `
            position: absolute;
            bottom: 10px;
            right: 10px;
            background: white;
            padding: 6px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        `;
        card.querySelector('.product-image-container')?.appendChild(sentimentBadge);
    }
}

// ============================================
// CART PAGE ENHANCEMENTS
// ============================================
function enhanceCartPage() {
    // Add churn prevention recommendations
    const cartContainer = document.querySelector('[id*="cart"]');
    if (cartContainer) {
        // Predict at-risk behavior
        const userActivity = {
            lastPurchaseDate: parseInt(localStorage.getItem('woolflow-last-purchase')) || Date.now() - 180 * 24 * 60 * 60 * 1000,
            lastVisitDate: Date.now(),
            abandonedCartItems: cart.length,
            emailOpenRate: 0.3
        };

        const churnPrediction = aiEngine.predictChurnRisk(userActivity);
        if (churnPrediction.riskLevel === 'high') {
            const retentionOffer = document.createElement('div');
            retentionOffer.className = 'retention-offer';
            retentionOffer.style.cssText = `
                background: linear-gradient(135deg, var(--color-sage), var(--color-sage-dark));
                color: white;
                padding: var(--space-6);
                border-radius: var(--radius-lg);
                margin-bottom: var(--space-6);
                text-align: center;
            `;
            retentionOffer.innerHTML = `
                <h3>Special Offer Just For You! 🎁</h3>
                <p>Complete your purchase with 15% off today</p>
                <code style="background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px;">COMEBACK15</code>
            `;
            cartContainer.prepend(retentionOffer);
        }
    }
}

// ============================================
// ANALYTICS TRACKING
// ============================================
function trackAIInteraction(featureType, productId, action) {
    aiEngine.trackInteraction(featureType, productId, {
        action,
        timestamp: Date.now()
    });

    // Send to analytics endpoint (in production)
    if (ANALYTICS_CONFIG.trackingEnabled) {
        console.log(`[AI Analytics] ${featureType}: ${action} - Product: ${productId}`);
    }
}

// ============================================
// INITIALIZATION FUNCTION
// ============================================
function initializeAIFeatures() {
    console.log('🤖 Initializing WoolFlow AI Features...');

    // Initialize all AI features
    initializeSmartSearch();
    enhanceHomepage();

    // Enhance all product cards
    const productCards = document.querySelectorAll('[data-product-id]');
    productCards.forEach(card => {
        const productId = card.getAttribute('data-product-id');
        enhanceProductCard(productId);

        // Add click listeners for recommendation tracking
        card.addEventListener('click', () => {
            aiEngine.recordProductView(productId);
        });
    });

    // Add size fit advisor button to navigation
    const navActionsContainer = document.querySelector('.nav-actions');
    if (navActionsContainer) {
        const sizeBtn = document.createElement('button');
        sizeBtn.className = 'size-fit-nav-btn';
        sizeBtn.innerHTML = `
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
        `;
        sizeBtn.title = 'Find Your Size';
        sizeBtn.onclick = openSizeFitAdvisor;
        sizeBtn.style.cssText = `
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--color-charcoal);
            transition: color var(--transition-fast);
        `;
        sizeBtn.addEventListener('mouseover', () => sizeBtn.style.color = 'var(--color-sage)');
        sizeBtn.addEventListener('mouseout', () => sizeBtn.style.color = 'var(--color-charcoal)');
        navActionsContainer.insertBefore(sizeBtn, navActionsContainer.firstChild);
    }

    console.log('✅ AI Features initialized successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAIFeatures);
} else {
    initializeAIFeatures();
}

// Track cart additions for recommendations
const originalAddToCart = window.addToCart;
window.addToCart = function(productId, name, price, image) {
    trackAIInteraction('add_to_cart', productId, 'added');
    if (originalAddToCart) originalAddToCart(productId, name, price, image);
};

// Periodic update of user profile
setInterval(() => {
    aiEngine.saveUserProfile();
}, 60000); // Every minute
