import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Ingredient, Recipe, RecipeDraft, RecipeItem, UnitId } from '../types';
import { DEFAULT_SERVINGS } from '../config';
import { delKV, getKV, newId, setKV } from '../lib/db';
import { amountText } from '../lib/units';
import { IngredientPicker } from '../components/IngredientPicker';
import { QuantitySheet, type QuantityTarget } from '../components/QuantitySheet';
import { StepsEditor } from '../components/StepsEditor';
import { PhotoPicker } from '../components/PhotoPicker';
import { Icon } from '../components/Icon';
import { Btn, ConfirmDialog, MoveButtons, RoundBtn, Stepper, TopBar, moveItem } from '../components/ui';
import { fmtMinutes } from '../data/courses';
import { CoursePicker } from '../components/CoursePicker';
import { FoodArt } from '../components/FoodArt';
import { normalizeDraft, stepsMinutes } from '../lib/migrate';

const blank = (): RecipeDraft => ({
  name: '',
  course: undefined,
  minutes: undefined,
  notes: '',
  servings: DEFAULT_SERVINGS,
  items: [],
  steps: [{ text: '' }],
  photo: undefined,
});

const fromRecipe = (r: Recipe): RecipeDraft => ({
  name: r.name,
  course: r.course,
  minutes: r.minutes,
  notes: r.notes ?? '',
  servings: r.servings,
  items: r.items,
  steps: r.steps.length ? r.steps : [{ text: '' }],
  photo: r.photo,
});

export const draftKey = (id?: string) => (id ? `draft:${id}` : 'draft:new');

type Pending = { mode: 'add'; ing: Ingredient } | { mode: 'edit'; key: string };

export function Editor({
  recipe,
  onBack,
  onSave,
}: {
  recipe?: Recipe;
  onBack: () => void;
  onSave: (draft: RecipeDraft) => Promise<void>;
}) {
  const key = draftKey(recipe?.id);
  const [form, setForm] = useState<RecipeDraft | null>(null);
  const [restored, setRestored] = useState(false);
  const [saved, setSaved] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pending, setPending] = useState<Pending | null>(null);
  const [toRemove, setToRemove] = useState<RecipeItem | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [ordering, setOrdering] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const recipeRef = useRef(recipe);
  const finished = useRef(false); // tras guardar, deja de autoguardar el borrador

  // Cargar: primero lo que se quedó a medias, si lo hay.
  useEffect(() => {
    let alive = true;
    getKV<RecipeDraft>(key).then((d) => {
      if (!alive) return;
      const r = recipeRef.current;
      const draft = d ? normalizeDraft(d) : null;
      if (draft && (draft.name || draft.items.length || draft.steps.some((s) => s.text.trim()) || draft.photo)) {
        setForm(draft);
        setRestored(true);
      } else {
        setForm(r ? fromRecipe(r) : blank());
      }
    });
    return () => {
      alive = false;
    };
  }, [key]);

  // Autoguardado: medio segundo después de cada cambio.
  useEffect(() => {
    if (!form || finished.current) return;
    setSaved(false);
    const t = setTimeout(() => {
      if (!finished.current) setKV(key, form).then(() => setSaved(true));
    }, 500);
    return () => clearTimeout(t);
  }, [form, key]);

  const update = useCallback((patch: Partial<RecipeDraft>) => setForm((f) => (f ? { ...f, ...patch } : f)), []);

  const editingItem = pending?.mode === 'edit' ? form?.items.find((i) => i.key === pending.key) : undefined;
  const qtyTarget = useMemo<QuantityTarget | null>(
    () =>
      pending?.mode === 'add'
        ? { ...pending.ing }
        : editingItem
          ? { ...editingItem, editing: true }
          : null,
    [pending, editingItem],
  );

  if (!form) {
    return (
      <>
        <TopBar title={recipe ? 'Cambiar receta' : 'Receta nueva'} onBack={onBack} />
        <main className="page">
          <p className="hint">Abriendo…</p>
        </main>
      </>
    );
  }

  const confirmQty = (qty: number, unit: UnitId) => {
    if (pending?.mode === 'add') {
      const ing = pending.ing;
      const item: RecipeItem = {
        key: newId(),
        ingredientId: ing.id,
        name: ing.name,
        art: ing.art,
        qty,
        unit,
        units: ing.units,
        piece: ing.piece,
        fine: ing.fine,
      };
      update({ items: [...form.items, item] });
    } else if (pending?.mode === 'edit') {
      update({ items: form.items.map((i) => (i.key === pending.key ? { ...i, qty, unit } : i)) });
    }
    setPending(null);
  };

  const finish = async () => {
    if (!form.name.trim()) {
      setNameError(true);
      nameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      nameRef.current?.focus({ preventScroll: true });
      return;
    }
    setSaving(true);
    setSaveError(null);
    finished.current = true;
    try {
      await onSave({
        ...form,
        name: form.name.trim(),
        notes: form.notes?.trim() || undefined,
        steps: form.steps.filter((s) => s.text.trim()).map((s) => ({ text: s.text.trim(), minutes: s.minutes })),
        minutes: stepsMinutes(form.steps) || form.minutes,
      });
      await delKV(key);
    } catch (e) {
      finished.current = false;
      setSaveError(e instanceof Error ? e.message : 'No se ha podido guardar. Prueba otra vez.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <TopBar title={recipe ? 'Cambiar receta' : 'Receta nueva'} onBack={onBack} />
      <main className="page editor">
        <p className={`autosave${saved ? ' autosave-ok' : ''}`} aria-live="polite">
          <Icon name={saved ? 'check' : 'refresh'} size={20} />
          {saved ? 'Todo guardado en el móvil' : 'Guardando…'}
        </p>

        {restored && (
          <div className="banner">
            <p>He recuperado lo que estabas escribiendo la última vez.</p>
            <Btn variant="quiet" icon="refresh" onClick={() => setConfirmReset(true)}>
              Empezar de cero
            </Btn>
          </div>
        )}

        <section className="card section" aria-labelledby="s-name">
          <h2 id="s-name" className="section-title">
            <span className="section-num" aria-hidden="true">1</span>
            ¿Cómo se llama el plato?
          </h2>
          <label htmlFor="recipe-name" className="sr-only">
            Nombre del plato
          </label>
          <input
            ref={nameRef}
            id="recipe-name"
            className={`input input-big${nameError ? ' input-error' : ''}`}
            placeholder="Por ejemplo: Tortilla de patatas"
            value={form.name}
            autoComplete="off"
            autoCapitalize="sentences"
            aria-invalid={nameError}
            aria-describedby={nameError ? 'name-error' : undefined}
            onChange={(e) => {
              setNameError(false);
              update({ name: e.target.value });
            }}
          />
          {nameError && (
            <p id="name-error" className="field-error">
              Escribe un nombre para poder guardar la receta.
            </p>
          )}
        </section>

        <section className="card section" aria-labelledby="s-course">
          <h2 id="s-course" className="section-title">
            <span className="section-num" aria-hidden="true">2</span>
            ¿En qué sección del libro va?
          </h2>
          <CoursePicker value={form.course} onChange={(course) => update({ course })} />
        </section>

        <section className="card section" aria-labelledby="s-servings">
          <h2 id="s-servings" className="section-title">
            <span className="section-num" aria-hidden="true">3</span>
            Raciones y tiempo
          </h2>
          <p className="field-label">Personas</p>
          <Stepper
            label="personas"
            value={form.servings}
            min={1}
            max={20}
            onChange={(v) => update({ servings: v })}
            render={(v) => (
              <span className="qty-amount">
                {v} {v === 1 ? 'persona' : 'personas'}
              </span>
            )}
          />
          <div className="total-time" aria-live="polite">
            <Icon name="clock" size={28} />
            <div>
              <p className="total-time-value">
                {stepsMinutes(form.steps)
                  ? fmtMinutes(stepsMinutes(form.steps))
                  : form.minutes
                    ? fmtMinutes(form.minutes)
                    : 'Sin tiempo todavía'}
              </p>
              <p className="hint">
                {stepsMinutes(form.steps)
                  ? 'Es la suma del tiempo de cada paso.'
                  : 'Pon el tiempo de cada paso más abajo y aquí verás el total.'}
              </p>
            </div>
          </div>
        </section>

        <section className="card section" aria-labelledby="s-ing">
          <h2 id="s-ing" className="section-title">
            <span className="section-num" aria-hidden="true">4</span>
            Ingredientes
          </h2>
          {form.items.length > 0 ? (
            <>
              <div className="list-tools">
                <p className="hint">
                  {ordering ? 'Usa las flechas para ponerlos en el orden en que se usan.' : 'Toca un ingrediente para cambiar la cantidad.'}
                </p>
                {form.items.length > 1 && (
                  <Btn variant={ordering ? 'primary' : 'quiet'} icon={ordering ? 'check' : 'order'} onClick={() => setOrdering((o) => !o)}>
                    {ordering ? 'Listo' : 'Ordenar'}
                  </Btn>
                )}
              </div>
              <ul className="items">
                {form.items.map((it, idx) => (
                  <li key={it.key} className="item">
                    {ordering ? (
                      <>
                        <div className="item-main item-static">
                          <FoodArt art={it.art} emoji={it.emoji} size={50} />
                          <span className="item-text">
                            <span className="item-name">{it.name}</span>
                            <span className="item-amount">{amountText(it.qty, it.unit, it.piece)}</span>
                          </span>
                        </div>
                        <MoveButtons
                          index={idx}
                          total={form.items.length}
                          label={it.name}
                          onMove={(from, to) => update({ items: moveItem(form.items, from, to) })}
                        />
                      </>
                    ) : (
                      <>
                        <button type="button" className="item-main" onClick={() => setPending({ mode: 'edit', key: it.key })}>
                          <FoodArt art={it.art} emoji={it.emoji} size={50} />
                          <span className="item-text">
                            <span className="item-name">{it.name}</span>
                            <span className="item-amount">{amountText(it.qty, it.unit, it.piece)}</span>
                          </span>
                          <span className="item-edit" aria-hidden="true">
                            <Icon name="pencil" size={22} />
                          </span>
                        </button>
                        <RoundBtn icon="trash" label={`Quitar ${it.name}`} onClick={() => setToRemove(it)} />
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="hint">Aún no hay ingredientes. Pulsa el botón para elegir el primero.</p>
          )}
          <Btn variant="secondary" block big icon="plus" onClick={() => setPickerOpen(true)}>
            Añadir ingrediente
          </Btn>
        </section>

        <section className="card section" aria-labelledby="s-steps">
          <h2 id="s-steps" className="section-title">
            <span className="section-num" aria-hidden="true">5</span>
            Cómo se prepara
          </h2>
          <p className="hint">Escribe cada paso en su caja, o pulsa «Dictar» y díselo al móvil. Si un paso lleva tiempo (freír, hornear, reposar…), apúntalo: en el modo cocina tendrás un temporizador.</p>
          <StepsEditor steps={form.steps} onChange={(steps) => update({ steps })} />
        </section>

        <section className="card section" aria-labelledby="s-notes">
          <h2 id="s-notes" className="section-title">
            <span className="section-num" aria-hidden="true">6</span>
            Notas y trucos
          </h2>
          <label htmlFor="recipe-notes" className="hint">
            De quién es la receta, qué cambiarías la próxima vez, con qué servirla…
          </label>
          <textarea
            id="recipe-notes"
            className="textarea"
            rows={4}
            value={form.notes ?? ''}
            onChange={(e) => update({ notes: e.target.value })}
          />
        </section>

        <section className="card section" aria-labelledby="s-photo">
          <h2 id="s-photo" className="section-title">
            <span className="section-num" aria-hidden="true">7</span>
            Foto del plato
          </h2>
          <PhotoPicker photo={form.photo} onChange={(photo) => update({ photo })} />
        </section>

        {saveError && (
          <p className="notice" role="alert">
            {saveError}
          </p>
        )}
      </main>

      <div className="savebar">
        <Btn variant="primary" big block onClick={finish} disabled={saving}>
          {saving ? 'Guardando…' : '✅ Finalizar y guardar receta'}
        </Btn>
      </div>

      <IngredientPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={(ing) => {
          setPickerOpen(false);
          setPending({ mode: 'add', ing });
        }}
      />
      <QuantitySheet target={qtyTarget} onClose={() => setPending(null)} onConfirm={confirmQty} />
      <ConfirmDialog
        open={toRemove !== null}
        title={`¿Quitar ${toRemove?.name.toLowerCase() ?? ''} de la receta?`}
        onCancel={() => setToRemove(null)}
        onConfirm={() => {
          if (toRemove) update({ items: form.items.filter((i) => i.key !== toRemove.key) });
          setToRemove(null);
        }}
        confirmLabel="Sí, quitarlo"
      />
      <ConfirmDialog
        open={confirmReset}
        title="¿Empezar de cero?"
        message="Se borrará lo que tenías a medias."
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          setForm(recipe ? fromRecipe(recipe) : blank());
          setRestored(false);
          setConfirmReset(false);
          delKV(key);
        }}
      />
    </>
  );
}
