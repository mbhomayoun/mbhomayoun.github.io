import { useEffect, useRef } from 'react';
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

  float evalNoise(vec3 p) {
    float n1 = snoise(p * uFreq + vec3(uTime * 0.35, -uTime * 0.22, uTime * 0.18));
    float n2 = snoise(p * (uFreq * 2.05) - vec3(uTime * 0.42));
    return (n1 * 0.74 + n2 * 0.26) * uAmp;
  }

  void main() {
    float disp = evalNoise(position);
    float pointerInf = dot(normalize(position.xy + 0.001), normalize(uPointer + 0.001));
    disp += max(pointerInf, 0.0) * length(uPointer) * 0.07;

    float eps = 0.025;
    vec3 tangent1 = normalize(cross(normal, abs(normal.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
    vec3 tangent2 = normalize(cross(normal, tangent1));
    vec3 p1 = normalize(position + tangent1 * eps) * length(position);
    vec3 p2 = normalize(position + tangent2 * eps) * length(position);
    vec3 dPos = position + normal * disp;
    vec3 d1 = p1 + normalize(p1) * evalNoise(p1);
    vec3 d2 = p2 + normalize(p2) * evalNoise(p2);
    vec3 perturbedNormal = normalize(cross(d1 - dPos, d2 - dPos));
    if (dot(perturbedNormal, normal) < 0.0) perturbedNormal = -perturbedNormal;

    vDisplace = disp;
    vec4 worldPosition = modelMatrix * vec4(dPos, 1.0);
    vWorldPos = worldPosition.xyz;
    vNormal = normalize(normalMatrix * mix(normal, perturbedNormal, 0.72));
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
    float fresnel = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), 2.25);

    float contour = abs(fract(vDisplace * 16.0 - uTime * 0.3) - 0.5);
    float ridgeLine = smoothstep(0.06, 0.0, contour);

    vec3 obsidian = vec3(0.03, 0.045, 0.075);
    vec3 cyan = vec3(0.18, 0.90, 0.84);
    vec3 amber = vec3(0.96, 0.72, 0.44);
    vec3 violet = vec3(0.55, 0.48, 1.00);

    vec3 primaryGlow = uMode == 0 ? cyan : (uMode == 1 ? violet : amber);
    vec3 secondaryGlow = uMode == 0 ? amber : (uMode == 1 ? cyan : violet);

    float peak = smoothstep(-0.18, 0.28, vDisplace);
    vec3 col = mix(obsidian, primaryGlow * 0.58, peak * 0.65);
    col += secondaryGlow * ridgeLine * 0.6;
    col += primaryGlow * fresnel * 1.5;
    col += vec3(0.96, 0.95, 0.92) * pow(fresnel, 4.2) * 0.7;

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
    float angle = uTime * (0.24 + aPhase * 0.14) + aPhase * 6.2831;

    if (uMode == 1) {
      float r = length(pos.xz);
      pos.x = cos(angle) * r;
      pos.z = sin(angle) * r;
      pos.y = mod(pos.y + uTime * 0.65 + 3.4, 6.8) - 3.4;
    } else if (uMode == 2) {
      pos *= 0.95 + 0.1 * sin(uTime * 1.3 + aPhase * 6.0);
      pos.y *= 0.62;
    } else {
      float s = sin(uTime * 0.2 + aPhase * 3.14);
      float c = cos(uTime * 0.2 + aPhase * 3.14);
      pos.xz = mat2(c, -s, s, c) * pos.xz;
    }

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = aScale * uPixelRatio * (20.0 / max(-mvPos.z, 1.2));
    vAlpha = clamp(1.0 - (-mvPos.z - 2.2) / 11.5, 0.18, 0.92);
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

interface Hero3DSceneProps {
  mode: Hero3DMode;
  reducedMotion: boolean;
  isRtl: boolean;
}

export function Hero3DScene({ mode, reducedMotion, isRtl }: Hero3DSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const modeRef = useRef<Hero3DMode>(mode);
  const reducedRef = useRef<boolean>(reducedMotion);
  const rtlRef = useRef<boolean>(isRtl);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    reducedRef.current = reducedMotion;
  }, [reducedMotion]);

  useEffect(() => {
    rtlRef.current = isRtl;
  }, [isRtl]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isMobile,
        powerPreference: isMobile ? 'low-power' : 'high-performance',
      });
    } catch {
      return;
    }

    const dpr = isMobile
      ? Math.min(window.devicePixelRatio || 1, 1.25)
      : Math.min(window.devicePixelRatio || 1, 2);
    const initW = container.clientWidth || window.innerWidth;
    const initH = container.clientHeight || window.innerHeight;
    renderer.setPixelRatio(dpr);
    renderer.setSize(initW, initH);
    renderer.setClearColor(0x000000, 0);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, initW / Math.max(initH, 1), 0.1, 100);
    camera.position.set(0, 0.05, 6.8);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const ambientGroup = new THREE.Group();
    scene.add(ambientGroup);

    let targetPosX = 1.85;
    let targetPosY = 0.08;
    let targetPosZ = -0.3;
    let targetScale = 1.12;

    const computeSpatialTargets = (w: number, h: number) => {
      const aspect = w / Math.max(h, 1);
      if (aspect >= 1.15) {
        targetPosX = rtlRef.current ? -1.85 : 1.85;
        targetPosY = 0.08;
        targetPosZ = -0.3;
        targetScale = 1.12;
      } else {
        targetPosX = 0;
        targetPosY = 0.55;
        targetPosZ = -1.45;
        targetScale = 0.86;
      }
    };
    computeSpatialTargets(initW, initH);
    rootGroup.position.set(targetPosX, targetPosY, targetPosZ);
    rootGroup.scale.setScalar(targetScale);

    // Lightweight segments on mobile for effortless 60fps
    const segs = isMobile ? 52 : 120;
    const coreGeo = new THREE.SphereGeometry(1.48, segs, segs);
    const coreUniforms = {
      uTime: { value: 0 },
      uAmp: { value: 0.22 },
      uFreq: { value: 1.45 },
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

    const cageGeo = new THREE.IcosahedronGeometry(2.05, isMobile ? 1 : 2);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x2ee6d6,
      wireframe: true,
      transparent: true,
      opacity: isMobile ? 0.13 : 0.16,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    rootGroup.add(cageMesh);

    const ring1Geo = new THREE.TorusGeometry(2.5, 0.012, 10, isMobile ? 80 : 140);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0xf5b971,
      transparent: true,
      opacity: 0.48,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.set(Math.PI * 0.36, Math.PI * 0.12, 0);
    rootGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.92, 0.01, 10, isMobile ? 80 : 140);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x8b7cff,
      transparent: true,
      opacity: 0.4,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.set(-Math.PI * 0.28, Math.PI * 0.32, 0.4);
    rootGroup.add(ring2);

    const knotGeo = new THREE.TorusKnotGeometry(
      1.72,
      0.015,
      isMobile ? 90 : 170,
      10,
      2,
      3
    );
    const knotMat = new THREE.MeshBasicMaterial({
      color: 0x2ee6d6,
      transparent: true,
      opacity: 0.2,
    });
    const knotMesh = new THREE.Mesh(knotGeo, knotMat);
    rootGroup.add(knotMesh);

    const coreCount = isMobile ? 650 : 2100;
    const corePos = new Float32Array(coreCount * 3);
    const coreScales = new Float32Array(coreCount);
    const corePhases = new Float32Array(coreCount);

    for (let i = 0; i < coreCount; i++) {
      const r = 1.95 + Math.random() * 2.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      corePos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      corePos[i * 3 + 1] = r * Math.cos(phi) * 0.92;
      corePos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      coreScales[i] = 1.4 + Math.random() * 2.6;
      corePhases[i] = Math.random();
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(corePos, 3));
    particleGeo.setAttribute('aScale', new THREE.BufferAttribute(coreScales, 1));
    particleGeo.setAttribute('aPhase', new THREE.BufferAttribute(corePhases, 1));

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

    const ambCount = isMobile ? 260 : 1100;
    const ambPos = new Float32Array(ambCount * 3);
    const ambScales = new Float32Array(ambCount);
    const ambPhases = new Float32Array(ambCount);
    for (let i = 0; i < ambCount; i++) {
      ambPos[i * 3] = (Math.random() - 0.5) * 14.0;
      ambPos[i * 3 + 1] = (Math.random() - 0.5) * 8.0;
      ambPos[i * 3 + 2] = (Math.random() - 0.5) * 6.0 - 1.0;
      ambScales[i] = 1.0 + Math.random() * 2.1;
      ambPhases[i] = Math.random();
    }
    const ambGeo = new THREE.BufferGeometry();
    ambGeo.setAttribute('position', new THREE.BufferAttribute(ambPos, 3));
    ambGeo.setAttribute('aScale', new THREE.BufferAttribute(ambScales, 1));
    ambGeo.setAttribute('aPhase', new THREE.BufferAttribute(ambPhases, 1));
    const ambPoints = new THREE.Points(ambGeo, particleMat);
    ambientGroup.add(ambPoints);

    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let targetRot = { x: 0.14, y: -0.2 };
    let currentRot = { x: 0.14, y: -0.2 };
    let pointerNorm = { x: 0, y: 0 };
    let scrollFactor = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return; // Keep native mobile touch scroll ultra smooth
      const target = e.target as HTMLElement | null;
      if (target?.closest('button, a, input, textarea, [role="dialog"]')) return;
      if (window.scrollY > window.innerHeight * 0.9) return;
      isDragging = true;
      dragStart = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      pointerNorm.x = (e.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
      pointerNorm.y = -((e.clientY / Math.max(window.innerHeight, 1)) * 2 - 1);

      if (isDragging) {
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        dragStart = { x: e.clientX, y: e.clientY };
        targetRot.y += dx * 0.007;
        targetRot.x += dy * 0.007;
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
      computeSpatialTargets(w, h);
    };

    window.addEventListener('pointerdown', onPointerDown);
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

      computeSpatialTargets(
        container.clientWidth || window.innerWidth,
        container.clientHeight || window.innerHeight
      );
      rootGroup.position.x += (targetPosX - rootGroup.position.x) * 0.08;
      rootGroup.position.y += (targetPosY - rootGroup.position.y) * 0.08;
      rootGroup.position.z += (targetPosZ - rootGroup.position.z) * 0.08;

      coreUniforms.uTime.value = t;
      coreUniforms.uMode.value = mIdx;
      coreUniforms.uAmp.value +=
        ((mIdx === 0 ? 0.22 : mIdx === 1 ? 0.16 : 0.25) - coreUniforms.uAmp.value) *
        0.06;
      coreUniforms.uFreq.value +=
        ((mIdx === 0 ? 1.45 : mIdx === 1 ? 1.95 : 2.25) - coreUniforms.uFreq.value) *
        0.06;
      coreUniforms.uPointer.value.lerp(
        new THREE.Vector2(pointerNorm.x, pointerNorm.y),
        0.08
      );

      particleUniforms.uTime.value = t;
      particleUniforms.uMode.value = mIdx;

      if (!isDragging && !reducedRef.current) {
        targetRot.y += isMobile ? 0.0022 : 0.0028;
      }
      currentRot.x += (targetRot.x + pointerNorm.y * 0.2 - currentRot.x) * 0.06;
      currentRot.y += (targetRot.y + pointerNorm.x * 0.3 - currentRot.y) * 0.06;

      rootGroup.rotation.x = currentRot.x;
      rootGroup.rotation.y = currentRot.y + scrollFactor * 0.9;
      ambientGroup.rotation.y = pointerNorm.x * 0.08 + t * 0.02;
      ambientGroup.rotation.x = pointerNorm.y * 0.05;

      cageMesh.rotation.y = -t * 0.18;
      cageMesh.rotation.z = t * 0.11;
      ring1.rotation.z = t * 0.22;
      ring2.rotation.z = -t * 0.16;
      knotMesh.rotation.x = t * 0.14;
      knotMesh.rotation.y = -t * 0.2;

      camera.position.z = 6.8 - scrollFactor * 1.45;
      camera.position.y = 0.05 - scrollFactor * 0.32;

      renderer?.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointerdown', onPointerDown);
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
      ambGeo.dispose();
      particleMat.dispose();
      renderer?.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      data-cursor="ORBIT 3D"
      aria-label="Fullscreen Interactive 3D Geomechanical Stress & Fluid Observatory"
      style={{ touchAction: 'pan-y' }}
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
    />
  );
}
