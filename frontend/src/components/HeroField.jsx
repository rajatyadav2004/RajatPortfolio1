import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroField({ paused = false }) {
  const mount = useRef(null);

  useEffect(() => {
    if (paused) return;
    const el = mount.current;
    if (!el) return;
    const w = () => el.clientWidth;
    const h = () => el.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, w() / h(), 0.1, 1000);
    camera.position.z = 60;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w(), h());
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // Particle field
    const COUNT = 2200;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 120;
      seeds[i] = Math.random();
    }
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("seed", new THREE.BufferAttribute(seeds, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uCyan: { value: new THREE.Color("#00FFF0") },
        uViolet: { value: new THREE.Color("#6C00FF") },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        uniform float uTime; uniform vec2 uMouse; attribute float seed; varying float vSeed;
        void main(){
          vSeed = seed;
          vec3 p = position;
          float t = uTime * 0.35 + seed * 6.28;
          p.x += sin(t) * 1.5;
          p.y += cos(t * 1.2) * 1.5;
          vec2 ndc = vec2(p.x, p.y) * 0.01;
          float d = distance(ndc, uMouse);
          float push = smoothstep(0.4, 0.0, d) * 14.0;
          p.xy += normalize(ndc - uMouse + 0.0001) * push;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = (1.5 + seed * 2.5) * (200.0 / -mv.z);
        }`,
      fragmentShader: `
        uniform vec3 uCyan; uniform vec3 uViolet; varying float vSeed;
        void main(){
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          if (d > 0.5) discard;
          float a = smoothstep(0.5, 0.0, d);
          vec3 col = mix(uCyan, uViolet, vSeed);
          gl_FragColor = vec4(col, a * 0.85);
        }`,
    });

    const points = new THREE.Points(geom, mat);
    scene.add(points);

    // mouse
    const mouse = new THREE.Vector2(0, 0);
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);

    let raf;
    const clock = new THREE.Clock();
    const loop = () => {
      const t = clock.getElapsedTime();
      mat.uniforms.uTime.value = t;
      mat.uniforms.uMouse.value.lerp(mouse, 0.08);
      points.rotation.y = t * 0.03;
      points.rotation.x = Math.sin(t * 0.1) * 0.08;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    const onResize = () => {
      renderer.setSize(w(), h());
      camera.aspect = w() / h();
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geom.dispose();
      mat.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [paused]);

  return <div ref={mount} data-testid="hero-particle-field" className="absolute inset-0 z-0" />;
}
