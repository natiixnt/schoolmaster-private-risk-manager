'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import LogoWhite from 'apps/web/app/components/LogoWhite';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
       const res = await fetch(apiUrl, {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify( { email })
       }) 
      
      // Sukces:
      setSuccessMessage('Link do resetu hasła został wysłany na podany adres email.');
    } catch (error) {
      setErrorMessage('Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

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

      <div className="flex bg-[var(--sm-color-surface-muted)] flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2">
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
              Zresetuj hasło
            </h2>
            <p className="mt-2 text-sm text-[var(--sm-color-text-muted)] lg:text-md">
              Podaj adres email powiązany z Twoim kontem, a wyślemy Ci link do zmiany hasła.
            </p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              
              {errorMessage && (
                <div className="mb-4 rounded-md bg-red-50 p-4 border border-red-200 animate-fade-in">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-[var(--sm-font-weight-medium)] text-[var(--sm-color-negative-500)]">Błąd</h3>
                      <div className="mt-1 text-sm lg:text-md text-[var(--sm-color-negative-500)]">{errorMessage}</div>
                    </div>
                  </div>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 rounded-md bg-green-50 p-4 border border-green-200 animate-fade-in">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Wysłano!</h3>
                      <div className="mt-1 text-sm text-green-700">{successMessage}</div>
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
                      disabled={loading || !!successMessage}
                      placeholder="np. jan.kowalski@szkola.pl"
                      className="block w-full rounded-[var(--sm-radius-sm)] border-0 py-2.5 px-3 text-[var(--sm-color-text-primary)] shadow-sm ring-1 ring-inset lg:text-lg ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading || !!successMessage}
                    className="flex w-full justify-center cursor-pointer rounded-md bg-[var(--sm-color-primary-900)] px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[var(--sm-color-primary-900-90)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                  >
                     {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Wysyłanie...
                      </span>
                    ) : (
                      'Wyślij link do resetu hasła'
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center text-sm">
                <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500 flex items-center justify-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                   </svg>
                   Wróć do logowania
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}