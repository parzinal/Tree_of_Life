"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SECTIONS } from "../lib/data";
import Link from "next/link";

const TABS = [
  { id: "roots", label: "Roots · Heritage" },
  { id: "trust", label: "Trunk · Trust" },
  { id: "b1", label: "Branch 1 · Learning Hub" },
  { id: "b2", label: "Branch 2 · Community" },
  { id: "b3", label: "Branch 3 · Tourism" },
  { id: "preserve", label: "Branches · Preservation" },
  { id: "stories", label: "Leaves · Stories" },
  { id: "fruits", label: "Fruits · Tourism" },
];
const DESTINATIONS = { roots: "heritage", trust: "trust-and-safety", b1: "awareness", b2: "digital-stories", b3: "tourism", preserve: "preservation", stories: "digital-stories", fruits: "tourism" };

export default function TreeOfLife() {
  const box = useRef(null);
  const canvas = useRef(null);
  const api = useRef({});
  const [sel, setSel] = useState({ id: "home", hit: -1 });

  // Build the 3D scene once
  useEffect(() => {
    const el = box.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas.current, antialias: true, alpha: true });
    } catch (e) {
      el.dataset.nogl = "1";
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x4a5a3a, 1.25));
    const sun = new THREE.DirectionalLight(0xfff1d0, 1.45);
    sun.position.set(8, 14, 6);
    scene.add(sun);

    // seeded random so the tree looks the same every visit
    let seed = 7;
    const rnd = () => {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const mat = (c, e = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.9, flatShading: true, emissive: e });
    const M = {
      trunk: mat(0x79502d),
      roots: mat(0x684528),
      branches: mat(0x567441),
      leaves: mat(0x438b42),
      fruits: mat(0x685033),
    };
    const UP = new THREE.Vector3(0, 1, 0);
    const tree = new THREE.Group();
    scene.add(tree);
    const pick = [], geos = [];

    function addSegment(id, start, end, radius, material = M[id], tapered = true) {
      const direction = end.clone().sub(start);
      const length = direction.length();
      const g = new THREE.CylinderGeometry(tapered ? radius * 0.12 : radius, radius, length, 6);
      geos.push(g);
      const m = new THREE.Mesh(g, material);
      m.position.copy(start).add(end).multiplyScalar(0.5);
      m.quaternion.setFromUnitVectors(UP, direction.normalize());
      m.userData.id = id;
      tree.add(m);
      pick.push(m);
      return m;
    }

    const trunkHeight = 8.2;
    const tg = new THREE.CylinderGeometry(0.25, 0.52, trunkHeight, 14, 1);
    geos.push(tg);
    const tr = new THREE.Mesh(tg, M.trunk);
    tr.position.y = trunkHeight / 2;
    tr.userData.id = "trunk";
    tree.add(tr); pick.push(tr);

    for (let y = 0.35; y < trunkHeight; y += 0.42) {
      const radius = 0.52 - (0.27 * y) / trunkHeight;
      const ringGeo = new THREE.TorusGeometry(radius, 0.035, 4, 18);
      geos.push(ringGeo);
      const ring = new THREE.Mesh(ringGeo, M.roots);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = y;
      ring.userData.id = "trunk";
      tree.add(ring);
      pick.push(ring);
    }

    // Coconut palm roots flare outward from the base of the trunk.
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8 + 0.18;
      const radial = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
      const p0 = new THREE.Vector3(0.25 * radial.x, 0.3, 0.25 * radial.z);
      const p1 = radial.clone().multiplyScalar(0.9).setY(-0.05);
      const p2 = radial.clone().multiplyScalar(1.8).setY(-0.48);
      const p3 = radial.clone().multiplyScalar(2.55).setY(-0.68);
      addSegment("roots", p0, p1, 0.23);
      addSegment("roots", p1, p2, 0.17);
      addSegment("roots", p2, p3, 0.1);
    }

    // Feathered fronds radiate from the crown and arch down toward their tips.
    const crownY = trunkHeight - 0.08;
    const frondCount = 9;
    const frondSteps = 18;
    const leafletCount = 23 * 2;
    const ribGeo = new THREE.CylinderGeometry(1, 1, 1, 6);
    const leafletGeo = new THREE.CylinderGeometry(0.02, 1, 1, 6);
    geos.push(ribGeo, leafletGeo);
    const ribInstances = new THREE.InstancedMesh(ribGeo, M.branches, frondCount * frondSteps);
    ribInstances.userData.id = "branches";
    tree.add(ribInstances);
    pick.push(ribInstances);
    const leafletInstances = new THREE.InstancedMesh(leafletGeo, M.leaves, frondCount * leafletCount);
    leafletInstances.userData.id = "leaves";
    tree.add(leafletInstances);
    pick.push(leafletInstances);
    const instanceObject = new THREE.Object3D();
    const foliageColors = [0x438b42, 0x559b4c, 0x67a750, 0x3c7e3d];
    let ribIndex = 0;
    let leafletIndex = 0;
    for (let frond = 0; frond < frondCount; frond++) {
      const angle = (frond * Math.PI * 2) / frondCount + 0.16;
      const radial = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
      const side = new THREE.Vector3(-Math.sin(angle), 0, Math.cos(angle));
      const rachisPoint = (t) => new THREE.Vector3(
        radial.x * (4.9 * t),
        crownY + 0.72 * t - 2.55 * t * t,
        radial.z * (4.9 * t)
      );
      let previous = rachisPoint(0);
      for (let step = 1; step <= frondSteps; step++) {
        const t = step / frondSteps;
        const current = rachisPoint(t);
        const direction = current.clone().sub(previous);
        instanceObject.position.copy(previous).add(current).multiplyScalar(0.5);
        instanceObject.quaternion.setFromUnitVectors(UP, direction.clone().normalize());
        instanceObject.scale.set(0.095 * (1 - t * 0.68), direction.length(), 0.095 * (1 - t * 0.68));
        instanceObject.updateMatrix();
        ribInstances.setMatrixAt(ribIndex++, instanceObject.matrix);
        previous = current;
      }

      for (let leaflet = 1; leaflet <= 23; leaflet++) {
        const t = leaflet / 25;
        const base = rachisPoint(t);
        const length = (0.52 + Math.sin(t * Math.PI) * 1.2) * (1 - t * 0.35);
        for (const direction of [-1, 1]) {
          const end = base.clone()
            .addScaledVector(side, direction * length * 0.76)
            .addScaledVector(radial, length * 0.3)
            .add(new THREE.Vector3(0, -length * (0.16 + t * 0.08), 0));
          const leafDirection = end.clone().sub(base);
          instanceObject.position.copy(base).add(end).multiplyScalar(0.5);
          instanceObject.quaternion.setFromUnitVectors(UP, leafDirection.clone().normalize());
          const leafRadius = 0.085 * (1 - t * 0.35);
          instanceObject.scale.set(leafRadius, leafDirection.length(), leafRadius);
          instanceObject.updateMatrix();
          leafletInstances.setMatrixAt(leafletIndex, instanceObject.matrix);
          leafletInstances.setColorAt(leafletIndex, new THREE.Color(foliageColors[(rnd() * foliageColors.length) | 0]));
          leafletIndex++;
        }
      }
    }
    ribInstances.instanceMatrix.needsUpdate = true;
    leafletInstances.instanceMatrix.needsUpdate = true;

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(4.2, 64),
      new THREE.MeshStandardMaterial({ color: 0x426f3e, transparent: true, opacity: 0.12, depthWrite: false })
    );
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Coconuts hang in a compact cluster directly beneath the crown.
    const fg = new THREE.SphereGeometry(0.42, 14, 10);
    geos.push(fg);
    const fruits = [];
    const coconutPositions = [
      [-0.48, 7.55, 0.05], [0.42, 7.48, 0.16], [0.03, 7.3, 0.52],
      [-0.36, 7.25, -0.4], [0.46, 7.2, -0.34],
    ];
    coconutPositions.forEach(([x, y, z], i) => {
      const f = new THREE.Mesh(fg, M.fruits);
      f.position.set(x, y, z);
      f.scale.set(0.9, 1.15, 0.9);
      f.userData = { id: "fruits", i, y: f.position.y };
      tree.add(f);
      fruits.push(f);
      pick.push(f);
    });

    // camera views
    const V = (x, y, z) => new THREE.Vector3(x, y, z);
    const home = { t: V(0, 4.3, 0), az: 0.5, el: 0.2, d: 16.5 };
    const cur = { t: home.t.clone(), az: home.az, el: home.el, d: home.d };
    const goal = { t: home.t.clone(), az: home.az, el: home.el, d: home.d };
    let auto = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reduce = !auto;
    const view = {
      home, roots: { t: V(0, -0.2, 0), el: 0.12, d: 6.5 }, trunk: { t: V(0, 4, 0), el: 0.2, d: 11 },
      branches: { t: V(0, 8.4, 0), el: 0.23, d: 11 },
      leaves: { t: V(0, 8.2, 0), el: 0.25, d: 12 }, fruits: { t: V(0, 7.5, 0), el: 0.2, d: 8 },
    };

    api.current.focus = (id) => {
      const v = view[id];
      goal.t.copy(v.t); goal.el = v.el; goal.d = v.d;
      if (v.az !== undefined) {
        const da = Math.atan2(Math.sin(v.az - cur.az), Math.cos(v.az - cur.az));
        goal.az = cur.az + da;
      }
      auto = false;
    };
    api.current.highlight = (id) => {
      for (const key in M) {
        const on = key === id;
        M[key].emissive.setHex(on ? (key === "fruits" ? 0xb87800 : 0x285020) : 0);
      }
    };

    // input: drag to orbit, wheel / pinch to zoom, tap to select
    const cv = canvas.current, ray = new THREE.Raycaster(), pts = new Map();
    let moved = 0, pd = 0;
    const down = (e) => { cv.setPointerCapture(e.pointerId); pts.set(e.pointerId, e); moved = 0; auto = false; pd = 0; };
    const move = (e) => {
      const p = pts.get(e.pointerId);
      if (!p) return;
      if (pts.size === 1) {
        goal.az -= (e.clientX - p.clientX) * 0.006;
        goal.el = Math.max(0.02, Math.min(1.2, goal.el + (e.clientY - p.clientY) * 0.005));
      }
      moved += Math.abs(e.clientX - p.clientX) + Math.abs(e.clientY - p.clientY);
      pts.set(e.pointerId, e);
      if (pts.size === 2) {
        const [a, b] = [...pts.values()], dd = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        if (pd) goal.d = Math.max(5, Math.min(34, (goal.d * pd) / dd));
        pd = dd;
      }
    };
    const up = (e) => {
      if (pts.size === 1 && moved < 6) {
        const r = cv.getBoundingClientRect();
        ray.setFromCamera({ x: ((e.clientX - r.left) / r.width) * 2 - 1, y: -(((e.clientY - r.top) / r.height) * 2 - 1) }, cam);
        const h = ray.intersectObjects(pick, false)[0];
        if (h) {
          const pickedId = h.object.userData.id;
          const id = pickedId === "trunk" ? "trust" : pickedId === "branches" ? "preserve" : pickedId === "leaves" ? "stories" : pickedId;
          setSel({ id, hit: h.object.userData.i ?? -1 });
        }
      }
      pts.delete(e.pointerId); pd = 0;
    };
    const wheel = (e) => {
      e.preventDefault();
      goal.d = Math.max(5, Math.min(34, goal.d * (1 + e.deltaY * 0.001)));
    };
    cv.addEventListener("pointerdown", down);
    cv.addEventListener("pointermove", move);
    cv.addEventListener("pointerup", up);
    cv.addEventListener("pointercancel", (e) => pts.delete(e.pointerId));
    cv.addEventListener("wheel", wheel, { passive: false });

    const resize = () => {
      const w = cv.clientWidth, h = cv.clientHeight;
      renderer.setSize(w, h, false);
      cam.aspect = w / h; cam.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(cv); resize();

    const clock = new THREE.Clock();
    renderer.setAnimationLoop(() => {
      const t = clock.getElapsedTime();
      if (auto) goal.az += 0.0025;
      cur.t.lerp(goal.t, 0.06);
      for (const key of ["az", "el", "d"]) cur[key] += (goal[key] - cur[key]) * 0.06;
      cam.position.set(
        cur.t.x + cur.d * Math.cos(cur.el) * Math.sin(cur.az),
        cur.t.y + cur.d * Math.sin(cur.el),
        cur.t.z + cur.d * Math.cos(cur.el) * Math.cos(cur.az)
      );
      cam.lookAt(cur.t);
      renderer.render(scene, cam);
    });

    return () => {
      renderer.setAnimationLoop(null);
      ro.disconnect();
      cv.removeEventListener("wheel", wheel);
      geos.forEach((g) => g.dispose());
      Object.values(M).forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, []);

  // React to selection (tabs or taps on the tree)
  useEffect(() => {
    const part = SECTIONS[sel.id].part;
    api.current.focus?.(part);
    api.current.highlight?.(part);
  }, [sel]);

  const d = SECTIONS[sel.id];
  return (
    <section id="tree" className="tree-section" ref={box}>
      <canvas ref={canvas} aria-label="Interactive 3D tree of life. Drag to rotate, scroll to zoom, and select a part to explore." />
      <div className="tree-top">
        <div className="tree-heading">
          <div>
            <h2>The 3D Tree of Life</h2>
            <p>Each tree part reflects an aspect of Lambanog heritage.</p>
          </div>
          <p className="tree-hint">Drag to rotate <span>·</span> Scroll to zoom <span>·</span> Select a part</p>
        </div>
        <div className="tabs" role="group" aria-label="Select a part of the Tree of Life">
          {TABS.map(({ id, label }) => (
            <button key={id} type="button" aria-pressed={sel.id === id} onClick={() => setSel({ id, hit: -1 })}>
              {label}
            </button>
          ))}
          <button className="reset-button" type="button" onClick={() => {
            setSel({ id: "home", hit: -1 });
            api.current.focus?.("home");
            api.current.highlight?.("home");
          }}>Reset view</button>
        </div>
      </div>
      <div className="panel" aria-live="polite">
        <h3>{d.t}</h3>
        <p className="sym">{d.s}</p>
        <p>{d.short || d.p}</p>
        {(d.short || d.f?.length > 0) && (
          <details className="panel-more">
            <summary>More details</summary>
            {d.short && <p>{d.p}</p>}
            {d.f?.length > 0 && <ul>{d.f.map((item) => <li key={item}>{item}</li>)}</ul>}
          </details>
        )}
        {d.source && (
          <a className="source-link" href={d.source.href} target="_blank" rel="noreferrer">
            {d.source.label}
          </a>
        )}
        {DESTINATIONS[sel.id] && (
          <Link className="panel-action" href={`/${DESTINATIONS[sel.id]}`}>Explore More <span aria-hidden="true">→</span></Link>
        )}
      </div>
    </section>
  );
}
