import { Link } from "react-router-dom";
import { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import Logo from "../../../components/logo/Logo";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10">
      <div className="w-full max-w-md nn-card p-8">
        <Logo />
        <div className="mt-6">
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Forgot password
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Enter the email associated with your account and we&apos;ll send a
            reset link.
          </p>
        </div>

        {submitted ? (
          <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-sm text-emerald-800">
            If an account exists for <span className="font-semibold">{email}</span>,
            a reset link is on its way.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <div className="relative">
                <MdOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="nn-input pl-10"
                />
              </div>
            </div>
            <button type="submit" className="nn-btn-primary w-full">
              Send reset link
            </button>
          </form>
        )}

        <div className="mt-6 text-sm text-center">
          <Link
            to="/login"
            className="text-emerald-700 hover:underline font-semibold"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
