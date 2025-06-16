document.addEventListener('DOMContentLoaded', function() {
    // GitHub username - update this to your GitHub username
    const username = 'tucuenta'; // Change this to your actual GitHub username
    
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
                                'Sin lenguaje'
                            }
                        </div>
                        <div class="repo-updated">Actualizado: ${formattedDate}</div>
                    </div>
                    <a href="${repo.html_url}" target="_blank" class="repo-link">Ver proyecto →</a>
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
});
