import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import SchoolMasterLogo from "@/assets/schoolmaster-logo.png";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  FileText,
  Mail,
  ShieldCheck,
  TrendingDown,
  Users,
} from "lucide-react";

const audiencePoints = [
  "Szkoły podstawowe i średnie, szczególnie prywatne.",
  "Wychowawcy i nauczyciele, którzy spędzają za dużo czasu na ręcznej analizie ocen i frekwencji.",
  "Dyrekcja, która chce widzieć w prosty sposób rosnące ryzyko: nieklasyfikowania, braku promocji, problemów wychowawczych.",
];

const problemPoints = [
  "Trzeba przeklikiwać się przez wielu uczniów i zakładek, aby ocenić sytuację klasy.",
  "Brak jasnej odpowiedzi, ilu uczniów jest realnie zagrożonych nieklasyfikowaniem lub brakiem promocji.",
  "Trudno połączyć niską frekwencję, słabe oceny i uwagi wychowawcze w jeden obraz ryzyka.",
  "Dyrekcja widzi dużo danych, ale brakuje prostego widoku: gdzie rośnie ryzyko i gdzie jest poprawa.",
];

const problemSnapshot = [
  { label: "Alerty krytyczne", value: "6", bar: "bg-rose-400", text: "text-rose-600", width: 64 },
  { label: "Nowe sygnały", value: "14", bar: "bg-amber-400", text: "text-amber-600", width: 48 },
  { label: "Klasy stabilne", value: "9", bar: "bg-emerald-400", text: "text-emerald-600", width: 72 },
];

const systemSteps = [
  {
    title: "Zbiera dane w jednym miejscu",
    description:
      "Oceny cząstkowe i końcowe, średnie, frekwencja, spóźnienia, uwagi wychowawcze. Dane z e-dziennika lub innego źródła.",
    icon: ClipboardList,
  },
  {
    title: "Przelicza wskaźniki ryzyka",
    description:
      "Spadki średnich, wysoka absencja, połączenie słabych ocen z uwagami, kumulacja problemów w wielu obszarach.",
    icon: Activity,
  },
  {
    title: "Przypisuje uczniów do stref",
    description:
      "Zielona: stabilnie. Żółta: narastające ryzyko. Czerwona: pilna interwencja (nieklasyfikowanie, brak promocji).",
    icon: AlertTriangle,
  },
  {
    title: "Pokazuje czytelny obraz sytuacji",
    description:
      "Lista uczniów w strefach, powody ryzyka, podgląd klasy i całej szkoły, gotowe raporty na radę pedagogiczną.",
    icon: BarChart3,
  },
];

const practiceRows = [
  {
    name: "Ola Krawczyk",
    className: "7B",
    reason: "Niska frekwencja w ostatnich 2 miesiącach",
    status: "CZERWONA",
    badge: "bg-red-100 text-red-700",
  },
  {
    name: "Piotr Zieliński",
    className: "8A",
    reason: "Znaczny spadek ocen z matematyki i języka polskiego",
    status: "ŻÓŁTA",
    badge: "bg-amber-100 text-amber-700",
  },
  {
    name: "Kasia Wiśniewska",
    className: "6C",
    reason: "Rosnąca liczba uwag dotyczących zachowania",
    status: "ŻÓŁTA",
    badge: "bg-amber-100 text-amber-700",
  },
  {
    name: "Jan Kowalski",
    className: "5D",
    reason: "Spadek frekwencji i powtarzające się spóźnienia",
    status: "CZERWONA",
    badge: "bg-red-100 text-red-700",
  },
  {
    name: "Anna Nowak",
    className: "4A",
    reason: "Poprawa frekwencji, ryzyko maleje",
    status: "ZIELONA",
    badge: "bg-emerald-100 text-emerald-700",
  },
];

const practiceFilters = [
  { label: "Wszystkie", value: "ALL", activeClass: "bg-slate-200 text-slate-700" },
  { label: "Czerwona", value: "CZERWONA", activeClass: "bg-red-100 text-red-700" },
  { label: "Żółta", value: "ŻÓŁTA", activeClass: "bg-amber-100 text-amber-700" },
  { label: "Zielona", value: "ZIELONA", activeClass: "bg-emerald-100 text-emerald-700" },
];

const pricing = [
  {
    title: "Mniejsza szkoła",
    price: "400–600 PLN netto / mies.",
    note: "Docelowo, po fazie pilota.",
  },
  {
    title: "Szkoła średniej wielkości",
    price: "700–1 200 PLN netto / mies.",
    note: "Docelowo, po fazie pilota.",
  },
];

const questions = [
  "Czy widzą Państwo wartość w podejściu do „stref zagrożenia”?",
  "Czy trudność w szybkiej identyfikacji uczniów zagrożonych występuje w Państwa szkole?",
  "Jakie wskaźniki lub funkcje byłyby absolutnie kluczowe?",
  "Czy koszt na poziomie „jednego ucznia miesięcznie” byłby akceptowalny?",
];

const demoKpis = [
  {
    label: "Czerwona strefa",
    value: "6 uczniów",
    note: "2 nowe alerty",
    targetSection: "students",
    targetFilter: "urgent",
  },
  {
    label: "Żółta strefa",
    value: "11 uczniów",
    note: "3 klasy zagrożone",
    targetSection: "risk",
  },
  {
    label: "Frekwencja",
    value: "91%",
    note: "zmiana semestralna -3 pp",
    targetSection: "reports",
    targetFilter: "attendance",
  },
];

const demoSignals = [
  {
    label: "Spadek średniej",
    detail: "7B • Matematyka -0.7",
  },
  {
    label: "Wzrost nieobecności",
    detail: "8A • +12% powyżej normy",
  },
  {
    label: "Uwaga wychowawcza",
    detail: "6C • 2 powtarzające się uwagi",
  },
];

const demoNavItems = [
  { id: "overview", label: "Panel główny" },
  { id: "risk", label: "Strefy ryzyka" },
  { id: "classes", label: "Klasy" },
  { id: "students", label: "Uczniowie" },
  { id: "reports", label: "Raporty" },
];

const demoQuickFilters = [
  { id: "all", label: "Wszystkie", value: "—" },
  { id: "urgent", label: "Pilne interwencje", value: "6" },
  { id: "attendance", label: "Spadek frekwencji", value: "4" },
  { id: "notes", label: "Nowe uwagi", value: "3" },
];

const demoClassList = [
  {
    label: "Klasa 7B",
    detail: "Frekwencja spadła o 8%",
    status: "CZERWONA",
    badge: "bg-red-100 text-red-700",
    count: 4,
  },
  {
    label: "Klasa 8A",
    detail: "Wzrost nieobecności, 2 nowe uwagi",
    status: "ŻÓŁTA",
    badge: "bg-amber-100 text-amber-700",
    count: 3,
  },
  {
    label: "Klasa 6C",
    detail: "Ryzyko maleje, poprawa ocen",
    status: "ZIELONA",
    badge: "bg-emerald-100 text-emerald-700",
    count: 1,
  },
  {
    label: "Klasa 5D",
    detail: "Seria spóźnień, spadek średniej",
    status: "CZERWONA",
    badge: "bg-red-100 text-red-700",
    count: 5,
  },
];

const demoAttendanceTrend = [
  { month: "Wrz", value: 95 },
  { month: "Paź", value: 88 },
  { month: "Lis", value: 79 },
  { month: "Gru", value: 72 },
  { month: "Sty", value: 85 },
  { month: "Lut", value: 92 },
];

const demoReports = [
  { title: "Raport miesięczny", period: "Paź 2024", status: "Gotowy", badge: "bg-emerald-100 text-emerald-700" },
  { title: "Analiza frekwencji", period: "Q3 2024", status: "W trakcie", badge: "bg-amber-100 text-amber-700" },
  { title: "Zachowanie i uwagi", period: "Paź 2024", status: "Gotowy", badge: "bg-emerald-100 text-emerald-700" },
  { title: "Ryzyko promocji", period: "Q4 2024", status: "Planowany", badge: "bg-slate-100 text-slate-600" },
];

const demoRiskAreas = [
  { label: "Oceny", value: 72, color: "bg-red-500" },
  { label: "Frekwencja", value: 58, color: "bg-amber-400" },
  { label: "Zachowanie", value: 34, color: "bg-emerald-400" },
];

const demoTimeline = [
  { date: "01.10", detail: "Spadek średniej z matematyki" },
  { date: "10.10", detail: "2 nieobecności pod rząd" },
  { date: "18.10", detail: "Uwaga od wychowawcy: spóźnienia" },
  { date: "26.10", detail: "Rozmowa z rodzicem zaplanowana" },
];

const demoActions = [
  { label: "Kontakt z rodzicem", detail: "spotkanie • śr 12:30" },
  { label: "Wsparcie przedmiotu", detail: "konsultacje • matematyka" },
  { label: "Plan frekwencji", detail: "monitoring tygodniowy" },
];

type RiskLevel = "red" | "amber" | "green";
type DemoSection = "overview" | "risk" | "classes" | "students" | "reports";
type DemoQuickFilter = "all" | "urgent" | "attendance" | "notes";

type RiskRow = {
  label: string;
  detail: string;
  badge: string;
  status: string;
  count: number;
};

type PracticeRow = (typeof practiceRows)[number];
type DemoClassRow = (typeof demoClassList)[number];

const riskLevelConfig: Record<
  RiskLevel,
  {
    badge: string;
    status: string;
    details: Array<(count?: number) => string>;
    countRange?: [number, number];
  }
> = {
  red: {
    badge: "bg-red-100 text-red-700",
    status: "CZERWONA",
    countRange: [2, 6],
    details: [
      (count = 0) => `${count} uczniów w czerwonej strefie`,
      (count = 0) => `Pilna interwencja: ${count} uczniów`,
    ],
  },
  amber: {
    badge: "bg-amber-100 text-amber-700",
    status: "ŻÓŁTA",
    countRange: [2, 5],
    details: [
      (count = 0) => `${count} uczniów w żółtej strefie`,
      (count = 0) => `Ryzyko rośnie u ${count} uczniów`,
    ],
  },
  green: {
    badge: "bg-emerald-100 text-emerald-700",
    status: "ZIELONA",
    details: [
      () => "Ryzyko maleje w porównaniu z zeszłym miesiącem",
      () => "Stabilna sytuacja, brak nowych alertów",
    ],
  },
};

const riskRowSources: Array<{ label: string; levelPool: RiskLevel[] }> = [
  { label: "Klasa 7B", levelPool: ["red", "red", "amber", "green"] },
  { label: "Klasa 8A", levelPool: ["amber", "amber", "red", "green"] },
  { label: "Klasa 6C", levelPool: ["green", "green", "amber", "red"] },
];

const padTwo = (value: number) => value.toString().padStart(2, "0");

const formatTime = (value: Date) => `${padTwo(value.getHours())}:${padTwo(value.getMinutes())}`;

const getBarHeight = (value: number, min = 0, max = 100, minHeight = 6) => {
  if (max <= min) {
    return minHeight;
  }
  const normalized = ((value - min) / (max - min)) * 100;
  return Math.max(minHeight, Math.min(100, Number(normalized.toFixed(1))));
};

const includesTerm = (text: string, term: string) => text.toLowerCase().includes(term);

const pickOne = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const buildRiskRows = (): RiskRow[] =>
  riskRowSources.map((source) => {
    const level = pickOne(source.levelPool);
    const config = riskLevelConfig[level];
    const count = config.countRange ? getRandomInt(config.countRange[0], config.countRange[1]) : 0;
    const detail = pickOne(config.details)(count);

    return {
      label: source.label,
      detail,
      badge: config.badge,
      status: config.status,
      count,
    };
  });

const matchesQuickFilter = (row: PracticeRow, filter: DemoQuickFilter) => {
  if (filter === "all") {
    return true;
  }
  if (filter === "urgent") {
    return row.status === "CZERWONA";
  }
  if (filter === "attendance") {
    return includesTerm(row.reason, "frekwencj") || includesTerm(row.reason, "nieobec");
  }
  return includesTerm(row.reason, "uwag") || includesTerm(row.reason, "zachowan");
};

const matchesClassQuickFilter = (row: DemoClassRow, filter: DemoQuickFilter) => {
  if (filter === "all") {
    return true;
  }
  if (filter === "urgent") {
    return row.status === "CZERWONA";
  }
  if (filter === "attendance") {
    return includesTerm(row.detail, "frekwencj") || includesTerm(row.detail, "nieobec");
  }
  return includesTerm(row.detail, "uwag") || includesTerm(row.detail, "zachowan");
};

export default function SchoolmasterPrivate() {
  const demoBuildTag = "2025-01-24-04";
  const [practiceFilter, setPracticeFilter] = useState("ALL");
  const [lastUpdate, setLastUpdate] = useState(() => new Date());
  const [riskRows, setRiskRows] = useState<RiskRow[]>(() => buildRiskRows());
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoStudent, setDemoStudent] = useState<PracticeRow | null>(null);
  const [demoSection, setDemoSection] = useState<DemoSection>("overview");
  const [demoQuickFilter, setDemoQuickFilter] = useState<DemoQuickFilter>("all");
  const [demoSearch, setDemoSearch] = useState("");
  const [demoSelectedClass, setDemoSelectedClass] = useState<string | null>(null);
  const [demoNotice, setDemoNotice] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      setRiskRows(buildRiskRows());
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!demoNotice) {
      return;
    }
    const timer = setTimeout(() => setDemoNotice(null), 2600);
    return () => clearTimeout(timer);
  }, [demoNotice]);

  const visiblePracticeRows =
    practiceFilter === "ALL"
      ? practiceRows
      : practiceRows.filter((row) => row.status === practiceFilter);
  const totalAtRisk = riskRows.reduce((sum, row) => sum + row.count, 0);
  const selectedStudent = demoStudent ?? practiceRows[0];
  const attendanceScale = { min: 60, max: 100 };
  const attendanceSeries = demoAttendanceTrend.map((point, index, all) => {
    const prevValue = index > 0 ? all[index - 1].value : null;
    const delta = prevValue === null ? null : point.value - prevValue;
    const trend =
      delta === null ? "start" : delta >= 3 ? "up" : delta <= -3 ? "down" : "flat";
    return {
      ...point,
      delta,
      barClass:
        trend === "up"
          ? "bg-emerald-400"
          : trend === "down"
            ? "bg-rose-400"
            : "bg-indigo-300",
      deltaClass:
        trend === "up"
          ? "text-emerald-600"
          : trend === "down"
            ? "text-rose-600"
            : "text-slate-500",
      deltaLabel: delta === null ? "—" : `${delta > 0 ? "+" : ""}${delta} pp`,
    };
  });
  const attendanceChange =
    attendanceSeries.length > 1
      ? attendanceSeries[attendanceSeries.length - 1].value - attendanceSeries[0].value
      : 0;
  const attendanceTrendTextClass =
    attendanceChange >= 3 ? "text-emerald-600" : attendanceChange <= -3 ? "text-rose-600" : "text-slate-500";
  const attendanceChangeLabel = `${attendanceChange > 0 ? "+" : ""}${attendanceChange} pp`;
  const showQuickFilters = demoSection === "risk" || demoSection === "classes" || demoSection === "students";
  const activeQuickFilter = showQuickFilters ? demoQuickFilter : "all";
  const normalizedSearch = demoSearch.trim().toLowerCase();
  const filteredDemoStudents = practiceRows
    .filter((row) => matchesQuickFilter(row, activeQuickFilter))
    .filter((row) => {
    if (!normalizedSearch) {
      return true;
    }
    return (
      row.name.toLowerCase().includes(normalizedSearch) ||
      row.className.toLowerCase().includes(normalizedSearch)
    );
  });
  const filteredDemoClasses = demoClassList.filter((row) => matchesClassQuickFilter(row, activeQuickFilter));
  const demoClassesEmpty = filteredDemoClasses.length === 0;
  const demoStudentsEmpty = filteredDemoStudents.length === 0;
  const studentsViewStudent =
    demoStudentsEmpty
      ? null
      : demoStudent && filteredDemoStudents.some((row) => row.name === demoStudent.name)
        ? demoStudent
        : filteredDemoStudents[0];
  const fallbackClassName = demoClassList[0]?.label.replace("Klasa ", "") ?? "";
  const filteredFallbackClassName = filteredDemoClasses[0]?.label.replace("Klasa ", "") ?? fallbackClassName;
  const activeClassName =
    demoClassesEmpty
      ? ""
      : demoSelectedClass && filteredDemoClasses.some((row) => row.label === `Klasa ${demoSelectedClass}`)
        ? demoSelectedClass
        : filteredFallbackClassName;
  const selectedClassRow =
    demoClassesEmpty
      ? null
      : filteredDemoClasses.find((row) => row.label === `Klasa ${activeClassName}`) ?? filteredDemoClasses[0];
  const studentsInSelectedClass = demoClassesEmpty
    ? []
    : practiceRows.filter((row) => row.className === activeClassName);

  const openDemo = (student?: PracticeRow | null, section: DemoSection = "overview") => {
    setDemoStudent(student ?? null);
    setDemoSelectedClass(student?.className ?? null);
    setDemoSection(section);
    setDemoQuickFilter("all");
    setDemoSearch("");
    setDemoOpen(true);
  };

  const openDemoForClass = (label: string) => {
    const className = label.replace("Klasa ", "");
    const matchingStudent = practiceRows.find((row) => row.className === className) ?? null;
    setDemoSelectedClass(className);
    setDemoStudent(matchingStudent);
    setDemoSection("classes");
    setDemoQuickFilter("all");
    setDemoSearch("");
    setDemoOpen(true);
  };

  const selectDemoStudent = (student: PracticeRow) => {
    setDemoStudent(student);
    setDemoSelectedClass(student.className);
  };

  const selectDemoClass = (label: string) => {
    const className = label.replace("Klasa ", "");
    const matchingStudent = practiceRows.find((row) => row.className === className) ?? null;
    setDemoSelectedClass(className);
    if (matchingStudent) {
      setDemoStudent(matchingStudent);
    }
  };

  return (
    <div className="schoolmaster-private min-h-screen bg-[color:var(--sm-color-background)] text-[color:var(--sm-color-text-primary)]">
      <header className="relative overflow-hidden sm-bg-hero text-[color:var(--sm-color-on-primary)]">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-24 right-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-white/10 blur-3xl"></div>
        </div>
        <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <Link href="/">
            <div className="flex cursor-pointer items-center gap-3">
              <img
                src={SchoolMasterLogo}
                alt="SchoolMaster"
                className="h-8 brightness-0 invert"
              />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">SchoolMaster</p>
                <p className="text-sm font-semibold">For Private</p>
              </div>
            </div>
          </Link>
          <div className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a className="text-white/80 hover:text-white" href="#dla-kogo">Dla kogo</a>
            <a className="text-white/80 hover:text-white" href="#system">Jak działa</a>
            <a className="text-white/80 hover:text-white" href="#koszt">Koszt</a>
            <Button asChild size="sm" className="bg-[color:var(--sm-color-on-primary)] text-[color:var(--sm-color-primary-900)] hover:bg-[color:var(--sm-color-white-90)]">
              <a href="#kontakt">Umów rozmowę</a>
            </Button>
          </div>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-6 pb-16 pt-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Badge className="bg-white/10 text-white hover:bg-white/20">System wczesnego ostrzegania</Badge>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-white md:text-5xl">
              ASYSTENT STREFY ZAGROŻENIA DLA SZKÓŁ PRYWATNYCH
            </h1>
            <p className="mt-4 text-lg text-white/80">
              System, który łączy oceny, frekwencję i zachowanie w jeden czytelny obraz ryzyka.
              Dla wychowawców i dyrekcji, którzy chcą reagować wcześniej, a nie po fakcie.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-[color:var(--sm-color-on-primary)] text-[color:var(--sm-color-primary-900)] hover:bg-[color:var(--sm-color-white-90)]">
                <a href="#kontakt">
                  Porozmawiajmy o pilotażu
                  <ArrowRight className="ml-2" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/50 bg-transparent text-white hover:bg-white/10 hover:text-white"
                type="button"
                onClick={() => openDemo()}
              >
                Zobacz jak to wygląda
              </Button>
            </div>
          </div>
          <div
            role="button"
            tabIndex={0}
            aria-label="Otwórz demo panelu"
            onClick={() => openDemo()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openDemo();
              }
            }}
            className="cursor-pointer rounded-3xl border border-white/15 bg-white/10 p-6 text-left sm-shadow-2 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">Centrum Strefy Zagrożenia</p>
                <p className="text-sm text-white/70">Szybki podgląd sytuacji w szkole</p>
              </div>
              <div className="rounded-2xl bg-white/15 px-4 py-2 text-center">
                <p className="text-xs uppercase tracking-widest text-white/70">Dzisiaj</p>
                <p className="text-2xl font-bold">{totalAtRisk}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3 rounded-2xl bg-white p-4 text-navy-900 sm-shadow-1">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>Uczniowie w strefie ryzyka</span>
                <span className="rounded-full bg-navy-50 px-3 py-1 text-xs text-navy-700">
                  Aktualizacja: {formatTime(lastUpdate)}
                </span>
              </div>
              <div className="space-y-3">
                {riskRows.map((row) => (
                  <button
                    key={row.label}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      openDemoForClass(row.label);
                    }}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-100 px-4 py-3 text-left transition hover:border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <div>
                      <p className="text-sm font-semibold">{row.label}</p>
                      <p className="text-xs text-slate-500">{row.detail}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${row.badge}`}>{row.status}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <section id="dla-kogo" className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-3xl font-bold">Dla kogo</h2>
            <p className="mt-3 text-lg text-slate-600">
              Dla szkół, które chcą mieć prostą „lampkę kontrolną” i szybciej wychwytywać uczniów wymagających wsparcia.
            </p>
            <div className="mt-6 grid gap-4">
              {audiencePoints.map((point) => (
                <div key={point} className="grid grid-cols-[24px_1fr] items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 translate-y-[2px] text-emerald-500" />
                  <p className="text-slate-700 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
          <Card className="border-0 bg-white shadow-xl">
            <CardContent className="space-y-4 p-8">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-indigo-500" />
                <p className="text-lg font-semibold text-slate-900">Najważniejszy efekt</p>
              </div>
              <p className="text-slate-600">
                Decyzje wychowawcze i organizacyjne podejmowane są wcześniej, bo system pokazuje kto i dlaczego wymaga
                pilnej uwagi. Mniej przypadków, które „giną w natłoku danych”.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Szybka diagnoza</p>
                  <p className="text-xl font-bold text-slate-900">1 klik</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Raport na radę</p>
                  <p className="text-xl font-bold text-slate-900">gotowy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="problem" className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="text-3xl font-bold">Na czym polega problem</h2>
              <p className="mt-3 text-lg text-slate-600">
                E-dziennik pokazuje oceny, frekwencję i uwagi. W praktyce brakuje szybkiego, jednoznacznego obrazu ryzyka.
              </p>
              <div className="mt-6 space-y-4">
                {problemPoints.map((point) => (
                  <div key={point} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <TrendingDown className="mt-1 h-5 w-5 text-rose-500" />
                    <p className="text-slate-700">{point}</p>
                  </div>
                ))}
              </div>
            </div>
            <Card className="border-0 sm-bg-card-gradient shadow-xl">
              <CardContent className="space-y-6 p-8">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-indigo-500" />
                  <p className="text-lg font-semibold text-slate-900">Brakuje prostego widoku</p>
                </div>
                <div className="space-y-4">
                  {[
                    "Ilu uczniów jest realnie zagrożonych nieklasyfikowaniem?",
                    "W których klasach ryzyko rośnie, a gdzie spada?",
                    "Które sygnały wymagają natychmiastowej reakcji?",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <AlertTriangle className="mt-1 h-4 w-4 text-amber-500" />
                      <p className="text-slate-600">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white/80 p-4">
                  <p className="text-xs uppercase tracking-widest text-slate-400">Migawka sygnałów</p>
                  <div className="mt-3 space-y-3">
                    {problemSnapshot.map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">{item.label}</span>
                          <span className={`font-semibold ${item.text}`}>{item.value}</span>
                        </div>
                        <div className="mt-2 h-1.5 rounded-full bg-slate-100">
                          <div className={`h-1.5 rounded-full ${item.bar}`} style={{ width: `${item.width}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
                    <span className="h-2 w-2 rounded-full bg-indigo-400" />
                    Priorytet: szybka reakcja w 3 klasach
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="system" className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Co robi system</h2>
            <p className="mt-3 text-lg text-slate-600">
              Zamienia rozproszone dane w czytelny, aktualny obraz stref ryzyka.
            </p>
          </div>
          <Badge className="bg-indigo-100 text-indigo-700">4 kluczowe kroki</Badge>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {systemSteps.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.title} className="border-0 bg-white shadow-xl">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-indigo-50 p-3">
                      <Icon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <p className="text-lg font-semibold text-slate-900">{step.title}</p>
                  </div>
                  <p className="text-slate-600">{step.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="praktyka" className="bg-slate-100 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold">Jak to wygląda w praktyce</h2>
              <p className="mt-3 text-lg text-slate-600">
                Wychowawca widzi listę uczniów z kolorami stref i jasnym powodem ryzyka.
              </p>
              <p className="mt-2 text-sm text-slate-500">Kliknij ucznia, aby otworzyć demo systemu.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-white px-2 py-2 shadow">
                {practiceFilters.map((filter) => {
                  const isActive = practiceFilter === filter.value;
                  return (
                    <button
                      key={filter.value}
                      type="button"
                      onClick={() => setPracticeFilter(filter.value)}
                      aria-pressed={isActive}
                      className={`rounded-full px-4 py-1 text-xs font-semibold transition ${
                        isActive
                          ? `${filter.activeClass} shadow-sm`
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <Card className="mt-8 border-0 bg-white sm-shadow-2">
            <CardContent className="divide-y divide-slate-100 p-0">
              {visiblePracticeRows.map((row) => (
                <button
                  key={row.name}
                  type="button"
                  onClick={() => openDemo(row, "students")}
                  className="flex w-full items-center justify-between gap-4 px-8 py-5 text-left transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-3 w-3 rounded-full ${row.status === "CZERWONA" ? "bg-red-500" : row.status === "ŻÓŁTA" ? "bg-amber-400" : "bg-emerald-400"}`}></div>
                    <div>
                      <p className="font-semibold text-slate-900">{row.name}</p>
                      <p className="text-sm text-slate-500">Klasa {row.className} • {row.reason}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${row.badge}`}>{row.status}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
        <Dialog
          open={demoOpen}
          onOpenChange={(isOpen) => {
            setDemoOpen(isOpen);
            if (!isOpen) {
              setDemoStudent(null);
              setDemoSelectedClass(null);
              setDemoSearch("");
              setDemoQuickFilter("all");
              setDemoSection("overview");
              setDemoNotice(null);
            }
          }}
        >
          <DialogContent
            className="schoolmaster-private max-w-6xl w-[96vw] sm:w-[94vw] lg:w-[90vw] h-[92vh] overflow-hidden p-0"
            data-demo-build={demoBuildTag}
          >
            <div className="flex h-full flex-col">
              <div className="border-b border-slate-200 bg-white px-6 py-5">
                <DialogHeader>
                  <DialogTitle>Demo SchoolMaster</DialogTitle>
                  <DialogDescription>
                    Pełny podgląd panelu z przykładowymi danymi i widokiem ucznia.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Live
                    </span>
                    <span>Aktualizacja: {formatTime(lastUpdate)}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      Szkoła: Prywatna 04
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-200"
                      onClick={() => setDemoNotice("Raport PDF wygenerowany (demo).")}
                    >
                      Eksport PDF
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[color:var(--sm-color-primary-900)] text-[color:var(--sm-color-on-primary)] hover:bg-[color:var(--sm-color-primary-900-90)]"
                      onClick={() => setDemoNotice("Alert został zapisany i przypisany do wychowawcy (demo).")}
                    >
                      Utwórz alert
                    </Button>
                  </div>
                </div>
                {demoNotice ? (
                  <div
                    className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700"
                    aria-live="polite"
                  >
                    {demoNotice}
                  </div>
                ) : null}
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto bg-slate-50 p-6">
                <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
                  <aside className="space-y-4">
                    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                      <p className="text-xs uppercase tracking-widest text-slate-400">Nawigacja</p>
                      <div className="mt-4 space-y-2">
                        {demoNavItems.map((item) => {
                          const isActive = demoSection === item.id;
                          return (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => setDemoSection(item.id as DemoSection)}
                            className={`flex w-full min-w-0 items-center justify-between gap-2 rounded-2xl px-3 py-2 text-sm font-semibold transition ${
                              isActive
                                ? "bg-[color:var(--sm-color-primary-900)] text-[color:var(--sm-color-on-primary)]"
                                : "text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
                            {isActive ? (
                              <span className="hidden shrink-0 rounded-full bg-white/15 px-2 py-0.5 text-[10px] uppercase tracking-widest sm:inline-flex">
                                aktywny
                              </span>
                            ) : null}
                          </button>
                        );
                        })}
                      </div>
                    </div>
                    {showQuickFilters ? (
                      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="text-xs uppercase tracking-widest text-slate-400">Szybkie filtry</p>
                        <div className="mt-3 space-y-2">
                          {demoQuickFilters.map((filter) => {
                            const isActive = demoQuickFilter === filter.id;
                            return (
                            <button
                              key={filter.label}
                              type="button"
                              onClick={() => setDemoQuickFilter(filter.id as DemoQuickFilter)}
                              className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm transition ${
                                isActive
                                  ? "bg-indigo-50 text-indigo-700"
                                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              <span>{filter.label}</span>
                              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                isActive
                                  ? "bg-[color:var(--sm-color-primary-900)] text-[color:var(--sm-color-on-primary)]"
                                  : "bg-[color:var(--sm-color-neutral-200)] text-[color:var(--sm-color-neutral-600)]"
                              }`}>
                                {filter.value}
                              </span>
                            </button>
                          );
                          })}
                        </div>
                      </div>
                    ) : null}
                  </aside>
                  <div className="space-y-6">
                    {demoSection === "overview" ? (
                      <>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      {demoKpis.map((kpi) => (
                        <div key={kpi.label} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                          <p className="text-xs uppercase tracking-widest text-slate-400">{kpi.label}</p>
                          <p className="mt-3 text-2xl font-bold text-slate-900">{kpi.value}</p>
                          <p className="text-xs text-slate-500">{kpi.note}</p>
                        </div>
                      ))}
                      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="text-xs uppercase tracking-widest text-slate-400">Nowe alerty</p>
                        <p className="mt-3 text-2xl font-bold text-slate-900">5</p>
                        <p className="text-xs text-slate-500">w ciągu 7 dni</p>
                      </div>
                    </div>
                    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">Rozkład ryzyka</p>
                            <p className="text-xs text-slate-500">Ostatnie 30 dni</p>
                          </div>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            32 alerty
                          </span>
                        </div>
                        <div className="mt-4 space-y-3">
                          {demoRiskAreas.map((area) => (
                            <div key={area.label}>
                              <div className="flex items-center justify-between text-sm text-slate-700">
                                <span>{area.label}</span>
                                <span>{area.value}%</span>
                              </div>
                              <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                                <div className={`h-2 rounded-full ${area.color}`} style={{ width: `${area.value}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-semibold text-slate-900">Najświeższe alerty</p>
                        <div className="mt-3 space-y-2">
                          {demoSignals.map((signal) => (
                            <div key={signal.label} className="rounded-2xl border border-slate-100 px-3 py-2">
                              <p className="text-sm font-semibold text-slate-800">{signal.label}</p>
                              <p className="text-xs text-slate-500">{signal.detail}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Frekwencja miesiąc do miesiąca</p>
                          <p className="text-xs text-slate-500">Średnia szkoły</p>
                        </div>
                        <span className={`text-right text-xs font-semibold ${attendanceTrendTextClass}`}>
                          Zmiana semestralna
                          <span className="mt-0.5 block text-sm font-semibold">{attendanceChangeLabel}</span>
                        </span>
                      </div>
                      <div className="relative mt-4">
                        <div className="flex items-end gap-2">
                          {attendanceSeries.map((point) => (
                            <div key={point.month} className="flex-1">
                              <div className="h-24 rounded-2xl bg-slate-100 p-1">
                                <div className="flex h-full items-end">
                                  <div
                                    className={`w-full rounded-2xl ${point.barClass}`}
                                    style={{
                                      height: `${getBarHeight(point.value, attendanceScale.min, attendanceScale.max, 12)}%`,
                                    }}
                                  />
                                </div>
                              </div>
                              <p className="mt-2 text-center text-xs text-slate-500">{point.month}</p>
                              <p className="text-center text-xs font-semibold text-slate-700">{point.value}%</p>
                              <p className={`text-center text-[10px] ${point.deltaClass}`}>{point.deltaLabel}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-slate-900">Klasy w ryzyku</p>
                          <span className="text-xs text-slate-500">kliknij klasę</span>
                        </div>
                        <div className="mt-3 space-y-2">
                          {demoClassesEmpty ? (
                            <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
                              Brak klas spełniających wybrany filtr.
                            </div>
                          ) : (
                            filteredDemoClasses.map((row) => {
                              const isActive = demoSelectedClass === row.label.replace("Klasa ", "");
                              return (
                                <button
                                  key={row.label}
                                  type="button"
                                  onClick={() => selectDemoClass(row.label)}
                                  className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left transition ${
                                    isActive
                                      ? "border-indigo-200 bg-indigo-50"
                                      : "border-slate-100 hover:border-slate-200"
                                  }`}
                                >
                                  <div>
                                    <p className="text-sm font-semibold text-slate-800">{row.label}</p>
                                    <p className="text-xs text-slate-500">{row.detail}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400">{row.count} uczniów</span>
                                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${row.badge}`}>{row.status}</span>
                                  </div>
                                </button>
                              );
                            })
                          )}
                        </div>
                      </div>
                      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="text-sm uppercase tracking-widest text-slate-400">Profil ucznia</p>
                            <p className="mt-1 text-lg font-semibold text-slate-900">
                              {selectedStudent?.name ?? "Wybrany uczeń"}
                            </p>
                            <p className="text-sm text-slate-500">
                              Klasa {selectedStudent?.className ?? "—"}
                            </p>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${selectedStudent?.badge ?? "bg-slate-100 text-slate-600"}`}>
                            {selectedStudent?.status ?? "BRAK"}
                          </span>
                        </div>
                        <div className="mt-4 space-y-3">
                          <div className="rounded-2xl border border-slate-100 px-4 py-3">
                            <p className="text-xs uppercase tracking-widest text-slate-400">Powód ryzyka</p>
                            <p className="mt-2 text-sm text-slate-700">{selectedStudent?.reason ?? "Brak danych"}</p>
                          </div>
                          <div className="rounded-2xl border border-slate-100 px-4 py-3">
                            <p className="text-xs uppercase tracking-widest text-slate-400">Historia sygnałów</p>
                            <div className="mt-2 space-y-2 text-sm text-slate-600">
                              {demoTimeline.map((entry) => (
                                <div key={entry.detail} className="flex items-center justify-between">
                                  <span>{entry.detail}</span>
                                  <span className="text-xs text-slate-400">{entry.date}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="rounded-2xl border border-slate-100 px-4 py-3">
                            <p className="text-xs uppercase tracking-widest text-slate-400">Plan wsparcia</p>
                            <div className="mt-2 space-y-2 text-sm text-slate-600">
                              {demoActions.map((action) => (
                                <div key={action.label} className="flex items-center justify-between">
                                  <span>{action.label}</span>
                                  <span className="text-xs text-slate-400">{action.detail}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
                      To tylko demo widoku — realne dane pojawią się po integracji z e-dziennikiem.
                    </div>
                      </>
                    ) : null}
                    {demoSection === "risk" ? (
                      <>
                        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-semibold text-slate-900">Rozkład ryzyka</p>
                                <p className="text-xs text-slate-500">Ostatnie 30 dni</p>
                              </div>
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                32 alerty
                              </span>
                            </div>
                            <div className="mt-4 space-y-3">
                              {demoRiskAreas.map((area) => (
                                <div key={area.label}>
                                  <div className="flex items-center justify-between text-sm text-slate-700">
                                    <span>{area.label}</span>
                                    <span>{area.value}%</span>
                                  </div>
                                  <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                                    <div className={`h-2 rounded-full ${area.color}`} style={{ width: `${area.value}%` }} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-slate-900">Frekwencja miesiąc do miesiąca</p>
                                <p className="text-xs text-slate-500">Średnia szkoły</p>
                              </div>
                              <span className={`text-right text-xs font-semibold ${attendanceTrendTextClass}`}>
                                Zmiana semestralna
                                <span className="mt-0.5 block text-sm font-semibold">{attendanceChangeLabel}</span>
                              </span>
                            </div>
                            <div className="relative mt-4">
                              <div className="flex items-end gap-2">
                                {attendanceSeries.map((point) => (
                                  <div key={point.month} className="flex-1">
                                    <div className="h-24 rounded-2xl bg-slate-100 p-1">
                                      <div className="flex h-full items-end">
                                        <div
                                          className={`w-full rounded-2xl ${point.barClass}`}
                                          style={{
                                            height: `${getBarHeight(point.value, attendanceScale.min, attendanceScale.max, 12)}%`,
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <p className="mt-2 text-center text-xs text-slate-500">{point.month}</p>
                                    <p className="text-center text-xs font-semibold text-slate-700">{point.value}%</p>
                                    <p className={`text-center text-[10px] ${point.deltaClass}`}>{point.deltaLabel}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm font-semibold text-slate-900">Najświeższe alerty</p>
                            <div className="mt-3 space-y-2">
                              {demoSignals.map((signal) => (
                                <div key={signal.label} className="rounded-2xl border border-slate-100 px-3 py-2">
                                  <p className="text-sm font-semibold text-slate-800">{signal.label}</p>
                                  <p className="text-xs text-slate-500">{signal.detail}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-slate-900">Klasy wymagające uwagi</p>
                              <span className="text-xs text-slate-500">filtrowane</span>
                            </div>
                            <div className="mt-3 space-y-2">
                              {demoClassesEmpty ? (
                                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
                                  Brak klas spełniających wybrany filtr.
                                </div>
                              ) : (
                                filteredDemoClasses.map((row) => (
                                  <button
                                    key={row.label}
                                    type="button"
                                    onClick={() => selectDemoClass(row.label)}
                                    className="flex w-full items-center justify-between rounded-2xl border border-slate-100 px-3 py-2 text-left transition hover:border-slate-200"
                                  >
                                    <div>
                                      <p className="text-sm font-semibold text-slate-800">{row.label}</p>
                                      <p className="text-xs text-slate-500">{row.detail}</p>
                                    </div>
                                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${row.badge}`}>{row.status}</span>
                                  </button>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : null}
                    {demoSection === "classes" ? (
                      <>
                        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-slate-900">Lista klas</p>
                              <span className="text-xs text-slate-500">kliknij klasę</span>
                            </div>
                            <div className="mt-3 space-y-2">
                              {demoClassesEmpty ? (
                                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
                                  Brak klas spełniających wybrany filtr.
                                </div>
                              ) : (
                                filteredDemoClasses.map((row) => {
                                  const isActive = activeClassName === row.label.replace("Klasa ", "");
                                  return (
                                    <button
                                      key={row.label}
                                      type="button"
                                      onClick={() => selectDemoClass(row.label)}
                                      className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left transition ${
                                        isActive
                                          ? "border-indigo-200 bg-indigo-50"
                                          : "border-slate-100 hover:border-slate-200"
                                      }`}
                                    >
                                      <div>
                                        <p className="text-sm font-semibold text-slate-800">{row.label}</p>
                                        <p className="text-xs text-slate-500">{row.detail}</p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-400">{row.count} uczniów</span>
                                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${row.badge}`}>{row.status}</span>
                                      </div>
                                    </button>
                                  );
                                })
                              )}
                            </div>
                          </div>
                          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            {selectedClassRow ? (
                              <>
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div>
                                    <p className="text-sm uppercase tracking-widest text-slate-400">Podgląd klasy</p>
                                    <p className="mt-1 text-lg font-semibold text-slate-900">{selectedClassRow.label}</p>
                                    <p className="text-sm text-slate-500">{selectedClassRow.detail}</p>
                                  </div>
                                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${selectedClassRow.badge}`}>
                                    {selectedClassRow.status}
                                  </span>
                                </div>
                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                  <div className="rounded-2xl border border-slate-100 px-4 py-3">
                                    <p className="text-xs uppercase tracking-widest text-slate-400">Uczniowie w ryzyku</p>
                                    <p className="mt-2 text-2xl font-bold text-slate-900">{selectedClassRow.count}</p>
                                    <p className="text-xs text-slate-500">w tej klasie</p>
                                  </div>
                                  <div className="rounded-2xl border border-slate-100 px-4 py-3">
                                    <p className="text-xs uppercase tracking-widest text-slate-400">Frekwencja</p>
                                    <p className="mt-2 text-2xl font-bold text-slate-900">90%</p>
                                    <p className="text-xs text-slate-500">ostatnie 30 dni</p>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                                <div className="rounded-full bg-slate-50 p-3">
                                  <BarChart3 className="h-5 w-5 text-slate-400" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-slate-700">Brak danych klasy</p>
                                  <p className="mt-1 text-xs text-slate-500">
                                    Zmień filtr, aby zobaczyć podgląd klasy.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-slate-900">Uczniowie w klasie {activeClassName || "—"}</p>
                            <span className="text-xs text-slate-500">kliknij ucznia</span>
                          </div>
                          <div className="mt-3 space-y-2">
                            {studentsInSelectedClass.length === 0 ? (
                              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
                                Brak uczniów w tej klasie.
                              </div>
                            ) : (
                              studentsInSelectedClass.map((row) => {
                                const isActive = selectedStudent?.name === row.name;
                                return (
                                  <button
                                    key={row.name}
                                    type="button"
                                    onClick={() => selectDemoStudent(row)}
                                    className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left transition ${
                                      isActive
                                        ? "border-indigo-200 bg-indigo-50"
                                        : "border-slate-100 hover:border-slate-200"
                                    }`}
                                  >
                                    <div>
                                      <p className="text-sm font-semibold text-slate-800">{row.name}</p>
                                      <p className="text-xs text-slate-500">{row.reason}</p>
                                    </div>
                                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${row.badge}`}>{row.status}</span>
                                  </button>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </>
                    ) : null}
                    {demoSection === "students" ? (
                      <>
                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">Uczniowie w ryzyku</p>
                              <p className="text-xs text-slate-500">filtruj i wybieraj uczniów</p>
                            </div>
                            <div className="w-full max-w-xs">
                              <Input
                                value={demoSearch}
                                onChange={(event) => setDemoSearch(event.target.value)}
                                placeholder="Szukaj po imieniu lub klasie"
                                className="h-9"
                              />
                            </div>
                          </div>
                          <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                            <div className="space-y-2">
                              {demoStudentsEmpty ? (
                                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
                                  Brak uczniów spełniających kryteria.
                                </div>
                              ) : (
                                filteredDemoStudents.map((row) => {
                                  const isActive = studentsViewStudent?.name === row.name;
                                  return (
                                    <button
                                      key={row.name}
                                      type="button"
                                      onClick={() => selectDemoStudent(row)}
                                      className={`flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left transition ${
                                        isActive
                                          ? "border-indigo-200 bg-indigo-50"
                                          : "border-slate-100 hover:border-slate-200"
                                      }`}
                                    >
                                      <div>
                                        <p className="text-sm font-semibold text-slate-900">{row.name}</p>
                                        <p className="text-xs text-slate-500">Klasa {row.className} • {row.reason}</p>
                                      </div>
                                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${row.badge}`}>{row.status}</span>
                                    </button>
                                  );
                                })
                              )}
                            </div>
                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                              {studentsViewStudent ? (
                                <>
                                  <p className="text-xs uppercase tracking-widest text-slate-400">Profil ucznia</p>
                                  <p className="mt-2 text-lg font-semibold text-slate-900">{studentsViewStudent.name}</p>
                                  <p className="text-sm text-slate-500">Klasa {studentsViewStudent.className}</p>
                                  <div className="mt-4 space-y-3">
                                    <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
                                      <p className="text-xs uppercase tracking-widest text-slate-400">Powód ryzyka</p>
                                      <p className="mt-2 text-sm text-slate-700">{studentsViewStudent.reason}</p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
                                      <p className="text-xs uppercase tracking-widest text-slate-400">Frekwencja miesiąc do miesiąca</p>
                                      <div className="relative mt-3">
                                        <div className="flex items-end gap-2">
                                          {attendanceSeries.map((point) => (
                                            <div key={point.month} className="flex-1">
                                              <div className="h-16 rounded-xl bg-slate-100 p-1">
                                                <div className="flex h-full items-end">
                                                  <div
                                                    className={`w-full rounded-xl ${point.barClass}`}
                                                    style={{
                                                      height: `${getBarHeight(point.value, attendanceScale.min, attendanceScale.max, 10)}%`,
                                                    }}
                                                  />
                                                </div>
                                              </div>
                                              <p className="mt-1 text-center text-[11px] text-slate-500">{point.month}</p>
                                              <p className={`text-center text-[10px] ${point.deltaClass}`}>{point.deltaLabel}</p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
                                      <p className="text-xs uppercase tracking-widest text-slate-400">Plan wsparcia</p>
                                      <div className="mt-2 space-y-2 text-sm text-slate-600">
                                        {demoActions.map((action) => (
                                          <div key={action.label} className="flex items-center justify-between">
                                            <span>{action.label}</span>
                                            <span className="text-xs text-slate-400">{action.detail}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                                  <div className="rounded-full bg-white p-3 shadow-sm">
                                    <Users className="h-5 w-5 text-slate-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-slate-700">Brak ucznia do podglądu</p>
                                    <p className="mt-1 text-xs text-slate-500">
                                      Zmień filtr lub wyszukiwanie, aby zobaczyć profil.
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : null}
                    {demoSection === "reports" ? (
                      <>
                        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-slate-900">Raporty i podsumowania</p>
                                <p className="text-xs text-slate-500">zarządzaj raportami szkoły</p>
                              </div>
                              <Button
                                size="sm"
                                className="bg-[color:var(--sm-color-primary-900)] text-[color:var(--sm-color-on-primary)] hover:bg-[color:var(--sm-color-primary-900-90)]"
                                onClick={() => setDemoNotice("Nowy raport został dodany do kolejki (demo).")}
                              >
                                Generuj raport
                              </Button>
                            </div>
                            <div className="mt-4 space-y-2">
                              {demoReports.map((report) => (
                                <div key={report.title} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 px-4 py-3">
                                  <div>
                                    <p className="text-sm font-semibold text-slate-900">{report.title}</p>
                                    <p className="text-xs text-slate-500">Okres: {report.period}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${report.badge}`}>{report.status}</span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-slate-200"
                                      onClick={() => setDemoNotice(`Raport "${report.title}" pobrany (demo).`)}
                                    >
                                      Pobierz
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-slate-900">Frekwencja miesiąc do miesiąca</p>
                                <p className="text-xs text-slate-500">porównanie semestralne</p>
                              </div>
                              <span className={`text-right text-xs font-semibold ${attendanceTrendTextClass}`}>
                                Zmiana semestralna
                                <span className="mt-0.5 block text-sm font-semibold">{attendanceChangeLabel}</span>
                              </span>
                            </div>
                            <div className="relative mt-4">
                              <div className="flex items-end gap-2">
                                {attendanceSeries.map((point) => (
                                  <div key={point.month} className="flex-1">
                                    <div className="h-24 rounded-2xl bg-slate-100 p-1">
                                      <div className="flex h-full items-end">
                                        <div
                                          className={`w-full rounded-2xl ${point.barClass}`}
                                          style={{
                                            height: `${getBarHeight(point.value, attendanceScale.min, attendanceScale.max, 12)}%`,
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <p className="mt-2 text-center text-xs text-slate-500">{point.month}</p>
                                    <p className="text-center text-xs font-semibold text-slate-700">{point.value}%</p>
                                    <p className={`text-center text-[10px] ${point.deltaClass}`}>{point.deltaLabel}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
                          Raporty w demie są podglądem – eksporty nie zapisują danych w systemie.
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </section>

      <section id="koszt" className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-3xl font-bold">Koszt na poziomie jednego ucznia</h2>
            <p className="mt-3 text-lg text-slate-600">
              Docelowo koszt systemu ma być porównywalny z wartością jednego ucznia miesięcznie.
              Pierwszym szkołom pilota oferujemy korzystniejsze warunki w zamian za feedback i case study.
            </p>
          </div>
          <div className="grid gap-4">
            {pricing.map((tier) => (
              <Card key={tier.title} className="border-0 bg-white shadow-xl">
                <CardContent className="flex items-center justify-between gap-4 p-6">
                  <div>
                    <p className="text-sm uppercase tracking-widest text-slate-400">{tier.title}</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{tier.price}</p>
                    <p className="text-sm text-slate-500">{tier.note}</p>
                  </div>
                  <div className="rounded-2xl bg-indigo-50 p-4">
                    <Users className="h-6 w-6 text-indigo-500" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="kontakt" className="sm-bg-hero py-16 text-[color:var(--sm-color-on-primary)]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="text-3xl font-bold text-white">Czego potrzebujemy od Państwa</h2>
              <p className="mt-3 text-lg text-white/80">
                Jesteśmy na etapie projektowania systemu. Zależy nam na opinii dyrekcji i wychowawców.
              </p>
              <div className="mt-6 space-y-3">
                {questions.map((question) => (
                  <div key={question} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-300" />
                    <p className="text-white/85">{question}</p>
                  </div>
                ))}
              </div>
            </div>
            <Card className="border-0 bg-white/10 text-white sm-shadow-2">
              <CardContent className="space-y-6 p-8">
                <div>
                  <p className="text-sm uppercase tracking-widest text-white/60">Kontakt</p>
                  <p className="mt-2 text-2xl font-bold">Umówmy krótką rozmowę</p>
                  <p className="text-white/75">
                    20–30 minut online, aby lepiej poznać Państwa potrzeby.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-white/85">
                    <Mail className="h-5 w-5" />
                    <span>kontakt@schoolmaster.pl</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/85">
                    <FileText className="h-5 w-5" />
                    <span>Możliwość pilotażu i case study</span>
                  </div>
                </div>
                <Button asChild size="lg" className="w-full bg-[color:var(--sm-color-on-primary)] text-[color:var(--sm-color-primary-900)] hover:bg-[color:var(--sm-color-white-90)]">
                  <a href="mailto:kontakt@schoolmaster.pl">Napisz do nas</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-500 md:flex-row">
          <span>SchoolMaster for Private • System wczesnego ostrzegania</span>
          <span>© 2025 SchoolMaster</span>
        </div>
      </footer>
    </div>
  );
}
