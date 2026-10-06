import type { Recipe } from '../types';
import { amountText, niceAmount } from './units';
import { fmtMinutes } from '../data/courses';
import { USER_NAME } from '../config';

/** Ficha limpia de la receta para enviar por WhatsApp. */
export function recipeAsText(recipe: Recipe, servings: number) {
  const factor = servings / recipe.servings;
  const lines: string[] = [];
  lines.push(`🍽️ *${recipe.name}*`);
  const time = fmtMinutes(recipe.minutes);
  lines.push(`Para ${servings} ${servings === 1 ? 'persona' : 'personas'}${time ? ` · ${time}` : ''}`);
  if (recipe.items.length) {
    lines.push('', '*Ingredientes*');
    for (const it of recipe.items) {
      const qty = it.unit === 'gusto' ? 0 : niceAmount(it.qty * factor, it.unit);
      lines.push(`• ${it.name}: ${amountText(qty, it.unit, it.piece).toLowerCase()}`);
    }
  }
  const steps = recipe.steps.filter((s) => s.text.trim());
  if (steps.length) {
    lines.push('', '*Cómo se hace*');
    steps.forEach((s, i) => lines.push(`${i + 1}. ${s.text.trim()}${s.minutes ? ` (${fmtMinutes(s.minutes)})` : ''}`));
  }
  if (recipe.notes?.trim()) lines.push('', '*Notas*', recipe.notes.trim());
  lines.push('', `— Del recetario de ${USER_NAME}`);
  return lines.join('\n');
}

export function whatsappLink(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
