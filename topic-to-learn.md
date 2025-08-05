# 01-08-2025

## PDF Viewer/Editor Core Topics (React + pdf-lib + Canvas)

### ✅ Rendering & Viewing PDFs

1. Using `pdfjs-dist` to render PDF pages to `<canvas>`
2. Managing render task lifecycle (canceling previous render)
3. Efficiently loading and rendering only visible pages (pagination or virtualization)

### 🎯 Drawing & Annotation Layer

4. Overlaying a custom canvas on top of PDF render (for drawing annotations, highlights, etc.)
5. Storing drawn positions relative to page size (to handle scaling)
6. Synchronizing user input (clicks, drawings) with PDF coordinates

### 🔍 Zooming & Panning

7. Zooming: scaling both PDF canvas and overlay canvas together
8. Panning: adjusting position of both layers while maintaining alignment
9. Tracking scroll position to update canvas views and annotations

### 🧠 State Management & Performance

10. Avoiding full re-renders of the whole PDF document
11. Debouncing state updates when editing (like text or drawings)
12. Do you need Redux, Zustand, Jotai, etc. for this use case?

### ✍️ Editing & Saving PDFs

13. Using `pdf-lib` to modify and export PDFs with new content
14. Adding text, drawing, images, shapes using `pdf-lib`
15. Handling position translation: converting canvas coordinates to PDF-lib points

### 📁 File Management

16. Handling file upload and reading ArrayBuffer/Uint8Array
17. Exporting modified PDF as download
18. Detecting and handling corrupted or encrypted PDF files

### 🧪 UX Enhancements (for production)

19. Adding a loading indicator while rendering PDF pages
20. Keyboard/mouse shortcuts for zoom/pan/undo
21. Undo/Redo stack for drawing or editing operations
