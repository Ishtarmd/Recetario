import { useEffect, useState } from 'react';
import type { UnitId } from '../types';
import { amountText, chipLabel, rangeFor } from '../lib/units';
import { tap } from '../lib/device';
import { Btn, Sheet, Stepper } from './ui';
import { FoodArt } from './FoodArt';

export interface QuantityTarget {
  name: string;
  art?: string;
  emoji?: string;
  units: UnitId[];
  piece?: [string, string];
  fine?: boolean;
  qty?: number;
  unit?: UnitId;
  editing?: boolean;
}

/** Ventana para elegir cuánto se echa de un ingrediente. */
export function QuantitySheet({
  target,
  onClose,
  onConfirm,
}: {
  target: QuantityTarget | null;
  onClose: () => void;
  onConfirm: (qty: number, unit: UnitId) => void;
}) {
  const [unit, setUnit] = useState<UnitId>('ud');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!target) return;
    const u = target.unit ?? target.units[0];
    setUnit(u);
    setQty(target.qty ?? rangeFor(u, target.fine).start);
  }, [target]);

  if (!target) return null;
  const range = rangeFor(unit, target.fine);
  const isToTaste = unit === 'gusto';

  const pickUnit = (u: UnitId) => {
    tap();
    setUnit(u);
    setQty(rangeFor(u, target.fine).start);
  };

  return (
    <Sheet open onClose={onClose} labelledBy="qty-title">
      <div className="qty">
        <div className="qty-head">
          <span className="qty-art">
            <FoodArt art={target.art} emoji={target.emoji} size={84} className="float" />
          </span>
          <div>
            <p className="eyebrow">¿Cuánto vas a echar?</p>
            <h2 id="qty-title" className="qty-name">
              {target.name}
            </h2>
          </div>
        </div>

        {target.units.length > 1 && (
          <fieldset className="unit-chips">
            <legend className="field-label">Medir en</legend>
            {target.units.map((u) => (
              <button
                key={u}
                type="button"
                className={`chip${u === unit ? ' chip-on' : ''}`}
                aria-pressed={u === unit}
                onClick={() => pickUnit(u)}
              >
                {chipLabel(u, target.piece)}
              </button>
            ))}
          </fieldset>
        )}

        {isToTaste ? (
          <p className="qty-taste">Se apuntará como «al gusto», sin cantidad fija.</p>
        ) : (
          <>
            <Stepper
              label="cantidad"
              value={qty}
              min={range.step}
              max={range.max}
              step={range.step}
              onChange={setQty}
              render={(v) => (
                <span className="qty-amount">{amountText(v, unit, target.piece)}</span>
              )}
            />
            <label className="sr-only" htmlFor="qty-slider">
              Deslizar para cambiar la cantidad
            </label>
            <input
              id="qty-slider"
              className="slider"
              type="range"
              min={range.step}
              max={range.max}
              step={range.step}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            />
            <div className="slider-ends" aria-hidden="true">
              <span>Poco</span>
              <span>Mucho</span>
            </div>
          </>
        )}

        <div className="stack">
          <Btn variant="primary" big block icon="check" onClick={() => onConfirm(isToTaste ? 0 : qty, unit)}>
            {target.editing ? 'Guardar cambios' : 'Añadir a la receta'}
          </Btn>
          <Btn variant="quiet" block onClick={onClose}>
            Cancelar
          </Btn>
        </div>
      </div>
    </Sheet>
  );
}
