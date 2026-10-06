import type { CourseId, Recipe, RecipeItem, Step, UnitId } from '../types';
import { BASE_INGREDIENTS } from './ingredients';

/** Recetas de ejemplo para probar la vista previa (no se cargan solas en la app instalada). */
function item(name: string, qty: number, unit: UnitId): RecipeItem {
  const ing = BASE_INGREDIENTS.find((i) => i.name === name);
  if (!ing) throw new Error(`Falta el ingrediente de ejemplo: ${name}`);
  return { key: `${ing.id}-${qty}`, ingredientId: ing.id, name, art: ing.art, qty, unit, units: ing.units, piece: ing.piece, fine: ing.fine };
}

const st = (text: string, minutes?: number): Step => ({ text, minutes });

function r(id: string, name: string, course: CourseId, servings: number, items: RecipeItem[], steps: Step[], favorite = false): Recipe {
  const minutes = steps.reduce((t, s) => t + (s.minutes ?? 0), 0) || undefined;
  return { id: `ejemplo-${id}`, name, course, minutes, servings, items, steps, favorite, notes: 'Receta de ejemplo: puedes borrarla cuando quieras.', createdAt: 0, updatedAt: 0 };
}

export const SAMPLE_RECIPES: Recipe[] = [
  r('tortilla', 'Tortilla de patatas', 'huevos', 4,
    [item('Huevo campero', 6, 'ud'), item('Patata', 750, 'g'), item('Cebolla', 1, 'ud'), item('Aceite de oliva virgen extra', 1, 'vaso'), item('Sal', 1, 'pizca')],
    [st('Pelar y cortar las patatas y la cebolla en láminas finas.', 10), st('Freír las patatas y la cebolla a fuego suave en abundante aceite.', 30), st('Escurrir y mezclar con los huevos batidos y la sal. Dejar reposar.', 5), st('Cuajar en la sartén, dar la vuelta con un plato y cuajar el otro lado.', 5)], true),
  r('lentejas', 'Lentejas estofadas', 'cuchara', 4,
    [item('Lentejas pardinas', 300, 'g'), item('Chorizo para cocer', 1, 'ud'), item('Zanahoria', 2, 'ud'), item('Ajo', 2, 'ud'), item('Pimentón dulce', 1, 'cdta'), item('Laurel', 1, 'ud')],
    [st('Rehogar el ajo y la zanahoria picados.', 5), st('Añadir el pimentón, las lentejas, el chorizo, el laurel y agua que las cubra.'), st('Cocer a fuego lento, removiendo de vez en cuando.', 45)]),
  r('gazpacho', 'Gazpacho andaluz', 'sopas', 4,
    [item('Tomate pera', 1, 'kg'), item('Pimiento verde', 1, 'ud'), item('Pepino', 1, 'ud'), item('Ajo', 1, 'ud'), item('Aceite de oliva virgen extra', 4, 'cda'), item('Vinagre de Jerez', 2, 'cda')],
    [st('Trocear las verduras.', 10), st('Triturar todo con el aceite, el vinagre y sal.', 5), st('Colar y enfriar en la nevera.', 60)]),
  r('albondigas', 'Albóndigas en salsa', 'carnes', 4,
    [item('Carne picada mixta (ternera y cerdo)', 500, 'g'), item('Huevo', 1, 'ud'), item('Pan rallado', 3, 'cda'), item('Ajo', 2, 'ud'), item('Perejil', 1, 'cda'), item('Cebolla', 1, 'ud'), item('Vino blanco', 100, 'ml'), item('Caldo de carne', 300, 'ml')],
    [st('Mezclar la carne con el huevo, el pan rallado, el ajo y el perejil picados.', 10), st('Formar las albóndigas, pasarlas por harina y dorarlas.', 15), st('Pochar la cebolla en el mismo aceite.', 10), st('Añadir el vino, el caldo y las albóndigas y cocer.', 20)], true),
  r('flan', 'Flan de huevo', 'postres', 6,
    [item('Huevo', 4, 'ud'), item('Leche entera', 500, 'ml'), item('Azúcar', 150, 'g')],
    [st('Hacer un caramelo con parte del azúcar y repartirlo en el molde.', 5), st('Batir los huevos con la leche y el resto del azúcar.', 5), st('Hornear al baño maría a 170 °C.', 50), st('Dejar enfriar y meter en la nevera.', 120)], true),
  r('ensaladilla', 'Ensaladilla rusa', 'aperitivos', 6,
    [item('Patata', 4, 'ud'), item('Zanahoria', 2, 'ud'), item('Atún en lata', 2, 'ud'), item('Huevo', 2, 'ud'), item('Mayonesa', 6, 'cda')],
    [st('Cocer las patatas, las zanahorias y los huevos.', 25), st('Picar todo y mezclar con el atún y la mayonesa.', 10)]),
  r('merluza', 'Merluza en salsa verde', 'pescados', 4,
    [item('Lomos de merluza', 4, 'ud'), item('Almejas', 250, 'g'), item('Ajo', 3, 'ud'), item('Perejil', 2, 'cda'), item('Vino blanco', 100, 'ml')],
    [st('Dorar el ajo en aceite y añadir una cucharada de harina.', 3), st('Incorporar el vino y el caldo, y luego la merluza y las almejas.', 8), st('Terminar con perejil picado.')]),
  r('bechamel', 'Bechamel', 'salsas', 4,
    [item('Mantequilla', 50, 'g'), item('Harina de trigo', 50, 'g'), item('Leche entera', 500, 'ml'), item('Nuez moscada', 1, 'pizca')],
    [st('Derretir la mantequilla y tostar la harina.', 3), st('Añadir la leche poco a poco sin dejar de remover.', 10)]),
];
