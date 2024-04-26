import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { createPost } from "../controllers/postController.js";

const router = express.Router();

router.post("/create", protectRoute, createPost);
// router.post("/like/:id", protectRoute, likeUnlikePost);
// router.post("/comment/:id", protectRoute, commentPost);
// router.delete("/delete", protectRoute, deletePost);

export default router;
