import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MdOutlineMail,
  MdPassword,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: loginMutation, isPending, isError, error } = useMutation({
    mutationFn: async ({ username, password }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
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
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen items-center justify-center">
      <div className="flex">
        <div className="w-full md:w-1/2 p-6">
          <div className="bg-white rounded-3xl p-8 shadow-md">
            <form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
              <h1 className="text-4xl font-extrabold text-black mb-6">Login</h1>
              <label className="input input-bordered rounded flex items-center gap-2">
                <MdOutlineMail />
                <input
                  type="text"
                  className="input-field flex-1"
                  placeholder="Username"
                  name="username"
                  onChange={handleInputChange}
                  value={formData.username}
                />
              </label>
              <label className="input input-bordered rounded flex items-center gap-2">
                <MdPassword />
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-field flex-1"
                  placeholder="Password"
                  name="password"
                  onChange={handleInputChange}
                  value={formData.password}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-gray-500 focus:outline-none"
                >
                  {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </label>
              <div className="flex flex-row justify-between items-center">
                <Link to="/forgot-password" className="text-green-500 hover:underline">
                  Forgot Password?
                </Link>
                <button className="btn bg-green-900 text-white rounded-full px-8 py-3">
                  {isPending ? "Loading..." : "Login"}
                </button>
              </div>
              {isError && <p className="text-red-500">{error.message}</p>}
            </form>
            <div className="flex flex-row gap-2 mt-4">
              <p className="text-black text-lg">Don't have an account?</p>
              <Link to="/signup" className="text-green-500 hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden md:flex w-1/2 items-center justify-center bg-green-900 p-6">
          <div className="text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Welcome back to NorbNode</h2>
            <p className="mb-6">
              Enter your personal details to use all of the site's features.
            </p>
            <Link
              to="/signup"
              className="bg-white text-green-900 font-bold py-2 px-4 rounded-lg hover:bg-green-900 hover:text-white transition-colors duration-300"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
