'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setTokens } from '../../../../lib/auth';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const fallbackError = 'Nie udało się połączyć z serwerem. Spróbuj ponownie.';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@schoolmaster.test');
  const [password, setPassword] = useState('changeme');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Login failed');
      }
      const data = await res.json();
      if (!data?.accessToken || !data?.refreshToken) {
        throw new Error('Missing auth token.');
      }
      setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      router.push('/dev/tools');
    } catch (err: any) {
      const message = err?.message;
      const isNetworkError =
        !message ||
        message === 'Failed to fetch' ||
        message === 'NetworkError when attempting to fetch resource.' ||
        message === 'Load failed';
      setError(isNetworkError ? fallbackError : message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative w-full max-w-none px-2 sm:px-0">
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-primary/10 blur-2xl" />
      <div className="mx-auto w-full rounded-2xl bg-card/90 p-8 shadow-xl ring-1 ring-border/20 backdrop-blur-sm sm:p-10 lg:w-[44rem]">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Zaloguj się</h2>
          <p className="mt-1 text-sm text-muted-foreground">Wróć do swojego konta</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Hasło
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
          </div>
          <div className="flex items-center justify-between">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Nie pamiętasz hasła?
            </a>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-gradient-to-r from-primary to-primary/80 px-4 py-2 text-primary-foreground shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {loading ? 'Logowanie...' : 'Zaloguj się'}
          </button>
        </form>
        {error && <div className="mt-4 text-sm text-destructive">{error}</div>}
      </div>
    </div>
  );
}
