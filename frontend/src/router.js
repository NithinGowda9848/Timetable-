/**
 * Minimal hash-based SPA router.
 * Usage: router.register('#/dashboard', DashboardPage)
 *        router.start()
 */

const routes = new Map();
let currentCleanup = null;
const app = () => document.getElementById('app');

export function register(hash, PageFn) {
  routes.set(hash, PageFn);
}

export function navigate(hash) {
  window.location.hash = hash;
}

function render() {
  const hash = window.location.hash || '#/auth';

  // Run cleanup from previous page if any
  if (typeof currentCleanup === 'function') {
    currentCleanup();
    currentCleanup = null;
  }

  const PageFn = routes.get(hash) || routes.get('#/auth');
  if (!PageFn) return;

  const el = app();
  if (!el) return;
  el.innerHTML = '';

  // PageFn returns optional cleanup function
  currentCleanup = PageFn(el) || null;
}

export function start() {
  window.addEventListener('hashchange', render);
  render();
}
