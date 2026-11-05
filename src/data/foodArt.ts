/**
 * Ilustraciones propias de alimentos, dibujadas en SVG (lienzo de 64 × 64).
 * Estilo de dibujo animado: contorno azul muy oscuro, colores planos y un brillo.
 * Cada entrada es el interior de un <svg viewBox="0 0 64 64">.
 * El contorno y la sombra usan variables CSS para que se vean bien en modo oscuro.
 */

const L = 'var(--art-line)';
const s = `stroke="${L}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"`;
const n = `fill="none" ${s}`;
const GREEN = '#4f9a45';
const LEAF = '#6bb35a';
const BOWL = '#3f6fb5';

const sh = (rx = 19) => `<ellipse cx="32" cy="58.5" rx="${rx}" ry="3" fill="var(--art-shadow)"/>`;
const shine = (cx: number, cy: number, rx: number, ry: number, rot = -30) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".45" transform="rotate(${rot} ${cx} ${cy})"/>`;
const g = (t: string, body: string) => `<g transform="${t}">${body}</g>`;
/** Línea gruesa con contorno (tallos, palitos, huesos...). */
const thick = (d: string, color: string, w = 5) =>
  `<path d="${d}" fill="none" stroke="${L}" stroke-width="${w + 4}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
/** Hueso: palo con dos nudos en la punta (x2, y2). */
const bone = (x1: number, y1: number, x2: number, y2: number) => {
  const a = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2;
  const kx = Math.cos(a) * 3;
  const ky = Math.sin(a) * 3;
  const line = `M${x1} ${y1}L${x2} ${y2}`;
  return (
    `<path d="${line}" fill="none" stroke="${L}" stroke-width="9" stroke-linecap="round"/>` +
    `<circle cx="${x2 + kx}" cy="${y2 + ky}" r="3.6" fill="#f6efe2" ${s}/><circle cx="${x2 - kx}" cy="${y2 - ky}" r="3.6" fill="#f6efe2" ${s}/>` +
    `<path d="${line}" fill="none" stroke="#f6efe2" stroke-width="5" stroke-linecap="round"/>`
  );
};

/* ---------------- Verduras ---------------- */

const CALYX = `<path d="M32 21L35.5 16.5L36.5 22L42.5 20.5L38.5 25L32 23.5L25.5 25L21.5 20.5L27.5 22L28.5 16.5Z" fill="${GREEN}" ${s}/><path d="M32 18V12" ${n}/>`;
const tomatoBody = (c: string) =>
  `<ellipse cx="32" cy="37" rx="21" ry="18" fill="${c}" ${s}/>${shine(23, 31, 5, 3)}${CALYX}`;

const onion = (c: string, line: string) =>
  sh(18) +
  `<path d="M32 10C34 18 50 25 50 40C50 50 42 56 32 56C22 56 14 50 14 40C14 25 30 18 32 10Z" fill="${c}" ${s}/>` +
  `<path d="M25 25Q19 40 26 54M39 25Q45 40 38 54M32 22V55" fill="none" stroke="${line}" stroke-width="1.7" opacity=".6"/>` +
  shine(22, 36, 3, 6, 15) +
  `<path d="M28 56L26 60M32 56V61M36 56L38 60" ${n}/>`;

const longSquash = (c: string, stripe: string) =>
  sh(21) +
  `<path d="M12 46C8 42 10 36 16 32L42 17C48 14 55 16 55 22C55 26 53 28 49 30L22 47C18 49.5 14 49 12 46Z" fill="${c}" ${s}/>` +
  `<path d="M19 40L44 25M23 44.5L48 29" fill="none" stroke="${stripe}" stroke-width="2.2" stroke-linecap="round" opacity=".8"/>` +
  thick('M54 20L58 16.5', '#8a6a3a', 3);

const bell = (c: string) =>
  sh(17) +
  `<path d="M17 28C17 21 23 18 28 20C30 18 34 18 36 20C41 18 47 21 47 28C49 36 46 47 42 53C38 57 34 55 32 53C30 55 26 57 22 53C18 47 15 36 17 28Z" fill="${c}" ${s}/>` +
  `<path d="M32 23V46" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2.4" stroke-linecap="round"/>` +
  shine(23, 32, 3, 8, 10) +
  thick('M31 20C31 16 33 13 37 12', GREEN, 3);

const leafyHead = (c: string, inner: string) =>
  sh(20) +
  `<path d="M32 54C18 54 10 46 10 36C10 26 16 20 22 20C24 14 30 12 34 14C40 12 48 16 50 24C56 28 56 40 50 46C46 52 40 54 32 54Z" fill="${c}" ${s}/>` +
  `<path d="M32 50C24 48 20 42 22 34C24 28 30 26 34 30C40 28 44 34 42 40C40 46 36 50 32 50Z" fill="${inner}" ${s}/>` +
  `<path d="M32 50V36M32 44L27 39M32 42L37 37" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1.6" stroke-linecap="round"/>`;

const bigLeaf = (c: string, stalk: string) =>
  sh(16) +
  thick('M31 58V44', stalk, 5) +
  `<path d="M31 46C19 44 11 34 13 22C15 12 25 6 34 8C46 10 54 20 52 32C50 42 42 47 31 46Z" fill="${c}" ${s}/>` +
  `<path d="M31 46C32 34 33 22 34 10M32 36L23 30M32 30L42 23M33 22L25 17" fill="none" stroke="${stalk}" stroke-width="1.8" stroke-linecap="round"/>`;

const cabbage = (c: string, vein: string) =>
  sh(20) +
  `<circle cx="32" cy="36" r="21" fill="${c}" ${s}/>` +
  `<path d="M32 16C26 24 26 46 32 56M32 16C40 24 42 46 34 56M14 30C22 30 30 36 32 44M50 30C42 30 36 34 33 42" fill="none" stroke="${vein}" stroke-width="1.8" stroke-linecap="round"/>` +
  shine(22, 26, 4, 3);

const mushroom = (cap: string, stem: string) =>
  sh(18) +
  `<path d="M24 34H40V52C40 55 38 57 35 57H29C26 57 24 55 24 52Z" fill="${stem}" ${s}/>` +
  `<path d="M8 34C8 20 20 11 32 11C44 11 56 20 56 34C56 36 54 37 52 37H12C10 37 8 36 8 34Z" fill="${cap}" ${s}/>` +
  shine(22, 20, 5, 3, -20);

const asparagus = (c: string, tip: string) =>
  sh(14) +
  thick('M25 56L28 12', c) +
  thick('M32 56V9', c) +
  thick('M39 56L36 12', c) +
  `<ellipse cx="28" cy="12" rx="3.5" ry="5" fill="${tip}" ${s}/><ellipse cx="32" cy="9" rx="3.5" ry="5" fill="${tip}" ${s}/><ellipse cx="36" cy="12" rx="3.5" ry="5" fill="${tip}" ${s}/>` +
  `<rect x="22" y="38" width="20" height="6" rx="2" fill="${BOWL}" ${s}/>`;

const pod = (c: string, seed: string, big = false) =>
  sh(20) +
  `<path d="M8 40C16 28 32 22 55 22C53 34 39 44 18 46C12 46 8 44 8 40Z" fill="${c}" ${s}/>` +
  (big
    ? `<ellipse cx="22" cy="38" rx="5" ry="4" fill="${seed}" ${s}/><ellipse cx="33" cy="34" rx="5" ry="4" fill="${seed}" ${s}/><ellipse cx="44" cy="29" rx="5" ry="4" fill="${seed}" ${s}/>`
    : `<circle cx="19" cy="39" r="4.3" fill="${seed}" ${s}/><circle cx="27.5" cy="36" r="4.3" fill="${seed}" ${s}/><circle cx="36" cy="33" r="4.3" fill="${seed}" ${s}/><circle cx="44.5" cy="29.5" r="4.3" fill="${seed}" ${s}/>`) +
  thick('M55 22L59 18', GREEN, 2.5);

const VEG: Record<string, string> = {
  tomate: sh() + tomatoBody('#e5483a'),
  'tomate-pera':
    sh(15) + `<ellipse cx="32" cy="38" rx="15" ry="19" fill="#d93a30" ${s}/>` + shine(25, 31, 3, 6, 10) + g('translate(0 -1)', CALYX),
  'tomate-cherry':
    sh(22) +
    g('translate(14.4 7.6) scale(.55)', tomatoBody('#e5483a')) +
    g('translate(.4 23.6) scale(.55)', tomatoBody('#ef5a43')) +
    g('translate(28.4 23.6) scale(.55)', tomatoBody('#e5483a')),
  cebolla: onion('#cf8a4c', '#8a4f22'),
  'cebolla-morada': onion('#8e3b7a', '#4f1a42'),
  cebolleta:
    sh(12) +
    thick('M27 36L20 6', '#5aa64b', 4) +
    thick('M32 36V4', LEAF, 4) +
    thick('M37 36L44 6', '#5aa64b', 4) +
    `<ellipse cx="32" cy="45" rx="10" ry="12" fill="#f6f3e8" ${s}/>` +
    `<path d="M29 57L28 61M32 57V62M35 57L36 61" ${n}/>`,
  puerro:
    sh(12) +
    `<path d="M27 22L17 4L25 5L32 19L39 5L47 4L37 22Z" fill="#3f8a3a" ${s}/>` +
    `<path d="M27 21H37V33H27Z" fill="#c7df8e" ${s}/>` +
    `<path d="M27 33H37V53C37 55.5 35 57 32 57C29 57 27 55.5 27 53Z" fill="#f6f3e6" ${s}/>` +
    `<path d="M29 57L28 61M32 57V62M35 57L36 61" ${n}/>`,
  ajo:
    sh(16) +
    `<path d="M32 12C34 20 48 26 48 40C48 50 41 55 32 55C23 55 16 50 16 40C16 26 30 20 32 12Z" fill="#f4efe4" ${s}/>` +
    `<path d="M26 25Q21 40 27 54M38 25Q43 40 37 54M32 20V55" fill="none" stroke="#c4b496" stroke-width="1.8"/>` +
    `<path d="M32 12V7M28 55L26 59M32 55V60M36 55L38 59" ${n}/>`,
  patata:
    sh(20) +
    `<path d="M12 36C10 24 24 16 36 18C48 20 55 28 53 39C51 50 38 55 27 53C17 51 13 44 12 36Z" fill="#dcae66" ${s}/>` +
    `<path d="M23 30q2 -1.6 4 0M38 27q2 -1.6 4 0M30 42q2 -1.6 4 0M43 40q1.6 -1.2 3 0" fill="none" stroke="#8a6232" stroke-width="1.8" stroke-linecap="round"/>` +
    shine(21, 29, 5, 3),
  boniato:
    sh(21) +
    `<path d="M8 40C6 32 16 24 30 22C44 20 58 24 57 33C56 42 44 46 30 47C18 48 10 46 8 40Z" fill="#b8606a" ${s}/>` +
    `<path d="M20 32q2 -1.4 4 0M36 28q2 -1.4 4 0M30 40q2 -1.4 4 0M46 36q1.6 -1.2 3 0" fill="none" stroke="#6d2f38" stroke-width="1.8" stroke-linecap="round"/>` +
    shine(20, 30, 5, 2.5, -10),
  zanahoria:
    sh(18) +
    thick('M44 18C44 11 41 7 36 6', '#5aa64b', 3) +
    thick('M46 16C50 10 55 9 58 11', LEAF, 3) +
    thick('M47 19C52 17 56 19 58 23', '#5aa64b', 3) +
    `<path d="M41 15C47 15 51 20 49 26L24 54C21 57 16 55 17 50L35 20C37 17 39 15 41 15Z" fill="#f08a2c" ${s}/>` +
    `<path d="M34 26L38 28.5M29 33L33 35.5M24 41L27.5 43" fill="none" stroke="#c4621a" stroke-width="1.8" stroke-linecap="round"/>`,
  calabacin: longSquash('#4e8f3a', '#a6d27f'),
  pepino: longSquash('#2f6b34', '#79b06c'),
  berenjena:
    sh(18) +
    `<path d="M20 53C12 49 12 38 20 32C26 27 29 23 33 19C37 15 45 14 49 18C53 22 52 29 47 33C42 38 40 45 34 51C30 55 24 56 20 53Z" fill="#5b2a6e" ${s}/>` +
    shine(21, 42, 3, 7, 35) +
    `<path d="M37 19C39 13 45 10 50 12C53 16 52 22 48 25C46 21 42 19 37 19Z" fill="${GREEN}" ${s}/>` +
    thick('M49 13L55 7', '#6b8a3a', 2.5),
  'pimiento-rojo': bell('#d8392b'),
  'pimiento-verde': bell('#4e9a3c'),
  'pimiento-amarillo': bell('#f2c230'),
  'pimiento-italiano':
    sh(21) +
    `<path d="M11 21C13 15 20 14 24 18C32 27 44 37 56 47C58 49 56 53 53 52C38 48 22 40 14 31C11 28 10 24 11 21Z" fill="#5aa64b" ${s}/>` +
    shine(24, 26, 2, 7, -45) +
    `<path d="M9 17C11 12 17 11 20 14C18 18 14 20 9 17Z" fill="${GREEN}" ${s}/>` +
    thick('M11 15L7 9', '#6b8a3a', 2.5),
  piquillo:
    sh(14) +
    `<path d="M20 18C26 14 36 14 42 18C46 22 42 34 34 50C33 52 31 52 30 50C22 34 16 22 20 18Z" fill="#d8392b" ${s}/>` +
    shine(26, 24, 2, 5, 15) +
    `<path d="M24 17C26 12 36 12 40 17Z" fill="${GREEN}" ${s}/>`,
  guindilla:
    sh(19) +
    `<path d="M14 21C18 16 24 18 26 22C32 34 44 44 56 50C46 55 30 50 20 38C16 32 12 26 14 21Z" fill="#d93b2f" ${s}/>` +
    shine(21, 28, 2, 5, -30) +
    `<path d="M11 19C13 13 20 13 22 17C20 21 15 23 11 19Z" fill="${GREEN}" ${s}/>` +
    thick('M13 15L9 9', '#6b8a3a', 2.5),
  lechuga: leafyHead('#7fbf5f', '#c3e295'),
  rucula:
    sh(18) +
    g('rotate(-30 32 40)', bigLeaf('#4e8f3a', '#c3e295').replace(sh(16), '')) +
    g('rotate(25 32 40) translate(4 0)', bigLeaf('#5aa64b', '#c3e295').replace(sh(16), '')),
  espinacas: bigLeaf('#2f7a3a', '#9ccc7c'),
  acelgas: bigLeaf('#3f8a3a', '#f2ecdc'),
  repollo: cabbage('#a8d488', '#6ea44f'),
  lombarda: cabbage('#7b3a7e', '#c58ac4'),
  brocoli:
    sh(16) +
    `<path d="M26 57L28 36H36L38 57Z" fill="#9ccc6a" ${s}/>` +
    `<circle cx="20" cy="30" r="10" fill="#3f8a3a" ${s}/><circle cx="44" cy="30" r="10" fill="#3f8a3a" ${s}/><circle cx="32" cy="22" r="11" fill="#47974a" ${s}/><circle cx="32" cy="35" r="8" fill="#3f8a3a" ${s}/>` +
    `<circle cx="28" cy="20" r="2" fill="#2d6b2c"/><circle cx="36" cy="24" r="2" fill="#2d6b2c"/><circle cx="18" cy="30" r="2" fill="#2d6b2c"/><circle cx="46" cy="28" r="2" fill="#2d6b2c"/>`,
  coliflor:
    sh(20) +
    `<path d="M8 48C10 36 20 34 26 42L24 54C16 56 10 54 8 48Z" fill="${LEAF}" ${s}/><path d="M56 48C54 36 44 34 38 42L40 54C48 56 54 54 56 48Z" fill="${LEAF}" ${s}/>` +
    `<circle cx="22" cy="32" r="10" fill="#f4ecd0" ${s}/><circle cx="42" cy="32" r="10" fill="#f4ecd0" ${s}/><circle cx="32" cy="24" r="11" fill="#f8f1da" ${s}/><circle cx="32" cy="38" r="10" fill="#f4ecd0" ${s}/>`,
  alcachofa:
    sh(15) +
    thick('M32 56V60', '#6f9a4a', 4) +
    `<path d="M32 10C42 14 50 26 48 40C46 50 40 56 32 56C24 56 18 50 16 40C14 26 22 14 32 10Z" fill="#6f9a4a" ${s}/>` +
    `<path d="M20 34Q32 25 44 34M18 44Q32 35 46 44M24 23Q32 17 40 23M32 10V20" fill="none" stroke="#3f6a2a" stroke-width="1.8" stroke-linecap="round"/>`,
  'esparrago-verde': asparagus('#6bab4a', '#4c8a33'),
  'esparrago-blanco': asparagus('#f3eedd', '#e5d9b2'),
  'judia-verde':
    sh(21) +
    thick('M10 22C24 26 40 36 52 52', '#5aa64b', 4.5) +
    thick('M14 14C28 20 44 32 56 44', '#4e9a3c', 4.5) +
    thick('M8 32C20 34 34 42 44 54', LEAF, 4.5),
  guisantes: pod('#6bb35a', '#a5d873'),
  habas: pod('#7fb85c', '#d4e8a6', true),
  maiz:
    sh(14) +
    `<path d="M22 56C12 44 14 28 22 18C22 32 26 46 32 56Z" fill="${LEAF}" ${s}/><path d="M42 56C52 44 50 28 42 18C42 32 38 46 32 56Z" fill="${GREEN}" ${s}/>` +
    `<ellipse cx="32" cy="32" rx="9" ry="22" fill="#f4cd3a" ${s}/>` +
    `<path d="M24 22H40M23.5 30H40.5M23.5 38H40.5M25 46H39M28 12V52M32 10V54M36 12V52" fill="none" stroke="#d9a51c" stroke-width="1.4"/>`,
  champinon: mushroom('#dcc6a6', '#f6efe2'),
  setas:
    sh(20) +
    `<path d="M30 30L34 56" fill="none" stroke="${L}" stroke-width="9" stroke-linecap="round"/><path d="M30 30L34 56" fill="none" stroke="#efe4cf" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="M8 30C10 18 22 12 34 14C46 15 56 22 55 30C50 28 46 32 42 30C38 33 34 30 30 32C26 30 22 33 18 30C14 32 11 30 8 30Z" fill="#8f6b4f" ${s}/>` +
    shine(22, 20, 5, 2.5, -15),
  calabaza:
    sh(21) +
    `<ellipse cx="21" cy="39" rx="12" ry="16" fill="#e97f25" ${s}/><ellipse cx="43" cy="39" rx="12" ry="16" fill="#e97f25" ${s}/><ellipse cx="32" cy="39" rx="12" ry="17" fill="#f39233" ${s}/>` +
    thick('M32 22C32 17 34 13 38 12', '#6b8a3a', 3.5),
  apio:
    sh(14) +
    thick('M24 57C22 44 22 30 26 16', '#b5d77a', 6) +
    thick('M32 57V12', '#c6e08c', 6) +
    thick('M40 57C42 44 42 30 38 16', '#b5d77a', 6) +
    `<circle cx="25" cy="13" r="5" fill="${LEAF}" ${s}/><circle cx="32" cy="9" r="5" fill="${GREEN}" ${s}/><circle cx="39" cy="13" r="5" fill="${LEAF}" ${s}/>`,
  remolacha:
    sh(16) +
    thick('M28 26L22 8', '#a8324f', 2.5) +
    thick('M36 26L42 8', '#a8324f', 2.5) +
    `<path d="M22 8C16 6 14 12 18 15C21 16 23 12 22 8ZM42 8C48 6 50 12 46 15C43 16 41 12 42 8Z" fill="${LEAF}" ${s}/>` +
    `<circle cx="32" cy="40" r="16" fill="#8e2350" ${s}/>` +
    `<path d="M32 56L33 61" ${n}/>` +
    shine(25, 34, 3, 5, 15),
  nabo:
    sh(14) +
    thick('M30 24L26 8', LEAF, 3) +
    thick('M34 24L40 8', GREEN, 3) +
    `<path d="M32 22C42 22 48 30 46 40C44 48 38 52 33 58C32 59 31 59 31 58C26 52 20 48 18 40C16 30 22 22 32 22Z" fill="#f6f1e6" ${s}/>` +
    `<path d="M18.5 34C20 26 26 22 32 22C38 22 44 26 45.5 34C40 31 24 31 18.5 34Z" fill="#9a4c9e"/>`,
  jengibre:
    sh(20) +
    `<path d="M10 40C8 34 14 30 20 32C22 26 28 24 32 28C36 22 44 22 46 28C52 26 57 30 55 36C53 42 46 42 42 40C38 46 30 46 26 42C20 46 12 46 10 40Z" fill="#d9b07a" ${s}/>` +
    `<path d="M20 36q2 -1 4 0M34 33q2 -1 4 0M46 33q1.6 -1 3 0" fill="none" stroke="#9a7346" stroke-width="1.6" stroke-linecap="round"/>`,
  aguacate:
    sh(16) +
    `<path d="M32 10C38 10 42 16 43 22C44 26 50 32 50 42C50 51 42 57 32 57C22 57 14 51 14 42C14 32 20 26 21 22C22 16 26 10 32 10Z" fill="#3e6b2f" ${s}/>` +
    g(
      'translate(32 38) scale(.8) translate(-32 -38)',
      `<path d="M32 10C38 10 42 16 43 22C44 26 50 32 50 42C50 51 42 57 32 57C22 57 14 51 14 42C14 32 20 26 21 22C22 16 26 10 32 10Z" fill="#d6e597"/>`,
    ) +
    `<circle cx="32" cy="42" r="8" fill="#8a5a33" ${s}/>` +
    shine(29, 39, 2.5, 1.5),
};

/* ---------------- Frutas y frutos secos ---------------- */

const FRUIT: Record<string, string> = {
  manzana:
    sh(18) +
    `<path d="M32 22C26 16 12 18 12 34C12 48 22 56 28 55C30 54.5 34 54.5 36 55C42 56 52 48 52 34C52 18 38 16 32 22Z" fill="#d83b3b" ${s}/>` +
    shine(21, 30, 4, 6, 20) +
    thick('M32 22Q31 15 34 10', '#7a4a2a', 2) +
    `<path d="M34 16C38 10 46 10 48 13C44 17 38 18 34 16Z" fill="${LEAF}" ${s}/>`,
  pera:
    sh(16) +
    `<path d="M32 14C27 14 26 20 26 25C26 29 17 34 17 44C17 52 24 57 32 57C40 57 47 52 47 44C47 34 38 29 38 25C38 20 37 14 32 14Z" fill="#c9cf4c" ${s}/>` +
    shine(24, 42, 3, 6, 15) +
    thick('M32 14Q32 9 35 6', '#7a4a2a', 2) +
    `<path d="M34 10C38 5 45 6 46 9C42 12 37 12 34 10Z" fill="${LEAF}" ${s}/>`,
  limon:
    sh(19) +
    `<path d="M8 36C8 32 10 30 12 29C16 22 24 18 32 18C40 18 48 22 52 29C54 30 56 32 56 36C56 40 54 42 52 43C48 50 40 54 32 54C24 54 16 50 12 43C10 42 8 40 8 36Z" fill="#f5d33d" ${s}/>` +
    shine(23, 28, 6, 3, -8),
  naranja:
    sh(19) +
    `<circle cx="32" cy="36" r="20" fill="#f39a2b" ${s}/>` +
    `<circle cx="24" cy="40" r="1" fill="#d97c12"/><circle cx="38" cy="44" r="1" fill="#d97c12"/><circle cx="42" cy="32" r="1" fill="#d97c12"/><circle cx="30" cy="48" r="1" fill="#d97c12"/>` +
    shine(23, 28, 5, 3) +
    `<path d="M32 16C34 10 42 8 46 11C42 15 36 17 32 16Z" fill="${LEAF}" ${s}/>`,
  platano:
    sh(20) +
    `<path d="M10 25C14 40 28 48 44 44C50 42 54 38 56 34C57 31.5 55 29.5 53 31.5C48 37 40 40 32 38C22 36 16 30 14 23C13 20 9 21 10 25Z" fill="#f6d34a" ${s}/>` +
    `<path d="M16 30C22 38 32 42 44 40" fill="none" stroke="#d9ac1f" stroke-width="1.8" stroke-linecap="round"/>` +
    thick('M11 23L9 18', '#6b5a2a', 2.5),
  fresa:
    sh(14) +
    `<path d="M32 56C22 50 14 40 14 30C14 24 20 21 26 22C29 22.5 31 23.5 32 24C33 23.5 35 22.5 38 22C44 21 50 24 50 30C50 40 42 50 32 56Z" fill="#e2394a" ${s}/>` +
    `<g fill="#f7d36b"><ellipse cx="24" cy="31" rx="1" ry="1.5"/><ellipse cx="32" cy="33" rx="1" ry="1.5"/><ellipse cx="40" cy="31" rx="1" ry="1.5"/><ellipse cx="28" cy="40" rx="1" ry="1.5"/><ellipse cx="36" cy="40" rx="1" ry="1.5"/><ellipse cx="32" cy="47" rx="1" ry="1.5"/></g>` +
    `<path d="M21 22L27 14L32 20L37 14L43 22L32 26Z" fill="${GREEN}" ${s}/>`,
  nuez:
    sh(17) +
    `<ellipse cx="32" cy="37" rx="18" ry="17" fill="#c69565" ${s}/>` +
    `<path d="M32 20V54M22 26Q28 30 24 36Q20 42 26 48M42 26Q36 30 40 36Q44 42 38 48" fill="none" stroke="#8e6038" stroke-width="1.8" stroke-linecap="round"/>`,
  'nuez-moscada':
    sh(14) +
    `<ellipse cx="32" cy="38" rx="15" ry="18" fill="#8a5a36" ${s}/>` +
    `<path d="M22 30Q30 34 26 42Q32 46 40 40M36 24Q34 32 42 34M26 50Q32 46 36 52" fill="none" stroke="#c99b6a" stroke-width="1.6" stroke-linecap="round"/>`,
};

/* ---------------- Carnes ---------------- */

const STEAK = 'M10 32C10 20 22 14 34 16C47 18 55 26 53 38C51 50 37 55 24 51C15 48 10 41 10 32Z';
const steak = (meat: string, fat: string) =>
  `<path d="${STEAK}" fill="${fat}" ${s}/>` +
  `<path d="${STEAK}" fill="${meat}" transform="translate(32 34) scale(.8) translate(-32 -34)"/>` +
  `<path d="M21 30Q26 33 24 38M36 25Q34 31 40 34M29 43Q33 45 38 42" fill="none" stroke="${fat}" stroke-width="2" stroke-linecap="round" opacity=".9"/>`;

const mince = (meat: string, half?: string) =>
  sh(23) +
  `<path d="M7 40L11 53H53L57 40Z" fill="#eef3f9" ${s}/>` +
  `<path d="M11 41C11 31 20 24 32 24C44 24 53 31 53 41Z" fill="${meat}"/>` +
  (half ? `<path d="M11 41C11 31 20 24 32 24V41Z" fill="${half}"/>` : '') +
  `<path d="M11 41C11 31 20 24 32 24C44 24 53 31 53 41" ${n}/>` +
  `<path d="M17 36q2 -2.2 4 0M24 31q2 -2.2 4 0M33 29q2 -2.2 4 0M41 32q2 -2.2 4 0M21 39q2 -2.2 4 0M29 36q2 -2.2 4 0M37 37q2 -2.2 4 0M45 38q2 -2.2 4 0" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="1.6" stroke-linecap="round"/>` +
  `<circle cx="26" cy="34" r="1.2" fill="#fff" opacity=".8"/><circle cx="38" cy="33" r="1.2" fill="#fff" opacity=".8"/><circle cx="33" cy="39" r="1.2" fill="#fff" opacity=".8"/>`;

const links = (c: string, specks?: string) =>
  sh(22) +
  [
    [16, 44],
    [32, 34],
    [48, 24],
  ]
    .map(
      ([x, y]) =>
        `<rect x="${x - 10}" y="${y - 6.5}" width="20" height="13" rx="6.5" fill="${c}" ${s} transform="rotate(-32 ${x} ${y})"/>` +
        shine(x - 2, y - 2.5, 4, 1.4, -32) +
        (specks
          ? `<circle cx="${x - 3}" cy="${y + 1}" r="1.2" fill="${specks}"/><circle cx="${x + 3}" cy="${y - 1}" r="1.2" fill="${specks}"/><circle cx="${x}" cy="${y + 3}" r="1" fill="${specks}"/>`
          : ''),
    )
    .join('') +
  `<circle cx="24.5" cy="39" r="2" fill="#f2e7d2" ${s}/><circle cx="40.5" cy="29" r="2" fill="#f2e7d2" ${s}/>`;

const chickenPiece = (shape: 'muslo' | 'contramuslo' | 'alita') => {
  if (shape === 'muslo')
    return (
      sh(19) +
      bone(38, 38, 51, 51) +
      `<path d="M12 26C12 16 22 10 32 12C42 14 46 24 44 32C42 38 38 42 32 42C24 44 12 38 12 26Z" fill="#f1bfa4" ${s}/>` +
      shine(22, 22, 5, 3)
    );
  if (shape === 'contramuslo')
    return (
      sh(19) +
      `<path d="M12 34C10 24 18 16 30 16C44 16 54 24 52 36C50 46 40 50 30 50C20 50 13 44 12 34Z" fill="#f1bfa4" ${s}/>` +
      `<path d="M18 30C24 26 32 28 36 34" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2" stroke-linecap="round"/>` +
      shine(24, 24, 5, 2.5)
    );
  return (
    sh(20) +
    `<path d="M8 30C8 24 14 22 20 24L34 30C38 26 46 26 50 30L56 40C58 44 54 48 50 46L36 40C32 44 24 44 20 40L12 38C9 36 8 34 8 30Z" fill="#f1bfa4" ${s}/>` +
    `<path d="M34 30L34 40" fill="none" stroke="#c98d70" stroke-width="1.8"/>` +
    shine(18, 28, 4, 2, -10)
  );
};

const MEAT: Record<string, string> = {
  'filete-ternera': sh(21) + steak('#bf3b46', '#f3dfcf'),
  'filete-cerdo': sh(21) + steak('#e9958e', '#f8ebe0'),
  'carne-cordero': sh(21) + steak('#a8424e', '#f3e2d2'),
  chuleta:
    sh(21) +
    bone(40, 42, 54, 54) +
    g('translate(-3 -3) scale(.92)', steak('#e48a84', '#f8ebe0')),
  chuletillas:
    sh(22) +
    bone(28, 38, 40, 20) +
    bone(36, 42, 50, 28) +
    `<ellipse cx="22" cy="44" rx="12" ry="9" fill="#f3e2d2" ${s}/><ellipse cx="22" cy="44" rx="9" ry="6.5" fill="#a8424e"/>` +
    `<ellipse cx="32" cy="48" rx="12" ry="8" fill="#f3e2d2" ${s}/><ellipse cx="32" cy="48" rx="9" ry="5.5" fill="#b24a55"/>`,
  solomillo:
    sh(22) +
    `<path d="M10 40C8 32 14 26 22 24L46 18C52 17 57 22 56 28C55 34 50 38 44 40L22 48C16 50 11 46 10 40Z" fill="#b8323f" ${s}/>` +
    `<ellipse cx="50" cy="28" rx="6" ry="8" fill="#d9555f" ${s} transform="rotate(-20 50 28)"/>` +
    `<path d="M18 34L44 26" fill="none" stroke="#f3dfcf" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>`,
  'carne-guisar':
    sh(21) +
    [
      [20, 44, -8],
      [38, 46, 10],
      [28, 30, 5],
      [44, 32, -12],
    ]
      .map(
        ([x, y, r]) =>
          `<rect x="${x - 8}" y="${y - 7}" width="16" height="14" rx="3.5" fill="#b8363f" ${s} transform="rotate(${r} ${x} ${y})"/>` +
          `<path d="M${x - 6} ${y - 4}H${x + 4}" stroke="#f3dfcf" stroke-width="1.6" stroke-linecap="round" transform="rotate(${r} ${x} ${y})"/>`,
      )
      .join(''),
  costillas:
    sh(22) +
    [17, 27, 37, 47].map((x) => thick(`M${x} 12V56`, '#f6efe2', 4)).join('') +
    `<path d="M10 22H54V42C54 46 51 48 47 48H17C13 48 10 46 10 42Z" fill="#d9767a" ${s}/>` +
    `<path d="M14 28H50" fill="none" stroke="#f6e3d6" stroke-width="2" stroke-linecap="round"/>`,
  'picada-ternera': mince('#b9363f'),
  'picada-cerdo': mince('#e8928c'),
  'picada-mixta': mince('#b9363f', '#e8928c'),
  'picada-pollo': mince('#f2b9a3'),
  'picada-pavo': mince('#efc4b0'),
  'picada-cordero': mince('#a6404c'),
  'pollo-entero':
    sh(22) +
    bone(22, 30, 14, 14) +
    bone(42, 30, 50, 14) +
    `<ellipse cx="32" cy="40" rx="22" ry="16" fill="#f2c6ab" ${s}/>` +
    `<path d="M16 38C20 46 28 48 32 46M48 38C44 46 36 48 32 46" fill="none" stroke="#d9a084" stroke-width="1.8" stroke-linecap="round"/>` +
    shine(22, 33, 6, 3),
  pechuga:
    sh(21) +
    `<path d="M10 36C8 24 20 16 34 18C46 20 55 28 53 38C51 46 41 50 30 48C20 47 11 44 10 36Z" fill="#f5c9b4" ${s}/>` +
    `<path d="M18 36C26 32 36 32 46 34" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2" stroke-linecap="round"/>` +
    shine(22, 26, 6, 3),
  muslo: chickenPiece('muslo'),
  contramuslo: chickenPiece('contramuslo'),
  alitas: chickenPiece('alita'),
  conejo: sh(21) + steak('#e9b0a6', '#f8ece4'),
  chorizo: links('#b8442f', '#f2d7c4'),
  salchichas: links('#eaa59b'),
  morcilla: links('#3d2a30', '#c9a9a0'),
  jamon:
    sh(22) +
    `<path d="M10 44C6 34 14 22 28 18C38 15 46 17 50 21L56 14C58 12 61 15 59 17L53 25C56 32 50 42 40 48C28 55 14 54 10 44Z" fill="#a8343f" ${s}/>` +
    `<path d="M14 40C16 30 24 24 34 22" fill="none" stroke="#f3e2d2" stroke-width="3" stroke-linecap="round"/>` +
    `<path d="M53 25L59 17" stroke="#3a2a22" stroke-width="5" stroke-linecap="round"/>` +
    shine(24, 36, 4, 2, -30),
  'jamon-serrano':
    sh(21) +
    `<path d="M10 26C18 18 26 30 34 22C42 14 48 24 54 20V40C48 44 42 34 34 42C26 50 18 38 10 46Z" fill="#b8323f" ${s}/>` +
    `<path d="M10 26C18 18 26 30 34 22C42 14 48 24 54 20" fill="none" stroke="#f6e7d8" stroke-width="3.5" stroke-linecap="round"/>`,
  'jamon-york':
    sh(20) +
    `<rect x="11" y="18" width="42" height="36" rx="14" fill="#f9d7d0" ${s}/><rect x="15" y="22" width="34" height="28" rx="11" fill="#f2a9a3"/>` +
    shine(24, 28, 5, 2.5),
  bacon:
    sh(22) +
    `<path d="M8 20C16 14 22 26 30 20C38 14 44 26 56 20V30C44 36 38 24 30 30C22 36 16 24 8 30Z" fill="#d65a5a" ${s}/>` +
    `<path d="M8 25C16 19 22 31 30 25C38 19 44 31 56 25" fill="none" stroke="#f8e3d6" stroke-width="2.5"/>` +
    `<path d="M8 38C16 32 22 44 30 38C38 32 44 44 56 38V48C44 54 38 42 30 48C22 54 16 42 8 48Z" fill="#d65a5a" ${s}/>` +
    `<path d="M8 43C16 37 22 49 30 43C38 37 44 49 56 43" fill="none" stroke="#f8e3d6" stroke-width="2.5"/>`,
  panceta:
    sh(21) +
    `<rect x="10" y="22" width="44" height="30" rx="4" fill="#f6e3d6" ${s}/>` +
    `<path d="M10 30H54M10 40H54" stroke="#d6656a" stroke-width="5"/>` +
    `<rect x="10" y="22" width="44" height="30" rx="4" ${n}/>`,
  hueso:
    sh(21) +
    `<path d="M16 26L46 38" stroke="${L}" stroke-width="13" stroke-linecap="round"/><path d="M16 26L46 38" stroke="#f6efe2" stroke-width="9" stroke-linecap="round"/>` +
    `<circle cx="13" cy="21" r="6" fill="#f6efe2" ${s}/><circle cx="12" cy="31" r="6" fill="#f6efe2" ${s}/><circle cx="50" cy="33" r="6" fill="#f6efe2" ${s}/><circle cx="49" cy="43" r="6" fill="#f6efe2" ${s}/>` +
    `<path d="M16 26L46 38" stroke="#f6efe2" stroke-width="9" stroke-linecap="round"/>`,
};

/* ---------------- Pescados y mariscos ---------------- */

const FISH_BODY = 'M6 32C14 20 32 16 44 24L56 14C58 13 59 15 58 17L54 32L58 47C59 49 58 51 56 50L44 40C32 48 14 44 6 32Z';
const fish = (body: string, belly: string, extra = '') =>
  `<path d="M28 19L34 11L39 20" fill="${body}" ${s}/>` +
  `<path d="${FISH_BODY}" fill="${body}" ${s}/>` +
  `<path d="M8 33C16 40 30 43 42 38C32 36 18 36 8 33Z" fill="${belly}"/>` +
  extra +
  `<path d="${FISH_BODY}" ${n}/>` +
  `<path d="M22 24Q26 32 22 40" ${n}/>` +
  `<circle cx="15" cy="29" r="2.8" fill="#fff" ${s}/><circle cx="15.3" cy="29" r="1.2" fill="${L}"/>`;

const fillet = (c: string, line: string) =>
  sh(22) +
  `<path d="M8 36C8 28 16 22 28 22H48C54 22 57 26 56 32C55 40 48 46 38 46H18C12 46 8 42 8 36Z" fill="${c}" ${s}/>` +
  `<path d="M20 24Q15 34 20 44M30 23Q25 34 30 45M40 23Q35 34 40 45M50 24Q46 32 49 42" fill="none" stroke="${line}" stroke-width="1.8" stroke-linecap="round"/>`;

const fishSteak = (c: string, ring: string) =>
  sh(21) +
  `<ellipse cx="32" cy="36" rx="22" ry="16" fill="${c}" ${s}/>` +
  `<path d="M14 36C20 30 26 36 32 36C38 36 44 30 50 36M32 22V50M18 28Q32 36 46 28M18 44Q32 36 46 44" fill="none" stroke="${ring}" stroke-width="1.6" stroke-linecap="round"/>`;

const shrimp = (c: string, claws = false) =>
  sh(20) +
  thick('M44 18C48 10 56 8 60 10', c, 1.2) +
  `<path d="M22 43L12 40L14 48L10 54L22 50Z" fill="${c}" ${s}/>` +
  `<path d="M44 18C54 22 56 36 48 46C42 52 30 54 22 50C18 48 18 44 22 43C30 46 38 44 42 38C46 32 44 26 38 24C35 23 35 18 38 17C40 16.5 42 17 44 18Z" fill="${c}" ${s}/>` +
  `<path d="M46 24L41 27.5M50 32L44 33M48 40L42 39M42 46L37 43" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="1.8" stroke-linecap="round"/>` +
  `<circle cx="41" cy="20.5" r="1.4" fill="${L}"/>` +
  (claws
    ? `<path d="M40 18C34 12 26 12 24 16C28 18 34 18 38 20ZM44 17C42 9 46 4 50 5C50 9 48 14 46 18Z" fill="${c}" ${s}/>`
    : '');

const shell = (c: string, ridge: string, round = false) =>
  sh(20) +
  (round
    ? `<path d="M12 40C12 26 21 17 32 17C43 17 52 26 52 40C44 46 20 46 12 40Z" fill="${c}" ${s}/>`
    : `<path d="M10 40C10 26 20 17 32 17C44 17 54 26 54 40C46 44 18 44 10 40Z" fill="${c}" ${s}/>`) +
  `<path d="M32 43V20M32 43L20 22M32 43L44 22M32 43L13 32M32 43L51 32" fill="none" stroke="${ridge}" stroke-width="1.6" stroke-linecap="round"/>` +
  `<rect x="27" y="41" width="10" height="5" rx="2" fill="${ridge}" ${s}/>`;

const can = (label: string, icon: string, lid = '#d5dbe3') =>
  sh(17) +
  `<rect x="16" y="20" width="32" height="36" rx="3" fill="#c3ccd7" ${s}/>` +
  `<rect x="16" y="27" width="32" height="22" fill="${label}" ${s}/>` +
  `<ellipse cx="32" cy="20" rx="16" ry="4" fill="${lid}" ${s}/><ellipse cx="32" cy="20" rx="11" ry="2.4" fill="none" stroke="#9aa6b5" stroke-width="1.4"/>` +
  icon;

const FISH_ICON = `<path d="M22 38C26 33 34 33 38 37L42 34V42L38 39C34 43 26 43 22 38Z" fill="#fff"/>`;

const SEA: Record<string, string> = {
  merluza: sh(22) + fish('#9fb0bf', '#e6ecf1'),
  bacalao: sh(22) + fish('#8f9a86', '#ece8dc', `<path d="M16 36C24 38 34 38 44 34" fill="none" stroke="#f3efe3" stroke-width="2"/>`),
  lubina: sh(22) + fish('#7f8e9d', '#dfe6ec'),
  dorada: sh(22) + fish('#a9b4bd', '#eef1f3', `<path d="M18 22Q20 26 18 30" fill="none" stroke="#e7b93c" stroke-width="3" stroke-linecap="round"/>`),
  caballa:
    sh(22) +
    fish(
      '#3f7a8f',
      '#e3ecef',
      `<path d="M26 20Q28 24 26 28M32 20Q34 24 32 28M38 22Q40 26 38 30" fill="none" stroke="#21485a" stroke-width="2" stroke-linecap="round"/>`,
    ),
  sardinas:
    sh(22) + g('translate(4 -6) scale(.8)', fish('#4f7fa8', '#dfe9f2')) + g('translate(2 14) scale(.8)', fish('#5a8bb4', '#e6eef5')),
  boquerones:
    sh(22) +
    g('translate(2 -2) scale(.85 .6)', fish('#7aa3bf', '#eef3f7')) +
    g('translate(6 22) scale(.85 .6)', fish('#86adc7', '#eef3f7')),
  rape:
    sh(22) +
    `<path d="M6 34C6 20 20 14 34 18C42 20 46 26 46 30L58 22C60 21 61 23 60 25L56 34L60 44C61 46 59 47 58 46L46 38C44 46 32 52 20 50C12 48 6 42 6 34Z" fill="#8a6a52" ${s}/>` +
    `<path d="M8 38C14 44 24 44 30 40" fill="none" stroke="#f2e6d6" stroke-width="2.5" stroke-linecap="round"/>` +
    `<circle cx="18" cy="26" r="3" fill="#fff" ${s}/><circle cx="18.3" cy="26" r="1.3" fill="${L}"/>`,
  lenguado:
    sh(22) +
    `<ellipse cx="30" cy="36" rx="24" ry="15" fill="#e2c9a4" ${s}/>` +
    `<ellipse cx="30" cy="36" rx="19" ry="11" fill="#b08a62"/>` +
    `<path d="M52 36L60 28V44Z" fill="#b08a62" ${s}/>` +
    `<circle cx="16" cy="32" r="2.4" fill="#fff" ${s}/><circle cx="20" cy="29" r="2.4" fill="#fff" ${s}/>`,
  salmon: fillet('#f0885a', '#fde3d2'),
  'bacalao-desalado': fillet('#f3eee3', '#c9bfac'),
  atun: fishSteak('#b8404f', '#e68a95'),
  emperador: fishSteak('#efd2c2', '#c99c88'),
  bonito: fishSteak('#c9545c', '#eda1a6'),
  gambas: shrimp('#f08a6c'),
  langostinos: shrimp('#e46a4a'),
  cigalas: shrimp('#f2967a', true),
  calamar:
    sh(16) +
    [24, 29, 34, 39].map((x, i) => thick(`M${x} 40C${x - 2} 48 ${x + 3} 52 ${x + (i % 2 ? 3 : -3)} 58`, '#f2d2d8', 2.5)).join('') +
    `<path d="M22 12C26 6 38 6 42 12L40 42H24Z" fill="#f2d2d8" ${s}/>` +
    `<path d="M22 12L14 22L23 24ZM42 12L50 22L41 24Z" fill="#e8b7c2" ${s}/>` +
    `<g fill="#b06478"><circle cx="28" cy="20" r="1.3"/><circle cx="35" cy="26" r="1.3"/><circle cx="30" cy="32" r="1.3"/><circle cx="36" cy="16" r="1.3"/></g>`,
  pulpo:
    sh(22) +
    [
      'M18 36C10 40 8 50 14 52C18 53 18 48 16 46',
      'M24 40C20 48 22 56 28 55C31 54 30 50 28 49',
      'M40 40C44 48 42 56 36 55C33 54 34 50 36 49',
      'M46 36C54 40 56 50 50 52C46 53 46 48 48 46',
    ]
      .map((d) => thick(d, '#d9708a', 4.5))
      .join('') +
    `<path d="M14 30C14 16 22 9 32 9C42 9 50 16 50 30C50 38 42 42 32 42C22 42 14 38 14 30Z" fill="#e07e95" ${s}/>` +
    `<circle cx="26" cy="28" r="3" fill="#fff" ${s}/><circle cx="38" cy="28" r="3" fill="#fff" ${s}/><circle cx="26" cy="28" r="1.3" fill="${L}"/><circle cx="38" cy="28" r="1.3" fill="${L}"/>` +
    shine(24, 17, 5, 2.5),
  sepia:
    sh(18) +
    `<ellipse cx="32" cy="34" rx="20" ry="16" fill="#e9dcd2" ${s}/><ellipse cx="32" cy="34" rx="15" ry="12" fill="#cdb7a8"/>` +
    `<path d="M24 50C22 55 26 58 28 56M32 50V58M40 50C42 55 38 58 36 56" ${n}/>`,
  mejillones:
    sh(21) +
    `<path d="M18 54C10 48 12 36 20 24C26 14 38 8 46 12C52 16 50 28 44 38C38 48 28 58 18 54Z" fill="#2f3550" ${s}/>` +
    `<path d="M22 46C26 36 32 26 42 16M28 50C32 42 38 32 46 22" fill="none" stroke="#6874a0" stroke-width="1.8" stroke-linecap="round"/>` +
    `<path d="M24 50C28 44 34 40 40 32" fill="none" stroke="#f0a35a" stroke-width="3" stroke-linecap="round"/>`,
  almejas: shell('#e8d6b5', '#b89c70'),
  berberechos: shell('#eacb98', '#b48a4c', true),
  'atun-lata': can('#2f63a8', FISH_ICON),
  'sardinas-lata': can('#e0a92c', FISH_ICON),
  anchoas: can('#c23b3b', FISH_ICON),
  'mejillones-lata': can('#3f7a4a', `<path d="M27 44C24 40 26 34 32 30C36 28 40 30 38 34C36 38 32 44 27 44Z" fill="#fff"/>`),
};

/* ---------------- Huevos y lácteos ---------------- */

const EGG = 'M32 10C42 10 50 26 50 38C50 50 42 56 32 56C22 56 14 50 14 38C14 26 22 10 32 10Z';

const carton = (band: string, cap = band) =>
  sh(16) +
  `<path d="M18 20L24 10H40L46 20Z" fill="#eef2f6" ${s}/>` +
  `<rect x="18" y="20" width="28" height="37" rx="2" fill="#fbfdff" ${s}/>` +
  `<rect x="18" y="34" width="28" height="12" fill="${band}" ${s}/>` +
  `<rect x="34" y="11" width="6" height="5" rx="1.5" fill="${cap}" ${s}/>`;

const cheeseWedge = (c: string, top: string, holes: string, rind?: string) =>
  sh(22) +
  `<path d="M8 44L48 18L56 30V48C56 50 54 52 52 52H12C10 52 8 50 8 48Z" fill="${c}" ${s}/>` +
  `<path d="M8 44L48 18L56 30L16 50Z" fill="${top}"/>` +
  (rind
    ? `<path d="M56 30V48C56 50 54 52 52 52H40" fill="none" stroke="${rind}" stroke-width="4"/><path d="M8 44L48 18L56 30V48C56 50 54 52 52 52H12C10 52 8 50 8 48Z" ${n}/>`
    : `<path d="M8 44L48 18L56 30V48C56 50 54 52 52 52H12C10 52 8 50 8 48Z" ${n}/>`) +
  `<path d="M8 44L16 50L56 30" ${n}/>` +
  holes;

/* Cuenco azul con contenido amontonado encima. */
const HEAP = 'M11 36C12 27 21 21 32 21C43 21 52 27 53 36Z';
const PTS = [
  [18, 33],
  [24, 30],
  [30, 27],
  [36, 27],
  [42, 30],
  [47, 33],
  [21, 35],
  [27, 33],
  [33, 31],
  [39, 33],
  [45, 35],
  [28, 24.5],
  [35, 24],
  [24, 35],
  [31, 35],
  [38, 35.5],
];
type Grain = 'grain' | 'disc' | 'ball' | 'bean' | 'shred' | 'crumb' | 'cube' | 'none';
const texture = (kind: Grain, tone: string) =>
  PTS.map(([x, y], i) => {
    const r = (i * 47) % 180;
    switch (kind) {
      case 'grain':
        return `<ellipse cx="${x}" cy="${y}" rx="2" ry="1" fill="${tone}" transform="rotate(${r} ${x} ${y})"/>`;
      case 'disc':
        return `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.8" fill="${tone}" stroke="#000" stroke-opacity=".25" stroke-width=".8"/>`;
      case 'ball':
        return `<circle cx="${x}" cy="${y}" r="3" fill="${tone}" stroke="#000" stroke-opacity=".3" stroke-width="1"/>`;
      case 'bean':
        return `<ellipse cx="${x}" cy="${y}" rx="3.4" ry="2" fill="${tone}" stroke="#000" stroke-opacity=".3" stroke-width="1" transform="rotate(${r} ${x} ${y})"/>`;
      case 'shred':
        return `<path d="M${x - 2.5} ${y + 1}L${x + 2.5} ${y - 1}" stroke="${tone}" stroke-width="1.8" stroke-linecap="round" transform="rotate(${r} ${x} ${y})"/>`;
      case 'crumb':
        return `<circle cx="${x}" cy="${y}" r="${0.8 + (i % 3) * 0.3}" fill="${tone}"/>`;
      case 'cube':
        return i % 2 ? '' : `<rect x="${x - 2.2}" y="${y - 2.2}" width="4.4" height="4.4" rx=".8" fill="${tone}" stroke="#000" stroke-opacity=".25" stroke-width=".8"/>`;
      default:
        return '';
    }
  }).join('');

const bowl = (heap: string, kind: Grain, tone: string, extra = '') =>
  sh(22) +
  `<path d="${HEAP}" fill="${heap}" ${s}/>` +
  texture(kind, tone) +
  extra +
  `<path d="M8 36H56C56 48 45 56 32 56C19 56 8 48 8 36Z" fill="${BOWL}" ${s}/>` +
  `<path d="M15 44C19 50 25 52 32 52" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2.5" stroke-linecap="round"/>`;

const DAIRY: Record<string, string> = {
  huevo: sh(16) + `<path d="${EGG}" fill="#fbf6ec" ${s}/>` + shine(24, 26, 4, 7, 15),
  'huevo-moreno': sh(16) + `<path d="${EGG}" fill="#e3bd92" ${s}/>` + shine(24, 26, 4, 7, 15),
  claras: bowl(
    '#ffffff',
    'none',
    '',
    `<path d="M14 36C14 30 18 26 22 28C22 20 30 16 34 22C38 16 46 20 44 28C50 28 52 32 50 36" fill="#fff" ${s}/><path d="M32 24L34 18" ${n}/>`,
  ),
  yemas: bowl('#fff6dc', 'none', '', `<circle cx="24" cy="30" r="6" fill="#f6b52b" ${s}/><circle cx="38" cy="29" r="6" fill="#f6b52b" ${s}/><circle cx="31" cy="23" r="5" fill="#f6b52b" ${s}/>`),
  leche: carton('#3f6fb5'),
  'leche-semi': carton('#4aa3c9'),
  'leche-evaporada': can('#f3efe6', `<path d="M26 34H38V42H26Z" fill="#3f6fb5"/>`),
  nata: carton('#e9a2b5', '#d27a91'),
  'nata-montar':
    sh(16) +
    `<path d="M18 20L24 10H40L46 20Z" fill="#eef2f6" ${s}/><rect x="18" y="20" width="28" height="37" rx="2" fill="#fbfdff" ${s}/><rect x="18" y="34" width="28" height="12" fill="#7cc3dd" ${s}/>` +
    `<path d="M26 38C26 35 29 34 32 36C35 34 38 35 38 38" fill="#fff" ${s}/>`,
  'queso-rallado': bowl('#f6d35f', 'shred', '#e3a92a'),
  'queso-manchego': cheeseWedge('#f5e3a6', '#fbeec4', `<circle cx="30" cy="42" r="1.4" fill="#d9c27a"/><circle cx="40" cy="38" r="1.4" fill="#d9c27a"/>`, '#5a4a32'),
  queso: cheeseWedge('#f3c64f', '#f7d978', `<ellipse cx="26" cy="44" rx="2.5" ry="2" fill="#d9a73a"/><ellipse cx="40" cy="42" rx="3" ry="2.4" fill="#d9a73a"/><ellipse cx="34" cy="34" rx="2" ry="1.6" fill="#d9a73a"/>`),
  parmesano: cheeseWedge('#f2dd9a', '#f7e9b8', `<circle cx="28" cy="42" r="1" fill="#c9ad5a"/><circle cx="36" cy="40" r="1" fill="#c9ad5a"/><circle cx="44" cy="38" r="1" fill="#c9ad5a"/><circle cx="32" cy="46" r="1" fill="#c9ad5a"/>`, '#c79a3a'),
  'queso-fresco':
    sh(19) +
    `<path d="M12 30V46C12 50 21 53 32 53C43 53 52 50 52 46V30Z" fill="#fbf7ee" ${s}/>` +
    `<ellipse cx="32" cy="30" rx="20" ry="7" fill="#fffdf6" ${s}/>` +
    `<path d="M16 38C20 40 26 40 30 38M36 42C40 44 46 42 48 40" fill="none" stroke="#e6dcc6" stroke-width="1.6" stroke-linecap="round"/>`,
  mozzarella:
    sh(18) +
    `<circle cx="32" cy="38" r="17" fill="#fbfaf4" ${s}/>` +
    shine(25, 31, 5, 3) +
    `<path d="M34 22C36 14 44 12 48 14C46 20 40 24 34 22Z" fill="${LEAF}" ${s}/>`,
  'queso-cabra':
    sh(21) +
    `<rect x="10" y="26" width="40" height="22" rx="11" fill="#f7f5ee" ${s}/>` +
    `<ellipse cx="50" cy="37" rx="6" ry="11" fill="#fffdf6" ${s}/>` +
    `<ellipse cx="50" cy="37" rx="3" ry="6" fill="#f0ecdf"/>`,
  'queso-crema':
    sh(18) +
    `<path d="M14 30L18 52C18 54 20 55 22 55H42C44 55 46 54 46 52L50 30Z" fill="#fbfdff" ${s}/>` +
    `<ellipse cx="32" cy="30" rx="18" ry="5" fill="#7cc3dd" ${s}/>` +
    `<rect x="20" y="38" width="24" height="8" rx="2" fill="#3f6fb5"/>`,
  yogur:
    sh(15) +
    `<path d="M18 20H46L42 54C42 56 40 57 38 57H26C24 57 22 56 22 54Z" fill="#fbfdff" ${s}/>` +
    `<rect x="15" y="14" width="34" height="7" rx="2" fill="#3f6fb5" ${s}/>` +
    `<path d="M20 32H44" stroke="#7cc3dd" stroke-width="5"/>` +
    `<path d="M18 20H46L42 54C42 56 40 57 38 57H26C24 57 22 56 22 54Z" ${n}/>`,
  'yogur-griego':
    sh(18) +
    `<path d="M12 26L16 52C16 54 18 56 20 56H44C46 56 48 54 48 52L52 26Z" fill="#fbfdff" ${s}/>` +
    `<ellipse cx="32" cy="26" rx="20" ry="5" fill="#e6eef5" ${s}/>` +
    `<path d="M16 36H48" stroke="#2f63a8" stroke-width="5"/>`,
  mantequilla:
    sh(22) +
    `<path d="M8 42L14 36H52L46 42Z" fill="#dfe8f3" ${s}/>` +
    `<path d="M12 30L24 22H54L42 30Z" fill="#fbe7a1" ${s}/>` +
    `<path d="M12 30H42V46H12Z" fill="#f6d775" ${s}/>` +
    `<path d="M42 30L54 22V38L42 46Z" fill="#e8c55e" ${s}/>`,
  margarina:
    sh(19) +
    `<path d="M12 32V48C12 52 20 55 32 55C44 55 52 52 52 48V32Z" fill="#fbfdff" ${s}/>` +
    `<ellipse cx="32" cy="32" rx="20" ry="7" fill="#f2c230" ${s}/>`,
};

/* ---------------- Arroz, legumbres, pasta y pan ---------------- */

const macaroni = (x: number, y: number, r: number) =>
  g(
    `translate(${x} ${y}) rotate(${r})`,
    `<path d="M-6 4C-6 -3 -1 -7 6 -7" fill="none" stroke="${L}" stroke-width="9" stroke-linecap="round"/><path d="M-6 4C-6 -3 -1 -7 6 -7" fill="none" stroke="#f2c55a" stroke-width="5.4" stroke-linecap="round"/><ellipse cx="-6" cy="4" rx="2.6" ry="1.8" fill="#e0a838"/>`,
  );

const GRAINS: Record<string, string> = {
  arroz: bowl('#f8f5ec', 'grain', '#ddd5c0'),
  'arroz-integral': bowl('#dbc69d', 'grain', '#b59a68'),
  'arroz-bomba': bowl('#f6f1e4', 'grain', '#d3c8ad'),
  lentejas: bowl('#8f6e44', 'disc', '#6f5232'),
  garbanzos: bowl('#e0bf88', 'ball', '#ecd3a2'),
  'alubias-blancas': bowl('#efe7d4', 'bean', '#fbf6ea'),
  'alubias-pintas': bowl('#9a5a44', 'bean', '#c07c62'),
  quinoa: bowl('#efe0c0', 'crumb', '#c9a46a'),
  cuscus: bowl('#f0d58c', 'crumb', '#d6ae4f'),
  avena: bowl('#e9d6ad', 'bean', '#f5e8c8'),
  'pan-rallado': bowl('#e3b977', 'crumb', '#b88545'),
  fideos: bowl('#f2cf6a', 'shred', '#d9a73a'),
  macarrones: sh(22) + macaroni(20, 40, 0) + macaroni(38, 44, 70) + macaroni(30, 26, -40) + macaroni(46, 28, 160) + macaroni(18, 26, 100),
  espaguetis:
    sh(16) +
    [20, 24, 28, 32, 36, 40, 44]
      .map((x) => `<path d="M${x} 8L${32 + (x - 32) * 0.35} 34L${x} 58" fill="none" stroke="#e2b34a" stroke-width="2.4" stroke-linecap="round"/>`)
      .join('') +
    `<rect x="24" y="30" width="16" height="8" rx="2" fill="${BOWL}" ${s}/>`,
  tallarines:
    sh(19) +
    `<circle cx="32" cy="36" r="17" fill="#f2c55a" ${s}/>` +
    `<path d="M20 30C26 22 40 22 44 32C46 40 38 46 30 44C24 42 22 36 28 32C32 30 38 32 38 36" fill="none" stroke="#d99f2c" stroke-width="2" stroke-linecap="round"/>`,
  lasana:
    sh(22) +
    `<path d="M8 24C12 20 16 28 20 24C24 20 28 28 32 24C36 20 40 28 44 24C48 20 52 28 56 24V46C52 50 48 42 44 46C40 50 36 42 32 46C28 50 24 42 20 46C16 50 12 42 8 46Z" fill="#f3d27a" ${s}/>` +
    `<path d="M12 35H52" fill="none" stroke="#e0b24e" stroke-width="1.6" stroke-dasharray="3 3"/>`,
  canelones:
    sh(21) +
    `<rect x="8" y="22" width="40" height="22" rx="2" fill="#f3d27a" ${s} transform="rotate(-8 28 33)"/>` +
    `<rect x="16" y="32" width="40" height="22" rx="2" fill="#f6dc8e" ${s} transform="rotate(6 36 43)"/>`,
  fideua: sh(22) + [18, 26, 34, 42, 22, 30, 38, 46].map((x, i) => thick(`M${x} ${i < 4 ? 30 : 42}l6 ${i % 2 ? 4 : -4}`, '#f2c55a', 2.6)).join(''),
  pan:
    sh(23) +
    `<path d="M8 44C4 38 10 32 18 28L42 16C50 12 58 16 58 22C58 26 54 30 48 32L22 46C16 49 10 48 8 44Z" fill="#d99a4e" ${s}/>` +
    `<path d="M20 34L26 38M30 28L36 32M40 22L46 26" fill="none" stroke="#f6d39b" stroke-width="3" stroke-linecap="round"/>`,
  'pan-molde':
    sh(18) +
    `<path d="M14 26C10 16 20 10 32 12C44 10 54 16 50 26V52C50 54 48 56 46 56H18C16 56 14 54 14 52Z" fill="#d99a4e" ${s}/>` +
    `<path d="M18 27C15 20 23 16 32 17C41 16 49 20 46 27V51H18Z" fill="#fbe6c0"/>`,
  harina:
    sh(18) +
    `<path d="M16 22C16 16 20 14 24 16C28 12 36 12 40 16C44 14 48 16 48 22L50 52C50 55 48 57 45 57H19C16 57 14 55 14 52Z" fill="#f4ede0" ${s}/>` +
    `<path d="M20 22C26 25 38 25 44 22" ${n}/>` +
    `<rect x="20" y="33" width="24" height="15" rx="2" fill="${BOWL}" ${s}/>` +
    `<path d="M32 36V45M29 38L32 40L35 38M29 42L32 44L35 42" fill="none" stroke="#f6d775" stroke-width="1.6" stroke-linecap="round"/>`,
};

/* ---------------- Especias y condimentos ---------------- */

const jar = (content: string, lid = '#c0392b', speck?: string) =>
  sh(16) +
  `<rect x="20" y="12" width="24" height="8" rx="2" fill="${lid}" ${s}/>` +
  `<path d="M18 23C18 21 20 20 22 20H42C44 20 46 21 46 23V52C46 55 44 57 41 57H23C20 57 18 55 18 52Z" fill="#e6eef6" ${s}/>` +
  `<path d="M19 30H45V52C45 54.5 43.5 56 41 56H23C20.5 56 19 54.5 19 52Z" fill="${content}"/>` +
  (speck ? `<g fill="${speck}"><circle cx="24" cy="36" r="1"/><circle cx="31" cy="42" r="1"/><circle cx="38" cy="35" r="1"/><circle cx="27" cy="50" r="1"/><circle cx="40" cy="47" r="1"/><circle cx="34" cy="52" r="1"/></g>` : '') +
  `<path d="M18 23C18 21 20 20 22 20H42C44 20 46 21 46 23V52C46 55 44 57 41 57H23C20 57 18 55 18 52Z" ${n}/>` +
  `<rect x="23" y="38" width="18" height="9" rx="1.5" fill="#fffdf6" ${s}/>` +
  shine(41, 28, 1.2, 4, 0);

const sprig = (c: string) =>
  sh(16) +
  thick('M32 58C32 44 30 30 34 10', '#5b8a3a', 2) +
  [
    [26, 46, -40],
    [38, 42, 40],
    [26, 34, -35],
    [38, 30, 40],
    [28, 22, -30],
    [38, 18, 35],
    [34, 10, 0],
  ]
    .map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="3.6" fill="${c}" ${s} transform="rotate(${r} ${x} ${y})"/>`)
    .join('');

const needles = (c: string) =>
  sh(16) +
  thick('M24 58L40 8', '#7a6a3a', 2) +
  Array.from({ length: 9 }, (_, i) => {
    const y = 14 + i * 5;
    const x = 40 - (y - 8) * 0.32;
    return `<path d="M${x} ${y}l-7 -3M${x} ${y}l7 -1" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/>`;
  }).join('');

const SPICE: Record<string, string> = {
  sal:
    sh(15) +
    `<path d="M20 26C20 18 26 12 32 12C38 12 44 18 44 26Z" fill="#c9d1db" ${s}/>` +
    `<path d="M20 26H44V52C44 55 42 57 39 57H25C22 57 20 55 20 52Z" fill="#f5f8fb" ${s}/>` +
    `<g fill="${L}"><circle cx="28" cy="20" r="1"/><circle cx="32" cy="17" r="1"/><circle cx="36" cy="20" r="1"/></g>` +
    shine(25, 40, 1.5, 7, 0),
  'sal-gorda': bowl('#ffffff', 'cube', '#eef4fa'),
  pimienta:
    sh(13) +
    `<circle cx="32" cy="12" r="5" fill="#7a4f30" ${s}/>` +
    `<path d="M24 16H40V22C40 26 44 28 44 34V52C44 55 42 57 39 57H25C22 57 20 55 20 52V34C20 28 24 26 24 22Z" fill="#9a6a43" ${s}/>` +
    `<path d="M20 40H44" ${n}/>` +
    shine(25, 46, 1.5, 4, 0),
  'pimienta-grano': bowl('#4a3a32', 'ball', '#3a2c26'),
  oregano: jar('#7e9a4a', '#3f6fb5', '#4c6a2a'),
  'pimenton-dulce': jar('#d4432f', '#3f6fb5'),
  'pimenton-picante': jar('#b52a1f', '#c0392b'),
  comino: jar('#9a7040', '#3f6fb5', '#6d4c26'),
  curcuma: jar('#e8a32a', '#3f6fb5'),
  curry: jar('#d39a2e', '#c0392b', '#a86f1a'),
  'hierbas-provenzales': jar('#8aa356', '#3f6fb5', '#56702e'),
  'ajo-polvo': jar('#f0e6cf', '#3f6fb5'),
  'canela-molida': jar('#a8683a', '#c0392b'),
  'jengibre-molido': jar('#d8b77a', '#3f6fb5'),
  'pimienta-blanca': jar('#ece6da', '#3f6fb5', '#c9bfae'),
  sesamo: bowl('#f3e6c6', 'grain', '#d8c296'),
  azafran:
    sh(16) +
    `<path d="M14 26H50V52C50 54 48 56 46 56H18C16 56 14 54 14 52Z" fill="#f6efe0" ${s}/>` +
    `<path d="M14 26L32 40L50 26" ${n}/>` +
    [20, 26, 32, 38, 44].map((x, i) => thick(`M${x} 30C${x + 2} 22 ${x - 2} 16 ${x + (i % 2 ? 3 : -2)} 10`, '#d9452b', 1.5)).join(''),
  canela:
    sh(18) +
    `<rect x="10" y="30" width="44" height="9" rx="4.5" fill="#a8683a" ${s} transform="rotate(-18 32 34)"/>` +
    `<rect x="12" y="40" width="44" height="9" rx="4.5" fill="#b9773f" ${s} transform="rotate(-10 34 44)"/>` +
    `<path d="M12 37C14 33 18 34 16 38" fill="none" stroke="#6d3f1e" stroke-width="1.4"/>`,
  laurel:
    sh(18) +
    `<path d="M10 50C12 34 28 16 52 12C50 30 36 48 10 50Z" fill="#6f8a3e" ${s}/>` +
    `<path d="M12 48C24 38 36 26 48 15" fill="none" stroke="#c4d48e" stroke-width="1.6" stroke-linecap="round"/>`,
  perejil: sprig('#4e9a3c'),
  cilantro: sprig('#5fae4a'),
  albahaca: sprig('#3f8a3a'),
  hierbabuena: sprig('#62b86a'),
  eneldo: needles('#7fb85c'),
  romero: needles('#5d7f4a'),
  tomillo: needles('#7f9a5a'),
  clavo:
    sh(16) +
    [
      [22, 30, -20],
      [32, 34, 10],
      [42, 30, 30],
    ]
      .map(([x, y, r]) => g(`rotate(${r} ${x} ${y})`, thick(`M${x} ${y}V${y + 18}`, '#6d3f22', 2.5) + `<circle cx="${x}" cy="${y - 2}" r="4.5" fill="#7a4628" ${s}/>`))
      .join(''),
  anis:
    sh(16) +
    `<path d="M32 12L36 26L50 22L40 32L50 42L36 38L32 52L28 38L14 42L24 32L14 22L28 26Z" fill="#8a4f2c" ${s}/>` +
    `<circle cx="32" cy="32" r="3" fill="#c99363" ${s}/>`,
  vainilla:
    sh(20) +
    thick('M10 50C20 40 34 26 54 14', '#3a2620', 3) +
    `<path d="M14 46C22 38 34 28 50 18" fill="none" stroke="#6d4a3a" stroke-width="1" stroke-linecap="round"/>`,
  pastilla:
    sh(16) +
    `<path d="M14 26L32 18L50 26L32 34Z" fill="#f2c54a" ${s}/>` +
    `<path d="M14 26V44L32 52V34Z" fill="#e3a92a" ${s}/>` +
    `<path d="M50 26V44L32 52V34Z" fill="#d1951c" ${s}/>` +
    `<path d="M14 34L32 42L50 34" fill="none" stroke="#c0392b" stroke-width="3"/>`,
  colorante: jar('#f2b01f', '#c0392b'),
};

/* ---------------- Aceites, vinos y líquidos ---------------- */

const bottle = (shape: 'tall' | 'wine' | 'small' | 'round', glass: string, label: string, cap: string) => {
  const d = {
    tall: 'M28 8H36V16L42 22V54C42 56 40 57 38 57H26C24 57 22 56 22 54V22L28 16Z',
    wine: 'M28 6H36V18C36 22 44 24 44 32V54C44 56 42 57 40 57H24C22 57 20 56 20 54V32C20 24 28 22 28 18Z',
    small: 'M29 12H35V20C35 22 40 24 40 30V54C40 56 38 57 36 57H28C26 57 24 56 24 54V30C24 24 29 22 29 20Z',
    round: 'M28 10H36V20C44 22 48 30 48 40C48 50 41 57 32 57C23 57 16 50 16 40C16 30 20 22 28 20Z',
  }[shape];
  const lab = {
    tall: '<rect x="24" y="34" width="16" height="14" rx="1.5"',
    wine: '<rect x="22" y="36" width="20" height="13" rx="1.5"',
    small: '<rect x="26" y="36" width="12" height="11" rx="1.5"',
    round: '<rect x="22" y="36" width="20" height="10" rx="1.5"',
  }[shape];
  const capY = shape === 'wine' ? 4 : shape === 'tall' ? 6 : shape === 'small' ? 9 : 7;
  return (
    sh(shape === 'round' ? 17 : 13) +
    `<path d="${d}" fill="${glass}" ${s}/>` +
    `${lab} fill="${label}" ${s}/>` +
    `<rect x="${shape === 'small' ? 28 : 27}" y="${capY}" width="${shape === 'small' ? 8 : 10}" height="5" rx="1.5" fill="${cap}" ${s}/>` +
    shine(shape === 'round' ? 22 : 26, shape === 'round' ? 34 : 40, 1.4, 5, 0)
  );
};

const squeeze = (c: string, label: string) =>
  sh(14) +
  `<path d="M28 6H36L37 12H27Z" fill="${c}" ${s}/>` +
  `<path d="M24 18L27 12H37L40 18C44 20 46 24 46 28V52C46 55 44 57 41 57H23C20 57 18 55 18 52V28C18 24 20 20 24 18Z" fill="${c}" ${s}/>` +
  `<rect x="22" y="32" width="20" height="14" rx="2" fill="${label}" ${s}/>` +
  shine(23, 26, 1.5, 4, 0);

const pot = (broth: string) =>
  `<g class="art-steam">${[24, 32, 40].map((x) => `<path d="M${x} 18C${x - 3} 13 ${x + 3} 10 ${x} 4" fill="none" stroke="#9fb3c8" stroke-width="2.4" stroke-linecap="round"/>`).join('')}</g>` +
  sh(22) +
  `<rect x="5" y="30" width="8" height="5" rx="2" fill="#61759a" ${s}/><rect x="51" y="30" width="8" height="5" rx="2" fill="#61759a" ${s}/>` +
  `<path d="M12 26H52V50C52 54 49 56 45 56H19C15 56 12 54 12 50Z" fill="#4b5d78" ${s}/>` +
  `<ellipse cx="32" cy="26" rx="20" ry="4" fill="${broth}" ${s}/>` +
  `<path d="M17 34V48" stroke="#fff" stroke-opacity=".3" stroke-width="3" stroke-linecap="round"/>`;

const LIQUID: Record<string, string> = {
  'aceite-oliva': bottle('tall', '#a9b93e', '#fffdf6', '#3f6a2a'),
  'aceite-virgen': bottle('tall', '#8fa52e', '#3f6a2a', '#2c4a1e'),
  'aceite-girasol': bottle('tall', '#f4d55a', '#fffdf6', '#e3a92a'),
  'vino-blanco': bottle('wine', '#c8d6a0', '#fffdf6', '#d9b44a'),
  'vino-tinto': bottle('wine', '#4a2030', '#f3e8dc', '#7a2235'),
  jerez: bottle('wine', '#b5782e', '#fffdf6', '#3a2620'),
  vinagre: bottle('small', '#c9a85a', '#fffdf6', '#3f6fb5'),
  cerveza: bottle('small', '#8a5a2a', '#f2c54a', '#c0392b'),
  conac: bottle('round', '#b9772e', '#f3e8dc', '#3a2620'),
  ron: bottle('round', '#8a4a1e', '#f3e8dc', '#2c1a12'),
  soja: bottle('small', '#3a2620', '#fffdf6', '#c0392b'),
  miel:
    sh(16) +
    `<rect x="18" y="12" width="28" height="9" rx="2" fill="#c98a1e" ${s}/>` +
    `<path d="M22 21V25C22 28 25 28 25 25V21" fill="#f0b43a" ${s}/>` +
    `<path d="M16 26C16 22 18 21 22 21H42C46 21 48 22 48 26V50C48 54 45 57 41 57H23C19 57 16 54 16 50Z" fill="#f0b43a" ${s}/>` +
    `<rect x="22" y="34" width="20" height="12" rx="2" fill="#fffdf6" ${s}/>` +
    `<path d="M27 40H37" stroke="#c98a1e" stroke-width="2" stroke-linecap="round"/>` +
    shine(21, 30, 1.5, 4, 0),
  agua:
    sh(15) +
    `<path d="M18 12H46L42 54C42 56 40 57 38 57H26C24 57 22 56 22 54Z" fill="#e7f3fc" ${s}/>` +
    `<path d="M19.6 26H44.4L42 54C42 56 40 57 38 57H26C24 57 22 56 22 54Z" fill="#9cccf0"/>` +
    `<path d="M18 12H46L42 54C42 56 40 57 38 57H26C24 57 22 56 22 54Z" ${n}/>` +
    shine(25, 38, 1.5, 8, -5),
  'caldo-pollo': pot('#f2cf6a'),
  'caldo-pescado': pot('#e8e0c8'),
  'caldo-verduras': pot('#b8cf72'),
  'caldo-carne': pot('#a8703e'),
  'tomate-frito': carton('#d8392b', '#d8392b'),
  'tomate-triturado': can('#d8392b', `<circle cx="32" cy="38" r="6" fill="#ef5a43" stroke="#fff" stroke-width="1.5"/>`),
  'leche-coco': can('#f6f3ea', `<circle cx="32" cy="38" r="6" fill="#8a5a36"/><circle cx="32" cy="38" r="3.5" fill="#fff"/>`),
  mayonesa: jar('#f7efd2', '#3f6fb5'),
  mostaza: squeeze('#f2c230', '#fffdf6'),
  ketchup: squeeze('#d8392b', '#fffdf6'),
};

/* ---------------- Harinas y repostería ---------------- */

const SWEET: Record<string, string> = {
  azucar: bowl('#ffffff', 'cube', '#f4f7fb'),
  'azucar-moreno': bowl('#b57a3d', 'grain', '#8f5a28'),
  'azucar-glas':
    bowl(
      '#ffffff',
      'crumb',
      '#e3e9f1',
    ),
  'harina-fuerza': GRAINS.harina.replace(BOWL, '#c0392b'),
  'harina-maiz': GRAINS.harina.replace(BOWL, '#e3a92a'),
  maicena: GRAINS.harina.replace(BOWL, '#e3a92a').replace('#f4ede0', '#fbf7ec'),
  levadura:
    sh(16) +
    `<path d="M14 18H50V50C50 52 48 54 46 54H18C16 54 14 52 14 50Z" fill="#d8392b" ${s}/>` +
    `<path d="M14 18L18 14H46L50 18" ${n}/>` +
    `<rect x="14" y="30" width="36" height="10" fill="#f2c230" ${s}/>`,
  'levadura-fresca':
    sh(18) +
    `<path d="M12 30L22 24H52L42 30Z" fill="#f2e6c6" ${s}/><path d="M12 30H42V48H12Z" fill="#e8d6a6" ${s}/><path d="M42 30L52 24V42L42 48Z" fill="#d8c08a" ${s}/>`,
  chocolate:
    sh(21) +
    `<rect x="10" y="18" width="44" height="34" rx="3" fill="#6b3f28" ${s}/>` +
    `<path d="M24.6 18V52M39.3 18V52M10 29.3H54M10 40.6H54" stroke="#4a2a1a" stroke-width="2"/>` +
    `<path d="M38 52L54 36V50C54 51 53 52 52 52Z" fill="#cfd8e3" ${s}/>`,
  cacao: jar('#6b3f28', '#c0392b'),
  gelatina:
    sh(20) +
    `<rect x="12" y="20" width="36" height="26" rx="2" fill="#f2dcc8" fill-opacity=".85" ${s} transform="rotate(-8 30 33)"/>` +
    `<rect x="18" y="26" width="36" height="26" rx="2" fill="#f6e6d6" fill-opacity=".9" ${s} transform="rotate(6 36 39)"/>` +
    `<path d="M22 34L48 38M22 40L48 44" stroke="#e3c4a8" stroke-width="1.4"/>`,
  almendras: bowl('#c48d5a', 'bean', '#a8703e'),
  nueces: FRUIT.nuez,
  avellanas: bowl('#b9824e', 'ball', '#9a6838'),
  pinones: bowl('#f2e3c0', 'bean', '#e3cd98'),
  cacahuetes: bowl('#d8ae6a', 'bean', '#c4924c'),
  pasas: bowl('#5a2d3a', 'ball', '#6e3a48'),
  vainilla: SPICE.vainilla,
};

/* ---------------- Genéricos ---------------- */

const GENERIC: Record<string, string> = {
  cuenco:
    thick('M42 6L36 30', '#c9965a', 3) +
    `<ellipse cx="43" cy="7" rx="5" ry="3.5" fill="#c9965a" ${s} transform="rotate(-15 43 7)"/>` +
    bowl('#cfdae6', 'crumb', '#a8b8cb'),
  plato:
    sh(24) +
    `<ellipse cx="32" cy="40" rx="26" ry="14" fill="#fbfdff" ${s}/><ellipse cx="32" cy="38" rx="16" ry="8" fill="#e6eef6"/>` +
    g('translate(32 34) scale(.45) translate(-32 -37)', tomatoBody('#e5483a')),
};

export const FOOD_ART: Record<string, string> = {
  ...VEG,
  ...FRUIT,
  ...MEAT,
  ...SEA,
  ...DAIRY,
  ...GRAINS,
  ...SPICE,
  ...LIQUID,
  ...SWEET,
  ...GENERIC,
};
