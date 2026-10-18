# PulseTask | Modern Focus & Task Manager

<p align="center">
  <strong>A lightweight, zero-dependency, client-side To-Do List web application engineered with modern aesthetics, fluid micro-animations, and full theme flexibility.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-ES6+-yellow.svg" alt="JavaScript">
  <img src="https://img.shields.io/badge/HTML5-Semantic-orange.svg" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-Modern%20Tokens-blue.svg" alt="CSS3">
  <img src="https://img.shields.io/badge/Dependencies-0%20(Pure%20Vanilla)-success.svg" alt="Zero Dependencies">
  <img src="https://img.shields.io/badge/Tests-9%2F9%20Passing-brightgreen.svg" alt="Tests Passing">
  <img src="https://img.shields.io/badge/Architecture-Harness%20Engineering-purple.svg" alt="Harness Engineering">
</p>

---

## ✨ Features

- **🌓 Dual Theme Architecture (Light & Dark Mode)**:
  - Default **Deep Slate** dark mode for night focus, with seamless switching to a clean **Soft Canvas** light mode.
  - Inlined theme pre-hydration prevents any visual flicker on reload.
  - Automatically respects system OS preference (`prefers-color-scheme`) and persists user choice in `localStorage`.

- **🔄 Native HTML5 Drag-and-Drop Reordering**:
  - Drag task cards to re-prioritize your day.
  - Real-time visual elevation, opacity shifts, and drop guide insertion lines.
  - Reordering automatically updates array order and persists to storage immediately.

- **📝 Expandable Task Notes & Descriptions**:
  - Add optional multi-line notes or step-by-step instructions to any task.
  - Expandable accordion toggle keeps the main list clean and readable.
  - Double-click or click the edit icon to modify titles and notes in-place.

- **🏷️ Priority Badges & Category Tags**:
  - Color-coded priority badges: **High** (Crimson), **Medium** (Amber), and **Low** (Emerald).
  - Quick category tagging: `Work`, `Personal`, `Dev`, and `Urgent`.
  - Due date tracking with automatic **Overdue** highlighting for missed deadlines.

- **🔍 Status Filtering & Multi-Criteria Sorting**:
  - Filter tasks by **All**, **Active**, and **Completed** with live counter badges.
  - Filter by category tags.
  - Sort by **Manual (Drag & Drop)**, **Priority (High → Low)**, **Due Date (Earliest)**, or **Newest First**.

- **💾 Zero-Configuration Local Persistence**:
  - Auto-syncs all operations to browser `localStorage`.
  - Fault-tolerant JSON serialization handles quota limits and corrupted data safely.
  - Pre-populated starter tasks on first launch to showcase all features out-of-the-box.

---

## 🏗️ Architecture & Harness Engineering

This project adheres strictly to the **Harness Engineering** development principles outlined in [`AGENTS.md`](./AGENTS.md):
- **Humans Steer, Agents Execute**: Clear separation between human intent/specifications and autonomous AI execution.
- **Repository as System of Record**: Plans, requirements, and test outcomes are version-controlled in repository artifacts.
- **Plan Lifecycle Discipline**: Work transitions through `plans/pending` $\rightarrow$ `plans/active` $\rightarrow$ `plans/completed`.

### System Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           USER INTERFACE (HTML5 / DOM)                           │
│                                                                                  │
│   ┌────────────────────────┐         ┌───────────────────────────────────────┐   │
│   │  Header & Theme Toggle │         │  Task Creation Bar + Notes Input      │   │
│   │  (☀️ Light / 🌙 Dark)  │         │  (Title, Priority, Category, Date)    │   │
│   └───────────┬────────────┘         └───────────────────┬───────────────────┘   │
│               │ Toggle Theme                             │ Submit Task           │
│   ┌───────────▼────────────┐         ┌───────────────────▼───────────────────┐   │
│   │  Filter & Sort Bar     │         │  Task Cards Container                 │   │
│   │  (All/Active/Done/Tags)│         │  (Drag-Handle, Checkbox, Notes, Edit) │   │
│   └───────────┬────────────┘         └───────────────────▲───────────────────┘   │
└───────────────┼──────────────────────────────────────────┼───────────────────────┘
                │ Filter Click                             │ Re-render DOM
                ▼                                          │
┌──────────────────────────────────────────────────────────┼───────────────────────┐
│                        APPLICATION LOGIC (app.js)        │                       │
│                                                          │                       │
│   ┌───────────────────┐  ┌───────────────────┐  ┌────────┴──────────┐  ┌─────┴─┐ │
│   │   ThemeManager    │  │   FilterManager   │  │   TaskManager     │  │DragDrop│ │
│   │                   │  │                   │  │                   │  │Manager │ │
│   │ • CSS data-theme  │  │ • Status filter   │  │ • Add, Edit, Del  │  │• Reorder│
│   │ • OS auto-detect  │  │ • Category chips  │  │ • Toggle complete │  │• Guides│ │
│   └─────────┬─────────┘  └─────────┬─────────┘  └────────┬──────────┘  └───┬───┘ │
│             │                      │                     │                 │     │
│             │                      └──────────┬──────────┘                 │     │
│             │                                 ▼ Event Trigger              │     │
│             │                          [ Task State Updated ] ◄────────────┘     │
└─────────────┼─────────────────────────────────┼──────────────────────────────────┘
              │ Read / Save                     │ Auto-Sync on Every Mutation
              ▼                                 ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                          BROWSER STORAGE (localStorage)                          │
│                                                                                  │
│      Key: "antigravity_todo_theme"          Key: "antigravity_todo_tasks"        │
│      Value: "dark" | "light"                Value: JSON Array of Task Objects    │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```text
├── AGENTS.md            # Harness-engineering development guidelines & rules
├── requirements.md      # Product Requirements Document (PRD) & user stories
├── index.html           # Accessible HTML5 structure & semantic layout
├── style.css            # Dark/Light theme design system & micro-animations
├── app.js               # State engine, Drag & Drop, and DOM renderer
├── test_suite.js        # Automated verification & unit/integration test suite
├── plans/
│   ├── pending/         # Approved task blueprints waiting to begin
│   ├── active/          # Currently in-progress plans with live status
│   └── completed/       # Validated plans with test logs and handoff notes
└── README.md            # Project documentation & overview
```

---

## 🚀 Getting Started

No build tools, bundlers, or package installations are required!

### 1. Run Directly in the Browser
Simply open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari):
```bash
# On Windows
start index.html

# On macOS
open index.html

# On Linux
xdg-open index.html
```

### 2. Run via Local HTTP Server
If you prefer running through a local web server:
```bash
# Using Python
python -m http.server 8080

# Using Node.js
npx serve .
```
Then navigate to `http://localhost:8080` in your browser.

---

## 🧪 Testing & Verification

The project includes an automated test suite verifying state management, CRUD, drag-and-drop re-indexing, theme persistence, and filtering:

```bash
node test_suite.js
```

### Test Suite Output
```text
🧪 Starting PulseTask Automated Test Suite...

  ✅ PASS: Initialize default tasks with sequential order indexing
  ✅ PASS: Add new task with title, notes, priority, category, due date & re-indexing
  ✅ PASS: Reject empty or whitespace-only task titles
  ✅ PASS: Toggle task completion status and persist to localStorage
  ✅ PASS: In-place edit of title and description notes
  ✅ PASS: Drag-and-drop reordering recalculates sequential indices
  ✅ PASS: Theme persistence handles dark and light transitions
  ✅ PASS: Filter by status (Active / Completed) and category
  ✅ PASS: Batch clear completed tasks leaves only active items

=========================================
Summary: 9 passed, 0 failed (100% Pass Rate).
=========================================
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Enter</kbd> (in input bar) | Submit and add task |
| Double-click (on task title) | Edit title in-place |
| <kbd>Enter</kbd> (during inline edit) | Save inline edit |
| <kbd>Esc</kbd> (during inline edit) | Cancel inline edit |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Navigate interactive elements |

---

## 📄 License
Open source and available under the [MIT License](https://opensource.org/licenses/MIT).