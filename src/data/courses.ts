import type { Course } from '../types';

/** Secciones del libro, en el orden de un recetario clásico. */
export const DEFAULT_COURSES: Course[] = [
  { id: 'desayunos', name: 'Desayunos y meriendas' },
  { id: 'aperitivos', name: 'Aperitivos y tapas' },
  { id: 'ensaladas', name: 'Ensaladas' },
  { id: 'sopas', name: 'Sopas y cremas' },
  { id: 'cuchara', name: 'Legumbres y guisos de cuchara' },
  { id: 'arroces', name: 'Arroces' },
  { id: 'pastas', name: 'Pastas' },
  { id: 'huevos', name: 'Huevos y tortillas' },
  { id: 'verduras', name: 'Verduras y hortalizas' },
  { id: 'carnes', name: 'Carnes y aves' },
  { id: 'pescados', name: 'Pescados y mariscos' },
  { id: 'masas', name: 'Panes, masas y empanadas' },
  { id: 'salsas', name: 'Salsas y guarniciones' },
  { id: 'postres', name: 'Postres y dulces' },
];

/** Secciones de versiones anteriores de la app → sección actual. */
export const COURSE_RENAMES: Record<string, string> = {
  entrantes: 'aperitivos',
  principales: 'carnes',
  guarniciones: 'verduras',
};

/** "1 h 15 min", "45 min" */
export function fmtMinutes(m?: number) {
  if (!m) return '';
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (!h) return `${r} min`;
  return r ? `${h} h ${r} min` : `${h} h`;
}
