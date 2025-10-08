import { $, component$, useStore } from "@builder.io/qwik";
import type { Note } from "~/types/note";

interface NoteEditorProps {
  initial?: Partial<Note>;
  onCancel$: () => void;
  onSubmit$: (data: { title: string; content: string }) => void;
}

type EditorState = {
  title: string;
  content: string;
  error?: string;
};

// PUBLIC_INTERFACE
export const NoteEditor = component$<NoteEditorProps>(({ initial, onCancel$, onSubmit$ }) => {
  const state = useStore<EditorState>({
    title: initial?.title ?? "",
    content: initial?.content ?? "",
    error: undefined,
  });

  const submit$ = $(() => {
    const title = state.title.trim();
    const content = state.content.trim();
    if (!title && !content) {
      state.error = "Please enter a title or some content.";
      return;
    }
    state.error = undefined;
    queueMicrotask(() => onSubmit$({ title, content: state.content }));
  });

  const onTitleInput$ = $((e: Event) => {
    state.title = (e.target as HTMLInputElement).value;
  });

  const onContentInput$ = $((e: Event) => {
    state.content = (e.target as HTMLTextAreaElement).value;
  });

  const cancel$ = $(() => {
    queueMicrotask(() => onCancel$());
  });

  return (
    <form preventdefault:submit onSubmit$={submit$}>
      {state.error && (
        <div
          role="alert"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "var(--color-error)",
            borderRadius: "10px",
            padding: "8px 10px",
            marginBottom: "8px",
          }}
        >
          {state.error}
        </div>
      )}

      <label style={{ display: "grid", gap: "6px", marginBottom: "8px" }}>
        <span style={{ fontWeight: 600 }}>Title</span>
        <input
          class="input"
          name="title"
          value={state.title}
          onInput$={onTitleInput$}
          placeholder="Note title"
        />
      </label>

      <label style={{ display: "grid", gap: "6px" }}>
        <span style={{ fontWeight: 600 }}>Content</span>
        <textarea
          class="textarea"
          name="content"
          value={state.content}
          onInput$={onContentInput$}
          placeholder="Write your note..."
        />
      </label>

      <div class="modal-footer">
        <button type="button" class="button ghost" onClick$={cancel$}>
          Cancel
        </button>
        <button type="submit" class="button">Save</button>
      </div>
    </form>
  );
});
