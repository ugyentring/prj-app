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
  getUserPosts,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/all", protectRoute, getAllPosts);
router.get("/likes/:id", protectRoute, getLikedPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/user/:username", getUserPosts);
router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentPost);
router.delete("/:id", protectRoute, deletePost);

export default router;
