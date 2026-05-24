// QA script output for agent-browser eval on each page
(function setup() {
  if (!window.__qaSetup) {
    window.__qaSetup = true;
    window.__pageErrors = [];
    window.addEventListener('error', e => window.__pageErrors.push(e.message));
  }
})();

function pageReport() {
  return {
    url: location.href,
    products: typeof products !== 'undefined' ? products.length : null,
    featured: document.querySelectorAll('#featured-products-grid article, #featured-products-grid .product-card').length,
    grid: document.querySelectorAll('#products-grid article, #products-grid .product-card').length,
    wishlist: document.querySelectorAll('#wishlist-items .product-card, #wishlist-items article, #wishlist-items > div').length,
    cartItems: document.querySelectorAll('#cart-items-list > div').length,
    brokenImgs: Array.from(document.querySelectorAll('img')).filter(i => i.complete && i.naturalWidth === 0).map(i => i.src).slice(0, 5),
    errors: window.__pageErrors || [],
    sw: !!navigator.serviceWorker?.controller
  };
}
JSON.stringify(pageReport());
