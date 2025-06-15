/**
 * Daejeon Foreign Residents Portal - Main JavaScript File
 * Handles language switching and interactive functionality
 */

// Global variables
let currentLanguage = 'ko';
const supportedLanguages = ['ko', 'en'];

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    // Initialize language switcher
    initializeLanguageSwitcher();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize card animations
    initializeCardAnimations();
    
    // Initialize accessibility features
    initializeAccessibility();
    
    // Load saved language preference
    loadLanguagePreference();
    
    console.log('Daejeon Foreign Residents Portal initialized successfully');
}

/**
 * Initialize language switcher functionality
 */
function initializeLanguageSwitcher() {
    const languageSelect = document.getElementById('languageSelect');
    
    if (languageSelect) {
        // Add event listener for language change
        languageSelect.addEventListener('change', function(e) {
            const selectedLanguage = e.target.value;
            switchLanguage(selectedLanguage);
        });
        
        // Set initial language
        languageSelect.value = currentLanguage;
    }
}

/**
 * Switch language display
 * @param {string} language - Language code ('ko' or 'en')
 */
function switchLanguage(language) {
    if (!supportedLanguages.includes(language)) {
        console.error('Unsupported language:', language);
        return;
    }
    
    // Update current language
    currentLanguage = language;
    
    // Update HTML lang attribute - this triggers CSS language switching
    document.documentElement.lang = language;
    
    // Update page title based on current language
    updatePageTitle(language);
    
    // Save language preference
    saveLanguagePreference(language);
    
    // Specifically update subject options in the modal
    const subjectSelect = document.getElementById('contactSubject');
    if (subjectSelect) {
        const options = subjectSelect.querySelectorAll('option');
        let anOptionWasSelected = false;
        options.forEach(option => {
            if (option.getAttribute('lang') === language) {
                option.style.display = ''; // Show
                if(!anOptionWasSelected && subjectSelect.value !== option.value) {
                    // If current selection is hidden, try to select the first visible one
                    // This is a basic way, might need refinement based on exact UX desired
                }
            } else if (option.getAttribute('lang')) { // if it has a lang attribute and it's not the current one
                option.style.display = 'none'; // Hide
            }
        });

        // Ensure at least one option is visible and selected if possible
        let firstVisibleValue = null;
        for(let opt of options) {
            if(opt.style.display !== 'none') {
                firstVisibleValue = opt.value;
                break;
            }
        }
        if(subjectSelect.selectedOptions.length === 0 || subjectSelect.selectedOptions[0].style.display === 'none') {
            if(firstVisibleValue) subjectSelect.value = firstVisibleValue;
        }
    }

    // Update language selector
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect && languageSelect.value !== language) {
        languageSelect.value = language;
    }
    
    // Trigger custom event for language change
    const event = new CustomEvent('languageChanged', {
        detail: { language: language }
    });
    document.dispatchEvent(event);
    
    console.log('Language switched to:', language);
}

/**
 * Update page title based on current language
 * @param {string} language - Language code
 */
function updatePageTitle(language) {
    const titleElements = document.querySelectorAll(`title[lang="${language}"]`);
    if (titleElements.length > 0) {
        const visibleTitle = titleElements[0];
        if (visibleTitle && visibleTitle.textContent) {
            document.title = visibleTitle.textContent;
        }
    }
}

/**
 * Save language preference to localStorage
 * @param {string} language - Language code
 */
function saveLanguagePreference(language) {
    try {
        localStorage.setItem('preferredLanguage', language);
    } catch (error) {
        console.warn('Could not save language preference:', error);
    }
}

/**
 * Load language preference from localStorage
 */
function loadLanguagePreference() {
    try {
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
            const languageSelect = document.getElementById('languageSelect');
            if (languageSelect) {
                languageSelect.value = savedLanguage;
                switchLanguage(savedLanguage);
            }
        }
    } catch (error) {
        console.warn('Could not load language preference:', error);
    }
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#"
            if (href === '#') {
                return;
            }
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Initialize card hover animations
 */
function initializeCardAnimations() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        // Add fade-in animation on page load
        card.classList.add('fade-in');
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Initialize accessibility features
 */
function initializeAccessibility() {
    // Add keyboard navigation support
    const interactiveElements = document.querySelectorAll('.card, .btn, a');
    
    interactiveElements.forEach(element => {
        element.addEventListener('keydown', function(e) {
            // Add visual feedback for keyboard focus
            if (e.key === 'Tab') {
                this.classList.add('keyboard-focused');
            }
        });
        
        element.addEventListener('blur', function() {
            this.classList.remove('keyboard-focused');
        });
    });
    
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    const mainContent = document.querySelector('main');
    
    if (skipLink && mainContent) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            mainContent.focus();
            mainContent.scrollIntoView();
        });
    }
}

/**
 * Handle external link clicks
 * Add analytics tracking and ensure proper target="_blank" handling
 */
function handleExternalLinks() {
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    
    externalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add rel="noopener noreferrer" for security
            if (!this.rel.includes('noopener')) {
                this.rel += ' noopener noreferrer';
            }
            
            // Track external link clicks
            trackExternalLinkClick(this.href);
        });
    });
}

/**
 * Track external link clicks (placeholder for analytics)
 * @param {string} url - The external URL clicked
 */
function trackExternalLinkClick(url) {
    console.log('External link clicked:', url);
    
    // Here you would integrate with your analytics service
    // Example: gtag('event', 'click', { 'event_category': 'external_link', 'event_label': url });
}

/**
 * Handle responsive navigation
 */
function initializeNavigation() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // Close mobile menu when clicking on a link
        const navLinks = navbarCollapse.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Close mobile menu
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            });
        });
    }
}

/**
 * Initialize search functionality (if implemented)
 */
function initializeSearch() {
    const searchInput = document.querySelector('#searchInput');
    const searchResults = document.querySelector('#searchResults');
    
    if (searchInput && searchResults) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.trim();
            
            // Clear previous timeout
            clearTimeout(searchTimeout);
            
            // Set new timeout for search
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 300);
        });
    }
}

/**
 * Perform search operation
 * @param {string} query - Search query
 */
function performSearch(query) {
    if (query.length < 2) {
        return;
    }
    
    // This would integrate with your search functionality
    console.log('Searching for:', query);
    
    // Example search implementation would go here
}

/**
 * Handle form submissions
 */
function initializeForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // Basic form validation
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showFormError(currentLanguage === 'ko' ? 
                    '필수 필드를 모두 입력해주세요.' : 
                    'Please fill in all required fields.');
            }
        });
    });
}

/**
 * Show form error message
 * @param {string} message - Error message to display
 */
function showFormError(message) {
    // Create or update error message element
    let errorElement = document.querySelector('.form-error-message');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'alert alert-danger form-error-message';
        errorElement.setAttribute('role', 'alert');
    }
    
    errorElement.textContent = message;
    
    // Insert error message at the top of the form
    const form = document.querySelector('form');
    if (form) {
        form.insertBefore(errorElement, form.firstChild);
        errorElement.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Initialize tooltips and popovers (if Bootstrap is loaded)
 */
function initializeTooltips() {
    // Check if Bootstrap tooltips are available
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

/**
 * Utility function to debounce function calls
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility function to throttle function calls
 * @param {function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Load and inject HTML content from a file into a placeholder.
 * @param {string} filePath - Path to the HTML file to load.
 * @param {string} placeholderId - ID of the element to inject HTML into.
 */
async function loadHTML(filePath, placeholderId) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
        console.error(`Placeholder element with ID '${placeholderId}' not found.`);
        return;
    }

    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to load ${filePath}: ${response.status} ${response.statusText}`);
        }
        const htmlContent = await response.text();
        placeholder.innerHTML = htmlContent;

        // After loading footer, re-apply language switch to its content
        // This is important because the footer content is added AFTER initial language setup
        if (placeholderId === 'footer-placeholder') {
           switchLanguage(currentLanguage); // Re-apply current language to newly added content
        }

    } catch (error) {
        console.error('Error loading HTML:', error);
        placeholder.innerHTML = `<p class="text-danger">Error loading content from ${filePath}.</p>`;
    }
}

/**
 * Initialize contact form functionality
 */
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    const contactModalElement = document.getElementById('contactModal');
    let contactModalInstance;

    if (!contactModalElement) {
        console.error("Modal element #contactModal not found in the DOM!");
        return; // Exit if modal HTML isn't there
    }

    if (contactModalElement) {
        contactModalInstance = new bootstrap.Modal(contactModalElement);
    }


    if (contactForm && contactModalInstance) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent actual form submission

            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const subject = document.getElementById('contactSubject').value;
            const message = document.getElementById('contactMessage').value;

            // Basic validation (Bootstrap's `required` handles some of this)
            if (!name || !email || !message) {
                alert(currentLanguage === 'ko' ? '이름, 이메일, 메시지를 모두 입력해주세요.' : 'Please fill in Name, Email, and Message.');
                return;
            }

            console.log('Form Submitted (Demo):');
            console.log('Name:', name);
            console.log('Email:', email);
            console.log('Subject:', subject);
            console.log('Message:', message);

            // Here you would typically send the data to a server using fetch() or XMLHttpRequest
            // For demo purposes, we'll just show an alert and close the modal.

            alert(currentLanguage === 'ko' ? '메시지가 (데모로) 전송되었습니다. 감사합니다!' : 'Your message has been (demo) sent. Thank you!');

            contactForm.reset(); // Clear the form
            contactModalInstance.hide(); // Close the modal
        });
    }

    // Optional: Pre-select subject if triggered by specific buttons
    // This requires adding data attributes to your trigger buttons/links
    if (contactModalElement) {
        contactModalElement.addEventListener('show.bs.modal', function (event) {
            // event.relatedTarget is the button that triggered the modal
            const triggerButton = event.relatedTarget;
            if (triggerButton) {
                const subjectType = triggerButton.getAttribute('data-form-subject'); // e.g., "feedback" or "inquiry"
                const subjectSelect = document.getElementById('contactSubject');
                if (subjectType && subjectSelect) {
                    subjectSelect.value = subjectType;
                } else if (subjectSelect) {
                    // Default to feedback if no specific subject is passed
                    subjectSelect.value = "feedback";
                }
            }
        });
    }
}


/**
 * Initialize the application
 */
async function initializeApp() {
    // Load common components like header and footer
    await loadHTML('./_footer.html', 'footer-placeholder'); // Or '../_footer.html' if _footer.html is in root and script.js in js/
    // You could do the same for a header: loadHTML('./_header.html', 'header-placeholder');

    // Load modal content, then initialize its form logic
    await loadHTML('./_modal_contact.html', 'contactModal', (success) => {
        if (success) {
            initializeContactForm(); // Initialize form AFTER modal content is loaded
        } else {
            console.error("Failed to load modal content, contact form not initialized.");
        }
    });

    // Initialize language switcher
    initializeLanguageSwitcher();

    // Initialize smooth scrolling
    initializeSmoothScrolling();

    // Initialize card animations
    initializeCardAnimations();

    // Initialize accessibility features
    initializeAccessibility();

    // Load saved language preference
    loadLanguagePreference(); // This will also call switchLanguage internally
    console.log('Daejeon Foreign Residents Portal initialized successfully');
}

// Initialize additional features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Handle window resize events
window.addEventListener('resize', throttle(function() {
    // Handle responsive adjustments if needed
    console.log('Window resized');
}, 250));

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        console.log('Page is now visible');
        // Refresh any time-sensitive data if needed
    }
});

// Export functions for external access if needed
window.DaejeonPortal = {
    switchLanguage: switchLanguage,
    getCurrentLanguage: () => currentLanguage,
    getSupportedLanguages: () => supportedLanguages
};
