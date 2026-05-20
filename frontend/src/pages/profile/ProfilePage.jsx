import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaLink } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";

import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";
import { POSTS } from "../../utils/db/dummy";
import { formatMemberSinceDate } from "../../utils/date";
import useFollow from "../../hooks/useFollow";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const ProfilePage = () => {
  const [coverImage, setCoverImg] = useState(null);
  const [profileImage, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);
  const { username } = useParams();

  const { follow, isPending } = useFollow();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const {
    data: user,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await fetch(`/api/users/profile/${username}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
  });

  const { isUpdatingProfile, updateProfile } = useUpdateUserProfile();
  const isMyProfile = authUser._id === user?._id;
  const memberSinceDate = formatMemberSinceDate(user?.createdAt);
  const amIFollowing = authUser?.following.includes(user?._id);

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (state === "coverImage") setCoverImg(reader.result);
        if (state === "profileImage") setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    refetch();
  }, [username, refetch]);

  return (
    <div className="flex flex-col gap-4">
      {(isLoading || isRefetching) && (
        <div className="nn-card overflow-hidden">
          <ProfileHeaderSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && !user && (
        <div className="nn-card p-10 text-center">
          <p className="font-semibold text-slate-900">User not found</p>
        </div>
      )}

      {!isLoading && !isRefetching && user && (
        <>
          <div className="nn-card overflow-hidden">
            {/* Top bar */}
            <div className="flex gap-4 px-5 py-3 items-center border-b border-slate-100">
              <Link
                to="/"
                className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition"
              >
                <FaArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <p className="font-semibold text-slate-900">{user?.fullName}</p>
                <span className="text-xs text-slate-500">
                  {POSTS?.length} posts
                </span>
              </div>
            </div>

            {/* Cover */}
            <div className="relative group/cover">
              <img
                src={coverImage || user?.coverImage || "/cover.png"}
                className="h-56 w-full object-cover"
                alt="cover image"
              />
              {isMyProfile && (
                <button
                  className="absolute top-3 right-3 rounded-full p-2 bg-slate-900/70 hover:bg-slate-900 text-white opacity-0 group-hover/cover:opacity-100 transition"
                  onClick={() => coverImgRef.current.click()}
                >
                  <MdEdit className="w-4 h-4" />
                </button>
              )}
              <input
                type="file"
                hidden
                accept="image/*"
                ref={coverImgRef}
                onChange={(e) => handleImgChange(e, "coverImage")}
              />
              <input
                type="file"
                hidden
                accept="image/*"
                ref={profileImgRef}
                onChange={(e) => handleImgChange(e, "profileImage")}
              />

              {/* Avatar */}
              <div className="absolute -bottom-14 left-5">
                <div className="w-28 h-28 rounded-full ring-4 ring-white overflow-hidden bg-slate-100 relative group/avatar">
                  <img
                    src={
                      profileImage ||
                      user?.profileImage ||
                      "/avatar-placeholder.png"
                    }
                    className="w-full h-full object-cover"
                    alt={user?.fullName}
                  />
                  {isMyProfile && (
                    <button
                      onClick={() => profileImgRef.current.click()}
                      className="absolute bottom-1 right-1 p-1.5 bg-emerald-600 hover:bg-emerald-700 rounded-full opacity-0 group-hover/avatar:opacity-100 transition"
                    >
                      <MdEdit className="w-3.5 h-3.5 text-white" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end px-5 mt-4 gap-2">
              {isMyProfile && <EditProfileModal authUser={authUser} />}
              {!isMyProfile && (
                <button
                  className={
                    amIFollowing
                      ? "nn-btn-ghost"
                      : "nn-btn-primary"
                  }
                  onClick={() => follow(user?._id)}
                >
                  {isPending
                    ? "Loading..."
                    : amIFollowing
                    ? "Unfollow"
                    : "Follow"}
                </button>
              )}
              {(coverImage || profileImage) && (
                <button
                  className="nn-btn-primary"
                  onClick={async () => {
                    await updateProfile({ coverImage, profileImage });
                    setProfileImg(null);
                    setCoverImg(null);
                  }}
                >
                  {isUpdatingProfile ? "Updating..." : "Update"}
                </button>
              )}
            </div>

            {/* User Info */}
            <div className="flex flex-col gap-3 mt-12 px-5 pb-5">
              <div>
                <h2 className="font-display font-bold text-xl text-slate-900">
                  {user?.fullName}
                </h2>
                <p className="text-sm text-slate-500">@{user?.username}</p>
                {user?.bio && (
                  <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                    {user.bio}
                  </p>
                )}
              </div>

              <div className="flex gap-4 flex-wrap text-sm">
                {user?.link && (
                  <div className="flex gap-1.5 items-center">
                    <FaLink className="w-3 h-3 text-emerald-700" />
                    <a
                      href={user?.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 hover:underline"
                    >
                      {user?.link}
                    </a>
                  </div>
                )}
                <div className="flex gap-1.5 items-center text-slate-500">
                  <IoCalendarOutline className="w-4 h-4" />
                  <span>{memberSinceDate}</span>
                </div>
              </div>

              <div className="flex gap-5 pt-2">
                <div className="flex gap-1.5 items-baseline">
                  <span className="font-bold text-slate-900">
                    {user?.following.length}
                  </span>
                  <span className="text-slate-500 text-sm">Following</span>
                </div>
                <div className="flex gap-1.5 items-baseline">
                  <span className="font-bold text-slate-900">
                    {user?.followers.length}
                  </span>
                  <span className="text-slate-500 text-sm">Followers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="nn-card overflow-hidden">
            <div className="flex border-b border-slate-100">
              {[
                { id: "posts", label: "Posts" },
                { id: "likes", label: "Likes" },
              ].map((tab) => {
                const active = feedType === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setFeedType(tab.id)}
                    className={`flex-1 py-3 text-sm font-semibold transition relative ${
                      active
                        ? "text-emerald-700"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`absolute left-1/2 -translate-x-1/2 bottom-0 h-1 w-10 rounded-t-full ${
                        active ? "bg-emerald-600" : "bg-transparent"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <Posts feedType={feedType} username={username} userId={user?._id} />
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
