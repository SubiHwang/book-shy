import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Text } from 'troika-three-text';
import { useQuery } from '@tanstack/react-query';
import { fetchBookQuoteList } from '@/services/mybooknote/booknote/bookquote';
import type { BookQuote } from '@/types/mybooknote/booknote/bookquote';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface StyledText extends Text {
  outlineWidth?: number;
  outlineColor?: string;
  outlineBlur?: number;
  opacity?: number;
  baseColor?: string;
}

const QuoteGalaxyPage = () => {
  const navigate = useNavigate();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);

  const { data: quotes = [] } = useQuery<BookQuote[]>({
    queryKey: ['quote-list'],
    queryFn: fetchBookQuoteList,
  });

  useEffect(() => {
    if (!mountRef.current || quotes.length === 0) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 20, 80);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement) as any;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.minDistance = 30;
    controls.maxDistance = 100;

    scene.background = new THREE.TextureLoader().load('/images/night-sky.png');

    const starCount = 200;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = [];
    for (let i = 0; i < starCount; i++) {
      const r = 60 + Math.random() * 30;
      const phi = Math.random() * Math.PI;
      const theta = Math.random() * Math.PI * 2;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      starPositions.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.7,
      transparent: true,
      opacity: 0.7,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    const shootingStars: THREE.Mesh[] = [];
    const createShootingStar = () => {
      const geometry = new THREE.SphereGeometry(0.25, 8, 8);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 1,
      });
      const star = new THREE.Mesh(geometry, material);
      star.position.set(
        (Math.random() - 0.5) * 100,
        40 + Math.random() * 20,
        (Math.random() - 0.5) * 100,
      );
      star.userData.velocity = new THREE.Vector3(
        Math.random() * 2 - 1,
        -2 - Math.random() * 2,
        Math.random() * 2 - 1,
      );
      scene.add(star);
      shootingStars.push(star);
    };
    const shootingStarInterval = setInterval(createShootingStar, 3500);

    const radius = 50;
    const quoteNodes: StyledText[] = [];
    const spherical = new THREE.Spherical(radius);
    const colorList = ['#fff', '#b2ccff', '#a5b4fc', '#f0e9ff', '#c7d2fe', '#e0e7ff'];

    let hoveredText: StyledText | null = null;

    quotes.forEach((quote) => {
      const phi = Math.PI / 4 + Math.random() * (Math.PI / 4);
      const theta = Math.random() * Math.PI * 2;
      spherical.phi = phi;
      spherical.theta = theta;
      const pos = new THREE.Vector3().setFromSpherical(spherical);

      const textMesh = new Text() as StyledText;
      textMesh.text = quote.content.slice(0, 20) + '...';
      textMesh.font = '/fonts/NotoSansKR-Regular.ttf';
      textMesh.fontSize = 2;
      textMesh.color = colorList[Math.floor(Math.random() * colorList.length)];
      textMesh.outlineWidth = 0.13;
      textMesh.outlineColor = '#b2ccff';
      textMesh.outlineBlur = 1.5;
      textMesh.opacity = 1;
      textMesh.anchorX = 'center';
      textMesh.anchorY = 'middle';
      textMesh.position.copy(pos);
      textMesh.userData.fullQuote = quote.content;
      textMesh.userData.baseColor = textMesh.color;
      (textMesh as any).shadowColor = '#b2ccff';
      (textMesh as any).shadowBlur = 10;
      textMesh.sync(() => {
        scene.add(textMesh);
        quoteNodes.push(textMesh);
      });
    });

    const waveEffects: { mesh: THREE.Mesh; start: number }[] = [];

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

      quoteNodes.forEach((text, i) => {
        const flicker = 0.85 + 0.15 * Math.sin(Date.now() * 0.002 + i * 1.7);
        text.opacity = flicker;
        const scale = 1 + 0.07 * Math.sin(Date.now() * 0.0015 + i * 2.3);
        text.scale.set(scale, scale, scale);
      });

      starMaterial.opacity = 0.6 + 0.2 * Math.sin(Date.now() * 0.001);

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        star.position.add(star.userData.velocity);
        (star.material as THREE.Material).opacity! -= 0.02;
        if ((star.material as THREE.Material).opacity! <= 0) {
          scene.remove(star);
          shootingStars.splice(i, 1);
        }
      }

      const now = performance.now();
      for (let i = waveEffects.length - 1; i >= 0; i--) {
        const { mesh, start } = waveEffects[i];
        const elapsed = (now - start) / 1000;
        mesh.scale.setScalar(1 + elapsed * 3);
        (mesh.material as THREE.MeshBasicMaterial).opacity = 0.5 * (1 - elapsed / 1.1);
        if (elapsed > 1.1) {
          scene.remove(mesh);
          waveEffects.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const handlePointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(quoteNodes);
      if (intersects.length > 0) {
        const hovered = intersects[0].object as StyledText;
        if (hoveredText && hoveredText !== hovered) {
          // 이전 hover 해제
          hoveredText.outlineWidth = 0.13;
          hoveredText.outlineColor = '#b2ccff';
          (hoveredText as any).shadowBlur = 10;
          hoveredText.color = hoveredText.userData.baseColor;
        }
        hoveredText = hovered;
        hovered.outlineWidth = 0.22;
        hovered.outlineColor = '#fffbe6';
        (hovered as any).shadowBlur = 18;
        hovered.color = '#fffbe6';
      } else if (hoveredText) {
        // hover 해제
        hoveredText.outlineWidth = 0.13;
        hoveredText.outlineColor = '#b2ccff';
        (hoveredText as any).shadowBlur = 10;
        hoveredText.color = hoveredText.userData.baseColor;
        hoveredText = null;
      }
    };
    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0] as any);
      }
    });

    const handleClick = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(quoteNodes);

      if (intersects.length > 0) {
        const clicked = intersects[0].object as Text;
        setSelectedQuote(clicked.userData.fullQuote || '');
        const waveGeometry = new THREE.RingGeometry(1.2, 1.7, 48);
        const waveMaterial = new THREE.MeshBasicMaterial({
          color: 0xb2ccff,
          transparent: true,
          opacity: 0.5,
          side: THREE.DoubleSide,
        });
        const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);
        waveMesh.position.copy(clicked.position);
        waveMesh.position.z += 0.1;
        scene.add(waveMesh);
        waveEffects.push({ mesh: waveMesh, start: performance.now() });
      }
    };
    renderer.domElement.addEventListener('pointerdown', handleClick);

    // ⭐ 별자리 선(Line) 연결 효과 추가
    if (quoteNodes.length >= 5) {
      // 랜덤하게 5~8개 인덱스 선택 후 정렬
      const count = Math.min(8, Math.max(5, Math.floor(Math.random() * 4) + 5));
      const indices = Array.from({ length: quoteNodes.length }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      const selected = indices.slice(0, count).sort((a, b) => a - b);
      const points = selected.map((idx) => quoteNodes[idx].position.clone());
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: 0xb2ccff,
        linewidth: 2,
        transparent: true,
        opacity: 0.7,
      });
      const line = new THREE.Line(geometry, material);
      scene.add(line);
      // glow 효과용 라인
      const glowMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        linewidth: 5,
        transparent: true,
        opacity: 0.18,
      });
      const glowLine = new THREE.Line(geometry, glowMaterial);
      scene.add(glowLine);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      clearInterval(shootingStarInterval);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
    };
  }, [quotes]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-blue-900/60 via-indigo-900/50 to-purple-900/60 backdrop-blur-md text-white px-4 py-3 flex items-center gap-2 shadow-lg border-b border-white/10">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium flex items-center gap-2">
          <span className="text-xl">✨</span>
          <span className="bg-gradient-to-r from-blue-200 to-purple-200 text-transparent bg-clip-text">
            인용구 별자리
          </span>
        </h1>
      </div>

      <div ref={mountRef} className="fixed inset-0 z-0" />

      {selectedQuote && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedQuote(null)}
        >
          <div
            className="max-w-md w-full bg-gradient-to-b from-blue-900/90 to-purple-900/90 backdrop-blur-md p-6 rounded-2xl shadow-[0_0_15px_rgba(147,197,253,0.3)] border border-blue-300/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-4 text-blue-200">
              <span className="text-lg">💫</span>
              <span className="text-sm font-medium">별빛 속 문장</span>
            </div>
            <p className="text-lg text-blue-50 font-medium leading-relaxed whitespace-pre-wrap">
              {selectedQuote}
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedQuote(null)}
                className="px-5 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-lg transition-colors duration-200 flex items-center gap-2 group"
              >
                닫기
                <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuoteGalaxyPage;
