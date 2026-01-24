'use client';
//Powiekszyć Login
//Responsywnosc !!!!
//Większa czcionka przy <p>
//Logo - Później

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'
import LogoWhite from 'apps/web/app/components/LogoWhite';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
        throw new Error(body.message || 'Nieprawidłowe dane logowania');
      }
      const data = await res.json();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message ?? 'Wystąpił nieznany błąd');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="schoolmaster-private flex min-h-screen  bg-[--sm-color-background]">
      
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-center xl:items-center sm-bg-hero lg:px-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <svg viewBox="0 0 960 540" width="100%" height="100%" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" stroke="currentColor" strokeWidth="100">
                 <circle r="234" cx="196" cy="23" className="text-white" />
                 <circle r="234" cx="790" cy="491" className="text-white" />
              </g>
           </svg>
        </div>
        
        <div className="relative z-10 text-white max-w-lg flex flex-col items-center">
          
          <LogoWhite className="w-auto h-48 -mb-10" />
          
          <div>
          <h2 className="text-3xl xl:text-4xl text-[var(--sm-color-neutral-100)] font-[var(--sm-font-weight-semibold)] mb-4">
            Zarządzaj swoją placówką<br />z jednego miejsca.
          </h2>
          <p className="text-[var(--sm-color-neutral-200)] font-[var(--sm-font-weight-medium)] text-lg xl:text-xl leading-relaxed">
            Kompleksowy system do zarządzania procesami w szkole. Dziennik, ocena ryzyka, sprawy rodziców i raporty – wszystko pod ręką.
          </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 bg-[var(--sm-color-surface-muted)] flex-col justify-center items-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          
  
          <div className="lg:hidden flex items-center justify-center text-center mb-5">
            <Image
           src="/linkedin_2.png"
           alt='Schoolmaster Logo'
           width={250}
           height={250}

           />
          </div>

          <div className="text-left">
            <h2 className="mt-6 text-4xl font-[var(--sm-font-weight-bold)] text-center lg:text-left tracking-tight text-[var(--sm-color-text-primary)] lg:text-5xl">
              Zaloguj się
            </h2>
            <p className="mt-2 text-sm text-[var(--sm-color-text-muted)] lg:text-md">
              Wprowadź swoje dane, aby uzyskać dostęp do panelu.
            </p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              
       
              {error && (
                <div className="mb-4 rounded-md bg-red-50 p-4 border border-red-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-[var(--sm-color-danger-500)]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-[var(--sm-font-weight-medium)] text-[var(--sm-color-negative-500)]">Błąd logowania</h3>
                      <div className="mt-1 text-sm lg:text-md text-[var(--sm-color-negative-500)]">{error}</div>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
            
                <div>
                  <label htmlFor="email" className="block text-md font-[var(--sm-font-weight-medium)] leading-6 text-[var(--sm-color-text-primary)] lg:text-lg">
                    Adres Email
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="block w-full rounded-[var(--sm-radius-sm)] border-0 py-2.5 px-3 text-[var(--sm-color-text-primary)] shadow-sm ring-1 ring-inset lg:text-lg ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                    />
                  </div>
                </div>

            
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-md lg:text-lg  font-[var(--sm-font-size-md)] leading-6 text-[var(--sm-color-text-primary)]">
                      Hasło
                    </label>
                    <div className="text-sm lg:text-md">
             
                      <Link 
                        href="/auth/forgot-password" 
                        className="font-[var(--sm-font-weight-medium)] text-[var(--sm-color-info-600)] hover:text-[var(--sm-color-info-500)] transition-colors"
                      >
                        Zapomniałeś hasła?
                      </Link>
                    </div>
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="block w-full rounded-[var(--sm-radius-sm)] lg:text-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center cursor-pointer rounded-md bg-[var(--sm-color-primary-900)] px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[var(--sm-color-primary-900-90)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                  >
                     {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logowanie...
                      </span>
                    ) : (
                      'Zaloguj'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}