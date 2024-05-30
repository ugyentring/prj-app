import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useState } from "react";

import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import LoadingSpinner from "./LoadingSpinner";

import useFollow from "../../hooks/useFollow";

const RightPanel = () => {
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/suggested");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const { follow, isPending } = useFollow();

  const [followedUsers, setFollowedUsers] = useState([]);

  const handleFollow = (userId) => {
    follow(userId);
    setFollowedUsers([...followedUsers, userId]);
  };

  if (suggestedUsers?.length === 0) return null;

  return (
    <div className="hidden lg:block my-4 mx-2">
      <div className="bg-white p-4 rounded-md sticky top-2">
        <p className="font-bold text-lg mb-2">Who to follow</p>
        <div className="space-y-4">
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!isLoading &&
            suggestedUsers?.map((user) => (
              <div key={user._id} className="flex items-center justify-between">
                <Link to={`/profile/${user.username}`} className="flex items-center gap-4">
                  <div className="avatar w-8 h-8">
                    <img
                      src={user.profileImage || "/avatar-placeholder.png"}
                      alt={`Avatar of ${user.fullName}`}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <p className="font-semibold tracking-tight truncate w-32 text-gray-800">
                      {user.fullName}
                    </p>
                    <p className="text-sm text-gray-600">@{user.username}</p>
                  </div>
                </Link>
                <button
                  className={`btn ${
                    followedUsers.includes(user._id)
                      ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                      : "bg-green-700 text-white"
                  } hover:bg-white hover:text-black hover:opacity-90 rounded-full btn-sm`}
                  onClick={() => handleFollow(user._id)}
                  disabled={followedUsers.includes(user._id)}
                >
                  {isPending && followedUsers.includes(user._id) ? (
                    <LoadingSpinner />
                  ) : (
                    "Follow"
                  )}
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
