declare module 'troika-three-text' {
  import { BufferGeometry, Material, Mesh } from 'three';

  export class Text extends Mesh {
    text: string;
    font: string;
    fontSize: number;
    anchorX: string;
    anchorY: string;
    maxWidth?: number;
    lineHeight?: number;
    color?: number | string;
    material: Material;
    sync(callback?: () => void): void;
  }
}
