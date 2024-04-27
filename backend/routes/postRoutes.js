import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import {
  commentPost,
  createPost,
  deletePost,
  getAllPosts,
  getLikedPosts,
  getFollowingPosts,
  likeUnlikePost,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/all", protectRoute, getAllPosts);
router.get("/liked/:id", protectRoute, getLikedPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentPost);
router.delete("/:id", protectRoute, deletePost);

export default router;
