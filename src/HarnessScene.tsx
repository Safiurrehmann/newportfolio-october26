import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const layers = [
  "Tools",
  "Memory",
  "Guardrails",
  "Evaluation",
  "Human review",
  "Durable state",
];
const descriptions = [
  "Typed tools give the model a precise interface to real actions.",
  "Context and retrieval keep the next decision informed.",
  "Permissions and validation keep actions within the allowed scope.",
  "Checks and traces make the quality of the work observable.",
  "People resolve ambiguity and approve consequential decisions.",
  "Checkpoints let work pause, resume, and recover.",
];
const starts = [0.12, 0.17, 0.32, 0.37, 0.52, 0.57];
const targets = [
  [-1.95, 1.22, 0],
  [0, 1.7, 0],
  [1.95, 1.22, 0],
  [-1.95, -1.15, 0],
  [0, -1.7, 0],
  [1.95, -1.15, 0],
];
const clamp = THREE.MathUtils.clamp;
const smooth = (a: number, b: number, x: number) =>
  THREE.MathUtils.smoothstep(x, a, b);

export default function HarnessScene({
  progress,
  paused,
  reduced,
  theme,
}: {
  progress: number;
  paused: boolean;
  reduced: boolean;
  theme: string;
}) {
  const mount = useRef<HTMLDivElement>(null);
  const labels = useRef<(HTMLButtonElement | null)[]>([]);
  const coreLabel = useRef<HTMLSpanElement>(null);
  const latest = useRef({ progress, paused, reduced, theme });
  latest.current = { progress, paused, reduced, theme };
  const [failed, setFailed] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const host = mount.current!;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setClearColor(0, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.prepend(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0.1, 11.8);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const env = pmrem.fromScene(room, 0.04);
    scene.environment = env.texture;
    room.dispose();
    pmrem.dispose();
    scene.add(new THREE.AmbientLight(0xa5e8bd, 2));
    const light = new THREE.DirectionalLight(0xe3ffee, 5);
    light.position.set(-3, 4, 5);
    scene.add(light);
    const purple = new THREE.PointLight(0xa5a0ff, 14, 15);
    purple.position.set(3, -1, 3);
    scene.add(purple);
    const core = new THREE.Group();
    scene.add(core);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x7ed2a3,
      metalness: 0.52,
      roughness: 0.19,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      emissive: 0x173e2b,
      emissiveIntensity: 0.8,
    });
    const gem = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.88, 1),
      material,
    );
    core.add(gem);
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0xc3ffe0,
      transparent: true,
      opacity: 0.28,
    });
    core.add(
      new THREE.LineSegments(new THREE.EdgesGeometry(gem.geometry), edgeMat),
    );
    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.05, 2),
      new THREE.MeshBasicMaterial({
        color: 0x8fc8a9,
        wireframe: true,
        transparent: true,
        opacity: 0.095,
      }),
    );
    core.add(shell);
    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTexture(),
        color: 0x62daa4,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    glow.scale.set(4.2, 4.2, 1);
    scene.add(glow);
    const rings: THREE.LineLoop[] = [];
    for (let i = 0; i < 3; i++) {
      const points = Array.from({ length: 160 }, (_, k) => {
        const t = (k / 160) * Math.PI * 2;
        return new THREE.Vector3(
          Math.cos(t) * (1.72 + i * 0.35),
          Math.sin(t) * (1.72 + i * 0.35),
          0,
        );
      });
      const ring = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({
          color: i === 1 ? 0xc3b8ee : 0xa8d8b7,
          transparent: true,
          opacity: 0.16,
        }),
      );
      ring.rotation.set(0.7 + i * 0.54, i * 0.6, i * 0.4);
      scene.add(ring);
      rings.push(ring);
    }
    const nodeMeshes = layers.map((_, i) => {
      const group = new THREE.Group();
      const m = new THREE.MeshStandardMaterial({
        color: i < 2 ? 0x9ce6bc : i < 4 ? 0xb6a9df : 0xe4d29f,
        roughness: 0.23,
        metalness: 0.5,
        transparent: true,
      });
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.23, 0.23), m);
      group.add(mesh);
      const halo = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(0.34, 0.34, 0.34)),
        new THREE.LineBasicMaterial({
          color: m.color,
          transparent: true,
          opacity: 0.5,
        }),
      );
      group.add(halo);
      scene.add(group);
      return group;
    });
    const connectionPositions = new Float32Array(6 * 2 * 3);
    const conGeo = new THREE.BufferGeometry();
    conGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(connectionPositions, 3),
    );
    const conMat = new THREE.LineBasicMaterial({
      color: 0x9fcdb1,
      transparent: true,
      opacity: 0,
    });
    scene.add(new THREE.LineSegments(conGeo, conMat));
    const boundaryMat = new THREE.LineBasicMaterial({
      color: 0x80b599,
      transparent: true,
      opacity: 0,
    });
    const boundary = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(5.0, 4.1, 0.65)),
      boundaryMat,
    );
    scene.add(boundary);
    const specksPositions = new Float32Array(90 * 3);
    for (let i = 0; i < 90; i++) {
      const theta = i * 2.39996;
      const y = 1 - i / 45;
      const r = Math.sqrt(1 - y * y) * 3.1;
      specksPositions.set(
        [Math.cos(theta) * r, y * 3.1, Math.sin(theta) * r],
        i * 3,
      );
    }
    const specksGeo = new THREE.BufferGeometry();
    specksGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(specksPositions, 3),
    );
    const specks = new THREE.Points(
      specksGeo,
      new THREE.PointsMaterial({
        color: 0x97b5a1,
        size: 0.018,
        transparent: true,
        opacity: 0.35,
      }),
    );
    scene.add(specks);

    let width = 1,
      height = 1,
      visible = true,
      disposed = false,
      raf = 0,
      angle = 0,
      last = performance.now(),
      previous = "";
    const size = () => {
      width = host.clientWidth;
      height = host.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.position.z = camera.aspect < 0.9 ? 13.2 : 11.8;
      camera.updateProjectionMatrix();
      previous = "";
    };
    const resize = new ResizeObserver(size);
    resize.observe(host);
    size();
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
      },
      { rootMargin: "80px" },
    );
    observer.observe(host);
    const contextLost = (event: Event) => {
      event.preventDefault();
      setFailed(true);
      visible = false;
    };
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    const projected = new THREE.Vector3();
    function tick(now: number) {
      if (disposed) return;
      raf = requestAnimationFrame(tick);
      const delta = Math.min(now - last, 50) / 1000;
      last = now;
      const state = latest.current;
      if (!visible || document.hidden) return;
      const key = `${state.progress.toFixed(4)}-${state.paused}-${state.reduced}-${state.theme}-${width}`;
      if ((state.paused || state.reduced) && key === previous) return;
      previous = key;
      if (!state.paused && !state.reduced) angle += delta * 0.22;
      const p = state.progress;
      const settle = smooth(0.76, 0.94, p);
      core.rotation.set(
        0.1 + angle * 0.2,
        angle * 0.7 + (state.reduced ? 0 : p * 2),
        0.08,
      );
      shell.rotation.y = -angle * 0.3;
      core.scale.setScalar(1 - settle * 0.23);
      if (coreLabel.current) {
        projected.copy(core.position).project(camera);
        coreLabel.current.style.left = `${(projected.x * 0.5 + 0.5) * width}px`;
        coreLabel.current.style.top = `${(-projected.y * 0.5 + 0.5) * height}px`;
      }
      glow.material.opacity = state.theme === "light" ? 0.07 : 0.2;
      rings.forEach((ring, i) => {
        ring.rotation.z =
          angle * (i === 1 ? -0.25 : 0.2) +
          i * 0.6 +
          (state.reduced ? 0 : p * 1.4);
        (ring.material as THREE.LineBasicMaterial).opacity =
          (0.13 + smooth(starts[i * 2] - 0.04, starts[i * 2] + 0.1, p) * 0.15) *
          (1 - settle * 0.9);
      });
      nodeMeshes.forEach((node, i) => {
        const appear = smooth(starts[i] - 0.04, starts[i] + 0.035, p);
        const theta = angle * (i % 2 ? -0.8 : 1) + (i * Math.PI) / 3;
        const radius = 1.85 + (i % 3) * 0.28 + (1 - appear) * 0.7;
        const x = Math.cos(theta) * radius;
        const y = Math.sin(theta) * radius * 0.64;
        const z = Math.sin(theta + i * 0.5) * 1.05;
        node.position.set(
          THREE.MathUtils.lerp(x, targets[i][0], settle),
          THREE.MathUtils.lerp(y, targets[i][1], settle),
          THREE.MathUtils.lerp(z, targets[i][2], settle),
        );
        node.scale.setScalar(appear);
        node.rotation.set(angle * 0.4, angle * 0.6, angle * 0.2);
        node.visible = appear > 0.01;
        const label = labels.current[i];
        if (label) {
          projected.copy(node.position).project(camera);
          label.style.left = `${(projected.x * 0.5 + 0.5) * width}px`;
          label.style.top = `${(-projected.y * 0.5 + 0.5) * height + 19}px`;
          label.style.opacity = String(appear);
          label.style.visibility = appear > 0.8 ? "visible" : "hidden";
          label.disabled = appear < 0.8;
        }
        connectionPositions.set(
          [0, 0, 0, node.position.x, node.position.y, node.position.z],
          i * 6,
        );
      });
      conGeo.attributes.position.needsUpdate = true;
      conMat.opacity = settle * 0.42;
      boundaryMat.opacity = settle * 0.32;
      boundary.rotation.set((1 - settle) * 0.2, (1 - settle) * 0.3, 0);
      boundary.scale.setScalar(0.9 + settle * 0.1);
      specks.rotation.y = angle * 0.04;
      renderer.render(scene, camera);
    }
    raf = requestAnimationFrame(tick);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resize.disconnect();
      observer.disconnect();
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      scene.traverse((object) => {
        const obj = object as THREE.Mesh;
        obj.geometry?.dispose();
        if (obj.material) {
          const mats = Array.isArray(obj.material)
            ? obj.material
            : [obj.material];
          mats.forEach((mat) => {
            if ("map" in mat && mat.map instanceof THREE.Texture)
              mat.map.dispose();
            mat.dispose();
          });
        }
      });
      env.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className="scene-shell">
      <div className={`scene-host ${failed ? "scene-failed" : ""}`} ref={mount}>
        {failed && (
          <div className="fallback-core" aria-hidden="true">
            <div />
          </div>
        )}
        <span className="core-label" ref={coreLabel} aria-label="LLM core — language model">LLM CORE</span>
        {layers.map((layer, i) => (
          <button
            key={layer}
            className={`scene-label ${selected === i ? "selected" : ""}`}
            ref={(el) => {
              labels.current[i] = el;
            }}
            onClick={() => setSelected(selected === i ? null : i)}
            aria-pressed={selected === i}
            style={
              failed
                ? {
                    left: `${20 + (i % 3) * 30}%`,
                    top: `${25 + Math.floor(i / 3) * 42}%`,
                    opacity: 1,
                    visibility: "visible",
                  }
                : undefined
            }
          >
            <i />
            {layer}
          </button>
        ))}
      </div>
      {selected !== null && (
        <div className="layer-description" role="status">
          <span className="mono">{layers[selected]}</span>
          <p>{descriptions[selected]}</p>
          <button
            onClick={() => setSelected(null)}
            aria-label="Close layer description"
          >
            ×
          </button>
        </div>
      )}
      <div className={`workflow-output ${progress > 0.89 ? "shown" : ""}`}>
        <span className="mono">DRAWINGS</span>
        <span>→</span>
        <span className="mono">AGENT HARNESS</span>
        <span>→</span>
        <span className="mono">ESTIMATE</span>
      </div>
    </div>
  );
}

function glowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255,255,255,.8)");
  gradient.addColorStop(0.3, "rgba(255,255,255,.2)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}
