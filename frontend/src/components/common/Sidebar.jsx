import Logo from "../logo/Logo";

import { RiHome4Line, RiExchangeLine } from "react-icons/ri";
import { GrNotification } from "react-icons/gr";
import { FaRegUser } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const navItemClass = ({ isActive }) =>
  `flex gap-3 items-center w-full px-4 py-3 rounded-xl transition-all duration-200 ${
    isActive
      ? "bg-emerald-50 text-emerald-700 font-semibold"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

const Sidebar = () => {
  const queryClient = useQueryClient();

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", { method: "POST" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
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
    <aside className="hidden sm:flex shrink-0 w-20 md:w-64 sticky top-0 h-screen py-4">
      <div className="flex flex-col w-full nn-card p-3 md:p-4">
        <Link to="/" className="px-2 py-2">
          <Logo />
        </Link>

        <nav className="mt-4 flex flex-col gap-1">
          <NavLink to="/" end className={navItemClass}>
            <RiHome4Line className="w-6 h-6 shrink-0" />
            <span className="hidden md:block">Home</span>
          </NavLink>
          <NavLink to="/notifications" className={navItemClass}>
            <GrNotification className="w-5 h-5 shrink-0" />
            <span className="hidden md:block">Notifications</span>
          </NavLink>
          <NavLink to="/transaction" className={navItemClass}>
            <RiExchangeLine className="w-6 h-6 shrink-0" />
            <span className="hidden md:block">Transactions</span>
          </NavLink>
          <NavLink
            to={`/profile/${authUser?.username || ""}`}
            className={navItemClass}
          >
            <FaRegUser className="w-5 h-5 shrink-0" />
            <span className="hidden md:block">Profile</span>
          </NavLink>
        </nav>

        {authUser && (
          <div className="mt-auto pt-4 border-t border-slate-100">
            <Link
              to={`/profile/${authUser.username}`}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={authUser?.profileImage || "/avatar-placeholder.png"}
                  alt={authUser?.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden md:flex flex-col min-w-0">
                <p className="font-semibold text-sm truncate text-slate-900">
                  {authUser?.fullName}
                </p>
                <p className="text-slate-500 text-xs truncate">
                  @{authUser?.username}
                </p>
              </div>
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
              className="mt-2 w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition"
            >
              <BiLogOut className="w-5 h-5 shrink-0" />
              <span className="hidden md:block text-sm font-semibold">
                Logout
              </span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
