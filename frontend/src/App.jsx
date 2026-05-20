import { Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "./pages/auth/signUp/SignUpPage";
import LoginPage from "./pages/auth/login/LoginPage";
import HomePage from "./pages/home/HomePage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import ProfilePage from "./pages/profile/ProfilePage";
import NotificationPage from "./pages/notification/NotificationPage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
import Models from "./components/common/Models";
import Transaction from "./components/common/Transaction";
import ForgotPassword from "../src/pages/auth/forgotPassword/ForgotPassword";
import { useState } from "react";

const App = () => {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center bg-slate-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex max-w-7xl mx-auto gap-6 px-4">
        {authUser && <Sidebar />}
        <main className="flex-1 min-w-0 py-4">
          <Routes>
            <Route
              path="/"
              element={authUser ? <HomePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!authUser ? <LoginPage /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
            />
            <Route
              path="/profile/:username"
              element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/notifications"
              element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/transaction"
              element={authUser ? <Transaction /> : <Navigate to="/login" />}
            />
            <Route
              path="/forgot-password"
              element={authUser ? <ForgotPassword /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>
        {authUser && <RightPanel />}
        <Models isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: "12px",
              background: "#0f172a",
              color: "#fff",
              fontSize: "14px",
            },
          }}
        />
      </div>
    </div>
  );
};

export default App;
