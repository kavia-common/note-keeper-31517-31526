/**
 * Storage service abstraction with a localStorage implementation.
 * Provides CRUD methods for notes and allows future swapping to backend.
 */
import type { Note, NoteId } from "~/types/note";

const STORAGE_KEY = "notes_app.v1";

export interface StorageService {
  // PUBLIC_INTERFACE
  list(): Promise<Note[]>;
  // PUBLIC_INTERFACE
  create(input: Omit<Note, "id" | "createdAt" | "updatedAt">): Promise<Note>;
  // PUBLIC_INTERFACE
  update(id: NoteId, patch: Partial<Omit<Note, "id">>): Promise<Note | null>;
  // PUBLIC_INTERFACE
  remove(id: NoteId): Promise<boolean>;
  // PUBLIC_INTERFACE
  get(id: NoteId): Promise<Note | null>;
}

function readAll(): Note[] {
  try {
    const raw = globalThis.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Note[];
    // sort desc by updatedAt
    return parsed.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  } catch {
    return [];
  }
}

function writeAll(notes: Note[]) {
  try {
    globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // ignore
  }
}

function nanoid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

class LocalStorageService implements StorageService {
  async list(): Promise<Note[]> {
    return readAll();
  }

  async create(input: Omit<Note, "id" | "createdAt" | "updatedAt">): Promise<Note> {
    const now = new Date().toISOString();
    const note: Note = {
      id: nanoid(),
      title: input.title.trim(),
      content: input.content,
      createdAt: now,
      updatedAt: now,
    };
    const all = readAll();
    all.unshift(note);
    writeAll(all);
    return note;
  }

  async update(id: NoteId, patch: Partial<Omit<Note, "id">>): Promise<Note | null> {
    const all = readAll();
    const idx = all.findIndex((n) => n.id === id);
    if (idx === -1) return null;
    const updated: Note = {
      ...all[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    all.splice(idx, 1);
    all.unshift(updated); // move to top on update
    writeAll(all);
    return updated;
  }

  async remove(id: NoteId): Promise<boolean> {
    const all = readAll();
    const idx = all.findIndex((n) => n.id === id);
    if (idx === -1) return false;
    all.splice(idx, 1);
    writeAll(all);
    return true;
  }

  async get(id: NoteId): Promise<Note | null> {
    const all = readAll();
    return all.find((n) => n.id === id) ?? null;
  }
}

export const storage: StorageService = new LocalStorageService();
