import { $, component$ } from "@builder.io/qwik";
import type { Note } from "~/types/note";
import { NoteItem } from "./NoteItem";

interface NoteListProps {
  notes: Note[];
  onEdit$: (note: Note) => void;
  onDelete$: (note: Note) => void;
}

// PUBLIC_INTERFACE
export const NoteList = component$<NoteListProps>(({ notes, onEdit$, onDelete$ }) => {
  if (!notes || notes.length === 0) {
    return (
      <div class="card list-empty">
        <p style={{ margin: 0 }}>
          No notes yet. Click{" "}
          <span class="badge">Add Note</span>{" "}
          to create your first one.
        </p>
      </div>
    );
  }

  const forwardEdit$ = $((note: Note) => {
    queueMicrotask(() => onEdit$(note));
  });
  const forwardDelete$ = $((note: Note) => {
    queueMicrotask(() => onDelete$(note));
  });

  return (
    <div class="note-list">
      {notes.map((n) => (
        <NoteItem key={n.id} note={n} onEdit$={forwardEdit$} onDelete$={forwardDelete$} />
      ))}
    </div>
  );
});
