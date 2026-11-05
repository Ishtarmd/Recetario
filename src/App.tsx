import { useCallback, useEffect, useRef, useState } from 'react';
import type { Recipe, RecipeDraft } from './types';
import { askForPersistence, deleteRecipe, getKV, isPersistent, listRecipes, newId, saveRecipe } from './lib/db';
import { loadCourses } from './lib/courses';
import { normalizeDraft } from './lib/migrate';
import { Home } from './screens/Home';
import { Book } from './screens/Book';
import { Editor, draftKey } from './screens/Editor';
import { Cook } from './screens/Cook';
import { Celebration } from './components/Celebration';
import { BookReader, type BookReaderHandle } from './components/BookReader';
import { TimerBar } from './components/TimerBar';
import { Toast } from './components/ui';

type Screen =
  | { name: 'home' }
  | { name: 'book' }
  | { name: 'editor'; id?: string }
  /** shelf: abierta desde la estantería, como un libro. */
  | { name: 'cook'; id: string; shelf?: { color: string; opened?: boolean } };

export default function App() {
  const [stack, setStack] = useState<Screen[]>([{ name: 'home' }]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [persistent, setPersistent] = useState(true);
  const [celebrate, setCelebrate] = useState<Recipe | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const pushed = useRef(0);
  const stackRef = useRef(stack);
  stackRef.current = stack;
  const reader = useRef<BookReaderHandle>(null);

  const top = stack[stack.length - 1];
  const inReader = top.name === 'cook' && !!top.shelf;

  const refresh = useCallback(async () => {
    setRecipes(await listRecipes());
    const raw = await getKV<RecipeDraft>(draftKey());
    const d = raw ? normalizeDraft(raw) : null;
    setHasDraft(!!d && !!(d.name || d.items.length || d.photo || d.steps.some((s) => s.text.trim())));
  }, []);

  useEffect(() => {
    (async () => {
      setPersistent(await isPersistent());
      await askForPersistence();
      await loadCourses();
      await refresh();
      setLoaded(true);
    })();
  }, [refresh]);

  const isReader = (s?: Screen) => s?.name === 'cook' && !!s.shelf;

  const popStack = useCallback(() => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
    refresh();
  }, [refresh]);

  // El botón «atrás» del móvil vuelve a la pantalla anterior (y cierra el libro con su animación).
  useEffect(() => {
    const onPop = async () => {
      pushed.current = Math.max(0, pushed.current - 1);
      const t = stackRef.current[stackRef.current.length - 1];
      if (isReader(t) && reader.current) await reader.current.close();
      else window.scrollTo({ top: 0 });
      popStack();
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [popStack]);

  const go = (next: Screen) => {
    setStack((s) => [...s, next]);
    try {
      history.pushState({ depth: stack.length }, '');
      pushed.current += 1;
    } catch {
      /* sin historial: el botón Volver sigue funcionando */
    }
    if (!isReader(next)) window.scrollTo({ top: 0 });
  };

  const back = async () => {
    if (stack.length <= 1) return;
    if (pushed.current > 0) {
      history.back(); // dispara popstate
      return;
    }
    if (isReader(top) && reader.current) await reader.current.close();
    else window.scrollTo({ top: 0 });
    popStack();
  };

  const resetTo = (next: Screen) => {
    setStack(next.name === 'home' ? [next] : [{ name: 'home' }, next]);
    window.scrollTo({ top: 0 });
  };

  const handleSave = async (draft: RecipeDraft, existing?: Recipe) => {
    const now = Date.now();
    const recipe: Recipe = existing
      ? { ...existing, ...draft, updatedAt: now }
      : { id: newId(), ...draft, createdAt: now, updatedAt: now };
    await saveRecipe(recipe);
    await refresh();
    setCelebrate(recipe);
  };

  const find = (id?: string) => (id ? recipes.find((r) => r.id === id) : undefined);

  const cookFor = (recipe: Recipe) => (
    <Cook
      key={recipe.id + recipe.updatedAt}
      recipe={recipe}
      onBack={back}
      onEdit={() => go({ name: 'editor', id: recipe.id })}
      onToast={setToast}
      onToggleFavorite={async () => {
        await saveRecipe({ ...recipe, favorite: !recipe.favorite });
        await refresh();
      }}
      onDelete={async () => {
        await deleteRecipe(recipe.id);
        await refresh();
        resetTo({ name: 'book' });
        setToast(`«${recipe.name}» se ha borrado.`);
      }}
    />
  );

  const renderScreen = (screen: Screen) => {
    switch (screen.name) {
      case 'home':
        return (
          <Home
            recipes={recipes}
            hasDraft={hasDraft}
            onCreate={() => go({ name: 'editor' })}
            onBook={() => go({ name: 'book' })}
            onOpen={(id) => go({ name: 'cook', id })}
          />
        );
      case 'book':
        return (
          <Book
            recipes={recipes}
            onBack={back}
            onOpen={(id) => go({ name: 'cook', id })}
            onOpenBook={(id, color) => go({ name: 'cook', id, shelf: { color } })}
            onCreate={() => go({ name: 'editor' })}
            onImported={async (msg) => {
              await refresh();
              setToast(msg);
            }}
          />
        );
      case 'editor': {
        const r = find(screen.id);
        return <Editor key={screen.id ?? 'new'} recipe={r} onBack={back} onSave={(draft) => handleSave(draft, r)} />;
      }
      case 'cook': {
        const r = find(screen.id);
        return r ? (
          cookFor(r)
        ) : (
          <main className="page">
            <p className="hint">Esta receta ya no está en el libro.</p>
          </main>
        );
      }
    }
  };

  if (!loaded) return <div className="loading" aria-busy="true" />;

  // Con un libro abierto, debajo sigue la estantería (para que se vea al cerrarlo).
  const base = inReader ? stack[stack.length - 2] : top;
  const readerRecipe = inReader && top.name === 'cook' ? find(top.id) : undefined;

  return (
    <div className="app">
      {!persistent && (
        <p className="warning" role="alert">
          Ojo: este navegador no deja guardar en el móvil. Las recetas se perderán al cerrar. Abre la app desde el icono
          de la pantalla de inicio.
        </p>
      )}

      {base && renderScreen(base)}

      {readerRecipe && top.name === 'cook' && top.shelf && (
        <BookReader
          key={readerRecipe.id}
          handle={reader}
          recipe={readerRecipe}
          color={top.shelf.color}
          instant={top.shelf.opened}
          findSpine={() => document.querySelector<HTMLElement>(`[data-spine="${readerRecipe.id}"]`)}
          onOpened={() =>
            setStack((s) =>
              s.map((x, i) => (i === s.length - 1 && x.name === 'cook' && x.shelf ? { ...x, shelf: { ...x.shelf, opened: true } } : x)),
            )
          }
        >
          {cookFor(readerRecipe)}
        </BookReader>
      )}

      {celebrate && (
        <Celebration
          name={celebrate.name}
          onOpen={() => {
            const id = celebrate.id;
            setCelebrate(null);
            resetTo({ name: 'cook', id });
          }}
          onHome={() => {
            setCelebrate(null);
            resetTo({ name: 'home' });
          }}
        />
      )}

      <TimerBar />
      <Toast message={toast} onDone={() => setToast(null)} />
    </div>
  );
}
