import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { tap } from '../lib/device';
import { Icon, type IconName } from './Icon';
import { FoodArt } from './FoodArt';
import { fmtMinutes } from '../data/courses';

type Variant = 'primary' | 'secondary' | 'accent' | 'danger' | 'quiet';

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: IconName;
  block?: boolean;
  big?: boolean;
}

/** Botón grande (mínimo 56 px) con vibración al pulsar. */
export function Btn({ variant = 'primary', icon, block, big, className = '', children, onClick, type, ...rest }: BtnProps) {
  return (
    <button
      type={type ?? 'button'}
      className={`btn btn-${variant}${block ? ' btn-block' : ''}${big ? ' btn-big' : ''} ${className}`}
      onClick={(e) => {
        tap();
        onClick?.(e);
      }}
      {...rest}
    >
      {icon && <Icon name={icon} />}
      {children}
    </button>
  );
}

/** Botón redondo solo con icono; siempre lleva texto para lectores de pantalla. */
export function RoundBtn({
  icon,
  label,
  variant = 'quiet',
  className = '',
  ...rest
}: { icon: IconName; label: string; variant?: Variant } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Btn variant={variant} className={`btn-round ${className}`} aria-label={label} title={label} {...rest}>
      <Icon name={icon} size={28} />
    </Btn>
  );
}

export function TopBar({ title, onBack, backLabel = 'Volver' }: { title: string; onBack: () => void; backLabel?: string }) {
  return (
    <header className="topbar">
      <Btn variant="quiet" icon="back" onClick={onBack} className="topbar-back">
        {backLabel}
      </Btn>
      <h1 className="topbar-title">{title}</h1>
    </header>
  );
}

/** Ventana que sube desde abajo. Se cierra con Escape o tocando fuera. */
export function Sheet({
  open,
  onClose,
  children,
  labelledBy,
  full,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledBy: string;
  full?: boolean;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeRef.current();
    document.addEventListener('keydown', onKey);
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => {
      // Si dentro hay algo con autoFocus, se respeta; si no, el foco va a la ventana.
      if (!panel.current?.contains(document.activeElement)) panel.current?.focus();
    });
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
      prev?.focus?.({ preventScroll: true });
    };
  }, [open]);
  if (!open) return null;
  return (
    <div className="sheet-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={panel}
        className={`sheet${full ? ' sheet-full' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );
}

/** Doble confirmación para cualquier cosa que borre. */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Sí, borrar',
  cancelLabel = 'No, me equivoqué',
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Sheet open={open} onClose={onCancel} labelledBy="confirm-title">
      <div className="confirm">
        <div className="confirm-icon" aria-hidden="true">
          <Icon name="trash" size={34} />
        </div>
        <h2 id="confirm-title" className="confirm-title">
          {title}
        </h2>
        {message && <p className="confirm-msg">{message}</p>}
        <div className="stack">
          <Btn variant="primary" block big onClick={onCancel} autoFocus>
            {cancelLabel}
          </Btn>
          <Btn variant="danger" block onClick={onConfirm} icon="trash">
            {confirmLabel}
          </Btn>
        </div>
      </div>
    </Sheet>
  );
}

/** Selector − número + con botones grandes. */
export function Stepper({
  value,
  onChange,
  min,
  max,
  step = 1,
  render,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  render?: (v: number) => ReactNode;
  label: string;
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v * 100) / 100));
  return (
    <div className="stepper" role="group" aria-label={label}>
      <RoundBtn
        icon="minus"
        label={`Quitar (${label})`}
        variant="secondary"
        disabled={value <= min}
        onClick={() => onChange(clamp(value - step))}
      />
      <output className="stepper-value" aria-live="polite">
        {render ? render(value) : value}
      </output>
      <RoundBtn
        icon="plus"
        label={`Añadir (${label})`}
        variant="secondary"
        disabled={value >= max}
        onClick={() => onChange(clamp(value + step))}
      />
    </div>
  );
}

export function Toast({ message, onDone }: { message: string | null; onDone: () => void }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, 4500);
    return () => clearTimeout(t);
  }, [message, onDone]);
  if (!message) return null;
  return (
    <div className="toast" role="status">
      {message}
    </div>
  );
}

export function Thumb({ photo, art, emoji, size = 'md' }: { photo?: string; art?: string; emoji?: string; size?: 'md' | 'lg' }) {
  return (
    <div className={`thumb thumb-${size}`} aria-hidden="true">
      {photo ? <img src={photo} alt="" /> : <FoodArt art={art ?? (emoji ? undefined : 'plato')} emoji={emoji} size={56} />}
    </div>
  );
}

/** Selector de minutos: de 1 en 1 hasta 10, de 5 en 5 hasta 1 hora y luego de 15 en 15. */
export function MinutesStepper({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  const up = (v: number) => (v < 10 ? v + 1 : v < 60 ? v + 5 : v + 15);
  const down = (v: number) => (v <= 10 ? v - 1 : v <= 60 ? v - 5 : v - 15);
  return (
    <div className="minutes" role="group" aria-label={label}>
      <RoundBtn icon="minus" label={`Menos tiempo (${label})`} variant="secondary" disabled={value <= 0} onClick={() => onChange(Math.max(0, down(value)))} />
      <output className="minutes-value" aria-live="polite">
        <Icon name="clock" size={22} />
        {value ? fmtMinutes(value) : 'Sin tiempo'}
      </output>
      <RoundBtn icon="plus" label={`Más tiempo (${label})`} variant="secondary" disabled={value >= 720} onClick={() => onChange(Math.min(720, up(value)))} />
    </div>
  );
}

/** Flechas para subir o bajar un elemento de una lista. */
export function MoveButtons({
  index,
  total,
  label,
  onMove,
}: {
  index: number;
  total: number;
  label: string;
  onMove: (from: number, to: number) => void;
}) {
  return (
    <div className="move">
      <RoundBtn icon="up" label={`Subir ${label}`} variant="secondary" disabled={index === 0} onClick={() => onMove(index, index - 1)} />
      <RoundBtn
        icon="down"
        label={`Bajar ${label}`}
        variant="secondary"
        disabled={index === total - 1}
        onClick={() => onMove(index, index + 1)}
      />
    </div>
  );
}

export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [it] = next.splice(from, 1);
  next.splice(to, 0, it);
  return next;
}
