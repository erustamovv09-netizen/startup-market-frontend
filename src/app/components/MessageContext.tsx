"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MessageContextValue {
  unreadCount: number;
  markAllRead: () => void;
  refresh: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const MessageContext = createContext<MessageContextValue>({
  unreadCount: 0,
  markAllRead: () => {},
  refresh: () => {},
});

export function useMessages() {
  return useContext(MessageContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function MessageProvider({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();

  const fetchUnread = useCallback(async () => {
    // Only run client-side and only when user might be logged in
    const token =
      typeof window !== "undefined" ? localStorage.getItem("access") : null;
    if (!token) {
      setUnreadCount(0);
      return;
    }

    try {
      // Try the dedicated unread endpoint first; fall back to counting from /api/messages/
      const res = await fetch(`${API_BASE_URL}/api/messages/unread/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        // Backend may return { has_unread, unread_count } or just a number
        const count =
          typeof data === "number"
            ? data
            : data?.unread_count ?? (data?.has_unread ? 1 : 0);
        setUnreadCount(count);
        return;
      }

      // Fallback: count unread from full messages list
      if (res.status === 404) {
        const fallback = await fetch(`${API_BASE_URL}/api/messages/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (fallback.ok) {
          const profileRes = await fetch(`${API_BASE_URL}/api/profile/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const profile = profileRes.ok ? await profileRes.json() : null;
          const msgs = await fallback.json();
          const unread = Array.isArray(msgs)
            ? msgs.filter(
                (m: { is_read?: boolean; receiver: number }) =>
                  !m.is_read && m.receiver === profile?.id
              ).length
            : 0;
          setUnreadCount(unread);
        }
      }
    } catch {
      // Silent — don't crash the app if messages endpoint is unavailable
    }
  }, []);

  // Initial fetch + poll every 60 s
  useEffect(() => {
    fetchUnread();
    const timer = setInterval(fetchUnread, 60_000);
    return () => clearInterval(timer);
  }, [fetchUnread]);

  // Re-fetch on route change (e.g. user navigates away from chat)
  useEffect(() => {
    fetchUnread();
  }, [pathname, fetchUnread]);

  const markAllRead = useCallback(() => setUnreadCount(0), []);
  const refresh = useCallback(() => fetchUnread(), [fetchUnread]);

  return (
    <MessageContext.Provider value={{ unreadCount, markAllRead, refresh }}>
      {children}
    </MessageContext.Provider>
  );
}
