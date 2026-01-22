class CookiesConsent extends HTMLElement {
  connectedCallback() {
    // 1. Definimos el HTML con clases de Tailwind
    this.innerHTML = `
    <div id="cookie-banner" class="fixed -bottom-full left-0 right-0 bg-brand-bg/95 backdrop-blur-md text-white p-6 md:px-12 flex flex-col md:flex-row justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.4)] z-[9999] transition-all duration-700 ease-in-out border-t border-brand-primary/30 font-sans">
      <div class="max-w-4xl text-center md:text-left">
        <p class="text-sm md:text-base leading-relaxed">
          En <span class="font-bold text-brand-accent text-shadow-md">Cerebros Creativos</span> usamos cookies para mejorar tu experiencia y optimizar nuestros anuncios. 
          Lee nuestra <a href="/privacy-policy.html" class="text-brand-accent underline hover:text-brand-secondary transition-colors">Política de Privacidad</a>.
        </p>
      </div>
      <button id="accept-cookies" class="mt-4 md:mt-0 md:ml-8 bg-brand-accent hover:bg-transparent/50 hover:text-brand-accent text-brand-bg font-bold py-2.5 px-8 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg">
        Aceptar
      </button>
    </div>
    `;

    // 2. Lógica de visualización y eventos
    const banner = this.querySelector("#cookie-banner");
    const btn = this.querySelector("#accept-cookies");

    // Verifica si ya aceptó anteriormente
    if (!localStorage.getItem("cookiesAceptadas")) {
      setTimeout(() => {
        // Quitamos la clase de posición oculta y aplicamos la de visibilidad
        banner.classList.remove("-bottom-full");
        banner.classList.add("bottom-0");
      }, 1500); // Aparece 1.5s después de cargar
    }

    btn.addEventListener("click", () => {
      localStorage.setItem("cookiesAceptadas", "true");
      banner.classList.add("-bottom-full");
      banner.classList.remove("bottom-0");
      
      console.log("Cookies aceptadas en Cerebros Creativos");
    });
  }
}

customElements.define('cookies-consent', CookiesConsent);