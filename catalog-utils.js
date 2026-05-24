// WoolFlow catalog: normalize images, expand to 50 products, single load API

const WOOLFLOW_COLOR_IMAGES = {
    oat: 'resources/product-urban-oat.jpg',
    sage: 'resources/product-urban-sage.jpg',
    mist: 'resources/product-urban-mist.jpg',
    charcoal: 'resources/product-urban-charcoal.jpg',
    stone: 'resources/product-urban-oat.jpg',
    navy: 'resources/product-urban-charcoal.jpg',
    gray: 'resources/product-urban-mist.jpg',
    grey: 'resources/product-urban-mist.jpg',
    black: 'resources/product-urban-charcoal.jpg',
    white: 'resources/product-urban-mist.jpg',
    cream: 'resources/product-urban-oat.jpg',
    beige: 'resources/product-urban-oat.jpg',
    brown: 'resources/product-urban-sage.jpg',
    tan: 'resources/product-urban-oat.jpg',
    pink: 'resources/product-urban-mist.jpg',
    mauve: 'resources/product-urban-mist.jpg',
    khaki: 'resources/product-urban-sage.jpg',
    lime: 'resources/product-urban-sage.jpg',
    teal: 'resources/product-urban-sage.jpg',
    cyan: 'resources/product-urban-mist.jpg',
    blue: 'resources/product-urban-charcoal.jpg',
    red: 'resources/product-urban-charcoal.jpg',
    silver: 'resources/product-urban-mist.jpg',
    pearl: 'resources/product-urban-mist.jpg',
    ivory: 'resources/product-urban-oat.jpg',
    graphite: 'resources/product-urban-charcoal.jpg',
    default: 'resources/product-urban-oat.jpg'
};

function getImageForColor(color) {
    if (!color) return WOOLFLOW_COLOR_IMAGES.default;
    const key = String(color).toLowerCase().trim();
    return WOOLFLOW_COLOR_IMAGES[key] || WOOLFLOW_COLOR_IMAGES.default;
}

function getProductImagePath(product) {
    return `resources/products/${product.id}.jpg`;
}

function normalizeProduct(product) {
    const p = { ...product };
    const colorImage = getImageForColor(p.color);
    const dedicated = getProductImagePath(p);

    p.image = dedicated;
    p.images = [dedicated, colorImage];

    if (p.variants && p.variants.length) {
        p.variants = p.variants.map(v => ({
            ...v,
            image: `resources/products/${p.id}-${String(v.color).toLowerCase().replace(/\s+/g, '-')}.jpg`,
            price: v.price ?? p.price
        }));
        p.variants.forEach(v => {
            if (!v.image || v.image.includes('undefined')) {
                v.image = getImageForColor(v.color);
            }
        });
    }

    if (!p.sizes) p.sizes = [7, 8, 9, 10, 11, 12];
    if (!p.availableSizes) p.availableSizes = p.sizes.filter((_, i) => i < p.sizes.length - 1);
    if (!p.reviews) p.reviews = [];
    if (!p.rating) p.rating = 4.5;
    if (!p.reviewCount) p.reviewCount = p.reviews.length || Math.floor(Math.random() * 80) + 20;
    if (!p.tags) p.tags = [];
    if (!p.lowStockThreshold) p.lowStockThreshold = 5;

    const displayPrice = p.salePrice != null ? p.salePrice : p.price;
    p.displayPrice = displayPrice;

    return p;
}

function expandCatalogTo50(catalog) {
    const list = [...catalog];
    if (list.length >= 50) return list.slice(0, 50);

    const extras = [
        { name: 'Heritage Wool Loafer', category: 'casual', color: 'Brown', price: 142, subcategory: 'loafer' },
        { name: 'Summit Trail GTX', category: 'active', color: 'Sage', price: 188, subcategory: 'trail' },
        { name: 'Dockside Deck Shoe', category: 'casual', color: 'Navy', price: 136, subcategory: 'deck' },
        { name: 'Merino Moc', category: 'casual', color: 'Oat', price: 128, subcategory: 'moc' },
        { name: 'Pulse Trainer', category: 'active', color: 'Black', price: 164, subcategory: 'trainer' },
        { name: 'Alpine Ascent', category: 'active', color: 'Charcoal', price: 192, subcategory: 'hiking' },
        { name: 'Boardwalk Classic', category: 'urban', color: 'Stone', price: 152, subcategory: 'walker' },
        { name: 'Riverside Runner', category: 'urban', color: 'Mist', price: 146, subcategory: 'runner' },
        { name: 'Studio Slip', category: 'urban', color: 'White', price: 134, subcategory: 'slip-on' },
        { name: 'Park Jogger', category: 'active', color: 'Gray', price: 158, subcategory: 'jogger' },
        { name: 'Harvest Hiker', category: 'active', color: 'Teal', price: 176, subcategory: 'hiker' },
        { name: 'Sunday Stroll', category: 'casual', color: 'Khaki', price: 122, subcategory: 'casual' },
        { name: 'Night Owl', category: 'urban', color: 'Black', price: 162, subcategory: 'night' },
        { name: 'Polar Liner', category: 'winter', color: 'Pearl', price: 172, subcategory: 'liner', season: 'winter' },
        { name: 'Glacier Grip', category: 'winter', color: 'Blue', price: 198, subcategory: 'winter-boot', season: 'winter' },
        { name: 'Ember Wool Boot', category: 'winter', color: 'Charcoal', price: 186, subcategory: 'boot', season: 'winter' },
        { name: 'Cloudstep Lite', category: 'casual', color: 'White', price: 118, subcategory: 'lite' }
    ];

    extras.forEach((tpl, i) => {
        const id = `woolflow-extra-${i + 1}-${tpl.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        list.push(normalizeProduct({
            id,
            name: tpl.name,
            brand: 'WoolFlow',
            color: tpl.color,
            price: tpl.price,
            salePrice: null,
            category: tpl.category,
            subcategory: tpl.subcategory || 'general',
            image: getImageForColor(tpl.color),
            images: [getImageForColor(tpl.color)],
            description: `Premium merino wool ${tpl.name} — sustainable comfort for everyday wear.`,
            longDescription: `The ${tpl.name} combines natural wool performance with modern urban design.`,
            sizes: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
            availableSizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11],
            rating: 4.5 + (i % 5) * 0.1,
            reviewCount: 40 + i * 3,
            reviews: [
                { name: 'Alex T.', rating: 5, date: '2026-04-01', text: 'Incredibly comfortable and great quality wool.' }
            ],
            features: ['Merino Wool', 'Sustainable', 'Breathable'],
            variants: [{ color: tpl.color, price: tpl.price, stock: 30 }],
            stockBySize: { 7: 5, 8: 8, 9: 10, 10: 8, 11: 4 },
            lowStockThreshold: 5,
            tags: i % 3 === 0 ? ['new'] : [],
            season: tpl.season || 'all-season',
            gender: 'unisex'
        }));
    });

    return list.slice(0, 50);
}

function loadProductCatalog() {
    let catalog = [];
    if (typeof productsDatabase !== 'undefined' && productsDatabase.length) {
        catalog = productsDatabase;
    } else if (typeof productData !== 'undefined' && productData.length) {
        catalog = productData;
    }
    catalog = expandCatalogTo50(catalog.map(normalizeProduct));
    return catalog;
}

window.WoolFlowCatalog = {
    loadProductCatalog,
    normalizeProduct,
    getImageForColor,
    getProductImagePath
};
