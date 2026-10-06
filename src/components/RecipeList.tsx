import type { Recipe } from '../types';
import { tap } from '../lib/device';
import { Thumb } from './ui';
import { fmtMinutes } from '../data/courses';

export function RecipeList({ recipes, onOpen }: { recipes: Recipe[]; onOpen: (id: string) => void }) {
  return (
    <ul className="recipe-list">
      {recipes.map((r) => (
        <li key={r.id}>
          <button
            type="button"
            className="recipe-row"
            onClick={() => {
              tap();
              onOpen(r.id);
            }}
          >
            <Thumb photo={r.photo} art={r.items[0]?.art} emoji={r.items[0]?.art ? undefined : r.items[0]?.emoji} />
            <span className="recipe-row-text">
              <span className="recipe-row-name">
                {r.favorite && (
                  <span className="recipe-row-star" aria-label="Favorita">
                    ★{' '}
                  </span>
                )}
                {r.name}
              </span>
              <span className="recipe-row-meta">
                {[
                  `${r.items.length} ${r.items.length === 1 ? 'ingrediente' : 'ingredientes'}`,
                  `para ${r.servings}`,
                  fmtMinutes(r.minutes),
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </span>
            </span>
            <span className="recipe-row-go" aria-hidden="true">
              ›
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
