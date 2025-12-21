'use client';

import { useEffect, useState } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type HealthResponse = {
  status: string;
  db: string;
};

export default function HomePage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${apiUrl}/health`)
      .then(async (res) => {
        const data = await res.json();
        setHealth(data);
      })
      .catch((err) => setError(err?.message ?? 'error'));
  }, []);

  return (
    <section>
      <h2>Health</h2>
      {health && <pre>{JSON.stringify(health, null, 2)}</pre>}
      {error && <div>Failed to load health: {error}</div>}
      {!health && !error && <div>Loading...</div>}
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
    </section>
  );
}
