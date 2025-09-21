// Calculator Page JavaScript

// Global variables
let calculationResults = {};

// Initialize calculator page
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    initializeResultsSection();
});

// Initialize form functionality
function initializeForm() {
    const form = document.getElementById('nutrition-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateNutrition();
    });
    
    // Add real-time validation
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Validate individual form field
function validateField(field) {
    const formGroup = field.closest('.form-group');
    const fieldName = field.name || field.id;
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous errors
    clearFieldError(field);
    
    // Check if required field is empty
    if (field.required && !field.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Specific validations
    switch (fieldName) {
        case 'age':
            const age = parseInt(field.value);
            if (age && (age < 15 || age > 100)) {
                isValid = false;
                errorMessage = 'Please enter an age between 15 and 100';
            }
            break;
            
        case 'height':
            const height = parseInt(field.value);
            if (height && (height < 100 || height > 250)) {
                isValid = false;
                errorMessage = 'Please enter a height between 100-250 cm';
            }
            break;
            
        case 'weight':
            const weight = parseFloat(field.value);
            if (weight && (weight < 30 || weight > 300)) {
                isValid = false;
                errorMessage = 'Please enter a weight between 30-300 kg';
            }
            break;
    }
    
    // Show error if validation failed
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.add('error');
    
    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

// Clear field error
function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('error');
    
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Main calculation function
function calculateNutrition() {
    const formData = gatherFormData();
    
    // Validate all fields
    if (!validateAllFields(formData)) {
        showToast('Please correct the errors in the form', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('#nutrition-form button[type="submit"]');
    showLoading(submitBtn, true);
    
    // Simulate calculation delay for better UX
    setTimeout(() => {
        try {
            // Calculate BMR using Mifflin-St Jeor Equation
            const bmr = calculateBMR(formData);
            
            // Calculate TDEE (Total Daily Energy Expenditure)
            const tdee = calculateTDEE(bmr, formData.activity);
            
            // Calculate target calories based on goal
            const targetCalories = calculateTargetCalories(tdee, formData.goal);
            
            // Calculate macronutrient breakdown
            const macros = calculateMacros(targetCalories);
            
            // Store results
            calculationResults = {
                bmr: Math.round(bmr),
                tdee: Math.round(tdee),
                targetCalories: Math.round(targetCalories),
                macros: macros,
                formData: formData,
                calculatedAt: new Date().toISOString()
            };
            
            // Display results
            displayResults();
            
            // Save to localStorage
            storage.set('lastCalculation', calculationResults);
            
            // Track calculation
            trackCalculation(calculationResults);
            
        } catch (error) {
            console.error('Calculation error:', error);
            showToast('Error calculating nutrition. Please try again.', 'error');
        } finally {
            showLoading(submitBtn, false);
        }
    }, 1000);
}

// Gather form data
function gatherFormData() {
    return {
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,
        height: parseInt(document.getElementById('height').value),
        weight: parseFloat(document.getElementById('weight').value),
        activity: parseFloat(document.getElementById('activity').value),
        goal: document.getElementById('goal').value
    };
}

// Validate all form fields
function validateAllFields(formData) {
    let isValid = true;
    
    // Check all required fields
    Object.entries(formData).forEach(([key, value]) => {
        if (!value || value === '') {
            const field = document.getElementById(key);
            if (field) {
                showFieldError(field, 'This field is required');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// Calculate BMR (Basal Metabolic Rate)
function calculateBMR(data) {
    // Mifflin-St Jeor Equation
    if (data.gender === 'male') {
        return (10 * data.weight) + (6.25 * data.height) - (5 * data.age) + 5;
    } else {
        return (10 * data.weight) + (6.25 * data.height) - (5 * data.age) - 161;
    }
}

// Calculate TDEE (Total Daily Energy Expenditure)
function calculateTDEE(bmr, activityLevel) {
    return bmr * activityLevel;
}

// Calculate target calories based on goal
function calculateTargetCalories(tdee, goal) {
    switch (goal) {
        case 'lose':
            return tdee - 500; // 500 calorie deficit for ~1lb/week loss
        case 'gain':
            return tdee + 500; // 500 calorie surplus for ~1lb/week gain
        case 'maintain':
        default:
            return tdee;
    }
}

// Calculate macronutrient breakdown
function calculateMacros(calories) {
    // Using 30-40-30 (protein-carbs-fat) split
    const proteinCalories = calories * 0.30;
    const carbsCalories = calories * 0.40;
    const fatCalories = calories * 0.30;
    
    return {
        protein: {
            grams: Math.round(proteinCalories / 4), // 4 calories per gram
            calories: Math.round(proteinCalories),
            percentage: 30
        },
        carbs: {
            grams: Math.round(carbsCalories / 4), // 4 calories per gram
            calories: Math.round(carbsCalories),
            percentage: 40
        },
        fat: {
            grams: Math.round(fatCalories / 9), // 9 calories per gram
            calories: Math.round(fatCalories),
            percentage: 30
        }
    };
}

// Display calculation results
function displayResults() {
    const resultsSection = document.getElementById('results-section');
    if (!resultsSection) return;
    
    // Show results section with smooth animation
    resultsSection.style.display = 'block';
    resultsSection.style.opacity = '0';
    resultsSection.style.transform = 'translateY(30px)';
    
    // Trigger smooth fade-in
    setTimeout(() => {
        resultsSection.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        resultsSection.style.opacity = '1';
        resultsSection.style.transform = 'translateY(0)';
    }, 50);
    
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }, 300);
    
    // Animate counters with staggered timing for smooth sequence
    setTimeout(() => animateCounter('bmr-counter', 0, calculationResults.bmr, 1800), 200);
    setTimeout(() => animateCounter('tdee-counter', 0, calculationResults.tdee, 1800), 400);
    setTimeout(() => animateCounter('target-counter', 0, calculationResults.targetCalories, 1800), 600);
    
    // Update macronutrient values
    setTimeout(() => updateMacroValues(), 800);
    
    // Animate progress bars with smooth delay
    setTimeout(() => {
        animateProgressBars();
    }, 1200);
}

// Animate number counters with smooth easing
function animateCounter(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.classList.add('animating');
    
    const startTime = performance.now();
    const range = end - start;
    
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        
        const current = start + (range * easedProgress);
        element.textContent = Math.round(current).toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.classList.remove('animating');
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Update macro values
function updateMacroValues() {
    const macros = calculationResults.macros;
    
    document.getElementById('protein-text').textContent = 
        `${macros.protein.grams}g (${macros.protein.calories} calories)`;
    document.getElementById('carbs-text').textContent = 
        `${macros.carbs.grams}g (${macros.carbs.calories} calories)`;
    document.getElementById('fats-text').textContent = 
        `${macros.fat.grams}g (${macros.fat.calories} calories)`;
}

// Animate progress bars with staggered timing
function animateProgressBars() {
    const proteinFill = document.querySelector('.protein-fill');
    const carbsFill = document.querySelector('.carbs-fill');
    const fatsFill = document.querySelector('.fats-fill');
    
    // Stagger the progress bar animations for smooth effect
    if (proteinFill) {
        setTimeout(() => proteinFill.style.width = '30%', 0);
    }
    if (carbsFill) {
        setTimeout(() => carbsFill.style.width = '40%', 200);
    }
    if (fatsFill) {
        setTimeout(() => fatsFill.style.width = '30%', 400);
    }
}



// Initialize results section
function initializeResultsSection() {
    // Load previous calculation if exists
    const lastCalculation = storage.get('lastCalculation');
    if (lastCalculation && isRecentCalculation(lastCalculation)) {
        calculationResults = lastCalculation;
        populateFormFromCalculation(lastCalculation);
        displayResults();
    }
}

// Check if calculation is recent (within 24 hours)
function isRecentCalculation(calculation) {
    const calculatedAt = new Date(calculation.calculatedAt);
    const now = new Date();
    const hoursDiff = (now - calculatedAt) / (1000 * 60 * 60);
    return hoursDiff < 24;
}

// Populate form from previous calculation
function populateFormFromCalculation(calculation) {
    const data = calculation.formData;
    if (!data) return;
    
    Object.entries(data).forEach(([key, value]) => {
        const field = document.getElementById(key);
        if (field && value) {
            field.value = value;
        }
    });
}

// Track calculation analytics
function trackCalculation(results) {
    const analytics = storage.get('calculationAnalytics') || {
        total: 0,
        calculations: []
    };
    
    analytics.total += 1;
    analytics.calculations.push({
        bmr: results.bmr,
        tdee: results.tdee,
        targetCalories: results.targetCalories,
        goal: results.formData.goal,
        gender: results.formData.gender,
        age: results.formData.age,
        calculatedAt: results.calculatedAt
    });
    
    // Keep only last 50 calculations
    if (analytics.calculations.length > 50) {
        analytics.calculations = analytics.calculations.slice(-50);
    }
    
    storage.set('calculationAnalytics', analytics);
}

// Export calculation data
function exportCalculationData() {
    if (!calculationResults || Object.keys(calculationResults).length === 0) {
        showToast('No calculation data to export', 'error');
        return;
    }
    
    const exportData = {
        ...calculationResults,
        exportedAt: new Date().toISOString(),
        appVersion: '1.0.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `greenbite-nutrition-calculation-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast('Calculation data exported successfully!', 'success');
}

// Reset calculator
function resetCalculator() {
    const form = document.getElementById('nutrition-form');
    const resultsSection = document.getElementById('results-section');
    
    if (form) form.reset();
    if (resultsSection) resultsSection.style.display = 'none';
    
    calculationResults = {};
    storage.remove('lastCalculation');
    
    showToast('Calculator reset successfully', 'success');
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to calculate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const form = document.getElementById('nutrition-form');
        if (form) {
            calculateNutrition();
        }
    }
    
    // Ctrl/Cmd + R to reset (prevent browser reload)
    if ((e.ctrlKey || e.metaKey) && e.key === 'r' && e.shiftKey) {
        e.preventDefault();
        resetCalculator();
    }
});

// Add export and reset buttons to results section
document.addEventListener('DOMContentLoaded', function() {
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) {
        const actionButtons = document.createElement('div');
        actionButtons.className = 'calculation-actions';
        actionButtons.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 2rem;
            flex-wrap: wrap;
        `;
        
        actionButtons.innerHTML = `
            <button class="btn btn-outline" onclick="exportCalculationData()">
                📊 Export Data
            </button>
            <button class="btn btn-secondary" onclick="resetCalculator()">
                🔄 Reset Calculator
            </button>
        `;
        
        resultsSection.appendChild(actionButtons);
    }
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateBMR,
        calculateTDEE,
        calculateTargetCalories,
        calculateMacros,
        validateField
    };
}