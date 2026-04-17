const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Tokeny są przechowywane w ciasteczkach HttpOnly ustawianych przez backend.
// Nie można ich czytać z JavaScript - to celowe zabezpieczenie przed XSS.
// Poniższe funkcje są pozostawione jako stuby dla kompatybilności wstecznej.
export const getAccessToken = (): null => null;
export const getRefreshToken = (): null => null;
export const clearTokens = (): void => { /* obsługiwane przez /auth/logout na backendzie */ };

let refreshPromise: Promise<boolean> | null = null;

const requestRefresh = async (): Promise<boolean> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const res = await fetch(`${apiUrl}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    return res.ok;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
};

export const authFetch = async <T = unknown>(
  path: string,
  options?: RequestInit,
): Promise<T> => {
  const doFetch = () =>
    fetch(`${apiUrl}${path}`, {
      ...options,
      credentials: 'include',
    });

  let res = await doFetch();

  if (res.status === 401) {
    const refreshed = await requestRefresh();
    if (refreshed) {
      res = await doFetch();
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${res.status})`);
  }

  return res.json();
};
