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
