import type { UnitId } from '../types';

interface UnitInfo {
  singular: string;
  plural: string;
  /** Nombre corto para el botón de elegir unidad. */
  chip: string;
  step: number;
  max: number;
  start: number;
}

export const UNITS: Record<UnitId, UnitInfo> = {
  ud: { singular: 'unidad', plural: 'unidades', chip: 'Piezas', step: 1, max: 24, start: 1 },
  g: { singular: 'gramo', plural: 'gramos', chip: 'Gramos', step: 25, max: 2000, start: 200 },
  kg: { singular: 'kilo', plural: 'kilos', chip: 'Kilos', step: 0.25, max: 5, start: 1 },
  ml: { singular: 'mililitro', plural: 'mililitros', chip: 'Mililitros', step: 25, max: 2000, start: 250 },
  l: { singular: 'litro', plural: 'litros', chip: 'Litros', step: 0.25, max: 5, start: 1 },
  cda: { singular: 'cucharada', plural: 'cucharadas', chip: 'Cucharadas', step: 0.5, max: 12, start: 1 },
  cdta: { singular: 'cucharadita', plural: 'cucharaditas', chip: 'Cucharaditas', step: 0.5, max: 12, start: 1 },
  vaso: { singular: 'vaso', plural: 'vasos', chip: 'Vasos', step: 0.5, max: 8, start: 1 },
  taza: { singular: 'taza', plural: 'tazas', chip: 'Tazas', step: 0.5, max: 8, start: 1 },
  pizca: { singular: 'pizca', plural: 'pizcas', chip: 'Pizcas', step: 1, max: 6, start: 1 },
  gusto: { singular: 'al gusto', plural: 'al gusto', chip: 'Al gusto', step: 0, max: 0, start: 0 },
};

/** Paso y máximo de la barra según la unidad y si el ingrediente se usa en poca cantidad. */
export function rangeFor(unit: UnitId, fine?: boolean) {
  const u = UNITS[unit];
  if (unit === 'g' && fine) return { step: 5, max: 200, start: 5 };
  return { step: u.step, max: u.max, start: u.start };
}

export function chipLabel(unit: UnitId, piece?: [string, string]) {
  if (unit === 'ud' && piece) return cap(piece[1]);
  return UNITS[unit].chip;
}

const FRACTIONS: [number, string][] = [
  [0.25, '¼'],
  [0.5, '½'],
  [0.75, '¾'],
  [1 / 3, '⅓'],
  [2 / 3, '⅔'],
];

/** 1.5 → "1 ½", 0.25 → "¼", 250 → "250". */
export function fmtNumber(n: number): string {
  if (Number.isInteger(n) || n >= 20) return String(Math.round(n));
  const whole = Math.floor(n);
  const frac = n - whole;
  const match = FRACTIONS.find(([v]) => Math.abs(v - frac) < 0.04);
  if (match) return whole ? `${whole} ${match[1]}` : match[1];
  return n.toFixed(1).replace('.', ',');
}

/** Redondea una cantidad escalada a algo que se pueda medir en casa. */
export function niceAmount(n: number, unit: UnitId): number {
  if (unit === 'g' || unit === 'ml') {
    if (n >= 100) return Math.round(n / 5) * 5;
    if (n >= 10) return Math.round(n);
    return Math.max(1, Math.round(n));
  }
  if (unit === 'pizca') return Math.max(1, Math.round(n));
  if (unit === 'ud') return Math.max(0.5, Math.round(n * 2) / 2);
  return Math.max(0.25, Math.round(n * 4) / 4);
}

export function unitWord(qty: number, unit: UnitId, piece?: [string, string]) {
  if (unit === 'gusto') return 'al gusto';
  if (unit === 'ud' && piece) return qty <= 1 ? piece[0] : piece[1];
  return qty <= 1 ? UNITS[unit].singular : UNITS[unit].plural;
}

export function amountText(qty: number, unit: UnitId, piece?: [string, string]) {
  if (unit === 'gusto') return 'Al gusto';
  return `${fmtNumber(qty)} ${unitWord(qty, unit, piece)}`;
}

export function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
