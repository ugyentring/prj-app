import { Link } from "react-router-dom";
import { useState } from "react";

import { MdOutlineMail, MdPassword, MdVisibility, MdVisibilityOff } from "react-icons/md";
import toast from "react-hot-toast";

//react query imports
import { useMutation } from "@tanstack/react-query";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility

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
        if (!res) throw new Error(data.error || "Failed to create account!");
        // console.log(data);
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

    // Check if all fields are filled
    if (
      !formData.email ||
      !formData.username ||
      !formData.fullName ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!isPasswordValid(formData.password)) {
      toast.error(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long."
      );
      return;
    }

    mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  // Password validation function
  const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 hidden lg:flex items-center  justify-center"></div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          <h1 className="text-4xl font-extrabold text-black">SignUp.</h1>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="email"
              className="grow"
              placeholder="Email"
              name="email"
              autoComplete="off"
              onChange={handleInputChange}
              value={formData.email}
            />
          </label>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="text"
              className="grow"
              placeholder="Username"
              name="username"
              autoComplete="off"
              onChange={handleInputChange}
              value={formData.username}
            />
          </label>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="text"
              className="grow"
              placeholder="Full Name"
              name="fullName"
              autoComplete="off"
              onChange={handleInputChange}
              value={formData.fullName}
            />
          </label>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type={showPassword ? "text" : "password"} // Use conditional rendering based on showPassword state
              className="grow"
              placeholder="Password"
              name="password"
              autoComplete="off"
              onChange={handleInputChange}
              value={formData.password}
            />
            {showPassword ? (
              <MdVisibilityOff onClick={togglePasswordVisibility} />
            ) : (
              <MdVisibility onClick={togglePasswordVisibility} />
            )}
          </label>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type={showConfirmPassword ? "text" : "password"} // Use conditional rendering based on showConfirmPassword state
              className="grow"
              placeholder="Confirm Password"
              name="confirmPassword"
              autoComplete="off"
              onChange={handleInputChange}
              value={formData.confirmPassword}
            />
            {showConfirmPassword ? (
              <MdVisibilityOff onClick={toggleConfirmPasswordVisibility} />
            ) : (
              <MdVisibility onClick={toggleConfirmPasswordVisibility} />
            )}
          </label>
          <button className="btn rounded-full bg-green-700 text-white">
            {isPending ? "Loading..." : "Sign Up"}
          </button>
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>
        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className="text-black text-lg">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

