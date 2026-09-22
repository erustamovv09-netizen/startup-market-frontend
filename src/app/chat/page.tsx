"use client";
import { API_BASE_URL } from "@/lib/api";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMessages } from "@/app/components/MessageContext";

interface Owner {
  id: number;
  username: string;
  email: string;
  isOnline?: boolean;
}

interface Message {
  id: number;
  sender: number;
  sender_info: Owner;
  receiver: number;
  receiver_info: Owner;
  startup: number | null;
  content: string;
  created_at: string;
  reply_to?: number | null;
  reply_to_content?: string | null;
  reply_to_sender?: string | null;
}

interface ContextMenu {
  msgId: number;
  x: number;
  y: number;
}

function getInitials(name: string) {
  return name
    .split(/[\s._@]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function Avatar({ name, isMe }: { name: string; isMe: boolean }) {
  return (
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-sm ${
        isMe
          ? "bg-indigo-500"
          : "bg-gradient-to-br from-violet-500 to-fuchsia-500"
      }`}
    >
      {getInitials(name)}
    </div>
  );
}

// ─── Reply Icon SVG ───────────────────────────────────────────────────────────
function ReplyIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className ?? "h-3.5 w-3.5"}
    >
      <path
        fillRule="evenodd"
        d="M7.793 2.232a.75.75 0 0 1-.025 1.06L3.622 7.25h10.003a5.375 5.375 0 0 1 0 10.75H10.75a.75.75 0 0 1 0-1.5h2.875a3.875 3.875 0 0 0 0-7.75H3.622l4.146 3.957a.75.75 0 0 1-1.036 1.085l-5.5-5.25a.75.75 0 0 1 0-1.085l5.5-5.25a.75.75 0 0 1 1.061.025Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// ─── Copy Icon SVG ─────────────────────────────────────────────────────────────
function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className ?? "h-3.5 w-3.5"}
    >
      <path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3.879a1.5 1.5 0 0 1 1.06.44l3.122 3.12A1.5 1.5 0 0 1 17 6.622V12.5a1.5 1.5 0 0 1-1.5 1.5h-1v-3.379a3 3 0 0 0-.879-2.121L10.5 5.379A3 3 0 0 0 8.379 4.5H7v-1Z" />
      <path d="M4.5 6A1.5 1.5 0 0 0 3 7.5v9A1.5 1.5 0 0 0 4.5 18h7a1.5 1.5 0 0 0 1.5-1.5v-5.879a1.5 1.5 0 0 0-.44-1.06L9.44 6.439A1.5 1.5 0 0 0 8.378 6H4.5Z" />
    </svg>
  );
}

// ─── Context Menu ─────────────────────────────────────────────────────────────
function MessageContextMenu({
  menu,
  onReply,
  onCopy,
  onClose,
}: {
  menu: ContextMenu;
  onReply: () => void;
  onCopy: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{ top: menu.y, left: menu.x }}
      className="fixed z-[300] min-w-[160px] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-800"
    >
      <button
        onClick={() => { onReply(); onClose(); }}
        className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-700"
      >
        <ReplyIcon className="h-4 w-4 text-indigo-500" />
        Javob berish
      </button>
      <div className="mx-3 border-t border-zinc-100 dark:border-zinc-700" />
      <button
        onClick={() => { onCopy(); onClose(); }}
        className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-700"
      >
        <CopyIcon className="h-4 w-4 text-zinc-500" />
        Nusxa olish
      </button>
    </div>
  );
}

// ─── Main Chat Component ──────────────────────────────────────────────────────
function ChatClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const receiverId = searchParams.get("receiver_id");
  const startupId = searchParams.get("startup_id");
  const { markAllRead, refresh } = useMessages();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendError, setSendError] = useState("");
  const [myUserId, setMyUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [contextMsg, setContextMsg] = useState<Message | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (replyTo) inputRef.current?.focus();
  }, [replyTo]);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) { router.replace("/login"); return; }

    // ── Instantly clear Navbar badge when user opens chat ──
    markAllRead();

    async function fetchData() {
      try {
        const profileRes = await fetch(`${API_BASE_URL}/api/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (profileRes.status === 401) { router.replace("/login"); return; }
        let profileData = null;
        if (profileRes.ok) {
          profileData = await profileRes.json();
          setMyUserId(profileData.id);
        } else {
          setError("Profilni yuklab bo'lmadi."); return;
        }

        const msgRes = await fetch(`${API_BASE_URL}/api/messages/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (msgRes.ok) {
          const allMsgs: Message[] = await msgRes.json();
          if (receiverId) {
            const filtered = allMsgs.filter(m =>
              (m.sender.toString() === receiverId && m.receiver === profileData?.id) ||
              (m.receiver.toString() === receiverId && m.sender === profileData?.id)
            );
            setMessages(filtered);
          } else {
            setMessages(allMsgs);
          }

          // Try to mark messages as read on the backend (best-effort)
          const readToken = localStorage.getItem("access");
          if (readToken) {
            fetch(`${API_BASE_URL}/api/messages/mark-read/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${readToken}`,
              },
              body: JSON.stringify({ sender_id: receiverId }),
            }).catch(() => {}); // silent — endpoint may not exist yet

            // Refresh global unread count after a short delay
            setTimeout(() => refresh(), 500);
          }
        }
      } catch {
        setError("Serverga ulanib bo'lmadi.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [router, receiverId, markAllRead, refresh]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !receiverId) return;
    const token = localStorage.getItem("access");
    if (!token) return;
    setSendError("");

    try {
      const body: Record<string, unknown> = {
        receiver: parseInt(receiverId),
        startup: startupId ? parseInt(startupId) : null,
        content: newMessage.trim(),
      };
      if (replyTo) body.reply_to = replyTo.id;

      const res = await fetch(`${API_BASE_URL}/api/messages/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data: Message = await res.json();
        if (replyTo && !data.reply_to_content) {
          data.reply_to = replyTo.id;
          data.reply_to_content = replyTo.content;
          data.reply_to_sender = replyTo.sender_info?.username ?? "?";
        }
        setMessages((prev) => [...prev, data]);
        setNewMessage("");
        setReplyTo(null);
      } else if (res.status === 400) {
        const errData = await res.json();
        setSendError(
          errData?.non_field_errors?.[0] || errData?.content?.[0] ||
          errData?.detail || "Xabar yuborishda xatolik."
        );
      } else {
        setSendError("Xabar yuborilmadi.");
      }
    } catch {
      setSendError("Tarmoq xatosi.");
    }
  }

  const openContextMenu = useCallback((e: React.MouseEvent, msg: Message) => {
    e.preventDefault();
    e.stopPropagation();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const menuW = 180;
    const menuH = 96;
    let x = e.clientX;
    let y = e.clientY;
    if (x + menuW > viewportW) x = viewportW - menuW - 8;
    if (y + menuH > viewportH) y = e.clientY - menuH - 8;
    setContextMsg(msg);
    setContextMenu({ msgId: msg.id, x, y });
  }, []);

  const copyToClipboard = useCallback(async (msg: Message) => {
    try {
      await navigator.clipboard.writeText(msg.content);
      setCopiedId(msg.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      /* ignore */
    }
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-zinc-500">Xabarlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
          <div className="mb-2 text-2xl">⚠️</div>
          <p className="font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  const otherUser = messages.find(m => m.sender !== myUserId)?.sender_info
    ?? messages.find(m => m.receiver !== myUserId)?.receiver_info;

  return (
    <>
      {/* Context Menu Portal */}
      {contextMenu && contextMsg && (
        <MessageContextMenu
          menu={contextMenu}
          onReply={() => {
            setReplyTo(contextMsg);
            setContextMenu(null);
          }}
          onCopy={() => copyToClipboard(contextMsg)}
          onClose={() => setContextMenu(null)}
        />
      )}

      <div className="mx-auto flex h-[calc(100dvh-64px)] max-w-4xl flex-col bg-zinc-50 dark:bg-zinc-950 sm:px-6 lg:px-8">

        {/* ── Chat Header ── */}
        <div className="flex shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900 sm:mt-6 sm:rounded-t-2xl sm:px-6">
          <button
            onClick={() => router.back()}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
            </svg>
          </button>
          {otherUser && <Avatar name={otherUser.username} isMe={false} />}
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-bold text-zinc-900 dark:text-white truncate">
              {otherUser?.username ?? "Xabarlar"}
            </h1>
            {otherUser && (
              otherUser.isOnline === true ? (
                <p className="flex items-center gap-1 text-xs font-medium text-emerald-500">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                  Onlayn
                </p>
              ) : otherUser.isOnline === false ? (
                <p className="text-xs text-zinc-400">Oflayn</p>
              ) : (
                <p className="text-xs text-zinc-400">Sotuvchi</p>
              )
            )}
          </div>
        </div>

        {/* ── Messages Body ── */}
        <div
          className="flex-1 min-h-[450px] overflow-y-auto p-4 space-y-3 sm:border-x sm:border-zinc-200 sm:dark:border-zinc-800"
          style={{ background: "linear-gradient(135deg, #e8eaf6 0%, #ede7f6 100%)" }}
          onClick={() => contextMenu && setContextMenu(null)}
        >
          {messages.length === 0 ? (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
              <div className="mb-4 text-5xl">💬</div>
              <div className="rounded-xl bg-white/90 px-6 py-4 shadow-sm dark:bg-zinc-900/90">
                <h3 className="mb-1 text-sm font-bold text-zinc-900 dark:text-white">Suhbatni boshlang</h3>
                <p className="text-xs text-zinc-500">Sotuvchiga o&apos;z savollaringizni yozing</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {messages.map((msg) => {
                const isMe = msg.sender === myUserId;
                const senderName = isMe ? "Siz" : msg.sender_info?.username ?? "Foydalanuvchi";
                const isCopied = copiedId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`group flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    <Avatar name={senderName} isMe={isMe} />

                    <div className={`flex max-w-[80%] sm:max-w-[70%] flex-col gap-0.5 ${isMe ? "items-end" : "items-start"}`}>
                      {/* Sender name */}
                      {!isMe && (
                        <span className="pl-1 text-[11px] font-semibold text-violet-700 dark:text-violet-400">
                          {senderName}
                        </span>
                      )}

                      {/* Bubble row: reply btn + bubble + reply btn */}
                      <div className={`flex items-center gap-1.5 ${isMe ? "flex-row-reverse" : "flex-row"}`}>

                        {/* ── Bubble ── */}
                        <div
                          onClick={(e) => openContextMenu(e, msg)}
                          onContextMenu={(e) => openContextMenu(e, msg)}
                          className={`relative w-full cursor-pointer select-none rounded-2xl shadow-sm ${
                            isMe
                              ? "rounded-br-sm bg-blue-600 text-white hover:bg-blue-700"
                              : "rounded-bl-sm bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                          } transition-colors duration-100`}
                        >
                          {/* Reply preview inside bubble */}
                          {msg.reply_to_content && (
                            <div className={`mx-3 mt-2.5 rounded-lg border-l-2 px-2.5 py-1.5 text-[12px] ${
                              isMe
                                ? "border-blue-300 bg-blue-700/50 text-blue-100"
                                : "border-violet-400 bg-zinc-100 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-300"
                            }`}>
                              <p className="mb-0.5 font-semibold">{msg.reply_to_sender ?? "Siz"}</p>
                              <p className="line-clamp-2 leading-snug">{msg.reply_to_content}</p>
                            </div>
                          )}

                          {/* Text + timestamp */}
                          <div className="flex items-end gap-2 px-4 py-2.5">
                            <span className="flex-1 text-sm leading-relaxed break-words">{msg.content}</span>
                            <span className={`shrink-0 self-end text-[11px] opacity-70 ${isMe ? "text-blue-100" : "text-zinc-400 dark:text-zinc-500"}`}>
                              {new Date(msg.created_at).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>

                          {/* Copy flash */}
                          {isCopied && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/20 backdrop-blur-[1px]">
                              <span className="rounded-lg bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-800">✓ Nusxa olindi</span>
                            </div>
                          )}
                        </div>

                        {/* ── Inline Reply Button (visible on hover desktop / always on mobile) ── */}
                        <button
                          type="button"
                          onClick={() => setReplyTo(msg)}
                          title="Javob berish"
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-zinc-400 transition hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30
                            opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100
                            max-sm:opacity-100`}
                        >
                          <ReplyIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ── Input Area ── */}
        <div className="shrink-0 bg-zinc-100 dark:bg-zinc-900 sm:mb-6 sm:rounded-b-2xl sm:border-x sm:border-b sm:border-zinc-200 sm:dark:border-zinc-800">

          {/* Error */}
          {sendError && (
            <div className="flex items-center gap-2 border-b border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-950/40 dark:text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0">
                <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
              </svg>
              {sendError}
            </div>
          )}

          {/* ── Reply Preview Bar ── */}
          {replyTo && (
            <div className="flex items-center gap-3 border-b border-indigo-200 bg-indigo-50 px-4 py-2.5 dark:border-indigo-800/50 dark:bg-indigo-950/40">
              {/* Left accent */}
              <div className="h-8 w-1 shrink-0 rounded-full bg-indigo-500" />

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                  Javob:{" "}
                  <span className="font-semibold normal-case">
                    {replyTo.sender === myUserId ? "Siz" : replyTo.sender_info?.username}
                  </span>
                </p>
                <p className="truncate text-xs text-indigo-600/80 dark:text-indigo-300/70">
                  &ldquo;{replyTo.content.length > 80
                    ? replyTo.content.slice(0, 80) + "…"
                    : replyTo.content}&rdquo;
                </p>
              </div>

              <button
                type="button"
                onClick={() => setReplyTo(null)}
                title="Bekor qilish (Esc)"
                className="shrink-0 rounded-full p-1.5 text-indigo-400 transition hover:bg-indigo-100 hover:text-indigo-700 dark:hover:bg-indigo-900/50 dark:hover:text-indigo-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
                  <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                </svg>
              </button>
            </div>
          )}

          {/* Input row */}
          <form onSubmit={sendMessage} className="flex items-end gap-2 p-3 sm:p-4">
            <textarea
              ref={inputRef}
              rows={1}
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                if (sendError) setSendError("");
              }}
              placeholder={replyTo ? `${replyTo.sender === myUserId ? "Siz" : replyTo.sender_info?.username}ga javob...` : "Xabar yozing..."}
              className={`max-h-32 min-h-[44px] flex-1 resize-none rounded-2xl border-none bg-white px-4 py-2.5 text-sm text-zinc-900 shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-2 ${
                sendError ? "ring-2 ring-red-400" : "focus:ring-indigo-500"
              } dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500`}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(e); }
                if (e.key === "Escape") setReplyTo(null);
              }}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || !receiverId}
              className="mb-0.5 inline-flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 disabled:opacity-40 disabled:hover:bg-indigo-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 -mr-0.5">
                <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.154.75.75 0 0 0 0-1.115A28.897 28.897 0 0 0 3.105 2.288Z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      }
    >
      <ChatClient />
    </Suspense>
  );
}
