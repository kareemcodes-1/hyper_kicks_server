import express from "express";
import { getAllCustomers } from "../controllers/customerController.js";
import { adminMiddleware } from "../middleware/protectRoute.js";

const router = express.Router();

router.get('/', adminMiddleware, getAllCustomers);

export default router;