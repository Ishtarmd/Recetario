import { useEffect, useMemo, useState } from 'react';
import type { CategoryId, Ingredient } from '../types';
import { BASE_INGREDIENTS, CATEGORIES, makeCustomIngredient, normalize } from '../data/ingredients';
import { getKV, setKV } from '../lib/db';
import { tap } from '../lib/device';
import { Icon } from './Icon';
import { Btn, Sheet } from './ui';
import { FoodArt } from './FoodArt';

const CUSTOM_KEY = 'customIngredients';

/** Buscador y catálogo de ingredientes por categorías. */
export function IngredientPicker({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (ing: Ingredient) => void;
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [custom, setCustom] = useState<Ingredient[]>([]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setCategory(null);
    getKV<Ingredient[]>(CUSTOM_KEY).then((list) =>
      // Los ingredientes propios de versiones antiguas no tenían dibujo.
      setCustom((list ?? []).map((i) => ({ ...i, art: i.art ?? 'cuenco', group: i.group ?? 'Añadidos por ti' }))),
    );
  }, [open]);

  const all = useMemo(() => [...BASE_INGREDIENTS, ...custom], [custom]);
  const q = normalize(query);
  const results = q ? all.filter((i) => normalize(i.name).includes(q)) : [];
  const exact = results.some((i) => normalize(i.name) === q);
  const inCategory = category ? all.filter((i) => i.category === category) : [];
  const categories = CATEGORIES.filter((c) => c.id !== 'mias' || custom.length > 0);
  const current = CATEGORIES.find((c) => c.id === category);

  const pick = (ing: Ingredient) => {
    tap();
    onPick(ing);
  };

  const addCustom = async () => {
    const ing = makeCustomIngredient(query);
    const next = [...custom.filter((c) => c.id !== ing.id), ing];
    setCustom(next);
    await setKV(CUSTOM_KEY, next);
    pick(ing);
  };

  return (
    <Sheet open={open} onClose={onClose} labelledBy="picker-title" full>
      <div className="picker">
        <div className="picker-head">
          <h2 id="picker-title" className="h2">
            Elige un ingrediente
          </h2>
          <Btn variant="quiet" icon="close" onClick={onClose}>
            Cerrar
          </Btn>
        </div>

        <div className="search">
          <Icon name="search" />
          <label htmlFor="ing-search" className="sr-only">
            Buscar ingrediente
          </label>
          <input
            id="ing-search"
            type="search"
            placeholder="Escribe, por ejemplo: tomate"
            value={query}
            autoComplete="off"
            enterKeyHint="search"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {q ? (
          <div className="picker-body">
            {results.length > 0 ? (
              <IngredientGrid list={results} onPick={pick} />
            ) : (
              <p className="hint">No tengo «{query.trim()}» en la lista, pero puedes añadirlo.</p>
            )}
            {!exact && query.trim().length > 1 && (
              <Btn variant="accent" block icon="plus" onClick={addCustom}>
                Añadir «{query.trim()}» como ingrediente nuevo
              </Btn>
            )}
          </div>
        ) : category ? (
          <div className="picker-body">
            <Btn variant="quiet" icon="back" onClick={() => setCategory(null)} className="self-start">
              Todas las categorías
            </Btn>
            <h3 className="h3 picker-cat-title">
              {current && <FoodArt art={current.art} size={44} />}
              {current?.name}
            </h3>
            {groupsOf(inCategory).map(([name, list]) => (
              <section key={name} className="ing-group" aria-label={name}>
                <h4 className="ing-group-title">{name}</h4>
                <IngredientGrid list={list} onPick={pick} />
              </section>
            ))}
          </div>
        ) : (
          <div className="picker-body">
            <p className="hint">O toca una categoría:</p>
            <div className="cat-grid">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className="cat-card"
                  onClick={() => {
                    tap();
                    setCategory(c.id);
                  }}
                >
                  <FoodArt art={c.art} size={68} className="pop" />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Sheet>
  );
}

function IngredientGrid({ list, onPick }: { list: Ingredient[]; onPick: (i: Ingredient) => void }) {
  return (
    <div className="ing-grid">
      {list.map((i) => (
        <button key={i.id} type="button" className="ing-tile" onClick={() => onPick(i)}>
          <FoodArt art={i.art} size={78} className="pop" />
          <span className="ing-name">{i.name}</span>
        </button>
      ))}
    </div>
  );
}

/** Agrupa por subgrupo manteniendo el orden de la lista. */
function groupsOf(list: Ingredient[]): [string, Ingredient[]][] {
  const map = new Map<string, Ingredient[]>();
  for (const i of list) {
    const key = i.group ?? 'Otros';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(i);
  }
  return [...map.entries()];
}
