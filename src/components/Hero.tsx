import { ArrowRight, Search, ShieldCheck, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-slate-50">
      {/* Background decoration */}
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-100 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-emerald-50 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">

        {/* Left Content */}
        <div>
          {/* Small badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Built for communities
          </div>

          {/* Main heading */}
          <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            Why buy it when your{" "}
            <span className="text-emerald-600">
              community
            </span>{" "}
            already has it?
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            ShareNest helps trusted communities share everyday resources.
            Borrow what you need, share what you own, and save money together.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() => navigate("/explore")}
              className="group flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
            >
              Explore Resources
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-600"
            >
              Join Your Community
            </button>
          </div>

          {/* Trust points */}
          <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck size={19} className="text-emerald-600" />
              Trusted communities
            </div>

            <div className="flex items-center gap-2">
              <Users size={19} className="text-emerald-600" />
              Community powered
            </div>

            <div className="flex items-center gap-2">
              <Search size={19} className="text-emerald-600" />
              Easy discovery
            </div>
          </div>
        </div>

        {/* Right Visual */}
        <div className="relative">
          <div className="relative mx-auto max-w-md">

            {/* Main card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/60">

              {/* Card header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Your community
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-slate-900">
                    Sunrise Heights
                  </h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Users size={21} />
                </div>
              </div>

              {/* Search */}
              <div className="mt-6 flex items-center gap-3 rounded-xl bg-slate-100 px-4 py-3">
                <Search size={19} className="text-slate-400" />

                <span className="text-sm text-slate-400">
                  What do you need today?
                </span>
              </div>

              {/* Categories */}
              <div className="mt-6">
                <p className="text-sm font-semibold text-slate-900">
                  Popular categories
                </p>

                <div className="mt-3 grid grid-cols-2 gap-3">

                  <div className="rounded-xl bg-emerald-50 p-4">
                    <div className="text-2xl">🔧</div>
                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      Tools
                    </p>
                    <p className="text-xs text-slate-500">
                      18 available
                    </p>
                  </div>

                  <div className="rounded-xl bg-blue-50 p-4">
                    <div className="text-2xl">📽️</div>
                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      Electronics
                    </p>
                    <p className="text-xs text-slate-500">
                      12 available
                    </p>
                  </div>

                  <div className="rounded-xl bg-orange-50 p-4">
                    <div className="text-2xl">🏸</div>
                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      Sports
                    </p>
                    <p className="text-xs text-slate-500">
                      24 available
                    </p>
                  </div>

                  <div className="rounded-xl bg-purple-50 p-4">
                    <div className="text-2xl">📚</div>
                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      Books
                    </p>
                    <p className="text-xs text-slate-500">
                      56 available
                    </p>
                  </div>

                </div>
              </div>

              {/* Bottom stats */}
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    87
                  </p>
                  <p className="text-xs text-slate-500">
                    Shared items
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    342
                  </p>
                  <p className="text-xs text-slate-500">
                    Members
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-emerald-600">
                    4.9
                  </p>
                  <p className="text-xs text-slate-500">
                    Community rating
                  </p>
                </div>
              </div>

            </div>

            {/* Floating notification */}
            <div className="absolute -bottom-6 -left-8 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                  ✓
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Projector booked
                  </p>
                  <p className="text-xs text-slate-500">
                    Ready for pickup
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;