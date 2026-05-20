import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MdOutlineMail,
  MdPassword,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Logo from "../../../components/logo/Logo";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();
  const {
    mutate: loginMutation,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ username, password }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const [formError, setFormError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setFormError("Please fill in all fields");
      return;
    }
    loginMutation(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-10">
      <div className="w-full max-w-5xl grid md:grid-cols-2 nn-card overflow-hidden">
        {/* Left: form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <Logo />
          <div className="mt-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900">
              Welcome back
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              Sign in to continue to your NorbNode account.
            </p>
          </div>

          <form className="flex gap-4 flex-col mt-8" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Username
              </label>
              <div className="relative">
                <MdOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  className="nn-input pl-10"
                  placeholder="yourname"
                  name="username"
                  onChange={handleInputChange}
                  value={formData.username}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <MdPassword className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="nn-input pl-10 pr-10"
                  placeholder="••••••••"
                  name="password"
                  onChange={handleInputChange}
                  value={formData.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Toggle password"
                >
                  {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Link
                to="/forgot-password"
                className="text-sm text-emerald-700 hover:underline font-medium"
              >
                Forgot password?
              </Link>
              <button
                type="submit"
                className="nn-btn-primary"
                disabled={isPending}
              >
                {isPending ? "Loading..." : "Sign in"}
              </button>
            </div>

            {formError && (
              <p className="text-sm text-rose-500">{formError}</p>
            )}
            {isError && (
              <p className="text-sm text-rose-500">{error.message}</p>
            )}
          </form>

          <div className="flex flex-row gap-2 mt-6 text-sm">
            <p className="text-slate-600">Don&apos;t have an account?</p>
            <Link
              to="/signup"
              className="text-emerald-700 hover:underline font-semibold"
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* Right: hero */}
        <div className="hidden md:flex relative bg-gradient-to-br from-emerald-700 to-emerald-900 p-12 items-center justify-center overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-emerald-500/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="relative text-white text-center max-w-sm">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
              Decentralized Social
            </div>
            <h2 className="font-display text-3xl font-bold mb-3">
              A community where ideas are rewarded.
            </h2>
            <p className="text-emerald-100/90 text-sm leading-relaxed">
              Join NorbNode to share your thoughts, upvote great content, and
              tip creators directly on-chain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
