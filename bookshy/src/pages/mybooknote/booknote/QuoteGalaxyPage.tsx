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

    const radius = 50;
    const quoteNodes: StyledText[] = [];
    const spherical = new THREE.Spherical(radius);

    quotes.forEach((quote, idx) => {
      const phi = Math.PI / 4 + Math.random() * (Math.PI / 4);
      const theta = Math.random() * Math.PI * 2;
      spherical.phi = phi;
      spherical.theta = theta;

      const pos = new THREE.Vector3().setFromSpherical(spherical);

      const textMesh = new Text() as StyledText;
      textMesh.text = quote.content.slice(0, 12) + '...';
      textMesh.font = '/fonts/NotoSansKR-Regular.ttf';
      textMesh.fontSize = 2;
      // textMesh.color = '#b8d7ff';
      textMesh.color = '#ffffff';
      textMesh.outlineWidth = 0.005;
      textMesh.outlineColor = '#0100ff';
      textMesh.outlineBlur = 0.6;
      textMesh.opacity = 1;
      textMesh.anchorX = 'center';
      textMesh.anchorY = 'middle';
      textMesh.position.copy(pos);
      textMesh.userData.fullQuote = quote.content;

      textMesh.sync(() => scene.add(textMesh));
      quoteNodes.push(textMesh);
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

      quoteNodes.forEach((text, i) => {
        const flicker = 0.85 + 0.15 * Math.sin(Date.now() * 0.002 + i);
        text.opacity = flicker;
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const handleClick = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(quoteNodes);

      if (intersects.length > 0) {
        const clicked = intersects[0].object as Text;
        setSelectedQuote(clicked.userData.fullQuote || '');
      }
    };
    renderer.domElement.addEventListener('pointerdown', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
    };
  }, [quotes]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-black/70 text-white flex items-center gap-2 px-4 py-3">
        <button onClick={() => navigate(-1)} className="hover:text-cyan-300">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold">📘 인용구 별자리</h1>
      </div>

      <div ref={mountRef} className="fixed inset-0 z-0" />

      {selectedQuote && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setSelectedQuote(null)}
        >
          <div
            className="bg-white max-w-md w-full mx-4 p-6 rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-lg font-semibold whitespace-pre-wrap">{selectedQuote}</p>
            <button
              onClick={() => setSelectedQuote(null)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 float-right"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default QuoteGalaxyPage;
