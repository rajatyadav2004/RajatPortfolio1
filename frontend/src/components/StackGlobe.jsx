import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { STACK } from "../data/portfolio";

export default function StackGlobe({ lowPerf }) {
  const mount = useRef(null);
  const [contrib, setContrib] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/github/contributions?username=rajatyadav2004`)
      .then(r => r.json()).then(setContrib).catch(() => {});
  }, []);

  useEffect(() => {
    if (lowPerf) return;
    const el = mount.current; if (!el) return;
    const w = () => el.clientWidth, h = () => el.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w() / h(), 0.1, 1000);
    camera.position.z = 6;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w(), h());
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // wireframe sphere
    const sphere = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2, 3),
      new THREE.MeshBasicMaterial({ color: 0x00fff0, wireframe: true, transparent: true, opacity: 0.18 })
    );
    group.add(sphere);

    // inner glow
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(1.9, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x6c00ff, transparent: true, opacity: 0.08 })
    );
    group.add(glow);

    // orbiting tech labels as sprites
    const all = Object.values(STACK).flat();
    const makeLabelTexture = (text, color) => {
      const c = document.createElement("canvas"); c.width = 256; c.height = 64;
      const ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(3,3,8,0.85)"; ctx.fillRect(0, 0, 256, 64);
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.strokeRect(2, 2, 252, 60);
      ctx.font = "600 22px 'Space Grotesk', sans-serif"; ctx.fillStyle = color; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(text, 128, 32);
      return new THREE.CanvasTexture(c);
    };

    const sprites = [];
    all.forEach((tech, i) => {
      const phi = Math.acos(-1 + (2 * i) / all.length);
      const theta = Math.sqrt(all.length * Math.PI) * phi;
      const r = 2.7;
      const x = r * Math.cos(theta) * Math.sin(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(phi);
      const color = i % 2 === 0 ? "#00FFF0" : "#6C00FF";
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeLabelTexture(tech, color), transparent: true }));
      sp.position.set(x, y, z);
      sp.scale.set(0.9, 0.22, 1);
      group.add(sp);
      sprites.push(sp);
    });

    const mouse = { x: 0, y: 0 };
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    el.addEventListener("mousemove", onMove);

    let raf, t = 0;
    const loop = () => {
      t += 0.005;
      group.rotation.y = t + mouse.x * 0.5;
      group.rotation.x = mouse.y * 0.3;
      sprites.forEach(s => s.material.rotation = 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    const onResize = () => { renderer.setSize(w(), h()); camera.aspect = w() / h(); camera.updateProjectionMatrix(); };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [lowPerf]);

  // contribution chart
  const days = contrib?.contributions || [];
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  const maxC = Math.max(1, ...days.map(d => d.count || 0));

  return (
    <section id="stack" data-testid="stack-section" className="relative min-h-screen px-6 md:px-16 py-32 grain">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-baseline gap-4 mb-12">
          <span className="font-mono text-[10px] text-[var(--cyan)] tracking-[0.3em]">04 / STACK</span>
          <span className="divider" />
          <h2 className="font-display text-4xl md:text-6xl">Tools of the trade</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-[500px] glass-card overflow-hidden" data-testid="stack-globe">
            <div ref={mount} className="absolute inset-0" />
            {lowPerf && (
              <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-[var(--muted)]">3D disabled · low-perf mode</div>
            )}
          </div>
          <div className="space-y-6">
            {Object.entries(STACK).map(([group, items]) => (
              <div key={group} data-testid={`stack-group-${group.replace(/\s|\//g,'-')}`}>
                <div className="font-mono text-[10px] text-[var(--cyan)] tracking-[0.3em] mb-2">{group}</div>
                <div className="flex flex-wrap gap-2">
                  {items.map(it => <span key={it} className="tech-pill">{it}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 glass-card p-8">
          <div className="flex items-baseline justify-between mb-6">
            <h3 className="font-display text-2xl">GitHub · last 12 months</h3>
            <span className="font-mono text-[11px] text-[var(--muted)]">{contrib?.total?.lastYear ?? "—"} contributions{contrib?.synthetic ? " · demo" : ""}</span>
          </div>
          <div className="flex gap-[3px] overflow-x-auto no-scrollbar" data-testid="github-contrib">
            {weeks.map((w, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {w.map((d, di) => {
                  const lvl = (d.count || 0) / maxC;
                  return <div key={di} className="w-[10px] h-[10px] rounded-[2px]" style={{ background: `rgba(0,255,240,${0.08 + lvl * 0.85})` }} title={`${d.date}: ${d.count}`} />;
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
