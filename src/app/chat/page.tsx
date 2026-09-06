"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Owner {
  id: number;
  username: string;
  email: string;
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
}

function ChatClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const receiverId = searchParams.get("receiver_id");
  const startupId = searchParams.get("startup_id");

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [myUserId, setMyUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Avtomatik pastga tushirish (scroll)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      router.replace("/login");
      return;
    }

    async function fetchData() {
      try {
        // 1. Profilni olish (myUserId ni bilish uchun)
        const profileRes = await fetch("http://127.0.0.1:8000/api/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (profileRes.status === 401) {
          router.replace("/login");
          return;
        }

        let profileData = null;
        if (profileRes.ok) {
          profileData = await profileRes.json();
          setMyUserId(profileData.id);
        } else {
          setError("Profilni yuklab bo'lmadi.");
          return;
        }

        // 2. Xabarlarni olish
        const msgRes = await fetch("http://127.0.0.1:8000/api/messages/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (msgRes.ok) {
          const allMsgs: Message[] = await msgRes.json();
          
          // Agar receiverId bo'lsa, faqat shu user bilan bo'lgan yozishmani ajratib olamiz
          if (receiverId) {
             const filtered = allMsgs.filter(m => 
               (m.sender.toString() === receiverId && m.receiver === profileData?.id) || 
               (m.receiver.toString() === receiverId && m.sender === profileData?.id)
             );
             setMessages(filtered);
          } else {
             // Aks holda barcha xabarlar
             setMessages(allMsgs);
          }
        }
      } catch (err) {
        setError("Serverga ulanib bo'lmadi.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router, receiverId]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !receiverId) return;

    const token = localStorage.getItem("access");
    if (!token) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/messages/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiver: parseInt(receiverId),
          startup: startupId ? parseInt(startupId) : null,
          content: newMessage.trim(),
        }),
      });

      if (res.ok) {
        const data: Message = await res.json();
        setMessages((prev) => [...prev, data]);
        setNewMessage("");
      }
    } catch (error) {
      console.error(error);
    }
  }

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
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
          <div className="mb-2 text-2xl">⚠️</div>
          <p className="font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-4xl flex-col bg-zinc-50 dark:bg-zinc-950 sm:px-6 lg:px-8">
      {/* ── Chat Header ── */}
      <div className="flex shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900 sm:mt-6 sm:rounded-t-2xl sm:px-6">
        <button
          onClick={() => router.back()}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
          </svg>
        </button>
        <div>
          <h1 className="text-lg font-bold text-zinc-900 dark:text-white">
            Xabarlar
          </h1>
          {receiverId && (
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Suhbatdosh onlayn
            </p>
          )}
        </div>
      </div>

      {/* ── Chat Oynasi (Tana) ── */}
      <div className="flex-1 overflow-y-auto bg-[#e5ddd5] p-4 dark:bg-zinc-950/50 sm:border-x sm:border-zinc-200 sm:dark:border-zinc-800 sm:p-6" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}>
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 text-5xl">💬</div>
            <div className="rounded-xl bg-white/90 px-6 py-4 shadow-sm backdrop-blur-sm dark:bg-zinc-900/90">
              <h3 className="mb-1 text-sm font-bold text-zinc-900 dark:text-white">
                Suhbatni boshlang
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Sotuvchiga o&apos;z savollaringizni yozing
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((msg) => {
              const isMe = msg.sender === myUserId;
              return (
                <div
                  key={msg.id}
                  className={`flex max-w-[75%] flex-col ${
                    isMe ? "self-end items-end" : "self-start items-start"
                  }`}
                >
                  <div
                    className={`relative rounded-2xl px-4 py-2 text-[15px] shadow-sm ${
                      isMe
                        ? "rounded-tr-none bg-indigo-600 text-white"
                        : "rounded-tl-none bg-white border border-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                    }`}
                  >
                    {msg.content}
                    <span
                      className={`ml-3 inline-block text-[10px] opacity-70 ${
                        isMe ? "text-indigo-100" : "text-zinc-400"
                      }`}
                    >
                      {new Date(msg.created_at).toLocaleTimeString("uz-UZ", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Xabar Yozish Qismi ── */}
      <div className="shrink-0 bg-zinc-100 p-3 dark:bg-zinc-900 sm:mb-6 sm:rounded-b-2xl sm:border-x sm:border-b sm:border-zinc-200 sm:p-4 sm:dark:border-zinc-800">
        <form onSubmit={sendMessage} className="flex items-end gap-2">
          <textarea
            rows={1}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Xabar yozing..."
            className="max-h-32 min-h-[48px] flex-1 resize-none rounded-2xl border-none bg-white px-5 py-3 text-[15px] text-zinc-900 shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !receiverId}
            className="mb-0.5 inline-flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:hover:bg-indigo-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 -mr-1">
              <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.154.75.75 0 0 0 0-1.115A28.897 28.897 0 0 0 3.105 2.288Z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
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
