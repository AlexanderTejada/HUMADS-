# Configuración para Panel de Administración

## Estado Actual
- Sitio web estático (HTML/CSS/JS)
- Imágenes organizadas en subcarpetas temáticas
- Configuración centralizada en `js/config.js`

## Opciones de Implementación

### Opción 1: Firebase (Recomendada para inicio rápido)
```bash
npm install firebase
```

**Ventajas:**
- Autenticación incluida
- Storage para imágenes
- Base de datos en tiempo real
- Hosting gratuito hasta cierto límite

### Opción 2: Strapi CMS
```bash
npx create-strapi-app backend --quickstart
```

**Ventajas:**
- Panel de admin incluido
- API REST automática
- Gestión de medios integrada
- Open source

### Opción 3: Next.js + Prisma
```bash
npx create-next-app@latest admin-panel
npm install prisma @prisma/client
```

**Ventajas:**
- Full-stack con React
- API routes integradas
- SSR/SSG para mejor SEO

## Estructura Preparada

```
assets/img/
├── hero/          # Imágenes principales
├── carrusel/      # Equipo (9 imágenes)
├── about/         # Sección nosotros
├── strategy/      # Sección estrategia
├── casos/         # Casos de éxito
└── servicios/     # Servicios (6 imágenes)
```

## API Endpoints Necesarios

```javascript
// Autenticación
POST   /api/auth/login
POST   /api/auth/logout

// Gestión de imágenes
GET    /api/images          // Listar todas
POST   /api/images/upload   // Subir nueva
PUT    /api/images/:id      // Actualizar
DELETE /api/images/:id      // Eliminar

// Configuración del sitio
GET    /api/config          // Obtener config
PUT    /api/config          // Actualizar config
```

## Ejemplo de Panel Admin Simple

```html
<!-- admin.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Panel Admin - Humads</title>
    <link rel="stylesheet" href="admin-styles.css">
</head>
<body>
    <div class="admin-panel">
        <h1>Gestión de Contenido</h1>
        
        <!-- Sección Hero -->
        <section class="image-section">
            <h2>Imagen Hero</h2>
            <div class="current-image">
                <img id="hero-preview" src="" alt="Hero actual">
            </div>
            <input type="file" id="hero-upload" accept="image/*">
            <button onclick="uploadImage('hero')">Actualizar</button>
        </section>

        <!-- Sección Equipo -->
        <section class="image-section">
            <h2>Equipo (Carrusel)</h2>
            <div class="image-grid" id="team-grid">
                <!-- Generado dinámicamente -->
            </div>
        </section>

        <!-- Más secciones... -->
    </div>

    <script src="js/config.js"></script>
    <script src="js/admin.js"></script>
</body>
</html>
```

## Script de Admin Básico

```javascript
// js/admin.js
class AdminPanel {
    constructor() {
        this.config = siteConfig;
        this.init();
    }

    init() {
        this.loadCurrentImages();
        this.setupEventListeners();
    }

    loadCurrentImages() {
        // Cargar imagen hero
        document.getElementById('hero-preview').src = 
            this.config.images.hero.professional;

        // Cargar equipo
        const teamGrid = document.getElementById('team-grid');
        this.config.images.team.forEach((member, index) => {
            const div = document.createElement('div');
            div.innerHTML = `
                <img src="${member.src}" alt="${member.name}">
                <input type="file" id="team-${index}" accept="image/*">
                <button onclick="updateTeamMember(${index})">Actualizar</button>
            `;
            teamGrid.appendChild(div);
        });
    }

    async uploadImage(section, file) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('section', section);

        try {
            const response = await fetch('/api/images/upload', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            // Actualizar configuración local
            this.updateConfig(section, data.url);
            
            // Actualizar vista
            this.refreshPreview(section);
            
        } catch (error) {
            console.error('Error uploading:', error);
        }
    }

    updateConfig(section, newUrl) {
        // Actualizar objeto de configuración
        // Guardar en backend
    }

    refreshPreview(section) {
        // Actualizar preview en admin
        // Actualizar sitio principal si está abierto
    }
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', () => {
    new AdminPanel();
});
```

## Próximos Pasos

1. **Elegir tecnología backend**
2. **Configurar autenticación**
3. **Implementar API de imágenes**
4. **Crear panel de administración**
5. **Conectar frontend con backend**
6. **Implementar sistema de caché**
7. **Añadir validaciones y seguridad**

## Seguridad Importante

- Validar tipos de archivo (solo imágenes)
- Limitar tamaño de archivos
- Autenticación robusta
- CORS configurado correctamente
- Sanitizar nombres de archivo
- Backup regular de imágenes