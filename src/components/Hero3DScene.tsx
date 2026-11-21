import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export type Hero3DMode = 'stress' | 'cfd' | 'fracture';

const CORE_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  uniform float uFreq;
  uniform vec2 uPointer;

  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vDisplace;

  // Compact 3D Simplex Noise (Ashima Arts)
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    float n1 = snoise(position * uFreq + vec3(uTime * 0.35, -uTime * 0.22, uTime * 0.18));
    float n2 = snoise(position * (uFreq * 2.1) - vec3(uTime * 0.45));
    float disp = (n1 * 0.72 + n2 * 0.28) * uAmp;

    // Subtle pointer attractor bulge
    float pointerInf = dot(normalize(position.xy + 0.001), normalize(uPointer + 0.001));
    disp += max(pointerInf, 0.0) * length(uPointer) * 0.08;

    vDisplace = disp;
    vec3 displaced = position + normal * disp;
    vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);
    vWorldPos = worldPosition.xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const CORE_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform int uMode;

  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vDisplace;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fresnel = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), 2.35);

    // Contour elevation lines across displacement ridges
    float contour = abs(fract(vDisplace * 16.0 - uTime * 0.3) - 0.5);
    float ridgeLine = smoothstep(0.06, 0.0, contour);

    vec3 obsidian = vec3(0.04, 0.055, 0.085);
    vec3 cyan = vec3(0.18, 0.90, 0.84);
    vec3 amber = vec3(0.96, 0.72, 0.44);
    vec3 violet = vec3(0.55, 0.48, 1.00);

    vec3 primaryGlow = uMode == 0 ? cyan : (uMode == 1 ? violet : amber);
    vec3 secondaryGlow = uMode == 0 ? amber : (uMode == 1 ? cyan : violet);

    float peak = smoothstep(-0.18, 0.28, vDisplace);
    vec3 col = mix(obsidian, primaryGlow * 0.55, peak * 0.65);
    col += secondaryGlow * ridgeLine * 0.55;
    col += primaryGlow * fresnel * 1.45;
    col += vec3(0.96, 0.95, 0.92) * pow(fresnel, 4.0) * 0.65;

    gl_FragColor = vec4(col, 0.94);
  }
`;

const PARTICLE_VERTEX = /* glsl */ `
  attribute float aScale;
  attribute float aPhase;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform int uMode;
  varying float vAlpha;
  varying float vTint;

  void main() {
    vec3 pos = position;
    float angle = uTime * (0.28 + aPhase * 0.14) + aPhase * 6.2831;

    if (uMode == 1) {
      // Helical CFD upward cuttings spiral
      float r = length(pos.xz);
      pos.x = cos(angle) * r;
      pos.z = sin(angle) * r;
      pos.y = mod(pos.y + uTime * 0.65 + 2.8, 5.6) - 2.8;
    } else if (uMode == 2) {
      // Fracture planar compression pulsing
      pos *= 0.95 + 0.1 * sin(uTime * 1.4 + aPhase * 6.0);
      pos.y *= 0.58;
    } else {
      // Orbital geomechanical tensor cloud
      float s = sin(uTime * 0.25 + aPhase * 3.14);
      float c = cos(uTime * 0.25 + aPhase * 3.14);
      pos.xz = mat2(c, -s, s, c) * pos.xz;
    }

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = aScale * uPixelRatio * (18.0 / max(-mvPos.z, 1.2));
    vAlpha = clamp(1.0 - (-mvPos.z - 2.0) / 10.0, 0.2, 0.95);
    vTint = aPhase;
  }
`;

const PARTICLE_FRAGMENT = /* glsl */ `
  varying float vAlpha;
  varying float vTint;
  uniform int uMode;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float glow = pow(1.0 - d * 2.0, 2.0);

    vec3 cyan = vec3(0.18, 0.90, 0.84);
    vec3 amber = vec3(0.96, 0.72, 0.44);
    vec3 violet = vec3(0.55, 0.48, 1.00);

    vec3 c = mix(cyan, uMode == 1 ? violet : amber, smoothstep(0.35, 0.85, vTint));
    gl_FragColor = vec4(c, glow * vAlpha);
  }
`;

export function Hero3DScene({ reducedMotion }: { reducedMotion: boolean }) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<Hero3DMode>('stress');
  const modeRef = useRef<Hero3DMode>(mode);
  const reducedRef = useRef<boolean>(reducedMotion);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    reducedRef.current = reducedMotion;
  }, [reducedMotion]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(container.clientWidth || 640, container.clientHeight || 560);
    renderer.setClearColor(0x000000, 0);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      (container.clientWidth || 640) / Math.max(container.clientHeight || 560, 1),
      0.1,
      100
    );
    camera.position.set(0, 0.1, 6.4);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Central Deforming 3D Geomechanical Core
    const coreGeo = new THREE.IcosahedronGeometry(1.48, 36);
    const coreUniforms = {
      uTime: { value: 0 },
      uAmp: { value: 0.24 },
      uFreq: { value: 1.55 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uMode: { value: 0 },
    };
    const coreMat = new THREE.ShaderMaterial({
      vertexShader: CORE_VERTEX,
      fragmentShader: CORE_FRAGMENT,
      uniforms: coreUniforms,
      transparent: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreMesh);

    // 2. Outer Geodesic Stress-Tensor Cage
    const cageGeo = new THREE.IcosahedronGeometry(1.92, 2);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x2ee6d6,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    rootGroup.add(cageMesh);

    // 3. Wellbore Orbital Gimbal Rings
    const ring1Geo = new THREE.TorusGeometry(2.35, 0.012, 12, 120);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0xf5b971,
      transparent: true,
      opacity: 0.5,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.set(Math.PI * 0.36, Math.PI * 0.12, 0);
    rootGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.72, 0.01, 12, 120);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x8b7cff,
      transparent: true,
      opacity: 0.42,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.set(-Math.PI * 0.28, Math.PI * 0.32, 0.4);
    rootGroup.add(ring2);

    // 4. Inner Acoustic Helix Knot
    const knotGeo = new THREE.TorusKnotGeometry(1.62, 0.016, 160, 12, 2, 3);
    const knotMat = new THREE.MeshBasicMaterial({
      color: 0x2ee6d6,
      transparent: true,
      opacity: 0.22,
    });
    const knotMesh = new THREE.Mesh(knotGeo, knotMat);
    rootGroup.add(knotMesh);

    // 5. Volumetric 3D Cuttings / Fluid Particle Field (2,200 points)
    const count = 2200;
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const r = 1.85 + Math.random() * 2.15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.92;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      scales[i] = 1.4 + Math.random() * 2.8;
      phases[i] = Math.random();
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    particleGeo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    const particleUniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: dpr },
      uMode: { value: 0 },
    };
    const particleMat = new THREE.ShaderMaterial({
      vertexShader: PARTICLE_VERTEX,
      fragmentShader: PARTICLE_FRAGMENT,
      uniforms: particleUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particles);

    // Pointer drag + parallax state
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let targetRot = { x: 0.15, y: 0 };
    let currentRot = { x: 0.15, y: 0 };
    let pointerNorm = { x: 0, y: 0 };
    let scrollFactor = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragStart = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointerNorm.x = ((e.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
      pointerNorm.y = -(((e.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1);

      if (isDragging) {
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        dragStart = { x: e.clientX, y: e.clientY };
        targetRot.y += dx * 0.008;
        targetRot.x += dy * 0.008;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onScroll = () => {
      scrollFactor = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.5);
    };

    const onResize = () => {
      if (!renderer || !container) return;
      const w = Math.max(container.clientWidth, 280);
      const h = Math.max(container.clientHeight, 280);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    let rafId = 0;
    const start = performance.now();

    const animate = (now: number) => {
      const t = reducedRef.current ? 1.2 : (now - start) * 0.001;
      const mIdx =
        modeRef.current === 'stress' ? 0 : modeRef.current === 'cfd' ? 1 : 2;

      coreUniforms.uTime.value = t;
      coreUniforms.uMode.value = mIdx;
      coreUniforms.uAmp.value +=
        ((mIdx === 0 ? 0.24 : mIdx === 1 ? 0.16 : 0.34) - coreUniforms.uAmp.value) *
        0.06;
      coreUniforms.uFreq.value +=
        ((mIdx === 0 ? 1.55 : mIdx === 1 ? 2.15 : 2.65) - coreUniforms.uFreq.value) *
        0.06;
      coreUniforms.uPointer.value.lerp(
        new THREE.Vector2(pointerNorm.x, pointerNorm.y),
        0.08
      );

      particleUniforms.uTime.value = t;
      particleUniforms.uMode.value = mIdx;

      // Continuous rotation + pointer inertia + scroll dive
      if (!isDragging && !reducedRef.current) {
        targetRot.y += 0.0032;
      }
      currentRot.x += (targetRot.x + pointerNorm.y * 0.25 - currentRot.x) * 0.06;
      currentRot.y += (targetRot.y + pointerNorm.x * 0.35 - currentRot.y) * 0.06;

      rootGroup.rotation.x = currentRot.x;
      rootGroup.rotation.y = currentRot.y + scrollFactor * 0.9;

      cageMesh.rotation.y = -t * 0.18;
      cageMesh.rotation.z = t * 0.11;
      ring1.rotation.z = t * 0.22;
      ring2.rotation.z = -t * 0.16;
      knotMesh.rotation.x = t * 0.14;
      knotMesh.rotation.y = -t * 0.2;

      // Scroll-driven camera zoom
      camera.position.z = 6.4 - scrollFactor * 1.45;
      camera.position.y = 0.1 - scrollFactor * 0.35;

      renderer?.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      coreGeo.dispose();
      coreMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      knotGeo.dispose();
      knotMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer?.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[420px] sm:h-[490px] lg:h-[580px] select-none">
      {/* Radial ambient glow framing the 3D artifact */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-6 rounded-full bg-[radial-gradient(circle_at_center,rgba(46,230,214,0.18),rgba(139,124,255,0.08)_45%,transparent_72%)] blur-2xl"
      />

      {/* Interactive Three.js WebGL Mount */}
      <div
        ref={mountRef}
        data-cursor="DRAG 3D"
        aria-label="Interactive 3D Geomechanical Stress & Fluid Observatory"
        className="relative w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Top HUD Readout */}
      <div className="pointer-events-none absolute top-2 left-2 right-2 flex items-center justify-between font-mono text-[10px] tracking-[0.18em] uppercase text-[#98A2B3]">
        <span className="rounded-full bg-black/55 backdrop-blur-md border border-white/10 px-3 py-1 text-[#2EE6D6]">
          3D WEBGL // REAL-TIME TENSOR
        </span>
        <span className="rounded-full bg-black/55 backdrop-blur-md border border-white/10 px-3 py-1 hidden sm:inline">
          DRAG TO ORBIT
        </span>
      </div>

      {/* Bottom 3D Geometry Mode Switcher */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/12 p-1.5 shadow-xl">
        {(
          [
            { id: 'stress', label: 'Stress Core' },
            { id: 'cfd', label: 'CFD Helices' },
            { id: 'fracture', label: 'Fracture Matrix' },
          ] as const
        ).map((item) => {
          const active = mode === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setMode(item.id)}
              className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                active
                  ? 'bg-[#2EE6D6] text-[#050608] font-semibold'
                  : 'text-[#98A2B3] hover:text-[#F4F1EA]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
