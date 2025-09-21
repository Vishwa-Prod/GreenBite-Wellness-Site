// Recipes Page JavaScript

// Global variables
let allRecipes = [];
let filteredRecipes = [];
let currentFilter = 'all';

// Show error message to user
function showErrorMessage(message) {
    const cardsContainer = document.getElementById('recipe-cards');
    if (cardsContainer) {
        cardsContainer.innerHTML = `
            <div class="no-results">
                <h3>⚠️ Error Loading Recipes</h3>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">Refresh Page</button>
            </div>
        `;
    }
    
    // Also show toast notification
    if (typeof showToast === 'function') {
        showToast(message, 'error');
    }
}

// Initialize recipes page
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('Initializing recipes page...');
        loadRecipeData();
        initializeFilters();
        initializeSearch();
        initializeModal();
        console.log('Recipes page initialized successfully');
    } catch (error) {
        console.error('Error initializing recipes page:', error);
        showErrorMessage('Failed to load recipes. Please refresh the page.');
    }
});

// Load recipe data
function loadRecipeData() {
    try {
        // Check if recipesData is available
        if (typeof recipesData === 'undefined') {
            console.error('Recipe data not found. Make sure data/recipes.js is loaded.');
            showErrorMessage('Recipe data not available. Please refresh the page.');
            return;
        }
        
        // In a real app, this would be an API call
        allRecipes = recipesData;
        filteredRecipes = [...allRecipes];
        console.log(`Loaded ${allRecipes.length} recipes`);
        renderRecipeCards();
    } catch (error) {
        console.error('Error loading recipe data:', error);
        showErrorMessage('Failed to load recipes. Please try again.');
    }
}

// Initialize filter functionality
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Apply filter
            currentFilter = this.getAttribute('data-filter');
            applyFilters();
        });
    });
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('recipe-search');
    if (!searchInput) return;

    const debouncedSearch = debounce(function(query) {
        filterBySearch(query);
    }, 300);

    searchInput.addEventListener('input', function() {
        debouncedSearch(this.value.trim().toLowerCase());
    });
}

// Apply category filters
function applyFilters() {
    if (currentFilter === 'all') {
        filteredRecipes = [...allRecipes];
    } else {
        filteredRecipes = allRecipes.filter(recipe => recipe.category === currentFilter);
    }
    
    // Apply search if there's a search query
    const searchInput = document.getElementById('recipe-search');
    if (searchInput && searchInput.value.trim()) {
        filterBySearch(searchInput.value.trim().toLowerCase());
    } else {
        renderRecipeCards();
    }
}

// Filter by search query
function filterBySearch(query) {
    if (!query) {
        applyFilters();
        return;
    }

    const searchResults = filteredRecipes.filter(recipe => {
        return recipe.title.toLowerCase().includes(query) ||
               recipe.description.toLowerCase().includes(query) ||
               recipe.ingredients.some(ingredient => 
                   ingredient.toLowerCase().includes(query)) ||
               recipe.tags.some(tag => tag.toLowerCase().includes(query));
    });

    filteredRecipes = searchResults;
    renderRecipeCards();
}

// Render recipe cards
function renderRecipeCards() {
    const cardsContainer = document.getElementById('recipe-cards');
    if (!cardsContainer) {
        console.error('Recipe cards container not found');
        return;
    }

    try {
        // Show loading state
        cardsContainer.innerHTML = `
            <div class="loading-recipes">
                <div class="loading-spinner"></div>
                Loading delicious recipes...
            </div>
        `;

        // Simulate loading delay for better UX
        setTimeout(() => {
            if (!filteredRecipes || filteredRecipes.length === 0) {
                cardsContainer.innerHTML = `
                    <div class="no-results">
                        <h3>No recipes found</h3>
                        <p>Try adjusting your search or filter criteria.</p>
                        <button class="btn btn-primary" onclick="clearFilters()">Show All Recipes</button>
                    </div>
                `;
                return;
            }

            const cardsHTML = filteredRecipes.map(recipe => {
                if (!recipe || !recipe.id) {
                    console.warn('Invalid recipe data:', recipe);
                    return '';
                }
                return createRecipeCard(recipe);
            }).filter(html => html !== '').join('');
            
            if (cardsHTML) {
                cardsContainer.innerHTML = cardsHTML;
                
                // Add event listeners to new cards
                addCardEventListeners();
                
                // Animate cards in
                animateCardsIn();
                
                console.log(`Rendered ${filteredRecipes.length} recipe cards`);
            } else {
                showErrorMessage('No valid recipes to display.');
            }
        }, 500);
    } catch (error) {
        console.error('Error rendering recipe cards:', error);
        showErrorMessage('Failed to display recipes. Please try again.');
    }
}

// Create individual recipe card HTML
function createRecipeCard(recipe) {
    return `
        <div class="recipe-card" data-recipe-id="${recipe.id}" onclick="openRecipeModal(${recipe.id})">
            <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image" loading="lazy">
            <div class="recipe-content">
                <h3 class="recipe-title">${recipe.title}</h3>
                <p class="recipe-description">${recipe.description}</p>
                <div class="recipe-meta">
                    <span class="recipe-category">${recipe.category}</span>
                    <div class="recipe-stats">
                        <span class="recipe-stat">
                            <span>⏱️</span> ${recipe.totalTime}
                        </span>
                        <span class="recipe-stat">
                            <span>👥</span> ${recipe.servings}
                        </span>
                        <span class="recipe-stat">
                            <span>🔥</span> ${recipe.difficulty}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Add event listeners to recipe cards
function addCardEventListeners() {
    const recipeCards = document.querySelectorAll('.recipe-card');
    
    recipeCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            playHoverSound();
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Animate cards in
function animateCardsIn() {
    const cards = document.querySelectorAll('.recipe-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Modal functionality
function initializeModal() {
    const modal = document.getElementById('recipe-modal');
    const closeBtn = modal?.querySelector('.close-modal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            closeModal('recipe-modal');
        });
    }
    
    // Initialize tab switching
    initializeModalTabs();
}

// Initialize modal tabs
function initializeModalTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Update active button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show target panel
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
            });
            document.getElementById(`${targetTab}-panel`).classList.add('active');
        });
    });
}

// Open recipe modal
function openRecipeModal(recipeId) {
    const recipe = allRecipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    populateModal(recipe);
    openModal('recipe-modal');
    
    // Track recipe view
    trackRecipeView(recipe);
}

// Populate modal with recipe data
function populateModal(recipe) {
    // Update modal image and title
    document.getElementById('modal-image').src = recipe.image;
    document.getElementById('modal-image').alt = recipe.title;
    document.getElementById('modal-title').textContent = recipe.title;
    
    // Update meta information
    document.getElementById('modal-prep-time').textContent = `⏱️ ${recipe.totalTime}`;
    document.getElementById('modal-difficulty').textContent = `🔥 ${recipe.difficulty}`;
    document.getElementById('modal-servings').textContent = `👥 ${recipe.servings} servings`;
    
    // Populate ingredients
    const ingredientsList = document.getElementById('modal-ingredients');
    ingredientsList.innerHTML = recipe.ingredients
        .map(ingredient => `<li>${ingredient}</li>`)
        .join('');
    
    // Populate instructions
    const instructionsList = document.getElementById('modal-instructions');
    instructionsList.innerHTML = recipe.instructions
        .map(instruction => `<li>${instruction}</li>`)
        .join('');
    
    // Populate nutrition table
    const nutritionTable = document.getElementById('modal-nutrition');
    nutritionTable.innerHTML = `
        <thead>
            <tr>
                <th>Nutrient</th>
                <th>Amount</th>
                <th>% Daily Value*</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Calories</td>
                <td class="nutrition-value">${recipe.nutrition.calories}</td>
                <td>${Math.round((recipe.nutrition.calories / 2000) * 100)}%</td>
            </tr>
            <tr>
                <td>Protein</td>
                <td class="nutrition-value">${recipe.nutrition.protein}g</td>
                <td>${Math.round((recipe.nutrition.protein / 50) * 100)}%</td>
            </tr>
            <tr>
                <td>Carbohydrates</td>
                <td class="nutrition-value">${recipe.nutrition.carbs}g</td>
                <td>${Math.round((recipe.nutrition.carbs / 300) * 100)}%</td>
            </tr>
            <tr>
                <td>Fat</td>
                <td class="nutrition-value">${recipe.nutrition.fat}g</td>
                <td>${Math.round((recipe.nutrition.fat / 65) * 100)}%</td>
            </tr>
            <tr>
                <td>Fiber</td>
                <td class="nutrition-value">${recipe.nutrition.fiber}g</td>
                <td>${Math.round((recipe.nutrition.fiber / 25) * 100)}%</td>
            </tr>
            <tr>
                <td>Sugar</td>
                <td class="nutrition-value">${recipe.nutrition.sugar}g</td>
                <td>-</td>
            </tr>
            <tr>
                <td>Sodium</td>
                <td class="nutrition-value">${recipe.nutrition.sodium}mg</td>
                <td>${Math.round((recipe.nutrition.sodium / 2300) * 100)}%</td>
            </tr>
        </tbody>
    `;
}

// Clear all filters
function clearFilters() {
    // Reset filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('[data-filter="all"]').classList.add('active');
    
    // Clear search
    const searchInput = document.getElementById('recipe-search');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Reset filters
    currentFilter = 'all';
    filteredRecipes = [...allRecipes];
    renderRecipeCards();
}

// Track recipe interactions
function trackRecipeView(recipe) {
    const views = storage.get('recipeViews') || {};
    views[recipe.id] = (views[recipe.id] || 0) + 1;
    views.lastViewed = new Date().toISOString();
    storage.set('recipeViews', views);
    
    // Track popular recipes
    updatePopularRecipes(recipe);
}

function updatePopularRecipes(recipe) {
    const popular = storage.get('popularRecipes') || [];
    const existing = popular.find(p => p.id === recipe.id);
    
    if (existing) {
        existing.views++;
        existing.lastViewed = new Date().toISOString();
    } else {
        popular.push({
            id: recipe.id,
            title: recipe.title,
            views: 1,
            lastViewed: new Date().toISOString()
        });
    }
    
    // Sort by views and keep top 10
    popular.sort((a, b) => b.views - a.views);
    storage.set('popularRecipes', popular.slice(0, 10));
}

// Sound effects for interactions
function playHoverSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Silent fail if audio context not supported
    }
}

// Recipe favorites functionality
function toggleFavorite(recipeId) {
    const favorites = storage.get('favoriteRecipes') || [];
    const index = favorites.indexOf(recipeId);
    
    if (index > -1) {
        favorites.splice(index, 1);
        showToast('Recipe removed from favorites', 'success');
    } else {
        favorites.push(recipeId);
        showToast('Recipe added to favorites', 'success');
    }
    
    storage.set('favoriteRecipes', favorites);
    updateFavoriteButtons();
}

function updateFavoriteButtons() {
    const favorites = storage.get('favoriteRecipes') || [];
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    
    favoriteButtons.forEach(btn => {
        const recipeId = parseInt(btn.getAttribute('data-recipe-id'));
        btn.classList.toggle('active', favorites.includes(recipeId));
    });
}

// Recipe sharing functionality
function shareRecipe(recipeId) {
    const recipe = allRecipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    if (navigator.share) {
        navigator.share({
            title: recipe.title,
            text: recipe.description,
            url: window.location.href + '#recipe-' + recipeId
        }).then(() => {
            showToast('Recipe shared successfully!', 'success');
        }).catch(err => {
            console.log('Error sharing:', err);
        });
    } else {
        // Fallback: copy to clipboard
        const shareText = `${recipe.title}\n\n${recipe.description}\n\nCheck it out at: ${window.location.href}#recipe-${recipeId}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                showToast('Recipe link copied to clipboard!', 'success');
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = shareText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast('Recipe link copied to clipboard!', 'success');
        }
    }
}

// Initialize keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape key to close modal
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            closeModal(activeModal.id);
        }
    }
    
    // Ctrl/Cmd + F to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.getElementById('recipe-search');
        if (searchInput) {
            searchInput.focus();
        }
    }
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createRecipeCard,
        filterBySearch,
        trackRecipeView,
        toggleFavorite
    };
}