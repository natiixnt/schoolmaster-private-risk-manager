const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const accessTokenKey = 'accessToken';
const refreshTokenKey = 'refreshToken';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
};

const isBrowser = () => typeof window !== 'undefined';

export const getAccessToken = () => {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(accessTokenKey);
};

export const getRefreshToken = () => {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(refreshTokenKey);
};

export const setTokens = (tokens: AuthTokens) => {
  if (!isBrowser()) return;
  if (tokens.accessToken) {
    window.localStorage.setItem(accessTokenKey, tokens.accessToken);
  }
  if (tokens.refreshToken) {
    window.localStorage.setItem(refreshTokenKey, tokens.refreshToken);
  }
};

export const clearTokens = () => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(accessTokenKey);
  window.localStorage.removeItem(refreshTokenKey);
};

let refreshPromise: Promise<AuthTokens | null> | null = null;

const requestRefresh = async (): Promise<AuthTokens | null> => {
  if (!isBrowser()) return null;
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const res = await fetch(`${apiUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      clearTokens();
      return null;
    }
    const data = await res.json().catch(() => null);
    if (!data?.accessToken || !data?.refreshToken) {
      clearTokens();
      return null;
    }
    setTokens(data);
    return data;
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
  let accessToken = getAccessToken();
  if (!accessToken) {
    const refreshed = await requestRefresh();
    accessToken = refreshed?.accessToken ?? null;
  }
  if (!accessToken) {
    throw new Error('No access token. Please login first.');
  }

  const doFetch = (token: string) => {
    const headers = new Headers(options?.headers);
    headers.set('Authorization', `Bearer ${token}`);
    return fetch(`${apiUrl}${path}`, { ...options, headers });
  };

  let res = await doFetch(accessToken);
  if (res.status === 401) {
    const refreshed = await requestRefresh();
    if (refreshed?.accessToken) {
      res = await doFetch(refreshed.accessToken);
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${res.status})`);
  }

  return res.json();
};
