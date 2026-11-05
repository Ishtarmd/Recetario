import { useMemo } from 'react';
import { Btn } from './ui';

const COLORS = ['var(--primary)', 'var(--accent)', 'var(--honey)', 'var(--primary-soft)', 'var(--accent-soft)'];

/** Confeti y mensaje alegre al guardar una receta. */
export function Celebration({ name, onOpen, onHome }: { name: string; onOpen: () => void; onHome: () => void }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.2 + Math.random() * 1.6,
        rotate: Math.random() * 360,
        color: COLORS[i % COLORS.length],
        wide: i % 3 === 0,
      })),
    [],
  );
  return (
    <div className="celebrate" role="dialog" aria-modal="true" aria-labelledby="celebrate-title">
      <div className="confetti" aria-hidden="true">
        {pieces.map((p, i) => (
          <span
            key={i}
            style={{
              left: `${p.left}%`,
              background: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              transform: `rotate(${p.rotate}deg)`,
              width: p.wide ? 14 : 9,
            }}
          />
        ))}
      </div>
      <div className="celebrate-card">
        <div className="celebrate-badge" aria-hidden="true">
          ✓
        </div>
        <h2 id="celebrate-title" className="h1">
          ¡Receta guardada con éxito!
        </h2>
        <p className="lead">«{name}» ya está en tu libro de recetas.</p>
        <div className="stack">
          <Btn variant="primary" big block icon="book" onClick={onOpen} autoFocus>
            Ver la receta
          </Btn>
          <Btn variant="secondary" block icon="home" onClick={onHome}>
            Volver al inicio
          </Btn>
        </div>
      </div>
    </div>
  );
}
