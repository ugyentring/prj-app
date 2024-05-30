import React from 'react';
import Logo from "../logo/Logo";

import { RiHome4Line, RiExchangeLine } from "react-icons/ri";
import { GrNotification } from "react-icons/gr";
import { FaRegUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const Sidebar = () => {
  const queryClient = useQueryClient();

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col w-20 md:w-full">
        <Link to="/" className="flex justify-center md:justify-start">
          <Logo />
        </Link>
        <ul className="flex flex-col gap-3 mt-4">
          <li className="flex justify-center md:justify-start">
            <Link
              to="/"
              className="flex gap-3 items-center menu-item hover:bg-green-700 hover:text-white transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <RiHome4Line className="w-8 h-8" />
              <span className="text-lg hidden md:block">Home</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to="/notifications"
              className="flex gap-3 items-center menu-item hover:bg-green-700 hover:text-white transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <GrNotification className="w-6 h-6" />
              <span className="text-lg hidden md:block">Notifications</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to="/transaction"
              className="flex gap-3 items-center menu-item hover:bg-green-700 hover:text-white transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <RiExchangeLine className="w-6 h-6" />
              <span className="text-lg hidden md:block">Transactions</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to={`/profile/${authUser?.username}`}
              className="flex gap-3 items-center menu-item hover:bg-green-700 hover:text-white transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaRegUser className="w-6 h-6" />
              <span className="text-lg hidden md:block">Profile</span>
            </Link>
          </li>
        </ul>
        {authUser && (
          <div className="mt-auto mb-10 flex gap-2 items-start flex-col transition-all duration-300">
            <Link
              to={`/profile/${authUser.username}`}
              className="flex gap-2 items-center py-2 px-4 rounded-full"
            >
              <div className="avatar hidden md:inline-flex">
                <div className="w-8 rounded-full">
                  <img
                    src={authUser?.profileImage || "/avatar-placeholder.png"}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <p className="text-black font-bold text-sm w-20 truncate">
                  {authUser?.fullName}
                </p>
                <p className="text-slate-500 text-sm">@{authUser?.username}</p>
              </div>
            </Link>
            <div
              className="flex items-center gap-2 p-2 rounded-full cursor-pointer hover:bg-red-500 hover:text-white transition-all duration-300"
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
            >
              <BiLogOut className="w-5 h-5" />
              <span className="text-sm font-semibold">Logout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
