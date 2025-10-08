export type NoteId = string;

export interface Note {
  id: NoteId;
  title: string;
  content: string;
  updatedAt: string; // ISO string
  createdAt: string; // ISO string
}
