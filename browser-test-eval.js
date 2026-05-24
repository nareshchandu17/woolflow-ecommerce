// Collect page diagnostics - injected via agent-browser eval
(function () {
  window.__pageErrors = window.__pageErrors || [];
  const report = {
    url: location.href,
    path: location.pathname,
    productsCount: typeof products !== 'undefined' ? products.length : null,
    cartCount: typeof cart !== 'undefined' ? cart.length : null,
    featuredCount: document.querySelectorAll('#featured-products-grid .product-card, #featured-products-grid article').length,
    gridCount: document.querySelectorAll('#products-grid .product-card, #products-grid article').length,
    hasAuthBtn: !!document.querySelector('.auth-nav-btn'),
    hasCompareBtn: !!document.querySelector('.compare-nav-btn'),
    hasOrdersBtn: !!document.querySelector('.orders-nav-btn'),
    hasChat: !!document.getElementById('chat-widget'),
    hasProductModal: !!document.getElementById('product-modal'),
    hasCompareModal: !!document.getElementById('compare-modal'),
    hasOrderModal: !!document.getElementById('order-history-modal'),
    hasSizeAdvisor: !!document.getElementById('size-fit-advisor'),
    aiEngine: typeof aiEngine !== 'undefined',
    brokenImages: Array.from(document.querySelectorAll('img')).filter(img => img.complete && img.naturalWidth === 0).length,
    consoleErrors: window.__pageErrors
  };
  return JSON.stringify(report, null, 2);
})();
