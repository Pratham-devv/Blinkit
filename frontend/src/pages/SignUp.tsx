import { useState } from "react";
import { useAuth } from "../context/hooks/Auth.Hook";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const SignUp = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signUp(username, email, password);

    if (!res.success) {
      const msg = res.message?.toLowerCase();
      setError(msg || "Sign up failed");
      return;
    }

    // Go to OTP page
    navigate("/verify-otp");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">

        {/* Left Branding Section */}
        <div className="hidden lg:flex flex-col justify-center p-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl shadow-lg">
              <ShoppingCart className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                Grocer
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Fresh in minutes
              </p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Join Grocer Today!
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Create your account and enjoy fresh groceries delivered to your doorstep!
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center mt-1">
                <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Exclusive Deals</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Get access to member-only discounts
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center mt-1">
                <span className="text-emerald-600 dark:text-emerald-300 font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Fast Delivery</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  10-minute delivery guaranteed
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center mt-1">
                <span className="text-emerald-600 dark:text-emerald-300 font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Easy Returns</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Hassle-free refunds
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="w-full">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 sm:p-12 border border-gray-100 dark:border-gray-700 transition-colors"
          >
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-2xl">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                Grocer
              </h1>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Create Account
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Join us and start shopping today!
              </p>
            </div>

            <div className="space-y-6">

              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border-2 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all text-gray-900 dark:text-white `}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border-2 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all text-gray-900 dark:text-white ${
                      error ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                    }`}
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-sm mt-1">{error}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2">
                <input type="checkbox" required className="mt-1" />
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  I agree to the{" "}
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold cursor-pointer">
                    Terms & Conditions
                  </span>{" "}
                  and{" "}
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold cursor-pointer">
                    Privacy Policy
                  </span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Create Account <ArrowRight />
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or sign up with
                </span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button className="py-3 px-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2 transition-colors">
                Google
              </button>
              <button className="py-3 px-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2 transition-colors">
                Facebook
              </button>
            </div>

            {/* Switch to Login */}
            <p className="mt-8 text-center text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="font-semibold text-emerald-600 dark:text-emerald-400 cursor-pointer"
              >
                Sign in
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
