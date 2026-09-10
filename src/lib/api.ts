/**
 * Markaziy API konfiguratsiyasi
 * Barcha fetch so'rovlari shu moduldan API_BASE_URL ni olishi kerak.
 * Loyihani deployment qilishdan oldin .env.local faylida
 * NEXT_PUBLIC_API_URL ni production URL ga o'zgartiring.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Authorization headeri bilan tuzilgan fetch.
 * @param path - API endpoint (masalan: "/api/startups/")
 * @param options - Fetch parametrlari (method, body, va h.k.)
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
