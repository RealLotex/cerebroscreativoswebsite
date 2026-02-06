class CustomFooter extends HTMLElement {
  connectedCallback() {
    // 1. Definimos solo el HTML (sin la etiqueta <script> adentro)
    this.innerHTML = `
    <!-- --- FOOTER --- -->
    <footer class="py-10 px-6 border-t border-white/10 bg-black/20 text-sm">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div class="flex flex-col items-center md:items-start">
                <div class="font-bold text-xl tracking-tighter mb-2">
                    CerebrosCreativos<span class="text-brand-accent">.org</span>
                </div>
                <p class="opacity-50">© 2026 Todos los derechos reservados.</p>
            </div>
            
            <div class="text-right text-white/80 opacity-70">
              <div class="md:flex gap-6 md:mb-4">
                  <a href="https://www.facebook.com/cerebroscreativosorg" class="justify-center mb-3 flex items-center gap-2 hover:text-white hover:underline transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                      <span>Facebook</span>
                  </a>

                  <a href="https://www.instagram.com/cerebroscreativosorg/" class="justify-center mb-3 flex items-center gap-2 hover:text-white hover:underline transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                      <span>Instagram</span>
                  </a>

                  <a href="https://cerebroscreativos.org/inscripciones" class="justify-center mb-3 flex items-center gap-2 hover:text-white hover:underline transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                      <span>WhatsApp</span>
                  </a>

                  <a href="mailto:contacto@cerebroscreativos.org" class="justify-center mb-3 flex items-center gap-2 hover:text-white hover:underline transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                      <span>Email</span>
                  </a>
              </div>

              <div class="flex-row md:flex justify-end items-end gap-6">
                  <a href="/privacy-policy.html" class="justify-center mb-3 flex items-center gap-2 hover:text-white hover:underline transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path></svg>
                      <span>Política de Privacidad</span>
                  </a>

                  <a href="/terms-of-use.html" class="justify-center mb-3 flex items-center gap-2 hover:text-white hover:underline transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>
                      <span>Términos de Uso</span>
                  </a>
              </div>
            </div>
          </div>
        </div>
    </footer>
    `;
  }
}

customElements.define('custom-footer', CustomFooter);

