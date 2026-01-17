window.addEventListener('contenidoCompartidoCargado', () => {
  // Data Definitions
        const trayectosData = [
            { title: "Desarrollo de Videojuegos", icon: "gamepad-2", desc: "Aprendemos a crear nuestros propios videojuegos, transformándonos de jugadores a creadores." },
            { title: "Programación en Roblox", icon: "cuboid", desc: "Desarrollamos la lógica de programación y diseño creando experiencias en Roblox, nuestra plataforma favorita." },
            { title: "Arte y Dibujo Digital", icon: "palette", desc: "Impulsamos la creatividad con clases de Ilustración y Dibujo Digital, usando PC o tablet." },
            { title: "Creacion de Contenidos + Marketing Digital", icon: "monitor-play", desc: "Nos convertimos en Youtuber, Streamer o Creador de Contenidos, aprendiendo edición de video y comunicación estratégica para redes." },
            { title: "Producción Musical", icon: "music", desc: "Creamos nuestras propias bases y canciones con instrumentos digitales, cubriendo composición y mezcla profesional." },
            { title: "Modelado y Animación 3D", icon: "rotate-3d", desc: "Dominamos el Modelado y Animación 3D con Blender para dar vida a personajes y crear mundos virtuales" },
            { title: "Lectura Crítica y Storytelling", icon: "notebook-pen", desc: "Desarrollamos pensamiento crítico desde un taller de lectura y escritura que combina filosofía y narrativa." },
            { title: "Estadística y Ciencia de Datos", icon: "brain-circuit", desc: "Dominamos el análisis de datos y la inteligencia artificial aplicada para crear sistemas que predicen el futuro." },
            { title: "Prog. Web + Sistemas Informáticos", icon: "code", desc: "Dominamos HTML y JavaScript para construir sitios y sistemas informáticos que usan bases de datos de Google Drive." },
            { title: "Emprendimientos e Inversiones 4.0", icon: "rocket", desc: "Transformamos ideas en negocios digitales con un enfoque en economía y finanzas." },
        ];

        // 1. Render Trayectos Grid (Static List)
        const gridContainer = document.getElementById('trayectos-grid');
        trayectosData.forEach(item => {
            const div = document.createElement('div');
            div.className = "group p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all hover:-translate-y-1 bg-white/[0.02] hover:bg-white/[0.05]";
            div.innerHTML = `
                <div class="mb-4 p-3 rounded-lg inline-block transition-colors group-hover:bg-blue-900/50 text-brand-accent">
                    <i data-lucide="${item.icon}" class="w-8 h-8"></i>
                </div>
                <h3 class="font-bold text-lg leading-tight mb-2">${item.title}</h3>
                <p class="text-sm opacity-60">${item.desc}</p>
            `;
            gridContainer.appendChild(div);
        });

        // 2. Carousel Logic (Hero Section)
        const carouselContainer = document.getElementById('carousel-container');
        const indicatorsContainer = document.getElementById('carousel-indicators');
        let currentSlide = 0;

        function renderCarousel() {
            // Render slides
            carouselContainer.innerHTML = '';
            indicatorsContainer.innerHTML = '';

            trayectosData.forEach((item, index) => {
                // Slide Element
                const slide = document.createElement('div');
                // Use absolute positioning to stack them, toggle opacity for transition
                slide.className = `absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 relative' : 'opacity-0 absolute pointer-events-none'}`;
                slide.style.minHeight = "250px"; // Ensure height consistency
                
                slide.innerHTML = `
                    <div class="w-24 h-24 mb-6 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(92,225,230,0.3)] bg-brand-primary text-brand-accent transition-transform transform ${index === currentSlide ? 'scale-110' : 'scale-90'}">
                        <i data-lucide="${item.icon}" width="48" height="48"></i>
                    </div>
                    <h3 class="text-2xl font-bold mb-2 animate-fade-in">${item.title}</h3>
                    <p class="text-sm opacity-100 max-w-xs mx-auto animate-fade-in">${item.desc}</p>
                `;
                carouselContainer.appendChild(slide);

                // Indicator Dot
                const dot = document.createElement('button');
                dot.className = `w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-brand-accent w-6' : 'bg-white/30 hover:bg-white/50'}`;
                dot.onclick = () => {
                    currentSlide = index;
                    renderCarousel();
                    lucide.createIcons();
                    resetCarouselInterval();
                };
                indicatorsContainer.appendChild(dot);
            });
        }
        
        let carouselInterval = null;
        const INTERVAL_TIME = 4500;

        function startCarouselInterval() {
        carouselInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % trayectosData.length;
            renderCarousel();
            lucide.createIcons();
          }, INTERVAL_TIME);
        }

        function resetCarouselInterval() {
            clearInterval(carouselInterval);
            startCarouselInterval();
        }


        startCarouselInterval();


        // Initial Carousel Render
        renderCarousel();

        // 3. Mobile Menu Toggle
        function toggleMenu() {
            const menu = document.getElementById('mobile-menu');
            const icon = document.getElementById('menu-icon');
            
            if (menu.classList.contains('hidden')) {
                menu.classList.remove('hidden');
                // Change icon to X (we need to manually handle this with lucide or just toggle class)
                // For simplicity in vanilla js, we just re-render
                // But lucide replaces the element, so we target the parent button innerHTML
                icon.parentElement.innerHTML = '<i data-lucide="x" id="menu-icon"></i>';
            } else {
                menu.classList.add('hidden');
                icon.parentElement.innerHTML = '<i data-lucide="menu" id="menu-icon"></i>';
            }
            lucide.createIcons();
        }

        // 4. Initialize Icons
        lucide.createIcons();


          fbq('track', 'ViewContent');
          document.getElementById('btn-whatsapp').addEventListener('click', function() {
          fbq('track', 'Lead');
          });

          document.getElementById('btn-phone').addEventListener('click', function() {
          fbq('track', 'Lead');
          });

          document.getElementById('btn-mail').addEventListener('click', function() {
          fbq('track', 'Lead');
          });
          document.getElementById('btn-whatsapp-top').addEventListener('click', function() {
          fbq('track', 'Lead');
          });
          document.getElementById('btn-whatsapp-top-mobile').addEventListener('click', function() {
          fbq('track', 'Lead');
          });
});




