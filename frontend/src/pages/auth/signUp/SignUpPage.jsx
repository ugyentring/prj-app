import { Link } from "react-router-dom";
import { useState } from "react";
import { MdOutlineMail, MdPassword, MdDriveFileRenameOutline } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ email, username, fullName, password }) => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
    onSuccess: () => {
      toast.success("Account created successfully");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen items-center justify-center">
      <div className="flex">
        <div className="hidden md:flex w-1/2 items-center justify-center bg-green-900 p-6">
          <div className="text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Welcome to NorbNode</h2>
            <p className="mb-6">
              Already have an account? Sign in to access all the features.
            </p>
            <Link
              to="/login"
              className="bg-white text-green-900 font-bold py-2 px-4 rounded-lg hover:bg-green-900 hover:text-white transition-colors duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-6">
          <div className="bg-white rounded-3xl p-8 shadow-md">
            <form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
              <h1 className="text-4xl font-extrabold text-black mb-6">Sign Up</h1>
              <label className="input input-bordered rounded flex items-center gap-2">
                <MdOutlineMail />
                <input
                  type="email"
                  className="input-field flex-1"
                  placeholder="Email"
                  name="email"
                  autoComplete="off"
                  onChange={handleInputChange}
                  value={formData.email}
                />
              </label>
              <div className="flex gap-4 flex-wrap">
                <label className="input input-bordered rounded flex items-center gap-2 flex-1">
                  <FaUser />
                  <input
                    type="text"
                    className="input-field flex-1"
                    placeholder="Username"
                    name="username"
                    autoComplete="off"
                    onChange={handleInputChange}
                    value={formData.username}
                  />
                </label>
                <label className="input input-bordered rounded flex items-center gap-2 flex-1">
                  <MdDriveFileRenameOutline />
                  <input
                    type="text"
                    className="input-field flex-1"
                    placeholder="Full Name"
                    name="fullName"
                    autoComplete="off"
                    onChange={handleInputChange}
                    value={formData.fullName}
                  />
                </label>
              </div>
              <label className="input input-bordered rounded flex items-center gap-2">
                <MdPassword />
                <input
                  type="password"
                  className="input-field flex-1"
                  placeholder="Password"
                  name="password"
                  autoComplete="off"
                  onChange={handleInputChange}
                  value={formData.password}
                />
              </label>
              <button className="btn bg-green-900 text-white rounded-full">
                {isPending ? "Loading..." : "Sign Up"}
              </button>
              {isError && <p className="text-red-500">{error.message}</p>}
            </form>
            <div className="flex flex-row gap-2 mt-4">
              <p className="text-black text-lg">Already have an account?</p>
              <Link to="/login" className="text-green-900 hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
