import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Phone, Menu, X, Snowflake, Wind, Zap, CheckCircle2, Star,
  ArrowRight, Shield, Clock, MapPin, DollarSign, Wrench, Award,
  Lightbulb, Thermometer, ClipboardList, PhoneCall, Mail, ChevronDown,
} from "lucide-react";
import heroImg from "@/assets/hero-hvac.jpg";
import residentialImg from "@/assets/residential.jpg";
import commercialImg from "@/assets/commercial.jpg";
import technicianImg from "@/assets/technician.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const PHONE = "1300 751 711";
const TEL = "tel:1300751711";

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("opacity-100", "translate-y-0");
            e.target.classList.remove("opacity-0", "translate-y-6");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => {
      el.classList.add("opacity-0", "translate-y-6", "transition-all", "duration-700", "ease-out");
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);
}

function useCountUp(target: number, start: boolean, duration = 1600) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setVal(Math.floor(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);
  return val;
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    ["Home", "#home"], ["Services", "#services"], ["About", "#why"],
    ["Why Us", "#why"], ["Testimonials", "#reviews"], ["Contact", "#contact"],
  ] as const;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-[0_4px_24px_-8px_rgba(10,37,64,0.15)]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="#home" className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-lg gradient-cta text-white shadow-brand">
            <Snowflake className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className={`font-display text-2xl tracking-wide ${scrolled ? "text-secondary" : "text-white"}`}>
            ADELAIDE <span className="text-primary">HVAC</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className={`relative text-sm font-semibold tracking-wide transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full ${
                scrolled ? "text-secondary hover:text-primary" : "text-white/90 hover:text-white"
              }`}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a href={TEL} className={`flex items-center gap-2 font-heading font-semibold ${scrolled ? "text-secondary" : "text-white"}`}>
            <Phone className="h-4 w-4 text-primary" />
            {PHONE}
          </a>
          <a href="#contact"
            className="rounded-full gradient-cta px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-white shadow-cta transition-transform hover:scale-105 animate-pulse-glow">
            Book Now
          </a>
        </div>

        <button
          onClick={() => setOpen(true)}
          className={`lg:hidden ${scrolled ? "text-secondary" : "text-white"}`}
          aria-label="Open menu"
        >
          <Menu className="h-7 w-7" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-secondary/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-white p-6 shadow-2xl animate-slide-in-right">
            <div className="flex items-center justify-between">
              <span className="font-display text-xl text-secondary">ADELAIDE <span className="text-primary">HVAC</span></span>
              <button onClick={() => setOpen(false)} aria-label="Close"><X className="h-6 w-6" /></button>
            </div>
            <nav className="mt-8 flex flex-col gap-5">
              {links.map(([l, h]) => (
                <a key={l} href={h} onClick={() => setOpen(false)} className="text-lg font-heading font-semibold text-secondary hover:text-primary">
                  {l}
                </a>
              ))}
            </nav>
            <a href={TEL} className="mt-8 flex items-center gap-2 font-heading font-bold text-secondary">
              <Phone className="h-5 w-5 text-primary" /> {PHONE}
            </a>
            <a href="#contact" onClick={() => setOpen(false)}
              className="mt-6 block rounded-full gradient-cta px-6 py-3 text-center text-sm font-bold uppercase tracking-wider text-white">
              Book Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden gradient-hero duct-pattern text-white">
      {/* animated dots */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
      <div className="pointer-events-none absolute -right-40 top-1/4 h-[600px] w-[600px] rounded-full bg-primary/30 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 pt-36 pb-24 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:px-8 lg:pt-40 lg:pb-32">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> Adelaide, South Australia
          </span>
          <h1 className="mt-6 font-display text-5xl leading-[1.02] tracking-tight text-shadow-navy sm:text-6xl lg:text-[76px]">
            Adelaide's Most<br />
            <span className="bg-gradient-to-r from-primary via-white to-primary bg-clip-text text-transparent">Trusted HVAC</span><br />
            Specialists
          </h1>
          <p className="mt-6 max-w-xl text-lg font-light text-white/80 sm:text-xl">
            Air Conditioning · Refrigeration · Electrical — Residential &amp; Commercial Solutions across Greater Adelaide.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#contact"
              className="group inline-flex items-center gap-2 rounded-full gradient-cta px-8 py-4 font-heading text-base font-bold uppercase tracking-wider text-white shadow-cta transition-transform hover:scale-[1.03] animate-pulse-glow">
              Get a Free Quote <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a href={TEL}
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/70 px-8 py-4 font-heading text-base font-bold uppercase tracking-wider text-white transition-all hover:border-white hover:bg-white hover:text-secondary">
              <Phone className="h-5 w-5" /> Call {PHONE}
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {[
              ["Licensed & Insured", Shield],
              ["Same-Day Service", Clock],
              ["Residential & Commercial", Wrench],
            ].map(([t, Icon]) => {
              const I = Icon as typeof Shield;
              return (
                <div key={t as string} className="flex items-center gap-2 text-sm font-semibold text-white/90">
                  <I className="h-4 w-4 text-primary" /> {t as string}
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/40 to-transparent blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/20 shadow-2xl">
            <img src={heroImg} alt="Modern air conditioning system in Adelaide home" width={1200} height={1200} className="h-full w-full object-cover" />
          </div>
          <div className="absolute -bottom-6 -left-6 animate-float rounded-2xl bg-white p-4 shadow-2xl sm:-left-10">
            <div className="flex items-center gap-3">
              <div className="flex text-primary">
                {[0,1,2,3,4].map((i) => <Star key={i} className="h-5 w-5 fill-current" />)}
              </div>
              <div>
                <div className="font-display text-2xl leading-none text-secondary">5.0</div>
                <div className="text-xs font-semibold text-muted-foreground">Google Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <a href="#trust" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 animate-float" aria-label="Scroll down">
        <ChevronDown className="h-7 w-7" />
      </a>
    </section>
  );
}

function TrustBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.3 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const clients = useCountUp(500, visible);
  const response = useCountUp(60, visible);
  const rating = useCountUp(50, visible); // 5.0

  const items = [
    { icon: Award, label: "Happy Clients", value: `${clients}+` },
    { icon: Clock, label: "Min Response Time", value: `<${response}` },
    { icon: Shield, label: "Licensed & Insured", value: "100%" },
    { icon: MapPin, label: "Greater Adelaide", value: "24/7" },
    { icon: Star, label: "Google Rated", value: (rating/10).toFixed(1) },
  ];
  return (
    <section id="trust" ref={ref} className="relative bg-secondary text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-10 sm:grid-cols-3 lg:grid-cols-5 lg:px-8">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="font-display text-2xl leading-none">{value}</div>
              <div className="text-xs font-medium uppercase tracking-wider text-white/60">{label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, center }: { eyebrow: string; title: string; center?: boolean }) {
  return (
    <div className={center ? "text-center" : ""} data-reveal>
      <div className={`flex items-center gap-3 ${center ? "justify-center" : ""}`}>
        <span className="h-px w-10 bg-primary" />
        <span className="font-heading text-xs font-bold uppercase tracking-[0.3em] text-primary">{eyebrow}</span>
        <span className="h-px w-10 bg-primary" />
      </div>
      <h2 className="mt-4 font-display text-4xl leading-tight text-secondary sm:text-5xl">{title}</h2>
    </div>
  );
}

function Services() {
  const cards = [
    {
      icon: Wind, title: "Air Conditioning",
      desc: "Supply, installation, repair and maintenance of split systems, ducted, and multi-head units for homes and businesses.",
      features: ["Split Systems", "Ducted Systems", "Repairs & Servicing", "Energy-Efficient Models"],
    },
    {
      icon: Snowflake, title: "Refrigeration",
      desc: "Commercial refrigeration solutions designed to keep your products at the perfect temperature — every day, every season.",
      features: ["Commercial Coolrooms", "Display Refrigerators", "Preventive Maintenance", "Emergency Repairs"],
    },
    {
      icon: Zap, title: "Electrical Services",
      desc: "Licensed electrical work from switchboard upgrades to full installations — safe, compliant, and done right the first time.",
      features: ["Switchboard Upgrades", "Wiring & Installations", "Safety Inspections", "Emergency Callouts"],
    },
  ];
  return (
    <section id="services" className="relative bg-white py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading eyebrow="What We Do" title="Our Services" center />
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ icon: Icon, title, desc, features }, i) => (
            <div key={title} data-reveal style={{ transitionDelay: `${i * 100}ms` }}
              className="group relative overflow-hidden rounded-3xl glass-card p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-brand">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl transition-all group-hover:bg-primary/25" />
              <div className="relative">
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-8 w-8" strokeWidth={2} />
                </span>
                <h3 className="mt-6 font-display text-2xl text-secondary">{title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{desc}</p>
                <ul className="mt-6 space-y-2">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm font-medium text-secondary">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> {f}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="mt-6 inline-flex items-center gap-1 font-heading text-sm font-bold uppercase tracking-wider text-primary hover:gap-2 transition-all">
                  Learn More <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-muted-foreground" data-reveal>
          Serving Residential &amp; Commercial clients across Greater Adelaide
        </p>
      </div>
    </section>
  );
}

function WhyUs() {
  const items = [
    { icon: Award, title: "Expert Technicians", desc: "Fully qualified and licensed professionals with decades of combined experience." },
    { icon: Clock, title: "Fast Response", desc: "Same-day and emergency service available across Greater Adelaide." },
    { icon: Lightbulb, title: "Energy Efficiency", desc: "We recommend the most cost-effective, energy-saving solutions for you." },
    { icon: Wrench, title: "Full-Service", desc: "From supply to install to ongoing maintenance — one trusted team." },
    { icon: DollarSign, title: "Transparent Pricing", desc: "No hidden fees. Free, no-obligation quotes on every job." },
    { icon: Thermometer, title: "Year-Round Comfort", desc: "Heating, cooling, refrigeration — every season covered." },
  ];
  return (
    <section id="why" className="relative overflow-hidden py-24" style={{ background: "#E8F9FE" }}>
      <div className="mx-auto grid max-w-7xl gap-16 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
        <div className="relative" data-reveal>
          <div className="absolute -inset-6 rounded-3xl bg-primary/20 blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl border-4 border-white shadow-2xl">
            <img src={technicianImg} alt="Adelaide HVAC technician at work" loading="lazy" width={1000} height={1200} className="h-full w-full object-cover" />
          </div>
          <div className="absolute -bottom-6 -right-6 rounded-2xl gradient-cta px-6 py-4 text-white shadow-cta">
            <div className="font-display text-3xl leading-none">15+</div>
            <div className="text-xs font-semibold uppercase tracking-wider">Years Experience</div>
          </div>
        </div>

        <div>
          <SectionHeading eyebrow="The Adelaide HVAC Difference" title="Why Thousands of Adelaide Residents Trust Us" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {items.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} data-reveal style={{ transitionDelay: `${i * 80}ms` }}
                className="flex gap-4 rounded-2xl bg-white/60 p-5 backdrop-blur transition-colors hover:bg-white">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary text-white shadow-brand">
                  <Icon className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <h4 className="font-heading text-base font-bold text-secondary">{title}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    { icon: PhoneCall, t: "Call or Book Online", d: "Reach out via phone or our quick contact form — we respond within 1 business hour." },
    { icon: ClipboardList, t: "Free Quote & Assessment", d: "Onsite or remote assessment with a transparent, no-obligation quote." },
    { icon: Wrench, t: "Expert Installation or Repair", d: "Our licensed team completes the work on time, on budget, and to code." },
    { icon: CheckCircle2, t: "Comfort Guaranteed", d: "Ongoing support and maintenance to keep your system running at its best." },
  ];
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "repeating-linear-gradient(45deg, #10B5DF 0 1px, transparent 1px 24px)" }} />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading eyebrow="Simple. Fast. Reliable." title="How It Works" center />
        <div className="relative mt-16 grid gap-10 lg:grid-cols-4">
          <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px lg:block"
            style={{ backgroundImage: "linear-gradient(90deg, #10B5DF 33%, transparent 0%)", backgroundSize: "16px 1px" }} />
          {steps.map(({ icon: Icon, t, d }, i) => (
            <div key={t} data-reveal style={{ transitionDelay: `${i * 120}ms` }} className="relative text-center">
              <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-full bg-white shadow-brand ring-4 ring-primary/20">
                <Icon className="h-7 w-7 text-primary" />
                <span className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full gradient-cta font-display text-sm text-white shadow-cta">
                  {i + 1}
                </span>
              </div>
              <h4 className="mt-5 font-display text-xl text-secondary">{t}</h4>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const reviews = [
    { q: "Absolutely fantastic service! The team arrived on time, installed our new ducted system quickly and professionally. Highly recommend Adelaide HVAC to anyone in Adelaide.", n: "Sarah M.", s: "Glenelg" },
    { q: "Called them for an emergency refrigeration repair and they were there within hours. Saved my business thousands. These guys are the real deal.", n: "James T.", s: "Business Owner, Norwood" },
    { q: "Very professional from start to finish. They explained everything clearly, gave us options to save energy costs, and the installation was flawless.", n: "David & Lisa K.", s: "Prospect" },
  ];
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, [paused, reviews.length]);

  return (
    <section id="reviews" className="bg-secondary py-24 text-white">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="text-center" data-reveal>
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-primary" />
            <span className="font-heading text-xs font-bold uppercase tracking-[0.3em] text-primary">What Our Clients Say</span>
            <span className="h-px w-10 bg-primary" />
          </div>
          <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">Real Reviews from Real Adelaide Clients</h2>
          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-white/10 px-5 py-2.5 backdrop-blur">
            <div className="flex text-primary">
              {[0,1,2,3,4].map((s) => <Star key={s} className="h-4 w-4 fill-current" />)}
            </div>
            <span className="font-heading text-sm font-bold">5-Star Google Rated</span>
          </div>
        </div>

        <div className="relative mt-14" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-700" style={{ transform: `translateX(-${i * 100}%)` }}>
              {reviews.map((r) => (
                <div key={r.n} className="w-full shrink-0 px-2">
                  <div className="mx-auto max-w-3xl rounded-3xl border-l-4 border-primary bg-white p-8 text-secondary shadow-2xl sm:p-12">
                    <div className="flex text-primary">
                      {[0,1,2,3,4].map((s) => <Star key={s} className="h-5 w-5 fill-current" />)}
                    </div>
                    <p className="mt-5 font-heading text-lg leading-relaxed sm:text-xl">"{r.q}"</p>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-full gradient-cta font-display text-white">
                        {r.n.charAt(0)}
                      </div>
                      <div>
                        <div className="font-heading font-bold">{r.n}</div>
                        <div className="text-xs text-muted-foreground">{r.s}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2">
            {reviews.map((_, idx) => (
              <button key={idx} onClick={() => setI(idx)} aria-label={`Review ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${i === idx ? "w-8 bg-primary" : "w-2 bg-white/30"}`} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <a href="#" className="inline-flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-wider text-primary hover:underline">
              Read More Reviews on Google <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Split() {
  const panels = [
    { img: residentialImg, badge: "For Homeowners", title: "Keep Your Family Comfortable All Year",
      desc: "Split systems, ducted AC, home refrigeration, and electrical for Adelaide homes.", cta: "Residential Services" },
    { img: commercialImg, badge: "For Businesses", title: "Reliable HVAC Solutions for Your Business",
      desc: "Commercial refrigeration, large-scale AC, electrical compliance, and maintenance contracts.", cta: "Commercial Services" },
  ];
  return (
    <section className="grid md:grid-cols-2">
      {panels.map((p) => (
        <div key={p.title} className="group relative min-h-[420px] overflow-hidden lg:min-h-[540px]">
          <img src={p.img} alt={p.title} loading="lazy" width={1200} height={900}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/70 to-secondary/20" />
          <div className="relative flex h-full flex-col justify-end p-8 text-white sm:p-12">
            <span className="inline-flex w-fit rounded-full bg-primary px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-brand">
              {p.badge}
            </span>
            <h3 className="mt-4 max-w-md font-display text-3xl leading-tight sm:text-4xl">{p.title}</h3>
            <p className="mt-3 max-w-md text-white/80">{p.desc}</p>
            <a href="#contact" className="mt-6 inline-flex w-fit items-center gap-2 font-heading text-sm font-bold uppercase tracking-wider text-primary hover:gap-3 transition-all">
              {p.cta} <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      ))}
    </section>
  );
}

function CTABanner() {
  return (
    <section className="relative overflow-hidden gradient-cta py-20 text-white">
      <div className="pointer-events-none absolute -left-40 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-primary/40 blur-3xl" />
      <div className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
        <h2 className="font-display text-4xl leading-tight sm:text-6xl">Ready for Year-Round Comfort?</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/85">
          Adelaide HVAC Services — your trusted local experts. Get a free, no-obligation quote today.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-8 py-4 font-heading text-base font-bold uppercase tracking-wider text-white shadow-cta transition-transform hover:scale-105 animate-pulse-glow">
            Get a Free Quote <ArrowRight className="h-5 w-5" />
          </a>
          <a href={TEL}
            className="inline-flex items-center gap-2 rounded-full border-2 border-white px-8 py-4 font-heading text-base font-bold uppercase tracking-wider text-white transition-all hover:bg-white hover:text-secondary">
            <Phone className="h-5 w-5" /> Call {PHONE}
          </a>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    (e.target as HTMLFormElement).reset();
  };
  return (
    <section id="contact" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading eyebrow="Get in Touch" title="Contact & Booking" center />
        <div className="mt-16 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={onSubmit} data-reveal className="rounded-3xl border border-border bg-white p-8 shadow-[0_20px_60px_-30px_rgba(10,37,64,0.25)] sm:p-10">
            <h3 className="font-display text-2xl text-secondary">Request Your Free Quote</h3>
            <p className="mt-1 text-sm text-muted-foreground">We respond to all enquiries within 1 business hour.</p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Name" name="name" required />
              <Field label="Email" name="email" type="email" required />
              <Field label="Phone" name="phone" type="tel" />
              <div>
                <label className="mb-1.5 block font-heading text-xs font-bold uppercase tracking-wider text-secondary">Service Type</label>
                <select required name="service"
                  className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-secondary transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15">
                  <option value="">Select a service…</option>
                  <option>Air Conditioning</option>
                  <option>Refrigeration</option>
                  <option>Electrical</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div className="mt-5">
              <label className="mb-1.5 block font-heading text-xs font-bold uppercase tracking-wider text-secondary">Message</label>
              <textarea name="message" rows={4}
                className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                placeholder="Tell us about your project…" />
            </div>
            <button type="submit"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full gradient-cta px-8 py-4 font-heading text-base font-bold uppercase tracking-wider text-white shadow-cta transition-transform hover:scale-[1.02] sm:w-auto">
              Send My Enquiry <ArrowRight className="h-5 w-5" />
            </button>
            {sent && (
              <p className="mt-4 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-secondary">
                Thanks! We'll be in touch within 1 business hour.
              </p>
            )}
          </form>

          <div data-reveal className="rounded-3xl bg-secondary p-8 text-white sm:p-10">
            <h3 className="font-display text-2xl">Contact Details</h3>
            <ul className="mt-6 space-y-5">
              <ContactRow icon={Phone} label="Phone" value={PHONE} href={TEL} />
              <ContactRow icon={Mail} label="Website" value="adelaidehvac.com.au" href="https://adelaidehvac.com.au" />
              <ContactRow icon={MapPin} label="Service Area" value="Greater Adelaide, South Australia" />
            </ul>
            <div className="mt-8 rounded-2xl bg-white/5 p-5">
              <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-primary">Business Hours</h4>
              <ul className="mt-3 space-y-1.5 text-sm text-white/80">
                <li className="flex justify-between"><span>Mon – Fri</span><span>7am – 6pm</span></li>
                <li className="flex justify-between"><span>Saturday</span><span>8am – 2pm</span></li>
                <li className="flex justify-between text-primary"><span className="font-bold">Emergency</span><span className="font-bold">24 / 7</span></li>
              </ul>
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
              <iframe
                title="Adelaide map"
                src="https://www.google.com/maps?q=Adelaide,%20South%20Australia&output=embed"
                width="100%" height="220" loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block w-full grayscale-[30%]"
              />
            </div>
            <p className="mt-6 flex items-center gap-2 text-sm text-white/80">
              <CheckCircle2 className="h-4 w-4 text-primary" /> We respond to all enquiries within 1 business hour.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-1.5 block font-heading text-xs font-bold uppercase tracking-wider text-secondary">
        {label}{required && <span className="text-[#FF6B35]">*</span>}
      </label>
      <input type={type} name={name} required={required}
        className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-secondary transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15" />
    </div>
  );
}

function ContactRow({ icon: Icon, label, value, href }: { icon: typeof Phone; label: string; value: string; href?: string }) {
  const inner = (
    <div className="flex items-center gap-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <div className="text-[11px] font-bold uppercase tracking-wider text-white/50">{label}</div>
        <div className="font-heading text-base font-semibold">{value}</div>
      </div>
    </div>
  );
  return <li>{href ? <a href={href} className="block hover:text-primary transition-colors">{inner}</a> : inner}</li>;
}

function Footer() {
  return (
    <footer className="relative bg-secondary text-white/80">
      <div className="h-1 gradient-cta" />
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-lg gradient-cta text-white">
              <Snowflake className="h-5 w-5" />
            </span>
            <span className="font-display text-2xl text-white">ADELAIDE <span className="text-primary">HVAC</span></span>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            Adelaide's trusted HVAC specialists. Air conditioning, refrigeration & electrical for homes and businesses.
          </p>
          <p className="mt-4 font-heading text-sm font-bold text-primary">"Your Comfort. Our Expertise."</p>
        </div>
        <FooterCol title="Services" items={[["Air Conditioning", "#services"], ["Refrigeration", "#services"], ["Electrical", "#services"]]} />
        <FooterCol title="Quick Links" items={[["Home", "#home"], ["Why Us", "#why"], ["Contact", "#contact"], ["Book Online", "#contact"]]} />
        <div>
          <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href={TEL} className="hover:text-primary">📞 {PHONE}</a></li>
            <li>🌐 adelaidehvac.com.au</li>
            <li>📍 Greater Adelaide, SA</li>
            <li>Mon–Fri 7am–6pm</li>
            <li>Emergency: 24/7</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-white/60 sm:flex-row lg:px-8">
          <span>© {new Date().getFullYear()} Adelaide HVAC Services. Licensed HVAC Contractors — Adelaide, SA.</span>
          <a href="#" className="hover:text-primary">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white">{title}</h4>
      <ul className="mt-4 space-y-2 text-sm">
        {items.map(([l, h]) => (
          <li key={l}><a href={h} className="hover:text-primary transition-colors">{l}</a></li>
        ))}
      </ul>
    </div>
  );
}

function Index() {
  useReveal();
  return (
    <main className="overflow-x-hidden bg-background">
      <Nav />
      <Hero />
      <TrustBar />
      <Services />
      <WhyUs />
      <Process />
      <Testimonials />
      <Split />
      <CTABanner />
      <Contact />
      <Footer />
    </main>
  );
}
