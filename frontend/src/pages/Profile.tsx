import {  useState } from "react";
import type { FC} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/hooks/Auth.Hook";
import { useOrder } from "../context/hooks/Order.Hook";

import {
  User as UserIcon,
  Mail,
  Calendar,
  LogOut,
  Package,
  ArrowLeft,
  ShoppingBag,
  MapPin,
  Bell,
  CreditCard,
  Settings,
  ChevronRight,
  Shield,
  Pencil
} from "lucide-react";

interface EditFormState {
  username: string;
  email: string;
  password?: string;
}

const Profile: FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { viewOrders } = useOrder();
  const navigate = useNavigate();

  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<EditFormState>({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);

    const payload: EditFormState = {
      username: form.username,
      email: form.email,
    };

    if (form.password) payload.password = form.password;

    const result = await updateProfile(payload);

    setLoading(false);

    if (result.success) {
      setEditOpen(false);
    } else {
      alert(result.message);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-8 rounded-full mb-6 inline-block">
            <UserIcon className="w-24 h-24 text-gray-400 dark:text-gray-500" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Not Logged In
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Please login or sign up to access your profile.
          </p>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl"
          >
            Go to Login Page
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>

          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-xl">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Profile
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage your account
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mb-3 ring-4 ring-emerald-100">
                  <span className="text-4xl font-bold text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.username}
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Grocer Member
              </p>

              <button
                onClick={() => setEditOpen(true)}
                className="mt-3 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:underline text-sm"
              >
                <Pencil className="w-4 h-4" /> Edit Profile
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* Email */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <Mail className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Member Since */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Member Since
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formattedDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-all border border-red-200 dark:border-red-800"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>

          {/* Right Side Sections (Quick Actions + Settings + Support) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <Link
                  to="/order"
                  onClick={() => viewOrders()}
                  className="group flex items-center gap-4 p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/30 rounded-xl hover:from-emerald-100 hover:to-emerald-200 dark:hover:bg-emerald-900/40 transition-all border-2 border-emerald-200 dark:border-emerald-800"
                >
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Package className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      My Orders
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      View order history
                    </p>
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-emerald-600 transition-colors" />
                </Link>

                <Link
                  to="/cart"
                  className="group flex items-center gap-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-xl hover:from-blue-100 hover:to-blue-200 dark:hover:bg-blue-900/40 transition-all border-2 border-blue-200 dark:border-blue-800"
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      My Cart
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      View shopping cart
                    </p>
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 transition-colors" />
                </Link>
              </div>
            </div>

            {/* Settings Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Account Settings
              </h3>

              <div className="space-y-2">
                {[
                  {
                    icon: <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />,
                    title: "Addresses",
                    desc: "Manage delivery addresses",
                  },
                  {
                    icon: <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />,
                    title: "Payment Methods",
                    desc: "Manage payment options",
                  },
                  {
                    icon: <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />,
                    title: "Notifications",
                    desc: "Manage notifications",
                  },
                  {
                    icon: <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />,
                    title: "Privacy & Security",
                    desc: "Update password & security",
                  },
                  {
                    icon: <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />,
                    title: "App Settings",
                    desc: "Customize theme & preferences",
                  },
                ].map((item) => (
                  <button
                    key={item.title}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors group text-left"
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-emerald-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Support */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/30 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">
                Need Help?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Our support team is available 24/7.
              </p>

              <button className="bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-50 dark:hover:bg-gray-700 transition-colors border-2 border-emerald-200 dark:border-emerald-800">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Edit Profile
            </h3>

            <div className="space-y-4">
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                placeholder="Username"
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                placeholder="Email"
              />

              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                placeholder="New Password (optional)"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
