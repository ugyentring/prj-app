import { BiComment, BiUpvote } from "react-icons/bi";
import { CiGift } from "react-icons/ci";
import { FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { ethers } from "ethers";
import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date";
import { contractAbi, contractAddress } from "../../constants/constant.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAwardDialogOpen, setIsAwardDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const navigate = useNavigate();

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []);

  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setIsConnected(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Metamask is not detected in the browser");
    }
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
    } else {
      setIsConnected(false);
      setAccount(null);
    }
  }

  async function addToBlockchain(e) {
    e.preventDefault();
    try {
      if (!provider) return;
      const receiver = e.target.walletAddress.value;
      const amountEth = e.target.amount.value.trim();
      const amountWei = ethers.utils.parseEther(amountEth);
      const message = e.target.message.value;
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );
      const transaction = await contractInstance.addToBlockchain(
        receiver,
        amountWei,
        message,
        { value: amountWei }
      );
      await transaction.wait();
      navigate("/");
    } catch (error) {
      console.error("Error executing addToBlockchain:", error);
    }
  }

  const copyToClipBoard = async (walletAddress) => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopySuccess("Copied!");
      setTimeout(() => setCopySuccess(""), 1500);
    } catch (err) {
      setCopySuccess("Failed to copy!");
    }
  };

  const postOwner = post.user;
  const isLiked = post.likes.includes(authUser._id);

  const isMyPost = authUser._id === post.user._id;
  const formattedDate = formatPostDate(post.createdAt);

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/posts/${post._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/posts/like/${post._id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: (updatedLikes) => {
      queryClient.setQueryData(["posts"], (oldData) => {
        return oldData.map((p) =>
          p._id === post._id ? { ...p, likes: updatedLikes } : p
        );
      });
    },
    onError: (error) => toast.error(error.message),
  });

  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/posts/comment/${post._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      toast.success("You commented on the post");
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => toast.error(error.message),
  });

  const { mutate: deleteComment, isPending: isDeletingComment } = useMutation({
    mutationFn: async (commentId) => {
      const res = await fetch(`/api/posts/comment/${post._id}/${commentId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      toast.success("Comment deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleDeletePost = () => deletePost();
  const handlePostComment = (e) => {
    e.preventDefault();
    if (isCommenting) return;
    commentPost();
  };
  const handleDeleteComment = (commentId) => deleteComment(commentId);
  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  };

  const shortAddress = post.walletAddress
    ? `${post.walletAddress.slice(0, 6)}...${post.walletAddress.slice(-4)}`
    : "";

  return (
    <article className="flex gap-4 items-start p-5 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition">
      <Link
        to={`/profile/${postOwner.username}`}
        className="w-11 h-11 rounded-full overflow-hidden bg-slate-100 shrink-0"
      >
        <img
          src={postOwner.profileImage || "/avatar-placeholder.png"}
          alt={postOwner.fullName}
          className="w-full h-full object-cover"
        />
      </Link>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex gap-2 items-center">
          <Link
            to={`/profile/${postOwner.username}`}
            className="font-semibold text-slate-900 hover:underline"
          >
            {postOwner.fullName}
          </Link>
          <span className="text-slate-400 text-sm flex gap-1.5 items-center">
            <Link
              to={`/profile/${postOwner.username}`}
              className="hover:underline"
            >
              @{postOwner.username}
            </Link>
            <span>·</span>
            <span>{formattedDate}</span>
          </span>
          {isMyPost && (
            <span className="ml-auto">
              {!isDeleting ? (
                <button
                  className="p-2 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition"
                  onClick={handleDeletePost}
                  aria-label="Delete post"
                >
                  <FaTrash className="w-3.5 h-3.5" />
                </button>
              ) : (
                <LoadingSpinner size="sm" />
              )}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3 mt-1">
          {post.text && (
            <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">
              {post.text}
            </p>
          )}
          {post.walletAddress && (
            <button
              type="button"
              onClick={() => copyToClipBoard(post.walletAddress)}
              className="self-start inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 transition text-slate-700 text-xs font-mono px-3 py-1.5 rounded-full"
              title={post.walletAddress}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {shortAddress}
              {copySuccess && (
                <span className="text-emerald-600 ml-1">{copySuccess}</span>
              )}
            </button>
          )}
          {post.img && (
            <img
              src={post.img}
              className="max-h-96 w-full object-cover rounded-xl border border-slate-200"
              alt=""
            />
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-1 items-center">
            <button
              onClick={handleLikePost}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition ${
                isLiked
                  ? "text-emerald-700 bg-emerald-50"
                  : "text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              <BiUpvote className="w-4 h-4" />
              <span className="font-medium">{post.likes.length}</span>
              <span className="hidden sm:inline">Vote</span>
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-slate-500">
              <BiComment className="w-4 h-4" />
              <span className="font-medium">{post.comments.length}</span>
              <span className="hidden sm:inline">Comments</span>
            </div>
          </div>
          <button
            onClick={() => setIsAwardDialogOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-amber-600 hover:bg-amber-50 transition"
          >
            <CiGift className="w-5 h-5" />
            <span className="font-semibold hidden sm:inline">Award</span>
          </button>
        </div>

        <form
          className="flex gap-2 mt-4 items-stretch"
          onSubmit={handlePostComment}
        >
          <input
            type="text"
            className="nn-input flex-1"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          {!isCommenting ? (
            <button type="submit" className="nn-btn-primary">
              Comment
            </button>
          ) : (
            <div className="flex items-center px-4">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </form>

        {post.comments.length > 0 && (
          <div className="mt-4 space-y-2">
            {post.comments.map((c) => (
              <div
                key={c._id}
                className="flex justify-between items-start gap-3 bg-slate-50 p-3 rounded-xl"
              >
                <div className="flex gap-3 min-w-0">
                  <img
                    src={c.user?.profileImage || "/avatar-placeholder.png"}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                    alt={c.user?.username || "User avatar"}
                  />
                  <div className="min-w-0">
                    <Link
                      to={`/profile/${c.user?.username}`}
                      className="font-semibold text-sm text-slate-900 hover:underline"
                    >
                      {c.user?.fullName}
                    </Link>
                    <p className="text-sm text-slate-600 mt-0.5 break-words">
                      {c.text}
                    </p>
                  </div>
                </div>
                {authUser._id === c.user?._id && (
                  <button
                    onClick={() => handleDeleteComment(c._id)}
                    className="text-xs text-rose-500 hover:text-rose-600 font-medium shrink-0"
                  >
                    {!isDeletingComment ? "Delete" : <LoadingSpinner size="sm" />}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {isAwardDialogOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white p-6 rounded-2xl max-w-md w-full relative shadow-xl border border-slate-200">
              <button
                className="absolute top-3 right-3 w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition"
                onClick={() => setIsAwardDialogOpen(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <div className="mb-5">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                  <CiGift className="w-7 h-7" />
                </div>
                <h2 className="font-display text-xl font-bold text-slate-900">
                  Send an Award
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Reward this creator with ETH on-chain.
                </p>
              </div>
              {!isConnected ? (
                <button
                  className="nn-btn-primary w-full"
                  onClick={connectToMetamask}
                >
                  Connect Wallet
                </button>
              ) : (
                <form onSubmit={addToBlockchain} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                      Wallet Address
                    </label>
                    <input
                      type="text"
                      name="walletAddress"
                      id="walletAddress"
                      value={post.walletAddress}
                      readOnly
                      className="nn-input font-mono text-xs bg-slate-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                      Amount (ETH)
                    </label>
                    <input
                      type="number"
                      name="amount"
                      id="amount"
                      step="0.01"
                      placeholder="0.05"
                      className="nn-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                      Message
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows={3}
                      placeholder="Great post!"
                      className="nn-input resize-none"
                    />
                  </div>
                  <button type="submit" className="nn-btn-primary w-full">
                    Send Award
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default Post;
