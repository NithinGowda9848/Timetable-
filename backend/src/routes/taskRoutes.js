const express = require('express');
const router  = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
} = require('../controllers/taskController');

// All task routes require a valid Firebase token
router.use(verifyToken);

router.get('/',              getTasks);    // GET    /api/tasks
router.post('/',             createTask);  // POST   /api/tasks
router.put('/:id',           updateTask);  // PUT    /api/tasks/:id
router.delete('/:id',        deleteTask);  // DELETE /api/tasks/:id
router.patch('/:id/toggle',  toggleTask);  // PATCH  /api/tasks/:id/toggle

module.exports = router;
