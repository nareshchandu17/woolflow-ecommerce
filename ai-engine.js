// WoolFlow AI Engine - Machine Learning & AI Features
// Handles personalized recommendations, size fitting, sentiment analysis, and more

class WoolFlowAI {
    constructor() {
        this.userProfile = this.loadUserProfile();
        this.interactionHistory = this.loadInteractionHistory();
        this.sentimentCache = {};
        this.recommendations = [];
        this.similarityThreshold = 0.65;
    }

    // ============================================
    // 1. PERSONALIZED RECOMMENDATIONS ENGINE
    // ============================================
    generateRecommendations(viewedProductId, allProducts, cartItems = []) {
        const viewed = allProducts.find(p => p.id === viewedProductId);
        if (!viewed) return [];

        const scores = allProducts
            .filter(p => p.id !== viewedProductId && !cartItems.some(ci => ci.id === p.id))
            .map(product => ({
                product,
                score: this.calculateProductSimilarity(viewed, product, allProducts)
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 4);

        this.recommendations = scores.map(s => s.product);
        return this.recommendations;
    }

    calculateProductSimilarity(product1, product2, allProducts) {
        let similarity = 0;

        // Category similarity (40% weight)
        if (product1.category === product2.category) similarity += 0.4;

        // Price range similarity (20% weight)
        const priceDiff = Math.abs(product1.price - product2.price);
        const priceRange = Math.max(...allProducts.map(p => p.price)) - Math.min(...allProducts.map(p => p.price));
        const priceScore = 1 - (priceDiff / priceRange);
        similarity += priceScore * 0.2;

        // Rating similarity (20% weight)
        const ratingDiff = Math.abs((product1.rating || 4) - (product2.rating || 4));
        const ratingScore = 1 - (ratingDiff / 5);
        similarity += ratingScore * 0.2;

        // User interaction history (20% weight)
        if (this.userProfile.viewedCategories.includes(product2.category)) {
            similarity += 0.2;
        }

        return similarity;
    }

    recordProductView(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            if (!this.userProfile.viewedCategories.includes(product.category)) {
                this.userProfile.viewedCategories.push(product.category);
            }
            this.userProfile.viewedProducts.push({
                id: productId,
                timestamp: Date.now(),
                category: product.category
            });
            this.saveUserProfile();
        }
    }

    // ============================================
    // 2. SMART SIZE FIT ADVISOR
    // ============================================
    getSizeRecommendation(userHeight, userWeight, footLength, pastPurchases = []) {
        let recommendedSize = this.calculateBaseSizeFromMeasurements(userHeight, footLength);
        
        // Adjust based on past purchases
        if (pastPurchases.length > 0) {
            const avgPastSize = this.getAverageSizeFromPurchases(pastPurchases);
            const adjustment = this.calculateSizeAdjustment(pastPurchases);
            recommendedSize += adjustment;
        }

        return {
            recommended: Math.round(recommendedSize * 2) / 2,
            range: [Math.floor(recommendedSize), Math.ceil(recommendedSize) + 1],
            confidence: 0.85 + (pastPurchases.length * 0.03),
            tips: this.generateSizeTips(recommendedSize)
        };
    }

    calculateBaseSizeFromMeasurements(heightCm, footLengthCm) {
        // US shoe size formula based on foot length (in inches)
        const footLengthInches = footLengthCm / 2.54;
        return ((footLengthInches - 7.375) / 0.375) - 0.5;
    }

    getAverageSizeFromPurchases(purchases) {
        if (purchases.length === 0) return 0;
        const sizes = purchases.map(p => parseFloat(p.size));
        return sizes.reduce((a, b) => a + b, 0) / sizes.length;
    }

    calculateSizeAdjustment(purchases) {
        // If user frequently goes up half size, recommend that
        const sizeProgression = purchases.map(p => parseFloat(p.size));
        if (sizeProgression.length < 2) return 0;
        
        const trend = sizeProgression[sizeProgression.length - 1] - sizeProgression[0];
        return trend > 0 ? 0.25 : 0;
    }

    generateSizeTips(size) {
        return [
            "Merino wool sneakers fit true to size but can stretch slightly with wear",
            "Consider sizing up 0.5 if you have wider feet",
            "These run comfortable without thick socks - account for that",
            "Most customers keep the same size across all WoolFlow products"
        ];
    }

    // ============================================
    // 3. NATURAL LANGUAGE SEARCH
    // ============================================
    searchByNaturalLanguage(query, allProducts) {
        const intent = this.parseSearchIntent(query.toLowerCase());
        return this.filterProductsByIntent(intent, allProducts);
    }

    parseSearchIntent(query) {
        const intent = {
            season: null,
            activity: null,
            style: null,
            priceRange: null,
            color: null
        };

        // Season detection
        if (query.match(/winter|cold|warm|thermal/)) intent.season = 'winter';
        if (query.match(/summer|hot|light|cool/)) intent.season = 'summer';

        // Activity detection
        if (query.match(/run|runner|sport|active|trail|hike/)) intent.activity = 'active';
        if (query.match(/work|commute|office|professional/)) intent.activity = 'work';
        if (query.match(/casual|everyday|comfort|slip|lounge/)) intent.activity = 'casual';
        if (query.match(/urban|city|street|style/)) intent.activity = 'urban';

        // Style detection
        if (query.match(/minimalist|simple|clean/)) intent.style = 'minimal';
        if (query.match(/luxury|premium|high-end/)) intent.style = 'premium';
        if (query.match(/vintage|retro|classic/)) intent.style = 'classic';

        // Price detection
        if (query.match(/cheap|budget|affordable|under\s+\$?\d+/)) intent.priceRange = 'budget';
        if (query.match(/premium|expensive|luxury|high-end/)) intent.priceRange = 'premium';

        // Color detection
        const colors = ['oat', 'sage', 'charcoal', 'mist', 'stone', 'black', 'green', 'gray', 'white'];
        colors.forEach(color => {
            if (query.includes(color)) intent.color = color;
        });

        return intent;
    }

    filterProductsByIntent(intent, allProducts) {
        let results = [...allProducts];

        if (intent.activity) {
            const activityMap = {
                'active': ['Trail Blazer', 'City Trekker'],
                'work': ['Urban Wool Runner', 'Commuter Classic'],
                'casual': ['Metro Slip-On', 'Street Walker'],
                'urban': ['Urban Wool Runner', 'City Trekker']
            };
            const matching = activityMap[intent.activity] || [];
            results = results.filter(p => matching.some(m => p.name.includes(m)));
        }

        if (intent.priceRange === 'budget') {
            results = results.filter(p => p.price < 150);
        } else if (intent.priceRange === 'premium') {
            results = results.filter(p => p.price >= 160);
        }

        if (intent.color) {
            results = results.filter(p => 
                p.name.toLowerCase().includes(intent.color) || 
                (p.variants && p.variants.some(v => v.color.toLowerCase().includes(intent.color)))
            );
        }

        return results;
    }

    // ============================================
    // 4. REVIEW SENTIMENT ANALYSIS
    // ============================================
    analyzeSentiment(text) {
        if (this.sentimentCache[text]) return this.sentimentCache[text];

        const sentiment = {
            score: this.calculateSentimentScore(text),
            keywords: this.extractSentimentKeywords(text),
            concerns: this.extractConcerns(text)
        };

        this.sentimentCache[text] = sentiment;
        return sentiment;
    }

    calculateSentimentScore(text) {
        const positive = ['love', 'amazing', 'perfect', 'excellent', 'great', 'comfortable', 'best', 'awesome', 'fantastic'];
        const negative = ['hate', 'terrible', 'bad', 'poor', 'disappointing', 'uncomfortable', 'cheap', 'worst'];
        
        const lowerText = text.toLowerCase();
        let score = 0;

        positive.forEach(word => {
            if (lowerText.includes(word)) score += 0.1;
        });

        negative.forEach(word => {
            if (lowerText.includes(word)) score -= 0.1;
        });

        return Math.max(-1, Math.min(1, score));
    }

    extractSentimentKeywords(text) {
        const keywordMap = {
            comfort: ['comfortable', 'comfy', 'cushioned', 'soft'],
            durability: ['durable', 'quality', 'long-lasting', 'wear'],
            fit: ['fit', 'size', 'tight', 'loose', 'snug'],
            style: ['style', 'look', 'design', 'aesthetic'],
            value: ['worth', 'price', 'expensive', 'affordable', 'value']
        };

        const found = {};
        Object.keys(keywordMap).forEach(key => {
            if (keywordMap[key].some(kw => text.toLowerCase().includes(kw))) {
                found[key] = true;
            }
        });

        return found;
    }

    extractConcerns(text) {
        const concernPatterns = [
            { pattern: /size.*small|runs.*small|small.*order.*up/i, concern: 'runs_small' },
            { pattern: /size.*large|runs.*large/i, concern: 'runs_large' },
            { pattern: /durability|wore.*out|falling.*apart/i, concern: 'durability_issue' },
            { pattern: /color.*different|not.*color|darker|lighter/i, concern: 'color_accuracy' },
            { pattern: /uncomfortable|hurt|pain|rubbing/i, concern: 'comfort_issue' }
        ];

        return concernPatterns
            .filter(cp => cp.pattern.test(text))
            .map(cp => cp.concern);
    }

    summarizeProductReviews(reviews) {
        if (!reviews || reviews.length === 0) return null;

        const sentiments = reviews.map(r => this.analyzeSentiment(r.text));
        const avgScore = sentiments.reduce((sum, s) => sum + s.score, 0) / sentiments.length;
        
        const allConcerns = {};
        sentiments.forEach(s => {
            s.concerns.forEach(concern => {
                allConcerns[concern] = (allConcerns[concern] || 0) + 1;
            });
        });

        return {
            averageSentiment: avgScore,
            topConcerns: Object.entries(allConcerns)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(e => e[0]),
            reviewCount: reviews.length,
            positiveCount: sentiments.filter(s => s.score > 0.2).length,
            neutralCount: sentiments.filter(s => Math.abs(s.score) <= 0.2).length,
            negativeCount: sentiments.filter(s => s.score < -0.2).length
        };
    }

    // ============================================
    // 5. VISUAL SIMILARITY SEARCH
    // ============================================
    findSimilarByVisualFeatures(productId, allProducts) {
        const sourceProduct = allProducts.find(p => p.id === productId);
        if (!sourceProduct) return [];

        return allProducts
            .filter(p => p.id !== productId)
            .map(product => ({
                product,
                similarity: this.calculateVisualSimilarity(sourceProduct, product)
            }))
            .filter(item => item.similarity > this.similarityThreshold)
            .sort((a, b) => b.similarity - a.similarity)
            .map(item => item.product);
    }

    calculateVisualSimilarity(product1, product2) {
        let similarity = 0;

        // Color similarity
        if (product1.color === product2.color) similarity += 0.3;

        // Category similarity
        if (product1.category === product2.category) similarity += 0.4;

        // Style/pattern similarity (based on name)
        const name1 = product1.name.toLowerCase();
        const name2 = product2.name.toLowerCase();
        const commonWords = name1.split(' ').filter(w => name2.includes(w)).length;
        similarity += Math.min(commonWords * 0.15, 0.3);

        return similarity;
    }

    // ============================================
    // 6. INVENTORY & DEMAND PREDICTION
    // ============================================
    predictOutOfStock(product) {
        const totalStock = Object.values(product.stockBySize || {})
            .reduce((sum, sizeStock) => sum + Object.values(sizeStock).reduce((a, b) => a + b, 0), 0);

        const stockLevel = totalStock / (product.variants.length * 6);
        const daysToStockout = stockLevel * 5; // Estimated based on sales velocity

        return {
            isLowStock: stockLevel < 3,
            daysToStockout: Math.max(0, daysToStockout),
            urgency: stockLevel < 2 ? 'critical' : stockLevel < 5 ? 'high' : 'normal',
            alert: stockLevel < 2 ? `Only ${totalStock} items left - Selling fast!` : null
        };
    }

    // ============================================
    // 7. STYLE ADVISOR & OUTFIT BUNDLES
    // ============================================
    generateStyleBundle(productId, allProducts) {
        const baseProduct = allProducts.find(p => p.id === productId);
        if (!baseProduct) return [];

        const complementary = allProducts
            .filter(p => p.id !== productId && p.category !== baseProduct.category)
            .map(product => ({
                product,
                match: this.calculateStyleMatch(baseProduct, product)
            }))
            .filter(item => item.match > 0.5)
            .sort((a, b) => b.match - a.match)
            .slice(0, 3);

        return complementary.map(item => ({
            ...item.product,
            matchScore: item.match,
            bundleDiscount: 10 // 10% off when bought together
        }));
    }

    calculateStyleMatch(product1, product2) {
        let match = 0;

        // Price tier compatibility (should complement, not clash)
        const priceDiff = Math.abs(product1.price - product2.price);
        const avgPrice = (product1.price + product2.price) / 2;
        const priceCompat = 1 - (priceDiff / avgPrice / 2);
        match += priceCompat * 0.4;

        // Color harmony (natural earth tones pair well)
        const colorHarmony = this.getColorHarmonyScore(product1.color, product2.color);
        match += colorHarmony * 0.6;

        return match;
    }

    getColorHarmonyScore(color1, color2) {
        const harmonyMap = {
            'Oat': { 'Sage': 0.9, 'Charcoal': 0.8, 'Stone': 0.95, 'Mist': 0.85 },
            'Sage': { 'Oat': 0.9, 'Charcoal': 0.85, 'Stone': 0.8, 'Mist': 0.75 },
            'Charcoal': { 'Oat': 0.8, 'Sage': 0.85, 'Stone': 0.75, 'Mist': 0.9 },
            'Stone': { 'Oat': 0.95, 'Sage': 0.8, 'Charcoal': 0.75, 'Mist': 0.85 },
            'Mist': { 'Oat': 0.85, 'Sage': 0.75, 'Charcoal': 0.9, 'Stone': 0.85 }
        };

        return harmonyMap[color1]?.[color2] || 0.5;
    }

    // ============================================
    // 8. SUSTAINABILITY IMPACT CALCULATOR
    // ============================================
    calculateSustainabilityScore(product) {
        let score = 0;
        let details = [];

        // Material score
        score += 35; // Merino wool is inherently sustainable
        details.push({
            category: 'Material',
            score: 35,
            reason: '100% natural merino wool, biodegradable'
        });

        // Durability score (impacts lifetime emissions)
        const lifespan = 3; // years of use
        const durabilityScore = Math.min(30, lifespan * 10);
        score += durabilityScore;
        details.push({
            category: 'Durability',
            score: durabilityScore,
            reason: `Estimated ${lifespan}-year lifespan reduces per-wear impact`
        });

        // Production score
        score += 20;
        details.push({
            category: 'Production',
            score: 20,
            reason: 'Ethical manufacturing & carbon-neutral shipping'
        });

        // Price-per-wear
        const expectedWears = lifespan * 250; // ~250 wears per year
        score += 15;
        details.push({
            category: 'Cost Efficiency',
            score: 15,
            reason: `$${(product.price / expectedWears).toFixed(2)} per wear`
        });

        const comparison = {
            vs_synthetic: 'Saves ~8kg of CO2 vs synthetic alternatives',
            water_saved: 'Saves ~2,700L of water vs conventional production',
            waste: 'Fully biodegradable at end of life'
        };

        return {
            totalScore: score,
            percentage: (score / 100) * 100,
            details,
            comparison,
            certifications: ['Fair Trade', 'Carbon Neutral', 'Biodegradable']
        };
    }

    // ============================================
    // 9. CHURN PREDICTION & RETENTION
    // ============================================
    predictChurnRisk(userActivity) {
        let riskScore = 0;

        // Days since last purchase
        const daysSinceLastBuy = userActivity.lastPurchaseDate 
            ? (Date.now() - userActivity.lastPurchaseDate) / (1000 * 60 * 60 * 24)
            : 999;
        if (daysSinceLastBuy > 180) riskScore += 0.4;
        else if (daysSinceLastBuy > 90) riskScore += 0.2;

        // Engagement frequency
        const engagementDays = userActivity.lastVisitDate 
            ? (Date.now() - userActivity.lastVisitDate) / (1000 * 60 * 60 * 24)
            : 999;
        if (engagementDays > 60) riskScore += 0.3;
        else if (engagementDays > 30) riskScore += 0.15;

        // Cart abandonment
        if (userActivity.abandonedCartItems > 0) riskScore += 0.2;

        // Email engagement
        if (userActivity.emailOpenRate < 0.2) riskScore += 0.1;

        const riskLevel = riskScore > 0.6 ? 'high' : riskScore > 0.3 ? 'medium' : 'low';

        return {
            riskScore: Math.min(1, riskScore),
            riskLevel,
            recommendations: this.getRetentionRecommendations(riskScore, userActivity)
        };
    }

    getRetentionRecommendations(riskScore, userActivity) {
        const recommendations = [];

        if (riskScore > 0.6) {
            recommendations.push('Send personalized win-back offer (15-20% discount)');
            recommendations.push('Highlight new products they might like');
            recommendations.push('Offer free shipping incentive');
        } else if (riskScore > 0.3) {
            recommendations.push('Send reminder about items in their wishlist');
            recommendations.push('Offer complementary product recommendations');
            recommendations.push('Suggest loyalty program enrollment');
        }

        if (userActivity.abandonedCartItems > 0) {
            recommendations.push('Send cart recovery email with product benefits');
        }

        return recommendations;
    }

    // ============================================
    // 10. DYNAMIC PRICING OPTIMIZER
    // ============================================
    optimizePricing(product, marketData = {}) {
        let adjustedPrice = product.price;
        const factors = [];

        // Demand factor (based on inventory levels)
        const prediction = this.predictOutOfStock(product);
        if (prediction.urgency === 'critical') {
            adjustedPrice *= 1.1; // 10% increase for high demand
            factors.push({ type: 'demand', adjustment: 1.1, reason: 'Low stock, high demand' });
        } else if (prediction.urgency === 'high') {
            adjustedPrice *= 1.05; // 5% increase
            factors.push({ type: 'demand', adjustment: 1.05, reason: 'Moderate demand' });
        }

        // Seasonality factor
        const month = new Date().getMonth();
        if ([11, 0, 1].includes(month)) { // Winter months
            adjustedPrice *= 1.08; // Slight increase for winter items
            factors.push({ type: 'seasonality', adjustment: 1.08, reason: 'Winter season' });
        }

        // Competitive positioning (tier-based)
        if (product.price > 160) {
            adjustedPrice *= 0.98; // Premium items get slight discount
            factors.push({ type: 'competition', adjustment: 0.98, reason: 'Premium positioning' });
        }

        return {
            originalPrice: product.price,
            optimizedPrice: Math.round(adjustedPrice * 100) / 100,
            discountPercent: Math.round(((product.price - adjustedPrice) / product.price) * 100),
            factors,
            confidence: 0.75
        };
    }

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    loadUserProfile() {
        const stored = localStorage.getItem('woolflow-user-profile');
        return stored ? JSON.parse(stored) : {
            viewedProducts: [],
            viewedCategories: [],
            purchaseHistory: [],
            sizePreferences: {},
            preferences: {}
        };
    }

    saveUserProfile() {
        localStorage.setItem('woolflow-user-profile', JSON.stringify(this.userProfile));
    }

    loadInteractionHistory() {
        const stored = localStorage.getItem('woolflow-interaction-history');
        return stored ? JSON.parse(stored) : [];
    }

    saveInteractionHistory() {
        localStorage.setItem('woolflow-interaction-history', JSON.stringify(this.interactionHistory));
    }

    trackInteraction(type, productId, data = {}) {
        this.interactionHistory.push({
            type,
            productId,
            timestamp: Date.now(),
            ...data
        });
        this.saveInteractionHistory();
    }
}

// Initialize AI Engine
const aiEngine = new WoolFlowAI();
