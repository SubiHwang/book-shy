import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useQuery } from '@tanstack/react-query';
import { fetchBookQuoteList } from '@/services/mybooknote/booknote/bookquote';
import type { BookQuote } from '@/types/mybooknote/booknote/bookquote';
import { Text } from 'troika-three-text';
import gsap from 'gsap';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuoteGalaxyPage = () => {
  const navigate = useNavigate();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);
  const [hoveredQuote, setHoveredQuote] = useState<string | null>(null);

  const { data: quotes = [] } = useQuery<BookQuote[]>({
    queryKey: ['quote-list'],
    queryFn: fetchBookQuoteList,
  });

  useEffect(() => {
    if (!mountRef.current || quotes.length === 0) return;

    const scene = new THREE.Scene();
    const background = new THREE.TextureLoader().load('/images/space.jpg');
    scene.background = background;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 60;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 20;
    controls.maxDistance = 100;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const quoteNodes: Text[] = [];

    const quoteColors = [0xaa88ff, 0x88ccff, 0xff66cc, 0xffff66, 0xdddddd];
    const spriteMap = new THREE.TextureLoader().load('/images/star-glow.png');

    quotes.forEach((quote) => {
      const textMesh = new Text();
      textMesh.text = quote.content.slice(0, 12) + '...';
      textMesh.font = '/fonts/NotoSansKR-Regular.ttf';
      textMesh.fontSize = 2;
      textMesh.color = quoteColors[Math.floor(Math.random() * quoteColors.length)];
      textMesh.anchorX = 'center';
      textMesh.anchorY = 'middle';
      textMesh.position.set(
        Math.random() * 80 - 40,
        Math.random() * 50 - 25,
        Math.random() * 10 - 5,
      );
      textMesh.rotation.set(
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4,
      );
      textMesh.userData.fullQuote = quote.content;

      textMesh.sync(() => {
        scene.add(textMesh);

        // 🌟 Sprite 발광 효과
        const spriteMaterial = new THREE.SpriteMaterial({
          map: spriteMap,
          color: 0xffffff,
          transparent: true,
          opacity: 0.3,
          depthWrite: false,
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(50, 20, 1);
        sprite.position.copy(textMesh.position);
        scene.add(sprite);
      });

      quoteNodes.push(textMesh);
    });

    for (let i = 0; i < quoteNodes.length - 1; i++) {
      const p1 = quoteNodes[i].position.clone();
      const p2 = quoteNodes[i + 1].position.clone();
      const geometry = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const material = new THREE.LineBasicMaterial({ color: 0xaaaaaa });
      const line = new THREE.Line(geometry, material);
      scene.add(line);
    }

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

      quoteNodes.forEach((mesh, i) => {
        const flicker = 0.85 + 0.15 * Math.sin(Date.now() * 0.002 + i);
        const base = new THREE.Color(mesh.color as any);
        (mesh.material as THREE.MeshBasicMaterial).color.setRGB(
          base.r * flicker,
          base.g * flicker,
          base.b * flicker,
        );
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

    renderer.domElement.addEventListener('pointerdown', (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(quoteNodes, true);

      if (intersects.length > 0) {
        const clicked = intersects[0].object as Text;
        setSelectedQuote(clicked.userData.fullQuote || '');

        gsap.to(camera.position, {
          duration: 1.5,
          x: clicked.position.x + 10,
          y: clicked.position.y + 10,
          z: clicked.position.z + 20,
          ease: 'power2.inOut',
          onUpdate: () => camera.lookAt(clicked.position),
        });
      }
    });

    renderer.domElement.addEventListener('pointermove', (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(quoteNodes, true);
      setHoveredQuote(intersects.length > 0 ? intersects[0].object.userData.fullQuote : null);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [quotes]);

  return (
    <>
      {/* 헤더 */}
      <div className="fixed top-0 left-0 w-full z-[1000] bg-black/60 backdrop-blur-sm text-white px-4 py-3 flex items-center gap-2 shadow-md">
        <button onClick={() => navigate(-1)} className="p-1 hover:text-cyan-300 transition">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold">📘 인용구 별자리</h1>
      </div>

      <div ref={mountRef} className="fixed inset-0 z-40" />

      {selectedQuote && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedQuote(null)}
        >
          <div
            className="bg-[#1e1e1e] text-white max-w-md w-full mx-4 p-6 rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-lg font-semibold leading-relaxed whitespace-pre-wrap">
              {selectedQuote}
            </p>
            <button
              onClick={() => setSelectedQuote(null)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 float-right"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {hoveredQuote && !selectedQuote && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 bg-white text-black px-3 py-2 rounded shadow max-w-xs text-sm whitespace-pre-wrap">
          <p>{hoveredQuote}</p>
        </div>
      )}
    </>
  );
};

export default QuoteGalaxyPage;
