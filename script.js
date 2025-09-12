// Portfolio Filter Functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        portfolioItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.5s ease-in-out';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Accordion Functionality
const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach(item => {
    const header = item.querySelector('h4');
    
    header.addEventListener('click', () => {
        // Close all other accordion items
        accordionItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
                const span = otherItem.querySelector('span');
                if (span) span.textContent = '+';
            }
        });
        
        // Toggle current item
        item.classList.toggle('active');
        const span = item.querySelector('span');
        if (span) {
            span.textContent = item.classList.contains('active') ? '−' : '+';
        }
    });
});

// Smooth Scrolling for Navigation Links
const navLinks = document.querySelectorAll('.nav-menu a');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll Animation for Stats
const observerOptions = {
    threshold: 0.3, // Reduced threshold for mobile
    rootMargin: '0px 0px -50px 0px' // Reduced margin for mobile
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statItems = entry.target.querySelectorAll('.stat-item h3');
            statItems.forEach((stat, index) => {
                const originalText = stat.textContent;
                const numMatch = originalText.match(/\d+(\.\d+)?/);
                
                if (numMatch) {
                    const finalValue = parseFloat(numMatch[0]);
                    const suffix = originalText.replace(numMatch[0], '');
                    animateCounter(stat, 0, finalValue, 2000, index * 200, suffix);
                }
            });
        }
    });
}, observerOptions);

const statsSection = document.querySelector('.stats');
if (statsSection) {
    observer.observe(statsSection);
}

// Counter Animation Function
function animateCounter(element, start, end, duration, delay, suffix = '') {
    setTimeout(() => {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            
            // Format the number based on the suffix
            let displayValue;
            if (suffix.includes('.')) {
                displayValue = current.toFixed(1);
            } else {
                displayValue = Math.floor(current);
            }
            
            element.textContent = displayValue + suffix;
        }, 16);
    }, delay);
}

// Header Background on Scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Cargar contenido dinámico desde JSON
async function loadDynamicContent() {
    try {
        const response = await fetch('/content.json');
        if (response.ok) {
            const data = await response.json();
            updatePageContent(data);
        }
    } catch (error) {
        console.log('Usando contenido estático');
    }
}

// Actualizar contenido de la página
function updatePageContent(data) {
    // Hero section
    if (data.hero) {
        const heroTitle = document.querySelector('.hero-text h1');
        if (heroTitle && data.hero.title) {
            heroTitle.innerHTML = `${data.hero.title}<br><span class="dynamic-text" id="dynamicText">${data.hero.dynamicWords[0]}</span>`;
        }
        
        const heroDesc = document.querySelector('.hero-text p');
        if (heroDesc && data.hero.description) {
            heroDesc.textContent = data.hero.description;
        }
        
        const btnPrimary = document.querySelector('.btn-primary');
        if (btnPrimary && data.hero.primaryButton) {
            btnPrimary.textContent = data.hero.primaryButton;
        }
        
        const btnSecondary = document.querySelector('.btn-secondary');
        if (btnSecondary && data.hero.secondaryButton) {
            btnSecondary.textContent = data.hero.secondaryButton;
        }
    }
    
    // Stats section
    if (data.stats) {
        const statItems = document.querySelectorAll('.stat-item');
        data.stats.forEach((stat, index) => {
            if (statItems[index]) {
                statItems[index].querySelector('h3').textContent = stat.value;
                statItems[index].querySelector('p').textContent = stat.label;
            }
        });
    }
    
    // Team members
    if (data.team && data.team.members) {
        const teamSlides = document.querySelectorAll('.team-slide');
        data.team.members.forEach((member, index) => {
            if (teamSlides[index]) {
                const slide = teamSlides[index];
                const img = slide.querySelector('.member-photo');
                const name = slide.querySelector('.member-info h4');
                const role = slide.querySelector('.member-info span');
                
                if (img && member.image) img.src = member.image;
                if (name && member.name) name.textContent = member.name;
                if (role && member.role) role.textContent = member.role;
            }
        });
    }
    
    // Contact info
    if (data.contact) {
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        emailLinks.forEach(link => {
            if (data.contact.email) {
                link.href = `mailto:${data.contact.email}`;
                if (link.querySelector('i.fa-envelope')) {
                    link.innerHTML = `<i class="far fa-envelope"></i> ${data.contact.email}`;
                }
            }
        });
        
        const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
        whatsappLinks.forEach(link => {
            if (data.contact.whatsapp) {
                link.href = `https://wa.me/${data.contact.whatsapp}`;
            }
        });
    }
}

// Dynamic Text Animation with Smooth Morphing
let dynamicWords = ['leads', 'clientes', 'ventas', 'resultados', 'crecimiento'];
let currentWordIndex = 0;

function morphText() {
    const dynamicElement = document.getElementById('dynamicText');
    if (!dynamicElement) return;
    
    const currentWord = dynamicWords[currentWordIndex];
    const nextIndex = (currentWordIndex + 1) % dynamicWords.length;
    const nextWord = dynamicWords[nextIndex];
    
    // Add morphing animation classes
    dynamicElement.style.opacity = '0';
    dynamicElement.style.transform = 'translateY(20px) scale(0.8)';
    
    setTimeout(() => {
        dynamicElement.textContent = nextWord;
        dynamicElement.style.opacity = '1';
        dynamicElement.style.transform = 'translateY(0) scale(1)';
        currentWordIndex = nextIndex;
    }, 300);
}

// Start the morphing animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Cargar contenido dinámico
    loadDynamicContent().then(() => {
        // Actualizar palabras dinámicas si hay datos del JSON
        fetch('/content.json')
            .then(res => res.json())
            .then(data => {
                if (data.hero && data.hero.dynamicWords) {
                    dynamicWords = data.hero.dynamicWords;
                }
            })
            .catch(() => {});
    });
    
    const dynamicElement = document.getElementById('dynamicText');
    if (dynamicElement) {
        // Set initial word
        dynamicElement.textContent = dynamicWords[0];
        
        // Start morphing after 2 seconds, then every 3 seconds
        setTimeout(() => {
            morphText();
            setInterval(morphText, 3000);
        }, 2000);
    }
});

// Team Carousel Functionality
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    if (!track) return;

    const slides = Array.from(track.children);
    const nextButton = document.getElementById('nextBtn');
    const prevButton = document.getElementById('prevBtn');
    const dotsNav = document.querySelector('.carousel-dots');

    // Responsive slides per page
    const isMobile = window.innerWidth <= 768;
    const slidesPerPage = isMobile ? 1 : 3;
    const slideCount = slides.length;
    const totalPages = Math.ceil(slideCount / slidesPerPage);
    let currentPage = 0;

    // Create dots
    for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            currentPage = i;
            updateCarousel();
        });
        dotsNav.appendChild(dot);
    }

    const dots = Array.from(dotsNav.children);

    // Make updateCarousel global so it can be called from updatePageContent
    updateCarousel = () => {
        const isMobile = window.innerWidth <= 768;
        let newTransform;
        
        if (isMobile) {
            // In mobile, move by 85% (slide width + gap)
            newTransform = -currentPage * 85;
        } else {
            // In desktop, move by 100% divided by slides per page
            newTransform = -currentPage * (100 / slidesPerPage);
        }
        
        track.style.transform = `translateX(${newTransform}%)`;

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPage);
        });

        // Disable/Enable buttons
        prevButton.disabled = currentPage === 0;
        nextButton.disabled = currentPage === totalPages - 1;
    };

    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            updateCarousel();
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            updateCarousel();
        }
    });

    // Auto-play
    setInterval(() => {
        let nextPage = (currentPage + 1) % totalPages;
        currentPage = nextPage;
        updateCarousel();
    }, 5000);

    // Handle window resize
    window.addEventListener('resize', () => {
        updateCarousel();
    });

    updateCarousel();
});

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('Opening modal:', modalId); // Debug log
    } else {
        console.error('Modal not found:', modalId); // Debug log
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        console.log('Closing modal:', modalId); // Debug log
    } else {
        console.error('Modal not found for closing:', modalId); // Debug log
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        closeModal(e.target.id);
    }
});

// CMS Content Loading
async function loadContentFromCMS() {
    try {
        const response = await fetch('/api/content');
        const content = await response.json();
        updatePageContent(content);
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

function updatePageContent(content) {
    // Update Hero Section
    if (content.hero) {
        const heroTitle = document.querySelector('.hero-text h1');
        if (heroTitle && content.hero.title) {
            const dynamicWord = content.hero.dynamicWords && content.hero.dynamicWords[0] ? content.hero.dynamicWords[0] : 'leads';
            heroTitle.innerHTML = `<span class="hero-main-text">${content.hero.title}</span><br><span class="dynamic-text" id="dynamicText">${dynamicWord}</span>`;
        }

        const heroDescription = document.querySelector('.hero-text p');
        if (heroDescription && content.hero.description) {
            heroDescription.textContent = content.hero.description;
        }

        const btnPrimary = document.querySelector('.hero-buttons .btn-primary');
        if (btnPrimary && content.hero.primaryButton) {
            btnPrimary.textContent = content.hero.primaryButton;
        }

        const btnSecondary = document.querySelector('.hero-buttons .btn-secondary');
        if (btnSecondary && content.hero.secondaryButton) {
            btnSecondary.textContent = content.hero.secondaryButton;
        }

        // Update hero features
        const featuresContainer = document.querySelector('.hero-features');
        if (featuresContainer && content.hero.features) {
            featuresContainer.innerHTML = content.hero.features.map(feature => `
                <div class="feature">
                    <i class="fas fa-check-circle"></i>
                    <span>${feature}</span>
                </div>
            `).join('');
        }
    }

    // Update About Section
    if (content.about) {
        const aboutLabel = document.querySelector('.about-text .section-label');
        if (aboutLabel && content.about.label) {
            aboutLabel.textContent = content.about.label;
        }

        const aboutTitle = document.querySelector('.about-text h2');
        if (aboutTitle && content.about.title) {
            aboutTitle.innerHTML = content.about.title.replace(/\n/g, '<br>');
        }

        // Update services - buscar todos los service-item
        const serviceItems = document.querySelectorAll('.about-text .service-item');
        if (content.about.services && content.about.services.length > 0) {
            content.about.services.forEach((service, index) => {
                if (serviceItems[index]) {
                    const serviceTitle = serviceItems[index].querySelector('h4');
                    const serviceDesc = serviceItems[index].querySelector('p');
                    
                    if (serviceTitle) serviceTitle.textContent = service.title;
                    if (serviceDesc) serviceDesc.textContent = service.description;
                }
            });
        }
    }

    // Update Stats Section
    if (content.stats) {
        const statItems = document.querySelectorAll('.stats .stat-item');
        content.stats.forEach((stat, index) => {
            if (statItems[index]) {
                const statValue = statItems[index].querySelector('h3');
                const statLabel = statItems[index].querySelector('p');
                
                if (statValue) statValue.textContent = stat.value;
                if (statLabel) statLabel.textContent = stat.label;
            }
        });
    }

    // Update Team Section
    if (content.team && content.team.members) {
        const carouselTrack = document.querySelector('.carousel-track');
        if (carouselTrack) {
            carouselTrack.innerHTML = content.team.members.map(member => `
                <div class="team-slide">
                    <div class="team-member">
                        <div class="member-photo-container">
                            <img src="${member.image || 'assets/img/chicas/1.jpg'}" alt="${member.name}" class="member-photo">
                        </div>
                        <div class="member-info">
                            <h4>${member.name}</h4>
                            <span>${member.role}</span>
                        </div>
                    </div>
                </div>
            `).join('');
            
            // Reinicializar el carousel después de actualizar
            setTimeout(() => updateCarousel(), 100); // Small delay to ensure DOM is updated
        }
    }

    // Update Contact Info (footer or any contact section)
    if (content.contact) {
        const emailLink = document.querySelector('a[href^="mailto:"]');
        if (emailLink && content.contact.email) {
            emailLink.href = `mailto:${content.contact.email}`;
            const emailText = emailLink.querySelector('span');
            if (emailText) emailText.textContent = content.contact.email;
        }

        const whatsappLink = document.querySelector('a[href^="https://wa.me/"]');
        if (whatsappLink && content.contact.whatsapp) {
            whatsappLink.href = `https://wa.me/${content.contact.whatsapp}`;
        }
    }
}

// Smooth scroll to section function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Global carousel variables
let currentPage = 0;

// Global carousel update function - will be defined when DOM is ready
function updateCarousel() {
    // This will be replaced by the proper implementation when carousel is initialized
    console.log('Carousel not yet initialized');
}

// Load content when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadContentFromCMS();
    
    // Reload content every 3 seconds to reflect CMS changes
    setInterval(loadContentFromCMS, 3000);
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) {
            closeModal(activeModal.id);
        }
    }
});

// Form submission handling (placeholder)
document.addEventListener('submit', (e) => {
    if (e.target.classList.contains('modal-form')) {
        e.preventDefault();
        
        // Aquí se puede integrar con Google Forms API
        // Por ahora solo mostramos un mensaje
        alert('Formulario enviado! Te contactaremos pronto.');
        
        // Cerrar modal
        const modal = e.target.closest('.modal-overlay');
        if (modal) {
            closeModal(modal.id);
        }
    }
});

// Mobile Menu Functions
function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
}

function closeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        closeMobileMenu();
    }
});

