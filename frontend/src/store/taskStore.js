/**
 * Lightweight reactive store for tasks.
 * Components subscribe and get notified on every change.
 */

let _tasks      = [];
let _filters    = { status: '', category: '', priority: '', search: '' };
let _listeners  = [];

function notify() {
  _listeners.forEach((fn) => fn(getFiltered()));
}

export function subscribe(fn) {
  _listeners.push(fn);
  fn(getFiltered()); // immediate call with current state
  return () => { _listeners = _listeners.filter((l) => l !== fn); };
}

export function setTasks(tasks) {
  _tasks = tasks;
  notify();
}

export function setFilters(partial) {
  _filters = { ..._filters, ...partial };
  notify();
}

export function getFilters() { return { ..._filters }; }

export function getFiltered() {
  let list = [..._tasks];
  const { status, category, priority, search } = _filters;

  if (status)   list = list.filter((t) => t.status   === status);
  if (category) list = list.filter((t) => t.category === category);
  if (priority) list = list.filter((t) => t.priority === priority);
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q)
    );
  }

  // Sort: overdue first, then by dueDate ascending, then createdAt desc
  list.sort((a, b) => {
    const now = new Date();
    const aOver = a.dueDate && new Date(a.dueDate) < now && a.status !== 'completed';
    const bOver = b.dueDate && new Date(b.dueDate) < now && b.status !== 'completed';
    if (aOver && !bOver) return -1;
    if (!aOver && bOver) return 1;
    if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });

  return list;
}

export function isOverdue(task) {
  if (!task.dueDate || task.status === 'completed') return false;
  const due = new Date(task.dueDate);
  due.setHours(23, 59, 59, 999);
  return due < new Date();
}

export function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}
