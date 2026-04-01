// ============================================
// NAVIGATION & SMOOTH SCROLLING
// ============================================

// Update active nav link on scroll
const observerOptions = {
    threshold: 0.3,
    rootMargin: '-50px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            updateActiveNavLink(id);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

function updateActiveNavLink(sectionId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
}

// Navigation click handlers
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section');
        scrollToSection(sectionId);
    });
});

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Account for sticky nav
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Make scrollToSection globally available for onclick handlers
window.scrollToSection = scrollToSection;

// ============================================
// FORM HANDLING
// ============================================

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Collect form data
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        guests: formData.get('guests'),
        message: formData.get('message'),
        timestamp: new Date().toLocaleString('fr-FR')
    };

    // Show success message
    showFormSuccess();

    // Log data (in production, send to backend)
    console.log('Demande de contact reçue:', data);

    // Store in localStorage for demonstration
    let submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    submissions.push(data);
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));

    // Reset form
    contactForm.reset();

    // Scroll to confirmation
    setTimeout(() => {
        scrollToSection('contact');
    }, 500);
});

function showFormSuccess() {
    const originalButton = contactForm.querySelector('.btn');
    const originalText = originalButton.textContent;

    // Change button appearance
    originalButton.textContent = '✓ Demande Envoyée!';
    originalButton.style.backgroundColor = '#27ae60';
    originalButton.disabled = true;

    // Reset after 3 seconds
    setTimeout(() => {
        originalButton.textContent = originalText;
        originalButton.style.backgroundColor = '';
        originalButton.disabled = false;
    }, 3000);

    // Show notification toast
    showToast('Merci! Votre demande a été envoyée. Je vous répondrai rapidement.');
}

function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #27ae60;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;
    toast.textContent = message;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateY(100px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateY(0);
                opacity: 1;
            }
            to {
                transform: translateY(100px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// ============================================
// PAGE LOAD ANIMATIONS
// ============================================

// Animate elements on page load
window.addEventListener('load', () => {
    document.querySelectorAll('.service-card, .portfolio-item, .pricing-card, .about-item').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.5s ease-out ${index * 0.1}s, transform 0.5s ease-out ${index * 0.1}s`;
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 50);
    });
});

// ============================================
// SMOOTH ANIMATIONS ON SCROLL
// ============================================

const observerAnimation = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .portfolio-item, .about-item').forEach(el => {
    observerAnimation.observe(el);
});

// Add CSS for fade-in animation
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    .fade-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(animationStyle);

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Check if form is valid
function validateForm(formData) {
    const email = formData.get('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        showToast('Veuillez entrer une adresse email valide.');
        return false;
    }
    
    const phone = formData.get('phone');
    const phoneRegex = /^\d{9,}$/;
    
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        showToast('Veuillez entrer un numéro de téléphone valide.');
        return false;
    }
    
    return true;
}

// Update form validation
contactForm.addEventListener('submit', (e) => {
    const formData = new FormData(contactForm);
    if (!validateForm(formData)) {
        e.preventDefault();
    }
});

// ============================================
// RESPONSIVE MENU (pour mobile si needed)
// ============================================

// Add hover effect to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ============================================
// ACCESSIBILITY
// ============================================

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any open modals/dropdowns if implemented
    }
});

// Add skip to main content link
const skipLink = document.createElement('a');
skipLink.href = '#accueil';
skipLink.textContent = 'Passer au contenu principal';
skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: #d4604d;
    color: white;
    padding: 8px;
    z-index: 100;
`;
skipLink.addEventListener('focus', function() {
    this.style.top = '0';
});
skipLink.addEventListener('blur', function() {
    this.style.top = '-40px';
});
document.body.insertBefore(skipLink, document.body.firstChild);

console.log('Site loaded successfully!');
