document.addEventListener('DOMContentLoaded', function() {
    // GitHub username - update this to your GitHub username
    const username = '756e6e616d6564'; // Change this to your actual GitHub username
    
    // Get the container where repos will be displayed
    const reposContainer = document.getElementById('github-repos');
      // Function to fetch GitHub repositories
    async function fetchRepositories() {
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch repositories');
            }
            
            const repos = await response.json();
            
            // Clear loading message
            reposContainer.innerHTML = '';
            
            // Display repositories (limit to 6 or adjust as needed)
            repos.slice(0, 6).forEach(repo => {
                // Create language color
                const languageColors = {
                    JavaScript: '#f1e05a',
                    HTML: '#e34c26',
                    CSS: '#563d7c',
                    Python: '#3572A5',
                    Java: '#b07219',
                    TypeScript: '#3178c6',
                    // Add more languages as needed
                    null: '#cccccc' // For repos with no language
                };
                
                const languageColor = languageColors[repo.language] || languageColors[null];
                
                // Create repo card
                const repoCard = document.createElement('div');
                repoCard.className = 'repo-card';
                
                // Format date
                const updatedDate = new Date(repo.updated_at);
                const formattedDate = updatedDate.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
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
                
                reposContainer.appendChild(repoCard);
            });
            
            // If no repos found
            if (repos.length === 0) {
                reposContainer.innerHTML = '<div class="loading">No se encontraron repositorios</div>';
            }
              } catch (error) {
            console.error('Error fetching repos:', error);
            reposContainer.innerHTML = `<div class="loading">Error al cargar repositorios: ${error.message}</div>`;
        }
    }
    
    // Call the function to fetch and display repos
    fetchRepositories();
      // Carrusel animado y mejorado
    // Función para inicializar el carrusel
    function initCarousel() {
        const carousel = document.querySelector('.carousel-wrapper');
        const leftEdge = document.querySelector('.carousel-edge.left-edge');
        const rightEdge = document.querySelector('.carousel-edge.right-edge');
        
        if (!carousel || !leftEdge || !rightEdge) return;
        
        const items = carousel.querySelectorAll('.carousel-item');
        let currentIndex = 0;
        const itemWidth = 320; // Ancho aproximado de cada ítem + gap
        
        // Función para actualizar la clase activa
        function updateActiveClasses() {
            // Actualizar ítems activos
            items.forEach((item, index) => {
                item.classList.remove('active');
                if (index === currentIndex) {
                    item.classList.add('active');
                }
            });
        }        // Función para ir a un slide específico
        function goToSlide(index) {
            if (index < 0) index = 0;
            if (index >= items.length) index = items.length - 1;
            
            currentIndex = index;
            scrollPosition = index * itemWidth;
            
            // Animación suave al slide
            carousel.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
            
            updateActiveClasses();
        }
        
        // Variables para controlar la navegación manual
        let manualControl = false;
        
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
          // Navegación por clic en los bordes
        leftEdge.addEventListener('click', () => {
            handleEdgeClick('left');
        });
        
        rightEdge.addEventListener('click', () => {
            handleEdgeClick('right');
        });
        
        // Efecto visual de desplazamiento
        function animateCarouselShift(direction) {
            carousel.classList.add(`shift-${direction}`);
            setTimeout(() => carousel.classList.remove(`shift-${direction}`), 400);
        }
        
        // Detectar cuando el carrusel se desplaza para actualizar el índice activo
        carousel.addEventListener('scroll', () => {
            const scrollPosition = carousel.scrollLeft;
            const newIndex = Math.round(scrollPosition / itemWidth);
            
            if (newIndex !== currentIndex) {
                currentIndex = newIndex;
                updateActiveClasses();
            }
        });
          // Touch swipe functionality para móviles
        let touchStartX = 0;
        let touchEndX = 0;
        
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
          // Auto-reproducción del carrusel con movimiento suave y continuo
        let animationFrame;
        let scrollPosition = 0;
        const scrollSpeed = 0.5; // Velocidad más lenta (píxeles por frame)
        const totalWidth = items.length * itemWidth;
        
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
        
        function startAutoplay() {
            animationFrame = requestAnimationFrame(animateCarousel);
        }
        
        function stopAutoplay() {
            cancelAnimationFrame(animationFrame);
        }
        
        // Iniciar autoplay
        startAutoplay();
        
        // Detener autoplay al interactuar
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('touchstart', stopAutoplay);
        
        // Reiniciar autoplay cuando el usuario deja de interactuar
        carousel.addEventListener('mouseleave', startAutoplay);
          // Inicialmente marcar el primer ítem como activo
        updateActiveClasses();
    }
    
    // Inicializar el carrusel
    initCarousel();
});
// Funcionalidad del modal de certificados
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('certificateModal');
    const modalTitle = document.getElementById('modalTitle');
    const certificateFrame = document.getElementById('certificateFrame');
    const downloadBtn = document.getElementById('downloadCert');
    const closeModal = document.querySelector('.close-modal');
    const certLoading = document.querySelector('.certificate-loading');
    const certItems = document.querySelectorAll('.carousel-item');
    
    // Si el modal no existe en la página, no continuamos
    if (!modal) return;    // Función para abrir el modal y mostrar el certificado
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
            // Detener la autoreproducción del carrusel
            if (typeof stopAutoplay === 'function') {
                stopAutoplay();
            }
            // Abrir el modal con el certificado correspondiente
            openCertificateModal(certPath, certTitle);
        });
    });
});
