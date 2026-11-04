// Guion de la experiencia narrada. Cada musico de la orquesta (24)
// y cada cantante (5) tiene un nombre; se presentan uno por uno
// cuando Mapache Mapachoso los menciona (salto + ojos cerrados +
// colmillos). El orden coincide con el orden en que se construyen
// en orchestra-data.js (SECTIONS y luego SINGERS).
const ORCHESTRA_NAMES = [
  'Mapachiux',
  'Mapachoco',
  'Mapachindroso',
  'Mapachanga',
  'Mapachalukix',
  'Mapachuki',
  'Mapachan',
  'Mapachunio',
  'Mapachispa',
  'Mapache Robagalletas',
  'Mapachangas Khan',
  'Mapachistrikis',
  'Mapachete',
  'Mapachitron',
  'Mapachiflín',
  'Mapachiwi',
  'Mapachirulo',
  'Mapachencio',
  'Mapach Mapoch',
  'Mapachelo Lalalo',
  'Mapachili Lilili',
  'Machachara',
  'Mapacharita',
  'Mapachovsky',
];

// texto que dice Mapache al presentar a cada uno; los que no llevan
// chiste extra solo usan su nombre con signos de exclamacion
const ORCHESTRA_LINES = {
  'Mapache Robagalletas': '¡Mapache Robagalletas!... que en verdad se llama Juancho, pero el siempre se roba las galletas.',
  'Mapachete': '¡Mapachete!... es bien mala copa, nunca le des mapachecerveza porque saca machetes.',
  'Mapachovsky': 'Y por ultimo, mi primo lejano de Rusia... ¡Mapachovsky! Su ancestro es Tchaikovsky, el compositor de El Lago de los Cisnes... naaaambre, ese Mapachovsky es un musico nato!',
};

const SINGER_NAMES = [
  'Mapachasoprano',
  'Mapachemezzosoprano',
  'Mapachecontralto',
  'Mapachetenor',
  'Mapachebaritono',
];

// El guion completo, paso a paso. Tipos de paso:
//  dialogue      -> globo de dialogo, espera click en "Continuar"
//  walkIn        -> entrada caminando (mapache | fox | orchestra | singers)
//  song          -> aplausos (fundido) + reproduce una pieza; al
//                   terminar la pieza suena aplausos otra vez y se
//                   avanza solo al siguiente paso (no hace falta
//                   "Continuar")
//  introduce     -> presenta a un musico de la orquesta (salto)
//  introduceSinger -> presenta a un cantante (salto)
//  bajoJoke      -> chiste de "mapachebajo se quedo dormido"
//  specialBubble -> globo pequeno en ruso sobre mapachovsky
//  angryJumpAll  -> todos saltan enojados con ojos cerrados
//  closeCurtain  -> cierra telon, fin de la experiencia
const STORY_SCRIPT = [
  { type: 'walkIn', who: 'mapache' },
  {
    type: 'dialogue',
    text: 'Damas y caballeros, caballeros y damas, mapachos y mapachas... ¡sean todos ustedes muy bienvenidos a esta edicion musical, en la que se juntan dos paises, para que asi Jazz y Marcus puedan apreciar nuestra mapachosidad musical!',
  },
  {
    type: 'dialogue',
    text: 'Es asi que, como primer numero, mi buen amigo zorro les presentara una pieza en piano... ¡lo que es probablemente la pieza en piano mas hermosa jamas escrita! Espero que la disfruten.',
  },
  { type: 'walkIn', who: 'fox' },
  { type: 'song', track: 0 },
  {
    type: 'dialogue',
    text: '¡Excelente interpretacion de nuestro amigo zorro! Justin Hurwitz hizo un gran trabajo escribiendo este tema para la pelicula de La La Land.',
  },
  { type: 'dialogue', text: 'Pero ahora... para este numero llevaremos las cosas a algo mas grande.' },
  { type: 'dialogue', text: 'Para esta ocasion, ¡traeremos a la orquesta completa!' },
  { type: 'walkIn', who: 'orchestra' },
  {
    type: 'dialogue',
    text: 'Este es considerado uno de los temas mas hermosos en la historia del cine, compuesto por Ennio Morricone para la iconica pelicula de Cinema Paradiso. Sin contar muchos mapachospoilers: es la historia de Salvatore y Elena, dos jovenes que se enamoran en un pequeño pueblo italiano.',
  },
  {
    type: 'dialogue',
    text: 'Su relacion se ve separada por las circunstancias y el paso del tiempo, guerras... tragedias... incendios... pero decadas despues, los recuerdos de ese amor perdido siguen vivos.',
  },
  { type: 'dialogue', text: 'Morricone compuso una musica que parece recordar a alguien que amaste profundamente y que ya no esta contigo...' },
  { type: 'song', track: 1 },
  { type: 'dialogue', text: '¡Vaya tema eh! Y vaya pelicula... deberiamos musicalizarla en vivo, ¿que dicen, mapaches?' },
  {
    type: 'dialogue',
    text: 'Que por cierto... ¡olvide introducir a todos mis mapachomusicos! Marcus y yo llevamos dias planeando esto juntos, asi que tuve que llamar a todos mis mapachoamigos y mapachofamiliares para llevar esto a cabo. Vamos, uno por uno:',
  },
  // 24 presentaciones individuales (ver ORCHESTRA_NAMES/ORCHESTRA_LINES)
  ...ORCHESTRA_NAMES.map((name) => ({ type: 'introduce', name })),
  { type: 'specialBubble', text: 'Спасибо большое!' },
  { type: 'dialogue', text: 'Puff, si que fueron varios. Para este ultimo tema de la noche... es una sorpresa... es una cancion que fue grabada por un amigo de mi mapacheabuelo. Ambos solian ir a comer uvas juntos, pero el amigo de mi mapacheabuelo la grabo en 1961 para la pelicula Blue Hawaii.' },
  { type: 'dialogue', text: 'Esta inspirada en la melodia de una cancion francesa del siglo XVIII llamada Plaisir d\'amour... muy bonita... muy bonita. No habla de conquistar, perseguir o sufrir por amor. Habla de alguien que ha aceptado que enamorarse es inevitable.' },
  { type: 'dialogue', text: 'No habla de un amor apasionado y dramatico como MapacheRomeo y MapacheJulieta, ni de una obsesion como la de MapacheBerlioz. Habla de algo mucho mas universal: el momento en que dejas de luchar contra tus sentimientos y aceptas que amas a alguien.' },
  { type: 'dialogue', text: 'Asi que vamos a comenzar a tocar.... ¡hey, hey, hey, no! ¡Esperen! ¡Faltaron mis vocales! Les presento a mis mapaches cantantes:' },
  { type: 'walkIn', who: 'singers' },
  ...SINGER_NAMES.map((name) => ({ type: 'introduceSinger', name })),
  {
    type: 'dialogue',
    text: '¡Hey! ¿Donde esta Mapachebajo?... (un mapache responde desde el fondo: "se quedo dormido") ¿Que? ¿Como que se quedo dormido? Siempre se queda dormido... ahhh, bueno, continuemos sin el.',
  },
  { type: 'song', track: 2 },
  {
    type: 'dialogue',
    text: '¡Y bueno! Eso ha sido todo. Esperamos que le haya gustado mucho, yo ya tengo hambre y me voy a comer mis uvas... pero no le digan a los demas mapaches, no les quiero compartir.',
  },
  { type: 'angryJumpAll' },
  {
    type: 'dialogue',
    text: '¡Hey, no, no, nonono, son miaaaaas, son mis uvaaaaaas! ...pero bueno. Jazz y Marcus, los amo mucho, los dejamos para que continuen su cita romantica en Roblox... ayoooooosh.',
  },
  { type: 'closeCurtain' },
];
