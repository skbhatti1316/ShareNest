import {
  Wrench,
  MonitorPlay,
  Dumbbell,
  BookOpen,
  CookingPot,
  PartyPopper,
  Tent,
  Sprout,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Resources() {
  const navigate = useNavigate();

  const categories = [
    {
      name: "Tools",
      count: "18 items",
      icon: Wrench,
      description: "Drills, ladders, toolkits and more",
    },
    {
      name: "Electronics",
      count: "12 items",
      icon: MonitorPlay,
      description: "Projectors, speakers and gadgets",
    },
    {
      name: "Sports",
      count: "24 items",
      icon: Dumbbell,
      description: "Rackets, balls and sports gear",
    },
    {
      name: "Books",
      count: "56 items",
      icon: BookOpen,
      description: "Books, novels and study material",
    },
    {
      name: "Kitchen",
      count: "15 items",
      icon: CookingPot,
      description: "Cookware and kitchen appliances",
    },
    {
      name: "Party",
      count: "21 items",
      icon: PartyPopper,
      description: "Speakers, decorations and supplies",
    },
    {
      name: "Travel",
      count: "9 items",
      icon: Tent,
      description: "Tents, bags and travel equipment",
    },
    {
      name: "Gardening",
      count: "11 items",
      icon: Sprout,
      description: "Tools and gardening equipment",
    },
  ];

  return (
    <section
      id="explore"
      className="bg-slate-50 px-6 py-24 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
              Explore your community
            </span>

            <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Everything you need,
              <span className="text-emerald-600"> shared nearby.</span>
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              From a screwdriver to a projector, discover useful things
              already available within your community.
            </p>
          </div>

          <button
            onClick={() => navigate("/explore")}
            className="group flex w-fit items-center gap-2 font-semibold text-emerald-600 transition hover:text-emerald-700"
          >
            View all resources
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>

        {/* Categories */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <button
                key={category.name}
                onClick={() => navigate("/explore")}
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-200/60"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                    <Icon size={23} />
                  </div>

                  <ArrowRight
                    size={18}
                    className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600"
                  />
                </div>

                <h3 className="mt-6 text-lg font-bold text-slate-900">
                  {category.name}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {category.description}
                </p>

                <p className="mt-4 text-sm font-semibold text-emerald-600">
                  {category.count}
                </p>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default Resources;