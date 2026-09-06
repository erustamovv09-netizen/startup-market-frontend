"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

interface Startup {
  id: number;
  title: string;
  project_type_display: string;
}

interface Conversation {
  id: string; // "startupId-otherUserId"
  otherUser: Owner;
  startupId: number | null;
  startupTitle: string;
  latestMessage: string;
  lastMessageTime: string;
}

export default function InboxPage() {
  const router = useRouter();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      router.replace("/login");
      return;
    }

    async function fetchData() {
      try {
        const [profileRes, messagesRes, startupsRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/profile/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://127.0.0.1:8000/api/messages/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://127.0.0.1:8000/api/startups/"), // Startuplar ro'yxati ochiq (token kerak emas yoki bo'lsa yaxshi)
        ]);

        if (profileRes.status === 401) {
          router.replace("/login");
          return;
        }

        if (!profileRes.ok || !messagesRes.ok) {
          setError("Ma'lumotlarni yuklab bo'lmadi.");
          return;
        }

        const myProfile = await profileRes.json();
        const myUserId = myProfile.id;
        const allMessages: Message[] = await messagesRes.json();
        
        let allStartups: Startup[] = [];
        if (startupsRes.ok) {
          allStartups = await startupsRes.json();
        }

        // Xabarlarni guruhlash
        const convMap = new Map<string, Conversation>();

        allMessages.forEach((msg) => {
          const isSender = msg.sender === myUserId;
          const otherUserId = isSender ? msg.receiver : msg.sender;
          const otherUserInfo = isSender ? msg.receiver_info : msg.sender_info;
          const startupId = msg.startup;

          const convKey = `${startupId}-${otherUserId}`;

          const existing = convMap.get(convKey);
          if (!existing || new Date(msg.created_at) > new Date(existing.lastMessageTime)) {
            // Startup nomini topish
            const foundStartup = allStartups.find((s) => s.id === startupId);
            const startupTitle = foundStartup ? foundStartup.title : (startupId ? `Loyiha #${startupId}` : "Umumiy suhbat");

            convMap.set(convKey, {
              id: convKey,
              otherUser: otherUserInfo,
              startupId,
              startupTitle,
              latestMessage: msg.content,
              lastMessageTime: msg.created_at,
            });
          }
        });

        // Eng yangi xabari bor suhbatlar yuqorida turishi uchun sort qilamiz
        const sortedConvs = Array.from(convMap.values()).sort(
          (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
        );

        setConversations(sortedConvs);
      } catch (err) {
        setError("Server bilan aloqa yo'q.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-zinc-500">Xabarlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
          <div className="mb-2 text-2xl">⚠️</div>
          <p className="font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-50 py-10 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              Xabarlar
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Sizning barcha yozishmalaringiz
            </p>
          </div>
        </div>

        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white py-20 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 text-5xl">📭</div>
            <h3 className="mb-2 text-lg font-bold text-zinc-900 dark:text-white">
              Hozircha xabarlar yo&apos;q
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              E&apos;lonlar bo&apos;yicha savollar shu yerda paydo bo&apos;ladi
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {conversations.map((conv) => (
                <li key={conv.id}>
                  <button
                    onClick={() => router.push(`/chat?receiver_id=${conv.otherUser.id}&startup_id=${conv.startupId || ""}`)}
                    className="flex w-full items-start gap-4 p-5 text-left transition hover:bg-zinc-50 active:bg-zinc-100 dark:hover:bg-zinc-800/50 dark:active:bg-zinc-800"
                  >
                    {/* Avatar */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-bold text-white shadow-inner">
                      {conv.otherUser.username.charAt(0).toUpperCase()}
                    </div>

                    {/* Matn qismi */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-bold text-zinc-900 dark:text-white">
                          @{conv.otherUser.username}
                        </p>
                        <time className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500">
                          {new Date(conv.lastMessageTime).toLocaleDateString("uz-UZ", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </time>
                      </div>
                      
                      <p className="mt-0.5 truncate text-xs font-medium text-indigo-600 dark:text-indigo-400">
                        {conv.startupTitle}
                      </p>
                      
                      <p className="mt-1.5 truncate text-sm text-zinc-500 dark:text-zinc-400">
                        {conv.latestMessage}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
