import { useEffect, useRef, useState } from 'react';
import { addMinute, fmtClock, remaining, stopTimer, useTimers } from '../lib/timers';
import { Icon } from './Icon';
import { Btn, ConfirmDialog } from './ui';

/** Barra fija abajo con los temporizadores en marcha. Se ve en cualquier pantalla. */
export function TimerBar() {
  const timers = useTimers();
  const bar = useRef<HTMLDivElement>(null);
  const [toStop, setToStop] = useState<string | null>(null);

  // Reserva sitio abajo para que la barra no tape el contenido.
  useEffect(() => {
    const root = document.documentElement;
    if (!timers.length || !bar.current) {
      root.style.removeProperty('--timerbar-h');
      document.body.classList.remove('has-timers');
      return;
    }
    document.body.classList.add('has-timers');
    const ro = new ResizeObserver(() => root.style.setProperty('--timerbar-h', `${bar.current?.offsetHeight ?? 0}px`));
    ro.observe(bar.current);
    return () => ro.disconnect();
  }, [timers.length]);

  if (!timers.length) return null;
  const sorted = [...timers].sort((a, b) => Number(b.done ?? 0) - Number(a.done ?? 0) || a.endsAt - b.endsAt);

  return (
    <div ref={bar} className="timerbar" role="region" aria-label="Temporizadores">
      {sorted.map((t) => (
        <div key={t.id} className={`timer${t.done ? ' is-ringing' : ''}`}>
          <div className="timer-main">
            <span className="timer-clock" role="timer">
              {t.done ? '¡Tiempo!' : fmtClock(remaining(t))}
            </span>
            <span className="timer-label">
              <span className="timer-step-name">
                Paso {t.step + 1} · {t.recipeName}
              </span>
              <span className="timer-step">{t.label}</span>
            </span>
          </div>
          <div className="timer-actions">
            {t.done ? (
              <>
                <Btn variant="danger" icon="check" onClick={() => stopTimer(t.id)}>
                  Parar alarma
                </Btn>
                <Btn variant="secondary" icon="plus" onClick={() => addMinute(t.id)}>
                  1 min más
                </Btn>
              </>
            ) : (
              <>
                <Btn variant="secondary" icon="plus" onClick={() => addMinute(t.id)}>
                  1 min
                </Btn>
                <button type="button" className="timer-x" aria-label={`Quitar el temporizador del paso ${t.step + 1}`} onClick={() => setToStop(t.id)}>
                  <Icon name="close" size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      ))}
      <ConfirmDialog
        open={toStop !== null}
        title="¿Quitar el temporizador?"
        message="Dejará de contar y no sonará la alarma."
        confirmLabel="Sí, quitarlo"
        onCancel={() => setToStop(null)}
        onConfirm={() => {
          if (toStop) stopTimer(toStop);
          setToStop(null);
        }}
      />
    </div>
  );
}
