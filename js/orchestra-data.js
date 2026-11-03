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

const HEAD_FOR = {
  fox: 'head-fox', bear: 'head-bear', rabbit: 'head-rabbit', owl: 'head-owl',
  deer: 'head-deer', cat: 'head-cat', frog: 'head-frog', squirrel: 'head-squirrel',
  wolf: 'head-wolf', badger: 'head-badger', boar: 'head-boar', hare: 'head-hare',
  hedgehog: 'head-hedgehog', 'barn-owl': 'head-barn-owl', woodpecker: 'head-woodpecker',
  eagle: 'head-eagle', weasel: 'head-weasel', skunk: 'head-skunk', lynx: 'head-lynx',
  puma: 'head-lynx', moose: 'head-moose', bat: 'head-bat', marten: 'head-marten',
};

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
    seats: fanRows(9, 2, { xStart: 130, xEnd: 390, y0: 850, yStep: 80, scale0: 1.28, curve: 36 }),
    wave: 0,
  },
  {
    id: 'violin2', label: 'Violines II', body: 'body-strings-small', species: 'hare',
    seats: fanRows(7, 2, { xStart: 400, xEnd: 600, y0: 850, yStep: 80, scale0: 1.28, curve: 30 }),
    wave: 0,
  },
  {
    id: 'viola', label: 'Violas', body: 'body-strings-small', species: 'wolf',
    seats: fanRows(6, 2, { xStart: 1000, xEnd: 1190, y0: 845, yStep: 80, scale0: 1.24, curve: 26 }),
    wave: 0,
  },
  {
    id: 'cello', label: 'Chelos', body: 'body-strings-cello', species: 'badger',
    seats: fanRows(6, 2, { xStart: 1200, xEnd: 1410, y0: 862, yStep: 82, scale0: 1.28, curve: 26 }),
    wave: 1,
  },
  {
    id: 'bass', label: 'Contrabajos', body: 'body-strings-bass', species: 'boar',
    seats: fanRows(4, 1, { xStart: 1420, xEnd: 1560, y0: 760, yStep: 0, scale0: 1.1 }),
    wave: 1,
  },
  {
    id: 'harp', label: 'Arpa', body: 'body-harp', species: 'cat',
    seats: fanRows(1, 1, { xStart: 70, xEnd: 70, y0: 800, yStep: 0, scale0: 1.2 }),
    wave: 1,
  },
  {
    id: 'flute', label: 'Flautas', body: 'body-flute', species: 'squirrel',
    seats: fanRows(2, 1, { xStart: 370, xEnd: 460, y0: 645, yStep: 0, scale0: 0.95 }),
    wave: 2,
  },
  {
    id: 'oboe', label: 'Oboes', body: 'body-reed', species: 'weasel',
    seats: fanRows(2, 1, { xStart: 470, xEnd: 560, y0: 645, yStep: 0, scale0: 0.95 }),
    wave: 2,
  },
  {
    id: 'clarinet', label: 'Clarinetes', body: 'body-reed', species: 'marten',
    seats: fanRows(2, 1, { xStart: 1040, xEnd: 1130, y0: 645, yStep: 0, scale0: 0.95 }),
    wave: 2,
  },
  {
    id: 'bassoon', label: 'Fagotes', body: 'body-bassoon', species: 'hedgehog',
    seats: fanRows(2, 1, { xStart: 1140, xEnd: 1230, y0: 645, yStep: 0, scale0: 0.95 }),
    wave: 2,
  },
  {
    id: 'horn', label: 'Trompas', body: 'body-horn', species: 'moose',
    seats: fanRows(4, 1, { xStart: 330, xEnd: 560, y0: 505, yStep: 0, scale0: 0.84 }),
    wave: 3,
  },
  {
    id: 'trumpet', label: 'Trompetas', body: 'body-trumpet', species: 'eagle',
    seats: fanRows(2, 1, { xStart: 570, xEnd: 660, y0: 505, yStep: 0, scale0: 0.84 }),
    wave: 3,
  },
  {
    id: 'trombone', label: 'Trombones', body: 'body-trombone', species: 'lynx',
    seats: fanRows(2, 1, { xStart: 950, xEnd: 1040, y0: 505, yStep: 0, scale0: 0.84 }),
    wave: 3,
  },
  {
    id: 'bass-trombone', label: 'Trombon bajo', body: 'body-trombone', species: 'puma',
    seats: fanRows(1, 1, { xStart: 1060, xEnd: 1060, y0: 505, yStep: 0, scale0: 0.84 }),
    wave: 3,
  },
  {
    id: 'tuba', label: 'Tuba', body: 'body-tuba', species: 'moose',
    seats: fanRows(1, 1, { xStart: 1130, xEnd: 1130, y0: 505, yStep: 0, scale0: 0.88 }),
    wave: 3,
  },
  {
    id: 'timpani', label: 'Timbales', body: 'body-timpani', species: 'owl',
    seats: fanRows(1, 1, { xStart: 460, xEnd: 460, y0: 370, yStep: 0, scale0: 0.78 }),
    wave: 4,
  },
  {
    id: 'snare-bd', label: 'Caja y bombo', body: 'body-snare-bd', species: 'woodpecker',
    seats: fanRows(1, 1, { xStart: 620, xEnd: 620, y0: 370, yStep: 0, scale0: 0.78 }),
    wave: 4,
  },
  {
    id: 'cymbals', label: 'Platillos y triangulo', body: 'body-cymbals', species: 'skunk',
    seats: fanRows(1, 1, { xStart: 980, xEnd: 980, y0: 370, yStep: 0, scale0: 0.78 }),
    wave: 4,
  },
  {
    id: 'mallets', label: 'Xilofono y campanas', body: 'body-mallets', species: 'bat',
    seats: fanRows(1, 1, { xStart: 1140, xEnd: 1140, y0: 370, yStep: 0, scale0: 0.78 }),
    wave: 4,
  },
];

// Zorro al piano de cola (centro, siempre presente) y Mapache en
// su tarima justo detras, dirigiendo desde el inicio.
const PIANO_POS = { x: 700, y: 845, scale: 1.3 };
const PIANO_SPECIES = 'fox';
const CONDUCTOR_POS = { x: 800, y: 600, scale: 1.18 };
