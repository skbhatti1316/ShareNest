import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { api, type ApiNotification } from "../lib/api";

interface ToastAlert {
  id: string;
  title: string;
  message: string;
  type?: string;
}

interface SocketContextType {
  socket: Socket | null;
  notifications: ApiNotification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  activeToast: ToastAlert | null;
  dismissToast: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [activeToast, setActiveToast] = useState<ToastAlert | null>(null);

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  const triggerToast = (title: string, message: string, type = "info") => {
    const alert: ToastAlert = { id: Date.now().toString(), title, message, type };
    setActiveToast(alert);
    setTimeout(() => {
      setActiveToast((curr) => (curr?.id === alert.id ? null : curr));
    }, 5000);
  };

  const refreshNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.notifications.getAll();
      if (res.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch {
      // Ignore network errors on background refresh
    }
  }, [isAuthenticated]);

  // Connect Socket.IO when user is authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    refreshNotifications();

    const newSocket = io("/", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("[Socket.IO] Connected with id:", newSocket.id);
      newSocket.emit("join_user_room", user.id);
    });

    // Handle incoming notifications
    newSocket.on("notification", (notif: ApiNotification) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((count) => count + 1);
      triggerToast(notif.title, notif.message, "notification");
    });

    newSocket.on("new_borrow_request", (data: any) => {
      triggerToast(
        "New Borrow Request! 🔔",
        data?.notification?.message || "Someone requested to borrow your item.",
        "request"
      );
      refreshNotifications();
    });

    newSocket.on("request_status_changed", (data: any) => {
      triggerToast(
        `Request ${data?.status || "Updated"}!`,
        `Your borrow request status changed to '${data?.status}'.`,
        "status"
      );
      refreshNotifications();
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, user?.id]);

  const markAsRead = async (id: string) => {
    try {
      const res = await api.notifications.markAsRead(id);
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        );
        setUnreadCount(res.unreadCount);
      }
    } catch (e) {
      console.error("Failed to mark notification read:", e);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await api.notifications.markAllAsRead();
      if (res.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (e) {
      console.error("Failed to mark all notifications read:", e);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        refreshNotifications,
        activeToast,
        dismissToast,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket(): SocketContextType {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
