import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import Notification from "../models/notifyModel.js";
import { v2 as cloudinary } from "cloudinary";

// create post logic
export const createPost = async (req, res) => {
  try {
    const { walletAddress, text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // user cannot post empty inputs
    if (!text && !img && !walletAddress) {
      return res
        .status(400)
        .json({ error: "Post must have text, image, and wallet address" });
    }

    // upload image to Cloudinary
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    // if everything is fine, create and save in the database
    const newPost = new Post({
      user: userId,
      walletAddress,
      text,
      img,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error in createPost: ", error);
  }
};

//delete your post logic
export const deletePost = async (req, res) => {
  try {
    //find post by ID
    const post = await Post.findById(req.params.id);

    //check if post exists
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    //you can only delete your post
    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete the post" });
    }

    //delete image from cloudinary too
    const imageId = post.img.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(imageId);

    //delete from database
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error in delete post controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//comment on a post
export const commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({ error: "Text feild is required" });
    }
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = { user: userId, text };

    post.comments.push(comment);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.log("Error in the commentPost controller: ", error);
    res.status(500).json("Internal server error");
  }
};

//like/unlike post
export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      //unlike if you already liked
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      return res.status(200).json({ message: "Post unliked successfully" });
    } else {
      //like if it isnt liked ulready
      post.likes.push(userId);
      await post.save();
    }

    const notification = new Notification({
      from: userId,
      to: post.user,
      type: "like",
    });
    await notification.save();

    return res.status(200).json({ message: "Post Liked successfully" });
  } catch (error) {
    console.log("Error in the likeUnlikePost controller: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//getting all the post
export const getAllPosts = async (req, res) => {
  
}