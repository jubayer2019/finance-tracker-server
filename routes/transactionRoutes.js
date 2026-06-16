import express from "express";
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
  getDashboardSummary,
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getTransactions).post(createTransaction);

router.route("/:id").delete(deleteTransaction);

router.get("/summary/analytics", getDashboardSummary);

export default router;
