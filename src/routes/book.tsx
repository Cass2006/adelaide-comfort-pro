import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  Snowflake, Flame, Wind, RotateCw, Wrench, Hammer, Home, ClipboardList,
  Calendar, Rocket, TriangleAlert, ArrowRight, ArrowLeft, PenSquare,
  MapPin, CalendarDays, User, Phone, MessageSquare, Mail, Camera,
  CheckCircle2, Check, ChevronLeft, ChevronRight, ChevronDown, Send,
  Shield, Timer, Award, Lock, DollarSign, Clock, X, Key, Loader2,
  Star, CalendarPlus, ScrewdriverWrench,
} from "lucide-react";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book HVAC Service | Adelaide HVAC Services" },
      { name: "description", content: "Schedule your Adelaide HVAC service online in under 2 minutes. Air conditioning, refrigeration & electrical — fast, easy, professional." },
      { property: "og:title", content: "Book HVAC Service | Adelaide HVAC Services" },
      { property: "og:description", content: "Schedule your Adelaide HVAC service online. Fast, easy, professional." },
      { property: "og:url", content: "/book" },
    ],
    links: [{ rel: "canonical", href: "/book" }],
  }),
  component: BookPage,
});

/* ── DATA ── */

const SERVICES = [
  { value: "air-conditioning", label: "Air Conditioning", Icon: Snowflake },
  { value: "heating", label: "Heating", Icon: Flame },
  { value: "ventilation", label: "Ventilation", Icon: Wind },
  { value: "heat-pump", label: "Heat Pump", Icon: RotateCw },
  { value: "refrigeration", label: "Refrigeration", Icon: Snowflake },
  { value: "electrical", label: "Electrical", Icon: Wrench },
  { value: "maintenance", label: "Maintenance", Icon: ScrewdriverWrench },
  { value: "new-installation", label: "New Installation", Icon: Home },
  { value: "inspection", label: "Inspection / Diagnosis", Icon: ClipboardList },
] as const;

const URGENCIES = [
  { value: "normal",    name: "Normal",         sub: "Schedule for a convenient date", Icon: Calendar,       accent: "cyan"   },
  { value: "today",     name: "Today",          sub: "Same-day service if available",  Icon: Rocket,         accent: "orange" },
  { value: "emergency", name: "Emergency 24/7", sub: "Immediate response anytime",     Icon: TriangleAlert,  accent: "red"    },
] as const;

const TIME_SLOTS = ["8:00–10:00", "10:00–12:00", "12:00–14:00", "14:00–16:00", "16:00–18:00", "Anytime"] as const;

type UrgencyValue = typeof URGENCIES[number]["value"];
type ContactMethod = "phone" | "sms" | "email";

interface Photo { id: string; url: string; name: string }

interface FormState {
  service: string;
  urgency: UrgencyValue;
  description: string;
  photos: Photo[];
  address: string;
  city: string;
  zip: string;
  accessNotes: string;
  date: Date | null;
  slot: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  contactMethod: ContactMethod;
}

const initialState: FormState = {
  service: "", urgency: "normal", description: "", photos: [],
  address: "", city: "", zip: "", accessNotes: "",
  date: null, slot: "",
  firstName: "", lastName: "", phone: "", email: "", contactMethod: "phone",
};

/* ── ROOT ── */

function BookPage() {
  return (
    <div className="min-h-screen bg-[#05131f] text-white">
      <BgCanvas />
      <SiteHeader />
      <Hero />
      <main className="relative mx-auto max-w-4xl px-4 pb-24 sm:px-6">
        <Wizard />
      </main>
      <TrustSection />
      <SiteFooter />
    </div>
  );
}

/* ── BACKGROUND / HEADER / HERO ── */

function BgCanvas() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(1200px 700px at 15% -10%, rgba(16,181,223,0.22), transparent 60%), radial-gradient(900px 600px at 100% 10%, rgba(10,37,64,0.6), transparent 60%), #05131f" }} />
      <div className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "34px 34px" }} />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary">
            <Snowflake className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="font-display text-xl tracking-wide text-white">ADELAIDE<span className="text-primary">HVAC</span></span>
        </Link>
        <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Available 24/7
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-5xl px-5 py-16 text-center sm:py-24">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          <Rocket className="h-3.5 w-3.5" /> Book in under 2 minutes
        </div>
        <h1 className="mt-6 font-display text-5xl leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[76px]">
          Schedule Your{" "}
          <span className="bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent">HVAC Service</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70">
          Expert technicians, on-time arrivals, transparent pricing. Book your appointment today.
        </p>
        <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <Stat value={<>5.0 <Star className="inline h-4 w-4 fill-current text-primary" /></>} label="Rated" />
          <Divider />
          <Stat value="500+" label="Jobs Done" />
          <Divider />
          <Stat value="15 min" label="Avg Response" />
        </div>
        <div className="mt-10 inline-flex flex-col items-center gap-1 text-xs uppercase tracking-widest text-white/50">
          Begin Booking
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-2xl text-white">{value}</div>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-white/50">{label}</div>
    </div>
  );
}
function Divider() { return <span className="hidden h-8 w-px bg-white/10 sm:block" />; }

/* ── WIZARD ── */

const STEPS = ["Service", "Details", "Location", "Schedule", "Contact", "Review"] as const;

function Wizard() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) => setState((s) => ({ ...s, [key]: val }));

  const canAdvance = useMemo(() => {
    switch (step) {
      case 0: return !!state.service;
      case 1: return true;
      case 2: return !!state.address && !!state.city && !!state.zip;
      case 3: return !!state.date && !!state.slot;
      case 4: return !!state.firstName && !!state.lastName && !!state.phone && /\S+@\S+\.\S+/.test(state.email);
      default: return true;
    }
  }, [step, state]);

  const next = () => canAdvance && setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const submit = () => {
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setConfirmed(true); }, 1400);
  };
  const reset = () => { setState(initialState); setStep(0); setConfirmed(false); };

  if (confirmed) return <Success state={state} onReset={reset} />;

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      <ProgressBar step={step} />
      <div className="p-6 sm:p-10">
        {step === 0 && <Step1 state={state} set={set} />}
        {step === 1 && <Step2 state={state} set={set} />}
        {step === 2 && <Step3 state={state} set={set} />}
        {step === 3 && <Step4 state={state} set={set} />}
        {step === 4 && <Step5 state={state} set={set} />}
        {step === 5 && <Step6 state={state} />}

        <StepNav
          step={step}
          isLast={step === STEPS.length - 1}
          canAdvance={canAdvance}
          submitting={submitting}
          onBack={back}
          onNext={next}
          onSubmit={submit}
        />
      </div>
    </div>
  );
}

function ProgressBar({ step }: { step: number }) {
  const pct = ((step + 1) / STEPS.length) * 100;
  return (
    <div className="border-b border-white/5 bg-black/20 px-6 py-5 sm:px-10">
      <div className="mb-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">
        <span>Step {step + 1} of {STEPS.length}</span>
        <span className="text-primary">{STEPS[step]}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-300 transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-3 hidden justify-between text-[10px] font-semibold uppercase tracking-wider text-white/40 sm:flex">
        {STEPS.map((s, i) => (
          <span key={s} className={i <= step ? "text-primary" : ""}>{s}</span>
        ))}
      </div>
    </div>
  );
}

function StepHeader({ Icon, title, desc }: { Icon: typeof Snowflake; title: string; desc: string }) {
  return (
    <div className="mb-8 text-center sm:text-left">
      <div className="mb-3 inline-grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <h2 className="font-display text-3xl text-white sm:text-4xl">{title}</h2>
      <p className="mt-1 text-sm text-white/60">{desc}</p>
    </div>
  );
}

function StepNav({ step, isLast, canAdvance, submitting, onBack, onNext, onSubmit }: {
  step: number; isLast: boolean; canAdvance: boolean; submitting: boolean;
  onBack: () => void; onNext: () => void; onSubmit: () => void;
}) {
  return (
    <div className={`mt-10 flex items-center gap-3 ${step === 0 ? "justify-end" : "justify-between"}`}>
      {step > 0 && (
        <button type="button" onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/5">
          <ArrowLeft className="h-4 w-4" /> {isLast ? "Edit" : "Back"}
        </button>
      )}
      {isLast ? (
        <button type="button" onClick={onSubmit} disabled={submitting}
          className="inline-flex items-center gap-2 rounded-full gradient-cta px-8 py-3.5 font-heading text-sm font-bold uppercase tracking-wider text-white shadow-cta transition-transform hover:scale-[1.02] disabled:opacity-70">
          {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          {submitting ? "Processing…" : "Confirm Booking"}
        </button>
      ) : (
        <button type="button" onClick={onNext} disabled={!canAdvance}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-heading text-sm font-bold uppercase tracking-wider text-secondary transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30">
          {step === 4 ? "Review Booking" : "Continue"} <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/* ── STEPS ── */

function Step1({ state, set }: { state: FormState; set: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  return (
    <>
      <StepHeader Icon={ScrewdriverWrench} title="What service do you need?" desc="Select the type of HVAC service required." />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {SERVICES.map(({ value, label, Icon }) => {
          const active = state.service === value;
          return (
            <button key={value} type="button" onClick={() => set("service", value)}
              className={`group relative flex flex-col items-center gap-3 rounded-2xl border p-5 text-center transition-all ${
                active ? "border-primary bg-primary/10 shadow-[0_0_0_1px_var(--brand),0_20px_40px_-20px_rgba(16,181,223,0.6)]" : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.05]"
              }`}
            >
              <Icon className={`h-7 w-7 transition-colors ${active ? "text-primary" : "text-white/70 group-hover:text-primary"}`} />
              <span className={`text-xs font-semibold ${active ? "text-primary" : "text-white/70"}`}>{label}</span>
              {active && (
                <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-primary text-secondary">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-10">
        <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-wider text-white/70">
          <Rocket className="h-4 w-4 text-primary" /> Urgency Level
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {URGENCIES.map(({ value, name, sub, Icon, accent }) => {
            const active = state.urgency === value;
            const color = accent === "orange" ? "255,107,53" : accent === "red" ? "239,68,68" : "16,181,223";
            return (
              <button key={value} type="button" onClick={() => set("urgency", value)}
                className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                  active ? "bg-white/[0.06]" : "border-white/10 bg-white/[0.02] hover:border-white/25"
                }`}
                style={active ? { borderColor: `rgb(${color})`, boxShadow: `0 0 0 1px rgb(${color}), 0 15px 30px -15px rgba(${color},0.5)` } : undefined}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg" style={{ background: `rgba(${color},0.15)`, color: `rgb(${color})` }}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <div className="font-heading text-sm font-bold text-white">{name}</div>
                  <div className="text-xs text-white/50">{sub}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

function Step2({ state, set }: { state: FormState; set: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [range, setRange] = useState<string>("—");
  const [equipmentAge, setAge] = useState("");
  const [propertySize, setSize] = useState("");
  const [complexity, setComplexity] = useState("");

  useEffect(() => {
    if (!equipmentAge || !propertySize || !complexity) { setRange("—"); return; }
    const base = { small: 180, medium: 320, large: 520 }[propertySize] ?? 250;
    const ageMult = { new: 1, mid: 1.2, old: 1.5 }[equipmentAge] ?? 1;
    const compMult = { low: 1, med: 1.4, high: 2 }[complexity] ?? 1;
    const low = Math.round(base * ageMult * compMult);
    const high = Math.round(low * 1.6);
    setRange(`$${low} – $${high} AUD`);
  }, [equipmentAge, propertySize, complexity]);

  const onPhotos = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const next: Photo[] = files.slice(0, 6).map((f) => ({ id: crypto.randomUUID(), url: URL.createObjectURL(f), name: f.name }));
    set("photos", [...state.photos, ...next].slice(0, 6));
    e.target.value = "";
  };
  const removePhoto = (id: string) => set("photos", state.photos.filter((p) => p.id !== id));

  return (
    <>
      <StepHeader Icon={PenSquare} title="Describe the issue" desc="Help us understand the problem so we can prepare the right tools." />

      <textarea
        value={state.description}
        onChange={(e) => set("description", e.target.value)}
        rows={5}
        placeholder="What's happening? When did it start? Any unusual sounds or smells?"
        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white placeholder:text-white/30 transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
      />

      {/* Budget Estimator */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <button type="button" onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center gap-4 p-5 text-left">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
            <DollarSign className="h-5 w-5" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-heading text-sm font-bold text-white">Budget Estimator</div>
            <div className="text-xs text-white/50">Get a rough idea of the cost (optional)</div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/70">
            {expanded ? "Collapse" : "Expand"} <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </span>
        </button>
        {expanded && (
          <div className="border-t border-white/5 p-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <Select label="Property Size" value={propertySize} onChange={setSize} options={[["small","Small (< 100m²)"],["medium","Medium (100–250m²)"],["large","Large (> 250m²)"]]} />
              <Select label="Equipment Age" value={equipmentAge} onChange={setAge} options={[["new","New (< 3 yrs)"],["mid","Mid (3–10 yrs)"],["old","Old (> 10 yrs)"]]} />
              <Select label="Complexity" value={complexity} onChange={setComplexity} options={[["low","Low"],["med","Medium"],["high","High"]]} />
            </div>
            <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-5 text-center">
              <div className="font-display text-3xl text-primary">{range}</div>
              <div className="mt-1 text-xs text-white/60">Estimated price range. Final quote given after on-site inspection.</div>
              <button type="button" className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary hover:underline">
                Schedule a visit for a definitive quote <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Photo Upload */}
      <div className="mt-6">
        <label htmlFor="photoInput"
          className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] p-8 text-center transition-all hover:border-primary hover:bg-primary/5">
          <Camera className="h-8 w-8 text-primary" />
          <div>
            <div className="text-sm font-bold text-white">Upload photos of the equipment or issue</div>
            <div className="mt-0.5 text-xs text-white/50">PNG, JPG, HEIC — up to 6 photos</div>
          </div>
          <span className="rounded-full bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-secondary">Choose Photos</span>
          <input id="photoInput" type="file" accept="image/*" multiple className="hidden" onChange={onPhotos} />
        </label>

        {state.photos.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {state.photos.map((p) => (
              <div key={p.id} className="group relative overflow-hidden rounded-xl border border-white/10 bg-black">
                <img src={p.url} alt={p.name} className="h-24 w-full object-cover" />
                <button type="button" onClick={() => removePhoto(p.id)}
                  className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100" aria-label="Remove">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string,string][] }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-heading text-[11px] font-bold uppercase tracking-wider text-white/60">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20">
        <option value="">Select…</option>
        {options.map(([v, l]) => <option key={v} value={v} className="bg-secondary">{l}</option>)}
      </select>
    </label>
  );
}

function Step3({ state, set }: { state: FormState; set: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  return (
    <>
      <StepHeader Icon={MapPin} title="Service Location" desc="Where should we send the technician?" />
      <div className="grid gap-4">
        <Input label="Street Address" value={state.address} onChange={(v) => set("address", v)} required />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Suburb / City" value={state.city} onChange={(v) => set("city", v)} required />
          <Input label="Postcode" value={state.zip} onChange={(v) => set("zip", v)} required />
        </div>
        <label className="block">
          <span className="mb-1.5 block font-heading text-[11px] font-bold uppercase tracking-wider text-white/60">Access Notes (Optional)</span>
          <textarea value={state.accessNotes} onChange={(e) => set("accessNotes", e.target.value)} rows={3}
            placeholder="Gate code, parking, pets, entry instructions…"
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20" />
        </label>
      </div>
    </>
  );
}

function Input({ label, value, onChange, required, type = "text", prefix: Prefix }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string; prefix?: typeof Phone;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-heading text-[11px] font-bold uppercase tracking-wider text-white/60">
        {label}{required && <span className="text-[#FF6B35]"> *</span>}
      </span>
      <div className="relative">
        {Prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary">
            <Prefix className="h-4 w-4" />
          </span>
        )}
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-lg border border-white/10 bg-white/[0.04] py-3 text-sm text-white placeholder:text-white/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 ${Prefix ? "pl-10 pr-4" : "px-4"}`} />
      </div>
    </label>
  );
}

function Step4({ state, set }: { state: FormState; set: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  return (
    <>
      <StepHeader Icon={CalendarDays} title="Pick a Date & Time Slot" desc="Choose your preferred appointment window." />
      <MiniCalendar value={state.date} onChange={(d) => set("date", d)} />
      <div className="mt-8">
        <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-wider text-white/70">
          <Clock className="h-4 w-4 text-primary" /> Preferred Time Window
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {TIME_SLOTS.map((s) => {
            const active = state.slot === s;
            return (
              <button key={s} type="button" onClick={() => set("slot", s)}
                className={`rounded-xl border py-3 text-sm font-semibold transition-all ${
                  active ? "border-primary bg-primary/15 text-primary shadow-[0_0_0_1px_var(--brand)]" : "border-white/10 bg-white/[0.02] text-white/70 hover:border-white/25"
                }`}>
                {s}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

function MiniCalendar({ value, onChange }: { value: Date | null; onChange: (d: Date) => void }) {
  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);
  const [view, setView] = useState<Date>(() => { const d = new Date(); d.setDate(1); return d; });

  const monthName = view.toLocaleDateString("en-AU", { month: "long", year: "numeric" });
  const first = new Date(view.getFullYear(), view.getMonth(), 1);
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const startDay = first.getDay();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(view.getFullYear(), view.getMonth(), d));

  const change = (delta: number) => setView((v) => new Date(v.getFullYear(), v.getMonth() + delta, 1));

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={() => change(-1)} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-white/70 hover:bg-white/5" aria-label="Prev month">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="font-heading text-base font-bold text-white">{monthName}</div>
        <button type="button" onClick={() => change(1)} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-white/70 hover:bg-white/5" aria-label="Next month">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-wider text-white/40">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <span key={d}>{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((c, i) => {
          if (!c) return <span key={i} />;
          const past = c < today;
          const selected = value?.toDateString() === c.toDateString();
          const isToday = c.toDateString() === today.toDateString();
          return (
            <button key={i} type="button" disabled={past} onClick={() => onChange(c)}
              className={`aspect-square rounded-lg text-sm font-semibold transition-all ${
                past ? "cursor-not-allowed text-white/20" :
                selected ? "bg-primary text-secondary shadow-[0_10px_25px_-10px_rgba(16,181,223,0.8)]" :
                isToday ? "border border-primary/50 text-primary hover:bg-primary/10" :
                "text-white/80 hover:bg-white/5"
              }`}>
              {c.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Step5({ state, set }: { state: FormState; set: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  const methods: { value: ContactMethod; label: string; Icon: typeof Phone }[] = [
    { value: "phone", label: "Phone", Icon: Phone },
    { value: "sms",   label: "SMS",   Icon: MessageSquare },
    { value: "email", label: "Email", Icon: Mail },
  ];
  return (
    <>
      <StepHeader Icon={User} title="Your Contact Info" desc="We'll use this to confirm your appointment." />
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="First Name" value={state.firstName} onChange={(v) => set("firstName", v)} required />
          <Input label="Last Name"  value={state.lastName}  onChange={(v) => set("lastName", v)}  required />
        </div>
        <Input label="Phone Number"  value={state.phone} onChange={(v) => set("phone", v)} required type="tel"   prefix={Phone} />
        <Input label="Email Address" value={state.email} onChange={(v) => set("email", v)} required type="email" prefix={Mail} />

        <div>
          <span className="mb-1.5 block font-heading text-[11px] font-bold uppercase tracking-wider text-white/60">Preferred Contact Method</span>
          <div className="grid grid-cols-3 gap-3">
            {methods.map(({ value, label, Icon }) => {
              const active = state.contactMethod === value;
              return (
                <button key={value} type="button" onClick={() => set("contactMethod", value)}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg border py-3 text-sm font-semibold transition-all ${
                    active ? "border-primary bg-primary/15 text-primary" : "border-white/10 bg-white/[0.02] text-white/70 hover:border-white/25"
                  }`}>
                  <Icon className="h-4 w-4" /> {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

function Step6({ state }: { state: FormState }) {
  const service = SERVICES.find((s) => s.value === state.service);
  const urgency = URGENCIES.find((u) => u.value === state.urgency);
  const dateStr = state.date
    ? state.date.toLocaleDateString("en-AU", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : "—";

  return (
    <>
      <StepHeader Icon={CheckCircle2} title="Review Your Booking" desc="Check the details and confirm your appointment." />
      <div className="grid gap-4">
        <SummarySection label="Service">
          <SummaryRow Icon={service?.Icon ?? Wrench} value={service?.label ?? "—"} />
          <div className="mt-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-white/80">
              {urgency && <urgency.Icon className="h-3.5 w-3.5 text-primary" />}
              {urgency?.name} Priority
            </span>
          </div>
        </SummarySection>

        <SummarySection label="Service Location">
          <SummaryRow Icon={MapPin} value={`${state.address}, ${state.city}, ${state.zip}`} />
          {state.accessNotes && <SummaryRow Icon={Key} value={state.accessNotes} muted />}
        </SummarySection>

        <SummarySection label="Appointment">
          <SummaryRow Icon={Calendar} value={dateStr} />
          <SummaryRow Icon={Clock} value={state.slot || "—"} />
        </SummarySection>

        <SummarySection label="Contact">
          <SummaryRow Icon={User} value={`${state.firstName} ${state.lastName}`} />
          <SummaryRow Icon={Phone} value={state.phone} />
          <SummaryRow Icon={Mail} value={state.email} />
          <SummaryRow Icon={MessageSquare} value={`Preferred: ${state.contactMethod}`} />
        </SummarySection>

        {state.photos.length > 0 && (
          <SummarySection label="Attached Photos">
            <div className="mt-2 flex flex-wrap gap-2">
              {state.photos.map((p) => (
                <img key={p.id} src={p.url} alt={p.name} className="h-16 w-16 rounded-lg border border-white/10 object-cover" />
              ))}
            </div>
          </SummarySection>
        )}
      </div>
    </>
  );
}

function SummarySection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-3 font-heading text-[11px] font-bold uppercase tracking-[0.2em] text-primary">{label}</div>
      {children}
    </div>
  );
}
function SummaryRow({ Icon, value, muted }: { Icon: typeof Phone; value: string; muted?: boolean }) {
  return (
    <div className="flex items-start gap-3 py-1">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <span className={`text-sm ${muted ? "text-white/60" : "text-white"}`}>{value}</span>
    </div>
  );
}

/* ── SUCCESS ── */

function Success({ state, onReset }: { state: FormState; onReset: () => void }) {
  const service = SERVICES.find((s) => s.value === state.service);
  const dateStr = state.date?.toLocaleDateString("en-AU", { weekday: "long", month: "long", day: "numeric" }) ?? "—";
  return (
    <div className="rounded-3xl border border-primary/20 bg-white/[0.04] p-10 text-center shadow-[0_30px_80px_-40px_rgba(16,181,223,0.5)] backdrop-blur-xl">
      <div className="relative mx-auto grid h-24 w-24 place-items-center">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
        <div className="relative grid h-24 w-24 place-items-center rounded-full bg-primary text-secondary shadow-brand">
          <Check className="h-12 w-12" strokeWidth={3} />
        </div>
      </div>
      <h2 className="mt-8 font-display text-4xl text-white">Booking Confirmed!</h2>
      <p className="mt-2 text-white/60">We've received your appointment request. You'll get a confirmation shortly.</p>

      <div className="mx-auto mt-8 max-w-md space-y-2 text-left">
        <SuccessRow Icon={ScrewdriverWrench} label="Service"     value={service?.label ?? "—"} />
        <SuccessRow Icon={Calendar}          label="Date"        value={dateStr} />
        <SuccessRow Icon={Clock}             label="Window"      value={state.slot || "—"} />
        <SuccessRow Icon={Phone}             label="We'll call"  value={state.phone || "you"} suffix="to confirm" />
      </div>

      <button type="button" onClick={onReset}
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/5">
        <CalendarPlus className="h-4 w-4" /> Book Another Appointment
      </button>
      <div className="mt-4">
        <Link to="/" className="text-xs font-semibold uppercase tracking-wider text-primary hover:underline">← Back to home</Link>
      </div>
    </div>
  );
}
function SuccessRow({ Icon, label, value, suffix }: { Icon: typeof Phone; label: string; value: string; suffix?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <Icon className="h-4 w-4 shrink-0 text-primary" />
      <span className="text-sm text-white/70">{label}: <strong className="text-white">{value}</strong>{suffix ? ` ${suffix}` : ""}</span>
    </div>
  );
}

/* ── TRUST + FOOTER ── */

function TrustSection() {
  const items = [
    { Icon: Shield, title: "Licensed & Insured", sub: "State-certified technicians" },
    { Icon: Timer,  title: "On-Time Guarantee",  sub: "Or we waive the service fee" },
    { Icon: Award,  title: "Satisfaction Guaranteed", sub: "30-day workmanship warranty" },
    { Icon: Lock,   title: "Secure & Private",   sub: "Your data is never shared" },
  ];
  return (
    <section className="border-t border-white/5 bg-black/20 py-14">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {items.map(({ Icon, title, sub }) => (
          <div key={title} className="flex items-center gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="font-heading text-sm font-bold text-white">{title}</div>
              <div className="text-xs text-white/50">{sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-white/5 bg-black/40">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-white/50 sm:flex-row lg:px-8">
        <div className="flex items-center gap-2 text-white">
          <Snowflake className="h-4 w-4 text-primary" />
          <span className="font-display text-base">ADELAIDE<span className="text-primary">HVAC</span></span>
        </div>
        <p>© {new Date().getFullYear()} Adelaide HVAC Services. All rights reserved.</p>
      </div>
    </footer>
  );
}