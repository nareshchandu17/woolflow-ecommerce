// AI UI Components - Interactive interface for all AI features

// Size Fit Advisor Chat Widget
class SizeFitAdvisor {
    constructor() {
        this.conversationHistory = [];
        this.currentStep = 'greeting';
        this.userInput = {};
    }

    initializeWidget() {
        const widget = document.createElement('div');
        widget.id = 'size-fit-advisor';
        widget.className = 'size-fit-advisor-widget';
        widget.innerHTML = `
            <div class="size-advisor-header">
                <h4>Size Fit Advisor</h4>
                <button class="size-advisor-close" onclick="closeSizeFitAdvisor()">×</button>
            </div>
            <div class="size-advisor-chat" id="size-advisor-chat">
                <div class="chat-message bot-message">
                    Hi! I'm here to help you find the perfect shoe size. Let's start with a quick measurement.
                </div>
            </div>
            <div class="size-advisor-input">
                <input type="text" id="size-advisor-input" class="size-advisor-field" placeholder="Type your answer..." />
                <button class="size-advisor-send" onclick="sendSizeFitMessage()">Send</button>
            </div>
        `;
        return widget;
    }

    startConversation() {
        this.conversationHistory = [];
        this.currentStep = 'greeting';
        this.userInput = {};
        this.addBotMessage("What's your height? (in feet and inches, e.g., 5'10\")");
    }

    addBotMessage(message) {
        const chatBox = document.getElementById('size-advisor-chat');
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-message bot-message';
        msgDiv.textContent = message;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        this.conversationHistory.push({ role: 'bot', content: message });
    }

    addUserMessage(message) {
        const chatBox = document.getElementById('size-advisor-chat');
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-message user-message';
        msgDiv.textContent = message;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        this.conversationHistory.push({ role: 'user', content: message });
    }

    processInput(userMessage) {
        this.addUserMessage(userMessage);
        const input = document.getElementById('size-advisor-input');
        input.value = '';

        if (this.currentStep === 'greeting') {
            this.userInput.height = userMessage;
            this.currentStep = 'weight';
            this.addBotMessage("What's your weight? (in pounds)");
        } else if (this.currentStep === 'weight') {
            this.userInput.weight = userMessage;
            this.currentStep = 'footlength';
            this.addBotMessage("What's your foot length? (You can measure from heel to big toe, in inches or cm)");
        } else if (this.currentStep === 'footlength') {
            this.userInput.footLength = userMessage;
            this.currentStep = 'pastpurchases';
            this.addBotMessage("Have you purchased shoes from us before? (yes/no)");
        } else if (this.currentStep === 'pastpurchases') {
            if (userMessage.toLowerCase().includes('yes')) {
                this.currentStep = 'pastsize';
                this.addBotMessage("What size did you order? (e.g., 9, 9.5, 10)");
            } else {
                this.generateRecommendation();
            }
        } else if (this.currentStep === 'pastsize') {
            this.userInput.pastSize = userMessage;
            this.generateRecommendation();
        }
    }

    generateRecommendation() {
        const footLengthCm = this.parseMeasurement(this.userInput.footLength);
        const pastSize = this.userInput.pastSize ? parseFloat(this.userInput.pastSize) : null;
        const pastPurchases = pastSize ? [{ size: pastSize }] : [];

        const recommendation = aiEngine.getSizeRecommendation(
            this.userInput.height,
            this.userInput.weight,
            footLengthCm,
            pastPurchases
        );

        this.currentStep = 'done';
        const recommendationHTML = `
            <div class="size-recommendation">
                <h5>Recommended Size: ${recommendation.recommended}</h5>
                <p>Suggested Range: ${recommendation.range[0]} - ${recommendation.range[1]}</p>
                <p><strong>Confidence:</strong> ${Math.round(recommendation.confidence * 100)}%</p>
                <div class="size-tips">
                    <p><strong>Tips:</strong></p>
                    <ul>${recommendation.tips.map(t => `<li>${t}</li>`).join('')}</ul>
                </div>
            </div>
        `;

        const chatBox = document.getElementById('size-advisor-chat');
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-message bot-message';
        msgDiv.innerHTML = recommendationHTML;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    parseMeasurement(input) {
        // Convert feet/inches to cm
        if (input.includes("'")) {
            const [feet, inches] = input.split("'");
            return (parseInt(feet) * 12 + parseInt(inches)) * 2.54;
        }
        // Already in cm
        return parseFloat(input);
    }
}

// AI-Powered Search Widget
class SmartSearch {
    initializeWidget(allProducts) {
        const searchContainer = document.querySelector('.search-container') || document.createElement('div');
        searchContainer.innerHTML = `
            <div class="smart-search-wrapper">
                <input 
                    type="text" 
                    id="smart-search-input" 
                    class="smart-search-field" 
                    placeholder="Search naturally... (e.g., 'comfortable winter runners')"
                    autocomplete="off"
                />
                <div id="search-suggestions" class="search-suggestions hidden"></div>
            </div>
        `;

        const input = searchContainer.querySelector('#smart-search-input');
        input.addEventListener('input', (e) => this.handleSearch(e.target.value, allProducts));
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.executeSearch(input.value, allProducts);
        });

        return searchContainer;
    }

    handleSearch(query, allProducts) {
        if (query.length < 2) {
            document.getElementById('search-suggestions').classList.add('hidden');
            return;
        }

        const results = aiEngine.searchByNaturalLanguage(query, allProducts);
        this.showSuggestions(results, query);
    }

    showSuggestions(results, query) {
        const suggestionsBox = document.getElementById('search-suggestions');
        if (results.length === 0) {
            suggestionsBox.innerHTML = '<div class="no-results">No products found</div>';
        } else {
            suggestionsBox.innerHTML = results.slice(0, 4).map((product, idx) => `
                <div class="suggestion-item" onclick="selectSearchResult('${product.id}')">
                    <div class="suggestion-name">${product.name}</div>
                    <div class="suggestion-category">${product.category}</div>
                </div>
            `).join('');
        }
        suggestionsBox.classList.remove('hidden');
    }

    executeSearch(query, allProducts) {
        const results = aiEngine.searchByNaturalLanguage(query, allProducts);
        // Could redirect to products page with filters applied
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    }
}

// Recommendation Widget
class RecommendationWidget {
    generateRecommendationCard(product) {
        return `
            <div class="recommendation-card" data-product-id="${product.id}">
                <div class="recommendation-image">
                    <img src="${product.image}" alt="${product.name}" />
                    <span class="recommendation-badge">Recommended for You</span>
                </div>
                <div class="recommendation-content">
                    <h4>${product.name}</h4>
                    <p class="recommendation-reason">Based on your browsing history</p>
                    <div class="recommendation-footer">
                        <span class="recommendation-price">$${product.price}</span>
                        <button class="recommendation-btn" onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.image}')">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderRecommendations(recommendations, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = recommendations
            .map(rec => this.generateRecommendationCard(rec))
            .join('');
    }
}

// Review Sentiment Summary Widget
class ReviewSentimentWidget {
    generateSentimentSummary(product) {
        if (!product.reviews) return '';

        const summary = aiEngine.summarizeProductReviews(product.reviews);
        const sentimentEmoji = summary.averageSentiment > 0.5 ? '😊' : summary.averageSentiment > 0 ? '🙂' : '😐';
        const sentimentLabel = summary.averageSentiment > 0.5 ? 'Very Positive' : summary.averageSentiment > 0 ? 'Positive' : 'Mixed';

        return `
            <div class="sentiment-summary">
                <div class="sentiment-score">
                    <span class="sentiment-emoji">${sentimentEmoji}</span>
                    <div class="sentiment-stats">
                        <h4>${sentimentLabel}</h4>
                        <p>${summary.positiveCount} positive • ${summary.neutralCount} neutral • ${summary.negativeCount} negative</p>
                    </div>
                </div>
                ${summary.topConcerns.length > 0 ? `
                    <div class="sentiment-concerns">
                        <h5>Common Feedback:</h5>
                        <ul>
                            ${summary.topConcerns.map(concern => `<li>${this.formatConcern(concern)}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
    }

    formatConcern(concern) {
        const concernMap = {
            'runs_small': '⚠️ Runs small - consider sizing up',
            'runs_large': '⚠️ Runs large - consider sizing down',
            'durability_issue': '⚠️ Some durability concerns',
            'color_accuracy': '⚠️ Color may differ from photos',
            'comfort_issue': '⚠️ Some comfort issues noted'
        };
        return concernMap[concern] || concern;
    }
}

// Sustainability Score Widget
class SustainabilityWidget {
    generateSustainabilityBadge(product) {
        const score = aiEngine.calculateSustainabilityScore(product);
        const progressColor = score.percentage > 75 ? '#9BA894' : score.percentage > 50 ? '#A89B8C' : '#C8C0BA';

        return `
            <div class="sustainability-badge">
                <div class="sustainability-score">
                    <svg class="sustainability-ring" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#E8E0D0" stroke-width="8"/>
                        <circle 
                            cx="50" 
                            cy="50" 
                            r="40" 
                            fill="none" 
                            stroke="${progressColor}" 
                            stroke-width="8"
                            stroke-dasharray="${score.percentage * 2.51} 251"
                            stroke-linecap="round"
                        />
                    </svg>
                    <div class="sustainability-text">
                        <span class="sustainability-number">${Math.round(score.percentage)}%</span>
                        <span class="sustainability-label">Sustainable</span>
                    </div>
                </div>
                <div class="sustainability-details">
                    <h5>Environmental Impact</h5>
                    <ul>
                        ${score.details.map(d => `
                            <li>
                                <strong>${d.category}:</strong> ${d.reason}
                            </li>
                        `).join('')}
                    </ul>
                    <div class="sustainability-comparison">
                        <h6>vs. Synthetic Alternatives</h6>
                        <p>${score.comparison.vs_synthetic}</p>
                        <p>${score.comparison.water_saved}</p>
                    </div>
                </div>
            </div>
        `;
    }
}

// Style Advisor Bundle Widget
class StyleAdvisorWidget {
    generateStyleBundle(bundleItems) {
        return `
            <div class="style-bundle-container">
                <h4>Complete the Look</h4>
                <div class="bundle-items">
                    ${bundleItems.map(item => `
                        <div class="bundle-item" data-product-id="${item.id}">
                            <img src="${item.image}" alt="${item.name}" />
                            <div class="bundle-info">
                                <h5>${item.name}</h5>
                                <div class="match-score">
                                    <span class="match-bar" style="width: ${item.matchScore * 100}%"></span>
                                </div>
                                <p class="match-text">${Math.round(item.matchScore * 100)}% match</p>
                                <p class="bundle-price">$${item.price}</p>
                                <span class="bundle-discount">-${item.bundleDiscount}% bundle</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="bundle-add-btn" onclick="addBundleToCart('${bundleItems.map(i => i.id).join(',')}')">
                    Add Bundle to Cart
                </button>
            </div>
        `;
    }
}

// Inventory Alert Widget
class InventoryAlertWidget {
    generateInventoryAlert(product) {
        const prediction = aiEngine.predictOutOfStock(product);

        if (!prediction.alert) return '';

        return `
            <div class="inventory-alert-${prediction.urgency}">
                <div class="alert-icon">
                    ${prediction.urgency === 'critical' ? '🔥' : '⚡'}
                </div>
                <div class="alert-content">
                    <strong>${prediction.alert}</strong>
                    <p>
                        ${prediction.daysToStockout > 0 
                            ? `Expected to sell out in ~${Math.ceil(prediction.daysToStockout)} days`
                            : 'Limited availability'}
                    </p>
                </div>
                <button class="alert-btn" onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.image}')">
                    Buy Now
                </button>
            </div>
        `;
    }
}

// Initialize all AI UI components
const sizeFitAdvisor = new SizeFitAdvisor();
const smartSearch = new SmartSearch();
const recommendationWidget = new RecommendationWidget();
const sentimentWidget = new ReviewSentimentWidget();
const sustainabilityWidget = new SustainabilityWidget();
const styleAdvisorWidget = new StyleAdvisorWidget();
const inventoryAlertWidget = new InventoryAlertWidget();
