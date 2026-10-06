import { useEffect, useRef, useState } from 'react';
import type { Step } from '../types';
import { dictationSupported, startDictation } from '../lib/device';
import { Icon } from './Icon';
import { Btn, ConfirmDialog, MinutesStepper, MoveButtons, RoundBtn, moveItem } from './ui';
import { fmtMinutes } from '../data/courses';

/** Lista de pasos: cajas grandes, dictado por voz y tiempo de cada paso. */
export function StepsEditor({ steps, onChange }: { steps: Step[]; onChange: (s: Step[]) => void }) {
  const [listening, setListening] = useState<number | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<number | null>(null);
  const [ordering, setOrdering] = useState(false);
  const filled = steps.filter((s) => s.text.trim()).length;
  const stopRef = useRef<() => void>(() => {});
  const stepsRef = useRef(steps);
  stepsRef.current = steps;
  const canDictate = dictationSupported();
  const lastCount = useRef(steps.length);

  // Al añadir un paso, poner el cursor en él.
  useEffect(() => {
    if (steps.length > lastCount.current) {
      document.getElementById(`step-${steps.length - 1}`)?.focus();
    }
    lastCount.current = steps.length;
  }, [steps.length]);

  useEffect(() => () => stopRef.current(), []);

  const patch = (i: number, p: Partial<Step>) => onChange(stepsRef.current.map((s, j) => (j === i ? { ...s, ...p } : s)));

  const dictate = (i: number) => {
    if (listening !== null) {
      stopRef.current();
      return;
    }
    setProblem(null);
    setListening(i);
    stopRef.current = startDictation(
      (text) => {
        const before = stepsRef.current[i]?.text.trim();
        const sentence = text.charAt(0).toUpperCase() + text.slice(1);
        patch(i, { text: before ? `${before} ${sentence}` : sentence });
      },
      (p) => {
        setListening(null);
        if (p) setProblem(p);
      },
    );
  };

  const remove = (i: number) => {
    const next = steps.filter((_, j) => j !== i);
    onChange(next.length ? next : [{ text: '' }]);
  };

  return (
    <div className="stack">
      {filled > 1 && (
        <div className="list-tools">
          <p className="hint">{ordering ? 'Usa las flechas para cambiar el orden.' : ''}</p>
          <Btn variant={ordering ? 'primary' : 'quiet'} icon={ordering ? 'check' : 'order'} onClick={() => setOrdering((o) => !o)}>
            {ordering ? 'Listo' : 'Ordenar pasos'}
          </Btn>
        </div>
      )}
      {ordering ? (
        <ol className="steps-edit">
          {steps.map((s, i) => (
            <li key={i} className="item">
              <div className="item-main item-static">
                <span className="step-num">{i + 1}.</span>
                <span className="item-text step-preview">{s.text.trim() || 'Paso vacío'}</span>
              </div>
              <MoveButtons index={i} total={steps.length} label={`el paso ${i + 1}`} onMove={(a, b) => onChange(moveItem(steps, a, b))} />
            </li>
          ))}
        </ol>
      ) : (
        <ol className="steps-edit">
          {steps.map((s, i) => (
            <li key={i} className="step-edit">
              <div className="step-edit-head">
                <label htmlFor={`step-${i}`} className="step-num">
                  Paso {i + 1}
                  {s.minutes ? <span className="step-time-tag"> · {fmtMinutes(s.minutes)}</span> : null}
                </label>
                <div className="row">
                  {canDictate && (
                    <Btn
                      variant={listening === i ? 'danger' : 'secondary'}
                      className="btn-mic"
                      onClick={() => dictate(i)}
                      aria-pressed={listening === i}
                    >
                      <Icon name={listening === i ? 'stop' : 'mic'} />
                      {listening === i ? 'Parar' : 'Dictar'}
                    </Btn>
                  )}
                  <RoundBtn
                    icon="trash"
                    label={`Quitar el paso ${i + 1}`}
                    onClick={() => (s.text.trim() || s.minutes ? setToDelete(i) : remove(i))}
                    disabled={steps.length === 1 && !s.text.trim() && !s.minutes}
                  />
                </div>
              </div>
              {listening === i && (
                <p className="listening" role="status">
                  <span className="pulse" aria-hidden="true" /> Escuchando… dicta el paso y pulsa «Parar» al terminar.
                </p>
              )}
              <textarea
                id={`step-${i}`}
                className="textarea"
                rows={3}
                placeholder={i === 0 ? 'Por ejemplo: Freír las patatas a fuego suave.' : '¿Qué se hace después?'}
                value={s.text}
                onChange={(e) => patch(i, { text: e.target.value })}
              />
              <div className="step-time">
                <span className="step-time-label">¿Cuánto tarda este paso?</span>
                <MinutesStepper label={`paso ${i + 1}`} value={s.minutes ?? 0} onChange={(m) => patch(i, { minutes: m || undefined })} />
              </div>
            </li>
          ))}
        </ol>
      )}
      {problem && (
        <p className="notice" role="alert">
          {problem}
        </p>
      )}
      <Btn variant="secondary" block icon="plus" disabled={ordering} onClick={() => onChange([...steps, { text: '' }])}>
        Añadir otro paso
      </Btn>
      <ConfirmDialog
        open={toDelete !== null}
        title={`¿Quitar el paso ${(toDelete ?? 0) + 1}?`}
        message="Se borrará lo que has escrito en este paso y su tiempo."
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete !== null) remove(toDelete);
          setToDelete(null);
        }}
      />
    </div>
  );
}
