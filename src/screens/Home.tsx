import { useState } from 'react';
import type { Recipe } from '../types';
import { normalize } from '../data/ingredients';
import { USER_NAME } from '../config';
import { Icon } from '../components/Icon';
import { RecipeList } from '../components/RecipeList';
import { Btn } from '../components/ui';

export function Home({
  recipes,
  hasDraft,
  onCreate,
  onBook,
  onOpen,
}: {
  recipes: Recipe[];
  hasDraft: boolean;
  onCreate: () => void;
  onBook: () => void;
  onOpen: (id: string) => void;
}) {
  const [query, setQuery] = useState('');
  const q = normalize(query);
  const found = q
    ? recipes.filter((r) => normalize(r.name).includes(q) || r.items.some((i) => normalize(i.name).includes(q)))
    : [];
  const favorites = recipes.filter((r) => r.favorite).sort((a, b) => a.name.localeCompare(b.name, 'es'));
  const recent = recipes.slice(0, 3);

  return (
    <main className="page home">
      <header className="hello">
        <p className="hello-pot" aria-hidden="true">
          <Icon name="pot" size={34} />
        </p>
        <h1 className="hello-title">¡Hola, {USER_NAME}!</h1>
        <p className="hello-sub">¿Qué receta quieres crear hoy?</p>
      </header>

      <div className="stack">
        <Btn variant="primary" big block icon="plus" onClick={onCreate}>
          {hasDraft ? 'Seguir con mi receta a medias' : 'Crear una nueva receta'}
        </Btn>
        <Btn variant="accent" big block icon="book" onClick={onBook}>
          Ver mi libro de recetas
        </Btn>
      </div>

      <section className="stack" aria-labelledby="home-search">
        <h2 id="home-search" className="h3">
          Buscar una receta
        </h2>
        <div className="search">
          <Icon name="search" />
          <label htmlFor="recipe-search" className="sr-only">
            Buscar una receta por su nombre o por un ingrediente
          </label>
          <input
            id="recipe-search"
            type="search"
            placeholder="Nombre o ingrediente"
            value={query}
            autoComplete="off"
            enterKeyHint="search"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {q &&
          (found.length ? (
            <RecipeList recipes={found} onOpen={onOpen} />
          ) : (
            <p className="hint">No encuentro ninguna receta con «{query.trim()}».</p>
          ))}
      </section>

      {!q && favorites.length > 0 && (
        <section className="stack" aria-labelledby="home-fav">
          <h2 id="home-fav" className="h3">
            Tus favoritas
          </h2>
          <RecipeList recipes={favorites} onOpen={onOpen} />
        </section>
      )}

      {!q && recent.length > 0 && (
        <section className="stack" aria-labelledby="home-recent">
          <h2 id="home-recent" className="h3">
            Las últimas que has guardado
          </h2>
          <RecipeList recipes={recent} onOpen={onOpen} />
        </section>
      )}

      {!q && recipes.length === 0 && (
        <p className="empty-note">
          Todavía no hay recetas en tu libro. Pulsa <strong>Crear una nueva receta</strong> para guardar la primera.
        </p>
      )}
    </main>
  );
}
