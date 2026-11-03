// Datos de la orquesta: secciones, especies, instrumentos y su
// ubicacion en el escenario (viewBox 0 0 1600 1000, y crece hacia
// el publico = abajo). El piano de cola y el podio de Mapache
// ocupan el centro; las secciones dejan un pasillo libre ahi para
// que nadie se encime.

const SPECIES_COLOR = {
  mapache: '#8891a0',
  fox: '#d9824a',
  bear: '#8a6a4a',
  rabbit: '#ece2d2',
  owl: '#8d7a63',
  deer: '#c9a877',
  cat: '#9aa0ab',
  frog: '#6fae6a',
  squirrel: '#b5693c',
  wolf: '#8e949c',
  badger: '#5f5a52',
  boar: '#6b5240',
  hare: '#d9b98f',
  hedgehog: '#9c8468',
  'barn-owl': '#e4d3ad',
  woodpecker: '#4a4642',
  eagle: '#7a5a3a',
  weasel: '#c9a35c',
  skunk: '#2b2b2b',
  lynx: '#c79a5c',
  puma: '#b07a4a',
  moose: '#6e5742',
  bat: '#4a4250',
  marten: '#8a5a32',
};

// Toda la orquesta usa el mismo diseno de mapache (solo cambia el
// color de pelaje por seccion); el zorro al piano es la unica
// excepcion y usa su propio personaje completo (fox-piano).
const MAPACHE_HEAD = 'head-mapache-style';
const HEAD_FOR = new Proxy({ fox: 'head-fox' }, { get: (t, k) => (k in t ? t[k] : MAPACHE_HEAD) });

// Reparte `count` asientos en `rows` filas entre xStart..xEnd, en
// forma de graderio curvo (el centro de cada fila se adelanta
// hacia el publico, como un graderio real en abanico).
function fanRows(count, rows, { xStart, xEnd, y0, yStep, scale0, scaleStep = 0.08, curve = 0 }) {
  const seats = [];
  const base = Math.floor(count / rows);
  let remainder = count - base * rows;
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    const rowCount = base + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder--;
    const stagger = (r % 2 === 1) ? (xEnd - xStart) / (rowCount * 2) : 0;
    for (let i = 0; i < rowCount; i++) {
      const t = rowCount === 1 ? 0.5 : i / (rowCount - 1);
      let x = xStart + t * (xEnd - xStart) + stagger;
      x = Math.max(xStart - 10, Math.min(xEnd + 10, x));
      const u = t * 2 - 1;
      const bow = curve * (1 - u * u);
      seats.push({ x, y: y0 - r * yStep + bow, scale: scale0 - r * scaleStep + bow * 0.0015, order: idx++ });
    }
  }
  return seats;
}

const SECTIONS = [
  {
    id: 'violin1', label: 'Violines I', body: 'body-strings-small', species: 'rabbit',
    seats: fanRows(9, 3, { xStart: 140, xEnd: 380, y0: 870, yStep: 60, scale0: 1.22, scaleStep: 0.07, curve: 30 }),
    wave: 0,
  },
  {
    id: 'violin2', label: 'Violines II', body: 'body-strings-small', species: 'hare',
    seats: fanRows(7, 3, { xStart: 395, xEnd: 600, y0: 860, yStep: 55, scale0: 1.05, scaleStep: 0.06, curve: 22 }),
    wave: 0,
  },
  {
    id: 'viola', label: 'Violas', body: 'body-strings-small', species: 'wolf',
    seats: fanRows(6, 3, { xStart: 1000, xEnd: 1190, y0: 855, yStep: 55, scale0: 1.1, scaleStep: 0.06, curve: 20 }),
    wave: 0,
  },
  {
    id: 'cello', label: 'Chelos', body: 'body-strings-cello', species: 'badger',
    seats: fanRows(6, 3, { xStart: 1210, xEnd: 1410, y0: 865, yStep: 55, scale0: 1.15, scaleStep: 0.06, curve: 20 }),
    wave: 1,
  },
  {
    id: 'bass', label: 'Contrabajos', body: 'body-strings-bass', species: 'boar',
    seats: fanRows(4, 2, { xStart: 1430, xEnd: 1560, y0: 790, yStep: 55, scale0: 1.1 }),
    wave: 1,
  },
  {
    id: 'harp', label: 'Arpa', body: 'body-harp', species: 'cat',
    seats: fanRows(1, 1, { xStart: 70, xEnd: 70, y0: 800, yStep: 0, scale0: 1.2 }),
    wave: 1,
  },
  {
    id: 'flute', label: 'Flautas', body: 'body-flute', species: 'squirrel',
    seats: fanRows(2, 1, { xStart: 350, xEnd: 445, y0: 635, yStep: 0, scale0: 0.8 }),
    wave: 2,
  },
  {
    id: 'oboe', label: 'Oboes', body: 'body-reed', species: 'weasel',
    seats: fanRows(2, 1, { xStart: 460, xEnd: 555, y0: 635, yStep: 0, scale0: 0.8 }),
    wave: 2,
  },
  {
    id: 'clarinet', label: 'Clarinetes', body: 'body-reed', species: 'marten',
    seats: fanRows(2, 1, { xStart: 1035, xEnd: 1130, y0: 635, yStep: 0, scale0: 0.8 }),
    wave: 2,
  },
  {
    id: 'bassoon', label: 'Fagotes', body: 'body-bassoon', species: 'hedgehog',
    seats: fanRows(2, 1, { xStart: 1145, xEnd: 1240, y0: 635, yStep: 0, scale0: 0.8 }),
    wave: 2,
  },
  {
    id: 'horn', label: 'Trompas', body: 'body-horn', species: 'moose',
    seats: fanRows(4, 1, { xStart: 320, xEnd: 565, y0: 495, yStep: 0, scale0: 0.75 }),
    wave: 3,
  },
  {
    id: 'trumpet', label: 'Trompetas', body: 'body-trumpet', species: 'eagle',
    seats: fanRows(2, 1, { xStart: 585, xEnd: 665, y0: 495, yStep: 0, scale0: 0.78 }),
    wave: 3,
  },
  {
    id: 'trombone', label: 'Trombones', body: 'body-trombone', species: 'lynx',
    seats: fanRows(2, 1, { xStart: 945, xEnd: 1035, y0: 495, yStep: 0, scale0: 0.78 }),
    wave: 3,
  },
  {
    id: 'bass-trombone', label: 'Trombon bajo', body: 'body-trombone', species: 'puma',
    seats: fanRows(1, 1, { xStart: 1060, xEnd: 1060, y0: 495, yStep: 0, scale0: 0.78 }),
    wave: 3,
  },
  {
    id: 'tuba', label: 'Tuba', body: 'body-tuba', species: 'moose',
    seats: fanRows(1, 1, { xStart: 1140, xEnd: 1140, y0: 495, yStep: 0, scale0: 0.82 }),
    wave: 3,
  },
  {
    id: 'timpani', label: 'Timbales', body: 'body-timpani', species: 'owl',
    seats: fanRows(1, 1, { xStart: 460, xEnd: 460, y0: 375, yStep: 0, scale0: 0.78 }),
    wave: 4,
  },
  {
    id: 'snare-bd', label: 'Caja y bombo', body: 'body-snare-bd', species: 'woodpecker',
    seats: fanRows(1, 1, { xStart: 640, xEnd: 640, y0: 375, yStep: 0, scale0: 0.78 }),
    wave: 4,
  },
  {
    id: 'cymbals', label: 'Platillos y triangulo', body: 'body-cymbals', species: 'skunk',
    seats: fanRows(1, 1, { xStart: 960, xEnd: 960, y0: 375, yStep: 0, scale0: 0.78 }),
    wave: 4,
  },
  {
    id: 'mallets', label: 'Xilofono y campanas', body: 'body-mallets', species: 'bat',
    seats: fanRows(1, 1, { xStart: 1140, xEnd: 1140, y0: 375, yStep: 0, scale0: 0.78 }),
    wave: 4,
  },
];

// Zorro al piano de cola (centro, siempre presente) y Mapache en
// su tarima justo detras, dirigiendo desde el inicio. El pasillo
// central (x 600-1000) queda libre de atriles para que nadie se
// encime con ellos.
const PIANO_POS = { x: 726, y: 734, scale: 0.8 };
const PIANO_SPECIES = 'fox';
const CONDUCTOR_POS = { x: 800, y: 600, scale: 1.18 };
