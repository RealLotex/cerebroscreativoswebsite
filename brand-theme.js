(() => {
  const BRAND_RE = /Cerebros\s*Creativos|CerebrosCreativos/i;

  const TRACKS = {
    'arte-digital.html': {
      age: '8+',
      modality: 'Online en vivo',
      level: 'Progresivo',
      duration: '5 meses'
    },
    'contenidos-y-marketing.html': {
      age: '12+',
      modality: 'Online en vivo',
      level: 'Progresivo',
      duration: '5 meses',
      fit: 'Querés aprender estrategia, marketing, métricas, edición y producción digital con una mirada más integral.',
      alternative: {
        label: 'Creador en Redes Sociales',
        href: 'creador-de-contenidos.html',
        text: 'Quizás te conviene Creador en Redes Sociales si tu prioridad es empezar por videos, canales y publicación de contenido.'
      }
    },
    'creador-de-contenidos.html': {
      age: '10+',
      modality: 'Online en vivo',
      level: 'Inicial',
      duration: '5 meses',
      fit: 'Querés empezar creando videos, aprendiendo edición y entendiendo cómo gestionar contenido para redes.',
      alternative: {
        label: 'Productor Digital',
        href: 'contenidos-y-marketing.html',
        text: 'Quizás te conviene Productor Digital si buscás una formación más amplia en marketing, métricas, campañas y producción.'
      }
    },
    'electronica-robotica.html': {
      age: 'Consultar',
      modality: 'Online en vivo',
      level: 'Inicial',
      duration: '5 meses'
    },
    'lectura-critica-y-storytelling.html': {
      age: '14+',
      modality: 'Online en vivo',
      level: 'Progresivo',
      duration: '5 meses'
    },
    'modelado-y-animacion-3d.html': {
      age: '12+',
      modality: 'Online en vivo',
      level: 'Progresivo',
      duration: '5 meses'
    },
    'pequeños-programadores.html': {
      age: 'Consultar',
      modality: 'Online en vivo',
      level: 'Inicial',
      duration: '5 meses'
    },
    'produccion-musical.html': {
      age: '14+',
      modality: 'Online en vivo',
      level: 'Progresivo',
      duration: '5 meses'
    },
    'programacion-de-videojuegos-10-11.html': {
      age: '10–11',
      modality: 'Online en vivo',
      level: 'Inicial',
      duration: '5 meses',
      fit: 'Tenés entre 10 y 11 años y querés aprender lógica y creación de videojuegos con un recorrido pensado para esa edad.',
      alternative: {
        label: 'Pequeños Programadores',
        href: 'pequeños-programadores.html',
        text: 'Quizás te conviene Pequeños Programadores si necesitás una introducción más gradual a la programación antes de enfocarte en videojuegos.'
      }
    },
    'programacion-de-videojuegos-12-14.html': {
      age: '12–14',
      modality: 'Online en vivo',
      level: 'Intermedio',
      duration: '5 meses',
      fit: 'Tenés entre 12 y 14 años y querés desarrollar juegos 2D y 3D sin quedar atado a una sola plataforma.',
      alternative: {
        label: 'Programación en Roblox',
        href: 'programación-en-roblox.html',
        text: 'Si tenés 14 años y querés especializarte específicamente en Roblox y Lua, quizás te conviene Programación en Roblox.'
      }
    },
    'programacion-de-videojuegos-15.html': {
      age: '15+',
      modality: 'Online en vivo',
      level: 'Avanzado',
      duration: '5 meses',
      fit: 'Tenés 15 años o más y querés trabajar con Unity, Unreal Engine y herramientas cercanas a un flujo profesional.',
      alternative: {
        label: 'Programación en Roblox',
        href: 'programación-en-roblox.html',
        text: 'Quizás te conviene Programación en Roblox si preferís concentrarte en Lua, multijugador y el ecosistema Roblox.'
      }
    },
    'programación-en-roblox.html': {
      age: '14+',
      modality: 'Online en vivo',
      level: 'Intermedio',
      duration: '5 meses',
      fit: 'Tenés 14 años o más y querés especializarte en Roblox Studio, Lua, multijugador y sistemas propios de esa plataforma.',
      alternative: {
        label: 'Programación de Videojuegos',
        href: 'programacion-de-videojuegos-15.html',
        text: 'Quizás te conviene Programación de Videojuegos si buscás motores y herramientas aplicables fuera del ecosistema Roblox.'
      }
    }
  };

  const VOSEO_REPLACEMENTS = [
    [/\bLas habilidades que desarrollará\b/g, 'Las habilidades que vas a desarrollar'],
    [/\bLas habilidades clave que dominará\b/g, 'Las habilidades clave que vas a dominar'],
    [/\bSoftware que aprenderá:\b/g, 'Software que vas a aprender:'],
    [/\bHerramientas que aprenderá:\b/g, 'Herramientas que vas a aprender:'],
    [/^Aprende\b/, 'Aprendé'],
    [/^Desarrolla\b/, 'Desarrollá'],
    [/^Domina\b/, 'Dominá'],
    [/^Explora\b/, 'Explorá'],
    [/^Visualiza\b/, 'Visualizá'],
    [/^Actualiza\b/, 'Actualizá'],
    [/^Crea\b/, 'Creá'],
    [/^Descubre\b/, 'Descubrí'],
    [/^Elige\b/, 'Elegí'],
    [/^Construye\b/, 'Construí'],
    [/^Convierte\b/, 'Convertí'],
    [/\bpuedes\b/g, 'podés'],
    [/\bHablanos\b/g, 'Hablános'],
    [/Crean su camino y lo recorren a tu propio ritmo\./g, 'Crean su camino y lo recorren a su propio ritmo.']
  ];

  function directText(el) {
    return Array.from(el.childNodes)
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent || '')
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function addBrandMark(root) {
    if (!root || root.querySelector('.cc-navbar-mark')) return;

    const candidates = Array.from(root.querySelectorAll('div, a, span, h1, h2, h3'));
    const target = candidates.find(el => BRAND_RE.test(directText(el)));

    if (!target) return;

    target.classList.add('cc-brand-lockup');

    const img = document.createElement('img');
    img.src = './cc-favicon.png';
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.className = 'cc-navbar-mark';
    target.prepend(img);
  }

  function normalizeFilename(value) {
    if (!value) return '';
    try {
      const pathname = new URL(value, window.location.href).pathname;
      return decodeURIComponent(pathname.split('/').pop() || '');
    } catch (_) {
      return decodeURIComponent(String(value).split('/').pop() || '');
    }
  }

  function currentTrack() {
    return TRACKS[normalizeFilename(window.location.href)] || null;
  }

  function normalizeAgeBadge() {
    if (!document.body.classList.contains('detail-light')) return;
    const track = currentTrack();
    if (!track) return;

    const badge = document.querySelector('header .relative.z-10 > span.inline-block');
    if (!badge) return;

    badge.textContent = track.age === 'Consultar'
      ? 'Trayecto Tecnológico 2026 · Edad a consultar'
      : `Trayecto Tecnológico 2026 (${track.age} años)`;
  }

  function factsMarkup(track) {
    return [
      `Edad: ${track.age}`,
      `Modalidad: ${track.modality}`,
      `Nivel: ${track.level}`,
      `Duración: ${track.duration}`
    ].map(value => `<span>${value}</span>`).join('');
  }

  function decorateCourseCards() {
    document.querySelectorAll('a[href]').forEach(link => {
      const track = TRACKS[normalizeFilename(link.getAttribute('href'))];
      if (!track) return;

      const card = link.closest('.course-card, article');
      if (!card || card.querySelector('.cc-course-facts')) return;

      const facts = document.createElement('div');
      facts.className = 'cc-course-facts';
      facts.setAttribute('aria-label', 'Datos del trayecto');
      facts.innerHTML = factsMarkup(track);

      const detailLink = card.querySelector('.course-detail-link');
      if (detailLink) card.insertBefore(facts, detailLink);
      else card.appendChild(facts);
    });
  }

  function addTrackOrientation() {
    if (!document.body.classList.contains('detail-light')) return;
    const track = currentTrack();
    if (!track || !track.fit || !track.alternative || document.querySelector('.cc-track-fit')) return;

    const header = document.querySelector('body.detail-light > header');
    if (!header) return;

    const section = document.createElement('section');
    section.className = 'cc-track-fit';
    section.innerHTML = `
      <div class="cc-track-fit__inner">
        <div class="cc-track-fit__item">
          <span class="cc-track-fit__eyebrow">Este trayecto es para vos si…</span>
          <p>${track.fit}</p>
        </div>
        <div class="cc-track-fit__item cc-track-fit__item--alt">
          <span class="cc-track-fit__eyebrow">Quizás te conviene otro si…</span>
          <p>${track.alternative.text}</p>
          <a href="${track.alternative.href}">Ver ${track.alternative.label} →</a>
        </div>
      </div>`;

    header.insertAdjacentElement('afterend', section);
  }

  function applyVoseo() {
    if (!document.body.matches('.proposal-light, .detail-light')) return;

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || parent.closest('script, style, code, pre, textarea')) return NodeFilter.FILTER_REJECT;
        return node.textContent && node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(node => {
      let text = node.textContent;
      VOSEO_REPLACEMENTS.forEach(([pattern, replacement]) => {
        text = text.replace(pattern, replacement);
      });
      node.textContent = text;
    });
  }

  function applyBranding() {
    document.querySelectorAll('nav').forEach(addBrandMark);

    // Legal/utility pages use a header as their navigation bar.
    document.querySelectorAll('header').forEach(header => {
      if (!header.closest('nav')) addBrandMark(header);
    });

    normalizeAgeBadge();
    decorateCourseCards();
    addTrackOrientation();
    applyVoseo();

    // Proposal cards are generated by each page's inline script. A second pass
    // keeps metadata consistent if a browser executes those scripts later.
    window.requestAnimationFrame(decorateCourseCards);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyBranding);
  } else {
    applyBranding();
  }
})();