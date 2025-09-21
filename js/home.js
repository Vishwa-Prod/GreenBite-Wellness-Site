// Home Page JavaScript

// Health quotes for rotation
const healthQuotes = [
    "\"A healthy outside starts from the inside.\" - Robert Urich",
    "\"Take care of your body. It's the only place you have to live.\" - Jim Rohn", 
    "\"Health is not about the weight you lose, but about the life you gain.\" - Dr. Josh Axe",
    "\"The first wealth is health.\" - Ralph Waldo Emerson",
    "\"Your body can stand almost anything. It's your mind that you have to convince.\" - Andrew Murphy",
    "\"To keep the body in good health is a duty... otherwise we shall not be able to keep our mind strong and clear.\" - Buddha",
    "\"The greatest revolution of our generation is the discovery that human beings can alter their lives by altering their attitudes.\" - William James",
    "\"Early to bed and early to rise makes a man healthy, wealthy, and wise.\" - Benjamin Franklin",
    "\"A man's health can be judged by which he takes two at a time - pills or stairs.\" - Joan Welsh",
    "\"Physical fitness is not only one of the most important keys to a healthy body, but it is the basis of dynamic and creative intellectual activity.\" - John F. Kennedy"
];

// Daily health tips
const healthTips = [
    "Drink a glass of water as soon as you wake up to kickstart your metabolism and hydrate your body after hours of sleep.",
    "Take the stairs instead of the elevator whenever possible - it's a simple way to add more movement to your day.",
    "Practice deep breathing for 5 minutes daily to reduce stress and improve mental clarity.",
    "Eat a handful of nuts or seeds as a snack - they're packed with healthy fats and protein.",
    "Stand up and stretch every hour if you have a desk job to prevent muscle stiffness and improve circulation.",
    "Include colorful vegetables in every meal - the more colors, the more nutrients you're getting.",
    "Get 7-9 hours of quality sleep each night to allow your body to repair and recharge.",
    "Take short walks after meals to aid digestion and help regulate blood sugar levels.",
    "Practice gratitude by writing down three things you're thankful for each day.",
    "Stay hydrated by drinking water throughout the day - aim for 8 glasses minimum.",
    "Limit processed foods and choose whole, natural ingredients whenever possible.",
    "Spend at least 10 minutes in natural sunlight daily for vitamin D and mood benefits.",
    "Practice mindful eating by chewing slowly and paying attention to your food.",
    "Include lean protein in every meal to help maintain muscle mass and keep you satisfied.",
    "Do some form of physical activity you enjoy - make exercise fun, not a chore.",
    "Limit screen time before bed to improve sleep quality and mental well-being.",
    "Connect with friends and family regularly - social relationships are vital for health.",
    "Try a new healthy recipe each week to keep your diet interesting and nutritious.",
    "Practice stress-reduction techniques like meditation, yoga, or listening to music.",
    "Keep healthy snacks readily available to avoid reaching for processed options when hungry."
];

// Home page initialization
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeRotatingQuotes();
        initializeDailyTip();
        initializeNewsletterForm();
        initializeFeatureAnimations();
        console.log('Home page initialized successfully');
    } catch (error) {
        console.error('Error initializing home page:', error);
    }
});

// Rotating quotes functionality
function initializeRotatingQuotes() {
    try {
        const quotesContainer = document.getElementById('rotating-quotes');
        if (!quotesContainer) {
            console.warn('Rotating quotes container not found');
            return;
        }

        let currentQuoteIndex = 0;
        const quotes = quotesContainer.querySelectorAll('.quote');
        
        if (quotes.length === 0) {
            console.warn('No quote elements found');
            return;
        }

        // Set up quotes rotation
        function rotateQuotes() {
            try {
                // Hide current quote
                if (quotes[currentQuoteIndex]) {
                    quotes[currentQuoteIndex].classList.remove('active');
                }
                
                // Move to next quote
                currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
                
                // Show next quote
                if (quotes[currentQuoteIndex]) {
                    quotes[currentQuoteIndex].classList.add('active');
                }
            } catch (error) {
                console.error('Error in quote rotation:', error);
            }
        }

        // Start rotation every 5 seconds
        setInterval(rotateQuotes, 5000);

        // Initialize with random quote
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quotes.forEach((quote, index) => {
            if (quote) {
                quote.classList.toggle('active', index === randomIndex);
            }
        });
        currentQuoteIndex = randomIndex;

        // Update quotes content with our health quotes array
        quotes.forEach((quote, index) => {
            if (quote && healthQuotes[index]) {
                quote.textContent = healthQuotes[index];
            }
        });
        
        console.log('Rotating quotes initialized successfully');
    } catch (error) {
        console.error('Error initializing rotating quotes:', error);
    }
}

// Daily health tip functionality with automatic rotation
function initializeDailyTip() {
    const tipText = document.getElementById('daily-tip-text');
    
    if (!tipText) return;

    let currentTipIndex = getTodaysTipIndex();
    let rotationTimer;
    const ROTATION_INTERVAL = 8000; // 8 seconds per tip
    
    function displayTip(index, animate = true) {
        if (animate) {
            // Fade out current tip
            tipText.classList.add('fade-out');
            
            setTimeout(() => {
                tipText.textContent = healthTips[index];
                tipText.classList.remove('fade-out');
                tipText.classList.add('fade-in');
                
                // Remove fade-in class after animation
                setTimeout(() => {
                    tipText.classList.remove('fade-in');
                }, 400);
            }, 200);
        } else {
            tipText.textContent = healthTips[index];
        }
    }

    function getTodaysTipIndex() {
        const today = new Date().toDateString();
        const stored = storage.get('dailyTip');
        
        if (stored && stored.date === today) {
            return stored.index;
        } else {
            // Generate new tip for today
            const newIndex = Math.floor(Math.random() * healthTips.length);
            storage.set('dailyTip', {
                date: today,
                index: newIndex
            });
            return newIndex;
        }
    }

    function getNextTip() {
        currentTipIndex = (currentTipIndex + 1) % healthTips.length;
        displayTip(currentTipIndex);
        
        // Update stored tip
        storage.set('dailyTip', {
            date: new Date().toDateString(),
            index: currentTipIndex
        });
    }

    function startAutoRotation() {
        rotationTimer = setInterval(() => {
            getNextTip();
        }, ROTATION_INTERVAL);
    }

    // Display initial tip without animation
    displayTip(currentTipIndex, false);
    
    // Start automatic rotation after 1 second
    setTimeout(() => {
        startAutoRotation();
    }, 1000);

    // Click to manually advance (with smooth animation)
    const tipCard = tipText.closest('.tip-card');
    tipCard?.addEventListener('click', () => {
        clearInterval(rotationTimer);
        getNextTip();
        
        // Add click animation
        tipCard.style.transform = 'scale(0.98)';
        setTimeout(() => {
            tipCard.style.transform = 'scale(1)';
        }, 150);
        
        // Restart auto rotation after manual advance
        setTimeout(() => {
            startAutoRotation();
        }, 1000);
    });
}

// Newsletter signup functionality
function initializeNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterEmail = document.getElementById('newsletter-email');
    const newsletterMessage = document.getElementById('newsletter-message');
    
    if (!newsletterForm || !newsletterEmail || !newsletterMessage) return;

    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = newsletterEmail.value.trim();
        
        // Validate email
        if (!email) {
            showMessage('Please enter your email address.', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Check if already subscribed
        const subscribers = storage.get('newsletterSubscribers') || [];
        if (subscribers.includes(email)) {
            showMessage('You are already subscribed to our newsletter!', 'error');
            return;
        }

        // Simulate API call
        const submitBtn = newsletterForm.querySelector('button[type="submit"]');
        showLoading(submitBtn, true);
        
        setTimeout(() => {
            // Add to subscribers list
            subscribers.push(email);
            storage.set('newsletterSubscribers', subscribers);
            
            // Clear form and show success
            newsletterEmail.value = '';
            showMessage('Thank you for subscribing! You\'ll receive our weekly newsletter soon.', 'success');
            showLoading(submitBtn, false);
            
            // Show toast notification
            showToast('Successfully subscribed to newsletter!', 'success');
            
            // Track subscription
            trackNewsletterSubscription(email);
        }, 1500);
    });

    function showMessage(message, type) {
        newsletterMessage.textContent = message;
        newsletterMessage.className = `newsletter-message ${type}`;
        
        // Auto-clear message after 5 seconds
        setTimeout(() => {
            newsletterMessage.textContent = '';
            newsletterMessage.className = 'newsletter-message';
        }, 5000);
    }

    function trackNewsletterSubscription(email) {
        // Track subscription analytics
        const subscriptions = storage.get('subscriptionAnalytics') || {
            total: 0,
            dates: []
        };
        
        subscriptions.total += 1;
        subscriptions.dates.push({
            email: email.replace(/(.{3}).*(@.*)/, '$1***$2'), // Anonymize email
            date: new Date().toISOString(),
            source: 'homepage'
        });
        
        // Keep only last 100 entries
        if (subscriptions.dates.length > 100) {
            subscriptions.dates = subscriptions.dates.slice(-100);
        }
        
        storage.set('subscriptionAnalytics', subscriptions);
    }
}

// Feature cards animation
function initializeFeatureAnimations() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
        // Add hover sound effect (optional)
        card.addEventListener('mouseenter', function() {
            if (window.AudioContext || window.webkitAudioContext) {
                playHoverSound();
            }
        });
        
        // Add click tracking
        card.addEventListener('click', function(e) {
            const link = card.querySelector('.feature-link');
            if (link && !e.target.closest('.feature-link')) {
                // Track feature card clicks
                trackFeatureClick(link.textContent.trim());
            }
        });
        
        // Animate icon on scroll
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const icon = entry.target.querySelector('.feature-icon');
                    if (icon) {
                        icon.style.animation = 'pulse 2s ease-in-out infinite';
                    }
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(card);
    });
}

// Sound effects
function playHoverSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Silent fail if audio context not supported
    }
}

// Analytics tracking
function trackFeatureClick(featureName) {
    const clicks = storage.get('featureClicks') || {};
    clicks[featureName] = (clicks[featureName] || 0) + 1;
    clicks.lastClicked = new Date().toISOString();
    storage.set('featureClicks', clicks);
}

// Export functions for testing if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        healthQuotes,
        healthTips,
        trackFeatureClick,
        playHoverSound
    };
}