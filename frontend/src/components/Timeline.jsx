import { useEffect, useRef, useState } from "react";
import { TIMELINE } from "../data/portfolio";

export default function Timeline() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(new Set());

  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setSeen(prev => new Set(prev).add(e.target.dataset.idx));
        }
      });
    }, { threshold: 0.4 });
    ref.current?.querySelectorAll("[data-idx]").forEach(n => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <section id="research" data-testid="research-section" ref={ref} className="relative min-h-screen px-6 md:px-16 py-32 grain overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-30" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(108,0,255,0.15), transparent 60%)" }} />
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-baseline gap-4 mb-16">
          <span className="font-mono text-[10px] text-[var(--cyan)] tracking-[0.3em]">05 / RESEARCH</span>
          <span className="divider" />
          <h2 className="font-display text-4xl md:text-6xl">A trail of artifacts</h2>
        </div>

        <div className="relative">
          {/* central line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block" style={{ background: "linear-gradient(180deg, transparent, var(--cyan) 10%, var(--violet) 90%, transparent)" }} />

          <div className="space-y-16">
            {TIMELINE.map((t, i) => {
              const visible = seen.has(String(i));
              const isLeft = t.side === "left";
              return (
                <div key={i} data-idx={i} data-testid={`timeline-node-${i}`} className={`relative grid md:grid-cols-2 gap-8 items-center transition-all duration-700 ${visible ? "opacity-100 filter-none" : "opacity-0 blur-md"}`} style={{ transform: visible ? "translateY(0)" : "translateY(40px)" }}>
                  {isLeft ? (
                    <>
                      <div className="md:text-right md:pr-12 order-2 md:order-1">
                        <div className="font-mono text-[11px] text-[var(--cyan)] tracking-[0.2em] mb-2">{t.date}</div>
                        <h3 className="font-display text-2xl md:text-3xl mb-2">{t.title}</h3>
                        <p className="text-white/70 leading-relaxed">{t.body}</p>
                      </div>
                      <div className="hidden md:block" />
                    </>
                  ) : (
                    <>
                      <div className="hidden md:block" />
                      <div className="md:pl-12 order-2">
                        <div className="font-mono text-[11px] text-[var(--violet)] tracking-[0.2em] mb-2">{t.date}</div>
                        <h3 className="font-display text-2xl md:text-3xl mb-2">{t.title}</h3>
                        <p className="text-white/70 leading-relaxed">{t.body}</p>
                      </div>
                    </>
                  )}
                  <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
                    <div className="timeline-node" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
