import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Search,
  Plus,
  MapPin,
  CheckCircle2,
  Package,
  Loader2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { api, type ApiCommunity } from "../lib/api";

function CommunitySetup() {
  const navigate = useNavigate();
  const { user, isAuthenticated, refreshUser } = useAuth();

  const [mode, setMode] = useState<"join" | "create">("join");
  const [communities, setCommunities] = useState<ApiCommunity[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState(user?.community || "Sunrise Heights");
  const [newCommunityName, setNewCommunityName] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true);
        const res = await api.communities.getAll();
        if (res.success && res.communities) {
          setCommunities(res.communities);
          if (!selectedCommunity && res.communities.length > 0) {
            setSelectedCommunity(res.communities[0].name);
          }
        }
      } catch (err) {
        console.error("Failed to load communities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  const handleContinue = async () => {
    setError("");

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setSubmitting(true);
      if (mode === "join") {
        if (!selectedCommunity.trim()) {
          setError("Please select a community to join.");
          return;
        }
        await api.communities.join(selectedCommunity.trim());
      } else {
        if (!newCommunityName.trim() || !newLocation.trim()) {
          setError("Please provide community name and location.");
          return;
        }
        await api.communities.create({
          name: newCommunityName.trim(),
          location: newLocation.trim(),
          description: newDescription.trim() || undefined,
        });
      }

      await refreshUser();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to update community.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 py-12">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 font-bold">
              <Building2 size={28} />
            </div>

            <h1 className="mt-4 text-3xl font-extrabold text-slate-900">
              Community Hub
            </h1>

            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
              ShareNest operates within trusted apartment societies, hostels, colleges, and local neighborhoods.
            </p>
          </div>

          {/* Card */}
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
            {/* Toggle Modes */}
            <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1">
              <button
                onClick={() => setMode("join")}
                className={`flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold transition ${
                  mode === "join"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Search size={17} />
                Join Existing
              </button>

              <button
                onClick={() => setMode("create")}
                className={`flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold transition ${
                  mode === "create"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Plus size={17} />
                Create New
              </button>
            </div>

            {/* JOIN MODE */}
            {mode === "join" && (
              <div className="mt-6 space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Select a Community in MongoDB
                </label>

                {loading ? (
                  <div className="py-8 text-center text-slate-400">
                    <Loader2 className="animate-spin mx-auto text-emerald-600" size={24} />
                  </div>
                ) : communities.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 p-4 text-center text-xs text-slate-500">
                    No communities found yet. Switch to "Create New" to start your society!
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {communities.map((comm) => {
                      const isSelected = selectedCommunity === comm.name;
                      return (
                        <div
                          key={comm._id}
                          onClick={() => setSelectedCommunity(comm.name)}
                          className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition ${
                            isSelected
                              ? "border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500"
                              : "border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-sm ${
                                isSelected
                                  ? "bg-emerald-600 text-white"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              <Building2 size={18} />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-slate-900">{comm.name}</h4>
                              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                <MapPin size={12} />
                                {comm.location}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                            <span className="flex items-center gap-1">
                              <Package size={13} className="text-emerald-600" />
                              {comm.itemsCount || 0} items
                            </span>
                            {isSelected && (
                              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* CREATE MODE */}
            {mode === "create" && (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Community / Society Name *
                  </label>
                  <input
                    type="text"
                    value={newCommunityName}
                    onChange={(e) => setNewCommunityName(e.target.value)}
                    placeholder="e.g. Palm Meadows Society"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Location / Sector *
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Whitefield, Bengaluru"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Neighborhood sharing group for Palm Meadows residents..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-600 border border-red-200/60">
                {error}
              </div>
            )}

            {/* Submit Action */}
            <div className="mt-8">
              <button
                onClick={handleContinue}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 font-bold text-white shadow-md hover:bg-emerald-700 transition disabled:opacity-70"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : null}
                {submitting
                  ? "Saving Community..."
                  : mode === "join"
                  ? `Join ${selectedCommunity}`
                  : "Create & Enter Community"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CommunitySetup;