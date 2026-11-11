import {
  Bell,
  Building2,
  Calendar,
  Check,
  CheckCircle,
  CheckCircle2,
  Heart,
  Inbox,
  Loader2,
  MapPin,
  MessageSquare,
  Package,
  Plus,
  Search,
  Send,
  Share2,
  Star,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import {
  api,
  type ApiBorrowRequest,
  type ApiItem,
  type ApiMessage,
} from "../lib/api";

type TabType = "Overview" | "Incoming" | "Borrowing" | "Shared" | "Notifications" | "Saved";

function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { notifications, markAsRead, markAllAsRead, refreshNotifications } = useSocket();

  const [activeTab, setActiveTab] = useState<TabType>("Overview");
  const [loading, setLoading] = useState(true);

  // Data states
  const [sentRequests, setSentRequests] = useState<ApiBorrowRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<ApiBorrowRequest[]>([]);
  const [myItems, setMyItems] = useState<ApiItem[]>([]);
  const [allItems, setAllItems] = useState<ApiItem[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Action / Modal states
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reject modal
  const [rejectModalReq, setRejectModalReq] = useState<ApiBorrowRequest | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Review modal
  const [reviewModalReq, setReviewModalReq] = useState<ApiBorrowRequest | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  // Chat modal
  const [chatModalReq, setChatModalReq] = useState<ApiBorrowRequest | null>(null);
  const [chatMessages, setChatMessages] = useState<ApiMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadAllData = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    try {
      setLoading(true);
      const [sentRes, recvRes, itemsRes] = await Promise.all([
        api.requests.getSent(),
        api.requests.getReceived(),
        api.items.getAll(),
      ]);

      if (sentRes.success) setSentRequests(sentRes.requests || []);
      if (recvRes.success) setReceivedRequests(recvRes.requests || []);
      if (itemsRes.success) {
        setAllItems(itemsRes.items || []);
        setMyItems(
          (itemsRes.items || []).filter(
            (i) =>
              (typeof i.owner === "object" ? (i.owner as any)._id : i.owner) === user.id ||
              i.ownerEmail === user.email
          )
        );
      }

      try {
        const favs = JSON.parse(localStorage.getItem("sharenest_favs") || "[]");
        setFavoriteIds(favs);
      } catch {}
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
      return;
    }
    loadAllData();
  }, [authLoading, isAuthenticated, loadAllData, navigate]);

  // Request Lifecycle Actions
  const handleApprove = async (id: string) => {
    try {
      setActionLoading(id);
      const res = await api.requests.approve(id);
      if (res.success) {
        showToast("Borrow request approved! 🎉");
        loadAllData();
        refreshNotifications();
      }
    } catch (err: any) {
      alert(err.message || "Failed to approve request.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenReject = (req: ApiBorrowRequest) => {
    setRejectModalReq(req);
    setRejectReason("");
  };

  const handleConfirmReject = async () => {
    if (!rejectModalReq) return;
    try {
      setActionLoading(rejectModalReq._id);
      const res = await api.requests.reject(rejectModalReq._id, rejectReason);
      if (res.success) {
        showToast("Borrow request rejected.");
        setRejectModalReq(null);
        loadAllData();
        refreshNotifications();
      }
    } catch (err: any) {
      alert(err.message || "Failed to reject request.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelRequest = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this borrow request?")) return;
    try {
      setActionLoading(id);
      const res = await api.requests.cancel(id);
      if (res.success) {
        showToast("Borrow request cancelled.");
        loadAllData();
        refreshNotifications();
      }
    } catch (err: any) {
      alert(err.message || "Failed to cancel request.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReadyPickup = async (id: string) => {
    try {
      setActionLoading(id);
      const res = await api.requests.markReadyForPickup(id);
      if (res.success) {
        showToast("Marked ready for pickup! 📍");
        loadAllData();
        refreshNotifications();
      }
    } catch (err: any) {
      alert(err.message || "Failed to update pickup status.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmHandover = async (id: string) => {
    try {
      setActionLoading(id);
      const res = await api.requests.confirmHandover(id);
      if (res.success) {
        showToast("Handover confirmed! Active loan started.");
        loadAllData();
        refreshNotifications();
      }
    } catch (err: any) {
      alert(err.message || "Failed to confirm handover.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRequestReturn = async (id: string) => {
    try {
      setActionLoading(id);
      const res = await api.requests.requestReturn(id);
      if (res.success) {
        showToast("Return requested! Owner has been notified. 🔄");
        loadAllData();
        refreshNotifications();
      }
    } catch (err: any) {
      alert(err.message || "Failed to request return.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmReturn = async (id: string) => {
    try {
      setActionLoading(id);
      const res = await api.requests.confirmReturn(id);
      if (res.success) {
        showToast("Return confirmed! Resource marked available again. ✅");
        loadAllData();
        refreshNotifications();
      }
    } catch (err: any) {
      alert(err.message || "Failed to confirm return.");
    } finally {
      setActionLoading(null);
    }
  };

  // Item Management Handlers
  const handleToggleItemAvailability = async (itemId: string, current: boolean) => {
    try {
      setActionLoading(itemId);
      const res = await api.items.toggleAvailability(itemId, !current);
      if (res.success) {
        showToast(res.available ? "Item marked available" : "Item marked unavailable");
        loadAllData();
      }
    } catch (err: any) {
      alert(err.message || "Failed to update availability.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to remove this item listing? Permanent action.")) return;
    try {
      setActionLoading(itemId);
      const res = await api.items.delete(itemId);
      if (res.success) {
        showToast("Item listing removed.");
        loadAllData();
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete item.");
    } finally {
      setActionLoading(null);
    }
  };

  // Review Submissions
  const handleOpenReview = (req: ApiBorrowRequest) => {
    setReviewModalReq(req);
    setReviewRating(5);
    setReviewComment("");
  };

  const handleConfirmReview = async () => {
    if (!reviewModalReq || !reviewComment.trim()) return;
    const itemId =
      typeof reviewModalReq.item === "object" ? reviewModalReq.item._id : reviewModalReq.item;

    try {
      setActionLoading("review");
      const res = await api.reviews.add({
        itemId,
        rating: reviewRating,
        comment: reviewComment.trim(),
        requestId: reviewModalReq._id,
      });

      if (res.success) {
        showToast("Review submitted! Thank you! 🌟");
        setReviewModalReq(null);
        loadAllData();
      }
    } catch (err: any) {
      alert(err.message || "Failed to submit review.");
    } finally {
      setActionLoading(null);
    }
  };

  // Chat Modal Handlers
  const handleOpenChat = async (req: ApiBorrowRequest) => {
    setChatModalReq(req);
    setNewMessageText("");
    try {
      setLoadingChat(true);
      const res = await api.requests.getMessages(req._id);
      if (res.success) {
        setChatMessages(res.messages || []);
      }
    } catch (err) {
      console.error("Failed to load chat messages:", err);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatModalReq || !newMessageText.trim()) return;

    try {
      const res = await api.requests.sendMessage(chatModalReq._id, newMessageText.trim());
      if (res.success && res.message) {
        setChatMessages((prev) => [...prev, res.message]);
        setNewMessageText("");
      }
    } catch (err: any) {
      alert(err.message || "Failed to send message");
    }
  };

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return d;
    }
  };

  const getStatusBadge = (status: ApiBorrowRequest["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Approved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Ready for Pickup":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "Borrowed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Return Requested":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Returned":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "Rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "Cancelled":
        return "bg-slate-100 text-slate-600 border-slate-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  // Calculations for real DB counts
  const incomingPending = receivedRequests.filter((r) => r.status === "Pending");
  const incomingActiveLoans = receivedRequests.filter(
    (r) => r.status === "Approved" || r.status === "Ready for Pickup" || r.status === "Borrowed" || r.status === "Return Requested"
  );
  const myActiveBorrowed = sentRequests.filter(
    (r) => r.status === "Borrowed" || r.status === "Approved" || r.status === "Ready for Pickup"
  );
  const savedItems = allItems.filter((i) => favoriteIds.includes(i._id));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle className="text-emerald-400" size={18} />
          {toastMessage}
        </div>
      )}

      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full">
        {/* WELCOME BANNER */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200/60 mb-2">
              <Building2 size={14} />
              {user?.community || "Sunrise Heights"}
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Dashboard & Activity Center
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Welcome back, <strong className="text-slate-800">{user?.name}</strong>. Manage your incoming requests, active loans, and shared community items.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/share-item")}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition"
            >
              <Plus size={18} />
              Share New Item
            </button>

            <button
              onClick={() => navigate("/explore")}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
            >
              <Search size={18} />
              Find Items
            </button>
          </div>
        </div>

        {/* METRICS / STATS CARDS */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div
            onClick={() => setActiveTab("Incoming")}
            className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm hover:shadow-md cursor-pointer transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Incoming Requests
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Inbox size={18} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {incomingPending.length}
              </span>
              <span className="text-xs font-semibold text-amber-600">
                {incomingPending.length === 1 ? "needs approval" : "need approval"}
              </span>
            </div>
          </div>

          <div
            onClick={() => setActiveTab("Borrowing")}
            className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm hover:shadow-md cursor-pointer transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                My Active Loans
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Package size={18} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {myActiveBorrowed.length}
              </span>
              <span className="text-xs font-semibold text-blue-600">borrowed items</span>
            </div>
          </div>

          <div
            onClick={() => setActiveTab("Shared")}
            className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm hover:shadow-md cursor-pointer transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                My Shared Items
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Share2 size={18} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {myItems.length}
              </span>
              <span className="text-xs font-semibold text-emerald-600">in circulation</span>
            </div>
          </div>

          <div
            onClick={() => setActiveTab("Notifications")}
            className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm hover:shadow-md cursor-pointer transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Notifications
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Bell size={18} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {notifications.filter((n) => !n.read).length}
              </span>
              <span className="text-xs font-semibold text-purple-600">unread alerts</span>
            </div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="mt-8 flex gap-2 border-b border-slate-200 overflow-x-auto pb-px scrollbar-none">
          {(
            [
              { key: "Overview", label: "Overview" },
              {
                key: "Incoming",
                label: `Requests Received (${receivedRequests.length})`,
                badge: incomingPending.length,
              },
              {
                key: "Borrowing",
                label: `My Borrowing (${sentRequests.length})`,
              },
              {
                key: "Shared",
                label: `My Shared Items (${myItems.length})`,
              },
              {
                key: "Notifications",
                label: `Notifications (${notifications.length})`,
              },
              {
                key: "Saved",
                label: `Saved (${savedItems.length})`,
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-5 py-3.5 text-sm font-bold transition ${
                activeTab === tab.key
                  ? "border-emerald-600 text-emerald-700 bg-emerald-50/40 rounded-t-xl"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>{tab.label}</span>
              {"badge" in tab && tab.badge && tab.badge > 0 ? (
                <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-extrabold text-white">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        <div className="mt-6">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="animate-spin mx-auto text-emerald-600" size={36} />
              <p className="mt-3 text-xs font-semibold text-slate-500">
                Loading database records...
              </p>
            </div>
          ) : (
            <>
              {/* 1. OVERVIEW TAB */}
              {activeTab === "Overview" && (
                <div className="space-y-8">
                  {/* Incoming requests alert banner if any pending */}
                  {incomingPending.length > 0 && (
                    <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white font-bold text-lg">
                          !
                        </div>
                        <div>
                          <h3 className="font-extrabold text-amber-950">
                            You have {incomingPending.length} pending borrow{" "}
                            {incomingPending.length === 1 ? "request" : "requests"} awaiting your decision
                          </h3>
                          <p className="text-xs text-amber-800 mt-0.5">
                            Approve or reject to let neighbors know if they can borrow your items.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab("Incoming")}
                        className="rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-amber-700 transition shrink-0"
                      >
                        Review Requests →
                      </button>
                    </div>
                  )}

                  {/* Active Loans Table */}
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-lg font-bold text-slate-900">
                          Active Community Exchanges
                        </h2>
                        <p className="text-xs text-slate-500">
                          Current items borrowed or lent across your community
                        </p>
                      </div>
                    </div>

                    {[...incomingActiveLoans, ...myActiveBorrowed].length === 0 ? (
                      <div className="py-12 text-center text-slate-400">
                        <Package size={36} className="mx-auto mb-2 opacity-40 text-emerald-600" />
                        <p className="text-xs font-medium">No active loans right now.</p>
                        <button
                          onClick={() => navigate("/explore")}
                          className="mt-3 text-xs font-bold text-emerald-600 hover:underline"
                        >
                          Find something to borrow in Explore →
                        </button>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {[...incomingActiveLoans, ...myActiveBorrowed].map((req) => (
                          <div
                            key={req._id}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4"
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                                {req.item?.icon || "📦"}
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-900 text-sm">
                                  {req.item?.name}
                                </h4>
                                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <User size={12} />
                                    {req.borrower?.name}
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    {formatDate(req.startDate)} - {formatDate(req.endDate)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-bold border ${getStatusBadge(
                                  req.status
                                )}`}
                              >
                                {req.status}
                              </span>

                              <button
                                onClick={() => handleOpenChat(req)}
                                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                              >
                                <MessageSquare size={13} />
                                Chat
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. INCOMING REQUESTS TAB (OWNER VIEW) */}
              {activeTab === "Incoming" && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        Requests Received ({receivedRequests.length})
                      </h2>
                      <p className="text-xs text-slate-500">
                        Neighbors requesting to borrow items you've shared. Approve or coordinate pickup and return.
                      </p>
                    </div>
                  </div>

                  {receivedRequests.length === 0 ? (
                    <div className="py-16 text-center text-slate-400">
                      <Inbox size={42} className="mx-auto mb-3 opacity-40 text-emerald-600" />
                      <h3 className="text-sm font-bold text-slate-700">No incoming requests yet</h3>
                      <p className="text-xs mt-1">
                        When neighbors request your shared items, they will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {receivedRequests.map((req) => (
                        <div
                          key={req._id}
                          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 transition"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-3xl">
                                {req.item?.icon || "📦"}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-extrabold text-slate-900 text-base">
                                    {req.item?.name}
                                  </h3>
                                  <span
                                    className={`rounded-full px-3 py-0.5 text-xs font-bold border ${getStatusBadge(
                                      req.status
                                    )}`}
                                  >
                                    {req.status}
                                  </span>
                                </div>

                                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                  <span>
                                    Requested by: <strong className="text-slate-800">{req.borrower?.name}</strong> ({req.borrower?.community})
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                                    <Calendar size={13} className="text-emerald-600" />
                                    {formatDate(req.startDate)} to {formatDate(req.endDate)}
                                  </span>
                                </div>

                                {req.note && (
                                  <p className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                    "{req.note}"
                                  </p>
                                )}

                                {req.rejectionReason && (
                                  <p className="mt-2 text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100">
                                    Declined reason: {req.rejectionReason}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* WORKFLOW ACTION BUTTONS */}
                            <div className="flex flex-wrap items-center gap-2 shrink-0">
                              {/* If Pending: Approve / Reject */}
                              {req.status === "Pending" && (
                                <>
                                  <button
                                    onClick={() => handleApprove(req._id)}
                                    disabled={actionLoading === req._id}
                                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-50"
                                  >
                                    <Check size={14} />
                                    Approve Request
                                  </button>
                                  <button
                                    onClick={() => handleOpenReject(req)}
                                    disabled={actionLoading === req._id}
                                    className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-100 transition disabled:opacity-50"
                                  >
                                    <X size={14} />
                                    Reject
                                  </button>
                                </>
                              )}

                              {/* If Approved: Mark Ready for Pickup */}
                              {req.status === "Approved" && (
                                <button
                                  onClick={() => handleReadyPickup(req._id)}
                                  disabled={actionLoading === req._id}
                                  className="flex items-center gap-1.5 rounded-xl bg-cyan-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-cyan-700 transition disabled:opacity-50"
                                >
                                  <MapPin size={14} />
                                  Mark Ready for Pickup
                                </button>
                              )}

                              {/* If Ready for Pickup: Confirm Handover */}
                              {req.status === "Ready for Pickup" && (
                                <button
                                  onClick={() => handleConfirmHandover(req._id)}
                                  disabled={actionLoading === req._id}
                                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                  <CheckCircle size={14} />
                                  Confirm Handover
                                </button>
                              )}

                              {/* If Return Requested: Confirm Return */}
                              {(req.status === "Return Requested" || req.status === "Borrowed") && (
                                <button
                                  onClick={() => handleConfirmReturn(req._id)}
                                  disabled={actionLoading === req._id}
                                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-50"
                                >
                                  <CheckCircle2 size={14} />
                                  Confirm Return & Complete
                                </button>
                              )}

                              {/* Chat */}
                              <button
                                onClick={() => handleOpenChat(req)}
                                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                              >
                                <MessageSquare size={14} />
                                Chat
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 3. MY BORROWING TAB (BORROWER VIEW) */}
              {activeTab === "Borrowing" && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        My Borrow Requests ({sentRequests.length})
                      </h2>
                      <p className="text-xs text-slate-500">
                        Track requests you've submitted, dates, handover status, and complete returns.
                      </p>
                    </div>
                    <button
                      onClick={() => navigate("/explore")}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      + Borrow More Items
                    </button>
                  </div>

                  {sentRequests.length === 0 ? (
                    <div className="py-16 text-center text-slate-400">
                      <Package size={42} className="mx-auto mb-3 opacity-40 text-emerald-600" />
                      <h3 className="text-sm font-bold text-slate-700">No requests sent yet</h3>
                      <p className="text-xs mt-1">
                        Explore community items and send a request to get started!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sentRequests.map((req) => (
                        <div
                          key={req._id}
                          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 transition"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                                {req.item?.icon || "📦"}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-extrabold text-slate-900 text-base">
                                    {req.item?.name}
                                  </h3>
                                  <span
                                    className={`rounded-full px-3 py-0.5 text-xs font-bold border ${getStatusBadge(
                                      req.status
                                    )}`}
                                  >
                                    {req.status}
                                  </span>
                                </div>

                                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                  <span>
                                    Owner: <strong className="text-slate-800">{req.owner?.name}</strong>
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                                    <Calendar size={13} className="text-emerald-600" />
                                    {formatDate(req.startDate)} to {formatDate(req.endDate)}
                                  </span>
                                </div>

                                {req.status === "Ready for Pickup" && (
                                  <div className="mt-2 text-xs font-semibold text-cyan-800 bg-cyan-50 p-2.5 rounded-xl border border-cyan-200">
                                    📍 Ready for pickup at {req.item?.location}. Coordinate with {req.owner?.name}.
                                  </div>
                                )}

                                {req.status === "Rejected" && req.rejectionReason && (
                                  <div className="mt-2 text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                                    Owner note: {req.rejectionReason}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* WORKFLOW ACTIONS FOR BORROWER */}
                            <div className="flex flex-wrap items-center gap-2 shrink-0">
                              {/* Cancel before handover */}
                              {(req.status === "Pending" || req.status === "Approved") && (
                                <button
                                  onClick={() => handleCancelRequest(req._id)}
                                  disabled={actionLoading === req._id}
                                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                                >
                                  Cancel Request
                                </button>
                              )}

                              {/* Confirm pickup */}
                              {req.status === "Ready for Pickup" && (
                                <button
                                  onClick={() => handleConfirmHandover(req._id)}
                                  disabled={actionLoading === req._id}
                                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                                >
                                  Confirm Pickup / Handover
                                </button>
                              )}

                              {/* Request return */}
                              {req.status === "Borrowed" && (
                                <button
                                  onClick={() => handleRequestReturn(req._id)}
                                  disabled={actionLoading === req._id}
                                  className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-purple-700 transition"
                                >
                                  Initiate Return
                                </button>
                              )}

                              {/* Leave review when returned */}
                              {req.status === "Returned" && (
                                <button
                                  onClick={() => handleOpenReview(req)}
                                  className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-600 transition"
                                >
                                  <Star size={13} fill="currentColor" />
                                  Leave Review
                                </button>
                              )}

                              {/* Chat */}
                              <button
                                onClick={() => handleOpenChat(req)}
                                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                              >
                                <MessageSquare size={14} />
                                Chat
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 4. SHARED RESOURCES TAB */}
              {activeTab === "Shared" && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        My Listed Resources ({myItems.length})
                      </h2>
                      <p className="text-xs text-slate-500">
                        Items you've added for your community to borrow. Toggle availability or remove listings.
                      </p>
                    </div>
                    <button
                      onClick={() => navigate("/share-item")}
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                    >
                      <Plus size={15} />
                      Share New Item
                    </button>
                  </div>

                  {myItems.length === 0 ? (
                    <div className="py-16 text-center text-slate-400">
                      <Share2 size={42} className="mx-auto mb-3 opacity-40 text-emerald-600" />
                      <h3 className="text-sm font-bold text-slate-700">No items shared yet</h3>
                      <p className="text-xs mt-1">
                        Start lending your tools, books, and gadgets to build neighborly trust!
                      </p>
                      <button
                        onClick={() => navigate("/share-item")}
                        className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white"
                      >
                        Share an Item Now
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {myItems.map((item) => (
                        <div
                          key={item._id}
                          className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                        >
                          <div>
                            <div className="relative h-40 w-full overflow-hidden rounded-xl bg-slate-100 mb-3">
                              {item.imageUrl ? (
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-4xl">
                                  {item.icon || "📦"}
                                </div>
                              )}
                              <span
                                className={`absolute bottom-2 left-2 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                  item.available
                                    ? "bg-emerald-600 text-white"
                                    : "bg-slate-800 text-slate-300"
                                }`}
                              >
                                {item.available ? "Available" : "Unavailable"}
                              </span>
                            </div>

                            <h4 className="font-bold text-slate-900 text-sm truncate">
                              {item.name}
                            </h4>
                            <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                              {item.description}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <button
                              onClick={() => handleToggleItemAvailability(item._id, item.available)}
                              className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                            >
                              {item.available ? "Mark Unavailable" : "Mark Available"}
                            </button>

                            <button
                              onClick={() => handleDeleteItem(item._id)}
                              className="text-xs text-slate-400 hover:text-red-600 transition p-1"
                              title="Delete Item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 5. NOTIFICATIONS TAB */}
              {activeTab === "Notifications" && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        Notifications Center ({notifications.length})
                      </h2>
                      <p className="text-xs text-slate-500">
                        Persistent notifications stored securely in MongoDB
                      </p>
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        Mark All as Read
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <div className="py-16 text-center text-slate-400">
                      <Bell size={42} className="mx-auto mb-3 opacity-40 text-emerald-600" />
                      <p className="text-xs">No notifications to display.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {notifications.map((notif) => (
                        <div
                          key={notif._id}
                          onClick={() => markAsRead(notif._id)}
                          className={`flex items-start justify-between gap-4 p-4 hover:bg-slate-50 cursor-pointer transition rounded-xl ${
                            !notif.read ? "bg-emerald-50/30" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold text-sm">
                              {notif.type.includes("approved")
                                ? "✓"
                                : notif.type.includes("rejected")
                                ? "✕"
                                : "🔔"}
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-slate-900">
                                {notif.title}
                              </h4>
                              <p className="text-xs text-slate-600 mt-0.5">
                                {notif.message}
                              </p>
                              <span className="text-[10px] text-slate-400 mt-1 inline-block">
                                {formatDate(notif.createdAt)}
                              </span>
                            </div>
                          </div>

                          {!notif.read && (
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0 mt-1" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 6. SAVED ITEMS TAB */}
              {activeTab === "Saved" && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-900">
                      Saved & Favorite Resources ({savedItems.length})
                    </h2>
                    <p className="text-xs text-slate-500">
                      Items you've bookmarked for future borrowing
                    </p>
                  </div>

                  {savedItems.length === 0 ? (
                    <div className="py-16 text-center text-slate-400">
                      <Heart size={42} className="mx-auto mb-3 opacity-40 text-red-400" />
                      <p className="text-xs">No saved items yet.</p>
                      <button
                        onClick={() => navigate("/explore")}
                        className="mt-3 text-xs font-bold text-emerald-600 hover:underline"
                      >
                        Explore resources and click the heart icon to save!
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {savedItems.map((item) => (
                        <div
                          key={item._id}
                          onClick={() => navigate(`/item/${item._id}`)}
                          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md cursor-pointer transition"
                        >
                          <div className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-100 mb-3">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-4xl">
                                {item.icon}
                              </div>
                            )}
                          </div>
                          <h4 className="font-bold text-sm text-slate-900 truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* REJECT MODAL */}
      {rejectModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">
              Decline Borrow Request
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              You are declining {rejectModalReq.borrower?.name}'s request for{" "}
              {rejectModalReq.item?.name}.
            </p>

            <div className="mt-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Reason (Optional)
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. In use this weekend, maintenance in progress..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs outline-none focus:border-red-500"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setRejectModalReq(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-red-700"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {reviewModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">
              Leave a Review for {reviewModalReq.item?.name}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              How was your experience borrowing from {reviewModalReq.owner?.name}?
            </p>

            <div className="mt-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setReviewRating(s)}
                    className={`p-2.5 rounded-xl border ${
                      reviewRating >= s
                        ? "bg-amber-100 border-amber-300 text-amber-600"
                        : "bg-white border-slate-200 text-slate-400"
                    }`}
                  >
                    <Star size={20} fill={reviewRating >= s ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Your Comments *
              </label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Item worked great, owner was friendly..."
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs outline-none focus:border-emerald-500"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setReviewModalReq(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReview}
                disabled={!reviewComment.trim()}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHAT / INTERNAL COORDINATION MODAL */}
      {chatModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl flex flex-col h-[520px] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-4 bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Coordination: {chatModalReq.item?.name}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Between {chatModalReq.borrower?.name} and {chatModalReq.owner?.name}
                </p>
              </div>
              <button
                onClick={() => setChatModalReq(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingChat ? (
                <div className="py-12 text-center text-slate-400">
                  <Loader2 className="animate-spin mx-auto text-emerald-600" size={24} />
                </div>
              ) : chatMessages.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No messages yet. Send a message to coordinate pickup timing or handover!
                </div>
              ) : (
                chatMessages.map((m) => {
                  const isMe = user && m.sender === user.id;
                  return (
                    <div
                      key={m._id}
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      <span className="text-[10px] text-slate-400 mb-1 px-1">
                        {m.senderName}
                      </span>
                      <div
                        className={`rounded-2xl px-4 py-2.5 max-w-xs text-xs ${
                          isMe
                            ? "bg-emerald-600 text-white rounded-br-none"
                            : "bg-slate-100 text-slate-800 rounded-bl-none"
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Send input */}
            <form onSubmit={handleSendMessage} className="border-t border-slate-100 p-3 bg-white flex gap-2">
              <input
                type="text"
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs outline-none focus:border-emerald-500 focus:bg-white"
              />
              <button
                type="submit"
                disabled={!newMessageText.trim()}
                className="flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-white hover:bg-emerald-700 disabled:opacity-50 transition"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;