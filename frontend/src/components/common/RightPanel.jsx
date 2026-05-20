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
    <aside className="hidden lg:block w-80 shrink-0 py-4">
      <div className="sticky top-4 flex flex-col gap-4">
        <div className="nn-card p-5">
          <p className="font-display font-bold text-base text-slate-900 mb-4">
            Who to follow
          </p>
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
              suggestedUsers?.map((user) => {
                const isFollowed = followedUsers.includes(user._id);
                return (
                  <div
                    key={user._id}
                    className="flex items-center justify-between gap-3"
                  >
                    <Link
                      to={`/profile/${user.username}`}
                      className="flex items-center gap-3 min-w-0"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0">
                        <img
                          src={user.profileImage || "/avatar-placeholder.png"}
                          alt={`Avatar of ${user.fullName}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate text-slate-900">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          @{user.username}
                        </p>
                      </div>
                    </Link>
                    <button
                      className={
                        isFollowed
                          ? "rounded-full bg-slate-100 text-slate-500 px-4 py-1.5 text-xs font-semibold cursor-not-allowed"
                          : "rounded-full bg-slate-900 hover:bg-emerald-600 text-white px-4 py-1.5 text-xs font-semibold transition"
                      }
                      onClick={() => handleFollow(user._id)}
                      disabled={isFollowed}
                    >
                      {isPending && isFollowed ? (
                        <LoadingSpinner size="sm" />
                      ) : isFollowed ? (
                        "Following"
                      ) : (
                        "Follow"
                      )}
                    </button>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="nn-card p-5">
          <p className="font-display font-bold text-base text-slate-900 mb-2">
            About NorbNode
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            A decentralized social space where ideas are upvoted and creators
            get rewarded on-chain.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="nn-chip">Web3</span>
            <span className="nn-chip">Social</span>
            <span className="nn-chip">Rewards</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightPanel;
