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

type Props = {
  className?: string;
  variant?: "galaxy" | "knot" | "wave" | "rings" | "japan" | "orb" | "samurai";
};

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
        galaxy: [0, 0.7, 6.2],
        knot: [0, 0.4, 6.2],
        wave: [0, 1.9, 5.0],
        rings: [0, 0, 5.5],
        japan: [0, 0.4, 6.6],
        orb: [0, 0, 5.0],
        samurai: [0, 0, 6.2],
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
      } else if (variant === "samurai") {
        // Rising-sun disc behind the blades
        const cnv = document.createElement("canvas");
        cnv.width = cnv.height = 256;
        const g2d = cnv.getContext("2d");
        if (g2d) {
          const grd = g2d.createRadialGradient(128, 128, 6, 128, 128, 128);
          const r1 = (accent[0] * 255) | 0, g1 = (accent[1] * 255) | 0, b1 = (accent[2] * 255) | 0;
          const r2 = (accent2[0] * 255) | 0, g2 = (accent2[1] * 255) | 0, b2 = (accent2[2] * 255) | 0;
          grd.addColorStop(0, `rgba(${r1},${g1},${b1},0.9)`);
          grd.addColorStop(0.5, `rgba(${r2},${g2},${b2},0.4)`);
          grd.addColorStop(1, "rgba(0,0,0,0)");
          g2d.fillStyle = grd;
          g2d.fillRect(0, 0, 256, 256);
        }
        const sunTex = new THREE.CanvasTexture(cnv);
        const sunGeo = new THREE.PlaneGeometry(5.5, 5.5);
        const sunMat = new THREE.MeshBasicMaterial({
          map: sunTex,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          opacity: 0.85,
        });
        disposables.push(sunGeo, sunMat, sunTex);
        const sun = new THREE.Mesh(sunGeo, sunMat);
        sun.position.set(0, 0.2, -2.2);
        scene.add(sun);

        // Build one katana (blade + tip + tsuba guard + handle), pointing up (+Y)
        const mkEdge = (
          geo: import("three").BufferGeometry,
          y: number,
          mat: import("three").LineBasicMaterial,
          parent: import("three").Group,
        ) => {
          const eg = new THREE.EdgesGeometry(geo);
          disposables.push(geo, eg);
          const s = new THREE.LineSegments(eg, mat);
          s.position.y = y;
          parent.add(s);
          return s;
        };
        const katana = new THREE.Group();
        const bladeMat = new THREE.LineBasicMaterial({
          color: cA,
          transparent: true,
          opacity: 0.6,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const gripMat = new THREE.LineBasicMaterial({
          color: cB,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        disposables.push(bladeMat, gripMat);
        mkEdge(new THREE.BoxGeometry(0.05, 2.7, 0.03), 1.5, bladeMat, katana); // blade
        mkEdge(new THREE.ConeGeometry(0.035, 0.4, 4), 2.95, bladeMat, katana); // tip
        const guardGeo = new THREE.TorusGeometry(0.14, 0.02, 6, 24);
        const guardEg = new THREE.EdgesGeometry(guardGeo);
        disposables.push(guardGeo, guardEg);
        const guard = new THREE.LineSegments(guardEg, gripMat);
        guard.position.y = 0.12;
        katana.add(guard);
        mkEdge(new THREE.BoxGeometry(0.06, 0.75, 0.04), -0.3, gripMat, katana); // handle

        // Pivot at the hand so the blade swings like a real strike
        const pivot = new THREE.Group();
        pivot.add(katana);
        pivot.position.set(0, -0.7, 0.3);
        scene.add(pivot);

        // Glowing slash-trail arc (flashes when the blade sweeps, then fades)
        const trailGeo = new THREE.TorusGeometry(2.5, 0.05, 8, 64, Math.PI * 1.25);
        const trailMat = new THREE.MeshBasicMaterial({
          color: cA,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide,
        });
        disposables.push(trailGeo, trailMat);
        const trail = new THREE.Mesh(trailGeo, trailMat);
        trail.position.set(0, -0.7, 0.25);
        trail.rotation.z = -0.55;
        scene.add(trail);

        // Iaido slash cycle: rest → fast strike → hold+fade → slow return
        const REST = 0.95;
        const END = -1.25;
        const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
        const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
        updaters.push((t) => {
          const P = 4.2;
          const l = t % P;
          let ang = REST;
          let trailOp = 0;
          let glow = 0.55;
          if (l < 0.9) {
            ang = REST;
          } else if (l < 1.28) {
            const k = easeOut((l - 0.9) / 0.38);
            ang = REST + (END - REST) * k;
            trailOp = 1;
            glow = 1;
          } else if (l < 2.4) {
            ang = END;
            const k = (l - 1.28) / 1.12;
            trailOp = 1 - k;
            glow = 0.95 - 0.4 * k;
          } else {
            const k = easeInOut((l - 2.4) / (P - 2.4));
            ang = END + (REST - END) * k;
          }
          pivot.rotation.z = ang;
          trailMat.opacity = Math.max(0, trailOp) * 0.75;
          bladeMat.opacity = glow;
        });

        // Concentric wireframe rings around the sun
        for (let k = 0; k < 3; k++) {
          const rr = 1.8 + k * 0.6;
          const rg = new THREE.TorusGeometry(rr, 0.007, 6, isMobile ? 60 : 110);
          const rm = new THREE.MeshBasicMaterial({
            color: cA.clone().lerp(cB, k / 3),
            transparent: true,
            opacity: 0.22 - k * 0.05,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          });
          disposables.push(rg, rm);
          const ring = new THREE.Mesh(rg, rm);
          ring.position.set(0, 0.2, -1.9);
          scene.add(ring);
          spinners.push({ obj: ring, sx: 0, sy: 0, sz: 0.03 + k * 0.01 });
        }

        // Drifting embers rising
        const embers = makePoints(
          isMobile ? 500 : 1100,
          () => [
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 6 + 0.2,
            (Math.random() - 0.5) * 3 - 0.6,
            Math.random(),
          ],
          isMobile ? 0.05 : 0.035,
        );
        scene.add(embers);
        const eAttr = embers.geometry.getAttribute("position") as import("three").BufferAttribute;
        updaters.push((_t, dt) => {
          for (let i = 0; i < eAttr.count; i++) {
            let y = eAttr.getY(i) + dt * 0.28;
            if (y > 3.6) y = -3.2;
            eAttr.setY(i, y);
          }
          eAttr.needsUpdate = true;
          embers.rotation.y += dt * 0.02;
        });
      } else if (variant === "orb") {
        // Soft glow halo behind the orb
        const cnv = document.createElement("canvas");
        cnv.width = cnv.height = 256;
        const g2d = cnv.getContext("2d");
        if (g2d) {
          const grd = g2d.createRadialGradient(128, 128, 6, 128, 128, 128);
          const r1 = (accent[0] * 255) | 0, g1 = (accent[1] * 255) | 0, b1 = (accent[2] * 255) | 0;
          const r2 = (accent2[0] * 255) | 0, g2 = (accent2[1] * 255) | 0, b2 = (accent2[2] * 255) | 0;
          grd.addColorStop(0, `rgba(${r1},${g1},${b1},0.9)`);
          grd.addColorStop(0.5, `rgba(${r2},${g2},${b2},0.45)`);
          grd.addColorStop(1, "rgba(0,0,0,0)");
          g2d.fillStyle = grd;
          g2d.fillRect(0, 0, 256, 256);
        }
        const haloTex = new THREE.CanvasTexture(cnv);
        const haloGeo = new THREE.PlaneGeometry(6.5, 6.5);
        const haloMat = new THREE.MeshBasicMaterial({
          map: haloTex,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          opacity: 0.55,
        });
        disposables.push(haloGeo, haloMat, haloTex);
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.position.set(0, 0, -2.2);
        scene.add(halo);

        // Morphing orb — animated wireframe + shared points, displaced by noise each frame
        const detail = isMobile ? 2 : 3;
        const orbGeo = new THREE.IcosahedronGeometry(1.7, detail);
        const orbMat = new THREE.MeshBasicMaterial({
          color: cA,
          wireframe: true,
          transparent: true,
          opacity: 0.5,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const ptsMat = new THREE.PointsMaterial({
          color: cB,
          size: isMobile ? 0.05 : 0.035,
          sizeAttenuation: true,
          transparent: true,
          opacity: 0.9,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        disposables.push(orbGeo, orbMat, ptsMat);
        const orb = new THREE.Mesh(orbGeo, orbMat);
        const orbPts = new THREE.Points(orbGeo, ptsMat);
        scene.add(orb);
        scene.add(orbPts);
        spinners.push({ obj: orb, sx: 0.03, sy: 0.08, sz: 0 });
        spinners.push({ obj: orbPts, sx: 0.03, sy: 0.08, sz: 0 });

        const posAttr = orbGeo.getAttribute("position") as import("three").BufferAttribute;
        const orig = new Float32Array(posAttr.array as ArrayLike<number>);
        updaters.push((t) => {
          const amp = 0.12 + Math.min(Math.abs(pointer.x) + Math.abs(pointer.y), 1) * 0.12;
          for (let i = 0; i < posAttr.count; i++) {
            const ix = i * 3;
            const ox = orig[ix], oy = orig[ix + 1], oz = orig[ix + 2];
            const f =
              1 +
              amp *
                ((Math.sin(ox * 2 + t * 1.2) + Math.sin(oy * 2 + t * 1.5) + Math.sin(oz * 2 + t * 0.9)) / 3);
            posAttr.setXYZ(i, ox * f, oy * f, oz * f);
          }
          posAttr.needsUpdate = true;
        });

        // Faint outer shell for depth
        const shellGeo = new THREE.IcosahedronGeometry(2.7, 0);
        const shell = makeWire(shellGeo, cB, 0.12, true);
        scene.add(shell);
        spinners.push({ obj: shell, sx: 0.01, sy: -0.03, sz: 0.02 });
      } else if (variant === "japan") {
        // Rising-sun disc (radial-gradient canvas texture)
        const cnv = document.createElement("canvas");
        cnv.width = cnv.height = 256;
        const g2d = cnv.getContext("2d");
        if (g2d) {
          const grd = g2d.createRadialGradient(128, 128, 8, 128, 128, 128);
          const r1 = (accent[0] * 255) | 0, g1 = (accent[1] * 255) | 0, b1 = (accent[2] * 255) | 0;
          const r2 = (accent2[0] * 255) | 0, g2 = (accent2[1] * 255) | 0, b2 = (accent2[2] * 255) | 0;
          grd.addColorStop(0, `rgba(${r1},${g1},${b1},0.95)`);
          grd.addColorStop(0.45, `rgba(${r2},${g2},${b2},0.55)`);
          grd.addColorStop(1, "rgba(0,0,0,0)");
          g2d.fillStyle = grd;
          g2d.fillRect(0, 0, 256, 256);
        }
        const sunTex = new THREE.CanvasTexture(cnv);
        const sunGeo = new THREE.PlaneGeometry(5.4, 5.4);
        const sunMat = new THREE.MeshBasicMaterial({
          map: sunTex,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          opacity: 0.9,
        });
        disposables.push(sunGeo, sunMat, sunTex);
        const sun = new THREE.Mesh(sunGeo, sunMat);
        sun.position.set(0, 0.3, -1.6);
        scene.add(sun);

        // Concentric wireframe rings around the sun
        for (let k = 0; k < 4; k++) {
          const rr = 1.6 + k * 0.55;
          const rg = new THREE.TorusGeometry(rr, 0.008, 6, isMobile ? 60 : 120);
          const rm = new THREE.MeshBasicMaterial({
            color: cA.clone().lerp(cB, k / 4),
            transparent: true,
            opacity: 0.35 - k * 0.05,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          });
          disposables.push(rg, rm);
          const ring = new THREE.Mesh(rg, rm);
          ring.position.set(0, 0.3, -1.3);
          scene.add(ring);
          spinners.push({ obj: ring, sx: 0, sy: 0, sz: 0.04 + k * 0.01 });
        }

        // Radial rising-sun rays
        const RAYS = isMobile ? 20 : 32;
        const rayPos = new Float32Array(RAYS * 2 * 3);
        for (let k = 0; k < RAYS; k++) {
          const a = (k / RAYS) * Math.PI * 2;
          rayPos[k * 6 + 0] = Math.cos(a) * 2.3;
          rayPos[k * 6 + 1] = Math.sin(a) * 2.3 + 0.3;
          rayPos[k * 6 + 2] = -1.5;
          rayPos[k * 6 + 3] = Math.cos(a) * 5.4;
          rayPos[k * 6 + 4] = Math.sin(a) * 5.4 + 0.3;
          rayPos[k * 6 + 5] = -1.5;
        }
        const rayGeo = new THREE.BufferGeometry();
        rayGeo.setAttribute("position", new THREE.BufferAttribute(rayPos, 3));
        const rayMat = new THREE.LineBasicMaterial({
          color: cA,
          transparent: true,
          opacity: 0.12,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        disposables.push(rayGeo, rayMat);
        const rays = new THREE.LineSegments(rayGeo, rayMat);
        scene.add(rays);
        spinners.push({ obj: rays, sx: 0, sy: 0, sz: 0.02 });

        // Wireframe torii gate
        const torii = new THREE.Group();
        const beam = (w: number, h: number, d: number, x: number, y: number) => {
          const bg = new THREE.BoxGeometry(w, h, d);
          const eg = new THREE.EdgesGeometry(bg);
          const mm = new THREE.LineBasicMaterial({
            color: cA,
            transparent: true,
            opacity: 0.72,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          });
          disposables.push(bg, eg, mm);
          const seg = new THREE.LineSegments(eg, mm);
          seg.position.set(x, y, 0);
          torii.add(seg);
        };
        beam(0.16, 3, 0.16, -1.15, 0); // left pillar
        beam(0.16, 3, 0.16, 1.15, 0); // right pillar
        beam(3.3, 0.28, 0.28, 0, 1.55); // kasagi (top beam)
        beam(2.7, 0.16, 0.2, 0, 0.95); // nuki (lower beam)
        torii.position.set(0, -0.3, 0.2);
        scene.add(torii);
        updaters.push((t) => {
          torii.rotation.y = Math.sin(t * 0.25) * 0.28;
          torii.position.y = -0.3 + Math.sin(t * 0.6) * 0.05;
        });

        // Drifting embers / petals rising
        const petals = makePoints(
          isMobile ? 600 : 1400,
          () => [
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 6 + 0.3,
            (Math.random() - 0.5) * 3 - 0.5,
            Math.random(),
          ],
          isMobile ? 0.05 : 0.035,
        );
        scene.add(petals);
        const pAttr = petals.geometry.getAttribute("position") as import("three").BufferAttribute;
        updaters.push((_t, dt) => {
          for (let i = 0; i < pAttr.count; i++) {
            let y = pAttr.getY(i) + dt * 0.25;
            if (y > 3.6) y = -3.2;
            pAttr.setY(i, y);
          }
          pAttr.needsUpdate = true;
          petals.rotation.y += dt * 0.02;
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
