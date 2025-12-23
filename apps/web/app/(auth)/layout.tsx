import type { ReactNode } from 'react';
import { Check } from 'lucide-react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-gradient-to-br from-background to-muted text-foreground before:pointer-events-none before:absolute before:left-[-6rem] before:top-[-4rem] before:h-72 before:w-72 before:rounded-full before:bg-primary/20 before:blur-3xl before:opacity-20 before:content-[''] after:pointer-events-none after:absolute after:bottom-[-6rem] after:right-[-8rem] after:h-96 after:w-96 after:rounded-full after:bg-primary/10 after:blur-3xl after:opacity-15 after:content-['']">
      <div className="relative grid min-h-[100dvh] grid-cols-1 lg:grid-cols-2 lg:gap-16">
        <aside className="hidden flex-col justify-between px-12 pb-12 pt-10 lg:flex">
          <div className="max-w-xl">
            <img
              src="/brand/schoolmaster-logo.png"
              alt="Schoolmaster"
              className="h-10 w-auto"
            />
            <h1 className="mt-4 text-5xl font-semibold leading-tight tracking-tight">
              Schoolmaster for <span className="text-primary">Private</span>
            </h1>
            <p className="mt-4 text-sm text-muted-foreground">
              Panel do monitoringu ryzyka i danych uczniów.
            </p>
            <div className="mt-10 flex flex-wrap gap-10">
              <div>
                <p className="text-3xl font-semibold tracking-tight text-primary">24/7</p>
                <p className="text-xs text-muted-foreground">Monitoring</p>
              </div>
              <div>
                <p className="text-3xl font-semibold tracking-tight text-primary">3</p>
                <p className="text-xs text-muted-foreground">Moduły analiz</p>
              </div>
              <div>
                <p className="text-3xl font-semibold tracking-tight text-primary">1</p>
                <p className="text-xs text-muted-foreground">Panel zarządzania</p>
              </div>
            </div>
            <div className="mt-10 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-primary/20 shadow-sm">
                  <Check className="h-4 w-4" />
                </span>
                <span>Szybki wgląd w sytuację ucznia</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-primary/20 shadow-sm">
                  <Check className="h-4 w-4" />
                </span>
                <span>Historia zdarzeń i notatek</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-primary/20 shadow-sm">
                  <Check className="h-4 w-4" />
                </span>
                <span>Raporty i monitoring klas</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Bezpieczny panel wewnętrzny</p>
        </aside>
        <main className="flex items-center justify-center p-6 lg:p-12">
          {children}
        </main>
      </div>
    </div>
  );
}
