(function () {
  'use strict';

  const MOVEMENTS = [
    {
      key: 'm1', audio: 'assets/audio/01-la-la-land-piano.mp3?v=3',
      index: 'I', title: "Mia & Sebastian's Theme",
      sub: 'La La Land · Mapache Mapachoso, piano solo',
    },
    {
      key: 'm2', audio: 'assets/audio/02-cinema-paradiso.mp3?v=3',
      index: 'II', title: 'Cinema Paradiso',
      sub: 'Ennio Morricone · la orquesta se une',
    },
    {
      key: 'm3', audio: 'assets/audio/03-cant-help-falling-in-love.mp3?v=3',
      index: 'III', title: "Can't Help Falling in Love",
      sub: 'Finale orquestal',
    },
  ];

  const stageSvg = document.getElementById('stage-svg');
  const musiciansLayer = document.getElementById('musicians-layer');
  const pianoMusicianLayer = document.getElementById('piano-musician');
  const conductorLayer = document.getElementById('conductor-layer');

  const audio = document.getElementById('audio-player');
  const btnStart = document.getElementById('btn-start');
  const btnPlay = document.getElementById('btn-play');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnRew = document.getElementById('btn-rew');
  const btnFwd = document.getElementById('btn-fwd');
  const seekBar = document.getElementById('seek-bar');
  const timeCurrent = document.getElementById('time-current');
  const timeDuration = document.getElementById('time-duration');
  const movementIndexEl = document.getElementById('movement-index');
  const movementTitleEl = document.getElementById('movement-title');
  const movementSubEl = document.getElementById('movement-sub');

  let currentMovement = 0;
  let seeking = false;
  let symbolsReady = false;

  // oscurece un color hex (ej. "#d9824a") un porcentaje para el
  // antifaz: debe ser un tono mas oscuro del propio pelaje, no un
  // gris fijo, salvo para especies ya grises (donde casi no cambia).
  function darkenColor(hex, amount) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!m) return hex;
    const r = Math.round(parseInt(m[1], 16) * (1 - amount));
    const g = Math.round(parseInt(m[2], 16) * (1 - amount));
    const b = Math.round(parseInt(m[3], 16) * (1 - amount));
    const toHex = (n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
    return '#' + toHex(r) + toHex(g) + toHex(b);
  }

  const XLINK = 'http://www.w3.org/1999/xlink';
  function setUseHref(useEl, id) {
    useEl.setAttribute('href', id);
    useEl.setAttributeNS(XLINK, 'xlink:href', id);
  }

  function fmtTime(s) {
    if (!isFinite(s) || s < 0) s = 0;
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return m + ':' + String(sec).padStart(2, '0');
  }

  // ---------- construir el escenario a partir de orchestra-data.js ----------
  // Clona el contenido del simbolo en vez de usar <use>: las
  // animaciones CSS por id/clase (batuta, manos del piano, arcos,
  // parpadeo...) apuntan a elementos DENTRO del simbolo, y los
  // navegadores no animan contenido clonado via <use> cuando el
  // <defs> original vive en el SVG separado que cargamos con fetch.
  // Clonando de verdad, esos elementos quedan en el DOM real del
  // escenario y las animaciones si aplican.
  function cloneSymbol(id) {
    const def = document.getElementById(id);
    if (!def) return null;
    const clone = def.cloneNode(true);
    clone.removeAttribute('id');
    return clone;
  }

  function buildStage() {
    const ns = 'http://www.w3.org/2000/svg';
    let globalOrder = 0;

    SECTIONS.forEach((section) => {
      section.seats.forEach((seat, i) => {
        const g = document.createElementNS(ns, 'g');
        const delay = section.wave * 0.22 + i * 0.02;
        g.setAttribute('class', 'musician is-awake section-' + section.id);
        g.setAttribute(
          'transform',
          'translate(' + seat.x + ',' + seat.y + ') scale(' + seat.scale.toFixed(3) + ')'
        );
        g.style.setProperty('--d', delay.toFixed(2) + 's');
        g.style.setProperty('--walkx', (seat.x < 800 ? -260 : 260) + 'px');
        const furColor = SPECIES_COLOR[section.species] || '#9aa0ab';
        g.style.color = furColor;
        g.style.setProperty('--mask-color', darkenColor(furColor, 0.55));
        g.setAttribute('aria-label', section.label);

        const enter = document.createElementNS(ns, 'g');
        enter.setAttribute('class', 'enter-inner');
        g.appendChild(enter);

        const inner = document.createElementNS(ns, 'g');
        inner.setAttribute('class', 'sway-inner');
        enter.appendChild(inner);

        const shadow = document.createElementNS(ns, 'ellipse');
        shadow.setAttribute('cx', '0');
        shadow.setAttribute('cy', '63');
        shadow.setAttribute('rx', '29');
        shadow.setAttribute('ry', '7.5');
        shadow.setAttribute('fill', '#05030a');
        shadow.setAttribute('opacity', '.55');
        inner.appendChild(shadow);

        const bodyClone = cloneSymbol(section.body);
        if (bodyClone) inner.appendChild(bodyClone);

        if (seat.bow) {
          const useBow = document.createElementNS(ns, 'use');
          setUseHref(useBow, '#hair-bow-pink');
          inner.appendChild(useBow);
        }

        musiciansLayer.appendChild(g);
        globalOrder++;
      });
    });

    // coro: solo aparece en el movimiento III (Can't Help Falling in
    // Love), hasta el fondo del escenario. Misma mecanica que los
    // musicos (entrada + mecida), pero con clase "singer" aparte
    // para que la opacidad solo se active en movement-3 (ver CSS).
    (SINGERS || []).forEach((seat, i) => {
      const g = document.createElementNS(ns, 'g');
      const delay = 0.9 + i * 0.05;
      g.setAttribute('class', 'musician is-awake singer section-singer');
      g.setAttribute(
        'transform',
        'translate(' + seat.x + ',' + seat.y + ') scale(' + seat.scale.toFixed(3) + ')'
      );
      g.style.setProperty('--d', delay.toFixed(2) + 's');
      g.style.setProperty('--walkx', (seat.x < 800 ? -260 : 260) + 'px');
      const furColor = SPECIES_COLOR[seat.species] || '#9aa0ab';
      g.style.color = furColor;
      g.style.setProperty('--mask-color', darkenColor(furColor, 0.55));
      g.setAttribute('aria-label', 'Coro');

      const enter = document.createElementNS(ns, 'g');
      enter.setAttribute('class', 'enter-inner');
      g.appendChild(enter);

      const inner = document.createElementNS(ns, 'g');
      inner.setAttribute('class', 'sway-inner');
      enter.appendChild(inner);

      const shadow = document.createElementNS(ns, 'ellipse');
      shadow.setAttribute('cx', '0'); shadow.setAttribute('cy', '63');
      shadow.setAttribute('rx', '29'); shadow.setAttribute('ry', '7.5');
      shadow.setAttribute('fill', '#05030a'); shadow.setAttribute('opacity', '.55');
      inner.appendChild(shadow);

      const bodyClone = cloneSymbol('body-singer');
      if (bodyClone) inner.appendChild(bodyClone);

      if (seat.bow) {
        const useBow = document.createElementNS(ns, 'use');
        setUseHref(useBow, '#hair-bow-pink');
        inner.appendChild(useBow);
      }

      musiciansLayer.appendChild(g);
    });

    // zorro al piano: personaje completo de perfil. Camina a escena
    // cuando el guion lo indica (ver .walk-inner / body.fox-entered).
    const gFox = document.createElementNS(ns, 'g');
    gFox.id = 'piano-fox';
    gFox.setAttribute(
      'transform',
      'translate(' + PIANO_POS.x + ',' + PIANO_POS.y + ') scale(' + PIANO_POS.scale + ')'
    );
    const foxWalk = document.createElementNS(ns, 'g');
    foxWalk.setAttribute('class', 'walk-inner');
    gFox.appendChild(foxWalk);
    const foxShadow = document.createElementNS(ns, 'ellipse');
    foxShadow.setAttribute('cx', '100'); foxShadow.setAttribute('cy', '186');
    foxShadow.setAttribute('rx', '48'); foxShadow.setAttribute('ry', '10');
    foxShadow.setAttribute('fill', '#05030a'); foxShadow.setAttribute('opacity', '.5');
    foxWalk.appendChild(foxShadow);
    const foxClone = cloneSymbol('fox-piano');
    if (foxClone) foxWalk.appendChild(foxClone);
    pianoMusicianLayer.appendChild(gFox);

    // director: camina a escena cuando el guion lo indica (ver
    // .walk-inner / body.mapache-entered)
    const gConductor = document.createElementNS(ns, 'g');
    gConductor.setAttribute(
      'transform',
      'translate(' + CONDUCTOR_POS.x + ',' + CONDUCTOR_POS.y + ') scale(' + CONDUCTOR_POS.scale + ')'
    );
    const conductorWalk = document.createElementNS(ns, 'g');
    conductorWalk.setAttribute('class', 'walk-inner');
    gConductor.appendChild(conductorWalk);
    const conductorShadow = document.createElementNS(ns, 'ellipse');
    conductorShadow.setAttribute('cx', '100'); conductorShadow.setAttribute('cy', '192');
    conductorShadow.setAttribute('rx', '52'); conductorShadow.setAttribute('ry', '11');
    conductorShadow.setAttribute('fill', '#05030a'); conductorShadow.setAttribute('opacity', '.5');
    conductorWalk.appendChild(conductorShadow);
    const conductorClone = cloneSymbol('conductor-mapachoso');
    if (conductorClone) conductorWalk.appendChild(conductorClone);
    conductorLayer.appendChild(gConductor);
  }

  // ---------- cargar la libreria de simbolos (assets/symbols.svg) ----------
  function loadSymbols() {
    return fetch('assets/symbols.svg?v=39')
      .then((r) => r.text())
      .then((text) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'image/svg+xml');
        const defs = doc.querySelector('defs');
        const holder = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        holder.setAttribute('width', '0');
        holder.setAttribute('height', '0');
        holder.style.position = 'absolute';
        holder.appendChild(document.importNode(defs, true));
        document.body.appendChild(holder);
        symbolsReady = true;
      });
  }

  // ---------- movimientos / audio ----------
  function setMovementBodyClass(i) {
    document.body.classList.remove('movement-1', 'movement-2', 'movement-3');
    document.body.classList.add('movement-' + (i + 1));
  }

  function loadMovement(i, autoplay) {
    if (i < 0 || i >= MOVEMENTS.length) return;
    currentMovement = i;
    const mv = MOVEMENTS[i];

    movementIndexEl.textContent = mv.index;
    movementTitleEl.textContent = mv.title;
    movementSubEl.textContent = mv.sub;

    setMovementBodyClass(i);

    btnPrev.disabled = i === 0;
    btnPrev.style.opacity = i === 0 ? '.3' : '1';

    seekBar.style.setProperty('--progress', '0%');
    seekBar.value = 0;
    timeCurrent.textContent = '0:00';
    timeDuration.textContent = '0:00';

    audio.pause();
    audio.src = mv.audio;
    audio.currentTime = 0;
    audio.load();

    if (autoplay) {
      const p = audio.play();
      if (p && p.catch) p.catch(() => {});
    }
  }

  function updatePlayButton() {
    const playing = !audio.paused && !audio.ended;
    btnPlay.textContent = playing ? '❚❚' : '▶';
    document.body.classList.toggle('is-playing', playing);
  }

  function togglePlay() {
    document.body.classList.add('has-started');
    if (audio.paused) {
      const p = audio.play();
      if (p && p.catch) p.catch(() => {});
    } else {
      audio.pause();
    }
  }

  function startConcert() {
    document.body.classList.add('has-started');
    loadMovement(0, true);
  }

  function triggerFinale() {
    audio.pause();
    document.body.classList.add('is-closing');
  }

  // ---------- eventos ----------
  // si story.js tomo el control (la experiencia narrada), el boton
  // de inicio arranca el guion en vez de ir directo al movimiento 1
  btnStart.addEventListener('click', () => {
    if (window.StoryEngine) { window.StoryEngine.start(); return; }
    startConcert();
  });
  btnPlay.addEventListener('click', togglePlay);

  btnPrev.addEventListener('click', () => {
    if (currentMovement > 0) loadMovement(currentMovement - 1, true);
    else { audio.currentTime = 0; }
  });

  btnNext.addEventListener('click', () => {
    if (currentMovement < MOVEMENTS.length - 1) loadMovement(currentMovement + 1, true);
    else triggerFinale();
  });

  btnRew.addEventListener('click', () => {
    if (!isFinite(audio.duration)) return;
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  });
  btnFwd.addEventListener('click', () => {
    if (!isFinite(audio.duration)) return;
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
  });

  seekBar.addEventListener('input', () => {
    seeking = true;
    if (audio.duration) {
      const t = (seekBar.value / 1000) * audio.duration;
      timeCurrent.textContent = fmtTime(t);
      seekBar.style.setProperty('--progress', (seekBar.value / 10) + '%');
    }
  });
  seekBar.addEventListener('change', () => {
    if (audio.duration) audio.currentTime = (seekBar.value / 1000) * audio.duration;
    seeking = false;
  });

  audio.addEventListener('loadedmetadata', () => {
    timeDuration.textContent = fmtTime(audio.duration);
  });
  audio.addEventListener('timeupdate', () => {
    if (seeking) return;
    timeCurrent.textContent = fmtTime(audio.currentTime);
    if (audio.duration) {
      const pct = (audio.currentTime / audio.duration) * 1000;
      seekBar.value = pct;
      seekBar.style.setProperty('--progress', (pct / 10) + '%');
    }
  });
  audio.addEventListener('play', updatePlayButton);
  audio.addEventListener('pause', updatePlayButton);
  audio.addEventListener('ended', () => {
    // en la experiencia narrada, story.js decide que pasa al
    // terminar una pieza (aplausos + dialogo), no el avance libre
    if (window.StoryEngine) return;
    if (currentMovement < MOVEMENTS.length - 1) {
      loadMovement(currentMovement + 1, true);
    } else {
      triggerFinale();
    }
  });

  // ---------- arranque ----------
  loadSymbols().then(() => {
    buildStage();
    setMovementBodyClass(0);
    movementIndexEl.textContent = MOVEMENTS[0].index;
    movementTitleEl.textContent = MOVEMENTS[0].title;
    movementSubEl.textContent = MOVEMENTS[0].sub;
    if (window.StoryEngine) window.StoryEngine.onStageReady();
  });

  // expuesto para js/story.js (la experiencia narrada reutiliza el
  // reproductor de audio y el cambio de movimiento ya construidos)
  window.Concert = {
    audio, MOVEMENTS, loadMovement, setMovementBodyClass, triggerFinale,
    btnPrev, btnNext,
  };
})();
