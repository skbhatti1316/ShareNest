import {
  Heart,
  MapPin,
  Plus,
  Search,
  Sparkles,
  Star,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { api, type ApiItem } from "../lib/api";

const categories = [
  "All",
  "Tools",
  "Electronics",
  "Sports",
  "Books",
  "Party Supplies",
  "Home",
];

function Explore() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [items, setItems] = useState<ApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState<"rating" | "newest" | "reviews">("rating");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeCommunity = user?.community || "Sunrise Heights";

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await api.items.getAll({
        search: search.trim() || undefined,
        category: selectedCategory !== "All" ? selectedCategory : undefined,
        available: onlyAvailable ? true : undefined,
        sort: sortBy,
      });
      if (res.success) {
        setItems(res.items || []);
      }
    } catch (err) {
      console.error("Failed to fetch items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [search, selectedCategory, onlyAvailable, sortBy]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("sharenest_favs") || "[]");
      setFavorites(saved);
    } catch {}
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFavoriteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    let updated: string[];
    if (favorites.includes(id)) {
      updated = favorites.filter((f) => f !== id);
      showToast("Removed from saved items");
    } else {
      updated = [...favorites, id];
      showToast("Saved to your favorites ❤️");
    }
    setFavorites(updated);
    localStorage.setItem("sharenest_favs", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="text-emerald-400" size={18} />
          {toastMessage}
        </div>
      )}

      {/* NAVBAR */}
      <Navbar />

      {/* PAGE HEADER */}
      <main className="flex-1">
        <section className="border-b border-slate-200/80 bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active Community: {activeCommunity}
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  Community Marketplace
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Browse verified items shared by trusted neighbors in your community. Borrow easily, save money, and share responsibly.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/share-item")}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition"
                >
                  <Plus size={18} />
                  Share An Item
                </button>
              </div>
            </div>

            {/* SEARCH & FILTER CONTROLS */}
            <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-12">
              {/* Search Bar */}
              <div className="relative md:col-span-6">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projector, cordless drill, tent, badminton..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white transition"
                />
              </div>

              {/* Sort By */}
              <div className="md:col-span-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition"
                >
                  <option value="rating">Top Rated First</option>
                  <option value="newest">Newest Listed</option>
                  <option value="reviews">Most Reviewed</option>
                </select>
              </div>

              {/* Only Available Toggle */}
              <div className="flex items-center md:col-span-3">
                <label className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100/70 transition">
                  <span>Available Only</span>
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                    className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                </label>
              </div>
            </div>

            {/* CATEGORY PILLS */}
            <div className="mt-5 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold shrink-0 transition ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ITEMS GRID */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              {selectedCategory === "All" ? "All Resources" : selectedCategory} (
              {items.length})
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Showing active community items
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm animate-pulse"
                >
                  <div className="h-48 w-full rounded-2xl bg-slate-200 mb-4" />
                  <div className="h-4 w-2/3 bg-slate-200 rounded mb-2" />
                  <div className="h-3 w-1/2 bg-slate-200 rounded mb-4" />
                  <div className="h-8 w-full bg-slate-100 rounded-xl" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center max-w-lg mx-auto">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 text-3xl mb-4">
                🔍
              </div>
              <h3 className="text-lg font-bold text-slate-900">No items found</h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                We couldn't find any items matching your filters. Try adjusting your search query or clear filters.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                  setOnlyAvailable(false);
                }}
                className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item) => {
                const itemId = item._id || item.id || "";
                const isFav = favorites.includes(itemId);

                return (
                  <div
                    key={itemId}
                    onClick={() => navigate(`/item/${itemId}`)}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-200 cursor-pointer"
                  >
                    <div>
                      {/* Photo Container */}
                      <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-100">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-5xl">
                            {item.icon || "📦"}
                          </div>
                        )}

                        {/* Category Tag */}
                        <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-slate-800 shadow-sm backdrop-blur-sm">
                          {item.category}
                        </span>

                        {/* Favorite Button */}
                        <button
                          onClick={(e) => handleFavoriteClick(e, itemId)}
                          className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition ${
                            isFav ? "text-red-500" : "text-slate-400 hover:text-red-500"
                          }`}
                        >
                          <Heart size={16} fill={isFav ? "currentColor" : "none"} />
                        </button>

                        {/* Availability Pill */}
                        <div className="absolute bottom-3 left-3">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm backdrop-blur-md ${
                              item.available
                                ? "bg-emerald-600/90 text-white"
                                : "bg-slate-800/80 text-slate-300"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                item.available ? "bg-white" : "bg-slate-400"
                              }`}
                            />
                            {item.available ? "Available Now" : "Currently Borrowed"}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition truncate">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-500 shrink-0 ml-2">
                            <Star size={14} fill="currentColor" />
                            <span>{item.rating?.toFixed(1) || "5.0"}</span>
                          </div>
                        </div>

                        <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 truncate">
                        <User size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate">{item.ownerName}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 text-slate-400">
                        <MapPin size={13} />
                        <span className="truncate max-w-[100px]">{item.location}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Explore;