import express from "express";
import {createStripeSession, stripeWebhook} from "../controllers/stripeController.js";
import { protectRoute } from "../middleware/protectRoute.js";


const router = express.Router();

router.post('/checkout', protectRoute, createStripeSession);

export default router;


