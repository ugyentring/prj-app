import Post from "../models/postModel.js";
import User from "../models/userModel.js";
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
  
  }