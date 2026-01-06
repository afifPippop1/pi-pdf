# TODO

## P0 — Core UX (Unify existing logic)

- [ ] Centralize max file size check (> 2MB)
- [ ] Show a single max-file-size alert modal
- [ ] Unify upload flow (cloud save vs local-only)
- [ ] Ensure one clear outcome after upload:
  - Cloud saved **or**
  - Local-only with explanation

---

## P1 — Local-only document experience

- [ ] Load local (IndexedDB) documents in `/documents` list
- [ ] Merge cloud + local documents into one list
- [ ] Mark local-only documents clearly (badge / label)
- [ ] Save edits to IndexedDB for local-only documents
- [ ] Add explicit “Export / Download” action for local-only docs

---

## P2 — Auth & access

- [ ] Add auth route guard
- [ ] Handle unauthenticated access gracefully
- [ ] Disable cloud actions when not authenticated

---

## P3 — Baseline UI polish (minimal CSS)

- [ ] Add global layout container & spacing
- [ ] Normalize primary button styles
- [ ] Wrap main sections in simple cards
- [ ] Add empty states for:
  - No cloud documents
  - Local-only documents
- [ ] Ensure readable font sizes & contrast

---

## P4 — Optional / Phase 2 (do not block release)

- [ ] Multi-file upload
- [ ] Merge PDFs on first add
- [ ] Local → cloud migration flow
- [ ] Delete document (cloud + local)

---

## DONE criteria

- [ ] Users can see both cloud and local documents
- [ ] Users always know where a document is stored
- [ ] Saving behavior is explicit and predictable
- [ ] App feels intentional, not accidental
