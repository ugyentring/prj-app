import { IoImageOutline } from "react-icons/io5";
import { BsEmojiHeartEyes } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");

  const imgRef = useRef(null);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const {
    mutate: createPost,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ text, img, walletAddress }) => {
      try {
        const res = await fetch("/api/posts/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, img, walletAddress }),
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
      setText("");
      setWalletAddress("");
      setImg(null);
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ text, img, walletAddress });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-300 shadow-md rounded-md">
      <div className="avatar">
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <img src={authUser.profileImage || "/avatar-placeholder.png"} alt="Profile" />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea w-full p-2 text-lg resize-none border border-gray-300 focus:outline-none rounded-md"
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="text"
          className="input w-full p-2 text-lg border border-gray-300 focus:outline-none rounded-md"
          placeholder="Enter your metamask wallet address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
        />
        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-2 right-2 text-gray-600 bg-white rounded-full w-6 h-6 cursor-pointer"
              onClick={() => {
                setImg(null);
                imgRef.current.value = null;
              }}
            />
            <img
              src={img}
              className="w-full mx-auto h-52 object-cover rounded-md"
              alt="Uploaded"
            />
          </div>
        )}

        <div className="flex justify-between items-center border-t py-2 border-t-gray-300">
          <div className="flex gap-1 items-center">
            <IoImageOutline
              className="w-6 h-6 cursor-pointer text-green-700"
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiHeartEyes className="w-5 h-5 cursor-pointer text-green-700" />
          </div>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
          />
          <button className="btn bg-green-700 rounded-full btn-sm text-white px-4 hover:bg-green-600 focus:outline-none">
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
        {isError && (
          <div className="text-red-500">
            {error.message || "Something went wrong"}
          </div>
        )}
      </form>
    </div>
  );
};

export default CreatePost;
