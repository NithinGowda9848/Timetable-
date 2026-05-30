const express = require('express');
const router  = express.Router();
const { verifyToken } = require('../middleware/auth');
const { getStats }    = require('../controllers/statsController');

router.use(verifyToken);

router.get('/', getStats); // GET /api/stats

module.exports = router;
