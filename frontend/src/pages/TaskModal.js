import * as api from '../services/apiService.js';
import { showToast } from '../utils/toast.js';

export function TaskModal(container, task = null, onSave = () => {}) {
  const isEdit = !!task;
  
  function render() {
    container.innerHTML = `
      <div class="modal-overlay open" id="task-modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h2 class="modal-title">${isEdit ? 'Edit Task' : 'Add New Task'}</h2>
            <button class="icon-btn" id="close-modal">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <form id="task-form">
            <div class="form-group">
              <label class="form-label" for="task-title">Title</label>
              <input class="form-input" id="task-title" type="text" placeholder="What needs to be done?" required value="${task?.title || ''}">
            </div>
            <div class="form-group">
              <label class="form-label" for="task-desc">Description</label>
              <textarea class="form-textarea" id="task-desc" placeholder="Add more details...">${task?.description || ''}</textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="task-due">Due Date</label>
                <input class="form-input" id="task-due" type="date" value="${task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}">
              </div>
              <div class="form-group">
                <label class="form-label" for="task-priority">Priority</label>
                <select class="form-select" id="task-priority">
                  <option value="low" ${task?.priority === 'low' ? 'selected' : ''}>Low</option>
                  <option value="medium" ${task?.priority === 'medium' || !task ? 'selected' : ''}>Medium</option>
                  <option value="high" ${task?.priority === 'high' ? 'selected' : ''}>High</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="task-category">Category</label>
              <select class="form-select" id="task-category">
                <option value="personal" ${task?.category === 'personal' || !task ? 'selected' : ''}>Personal</option>
                <option value="work" ${task?.category === 'work' ? 'selected' : ''}>Work</option>
                <option value="study" ${task?.category === 'study' ? 'selected' : ''}>Study</option>
                <option value="health" ${task?.category === 'health' ? 'selected' : ''}>Health</option>
                <option value="other" ${task?.category === 'other' ? 'selected' : ''}>Other</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-ghost" id="cancel-modal">Cancel</button>
              <button type="submit" class="btn btn-primary" id="save-task-btn">
                ${isEdit ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    bindEvents();
  }

  function close() {
    const overlay = document.getElementById('task-modal-overlay');
    if (overlay) {
      overlay.classList.remove('open');
      setTimeout(() => container.innerHTML = '', 300);
    }
  }

  function bindEvents() {
    document.getElementById('close-modal')?.addEventListener('click', close);
    document.getElementById('cancel-modal')?.addEventListener('click', close);
    
    document.getElementById('task-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = {
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-desc').value,
        dueDate: document.getElementById('task-due').value || null,
        priority: document.getElementById('task-priority').value,
        category: document.getElementById('task-category').value,
      };

      const btn = document.getElementById('save-task-btn');
      btn.disabled = true;
      btn.textContent = 'Saving...';

      try {
        if (isEdit) {
          await api.updateTask(task.id, formData);
          showToast('Task updated', 'success');
        } else {
          await api.createTask(formData);
          showToast('Task created', 'success');
        }
        onSave();
        close();
      } catch (err) {
        showToast(err.message, 'error');
        btn.disabled = false;
        btn.textContent = isEdit ? 'Save Changes' : 'Create Task';
      }
    });
  }

  render();
}
