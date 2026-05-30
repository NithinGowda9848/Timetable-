const Task = require('../models/Task');

// ─── GET /api/tasks ───────────────────────────────────────────────────────────
async function getTasks(req, res, next) {
  try {
    const { uid } = req.user;
    const { status, category, priority } = req.query;

    const filter = { userId: uid };

    if (status)   filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    console.log(`[Backend] Fetching tasks for user: ${uid}`);
    const tasks = await Task.find(filter);

    // Map Tasks to standard output matching the old Firebase model format
    const mappedTasks = tasks.map((t) => ({
      id: t._id.toString(),
      title: t.title,
      description: t.description,
      dueDate: t.dueDate,
      priority: t.priority,
      category: t.category,
      status: t.status,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));

    res.json({ tasks: mappedTasks });
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/tasks ──────────────────────────────────────────────────────────
async function createTask(req, res, next) {
  try {
    const { uid } = req.user;
    const { title, description, dueDate, priority, category } = req.body;
    console.log(`[Backend] Creating task for user: ${uid}, title: ${title}`);

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required.' });
    }

    const newTask = new Task({
      userId:      uid,
      title:       title.trim(),
      description: description?.trim() || '',
      dueDate:     dueDate || null,
      priority:    priority || 'medium',
      category:    category || 'personal',
      status:      'pending',
    });

    await newTask.save();

    res.status(201).json({
      id:          newTask._id.toString(),
      title:       newTask.title,
      description: newTask.description,
      dueDate:     newTask.dueDate,
      priority:    newTask.priority,
      category:    newTask.category,
      status:      newTask.status,
      createdAt:   newTask.createdAt,
      updatedAt:   newTask.updatedAt,
    });
  } catch (err) {
    next(err);
  }
}

// ─── PUT /api/tasks/:id ───────────────────────────────────────────────────────
async function updateTask(req, res, next) {
  try {
    const { uid } = req.user;
    const { id }  = req.params;

    const task = await Task.findOne({ _id: id, userId: uid });

    if (!task) return res.status(404).json({ error: 'Task not found.' });

    const { title, description, dueDate, priority, category, status } = req.body;

    if (title !== undefined)       task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (dueDate !== undefined)     task.dueDate = dueDate;
    if (priority !== undefined)    task.priority = priority;
    if (category !== undefined)    task.category = category;
    if (status !== undefined)      task.status = status;

    await task.save();

    res.json({
      id:          task._id.toString(),
      title:       task.title,
      description: task.description,
      dueDate:     task.dueDate,
      priority:    task.priority,
      category:    task.category,
      status:      task.status,
      createdAt:   task.createdAt,
      updatedAt:   task.updatedAt,
    });
  } catch (err) {
    next(err);
  }
}

// ─── DELETE /api/tasks/:id ────────────────────────────────────────────────────
async function deleteTask(req, res, next) {
  try {
    const { uid } = req.user;
    const { id }  = req.params;

    const result = await Task.deleteOne({ _id: id, userId: uid });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    res.json({ message: 'Task deleted successfully.' });
  } catch (err) {
    next(err);
  }
}

// ─── PATCH /api/tasks/:id/toggle ─────────────────────────────────────────────
async function toggleTask(req, res, next) {
  try {
    const { uid } = req.user;
    const { id }  = req.params;

    const task = await Task.findOne({ _id: id, userId: uid });

    if (!task) return res.status(404).json({ error: 'Task not found.' });

    task.status = task.status === 'completed' ? 'pending' : 'completed';
    await task.save();

    res.json({ id: task._id.toString(), status: task.status });
  } catch (err) {
    next(err);
  }
}

module.exports = { getTasks, createTask, updateTask, deleteTask, toggleTask };
