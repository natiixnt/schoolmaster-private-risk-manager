# Landing port – from schoolmaster-1 to this repo

Źródło: `schoolmaster-1/client/src/pages/schoolmaster-private.tsx` (Vite + React + wouter + shadcn/ui).
Docelowo: `apps/web/app/page.tsx` (Next.js App Router).

Pliki źródłowe (NIE importowane w bundle, tylko do portu):
- `_landing-source.tsx` – oryginalny komponent (~1615 linii)
- `_landing-tokens.css` – zmienne CSS dla `.schoolmaster-private` scope

## TODO – adaptacja do Next.js

1. **Dodać `"use client"`** na górze pliku – komponent używa `useState`, `useEffect`, `useRef`.

2. **Zamienić routing wouter → next/link:**
   - `import { Link } from "wouter"` → `import Link from "next/link"`
   - `<Link to="/login">` → `<Link href="/login">`
   - Targety linków sprawdzić z istniejącymi route'ami w tym repo:
     - `/login` → `/auth/login` (istnieje)
     - `/register` → TODO (brak w prywatnym repo)
     - `/schoolmaster-private` → usunąć, to był redirect

3. **Zainstalować shadcn/ui i wygenerować komponenty** (używane przez landing):
   ```bash
   npx shadcn@latest init
   npx shadcn@latest add button card dialog input badge
   ```
   Obecnie w `apps/web/components/` jest tylko `ThemeToggle.tsx`.

4. **Logo** – zamienić `import SchoolMasterLogo from "@/assets/schoolmaster-logo.png"` na:
   ```tsx
   import Image from "next/image";
   // w JSX:
   <Image src="/brand/schoolmaster-logo-private.png" alt="SchoolMaster" width={...} height={...} />
   ```
   Logo jest już w `apps/web/public/brand/`.

5. **Ikony lucide-react** – już zainstalowane (sprawdź `package.json`), powinny działać bez zmian.

6. **CSS tokens** – `_landing-tokens.css` doczepić do globalnego stylu. Dwie opcje:
   - Dodać `import "./_landing-tokens.css"` w `app/layout.tsx`
   - Albo wkleić zawartość do `app/globals.css`

   Scope `.schoolmaster-private` jest potrzebny – root dla strony musi mieć ten class:
   ```tsx
   <div className="schoolmaster-private min-h-screen ...">
   ```

7. **Zastąpić `app/page.tsx`** – obecny to tylko health check placeholder, można bezpiecznie nadpisać zportowanym landingiem.

8. **Usunąć `_landing-source.tsx`, `_landing-tokens.css` i ten plik** po zakończeniu portu.

## Notatki dodatkowe

- Komponent używa `Tailwind` – w prywatnym repo jest skonfigurowany (`tailwind.config.ts`)
- Kolory z tokens (`--sm-color-*`) są konsumowane przez Tailwind inline: `bg-[color:var(--sm-color-background)]`
- Modal z Dialog (shadcn) otwiera podgląd produktu – upewnić się że Dialog działa w RSC/client context
