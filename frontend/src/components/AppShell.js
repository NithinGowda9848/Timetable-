import { logout, currentUser } from '../services/authService.js';
import { navigate }            from '../router.js';
import { showToast }           from '../utils/toast.js';
import * as store              from '../store/taskStore.js';

/**
 * Renders the persistent app shell (sidebar + topbar).
 * Returns the main content area element for page injection.
 */
export function renderShell(container, activePage = 'dashboard') {
  const user = currentUser();
  const initial = (user?.displayName || user?.email || 'U')[0].toUpperCase();
  const filters = store.getFilters();
  const activeCategory = activePage === 'tasks' ? filters.category : null;

  container.innerHTML = `
    <div class="app-shell">
      <!-- Sidebar -->
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-brand">
          <div class="brand-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
          </div>
          <div><h1>TaskFlow</h1></div>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-section-label">Menu</div>
          <div class="nav-item ${activePage === 'dashboard' ? 'active' : ''}" data-nav="#/dashboard">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            Dashboard
          </div>
          <div class="nav-item ${activePage === 'tasks' && !activeCategory ? 'active' : ''}" data-nav="#/tasks">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            My Tasks
          </div>

          <div class="nav-section-label" style="margin-top:1rem;">Categories</div>
          ${['Work','Personal','Study','Health','Other'].map(cat => `
            <div class="nav-item ${activePage === 'tasks' && activeCategory === cat.toLowerCase() ? 'active' : ''}" data-nav="#/tasks" data-category="${cat.toLowerCase()}">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/></svg>
              ${cat}
            </div>
          `).join('')}
        </nav>

        <div class="sidebar-user">
          <div class="user-avatar">${initial}</div>
          <div class="user-info">
            <div class="user-name">${user?.displayName || 'User'}</div>
            <div class="user-email">${user?.email || ''}</div>
          </div>
          <button class="btn-logout" id="btn-logout" title="Logout">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"/></svg>
          </button>
        </div>
      </aside>

      <!-- Main -->
      <div class="main-content">
        <header class="topbar">
          <button class="hamburger" id="hamburger" aria-label="Toggle menu">
            <span></span><span></span><span></span>
          </button>
          <span class="topbar-title" id="topbar-title">
            ${activePage === 'dashboard' ? 'Dashboard' : 'My Tasks'}
          </span>
          <div class="search-box" id="search-box" style="${activePage !== 'tasks' ? 'display:none' : ''}">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35"/></svg>
            <input type="text" id="search-input" placeholder="Search tasks…" autocomplete="off"/>
          </div>
        </header>
        <main id="page-content" class="page"></main>
      </div>
    </div>
  `;

  // Hamburger toggle
  document.getElementById('hamburger')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.toggle('open');
  });

  // Nav links
  container.querySelectorAll('[data-nav]').forEach((el) => {
    el.addEventListener('click', () => {
      const hash     = el.dataset.nav;
      const category = el.dataset.category;
      
      if (hash === '#/tasks') {
        if (category) {
          store.setFilters({ category, status: '', priority: '', search: '' });
        } else {
          store.setFilters({ category: '', status: '', priority: '', search: '' });
        }
      }
      
      navigate(hash);
      document.getElementById('sidebar')?.classList.remove('open');
    });
  });

  // Logout
  document.getElementById('btn-logout')?.addEventListener('click', async () => {
    await logout();
    showToast('Logged out successfully.', 'success');
    navigate('#/auth');
  });

  return document.getElementById('page-content');
}
