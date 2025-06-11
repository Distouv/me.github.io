// layout.js

function injectLayout(containerId, fragmentPath) {
  fetch(fragmentPath)
    .then(res => {
      if (!res.ok) throw new Error(`No se pudo cargar ${fragmentPath} (código ${res.status})`);
      return res.text();
    })
    .then(html => {
      const el = document.getElementById(containerId);
      if (!el) {
        console.warn(`[LAYOUT] No se encontró el contenedor: ${containerId}`);
        return;
      }
      el.innerHTML = html;
      console.log(`[LAYOUT] Cargado: ${fragmentPath} en #${containerId}`);
    })
    .catch(err => {
      console.error(`[LAYOUT] Error cargando ${fragmentPath}:`, err);
    });
}

// Ejecutar automáticamente al cargar el script
document.addEventListener("DOMContentLoaded", () => {
  injectLayout("navbar", "resources/partials/navbar.html");
  injectLayout("footer", "resources/partials/footer.html");
});