import express from "express";
import { getDashboardAnalyticsController } from "../controllers/dashboardAnalyticsControllers.js";
const router = express.Router();

router.get("/dashboard", getDashboardAnalyticsController);

export default router;
