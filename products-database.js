// WoolFlow Products Database - 50+ Premium Merino Wool Sneakers
// Organized by category with full details, variants, and inventory

const productsDatabase = [
    // ============================================
    // URBAN COLLECTION (8 products)
    // ============================================
    {
        id: 'urban-runner-oat',
        name: 'Urban Wool Runner',
        brand: 'WoolFlow',
        color: 'Oat',
        price: 149,
        salePrice: null,
        category: 'urban',
        subcategory: 'runner',
        image: 'resources/product-urban-oat.jpg',
        images: ['resources/product-urban-oat.jpg', 'resources/product-urban-oat.jpg'],
        description: 'Premium merino wool sneakers with temperature regulation and moisture-wicking technology. Perfect for daily urban adventures with responsive cushioning.',
        longDescription: 'Experience the perfect harmony of style and comfort with our Urban Wool Runner. Crafted from 100% premium merino wool, these sneakers feature advanced temperature regulation that keeps your feet comfortable in any season. The responsive cushioning system absorbs impact while maintaining a lightweight feel.',
        sizes: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13],
        availableSizes: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11],
        rating: 4.8,
        reviewCount: 124,
        reviews: [
            { name: 'Sarah M.', rating: 5, date: '2026-04-15', text: 'Best sneakers I\'ve ever owned! So comfortable and stylish. Perfect for my daily commute.' },
            { name: 'James K.', rating: 5, date: '2026-04-10', text: 'Amazing quality and the wool really does regulate temperature. Worth every penny.' },
            { name: 'Emily R.', rating: 4, date: '2026-03-28', text: 'Love the design and comfort. Runs slightly small so order a half size up.' }
        ],
        features: ['Merino Wool', 'Temperature Regulating', 'Moisture Wicking', 'Responsive Cushioning', 'Lightweight'],
        variants: [
            { color: 'Oat', price: 149, stock: 45 },
            { color: 'Sage', price: 149, stock: 32 },
            { color: 'Charcoal', price: 159, stock: 28 },
            { color: 'Mist', price: 149, stock: 15 }
        ],
        stockBySize: {
            6.5: 5, 7: 8, 7.5: 6, 8: 12, 8.5: 10, 9: 15, 9.5: 12, 10: 10, 10.5: 8, 11: 0
        },
        lowStockThreshold: 5,
        tags: ['bestseller', 'popular'],
        season: 'all-season',
        gender: 'unisex'
    },
    {
        id: 'city-trekker-sage',
        name: 'City Trekker Pro',
        brand: 'WoolFlow',
        color: 'Sage',
        price: 169,
        salePrice: 149,
        category: 'urban',
        subcategory: 'trekker',
        image: 'resources/product-urban-sage.jpg',
        images: ['resources/product-urban-sage.jpg'],
        description: 'All-terrain wool sneakers with enhanced grip and waterproof protection. Built for city exploration and unpredictable weather.',
        longDescription: 'Navigate any urban terrain with confidence. The City Trekker Pro features enhanced grip technology and waterproof wool treatment, perfect for exploring the city in any weather condition.',
        sizes: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13],
        availableSizes: [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
        rating: 4.6,
        reviewCount: 89,
        reviews: [
            { name: 'Michael T.', rating: 5, date: '2026-04-20', text: 'Great grip and waterproof! Perfect for rainy days in the city.' },
            { name: 'Lisa W.', rating: 4, date: '2026-04-05', text: 'Excellent build quality. Very durable and comfortable.' }
        ],
        features: ['Enhanced Grip', 'Waterproof', 'All-Terrain', 'Durable'],
        variants: [
            { color: 'Sage', price: 169, stock: 30 },
            { color: 'Olive', price: 169, stock: 25 },
            { color: 'Stone', price: 179, stock: 18 }
        ],
        stockBySize: {
            8: 8, 8.5: 7, 9: 10, 9.5: 8, 10: 6, 10.5: 5, 11: 3, 11.5: 2, 12: 1
        },
        lowStockThreshold: 5,
        tags: ['sale'],
        season: 'all-season',
        gender: 'unisex'
    },
    {
        id: 'street-walker-charcoal',
        name: 'Street Walker Classic',
        brand: 'WoolFlow',
        color: 'Charcoal',
        price: 159,
        salePrice: null,
        category: 'urban',
        subcategory: 'walker',
        image: 'resources/product-urban-charcoal.jpg',
        images: ['resources/product-urban-charcoal.jpg'],
        description: 'Classic design with modern wool technology. Timeless silhouette meets contemporary comfort.',
        longDescription: 'The Street Walker Classic combines timeless design with modern wool technology. Perfect for those who appreciate understated elegance and superior comfort.',
        sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13, 14],
        availableSizes: [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
        rating: 4.7,
        reviewCount: 156,
        reviews: [
            { name: 'Robert H.', rating: 5, date: '2026-04-22', text: 'Classic look with modern comfort. These have become my daily drivers!' },
            { name: 'Jennifer C.', rating: 5, date: '2026-04-12', text: 'Got these for my husband and he loves them. Great quality and style.' }
        ],
        features: ['Classic Design', 'Modern Comfort', 'Versatile'],
        variants: [
            { color: 'Charcoal', price: 159, stock: 40 },
            { color: 'Black', price: 159, stock: 35 },
            { color: 'Navy', price: 159, stock: 25 }
        ],
        stockBySize: {
            8: 10, 8.5: 8, 9: 12, 9.5: 10, 10: 8, 10.5: 6, 11: 5, 11.5: 3, 12: 2
        },
        lowStockThreshold: 5,
        tags: ['bestseller'],
        season: 'all-season',
        gender: 'unisex'
    },
    {
        id: 'metro-slip-on-mist',
        name: 'Metro Slip-On',
        brand: 'WoolFlow',
        color: 'Mist',
        price: 129,
        salePrice: null,
        category: 'urban',
        subcategory: 'slip-on',
        image: 'resources/product-urban-mist.jpg',
        images: ['resources/product-urban-mist.jpg'],
        description: 'Effortless style meets comfort in these easy-wear wool slip-ons. Perfect for quick outings.',
        longDescription: 'No laces, no hassle. The Metro Slip-On provides instant comfort and style without any fuss. Slip them on and go.',
        sizes: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
        availableSizes: [7, 7.5, 8, 8.5, 9, 9.5, 10],
        rating: 4.5,
        reviewCount: 67,
        reviews: [
            { name: 'David L.', rating: 5, date: '2026-04-18', text: 'Love these slip-ons! So easy to put on and incredibly comfortable.' },
            { name: 'Anna P.', rating: 4, date: '2026-03-30', text: 'Perfect for casual Fridays at work. Lightweight and breathable.' }
        ],
        features: ['Slip-On Design', 'Easy Wear', 'Lightweight'],
        variants: [
            { color: 'Mist', price: 129, stock: 35 },
            { color: 'Cream', price: 129, stock: 28 },
            { color: 'Taupe', price: 129, stock: 20 }
        ],
        stockBySize: {
            7: 8, 7.5: 6, 8: 9, 8.5: 8, 9: 10, 9.5: 7, 10: 5
        },
        lowStockThreshold: 5,
        tags: [],
        season: 'all-season',
        gender: 'unisex'
    },
    {
        id: 'commuter-classic-oat',
        name: 'Commuter Classic',
        brand: 'WoolFlow',
        color: 'Oat',
        price: 139,
        salePrice: null,
        category: 'urban',
        subcategory: 'commuter',
        image: 'resources/product-urban-oat.jpg',
        images: ['resources/product-urban-oat.jpg'],
        description: 'Perfect for daily commutes. Superior comfort meets professional style.',
        longDescription: 'Designed specifically for your daily commute. Walk to the station, take the train, get to work – stay comfortable the entire way.',
        sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13],
        availableSizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11],
        rating: 4.6,
        reviewCount: 95,
        reviews: [],
        features: ['Professional Style', 'All-Day Comfort', 'Durable'],
        variants: [
            { color: 'Oat', price: 139, stock: 42 },
            { color: 'Gray', price: 139, stock: 38 },
            { color: 'Brown', price: 139, stock: 30 }
        ],
        stockBySize: {
            7: 9, 7.5: 7, 8: 11, 8.5: 9, 9: 12, 9.5: 10, 10: 8, 10.5: 6, 11: 3
        },
        lowStockThreshold: 5,
        tags: [],
        season: 'all-season',
        gender: 'unisex'
    },
    {
        id: 'downtown-dapper-navy',
        name: 'Downtown Dapper',
        brand: 'WoolFlow',
        color: 'Navy',
        price: 179,
        salePrice: null,
        category: 'urban',
        subcategory: 'casual',
        image: 'resources/product-urban-oat.jpg',
        images: ['resources/product-urban-oat.jpg'],
        description: 'Premium urban sneaker with sophisticated styling. Dress up or down with ease.',
        longDescription: 'Elevate your urban style with the Downtown Dapper. Perfect for casual Friday or weekend outings with elevated design.',
        sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13],
        availableSizes: [8, 8.5, 9, 9.5, 10, 10.5, 11],
        rating: 4.9,
        reviewCount: 48,
        reviews: [],
        features: ['Sophisticated Design', 'Versatile', 'Premium Feel'],
        variants: [
            { color: 'Navy', price: 179, stock: 28 },
            { color: 'Burgundy', price: 179, stock: 22 },
            { color: 'Forest', price: 179, stock: 18 }
        ],
        stockBySize: {
            8: 6, 8.5: 5, 9: 7, 9.5: 6, 10: 5, 10.5: 4, 11: 3
        },
        lowStockThreshold: 5,
        tags: ['new'],
        season: 'all-season',
        gender: 'unisex'
    },
    {
        id: 'uptown-urban-stone',
        name: 'Uptown Urban',
        brand: 'WoolFlow',
        color: 'Stone',
        price: 154,
        salePrice: null,
        category: 'urban',
        subcategory: 'runner',
        image: 'resources/product-urban-mist.jpg',
        images: ['resources/product-urban-mist.jpg'],
        description: 'Modern urban sneaker with minimalist aesthetic. Clean lines, maximum comfort.',
        longDescription: 'Embrace minimalism with the Uptown Urban. Designed for those who prefer understated elegance with zero compromise on comfort.',
        sizes: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
        availableSizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5],
        rating: 4.7,
        reviewCount: 72,
        reviews: [],
        features: ['Minimalist Design', 'Clean Aesthetic', 'Comfortable'],
        variants: [
            { color: 'Stone', price: 154, stock: 35 },
            { color: 'Beige', price: 154, stock: 30 },
            { color: 'Khaki', price: 154, stock: 25 }
        ],
        stockBySize: {
            7: 7, 7.5: 6, 8: 8, 8.5: 7, 9: 9, 9.5: 8, 10: 6, 10.5: 5, 11: 4, 11.5: 2
        },
        lowStockThreshold: 5,
        tags: [],
        season: 'all-season',
        gender: 'unisex'
    },
    {
        id: 'vibe-check-graphite',
        name: 'Vibe Check',
        brand: 'WoolFlow',
        color: 'Graphite',
        price: 144,
        salePrice: null,
        category: 'urban',
        subcategory: 'casual',
        image: 'resources/product-urban-charcoal.jpg',
        images: ['resources/product-urban-charcoal.jpg'],
        description: 'Contemporary urban sneaker with attitude. Express yourself with every step.',
        longDescription: 'Make a statement with the Vibe Check. Contemporary styling meets wool comfort in this attitude-forward urban sneaker.',
        sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13],
        availableSizes: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5],
        rating: 4.6,
        reviewCount: 55,
        reviews: [],
        features: ['Contemporary Style', 'Attitude Forward', 'Comfortable'],
        variants: [
            { color: 'Graphite', price: 144, stock: 40 },
            { color: 'Slate', price: 144, stock: 35 }
        ],
        stockBySize: {
            6.5: 4, 7: 6, 7.5: 5, 8: 8, 8.5: 7, 9: 9, 9.5: 8, 10: 6, 10.5: 5, 11: 3, 11.5: 2
        },
        lowStockThreshold: 5,
        tags: [],
        season: 'all-season',
        gender: 'unisex'
    },

    // ============================================
    // ACTIVE COLLECTION (10 products)
    // ============================================
    {
        id: 'trail-blazer-sage',
        name: 'Trail Blazer',
        brand: 'WoolFlow',
        color: 'Sage',
        price: 179,
        salePrice: null,
        category: 'active',
        subcategory: 'trail',
        image: 'resources/product-urban-sage.jpg',
        images: ['resources/product-urban-sage.jpg'],
        description: 'Rugged wool sneakers designed for outdoor adventures. Enhanced grip and durability for trail exploration.',
        longDescription: 'Hit the trails with confidence. The Trail Blazer features enhanced grip, reinforced durability, and responsive cushioning for off-road exploration.',
        sizes: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13],
        availableSizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
        rating: 4.8,
        reviewCount: 103,
        reviews: [
            { name: 'Chris M.', rating: 5, date: '2026-04-25', text: 'Perfect for hiking! Grip is excellent and my feet stayed dry.' }
        ],
        features: ['Enhanced Grip', 'Rugged', 'Trail Ready', 'Durable'],
        variants: [
            { color: 'Sage', price: 179, stock: 30 },
            { color: 'Forest', price: 179, stock: 25 },
            { color: 'Moss', price: 179, stock: 20 }
        ],
        stockBySize: {
            7: 6, 7.5: 5, 8: 8, 8.5: 7, 9: 9, 9.5: 8, 10: 6, 10.5: 5, 11: 4, 11.5: 3, 12: 2
        },
        lowStockThreshold: 5,
        tags: ['bestseller', 'popular'],
        season: 'all-season',
        gender: 'unisex'
    },
    {
        id: 'power-runner-white',
        name: 'Power Runner Pro',
        brand: 'WoolFlow',
        color: 'White',
        price: 169,
        salePrice: 149,
        category: 'active',
        subcategory: 'runner',
        image: 'resources/product-urban-oat.jpg',
        images: ['resources/product-urban-oat.jpg'],
        description: 'High-performance running sneaker engineered for speed and endurance. Lightning-fast responsiveness.',
        longDescription: 'For runners who demand performance. The Power Runner Pro features responsive foam and breathable wool construction.',
        sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13, 14],
        availableSizes: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13],
        rating: 4.9,
        reviewCount: 187,
        reviews: [
            { name: 'Marathon Mike', rating: 5, date: '2026-04-23', text: 'Best running shoes I\'ve owned. Ran a half marathon and my feet felt great!' }
        ],
        features: ['High Performance', 'Responsive', 'Lightweight', 'Fast'],
        variants: [
            { color: 'White', price: 169, stock: 50 },
            { color: 'Black', price: 169, stock: 45 },
            { color: 'Gray', price: 169, stock: 38 }
        ],
        stockBySize: {
            6.5: 6, 7: 8, 7.5: 7, 8: 11, 8.5: 10, 9: 12, 9.5: 11, 10: 9, 10.5: 8, 11: 6, 11.5: 4, 12: 3, 13: 1
        },
        lowStockThreshold: 5,
        tags: ['sale', 'popular'],
        season: 'spring',
        gender: 'unisex'
    },
    {
        id: 'gym-flex-black',
        name: 'Gym Flex',
        brand: 'WoolFlow',
        color: 'Black',
        price: 159,
        salePrice: null,
        category: 'active',
        subcategory: 'gym',
        image: 'resources/product-urban-charcoal.jpg',
        images: ['resources/product-urban-charcoal.jpg'],
        description: 'Flexible sneaker perfect for gym sessions and workouts. Responsive support for lateral movements.',
        longDescription: 'Built for the gym. The Gym Flex provides lateral support and responsive cushioning for all your workout needs.',
        sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13],
        availableSizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
        rating: 4.7,
        reviewCount: 76,
        reviews: [],
        features: ['Gym Ready', 'Lateral Support', 'Flexible'],
        variants: [
            { color: 'Black', price: 159, stock: 44 },
            { color: 'White', price: 159, stock: 35 },
            { color: 'Navy', price: 159, stock: 30 }
        ],
        stockBySize: {
            7: 8, 7.5: 7, 8: 10, 8.5: 9, 9: 11, 9.5: 9, 10: 7, 10.5: 6, 11: 5, 11.5: 3, 12: 2
        },
        lowStockThreshold: 5,
        tags: [],
        season: 'all-season',
        gender: 'unisex'
    },
    {
        id: 'sprint-elite-silver',
        name: 'Sprint Elite',
        brand: 'WoolFlow',
        color: 'Silver',
        price: 189,
        salePrice: null,
        category: 'active',
        subcategory: 'performance',
        image: 'resources/product-urban-mist.jpg',
        images: ['resources/product-urban-mist.jpg'],
        description: 'Elite performance runner for competitive athletes. Maximum responsiveness and minimal weight.',
        longDescription: 'For serious athletes. The Sprint Elite features advanced wool technology for peak performance.',
        sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13],
        availableSizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5],
        rating: 4.9,
        reviewCount: 42,
        reviews: [],
        features: ['Elite Performance', 'Minimal Weight', 'Advanced Technology'],
        variants: [
            { color: 'Silver', price: 189, stock: 25 },
            { color: 'Gold', price: 189, stock: 20 }
        ],
        stockBySize: {
            7: 4, 7.5: 3, 8: 5, 8.5: 4, 9: 6, 9.5: 5, 10: 4, 10.5: 3, 11: 2, 11.5: 1
        },
        lowStockThreshold: 5,
        tags: ['premium'],
        season: 'all-season',
        gender: 'unisex'
    },
    {
        id: 'peak-performance-red',
        name: 'Peak Performance',
        brand: 'WoolFlow',
        color: 'Red',
        price: 174,
        salePrice: null,
        category: 'active',
        subcategory: 'sports',
        image: 'resources/product-urban-oat.jpg',
        images: ['resources/product-urban-oat.jpg'],
        description: 'Sports sneaker engineered for maximum performance. Responsive cushioning with breathable wool.',
        longDescription: 'Reach your peak. The Peak Performance sneaker delivers responsive cushioning and breathable construction.',
        sizes: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
        availableSizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11],
        rating: 4.8,
        reviewCount: 64,
        reviews: [],
        features: ['Performance Ready', 'Responsive', 'Breathable'],
        variants: [
            { color: 'Red', price: 174, stock: 32 },
            { color: 'Blue', price: 174, stock: 28 },
            { color: 'Orange', price: 174, stock: 24 }
        ],
        stockBySize: {
            7: 6, 7.5: 5, 8: 7, 8.5: 6, 9: 8, 9.5: 7, 10: 5, 10.5: 4, 11: 3
        },
        lowStockThreshold: 5,
        tags: [],
        season: 'all-season',
        gender: 'unisex'
    },
    {
        id: 'endurance-extreme-teal',
        name: 'Endurance Extreme',
        brand: 'WoolFlow',
        color: 'Teal',
        price: 184,
        salePrice: null,
        category: 'active',
        subcategory: 'endurance',
        image: 'resources/product-urban-sage.jpg',
        images: ['resources/product-urban-sage.jpg'],
        description: 'Marathon-ready sneaker for long-distance runners. Engineered for endurance and comfort.',
        longDescription: 'Go the distance. The Endurance Extreme is specifically engineered for marathon runners.',
        sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13],
        availableSizes: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5],
        rating: 4.9,
        reviewCount: 58,
        reviews: [],
        features: ['Endurance Ready', 'Marathon Built', 'Long Distance'],
        variants: [
            { color: 'Teal', price: 184, stock: 28 },
            { color: 'Purple', price: 184, stock: 22 }
        ],
        stockBySize: {
            6.5: 3, 7: 5, 7.5: 4, 8: 6, 8.5: 5, 9: 7, 9.5: 6, 10: 5, 10.5: 3, 11: 2, 11.5: 1
        },
        lowStockThreshold: 5,
        tags: ['new'],
        season: 'all-season',
        gender: 'unisex'
    },
    {
        id: 'swift-striker-lime',
        name: 'Swift Striker',
        brand: 'WoolFlow',
        color: 'Lime',
        price: 164,
        salePrice: null,
        category: 'active',
        subcategory: 'sports',
        image: 'resources/product-urban-mist.jpg',
        images: ['resources/product-urban-mist.jpg'],
        description: 'Fast-paced sports sneaker for athletes on the go. Quick response and agile support.',
        longDescription: 'Move fast. The Swift Striker features quick response and agile support for high-impact sports.',
        sizes: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
        availableSizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11],
        rating: 4.7,
        reviewCount: 47,
        reviews: [],
        features: ['Fast Response', 'Agile Support', 'Athletic'],
        variants: [
            { color: 'Lime', price: 164, stock: 30 },
            { color: 'Electric', price: 164, stock: 25 }
        ],
        stockBySize: {
            7: 5, 7.5: 4, 8: 6, 8.5: 5, 9: 7, 9.5: 6, 10: 5, 10.5: 4, 11: 3
        },
        lowStockThreshold: 5,
        tags: [],
        season: 'summer',
        gender: 'unisex'
    },
    {
        id: 'velocity-victor-cyan',
        name: 'Velocity Victor',
        brand: 'WoolFlow',
        color: 'Cyan',
        price: 179,
        salePrice: null,
        category: 'active',
        subcategory: 'performance',
        image: 'resources/product-urban-oat.jpg',
        images: ['resources/product-urban-oat.jpg'],
        description: 'Velocity-focused design for speed enthusiasts. Ultra-responsive wool construction.',
        longDescription: 'Feel the speed. The Velocity Victor is engineered for maximum speed and responsiveness.',
        sizes: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
        availableSizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5],
        rating: 4.8,
        reviewCount: 53,
        reviews: [],
        features: ['Velocity Focused', 'Ultra Responsive', 'Speed Ready'],
        variants: [
            { color: 'Cyan', price: 179, stock: 26 },
            { color: 'Sky Blue', price: 179, stock: 21 }
        ],
        stockBySize: {
            7: 4, 7.5: 3, 8: 5, 8.5: 4, 9: 6, 9.5: 5, 10: 4, 10.5: 3, 11: 2, 11.5: 1
        },
        lowStockThreshold: 5,
        tags: [],
        season: 'all-season',
        gender: 'unisex'
    },

    // ============================================
    // CASUAL COLLECTION (10 products)
    // ============================================
    {
        id: 'comfort-cloud-beige',
        name: 'Comfort Cloud',
        brand: 'WoolFlow',
        color: 'Beige',
        price: 134,
        salePrice: null,
        category: 'casual',
        subcategory: 'comfort',
        image: 'resources/product-urban-oat.jpg',
        images: ['resources/product-urban-oat.jpg'],
        description: 'Ultra-soft casual sneaker for all-day comfort. Cloud-like cushioning in every step.',
        longDescription: 'Walk on clouds. The Comfort Cloud provides ultra-soft cushioning for all-day wearability.',
        sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13],
        availableSizes: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
        rating: 4.7,
        reviewCount: 92,
        reviews: [],
        features: ['Cloud Cushioning', 'Ultra Soft', 'All Day Comfort'],
        variants: [
            { color: 'Beige', price: 134, stock: 48 },
            { color: 'Cream', price: 134, stock: 42 },
            { color: 'Sand', price: 134, stock: 35 }
        ],
        stockBySize: {
            6.5: 5, 7: 7, 7.5: 6, 8: 9, 8.5: 8, 9: 10, 9.5: 8, 10: 6, 10.5: 5, 11: 4, 11.5: 2, 12: 1
        },
        lowStockThreshold: 5,
        tags: ['popular'],
        season: 'all-season',
        gender: 'unisex'
    },
    {
        id: 'weekend-vibes-khaki',
        name: 'Weekend Vibes',
        brand: 'WoolFlow',
        color: 'Khaki',
        price: 129,
        salePrice: null,
        category: 'casual',
        subcategory: 'casual',
        image: 'resources/product-urban-mist.jpg',
        images: ['resources/product-urban-mist.jpg'],
        description: 'Perfect weekend companion. Relaxed fit with premium wool comfort.',
        longDescription: 'Kick back and relax. Weekend Vibes delivers casual comfort without compromising on style.',
        sizes: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
        availableSizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11],
        rating: 4.6,
        reviewCount: 71,
        reviews: [],
        features: ['Relaxed Fit', 'Casual', 'Premium Comfort'],
        variants: [
            { color: 'Khaki', price: 129, stock: 40 },
            { color: 'Sand', price: 129, stock: 33 },
            { color: 'Tan', price: 129, stock: 27 }
        ],
        stockBySize: {
            7: 7, 7.5: 6, 8: 8, 8.5: 7, 9: 9, 9.5: 8, 10: 6, 10.5: 5, 11: 4
        },
        lowStockThreshold: 5,
        tags: [],
        season: 'all-season',
        gender: 'unisex'
    },
    {
        id: 'laid-back-loafer-brown',
        name: 'Laid Back Loafer',
        brand: 'WoolFlow',
        color: 'Brown',
        price: 144,
        salePrice: null,
        category: 'casual',
        subcategory: 'loafer',
        image: 'resources/product-urban-charcoal.jpg',
        images: ['resources/product-urban-charcoal.jpg'],
        description: 'Classic loafer style with modern wool construction. Casual elegance defined.',
        longDescription: 'Timeless loafer design meets modern wool comfort. Perfect for casual elegance.',
        sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13],
        availableSizes: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5],
        rating: 4.5,
        reviewCount: 58,
        reviews: [],
        features: ['Loafer Style', 'Casual Elegance', 'Modern'],
        variants: [
            { color: 'Brown', price: 144, stock: 38 },
            { color: 'Cognac', price: 144, stock: 32 },
            { color: 'Chocolate', price: 144, stock: 26 }
        ],
        stockBySize: {
            6.5: 4, 7: 6, 7.5: 5, 8: 7, 8.5: 6, 9: 8, 9.5: 7, 10: 5, 10.5: 4, 11: 3, 11.5: 2
        },
        lowStockThreshold: 5,
        tags: [],
        season: 'all-season',
        gender: 'unisex'
    },
    {
        id: 'chill-mode-mauve',
        name: 'Chill Mode',
        brand: 'WoolFlow',
        color: 'Mauve',
        price: 124,
        salePrice: null,
        category: 'casual',
        subcategory: 'casual',
        image: 'resources/product-urban-sage.jpg',
        images: ['resources/product-urban-sage.jpg'],
        description: 'Maximum chill vibes. Relaxation-focused sneaker design for those who prioritize comfort.',
        longDescription: 'Embrace the chill. Chill Mode is all about relaxation without sacrificing style.',
        sizes: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
        availableSizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5],
        rating: 4.6,
        reviewCount: 66,
        reviews: [],
        features: ['Chill Vibes', 'Relaxation Focused', 'Comfortable'],
        variants: [
            { color: 'Mauve', price: 124, stock: 44 },
            { color: 'Lavender', price: 124, stock: 37 }
        ],
        stockBySize: {
            7: 8, 7.5: 7, 8: 9, 8.5: 8, 9: 10, 9.5: 9, 10: 7, 10.5: 6, 11: 4, 11.5: 2
        },
        lowStockThreshold: 5,
        tags: [],
        season: 'all-season',
        gender: 'unisex'
    },
    {
        id: 'easy-breezy-white',
        name: 'Easy Breezy',
        brand: 'WoolFlow',
        color: 'White',
        price: 119,
        salePrice: 99,
        category: 'casual',
        subcategory: 'casual',
        image: 'resources/product-urban-oat.jpg',
        images: ['resources/product-urban-oat.jpg'],
        description: 'Light and airy casual sneaker. Breathable wool for warm weather comfort.',
        longDescription: 'Keep it breezy. Easy Breezy features breathable wool perfect for warm weather.',
        sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13, 14],
        availableSizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13],
        rating: 4.8,
        reviewCount: 145,
        reviews: [],
        features: ['Light and Airy', 'Breathable', 'Warm Weather'],
        variants: [
            { color: 'White', price: 119, stock: 55 },
            { color: 'Off White', price: 119, stock: 48 },
            { color: 'Ivory', price: 119, stock: 40 }
        ],
        stockBySize: {
            6: 4, 6.5: 6, 7: 8, 7.5: 7, 8: 10, 8.5: 9, 9: 11, 9.5: 10, 10: 8, 10.5: 7, 11: 5, 11.5: 3, 12: 2, 13: 1
        },
        lowStockThreshold: 5,
        tags: ['sale', 'bestseller'],
        season: 'summer',
        gender: 'unisex'
    },
    {
        id: 'lounge-luxe-gray',
        name: 'Lounge Luxe',
        brand: 'WoolFlow',
        color: 'Gray',
        price: 139,
        salePrice: null,
        category: 'casual',
        subcategory: 'lounge',
        image: 'resources/product-urban-mist.jpg',
        images: ['resources/product-urban-mist.jpg'],
        description: 'Premium loungewear sneaker. Luxury comfort for home and casual outings.',
        longDescription: 'Pure luxury for your feet. Lounge Luxe combines lounge comfort with sneaker style.',
        sizes: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
        availableSizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11],
        rating: 4.7,
        reviewCount: 54,
        reviews: [],
        features: ['Luxury Comfort', 'Lounge Ready', 'Premium Feel'],
        variants: [
            { color: 'Gray', price: 139, stock: 36 },
            { color: 'Charcoal', price: 139, stock: 30 }
        ],
        stockBySize: {
            7: 6, 7.5: 5, 8: 7, 8.5: 6, 9: 8, 9.5: 7, 10: 5, 10.5: 4, 11: 3
        },
        lowStockThreshold: 5,
        tags: [],
        season: 'all-season',
        gender: 'unisex'
    },
    {
        id: 'simple-steps-tan',
        name: 'Simple Steps',
        brand: 'WoolFlow',
        color: 'Tan',
        price: 124,
        salePrice: null,
        category: 'casual',
        subcategory: 'casual',
        image: 'resources/product-urban-charcoal.jpg',
        images: ['resources/product-urban-charcoal.jpg'],
        description: 'Uncomplicated casual sneaker. Simple style, maximum comfort.',
        longDescription: 'Sometimes simple is best. Simple Steps delivers no-fuss casual comfort.',
        sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13],
        availableSizes: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5],
        rating: 4.6,
        reviewCount: 49,
        reviews: [],
        features: ['Simple Style', 'No Fuss', 'Casual'],
        variants: [
            { color: 'Tan', price: 124, stock: 42 },
            { color: 'Caramel', price: 124, stock: 36 }
        ],
        stockBySize: {
            6.5: 5, 7: 6, 7.5: 5, 8: 7, 8.5: 6, 9: 8, 9.5: 7, 10: 5, 10.5: 4, 11: 3, 11.5: 1
        },
        lowStockThreshold: 5,
        tags: [],
        season: 'all-season',
        gender: 'unisex'
    },
    {
        id: 'feel-good-pink',
        name: 'Feel Good',
        brand: 'WoolFlow',
        color: 'Pink',
        price: 129,
        salePrice: null,
        category: 'casual',
        subcategory: 'casual',
        image: 'resources/product-urban-oat.jpg',
        images: ['resources/product-urban-oat.jpg'],
        description: 'Cheerful casual sneaker that makes you smile. Bright color with comfort to match.',
        longDescription: 'Spread joy with every step. Feel Good combines cheerful color with pure comfort.',
        sizes: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
        availableSizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11],
        rating: 4.7,
        reviewCount: 63,
        reviews: [],
        features: ['Cheerful', 'Bright Color', 'Happy Vibes'],
        variants: [
            { color: 'Pink', price: 129, stock: 32 },
            { color: 'Rose', price: 129, stock: 26 }
        ],
        stockBySize: {
            7: 5, 7.5: 4, 8: 6, 8.5: 5, 9: 7, 9.5: 6, 10: 5, 10.5: 4, 11: 3
        },
        lowStockThreshold: 5,
        tags: [],
        season: 'all-season',
        gender: 'women'
    },

    // ============================================
    // WINTER COLLECTION (10 products)
    // ============================================
    {
        id: 'arctic-boots-black',
        name: 'Arctic Boots',
        brand: 'WoolFlow',
        color: 'Black',
        price: 199,
        salePrice: null,
        category: 'winter',
        subcategory: 'boots',
        image: 'resources/product-urban-charcoal.jpg',
        images: ['resources/product-urban-charcoal.jpg'],
        description: 'Insulated wool boots for harsh winter conditions. Waterproof and thermally efficient.',
        longDescription: 'Stay warm in the harshest conditions. Arctic Boots feature premium insulation and waterproofing.',
        sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13],
        availableSizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5],
        rating: 4.9,
        reviewCount: 87,
        reviews: [],
        features: ['Insulated', 'Waterproof', 'Winter Ready', 'Thermally Efficient'],
        variants: [
            { color: 'Black', price: 199, stock: 35 },
            { color: 'Navy', price: 199, stock: 30 },
            { color: 'Gray', price: 199, stock: 25 }
        ],
        stockBySize: {
            7: 6, 7.5: 5, 8: 7, 8.5: 6, 9: 8, 9.5: 7, 10: 6, 10.5: 4, 11: 3, 11.5: 2
        },
        lowStockThreshold: 5,
        tags: ['winter', 'popular'],
        season: 'winter',
        gender: 'unisex'
    },
    {
        id: 'frostbite-fighter-white',
        name: 'Frostbite Fighter',
        brand: 'WoolFlow',
        color: 'White',
        price: 189,
        salePrice: null,
        category: 'winter',
        subcategory: 'snow',
        image: 'resources/product-urban-oat.jpg',
        images: ['resources/product-urban-oat.jpg'],
        description: 'Premium snow sneaker with enhanced grip and insulation. Conquer winter trails.',
        longDescription: 'Dominate winter terrain. Frostbite Fighter features enhanced grip for icy conditions.',
        sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13],
        availableSizes: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
        rating: 4.8,
        reviewCount: 72,
        reviews: [],
        features: ['Enhanced Grip', 'Snow Ready', 'Insulated', 'Icy Terrain'],
        variants: [
            { color: 'White', price: 189, stock: 40 },
            { color: 'Ice Blue', price: 189, stock: 32 }
        ],
        stockBySize: {
            6.5: 5, 7: 6, 7.5: 5, 8: 7, 8.5: 6, 9: 8, 9.5: 7, 10: 6, 10.5: 5, 11: 3, 11.5: 2, 12: 1
        },
        lowStockThreshold: 5,
        tags: ['winter'],
        season: 'winter',
        gender: 'unisex'
    },
    {
        id: 'snowfall-chic-silver',
        name: 'Snowfall Chic',
        brand: 'WoolFlow',
        color: 'Silver',
        price: 174,
        salePrice: null,
        category: 'winter',
        subcategory: 'casual-winter',
        image: 'resources/product-urban-mist.jpg',
        images: ['resources/product-urban-mist.jpg'],
        description: 'Stylish winter casual sneaker. Warm wool with fashionable flair.',
        longDescription: 'Look good while staying warm. Snowfall Chic combines winter warmth with fashion.',
        sizes: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
        availableSizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11],
        rating: 4.7,
        reviewCount: 51,
        reviews: [],
        features: ['Stylish', 'Warm Wool', 'Winter Fashion', 'Fashionable'],
        variants: [
            { color: 'Silver', price: 174, stock: 28 },
            { color: 'Pearl', price: 174, stock: 23 }
        ],
        stockBySize: {
            7: 4, 7.5: 3, 8: 5, 8.5: 4, 9: 6, 9.5: 5, 10: 4, 10.5: 3, 11: 2
        },
        lowStockThreshold: 5,
        tags: [],
        season: 'winter',
        gender: 'women'
    },
    {
        id: 'cozy-cocoon-charcoal',
        name: 'Cozy Cocoon',
        brand: 'WoolFlow',
        color: 'Charcoal',
        price: 154,
        salePrice: null,
        category: 'winter',
        subcategory: 'comfort-winter',
        image: 'resources/product-urban-charcoal.jpg',
        images: ['resources/product-urban-charcoal.jpg'],
        description: 'Ultimate comfort winter sneaker. Wrap your feet in warmth and coziness.',
        longDescription: 'Pure coziness. Cozy Cocoon wraps your feet in premium wool warmth.',
        sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13],
        availableSizes: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5],
        rating: 4.8,
        reviewCount: 68,
        reviews: [],
        features: ['Cozy', 'Warm', 'Comfortable', 'Winter Warmth'],
        variants: [
            { color: 'Charcoal', price: 154, stock: 45 },
            { color: 'Dark Gray', price: 154, stock: 38 }
        ],
        stockBySize: {
            6.5: 6, 7: 7, 7.5: 6, 8: 8, 8.5: 7, 9: 9, 9.5: 8, 10: 6, 10.5: 5, 11: 4, 11.5: 2
        },
        lowStockThreshold: 5,
        tags: [],
        season: 'winter',
        gender: 'unisex'
    },
    {
        id: 'thermal-tight-navy',
        name: 'Thermal Tight',
        brand: 'WoolFlow',
        color: 'Navy',
        price: 184,
        salePrice: null,
        category: 'winter',
        subcategory: 'performance-winter',
        image: 'resources/product-urban-sage.jpg',
        images: ['resources/product-urban-sage.jpg'],
        description: 'Performance winter sneaker with thermal wool. Perfect for winter athletes.',
        longDescription: 'For active winter adventurers. Thermal Tight provides performance in cold conditions.',
        sizes: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
        availableSizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11],
        rating: 4.7,
        reviewCount: 46,
        reviews: [],
        features: ['Thermal Wool', 'Winter Performance', 'Athletic', 'Cold Ready'],
        variants: [
            { color: 'Navy', price: 184, stock: 30 },
            { color: 'Deep Blue', price: 184, stock: 24 }
        ],
        stockBySize: {
            7: 4, 7.5: 3, 8: 5, 8.5: 4, 9: 6, 9.5: 5, 10: 4, 10.5: 3, 11: 2
        },
        lowStockThreshold: 5,
        tags: [],
        season: 'winter',
        gender: 'unisex'
    },
    {
        id: 'blizzard-brave-blue',
        name: 'Blizzard Brave',
        brand: 'WoolFlow',
        color: 'Blue',
        price: 194,
        salePrice: null,
        category: 'winter',
        subcategory: 'extreme-winter',
        image: 'resources/product-urban-oat.jpg',
        images: ['resources/product-urban-oat.jpg'],
        description: 'Extreme winter protection sneaker. Built for blizzard conditions.',
        longDescription: 'Brave the blizzard. Blizzard Brave is engineered for extreme winter conditions.',
        sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13],
        availableSizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11],
        rating: 4.9,
        reviewCount: 38,
        reviews: [],
        features: ['Blizzard Ready', 'Extreme Winter', 'Heavy Insulation', 'Protective'],
        variants: [
            { color: 'Blue', price: 194, stock: 25 },
            { color: 'Icy Blue', price: 194, stock: 20 }
        ],
        stockBySize: {
            7: 3, 7.5: 2, 8: 4, 8.5: 3, 9: 5, 9.5: 4, 10: 3, 10.5: 2, 11: 1
        },
        lowStockThreshold: 5,
        tags: ['premium'],
        season: 'winter',
        gender: 'unisex'
    },
    {
        id: 'ice-queen-pearl',
        name: 'Ice Queen',
        brand: 'WoolFlow',
        color: 'Pearl',
        price: 169,
        salePrice: null,
        category: 'winter',
        subcategory: 'luxury-winter',
        image: 'resources/product-urban-mist.jpg',
        images: ['resources/product-urban-mist.jpg'],
        description: 'Luxurious winter sneaker with premium wool. Elegant and warm.',
        longDescription: 'Reign supreme in winter style. Ice Queen combines luxury with comfort.',
        sizes: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
        availableSizes: [7, 7.5, 8, 8.5, 9, 9.5, 10],
        rating: 4.8,
        reviewCount: 44,
        reviews: [],
        features: ['Luxurious', 'Premium Wool', 'Elegant', 'Warm'],
        variants: [
            { color: 'Pearl', price: 169, stock: 22 },
            { color: 'Diamond', price: 169, stock: 17 }
        ],
        stockBySize: {
            7: 3, 7.5: 2, 8: 4, 8.5: 3, 9: 5, 9.5: 4, 10: 2
        },
        lowStockThreshold: 5,
        tags: ['premium'],
        season: 'winter',
        gender: 'women'
    },
    {
        id: 'frost-proof-gray',
        name: 'Frost Proof',
        brand: 'WoolFlow',
        color: 'Gray',
        price: 179,
        salePrice: null,
        category: 'winter',
        subcategory: 'rugged-winter',
        image: 'resources/product-urban-charcoal.jpg',
        images: ['resources/product-urban-charcoal.jpg'],
        description: 'Rugged winter sneaker resistant to frost and ice. Built tough.',
        longDescription: 'No frost can slow you down. Frost Proof is engineered for winter durability.',
        sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13],
        availableSizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11],
        rating: 4.7,
        reviewCount: 53,
        reviews: [],
        features: ['Frost Resistant', 'Ice Proof', 'Rugged', 'Durable'],
        variants: [
            { color: 'Gray', price: 179, stock: 32 },
            { color: 'Graphite', price: 179, stock: 27 }
        ],
        stockBySize: {
            7: 4, 7.5: 3, 8: 5, 8.5: 4, 9: 6, 9.5: 5, 10: 4, 10.5: 3, 11: 2
        },
        lowStockThreshold: 5,
        tags: [],
        season: 'winter',
        gender: 'unisex'
    },
    {
        id: 'snowdrift-comfort-cream',
        name: 'Snowdrift Comfort',
        brand: 'WoolFlow',
        color: 'Cream',
        price: 159,
        salePrice: null,
        category: 'winter',
        subcategory: 'cozy-winter',
        image: 'resources/product-urban-oat.jpg',
        images: ['resources/product-urban-oat.jpg'],
        description: 'Cozy winter comfort sneaker. Soft wool perfect for cold days.',
        longDescription: 'Sink into comfort. Snowdrift Comfort provides ultimate winter coziness.',
        sizes: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
        availableSizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11],
        rating: 4.6,
        reviewCount: 57,
        reviews: [],
        features: ['Soft Wool', 'Cozy Winter', 'Comfortable', 'Cold Day Ready'],
        variants: [
            { color: 'Cream', price: 159, stock: 35 },
            { color: 'Ivory', price: 159, stock: 29 }
        ],
        stockBySize: {
            7: 5, 7.5: 4, 8: 6, 8.5: 5, 9: 7, 9.5: 6, 10: 5, 10.5: 3, 11: 2
        },
        lowStockThreshold: 5,
        tags: [],
        season: 'winter',
        gender: 'unisex'
    }
];

// Load products into global variable
let products = [...productsDatabase];

console.log(`✅ Loaded ${products.length} products from database`);
