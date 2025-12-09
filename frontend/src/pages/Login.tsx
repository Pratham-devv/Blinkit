// src/pages/SignIn.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/hooks/Auth.Hook";
import { useNavigate } from "react-router-dom";

const RESEND_COOLDOWN = 60; // seconds

const SignIn: React.FC = () => {
  const { signIn, verifyOtp, loading } = useAuth();
  const navigate = useNavigate();

  // Step: "email" | "otp"

  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // resend cooldown
  const [cooldown, setCooldown] = useState<number>(0);
  useEffect(() => {
    let timer: number | undefined;
    if (cooldown > 0) {
      timer = window.setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldown]);

  const validateEmail = (e: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  };

  // Step 1: request OTP
  const handleRequestOtp = async () => {
    setError(null);
    setInfo(null);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const res = await signIn(email);
    if (res.success) {
      setInfo("OTP sent to your email.");
      setStep("otp");
      setCooldown(RESEND_COOLDOWN);
    } else {
      setError(res.message || "Failed to send OTP.");
    }
  };

  // Step 2: verify OTP
  const handleVerifyOtp = async () => {
    setError(null);
    setInfo(null);

    if (otp.trim().length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    const res = await verifyOtp(email, otp);
    if (res.success) {
      setInfo("Signed in successfully.");
      navigate("/"); // or /profile
    } else {
      setError(res.message || "Invalid OTP.");
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setError(null);
    const res = await signIn(email);
    if (res.success) {
      setInfo("OTP resent.");
      setCooldown(RESEND_COOLDOWN);
    } else {
      setError(res.message || "Failed to resend OTP.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sign In</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Enter your email to receive a one-time login code.
        </p>

        {error && <div className="text-red-600 mb-4">{error}</div>}
        {info && <div className="text-emerald-600 mb-4">{info}</div>}

        {step === "email" && (
          <div className="space-y-4">
            <label className="block text-sm text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
            />

            <button
              onClick={handleRequestOtp}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
              Don't have an account?{" "}
              <a href="/signup" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                Sign up
              </a>
            </div>
          </div>
        )}

        {step === "otp" && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              OTP sent to <strong className="text-gray-900 dark:text-white">{email}</strong>
            </div>

            <label className="block text-sm text-gray-700 dark:text-gray-300">Enter OTP</label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              placeholder="123456"
              className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none tracking-widest text-center text-2xl"
            />

            <div className="flex gap-3">
              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
              >
                {loading ? "Verifying..." : "Verify & Sign In"}
              </button>

              <button
                onClick={() => {
                  setStep("email");
                  setOtp("");
                }}
                className="py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                Edit Email
              </button>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div>
                Didn't receive it?
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResend}
                  disabled={cooldown > 0}
                  className={`px-3 py-1 rounded-md ${cooldown > 0 ? "bg-gray-200 dark:bg-gray-700 text-gray-400" : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100"}`}
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignIn;
