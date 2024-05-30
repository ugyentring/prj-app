import { BiComment } from "react-icons/bi";
import { BiUpvote } from "react-icons/bi";
import { CiGift } from "react-icons/ci";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const [copySuccess, setCopySuccess] = useState("");

  const copyToClipBoard = async (walletAddress) => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopySuccess("Copied!");
    } catch (err) {
      setCopySuccess("Failed to copy!");
    }
  };

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/${post._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/like/${post._id}`, {
          method: "POST",
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
    onSuccess: (updatedLikes) => {
      queryClient.setQueryData(["posts"], (oldData) => {
        return oldData.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: updatedLikes };
          }
          return p;
        });
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/comment/${post._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: comment }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("You commented on the post");
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: deleteComment, isPending: isDeletingComment } = useMutation({
    mutationFn: async (commentId) => {
      try {
        const res = await fetch(`/api/posts/comment/${post._id}/${commentId}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Comment deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const postOwner = post.user;
  const isLiked = post.likes.includes(authUser._id);

  const isMyPost = authUser._id === post.user._id;
  const formattedDate = formatPostDate(post.createdAt);

  const handleDeletePost = () => {
    deletePost();
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (isCommenting) return;
    commentPost();
  };

  const handleDeleteComment = (commentId) => {
    deleteComment(commentId);
  };

  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  };

  return (
    <div className="flex gap-4 items-start p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="avatar">
        <Link
          to={`/profile/${postOwner.username}`}
          className="w-10 h-10 rounded-full overflow-hidden"
        >
          <img src={postOwner.profileImage || "/avatar-placeholder.png"} />
        </Link>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex gap-2 items-center">
          <Link to={`/profile/${postOwner.username}`} className="font-bold text-lg">
            {postOwner.fullName}
          </Link>
          <span className="text-gray-500 dark:text-gray-400 flex gap-1 text-sm">
            <Link to={`/profile/${postOwner.username}`}>
              @{postOwner.username}
            </Link>
            <span>·</span>
            <span>{formattedDate}</span>
          </span>
          {isMyPost && (
            <span className="flex justify-end flex-1">
              {!isDeleting ? (
                <FaTrash
                  className="cursor-pointer hover:text-red-500"
                  onClick={handleDeletePost}
                />
              ) : (
                <LoadingSpinner size="sm" />
              )}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-3 overflow-hidden ">
          <span className="text-gray-900 dark:text-gray-100">{post.text}</span>
          <span
            className="cursor-pointer bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm font-semibold text-gray-700 dark:text-gray-300"
            onClick={() => copyToClipBoard(post.walletAddress)}
          >
            {post.walletAddress}
          </span>
          {copySuccess && (
            <span className="text-sm text-green-500">{copySuccess}</span>
          )}
          {post.img && (
            <img
              src={post.img}
              className="h-80 object-contain rounded-lg border border-gray-300 dark:border-gray-700"
              alt=""
            />
          )}
        </div>
        <div className="flex justify-between mt-3">
          <div className="flex gap-4 items-center">
            <div
              className="flex gap-1 items-center cursor-pointer group"
              onClick={() =>
                document.getElementById("comments_modal" + post._id).showModal()
              }
            >
              <BiComment className="w-5 h-5 text-gray-500 group-hover:text-blue-500" />
              <span className="text-sm text-gray-500 group-hover:text-blue-500">
                {post.comments.length}
              </span>
              <span className="text-xs text-gray-500">Comment</span>
            </div>
            <dialog
              id={`comments_modal${post._id}`}
              className="modal border-none outline-none"
            >
              <div className="modal-box bg-white border rounded-md border-gray-300 shadow-md p-6">
                <h3 className="font-bold text-lg mb-4">Comments</h3>
                <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                  {post.comments.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No comments yet 🤔 Be the first one 😉
                    </p>
                  )}
                  {post.comments.map((comment) => (
                    <div key={comment._id} className="flex gap-2 items-start">
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img
                            src={
                              comment.user.profileImage ||
                              "/avatar-placeholder.png"
                            }
                          />
                        </div>
                      </div>
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="font-bold">
                              {comment.user.fullName}
                            </span>
                            <span className="text-gray-500 text-sm">
                              @{comment.user.username}
                            </span>
                          </div>
                          {authUser._id === comment.user._id && (
                            <FaTrash
                              className="cursor-pointer hover:text-red-500"
                              onClick={() => handleDeleteComment(comment._id)}
                            />
                          )}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">{comment.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <form
                  className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
                  onSubmit={handlePostComment}
                >
                  <textarea
                    className="textarea w-full p-2 rounded text-md resize-none border focus:outline-none border-gray-300 dark:border-gray-700"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button className="btn btn-success rounded-full btn-sm text-white px-4">
                    {isCommenting ? <LoadingSpinner size="md" /> : "Post"}
                  </button>
                </form>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button className="outline-none">close</button>
              </form>
            </dialog>
            <div
              className="flex gap-1 items-center group cursor-pointer"
              onClick={handleLikePost}
            >
              <BiUpvote className="w-5 h-5 cursor-pointer text-gray-500 group-hover:text-darkgreen group-hover:text-darkgreen" />
              <span className={`text-sm group-hover:text-darkgreen ${isLiked ? "text-darkgreen" : "text-gray-500"}`}>
              {post.likes.length}
              </span>
              <span className="text-xs text-gray-500">Vote</span>
            </div>
          </div>
          <div className="flex justify-end gap-2 items-center">
            <Link to="/model">
              <CiGift className="w-5 h-5 text-gray-500 cursor-pointer" />
            </Link>
            <span className="text-xs text-gray-500">Award</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
