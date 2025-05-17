import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { useQuery } from '@tanstack/react-query';
import { fetchBookQuoteList } from '@/services/mybooknote/booknote/bookquote';
import type { BookQuote } from '@/types/mybooknote/booknote/bookquote';

const QuoteGalaxyPage = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

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
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const quoteNodes: THREE.Mesh[] = [];

    const fontLoader = new FontLoader();
    fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
      quotes.forEach((quote, idx) => {
        const shortQuote = quote.content.slice(0, 8) + '...';
        const geometry = new TextGeometry(shortQuote, {
          font,
          size: 0.4,
          height: 0.05,
          curveSegments: 6,
          bevelEnabled: false,
        });

        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const mesh = new THREE.Mesh(geometry, material);

        // 더 넓은 공간에, Z는 얕게 퍼트림
        mesh.position.set(
          Math.random() * 100 - 50,
          Math.random() * 60 - 30,
          Math.random() * 20 - 10,
        );

        scene.add(mesh);
        quoteNodes.push(mesh);
      });

      // 선 연결 (앞뒤 인용구 순서대로)
      for (let i = 0; i < quoteNodes.length - 1; i++) {
        const points = [quoteNodes[i].position.clone(), quoteNodes[i + 1].position.clone()];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0x8888ff });
        const line = new THREE.Line(geometry, material);
        scene.add(line);
      }

      animate();
    });

    const animate = () => {
      requestAnimationFrame(animate);
      scene.rotation.y += 0.001;
      scene.rotation.x += 0.0005;
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [quotes]);

  return <div ref={mountRef} className="fixed inset-0 z-50" />;
};

export default QuoteGalaxyPage;
