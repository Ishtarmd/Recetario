import { useRef, useState } from 'react';
import { photoToDataUrl } from '../lib/device';
import { Btn, ConfirmDialog } from './ui';

/** Hacer una foto con la cámara del móvil o elegirla de la galería. */
export function PhotoPicker({ photo, onChange }: { photo?: string; onChange: (p?: string) => void }) {
  const cameraInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const handle = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setProblem(null);
    try {
      onChange(await photoToDataUrl(file));
    } catch {
      setProblem('No he podido abrir esa foto. Prueba con otra.');
    } finally {
      setBusy(false);
      if (cameraInput.current) cameraInput.current.value = '';
      if (galleryInput.current) galleryInput.current.value = '';
    }
  };

  return (
    <div className="stack">
      {photo ? (
        <div className="photo-preview">
          <img src={photo} alt="Foto de tu plato" />
        </div>
      ) : (
        <div className="photo-empty" aria-hidden="true">
          <span>📷</span>
        </div>
      )}
      <Btn variant="accent" block big icon="camera" disabled={busy} onClick={() => cameraInput.current?.click()}>
        {busy ? 'Preparando la foto…' : photo ? 'Hacer otra foto' : 'Haz una foto a tu plato'}
      </Btn>
      <Btn variant="secondary" block icon="image" disabled={busy} onClick={() => galleryInput.current?.click()}>
        Elegir de la galería
      </Btn>
      {photo && (
        <Btn variant="quiet" block icon="trash" onClick={() => setConfirmRemove(true)}>
          Quitar la foto
        </Btn>
      )}
      {problem && (
        <p className="notice" role="alert">
          {problem}
        </p>
      )}
      <input
        ref={cameraInput}
        id="photo-camera"
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => handle(e.target.files?.[0])}
      />
      <input
        ref={galleryInput}
        id="photo-gallery"
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handle(e.target.files?.[0])}
      />
      <ConfirmDialog
        open={confirmRemove}
        title="¿Quitar la foto?"
        onCancel={() => setConfirmRemove(false)}
        onConfirm={() => {
          onChange(undefined);
          setConfirmRemove(false);
        }}
        confirmLabel="Sí, quitarla"
      />
    </div>
  );
}
