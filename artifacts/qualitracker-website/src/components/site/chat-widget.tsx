import { useEffect, useRef, useState } from 'react';
import { MessageSquareText, X } from 'lucide-react';

/**
 * Floating QualiBOT launcher: opens the API's chromeless embed page
 * (`/embed/{tenant}/`) in a lazy-mounted iframe (ADR-033 in the qualibot
 * repo; deploy steps in its docs/deploy/WEBSITE_INTEGRATION.md).
 *
 * Build-time config:
 *   VITE_QUALIBOT_URL    API origin, e.g. https://api-xyz.africa-south1.run.app
 *                        (unset → the widget renders nothing; safe pre-launch default)
 *   VITE_QUALIBOT_TENANT public tenant slug (default: "qualitracker")
 *
 * The iframe mounts lazily on first open and unmounts with the panel.
 * Conversation history survives across closes because the embed page keys
 * sessions by visitor_id in its own storage and refetches them on load.
 * Closing mid-answer abandons the in-flight turn (nothing is stored
 * unless the final event arrives) — same semantics as Esc-to-stop.
 */
function embedUrl(): string {
  const base = (import.meta.env.VITE_QUALIBOT_URL ?? '').replace(/\/+$/, '');
  if (!base) return '';
  const tenant = import.meta.env.VITE_QUALIBOT_TENANT ?? 'qualitracker';
  return `${base}/embed/${encodeURIComponent(tenant)}/`;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [iframeMounted, setIframeMounted] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const src = embedUrl();

  useEffect(() => {
    if (!open) return;
    setIframeMounted(true);
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    // Keys pressed inside the iframe never reach this document, so the embed
    // page asks to be closed via postMessage when Esc is hit while not
    // streaming. Only honour it from the chat's own origin.
    const embedOrigin = new URL(src).origin;
    const onMessage = (e: MessageEvent) => {
      if (e.origin === embedOrigin && e.data === 'qualibot:request-close') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    window.addEventListener('message', onMessage);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('message', onMessage);
    };
  }, [open, src]);

  // Return focus to the launcher only on a real open→close transition —
  // not on first mount, where open starts false.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
    } else if (wasOpen.current) {
      wasOpen.current = false;
      launcherRef.current?.focus();
    }
  }, [open]);

  if (!src) return null;

  return (
    <>
      {open && (
        <div
          id="qualibot-panel"
          role="dialog"
          aria-label="QualiBOT assistant"
          className="fixed bottom-24 right-4 z-50 flex flex-col overflow-hidden border sm:right-6"
          style={{
            width: 'min(400px, calc(100vw - 32px))',
            height: 'min(620px, calc(100dvh - 112px))',
            background: 'var(--qt-clinical-white, #fff)',
            borderColor: 'var(--qt-border, rgba(1,46,54,.14))',
            borderRadius: 8,
            boxShadow: '0 16px 48px rgba(1, 46, 54, .22)',
          }}
        >
          <div
            className="flex shrink-0 items-center justify-between px-4"
            style={{ background: 'var(--qt-deep-teal)', color: '#fff', height: 52 }}
          >
            <div className="flex items-center gap-2 font-sans text-sm font-semibold">
              <MessageSquareText size={16} aria-hidden="true" />
              QualiBOT
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              data-testid="qualibot-close"
              className="qt-focus inline-flex items-center justify-center rounded"
              style={{ width: 32, height: 32, color: '#fff' }}
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          {iframeMounted && (
            <iframe
              src={src}
              title="QualiBOT assistant"
              data-testid="qualibot-frame"
              className="h-full w-full flex-1 border-0"
            />
          )}
        </div>
      )}

      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="qualibot-panel"
        aria-label={open ? 'Close QualiBOT chat' : 'Chat with QualiBOT'}
        data-testid="qualibot-launcher"
        className="qt-focus fixed bottom-5 right-4 z-50 inline-flex items-center justify-center rounded-full sm:right-6"
        style={{
          width: 56,
          height: 56,
          background: 'var(--qt-deep-teal)',
          color: '#fff',
          boxShadow: '0 8px 24px rgba(1, 46, 54, .28)',
        }}
      >
        {open ? <X size={22} aria-hidden="true" /> : <MessageSquareText size={22} aria-hidden="true" />}
      </button>
    </>
  );
}
