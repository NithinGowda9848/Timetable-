const Task = require('../models/Task');

/**
 * GET /api/stats
 * Returns productivity statistics for the authenticated user.
 */
async function getStats(req, res, next) {
  try {
    const { uid } = req.user;

    const tasks = await Task.find({ userId: uid });

    const total     = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const pending   = tasks.filter((t) => t.status === 'pending').length;
    const progress  = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Overdue: pending tasks where dueDate < today
    const today   = new Date();
    today.setHours(0, 0, 0, 0);
    const overdue = tasks.filter((t) => {
      if (t.status === 'completed' || !t.dueDate) return false;
      return new Date(t.dueDate) < today;
    }).length;

    // Priority breakdown
    const byPriority = {
      high:   tasks.filter((t) => t.priority === 'high').length,
      medium: tasks.filter((t) => t.priority === 'medium').length,
      low:    tasks.filter((t) => t.priority === 'low').length,
    };

    // Category breakdown
    const byCategory = tasks.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {});

    res.json({ total, completed, pending, overdue, progress, byPriority, byCategory });
  } catch (err) {
    next(err);
  }
}

module.exports = { getStats };
