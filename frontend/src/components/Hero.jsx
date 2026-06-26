import { useEffect, useRef, useState } from "react";
import HeroField from "./HeroField";
import { PROFILE } from "../data/portfolio";

export default function Hero({ lowPerf }) {
  const [role, setRole] = useState(0);
  const [typed, setTyped] = useState("");
  const ctaRef = useRef(null);
  const ctaRef2 = useRef(null);

  useEffect(() => {
    const full = PROFILE.roles[role];
    let i = 0;
    setTyped("");
    const id = setInterval(() => {
      i++;
      setTyped(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(id);
        setTimeout(() => setRole((r) => (r + 1) % PROFILE.roles.length), 1800);
      }
    }, 55);
    return () => clearInterval(id);
  }, [role]);

  useEffect(() => {
    const mag = (el) => {
      if (!el) return () => {};
      const move = (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      };
      const leave = () => (el.style.transform = "translate(0,0)");
      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", leave);
      return () => {
        el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseleave", leave);
      };
    };
    const u1 = mag(ctaRef.current);
    const u2 = mag(ctaRef2.current);
    return () => { u1(); u2(); };
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="hero" data-testid="hero-section" className="relative min-h-screen w-full flex items-center overflow-hidden grain">
      {!lowPerf && <HeroField />}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(0,255,240,0.06), transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(108,0,255,0.08), transparent 50%)" }} />

      <span className="edge-label" style={{ top: 90, left: 24 }}>
        <span className="pill"><span className="dot-live" />{PROFILE.availability}</span>
      </span>
      <span className="edge-label" style={{ bottom: 24, left: 24 }}>{PROFILE.coords}</span>
      <span className="edge-label" style={{ bottom: 24, right: 24 }}>SCROLL ↓ TO EXPLORE</span>
      <span className="edge-label" style={{ top: 90, right: 24 }}>SECTION · 01 / HOME</span>

      <div className="relative z-10 w-full px-6 md:px-16 max-w-[1600px] mx-auto">
        <div className="font-mono text-[11px] text-[var(--muted)] tracking-[0.3em] uppercase mb-6" data-testid="hero-greeting">// Hello, internet — I'm</div>
        <h1 className="hero-name glitch" data-text={PROFILE.name} data-testid="hero-name">{PROFILE.name}</h1>
        <div className="mt-6 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-xl">
            <div className="font-display text-xl md:text-3xl text-white/90" data-testid="hero-typewriter">
              <span className="text-[var(--cyan)] font-mono text-sm mr-3">▸</span>{typed}<span className="inline-block w-[2px] h-6 bg-[var(--cyan)] align-middle ml-1 animate-pulse" />
            </div>
            <p className="text-[var(--muted)] mt-6 text-base md:text-lg leading-relaxed max-w-lg">{PROFILE.tagline}</p>
          </div>
          <div className="flex items-center gap-4">
            <button ref={ctaRef} data-cursor="OPEN" data-testid="cta-work" className="btn-magnetic" onClick={() => scrollTo("work")}><span>View Work →</span></button>
            <button ref={ctaRef2} data-cursor="SEND" data-testid="cta-contact" className="btn-ghost" onClick={() => scrollTo("contact")}>Get in Touch</button>
          </div>
        </div>
      </div>
    </section>
  );
}
