import { $, component$ } from "@builder.io/qwik";
import type { Note } from "~/types/note";

interface NoteItemProps {
  note: Note;
  onEdit$: (note: Note) => void;
  onDelete$: (note: Note) => void;
}

// PUBLIC_INTERFACE
export const NoteItem = component$<NoteItemProps>(({ note, onEdit$, onDelete$ }) => {
  const formatTime = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  const contentPreview = (note.content || "").trim().slice(0, 120);

  const handleEdit$ = $(() => {
    queueMicrotask(() => onEdit$(note));
  });
  const handleDelete$ = $(() => {
    queueMicrotask(() => onDelete$(note));
  });

  return (
    <div class="note-item">
      <div>
        <h3>{note.title || "Untitled note"}</h3>
        {contentPreview && <p>{contentPreview}{note.content.length > 120 ? "…" : ""}</p>}
        <div class="note-meta">Updated {formatTime(note.updatedAt)}</div>
      </div>
      <div class="note-actions">
        <button class="button icon" onClick$={handleEdit$} aria-label={`Edit ${note.title || "note"}`}>
          ✏️ Edit
        </button>
        <button
          class="button icon"
          style={{ background: "var(--color-error)" }}
          onClick$={handleDelete$}
          aria-label={`Delete ${note.title || "note"}`}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
});
