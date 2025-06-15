/**
 * Daejeon Foreign Residents Portal - Main JavaScript File
 * Handles language switching, dynamic content loading, and interactive functionality
 */

// Global variables
let currentLanguage = 'ko'; // Default language
const supportedLanguages = ['ko', 'en'];

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Asynchronously initialize the application.
 * Order of operations is important here.
 */
async function initializeApp() {
    // 1. Determine and set the correct currentLanguage from localStorage or default.
    // This also applies the language to the page and updates the dropdown.
    loadLanguagePreference();

    // 2. Load reusable HTML components.
    // The switchLanguage call inside loadHTML for footer will use the correctly set global currentLanguage.
    await loadHTML('./_footer.html', 'footer-placeholder');
    await loadHTML('./_modal_contact.html', 'contactModal', (success) => {
        if (success) {
            initializeContactForm(); // Initialize form logic AFTER modal content is loaded
        } else {
            console.error("Failed to load modal content, contact form not initialized.");
        }
    });

    // 3. Initialize other UI components and event listeners.
    setupLanguageSwitcherListener(); // Sets up the 'change' event listener for the dropdown
    initializeSmoothScrolling();
    initializeCardAnimations();
    initializeAccessibility();
    handleExternalLinks();
    initializeNavigation();
    initializeSearch(); // If you have search functionality
    initializeForms();    // For general form handling if any, besides contact modal
    initializeTooltips();

    console.log(`Daejeon Foreign Residents Portal initialized successfully. Current language: ${currentLanguage}`);
}

/**
 * Sets up the event listener for the language selection dropdown.
 */
function setupLanguageSwitcherListener() {
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        // Ensure dropdown reflects the current language (already done by loadLanguagePreference)
        // languageSelect.value = currentLanguage; // This should be redundant now but safe

        languageSelect.addEventListener('change', function(e) {
            const selectedLanguage = e.target.value;
            switchLanguage(selectedLanguage);
        });
    }
}

/**
 * Switch language display across the entire page.
 * @param {string} language - Language code ('ko' or 'en')
 */
function switchLanguage(language) {
    if (!supportedLanguages.includes(language)) {
        console.error('Unsupported language:', language);
        return;
    }

    currentLanguage = language; // Update global variable

    // Update HTML lang attribute - this triggers CSS language switching
    document.documentElement.lang = language;

    updatePageTitle(language);
    saveLanguagePreference(language); // Save the new preference

    // Update language-specific options in the contact modal's subject dropdown
    const subjectSelect = document.getElementById('contactSubject');
    if (subjectSelect) {
        const options = subjectSelect.querySelectorAll('option[lang]');
        let firstVisibleValue = null;
        let currentSelectionStillVisible = false;

        options.forEach(option => {
            if (option.getAttribute('lang') === language) {
                option.style.display = ''; // Show
                if (firstVisibleValue === null) {
                    firstVisibleValue = option.value;
                }
                if (subjectSelect.value === option.value) {
                    currentSelectionStillVisible = true;
                }
            } else {
                option.style.display = 'none'; // Hide
            }
        });

        // If current selection is now hidden, or no option was selected, select the first visible one
        if (!currentSelectionStillVisible && firstVisibleValue) {
            subjectSelect.value = firstVisibleValue;
        } else if (subjectSelect.options.length > 0 && subjectSelect.selectedIndex === -1 && firstVisibleValue) {
            // Handle case where nothing is selected (e.g. if all options were hidden then some shown)
            subjectSelect.value = firstVisibleValue;
        }
    }

    // Ensure the main language selector dropdown reflects the change
    const languageSelectDropdown = document.getElementById('languageSelect');
    if (languageSelectDropdown && languageSelectDropdown.value !== language) {
        languageSelectDropdown.value = language;
    }

    // Trigger custom event for other components that might need to react to language change
    const event = new CustomEvent('languageChanged', { detail: { language: language } });
    document.dispatchEvent(event);

    console.log('Language switched to:', language);
}

/**
 * Update page title based on current language from <title lang="..."> tags.
 * @param {string} language - Language code
 */
function updatePageTitle(language) {
    const titleElement = document.querySelector(`head title[lang="${language}"]`);
    if (titleElement && titleElement.textContent) {
        document.title = titleElement.textContent;
    } else {
        // Fallback if specific language title not found, find first title tag
        const genericTitle = document.querySelector('head title');
        if (genericTitle) {
            document.title = genericTitle.textContent; // Or a default site title
        }
    }
}

/**
 * Save language preference to localStorage.
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
 * Load language preference from localStorage and apply it.
 * This function is critical for persistence across page loads.
 */
function loadLanguagePreference() {
    let languageToApply = 'ko'; // Default
    try {
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
            languageToApply = savedLanguage;
        }
    } catch (error) {
        console.warn('Could not load language preference, defaulting to Korean:', error);
    }

    // Set the global currentLanguage variable
    currentLanguage = languageToApply;

    // Update the language selector dropdown's value
    const languageSelectDropdown = document.getElementById('languageSelect');
    if (languageSelectDropdown) {
        languageSelectDropdown.value = currentLanguage;
    }

    // Apply the determined language to the page
    switchLanguage(currentLanguage); // This will set HTML lang, update title, etc.
}


/**
 * Load and inject HTML content from a file into a placeholder.
 * @param {string} filePath - Path to the HTML file to load.
 * @param {string} placeholderId - ID of the element to inject HTML into.
 * @param {function} [callback] - Optional callback function (success: boolean) => void.
 */
async function loadHTML(filePath, placeholderId, callback) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
        console.error(`Placeholder element with ID '${placeholderId}' not found.`);
        if (callback) callback(false);
        return;
    }

    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to load ${filePath}: ${response.status} ${response.statusText}`);
        }
        const htmlContent = await response.text();
        placeholder.innerHTML = htmlContent;

        // Re-apply current language to the newly loaded content
        // This ensures spans within footer/modal are correctly displayed
        switchLanguage(currentLanguage);

        if (callback) callback(true);
    } catch (error) {
        console.error(`Error loading HTML into #${placeholderId} from ${filePath}:`, error);
        placeholder.innerHTML = `<p class="text-danger">Error loading content from ${filePath}.</p>`;
        if (callback) callback(false);
    }
}

/**
 * Initialize contact form functionality.
 * Should be called AFTER modal HTML is loaded.
 */
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm'); // ID of the <form>
    const contactModalElement = document.getElementById('contactModal'); // ID of the main modal div
    let contactModalInstance;

    if (!contactModalElement) {
        console.error("Modal placeholder #contactModal not found. Cannot initialize contact form.");
        return;
    }
    if (!contactForm) {
        console.error("Contact form #contactForm not found inside the modal. Was modal content loaded correctly?");
        return;
    }

    // Get or create Bootstrap Modal instance
    contactModalInstance = bootstrap.Modal.getInstance(contactModalElement);
    if (!contactModalInstance) {
        contactModalInstance = new bootstrap.Modal(contactModalElement);
    }

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const subject = document.getElementById('contactSubject').value;
        const message = document.getElementById('contactMessage').value;

        if (!name || !email || !message) {
            alert(currentLanguage === 'ko' ? '이름, 이메일, 메시지를 모두 입력해주세요.' : 'Please fill in Name, Email, and Message.');
            return;
        }

        console.log('Form Submitted (Demo):', { name, email, subject, message });
        alert(currentLanguage === 'ko' ? '메시지가 (데모로) 전송되었습니다. 감사합니다!' : 'Your message has been (demo) sent. Thank you!');

        contactForm.reset();
        if (contactModalInstance) {
            contactModalInstance.hide();
        }
    });

    contactModalElement.addEventListener('show.bs.modal', function (event) {
        const triggerButton = event.relatedTarget;
        if (triggerButton) {
            const subjectType = triggerButton.getAttribute('data-form-subject');
            const subjectSelect = document.getElementById('contactSubject');
            if (subjectSelect) { // Ensure select element exists
                if (subjectType) {
                    subjectSelect.value = subjectType;
                } else {
                    subjectSelect.value = "feedback"; // Default if no specific subject passed
                }
                // Ensure the selected option is visible for the current language
                switchLanguage(currentLanguage);
            }
        }
    });
}


// --- Other Utility and Initialization Functions (Copied from your provided script) ---

function initializeSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function initializeCardAnimations() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.add('fade-in');
        card.addEventListener('mouseenter', function() { this.style.transform = 'translateY(-5px)'; });
        card.addEventListener('mouseleave', function() { this.style.transform = 'translateY(0)'; });
    });
}

function initializeAccessibility() {
    const interactiveElements = document.querySelectorAll('.card, .btn, a, select, input, textarea');
    interactiveElements.forEach(element => {
        element.addEventListener('focus', function() { this.classList.add('keyboard-focused'); });
        element.addEventListener('blur', function() { this.classList.remove('keyboard-focused'); });
    });
    const skipLink = document.querySelector('.skip-link'); // Assuming you might add a skip link
    const mainContent = document.querySelector('main');
    if (skipLink && mainContent) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            mainContent.setAttribute('tabindex', '-1'); // Make it focusable
            mainContent.focus();
        });
    }
}

function handleExternalLinks() {
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (!this.rel.includes('noopener')) this.rel = (this.rel ? this.rel + ' ' : '') + 'noopener noreferrer';
            trackExternalLinkClick(this.href);
        });
    });
}

function trackExternalLinkClick(url) {
    console.log('External link clicked:', url);
    // Placeholder for analytics
}

function initializeNavigation() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarToggler && navbarCollapse) {
        const navLinks = navbarCollapse.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            });
        });
    }
}

function initializeSearch() {
    const searchInput = document.querySelector('#searchInput'); // Assuming an input with this ID
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.trim();
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (query.length >= 2) performSearch(query);
            }, 300);
        });
    }
}

function performSearch(query) {
    console.log('Searching for:', query);
    // Placeholder for search logic
}

function initializeForms() { // General form validation, not specific to contact modal
    const forms = document.querySelectorAll('form:not(#contactForm)'); // Exclude contactForm as it has its own handler
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                    // Optionally add feedback message next to field
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            if (!isValid) {
                e.preventDefault();
                showFormError(currentLanguage === 'ko' ? '모든 필수 항목을 입력해주세요.' : 'Please fill in all required fields.');
            }
        });
    });
}

function showFormError(message) {
    // This function might need a specific place to show errors for general forms
    // For now, it's a generic alert.
    alert(message);
    // Consider a more integrated UI for form errors.
}

function initializeTooltips() {
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

// --- Utility Functions (debounce, throttle - not currently used but good to have) ---
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => { clearTimeout(timeout); func(...args); };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

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

// --- Event Listeners for window resize and visibility (copied from your script) ---
window.addEventListener('resize', throttle(function() {
    console.log('Window resized');
}, 250));

document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        console.log('Page is now visible');
    }
});

// --- Exposing functions to global scope (copied from your script) ---
window.DaejeonPortal = {
    switchLanguage: switchLanguage,
    getCurrentLanguage: () => currentLanguage,
    getSupportedLanguages: () => supportedLanguages
};