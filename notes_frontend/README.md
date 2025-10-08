# Notes Frontend (Qwik + Ocean Professional)

A modern Qwik notes application with create, edit, delete, and list functionality. Data persists in `localStorage` initially and is abstracted via a storage service so it can be swapped for a backend later.

- Framework: Qwik + Qwik City
- Theme: Ocean Professional (blue + amber accents, subtle gradients, rounded corners)
- Persistence: localStorage (`notes_app.v1`)
- Port: 3000 (configured in `vite.config.ts`)

## Features

- View a list of notes with title and last updated time
- Create a new note via an accessible modal editor
- Edit an existing note with the same modal editor
- Delete a note with confirmation
- Persist notes across reloads
- Responsive and accessible UI: Esc to close modal, focus management, keyboard navigation

## Quick Start

```bash
npm install
npm start   # runs on http://localhost:3000
```

Preview production build:

```bash
npm run preview
```

## Project Structure

```
src/
  components/
    Modal.tsx          # Accessible modal
    NoteEditor.tsx     # Create/edit form
    NoteItem.tsx       # Single note row with actions
    NoteList.tsx       # List with empty state
  routes/
    index.tsx          # Main page: list + open modal
    layout.tsx         # Layout wrapper
  services/
    storage.ts         # StorageService interface + localStorage impl
  styles/
    theme.css          # Ocean Professional theme
  global.css           # Basic global resets
  root.tsx             # App root (imports theme)
types/
  note.ts              # Note model
```

## Storage service

The `StorageService` interface in `src/services/storage.ts` provides `list`, `create`, `update`, `remove`, and `get`. The default implementation uses `localStorage`. To swap in a backend later, implement the same interface and export it as `storage`.

## Accessibility

- Modal traps focus, restores focus on close
- Escape key closes the modal
- Buttons have labels, proper roles and aria attributes

## Notes

- No environment variables required at this time
- When a backend/database is introduced, reuse the service interface
