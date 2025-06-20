/**
 * Portfolio JavaScript - Main script for the portfolio webpage
 * This file manages GitHub repositories display, carousel functionality, and certificate modal
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // ===== INICIALIZAR TODAS LAS FUNCIONALIDADES =====
    initGithubRepositories();
    initCarousel();
    initCertificateModal();
});

/**
 * SECCIÓN 1: REPOSITORIOS DE GITHUB
 * Carga y muestra los repositorios más recientes desde GitHub
 */
function initGithubRepositories() {
    // Configuración del usuario GitHub
    const username = '756e6e616d6564';
    const reposContainer = document.getElementById('github-repos');
    
    // Si no existe el contenedor en la página, no continuamos
    if (!reposContainer) return;
    
    // Obtener repositorios de GitHub
    fetchRepositories();
    
    // Función para obtener repositorios de GitHub
    async function fetchRepositories() {
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch repositories');
            }
            
            const repos = await response.json();
            
            // Limpiar mensaje de carga
            reposContainer.innerHTML = '';
            
            // Mostrar repositorios (límite de 6 o ajustar según necesidad)
            repos.slice(0, 6).forEach(repo => {
                createRepoCard(repo, reposContainer);
            });
            
            // Si no se encontraron repositorios
            if (repos.length === 0) {
                reposContainer.innerHTML = '<div class="loading">No se encontraron repositorios</div>';
            }
        } catch (error) {
            console.error('Error fetching repos:', error);
            reposContainer.innerHTML = `<div class="loading">Error al cargar repositorios: ${error.message}</div>`;
        }
    }
    
    // Función para crear tarjetas de repositorio
    function createRepoCard(repo, container) {
        // Mapeo de colores para lenguajes
        const languageColors = {
            JavaScript: '#f1e05a',
            HTML: '#e34c26',
            CSS: '#563d7c',
            Python: '#3572A5',
            Java: '#b07219',
            TypeScript: '#3178c6',
            null: '#cccccc' // Para repos sin lenguaje
        };
        
        const languageColor = languageColors[repo.language] || languageColors[null];
        
        // Crear tarjeta de repositorio
        const repoCard = document.createElement('div');
        repoCard.className = 'repo-card';
        
        // Formatear fecha
        const updatedDate = new Date(repo.updated_at);
        const formattedDate = updatedDate.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Generar HTML para la tarjeta
        repoCard.innerHTML = `
            <div class="repo-name">${repo.name}</div>
            <div class="repo-description">${repo.description || 'Sin descripción'}</div>
            <div class="repo-details">
                <div class="repo-language">
                    ${repo.language ? 
                        `<span class="language-dot" style="background-color: ${languageColor}"></span>
                         ${repo.language}` : 
                        '<span class="language-dot" style="background-color: #cccccc"></span> Sin lenguaje'
                    }
                </div>
                <div class="repo-updated"><i class="fas fa-history"></i> ${formattedDate}</div>
            </div>
            <div class="repo-stats">
                ${repo.stargazers_count ? 
                    `<span class="repo-stat"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>` : ''
                }
                ${repo.forks_count ? 
                    `<span class="repo-stat"><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>` : ''
                }
            </div>
            <a href="${repo.html_url}" target="_blank" class="repo-link">Ver proyecto <i class="fas fa-external-link-alt"></i></a>
        `;
        
        container.appendChild(repoCard);
    }
}

/**
 * SECCIÓN 2: CARRUSEL DE CERTIFICACIONES
 * Maneja la funcionalidad del carrusel con desplazamiento automático y manual
 */
function initCarousel() {
    const carousel = document.querySelector('.carousel-wrapper');
    const leftEdge = document.querySelector('.carousel-edge.left-edge');
    const rightEdge = document.querySelector('.carousel-edge.right-edge');
    
    if (!carousel || !leftEdge || !rightEdge) return;
    
    const items = carousel.querySelectorAll('.carousel-item');
    let currentIndex = 0;
    const itemWidth = 320; // Ancho aproximado de cada ítem + gap
    
    // Variables para control del carrusel
    let animationFrame;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // Velocidad más lenta (píxeles por frame)
    const totalWidth = items.length * itemWidth;
    let manualControl = false;
    
    // Inicializar el carrusel
    updateActiveClasses();
    startAutoplay();
    setupEventListeners();
    
    // Función para actualizar la clase activa
    function updateActiveClasses() {
        items.forEach((item, index) => {
            item.classList.remove('active');
            if (index === currentIndex) {
                item.classList.add('active');
            }
        });
    }
    
    // Función para ir a un slide específico
    function goToSlide(index) {
        if (index < 0) index = 0;
        if (index >= items.length) index = items.length - 1;
        
        currentIndex = index;
        scrollPosition = index * itemWidth;
        
        carousel.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        updateActiveClasses();
    }
    
    // Función para manejar el clic en los bordes
    function handleEdgeClick(direction) {
        manualControl = true;
        stopAutoplay();
        
        if (direction === 'left') {
            scrollPosition = Math.max(0, scrollPosition - itemWidth);
        } else {
            scrollPosition = Math.min(totalWidth - itemWidth, scrollPosition + itemWidth);
        }
        
        carousel.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        // Actualizar el índice actual
        const newIndex = Math.floor(scrollPosition / itemWidth);
        if (newIndex !== currentIndex && newIndex < items.length) {
            currentIndex = newIndex;
            updateActiveClasses();
        }
        
        // Volver a la reproducción automática después de 3 segundos
        setTimeout(() => {
            manualControl = false;
        }, 3000);
    }
    
    // Función para manejar swipe en táctiles
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left, go right
            scrollPosition = Math.min(totalWidth - itemWidth, scrollPosition + itemWidth);
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right, go left
            scrollPosition = Math.max(0, scrollPosition - itemWidth);
        }
        
        carousel.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        // Actualizar el índice actual
        const newIndex = Math.floor(scrollPosition / itemWidth);
        if (newIndex !== currentIndex && newIndex < items.length) {
            currentIndex = newIndex;
            updateActiveClasses();
        }
    }
    
    // Función para animación automática del carrusel
    function animateCarousel() {
        if (scrollPosition >= totalWidth) {
            // Volvemos al principio cuando llegamos al final
            scrollPosition = 0;
            carousel.scrollTo({ left: 0, behavior: 'auto' });
        } else {
            scrollPosition += scrollSpeed;
            carousel.scrollTo({ left: scrollPosition, behavior: 'auto' });
        }
        
        // Actualizar el índice actual basado en la posición
        const newIndex = Math.floor(scrollPosition / itemWidth);
        if (newIndex !== currentIndex && newIndex < items.length) {
            currentIndex = newIndex;
            updateActiveClasses();
        }
        
        animationFrame = requestAnimationFrame(animateCarousel);
    }
    
    // Funciones para controlar la reproducción
    function startAutoplay() {
        animationFrame = requestAnimationFrame(animateCarousel);
    }
    
    function stopAutoplay() {
        cancelAnimationFrame(animationFrame);
    }
    
    // Configurar gestores de eventos
    function setupEventListeners() {
        // Variables para touch
        let touchStartX = 0;
        let touchEndX = 0;
        
        // Navegación por clic en los bordes
        leftEdge.addEventListener('click', () => handleEdgeClick('left'));
        rightEdge.addEventListener('click', () => handleEdgeClick('right'));
        
        // Detener/iniciar autoplay al interactuar
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
        
        // Control táctil para móviles
        carousel.addEventListener('touchstart', (e) => {
            stopAutoplay();
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            
            // Reiniciar autoplay después de 3 segundos
            setTimeout(() => {
                if (!carousel.matches(':hover')) {
                    startAutoplay();
                }
            }, 3000);
        }, { passive: true });
        
        // Detectar cuando el carrusel se desplaza
        carousel.addEventListener('scroll', () => {
            const scrollPosition = carousel.scrollLeft;
            const newIndex = Math.round(scrollPosition / itemWidth);
            
            if (newIndex !== currentIndex) {
                currentIndex = newIndex;
                updateActiveClasses();
            }
        });
    }
    
    // Exponemos funciones que pueden ser necesarias en otros contextos
    window.startAutoplay = startAutoplay;
    window.stopAutoplay = stopAutoplay;
}

/**
 * SECCIÓN 3: MODAL DE CERTIFICADOS
 * Gestiona la visualización de certificados en modal o enlaces externos
 */
function initCertificateModal() {
    const modal = document.getElementById('certificateModal');
    const modalTitle = document.getElementById('modalTitle');
    const certificateFrame = document.getElementById('certificateFrame');
    const downloadBtn = document.getElementById('downloadCert');
    const closeModal = document.querySelector('.close-modal');
    const certLoading = document.querySelector('.certificate-loading');
    const certItems = document.querySelectorAll('.carousel-item');
    
    // Si el modal no existe en la página, no continuamos
    if (!modal) return;
    
    // Configurar eventos de los certificados
    setupCertificateEvents();
    
    // Función para abrir el modal y mostrar el certificado
    function openCertificateModal(certPath, certTitle) {
        // Determinar si es una URL completa o un archivo local
        let fullPath;
        let isWebUrl = certPath.startsWith('http');
        
        if (isWebUrl) {
            // Es una URL web directa
            fullPath = certPath;
            
            // Actualizamos el botón de descarga para que sea un enlace externo
            downloadBtn.innerHTML = '<i class="fas fa-external-link-alt"></i> Visitar sitio';
            downloadBtn.removeAttribute('download');
            downloadBtn.setAttribute('target', '_blank');
        } else {
            // Es un archivo local (PDF u otro)
            fullPath = `/edeauv/resources/certifications/${certPath}`;
            
            // Configuración normal para descarga
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Descargar';
            downloadBtn.setAttribute('download', certPath);
            downloadBtn.setAttribute('target', '_blank');
        }
        
        // Actualizamos el título y la fuente del iframe
        modalTitle.textContent = certTitle;
        certificateFrame.src = fullPath;
        downloadBtn.href = fullPath;
        
        // Mostramos el modal con animación
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        document.body.style.overflow = 'hidden'; // Evitar scroll en el fondo
        
        // Mostrar el indicador de carga
        certLoading.style.display = 'flex';
        
        // Ocultamos el indicador de carga cuando el iframe termina de cargar
        certificateFrame.onload = function() {
            certLoading.style.display = 'none';
        };
    }
    
    // Cerrar el modal
    function closeCertModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            certificateFrame.src = '';
        }, 300);
        document.body.style.overflow = ''; // Restaurar scroll
    }
    
    // Configurar los eventos del modal y certificados
    function setupCertificateEvents() {
        // Evento para cerrar el modal con el botón de cerrar
        closeModal.addEventListener('click', function() {
            closeCertModal();
        });
        
        // Cerrar el modal al hacer clic fuera del contenido
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeCertModal();
            }
        });
        
        // También cerrar con la tecla ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeCertModal();
            }
        });
        
        // Añadir eventos a cada elemento del carrusel
        certItems.forEach(item => {
            const certLink = item.querySelector('.cert-link');
            const certPath = item.dataset.cert;
            const certTitle = item.querySelector('.degree').textContent;
            
            certLink.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Si es un enlace externo (FreeCodeCamp, Certiprof, etc.), abrir en una nueva pestaña
                if (certPath.includes('freecodecamp.org') || certPath.includes('certiprof.com') || item.dataset.type === 'web') {
                    window.open(certPath, '_blank');
                    return;
                }
                
                // Para otros certificados, detener la autoreproducción del carrusel
                if (typeof stopAutoplay === 'function') {
                    stopAutoplay();
                }
                
                // Abrir el modal con el certificado correspondiente
                openCertificateModal(certPath, certTitle);
            });
        });
    }
}
