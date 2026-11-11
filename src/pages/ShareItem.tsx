import {
  ArrowLeft,
  CheckCircle2,
  ImagePlus,
  Loader2,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

const PRESET_IMAGES: Record<string, string> = {
  Tools: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
  Electronics: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80",
  Sports: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
  Books: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
  "Party Supplies": "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=800&q=80",
  Home: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
};

function ShareItem() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Tools");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(user?.community || "Sunrise Heights");
  const [condition, setCondition] = useState("Like New");
  const [deposit, setDeposit] = useState("Free sharing");
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES["Tools"]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "Tools":
        return "🔧";
      case "Electronics":
        return "📽️";
      case "Sports":
        return "🏸";
      case "Books":
        return "📚";
      case "Party Supplies":
        return "🎉";
      case "Home":
        return "🧹";
      default:
        return "📦";
    }
  };

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    // Auto-suggest high quality preset image if user hasn't uploaded custom
    if (!imageUrl || Object.values(PRESET_IMAGES).includes(imageUrl)) {
      setImageUrl(PRESET_IMAGES[newCat] || "");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setError("");
      const res = await api.items.uploadImage(file);
      if (res.success && res.imageUrl) {
        setImageUrl(res.imageUrl);
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload image. You can also paste an image URL.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!name.trim() || !description.trim()) {
      setError("Please fill in item name and description.");
      return;
    }

    try {
      setSubmitting(true);
      const icon = getCategoryIcon(category);

      await api.items.create({
        name: name.trim(),
        category,
        icon,
        imageUrl: imageUrl || PRESET_IMAGES[category] || "",
        location: location.trim() || user?.community || "Sunrise Heights",
        community: user?.community || "Sunrise Heights",
        description: description.trim(),
        condition,
        deposit,
      });

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to list item. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl animate-in zoom-in-95">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-2">
              <CheckCircle2 size={46} />
            </div>

            <h1 className="mt-4 text-3xl font-extrabold text-slate-900">
              Item Published!
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Your item <span className="font-bold text-slate-800">{name}</span> is now active in MongoDB and available for neighbors in{" "}
              <span className="font-bold text-emerald-600">{location || user?.community}</span>.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full rounded-xl bg-emerald-600 py-3.5 font-semibold text-white shadow-md hover:bg-emerald-700 transition"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => navigate("/explore")}
                className="w-full rounded-xl border border-slate-200 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                View in Community Marketplace
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <main className="flex-1 mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/60 mb-2">
              <Sparkles size={14} />
              Lend to Your Community
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Share an Item
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Lend tools, electronics, books, or sports gear to trusted members in {user?.community || "your society"}.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Item Title *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Bosch Hammer Drill 650W with Bits"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            {/* Category & Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white"
                >
                  <option value="Tools">🔧 Tools & Hardware</option>
                  <option value="Electronics">📽️ Electronics & Gadgets</option>
                  <option value="Sports">🏸 Sports & Fitness</option>
                  <option value="Books">📚 Books & Learning</option>
                  <option value="Party Supplies">🎉 Party Supplies & Games</option>
                  <option value="Home">🧹 Home & Garden</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Condition *
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white"
                >
                  <option value="Like New">Like New (Mint)</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good (Working fine)</option>
                  <option value="Fair">Fair (Minor wear)</option>
                </select>
              </div>
            </div>

            {/* Deposit & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Deposit / Fee
                </label>
                <input
                  type="text"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  placeholder="Free sharing or refundable deposit"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Pickup Location
                </label>
                <div className="relative">
                  <MapPin
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Sunrise Heights, Tower B"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-10 pr-3 text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Photo Upload or URL */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Item Photo (Upload or Image URL)
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {imageUrl && (
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-1 w-full flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer transition">
                      <ImagePlus size={16} />
                      {uploadingImage ? "Uploading..." : "Upload File"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-xs text-slate-400">or paste URL below</span>
                  </div>

                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Description & Pickup Instructions *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what's included, how to use it, accessories, and pickup advice..."
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-xs font-bold text-red-600 border border-red-200/60">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition disabled:opacity-70"
            >
              {submitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Sparkles size={18} />
              )}
              {submitting ? "Publishing Item..." : "Publish Item to Community"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ShareItem;