import { renderShell } from '../components/AppShell.js';
import * as api from '../services/apiService.js';
import * as store from '../store/taskStore.js';
import { showToast } from '../utils/toast.js';

export function TasksPage(container) {
  const pageContainer = renderShell(container, 'tasks');
  let unsubscribe = null;

  async function loadTasks() {
    pageContainer.innerHTML = `<div class="spinner-overlay"><div class="spinner"></div></div>`;
    try {
      const { tasks } = await api.getTasks();
      store.setTasks(tasks);
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  function render(tasks) {
    const filters = store.getFilters();
    
    // Sync sidebar active styling to match store filters
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.querySelectorAll('.nav-item').forEach(item => {
        const itemHash = item.dataset.nav;
        const itemCat = item.dataset.category;
        let isActive = false;
        if (itemHash === '#/tasks') {
          if (itemCat) {
            isActive = (filters.category === itemCat);
          } else {
            isActive = (!filters.category);
          }
        } else if (itemHash === '#/dashboard') {
          isActive = false;
        }
        
        if (isActive) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
    
    pageContainer.innerHTML = `
      <div class="tasks-view">
        <div class="tasks-header">
          <h2>My Tasks</h2>
          <button class="btn btn-primary" id="add-task-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
            Add Task
          </button>
        </div>

        <div class="filter-bar">
          <select class="filter-select" id="filter-status">
            <option value="">All Status</option>
            <option value="pending" ${filters.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="completed" ${filters.status === 'completed' ? 'selected' : ''}>Completed</option>
          </select>
          <select class="filter-select" id="filter-category">
            <option value="">All Categories</option>
            <option value="work" ${filters.category === 'work' ? 'selected' : ''}>Work</option>
            <option value="personal" ${filters.category === 'personal' ? 'selected' : ''}>Personal</option>
            <option value="study" ${filters.category === 'study' ? 'selected' : ''}>Study</option>
            <option value="health" ${filters.category === 'health' ? 'selected' : ''}>Health</option>
            <option value="other" ${filters.category === 'other' ? 'selected' : ''}>Other</option>
          </select>
          <select class="filter-select" id="filter-priority">
            <option value="">All Priorities</option>
            <option value="high" ${filters.priority === 'high' ? 'selected' : ''}>High</option>
            <option value="medium" ${filters.priority === 'medium' ? 'selected' : ''}>Medium</option>
            <option value="low" ${filters.priority === 'low' ? 'selected' : ''}>Low</option>
          </select>
          <button class="btn btn-ghost" id="clear-filters" style="${!filters.status && !filters.category && !filters.priority && !filters.search ? 'display:none' : ''}">Clear</button>
        </div>

        <div class="task-list">
          ${tasks.length === 0 ? `
            <div class="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              <h3>No tasks found</h3>
              <p>Try adjusting your filters or add a new task to get started.</p>
            </div>
          ` : tasks.map(task => renderTask(task)).join('')}
        </div>
      </div>

      <!-- Task Modal placeholder -->
      <div id="modal-container"></div>
    `;

    bindEvents();
  }

  function renderTask(task) {
    const overdue = store.isOverdue(task);
    const dateStr = store.formatDate(task.dueDate);

    return `
      <div class="task-card priority-${task.priority} ${task.status === 'completed' ? 'completed' : ''} ${overdue ? 'overdue' : ''}" data-id="${task.id}">
        <div class="task-checkbox ${task.status === 'completed' ? 'checked' : ''}" data-action="toggle">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
        </div>
        <div class="task-body" data-action="edit">
          <div class="task-title">${task.title}</div>
          ${task.description ? `<div class="task-desc">${task.description}</div>` : ''}
          <div class="task-meta">
            <span class="badge badge-category">${task.category}</span>
            <span class="badge badge-${task.priority}">${task.priority}</span>
            ${dateStr ? `<span class="badge badge-due">${dateStr}</span>` : ''}
            ${overdue ? `<span class="badge badge-overdue">Overdue</span>` : ''}
          </div>
        </div>
        <div class="task-actions">
          <button class="icon-btn danger" data-action="delete" title="Delete task">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      </div>
    `;
  }

  function bindEvents() {
    document.getElementById('add-task-btn')?.addEventListener('click', () => openTaskModal());
    
    document.getElementById('filter-status')?.addEventListener('change', (e) => store.setFilters({ status: e.target.value }));
    document.getElementById('filter-category')?.addEventListener('change', (e) => store.setFilters({ category: e.target.value }));
    document.getElementById('filter-priority')?.addEventListener('change', (e) => store.setFilters({ priority: e.target.value }));
    document.getElementById('clear-filters')?.addEventListener('click', () => store.setFilters({ status: '', category: '', priority: '', search: '' }));

    // Global search input in topbar
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.value = store.getFilters().search;
      searchInput.oninput = (e) => store.setFilters({ search: e.target.value });
    }

    // Task actions
    pageContainer.querySelectorAll('.task-card').forEach(card => {
      const id = card.dataset.id;
      
      card.addEventListener('click', async (e) => {
        const action = e.target.closest('[data-action]')?.dataset.action;
        if (!action) return;

        if (action === 'toggle') {
          try {
            await api.toggleTask(id);
            const { tasks } = await api.getTasks();
            store.setTasks(tasks);
          } catch (err) {
            showToast(err.message, 'error');
          }
        } else if (action === 'edit') {
          const task = store.getFiltered().find(t => t.id === id);
          openTaskModal(task);
        } else if (action === 'delete') {
          if (confirm('Are you sure you want to delete this task?')) {
            try {
              await api.deleteTask(id);
              const { tasks } = await api.getTasks();
              store.setTasks(tasks);
              showToast('Task deleted', 'success');
            } catch (err) {
              showToast(err.message, 'error');
            }
          }
        }
      });
    });
  }

  function openTaskModal(task = null) {
    const modalContainer = document.getElementById('modal-container');
    import('./TaskModal.js').then(m => {
      m.TaskModal(modalContainer, task, async () => {
        const { tasks } = await api.getTasks();
        store.setTasks(tasks);
      });
    });
  }

  unsubscribe = store.subscribe(render);
  loadTasks();

  return () => {
    if (unsubscribe) unsubscribe();
  };
}
