(() => {
  const BRAND_RE = /Cerebros\s*Creativos|CerebrosCreativos/i;

  const TRACKS = {
    'arte-digital.html': { age: '8+', modality: 'Online', level: 'Progresivo', duration: '5 meses' },
    'contenidos-y-marketing.html': {
      age: '12+', modality: 'Online', level: 'Progresivo', duration: '5 meses',
      fit: 'Querés aprender estrategia, marketing, métricas, edición y producción digital con una mirada más integral.',
      alternative: { label: 'Creador en Redes Sociales', href: 'creador-de-contenidos.html', text: 'Quizás te conviene Creador en Redes Sociales si tu prioridad es empezar por videos, canales y publicación de contenido.' }
    },
    'creador-de-contenidos.html': {
      age: '10+', modality: 'Online', level: 'Inicial', duration: '5 meses',
      fit: 'Querés empezar creando videos, aprendiendo edición y entendiendo cómo gestionar contenido para redes.',
      alternative: { label: 'Productor Digital', href: 'contenidos-y-marketing.html', text: 'Quizás te conviene Productor Digital si buscás una formación más amplia en marketing, métricas, campañas y producción.' }
    },
    'electronica-robotica.html': { age: 'Consultar', modality: 'Online', level: 'Inicial', duration: '5 meses' },
    'lectura-critica-y-storytelling.html': { age: '14+', modality: 'Online', level: 'Progresivo', duration: '5 meses' },
    'modelado-y-animacion-3d.html': { age: '12+', modality: 'Online', level: 'Progresivo', duration: '5 meses' },
    'pequenos-programadores.html': { age: 'Consultar', modality: 'Online', level: 'Inicial', duration: '5 meses' },
    'produccion-musical.html': { age: '14+', modality: 'Online', level: 'Progresivo', duration: '5 meses' },
    'programacion-de-videojuegos-10-11.html': {
      age: '10–11', modality: 'Online', level: 'Inicial', duration: '5 meses',
      fit: 'Tenés entre 10 y 11 años y querés aprender lógica y creación de videojuegos con un recorrido pensado para esa edad.',
      alternative: { label: 'Pequeños Programadores', href: 'pequenos-programadores.html', text: 'Quizás te conviene Pequeños Programadores si necesitás una introducción más gradual a la programación antes de enfocarte en videojuegos.' }
    },
    'programacion-de-videojuegos-12-14.html': {
      age: '12–14', modality: 'Online', level: 'Intermedio', duration: '5 meses',
      fit: 'Tenés entre 12 y 14 años y querés desarrollar juegos 2D y 3D sin quedar atado a una sola plataforma.',
      alternative: { label: 'Programación en Roblox', href: 'programacion-en-roblox.html', text: 'Si tenés 14 años y querés especializarte específicamente en Roblox y Lua, quizás te conviene Programación en Roblox.' }
    },
    'programacion-de-videojuegos-15.html': {
      age: '15+', modality: 'Online', level: 'Avanzado', duration: '5 meses',
      fit: 'Tenés 15 años o más y querés trabajar con Unity, Unreal Engine y herramientas cercanas a un flujo profesional.',
      alternative: { label: 'Programación en Roblox', href: 'programacion-en-roblox.html', text: 'Quizás te conviene Programación en Roblox si preferís concentrarte en Lua, multijugador y el ecosistema Roblox.' }
    },
    'programacion-en-roblox.html': {
      age: '14+', modality: 'Online', level: 'Intermedio', duration: '5 meses',
      fit: 'Tenés 14 años o más y querés especializarte en Roblox Studio, Lua, multijugador y sistemas propios de esa plataforma.',
      alternative: { label: 'Programación de Videojuegos', href: 'programacion-de-videojuegos-15.html', text: 'Quizás te conviene Programación de Videojuegos si buscás motores y herramientas aplicables fuera del ecosistema Roblox.' }
    }
  };

  TRACKS['pequeños-programadores.html'] = TRACKS['pequenos-programadores.html'];
  TRACKS['programación-en-roblox.html'] = TRACKS['programacion-en-roblox.html'];

  const LEGACY_LINKS = {
    'pequeños-programadores.html': 'pequenos-programadores.html',
    'programación-en-roblox.html': 'programacion-en-roblox.html'
  };

  const TEXT_REPLACEMENTS = [
    [/\bLas habilidades que desarrollará\b/g, 'Las habilidades que vas a desarrollar'],
    [/\bLas habilidades clave que dominará\b/g, 'Las habilidades clave que vas a dominar'],
    [/\bLas habilidades que aprenderá\b/g, 'Las habilidades que vas a aprender'],
    [/Software que aprenderá:/g, 'Software que vas a aprender:'],
    [/Herramientas que aprenderá:/g, 'Herramientas que vas a aprender:'],
    [/(^|\s)Aprende\b/g, '$1Aprendé'],
    [/(^|\s)Desarrolla\b/g, '$1Desarrollá'],
    [/(^|\s)Domina\b/g, '$1Dominá'],
    [/(^|\s)Explora\b/g, '$1Explorá'],
    [/(^|\s)Visualiza\b/g, '$1Visualizá'],
    [/(^|\s)Actualiza\b/g, '$1Actualizá'],
    [/(^|\s)Crea\b/g, '$1Creá'],
    [/(^|\s)Descubre\b/g, '$1Descubrí'],
    [/(^|\s)Elige\b/g, '$1Elegí'],
    [/(^|\s)Construye\b/g, '$1Construí'],
    [/(^|\s)Convierte\b/g, '$1Convertí'],
    [/\bpuedes\b/g, 'podés'],
    [/\bHablanos\b/g, 'Hablános'],
    [/Crean su camino y lo recorren a tu propio ritmo\./g, 'Crean su camino y lo recorren a su propio ritmo.'],
    [/Una formación completa para donde dominaremos las redes, el márketing, la creación de contenidos y la edición de video\./g, 'Una formación completa para dominar redes, marketing, creación de contenidos y edición de video.'],
    [/Consulte Cuota/g, 'Consultá la cuota'],
    [/`([^`]+)`/g, '$1'],
    [/\*\*([^*]+)\*\*/g, '$1']
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
      try {
        return decodeURIComponent(String(value).split('/').pop() || '');
      } catch (_) {
        return String(value).split('/').pop() || '';
      }
    }
  }

  function currentTrack() {
    return TRACKS[normalizeFilename(window.location.href)] || null;
  }

  function rewriteLegacyLinks() {
    document.querySelectorAll('a[href]').forEach(link => {
      const raw = link.getAttribute('href');
      const file = normalizeFilename(raw);
      const canonical = LEGACY_LINKS[file];
      if (!raw || !canonical) return;
      link.setAttribute('href', raw
        .replace('pequeños-programadores.html', 'pequenos-programadores.html')
        .replace('programación-en-roblox.html', 'programacion-en-roblox.html')
        .replace('peque%C3%B1os-programadores.html', 'pequenos-programadores.html')
        .replace('programaci%C3%B3n-en-roblox.html', 'programacion-en-roblox.html'));
    });
  }

  function ensureDetailNavbar() {
    if (!document.body.classList.contains('detail-light') || document.querySelector('.cc-detail-nav')) return;
    const oldNav = document.querySelector('body.detail-light > nav');
    const access = oldNav ? oldNav.querySelector('acceso-a-clases') : null;
    if (access) access.remove();
    if (oldNav) oldNav.remove();

    const nav = document.createElement('nav');
    nav.className = 'cc-detail-nav';
    nav.innerHTML = `
      <div class="cc-detail-nav__inner">
        <a class="cc-detail-nav__brand" href="/" aria-label="Cerebros Creativos">
          <img src="./cc-favicon.png" class="cc-navbar-mark" alt="" aria-hidden="true">
          <span>CerebrosCreativos<span>.org</span></span>
        </a>
        <div class="cc-detail-nav__actions">
          <a class="cc-detail-nav__link" href="/propuesta.html#trayectos">Ver cursos</a>
          <span class="cc-detail-nav__access"></span>
          <a class="cc-detail-nav__cta meta-lead-btn" href="https://wa.me/5493404564631?text=Hola! quisiera consultar por un trayecto de Cerebros Creativos" target="_blank" rel="noopener">Consultar</a>
        </div>
      </div>`;

    const accessSlot = nav.querySelector('.cc-detail-nav__access');
    if (access) accessSlot.replaceWith(access);
    else accessSlot.remove();
    document.body.prepend(nav);
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
    return [`Edad: ${track.age}`, `Modalidad: ${track.modality}`, `Nivel: ${track.level}`, `Duración: ${track.duration}`]
      .map(value => `<span>${value}</span>`).join('');
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

  function normalizeCertifications() {
    if (!document.body.classList.contains('detail-light')) return;
    const labels = Array.from(document.querySelectorAll('p'))
      .filter(p => /Hito Desbloqueado/i.test(p.textContent || ''));
    const names = ['Certificado Inicial', 'Certificado Intermedio', 'Certificado Avanzado'];
    labels.forEach((label, index) => {
      const container = label.parentElement;
      if (!container) return;
      label.textContent = 'Certificación';
      const certificate = Array.from(container.querySelectorAll('p')).find(p => p !== label);
      if (certificate) certificate.textContent = names[Math.min(index, names.length - 1)];
    });
  }

  function setLinkLabel(link, label) {
    if (!link) return;
    Array.from(link.childNodes)
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .forEach(node => node.remove());
    link.append(` ${label}`);
  }

  function normalizeDetailCta() {
    if (!document.body.classList.contains('detail-light')) return;
    const cta = document.querySelector('.final-cta');
    if (!cta) return;
    cta.classList.add('cc-detail-cta');
    const inner = cta.querySelector(':scope > div') || cta;
    const heading = inner.querySelector('h2');
    if (heading) heading.innerHTML = '¿Querés saber si este trayecto<br>es para vos?';

    let copy = inner.querySelector('.cc-detail-cta-copy');
    if (!copy) {
      copy = document.createElement('p');
      copy.className = 'cc-detail-cta-copy';
      copy.textContent = 'Hablá con un asesor y te ayudamos a confirmar edad, nivel, modalidad y disponibilidad.';
      if (heading) heading.insertAdjacentElement('afterend', copy);
      else inner.prepend(copy);
    }

    const whatsapp = cta.querySelector('#btn-whatsapp, a[href^="https://wa.me/"]');
    const phone = cta.querySelector('#btn-phone, a[href^="tel:"]');
    const mail = cta.querySelector('#btn-mail, a[href^="mailto:"]');
    [whatsapp, phone, mail].forEach(link => { if (link) link.classList.add('cc-detail-cta-button'); });
    if (whatsapp) whatsapp.classList.add('cc-detail-cta-button--primary');
    setLinkLabel(whatsapp, 'Consultar por WhatsApp');
    setLinkLabel(phone, 'Llamar');
    setLinkLabel(mail, 'Enviar email');
  }

  function ensureDetailFooter() {
    if (!document.body.classList.contains('detail-light') || document.querySelector('.cc-detail-footer')) return;
    document.querySelectorAll('body.detail-light > footer, body.detail-light > custom-footer').forEach(el => el.remove());
    const footer = document.createElement('footer');
    footer.className = 'cc-detail-footer';
    footer.innerHTML = `
      <div class="cc-detail-footer__inner">
        <a class="cc-detail-footer__brand" href="/">
          <img src="./cc-favicon.png" alt="" aria-hidden="true">
          <span>CerebrosCreativos<span>.org</span></span>
        </a>
        <nav class="cc-detail-footer__links" aria-label="Enlaces del sitio">
          <a href="/">Inicio</a>
          <a href="/propuesta.html">KIDS</a>
          <a href="/propuestajr.html">Jr_</a>
          <a href="/propuestastudio.html">Studio</a>
          <a href="mailto:contacto@cerebroscreativos.org">Contacto</a>
        </nav>
        <p>© ${new Date().getFullYear()} CerebrosCreativos.org</p>
      </div>`;
    document.body.appendChild(footer);
  }

  function applyTextCleanup() {
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
      TEXT_REPLACEMENTS.forEach(([pattern, replacement]) => { text = text.replace(pattern, replacement); });
      node.textContent = text;
    });
  }

  function applyBranding() {
    ensureDetailNavbar();
    rewriteLegacyLinks();
    document.querySelectorAll('nav').forEach(addBrandMark);
    document.querySelectorAll('header').forEach(header => { if (!header.closest('nav')) addBrandMark(header); });
    normalizeAgeBadge();
    decorateCourseCards();
    addTrackOrientation();
    normalizeCertifications();
    normalizeDetailCta();
    ensureDetailFooter();
    applyTextCleanup();
    window.requestAnimationFrame(() => {
      rewriteLegacyLinks();
      decorateCourseCards();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyBranding);
  else applyBranding();
})();