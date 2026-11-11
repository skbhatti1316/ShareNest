import {
  Bell,
  Building2,
  Check,
  LogIn,
  LogOut,
  Menu,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    activeToast,
    dismissToast,
  } = useSocket();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notifications dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const handleNotificationClick = (notifId: string) => {
    markAsRead(notifId);
    setNotifOpen(false);
    navigate("/dashboard");
  };

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  return (
    <>
      {/* REAL-TIME TOAST BANNER */}
      {activeToast && (
        <div className="fixed top-20 right-6 z-50 flex max-w-sm items-start gap-3 rounded-2xl border border-emerald-500/30 bg-slate-900 p-4 text-white shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-4 duration-300">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
            <Sparkles size={16} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-white">{activeToast.title}</h4>
            <p className="mt-0.5 text-xs text-slate-300 leading-relaxed">
              {activeToast.message}
            </p>
          </div>
          <button
            onClick={dismissToast}
            className="text-slate-400 hover:text-white transition"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={() => setMenuOpen(false)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-lg font-bold text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              S
            </div>

            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Share<span className="text-emerald-600">Nest</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 -mt-1 hidden sm:block">
                Community Resource Sharing
              </span>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-1 md:flex rounded-full bg-slate-100/80 p-1 border border-slate-200/60">
            <Link
              to="/"
              className={`px-4 py-1.5 text-sm font-semibold rounded-full transition ${
                isActive("/")
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Home
            </Link>

            <Link
              to="/explore"
              className={`px-4 py-1.5 text-sm font-semibold rounded-full transition ${
                isActive("/explore")
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Explore Items
            </Link>

            <Link
              to="/community"
              className={`px-4 py-1.5 text-sm font-semibold rounded-full transition flex items-center gap-1.5 ${
                isActive("/community")
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building2 size={14} className="text-emerald-600" />
              <span>{user?.community || "Sunrise Heights"}</span>
            </Link>
          </nav>

          {/* RIGHT SIDE ACTIONS */}
          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated && user ? (
              <>
                {/* SHARE ITEM BUTTON */}
                <Link
                  to="/share-item"
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
                >
                  <Plus size={16} />
                  Share Item
                </Link>

                {/* NOTIFICATION CENTER DROPDOWN */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
                    title="Notifications"
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-extrabold text-white ring-2 ring-white animate-pulse">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* NOTIFICATIONS POPUP */}
                  {notifOpen && (
                    <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-800">
                            Notifications
                          </span>
                          {unreadCount > 0 && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                          >
                            <Check size={12} />
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-slate-400">
                            <Bell size={28} className="mx-auto mb-2 opacity-40" />
                            <p className="text-xs font-medium">No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif._id}
                              onClick={() => handleNotificationClick(notif._id)}
                              className={`flex items-start gap-3 p-3.5 hover:bg-slate-50 cursor-pointer transition ${
                                !notif.read ? "bg-emerald-50/40" : ""
                              }`}
                            >
                              <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                                  notif.type.includes("approved")
                                    ? "bg-emerald-100 text-emerald-700"
                                    : notif.type.includes("rejected")
                                    ? "bg-red-100 text-red-600"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {notif.type.includes("approved")
                                  ? "✓"
                                  : notif.type.includes("rejected")
                                  ? "✕"
                                  : "📦"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="text-xs font-bold text-slate-900 truncate">
                                    {notif.title}
                                  </p>
                                  <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                                    {formatTime(notif.createdAt)}
                                  </span>
                                </div>
                                <p className="mt-0.5 text-xs text-slate-600 line-clamp-2">
                                  {notif.message}
                                </p>
                              </div>
                              {!notif.read && (
                                <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                              )}
                            </div>
                          ))
                        )}
                      </div>

                      <div className="border-t border-slate-100 bg-slate-50 p-2 text-center">
                        <button
                          onClick={() => {
                            setNotifOpen(false);
                            navigate("/dashboard");
                          }}
                          className="text-xs font-bold text-slate-700 hover:text-emerald-600 transition"
                        >
                          View All in Dashboard →
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* USER PROFILE & DASHBOARD LINK */}
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-sm font-semibold border transition ${
                    isActive("/dashboard")
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </Link>

                {/* LOGOUT */}
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-emerald-600 px-3 py-2"
                >
                  <LogIn size={18} />
                  Log in
                </Link>

                <Link
                  to="/signup"
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
                >
                  Join ShareNest
                </Link>
              </>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 md:hidden hover:bg-slate-50"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden animate-in slide-in-from-top duration-150">
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Home
              </Link>
              <Link
                to="/explore"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Explore Items
              </Link>
              <Link
                to="/community"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Community ({user?.community || "Sunrise Heights"})
              </Link>

              {isAuthenticated && user ? (
                <>
                  <Link
                    to="/share-item"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    <Plus size={16} />
                    Share Item
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800"
                  >
                    <span>Dashboard ({user.name})</span>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs text-white">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-xl px-4 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Log Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl border border-slate-200 py-2.5 text-center text-sm font-semibold text-slate-700"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl bg-emerald-600 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Join ShareNest
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default Navbar;