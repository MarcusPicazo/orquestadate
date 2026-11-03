(function () {
  'use strict';

  const MOVEMENTS = [
    {
      key: 'm1', audio: 'assets/audio/01-la-la-land-piano.mp3',
      index: 'I', title: "Mia & Sebastian's Theme",
      sub: 'La La Land · Mapache Mapachoso, piano solo',
    },
    {
      key: 'm2', audio: 'assets/audio/02-cinema-paradiso.mp3',
      index: 'II', title: 'Cinema Paradiso',
      sub: 'Ennio Morricone · la orquesta se une',
    },
    {
      key: 'm3', audio: 'assets/audio/03-cant-help-falling-in-love.mp3',
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
        g.style.color = SPECIES_COLOR[section.species] || '#9aa0ab';
        g.setAttribute('aria-label', section.label);

        const inner = document.createElementNS(ns, 'g');
        inner.setAttribute('class', 'sway-inner');
        g.appendChild(inner);

        const useBody = document.createElementNS(ns, 'use');
        setUseHref(useBody, '#' + section.body);
        inner.appendChild(useBody);

        const headId = HEAD_FOR[section.species];
        if (headId) {
          const useHead = document.createElementNS(ns, 'use');
          setUseHref(useHead, '#' + headId);
          inner.appendChild(useHead);
        }

        musiciansLayer.appendChild(g);
        globalOrder++;
      });
    });

    // zorro al piano: presente en los tres movimientos
    const gFox = document.createElementNS(ns, 'g');
    gFox.id = 'piano-fox';
    gFox.classList.add('always-on', 'musician', 'is-awake');
    gFox.style.color = SPECIES_COLOR[PIANO_SPECIES];
    gFox.setAttribute(
      'transform',
      'translate(' + PIANO_POS.x + ',' + PIANO_POS.y + ') scale(' + PIANO_POS.scale + ')'
    );
    const useFoxBody = document.createElementNS(ns, 'use');
    setUseHref(useFoxBody, '#body-piano');
    const useFoxHead = document.createElementNS(ns, 'use');
    setUseHref(useFoxHead, '#' + HEAD_FOR[PIANO_SPECIES]);
    gFox.appendChild(useFoxBody);
    gFox.appendChild(useFoxHead);
    pianoMusicianLayer.appendChild(gFox);

    // director
    const gConductor = document.createElementNS(ns, 'g');
    gConductor.setAttribute(
      'transform',
      'translate(' + CONDUCTOR_POS.x + ',' + CONDUCTOR_POS.y + ') scale(' + CONDUCTOR_POS.scale + ')'
    );
    const useConductor = document.createElementNS(ns, 'use');
    setUseHref(useConductor, '#conductor-mapachoso');
    gConductor.appendChild(useConductor);
    conductorLayer.appendChild(gConductor);
  }

  // ---------- cargar la libreria de simbolos (assets/symbols.svg) ----------
  function loadSymbols() {
    return fetch('assets/symbols.svg')
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
  btnStart.addEventListener('click', startConcert);
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
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  });
  btnFwd.addEventListener('click', () => {
    audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10);
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
  });
})();
