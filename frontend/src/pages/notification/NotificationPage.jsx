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
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
  });

  const { mutate: deleteNotifications } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/notifications", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      toast.success("Notifications cleared");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <div className="nn-card overflow-hidden">
      <div className="flex justify-between items-center p-5 border-b border-slate-100">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900">
            Notifications
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Activity from people you follow.
          </p>
        </div>
        <details className="relative">
          <summary className="list-none cursor-pointer w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition">
            <IoSettingsOutline className="w-5 h-5" />
          </summary>
          <div className="absolute right-0 mt-2 w-56 nn-card p-2 z-10">
            <button
              onClick={deleteNotifications}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition"
            >
              Delete all notifications
            </button>
          </div>
        </details>
      </div>

      <div>
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {!isLoading && notifications?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
              <BiUpvote className="w-7 h-7 text-slate-400" />
            </div>
            <p className="font-semibold text-slate-900">All caught up</p>
            <p className="text-sm text-slate-500 mt-1">
              No new notifications right now.
            </p>
          </div>
        )}
        {notifications?.map((notification) => (
          <div
            key={notification._id}
            className="flex items-center gap-4 px-5 py-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60 transition"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                notification.type === "follow"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              {notification.type === "follow" ? (
                <FaRegUser className="w-4 h-4" />
              ) : (
                <BiUpvote className="w-5 h-5" />
              )}
            </div>
            <Link
              to={`/profile/${notification.from.username}`}
              className="flex items-center gap-3 min-w-0 flex-1"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={
                    notification.from.profileImg || "/avatar-placeholder.png"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm">
                  <span className="font-semibold text-slate-900">
                    @{notification.from.username}
                  </span>{" "}
                  <span className="text-slate-500">
                    {notification.type === "follow"
                      ? "started following you"
                      : "liked your post"}
                  </span>
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
