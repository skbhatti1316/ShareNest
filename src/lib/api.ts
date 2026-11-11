/**
 * ShareNest Typed API Client
 * Interacts with Node/Express REST backend on /api
 */

const API_BASE = "/api";

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  community: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  role: "user" | "admin";
}

export interface ApiItem {
  _id: string;
  id?: string;
  name: string;
  category: string;
  icon: string;
  imageUrl?: string;
  owner: string | ApiUser;
  ownerName: string;
  ownerEmail: string;
  location: string;
  community: string;
  rating: number;
  reviewsCount: number;
  available: boolean;
  description: string;
  condition: string;
  deposit: string;
  bg?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiBorrowRequest {
  _id: string;
  id?: string;
  item: ApiItem;
  borrower: ApiUser;
  owner: ApiUser;
  startDate: string;
  endDate: string;
  note?: string;
  status:
    | "Pending"
    | "Approved"
    | "Rejected"
    | "Cancelled"
    | "Ready for Pickup"
    | "Borrowed"
    | "Return Requested"
    | "Returned"
    | "Overdue";
  rejectionReason?: string;
  approvedAt?: string;
  rejectedAt?: string;
  readyAt?: string;
  handoverAt?: string;
  returnRequestedAt?: string;
  returnedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiNotification {
  _id: string;
  recipient: string;
  sender?: ApiUser;
  type: string;
  title: string;
  message: string;
  requestId?: ApiBorrowRequest | string;
  itemId?: ApiItem | string;
  read: boolean;
  createdAt: string;
}

export interface ApiReview {
  _id: string;
  item: string;
  user: ApiUser | string;
  userName: string;
  rating: number;
  comment: string;
  requestId?: string;
  createdAt: string;
}

export interface ApiCommunity {
  _id: string;
  name: string;
  description: string;
  location: string;
  memberCount: number;
  itemsCount?: number;
  membersCount?: number;
}

export interface ApiMessage {
  _id: string;
  requestId: string;
  sender: string;
  senderName: string;
  text: string;
  createdAt: string;
}

// Helper to make API requests with credentials and token
async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("sharenest_token");
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const data = await res.json().catch(() => ({
    success: false,
    message: `Network response error (${res.status} ${res.statusText})`,
  }));

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data as T;
}

export const api = {
  // AUTH
  auth: {
    login: async (email: string, password: string) => {
      const data = await request<{ success: boolean; token: string; user: ApiUser }>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        }
      );
      if (data.token) {
        localStorage.setItem("sharenest_token", data.token);
      }
      return data;
    },

    register: async (payload: {
      name: string;
      email: string;
      password: string;
      community?: string;
      phone?: string;
      bio?: string;
    }) => {
      const data = await request<{ success: boolean; token: string; user: ApiUser }>(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );
      if (data.token) {
        localStorage.setItem("sharenest_token", data.token);
      }
      return data;
    },

    logout: async () => {
      localStorage.removeItem("sharenest_token");
      return request("/auth/logout", { method: "POST" });
    },

    getMe: async (): Promise<{ success: boolean; user: ApiUser }> => {
      return request<{ success: boolean; user: ApiUser }>("/auth/me");
    },

    updateProfile: async (payload: Partial<ApiUser>) => {
      return request<{ success: boolean; user: ApiUser }>("/auth/profile", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    },
  },

  // ITEMS
  items: {
    getAll: async (params?: {
      search?: string;
      category?: string;
      community?: string;
      available?: boolean;
      sort?: string;
      owner?: string;
    }): Promise<{ success: boolean; count: number; items: ApiItem[] }> => {
      const query = new URLSearchParams();
      if (params?.search) query.set("search", params.search);
      if (params?.category) query.set("category", params.category);
      if (params?.community) query.set("community", params.community);
      if (params?.available) query.set("available", "true");
      if (params?.sort) query.set("sort", params.sort);
      if (params?.owner) query.set("owner", params.owner);

      const qs = query.toString() ? `?${query.toString()}` : "";
      return request(`/items${qs}`);
    },

    getById: async (id: string): Promise<{ success: boolean; item: ApiItem }> => {
      return request(`/items/${id}`);
    },

    create: async (payload: {
      name: string;
      category: string;
      icon?: string;
      imageUrl?: string;
      location?: string;
      community?: string;
      description: string;
      condition?: string;
      deposit?: string;
    }): Promise<{ success: boolean; item: ApiItem; message: string }> => {
      return request("/items", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },

    update: async (
      id: string,
      payload: Partial<ApiItem>
    ): Promise<{ success: boolean; item: ApiItem; message: string }> => {
      return request(`/items/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    },

    delete: async (id: string): Promise<{ success: boolean; message: string }> => {
      return request(`/items/${id}`, {
        method: "DELETE",
      });
    },

    toggleAvailability: async (
      id: string,
      available?: boolean
    ): Promise<{ success: boolean; available: boolean; message: string }> => {
      return request(`/items/${id}/availability`, {
        method: "PATCH",
        body: JSON.stringify({ available }),
      });
    },

    uploadImage: async (file: File): Promise<{ success: boolean; imageUrl: string }> => {
      const formData = new FormData();
      formData.append("image", file);
      return request("/items/upload-image", {
        method: "POST",
        body: formData,
      });
    },
  },

  // BORROW REQUESTS
  requests: {
    create: async (payload: {
      itemId: string;
      startDate: string;
      endDate: string;
      note?: string;
    }): Promise<{ success: boolean; message: string; request: ApiBorrowRequest }> => {
      return request("/requests", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },

    getSent: async (): Promise<{
      success: boolean;
      count: number;
      requests: ApiBorrowRequest[];
    }> => {
      return request("/requests/sent");
    },

    getReceived: async (): Promise<{
      success: boolean;
      count: number;
      requests: ApiBorrowRequest[];
    }> => {
      return request("/requests/received");
    },

    getById: async (id: string): Promise<{ success: boolean; request: ApiBorrowRequest }> => {
      return request(`/requests/${id}`);
    },

    approve: async (id: string): Promise<{ success: boolean; message: string; request: ApiBorrowRequest }> => {
      return request(`/requests/${id}/approve`, { method: "PATCH" });
    },

    reject: async (
      id: string,
      reason?: string
    ): Promise<{ success: boolean; message: string; request: ApiBorrowRequest }> => {
      return request(`/requests/${id}/reject`, {
        method: "PATCH",
        body: JSON.stringify({ reason }),
      });
    },

    cancel: async (id: string): Promise<{ success: boolean; message: string; request: ApiBorrowRequest }> => {
      return request(`/requests/${id}/cancel`, { method: "PATCH" });
    },

    markReadyForPickup: async (
      id: string
    ): Promise<{ success: boolean; message: string; request: ApiBorrowRequest }> => {
      return request(`/requests/${id}/ready-pickup`, { method: "PATCH" });
    },

    confirmHandover: async (
      id: string
    ): Promise<{ success: boolean; message: string; request: ApiBorrowRequest }> => {
      return request(`/requests/${id}/handover`, { method: "PATCH" });
    },

    requestReturn: async (
      id: string
    ): Promise<{ success: boolean; message: string; request: ApiBorrowRequest }> => {
      return request(`/requests/${id}/return-request`, { method: "PATCH" });
    },

    confirmReturn: async (
      id: string
    ): Promise<{ success: boolean; message: string; request: ApiBorrowRequest }> => {
      return request(`/requests/${id}/confirm-return`, { method: "PATCH" });
    },

    getMessages: async (requestId: string): Promise<{ success: boolean; messages: ApiMessage[] }> => {
      return request(`/requests/${requestId}/messages`);
    },

    sendMessage: async (
      requestId: string,
      text: string
    ): Promise<{ success: boolean; message: ApiMessage }> => {
      return request(`/requests/${requestId}/messages`, {
        method: "POST",
        body: JSON.stringify({ text }),
      });
    },
  },

  // NOTIFICATIONS
  notifications: {
    getAll: async (): Promise<{
      success: boolean;
      unreadCount: number;
      notifications: ApiNotification[];
    }> => {
      return request("/notifications");
    },

    markAsRead: async (
      id: string
    ): Promise<{ success: boolean; unreadCount: number; notification: ApiNotification }> => {
      return request(`/notifications/${id}/read`, { method: "PATCH" });
    },

    markAllAsRead: async (): Promise<{ success: boolean; unreadCount: number; message: string }> => {
      return request("/notifications/read-all", { method: "PATCH" });
    },
  },

  // COMMUNITIES
  communities: {
    getAll: async (): Promise<{ success: boolean; communities: ApiCommunity[] }> => {
      return request("/communities");
    },

    create: async (payload: {
      name: string;
      description?: string;
      location: string;
    }): Promise<{ success: boolean; message: string; community: ApiCommunity }> => {
      return request("/communities", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },

    join: async (communityName: string): Promise<{ success: boolean; message: string; user: ApiUser }> => {
      return request("/communities/join", {
        method: "POST",
        body: JSON.stringify({ communityName }),
      });
    },
  },

  // REVIEWS
  reviews: {
    add: async (payload: {
      itemId: string;
      rating: number;
      comment: string;
      requestId?: string;
    }): Promise<{ success: boolean; message: string; review: ApiReview; itemRating: number; itemReviewsCount: number }> => {
      return request("/reviews", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },

    getByItem: async (itemId: string): Promise<{ success: boolean; count: number; reviews: ApiReview[] }> => {
      return request(`/reviews/item/${itemId}`);
    },
  },
};
