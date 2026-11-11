import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { LogIn, Sparkles, UserCheck, Loader2 } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPass = "Password123!") => {
    setError("");
    setEmail(demoEmail);
    setPassword(demoPass);
    try {
      setLoading(true);
      await login(demoEmail, demoPass);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to log in with demo account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
            <div className="mb-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-2xl shadow-md shadow-emerald-500/20">
                S
              </div>

              <h1 className="mt-4 text-3xl font-extrabold text-slate-900">
                Welcome Back
              </h1>

              <p className="mt-1 text-xs text-slate-500">
                Log in to borrow and share verified resources with your neighbors.
              </p>
            </div>

            {/* QUICK 1-CLICK DEMO ACCOUNTS FOR INSTANT TESTING */}
            <div className="mb-6 rounded-2xl bg-emerald-50/80 p-4 border border-emerald-200/70">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-2.5">
                <Sparkles size={14} className="text-emerald-600" />
                Quick 1-Click Demo Logins
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleDemoLogin("alex@example.com")}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-white p-2.5 text-xs font-bold text-slate-800 shadow-sm border border-emerald-200 hover:bg-emerald-100/50 transition"
                >
                  <UserCheck size={14} className="text-emerald-600" />
                  Alex (Owner)
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleDemoLogin("jordan@example.com")}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-white p-2.5 text-xs font-bold text-slate-800 shadow-sm border border-emerald-200 hover:bg-emerald-100/50 transition"
                >
                  <UserCheck size={14} className="text-emerald-600" />
                  Jordan (Borrower)
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleDemoLogin("siddharth@example.com")}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-white p-2 text-[11px] font-semibold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 transition"
                >
                  <UserCheck size={13} className="text-slate-500" />
                  Siddharth
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleDemoLogin("rahul@example.com")}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-white p-2 text-[11px] font-semibold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 transition"
                >
                  <UserCheck size={13} className="text-slate-500" />
                  Rahul
                </button>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 p-3 text-xs font-bold text-red-600 border border-red-200/60">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 font-bold text-white shadow-md hover:bg-emerald-700 transition disabled:opacity-70"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-500">
              Don't have an account?{" "}
              <Link to="/signup" className="font-bold text-emerald-600 hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;