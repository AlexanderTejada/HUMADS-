// Configuración centralizada de imágenes
const siteConfig = {
    // Configuración de rutas de imágenes organizadas
    imageFolders: {
        hero: 'assets/img/hero/',
        carrusel: 'assets/img/carrusel/',
        about: 'assets/img/about/',
        strategy: 'assets/img/strategy/', 
        casos: 'assets/img/casos/',
        servicios: 'assets/img/servicios/',
        uploads: 'assets/uploads/' // Para imágenes subidas por admin
    },
    images: {
        hero: {
            professional: 'assets/img/hero/pngaaa.com-2003857.png',
            alt: 'mk - Experta en marketing digital'
        },
        about: {
            main: 'assets/img/about/equipo-trabajo.jpg',
            conversion: 'assets/img/about/resultados-conversion.jpg'
        },
        strategy: {
            main: 'assets/img/strategy/equipo-estrategias.png',
            revenue: 'assets/img/strategy/resultados-exitosos.jpg'
        },
        team: [
            { src: 'assets/img/carrusel/1.jpg', name: 'Valentina', role: 'CEO & Estrategia' },
            { src: 'assets/img/carrusel/2.jpg', name: 'Luciana', role: 'Co-fundadora' },
            { src: 'assets/img/carrusel/3.jpg', name: 'Marketing', role: 'Especialista' },
            { src: 'assets/img/carrusel/4.jpg', name: 'Traffic', role: 'Manager' },
            { src: 'assets/img/carrusel/5.jpg', name: 'Operaciones', role: 'Coordinadora' },
            { src: 'assets/img/carrusel/6.jpg', name: 'Comercial', role: 'Ejecutiva' },
            { src: 'assets/img/carrusel/7.jpg', name: 'Finanzas', role: 'Analista' },
            { src: 'assets/img/carrusel/8.jpg', name: 'RRHH', role: 'Gestora' },
            { src: 'assets/img/carrusel/9.jpg', name: 'Creatividad', role: 'Diseñadora' }
        ],
        services: [
            { src: 'assets/img/servicios/analisis-cliente.jpg', title: 'Análisis de cliente ideal', category: 'research' },
            { src: 'assets/img/servicios/campanas-mensajes.jpg', title: 'Campañas de generación de mensajes', category: 'campaigns' },
            { src: 'assets/img/servicios/whatsapp-business.jpg', title: 'Optimización de WhatsApp Business', category: 'optimization' },
            { src: 'assets/img/servicios/auditoria-digital.jpg', title: 'Auditoría de ecosistema digital', category: 'research' },
            { src: 'assets/img/servicios/angulos-publicitarios.jpg', title: 'Ángulos publicitarios estratégicos', category: 'campaigns' },
            { src: 'assets/img/servicios/reportes-mensuales.jpg', title: 'Reportes mensuales detallados', category: 'optimization' }
        ],
        cases: [
            { src: 'assets/img/casos/cliente-clinica.jpg', alt: 'Cliente Clínica' },
            { src: 'assets/img/casos/cliente-constructora.jpg', alt: 'Cliente Constructora' },
            { src: 'assets/img/casos/cliente-bufete.jpg', alt: 'Cliente Bufete' }
        ]
    }
};

// Función para actualizar imágenes dinámicamente
function updateImage(section, key, newSrc) {
    if (siteConfig.images[section] && siteConfig.images[section][key]) {
        siteConfig.images[section][key] = newSrc;
        // Aquí actualizarías el DOM
        renderImages();
    }
}

// Función para renderizar imágenes desde la configuración
function renderImages() {
    // Actualizar hero
    const heroImg = document.querySelector('.professional-avatar');
    if (heroImg) heroImg.src = siteConfig.images.hero.professional;
    
    // Actualizar about
    const aboutImg = document.querySelector('.about-main-img');
    if (aboutImg) aboutImg.src = siteConfig.images.about.main;
    
    // Más actualizaciones según necesites...
}

// Exportar para uso en panel admin
if (typeof module !== 'undefined' && module.exports) {
    module.exports = siteConfig;
}