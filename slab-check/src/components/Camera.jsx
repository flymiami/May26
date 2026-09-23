import { useEffect, useRef, useState } from 'react';
import { fromVideo, toDataUrl } from '../lib/image.js';

/**
 * Two ways in, both one tap:
 *   - live rear-camera viewfinder with a shutter button
 *   - pick an existing photo or a screenshot from the gallery
 * Pasting an image anywhere on the page also works.
 */
export default function Camera({ onCapture, busy }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileRef = useRef(null);
  const [live, setLive] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => () => stopStream(streamRef), []);

  useEffect(() => {
    const onPaste = async (e) => {
      const file = [...(e.clipboardData?.files || [])].find((f) => f.type.startsWith('image/'));
      if (!file) return;
      e.preventDefault();
      await handleFile(file);
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  });

  async function start() {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('This browser has no camera API. Use "Photo or screenshot" instead.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setLive(true);
    } catch (err) {
      const why =
        err.name === 'NotAllowedError'
          ? 'Camera permission was denied. Allow it in your browser settings, or use "Photo or screenshot".'
          : err.name === 'NotFoundError'
            ? 'No camera found on this device.'
            : window.isSecureContext === false
              ? 'The camera needs HTTPS. Open the deployed https:// URL.'
              : `Camera failed to start: ${err.message}`;
      setError(why);
    }
  }

  function shoot() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) {
      setError('The camera is not ready yet. Give it a second.');
      return;
    }
    const dataUrl = fromVideo(video);
    stopStream(streamRef);
    setLive(false);
    onCapture(dataUrl);
  }

  async function handleFile(file) {
    setError(null);
    try {
      onCapture(await toDataUrl(file));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-3">
      {live && (
        <div className="relative overflow-hidden rounded-2xl bg-black">
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className="aspect-[3/4] w-full object-cover"
          />
          {/* Card-shaped guide: a Pokemon card is 2.5 x 3.5in. */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[72%] aspect-[2.5/3.5] rounded-lg border-2 border-emerald-400/80" />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
            <button
              type="button"
              onClick={() => {
                stopStream(streamRef);
                setLive(false);
              }}
              className="rounded-xl bg-black/60 px-4 py-2 text-sm font-semibold text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={shoot}
              aria-label="Take photo"
              className="h-20 w-20 rounded-full border-4 border-white bg-white/25 active:scale-95"
            />
            <div className="w-[76px]" />
          </div>
        </div>
      )}

      {!live && (
        <div className="grid gap-3">
          <button type="button" onClick={start} disabled={busy} className="btn-primary py-5 text-xl">
            {busy ? 'Reading card…' : 'Snap a card'}
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="btn-ghost"
          >
            Photo or screenshot
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = '';
              if (file) handleFile(file);
            }}
          />
        </div>
      )}

      {error && (
        <p className="rounded-xl bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-300">
          {error}
        </p>
      )}
    </div>
  );
}

function stopStream(ref) {
  ref.current?.getTracks?.().forEach((t) => t.stop());
  ref.current = null;
}
