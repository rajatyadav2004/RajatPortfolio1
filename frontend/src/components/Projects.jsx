import { useEffect, useRef, useState } from "react";
import { PROJECTS } from "../data/portfolio";

function Card({ p, onOpen }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    el.style.transform = `perspective(1200px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={() => onOpen(p)}
      data-cursor="OPEN"
      data-testid={`project-card-${p.id}`}
      className="project-card group cursor-none"
      style={{ background: `linear-gradient(135deg, ${p.color}20, transparent 60%), radial-gradient(800px 400px at var(--mx,50%) var(--my,50%), ${p.color}28, transparent 60%), #07071a` }}
    >
      <div className="absolute inset-0 p-10 md:p-14 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <span className="font-mono text-[10px] text-[var(--muted)] tracking-[0.3em]">{p.year} · CASE</span>
          <span className="font-mono text-[10px] text-white/60 tracking-[0.3em]">↗ OPEN</span>
        </div>
        <div>
          <div className="font-mono text-[11px] mb-3 tracking-[0.2em]" style={{ color: p.color }}>{p.subtitle}</div>
          <h3 className="font-display text-4xl md:text-6xl leading-[0.95] mb-6 text-white" style={{ textShadow: `0 0 40px ${p.color}40` }}>{p.title}</h3>
          <p className="text-white/70 max-w-xl leading-relaxed text-base md:text-lg">{p.blurb}</p>
          <div className="flex flex-wrap gap-2 mt-6">
            {p.tags.map(t => <span key={t} className="tech-pill" style={{ borderColor: `${p.color}66`, color: p.color }}>{t}</span>)}
          </div>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ border: "1px solid transparent", borderRadius: 24, background: `linear-gradient(${p.color}, ${p.color}) padding-box, conic-gradient(from var(--ang, 0deg) at var(--mx, 50%) var(--my, 50%), ${p.color}, transparent 30%, ${p.color}) border-box`, opacity: 0.0 }} />
    </div>
  );
}

export default function Projects() {
  const [open, setOpen] = useState(null);
  const stripRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const sec = sectionRef.current;
    const strip = stripRef.current;
    if (!sec || !strip) return;
    const onScroll = () => {
      const r = sec.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / total));
      const max = strip.scrollWidth - window.innerWidth + 160;
      strip.style.transform = `translateX(${-p * max}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="work" ref={sectionRef} data-testid="work-section" className="relative" style={{ height: `${PROJECTS.length * 80}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        <div className="px-6 md:px-16 mb-10 flex items-baseline justify-between max-w-[1600px] mx-auto w-full">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-[10px] text-[var(--cyan)] tracking-[0.3em]">03 / WORK</span>
            <span className="divider" />
            <h2 className="font-display text-3xl md:text-5xl">Selected projects</h2>
          </div>
          <span className="font-mono text-[10px] text-[var(--muted)] tracking-[0.3em] hidden md:block">→ HORIZONTAL SCROLL ENGAGED</span>
        </div>
        <div ref={stripRef} className="h-scroll px-6 md:px-16 will-change-transform transition-transform" style={{ transitionTimingFunction: "cubic-bezier(.22,.8,.36,1)", transitionDuration: "120ms" }}>
          {PROJECTS.map(p => <Card key={p.id} p={p} onOpen={setOpen} />)}
        </div>
      </div>

      {open && (
        <div data-testid="project-modal" className="fixed inset-0 z-[9000] bg-[#030308]/95 backdrop-blur-2xl flex items-center justify-center p-6 md:p-16 animate-in fade-in" onClick={() => setOpen(null)}>
          <div className="glass-card max-w-5xl w-full p-10 md:p-14 relative" onClick={(e) => e.stopPropagation()}>
            <button data-cursor="CLOSE" data-testid="project-modal-close" className="absolute top-6 right-6 font-mono text-xs text-[var(--muted)] hover:text-[var(--cyan)] transition" onClick={() => setOpen(null)}>CLOSE ✕</button>
            <div className="font-mono text-[11px] tracking-[0.2em]" style={{ color: open.color }}>{open.subtitle} · {open.year}</div>
            <h3 className="font-display text-4xl md:text-6xl mt-2 mb-6" style={{ textShadow: `0 0 30px ${open.color}40` }}>{open.title}</h3>
            <p className="text-white/80 text-lg leading-relaxed mb-6">{open.blurb}</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {open.tags.map(t => <span key={t} className="tech-pill" style={{ borderColor: `${open.color}66`, color: open.color }}>{t}</span>)}
            </div>
            <div className="flex gap-4">
              <a data-cursor="VIEW" data-testid="modal-github-link" href={open.github} target="_blank" rel="noreferrer" className="btn-ghost">GitHub ↗</a>
              <a data-cursor="VIEW" data-testid="modal-demo-link" href={open.demo} target="_blank" rel="noreferrer" className="btn-magnetic"><span>Live Demo →</span></a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
