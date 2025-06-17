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
        const dotsContainer = document.querySelector('.carousel-dots');
        
        if (!carousel || !leftEdge || !rightEdge) return;
        
        const items = carousel.querySelectorAll('.carousel-item');
        let currentIndex = 0;
        const itemWidth = 320; // Ancho aproximado de cada ítem + gap
        
        // Crear los puntos indicadores
        if (dotsContainer) {
            items.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('carousel-dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
        }
        
        // Función para actualizar la clase activa
        function updateActiveClasses() {
            // Actualizar ítems activos
            items.forEach((item, index) => {
                item.classList.remove('active');
                if (index === currentIndex) {
                    item.classList.add('active');
                }
            });
            
            // Actualizar dots
            const dots = dotsContainer?.querySelectorAll('.carousel-dot');
            if (dots) {
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
            }
        }
          // Función para ir a un slide específico
        function goToSlide(index) {
            if (index < 0) index = 0;
            if (index >= items.length) index = items.length - 1;
            
            // Si ya estamos en el límite, añadir un pequeño efecto de rebote visual
            if (index === currentIndex && (index === 0 || index === items.length - 1)) {
                const edgeEffect = (index === 0) ? 'left-edge-bounce' : 'right-edge-bounce';
                carousel.classList.add(edgeEffect);
                setTimeout(() => carousel.classList.remove(edgeEffect), 400);
                return;
            }
            
            currentIndex = index;
            
            // Aplicar efecto de desvanecimiento durante la transición
            carousel.style.opacity = '0.9';
            
            // Animación suave al slide
            carousel.scrollTo({
                left: index * itemWidth,
                behavior: 'smooth'
            });
            
            // Restaurar opacidad después de la transición
            setTimeout(() => {
                carousel.style.opacity = '1';
            }, 300);
            
            updateActiveClasses();
        }
          // Variables para controlar el hover
        let hoverTimer = null;
        let isHovering = false;
        
        // Función para manejar el hover en los extremos
        function handleEdgeHover(direction) {
            if (isHovering) return;
            isHovering = true;
            
            // Primera acción inmediata
            if (direction === 'left') {
                goToSlide(currentIndex - 1);
                animateCarouselShift('left');
            } else {
                goToSlide(currentIndex + 1);
                animateCarouselShift('right');
            }
            
            // Continuar desplazando si se mantiene el hover
            hoverTimer = setInterval(() => {
                if (direction === 'left') {
                    goToSlide(currentIndex - 1);
                    animateCarouselShift('left');
                } else {
                    goToSlide(currentIndex + 1);
                    animateCarouselShift('right');
                }
            }, 2000); // Intervalo más largo para dar tiempo a ver el contenido
        }
        
        function stopHover() {
            clearInterval(hoverTimer);
            isHovering = false;
        }
        
        // Navegar al hacer hover en los extremos
        leftEdge.addEventListener('mouseenter', () => handleEdgeHover('left'));
        leftEdge.addEventListener('mouseleave', stopHover);
        
        rightEdge.addEventListener('mouseenter', () => handleEdgeHover('right'));
        rightEdge.addEventListener('mouseleave', stopHover);
        
        // También permitir navegación por clic para dispositivos táctiles
        leftEdge.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
            animateCarouselShift('left');
        });
        
        rightEdge.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
            animateCarouselShift('right');
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
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left, go right
                goToSlide(currentIndex + 1);
                animateCarouselShift('right');
            }
            
            if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right, go left
                goToSlide(currentIndex - 1);
                animateCarouselShift('left');
            }
        }
        
        // Auto-reproducción del carrusel
        let autoplayInterval;
        
        function startAutoplay() {
            autoplayInterval = setInterval(() => {
                const nextIndex = (currentIndex + 1) % items.length;
                goToSlide(nextIndex);
            }, 5000); // Cambiar cada 5 segundos
        }
        
        function stopAutoplay() {
            clearInterval(autoplayInterval);
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
