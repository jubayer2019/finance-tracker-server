const express = require('express');
const router = express.Router();
const { getTransactions, createTransaction, deleteTransaction, getDashboardSummary } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getTransactions)
  .post(createTransaction);

router.route('/:id')
  .delete(deleteTransaction);

router.get('/summary/analytics', getDashboardSummary);

module.exports = router;