// Datos de la orquesta: secciones, especies, instrumentos y su
// ubicacion en el escenario (viewBox 0 0 1600 1000, y crece hacia
// el publico = abajo). El piano de cola y el podio de Mapache
// ocupan el centro; las secciones dejan un pasillo libre ahi para
// que nadie se encime con ellos, y cada asiento tiene coordenadas
// explicitas (no formula de reparto) para controlar a mano la
// separacion minima entre musicos y evitar que se encimen.

// La mayoria de la orquesta es gris como Mapache Mapachoso (varios
// tonos de gris para que no se vean idénticos); solo un puñado de
// secciones conserva un color calido, como variedad.
const SPECIES_COLOR = {
  mapache: '#8891a0',
  fox: '#d9824a',
  bear: '#8a6a4a',
  rabbit: '#9aa0ab',
  owl: '#747b89',
  deer: '#c9a877',
  cat: '#848b99',
  frog: '#6fae6a',
  squirrel: '#959baa',
  wolf: '#8891a0',
  badger: '#6e7482',
  boar: '#7b8290',
  hare: '#d9b98f',
  hedgehog: '#9c8468',
  'barn-owl': '#e4d3ad',
  woodpecker: '#5a6170',
  eagle: '#7a5a3a',
  weasel: '#c9a35c',
  skunk: '#2b2b2b',
  lynx: '#8e949c',
  puma: '#6b7180',
  moose: '#838a98',
  bat: '#4a4250',
  marten: '#767d8c',
};

// Toda la orquesta usa el mismo diseno de mapache (cabeza completa,
// antifaz y sombrero de copa incluidos en el cuerpo base via
// orch-mapache-base); solo cambia el color de pelaje por seccion.
// El zorro al piano es la unica excepcion y usa su propio personaje
// completo (fox-piano).

// Asientos explicitos por seccion (x, y, scale). Cada fila respeta
// una separacion minima mayor al ancho real del musico mas sus
// brazos/instrumento, para que nadie se encime; las filas de atras
// usan menor escala, como un graderio real.
const SECTIONS = [
  // ----- cuerdas, al frente a ambos lados del piano/podio -----
  {
    id: 'violin1', label: 'Violines I', body: 'body-strings-small', species: 'rabbit',
    seats: [
      { x: 180, y: 865, scale: 1.05, bow: true },
      { x: 360, y: 865, scale: 1.05 },
    ],
    wave: 0,
  },
  {
    id: 'violin2', label: 'Violines II', body: 'body-strings-small', species: 'hare',
    seats: [
      { x: 230, y: 780, scale: 0.92 },
      { x: 380, y: 780, scale: 0.92 },
    ],
    wave: 0,
  },
  {
    id: 'harp', label: 'Arpa', body: 'body-harp', species: 'cat',
    seats: [{ x: 130, y: 735, scale: 0.87 }],
    wave: 0,
  },
  {
    id: 'viola', label: 'Violas', body: 'body-strings-small', species: 'wolf',
    seats: [
      { x: 1130, y: 865, scale: 1.05 },
      { x: 1310, y: 865, scale: 1.05 },
    ],
    wave: 0,
  },
  {
    id: 'cello', label: 'Chelos', body: 'body-strings-cello', species: 'badger',
    seats: [
      { x: 1190, y: 780, scale: 0.92 },
      { x: 1370, y: 780, scale: 0.92, bow: true },
    ],
    wave: 0,
  },
  {
    id: 'bass', label: 'Contrabajo', body: 'body-strings-bass', species: 'boar',
    seats: [{ x: 1460, y: 820, scale: 0.95 }],
    wave: 0,
  },

  // ----- maderas, fila media, dejando el pasillo central libre -----
  {
    id: 'flute', label: 'Flauta', body: 'body-flute', species: 'squirrel',
    seats: [{ x: 220, y: 640, scale: 1.0, bow: true }],
    wave: 2,
  },
  {
    id: 'oboe', label: 'Oboe', body: 'body-reed', species: 'weasel',
    seats: [{ x: 420, y: 640, scale: 1.0 }],
    wave: 2,
  },
  {
    id: 'clarinet', label: 'Clarinete', body: 'body-reed', species: 'marten',
    seats: [{ x: 1150, y: 640, scale: 1.0 }],
    wave: 2,
  },
  {
    id: 'bassoon', label: 'Fagot', body: 'body-bassoon', species: 'hedgehog',
    seats: [{ x: 1380, y: 640, scale: 1.0 }],
    wave: 2,
  },

  // ----- metales, fila trasera -----
  {
    id: 'horn', label: 'Trompas', body: 'body-horn', species: 'moose',
    seats: [
      { x: 160, y: 500, scale: 0.95 },
      { x: 335, y: 500, scale: 0.95 },
    ],
    wave: 3,
  },
  {
    id: 'tuba', label: 'Tuba', body: 'body-tuba', species: 'puma',
    seats: [{ x: 500, y: 500, scale: 0.95 }],
    wave: 3,
  },
  {
    id: 'trumpet', label: 'Trompeta', body: 'body-trumpet', species: 'eagle',
    seats: [{ x: 1100, y: 500, scale: 0.95 }],
    wave: 3,
  },
  {
    id: 'trombone', label: 'Trombones', body: 'body-trombone', species: 'lynx',
    seats: [
      { x: 1260, y: 500, scale: 0.95, bow: true },
      { x: 1430, y: 500, scale: 0.95 },
    ],
    wave: 3,
  },

  // ----- percusion, al fondo del todo -----
  {
    id: 'timpani', label: 'Timbales', body: 'body-timpani', species: 'owl',
    seats: [{ x: 190, y: 390, scale: 0.87 }],
    wave: 4,
  },
  {
    id: 'snare-bd', label: 'Caja y bombo', body: 'body-snare-bd', species: 'woodpecker',
    seats: [{ x: 440, y: 390, scale: 0.87 }],
    wave: 4,
  },
  {
    id: 'cymbals', label: 'Platillos y triangulo', body: 'body-cymbals', species: 'skunk',
    seats: [{ x: 1120, y: 390, scale: 0.87 }],
    wave: 4,
  },
  {
    id: 'mallets', label: 'Xilofono y campanas', body: 'body-mallets', species: 'bat',
    seats: [{ x: 1360, y: 390, scale: 0.87 }],
    wave: 4,
  },
];

// Zorro al piano de cola (centro, siempre presente) y Mapache en
// su tarima justo detras, dirigiendo desde el inicio. El pasillo
// central (x 600-1000) queda libre de atriles para que nadie se
// encime con ellos.
// El zorro se sienta en la banca, a la izquierda del piano (no
// encima), a la altura del teclado; los brazos (ver fox-piano)
// se extienden hacia la derecha para tocar.
const PIANO_POS = { x: 412, y: 724, scale: 0.72 };
const PIANO_SPECIES = 'fox';
// El simbolo conductor-mapachoso tiene su centro visual en el
// punto local (100,135), no en (0,0); se resta 100*scale en x para
// que el director quede exactamente al centro del escenario
// (viewBox 1600 de ancho, centro = 800). En y va hasta el frente
// del escenario (abajo), de cara a la orquesta, parado sobre su
// tarima con partitura (ver #podium en index.html, desplazada el
// mismo tanto).
const CONDUCTOR_POS = { x: 800 - 100 * 1.18, y: 679, scale: 1.18 };
