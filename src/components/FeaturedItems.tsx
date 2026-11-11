import {
  ArrowRight,
  CalendarDays,
  Heart,
  MapPin,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function FeaturedItems() {
  const navigate = useNavigate();

  const items = [
    {
      name: "Cordless Power Drill",
      category: "Tools",
      owner: "Rahul",
      location: "Block A",
      rating: "4.9",
      price: "Free",
      icon: "🔧",
      bg: "bg-emerald-100",
    },
    {
      name: "HD Projector",
      category: "Electronics",
      owner: "Priya",
      location: "Block C",
      rating: "4.8",
      price: "₹50/day",
      icon: "📽️",
      bg: "bg-blue-100",
    },
    {
      name: "Badminton Set",
      category: "Sports",
      owner: "Amit",
      location: "Block B",
      rating: "5.0",
      price: "Free",
      icon: "🏸",
      bg: "bg-orange-100",
    },
    {
      name: "Party Speaker",
      category: "Party",
      owner: "Neha",
      location: "Block D",
      rating: "4.7",
      price: "₹100/day",
      icon: "🔊",
      bg: "bg-purple-100",
    },
  ];

  return (
    <section className="bg-white px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              Available nearby
            </span>

            <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Things your neighbors are{" "}
              <span className="text-emerald-600">sharing.</span>
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Useful things don't need to sit unused. Borrow them from
              someone nearby and return them when you're done.
            </p>
          </div>

          <button
            onClick={() => navigate("/explore")}
            className="group flex w-fit items-center gap-2 font-semibold text-emerald-600 transition hover:text-emerald-700"
          >
            Explore all items
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>

        {/* Items */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.name}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60"
            >
              {/* Image / Item visual */}
              <div
                className={`relative flex h-52 items-center justify-center ${item.bg}`}
              >
                <span className="text-7xl transition duration-300 group-hover:scale-110">
                  {item.icon}
                </span>

                {/* Favourite */}
                <button
                  aria-label={`Save ${item.name}`}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm backdrop-blur transition hover:text-red-500"
                >
                  <Heart size={18} />
                </button>

                {/* Availability */}
                <div className="absolute bottom-4 left-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
                  Available
                </div>
              </div>

              {/* Details */}
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                  {item.category}
                </p>

                <h3 className="mt-2 text-lg font-bold text-slate-900">
                  {item.name}
                </h3>

                {/* Owner */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                    {item.owner.charAt(0)}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {item.owner}
                    </p>

                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin size={12} />
                      {item.location}
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star
                      size={15}
                      className="fill-yellow-400 text-yellow-400"
                    />

                    <span className="text-sm font-semibold text-slate-700">
                      {item.rating}
                    </span>
                  </div>

                  <span className="text-slate-300">•</span>

                  <span className="text-sm font-medium text-emerald-600">
                    {item.price}
                  </span>
                </div>

                {/* Request button */}
                <button
                  onClick={() => navigate("/explore")}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-600 hover:bg-emerald-600 hover:text-white"
                >
                  <CalendarDays size={17} />
                  Request to Borrow
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default FeaturedItems;