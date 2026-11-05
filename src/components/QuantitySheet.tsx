import { useEffect, useState } from 'react';
import type { UnitId } from '../types';
import { amountText, chipLabel, rangeFor } from '../lib/units';
import { tap } from '../lib/device';
import { Btn, Sheet, Stepper } from './ui';
import { FoodArt } from './FoodArt';
import './qty.css';

export interface QuantityTarget {
  name: string;
  art?: string;
  emoji?: string;
  units: UnitId[];
  piece?: [string, string];
  fine?: boolean;
  qty?: number;
  unit?: UnitId;
  note?: string;
  editing?: boolean;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Ventana para elegir cuánto se echa de un ingrediente. */
export function QuantitySheet({
  target,
  onClose,
  onConfirm,
}: {
  target: QuantityTarget | null;
  onClose: () => void;
  onConfirm: (qty: number, unit: UnitId, note: string) => void;
}) {
  const [unit, setUnit] = useState<UnitId>('ud');
  const [qty, setQty] = useState(1);
  /** Centro del ajuste fino: la última cantidad elegida con la barra grande o con − y +. */
  const [base, setBase] = useState(1);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!target) return;
    const u = target.unit ?? target.units[0];
    const q = target.qty ?? rangeFor(u, target.fine).start;
    setUnit(u);
    setQty(q);
    setBase(q);
    setNote(target.note ?? '');
  }, [target]);

  if (!target) return null;
  const range = rangeFor(unit, target.fine);
  const isToTaste = unit === 'gusto';

  const hasFine = range.fine < range.step;
  const fineMin = Math.max(range.fine, round2(base - range.step));
  const fineMax = Math.min(range.max, round2(base + range.step));

  const pickUnit = (u: UnitId) => {
    tap();
    const start = rangeFor(u, target.fine).start;
    setUnit(u);
    setQty(start);
    setBase(start);
  };

  const setCoarse = (v: number) => {
    const r = round2(v);
    setQty(r);
    setBase(r);
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
              min={range.fine}
              max={range.max}
              step={range.step}
              onChange={setCoarse}
              render={(v) => <span className="qty-amount">{amountText(v, unit, target.piece)}</span>}
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
              value={Math.min(range.max, Math.max(range.step, qty))}
              onChange={(e) => setCoarse(Number(e.target.value))}
            />
            <div className="slider-ends" aria-hidden="true">
              <span>Poco</span>
              <span>Mucho</span>
            </div>

            {hasFine && (
              <div className="fine">
                <label className="field-label" htmlFor="qty-fine">
                  Ajuste fino
                </label>
                <input
                  id="qty-fine"
                  className="slider"
                  type="range"
                  min={fineMin}
                  max={fineMax}
                  step={range.fine}
                  value={Math.min(fineMax, Math.max(fineMin, qty))}
                  onChange={(e) => setQty(round2(Number(e.target.value)))}
                />
                <div className="slider-ends" aria-hidden="true">
                  <span>{amountText(fineMin, unit, target.piece)}</span>
                  <span>{amountText(fineMax, unit, target.piece)}</span>
                </div>
              </div>
            )}
          </>
        )}

        <div className="qty-note">
          <label className="field-label" htmlFor="qty-note">
            Nota (opcional)
          </label>
          <input
            id="qty-note"
            className="input"
            type="text"
            maxLength={80}
            autoComplete="off"
            placeholder="Por ejemplo: bien colmada, o un poco más si hace falta"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="stack">
          <Btn variant="primary" big block icon="check" onClick={() => onConfirm(isToTaste ? 0 : qty, unit, note.trim())}>
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
