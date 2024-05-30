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
      if (!provider) {
        console.error("Ethereum provider is not initialized");
        return;
      }

      const receiver = e.target.walletAddress.value;
      const amountEth = e.target.amount.value;
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
        message
      );

      await transaction.wait();
      navigate("/");

      console.log("Transaction successful!");
    } catch (error) {
      console.error("Error executing addToBlockchain:", error);
    }
  }

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
      const res = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
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
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      return data;
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
      const res = await fetch(`/api/posts/comment/${post._id}/${commentId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      return data;
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
          className="w-10 h-10 rounded-full overflow-hidden"        >
          <img src={postOwner.profileImage || "/avatar-placeholder.png"} />
        </Link>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex gap-2 items-center">
          <Link
            to={`/profile/${postOwner.username}`}
            className="font-bold text-lg"
          >
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
              className="flex gap-2 items-center cursor-pointer text-gray-500 dark:text-gray-400"
              onClick={handleLikePost}
            >
              <BiUpvote className={isLiked ? "text-green-700" : ""} />
              <span>{post.likes.length}</span>
              <span>Vote</span>
            </div>
            <div className="flex gap-2 items-center text-gray-500 dark:text-gray-400">
              <BiComment />
              <span>{post.comments.length}</span>
              <span>Comment</span>
            </div>
          </div>
          <div className="text-gray-500 dark:text-gray-400 cursor-pointer flex justify-center items-center mr-4 gap-1">
            <span>Award </span>
            <CiGift onClick={() => setIsAwardDialogOpen(true)} />
          </div>
        </div>
        <form className="flex gap-2 mt-3" onSubmit={handlePostComment}>
          <input
            type="text"
            className="flex-1 border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          {!isCommenting ? (
            <button
              type="submit"
              className="px-4 py-2 bg-green-700 text-white rounded hover:bg-success"
            >
              Comment
            </button>
          ) : (
            <LoadingSpinner size="sm" />
          )}
        </form>
        <div className="mt-3">
          {post.comments.map((comment) => (
            <div
              key={comment._id}
              className="flex justify-between items-start bg-gray-100 dark:bg-gray-800 p-2 rounded mb-2"
            >
              <div className="flex gap-2">
                <img
                  src={comment.user.profileImage || "/avatar-placeholder.png"}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <Link
                    to={`/profile/${comment.user.username}`}
                    className="font-semibold text-sm text-gray-900 dark:text-gray-100"
                  >
                    {comment.user.fullName}
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {comment.text}
                  </p>
                </div>
              </div>
              {authUser._id === comment.user._id && (
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  {!isDeletingComment ? "Delete" : <LoadingSpinner size="sm" />}
                </button>
              )}
            </div>
          ))}
        </div>
        {isAwardDialogOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-md w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-500 dark:text-gray-400"
                onClick={() => setIsAwardDialogOpen(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <h2 className="text-2xl font-bold mb-4">Send Award</h2>
              <div>
                {!isConnected ? (
                  <button
                    className="w-full bg-green-700 text-white p-2 rounded hover:success"
                    onClick={connectToMetamask}
                  >
                    Connect Wallet
                  </button>
                ) : (
                  <form onSubmit={addToBlockchain}>
                    <div className="mb-4">
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">
                        Wallet Address
                      </label>
                      <input
                        type="text"
                        name="walletAddress"
                        id="walletAddress"
                        className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">
                        Amount (ETH)
                      </label>
                      <input
                        type="number"
                        name="amount"
                        id="amount"
                        step="0.01"
                        className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        id="message"
                        className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none"
                      />
                                       </div>
                    <button
                      type="submit"
                      className="w-full bg-green-700 text-white p-2 rounded hover:bg-success"
                    >
                      Send
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;


