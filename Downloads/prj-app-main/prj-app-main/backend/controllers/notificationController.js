import Notification from "../models/notifyModel.js";

//logic to get the the notifications
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "username",
    });

    await Notification.updateMany({ to: userId }, { read: true });

    res.status(200).json(notifications);
  } catch (error) {
    console.log("Error in the getNotifications controller: ", error.message);
    res.status(500).json("Internal server error");
  }
};

//logic to delete notifications
export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.deleteMany({ to: userId });

    res.status(200).json({ message: "Notifications deleted successfully" });
  } catch (error) {
    console.log("Error in the deleteNotifications controller: ", error.message);
    res.status(500).json("Internal server error");
  }
};
