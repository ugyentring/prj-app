import { Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/auth/signUp/SignUpPage";
import LoginPage from "./pages/auth/login/LoginPage";
import HomePage from "./pages/home/HomePage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import ProfilePage from "./pages/profile/ProfilePage";
import NotificationPage from "./pages/notification/NotificationPage";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div className="flex max-w-6xl mx-auto">
      <Sidebar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/profile/:name" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationPage />} />
      </Routes>
      <RightPanel />
      <Toaster />
    </div>
  );
};

export default App;
