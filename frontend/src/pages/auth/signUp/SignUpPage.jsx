import { Link } from "react-router-dom";
import { useState } from "react";
import {
  MdOutlineMail,
  MdPassword,
  MdDriveFileRenameOutline,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { FaUser } from "react-icons/fa";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import Logo from "../../../components/logo/Logo";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const { mutate, isError, isPending } = useMutation({
    mutationFn: async ({ email, username, fullName, password }) => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, username, fullName, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create account!");
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: () => toast.success("Account created successfully"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (
      !formData.email ||
      !formData.username ||
      !formData.fullName ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (
      formData.password.length < 8 ||
      !/[a-z]/.test(formData.password) ||
      !/[A-Z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password) ||
      !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password)
    ) {
      setError(
        "Password must be 8+ chars and include upper, lower, number, and special characters."
      );
      return;
    }
    mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-10">
      <div className="w-full max-w-5xl grid md:grid-cols-2 nn-card overflow-hidden">
        {/* Hero */}
        <div className="hidden md:flex relative bg-gradient-to-br from-emerald-700 to-emerald-900 p-12 items-center justify-center overflow-hidden">
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-emerald-500/30 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="relative text-white text-center max-w-sm">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
              Join the network
            </div>
            <h2 className="font-display text-3xl font-bold mb-3">
              Create your NorbNode account.
            </h2>
            <p className="text-emerald-100/90 text-sm leading-relaxed">
              Post, upvote, and earn ETH from your community. It only takes a
              minute.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <Logo />
          <div className="mt-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900">
              Sign up
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              Get started with your free account.
            </p>
          </div>

          <form className="flex gap-4 flex-col mt-8" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <div className="relative">
                <MdOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  className="nn-input pl-10"
                  placeholder="you@example.com"
                  name="email"
                  autoComplete="off"
                  onChange={handleInputChange}
                  value={formData.email}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Username
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type="text"
                    className="nn-input pl-9"
                    placeholder="username"
                    name="username"
                    autoComplete="off"
                    onChange={handleInputChange}
                    value={formData.username}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Full Name
                </label>
                <div className="relative">
                  <MdDriveFileRenameOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    className="nn-input pl-10"
                    placeholder="Jane Doe"
                    name="fullName"
                    autoComplete="off"
                    onChange={handleInputChange}
                    value={formData.fullName}
                  />
                </div>
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
                  autoComplete="off"
                  onChange={handleInputChange}
                  value={formData.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Confirm Password
              </label>
              <div className="relative">
                <MdPassword className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="nn-input pl-10 pr-10"
                  placeholder="••••••••"
                  name="confirmPassword"
                  autoComplete="off"
                  onChange={handleInputChange}
                  value={formData.confirmPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-rose-500">{error}</p>}
            <button type="submit" className="nn-btn-primary w-full mt-2">
              {isPending ? "Loading..." : "Create account"}
            </button>
            {isError && (
              <p className="text-sm text-rose-500">Something went wrong</p>
            )}
          </form>

          <div className="flex flex-row gap-2 mt-6 text-sm">
            <p className="text-slate-600">Already have an account?</p>
            <Link
              to="/login"
              className="text-emerald-700 hover:underline font-semibold"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
