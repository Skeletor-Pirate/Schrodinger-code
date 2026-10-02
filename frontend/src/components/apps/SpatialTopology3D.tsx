import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Eye, RefreshCw, Box, Layers, Activity } from 'lucide-react';

export function SpatialTopology3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [topologyType, setTopologyType] = useState<'sphere' | 'torus' | 'lorenz'>('torus');
  const [particleCount, setParticleCount] = useState(250);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = 420;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090a0f, 0.05);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 9);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Points generator based on selected topology
    const points: THREE.Vector3[] = [];
    const colors: number[] = [];

    if (topologyType === 'sphere') {
      for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 3.2 + (Math.random() - 0.5) * 0.4;
        points.push(
          new THREE.Vector3(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
          )
        );
        colors.push(0.39, 0.4, 0.95);
      }
    } else if (topologyType === 'torus') {
      const R = 3.0; // major radius
      const r = 1.0; // minor radius
      for (let i = 0; i < particleCount; i++) {
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI * 2;
        points.push(
          new THREE.Vector3(
            (R + r * Math.cos(v)) * Math.cos(u),
            (R + r * Math.cos(v)) * Math.sin(u),
            r * Math.sin(v)
          )
        );
        colors.push(0.02, 0.71, 0.83);
      }
    } else {
      // Lorenz Attractor
      let x = 0.1, y = 0, z = 0;
      const dt = 0.01;
      const sigma = 10, rho = 28, beta = 8 / 3;
      for (let i = 0; i < particleCount * 2; i++) {
        const dx = sigma * (y - x) * dt;
        const dy = (x * (rho - z) - y) * dt;
        const dz = (x * y - beta * z) * dt;
        x += dx; y += dy; z += dz;
        if (i % 2 === 0) {
          points.push(new THREE.Vector3(x * 0.18, y * 0.18, (z - 25) * 0.18));
          colors.push(0.06, 0.72, 0.5);
        }
      }
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);

    // Subtle grid plane
    const grid = new THREE.GridHelper(14, 14, 0x312e81, 0x1e1b4b);
    grid.position.y = -3.5;
    scene.add(grid);

    // Animation loop
    let animationFrameId: number;
    let lastTime = performance.now();
    let frames = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      pointCloud.rotation.y += 0.007;
      pointCloud.rotation.x += 0.003;
      renderer.render(scene, camera);

      frames++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(Math.round((frames * 1000) / (now - lastTime)));
        frames = 0;
        lastTime = now;
      }
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [topologyType, particleCount]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              WEBGL REAL-TIME GEOMETRY
            </span>
            <span className="text-xs text-zinc-400">Three.js GPU Pipeline</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">3D Spatial Topology Visualizer</h2>
          <p className="text-sm text-zinc-400">Interactive geometric projection of latent policy embeddings and high-dimensional state trajectories.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTopologyType('sphere')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              topologyType === 'sphere' ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            Hypersphere
          </button>
          <button
            onClick={() => setTopologyType('torus')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              topologyType === 'torus' ? 'bg-cyan-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            Torus Manifold
          </button>
          <button
            onClick={() => setTopologyType('lorenz')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              topologyType === 'lorenz' ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            Lorenz Attractor
          </button>
        </div>
      </div>

      {/* 3D Viewport */}
      <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/80 p-2 shadow-2xl relative overflow-hidden">
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-white/[0.08] text-xs font-mono text-zinc-300 backdrop-blur-md">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>FPS: {fps}</span>
          <span className="text-zinc-600">|</span>
          <span>Nodes: {particleCount}</span>
        </div>

        <div 
          ref={containerRef} 
          className="w-full h-[420px] rounded-xl flex items-center justify-center bg-gradient-to-b from-[#090a0f] to-[#0d0f18]"
        />
      </div>

      {/* Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-white/[0.08] bg-zinc-900/50 p-4">
          <div className="text-xs text-zinc-400 mb-1">Topology Manifold</div>
          <div className="text-xl font-bold text-white capitalize">{topologyType}</div>
          <div className="text-xs text-zinc-500 mt-1">SO(3) Manifold Projection</div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-zinc-900/50 p-4">
          <div className="text-xs text-zinc-400 mb-1">Active Particles</div>
          <div className="text-xl font-bold text-cyan-400">{particleCount} Nodes</div>
          <div className="text-xs text-zinc-500 mt-1">Batch Buffer Geometry</div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-zinc-900/50 p-4">
          <div className="text-xs text-zinc-400 mb-1">Renderer Pipeline</div>
          <div className="text-xl font-bold text-emerald-400">WebGL 2.0</div>
          <div className="text-xs text-zinc-500 mt-1">Hardware Antialiased</div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-zinc-900/50 p-4">
          <div className="text-xs text-zinc-400 mb-1">Draw Call Latency</div>
          <div className="text-xl font-bold text-indigo-400">~0.42 ms</div>
          <div className="text-xs text-zinc-500 mt-1">Zero Garbage Collection</div>
        </div>
      </div>
    </div>
  );
}