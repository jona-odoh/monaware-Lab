// ==================== 
// INITIALIZE AOS 
// ==================== 

document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        offset: 100,
        easing: 'ease-in-out',
        once: false,
        mirror: true
    });

    // Initialize navbar scroll effect
    initNavbarScroll();
    
    // Initialize dark mode
    initDarkMode();
    
    // Initialize contact form
    initContactForm();
    
    // Initialize project filter
    initProjectFilter();
});

// ==================== 
// NAVBAR SCROLL EFFECT 
// ==================== 

function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    
    if (!navbar) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ==================== 
// DARK MODE TOGGLE 
// ==================== 

function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const htmlElement = document.documentElement;
    
    if (!darkModeToggle) return;
    
    // Check saved preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'enabled') {
        document.body.classList.add('dark-mode');
        updateDarkModeIcon(true);
    }
    
    // Toggle dark mode
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
        updateDarkModeIcon(isDarkMode);
    });
}

function updateDarkModeIcon(isDarkMode) {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (isDarkMode) {
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        darkModeToggle.title = 'Toggle Light Mode';
    } else {
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        darkModeToggle.title = 'Toggle Dark Mode';
    }
}

// ==================== 
// CONTACT FORM HANDLING 
// ==================== 

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            service: document.getElementById('service').value,
            message: document.getElementById('message').value
        };
        
        // Validate form
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            showAlert('Please fill in all required fields', 'warning');
            return;
        }
        
        // Validate email
        if (!isValidEmail(formData.email)) {
            showAlert('Please enter a valid email address', 'warning');
            return;
        }
        
        // Here you would normally send the data to a server
        console.log('Form Data:', formData);
        
        // Show success message
        showAlert('Thank you for your message! We will get back to you soon.', 'success');
        
        // Reset form
        contactForm.reset();
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const formContainer = document.getElementById('contactForm')?.parentElement;
    if (formContainer) {
        formContainer.insertBefore(alertDiv, formContainer.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
}

// ==================== 
// PROJECT FILTER 
// ==================== 

function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    if (filterBtns.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Filter projects
            projectItems.forEach(item => {
                if (filterValue === 'all') {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, 10);
                } else {
                    const categories = item.getAttribute('data-category').split(',');
                    if (categories.includes(filterValue)) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                }
            });
            
            // Refresh AOS
            AOS.refreshHard();
        });
    });
    
    // Set "all" as active by default
    if (filterBtns.length > 0) {
        filterBtns[0].classList.add('active');
    }
}

// ==================== 
// SMOOTH SCROLL 
// ==================== 

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ==================== 
// LAZY LOADING IMAGES 
// ==================== 

if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-lazy]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-lazy');
                img.removeAttribute('data-lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ==================== 
// UTILITY FUNCTIONS 
// ==================== 

// Close mobile menu on link click
document.querySelectorAll('.navbar-collapse .nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const navbarToggle = document.querySelector('.navbar-toggler');
        if (navbarToggle.offsetParent !== null) { // Check if visible
            navbarToggle.click();
        }
    });
});

// Prevent multiple form submissions
let isSubmitting = false;

document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        if (isSubmitting) {
            e.preventDefault();
            return false;
        }
        isSubmitting = true;
        
        setTimeout(() => {
            isSubmitting = false;
        }, 2000);
    });
});

// ==================== 
// PERFORMANCE 
// ==================== 

// Debounce function for resize events
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

// Refresh AOS on window resize
window.addEventListener('resize', debounce(() => {
    AOS.refreshHard();
}, 250));

// ==================== 
// CONSOLE WELCOME MESSAGE 
// ==================== 

console.log('%cMonaware Labs', 'font-size: 30px; font-weight: bold; color: #0066FF;');
console.log('%cInnovating Simplicity, Empowering the Future.', 'font-size: 14px; color: #00C2CB; font-style: italic;');
console.log('Welcome to our website! We build amazing digital solutions.');