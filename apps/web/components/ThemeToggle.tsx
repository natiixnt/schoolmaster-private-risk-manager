'use client';

import { useEffect, useState } from 'react';

const storageKey = 'theme';

const applyThemeClass = (theme: 'dark' | 'light') => {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored === 'dark' || stored === 'light') {
      setTheme(stored);
      applyThemeClass(stored);
    } else {
      applyThemeClass('light');
    }
    setMounted(true);
  }, []);

  const handleToggle = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem(storageKey, nextTheme);
    applyThemeClass(nextTheme);
  };

  if (!mounted) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="rounded-md border border-border bg-background px-3 py-1 text-foreground"
    >
      Toggle theme
    </button>
  );
}
