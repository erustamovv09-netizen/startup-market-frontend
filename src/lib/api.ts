/**
 * Markaziy API konfiguratsiyasi
 */
export const API_BASE_URL = (() => {
  // 1. Agar environment o'zgaruvchisi berilgan bo'lsa
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // 2. Agar mijoz brauzerida ishlayotgan bo'lsa
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1" || host.startsWith("192.168.")) {
      return `http://${host}:8000`;
    }
    // Production domenda (startupp.shop, www.startupp.shop, vercel.app)
    return "https://startup-market-backend.onrender.com";
  }

  // 3. Server-side render uchun fallback
  return "https://startup-market-backend.onrender.com";
})();

/**
 * Authorization headeri bilan tuzilgan fetch.
 * 
 * @param path API endpoint (masalan: "/api/startups/")
 * @param options Fetch parametrlari
 */
export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
}