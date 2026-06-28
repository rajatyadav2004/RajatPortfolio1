import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import axios from "axios";
import { toast } from "sonner";
import { PROFILE } from "../data/portfolio";

function MeshWave({ lowPerf }) {
  const mount = useRef(null);
  useEffect(() => {
    if (lowPerf) return;
    const el = mount.current; if (!el) return;
    const w = () => el.clientWidth, h = () => el.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w() / h(), 0.1, 100);
    camera.position.set(0, 1.6, 6);
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w(), h());
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const geom = new THREE.PlaneGeometry(14, 8, 60, 36);
    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uMouse: { value: new THREE.Vector2() }, uCyan: { value: new THREE.Color("#00FFF0") }, uViolet: { value: new THREE.Color("#6C00FF") } },
      wireframe: true, transparent: true,
      vertexShader: `uniform float uTime; uniform vec2 uMouse; varying float vH;
        void main(){
          vec3 p = position;
          float d = distance(uv, uMouse * 0.5 + 0.5);
          float w = sin(p.x * 1.5 + uTime) * 0.18 + cos(p.y * 1.2 + uTime * 0.7) * 0.18;
          w += smoothstep(0.5, 0.0, d) * 0.8;
          p.z += w;
          vH = w;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }`,
      fragmentShader: `uniform vec3 uCyan; uniform vec3 uViolet; varying float vH;
        void main(){ vec3 c = mix(uViolet, uCyan, smoothstep(-0.3, 0.6, vH)); gl_FragColor = vec4(c, 0.55); }`,
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.rotation.x = -Math.PI / 2.4;
    scene.add(mesh);

    const mouse = new THREE.Vector2();
    const onMove = (e) => { const r = el.getBoundingClientRect(); mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1; mouse.y = -(((e.clientY - r.top) / r.height) * 2 - 1); };
    el.addEventListener("mousemove", onMove);

    let raf; const clock = new THREE.Clock();
    const loop = () => { mat.uniforms.uTime.value = clock.getElapsedTime(); mat.uniforms.uMouse.value.lerp(mouse, 0.08); renderer.render(scene, camera); raf = requestAnimationFrame(loop); };
    loop();
    const onResize = () => { renderer.setSize(w(), h()); camera.aspect = w() / h(); camera.updateProjectionMatrix(); };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); el.removeEventListener("mousemove", onMove); window.removeEventListener("resize", onResize); renderer.dispose(); if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement); };
  }, [lowPerf]);
  return <div ref={mount} className="absolute inset-0 -z-10" />;
}

function ScrambledEmail({ email }) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@.-_";
  const [shown, setShown] = useState(email);
  const onEnter = () => {
    let f = 0; const max = 14;
    const id = setInterval(() => {
      f++;
      const arr = email.split("").map((c, i) => (i < f / 2 ? c : chars[Math.floor(Math.random() * chars.length)]));
      setShown(arr.join(""));
      if (f > max) { clearInterval(id); setShown(email); }
    }, 35);
  };
  return <a data-cursor="COPY" data-testid="contact-email" href={`mailto:${email}`} onMouseEnter={onEnter} className="font-mono text-[var(--cyan)] hover:underline">{shown}</a>;
}

export default function Contact({ lowPerf }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [burst, setBurst] = useState(false);
  const valid = form.name.trim() && /^[^@]+@[^@]+\.[^@]+$/.test(form.email) && form.message.trim().length > 4;

  const submit = async (e) => {
    e.preventDefault();
    if (!valid) { toast.error("Please complete all fields with a valid email."); return; }
    setSending(true);
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/contact`, form);
      setBurst(true); setTimeout(() => setBurst(false), 1200);
      toast.success("Transmission received. I'll reply within 24h.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) { toast.error("Could not send. Try again."); }
    finally { setSending(false); }
  };

  return (
    <section id="contact" data-testid="contact-section" className="relative min-h-screen px-6 md:px-16 py-32 grain overflow-hidden">
      <MeshWave lowPerf={lowPerf} />
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex items-baseline gap-4 mb-12">
          <span className="font-mono text-[10px] text-[var(--cyan)] tracking-[0.3em]">06 / CONTACT</span>
          <span className="divider" />
          <h2 className="font-display text-4xl md:text-6xl">Let's build something <span className="text-[var(--cyan)]">unreasonable</span>.</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <p className="text-white/80 text-lg leading-relaxed max-w-md">Research collaborations, full-stack contracts, AI prototypes, late-night ideas — the channel is open.</p>
            <div className="space-y-3">
              <div className="font-mono text-[10px] text-[var(--muted)] tracking-[0.3em]">EMAIL</div>
              <ScrambledEmail email={PROFILE.email} />
            </div>
            <div className="space-y-3">
              <div className="font-mono text-[10px] text-[var(--muted)] tracking-[0.3em]">SOCIAL</div>
              <div className="flex flex-wrap gap-3">
                <a data-cursor="OPEN" data-testid="social-github" href="https://github.com/rajatyadav2004" target="_blank" rel="noreferrer" className="btn-ghost text-xs">GitHub ↗</a>
                <a data-cursor="OPEN" data-testid="social-linkedin" href="https://www.linkedin.com/in/rajat-yadav-445a773b2" target="_blank" rel="noreferrer" className="btn-ghost text-xs">LinkedIn ↗</a>
                <a data-cursor="CALL" data-testid="social-phone" href={`tel:${PROFILE.phone.replace(/\s/g, '')}`} className="btn-ghost text-xs">{PROFILE.phone} ↗</a>
              </div>
            </div>
            <div className="space-y-3">
              <div className="font-mono text-[10px] text-[var(--muted)] tracking-[0.3em]">LOCATION</div>
              <div className="text-white/80">{PROFILE.location} · {PROFILE.coords}</div>
            </div>
          </div>
          <form onSubmit={submit} className="glass-card p-8 space-y-5 relative" data-testid="contact-form">
            <div>
              <div className="field-label mb-2">Name</div>
              <input data-testid="contact-name" className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="What should I call you?" />
            </div>
            <div>
              <div className="field-label mb-2">Email</div>
              <input data-testid="contact-email-input" className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@orbit.dev" />
            </div>
            <div>
              <div className="field-label mb-2">Message</div>
              <textarea data-testid="contact-message" className="field min-h-[140px]" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="The idea, the brief, the wild question..." />
            </div>
            <button data-cursor="SEND" data-testid="contact-submit" disabled={!valid || sending} className="btn-magnetic w-full disabled:opacity-40"><span>{sending ? "Transmitting..." : "Transmit →"}</span></button>
            {burst && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {Array.from({ length: 40 }).map((_, i) => (
                  <span key={i} className="absolute w-1 h-1 rounded-full bg-[var(--cyan)]" style={{ animation: `burst 1s ease-out forwards`, transform: `rotate(${i * 9}deg)` }} />
                ))}
                <style>{`@keyframes burst { 0% { transform: rotate(var(--a, 0)) translateX(0); opacity:1 } 100% { transform: rotate(var(--a,0)) translateX(220px); opacity: 0 } }`}</style>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
