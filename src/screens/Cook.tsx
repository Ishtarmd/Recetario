import { useEffect, useState, type MouseEvent } from 'react';
import type { Recipe } from '../types';
import { amountText, niceAmount } from '../lib/units';
import { insideFrame, keepScreenOn, tap } from '../lib/device';
import { recipeAsText, whatsappLink } from '../lib/share';
import { Icon } from '../components/Icon';
import { Btn, ConfirmDialog, Stepper, TopBar } from '../components/ui';
import { fmtMinutes } from '../data/courses';
import { courseName } from '../lib/courses';
import { FoodArt } from '../components/FoodArt';
import { fmtClock, remaining, startTimer, stopTimer, useTimers } from '../lib/timers';

/** Modo cocina: lectura cómoda, casillas y cambio de raciones. */
export function Cook({
  recipe,
  onBack,
  onEdit,
  onDelete,
  onToast,
  onToggleFavorite,
}: {
  recipe: Recipe;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToast: (m: string) => void;
  onToggleFavorite: () => void;
}) {
  const [servings, setServings] = useState(recipe.servings);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [doneSteps, setDoneSteps] = useState<Set<number>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [timerToStop, setTimerToStop] = useState<string | null>(null);

  useEffect(() => {
    let release = () => {};
    keepScreenOn().then((r) => (release = r));
    return () => release();
  }, []);

  const factor = servings / recipe.servings;
  const steps = recipe.steps.filter((s) => s.text.trim());
  const timers = useTimers().filter((t) => t.recipeId === recipe.id);
  const marked = done.size + doneSteps.size;
  const shareText = recipeAsText(recipe, servings);

  const toggle = <T,>(set: Set<T>, v: T) => {
    tap(18);
    const next = new Set(set);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    return next;
  };

  const share = async (e: MouseEvent<HTMLAnchorElement>) => {
    tap();
    // En el móvil, el menú de compartir del sistema deja elegir WhatsApp directamente.
    if (typeof navigator.share === 'function' && !insideFrame()) {
      e.preventDefault();
      try {
        await navigator.share({ title: recipe.name, text: shareText });
      } catch {
        /* lo ha cancelado */
      }
    }
  };

  const copy = async () => {
    tap();
    try {
      await navigator.clipboard.writeText(shareText);
      onToast('Receta copiada. Ya puedes pegarla en WhatsApp.');
    } catch {
      onToast('No he podido copiarla. Usa el botón de WhatsApp.');
    }
  };

  return (
    <>
      <TopBar title="Modo cocina" onBack={onBack} />
      <main className="page cook">
        {recipe.photo && (
          <div className="cook-photo">
            <img src={recipe.photo} alt={`Foto de ${recipe.name}`} />
          </div>
        )}
        <div className="cook-head">
          <p className="eyebrow">{courseName(recipe.course)}</p>
          <h1 className="h1 cook-title">{recipe.name}</h1>
          <button
            type="button"
            className={`fav${recipe.favorite ? ' fav-on' : ''}`}
            aria-pressed={!!recipe.favorite}
            onClick={() => {
              tap();
              onToggleFavorite();
            }}
          >
            <Icon name="star" size={30} filled={recipe.favorite} />
            <span>{recipe.favorite ? 'Favorita' : 'Marcar como favorita'}</span>
          </button>
        </div>
        <dl className="meta">
          <div>
            <dt>Tiempo total</dt>
            <dd>{fmtMinutes(recipe.minutes) || 'Sin indicar'}</dd>
          </div>
          <div>
            <dt>Ingredientes</dt>
            <dd>{recipe.items.length}</dd>
          </div>
        </dl>

        <section className="card section" aria-labelledby="c-servings">
          <h2 id="c-servings" className="section-title">
            <Icon name="users" /> ¿Para cuántas personas cocinas?
          </h2>
          <Stepper
            label="personas"
            value={servings}
            min={1}
            max={24}
            onChange={setServings}
            render={(v) => (
              <span className="qty-amount">
                {v} {v === 1 ? 'persona' : 'personas'}
              </span>
            )}
          />
          <div className="row wrap">
            <button type="button" className="chip" onClick={() => (tap(), setServings(Math.max(1, Math.round(servings / 2))))}>
              La mitad
            </button>
            <button type="button" className="chip" onClick={() => (tap(), setServings(Math.min(24, servings * 2)))}>
              El doble
            </button>
            {servings !== recipe.servings && (
              <button type="button" className="chip chip-on" onClick={() => (tap(), setServings(recipe.servings))}>
                Como la receta ({recipe.servings})
              </button>
            )}
          </div>
          {servings !== recipe.servings && (
            <p className="hint">Las cantidades están recalculadas y redondeadas para que sean fáciles de medir.</p>
          )}
        </section>

        {recipe.items.length > 0 && (
          <section className="card section" aria-labelledby="c-ing">
            <h2 id="c-ing" className="section-title">
              Ingredientes
            </h2>
            <p className="hint">Marca cada uno cuando ya lo hayas echado.</p>
            <ul className="checklist">
              {recipe.items.map((it) => {
                const qty = it.unit === 'gusto' ? 0 : niceAmount(it.qty * factor, it.unit);
                const on = done.has(it.key);
                return (
                  <li key={it.key}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={on}
                      className={`check-row${on ? ' is-done' : ''}`}
                      onClick={() => setDone((d) => toggle(d, it.key))}
                    >
                      <span className="checkbox" aria-hidden="true">
                        {on && <Icon name="check" size={26} stroke={3.2} />}
                      </span>
                      <FoodArt art={it.art} emoji={it.emoji} size={52} />
                      <span className="check-text">
                        <span className="check-amount">{amountText(qty, it.unit, it.piece)}</span>
                        <span className="check-name">{it.name}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {steps.length > 0 && (
          <section className="card section" aria-labelledby="c-steps">
            <h2 id="c-steps" className="section-title">
              Cómo se hace
            </h2>
            <p className="hint">Toca un paso cuando lo termines. Los que llevan tiempo tienen su temporizador.</p>
            <ol className="cook-steps">
              {steps.map((s, i) => {
                const on = doneSteps.has(i);
                const timer = timers.find((t) => t.step === i);
                return (
                  <li key={i} className={`cook-step-card${on ? ' is-done' : ''}`}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={on}
                      className="cook-step"
                      onClick={() => setDoneSteps((d) => toggle(d, i))}
                    >
                      <span className="cook-step-num" aria-hidden="true">
                        {on ? <Icon name="check" size={24} stroke={3.2} /> : i + 1}
                      </span>
                      <span className="cook-step-text">{s.text}</span>
                    </button>
                    {s.minutes ? (
                      timer ? (
                        <div className={`step-timer${timer.done ? ' is-ringing' : ''}`} role="timer" aria-live="off">
                          <Icon name="clock" />
                          <span className="step-timer-clock">{timer.done ? '¡Tiempo!' : fmtClock(remaining(timer))}</span>
                          <Btn variant={timer.done ? 'danger' : 'quiet'} onClick={() => (timer.done ? stopTimer(timer.id) : setTimerToStop(timer.id))}>
                            {timer.done ? 'Parar alarma' : 'Quitar'}
                          </Btn>
                        </div>
                      ) : (
                        <Btn
                          variant="accent"
                          block
                          icon="clock"
                          className="step-timer-start"
                          onClick={() =>
                            startTimer({
                              recipeId: recipe.id,
                              recipeName: recipe.name,
                              step: i,
                              label: s.text.length > 48 ? `${s.text.slice(0, 46).trim()}…` : s.text,
                              minutes: s.minutes!,
                            })
                          }
                        >
                          Avisarme en {fmtMinutes(s.minutes)}
                        </Btn>
                      )
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        {recipe.notes && (
          <section className="card section notes" aria-labelledby="c-notes">
            <h2 id="c-notes" className="section-title">
              <Icon name="note" /> Notas y trucos
            </h2>
            <p className="notes-text">{recipe.notes}</p>
          </section>
        )}

        {marked > 0 && (
          <Btn variant="quiet" block icon="refresh" onClick={() => setConfirmClear(true)}>
            Desmarcar todo
          </Btn>
        )}

        <section className="card section" aria-labelledby="c-share">
          <h2 id="c-share" className="section-title">
            Compartir receta
          </h2>
          <a
            className="btn btn-whatsapp btn-big btn-block"
            href={whatsappLink(shareText)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={share}
          >
            <Icon name="share" />
            Enviar por WhatsApp
          </a>
          <Btn variant="secondary" block icon="copy" onClick={copy}>
            Copiar la receta
          </Btn>
        </section>

        <div className="stack cook-actions">
          <Btn variant="secondary" block icon="pencil" onClick={onEdit}>
            Cambiar esta receta
          </Btn>
          <Btn variant="quiet" block icon="trash" className="text-danger" onClick={() => setConfirmDelete(true)}>
            Borrar receta
          </Btn>
        </div>
      </main>

      <ConfirmDialog
        open={confirmDelete}
        title={`¿Borrar «${recipe.name}»?`}
        message="La receta desaparecerá de tu libro y no se podrá recuperar."
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          setConfirmDelete(false);
          onDelete();
        }}
      />
      <ConfirmDialog
        open={timerToStop !== null}
        title="¿Quitar el temporizador?"
        message="Dejará de contar y no sonará la alarma."
        confirmLabel="Sí, quitarlo"
        onCancel={() => setTimerToStop(null)}
        onConfirm={() => {
          if (timerToStop) stopTimer(timerToStop);
          setTimerToStop(null);
        }}
      />
      <ConfirmDialog
        open={confirmClear}
        title="¿Desmarcar todo?"
        message="Se quitarán todas las marcas de ingredientes y pasos."
        confirmLabel="Sí, desmarcar"
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          setDone(new Set());
          setDoneSteps(new Set());
          setConfirmClear(false);
        }}
      />
    </>
  );
}
