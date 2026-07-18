import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";
import {
  BrainCircuit,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("alex@timetoprogram.com");
  const [password, setPassword] = useState("Test@123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { token, user } = await authService.login(
        email,
        password
      );

      login(user, token);
      toast.success("Logged in successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.message ||
          "Failed to login. Please check your credentials."
      );

      toast.error(err.message || "Failed to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] bg-[length:16px_16px] opacity-30"></div>

      <div className="relative w-full max-w-md px-6">

        <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-10 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/80 dark:shadow-black/30">

          {/* Header */}

          <div className="mb-10 text-center">

            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25">
              <BrainCircuit
                className="h-7 w-7 text-white"
                strokeWidth={2}
              />
            </div>

            <h1 className="mb-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Welcome back
            </h1>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Sign in to continue your journey
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}

            <div className="space-y-2">

              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                Email
              </label>

              <div className="relative">

                <div
                  className={`absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-colors duration-200 ${
                    focusedField === "email"
                      ? "text-emerald-500"
                      : "text-slate-400"
                  }`}
                >
                  <Mail
                    className="h-5 w-5"
                    strokeWidth={2}
                  />
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  onFocus={() =>
                    setFocusedField("email")
                  }
                  onBlur={() =>
                    setFocusedField(null)
                  }
                  placeholder="you@example.com"
                  required
                  className="h-12 w-full rounded-xl border-2 border-slate-200 bg-slate-50/50 pl-12 pr-4 text-sm font-medium text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:outline-none focus:shadow-lg focus:shadow-emerald-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-800"
                />

              </div>

            </div>

            {/* Password */}

            <div className="space-y-2">

              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                Password
              </label>

              <div className="relative">

                <div
                  className={`absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-colors duration-200 ${
                    focusedField === "password"
                      ? "text-emerald-500"
                      : "text-slate-400"
                  }`}
                >
                  <Lock
                    className="h-5 w-5"
                    strokeWidth={2}
                  />
                </div>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  onFocus={() =>
                    setFocusedField("password")
                  }
                  onBlur={() =>
                    setFocusedField(null)
                  }
                  placeholder="********"
                  required
                  className="h-12 w-full rounded-xl border-2 border-slate-200 bg-slate-50/50 pl-12 pr-12 text-sm font-medium text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:outline-none focus:shadow-lg focus:shadow-emerald-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-800"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition-colors duration-200 hover:text-emerald-500 dark:text-slate-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>

              </div>

            </div>
                        {/* Error Message */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-900/20">
                <p className="text-center text-xs font-medium text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                      strokeWidth={2.5}
                    />
                  </>
                )}
              </span>

              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/10 transition-transform duration-700 group-hover:translate-x-full"></div>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 border-t border-slate-200/60 pt-6 dark:border-slate-700">
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-emerald-600 transition-colors duration-200 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Bottom Text */}
          <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
            By continuing, you agree to our Terms &amp; Privacy Policy
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;