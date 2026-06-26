import { useEffect, useRef } from "react";

export default function MatrixRain({ onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    c.width = window.innerWidth; c.height = window.innerHeight;
    const cs = "アァイィウエオカキクケコサシスセソタチツテトナニヌネノABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
    const cols = Math.floor(c.width / 18);
    const drops = new Array(cols).fill(1);
    let raf;
    const draw = () => {
      ctx.fillStyle = "rgba(3,3,8,0.08)"; ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#00FFF0"; ctx.font = "18px JetBrains Mono, monospace";
      drops.forEach((y, i) => {
        const t = cs[Math.floor(Math.random() * cs.length)];
        ctx.fillText(t, i * 18, y * 18);
        if (y * 18 > c.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", onKey); };
  }, [onClose]);
  return (
    <div className="matrix-overlay" data-testid="matrix-rain" onClick={onClose}>
      <canvas ref={ref} />
      <div className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-[var(--cyan)] text-xs tracking-[0.4em] pointer-events-none">// KONAMI DECODED · ESC TO EXIT</div>
    </div>
  );
}
