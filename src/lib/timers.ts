import { useSyncExternalStore } from 'react';

/**
 * Temporizadores de cocina. Viven fuera de las pantallas para que sigan
 * contando aunque ella cambie de receta o vuelva a la estantería.
 */

export interface Timer {
  id: string;
  recipeId: string;
  recipeName: string;
  step: number; // índice del paso
  label: string; // texto corto del paso
  total: number; // segundos
  endsAt: number; // marca de tiempo
  done?: boolean;
}

let timers: Timer[] = [];
const listeners = new Set<() => void>();
let ticker: ReturnType<typeof setInterval> | null = null;
let alarm: ReturnType<typeof setInterval> | null = null;
let audio: AudioContext | null = null;

function emit() {
  timers = [...timers];
  listeners.forEach((l) => l());
}

export function useTimers() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => timers,
  );
}

/** Se llama desde el botón (gesto del usuario): así el móvil deja sonar la alarma más tarde. */
function unlockAudio() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!audio && Ctx) audio = new Ctx();
    audio?.resume().catch(() => {});
  } catch {
    audio = null;
  }
}

function beep() {
  try {
    navigator.vibrate?.([300, 150, 300]);
  } catch {
    /* sin vibración */
  }
  if (!audio) return;
  const now = audio.currentTime;
  [0, 0.25, 0.5].forEach((t) => {
    const osc = audio!.createOscillator();
    const gain = audio!.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, now + t);
    gain.gain.exponentialRampToValueAtTime(0.4, now + t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.18);
    osc.connect(gain).connect(audio!.destination);
    osc.start(now + t);
    osc.stop(now + t + 0.2);
  });
}

function tick() {
  const now = Date.now();
  let changed = false;
  for (const t of timers) {
    if (!t.done && now >= t.endsAt) {
      t.done = true;
      changed = true;
    }
  }
  const ringing = timers.some((t) => t.done);
  if (ringing && !alarm) {
    beep();
    alarm = setInterval(beep, 1600);
  }
  if (!ringing && alarm) {
    clearInterval(alarm);
    alarm = null;
  }
  if (!timers.length && ticker) {
    clearInterval(ticker);
    ticker = null;
  }
  // Se avisa cada segundo para que la cuenta atrás se vea moverse.
  if (changed || timers.length) emit();
}

export function startTimer(t: Omit<Timer, 'id' | 'endsAt' | 'total'> & { minutes: number }) {
  unlockAudio();
  const total = Math.round(t.minutes * 60);
  timers = timers.filter((x) => !(x.recipeId === t.recipeId && x.step === t.step));
  timers.push({
    id: `${t.recipeId}-${t.step}-${Date.now()}`,
    recipeId: t.recipeId,
    recipeName: t.recipeName,
    step: t.step,
    label: t.label,
    total,
    endsAt: Date.now() + total * 1000,
  });
  if (!ticker) ticker = setInterval(tick, 1000);
  emit();
}

export function addMinute(id: string) {
  const t = timers.find((x) => x.id === id);
  if (!t) return;
  t.endsAt = Math.max(t.endsAt, Date.now()) + 60_000;
  t.total += 60;
  t.done = false;
  tick();
}

export function stopTimer(id: string) {
  timers = timers.filter((t) => t.id !== id);
  tick();
  emit();
}

export function remaining(t: Timer, now = Date.now()) {
  return Math.max(0, Math.ceil((t.endsAt - now) / 1000));
}

export function fmtClock(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const mm = String(m).padStart(h ? 2 : 1, '0');
  const ss = String(s).padStart(2, '0');
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

// Al volver a la app (pantalla bloqueada), se revisa enseguida.
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && timers.length) tick();
  });
}
