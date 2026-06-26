import { useEffect, useState } from "react";

const ITEMS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "stack", label: "Stack" },
  { id: "research", label: "Research" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [active, setActive] = useState("hero");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-40% 0px -55% 0px" });
    ITEMS.forEach(i => { const n = document.getElementById(i.id); if (n) io.observe(n); });
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-[8000] transition-all`} data-testid="floating-nav">
      <div className={`nav-glass flex items-center gap-1 px-3 py-2 ${scrolled ? "" : "backdrop-blur-md"}`} style={scrolled ? {} : { background: "rgba(8,8,20,0.3)" }}>
        <span className="px-3 font-display font-bold tracking-tight text-sm border-r border-[var(--line)] mr-1 select-none">R/</span>
        {ITEMS.map(i => (
          <button key={i.id} data-cursor="GO" data-testid={`nav-${i.id}`} onClick={() => go(i.id)}
            className={`relative px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] transition ${active === i.id ? "text-[var(--cyan)]" : "text-white/70 hover:text-white"}`}>
            {i.label}
            {active === i.id && <span className="absolute -bottom-0.5 left-3 right-3 h-px bg-[var(--cyan)]" />}
          </button>
        ))}
      </div>
    </nav>
  );
}
