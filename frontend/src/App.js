import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { Toaster } from "sonner";
import "@/App.css";

import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import StackGlobe from "@/components/StackGlobe";
import Timeline from "@/components/Timeline";
import Contact from "@/components/Contact";
import MatrixRain from "@/components/MatrixRain";

const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

export default function App() {
  const [ready, setReady] = useState(false);
  const [lowPerf, setLowPerf] = useState(false);
  const [matrix, setMatrix] = useState(false);
  const progressRef = useRef(null);
  const konamiBuf = useRef([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem("rajat-seen");
    if (seen) setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    sessionStorage.setItem("rajat-seen", "1");
    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);

    const onScroll = () => {
      const h = document.documentElement;
      const p = h.scrollTop / (h.scrollHeight - h.clientHeight);
      if (progressRef.current) progressRef.current.style.width = `${p * 100}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onKey = (e) => {
      konamiBuf.current.push(e.key);
      if (konamiBuf.current.length > KONAMI.length) konamiBuf.current.shift();
      if (KONAMI.every((k, i) => konamiBuf.current[i] === k)) { setMatrix(true); konamiBuf.current = []; }
    };
    window.addEventListener("keydown", onKey);

    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("keydown", onKey); lenis.destroy(); };
  }, [ready]);

  return (
    <div className="App no-cursor relative">
      {!ready && <Preloader onDone={() => setReady(true)} />}
      <div ref={progressRef} className="scroll-progress" data-testid="scroll-progress" />
      <CustomCursor />
      <Nav />

      <Hero lowPerf={lowPerf} />
      <About />
      <Projects />
      <StackGlobe lowPerf={lowPerf} />
      <Timeline />
      <Contact lowPerf={lowPerf} />

      <footer className="px-6 md:px-16 py-12 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-4">
        <div className="font-mono text-[10px] text-[var(--muted)] tracking-[0.3em]">© 2026 RAJAT · CRAFTED WITH THREE.JS · GSAP · LENIS</div>
        <div className="font-mono text-[10px] text-[var(--muted)] tracking-[0.3em]">↑ KONAMI FOR A SURPRISE</div>
      </footer>

      <button
        data-cursor="TOGGLE"
        data-testid="perf-toggle"
        onClick={() => setLowPerf(v => !v)}
        className="perf-toggle pill"
        title="Toggle low performance mode"
      >
        <span className="dot-live" style={{ background: lowPerf ? "#888" : "#00FFF0", boxShadow: lowPerf ? "none" : "0 0 12px #00FFF0" }} />
        {lowPerf ? "PERF · LIGHT" : "PERF · FULL"}
      </button>

      {matrix && <MatrixRain onClose={() => setMatrix(false)} />}

      <Toaster position="bottom-right" theme="dark" toastOptions={{ style: { background: "#07071a", border: "1px solid rgba(0,255,240,0.2)", color: "#fff", fontFamily: "JetBrains Mono, monospace", fontSize: 12 } }} />
    </div>
  );
}
