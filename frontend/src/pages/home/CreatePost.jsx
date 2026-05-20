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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, img, walletAddress }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
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
      reader.onload = () => setImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex p-5 items-start gap-4">
      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0">
        <img
          src={authUser?.profileImage || "/avatar-placeholder.png"}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
      <form className="flex flex-col gap-3 w-full" onSubmit={handleSubmit}>
        <textarea
          className="w-full bg-transparent text-base resize-none border-0 focus:outline-none placeholder:text-slate-400 min-h-[60px]"
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="text"
          className="nn-input text-sm"
          placeholder="Your MetaMask wallet address (for awards)"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
        />
        {img && (
          <div className="relative w-full max-w-md mx-auto">
            <button
              type="button"
              className="absolute top-2 right-2 bg-slate-900/70 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-slate-900 transition"
              onClick={() => {
                setImg(null);
                imgRef.current.value = null;
              }}
            >
              <IoCloseSharp />
            </button>
            <img
              src={img}
              className="w-full h-64 object-cover rounded-xl border border-slate-200"
              alt="Uploaded preview"
            />
          </div>
        )}

        <div className="flex justify-between items-center pt-3 border-t border-slate-100">
          <div className="flex gap-2 items-center">
            <button
              type="button"
              onClick={() => imgRef.current.click()}
              className="w-9 h-9 rounded-full text-emerald-600 hover:bg-emerald-50 flex items-center justify-center transition"
              aria-label="Add image"
            >
              <IoImageOutline className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="w-9 h-9 rounded-full text-emerald-600 hover:bg-emerald-50 flex items-center justify-center transition"
              aria-label="Add emoji"
            >
              <BsEmojiHeartEyes className="w-5 h-5" />
            </button>
          </div>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
          />
          <button type="submit" className="nn-btn-primary" disabled={isPending}>
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
        {isError && (
          <div className="text-rose-500 text-sm">
            {error.message || "Something went wrong"}
          </div>
        )}
      </form>
    </div>
  );
};

export default CreatePost;
