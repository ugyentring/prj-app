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
