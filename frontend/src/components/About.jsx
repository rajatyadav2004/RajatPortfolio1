import { useEffect, useRef, useState } from "react";
import { PROFILE, STATS } from "../data/portfolio";

const useCountUp = (target, active) => {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    let n = 0;
    const id = setInterval(() => {
      n += target / 40;
      if (n >= target) { n = target; clearInterval(id); }
      setV(Math.floor(n));
    }, 30);
    return () => clearInterval(id);
  }, [target, active]);
  return v;
};

function Stat({ value, label, suffix, active }) {
  const v = useCountUp(value, active);
  return (
    <div className="border-l border-[var(--line)] pl-5 min-w-0">
      <div className="font-display text-4xl md:text-5xl text-white tabular-nums whitespace-nowrap" data-testid={`stat-${label.replace(/\s/g,'-')}`}>{v}<span className="text-[var(--cyan)] ml-0.5">{suffix}</span></div>
      <div className="font-mono text-[10px] text-[var(--muted)] tracking-[0.2em] uppercase mt-2">{label}</div>
    </div>
  );
}

export default function About() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => entries.forEach(e => { if (e.isIntersecting) setVis(true); }), { threshold: 0.3 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const words = PROFILE.bio.split(" ");

  return (
    <section id="about" ref={ref} data-testid="about-section" className="relative min-h-screen px-6 md:px-16 py-32 overflow-hidden grain">
      {/* parallax bg */}
      <div className="absolute inset-0 -z-10" style={{ background: "radial-gradient(ellipse at 20% 30%, rgba(108,0,255,0.18), transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(0,255,240,0.08), transparent 60%)" }} />
      <svg className="absolute inset-0 w-full h-full -z-10 opacity-20" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(0,255,240,0.18)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <div className="max-w-[1500px] mx-auto">
        <div className="flex items-baseline gap-4 mb-12">
          <span className="font-mono text-[10px] text-[var(--cyan)] tracking-[0.3em]">02 / ABOUT</span>
          <span className="divider" />
          <span className="font-mono text-[10px] text-[var(--muted)] tracking-[0.3em] uppercase">Origin · Method · Vision</span>
        </div>
        <div className="grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-7">
            <h2 className="font-display text-5xl md:text-7xl leading-[0.95] mb-10">
              A researcher who <span className="text-[var(--cyan)]">ships</span>,<br/>a builder who <span className="text-[var(--violet)]">reasons</span>.
            </h2>
            <p className="text-lg md:text-xl leading-relaxed text-white/80">
              {words.map((w, i) => (
                <span key={i} className="inline-block mr-1 transition-all duration-500" style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(12px)", transitionDelay: `${i * 18}ms` }}>{w}</span>
              ))}
            </p>
          </div>
          <div className="md:col-span-5 glass-card p-8 relative">
            <div className="aspect-square mb-6 rounded-xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, rgba(0,255,240,0.15), rgba(108,0,255,0.18))" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="font-display text-[180px] leading-none text-white/90">R</div>
              </div>
              <div className="absolute bottom-3 left-3 font-mono text-[10px] text-white/70 tracking-[0.2em]">RAJAT · BMU '27</div>
            </div>
            <div className="grid grid-cols-2 gap-x-10 gap-y-6 mt-2">
              {STATS.map((s) => <Stat key={s.label} {...s} active={vis} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
