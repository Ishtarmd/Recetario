import type { CSSProperties } from 'react';
import type { Recipe } from '../types';
import { tap } from '../lib/device';

/** Número estable a partir del id: el mismo libro tiene siempre el mismo color y tamaño. */
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function bookLook(r: Recipe) {
  const h = hash(r.id);
  return {
    color: `var(--book-${(h % 6) + 1})`,
    height: 80 + ((h >>> 4) % 19), // % del hueco de la balda
    width: 3.5 + ((h >>> 9) % 5) * 0.25, // rem
  };
}

export interface ShelfGroup {
  id: string;
  name: string;
  list: Recipe[];
}

/** Cada sección del libro es una balda; cada receta, un libro con su lomo. */
export function Shelf({ groups, onPick }: { groups: ShelfGroup[]; onPick: (r: Recipe, spine: HTMLElement) => void }) {
  return (
    <div className="shelves">
      {groups.map((g) => (
        <section key={g.id} className="shelf-group" aria-labelledby={`shelf-${g.id}`}>
          <h2 id={`shelf-${g.id}`} className="shelf-label">
            {g.name}
            <span className="group-count">{g.list.length}</span>
          </h2>
          <div className="shelf">
            {g.list.map((r) => {
              const look = bookLook(r);
              return (
                <div key={r.id} className="spine-slot">
                  <button
                    type="button"
                    className={`spine${r.favorite ? ' spine-fav' : ''}${r.name.length > 16 ? ' spine-long' : ''}`}
                    style={
                      {
                        '--c': look.color,
                        height: `${look.height}%`,
                        width: `${look.width}rem`,
                      } as CSSProperties
                    }
                    aria-label={`${r.name}${r.favorite ? ', favorita' : ''}. Abrir la receta`}
                    title={r.name}
                    data-spine={r.id}
                    onClick={(e) => {
                      tap(20);
                      onPick(r, e.currentTarget);
                    }}
                  >
                    <span className="spine-band" aria-hidden="true" />
                    <span className="spine-title" aria-hidden="true">
                      {r.name}
                    </span>
                    {r.favorite && (
                      <span className="spine-star" aria-hidden="true">
                        ★
                      </span>
                    )}
                    <span className="spine-band" aria-hidden="true" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
