//pacakages import
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

//models import
import User from "../models/userModel.js";
import Notification from "../models/notifyModel.js";

//controller to get user profile used in the userRoutes
export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in the getUserProfile: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

//function to follow or unfollow users
export const followUnfollow = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res.status(400).json({ error: "You can't follow yourself" });
    }

    if (!userToModify || !currentUser)
      return res.status(400).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      //unfollow user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      //follow user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      //send notifiaction to that user u follow
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      });

      //save notification in the database
      await newNotification.save();

      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.log("Error in the followUnfollow: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

//function to get the suggestion of users
export const getSugestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    const usersFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      { $sample: { size: 10 } },
    ]);

    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);

    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log("Error in the getSuggestedUsers: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

//updating user profile
export const updateUserProfile = async (req, res) => {
  const { fullName, email, username, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImage, coverImage } = req.body;

  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    //check to let user provide both current and new password
    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res
        .status(400)
        .json({ Error: "Please provide bot current and the new password" });
    }

    //check to see if the current password is correct
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res.status(400).json({ error: "Current password is incorrect" });
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Passoword must be atleast 6 characters" });
      }
      //hash the new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    //profile image update - this image goes to cloudinary
    if (profileImage) {
      //delete the old profile from cloudinary
      if (user.profileImage) {
        await cloudinary.uploader.destroy(
          user.profileImage.split("/").pop().split(".")[0]
        );
      }
      //then upload the new one
      const uploadedResponse = await cloudinary.uploader.upload(profileImage);
      profileImage = uploadedResponse.secure_url;
    }

    //cover image update - image goes to cloudinary
    if (coverImage) {
      if (user.coverImage) {
        await cloudinary.uploader.destroy(
          user.coverImage.split("/").pop().split(".")[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(coverImage);
      coverImage = uploadedResponse;
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImage = profileImage || user.profileImage;
    user.coverImage = coverImage || user.coverImage;

    //now save the update to the database
    user = await user.save();

    //password should be null in response
    user.password = null;

    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in update: ", error.message);
    res.status(500).json({ error: error.message });
  }
};
