import User from "../models/userModel.js";

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
