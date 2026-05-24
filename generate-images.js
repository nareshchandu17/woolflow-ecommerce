const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ctx = { global: {} };
vm.runInThisContext(
    fs.readFileSync('products-database.js', 'utf8').replace('const productsDatabase', 'var productsDatabase')
);
const catalogUtils = fs.readFileSync('catalog-utils.js', 'utf8').replace(/window\.WoolFlowCatalog/g, 'global.WoolFlowCatalog');
vm.runInThisContext(catalogUtils);

const COLOR_FILES = {
    oat: 'product-urban-oat.jpg', sage: 'product-urban-sage.jpg', mist: 'product-urban-mist.jpg',
    charcoal: 'product-urban-charcoal.jpg', stone: 'product-urban-oat.jpg', navy: 'product-urban-charcoal.jpg',
    gray: 'product-urban-mist.jpg', grey: 'product-urban-mist.jpg', black: 'product-urban-charcoal.jpg',
    white: 'product-urban-mist.jpg', cream: 'product-urban-oat.jpg', beige: 'product-urban-oat.jpg',
    brown: 'product-urban-sage.jpg', default: 'product-urban-oat.jpg'
};

function pickFile(color) {
    return COLOR_FILES[String(color || 'default').toLowerCase()] || COLOR_FILES.default;
}

const catalog = global.WoolFlowCatalog.loadProductCatalog();
const outDir = path.join('resources', 'products');
fs.mkdirSync(outDir, { recursive: true });

let count = 0;
catalog.forEach(p => {
    const src = path.join('resources', pickFile(p.color));
    const dest = path.join(outDir, `${p.id}.jpg`);
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        count++;
    }
});
console.log(`Generated ${count} product images (${catalog.length} products in catalog)`);
