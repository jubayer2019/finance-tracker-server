const express = require("express");
const router = express.Router();

const controller = require("../controllers/transactionController");
const auth = require("../middleware/authMiddleware");

/**
 * Protected routes
 */
router.use(auth);

router.post("/", controller.createTransaction);
router.get("/", controller.getTransactions);
router.delete("/:id", controller.deleteTransaction);
router.get("/summary/monthly", controller.getMonthlySummary);

module.exports = router;