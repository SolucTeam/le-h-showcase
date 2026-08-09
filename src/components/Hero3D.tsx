import { useEffect, useRef } from "react";

/**
 * Hero3D — a real WebGL scene (Three.js) rendered behind page content.
 *
 * variants: "galaxy" (hero), "wave" (showreel), "rings" (contact),
 *           "knot" (404 / error pages).
 *
 * Lifecycle: the scene is built lazily when it scrolls near the viewport and
 * fully torn down (GPU context freed) when it scrolls away — so at most one
 * WebGL context is alive at a time. This keeps it smooth even on phones, where
 * it also runs at DPR 1 with reduced geometry. Fully client-only (dynamic
 * import), honors prefers-reduced-motion, and never throws into the page.
 */

type Props = { className?: string; variant?: "galaxy" | "knot" | "wave" | "rings" };

/** Resolve a CSS color (incl. oklch(...) theme tokens) to an [r,g,b] 0..1 triple. */
function resolveColor(cssValue: string, fallback: [number, number, number]): [number, number, number] {
  try {
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    const ctx = c.getContext("2d");
    if (!ctx) return fallback;
    ctx.fillStyle = "#000";
    ctx.fillStyle = cssValue;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0] / 255, d[1] / 255, d[2] / 255];
  } catch {
    return fallback;
  }
}

export function Hero3D({ className = "", variant = "galaxy" }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (typeof window === "undefined" || !window.WebGLRenderingContext) return;

    let teardown: (() => void) | null = null;
    let buildId = 0;

    const build = async () => {
      if (teardown) return; // already built
      const myId = ++buildId;

      let THREE: typeof import("three");
      try {
        THREE = await import("three");
      } catch {
        return; // three unavailable — content falls back to its gradient
      }
      if (myId !== buildId || !mountRef.current) return;

      const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
      const isMobile = window.matchMedia?.("(max-width: 768px)").matches ?? false;

      const width = mount.clientWidth || window.innerWidth;
      const height = mount.clientHeight || window.innerHeight;

      const styles = getComputedStyle(document.documentElement);
      const accent = resolveColor(styles.getPropertyValue("--accent").trim() || "#f5a04a", [0.96, 0.63, 0.29]);
      const accent2 = resolveColor(styles.getPropertyValue("--accent-2").trim() || "#e2571e", [0.88, 0.34, 0.12]);
      const cA = new THREE.Color(accent[0], accent[1], accent[2]);
      const cB = new THREE.Color(accent2[0], accent2[1], accent2[2]);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
      const camCfg: Record<string, [number, number, number]> = {
        galaxy: [0, 1.6, 6.2],
        knot: [0, 0.4, 6.2],
        wave: [0, 1.9, 5.0],
        rings: [0, 0, 5.5],
      };
      const cc = camCfg[variant] || camCfg.galaxy;
      camera.position.set(cc[0], cc[1], cc[2]);
      camera.lookAt(0, 0, 0);

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile, powerPreference: "high-performance" });
      } catch {
        return; // WebGL unavailable
      }
      renderer.setClearColor(0x000000, 0);
      // DPR 1 on phones — fragment shading is the bottleneck, this ~halves it.
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 2));
      renderer.setSize(width, height);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";
      mount.appendChild(renderer.domElement);

      const disposables: { dispose: () => void }[] = [];
      const spinners: { obj: import("three").Object3D; sx: number; sy: number; sz: number }[] = [];
      const updaters: ((elapsed: number, dt: number) => void)[] = [];
      let galaxy: import("three").Points | null = null;
      let core: import("three").Object3D | null = null;

      const makePoints = (
        count: number,
        place: (i: number) => [number, number, number, number],
        size: number,
      ) => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
          const [x, y, z, mix] = place(i);
          const i3 = i * 3;
          positions[i3] = x;
          positions[i3 + 1] = y;
          positions[i3 + 2] = z;
          const col = cA.clone().lerp(cB, Math.min(Math.max(mix, 0), 1));
          colors[i3] = col.r;
          colors[i3 + 1] = col.g;
          colors[i3 + 2] = col.b;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        const mat = new THREE.PointsMaterial({
          size,
          sizeAttenuation: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          vertexColors: true,
          transparent: true,
          opacity: 0.9,
        });
        disposables.push(geo, mat);
        return new THREE.Points(geo, mat);
      };

      const makeWire = (
        geo: import("three").BufferGeometry,
        color: import("three").Color,
        opacity: number,
        edges = false,
      ) => {
        const wire = edges ? new THREE.EdgesGeometry(geo) : new THREE.WireframeGeometry(geo);
        const mat = new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        disposables.push(geo, wire, mat);
        return new THREE.LineSegments(wire, mat);
      };

      if (variant === "knot") {
        const nebula = makePoints(
          isMobile ? 1800 : 5200,
          () => {
            const r = 2 + Math.random() * 3.2;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            return [
              r * Math.sin(phi) * Math.cos(theta),
              r * Math.cos(phi),
              r * Math.sin(phi) * Math.sin(theta),
              (r - 2) / 3.2,
            ];
          },
          isMobile ? 0.05 : 0.035,
        );
        scene.add(nebula);
        spinners.push({ obj: nebula, sx: 0.01, sy: 0.03, sz: 0 });

        const knotGeo = new THREE.TorusKnotGeometry(1.25, 0.4, isMobile ? 70 : 110, isMobile ? 8 : 14);
        const knot = makeWire(knotGeo, cA, 0.5);
        scene.add(knot);
        spinners.push({ obj: knot, sx: 0.1, sy: 0.16, sz: 0.05 });

        const shellGeo = new THREE.IcosahedronGeometry(2.6, 0);
        const shell = makeWire(shellGeo, cB, 0.14, true);
        scene.add(shell);
        spinners.push({ obj: shell, sx: 0.02, sy: -0.04, sz: 0.02 });
      } else if (variant === "wave") {
        const GW = isMobile ? 64 : 130;
        const GH = isMobile ? 34 : 74;
        const gap = isMobile ? 0.2 : 0.14;
        const total = GW * GH;
        const positions = new Float32Array(total * 3);
        const colors = new Float32Array(total * 3);
        for (let r = 0; r < GH; r++) {
          for (let c = 0; c < GW; c++) {
            const i = r * GW + c;
            const i3 = i * 3;
            positions[i3] = (c - GW / 2) * gap;
            positions[i3 + 1] = 0;
            positions[i3 + 2] = (r - GH / 2) * gap;
            const col = cA.clone().lerp(cB, Math.min(r / GH + 0.15, 1));
            colors[i3] = col.r;
            colors[i3 + 1] = col.g;
            colors[i3 + 2] = col.b;
          }
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        const mat = new THREE.PointsMaterial({
          size: isMobile ? 0.06 : 0.038,
          sizeAttenuation: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          vertexColors: true,
          transparent: true,
          opacity: 0.9,
        });
        disposables.push(geo, mat);
        const wave = new THREE.Points(geo, mat);
        wave.rotation.x = -1.05;
        scene.add(wave);
        const posAttr = geo.getAttribute("position") as import("three").BufferAttribute;
        updaters.push((t) => {
          for (let i = 0; i < total; i++) {
            const i3 = i * 3;
            const x = positions[i3];
            const z = positions[i3 + 2];
            posAttr.setY(i, Math.sin(x * 0.6 + t * 1.2) * 0.42 + Math.cos(z * 0.5 + t * 0.9) * 0.32);
          }
          posAttr.needsUpdate = true;
          wave.rotation.z = Math.sin(t * 0.1) * 0.15;
        });
      } else if (variant === "rings") {
        const RINGS = isMobile ? 9 : 17;
        const SP = 1.15;
        const ringMeshes: import("three").Mesh[] = [];
        for (let k = 0; k < RINGS; k++) {
          const g = new THREE.TorusGeometry(1.7, 0.012, 6, isMobile ? 64 : 96);
          const m = new THREE.MeshBasicMaterial({
            color: cA.clone().lerp(cB, k / RINGS),
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          });
          disposables.push(g, m);
          const mesh = new THREE.Mesh(g, m);
          mesh.position.z = -k * SP;
          mesh.rotation.z = k * 0.3;
          scene.add(mesh);
          ringMeshes.push(mesh);
        }
        updaters.push((_t, dt) => {
          for (const mesh of ringMeshes) {
            mesh.position.z += dt * 1.3;
            mesh.rotation.z += dt * 0.25;
            if (mesh.position.z > 5) mesh.position.z -= RINGS * SP;
            const zz = mesh.position.z;
            let o = 0.65;
            if (zz < -7) o = 0.65 * Math.max(0, 1 - (-7 - zz) / 6);
            else if (zz > 1.5) o = 0.65 * Math.max(0, 1 - (zz - 1.5) / 3.5);
            (mesh.material as import("three").MeshBasicMaterial).opacity = o;
          }
        });
      } else {
        const COUNT = isMobile ? 2400 : 7200;
        const RADIUS = 5;
        const BRANCHES = 4;
        const SPIN = 1.1;
        galaxy = makePoints(
          COUNT,
          (i) => {
            const r = Math.pow(Math.random(), 1.6) * RADIUS;
            const branch = ((i % BRANCHES) / BRANCHES) * Math.PI * 2;
            const spin = r * SPIN;
            const spread = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.6 * r) / RADIUS;
            return [
              Math.cos(branch + spin) * r + (Math.random() - 0.5) * spread,
              (Math.random() - 0.5) * 0.5 * (1 - r / RADIUS) + (Math.random() - 0.5) * spread * 0.4,
              Math.sin(branch + spin) * r + (Math.random() - 0.5) * spread,
              Math.min(r / RADIUS, 1),
            ];
          },
          isMobile ? 0.045 : 0.03,
        );
        galaxy.rotation.x = 0.35;
        scene.add(galaxy);

        const coreGeo = new THREE.IcosahedronGeometry(1.25, 1);
        core = makeWire(coreGeo, cA, 0.55, true);
        scene.add(core);
        spinners.push({ obj: core, sx: 0.1, sy: -0.18, sz: 0 });

        const shellGeo = new THREE.IcosahedronGeometry(2.1, 0);
        const shell = makeWire(shellGeo, cB, 0.18, true);
        scene.add(shell);
        spinners.push({ obj: shell, sx: 0, sy: 0.05, sz: -0.03 });
      }

      const pointer = { x: 0, y: 0 };
      const targetPt = { x: 0, y: 0 };
      const baseY = camera.position.y;
      const onPointer = (e: PointerEvent) => {
        targetPt.x = (e.clientX / window.innerWidth) * 2 - 1;
        targetPt.y = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

      const clock = new THREE.Clock();
      let raf = 0;
      let running = true;

      const renderFrame = () => {
        const dt = clock.getDelta();
        pointer.x += (targetPt.x - pointer.x) * 0.04;
        pointer.y += (targetPt.y - pointer.y) * 0.04;

        if (galaxy) galaxy.rotation.y += dt * 0.06;
        for (const s of spinners) {
          s.obj.rotation.x += dt * s.sx;
          s.obj.rotation.y += dt * s.sy;
          s.obj.rotation.z += dt * s.sz;
        }
        if (core) core.scale.setScalar(1 + Math.sin(clock.elapsedTime * 1.2) * 0.04);
        for (const u of updaters) u(clock.elapsedTime, dt);

        camera.position.x += (pointer.x * 1.6 - camera.position.x) * 0.05;
        camera.position.y += (baseY - pointer.y * 1.2 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };

      const animate = () => {
        if (!running) return;
        renderFrame();
        raf = requestAnimationFrame(animate);
      };

      const onVisibility = () => {
        if (document.hidden) {
          running = false;
          cancelAnimationFrame(raf);
        } else if (!reduced) {
          running = true;
          clock.getDelta();
          animate();
        }
      };
      document.addEventListener("visibilitychange", onVisibility);

      const onResize = () => {
        const w = mount.clientWidth || window.innerWidth;
        const h = mount.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      if (reduced) {
        running = false;
        renderFrame();
      } else {
        animate();
      }

      const cleanup = () => {
        running = false;
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVisibility);
        for (const d of disposables) d.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === mount) {
          mount.removeChild(renderer.domElement);
        }
      };

      // If this build was cancelled while awaiting, dispose immediately.
      if (myId !== buildId) {
        cleanup();
        return;
      }
      teardown = cleanup;
    };

    const destroy = () => {
      buildId++; // invalidate any in-flight build
      if (teardown) {
        teardown();
        teardown = null;
      }
    };

    // Build when near the viewport, tear down (free the GPU context) when away.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) build();
        else destroy();
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(mount);

    return () => {
      io.disconnect();
      destroy();
    };
  }, [variant]);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
