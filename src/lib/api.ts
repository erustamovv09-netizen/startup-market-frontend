/**
 * Markaziy API konfiguratsiyasi
 */
export const API_BASE_URL = (() => {
  // 1. Agar .env.local faylida NEXT_PUBLIC_API_URL bor bo'lsa (Production)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // 2. Local kompyuter yoki Wi-Fi orqali telefonda test qilish uchun (Development)
  if (typeof window !== "undefined") {
    return `http://${window.location.hostname}:8000`;
  }

  return "http://127.0.0.1:8000";
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