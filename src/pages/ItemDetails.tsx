import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Heart,
  Info,
  Loader2,
  MapPin,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { api, type ApiItem, type ApiReview } from "../lib/api";

function ItemDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();

  const [item, setItem] = useState<ApiItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewsList, setReviewsList] = useState<ApiReview[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [note, setNote] = useState("");
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  // New review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const [itemRes, revRes] = await Promise.all([
          api.items.getById(id),
          api.reviews.getByItem(id),
        ]);

        if (itemRes.success && itemRes.item) {
          setItem(itemRes.item);
        }
        if (revRes.success && revRes.reviews) {
          setReviewsList(revRes.reviews);
        }

        const favs = JSON.parse(localStorage.getItem("sharenest_favs") || "[]");
        setIsFavorite(favs.includes(id));
      } catch (err: any) {
        console.error("Failed to load item:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleFavoriteToggle = () => {
    if (!id) return;
    const favs = JSON.parse(localStorage.getItem("sharenest_favs") || "[]");
    let updated: string[];
    if (favs.includes(id)) {
      updated = favs.filter((f: string) => f !== id);
    } else {
      updated = [...favs, id];
    }
    setIsFavorite(!isFavorite);
    localStorage.setItem("sharenest_favs", JSON.stringify(updated));
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!startDate || !endDate) {
      setErrorMessage("Please select both start date and return date.");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setErrorMessage("Return date cannot be earlier than start date.");
      return;
    }

    try {
      setSubmittingRequest(true);
      const res = await api.requests.create({
        itemId: id!,
        startDate,
        endDate,
        note: note.trim() || undefined,
      });

      if (res.success) {
        setRequestSent(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit request.");
    } finally {
      setSubmittingRequest(false);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newComment.trim()) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await api.reviews.add({
        itemId: id,
        rating: newRating,
        comment: newComment.trim(),
      });

      if (res.success) {
        setReviewsList((prev) => [res.review, ...prev]);
        if (item) {
          setItem({
            ...item,
            rating: res.itemRating,
            reviewsCount: res.itemReviewsCount,
          });
        }
        setNewComment("");
        setShowReviewForm(false);
      }
    } catch (err: any) {
      alert(err.message || "Failed to post review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center p-6">
          <Loader2 className="animate-spin text-emerald-600" size={36} />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-lg max-w-md w-full">
            <Info size={40} className="mx-auto text-amber-500 mb-4" />
            <h1 className="text-2xl font-bold text-slate-900">Item Not Found</h1>
            <p className="mt-2 text-sm text-slate-500">
              The item you are looking for does not exist or may have been removed.
            </p>
            <button
              onClick={() => navigate("/explore")}
              className="mt-6 w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white shadow-md hover:bg-emerald-700"
            >
              Back to Explore
            </button>
          </div>
        </div>
      </div>
    );
  }

  const ownerId = typeof item.owner === "object" ? (item.owner as any)._id : item.owner;
  const isOwner = user && ownerId && String(ownerId) === String(user.id);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft size={16} />
          Back to items
        </button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* LEFT COLUMN: ITEM PHOTO & DETAILS */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Main Photo Card */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="relative h-96 w-full overflow-hidden rounded-2xl bg-slate-100">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-8xl">
                    {item.icon || "📦"}
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-white/95 px-4 py-1.5 text-xs font-bold text-slate-900 shadow-sm backdrop-blur-md">
                    {item.category}
                  </span>
                </div>

                {/* Favorite Button */}
                <button
                  onClick={handleFavoriteToggle}
                  className={`absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/95 shadow-md backdrop-blur-md transition ${
                    isFavorite ? "text-red-500" : "text-slate-400 hover:text-red-500"
                  }`}
                >
                  <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                </button>

                {/* Availability Badge */}
                <div className="absolute bottom-4 left-4">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold shadow-sm backdrop-blur-md ${
                      item.available
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-900/90 text-slate-300"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        item.available ? "bg-white" : "bg-slate-400"
                      }`}
                    />
                    {item.available ? "Available Now" : "Currently Borrowed"}
                  </span>
                </div>
              </div>

              {/* Title & Specs */}
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {item.name}
                  </h1>

                  <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700 border border-amber-200/60 w-fit">
                    <Star size={16} fill="currentColor" />
                    <span>{item.rating?.toFixed(1) || "5.0"}</span>
                    <span className="text-amber-500">
                      ({item.reviewsCount} {item.reviewsCount === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-emerald-600" />
                    {item.location} ({item.community})
                  </span>
                  <span>•</span>
                  <span>Condition: <strong className="text-slate-800">{item.condition || "Excellent"}</strong></span>
                  <span>•</span>
                  <span>Deposit: <strong className="text-slate-800">{item.deposit || "Free sharing"}</strong></span>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Description & Instructions
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Owner Profile Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xl shadow-md shadow-emerald-500/20">
                    {item.ownerName ? item.ownerName.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{item.ownerName}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <ShieldCheck size={14} className="text-emerald-600" />
                      Verified Community Member in {item.community}
                    </p>
                  </div>
                </div>

                {isOwner && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                    Your Item
                  </span>
                )}
              </div>
            </div>

            {/* REVIEWS SECTION */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Neighbor Reviews ({reviewsList.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real feedback from neighbors who have borrowed this item
                  </p>
                </div>

                {!isOwner && isAuthenticated && (
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100/70 transition"
                  >
                    {showReviewForm ? "Cancel Review" : "Write Review"}
                  </button>
                )}
              </div>

              {/* Add Review Form */}
              {showReviewForm && (
                <form
                  onSubmit={handleAddReview}
                  className="mb-6 rounded-2xl bg-slate-50 p-4 border border-slate-200 animate-in fade-in"
                >
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Rating (1 to 5 Stars)
                  </label>
                  <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className={`p-2 rounded-xl border ${
                          newRating >= star
                            ? "bg-amber-100 border-amber-300 text-amber-600"
                            : "bg-white border-slate-200 text-slate-400"
                        }`}
                      >
                        <Star size={18} fill={newRating >= star ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>

                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share how the item worked, handover experience, etc."
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs outline-none focus:border-emerald-500"
                  />

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="mt-3 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                  >
                    {submittingReview ? "Posting..." : "Submit Review"}
                  </button>
                </form>
              )}

              {/* Reviews List */}
              {reviewsList.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <Star size={24} className="mx-auto mb-2 opacity-40 text-amber-500" />
                  <p className="text-xs">No reviews yet for this resource. Be the first to borrow and review!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviewsList.map((rev) => (
                    <div
                      key={rev._id}
                      className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">
                          {rev.userName}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-amber-500">
                          <Star size={14} fill="currentColor" />
                          <span className="font-bold">{rev.rating}</span>
                        </div>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: REQUEST FORM / BORROW WORKFLOW */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
              {requestSent ? (
                <div className="text-center py-6">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mb-4 animate-in zoom-in-75">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900">
                    Request Submitted!
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                    Your borrow request has been sent to{" "}
                    <strong className="text-slate-800">{item.ownerName}</strong>. You'll receive a notification as soon as they review and approve it.
                  </p>

                  <div className="mt-6 flex flex-col gap-3">
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition"
                    >
                      Track in Dashboard →
                    </button>
                    <button
                      onClick={() => setRequestSent(false)}
                      className="w-full rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Request Another Date
                    </button>
                  </div>
                </div>
              ) : isOwner ? (
                <div>
                  <div className="rounded-2xl bg-emerald-50/80 p-5 border border-emerald-200/60 mb-6">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-1">
                      <Sparkles size={16} />
                      You own this resource
                    </div>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      You are listed as the owner of this item in {item.community}. You can manage availability and view incoming requests in your Dashboard.
                    </p>
                  </div>

                  <button
                    onClick={() => navigate("/dashboard")}
                    className="w-full rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white hover:bg-slate-800 transition"
                  >
                    Go to Owner Dashboard
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendRequest} className="space-y-5">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">
                      Borrow This Item
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Select your desired dates to send a borrow request to {item.ownerName}.
                    </p>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Start Date
                      </label>
                      <div className="relative">
                        <Calendar
                          size={16}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          required
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Return Date
                      </label>
                      <div className="relative">
                        <Calendar
                          size={16}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          min={startDate || new Date().toISOString().split("T")[0]}
                          required
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Optional message */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Message to Owner (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Hi! I'd love to borrow this for a family gathering on Friday..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white transition"
                    />
                  </div>

                  {errorMessage && (
                    <div className="rounded-xl bg-red-50 p-3 text-xs font-bold text-red-600 border border-red-200/60">
                      {errorMessage}
                    </div>
                  )}

                  {/* Trust badge */}
                  <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 flex items-start gap-3 text-xs text-slate-600">
                    <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                    <p>
                      <strong>Community Pledge:</strong> By sending this request, you agree to treat the resource with utmost care and return it punctually on or before the return date.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submittingRequest || !item.available}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submittingRequest ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                    {submittingRequest
                      ? "Sending Request..."
                      : item.available
                      ? "Send Borrow Request"
                      : "Item Currently Unavailable"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ItemDetails;