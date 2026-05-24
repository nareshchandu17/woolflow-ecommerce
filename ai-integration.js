// AI Integration Module - Connects all AI features to the application

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
    if (message) sizeFitAdvisor.processInput(message);
}

function selectSearchResult(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        aiEngine.recordProductView(productId);
        showProductDetail(productId);
        const suggestions = document.getElementById('search-suggestions');
        if (suggestions) suggestions.classList.add('hidden');
    }
}

function initializeSmartSearch() {
    if (document.getElementById('smart-search')) return;
    if (document.getElementById('smart-search-input')) return;
    const container = smartSearch.initializeWidget(products);
    const nav = document.querySelector('.nav-container') || document.querySelector('nav');
    if (nav) nav.appendChild(container);
}

function loadProductRecommendations(productId) {
    const recommendations = aiEngine.generateRecommendations(productId, products, cart);
    const container = document.getElementById('recommendations-container');
    if (container && typeof recommendationWidget !== 'undefined') {
        recommendationWidget.renderRecommendations(recommendations, 'recommendations-container');
    }
    const grid = document.getElementById('recommendations-grid');
    if (grid && recommendations.length) {
        grid.innerHTML = recommendations.slice(0, 4).map(p => `
            <div class="recommendation-card cursor-pointer" onclick="openProductModal('${p.id}')">
                <img src="${p.image}" alt="${p.name}" class="w-full h-32 object-cover rounded-xl mb-2" onerror="this.src='resources/product-urban-oat.jpg'">
                <h4 class="font-medium text-charcoal">${p.name}</h4>
                <span class="text-sage font-semibold">$${p.salePrice != null ? p.salePrice : p.price}</span>
            </div>
        `).join('');
        document.getElementById('recommendations-section')?.classList.remove('hidden');
    }
}

function enhanceProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    aiEngine.recordProductView(productId);

    const sentimentContainer = document.getElementById('product-sentiment');
    if (sentimentContainer && product.reviews && typeof sentimentWidget !== 'undefined') {
        sentimentContainer.innerHTML = sentimentWidget.generateSentimentSummary(product);
    }

    const sustainabilityContainer = document.getElementById('product-sustainability');
    if (sustainabilityContainer && typeof sustainabilityWidget !== 'undefined') {
        sustainabilityContainer.innerHTML = sustainabilityWidget.generateSustainabilityBadge(product);
    }

    const inventoryContainer = document.getElementById('product-inventory-alert');
    if (inventoryContainer && typeof inventoryAlertWidget !== 'undefined') {
        inventoryContainer.innerHTML = inventoryAlertWidget.generateInventoryAlert(product);
    }

    const bundleContainer = document.getElementById('product-style-bundle');
    if (bundleContainer && typeof styleAdvisorWidget !== 'undefined') {
        const bundle = aiEngine.generateStyleBundle(productId, products);
        if (bundle.length > 0) {
            bundleContainer.innerHTML = styleAdvisorWidget.generateStyleBundle(bundle);
        }
    }

    const similarContainer = document.getElementById('product-similar');
    if (similarContainer) {
        const similar = aiEngine.findSimilarByVisualFeatures(productId, products);
        if (similar.length > 0) {
            similarContainer.innerHTML = `
                <h4 class="font-semibold text-charcoal mb-3">Similar Products</h4>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    ${similar.slice(0, 4).map(p => `
                        <article class="cursor-pointer" data-product-id="${p.id}" onclick="openProductModal('${p.id}')">
                            <img src="${p.image}" alt="${p.name}" class="w-full h-24 object-cover rounded-lg mb-2" onerror="this.src='resources/product-urban-oat.jpg'">
                            <p class="text-sm font-medium text-charcoal">${p.name}</p>
                            <p class="text-sm text-sage">$${p.price}</p>
                        </article>
                    `).join('')}
                </div>`;
        }
    }

    const pricingContainer = document.getElementById('product-dynamic-pricing');
    if (pricingContainer) {
        const pricing = aiEngine.optimizePricing(product);
        pricingContainer.innerHTML = `
            <div class="p-3 bg-sage/10 rounded-xl text-sm">
                <strong>AI Optimized Price:</strong> $${pricing.optimizedPrice}
                ${pricing.originalPrice !== pricing.optimizedPrice ? `<span class="line-through text-charcoal/50 ml-2">$${pricing.originalPrice}</span>` : ''}
            </div>`;
    }

    loadProductRecommendations(productId);
}

function enhanceHomepage() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection || document.getElementById('personalized-products-section')) return;

    const viewed = aiEngine.userProfile.viewedCategories || [];
    let recommendedProducts = viewed.length
        ? products.filter(p => viewed.includes(p.category)).slice(0, 4)
        : products.filter(p => p.tags && p.tags.includes('bestseller')).slice(0, 4);
    if (recommendedProducts.length < 4) recommendedProducts = products.slice(0, 4);

    const section = document.createElement('section');
    section.id = 'personalized-products-section';
    section.className = 'personalized-recommendations';
    section.style.cssText = 'padding: var(--space-32) 0; background: var(--color-cream);';
    section.innerHTML = `
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Recommended For You</h2>
                <p class="section-description">Powered by WoolFlow AI</p>
            </div>
            <div id="personalized-products" class="products-grid"></div>
        </div>`;
    const anchor = document.querySelector('.products-section') || heroSection;
    anchor.parentElement.insertBefore(section, anchor.nextSibling);
    if (typeof recommendationWidget !== 'undefined') {
        recommendationWidget.renderRecommendations(recommendedProducts, 'personalized-products');
    }
}

function enhanceProductsPage() {
    const filterSection = document.querySelector('aside') || document.querySelector('.filter-section');
    if (filterSection && !filterSection.querySelector('.size-fit-btn')) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'size-fit-btn w-full mb-4';
        button.innerHTML = '&#128207; Size Finder (AI)';
        button.onclick = openSizeFitAdvisor;
        button.style.cssText = 'padding:12px;background:var(--color-sage);color:#fff;border:none;border-radius:12px;font-weight:600;cursor:pointer';
        filterSection.insertBefore(button, filterSection.firstChild);
    }

    document.querySelectorAll('article[data-product-id], .product-card[data-product-id]').forEach(card => {
        const productId = card.getAttribute('data-product-id');
        const product = products.find(p => p.id === productId);
        if (!product) return;
        const pricing = aiEngine.optimizePricing(product);
        if (product.price > 140 && !card.querySelector('.pricing-optimization-badge')) {
            const badge = document.createElement('span');
            badge.className = 'pricing-optimization-badge';
            badge.textContent = pricing.discountPercent ? `Save ${Math.abs(pricing.discountPercent)}%` : 'AI Price';
            badge.style.cssText = 'position:absolute;top:10px;right:10px;background:#4CAF50;color:#fff;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600;z-index:5';
            (card.querySelector('.product-image-container') || card.querySelector('.relative') || card).appendChild(badge);
        }
    });
}

function enhanceProductCard(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const card = document.querySelector(`article[data-product-id="${productId}"], .product-card[data-product-id="${productId}"]`);
    if (!card) return;

    const imgWrap = card.querySelector('.product-image-container') || card.querySelector('.relative') || card;

    if (!card.querySelector('.inventory-badge')) {
        const prediction = aiEngine.predictOutOfStock(product);
        if (prediction.alert) {
            const badge = document.createElement('span');
            badge.className = `inventory-badge inventory-badge-${prediction.urgency}`;
            badge.textContent = prediction.alert;
            badge.style.cssText = `position:absolute;top:10px;left:10px;background:${prediction.urgency === 'critical' ? '#EF4444' : '#F59E0B'};color:#fff;padding:6px 10px;border-radius:4px;font-size:11px;font-weight:600;z-index:10`;
            imgWrap.style.position = 'relative';
            imgWrap.appendChild(badge);
        }
    }

    if (product.reviews && product.reviews.length && !card.querySelector('.sentiment-badge')) {
        const summary = aiEngine.summarizeProductReviews(product.reviews);
        const emoji = summary.averageSentiment > 0.5 ? '😊' : summary.averageSentiment > 0 ? '🙂' : '😐';
        const sentimentBadge = document.createElement('span');
        sentimentBadge.className = 'sentiment-badge';
        sentimentBadge.textContent = `${emoji} ${summary.positiveCount}/${summary.reviewCount}`;
        sentimentBadge.style.cssText = 'position:absolute;bottom:10px;right:10px;background:#fff;padding:4px 8px;border-radius:20px;font-size:11px;font-weight:600;box-shadow:0 2px 8px rgba(0,0,0,0.1);z-index:10';
        imgWrap.appendChild(sentimentBadge);
    }

    if (!card.querySelector('.compare-card-btn')) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'compare-card-btn';
        btn.title = 'Compare';
        btn.textContent = '⇄';
        btn.style.cssText = 'position:absolute;bottom:10px;left:10px;width:28px;height:28px;border-radius:50%;background:#fff;border:1px solid #ddd;cursor:pointer;z-index:10';
        btn.onclick = (e) => { e.stopPropagation(); toggleCompare(productId); };
        imgWrap.appendChild(btn);
    }
}

function enhanceCartPage() {
    if (document.querySelector('.retention-offer')) return;

    const userActivity = {
        lastPurchaseDate: parseInt(localStorage.getItem('woolflow-last-purchase')) || Date.now() - 180 * 24 * 60 * 60 * 1000,
        lastVisitDate: Date.now(),
        abandonedCartItems: cart.length,
        emailOpenRate: 0.3
    };

    const churnPrediction = aiEngine.predictChurnRisk(userActivity);
    const target = document.getElementById('cart-items-list')?.parentElement || document.querySelector('main');
    if (!target) return;

    if (churnPrediction.riskLevel === 'high' || cart.length > 0) {
        const retentionOffer = document.createElement('div');
        retentionOffer.className = 'retention-offer';
        retentionOffer.style.cssText = 'background:linear-gradient(135deg,#9BA894,#7a8a72);color:#fff;padding:1.5rem;border-radius:12px;margin-bottom:1.5rem;text-align:center';
        retentionOffer.innerHTML = `
            <h3 class="font-bold mb-2">${churnPrediction.riskLevel === 'high' ? 'We miss you! 🎁' : 'Complete your order'}</h3>
            <p class="mb-2 text-sm opacity-90">Use code <code class="bg-white/20 px-2 py-1 rounded">COMEBACK15</code> for 15% off</p>
            <button type="button" onclick="document.getElementById('discount-code').value='comeback15'; applyDiscount();" class="mt-2 px-4 py-2 bg-white text-charcoal rounded-full text-sm font-medium">Apply Offer</button>`;
        target.insertBefore(retentionOffer, target.firstChild);
    }
}

function trackAIInteraction(featureType, productId, action) {
    aiEngine.trackInteraction(featureType, productId, { action, timestamp: Date.now() });
    if (typeof ANALYTICS_CONFIG !== 'undefined' && ANALYTICS_CONFIG.trackingEnabled) {
        console.log(`[AI Analytics] ${featureType}: ${action}`);
    }
}

function initializeAIFeatures() {
    console.log('🤖 Initializing WoolFlow AI Features...');

    initializeSmartSearch();
    enhanceHomepage();

    if (window.location.pathname.includes('products.html')) {
        enhanceProductsPage();
    }
    if (window.location.pathname.includes('cart.html')) {
        enhanceCartPage();
    }

    document.querySelectorAll('article[data-product-id], .product-card[data-product-id]').forEach(card => {
        const productId = card.getAttribute('data-product-id');
        enhanceProductCard(productId);
        card.addEventListener('click', () => aiEngine.recordProductView(productId));
    });

    const navActionsContainer = document.querySelector('.nav-actions');
    if (navActionsContainer && !navActionsContainer.querySelector('.size-fit-nav-btn')) {
        const sizeBtn = document.createElement('button');
        sizeBtn.type = 'button';
        sizeBtn.className = 'size-fit-nav-btn';
        sizeBtn.title = 'Find Your Size';
        sizeBtn.innerHTML = '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>';
        sizeBtn.onclick = openSizeFitAdvisor;
        sizeBtn.style.cssText = 'background:none;border:none;cursor:pointer;padding:8px;color:var(--color-charcoal)';
        navActionsContainer.insertBefore(sizeBtn, navActionsContainer.firstChild);
    }

    console.log('✅ AI Features initialized');
}

function refreshAIFeatures() {
    document.querySelectorAll('article[data-product-id], .product-card[data-product-id]').forEach(card => {
        enhanceProductCard(card.getAttribute('data-product-id'));
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initializeAIFeatures, 300));
} else {
    setTimeout(initializeAIFeatures, 300);
}

const originalAddToCart = window.addToCart;
window.addToCart = function (productId, name, price, image, size) {
    trackAIInteraction('add_to_cart', productId, 'added');
    if (originalAddToCart) return originalAddToCart(productId, name, price, image, size);
};

setInterval(() => { if (typeof aiEngine !== 'undefined') aiEngine.saveUserProfile(); }, 60000);
