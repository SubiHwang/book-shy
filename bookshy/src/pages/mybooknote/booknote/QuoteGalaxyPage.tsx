import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useQuery } from '@tanstack/react-query';
import { fetchBookQuoteList } from '@/services/mybooknote/booknote/bookquote';
import type { BookQuote } from '@/types/mybooknote/booknote/bookquote';
import { Text } from 'troika-three-text';

const QuoteGalaxyPage = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);

  const { data: quotes = [] } = useQuery<BookQuote[]>({
    queryKey: ['quote-list'],
    queryFn: fetchBookQuoteList,
  });

  useEffect(() => {
    if (!mountRef.current || quotes.length === 0) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

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

    const getColorByBookId = (bookId: number) => {
      const colors = [0xff5555, 0x55ff55, 0x5555ff, 0xffff55, 0xff55ff];
      return colors[bookId % colors.length];
    };

    quotes.forEach((quote) => {
      const textMesh = new Text();
      textMesh.text = quote.content.slice(0, 12) + '...';
      textMesh.font = '/fonts/NotoSansKR-Regular.ttf';
      textMesh.fontSize = 2;
      textMesh.color = getColorByBookId(quote.bookId);
      textMesh.anchorX = 'center';
      textMesh.anchorY = 'middle';
      textMesh.position.set(
        Math.random() * 80 - 40,
        Math.random() * 50 - 25,
        Math.random() * 10 - 5,
      );
      textMesh.userData.fullQuote = quote.content;

      // geometry 생성 완료 후 씬에 추가
      textMesh.sync(() => {
        scene.add(textMesh);
      });

      quoteNodes.push(textMesh);
    });

    // quote 간 선 연결
    for (let i = 0; i < quoteNodes.length - 1; i++) {
      const p1 = quoteNodes[i].position.clone();
      const p2 = quoteNodes[i + 1].position.clone();
      const geometry = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const material = new THREE.LineBasicMaterial({ color: 0x8888ff });
      const line = new THREE.Line(geometry, material);
      scene.add(line);
    }

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      scene.rotation.y += 0.0005;
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
      }
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
      <div ref={mountRef} className="fixed inset-0 z-40" />

      {selectedQuote && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 bg-white text-black p-4 rounded shadow max-w-xs text-sm whitespace-pre-wrap">
          <p>{selectedQuote}</p>
          <button onClick={() => setSelectedQuote(null)} className="mt-2 text-blue-500">
            닫기
          </button>
        </div>
      )}
    </>
  );
};

export default QuoteGalaxyPage;
