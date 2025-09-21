// Contact Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeContactForm();
        initializeFAQ();
        loadContactData();
        console.log('Contact page initialized successfully');
    } catch (error) {
        console.error('Error initializing contact page:', error);
    }
});

// Contact Form
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const successDiv = document.getElementById('form-success');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitContactForm();
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.required && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Name validation (letters and spaces only)
    if (field.name === 'name' && value) {
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(value)) {
            isValid = false;
            errorMessage = 'Name should contain only letters and spaces';
        }
    }
    
    // Message length validation
    if (field.name === 'message' && value && value.length < 10) {
        isValid = false;
        errorMessage = 'Message should be at least 10 characters long';
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

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

function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('error');
    formGroup.classList.add('success');
    
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

function submitContactForm() {
    const form = document.getElementById('contact-form');
    const formData = new FormData(form);
    
    // Validate all fields
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showToast('Please correct the errors in the form', 'error');
        return;
    }
    
    // Show loading state
    form.classList.add('loading');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    
    // Simulate API call
    setTimeout(() => {
        // Save message to localStorage
        saveContactMessage(formData);
        
        // Show success
        showContactSuccess();
        form.reset();
        form.classList.remove('loading');
        submitBtn.textContent = originalText;
        
        // Clear form validation states
        form.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error', 'success');
        });
        
        showToast('Message sent successfully!', 'success');
    }, 2000);
}

function saveContactMessage(formData) {
    const messages = storage.get('contactMessages') || [];
    
    const message = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        timestamp: new Date().toISOString(),
        id: Date.now()
    };
    
    messages.push(message);
    
    // Keep only last 50 messages
    if (messages.length > 50) {
        messages.splice(0, messages.length - 50);
    }
    
    storage.set('contactMessages', messages);
    
    // Update analytics
    updateContactAnalytics(message);
}

function updateContactAnalytics(message) {
    const analytics = storage.get('contactAnalytics') || {
        totalMessages: 0,
        subjectBreakdown: {},
        monthlyStats: {}
    };
    
    analytics.totalMessages++;
    
    // Subject breakdown
    const subject = message.subject;
    analytics.subjectBreakdown[subject] = (analytics.subjectBreakdown[subject] || 0) + 1;
    
    // Monthly stats
    const month = new Date().toISOString().slice(0, 7); // YYYY-MM
    analytics.monthlyStats[month] = (analytics.monthlyStats[month] || 0) + 1;
    
    storage.set('contactAnalytics', analytics);
}

function showContactSuccess() {
    const form = document.querySelector('.contact-form');
    const success = document.getElementById('form-success');
    
    if (form && success) {
        form.style.display = 'none';
        success.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            form.style.display = 'block';
            success.style.display = 'none';
        }, 5000);
    }
}

// FAQ Accordion
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                
                // Scroll into view
                setTimeout(() => {
                    item.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }, 300);
            }
            
            // Track FAQ interaction
            trackFAQInteraction(question.textContent.trim());
        });
    });
}

function trackFAQInteraction(question) {
    const interactions = storage.get('faqInteractions') || {};
    interactions[question] = (interactions[question] || 0) + 1;
    storage.set('faqInteractions', interactions);
}

// Contact Data Management
function loadContactData() {
    // Load FAQ analytics
    loadFAQAnalytics();
}



function loadFAQAnalytics() {
    const interactions = storage.get('faqInteractions') || {};
    
    // Add view counter to FAQ items
    Object.entries(interactions).forEach(([question, count]) => {
        const faqItems = document.querySelectorAll('.faq-question h3');
        faqItems.forEach(questionElement => {
            if (questionElement.textContent.trim() === question) {
                const counter = document.createElement('span');
                counter.style.cssText = `
                    font-size: 0.8rem;
                    background: var(--accent-color);
                    color: var(--primary-color);
                    padding: 2px 6px;
                    border-radius: 10px;
                    margin-left: 0.5rem;
                `;
                counter.textContent = count;
                questionElement.appendChild(counter);
            }
        });
    });
}

// Contact form auto-fill for testing
function autoFillContactForm() {
    document.getElementById('name').value = 'John Doe';
    document.getElementById('email').value = 'john.doe@example.com';
    document.getElementById('subject').value = 'feedback';
    document.getElementById('message').value = 'This is a test message for the contact form functionality.';
}

// Export contact messages
function exportContactMessages() {
    const messages = storage.get('contactMessages') || [];
    
    if (messages.length === 0) {
        showToast('No messages to export', 'error');
        return;
    }
    
    const csvContent = [
        ['Name', 'Email', 'Subject', 'Message', 'Date'],
        ...messages.map(msg => [
            msg.name,
            msg.email,
            msg.subject,
            msg.message.replace(/"/g, '""'), // Escape quotes for CSV
            formatDate(msg.timestamp)
        ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `greenbite-contacts-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast('Contact messages exported successfully!', 'success');
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const form = document.getElementById('contact-form');
        if (form && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            submitContactForm();
        }
    }
    
    // Escape to close any open FAQ
    if (e.key === 'Escape') {
        document.querySelectorAll('.faq-item.active').forEach(item => {
            item.classList.remove('active');
        });
    }
});

// Contact form character counter for message
document.addEventListener('DOMContentLoaded', function() {
    const messageField = document.getElementById('message');
    if (messageField) {
        const counter = document.createElement('div');
        counter.style.cssText = `
            text-align: right;
            font-size: 0.8rem;
            color: var(--text-light);
            margin-top: 0.5rem;
        `;
        messageField.parentNode.appendChild(counter);
        
        messageField.addEventListener('input', function() {
            const length = this.value.length;
            counter.textContent = `${length}/500 characters`;
            
            if (length > 500) {
                counter.style.color = '#ff4444';
            } else if (length > 400) {
                counter.style.color = '#ff8800';
            } else {
                counter.style.color = 'var(--text-light)';
            }
        });
        
        // Set max length
        messageField.setAttribute('maxlength', '500');
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validateField, saveContactMessage, trackFAQInteraction };
}