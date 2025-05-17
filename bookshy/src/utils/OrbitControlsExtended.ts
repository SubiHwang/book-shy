import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export interface OrbitControlsExtended extends OrbitControls {
  autoRotate: boolean;
  autoRotateSpeed: number;
}
