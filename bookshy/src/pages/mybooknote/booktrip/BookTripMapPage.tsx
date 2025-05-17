import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Text } from 'troika-three-text';
import { useQuery } from '@tanstack/react-query';
import { fetchLibraryBooksWithTrip } from '@/services/mybooknote/booktrip/booktrip';
import type { LibraryBookWithTrip } from '@/types/mybooknote/booktrip/booktrip';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import gsap from 'gsap';

interface OrbitControlsExtended extends OrbitControls {
  autoRotate: boolean;
  autoRotateSpeed: number;
}

const BookTripMapPage = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);

  const { data: books = [] } = useQuery<LibraryBookWithTrip[]>({
    queryKey: ['libraryBooksWithTrip'],
    queryFn: fetchLibraryBooksWithTrip,
  });

  useEffect(() => {
    if (!mountRef.current || books.length === 0) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.TextureLoader().load('/images/mountain.png');
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const isMobile = window.innerWidth < 768;
    camera.position.set(0, 20, isMobile ? 50 : 80);

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
    const titleTexts: Text[] = [];

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
      coverMesh.userData = {
        bookId: book.bookId,
        title: book.title,
        index: i,
      };

      scene.add(coverMesh);
      coverMeshes.push(coverMesh);

      gsap.from(coverMesh.scale, {
        x: 0.1,
        y: 0.1,
        z: 0.1,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'back.out(1.7)',
      });

      const title = new Text();
      title.text = book.title.slice(0, 10);
      title.font = '/fonts/NotoSansKR-Regular.ttf';
      title.fontSize = 1.2;
      title.anchorX = 'center';
      title.anchorY = 'top';
      title.color = 0xffffff;
      title.position.set(x, y - 7, z);
      title.lookAt(new THREE.Vector3(0, y - 7, 0));
      title.sync(() => scene.add(title));
      titleTexts.push(title);

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

    // 깃발 추가
    const last = coverMeshes[coverMeshes.length - 1];
    const flag = new Text();
    flag.text = '🏁';
    flag.font = '/fonts/NotoSansKR-Regular.ttf';
    flag.fontSize = 4;
    flag.anchorX = 'center';
    flag.anchorY = 'bottom';
    flag.position.set(last.position.x, last.position.y + 10, last.position.z);
    flag.lookAt(new THREE.Vector3(0, last.position.y + 10, 0));
    flag.sync(() => scene.add(flag));

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(coverMeshes);

      if (intersects.length > 0) {
        const clicked = intersects[0].object as THREE.Mesh;
        const clickedPos = clicked.position.clone();
        gsap.to(camera.position, {
          duration: 1.5,
          x: clickedPos.x + 10,
          y: clickedPos.y + 10,
          z: clickedPos.z + 20,
          ease: 'power2.inOut',
          onUpdate: () => controls.update(),
        });
        gsap.to(controls.target, {
          duration: 1.5,
          x: clickedPos.x,
          y: clickedPos.y,
          z: clickedPos.z,
          ease: 'power2.inOut',
          onUpdate: () => controls.update(),
        });
        const bookId = clicked.userData.bookId;
        setTimeout(() => navigate(`/booknotes/trip/${bookId}`), 1600);
      }
    };

    const handleMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(coverMeshes);

      if (intersects.length > 0) {
        setHoveredTitle(intersects[0].object.userData.title);
      } else {
        setHoveredTitle(null);
      }
    };

    renderer.domElement.addEventListener('pointerdown', handleClick);
    renderer.domElement.addEventListener('pointermove', handleMove);

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      coverMeshes.forEach((mesh, i) => {
        mesh.position.y += Math.sin(time + i) * 0.005;
      });

      flag.rotation.z = Math.sin(time * 3) * 0.05;

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
      renderer.domElement.removeEventListener('pointermove', handleMove);
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
      {hoveredTitle && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 bg-white text-black px-3 py-2 rounded shadow max-w-xs text-sm whitespace-pre-wrap">
          <p>{hoveredTitle}</p>
        </div>
      )}
    </>
  );
};

export default BookTripMapPage;
