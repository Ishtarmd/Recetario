import type { Recipe, RecipeDraft, RecipeItem, Step } from '../types';
import { COURSE_RENAMES } from '../data/courses';
import { findIngredient } from '../data/ingredients';

/**
 * Pone al día recetas guardadas con versiones anteriores de la app
 * (pasos sin tiempo, secciones antiguas, emojis en vez de dibujos).
 */

export function normalizeSteps(steps: unknown): Step[] {
  if (!Array.isArray(steps)) return [];
  return steps.map((s) =>
    typeof s === 'string'
      ? { text: s }
      : { text: String((s as Step)?.text ?? ''), minutes: Number((s as Step)?.minutes) || undefined },
  );
}

function normalizeItem(it: RecipeItem): RecipeItem {
  if (it.art) return it;
  const ing = findIngredient(it.ingredientId, it.name);
  return ing ? { ...it, art: ing.art } : it;
}

export const stepsMinutes = (steps: Step[]) => steps.reduce((t, s) => t + (s.minutes ?? 0), 0);

export function normalizeRecipe(r: Recipe): Recipe {
  const steps = normalizeSteps(r.steps);
  const sum = stepsMinutes(steps);
  return {
    ...r,
    course: r.course ? (COURSE_RENAMES[r.course] ?? r.course) : undefined,
    items: (r.items ?? []).map(normalizeItem),
    steps,
    minutes: sum || r.minutes,
    servings: r.servings || 2,
  };
}

export function normalizeDraft(d: RecipeDraft): RecipeDraft {
  return {
    ...d,
    course: d.course ? (COURSE_RENAMES[d.course] ?? d.course) : undefined,
    items: (d.items ?? []).map(normalizeItem),
    steps: normalizeSteps(d.steps).length ? normalizeSteps(d.steps) : [{ text: '' }],
  };
}
