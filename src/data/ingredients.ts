import type { Category, CategoryId, Ingredient, UnitId } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'verduras', name: 'Verduras y hortalizas', art: 'zanahoria' },
  { id: 'frutas', name: 'Frutas y frutos secos', art: 'manzana' },
  { id: 'carnes', name: 'Carnes y aves', art: 'filete-ternera' },
  { id: 'embutidos', name: 'Embutidos y curados', art: 'chorizo' },
  { id: 'pescados', name: 'Pescados y mariscos', art: 'merluza' },
  { id: 'huevos', name: 'Huevos y lácteos', art: 'huevo' },
  { id: 'legumbres', name: 'Arroz, legumbres, pasta y pan', art: 'garbanzos' },
  { id: 'especias', name: 'Especias y hierbas', art: 'pimenton-dulce' },
  { id: 'liquidos', name: 'Aceites, vinos, caldos y salsas', art: 'aceite-oliva' },
  { id: 'despensa', name: 'Harinas y repostería', art: 'harina' },
  { id: 'mias', name: 'Mis ingredientes', art: 'cuenco' },
];

type Extra = { piece?: [string, string]; fine?: boolean };
type Row = [name: string, art: string, units: UnitId[], extra?: Extra];

function group(category: CategoryId, groupName: string, rows: Row[]): Ingredient[] {
  return rows.map(([name, art, units, extra]) => ({
    id: `${category}-${slug(name)}`,
    name,
    art,
    units,
    category,
    group: groupName,
    ...extra,
  }));
}

export function slug(s: string) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Unidades habituales
const PIEZA: UnitId[] = ['ud', 'g', 'kg'];
const PESO: UnitId[] = ['g', 'kg'];
const PESO_PIEZA: UnitId[] = ['g', 'kg', 'ud'];
const ESPECIA: UnitId[] = ['pizca', 'cdta', 'cda', 'g', 'gusto'];
const HIERBA: UnitId[] = ['ud', 'cda', 'cdta', 'pizca', 'gusto'];
const LIQUIDO: UnitId[] = ['ml', 'vaso', 'cda', 'l'];
const BOTE: [string, string] = ['bote', 'botes'];
const LATA: [string, string] = ['lata', 'latas'];
const FILETE: [string, string] = ['filete', 'filetes'];

export const BASE_INGREDIENTS: Ingredient[] = [
  /* ---------- Verduras ---------- */
  ...group('verduras', 'Bulbos y raíces', [
    ['Cebolla', 'cebolla', PIEZA],
    ['Cebolla morada', 'cebolla-morada', PIEZA],
    ['Cebolleta', 'cebolleta', PIEZA],
    ['Ajo', 'ajo', ['ud', 'cdta'], { piece: ['diente', 'dientes'] }],
    ['Cabeza de ajos', 'ajo', ['ud'], { piece: ['cabeza', 'cabezas'] }],
    ['Puerro', 'puerro', PIEZA],
    ['Patata', 'patata', PIEZA],
    ['Patata nueva', 'patata', PESO_PIEZA],
    ['Boniato', 'boniato', PIEZA],
    ['Zanahoria', 'zanahoria', PIEZA],
    ['Remolacha', 'remolacha', PIEZA],
    ['Nabo', 'nabo', PIEZA],
    ['Jengibre fresco', 'jengibre', ['g', 'cdta'], { fine: true }],
  ]),
  ...group('verduras', 'Tomates y pimientos', [
    ['Tomate', 'tomate', PIEZA],
    ['Tomate pera', 'tomate-pera', PIEZA],
    ['Tomate cherry', 'tomate-cherry', ['ud', 'g']],
    ['Pimiento rojo', 'pimiento-rojo', PIEZA],
    ['Pimiento verde', 'pimiento-verde', PIEZA],
    ['Pimiento amarillo', 'pimiento-amarillo', PIEZA],
    ['Pimiento italiano', 'pimiento-italiano', PIEZA],
    ['Pimientos del piquillo', 'piquillo', ['ud', 'g'], { piece: ['pimiento', 'pimientos'] }],
    ['Guindilla fresca', 'guindilla', ['ud'], { piece: ['guindilla', 'guindillas'] }],
  ]),
  ...group('verduras', 'Calabacín, berenjena y calabaza', [
    ['Calabacín', 'calabacin', PIEZA],
    ['Berenjena', 'berenjena', PIEZA],
    ['Pepino', 'pepino', PIEZA],
    ['Calabaza', 'calabaza', PESO],
  ]),
  ...group('verduras', 'Hojas y coles', [
    ['Lechuga', 'lechuga', PIEZA],
    ['Rúcula', 'rucula', ['g', 'ud'], { piece: ['puñado', 'puñados'] }],
    ['Espinacas', 'espinacas', ['g', 'ud'], { piece: ['puñado', 'puñados'] }],
    ['Acelgas', 'acelgas', PESO_PIEZA, { piece: ['manojo', 'manojos'] }],
    ['Repollo', 'repollo', PESO_PIEZA],
    ['Lombarda', 'lombarda', PESO_PIEZA],
    ['Brócoli', 'brocoli', PIEZA],
    ['Coliflor', 'coliflor', PIEZA],
    ['Apio', 'apio', ['ud', 'g'], { piece: ['rama', 'ramas'] }],
  ]),
  ...group('verduras', 'Vainas, espárragos y otras', [
    ['Judías verdes', 'judia-verde', PESO],
    ['Guisantes', 'guisantes', ['g', 'taza']],
    ['Habas', 'habas', PESO],
    ['Alcachofas', 'alcachofa', ['ud', 'g'], { piece: ['alcachofa', 'alcachofas'] }],
    ['Espárragos verdes', 'esparrago-verde', ['ud', 'g'], { piece: ['manojo', 'manojos'] }],
    ['Espárragos blancos', 'esparrago-blanco', ['ud', 'g'], { piece: ['espárrago', 'espárragos'] }],
    ['Maíz dulce', 'maiz', ['g', 'ud'], { piece: LATA }],
    ['Champiñones', 'champinon', ['g', 'ud']],
    ['Setas variadas', 'setas', PESO],
    ['Aguacate', 'aguacate', PIEZA],
  ]),

  /* ---------- Frutas ---------- */
  ...group('frutas', 'Frutas', [
    ['Limón', 'limon', ['ud', 'cda'], { piece: ['limón', 'limones'] }],
    ['Naranja', 'naranja', PIEZA],
    ['Manzana', 'manzana', PIEZA],
    ['Pera', 'pera', PIEZA],
    ['Plátano', 'platano', PIEZA],
    ['Fresas', 'fresa', ['g', 'ud']],
  ]),
  ...group('frutas', 'Frutos secos', [
    ['Almendras', 'almendras', ['g', 'taza']],
    ['Almendra molida', 'almendras', ['g', 'cda']],
    ['Nueces', 'nueces', ['g', 'ud', 'taza']],
    ['Avellanas', 'avellanas', ['g', 'taza']],
    ['Piñones', 'pinones', ['g', 'cda']],
    ['Cacahuetes', 'cacahuetes', ['g', 'taza']],
    ['Pasas', 'pasas', ['g', 'cda']],
  ]),

  /* ---------- Carnes ---------- */
  ...group('carnes', 'Carne picada', [
    ['Carne picada de ternera', 'picada-ternera', PESO],
    ['Carne picada de cerdo', 'picada-cerdo', PESO],
    ['Carne picada mixta (ternera y cerdo)', 'picada-mixta', PESO],
    ['Carne picada de pollo', 'picada-pollo', PESO],
    ['Carne picada de pavo', 'picada-pavo', PESO],
    ['Carne picada de cordero', 'picada-cordero', PESO],
  ]),
  ...group('carnes', 'Ternera', [
    ['Filetes de ternera', 'filete-ternera', ['ud', 'g'], { piece: FILETE }],
    ['Ternera para guisar', 'carne-guisar', PESO],
    ['Morcillo de ternera', 'carne-guisar', PESO],
    ['Aguja de ternera', 'carne-guisar', PESO],
    ['Redondo de ternera', 'solomillo', PESO_PIEZA],
    ['Solomillo de ternera', 'solomillo', PESO_PIEZA],
    ['Entrecot', 'filete-ternera', ['ud', 'g'], { piece: ['entrecot', 'entrecots'] }],
    ['Carrillada de ternera', 'carne-guisar', ['ud', 'g'], { piece: ['carrillada', 'carrilladas'] }],
    ['Rabo de toro', 'carne-guisar', PESO],
    ['Osobuco', 'filete-ternera', ['ud', 'g'], { piece: ['rodaja', 'rodajas'] }],
  ]),
  ...group('carnes', 'Cerdo', [
    ['Filetes de lomo de cerdo', 'filete-cerdo', ['ud', 'g'], { piece: FILETE }],
    ['Lomo de cerdo en pieza', 'solomillo', PESO_PIEZA],
    ['Solomillo de cerdo', 'solomillo', ['ud', 'g'], { piece: ['solomillo', 'solomillos'] }],
    ['Chuletas de cerdo', 'chuleta', ['ud', 'g'], { piece: ['chuleta', 'chuletas'] }],
    ['Costillas de cerdo', 'costillas', PESO],
    ['Secreto ibérico', 'filete-cerdo', PESO],
    ['Presa ibérica', 'filete-cerdo', PESO],
    ['Carrillada de cerdo', 'carne-guisar', ['ud', 'g'], { piece: ['carrillada', 'carrilladas'] }],
    ['Cerdo para guisar', 'carne-guisar', PESO],
    ['Manitas de cerdo', 'hueso', ['ud'], { piece: ['manita', 'manitas'] }],
  ]),
  ...group('carnes', 'Pollo y pavo', [
    ['Pollo entero', 'pollo-entero', ['ud', 'kg'], { piece: ['pollo', 'pollos'] }],
    ['Pollo troceado', 'muslo', PESO],
    ['Pechuga de pollo', 'pechuga', ['ud', 'g'], { piece: ['pechuga', 'pechugas'] }],
    ['Filetes de pechuga', 'pechuga', ['ud', 'g'], { piece: FILETE }],
    ['Muslos de pollo', 'muslo', ['ud', 'g'], { piece: ['muslo', 'muslos'] }],
    ['Contramuslos de pollo', 'contramuslo', ['ud', 'g'], { piece: ['contramuslo', 'contramuslos'] }],
    ['Alitas de pollo', 'alitas', ['g', 'ud'], { piece: ['alita', 'alitas'] }],
    ['Pechuga de pavo', 'pechuga', ['g', 'ud'], { piece: FILETE }],
  ]),
  ...group('carnes', 'Cordero y conejo', [
    ['Chuletillas de cordero', 'chuletillas', ['ud', 'g'], { piece: ['chuletilla', 'chuletillas'] }],
    ['Pierna de cordero', 'carne-cordero', ['kg', 'ud'], { piece: ['pierna', 'piernas'] }],
    ['Paletilla de cordero', 'carne-cordero', ['ud', 'kg'], { piece: ['paletilla', 'paletillas'] }],
    ['Cordero para guisar', 'carne-guisar', PESO],
    ['Conejo troceado', 'conejo', ['ud', 'kg'], { piece: ['conejo', 'conejos'] }],
  ]),

  /* ---------- Embutidos ---------- */
  ...group('embutidos', 'Embutidos', [
    ['Chorizo', 'chorizo', ['ud', 'g'], { piece: ['chorizo', 'chorizos'] }],
    ['Chorizo para cocer', 'chorizo', ['ud', 'g'], { piece: ['chorizo', 'chorizos'] }],
    ['Morcilla', 'morcilla', ['ud', 'g'], { piece: ['morcilla', 'morcillas'] }],
    ['Salchichas', 'salchichas', ['ud', 'g'], { piece: ['salchicha', 'salchichas'] }],
  ]),
  ...group('embutidos', 'Jamón y curados', [
    ['Jamón serrano', 'jamon-serrano', ['g', 'ud'], { piece: ['loncha', 'lonchas'] }],
    ['Taquitos de jamón', 'jamon-serrano', ['g']],
    ['Jamón york', 'jamon-york', ['ud', 'g'], { piece: ['loncha', 'lonchas'] }],
    ['Lacón', 'jamon', PESO],
    ['Bacon', 'bacon', ['g', 'ud'], { piece: ['loncha', 'lonchas'] }],
    ['Panceta', 'panceta', ['g', 'ud'], { piece: ['tira', 'tiras'] }],
    ['Tocino', 'panceta', ['g', 'ud'], { piece: ['trozo', 'trozos'] }],
  ]),
  ...group('embutidos', 'Huesos para caldo', [
    ['Hueso de jamón', 'hueso', ['ud'], { piece: ['hueso', 'huesos'] }],
    ['Hueso de ternera (caña)', 'hueso', ['ud'], { piece: ['hueso', 'huesos'] }],
    ['Espinazo de cerdo', 'hueso', ['ud', 'g'], { piece: ['trozo', 'trozos'] }],
    ['Carcasa de pollo', 'pollo-entero', ['ud'], { piece: ['carcasa', 'carcasas'] }],
  ]),

  /* ---------- Pescados ---------- */
  ...group('pescados', 'Pescado blanco', [
    ['Merluza', 'merluza', ['g', 'ud', 'kg'], { piece: ['rodaja', 'rodajas'] }],
    ['Lomos de merluza', 'merluza', ['ud', 'g'], { piece: ['lomo', 'lomos'] }],
    ['Bacalao fresco', 'bacalao', ['g', 'ud'], { piece: ['lomo', 'lomos'] }],
    ['Bacalao desalado', 'bacalao-desalado', ['g', 'ud'], { piece: ['lomo', 'lomos'] }],
    ['Rape', 'rape', ['g', 'kg']],
    ['Lubina', 'lubina', ['ud', 'g'], { piece: ['lubina', 'lubinas'] }],
    ['Dorada', 'dorada', ['ud', 'g'], { piece: ['dorada', 'doradas'] }],
    ['Lenguado', 'lenguado', ['ud', 'g'], { piece: ['lenguado', 'lenguados'] }],
    ['Gallo', 'lenguado', ['ud', 'g'], { piece: ['gallo', 'gallos'] }],
  ]),
  ...group('pescados', 'Pescado azul', [
    ['Salmón', 'salmon', ['g', 'ud'], { piece: ['lomo', 'lomos'] }],
    ['Atún fresco', 'atun', PESO],
    ['Bonito', 'bonito', PESO],
    ['Emperador', 'emperador', ['ud', 'g'], { piece: ['rodaja', 'rodajas'] }],
    ['Sardinas', 'sardinas', ['ud', 'g'], { piece: ['sardina', 'sardinas'] }],
    ['Boquerones', 'boquerones', PESO],
    ['Caballa', 'caballa', ['ud', 'g'], { piece: ['caballa', 'caballas'] }],
  ]),
  ...group('pescados', 'Marisco', [
    ['Gambas', 'gambas', PESO],
    ['Langostinos', 'langostinos', ['g', 'kg', 'ud']],
    ['Cigalas', 'cigalas', ['ud', 'g'], { piece: ['cigala', 'cigalas'] }],
    ['Mejillones', 'mejillones', ['kg', 'g']],
    ['Almejas', 'almejas', PESO],
    ['Berberechos', 'berberechos', PESO],
  ]),
  ...group('pescados', 'Calamar, sepia y pulpo', [
    ['Calamares', 'calamar', PESO],
    ['Chipirones', 'calamar', PESO],
    ['Sepia', 'sepia', PESO],
    ['Pulpo', 'pulpo', ['kg', 'g']],
  ]),
  ...group('pescados', 'Conservas', [
    ['Atún en lata', 'atun-lata', ['ud', 'g'], { piece: LATA }],
    ['Sardinas en lata', 'sardinas-lata', ['ud'], { piece: LATA }],
    ['Anchoas', 'anchoas', ['ud', 'g'], { piece: ['filete', 'filetes'] }],
    ['Mejillones en escabeche', 'mejillones-lata', ['ud'], { piece: LATA }],
  ]),

  /* ---------- Huevos y lácteos ---------- */
  ...group('huevos', 'Huevos', [
    ['Huevo', 'huevo', ['ud'], { piece: ['huevo', 'huevos'] }],
    ['Huevo campero', 'huevo-moreno', ['ud'], { piece: ['huevo', 'huevos'] }],
    ['Claras de huevo', 'claras', ['ud', 'ml'], { piece: ['clara', 'claras'] }],
    ['Yemas de huevo', 'yemas', ['ud'], { piece: ['yema', 'yemas'] }],
  ]),
  ...group('huevos', 'Leche y nata', [
    ['Leche entera', 'leche', ['ml', 'vaso', 'taza', 'l', 'cda']],
    ['Leche semidesnatada', 'leche-semi', ['ml', 'vaso', 'taza', 'l', 'cda']],
    ['Leche evaporada', 'leche-evaporada', ['ml', 'ud'], { piece: ['bote', 'botes'] }],
    ['Nata para cocinar', 'nata', ['ml', 'cda', 'ud'], { piece: ['brik', 'briks'] }],
    ['Nata para montar', 'nata-montar', ['ml', 'ud'], { piece: ['brik', 'briks'] }],
  ]),
  ...group('huevos', 'Quesos', [
    ['Queso rallado', 'queso-rallado', ['g', 'cda', 'taza']],
    ['Queso manchego', 'queso-manchego', ['g', 'ud'], { piece: ['cuña', 'cuñas'] }],
    ['Queso en lonchas', 'queso', ['ud', 'g'], { piece: ['loncha', 'lonchas'] }],
    ['Queso parmesano', 'parmesano', ['g', 'cda']],
    ['Queso fresco', 'queso-fresco', ['g', 'ud'], { piece: ['tarrina', 'tarrinas'] }],
    ['Mozzarella', 'mozzarella', ['ud', 'g'], { piece: ['bola', 'bolas'] }],
    ['Queso de cabra', 'queso-cabra', ['g', 'ud'], { piece: ['rulo', 'rulos'] }],
    ['Queso crema', 'queso-crema', ['g', 'cda']],
  ]),
  ...group('huevos', 'Yogur y mantequilla', [
    ['Yogur natural', 'yogur', ['ud', 'g'], { piece: ['yogur', 'yogures'] }],
    ['Yogur griego', 'yogur-griego', ['ud', 'g'], { piece: ['yogur', 'yogures'] }],
    ['Mantequilla', 'mantequilla', ['g', 'cda']],
    ['Margarina', 'margarina', ['g', 'cda']],
  ]),

  /* ---------- Arroz, legumbres, pasta y pan ---------- */
  ...group('legumbres', 'Arroz', [
    ['Arroz redondo', 'arroz', ['g', 'vaso', 'taza']],
    ['Arroz bomba', 'arroz-bomba', ['g', 'vaso', 'taza']],
    ['Arroz largo', 'arroz', ['g', 'vaso', 'taza']],
    ['Arroz integral', 'arroz-integral', ['g', 'vaso', 'taza']],
  ]),
  ...group('legumbres', 'Legumbres', [
    ['Garbanzos secos', 'garbanzos', ['g']],
    ['Garbanzos cocidos', 'garbanzos', ['ud', 'g'], { piece: BOTE }],
    ['Lentejas pardinas', 'lentejas', ['g', 'vaso']],
    ['Lentejas cocidas', 'lentejas', ['ud', 'g'], { piece: BOTE }],
    ['Alubias blancas', 'alubias-blancas', ['g', 'ud'], { piece: BOTE }],
    ['Alubias pintas', 'alubias-pintas', ['g', 'ud'], { piece: BOTE }],
    ['Quinoa', 'quinoa', ['g', 'vaso']],
  ]),
  ...group('legumbres', 'Pasta', [
    ['Macarrones', 'macarrones', ['g']],
    ['Espaguetis', 'espaguetis', ['g']],
    ['Tallarines', 'tallarines', ['g', 'ud'], { piece: ['nido', 'nidos'] }],
    ['Fideos finos', 'fideos', ['g', 'taza']],
    ['Fideos gruesos (fideuá)', 'fideua', ['g']],
    ['Placas de lasaña', 'lasana', ['ud', 'g'], { piece: ['placa', 'placas'] }],
    ['Placas de canelones', 'canelones', ['ud'], { piece: ['placa', 'placas'] }],
    ['Cuscús', 'cuscus', ['g', 'vaso']],
  ]),
  ...group('legumbres', 'Pan y cereales', [
    ['Pan', 'pan', ['ud', 'g'], { piece: ['rebanada', 'rebanadas'] }],
    ['Barra de pan', 'pan', ['ud'], { piece: ['barra', 'barras'] }],
    ['Pan de molde', 'pan-molde', ['ud'], { piece: ['rebanada', 'rebanadas'] }],
    ['Pan rallado', 'pan-rallado', ['g', 'cda', 'taza']],
    ['Copos de avena', 'avena', ['g', 'taza', 'cda']],
  ]),

  /* ---------- Especias y hierbas ---------- */
  ...group('especias', 'Sal y pimienta', [
    ['Sal', 'sal', ESPECIA, { fine: true }],
    ['Sal gorda', 'sal-gorda', ['pizca', 'cda', 'g', 'gusto'], { fine: true }],
    ['Pimienta negra molida', 'pimienta', ESPECIA, { fine: true }],
    ['Pimienta en grano', 'pimienta-grano', ['ud', 'cdta', 'pizca'], { piece: ['grano', 'granos'], fine: true }],
    ['Pimienta blanca', 'pimienta-blanca', ESPECIA, { fine: true }],
  ]),
  ...group('especias', 'Especias', [
    ['Pimentón dulce', 'pimenton-dulce', ESPECIA, { fine: true }],
    ['Pimentón picante', 'pimenton-picante', ESPECIA, { fine: true }],
    ['Azafrán', 'azafran', ['pizca', 'g', 'gusto'], { fine: true }],
    ['Colorante alimentario', 'colorante', ['pizca', 'cdta', 'ud'], { fine: true, piece: ['sobre', 'sobres'] }],
    ['Comino', 'comino', ESPECIA, { fine: true }],
    ['Cúrcuma', 'curcuma', ESPECIA, { fine: true }],
    ['Curry', 'curry', ESPECIA, { fine: true }],
    ['Canela en rama', 'canela', ['ud'], { piece: ['rama', 'ramas'] }],
    ['Canela molida', 'canela-molida', ['cdta', 'pizca', 'g'], { fine: true }],
    ['Nuez moscada', 'nuez-moscada', ['pizca', 'cdta'], { fine: true }],
    ['Clavo', 'clavo', ['ud'], { piece: ['clavo', 'clavos'] }],
    ['Anís estrellado', 'anis', ['ud'], { piece: ['estrella', 'estrellas'] }],
    ['Jengibre molido', 'jengibre-molido', ESPECIA, { fine: true }],
    ['Ajo en polvo', 'ajo-polvo', ESPECIA, { fine: true }],
    ['Guindilla seca', 'guindilla', ['ud', 'pizca'], { piece: ['guindilla', 'guindillas'] }],
    ['Sésamo', 'sesamo', ['cda', 'cdta', 'g'], { fine: true }],
    ['Pastilla de caldo', 'pastilla', ['ud'], { piece: ['pastilla', 'pastillas'] }],
  ]),
  ...group('especias', 'Hierbas', [
    ['Laurel', 'laurel', ['ud'], { piece: ['hoja', 'hojas'] }],
    ['Perejil', 'perejil', HIERBA, { piece: ['ramita', 'ramitas'] }],
    ['Cilantro', 'cilantro', HIERBA, { piece: ['ramita', 'ramitas'] }],
    ['Albahaca', 'albahaca', HIERBA, { piece: ['hoja', 'hojas'] }],
    ['Hierbabuena', 'hierbabuena', HIERBA, { piece: ['hoja', 'hojas'] }],
    ['Orégano', 'oregano', ESPECIA, { fine: true }],
    ['Tomillo', 'tomillo', ['ud', 'cdta', 'pizca'], { piece: ['ramita', 'ramitas'], fine: true }],
    ['Romero', 'romero', ['ud', 'cdta', 'pizca'], { piece: ['ramita', 'ramitas'], fine: true }],
    ['Eneldo', 'eneldo', HIERBA, { piece: ['ramita', 'ramitas'] }],
    ['Hierbas provenzales', 'hierbas-provenzales', ESPECIA, { fine: true }],
  ]),

  /* ---------- Aceites, vinos, caldos y salsas ---------- */
  ...group('liquidos', 'Aceites y vinagres', [
    ['Aceite de oliva', 'aceite-oliva', ['cda', 'ml', 'vaso', 'gusto']],
    ['Aceite de oliva virgen extra', 'aceite-virgen', ['cda', 'ml', 'vaso', 'gusto']],
    ['Aceite de girasol', 'aceite-girasol', ['ml', 'cda', 'vaso']],
    ['Vinagre de vino', 'vinagre', ['cda', 'ml', 'cdta']],
    ['Vinagre de Jerez', 'vinagre', ['cda', 'ml', 'cdta']],
  ]),
  ...group('liquidos', 'Vinos y licores', [
    ['Vino blanco', 'vino-blanco', LIQUIDO],
    ['Vino tinto', 'vino-tinto', LIQUIDO],
    ['Vino fino o de Jerez', 'jerez', LIQUIDO],
    ['Cerveza', 'cerveza', ['ml', 'ud', 'vaso'], { piece: ['botellín', 'botellines'] }],
    ['Coñac o brandy', 'conac', ['ml', 'cda', 'vaso']],
    ['Ron', 'ron', ['ml', 'cda']],
  ]),
  ...group('liquidos', 'Agua y caldos', [
    ['Agua', 'agua', ['ml', 'vaso', 'l']],
    ['Caldo de pollo', 'caldo-pollo', ['ml', 'l', 'vaso']],
    ['Caldo de pescado', 'caldo-pescado', ['ml', 'l', 'vaso']],
    ['Caldo de verduras', 'caldo-verduras', ['ml', 'l', 'vaso']],
    ['Caldo de carne', 'caldo-carne', ['ml', 'l', 'vaso']],
  ]),
  ...group('liquidos', 'Tomate y salsas', [
    ['Tomate frito', 'tomate-frito', ['ml', 'cda', 'g', 'ud'], { piece: ['brik', 'briks'] }],
    ['Tomate triturado', 'tomate-triturado', ['g', 'ud'], { piece: LATA }],
    ['Leche de coco', 'leche-coco', ['ml', 'ud'], { piece: LATA }],
    ['Salsa de soja', 'soja', ['cda', 'cdta', 'ml']],
    ['Mayonesa', 'mayonesa', ['cda', 'g']],
    ['Mostaza', 'mostaza', ['cdta', 'cda']],
    ['Ketchup', 'ketchup', ['cda', 'g']],
    ['Miel', 'miel', ['cda', 'cdta', 'g']],
  ]),

  /* ---------- Harinas y repostería ---------- */
  ...group('despensa', 'Harinas', [
    ['Harina de trigo', 'harina', ['g', 'cda', 'taza']],
    ['Harina de fuerza', 'harina-fuerza', ['g', 'taza']],
    ['Harina de maíz', 'harina-maiz', ['g', 'taza']],
    ['Maicena', 'maicena', ['cda', 'cdta', 'g']],
  ]),
  ...group('despensa', 'Azúcares', [
    ['Azúcar', 'azucar', ['g', 'cda', 'cdta', 'taza']],
    ['Azúcar moreno', 'azucar-moreno', ['g', 'cda', 'taza']],
    ['Azúcar glas', 'azucar-glas', ['g', 'cda']],
  ]),
  ...group('despensa', 'Repostería', [
    ['Levadura química (polvo de hornear)', 'levadura', ['ud', 'g', 'cdta'], { piece: ['sobre', 'sobres'], fine: true }],
    ['Levadura fresca de panadería', 'levadura-fresca', ['g', 'ud'], { piece: ['pastilla', 'pastillas'], fine: true }],
    ['Gelatina en hojas', 'gelatina', ['ud'], { piece: ['hoja', 'hojas'] }],
    ['Esencia de vainilla', 'vainilla', ['cdta', 'ud'], { piece: ['vaina', 'vainas'] }],
    ['Chocolate negro', 'chocolate', ['g', 'ud'], { piece: ['onza', 'onzas'] }],
    ['Cacao en polvo', 'cacao', ['cda', 'g']],
  ]),
];

export function normalize(s: string) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

export function findIngredient(id: string, name?: string): Ingredient | undefined {
  const byId = BASE_INGREDIENTS.find((i) => i.id === id);
  if (byId || !name) return byId;
  const n = normalize(name);
  return BASE_INGREDIENTS.find((i) => normalize(i.name) === n) ?? BASE_INGREDIENTS.find((i) => normalize(i.name).startsWith(n));
}

export function makeCustomIngredient(name: string): Ingredient {
  const clean = name.trim().replace(/\s+/g, ' ');
  const pretty = clean.charAt(0).toUpperCase() + clean.slice(1);
  return {
    id: `mias-${slug(clean)}`,
    name: pretty,
    art: 'cuenco',
    category: 'mias',
    group: 'Añadidos por ti',
    units: ['g', 'ud', 'ml', 'cda', 'pizca', 'gusto'],
    custom: true,
  };
}
