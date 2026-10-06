import { useState } from 'react';
import type { Course } from '../types';
import { addCourse, removeCourse, useCourses } from '../lib/courses';
import { tap } from '../lib/device';
import { Btn, ConfirmDialog, RoundBtn, Sheet } from './ui';

/** Elegir la sección del libro, o crear una propia. */
export function CoursePicker({ value, onChange }: { value?: string; onChange: (id?: string) => void }) {
  const courses = useCourses();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [toDelete, setToDelete] = useState<Course | null>(null);
  const own = courses.filter((c) => c.custom);

  const create = async () => {
    if (!name.trim()) return;
    const c = await addCourse(name);
    onChange(c.id);
    setName('');
    setOpen(false);
  };

  return (
    <>
      <div className="course-chips" role="radiogroup" aria-label="Sección del libro">
        {courses.map((c) => (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={value === c.id}
            className={`chip chip-wide${value === c.id ? ' chip-on' : ''}${c.custom ? ' chip-own' : ''}`}
            onClick={() => {
              tap();
              onChange(value === c.id ? undefined : c.id);
            }}
          >
            {c.name}
          </button>
        ))}
        <button type="button" className="chip chip-wide chip-new" onClick={() => (tap(), setOpen(true))}>
          + Nueva sección
        </button>
      </div>

      <Sheet open={open} onClose={() => setOpen(false)} labelledBy="new-course-title">
        <div className="stack-lg stack">
          <h2 id="new-course-title" className="h2">
            Nueva sección
          </h2>
          <label htmlFor="course-name" className="hint">
            Por ejemplo: «Cenas rápidas», «Recetas de la abuela», «Navidad».
          </label>
          <input
            id="course-name"
            className="input input-big"
            value={name}
            autoComplete="off"
            autoCapitalize="sentences"
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && create()}
          />
          <Btn variant="primary" big block icon="check" disabled={!name.trim()} onClick={create}>
            Crear y usar esta sección
          </Btn>
          {own.length > 0 && (
            <section className="stack" aria-labelledby="own-courses">
              <h3 id="own-courses" className="h3">
                Tus secciones
              </h3>
              <ul className="own-courses">
                {own.map((c) => (
                  <li key={c.id}>
                    <span>{c.name}</span>
                    <RoundBtn icon="trash" label={`Borrar la sección ${c.name}`} onClick={() => setToDelete(c)} />
                  </li>
                ))}
              </ul>
            </section>
          )}
          <Btn variant="quiet" block onClick={() => setOpen(false)}>
            Cancelar
          </Btn>
        </div>
      </Sheet>

      <ConfirmDialog
        open={toDelete !== null}
        title={`¿Borrar la sección «${toDelete?.name ?? ''}»?`}
        message="Las recetas que estén en ella no se borran: pasarán a «Sin sección»."
        onCancel={() => setToDelete(null)}
        onConfirm={async () => {
          if (toDelete) {
            if (value === toDelete.id) onChange(undefined);
            await removeCourse(toDelete.id);
          }
          setToDelete(null);
        }}
      />
    </>
  );
}
