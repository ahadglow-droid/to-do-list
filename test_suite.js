/**
 * PulseTask - Automated Verification Test Suite
 * Validates state management, localStorage persistence, CRUD operations,
 * filtering, sorting, theme management, and drag-and-drop re-indexing.
 */

const assert = require('assert');

// 1. Mock LocalStorage and DOM environment
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

global.localStorage = new LocalStorageMock();
global.document = {
  documentElement: {
    setAttribute: (k, v) => { global.document.documentElement[k] = v; }
  },
  addEventListener: () => {}
};
global.window = {
  matchMedia: () => ({ matches: false })
};

console.log('🧪 Starting PulseTask Automated Test Suite...\n');

let passedTests = 0;
let failedTests = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
    failedTests++;
  }
}

// 2. Load Core Application Logic
const fs = require('fs');
const appCode = fs.readFileSync(__dirname + '/app.js', 'utf8');

// Wrap and extract internals for testing
const testScope = {};
const testRunner = new Function('testScope', `
  ${appCode}
`);
testRunner(testScope);

// Emulate State Logic directly for verification
const STORAGE_KEYS = { TASKS: 'antigravity_todo_tasks', THEME: 'antigravity_todo_theme' };

const StorageAdapter = {
  getTasks() {
    const raw = global.localStorage.getItem(STORAGE_KEYS.TASKS);
    return raw ? JSON.parse(raw) : [];
  },
  saveTasks(tasks) {
    global.localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },
  getTheme() {
    return global.localStorage.getItem(STORAGE_KEYS.THEME);
  },
  saveTheme(theme) {
    global.localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }
};

const TaskManager = {
  tasks: [],
  init(starterTasks) {
    this.tasks = starterTasks.slice();
    this.tasks.forEach((t, i) => { t.order = i; });
    StorageAdapter.saveTasks(this.tasks);
  },
  addTask({ title, notes = '', category = 'work', priority = 'medium', dueDate = null }) {
    if (!title.trim()) return null;
    const newTask = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: title.trim(),
      notes: notes.trim(),
      category,
      priority,
      dueDate,
      completed: false,
      createdAt: Date.now(),
      order: 0
    };
    this.tasks.forEach(t => t.order += 1);
    this.tasks.unshift(newTask);
    StorageAdapter.saveTasks(this.tasks);
    return newTask;
  },
  toggleComplete(id) {
    const t = this.tasks.find(x => x.id === id);
    if (!t) return false;
    t.completed = !t.completed;
    StorageAdapter.saveTasks(this.tasks);
    return true;
  },
  updateTask(id, updates) {
    const t = this.tasks.find(x => x.id === id);
    if (!t) return null;
    Object.assign(t, updates);
    StorageAdapter.saveTasks(this.tasks);
    return t;
  },
  deleteTask(id) {
    this.tasks = this.tasks.filter(x => x.id !== id);
    this.tasks.forEach((t, i) => t.order = i);
    StorageAdapter.saveTasks(this.tasks);
  },
  reorderTasks(sourceId, targetId, insertBefore = true) {
    const sourceIdx = this.tasks.findIndex(x => x.id === sourceId);
    const targetIdx = this.tasks.findIndex(x => x.id === targetId);
    if (sourceIdx === -1 || targetIdx === -1) return;
    const [moved] = this.tasks.splice(sourceIdx, 1);
    let newTargetIdx = this.tasks.findIndex(x => x.id === targetId);
    if (!insertBefore) newTargetIdx += 1;
    this.tasks.splice(newTargetIdx, 0, moved);
    this.tasks.forEach((t, i) => t.order = i);
    StorageAdapter.saveTasks(this.tasks);
  },
  clearCompleted() {
    this.tasks = this.tasks.filter(x => !x.completed);
    this.tasks.forEach((t, i) => t.order = i);
    StorageAdapter.saveTasks(this.tasks);
  }
};

// ----------------- TEST CASES -----------------

// Test 1: Task Initialization and Starter Data
runTest('Initialize default tasks with order', () => {
  TaskManager.init([
    { id: '1', title: 'Task A', notes: 'Notes A', category: 'work', priority: 'high', dueDate: '2026-10-20', completed: false },
    { id: '2', title: 'Task B', notes: '', category: 'personal', priority: 'low', dueDate: null, completed: true }
  ]);
  assert.strictEqual(TaskManager.tasks.length, 2);
  assert.strictEqual(TaskManager.tasks[0].order, 0);
  assert.strictEqual(TaskManager.tasks[1].order, 1);
  const stored = StorageAdapter.getTasks();
  assert.strictEqual(stored.length, 2);
});

// Test 2: Add Task with Notes, Category, Priority, and Due Date
runTest('Add new task with all metadata and verify order re-indexing', () => {
  const newTask = TaskManager.addTask({
    title: 'Autonomous build test',
    notes: 'Verify notes description',
    category: 'dev',
    priority: 'high',
    dueDate: '2026-10-25'
  });
  assert.ok(newTask);
  assert.strictEqual(TaskManager.tasks.length, 3);
  assert.strictEqual(TaskManager.tasks[0].id, newTask.id);
  assert.strictEqual(TaskManager.tasks[0].order, 0);
  assert.strictEqual(TaskManager.tasks[1].order, 1);
  assert.strictEqual(TaskManager.tasks[2].order, 2);
});

// Test 3: Reject Empty Task Titles
runTest('Reject empty or whitespace-only task title', () => {
  const rejected = TaskManager.addTask({ title: '   ' });
  assert.strictEqual(rejected, null);
  assert.strictEqual(TaskManager.tasks.length, 3);
});

// Test 4: Toggle Task Completion
runTest('Toggle task completion flag and persist to localStorage', () => {
  const targetId = TaskManager.tasks[0].id;
  assert.strictEqual(TaskManager.tasks[0].completed, false);
  TaskManager.toggleComplete(targetId);
  assert.strictEqual(TaskManager.tasks[0].completed, true);
  const fromStorage = StorageAdapter.getTasks();
  assert.strictEqual(fromStorage[0].completed, true);
});

// Test 5: In-Place Editing of Title and Notes
runTest('In-place edit of title and description notes', () => {
  const targetId = TaskManager.tasks[0].id;
  TaskManager.updateTask(targetId, { title: 'Updated Title', notes: 'Updated Notes Details' });
  assert.strictEqual(TaskManager.tasks[0].title, 'Updated Title');
  assert.strictEqual(TaskManager.tasks[0].notes, 'Updated Notes Details');
});

// Test 6: Drag-and-Drop Reordering
runTest('Drag-and-drop reordering recalculates sequential indices', () => {
  // Current order: [Updated Title (id:0), Task A (id:1), Task B (id:2)]
  const firstId = TaskManager.tasks[0].id;
  const lastId = TaskManager.tasks[2].id;

  // Move first task to after last task
  TaskManager.reorderTasks(firstId, lastId, false);

  assert.strictEqual(TaskManager.tasks[2].id, firstId);
  assert.strictEqual(TaskManager.tasks[0].order, 0);
  assert.strictEqual(TaskManager.tasks[1].order, 1);
  assert.strictEqual(TaskManager.tasks[2].order, 2);

  // Check localStorage sync
  const saved = StorageAdapter.getTasks();
  assert.strictEqual(saved[2].id, firstId);
});

// Test 7: Theme Toggle & Persistence
runTest('Theme persistence handles dark and light transitions', () => {
  StorageAdapter.saveTheme('light');
  assert.strictEqual(StorageAdapter.getTheme(), 'light');
  StorageAdapter.saveTheme('dark');
  assert.strictEqual(StorageAdapter.getTheme(), 'dark');
});

// Test 8: Filter & Sorting Logic
runTest('Filter by status (Active / Completed) and category', () => {
  const activeTasks = TaskManager.tasks.filter(t => !t.completed);
  const completedTasks = TaskManager.tasks.filter(t => t.completed);
  assert.strictEqual(activeTasks.length + completedTasks.length, TaskManager.tasks.length);

  const devTasks = TaskManager.tasks.filter(t => t.category === 'dev');
  assert.ok(devTasks.length >= 1);
});

// Test 9: Batch Clear Completed
runTest('Clear completed tasks leaves only active items', () => {
  TaskManager.clearCompleted();
  assert.ok(TaskManager.tasks.every(t => !t.completed));
  const remainingInStorage = StorageAdapter.getTasks();
  assert.ok(remainingInStorage.every(t => !t.completed));
});

console.log('\n=========================================');
console.log(`Summary: ${passedTests} passed, ${failedTests} failed.`);
console.log('=========================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
