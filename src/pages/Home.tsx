import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const categories = [
    {
      icon: "🔧",
      name: "Tools",
      count: "18 available",
      bg: "bg-emerald-50",
    },
    {
      icon: "📽️",
      name: "Electronics",
      count: "12 available",
      bg: "bg-blue-50",
    },
    {
      icon: "🏸",
      name: "Sports",
      count: "24 available",
      bg: "bg-orange-50",
    },
    {
      icon: "📚",
      name: "Books",
      count: "56 available",
      bg: "bg-purple-50",
    },
    {
      icon: "🎉",
      name: "Party Supplies",
      count: "14 available",
      bg: "bg-pink-50",
    },
    {
      icon: "🏠",
      name: "Home",
      count: "21 available",
      bg: "bg-yellow-50",
    },
  ];

  const benefits = [
    {
      icon: Wallet,
      title: "Save Money",
      description:
        "Why buy something you'll use once? Borrow it from someone nearby.",
    },
    {
      icon: Users,
      title: "Build Community",
      description:
        "Connect with trusted people around you through simple sharing.",
    },
    {
      icon: ShieldCheck,
      title: "Share Safely",
      description:
        "Verified communities, ratings and transparent borrowing make sharing safer.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Join your community",
      description:
        "Connect with your apartment society, hostel, college or neighborhood.",
    },
    {
      number: "02",
      title: "Find what you need",
      description:
        "Search thousands of useful items shared by people around you.",
    },
    {
      number: "03",
      title: "Request to borrow",
      description:
        "Choose the dates and send a simple borrowing request.",
    },
    {
      number: "04",
      title: "Share and return",
      description:
        "Collect the item, use it and return it when you're done.",
    },
  ];

  const faqs = [
    {
      question: "What is ShareNest?",
      answer:
        "ShareNest is a community resource-sharing platform where trusted groups can share and borrow useful items instead of everyone buying their own.",
    },
    {
      question: "Who can use ShareNest?",
      answer:
        "ShareNest is designed for apartment societies, hostels, colleges, offices and local neighborhoods.",
    },
    {
      question: "Can I earn money by sharing items?",
      answer:
        "Yes. Item owners can choose whether to lend items for free or charge a small rental fee.",
    },
    {
      question: "How does ShareNest keep sharing safe?",
      answer:
        "The platform can use community verification, user profiles, ratings, borrowing history and secure communication between members.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* ================= NAVBAR ================= */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-xl font-bold text-white shadow-sm">
              S
            </div>

            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Share<span className="text-emerald-600">Nest</span>
            </span>
          </button>

          {/* Navigation */}

          <nav className="hidden items-center gap-9 md:flex">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-sm font-semibold text-slate-700 hover:text-emerald-600"
            >
              Home
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-sm font-semibold text-slate-700 hover:text-emerald-600"
            >
              How It Works
            </button>

            <button
              onClick={() => navigate("/explore")}
              className="text-sm font-semibold text-slate-700 hover:text-emerald-600"
            >
              Explore
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("community")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-sm font-semibold text-slate-700 hover:text-emerald-600"
            >
              Community
            </button>
          </nav>

          {/* Actions */}

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="hidden px-3 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-600 sm:block"
            >
              Log in
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Join ShareNest
            </button>
          </div>

        </div>
      </header>

      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50">

        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-emerald-100/60 blur-3xl" />

        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:py-28">

          {/* Left */}

          <div>

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Built for communities
            </div>

            <h1 className="text-5xl font-bold leading-[1.08] tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
              Why buy it when your{" "}
              <span className="text-emerald-600">
                community
              </span>{" "}
              already has it?
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">
              ShareNest helps trusted communities share everyday
              resources. Borrow what you need, share what you own,
              and save money together.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">

              <button
                onClick={() => navigate("/signup")}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-7 py-4 font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
              >
                Start Sharing
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => navigate("/explore")}
                className="rounded-xl border border-slate-300 bg-white px-7 py-4 font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-600"
              >
                Explore Items
              </button>

            </div>

            <div className="mt-9 flex flex-wrap gap-6 text-sm text-slate-500">

              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={17}
                  className="text-emerald-600"
                />
                Trusted communities
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={17}
                  className="text-emerald-600"
                />
                Easy borrowing
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={17}
                  className="text-emerald-600"
                />
                Save money
              </div>

            </div>

          </div>

          {/* Community Preview */}

          <div className="relative">

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/60">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-400">
                    Your community
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    Sunrise Heights
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <Users
                    size={22}
                    className="text-emerald-600"
                  />
                </div>

              </div>

              <div className="relative mt-6">

                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <div className="rounded-xl bg-slate-100 py-4 pl-11 text-sm text-slate-400">
                  What do you need today?
                </div>

              </div>

              <div className="mt-7 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">
                  Popular categories
                </h3>

                <span className="text-xs text-emerald-600">
                  View all
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">

                {categories.slice(0, 4).map((category) => (

                  <button
                    key={category.name}
                    onClick={() => navigate("/explore")}
                    className={`rounded-2xl ${category.bg} p-4 text-left transition hover:-translate-y-1 hover:shadow-sm`}
                  >

                    <div className="text-2xl">
                      {category.icon}
                    </div>

                    <p className="mt-3 font-semibold text-slate-900">
                      {category.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {category.count}
                    </p>

                  </button>

                ))}

              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">

                <div className="flex -space-x-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-200 text-xs">
                    A
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-200 text-xs">
                    R
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-purple-200 text-xs">
                    P
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-orange-200 text-xs">
                    +
                  </div>

                </div>

                <span className="text-xs font-medium text-slate-500">
                  342 community members
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= STATS ================= */}

      <section className="border-b border-slate-100 bg-white">

        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-100 md:grid-cols-4">

          <div className="px-6 py-9 text-center">
            <p className="text-3xl font-bold text-slate-900">
              145+
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Items shared
            </p>
          </div>

          <div className="px-6 py-9 text-center">
            <p className="text-3xl font-bold text-slate-900">
              342+
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Community members
            </p>
          </div>

          <div className="px-6 py-9 text-center">
            <p className="text-3xl font-bold text-slate-900">
              1,280+
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Successful shares
            </p>
          </div>

          <div className="px-6 py-9 text-center">
            <p className="text-3xl font-bold text-emerald-600">
              ₹2.4L+
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Estimated savings
            </p>
          </div>

        </div>

      </section>

      {/* ================= CATEGORIES ================= */}

      <section className="px-6 py-20">

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>
              <p className="font-semibold text-emerald-600">
                EXPLORE
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
                What can you share?
              </h2>

              <p className="mt-3 max-w-xl text-slate-500">
                From tools to books, discover useful items that
                your community already owns.
              </p>
            </div>

            <button
              onClick={() => navigate("/explore")}
              className="flex items-center gap-2 font-semibold text-emerald-600"
            >
              Explore everything
              <ArrowRight size={17} />
            </button>

          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">

            {categories.map((category) => (

              <button
                key={category.name}
                onClick={() => navigate("/explore")}
                className={`rounded-2xl ${category.bg} p-6 text-left transition hover:-translate-y-1 hover:shadow-lg`}
              >

                <div className="text-4xl">
                  {category.icon}
                </div>

                <h3 className="mt-5 font-bold text-slate-900">
                  {category.name}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {category.count}
                </p>

              </button>

            ))}

          </div>

        </div>

      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section
        id="how-it-works"
        className="bg-slate-50 px-6 py-20"
      >

        <div className="mx-auto max-w-7xl">

          <div className="text-center">

            <p className="font-semibold text-emerald-600">
              SIMPLE PROCESS
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
              Sharing made simple
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-500">
              ShareNest makes borrowing something from your
              community as easy as ordering online.
            </p>

          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            {steps.map((step) => (

              <div
                key={step.number}
                className="relative rounded-2xl border border-slate-200 bg-white p-7"
              >

                <span className="text-sm font-bold text-emerald-600">
                  {step.number}
                </span>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {step.description}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* ================= WHY SHARENEST ================= */}

      <section
        id="community"
        className="px-6 py-20"
      >

        <div className="mx-auto max-w-7xl">

          <div className="grid items-center gap-14 lg:grid-cols-2">

            <div>

              <p className="font-semibold text-emerald-600">
                WHY SHARENEST
              </p>

              <h2 className="mt-2 text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
                Own less.
                <br />
                Share more.
                <br />
                Live better.
              </h2>

              <p className="mt-6 max-w-xl leading-7 text-slate-500">
                Most things we buy are used only a few times.
                ShareNest turns unused resources into useful
                community assets.
              </p>

              <button
                onClick={() => navigate("/signup")}
                className="mt-7 flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white hover:bg-emerald-700"
              >
                Join your community
                <ArrowRight size={17} />
              </button>

            </div>

            <div className="grid gap-5">

              {benefits.map((benefit) => {

                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.title}
                    className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                      <Icon
                        size={22}
                        className="text-emerald-600"
                      />
                    </div>

                    <div>

                      <h3 className="font-bold text-slate-900">
                        {benefit.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {benefit.description}
                      </p>

                    </div>

                  </div>
                );

              })}

            </div>

          </div>

        </div>

      </section>

      {/* ================= COMMUNITY CTA ================= */}

      <section className="px-6 py-10">

        <div className="mx-auto max-w-7xl">

          <div className="overflow-hidden rounded-3xl bg-emerald-600 px-7 py-14 text-center text-white md:px-16">

            <Sparkles className="mx-auto mb-5" size={28} />

            <h2 className="text-3xl font-bold md:text-5xl">
              Your community has more than you think.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-emerald-50">
              Join ShareNest and turn the things sitting unused
              in your homes into resources everyone can enjoy.
            </p>

            <button
              onClick={() => navigate("/signup")}
              className="mt-8 rounded-xl bg-white px-7 py-4 font-semibold text-emerald-700 shadow-lg transition hover:bg-emerald-50"
            >
              Start Sharing Today
            </button>

          </div>

        </div>

      </section>

      {/* ================= FAQ ================= */}

      <section className="px-6 py-20">

        <div className="mx-auto max-w-4xl">

          <div className="text-center">

            <p className="font-semibold text-emerald-600">
              FAQ
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Frequently asked questions
            </h2>

          </div>

          <div className="mt-10 space-y-4">

            {faqs.map((faq) => (

              <details
                key={faq.question}
                className="group rounded-2xl border border-slate-200 bg-white p-5"
              >

                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-slate-900">

                  {faq.question}

                  <ChevronDown
                    size={19}
                    className="transition group-open:rotate-180"
                  />

                </summary>

                <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-500">
                  {faq.answer}
                </p>

              </details>

            ))}

          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-slate-200 bg-slate-950 px-6 py-12 text-white">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-10 md:grid-cols-4">

            <div className="md:col-span-2">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-xl font-bold">
                  S
                </div>

                <span className="text-2xl font-bold">
                  Share<span className="text-emerald-400">
                    Nest
                  </span>
                </span>

              </div>

              <p className="mt-5 max-w-md text-sm leading-6 text-slate-400">
                A community sharing platform that helps people
                borrow what they need, share what they own and
                build stronger communities.
              </p>

            </div>

            <div>

              <h3 className="font-semibold">
                Platform
              </h3>

              <div className="mt-4 space-y-3 text-sm text-slate-400">

                <button
                  onClick={() => navigate("/explore")}
                  className="block hover:text-white"
                >
                  Explore
                </button>

                <button
                  onClick={() => navigate("/signup")}
                  className="block hover:text-white"
                >
                  Join ShareNest
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="block hover:text-white"
                >
                  Login
                </button>

              </div>

            </div>

            <div>

              <h3 className="font-semibold">
                Community
              </h3>

              <div className="mt-4 space-y-3 text-sm text-slate-400">

                <p>Apartment Societies</p>
                <p>Hostels</p>
                <p>Colleges</p>
                <p>Neighborhoods</p>

              </div>

            </div>

          </div>

          <div className="mt-10 flex flex-col justify-between gap-3 border-t border-slate-800 pt-7 text-sm text-slate-500 md:flex-row">

            <p>
              © 2026 ShareNest. All rights reserved.
            </p>

            <p>
              Share More. Buy Less. Live Together.
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default Home;