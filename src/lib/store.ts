export interface ResourceItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  imageUrl?: string;
  owner: string;
  ownerEmail?: string;
  location: string;
  rating: number;
  reviewsCount: number;
  available: boolean;
  description: string;
  bg: string;
  deposit?: string;
  condition?: string;
  createdAt: string;
}

export interface BorrowRequest {
  id: string;
  itemId: string;
  itemName: string;
  itemIcon: string;
  owner: string;
  ownerEmail?: string;
  borrower: string;
  borrowerEmail: string;
  location: string;
  startDate: string;
  endDate: string;
  status: "Pending" | "Approved" | "Declined" | "Completed";
  createdAt: string;
  note?: string;
}

export interface Review {
  id: string;
  itemId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface UserProfile {
  name: string;
  email: string;
  community: string;
  avatar?: string;
  isLoggedIn: boolean;
}

export const INITIAL_ITEMS: ResourceItem[] = [
  {
    id: "1",
    name: "Cordless Drill Set",
    category: "Tools",
    icon: "🔧",
    imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80",
    owner: "Rahul Patel",
    ownerEmail: "rahul@example.com",
    location: "Sunrise Heights",
    rating: 4.9,
    reviewsCount: 18,
    available: true,
    description: "Powerful 20V cordless drill with 30-piece drill bits, 2 lithium batteries, and hard carrying case. Ideal for home repair & DIY projects.",
    bg: "bg-emerald-50 text-emerald-600",
    deposit: "Free sharing",
    condition: "Like New",
    createdAt: "2026-01-15",
  },
  {
    id: "2",
    name: "Full HD 1080p Projector",
    category: "Electronics",
    icon: "📽️",
    imageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80",
    owner: "Priya Shah",
    ownerEmail: "priya@example.com",
    location: "Sunrise Heights",
    rating: 4.8,
    reviewsCount: 12,
    available: true,
    description: "High brightness 4K supported projector with HDMI & screen cast. Perfect for movie nights, FIFA gaming sessions, and presentations.",
    bg: "bg-blue-50 text-blue-600",
    deposit: "₹100/day optional deposit",
    condition: "Excellent",
    createdAt: "2026-02-01",
  },
  {
    id: "3",
    name: "Yonex Badminton Racket Set",
    category: "Sports",
    icon: "🏸",
    imageUrl: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80",
    owner: "Amit Mehta",
    ownerEmail: "amit@example.com",
    location: "Green Valley Society",
    rating: 4.7,
    reviewsCount: 9,
    available: true,
    description: "Includes 4 lightweight graphite badminton rackets, portable net stand, and 6 nylon shuttlecocks with carrying bag.",
    bg: "bg-amber-50 text-amber-600",
    deposit: "Free sharing",
    condition: "Good",
    createdAt: "2026-02-10",
  },
  {
    id: "4",
    name: "The Psychology of Money",
    category: "Books",
    icon: "📚",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    owner: "Neha Shah",
    ownerEmail: "neha@example.com",
    location: "Sunrise Heights",
    rating: 5.0,
    reviewsCount: 21,
    available: true,
    description: "Hardcover edition of Morgan Housel's bestselling book on money, greed, and happiness. Great read for financial wisdom.",
    bg: "bg-purple-50 text-purple-600",
    deposit: "Free sharing",
    condition: "Mint Condition",
    createdAt: "2026-01-20",
  },
  {
    id: "5",
    name: "JBL Party Bluetooth Speaker",
    category: "Electronics",
    icon: "🔊",
    imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80",
    owner: "Karan Joshi",
    ownerEmail: "karan@example.com",
    location: "Lakeview Residency",
    rating: 4.6,
    reviewsCount: 15,
    available: true,
    description: "Deep bass 100W party speaker with RGB LED sync lights and 12-hour battery backup. Waterproof design for rooftop parties.",
    bg: "bg-pink-50 text-pink-600",
    deposit: "₹200/day",
    condition: "Excellent",
    createdAt: "2026-02-14",
  },
  {
    id: "6",
    name: "Heavy-Duty Folding Event Table",
    category: "Party Supplies",
    icon: "🪑",
    imageUrl: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=600&q=80",
    owner: "Riya Patel",
    ownerEmail: "riya@example.com",
    location: "Green Valley Society",
    rating: 4.8,
    reviewsCount: 7,
    available: true,
    description: "6ft heavy duty folding table with handle. Seats up to 8 people. Folds in half for easy car trunk transport.",
    bg: "bg-yellow-50 text-yellow-600",
    deposit: "Free sharing",
    condition: "Good",
    createdAt: "2026-02-18",
  },
  {
    id: "7",
    name: "Robot Vacuum Cleaner",
    category: "Home",
    icon: "🧹",
    imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80",
    owner: "Arjun Mehta",
    ownerEmail: "arjun@example.com",
    location: "Sunrise Heights",
    rating: 4.7,
    reviewsCount: 11,
    available: true,
    description: "Smart LiDAR mapping robot vacuum with mop attachment. Excellent for deep carpet cleaning and tile sweeping.",
    bg: "bg-cyan-50 text-cyan-600",
    deposit: "Free sharing",
    condition: "Like New",
    createdAt: "2026-02-22",
  },
  {
    id: "8",
    name: "12ft Aluminum Telescopic Ladder",
    category: "Tools",
    icon: "🪜",
    imageUrl: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80",
    owner: "Sneha Patel",
    ownerEmail: "sneha@example.com",
    location: "Lakeview Residency",
    rating: 4.9,
    reviewsCount: 14,
    available: true,
    description: "Lightweight extendable aluminum ladder supporting up to 150kg. Retracts down to 3ft for compact storage.",
    bg: "bg-emerald-50 text-emerald-600",
    deposit: "Free sharing",
    condition: "Good",
    createdAt: "2026-03-01",
  },
];

export const INITIAL_REVIEWS: Record<string, Review[]> = {
  "1": [
    {
      id: "r1",
      itemId: "1",
      userName: "Siddharth Bhatti",
      rating: 5,
      comment: "Super smooth drill, made installing my TV mount so quick! Rahul was very friendly.",
      date: "2026-03-02",
    },
    {
      id: "r2",
      itemId: "1",
      userName: "Karan J.",
      rating: 5,
      comment: "Battery lasted the entire weekend project. Highly recommended.",
      date: "2026-02-25",
    },
  ],
  "2": [
    {
      id: "r3",
      itemId: "2",
      userName: "Neha S.",
      rating: 5,
      comment: "Used it for IPL screening in our society garden. Great picture quality!",
      date: "2026-03-05",
    },
  ],
};

// STORAGE KEYS
const STORAGE_KEYS = {
  ITEMS: "sharenest_all_items",
  REQUESTS: "sharenest_borrow_requests",
  FAVORITES: "sharenest_favorites",
  REVIEWS: "sharenest_reviews",
  USER: "shareNestUser",
  COMMUNITY: "sharenest_community",
};

// Helper GET & SAVE
export function getAllItems(): ResourceItem[] {
  try {
    const customItems: ResourceItem[] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.ITEMS) || "[]"
    );
    const merged = [...customItems];
    INITIAL_ITEMS.forEach((initItem) => {
      if (!merged.some((i) => i.id === initItem.id)) {
        merged.push(initItem);
      }
    });
    return merged;
  } catch (e) {
    return INITIAL_ITEMS;
  }
}

export function getItemById(id: string): ResourceItem | undefined {
  const items = getAllItems();
  return items.find((item) => String(item.id) === String(id));
}

export function saveNewItem(itemData: Omit<ResourceItem, "id" | "createdAt" | "rating" | "reviewsCount">): ResourceItem {
  const currentItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || "[]");
  const newItem: ResourceItem = {
    ...itemData,
    id: Date.now().toString(),
    rating: 5.0,
    reviewsCount: 1,
    createdAt: new Date().toISOString().split("T")[0],
  };

  const updated = [newItem, ...currentItems];
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(updated));
  return newItem;
}

export function deleteItem(id: string): void {
  const currentItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || "[]");
  const filtered = currentItems.filter((item: ResourceItem) => String(item.id) !== String(id));
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(filtered));
}

export function updateItemAvailability(id: string, available: boolean): void {
  const currentItems = getAllItems();
  const updated = currentItems.map((item) => {
    if (String(item.id) === String(id)) {
      return { ...item, available };
    }
    return item;
  });
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(updated));
}

// BORROW REQUESTS
export function getAllRequests(): BorrowRequest[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || "[]");
  } catch (e) {
    return [];
  }
}

export function createBorrowRequest(requestData: Omit<BorrowRequest, "id" | "createdAt" | "status">): BorrowRequest {
  const current = getAllRequests();
  const newReq: BorrowRequest = {
    ...requestData,
    id: "req_" + Date.now(),
    status: "Pending",
    createdAt: new Date().toISOString().split("T")[0],
  };
  const updated = [newReq, ...current];
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(updated));
  sessionStorage.setItem("sharenestBorrowRequest", JSON.stringify(newReq));
  return newReq;
}

export function updateRequestStatus(requestId: string, status: BorrowRequest["status"]): BorrowRequest[] {
  const requests = getAllRequests();
  const updated = requests.map((req) => {
    if (req.id === requestId) {
      const newReq = { ...req, status };
      if (status === "Approved") {
        updateItemAvailability(req.itemId, false);
      } else if (status === "Completed" || status === "Declined") {
        updateItemAvailability(req.itemId, true);
      }
      return newReq;
    }
    return req;
  });
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(updated));

  const sess = sessionStorage.getItem("sharenestBorrowRequest");
  if (sess) {
    const sObj = JSON.parse(sess);
    if (sObj.id === requestId) {
      sessionStorage.setItem("sharenestBorrowRequest", JSON.stringify({ ...sObj, status }));
    }
  }

  return updated;
}

// FAVORITES
export function getFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || "[]");
  } catch (e) {
    return [];
  }
}

export function toggleFavorite(itemId: string): string[] {
  const favs = getFavorites();
  const strId = String(itemId);
  let updated: string[];
  if (favs.includes(strId)) {
    updated = favs.filter((id) => id !== strId);
  } else {
    updated = [...favs, strId];
  }
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
  return updated;
}

// REVIEWS
export function getReviews(itemId: string): Review[] {
  try {
    const allRev: Record<string, Review[]> = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.REVIEWS) || JSON.stringify(INITIAL_REVIEWS)
    );
    return allRev[String(itemId)] || [];
  } catch (e) {
    return INITIAL_REVIEWS[String(itemId)] || [];
  }
}

export function addReview(itemId: string, userName: string, rating: number, comment: string): Review {
  const allRev: Record<string, Review[]> = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.REVIEWS) || JSON.stringify(INITIAL_REVIEWS)
  );
  const newRev: Review = {
    id: "rev_" + Date.now(),
    itemId: String(itemId),
    userName,
    rating,
    comment,
    date: new Date().toISOString().split("T")[0],
  };

  const itemReviews = allRev[String(itemId)] || [];
  allRev[String(itemId)] = [newRev, ...itemReviews];
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(allRev));

  const items = getAllItems();
  const target = items.find((i) => String(i.id) === String(itemId));
  if (target) {
    const updatedCount = target.reviewsCount + 1;
    const updatedRating = Number(
      ((target.rating * target.reviewsCount + rating) / updatedCount).toFixed(1)
    );
    const updatedItems = items.map((i) => {
      if (String(i.id) === String(itemId)) {
        return { ...i, rating: updatedRating, reviewsCount: updatedCount };
      }
      return i;
    });
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(updatedItems));
  }

  return newRev;
}

// USER SESSION
export function getCurrentUser(): UserProfile {
  try {
    const u = localStorage.getItem(STORAGE_KEYS.USER);
    if (u) {
      const parsed = JSON.parse(u);
      return {
        name: parsed.name || parsed.email?.split("@")[0] || "Siddharth Bhatti",
        email: parsed.email || "siddharth@example.com",
        community: localStorage.getItem(STORAGE_KEYS.COMMUNITY) || "Sunrise Heights",
        isLoggedIn: parsed.loggedIn !== false,
      };
    }
  } catch (e) {}

  return {
    name: "Siddharth Bhatti",
    email: "siddharth@example.com",
    community: localStorage.getItem(STORAGE_KEYS.COMMUNITY) || "Sunrise Heights",
    isLoggedIn: true,
  };
}

export function setCurrentUser(user: Partial<UserProfile>): UserProfile {
  const current = getCurrentUser();
  const updated = { ...current, ...user };
  localStorage.setItem(
    STORAGE_KEYS.USER,
    JSON.stringify({
      email: updated.email,
      name: updated.name,
      loggedIn: updated.isLoggedIn,
    })
  );
  if (updated.community) {
    localStorage.setItem(STORAGE_KEYS.COMMUNITY, updated.community);
  }
  return updated;
}
