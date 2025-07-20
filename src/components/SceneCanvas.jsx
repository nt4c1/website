import { Canvas } from '@react-three/fiber';
import SceneContent from './SceneContent';
import * as THREE from 'three';

export default function SceneCanvas({ page }) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 1.5, 6], fov: 45, near: 0.1, far: 1000 }}
      style={{ width: '100vw', height: '100vh', backgroundColor: '#222' }}
    >
      {/* Ambient light */}
      <ambientLight intensity={0.4} />

      {/* Hemisphere light */}
      <primitive
        object={new THREE.HemisphereLight('#ffffff', '#444444', 0.6)}
        position={[0, 20, 0]}
      />

      {/* Directional light with shadows */}
      <primitive
        object={new THREE.DirectionalLight(0xffffff, 1)}
        position={[5, 10, 5]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={500}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      <SceneContent page={page} />
    </Canvas>
  );
}
