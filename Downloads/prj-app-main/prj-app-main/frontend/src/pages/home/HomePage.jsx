import { useState } from "react";

import CreatePost from "./CreatePost";
import Posts from "../../components/common/Posts";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");

  const handleFeedTypeChange = (type) => {
    setFeedType(type);
  };

  return (
    <>
      <div className="flex-[4_4_0] mr-auto min-h-screen bg-gray-100">
        {/* Header */}
        <div className="flex w-full">
          <div
            className={`flex justify-center flex-1 p-3 cursor-pointer relative transition duration-300 ${
              feedType === "forYou" ? "text-white bg-green-700" : "text-gray-700"
            }`}
            onClick={() => handleFeedTypeChange("forYou")}
            style={{ borderBottom: feedType === "forYou" ? "none" : "1px solid transparent" }}
          >
            For you
          </div>
          <div
            className={`flex justify-center flex-1 p-3 cursor-pointer relative transition duration-300 ${
              feedType === "following" ? "text-white bg-green-700" : "text-gray-700"
            }`}
            onClick={() => handleFeedTypeChange("following")}
            style={{ borderBottom: feedType === "following" ? "none" : "1px solid transparent" }}
          >
            Following
          </div>
        </div>

        {/* CREATE POST INPUT */}
        <div className="bg-white p-4">
          <CreatePost />
        </div>

        {/* POSTS */}
        <div className="bg-white">
          <Posts feedType={feedType} />
        </div>
      </div>
    </>
  );
};

export default HomePage;