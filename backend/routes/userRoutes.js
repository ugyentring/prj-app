import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import {
  getUserProfile,
  followUnfollow,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
// router.get("/sugested", protectRoute, getUserProfile);
router.post("/follow/:id", protectRoute, followUnfollow);
// router.post("/pudate", protectRoute, updateUserProfile);

export default router;
