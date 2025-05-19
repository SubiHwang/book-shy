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

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement) as OrbitControlsExtended;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // ✅ 카메라 위치 (높이 낮춤)
    camera.position.set(0, 5, isMobile ? 50 : 80);

    // ✅ OrbitControls가 바라볼 중심 좌표 설정
    controls.target.set(0, 10, 0); // 여정이 시작되는 대략적인 높이
    controls.update();

    const loader = new THREE.TextureLoader();
    const coverMeshes: THREE.Mesh[] = [];
    const titleTexts: Text[] = [];

    const radius = 30;
    const heightStep = 6;
    const angleStep = (2 * Math.PI) / books.length;

    const createGradientTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 1;
      const context = canvas.getContext('2d');
      if (!context) return null;

      const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, '#FF9F9F'); // 부드러운 핑크
      gradient.addColorStop(0.33, '#FFD6A5'); // 파스텔 오렌지
      gradient.addColorStop(0.66, '#FFFEC4'); // 부드러운 노랑
      gradient.addColorStop(1, '#CBFFA9'); // 파스텔 그린

      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);

      return new THREE.CanvasTexture(canvas);
    };

    // 조명 추가
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 50, 50);
    scene.add(directionalLight);

    // 라인 위를 따라 움직이는 별(점) 애니메이션을 위한 배열
    const movingStars: { points: THREE.Vector3[]; mesh: THREE.Mesh }[] = [];

    // 파동(확산) 효과를 위한 배열
    const waveEffects: { mesh: THREE.Mesh; start: number }[] = [];

    books.forEach((book, i) => {
      const angle = i * angleStep * 1.5;
      const x = radius * Math.cos(angle);
      const y = i * heightStep;
      const z = radius * Math.sin(angle);

      const texture = loader.load(book.coverImageUrl || '/images/book-placeholder.png');
      const geometry = new THREE.PlaneGeometry(10, 15);
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
      title.color = '#fff';
      (title as any).outlineWidth = 0.18;
      (title as any).outlineColor = '#a5b4fc';
      (title as any).outlineBlur = 1.2;
      (title as any).shadowColor = '#b2ccff';
      (title as any).shadowBlur = 8;
      (title as any).fontWeight = 'bold';
      title.position.set(x, y - 9, z);
      title.lookAt(new THREE.Vector3(0, y - 9, 0));
      title.sync(() => scene.add(title));
      titleTexts.push(title);

      if (i > 0) {
        const prev = coverMeshes[i - 1];
        const points = [];
        const segments = 50; // 곡선의 부드러움을 위한 세그먼트 수

        for (let j = 0; j <= segments; j++) {
          const t = j / segments;
          // 베지어 곡선의 중간 제어점
          const midPoint = new THREE.Vector3(
            (prev.position.x + coverMesh.position.x) / 2,
            Math.max(prev.position.y, coverMesh.position.y) + 10,
            (prev.position.z + coverMesh.position.z) / 2,
          );

          // 이차 베지어 곡선 계산
          const point = new THREE.Vector3();
          point.x =
            Math.pow(1 - t, 2) * prev.position.x +
            2 * (1 - t) * t * midPoint.x +
            Math.pow(t, 2) * coverMesh.position.x;
          point.y =
            Math.pow(1 - t, 2) * prev.position.y +
            2 * (1 - t) * t * midPoint.y +
            Math.pow(t, 2) * coverMesh.position.y;
          point.z =
            Math.pow(1 - t, 2) * prev.position.z +
            2 * (1 - t) * t * midPoint.z +
            Math.pow(t, 2) * coverMesh.position.z;

          points.push(point);
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const gradientTexture = createGradientTexture();

        const material = new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.7,
          linewidth: 2,
        });

        if (gradientTexture) {
          material.map = gradientTexture;
        }

        const line = new THREE.Line(geometry, material);
        scene.add(line);

        // 빛나는 효과를 위한 추가 라인
        const glowMaterial = new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.3,
          linewidth: 4,
        });
        const glowLine = new THREE.Line(geometry, glowMaterial);
        scene.add(glowLine);

        // 라인 애니메이션을 위한 속성 추가
        line.userData.initialOpacity = material.opacity;
        glowLine.userData.initialOpacity = glowMaterial.opacity;
        line.userData.material = material;
        glowLine.userData.material = glowMaterial;

        // ⭐ 라인 위를 따라 움직이는 별(점) 추가
        const starGeometry = new THREE.SphereGeometry(0.5, 12, 12);
        const starMaterial = new THREE.MeshBasicMaterial({
          color: 0xfffbe6,
          transparent: true,
          opacity: 0.95,
        });
        const starMesh = new THREE.Mesh(starGeometry, starMaterial);
        scene.add(starMesh);
        movingStars.push({ points, mesh: starMesh });
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
    flag.position.set(last.position.x, last.position.y + 13, last.position.z);
    flag.lookAt(new THREE.Vector3(0, last.position.y + 13, 0));
    flag.sync(() => scene.add(flag));

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

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
    renderer.domElement.addEventListener('pointermove', handleMove);
    renderer.domElement.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0] as any);
      }
    });

    const handleClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(coverMeshes);

      if (intersects.length > 0) {
        const clicked = intersects[0].object as THREE.Mesh;
        // ⭐ 파동(확산) 효과 추가
        const waveGeometry = new THREE.RingGeometry(4, 5.5, 48);
        const waveMaterial = new THREE.MeshBasicMaterial({
          color: 0xfffbe6,
          transparent: true,
          opacity: 0.5,
          side: THREE.DoubleSide,
        });
        const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);
        waveMesh.position.copy(clicked.position);
        waveMesh.position.z += 0.2; // 표지와 겹치지 않게 살짝 앞으로
        scene.add(waveMesh);
        waveEffects.push({ mesh: waveMesh, start: performance.now() });

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

    renderer.domElement.addEventListener('pointerdown', handleClick);

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      coverMeshes.forEach((mesh, i) => {
        mesh.position.y += Math.sin(time + i) * 0.005;
        // 책 하단 텍스트 애니메이션 (살짝 흔들림)
        if (titleTexts[i]) {
          const baseY = mesh.position.y - 9;
          titleTexts[i].position.y = baseY + Math.sin(time * 1.2 + i) * 0.3;
        }
      });

      // 모든 라인의 애니메이션 업데이트
      scene.children.forEach((child) => {
        if (child instanceof THREE.Line && child.userData.initialOpacity !== undefined) {
          const material = child.userData.material as THREE.LineBasicMaterial;
          material.opacity = child.userData.initialOpacity + Math.sin(time * 2) * 0.2;
        }
      });

      // ⭐ 라인 위를 따라 별(점) 이동 애니메이션
      movingStars.forEach((starObj, idx) => {
        const t = (time * 0.25 + idx * 0.2) % 1; // 각 라인별로 phase 다르게
        const points = starObj.points;
        const seg = Math.floor(t * (points.length - 1));
        const frac = t * (points.length - 1) - seg;
        if (points[seg + 1]) {
          // 선형 보간으로 위치 계산
          starObj.mesh.position.lerpVectors(points[seg], points[seg + 1], frac);
        } else {
          starObj.mesh.position.copy(points[points.length - 1]);
        }
      });

      // ⭐ 파동(확산) 애니메이션
      const now = performance.now();
      for (let i = waveEffects.length - 1; i >= 0; i--) {
        const { mesh, start } = waveEffects[i];
        const elapsed = (now - start) / 1000;
        mesh.scale.setScalar(1 + elapsed * 2.5);
        (mesh.material as THREE.MeshBasicMaterial).opacity = 0.5 * (1 - elapsed / 1.1);
        if (elapsed > 1.1) {
          scene.remove(mesh);
          waveEffects.splice(i, 1);
        }
      }

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
      <div className="fixed top-0 left-0 w-full z-[1000] bg-gradient-to-r from-orange-400/40 via-rose-300/30 to-purple-400/40 backdrop-blur-md text-white px-4 py-3 flex items-center gap-2 shadow-lg">
        <button onClick={() => navigate(-1)} className="p-1 hover:text-cyan-100 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold text-white/90">📚 책의 여정 맵</h1>
      </div>
      <div ref={mountRef} className="fixed inset-0 z-0" />
      {hoveredTitle && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-sm text-black px-3 py-2 rounded-lg shadow-lg max-w-xs text-sm whitespace-pre-wrap">
          <p>{hoveredTitle}</p>
        </div>
      )}
    </>
  );
};

export default BookTripMapPage;
