# Product Requirements Document (PRD): Modern To-Do List Application

## 1. Executive Summary & Objective
Build a lightweight, highly responsive, client-side To-Do List web application designed with modern aesthetics, smooth micro-animations, and full theme flexibility. The application runs entirely in the browser, requires zero server configuration, and guarantees persistent state via browser `localStorage`.

---

## 2. Target Users & Personas
- **Solo Developers & Knowledge Workers**: Need a distraction-free, keyboard-friendly task manager to organize daily sprints, add contextual notes, and visually reprioritize tasks via drag-and-drop.
- **Everyday Users**: Value quick task entry, theme customization (Light / Dark mode), color-coded priorities, and instant filtering.

---

## 3. Functional Requirements

### 3.1 Task Management (CRUD)
- **Create**:
  - Add task via a prominent input bar with <kbd>Enter</kbd> or clicking "+ Add Task".
  - Required field: Title (trimmed, non-empty, max 120 chars).
  - Optional fields:
    - **Notes / Description**: Optional multi-line notes field for additional task details or sub-instructions.
    - **Category/Tag**: (e.g., Work, Personal, Dev, Urgent).
    - **Priority**: Low, Medium, High.
    - **Due Date**: Date picker with overdue status detection.
- **Read / Display**:
  - Render tasks as cards with clear typography, priority badges, category chips, and due dates.
  - **Notes Display**: Expandable/collapsible accordion or snippet preview to keep task cards compact while providing quick access to notes.
  - Show active task count (e.g., "3 tasks remaining").
- **Update**:
  - **Toggle Completion**: Circle check toggle with strike-through styling and completion animation.
  - **Inline Editing**: Edit title and notes directly in-place (<kbd>Enter</kbd> saves; <kbd>Escape</kbd> cancels).
- **Delete**:
  - Delete individual task with subtle fade/slide-out animation.
  - "Clear Completed" batch action to remove all finished tasks in one click.

### 3.2 Drag-and-Drop Task Reordering
- Native HTML5 Drag-and-Drop (`draggable="true"` with visual drag-handle icon).
- **Visual Feedback**: Dragged card gains an elevated shadow/tilt; drop target shows a prominent insertion guide line.
- **Order Persistence**: Reordering automatically recalculates array order and immediately syncs to `localStorage`.

### 3.3 Theme System (Light / Dark Mode Toggle)
- Prominent toggle button (Sun ☀️ / Moon 🌙 icon) in the application header.
- **System Preference Detection**: Auto-detects OS preference via `prefers-color-scheme` on first launch.
- **Persistence**: User theme selection persists in `localStorage` under `antigravity_todo_theme`.
- **CSS Architecture**: Implemented with CSS variables on `[data-theme="dark"]` and `[data-theme="light"]` for seamless color transitions.

### 3.4 Filtering & Sorting
- **Status Filters**: All, Active, Completed.
- **Category Filter**: Filter tasks by tag.
- **Sorting Options**:
  - Manual (custom drag-and-drop order).
  - By Due Date (Earliest first).
  - By Priority (High $\rightarrow$ Medium $\rightarrow$ Low).
  - By Creation Date (Newest first / Oldest first).

### 3.5 Data Persistence
- Auto-sync all changes to `localStorage` under key `antigravity_todo_tasks`.
- Graceful recovery: Resets safely to an empty array without crashing if stored data is corrupted.
- Pre-populated starter tasks on first launch to showcase all features (including notes, priorities, and themes).

---

## 4. Non-Functional Requirements

| Metric | Target |
| :--- | :--- |
| **Performance** | Instant load (< 300ms), 60fps animations & drag-and-drop. |
| **Compatibility** | Modern Evergreen Browsers (Chrome, Edge, Firefox, Safari). |
| **Responsiveness** | Mobile-first layout adaptable from 320px mobile screens to desktop ultra-wide monitors. |
| **Accessibility (a11y)** | Semantic HTML elements, ARIA drag-and-drop announcements, keyboard shortcuts, high contrast in both themes. |
| **Zero Dependencies** | Pure HTML5, Vanilla CSS3, Vanilla ES6+ JavaScript. No build step or bloated frameworks. |

---

## 5. UI / UX Design Specifications

### 5.1 Color Themes
- **Dark Theme (Default)**:
  - Background: Deep Slate `#0f172a`
  - Card Surfaces: `#1e293b`
  - Text Primary: `#f8fafc`, Secondary: `#94a3b8`
  - Border: `#334155`
- **Light Theme**:
  - Background: Soft Canvas `#f8fafc`
  - Card Surfaces: `#ffffff`
  - Text Primary: `#0f172a`, Secondary: `#64748b`
  - Border: `#e2e8f0`
- **Accent Palette**: Electric Indigo (`#6366f1`) and Cyan (`#06b6d4`) gradients.
- **Priority Badges**:
  - **High**: Crimson badge (`#ef4444`).
  - **Medium**: Amber badge (`#f59e0b`).
  - **Low**: Emerald badge (`#10b981`).

### 5.2 Micro-Interactions
- Smooth 0.2s cubic-bezier theme transition.
- Drag-and-drop lift and drop animations.
- Expandable note transition with smooth height tweening.
- Checkbox fill animation with strikethrough effect.

---

## 6. Edge Cases & Validation Rules
1. **Empty / Whitespace-Only Titles**: Input shakes and prevents submission.
2. **Long Notes**: Multi-line notes wrap properly without breaking card layouts.
3. **Drag During Active Filter**: Reordering is supported in manual view; if filtering by "Completed", drag reorders within that subset safely.
4. **XSS Protection**: All user input (title, notes) rendered via `textContent` or safe DOM node assignment.
5. **Theme Flicker Prevention**: Inlined theme initialization script in `<head>` to prevent flash of wrong theme on page load.

---

## 7. Acceptance Criteria (Definition of Done)
- [ ] User can add tasks with title, optional multi-line notes, category, priority, and due date.
- [ ] User can expand/collapse task notes on any card.
- [ ] User can drag and drop task cards to reorder them, with the new order saved in `localStorage`.
- [ ] User can switch between Light and Dark themes via a header toggle button, with selection persisted.
- [ ] User can toggle task completion and edit tasks in-place.
- [ ] User can filter by status and category, and sort by criteria.
- [ ] All state (tasks, order, theme) persists across page reloads.
- [ ] Zero runtime console errors.
