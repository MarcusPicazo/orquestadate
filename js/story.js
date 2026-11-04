(function () {
  'use strict';

  const dialogueBox = document.getElementById('dialogue-box');
  const dialogueSpeaker = document.getElementById('dialogue-speaker');
  const dialogueText = document.getElementById('dialogue-text');
  const dialogueContinue = document.getElementById('dialogue-continue');
  const smallBubble = document.getElementById('dialogue-bubble-small');
  const audioTuning = document.getElementById('audio-tuning');
  const audioApplause = document.getElementById('audio-applause');

  let stepIndex = -1;
  let stageReady = false;
  let orchestraEls = [];
  let singerEls = [];
  let tuningWanted = false;

  // ---------- utilidades de audio ----------
  function clampVolume(v) { return Math.max(0, Math.min(1, v)); }

  function fadeAudio(el, from, to, ms, cb) {
    el.volume = clampVolume(from);
    if (ms <= 0) { el.volume = clampVolume(to); if (cb) cb(); return; }
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / ms);
      el.volume = clampVolume(from + (to - from) * t);
      if (t < 1) requestAnimationFrame(step);
      else if (cb) cb();
    }
    requestAnimationFrame(step);
  }

  function playTuning() {
    tuningWanted = true;
    if (audioTuning.paused) {
      audioTuning.volume = 0;
      const p = audioTuning.play();
      if (p && p.catch) p.catch(() => {});
    }
    fadeAudio(audioTuning, audioTuning.volume, 0.55, 700);
  }

  function stopTuning(cb) {
    tuningWanted = false;
    if (audioTuning.paused) { if (cb) cb(); return; }
    fadeAudio(audioTuning, audioTuning.volume, 0, 500, () => {
      audioTuning.pause();
      if (cb) cb();
    });
  }

  function playApplause(cb) {
    audioApplause.currentTime = 0;
    audioApplause.volume = 0;
    const p = audioApplause.play();
    if (p && p.catch) p.catch(() => {});
    fadeAudio(audioApplause, 0, 0.85, 500, () => {
      setTimeout(() => {
        fadeAudio(audioApplause, audioApplause.volume, 0, 900, () => {
          audioApplause.pause();
          if (cb) cb();
        });
      }, 3200);
    });
  }

  // ---------- dialogo ----------
  function showDialogue(text, onContinue) {
    dialogueText.textContent = text;
    dialogueBox.classList.add('is-open');
    dialogueContinue.onclick = () => {
      dialogueBox.classList.remove('is-open');
      if (onContinue) onContinue();
    };
  }

  function showSmallBubble(text, ms, cb) {
    smallBubble.textContent = text;
    smallBubble.classList.add('is-open');
    setTimeout(() => {
      smallBubble.classList.remove('is-open');
      if (cb) cb();
    }, ms);
  }

  // ---------- entradas caminando ----------
  function walkIn(who, cb) {
    if (who === 'mapache') {
      document.body.classList.add('mapache-entered');
      setTimeout(cb, 2400);
    } else if (who === 'fox') {
      document.body.classList.add('fox-entered');
      setTimeout(cb, 2400);
    } else if (who === 'orchestra') {
      window.Concert.setMovementBodyClass(1); // movement-2: musicos de la orquesta
      setTimeout(cb, 2600);
    } else if (who === 'singers') {
      window.Concert.setMovementBodyClass(2); // movement-3: coro
      setTimeout(cb, 2600);
    } else {
      cb();
    }
  }

  // ---------- presentar a un musico ----------
  function introduce(el, cb) {
    if (!el) { cb(); return; }
    el.classList.add('introducing');
    setTimeout(() => el.classList.remove('introducing'), 750);
    setTimeout(cb, 120);
  }

  function angryJumpAll(cb) {
    const all = document.querySelectorAll('.musician.is-awake');
    all.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('introducing');
        setTimeout(() => el.classList.remove('introducing'), 750);
      }, (i % 6) * 70);
    });
    setTimeout(cb, 1500);
  }

  function closeCurtain() {
    stopTuning();
    document.body.classList.add('is-closing');
    dialogueBox.classList.remove('is-open');
  }

  // ---------- reproducir una pieza ----------
  function playSong(trackIndex, cb) {
    stopTuning(() => {
      playApplause(() => {
        const audio = window.Concert.audio;
        window.Concert.loadMovement(trackIndex, false);
        audio.volume = 0;
        const p = audio.play();
        if (p && p.catch) p.catch(() => {});
        fadeAudio(audio, 0, 1, 1500);

        const onEnded = () => {
          audio.removeEventListener('ended', onEnded);
          playApplause(() => {
            playTuning();
            cb();
          });
        };
        audio.addEventListener('ended', onEnded);
      });
    });
  }

  // ---------- motor principal ----------
  function next() {
    stepIndex++;
    if (stepIndex >= STORY_SCRIPT.length) return;
    const step = STORY_SCRIPT[stepIndex];

    switch (step.type) {
      case 'walkIn':
        walkIn(step.who, next);
        break;

      case 'dialogue':
        showDialogue(step.text, next);
        break;

      case 'song':
        playSong(step.track, next);
        break;

      case 'introduce': {
        const idx = ORCHESTRA_NAMES.indexOf(step.name);
        const el = orchestraEls[idx];
        introduce(el, () => {
          const line = ORCHESTRA_LINES[step.name] || ('¡' + step.name + '!');
          showDialogue(line, next);
        });
        break;
      }

      case 'introduceSinger': {
        const idx = SINGER_NAMES.indexOf(step.name);
        const el = singerEls[idx];
        introduce(el, () => {
          showDialogue('¡' + step.name + '!', next);
        });
        break;
      }

      case 'specialBubble':
        showSmallBubble(step.text, 2600, next);
        break;

      case 'angryJumpAll':
        angryJumpAll(next);
        break;

      case 'closeCurtain':
        closeCurtain();
        break;

      default:
        next();
    }
  }

  function start() {
    document.body.classList.add('has-started');
    const btnPrev = window.Concert && window.Concert.btnPrev;
    const btnNext = window.Concert && window.Concert.btnNext;
    if (btnPrev) btnPrev.style.display = 'none';
    if (btnNext) btnNext.style.display = 'none';
    playTuning();
    next();
  }

  function onStageReady() {
    stageReady = true;
    orchestraEls = Array.from(document.querySelectorAll('#musicians-layer > .musician:not(.singer)'));
    singerEls = Array.from(document.querySelectorAll('#musicians-layer > .musician.singer'));
  }

  window.StoryEngine = { start, onStageReady };
})();
