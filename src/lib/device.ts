/** Pequeña vibración al pulsar (en móviles que lo permiten). */
export function tap(ms = 12) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* sin vibración */
  }
}

/** Comprime una foto para que no llene el móvil: lado mayor 1280 px, JPEG. */
export async function photoToDataUrl(file: File, maxSide = 1280): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error('No se ha podido leer la foto'));
      i.src = url;
    });
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No se ha podido preparar la foto');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.82);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/* ---------- Dictado por voz (Web Speech API) ---------- */

type SR = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function recognitionCtor(): (new () => SR) | null {
  const w = window as unknown as Record<string, unknown>;
  return ((w.SpeechRecognition || w.webkitSpeechRecognition) as new () => SR) ?? null;
}

export function dictationSupported() {
  return typeof window !== 'undefined' && recognitionCtor() !== null;
}

/**
 * Empieza a escuchar. Llama a onText con lo dictado y a onDone al terminar
 * (con un mensaje si algo ha fallado). Devuelve una función para parar.
 */
export function startDictation(onText: (text: string) => void, onDone: (problem?: string) => void) {
  const Ctor = recognitionCtor();
  if (!Ctor) {
    onDone('Este móvil no permite dictar. Puedes escribirlo con el teclado.');
    return () => {};
  }
  let finished = false;
  const finish = (problem?: string) => {
    if (finished) return;
    finished = true;
    onDone(problem);
  };
  const r = new Ctor();
  r.lang = 'es-ES';
  r.interimResults = false;
  r.continuous = false;
  r.onresult = (e) => {
    const text = Array.from(e.results)
      .map((res) => res[0].transcript)
      .join(' ')
      .trim();
    if (text) onText(text);
  };
  r.onerror = (e) => {
    if (e.error === 'no-speech') finish('No te he oído. Pulsa otra vez el micrófono y habla cerca del móvil.');
    else if (e.error === 'not-allowed' || e.error === 'service-not-allowed')
      finish('El móvil no deja usar el micrófono aquí. Puedes escribirlo con el teclado.');
    else finish('No se ha podido dictar. Prueba otra vez.');
  };
  r.onend = () => finish();
  try {
    r.start();
  } catch {
    finish('No se ha podido dictar. Prueba otra vez.');
  }
  return () => {
    try {
      r.stop();
    } catch {
      /* ya parado */
    }
  };
}

/* ---------- Pantalla siempre encendida mientras cocina ---------- */

type Sentinel = { release: () => Promise<void> };

export async function keepScreenOn(): Promise<() => void> {
  try {
    const nav = navigator as unknown as { wakeLock?: { request: (t: 'screen') => Promise<Sentinel> } };
    const lock = await nav.wakeLock?.request('screen');
    return () => {
      lock?.release().catch(() => {});
    };
  } catch {
    return () => {};
  }
}

export function insideFrame() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}
