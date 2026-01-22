class AccesoAClases extends HTMLElement {
  connectedCallback() {
    // 1. Definimos solo el HTML (sin la etiqueta <script> adentro)
    this.innerHTML = `
      <div class="text-white hover:bg-white/5 transition-all px-1 py-1 rounded-xl border border-white/20 text-sm font-medium justify-center block md:flex items-center gap-2 ">
        <input type="text" 
          oninput="this.value = this.value.replace(/\\s+/g, '')" 
          placeholder="Nombre de tu Profe"
          class="user-input px-2 py-2 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-brand-accent/10 focus:border-transparent mb-2 w-full text-center md:w-40 md:mb-0">
        
        <button id="btn-entrar" class="px-2 py-2 rounded-xl font-bold shadow-lg bg-brand-accent text-brand-bg flex items-center gap-1 hover:bg-transparent/50 hover:text-brand-accent transition-all w-full justify-center md:w-40 md:mb-0">
          Entrar a la clase
          <i data-lucide="mouse-pointer-click"></i>
        </button>
      </div>
    `;


    const input = this.querySelector('.user-input');

    // --- Lógica de Sincronización ---

    // 1. Escuchar cuando el usuario escribe en ESTE input
    input.addEventListener('input', (e) => {
      // Limpiar espacios (reemplaza tu oninput inline para mayor orden)
      const valor = e.target.value.replace(/\s+/g, '');
      e.target.value = valor;

      // Notificar a todos los demás inputs con la clase .user-input
      document.querySelectorAll('.user-input').forEach(el => {
        if (el !== e.target) { // Evitamos el bucle infinito en el mismo input
          el.value = valor;
        }
      });
    });
    
    // 2. Definimos la función globalmente para que el onclick (si lo usaras) la vea
    // Pero es mejor usar addEventListener aquí mismo:
    this.querySelector('#btn-entrar').addEventListener('click', () => {
      this.ejecutarRedireccion();
    });

    // 3. Soporte para la tecla Enter
    this.querySelector('.user-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.ejecutarRedireccion();
    });

    // 4. Inicializar iconos si usas Lucide
    if (window.lucide) window.lucide.createIcons();
  }

  // 5. Creamos la lógica como un método de la clase o función global
  ejecutarRedireccion() {
    const inputs = document.querySelectorAll('.user-input');
    let respuesta = "";

    inputs.forEach(input => {
      if (input.value.trim() !== "") {
        respuesta = input.value.toLowerCase().trim();
      }
    });

    if (respuesta === "" && inputs.length > 0) {
        respuesta = inputs[0].value.toLowerCase().trim();
    }

    const rutas = {
      'marcosrosich': "https://meet.jit.si/moderated/1a69f7149346dcf73bf7ab289ba8f37809cb7f26eaacd47f8762024ea6dff9d9",
      'eugenioporta': "https://meet.jit.si/moderated/d8c21ddbb4b2325d88f92b4e79e5861492ded2f5bd79cb1c5bbeab3f6a922484"
    };

    if (rutas[respuesta]) {
      window.location.href = rutas[respuesta];
    } else {
      alert("No encontramos el nombre que escribiste.\nAsegúrate de que esté bien escrito.");
    }
  }
}

customElements.define('acceso-a-clases', AccesoAClases);

