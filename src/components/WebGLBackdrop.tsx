import { useEffect, useRef } from 'react';
import { ShaderMode } from '../data/profile';

interface WebGLBackdropProps {
  mode: ShaderMode;
  reducedMotion: boolean;
}

const VERT_SRC = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG_SRC = `#version 300 es
precision highp float;
out vec4 fragColor;
in vec2 vUv;

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll;
uniform int uMode;

// Simplex-style hash & value noise
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);
  vec2 m = (uMouse - 0.5) * vec2(uRes.x / min(uRes.x, uRes.y), uRes.y / min(uRes.x, uRes.y));

  float t = uTime * 0.14;
  float scrollPhase = uScroll * 3.14159;

  float dMouse = length(uv - m);
  float mouseRipple = exp(-dMouse * 3.2) * 0.45;

  vec3 baseDark = vec3(0.02, 0.024, 0.033);
  vec3 cyan = vec3(0.18, 0.90, 0.84);
  vec3 amber = vec3(0.96, 0.72, 0.44);
  vec3 violet = vec3(0.54, 0.48, 1.00);

  vec3 col = baseDark;

  if (uMode == 0) {
    // Interference Topographic Field
    vec2 q = vec2(
      fbm(uv * 2.2 + vec2(t, scrollPhase * 0.35)),
      fbm(uv * 2.2 + vec2(-t * 0.8, 4.2))
    );
    float f = fbm(uv * 2.6 + 1.65 * q + vec2(mouseRipple * 0.8));

    // Contour isolines
    float contour = abs(fract(f * 13.0 - t * 0.6) - 0.5);
    float line = smoothstep(0.055, 0.0, contour);

    float glow = smoothstep(0.25, 0.85, f);
    vec3 fieldTint = mix(cyan, violet, clamp(uScroll * 1.15, 0.0, 1.0));
    fieldTint = mix(fieldTint, amber, smoothstep(0.55, 0.95, f) * 0.55);

    col += fieldTint * glow * 0.16;
    col += fieldTint * line * 0.24 * (0.4 + 0.6 * glow);
    col += cyan * exp(-dMouse * 4.5) * 0.18;
  } else if (uMode == 1) {
    // Quantum Harmonic Lattice
    vec2 g = uv * (6.5 + sin(scrollPhase) * 1.5);
    g += vec2(sin(g.y * 1.4 + t * 2.0), cos(g.x * 1.4 - t * 2.0)) * 0.28;
    g += normalize(uv - m + 0.0001) * mouseRipple * 0.6;
    vec2 cell = abs(fract(g) - 0.5);
    float grid = smoothstep(0.04, 0.0, min(cell.x, cell.y));
    float node = exp(-length(cell) * 9.0);
    float wave = 0.5 + 0.5 * sin(length(uv) * 8.0 - t * 4.0 + scrollPhase * 2.0);
    col += mix(cyan, amber, wave) * grid * 0.16;
    col += violet * node * 0.35;
    col += cyan * exp(-dMouse * 4.0) * 0.14;
  } else {
    // Bioluminescent Aurora Horizon
    vec2 p = uv;
    p.y += sin(p.x * 2.6 + t * 2.2 + scrollPhase) * 0.22;
    p.x += cos(p.y * 2.1 - t * 1.6) * 0.18;
    float f = fbm(p * 2.1 + vec2(t * 0.7, -t * 0.5));
    float ribbon = exp(-abs(p.y + (f - 0.5) * 0.8) * 4.5);
    col += mix(cyan, violet, 0.4 + 0.4 * sin(uScroll * 4.0 + uv.x)) * ribbon * 0.34;
    col += amber * pow(ribbon, 2.5) * 0.22;
    col += cyan * exp(-dMouse * 3.8) * 0.16;
  }

  // Vignette for crisp editorial readability
  float vig = 1.0 - dot(vUv - 0.5, vUv - 0.5) * 0.85;
  col *= clamp(vig, 0.35, 1.0);

  fragColor = vec4(col, 1.0);
}
`;

export function WebGLBackdrop({ mode, reducedMotion }: WebGLBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modeRef = useRef<ShaderMode>(mode);
  const reducedRef = useRef<boolean>(reducedMotion);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    reducedRef.current = reducedMotion;
  }, [reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
    });

    if (!gl) return;

    const compileShader = (type: number, source: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compileShader(gl.VERTEX_SHADER, VERT_SRC);
    const fs = compileShader(gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uMouse = gl.getUniformLocation(prog, 'uMouse');
    const uScroll = gl.getUniformLocation(prog, 'uScroll');
    const uMode = gl.getUniformLocation(prog, 'uMode');

    let targetMouse = { x: 0.5, y: 0.5 };
    let currentMouse = { x: 0.5, y: 0.5 };
    let scrollNorm = 0;

    const onPointerMove = (e: PointerEvent) => {
      targetMouse.x = e.clientX / Math.max(window.innerWidth, 1);
      targetMouse.y = 1 - e.clientY / Math.max(window.innerHeight, 1);
    };

    const onScroll = () => {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      scrollNorm = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);
    resize();
    onScroll();

    let rafId = 0;
    const start = performance.now();

    const render = (now: number) => {
      const elapsed = reducedRef.current ? 1.5 : (now - start) * 0.001;
      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.06;
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.06;

      gl.useProgram(prog);
      gl.bindVertexArray(vao);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uMouse, currentMouse.x, currentMouse.y);
      gl.uniform1f(uScroll, scrollNorm);
      gl.uniform1i(
        uMode,
        modeRef.current === 'interference'
          ? 0
          : modeRef.current === 'lattice'
            ? 1
            : 2
      );
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
      gl.deleteVertexArray(vao);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050608]">
      <canvas ref={canvasRef} className="h-full w-full block opacity-95" />
      <div className="sci-grid fixed inset-0 opacity-60 pointer-events-none" />
      <div className="noise-overlay fixed inset-0 pointer-events-none" />
    </div>
  );
}
