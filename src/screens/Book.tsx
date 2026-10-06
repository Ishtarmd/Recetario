import { useEffect, useRef, useState } from 'react';
import type { CourseId, Recipe } from '../types';
import { normalize } from '../data/ingredients';
import { useCourses } from '../lib/courses';
import { normalizeRecipe } from '../lib/migrate';
import { SAMPLE_RECIPES } from '../data/samples';
import { getKV, saveRecipe, setKV } from '../lib/db';
import { insideFrame, tap } from '../lib/device';
import { Icon } from '../components/Icon';
import { RecipeList } from '../components/RecipeList';
import { Btn, TopBar } from '../components/ui';
import { Shelf, bookLook } from '../components/Shelf';

type Filter = 'todas' | 'favoritas' | CourseId;
type View = 'estanteria' | 'lista';

const byName = (a: Recipe, b: Recipe) => a.name.localeCompare(b.name, 'es');

export function Book({
  recipes,
  onBack,
  onOpen,
  onOpenBook,
  onCreate,
  onImported,
}: {
  recipes: Recipe[];
  onBack: () => void;
  onOpen: (id: string) => void;
  onOpenBook: (id: string, color: string) => void;
  onCreate: () => void;
  onImported: (message: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('todas');
  const [view, setView] = useState<View>('estanteria');
  const courses = useCourses();
  const fileInput = useRef<HTMLInputElement>(null);
  const q = normalize(query);

  // Se recuerda si prefiere ver la estantería o la lista.
  useEffect(() => {
    getKV<View>('bookView').then((v) => v && setView(v));
  }, []);
  const changeView = (v: View) => {
    tap();
    setView(v);
    setKV('bookView', v);
  };

  const matches = (r: Recipe) =>
    !q || normalize(r.name).includes(q) || r.items.some((i) => normalize(i.name).includes(q));
  const visible = recipes
    .filter(matches)
    .filter((r) => (filter === 'todas' ? true : filter === 'favoritas' ? r.favorite : r.course === filter))
    .sort(byName);

  // Secciones del libro, en el orden de una comida; las que no tienen sección, al final.
  const known = new Set(courses.map((c) => c.id));
  const groups = [
    ...courses.map((c) => ({ id: c.id, name: c.name, list: visible.filter((r) => r.course === c.id) })),
    { id: 'sin', name: 'Sin sección', list: visible.filter((r) => !r.course || !known.has(r.course)) },
  ].filter((g) => g.list.length);

  const favCount = recipes.filter((r) => r.favorite).length;
  const usedCourses = courses.filter((c) => recipes.some((r) => r.course === c.id));

  const exportBackup = () => {
    tap();
    const data = JSON.stringify({ app: 'recetario', version: 2, exportedAt: new Date().toISOString(), recipes }, null, 2);
    const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `recetas-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const importBackup = async (file?: File) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const list: unknown[] = Array.isArray(parsed) ? parsed : parsed?.recipes;
      const valid = (list ?? []).filter(
        (r): r is Recipe =>
          !!r && typeof r === 'object' && typeof (r as Recipe).id === 'string' && typeof (r as Recipe).name === 'string',
      );
      if (!valid.length) throw new Error('vacío');
      const known = new Set(recipes.map((r) => r.id));
      let added = 0;
      for (const r of valid) {
        // Si ya existe, se queda la versión más reciente.
        const mine = recipes.find((x) => x.id === r.id);
        if (mine && mine.updatedAt >= r.updatedAt) continue;
        await saveRecipe(normalizeRecipe({ ...r, items: r.items ?? [], steps: r.steps ?? [], servings: r.servings || 2 }));
        if (!known.has(r.id)) added++;
      }
      onImported(added ? `Se han recuperado ${added} ${added === 1 ? 'receta' : 'recetas'}.` : 'Ya tenías todas esas recetas.');
    } catch {
      onImported('Ese archivo no es una copia de seguridad del recetario.');
    } finally {
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  return (
    <>
      <TopBar title="Mi libro de recetas" onBack={onBack} backLabel="Inicio" />
      <main className="page stack-lg">
        {recipes.length > 0 ? (
          <>
            <div className="search">
              <Icon name="search" />
              <label htmlFor="book-search" className="sr-only">
                Buscar en el libro
              </label>
              <input
                id="book-search"
                type="search"
                placeholder="Buscar por nombre o ingrediente"
                value={query}
                autoComplete="off"
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="segmented" role="radiogroup" aria-label="Cómo ver el libro">
              {(
                [
                  ['estanteria', 'Estantería'],
                  ['lista', 'Lista'],
                ] as [View, string][]
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={view === id}
                  className={view === id ? 'is-on' : ''}
                  onClick={() => changeView(id)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="filters" role="radiogroup" aria-label="Mostrar">
              {(
                [
                  ['todas', `Todas (${recipes.length})`],
                  ...(favCount ? [['favoritas', `★ Favoritas (${favCount})`]] : []),
                  ...usedCourses.map((c) => [c.id, c.name]),
                ] as [Filter, string][]
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={filter === id}
                  className={`chip${filter === id ? ' chip-on' : ''}`}
                  onClick={() => {
                    tap();
                    setFilter(id);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {groups.length && view === 'estanteria' ? (
              <>
                <p className="hint">Toca un libro para abrirlo.</p>
                <Shelf
                  groups={groups}
                  onPick={(recipe) => onOpenBook(recipe.id, bookLook(recipe).color)}
                />
              </>
            ) : groups.length ? (
              groups.map((g) => (
                <section key={g.id} className="stack" aria-labelledby={`g-${g.id}`}>
                  <h2 id={`g-${g.id}`} className="group-title">
                    {g.name}
                    <span className="group-count">{g.list.length}</span>
                  </h2>
                  <RecipeList recipes={g.list} onOpen={onOpen} />
                </section>
              ))
            ) : (
              <p className="hint">No hay ninguna receta que coincida.</p>
            )}
          </>
        ) : (
          <div className="empty-book">
            <span aria-hidden="true">📖</span>
            <p className="lead">Tu libro está esperando su primera receta.</p>
            <Btn variant="primary" big block icon="plus" onClick={onCreate}>
              Crear una nueva receta
            </Btn>
            {insideFrame() && (
              <Btn
                variant="secondary"
                block
                icon="book"
                onClick={async () => {
                  for (const r of SAMPLE_RECIPES) await saveRecipe({ ...r, createdAt: Date.now(), updatedAt: Date.now() });
                  onImported(`He puesto ${SAMPLE_RECIPES.length} recetas de ejemplo en la estantería.`);
                }}
              >
                Probar con recetas de ejemplo
              </Btn>
            )}
          </div>
        )}

        <section className="card section" aria-labelledby="backup">
          <h2 id="backup" className="section-title">
            Copia de seguridad
          </h2>
          <p className="hint">
            Guarda todas las recetas, con sus fotos, en un archivo. Si cambias de móvil, lo recuperas desde aquí.
          </p>
          {recipes.length > 0 && (
            <Btn variant="secondary" block icon="download" onClick={exportBackup}>
              Guardar copia de mis recetas
            </Btn>
          )}
          <Btn variant="quiet" block icon="upload" onClick={() => fileInput.current?.click()}>
            Recuperar recetas de una copia
          </Btn>
          {insideFrame() && <p className="hint">En esta vista previa no se pueden descargar archivos; en la app instalada sí.</p>}
          <input
            ref={fileInput}
            id="backup-file"
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => importBackup(e.target.files?.[0])}
          />
        </section>
      </main>
    </>
  );
}
