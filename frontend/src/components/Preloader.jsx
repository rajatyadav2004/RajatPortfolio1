import { useEffect, useRef, useState } from "react";

export default function Preloader({ onDone }) {
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState("count"); // count -> shatter -> done
  const wrap = useRef(null);

  useEffect(() => {
    let n = 0;
    let done = false;
    const id = setInterval(() => {
      n += Math.random() * 14 + 6;
      if (n >= 100 && !done) {
        n = 100;
        done = true;
        clearInterval(id);
        setPct(100);
        setTimeout(() => setPhase("shatter"), 180);
        setTimeout(() => { setPhase("done"); onDone?.(); }, 900);
        return;
      }
      setPct(Math.floor(n));
    }, 30);
    return () => clearInterval(id);
  }, [onDone]);

  if (phase === "done") return null;

  return (
    <div ref={wrap} data-testid="preloader" className={`fixed inset-0 z-[10000] bg-[#030308] flex items-center justify-center transition-opacity duration-500 ${phase === "shatter" ? "opacity-0 pointer-events-none" : ""}`}>
      <svg width="220" height="220" viewBox="0 0 200 200" className="overflow-visible">
        <defs>
          <linearGradient id="rg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#00FFF0" />
            <stop offset="100%" stopColor="#6C00FF" />
          </linearGradient>
          <mask id="rmask">
            <rect width="200" height="200" fill="black" />
            <rect x="0" y={200 - (pct / 100) * 200} width="200" height={(pct / 100) * 200} fill="white" />
          </mask>
        </defs>
        <text x="100" y="148" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="180" fill="none" stroke="#1a1a2e" strokeWidth="1">R</text>
        <text x="100" y="148" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="180" fill="url(#rg)" mask="url(#rmask)" style={{ filter: `drop-shadow(0 0 24px #00FFF0)` }}>R</text>
      </svg>
      <div className="absolute bottom-10 left-10 font-mono text-[11px] text-[var(--muted)] tracking-[0.3em]">LOADING</div>
      <div className="absolute bottom-10 right-10 font-mono text-[13px] text-[var(--cyan)] tabular-nums">{String(pct).padStart(3, "0")}%</div>
      <div className="absolute top-10 left-10 font-mono text-[10px] text-[var(--muted)] tracking-[0.3em]">RAJAT · PORTFOLIO · v1.0</div>
    </div>
  );
}
