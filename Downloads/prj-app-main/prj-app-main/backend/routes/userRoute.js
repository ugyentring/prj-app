import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import {
  getUserProfile,
  followUnfollow,
  getSugestedUsers,
  updateUserProfile
} from "../controllers/userController.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSugestedUsers);
router.post("/follow/:id", protectRoute, followUnfollow);
router.post("/update", protectRoute, updateUserProfile);

export default router;
