import { useState } from "react";

import CreatePost from "./CreatePost";
import Posts from "../../components/common/Posts";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");

  const tabs = [
    { id: "forYou", label: "For you" },
    { id: "following", label: "Following" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="nn-card overflow-hidden">
        <div className="px-5 pt-5">
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Home
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Discover ideas and reward creators on-chain.
          </p>
        </div>
        <div className="mt-4 flex border-t border-slate-100">
          {tabs.map((tab) => {
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
                  className={`absolute left-1/2 -translate-x-1/2 bottom-0 h-1 w-10 rounded-t-full transition ${
                    active ? "bg-emerald-600" : "bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* CREATE POST INPUT */}
      <div className="nn-card">
        <CreatePost />
      </div>

      {/* POSTS */}
      <div className="nn-card overflow-hidden">
        <Posts feedType={feedType} />
      </div>
    </div>
  );
};

export default HomePage;
