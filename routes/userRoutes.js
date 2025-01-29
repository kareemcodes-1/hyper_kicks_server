import express from "express";
import {getUserProfile, loginUser, registerUser, updateUserProfile} from "../controllers/userController.js";
import { Logout } from "../controllers/userController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/logout', Logout);
router.route('/profile/:id').get(getUserProfile).put(updateUserProfile);

export default router;