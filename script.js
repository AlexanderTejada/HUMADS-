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

    // Update Team Section - Dynamic
    if (data.team) {

        // Update team header
        const teamTitle = document.getElementById('teamTitle');
        if (teamTitle && data.team.title) {
            teamTitle.textContent = data.team.title;
        }

        const teamDescription = document.getElementById('teamDescription');
        if (teamDescription && data.team.description) {
            teamDescription.textContent = data.team.description;
        }

        // Update team carousel with dynamic members
        const carouselTrack = document.getElementById('teamCarouselTrack');
        if (carouselTrack && data.team.members) {

            const slides = data.team.members.map((member, index) => {
                let imageUrl = member.image && member.image.trim() !== '' ? member.image : '';

                // Resolve relative URLs to absolute URLs for iframe context
                if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
                    const isInIframe = window.parent !== window;
                    if (isInIframe) {
                        // In iframe, use parent's origin and full path
                        const parentOrigin = window.parent.location.origin;
                        const parentPath = window.parent.location.pathname.replace('/admin.html', '');
                        imageUrl = parentOrigin + parentPath + '/' + imageUrl.replace(/^\/+/, '');
                    } else {
                        // Not in iframe, resolve normally
                        imageUrl = window.location.origin + '/' + imageUrl.replace(/^\/+/, '');
                    }
                }

                // Fallback SVG if no image
                const fallbackSVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDI1MCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjEyNSIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiNEMEQ1REEiLz4KPHBhdGggZD0iTTEyNSAxNjBDOTUuMTQ3IDE2MCA3MS4zMjUgMTc2LjkxNSA2Mi4yNSAyMDBIMTg3Ljc1QzE3OC42NzUgMTc2LjkxNSAxNTQuODUzIDE2MCAxMjUgMTYwWiIgZmlsbD0iI0QwRDVEQSIvPgo8L3N2Zz4K';

                if (!imageUrl) {
                    imageUrl = fallbackSVG;
                }

                return `
                    <div class="team-slide">
                        <div class="team-member">
                            <div class="member-photo-container">
                                <img src="${imageUrl}" alt="${member.name}" class="member-photo" loading="lazy">
                            </div>
                            <div class="member-info">
                                <h4>${member.name}</h4>
                                <span>${member.role}</span>
                                ${member.description ? `<p class="member-description">${member.description}</p>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            });

            carouselTrack.innerHTML = slides.join('');

            // Reinitialize carousel after updating content
            setTimeout(() => {
                initializeTeamCarousel();
            }, 100);
        }
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

// Dynamic Team Carousel Functionality
let teamCurrentPage = 0;
let teamSlidesPerPage = 3;
let teamTotalPages = 0;

function initializeTeamCarousel() {
    const track = document.querySelector('.carousel-track');
    if (!track) {
        console.log('❌ Carousel track no encontrado');
        return;
    }

    const slides = Array.from(track.children);
    const nextButton = document.getElementById('nextBtn');
    const prevButton = document.getElementById('prevBtn');
    const dotsNav = document.querySelector('.carousel-dots');

    if (!nextButton || !prevButton || !dotsNav) {
        return;
    }

    // Clear existing dots
    dotsNav.innerHTML = '';

    // Responsive slides per page
    const isMobile = window.innerWidth <= 768;
    teamSlidesPerPage = isMobile ? 1 : 3;
    const slideCount = slides.length;
    teamTotalPages = Math.ceil(slideCount / teamSlidesPerPage);
    teamCurrentPage = 0;

    // Create dots
    for (let i = 0; i < teamTotalPages; i++) {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            teamCurrentPage = i;
            updateTeamCarouselPosition();
        });
        dotsNav.appendChild(dot);
    }

    const dots = Array.from(dotsNav.children);

    // Update carousel position
    function updateTeamCarouselPosition() {
        const isMobile = window.innerWidth <= 768;
        let newTransform;

        if (isMobile) {
            // In mobile, move by 100% per slide
            newTransform = -teamCurrentPage * 100;
        } else {
            // In desktop, move by percentage based on slides per page
            newTransform = -teamCurrentPage * (100 / teamSlidesPerPage);
        }

        track.style.transform = `translateX(${newTransform}%)`;

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === teamCurrentPage);
        });

        // Disable/Enable buttons
        prevButton.disabled = teamCurrentPage === 0;
        nextButton.disabled = teamCurrentPage === teamTotalPages - 1;

        // Update button opacity
        prevButton.style.opacity = teamCurrentPage === 0 ? '0.5' : '1';
        nextButton.style.opacity = teamCurrentPage === teamTotalPages - 1 ? '0.5' : '1';
    }

    // Update carousel position
    updateTeamCarouselPosition();

    // Store update function globally
    window.updateTeamCarousel = updateTeamCarouselPosition;
}

// Navigation functions
function nextSlide() {
    if (teamCurrentPage < teamTotalPages - 1) {
        teamCurrentPage++;
        if (window.updateTeamCarousel) {
            window.updateTeamCarousel();
        }
    }
}

function previousSlide() {
    if (teamCurrentPage > 0) {
        teamCurrentPage--;
        if (window.updateTeamCarousel) {
            window.updateTeamCarousel();
        }
    }
}

// Initialize carousel when DOM is ready and on resize
document.addEventListener('DOMContentLoaded', () => {
    // Initialize team carousel if it exists
    const teamCarousel = document.getElementById('teamCarouselTrack');
    if (teamCarousel) {
        initializeTeamCarousel();
    }
});

// Handle window resize for team carousel
let teamResizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(teamResizeTimeout);
    teamResizeTimeout = setTimeout(() => {
        const teamCarousel = document.getElementById('teamCarouselTrack');
        if (teamCarousel) {
            initializeTeamCarousel();
        }
    }, 250);
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

        // Check if we're in preview mode
        const urlParams = new URLSearchParams(window.location.search);
        const isPreview = urlParams.get('preview') === 'true';

        // Use draft endpoint if in preview mode
        const endpoint = isPreview ? '/api/content/draft' : '/api/content';

        const response = await fetch(endpoint);

        const content = await response.json();

        updatePageContent(content);

        // If in preview, listen for updates from admin panel
        if (isPreview) {
            // Poll for updates every 2 seconds
            setInterval(async () => {
                try {
                    const draftResponse = await fetch('/api/content/draft');
                    const draftContent = await draftResponse.json();
                    updatePageContent(draftContent);
                } catch (error) {
                    console.error('Error updating preview:', error);
                }
            }, 2000);
        }
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

    // Update Team Section - Dynamic
    if (content.team) {

        // Update team header
        const teamTitle = document.getElementById('teamTitle');
        if (teamTitle && content.team.title) {
            teamTitle.textContent = content.team.title;
        }

        const teamDescription = document.getElementById('teamDescription');
        if (teamDescription && content.team.description) {
            teamDescription.textContent = content.team.description;
        }

        // Update team carousel with dynamic members
        const carouselTrack = document.getElementById('teamCarouselTrack');
        if (carouselTrack && content.team.members && content.team.members.length > 0) {

            const slides = content.team.members.map((member, index) => {
                let imageUrl = member.image && member.image.trim() !== '' ? member.image : '';

                // Resolve relative URLs to absolute URLs for iframe context
                if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
                    if (window.parent !== window) {
                        imageUrl = window.parent.location.origin + '/' + imageUrl.replace(/^\/+/, '');
                    } else {
                        imageUrl = window.location.origin + '/' + imageUrl.replace(/^\/+/, '');
                    }
                }

                const fallbackSVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDI1MCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjNGNEY2Ci8+CjxjaXJjbGUgY3g9IjEyNSIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiNEMEQ1REEiLz4KUGhdaCBkPSJNMTI1IDE2MEM5NS4xNDcgMTYwIDcxLjMyNSAxNzYuOTE1IDYyLjI1IDIwMEgxODcuNzVDMTc4LjY3NSAxNzYuOTE1IDE1NC44NTMgMTYwIDEyNSAxNjBaIiBmaWxsPSIjRDBENURBIi8+Cjwvc3ZnPgo=';
                imageUrl = imageUrl || fallbackSVG;

                return `
                    <div class="team-slide">
                        <div class="team-member">
                            <div class="member-photo-container">
                                <img src="${imageUrl}" alt="${member.name}" class="member-photo" loading="lazy">
                            </div>
                            <div class="member-info">
                                <h4>${member.name}</h4>
                                <span>${member.role}</span>
                                ${member.description ? `<p class="member-description">${member.description}</p>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            });

            carouselTrack.innerHTML = slides.join('');

            // Reinitialize carousel after updating content
            setTimeout(() => {
                initializeTeamCarousel();
            }, 100);
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

// Carousel variables removed

// Listen for preview updates from admin panel
window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'updatePreview') {
        console.log('📱 Recibido mensaje de preview:', event.data.data);
        // Log specific team data for debugging
        if (event.data.data.team && event.data.data.team.members) {
            console.log('👥 Miembros del equipo recibidos:', event.data.data.team.members.length);
            event.data.data.team.members.forEach((member, index) => {
                console.log(`  ${index + 1}. ${member.name}: ${member.image || 'SIN IMAGEN'}`);
            });
        }
        updatePageContent(event.data.data);
    }
});

// Load content when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Generate initial content with default values
    updatePageContent({});

    // Then load from CMS
    loadContentFromCMS();

    // Reload content every 10 seconds to reflect CMS changes (reduced frequency)
    setInterval(loadContentFromCMS, 10000);
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

