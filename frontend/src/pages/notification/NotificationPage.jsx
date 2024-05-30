import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { BiUpvote } from "react-icons/bi";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const NotificationPage = () => {
  const queryClient = useQueryClient();
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const { mutate: deleteNotifications } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/notifications", {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Notifications deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="flex flex-col h-screen w-full max-w-screen-xl mx-auto">
      <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gradient-to-r from-green-700 to-green-900 text-white">
        <h1 className="font-bold text-2xl">Notifications</h1>
        <div className="dropdown ">
          <div tabIndex={0} role="button" className="m-1">
            <IoSettingsOutline className="w-4" />
          </div>
          <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <button
                onClick={deleteNotifications}
                className="text-black hover:text-gray-900"
              >
                Delete all notifications
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex justify-center items-center h-full">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {!isLoading && notifications?.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <p className="font-bold text-gray-600">No notifications 🤔</p>
          </div>
        )}
        {notifications?.map((notification) => (
          <div
            key={notification._id}
            className="border-b border-gray-300 px-6 py-4"
          >
            <div className="flex items-center">
              {notification.type === "follow" ? (
                <FaRegUser className="w-8 h-8 text-green-700 mr-4" />
              ) : (
                <BiUpvote className="w-8 h-8 text-green-300 mr-4" />
              )}
              <div className="flex flex-col">
                <Link
                  to={`/profile/${notification.from.username}`}
                  className="flex items-center space-x-1"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={notification.from.profileImg || "/avatar-placeholder.png"}
                      alt="Profile"
                    />
                  </div>
                  <span className="font-bold">@{notification.from.username}</span>
                </Link>
                <span className="text-gray-600">
                  {notification.type === "follow"
                    ? "followed you"
                    : "liked your post"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
