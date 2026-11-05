import { useEffect, useImperativeHandle, useLayoutEffect, useRef, type CSSProperties, type ReactNode, type Ref } from 'react';
import type { Recipe } from '../types';

export interface BookReaderHandle {
  /** Cierra el libro con animación y lo devuelve a la estantería. */
  close: () => Promise<void>;
}

/**
 * El libro abierto. La receta (children) se dibuja de verdad dentro de la página
 * desde el primer momento: primero en pequeño, tapada por la cubierta; la cubierta
 * se abre y la misma página crece hasta ocupar la pantalla. No hay cambio de
 * pantalla: lo que ves dentro del libro es la receta.
 */
export function BookReader({
  recipe,
  color,
  instant,
  findSpine,
  onOpened,
  handle,
  children,
}: {
  recipe: Recipe;
  color: string;
  /** Abrir sin animación (por ejemplo, al volver de editar). */
  instant?: boolean;
  findSpine: () => HTMLElement | null;
  onOpened: () => void;
  handle: Ref<BookReaderHandle>;
  children: ReactNode;
}) {
  const backdrop = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);
  const cover = useRef<HTMLDivElement>(null);
  const openedRef = useRef(onOpened);
  openedRef.current = onOpened;
  const busy = useRef(false);

  const reduce = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  /** Medidas del libro cerrado en el centro y de la página abierta. */
  const geometry = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pw = Math.min(vw, 640); // ancho de la página abierta
    const px = (vw - pw) / 2;
    const bw = Math.min(vw * 0.72, 290); // ancho del libro cerrado
    const bh = Math.min(bw * (4 / 3), vh * 0.7);
    const bx = (vw - bw) / 2;
    const by = (vh - bh) / 2;
    const k = bw / pw; // escala de la página dentro del libro
    const clipBottom = Math.max(0, vh - bh / k);
    return { vw, vh, pw, px, bw, bh, bx, by, k, clipBottom };
  };

  const pageClosed = (geo: ReturnType<typeof geometry>) => ({
    transform: `translate(${geo.bx - geo.px}px, ${geo.by}px) scale(${geo.k})`,
    clipPath: `inset(0px 0px ${geo.clipBottom}px 0px round ${8 / geo.k}px)`,
  });
  const pageOpen = { transform: 'translate(0px, 0px) scale(1)', clipPath: 'inset(0px 0px 0px 0px round 0px)' };

  const spineTransform = (geo: ReturnType<typeof geometry>) => {
    const r = findSpine()?.getBoundingClientRect();
    if (!r || !r.width) return 'translate(0, 40px) scale(.6)';
    const dx = r.left + r.width / 2 - (geo.bx + geo.bw / 2);
    const dy = r.top + r.height / 2 - (geo.by + geo.bh / 2);
    return `translate(${dx}px, ${dy}px) scale(${r.width / geo.bw}, ${r.height / geo.bh})`;
  };

  const settleOpen = () => {
    const p = page.current;
    const c = cover.current;
    const b = backdrop.current;
    if (!p || !c || !b) return;
    p.getAnimations().forEach((a) => a.cancel());
    c.getAnimations().forEach((a) => a.cancel());
    b.getAnimations().forEach((a) => a.cancel());
    p.style.transform = 'none';
    p.style.clipPath = 'none';
    p.classList.add('is-open');
    c.style.display = 'none';
    b.style.opacity = '1';
  };

  // Abrir
  useLayoutEffect(() => {
    const p = page.current;
    const c = cover.current;
    const b = backdrop.current;
    if (!p || !c || !b) return;
    document.body.classList.add('no-scroll');
    if (instant || reduce() || typeof p.animate !== 'function') {
      settleOpen();
      openedRef.current();
      return;
    }
    let cancelled = false;
    busy.current = true;
    const geo = geometry();
    const closed = pageClosed(geo);
    Object.assign(p.style, closed, { visibility: 'hidden' });
    Object.assign(c.style, { left: `${geo.bx}px`, top: `${geo.by}px`, width: `${geo.bw}px`, height: `${geo.bh}px` });

    (async () => {
      try {
        b.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 350, fill: 'forwards' });
        // 1. El libro sale de la balda y se pone de frente.
        await c.animate(
          [
            { transform: spineTransform(geo) },
            { transform: 'translate(0px, -24px) scale(.82) rotate(-3deg)', offset: 0.6 },
            { transform: 'none' },
          ],
          { duration: 700, easing: 'cubic-bezier(.25,.8,.25,1)', fill: 'forwards' },
        ).finished;
        if (cancelled) return;
        // 2. Se abre la tapa: debajo está ya la receta.
        p.style.visibility = 'visible';
        const lid = c.querySelector<HTMLElement>('.cover-lid')!;
        await lid.animate([{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(-165deg)' }], {
          duration: 900,
          easing: 'cubic-bezier(.45,0,.2,1)',
          fill: 'forwards',
        }).finished;
        if (cancelled) return;
        await new Promise((r) => setTimeout(r, 250));
        // 3. La página crece hasta ser la pantalla.
        c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 350, fill: 'forwards' });
        await p.animate([closed, pageOpen], { duration: 650, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' }).finished;
      } catch {
        /* animación interrumpida */
      }
      if (cancelled) return;
      busy.current = false;
      settleOpen();
      openedRef.current();
    })();
    return () => {
      cancelled = true;
    };
    // Solo al montar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => document.body.classList.remove('no-scroll'), []);

  useImperativeHandle(handle, () => ({
    close: async () => {
      const p = page.current;
      const c = cover.current;
      const b = backdrop.current;
      if (!p || !c || !b || busy.current) return;
      if (reduce() || typeof p.animate !== 'function') return;
      busy.current = true;
      const geo = geometry();
      const closed = pageClosed(geo);
      try {
        p.scrollTo({ top: 0 });
        p.classList.remove('is-open');
        Object.assign(c.style, {
          display: '',
          left: `${geo.bx}px`,
          top: `${geo.by}px`,
          width: `${geo.bw}px`,
          height: `${geo.bh}px`,
          transform: 'none',
        });
        const lid = c.querySelector<HTMLElement>('.cover-lid')!;
        lid.style.transform = 'rotateY(-165deg)';
        // 1. La página se encoge dentro del libro.
        c.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: 'forwards' });
        await p.animate([pageOpen, closed], { duration: 550, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' }).finished;
        // 2. Se cierra la tapa.
        await lid.animate([{ transform: 'rotateY(-165deg)' }, { transform: 'rotateY(0deg)' }], {
          duration: 650,
          easing: 'cubic-bezier(.45,0,.2,1)',
          fill: 'forwards',
        }).finished;
        p.style.visibility = 'hidden';
        // 3. Vuelve a su sitio en la balda.
        b.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 550, fill: 'forwards' });
        await c.animate([{ transform: 'none' }, { transform: spineTransform(geo) }], {
          duration: 550,
          easing: 'cubic-bezier(.5,0,.75,0)',
          fill: 'forwards',
        }).finished;
      } catch {
        /* interrumpida */
      }
    },
  }));

  return (
    <div className="reader-layer">
      <div ref={backdrop} className="reader-backdrop" />
      <div ref={page} className="reader-page">
        {children}
      </div>
      <div ref={cover} className="reader-cover" aria-hidden="true" style={{ '--c': color } as CSSProperties}>
        <div className="cover-back" />
        <div className="cover-lid">
          <div className="cover-front">
            {recipe.photo && <img src={recipe.photo} alt="" />}
            <span className="cover-title">{recipe.name}</span>
            <span className="cover-rule" />
          </div>
          <div className="cover-inside" />
        </div>
      </div>
    </div>
  );
}
