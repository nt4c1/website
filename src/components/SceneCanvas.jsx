import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import SceneContent from './SceneContent';

export default function SceneCanvas({ page }) {
  return (
    <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
      <Environment preset="forest" />
      <SceneContent page={page} />
    </Canvas>
  );
}
