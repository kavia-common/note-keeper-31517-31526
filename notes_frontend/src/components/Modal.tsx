import { $, Slot, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

interface ModalProps {
  open: boolean;
  title?: string;
  onClose$: () => void;
  labelledById?: string;
}

// PUBLIC_INTERFACE
export const Modal = component$<ModalProps>(({ open, title, onClose$, labelledById }) => {
  const panelRef = useSignal<HTMLDivElement>();
  const lastFocused = useSignal<HTMLElement | null>(null);

  // Serializable event handlers
  const handleClose$ = $(() => {
    // Defer execution so this function remains serializable without capturing values in closure
    queueMicrotask(() => onClose$());
  });

  useVisibleTask$(({ cleanup, track }) => {
    track(() => open);
    if (!open) return;

    lastFocused.value = document.activeElement as HTMLElement | null;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose$();
      } else if (e.key === "Tab") {
        const panel = panelRef.value;
        if (!panel) return;
        const focusables = panel.querySelectorAll<HTMLElement>(
          'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    const onClickBackdrop = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.dataset?.backdrop === "true") {
        handleClose$();
      }
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClickBackdrop);

    setTimeout(() => {
      const first = panelRef.value?.querySelector<HTMLElement>(
        'input, textarea, button, [tabindex]:not([tabindex="-1"])',
      );
      first?.focus();
    }, 0);

    cleanup(() => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClickBackdrop);
      if (lastFocused.value) lastFocused.value.focus();
    });
  });

  if (!open) return null;

  return (
    <div
      class="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledById}
      data-backdrop="true"
    >
      <div ref={panelRef} class="modal-panel" role="document">
        <div class="modal-header">
          <h2 id={labelledById} style={{ margin: 0, fontSize: "1.1rem" }}>
            {title ?? "Modal"}
          </h2>
          <button
            class="button ghost icon"
            aria-label="Close"
            onClick$={handleClose$}
          >
            ✕
          </button>
        </div>
        <div class="modal-body">
          <Slot />
        </div>
      </div>
    </div>
  );
});
