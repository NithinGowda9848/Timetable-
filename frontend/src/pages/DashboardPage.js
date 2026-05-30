import { renderShell } from '../components/AppShell.js';
import { getStats } from '../services/apiService.js';
import { navigate } from '../router.js';
import { showToast } from '../utils/toast.js';

export function DashboardPage(container) {
  const pageContainer = renderShell(container, 'dashboard');
  
  async function loadDashboard() {
    pageContainer.innerHTML = `
      <div class="spinner-overlay"><div class="spinner"></div></div>
    `;

    try {
      const stats = await getStats();
      render(stats);
    } catch (err) {
      showToast(err.message, 'error');
      pageContainer.innerHTML = `
        <div class="empty-state">
          <h3>Failed to load dashboard</h3>
          <p>${err.message}</p>
          <button class="btn btn-primary" id="retry-btn">Retry</button>
        </div>
      `;
      document.getElementById('retry-btn')?.addEventListener('click', loadDashboard);
    }
  }

  function render(stats) {
    pageContainer.innerHTML = `
      <div class="dashboard-view">
        <header class="page-header" style="margin-bottom: var(--sp-8);">
          <h2 style="font-size: var(--text-2xl); font-weight: 800;">Welcome back!</h2>
          <p style="color: var(--clr-text-muted);">Here's what's happening with your tasks today.</p>
        </header>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon" style="background: var(--clr-primary-lt); color: var(--clr-primary);">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
            <div class="stat-value">${stats.total}</div>
            <div class="stat-label">Total Tasks</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: var(--clr-success-lt); color: var(--clr-success);">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            </div>
            <div class="stat-value">${stats.completed}</div>
            <div class="stat-label">Completed</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: var(--clr-warning-lt); color: var(--clr-warning);">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div class="stat-value">${stats.pending}</div>
            <div class="stat-label">Pending</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: var(--clr-danger-lt); color: var(--clr-danger);">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <div class="stat-value">${stats.overdue}</div>
            <div class="stat-label">Overdue</div>
          </div>
        </div>

        <div class="progress-bar-wrap">
          <div class="progress-bar-header">
            <h3>Completion Progress</h3>
            <span class="progress-pct">${stats.progress}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${stats.progress}%"></div>
          </div>
        </div>

        <div class="dashboard-actions" style="display: flex; gap: var(--sp-4);">
          <button class="btn btn-primary" id="go-to-tasks">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
            Manage Tasks
          </button>
        </div>
      </div>
    `;

    document.getElementById('go-to-tasks')?.addEventListener('click', () => navigate('#/tasks'));
  }

  loadDashboard();
}
