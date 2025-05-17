import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useQuery } from '@tanstack/react-query';
import { fetchLibraryBooksWithTrip } from '@/services/mybooknote/booktrip/booktrip';
import type { LibraryBookWithTrip } from '@/types/mybooknote/booktrip/booktrip';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { OrbitControlsExtended } from '@/utils/OrbitControlsExtended';

const BookTripMapPage = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const { data: books = [] } = useQuery<LibraryBookWithTrip[]>({
    queryKey: ['libraryBooksWithTrip'],
    queryFn: fetchLibraryBooksWithTrip,
  });

  useEffect(() => {
    if (!mountRef.current || books.length === 0) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 20, 80);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement) as OrbitControlsExtended;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const loader = new THREE.TextureLoader();
    const coverMeshes: THREE.Mesh[] = [];

    // 📚 Spiral layout parameters
    const radius = 30;
    const heightStep = 6;
    const angleStep = (2 * Math.PI) / books.length;

    books.forEach((book, i) => {
      const angle = i * angleStep * 1.5;
      const x = radius * Math.cos(angle);
      const y = i * heightStep;
      const z = radius * Math.sin(angle);

      const texture = loader.load(book.coverImageUrl || '/images/book-placeholder.png');
      const geometry = new THREE.PlaneGeometry(8, 12);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const coverMesh = new THREE.Mesh(geometry, material);

      coverMesh.position.set(x, y, z);
      coverMesh.lookAt(new THREE.Vector3(0, y, 0));
      coverMesh.userData.bookId = book.bookId;
      scene.add(coverMesh);
      coverMeshes.push(coverMesh);

      if (i > 0) {
        const prev = coverMeshes[i - 1];
        const geometry = new THREE.BufferGeometry().setFromPoints([
          prev.position.clone(),
          coverMesh.position.clone(),
        ]);
        const material = new THREE.LineBasicMaterial({ color: 0x888888 });
        const line = new THREE.Line(geometry, material);
        scene.add(line);
      }
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(coverMeshes);

      if (intersects.length > 0) {
        const bookId = intersects[0].object.userData.bookId;
        navigate(`/booknotes/trip/${bookId}`);
      }
    };

    renderer.domElement.addEventListener('pointerdown', handleClick);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handleClick);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [books]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-[1000] bg-black/60 backdrop-blur-sm text-white px-4 py-3 flex items-center gap-2 shadow-md">
        <button onClick={() => navigate(-1)} className="p-1 hover:text-cyan-300 transition">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold">📚 책의 여정 맵</h1>
      </div>
      <div ref={mountRef} className="fixed inset-0 z-0" />
    </>
  );
};

export default BookTripMapPage;
