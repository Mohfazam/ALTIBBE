"use client";
import { useState } from "react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (isLogin) {
        alert("Logged in successfully!");
        // Redirect to product page
        window.location.href = "/product";
      } else {
        alert("Registered successfully!");
        setIsLogin(true);
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-slate-800 p-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-slate-300">
              {isLogin ? "Sign in to continue" : "Sign up to get started"}
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <div className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-md focus:border-blue-600 focus:outline-none transition-colors bg-white text-slate-900 placeholder:text-slate-400"
                  placeholder="your@email.com"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password Input with Toggle */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-3 pr-12 border-2 border-slate-300 rounded-md focus:border-blue-600 focus:outline-none transition-colors bg-white text-slate-900 placeholder:text-slate-400"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                className={`w-full py-3 rounded-md font-semibold text-white shadow-md transition-all ${
                  loading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={handleAuth}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500 font-medium">OR</span>
              </div>
            </div>

            {/* Toggle Mode Button */}
            <button
              className="w-full py-3 rounded-md font-semibold border-2 border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Create New Account" : "Already Have an Account?"}
            </button>

            {/* Footer Links */}
            {isLogin && (
              <div className="text-center mt-4">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Forgot Password?
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}