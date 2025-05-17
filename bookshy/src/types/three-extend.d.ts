declare module 'three/examples/jsm/loaders/FontLoader' {
  import { Loader } from 'three';

  export class FontLoader extends Loader {
    load(
      url: string,
      onLoad: (font: any) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void,
    ): void;
  }
}

declare module 'three/examples/jsm/geometries/TextGeometry' {
  import * as THREE from 'three';

  export class TextGeometry extends THREE.BufferGeometry {
    constructor(text: string, parameters: any);
  }
}

declare module 'three/examples/jsm/controls/OrbitControls' {
  import * as THREE from 'three';

  export class OrbitControls extends THREE.EventDispatcher {
    constructor(object: THREE.Camera, domElement?: HTMLElement);

    object: THREE.Camera;
    domElement: HTMLElement;

    enabled: boolean;
    target: THREE.Vector3;

    minDistance: number;
    maxDistance: number;

    minZoom: number;
    maxZoom: number;

    minPolarAngle: number;
    maxPolarAngle: number;

    minAzimuthAngle: number;
    maxAzimuthAngle: number;

    enableDamping: boolean;
    dampingFactor: number;

    enableZoom: boolean;
    zoomSpeed: number;

    enableRotate: boolean;
    rotateSpeed: number;

    enablePan: boolean;
    panSpeed: number;

    update(): void;
    reset(): void;
    dispose(): void;
  }
}
