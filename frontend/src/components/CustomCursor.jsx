import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const spot = useRef(null);
  const label = useRef("");

  useEffect(() => {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my, sx = mx, sy = my;

    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", onMove);

    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      sx += (mx - sx) * 0.08;
      sy += (my - sy) * 0.08;
      if (dot.current) dot.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      if (spot.current) spot.current.style.transform = `translate(${sx}px, ${sy}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);

    const isHover = (t) => t && (t.closest && t.closest("[data-cursor]"));
    const onOver = (e) => {
      const node = isHover(e.target);
      if (!ring.current) return;
      if (node) {
        ring.current.classList.add("hover");
        const lbl = node.getAttribute("data-cursor") || "VIEW";
        label.current = lbl;
        ring.current.textContent = lbl;
      } else {
        ring.current.classList.remove("hover");
        ring.current.textContent = "";
      }
    };
    window.addEventListener("mouseover", onOver);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={spot} className="cursor-spotlight" data-testid="cursor-spotlight" />
      <div ref={ring} className="cursor-ring" data-testid="cursor-ring" />
      <div ref={dot} className="cursor-dot" data-testid="cursor-dot" />
    </>
  );
}
