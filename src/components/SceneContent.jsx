import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function SceneContent({ page }) {
  const group = useRef();
  const glbModel = useRef();

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load('/models/9.glb', (gltf) => {
      const model = gltf.scene;

      // Rotate model upright if needed
      model.rotation.x = -Math.PI / 2;

      // Position and scale
      model.position.set(0, -1.5, 0);
      model.scale.set(1, 1, 1);

      // Override materials for visibility
      model.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({ color: 'orange' });
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      glbModel.current = model;
      group.current.add(model);

      console.log('GLB model loaded:', model);
      console.log('Children meshes:', model.children.map(c => c.name));
    });

    // Add axes helper to show coordinate axes
    if (group.current) {
      const axesHelper = new THREE.AxesHelper(5);
      group.current.add(axesHelper);
    }
  }, []);

  useFrame(() => {
    if (glbModel.current) {
      // Keep model positioned correctly per page (you can expand this)
      glbModel.current.position.set(0, -1.5, 0);
    }
  });

  return <group ref={group} />;
}
