// WoolFlow app bootstrap — wires partial features into full interactive flows

(function () {
    'use strict';

    if (typeof window.gtag !== 'function') {
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
    }

    window.showProductDetail = function (productId) {
        if (typeof openProductModal === 'function') openProductModal(productId);
    };

    let cartDiscountRate = parseFloat(localStorage.getItem('woolflow-discount-rate') || '0') || 0;

    window.getCartDiscountRate = () => cartDiscountRate;
    window.setCartDiscount = function (rate, code) {
        cartDiscountRate = rate;
        localStorage.setItem('woolflow-discount-rate', String(rate));
        localStorage.setItem('woolflow-discount-code', code || '');
        if (typeof updateOrderSummary === 'function') updateOrderSummary();
        if (typeof calculateCheckoutTotals === 'function') calculateCheckoutTotals();
    };

    const VALID_DISCOUNTS = { wool10: 0.10, first15: 0.15, natural20: 0.20, comeback15: 0.15, woolflow10: 0.10 };

    window.applyDiscount = function () {
        const input = document.getElementById('discount-code');
        if (!input) return;
        const code = input.value.trim().toLowerCase();
        if (VALID_DISCOUNTS[code]) {
            window.setCartDiscount(VALID_DISCOUNTS[code], code);
            showNotification(`Discount "${code.toUpperCase()}" applied — ${(VALID_DISCOUNTS[code] * 100)}% off`, 'success');
        } else if (code) {
            showNotification('Invalid discount code', 'error');
        }
    };

    window.calculateCartTotals = function () {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const discount = subtotal * cartDiscountRate;
        const afterDiscount = subtotal - discount;
        const tax = afterDiscount * 0.08;
        return { subtotal, discount, tax, total: afterDiscount + tax, afterDiscount };
    };

    function getNavActionsContainer() {
        return document.querySelector('.nav-actions')
            || document.querySelector('#cart-toggle')?.parentElement
            || document.querySelector('#dark-mode-toggle')?.parentElement
            || document.querySelector('nav .flex.items-center.space-x-6')
            || document.querySelector('nav .flex.items-center.space-x-4')
            || document.querySelector('nav .flex.items-center');
    }

    function injectSharedNav() {
        const navActions = getNavActionsContainer();
        if (!navActions || navActions.querySelector('.auth-nav-btn')) return;

        const authBtn = document.createElement('button');
        authBtn.type = 'button';
        authBtn.className = 'auth-nav-btn p-2 text-charcoal hover:text-sage transition-colors';
        authBtn.title = 'Account';
        authBtn.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>';
        authBtn.onclick = () => { if (typeof openAuthModal === 'function') openAuthModal(); };

        const compareBtn = document.createElement('button');
        compareBtn.type = 'button';
        compareBtn.className = 'compare-nav-btn relative p-2 text-charcoal hover:text-sage transition-colors';
        compareBtn.title = 'Compare products';
        compareBtn.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg><span id="compare-count" class="absolute -top-1 -right-1 bg-sage text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hidden">0</span>';
        compareBtn.onclick = () => { if (typeof openCompareModal === 'function') openCompareModal(); };

        const ordersBtn = document.createElement('button');
        ordersBtn.type = 'button';
        ordersBtn.className = 'orders-nav-btn p-2 text-charcoal hover:text-sage transition-colors';
        ordersBtn.title = 'Order history';
        ordersBtn.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>';
        ordersBtn.onclick = () => { if (typeof openOrderHistoryModal === 'function') openOrderHistoryModal(); };

        navActions.insertBefore(ordersBtn, navActions.firstChild);
        navActions.insertBefore(compareBtn, navActions.firstChild);
        navActions.insertBefore(authBtn, navActions.firstChild);
        if (typeof updateCompareDisplay === 'function') updateCompareDisplay();
    }

    function injectAuthModal() {
        if (document.getElementById('auth-modal')) return;
        document.body.insertAdjacentHTML('beforeend', `
            <div id="auth-modal" class="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50 hidden opacity-0 transition-opacity duration-300 flex items-center justify-center p-4">
                <div class="bg-warm-white rounded-2xl max-w-md w-full p-8 shadow-2xl" id="auth-modal-content">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-2xl font-bold text-charcoal" id="auth-title">Sign In</h3>
                        <button type="button" onclick="closeAuthModal()" class="p-2">&times;</button>
                    </div>
                    <form id="auth-form" onsubmit="handleAuthSubmit(event)">
                        <div id="signup-fields" class="hidden mb-4">
                            <input type="text" id="auth-name" class="w-full px-4 py-3 border rounded-xl mb-2" placeholder="Full name">
                        </div>
                        <input type="email" id="auth-email" required class="w-full px-4 py-3 border rounded-xl mb-4" placeholder="Email">
                        <input type="password" id="auth-password" required minlength="6" class="w-full px-4 py-3 border rounded-xl mb-4" placeholder="Password">
                        <button type="submit" id="auth-submit-btn" class="w-full py-3 bg-charcoal text-white rounded-full">Sign In</button>
                    </form>
                    <p class="mt-4 text-center text-sm"><span id="auth-toggle-text">Don't have an account?</span> <button type="button" onclick="toggleAuthMode()" id="auth-toggle-btn" class="text-sage">Sign Up</button></p>
                </div>
            </div>`);
    }

    function injectCompareModal() {
        if (document.getElementById('compare-modal')) return;
        document.body.insertAdjacentHTML('beforeend', `
            <div id="compare-modal" class="fixed inset-0 bg-black/50 opacity-0 invisible transition-all duration-300 z-[60] flex items-center justify-center p-4">
                <div class="bg-warm-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-2xl font-bold">Compare Products</h3>
                        <button type="button" onclick="closeCompareModal()">&times;</button>
                    </div>
                    <div id="compare-grid"></div>
                </div>
            </div>`);
    }

    function injectOrderHistoryModal() {
        if (document.getElementById('order-history-modal')) return;
        document.body.insertAdjacentHTML('beforeend', `
            <div id="order-history-modal" class="fixed inset-0 bg-black/50 opacity-0 invisible transition-all duration-300 z-[60] flex items-center justify-center p-4">
                <div class="bg-warm-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-2xl font-bold">Order History</h3>
                        <button type="button" onclick="closeOrderHistoryModal()">&times;</button>
                    </div>
                    <div id="order-history-list"></div>
                </div>
            </div>`);
    }

    window.openOrderHistoryModal = function () {
        const modal = document.getElementById('order-history-modal');
        if (!modal) return;
        if (typeof renderOrderHistory === 'function') renderOrderHistory();
        modal.classList.remove('opacity-0', 'invisible');
    };
    window.closeOrderHistoryModal = function () {
        document.getElementById('order-history-modal')?.classList.add('opacity-0', 'invisible');
    };
    window.closeCompareModal = function () {
        document.getElementById('compare-modal')?.classList.add('opacity-0', 'invisible');
    };

    window.completeOrder = function (orderExtra = {}) {
        const totals = window.calculateCartTotals();
        const order = saveOrder({
            items: [...cart],
            subtotal: totals.subtotal,
            discount: totals.discount,
            tax: totals.tax,
            total: totals.total,
            shipping: orderExtra.shipping || { name: 'Standard', cost: 0 },
            paymentMethod: orderExtra.paymentMethod || 'card'
        });
        localStorage.setItem('woolflow-last-purchase', String(Date.now()));
        cart = [];
        localStorage.setItem('woolflow-cart', JSON.stringify(cart));
        window.setCartDiscount(0, '');
        if (typeof updateCartDisplay === 'function') updateCartDisplay();
        return order;
    };

    function wireNewsletterForms() {
        document.querySelectorAll('[data-newsletter-form]').forEach(form => {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                if (typeof handleNewsletterSubmit === 'function') handleNewsletterSubmit(e);
            });
        });
    }

    function bootstrapApp() {
        if (typeof WoolFlowCatalog !== 'undefined') {
            products = WoolFlowCatalog.loadProductCatalog();
            filteredProducts = [...products];
        }
        injectSharedNav();
        injectAuthModal();
        injectCompareModal();
        injectOrderHistoryModal();
        wireNewsletterForms();
        if (typeof initializeProductionSystems === 'function') {
            try { initializeProductionSystems(); } catch (e) { console.warn('Production systems:', e); }
        }
        if (typeof CustomerSupportChat !== 'undefined' && !window.customerSupportChat) {
            window.customerSupportChat = new CustomerSupportChat();
        }
        if (document.getElementById('featured-products-grid') && typeof renderFeaturedProducts === 'function') {
            renderFeaturedProducts();
        }
        if (typeof updateCompareDisplay === 'function') updateCompareDisplay();
        if (typeof currentUser !== 'undefined' && currentUser && typeof updateUserDisplay === 'function') updateUserDisplay();
    }

    document.addEventListener('DOMContentLoaded', bootstrapApp);
})();
